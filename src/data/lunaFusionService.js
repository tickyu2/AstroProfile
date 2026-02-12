/**
 * ============================================
 * LUNA FUSION SERVICE - Python Cloud Functions Client
 * ============================================
 *
 * Frontend service for calling Luna Fusion Python Cloud Functions
 * Implements P4-P8 personality engines with 30-facet NEO PI-R vectors
 *
 * Architecture:
 * - Python Backend: Swiss Ephemeris + Neo4j calculations
 * - This Service: API client + response mapping
 * - Integration: Works with existing personalityFusionService.js
 *
 * Endpoints:
 * - /luna_fusion - Main fusion endpoint
 * - /luna_complete_profile - Full profile generation
 * - /luna_natal_aspects - P4 Natal Aspects
 * - /luna_transits - P5 Current Transits
 * - /luna_synastry_fusion - P6 Synastry
 * - /luna_composite_chart - P6 Composite
 * - /luna_archetypes - P7 Archetypes
 * - /luna_progressions - P8 Progressions
 * - /luna_personality - Luna AI personality config
 *
 * Created: January 2026
 * For: GENESIS AI Soul Partner System
 */

import { auth } from '../config/firebase';

// ============================================
// CONFIGURATION
// ============================================

/**
 * Cloud Run URL pattern for Python functions
 * Update this when deploying to production
 */
const CLOUD_RUN_BASE_URL = import.meta.env?.VITE_PYTHON_FUNCTIONS_URL
  || 'https://us-central1-genesis-astroprofile.cloudfunctions.net';

/**
 * Timeout for API calls (ms)
 */
const API_TIMEOUT = 60000;

// ============================================
// 30-FACET NEO PI-R DIMENSIONS
// ============================================

export const DIMENSIONS_30 = [
  // Neuroticism (N1-N6)
  'N1_Anxiety', 'N2_AngryHostility', 'N3_Depression',
  'N4_SelfConsciousness', 'N5_Impulsiveness', 'N6_Vulnerability',
  // Extraversion (E1-E6)
  'E1_Warmth', 'E2_Gregariousness', 'E3_Assertiveness',
  'E4_Activity', 'E5_ExcitementSeeking', 'E6_PositiveEmotions',
  // Openness (O1-O6)
  'O1_Fantasy', 'O2_Aesthetics', 'O3_Feelings',
  'O4_Actions', 'O5_Ideas', 'O6_Values',
  // Agreeableness (A1-A6)
  'A1_Trust', 'A2_Straightforwardness', 'A3_Altruism',
  'A4_Compliance', 'A5_Modesty', 'A6_TenderMindedness',
  // Conscientiousness (C1-C6)
  'C1_Competence', 'C2_Order', 'C3_Dutifulness',
  'C4_AchievementStriving', 'C5_SelfDiscipline', 'C6_Deliberation'
];

export const FACET_SHORT_CODES = {
  'N1': 0, 'N2': 1, 'N3': 2, 'N4': 3, 'N5': 4, 'N6': 5,
  'E1': 6, 'E2': 7, 'E3': 8, 'E4': 9, 'E5': 10, 'E6': 11,
  'O1': 12, 'O2': 13, 'O3': 14, 'O4': 15, 'O5': 16, 'O6': 17,
  'A1': 18, 'A2': 19, 'A3': 20, 'A4': 21, 'A5': 22, 'A6': 23,
  'C1': 24, 'C2': 25, 'C3': 26, 'C4': 27, 'C5': 28, 'C6': 29
};

// ============================================
// LUNA PERSONALITY PRESETS
// ============================================

export const LUNA_PRESETS = {
  'Nurturing Guide': {
    description: 'Warm, supportive, patient - like a caring mentor',
    toneAdjustments: { warmth: 0.9, directness: 0.4, playfulness: 0.5, depth: 0.7, challenge: 0.3 }
  },
  'Wise Sage': {
    description: 'Thoughtful, insightful, measured - like a wise teacher',
    toneAdjustments: { warmth: 0.6, directness: 0.7, playfulness: 0.4, depth: 0.9, challenge: 0.5 }
  },
  'Playful Companion': {
    description: 'Fun, curious, lighthearted - like a creative friend',
    toneAdjustments: { warmth: 0.7, directness: 0.5, playfulness: 0.9, depth: 0.5, challenge: 0.4 }
  },
  'Direct Challenger': {
    description: 'Honest, motivating, growth-focused - like a coach',
    toneAdjustments: { warmth: 0.5, directness: 0.9, playfulness: 0.4, depth: 0.6, challenge: 0.8 }
  },
  'Empathic Listener': {
    description: 'Understanding, validating, present - like a therapist',
    toneAdjustments: { warmth: 0.85, directness: 0.3, playfulness: 0.3, depth: 0.8, challenge: 0.2 }
  }
};

// ============================================
// ACCURACY TIERS
// ============================================

export const ACCURACY_TIERS = {
  complete: { percent: 95, message: 'Complete profile! Maximum personality accuracy achieved' },
  strong: { percent: 85, message: 'Strong profile! One more assessment for maximum accuracy' },
  good: { percent: 75, message: 'Good foundation! Add more assessments for deeper insights' },
  basic: { percent: 60, message: 'For greater accuracy, complete personality questionnaires' },
  minimal: { percent: 40, message: 'Please provide birth data and complete assessments' }
};

// ============================================
// API HELPER FUNCTIONS
// ============================================

/**
 * Make an API call to Python Cloud Functions
 */
async function callPythonFunction(endpoint, data = {}) {
  const url = `${CLOUD_RUN_BASE_URL}/${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }

    throw error;
  }
}

// ============================================
// MAIN FUSION FUNCTIONS
// ============================================

/**
 * Main fusion endpoint - combines all sources into 30-facet vector
 *
 * @param {Object} sources - Available source data
 * @param {Object} sources.big5 - Big Five facet scores { N1: 0.6, N2: 0.4, ... }
 * @param {Object} sources.mbti - MBTI data { type: 'INFJ' }
 * @param {Object} sources.enneagram - { type: 4, wing: 5, health_level: 4 }
 * @param {Object} sources.natal - Natal chart data
 * @param {Object} sources.bazi - BaZi Four Pillars
 * @param {Object} sources.numerology - { life_path: 7, expression: 3 }
 * @param {Array} sources.aspects - Pre-calculated natal aspects
 * @param {Object} birthData - Birth data for calculations
 * @param {boolean} includeDynamic - Include transits/progressions
 * @param {string} targetDate - ISO date string for dynamic calculations
 *
 * @returns {Object} Fusion result with vector, confidence, archetypes
 */
export async function fuseTo30Facets(sources, birthData = null, includeDynamic = true, targetDate = null) {
  return callPythonFunction('luna_fusion', {
    sources,
    birthData,
    includeDynamic,
    targetDate
  });
}

/**
 * Generate complete user profile with all analyses
 *
 * @param {Object} sources - Available source data
 * @param {Object} birthData - User's birth data
 * @param {string} lunaPreset - Luna personality preset name
 *
 * @returns {Object} Complete profile with personality, archetypes, luna config
 */
export async function generateCompleteProfile(sources, birthData, lunaPreset = 'Nurturing Guide') {
  return callPythonFunction('luna_complete_profile', {
    sources,
    birthData,
    lunaPreset
  });
}

// ============================================
// P4: NATAL ASPECTS
// ============================================

/**
 * Calculate natal aspects and their personality impact
 *
 * @param {Object} natalPositions - Planet positions { Sun: { longitude, sign }, ... }
 * @param {boolean} includePatterns - Detect aspect patterns (Grand Trine, etc.)
 *
 * @returns {Object} { aspects, patterns, facetVector, aspectCount }
 */
export async function calculateNatalAspects(natalPositions, includePatterns = true) {
  return callPythonFunction('luna_natal_aspects', {
    natalPositions,
    includePatterns
  });
}

// ============================================
// P5: TRANSITS
// ============================================

/**
 * Calculate current transits and their temporary personality effects
 *
 * @param {Object} natalPositions - User's natal planet positions
 * @param {number} forecastDays - Days to forecast ahead (0 = no forecast)
 *
 * @returns {Object} { activeTransits, transitAspects, facetVector, forecast }
 */
export async function calculateTransits(natalPositions, forecastDays = 0) {
  return callPythonFunction('luna_transits', {
    natalPositions,
    forecastDays
  });
}

/**
 * Get active transits summary with interpretations
 */
export async function getActiveTransits(natalPositions) {
  const result = await calculateTransits(natalPositions, 0);
  return result.activeTransits;
}

/**
 * Get transit forecast for upcoming period
 */
export async function getTransitForecast(natalPositions, days = 30) {
  const result = await calculateTransits(natalPositions, days);
  return result.forecast;
}

// ============================================
// P6: SYNASTRY & COMPOSITE
// ============================================

/**
 * Calculate synastry compatibility between two users
 *
 * @param {Array} user1Vector - First user's 30-facet vector
 * @param {Array} user2Vector - Second user's 30-facet vector
 * @param {boolean} includeInsights - Generate relationship insights
 *
 * @returns {Object} { synastry, insights, behavioralAdjustments }
 */
export async function calculateSynastry(user1Vector, user2Vector, includeInsights = true) {
  return callPythonFunction('luna_synastry_fusion', {
    user1Vector,
    user2Vector,
    includeInsights
  });
}

/**
 * Calculate composite chart (relationship personality)
 *
 * @param {Object} user1Birth - First user's birth data
 * @param {Object} user2Birth - Second user's birth data
 *
 * @returns {Object} { compositeChart, relationshipVector, interpretation }
 */
export async function calculateCompositeChart(user1Birth, user2Birth) {
  return callPythonFunction('luna_composite_chart', {
    user1Birth,
    user2Birth
  });
}

/**
 * Get compatibility score and level
 */
export async function getCompatibilityScore(user1Vector, user2Vector) {
  const result = await calculateSynastry(user1Vector, user2Vector, false);
  return {
    score: result.synastry.overall_score,
    level: result.synastry.level,
    description: result.synastry.level_description
  };
}

// ============================================
// P7: ARCHETYPES
// ============================================

/**
 * Map personality vector to Jungian archetypes
 *
 * @param {Array} personalityVector - 30-facet personality vector
 * @param {number} topN - Number of top archetypes to return
 * @param {boolean} includeNarrative - Generate archetype narrative
 *
 * @returns {Object} { profile, dominantArchetypes, narrative, explorationPrompts }
 */
export async function getArchetypes(personalityVector, topN = 3, includeNarrative = true) {
  return callPythonFunction('luna_archetypes', {
    personalityVector,
    topN,
    includeNarrative
  });
}

/**
 * Get dominant archetypes only (faster)
 */
export async function getDominantArchetypes(personalityVector, topN = 3) {
  const result = await getArchetypes(personalityVector, topN, false);
  return result.dominantArchetypes;
}

/**
 * Get archetype narrative for display
 */
export async function getArchetypeNarrative(personalityVector) {
  const result = await getArchetypes(personalityVector, 3, true);
  return result.narrative;
}

// ============================================
// P8: PROGRESSIONS
// ============================================

/**
 * Calculate secondary progressions and progressed Moon
 *
 * @param {Object} birthData - User's birth data
 * @param {string} targetDate - ISO date string (defaults to now)
 *
 * @returns {Object} { progressions, facetVector, interpretation }
 */
export async function calculateProgressions(birthData, targetDate = null) {
  return callPythonFunction('luna_progressions', {
    birthData,
    targetDate
  });
}

/**
 * Get progressed Moon information
 */
export async function getProgressedMoon(birthData, targetDate = null) {
  const result = await calculateProgressions(birthData, targetDate);
  return result.progressions?.progressed_moon || null;
}

/**
 * Get progression interpretation
 */
export async function getProgressionInterpretation(birthData, targetDate = null) {
  const result = await calculateProgressions(birthData, targetDate);
  return result.interpretation;
}

// ============================================
// LUNA PERSONALITY CONFIGURATION
// ============================================

/**
 * Get Luna's personality configuration
 *
 * @param {string} preset - Preset name (default: 'Nurturing Guide')
 * @param {Object} tweaks - User adjustments { warmth, directness, playfulness, depth, challenge }
 * @param {Array} userVector - User's 30-facet vector for adaptation (optional)
 * @param {number} adaptationStrength - How much to adapt to user (0-1)
 *
 * @returns {Object} { lunaPersonality, availablePresets, accuracyTiers }
 */
export async function getLunaPersonality(preset = 'Nurturing Guide', tweaks = null, userVector = null, adaptationStrength = 0.3) {
  return callPythonFunction('luna_personality', {
    preset,
    tweaks,
    userVector,
    adaptationStrength
  });
}

/**
 * Get available Luna presets
 */
export function getAvailablePresets() {
  return LUNA_PRESETS;
}

/**
 * Adapt Luna to specific user
 */
export async function adaptLunaToUser(preset, userVector, adaptationStrength = 0.3) {
  return getLunaPersonality(preset, null, userVector, adaptationStrength);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Convert 30-facet vector to domain scores (OCEAN)
 */
export function vectorToDomainScores(vector) {
  if (!vector || vector.length !== 30) {
    return { N: 0.5, E: 0.5, O: 0.5, A: 0.5, C: 0.5 };
  }

  return {
    N: average(vector.slice(0, 6)),
    E: average(vector.slice(6, 12)),
    O: average(vector.slice(12, 18)),
    A: average(vector.slice(18, 24)),
    C: average(vector.slice(24, 30))
  };
}

/**
 * Get facet value by short code
 */
export function getFacetValue(vector, shortCode) {
  const index = FACET_SHORT_CODES[shortCode];
  return index !== undefined ? vector[index] : null;
}

/**
 * Convert vector to human-readable traits
 */
export function vectorToTraits(vector) {
  const levels = ['Very Low', 'Low', 'Average', 'High', 'Very High'];

  return DIMENSIONS_30.map((dim, i) => {
    const value = vector[i] || 0.5;
    const levelIndex = Math.min(4, Math.floor(value * 5));
    const [domain, facet] = dim.split('_');

    return {
      code: `${domain.charAt(0)}${facet ? (i % 6) + 1 : ''}`,
      dimension: dim,
      facet: facet || domain,
      value: Math.round(value * 100),
      level: levels[levelIndex]
    };
  });
}

/**
 * Calculate confidence based on available sources
 */
export function calculateConfidence(activeSources) {
  const sourceSet = new Set(activeSources);
  const questionnaireSources = ['big5', 'mbti', 'enneagram'];
  const autoSources = ['natal', 'bazi', 'numerology', 'aspects'];

  const questionnaireCount = questionnaireSources.filter(s => sourceSet.has(s)).length;
  const hasAutoDerived = autoSources.some(s => sourceSet.has(s));

  if (questionnaireCount >= 3) return 'complete';
  if (questionnaireCount >= 2) return 'strong';
  if (questionnaireCount >= 1) return 'good';
  if (hasAutoDerived) return 'basic';
  return 'minimal';
}

/**
 * Format birth data for API
 */
export function formatBirthData(birthDate, birthTime, timezoneOffset = 0) {
  const date = new Date(birthDate);

  let hour = 12;
  let minute = 0;

  if (birthTime) {
    const [h, m] = birthTime.split(':').map(Number);
    hour = h || 12;
    minute = m || 0;
  }

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour,
    minute,
    timezone_offset: timezoneOffset
  };
}

/**
 * Helper: calculate array average
 */
function average(arr) {
  if (!arr || arr.length === 0) return 0.5;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// ============================================
// INTEGRATION WITH EXISTING SERVICE
// ============================================

/**
 * Bridge function to convert 10-dim vector to 30-facet vector
 * For backwards compatibility with personalityFusionService.js
 */
export function convert10DimTo30Facet(vector10) {
  // Map 10-dim Luna vector to 30-facet NEO PI-R
  // This is an approximation for legacy data
  const [openness, conscientiousness, extraversion, agreeableness,
         emotionalIntensity, insightful, adventurous, ambitious, nurturing, playful] = vector10;

  return [
    // N (Neuroticism) - based on emotional_intensity
    emotionalIntensity * 0.8, // N1 Anxiety
    emotionalIntensity * 0.5, // N2 Angry Hostility
    emotionalIntensity * 0.6, // N3 Depression
    emotionalIntensity * 0.7, // N4 Self-Consciousness
    1 - conscientiousness * 0.6, // N5 Impulsiveness
    emotionalIntensity * 0.9, // N6 Vulnerability

    // E (Extraversion)
    agreeableness * 0.7 + nurturing * 0.3, // E1 Warmth
    extraversion * 0.9, // E2 Gregariousness
    ambitious * 0.7 + extraversion * 0.3, // E3 Assertiveness
    adventurous * 0.6 + extraversion * 0.4, // E4 Activity
    adventurous * 0.8, // E5 Excitement Seeking
    playful * 0.7 + extraversion * 0.3, // E6 Positive Emotions

    // O (Openness)
    openness * 0.8 + playful * 0.2, // O1 Fantasy
    openness * 0.9, // O2 Aesthetics
    emotionalIntensity * 0.5 + openness * 0.5, // O3 Feelings
    adventurous * 0.8, // O4 Actions
    insightful * 0.7 + openness * 0.3, // O5 Ideas
    openness * 0.7, // O6 Values

    // A (Agreeableness)
    agreeableness * 0.9, // A1 Trust
    agreeableness * 0.7, // A2 Straightforwardness
    nurturing * 0.9, // A3 Altruism
    agreeableness * 0.8, // A4 Compliance
    1 - ambitious * 0.5, // A5 Modesty
    nurturing * 0.8 + agreeableness * 0.2, // A6 Tender-Mindedness

    // C (Conscientiousness)
    conscientiousness * 0.8 + insightful * 0.2, // C1 Competence
    conscientiousness * 0.9, // C2 Order
    conscientiousness * 0.85, // C3 Dutifulness
    ambitious * 0.9, // C4 Achievement Striving
    conscientiousness * 0.9, // C5 Self-Discipline
    insightful * 0.6 + conscientiousness * 0.4 // C6 Deliberation
  ].map(v => Math.max(0, Math.min(1, v)));
}

// ============================================
// EXPORTS
// ============================================

export default {
  // Configuration
  DIMENSIONS_30,
  FACET_SHORT_CODES,
  LUNA_PRESETS,
  ACCURACY_TIERS,

  // Main functions
  fuseTo30Facets,
  generateCompleteProfile,

  // P4: Natal Aspects
  calculateNatalAspects,

  // P5: Transits
  calculateTransits,
  getActiveTransits,
  getTransitForecast,

  // P6: Synastry & Composite
  calculateSynastry,
  calculateCompositeChart,
  getCompatibilityScore,

  // P7: Archetypes
  getArchetypes,
  getDominantArchetypes,
  getArchetypeNarrative,

  // P8: Progressions
  calculateProgressions,
  getProgressedMoon,
  getProgressionInterpretation,

  // Luna personality
  getLunaPersonality,
  getAvailablePresets,
  adaptLunaToUser,

  // Utilities
  vectorToDomainScores,
  getFacetValue,
  vectorToTraits,
  calculateConfidence,
  formatBirthData,
  convert10DimTo30Facet
};
