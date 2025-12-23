/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * USE EMOTION - React Hook for Speech Emotion Recognition
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Integrates the EmotionEngine with React state management.
 * Provides real-time emotion detection from audio stream.
 *
 * Features:
 * - Audio frame extraction from MediaStream
 * - Automatic emotion analysis while user is speaking
 * - Behavior recommendations based on detected emotion
 * - Trend analysis (escalating/de-escalating)
 *
 * Created: December 21, 2025
 */

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { EmotionEngine } from '../services/emotionEngine';
import { getBehavior, getEncourager, getBackchannel, getContinuation } from '../services/emotionBehaviorMap';
import { DEFAULT_EMOTION } from '../services/emotionSchema';

/**
 * Configuration defaults
 */
const DEFAULT_CONFIG = {
  analysisInterval: 200,    // How often to analyze (ms)
  fftSize: 2048,            // FFT size for audio analysis
  enabled: true             // Whether emotion detection is active
};

/**
 * useEmotion Hook
 *
 * @param {Object} options
 * @param {MediaStream} options.audioStream - Audio stream from getUserMedia
 * @param {boolean} options.isUserSpeaking - Whether user is currently speaking
 * @param {boolean} options.enabled - Whether to enable emotion detection
 * @param {number} options.analysisInterval - How often to analyze (ms)
 * @returns {Object} Emotion state and utilities
 */
export function useEmotion({
  audioStream = null,
  isUserSpeaking = false,
  enabled = true,
  analysisInterval = 200
} = {}) {
  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  const [emotion, setEmotion] = useState(DEFAULT_EMOTION);
  const [trend, setTrend] = useState('stable');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Refs for audio processing
  const engineRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const intervalRef = useRef(null);
  const dataArrayRef = useRef(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZE ENGINE
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    engineRef.current = new EmotionEngine();

    return () => {
      if (engineRef.current) {
        engineRef.current.reset();
      }
    };
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO SETUP
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (!audioStream || !enabled) {
      return;
    }

    // Create audio context and analyser
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioCtx;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = DEFAULT_CONFIG.fftSize;
    analyserRef.current = analyser;

    const source = audioCtx.createMediaStreamSource(audioStream);
    source.connect(analyser);
    sourceRef.current = source;

    // Create data array for time domain data
    dataArrayRef.current = new Float32Array(analyser.fftSize);

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioStream, enabled]);

  // ═══════════════════════════════════════════════════════════════════════════
  // ANALYSIS LOOP
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (!enabled || !isUserSpeaking || !analyserRef.current || !engineRef.current) {
      setIsAnalyzing(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    setIsAnalyzing(true);

    intervalRef.current = setInterval(() => {
      if (!analyserRef.current || !dataArrayRef.current || !engineRef.current) {
        return;
      }

      // Get time domain data
      analyserRef.current.getFloatTimeDomainData(dataArrayRef.current);

      // Analyze emotion
      const result = engineRef.current.analyze(dataArrayRef.current);
      setEmotion(result);

      // Update trend
      const newTrend = engineRef.current.getEmotionTrend();
      setTrend(newTrend);
    }, analysisInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, isUserSpeaking, analysisInterval]);

  // ═══════════════════════════════════════════════════════════════════════════
  // BEHAVIOR DERIVATION
  // ═══════════════════════════════════════════════════════════════════════════

  const behavior = useMemo(() => {
    return getBehavior(emotion.primary, emotion.secondary);
  }, [emotion.primary, emotion.secondary]);

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get an encourager appropriate for current emotion
   */
  const getEmotionEncourager = useCallback(() => {
    return getEncourager(emotion.primary);
  }, [emotion.primary]);

  /**
   * Get a backchannel appropriate for current emotion
   */
  const getEmotionBackchannel = useCallback(() => {
    return getBackchannel(emotion.primary);
  }, [emotion.primary]);

  /**
   * Get a continuation appropriate for current emotion
   */
  const getEmotionContinuation = useCallback(() => {
    return getContinuation(emotion.primary);
  }, [emotion.primary]);

  /**
   * Get LLM prompt modifier for current emotion
   */
  const getLLMModifier = useCallback(() => {
    return behavior.llmModifier || '';
  }, [behavior.llmModifier]);

  /**
   * Reset emotion state
   */
  const resetEmotion = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.reset();
    }
    setEmotion(DEFAULT_EMOTION);
    setTrend('stable');
  }, []);

  /**
   * Get dominant emotion from history
   */
  const getDominantEmotion = useCallback(() => {
    if (engineRef.current) {
      return engineRef.current.getDominantEmotion();
    }
    return 'neutral';
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // RETURN
  // ═══════════════════════════════════════════════════════════════════════════

  return {
    // Emotion state
    emotion,
    primary: emotion.primary,
    secondary: emotion.secondary,
    micro: emotion.micro,
    confidence: emotion.confidence,

    // Analysis state
    isAnalyzing,
    trend,

    // Behavior recommendations
    behavior,
    cueInterval: behavior.cueInterval,
    tone: behavior.tone,
    interruptibility: behavior.interruptibility,

    // Utility functions
    getEmotionEncourager,
    getEmotionBackchannel,
    getEmotionContinuation,
    getLLMModifier,
    getDominantEmotion,
    resetEmotion
  };
}

export default useEmotion;
