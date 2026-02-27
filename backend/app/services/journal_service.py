from typing import List, Optional
from uuid import UUID

from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.models.journal_models import JournalEntry
from app.schemas.journal_schemas import JournalEntryCreate, JournalEntryUpdate
from app.utils.sentiment import analyze_sentiment


class JournalService:
    @staticmethod
    async def create_entry(
        db: AsyncSession, user_id: UUID, data: JournalEntryCreate
    ) -> JournalEntry:
        sentiment = analyze_sentiment(data.content)

        entry = JournalEntry(
            user_id=user_id,
            date=data.date,
            title=data.title,
            content=data.content,
            sentiment_score=sentiment,
        )
        db.add(entry)
        await db.flush()
        await db.refresh(entry)
        return entry

    @staticmethod
    async def get_entries(
        db: AsyncSession,
        user_id: UUID,
        limit: int = 50,
        offset: int = 0,
    ) -> List[JournalEntry]:
        result = await db.execute(
            select(JournalEntry)
            .where(JournalEntry.user_id == user_id)
            .order_by(JournalEntry.date.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_entry_by_id(
        db: AsyncSession, user_id: UUID, entry_id: UUID
    ) -> JournalEntry:
        result = await db.execute(
            select(JournalEntry).where(
                and_(JournalEntry.id == entry_id, JournalEntry.user_id == user_id)
            )
        )
        entry = result.scalar_one_or_none()
        if not entry:
            raise NotFoundException("Journal entry not found")
        return entry

    @staticmethod
    async def update_entry(
        db: AsyncSession, user_id: UUID, entry_id: UUID, data: JournalEntryUpdate
    ) -> JournalEntry:
        entry = await JournalService.get_entry_by_id(db, user_id, entry_id)

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(entry, field, value)

        # Re-analyze sentiment if content changed
        if "content" in update_data:
            entry.sentiment_score = analyze_sentiment(entry.content)

        await db.flush()
        await db.refresh(entry)
        return entry

    @staticmethod
    async def delete_entry(db: AsyncSession, user_id: UUID, entry_id: UUID) -> None:
        entry = await JournalService.get_entry_by_id(db, user_id, entry_id)
        await db.delete(entry)
        await db.flush()
