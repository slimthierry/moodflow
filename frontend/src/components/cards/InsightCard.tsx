import React from 'react';
import type { RecommendationItem } from '../../types';

interface InsightCardProps {
  recommendation: RecommendationItem;
}

const categoryIcons: Record<string, string> = {
  wellness: '\u{1F33F}',
  sleep: '\u{1F634}',
  anxiety: '\u{1F9D8}',
  correlation: '\u{1F4CA}',
  general: '\u{1F4A1}',
};

const categoryColors: Record<string, string> = {
  wellness: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  sleep: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
  anxiety: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  correlation: 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800',
  general: 'bg-surface-secondary border-edge-primary',
};

export function InsightCard({ recommendation }: InsightCardProps) {
  const icon = categoryIcons[recommendation.category] || '\u{1F4A1}';
  const colorClasses = categoryColors[recommendation.category] || categoryColors.general;

  return (
    <div className={`rounded-lg border p-4 ${colorClasses}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{icon}</span>
        <div>
          <h4 className="text-sm font-semibold text-content-primary">{recommendation.title}</h4>
          <p className="text-sm text-content-secondary mt-1">{recommendation.description}</p>
          <span className="inline-block mt-2 text-xs font-medium text-content-tertiary capitalize">
            {recommendation.category}
          </span>
        </div>
      </div>
    </div>
  );
}
