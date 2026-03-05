from datetime import date
from typing import List, Optional
from uuid import UUID

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.auth.exceptions import NotFoundException
from app.models.mood_models import MoodEntry, MoodTag
from app.schemas.mood_schemas import MoodEntryCreate, MoodEntryUpdate


class MoodService:
    @staticmethod
    async def create_entry(
        db: AsyncSession, user_id: UUID, data: MoodEntryCreate
    ) -> MoodEntry:
        entry = MoodEntry(
            user_id=user_id,
            date=data.date,
            mood_score=data.mood_score,
            energy_level=data.energy_level,
            anxiety_level=data.anxiety_level,
            sleep_hours=data.sleep_hours,
            notes=data.notes,
            weather=data.weather,
        )
        db.add(entry)
        await db.flush()

        for tag_name in data.tags:
            tag = MoodTag(entry_id=entry.id, tag=tag_name)
            db.add(tag)

        await db.flush()
        await db.refresh(entry)
        return entry

    @staticmethod
    async def get_entries(
        db: AsyncSession,
        user_id: UUID,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[MoodEntry]:
        query = (
            select(MoodEntry)
            .options(selectinload(MoodEntry.tags))
            .where(MoodEntry.user_id == user_id)
            .order_by(MoodEntry.date.desc())
        )

        if start_date:
            query = query.where(MoodEntry.date >= start_date)
        if end_date:
            query = query.where(MoodEntry.date <= end_date)

        query = query.limit(limit).offset(offset)
        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def get_entry_by_id(
        db: AsyncSession, user_id: UUID, entry_id: UUID
    ) -> MoodEntry:
        result = await db.execute(
            select(MoodEntry)
            .options(selectinload(MoodEntry.tags))
            .where(
                and_(MoodEntry.id == entry_id, MoodEntry.user_id == user_id)
            )
        )
        entry = result.scalar_one_or_none()
        if not entry:
            raise NotFoundException("Mood entry not found")
        return entry

    @staticmethod
    async def update_entry(
        db: AsyncSession, user_id: UUID, entry_id: UUID, data: MoodEntryUpdate
    ) -> MoodEntry:
        entry = await MoodService.get_entry_by_id(db, user_id, entry_id)

        update_data = data.model_dump(exclude_unset=True)
        tags = update_data.pop("tags", None)

        for field, value in update_data.items():
            setattr(entry, field, value)

        if tags is not None:
            # Remove existing tags
            for tag in entry.tags:
                await db.delete(tag)
            # Add new tags
            for tag_name in tags:
                tag = MoodTag(entry_id=entry.id, tag=tag_name)
                db.add(tag)

        await db.flush()
        await db.refresh(entry)
        return entry

    @staticmethod
    async def delete_entry(db: AsyncSession, user_id: UUID, entry_id: UUID) -> None:
        entry = await MoodService.get_entry_by_id(db, user_id, entry_id)
        await db.delete(entry)
        await db.flush()

    @staticmethod
    async def get_streak(db: AsyncSession, user_id: UUID) -> int:
        """Calculate the current consecutive days streak."""
        result = await db.execute(
            select(MoodEntry.date)
            .where(MoodEntry.user_id == user_id)
            .order_by(MoodEntry.date.desc())
            .distinct()
        )
        dates = [row[0] for row in result.fetchall()]

        if not dates:
            return 0

        streak = 1
        for i in range(1, len(dates)):
            diff = (dates[i - 1] - dates[i]).days
            if diff == 1:
                streak += 1
            else:
                break

        return streak

    @staticmethod
    async def get_average_mood(
        db: AsyncSession, user_id: UUID, days: int = 7
    ) -> Optional[float]:
        from datetime import timedelta

        start = date.today() - timedelta(days=days)
        result = await db.execute(
            select(func.avg(MoodEntry.mood_score))
            .where(
                and_(
                    MoodEntry.user_id == user_id,
                    MoodEntry.date >= start,
                )
            )
        )
        avg = result.scalar()
        return round(float(avg), 1) if avg else None
