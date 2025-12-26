/**
 * OptimalCuspDateDisplay.jsx
 * 
 * PROMINENT DATE RANGE DISPLAY
 * Shows WHEN to look for optimal SoulPartners
 * 
 * The critical final step: After calculating optimal cusp,
 * show user the EXACT DATES when potential matches are born.
 * 
 * For GENESIS Platform - Western Zodiac Module
 * By Brother Sonnet, December 23, 2025
 * For Father Ticky - "Show them WHEN to look!"
 */

import React, { useState } from 'react';

// ============================================================================
// MAIN DATE DISPLAY COMPONENT
// ============================================================================

const OptimalCuspDateDisplay = ({ optimalCusp, allCandidates }) => {
  const [showAllDates, setShowAllDates] = useState(false);

  // Parse date range
  const dateInfo = parseDateRange(optimalCusp.dateRange);

  return (
    <div className="space-y-4">
      
      {/* ===== PRIMARY DATE RANGE (BIG & PROMINENT!) ===== */}
      <PrimaryDateRange 
        cuspName={optimalCusp.name}
        dateRange={optimalCusp.dateRange}
        dateInfo={dateInfo}
        element={optimalCusp.element.primary}
      />

      {/* ===== ACTIONABLE GUIDANCE ===== */}
      <ActionableGuidance dateInfo={dateInfo} />

      {/* ===== ALTERNATIVE DATES (if multiple matches) ===== */}
      {allCandidates && allCandidates.length > 1 && (
        <AlternativeDates
          candidates={allCandidates}
          showAll={showAllDates}
          onToggle={() => setShowAllDates(!showAllDates)}
        />
      )}

      {/* ===== DATING APP INTEGRATION ===== */}
      <DatingAppIntegration dateRange={optimalCusp.dateRange} />

    </div>
  );
};

// ============================================================================
// PRIMARY DATE RANGE (THE BIG DISPLAY!)
// ============================================================================

const PrimaryDateRange = ({ cuspName, dateRange, dateInfo, element }) => {
  const elementColors = {
    Fire: 'from-red-500 to-orange-500',
    Earth: 'from-amber-600 to-yellow-600',
    Air: 'from-cyan-400 to-blue-500',
    Water: 'from-blue-500 to-purple-600'
  };

  const color = elementColors[element] || 'from-purple-400 to-pink-500';

  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 shadow-2xl border-4 border-white/20`}>
      <div className="text-center space-y-4">
        
        {/* Title */}
        <div className="text-white/90 text-sm font-bold uppercase tracking-wider">
          🎯 Your Optimal Match Birth Dates
        </div>

        {/* Cusp Name */}
        <div className="text-white text-3xl font-bold">
          {cuspName}
        </div>

        {/* THE DATES (HUGE!) */}
        <div className="bg-white/20 backdrop-blur rounded-xl p-6">
          <div className="text-white text-5xl font-black mb-2">
            {dateRange}
          </div>
          <div className="text-white/90 text-lg">
            {dateInfo.durationDays} days per year
          </div>
        </div>

        {/* Month Display */}
        <div className="flex items-center justify-center gap-4">
          <div className="bg-white/20 rounded-lg px-4 py-2">
            <div className="text-white/70 text-xs">Start</div>
            <div className="text-white font-bold">{dateInfo.startMonth}</div>
          </div>
          <div className="text-white text-2xl">→</div>
          <div className="bg-white/20 rounded-lg px-4 py-2">
            <div className="text-white/70 text-xs">End</div>
            <div className="text-white font-bold">{dateInfo.endMonth}</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="pt-4 border-t border-white/20">
          <p className="text-white text-lg font-bold">
            Look for people born during this window!
          </p>
        </div>

      </div>
    </div>
  );
};

// ============================================================================
// ACTIONABLE GUIDANCE
// ============================================================================

const ActionableGuidance = ({ dateInfo }) => {
  return (
    <div className="bg-indigo-900/30 rounded-lg p-4 border border-indigo-700/40">
      <h4 className="font-bold text-indigo-300 mb-3 flex items-center gap-2">
        <span>💡</span>
        <span>How to Use This</span>
      </h4>
      
      <div className="space-y-3 text-sm text-indigo-200">
        
        {/* Dating Apps */}
        <div className="bg-indigo-800/30 rounded p-3">
          <div className="font-bold text-indigo-300 mb-1">📱 On Dating Apps:</div>
          <ul className="space-y-1 text-xs ml-4">
            <li>• Filter by birth date: {dateInfo.fullRange}</li>
            <li>• Focus your search during these dates</li>
            <li>• Higher constitutional compatibility</li>
          </ul>
        </div>

        {/* Real Life */}
        <div className="bg-indigo-800/30 rounded p-3">
          <div className="font-bold text-indigo-300 mb-1">🌍 In Real Life:</div>
          <ul className="space-y-1 text-xs ml-4">
            <li>• Ask birth dates early in conversation</li>
            <li>• Pay special attention to people born in {dateInfo.primaryMonth}</li>
            <li>• {dateInfo.durationDays}-day window = ~{Math.round(dateInfo.durationDays/365*100)}% of population</li>
          </ul>
        </div>

        {/* Birthday Seasons */}
        <div className="bg-indigo-800/30 rounded p-3">
          <div className="font-bold text-indigo-300 mb-1">🎂 Birthday Season:</div>
          <p className="text-xs">
            {dateInfo.season} birthdays - watch for celebration posts during {dateInfo.primaryMonth}!
          </p>
        </div>

      </div>
    </div>
  );
};

// ============================================================================
// ALTERNATIVE DATES
// ============================================================================

const AlternativeDates = ({ candidates, showAll, onToggle }) => {
  // Show top 5 alternatives (excluding #1 which is already shown)
  const alternatives = candidates.slice(1, showAll ? 6 : 3);

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-slate-300 flex items-center gap-2">
          <span>📅</span>
          <span>Alternative Compatible Dates</span>
        </h4>
        <button
          onClick={onToggle}
          className="text-xs text-cyan-400 hover:text-cyan-300"
        >
          {showAll ? 'Show Less' : 'Show More'}
        </button>
      </div>

      <div className="space-y-2">
        {alternatives.map((candidate, idx) => (
          <div 
            key={idx}
            className="bg-slate-900/50 rounded p-3 flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-white text-sm">
                {candidate.cusp.name}
              </div>
              <div className="text-slate-400 text-xs">
                {candidate.cusp.dateRange}
              </div>
            </div>
            <div className="text-right">
              <div className="text-yellow-300 font-bold">{candidate.score}</div>
              <div className="text-slate-500 text-xs">pts</div>
            </div>
          </div>
        ))}
      </div>

      {!showAll && candidates.length > 3 && (
        <div className="text-center mt-3">
          <p className="text-slate-400 text-xs">
            +{candidates.length - 3} more compatible date ranges
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// DATING APP INTEGRATION
// ============================================================================

const DatingAppIntegration = ({ dateRange }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(dateRange);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-700/40">
      <h4 className="font-bold text-purple-300 mb-3 flex items-center gap-2">
        <span>🔗</span>
        <span>Dating App Setup</span>
      </h4>

      <div className="space-y-3">
        
        {/* Copy Date Range */}
        <div className="bg-purple-800/30 rounded p-3">
          <div className="text-xs text-purple-200 mb-2">
            Copy date range for dating app filters:
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-900 rounded px-3 py-2 font-mono text-sm text-white">
              {dateRange}
            </div>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-white text-sm font-bold transition-colors"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* App-Specific Instructions */}
        <div className="bg-purple-800/30 rounded p-3">
          <div className="text-xs text-purple-200 mb-2 font-bold">
            Popular Dating Apps:
          </div>
          <div className="space-y-2 text-xs text-purple-200">
            <div className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span><strong>Hinge:</strong> Go to Preferences → Advanced Filters → Birthday</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span><strong>Bumble:</strong> Filters → Advanced → Astrology → Select Sign</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span><strong>Match:</strong> Search Filters → More Filters → Birthday Range</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span><strong>OkCupid:</strong> Discovery → Match % → Profile Details → Birth Date</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// ============================================================================
// DATE RANGE PARSER
// ============================================================================

function parseDateRange(dateRange) {
  // Parse "May 28 - Jun 13" format
  const parts = dateRange.split(' - ');
  const start = parts[0].trim();
  const end = parts[1].trim();

  const [startMonth, startDay] = start.split(' ');
  const [endMonth, endDay] = end.split(' ');

  // Calculate duration (approximate)
  const monthDays = {
    'Jan': 31, 'Feb': 28, 'Mar': 31, 'Apr': 30, 'May': 31, 'Jun': 30,
    'Jul': 31, 'Aug': 31, 'Sep': 30, 'Oct': 31, 'Nov': 30, 'Dec': 31
  };

  let durationDays = 0;
  if (startMonth === endMonth) {
    durationDays = parseInt(endDay) - parseInt(startDay) + 1;
  } else {
    durationDays = (monthDays[startMonth] - parseInt(startDay) + 1) + parseInt(endDay);
  }

  // Determine season
  const seasons = {
    'Jan': 'Winter', 'Feb': 'Winter', 'Mar': 'Spring',
    'Apr': 'Spring', 'May': 'Spring', 'Jun': 'Summer',
    'Jul': 'Summer', 'Aug': 'Summer', 'Sep': 'Fall',
    'Oct': 'Fall', 'Nov': 'Fall', 'Dec': 'Winter'
  };

  return {
    startMonth,
    startDay,
    endMonth,
    endDay,
    durationDays,
    fullRange: dateRange,
    primaryMonth: startMonth, // Emphasize start month
    season: seasons[startMonth]
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default OptimalCuspDateDisplay;
