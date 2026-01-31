/**
 * Saturn Relationship Dynamics Engine
 *
 * Based on Liz Greene's "Relating" — the psychological approach to
 * projection, shadow, fear, and the karmic contract of intimacy.
 *
 * This engine produces a complete relational psychology profile:
 * - Projection Map (what you expect partners to carry)
 * - Compatibility Wound (sign-based relational fear)
 * - Partnership Contract (the soul lesson)
 * - Break Pattern (how Saturn sabotages intimacy)
 * - Healing Pattern (the path to repair)
 * - Aspect Influences (how aspects intensify patterns)
 * - Relational Triggers (what activates the wound)
 *
 * GENESIS AstroProfile - January 2026
 */

import {
  SATURN_PROJECTION_MAP,
  SATURN_COMPATIBILITY_WOUND,
  SATURN_PARTNERSHIP_CONTRACT,
  SATURN_BREAK_PATTERNS,
  SATURN_HEALING_PATTERNS,
  SATURN_RELATIONAL_TRIGGERS,
  SATURN_ASPECT_RELATIONAL_MODIFIERS,
  getProjectionPattern,
  getCompatibilityWound,
  getPartnershipContract,
  getBreakPattern,
  getHealingPattern,
  getRelationalTriggers,
  getAspectRelationalModifier
} from '../data/saturnRelationshipDynamicsData';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ENGINE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build complete Saturn Relationship Dynamics profile
 *
 * @param {string} saturnSign - Saturn sign (e.g., "Capricorn")
 * @param {number} saturnHouse - Saturn house (1-12)
 * @param {Array} aspectComplexes - Array of aspect complexes from natal chart
 * @returns {Object} Complete relationship dynamics profile
 */
export function buildSaturnRelationshipDynamics(saturnSign, saturnHouse, aspectComplexes = []) {
  // Core patterns
  const projection = getProjectionPattern(saturnHouse);
  const compatibilityWound = getCompatibilityWound(saturnSign);
  const partnershipContract = getPartnershipContract(saturnHouse);
  const breakPattern = getBreakPattern(saturnHouse);
  const healingPattern = getHealingPattern(saturnHouse);
  const relationalTriggers = getRelationalTriggers(saturnHouse);

  // Build aspect influences
  const aspectInfluences = buildAspectInfluences(aspectComplexes);

  // Build partner projection patterns from aspects
  const partnerProjections = buildPartnerProjections(aspectComplexes);

  // Build relational gifts from aspects
  const relationalGifts = buildRelationalGifts(aspectComplexes);

  // Generate Luna guidance for relationships
  const lunaRelationshipGuidance = generateLunaRelationshipGuidance(
    saturnSign,
    saturnHouse,
    aspectComplexes
  );

  return {
    // Core dynamics
    projection,
    compatibilityWound,
    partnershipContract,
    breakPattern,
    healingPattern,
    relationalTriggers,

    // Aspect-based patterns
    aspectInfluences,
    partnerProjections,
    relationalGifts,

    // Luna guidance
    lunaRelationshipGuidance,

    // Metadata
    metadata: {
      sign: saturnSign,
      house: saturnHouse,
      aspectCount: aspectComplexes.length,
      hasAspectInfluences: aspectInfluences.length > 0
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ASPECT PROCESSING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build aspect influence descriptions
 * @param {Array} aspectComplexes - Aspect complexes
 * @returns {Array} Influence descriptions
 */
function buildAspectInfluences(aspectComplexes) {
  if (!aspectComplexes || !Array.isArray(aspectComplexes)) return [];

  return aspectComplexes.map(complex => {
    const modifier = getAspectRelationalModifier(`${complex.planet}-Saturn`);

    if (modifier) {
      return {
        aspect: `${complex.planet}-Saturn`,
        wound: modifier.relationalWound,
        defense: modifier.relationalDefense,
        gift: modifier.relationalGift,
        influence: `Because of ${modifier.relationalWound.toLowerCase()}, you may unconsciously expect partners to compensate for this — but the gift is ${modifier.relationalGift.toLowerCase()}.`
      };
    }

    // Fallback to complex data if no specific modifier
    if (complex.wound && complex.gift) {
      return {
        aspect: `${complex.planet}-Saturn`,
        wound: complex.wound,
        defense: complex.defense,
        gift: complex.gift,
        influence: `Because of ${complex.wound.toLowerCase()}, you may unconsciously expect partners to compensate for this — but the gift is ${complex.gift.toLowerCase()}.`
      };
    }

    return null;
  }).filter(Boolean);
}

/**
 * Build partner projection patterns from aspects
 * @param {Array} aspectComplexes - Aspect complexes
 * @returns {Array} Partner projection descriptions
 */
function buildPartnerProjections(aspectComplexes) {
  if (!aspectComplexes || !Array.isArray(aspectComplexes)) return [];

  return aspectComplexes.map(complex => {
    const modifier = getAspectRelationalModifier(`${complex.planet}-Saturn`);
    if (modifier && modifier.partnerProjection) {
      return {
        aspect: `${complex.planet}-Saturn`,
        projection: modifier.partnerProjection
      };
    }
    return null;
  }).filter(Boolean);
}

/**
 * Build relational gifts from aspects
 * @param {Array} aspectComplexes - Aspect complexes
 * @returns {Array} Relational gift descriptions
 */
function buildRelationalGifts(aspectComplexes) {
  if (!aspectComplexes || !Array.isArray(aspectComplexes)) return [];

  return aspectComplexes.map(complex => {
    const modifier = getAspectRelationalModifier(`${complex.planet}-Saturn`);
    if (modifier && modifier.relationalGift) {
      return {
        aspect: `${complex.planet}-Saturn`,
        gift: modifier.relationalGift
      };
    }
    return null;
  }).filter(Boolean);
}

// ═══════════════════════════════════════════════════════════════════════════
// LUNA GUIDANCE GENERATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate Luna guidance for relationship work
 * @param {string} sign - Saturn sign
 * @param {number} house - Saturn house
 * @param {Array} aspectComplexes - Aspect complexes
 * @returns {Object} Luna guidance object
 */
function generateLunaRelationshipGuidance(sign, house, aspectComplexes) {
  const wound = getCompatibilityWound(sign);
  const breakPattern = getBreakPattern(house);
  const healingPattern = getHealingPattern(house);

  // Opening recognition
  const openings = [
    `I notice you're navigating the territory of Saturn in the ${getHouseLabel(house)}.`,
    `This is where your relationship patterns live — and where your deepest growth happens.`,
    `Let's explore what ${sign} Saturn in house ${house} brings to your partnerships.`
  ];

  // Validation statements
  const validations = [
    `It makes sense that ${wound.toLowerCase()} This is your Saturn signature in relationships.`,
    `Your tendency toward ${breakPattern.toLowerCase()} is a protective response — not a flaw.`,
    `Many people with this placement feel the same way. You're not alone in this.`
  ];

  // Reframe statements
  const reframes = [
    `What if this pattern is actually teaching you about ${healingPattern.toLowerCase()}?`,
    `Your Saturn placement is developing your capacity for mature, lasting intimacy.`,
    `The struggle here is the curriculum — and you're learning exactly what you need.`
  ];

  // Practical suggestions
  const practices = [
    `Practice: ${healingPattern}`,
    `When triggered, pause and name what you're feeling before reacting.`,
    `Notice when you're expecting your partner to carry something that's yours to hold.`
  ];

  // Aspect-specific guidance
  const aspectGuidance = aspectComplexes.map(complex => {
    const modifier = getAspectRelationalModifier(`${complex.planet}-Saturn`);
    if (modifier) {
      return `With ${complex.planet}-Saturn, remember: ${modifier.relationalGift.toLowerCase()} is your earned gift.`;
    }
    return null;
  }).filter(Boolean);

  return {
    openings,
    validations,
    reframes,
    practices,
    aspectGuidance,
    closingAffirmation: `Your Saturn placement is not a limitation — it's the doorway to authentic intimacy. The work you do here ripples through all your relationships.`
  };
}

/**
 * Get house label for narrative
 * @param {number} house - House number
 * @returns {string} House label
 */
function getHouseLabel(house) {
  const labels = {
    1: 'first house — identity and presence',
    2: 'second house — worth and resources',
    3: 'third house — communication and understanding',
    4: 'fourth house — home and emotional foundation',
    5: 'fifth house — creativity and romance',
    6: 'sixth house — service and daily life',
    7: 'seventh house — partnership and commitment',
    8: 'eighth house — intimacy and transformation',
    9: 'ninth house — meaning and growth',
    10: 'tenth house — career and public life',
    11: 'eleventh house — community and belonging',
    12: 'twelfth house — spirituality and transcendence'
  };
  return labels[house] || `house ${house}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get quick relationship summary
 * @param {string} sign - Saturn sign
 * @param {number} house - Saturn house
 * @returns {Object} Quick summary
 */
export function getRelationshipQuickSummary(sign, house) {
  return {
    projection: getProjectionPattern(house),
    wound: getCompatibilityWound(sign),
    contract: getPartnershipContract(house),
    breakPattern: getBreakPattern(house),
    healingPath: getHealingPattern(house)
  };
}

/**
 * Check if a trigger matches user input
 * @param {string} message - User message
 * @param {number} house - Saturn house
 * @returns {Object|null} Matched trigger or null
 */
export function detectRelationalTrigger(message, house) {
  const triggers = getRelationalTriggers(house);
  const lowerMessage = message.toLowerCase();

  for (const trigger of triggers) {
    // Simple keyword matching
    const keywords = trigger.toLowerCase().split(' ').filter(w => w.length > 4);
    const matchCount = keywords.filter(kw => lowerMessage.includes(kw)).length;

    if (matchCount >= 2) {
      return {
        trigger,
        house,
        breakPattern: getBreakPattern(house),
        healingPattern: getHealingPattern(house)
      };
    }
  }

  return null;
}

/**
 * Generate relationship insight for a specific aspect
 * @param {string} aspectKey - Aspect key (e.g., "Moon-Saturn")
 * @returns {Object|null} Relationship insight
 */
export function getAspectRelationshipInsight(aspectKey) {
  const modifier = getAspectRelationalModifier(aspectKey);
  if (!modifier) return null;

  return {
    aspect: aspectKey,
    ...modifier,
    summary: `${aspectKey} brings ${modifier.relationalWound.toLowerCase()}, but develops ${modifier.relationalGift.toLowerCase()}.`
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  buildSaturnRelationshipDynamics,
  getRelationshipQuickSummary,
  detectRelationalTrigger,
  getAspectRelationshipInsight,
  // Re-export data access
  getProjectionPattern,
  getCompatibilityWound,
  getPartnershipContract,
  getBreakPattern,
  getHealingPattern,
  getRelationalTriggers,
  getAspectRelationalModifier
};
