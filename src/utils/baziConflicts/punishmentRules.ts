/**
 * ============================================================================
 * PUNISHMENT RULES (刑)
 * ============================================================================
 *
 * Punishment (刑 / Xíng) represents internal tension, pressure, and self-conflict.
 * Unlike Clash (external opposition) or Harm (subtle friction), Punishment is
 * about inner struggle and karmic pressure.
 *
 * Classical meaning:
 * - Internal pressure and tension
 * - Self-sabotage patterns
 * - Legal or authority issues
 * - Health concerns (especially when repeated)
 *
 * Three Types of Punishment:
 *
 * 1. Self-Punishment (自刑):
 *    辰辰, 午午, 酉酉, 亥亥
 *    - Same branch appears twice = self-inflicted pressure
 *    - Internal conflict, self-criticism, perfectionism
 *
 * 2. Mutual Punishment (相刑) - The Three Punishment Groups:
 *    寅巳申 (Tiger-Snake-Monkey) - Ungrateful Punishment (恩中之刑)
 *    丑戌未 (Ox-Dog-Goat) - Bullying Punishment (恃势之刑)
 *    - Triangular tensions between three branches
 *
 * 3. Uncivilized Punishment (无礼之刑):
 *    子卯 (Rat-Rabbit) - Disrespectful behavior, boundary issues
 *
 * Joey Yap teaching:
 * "Punishment is like a pressure cooker - the heat builds internally.
 *  It can forge strength or cause explosion. Self-awareness is key."
 *
 * Created: January 2026
 * Based on: Classical BaZi Punishment (刑) doctrine
 * ============================================================================
 */

import { PillarName } from './clashRules';

// ============================================================================
// TYPES
// ============================================================================

export type PunishmentType = 'self' | 'mutual_ungrateful' | 'mutual_bullying' | 'uncivilized';

export interface PunishmentDefinition {
  type: PunishmentType;
  branches: string[];
  chineseName: string;
  nature: string;
  effect: string;
  manifestation: string;
  remedy: string;
}

export interface PunishmentHit {
  type: 'punishment';
  punishmentType: PunishmentType;
  branches: string[];
  pillars: string[];
  definition: PunishmentDefinition;
  isComplete: boolean;  // For mutual punishment: all 3 branches present?
  significance: 'major' | 'moderate' | 'minor';
  explanation: string;
}

// ============================================================================
// SELF-PUNISHMENT DEFINITIONS (自刑)
// ============================================================================

/**
 * Self-Punishment: When the same branch appears twice or more
 * These branches "punish themselves" when doubled
 */
export const SELF_PUNISHMENT_BRANCHES = ['辰', '午', '酉', '亥'] as const;

export const SELF_PUNISHMENT_DEFINITIONS: Record<string, PunishmentDefinition> = {
  '辰': {
    type: 'self',
    branches: ['辰', '辰'],
    chineseName: '辰辰自刑',
    nature: 'Earth Self-Punishment',
    effect: 'Dragon punishes Dragon. Overthinking, worry loops, analysis paralysis.',
    manifestation: 'Excessive worry about resources, property, or security. Stuck in planning mode.',
    remedy: 'Take action instead of endless planning. Trust that you have enough.'
  },
  '午': {
    type: 'self',
    branches: ['午', '午'],
    chineseName: '午午自刑',
    nature: 'Fire Self-Punishment',
    effect: 'Horse punishes Horse. Passion burns itself out. Impulsive regret.',
    manifestation: 'Acting on impulse then regretting. Emotional burnout. Heart issues.',
    remedy: 'Pause before acting. Channel passion into sustainable pursuits.'
  },
  '酉': {
    type: 'self',
    branches: ['酉', '酉'],
    chineseName: '酉酉自刑',
    nature: 'Metal Self-Punishment',
    effect: 'Rooster punishes Rooster. Perfectionism becomes self-criticism.',
    manifestation: 'Never satisfied with own work. Harsh self-judgment. Lung/skin sensitivity.',
    remedy: 'Practice self-compassion. Good enough is good enough.'
  },
  '亥': {
    type: 'self',
    branches: ['亥', '亥'],
    chineseName: '亥亥自刑',
    nature: 'Water Self-Punishment',
    effect: 'Pig punishes Pig. Wisdom drowns in too much thinking.',
    manifestation: 'Escapism, indulgence, avoiding reality. Kidney/reproductive concerns.',
    remedy: 'Face issues directly. Moderation in all pleasures.'
  }
};

// ============================================================================
// MUTUAL PUNISHMENT DEFINITIONS (相刑)
// ============================================================================

/**
 * Mutual Punishment Groups - Triangular tensions
 */
export const MUTUAL_PUNISHMENT_GROUPS = {
  ungrateful: ['寅', '巳', '申'] as const,  // 恩中之刑 - Ungrateful Punishment
  bullying: ['丑', '戌', '未'] as const     // 恃势之刑 - Bullying Punishment
};

export const MUTUAL_PUNISHMENT_DEFINITIONS: Record<string, PunishmentDefinition> = {
  'ungrateful': {
    type: 'mutual_ungrateful',
    branches: ['寅', '巳', '申'],
    chineseName: '寅巳申 恩中之刑',
    nature: 'Ungrateful Punishment',
    effect: 'Tiger, Snake, Monkey in conflict. Favors forgotten, gratitude lacking.',
    manifestation: 'Relationships where help is not appreciated. Betrayal by those you helped. Legal issues from partnerships.',
    remedy: 'Give without expectation. Be grateful for what you receive. Document agreements.'
  },
  'bullying': {
    type: 'mutual_bullying',
    branches: ['丑', '戌', '未'],
    chineseName: '丑戌未 恃势之刑',
    nature: 'Bullying Punishment',
    effect: 'Ox, Dog, Goat in conflict. Power struggles, authority abuse.',
    manifestation: 'Conflicts with authority figures. Feeling bullied or becoming a bully. Stubborn standoffs.',
    remedy: 'Use power wisely. Stand up for yourself without dominating others.'
  }
};

/**
 * Pairwise relationships within mutual punishment groups
 */
export const MUTUAL_PUNISHMENT_PAIRS: Record<string, { group: 'ungrateful' | 'bullying'; partners: string[] }> = {
  // Ungrateful group
  '寅': { group: 'ungrateful', partners: ['巳', '申'] },
  '巳': { group: 'ungrateful', partners: ['寅', '申'] },
  '申': { group: 'ungrateful', partners: ['寅', '巳'] },
  // Bullying group
  '丑': { group: 'bullying', partners: ['戌', '未'] },
  '戌': { group: 'bullying', partners: ['丑', '未'] },
  '未': { group: 'bullying', partners: ['丑', '戌'] }
};

// ============================================================================
// UNCIVILIZED PUNISHMENT (无礼之刑)
// ============================================================================

export const UNCIVILIZED_PUNISHMENT_PAIR = ['子', '卯'] as const;

export const UNCIVILIZED_PUNISHMENT_DEFINITION: PunishmentDefinition = {
  type: 'uncivilized',
  branches: ['子', '卯'],
  chineseName: '子卯 无礼之刑',
  nature: 'Uncivilized Punishment',
  effect: 'Rat and Rabbit in conflict. Lack of propriety, boundary violations.',
  manifestation: 'Disrespectful behavior, social faux pas, inappropriate relationships. Ignoring social norms.',
  remedy: 'Respect boundaries. Learn and follow appropriate social protocols.'
};

// ============================================================================
// PILLAR SIGNIFICANCE
// ============================================================================

/**
 * Punishment significance based on which pillars are involved
 */
const PILLAR_PUNISHMENT_SIGNIFICANCE: Record<string, Record<string, 'major' | 'moderate' | 'minor'>> = {
  year: {
    month: 'moderate',
    day: 'major',       // Early life tension affecting self
    hour: 'moderate'
  },
  month: {
    day: 'major',       // Career/parents punishing self - significant
    hour: 'moderate'
  },
  day: {
    hour: 'major'       // Self punishing children/legacy - very personal
  }
};

/**
 * Get significance of punishment between two pillars
 */
export function getPunishmentSignificance(pillar1: string, pillar2: string): 'major' | 'moderate' | 'minor' {
  if (pillar1 === pillar2) {
    // Self-punishment in same pillar is always significant
    return pillar1 === 'day' ? 'major' : 'moderate';
  }
  const [p1, p2] = [pillar1, pillar2].sort();
  return PILLAR_PUNISHMENT_SIGNIFICANCE[p1]?.[p2] || 'minor';
}

// ============================================================================
// DETECTION FUNCTIONS
// ============================================================================

/**
 * Detect all punishments in a set of branches
 */
export function detectPunishments(branches: Record<PillarName, string>): PunishmentHit[] {
  const hits: PunishmentHit[] = [];
  const entries = Object.entries(branches) as [PillarName, string][];

  // Track branch occurrences for self-punishment and mutual punishment
  const branchOccurrences: Record<string, PillarName[]> = {};
  entries.forEach(([pillar, branch]) => {
    if (!branchOccurrences[branch]) {
      branchOccurrences[branch] = [];
    }
    branchOccurrences[branch].push(pillar);
  });

  // 1. Detect Self-Punishment (自刑)
  SELF_PUNISHMENT_BRANCHES.forEach(branch => {
    const pillars = branchOccurrences[branch];
    if (pillars && pillars.length >= 2) {
      const definition = SELF_PUNISHMENT_DEFINITIONS[branch];
      const significance = getPunishmentSignificance(pillars[0], pillars[1]);

      hits.push({
        type: 'punishment',
        punishmentType: 'self',
        branches: [branch, branch],
        pillars: pillars.slice(0, 2),
        definition,
        isComplete: true,
        significance,
        explanation: `${branch}${branch}自刑 - Self-punishment in ${pillars.join(' and ')} pillars (${definition.nature})`
      });
    }
  });

  // 2. Detect Mutual Punishment (相刑)
  Object.entries(MUTUAL_PUNISHMENT_GROUPS).forEach(([groupName, groupBranches]) => {
    const presentBranches: { branch: string; pillar: PillarName }[] = [];

    groupBranches.forEach(branch => {
      const pillars = branchOccurrences[branch];
      if (pillars) {
        pillars.forEach(pillar => {
          presentBranches.push({ branch, pillar });
        });
      }
    });

    // Need at least 2 different branches from the group
    const uniqueBranches = Array.from(new Set(presentBranches.map(p => p.branch)));

    if (uniqueBranches.length >= 2) {
      const definition = MUTUAL_PUNISHMENT_DEFINITIONS[groupName];
      const isComplete = uniqueBranches.length === 3;

      // Get pillars involved
      const pillarsInvolved = presentBranches.map(p => p.pillar);
      const uniquePillars = Array.from(new Set(pillarsInvolved));

      // Calculate significance based on most significant pillar pair
      let significance: 'major' | 'moderate' | 'minor' = 'minor';
      for (let i = 0; i < uniquePillars.length; i++) {
        for (let j = i + 1; j < uniquePillars.length; j++) {
          const pairSignificance = getPunishmentSignificance(uniquePillars[i], uniquePillars[j]);
          if (pairSignificance === 'major') significance = 'major';
          else if (pairSignificance === 'moderate' && significance !== 'major') significance = 'moderate';
        }
      }

      // Complete punishment is more significant
      if (isComplete && significance !== 'major') {
        significance = 'major';
      }

      hits.push({
        type: 'punishment',
        punishmentType: groupName === 'ungrateful' ? 'mutual_ungrateful' : 'mutual_bullying',
        branches: uniqueBranches,
        pillars: uniquePillars,
        definition,
        isComplete,
        significance,
        explanation: `${uniqueBranches.join('')}${isComplete ? '三刑' : '刑'} - ${isComplete ? 'Complete' : 'Partial'} ${definition.nature} across ${uniquePillars.join(', ')} pillars`
      });
    }
  });

  // 3. Detect Uncivilized Punishment (无礼之刑)
  const hasZi = branchOccurrences['子'];
  const hasMao = branchOccurrences['卯'];

  if (hasZi && hasMao) {
    const ziPillar = hasZi[0];
    const maoPillar = hasMao[0];
    const significance = getPunishmentSignificance(ziPillar, maoPillar);

    hits.push({
      type: 'punishment',
      punishmentType: 'uncivilized',
      branches: ['子', '卯'],
      pillars: [ziPillar, maoPillar],
      definition: UNCIVILIZED_PUNISHMENT_DEFINITION,
      isComplete: true,
      significance,
      explanation: `子卯刑 - Uncivilized Punishment between ${ziPillar} and ${maoPillar} pillars`
    });
  }

  return hits;
}

/**
 * Quick check if two branches form a punishment
 */
export function doTheyPunish(branch1: string, branch2: string): boolean {
  // Self-punishment
  if (branch1 === branch2 && SELF_PUNISHMENT_BRANCHES.includes(branch1 as any)) {
    return true;
  }

  // Uncivilized punishment
  if ((branch1 === '子' && branch2 === '卯') || (branch1 === '卯' && branch2 === '子')) {
    return true;
  }

  // Mutual punishment
  const pair1 = MUTUAL_PUNISHMENT_PAIRS[branch1];
  if (pair1 && pair1.partners.includes(branch2)) {
    return true;
  }

  return false;
}

/**
 * Get punishment partners for a branch
 */
export function getPunishmentPartners(branch: string): { type: PunishmentType; partners: string[] } | null {
  // Self-punishment
  if (SELF_PUNISHMENT_BRANCHES.includes(branch as any)) {
    return { type: 'self', partners: [branch] };
  }

  // Uncivilized
  if (branch === '子') return { type: 'uncivilized', partners: ['卯'] };
  if (branch === '卯') return { type: 'uncivilized', partners: ['子'] };

  // Mutual
  const mutualPair = MUTUAL_PUNISHMENT_PAIRS[branch];
  if (mutualPair) {
    return {
      type: mutualPair.group === 'ungrateful' ? 'mutual_ungrateful' : 'mutual_bullying',
      partners: mutualPair.partners
    };
  }

  return null;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  SELF_PUNISHMENT_BRANCHES,
  SELF_PUNISHMENT_DEFINITIONS,
  MUTUAL_PUNISHMENT_GROUPS,
  MUTUAL_PUNISHMENT_DEFINITIONS,
  MUTUAL_PUNISHMENT_PAIRS,
  UNCIVILIZED_PUNISHMENT_PAIR,
  UNCIVILIZED_PUNISHMENT_DEFINITION,
  detectPunishments,
  doTheyPunish,
  getPunishmentPartners,
  getPunishmentSignificance
};
