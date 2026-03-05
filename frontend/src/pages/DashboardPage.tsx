import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../services/api';
import { MoodChart } from '../components';
import { getMoodEmoji, formatRelativeDate } from '../utils';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: dashboard, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="bg-surface-tertiary rounded-xl h-32 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => <div key={i} className="bg-surface-tertiary rounded-lg h-28" />)}
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Loading error</h3>
          <p className="mt-2 text-sm text-red-700 dark:text-red-400">Unable to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Welcome to MoodFlow</h2>
            <p className="text-primary-100 mt-1">Track your mood, understand your patterns.</p>
          </div>
          <button
            onClick={() => navigate('/mood')}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-colors text-sm"
          >
            Log Mood
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Average Mood"
          value={dashboard.summary.average_mood.toFixed(1)}
          subtitle="Last 30 days"
          icon="\u{1F60A}"
          accent="bg-primary-50 dark:bg-primary-900/20"
        />
        <StatCard
          title="Current Streak"
          value={`${dashboard.summary.current_streak}`}
          subtitle="Consecutive days"
          icon="\u{1F525}"
          accent="bg-amber-50 dark:bg-amber-900/20"
        />
        <StatCard
          title="Avg Energy"
          value={dashboard.summary.average_energy.toFixed(1)}
          subtitle="Last 30 days"
          icon="\u{26A1}"
          accent="bg-green-50 dark:bg-green-900/20"
        />
        <StatCard
          title="Avg Sleep"
          value={`${dashboard.summary.average_sleep.toFixed(1)}h`}
          subtitle="Last 30 days"
          icon="\u{1F634}"
          accent="bg-indigo-50 dark:bg-indigo-900/20"
        />
      </div>

      {/* Chart + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-surface-primary rounded-xl border border-edge-primary p-6">
            <h3 className="text-lg font-semibold text-content-primary mb-4">Weekly Mood</h3>
            <MoodChart data={dashboard.weekly_trend} height={200} />
          </div>
        </div>
        <div>
          <div className="bg-surface-primary rounded-xl border border-edge-primary p-6">
            <h3 className="text-lg font-semibold text-content-primary mb-4">Recent Entries</h3>
            {dashboard.recent_entries.length > 0 ? (
              <div className="space-y-3">
                {dashboard.recent_entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface-secondary"
                  >
                    <span className="text-2xl">{getMoodEmoji(entry.mood_score)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-content-primary">
                        {entry.mood_score}/10
                      </p>
                      <p className="text-xs text-content-tertiary truncate">
                        {entry.notes || formatRelativeDate(entry.date)}
                      </p>
                    </div>
                    <span className="text-xs text-content-tertiary">
                      {formatRelativeDate(entry.date)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-content-tertiary text-sm">No entries yet. Start tracking your mood!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  accent,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  accent: string;
}) {
  return (
    <div className="bg-surface-primary rounded-xl border border-edge-primary p-5">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${accent} flex items-center justify-center text-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-content-tertiary">{title}</p>
          <p className="text-xl font-bold text-content-primary">{value}</p>
          <p className="text-xs text-content-tertiary">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
