/**
 * ZodiacLearningPage.jsx
 * ======================
 *
 * Full page for the Western Zodiac Academy - an interactive tool for exploring
 * how zodiac blends shape identity through the golden ratio cusp curve.
 *
 * Layout: Top profile selector, large centered wheel, explanation panel below
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';
import {
  ZodiacBlendWheel,
  CompatibilityPanel,
  ZodiacEducationFlaps,
  CuspSliderInteractive,
  CompatibilityCalendarHeatmap,
} from '../components/zodiac';
import { ZodiacExplanationPanel } from '../components/zodiac';
import {
  generateWheelHighlights,
  computeDayCompatibility,
  createProfileFromDayBlend,
} from '../data/compatibilityEngine';
import { GRADE_COLORS } from '../data/compatibilityTypes';
import { getBlendForDate } from '../data/zodiacBlendData';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const SIGN_GLYPHS = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
};

function getSignGlyph(sign) {
  return SIGN_GLYPHS[sign] || '?';
}

function formatBirthDateForWheel(profile) {
  const birthDate = profile?.birthDate || profile?.dateOfBirth;
  if (!birthDate) return null;

  // Parse manually to avoid timezone shift (ISO dates parsed as UTC)
  const parts = birthDate.split('-');
  if (parts.length !== 3) return null;

  const [year, month, day] = parts.map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatBirthDateDisplay(profile) {
  const birthDate = profile?.birthDate || profile?.dateOfBirth;
  if (!birthDate) return null;

  // Parse manually to avoid timezone shift (ISO dates parsed as UTC)
  const parts = birthDate.split('-');
  if (parts.length !== 3) return null;

  const [year, month, day] = parts.map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

  // Create date using local timezone (not UTC)
  const date = new Date(year, month - 1, day);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayOfWeek = days[date.getDay()];

  return `${dayOfWeek} ${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Format ISO date string as "April 23" (no year, natural format)
 */
function formatDateNatural(dateStr) {
  if (!dateStr) return null;
  // Parse manually to avoid timezone issues with ISO dates
  const [, month, day] = dateStr.split('-').map(Number);
  const date = new Date(2000, month - 1, day); // Year doesn't matter
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

/**
 * Shift a date string (YYYY-MM-DD) by N days
 */
function shiftDate(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const ny = date.getFullYear();
  const nm = String(date.getMonth() + 1).padStart(2, '0');
  const nd = String(date.getDate()).padStart(2, '0');
  return `${ny}-${nm}-${nd}`;
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function ZodiacLearningPage() {
  const navigate = useNavigate();
  const { profiles, loading: profilesLoading } = useProfiles();

  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [wheelYear, setWheelYear] = useState(new Date().getFullYear());
  const [hoveredDay, setHoveredDay] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  // 36-Position cusps popup
  const [showCuspsPopup, setShowCuspsPopup] = useState(false);

  // Compatibility mode state
  const [compatibilityMode, setCompatibilityMode] = useState(false);
  const [anchorDay, setAnchorDay] = useState(null);
  const [compatibilityHighlights, setCompatibilityHighlights] = useState(null);
  const [compatibilityResult, setCompatibilityResult] = useState(null);

  // Get selected profile
  const selectedProfile = useMemo(() => {
    return profiles?.find(p => p.id === selectedProfileId) || null;
  }, [profiles, selectedProfileId]);

  // Get birth date for wheel
  const birthDateStr = useMemo(() => {
    return formatBirthDateForWheel(selectedProfile);
  }, [selectedProfile]);

  // Import getBlendForDate dynamically for birth blend info
  const [birthBlend, setBirthBlend] = useState(null);

  useEffect(() => {
    const loadBlend = async () => {
      if (birthDateStr) {
        const { getBlendForDate } = await import('../data/zodiacBlendData');
        setBirthBlend(getBlendForDate(birthDateStr));
      } else {
        setBirthBlend(null);
      }
    };
    loadBlend();
  }, [birthDateStr]);

  // Generate compatibility highlights when anchor day changes
  useEffect(() => {
    if (compatibilityMode && anchorDay) {
      const anchorProfile = createProfileFromDayBlend(anchorDay);
      const highlights = generateWheelHighlights(anchorProfile, wheelYear);
      setCompatibilityHighlights(highlights);
    } else {
      setCompatibilityHighlights(null);
    }
  }, [compatibilityMode, anchorDay, wheelYear]);

  // Compute compatibility result when selected day changes in compatibility mode
  useEffect(() => {
    if (compatibilityMode && anchorDay && selectedDay) {
      const result = computeDayCompatibility(anchorDay, selectedDay);
      setCompatibilityResult(result);
    } else {
      setCompatibilityResult(null);
    }
  }, [compatibilityMode, anchorDay, selectedDay]);

  // Toggle compatibility mode
  const handleToggleCompatibility = useCallback(() => {
    if (!compatibilityMode) {
      // Entering compatibility mode - use selected day or birth blend as anchor
      const anchor = selectedDay || birthBlend;
      if (anchor) {
        setAnchorDay(anchor);
        setCompatibilityMode(true);
        setSelectedDay(null);
        setIsLocked(false);
        setCompatibilityResult(null);
      }
    } else {
      // Exiting compatibility mode
      setCompatibilityMode(false);
      setAnchorDay(null);
      setCompatibilityHighlights(null);
      setCompatibilityResult(null);
    }
  }, [compatibilityMode, selectedDay, birthBlend]);

  // Handle day selection
  const handleDaySelect = (day) => {
    // Validate day object has required properties
    if (!day || !day.date || !day.primarySign) {
      console.warn('handleDaySelect: Invalid day object received', day);
      return;
    }

    if (selectedDay?.date === day.date) {
      setIsLocked(false);
      setSelectedDay(null);
    } else {
      setIsLocked(true);
      setSelectedDay(day);
      setHoveredDay(day);
    }
  };

  // Handle hover
  const handleDayHover = (day) => {
    if (!isLocked) {
      setHoveredDay(day);
    }
  };

  // Clear selection
  const handleClearSelection = () => {
    setIsLocked(false);
    setSelectedDay(null);
    setHoveredDay(null);
  };

  // --- Momentum navigation for arrow buttons ---
  const moveTimerRef = useRef(null);
  const moveDelayRef = useRef(400);

  const moveDate = useCallback((direction) => {
    setSelectedDay(prev => {
      if (!prev?.date) return prev;
      const newDateStr = shiftDate(prev.date, direction);
      const newBlend = getBlendForDate(newDateStr);
      if (!newBlend) return prev;
      setHoveredDay(newBlend);
      // Update wheel year if we crossed a year boundary
      const newYear = parseInt(newDateStr.split('-')[0], 10);
      setWheelYear(wy => wy !== newYear ? newYear : wy);
      return newBlend;
    });
  }, []);

  const startMove = useCallback((direction) => {
    moveDate(direction);
    moveDelayRef.current = 400;

    const tick = () => {
      moveDate(direction);
      moveDelayRef.current = Math.max(50, moveDelayRef.current * 0.8);
      moveTimerRef.current = setTimeout(tick, moveDelayRef.current);
    };
    moveTimerRef.current = setTimeout(tick, moveDelayRef.current);
  }, [moveDate]);

  const stopMove = useCallback(() => {
    if (moveTimerRef.current) {
      clearTimeout(moveTimerRef.current);
      moveTimerRef.current = null;
    }
    moveDelayRef.current = 400;
  }, []);

  useEffect(() => {
    return () => {
      if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
    };
  }, []);

  // Keyboard arrow navigation (momentum style, only when locked)
  const keyDirRef = useRef(null);

  useEffect(() => {
    if (!isLocked || compatibilityMode) return;

    const handleKeyDown = (e) => {
      if (e.repeat) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        keyDirRef.current = 1;  // ← = Forward (clockwise)
        startMove(1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        keyDirRef.current = -1; // → = Backward (counter-clockwise)
        startMove(-1);
      }
    };
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' && keyDirRef.current === 1) {
        stopMove();
        keyDirRef.current = null;
      } else if (e.key === 'ArrowRight' && keyDirRef.current === -1) {
        stopMove();
        keyDirRef.current = null;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      stopMove();
      keyDirRef.current = null;
    };
  }, [isLocked, compatibilityMode, startMove, stopMove]);

  // The day to display
  const displayDay = isLocked ? selectedDay : hoveredDay;

  // Loading state
  if (profilesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">☉</div>
          <p className="text-blue-300">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Top Bar - Profile Selector */}
      <div className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left side - Profile selector */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Profile:</span>
                <select
                  value={selectedProfileId}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none min-w-[200px]"
                >
                  <option value="">-- Select a Profile --</option>
                  {profiles?.map(profile => (
                    <option key={profile.id} value={profile.id}>
                      {profile.displayName || profile.name || 'Unknown'} {birthBlend && profile.id === selectedProfileId ? `${getSignGlyph(birthBlend.primarySign)}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              {selectedProfile && (
                <div className="text-xs text-gray-500 pl-12">
                  Birth Date: {formatBirthDateDisplay(selectedProfile) || 'Not set'}
                </div>
              )}
            </div>

            {/* Dashboard link */}
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← Dashboard
            </button>
          </div>

          {/* Right side - Year selector and title */}
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-xl">☉</span>
              Western Zodiac Academy
            </h1>

            {/* Full Curriculum Link */}
            <button
              onClick={() => navigate('/zodiac-academy')}
              className="px-4 py-2 rounded-lg font-medium transition-all bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/20"
            >
              📚 Full Curriculum
            </button>

            {/* Compatibility Mode Toggle */}
            <button
              onClick={handleToggleCompatibility}
              disabled={!birthBlend && !selectedDay}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                compatibilityMode
                  ? 'bg-gradient-to-r from-amber-500 to-cyan-500 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              } ${!birthBlend && !selectedDay ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {compatibilityMode ? '✨ Exit Compatibility' : '🔥💧 Compatibility Mode'}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setWheelYear(y => y - 1)}
                className="px-3 py-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition-colors"
              >
                ←
              </button>
              <span className="text-white font-medium w-16 text-center">{wheelYear}</span>
              <button
                onClick={() => setWheelYear(y => y + 1)}
                className="px-3 py-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition-colors"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Profile Info Bar */}
      {selectedProfile && birthBlend && !compatibilityMode && (
        <div className="bg-slate-800/30 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-4 text-sm">
            <span className="text-gray-400">Viewing:</span>
            <span className="text-white font-medium">{selectedProfile.displayName || selectedProfile.name}</span>
            <span className="text-2xl">{getSignGlyph(birthBlend.primarySign)}</span>
            <span className="text-blue-300">{birthBlend.primarySign}</span>
            {birthBlend.cuspType !== 'none' && birthBlend.blendSign && (
              <>
                <span className="text-gray-500">•</span>
                <span className="text-purple-300">
                  {birthBlend.cuspType === 'backward' ? 'Emerging from' : 'Transitioning to'} {birthBlend.blendSign}
                </span>
                <span className="text-gray-500">({Math.round(birthBlend.blendPercent * 100)}% blend)</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Compatibility Mode Info Bar */}
      {compatibilityMode && anchorDay && (
        <div className="bg-gradient-to-r from-amber-900/30 to-cyan-900/30 border-b border-amber-500/30">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-4 text-sm">
            <span className="text-amber-300 font-medium">🔥 Compatibility Mode Active</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-300">Anchor:</span>
            <span className="text-2xl">{getSignGlyph(anchorDay.primarySign)}</span>
            <span className="text-amber-200 font-medium">{anchorDay.primarySign}</span>
            <span className="text-gray-500">({formatDateNatural(anchorDay.date)})</span>
            <span className="text-gray-400">|</span>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ background: GRADE_COLORS.A.fill }}></span>
                <span style={{ color: GRADE_COLORS.A.fill }}>Grade A</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ background: GRADE_COLORS.B.fill }}></span>
                <span style={{ color: GRADE_COLORS.B.fill }}>Grade B</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ background: GRADE_COLORS.Neutral.fill }}></span>
                <span style={{ color: GRADE_COLORS.Neutral.fill }}>Neutral</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Wheel + Education Flaps */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          {/* Left Side: Wheel and Explanation Panel */}
          <div className="flex flex-col items-center">
            {/* The Wheel */}
            <ZodiacBlendWheel
              year={wheelYear}
              width={560}
              height={560}
              showTodayMarker={false}
              birthDate={birthDateStr}
              selectedDate={selectedDay?.date}
              onDaySelect={handleDaySelect}
              onDayHover={handleDayHover}
              onClearSelection={handleClearSelection}
              interactive={true}
              animate={false}
              hideTooltip={!compatibilityMode}
              compatibilityMode={compatibilityMode}
              compatibilityHighlights={compatibilityHighlights}
            />

            {/* Lock indicator + Navigation Arrows - below the wheel */}
            {isLocked && !compatibilityMode && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '10px',
                width: '100%',
                maxWidth: '560px',
              }}>
                <button
                  onMouseDown={() => startMove(1)}
                  onMouseUp={stopMove}
                  onMouseLeave={stopMove}
                  onTouchStart={(e) => { e.preventDefault(); startMove(1); }}
                  onTouchEnd={stopMove}
                  style={{
                    padding: '6px 14px',
                    background: 'rgba(0, 212, 255, 0.10)',
                    border: '1px solid rgba(0, 212, 255, 0.30)',
                    borderRadius: '10px',
                    color: '#00d4ff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'background 0.2s',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                  }}
                  onPointerEnter={(e) => e.currentTarget.style.background = 'rgba(0, 212, 255, 0.22)'}
                  onPointerLeave={(e) => { e.currentTarget.style.background = 'rgba(0, 212, 255, 0.10)'; stopMove(); }}
                >
                  <span style={{ fontSize: '16px' }}>◀</span> Fwd
                </button>

                <div className="flex items-center gap-2 px-4 py-1.5 bg-cyan-500/20 border border-cyan-500/40 rounded-full">
                  <span className="text-cyan-300 text-sm">🔒 Locked on {formatDateNatural(selectedDay?.date)}</span>
                  <button
                    onClick={handleClearSelection}
                    className="text-cyan-300 hover:text-white transition-colors ml-1"
                  >
                    ×
                  </button>
                </div>

                <button
                  onMouseDown={() => startMove(-1)}
                  onMouseUp={stopMove}
                  onMouseLeave={stopMove}
                  onTouchStart={(e) => { e.preventDefault(); startMove(-1); }}
                  onTouchEnd={stopMove}
                  style={{
                    padding: '6px 14px',
                    background: 'rgba(0, 212, 255, 0.10)',
                    border: '1px solid rgba(0, 212, 255, 0.30)',
                    borderRadius: '10px',
                    color: '#00d4ff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'background 0.2s',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                  }}
                  onPointerEnter={(e) => e.currentTarget.style.background = 'rgba(0, 212, 255, 0.22)'}
                  onPointerLeave={(e) => { e.currentTarget.style.background = 'rgba(0, 212, 255, 0.10)'; stopMove(); }}
                >
                  Back <span style={{ fontSize: '16px' }}>▶</span>
                </button>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-3 text-center text-sm text-gray-400">
              {!compatibilityMode ? (
                <>
                  {birthDateStr && <><span className="text-pink-400">●</span> Birth Date &nbsp;</>}
                  <span className="text-cyan-400">●</span> Selected &nbsp;
                  <span className="mx-4">|</span>
                  <span>Hover to explore • Click to lock</span>
                </>
              ) : (
                <>
                  <span style={{ color: GRADE_COLORS.A.fill }}>●</span> Grade A (Natural Harmony) &nbsp;
                  <span style={{ color: GRADE_COLORS.B.fill }}>●</span> Grade B (Growth Potential) &nbsp;
                  <span style={{ color: GRADE_COLORS.Neutral.fill }}>●</span> Neutral (Same Element) &nbsp;
                  <span className="mx-4">|</span>
                  <span>Click any day to see compatibility chemistry</span>
                </>
              )}
            </div>

            {/* Explanation/Compatibility Panel - Below the Wheel */}
            <div className="mt-6 w-full max-w-xl">
              {compatibilityMode ? (
                <>
                  <CompatibilityPanel
                    result={compatibilityResult}
                    expanded={true}
                    theme="dark"
                    breathe={!!compatibilityResult}
                  />
                  {/* Year-at-a-Glance Heatmap */}
                  <div className="mt-4">
                    <CompatibilityCalendarHeatmap
                      anchorDate={anchorDay?.date}
                      anchorBlend={anchorDay}
                      year={wheelYear}
                      onDayClick={handleDaySelect}
                    />
                  </div>
                </>
              ) : (
                <ZodiacExplanationPanel
                  day={displayDay}
                  expanded={true}
                  theme="dark"
                />
              )}
            </div>
          </div>

          {/* Right Side: Education Flaps + Cusp Slider */}
          <div className="lg:sticky lg:top-4 space-y-4">
            <div>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  📚 How It Works
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Click each section to learn more
                </p>
              </div>
              <ZodiacEducationFlaps />

              {/* Link to 36-Position Cusps popup */}
              <button
                onClick={() => setShowCuspsPopup(true)}
                className="mt-3 w-full py-2 px-4 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/25 rounded-lg text-indigo-300 text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>⭐</span>
                <span>Explore All 36 Positions (micro-archetypes)</span>
              </button>
            </div>

            {/* Interactive Cusp Slider */}
            <div>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  🎛️ Try It Yourself
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Explore cusp blends interactively
                </p>
              </div>
              <CuspSliderInteractive />
            </div>
          </div>
        </div>
      </div>

      {/* 36-Position Cusps Floating Popup */}
      {showCuspsPopup && (
        <CuspsFloatingWindow onClose={() => setShowCuspsPopup(false)} />
      )}
    </div>
  );
}

// Draggable floating iframe window for the 36-Position Cusps page
function CuspsFloatingWindow({ onClose }) {
  const [pos, setPos] = useState({ x: 40, y: 40 });
  const [size, setSize] = useState({ w: 1300, h: 700 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e) => {
    if (e.target.closest('button')) return;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    setDragging(true);
  }, [pos]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => setPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragging]);

  return (
    <div
      className="fixed z-[9999] rounded-xl border border-white/20 bg-slate-900 shadow-2xl overflow-hidden flex flex-col"
      style={{ left: pos.x, top: pos.y, width: size.w, height: size.h }}
    >
      {/* Title bar — draggable */}
      <div
        className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-white/10 cursor-move select-none shrink-0"
        onMouseDown={onMouseDown}
      >
        <div className="flex items-center gap-2">
          <span>⭐</span>
          <span className="text-sm font-semibold text-white">36-Position Zodiac System</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSize(s => s.w === 1300 ? { w: 1600, h: 850 } : { w: 1300, h: 700 })}
            className="text-white/40 hover:text-white/80 px-2 py-0.5 text-xs rounded hover:bg-white/10 transition-colors"
            title="Toggle size"
          >
            {size.w === 1300 ? '⬜' : '◻'}
          </button>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-red-400 px-2 py-0.5 text-xs rounded hover:bg-red-500/10 transition-colors"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Iframe content */}
      <iframe
        src="/zodiac-cusps"
        className="flex-1 w-full border-0"
        title="36-Position Zodiac Cusps"
      />
    </div>
  );
}
