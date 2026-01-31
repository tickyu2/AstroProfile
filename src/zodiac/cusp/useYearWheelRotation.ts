/**
 * useYearWheelRotation Hook
 *
 * Syncs the Zodiac Wheel rotation to day of year.
 * 365 days → 360° (continuous, no jumps, no resets)
 *
 * The wheel turns like the Earth.
 *
 * GENESIS AstroProfile - January 2026
 */

import { useMemo } from 'react';

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Degrees per day for annual rotation
 * 360° / 365 days ≈ 0.9863°
 */
export const DEGREES_PER_DAY_ANNUAL = 360 / 365;

/**
 * Degrees per zodiac sign
 */
export const DEGREES_PER_SIGN = 30;

/**
 * Days per zodiac sign (approximate)
 */
export const DAYS_PER_SIGN = 365 / 12;

// =============================================================================
// TYPES
// =============================================================================

export interface YearWheelRotationState {
  rotation: number;          // Total rotation in degrees
  transform: string;         // CSS transform value
  transition: string;        // CSS transition value
  currentSign: number;       // Sign index (0-11)
  signProgress: number;      // Progress through current sign (0-1)
  seasonQuadrant: number;    // Season quadrant (0-3)
}

export interface YearWheelRotationConfig {
  baseOffset?: number;       // Starting rotation offset (default 0)
  transitionMs?: number;     // Transition duration (default 1200)
  easing?: string;           // CSS easing function
  direction?: 'cw' | 'ccw';  // Rotation direction (default 'cw')
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Calculate wheel rotation based on day of year
 *
 * @param dayOfYear - Current day (1-365)
 * @param config - Configuration options
 * @returns Rotation state with CSS values
 *
 * Example:
 *   const wheel = useYearWheelRotation(dayOfYear);
 *   <div style={{ transform: wheel.transform, transition: wheel.transition }}>
 *     <TropicalZodiacWheel />
 *   </div>
 */
export function useYearWheelRotation(
  dayOfYear: number,
  config: YearWheelRotationConfig = {}
): YearWheelRotationState {
  const {
    baseOffset = 0,
    transitionMs = 1200,
    easing = 'linear',
    direction = 'cw',
  } = config;

  return useMemo(() => {
    // Calculate base rotation from day
    const rawRotation = dayOfYear * DEGREES_PER_DAY_ANNUAL;

    // Apply direction (counter-clockwise inverts)
    const directedRotation = direction === 'ccw' ? -rawRotation : rawRotation;

    // Add base offset
    const rotation = baseOffset + directedRotation;

    // Calculate sign index (0 = Aries, 11 = Pisces)
    // Day 80 (~Mar 21) = Aries start
    const ariesStart = 80;
    const adjustedDay = dayOfYear >= ariesStart
      ? dayOfYear - ariesStart
      : dayOfYear + (365 - ariesStart);
    const currentSign = Math.floor(adjustedDay / DAYS_PER_SIGN) % 12;

    // Progress through current sign
    const signProgress = (adjustedDay % DAYS_PER_SIGN) / DAYS_PER_SIGN;

    // Season quadrant (0=Spring, 1=Summer, 2=Autumn, 3=Winter)
    const seasonQuadrant = Math.floor(currentSign / 3);

    // Build CSS values
    const transform = `rotate(${rotation.toFixed(3)}deg)`;
    const transition = `transform ${transitionMs}ms ${easing}`;

    return {
      rotation,
      transform,
      transition,
      currentSign,
      signProgress,
      seasonQuadrant,
    };
  }, [dayOfYear, baseOffset, transitionMs, easing, direction]);
}

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Get the zodiac sign name for a sign index
 */
export function getSignName(index: number): string {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
  ];
  return signs[index % 12];
}

/**
 * Get the season name for a quadrant
 */
export function getSeasonFromQuadrant(quadrant: number): string {
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
  return seasons[quadrant % 4];
}

/**
 * Calculate the rotation to center a specific sign at top
 */
export function getRotationForSign(signIndex: number): number {
  // Aries at top = -90° (12 o'clock position)
  // Each sign is 30° clockwise
  return -90 - (signIndex * DEGREES_PER_SIGN);
}

/**
 * Get the approximate day of year for a sign's start
 */
export function getSignStartDay(signIndex: number): number {
  const ariesStart = 80; // ~March 21
  const dayOffset = Math.round(signIndex * DAYS_PER_SIGN);
  const day = ariesStart + dayOffset;
  return day > 365 ? day - 365 : day;
}

/**
 * Smooth interpolation for wheel rotation (ease-out)
 */
export function easeOutRotation(from: number, to: number, progress: number): number {
  const eased = 1 - Math.pow(1 - progress, 3);
  return from + (to - from) * eased;
}

/**
 * Get CSS keyframes for continuous year rotation
 */
export function getYearRotationKeyframes(
  startDay: number,
  direction: 'cw' | 'ccw' = 'cw'
): string {
  const startRotation = startDay * DEGREES_PER_DAY_ANNUAL;
  const endRotation = startRotation + (direction === 'cw' ? 360 : -360);

  return `
    @keyframes yearRotation {
      from { transform: rotate(${startRotation}deg); }
      to { transform: rotate(${endRotation}deg); }
    }
  `;
}

/**
 * Create a breathing pulse effect for the wheel
 */
export function getWheelBreathingStyle(
  breathProgress: number,
  intensity = 0.02
): React.CSSProperties {
  const scale = 1 + Math.sin(breathProgress * Math.PI) * intensity;
  const glow = Math.sin(breathProgress * Math.PI) * 10;

  return {
    transform: `scale(${scale.toFixed(4)})`,
    filter: `drop-shadow(0 0 ${glow}px rgba(167, 139, 250, 0.3))`,
  };
}
