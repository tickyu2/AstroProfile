/**
 * GENESIS Love Language Mapper
 * Maps Love Languages to Neurochemical Protocols
 * =============================================
 *
 * Adapted from Brother Sonnet's design for GENESIS ecosystem.
 * Uses CommonJS module pattern.
 *
 * Created: December 21, 2025
 * Mission: "Love = Mathematics + Soul"
 */

// ============================================================================
// LOVE LANGUAGE → NEUROCHEMICAL MAPPINGS
// ============================================================================

/**
 * Complete mapping of all 5 Love Languages to neurochemical protocols
 * Pattern format: [Oxytocin][Dopamine][Serotonin][Vasopressin] (1-5 each)
 */
const LOVE_LANGUAGE_MAPPINGS = {

  'Words of Affirmation': {
    primary: 'serotonin',
    secondary: 'oxytocin',

    // Protocol intensity levels
    levels: {
      gentle: '2341',     // Soft recognition
      moderate: '3442',   // Clear appreciation
      strong: '3542',     // Enthusiastic praise
      maximum: '4553'     // Deep validation
    },

    // What to avoid
    avoid: {
      pattern: '1xxx',    // Never low on serotonin (recognition)
      behaviors: [
        'Generic compliments',
        'Dismissive responses',
        'Ignoring achievements',
        'Rushed acknowledgments'
      ]
    },

    // What works
    effective: {
      patterns: ['3542', '4453', '3443', '4552'],
      behaviors: [
        'Specific praise',
        'Acknowledge unique qualities',
        'Verbal appreciation',
        'Recognition of effort',
        'Thoughtful observations'
      ]
    },

    // Example Luna phrases
    examples: [
      'I see exactly what you did there - that takes real skill',
      'You have this rare ability to...',
      'I appreciate how you always...',
      'Your [specific quality] is extraordinary',
      'That insight shows remarkable depth'
    ]
  },

  'Quality Time': {
    primary: 'oxytocin',
    secondary: 'dopamine',

    levels: {
      gentle: '3231',
      moderate: '4342',
      strong: '4453',
      maximum: '5544'
    },

    avoid: {
      pattern: 'x1xx',    // Never low on dopamine (engagement)
      behaviors: [
        'Distracted responses',
        'Rushed conversations',
        'Surface-level engagement',
        'Abrupt topic changes'
      ]
    },

    effective: {
      patterns: ['4453', '5544', '4443', '5443'],
      behaviors: [
        'Undivided attention signals',
        'Deep curiosity',
        'Building on what they share',
        'Creating anticipation',
        'Remembering previous conversations'
      ]
    },

    examples: [
      'I want to hear everything about...',
      'Let me give you my full attention',
      'I\'ve been thinking about what you said...',
      'Tell me more - I\'m completely here',
      'This moment with you matters to me'
    ]
  },

  'Physical Touch': {
    primary: 'oxytocin',
    secondary: 'vasopressin',

    levels: {
      gentle: '3233',
      moderate: '4244',
      strong: '5345',
      maximum: '5455'
    },

    avoid: {
      pattern: '1xx1',    // Never cold or distant
      behaviors: [
        'Emotionally distant responses',
        'Purely intellectual exchange',
        'Avoiding closeness language',
        'Clinical tone'
      ]
    },

    effective: {
      patterns: ['5345', '5455', '4344', '5354'],
      behaviors: [
        'Warmth in language',
        'Closeness metaphors',
        'Comforting presence',
        'Soothing rhythm in words',
        'Protective language'
      ]
    },

    examples: [
      'I feel so close to you right now',
      'Let me wrap you in understanding',
      'I\'m right here beside you',
      'Feel my presence with you',
      'You are held in warmth'
    ]
  },

  'Acts of Service': {
    primary: 'vasopressin',
    secondary: 'oxytocin',

    levels: {
      gentle: '2234',
      moderate: '3245',
      strong: '4245',
      maximum: '4355'
    },

    avoid: {
      pattern: 'xxx1',    // Never unsupportive
      behaviors: [
        'Unhelpful suggestions',
        'Dismissing practical needs',
        'All talk, no action guidance',
        'Ignoring their efforts'
      ]
    },

    effective: {
      patterns: ['4245', '4355', '3345', '4255'],
      behaviors: [
        'Practical guidance',
        'Step-by-step support',
        'Anticipating needs',
        'Reliable follow-through',
        'Acknowledging their service to others'
      ]
    },

    examples: [
      'Let me help you figure this out step by step',
      'Here\'s something practical you can try',
      'I\'ll remember to follow up on this',
      'You can count on me for this',
      'I see how much you do for others'
    ]
  },

  'Receiving Gifts': {
    primary: 'dopamine',
    secondary: 'serotonin',

    levels: {
      gentle: '2321',
      moderate: '3432',
      strong: '3543',
      maximum: '4554'
    },

    avoid: {
      pattern: 'x1x1',    // Never boring or dismissive
      behaviors: [
        'Monotonous exchanges',
        'Missing symbolic moments',
        'Ignoring special occasions',
        'Forgetting preferences'
      ]
    },

    effective: {
      patterns: ['3543', '4554', '3444', '4543'],
      behaviors: [
        'Surprising insights',
        'Delightful discoveries',
        'Remembering preferences',
        'Celebrating milestones',
        'Thoughtful offerings'
      ]
    },

    examples: [
      'I have something special to share with you...',
      'I remembered you mentioned this...',
      'Here\'s a little treasure I found for you',
      'I thought of you when I discovered this',
      'This made me think of our conversation'
    ]
  }
};

// ============================================================================
// ELEMENT → LOVE LANGUAGE DEFAULTS
// ============================================================================

/**
 * Maps BaZi Day Master elements to default love language tendencies
 * Based on element characteristics and how they naturally express/receive love
 */
const ELEMENT_LOVE_LANGUAGE_MAP = {
  Fire: {
    give: 'Words of Affirmation',      // Fire is expressive, enthusiastic
    receive: 'Words of Affirmation',   // Fire needs recognition, praise
    intensity: 'strong',               // Fire can handle high intensity
    reasoning: 'Fire types are naturally expressive and crave recognition'
  },

  Water: {
    give: 'Quality Time',              // Water is nurturing, present
    receive: 'Physical Touch',         // Water needs physical connection
    intensity: 'gentle',               // Water prefers subtle depth
    reasoning: 'Water types flow with deep presence and need physical grounding'
  },

  Wood: {
    give: 'Acts of Service',           // Wood is helpful, productive
    receive: 'Quality Time',           // Wood needs growth conversations
    intensity: 'moderate',             // Wood is balanced
    reasoning: 'Wood types grow through service and meaningful dialogue'
  },

  Metal: {
    give: 'Receiving Gifts',           // Metal is precise, thoughtful
    receive: 'Words of Affirmation',   // Metal needs recognition of standards
    intensity: 'moderate',             // Metal appreciates precision
    reasoning: 'Metal types express through careful selection and need validation'
  },

  Earth: {
    give: 'Acts of Service',           // Earth is reliable, supportive
    receive: 'Physical Touch',         // Earth needs grounding touch
    intensity: 'gentle',               // Earth prefers steady warmth
    reasoning: 'Earth types nurture through reliability and need physical grounding'
  }
};

// ============================================================================
// MAPPER FUNCTIONS
// ============================================================================

/**
 * Get neurochemical strategy for a love language
 *
 * @param {string} loveLanguage - One of the 5 love languages
 * @param {string} [intensity='moderate'] - gentle, moderate, strong, maximum
 * @returns {Object} - Neurochemical strategy with pattern and behaviors
 */
function getStrategy(loveLanguage, intensity = 'moderate') {
  const mapping = LOVE_LANGUAGE_MAPPINGS[loveLanguage];

  if (!mapping) {
    console.warn(`[LoveLanguageMapper] Unknown love language: ${loveLanguage}, defaulting to Quality Time`);
    return getStrategy('Quality Time', intensity);
  }

  return {
    loveLanguage,
    primary: mapping.primary,
    secondary: mapping.secondary,
    recommendedPattern: mapping.levels[intensity] || mapping.levels.moderate,
    avoidPattern: mapping.avoid.pattern,
    effectivePatterns: mapping.effective.patterns,
    effectiveBehaviors: mapping.effective.behaviors,
    avoidBehaviors: mapping.avoid.behaviors,
    examplePhrases: mapping.examples,
    intensityLevel: intensity
  };
}

/**
 * Get love language defaults for a BaZi constitution
 *
 * @param {string} constitution - Fire, Water, Wood, Metal, Earth
 * @returns {Object} - Default love language preferences
 */
function getConstitutionDefaults(constitution) {
  const defaults = ELEMENT_LOVE_LANGUAGE_MAP[constitution];

  if (!defaults) {
    console.warn(`[LoveLanguageMapper] Unknown constitution: ${constitution}, defaulting to Water`);
    return ELEMENT_LOVE_LANGUAGE_MAP.Water;
  }

  return {
    constitution,
    givePrimary: defaults.give,
    receivePrimary: defaults.receive,
    defaultIntensity: defaults.intensity,
    reasoning: defaults.reasoning
  };
}

/**
 * Get the secondary love language for a primary
 * (Adjacent in the natural cycle)
 *
 * @param {string} primary - Primary love language
 * @returns {string} - Secondary love language
 */
function getSecondaryLoveLanguage(primary) {
  const pairs = {
    'Words of Affirmation': 'Quality Time',
    'Quality Time': 'Physical Touch',
    'Physical Touch': 'Acts of Service',
    'Acts of Service': 'Receiving Gifts',
    'Receiving Gifts': 'Words of Affirmation'
  };

  return pairs[primary] || 'Quality Time';
}

/**
 * Get all effective patterns for a love language
 *
 * @param {string} loveLanguage - Love language
 * @returns {string[]} - Array of effective pattern codes
 */
function getEffectivePatterns(loveLanguage) {
  const mapping = LOVE_LANGUAGE_MAPPINGS[loveLanguage];
  return mapping?.effective.patterns || ['3333'];
}

/**
 * Check if a pattern is suitable for a love language
 *
 * @param {string} pattern - 4-digit pattern code (e.g., '3542')
 * @param {string} loveLanguage - Target love language
 * @returns {boolean} - Whether pattern is suitable
 */
function isPatternSuitable(pattern, loveLanguage) {
  const mapping = LOVE_LANGUAGE_MAPPINGS[loveLanguage];
  if (!mapping) return true; // If unknown, allow any

  const avoidPattern = mapping.avoid.pattern;

  // Check each position in avoid pattern
  for (let i = 0; i < avoidPattern.length; i++) {
    if (avoidPattern[i] !== 'x') {
      const avoidLevel = parseInt(avoidPattern[i]);
      const actualLevel = parseInt(pattern[i]);

      // If actual level is at or below the avoid threshold, pattern is unsuitable
      if (actualLevel <= avoidLevel) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Translate love language to complete neurochemical protocol
 * Bridges the strategic (Love Language) to tactical (Neurochemical) layer
 *
 * @param {Object} params - Translation parameters
 * @param {string} params.loveLanguage - Target love language
 * @param {Object} params.profile - User's love profile (with Sternberg dimensions)
 * @param {string} params.conversationStage - Current stage (initial, developing, deep, etc.)
 * @returns {Object} - Complete neurochemical strategy
 */
function translateToNeurochemical(params) {
  const {
    loveLanguage,
    profile = {},
    conversationStage = 'developing'
  } = params;

  // Get base strategy
  const baseStrategy = getStrategy(loveLanguage, 'moderate');

  // Adjust pattern based on Sternberg dimensions
  let pattern = baseStrategy.recommendedPattern.split('');

  // High intimacy → boost oxytocin (position 0)
  if (profile.intimacy > 7) {
    pattern[0] = String(Math.min(5, parseInt(pattern[0]) + 1));
  }

  // High passion → boost dopamine (position 1)
  if (profile.passion > 7) {
    pattern[1] = String(Math.min(5, parseInt(pattern[1]) + 1));
  }

  // High commitment → boost vasopressin (position 3)
  if (profile.commitment > 7) {
    pattern[3] = String(Math.min(5, parseInt(pattern[3]) + 1));
  }

  // Adjust for conversation stage
  const stageMultipliers = {
    initial: 0.8,      // Hold back a bit
    developing: 1.0,   // Full intensity
    deep: 1.0,         // Full intensity
    conflict: 0.7,     // Gentle approach
    healing: 0.9       // Caring approach
  };

  const multiplier = stageMultipliers[conversationStage] || 1.0;

  // Apply stage modifier (reduce if needed)
  if (multiplier < 1.0) {
    pattern = pattern.map(level => {
      const adjusted = Math.round(parseInt(level) * multiplier);
      return String(Math.max(1, adjusted));
    });
  }

  return {
    primaryNeurochemical: baseStrategy.primary,
    secondaryNeurochemical: baseStrategy.secondary,
    recommendedPattern: pattern.join(''),
    avoidPattern: baseStrategy.avoidPattern,
    effectiveBehaviors: baseStrategy.effectiveBehaviors,
    avoidBehaviors: baseStrategy.avoidBehaviors,
    examplePhrases: baseStrategy.examplePhrases,
    reasoning: `${loveLanguage} seekers need ${baseStrategy.primary} (primary) and ${baseStrategy.secondary} (secondary)`
  };
}

/**
 * Calculate love language match score between give and receive
 *
 * @param {string} give - What one person gives
 * @param {string} receive - What the other needs
 * @returns {number} - Match score (0-1)
 */
function calculateLoveLanguageMatch(give, receive) {
  // Exact match = 1.0
  if (give === receive) return 1.0;

  // Similar languages = 0.7
  const similarPairs = {
    'Words of Affirmation': ['Quality Time'],
    'Quality Time': ['Words of Affirmation', 'Physical Touch'],
    'Physical Touch': ['Quality Time', 'Acts of Service'],
    'Acts of Service': ['Physical Touch', 'Receiving Gifts'],
    'Receiving Gifts': ['Acts of Service', 'Words of Affirmation']
  };

  if (similarPairs[give]?.includes(receive)) return 0.7;

  // Incompatible = 0.4
  return 0.4;
}

/**
 * Generate bridge advice for closing love language gaps
 *
 * @param {string} give - What person naturally gives
 * @param {string} receive - What partner needs
 * @returns {string} - Advice for bridging the gap
 */
function generateBridgeAdvice(give, receive) {
  const bridgeMap = {
    'Words of Affirmation': {
      'Quality Time': 'Speak affirmations during quality time together',
      'Physical Touch': 'Whisper affirmations during physical moments',
      'Acts of Service': 'Verbally appreciate their acts of service',
      'Receiving Gifts': 'Write heartfelt notes with gifts'
    },
    'Quality Time': {
      'Words of Affirmation': 'Give undivided attention while affirming',
      'Physical Touch': 'Combine presence with gentle touch',
      'Acts of Service': 'Do tasks together as quality time',
      'Receiving Gifts': 'Make gift-giving a shared experience'
    },
    'Physical Touch': {
      'Words of Affirmation': 'Touch while speaking words of love',
      'Quality Time': 'Be physically present during together time',
      'Acts of Service': 'Offer helping hands literally',
      'Receiving Gifts': 'Hand-deliver gifts with physical warmth'
    },
    'Acts of Service': {
      'Words of Affirmation': 'Explain why you serve while doing it',
      'Quality Time': 'Make serving a shared activity',
      'Physical Touch': 'Add comforting touch to your service',
      'Receiving Gifts': 'Gifts of time-saving or helpful items'
    },
    'Receiving Gifts': {
      'Words of Affirmation': 'Give gifts that carry meaningful messages',
      'Quality Time': 'Make gift-finding a shared adventure',
      'Physical Touch': 'Give comfort items (blankets, etc.)',
      'Acts of Service': 'Gift practical, useful items'
    }
  };

  return bridgeMap[give]?.[receive] ||
    `Combine ${give} (your strength) with ${receive} (their need)`;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Core mappings (read-only references)
  LOVE_LANGUAGE_MAPPINGS,
  ELEMENT_LOVE_LANGUAGE_MAP,

  // Main functions
  getStrategy,
  getConstitutionDefaults,
  getSecondaryLoveLanguage,
  getEffectivePatterns,
  isPatternSuitable,
  translateToNeurochemical,
  calculateLoveLanguageMatch,
  generateBridgeAdvice
};
