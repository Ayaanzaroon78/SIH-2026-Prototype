from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from app.db.session import Base

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation = Column(Float, nullable=False) # meters
    slope_angle = Column(Float, nullable=False) # degrees

    readings = relationship("SensorReading", back_populates="location", cascade="all, delete-orphan")
    predictions = relationship("RiskPrediction", back_populates="location", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="location", cascade="all, delete-orphan")

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    rainfall_24h = Column(Float, default=0.0)
    rainfall_cumulative_3d = Column(Float, default=0.0)
    rainfall_intensity_trend = Column(Float, default=0.0)
    soil_moisture_pct = Column(Float, default=0.0)
    temperature_c = Column(Float, default=0.0)
    humidity_pct = Column(Float, default=0.0)
    seismic_activity = Column(Float, default=0.0)

    location = relationship("Location", back_populates="readings")

class RiskPrediction(Base):
    __tablename__ = "risk_predictions"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    risk_score = Column(Float, nullable=False)
    risk_category = Column(String(50), nullable=False) # Low, Moderate, High, Critical
    model_version = Column(String(50), default="1.0.0")
    contributing_factors = Column(JSON, nullable=True) # dict of factor importances / weights

    location = relationship("Location", back_populates="predictions")
    alerts = relationship("Alert", back_populates="prediction")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    risk_prediction_id = Column(Integer, ForeignKey("risk_predictions.id"), nullable=True)
    severity = Column(String(50), nullable=False) # Moderate, High, Critical
    message = Column(Text, nullable=False)
    sent_to = Column(String(255), default="NDMA / State Disaster Authority (NER)")
    status = Column(String(50), default="SENT") # SENT, ACKNOWLEDGED, RESOLVED
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    location = relationship("Location", back_populates="alerts")
    prediction = relationship("RiskPrediction", back_populates="alerts")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    role = Column(String(50), default="viewer") # admin, authority, viewer
    phone = Column(String(20), nullable=True)
    assigned_district = Column(String(100), nullable=True)
