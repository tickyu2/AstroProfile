/**
 * ============================================================================
 * DESTRUCTION RULES (破)
 * ============================================================================
 *
 * Destruction (破 / Pò) represents breaking down, dissolution, and minor disruption.
 * It is the least severe of the four conflict types (Clash > Harm > Punishment > Destruction).
 *
 * Classical meaning:
 * - Minor breaking or dissolution
 * - Plans not completing as expected
 * - Small setbacks and interruptions
 * - Losing momentum or focus
 *
 * The 6 Destruction Pairs:
 * 子酉破 (Rat-Rooster)    - Water breaks Metal's structure
 * 午卯破 (Horse-Rabbit)   - Fire breaks Wood's patience
 * 辰丑破 (Dragon-Ox)      - Storage breaks storage
 * 戌未破 (Dog-Goat)       - Storage breaks storage
 * 寅亥破 (Tiger-Pig)      - Wood absorbs Water's wisdom
 * 巳申破 (Snake-Monkey)   - Fire and Metal friction
 *
 * Joey Yap teaching:
 * "Destruction is like a small crack in a vase - not broken, but weakened.
 *  It's a minor annoyance, not a major disaster. Don't overreact."
 *
 * Created: January 2026
 * Based on: Classical BaZi Destruction (破) doctrine
 * ============================================================================
 */

import { PillarName } from './clashRules';

// ============================================================================
// TYPES
// ============================================================================

export interface DestructionDefinition {
  branch1: string;
  branch2: string;
  elements: [string, string];
  nature: string;
  effect: string;
  manifestation: string;
  remedy: string;
}

export interface DestructionHit {
  type: 'destruction';
  branch1: string;
  branch2: string;
  pillar1: string;
  pillar2: string;
  definition: DestructionDefinition;
  significance: 'major' | 'moderate' | 'minor';
  explanation: string;
}

// ============================================================================
// DESTRUCTION PAIR MAPPING
// ============================================================================

/**
 * Destruction pair lookup: Branch → Its destruction partner
 */
export const DESTRUCTION_PAIRS: Record<string, string> = {
  '子': '酉',
  '酉': '子',
  '午': '卯',
  '卯': '午',
  '辰': '丑',
  '丑': '辰',
  '戌': '未',
  '未': '戌',
  '寅': '亥',
  '亥': '寅',
  '巳': '申',
  '申': '巳'
};

// ============================================================================
// DESTRUCTION DEFINITIONS
// ============================================================================

export const DESTRUCTION_DEFINITIONS: Record<string, DestructionDefinition> = {
  '子酉': {
    branch1: '子',
    branch2: '酉',
    elements: ['Water', 'Metal'],
    nature: 'Structure Dissolution',
    effect: 'Water wears down Metal precision. Emotional needs disrupt order.',
    manifestation: 'Plans derailed by feelings. Precision work interrupted. Minor forgetfulness.',
    remedy: 'Balance emotion and logic. Build in extra time for interruptions.'
  },
  '午卯': {
    branch1: '午',
    branch2: '卯',
    elements: ['Fire', 'Wood'],
    nature: 'Patience Broken',
    effect: 'Fire consumes Wood too quickly. Impatience burns through resources.',
    manifestation: 'Starting before ready. Rushing and making mistakes. Burnout from overcommitment.',
    remedy: 'Slow down. Let things develop naturally. Patience is power.'
  },
  '辰丑': {
    branch1: '辰',
    branch2: '丑',
    elements: ['Earth', 'Earth'],
    nature: 'Storage vs Storage',
    effect: 'Two storages compete. Resources scattered instead of consolidated.',
    manifestation: 'Investments competing with savings. Multiple priorities diluting focus.',
    remedy: 'Consolidate resources. Focus on one major goal at a time.'
  },
  '戌未': {
    branch1: '戌',
    branch2: '未',
    elements: ['Earth', 'Earth'],
    nature: 'Loyalty vs Nurturing',
    effect: 'Dog and Goat storages clash. Protection conflicts with care.',
    manifestation: 'Wanting to help but also protect. Torn between different loved ones.',
    remedy: 'Set clear boundaries. You cannot protect everyone from everything.'
  },
  '寅亥': {
    branch1: '寅',
    branch2: '亥',
    elements: ['Wood', 'Water'],
    nature: 'Wisdom Absorbed',
    effect: 'Wood drinks up Water wisdom. Action outpaces reflection.',
    manifestation: 'Acting before fully understanding. Learning by doing, sometimes the hard way.',
    remedy: 'Pause to reflect before acting. Wisdom needs time to mature.'
  },
  '巳申': {
    branch1: '巳',
    branch2: '申',
    elements: ['Fire', 'Metal'],
    nature: 'Friction Heat',
    effect: 'Fire and Metal create sparks. Creative tension with risk of damage.',
    manifestation: 'Brilliant ideas that burn out quickly. Innovation with implementation gaps.',
    remedy: 'Pace your creativity. Not every idea needs immediate execution.'
  }
};

/**
 * Get destruction definition for two branches
 */
export function getDestructionDefinition(branch1: string, branch2: string): DestructionDefinition | null {
  const key1 = `${branch1}${branch2}`;
  const key2 = `${branch2}${branch1}`;
  return DESTRUCTION_DEFINITIONS[key1] || DESTRUCTION_DEFINITIONS[key2] || null;
}

// ============================================================================
// PILLAR SIGNIFICANCE
// ============================================================================

/**
 * Destruction significance based on which pillars are involved
 * Note: Destruction is the mildest conflict, so even "major" is less severe than other conflicts
 */
const PILLAR_DESTRUCTION_SIGNIFICANCE: Record<string, Record<string, 'major' | 'moderate' | 'minor'>> = {
  year: {
    month: 'minor',
    day: 'moderate',
    hour: 'minor'
  },
  month: {
    day: 'moderate',      // Career affecting self - noticeable
    hour: 'minor'
  },
  day: {
    hour: 'moderate'      // Self affecting legacy - personal
  }
};

/**
 * Get significance of destruction between two pillars
 */
export function getDestructionSignificance(pillar1: string, pillar2: string): 'major' | 'moderate' | 'minor' {
  const [p1, p2] = [pillar1, pillar2].sort();
  return PILLAR_DESTRUCTION_SIGNIFICANCE[p1]?.[p2] || 'minor';
}

// ============================================================================
// DETECTION FUNCTION
// ============================================================================

/**
 * Detect all destructions in a set of branches
 */
export function detectDestructions(branches: Record<PillarName, string>): DestructionHit[] {
  const hits: DestructionHit[] = [];
  const entries = Object.entries(branches) as [PillarName, string][];

  for (let i = 0; i < entries.length; i++) {
    const [pillar1, branch1] = entries[i];
    const destructionTarget = DESTRUCTION_PAIRS[branch1];

    if (!destructionTarget) continue;

    for (let j = i + 1; j < entries.length; j++) {
      const [pillar2, branch2] = entries[j];

      if (branch2 === destructionTarget) {
        const definition = getDestructionDefinition(branch1, branch2);
        const significance = getDestructionSignificance(pillar1, pillar2);

        if (definition) {
          hits.push({
            type: 'destruction',
            branch1,
            branch2,
            pillar1,
            pillar2,
            definition,
            significance,
            explanation: `${branch1}${branch2}破 - ${pillar1.charAt(0).toUpperCase() + pillar1.slice(1)} and ${pillar2.charAt(0).toUpperCase() + pillar2.slice(1)} pillars destruction (${definition.nature})`
          });
        }
      }
    }
  }

  return hits;
}

/**
 * Quick check if two branches destroy each other
 */
export function doTheyDestroy(branch1: string, branch2: string): boolean {
  return DESTRUCTION_PAIRS[branch1] === branch2;
}

/**
 * Get the destruction partner for a branch
 */
export function getDestructionPartner(branch: string): string | null {
  return DESTRUCTION_PAIRS[branch] || null;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  DESTRUCTION_PAIRS,
  DESTRUCTION_DEFINITIONS,
  detectDestructions,
  doTheyDestroy,
  getDestructionPartner,
  getDestructionDefinition,
  getDestructionSignificance
};
