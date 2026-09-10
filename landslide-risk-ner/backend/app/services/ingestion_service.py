import os
import json
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.domain import Location, SensorReading, RiskPrediction, User
from app.services.ml_service import ml_engine
from app.services.alert_service import alert_service

def seed_database_if_empty(db: Session):
    """
    Populates locations, initial sensor readings, and users if DB is empty.
    """
    if db.query(Location).count() > 0:
        return

    print("[Ingestion Service] Seeding initial database with NER locations and historical data...")

    # Load location profiles
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../ml"))
    loc_file = os.path.join(base_dir, "ner_locations.json")

    if os.path.exists(loc_file):
        with open(loc_file, "r") as f:
            locations_data = json.load(f)
    else:
        locations_data = [
            {"name": "Shillong Peak", "district": "East Khasi Hills", "state": "Meghalaya", "latitude": 25.5788, "longitude": 91.8933, "elevation": 1525, "slope_angle": 34.5},
            {"name": "Cherrapunji (Sohra)", "district": "East Khasi Hills", "state": "Meghalaya", "latitude": 25.2702, "longitude": 91.7323, "elevation": 1430, "slope_angle": 42.0},
            {"name": "Gangtok Ridge", "district": "East Sikkim", "state": "Sikkim", "latitude": 27.3389, "longitude": 88.6065, "elevation": 1650, "slope_angle": 38.0},
            {"name": "Mangan North Slope", "district": "North Sikkim", "state": "Sikkim", "latitude": 27.5042, "longitude": 88.5364, "elevation": 1310, "slope_angle": 48.5},
            {"name": "Itanagar Hills", "district": "Papum Pare", "state": "Arunachal Pradesh", "latitude": 27.0844, "longitude": 93.6053, "elevation": 320, "slope_angle": 28.0},
            {"name": "Aizawl Ridge", "district": "Aizawl", "state": "Mizoram", "latitude": 23.7271, "longitude": 92.7176, "elevation": 1132, "slope_angle": 40.2},
            {"name": "Kohima Town Slope", "district": "Kohima", "state": "Nagaland", "latitude": 25.6751, "longitude": 94.1086, "elevation": 1444, "slope_angle": 35.5},
        ]

    db_locations = []
    for loc in locations_data:
        location_obj = Location(
            name=loc["name"],
            district=loc["district"],
            state=loc["state"],
            latitude=loc["latitude"],
            longitude=loc["longitude"],
            elevation=loc["elevation"],
            slope_angle=loc["slope_angle"]
        )
        db.add(location_obj)
        db_locations.append(location_obj)

    db.commit()
    for l in db_locations:
        db.refresh(l)

    # Seed Default Users
    admin_user = User(
        name="NER Disaster Admin",
        email="admin@ner-landslide.gov.in",
        role="admin",
        phone="+91-9876543210",
        assigned_district="North Eastern Region"
    )
    db.add(admin_user)
    db.commit()

    # Seed historical 7 days readings & predictions
    now = datetime.utcnow()
    for loc in db_locations:
        for d in range(7, -1, -1):
            reading_time = now - timedelta(days=d)

            rainfall_24h = random.uniform(15.0, 140.0) if (d % 3 == 0) else random.uniform(2.0, 35.0)
            rainfall_3d = rainfall_24h * random.uniform(1.8, 2.8)
            trend = round(rainfall_24h / (rainfall_3d + 1.0), 3)
            soil_moisture = random.uniform(45.0, 92.0)
            temp = round(26.0 - (loc.elevation / 200.0), 1)
            humidity = round(min(100.0, 60.0 + soil_moisture * 0.3), 1)
            seismic = round(random.uniform(0.0, 0.4), 2)

            sr = SensorReading(
                location_id=loc.id,
                timestamp=reading_time,
                rainfall_24h=round(rainfall_24h, 2),
                rainfall_cumulative_3d=round(rainfall_3d, 2),
                rainfall_intensity_trend=trend,
                soil_moisture_pct=round(soil_moisture, 2),
                temperature_c=temp,
                humidity_pct=humidity,
                seismic_activity=seismic
            )
            db.add(sr)
            db.commit()
            db.refresh(sr)

            # Predict risk
            pred_res = ml_engine.predict(
                rainfall_24h=sr.rainfall_24h,
                rainfall_cumulative_3d=sr.rainfall_cumulative_3d,
                rainfall_intensity_trend=sr.rainfall_intensity_trend,
                soil_moisture_pct=sr.soil_moisture_pct,
                slope_angle=loc.slope_angle,
                elevation=loc.elevation,
                seismic_activity=sr.seismic_activity
            )

            rp = RiskPrediction(
                location_id=loc.id,
                timestamp=reading_time,
                risk_score=pred_res["risk_score"],
                risk_category=pred_res["risk_category"],
                model_version=pred_res["model_version"],
                contributing_factors=pred_res["contributing_factors"]
            )
            db.add(rp)
            db.commit()
            db.refresh(rp)

            # Trigger alert for high/critical if recent
            if d == 0:
                alert_service.evaluate_and_trigger(db, loc, rp)

    print("[Ingestion Service] Seeding complete.")

def run_periodic_ingestion(db: Session):
    """
    Periodic job triggered by APScheduler or background task to refresh readings & predictions.
    """
    locations = db.query(Location).all()
    now = datetime.utcnow()

    for loc in locations:
        # Simulate slight changes in current telemetry
        last_reading = db.query(SensorReading).filter(SensorReading.location_id == loc.id).order_by(SensorReading.timestamp.desc()).first()

        prev_rain_24h = last_reading.rainfall_24h if last_reading else 20.0
        prev_soil = last_reading.soil_moisture_pct if last_reading else 50.0

        new_rain_24h = max(0.0, round(prev_rain_24h + random.uniform(-15.0, 25.0), 2))
        new_rain_3d = max(new_rain_24h, round(new_rain_24h * random.uniform(1.5, 2.5), 2))
        trend = round(new_rain_24h / (new_rain_3d + 1.0), 3)

        if new_rain_24h > 40.0:
            new_soil = min(98.0, round(prev_soil + random.uniform(2.0, 8.0), 2))
        else:
            new_soil = max(20.0, round(prev_soil - random.uniform(1.0, 3.0), 2))

        temp = round(26.0 - (loc.elevation / 200.0) + random.uniform(-1.0, 1.0), 1)
        humidity = round(min(100.0, 60.0 + new_soil * 0.35), 1)
        seismic = round(random.uniform(0.0, 0.5), 2)

        sr = SensorReading(
            location_id=loc.id,
            timestamp=now,
            rainfall_24h=new_rain_24h,
            rainfall_cumulative_3d=new_rain_3d,
            rainfall_intensity_trend=trend,
            soil_moisture_pct=new_soil,
            temperature_c=temp,
            humidity_pct=humidity,
            seismic_activity=seismic
        )
        db.add(sr)
        db.commit()

        # Run ML Prediction
        pred_res = ml_engine.predict(
            rainfall_24h=sr.rainfall_24h,
            rainfall_cumulative_3d=sr.rainfall_cumulative_3d,
            rainfall_intensity_trend=sr.rainfall_intensity_trend,
            soil_moisture_pct=sr.soil_moisture_pct,
            slope_angle=loc.slope_angle,
            elevation=loc.elevation,
            seismic_activity=sr.seismic_activity
        )

        rp = RiskPrediction(
            location_id=loc.id,
            timestamp=now,
            risk_score=pred_res["risk_score"],
            risk_category=pred_res["risk_category"],
            model_version=pred_res["model_version"],
            contributing_factors=pred_res["contributing_factors"]
        )
        db.add(rp)
        db.commit()
        db.refresh(rp)

        alert_service.evaluate_and_trigger(db, loc, rp)

    print(f"[Scheduled Job] Refreshed telemetry and predictions for {len(locations)} locations at {now.isoformat()}")
