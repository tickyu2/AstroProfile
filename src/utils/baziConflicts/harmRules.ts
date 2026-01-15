/**
 * ============================================================================
 * HARM RULES (害)
 * ============================================================================
 *
 * Harm (害 / Hài) represents misalignment, irritation, and subtle friction.
 * Unlike Clash which is direct confrontation, Harm is a more insidious,
 * undermining relationship between branches.
 *
 * Classical meaning:
 * - Subtle friction and irritation
 * - Misunderstanding and miscommunication
 * - Hidden resentment and passive aggression
 * - Things not working out as planned
 *
 * The 6 Harm Pairs:
 * 子未害 (Rat-Goat)      - Water undermines Earth
 * 丑午害 (Ox-Horse)      - Earth smothers Fire
 * 寅巳害 (Tiger-Snake)   - Wood and Fire friction
 * 卯辰害 (Rabbit-Dragon) - Wood irritates Earth
 * 申亥害 (Monkey-Pig)    - Metal contaminates Water
 * 酉戌害 (Rooster-Dog)   - Metal and Earth friction
 *
 * Joey Yap teaching:
 * "Harm is like a mosquito bite - not lethal, but annoying and persistent.
 *  It creates friction that wears down over time."
 *
 * Created: January 2026
 * Based on: Classical BaZi Harm (害) doctrine
 * ============================================================================
 */

import { PillarName } from './clashRules';

// ============================================================================
// TYPES
// ============================================================================

export interface HarmDefinition {
  branch1: string;
  branch2: string;
  elements: [string, string];
  nature: string;
  effect: string;
  manifestation: string;
  remedy: string;
}

export interface HarmHit {
  type: 'harm';
  branch1: string;
  branch2: string;
  pillar1: string;
  pillar2: string;
  definition: HarmDefinition;
  significance: 'major' | 'moderate' | 'minor';
  explanation: string;
}

// ============================================================================
// HARM PAIR MAPPING
// ============================================================================

/**
 * Harm pair lookup: Branch → Its harm partner
 */
export const HARM_PAIRS: Record<string, string> = {
  '子': '未',
  '未': '子',
  '丑': '午',
  '午': '丑',
  '寅': '巳',
  '巳': '寅',
  '卯': '辰',
  '辰': '卯',
  '申': '亥',
  '亥': '申',
  '酉': '戌',
  '戌': '酉'
};

// ============================================================================
// HARM DEFINITIONS
// ============================================================================

export const HARM_DEFINITIONS: Record<string, HarmDefinition> = {
  '子未': {
    branch1: '子',
    branch2: '未',
    elements: ['Water', 'Earth'],
    nature: 'Emotional Harm',
    effect: 'Water undermines Earth foundations. Emotions erode stability.',
    manifestation: 'Persistent worries, emotional drainage, relationship misunderstandings.',
    remedy: 'Build clear communication. Don\'t let small irritations accumulate.'
  },
  '丑午': {
    branch1: '丑',
    branch2: '午',
    elements: ['Earth', 'Fire'],
    nature: 'Passion Suppression',
    effect: 'Earth smothers Fire enthusiasm. Practicality dampens joy.',
    manifestation: 'Feeling blocked, creativity suppressed, passion dimmed by duties.',
    remedy: 'Balance responsibility with joy. Make time for passion projects.'
  },
  '寅巳': {
    branch1: '寅',
    branch2: '巳',
    elements: ['Wood', 'Fire'],
    nature: 'Mutual Punishment Bridge',
    effect: 'Tiger and Snake in subtle conflict. Initiative meets calculation.',
    manifestation: 'Plans not working out, timing issues, trust problems.',
    remedy: 'Double-check before acting. Verify intentions and timelines.'
  },
  '卯辰': {
    branch1: '卯',
    branch2: '辰',
    elements: ['Wood', 'Earth'],
    nature: 'Growth Obstruction',
    effect: 'Rabbit irritates Dragon. Small things block big ambitions.',
    manifestation: 'Minor obstacles accumulating, details disrupting grand plans.',
    remedy: 'Attend to details. Small problems need attention before they grow.'
  },
  '申亥': {
    branch1: '申',
    branch2: '亥',
    elements: ['Metal', 'Water'],
    nature: 'Contaminated Flow',
    effect: 'Metal contaminates Water clarity. Intellect muddies intuition.',
    manifestation: 'Overthinking, analysis paralysis, wisdom clouded by logic.',
    remedy: 'Trust intuition. Sometimes the heart knows what the mind cannot see.'
  },
  '酉戌': {
    branch1: '酉',
    branch2: '戌',
    elements: ['Metal', 'Earth'],
    nature: 'Buried Potential',
    effect: 'Rooster and Dog friction. Refinement conflicts with loyalty.',
    manifestation: 'Feeling undervalued, talents not recognized, loyalty tested.',
    remedy: 'Express your value clearly. Don\'t expect others to see what you don\'t show.'
  }
};

/**
 * Get harm definition for two branches
 */
export function getHarmDefinition(branch1: string, branch2: string): HarmDefinition | null {
  const key1 = `${branch1}${branch2}`;
  const key2 = `${branch2}${branch1}`;
  return HARM_DEFINITIONS[key1] || HARM_DEFINITIONS[key2] || null;
}

// ============================================================================
// PILLAR SIGNIFICANCE
// ============================================================================

/**
 * Harm significance based on which pillars are involved
 */
const PILLAR_HARM_SIGNIFICANCE: Record<string, Record<string, 'major' | 'moderate' | 'minor'>> = {
  year: {
    month: 'moderate',
    day: 'moderate',
    hour: 'minor'
  },
  month: {
    day: 'major',       // Career/parents harming self - significant
    hour: 'moderate'
  },
  day: {
    hour: 'major'       // Self harming children/legacy - very personal
  }
};

/**
 * Get significance of harm between two pillars
 */
export function getHarmSignificance(pillar1: string, pillar2: string): 'major' | 'moderate' | 'minor' {
  const [p1, p2] = [pillar1, pillar2].sort();
  return PILLAR_HARM_SIGNIFICANCE[p1]?.[p2] || 'minor';
}

// ============================================================================
// DETECTION FUNCTION
// ============================================================================

/**
 * Detect all harms in a set of branches
 */
export function detectHarms(branches: Record<PillarName, string>): HarmHit[] {
  const hits: HarmHit[] = [];
  const entries = Object.entries(branches) as [PillarName, string][];

  for (let i = 0; i < entries.length; i++) {
    const [pillar1, branch1] = entries[i];
    const harmTarget = HARM_PAIRS[branch1];

    if (!harmTarget) continue;

    for (let j = i + 1; j < entries.length; j++) {
      const [pillar2, branch2] = entries[j];

      if (branch2 === harmTarget) {
        const definition = getHarmDefinition(branch1, branch2);
        const significance = getHarmSignificance(pillar1, pillar2);

        if (definition) {
          hits.push({
            type: 'harm',
            branch1,
            branch2,
            pillar1,
            pillar2,
            definition,
            significance,
            explanation: `${branch1}${branch2}害 - ${pillar1.charAt(0).toUpperCase() + pillar1.slice(1)} and ${pillar2.charAt(0).toUpperCase() + pillar2.slice(1)} pillars harm (${definition.nature})`
          });
        }
      }
    }
  }

  return hits;
}

/**
 * Quick check if two branches harm each other
 */
export function doTheyHarm(branch1: string, branch2: string): boolean {
  return HARM_PAIRS[branch1] === branch2;
}

/**
 * Get the harm partner for a branch
 */
export function getHarmPartner(branch: string): string | null {
  return HARM_PAIRS[branch] || null;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  HARM_PAIRS,
  HARM_DEFINITIONS,
  detectHarms,
  doTheyHarm,
  getHarmPartner,
  getHarmDefinition,
  getHarmSignificance
};
