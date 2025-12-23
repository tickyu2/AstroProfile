/**
 * Period Summary Card Component
 * Displays AI-generated summary for a time period
 */

import React, { useState } from 'react';
import { timelineService } from '../../services/timelineService';

export default function PeriodSummaryCard({ summary, loading, onRegenerate }) {
  const [showLong, setShowLong] = useState(false);

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4" />
        <div className="h-4 bg-slate-700 rounded w-full mb-2" />
        <div className="h-4 bg-slate-700 rounded w-2/3 mb-2" />
        <div className="h-4 bg-slate-700 rounded w-3/4" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center">
        <p className="text-slate-400">No summary available for this period</p>
        <button
          onClick={onRegenerate}
          className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm transition-colors"
        >
          Generate Summary
        </button>
      </div>
    );
  }

  const {
    periodLabel,
    summaryShort,
    summaryMedium,
    summaryLong,
    summary_short,
    summary_medium,
    summary_long,
    period_label,
    totalMemories,
    total_memories,
    avgHappiness,
    avg_happiness,
    happinessTrend,
    happiness_trend,
    dominantEmotions,
    dominant_emotions,
    highlights,
    confidenceScore,
    confidence_score,
    cached
  } = summary;

  // Handle both camelCase and snake_case
  const label = periodLabel || period_label;
  const short = summaryShort || summary_short;
  const medium = summaryMedium || summary_medium;
  const long = summaryLong || summary_long;
  const memories = totalMemories || total_memories;
  const happiness = avgHappiness || avg_happiness;
  const trend = happinessTrend || happiness_trend;
  const emotions = dominantEmotions || dominant_emotions || [];
  const confidence = confidenceScore || confidence_score;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-xl p-6 border border-slate-700">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{label}</h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
            <span>{memories?.toLocaleString()} memories</span>
            {happiness && (
              <span className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: timelineService.getHappinessColor(happiness) }}
                />
                {parseFloat(happiness).toFixed(1)} avg happiness
              </span>
            )}
            {trend && (
              <span className={`
                ${trend === 'increasing' ? 'text-emerald-400' : ''}
                ${trend === 'decreasing' ? 'text-red-400' : ''}
                ${trend === 'volatile' ? 'text-amber-400' : ''}
              `}>
                {trend === 'increasing' && '↑'}
                {trend === 'decreasing' && '↓'}
                {trend === 'stable' && '→'}
                {trend === 'volatile' && '↕'}
                {' '}{trend}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {cached && (
            <span className="text-xs px-2 py-1 bg-slate-700 text-slate-400 rounded">
              Cached
            </span>
          )}
          <button
            onClick={onRegenerate}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title="Regenerate summary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Summary content */}
      <div className="space-y-4">
        {/* Short summary - always visible */}
        {short && (
          <p className="text-lg text-purple-300 italic">"{short}"</p>
        )}

        {/* Medium summary */}
        {medium && (
          <p className="text-slate-300 leading-relaxed">{medium}</p>
        )}

        {/* Long summary - expandable */}
        {long && (
          <div>
            <button
              onClick={() => setShowLong(!showLong)}
              className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              {showLong ? 'Show less' : 'Read more'}
              <svg
                className={`w-4 h-4 transition-transform ${showLong ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showLong && (
              <div className="mt-3 text-slate-300 leading-relaxed whitespace-pre-line">
                {long}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Emotions */}
      {emotions && emotions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Dominant feelings</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {emotions.map((emotion, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm"
              >
                {emotion}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Highlights */}
      {highlights && Object.keys(highlights).length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Key moments</span>
          <div className="mt-2 space-y-2">
            {Object.values(highlights).slice(0, 3).map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-purple-400">•</span>
                <div>
                  <span className="text-white font-medium">{h.title}</span>
                  {h.date && (
                    <span className="text-slate-500 ml-2">({timelineService.formatDate(h.date, 'short')})</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confidence indicator */}
      {confidence && (
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <span>AI Confidence:</span>
          <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
          <span>{(confidence * 100).toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
}
