/**
 * constitutionalCalculator.js
 * Constitutional Assessment Integration Algorithm
 *
 * Combines birth data foundation (40%) with lived expression (60%)
 * to calculate the True Constitutional Soul Signature.
 *
 * Part of GENESIS - Constitutional Assessment System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 14, 2024
 */

// Element relationships from Chinese Five Elements theory
const ELEMENT_RELATIONSHIPS = {
  // Production cycle (generates)
  generates: {
    Wood: 'Fire',
    Fire: 'Earth',
    Earth: 'Metal',
    Metal: 'Water',
    Water: 'Wood'
  },
  // Control cycle (controls)
  controls: {
    Wood: 'Earth',
    Fire: 'Metal',
    Earth: 'Water',
    Metal: 'Wood',
    Water: 'Fire'
  }
};

// Map Chinese elements to constitutional elements
const CHINESE_ELEMENT_MAP = {
  'Wood': 'Wood',
  'Fire': 'Fire',
  'Earth': 'Earth',
  'Metal': 'Metal',
  'Water': 'Water',
  // Handle variations
  'Yang Wood': 'Wood',
  'Yin Wood': 'Wood',
  'Yang Fire': 'Fire',
  'Yin Fire': 'Fire',
  'Yang Earth': 'Earth',
  'Yin Earth': 'Earth',
  'Yang Metal': 'Metal',
  'Yin Metal': 'Metal',
  'Yang Water': 'Water',
  'Yin Water': 'Water'
};

// Map Western zodiac elements
const WESTERN_ELEMENT_MAP = {
  'Aries': 'Fire',
  'Leo': 'Fire',
  'Sagittarius': 'Fire',
  'Taurus': 'Earth',
  'Virgo': 'Earth',
  'Capricorn': 'Earth',
  'Gemini': 'Metal', // Air mapped to Metal (clarity, communication)
  'Libra': 'Metal',
  'Aquarius': 'Metal',
  'Cancer': 'Water',
  'Scorpio': 'Water',
  'Pisces': 'Water'
};

/**
 * Analyze questionnaire responses to determine elemental pattern
 * @param {Array} responses - Array of { questionId, element } objects
 * @returns {Object} - Element scores and dominant pattern
 */
export function analyzeQuestionnairePattern(responses) {
  const elementScores = { Fire: 0, Earth: 0, Metal: 0, Water: 0, Wood: 0 };

  // Count responses per element
  responses.forEach(response => {
    if (response.element && elementScores.hasOwnProperty(response.element)) {
      elementScores[response.element] += 1;
    }
  });

  // Find dominant and secondary elements
  const sortedElements = Object.entries(elementScores)
    .sort((a, b) => b[1] - a[1]);

  const dominant = sortedElements[0][0];
  const secondary = sortedElements[1][0];
  const dominantScore = sortedElements[0][1];
  const secondaryScore = sortedElements[1][1];

  // Calculate consistency (how strongly one element dominates)
  const totalResponses = responses.length;
  const consistency = totalResponses > 0
    ? Math.round((dominantScore / totalResponses) * 100)
    : 0;

  return {
    dominant,
    secondary,
    scores: elementScores,
    consistency,
    sortedElements
  };
}

/**
 * Extract elemental foundation from birth data
 * @param {Object} birthData - User's constitutional profile from AstroProfile
 * @returns {Object} - Birth-based elemental foundation
 */
export function extractBirthFoundation(birthData) {
  const elements = { Fire: 0, Earth: 0, Metal: 0, Water: 0, Wood: 0 };

  // Extract from Chinese zodiac
  const chineseElement = birthData?.constitutional_identity?.chinese?.element;
  if (chineseElement) {
    const mappedElement = CHINESE_ELEMENT_MAP[chineseElement] || chineseElement;
    if (elements.hasOwnProperty(mappedElement)) {
      elements[mappedElement] += 2; // Chinese element has strong weight
    }
  }

  // Extract from BaZi Day Master
  const dayMaster = birthData?.constitutional_identity?.bazi?.day_master;
  if (dayMaster) {
    const mappedElement = CHINESE_ELEMENT_MAP[dayMaster];
    if (mappedElement && elements.hasOwnProperty(mappedElement)) {
      elements[mappedElement] += 3; // Day Master is core identity
    }
  }

  // Extract from Western zodiac
  const westernSign = birthData?.constitutional_identity?.western?.sun;
  if (westernSign) {
    const mappedElement = WESTERN_ELEMENT_MAP[westernSign];
    if (mappedElement && elements.hasOwnProperty(mappedElement)) {
      elements[mappedElement] += 1; // Western adds nuance
    }
  }

  // Find dominant from birth data
  const sortedElements = Object.entries(elements)
    .sort((a, b) => b[1] - a[1]);

  return {
    elements,
    dominant: sortedElements[0][0],
    secondary: sortedElements[1][0],
    sortedElements
  };
}

/**
 * Calculate Full Constitutional Profile
 * Integrates birth foundation (40%) with lived expression (60%)
 *
 * @param {Object} birthData - User's birth data from AstroProfile
 * @param {Array} questionnaireResponses - Array of questionnaire responses
 * @returns {Object} - Complete constitutional profile
 */
export function calculateFullConstitution(birthData, questionnaireResponses) {
  // Phase 1: Birth Foundation (40% weight)
  const birthFoundation = extractBirthFoundation(birthData);

  // Phase 2: Lived Expression from questionnaire (60% weight)
  const expressionPattern = analyzeQuestionnairePattern(questionnaireResponses);

  // Integrate: Calculate weighted elemental balance
  const integratedElements = { Fire: 0, Earth: 0, Metal: 0, Water: 0, Wood: 0 };

  // Apply weights
  const BIRTH_WEIGHT = 0.4;
  const EXPRESSION_WEIGHT = 0.6;

  // Normalize birth foundation scores
  const birthTotal = Object.values(birthFoundation.elements).reduce((a, b) => a + b, 0) || 1;

  // Normalize expression scores
  const expressionTotal = Object.values(expressionPattern.scores).reduce((a, b) => a + b, 0) || 1;

  // Combine with weights
  Object.keys(integratedElements).forEach(element => {
    const birthScore = (birthFoundation.elements[element] / birthTotal) * BIRTH_WEIGHT;
    const expressionScore = (expressionPattern.scores[element] / expressionTotal) * EXPRESSION_WEIGHT;
    integratedElements[element] = birthScore + expressionScore;
  });

  // Find true constitutional pattern
  const sortedIntegrated = Object.entries(integratedElements)
    .sort((a, b) => b[1] - a[1]);

  const primaryElement = sortedIntegrated[0][0];
  const secondaryElement = sortedIntegrated[1][0];
  const tertiaryElement = sortedIntegrated[2][0];

  // Calculate alignment between birth and expression
  const alignment = calculateAlignmentScore(birthFoundation, expressionPattern);

  // Generate constitutional insights
  const insights = generateConstitutionalInsights(
    primaryElement,
    secondaryElement,
    birthFoundation,
    expressionPattern,
    alignment
  );

  return {
    // Core identity
    primary: primaryElement,
    secondary: secondaryElement,
    tertiary: tertiaryElement,

    // Detailed balance
    elements: integratedElements,
    elementPercentages: calculatePercentages(integratedElements),

    // Source data
    birthFoundation: {
      dominant: birthFoundation.dominant,
      secondary: birthFoundation.secondary,
      elements: birthFoundation.elements
    },
    livedExpression: {
      dominant: expressionPattern.dominant,
      secondary: expressionPattern.secondary,
      consistency: expressionPattern.consistency,
      scores: expressionPattern.scores
    },

    // Meta analysis
    alignment,
    insights,

    // Original data
    birthData: {
      chinese: birthData?.constitutional_identity?.chinese,
      western: birthData?.constitutional_identity?.western,
      bazi: birthData?.constitutional_identity?.bazi
    }
  };
}

/**
 * Calculate how aligned birth constitution is with lived expression
 */
function calculateAlignmentScore(birthFoundation, expressionPattern) {
  // Perfect alignment: birth dominant matches expression dominant
  const perfectMatch = birthFoundation.dominant === expressionPattern.dominant;
  const secondaryMatch = birthFoundation.secondary === expressionPattern.secondary;
  const crossMatch = birthFoundation.dominant === expressionPattern.secondary ||
                     birthFoundation.secondary === expressionPattern.dominant;

  let score = 0;
  let description = '';

  if (perfectMatch && secondaryMatch) {
    score = 100;
    description = 'Perfect Alignment - You are living fully as your birth constitution intended';
  } else if (perfectMatch) {
    score = 85;
    description = 'Strong Alignment - Your primary expression matches your birth potential';
  } else if (crossMatch) {
    score = 70;
    description = 'Complementary Expression - You express through related elemental channels';
  } else {
    // Check elemental relationship
    const generates = ELEMENT_RELATIONSHIPS.generates[birthFoundation.dominant] === expressionPattern.dominant;
    const controls = ELEMENT_RELATIONSHIPS.controls[birthFoundation.dominant] === expressionPattern.dominant;

    if (generates) {
      score = 75;
      description = 'Generative Expression - Your birth element fuels your expressed element';
    } else if (controls) {
      score = 60;
      description = 'Controlled Expression - You may be compensating or adapting';
    } else {
      score = 50;
      description = 'Adaptive Expression - Life has shaped you to express differently than birth pattern';
    }
  }

  return { score, description, perfectMatch, crossMatch };
}

/**
 * Calculate percentages from element scores
 */
function calculatePercentages(elements) {
  const total = Object.values(elements).reduce((a, b) => a + b, 0) || 1;
  const percentages = {};

  Object.keys(elements).forEach(element => {
    percentages[element] = Math.round((elements[element] / total) * 100);
  });

  return percentages;
}

/**
 * Generate personalized constitutional insights
 */
function generateConstitutionalInsights(primary, secondary, birth, expression, alignment) {
  const insights = {
    identity: generateIdentityInsight(primary, secondary),
    strength: generateStrengthInsight(primary),
    growth: generateGrowthInsight(primary, secondary),
    relationship: generateRelationshipInsight(primary, secondary),
    alignment: generateAlignmentInsight(alignment, birth, expression)
  };

  return insights;
}

function generateIdentityInsight(primary, secondary) {
  const identities = {
    'Fire-Earth': 'You are a Creative Builder - igniting visions and manifesting them into reality',
    'Fire-Metal': 'You are a Precision Pioneer - leading with both passion and strategic clarity',
    'Fire-Water': 'You are an Intuitive Catalyst - combining bold action with deep emotional intelligence',
    'Fire-Wood': 'You are a Growth Igniter - sparking expansion and nurturing potential in others',
    'Earth-Fire': 'You are a Grounded Inspirer - creating stable foundations for exciting possibilities',
    'Earth-Metal': 'You are a Quality Architect - building excellence with methodical precision',
    'Earth-Water': 'You are a Nurturing Depths - providing emotional security with intuitive wisdom',
    'Earth-Wood': 'You are a Patient Cultivator - growing lasting structures with steady persistence',
    'Metal-Fire': 'You are a Focused Visionary - channeling inspiration through strategic clarity',
    'Metal-Earth': 'You are a Refined Builder - creating quality through systematic excellence',
    'Metal-Water': 'You are a Deep Analyst - combining precision with emotional intelligence',
    'Metal-Wood': 'You are a Strategic Grower - developing potential with focused direction',
    'Water-Fire': 'You are an Emotional Pioneer - leading with intuition and passionate depth',
    'Water-Earth': 'You are a Flowing Foundation - adapting while providing steady support',
    'Water-Metal': 'You are an Intuitive Strategist - navigating complexity with precise insight',
    'Water-Wood': 'You are a Soul Gardener - nurturing growth through deep understanding',
    'Wood-Fire': 'You are an Expansive Leader - growing possibilities with inspiring energy',
    'Wood-Earth': 'You are a Rooted Developer - building steady growth on solid foundations',
    'Wood-Metal': 'You are a Directed Grower - expanding with focused intention',
    'Wood-Water': 'You are an Adaptive Nurturer - flowing with growth while staying rooted'
  };

  const key = `${primary}-${secondary}`;
  return identities[key] || `You are a ${primary}-${secondary} expression - uniquely balanced`;
}

function generateStrengthInsight(primary) {
  const strengths = {
    Fire: 'Your greatest strength is your ability to inspire and mobilize. When you speak from passion, people follow.',
    Earth: 'Your greatest strength is your grounding presence. You create safety where others can be vulnerable and grow.',
    Metal: 'Your greatest strength is your discernment. You cut through confusion to find the essential truth.',
    Water: 'Your greatest strength is your emotional depth. You understand what others cannot put into words.',
    Wood: 'Your greatest strength is your growth mindset. You see potential everywhere and nurture it into reality.'
  };

  return strengths[primary];
}

function generateGrowthInsight(primary, secondary) {
  const weakElement = ELEMENT_RELATIONSHIPS.controls[primary];

  const growthAreas = {
    Fire: `Balance your Fire with ${weakElement} qualities. Practice patience and allow things to unfold naturally.`,
    Earth: `Balance your Earth with ${weakElement} qualities. Sometimes stability needs to give way to flow.`,
    Metal: `Balance your Metal with ${weakElement} qualities. Not everything can be analyzed - trust your heart sometimes.`,
    Water: `Balance your Water with ${weakElement} qualities. Ground your intuitions in practical action.`,
    Wood: `Balance your Wood with ${weakElement} qualities. Know when to stop growing and simply be.`
  };

  return growthAreas[primary];
}

function generateRelationshipInsight(primary, secondary) {
  const compatible = ELEMENT_RELATIONSHIPS.generates[primary];
  const challenging = ELEMENT_RELATIONSHIPS.controls[primary];

  return {
    natural: `You naturally resonate with ${compatible} types - you fuel each other's energy`,
    growth: `${challenging} types challenge you to grow in important ways`,
    balance: `Your ${secondary} secondary helps you bridge to different constitutional types`
  };
}

function generateAlignmentInsight(alignment, birth, expression) {
  if (alignment.score >= 85) {
    return `You are living authentically as your ${birth.dominant} birth constitution. Trust this natural expression.`;
  } else if (alignment.score >= 70) {
    return `Your ${expression.dominant} expression complements your ${birth.dominant} birth nature. This is healthy adaptation.`;
  } else {
    return `Life has developed your ${expression.dominant} expression differently from your ${birth.dominant} birth pattern. Reconnecting with your birth element may bring greater ease.`;
  }
}

export default {
  calculateFullConstitution,
  analyzeQuestionnairePattern,
  extractBirthFoundation
};
