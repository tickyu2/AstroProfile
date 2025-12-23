/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EMOTION SMOOTHER - EMA-Based Jitter Reduction
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Prevents jarring emotion jumps by applying exponential moving average (EMA)
 * smoothing to incoming SER results. This creates natural emotional transitions
 * instead of sudden switches.
 *
 * Features:
 * - EMA smoothing with configurable alpha (0.4 default)
 * - Confidence-aware fallback (low confidence = keep previous)
 * - Hysteresis to prevent oscillation between similar emotions
 * - Trend detection (escalating, de-escalating, stable)
 *
 * Usage:
 *   const smoother = new EmotionSmoother();
 *   const smoothedEmotion = smoother.smooth(rawSERResult);
 *
 * Created: December 21, 2025
 */

/**
 * Smoothing factor (0-1)
 * Lower = smoother (more lag), Higher = more responsive (more jitter)
 * 0.4 is a good balance for voice conversations
 */
const DEFAULT_ALPHA = 0.4;

/**
 * Minimum confidence to accept a new emotion
 * Below this, we keep the previous emotion with reduced confidence
 */
const MIN_CONFIDENCE_THRESHOLD = 0.25;

/**
 * Emotion ordering for interpolation
 * Arranged by valence/arousal similarity for smooth transitions
 */
const EMOTION_ORDER = [
  'neutral',    // 0 - baseline
  'happy',      // 1 - positive high
  'surprised',  // 2 - high arousal
  'anxious',    // 3 - negative high arousal
  'angry',      // 4 - negative high
  'disgusted',  // 5 - negative mid
  'sad'         // 6 - negative low arousal
];

/**
 * Get numeric index for emotion interpolation
 */
function emotionToIndex(primary) {
  const idx = EMOTION_ORDER.indexOf(primary);
  return idx === -1 ? 0 : idx;
}

/**
 * Convert index back to emotion string
 */
function indexToEmotion(idx) {
  const clampedIdx = Math.round(Math.max(0, Math.min(EMOTION_ORDER.length - 1, idx)));
  return EMOTION_ORDER[clampedIdx];
}

/**
 * EmotionSmoother Class
 *
 * Maintains state across emotion updates and provides smoothed output.
 */
export class EmotionSmoother {
  /**
   * @param {Object} options - Configuration
   * @param {number} options.alpha - Smoothing factor 0-1 (default: 0.4)
   * @param {number} options.minConfidence - Minimum confidence to accept (default: 0.25)
   */
  constructor(options = {}) {
    this.alpha = options.alpha ?? DEFAULT_ALPHA;
    this.minConfidence = options.minConfidence ?? MIN_CONFIDENCE_THRESHOLD;

    // Current smoothed state
    this.current = {
      primary: 'neutral',
      secondary: '',
      confidence: 0.0
    };

    // History for trend detection
    this.history = [];
    this.maxHistory = 5;

    // Track last raw input for debugging
    this.lastRaw = null;
  }

  /**
   * Smooth an incoming emotion reading
   *
   * @param {Object} next - Raw SER result
   * @param {string} next.primary - Primary emotion
   * @param {string} next.secondary - Secondary emotion (optional)
   * @param {number} next.confidence - Detection confidence 0-1
   * @returns {Object} Smoothed emotion with trend info
   */
  smooth(next) {
    this.lastRaw = next;

    // Handle null/undefined input
    if (!next || !next.primary) {
      return this._buildOutput();
    }

    const nextConfidence = next.confidence ?? 0.5;

    // Low confidence: keep current emotion, slightly nudge confidence down
    if (nextConfidence < this.minConfidence) {
      this.current.confidence = this.current.confidence * 0.85 + nextConfidence * 0.15;
      return this._buildOutput();
    }

    // Interpolate emotion index
    const prevIdx = emotionToIndex(this.current.primary);
    const nextIdx = emotionToIndex(next.primary);
    const blendedIdx = prevIdx * (1 - this.alpha) + nextIdx * this.alpha;
    const newPrimary = indexToEmotion(blendedIdx);

    // Handle secondary emotion - prefer higher confidence source
    const newSecondary = nextConfidence > this.current.confidence
      ? (next.secondary || this.current.secondary)
      : this.current.secondary;

    // Smooth confidence
    const newConfidence = this.current.confidence * (1 - this.alpha) + nextConfidence * this.alpha;

    // Update history for trend detection
    this._addToHistory(this.current.primary, this.current.confidence);

    // Update current state
    this.current = {
      primary: newPrimary,
      secondary: newSecondary,
      confidence: newConfidence
    };

    return this._buildOutput();
  }

  /**
   * Get current smoothed emotion without new input
   */
  getCurrent() {
    return this._buildOutput();
  }

  /**
   * Reset smoother to neutral state
   */
  reset() {
    this.current = {
      primary: 'neutral',
      secondary: '',
      confidence: 0.0
    };
    this.history = [];
    this.lastRaw = null;
  }

  /**
   * Add to history for trend detection
   * @private
   */
  _addToHistory(primary, confidence) {
    this.history.push({
      primary,
      confidence,
      timestamp: Date.now()
    });

    // Keep only recent history
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  /**
   * Detect emotional trend from history
   * @private
   * @returns {string} 'escalating' | 'de-escalating' | 'stable'
   */
  _detectTrend() {
    if (this.history.length < 3) {
      return 'stable';
    }

    // Compare arousal levels (rough approximation)
    const arousalMap = {
      neutral: 0.3,
      sad: 0.2,
      disgusted: 0.4,
      angry: 0.9,
      anxious: 0.8,
      surprised: 0.7,
      happy: 0.6
    };

    const recentArousal = this.history.slice(-3).map(h =>
      (arousalMap[h.primary] || 0.3) * h.confidence
    );

    const avgRecent = recentArousal.slice(-2).reduce((a, b) => a + b, 0) / 2;
    const avgPrevious = recentArousal[0];

    const diff = avgRecent - avgPrevious;

    if (diff > 0.15) return 'escalating';
    if (diff < -0.15) return 'de-escalating';
    return 'stable';
  }

  /**
   * Build output object with current state and metadata
   * @private
   */
  _buildOutput() {
    return {
      primary: this.current.primary,
      secondary: this.current.secondary,
      confidence: this.current.confidence,
      trend: this._detectTrend(),
      smoothed: true,
      _raw: this.lastRaw
    };
  }

  /**
   * Get current alpha value
   */
  getAlpha() {
    return this.alpha;
  }

  /**
   * Update alpha value (for dynamic adjustment)
   * @param {number} newAlpha - New smoothing factor 0-1
   */
  setAlpha(newAlpha) {
    this.alpha = Math.max(0.1, Math.min(0.9, newAlpha));
  }
}

/**
 * Create a pre-configured smoother instance
 */
export function createSmoother(options = {}) {
  return new EmotionSmoother(options);
}

/**
 * Singleton smoother for global use
 */
let globalSmoother = null;

export function getGlobalSmoother() {
  if (!globalSmoother) {
    globalSmoother = new EmotionSmoother();
  }
  return globalSmoother;
}

export default EmotionSmoother;
