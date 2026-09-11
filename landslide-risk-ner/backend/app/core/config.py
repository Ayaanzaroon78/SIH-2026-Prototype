import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SIH26001: Landslide Risk Monitoring System (NER)"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "sih2026_landslide_ner_secret_key_super_secure"

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:////tmp/landslide_dev.db" if "VERCEL" in os.environ else "sqlite:///./landslide_dev.db"
    )

    # Risk Thresholds
    RISK_THRESHOLD_MODERATE: float = 25.0
    RISK_THRESHOLD_HIGH: float = 50.0
    RISK_THRESHOLD_CRITICAL: float = 75.0

    # Model Artifacts directory
    MODEL_DIR: str = os.getenv(
        "MODEL_DIR",
        os.path.abspath(os.path.join(os.path.dirname(__file__), "../ml_artifacts"))
        if os.path.exists(os.path.abspath(os.path.join(os.path.dirname(__file__), "../ml_artifacts")))
        else os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../ml/model_artifacts"))
    )

    class Config:
        case_sensitive = True

settings = Settings()
