from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.domain import Alert, Location, RiskPrediction
from app.schemas.pydantic_schemas import AlertResponse, AlertTriggerRequest

router = APIRouter(prefix="/alerts", tags=["Alerts & Warnings"])

@router.get("", response_model=List[AlertResponse])
def get_alerts(
    severity: Optional[str] = Query(None, description="Filter by severity: Moderate, High, Critical"),
    db: Session = Depends(get_db)
):
    """
    Get list of all triggered risk alerts, sorted by newest first.
    """
    query = db.query(Alert)
    if severity:
        query = query.filter(Alert.severity.ilike(severity))

    alerts = query.order_by(Alert.created_at.desc()).limit(100).all()
    results = []

    for alert in alerts:
        loc = alert.location
        results.append(AlertResponse(
            id=alert.id,
            location_id=alert.location_id,
            location_name=loc.name if loc else "Unknown Location",
            district=loc.district if loc else "N/A",
            state=loc.state if loc else "N/A",
            risk_prediction_id=alert.risk_prediction_id,
            severity=alert.severity,
            message=alert.message,
            sent_to=alert.sent_to,
            status=alert.status,
            created_at=alert.created_at
        ))

    return results

@router.post("/trigger", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
def manual_trigger_alert(req: AlertTriggerRequest, db: Session = Depends(get_db)):
    """
    Manually trigger/test a emergency landslide alert (for live hackathon demo).
    """
    location = db.query(Location).filter(Location.id == req.location_id).first()
    if not location:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Location not found")

    message = req.message or (
        f"MANUAL DEMO ALERT [{req.severity.upper()} LANDSLIDE RISK]: "
        f"Emergency warning simulation for '{location.name}', {location.district}, {location.state}. "
        f"Evacuation & Monitoring protocols activated."
    )

    # Get latest prediction id if available
    latest_pred = (
        db.query(RiskPrediction)
        .filter(RiskPrediction.location_id == location.id)
        .order_by(RiskPrediction.timestamp.desc())
        .first()
    )

    alert = Alert(
        location_id=location.id,
        risk_prediction_id=latest_pred.id if latest_pred else None,
        severity=req.severity,
        message=message,
        sent_to=req.sent_to,
        status="SENT",
        created_at=datetime.utcnow()
    )

    db.add(alert)
    db.commit()
    db.refresh(alert)

    print(f"[DEMO MANUAL ALERT DISPATCHED] -> {location.name}: {message}")

    return AlertResponse(
        id=alert.id,
        location_id=alert.location_id,
        location_name=location.name,
        district=location.district,
        state=location.state,
        risk_prediction_id=alert.risk_prediction_id,
        severity=alert.severity,
        message=alert.message,
        sent_to=alert.sent_to,
        status=alert.status,
        created_at=alert.created_at
    )
