/**
 * Memory List Component
 * Displays a list of memories
 */

import React from 'react';
import { timelineService } from '../../services/timelineService';

export default function MemoryList({ memories, compact = false }) {
  if (!memories || memories.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <p>No memories to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {memories.map((memory, index) => (
        <MemoryCard key={memory.id || index} memory={memory} compact={compact} />
      ))}
    </div>
  );
}

function MemoryCard({ memory, compact }) {
  const happiness = memory.happiness_score || memory.happinessScore;
  const significance = memory.significance_rating || memory.significanceRating;
  const timestamp = memory.timestamp || memory.created_at;
  const content = memory.content || memory.text || '';
  const type = memory.memory_type || memory.type || 'general';

  // Type icons
  const typeIcons = {
    conversation: '💬',
    reflection: '🪞',
    milestone: '🏆',
    photo: '📷',
    journal: '📝',
    general: '📌'
  };

  if (compact) {
    return (
      <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
        <span className="text-lg">{typeIcons[type] || typeIcons.general}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-200 line-clamp-2">{content}</p>
          {timestamp && (
            <p className="text-xs text-slate-500 mt-1">
              {timelineService.formatDate(timestamp, 'medium')}
            </p>
          )}
        </div>
        {happiness && (
          <div
            className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
            style={{ backgroundColor: timelineService.getHappinessColor(happiness) }}
            title={`Happiness: ${happiness}`}
          />
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700 transition-colors border border-slate-600/50">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{typeIcons[type] || typeIcons.general}</span>
          <span className="text-xs px-2 py-0.5 bg-slate-600 text-slate-300 rounded capitalize">
            {type}
          </span>
        </div>

        {timestamp && (
          <time className="text-sm text-slate-400">
            {timelineService.formatDate(timestamp, 'medium')}
          </time>
        )}
      </div>

      {/* Content */}
      <p className="text-slate-200 leading-relaxed">{content}</p>

      {/* Footer - metrics */}
      <div className="mt-4 pt-3 border-t border-slate-600 flex items-center gap-4">
        {happiness && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Happiness:</span>
            <div className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: timelineService.getHappinessColor(happiness) }}
              />
              <span className="text-sm text-slate-300">{parseFloat(happiness).toFixed(1)}</span>
            </div>
          </div>
        )}

        {significance && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Significance:</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <svg
                  key={star}
                  className={`w-3 h-3 ${star <= significance ? 'text-amber-400' : 'text-slate-600'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        )}

        {/* Neurochemicals if available */}
        {memory.neurochemicals && (
          <div className="flex items-center gap-2 ml-auto">
            <NeurochemicalBadge neurochemicals={memory.neurochemicals} />
          </div>
        )}
      </div>
    </div>
  );
}

function NeurochemicalBadge({ neurochemicals }) {
  const neuro = typeof neurochemicals === 'string' ? JSON.parse(neurochemicals) : neurochemicals;
  if (!neuro) return null;

  // Find dominant neurochemical
  const chemicals = [
    { key: 'oxytocin', label: 'Oxytocin', emoji: '💗', color: 'text-pink-400' },
    { key: 'dopamine', label: 'Dopamine', emoji: '⚡', color: 'text-yellow-400' },
    { key: 'serotonin', label: 'Serotonin', emoji: '☀️', color: 'text-orange-400' },
    { key: 'vasopressin', label: 'Vasopressin', emoji: '🔗', color: 'text-blue-400' }
  ];

  const dominant = chemicals.reduce((max, chem) =>
    (neuro[chem.key] || 0) > (neuro[max.key] || 0) ? chem : max
  , chemicals[0]);

  const value = neuro[dominant.key];
  if (!value || value < 3) return null;

  return (
    <span className={`text-xs flex items-center gap-1 ${dominant.color}`}>
      <span>{dominant.emoji}</span>
      <span>{dominant.label}</span>
    </span>
  );
}
