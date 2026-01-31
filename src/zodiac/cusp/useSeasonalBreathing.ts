/**
 * useSeasonalBreathing Hook
 *
 * Creates an inhale/exhale oscillation that cycles through
 * the cusp day window automatically.
 *
 * The Cathedral breathes in rhythm with the seasons.
 *
 * GENESIS AstroProfile - January 2026
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export type BreathPhase = 'inhale' | 'exhale';

export interface BreathingState {
  phase: BreathPhase;
  dayOffset: number;       // -6 to +6
  progress: number;        // 0 to 1 within current phase
  cycleProgress: number;   // 0 to 1 for full cycle
  isPlaying: boolean;
}

export interface SeasonalBreathingConfig {
  windowSize?: number;     // Default 6 (13-day window)
  cycleDuration?: number;  // Milliseconds for full inhale+exhale (default 8000)
  autoStart?: boolean;     // Start breathing immediately (default false)
  pauseOnHover?: boolean;  // Pause when user hovers (default true)
}

export interface SeasonalBreathingReturn extends BreathingState {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
  setDayOffset: (offset: number) => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_CONFIG: Required<SeasonalBreathingConfig> = {
  windowSize: 6,
  cycleDuration: 8000,
  autoStart: false,
  pauseOnHover: true,
};

// =============================================================================
// HOOK
// =============================================================================

/**
 * Auto-play seasonal breathing loop
 *
 * @param config - Configuration options
 * @returns Breathing state and controls
 *
 * Example:
 *   const breathing = useSeasonalBreathing({ autoStart: true });
 *   // breathing.phase: 'inhale' | 'exhale'
 *   // breathing.dayOffset: -6 to +6
 */
export function useSeasonalBreathing(
  config: SeasonalBreathingConfig = {}
): SeasonalBreathingReturn {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  const [isPlaying, setIsPlaying] = useState(cfg.autoStart);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [dayOffset, setDayOffset] = useState(0);
  const [progress, setProgress] = useState(0);

  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);

  // Calculate cycle progress (0 to 1)
  const cycleProgress = phase === 'inhale'
    ? progress / 2
    : 0.5 + progress / 2;

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp - pausedAtRef.current;
    }

    const elapsed = timestamp - startTimeRef.current;
    const halfCycle = cfg.cycleDuration / 2;
    const cycleTime = elapsed % cfg.cycleDuration;

    // Determine phase and progress
    const currentPhase: BreathPhase = cycleTime < halfCycle ? 'inhale' : 'exhale';
    const phaseProgress = currentPhase === 'inhale'
      ? cycleTime / halfCycle
      : (cycleTime - halfCycle) / halfCycle;

    // Convert progress to day offset
    // Inhale: 0 → +6 (moving forward in time)
    // Exhale: +6 → 0 → -6 → 0 (back to center then past)
    let offset: number;
    if (currentPhase === 'inhale') {
      // 0 to +6
      offset = Math.round(phaseProgress * cfg.windowSize);
    } else {
      // +6 to -6 to 0
      if (phaseProgress < 0.5) {
        // +6 to 0
        offset = Math.round((1 - phaseProgress * 2) * cfg.windowSize);
      } else {
        // 0 to -6
        offset = Math.round((phaseProgress - 0.5) * 2 * -cfg.windowSize);
      }
    }

    setPhase(currentPhase);
    setProgress(phaseProgress);
    setDayOffset(offset);

    animationRef.current = requestAnimationFrame(animate);
  }, [cfg.cycleDuration, cfg.windowSize]);

  // Start/stop animation
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      pausedAtRef.current = performance.now() - startTimeRef.current;
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate]);

  // Controls
  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(() => setIsPlaying(p => !p), []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setPhase('inhale');
    setDayOffset(0);
    setProgress(0);
    startTimeRef.current = 0;
    pausedAtRef.current = 0;
  }, []);

  const setManualOffset = useCallback((offset: number) => {
    setIsPlaying(false);
    setDayOffset(Math.max(-cfg.windowSize, Math.min(cfg.windowSize, offset)));
  }, [cfg.windowSize]);

  return {
    phase,
    dayOffset,
    progress,
    cycleProgress,
    isPlaying,
    play,
    pause,
    toggle,
    reset,
    setDayOffset: setManualOffset,
  };
}

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Get breathing-aware opacity for UI elements
 */
export function getBreathOpacity(
  phase: BreathPhase,
  progress: number,
  baseOpacity = 0.7,
  breathAmount = 0.3
): number {
  const breathOffset = phase === 'inhale'
    ? progress * breathAmount
    : (1 - progress) * breathAmount;

  return baseOpacity + breathOffset;
}

/**
 * Get breathing-aware scale for UI elements
 */
export function getBreathScale(
  phase: BreathPhase,
  progress: number,
  baseScale = 1,
  breathAmount = 0.02
): number {
  const breathOffset = phase === 'inhale'
    ? progress * breathAmount
    : (1 - progress) * breathAmount;

  return baseScale + breathOffset;
}
