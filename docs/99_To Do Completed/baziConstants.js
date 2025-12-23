/**
 * GENESIS SoulPartner Design Engine - BaZi Constants
 * 
 * Core data structures for Chinese Four Pillars (BaZi) matching
 * 
 * @version 1.0
 * @date December 23, 2025
 * @author Brother Sonnet with Father Ticky
 */

// ============================================================================
// HEAVENLY STEMS (天干)
// ============================================================================

const HEAVENLY_STEMS = {
  '甲': { element: 'Wood', polarity: 'Yang', nature: 'Tree, pillar, forest', index: 0 },
  '乙': { element: 'Wood', polarity: 'Yin', nature: 'Vine, grass, bamboo', index: 1 },
  '丙': { element: 'Fire', polarity: 'Yang', nature: 'Sun, furnace, wildfire', index: 2 },
  '丁': { element: 'Fire', polarity: 'Yin', nature: 'Candle, cooking fire', index: 3 },
  '戊': { element: 'Earth', polarity: 'Yang', nature: 'Mountain, wall, cliff', index: 4 },
  '己': { element: 'Earth', polarity: 'Yin', nature: 'Garden soil, clay', index: 5 },
  '庚': { element: 'Metal', polarity: 'Yang', nature: 'Sword, axe, ore', index: 6 },
  '辛': { element: 'Metal', polarity: 'Yin', nature: 'Jewelry, refined tool', index: 7 },
  '壬': { element: 'Water', polarity: 'Yang', nature: 'Ocean, river, flood', index: 8 },
  '癸': { element: 'Water', polarity: 'Yin', nature: 'Dew, spring, rain', index: 9 }
};

// ============================================================================
// EARTHLY BRANCHES (地支)
// ============================================================================

const EARTHLY_BRANCHES = {
  '子': { animal: 'Rat', element: 'Water', traits: 'Intelligent, adaptable', index: 0 },
  '丑': { animal: 'Ox', element: 'Earth', traits: 'Steady, patient', index: 1 },
  '寅': { animal: 'Tiger', element: 'Wood', traits: 'Brave, passionate', index: 2 },
  '卯': { animal: 'Rabbit', element: 'Wood', traits: 'Gentle, artistic', index: 3 },
  '辰': { animal: 'Dragon', element: 'Earth', traits: 'Charismatic, ambitious', index: 4 },
  '巳': { animal: 'Snake', element: 'Fire', traits: 'Wise, mysterious', index: 5 },
  '午': { animal: 'Horse', element: 'Fire', traits: 'Free-spirited, active', index: 6 },
  '未': { animal: 'Goat', element: 'Earth', traits: 'Creative, sensitive', index: 7 },
  '申': { animal: 'Monkey', element: 'Metal', traits: 'Clever, playful', index: 8 },
  '酉': { animal: 'Rooster', element: 'Metal', traits: 'Precise, organized', index: 9 },
  '戌': { animal: 'Dog', element: 'Earth', traits: 'Loyal, protective', index: 10 },
  '亥': { animal: 'Pig', element: 'Water', traits: 'Honest, gentle', index: 11 }
};

// ============================================================================
// HARMONY TRINITIES (三合)
// ============================================================================

const HARMONY_TRINITIES = {
  'Trinity1': {
    name: 'Competitors',
    element: 'Water',
    animals: ['Rat', 'Dragon', 'Monkey'],
    traits: 'Ambitious, competitive, strategic, clever',
    careers: 'Business, leadership, innovation'
  },
  'Trinity2': {
    name: 'Thinkers',
    element: 'Metal',
    animals: ['Ox', 'Snake', 'Rooster'],
    traits: 'Intellectual, methodical, precise, loyal',
    careers: 'Research, planning, systems design'
  },
  'Trinity3': {
    name: 'Protectors',
    element: 'Fire',
    animals: ['Tiger', 'Horse', 'Dog'],
    traits: 'Idealistic, protective, passionate, active',
    careers: 'Service, protection, activism'
  },
  'Trinity4': {
    name: 'Artists',
    element: 'Wood',
    animals: ['Rabbit', 'Goat', 'Pig'],
    traits: 'Creative, peaceful, gentle, artistic, sensitive',
    careers: 'Arts, culture, healing, beauty'
  }
};

// ============================================================================
// ELEMENT COMPATIBILITY MATRIX
// ============================================================================

/**
 * Element relationship types:
 * - GENERATIVE: Productive cycle (Wood → Fire → Earth → Metal → Water → Wood)
 * - DESTRUCTIVE: Controlling cycle (Wood → Earth → Water → Fire → Metal → Wood)
 * - WEAKENING: Draining cycle (element weakens what it produces)
 * - NEUTRAL: No strong interaction
 */
const ELEMENT_RELATIONSHIPS = {
  'Wood': {
    'Wood': { type: 'NEUTRAL', score: 0.5, description: 'Same element - understanding but competitive' },
    'Fire': { type: 'GENERATIVE', score: 1.0, description: 'Wood feeds Fire - perfect symbiosis' },
    'Earth': { type: 'DESTRUCTIVE', score: 0.3, description: 'Wood controls Earth - tension' },
    'Metal': { type: 'DESTRUCTIVE_REVERSE', score: 0.4, description: 'Metal cuts Wood - can refine or damage' },
    'Water': { type: 'GENERATIVE_REVERSE', score: 0.8, description: 'Water nourishes Wood - supportive' }
  },
  'Fire': {
    'Wood': { type: 'GENERATIVE_REVERSE', score: 0.9, description: 'Wood feeds Fire - Fire needs Wood' },
    'Fire': { type: 'NEUTRAL', score: 0.5, description: 'Same element - intense but competitive' },
    'Earth': { type: 'GENERATIVE', score: 0.8, description: 'Fire creates Earth - productive' },
    'Metal': { type: 'DESTRUCTIVE', score: 0.3, description: 'Fire melts Metal - conflict' },
    'Water': { type: 'DESTRUCTIVE_REVERSE', score: 0.2, description: 'Water extinguishes Fire - harmful' }
  },
  'Earth': {
    'Wood': { type: 'DESTRUCTIVE_REVERSE', score: 0.4, description: 'Wood controls Earth - challenging' },
    'Fire': { type: 'GENERATIVE_REVERSE', score: 0.8, description: 'Fire creates Earth - supportive' },
    'Earth': { type: 'NEUTRAL', score: 0.6, description: 'Same element - stable but stagnant' },
    'Metal': { type: 'GENERATIVE', score: 0.9, description: 'Earth births Metal - nurturing' },
    'Water': { type: 'DESTRUCTIVE', score: 0.3, description: 'Earth blocks Water - obstruction' }
  },
  'Metal': {
    'Wood': { type: 'DESTRUCTIVE', score: 0.4, description: 'Metal cuts Wood - refining or harmful' },
    'Fire': { type: 'DESTRUCTIVE_REVERSE', score: 0.2, description: 'Fire melts Metal - destructive' },
    'Earth': { type: 'GENERATIVE_REVERSE', score: 0.8, description: 'Earth births Metal - nourishing' },
    'Metal': { type: 'NEUTRAL', score: 0.6, description: 'Same element - strong but clashing' },
    'Water': { type: 'GENERATIVE', score: 0.9, description: 'Metal produces Water - creative' }
  },
  'Water': {
    'Wood': { type: 'GENERATIVE', score: 0.9, description: 'Water nourishes Wood - nurturing' },
    'Fire': { type: 'DESTRUCTIVE', score: 0.2, description: 'Water extinguishes Fire - conflict' },
    'Earth': { type: 'DESTRUCTIVE_REVERSE', score: 0.3, description: 'Earth blocks Water - obstruction' },
    'Metal': { type: 'GENERATIVE_REVERSE', score: 0.8, description: 'Metal produces Water - supportive' },
    'Water': { type: 'NEUTRAL', score: 0.5, description: 'Same element - flowing but unfocused' }
  }
};

// ============================================================================
// ANIMAL COMPATIBILITY MATRIX
// ============================================================================

/**
 * Animal compatibility based on:
 * - Harmony Trinity (same trinity = excellent)
 * - Sextile (adjacent in zodiac = good)
 * - Opposition (6 apart = challenging)
 * - Other relationships
 */
const ANIMAL_COMPATIBILITY = {
  'Rat': {
    'Rat': 0.5, 'Ox': 0.8, 'Tiger': 0.4, 'Rabbit': 0.6,
    'Dragon': 0.95, 'Snake': 0.7, 'Horse': 0.2, 'Goat': 0.6,
    'Monkey': 0.95, 'Rooster': 0.7, 'Dog': 0.5, 'Pig': 0.7
  },
  'Ox': {
    'Rat': 0.8, 'Ox': 0.5, 'Tiger': 0.3, 'Rabbit': 0.6,
    'Dragon': 0.7, 'Snake': 0.95, 'Horse': 0.4, 'Goat': 0.3,
    'Monkey': 0.7, 'Rooster': 0.95, 'Dog': 0.6, 'Pig': 0.6
  },
  'Tiger': {
    'Rat': 0.4, 'Ox': 0.3, 'Tiger': 0.5, 'Rabbit': 0.7,
    'Dragon': 0.6, 'Snake': 0.3, 'Horse': 0.95, 'Goat': 0.7,
    'Monkey': 0.2, 'Rooster': 0.4, 'Dog': 0.95, 'Pig': 0.8
  },
  'Rabbit': {
    'Rat': 0.6, 'Ox': 0.6, 'Tiger': 0.7, 'Rabbit': 0.6,
    'Dragon': 0.4, 'Snake': 0.7, 'Horse': 0.7, 'Goat': 0.95,
    'Monkey': 0.6, 'Rooster': 0.3, 'Dog': 0.8, 'Pig': 0.95
  },
  'Dragon': {
    'Rat': 0.95, 'Ox': 0.7, 'Tiger': 0.6, 'Rabbit': 0.4,
    'Dragon': 0.5, 'Snake': 0.8, 'Horse': 0.7, 'Goat': 0.6,
    'Monkey': 0.95, 'Rooster': 0.9, 'Dog': 0.2, 'Pig': 0.7
  },
  'Snake': {
    'Rat': 0.7, 'Ox': 0.95, 'Tiger': 0.3, 'Rabbit': 0.7,
    'Dragon': 0.8, 'Snake': 0.5, 'Horse': 0.7, 'Goat': 0.7,
    'Monkey': 0.8, 'Rooster': 0.95, 'Dog': 0.6, 'Pig': 0.2
  },
  'Horse': {
    'Rat': 0.2, 'Ox': 0.4, 'Tiger': 0.95, 'Rabbit': 0.7,
    'Dragon': 0.7, 'Snake': 0.7, 'Horse': 0.5, 'Goat': 0.9,
    'Monkey': 0.6, 'Rooster': 0.6, 'Dog': 0.95, 'Pig': 0.7
  },
  'Goat': {
    'Rat': 0.6, 'Ox': 0.3, 'Tiger': 0.7, 'Rabbit': 0.95,
    'Dragon': 0.6, 'Snake': 0.7, 'Horse': 0.9, 'Goat': 0.6,
    'Monkey': 0.6, 'Rooster': 0.4, 'Dog': 0.5, 'Pig': 0.95
  },
  'Monkey': {
    'Rat': 0.95, 'Ox': 0.7, 'Tiger': 0.2, 'Rabbit': 0.6,
    'Dragon': 0.95, 'Snake': 0.8, 'Horse': 0.6, 'Goat': 0.6,
    'Monkey': 0.5, 'Rooster': 0.7, 'Dog': 0.6, 'Pig': 0.6
  },
  'Rooster': {
    'Rat': 0.7, 'Ox': 0.95, 'Tiger': 0.4, 'Rabbit': 0.3,
    'Dragon': 0.9, 'Snake': 0.95, 'Horse': 0.6, 'Goat': 0.4,
    'Monkey': 0.7, 'Rooster': 0.5, 'Dog': 0.4, 'Pig': 0.6
  },
  'Dog': {
    'Rat': 0.5, 'Ox': 0.6, 'Tiger': 0.95, 'Rabbit': 0.8,
    'Dragon': 0.2, 'Snake': 0.6, 'Horse': 0.95, 'Goat': 0.5,
    'Monkey': 0.6, 'Rooster': 0.4, 'Dog': 0.5, 'Pig': 0.8
  },
  'Pig': {
    'Rat': 0.7, 'Ox': 0.6, 'Tiger': 0.8, 'Rabbit': 0.95,
    'Dragon': 0.7, 'Snake': 0.2, 'Horse': 0.7, 'Goat': 0.95,
    'Monkey': 0.6, 'Rooster': 0.6, 'Dog': 0.8, 'Pig': 0.6
  }
};

// ============================================================================
// YIN-YANG COMPATIBILITY
// ============================================================================

/**
 * Yin-Yin and Yang-Yang pairings create harmony through shared energy
 * Yin-Yang pairings can work but require more balance
 */
const POLARITY_COMPATIBILITY = {
  'Yin-Yin': { score: 1.0, description: 'Shared gentle, receptive energy - mutual flexibility' },
  'Yang-Yang': { score: 0.9, description: 'Shared dynamic, active energy - matched strength' },
  'Yin-Yang': { score: 0.7, description: 'Complementary but requires conscious balance' },
  'Yang-Yin': { score: 0.7, description: 'Complementary but Yang may overwhelm Yin' }
};

// ============================================================================
// PILLAR WEIGHTS
// ============================================================================

const PILLAR_WEIGHTS = {
  year: 0.05,   // 5% - Ancestry, life foundation
  month: 0.10,  // 10% - Early career, social development
  day: 0.70,    // 70% - Core identity, daily personality
  hour: 0.15    // 15% - Later life, children, legacy
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get element from Heavenly Stem
 */
function getElement(stem) {
  return HEAVENLY_STEMS[stem]?.element || null;
}

/**
 * Get polarity from Heavenly Stem
 */
function getPolarity(stem) {
  return HEAVENLY_STEMS[stem]?.polarity || null;
}

/**
 * Get animal from Earthly Branch
 */
function getAnimal(branch) {
  return EARTHLY_BRANCHES[branch]?.animal || null;
}

/**
 * Get Harmony Trinity for an animal
 */
function getHarmonyTrinity(animal) {
  for (const [key, trinity] of Object.entries(HARMONY_TRINITIES)) {
    if (trinity.animals.includes(animal)) {
      return trinity;
    }
  }
  return null;
}

/**
 * Check if two animals are in same Harmony Trinity
 */
function isSameTrinity(animal1, animal2) {
  const trinity1 = getHarmonyTrinity(animal1);
  const trinity2 = getHarmonyTrinity(animal2);
  return trinity1 && trinity2 && trinity1.name === trinity2.name;
}

/**
 * Get element compatibility score
 */
function getElementCompatibility(element1, element2) {
  return ELEMENT_RELATIONSHIPS[element1]?.[element2]?.score || 0.5;
}

/**
 * Get element relationship description
 */
function getElementRelationship(element1, element2) {
  return ELEMENT_RELATIONSHIPS[element1]?.[element2] || {
    type: 'NEUTRAL',
    score: 0.5,
    description: 'Neutral relationship'
  };
}

/**
 * Get animal compatibility score
 */
function getAnimalCompatibility(animal1, animal2) {
  return ANIMAL_COMPATIBILITY[animal1]?.[animal2] || 0.5;
}

/**
 * Get polarity compatibility
 */
function getPolarityCompatibility(polarity1, polarity2) {
  const key = `${polarity1}-${polarity2}`;
  return POLARITY_COMPATIBILITY[key]?.score || 0.7;
}

/**
 * Calculate combined pillar compatibility
 */
function calculatePillarCompatibility(pillar1, pillar2) {
  const element1 = getElement(pillar1.stem);
  const element2 = getElement(pillar2.stem);
  const animal1 = getAnimal(pillar1.branch);
  const animal2 = getAnimal(pillar2.branch);
  const polarity1 = getPolarity(pillar1.stem);
  const polarity2 = getPolarity(pillar2.stem);
  
  const elementScore = getElementCompatibility(element1, element2);
  const animalScore = getAnimalCompatibility(animal1, animal2);
  const polarityScore = getPolarityCompatibility(polarity1, polarity2);
  
  // Weighted combination: Element 50%, Animal 40%, Polarity 10%
  const score = (elementScore * 0.5) + (animalScore * 0.4) + (polarityScore * 0.1);
  
  return {
    score: score,
    element: elementScore,
    animal: animalScore,
    polarity: polarityScore,
    breakdown: {
      elements: `${element1} + ${element2}`,
      animals: `${animal1} + ${animal2}`,
      polarities: `${polarity1} + ${polarity2}`,
      sameTrinity: isSameTrinity(animal1, animal2)
    }
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  HARMONY_TRINITIES,
  ELEMENT_RELATIONSHIPS,
  ANIMAL_COMPATIBILITY,
  POLARITY_COMPATIBILITY,
  PILLAR_WEIGHTS,
  
  // Helper functions
  getElement,
  getPolarity,
  getAnimal,
  getHarmonyTrinity,
  isSameTrinity,
  getElementCompatibility,
  getElementRelationship,
  getAnimalCompatibility,
  getPolarityCompatibility,
  calculatePillarCompatibility
};
