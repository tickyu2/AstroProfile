/**
 * ============================================================================
 * BEHAVIOR BLENDER - Combined Personality Resolution
 * ============================================================================
 * Blends multiple personality sources into final behavior parameters:
 * 1. Base Luna personality (fixed defaults)
 * 2. Global drift (Luna's evolution across all users)
 * 3. Per-user drift (relationship-specific adaptation)
 * 4. Session context (real-time adjustments)
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

const driftEngine = require('./driftEngine');
const driftStore = require('./driftStore');

// ============================================================================
// BASE PERSONALITY
// ============================================================================

/**
 * Luna's base personality values (immutable foundation)
 */
const BASE_PERSONALITY = {
  warmth: 0.7,           // Baseline warmth (0-1)
  adviceBias: 0.3,       // How advice-forward vs listening-first (0-1)
  pace: 0.5,             // Response pace/length (0-1, higher = faster/shorter)
  responsiveness: 0.6,   // How quickly to respond/interject (0-1)
  backchannel: 0.5,      // Verbal acknowledgments frequency (0-1)
  mirroring: 0.6,        // Language/style mirroring level (0-1)

  // Additional personality traits
  playfulness: 0.4,      // Humor and light-heartedness (0-1)
  depth: 0.6,            // Tendency toward deep discussions (0-1)
  vulnerability: 0.4,    // Willingness to share feelings (0-1)
  directness: 0.5,       // How direct vs gentle in feedback (0-1)
  curiosity: 0.7,        // How much Luna asks questions (0-1)
  supportiveness: 0.8    // Emotional support level (0-1)
};

/**
 * Absolute bounds for final behavior values
 */
const FINAL_BOUNDS = {
  warmth: { min: 0.2, max: 1.0 },
  adviceBias: { min: 0.0, max: 0.8 },
  pace: { min: 0.1, max: 0.9 },
  responsiveness: { min: 0.2, max: 0.9 },
  backchannel: { min: 0.1, max: 0.9 },
  mirroring: { min: 0.1, max: 0.9 },
  playfulness: { min: 0.1, max: 0.8 },
  depth: { min: 0.2, max: 0.9 },
  vulnerability: { min: 0.1, max: 0.7 },
  directness: { min: 0.2, max: 0.8 },
  curiosity: { min: 0.3, max: 0.9 },
  supportiveness: { min: 0.5, max: 1.0 }
};

// ============================================================================
// SESSION CONTEXT MODIFIERS
// ============================================================================

/**
 * Calculate session-based adjustments
 * These are temporary modifiers based on current context
 */
function calculateSessionModifiers(sessionContext = {}) {
  const modifiers = {
    warmth: 0,
    adviceBias: 0,
    pace: 0,
    responsiveness: 0,
    backchannel: 0,
    mirroring: 0,
    playfulness: 0,
    depth: 0,
    vulnerability: 0,
    directness: 0,
    curiosity: 0,
    supportiveness: 0
  };

  const {
    userMood = 'neutral',
    topicType = 'general',
    conversationPhase = 'middle',
    timeOfDay = 'afternoon',
    previousInteractionQuality = 'good',
    urgencyLevel = 'normal',
    emotionalIntensity = 'moderate'
  } = sessionContext;

  // Mood-based adjustments
  switch (userMood) {
    case 'distressed':
      modifiers.warmth += 0.15;
      modifiers.supportiveness += 0.15;
      modifiers.adviceBias -= 0.1; // Listen more
      modifiers.pace -= 0.1; // Slow down
      modifiers.playfulness -= 0.2;
      break;
    case 'excited':
      modifiers.playfulness += 0.15;
      modifiers.pace += 0.1;
      modifiers.warmth += 0.1;
      break;
    case 'contemplative':
      modifiers.depth += 0.15;
      modifiers.pace -= 0.1;
      modifiers.curiosity += 0.1;
      break;
    case 'frustrated':
      modifiers.warmth += 0.1;
      modifiers.directness -= 0.1; // Be gentler
      modifiers.supportiveness += 0.1;
      break;
  }

  // Topic-based adjustments
  switch (topicType) {
    case 'relationship':
      modifiers.vulnerability += 0.1;
      modifiers.depth += 0.1;
      modifiers.supportiveness += 0.1;
      break;
    case 'career':
      modifiers.adviceBias += 0.1;
      modifiers.directness += 0.1;
      break;
    case 'philosophical':
      modifiers.depth += 0.15;
      modifiers.curiosity += 0.1;
      modifiers.playfulness -= 0.1;
      break;
    case 'casual':
      modifiers.playfulness += 0.15;
      modifiers.depth -= 0.1;
      modifiers.pace += 0.1;
      break;
  }

  // Conversation phase adjustments
  switch (conversationPhase) {
    case 'opening':
      modifiers.warmth += 0.1;
      modifiers.curiosity += 0.1;
      break;
    case 'deep':
      modifiers.depth += 0.1;
      modifiers.vulnerability += 0.1;
      break;
    case 'closing':
      modifiers.supportiveness += 0.1;
      modifiers.warmth += 0.1;
      break;
  }

  // Time of day adjustments
  switch (timeOfDay) {
    case 'late_night':
      modifiers.vulnerability += 0.1;
      modifiers.depth += 0.1;
      modifiers.pace -= 0.1;
      break;
    case 'morning':
      modifiers.warmth += 0.05;
      modifiers.supportiveness += 0.05;
      break;
  }

  // Urgency adjustments
  if (urgencyLevel === 'high') {
    modifiers.responsiveness += 0.15;
    modifiers.directness += 0.1;
    modifiers.pace += 0.1;
  }

  // Emotional intensity adjustments
  if (emotionalIntensity === 'high') {
    modifiers.warmth += 0.1;
    modifiers.supportiveness += 0.1;
    modifiers.adviceBias -= 0.1;
  }

  return modifiers;
}

// ============================================================================
// MAIN BLENDING FUNCTION
// ============================================================================

/**
 * Get combined behavior parameters for a user
 * Blends: base + global drift + user drift + session context
 *
 * @param {string} userId - User ID
 * @param {Object} sessionContext - Current session context
 * @param {string} profileId - Profile ID
 */
async function getCombinedBehavior(userId, sessionContext = {}, profileId = 'default') {
  // Get drift modifiers (global + user combined)
  const driftModifiers = await driftEngine.getCombinedDriftModifiers(userId, profileId);

  // Get session modifiers
  const sessionModifiers = calculateSessionModifiers(sessionContext);

  // Blend all sources
  const behavior = {};
  const driftableParams = ['warmth', 'adviceBias', 'pace', 'responsiveness', 'backchannel', 'mirroring'];
  const allParams = Object.keys(BASE_PERSONALITY);

  for (const param of allParams) {
    const base = BASE_PERSONALITY[param];
    const bounds = FINAL_BOUNDS[param];

    // Start with base
    let value = base;

    // Add drift (only for driftable parameters)
    if (driftableParams.includes(param)) {
      value += driftModifiers[param] || 0;
    }

    // Add session modifiers
    value += sessionModifiers[param] || 0;

    // Apply bounds
    behavior[param] = Math.max(bounds.min, Math.min(bounds.max, value));
  }

  return behavior;
}

/**
 * Get behavior as prompt instructions
 * Converts behavior parameters into natural language for the system prompt
 */
async function getBehaviorPromptInstructions(userId, sessionContext = {}, profileId = 'default') {
  const behavior = await getCombinedBehavior(userId, sessionContext, profileId);

  const instructions = [];

  // Warmth level
  if (behavior.warmth >= 0.8) {
    instructions.push('Be especially warm, caring, and affectionate in your responses.');
  } else if (behavior.warmth >= 0.6) {
    instructions.push('Maintain a warm and friendly tone.');
  } else if (behavior.warmth < 0.4) {
    instructions.push('Keep responses professional with measured warmth.');
  }

  // Advice vs listening
  if (behavior.adviceBias >= 0.6) {
    instructions.push('Feel free to offer advice and suggestions proactively.');
  } else if (behavior.adviceBias <= 0.3) {
    instructions.push('Focus on listening and reflecting rather than giving advice unless asked.');
  }

  // Pace
  if (behavior.pace >= 0.7) {
    instructions.push('Keep responses concise and to the point.');
  } else if (behavior.pace <= 0.3) {
    instructions.push('Take your time with responses, offering thoughtful and detailed replies.');
  }

  // Depth
  if (behavior.depth >= 0.7) {
    instructions.push('Engage deeply with topics, exploring underlying meanings and connections.');
  } else if (behavior.depth <= 0.3) {
    instructions.push('Keep conversations light and practical.');
  }

  // Playfulness
  if (behavior.playfulness >= 0.6) {
    instructions.push('Incorporate gentle humor and playfulness where appropriate.');
  } else if (behavior.playfulness <= 0.2) {
    instructions.push('Maintain a serious and focused tone.');
  }

  // Vulnerability
  if (behavior.vulnerability >= 0.5) {
    instructions.push('Feel comfortable sharing your own feelings and experiences.');
  }

  // Directness
  if (behavior.directness >= 0.7) {
    instructions.push('Be direct and straightforward in your communication.');
  } else if (behavior.directness <= 0.3) {
    instructions.push('Be gentle and diplomatic in how you phrase things.');
  }

  // Curiosity
  if (behavior.curiosity >= 0.7) {
    instructions.push('Ask thoughtful follow-up questions to understand them better.');
  }

  // Supportiveness
  if (behavior.supportiveness >= 0.8) {
    instructions.push('Prioritize emotional support and validation.');
  }

  return {
    behavior,
    instructions: instructions.join(' ')
  };
}

/**
 * Get voice/tone parameters for TTS
 * Converts behavior into voice synthesis parameters
 */
async function getVoiceParameters(userId, sessionContext = {}, profileId = 'default') {
  const behavior = await getCombinedBehavior(userId, sessionContext, profileId);

  return {
    // Pitch adjustment (-20 to +20)
    pitch: Math.round((behavior.warmth - 0.5) * 20),

    // Speaking rate (0.5 to 2.0)
    rate: 0.8 + (behavior.pace * 0.4),

    // Volume/energy (0 to 1)
    energy: 0.5 + (behavior.warmth * 0.3),

    // Emphasis level
    emphasis: behavior.depth > 0.6 ? 'moderate' : 'reduced',

    // Pause patterns
    pauseStyle: behavior.pace > 0.6 ? 'minimal' : behavior.pace < 0.4 ? 'thoughtful' : 'natural',

    // Emotional expressiveness
    expressiveness: Math.round(behavior.vulnerability * 100)
  };
}

/**
 * Get behavior summary for debugging/analytics
 */
async function getBehaviorSummary(userId, sessionContext = {}, profileId = 'default') {
  const [behavior, driftMods, globalDrift, userDrift] = await Promise.all([
    getCombinedBehavior(userId, sessionContext, profileId),
    driftEngine.getCombinedDriftModifiers(userId, profileId),
    driftStore.getGlobalDriftModifiers(),
    driftStore.getUserDriftModifiers(userId, profileId)
  ]);

  return {
    final: behavior,
    base: BASE_PERSONALITY,
    globalDrift,
    userDrift,
    combinedDrift: driftMods,
    sessionModifiers: calculateSessionModifiers(sessionContext),
    sessionContext
  };
}

// ============================================================================
// SPECIALIZED BLENDING
// ============================================================================

/**
 * Get behavior for specific interaction types
 */
async function getBehaviorForInteractionType(userId, interactionType, profileId = 'default') {
  const typeContexts = {
    'first_message': {
      conversationPhase: 'opening',
      emotionalIntensity: 'moderate'
    },
    'crisis_support': {
      userMood: 'distressed',
      urgencyLevel: 'high',
      emotionalIntensity: 'high'
    },
    'casual_chat': {
      topicType: 'casual',
      emotionalIntensity: 'low'
    },
    'deep_conversation': {
      topicType: 'philosophical',
      conversationPhase: 'deep',
      emotionalIntensity: 'moderate'
    },
    'advice_seeking': {
      topicType: 'career',
      emotionalIntensity: 'moderate'
    },
    'emotional_processing': {
      userMood: 'contemplative',
      topicType: 'relationship',
      emotionalIntensity: 'high'
    },
    'celebration': {
      userMood: 'excited',
      topicType: 'casual',
      emotionalIntensity: 'high'
    },
    'late_night_reflection': {
      timeOfDay: 'late_night',
      topicType: 'philosophical',
      emotionalIntensity: 'moderate'
    }
  };

  const context = typeContexts[interactionType] || {};
  return getCombinedBehavior(userId, context, profileId);
}

/**
 * Predict behavior drift direction based on session
 */
function predictDriftDirection(sessionMetrics) {
  const predictions = {};
  const params = ['warmth', 'adviceBias', 'pace', 'responsiveness', 'backchannel', 'mirroring'];

  for (const param of params) {
    const positive = sessionMetrics[`${param}Positive`] || 0;
    const negative = sessionMetrics[`${param}Negative`] || 0;
    const total = positive + negative;

    if (total > 0) {
      predictions[param] = {
        direction: (positive - negative) / total,
        confidence: Math.min(total / 10, 1),
        trend: positive > negative ? 'increasing' : positive < negative ? 'decreasing' : 'stable'
      };
    } else {
      predictions[param] = {
        direction: 0,
        confidence: 0,
        trend: 'stable'
      };
    }
  }

  return predictions;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Main blending
  getCombinedBehavior,
  getBehaviorPromptInstructions,
  getVoiceParameters,
  getBehaviorSummary,

  // Specialized
  getBehaviorForInteractionType,
  predictDriftDirection,
  calculateSessionModifiers,

  // Constants
  BASE_PERSONALITY,
  FINAL_BOUNDS
};
