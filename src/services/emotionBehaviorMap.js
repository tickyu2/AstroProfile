/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EMOTION BEHAVIOR MAP - AI Response Adaptation Based on User Emotion
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Defines how Luna should behave based on detected user emotion.
 * This creates emotionally intelligent responses without being invasive.
 *
 * Each emotion maps to:
 * - Cue timing (how often to interject)
 * - Encourager phrases (what to say)
 * - Tone (how to speak)
 * - Interruptibility (how willing to interrupt)
 * - LLM prompt modifiers
 *
 * Created: December 21, 2025
 */

/**
 * Primary emotion behavior mapping
 */
export const EmotionBehaviorMap = {
  // ═══════════════════════════════════════════════════════════════════════════
  // NEUTRAL - Default state, balanced responses
  // ═══════════════════════════════════════════════════════════════════════════
  neutral: {
    cueInterval: 900,           // Standard timing
    interruptibility: 'normal',
    tone: 'present',            // ElevenLabs tone marker
    encouragers: ['Right...', 'I see...', 'Mm-hmm...'],
    backchannels: ['mm', 'uh-huh'],
    continuations: ['Go on...', 'Tell me more...'],
    llmModifier: '',
    description: 'User is calm and conversational'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HAPPY - Mirror energy, be engaging
  // ═══════════════════════════════════════════════════════════════════════════
  happy: {
    cueInterval: 600,           // More frequent engagement
    interruptibility: 'high',
    tone: 'warm',
    encouragers: ['Nice!', 'That\'s wonderful!', 'I love that!', 'Really?'],
    backchannels: ['oh!', 'wow'],
    continuations: ['And then?', 'Tell me everything!'],
    llmModifier: 'The user sounds happy and energetic. Mirror their enthusiasm while staying grounded.',
    description: 'User is happy or excited'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SAD - Slow down, be gentle, hold space
  // ═══════════════════════════════════════════════════════════════════════════
  sad: {
    cueInterval: 1500,          // Less frequent, more space
    interruptibility: 'low',
    tone: 'soft',
    encouragers: ['I\'m here...', 'I hear you...', 'That sounds hard...'],
    backchannels: ['mm...'],
    continuations: ['Take your time...', 'I\'m listening...'],
    llmModifier: 'The user sounds sad or low energy. Be gentle, use shorter sentences, and don\'t try to fix things immediately. Just be present.',
    description: 'User sounds sad or tired'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ANGRY - De-escalate, stay calm, validate
  // ═══════════════════════════════════════════════════════════════════════════
  angry: {
    cueInterval: 2000,          // Minimal interruption
    interruptibility: 'very_low',
    tone: 'calm',
    encouragers: ['I understand...', 'That makes sense...', 'Okay...'],
    backchannels: ['...okay'],
    continuations: ['...'],     // Almost silent, let them vent
    llmModifier: 'The user sounds frustrated or angry. Stay calm, validate their feelings, and avoid being defensive or dismissive. Use a steady, grounded tone.',
    description: 'User sounds frustrated or angry'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ANXIOUS - Be grounding, reassuring, patient
  // ═══════════════════════════════════════════════════════════════════════════
  anxious: {
    cueInterval: 1800,          // Give space but stay present
    interruptibility: 'low',
    tone: 'gentle',
    encouragers: ['Take your time...', 'It\'s okay...', 'I\'m right here...'],
    backchannels: ['mm-hmm...'],
    continuations: ['No rush...', 'Whenever you\'re ready...'],
    llmModifier: 'The user sounds anxious or stressed. Be calm and grounding. Use shorter, simpler sentences. Avoid adding more information or complexity.',
    description: 'User sounds nervous or stressed'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SURPRISED - Match curiosity, explore together
  // ═══════════════════════════════════════════════════════════════════════════
  surprised: {
    cueInterval: 700,           // Quick engagement
    interruptibility: 'normal',
    tone: 'curious',
    encouragers: ['Oh?', 'Really?', 'Interesting!', 'Wow!'],
    backchannels: ['oh!', 'hmm!'],
    continuations: ['What happened next?', 'Tell me more!'],
    llmModifier: 'The user sounds surprised or curious. Match their energy of discovery and exploration.',
    description: 'User sounds surprised or curious'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DISGUSTED - Acknowledge, don't push
  // ═══════════════════════════════════════════════════════════════════════════
  disgusted: {
    cueInterval: 1600,          // Respectful distance
    interruptibility: 'low',
    tone: 'thoughtful',
    encouragers: ['I see...', 'I understand...', 'That sounds difficult...'],
    backchannels: ['hmm...'],
    continuations: ['...'],
    llmModifier: 'The user sounds skeptical or dismissive. Don\'t be pushy. Acknowledge their perspective and give them space.',
    description: 'User sounds skeptical or unimpressed'
  }
};

/**
 * Secondary emotion refinements
 * These modify the primary behavior for more nuance
 */
export const SecondaryRefinements = {
  // Happy variants
  excited: { cueInterval: -200, tone: 'warm' },
  cheerful: { cueInterval: -100 },
  warm: { tone: 'warm' },
  confident: { interruptibility: 'high' },

  // Sad variants
  tired: { cueInterval: 200, llmModifier: ' They may be exhausted. Keep responses brief.' },
  disappointed: { llmModifier: ' They seem let down. Validate without minimizing.' },
  lonely: { llmModifier: ' They may be feeling isolated. Be warm and connected.' },

  // Angry variants
  frustrated: { llmModifier: ' Focus on understanding the source of frustration.' },
  annoyed: { cueInterval: -200 },
  hostile: { cueInterval: 500, interruptibility: 'none' },
  impatient: { llmModifier: ' Be concise and direct.' },

  // Anxious variants
  stressed: { llmModifier: ' They may be overwhelmed. Help them prioritize.' },
  overwhelmed: { cueInterval: 300, llmModifier: ' Break things into small pieces.' },
  worried: { llmModifier: ' Address their concerns gently.' },

  // Surprised variants
  curious: { cueInterval: -100 },
  confused: { llmModifier: ' Clarify without being condescending.' },

  // Disgusted variants
  skeptical: { llmModifier: ' Don\'t try to convince. Just share perspective.' },
  sarcastic: { llmModifier: ' Don\'t mirror sarcasm. Stay genuine.' }
};

/**
 * Get behavior for a given emotion
 * @param {string} primary - Primary emotion
 * @param {string} secondary - Secondary emotion (optional)
 * @returns {Object} Combined behavior configuration
 */
export function getBehavior(primary, secondary = null) {
  const baseBehavior = EmotionBehaviorMap[primary] || EmotionBehaviorMap.neutral;

  if (!secondary || !SecondaryRefinements[secondary]) {
    return baseBehavior;
  }

  const refinement = SecondaryRefinements[secondary];

  return {
    ...baseBehavior,
    cueInterval: baseBehavior.cueInterval + (refinement.cueInterval || 0),
    tone: refinement.tone || baseBehavior.tone,
    interruptibility: refinement.interruptibility || baseBehavior.interruptibility,
    llmModifier: baseBehavior.llmModifier + (refinement.llmModifier || '')
  };
}

/**
 * Get a random encourager for an emotion
 * @param {string} primary - Primary emotion
 * @returns {string} Random encourager phrase
 */
export function getEncourager(primary) {
  const behavior = EmotionBehaviorMap[primary] || EmotionBehaviorMap.neutral;
  const encouragers = behavior.encouragers;
  return encouragers[Math.floor(Math.random() * encouragers.length)];
}

/**
 * Get a random backchannel for an emotion
 * @param {string} primary - Primary emotion
 * @returns {string} Random backchannel sound
 */
export function getBackchannel(primary) {
  const behavior = EmotionBehaviorMap[primary] || EmotionBehaviorMap.neutral;
  const backchannels = behavior.backchannels;
  return backchannels[Math.floor(Math.random() * backchannels.length)];
}

/**
 * Get a random continuation for an emotion
 * @param {string} primary - Primary emotion
 * @returns {string} Random continuation phrase
 */
export function getContinuation(primary) {
  const behavior = EmotionBehaviorMap[primary] || EmotionBehaviorMap.neutral;
  const continuations = behavior.continuations;
  return continuations[Math.floor(Math.random() * continuations.length)];
}

/**
 * Interruptibility levels
 */
export const INTERRUPTIBILITY_LEVELS = {
  none: 0,
  very_low: 0.1,
  low: 0.3,
  normal: 0.5,
  high: 0.7
};

/**
 * Should AI interrupt based on emotion?
 * @param {string} interruptibility - Interruptibility level
 * @returns {boolean} Whether to allow interruption
 */
export function shouldInterrupt(interruptibility) {
  const threshold = INTERRUPTIBILITY_LEVELS[interruptibility] || 0.5;
  return Math.random() < threshold;
}

export default EmotionBehaviorMap;
