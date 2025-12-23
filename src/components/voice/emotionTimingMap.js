/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EMOTION TIMING MAP - Dynamic Turn-Taking Thresholds
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Adjusts silence thresholds based on detected emotional state.
 * Negative values = faster response (less patience)
 * Positive values = slower response (more patience)
 *
 * Backed by conversational-timing research:
 * - Happy/excited speakers have faster turn-taking patterns
 * - Sad/anxious speakers need more processing time
 * - Angry speakers often have sharper, quicker exchanges
 *
 * Zone 1: Micro-pause (0-300ms base) - breathing, word search
 * Zone 2: Short pause (300-900ms base) - thinking, formulating
 * Zone 3: Thinking pause (900-2000ms base) - deep thought, emotional processing
 *
 * Created: December 21, 2025
 */

/**
 * Timing modifiers in milliseconds per emotion.
 * Applied to base thresholds in useTurnTaking.
 */
export const EmotionTimingModifiers = {
  // Neutral - baseline, no adjustment
  neutral: {
    zone1: 0,
    zone2: 0,
    zone3: 0
  },

  // Happy - slightly faster exchanges, more fluid conversation
  happy: {
    zone1: -80,
    zone2: -120,
    zone3: -200
  },

  // Excited - noticeably faster, high energy exchanges
  excited: {
    zone1: -120,
    zone2: -200,
    zone3: -300
  },

  // Sad - significantly more patience, allow processing time
  sad: {
    zone1: +150,
    zone2: +300,
    zone3: +500
  },

  // Anxious - more patience, don't rush the speaker
  anxious: {
    zone1: +100,
    zone2: +200,
    zone3: +350
  },

  // Angry - slightly faster, match the intensity
  angry: {
    zone1: -50,
    zone2: -80,
    zone3: -120
  },

  // Surprised - quick initial response, then patience
  surprised: {
    zone1: -60,
    zone2: -100,
    zone3: -150
  },

  // Disgusted - slight patience increase
  disgusted: {
    zone1: +50,
    zone2: +100,
    zone3: +150
  },

  // Confused - extra patience for clarification
  confused: {
    zone1: +80,
    zone2: +150,
    zone3: +250
  },

  // Tender/loving - warm, patient exchanges
  tender: {
    zone1: +50,
    zone2: +100,
    zone3: +200
  },

  // Fearful - patience with gentle responsiveness
  fearful: {
    zone1: +100,
    zone2: +200,
    zone3: +400
  }
};

/**
 * Base timing thresholds (in ms).
 * These are the defaults before emotion modifiers are applied.
 */
export const BASE_TIMING = {
  MICRO_PAUSE_MAX: 300,
  SHORT_PAUSE_MAX: 900,
  THINKING_PAUSE_MAX: 2000,
  COMPLETION_MIN: 2000
};

/**
 * Get effective thresholds adjusted for current emotion.
 *
 * @param {string} emotion - Current detected emotion
 * @param {number} confidence - Confidence of emotion detection (0-1)
 * @returns {Object} Adjusted timing thresholds
 */
export function getEffectiveThresholds(emotion = 'neutral', confidence = 0.5) {
  const modifiers = EmotionTimingModifiers[emotion] || EmotionTimingModifiers.neutral;

  // Scale modifiers by confidence - high confidence = full modifier
  // Low confidence = reduced effect (blend toward neutral)
  const scale = Math.min(1, Math.max(0.3, confidence)); // Clamp between 0.3-1.0

  const adjustedZone1 = Math.round(modifiers.zone1 * scale);
  const adjustedZone2 = Math.round(modifiers.zone2 * scale);
  const adjustedZone3 = Math.round(modifiers.zone3 * scale);

  // Calculate adjusted thresholds with safety minimums
  const microPauseMax = Math.max(150, BASE_TIMING.MICRO_PAUSE_MAX + adjustedZone1);
  const shortPauseMax = Math.max(400, BASE_TIMING.SHORT_PAUSE_MAX + adjustedZone2);
  const thinkingPauseMax = Math.max(800, BASE_TIMING.THINKING_PAUSE_MAX + adjustedZone3);

  return {
    MICRO_PAUSE_MAX: microPauseMax,
    SHORT_PAUSE_MAX: shortPauseMax,
    THINKING_PAUSE_MAX: thinkingPauseMax,
    COMPLETION_MIN: thinkingPauseMax, // Completion threshold matches thinking max

    // Debug info
    _emotion: emotion,
    _confidence: confidence,
    _scale: scale,
    _adjustments: {
      zone1: adjustedZone1,
      zone2: adjustedZone2,
      zone3: adjustedZone3
    }
  };
}

/**
 * Get a human-readable description of timing adjustments.
 * Useful for debugging and visualization.
 *
 * @param {string} emotion - Current emotion
 * @returns {string} Description of timing behavior
 */
export function getTimingDescription(emotion) {
  const modifiers = EmotionTimingModifiers[emotion];

  if (!modifiers) {
    return 'Unknown emotion - using neutral timing';
  }

  const avgModifier = (modifiers.zone1 + modifiers.zone2 + modifiers.zone3) / 3;

  if (avgModifier < -100) {
    return 'Very responsive - quick exchanges';
  } else if (avgModifier < -30) {
    return 'Responsive - slightly faster pacing';
  } else if (avgModifier > 200) {
    return 'Very patient - extended silences allowed';
  } else if (avgModifier > 50) {
    return 'Patient - allowing processing time';
  } else {
    return 'Balanced - neutral pacing';
  }
}

export default {
  EmotionTimingModifiers,
  BASE_TIMING,
  getEffectiveThresholds,
  getTimingDescription
};
