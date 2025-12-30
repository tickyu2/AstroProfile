/**
 * ============================================================================
 * useRealtimeArchetype - React Hook
 * ============================================================================
 *
 * React hook for real-time archetype detection.
 * Integrates with Luna's emotion system for voice+text congruence.
 *
 * Features:
 * - Real-time partial transcript analysis
 * - Complete utterance analysis with voice emotion
 * - Luna guidance based on congruence patterns
 * - Conversation context tracking
 *
 * Part of: GENESIS Archetype Integration
 * Created: December 29, 2024
 * ============================================================================
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { RealtimeArchetypeDetector } from '../lib/realtimeArchetypeDetector.js';
import { EmotionCongruenceService } from '../lib/emotionCongruenceService.js';

/**
 * React hook for real-time archetype detection
 * @returns {object} Hook state and methods
 */
export function useRealtimeArchetype() {
  // State
  const [currentDetection, setCurrentDetection] = useState(null);
  const [congruenceAnalysis, setCongruenceAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [conversationContext, setConversationContext] = useState(null);
  const [error, setError] = useState(null);

  // Refs for services (persist across renders)
  const detectorRef = useRef(null);
  const congruenceRef = useRef(null);

  // Initialize services
  useEffect(() => {
    detectorRef.current = new RealtimeArchetypeDetector();
    congruenceRef.current = new EmotionCongruenceService();

    return () => {
      // Cleanup on unmount
      if (detectorRef.current) {
        detectorRef.current.reset();
      }
    };
  }, []);

  /**
   * Analyze partial transcript (as user is speaking)
   * @param {string} partialText - Incomplete STT text
   * @param {object} context - Optional context
   */
  const analyzePartial = useCallback((partialText, context = {}) => {
    if (!partialText || partialText.length < 5 || !detectorRef.current) {
      return null;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const detection = detectorRef.current.analyzePartial(partialText, context);

      if (detection) {
        setCurrentDetection(detection);
        return detection;
      }
    } catch (err) {
      setError(err.message);
      console.error('Partial analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }

    return null;
  }, []);

  /**
   * Analyze complete utterance with voice emotion
   * @param {string} finalText - Complete STT text
   * @param {string} voiceEmotion - From Luna's SER (sad, happy, etc.)
   * @param {object} voiceFeatures - Optional voice features
   * @param {object} context - Optional context
   * @returns {object} Detection and congruence analysis
   */
  const analyzeComplete = useCallback((
    finalText,
    voiceEmotion = null,
    voiceFeatures = {},
    context = {}
  ) => {
    if (!finalText || finalText.length < 3 || !detectorRef.current) {
      return { detection: null, congruence: null };
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Get text-based detection
      const detection = detectorRef.current.analyzeComplete(finalText, context);
      setCurrentDetection(detection);

      // Update conversation context
      if (detection?.conversationContext) {
        setConversationContext(detection.conversationContext);
      }

      let congruence = null;

      // Analyze congruence if voice emotion provided
      if (voiceEmotion && congruenceRef.current && detection) {
        congruence = congruenceRef.current.analyzeCongruence(
          voiceEmotion,
          detection,
          finalText,
          voiceFeatures
        );
        setCongruenceAnalysis(congruence);
      }

      return { detection, congruence };
    } catch (err) {
      setError(err.message);
      console.error('Complete analysis error:', err);
      return { detection: null, congruence: null };
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /**
   * Get Luna guidance based on current state
   * @returns {object|null} Guidance for Luna's response
   */
  const getLunaGuidance = useCallback(() => {
    if (!congruenceAnalysis) return null;
    return congruenceAnalysis.lunaGuidance;
  }, [congruenceAnalysis]);

  /**
   * Get LLM prompt modifier
   * @returns {string|null} Modifier for LLM prompt
   */
  const getLLMModifier = useCallback(() => {
    if (!congruenceAnalysis || !congruenceRef.current) return null;
    return congruenceRef.current.getLLMModifier(congruenceAnalysis);
  }, [congruenceAnalysis]);

  /**
   * Get voice modulation parameters for TTS
   * @returns {object|null} TTS parameters
   */
  const getVoiceModulation = useCallback(() => {
    if (!congruenceAnalysis || !congruenceRef.current) return null;
    return congruenceRef.current.getVoiceModulation(congruenceAnalysis);
  }, [congruenceAnalysis]);

  /**
   * Get conversation context
   * @returns {object|null} Conversation-level context
   */
  const getConversationContext = useCallback(() => {
    if (!detectorRef.current) return null;
    return detectorRef.current.getConversationContext();
  }, []);

  /**
   * Get archetype trend
   * @returns {object|null} Trend information
   */
  const getArchetypeTrend = useCallback(() => {
    if (!detectorRef.current) return null;
    return detectorRef.current.getArchetypeTrend();
  }, []);

  /**
   * Get emotional trajectory
   * @returns {object|null} Trajectory information
   */
  const getEmotionalTrajectory = useCallback(() => {
    if (!detectorRef.current) return null;
    return detectorRef.current.getEmotionalTrajectory();
  }, []);

  /**
   * Reset state (new conversation)
   */
  const reset = useCallback(() => {
    if (detectorRef.current) {
      detectorRef.current.reset();
    }
    setCurrentDetection(null);
    setCongruenceAnalysis(null);
    setConversationContext(null);
    setError(null);
  }, []);

  /**
   * Get full state summary
   * @returns {object} Complete state summary
   */
  const getStateSummary = useCallback(() => {
    return {
      currentDetection,
      congruenceAnalysis,
      conversationContext,
      isAnalyzing,
      error,
      archetypeTrend: getArchetypeTrend(),
      emotionalTrajectory: getEmotionalTrajectory()
    };
  }, [
    currentDetection,
    congruenceAnalysis,
    conversationContext,
    isAnalyzing,
    error,
    getArchetypeTrend,
    getEmotionalTrajectory
  ]);

  return {
    // State
    currentDetection,
    congruenceAnalysis,
    conversationContext,
    isAnalyzing,
    error,

    // Analysis methods
    analyzePartial,
    analyzeComplete,

    // Guidance methods
    getLunaGuidance,
    getLLMModifier,
    getVoiceModulation,

    // Context methods
    getConversationContext,
    getArchetypeTrend,
    getEmotionalTrajectory,
    getStateSummary,

    // Control methods
    reset
  };
}

export default useRealtimeArchetype;
