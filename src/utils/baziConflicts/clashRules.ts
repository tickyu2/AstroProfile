/**
 * ============================================================================
 * CLASH RULES (冲)
 * ============================================================================
 *
 * Clash (冲 / Chōng) represents opposition, movement, and activation.
 * The 6 Clash pairs are branches that are exactly opposite in the zodiac
 * (180 degrees apart).
 *
 * Classical meaning:
 * - Movement and change
 * - Conflict and opposition
 * - Separation and breaking apart
 * - Activation of stagnant energy
 *
 * The 6 Clash Pairs:
 * 子午冲 (Rat-Horse)    - Water vs Fire
 * 丑未冲 (Ox-Goat)      - Earth vs Earth (Storage clash)
 * 寅申冲 (Tiger-Monkey) - Wood vs Metal
 * 卯酉冲 (Rabbit-Rooster) - Wood vs Metal
 * 辰戌冲 (Dragon-Dog)   - Earth vs Earth (Storage clash)
 * 巳亥冲 (Snake-Pig)    - Fire vs Water
 *
 * Joey Yap teaching:
 * "Clash is not always bad. It brings movement, change, and activation.
 *  A stagnant chart may need a clash to get things moving."
 *
 * Created: January 2026
 * Based on: Classical BaZi Clash (冲) doctrine
 * ============================================================================
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ClashDefinition {
  branch1: string;
  branch2: string;
  elements: [string, string];
  nature: string;
  effect: string;
  positiveAspect: string;
  negativeAspect: string;
}

export interface ClashHit {
  type: 'clash';
  branch1: string;
  branch2: string;
  pillar1: string;
  pillar2: string;
  definition: ClashDefinition;
  significance: 'major' | 'moderate' | 'minor';
  explanation: string;
}

// ============================================================================
// CLASH PAIR MAPPING
// ============================================================================

/**
 * Clash pair lookup: Branch → Its clash partner
 */
export const CLASH_PAIRS: Record<string, string> = {
  '子': '午',
  '午': '子',
  '丑': '未',
  '未': '丑',
  '寅': '申',
  '申': '寅',
  '卯': '酉',
  '酉': '卯',
  '辰': '戌',
  '戌': '辰',
  '巳': '亥',
  '亥': '巳'
};

// ============================================================================
// CLASH DEFINITIONS
// ============================================================================

export const CLASH_DEFINITIONS: Record<string, ClashDefinition> = {
  '子午': {
    branch1: '子',
    branch2: '午',
    elements: ['Water', 'Fire'],
    nature: 'Elemental Opposition',
    effect: 'Water and Fire in direct conflict. Emotions vs. passion, cold logic vs. warm heart.',
    positiveAspect: 'Can create steam and power when balanced. Drives transformation.',
    negativeAspect: 'Can cause emotional volatility, relationship tensions, or health issues with heart/kidneys.'
  },
  '丑未': {
    branch1: '丑',
    branch2: '未',
    elements: ['Earth', 'Earth'],
    nature: 'Storage Clash',
    effect: 'Two Earth storages in conflict. Hidden resources compete or break open.',
    positiveAspect: 'Can release stored potential and hidden resources.',
    negativeAspect: 'Can destabilize foundations, property issues, or stomach/digestive problems.'
  },
  '寅申': {
    branch1: '寅',
    branch2: '申',
    elements: ['Wood', 'Metal'],
    nature: 'Traveling Horse Clash',
    effect: 'The two Traveling Horses clash. Maximum movement and change.',
    positiveAspect: 'Excellent for travel, relocation, career changes, and breaking stagnation.',
    negativeAspect: 'Can cause restlessness, accidents during travel, or liver/lung issues.'
  },
  '卯酉': {
    branch1: '卯',
    branch2: '酉',
    elements: ['Wood', 'Metal'],
    nature: 'Peach Blossom Clash',
    effect: 'The two Peach Blossoms clash. Relationship dynamics activated.',
    positiveAspect: 'Can bring romantic opportunities and social expansion.',
    negativeAspect: 'Can cause relationship conflicts, scandals, or liver/respiratory issues.'
  },
  '辰戌': {
    branch1: '辰',
    branch2: '戌',
    elements: ['Earth', 'Earth'],
    nature: 'Storage Clash',
    effect: 'Dragon and Dog storage clash. Hidden matters come to light.',
    positiveAspect: 'Can reveal hidden truths and release stored potential.',
    negativeAspect: 'Can cause property/land issues, digestive problems, or skin conditions.'
  },
  '巳亥': {
    branch1: '巳',
    branch2: '亥',
    elements: ['Fire', 'Water'],
    nature: 'Elemental Opposition',
    effect: 'Fire and Water in direct conflict. Action vs. wisdom.',
    positiveAspect: 'Can create balance between action and reflection.',
    negativeAspect: 'Can cause circulatory issues, indecision, or heart/kidney imbalance.'
  }
};

/**
 * Get clash definition for two branches
 */
export function getClashDefinition(branch1: string, branch2: string): ClashDefinition | null {
  const key1 = `${branch1}${branch2}`;
  const key2 = `${branch2}${branch1}`;
  return CLASH_DEFINITIONS[key1] || CLASH_DEFINITIONS[key2] || null;
}

// ============================================================================
// PILLAR SIGNIFICANCE
// ============================================================================

/**
 * Clash significance based on which pillars are involved
 */
const PILLAR_CLASH_SIGNIFICANCE: Record<string, Record<string, 'major' | 'moderate' | 'minor'>> = {
  year: {
    month: 'moderate',  // Ancestors vs career/parents
    day: 'major',       // Early life vs self (foundational clash)
    hour: 'moderate'    // Social image vs children/legacy
  },
  month: {
    day: 'major',       // Career/parents vs self (very significant)
    hour: 'moderate'    // Career vs children/legacy
  },
  day: {
    hour: 'major'       // Self vs children/legacy (inner conflict)
  }
};

/**
 * Get significance of clash between two pillars
 */
export function getClashSignificance(pillar1: string, pillar2: string): 'major' | 'moderate' | 'minor' {
  const [p1, p2] = [pillar1, pillar2].sort();
  return PILLAR_CLASH_SIGNIFICANCE[p1]?.[p2] || 'minor';
}

// ============================================================================
// DETECTION FUNCTION
// ============================================================================

export type PillarName = 'year' | 'month' | 'day' | 'hour';

/**
 * Detect all clashes in a set of branches
 */
export function detectClashes(branches: Record<PillarName, string>): ClashHit[] {
  const hits: ClashHit[] = [];
  const entries = Object.entries(branches) as [PillarName, string][];

  for (let i = 0; i < entries.length; i++) {
    const [pillar1, branch1] = entries[i];
    const clashTarget = CLASH_PAIRS[branch1];

    if (!clashTarget) continue;

    for (let j = i + 1; j < entries.length; j++) {
      const [pillar2, branch2] = entries[j];

      if (branch2 === clashTarget) {
        const definition = getClashDefinition(branch1, branch2);
        const significance = getClashSignificance(pillar1, pillar2);

        if (definition) {
          hits.push({
            type: 'clash',
            branch1,
            branch2,
            pillar1,
            pillar2,
            definition,
            significance,
            explanation: `${branch1}${branch2}冲 - ${pillar1.charAt(0).toUpperCase() + pillar1.slice(1)} and ${pillar2.charAt(0).toUpperCase() + pillar2.slice(1)} pillars clash (${definition.nature})`
          });
        }
      }
    }
  }

  return hits;
}

/**
 * Quick check if two branches clash
 */
export function doTheyClash(branch1: string, branch2: string): boolean {
  return CLASH_PAIRS[branch1] === branch2;
}

/**
 * Get the clash partner for a branch
 */
export function getClashPartner(branch: string): string | null {
  return CLASH_PAIRS[branch] || null;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  CLASH_PAIRS,
  CLASH_DEFINITIONS,
  detectClashes,
  doTheyClash,
  getClashPartner,
  getClashDefinition,
  getClashSignificance
};
