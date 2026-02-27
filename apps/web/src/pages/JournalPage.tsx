import React, { useState } from 'react';
import { useJournalEntries, useCreateJournalEntry } from '@moodflow/api-client';
import { sentimentLabel, sentimentColor } from '@moodflow/utils';
import { formatDate } from '@moodflow/utils';

export default function JournalPage() {
  const { data: entries, isLoading } = useJournalEntries();
  const createMutation = useCreateJournalEntry();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createMutation.mutateAsync({
        date: today,
        title,
        content,
      });
      setTitle('');
      setContent('');
      setShowForm(false);
    } catch {
      setError('Failed to save journal entry.');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-content-primary">Journal</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'New Entry'}
        </button>
      </div>

      {/* New Entry Form */}
      {showForm && (
        <div className="bg-surface-primary rounded-xl border border-edge-primary p-6">
          <h2 className="text-lg font-semibold text-content-primary mb-4">New Journal Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-content-secondary mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="Give your entry a title..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-content-secondary mb-1">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="input-field resize-none"
                placeholder="Write about your day, your thoughts, your feelings..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {createMutation.isPending ? 'Saving...' : 'Save Entry'}
            </button>
          </form>
        </div>
      )}

      {/* Entries List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-tertiary rounded-xl h-24 animate-pulse" />
          ))}
        </div>
      ) : entries && entries.length > 0 ? (
        <div className="space-y-4">
          {entries.map((entry) => {
            const sentiment = entry.sentiment_score ?? 0;
            const label = sentimentLabel(sentiment);
            const color = sentimentColor(sentiment);

            return (
              <div
                key={entry.id}
                className="bg-surface-primary rounded-xl border border-edge-primary p-6"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-base font-semibold text-content-primary">{entry.title}</h3>
                    <p className="text-xs text-content-tertiary mt-0.5">
                      {formatDate(entry.date)}
                    </p>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      color,
                      backgroundColor: `${color}15`,
                    }}
                  >
                    {label}
                  </span>
                </div>
                <p className="text-sm text-content-secondary line-clamp-3">{entry.content}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-surface-primary rounded-xl border border-edge-primary p-8 text-center">
          <p className="text-content-tertiary">No journal entries yet. Start writing about your day!</p>
        </div>
      )}
    </div>
  );
}
