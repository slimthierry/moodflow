from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.auth.security import get_current_user
from app.models.user_models import User
from app.schemas.dashboard_schemas import InsightReportResponse
from app.services.insight_service import InsightService

router = APIRouter()


@router.post("/generate")
async def generate_insight_report(
    days: int = Query(30, ge=7, le=90),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    report = await InsightService.generate_report(db, current_user.id, days)
    return {
        "success": True,
        "data": InsightReportResponse.model_validate(report).model_dump(),
    }


@router.get("")
async def list_insight_reports(
    limit: int = Query(10, le=50),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    reports = await InsightService.get_reports(db, current_user.id, limit)
    return {
        "success": True,
        "data": [InsightReportResponse.model_validate(r).model_dump() for r in reports],
    }
