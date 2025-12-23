/**
 * Timeline Stats Component
 * Displays overall timeline statistics
 */

import React from 'react';
import { timelineService } from '../../services/timelineService';

export default function TimelineStats({ stats }) {
  if (!stats) return null;

  const {
    total_memories,
    totalMemories,
    first_memory,
    firstMemory,
    last_memory,
    lastMemory,
    avg_happiness,
    avgHappiness,
    months_with_memories,
    monthsWithMemories,
    years_with_memories,
    yearsWithMemories
  } = stats;

  // Handle both cases
  const total = total_memories || totalMemories || 0;
  const first = first_memory || firstMemory;
  const last = last_memory || lastMemory;
  const happiness = avg_happiness || avgHappiness;
  const months = months_with_memories || monthsWithMemories || 0;
  const years = years_with_memories || yearsWithMemories || 0;

  const statItems = [
    {
      label: 'Total Memories',
      value: total?.toLocaleString() || '0',
      icon: '📝',
      color: 'text-purple-400'
    },
    {
      label: 'Years Covered',
      value: years?.toString() || '0',
      icon: '📅',
      color: 'text-blue-400'
    },
    {
      label: 'Active Months',
      value: months?.toString() || '0',
      icon: '🗓️',
      color: 'text-green-400'
    },
    {
      label: 'Avg Happiness',
      value: happiness ? parseFloat(happiness).toFixed(1) : 'N/A',
      icon: '😊',
      color: happiness ? '' : 'text-slate-500',
      customColor: happiness ? timelineService.getHappinessColor(parseFloat(happiness)) : null
    }
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <h3 className="font-semibold text-white mb-4">Timeline Overview</h3>

      <div className="space-y-3">
        {statItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm text-slate-400">{item.label}</span>
            </div>
            <span
              className={`font-semibold ${item.color}`}
              style={item.customColor ? { color: item.customColor } : {}}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Date range */}
      {first && last && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="text-xs text-slate-500 mb-2">Memory Timeline</div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              {timelineService.formatDate(first, 'short')}
            </span>
            <div className="flex-1 mx-3 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded" />
            <span className="text-slate-400">
              {timelineService.formatDate(last, 'short')}
            </span>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
        <button className="w-full px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Find Memory Gaps
        </button>
      </div>
    </div>
  );
}
