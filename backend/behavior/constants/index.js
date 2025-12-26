/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * BEHAVIOR CONSTANTS INDEX
 * Central export for all behavior system constants
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Created: December 21, 2025
 */

// Emotion behaviors
export {
  EMOTION_BEHAVIORS,
  DEFAULT_BEHAVIOR,
  DEFAULT_LAYER_WEIGHTS,
  getEmotionBehavior
} from './emotionBehaviors.js';

// Drift bounds and rates
export {
  DRIFT_BOUNDS,
  DRIFT_RATES,
  SIGNAL_WEIGHTS,
  getDriftBounds,
  getDriftRate,
  isWithinBounds,
  clampToBounds
} from './driftBounds.js';
