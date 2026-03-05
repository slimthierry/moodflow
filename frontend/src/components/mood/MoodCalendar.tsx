import React from 'react';
import type { MoodEntry } from '../../types';
import { getMoodEmoji } from '../../utils';

interface MoodCalendarProps {
  entries: MoodEntry[];
  month: number; // 0-11
  year: number;
}

export function MoodCalendar({ entries, month, year }: MoodCalendarProps) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const entryMap = new Map<string, MoodEntry>();
  entries.forEach((entry) => {
    entryMap.set(entry.date, entry);
  });

  const days = [];
  // Empty cells for days before the first of the month
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const entry = entryMap.get(dateStr);

    days.push(
      <div
        key={day}
        className={`h-10 flex items-center justify-center rounded-lg text-sm transition-colors ${
          entry
            ? 'bg-primary-50 dark:bg-primary-900/20 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/30'
            : 'text-content-tertiary'
        }`}
        title={entry ? `Mood: ${entry.mood_score}/10` : undefined}
      >
        {entry ? (
          <span className="text-lg" title={`${entry.mood_score}/10`}>
            {getMoodEmoji(entry.mood_score)}
          </span>
        ) : (
          <span>{day}</span>
        )}
      </div>
    );
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div>
      <h3 className="text-lg font-semibold text-content-primary mb-4">{monthName}</h3>
      <div className="grid grid-cols-7 gap-1">
        {dayLabels.map((label) => (
          <div key={label} className="h-8 flex items-center justify-center text-xs font-medium text-content-tertiary">
            {label}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
}
