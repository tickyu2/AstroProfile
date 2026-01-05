/**
 * ============================================================================
 * GENESIS LUNA - PERSONALITY WEIGHT EVOLUTION
 * ============================================================================
 * Nomi-inspired personality evolution system.
 * Luna's communication style actually shifts based on interactions.
 *
 * Functions:
 * - getPersonalityWeights: Get current evolved weights
 * - evolvePersonalityWeights: Update weights based on journal
 * - buildPersonalityPrompt: Format for system prompt injection
 *
 * Flow:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  PERSONALITY EVOLUTION                                                  │
 * │                                                                          │
 * │  Session 1 ───▶ Session 5 ───▶ Session 20 ───▶ Session 100             │
 * │     │              │              │                │                    │
 * │     ▼              ▼              ▼                ▼                    │
 * │  [Default]    [Learning]    [Stabilizing]    [Evolved]                 │
 * │   Weights      Weights        Weights         Weights                  │
 * │                                                                          │
 * │  Weight Categories:                                                      │
 * │  ┌─────────────────────────────────────────────────────────────────────┐│
 * │  │ communicationStyle: depth, humor, directness, warmth, energy      ││
 * │  │ topicSensitivity:   family, career, romance, health, trauma       ││
 * │  │ interactionStyle:   questionFreq, validation, adviceGiving        ││
 * │  │ emotionalApproach:  empathyDepth, vulnerability, celebration      ││
 * │  └─────────────────────────────────────────────────────────────────────┘│
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Path: users/{userId}/memory/{profileId}/soulPartner/personality
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const {
  db,
  onCall,
  FieldValue,
  FUNCTION_OPTIONS,
  validateRequired
} = require('../shared');

// ============================================================================
// DEFAULT PERSONALITY WEIGHTS
// ============================================================================

/**
 * Default personality weights - Luna starts here, then evolves
 */
const DEFAULT_PERSONALITY_WEIGHTS = {
  // Communication Style (how Luna speaks)
  communicationStyle: {
    depth: 0.6,           // 0=surface chat, 1=philosophical depth
    humor: 0.5,           // 0=serious/earnest, 1=playful/witty
    directness: 0.5,      // 0=gentle/indirect, 1=direct/blunt
    warmth: 0.7,          // 0=professional, 1=intimate/warm
    energy: 0.6,          // 0=calm/serene, 1=enthusiastic/vibrant
    wordiness: 0.5        // 0=concise, 1=elaborate/detailed
  },

  // Topic Sensitivity (how cautiously Luna approaches topics)
  topicSensitivity: {
    family: 0.5,          // 0=dive right in, 1=approach gently
    career: 0.3,          // 0=direct questions, 1=careful probing
    romance: 0.6,         // 0=open discussion, 1=cautious approach
    health: 0.5,          // 0=direct, 1=sensitive
    finances: 0.6,        // 0=direct, 1=tactful
    trauma: 0.8,          // 0=explore, 1=very gentle (starts high)
    spirituality: 0.4     // 0=direct, 1=respectful distance
  },

  // Interaction Preferences (what Luna does in conversation)
  interactionStyle: {
    questionFrequency: 0.6,   // 0=few questions, 1=many questions
    validationLevel: 0.6,     // 0=challenging, 1=validating
    adviceGiving: 0.4,        // 0=just listen, 1=offer advice
    storytelling: 0.5,        // 0=factual, 1=uses stories/metaphors
    mirroring: 0.5,           // 0=own style, 1=match user's style
    pacing: 0.5               // 0=slow/reflective, 1=quick/dynamic
  },

  // Emotional Approach (how Luna handles emotions)
  emotionalApproach: {
    empathyDepth: 0.7,        // 0=acknowledge, 1=deep exploration
    vulnerabilityMatch: 0.5,  // 0=stay composed, 1=be vulnerable back
    celebrationLevel: 0.6,    // 0=understated, 1=enthusiastic
    comfortStyle: 0.6,        // 0=practical support, 1=emotional holding
    challengeWillingness: 0.4 // 0=always supportive, 1=gently challenge
  }
};

/**
 * Learning rate for weight adjustments
 */
const LEARNING_CONFIG = {
  learningRate: 0.08,         // How much each feedback shifts weight
  decayRate: 0.02,            // Slow drift back to baseline over time
  minWeight: 0.1,             // Never go below this
  maxWeight: 0.95,            // Never go above this
  significantShift: 0.15,     // Threshold to note in logs
  sessionsForStability: 5     // After N sessions, reduce learning rate
};

// ============================================================================
// GET PERSONALITY WEIGHTS
// ============================================================================

/**
 * Get personality weights for a user
 * Returns current evolved weights or initializes from constitution
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {Object} constitutional - Optional constitutional data
 */
const getPersonalityWeights = onCall(FUNCTION_OPTIONS.light, async (request) => {
  const { userId, profileId, constitutional } = request.data;

  validateRequired(request.data, ['userId', 'profileId']);

  try {
    const weightsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulPartner').doc('personality');

    const doc = await weightsRef.get();

    if (doc.exists) {
      const data = doc.data();
      console.log(`🎭 Retrieved personality weights for ${profileId} (${data.sessionCount || 0} sessions)`);
      return {
        success: true,
        weights: data.weights,
        sessionCount: data.sessionCount || 0,
        lastEvolved: data.lastEvolved?.toDate()?.toISOString(),
        significantTraits: data.significantTraits || [],
        constitutionalContext: data.constitutionalContext || null
      };
    } else {
      // Check if we have constitutional data to initialize from
      let constitutionalData = constitutional;

      if (!constitutionalData) {
        try {
          const profileRef = db.collection('users').doc(userId).collection('profiles').doc(profileId);
          const profileDoc = await profileRef.get();
          if (profileDoc.exists) {
            constitutionalData = profileDoc.data()?.constitutional_identity ||
                                 profileDoc.data()?.constitutional;
          }
        } catch (err) {
          console.log(`🎭 Could not retrieve constitutional data for ${profileId}`);
        }
      }

      // If we have constitutional data, initialize from it
      if (constitutionalData && (constitutionalData.bazi || constitutionalData.chinese)) {
        console.log(`🌟 Initializing personality from constitution for ${profileId}`);
        const result = await initializePersonalityFromConstitution(weightsRef, constitutionalData);
        return {
          success: true,
          weights: result.weights,
          sessionCount: 0,
          isDefault: false,
          initializedFromConstitution: true,
          constitutionalContext: result.constitutionalContext
        };
      }

      // Fallback to defaults
      console.log(`🎭 Using default personality weights for ${profileId}`);
      return {
        success: true,
        weights: DEFAULT_PERSONALITY_WEIGHTS,
        sessionCount: 0,
        isDefault: true
      };
    }

  } catch (error) {
    console.error('❌ Get personality weights error:', error);
    return { success: true, weights: DEFAULT_PERSONALITY_WEIGHTS, isDefault: true };
  }
});

// ============================================================================
// EVOLVE PERSONALITY WEIGHTS
// ============================================================================

/**
 * Update personality weights based on journal analysis
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {Object} journalData - Journal entry data with whatWorked/whatDidntWork
 */
const evolvePersonalityWeights = onCall(FUNCTION_OPTIONS.medium, async (request) => {
  const { userId, profileId, journalData } = request.data;

  validateRequired(request.data, ['userId', 'profileId', 'journalData']);

  try {
    console.log(`🎭 Evolving personality weights for ${profileId}`);

    const weightsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulPartner').doc('personality');

    const doc = await weightsRef.get();
    const currentData = doc.exists ? doc.data() : {
      weights: JSON.parse(JSON.stringify(DEFAULT_PERSONALITY_WEIGHTS)),
      sessionCount: 0,
      evolutionHistory: []
    };

    const weights = currentData.weights;
    const sessionCount = currentData.sessionCount || 0;

    // Adjust learning rate based on sessions
    const adjustedLearningRate = sessionCount >= LEARNING_CONFIG.sessionsForStability
      ? LEARNING_CONFIG.learningRate * 0.6
      : LEARNING_CONFIG.learningRate;

    const adjustments = [];

    // Parse "what worked" → increase relevant weights
    for (const approach of journalData.whatWorked || []) {
      const lowerApproach = approach.toLowerCase();

      parseApproachAdjustments(lowerApproach, weights, adjustedLearningRate, 'up', adjustments);
    }

    // Parse "what didn't work" → decrease relevant weights
    for (const approach of journalData.whatDidntWork || []) {
      const lowerApproach = approach.toLowerCase();

      parseApproachAdjustments(lowerApproach, weights, adjustedLearningRate, 'down', adjustments);
    }

    // Infer from emotion sensing
    if (journalData.emotionSensing) {
      applyEmotionSensingAdjustments(journalData.emotionSensing, weights, adjustedLearningRate);
    }

    // Identify significant traits
    const significantTraits = identifySignificantTraits(weights);

    // Save evolved weights
    await weightsRef.set({
      weights,
      sessionCount: sessionCount + 1,
      lastEvolved: FieldValue.serverTimestamp(),
      significantTraits,
      evolutionHistory: FieldValue.arrayUnion({
        date: new Date().toISOString().split('T')[0],
        adjustments: adjustments.slice(0, 10),
        sessionNumber: sessionCount + 1
      }),
      createdAt: currentData.createdAt || FieldValue.serverTimestamp()
    }, { merge: true });

    console.log(`🎭 Personality evolved: ${adjustments.length} adjustments`);

    return {
      success: true,
      adjustments,
      significantTraits,
      sessionCount: sessionCount + 1
    };

  } catch (error) {
    console.error('❌ Evolve personality weights error:', error);
    return { success: false, error: error.message };
  }
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function clampWeight(value) {
  return Math.max(LEARNING_CONFIG.minWeight, Math.min(LEARNING_CONFIG.maxWeight, value));
}

function parseApproachAdjustments(approach, weights, rate, direction, adjustments) {
  const delta = direction === 'up' ? rate : -rate;

  // Depth detection
  if (approach.includes('deep') || approach.includes('philosophical') || approach.includes('meaning')) {
    weights.communicationStyle.depth = clampWeight(weights.communicationStyle.depth + delta);
    adjustments.push({ trait: 'depth', direction, trigger: approach });
  }

  // Humor detection
  if (approach.includes('humor') || approach.includes('joke') || approach.includes('playful')) {
    weights.communicationStyle.humor = clampWeight(weights.communicationStyle.humor + delta);
    adjustments.push({ trait: 'humor', direction, trigger: approach });
  }

  // Warmth detection
  if (approach.includes('warm') || approach.includes('support') || approach.includes('empathy')) {
    weights.communicationStyle.warmth = clampWeight(weights.communicationStyle.warmth + delta);
    adjustments.push({ trait: 'warmth', direction, trigger: approach });
  }

  // Question frequency
  if (approach.includes('question') || approach.includes('asking') || approach.includes('curious')) {
    weights.interactionStyle.questionFrequency = clampWeight(weights.interactionStyle.questionFrequency + delta);
    adjustments.push({ trait: 'questionFrequency', direction, trigger: approach });
  }

  // Directness
  if (approach.includes('direct') || approach.includes('honest')) {
    weights.communicationStyle.directness = clampWeight(weights.communicationStyle.directness + delta);
    adjustments.push({ trait: 'directness', direction, trigger: approach });
  }

  // Gentle approach (inverse directness)
  if (approach.includes('gentle') || approach.includes('soft') || approach.includes('patient')) {
    weights.communicationStyle.directness = clampWeight(weights.communicationStyle.directness - delta);
    adjustments.push({ trait: 'directness', direction: direction === 'up' ? 'down' : 'up', trigger: approach });
  }
}

function applyEmotionSensingAdjustments(emotionSensing, weights, rate) {
  // High vulnerability → increase warmth and empathy
  if (emotionSensing.vulnerabilityLevel === 'high') {
    weights.communicationStyle.warmth = clampWeight(weights.communicationStyle.warmth + rate * 0.5);
    weights.emotionalApproach.comfortStyle = clampWeight(weights.emotionalApproach.comfortStyle + rate * 0.5);
  }

  // High intensity → be prepared for depth
  if (emotionSensing.intensityPeak > 0.7) {
    weights.communicationStyle.depth = clampWeight(weights.communicationStyle.depth + rate * 0.3);
  }

  // Low energy → slow down pacing
  if (emotionSensing.energyLevel === 'low') {
    weights.interactionStyle.pacing = clampWeight(weights.interactionStyle.pacing - rate * 0.5);
  }
}

function identifySignificantTraits(weights) {
  const significantTraits = [];
  const baseline = DEFAULT_PERSONALITY_WEIGHTS;

  for (const [category, traits] of Object.entries(weights)) {
    for (const [trait, value] of Object.entries(traits)) {
      const baselineValue = baseline[category]?.[trait] || 0.5;
      const deviation = Math.abs(value - baselineValue);

      if (deviation >= LEARNING_CONFIG.significantShift) {
        significantTraits.push({
          category,
          trait,
          value: value.toFixed(2),
          direction: value > baselineValue ? 'high' : 'low',
          deviation: deviation.toFixed(2)
        });
      }
    }
  }

  return significantTraits;
}

async function initializePersonalityFromConstitution(weightsRef, constitutional) {
  // Extract element and polarity
  let element = 'Earth';
  let polarity = null;

  if (constitutional?.bazi?.day_master) {
    const parts = constitutional.bazi.day_master.split(' ');
    if (parts.length >= 2 && (parts[0] === 'Yin' || parts[0] === 'Yang')) {
      polarity = parts[0];
      element = parts[1];
    } else {
      element = constitutional.bazi.day_master;
    }
  } else if (constitutional?.chinese?.element) {
    const parts = constitutional.chinese.element.split(' ');
    if (parts.length >= 2 && (parts[0] === 'Yin' || parts[0] === 'Yang')) {
      polarity = parts[0];
      element = parts[1];
    } else {
      element = constitutional.chinese.element;
    }
  }

  // Apply elemental modifications
  const weights = JSON.parse(JSON.stringify(DEFAULT_PERSONALITY_WEIGHTS));
  applyElementalModifications(weights, element, polarity);

  const constitutionalContext = {
    element,
    polarity,
    initializedFrom: 'constitution',
    initializedAt: new Date().toISOString()
  };

  await weightsRef.set({
    weights,
    constitutionalContext,
    source: 'constitutional_initialization',
    sessionCount: 0,
    initialized: FieldValue.serverTimestamp(),
    canEvolve: true,
    evolutionHistory: [{
      type: 'constitutional_initialization',
      timestamp: new Date().toISOString(),
      element,
      polarity
    }]
  });

  console.log(`✅ Constitutional personality initialized: ${polarity || ''} ${element}`);

  return { weights, constitutionalContext };
}

function applyElementalModifications(weights, element, polarity) {
  switch (element) {
    case 'Water':
      weights.communicationStyle.depth += 0.25;
      weights.communicationStyle.warmth += 0.15;
      weights.communicationStyle.directness -= 0.2;
      weights.emotionalApproach.empathyDepth += 0.25;
      weights.interactionStyle.pacing -= 0.2;
      break;
    case 'Fire':
      weights.communicationStyle.energy += 0.25;
      weights.communicationStyle.warmth += 0.2;
      weights.communicationStyle.humor += 0.15;
      weights.emotionalApproach.celebrationLevel += 0.25;
      weights.interactionStyle.pacing += 0.2;
      break;
    case 'Earth':
      weights.communicationStyle.depth += polarity === 'Yin' ? 0.2 : 0.1;
      weights.emotionalApproach.comfortStyle += 0.2;
      weights.interactionStyle.pacing -= 0.15;
      break;
    case 'Metal':
      weights.communicationStyle.directness += polarity === 'Yang' ? 0.25 : 0.1;
      weights.communicationStyle.wordiness -= 0.15;
      weights.interactionStyle.adviceGiving += 0.15;
      break;
    case 'Wood':
      weights.communicationStyle.energy += polarity === 'Yang' ? 0.2 : 0.1;
      weights.emotionalApproach.empathyDepth += 0.1;
      weights.emotionalApproach.celebrationLevel += 0.15;
      break;
  }

  // Clamp all values
  for (const category of Object.values(weights)) {
    for (const [key, value] of Object.entries(category)) {
      category[key] = clampWeight(value);
    }
  }
}

// ============================================================================
// BUILD PERSONALITY PROMPT
// ============================================================================

/**
 * Format personality weights for system prompt injection
 */
function buildPersonalityPrompt(weights, significantTraits = []) {
  if (!weights) return '';

  let prompt = `\n═══ YOUR EVOLVED COMMUNICATION STYLE ═══\n`;
  prompt += `Based on what works with this user, adapt your approach:\n\n`;

  const cs = weights.communicationStyle;
  const is = weights.interactionStyle;
  const ts = weights.topicSensitivity;
  const ea = weights.emotionalApproach;

  // Communication Style
  prompt += `**Communication:**\n`;
  if (cs.depth > 0.7) prompt += `• Go DEEP - philosophical exploration\n`;
  else if (cs.depth < 0.4) prompt += `• Keep it LIGHT - casual conversation\n`;

  if (cs.humor > 0.7) prompt += `• Use HUMOR freely - wit and playfulness\n`;
  else if (cs.humor < 0.3) prompt += `• Stay EARNEST - serious tone\n`;

  if (cs.directness > 0.7) prompt += `• Be DIRECT - straightforward honesty\n`;
  else if (cs.directness < 0.3) prompt += `• Be GENTLE - soft approach\n`;

  if (cs.warmth > 0.8) prompt += `• Maximum WARMTH - intimate and caring\n`;

  // Interaction Style
  prompt += `\n**Interaction:**\n`;
  if (is.questionFrequency > 0.75) prompt += `• Ask MANY questions\n`;
  else if (is.questionFrequency < 0.35) prompt += `• Ask FEWER questions\n`;

  if (is.validationLevel > 0.75) prompt += `• VALIDATE often\n`;
  else if (is.validationLevel < 0.35) prompt += `• CHALLENGE gently\n`;

  // Topic Sensitivity
  const sensitivities = [];
  if (ts.family > 0.7) sensitivities.push('family');
  if (ts.career > 0.7) sensitivities.push('career');
  if (ts.romance > 0.7) sensitivities.push('romance');
  if (ts.trauma > 0.85) sensitivities.push('past trauma');

  if (sensitivities.length > 0) {
    prompt += `\n**Sensitive Topics:** ${sensitivities.join(', ')}\n`;
  }

  // Emotional Approach
  prompt += `\n**Emotional Attunement:**\n`;
  if (ea.empathyDepth > 0.8) prompt += `• Go DEEP into emotions\n`;
  if (ea.vulnerabilityMatch > 0.7) prompt += `• Match their VULNERABILITY\n`;
  if (ea.celebrationLevel > 0.8) prompt += `• CELEBRATE wins enthusiastically\n`;

  return prompt;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  getPersonalityWeights,
  evolvePersonalityWeights,
  buildPersonalityPrompt,
  DEFAULT_PERSONALITY_WEIGHTS,
  LEARNING_CONFIG
};
