/**
 * Timeline Navigation Component
 * Breadcrumb and zoom controls
 */

import React from 'react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function TimelineNav({
  zoomLevel,
  selectedYear,
  selectedMonth,
  selectedDay,
  onZoomOut,
  onYearClick,
  onMonthClick
}) {
  return (
    <div className="flex items-center gap-2 mt-4 text-sm">
      {/* Zoom out button */}
      {zoomLevel !== 'overview' && (
        <button
          onClick={onZoomOut}
          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
          Zoom Out
        </button>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-slate-400">
        <button
          onClick={() => window.location.reload()}
          className={`hover:text-white transition-colors ${zoomLevel === 'overview' ? 'text-purple-400 font-medium' : ''}`}
        >
          All Years
        </button>

        {selectedYear && (
          <>
            <span>/</span>
            <button
              onClick={onYearClick}
              className={`hover:text-white transition-colors ${zoomLevel === 'year' ? 'text-purple-400 font-medium' : ''}`}
            >
              {selectedYear}
            </button>
          </>
        )}

        {selectedMonth && (
          <>
            <span>/</span>
            <button
              onClick={onMonthClick}
              className={`hover:text-white transition-colors ${zoomLevel === 'month' ? 'text-purple-400 font-medium' : ''}`}
            >
              {MONTH_NAMES[selectedMonth - 1]}
            </button>
          </>
        )}

        {selectedDay && (
          <>
            <span>/</span>
            <span className="text-purple-400 font-medium">
              {new Date(selectedDay).getDate()}
            </span>
          </>
        )}
      </nav>

      {/* Zoom level indicator */}
      <div className="ml-auto flex items-center gap-2">
        <span className="text-slate-500 text-xs">Viewing:</span>
        <span className="px-2 py-1 bg-purple-600/30 text-purple-300 rounded text-xs uppercase">
          {zoomLevel}
        </span>
      </div>
    </div>
  );
}
