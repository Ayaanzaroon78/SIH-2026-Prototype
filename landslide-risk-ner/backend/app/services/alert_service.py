from datetime import datetime
from sqlalchemy.orm import Session
from app.models.domain import Alert, Location, RiskPrediction
from app.core.config import settings

class AlertService:
    @staticmethod
    def evaluate_and_trigger(db: Session, location: Location, prediction: RiskPrediction):
        """
        Check if risk score crosses HIGH or CRITICAL threshold and trigger notification alerts.
        """
        score = prediction.risk_score
        category = prediction.risk_category

        if category not in ["High", "Critical"]:
            return None

        message = (
            f"ALERT [{category.upper()} LANDSLIDE RISK]: "
            f"Location '{location.name}' ({location.district}, {location.state}) "
            f"has reached a risk score of {score}/100. Immediate monitoring & preventive action advised."
        )

        sent_to = "State Disaster Management Authority (NER) & Local Administration"

        alert = Alert(
            location_id=location.id,
            risk_prediction_id=prediction.id,
            severity=category,
            message=message,
            sent_to=sent_to,
            status="SENT",
            created_at=datetime.utcnow()
        )

        db.add(alert)
        db.commit()
        db.refresh(alert)

        # Dispatch simulated notification logs (Twilio/SendGrid Stubs)
        AlertService._send_simulated_sms(sent_to, message)
        AlertService._send_simulated_email(sent_to, message)

        return alert

    @staticmethod
    def _send_simulated_sms(to_phone: str, message: str):
        print(f"[TWILIO STUB SMS] -> {to_phone}: {message}")

    @staticmethod
    def _send_simulated_email(to_email: str, message: str):
        print(f"[SENDGRID STUB EMAIL] -> {to_email}: {message}")

alert_service = AlertService()
