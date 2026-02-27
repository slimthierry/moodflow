from datetime import date
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.security import get_current_user
from app.models.user_models import User
from app.schemas.mood_schemas import MoodEntryCreate, MoodEntryResponse, MoodEntryUpdate
from app.services.mood_service import MoodService

router = APIRouter()


@router.post("")
async def create_mood_entry(
    data: MoodEntryCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    entry = await MoodService.create_entry(db, current_user.id, data)
    return {
        "success": True,
        "data": MoodEntryResponse.model_validate(entry).model_dump(),
    }


@router.get("")
async def list_mood_entries(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    entries = await MoodService.get_entries(
        db, current_user.id, start_date, end_date, limit, offset
    )
    return {
        "success": True,
        "data": [MoodEntryResponse.model_validate(e).model_dump() for e in entries],
    }


@router.get("/{entry_id}")
async def get_mood_entry(
    entry_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    entry = await MoodService.get_entry_by_id(db, current_user.id, entry_id)
    return {
        "success": True,
        "data": MoodEntryResponse.model_validate(entry).model_dump(),
    }


@router.put("/{entry_id}")
async def update_mood_entry(
    entry_id: UUID,
    data: MoodEntryUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    entry = await MoodService.update_entry(db, current_user.id, entry_id, data)
    return {
        "success": True,
        "data": MoodEntryResponse.model_validate(entry).model_dump(),
    }


@router.delete("/{entry_id}")
async def delete_mood_entry(
    entry_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await MoodService.delete_entry(db, current_user.id, entry_id)
    return {"success": True, "message": "Mood entry deleted"}
