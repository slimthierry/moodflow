from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class MoodTagSchema(BaseModel):
    tag: str

    model_config = {"from_attributes": True}


class MoodEntryCreate(BaseModel):
    date: date
    mood_score: int = Field(ge=1, le=10)
    energy_level: Optional[int] = Field(default=None, ge=1, le=10)
    anxiety_level: Optional[int] = Field(default=None, ge=1, le=10)
    sleep_hours: Optional[float] = Field(default=None, ge=0, le=24)
    notes: Optional[str] = None
    weather: Optional[str] = None
    tags: List[str] = []


class MoodEntryUpdate(BaseModel):
    mood_score: Optional[int] = Field(default=None, ge=1, le=10)
    energy_level: Optional[int] = Field(default=None, ge=1, le=10)
    anxiety_level: Optional[int] = Field(default=None, ge=1, le=10)
    sleep_hours: Optional[float] = Field(default=None, ge=0, le=24)
    notes: Optional[str] = None
    weather: Optional[str] = None
    tags: Optional[List[str]] = None


class MoodEntryResponse(BaseModel):
    id: UUID
    user_id: UUID
    date: date
    mood_score: int
    energy_level: Optional[int] = None
    anxiety_level: Optional[int] = None
    sleep_hours: Optional[float] = None
    notes: Optional[str] = None
    weather: Optional[str] = None
    tags: List[MoodTagSchema] = []
    created_at: datetime

    model_config = {"from_attributes": True}
