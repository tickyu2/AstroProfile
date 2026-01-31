/**
 * TransitsPanel.jsx
 * =================
 *
 * UI component for displaying current transits and celestial guidance.
 * Part of the Liz Greene Cathedral - Phase 1: Living System
 *
 * Features:
 * - Current sky snapshot
 * - Personal transit analysis
 * - Saturn cycle awareness
 * - Weekly/Monthly overview
 * - Luna guidance integration
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  buildPersonalTransitReport,
  getCurrentSkySnapshot,
  getSaturnFocusedReport,
  getWeeklyTransitOverview
} from '../../utils/currentSkyAnalysis';

// =============================================================================
// ASPECT COLORS
// =============================================================================

const ASPECT_COLORS = {
  conjunction: { bg: 'bg-yellow-900/30', border: 'border-yellow-500/40', text: 'text-yellow-300' },
  opposition: { bg: 'bg-red-900/30', border: 'border-red-500/40', text: 'text-red-300' },
  square: { bg: 'bg-orange-900/30', border: 'border-orange-500/40', text: 'text-orange-300' },
  trine: { bg: 'bg-blue-900/30', border: 'border-blue-500/40', text: 'text-blue-300' },
  sextile: { bg: 'bg-green-900/30', border: 'border-green-500/40', text: 'text-green-300' },
  quincunx: { bg: 'bg-pink-900/30', border: 'border-pink-500/40', text: 'text-pink-300' }
};

const PLANET_SYMBOLS = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
  NorthNode: '☊', SouthNode: '☋', Chiron: '⚷'
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function TransitsPanel({ westernData, birthDate }) {
  const [activeView, setActiveView] = useState('today');
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [saturnReport, setSaturnReport] = useState(null);

  // Build natal chart data from westernData
  const natalChart = useMemo(() => {
    if (!westernData) return null;
    return {
      planets: westernData.planets || {},
      sun: westernData.sun,
      moon: westernData.moon,
      Saturn: westernData.planets?.saturn || westernData.planets?.Saturn
    };
  }, [westernData]);

  // Generate reports
  useEffect(() => {
    if (!natalChart) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const transitReport = buildPersonalTransitReport(natalChart);
      const weekly = getWeeklyTransitOverview(natalChart);
      const saturn = getSaturnFocusedReport(natalChart);

      setReport(transitReport);
      setWeeklyReport(weekly);
      setSaturnReport(saturn);
    } catch (error) {
      console.error('Transit report error:', error);
    } finally {
      setLoading(false);
    }
  }, [natalChart]);

  if (loading) {
    return <LoadingState />;
  }

  if (!natalChart || !report) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Unable to generate transit report. Birth chart data required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-light text-white mb-2">Current Transits</h2>
        <p className="text-slate-400">How today's sky affects your chart</p>
        <p className="text-purple-400 text-sm mt-1">{report.date}</p>
      </div>

      {/* View Tabs */}
      <div className="flex justify-center gap-2">
        {['today', 'saturn', 'week'].map(view => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              activeView === view
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
            }`}
          >
            {view === 'today' && 'Today'}
            {view === 'saturn' && 'Saturn Focus'}
            {view === 'week' && 'This Week'}
          </button>
        ))}
      </div>

      {/* Today View */}
      {activeView === 'today' && (
        <TodayView report={report} />
      )}

      {/* Saturn Focus View */}
      {activeView === 'saturn' && saturnReport && (
        <SaturnFocusView report={saturnReport} />
      )}

      {/* Week View */}
      {activeView === 'week' && weeklyReport && (
        <WeekView report={weeklyReport} />
      )}
    </div>
  );
}

// =============================================================================
// TODAY VIEW
// =============================================================================

function TodayView({ report }) {
  const { currentSky, dailyGuidance, majorTransits, saturnCycle, lunaGuidance } = report;

  return (
    <div className="space-y-6">
      {/* Current Sky Snapshot */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-xl p-6">
        <h3 className="text-indigo-300 text-sm uppercase tracking-wider mb-3">
          Current Sky
        </h3>
        <p className="text-white text-lg mb-4">{currentSky.headline}</p>

        {/* Retrograde Alert */}
        {currentSky.retrogradeCount > 0 && (
          <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
            <span className="text-amber-400 text-sm">
              ℞ {currentSky.retrogradeCount} planet{currentSky.retrogradeCount > 1 ? 's' : ''} retrograde:
            </span>
            <span className="text-slate-300 text-sm ml-2">
              {currentSky.retrogradePlanets.join(', ')}
            </span>
          </div>
        )}

        {/* Planet Positions Grid */}
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {Object.values(currentSky.positions).slice(0, 12).map(pos => (
            <div
              key={pos.planet}
              className={`bg-slate-800/50 rounded-lg p-2 text-center ${
                pos.retrograde ? 'border border-amber-500/30' : ''
              }`}
            >
              <div className="text-xl">{PLANET_SYMBOLS[pos.planet] || pos.planet[0]}</div>
              <div className="text-xs text-slate-400">{pos.sign.slice(0, 3)}</div>
              <div className="text-xs text-slate-500">{Math.floor(pos.degree)}°</div>
              {pos.retrograde && <div className="text-xs text-amber-400">℞</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Daily Guidance */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
        <h3 className="text-slate-300 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="text-purple-400">✧</span>
          Daily Guidance
        </h3>
        <p className="text-white text-xl mb-4">{dailyGuidance.headline}</p>

        {dailyGuidance.primaryTransit && (
          <div className="space-y-3">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <span className="text-purple-400 text-sm uppercase">Primary Transit</span>
              <p className="text-slate-300 mt-1">{dailyGuidance.primaryTransit.description}</p>
              <p className="text-slate-400 text-sm mt-2">{dailyGuidance.primaryTransit.interpretation}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-amber-900/20 border border-amber-500/20 rounded-lg p-3">
                <span className="text-amber-400 text-xs uppercase">Challenge</span>
                <p className="text-slate-400 text-sm mt-1">{dailyGuidance.primaryTransit.challenge}</p>
              </div>
              <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-lg p-3">
                <span className="text-emerald-400 text-xs uppercase">Opportunity</span>
                <p className="text-slate-400 text-sm mt-1">{dailyGuidance.primaryTransit.opportunity}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Saturn Cycle Position */}
      {saturnCycle && (
        <div className="bg-gradient-to-r from-slate-800/50 to-purple-900/20 border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-slate-300 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>♄</span>
            Saturn Cycle Position
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl text-purple-400">{saturnCycle.cyclePercentComplete}%</div>
              <div className="text-xs text-slate-500">of cycle</div>
            </div>
            <div>
              <div className="text-white text-lg">{saturnCycle.phaseName}</div>
              <div className="text-slate-400 text-sm">Saturn in {saturnCycle.transitSaturnSign}</div>
            </div>
          </div>

          {/* Cycle Progress Bar */}
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-500"
              style={{ width: `${saturnCycle.cyclePercentComplete}%` }}
            />
          </div>

          {saturnCycle.isReturnWindow && (
            <div className="mt-4 bg-amber-900/30 border border-amber-500/30 rounded-lg p-3">
              <span className="text-amber-300 font-medium">⚠ Saturn Return Window Active</span>
              <p className="text-slate-400 text-sm mt-1">
                This is a major life initiation. Pay attention to what is being restructured.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Major Transits */}
      {majorTransits.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-slate-300 text-sm uppercase tracking-wider flex items-center gap-2">
            <span className="text-amber-400">◇</span>
            Active Major Transits
          </h3>
          {majorTransits.map((transit, idx) => (
            <TransitCard key={idx} transit={transit} />
          ))}
        </div>
      )}

      {/* Luna Guidance */}
      {lunaGuidance && (
        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-purple-300 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>☽</span>
            Luna's Guidance
          </h3>
          <div className="space-y-4">
            <p className="text-slate-300 italic">{lunaGuidance.greeting}</p>

            {lunaGuidance.saturnAwareness && (
              <div className="bg-slate-900/50 rounded-lg p-3">
                <span className="text-purple-400 text-xs uppercase">Saturn Awareness</span>
                <p className="text-slate-400 text-sm mt-1">{lunaGuidance.saturnAwareness}</p>
              </div>
            )}

            <div className="bg-slate-900/50 rounded-lg p-3">
              <span className="text-cyan-400 text-xs uppercase">Today's Focus</span>
              <p className="text-slate-400 text-sm mt-1">{lunaGuidance.transitFocus}</p>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-3">
              <span className="text-green-400 text-xs uppercase">Practical Advice</span>
              <p className="text-slate-400 text-sm mt-1">{lunaGuidance.practicalAdvice}</p>
            </div>

            <p className="text-purple-300 text-center italic mt-4">
              "{lunaGuidance.closingBlessing}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// TRANSIT CARD
// =============================================================================

function TransitCard({ transit }) {
  const [expanded, setExpanded] = useState(false);
  const colors = ASPECT_COLORS[transit.aspect] || ASPECT_COLORS.conjunction;

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-xl overflow-hidden`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{PLANET_SYMBOLS[transit.transitPlanet]}</span>
          <div className="text-left">
            <div className={`${colors.text} font-medium`}>
              {transit.transitPlanet} {transit.symbol} {transit.natalPlanet}
            </div>
            <div className="text-slate-400 text-sm">
              {transit.aspect} • {transit.orb.toFixed(1)}° orb • {transit.applying ? 'Applying' : 'Separating'}
            </div>
          </div>
        </div>
        <span className="text-slate-400">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && transit.interpretation && (
        <div className="px-4 pb-4 border-t border-slate-700/50 pt-4 space-y-3">
          <div>
            <span className="text-slate-500 text-xs uppercase">Theme</span>
            <p className="text-white font-medium">{transit.interpretation.theme}</p>
          </div>

          <div>
            <span className="text-slate-500 text-xs uppercase">Psychological Meaning</span>
            <p className="text-slate-300 text-sm">{transit.interpretation.psychological}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-amber-400 text-xs uppercase">Challenge</span>
              <p className="text-slate-400 text-sm">{transit.interpretation.challenge}</p>
            </div>
            <div>
              <span className="text-green-400 text-xs uppercase">Opportunity</span>
              <p className="text-slate-400 text-sm">{transit.interpretation.opportunity}</p>
            </div>
          </div>

          {transit.interpretation.integration && (
            <div className="bg-slate-900/50 rounded-lg p-3">
              <span className="text-purple-400 text-xs uppercase">Integration</span>
              <p className="text-slate-400 text-sm mt-1">{transit.interpretation.integration}</p>
            </div>
          )}

          {transit.interpretation.lunaPrompt && (
            <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-3">
              <span className="text-purple-400 text-xs uppercase">Luna's Question</span>
              <p className="text-slate-300 text-sm mt-1 italic">"{transit.interpretation.lunaPrompt}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SATURN FOCUS VIEW
// =============================================================================

function SaturnFocusView({ report }) {
  const { saturnCycle, saturnGuidance, saturnTransits } = report;

  return (
    <div className="space-y-6">
      {/* Saturn Cycle Card */}
      <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">♄</span>
          <div>
            <h3 className="text-white text-xl">Your Saturn Cycle</h3>
            <p className="text-slate-400">The Teacher's Current Lesson</p>
          </div>
        </div>

        {saturnCycle && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <div className="text-3xl text-purple-400 font-light">{saturnCycle.cyclePercentComplete}%</div>
                <div className="text-slate-500 text-sm">Cycle Complete</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <div className="text-xl text-white">{saturnCycle.phaseName}</div>
                <div className="text-slate-500 text-sm">Current Phase</div>
              </div>
            </div>

            {/* Cycle Progress */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Return</span>
                <span>Square</span>
                <span>Opposition</span>
                <span>Square</span>
                <span>Return</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full relative">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full transition-all"
                  style={{ width: `${saturnCycle.cyclePercentComplete}%` }}
                />
                {/* Phase markers */}
                <div className="absolute top-0 left-[25%] w-0.5 h-full bg-slate-500" />
                <div className="absolute top-0 left-[50%] w-0.5 h-full bg-slate-500" />
                <div className="absolute top-0 left-[75%] w-0.5 h-full bg-slate-500" />
              </div>
            </div>
          </>
        )}

        {saturnGuidance && (
          <div className="space-y-3 mt-4">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <span className="text-purple-400 text-xs uppercase">Phase Guidance</span>
              <p className="text-slate-300 mt-1">{saturnGuidance.phaseGuidance}</p>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <span className="text-slate-400 text-xs uppercase">Collective Saturn in {saturnGuidance.transitingSaturnSign}</span>
              <p className="text-slate-300 mt-1">{saturnGuidance.collectiveLesson}</p>
            </div>

            <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-4">
              <span className="text-purple-400 text-xs uppercase">Personal Application</span>
              <p className="text-slate-300 mt-1 italic">"{saturnGuidance.personalApplication}"</p>
            </div>
          </div>
        )}
      </div>

      {/* Active Saturn Transits */}
      {saturnTransits && saturnTransits.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-slate-300 text-sm uppercase tracking-wider">
            Active Saturn Transits
          </h3>
          {saturnTransits.map((transit, idx) => (
            <TransitCard key={idx} transit={transit} />
          ))}
        </div>
      )}

      {/* Greene Insight */}
      <div className="bg-slate-800/30 rounded-xl p-6">
        <h3 className="text-slate-300 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="text-purple-400">✧</span>
          Greene's Insight
        </h3>
        <p className="text-slate-300 italic">
          "Saturn transits are initiations. What we resist, we cannot master.
          What we face, becomes our foundation. The Teacher does not punish—
          the Teacher reveals what was never solid."
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// WEEK VIEW
// =============================================================================

function WeekView({ report }) {
  const { days, weekSummary, weeklyGuidance } = report;

  return (
    <div className="space-y-6">
      {/* Week Summary */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-xl p-6">
        <h3 className="text-indigo-300 text-sm uppercase tracking-wider mb-3">
          Week Overview
        </h3>
        <p className="text-slate-300 mb-4">{weeklyGuidance}</p>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl text-purple-400">{weekSummary.averageIntensity}</div>
            <div className="text-xs text-slate-500">Avg Intensity</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 text-center">
            <div className="text-amber-400 text-sm">{weekSummary.peakIntensityDay}</div>
            <div className="text-xs text-slate-500">Peak Day</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 text-center">
            <div className="text-green-400 text-sm">{weekSummary.easiestDay}</div>
            <div className="text-xs text-slate-500">Easiest Day</div>
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="space-y-3">
        <h3 className="text-slate-300 text-sm uppercase tracking-wider">
          Daily Breakdown
        </h3>
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`bg-slate-800/30 border rounded-xl p-4 ${
              day.dayName === weekSummary.peakIntensityDay
                ? 'border-amber-500/40'
                : day.dayName === weekSummary.easiestDay
                  ? 'border-green-500/40'
                  : 'border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-white font-medium">{day.dayName}</span>
                <span className="text-slate-500 text-sm">{day.date}</span>
              </div>
              <IntensityBadge intensity={day.intensity} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">{day.headline}</span>
              {day.majorTransitCount > 0 && (
                <span className="text-purple-400 text-xs">
                  {day.majorTransitCount} major transit{day.majorTransitCount > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Intensity bar */}
            <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  day.intensity > 70 ? 'bg-amber-500' :
                    day.intensity > 40 ? 'bg-purple-500' : 'bg-green-500'
                }`}
                style={{ width: `${day.intensity}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// UTILITY COMPONENTS
// =============================================================================

function IntensityBadge({ intensity }) {
  let colorClass, label;

  if (intensity > 70) {
    colorClass = 'bg-amber-900/50 text-amber-300 border-amber-500/40';
    label = 'High';
  } else if (intensity > 40) {
    colorClass = 'bg-purple-900/50 text-purple-300 border-purple-500/40';
    label = 'Moderate';
  } else {
    colorClass = 'bg-green-900/50 text-green-300 border-green-500/40';
    label = 'Low';
  }

  return (
    <span className={`px-2 py-1 rounded border text-xs ${colorClass}`}>
      {label} ({intensity})
    </span>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="animate-pulse text-4xl mb-4">♄</div>
        <p className="text-slate-400">Calculating transits...</p>
      </div>
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default TransitsPanel;
