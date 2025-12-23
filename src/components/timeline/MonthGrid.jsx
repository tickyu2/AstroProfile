/**
 * Month Grid Component
 * Displays months of a year with memory counts
 */

import React from 'react';
import { timelineService } from '../../services/timelineService';

const MONTHS = [
  { name: 'Jan', full: 'January' },
  { name: 'Feb', full: 'February' },
  { name: 'Mar', full: 'March' },
  { name: 'Apr', full: 'April' },
  { name: 'May', full: 'May' },
  { name: 'Jun', full: 'June' },
  { name: 'Jul', full: 'July' },
  { name: 'Aug', full: 'August' },
  { name: 'Sep', full: 'September' },
  { name: 'Oct', full: 'October' },
  { name: 'Nov', full: 'November' },
  { name: 'Dec', full: 'December' }
];

export default function MonthGrid({ year, monthlyCounts, onMonthSelect }) {
  // Convert counts array to map
  const countMap = {};
  if (monthlyCounts) {
    monthlyCounts.forEach(item => {
      countMap[parseInt(item.month)] = {
        count: parseInt(item.memory_count) || 0,
        happiness: parseFloat(item.avg_happiness) || 3
      };
    });
  }

  // Find max for scaling
  const maxCount = Math.max(1, ...Object.values(countMap).map(c => c.count));

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-xl font-semibold mb-6">{year}</h3>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {MONTHS.map((month, index) => {
          const monthNum = index + 1;
          const data = countMap[monthNum] || { count: 0, happiness: 3 };
          const intensity = data.count / maxCount;
          const hasMemories = data.count > 0;

          return (
            <button
              key={monthNum}
              onClick={() => onMonthSelect(monthNum)}
              disabled={!hasMemories}
              className={`
                relative p-4 rounded-xl transition-all
                ${hasMemories
                  ? 'bg-slate-700 hover:bg-slate-600 hover:scale-105 cursor-pointer border border-slate-600 hover:border-purple-500'
                  : 'bg-slate-800/50 cursor-not-allowed opacity-50 border border-slate-700/50'
                }
              `}
            >
              {/* Month name */}
              <div className="text-lg font-medium mb-1">{month.name}</div>

              {/* Count */}
              <div className={`text-sm ${hasMemories ? 'text-slate-300' : 'text-slate-500'}`}>
                {data.count > 0 ? `${data.count} memories` : 'No memories'}
              </div>

              {/* Happiness bar */}
              {hasMemories && (
                <div className="mt-3 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.max(10, intensity * 100)}%`,
                      backgroundColor: timelineService.getHappinessColor(data.happiness)
                    }}
                  />
                </div>
              )}

              {/* Happiness score */}
              {hasMemories && (
                <div className="mt-1 text-xs text-slate-500">
                  Avg: {data.happiness.toFixed(1)}/5
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Happy (4.5+)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span>Neutral (3-4)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Difficult (&lt;3)</span>
        </div>
      </div>
    </div>
  );
}
