from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


class MoodSummary(BaseModel):
    average_mood: float
    average_energy: float
    average_anxiety: float
    average_sleep: float
    total_entries: int
    current_streak: int


class MoodTrend(BaseModel):
    date: date
    mood_score: float
    energy_level: Optional[float] = None
    anxiety_level: Optional[float] = None


class RecentEntry(BaseModel):
    id: UUID
    date: date
    mood_score: int
    notes: Optional[str] = None
    created_at: datetime


class DashboardData(BaseModel):
    summary: MoodSummary
    weekly_trend: List[MoodTrend]
    recent_entries: List[RecentEntry]


class InsightReportResponse(BaseModel):
    id: UUID
    user_id: UUID
    period_start: date
    period_end: date
    correlations: Optional[str] = None
    trends: Optional[str] = None
    recommendations: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
