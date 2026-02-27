"""Utility functions for mood analytics and calculations."""

from typing import List, Optional, Tuple


def calculate_moving_average(values: List[float], window: int = 7) -> List[float]:
    """Calculate a simple moving average over a window of values."""
    if len(values) < window:
        return values

    result = []
    for i in range(len(values)):
        start = max(0, i - window + 1)
        subset = values[start:i + 1]
        result.append(round(sum(subset) / len(subset), 2))
    return result


def mood_score_to_label(score: int) -> str:
    """Convert a mood score (1-10) to a human-readable label."""
    labels = {
        1: "Very Bad",
        2: "Bad",
        3: "Poor",
        4: "Below Average",
        5: "Neutral",
        6: "Okay",
        7: "Good",
        8: "Great",
        9: "Excellent",
        10: "Amazing",
    }
    return labels.get(score, "Unknown")


def mood_score_to_emoji(score: int) -> str:
    """Convert a mood score (1-10) to an emoji representation."""
    emojis = {
        1: "😢",
        2: "😞",
        3: "😟",
        4: "😕",
        5: "😐",
        6: "🙂",
        7: "😊",
        8: "😃",
        9: "😄",
        10: "🤩",
    }
    return emojis.get(score, "❓")


def calculate_consistency_score(dates: List[str], total_days: int) -> float:
    """Calculate how consistently a user has been logging moods.
    Returns a percentage (0-100).
    """
    if total_days == 0:
        return 0.0
    unique_dates = len(set(dates))
    return round(min(unique_dates / total_days * 100, 100), 1)


def detect_pattern(scores: List[int], threshold: float = 1.5) -> Optional[str]:
    """Detect if there is an upward, downward, or cyclic pattern."""
    if len(scores) < 5:
        return None

    diffs = [scores[i + 1] - scores[i] for i in range(len(scores) - 1)]
    avg_diff = sum(diffs) / len(diffs)

    if avg_diff > threshold / len(diffs):
        return "upward"
    elif avg_diff < -threshold / len(diffs):
        return "downward"
    return "stable"
