/**
 * ============================================
 * ARCHETYPE COMPATIBILITY CALCULATOR
 * Calculate compatibility between personality archetypes
 * ============================================
 */

import { PERSONALITY_ARCHETYPES } from '../data/personalityArchetypes'
import {
  generateCompatibilityMatrix,
  getCompatibilityScore,
  getCompatibilityLevel,
  getCompatibilityAdvice
} from '../data/compatibilityMatrix'

/**
 * Pre-generate the compatibility matrix on module load
 * This is cached for performance
 */
const ARCHETYPE_LIST = Object.values(PERSONALITY_ARCHETYPES)
const COMPATIBILITY_MATRIX = generateCompatibilityMatrix(ARCHETYPE_LIST)

console.log('[archetypeCompatibility] Compatibility matrix generated:', {
  archetypeCount: ARCHETYPE_LIST.length,
  combinations: ARCHETYPE_LIST.length * ARCHETYPE_LIST.length
})

/**
 * Calculate full compatibility between two archetypes
 *
 * @param {Object} archetype1 - First archetype object
 * @param {Object} archetype2 - Second archetype object
 * @returns {Object} Complete compatibility analysis
 */
export function calculateArchetypeCompatibility(archetype1, archetype2) {
  if (!archetype1 || !archetype2) {
    console.error('[archetypeCompatibility] Missing archetype data')
    return null
  }

  // Get base compatibility score
  const score = getCompatibilityScore(archetype1.id, archetype2.id, COMPATIBILITY_MATRIX)

  // Get level and metadata
  const { level, emoji, color } = getCompatibilityLevel(score)

  // Get advice
  const advice = getCompatibilityAdvice(score, archetype1.name, archetype2.name)

  // Analyze elemental dynamics
  const elementalDynamics = analyzeElementalDynamics(archetype1, archetype2)

  return {
    score,
    level,
    emoji,
    color,
    archetype1: {
      id: archetype1.id,
      name: archetype1.name,
      symbol: archetype1.symbol,
      dominantElement: archetype1.dominantElement,
      secondaryElement: archetype1.secondaryElement
    },
    archetype2: {
      id: archetype2.id,
      name: archetype2.name,
      symbol: archetype2.symbol,
      dominantElement: archetype2.dominantElement,
      secondaryElement: archetype2.secondaryElement
    },
    elementalDynamics,
    advice
  }
}

/**
 * Analyze the elemental dynamics between two archetypes
 */
function analyzeElementalDynamics(archetype1, archetype2) {
  const el1 = archetype1.dominantElement
  const el2 = archetype2.dominantElement

  // Production cycle relationships
  const productionCycle = {
    Wood: 'Fire',
    Fire: 'Earth',
    Earth: 'Metal',
    Metal: 'Water',
    Water: 'Wood'
  }

  // Control cycle relationships
  const controlCycle = {
    Wood: 'Earth',
    Earth: 'Water',
    Water: 'Fire',
    Fire: 'Metal',
    Metal: 'Wood'
  }

  let relationship = 'neutral'
  let description = ''

  // Check if same element
  if (el1 === el2) {
    relationship = 'same'
    description = `Both ${el1} - Similar energies that understand each other but may compete`
  }
  // Check production cycle (nurturing)
  else if (productionCycle[el1] === el2) {
    relationship = 'production'
    description = `${el1} nourishes ${el2} - ${archetype1.name} supports ${archetype2.name}'s growth`
  }
  else if (productionCycle[el2] === el1) {
    relationship = 'supported'
    description = `${el2} nourishes ${el1} - ${archetype2.name} supports ${archetype1.name}'s growth`
  }
  // Check control cycle (challenging)
  else if (controlCycle[el1] === el2) {
    relationship = 'controlling'
    description = `${el1} controls ${el2} - ${archetype1.name} may dominate ${archetype2.name}`
  }
  else if (controlCycle[el2] === el1) {
    relationship = 'controlled'
    description = `${el2} controls ${el1} - ${archetype2.name} may dominate ${archetype1.name}`
  }

  return {
    type: relationship,
    description,
    element1: el1,
    element2: el2
  }
}

/**
 * Get compatibility between two archetype IDs
 * Convenience function for quick lookups
 */
export function getQuickCompatibility(archetypeId1, archetypeId2) {
  const score = getCompatibilityScore(archetypeId1, archetypeId2, COMPATIBILITY_MATRIX)
  const { level, emoji } = getCompatibilityLevel(score)

  return {
    score,
    level,
    emoji
  }
}

/**
 * Find best matches for an archetype
 *
 * @param {Object} archetype - Archetype to find matches for
 * @param {number} topN - Number of top matches to return (default: 5)
 * @returns {Array} Array of compatibility objects sorted by score
 */
export function findBestMatches(archetype, topN = 5) {
  if (!archetype) return []

  const matches = ARCHETYPE_LIST
    .filter(other => other.id !== archetype.id) // Exclude self
    .map(other => {
      const score = getCompatibilityScore(archetype.id, other.id, COMPATIBILITY_MATRIX)
      const { level, emoji } = getCompatibilityLevel(score)

      return {
        archetype: other,
        score,
        level,
        emoji
      }
    })
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, topN) // Take top N

  return matches
}

/**
 * Find most challenging matches for an archetype
 */
export function findMostChallenging(archetype, topN = 5) {
  if (!archetype) return []

  const matches = ARCHETYPE_LIST
    .filter(other => other.id !== archetype.id)
    .map(other => {
      const score = getCompatibilityScore(archetype.id, other.id, COMPATIBILITY_MATRIX)
      const { level, emoji } = getCompatibilityLevel(score)

      return {
        archetype: other,
        score,
        level,
        emoji
      }
    })
    .sort((a, b) => a.score - b.score) // Sort by score ascending
    .slice(0, topN)

  return matches
}

/**
 * Get all compatibility scores for an archetype
 * Useful for visualization/charts
 */
export function getAllCompatibilityScores(archetypeId) {
  if (!COMPATIBILITY_MATRIX[archetypeId]) {
    console.error('[archetypeCompatibility] Invalid archetype ID:', archetypeId)
    return null
  }

  return COMPATIBILITY_MATRIX[archetypeId]
}

/**
 * Get compatibility distribution statistics
 */
export function getCompatibilityStats(archetypeId) {
  const scores = getAllCompatibilityScores(archetypeId)
  if (!scores) return null

  const scoreArray = Object.values(scores).filter(score => score !== scores[archetypeId]) // Exclude self

  const total = scoreArray.length
  const sum = scoreArray.reduce((a, b) => a + b, 0)
  const average = sum / total

  const sorted = [...scoreArray].sort((a, b) => b - a)
  const highest = sorted[0]
  const lowest = sorted[sorted.length - 1]

  // Count by level
  const cosmic = scoreArray.filter(s => s >= 90).length
  const excellent = scoreArray.filter(s => s >= 80 && s < 90).length
  const good = scoreArray.filter(s => s >= 70 && s < 80).length
  const compatible = scoreArray.filter(s => s >= 60 && s < 70).length
  const neutral = scoreArray.filter(s => s >= 50 && s < 60).length
  const challenging = scoreArray.filter(s => s >= 40 && s < 50).length
  const difficult = scoreArray.filter(s => s < 40).length

  return {
    average: Math.round(average),
    highest,
    lowest,
    distribution: {
      cosmic,
      excellent,
      good,
      compatible,
      neutral,
      challenging,
      difficult
    }
  }
}
