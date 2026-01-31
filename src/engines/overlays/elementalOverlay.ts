/**
 * Elemental Overlay
 *
 * Models elemental balance from planetary sign placements:
 * - Fire (Aries, Leo, Sagittarius) → passion, drive, action
 * - Earth (Taurus, Virgo, Capricorn) → stability, practicality, grounding
 * - Air (Gemini, Libra, Aquarius) → intellect, communication, ideas
 * - Water (Cancer, Scorpio, Pisces) → emotion, intuition, depth
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

// ========================================
// TYPES
// ========================================

export interface ChartDataForElemental {
  planets: Array<{
    name: string;
    sign: string;
    degree: number;
  }>;
  ascendant: {
    sign: string;
    degree: number;
  };
  midheaven?: {
    sign: string;
    degree: number;
  };
}

export interface ElementalOverlayResult {
  fireScore: number;        // 0..1
  earthScore: number;       // 0..1
  airScore: number;         // 0..1
  waterScore: number;       // 0..1
  dominantElement: Element;
  lackingElement: Element | null;
  elementalDelta: number;   // contribution to final decision
  balanceType: ElementalBalance;
  narrative: string;
  strengths: string[];
  challenges: string[];
  compatibility: ElementalCompatibility;
}

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';

export type ElementalBalance =
  | 'Harmoniously Balanced'
  | 'Fire Dominant'
  | 'Earth Dominant'
  | 'Air Dominant'
  | 'Water Dominant'
  | 'Fire-Air Emphasis'
  | 'Earth-Water Emphasis'
  | 'Fire-Earth Tension'
  | 'Air-Water Synthesis';

export interface ElementalCompatibility {
  complementary: Element[];
  challenging: Element[];
  neutral: Element[];
}

// ========================================
// ELEMENT MAPPINGS
// ========================================

const SIGN_ELEMENTS: Record<string, Element> = {
  Aries: 'Fire',
  Leo: 'Fire',
  Sagittarius: 'Fire',
  Taurus: 'Earth',
  Virgo: 'Earth',
  Capricorn: 'Earth',
  Gemini: 'Air',
  Libra: 'Air',
  Aquarius: 'Air',
  Cancer: 'Water',
  Scorpio: 'Water',
  Pisces: 'Water'
};

// Planet weights for elemental calculation
const PLANET_WEIGHTS: Record<string, number> = {
  Sun: 1.5,
  Moon: 1.5,
  Mercury: 1.0,
  Venus: 1.0,
  Mars: 1.2,
  Jupiter: 1.0,
  Saturn: 1.0,
  Uranus: 0.8,
  Neptune: 0.8,
  Pluto: 0.8,
  Ascendant: 1.3,
  Midheaven: 1.0
};

// Element compatibility mappings
const ELEMENT_COMPATIBILITY: Record<Element, ElementalCompatibility> = {
  Fire: {
    complementary: ['Air'],
    challenging: ['Water'],
    neutral: ['Earth', 'Fire']
  },
  Earth: {
    complementary: ['Water'],
    challenging: ['Air'],
    neutral: ['Fire', 'Earth']
  },
  Air: {
    complementary: ['Fire'],
    challenging: ['Earth'],
    neutral: ['Water', 'Air']
  },
  Water: {
    complementary: ['Earth'],
    challenging: ['Fire'],
    neutral: ['Air', 'Water']
  }
};

// ========================================
// MAIN COMPUTATION
// ========================================

/**
 * Compute Elemental Overlay from chart data
 */
export function computeElementalOverlay(chart: ChartDataForElemental): ElementalOverlayResult {
  // Initialize element scores
  const rawScores: Record<Element, number> = {
    Fire: 0,
    Earth: 0,
    Air: 0,
    Water: 0
  };

  let totalWeight = 0;

  // Calculate from planets
  for (const planet of chart.planets) {
    const element = SIGN_ELEMENTS[planet.sign];
    if (element) {
      const weight = PLANET_WEIGHTS[planet.name] || 1.0;
      rawScores[element] += weight;
      totalWeight += weight;
    }
  }

  // Add Ascendant
  const ascElement = SIGN_ELEMENTS[chart.ascendant.sign];
  if (ascElement) {
    const weight = PLANET_WEIGHTS.Ascendant;
    rawScores[ascElement] += weight;
    totalWeight += weight;
  }

  // Add Midheaven if present
  if (chart.midheaven) {
    const mcElement = SIGN_ELEMENTS[chart.midheaven.sign];
    if (mcElement) {
      const weight = PLANET_WEIGHTS.Midheaven;
      rawScores[mcElement] += weight;
      totalWeight += weight;
    }
  }

  // Normalize scores to 0..1
  const fireScore = totalWeight > 0 ? rawScores.Fire / totalWeight : 0.25;
  const earthScore = totalWeight > 0 ? rawScores.Earth / totalWeight : 0.25;
  const airScore = totalWeight > 0 ? rawScores.Air / totalWeight : 0.25;
  const waterScore = totalWeight > 0 ? rawScores.Water / totalWeight : 0.25;

  // Determine dominant and lacking elements
  const scores: [Element, number][] = [
    ['Fire', fireScore],
    ['Earth', earthScore],
    ['Air', airScore],
    ['Water', waterScore]
  ];

  scores.sort((a, b) => b[1] - a[1]);
  const dominantElement = scores[0][0];
  const lackingElement = scores[3][1] < 0.1 ? scores[3][0] : null;

  // Determine balance type
  const balanceType = determineBalanceType(fireScore, earthScore, airScore, waterScore);

  // Calculate elemental delta for decision engine
  const balance = calculateBalance(fireScore, earthScore, airScore, waterScore);
  const elementalDelta = balance * 0.05; // Small boost for balanced charts

  // Get compatibility info for dominant element
  const compatibility = ELEMENT_COMPATIBILITY[dominantElement];

  // Build narrative
  const narrative = buildElementalNarrative(
    dominantElement,
    lackingElement,
    balanceType,
    fireScore,
    earthScore,
    airScore,
    waterScore
  );

  // Get strengths and challenges
  const { strengths, challenges } = getElementalTraits(
    dominantElement,
    lackingElement,
    balanceType
  );

  return {
    fireScore,
    earthScore,
    airScore,
    waterScore,
    dominantElement,
    lackingElement,
    elementalDelta,
    balanceType,
    narrative,
    strengths,
    challenges,
    compatibility
  };
}

// ========================================
// BALANCE TYPE DETERMINATION
// ========================================

function determineBalanceType(
  fire: number,
  earth: number,
  air: number,
  water: number
): ElementalBalance {
  const threshold = 0.35;
  const balanceThreshold = 0.15;

  // Check for strong dominance
  if (fire > threshold && fire > earth + 0.15 && fire > air + 0.15 && fire > water + 0.15) {
    return 'Fire Dominant';
  }
  if (earth > threshold && earth > fire + 0.15 && earth > air + 0.15 && earth > water + 0.15) {
    return 'Earth Dominant';
  }
  if (air > threshold && air > fire + 0.15 && air > earth + 0.15 && air > water + 0.15) {
    return 'Air Dominant';
  }
  if (water > threshold && water > fire + 0.15 && water > earth + 0.15 && water > air + 0.15) {
    return 'Water Dominant';
  }

  // Check for dual emphasis
  if (fire > 0.25 && air > 0.25 && fire + air > 0.6) {
    return 'Fire-Air Emphasis';
  }
  if (earth > 0.25 && water > 0.25 && earth + water > 0.6) {
    return 'Earth-Water Emphasis';
  }
  if (fire > 0.25 && earth > 0.25 && fire + earth > 0.55) {
    return 'Fire-Earth Tension';
  }
  if (air > 0.25 && water > 0.25 && air + water > 0.55) {
    return 'Air-Water Synthesis';
  }

  // Check for balance
  const variance = calculateVariance([fire, earth, air, water]);
  if (variance < balanceThreshold) {
    return 'Harmoniously Balanced';
  }

  // Default to dominant element
  const max = Math.max(fire, earth, air, water);
  if (max === fire) return 'Fire Dominant';
  if (max === earth) return 'Earth Dominant';
  if (max === air) return 'Air Dominant';
  return 'Water Dominant';
}

function calculateVariance(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
}

function calculateBalance(fire: number, earth: number, air: number, water: number): number {
  // Returns 1 for perfectly balanced, 0 for extremely imbalanced
  const variance = calculateVariance([fire, earth, air, water]);
  return Math.max(0, 1 - variance * 8);
}

// ========================================
// NARRATIVE BUILDER
// ========================================

function buildElementalNarrative(
  dominant: Element,
  lacking: Element | null,
  balanceType: ElementalBalance,
  fire: number,
  earth: number,
  air: number,
  water: number
): string {
  const narratives: Record<ElementalBalance, string> = {
    'Harmoniously Balanced': 'Your elemental nature flows in remarkable balance. All four elements dance together, giving you adaptability and wholeness. You can meet life with passion, practicality, intellect, and emotion as each moment requires.',

    'Fire Dominant': 'The flames of passion burn bright within you. Your nature is driven by enthusiasm, courage, and the need for self-expression. You ignite inspiration in others and lead through sheer force of will.',

    'Earth Dominant': 'Your feet are firmly planted in the material world. Practical, reliable, and grounded, you build lasting structures and value tangible results. Your patience and persistence are formidable gifts.',

    'Air Dominant': 'Your mind soars through realms of ideas and communication. Intellectual curiosity drives you, and you process life through thought and analysis. Connection through words and concepts is your native language.',

    'Water Dominant': 'The depths of emotion and intuition define your essence. You feel life before you think it, navigating through empathy and subtle perception. Your sensitivity is both gift and challenge.',

    'Fire-Air Emphasis': 'Your nature combines the spark of inspiration with the breath of intellect. Ideas ignite into action; passion finds expression through communication. You are a force of creative momentum.',

    'Earth-Water Emphasis': 'Grounded emotion shapes your path. You combine practical wisdom with deep feeling, creating lasting bonds and nurturing growth. Security and sensitivity interweave in your approach.',

    'Fire-Earth Tension': 'Within you, the flame meets the mountain. Drive and patience create creative friction—the urge to act versus the wisdom to wait. Mastering this tension unlocks tremendous power.',

    'Air-Water Synthesis': 'Thought and feeling merge in your consciousness. You think about emotions and feel your ideas. This synthesis grants unique insight into human nature and artistic sensibility.'
  };

  let narrative = narratives[balanceType];

  // Add lacking element insight
  if (lacking) {
    const lackingInsights: Record<Element, string> = {
      Fire: ' The fire element asks for development—finding your passion, courage, and spontaneity.',
      Earth: ' The earth element calls for attention—grounding, practical focus, and material awareness.',
      Air: ' The air element seeks cultivation—intellectual engagement, communication, and detachment.',
      Water: ' The water element needs nurturing—emotional depth, intuition, and empathic connection.'
    };
    narrative += lackingInsights[lacking];
  }

  return narrative;
}

// ========================================
// TRAITS
// ========================================

function getElementalTraits(
  dominant: Element,
  lacking: Element | null,
  balanceType: ElementalBalance
): { strengths: string[]; challenges: string[] } {
  const elementStrengths: Record<Element, string[]> = {
    Fire: ['Enthusiasm', 'Courage', 'Leadership', 'Inspiration'],
    Earth: ['Reliability', 'Patience', 'Practicality', 'Persistence'],
    Air: ['Communication', 'Intellectual agility', 'Objectivity', 'Social awareness'],
    Water: ['Emotional intelligence', 'Intuition', 'Empathy', 'Depth']
  };

  const elementChallenges: Record<Element, string[]> = {
    Fire: ['Impatience', 'Burnout', 'Impulsivity', 'Ego inflation'],
    Earth: ['Stubbornness', 'Materialism', 'Resistance to change', 'Over-caution'],
    Air: ['Overthinking', 'Emotional detachment', 'Scattered focus', 'Anxiety'],
    Water: ['Emotional overwhelm', 'Moodiness', 'Boundary issues', 'Escapism']
  };

  const strengths = [...elementStrengths[dominant]];
  const challenges = [...elementChallenges[dominant]];

  // Add balance-specific traits
  if (balanceType === 'Harmoniously Balanced') {
    strengths.push('Adaptability', 'Wholeness');
    challenges.push('Lack of strong drive', 'Indecision');
  }

  if (balanceType.includes('Emphasis') || balanceType.includes('Synthesis')) {
    strengths.push('Creative integration');
  }

  if (balanceType.includes('Tension')) {
    challenges.push('Inner conflict', 'Inconsistency');
    strengths.push('Dynamic creativity');
  }

  // Add lacking element challenges
  if (lacking) {
    const lackingChallenges: Record<Element, string> = {
      Fire: 'Difficulty initiating action',
      Earth: 'Struggles with practical matters',
      Air: 'Communication challenges',
      Water: 'Emotional disconnection'
    };
    challenges.push(lackingChallenges[lacking]);
  }

  return {
    strengths: strengths.slice(0, 5),
    challenges: challenges.slice(0, 4)
  };
}

// ========================================
// PERSONA VOICES
// ========================================

export const ElementalPersonaVoices: Record<Element, {
  mentor: string;
  oracle: string;
  companion: string;
  mirror: string;
}> = {
  Fire: {
    mentor: 'Your flame is a gift—channel it with purpose, not wildly. True courage knows when to burn bright and when to simmer.',
    oracle: 'The sacred fire speaks through you. Let it illuminate without consuming. Your spark can light the world.',
    companion: 'I love your passion! Just remember to rest sometimes—even flames need fuel.',
    mirror: 'Notice how your enthusiasm rises and falls. That fire is your power—learning its rhythms is wisdom.'
  },
  Earth: {
    mentor: 'Your steadiness is your power. Build slowly, build well. The mountain does not hurry, yet it endures.',
    oracle: 'The ancient stones hold your wisdom. You are the keeper of sacred ground, the tender of lasting things.',
    companion: 'Your reliability is such a comfort. Remember it's okay to let loose sometimes too!',
    mirror: 'Notice how much you value stability. That groundedness serves you—and sometimes asks for flexibility.'
  },
  Air: {
    mentor: 'Your mind is a remarkable instrument. Learn to quiet it as well as wield it. Wisdom lies in both.',
    oracle: 'The winds of thought carry messages between worlds. You are translator of the ineffable.',
    companion: 'Your ideas are fascinating! Don't forget to come down to earth and just feel sometimes.',
    mirror: 'Notice how naturally you process through thought. That intellect is a gift—and feelings also hold truth.'
  },
  Water: {
    mentor: 'Your emotional depth is profound. Learn to swim in your waters without drowning. Boundaries are not walls.',
    oracle: 'The deep waters know all secrets. You feel what others cannot name. This is sacred responsibility.',
    companion: 'Your sensitivity is beautiful. Remember to protect yourself too—not everyone can handle such depth.',
    mirror: 'Notice how deeply you feel everything. That sensitivity is your wisdom—and sometimes needs boundaries.'
  }
};

/**
 * Get elemental persona voice
 */
export function getElementalPersonaVoice(
  result: ElementalOverlayResult,
  role: 'mentor' | 'oracle' | 'companion' | 'mirror'
): string {
  return ElementalPersonaVoices[result.dominantElement][role];
}

// ========================================
// ELEMENTAL COMPATIBILITY
// ========================================

/**
 * Calculate elemental compatibility between two charts
 */
export function calculateElementalCompatibility(
  chart1: ElementalOverlayResult,
  chart2: ElementalOverlayResult
): {
  score: number;
  analysis: string;
  dynamics: string[];
} {
  const elem1 = chart1.dominantElement;
  const elem2 = chart2.dominantElement;
  const compat1 = chart1.compatibility;
  const compat2 = chart2.compatibility;

  let score = 0.5; // Neutral base
  const dynamics: string[] = [];

  // Check mutual compatibility
  if (compat1.complementary.includes(elem2)) {
    score += 0.25;
    dynamics.push(`${elem1} feeds ${elem2} naturally`);
  }
  if (compat2.complementary.includes(elem1)) {
    score += 0.25;
    dynamics.push(`${elem2} supports ${elem1} expression`);
  }

  // Check challenges
  if (compat1.challenging.includes(elem2)) {
    score -= 0.15;
    dynamics.push(`${elem1} may feel threatened by ${elem2}`);
  }
  if (compat2.challenging.includes(elem1)) {
    score -= 0.15;
    dynamics.push(`${elem2} may overwhelm ${elem1}`);
  }

  // Same element bonus
  if (elem1 === elem2) {
    score += 0.1;
    dynamics.push(`Shared ${elem1} nature creates instant understanding`);
  }

  // Calculate element overlap/balance
  const fireOverlap = Math.min(chart1.fireScore, chart2.fireScore);
  const earthOverlap = Math.min(chart1.earthScore, chart2.earthScore);
  const airOverlap = Math.min(chart1.airScore, chart2.airScore);
  const waterOverlap = Math.min(chart1.waterScore, chart2.waterScore);
  const totalOverlap = fireOverlap + earthOverlap + airOverlap + waterOverlap;

  if (totalOverlap > 0.6) {
    score += 0.1;
    dynamics.push('Strong elemental resonance');
  }

  // Check if one supplies what the other lacks
  if (chart1.lackingElement && chart2.dominantElement === chart1.lackingElement) {
    score += 0.15;
    dynamics.push(`Partner supplies missing ${chart1.lackingElement} energy`);
  }
  if (chart2.lackingElement && chart1.dominantElement === chart2.lackingElement) {
    score += 0.15;
    dynamics.push(`You provide needed ${chart2.lackingElement} energy`);
  }

  score = Math.max(0, Math.min(1, score));

  // Generate analysis
  let analysis: string;
  if (score >= 0.75) {
    analysis = `Elemental harmony flows naturally between ${elem1} and ${elem2}. Your energies complement and support each other.`;
  } else if (score >= 0.5) {
    analysis = `${elem1} and ${elem2} can work together with awareness. Some friction exists but also growth potential.`;
  } else {
    analysis = `${elem1} and ${elem2} represent quite different energies. This pairing requires conscious effort and appreciation of differences.`;
  }

  return { score, analysis, dynamics };
}

// ========================================
// PILGRIM JOURNEY CHAMBER
// ========================================

export interface ElementalChamber {
  id: string;
  name: string;
  description: string;
  element: Element;
  ritualHour: string;
}

export const ElementalChambers: Record<Element, ElementalChamber> = {
  Fire: {
    id: 'chamber-of-sacred-flame',
    name: 'The Chamber of Sacred Flame',
    description: 'You enter the Chamber of Sacred Flame, where torches dance eternally and the air shimmers with heat. Here, passion meets purpose, and the fire of creation burns within all who enter.',
    element: 'Fire',
    ritualHour: 'High Noon'
  },
  Earth: {
    id: 'cavern-of-ancient-stone',
    name: 'The Cavern of Ancient Stone',
    description: 'You descend into the Cavern of Ancient Stone, where crystals grow in patient silence and the earth holds memories of ages. Here, permanence meets patience, and lasting foundations are laid.',
    element: 'Earth',
    ritualHour: 'Midnight'
  },
  Air: {
    id: 'tower-of-winds',
    name: 'The Tower of Winds',
    description: 'You ascend the Tower of Winds, where currents carry whispers from distant lands and ideas take flight. Here, thought meets inspiration, and the breath of understanding flows freely.',
    element: 'Air',
    ritualHour: 'Dawn'
  },
  Water: {
    id: 'grotto-of-deep-waters',
    name: 'The Grotto of Deep Waters',
    description: 'You enter the Grotto of Deep Waters, where still pools reflect hidden truths and underground rivers carry ancient wisdom. Here, emotion meets intuition, and the depths reveal their secrets.',
    element: 'Water',
    ritualHour: 'Twilight'
  }
};

/**
 * Get elemental chamber narrative
 */
export function getElementalChamberNarrative(result: ElementalOverlayResult): string {
  const chamber = ElementalChambers[result.dominantElement];

  if (result.balanceType === 'Harmoniously Balanced') {
    return `${chamber.description} Yet all four chambers call to you equally—you are a pilgrim of balance, welcome everywhere.`;
  }

  const dominanceLevel = Math.max(
    result.fireScore,
    result.earthScore,
    result.airScore,
    result.waterScore
  );

  if (dominanceLevel > 0.4) {
    return `${chamber.description} This is your native chamber—its energy resonates deeply with your soul.`;
  }

  return `${chamber.description} You feel its energy stir something within, though other chambers may call more strongly.`;
}
