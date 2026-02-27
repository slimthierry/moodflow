import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateMoodEntry } from '@moodflow/api-client';
import { MoodSlider } from '@moodflow/ui';
import { WEATHER_OPTIONS, TAG_OPTIONS } from '@moodflow/types';

export default function MoodEntryPage() {
  const navigate = useNavigate();
  const createMutation = useCreateMoodEntry();

  const today = new Date().toISOString().split('T')[0];

  const [moodScore, setMoodScore] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [anxietyLevel, setAnxietyLevel] = useState(5);
  const [sleepHours, setSleepHours] = useState('7');
  const [weather, setWeather] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createMutation.mutateAsync({
        date: today,
        mood_score: moodScore,
        energy_level: energyLevel,
        anxiety_level: anxietyLevel,
        sleep_hours: parseFloat(sleepHours) || undefined,
        weather: weather || undefined,
        tags: selectedTags,
        notes: notes || undefined,
      });
      navigate('/');
    } catch {
      setError('Failed to save mood entry. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-content-primary">How are you feeling?</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Mood Slider */}
        <div className="bg-surface-primary rounded-xl border border-edge-primary p-6">
          <MoodSlider value={moodScore} onChange={setMoodScore} label="Mood" />
        </div>

        {/* Energy Slider */}
        <div className="bg-surface-primary rounded-xl border border-edge-primary p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-content-secondary">Energy Level</label>
              <span className="text-sm font-medium text-content-primary">{energyLevel}/10</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <div className="flex justify-between text-xs text-content-tertiary">
              <span>Exhausted</span>
              <span>Energized</span>
            </div>
          </div>
        </div>

        {/* Anxiety Slider */}
        <div className="bg-surface-primary rounded-xl border border-edge-primary p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-content-secondary">Anxiety Level</label>
              <span className="text-sm font-medium text-content-primary">{anxietyLevel}/10</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={anxietyLevel}
              onChange={(e) => setAnxietyLevel(Number(e.target.value))}
              className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-xs text-content-tertiary">
              <span>Calm</span>
              <span>Very Anxious</span>
            </div>
          </div>
        </div>

        {/* Sleep Hours */}
        <div className="bg-surface-primary rounded-xl border border-edge-primary p-6">
          <label className="block text-sm font-medium text-content-secondary mb-2">Hours of Sleep</label>
          <input
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value)}
            className="input-field max-w-[120px]"
          />
        </div>

        {/* Weather */}
        <div className="bg-surface-primary rounded-xl border border-edge-primary p-6">
          <label className="block text-sm font-medium text-content-secondary mb-3">Weather</label>
          <div className="flex flex-wrap gap-2">
            {WEATHER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setWeather(weather === option.value ? '' : option.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  weather === option.value
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-400'
                    : 'bg-surface-secondary border-edge-primary text-content-secondary hover:bg-surface-tertiary'
                }`}
              >
                <span className="mr-1">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-surface-primary rounded-xl border border-edge-primary p-6">
          <label className="block text-sm font-medium text-content-secondary mb-3">Tags</label>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleTag(option.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  selectedTags.includes(option.value)
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-400'
                    : 'bg-surface-secondary border-edge-primary text-content-secondary hover:bg-surface-tertiary'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-surface-primary rounded-xl border border-edge-primary p-6">
          <label className="block text-sm font-medium text-content-secondary mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="How was your day? Any thoughts you want to capture..."
            className="input-field resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors text-sm"
        >
          {createMutation.isPending ? 'Saving...' : 'Save Mood Entry'}
        </button>
      </form>
    </div>
  );
}
