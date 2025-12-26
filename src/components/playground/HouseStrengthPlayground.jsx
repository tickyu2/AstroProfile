/**
 * HouseStrengthPlayground Component
 *
 * Parent container for the Soul Garden Cathedral.
 * Three vertical panels tuned to golden ratio (φ = 1.618):
 *   1. The Nave (Bar Chart) - Human Effort - height: base (200px)
 *   2. The Cloister (Vine Garden) - Living Soul - height: base × φ (324px)
 *   3. The Rose Window (Radial Flower) - Divine Order - height: base × φ² (524px)
 *
 * Features:
 *   - Alchemical Mode toggle (full ceremony vs contemplative)
 *   - Sacred Legend explaining the three naves
 *   - φ-based proportions throughout
 *   - 8th house as alchemical portal
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { fetchHouseStrengthTimeline } from '../../services/houseStrengthService';
import TimeScroller from './TimeScroller';
import HouseVineChart from './HouseVineChart';
import SoulGardenVines from './SoulGardenVines';
import RadialSoulFlower from './RadialSoulFlower';
import NarrationPanel from './NarrationPanel';
import SoulProfileSummary from './SoulProfileSummary';
import LifeChaptersPanel from './LifeChaptersPanel';
import LetterFromChart from './LetterFromChart';
import CathedralAnalysisModal from './CathedralAnalysisModal';
import OrnamentalFrame from './OrnamentalFrame';
import AlchemicalToggle from './AlchemicalToggle';
import SacredLegend from './SacredLegend';
import './soulGardenAnimations.css';

// Golden ratio constants
const PHI = 1.618;
const PHI_SQ = PHI * PHI; // 2.618

// φ-based panel heights (base = 200px)
const PANEL_HEIGHTS = {
  nave: 200,              // base
  cloister: 200 * PHI,    // 324px
  roseWindow: 200 * PHI_SQ // 524px
};

// Sign rulers for computing ascendant ruler chain
const SIGN_RULERS = {
  Aries: 'Mars',
  Taurus: 'Venus',
  Gemini: 'Mercury',
  Cancer: 'Moon',
  Leo: 'Sun',
  Virgo: 'Mercury',
  Libra: 'Venus',
  Scorpio: 'Mars',      // Traditional ruler (modern: Pluto)
  Sagittarius: 'Jupiter',
  Capricorn: 'Saturn',
  Aquarius: 'Saturn',   // Traditional ruler (modern: Uranus)
  Pisces: 'Jupiter'     // Traditional ruler (modern: Neptune)
};

/**
 * Parse a time string (HH:MM) to minutes since midnight
 */
function timeToMinutes(timeStr) {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

/**
 * Find the nearest time slice index for a given time
 */
function findNearestSliceIndex(timeline, targetTimeStr) {
  if (!timeline || !timeline.length || !targetTimeStr) return 0;

  const targetMinutes = timeToMinutes(targetTimeStr);
  if (targetMinutes === null) return 0;

  let nearestIdx = 0;
  let smallestDiff = Infinity;

  timeline.forEach((slice, idx) => {
    const sliceMinutes = timeToMinutes(slice.timeLabel);
    if (sliceMinutes !== null) {
      const diff = Math.abs(sliceMinutes - targetMinutes);
      if (diff < smallestDiff) {
        smallestDiff = diff;
        nearestIdx = idx;
      }
    }
  });

  return nearestIdx;
}

export default function HouseStrengthPlayground({
  birthDate,
  latitude,
  longitude,
  timezone = 0,
  specificTime = null // New: optional specific time to focus on (e.g., "14:30")
}) {
  const [timeline, setTimeline] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [alchemicalMode, setAlchemicalMode] = useState(true);
  const [focusedTime, setFocusedTime] = useState(null); // Track the specific time user requested
  const [focusedIndex, setFocusedIndex] = useState(null); // Track the index of the focused time slice
  const [isTimeLocked, setIsTimeLocked] = useState(true); // Lock time selection by default when profile has birth time
  const [showSummary, setShowSummary] = useState(false); // Toggle for Soul Profile Summary panel
  const [showChapters, setShowChapters] = useState(false); // Toggle for Life Chapters panel
  const [showLetter, setShowLetter] = useState(false); // Toggle for Letter From Chart modal
  const [showCathedral, setShowCathedral] = useState(false); // Toggle for Cathedral Analysis modal

  // Load timeline data
  useEffect(() => {
    async function load() {
      if (!birthDate || latitude == null || longitude == null) {
        return;
      }

      try {
        setLoading(true);
        setError('');
        console.log('🏛️ Soul Garden Cathedral: Loading timeline...', { birthDate, latitude, longitude, timezone, specificTime });

        const data = await fetchHouseStrengthTimeline({ birthDate, latitude, longitude, timezone });
        const loadedTimeline = data.timeline || [];
        setTimeline(loadedTimeline);

        // If a specific time is provided, find and select the nearest slice
        if (specificTime && loadedTimeline.length > 0) {
          const nearestIdx = findNearestSliceIndex(loadedTimeline, specificTime);
          setSelectedIndex(nearestIdx);
          setFocusedTime(specificTime);
          setFocusedIndex(nearestIdx);
          console.log('🏛️ Soul Garden: Focused on specific time', {
            specificTime,
            nearestSlice: loadedTimeline[nearestIdx]?.timeLabel,
            index: nearestIdx
          });
        } else {
          setSelectedIndex(0);
          setFocusedTime(null);
          setFocusedIndex(null);
        }

        console.log('🏛️ Soul Garden Cathedral: Timeline loaded', {
          slices: loadedTimeline.length
        });
      } catch (err) {
        console.error('🏛️ Soul Garden Cathedral Error:', err);
        setError(err.message || 'Failed to load timeline');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [birthDate, latitude, longitude, timezone, specificTime]);

  // Handle time selection (only when unlocked)
  const handleTimeSelect = useCallback((index) => {
    if (!isTimeLocked) {
      setSelectedIndex(index);
    }
  }, [isTimeLocked]);

  // Reset to the original birth time
  const handleResetToBirthTime = useCallback(() => {
    if (focusedIndex !== null) {
      setSelectedIndex(focusedIndex);
      setIsTimeLocked(true);
      console.log('🏛️ Soul Garden: Reset to birth time', { focusedTime, focusedIndex });
    }
  }, [focusedIndex, focusedTime]);

  // Toggle time lock
  const handleToggleLock = useCallback(() => {
    setIsTimeLocked(prev => !prev);
    console.log('🏛️ Soul Garden: Time lock toggled', { newState: !isTimeLocked });
  }, [isTimeLocked]);

  // Check if currently viewing a different time than birth time
  const isViewingWhatIf = focusedIndex !== null && selectedIndex !== focusedIndex;

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-b from-indigo-950 via-blue-950 to-slate-900 rounded-xl border border-cyan-500/30">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-sm text-cyan-300">Building the alchemical cathedral...</div>
          <div className="text-xs text-white/40 mt-1">Computing 96 time slices with φ proportions</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-b from-red-950/50 via-slate-900 to-slate-900 rounded-xl border border-red-500/30">
        <div className="text-center">
          <div className="text-red-400 text-2xl mb-2">⚠️</div>
          <div className="text-sm text-red-300">{error}</div>
        </div>
      </div>
    );
  }

  // No data state
  if (!timeline.length) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-b from-indigo-950 via-blue-950 to-slate-900 rounded-xl border border-cyan-500/20">
        <div className="text-center text-white/50">
          <div className="text-3xl mb-2">🏛️</div>
          <div className="text-sm">Enter birth date and location to build the cathedral</div>
        </div>
      </div>
    );
  }

  const currentSlice = timeline[selectedIndex];
  const modeClass = alchemicalMode ? 'alchemical' : 'contemplative';

  return (
    <div className={`bg-gradient-to-b from-indigo-950 via-blue-950 to-slate-900 rounded-xl border border-cyan-500/30 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.15)] ${modeClass}`}>
      {/* Header */}
      <div className="p-4 border-b border-cyan-500/20 bg-indigo-950/50">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-medium text-cyan-300 flex items-center gap-2">
              <span className="text-lg">{alchemicalMode ? '⚗️' : '🏛️'}</span>
              Soul Garden Cathedral
            </h3>
            <p className="text-xs text-white/50 mt-0.5">
              {birthDate} • {latitude?.toFixed(2)}°N, {longitude?.toFixed(2)}°E
              {focusedTime && (
                <span className="ml-2 text-cyan-400 font-medium">
                  • Birth: {focusedTime}
                </span>
              )}
              {isViewingWhatIf && (
                <span className="ml-2 text-emerald-400 font-medium animate-pulse">
                  • What-If: {timeline[selectedIndex]?.timeLabel}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-xs text-cyan-400/60 hidden md:block">
              φ = 1.618 • 96 time slices
            </div>

            {/* Time Lock Toggle - only show when there's a focused time */}
            {focusedTime && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleLock}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1.5
                    ${isTimeLocked
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    }
                  `}
                  title={isTimeLocked ? 'Click to unlock and explore other times' : 'Click to lock time selection'}
                >
                  <span>{isTimeLocked ? '🔒' : '🔓'}</span>
                  <span className="hidden sm:inline">{isTimeLocked ? 'Unlock Time' : 'Exploring'}</span>
                </button>

                {/* Reset to Birth Time - show when viewing a different time */}
                {isViewingWhatIf && (
                  <button
                    onClick={handleResetToBirthTime}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 transition-all duration-300 flex items-center gap-1.5"
                    title="Reset to birth time"
                  >
                    <span>↻</span>
                    <span className="hidden sm:inline">Birth Time</span>
                  </button>
                )}
              </div>
            )}

            {/* Soul Profile Summary Toggle */}
            <button
              onClick={() => setShowSummary(prev => !prev)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1.5
                ${showSummary
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-700/50 text-white/60 border border-white/10 hover:bg-slate-700'
                }
              `}
              title="Toggle Soul Profile Summary"
            >
              <span>📜</span>
              <span className="hidden sm:inline">{showSummary ? 'Hide' : 'Show'} Summary</span>
            </button>

            {/* Life Chapters Toggle */}
            <button
              onClick={() => setShowChapters(prev => !prev)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1.5
                ${showChapters
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-700/50 text-white/60 border border-white/10 hover:bg-slate-700'
                }
              `}
              title="Toggle Life Chapters"
            >
              <span>📖</span>
              <span className="hidden sm:inline">{showChapters ? 'Hide' : 'Show'} Chapters</span>
            </button>

            {/* Letter From Chart Button */}
            <button
              onClick={() => setShowLetter(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1.5 bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-200 border border-purple-500/40 hover:from-purple-600/50 hover:to-pink-600/50"
              title="Receive a letter from your chart"
            >
              <span>✨</span>
              <span className="hidden sm:inline">Soul Letter</span>
            </button>

            {/* Cathedral Analysis Button - The Flagship Feature */}
            <button
              onClick={() => setShowCathedral(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1.5 bg-gradient-to-r from-amber-600/30 to-orange-600/30 text-amber-200 border border-amber-500/40 hover:from-amber-600/50 hover:to-orange-600/50 shadow-lg shadow-amber-500/10"
              title="Complete Cathedral Analysis - Full soul reading"
            >
              <span>⛪</span>
              <span className="hidden sm:inline">Cathedral Reading</span>
            </button>

            <AlchemicalToggle
              enabled={alchemicalMode}
              onToggle={setAlchemicalMode}
            />
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex" style={{ minHeight: `${PANEL_HEIGHTS.nave + PANEL_HEIGHTS.cloister + PANEL_HEIGHTS.roseWindow + 200}px` }}>
        {/* Left: Time Scroller */}
        <TimeScroller
          timeline={timeline}
          selectedIndex={selectedIndex}
          onSelect={handleTimeSelect}
          focusedIndex={focusedIndex}
          isLocked={isTimeLocked}
        />

        {/* Center: Three Vertical Panels (The Cathedral Naves) */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto soul-scroll">

          {/* Sacred Legend */}
          <SacredLegend alchemical={alchemicalMode} />

          {/* Panel 1 — The Nave (Bar Chart - Human Effort) */}
          <div
            className={`rounded-xl border border-emerald-500/30 overflow-hidden mb-4 ${alchemicalMode ? 'soul-panel' : ''}`}
            style={{
              minHeight: `${PANEL_HEIGHTS.nave}px`,
              background: 'linear-gradient(to bottom, rgba(30,27,75,0.9), rgba(15,23,42,0.95))'
            }}
          >
            <OrnamentalFrame color="#34d399">
              <div className="p-3 h-full">
                <HouseVineChart slice={currentSlice} alchemical={alchemicalMode} />
              </div>
            </OrnamentalFrame>
          </div>

          {/* Panel 2 — The Cloister (Vine Garden - Living Soul) */}
          <div
            className={`rounded-xl border border-purple-500/30 overflow-hidden mb-4 ${alchemicalMode ? 'soul-panel' : ''}`}
            style={{
              minHeight: `${PANEL_HEIGHTS.cloister}px`,
              background: 'linear-gradient(to bottom, rgba(15,23,42,0.95), rgba(2,6,23,0.98))'
            }}
          >
            <OrnamentalFrame color="#a78bfa">
              <div className="p-3 h-full">
                <SoulGardenVines slice={currentSlice} alchemical={alchemicalMode} />
              </div>
            </OrnamentalFrame>
          </div>

          {/* Panel 3 — The Rose Window (Radial Flower - Divine Order) */}
          <div
            className={`rounded-xl border border-amber-500/30 overflow-hidden ${alchemicalMode ? 'soul-panel' : ''}`}
            style={{
              minHeight: `${PANEL_HEIGHTS.roseWindow}px`,
              background: 'linear-gradient(to bottom, rgba(30,27,75,0.9), rgba(15,23,42,0.95))'
            }}
          >
            <OrnamentalFrame color="#f6ad55">
              <div className="p-3 h-full">
                <RadialSoulFlower slice={currentSlice} alchemical={alchemicalMode} />
              </div>
            </OrnamentalFrame>
          </div>

          {/* Soul Profile Summary Panel (Toggleable) */}
          {showSummary && (() => {
            // Use planets array from backend if available (new format with full data)
            // Otherwise extract from houses (legacy fallback)
            const extractedPlanets = currentSlice?.planets ||
              currentSlice?.houses?.flatMap(house =>
                // Prefer planetData array (full objects) over planets array (strings)
                (house.planetData || house.planets || []).map(planet => {
                  // Handle planet as string or object
                  const planetData = typeof planet === 'string'
                    ? { name: planet, planet: planet }
                    : planet;
                  return {
                    ...planetData,
                    house: planetData.house || house.house,
                    sign: planetData.sign || house.sign,
                    degree: planetData.degree ?? null,
                    retrograde: planetData.retrograde || false
                  };
                })
              ) || [];

            // Use ascendant from backend if available (new format with ruler chain)
            // Otherwise compute ruler chain from first house
            const extractedAscendant = (() => {
              // If backend provides complete ascendant data, use it
              if (currentSlice?.ascendant?.ruler) {
                return currentSlice.ascendant;
              }

              // Get basic ascendant info from first house
              const house1 = currentSlice?.houses?.find(h => h.house === 1);
              const ascendantSign = currentSlice?.ascendant?.sign || house1?.sign;
              const ascendantDegree = currentSlice?.ascendant?.degree ?? house1?.degree ?? null;

              if (!ascendantSign) return null;

              // Compute ruler chain
              const ruler = SIGN_RULERS[ascendantSign] || null;
              let rulerSign = null;
              let rulerHouse = null;

              if (ruler && extractedPlanets.length > 0) {
                // Find the ruler planet in the planets array
                const rulerPlanet = extractedPlanets.find(p =>
                  (p.name || p.planet || '').toLowerCase() === ruler.toLowerCase()
                );
                if (rulerPlanet) {
                  rulerSign = rulerPlanet.sign;
                  rulerHouse = rulerPlanet.house;
                }
              }

              return {
                sign: ascendantSign,
                degree: ascendantDegree,
                ruler: ruler,
                rulerSign: rulerSign,
                rulerHouse: rulerHouse
              };
            })();

            return (
              <div className="mt-4">
                <SoulProfileSummary
                  birthData={{
                    date: birthDate,
                    time: currentSlice?.timeLabel || specificTime,
                    latitude,
                    longitude,
                    timezone
                  }}
                  slice={currentSlice}
                  planets={extractedPlanets}
                  aspects={currentSlice?.aspects || []}
                  ascendant={extractedAscendant}
                  alchemical={alchemicalMode}
                />
              </div>
            );
          })()}

          {/* Life Chapters Panel (Toggleable) */}
          {showChapters && (() => {
            // Build chart object for epoch generation
            const chartForEpochs = {
              planets: currentSlice?.planets || currentSlice?.houses?.flatMap(house =>
                (house.planetData || house.planets || []).map(planet => {
                  const planetData = typeof planet === 'string'
                    ? { name: planet, planet: planet }
                    : planet;
                  return {
                    ...planetData,
                    house: planetData.house || house.house,
                    sign: planetData.sign || house.sign,
                    degree: planetData.degree ?? null,
                    retrograde: planetData.retrograde || false
                  };
                })
              ) || [],
              houses: currentSlice?.houses || [],
              aspects: currentSlice?.aspects || [],
              rising: currentSlice?.ascendant || {
                sign: currentSlice?.houses?.find(h => h.house === 1)?.sign || 'Aries'
              }
            };

            const risingSign = chartForEpochs.rising?.sign || 'Aries';

            return (
              <div className="mt-4">
                <LifeChaptersPanel
                  chart={chartForEpochs}
                  risingSign={risingSign}
                  birthDate={birthDate}
                  showAll={false}
                  maxVisible={8}
                />
              </div>
            );
          })()}

        </div>

        {/* Right: Narration */}
        <NarrationPanel slice={currentSlice} alchemical={alchemicalMode} />
      </div>

      {/* Footer - φ proportions display */}
      <div className="p-4 border-t border-cyan-500/20 bg-indigo-950/30">
        <div className="flex items-center justify-center gap-6 text-[10px] text-white/40 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">Nave</span>
            <span className="text-white/30">•</span>
            <span>1 : {PHI.toFixed(3)} : {PHI_SQ.toFixed(3)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Cloister</span>
            <span className="text-white/30">•</span>
            <span>φ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400">Rose Window</span>
            <span className="text-white/30">•</span>
            <span>φ²</span>
          </div>
          {alchemicalMode && (
            <div className="flex items-center gap-2 ml-4 border-l border-white/20 pl-4">
              <span className="text-purple-300">8th House</span>
              <span className="text-white/30">•</span>
              <span>9 + φ rhythm</span>
            </div>
          )}
        </div>
      </div>

      {/* Letter From Chart Modal */}
      <LetterFromChart
        slice={currentSlice}
        birthData={{
          date: birthDate,
          time: currentSlice?.timeLabel || specificTime,
          latitude,
          longitude
        }}
        risingSign={currentSlice?.ascendant?.sign || 'Unknown'}
        isOpen={showLetter}
        onClose={() => setShowLetter(false)}
      />

      {/* Cathedral Analysis Modal - The Flagship Feature */}
      <CathedralAnalysisModal
        slice={currentSlice}
        birthData={{
          date: birthDate,
          time: currentSlice?.timeLabel || specificTime,
          latitude,
          longitude
        }}
        risingSign={currentSlice?.ascendant?.sign || 'Unknown'}
        isOpen={showCathedral}
        onClose={() => setShowCathedral(false)}
      />
    </div>
  );
}
