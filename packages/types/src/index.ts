// ============================================================================
// Authentication
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
}

// ============================================================================
// Mood
// ============================================================================

export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' | 'stormy';
export type MoodTagType = 'work' | 'exercise' | 'social' | 'family' | 'health' | 'hobby' | 'travel' | 'food' | 'rest' | 'study';

export interface MoodTag {
  tag: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  date: string;
  mood_score: number;
  energy_level?: number;
  anxiety_level?: number;
  sleep_hours?: number;
  notes?: string;
  weather?: string;
  tags: MoodTag[];
  created_at: string;
}

export interface MoodEntryCreate {
  date: string;
  mood_score: number;
  energy_level?: number;
  anxiety_level?: number;
  sleep_hours?: number;
  notes?: string;
  weather?: string;
  tags: string[];
}

export interface MoodEntryUpdate {
  mood_score?: number;
  energy_level?: number;
  anxiety_level?: number;
  sleep_hours?: number;
  notes?: string;
  weather?: string;
  tags?: string[];
}

// ============================================================================
// Journal
// ============================================================================

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  title: string;
  content: string;
  sentiment_score?: number;
  created_at: string;
}

export interface JournalEntryCreate {
  date: string;
  title: string;
  content: string;
}

export interface JournalEntryUpdate {
  title?: string;
  content?: string;
}

// ============================================================================
// Dashboard
// ============================================================================

export interface MoodSummary {
  average_mood: number;
  average_energy: number;
  average_anxiety: number;
  average_sleep: number;
  total_entries: number;
  current_streak: number;
}

export interface MoodTrend {
  date: string;
  mood_score: number;
  energy_level?: number;
  anxiety_level?: number;
}

export interface RecentEntry {
  id: string;
  date: string;
  mood_score: number;
  notes?: string;
  created_at: string;
}

export interface DashboardData {
  summary: MoodSummary;
  weekly_trend: MoodTrend[];
  recent_entries: RecentEntry[];
}

// ============================================================================
// Insights
// ============================================================================

export interface InsightReport {
  id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  correlations?: string;
  trends?: string;
  recommendations?: string;
  created_at: string;
}

export interface CorrelationData {
  mood_vs_sleep?: number;
  mood_vs_energy?: number;
  mood_vs_anxiety?: number;
  insufficient_data?: boolean;
}

export interface TrendData {
  direction: 'improving' | 'declining' | 'stable';
  first_half_avg: number;
  second_half_avg: number;
  data: { date: string; mood_score: number }[];
}

export interface RecommendationItem {
  category: string;
  title: string;
  description: string;
}

// ============================================================================
// API Response
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// ============================================================================
// Constants
// ============================================================================

export const MOOD_LABELS: Record<number, string> = {
  1: 'Very Bad',
  2: 'Bad',
  3: 'Poor',
  4: 'Below Average',
  5: 'Neutral',
  6: 'Okay',
  7: 'Good',
  8: 'Great',
  9: 'Excellent',
  10: 'Amazing',
};

export const MOOD_EMOJIS: Record<number, string> = {
  1: '\u{1F622}',
  2: '\u{1F61E}',
  3: '\u{1F61F}',
  4: '\u{1F615}',
  5: '\u{1F610}',
  6: '\u{1F642}',
  7: '\u{1F60A}',
  8: '\u{1F603}',
  9: '\u{1F604}',
  10: '\u{1F929}',
};

export const WEATHER_OPTIONS: { value: WeatherType; label: string; icon: string }[] = [
  { value: 'sunny', label: 'Sunny', icon: '\u{2600}\u{FE0F}' },
  { value: 'cloudy', label: 'Cloudy', icon: '\u{2601}\u{FE0F}' },
  { value: 'rainy', label: 'Rainy', icon: '\u{1F327}\u{FE0F}' },
  { value: 'snowy', label: 'Snowy', icon: '\u{2744}\u{FE0F}' },
  { value: 'windy', label: 'Windy', icon: '\u{1F32C}\u{FE0F}' },
  { value: 'stormy', label: 'Stormy', icon: '\u{26C8}\u{FE0F}' },
];

export const TAG_OPTIONS: { value: MoodTagType; label: string }[] = [
  { value: 'work', label: 'Work' },
  { value: 'exercise', label: 'Exercise' },
  { value: 'social', label: 'Social' },
  { value: 'family', label: 'Family' },
  { value: 'health', label: 'Health' },
  { value: 'hobby', label: 'Hobby' },
  { value: 'travel', label: 'Travel' },
  { value: 'food', label: 'Food' },
  { value: 'rest', label: 'Rest' },
  { value: 'study', label: 'Study' },
];

export const SENTIMENT_LABELS: Record<string, { label: string; color: string }> = {
  positive: { label: 'Positive', color: 'text-green-600' },
  neutral: { label: 'Neutral', color: 'text-gray-500' },
  negative: { label: 'Negative', color: 'text-red-600' },
};
