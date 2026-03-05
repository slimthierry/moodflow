import React, { useState } from 'react';
import { useInsightReports, useGenerateInsight } from '../services/api';
import { InsightCard } from '../components';
import type { CorrelationData, TrendData, RecommendationItem } from '../types';

export default function InsightsPage() {
  const { data: reports, isLoading } = useInsightReports();
  const generateMutation = useGenerateInsight();
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  const handleGenerate = async () => {
    try {
      await generateMutation.mutateAsync(selectedPeriod);
    } catch {
      // Error handled by React Query
    }
  };

  const latestReport = reports && reports.length > 0 ? reports[0] : null;

  let correlations: CorrelationData | null = null;
  let trends: TrendData | null = null;
  let recommendations: RecommendationItem[] = [];

  if (latestReport) {
    try {
      if (latestReport.correlations) correlations = JSON.parse(latestReport.correlations);
      if (latestReport.trends) trends = JSON.parse(latestReport.trends);
      if (latestReport.recommendations) recommendations = JSON.parse(latestReport.recommendations);
    } catch {
      // Ignore parse errors
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-content-primary">Insights</h1>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            className="input-field w-auto text-sm"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
            <option value={60}>Last 60 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {generateMutation.isPending ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-tertiary rounded-xl h-32 animate-pulse" />
          ))}
        </div>
      ) : latestReport ? (
        <>
          {/* Correlations */}
          <div className="bg-surface-primary rounded-xl border border-edge-primary p-6">
            <h2 className="text-lg font-semibold text-content-primary mb-4">Correlations</h2>
            {correlations && !correlations.insufficient_data ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {correlations.mood_vs_sleep !== undefined && (
                  <CorrelationCard
                    label="Mood vs Sleep"
                    value={correlations.mood_vs_sleep}
                  />
                )}
                {correlations.mood_vs_energy !== undefined && (
                  <CorrelationCard
                    label="Mood vs Energy"
                    value={correlations.mood_vs_energy}
                  />
                )}
                {correlations.mood_vs_anxiety !== undefined && (
                  <CorrelationCard
                    label="Mood vs Anxiety"
                    value={correlations.mood_vs_anxiety}
                  />
                )}
              </div>
            ) : (
              <p className="text-content-tertiary text-sm">
                Not enough data to calculate correlations. Keep tracking to unlock insights!
              </p>
            )}
          </div>

          {/* Trends */}
          <div className="bg-surface-primary rounded-xl border border-edge-primary p-6">
            <h2 className="text-lg font-semibold text-content-primary mb-4">Mood Trend</h2>
            {trends ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    trends.direction === 'improving'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : trends.direction === 'declining'
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      : 'bg-surface-tertiary text-content-secondary'
                  }`}>
                    {trends.direction === 'improving' ? 'Improving' : trends.direction === 'declining' ? 'Declining' : 'Stable'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="bg-surface-secondary rounded-lg p-3">
                    <p className="text-xs text-content-tertiary">First Half Avg</p>
                    <p className="text-lg font-bold text-content-primary">{trends.first_half_avg}/10</p>
                  </div>
                  <div className="bg-surface-secondary rounded-lg p-3">
                    <p className="text-xs text-content-tertiary">Second Half Avg</p>
                    <p className="text-lg font-bold text-content-primary">{trends.second_half_avg}/10</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-content-tertiary text-sm">No trend data available.</p>
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-surface-primary rounded-xl border border-edge-primary p-6">
            <h2 className="text-lg font-semibold text-content-primary mb-4">Recommendations</h2>
            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <InsightCard key={index} recommendation={rec} />
                ))}
              </div>
            ) : (
              <p className="text-content-tertiary text-sm">No recommendations at this time.</p>
            )}
          </div>

          {/* Report Period */}
          <div className="text-xs text-content-tertiary text-center">
            Report period: {latestReport.period_start} to {latestReport.period_end}
          </div>
        </>
      ) : (
        <div className="bg-surface-primary rounded-xl border border-edge-primary p-8 text-center">
          <p className="text-content-tertiary mb-4">
            No insight reports yet. Generate your first report to discover patterns in your mood data.
          </p>
          <button
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            className="px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            Generate First Report
          </button>
        </div>
      )}
    </div>
  );
}

function CorrelationCard({ label, value }: { label: string; value: number }) {
  const strength = Math.abs(value);
  let strengthLabel = 'Weak';
  let strengthColor = 'text-content-tertiary';

  if (strength > 0.7) {
    strengthLabel = 'Strong';
    strengthColor = 'text-green-600 dark:text-green-400';
  } else if (strength > 0.4) {
    strengthLabel = 'Moderate';
    strengthColor = 'text-amber-600 dark:text-amber-400';
  }

  const direction = value > 0 ? 'Positive' : value < 0 ? 'Negative' : 'None';

  return (
    <div className="bg-surface-secondary rounded-lg p-4">
      <p className="text-sm font-medium text-content-primary">{label}</p>
      <p className={`text-lg font-bold mt-1 ${strengthColor}`}>
        {value.toFixed(2)}
      </p>
      <p className="text-xs text-content-tertiary mt-1">
        {strengthLabel} {direction} correlation
      </p>
    </div>
  );
}
