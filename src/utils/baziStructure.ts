/**
 * ============================================================================
 * BAZI STRUCTURE ENGINE (格局)
 * ============================================================================
 *
 * Structure (格局 / Ge Ju) is the architectural blueprint of a BaZi chart.
 * It's not personality - it's the chart's operating system.
 *
 * Structure answers:
 * - What is the chart trying to do?
 * - What is the chart's natural mode of functioning?
 * - Which Ten God is the "theme" of the chart?
 * - What is the chart's strategic orientation?
 *
 * Joey Yap's teaching:
 * Structure = Dominant Ten God + DM Strength + Seasonality + Supporting Factors
 *
 * The 8 Classical Structures:
 * 1. 正官格 — Proper Officer Structure
 * 2. 七杀格 — Seven Killings Structure
 * 3. 正财格 — Direct Wealth Structure
 * 4. 偏财格 — Indirect Wealth Structure
 * 5. 食神格 — Eating God Structure
 * 6. 伤官格 — Hurting Officer Structure
 * 7. 比肩格 — Friend Structure
 * 8. 劫财格 — Rob Wealth Structure
 *
 * Created: January 2026
 * Based on: Joey Yap's BaZi Structure methodology
 * ============================================================================
 */

import { TenGodCategory } from './baziTenGodsSeasonality';
import {
  computeFollowStructure,
  FollowStructureResult,
  FollowStructureType,
  FOLLOW_STRUCTURE_DEFINITIONS,
  ComputeFollowOpts
} from './baziFollowStructure';

// ============================================================================
// TYPES
// ============================================================================

export type StructureType =
  | 'proper_officer'      // 正官格
  | 'seven_killings'      // 七杀格
  | 'direct_wealth'       // 正财格
  | 'indirect_wealth'     // 偏财格
  | 'eating_god'          // 食神格
  | 'hurting_officer'     // 伤官格
  | 'friend'              // 比肩格
  | 'rob_wealth'          // 劫财格
  | 'follow_strong'       // 从强格 (Follow Strong - companions/resources)
  | 'follow_weak'         // 从弱格 (Follow Weak - general surrender)
  | 'follow_wealth'       // 从财格 (Follow Wealth)
  | 'follow_officer'      // 从官杀格 (Follow Officer/Power)
  | 'follow_output'       // 从儿格 (Follow Output)
  | 'special'             // 特殊格局
  | 'unclear';            // 格局不清

export type StructureCategory =
  | 'officer'   // 官杀类
  | 'wealth'    // 财类
  | 'output'    // 食伤类
  | 'companion' // 比劫类
  | 'follow'    // 从格
  | 'special';  // 特殊

export interface StructureDefinition {
  type: StructureType;
  han: string;           // Chinese name
  label: string;         // English label
  category: StructureCategory;
  tenGod: string;        // Related Ten God
  theme: string;         // Life theme
  strengths: string[];   // Natural advantages
  challenges: string[];  // Growth areas
  careers: string[];     // Suitable career paths
  relationship: string;  // Relationship style
}

export interface StructureResult {
  // Structure identification
  structure: StructureDefinition;
  structureType: StructureType;
  structureName: string;

  // Scoring
  dominantTenGod: string;
  dominantScore: number;
  structureScore: number;        // 0-1 clarity of structure
  structureClarity: 'clear' | 'moderate' | 'mixed';

  // DM context
  dmStrength: number;
  dmCategory: 'strong' | 'balanced' | 'weak' | 'very_weak';
  isFollowStructure: boolean;

  // Follow structure details (from dedicated engine)
  followStructureResult: FollowStructureResult | null;

  // Secondary structures
  secondaryStructure: StructureDefinition | null;
  secondaryScore: number;

  // Explanation
  explanation: string;
  breakdown: StructureBreakdown;
}

export interface StructureBreakdown {
  tenGodsRanking: Array<{ tenGod: string; score: number }>;
  dmStrengthFactor: number;
  clarityFactor: number;
  notes: string[];
}

// ============================================================================
// STRUCTURE DEFINITIONS
// ============================================================================

export const STRUCTURE_DEFINITIONS: Record<StructureType, StructureDefinition> = {
  proper_officer: {
    type: 'proper_officer',
    han: '正官格',
    label: 'Proper Officer Structure',
    category: 'officer',
    tenGod: 'Direct Officer',
    theme: 'Authority, Status, Recognition through Proper Channels',
    strengths: [
      'Natural authority and leadership',
      'Respect for rules and hierarchy',
      'Career advancement through legitimate means',
      'Good reputation management'
    ],
    challenges: [
      'May be too rigid or conventional',
      'Can struggle with creative disruption',
      'May fear breaking rules even when necessary'
    ],
    careers: [
      'Government official', 'Corporate management', 'Law enforcement',
      'Academia', 'Established institutions'
    ],
    relationship: 'Values stability, loyalty, and traditional commitment. Seeks partners with good social standing.'
  },

  seven_killings: {
    type: 'seven_killings',
    han: '七杀格',
    label: 'Seven Killings Structure',
    category: 'officer',
    tenGod: 'Seven Killings',
    theme: 'Power, Ambition, Achievement through Force of Will',
    strengths: [
      'Strong drive and determination',
      'Ability to handle pressure and competition',
      'Strategic thinking and power dynamics',
      'Can break through obstacles others cannot'
    ],
    challenges: [
      'May be too aggressive or domineering',
      'Can make enemies easily',
      'Risk of burnout from constant striving'
    ],
    careers: [
      'Military', 'Surgery', 'Competitive sports', 'Entrepreneurship',
      'Crisis management', 'Martial arts'
    ],
    relationship: 'Intense partnerships with power dynamics. Needs a partner who can match their strength or complement with softness.'
  },

  direct_wealth: {
    type: 'direct_wealth',
    han: '正财格',
    label: 'Direct Wealth Structure',
    category: 'wealth',
    tenGod: 'Direct Wealth',
    theme: 'Stability, Steady Income, Material Security',
    strengths: [
      'Good at building stable income streams',
      'Practical financial management',
      'Reliable and trustworthy in business',
      'Patient wealth accumulation'
    ],
    challenges: [
      'May be too conservative financially',
      'Can miss opportunities by being too careful',
      'May prioritize security over growth'
    ],
    careers: [
      'Accounting', 'Banking', 'Real estate', 'Steady employment',
      'Traditional businesses'
    ],
    relationship: 'Values financial stability in relationships. Seeks partners who are reliable and economically responsible.'
  },

  indirect_wealth: {
    type: 'indirect_wealth',
    han: '偏财格',
    label: 'Indirect Wealth Structure',
    category: 'wealth',
    tenGod: 'Indirect Wealth',
    theme: 'Opportunity, Speculation, Multiple Income Streams',
    strengths: [
      'Good at spotting opportunities',
      'Comfortable with calculated risks',
      'Multiple income streams and side ventures',
      'Networking for financial gain'
    ],
    challenges: [
      'May be too speculative',
      'Can lose money through overconfidence',
      'May struggle with long-term financial planning'
    ],
    careers: [
      'Trading', 'Sales', 'Entrepreneurship', 'Investment',
      'Commission-based work', 'Entertainment industry'
    ],
    relationship: 'Generous but may have complicated romantic life. Attracts multiple admirers, needs to manage boundaries.'
  },

  eating_god: {
    type: 'eating_god',
    han: '食神格',
    label: 'Eating God Structure',
    category: 'output',
    tenGod: 'Eating God',
    theme: 'Creativity, Expression, Enjoyment of Life',
    strengths: [
      'Natural creative talents',
      'Ability to enjoy and share life\'s pleasures',
      'Gentle, refined expression',
      'Good with food, art, and aesthetics'
    ],
    challenges: [
      'May be too indulgent',
      'Can lack drive or ambition',
      'May avoid confrontation when needed'
    ],
    careers: [
      'Culinary arts', 'Music', 'Writing', 'Teaching',
      'Entertainment', 'Hospitality'
    ],
    relationship: 'Nurturing and giving in relationships. Creates harmonious, pleasure-filled partnerships.'
  },

  hurting_officer: {
    type: 'hurting_officer',
    han: '伤官格',
    label: 'Hurting Officer Structure',
    category: 'output',
    tenGod: 'Hurting Officer',
    theme: 'Innovation, Disruption, Challenging Authority',
    strengths: [
      'Highly creative and innovative',
      'Questions status quo effectively',
      'Sharp wit and intelligence',
      'Excellent at reform and improvement'
    ],
    challenges: [
      'May clash with authority figures',
      'Can be too critical or rebellious',
      'Risk of burning bridges unnecessarily'
    ],
    careers: [
      'Technology', 'Reform movements', 'Creative industries',
      'Consulting', 'Disrupting established systems'
    ],
    relationship: 'Needs intellectual stimulation in relationships. May struggle with traditional relationship structures.'
  },

  friend: {
    type: 'friend',
    han: '比肩格',
    label: 'Friend Structure',
    category: 'companion',
    tenGod: 'Friend',
    theme: 'Collaboration, Peer Networks, Self-Reliance',
    strengths: [
      'Strong network of peers and collaborators',
      'Self-reliant and independent',
      'Good at teamwork and partnerships',
      'Competitive but fair'
    ],
    challenges: [
      'May struggle with hierarchy',
      'Can be too competitive with peers',
      'May resist asking for help'
    ],
    careers: [
      'Partnerships', 'Collaborative ventures', 'Sports teams',
      'Peer-based organizations', 'Franchise operations'
    ],
    relationship: 'Seeks equal partnerships. Values friendship within romance. May have strong social circles that include partner.'
  },

  rob_wealth: {
    type: 'rob_wealth',
    han: '劫财格',
    label: 'Rob Wealth Structure',
    category: 'companion',
    tenGod: 'Rob Wealth',
    theme: 'Competition, Assertiveness, Taking Initiative',
    strengths: [
      'Highly competitive and driven',
      'Takes initiative aggressively',
      'Good at winning in competitive situations',
      'Strong will and determination'
    ],
    challenges: [
      'May alienate others through competition',
      'Can struggle with sharing resources',
      'Risk of making enemies through success'
    ],
    careers: [
      'Sales competition', 'Sports', 'Acquisitions',
      'Competitive industries', 'Commission-based work'
    ],
    relationship: 'Intense romantic pursuit. May have rivalry with partners or for partners. Needs to balance competition with cooperation.'
  },

  follow_strong: {
    type: 'follow_strong',
    han: '从强格',
    label: 'Follow Strong Structure',
    category: 'follow',
    tenGod: 'Companion/Resource (Follow)',
    theme: 'Strength Through Unity - Following the Strong',
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
      'Family business', 'Peer networks'
    ],
    relationship: 'Thrives with strong, supportive partners. Benefits from being part of a power couple or strong family unit.'
  },

  follow_weak: {
    type: 'follow_weak',
    han: '从弱格',
    label: 'Follow Weak Structure',
    category: 'follow',
    tenGod: 'Mixed (Follow)',
    theme: 'Flexibility Through Surrender - The Way of Water',
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
    relationship: 'Adaptable in relationships, can mold to partner\'s needs. Benefits from strong partners who provide direction.'
  },

  follow_wealth: {
    type: 'follow_wealth',
    han: '从财格',
    label: 'Follow Wealth Structure',
    category: 'follow',
    tenGod: 'Wealth (Follow)',
    theme: 'Material Flow - Following Prosperity',
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
      'Wealth management', 'Business support'
    ],
    relationship: 'Relationships often involve financial dynamics. May attract wealthy partners. Benefits from material stability.'
  },

  follow_officer: {
    type: 'follow_officer',
    han: '从官格',
    label: 'Follow Officer Structure',
    category: 'follow',
    tenGod: 'Officer (Follow)',
    theme: 'Surrendering to Authority and Structure',
    strengths: [
      'Excellent at following systems',
      'Thrives in structured environments',
      'Loyal and obedient',
      'Can rise through obedience'
    ],
    challenges: [
      'May lack independence',
      'Can be controlled by others',
      'Needs external structure'
    ],
    careers: [
      'Military service', 'Civil service', 'Large corporations',
      'Structured organizations'
    ],
    relationship: 'May seek partners who provide structure and direction. Benefits from strong, guiding partners.'
  },

  follow_output: {
    type: 'follow_output',
    han: '从儿格',
    label: 'Follow Output Structure',
    category: 'follow',
    tenGod: 'Output (Follow)',
    theme: 'Surrendering to Creative Expression',
    strengths: [
      'Pure creative flow',
      'Channels talent without ego',
      'Can achieve greatness through letting go',
      'Artistic and expressive'
    ],
    challenges: [
      'May lack practical grounding',
      'Can be too idealistic',
      'Needs external support systems'
    ],
    careers: [
      'Arts', 'Performance', 'Creative fields',
      'Teaching', 'Spiritual vocations'
    ],
    relationship: 'Creative partnerships. May prioritize art over relationship stability.'
  },

  special: {
    type: 'special',
    han: '特殊格局',
    label: 'Special Structure',
    category: 'special',
    tenGod: 'Multiple',
    theme: 'Unique Configuration',
    strengths: ['Unique talents', 'Special circumstances'],
    challenges: ['May feel different from others', 'Unique path required'],
    careers: ['Varies based on specific configuration'],
    relationship: 'Unique relationship needs'
  },

  unclear: {
    type: 'unclear',
    han: '格局不清',
    label: 'Unclear Structure',
    category: 'special',
    tenGod: 'Mixed',
    theme: 'Versatility through Mixed Influences',
    strengths: ['Adaptable', 'Multiple options', 'Flexible'],
    challenges: ['May lack clear direction', 'Can feel scattered'],
    careers: ['Multiple paths available', 'Generalist roles'],
    relationship: 'Adaptable relationship style'
  }
};

// ============================================================================
// TEN GOD TO STRUCTURE MAPPING
// ============================================================================

/**
 * Maps Ten God names to their Structure type
 * Note: Officer category has two: Direct Officer (proper) and Seven Killings
 */
const TEN_GOD_TO_STRUCTURE: Record<string, StructureType> = {
  // Officer category
  'Direct Officer': 'proper_officer',
  'Seven Killings': 'seven_killings',
  // Wealth category
  'Direct Wealth': 'direct_wealth',
  'Indirect Wealth': 'indirect_wealth',
  // Output category
  'Eating God': 'eating_god',
  'Hurting Officer': 'hurting_officer',
  // Companion category
  'Friend': 'friend',
  'Rob Wealth': 'rob_wealth',
  // Resource category doesn't form structure (generates DM)
  'Direct Resource': 'unclear',
  'Indirect Resource': 'unclear'
};

/**
 * Maps TenGodCategory to relevant Ten Gods for structure
 */
const CATEGORY_TO_TEN_GODS: Record<TenGodCategory, string[]> = {
  resource: ['Direct Resource', 'Indirect Resource'],
  companion: ['Friend', 'Rob Wealth'],
  output: ['Eating God', 'Hurting Officer'],
  wealth: ['Direct Wealth', 'Indirect Wealth'],
  officer: ['Direct Officer', 'Seven Killings']
};

// ============================================================================
// CORE STRUCTURE COMPUTATION
// ============================================================================

export interface ComputeStructureOpts {
  // Ten Gods with adjusted scores (from computeEnhancedTenGodsSeasonality)
  tenGodsAdjusted: Record<string, number>;

  // Final DM composite strength (0-2 range typically)
  dmStrength: number;

  // Optional: specific Ten God scores (for finer resolution)
  detailedTenGods?: {
    directOfficer?: number;
    sevenKillings?: number;
    directWealth?: number;
    indirectWealth?: number;
    eatingGod?: number;
    hurtingOfficer?: number;
    friend?: number;
    robWealth?: number;
    directResource?: number;
    indirectResource?: number;
  };

  // Growth stage modifier (optional, for refinement)
  growthStageModifier?: number;

  // Follow structure inputs (for dedicated follow engine)
  followOpts?: {
    dmElementCount?: number;
    totalElementCount?: number;
    hasRoots?: boolean;
    seasonalityStrength?: number;
    hasSupportingCombos?: boolean;
  };
}

/**
 * Compute classical Ge Ju (Structure) based on Ten Gods + DM strength.
 *
 * Joey Yap methodology:
 * 1. Identify the dominant Ten God (excluding Resource which supports DM)
 * 2. Check if DM is strong enough to "hold" the structure
 * 3. If DM is very weak, use dedicated Follow Structure engine
 * 4. Score the clarity of the structure
 */
export function computeStructure(opts: ComputeStructureOpts): StructureResult {
  const {
    tenGodsAdjusted,
    dmStrength,
    detailedTenGods,
    growthStageModifier = 1.0,
    followOpts
  } = opts;

  // Apply growth stage modifier to DM strength
  const effectiveDmStrength = dmStrength * growthStageModifier;

  // Categorize DM strength
  const dmCategory = getDmCategory(effectiveDmStrength);

  // ─────────────────────────────────────────────────────────────────
  // Use dedicated Follow Structure engine for proper classical detection
  // ─────────────────────────────────────────────────────────────────
  const followStructureResult = computeFollowStructure({
    dmStrength: effectiveDmStrength,
    tenGodsAdjusted: tenGodsAdjusted as Record<TenGodCategory, number>,
    dmElementCount: followOpts?.dmElementCount,
    totalElementCount: followOpts?.totalElementCount,
    hasRoots: followOpts?.hasRoots,
    seasonalityStrength: followOpts?.seasonalityStrength,
    hasSupportingCombos: followOpts?.hasSupportingCombos
  });

  const isFollowStructure = followStructureResult.isFollowStructure;

  // Build Ten Gods ranking (excluding Resource for structure determination)
  const tenGodsRanking = buildTenGodsRanking(tenGodsAdjusted, detailedTenGods);

  // Get dominant and secondary Ten Gods
  const dominant = tenGodsRanking[0];
  const secondary = tenGodsRanking[1] || null;

  // Determine structure type
  let structureType: StructureType;

  if (isFollowStructure) {
    // Use the follow structure type from dedicated engine
    structureType = mapFollowTypeToStructureType(followStructureResult.followType);
  } else {
    structureType = TEN_GOD_TO_STRUCTURE[dominant.tenGod] || 'unclear';
  }

  // Get structure definition
  const structure = STRUCTURE_DEFINITIONS[structureType];

  // Calculate structure clarity
  const clarityFactor = isFollowStructure
    ? followStructureResult.followConfidence
    : calculateClarity(tenGodsRanking, effectiveDmStrength);
  const structureClarity = clarityFactor >= 0.7 ? 'clear' : clarityFactor >= 0.4 ? 'moderate' : 'mixed';

  // Calculate structure score
  const dmStrengthFactor = isFollowStructure ? 1.0 : Math.min(1.0, effectiveDmStrength);
  const structureScore = isFollowStructure
    ? followStructureResult.followConfidence
    : dominant.score * dmStrengthFactor * clarityFactor;

  // Get secondary structure if applicable (not for follow structures)
  const secondaryStructure = !isFollowStructure && secondary && secondary.score > 0.3
    ? STRUCTURE_DEFINITIONS[TEN_GOD_TO_STRUCTURE[secondary.tenGod] || 'unclear']
    : null;

  // Build breakdown
  const breakdown: StructureBreakdown = {
    tenGodsRanking,
    dmStrengthFactor,
    clarityFactor,
    notes: generateBreakdownNotes(structureType, dmCategory, isFollowStructure, clarityFactor)
  };

  // Generate explanation
  const explanation = isFollowStructure
    ? followStructureResult.explanation
    : generateStructureExplanation(
        structure,
        dominant,
        secondary,
        effectiveDmStrength,
        dmCategory,
        isFollowStructure,
        structureScore,
        clarityFactor,
        tenGodsRanking
      );

  return {
    structure,
    structureType,
    structureName: `${structure.han} (${structure.label})`,
    dominantTenGod: dominant.tenGod,
    dominantScore: dominant.score,
    structureScore,
    structureClarity,
    dmStrength: effectiveDmStrength,
    dmCategory,
    isFollowStructure,
    followStructureResult,
    secondaryStructure,
    secondaryScore: secondary?.score || 0,
    explanation,
    breakdown
  };
}

/**
 * Map FollowStructureType to StructureType
 */
function mapFollowTypeToStructureType(followType: FollowStructureType): StructureType {
  const mapping: Record<FollowStructureType, StructureType> = {
    follow_strong: 'follow_strong',
    follow_weak: 'follow_weak',
    follow_output: 'follow_output',
    follow_wealth: 'follow_wealth',
    follow_officer: 'follow_officer',
    none: 'unclear'
  };
  return mapping[followType] || 'unclear';
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getDmCategory(strength: number): 'strong' | 'balanced' | 'weak' | 'very_weak' {
  if (strength >= 1.2) return 'strong';
  if (strength >= 0.8) return 'balanced';
  if (strength >= 0.4) return 'weak';
  return 'very_weak';
}


function buildTenGodsRanking(
  tenGodsAdjusted: Record<string, number>,
  detailedTenGods?: ComputeStructureOpts['detailedTenGods']
): Array<{ tenGod: string; score: number }> {
  const ranking: Array<{ tenGod: string; score: number }> = [];

  // If detailed scores provided, use them
  if (detailedTenGods) {
    const detailed: [string, number | undefined][] = [
      ['Direct Officer', detailedTenGods.directOfficer],
      ['Seven Killings', detailedTenGods.sevenKillings],
      ['Direct Wealth', detailedTenGods.directWealth],
      ['Indirect Wealth', detailedTenGods.indirectWealth],
      ['Eating God', detailedTenGods.eatingGod],
      ['Hurting Officer', detailedTenGods.hurtingOfficer],
      ['Friend', detailedTenGods.friend],
      ['Rob Wealth', detailedTenGods.robWealth]
    ];

    for (const [tenGod, score] of detailed) {
      if (score !== undefined) {
        ranking.push({ tenGod, score });
      }
    }
  }

  // Otherwise, use category-level scores
  if (ranking.length === 0) {
    // Map categories to representative Ten Gods
    const categoryMapping: [string, string][] = [
      ['officer', 'Direct Officer'],
      ['wealth', 'Direct Wealth'],
      ['output', 'Eating God'],
      ['companion', 'Friend']
      // Note: resource doesn't form structure
    ];

    for (const [category, tenGod] of categoryMapping) {
      const score = tenGodsAdjusted[category];
      if (score !== undefined && score > 0) {
        ranking.push({ tenGod, score });
      }
    }
  }

  // Sort by score descending
  return ranking.sort((a, b) => b.score - a.score);
}

function calculateClarity(
  ranking: Array<{ tenGod: string; score: number }>,
  dmStrength: number
): number {
  if (ranking.length === 0) return 0;
  if (ranking.length === 1) return 1.0;

  const first = ranking[0].score;
  const second = ranking[1].score;

  // Clarity based on gap between first and second
  const gap = second > 0 ? (first - second) / first : 1.0;

  // Also factor in DM strength (weak DM = less clarity unless follow)
  const dmFactor = dmStrength < 0.4 ? 0.7 : Math.min(1.0, dmStrength);

  return Math.min(1.0, gap * dmFactor + 0.3);
}

function generateBreakdownNotes(
  structureType: StructureType,
  dmCategory: string,
  isFollow: boolean,
  clarity: number
): string[] {
  const notes: string[] = [];

  if (isFollow) {
    notes.push('Follow Structure detected - DM surrenders to dominant element');
  }

  if (dmCategory === 'strong') {
    notes.push('Strong DM can fully support this structure');
  } else if (dmCategory === 'weak') {
    notes.push('Weak DM may need support to fully express structure');
  }

  if (clarity >= 0.7) {
    notes.push('Structure is clearly defined');
  } else if (clarity < 0.4) {
    notes.push('Mixed influences - structure less defined');
  }

  return notes;
}

function generateStructureExplanation(
  structure: StructureDefinition,
  dominant: { tenGod: string; score: number },
  secondary: { tenGod: string; score: number } | null,
  dmStrength: number,
  dmCategory: string,
  isFollow: boolean,
  structureScore: number,
  clarity: number,
  ranking: Array<{ tenGod: string; score: number }>
): string {
  const pct = (n: number) => (n * 100).toFixed(0);

  let explanation = `
${'═'.repeat(60)}
STRUCTURE ANALYSIS (格局)
${'═'.repeat(60)}

IDENTIFIED STRUCTURE: ${structure.han} (${structure.label})
${'─'.repeat(50)}

Theme: ${structure.theme}

${'─'.repeat(50)}
DETERMINATION PROCESS:

1. TEN GODS RANKING:
${ranking.slice(0, 5).map((r, i) => `   ${i + 1}. ${r.tenGod}: ${pct(r.score)}%`).join('\n')}

2. DOMINANT TEN GOD:
   ${dominant.tenGod} at ${pct(dominant.score)}%
   → Maps to: ${structure.label}

3. DAY MASTER STRENGTH:
   DM Strength: ${dmStrength.toFixed(2)} (${dmCategory})
   ${isFollow ? '   ⚠ DM too weak - Follow Structure applies' : '   ✓ DM can support this structure'}

4. STRUCTURE CLARITY:
   Clarity Factor: ${pct(clarity)}%
   ${clarity >= 0.7 ? '   ✓ Structure is clearly defined' : clarity >= 0.4 ? '   ○ Structure is moderately defined' : '   △ Structure has mixed influences'}

5. FINAL STRUCTURE SCORE:
   score = dominant_score × dm_factor × clarity
        = ${pct(dominant.score)}% × ${dmStrength >= 0.4 ? dmStrength.toFixed(2) : '1.0'} × ${clarity.toFixed(2)}
        = ${pct(structureScore)}%
`;

  if (secondary && secondary.score > 0.3) {
    explanation += `
${'─'.repeat(50)}
SECONDARY INFLUENCE:
   ${secondary.tenGod}: ${pct(secondary.score)}%
   This creates a blend with ${STRUCTURE_DEFINITIONS[TEN_GOD_TO_STRUCTURE[secondary.tenGod] || 'unclear'].label}
`;
  }

  explanation += `
${'─'.repeat(50)}
INTERPRETATION:

${structure.theme}

Strengths:
${structure.strengths.map(s => `• ${s}`).join('\n')}

Growth Areas:
${structure.challenges.map(c => `• ${c}`).join('\n')}

Career Orientation:
${structure.careers.slice(0, 5).join(', ')}

Relationship Style:
${structure.relationship}
`;

  return explanation.trim();
}

// ============================================================================
// QUICK HELPERS
// ============================================================================

/**
 * Get a brief structure label for UI display
 */
export function getStructureLabel(result: StructureResult): string {
  return `${result.structure.han} - ${result.structure.label}`;
}

/**
 * Get structure category icon
 */
export function getStructureCategoryIcon(category: StructureCategory): string {
  const icons: Record<StructureCategory, string> = {
    officer: '⚔',
    wealth: '$',
    output: '★',
    companion: '☯',
    follow: '→',
    special: '◇'
  };
  return icons[category] || '?';
}

// ============================================================================
// EXPORTS
// ============================================================================

// Re-export follow structure utilities for convenience
export {
  computeFollowStructure,
  quickFollowCheck,
  getFollowStructureLabel,
  getFollowStructureIcon,
  FOLLOW_STRUCTURE_DEFINITIONS,
  FOLLOW_THRESHOLDS
} from './baziFollowStructure';

export type { FollowStructureResult, FollowStructureType } from './baziFollowStructure';

export default {
  computeStructure,
  getStructureLabel,
  getStructureCategoryIcon,
  STRUCTURE_DEFINITIONS,
  TEN_GOD_TO_STRUCTURE
};
