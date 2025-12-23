/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LUNA BEHAVIOR ENGINE - Confidence-Scaled Behavior System
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * The "Nano Brain" that translates smoothed emotion into active behavior.
 * Uses confidence scaling to blend emotional behaviors with neutral baseline,
 * preventing jarring behavior changes on low-confidence detections.
 *
 * Features:
 * - Confidence-scaled blending (low confidence → more neutral)
 * - Integration with EmotionSmoother
 * - Real-time behavior updates
 * - Turn-taking threshold calculation
 * - LLM parameter generation
 *
 * Created: December 21, 2025
 */

import { LunaBehaviorMap, getStyleDescription } from './lunaBehaviorMap';
import { EmotionSmoother } from './emotionSmoother';

/**
 * Linear interpolation helper
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Get behavior profile scaled by emotion confidence.
 *
 * Low confidence = blend toward neutral
 * High confidence = use full emotional profile
 *
 * @param {Object} emotion - Emotion object with primary, secondary, confidence
 * @returns {Object} Blended behavior profile
 */
export function getBehaviorForEmotion(emotion) {
  const primary = emotion?.primary || 'neutral';
  const confidence = Math.max(0, Math.min(1, emotion?.confidence ?? 0.5));

  const base = LunaBehaviorMap[primary] || LunaBehaviorMap.neutral;
  const neutral = LunaBehaviorMap.neutral;

  // Blend factor: 30% minimum emotion influence, scaling up to 100%
  // This prevents total loss of emotional awareness on low confidence
  const blend = 0.3 + 0.7 * confidence;

  return {
    // Timing: interpolate all thresholds
    timing: {
      zone1: Math.round(lerp(neutral.timing.zone1, base.timing.zone1, blend)),
      zone2: Math.round(lerp(neutral.timing.zone2, base.timing.zone2, blend)),
      zone3: Math.round(lerp(neutral.timing.zone3, base.timing.zone3, blend))
    },

    // Backchannel frequency
    backchannelFrequency: lerp(
      neutral.backchannelFrequency,
      base.backchannelFrequency,
      blend
    ),

    // LLM response length
    maxResponseTokens: Math.round(
      lerp(neutral.maxResponseTokens, base.maxResponseTokens, blend)
    ),

    // Style (use emotional style, not blended)
    style: base.style,
    styleDescription: getStyleDescription(base.style),

    // Advice bias
    adviceBias: lerp(neutral.adviceBias, base.adviceBias, blend),

    // TTS hints
    ttsHints: {
      rate: lerp(neutral.ttsHints.rate, base.ttsHints.rate, blend),
      pitch: lerp(neutral.ttsHints.pitch, base.ttsHints.pitch, blend),
      warmth: lerp(neutral.ttsHints.warmth, base.ttsHints.warmth, blend)
    },

    // Metadata
    _emotion: primary,
    _confidence: confidence,
    _blend: blend,
    _description: base.description
  };
}

/**
 * Luna Behavior Engine Class
 *
 * Maintains behavior state and integrates with emotion smoothing.
 * Use this as a singleton in your voice components.
 */
export class LunaBehaviorEngine {
  constructor() {
    this.smoother = new EmotionSmoother();
    this.currentBehavior = getBehaviorForEmotion({ primary: 'neutral', confidence: 0.5 });
    this.listeners = [];
  }

  /**
   * Process new raw emotion and update behavior
   * @param {Object} rawEmotion - Raw SER result
   * @returns {Object} Updated behavior profile
   */
  update(rawEmotion) {
    // Smooth the emotion first
    const smoothedEmotion = this.smoother.smooth(rawEmotion);

    // Get behavior for smoothed emotion
    this.currentBehavior = getBehaviorForEmotion(smoothedEmotion);

    // Add smoothed emotion to behavior for easy access
    this.currentBehavior._smoothedEmotion = smoothedEmotion;

    // Notify listeners
    this._notifyListeners();

    return this.currentBehavior;
  }

  /**
   * Get current behavior without updating
   */
  getCurrent() {
    return this.currentBehavior;
  }

  /**
   * Get current smoothed emotion
   */
  getEmotion() {
    return this.smoother.getCurrent();
  }

  /**
   * Get timing thresholds in format compatible with useTurnTaking
   */
  getTimingThresholds() {
    const t = this.currentBehavior.timing;
    return {
      MICRO_PAUSE_MAX: t.zone1,
      SHORT_PAUSE_MAX: t.zone2,
      THINKING_PAUSE_MAX: t.zone3,
      COMPLETION_MIN: t.zone3
    };
  }

  /**
   * Get LLM parameters for current behavior
   */
  getLLMParams() {
    return {
      maxTokens: this.currentBehavior.maxResponseTokens,
      style: this.currentBehavior.style,
      styleDescription: this.currentBehavior.styleDescription,
      adviceBias: this.currentBehavior.adviceBias
    };
  }

  /**
   * Get TTS parameters for current behavior
   */
  getTTSParams() {
    return this.currentBehavior.ttsHints;
  }

  /**
   * Should generate backchannel? (probabilistic check)
   */
  shouldBackchannel() {
    return Math.random() < this.currentBehavior.backchannelFrequency;
  }

  /**
   * Reset to neutral state
   */
  reset() {
    this.smoother.reset();
    this.currentBehavior = getBehaviorForEmotion({ primary: 'neutral', confidence: 0.5 });
    this._notifyListeners();
  }

  /**
   * Subscribe to behavior changes
   * @param {Function} callback - Called with new behavior when updated
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Notify all listeners of behavior change
   * @private
   */
  _notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.currentBehavior);
      } catch (e) {
        console.error('[LunaBehaviorEngine] Listener error:', e);
      }
    });
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    const emotion = this.smoother.getCurrent();
    return {
      rawEmotion: this.smoother.lastRaw,
      smoothedEmotion: emotion,
      behavior: this.currentBehavior,
      timing: this.getTimingThresholds(),
      llmParams: this.getLLMParams(),
      ttsParams: this.getTTSParams()
    };
  }
}

/**
 * Singleton instance for global use
 */
let engineInstance = null;

export function getLunaBehaviorEngine() {
  if (!engineInstance) {
    engineInstance = new LunaBehaviorEngine();
  }
  return engineInstance;
}

/**
 * React hook for using the behavior engine
 */
export function useLunaBehavior() {
  const engine = getLunaBehaviorEngine();
  return {
    update: engine.update.bind(engine),
    getCurrent: engine.getCurrent.bind(engine),
    getEmotion: engine.getEmotion.bind(engine),
    getTimingThresholds: engine.getTimingThresholds.bind(engine),
    getLLMParams: engine.getLLMParams.bind(engine),
    getTTSParams: engine.getTTSParams.bind(engine),
    shouldBackchannel: engine.shouldBackchannel.bind(engine),
    reset: engine.reset.bind(engine),
    subscribe: engine.subscribe.bind(engine)
  };
}

export default LunaBehaviorEngine;
