from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class User(BaseModel):
    __tablename__ = "users"

    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)

    mood_entries = relationship("MoodEntry", back_populates="user", lazy="selectin")
    journal_entries = relationship("JournalEntry", back_populates="user", lazy="selectin")
    insight_reports = relationship("InsightReport", back_populates="user", lazy="selectin")
