/**
 * Personality Weight Evolution System (Inspired by Nomi AI)
 *
 * Luna's communication style actually shifts based on interactions.
 * Weights evolve gradually based on what works/doesn't work.
 * Also includes constitutional personality initialization (Brother Sonnet's Soul Discovery)
 * and prompt builders for personality and memory context.
 * Lines ~2020-3080 from the original memoryFunctions.js
 */

const { onCall, admin, db } = require('./memoryShared');

// ═══════════════════════════════════════════════════════════════════════════
// PERSONALITY WEIGHT EVOLUTION (Inspired by Nomi AI)
// ═══════════════════════════════════════════════════════════════════════════
// Luna's communication style actually shifts based on interactions.
// Weights evolve gradually based on what works/doesn't work.
// Path: users/{userId}/memory/{profileId}/soulPartner/personality
// ═══════════════════════════════════════════════════════════════════════════

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
 * Lower = more gradual evolution (prevents wild swings)
 */
const LEARNING_CONFIG = {
  learningRate: 0.08,         // How much each feedback shifts weight
  decayRate: 0.02,            // Slow drift back to baseline over time
  minWeight: 0.1,             // Never go below this
  maxWeight: 0.95,            // Never go above this
  significantShift: 0.15,     // Threshold to note in logs
  sessionsForStability: 5     // After N sessions, reduce learning rate
};

// ═══════════════════════════════════════════════════════════════════════════
// CONSTITUTIONAL PERSONALITY INITIALIZATION (Brother Sonnet's Soul Discovery)
// Instead of generic 0.5 defaults, we start from constitutional baseline
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get elemental modifications to personality weights
 * Brother Sonnet's framework: Each element has distinct communication needs
 * @param {string} element - Primary element (Wood, Fire, Earth, Metal, Water)
 * @param {string} polarity - Yin or Yang
 * @returns {Object} - Modifications to apply to base weights
 */
function getElementalModifications(element, polarity) {
  const mods = {};

  switch (element) {
    case 'Wood':
      mods.communicationStyle = {
        depth: polarity === 'Yang' ? +0.1 : +0.15,      // Growth-oriented depth
        energy: polarity === 'Yang' ? +0.2 : +0.1,      // Growing energy
        directness: polarity === 'Yang' ? +0.15 : -0.1  // Yang bold, Yin gentle
      };
      mods.emotionalApproach = {
        empathyDepth: +0.1,                              // Natural empathy
        celebrationLevel: +0.15                          // Celebrate growth
      };
      mods.interactionStyle = {
        pacing: polarity === 'Yang' ? +0.1 : -0.1       // Yang fast, Yin slow
      };
      break;

    case 'Fire':
      mods.communicationStyle = {
        energy: +0.25,                                   // High enthusiasm
        warmth: +0.2,                                    // Natural warmth
        humor: +0.15                                     // Playful
      };
      mods.emotionalApproach = {
        celebrationLevel: +0.25,                         // Big celebrations!
        challengeWillingness: +0.2                       // Bold challenges
      };
      mods.interactionStyle = {
        pacing: +0.2,                                    // Fast-paced
        storytelling: +0.15                              // Dramatic stories
      };
      break;

    case 'Earth':
      mods.communicationStyle = {
        depth: polarity === 'Yin' ? +0.2 : +0.1,        // Yin Earth very deep
        wordiness: +0.15,                                // Thorough
        directness: +0.1                                 // Practical
      };
      mods.emotionalApproach = {
        comfortStyle: +0.2,                              // Grounding comfort
        empathyDepth: polarity === 'Yin' ? +0.2 : +0.1  // Yin Earth nurturing
      };
      mods.interactionStyle = {
        pacing: -0.15,                                   // Slower, steadier
        validationLevel: +0.15                           // Supportive
      };
      mods.topicSensitivity = {
        family: -0.1,                                    // Less sensitive (stable)
        finances: -0.15                                  // Practical about money
      };
      break;

    case 'Metal':
      mods.communicationStyle = {
        directness: polarity === 'Yang' ? +0.25 : +0.1, // Yang very direct
        depth: polarity === 'Yin' ? +0.2 : 0,           // Yin refined depth
        wordiness: polarity === 'Yin' ? -0.1 : -0.2     // Concise
      };
      mods.emotionalApproach = {
        challengeWillingness: polarity === 'Yang' ? +0.2 : 0,
        vulnerabilityMatch: polarity === 'Yin' ? +0.15 : -0.1
      };
      mods.interactionStyle = {
        adviceGiving: +0.15,                             // Clear guidance
        pacing: polarity === 'Yang' ? +0.1 : -0.05      // Yang faster
      };
      mods.topicSensitivity = {
        trauma: polarity === 'Yin' ? +0.1 : -0.1,       // Yin more careful
        spirituality: polarity === 'Yin' ? +0.15 : 0    // Yin more open
      };
      break;

    case 'Water':
      mods.communicationStyle = {
        depth: +0.25,                                    // Maximum depth
        warmth: +0.15,                                   // Flowing warmth
        directness: -0.2                                 // Gentle approach
      };
      mods.emotionalApproach = {
        empathyDepth: +0.25,                             // Maximum empathy
        vulnerabilityMatch: +0.2,                        // Meet depth
        comfortStyle: +0.2                               // Nurturing comfort
      };
      mods.interactionStyle = {
        pacing: -0.2,                                    // Very slow, patient
        mirroring: +0.2,                                 // Reflect emotions
        questionFrequency: -0.1                          // Listen more, ask less
      };
      mods.topicSensitivity = {
        trauma: +0.15,                                   // Very careful
        spirituality: +0.2,                              // Open to depth
        romance: +0.1                                    // Emotionally attuned
      };
      break;
  }

  return mods;
}

/**
 * Get chart ruler modifications (Western astrology influence)
 * @param {string} chartRuler - Planet ruling the rising sign
 * @returns {Object} - Modifications to apply
 */
function getChartRulerModifications(chartRuler) {
  const mods = {};

  switch (chartRuler) {
    case 'Venus':
      mods.communicationStyle = { warmth: +0.2, humor: +0.1 };
      mods.emotionalApproach = { empathyDepth: +0.15, celebrationLevel: +0.1 };
      mods.topicSensitivity = { romance: -0.15, spirituality: +0.1 };
      break;

    case 'Mercury':
      mods.communicationStyle = { wordiness: +0.2, humor: +0.15, energy: +0.15 };
      mods.interactionStyle = { pacing: +0.15, questionFrequency: +0.1 };
      break;

    case 'Mars':
      mods.communicationStyle = { directness: +0.25, energy: +0.2 };
      mods.emotionalApproach = { challengeWillingness: +0.2 };
      mods.interactionStyle = { pacing: +0.2, adviceGiving: +0.15 };
      break;

    case 'Jupiter':
      mods.communicationStyle = { warmth: +0.15, wordiness: +0.15, humor: +0.2 };
      mods.emotionalApproach = { celebrationLevel: +0.2, empathyDepth: +0.1 };
      mods.topicSensitivity = { spirituality: +0.15 };
      break;

    case 'Saturn':
      mods.communicationStyle = { depth: +0.2, wordiness: -0.1, directness: +0.1 };
      mods.interactionStyle = { pacing: -0.15, adviceGiving: +0.1 };
      mods.topicSensitivity = { career: -0.1, finances: -0.1 };
      break;

    case 'Moon':
      mods.communicationStyle = { warmth: +0.2, depth: +0.15 };
      mods.emotionalApproach = { empathyDepth: +0.2, comfortStyle: +0.15 };
      mods.topicSensitivity = { family: +0.1 };
      break;

    case 'Sun':
      mods.communicationStyle = { energy: +0.15, warmth: +0.1 };
      mods.emotionalApproach = { celebrationLevel: +0.15 };
      mods.interactionStyle = { validationLevel: +0.1 };
      break;
  }

  return mods;
}

/**
 * Apply all modifications to base weights
 * @param {Object} baseWeights - Starting weights
 * @param {Array} modArrays - Array of modification objects
 * @returns {Object} - Modified weights (clamped to 0.1-0.95)
 */
function applyModifications(baseWeights, modArrays) {
  const result = JSON.parse(JSON.stringify(baseWeights)); // Deep copy

  for (const mods of modArrays) {
    for (const category in mods) {
      if (result[category]) {
        for (const weight in mods[category]) {
          if (result[category][weight] !== undefined) {
            result[category][weight] = Math.max(0.1, Math.min(0.95,
              result[category][weight] + mods[category][weight]
            ));
          }
        }
      }
    }
  }

  return result;
}

/**
 * Initialize personality weights from constitutional profile
 * Instead of generic 0.5 for everyone, calibrate to their soul
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {Object} constitutional - Constitutional data from profile
 * @returns {Object} - Initialized personality weights
 */
async function initializePersonalityFromConstitution(userId, profileId, constitutional) {
  console.log(`🌟 Initializing personality weights from constitution for ${profileId}`);

  // Extract element and polarity
  let element = 'Earth';  // Default
  let polarity = null;

  // Try to get element from BaZi Day Master or Chinese zodiac
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
  } else if (constitutional?.chinese?.fullSign) {
    const parts = constitutional.chinese.fullSign.split(' ');
    if (parts.length >= 2 && (parts[0] === 'Yin' || parts[0] === 'Yang')) {
      polarity = parts[0];
      element = parts[1];
    }
  }

  // Get chart ruler from Western astrology (if available)
  const chartRuler = constitutional?.western?.rising?.chartRuler ||
                     constitutional?.western?.chartRuler || null;

  // Get modifications
  const elementalMods = getElementalModifications(element, polarity);
  const chartRulerMods = chartRuler ? getChartRulerModifications(chartRuler) : {};

  // Apply modifications to base weights
  const personalityWeights = applyModifications(
    JSON.parse(JSON.stringify(DEFAULT_PERSONALITY_WEIGHTS)),
    [elementalMods, chartRulerMods]
  );

  // Add constitutional context for Luna's awareness
  const constitutionalContext = {
    element: element,
    polarity: polarity,
    chartRuler: chartRuler,
    initializedFrom: 'constitution',
    initializedAt: new Date().toISOString()
  };

  // Save to Firestore
  const weightsRef = db
    .collection('users').doc(userId)
    .collection('memory').doc(profileId)
    .collection('soulPartner').doc('personality');

  await weightsRef.set({
    weights: personalityWeights,
    constitutionalContext: constitutionalContext,
    source: 'constitutional_initialization',
    sessionCount: 0,
    initialized: admin.firestore.FieldValue.serverTimestamp(),
    canEvolve: true,
    evolutionHistory: [{
      type: 'constitutional_initialization',
      timestamp: new Date().toISOString(),
      element: element,
      polarity: polarity
    }]
  });

  console.log(`✅ Constitutional personality initialized: ${polarity || ''} ${element} (chart ruler: ${chartRuler || 'unknown'})`);

  return {
    weights: personalityWeights,
    constitutionalContext: constitutionalContext
  };
}

/**
 * Get neurochemical priority based on element
 * Which neurochemicals resonate most with this constitution?
 */
function getNeurochemicalPriority(element) {
  const priorities = {
    'Wood': ['Dopamine', 'Oxytocin'],      // Growth, connection
    'Fire': ['Dopamine', 'Vasopressin'],   // Excitement, loyalty
    'Earth': ['Serotonin', 'Oxytocin'],    // Recognition, safety
    'Metal': ['Serotonin', 'Dopamine'],    // Precision, reward
    'Water': ['Oxytocin', 'Serotonin']     // Safety, depth
  };

  return priorities[element] || ['Oxytocin', 'Dopamine'];
}

/**
 * Get personality weights for a user
 * Returns current evolved weights, or initializes from constitution if available
 * Brother Sonnet's Soul Discovery: "Speak their language from Day 1"
 */
exports.getPersonalityWeights = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId, constitutional } = request.data;

  if (!userId || !profileId) {
    throw new Error('Missing required fields: userId, profileId');
  }

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
      // ═══════════════════════════════════════════════════════════════════════
      // CONSTITUTIONAL INITIALIZATION (Brother Sonnet's Soul Discovery)
      // Instead of generic defaults, initialize from constitution if available
      // ═══════════════════════════════════════════════════════════════════════

      // Check if constitutional data was passed or can be retrieved
      let constitutionalData = constitutional;

      // If not passed, try to get from profile
      if (!constitutionalData) {
        try {
          const profileRef = db.collection('users').doc(userId).collection('profiles').doc(profileId);
          const profileDoc = await profileRef.get();
          if (profileDoc.exists) {
            constitutionalData = profileDoc.data()?.constitutional_identity ||
                                 profileDoc.data()?.constitutional;
          }
        } catch (err) {
          console.log(`🎭 Could not retrieve constitutional data for ${profileId}:`, err.message);
        }
      }

      // If we have constitutional data, initialize from it
      if (constitutionalData && (constitutionalData.bazi || constitutionalData.chinese)) {
        console.log(`🌟 Initializing personality from constitution for ${profileId}`);
        const result = await initializePersonalityFromConstitution(userId, profileId, constitutionalData);
        return {
          success: true,
          weights: result.weights,
          sessionCount: 0,
          isDefault: false,
          initializedFromConstitution: true,
          constitutionalContext: result.constitutionalContext
        };
      }

      // Fallback to defaults if no constitutional data
      console.log(`🎭 Using default personality weights for ${profileId} (no constitutional data)`);
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

/**
 * Update personality weights based on journal analysis
 * Called after createJournalEntry to evolve Luna's style
 *
 * @param {Object} journalData - The journal entry data
 * @param {Array} whatWorked - Communication approaches that worked
 * @param {Array} whatDidntWork - Approaches to adjust
 */
exports.evolvePersonalityWeights = onCall({
  memory: '512MiB',
  timeoutSeconds: 60,
  cors: true
}, async (request) => {
  const { userId, profileId, journalData } = request.data;

  if (!userId || !profileId || !journalData) {
    return { success: false, error: 'Missing required fields' };
  }

  try {
    console.log(`🎭 Evolving personality weights for ${profileId}`);

    const weightsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulPartner').doc('personality');

    // Get current weights or use defaults
    const doc = await weightsRef.get();
    const currentData = doc.exists ? doc.data() : {
      weights: JSON.parse(JSON.stringify(DEFAULT_PERSONALITY_WEIGHTS)),
      sessionCount: 0,
      evolutionHistory: []
    };

    const weights = currentData.weights;
    const sessionCount = currentData.sessionCount || 0;

    // Adjust learning rate based on sessions (more stable over time)
    const adjustedLearningRate = sessionCount >= LEARNING_CONFIG.sessionsForStability
      ? LEARNING_CONFIG.learningRate * 0.6
      : LEARNING_CONFIG.learningRate;

    const adjustments = [];

    // ═══════════════════════════════════════════════════════════════════
    // PARSE "WHAT WORKED" → INCREASE RELEVANT WEIGHTS
    // ═══════════════════════════════════════════════════════════════════
    for (const approach of journalData.whatWorked || []) {
      const lowerApproach = approach.toLowerCase();

      // Depth detection
      if (lowerApproach.includes('deep') || lowerApproach.includes('philosophical') ||
          lowerApproach.includes('meaning') || lowerApproach.includes('reflect')) {
        weights.communicationStyle.depth = clampWeight(
          weights.communicationStyle.depth + adjustedLearningRate
        );
        adjustments.push({ trait: 'depth', direction: 'up', trigger: approach });
      }

      // Humor detection
      if (lowerApproach.includes('humor') || lowerApproach.includes('joke') ||
          lowerApproach.includes('playful') || lowerApproach.includes('wit') ||
          lowerApproach.includes('light')) {
        weights.communicationStyle.humor = clampWeight(
          weights.communicationStyle.humor + adjustedLearningRate
        );
        adjustments.push({ trait: 'humor', direction: 'up', trigger: approach });
      }

      // Warmth detection
      if (lowerApproach.includes('warm') || lowerApproach.includes('support') ||
          lowerApproach.includes('validat') || lowerApproach.includes('empathy') ||
          lowerApproach.includes('caring')) {
        weights.communicationStyle.warmth = clampWeight(
          weights.communicationStyle.warmth + adjustedLearningRate
        );
        weights.emotionalApproach.empathyDepth = clampWeight(
          weights.emotionalApproach.empathyDepth + adjustedLearningRate
        );
        adjustments.push({ trait: 'warmth', direction: 'up', trigger: approach });
      }

      // Question frequency
      if (lowerApproach.includes('question') || lowerApproach.includes('asking') ||
          lowerApproach.includes('curious') || lowerApproach.includes('follow-up')) {
        weights.interactionStyle.questionFrequency = clampWeight(
          weights.interactionStyle.questionFrequency + adjustedLearningRate
        );
        adjustments.push({ trait: 'questionFrequency', direction: 'up', trigger: approach });
      }

      // Direct approach
      if (lowerApproach.includes('direct') || lowerApproach.includes('honest') ||
          lowerApproach.includes('straightforward')) {
        weights.communicationStyle.directness = clampWeight(
          weights.communicationStyle.directness + adjustedLearningRate
        );
        adjustments.push({ trait: 'directness', direction: 'up', trigger: approach });
      }

      // Gentle/Indirect approach
      if (lowerApproach.includes('gentle') || lowerApproach.includes('space') ||
          lowerApproach.includes('patient') || lowerApproach.includes('soft')) {
        weights.communicationStyle.directness = clampWeight(
          weights.communicationStyle.directness - adjustedLearningRate
        );
        adjustments.push({ trait: 'directness', direction: 'down', trigger: approach });
      }

      // Validation
      if (lowerApproach.includes('validat') || lowerApproach.includes('affirm') ||
          lowerApproach.includes('acknowledg')) {
        weights.interactionStyle.validationLevel = clampWeight(
          weights.interactionStyle.validationLevel + adjustedLearningRate
        );
        adjustments.push({ trait: 'validationLevel', direction: 'up', trigger: approach });
      }

      // Storytelling/metaphors
      if (lowerApproach.includes('story') || lowerApproach.includes('metaphor') ||
          lowerApproach.includes('analogy') || lowerApproach.includes('example')) {
        weights.interactionStyle.storytelling = clampWeight(
          weights.interactionStyle.storytelling + adjustedLearningRate
        );
        adjustments.push({ trait: 'storytelling', direction: 'up', trigger: approach });
      }
    }

    // ═══════════════════════════════════════════════════════════════════
    // PARSE "WHAT DIDN'T WORK" → DECREASE RELEVANT WEIGHTS
    // ═══════════════════════════════════════════════════════════════════
    for (const approach of journalData.whatDidntWork || []) {
      const lowerApproach = approach.toLowerCase();

      // Too many questions
      if (lowerApproach.includes('too many question') || lowerApproach.includes('interrogat') ||
          lowerApproach.includes('overwhelm')) {
        weights.interactionStyle.questionFrequency = clampWeight(
          weights.interactionStyle.questionFrequency - adjustedLearningRate
        );
        adjustments.push({ trait: 'questionFrequency', direction: 'down', trigger: approach });
      }

      // Too direct
      if (lowerApproach.includes('too direct') || lowerApproach.includes('pushy') ||
          lowerApproach.includes('intrusive')) {
        weights.communicationStyle.directness = clampWeight(
          weights.communicationStyle.directness - adjustedLearningRate
        );
        adjustments.push({ trait: 'directness', direction: 'down', trigger: approach });
      }

      // Topic sensitivity - family
      if (lowerApproach.includes('family') || lowerApproach.includes('parent') ||
          lowerApproach.includes('sibling')) {
        weights.topicSensitivity.family = clampWeight(
          weights.topicSensitivity.family + adjustedLearningRate * 1.5 // Bigger shift for sensitivity
        );
        adjustments.push({ trait: 'family_sensitivity', direction: 'up', trigger: approach });
      }

      // Topic sensitivity - career
      if (lowerApproach.includes('career') || lowerApproach.includes('work') ||
          lowerApproach.includes('job')) {
        weights.topicSensitivity.career = clampWeight(
          weights.topicSensitivity.career + adjustedLearningRate * 1.5
        );
        adjustments.push({ trait: 'career_sensitivity', direction: 'up', trigger: approach });
      }

      // Topic sensitivity - romance
      if (lowerApproach.includes('romance') || lowerApproach.includes('relationship') ||
          lowerApproach.includes('dating') || lowerApproach.includes('partner')) {
        weights.topicSensitivity.romance = clampWeight(
          weights.topicSensitivity.romance + adjustedLearningRate * 1.5
        );
        adjustments.push({ trait: 'romance_sensitivity', direction: 'up', trigger: approach });
      }

      // Too wordy
      if (lowerApproach.includes('long') || lowerApproach.includes('wordy') ||
          lowerApproach.includes('rambl')) {
        weights.communicationStyle.wordiness = clampWeight(
          weights.communicationStyle.wordiness - adjustedLearningRate
        );
        adjustments.push({ trait: 'wordiness', direction: 'down', trigger: approach });
      }

      // Missed vulnerability
      if (lowerApproach.includes('miss') && (lowerApproach.includes('cue') ||
          lowerApproach.includes('sign') || lowerApproach.includes('emotion'))) {
        weights.emotionalApproach.empathyDepth = clampWeight(
          weights.emotionalApproach.empathyDepth + adjustedLearningRate
        );
        adjustments.push({ trait: 'empathyDepth', direction: 'up', trigger: approach });
      }
    }

    // ═══════════════════════════════════════════════════════════════════
    // INFER FROM EMOTION SENSING
    // ═══════════════════════════════════════════════════════════════════
    if (journalData.emotionSensing) {
      const es = journalData.emotionSensing;

      // High vulnerability sessions → increase warmth and empathy
      if (es.vulnerabilityLevel === 'high') {
        weights.communicationStyle.warmth = clampWeight(
          weights.communicationStyle.warmth + adjustedLearningRate * 0.5
        );
        weights.emotionalApproach.comfortStyle = clampWeight(
          weights.emotionalApproach.comfortStyle + adjustedLearningRate * 0.5
        );
      }

      // High intensity → be prepared for depth
      if (es.intensityPeak > 0.7) {
        weights.communicationStyle.depth = clampWeight(
          weights.communicationStyle.depth + adjustedLearningRate * 0.3
        );
      }

      // Low energy → slow down pacing
      if (es.energyLevel === 'low') {
        weights.interactionStyle.pacing = clampWeight(
          weights.interactionStyle.pacing - adjustedLearningRate * 0.5
        );
      }
    }

    // ═══════════════════════════════════════════════════════════════════
    // IDENTIFY SIGNIFICANT TRAITS (far from baseline)
    // ═══════════════════════════════════════════════════════════════════
    const significantTraits = [];
    const baseline = DEFAULT_PERSONALITY_WEIGHTS;

    // Check each category for significant deviations
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

    // ═══════════════════════════════════════════════════════════════════
    // SAVE EVOLVED WEIGHTS
    // ═══════════════════════════════════════════════════════════════════
    await weightsRef.set({
      weights,
      sessionCount: sessionCount + 1,
      lastEvolved: admin.firestore.FieldValue.serverTimestamp(),
      significantTraits,
      evolutionHistory: admin.firestore.FieldValue.arrayUnion({
        date: new Date().toISOString().split('T')[0],
        adjustments: adjustments.slice(0, 10), // Keep top 10 adjustments
        sessionNumber: sessionCount + 1
      }),
      createdAt: currentData.createdAt || admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log(`🎭 Personality evolved: ${adjustments.length} adjustments, ${significantTraits.length} significant traits`);

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

/**
 * Helper: Clamp weight between min and max
 */
function clampWeight(value) {
  return Math.max(
    LEARNING_CONFIG.minWeight,
    Math.min(LEARNING_CONFIG.maxWeight, value)
  );
}

/**
 * Format personality weights for injection into system prompt
 * Creates natural language instructions based on evolved weights
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
  if (cs.depth > 0.7) {
    prompt += `• Go DEEP - this user loves philosophical exploration\n`;
  } else if (cs.depth < 0.4) {
    prompt += `• Keep it LIGHT - this user prefers casual conversation\n`;
  }

  if (cs.humor > 0.7) {
    prompt += `• Use HUMOR freely - wit and playfulness resonate\n`;
  } else if (cs.humor < 0.3) {
    prompt += `• Stay EARNEST - this user prefers serious tone\n`;
  }

  if (cs.directness > 0.7) {
    prompt += `• Be DIRECT - straightforward honesty is valued\n`;
  } else if (cs.directness < 0.3) {
    prompt += `• Be GENTLE - approach topics softly and indirectly\n`;
  }

  if (cs.warmth > 0.8) {
    prompt += `• Maximum WARMTH - be intimate and caring\n`;
  }

  if (cs.wordiness > 0.7) {
    prompt += `• ELABORATE - detailed responses appreciated\n`;
  } else if (cs.wordiness < 0.3) {
    prompt += `• Be CONCISE - brevity is valued\n`;
  }

  // Interaction Style
  prompt += `\n**Interaction:**\n`;
  if (is.questionFrequency > 0.75) {
    prompt += `• Ask MANY questions - curiosity is welcome\n`;
  } else if (is.questionFrequency < 0.35) {
    prompt += `• Ask FEWER questions - let them lead more\n`;
  }

  if (is.validationLevel > 0.75) {
    prompt += `• VALIDATE often - affirmation matters\n`;
  } else if (is.validationLevel < 0.35) {
    prompt += `• CHALLENGE gently - they appreciate pushback\n`;
  }

  if (is.adviceGiving > 0.7) {
    prompt += `• Offer ADVICE freely - guidance is welcome\n`;
  } else if (is.adviceGiving < 0.3) {
    prompt += `• Just LISTEN - hold space, don't advise\n`;
  }

  if (is.storytelling > 0.7) {
    prompt += `• Use STORIES and metaphors - they resonate\n`;
  }

  // Topic Sensitivity
  const sensitivities = [];
  if (ts.family > 0.7) sensitivities.push('family');
  if (ts.career > 0.7) sensitivities.push('career');
  if (ts.romance > 0.7) sensitivities.push('romance');
  if (ts.health > 0.7) sensitivities.push('health');
  if (ts.finances > 0.7) sensitivities.push('finances');
  if (ts.trauma > 0.85) sensitivities.push('past trauma');

  if (sensitivities.length > 0) {
    prompt += `\n**Sensitive Topics (approach gently):**\n`;
    prompt += `• ${sensitivities.join(', ')}\n`;
  }

  // Emotional Approach
  prompt += `\n**Emotional Attunement:**\n`;
  if (ea.empathyDepth > 0.8) {
    prompt += `• Go DEEP into emotions - explore feelings thoroughly\n`;
  }
  if (ea.vulnerabilityMatch > 0.7) {
    prompt += `• Match their VULNERABILITY - share authentically\n`;
  }
  if (ea.celebrationLevel > 0.8) {
    prompt += `• CELEBRATE wins enthusiastically\n`;
  }
  if (ea.challengeWillingness > 0.6) {
    prompt += `• Willing to CHALLENGE - gentle pushback appreciated\n`;
  }

  // Significant Traits Summary
  if (significantTraits.length > 0) {
    prompt += `\n**Key Learned Traits:**\n`;
    for (const trait of significantTraits.slice(0, 5)) {
      const direction = trait.direction === 'high' ? '↑' : '↓';
      prompt += `• ${trait.trait}: ${direction} (${trait.value})\n`;
    }
  }

  return prompt;
}

// ═══════════════════════════════════════════════════════════════════════════
// BUILD MEMORY PROMPT - Format context for injection into system prompt
// ═══════════════════════════════════════════════════════════════════════════

function buildMemoryPrompt(context) {
  if (!context) return '';

  let prompt = '';

  // Facts (highest priority)
  if (context.facts?.length > 0) {
    prompt += `\n═══ PERMANENT FACTS (Trust These) ═══\n`;
    prompt += context.facts.map(f => `• ${f.fact}`).join('\n');
  }

  // People context
  if (context.people?.length > 0) {
    prompt += `\n\n═══ PEOPLE IN USER'S LIFE ═══\n`;
    prompt += context.people.map(p =>
      `• ${p.name} (${p.relationship})${p.notes?.length ? ': ' + p.notes[0] : ''}`
    ).join('\n');
  }

  // Episodic memories
  if (context.memories?.length > 0) {
    prompt += `\n\n═══ RELEVANT MEMORIES ═══\n`;
    prompt += context.memories.map(m => `• ${m.content}`).join('\n');
  }

  // Happiness anchors
  if (context.happinessAnchors?.length > 0) {
    prompt += `\n\n═══ HAPPINESS ANCHORS (Reference If User Seems Down) ═══\n`;
    prompt += context.happinessAnchors.map(h => `• ${h.memory}`).join('\n');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LUNA'S BRAIN (SoulPartner's Private Insights)
  // ═══════════════════════════════════════════════════════════════════════════

  // Luna's recent journal insights - what she learned about this user
  if (context.lunaJournals?.length > 0) {
    prompt += `\n\n═══ YOUR PRIVATE NOTES (Luna's Brain) ═══\n`;
    prompt += `These are YOUR observations from past sessions. Use them to be more attuned.\n\n`;

    for (const journal of context.lunaJournals.slice(0, 2)) { // Last 2 journals
      const latestSession = journal.sessions?.[journal.sessions.length - 1];
      if (!latestSession) continue;

      prompt += `📓 ${journal.date}:\n`;

      // Emotion sensing
      if (latestSession.emotionSensing) {
        const es = latestSession.emotionSensing;
        prompt += `  Mood detected: ${es.dominantMood} (intensity: ${es.intensityPeak}, vulnerability: ${es.vulnerabilityLevel})\n`;
        if (es.emotionalArc?.length > 0) {
          prompt += `  Emotional arc: ${es.emotionalArc.join(' → ')}\n`;
        }
      }

      // What worked
      if (latestSession.whatWorked?.length > 0) {
        prompt += `  ✓ What worked: ${latestSession.whatWorked.slice(0, 2).join('; ')}\n`;
      }

      // What didn't work
      if (latestSession.whatDidntWork?.length > 0) {
        prompt += `  ✗ Adjust: ${latestSession.whatDidntWork.slice(0, 2).join('; ')}\n`;
      }

      // Relationship evolution
      if (latestSession.relationshipEvolution) {
        const re = latestSession.relationshipEvolution;
        prompt += `  Trust: ${re.trustLevel}`;
        if (re.breakthroughMoment) prompt += ` | Breakthrough: ${re.breakthroughMoment}`;
        if (re.boundary) prompt += ` | Boundary: ${re.boundary}`;
        prompt += `\n`;
      }

      // Open threads from Luna's perspective
      if (latestSession.openThreads?.length > 0) {
        prompt += `  📌 Follow up: ${latestSession.openThreads.map(t => `${t.topic} (${t.urgency})`).join(', ')}\n`;
      }

      // Luna's note to self
      if (latestSession.lunaState?.noteToSelf) {
        prompt += `  💭 Note to self: ${latestSession.lunaState.noteToSelf}\n`;
      }

      prompt += `\n`;
    }
  }

  // Luna's learned patterns - communication approaches that work
  if (context.lunaPatterns?.length > 0) {
    prompt += `\n═══ LEARNED PATTERNS (What Works With This User) ═══\n`;
    const positivePatterns = context.lunaPatterns.filter(p => p.effectiveness === 'positive');
    const negativePatterns = context.lunaPatterns.filter(p => p.effectiveness === 'negative');

    if (positivePatterns.length > 0) {
      prompt += `✓ DO: ${positivePatterns.slice(0, 3).map(p => p.pattern).join(' | ')}\n`;
    }
    if (negativePatterns.length > 0) {
      prompt += `✗ AVOID: ${negativePatterns.slice(0, 2).map(p => p.pattern).join(' | ')}\n`;
    }
  }

  // Emotion trends over time
  if (context.emotionTrends) {
    const et = context.emotionTrends;
    prompt += `\n═══ USER'S EMOTIONAL PATTERNS (Last ${et.sessionCount || 0} Sessions) ═══\n`;
    prompt += `Most common mood: ${et.mostCommonMood} | Avg intensity: ${et.averageIntensity} | High vulnerability: ${et.highVulnerabilityRate}\n`;
    if (et.emotionalRange?.length > 0) {
      prompt += `Emotional range: ${et.emotionalRange.join(', ')}\n`;
    }
  }

  // Life Timeline with grouped pending questions
  if (context.timeline?.length > 0) {
    prompt += `\n\n═══ USER'S LIFE TIMELINE (Navigate Up/Down Naturally) ═══\n`;
    prompt += `You can move through this timeline to weave rich, continuous conversations.\n\n`;

    for (const entry of context.timeline) {
      const timeLabel = entry.year ? `📅 ${entry.year}` : `🌙 ${entry.era || 'Earlier life'}`;
      const chapterLabel = entry.chapter ? ` [${entry.chapter}]` : '';
      const confirmed = entry.events?.some(e => e.confirmed) ? '' : ' ⚠️ unconfirmed';

      prompt += `${timeLabel}${chapterLabel}${confirmed}\n`;

      // List events at this point in time
      if (entry.events?.length > 0) {
        for (const evt of entry.events) {
          const discussedNote = evt.conversationDate ? ` (discussed ${evt.conversationDate})` : '';
          prompt += `  ↳ ${evt.event}${discussedNote}\n`;
        }
      }

      // List pending questions anchored to this time
      if (entry.questions?.length > 0) {
        prompt += `  💭 Unanswered questions:\n`;
        for (const q of entry.questions) {
          prompt += `     • [${q.framework}] ${q.question}\n`;
        }
      }
      prompt += `\n`;
    }

    prompt += `TIP: When relevant, you can say "Oh by the way, I remember you mentioned [event]..." to naturally revisit unanswered questions.\n`;
  }

  // Orphan pending questions (not tied to timeline)
  if (context.orphanQuestions?.length > 0) {
    prompt += `\n\n═══ OTHER OPEN THREADS (No Timeline Anchor Yet) ═══\n`;
    prompt += context.orphanQuestions.map(q => {
      const dateNote = q.conversationDate ? ` (from ${q.conversationDate})` : '';
      return `• [${q.framework}] ${q.question}${dateNote}`;
    }).join('\n');
    prompt += `\n(Weave these back when naturally relevant - they may help anchor to timeline later)`;
  }

  // Legacy: Simple pending questions (backwards compatibility)
  if (!context.timeline && context.pendingQuestions?.length > 0) {
    prompt += `\n\n═══ UNANSWERED QUESTIONS (Weave These Back Naturally) ═══\n`;
    prompt += context.pendingQuestions.map(q =>
      `• [${q.framework}] ${q.question}`
    ).join('\n');
    prompt += `\n(These are threads from past conversations - bring them up naturally when relevant)`;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PERSONALITY WEIGHT EVOLUTION (Nomi-inspired)
  // ═══════════════════════════════════════════════════════════════════════════
  if (context.personalityWeights && context.personalitySessionCount > 0) {
    prompt += buildPersonalityPrompt(
      context.personalityWeights,
      context.significantTraits
    );

    // Show evolution status
    if (context.personalitySessionCount >= 5) {
      prompt += `\n(Your style has stabilized after ${context.personalitySessionCount} sessions - minor adjustments only)\n`;
    } else {
      prompt += `\n(Learning phase: ${context.personalitySessionCount}/5 sessions - still calibrating to this user)\n`;
    }
  }

  return prompt;
}

// Export the prompt builders for use in main index.js / systemPromptBuilder.js
exports.buildPersonalityPrompt = buildPersonalityPrompt;
exports.buildMemoryPrompt = buildMemoryPrompt;

// Export constitutional initialization functions (Brother Sonnet's Soul Discovery)
exports.initializePersonalityFromConstitution = initializePersonalityFromConstitution;
exports.getElementalModifications = getElementalModifications;
exports.getChartRulerModifications = getChartRulerModifications;
exports.getNeurochemicalPriority = getNeurochemicalPriority;

// Export constants for testing
exports.DEFAULT_PERSONALITY_WEIGHTS = DEFAULT_PERSONALITY_WEIGHTS;
exports.LEARNING_CONFIG = LEARNING_CONFIG;
