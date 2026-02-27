import React, { useState } from 'react';
import { useCurrentUser } from '@moodflow/api-client';
import { ThemeToggle } from '@moodflow/theme';

export default function SettingsPage() {
  const { data: user, isLoading } = useCurrentUser();

  // Notification preferences local state
  const [dailyReminder, setDailyReminder] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [insightAlerts, setInsightAlerts] = useState(true);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-content-primary">Settings</h1>

      {/* Profile Section */}
      <div className="bg-surface-primary rounded-xl border border-edge-primary p-6">
        <h2 className="text-lg font-semibold text-content-primary mb-4">Profile</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-edge-secondary">
            <span className="text-sm font-medium text-content-tertiary">Email</span>
            <span className="text-sm text-content-primary">{user?.email ?? '-'}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-edge-secondary">
            <span className="text-sm font-medium text-content-tertiary">Name</span>
            <span className="text-sm text-content-primary">{user?.name ?? '-'}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-content-tertiary">Member since</span>
            <span className="text-sm text-content-primary">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Theme Section */}
      <div className="bg-surface-primary rounded-xl border border-edge-primary p-6">
        <h2 className="text-lg font-semibold text-content-primary mb-4">Appearance</h2>
        <p className="text-sm text-content-tertiary mb-3">Choose your preferred theme.</p>
        <ThemeToggle />
      </div>

      {/* Notification Preferences */}
      <div className="bg-surface-primary rounded-xl border border-edge-primary p-6">
        <h2 className="text-lg font-semibold text-content-primary mb-4">Notifications</h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-sm font-medium text-content-primary">Daily mood reminder</span>
              <p className="text-xs text-content-tertiary">Get a daily reminder to log your mood</p>
            </div>
            <input
              type="checkbox"
              checked={dailyReminder}
              onChange={(e) => setDailyReminder(e.target.checked)}
              className="h-4 w-4 text-primary-600 border-edge-primary rounded focus:ring-primary-500"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-sm font-medium text-content-primary">Weekly report</span>
              <p className="text-xs text-content-tertiary">Receive a weekly summary of your mood data</p>
            </div>
            <input
              type="checkbox"
              checked={weeklyReport}
              onChange={(e) => setWeeklyReport(e.target.checked)}
              className="h-4 w-4 text-primary-600 border-edge-primary rounded focus:ring-primary-500"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-sm font-medium text-content-primary">Insight alerts</span>
              <p className="text-xs text-content-tertiary">Get notified when new insights are available</p>
            </div>
            <input
              type="checkbox"
              checked={insightAlerts}
              onChange={(e) => setInsightAlerts(e.target.checked)}
              className="h-4 w-4 text-primary-600 border-edge-primary rounded focus:ring-primary-500"
            />
          </label>
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-surface-primary rounded-xl border border-edge-primary p-6">
        <h2 className="text-lg font-semibold text-content-primary mb-2">Data Export</h2>
        <p className="text-sm text-content-tertiary mb-4">
          Download all your mood and journal data as a JSON file.
        </p>
        <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors">
          Export Data
        </button>
      </div>
    </div>
  );
}
