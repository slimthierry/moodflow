from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.security import get_current_user
from app.models.user_models import User
from app.services.dashboard_service import DashboardService

router = APIRouter()


@router.get("")
async def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    dashboard = await DashboardService.get_dashboard(db, current_user.id)
    return {"success": True, "data": dashboard.model_dump()}
