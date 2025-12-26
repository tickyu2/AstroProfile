/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EMOTION BEHAVIOR CONSTANTS
 * Shared emotion-to-behavior mappings used across the behavior system
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Each emotion has associated behavior parameters that affect:
 * - Timing (zone1/2/3 thresholds for turn-taking)
 * - Backchannel frequency
 * - Response length (maxResponseTokens)
 * - Response style
 * - Advice bias
 * - TTS hints (rate, pitch, warmth)
 *
 * Created: December 21, 2025
 */

/**
 * Complete emotion behavior map
 * Used by the behavior engine to determine Luna's response characteristics
 */
export const EMOTION_BEHAVIORS = {
  neutral: {
    timing: { zone1: 300, zone2: 900, zone3: 2000 },
    backchannelFrequency: 0.30,
    maxResponseTokens: 220,
    style: 'balanced',
    adviceBias: 0.5,
    warmth: 0.5,
    pace: 1.0,
    ttsHints: { rate: 1.0, pitch: 1.0, warmth: 0.5 }
  },
  sad: {
    timing: { zone1: 450, zone2: 1200, zone3: 2500 },
    backchannelFrequency: 0.45,
    maxResponseTokens: 160,
    style: 'gentle',
    adviceBias: 0.2,
    warmth: 0.8,
    pace: 0.92,
    ttsHints: { rate: 0.92, pitch: 0.95, warmth: 0.8 }
  },
  anxious: {
    timing: { zone1: 400, zone2: 1100, zone3: 2350 },
    backchannelFrequency: 0.40,
    maxResponseTokens: 150,
    style: 'reassuring',
    adviceBias: 0.35,
    warmth: 0.7,
    pace: 0.95,
    ttsHints: { rate: 0.95, pitch: 0.98, warmth: 0.7 }
  },
  happy: {
    timing: { zone1: 220, zone2: 780, zone3: 1800 },
    backchannelFrequency: 0.50,
    maxResponseTokens: 230,
    style: 'playful',
    adviceBias: 0.6,
    warmth: 0.6,
    pace: 1.08,
    ttsHints: { rate: 1.08, pitch: 1.05, warmth: 0.6 }
  },
  excited: {
    timing: { zone1: 180, zone2: 700, zone3: 1700 },
    backchannelFrequency: 0.55,
    maxResponseTokens: 250,
    style: 'enthusiastic',
    adviceBias: 0.65,
    warmth: 0.5,
    pace: 1.12,
    ttsHints: { rate: 1.12, pitch: 1.08, warmth: 0.5 }
  },
  angry: {
    timing: { zone1: 250, zone2: 820, zone3: 1880 },
    backchannelFrequency: 0.25,
    maxResponseTokens: 170,
    style: 'grounding',
    adviceBias: 0.3,
    warmth: 0.6,
    pace: 0.98,
    ttsHints: { rate: 0.98, pitch: 0.95, warmth: 0.6 }
  },
  surprised: {
    timing: { zone1: 240, zone2: 800, zone3: 1850 },
    backchannelFrequency: 0.40,
    maxResponseTokens: 200,
    style: 'curious',
    adviceBias: 0.5,
    warmth: 0.55,
    pace: 1.05,
    ttsHints: { rate: 1.05, pitch: 1.03, warmth: 0.55 }
  },
  disgusted: {
    timing: { zone1: 350, zone2: 1000, zone3: 2150 },
    backchannelFrequency: 0.25,
    maxResponseTokens: 160,
    style: 'steady',
    adviceBias: 0.4,
    warmth: 0.5,
    pace: 0.96,
    ttsHints: { rate: 0.96, pitch: 0.97, warmth: 0.5 }
  },
  fearful: {
    timing: { zone1: 400, zone2: 1100, zone3: 2400 },
    backchannelFrequency: 0.45,
    maxResponseTokens: 140,
    style: 'protective',
    adviceBias: 0.25,
    warmth: 0.85,
    pace: 0.90,
    ttsHints: { rate: 0.90, pitch: 0.95, warmth: 0.85 }
  },
  tender: {
    timing: { zone1: 350, zone2: 1000, zone3: 2200 },
    backchannelFrequency: 0.35,
    maxResponseTokens: 180,
    style: 'intimate',
    adviceBias: 0.3,
    warmth: 0.9,
    pace: 0.94,
    ttsHints: { rate: 0.94, pitch: 0.98, warmth: 0.9 }
  },
  confused: {
    timing: { zone1: 380, zone2: 1050, zone3: 2250 },
    backchannelFrequency: 0.35,
    maxResponseTokens: 200,
    style: 'clarifying',
    adviceBias: 0.55,
    warmth: 0.6,
    pace: 0.95,
    ttsHints: { rate: 0.95, pitch: 1.0, warmth: 0.6 }
  }
};

/**
 * Default behavior (neutral baseline)
 */
export const DEFAULT_BEHAVIOR = {
  timing: { zone1: 300, zone2: 900, zone3: 2000 },
  backchannelFrequency: 0.30,
  maxResponseTokens: 220,
  style: 'balanced',
  adviceBias: 0.5,
  warmth: 0.6,
  pace: 1.0,
  responseLength: 1.0,
  ttsHints: { rate: 1.0, pitch: 1.0, warmth: 0.5 }
};

/**
 * Layer weights for behavior blending
 * Configurable weights that sum to ~1.0
 */
export const DEFAULT_LAYER_WEIGHTS = {
  emotion: 0.30,      // Base emotional behavior
  session: 0.15,      // Session-specific biases
  userPrefs: 0.10,    // Explicit user preferences
  memory: 0.20,       // Long-term interaction profile
  cluster: 0.15,      // Cluster-based behavior
  drift: 0.10         // Global drift
};

/**
 * Get emotion behavior or fallback to neutral
 */
export function getEmotionBehavior(emotion) {
  return EMOTION_BEHAVIORS[emotion] || EMOTION_BEHAVIORS.neutral;
}

export default {
  EMOTION_BEHAVIORS,
  DEFAULT_BEHAVIOR,
  DEFAULT_LAYER_WEIGHTS,
  getEmotionBehavior
};
