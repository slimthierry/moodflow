from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.auth.security import get_current_user
from app.models.user_models import User
from app.schemas.journal_schemas import JournalEntryCreate, JournalEntryResponse, JournalEntryUpdate
from app.services.journal_service import JournalService

router = APIRouter()


@router.post("")
async def create_journal_entry(
    data: JournalEntryCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    entry = await JournalService.create_entry(db, current_user.id, data)
    return {
        "success": True,
        "data": JournalEntryResponse.model_validate(entry).model_dump(),
    }


@router.get("")
async def list_journal_entries(
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    entries = await JournalService.get_entries(db, current_user.id, limit, offset)
    return {
        "success": True,
        "data": [JournalEntryResponse.model_validate(e).model_dump() for e in entries],
    }


@router.get("/{entry_id}")
async def get_journal_entry(
    entry_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    entry = await JournalService.get_entry_by_id(db, current_user.id, entry_id)
    return {
        "success": True,
        "data": JournalEntryResponse.model_validate(entry).model_dump(),
    }


@router.put("/{entry_id}")
async def update_journal_entry(
    entry_id: UUID,
    data: JournalEntryUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    entry = await JournalService.update_entry(db, current_user.id, entry_id, data)
    return {
        "success": True,
        "data": JournalEntryResponse.model_validate(entry).model_dump(),
    }


@router.delete("/{entry_id}")
async def delete_journal_entry(
    entry_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await JournalService.delete_entry(db, current_user.id, entry_id)
    return {"success": True, "message": "Journal entry deleted"}
