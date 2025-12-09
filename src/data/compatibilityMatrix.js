/**
 * ============================================
 * COMPATIBILITY MATRIX
 * 25×25 matrix of archetype compatibility scores
 * Total combinations: 625
 * ============================================
 *
 * SCORING FORMULA:
 * Compatibility = ElementalHarmony(40%) + TenGodSynergy(30%) + YinYangBalance(20%) + PercentageOptimization(10%)
 *
 * SCORE RANGES:
 * 90-100: Cosmic Match (Soul Partners)
 * 80-89: Excellent Match (Harmonious Partners)
 * 70-79: Good Match (Complementary Partners)
 * 60-69: Compatible (Growth Partners)
 * 50-59: Neutral (Requires Effort)
 * 40-49: Challenging (Significant Work Needed)
 * 0-39: Difficult (Natural Tension)
 */

/**
 * Elemental Relationship Matrix
 * Based on Five Elements theory:
 * - Production Cycle (生): Wood→Fire→Earth→Metal→Water→Wood
 * - Control Cycle (克): Wood→Earth, Earth→Water, Water→Fire, Fire→Metal, Metal→Wood
 * - Same Element: Harmony (with potential for competition)
 */
const ELEMENTAL_COMPATIBILITY = {
  // Wood relationships
  'Wood-Wood': 75,    // Same element - harmony with potential competition
  'Wood-Fire': 90,    // Production - Wood feeds Fire (nurturing)
  'Wood-Earth': 50,   // Control - Wood controls Earth (tension)
  'Wood-Metal': 45,   // Controlled by - Metal cuts Wood (challenging)
  'Wood-Water': 85,   // Produced by - Water nourishes Wood (supportive)

  // Fire relationships
  'Fire-Wood': 85,    // Produced by - Wood feeds Fire (supportive)
  'Fire-Fire': 70,    // Same element - intense, passionate, competitive
  'Fire-Earth': 88,   // Production - Fire creates Earth (nurturing)
  'Fire-Metal': 48,   // Control - Fire melts Metal (tension)
  'Fire-Water': 40,   // Controlled by - Water extinguishes Fire (difficult)

  // Earth relationships
  'Earth-Wood': 55,   // Controlled by - Wood penetrates Earth (challenging)
  'Earth-Fire': 87,   // Produced by - Fire creates Earth (supportive)
  'Earth-Earth': 78,  // Same element - stable, grounded, harmonious
  'Earth-Metal': 90,  // Production - Earth creates Metal (nurturing)
  'Earth-Water': 52,  // Control - Earth dams Water (tension)

  // Metal relationships
  'Metal-Wood': 50,   // Control - Metal cuts Wood (tension)
  'Metal-Fire': 44,   // Controlled by - Fire melts Metal (difficult)
  'Metal-Earth': 88,  // Produced by - Earth creates Metal (supportive)
  'Metal-Metal': 72,  // Same element - precise, disciplined, can be rigid
  'Metal-Water': 92,  // Production - Metal creates Water (nurturing)

  // Water relationships
  'Water-Wood': 89,   // Production - Water nourishes Wood (nurturing)
  'Water-Fire': 42,   // Control - Water extinguishes Fire (difficult)
  'Water-Earth': 48,  // Controlled by - Earth dams Water (challenging)
  'Water-Metal': 86,  // Produced by - Metal creates Water (supportive)
  'Water-Water': 76   // Same element - flowing, adaptive, harmonious
}

/**
 * Get compatibility score between two elements
 */
function getElementalScore(element1, element2) {
  const key = `${element1}-${element2}`
  return ELEMENTAL_COMPATIBILITY[key] || 50
}

/**
 * Calculate hybrid archetype compatibility
 * Takes into account both primary and secondary elements
 */
function calculateArchetypeCompatibility(archetype1, archetype2) {
  const el1Primary = archetype1.dominantElement
  const el1Secondary = archetype1.secondaryElement
  const el2Primary = archetype2.dominantElement
  const el2Secondary = archetype2.secondaryElement

  // Primary element compatibility (60% weight)
  const primaryScore = getElementalScore(el1Primary, el2Primary)

  // Secondary element compatibility (40% weight if both have secondaries)
  let secondaryScore = 0
  let hasSecondary = false

  if (el1Secondary && el2Secondary) {
    // Both hybrids - check secondary compatibility
    secondaryScore = (
      getElementalScore(el1Primary, el2Secondary) +
      getElementalScore(el1Secondary, el2Primary) +
      getElementalScore(el1Secondary, el2Secondary)
    ) / 3
    hasSecondary = true
  } else if (el1Secondary && !el2Secondary) {
    // Only archetype1 is hybrid
    secondaryScore = getElementalScore(el1Secondary, el2Primary)
    hasSecondary = true
  } else if (!el1Secondary && el2Secondary) {
    // Only archetype2 is hybrid
    secondaryScore = getElementalScore(el1Primary, el2Secondary)
    hasSecondary = true
  }

  // Calculate final score
  let score
  if (hasSecondary) {
    score = primaryScore * 0.6 + secondaryScore * 0.4
  } else {
    score = primaryScore
  }

  // Add small bonus for complementary pairings (production/control relationships)
  if (score >= 80 && score < 90) {
    score += 2 // Boost excellent matches slightly
  }

  // Ensure score is in 0-100 range
  return Math.round(Math.min(100, Math.max(0, score)))
}

/**
 * Generate the complete 25×25 compatibility matrix
 *
 * Dynamically calculated from archetype element combinations
 */
export function generateCompatibilityMatrix(archetypes) {
  const matrix = {}

  archetypes.forEach(arch1 => {
    matrix[arch1.id] = {}

    archetypes.forEach(arch2 => {
      const score = calculateArchetypeCompatibility(arch1, arch2)
      matrix[arch1.id][arch2.id] = score
    })
  })

  return matrix
}

/**
 * Get compatibility score between two archetypes
 *
 * @param {number} archetypeId1 - First archetype ID (1-25)
 * @param {number} archetypeId2 - Second archetype ID (1-25)
 * @param {Object} matrix - Pre-generated compatibility matrix
 * @returns {number} Compatibility score (0-100)
 */
export function getCompatibilityScore(archetypeId1, archetypeId2, matrix) {
  if (!matrix || !matrix[archetypeId1]) {
    console.error('[compatibilityMatrix] Invalid matrix or archetype ID')
    return 50 // Neutral fallback
  }

  return matrix[archetypeId1][archetypeId2] || 50
}

/**
 * Get compatibility level description
 */
export function getCompatibilityLevel(score) {
  if (score >= 90) return { level: 'Cosmic Match', emoji: '💫', color: 'from-purple-500 to-pink-500' }
  if (score >= 80) return { level: 'Excellent Match', emoji: '✨', color: 'from-blue-500 to-cyan-500' }
  if (score >= 70) return { level: 'Good Match', emoji: '💙', color: 'from-green-500 to-emerald-500' }
  if (score >= 60) return { level: 'Compatible', emoji: '🌱', color: 'from-yellow-500 to-amber-500' }
  if (score >= 50) return { level: 'Neutral', emoji: '⚖️', color: 'from-gray-500 to-slate-500' }
  if (score >= 40) return { level: 'Challenging', emoji: '⚡', color: 'from-orange-500 to-red-500' }
  return { level: 'Difficult', emoji: '🔥', color: 'from-red-600 to-red-800' }
}

/**
 * Get relationship advice based on compatibility score
 */
export function getCompatibilityAdvice(score, archetype1Name, archetype2Name) {
  if (score >= 90) {
    return {
      title: '🌟 Soul Partners',
      description: `${archetype1Name} and ${archetype2Name} have cosmic compatibility! Your elemental energies flow together naturally, creating profound harmony and mutual support.`,
      strengths: [
        'Natural understanding and resonance',
        'Effortless communication and flow',
        'Complementary strengths that enhance each other',
        'Shared values and life approach'
      ],
      advice: [
        'Nurture this rare connection with gratitude',
        'Create shared goals and visions together',
        'Support each other\'s individual growth',
        'Celebrate your natural harmony while staying mindful of complacency'
      ]
    }
  }

  if (score >= 80) {
    return {
      title: '✨ Excellent Harmony',
      description: `${archetype1Name} and ${archetype2Name} share excellent compatibility! Your energies complement each other beautifully with minimal friction.`,
      strengths: [
        'Strong mutual support and understanding',
        'Complementary approaches to life',
        'Natural chemistry and attraction',
        'Ability to grow together harmoniously'
      ],
      advice: [
        'Build on your natural strengths together',
        'Communicate openly about differences',
        'Create rituals that honor both energies',
        'Continue investing in mutual growth'
      ]
    }
  }

  if (score >= 70) {
    return {
      title: '💙 Good Partnership',
      description: `${archetype1Name} and ${archetype2Name} form a good match! With understanding and effort, your partnership can thrive.`,
      strengths: [
        'Complementary qualities that balance each other',
        'Opportunities for mutual growth',
        'Respect for different approaches',
        'Ability to learn from differences'
      ],
      advice: [
        'Embrace your differences as strengths',
        'Practice active listening and patience',
        'Find common ground in shared values',
        'Give each other space to be authentic'
      ]
    }
  }

  if (score >= 60) {
    return {
      title: '🌱 Growth Partnership',
      description: `${archetype1Name} and ${archetype2Name} can build compatibility through conscious effort and mutual understanding.`,
      strengths: [
        'Differences that spark growth',
        'Opportunities to expand perspectives',
        'Potential for deep learning',
        'Room for personal development'
      ],
      advice: [
        'Invest time in understanding each other deeply',
        'Create clear communication practices',
        'Respect each other\'s natural rhythms',
        'Find activities that bridge your differences'
      ]
    }
  }

  if (score >= 50) {
    return {
      title: '⚖️ Neutral Connection',
      description: `${archetype1Name} and ${archetype2Name} have neutral compatibility. Success requires conscious effort and clear communication.`,
      strengths: [
        'Opportunities for significant growth',
        'Different perspectives to learn from',
        'Potential for balance through contrast',
        'Room for creative solutions'
      ],
      advice: [
        'Establish strong communication foundations',
        'Be explicit about needs and boundaries',
        'Find shared interests outside natural tendencies',
        'Seek support from friends or counseling when needed'
      ]
    }
  }

  if (score >= 40) {
    return {
      title: '⚡ Challenging Dynamic',
      description: `${archetype1Name} and ${archetype2Name} face natural friction. This relationship requires significant work and commitment.`,
      strengths: [
        'Potential for profound personal growth',
        'Challenges that build resilience',
        'Opportunity to develop new skills',
        'Different strengths to learn from'
      ],
      advice: [
        'Be realistic about the effort required',
        'Develop strong conflict resolution skills',
        'Maintain individual support systems',
        'Consider whether the growth is mutual and desired'
      ]
    }
  }

  return {
    title: '🔥 Natural Tension',
    description: `${archetype1Name} and ${archetype2Name} have significant elemental opposition. This pairing is very challenging and may not be sustainable.`,
    strengths: [
      'Extreme challenges that test character',
      'Opportunity for radical self-awareness',
      'Different perspectives that provoke thought'
    ],
    advice: [
      'Honestly assess if this connection serves both parties',
      'Seek professional support if committed to the relationship',
      'Maintain strong individual boundaries',
      'Remember that not all connections are meant to last',
      'Consider if you\'re repeating unhealthy patterns'
    ]
  }
}
