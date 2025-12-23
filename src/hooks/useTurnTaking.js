/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * USE TURN TAKING - Conversation State Machine Hook
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Implements natural turn-taking with:
 * - 6-state conversation flow
 * - Emotion-aware timing thresholds (dynamic adjustment)
 * - Probabilistic active listening cues (emotion-specific)
 * - User interruption handling
 * - VAD (Voice Activity Detection) integration ready
 *
 * Updated: December 21, 2025 - Added emotion-aware thresholds & probabilistic cues
 * Created: December 21, 2025
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  STATES,
  TIMING,
  CUE_TYPES,
  BACKCHANNELS,
  ENCOURAGERS,
  CONTINUATIONS,
  getRandomCue
} from '../components/voice/talkStates';
import {
  getEffectiveThresholds,
  BASE_TIMING
} from '../components/voice/emotionTimingMap';
import {
  maybeGenerateCue as probabilisticCue,
  getRandomCue as getEmotionCue
} from '../components/voice/emotionCueMap';

/**
 * Turn-taking state machine hook
 *
 * @param {Object} options Configuration options
 * @param {Function} options.onStateChange - Callback when state changes
 * @param {Function} options.onCue - Callback when a cue should be played
 * @param {Function} options.onAIResponse - Callback when AI should respond
 * @param {Function} options.onInterrupt - Callback when user interrupts AI
 * @param {boolean} options.enabled - Whether turn-taking is active
 * @param {string} options.emotion - Current detected emotion (default: 'neutral')
 * @param {number} options.emotionConfidence - Emotion detection confidence 0-1 (default: 0.5)
 * @param {boolean} options.useEmotionAwareCues - Use probabilistic emotion cues (default: true)
 * @returns {Object} Turn-taking state and controls
 */
export function useTurnTaking({
  onStateChange,
  onCue,
  onAIResponse,
  onInterrupt,
  enabled = true,
  emotion: externalEmotion = 'neutral',
  emotionConfidence: externalConfidence = 0.5,
  useEmotionAwareCues = true
} = {}) {
  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  const [currentState, setCurrentState] = useState(STATES.USER_SPEAKING);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [lastCue, setLastCue] = useState(null);
  const [conversationLog, setConversationLog] = useState([]);

  // Emotion state (can be updated externally or via setEmotion)
  const [emotion, setEmotion] = useState(externalEmotion);
  const [emotionConfidence, setEmotionConfidence] = useState(externalConfidence);

  // Refs for timing
  const silenceStartRef = useRef(null);
  const lastCueTimeRef = useRef(0);
  const intervalRef = useRef(null);

  // Update emotion when external props change
  useEffect(() => {
    if (externalEmotion !== emotion) {
      setEmotion(externalEmotion);
    }
    if (externalConfidence !== emotionConfidence) {
      setEmotionConfidence(externalConfidence);
    }
  }, [externalEmotion, externalConfidence]);

  // Calculate effective thresholds based on current emotion
  const effectiveThresholds = getEffectiveThresholds(emotion, emotionConfidence);

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE TRANSITIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Transition to a new state
   */
  const transitionTo = useCallback((newState) => {
    setCurrentState((prevState) => {
      if (prevState !== newState) {
        const logEntry = {
          timestamp: Date.now(),
          from: prevState,
          to: newState
        };
        setConversationLog((prev) => [...prev.slice(-50), logEntry]); // Keep last 50

        onStateChange?.(newState, prevState);
      }
      return newState;
    });
  }, [onStateChange]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CUE ENGINE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Play an active listening cue if enough time has passed.
   * Uses probabilistic emotion-aware cue selection when enabled.
   *
   * @param {string} cueType - CUE_TYPES value
   * @param {string} pauseZone - 'MICRO_PAUSE' | 'SHORT_PAUSE' | 'THINKING_PAUSE'
   */
  const maybePlayCue = useCallback((cueType, pauseZone = 'SHORT_PAUSE') => {
    const now = performance.now();
    if (now - lastCueTimeRef.current < TIMING.MIN_CUE_INTERVAL) {
      return; // Too soon since last cue
    }

    // Use probabilistic emotion-aware cues if enabled
    if (useEmotionAwareCues) {
      const probResult = probabilisticCue(pauseZone, emotion, emotionConfidence);

      if (!probResult) {
        // Probability check failed - no cue this time
        return;
      }

      lastCueTimeRef.current = now;

      const cue = {
        text: probResult.cue,
        type: probResult.type,
        emotion: probResult.emotion,
        probability: probResult.probability
      };

      setLastCue({ ...cue, timestamp: Date.now() });
      onCue?.(probResult.type, cue);
      return;
    }

    // Fallback to original static cue system
    lastCueTimeRef.current = now;

    let cue;
    switch (cueType) {
      case CUE_TYPES.BACKCHANNEL:
        cue = getRandomCue(BACKCHANNELS);
        break;
      case CUE_TYPES.ENCOURAGER:
        cue = getRandomCue(ENCOURAGERS);
        break;
      case CUE_TYPES.CONTINUATION:
        cue = getRandomCue(CONTINUATIONS);
        break;
      default:
        return;
    }

    setLastCue({ type: cueType, ...cue, timestamp: Date.now() });
    onCue?.(cueType, cue);
  }, [onCue, useEmotionAwareCues, emotion, emotionConfidence]);

  // ═══════════════════════════════════════════════════════════════════════════
  // AI RESPONDER
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Start AI response (called when completion pause detected)
   */
  const startAIResponse = useCallback(() => {
    if (isAISpeaking) return;

    setIsAISpeaking(true);
    transitionTo(STATES.AI_SPEAKING);
    onAIResponse?.();
  }, [isAISpeaking, transitionTo, onAIResponse]);

  /**
   * Finish AI response (called when AI done or user interrupts)
   */
  const finishAIResponse = useCallback(() => {
    if (!isAISpeaking) return;

    setIsAISpeaking(false);
    transitionTo(STATES.USER_SPEAKING);
  }, [isAISpeaking, transitionTo]);

  /**
   * Handle user interrupting AI
   */
  const handleInterrupt = useCallback(() => {
    if (isAISpeaking) {
      onInterrupt?.();
      finishAIResponse();
    }
  }, [isAISpeaking, onInterrupt, finishAIResponse]);

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO FRAME HANDLER
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Process audio frame (called on interval)
   * This is where the state machine logic lives.
   *
   * Uses emotion-aware thresholds for natural conversational timing.
   */
  const handleAudioFrame = useCallback((userIsSpeaking) => {
    const now = performance.now();

    // Get current emotion-adjusted thresholds
    const thresholds = effectiveThresholds;

    // User is speaking
    if (userIsSpeaking) {
      silenceStartRef.current = null;

      // User interrupts AI
      if (currentState === STATES.AI_SPEAKING) {
        handleInterrupt();
        return;
      }

      // Return to user speaking state
      if (currentState !== STATES.USER_SPEAKING) {
        transitionTo(STATES.USER_SPEAKING);
      }
      return;
    }

    // User is silent - calculate duration
    if (!silenceStartRef.current) {
      silenceStartRef.current = now;
    }
    const silenceDuration = now - silenceStartRef.current;

    // State transitions based on emotion-adjusted silence thresholds
    if (silenceDuration < thresholds.MICRO_PAUSE_MAX) {
      // Micro-pause: 0 to ~300ms (adjusted by emotion)
      if (currentState === STATES.USER_SPEAKING) {
        transitionTo(STATES.MICRO_PAUSE);
      }
      // Optional soft backchannel with low probability
      maybePlayCue(CUE_TYPES.BACKCHANNEL, 'MICRO_PAUSE');

    } else if (silenceDuration < thresholds.SHORT_PAUSE_MAX) {
      // Short pause: ~300-900ms (adjusted by emotion)
      if (currentState !== STATES.SHORT_PAUSE && currentState !== STATES.AI_SPEAKING) {
        transitionTo(STATES.SHORT_PAUSE);
        maybePlayCue(CUE_TYPES.ENCOURAGER, 'SHORT_PAUSE');
      }

    } else if (silenceDuration < thresholds.THINKING_PAUSE_MAX) {
      // Thinking pause: ~900-2000ms (adjusted by emotion)
      if (currentState !== STATES.THINKING_PAUSE && currentState !== STATES.AI_SPEAKING) {
        transitionTo(STATES.THINKING_PAUSE);
        maybePlayCue(CUE_TYPES.CONTINUATION, 'THINKING_PAUSE');
      }

    } else {
      // Completion pause: 2000ms+ (adjusted by emotion)
      if (currentState !== STATES.COMPLETION_PAUSE && currentState !== STATES.AI_SPEAKING) {
        transitionTo(STATES.COMPLETION_PAUSE);
        startAIResponse();
      }
    }
  }, [currentState, effectiveThresholds, transitionTo, maybePlayCue, handleInterrupt, startAIResponse]);

  // ═══════════════════════════════════════════════════════════════════════════
  // VAD INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Update user speaking state (call this from VAD)
   */
  const updateUserSpeaking = useCallback((speaking) => {
    setIsUserSpeaking(speaking);
  }, []);

  /**
   * Manual trigger for AI response (e.g., from text input)
   */
  const triggerAIResponse = useCallback(() => {
    if (!isAISpeaking) {
      transitionTo(STATES.COMPLETION_PAUSE);
      startAIResponse();
    }
  }, [isAISpeaking, transitionTo, startAIResponse]);

  /**
   * Mark AI as done speaking
   */
  const markAIDone = useCallback(() => {
    finishAIResponse();
  }, [finishAIResponse]);

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN LOOP
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      handleAudioFrame(isUserSpeaking);
    }, TIMING.AUDIO_FRAME_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, isUserSpeaking, handleAudioFrame]);

  // ═══════════════════════════════════════════════════════════════════════════
  // RETURN
  // ═══════════════════════════════════════════════════════════════════════════

  return {
    // State
    currentState,
    isUserSpeaking,
    isAISpeaking,
    lastCue,
    conversationLog,

    // Emotion state
    emotion,
    emotionConfidence,
    effectiveThresholds,

    // Controls
    updateUserSpeaking,
    triggerAIResponse,
    markAIDone,
    transitionTo,

    // Emotion controls
    setEmotion,
    setEmotionConfidence,

    // Direct state setters (for testing/override)
    setIsUserSpeaking,
    setIsAISpeaking,

    // Constants
    STATES,
    TIMING,
    CUE_TYPES,
    BASE_TIMING
  };
}

export default useTurnTaking;
