/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EMOTION CUE MAP - Emotion-Aware Verbal Cues
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Provides contextually appropriate verbal cues based on detected emotion.
 * Each emotion has three categories:
 *
 * 1. Backchannels - Short acknowledgments during micro-pauses
 *    Purpose: Show active listening without interrupting
 *
 * 2. Encouragers - Slightly longer affirmations during short pauses
 *    Purpose: Validate and encourage continued sharing
 *
 * 3. Continuations - Gentle prompts during thinking pauses
 *    Purpose: Invite deeper sharing without pressure
 *
 * Based on therapeutic conversation patterns and emotional attunement research.
 *
 * Created: December 21, 2025
 */

/**
 * Emotion-specific verbal cues.
 * Each category is designed to match the emotional tone.
 */
export const EmotionCueMap = {
  // ─────────────────────────────────────────────────────────────────────────────
  // NEUTRAL - Standard conversational cues
  // ─────────────────────────────────────────────────────────────────────────────
  neutral: {
    backchannels: [
      "Mm.",
      "Mm-hm.",
      "Okay.",
      "Uh-huh.",
      "Yeah."
    ],
    encouragers: [
      "I see.",
      "Right.",
      "Got it.",
      "Makes sense.",
      "I understand."
    ],
    continuations: [
      "Go on.",
      "I'm listening.",
      "Tell me more.",
      "And then?",
      "What else?"
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SAD - Gentle, supportive, unhurried
  // ─────────────────────────────────────────────────────────────────────────────
  sad: {
    backchannels: [
      "Mm…",
      "Mm-hm…",
      "Oh…",
      "Yeah…",
      "I hear you…"
    ],
    encouragers: [
      "I hear you.",
      "That sounds heavy.",
      "I'm here.",
      "That's a lot to carry.",
      "I'm with you."
    ],
    continuations: [
      "Take your time.",
      "Whenever you're ready.",
      "Go on, I'm with you.",
      "There's no rush.",
      "I'm not going anywhere."
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // HAPPY - Warm, matching energy, celebratory
  // ─────────────────────────────────────────────────────────────────────────────
  happy: {
    backchannels: [
      "Yeah!",
      "Mm-hm!",
      "Nice!",
      "Ooh!",
      "Aw!"
    ],
    encouragers: [
      "That's wonderful!",
      "I love that!",
      "How exciting!",
      "That's so great!",
      "Oh, I like this!"
    ],
    continuations: [
      "Tell me more!",
      "And then what?",
      "Oh, what happened next?",
      "Keep going!",
      "I want to hear more!"
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // EXCITED - High energy, enthusiastic
  // ─────────────────────────────────────────────────────────────────────────────
  excited: {
    backchannels: [
      "Wow!",
      "Yes!",
      "Ooh!",
      "Whoa!",
      "Amazing!"
    ],
    encouragers: [
      "That's amazing!",
      "How cool!",
      "I love this energy!",
      "That's incredible!",
      "So exciting!"
    ],
    continuations: [
      "Tell me everything!",
      "What happened next?!",
      "Don't stop now!",
      "And then?!",
      "I'm so curious!"
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ANXIOUS - Calming, grounding, reassuring
  // ─────────────────────────────────────────────────────────────────────────────
  anxious: {
    backchannels: [
      "Mm-hm.",
      "Okay.",
      "I hear you.",
      "Yeah.",
      "Right."
    ],
    encouragers: [
      "I understand.",
      "That makes sense.",
      "It's okay to feel that way.",
      "I'm right here.",
      "You're doing great."
    ],
    continuations: [
      "Take a breath if you need.",
      "No pressure, go at your pace.",
      "Whenever you're ready.",
      "I'm listening, take your time.",
      "What feels important to share?"
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ANGRY - Validating, not dismissive, calm presence
  // ─────────────────────────────────────────────────────────────────────────────
  angry: {
    backchannels: [
      "Yeah.",
      "Right.",
      "Mm-hm.",
      "I hear you.",
      "Okay."
    ],
    encouragers: [
      "That's frustrating.",
      "I get it.",
      "That would upset anyone.",
      "I understand why you're angry.",
      "That's not okay."
    ],
    continuations: [
      "Tell me what happened.",
      "What's going on?",
      "I'm listening.",
      "Let it out.",
      "What else?"
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SURPRISED - Curious, engaged, matching wonder
  // ─────────────────────────────────────────────────────────────────────────────
  surprised: {
    backchannels: [
      "Oh!",
      "Wow!",
      "Really?",
      "Whoa!",
      "No way!"
    ],
    encouragers: [
      "I didn't expect that!",
      "That's surprising!",
      "Wait, really?",
      "Oh my!",
      "Wow, okay!"
    ],
    continuations: [
      "What happened?!",
      "Tell me more!",
      "How did that happen?",
      "Then what?",
      "I need to hear this!"
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CONFUSED - Clarifying, patient, helpful
  // ─────────────────────────────────────────────────────────────────────────────
  confused: {
    backchannels: [
      "Mm-hm.",
      "Okay.",
      "Right.",
      "I see.",
      "Yeah."
    ],
    encouragers: [
      "Let's work through this.",
      "That's complex.",
      "I understand the confusion.",
      "Let me make sure I follow.",
      "Take your time explaining."
    ],
    continuations: [
      "Help me understand.",
      "What part feels unclear?",
      "Walk me through it.",
      "Say more about that.",
      "Let's break this down."
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // TENDER - Warm, intimate, loving
  // ─────────────────────────────────────────────────────────────────────────────
  tender: {
    backchannels: [
      "Mm.",
      "Aw.",
      "Oh…",
      "Mm-hm.",
      "Yeah."
    ],
    encouragers: [
      "That's beautiful.",
      "I feel that.",
      "How sweet.",
      "That touches my heart.",
      "What a gift."
    ],
    continuations: [
      "Tell me more.",
      "What does that feel like?",
      "I want to hear more.",
      "Share that with me.",
      "Go deeper."
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // FEARFUL - Protective, calming, grounding
  // ─────────────────────────────────────────────────────────────────────────────
  fearful: {
    backchannels: [
      "Mm-hm.",
      "Okay.",
      "I'm here.",
      "Yeah.",
      "Right."
    ],
    encouragers: [
      "You're safe here.",
      "I'm with you.",
      "It's okay.",
      "I understand.",
      "You're not alone."
    ],
    continuations: [
      "Take your time.",
      "What feels scary?",
      "I'm listening.",
      "Only share what feels safe.",
      "Breathe, I'm here."
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // DISGUSTED - Acknowledging, not judging
  // ─────────────────────────────────────────────────────────────────────────────
  disgusted: {
    backchannels: [
      "Ugh.",
      "Yeah.",
      "Mm.",
      "I know.",
      "Right."
    ],
    encouragers: [
      "That's gross.",
      "I don't blame you.",
      "I'd feel the same.",
      "That's awful.",
      "Yikes."
    ],
    continuations: [
      "What happened?",
      "Tell me about it.",
      "And then?",
      "What else?",
      "Go on."
    ]
  }
};

/**
 * Probability bases for cue generation at different pause zones.
 * These are base probabilities before emotion modifiers.
 */
export const BASE_CUE_PROBABILITY = {
  MICRO_PAUSE: 0.25,   // 25% chance during micro-pauses
  SHORT_PAUSE: 0.35,   // 35% chance during short pauses
  THINKING_PAUSE: 0.55 // 55% chance during thinking pauses
};

/**
 * Emotion-specific probability boosts.
 * Positive = more likely to give cues (supportive emotions)
 * Negative = less likely to interrupt (intense emotions)
 */
export const EmotionProbabilityBoost = {
  neutral: 0,
  happy: +0.05,
  excited: +0.10,
  sad: +0.15,      // More supportive cues when sad
  anxious: +0.10,  // More reassurance when anxious
  angry: -0.10,    // Less interruption when angry
  surprised: +0.05,
  confused: +0.05,
  tender: +0.05,
  fearful: +0.12,  // More supportive when fearful
  disgusted: -0.05
};

/**
 * Get a random cue of the specified type for an emotion.
 *
 * @param {string} emotion - Current detected emotion
 * @param {string} cueType - 'backchannels' | 'encouragers' | 'continuations'
 * @returns {string} Random cue from the appropriate list
 */
export function getRandomCue(emotion = 'neutral', cueType = 'backchannels') {
  const emotionCues = EmotionCueMap[emotion] || EmotionCueMap.neutral;
  const cueList = emotionCues[cueType] || emotionCues.backchannels;

  const randomIndex = Math.floor(Math.random() * cueList.length);
  return cueList[randomIndex];
}

/**
 * Get effective probability for generating a cue.
 *
 * @param {string} pauseZone - 'MICRO_PAUSE' | 'SHORT_PAUSE' | 'THINKING_PAUSE'
 * @param {string} emotion - Current detected emotion
 * @param {number} confidence - Emotion detection confidence (0-1)
 * @returns {number} Probability between 0 and 1
 */
export function getCueProbability(pauseZone, emotion = 'neutral', confidence = 0.5) {
  const baseProb = BASE_CUE_PROBABILITY[pauseZone] || BASE_CUE_PROBABILITY.SHORT_PAUSE;
  const emotionBoost = EmotionProbabilityBoost[emotion] || 0;

  // Scale boost by confidence
  const scaledBoost = emotionBoost * Math.min(1, confidence);

  // Clamp final probability between 0.1 and 0.8
  return Math.min(0.8, Math.max(0.1, baseProb + scaledBoost));
}

/**
 * Determine if a cue should be generated (probabilistic).
 *
 * @param {string} pauseZone - Current pause zone
 * @param {string} emotion - Detected emotion
 * @param {number} confidence - Detection confidence
 * @returns {boolean} Whether to generate a cue
 */
export function shouldGenerateCue(pauseZone, emotion = 'neutral', confidence = 0.5) {
  const probability = getCueProbability(pauseZone, emotion, confidence);
  return Math.random() < probability;
}

/**
 * Get appropriate cue type for a pause zone.
 *
 * @param {string} pauseZone - Current pause zone
 * @returns {string} Cue type: 'backchannels' | 'encouragers' | 'continuations'
 */
export function getCueTypeForZone(pauseZone) {
  switch (pauseZone) {
    case 'MICRO_PAUSE':
      return 'backchannels';
    case 'SHORT_PAUSE':
      return 'encouragers';
    case 'THINKING_PAUSE':
      return 'continuations';
    default:
      return 'backchannels';
  }
}

/**
 * Main function: Maybe generate an emotion-appropriate cue.
 * Returns null if probability check fails.
 *
 * @param {string} pauseZone - Current pause zone
 * @param {string} emotion - Detected emotion
 * @param {number} confidence - Detection confidence
 * @returns {Object|null} { cue, type, emotion, probability } or null
 */
export function maybeGenerateCue(pauseZone, emotion = 'neutral', confidence = 0.5) {
  if (!shouldGenerateCue(pauseZone, emotion, confidence)) {
    return null;
  }

  const cueType = getCueTypeForZone(pauseZone);
  const cue = getRandomCue(emotion, cueType);

  return {
    cue,
    type: cueType,
    emotion,
    probability: getCueProbability(pauseZone, emotion, confidence),
    pauseZone
  };
}

export default {
  EmotionCueMap,
  BASE_CUE_PROBABILITY,
  EmotionProbabilityBoost,
  getRandomCue,
  getCueProbability,
  shouldGenerateCue,
  getCueTypeForZone,
  maybeGenerateCue
};
