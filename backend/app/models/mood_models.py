from sqlalchemy import Column, Date, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class MoodEntry(BaseModel):
    __tablename__ = "mood_entries"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    mood_score = Column(Integer, nullable=False)  # 1-10
    energy_level = Column(Integer, nullable=True)  # 1-10
    anxiety_level = Column(Integer, nullable=True)  # 1-10
    sleep_hours = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    weather = Column(String(50), nullable=True)

    user = relationship("User", back_populates="mood_entries")
    tags = relationship("MoodTag", back_populates="entry", lazy="selectin", cascade="all, delete-orphan")


class MoodTag(BaseModel):
    __tablename__ = "mood_tags"

    entry_id = Column(UUID(as_uuid=True), ForeignKey("mood_entries.id"), nullable=False, index=True)
    tag = Column(String(50), nullable=False)

    entry = relationship("MoodEntry", back_populates="tags")
