/**
 * useYearBreathing Hook
 *
 * The Cathedral's heartbeat — advances one day at a time through
 * the entire year, driving the Cusp Ribbon, Zodiac Wheel, and
 * Compatibility scores in continuous motion.
 *
 * This is time made visible.
 *
 * GENESIS AstroProfile - January 2026
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// =============================================================================
// SPEED PRESETS
// =============================================================================

/**
 * Speed presets for year breathing
 *
 * meditative: ~14.5 minutes per year (slow contemplation)
 * normal: ~7.3 minutes per year (balanced viewing)
 * accelerated: ~2.4 minutes per year (quick overview)
 * realtime: 86400000ms = 1 real day per simulated day
 */
export const YEAR_SPEEDS = {
  meditative: 2400,
  normal: 1200,
  accelerated: 400,
  demonstration: 100,
  realtime: 86400000,
} as const;

export type YearSpeedKey = keyof typeof YEAR_SPEEDS;

// =============================================================================
// TYPES
// =============================================================================

export interface YearBreathingConfig {
  startDay?: number;      // 1..365 (or 366 for leap year)
  year?: number;          // Year for context (default current)
  speedMs?: number;       // Milliseconds per day
  loop?: boolean;         // Loop back to day 1 after 365
  autoStart?: boolean;    // Start automatically
  onDayChange?: (day: number) => void;  // Callback when day changes
}

export interface YearBreathingState {
  dayOfYear: number;      // Current day (1-365)
  year: number;           // Year context
  isPlaying: boolean;     // Whether animation is running
  speed: number;          // Current speed in ms
  progress: number;       // 0-1 progress through year
  daysRemaining: number;  // Days until year end
  seasonIndex: number;    // 0=Spring, 1=Summer, 2=Autumn, 3=Winter
}

export interface YearBreathingControls {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
  setDay: (day: number) => void;
  setSpeed: (ms: number) => void;
  nextDay: () => void;
  prevDay: () => void;
  goToSeason: (season: 'Spring' | 'Summer' | 'Autumn' | 'Winter') => void;
}

export type YearBreathingReturn = YearBreathingState & YearBreathingControls;

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Approximate day of year for each season start
 */
const SEASON_STARTS = {
  Spring: 80,   // ~March 21
  Summer: 172,  // ~June 21
  Autumn: 266,  // ~September 23
  Winter: 356,  // ~December 22
} as const;

/**
 * Check if a year is a leap year
 */
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Get days in year
 */
function getDaysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

/**
 * Get season index from day of year
 */
function getSeasonIndex(dayOfYear: number): number {
  if (dayOfYear >= SEASON_STARTS.Winter || dayOfYear < SEASON_STARTS.Spring) return 3; // Winter
  if (dayOfYear >= SEASON_STARTS.Autumn) return 2; // Autumn
  if (dayOfYear >= SEASON_STARTS.Summer) return 1; // Summer
  return 0; // Spring
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Year breathing hook - the Cathedral's heartbeat
 *
 * @param config - Configuration options
 * @returns State and controls for year animation
 *
 * Example:
 *   const year = useYearBreathing({ speedMs: YEAR_SPEEDS.normal });
 *   // year.dayOfYear changes every 1200ms
 *   // Use year.dayOfYear to drive getSunBlendFromDate
 */
export function useYearBreathing(
  config: YearBreathingConfig = {}
): YearBreathingReturn {
  const {
    startDay = 1,
    year = new Date().getFullYear(),
    speedMs = YEAR_SPEEDS.normal,
    loop = true,
    autoStart = false,
    onDayChange,
  } = config;

  const daysInYear = getDaysInYear(year);

  const [dayOfYear, setDayOfYear] = useState(startDay);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [speed, setSpeed] = useState(speedMs);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onDayChangeRef = useRef(onDayChange);

  // Keep callback ref updated
  useEffect(() => {
    onDayChangeRef.current = onDayChange;
  }, [onDayChange]);

  // Advance day
  const advanceDay = useCallback(() => {
    setDayOfYear(prev => {
      const next = prev >= daysInYear ? (loop ? 1 : prev) : prev + 1;
      if (next !== prev && onDayChangeRef.current) {
        onDayChangeRef.current(next);
      }
      return next;
    });
  }, [daysInYear, loop]);

  // Interval management
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(advanceDay, speed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, advanceDay]);

  // Controls
  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(() => setIsPlaying(p => !p), []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setDayOfYear(startDay);
  }, [startDay]);

  const setDay = useCallback((day: number) => {
    const clamped = Math.max(1, Math.min(daysInYear, day));
    setDayOfYear(clamped);
    if (onDayChangeRef.current) {
      onDayChangeRef.current(clamped);
    }
  }, [daysInYear]);

  const nextDay = useCallback(() => {
    setDay(dayOfYear >= daysInYear ? 1 : dayOfYear + 1);
  }, [dayOfYear, daysInYear, setDay]);

  const prevDay = useCallback(() => {
    setDay(dayOfYear <= 1 ? daysInYear : dayOfYear - 1);
  }, [dayOfYear, daysInYear, setDay]);

  const goToSeason = useCallback((season: 'Spring' | 'Summer' | 'Autumn' | 'Winter') => {
    setDay(SEASON_STARTS[season]);
  }, [setDay]);

  const updateSpeed = useCallback((ms: number) => {
    setSpeed(ms);
  }, []);

  // Computed state
  const progress = dayOfYear / daysInYear;
  const daysRemaining = daysInYear - dayOfYear;
  const seasonIndex = getSeasonIndex(dayOfYear);

  return {
    // State
    dayOfYear,
    year,
    isPlaying,
    speed,
    progress,
    daysRemaining,
    seasonIndex,
    // Controls
    play,
    pause,
    toggle,
    reset,
    setDay,
    setSpeed: updateSpeed,
    nextDay,
    prevDay,
    goToSeason,
  };
}

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Get human-readable season name from index
 */
export function getSeasonName(index: number): string {
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
  return seasons[index % 4];
}

/**
 * Format day of year as readable date
 */
export function formatDayOfYear(dayOfYear: number, year = 2026): string {
  const date = new Date(Date.UTC(year, 0, dayOfYear));
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

/**
 * Calculate time remaining at current speed
 */
export function getTimeRemaining(daysRemaining: number, speedMs: number): string {
  const totalMs = daysRemaining * speedMs;
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);

  if (minutes > 60) {
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  }
  return `${minutes}m ${seconds}s`;
}

/**
 * Get speed label for display
 */
export function getSpeedLabel(speedMs: number): string {
  for (const [key, value] of Object.entries(YEAR_SPEEDS)) {
    if (value === speedMs) {
      return key.charAt(0).toUpperCase() + key.slice(1);
    }
  }
  return `${speedMs}ms`;
}
