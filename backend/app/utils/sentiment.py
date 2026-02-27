"""Simple sentiment analysis utility for journal entries."""

# Positive and negative word lists for basic sentiment analysis
POSITIVE_WORDS = {
    "happy", "joy", "great", "wonderful", "amazing", "good", "love",
    "excited", "grateful", "peaceful", "calm", "content", "proud",
    "accomplished", "motivated", "energetic", "hopeful", "optimistic",
    "cheerful", "delighted", "blessed", "thankful", "inspired",
    "relaxed", "confident", "strong", "healthy", "beautiful",
}

NEGATIVE_WORDS = {
    "sad", "angry", "anxious", "worried", "stressed", "tired",
    "frustrated", "depressed", "lonely", "scared", "overwhelmed",
    "exhausted", "irritated", "disappointed", "hopeless", "miserable",
    "nervous", "upset", "hurt", "painful", "terrible", "awful",
    "bad", "horrible", "dreadful", "gloomy", "unhappy", "afraid",
}


def analyze_sentiment(text: str) -> float:
    """
    Analyze the sentiment of a text and return a score between -1.0 and 1.0.

    -1.0 = very negative
     0.0 = neutral
     1.0 = very positive

    This is a simple word-based approach. For production use,
    consider integrating a proper NLP model or API.
    """
    if not text:
        return 0.0

    words = text.lower().split()
    total_words = len(words)

    if total_words == 0:
        return 0.0

    positive_count = sum(1 for word in words if word.strip(".,!?;:") in POSITIVE_WORDS)
    negative_count = sum(1 for word in words if word.strip(".,!?;:") in NEGATIVE_WORDS)

    sentiment_words = positive_count + negative_count

    if sentiment_words == 0:
        return 0.0

    score = (positive_count - negative_count) / sentiment_words
    return round(max(-1.0, min(1.0, score)), 3)
