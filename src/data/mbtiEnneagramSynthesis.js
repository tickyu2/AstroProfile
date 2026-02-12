/**
 * MBTI + Enneagram Synthesis Engine
 *
 * Pre-made interpretations for personality combinations.
 * Used by Cathedral Analysis and Luna for complete understanding.
 *
 * Structure:
 * - 144 total combinations (16 MBTI x 9 Enneagram)
 * - Priority 1: 36 most common (implemented first)
 * - Priority 2: 60 less common (implement later)
 * - Priority 3: 48 rare (generate on-the-fly)
 *
 * Part of GENESIS OS - Cathedral Analysis
 * Created: December 29, 2024
 */

import { intuitivesData } from './mbtiEnneagram/intuitivesData.js';
import { sensorsData } from './mbtiEnneagram/sensorsData.js';

// ============================================
// DATA STRUCTURE
// ============================================

export const MBTI_ENNEAGRAM_SYNTHESIS = {
  ...intuitivesData,
  ...sensorsData
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get complete synthesis for MBTI + Enneagram combination
 * @param {string} mbti - MBTI type (e.g., "INFP")
 * @param {number} enneagram - Enneagram type (1-9)
 * @returns {object|null} Synthesis object or null if not found
 */
export function getSynthesis(mbti, enneagram) {
  if (!mbti || !enneagram) {
    return null;
  }

  const mbtiUpper = mbti.toUpperCase();

  if (!MBTI_ENNEAGRAM_SYNTHESIS[mbtiUpper]) {
    console.warn(`MBTI type "${mbti}" not found in synthesis database`);
    return null;
  }

  const synthesis = MBTI_ENNEAGRAM_SYNTHESIS[mbtiUpper][enneagram];

  if (!synthesis) {
    // Return basic fallback for unimplemented combinations
    return {
      archetype: `${mbtiUpper} + Type ${enneagram}`,
      synthesis: `You are an ${mbtiUpper} with Type ${enneagram} core motivation.`,
      note: "This is a less common pairing. Luna will provide personalized insights based on your complete profile.",
      implemented: false
    };
  }

  return {
    ...synthesis,
    implemented: true
  };
}

/**
 * Get Luna's communication approach for this combination
 * @param {string} mbti - MBTI type
 * @param {number} enneagram - Enneagram type
 * @returns {object|null} Luna approach object
 */
export function getLunaGuidance(mbti, enneagram) {
  const synthesis = getSynthesis(mbti, enneagram);
  if (!synthesis || !synthesis.implemented) {
    return null;
  }
  return synthesis.luna_approach || null;
}

/**
 * Get strengths for this combination
 * @param {string} mbti - MBTI type
 * @param {number} enneagram - Enneagram type
 * @returns {array} Array of strength descriptions
 */
export function getStrengths(mbti, enneagram) {
  const synthesis = getSynthesis(mbti, enneagram);
  return synthesis?.strengths || [];
}

/**
 * Get challenges for this combination
 * @param {string} mbti - MBTI type
 * @param {number} enneagram - Enneagram type
 * @returns {array} Array of challenge descriptions
 */
export function getChallenges(mbti, enneagram) {
  const synthesis = getSynthesis(mbti, enneagram);
  return synthesis?.challenges || [];
}

/**
 * Get growth path for this combination
 * @param {string} mbti - MBTI type
 * @param {number} enneagram - Enneagram type
 * @returns {object|null} Growth path object
 */
export function getGrowthPath(mbti, enneagram) {
  const synthesis = getSynthesis(mbti, enneagram);
  return synthesis?.growth_path || null;
}

/**
 * Get famous examples for this combination
 * @param {string} mbti - MBTI type
 * @param {number} enneagram - Enneagram type
 * @returns {array} Array of famous examples
 */
export function getFamousExamples(mbti, enneagram) {
  const synthesis = getSynthesis(mbti, enneagram);
  return synthesis?.famous_examples || [];
}

/**
 * Get relationship style for this combination
 * @param {string} mbti - MBTI type
 * @param {number} enneagram - Enneagram type
 * @returns {object|null} Relationship style object
 */
export function getRelationshipStyle(mbti, enneagram) {
  const synthesis = getSynthesis(mbti, enneagram);
  return synthesis?.relationship_style || null;
}

/**
 * Get career fits for this combination
 * @param {string} mbti - MBTI type
 * @param {number} enneagram - Enneagram type
 * @returns {object|null} Career fits object
 */
export function getCareerFits(mbti, enneagram) {
  const synthesis = getSynthesis(mbti, enneagram);
  return synthesis?.career_fits || null;
}

/**
 * Check if combination is implemented
 * @param {string} mbti - MBTI type
 * @param {number} enneagram - Enneagram type
 * @returns {boolean} True if fully implemented
 */
export function isImplemented(mbti, enneagram) {
  const synthesis = getSynthesis(mbti, enneagram);
  return synthesis?.implemented || false;
}

/**
 * Get all implemented combinations
 * @returns {array} Array of {mbti, enneagram, archetype} objects
 */
export function getImplementedCombinations() {
  const combinations = [];

  Object.keys(MBTI_ENNEAGRAM_SYNTHESIS).forEach(mbti => {
    const mbtiEntry = MBTI_ENNEAGRAM_SYNTHESIS[mbti];
    if (mbtiEntry && typeof mbtiEntry === 'object') {
      Object.keys(mbtiEntry).forEach(enneagram => {
        if (mbtiEntry[enneagram] && mbtiEntry[enneagram].archetype) {
          combinations.push({
            mbti,
            enneagram: parseInt(enneagram),
            archetype: mbtiEntry[enneagram].archetype
          });
        }
      });
    }
  });

  return combinations;
}

/**
 * Get implementation statistics
 * @returns {object} Stats about implementation progress
 */
export function getImplementationStats() {
  const implemented = getImplementedCombinations();
  const priority1Total = 36;
  const totalPossible = 144;

  return {
    implemented: implemented.length,
    priority1Total,
    totalPossible,
    priority1Progress: `${implemented.length}/${priority1Total}`,
    totalProgress: `${implemented.length}/${totalPossible}`,
    percentComplete: Math.round((implemented.length / priority1Total) * 100),
    combinations: implemented
  };
}

// Export default
export default {
  MBTI_ENNEAGRAM_SYNTHESIS,
  getSynthesis,
  getLunaGuidance,
  getStrengths,
  getChallenges,
  getGrowthPath,
  getFamousExamples,
  getRelationshipStyle,
  getCareerFits,
  isImplemented,
  getImplementedCombinations,
  getImplementationStats
};
