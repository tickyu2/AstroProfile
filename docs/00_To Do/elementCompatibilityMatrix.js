/**
 * elementCompatibilityMatrix.js
 * 
 * 5 ELEMENT COMPATIBILITY THEORY - Complete Theoretical Foundation
 * "The PhD Dissertation" - No Black Boxes!
 * 
 * PHILOSOPHY:
 * Every score has a source. Every percentage has a derivation.
 * Every relationship has a theory. Like Bitcoin's whitepaper.
 * 
 * For GENESIS Platform - Western Zodiac Module
 * By Brother Sonnet, December 23, 2025
 * Building on Brother Opus's UI foundation
 */

// ============================================================================
// THEORETICAL FOUNDATION - THE "WHY" BEHIND THE NUMBERS
// ============================================================================

/**
 * ELEMENT RELATIONSHIP TYPES
 * 
 * Based on 5 Element Theory (simplified to 4 Western elements)
 * Each relationship type has a theoretical foundation and quantified score
 */
export const ELEMENT_RELATIONSHIPS = {
  
  // SAME ELEMENT = 100% base compatibility
  SAME: {
    score: 1.00,
    name: 'Same Element (Synergy)',
    type: 'synergy',
    description: 'Perfect mutual understanding of core energy',
    theory: 'When two people share the same elemental nature, they have inherent understanding of each other\'s motivations, energy patterns, and worldview. Like speaking the same native language.',
    formula: 'Base 100% (perfect understanding)',
    reasoning: 'Same constitutional energy = natural resonance with minimal effort',
    naturalExample: 'Two rivers flowing in the same direction',
    psychologicalMeaning: 'Deep empathy and mutual recognition',
    strengths: [
      'Instant understanding of each other\'s needs',
      'Similar energy levels and rhythms',
      'Natural comfort and ease together',
      'Shared approach to life challenges'
    ],
    challenges: [
      'May lack complementary perspectives',
      'Can amplify each other\'s weaknesses',
      'Risk of stagnation without external input'
    ],
    examples: [
      'Fire + Fire: Passionate understanding but competitive',
      'Earth + Earth: Stable foundation but may be too static',
      'Air + Air: Mental connection but emotional distance',
      'Water + Water: Deep emotional bond but overwhelming'
    ]
  },
  
  // GENERATING = 86% base compatibility
  GENERATING: {
    score: 0.86,
    name: 'Generating (Productive Cycle)',
    type: 'boost',
    description: 'One element naturally nourishes/supports the other',
    theory: 'In 5 Element cycle, each element GENERATES the next: Water nourishes Wood, Wood feeds Fire, Fire creates Earth (ash), Earth births Metal (ore), Metal enriches Water. This is PRODUCTIVE - one naturally supports the other\'s growth.',
    formula: 'Base 100% - 14% (slight effort needed to maintain flow)',
    reasoning: 'Nourishing relationship requires minimal effort because it\'s natural cycle',
    naturalExample: 'Water feeding a plant - natural and essential',
    psychologicalMeaning: 'Supportive partnership where one person\'s strength naturally feeds the other\'s growth',
    derivation: {
      perfectBase: 100,
      effortReduction: -14,
      finalScore: 86,
      explanation: 'Generating is highly compatible but not 100% because it requires conscious direction of energy (e.g., water must FLOW to the plant). Natural but needs activation.'
    },
    strengths: [
      'Natural support system',
      'One person\'s strength feeds other\'s needs',
      'Productive energy flow',
      'Mutual growth and development'
    ],
    challenges: [
      'Can become one-sided if not balanced',
      'Requires active participation',
      'May create dependency if overused'
    ],
    examples: [
      'Water → Earth (Water nourishes Earth): Water person brings emotional depth that grounds/stabilizes Earth person',
      'Earth → Air (Earth grounds Air): Earth person provides stability that helps Air person manifest ideas',
      'Fire → Air (Fire energizes Air): Fire person\'s passion inspires Air person\'s mental creativity',
      'Air → Water (Air stimulates Water): Air person\'s ideas help Water person articulate emotions'
    ]
  },
  
  // SUPPORTING = 75% base compatibility
  SUPPORTING: {
    score: 0.75,
    name: 'Supporting (Complementary)',
    type: 'complement',
    description: 'Elements provide complementary strengths',
    theory: 'These elements don\'t directly generate each other but provide complementary perspectives. Like yin-yang balance - different but harmonious. They support through DIFFERENCE rather than sameness.',
    formula: 'Base 100% - 25% (moderate effort for integration)',
    reasoning: 'Complementary requires more conscious effort to appreciate differences and integrate perspectives',
    naturalExample: 'Mountain and valley - different but create complete landscape',
    psychologicalMeaning: 'Different approaches that balance each other when integrated',
    derivation: {
      perfectBase: 100,
      effortReduction: -25,
      finalScore: 75,
      explanation: 'Supporting pairs require more work than generating because they don\'t naturally flow into each other. Must consciously choose to integrate different strengths.'
    },
    strengths: [
      'Complementary perspectives balance each other',
      'Each fills gaps in the other',
      'Creates wholeness through difference',
      'Prevents extremes through balance'
    ],
    challenges: [
      'Requires conscious effort to integrate',
      'May initially feel like friction',
      'Need to learn each other\'s language'
    ],
    examples: [
      'Cardinal + Fixed: Initiator + Sustainer = Complete cycle',
      'Fire + Earth: Passion + Stability = Grounded enthusiasm',
      'Air + Water: Thought + Feeling = Emotional intelligence'
    ]
  },
  
  // NEUTRAL = 60% base compatibility
  NEUTRAL: {
    score: 0.60,
    name: 'Neutral',
    type: 'neutral',
    description: 'No natural affinity or conflict',
    theory: 'Elements that are 2+ steps apart in the cycle. They don\'t naturally interact - neither generating nor controlling. Like parallel universes that occasionally intersect.',
    formula: 'Base 100% - 40% (significant effort for connection)',
    reasoning: 'Neutral pairs must CREATE connection rather than discovering natural affinity',
    naturalExample: 'Wind and rock - coexist but don\'t naturally interact',
    psychologicalMeaning: 'Different worlds that require bridge-building',
    derivation: {
      perfectBase: 100,
      effortReduction: -40,
      finalScore: 60,
      explanation: 'Neutral is middle ground - not bad, not great. Requires conscious effort to find common ground since there\'s no natural resonance or natural conflict to work through.'
    },
    strengths: [
      'Fresh perspective from different worldview',
      'No natural conflicts to overcome',
      'Freedom to create unique dynamic'
    ],
    challenges: [
      'Lack of natural chemistry',
      'Require constant effort to maintain connection',
      'May feel like living in different worlds'
    ],
    examples: [
      'Elements with no direct cycle relationship',
      'Different qualities that don\'t naturally connect'
    ]
  },
  
  // CONTROLLING = 45% base compatibility (LOWEST)
  CONTROLLING: {
    score: 0.45,
    name: 'Controlling (Restrictive Cycle)',
    type: 'friction',
    description: 'One element naturally limits/controls the other',
    theory: 'In 5 Element cycle, there\'s also a CONTROLLING cycle: Wood depletes Earth, Earth dams Water, Water extinguishes Fire, Fire melts Metal, Metal cuts Wood. This creates natural friction - one element\'s strength is the other\'s weakness.',
    formula: 'Base 100% - 55% (high effort to overcome friction)',
    reasoning: 'Controlling pairs face natural tension that requires significant work to transform into growth',
    naturalExample: 'Fire and water - natural opposition',
    psychologicalMeaning: 'Challenge relationship that can become growth through conscious work',
    derivation: {
      perfectBase: 100,
      effortReduction: -55,
      finalScore: 45,
      explanation: 'Controlling is challenging but NOT impossible. The 45% represents potential when BOTH people consciously work with the friction. Without work, it would be even lower.'
    },
    strengths: [
      'Forces growth through challenge',
      'Can create deep transformation',
      'Teaches important life lessons',
      'Keeps both people honest and growing'
    ],
    challenges: [
      'Natural tension and friction',
      'One person\'s strength threatens the other',
      'Requires exceptional maturity',
      'Can be exhausting without breaks'
    ],
    examples: [
      'Water → Fire (Water extinguishes Fire): Water person\'s emotional depth can dampen Fire person\'s enthusiasm',
      'Fire → Earth (Fire burns Earth): Fire person\'s intensity can overwhelm Earth person\'s need for stability',
      'Earth → Air (Earth grounds Air): Earth person\'s practicality can feel limiting to Air person\'s ideas',
      'Air → Water (Air evaporates Water): Air person\'s intellectualizing can feel dismissive of Water person\'s emotions'
    ],
    note: 'Controlling relationships CAN work with awareness, maturity, and commitment to growth. They\'re the relationships that either break you or make you stronger.'
  }
};

// ============================================================================
// ELEMENT CYCLES - THE UNDERLYING PATTERN
// ============================================================================

/**
 * GENERATING CYCLE (相生 Xiangsheng)
 * Each element naturally produces/feeds the next
 */
export const GENERATING_CYCLE = {
  Fire: 'Air',      // Fire needs Air to burn
  Air: 'Water',     // Air moves Water (wind creates waves)
  Water: 'Earth',   // Water nourishes Earth (makes soil fertile)
  Earth: 'Fire'     // Earth contains Fire (clay holds flame)
};

/**
 * GENERATING CYCLE REVERSE LOOKUP
 * What element generates this one?
 */
export const GENERATED_BY = {
  Air: 'Fire',      // Air is generated by Fire
  Water: 'Air',     // Water is generated by Air
  Earth: 'Water',   // Earth is generated by Water
  Fire: 'Earth'     // Fire is generated by Earth
};

/**
 * CONTROLLING CYCLE (相克 Xiangke)  
 * Each element naturally restricts/controls another
 */
export const CONTROLLING_CYCLE = {
  Fire: 'Water',    // Fire evaporates Water
  Water: 'Fire',    // Water extinguishes Fire
  Earth: 'Air',     // Earth grounds/limits Air
  Air: 'Earth'      // Air erodes Earth
};

// ============================================================================
// QUANTIFIED SCORING FUNCTIONS
// ============================================================================

/**
 * Determine relationship type between two elements
 * 
 * @param {string} element1 - First element (Fire, Earth, Air, Water)
 * @param {string} element2 - Second element
 * @returns {string} - Relationship type (SAME, GENERATING, SUPPORTING, etc.)
 */
export function getRelationshipType(element1, element2) {
  // Same element
  if (element1 === element2) {
    return 'SAME';
  }
  
  // Generating cycle (element1 generates element2)
  if (GENERATING_CYCLE[element1] === element2) {
    return 'GENERATING';
  }
  
  // Supporting (reverse generating - element2 generates element1)
  if (GENERATING_CYCLE[element2] === element1) {
    return 'SUPPORTING';
  }
  
  // Controlling cycle (direct conflict)
  if (CONTROLLING_CYCLE[element1] === element2) {
    return 'CONTROLLING';
  }
  
  // Otherwise neutral
  return 'NEUTRAL';
}

/**
 * Get complete compatibility data between two elements
 * 
 * This is the CORE function that eliminates black boxes!
 * Returns EVERYTHING: score, theory, formula, reasoning, examples
 * 
 * @param {string} element1 - First element
 * @param {string} element2 - Second element
 * @returns {Object} - Complete compatibility object with theory
 */
export function getElementCompatibility(element1, element2) {
  const relationshipType = getRelationshipType(element1, element2);
  const relationship = ELEMENT_RELATIONSHIPS[relationshipType];
  
  return {
    // THE SCORE (the "what")
    score: relationship.score,
    scorePercent: Math.round(relationship.score * 100) + '%',
    
    // THE RELATIONSHIP (the "which")
    relationshipType,
    relationshipName: relationship.name,
    interactionType: relationship.type, // For color coding: synergy, boost, complement, neutral, friction
    
    // THE THEORY (the "why" - no black boxes!)
    description: relationship.description,
    theory: relationship.theory,
    formula: relationship.formula,
    reasoning: relationship.reasoning,
    naturalExample: relationship.naturalExample,
    psychologicalMeaning: relationship.psychologicalMeaning,
    
    // THE DERIVATION (the "how" - show your work!)
    derivation: relationship.derivation || null,
    
    // THE PRACTICAL (the "so what")
    strengths: relationship.strengths,
    challenges: relationship.challenges,
    examples: relationship.examples,
    note: relationship.note || null,
    
    // SPECIFIC ELEMENTS
    element1,
    element2,
    direction: relationshipType === 'GENERATING' 
      ? `${element1} nourishes ${element2}`
      : relationshipType === 'CONTROLLING'
      ? `${element1} controls ${element2}`
      : 'Mutual relationship'
  };
}

/**
 * Calculate element score for compatibility calculation
 * 
 * @param {string} element1 - First element
 * @param {string} element2 - Second element
 * @param {number} maxPoints - Maximum points for this component (default 35)
 * @returns {Object} - Score with complete breakdown
 */
export function calculateElementScore(element1, element2, maxPoints = 35) {
  const compatibility = getElementCompatibility(element1, element2);
  
  // Calculate points
  const basePerPerson = maxPoints / 2;
  const person1Points = basePerPerson * compatibility.score;
  const person2Points = basePerPerson * compatibility.score;
  const totalPoints = person1Points + person2Points;
  
  return {
    // Final scores
    totalScore: Math.round(totalPoints),
    person1Score: Math.round(person1Points),
    person2Score: Math.round(person2Points),
    
    // Complete theory (eliminates "86%" black box!)
    compatibility,
    
    // Calculation breakdown (eliminates formula black box!)
    calculation: {
      maxPoints,
      basePerPerson,
      compatibilityScore: compatibility.score,
      compatibilityPercent: compatibility.scorePercent,
      
      formula: `(${maxPoints} pts ÷ 2) × ${compatibility.score} = ${person1Points.toFixed(2)} pts per person`,
      
      person1Calculation: {
        base: basePerPerson,
        multiplier: compatibility.score,
        formula: `${basePerPerson} × ${compatibility.score}`,
        result: person1Points
      },
      
      person2Calculation: {
        base: basePerPerson,
        multiplier: compatibility.score,
        formula: `${basePerPerson} × ${compatibility.score}`,
        result: person2Points
      },
      
      combined: {
        formula: `${person1Points.toFixed(2)} + ${person2Points.toFixed(2)}`,
        result: totalPoints
      }
    }
  };
}

// ============================================================================
// COMPATIBILITY MATRIX TABLE (FOR UI DISPLAY)
// ============================================================================

/**
 * Get complete compatibility table for all relationship types
 * Useful for displaying "where does 86% come from?" table
 */
export function getCompatibilityTable() {
  return Object.entries(ELEMENT_RELATIONSHIPS).map(([key, rel]) => ({
    type: key,
    name: rel.name,
    interactionType: rel.type,
    score: rel.score,
    scorePercent: Math.round(rel.score * 100) + '%',
    description: rel.description,
    formula: rel.formula
  }));
}

/**
 * Get example pairs for a relationship type
 */
export function getExamplePairs(relationshipType) {
  const relationship = ELEMENT_RELATIONSHIPS[relationshipType];
  return relationship ? relationship.examples : [];
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  ELEMENT_RELATIONSHIPS,
  GENERATING_CYCLE,
  GENERATED_BY,
  CONTROLLING_CYCLE,
  getRelationshipType,
  getElementCompatibility,
  calculateElementScore,
  getCompatibilityTable,
  getExamplePairs
};
