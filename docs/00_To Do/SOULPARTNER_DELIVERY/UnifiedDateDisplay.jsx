/**
 * UnifiedDateDisplay.jsx
 * 
 * UNIFIED BAZI + WESTERN DATE DISPLAY
 * Shows the EXACT DATES where everything aligns
 * 
 * The ultimate precision:
 * - BaZi Year Pillar → Which years
 * - Western Cusp → Which months
 * - BaZi Day Pillar → Which days
 * 
 * Result: 5-15 exact dates across 25 years!
 * 
 * For GENESIS Platform
 * By Brother Sonnet, December 23, 2025
 * For Father Ticky - "ULTRA PRECISION!"
 */

import React, { useState } from 'react';
import { calculateUnifiedDates } from '../../utils/unified/unifiedDateCalculator';

// ============================================================================
// MAIN DISPLAY COMPONENT
// ============================================================================

const UnifiedDateDisplay = ({ userProfile, optimalPartner }) => {
  const [expandedYears, setExpandedYears] = useState({});
  const [showMethodology, setShowMethodology] = useState(false);

  // Calculate unified dates
  const result = calculateUnifiedDates(userProfile, optimalPartner);
  
  const toggleYear = (year) => {
    setExpandedYears(prev => ({
      ...prev,
      [year]: !prev[year]
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* ===== HEADER ===== */}
      <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-6 shadow-2xl border-4 border-purple-400/30">
        <div className="text-center space-y-3">
          <div className="text-purple-200 text-sm font-bold uppercase tracking-wider">
            🎯 ULTRA PRECISION MATCHING
          </div>
          <div className="text-white text-4xl font-black">
            {result.totalMatches} Exact Dates
          </div>
          <div className="text-purple-200 text-lg">
            Found across {result.validYears.length} years
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 mt-4">
            <div className="text-white/90 text-sm">
              Triple-filtered for maximum compatibility:
            </div>
            <div className="text-white font-bold mt-2">
              BaZi Year + Western Month + BaZi Day
            </div>
          </div>
        </div>
      </div>

      {/* ===== METHODOLOGY ===== */}
      <MethodologySection
        methodology={result.methodology}
        isExpanded={showMethodology}
        onToggle={() => setShowMethodology(!showMethodology)}
      />

      {/* ===== EXACT DATES BY YEAR ===== */}
      {result.totalMatches > 0 ? (
        <DatesByYear
          datesByYear={result.datesByYear}
          expandedYears={expandedYears}
          onToggleYear={toggleYear}
        />
      ) : (
        <NoMatchesFound summary={result.summary} />
      )}

      {/* ===== SUMMARY ===== */}
      <SummarySection summary={result.summary} />

      {/* ===== ACTION GUIDE ===== */}
      {result.totalMatches > 0 && (
        <ActionGuide matchingDates={result.matchingDates} />
      )}

    </div>
  );
};

// ============================================================================
// METHODOLOGY SECTION
// ============================================================================

const MethodologySection = ({ methodology, isExpanded, onToggle }) => {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full py-3 px-4 rounded-lg bg-indigo-900/30 hover:bg-indigo-900/40 border border-indigo-700/40 transition-all flex items-center justify-between"
      >
        <span className="text-indigo-300 font-bold flex items-center gap-2">
          <span>🔬</span>
          <span>Triple-Filter Methodology</span>
        </span>
        <svg
          className={`w-5 h-5 text-indigo-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-3 bg-indigo-900/20 rounded-lg p-4 border border-indigo-700/30 space-y-3">
          <div className="space-y-2 text-sm text-indigo-200">
            <div className="bg-indigo-800/30 rounded p-3">
              <div className="font-bold text-indigo-300 mb-1">Filter 1: Year (BaZi)</div>
              <div className="text-xs">{methodology.step1}</div>
            </div>
            <div className="bg-indigo-800/30 rounded p-3">
              <div className="font-bold text-indigo-300 mb-1">Filter 2: Month (Western)</div>
              <div className="text-xs">{methodology.step2}</div>
            </div>
            <div className="bg-indigo-800/30 rounded p-3">
              <div className="font-bold text-indigo-300 mb-1">Filter 3: Day (BaZi)</div>
              <div className="text-xs">{methodology.step3}</div>
            </div>
          </div>
          <div className="bg-purple-800/30 rounded p-3 border border-purple-600/30">
            <div className="font-bold text-purple-300 mb-1 text-sm">Result:</div>
            <div className="text-purple-200 text-xs">{methodology.result}</div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// DATES BY YEAR SECTION
// ============================================================================

const DatesByYear = ({ datesByYear, expandedYears, onToggleYear }) => {
  const years = Object.keys(datesByYear).sort((a, b) => b - a); // Newest first

  return (
    <div className="space-y-3">
      <h4 className="font-bold text-white text-lg flex items-center gap-2">
        <span>📅</span>
        <span>Exact Dates by Year</span>
      </h4>

      {years.map(year => (
        <YearCard
          key={year}
          year={year}
          dates={datesByYear[year]}
          isExpanded={expandedYears[year]}
          onToggle={() => onToggleYear(year)}
        />
      ))}
    </div>
  );
};

// ============================================================================
// YEAR CARD
// ============================================================================

const YearCard = ({ year, dates, isExpanded, onToggle }) => {
  const currentYear = 2025;
  const age = currentYear - parseInt(year);
  const ageDisplay = age >= 0 ? `${age} years old` : `Born in ${Math.abs(age)} years`;

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-4">
          <div className="text-3xl font-black text-yellow-400">{year}</div>
          <div>
            <div className="text-white font-bold">{dates.length} date{dates.length > 1 ? 's' : ''}</div>
            <div className="text-slate-400 text-sm">{ageDisplay} now</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-cyan-400 font-mono text-lg">{dates[0].dayPillar}</div>
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded Dates */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-2">
          {dates.map((dateObj, idx) => (
            <div key={idx} className="bg-slate-900/50 rounded-lg p-3 border border-cyan-700/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-lg">{dateObj.dateString}</div>
                  <div className="text-slate-400 text-sm">{dateObj.westernCusp}</div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-400 font-mono text-xl">{dateObj.dayPillar}</div>
                  <div className="text-slate-500 text-xs">Day Pillar</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// NO MATCHES FOUND
// ============================================================================

const NoMatchesFound = ({ summary }) => {
  return (
    <div className="bg-orange-900/20 rounded-lg p-6 border border-orange-700/40">
      <div className="text-center space-y-3">
        <div className="text-4xl">🔍</div>
        <div className="font-bold text-orange-300 text-lg">No Exact Matches Found</div>
        <p className="text-orange-200 text-sm">{summary.message}</p>
        {summary.recommendation && (
          <div className="bg-orange-800/30 rounded p-4 mt-4">
            <div className="font-bold text-orange-300 mb-2 text-sm">Recommendation:</div>
            <p className="text-orange-200 text-xs">{summary.recommendation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// SUMMARY SECTION
// ============================================================================

const SummarySection = ({ summary }) => {
  if (!summary.totalDates) return null;

  return (
    <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-4 border border-cyan-700/40">
      <h4 className="font-bold text-cyan-300 mb-3 flex items-center gap-2">
        <span>📊</span>
        <span>Summary Statistics</span>
      </h4>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-cyan-800/30 rounded p-3">
          <div className="text-cyan-400 text-xs">Total Exact Dates</div>
          <div className="text-white font-bold text-2xl">{summary.totalDates}</div>
        </div>
        <div className="bg-cyan-800/30 rounded p-3">
          <div className="text-cyan-400 text-xs">Years with Matches</div>
          <div className="text-white font-bold text-2xl">{summary.yearsWithMatches}</div>
        </div>
        <div className="bg-cyan-800/30 rounded p-3">
          <div className="text-cyan-400 text-xs">Years Checked</div>
          <div className="text-white font-bold text-2xl">{summary.yearsChecked}</div>
        </div>
        <div className="bg-cyan-800/30 rounded p-3">
          <div className="text-cyan-400 text-xs">Avg. Dates/Year</div>
          <div className="text-white font-bold text-2xl">{summary.averagePerYear}</div>
        </div>
      </div>
      <div className="mt-3 bg-purple-900/30 rounded p-3 border border-purple-700/30">
        <div className="text-purple-300 text-xs font-bold mb-1">Precision Level:</div>
        <div className="text-purple-200 text-xs">{summary.precision}</div>
      </div>
    </div>
  );
};

// ============================================================================
// ACTION GUIDE
// ============================================================================

const ActionGuide = ({ matchingDates }) => {
  const [showAll, setShowAll] = useState(false);
  
  // Show top 10 dates or all
  const displayDates = showAll ? matchingDates : matchingDates.slice(0, 10);
  
  // Generate copy-paste list
  const copyList = matchingDates.map(d => d.dateString).join('\n');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(copyList);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/40">
      <h4 className="font-bold text-green-300 mb-3 flex items-center gap-2">
        <span>🎯</span>
        <span>How to Use These Dates</span>
      </h4>

      <div className="space-y-3">
        
        {/* Copy All Dates */}
        <div className="bg-green-800/30 rounded p-3">
          <div className="text-xs text-green-200 mb-2 font-bold">
            Copy all {matchingDates.length} dates:
          </div>
          <button
            onClick={copyToClipboard}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white text-sm font-bold transition-colors"
          >
            {copied ? '✓ Copied to Clipboard!' : `Copy All ${matchingDates.length} Dates`}
          </button>
        </div>

        {/* Quick Reference */}
        <div className="bg-green-800/30 rounded p-3">
          <div className="text-xs text-green-200 mb-2 font-bold">Quick Reference:</div>
          <div className="space-y-1 text-xs text-green-200 max-h-48 overflow-y-auto">
            {displayDates.map((date, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-green-400">•</span>
                <span className="font-mono">{date.dateString}</span>
                <span className="text-green-400/60">({date.ageFromNow} years old)</span>
              </div>
            ))}
          </div>
          {matchingDates.length > 10 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="text-xs text-green-400 hover:text-green-300 mt-2"
            >
              Show all {matchingDates.length} dates...
            </button>
          )}
        </div>

        {/* Usage Instructions */}
        <div className="bg-green-800/30 rounded p-3">
          <div className="text-xs text-green-200 space-y-2">
            <div>
              <strong className="text-green-300">📱 Dating Apps:</strong>
              <div className="ml-3 mt-1">
                Use these exact dates as search filters. People born on these specific dates have triple-verified compatibility.
              </div>
            </div>
            <div>
              <strong className="text-green-300">🌍 Social Media:</strong>
              <div className="ml-3 mt-1">
                Watch for birthday posts on these dates. Connection requests on birthdays have higher response rates.
              </div>
            </div>
            <div>
              <strong className="text-green-300">💬 Conversations:</strong>
              <div className="ml-3 mt-1">
                When you meet someone, ask their birthday. If it matches one of these dates, you've found your match!
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default UnifiedDateDisplay;
