/**
 * Cultural Context Panel Component
 * Shows movies, music, news, events for memory triggers
 */

import React, { useState } from 'react';
import { timelineService } from '../../services/timelineService';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'movies', label: 'Movies' },
  { key: 'music', label: 'Music' },
  { key: 'news', label: 'News' },
  { key: 'tv', label: 'TV' },
  { key: 'tech', label: 'Tech' },
  { key: 'sports', label: 'Sports' }
];

export default function CulturalContextPanel({ context, year, month }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!context || context.length === 0) {
    return null;
  }

  const filteredContext = selectedCategory === 'all'
    ? context
    : context.filter(item => item.category === selectedCategory);

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">
          {month
            ? `${new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long' })} ${year}`
            : year
          }
        </h3>
        <span className="text-xs text-slate-500">Cultural context</span>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-1 mb-4">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`
              px-2 py-1 text-xs rounded-full transition-colors
              ${selectedCategory === cat.key
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Context items */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredContext.map((item, index) => (
          <CulturalContextCard key={item.id || index} item={item} />
        ))}

        {filteredContext.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">
            No {selectedCategory} context available
          </p>
        )}
      </div>

      {/* Prompt */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <p className="text-xs text-slate-400 text-center">
          Do any of these trigger a memory?
        </p>
      </div>
    </div>
  );
}

function CulturalContextCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const icon = timelineService.getCategoryIcon(item.category);
  const data = typeof item.data === 'string' ? JSON.parse(item.data) : item.data || {};

  return (
    <div
      className="bg-slate-700/50 rounded-lg p-3 hover:bg-slate-700 transition-colors cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span className="text-2xl">{icon}</span>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className="font-medium text-white truncate">{item.title}</h4>

          {/* Subtitle */}
          {item.subtitle && (
            <p className="text-sm text-slate-400 truncate">{item.subtitle}</p>
          )}

          {/* Date */}
          {item.date_specific && (
            <p className="text-xs text-slate-500 mt-1">
              {timelineService.formatDate(item.date_specific, 'short')}
            </p>
          )}

          {/* Expanded details */}
          {expanded && (
            <div className="mt-3 pt-3 border-t border-slate-600 space-y-2">
              {item.description && (
                <p className="text-sm text-slate-300">{item.description}</p>
              )}

              {/* Movie details */}
              {data.director && (
                <p className="text-xs text-slate-400">
                  Director: {data.director}
                </p>
              )}
              {data.cast && (
                <p className="text-xs text-slate-400">
                  Cast: {Array.isArray(data.cast) ? data.cast.join(', ') : data.cast}
                </p>
              )}

              {/* Music details */}
              {data.artist && (
                <p className="text-xs text-slate-400">
                  Artist: {data.artist}
                </p>
              )}
              {data.album && (
                <p className="text-xs text-slate-400">
                  Album: {data.album}
                </p>
              )}

              {/* Themes */}
              {data.themes && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {data.themes.map((theme, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-slate-600 text-slate-300 rounded text-xs"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Significance */}
        {item.significance_score && (
          <div className="flex flex-col items-center">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                ${item.significance_score >= 8 ? 'bg-purple-600 text-white' : ''}
                ${item.significance_score >= 6 && item.significance_score < 8 ? 'bg-purple-600/50 text-purple-200' : ''}
                ${item.significance_score < 6 ? 'bg-slate-600 text-slate-300' : ''}
              `}
            >
              {item.significance_score}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
