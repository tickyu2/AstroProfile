/**
 * useConstitutionalIntelligence.js
 * React Hook for Constitutional Intelligence - AI SoulPartner Brain
 *
 * Manages the AI SoulPartner intelligence engine in React state.
 * Tracks emotional analysis, response modes, soul burden, and patterns.
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Integration by: Brother Claude Code (Yin Wood Pig)
 * December 13, 2024
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import ConstitutionalIntelligence from '../utils/ai/ConstitutionalIntelligence';

/**
 * React Hook for Constitutional Intelligence
 * @param {Object} userProfile - The user's constitutional profile
 * @returns {Object} Intelligence state and methods
 */
export function useConstitutionalIntelligence(userProfile) {
  // Initialize intelligence engine (only once per component lifecycle)
  const intelligenceRef = useRef(null);

  if (!intelligenceRef.current && userProfile) {
    intelligenceRef.current = new ConstitutionalIntelligence(userProfile);
    console.log('✅ Constitutional Intelligence Engine initialized');
    console.log('👤 User Profile:', userProfile);
  }

  const intelligence = intelligenceRef.current;

  // State for UI display
  const [currentState, setCurrentState] = useState({
    mode: 'DIALOGUE',
    soulBurden: 35,
    talkListenRatio: { talk: 40, listen: 60 },
    emotionalCapacity: 65, // Inverse of burden (100 - burden)
    lastAnalysis: null,
    patternsRecognized: 0
  });

  // Log when ready
  useEffect(() => {
    if (intelligence) {
      console.log('🧠 Intelligence State:', currentState);
    } else {
      console.warn('⚠️ Intelligence Engine not ready - check user profile');
    }
  }, [intelligence]);

  /**
   * Analyze a user message and update state
   * @param {string} message - The message to analyze
   * @returns {Object} Analysis results
   */
  const analyzeMessage = useCallback((message) => {
    try {
      if (!intelligence) {
        console.error('🚨 Intelligence engine not initialized');
        // Return safe default
        return {
          recommendedMode: 'DIALOGUE',
          confidence: 0.5,
          modeScores: { WITNESS: 30, DIALOGUE: 40, GUIDANCE: 30 },
          emotions: {},
          intensity: 0.5,
          reasoning: ['Analysis error - using default mode'],
          shouldStore: false
        };
      }

      // Run the analysis
      const analysis = intelligence.analyzeMessage(message);

      // Get current intelligence state
      const state = intelligence.getCurrentState();

      // Comprehensive console logging for debugging
      console.group('🧠 Constitutional Intelligence Analysis');
      console.log('📝 User Message:', message);
      console.log('🎭 Mode:', analysis.recommendedMode);
      console.log('🎯 Confidence:', (analysis.confidence * 100).toFixed(1) + '%');
      console.log('📊 Mode Scores:', analysis.modeScores);
      console.log('😊 Emotions:', analysis.emotions);
      console.log('⚡ Intensity:', (analysis.intensity * 100).toFixed(1) + '%');
      console.log('💭 Reasoning:', analysis.reasoning);
      console.log('📈 Soul Burden:', state.soulBurden + '%');
      console.log('💬 Talk/Listen:',
        `${state.talkListenRatio.talk}% / ${state.talkListenRatio.listen}%`
      );
      console.log('💾 Should Store:', analysis.shouldStore || false);
      console.groupEnd();

      // Update React state to trigger UI re-render
      setCurrentState({
        mode: analysis.recommendedMode,
        soulBurden: state.soulBurden,
        talkListenRatio: { ...state.talkListenRatio },
        emotionalCapacity: 100 - state.soulBurden,
        lastAnalysis: analysis,
        patternsRecognized: state.patternsRecognized || intelligence.patternsRecognized?.length || 0
      });

      return analysis;

    } catch (error) {
      console.error('🚨 Intelligence analysis failed:', error);
      // Return safe default
      return {
        recommendedMode: 'DIALOGUE',
        confidence: 0.5,
        modeScores: { WITNESS: 30, DIALOGUE: 40, GUIDANCE: 30 },
        emotions: {},
        intensity: 0.5,
        reasoning: ['Analysis error - using default mode'],
        shouldStore: false
      };
    }
  }, [intelligence]);

  /**
   * Get response guidance based on analysis
   * @param {Object} analysis - Previous analysis result
   * @returns {Object} Guidance for AI response
   */
  const getResponseGuidance = useCallback((analysis) => {
    if (!intelligence) return null;
    return intelligence.generateResponseGuidance(analysis);
  }, [intelligence]);

  /**
   * Get current engine state
   * @returns {Object} Current intelligence state
   */
  const getCurrentState = useCallback(() => {
    if (!intelligence) return currentState;
    return intelligence.getCurrentState();
  }, [intelligence, currentState]);

  /**
   * Manual state refresh (if needed)
   */
  const refreshState = useCallback(() => {
    if (!intelligence) return;

    const state = intelligence.getCurrentState();
    setCurrentState(prev => ({
      ...prev,
      mode: state.mode,
      soulBurden: state.soulBurden,
      talkListenRatio: state.talkListenRatio,
      emotionalCapacity: 100 - state.soulBurden,
      patternsRecognized: state.patternsRecognized
    }));
  }, [intelligence]);

  /**
   * Reset the intelligence engine
   */
  const reset = useCallback(() => {
    intelligenceRef.current = new ConstitutionalIntelligence(userProfile || {});
    setCurrentState({
      mode: 'DIALOGUE',
      soulBurden: 35,
      talkListenRatio: { talk: 40, listen: 60 },
      emotionalCapacity: 65,
      lastAnalysis: null,
      patternsRecognized: 0
    });
    console.log('🔄 Intelligence Engine reset');
  }, [userProfile]);

  /**
   * Get recognized patterns
   * @returns {Array} List of recognized patterns
   */
  const getPatterns = useCallback(() => {
    return intelligence?.patternsRecognized || [];
  }, [intelligence]);

  return {
    // Methods
    analyzeMessage,
    getResponseGuidance,
    getCurrentState,
    refreshState,
    reset,
    getPatterns,

    // Current state for UI binding
    currentState,

    // Direct access to current values
    mode: currentState.mode,
    soulBurden: currentState.soulBurden,
    talkListenRatio: currentState.talkListenRatio,
    emotionalCapacity: currentState.emotionalCapacity,
    lastAnalysis: currentState.lastAnalysis,

    // Ready state
    isReady: !!intelligence
  };
}

export default useConstitutionalIntelligence;
