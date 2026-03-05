export function moodScoreColor(score: number): string {
  if (score >= 8) return '#10B981';
  if (score >= 6) return '#8B5CF6';
  if (score >= 4) return '#F59E0B';
  return '#EF4444';
}

export function getMoodTailwind(score: number): { text: string; bg: string } {
  if (score >= 8) return { text: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' };
  if (score >= 6) return { text: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' };
  if (score >= 4) return { text: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' };
  return { text: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' };
}

export function sentimentColor(score: number): string {
  if (score > 0.2) return '#10B981';
  if (score < -0.2) return '#EF4444';
  return '#6B7280';
}

export function sentimentLabel(score: number): string {
  if (score > 0.2) return 'Positive';
  if (score < -0.2) return 'Negative';
  return 'Neutral';
}
