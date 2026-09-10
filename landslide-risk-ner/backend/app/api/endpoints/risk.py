from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.domain import Location, RiskPrediction, SensorReading
from app.schemas.pydantic_schemas import RiskPredictionResponse, PredictRequest
from app.services.ml_service import ml_engine
from app.services.alert_service import alert_service

router = APIRouter(prefix="/risk", tags=["Risk Analysis & ML Engine"])

@router.get("/current", response_model=List[dict])
def get_current_risk_scores(db: Session = Depends(get_db)):
    """
    Get current real-time risk scores, categories, and coordinates for all locations (for interactive map display).
    """
    locations = db.query(Location).all()
    results = []

    for loc in locations:
        latest_pred = (
            db.query(RiskPrediction)
            .filter(RiskPrediction.location_id == loc.id)
            .order_by(RiskPrediction.timestamp.desc())
            .first()
        )

        latest_sensor = (
            db.query(SensorReading)
            .filter(SensorReading.location_id == loc.id)
            .order_by(SensorReading.timestamp.desc())
            .first()
        )

        results.append({
            "location_id": loc.id,
            "location_name": loc.name,
            "district": loc.district,
            "state": loc.state,
            "latitude": loc.latitude,
            "longitude": loc.longitude,
            "elevation": loc.elevation,
            "slope_angle": loc.slope_angle,
            "risk_score": latest_pred.risk_score if latest_pred else 0.0,
            "risk_category": latest_pred.risk_category if latest_pred else "Low",
            "contributing_factors": latest_pred.contributing_factors if latest_pred else {},
            "last_updated": latest_pred.timestamp.isoformat() if latest_pred else datetime.utcnow().isoformat(),
            "telemetry": {
                "rainfall_24h": latest_sensor.rainfall_24h if latest_sensor else 0.0,
                "rainfall_cumulative_3d": latest_sensor.rainfall_cumulative_3d if latest_sensor else 0.0,
                "soil_moisture_pct": latest_sensor.soil_moisture_pct if latest_sensor else 0.0,
                "seismic_activity": latest_sensor.seismic_activity if latest_sensor else 0.0
            }
        })

    return results

@router.post("/predict", response_model=RiskPredictionResponse)
def predict_landslide_risk(req: PredictRequest, db: Session = Depends(get_db)):
    """
    Run custom inference model for live telemetry values and return risk score, category, and feature explanations.
    Optionally stores prediction and checks for alert triggers if location_id is provided.
    """
    pred_res = ml_engine.predict(
        rainfall_24h=req.rainfall_24h,
        rainfall_cumulative_3d=req.rainfall_cumulative_3d,
        rainfall_intensity_trend=req.rainfall_intensity_trend,
        soil_moisture_pct=req.soil_moisture_pct,
        slope_angle=req.slope_angle,
        elevation=req.elevation,
        seismic_activity=req.seismic_activity
    )

    loc_name = "Custom Location"
    if req.location_id:
        location = db.query(Location).filter(Location.id == req.location_id).first()
        if location:
            loc_name = location.name

            # Save prediction to DB
            rp = RiskPrediction(
                location_id=location.id,
                risk_score=pred_res["risk_score"],
                risk_category=pred_res["risk_category"],
                model_version=pred_res["model_version"],
                contributing_factors=pred_res["contributing_factors"]
            )
            db.add(rp)
            db.commit()
            db.refresh(rp)

            # Evaluate alert trigger
            alert_service.evaluate_and_trigger(db, location, rp)

    return RiskPredictionResponse(
        location_id=req.location_id,
        location_name=loc_name,
        timestamp=datetime.utcnow(),
        risk_score=pred_res["risk_score"],
        risk_category=pred_res["risk_category"],
        model_version=pred_res["model_version"],
        contributing_factors=pred_res["contributing_factors"]
    )
