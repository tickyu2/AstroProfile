/**
 * useWheelRotation Hook
 *
 * Syncs the Zodiac Wheel rotation to day offset.
 * Each day = 2.5° rotation (15° per cusp window).
 *
 * The wheel breathes with the cusp animation.
 *
 * GENESIS AstroProfile - January 2026
 */

import { useMemo } from 'react';

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Degrees per day of cusp offset
 * Full cusp window (6 days) = 15° = half a sign
 */
export const DEGREES_PER_DAY = 2.5;

/**
 * Degrees per zodiac sign
 */
export const DEGREES_PER_SIGN = 30;

// =============================================================================
// TYPES
// =============================================================================

export interface WheelRotationState {
  rotation: number;        // Degrees to rotate
  transform: string;       // CSS transform value
  transition: string;      // CSS transition for smooth animation
  scale: number;           // Subtle scale for breathing
}

export interface WheelRotationConfig {
  degreesPerDay?: number;  // Default 2.5
  baseRotation?: number;   // Starting rotation (default 0)
  breathScale?: number;    // Scale variation for breathing (default 0.02)
  transitionMs?: number;   // Transition duration (default 300)
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Calculate wheel rotation based on day offset
 *
 * @param dayOffset - Current day offset (-6 to +6)
 * @param isBreathing - Whether breathing animation is active
 * @param breathProgress - Current breath progress (0 to 1)
 * @param config - Configuration options
 * @returns Rotation state with CSS values
 *
 * Example:
 *   const wheel = useWheelRotation(breathing.dayOffset, breathing.isPlaying, breathing.progress);
 *   <div style={{ transform: wheel.transform, transition: wheel.transition }} />
 */
export function useWheelRotation(
  dayOffset: number,
  isBreathing = false,
  breathProgress = 0,
  config: WheelRotationConfig = {}
): WheelRotationState {
  const {
    degreesPerDay = DEGREES_PER_DAY,
    baseRotation = 0,
    breathScale = 0.02,
    transitionMs = 300,
  } = config;

  return useMemo(() => {
    // Calculate rotation from day offset
    const rotation = baseRotation + (dayOffset * degreesPerDay);

    // Calculate breathing scale
    const scale = isBreathing
      ? 1 + (Math.sin(breathProgress * Math.PI) * breathScale)
      : 1;

    // Build CSS values
    const transform = `rotate(${rotation}deg) scale(${scale.toFixed(4)})`;
    const transition = isBreathing
      ? 'transform 0.1s ease-out'
      : `transform ${transitionMs}ms ease-out`;

    return {
      rotation,
      transform,
      transition,
      scale,
    };
  }, [dayOffset, isBreathing, breathProgress, degreesPerDay, baseRotation, breathScale, transitionMs]);
}

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Calculate the wheel rotation for a specific sign position
 */
export function getSignRotation(
  signIndex: number,
  baseRotation = 0
): number {
  return baseRotation - (signIndex * DEGREES_PER_SIGN);
}

/**
 * Calculate the rotation needed to center a sign at the top
 */
export function getRotationToCenter(
  signIndex: number
): number {
  // Aries is at 0°, we want it at top (-90° in CSS)
  // Each sign is 30° clockwise
  return -90 - (signIndex * DEGREES_PER_SIGN);
}

/**
 * Get rotation offset for cusp blending visualization
 */
export function getCuspBlendRotation(
  primaryWeight: number,
  secondaryWeight: number
): number {
  // If pure sign, no offset
  if (secondaryWeight < 0.05) return 0;

  // Offset proportional to secondary weight
  // Max offset is half the degrees per day (1.25°)
  return secondaryWeight * (DEGREES_PER_DAY / 2);
}

/**
 * Create easing function for wheel rotation
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Create breathing easing (sine wave)
 */
export function breathEasing(t: number): number {
  return Math.sin(t * Math.PI);
}
