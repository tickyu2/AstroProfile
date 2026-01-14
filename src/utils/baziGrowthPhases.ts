/**
 * ============================================================================
 * BAZI 12 GROWTH STAGES (长生十二运)
 * ============================================================================
 *
 * The 12 Growth Stages represent the life cycle of Qi energy through
 * the 12 Earthly Branches. Each Day Master (Heavenly Stem) has a specific
 * growth stage in each branch, representing its life phase.
 *
 * Classical doctrine:
 * - Yang stems follow the forward cycle (clockwise)
 * - Yin stems follow the reverse cycle (counter-clockwise)
 * - Some schools debate Yin stem direction; we use the majority view
 *
 * The 12 stages in order:
 * 长生 → 沐浴 → 冠带 → 临官 → 帝旺 → 衰 → 病 → 死 → 墓 → 绝 → 胎 → 养
 *
 * This is a Joey-Yap-baseline piece essential for accurate DM strength.
 *
 * Created: January 2026
 * Based on: Classical BaZi 12 Growth Stages (长生十二运)
 * ============================================================================
 */

// ============================================================================
// TYPES
// ============================================================================

export type GrowthStageKey =
  | 'chang_sheng'  // 长生 Birth/Growth
  | 'mu_yu'        // 沐浴 Bath
  | 'guan_dai'     // 冠带 Youth/Attire
  | 'lin_guan'     // 临官 Officer/Career
  | 'di_wang'      // 帝旺 Prosperity/Peak
  | 'shuai'        // 衰 Decline
  | 'bing'         // 病 Sickness
  | 'si'           // 死 Death
  | 'mu'           // 墓 Grave/Storage
  | 'jue'          // 绝 Termination
  | 'tai'          // 胎 Conception
  | 'yang';        // 养 Nurture

export interface GrowthStageInfo {
  key: GrowthStageKey;
  han: string;          // Chinese character
  label: string;        // English label
  strength: number;     // Relative strength (0-1)
  phase: 'ascending' | 'peak' | 'descending' | 'dormant';
  description: string;  // Classical meaning
}

// ============================================================================
// 12 GROWTH STAGE DEFINITIONS
// ============================================================================

export const GROWTH_STAGE_DEFS: Record<GrowthStageKey, GrowthStageInfo> = {
  chang_sheng: {
    key: 'chang_sheng',
    han: '长生',
    label: 'Birth / Long Life',
    strength: 0.85,
    phase: 'ascending',
    description: 'The moment of birth. Fresh energy emerges with vitality and potential. Like a newborn taking first breath.'
  },
  mu_yu: {
    key: 'mu_yu',
    han: '沐浴',
    label: 'Bath / Cleansing',
    strength: 0.45,
    phase: 'ascending',
    description: 'The vulnerable infant being bathed. Exposed, sensitive, impressionable. A time of cleansing but also instability.'
  },
  guan_dai: {
    key: 'guan_dai',
    han: '冠带',
    label: 'Coming of Age',
    strength: 0.70,
    phase: 'ascending',
    description: 'Youth putting on adult clothes. Growing confidence, preparation for responsibility. Not yet mature but developing.'
  },
  lin_guan: {
    key: 'lin_guan',
    han: '临官',
    label: 'Career / Official',
    strength: 0.95,
    phase: 'peak',
    description: 'Taking office, assuming responsibilities. Strong, capable, ready for action. Prime working years.'
  },
  di_wang: {
    key: 'di_wang',
    han: '帝旺',
    label: 'Emperor / Peak',
    strength: 1.0,
    phase: 'peak',
    description: 'The absolute peak. Maximum power, influence, and vitality. Like an emperor at the height of reign.'
  },
  shuai: {
    key: 'shuai',
    han: '衰',
    label: 'Decline',
    strength: 0.55,
    phase: 'descending',
    description: 'Beginning of decline after peak. Still functional but energy waning. Wisdom growing as strength fades.'
  },
  bing: {
    key: 'bing',
    han: '病',
    label: 'Illness',
    strength: 0.35,
    phase: 'descending',
    description: 'Weakened state, like illness. Vulnerability, need for rest and support. Internal struggles.'
  },
  si: {
    key: 'si',
    han: '死',
    label: 'Death',
    strength: 0.15,
    phase: 'descending',
    description: 'The moment of death. Energy at its lowest visible point. Transformation beginning.'
  },
  mu: {
    key: 'mu',
    han: '墓',
    label: 'Grave / Storage',
    strength: 0.40,
    phase: 'dormant',
    description: 'Buried in the grave, but also stored and protected. Hidden potential, resources accumulated. Repository of value.'
  },
  jue: {
    key: 'jue',
    han: '绝',
    label: 'Extinction',
    strength: 0.10,
    phase: 'dormant',
    description: 'Complete termination of the old cycle. The deepest point before renewal. Empty, but pregnant with possibility.'
  },
  tai: {
    key: 'tai',
    han: '胎',
    label: 'Conception',
    strength: 0.30,
    phase: 'dormant',
    description: 'The moment of conception. New life forming invisibly. Potential gathering, destiny being written.'
  },
  yang: {
    key: 'yang',
    han: '养',
    label: 'Nurture / Gestation',
    strength: 0.50,
    phase: 'ascending',
    description: 'Being nurtured in the womb. Protected growth, preparation for emergence. Building strength quietly.'
  }
};

// ============================================================================
// GROWTH STAGE CYCLE ORDER
// ============================================================================

/**
 * The 12 stages in their natural cycle order
 */
export const GROWTH_STAGE_CYCLE: GrowthStageKey[] = [
  'chang_sheng',
  'mu_yu',
  'guan_dai',
  'lin_guan',
  'di_wang',
  'shuai',
  'bing',
  'si',
  'mu',
  'jue',
  'tai',
  'yang'
];

/**
 * Branch order for cycling
 */
const BRANCH_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// ============================================================================
// CLASSICAL GROWTH STAGE TABLE
// ============================================================================

/**
 * Starting branch for 长生 (chang_sheng) for each stem.
 * Yang stems cycle forward, Yin stems cycle backward.
 *
 * Classical reference:
 * - 甲 (Yang Wood): 长生 at 亥
 * - 乙 (Yin Wood): 长生 at 午 (reverse)
 * - 丙 (Yang Fire): 长生 at 寅
 * - 丁 (Yin Fire): 长生 at 酉 (reverse)
 * - 戊 (Yang Earth): 长生 at 寅 (follows Fire)
 * - 己 (Yin Earth): 长生 at 酉 (follows Fire, reverse)
 * - 庚 (Yang Metal): 长生 at 巳
 * - 辛 (Yin Metal): 长生 at 子 (reverse)
 * - 壬 (Yang Water): 长生 at 申
 * - 癸 (Yin Water): 长生 at 卯 (reverse)
 */
const STEM_CHANG_SHENG_BRANCH: Record<string, { branch: string; direction: 'forward' | 'reverse' }> = {
  '甲': { branch: '亥', direction: 'forward' },
  '乙': { branch: '午', direction: 'reverse' },
  '丙': { branch: '寅', direction: 'forward' },
  '丁': { branch: '酉', direction: 'reverse' },
  '戊': { branch: '寅', direction: 'forward' },
  '己': { branch: '酉', direction: 'reverse' },
  '庚': { branch: '巳', direction: 'forward' },
  '辛': { branch: '子', direction: 'reverse' },
  '壬': { branch: '申', direction: 'forward' },
  '癸': { branch: '卯', direction: 'reverse' }
};

/**
 * Generate the full mapping table for a given stem
 */
function generateStemTable(stem: string): Record<string, GrowthStageKey> {
  const config = STEM_CHANG_SHENG_BRANCH[stem];
  if (!config) return {};

  const startBranchIdx = BRANCH_ORDER.indexOf(config.branch);
  const table: Record<string, GrowthStageKey> = {};

  for (let i = 0; i < 12; i++) {
    let branchIdx: number;
    if (config.direction === 'forward') {
      branchIdx = (startBranchIdx + i) % 12;
    } else {
      // Reverse: go backwards
      branchIdx = (startBranchIdx - i + 12) % 12;
    }
    const branch = BRANCH_ORDER[branchIdx];
    const stage = GROWTH_STAGE_CYCLE[i];
    table[branch] = stage;
  }

  return table;
}

/**
 * Pre-computed growth stage table: Day Stem → Branch → Stage
 */
export const GROWTH_STAGE_TABLE: Record<string, Record<string, GrowthStageKey>> = {
  '甲': generateStemTable('甲'),
  '乙': generateStemTable('乙'),
  '丙': generateStemTable('丙'),
  '丁': generateStemTable('丁'),
  '戊': generateStemTable('戊'),
  '己': generateStemTable('己'),
  '庚': generateStemTable('庚'),
  '辛': generateStemTable('辛'),
  '壬': generateStemTable('壬'),
  '癸': generateStemTable('癸')
};

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Get the growth stage for a given Day Stem and Branch
 *
 * @param dayStem - The Day Master stem (e.g., '甲', '乙')
 * @param branch - The Earthly Branch (e.g., '子', '寅')
 * @returns GrowthStageInfo or null if not found
 */
export function getGrowthStage(dayStem: string, branch: string): GrowthStageInfo | null {
  const stemTable = GROWTH_STAGE_TABLE[dayStem];
  if (!stemTable) return null;

  const stageKey = stemTable[branch];
  if (!stageKey) return null;

  return GROWTH_STAGE_DEFS[stageKey];
}

/**
 * Get all growth stages for a Day Stem across all branches
 *
 * @param dayStem - The Day Master stem
 * @returns Map of branch to stage info
 */
export function getAllGrowthStages(dayStem: string): Map<string, GrowthStageInfo> {
  const result = new Map<string, GrowthStageInfo>();
  const stemTable = GROWTH_STAGE_TABLE[dayStem];

  if (!stemTable) return result;

  for (const branch of BRANCH_ORDER) {
    const stageKey = stemTable[branch];
    if (stageKey) {
      result.set(branch, GROWTH_STAGE_DEFS[stageKey]);
    }
  }

  return result;
}

/**
 * Get growth stages for all four pillars
 *
 * @param dayStem - The Day Master stem
 * @param pillars - Object with year, month, day, hour branches
 * @returns Object with stage info for each pillar
 */
export function getFourPillarsGrowthStages(
  dayStem: string,
  pillars: { year: string; month: string; day: string; hour: string }
): {
  year: GrowthStageInfo | null;
  month: GrowthStageInfo | null;
  day: GrowthStageInfo | null;
  hour: GrowthStageInfo | null;
  summary: string;
} {
  const year = getGrowthStage(dayStem, pillars.year);
  const month = getGrowthStage(dayStem, pillars.month);
  const day = getGrowthStage(dayStem, pillars.day);
  const hour = getGrowthStage(dayStem, pillars.hour);

  // Calculate average strength with weights
  const weights = { year: 0.15, month: 0.35, day: 0.30, hour: 0.20 };
  let totalStrength = 0;
  let totalWeight = 0;

  if (year) { totalStrength += year.strength * weights.year; totalWeight += weights.year; }
  if (month) { totalStrength += month.strength * weights.month; totalWeight += weights.month; }
  if (day) { totalStrength += day.strength * weights.day; totalWeight += weights.day; }
  if (hour) { totalStrength += hour.strength * weights.hour; totalWeight += weights.hour; }

  const avgStrength = totalWeight > 0 ? totalStrength / totalWeight : 0;

  const summary = `
12 Growth Stages for Day Master ${dayStem}:
${'─'.repeat(40)}
Year Branch (${pillars.year}):  ${year ? `${year.han} (${year.label}) - ${(year.strength * 100).toFixed(0)}%` : 'N/A'}
Month Branch (${pillars.month}): ${month ? `${month.han} (${month.label}) - ${(month.strength * 100).toFixed(0)}%` : 'N/A'}
Day Branch (${pillars.day}):   ${day ? `${day.han} (${day.label}) - ${(day.strength * 100).toFixed(0)}%` : 'N/A'}
Hour Branch (${pillars.hour}):  ${hour ? `${hour.han} (${hour.label}) - ${(hour.strength * 100).toFixed(0)}%` : 'N/A'}

Weighted Average Strength: ${(avgStrength * 100).toFixed(0)}%
${month && month.strength >= 0.7 ? '✓ Day Master is in a strong month phase' : '○ Day Master is in a weaker/neutral month phase'}
`.trim();

  return { year, month, day, hour, summary };
}

// ============================================================================
// STRENGTH CATEGORIES
// ============================================================================

/**
 * Get strength category from stage
 */
export function getStrengthCategory(stage: GrowthStageInfo): 'strong' | 'moderate' | 'weak' {
  if (stage.strength >= 0.7) return 'strong';
  if (stage.strength >= 0.4) return 'moderate';
  return 'weak';
}

/**
 * Strong stages (traditionally considered to give DM strength)
 */
export const STRONG_STAGES: GrowthStageKey[] = ['lin_guan', 'di_wang', 'chang_sheng', 'guan_dai'];

/**
 * Moderate stages (neutral influence)
 */
export const MODERATE_STAGES: GrowthStageKey[] = ['shuai', 'yang', 'mu_yu', 'mu'];

/**
 * Weak stages (traditionally considered to weaken DM)
 */
export const WEAK_STAGES: GrowthStageKey[] = ['bing', 'si', 'jue', 'tai'];

/**
 * Check if a stage is a "strong" stage for the DM
 */
export function isStrongStage(stageKey: GrowthStageKey): boolean {
  return STRONG_STAGES.includes(stageKey);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  getGrowthStage,
  getAllGrowthStages,
  getFourPillarsGrowthStages,
  getStrengthCategory,
  isStrongStage,
  GROWTH_STAGE_DEFS,
  GROWTH_STAGE_TABLE,
  GROWTH_STAGE_CYCLE,
  STRONG_STAGES,
  MODERATE_STAGES,
  WEAK_STAGES
};
