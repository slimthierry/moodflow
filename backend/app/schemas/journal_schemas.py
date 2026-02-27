from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class JournalEntryCreate(BaseModel):
    date: date
    title: str
    content: str


class JournalEntryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class JournalEntryResponse(BaseModel):
    id: UUID
    user_id: UUID
    date: date
    title: str
    content: str
    sentiment_score: Optional[float] = None
    created_at: datetime

    model_config = {"from_attributes": True}
