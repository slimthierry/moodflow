import React from 'react';
import type { MoodTrend } from '@moodflow/types';
import { moodScoreColor } from '@moodflow/utils';

interface MoodChartProps {
  data: MoodTrend[];
  height?: number;
}

export function MoodChart({ data, height = 200 }: MoodChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-content-tertiary text-sm"
        style={{ height }}
      >
        No mood data available yet. Start tracking to see your chart.
      </div>
    );
  }

  const maxScore = 10;
  const barWidth = Math.max(20, Math.min(60, (100 / data.length)));

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-end justify-between h-full gap-1 px-2">
        {data.map((point, index) => {
          const barHeight = (point.mood_score / maxScore) * 100;
          const color = moodScoreColor(point.mood_score);
          const dateLabel = new Date(point.date).toLocaleDateString('en-US', {
            weekday: 'short',
          });

          return (
            <div
              key={index}
              className="flex flex-col items-center gap-1 flex-1"
            >
              <span className="text-xs font-medium text-content-secondary">
                {point.mood_score}
              </span>
              <div
                className="w-full rounded-t-md transition-all duration-300 min-w-[20px]"
                style={{
                  height: `${barHeight}%`,
                  backgroundColor: color,
                  maxWidth: `${barWidth}px`,
                }}
              />
              <span className="text-xs text-content-tertiary">{dateLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
