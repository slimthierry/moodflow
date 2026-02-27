from fastapi import APIRouter

from app.api.v1 import auth, moods, journal, insights, dashboard

router = APIRouter(prefix="/api/v1")

router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
router.include_router(moods.router, prefix="/moods", tags=["Moods"])
router.include_router(journal.router, prefix="/journal", tags=["Journal"])
router.include_router(insights.router, prefix="/insights", tags=["Insights"])
router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
