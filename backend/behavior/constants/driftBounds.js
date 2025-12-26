/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DRIFT BOUNDS AND RATES CONSTANTS
 * Shared drift parameters used across the behavior system
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Defines:
 * - DRIFT_BOUNDS: Min/max/default for each drift dimension
 * - DRIFT_RATES: EMA alpha (β) values for drift calculations
 * - SIGNAL_WEIGHTS: How different signals affect drift
 *
 * Created: December 21, 2025
 */

/**
 * Drift dimension bounds
 * Each dimension has min, max, and default values
 */
export const DRIFT_BOUNDS = {
  backchannelFrequency: {
    min: 0.1,
    max: 0.8,
    default: 0.3,
    description: 'How often Luna provides verbal acknowledgments'
  },
  adviceBias: {
    min: 0.1,
    max: 0.9,
    default: 0.5,
    description: 'Balance between listening and giving advice'
  },
  baseWarmth: {
    min: 0.3,
    max: 1.0,
    default: 0.7,
    description: 'Emotional warmth in responses'
  },
  basePace: {
    min: 0.7,
    max: 1.3,
    default: 1.0,
    description: 'Speaking pace multiplier'
  },
  baseResponsiveness: {
    min: 0.8,
    max: 1.2,
    default: 1.0,
    description: 'Response timing multiplier'
  },
  responseLength: {
    min: 0.6,
    max: 1.4,
    default: 1.0,
    description: 'Response length multiplier'
  },
  emotionalMirroring: {
    min: 0.2,
    max: 0.9,
    default: 0.6,
    description: 'How much Luna mirrors user emotions'
  }
};

/**
 * Drift rates (β values) for EMA calculations
 * Lower = slower adaptation, higher = faster adaptation
 * Range: 0.01 (very slow) to 0.1 (fast)
 */
export const DRIFT_RATES = {
  backchannelFrequency: 0.03,
  adviceBias: 0.02,
  timingScale: 0.03,
  warmth: 0.02,
  responsiveness: 0.02,
  responseLength: 0.02,
  emotionalMirroring: 0.02
};

/**
 * Signal weights for drift accumulation
 * How much each signal type affects drift
 */
export const SIGNAL_WEIGHTS = {
  // Backchannel signals
  backchannel_appreciated: { dimension: 'backchannelFrequency', delta: 0.02 },
  user_spoke_over_backchannel: { dimension: 'backchannelFrequency', delta: -0.03 },

  // Response length signals
  response_too_long: { dimension: 'responseLength', delta: -0.02 },
  response_too_short: { dimension: 'responseLength', delta: 0.02 },

  // Advice signals
  advice_accepted: { dimension: 'adviceBias', delta: 0.02 },
  advice_rejected: { dimension: 'adviceBias', delta: -0.02 },

  // Warmth signals
  warmth_appreciated: { dimension: 'baseWarmth', delta: 0.02 },
  too_warm: { dimension: 'baseWarmth', delta: -0.02 },

  // Pace signals
  pace_too_fast: { dimension: 'basePace', delta: -0.02 },
  pace_too_slow: { dimension: 'basePace', delta: 0.02 }
};

/**
 * Get drift bounds for a dimension
 */
export function getDriftBounds(dimension) {
  return DRIFT_BOUNDS[dimension] || null;
}

/**
 * Get drift rate for a dimension
 */
export function getDriftRate(dimension) {
  return DRIFT_RATES[dimension] || 0.02;
}

/**
 * Check if a value is within bounds
 */
export function isWithinBounds(dimension, value) {
  const bounds = DRIFT_BOUNDS[dimension];
  if (!bounds) return true;
  return value >= bounds.min && value <= bounds.max;
}

/**
 * Clamp a value to dimension bounds
 */
export function clampToBounds(dimension, value) {
  const bounds = DRIFT_BOUNDS[dimension];
  if (!bounds) return value;
  return Math.max(bounds.min, Math.min(bounds.max, value));
}

export default {
  DRIFT_BOUNDS,
  DRIFT_RATES,
  SIGNAL_WEIGHTS,
  getDriftBounds,
  getDriftRate,
  isWithinBounds,
  clampToBounds
};
