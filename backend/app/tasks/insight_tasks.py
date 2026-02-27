"""
Celery tasks for generating insight reports.

These tasks run asynchronously to compute mood analytics,
correlations, and generate recommendations for users.
"""

from celery import shared_task


@shared_task
def generate_weekly_insights(user_id: str):
    """Generate weekly insight report for a user."""
    # This task would be called by Celery Beat on a weekly schedule.
    # Implementation would create a sync database session and call InsightService.
    pass


@shared_task
def generate_monthly_insights(user_id: str):
    """Generate monthly insight report for a user."""
    pass
