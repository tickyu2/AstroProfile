/**
 * Year Grid Component
 * Displays all years with memory counts as a visual grid
 */

import React from 'react';
import { timelineService } from '../../services/timelineService';

export default function YearGrid({ years, onYearSelect }) {
  if (!years || years.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-xl font-semibold mb-2">No memories yet</h3>
        <p className="text-slate-400">Start chatting with Luna to build your timeline</p>
      </div>
    );
  }

  // Find max count for scaling
  const maxCount = Math.max(...years.map(y => parseInt(y.memory_count) || 0));

  // Group by decade
  const decades = {};
  years.forEach(yearData => {
    const year = parseInt(yearData.year);
    const decade = Math.floor(year / 10) * 10;
    if (!decades[decade]) {
      decades[decade] = [];
    }
    decades[decade].push(yearData);
  });

  return (
    <div className="space-y-6">
      {Object.entries(decades)
        .sort(([a], [b]) => parseInt(b) - parseInt(a))
        .map(([decade, yearList]) => (
          <div key={decade} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-slate-300">
              {decade}s
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {yearList
                .sort((a, b) => parseInt(b.year) - parseInt(a.year))
                .map(yearData => {
                  const year = parseInt(yearData.year);
                  const count = parseInt(yearData.memory_count) || 0;
                  const happiness = parseFloat(yearData.avg_happiness) || 3;
                  const intensity = maxCount > 0 ? count / maxCount : 0;

                  return (
                    <button
                      key={year}
                      onClick={() => onYearSelect(year)}
                      className="group relative bg-slate-700 hover:bg-slate-600 rounded-xl p-4 transition-all hover:scale-105 hover:shadow-lg border border-slate-600 hover:border-purple-500"
                    >
                      {/* Year */}
                      <div className="text-2xl font-bold text-white mb-1">{year}</div>

                      {/* Memory count */}
                      <div className="text-sm text-slate-400">
                        {count.toLocaleString()} memories
                      </div>

                      {/* Happiness indicator */}
                      <div className="mt-2 flex items-center gap-1">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${Math.max(20, intensity * 100)}%`,
                            backgroundColor: timelineService.getHappinessColor(happiness)
                          }}
                        />
                        <span className="text-xs text-slate-500">{happiness.toFixed(1)}</span>
                      </div>

                      {/* Hover effect */}
                      <div className="absolute inset-0 rounded-xl ring-2 ring-purple-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
    </div>
  );
}
