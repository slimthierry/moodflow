import json
from datetime import date, timedelta
from typing import Optional
from uuid import UUID

from sqlalchemy import select, and_, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.journal_models import InsightReport
from app.models.mood_models import MoodEntry


class InsightService:
    @staticmethod
    async def generate_report(
        db: AsyncSession, user_id: UUID, days: int = 30
    ) -> InsightReport:
        end_date = date.today()
        start_date = end_date - timedelta(days=days)

        # Fetch mood entries for the period
        result = await db.execute(
            select(MoodEntry)
            .where(
                and_(
                    MoodEntry.user_id == user_id,
                    MoodEntry.date >= start_date,
                    MoodEntry.date <= end_date,
                )
            )
            .order_by(MoodEntry.date)
        )
        entries = list(result.scalars().all())

        # Calculate correlations
        correlations = InsightService._calculate_correlations(entries)
        trends = InsightService._calculate_trends(entries)
        recommendations = InsightService._generate_recommendations(entries, correlations, trends)

        report = InsightReport(
            user_id=user_id,
            period_start=start_date,
            period_end=end_date,
            correlations=json.dumps(correlations),
            trends=json.dumps(trends),
            recommendations=json.dumps(recommendations),
        )
        db.add(report)
        await db.flush()
        await db.refresh(report)
        return report

    @staticmethod
    async def get_reports(
        db: AsyncSession, user_id: UUID, limit: int = 10
    ) -> list:
        result = await db.execute(
            select(InsightReport)
            .where(InsightReport.user_id == user_id)
            .order_by(InsightReport.created_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

    @staticmethod
    def _calculate_correlations(entries: list) -> dict:
        if len(entries) < 3:
            return {"insufficient_data": True}

        mood_sleep_pairs = [
            (e.mood_score, e.sleep_hours)
            for e in entries
            if e.sleep_hours is not None
        ]

        mood_energy_pairs = [
            (e.mood_score, e.energy_level)
            for e in entries
            if e.energy_level is not None
        ]

        mood_anxiety_pairs = [
            (e.mood_score, e.anxiety_level)
            for e in entries
            if e.anxiety_level is not None
        ]

        correlations = {}

        if len(mood_sleep_pairs) >= 3:
            correlations["mood_vs_sleep"] = InsightService._pearson_r(mood_sleep_pairs)

        if len(mood_energy_pairs) >= 3:
            correlations["mood_vs_energy"] = InsightService._pearson_r(mood_energy_pairs)

        if len(mood_anxiety_pairs) >= 3:
            correlations["mood_vs_anxiety"] = InsightService._pearson_r(mood_anxiety_pairs)

        return correlations

    @staticmethod
    def _calculate_trends(entries: list) -> dict:
        if len(entries) < 2:
            return {"direction": "stable", "data": []}

        mood_scores = [e.mood_score for e in entries]
        mid = len(mood_scores) // 2
        first_half_avg = sum(mood_scores[:mid]) / mid if mid > 0 else 0
        second_half_avg = sum(mood_scores[mid:]) / (len(mood_scores) - mid) if (len(mood_scores) - mid) > 0 else 0

        if second_half_avg > first_half_avg + 0.5:
            direction = "improving"
        elif second_half_avg < first_half_avg - 0.5:
            direction = "declining"
        else:
            direction = "stable"

        return {
            "direction": direction,
            "first_half_avg": round(first_half_avg, 1),
            "second_half_avg": round(second_half_avg, 1),
            "data": [
                {"date": str(e.date), "mood_score": e.mood_score}
                for e in entries
            ],
        }

    @staticmethod
    def _generate_recommendations(entries: list, correlations: dict, trends: dict) -> list:
        recommendations = []

        if not entries:
            recommendations.append({
                "category": "general",
                "title": "Start tracking your mood",
                "description": "Log your mood daily to get personalized insights and recommendations.",
            })
            return recommendations

        avg_mood = sum(e.mood_score for e in entries) / len(entries)

        if avg_mood < 5:
            recommendations.append({
                "category": "wellness",
                "title": "Consider self-care activities",
                "description": "Your average mood has been on the lower side. Try incorporating activities that bring you joy.",
            })

        sleep_entries = [e for e in entries if e.sleep_hours is not None]
        if sleep_entries:
            avg_sleep = sum(e.sleep_hours for e in sleep_entries) / len(sleep_entries)
            if avg_sleep < 7:
                recommendations.append({
                    "category": "sleep",
                    "title": "Improve your sleep habits",
                    "description": f"Your average sleep is {avg_sleep:.1f} hours. Aim for 7-9 hours for better mood.",
                })

        anxiety_entries = [e for e in entries if e.anxiety_level is not None]
        if anxiety_entries:
            avg_anxiety = sum(e.anxiety_level for e in anxiety_entries) / len(anxiety_entries)
            if avg_anxiety > 6:
                recommendations.append({
                    "category": "anxiety",
                    "title": "Practice relaxation techniques",
                    "description": "Your anxiety levels have been elevated. Consider meditation or deep breathing exercises.",
                })

        if correlations.get("mood_vs_sleep") and correlations["mood_vs_sleep"] > 0.5:
            recommendations.append({
                "category": "correlation",
                "title": "Sleep strongly affects your mood",
                "description": "There is a strong positive correlation between your sleep and mood. Prioritize good sleep hygiene.",
            })

        return recommendations

    @staticmethod
    def _pearson_r(pairs: list) -> float:
        n = len(pairs)
        if n < 2:
            return 0.0

        sum_x = sum(p[0] for p in pairs)
        sum_y = sum(p[1] for p in pairs)
        sum_xy = sum(p[0] * p[1] for p in pairs)
        sum_x2 = sum(p[0] ** 2 for p in pairs)
        sum_y2 = sum(p[1] ** 2 for p in pairs)

        numerator = n * sum_xy - sum_x * sum_y
        denominator = ((n * sum_x2 - sum_x ** 2) * (n * sum_y2 - sum_y ** 2)) ** 0.5

        if denominator == 0:
            return 0.0

        return round(numerator / denominator, 3)
