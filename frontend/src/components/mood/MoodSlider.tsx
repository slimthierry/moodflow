import React from 'react';
import { MOOD_EMOJIS, MOOD_LABELS } from '../../types';

interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  min?: number;
  max?: number;
}

export function MoodSlider({
  value,
  onChange,
  label = 'Mood',
  min = 1,
  max = 10,
}: MoodSliderProps) {
  const emoji = MOOD_EMOJIS[value] || '';
  const moodLabel = MOOD_LABELS[value] || '';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-content-secondary">{label}</label>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <span className="text-sm font-medium text-content-primary">{value}/10</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-primary-500"
      />
      <div className="flex justify-between text-xs text-content-tertiary">
        <span>{MOOD_LABELS[min]}</span>
        <span className="font-medium text-content-secondary">{moodLabel}</span>
        <span>{MOOD_LABELS[max]}</span>
      </div>
    </div>
  );
}
