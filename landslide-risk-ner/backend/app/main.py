import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import Base, engine, SessionLocal
from app.services.ingestion_service import seed_database_if_empty, run_periodic_ingestion

from app.api.endpoints.locations import router as locations_router
from app.api.endpoints.risk import router as risk_router
from app.api.endpoints.alerts import router as alerts_router
from app.api.endpoints.history import router as history_router
from app.api.endpoints.auth import router as auth_router

# APScheduler is only used outside of serverless environments.
# Vercel functions are stateless and do not support persistent background threads.
IS_SERVERLESS = "VERCEL" in os.environ

if not IS_SERVERLESS:
    from apscheduler.schedulers.background import BackgroundScheduler
    scheduler = BackgroundScheduler()

    def scheduled_telemetry_job():
        db = SessionLocal()
        try:
            run_periodic_ingestion(db)
        except Exception as e:
            print(f"[Scheduler Error] {e}")
        finally:
            db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    print("[FastAPI App] Initializing database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        seed_database_if_empty(db)
    finally:
        db.close()

    if not IS_SERVERLESS:
        # Start background periodic job (recalculates risk every 30 seconds for live demo)
        scheduler.add_job(scheduled_telemetry_job, 'interval', seconds=30, id="periodic_ingestion")
        scheduler.start()
        print("[FastAPI App] Background task scheduler started.")
    else:
        print("[FastAPI App] Serverless environment detected — background scheduler disabled.")

    yield

    # Shutdown actions
    if not IS_SERVERLESS:
        scheduler.shutdown()
        print("[FastAPI App] Task scheduler stopped.")

# Determine allowed CORS origins.
# Set ALLOWED_ORIGINS in your Vercel environment variables as a comma-separated list
# of your production frontend URL(s), e.g. "https://your-app.vercel.app,https://yourdomain.com"
# Falls back to wildcard when not set (safe for local development).
_raw_origins = os.getenv("ALLOWED_ORIGINS", "")
CORS_ORIGINS: list[str] = (
    [o.strip() for o in _raw_origins.split(",") if o.strip()]
    if _raw_origins
    else ["*"]
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(locations_router, prefix=settings.API_V1_STR)
app.include_router(risk_router, prefix=settings.API_V1_STR)
app.include_router(alerts_router, prefix=settings.API_V1_STR)
app.include_router(history_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "SIH26001: AI-Based Landslide Risk Monitoring System (NER) API is active.",
        "docs": "/docs",
        "version": "1.0.0"
    }
