import React from 'react';
import { ThemeToggleIcon } from '@moodflow/theme';

export function Header() {
  return (
    <header className="h-16 bg-surface-primary border-b border-edge-primary flex items-center justify-between px-6">
      <div>
        <h1 className="text-lg font-semibold text-content-primary">MoodFlow</h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggleIcon />
        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
          <span className="text-primary-700 dark:text-primary-400 font-medium text-sm">U</span>
        </div>
      </div>
    </header>
  );
}
