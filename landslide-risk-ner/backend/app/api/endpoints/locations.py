from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.domain import Location, RiskPrediction, SensorReading
from app.schemas.pydantic_schemas import LocationResponse, LocationCreate, LocationHistoryResponse
from app.services.ml_service import ml_engine

router = APIRouter(prefix="/locations", tags=["Locations"])

@router.get("", response_model=List[LocationResponse])
def get_locations(db: Session = Depends(get_db)):
    """
    Get all monitored locations in the North Eastern Region with their latest risk scores.
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

        risk_score = latest_pred.risk_score if latest_pred else 0.0
        risk_category = latest_pred.risk_category if latest_pred else "Low"
        last_updated = latest_pred.timestamp if latest_pred else None

        loc_resp = LocationResponse(
            id=loc.id,
            name=loc.name,
            district=loc.district,
            state=loc.state,
            latitude=loc.latitude,
            longitude=loc.longitude,
            elevation=loc.elevation,
            slope_angle=loc.slope_angle,
            current_risk_score=risk_score,
            current_risk_category=risk_category,
            last_updated=last_updated
        )
        results.append(loc_resp)

    return results

@router.get("/{location_id}", response_model=LocationHistoryResponse)
def get_location_detail(location_id: int, db: Session = Depends(get_db)):
    """
    Get detailed location information along with recent sensor readings and prediction history.
    """
    location = db.query(Location).filter(Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Location not found")

    latest_pred = (
        db.query(RiskPrediction)
        .filter(RiskPrediction.location_id == location.id)
        .order_by(RiskPrediction.timestamp.desc())
        .first()
    )

    loc_resp = LocationResponse(
        id=location.id,
        name=location.name,
        district=location.district,
        state=location.state,
        latitude=location.latitude,
        longitude=location.longitude,
        elevation=location.elevation,
        slope_angle=location.slope_angle,
        current_risk_score=latest_pred.risk_score if latest_pred else 0.0,
        current_risk_category=latest_pred.risk_category if latest_pred else "Low",
        last_updated=latest_pred.timestamp if latest_pred else None
    )

    readings = (
        db.query(SensorReading)
        .filter(SensorReading.location_id == location_id)
        .order_by(SensorReading.timestamp.desc())
        .limit(30)
        .all()
    )

    predictions = (
        db.query(RiskPrediction)
        .filter(RiskPrediction.location_id == location_id)
        .order_by(RiskPrediction.timestamp.desc())
        .limit(30)
        .all()
    )

    return {
        "location": loc_resp,
        "readings": readings,
        "predictions": predictions
    }

@router.post("", response_model=LocationResponse, status_code=status.HTTP_201_CREATED)
def create_location(location_in: LocationCreate, db: Session = Depends(get_db)):
    """
    Add a new geographical location in NER for landslide monitoring.
    """
    new_loc = Location(**location_in.model_dump())
    db.add(new_loc)
    db.commit()
    db.refresh(new_loc)

    # Run initial baseline prediction
    baseline_pred = ml_engine.predict(
        rainfall_24h=10.0,
        rainfall_cumulative_3d=25.0,
        rainfall_intensity_trend=0.3,
        soil_moisture_pct=40.0,
        slope_angle=new_loc.slope_angle,
        elevation=new_loc.elevation,
        seismic_activity=0.1
    )

    rp = RiskPrediction(
        location_id=new_loc.id,
        risk_score=baseline_pred["risk_score"],
        risk_category=baseline_pred["risk_category"],
        model_version=baseline_pred["model_version"],
        contributing_factors=baseline_pred["contributing_factors"]
    )
    db.add(rp)
    db.commit()

    return LocationResponse(
        id=new_loc.id,
        name=new_loc.name,
        district=new_loc.district,
        state=new_loc.state,
        latitude=new_loc.latitude,
        longitude=new_loc.longitude,
        elevation=new_loc.elevation,
        slope_angle=new_loc.slope_angle,
        current_risk_score=baseline_pred["risk_score"],
        current_risk_category=baseline_pred["risk_category"],
        last_updated=rp.timestamp
    )
