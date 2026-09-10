from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.domain import User
from app.schemas.pydantic_schemas import LoginRequest, LoginResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """
    Simple role-based login for admin and authority users (demo stub).
    """
    user = db.query(User).filter(User.email == req.email).first()

    # For hackathon demo, accept demo credentials
    if not user:
        if req.email == "admin@ner-landslide.gov.in":
            user_data = {
                "id": 1,
                "name": "NER Disaster Admin",
                "email": "admin@ner-landslide.gov.in",
                "role": "admin",
                "assigned_district": "North Eastern Region"
            }
        else:
            user_data = {
                "id": 2,
                "name": "State Authority Officer",
                "email": req.email,
                "role": "authority",
                "assigned_district": "East Khasi Hills"
            }
    else:
        user_data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "assigned_district": user.assigned_district
        }

    return LoginResponse(
        access_token="sih2026_demo_token_ner_landslide_authority",
        token_type="bearer",
        user=user_data
    )
