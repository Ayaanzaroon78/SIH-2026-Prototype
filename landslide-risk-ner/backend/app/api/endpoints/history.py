from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.domain import Location, SensorReading, RiskPrediction
from app.schemas.pydantic_schemas import SensorReadingResponse, RiskPredictionResponse

router = APIRouter(prefix="/history", tags=["Historical Data & Time Series"])

@router.get("/{location_id}")
def get_location_history(location_id: int, days: int = 14, db: Session = Depends(get_db)):
    """
    Get historical telemetry (rainfall, soil moisture, seismic) and predicted risk score time series for trend analysis charts.
    """
    location = db.query(Location).filter(Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Location not found")

    readings = (
        db.query(SensorReading)
        .filter(SensorReading.location_id == location_id)
        .order_by(SensorReading.timestamp.asc())
        .all()
    )

    predictions = (
        db.query(RiskPrediction)
        .filter(RiskPrediction.location_id == location_id)
        .order_by(RiskPrediction.timestamp.asc())
        .all()
    )

    # Combine into convenient time-series format for frontend charts
    ts_data = []
    # Map predictions by timestamp string key
    pred_map = {p.timestamp.strftime("%Y-%m-%d %H:%M"): p for p in predictions}

    for r in readings:
        t_key = r.timestamp.strftime("%Y-%m-%d %H:%M")
        matching_pred = pred_map.get(t_key)

        ts_data.append({
            "timestamp": r.timestamp.isoformat(),
            "date": r.timestamp.strftime("%b %d, %H:%M"),
            "rainfall_24h": r.rainfall_24h,
            "rainfall_cumulative_3d": r.rainfall_cumulative_3d,
            "soil_moisture_pct": r.soil_moisture_pct,
            "temperature_c": r.temperature_c,
            "seismic_activity": r.seismic_activity,
            "risk_score": matching_pred.risk_score if matching_pred else None,
            "risk_category": matching_pred.risk_category if matching_pred else None
        })

    return {
        "location_id": location.id,
        "name": location.name,
        "district": location.district,
        "state": location.state,
        "elevation": location.elevation,
        "slope_angle": location.slope_angle,
        "time_series": ts_data
    }
