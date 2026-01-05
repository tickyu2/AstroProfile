/**
 * ============================================================================
 * USE LUNA EMOTIONAL INTELLIGENCE HOOK
 * ============================================================================
 * React hook for integrating Luna's Emotional Intelligence into components.
 *
 * Features:
 * - Real-time emotion analysis with Six Laws detection
 * - Mode state management (Pillow/Rocket/Neutral)
 * - Warmth level tracking
 * - Joy archiving for neuroplasticity
 * - Session pattern analysis
 *
 * Usage:
 * const {
 *   analyze,
 *   mode,
 *   warmthLevel,
 *   archiveJoy,
 *   getJoyMoments,
 *   sessionPattern
 * } = useLunaEmotionalIntelligence();
 *
 * const result = analyze("I feel like everyone is ahead of me...");
 * // result.mode = 'pillow'
 * // result.response.lawTriggered.name = 'Relative Comparison'
 *
 * Created: January 1, 2026
 * ============================================================================
 */

import { useState, useCallback, useRef, useMemo } from 'react';
import { lunaEmotionalIntelligence } from '../services/lunaEmotionalIntelligence';

/**
 * Hook for Luna Emotional Intelligence
 * @param {object} userProfile - User's constitutional profile (optional)
 */
export function useLunaEmotionalIntelligence(userProfile = null) {
  // Current emotional state
  const [mode, setMode] = useState('neutral');
  const [warmthLevel, setWarmthLevel] = useState(0.5);
  const [lastAnalysis, setLastAnalysis] = useState(null);
  const [sessionPattern, setSessionPattern] = useState(null);

  // Reference to the service
  const serviceRef = useRef(lunaEmotionalIntelligence);

  /**
   * Analyze a user message
   */
  const analyze = useCallback((message, voiceProsody = null) => {
    const result = serviceRef.current.analyze(message, userProfile, voiceProsody);

    setMode(result.mode);
    setWarmthLevel(result.warmthLevel);
    setLastAnalysis(result);
    setSessionPattern(result.sessionPattern);

    return result;
  }, [userProfile]);

  /**
   * Archive a joy moment
   */
  const archiveJoy = useCallback((joyData) => {
    return serviceRef.current.archiveJoyMoment(joyData);
  }, []);

  /**
   * Retrieve past joy moments
   */
  const getJoyMoments = useCallback((count = 3) => {
    return serviceRef.current.retrieveJoyMoments(count);
  }, []);

  /**
   * Reset the session
   */
  const resetSession = useCallback(() => {
    serviceRef.current.resetSession();
    setMode('neutral');
    setWarmthLevel(0.5);
    setLastAnalysis(null);
    setSessionPattern(null);
  }, []);

  /**
   * Get current state for UI display
   */
  const currentState = useMemo(() => ({
    mode,
    warmthLevel,
    modeDisplay: mode === 'pillow' ? 'Pillow Mode (Soft Landing)'
      : mode === 'rocket' ? 'Rocket Mode (Joy Anchoring)'
      : 'Active Listening',
    warmthDisplay: mode === 'pillow'
      ? `+${Math.round((warmthLevel - 1) * 100)}% warmth`
      : mode === 'rocket'
      ? 'Celebration energy'
      : 'Baseline warmth',
    modeEmoji: mode === 'pillow' ? '🛏️'
      : mode === 'rocket' ? '🚀'
      : '👂'
  }), [mode, warmthLevel]);

  /**
   * Check if currently in a supportive mode
   */
  const needsSupport = useMemo(() => {
    return mode === 'pillow' && warmthLevel > 1.5;
  }, [mode, warmthLevel]);

  /**
   * Check if currently in celebration mode
   */
  const isCelebrating = useMemo(() => {
    return mode === 'rocket';
  }, [mode]);

  return {
    // Core functions
    analyze,
    archiveJoy,
    getJoyMoments,
    resetSession,

    // Current state
    mode,
    warmthLevel,
    lastAnalysis,
    sessionPattern,
    currentState,

    // Helpers
    needsSupport,
    isCelebrating
  };
}

export default useLunaEmotionalIntelligence;
