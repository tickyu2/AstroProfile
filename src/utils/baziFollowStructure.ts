/**
 * ============================================================================
 * BAZI FOLLOW STRUCTURE ENGINE (从格)
 * ============================================================================
 *
 * Follow Structure (从格 / Cóng Gé) occurs when the Day Master is so weak
 * that it cannot support a normal structure. Instead of fighting against
 * the dominant force, it "follows" or "surrenders" to it.
 *
 * The 5 Classical Follow Structures:
 * 1. 从强格 — Follow Strong (abundant companions/resources)
 * 2. 从弱格 — Follow Weak (general surrender, no specific dominance)
 * 3. 从儿格 — Follow Output (dominant Food God/Hurting Officer)
 * 4. 从财格 — Follow Wealth (dominant Direct/Indirect Wealth)
 * 5. 从官杀格 — Follow Officer/Power (dominant Direct Officer/Seven Killings)
 *
 * Classical Conditions for 从格:
 * A. DM is extremely weak (< 0.4 after all adjustments)
 * B. One element dominates (≥ 40% of total AND ≥ 2× DM element)
 * C. No strong support for DM (no roots, weak seasonality, no helpful combos)
 *
 * Joey Yap's Teaching:
 * "When the Day Master is too weak to lead, wisdom lies in following."
 * "Follow structures are not weakness - they are strategic adaptation."
 *
 * Created: January 2026
 * Based on: Classical BaZi 从格 methodology + Joey Yap refinements
 * ============================================================================
 */

import { TenGodCategory } from './baziTenGodsSeasonality';

// ============================================================================
// TYPES
// ============================================================================

export type FollowStructureType =
  | 'follow_strong'     // 从强格 - Follow Strong (companions/resources dominate)
  | 'follow_weak'       // 从弱格 - General surrender (mixed weakness)
  | 'follow_output'     // 从儿格 - Follow Output (food god/hurting officer)
  | 'follow_wealth'     // 从财格 - Follow Wealth
  | 'follow_officer'    // 从官杀格 - Follow Officer/Power
  | 'none';             // Not a follow structure

export interface FollowStructureDefinition {
  type: FollowStructureType;
  han: string;           // Chinese name
  label: string;         // English label
  pinyin: string;        // Romanization
  dominantCategory: TenGodCategory | 'mixed';
  theme: string;         // Life theme
  strategy: string;      // Operating strategy
  strengths: string[];   // Natural advantages
  challenges: string[];  // Growth areas
  careers: string[];     // Suitable paths
  relationship: string;  // Relationship style
  luckyElements: string[]; // Elements that support this follow type
  unluckyElements: string[]; // Elements that break the follow
}

export interface FollowStructureResult {
  // Detection result
  isFollowStructure: boolean;
  followType: FollowStructureType;
  followDefinition: FollowStructureDefinition | null;

  // Conditions met
  conditionA_WeakDm: boolean;
  conditionB_Dominant: boolean;
  conditionC_NoSupport: boolean;

  // Scores
  dmStrength: number;
  dominantCategory: TenGodCategory | 'mixed' | null;
  dominantScore: number;           // 0-1 dominance ratio
  dmElementRatio: number;          // DM element as % of total
  followConfidence: number;        // 0-1 how clearly it's a follow

  // Breaking factors (things that could invalidate follow)
  hasRoots: boolean;
  hasStrongSeasonality: boolean;
  hasSupportingCombos: boolean;

  // Explanation
  explanation: string;
  breakdown: FollowBreakdown;
}

export interface FollowBreakdown {
  dmStrengthCheck: string;
  dominanceCheck: string;
  supportCheck: string;
  categoryScores: Record<TenGodCategory, number>;
  notes: string[];
}

// ============================================================================
// FOLLOW STRUCTURE DEFINITIONS
// ============================================================================

export const FOLLOW_STRUCTURE_DEFINITIONS: Record<FollowStructureType, FollowStructureDefinition> = {
  follow_strong: {
    type: 'follow_strong',
    han: '从强格',
    label: 'Follow Strong Structure',
    pinyin: 'Cóng Qiáng Gé',
    dominantCategory: 'companion',
    theme: 'Strength Through Unity - Following the Strong',
    strategy: 'The chart has abundant companions and resources. Rather than competing, success comes through joining forces with equals.',
    strengths: [
      'Natural team player and collaborator',
      'Strong when surrounded by similar energies',
      'Excellent at building alliances',
      'Resilient through peer support'
    ],
    challenges: [
      'May struggle with independence',
      'Can be overly influenced by peers',
      'Needs to develop personal direction'
    ],
    careers: [
      'Partnership ventures', 'Team leadership', 'Collaborative projects',
      'Family business', 'Peer networks', 'Cooperative enterprises'
    ],
    relationship: 'Thrives in relationships with strong, supportive partners. Benefits from being part of a "power couple" or strong family unit.',
    luckyElements: ['Friend element', 'Rob Wealth element', 'Resource element'],
    unluckyElements: ['Wealth element', 'Officer element']
  },

  follow_weak: {
    type: 'follow_weak',
    han: '从弱格',
    label: 'Follow Weak Structure',
    pinyin: 'Cóng Ruò Gé',
    dominantCategory: 'mixed',
    theme: 'Flexibility Through Surrender - The Way of Water',
    strategy: 'The DM is weak without a single dominant force. Success comes through general adaptability and going with the flow.',
    strengths: [
      'Highly adaptable and flexible',
      'Can fit into any environment',
      'Non-threatening, gains trust easily',
      'Survives through yielding'
    ],
    challenges: [
      'May lack clear identity',
      'Can be too passive',
      'Needs external structure'
    ],
    careers: [
      'Support roles', 'Service industries', 'Flexible employment',
      'Consulting', 'Adaptable positions'
    ],
    relationship: 'Adaptable in relationships, can mold to partner\'s needs. Benefits from strong partners who provide direction.',
    luckyElements: ['Whatever dominant elements exist'],
    unluckyElements: ['Anything that strengthens DM element']
  },

  follow_output: {
    type: 'follow_output',
    han: '从儿格',
    label: 'Follow Output Structure',
    pinyin: 'Cóng Ér Gé',
    dominantCategory: 'output',
    theme: 'Creative Surrender - Following Your Creation',
    strategy: 'Output elements (Eating God/Hurting Officer) dominate. Success comes through creative expression and letting talents flow freely.',
    strengths: [
      'Pure creative channel',
      'Exceptional artistic or expressive abilities',
      'Ideas flow without ego interference',
      'Natural performer or creator'
    ],
    challenges: [
      'May be impractical',
      'Can lose self in creative pursuits',
      'Needs support for material needs'
    ],
    careers: [
      'Arts', 'Performance', 'Writing', 'Music', 'Teaching',
      'Creative industries', 'Entertainment', 'Spiritual vocations'
    ],
    relationship: 'Creative partnerships flourish. May prioritize art/expression over relationship stability. Needs partners who appreciate their gifts.',
    luckyElements: ['Eating God element', 'Hurting Officer element', 'Wealth element'],
    unluckyElements: ['Resource element', 'Officer element']
  },

  follow_wealth: {
    type: 'follow_wealth',
    han: '从财格',
    label: 'Follow Wealth Structure',
    pinyin: 'Cóng Cái Gé',
    dominantCategory: 'wealth',
    theme: 'Material Flow - Following Prosperity',
    strategy: 'Wealth elements dominate the chart. Success comes through aligning with financial opportunities rather than fighting for them.',
    strengths: [
      'Natural affinity for wealth flow',
      'Good at attracting resources',
      'Flexible about money sources',
      'Can leverage opportunities quickly'
    ],
    challenges: [
      'May be too focused on material',
      'Can be dependent on wealth sources',
      'Needs to develop inner worth'
    ],
    careers: [
      'Sales', 'Trading', 'Service industries', 'Finance support',
      'Wealth management (for others)', 'Business support roles'
    ],
    relationship: 'Relationships often involve financial dynamics. May attract or be attracted to wealthy partners. Benefits from material stability in partnerships.',
    luckyElements: ['Direct Wealth element', 'Indirect Wealth element', 'Output element'],
    unluckyElements: ['Friend/Rob Wealth element', 'Resource element']
  },

  follow_officer: {
    type: 'follow_officer',
    han: '从官杀格',
    label: 'Follow Officer/Power Structure',
    pinyin: 'Cóng Guān Shā Gé',
    dominantCategory: 'officer',
    theme: 'Authority Alignment - Following Power',
    strategy: 'Officer/power elements dominate. Success comes through aligning with authority structures rather than resisting them.',
    strengths: [
      'Excellent at following systems',
      'Thrives in structured environments',
      'Can rise through obedience and loyalty',
      'Good at navigating hierarchies'
    ],
    challenges: [
      'May lack independence',
      'Can be controlled by authority figures',
      'Needs external validation'
    ],
    careers: [
      'Military', 'Civil service', 'Large corporations', 'Government',
      'Structured organizations', 'Service under strong leaders'
    ],
    relationship: 'May seek partners who provide structure and leadership. Can defer too much to partners. Benefits from balanced power dynamics.',
    luckyElements: ['Direct Officer element', 'Seven Killings element', 'Wealth element'],
    unluckyElements: ['Output element (hurts officer)', 'Friend/Rob Wealth element']
  },

  none: {
    type: 'none',
    han: '非从格',
    label: 'Not a Follow Structure',
    pinyin: 'Fēi Cóng Gé',
    dominantCategory: 'mixed',
    theme: 'Normal Structure',
    strategy: 'DM is strong enough to hold its own structure.',
    strengths: [],
    challenges: [],
    careers: [],
    relationship: '',
    luckyElements: [],
    unluckyElements: []
  }
};

// ============================================================================
// THRESHOLDS (Tunable Constants)
// ============================================================================

export const FOLLOW_THRESHOLDS = {
  // Condition A: DM must be this weak or weaker
  DM_WEAKNESS_THRESHOLD: 0.4,

  // Condition B: Dominant category must be at least this % of total
  DOMINANT_MIN_PERCENTAGE: 0.40,

  // Condition B: Dominant must be at least this multiple of DM element
  DOMINANT_VS_DM_RATIO: 2.0,

  // Condition C: Seasonality below this is "not strong"
  WEAK_SEASONALITY_THRESHOLD: 0.6,

  // For clarity scoring
  CLEAR_FOLLOW_THRESHOLD: 0.7,
  MODERATE_FOLLOW_THRESHOLD: 0.5
};

// ============================================================================
// CORE COMPUTATION
// ============================================================================

export interface ComputeFollowOpts {
  // DM strength after all adjustments (composite strength)
  dmStrength: number;

  // Ten Gods category scores (from computeEnhancedTenGodsSeasonality)
  tenGodsAdjusted: Record<TenGodCategory, number>;

  // Optional: DM element raw count (for ratio calculation)
  dmElementCount?: number;

  // Optional: total element count
  totalElementCount?: number;

  // Root check (from baziDmCompositeStrength)
  hasRoots?: boolean;

  // Seasonality strength (0-1, from baziDmGrowthStrength)
  seasonalityStrength?: number;

  // Any supporting combinations detected
  hasSupportingCombos?: boolean;
}

/**
 * Compute whether a chart qualifies as Follow Structure (从格)
 * and which type it is.
 *
 * Classical methodology:
 * 1. Check Condition A: Is DM extremely weak?
 * 2. Check Condition B: Is one category clearly dominant?
 * 3. Check Condition C: Is there no strong support for DM?
 * 4. If all three conditions met → Follow Structure
 * 5. Determine which follow type based on dominant category
 */
export function computeFollowStructure(opts: ComputeFollowOpts): FollowStructureResult {
  const {
    dmStrength,
    tenGodsAdjusted,
    dmElementCount = 0,
    totalElementCount = 8,
    hasRoots = false,
    seasonalityStrength = 0.5,
    hasSupportingCombos = false
  } = opts;

  // Calculate category totals
  const categories: TenGodCategory[] = ['resource', 'companion', 'output', 'wealth', 'officer'];
  const categoryScores: Record<TenGodCategory, number> = {
    resource: tenGodsAdjusted.resource || 0,
    companion: tenGodsAdjusted.companion || 0,
    output: tenGodsAdjusted.output || 0,
    wealth: tenGodsAdjusted.wealth || 0,
    officer: tenGodsAdjusted.officer || 0
  };

  const totalScore = Object.values(categoryScores).reduce((a, b) => a + b, 0);

  // Find dominant category
  let dominantCategory: TenGodCategory | null = null;
  let dominantScore = 0;
  for (const cat of categories) {
    if (categoryScores[cat] > dominantScore) {
      dominantScore = categoryScores[cat];
      dominantCategory = cat;
    }
  }

  const dominantRatio = totalScore > 0 ? dominantScore / totalScore : 0;
  const dmElementRatio = totalElementCount > 0 ? dmElementCount / totalElementCount : 0;

  // ─────────────────────────────────────────────────────────────────
  // CONDITION A: DM is extremely weak
  // ─────────────────────────────────────────────────────────────────
  const conditionA_WeakDm = dmStrength < FOLLOW_THRESHOLDS.DM_WEAKNESS_THRESHOLD;

  // ─────────────────────────────────────────────────────────────────
  // CONDITION B: One category dominates
  // ─────────────────────────────────────────────────────────────────
  const dominantVsDmRatio = dmElementRatio > 0 ? dominantRatio / dmElementRatio : dominantRatio * 10;
  const conditionB_Dominant =
    dominantRatio >= FOLLOW_THRESHOLDS.DOMINANT_MIN_PERCENTAGE &&
    dominantVsDmRatio >= FOLLOW_THRESHOLDS.DOMINANT_VS_DM_RATIO;

  // ─────────────────────────────────────────────────────────────────
  // CONDITION C: No strong support for DM
  // ─────────────────────────────────────────────────────────────────
  const hasStrongSeasonality = seasonalityStrength >= FOLLOW_THRESHOLDS.WEAK_SEASONALITY_THRESHOLD;
  const conditionC_NoSupport = !hasRoots && !hasStrongSeasonality && !hasSupportingCombos;

  // ─────────────────────────────────────────────────────────────────
  // DETERMINE FOLLOW STATUS
  // ─────────────────────────────────────────────────────────────────
  const isFollowStructure = conditionA_WeakDm && conditionB_Dominant && conditionC_NoSupport;

  // Determine follow type
  let followType: FollowStructureType = 'none';

  if (isFollowStructure && dominantCategory) {
    followType = mapCategoryToFollowType(dominantCategory, categoryScores);
  } else if (conditionA_WeakDm && !conditionB_Dominant && conditionC_NoSupport) {
    // Weak DM but no clear dominance → Follow Weak
    followType = 'follow_weak';
  }

  const followDefinition = FOLLOW_STRUCTURE_DEFINITIONS[followType];

  // Calculate confidence
  const followConfidence = calculateFollowConfidence(
    conditionA_WeakDm,
    conditionB_Dominant,
    conditionC_NoSupport,
    dominantRatio,
    dmStrength
  );

  // Build breakdown
  const breakdown = buildFollowBreakdown(
    dmStrength,
    dominantCategory,
    dominantRatio,
    categoryScores,
    hasRoots,
    hasStrongSeasonality,
    hasSupportingCombos,
    conditionA_WeakDm,
    conditionB_Dominant,
    conditionC_NoSupport
  );

  // Generate explanation
  const explanation = generateFollowExplanation(
    isFollowStructure,
    followType,
    followDefinition,
    dmStrength,
    dominantCategory,
    dominantRatio,
    conditionA_WeakDm,
    conditionB_Dominant,
    conditionC_NoSupport,
    followConfidence,
    breakdown
  );

  return {
    isFollowStructure: followType !== 'none',
    followType,
    followDefinition: followType !== 'none' ? followDefinition : null,
    conditionA_WeakDm,
    conditionB_Dominant,
    conditionC_NoSupport,
    dmStrength,
    dominantCategory: dominantCategory || 'mixed',
    dominantScore: dominantRatio,
    dmElementRatio,
    followConfidence,
    hasRoots,
    hasStrongSeasonality,
    hasSupportingCombos,
    explanation,
    breakdown
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function mapCategoryToFollowType(
  category: TenGodCategory,
  categoryScores: Record<TenGodCategory, number>
): FollowStructureType {
  // Check for follow_strong: companion OR resource dominant
  if (category === 'companion' || category === 'resource') {
    // If both companion and resource are strong, it's follow_strong
    const companionResource = categoryScores.companion + categoryScores.resource;
    const otherTotal = categoryScores.output + categoryScores.wealth + categoryScores.officer;

    if (companionResource > otherTotal) {
      return 'follow_strong';
    }
  }

  // Direct mapping for other categories
  switch (category) {
    case 'output':
      return 'follow_output';
    case 'wealth':
      return 'follow_wealth';
    case 'officer':
      return 'follow_officer';
    case 'companion':
    case 'resource':
      return 'follow_strong';
    default:
      return 'follow_weak';
  }
}

function calculateFollowConfidence(
  conditionA: boolean,
  conditionB: boolean,
  conditionC: boolean,
  dominantRatio: number,
  dmStrength: number
): number {
  if (!conditionA) return 0;

  let confidence = 0;

  // Base confidence from conditions met
  if (conditionA) confidence += 0.3;
  if (conditionB) confidence += 0.35;
  if (conditionC) confidence += 0.35;

  // Bonus for very clear dominance
  if (dominantRatio > 0.6) confidence += 0.1;
  if (dominantRatio > 0.7) confidence += 0.1;

  // Bonus for very weak DM
  if (dmStrength < 0.3) confidence += 0.1;
  if (dmStrength < 0.2) confidence += 0.1;

  return Math.min(1.0, confidence);
}

function buildFollowBreakdown(
  dmStrength: number,
  dominantCategory: TenGodCategory | null,
  dominantRatio: number,
  categoryScores: Record<TenGodCategory, number>,
  hasRoots: boolean,
  hasStrongSeasonality: boolean,
  hasSupportingCombos: boolean,
  conditionA: boolean,
  conditionB: boolean,
  conditionC: boolean
): FollowBreakdown {
  const pct = (n: number) => (n * 100).toFixed(0);

  const dmStrengthCheck = conditionA
    ? `✓ DM strength ${dmStrength.toFixed(2)} < ${FOLLOW_THRESHOLDS.DM_WEAKNESS_THRESHOLD} threshold`
    : `✗ DM strength ${dmStrength.toFixed(2)} ≥ ${FOLLOW_THRESHOLDS.DM_WEAKNESS_THRESHOLD} (too strong for follow)`;

  const dominanceCheck = conditionB
    ? `✓ ${dominantCategory} dominates at ${pct(dominantRatio)}% (≥ ${pct(FOLLOW_THRESHOLDS.DOMINANT_MIN_PERCENTAGE)}% required)`
    : `✗ No category reaches ${pct(FOLLOW_THRESHOLDS.DOMINANT_MIN_PERCENTAGE)}% dominance (highest: ${pct(dominantRatio)}%)`;

  const supportItems = [];
  if (hasRoots) supportItems.push('has roots');
  if (hasStrongSeasonality) supportItems.push('strong seasonality');
  if (hasSupportingCombos) supportItems.push('supporting combos');

  const supportCheck = conditionC
    ? '✓ No strong support for DM (no roots, weak season, no helpful combos)'
    : `✗ DM has support: ${supportItems.join(', ')}`;

  const notes: string[] = [];
  if (conditionA && conditionB && conditionC) {
    notes.push('All conditions met → Follow Structure confirmed');
  } else {
    if (!conditionA) notes.push('DM is too strong for Follow Structure');
    if (!conditionB) notes.push('No single category dominates enough');
    if (!conditionC) notes.push('DM has support that prevents full surrender');
  }

  return {
    dmStrengthCheck,
    dominanceCheck,
    supportCheck,
    categoryScores,
    notes
  };
}

function generateFollowExplanation(
  isFollow: boolean,
  followType: FollowStructureType,
  definition: FollowStructureDefinition,
  dmStrength: number,
  dominantCategory: TenGodCategory | null,
  dominantRatio: number,
  conditionA: boolean,
  conditionB: boolean,
  conditionC: boolean,
  confidence: number,
  breakdown: FollowBreakdown
): string {
  const pct = (n: number) => (n * 100).toFixed(0);

  let explanation = `
${'═'.repeat(60)}
FOLLOW STRUCTURE ANALYSIS (从格)
${'═'.repeat(60)}

Follow structures occur when the Day Master is too weak to hold
a normal structure and instead "surrenders" to the dominant force.

${'─'.repeat(50)}
THREE CONDITIONS FOR 从格:
${'─'.repeat(50)}

CONDITION A — DM Extremely Weak:
${breakdown.dmStrengthCheck}

CONDITION B — One Category Dominates:
${breakdown.dominanceCheck}

CONDITION C — No Strong Support for DM:
${breakdown.supportCheck}

${'─'.repeat(50)}
CATEGORY BREAKDOWN:
${'─'.repeat(50)}
${Object.entries(breakdown.categoryScores)
    .sort(([, a], [, b]) => b - a)
    .map(([cat, score]) => `  ${cat.padEnd(12)} ${pct(score)}%`)
    .join('\n')}

`;

  if (isFollow) {
    explanation += `
${'═'.repeat(60)}
RESULT: ${definition.han} (${definition.label})
${'═'.repeat(60)}

${definition.strategy}

Confidence: ${pct(confidence)}%
Dominant Category: ${dominantCategory || 'mixed'}
Dominant Ratio: ${pct(dominantRatio)}%

THEME:
${definition.theme}

NATURAL STRENGTHS:
${definition.strengths.map(s => `• ${s}`).join('\n')}

GROWTH AREAS:
${definition.challenges.map(c => `• ${c}`).join('\n')}

CAREER PATHS:
${definition.careers.join(', ')}

RELATIONSHIP STYLE:
${definition.relationship}

LUCKY ELEMENTS:
${definition.luckyElements.join(', ')}

ELEMENTS TO AVOID:
${definition.unluckyElements.join(', ')}
(These elements strengthen DM and can "break" the follow structure)
`;
  } else {
    explanation += `
${'═'.repeat(60)}
RESULT: NOT A FOLLOW STRUCTURE
${'═'.repeat(60)}

${breakdown.notes.join('\n')}

The Day Master is strong enough to hold its own structure.
Use the standard Structure (格局) analysis instead.
`;
  }

  explanation += `
${'─'.repeat(50)}
NOTES:
${breakdown.notes.map(n => `• ${n}`).join('\n')}

${'─'.repeat(50)}
INTERPRETATION GUIDANCE:

Follow structures require a different approach than normal structures:
• Go WITH the dominant force, not against it
• Build on the dominant element's strengths
• Avoid strengthening the Day Master (it breaks the follow)
• Success comes through adaptation, not assertion
`;

  return explanation.trim();
}

// ============================================================================
// QUICK HELPERS
// ============================================================================

/**
 * Quick check if a chart might be a follow structure
 */
export function quickFollowCheck(dmStrength: number, tenGodsAdjusted: Record<string, number>): boolean {
  if (dmStrength >= FOLLOW_THRESHOLDS.DM_WEAKNESS_THRESHOLD) return false;

  const total = Object.values(tenGodsAdjusted).reduce((a, b) => a + b, 0);
  const max = Math.max(...Object.values(tenGodsAdjusted));

  return total > 0 && (max / total) >= FOLLOW_THRESHOLDS.DOMINANT_MIN_PERCENTAGE;
}

/**
 * Get follow structure label for UI
 */
export function getFollowStructureLabel(result: FollowStructureResult): string {
  if (!result.isFollowStructure) return '';
  const def = result.followDefinition;
  return def ? `${def.han} (${def.label})` : '';
}

/**
 * Get follow structure icon
 */
export function getFollowStructureIcon(followType: FollowStructureType): string {
  const icons: Record<FollowStructureType, string> = {
    follow_strong: '💪',
    follow_weak: '🌊',
    follow_output: '✨',
    follow_wealth: '💰',
    follow_officer: '⚔',
    none: ''
  };
  return icons[followType] || '';
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  computeFollowStructure,
  quickFollowCheck,
  getFollowStructureLabel,
  getFollowStructureIcon,
  FOLLOW_STRUCTURE_DEFINITIONS,
  FOLLOW_THRESHOLDS
};
