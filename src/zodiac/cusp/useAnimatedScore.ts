/**
 * useAnimatedScore Hook
 *
 * Smoothly animates compatibility score transitions.
 * Scores pulse and fade as cusp blends change.
 *
 * GENESIS AstroProfile - January 2026
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface AnimatedScoreState {
  displayValue: number;    // Current animated value
  targetValue: number;     // Target value
  isAnimating: boolean;    // Whether animation is in progress
  direction: 'up' | 'down' | 'stable';  // Direction of change
  delta: number;           // Amount of change
}

export interface AnimatedScoreConfig {
  duration?: number;       // Animation duration in ms (default 500)
  easing?: (t: number) => number;  // Easing function
  precision?: number;      // Decimal places (default 1)
  threshold?: number;      // Minimum change to animate (default 0.1)
}

// =============================================================================
// EASING FUNCTIONS
// =============================================================================

export const easings = {
  linear: (t: number) => t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 2),
  easeInOut: (t: number) => t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2,
  spring: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

// =============================================================================
// HOOK
// =============================================================================

/**
 * Animate a numeric score value
 *
 * @param targetValue - The value to animate to
 * @param config - Animation configuration
 * @returns Animated score state
 *
 * Example:
 *   const score = useAnimatedScore(compatibility.score);
 *   <span className={score.direction}>{score.displayValue.toFixed(1)}</span>
 */
export function useAnimatedScore(
  targetValue: number,
  config: AnimatedScoreConfig = {}
): AnimatedScoreState {
  const {
    duration = 500,
    easing = easings.easeOut,
    precision = 1,
    threshold = 0.1,
  } = config;

  const [displayValue, setDisplayValue] = useState(targetValue);
  const [isAnimating, setIsAnimating] = useState(false);

  const animationRef = useRef<number | null>(null);
  const startValueRef = useRef(targetValue);
  const startTimeRef = useRef(0);
  const previousTargetRef = useRef(targetValue);

  // Calculate direction and delta
  const delta = targetValue - previousTargetRef.current;
  const direction: 'up' | 'down' | 'stable' =
    delta > threshold ? 'up' :
    delta < -threshold ? 'down' : 'stable';

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);

    const currentValue = startValueRef.current +
      (targetValue - startValueRef.current) * easedProgress;

    setDisplayValue(Number(currentValue.toFixed(precision)));

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
      setDisplayValue(Number(targetValue.toFixed(precision)));
    }
  }, [targetValue, duration, easing, precision]);

  // Start animation when target changes
  useEffect(() => {
    const change = Math.abs(targetValue - previousTargetRef.current);

    if (change >= threshold) {
      // Cancel any existing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Start new animation
      startValueRef.current = displayValue;
      startTimeRef.current = 0;
      setIsAnimating(true);
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Small change, just set directly
      setDisplayValue(Number(targetValue.toFixed(precision)));
    }

    previousTargetRef.current = targetValue;

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, threshold, animate, displayValue, precision]);

  return {
    displayValue,
    targetValue,
    isAnimating,
    direction,
    delta,
  };
}

// =============================================================================
// MULTI-SCORE HOOK
// =============================================================================

export interface MultiScoreEntry {
  key: string;
  value: number;
}

export interface AnimatedMultiScoreState {
  scores: Record<string, AnimatedScoreState>;
  isAnyAnimating: boolean;
}

/**
 * Animate multiple score values
 *
 * @param entries - Array of key-value pairs to animate
 * @param config - Animation configuration
 * @returns Object with animated states for each key
 */
export function useAnimatedMultiScore(
  entries: MultiScoreEntry[],
  config: AnimatedScoreConfig = {}
): AnimatedMultiScoreState {
  const [states, setStates] = useState<Record<string, AnimatedScoreState>>({});

  useEffect(() => {
    const newStates: Record<string, AnimatedScoreState> = {};

    for (const entry of entries) {
      const prev = states[entry.key];
      const delta = prev ? entry.value - prev.targetValue : 0;

      newStates[entry.key] = {
        displayValue: prev?.displayValue ?? entry.value,
        targetValue: entry.value,
        isAnimating: false,
        direction: delta > 0.1 ? 'up' : delta < -0.1 ? 'down' : 'stable',
        delta,
      };
    }

    setStates(newStates);
  }, [entries]);

  return {
    scores: states,
    isAnyAnimating: Object.values(states).some(s => s.isAnimating),
  };
}

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Format a score for display with direction indicator
 */
export function formatScoreWithDirection(
  state: AnimatedScoreState,
  showArrow = true
): string {
  const arrow = showArrow
    ? state.direction === 'up' ? ' ↑' : state.direction === 'down' ? ' ↓' : ''
    : '';

  return `${state.displayValue.toFixed(1)}${arrow}`;
}

/**
 * Get CSS class based on score direction
 */
export function getScoreDirectionClass(direction: 'up' | 'down' | 'stable'): string {
  switch (direction) {
    case 'up': return 'score--increasing';
    case 'down': return 'score--decreasing';
    default: return 'score--stable';
  }
}

/**
 * Calculate score color based on value (0-100)
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e';  // Green
  if (score >= 60) return '#84cc16';  // Lime
  if (score >= 40) return '#eab308';  // Yellow
  if (score >= 20) return '#f97316';  // Orange
  return '#ef4444';  // Red
}
