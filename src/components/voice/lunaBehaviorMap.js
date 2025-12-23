/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LUNA BEHAVIOR MAP - Unified Emotion-to-Behavior Profiles
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Central mapping from detected emotion to Luna's behavioral parameters.
 * This single source of truth drives:
 *
 * - Turn-taking timing thresholds
 * - Backchannel/cue frequency
 * - LLM response length and style
 * - Advice vs reflection balance
 * - TTS voice modulation hints
 *
 * Each profile is designed based on therapeutic conversation research
 * and natural human interaction patterns.
 *
 * Created: December 21, 2025
 */

/**
 * Luna Behavior Map
 *
 * Each emotion maps to a complete behavior profile:
 *
 * @property {Object} timing - Turn-taking thresholds in ms
 *   - zone1: Micro-pause threshold (breathing, word search)
 *   - zone2: Short pause threshold (between sentences)
 *   - zone3: Thinking pause threshold (processing, deep thought)
 *
 * @property {number} backchannelFrequency - Probability of generating cues (0-1)
 * @property {number} maxResponseTokens - LLM response length limit
 * @property {string} style - Conversational style keyword
 * @property {number} adviceBias - 0 = pure reflection, 1 = advisory
 * @property {Object} ttsHints - Voice modulation suggestions
 */
export const LunaBehaviorMap = {
  // ─────────────────────────────────────────────────────────────────────────────
  // NEUTRAL - Balanced, present, warm baseline
  // ─────────────────────────────────────────────────────────────────────────────
  neutral: {
    timing: {
      zone1: 300,   // Standard micro-pause
      zone2: 900,   // Standard short pause
      zone3: 2000   // Standard thinking pause
    },
    backchannelFrequency: 0.30,
    maxResponseTokens: 220,
    style: 'balanced',
    adviceBias: 0.5,
    ttsHints: {
      rate: 1.0,
      pitch: 1.0,
      warmth: 0.5
    },
    description: 'Warm, present, and naturally engaged'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SAD - Gentle, patient, unhurried support
  // ─────────────────────────────────────────────────────────────────────────────
  sad: {
    timing: {
      zone1: 450,   // +150ms patience
      zone2: 1200,  // +300ms patience
      zone3: 2500   // +500ms patience
    },
    backchannelFrequency: 0.45,
    maxResponseTokens: 160,
    style: 'gentle',
    adviceBias: 0.2,  // Mostly reflection, minimal advice
    ttsHints: {
      rate: 0.92,
      pitch: 0.95,
      warmth: 0.8
    },
    description: 'Soft, slow, nurturing presence'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ANXIOUS - Calming, grounding, reassuring
  // ─────────────────────────────────────────────────────────────────────────────
  anxious: {
    timing: {
      zone1: 400,   // +100ms patience
      zone2: 1100,  // +200ms patience
      zone3: 2350   // +350ms patience
    },
    backchannelFrequency: 0.40,
    maxResponseTokens: 150,
    style: 'reassuring',
    adviceBias: 0.35,
    ttsHints: {
      rate: 0.95,
      pitch: 0.98,
      warmth: 0.7
    },
    description: 'Steady, warm, calming'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // HAPPY - Playful, matching energy, celebratory
  // ─────────────────────────────────────────────────────────────────────────────
  happy: {
    timing: {
      zone1: 220,   // -80ms faster
      zone2: 780,   // -120ms faster
      zone3: 1800   // -200ms faster
    },
    backchannelFrequency: 0.50,
    maxResponseTokens: 230,
    style: 'playful',
    adviceBias: 0.6,
    ttsHints: {
      rate: 1.08,
      pitch: 1.05,
      warmth: 0.6
    },
    description: 'Light, curious, encouraging'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // EXCITED - High energy, enthusiastic matching
  // ─────────────────────────────────────────────────────────────────────────────
  excited: {
    timing: {
      zone1: 180,   // -120ms much faster
      zone2: 700,   // -200ms faster
      zone3: 1700   // -300ms faster
    },
    backchannelFrequency: 0.55,
    maxResponseTokens: 250,
    style: 'enthusiastic',
    adviceBias: 0.65,
    ttsHints: {
      rate: 1.12,
      pitch: 1.08,
      warmth: 0.5
    },
    description: 'Energetic, engaged, matching excitement'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ANGRY - Grounding, validating, non-reactive
  // ─────────────────────────────────────────────────────────────────────────────
  angry: {
    timing: {
      zone1: 250,   // -50ms slightly faster
      zone2: 820,   // -80ms slightly faster
      zone3: 1880   // -120ms slightly faster
    },
    backchannelFrequency: 0.25,  // Less interruption
    maxResponseTokens: 170,
    style: 'grounding',
    adviceBias: 0.3,
    ttsHints: {
      rate: 0.98,
      pitch: 0.95,
      warmth: 0.6
    },
    description: 'Calm, steady, non-reactive'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SURPRISED - Curious, engaged, matching wonder
  // ─────────────────────────────────────────────────────────────────────────────
  surprised: {
    timing: {
      zone1: 240,   // -60ms faster
      zone2: 800,   // -100ms faster
      zone3: 1850   // -150ms faster
    },
    backchannelFrequency: 0.40,
    maxResponseTokens: 200,
    style: 'curious',
    adviceBias: 0.5,
    ttsHints: {
      rate: 1.05,
      pitch: 1.03,
      warmth: 0.55
    },
    description: 'Openly curious and engaged'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // DISGUSTED - Steady, acknowledging, non-judgmental
  // ─────────────────────────────────────────────────────────────────────────────
  disgusted: {
    timing: {
      zone1: 350,   // +50ms patience
      zone2: 1000,  // +100ms patience
      zone3: 2150   // +150ms patience
    },
    backchannelFrequency: 0.25,
    maxResponseTokens: 160,
    style: 'steady',
    adviceBias: 0.4,
    ttsHints: {
      rate: 0.96,
      pitch: 0.97,
      warmth: 0.5
    },
    description: 'Measured, acknowledging'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // FEARFUL - Protective, calming, extra patient
  // ─────────────────────────────────────────────────────────────────────────────
  fearful: {
    timing: {
      zone1: 400,   // +100ms patience
      zone2: 1100,  // +200ms patience
      zone3: 2400   // +400ms patience
    },
    backchannelFrequency: 0.45,
    maxResponseTokens: 140,
    style: 'protective',
    adviceBias: 0.25,
    ttsHints: {
      rate: 0.90,
      pitch: 0.95,
      warmth: 0.85
    },
    description: 'Gentle, protective, grounding'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // TENDER - Warm, intimate, matching softness
  // ─────────────────────────────────────────────────────────────────────────────
  tender: {
    timing: {
      zone1: 350,   // +50ms patience
      zone2: 1000,  // +100ms patience
      zone3: 2200   // +200ms patience
    },
    backchannelFrequency: 0.35,
    maxResponseTokens: 180,
    style: 'intimate',
    adviceBias: 0.3,
    ttsHints: {
      rate: 0.94,
      pitch: 0.98,
      warmth: 0.9
    },
    description: 'Warm, intimate, present'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CONFUSED - Clarifying, patient, helpful
  // ─────────────────────────────────────────────────────────────────────────────
  confused: {
    timing: {
      zone1: 380,   // +80ms patience
      zone2: 1050,  // +150ms patience
      zone3: 2250   // +250ms patience
    },
    backchannelFrequency: 0.35,
    maxResponseTokens: 200,
    style: 'clarifying',
    adviceBias: 0.55,
    ttsHints: {
      rate: 0.95,
      pitch: 1.0,
      warmth: 0.6
    },
    description: 'Patient, clarifying, helpful'
  }
};

/**
 * Style descriptions for LLM prompting
 */
export const StyleDescriptions = {
  balanced: 'warm, present, and naturally engaged',
  gentle: 'soft, slow, and nurturing',
  reassuring: 'steady, warm, and calming',
  playful: 'light, curious, and encouraging',
  enthusiastic: 'energetic, engaged, and matching their excitement',
  grounding: 'calm, steady, and non-reactive',
  curious: 'openly curious and engaged',
  steady: 'measured and acknowledging',
  protective: 'gentle, protective, and grounding',
  intimate: 'warm, intimate, and deeply present',
  clarifying: 'patient, clarifying, and helpful'
};

/**
 * Get style description for LLM prompting
 */
export function getStyleDescription(style) {
  return StyleDescriptions[style] || StyleDescriptions.balanced;
}

/**
 * Get behavior profile for an emotion
 * Returns neutral if emotion not found
 */
export function getBehavior(emotion) {
  const primary = typeof emotion === 'string' ? emotion : emotion?.primary;
  return LunaBehaviorMap[primary] || LunaBehaviorMap.neutral;
}

export default LunaBehaviorMap;
