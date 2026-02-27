from datetime import date, timedelta
from uuid import UUID

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.mood_models import MoodEntry
from app.schemas.dashboard_schemas import (
    DashboardData,
    MoodSummary,
    MoodTrend,
    RecentEntry,
)
from app.services.mood_service import MoodService


class DashboardService:
    @staticmethod
    async def get_dashboard(db: AsyncSession, user_id: UUID) -> DashboardData:
        today = date.today()
        week_ago = today - timedelta(days=7)

        # Summary stats for last 30 days
        thirty_days_ago = today - timedelta(days=30)
        result = await db.execute(
            select(
                func.avg(MoodEntry.mood_score),
                func.avg(MoodEntry.energy_level),
                func.avg(MoodEntry.anxiety_level),
                func.avg(MoodEntry.sleep_hours),
                func.count(MoodEntry.id),
            ).where(
                and_(
                    MoodEntry.user_id == user_id,
                    MoodEntry.date >= thirty_days_ago,
                )
            )
        )
        row = result.one()
        avg_mood = round(float(row[0]), 1) if row[0] else 0.0
        avg_energy = round(float(row[1]), 1) if row[1] else 0.0
        avg_anxiety = round(float(row[2]), 1) if row[2] else 0.0
        avg_sleep = round(float(row[3]), 1) if row[3] else 0.0
        total_entries = row[4] or 0

        streak = await MoodService.get_streak(db, user_id)

        summary = MoodSummary(
            average_mood=avg_mood,
            average_energy=avg_energy,
            average_anxiety=avg_anxiety,
            average_sleep=avg_sleep,
            total_entries=total_entries,
            current_streak=streak,
        )

        # Weekly trend
        result = await db.execute(
            select(
                MoodEntry.date,
                func.avg(MoodEntry.mood_score),
                func.avg(MoodEntry.energy_level),
                func.avg(MoodEntry.anxiety_level),
            )
            .where(
                and_(
                    MoodEntry.user_id == user_id,
                    MoodEntry.date >= week_ago,
                )
            )
            .group_by(MoodEntry.date)
            .order_by(MoodEntry.date)
        )
        weekly_trend = [
            MoodTrend(
                date=row[0],
                mood_score=round(float(row[1]), 1) if row[1] else 0.0,
                energy_level=round(float(row[2]), 1) if row[2] else None,
                anxiety_level=round(float(row[3]), 1) if row[3] else None,
            )
            for row in result.fetchall()
        ]

        # Recent entries
        result = await db.execute(
            select(MoodEntry)
            .where(MoodEntry.user_id == user_id)
            .order_by(MoodEntry.date.desc())
            .limit(5)
        )
        recent_entries = [
            RecentEntry(
                id=entry.id,
                date=entry.date,
                mood_score=entry.mood_score,
                notes=entry.notes,
                created_at=entry.created_at,
            )
            for entry in result.scalars().all()
        ]

        return DashboardData(
            summary=summary,
            weekly_trend=weekly_trend,
            recent_entries=recent_entries,
        )
