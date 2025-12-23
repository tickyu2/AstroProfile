/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * BEHAVIOR SIGNALS SERVICE - Frontend → Backend Learning Signals
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Sends behavior signals to backend for personalization learning:
 * - user_interrupt: User talked over Luna's TTS
 * - user_spoke_over_backchannel: User spoke right after a cue
 * - backchannel_appreciated: User paused after cue (appreciated it)
 * - user_comfortable_with_silence: User held long pause without distress
 *
 * Also tracks backchannel playback for session stats.
 *
 * Created: December 21, 2025
 */

/**
 * Behavior signal types
 */
export const BEHAVIOR_SIGNALS = {
  // Existing signals
  USER_INTERRUPT: 'user_interrupt',
  USER_SPOKE_OVER_BACKCHANNEL: 'user_spoke_over_backchannel',
  BACKCHANNEL_APPRECIATED: 'backchannel_appreciated',
  USER_COMFORTABLE_WITH_SILENCE: 'user_comfortable_with_silence',

  // Auto-tune flow signals
  POSITIVE_FLOW: 'positive_flow',
  NEGATIVE_FLOW: 'negative_flow',
  EMOTION_IMPROVED: 'emotion_improved',
  EMOTION_WORSENED: 'emotion_worsened',
  SHORT_RESPONSE: 'short_response',
  LONG_RESPONSE: 'long_response'
};

/**
 * Send a behavior signal to the backend
 *
 * @param {WebSocket} ws - WebSocket connection
 * @param {string} event - Signal event type
 * @param {Object} data - Optional additional data
 */
export function sendBehaviorSignal(ws, event, data = {}) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.warn('[BehaviorSignals] WebSocket not connected');
    return false;
  }

  ws.send(JSON.stringify({
    type: 'behavior_signal',
    payload: { event, data }
  }));

  console.log(`[BehaviorSignals] Sent: ${event}`);
  return true;
}

/**
 * Notify backend that a backchannel was played
 *
 * @param {WebSocket} ws - WebSocket connection
 */
export function sendBackchannelPlayed(ws) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    return false;
  }

  ws.send(JSON.stringify({
    type: 'backchannel_played',
    payload: {}
  }));

  return true;
}

/**
 * Request current behavior profile from backend
 *
 * @param {WebSocket} ws - WebSocket connection
 */
export function requestBehaviorUpdate(ws) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    return false;
  }

  ws.send(JSON.stringify({
    type: 'get_behavior',
    payload: {}
  }));

  return true;
}

/**
 * Create a behavior signal handler that tracks events and sends signals
 *
 * @param {Object} options
 * @param {React.MutableRefObject} options.wsRef - WebSocket ref
 * @param {Function} options.onBehaviorUpdate - Called when behavior updates
 * @returns {Object} Handler methods
 */
export function createBehaviorSignalHandler({ wsRef, onBehaviorUpdate }) {
  // Track last backchannel time for "spoke over" detection
  let lastBackchannelTime = null;
  const SPOKE_OVER_THRESHOLD = 400; // ms

  // Track silence for "comfortable with silence"
  let silenceReported = false;

  // Track last emotion for change detection
  let lastEmotion = null;

  // Track response timing
  let lunaFinishedSpeakingTime = null;

  return {
    /**
     * Call when user starts speaking while TTS is playing
     */
    onUserInterrupt() {
      sendBehaviorSignal(wsRef.current, BEHAVIOR_SIGNALS.USER_INTERRUPT);
    },

    /**
     * Call when a backchannel/cue is played
     */
    onBackchannelPlayed() {
      lastBackchannelTime = performance.now();
      sendBackchannelPlayed(wsRef.current);
    },

    /**
     * Call when user starts speaking - checks for "spoke over backchannel"
     */
    onUserStartedSpeaking() {
      if (lastBackchannelTime) {
        const dt = performance.now() - lastBackchannelTime;
        if (dt > 0 && dt < SPOKE_OVER_THRESHOLD) {
          sendBehaviorSignal(wsRef.current, BEHAVIOR_SIGNALS.USER_SPOKE_OVER_BACKCHANNEL);
        }
        lastBackchannelTime = null;
      }
    },

    /**
     * Call when user pauses after a backchannel (appreciated it)
     */
    onBackchannelAppreciated() {
      if (lastBackchannelTime) {
        sendBehaviorSignal(wsRef.current, BEHAVIOR_SIGNALS.BACKCHANNEL_APPRECIATED);
        lastBackchannelTime = null;
      }
    },

    /**
     * Call during long silence without anxious emotion
     * @param {number} silenceMs - Duration of silence
     * @param {string} emotionPrimary - Current detected emotion
     */
    onSilence(silenceMs, emotionPrimary) {
      // Only report once per extended silence
      if (silenceMs > 3000 && emotionPrimary !== 'anxious' && !silenceReported) {
        sendBehaviorSignal(wsRef.current, BEHAVIOR_SIGNALS.USER_COMFORTABLE_WITH_SILENCE);
        silenceReported = true;
      }
    },

    /**
     * Reset silence tracking (call when user starts speaking)
     */
    resetSilenceTracking() {
      silenceReported = false;
    },

    /**
     * Request behavior update from backend
     */
    requestBehavior() {
      requestBehaviorUpdate(wsRef.current);
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // AUTO-TUNE FLOW SIGNALS
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Call when Luna finishes speaking (TTS ends)
     */
    onLunaFinishedSpeaking() {
      lunaFinishedSpeakingTime = performance.now();
    },

    /**
     * Detect response flow based on timing and length
     * Call after user finishes speaking
     *
     * @param {string} transcript - User's transcribed response
     * @param {boolean} wasInterrupted - Whether user interrupted Luna
     */
    onUserFinishedSpeaking(transcript, wasInterrupted = false) {
      if (!lunaFinishedSpeakingTime) return;

      const responseTimeMs = performance.now() - lunaFinishedSpeakingTime;
      const wordCount = transcript ? transcript.trim().split(/\s+/).length : 0;

      // Detect response flow patterns
      if (wasInterrupted) {
        // Already handled by onUserInterrupt
        return;
      }

      // Very short response after moderate wait = possibly frustrated
      if (wordCount < 5 && responseTimeMs > 500 && responseTimeMs < 2000) {
        sendBehaviorSignal(wsRef.current, BEHAVIOR_SIGNALS.SHORT_RESPONSE, {
          wordCount,
          responseTimeMs
        });
      }
      // Long, elaborated response = positive flow
      else if (wordCount > 20 && responseTimeMs > 1000) {
        sendBehaviorSignal(wsRef.current, BEHAVIOR_SIGNALS.LONG_RESPONSE, {
          wordCount,
          responseTimeMs
        });
      }
      // Smooth, natural response timing = positive flow
      else if (responseTimeMs > 800 && responseTimeMs < 3000 && wordCount >= 5) {
        sendBehaviorSignal(wsRef.current, BEHAVIOR_SIGNALS.POSITIVE_FLOW, {
          wordCount,
          responseTimeMs
        });
      }

      lunaFinishedSpeakingTime = null;
    },

    /**
     * Detect emotion change and send appropriate signal
     *
     * @param {Object} currentEmotion - { primary, secondary, confidence }
     */
    onEmotionDetected(currentEmotion) {
      if (!lastEmotion || !currentEmotion) {
        lastEmotion = currentEmotion;
        return;
      }

      const negativeEmotions = ['sad', 'anxious', 'angry', 'fearful', 'disgusted'];
      const positiveEmotions = ['happy', 'excited', 'tender'];

      const wasNegative = negativeEmotions.includes(lastEmotion.primary);
      const isNegative = negativeEmotions.includes(currentEmotion.primary);
      const wasPositive = positiveEmotions.includes(lastEmotion.primary);
      const isPositive = positiveEmotions.includes(currentEmotion.primary);

      // Emotion improved: went from negative to neutral/positive
      if (wasNegative && !isNegative) {
        sendBehaviorSignal(wsRef.current, BEHAVIOR_SIGNALS.EMOTION_IMPROVED, {
          from: lastEmotion.primary,
          to: currentEmotion.primary
        });
      }
      // Emotion worsened: went from neutral/positive to negative
      else if (!wasNegative && isNegative) {
        sendBehaviorSignal(wsRef.current, BEHAVIOR_SIGNALS.EMOTION_WORSENED, {
          from: lastEmotion.primary,
          to: currentEmotion.primary
        });
      }

      lastEmotion = currentEmotion;
    },

    /**
     * Send positive flow signal manually
     */
    signalPositiveFlow() {
      sendBehaviorSignal(wsRef.current, BEHAVIOR_SIGNALS.POSITIVE_FLOW);
    },

    /**
     * Send negative flow signal manually
     */
    signalNegativeFlow() {
      sendBehaviorSignal(wsRef.current, BEHAVIOR_SIGNALS.NEGATIVE_FLOW);
    }
  };
}

export default {
  BEHAVIOR_SIGNALS,
  sendBehaviorSignal,
  sendBackchannelPlayed,
  requestBehaviorUpdate,
  createBehaviorSignalHandler
};
