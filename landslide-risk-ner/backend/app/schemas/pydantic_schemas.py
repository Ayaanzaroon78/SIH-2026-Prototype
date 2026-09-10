from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

# Location Schemas
class LocationBase(BaseModel):
    name: str
    district: str
    state: str
    latitude: float
    longitude: float
    elevation: float
    slope_angle: float

class LocationCreate(LocationBase):
    pass

class LocationResponse(LocationBase):
    id: int
    current_risk_score: Optional[float] = None
    current_risk_category: Optional[str] = None
    last_updated: Optional[datetime] = None

    class Config:
        from_attributes = True

# Sensor Reading Schemas
class SensorReadingBase(BaseModel):
    rainfall_24h: float = 0.0
    rainfall_cumulative_3d: float = 0.0
    rainfall_intensity_trend: float = 0.0
    soil_moisture_pct: float = 0.0
    temperature_c: float = 0.0
    humidity_pct: float = 0.0
    seismic_activity: float = 0.0

class SensorReadingCreate(SensorReadingBase):
    location_id: int

class SensorReadingResponse(SensorReadingBase):
    id: int
    location_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# Prediction Schemas
class PredictRequest(BaseModel):
    location_id: Optional[int] = None
    rainfall_24h: float
    rainfall_cumulative_3d: float
    rainfall_intensity_trend: float = 0.33
    soil_moisture_pct: float
    slope_angle: float
    elevation: float
    seismic_activity: float = 0.1

class RiskPredictionResponse(BaseModel):
    location_id: Optional[int] = None
    location_name: Optional[str] = None
    timestamp: datetime
    risk_score: float
    risk_category: str
    model_version: str
    contributing_factors: Dict[str, float]

    class Config:
        from_attributes = True

# Alert Schemas
class AlertTriggerRequest(BaseModel):
    location_id: int
    severity: str = "High" # Moderate, High, Critical
    message: Optional[str] = None
    sent_to: Optional[str] = "Disaster Management Authority (NER)"

class AlertResponse(BaseModel):
    id: int
    location_id: int
    location_name: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    risk_prediction_id: Optional[int] = None
    severity: str
    message: str
    sent_to: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Historical Time Series Response
class LocationHistoryResponse(BaseModel):
    location: LocationResponse
    readings: List[SensorReadingResponse]
    predictions: List[RiskPredictionResponse]

# Auth Schemas
class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]
