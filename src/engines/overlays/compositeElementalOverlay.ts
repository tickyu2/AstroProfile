/**
 * Composite Elemental Overlay
 *
 * Calculates the elemental balance of a relationship itself,
 * not just the individuals. The composite field shows how
 * two people's energies blend into a shared elemental reality.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import { ElementalOverlayResult, Element } from './elementalOverlay';

// ========================================
// TYPES
// ========================================

export interface CompositeElementalOverlayResult {
  fire: number;                   // 0..1
  earth: number;                  // 0..1
  air: number;                    // 0..1
  water: number;                  // 0..1
  dominantElement: Element;
  lackingElement: Element | null;
  harmonyScore: number;           // 0..1 how balanced the composite
  compositeElementalDelta: number;
  balanceType: CompositeBalance;
  narrative: string;
  strengths: string[];
  challenges: string[];
  relationshipTemperament: RelationshipTemperament;
}

export type CompositeBalance =
  | 'Perfectly Balanced'
  | 'Fire-Dominant Relationship'
  | 'Earth-Dominant Relationship'
  | 'Air-Dominant Relationship'
  | 'Water-Dominant Relationship'
  | 'Fire-Air Dynamic'
  | 'Earth-Water Dynamic'
  | 'Fire-Water Tension'
  | 'Earth-Air Tension';

export type RelationshipTemperament =
  | 'Passionate & Dynamic'
  | 'Stable & Grounded'
  | 'Intellectual & Communicative'
  | 'Emotional & Intuitive'
  | 'Balanced & Adaptable';

// ========================================
// MAIN COMPUTATION
// ========================================

/**
 * Compute composite elemental overlay from two individual results
 */
export function computeCompositeElementalOverlay(
  person1: ElementalOverlayResult,
  person2: ElementalOverlayResult
): CompositeElementalOverlayResult {
  // Average the elemental scores
  const fire = (person1.fireScore + person2.fireScore) / 2;
  const earth = (person1.earthScore + person2.earthScore) / 2;
  const air = (person1.airScore + person2.airScore) / 2;
  const water = (person1.waterScore + person2.waterScore) / 2;

  // Find dominant and lacking elements
  const scores: [Element, number][] = [
    ['Fire', fire],
    ['Earth', earth],
    ['Air', air],
    ['Water', water]
  ];
  scores.sort((a, b) => b[1] - a[1]);

  const dominantElement = scores[0][0];
  const lackingElement = scores[3][1] < 0.15 ? scores[3][0] : null;

  // Calculate harmony score (balance between elements)
  const maxEl = Math.max(fire, earth, air, water);
  const minEl = Math.min(fire, earth, air, water);
  const harmonyScore = 1 - (maxEl - minEl);

  // Determine balance type
  const balanceType = determineCompositeBalance(fire, earth, air, water, harmonyScore);

  // Calculate delta
  const compositeElementalDelta = harmonyScore * 0.05;

  // Determine relationship temperament
  const relationshipTemperament = determineTemperament(fire, earth, air, water, harmonyScore);

  // Build narrative
  const narrative = buildCompositeElementalNarrative(
    dominantElement, lackingElement, balanceType, harmonyScore, person1, person2
  );

  // Get traits
  const { strengths, challenges } = getCompositeElementalTraits(balanceType, dominantElement, lackingElement);

  return {
    fire,
    earth,
    air,
    water,
    dominantElement,
    lackingElement,
    harmonyScore,
    compositeElementalDelta,
    balanceType,
    narrative,
    strengths,
    challenges,
    relationshipTemperament
  };
}

// ========================================
// BALANCE DETERMINATION
// ========================================

function determineCompositeBalance(
  fire: number,
  earth: number,
  air: number,
  water: number,
  harmony: number
): CompositeBalance {
  const threshold = 0.35;

  // Check for perfect balance first
  if (harmony > 0.85) {
    return 'Perfectly Balanced';
  }

  // Check for single element dominance
  if (fire > threshold && fire > earth + 0.1 && fire > air + 0.1 && fire > water + 0.1) {
    return 'Fire-Dominant Relationship';
  }
  if (earth > threshold && earth > fire + 0.1 && earth > air + 0.1 && earth > water + 0.1) {
    return 'Earth-Dominant Relationship';
  }
  if (air > threshold && air > fire + 0.1 && air > earth + 0.1 && air > water + 0.1) {
    return 'Air-Dominant Relationship';
  }
  if (water > threshold && water > fire + 0.1 && water > earth + 0.1 && water > air + 0.1) {
    return 'Water-Dominant Relationship';
  }

  // Check for dual dynamics
  if (fire > 0.25 && air > 0.25 && fire + air > earth + water) {
    return 'Fire-Air Dynamic';
  }
  if (earth > 0.25 && water > 0.25 && earth + water > fire + air) {
    return 'Earth-Water Dynamic';
  }

  // Check for tensions
  if (fire > 0.25 && water > 0.25 && Math.abs(fire - water) < 0.1) {
    return 'Fire-Water Tension';
  }
  if (earth > 0.25 && air > 0.25 && Math.abs(earth - air) < 0.1) {
    return 'Earth-Air Tension';
  }

  // Default to dominant element
  const max = Math.max(fire, earth, air, water);
  if (max === fire) return 'Fire-Dominant Relationship';
  if (max === earth) return 'Earth-Dominant Relationship';
  if (max === air) return 'Air-Dominant Relationship';
  return 'Water-Dominant Relationship';
}

function determineTemperament(
  fire: number,
  earth: number,
  air: number,
  water: number,
  harmony: number
): RelationshipTemperament {
  if (harmony > 0.8) return 'Balanced & Adaptable';

  const max = Math.max(fire, earth, air, water);

  if (max === fire) return 'Passionate & Dynamic';
  if (max === earth) return 'Stable & Grounded';
  if (max === air) return 'Intellectual & Communicative';
  if (max === water) return 'Emotional & Intuitive';

  return 'Balanced & Adaptable';
}

// ========================================
// NARRATIVE BUILDER
// ========================================

function buildCompositeElementalNarrative(
  dominant: Element,
  lacking: Element | null,
  balance: CompositeBalance,
  harmony: number,
  person1: ElementalOverlayResult,
  person2: ElementalOverlayResult
): string {
  const harmonyPercent = Math.round(harmony * 100);

  const balanceNarratives: Record<CompositeBalance, string> = {
    'Perfectly Balanced': `Your composite elemental field shows remarkable balance (${harmonyPercent}% harmony). All four elements dance together in your relationship, giving you remarkable adaptability as a couple.`,

    'Fire-Dominant Relationship': `Your relationship burns with ${dominant} energy (${harmonyPercent}% harmony). Together, you create passion, drive, and visible warmth. This is a dynamic, action-oriented connection.`,

    'Earth-Dominant Relationship': `Your relationship is grounded in ${dominant} energy (${harmonyPercent}% harmony). Together, you build stability, security, and lasting foundations. This is a reliable, nurturing connection.`,

    'Air-Dominant Relationship': `Your relationship breathes with ${dominant} energy (${harmonyPercent}% harmony). Together, you create intellectual stimulation and endless conversation. This is a communicative, idea-rich connection.`,

    'Water-Dominant Relationship': `Your relationship flows with ${dominant} energy (${harmonyPercent}% harmony). Together, you create emotional depth and intuitive understanding. This is a sensitive, deeply connected bond.`,

    'Fire-Air Dynamic': `Your relationship combines Fire and Air energies (${harmonyPercent}% harmony). Ideas ignite into action, and enthusiasm finds expression. You fuel each other's creative momentum.`,

    'Earth-Water Dynamic': `Your relationship combines Earth and Water energies (${harmonyPercent}% harmony). Practical wisdom meets emotional depth. You nurture growth and create lasting bonds.`,

    'Fire-Water Tension': `Your relationship holds Fire-Water tension (${harmonyPercent}% harmony). Passion and emotion create intensity. Learning to steam without extinguishing is your journey.`,

    'Earth-Air Tension': `Your relationship holds Earth-Air tension (${harmonyPercent}% harmony). Practicality and ideas create friction. Finding common ground between stability and innovation is your journey.`
  };

  let narrative = balanceNarratives[balance];

  // Add lacking element insight
  if (lacking) {
    const lackingInsights: Record<Element, string> = {
      Fire: ' Your composite lacks Fire—you may need to consciously cultivate passion and spontaneity.',
      Earth: ' Your composite lacks Earth—building practical routines and stability may require effort.',
      Air: ' Your composite lacks Air—intellectual connection and communication need attention.',
      Water: ' Your composite lacks Water—emotional depth and intuitive bonding may need cultivation.'
    };
    narrative += lackingInsights[lacking];
  }

  // Add individual contribution insight
  if (person1.dominantElement !== person2.dominantElement) {
    narrative += ` This blend emerges from ${person1.dominantElement} meeting ${person2.dominantElement}.`;
  }

  return narrative;
}

// ========================================
// TRAITS
// ========================================

function getCompositeElementalTraits(
  balance: CompositeBalance,
  dominant: Element,
  lacking: Element | null
): { strengths: string[]; challenges: string[] } {
  const elementStrengths: Record<Element, string[]> = {
    Fire: ['Passionate connection', 'Shared enthusiasm', 'Dynamic energy', 'Inspirational bond'],
    Earth: ['Reliable foundation', 'Material security', 'Patient growth', 'Sensual presence'],
    Air: ['Intellectual chemistry', 'Easy communication', 'Shared curiosity', 'Social harmony'],
    Water: ['Deep emotional bond', 'Intuitive understanding', 'Empathic connection', 'Spiritual depth']
  };

  const elementChallenges: Record<Element, string[]> = {
    Fire: ['Burnout risk', 'Competition', 'Impulsive decisions', 'Drama tendency'],
    Earth: ['Stagnation risk', 'Stubbornness', 'Over-routine', 'Material focus'],
    Air: ['Emotional avoidance', 'Over-analysis', 'Lack of grounding', 'Scattered focus'],
    Water: ['Emotional overwhelm', 'Boundary confusion', 'Mood swings', 'Escapist tendencies']
  };

  const strengths = [...elementStrengths[dominant]];
  const challenges: string[] = [];

  // Add balance-specific traits
  if (balance === 'Perfectly Balanced') {
    strengths.push('Adaptability', 'Completeness');
  } else if (balance.includes('Tension')) {
    challenges.push('Internal friction', 'Need for conscious balancing');
  } else if (balance.includes('Dynamic')) {
    strengths.push('Complementary energies');
  }

  // Add lacking element challenges
  if (lacking) {
    challenges.push(...elementChallenges[lacking].slice(0, 2));
  } else {
    challenges.push(...elementChallenges[dominant].slice(0, 2));
  }

  return {
    strengths: strengths.slice(0, 5),
    challenges: challenges.slice(0, 4)
  };
}

// ========================================
// PERSONA VOICES
// ========================================

export const CompositeElementalPersonaVoices: Record<RelationshipTemperament, {
  mentor: string;
  oracle: string;
  companion: string;
  mirror: string;
}> = {
  'Passionate & Dynamic': {
    mentor: 'Your fire together is powerful—channel it wisely. Passion can build or burn.',
    oracle: 'Twin flames dance in the composite field. Together, you illuminate—or consume.',
    companion: 'You two have so much energy together! Just remember to rest sometimes.',
    mirror: 'Notice how your combined presence generates heat. That intensity is your signature.'
  },
  'Stable & Grounded': {
    mentor: 'Your groundedness is a gift to each other. Build slowly; what you create endures.',
    oracle: 'Two pillars meet to form an arch. Together, you hold space for lasting structures.',
    companion: 'You make each other feel so secure! That stability is really special.',
    mirror: 'Notice the solid ground you create together. That reliability is your foundation.'
  },
  'Intellectual & Communicative': {
    mentor: 'Your minds spark beautifully together. Ensure hearts keep pace with ideas.',
    oracle: 'Two winds converge, carrying messages between worlds. Your words weave reality.',
    companion: 'You could talk forever! Just make sure to connect emotionally too.',
    mirror: 'Notice how easily thoughts flow between you. That mental connection is rare.'
  },
  'Emotional & Intuitive': {
    mentor: 'Your emotional depth together is profound. Learn to surface without drowning.',
    oracle: 'Two waters merge into depths unknown. Together, you feel what cannot be spoken.',
    companion: 'You understand each other so deeply. Just remember to come up for air!',
    mirror: 'Notice the emotional current flowing between you. That sensitivity is your bond.'
  },
  'Balanced & Adaptable': {
    mentor: 'Your balance is uncommon. Use it to meet any challenge with the right energy.',
    oracle: 'Four elements dance in equilibrium. Together, you are the complete mandala.',
    companion: 'You can handle anything together! That flexibility is a real strength.',
    mirror: 'Notice how you naturally balance each other. That harmony is your gift.'
  }
};

/**
 * Get composite elemental persona voice
 */
export function getCompositeElementalPersonaVoice(
  result: CompositeElementalOverlayResult,
  role: 'mentor' | 'oracle' | 'companion' | 'mirror'
): string {
  return CompositeElementalPersonaVoices[result.relationshipTemperament][role];
}

// ========================================
// PILGRIM JOURNEY CHAMBER
// ========================================

export interface CompositeElementalChamber {
  id: string;
  name: string;
  description: string;
  temperament: RelationshipTemperament;
}

export const CompositeElementalChambers: Record<RelationshipTemperament, CompositeElementalChamber> = {
  'Passionate & Dynamic': {
    id: 'crucible-of-shared-flame',
    name: 'The Crucible of Shared Flame',
    description: 'You enter the Crucible together, where your combined fires merge into a single powerful blaze. Here, passion transforms—what you forge in this heat defines your shared journey.',
    temperament: 'Passionate & Dynamic'
  },
  'Stable & Grounded': {
    id: 'sanctuary-of-shared-earth',
    name: 'The Sanctuary of Shared Earth',
    description: 'You enter the Sanctuary together, where your combined groundedness forms unshakeable foundation. Here, patience builds—what you plant grows across generations.',
    temperament: 'Stable & Grounded'
  },
  'Intellectual & Communicative': {
    id: 'observatory-of-shared-winds',
    name: 'The Observatory of Shared Winds',
    description: 'You ascend the Observatory together, where your combined minds catch currents of insight. Here, ideas take flight—what you think together shapes possibility.',
    temperament: 'Intellectual & Communicative'
  },
  'Emotional & Intuitive': {
    id: 'wellspring-of-shared-waters',
    name: 'The Wellspring of Shared Waters',
    description: 'You descend to the Wellspring together, where your combined depths merge into one current. Here, feeling knows—what you sense together reveals hidden truth.',
    temperament: 'Emotional & Intuitive'
  },
  'Balanced & Adaptable': {
    id: 'mandala-chamber-of-unity',
    name: 'The Mandala Chamber of Unity',
    description: 'You stand in the Mandala Chamber together, where all four elements swirl in perfect balance. Here, wholeness prevails—you embody the complete circle.',
    temperament: 'Balanced & Adaptable'
  }
};

/**
 * Get composite elemental chamber narrative
 */
export function getCompositeElementalChamberNarrative(result: CompositeElementalOverlayResult): string {
  const chamber = CompositeElementalChambers[result.relationshipTemperament];
  return chamber.description;
}
