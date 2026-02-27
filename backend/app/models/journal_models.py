from sqlalchemy import Column, Date, Float, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class JournalEntry(BaseModel):
    __tablename__ = "journal_entries"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    title = Column(String(300), nullable=False)
    content = Column(Text, nullable=False)
    sentiment_score = Column(Float, nullable=True)  # -1.0 to 1.0

    user = relationship("User", back_populates="journal_entries")


class InsightReport(BaseModel):
    __tablename__ = "insight_reports"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    correlations = Column(Text, nullable=True)  # JSON string
    trends = Column(Text, nullable=True)  # JSON string
    recommendations = Column(Text, nullable=True)  # JSON string

    user = relationship("User", back_populates="insight_reports")
