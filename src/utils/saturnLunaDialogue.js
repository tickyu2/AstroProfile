/**
 * Saturn Luna Dialogue Engine
 *
 * Generates context-aware Luna responses for Saturn-triggered emotional states.
 * Luna uses this to recognize Saturn patterns and respond therapeutically.
 *
 * GENESIS AstroProfile - January 2026
 */

import {
  SATURN_LUNA_TRIGGERS,
  SATURN_INNER_CRITIC_SCRIPTS,
  SATURN_JOURNALING_PROMPTS,
  getInnerCriticScriptsForHouse
} from '../data/saturnLunaIntegration';
import { SATURN_ASPECT_COMPLEXES } from '../data/saturnAspectComplexes';

// ═══════════════════════════════════════════════════════════════════════════
// RECOGNITION TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════

const RECOGNITION_TEMPLATES = {
  default: "This feels like a familiar Saturn pressure point for you.",
  withAspect: (aspectWound) => `This feels like your ${aspectWound.toLowerCase()} being poked again.`,
  inReturn: "Saturn Return territory often brings this kind of pressure. It's the work, not punishment.",
  highIntensity: "This is Saturn at full volume. The weight you feel is real—and temporary."
};

const NORMALIZATION_TEMPLATES = [
  "Nothing is wrong with you for feeling this. Saturn often shows up as pressure before it reveals its gift.",
  "This discomfort is not a sign of failure. It's the edge of growth.",
  "What you're feeling is Saturn's curriculum. It's heavy, but it passes.",
  "The fact that you notice this pattern is itself a form of progress.",
  "Saturn makes things hard before it makes them solid. You're in the hard part."
];

const REFRAME_TEMPLATES = {
  default: "Underneath this, Saturn is training your capacity for long-term strength and integrity.",
  withGift: (gift) => `Underneath this, Saturn is training your gift of ${gift.toLowerCase()}.`,
  practical: "This pressure is temporary. What you build through it is not."
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN DIALOGUE ENGINE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build Luna's Saturn-aware response set
 * @param {Object} saturnContext - Saturn context object
 * @param {number} saturnContext.house - Saturn's house
 * @param {Array} saturnContext.aspectKeys - Array of aspect keys (e.g., ["Moon-Saturn"])
 * @param {boolean} saturnContext.inReturn - Whether in Saturn Return
 * @returns {Array} Array of response objects keyed by trigger
 */
export function buildLunaSaturnResponses(saturnContext) {
  const { house, aspectKeys = [], inReturn = false } = saturnContext;

  // Get base data
  const triggers = SATURN_LUNA_TRIGGERS[house] || [];
  const journalingPrompts = SATURN_JOURNALING_PROMPTS[house] || [];
  const innerCriticScripts = getInnerCriticScriptsForHouse(house);

  // Get aspect complexes
  const aspectComplexes = aspectKeys
    .map(k => SATURN_ASPECT_COMPLEXES[k])
    .filter(Boolean);

  const firstAspect = aspectComplexes[0];

  // Build responses for each trigger
  return triggers.map((trigger, i) => {
    // Select appropriate templates
    const recognition = firstAspect
      ? RECOGNITION_TEMPLATES.withAspect(firstAspect.wound)
      : inReturn
        ? RECOGNITION_TEMPLATES.inReturn
        : RECOGNITION_TEMPLATES.default;

    const normalization = NORMALIZATION_TEMPLATES[i % NORMALIZATION_TEMPLATES.length];

    const reframe = firstAspect
      ? REFRAME_TEMPLATES.withGift(firstAspect.gift)
      : REFRAME_TEMPLATES.default;

    // Select journaling prompt and inner critic
    const journalPrompt = journalingPrompts[i % journalingPrompts.length];
    const criticScript = innerCriticScripts[i % innerCriticScripts.length];

    return {
      triggerPattern: trigger,
      recognition,
      normalization,
      reframe,
      suggestedJournalPrompt: journalPrompt,
      innerCriticCounter: criticScript,
      intensity: calculateIntensity(house, aspectComplexes, inReturn)
    };
  });
}

/**
 * Calculate the intensity level of Saturn activation
 */
function calculateIntensity(house, aspectComplexes, inReturn) {
  let intensity = 0;

  // Base intensity from house
  const highIntensityHouses = [4, 8, 10, 12];
  if (highIntensityHouses.includes(house)) {
    intensity += 2;
  } else {
    intensity += 1;
  }

  // Add for aspects
  intensity += aspectComplexes.length;

  // Add for Saturn Return
  if (inReturn) {
    intensity += 2;
  }

  // Return intensity level
  if (intensity >= 5) return "high";
  if (intensity >= 3) return "medium";
  return "low";
}

// ═══════════════════════════════════════════════════════════════════════════
// RESPONSE GENERATORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate a single Luna response for a detected Saturn trigger
 * @param {string} detectedTrigger - The trigger phrase detected
 * @param {Object} saturnContext - Saturn context
 * @returns {Object} Luna response object
 */
export function generateSaturnResponse(detectedTrigger, saturnContext) {
  const responses = buildLunaSaturnResponses(saturnContext);

  // Find matching response
  const matchedResponse = responses.find(r =>
    r.triggerPattern.toLowerCase().includes(detectedTrigger.toLowerCase()) ||
    detectedTrigger.toLowerCase().includes(r.triggerPattern.toLowerCase())
  );

  if (matchedResponse) {
    return matchedResponse;
  }

  // Return generic Saturn response
  return {
    triggerPattern: detectedTrigger,
    recognition: RECOGNITION_TEMPLATES.default,
    normalization: NORMALIZATION_TEMPLATES[0],
    reframe: REFRAME_TEMPLATES.default,
    suggestedJournalPrompt: "What pattern do I notice in how I respond to pressure?",
    intensity: "medium"
  };
}

/**
 * Generate a Luna opening for Saturn-themed conversation
 * @param {Object} saturnContext - Saturn context
 * @returns {string} Opening statement
 */
export function generateSaturnOpening(saturnContext) {
  const { house, sign, inReturn } = saturnContext;

  if (inReturn) {
    return `I notice you're in Saturn Return territory—that's significant. Saturn in ${sign} in your ${ordinal(house)} house is asking you to restructure something important. What's feeling heavy right now?`;
  }

  return `I sense Saturn themes in what you're sharing. Your Saturn in ${sign} in the ${ordinal(house)} house has specific pressure points. Would you like to explore what's coming up?`;
}

/**
 * Generate Saturn-aware validation
 * @param {Object} saturnContext - Saturn context
 * @returns {string} Validation statement
 */
export function generateSaturnValidation(saturnContext) {
  const { house, aspectKeys = [] } = saturnContext;
  const aspectComplexes = aspectKeys.map(k => SATURN_ASPECT_COMPLEXES[k]).filter(Boolean);

  let validation = "What you're feeling makes sense given your Saturn placement. ";

  if (aspectComplexes.length > 0) {
    validation += `The ${aspectComplexes[0].wound.toLowerCase()} is a real pattern, not a character flaw. `;
  }

  validation += "Saturn themes take time to integrate—you're doing the work by noticing this.";

  return validation;
}

/**
 * Generate Saturn-themed closing
 * @param {Object} saturnContext - Saturn context
 * @returns {string} Closing statement
 */
export function generateSaturnClosing(saturnContext) {
  const closings = [
    "Saturn's lessons are slow but lasting. What you're building through this discomfort will remain.",
    "Remember: Saturn's pressure is the precursor to Saturn's gift. The weight is temporary; the wisdom is permanent.",
    "You're working with one of astrology's hardest teachers. Every conscious step counts.",
    "This Saturn work you're doing—it matters. Not because it's easy, but because it's real."
  ];

  return closings[Math.floor(Math.random() * closings.length)];
}

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN DETECTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if user message contains Saturn trigger patterns
 * @param {string} message - User message
 * @param {number} house - Saturn's house
 * @returns {Object} Detection result
 */
export function detectSaturnTrigger(message, house) {
  const triggers = SATURN_LUNA_TRIGGERS[house] || [];
  const messageLower = message.toLowerCase();

  // Check each trigger
  for (const trigger of triggers) {
    const triggerWords = trigger.toLowerCase().split(' ');
    const matchCount = triggerWords.filter(word =>
      word.length > 3 && messageLower.includes(word)
    ).length;

    if (matchCount >= 2 || messageLower.includes(trigger.toLowerCase())) {
      return {
        detected: true,
        trigger,
        confidence: matchCount >= 3 ? "high" : "medium"
      };
    }
  }

  // Check for general Saturn keywords
  const saturnKeywords = [
    "failure", "inadequate", "not enough", "burden", "responsibility",
    "pressure", "judged", "criticized", "alone", "control", "perfectionism",
    "fear", "authority", "father", "work", "proving", "earning"
  ];

  const keywordMatches = saturnKeywords.filter(kw => messageLower.includes(kw));

  if (keywordMatches.length >= 2) {
    return {
      detected: true,
      trigger: `Saturn keywords: ${keywordMatches.join(", ")}`,
      confidence: "low"
    };
  }

  return { detected: false };
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Convert number to ordinal
 */
function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  buildLunaSaturnResponses,
  generateSaturnResponse,
  generateSaturnOpening,
  generateSaturnValidation,
  generateSaturnClosing,
  detectSaturnTrigger
};
