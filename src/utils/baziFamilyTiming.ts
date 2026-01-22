/**
 * =============================================================================
 * BAZI FAMILY DYNAMICS TIMING ENGINE (家庭应期)
 * =============================================================================
 *
 * This module reveals when family relationships soften or strain, when
 * generational patterns surface, and when reconciliation becomes possible.
 *
 * FAMILY MEMBER TEN GOD MAPPING (Classical Doctrine):
 *   Father      → Direct Resource (正印) / Indirect Resource (偏印)
 *   Mother      → Indirect Resource (偏印) / Direct Resource (正印)
 *   Sons        → Seven Killings (七杀) / Direct Officer (正官)
 *   Daughters   → Hurting Officer (伤官) / Eating God (食神)
 *   Brothers    → Friend (比肩)
 *   Sisters     → Rob Wealth (劫财)
 *   Husband     → Direct Officer (正官) / Seven Killings (七杀)
 *   Wife        → Direct Wealth (正财) / Indirect Wealth (偏财)
 *
 * Note: Mappings vary by gender. For Yang DM males and Yin DM females,
 * primary/secondary roles may swap per classical texts.
 *
 * FOUR TIMING MODULES:
 *   1. Parents Timing (父母应期)   → Resource star activation
 *   2. Children Timing (子女应期)  → Output star activation
 *   3. Siblings Timing (兄弟应期)  → Companion star activation
 *   4. Spouse Timing (配偶应期)    → Officer/Wealth activation
 *
 * SCORING MODEL:
 *   40% Ten God Activation
 *   20% Synastry (if family member chart provided)
 *   20% Conflict Analysis
 *   20% Shen Sha & Transformations
 *
 * Author: Brother Opus & Ticky
 * Version: 1.0.0
 * =============================================================================
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type StemName = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
export type BranchName = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

export type Gender = 'male' | 'female';
export type FamilyMember = 'father' | 'mother' | 'son' | 'daughter' | 'brother' | 'sister' | 'husband' | 'wife';
export type FamilyTier = 'excellent' | 'good' | 'neutral' | 'strained' | 'challenging';
export type TimingLayerName = 'luckPillar' | 'annual' | 'monthly' | 'daily' | 'hourly';

export interface TimingPillar {
  stem: StemName;
  branch: BranchName;
}

export interface NatalPillarsInput {
  yearStem: StemName;
  yearBranch: BranchName;
  monthStem: StemName;
  monthBranch: BranchName;
  dayStem: StemName;
  dayBranch: BranchName;
  hourStem: StemName;
  hourBranch: BranchName;
}

export type TenGodName =
  | 'Rob Wealth' | 'Friend'
  | 'Eating God' | 'Hurting Officer'
  | 'Direct Wealth' | 'Indirect Wealth'
  | 'Direct Officer' | 'Seven Killings'
  | 'Direct Resource' | 'Indirect Resource';

/**
 * Family member configuration
 */
export interface FamilyMemberConfig {
  member: FamilyMember;
  chinese: string;
  primaryTenGods: TenGodName[];
  secondaryTenGods: TenGodName[];
  palaceBranch: 'year' | 'month' | 'day' | 'hour'; // Which pillar represents this relation
  relevantShensha: string[];
  blockingShensha: string[];
}

/**
 * Individual activation trigger
 */
export interface FamilyActivationTrigger {
  type: string;
  chinese: string;
  description: string;
  weight: number;
  isPositive: boolean;
}

/**
 * Layer activation result
 */
export interface FamilyLayerActivation {
  layer: TimingLayerName;
  layerChinese: string;
  pillar: TimingPillar;
  activated: boolean;
  score: number;
  triggers: FamilyActivationTrigger[];
}

/**
 * Family timing result for a single member
 */
export interface FamilyMemberTimingResult {
  member: FamilyMember;
  memberChinese: string;
  score: number;
  tier: FamilyTier;
  tierChinese: string;
  layerActivations: FamilyLayerActivation[];
  activeLayerCount: number;
  keyTriggers: FamilyActivationTrigger[];
  blockers: FamilyActivationTrigger[];
  palaceStatus: PalaceStatus;
  narrative: string;
  recommendation: string;
}

/**
 * Palace status (宫位状态)
 */
export interface PalaceStatus {
  palace: string;
  branch: BranchName;
  hasClash: boolean;
  hasHarm: boolean;
  hasPunishment: boolean;
  hasTransformation: boolean;
  status: 'stable' | 'activated' | 'disturbed' | 'transformed';
  description: string;
}

/**
 * Comprehensive family timing result
 */
export interface ComprehensiveFamilyTiming {
  parents: {
    father: FamilyMemberTimingResult;
    mother: FamilyMemberTimingResult;
  };
  children: {
    son: FamilyMemberTimingResult;
    daughter: FamilyMemberTimingResult;
  };
  siblings: {
    brother: FamilyMemberTimingResult;
    sister: FamilyMemberTimingResult;
  };
  spouse: FamilyMemberTimingResult | null;
  dominantTheme: string;
  familyHarmonyScore: number;
  summary: string;
  timestamp: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ELEMENT MAPPINGS
// ─────────────────────────────────────────────────────────────────────────────

export const STEM_ELEMENT: Record<string, ElementName> = {
  '甲': 'Wood', '乙': 'Wood',
  '丙': 'Fire', '丁': 'Fire',
  '戊': 'Earth', '己': 'Earth',
  '庚': 'Metal', '辛': 'Metal',
  '壬': 'Water', '癸': 'Water'
};

export const BRANCH_ELEMENT: Record<string, ElementName> = {
  '寅': 'Wood', '卯': 'Wood',
  '巳': 'Fire', '午': 'Fire',
  '辰': 'Earth', '丑': 'Earth', '未': 'Earth', '戌': 'Earth',
  '申': 'Metal', '酉': 'Metal',
  '亥': 'Water', '子': 'Water'
};

export const STEM_POLARITY: Record<string, 'Yang' | 'Yin'> = {
  '甲': 'Yang', '乙': 'Yin', '丙': 'Yang', '丁': 'Yin', '戊': 'Yang',
  '己': 'Yin', '庚': 'Yang', '辛': 'Yin', '壬': 'Yang', '癸': 'Yin'
};

export const ELEMENT_PRODUCES: Record<ElementName, ElementName> = {
  Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood'
};

export const ELEMENT_CONTROLS: Record<ElementName, ElementName> = {
  Wood: 'Earth', Fire: 'Metal', Earth: 'Water', Metal: 'Wood', Water: 'Fire'
};

// ─────────────────────────────────────────────────────────────────────────────
// TEN GODS CALCULATION
// ─────────────────────────────────────────────────────────────────────────────

export function getTenGod(dmStem: StemName, targetStem: StemName): TenGodName {
  const dmElement = STEM_ELEMENT[dmStem];
  const targetElement = STEM_ELEMENT[targetStem];
  const dmPolarity = STEM_POLARITY[dmStem];
  const targetPolarity = STEM_POLARITY[targetStem];
  const samePolarity = dmPolarity === targetPolarity;

  if (targetElement === dmElement) {
    return samePolarity ? 'Friend' : 'Rob Wealth';
  }

  if (ELEMENT_PRODUCES[dmElement] === targetElement) {
    return samePolarity ? 'Eating God' : 'Hurting Officer';
  }

  if (ELEMENT_CONTROLS[dmElement] === targetElement) {
    return samePolarity ? 'Indirect Wealth' : 'Direct Wealth';
  }

  const controllingElement = Object.entries(ELEMENT_CONTROLS)
    .find(([_, controlled]) => controlled === dmElement)?.[0] as ElementName;

  if (targetElement === controllingElement) {
    return samePolarity ? 'Seven Killings' : 'Direct Officer';
  }

  return samePolarity ? 'Indirect Resource' : 'Direct Resource';
}

// ─────────────────────────────────────────────────────────────────────────────
// FAMILY MEMBER CONFIGURATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const FAMILY_MEMBER_CONFIG: Record<FamilyMember, FamilyMemberConfig> = {
  father: {
    member: 'father',
    chinese: '父亲',
    primaryTenGods: ['Indirect Resource'], // 偏印 for Yang DM, 正印 for Yin DM varies
    secondaryTenGods: ['Direct Resource'],
    palaceBranch: 'year',
    relevantShensha: ['天乙贵人', '天德', '月德', '华盖'],
    blockingShensha: ['亡神', '劫煞', '灾煞']
  },
  mother: {
    member: 'mother',
    chinese: '母亲',
    primaryTenGods: ['Direct Resource'], // 正印
    secondaryTenGods: ['Indirect Resource'],
    palaceBranch: 'month',
    relevantShensha: ['天乙贵人', '天德', '月德', '红鸾'],
    blockingShensha: ['亡神', '劫煞', '灾煞']
  },
  son: {
    member: 'son',
    chinese: '儿子',
    primaryTenGods: ['Seven Killings'], // Male children represented by 杀
    secondaryTenGods: ['Direct Officer'],
    palaceBranch: 'hour',
    relevantShensha: ['天乙贵人', '文昌', '将星'],
    blockingShensha: ['孤辰', '寡宿', '劫煞']
  },
  daughter: {
    member: 'daughter',
    chinese: '女儿',
    primaryTenGods: ['Hurting Officer'], // Female children by 伤官/食神
    secondaryTenGods: ['Eating God'],
    palaceBranch: 'hour',
    relevantShensha: ['桃花', '红鸾', '天喜', '天乙贵人'],
    blockingShensha: ['孤辰', '寡宿', '劫煞']
  },
  brother: {
    member: 'brother',
    chinese: '兄弟',
    primaryTenGods: ['Friend'], // 比肩
    secondaryTenGods: [],
    palaceBranch: 'month',
    relevantShensha: ['天乙贵人', '将星'],
    blockingShensha: ['劫煞', '羊刃']
  },
  sister: {
    member: 'sister',
    chinese: '姐妹',
    primaryTenGods: ['Rob Wealth'], // 劫财
    secondaryTenGods: [],
    palaceBranch: 'month',
    relevantShensha: ['天乙贵人', '桃花', '红鸾'],
    blockingShensha: ['劫煞']
  },
  husband: {
    member: 'husband',
    chinese: '丈夫',
    primaryTenGods: ['Direct Officer'], // 正官
    secondaryTenGods: ['Seven Killings'],
    palaceBranch: 'day',
    relevantShensha: ['红鸾', '天喜', '天乙贵人', '天德'],
    blockingShensha: ['孤辰', '寡宿', '劫煞', '羊刃']
  },
  wife: {
    member: 'wife',
    chinese: '妻子',
    primaryTenGods: ['Direct Wealth'], // 正财
    secondaryTenGods: ['Indirect Wealth'],
    palaceBranch: 'day',
    relevantShensha: ['红鸾', '天喜', '桃花', '天乙贵人'],
    blockingShensha: ['孤辰', '寡宿', '劫煞', '羊刃']
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SHEN SHA DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export const NOBLEMAN_MAP: Record<string, string[]> = {
  '甲': ['丑', '未'], '乙': ['子', '申'], '丙': ['亥', '酉'],
  '丁': ['亥', '酉'], '戊': ['丑', '未'], '己': ['子', '申'],
  '庚': ['丑', '未'], '辛': ['寅', '午'], '壬': ['卯', '巳'],
  '癸': ['卯', '巳']
};

export const RED_MATCHMAKER_MAP: Record<string, string> = {
  '子': '卯', '丑': '寅', '寅': '丑', '卯': '子',
  '辰': '亥', '巳': '戌', '午': '酉', '未': '申',
  '申': '未', '酉': '午', '戌': '巳', '亥': '辰'
};

export const SKY_HAPPINESS_MAP: Record<string, string> = {
  '子': '酉', '丑': '申', '寅': '未', '卯': '午',
  '辰': '巳', '巳': '辰', '午': '卯', '未': '寅',
  '申': '丑', '酉': '子', '戌': '亥', '亥': '戌'
};

export const PEACH_BLOSSOM_MAP: Record<string, string> = {
  '子': '酉', '丑': '午', '寅': '卯', '卯': '子',
  '辰': '酉', '巳': '午', '午': '卯', '未': '子',
  '申': '酉', '酉': '午', '戌': '卯', '亥': '子'
};

export const HEAVENLY_VIRTUE_MAP: Record<string, string> = {
  '寅': '丁', '卯': '壬', '辰': '壬', '巳': '辛',
  '午': '甲', '未': '甲', '申': '癸', '酉': '壬',
  '戌': '丙', '亥': '乙', '子': '己', '丑': '庚'
};

export const MONTHLY_VIRTUE_MAP: Record<string, string> = {
  '寅': '丙', '卯': '甲', '辰': '壬', '巳': '庚',
  '午': '丙', '未': '甲', '申': '壬', '酉': '庚',
  '戌': '丙', '亥': '甲', '子': '壬', '丑': '庚'
};

export const ACADEMIC_STAR_MAP: Record<string, string> = {
  '甲': '巳', '乙': '午', '丙': '申', '丁': '酉', '戊': '申',
  '己': '酉', '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯'
};

export const LONELINESS_MAP: Record<string, string> = {
  '申': '戌', '子': '戌', '辰': '戌',
  '寅': '辰', '午': '辰', '戌': '辰',
  '亥': '丑', '卯': '丑', '未': '丑',
  '巳': '未', '酉': '未', '丑': '未'
};

export const WIDOW_MAP: Record<string, string> = {
  '申': '辰', '子': '辰', '辰': '辰',
  '寅': '戌', '午': '戌', '戌': '戌',
  '亥': '未', '卯': '未', '未': '未',
  '巳': '丑', '酉': '丑', '丑': '丑'
};

// ─────────────────────────────────────────────────────────────────────────────
// CONFLICT DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export const SIX_CLASHES: Array<[string, string]> = [
  ['子', '午'], ['丑', '未'], ['寅', '申'],
  ['卯', '酉'], ['辰', '戌'], ['巳', '亥']
];

export const SIX_HARMS: Array<[string, string]> = [
  ['子', '未'], ['丑', '午'], ['寅', '巳'],
  ['卯', '辰'], ['申', '亥'], ['酉', '戌']
];

export const PUNISHMENTS: Array<[string, string]> = [
  ['子', '卯'], ['卯', '子'],
  ['寅', '巳'], ['巳', '申'], ['申', '寅'],
  ['丑', '戌'], ['戌', '未'], ['未', '丑'],
  ['辰', '辰'], ['午', '午'], ['酉', '酉'], ['亥', '亥']
];

// ─────────────────────────────────────────────────────────────────────────────
// TRANSFORMATION DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export const LIUHE_COMBINATIONS: Record<string, { partner: string; result: ElementName }> = {
  '子': { partner: '丑', result: 'Earth' },
  '丑': { partner: '子', result: 'Earth' },
  '寅': { partner: '亥', result: 'Wood' },
  '亥': { partner: '寅', result: 'Wood' },
  '卯': { partner: '戌', result: 'Fire' },
  '戌': { partner: '卯', result: 'Fire' },
  '辰': { partner: '酉', result: 'Metal' },
  '酉': { partner: '辰', result: 'Metal' },
  '巳': { partner: '申', result: 'Water' },
  '申': { partner: '巳', result: 'Water' },
  '午': { partner: '未', result: 'Fire' },
  '未': { partner: '午', result: 'Fire' }
};

// ─────────────────────────────────────────────────────────────────────────────
// LAYER WEIGHTS
// ─────────────────────────────────────────────────────────────────────────────

export const LAYER_WEIGHTS: Record<TimingLayerName, number> = {
  luckPillar: 0.20,
  annual: 0.28,
  monthly: 0.22,
  daily: 0.18,
  hourly: 0.12
};

export const LAYER_CHINESE_NAMES: Record<TimingLayerName, string> = {
  luckPillar: '大运',
  annual: '流年',
  monthly: '流月',
  daily: '流日',
  hourly: '流时'
};

// ─────────────────────────────────────────────────────────────────────────────
// CORE ANALYSIS FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the palace branch for a family member
 */
function getPalaceBranch(
  natalPillars: NatalPillarsInput,
  palaceType: 'year' | 'month' | 'day' | 'hour'
): BranchName {
  switch (palaceType) {
    case 'year': return natalPillars.yearBranch;
    case 'month': return natalPillars.monthBranch;
    case 'day': return natalPillars.dayBranch;
    case 'hour': return natalPillars.hourBranch;
  }
}

/**
 * Analyze palace status for a family member
 */
function analyzePalaceStatus(
  palaceBranch: BranchName,
  timingPillar: TimingPillar,
  palaceName: string
): PalaceStatus {
  const timingBranch = timingPillar.branch;
  let hasClash = false;
  let hasHarm = false;
  let hasPunishment = false;
  let hasTransformation = false;

  // Check clash
  for (const [b1, b2] of SIX_CLASHES) {
    if ((timingBranch === b1 && palaceBranch === b2) ||
        (timingBranch === b2 && palaceBranch === b1)) {
      hasClash = true;
      break;
    }
  }

  // Check harm
  for (const [b1, b2] of SIX_HARMS) {
    if ((timingBranch === b1 && palaceBranch === b2) ||
        (timingBranch === b2 && palaceBranch === b1)) {
      hasHarm = true;
      break;
    }
  }

  // Check punishment
  for (const [b1, b2] of PUNISHMENTS) {
    if (timingBranch === b1 && palaceBranch === b2) {
      hasPunishment = true;
      break;
    }
  }

  // Check transformation (六合)
  const liuheInfo = LIUHE_COMBINATIONS[timingBranch];
  if (liuheInfo && liuheInfo.partner === palaceBranch) {
    hasTransformation = true;
  }

  // Determine status
  let status: 'stable' | 'activated' | 'disturbed' | 'transformed';
  let description: string;

  if (hasTransformation) {
    status = 'transformed';
    description = `${palaceName} palace harmonizes through Six Combination (六合)`;
  } else if (hasClash) {
    status = 'disturbed';
    description = `${palaceName} palace receives clash (冲) - disruption and change`;
  } else if (hasPunishment) {
    status = 'disturbed';
    description = `${palaceName} palace receives punishment (刑) - stress patterns`;
  } else if (hasHarm) {
    status = 'activated';
    description = `${palaceName} palace receives harm (害) - underlying tension`;
  } else {
    status = 'stable';
    description = `${palaceName} palace is stable`;
  }

  return {
    palace: palaceName,
    branch: palaceBranch,
    hasClash,
    hasHarm,
    hasPunishment,
    hasTransformation,
    status,
    description
  };
}

/**
 * Analyze a single timing layer for family member activation
 */
function analyzeLayerForFamilyMember(
  member: FamilyMember,
  layerName: TimingLayerName,
  pillar: TimingPillar,
  natalPillars: NatalPillarsInput,
  gender: Gender
): FamilyLayerActivation {
  const config = FAMILY_MEMBER_CONFIG[member];
  const triggers: FamilyActivationTrigger[] = [];
  let score = 0;

  const dayStem = natalPillars.dayStem;
  const yearBranch = natalPillars.yearBranch;
  const monthBranch = natalPillars.monthBranch;
  const palaceBranch = getPalaceBranch(natalPillars, config.palaceBranch);

  // ─────────────────────────────────────────────────────────────────────────
  // 1. TEN GOD ANALYSIS (40% weight)
  // ─────────────────────────────────────────────────────────────────────────

  const tenGod = getTenGod(dayStem, pillar.stem);

  // Primary Ten Gods
  if (config.primaryTenGods.includes(tenGod)) {
    score += 20;
    triggers.push({
      type: 'ten_god_primary',
      chinese: tenGod,
      description: `Primary ${config.chinese} star (${tenGod}) activated`,
      weight: 20,
      isPositive: true
    });
  }

  // Secondary Ten Gods
  if (config.secondaryTenGods.includes(tenGod)) {
    score += 12;
    triggers.push({
      type: 'ten_god_secondary',
      chinese: tenGod,
      description: `Secondary ${config.chinese} star (${tenGod}) activated`,
      weight: 12,
      isPositive: true
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. SHEN SHA ANALYSIS (20% weight)
  // ─────────────────────────────────────────────────────────────────────────

  const timingBranch = pillar.branch;
  const timingStem = pillar.stem;

  // Check relevant Shen Sha
  for (const shensha of config.relevantShensha) {
    let activated = false;

    if (shensha === '天乙贵人') {
      const noblemanBranches = NOBLEMAN_MAP[dayStem] || [];
      if (noblemanBranches.includes(timingBranch)) {
        activated = true;
      }
    } else if (shensha === '红鸾') {
      if (RED_MATCHMAKER_MAP[yearBranch] === timingBranch) {
        activated = true;
      }
    } else if (shensha === '天喜') {
      if (SKY_HAPPINESS_MAP[yearBranch] === timingBranch) {
        activated = true;
      }
    } else if (shensha === '桃花') {
      if (PEACH_BLOSSOM_MAP[yearBranch] === timingBranch) {
        activated = true;
      }
    } else if (shensha === '天德') {
      if (HEAVENLY_VIRTUE_MAP[monthBranch] === timingStem) {
        activated = true;
      }
    } else if (shensha === '月德') {
      if (MONTHLY_VIRTUE_MAP[monthBranch] === timingStem) {
        activated = true;
      }
    } else if (shensha === '文昌') {
      if (ACADEMIC_STAR_MAP[dayStem] === timingBranch) {
        activated = true;
      }
    }

    if (activated) {
      score += 10;
      triggers.push({
        type: 'shensha_positive',
        chinese: shensha,
        description: `${shensha} activated - supports ${config.chinese} relationship`,
        weight: 10,
        isPositive: true
      });
    }
  }

  // Check blocking Shen Sha
  for (const shensha of config.blockingShensha) {
    let activated = false;

    if (shensha === '孤辰') {
      if (LONELINESS_MAP[yearBranch] === timingBranch) {
        activated = true;
      }
    } else if (shensha === '寡宿') {
      if (WIDOW_MAP[yearBranch] === timingBranch) {
        activated = true;
      }
    }

    if (activated) {
      score -= 8;
      triggers.push({
        type: 'shensha_negative',
        chinese: shensha,
        description: `${shensha} present - challenges ${config.chinese} connection`,
        weight: -8,
        isPositive: false
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. PALACE CONFLICT ANALYSIS (20% weight)
  // ─────────────────────────────────────────────────────────────────────────

  const palaceStatus = analyzePalaceStatus(palaceBranch, pillar, config.chinese);

  if (palaceStatus.hasTransformation) {
    score += 12;
    triggers.push({
      type: 'palace_harmony',
      chinese: '六合',
      description: `Palace harmonizes through transformation`,
      weight: 12,
      isPositive: true
    });
  }

  if (palaceStatus.hasClash) {
    score -= 15;
    triggers.push({
      type: 'palace_clash',
      chinese: '冲',
      description: `${config.chinese} palace clashed - disruption likely`,
      weight: -15,
      isPositive: false
    });
  }

  if (palaceStatus.hasPunishment) {
    score -= 12;
    triggers.push({
      type: 'palace_punishment',
      chinese: '刑',
      description: `${config.chinese} palace punished - stress patterns`,
      weight: -12,
      isPositive: false
    });
  }

  if (palaceStatus.hasHarm) {
    score -= 8;
    triggers.push({
      type: 'palace_harm',
      chinese: '害',
      description: `${config.chinese} palace harmed - underlying tension`,
      weight: -8,
      isPositive: false
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. TRANSFORMATION ANALYSIS (20% weight)
  // ─────────────────────────────────────────────────────────────────────────

  // Check if timing branch forms combination with natal branches
  const natalBranches = [yearBranch, monthBranch, natalPillars.dayBranch, natalPillars.hourBranch];
  const liuheInfo = LIUHE_COMBINATIONS[timingBranch];

  if (liuheInfo && natalBranches.includes(liuheInfo.partner as BranchName)) {
    score += 8;
    triggers.push({
      type: 'transformation',
      chinese: '六合',
      description: `Six Combination (六合) with natal chart - harmony`,
      weight: 8,
      isPositive: true
    });
  }

  // Determine if activated
  const activated = score > 0;
  const normalizedScore = Math.max(0, Math.min(100, 50 + score));

  return {
    layer: layerName,
    layerChinese: LAYER_CHINESE_NAMES[layerName],
    pillar,
    activated,
    score: normalizedScore,
    triggers
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN TIMING FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute timing for a specific family member
 */
export function computeFamilyMemberTiming(
  member: FamilyMember,
  natalPillars: NatalPillarsInput,
  gender: Gender,
  luckPillar: TimingPillar | null,
  annualPillar: TimingPillar,
  monthlyPillar: TimingPillar,
  dailyPillar: TimingPillar,
  hourlyPillar: TimingPillar,
  familyMemberChart?: NatalPillarsInput // Optional: actual family member's chart for synastry
): FamilyMemberTimingResult {
  const config = FAMILY_MEMBER_CONFIG[member];
  const layerActivations: FamilyLayerActivation[] = [];

  // Analyze each layer
  const layers: Array<{ name: TimingLayerName; pillar: TimingPillar | null }> = [
    { name: 'luckPillar', pillar: luckPillar },
    { name: 'annual', pillar: annualPillar },
    { name: 'monthly', pillar: monthlyPillar },
    { name: 'daily', pillar: dailyPillar },
    { name: 'hourly', pillar: hourlyPillar }
  ];

  for (const { name, pillar } of layers) {
    if (!pillar) continue;

    const activation = analyzeLayerForFamilyMember(member, name, pillar, natalPillars, gender);
    layerActivations.push(activation);
  }

  // Calculate weighted score
  let weightedScore = 0;
  for (const activation of layerActivations) {
    weightedScore += activation.score * LAYER_WEIGHTS[activation.layer];
  }

  // Resonance bonus for multiple layer activation
  const activeLayerCount = layerActivations.filter(l => l.activated).length;
  let resonanceBonus = 0;
  if (activeLayerCount >= 4) resonanceBonus = 12;
  else if (activeLayerCount >= 3) resonanceBonus = 8;
  else if (activeLayerCount >= 2) resonanceBonus = 4;

  const finalScore = Math.max(0, Math.min(100, weightedScore + resonanceBonus));

  // Determine tier
  const tier = getFamilyTier(finalScore);

  // Collect triggers
  const allTriggers = layerActivations.flatMap(l => l.triggers);
  const keyTriggers = allTriggers.filter(t => t.isPositive).sort((a, b) => b.weight - a.weight).slice(0, 4);
  const blockers = allTriggers.filter(t => !t.isPositive).sort((a, b) => a.weight - b.weight).slice(0, 3);

  // Analyze primary palace
  const palaceBranch = getPalaceBranch(natalPillars, config.palaceBranch);
  const palaceStatus = analyzePalaceStatus(palaceBranch, annualPillar, config.chinese);

  // Generate narrative and recommendation
  const narrative = buildFamilyNarrative(member, tier, activeLayerCount, keyTriggers, blockers, palaceStatus);
  const recommendation = buildFamilyRecommendation(member, tier, palaceStatus);

  return {
    member,
    memberChinese: config.chinese,
    score: Math.round(finalScore),
    tier,
    tierChinese: getTierChinese(tier),
    layerActivations,
    activeLayerCount,
    keyTriggers,
    blockers,
    palaceStatus,
    narrative,
    recommendation
  };
}

/**
 * Compute comprehensive family timing for all relationships
 */
export function computeComprehensiveFamilyTiming(
  natalPillars: NatalPillarsInput,
  gender: Gender,
  luckPillar: TimingPillar | null,
  annualPillar: TimingPillar,
  monthlyPillar: TimingPillar,
  dailyPillar: TimingPillar,
  hourlyPillar: TimingPillar
): ComprehensiveFamilyTiming {

  // Compute all family member timings
  const father = computeFamilyMemberTiming('father', natalPillars, gender, luckPillar, annualPillar, monthlyPillar, dailyPillar, hourlyPillar);
  const mother = computeFamilyMemberTiming('mother', natalPillars, gender, luckPillar, annualPillar, monthlyPillar, dailyPillar, hourlyPillar);
  const son = computeFamilyMemberTiming('son', natalPillars, gender, luckPillar, annualPillar, monthlyPillar, dailyPillar, hourlyPillar);
  const daughter = computeFamilyMemberTiming('daughter', natalPillars, gender, luckPillar, annualPillar, monthlyPillar, dailyPillar, hourlyPillar);
  const brother = computeFamilyMemberTiming('brother', natalPillars, gender, luckPillar, annualPillar, monthlyPillar, dailyPillar, hourlyPillar);
  const sister = computeFamilyMemberTiming('sister', natalPillars, gender, luckPillar, annualPillar, monthlyPillar, dailyPillar, hourlyPillar);

  // Spouse based on gender
  const spouseMember = gender === 'male' ? 'wife' : 'husband';
  const spouse = computeFamilyMemberTiming(spouseMember, natalPillars, gender, luckPillar, annualPillar, monthlyPillar, dailyPillar, hourlyPillar);

  // Calculate family harmony score (average of all)
  const allScores = [father.score, mother.score, son.score, daughter.score, brother.score, sister.score, spouse.score];
  const familyHarmonyScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);

  // Find dominant theme
  const allResults = [
    { result: father, label: '父亲关系' },
    { result: mother, label: '母亲关系' },
    { result: son, label: '儿子关系' },
    { result: daughter, label: '女儿关系' },
    { result: brother, label: '兄弟关系' },
    { result: sister, label: '姐妹关系' },
    { result: spouse, label: '配偶关系' }
  ];

  const excellentRelations = allResults.filter(r => r.result.tier === 'excellent' || r.result.tier === 'good');
  const challengingRelations = allResults.filter(r => r.result.tier === 'strained' || r.result.tier === 'challenging');

  let dominantTheme = '';
  if (excellentRelations.length > challengingRelations.length) {
    dominantTheme = `Favorable: ${excellentRelations.map(r => r.label).join(', ')}`;
  } else if (challengingRelations.length > 0) {
    dominantTheme = `Attention needed: ${challengingRelations.map(r => r.label).join(', ')}`;
  } else {
    dominantTheme = 'Family dynamics are balanced';
  }

  // Build summary
  const summaryParts: string[] = [];
  summaryParts.push(`Family Harmony Score: ${familyHarmonyScore}`);

  if (excellentRelations.length > 0) {
    summaryParts.push(`Strong connections with ${excellentRelations.length} family members.`);
  }
  if (challengingRelations.length > 0) {
    summaryParts.push(`${challengingRelations.length} relationships need attention.`);
  }

  return {
    parents: { father, mother },
    children: { son, daughter },
    siblings: { brother, sister },
    spouse,
    dominantTheme,
    familyHarmonyScore,
    summary: summaryParts.join(' '),
    timestamp: new Date().toISOString()
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function getFamilyTier(score: number): FamilyTier {
  if (score >= 72) return 'excellent';
  if (score >= 58) return 'good';
  if (score >= 42) return 'neutral';
  if (score >= 28) return 'strained';
  return 'challenging';
}

function getTierChinese(tier: FamilyTier): string {
  switch (tier) {
    case 'excellent': return '和谐';
    case 'good': return '良好';
    case 'neutral': return '平稳';
    case 'strained': return '紧张';
    case 'challenging': return '挑战';
  }
}

function buildFamilyNarrative(
  member: FamilyMember,
  tier: FamilyTier,
  activeLayerCount: number,
  keyTriggers: FamilyActivationTrigger[],
  blockers: FamilyActivationTrigger[],
  palaceStatus: PalaceStatus
): string {
  const config = FAMILY_MEMBER_CONFIG[member];
  const parts: string[] = [];

  // Opening based on tier
  switch (tier) {
    case 'excellent':
      parts.push(`Excellent timing for ${config.chinese} relationship.`);
      parts.push(`${activeLayerCount} timing layers support connection.`);
      break;
    case 'good':
      parts.push(`Good energy for ${config.chinese} bond.`);
      parts.push(`Multiple supportive factors present.`);
      break;
    case 'neutral':
      parts.push(`${config.chinese} relationship is stable.`);
      parts.push(`Maintain existing patterns.`);
      break;
    case 'strained':
      parts.push(`Some tension in ${config.chinese} relationship.`);
      parts.push(`Extra patience and understanding needed.`);
      break;
    case 'challenging':
      parts.push(`Challenging period for ${config.chinese} connection.`);
      parts.push(`Focus on communication and boundaries.`);
      break;
  }

  // Palace status
  if (palaceStatus.status === 'transformed') {
    parts.push(`Palace harmonizes through combination.`);
  } else if (palaceStatus.status === 'disturbed') {
    parts.push(`${palaceStatus.palace} palace is disturbed - expect changes.`);
  }

  // Key triggers
  if (keyTriggers.length > 0) {
    const triggerNames = keyTriggers.slice(0, 2).map(t => t.chinese).join(', ');
    parts.push(`Activators: ${triggerNames}.`);
  }

  return parts.join(' ');
}

function buildFamilyRecommendation(
  member: FamilyMember,
  tier: FamilyTier,
  palaceStatus: PalaceStatus
): string {
  const config = FAMILY_MEMBER_CONFIG[member];

  if (tier === 'excellent' || tier === 'good') {
    if (member === 'father' || member === 'mother') {
      return `Favorable time for deepening connection with ${config.chinese}. Express gratitude and spend quality time together.`;
    } else if (member === 'son' || member === 'daughter') {
      return `Good period for bonding with children. Support their growth and celebrate their achievements.`;
    } else if (member === 'brother' || member === 'sister') {
      return `Sibling harmony is strong. Collaborate on shared goals and strengthen family bonds.`;
    } else {
      return `Excellent energy for spouse relationship. Plan meaningful activities together.`;
    }
  }

  if (tier === 'neutral') {
    return `Maintain steady communication with ${config.chinese}. No major changes needed.`;
  }

  if (tier === 'strained') {
    if (palaceStatus.hasClash) {
      return `${config.chinese} palace clashed - avoid confrontation. Give space and revisit issues later.`;
    }
    return `Exercise patience with ${config.chinese}. Focus on understanding rather than being understood.`;
  }

  // Challenging
  if (palaceStatus.hasPunishment) {
    return `Self-reflection needed in ${config.chinese} relationship. Avoid projecting frustrations.`;
  }
  return `Challenging period - set healthy boundaries while maintaining respect. Seek mediation if needed.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY MODE FORMATTERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format single family member timing for story mode
 */
export function formatFamilyMemberStory(result: FamilyMemberTimingResult): string {
  const lines: string[] = [];

  lines.push(`### ${result.memberChinese} (${result.member}) Timing`);
  lines.push('');
  lines.push(`**Score:** ${result.score} — ${result.tierChinese} (${result.tier})`);
  lines.push(`**Active Layers:** ${result.activeLayerCount}`);
  lines.push('');

  // Palace status
  lines.push(`**Palace Status:** ${result.palaceStatus.status}`);
  lines.push(`- ${result.palaceStatus.description}`);
  lines.push('');

  // Key triggers
  if (result.keyTriggers.length > 0) {
    lines.push('**Supportive Factors:**');
    for (const trigger of result.keyTriggers) {
      lines.push(`- ${trigger.chinese}: ${trigger.description}`);
    }
    lines.push('');
  }

  // Blockers
  if (result.blockers.length > 0) {
    lines.push('**Challenges:**');
    for (const blocker of result.blockers) {
      lines.push(`- ${blocker.chinese}: ${blocker.description}`);
    }
    lines.push('');
  }

  // Narrative
  lines.push('**Interpretation:**');
  lines.push(result.narrative);
  lines.push('');

  // Recommendation
  lines.push('**Recommendation:**');
  lines.push(result.recommendation);

  return lines.join('\n');
}

/**
 * Format comprehensive family timing for story mode
 */
export function formatComprehensiveFamilyStory(result: ComprehensiveFamilyTiming): string {
  const lines: string[] = [];

  lines.push('# 家庭应期 Family Dynamics Timing');
  lines.push('');
  lines.push(`**Generated:** ${result.timestamp}`);
  lines.push(`**Family Harmony Score:** ${result.familyHarmonyScore}`);
  lines.push(`**Dominant Theme:** ${result.dominantTheme}`);
  lines.push('');
  lines.push(`**Summary:** ${result.summary}`);
  lines.push('');

  // Quick overview table
  lines.push('## Overview');
  lines.push('| Relationship | Score | Status | Palace |');
  lines.push('|--------------|-------|--------|--------|');
  lines.push(`| 父亲 Father | ${result.parents.father.score} | ${result.parents.father.tierChinese} | ${result.parents.father.palaceStatus.status} |`);
  lines.push(`| 母亲 Mother | ${result.parents.mother.score} | ${result.parents.mother.tierChinese} | ${result.parents.mother.palaceStatus.status} |`);
  lines.push(`| 儿子 Son | ${result.children.son.score} | ${result.children.son.tierChinese} | ${result.children.son.palaceStatus.status} |`);
  lines.push(`| 女儿 Daughter | ${result.children.daughter.score} | ${result.children.daughter.tierChinese} | ${result.children.daughter.palaceStatus.status} |`);
  lines.push(`| 兄弟 Brother | ${result.siblings.brother.score} | ${result.siblings.brother.tierChinese} | ${result.siblings.brother.palaceStatus.status} |`);
  lines.push(`| 姐妹 Sister | ${result.siblings.sister.score} | ${result.siblings.sister.tierChinese} | ${result.siblings.sister.palaceStatus.status} |`);
  if (result.spouse) {
    lines.push(`| 配偶 Spouse | ${result.spouse.score} | ${result.spouse.tierChinese} | ${result.spouse.palaceStatus.status} |`);
  }
  lines.push('');

  // Detailed sections
  lines.push('---');
  lines.push('## Parents (父母)');
  lines.push('');
  lines.push(formatFamilyMemberStory(result.parents.father));
  lines.push('');
  lines.push(formatFamilyMemberStory(result.parents.mother));
  lines.push('');

  lines.push('---');
  lines.push('## Children (子女)');
  lines.push('');
  lines.push(formatFamilyMemberStory(result.children.son));
  lines.push('');
  lines.push(formatFamilyMemberStory(result.children.daughter));
  lines.push('');

  lines.push('---');
  lines.push('## Siblings (兄弟姐妹)');
  lines.push('');
  lines.push(formatFamilyMemberStory(result.siblings.brother));
  lines.push('');
  lines.push(formatFamilyMemberStory(result.siblings.sister));

  if (result.spouse) {
    lines.push('');
    lines.push('---');
    lines.push('## Spouse (配偶)');
    lines.push('');
    lines.push(formatFamilyMemberStory(result.spouse));
  }

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// ANNUAL FAMILY FORECAST
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate annual family forecast for multiple years
 */
export function generateFamilyForecast(
  natalPillars: NatalPillarsInput,
  gender: Gender,
  luckPillar: TimingPillar | null,
  annualPillars: Array<{ year: number; pillar: TimingPillar }>,
  monthlyPillar: TimingPillar,
  dailyPillar: TimingPillar,
  hourlyPillar: TimingPillar
): Array<{ year: number; timing: ComprehensiveFamilyTiming }> {

  return annualPillars.map(({ year, pillar }) => ({
    year,
    timing: computeComprehensiveFamilyTiming(
      natalPillars,
      gender,
      luckPillar,
      pillar,
      monthlyPillar,
      dailyPillar,
      hourlyPillar
    )
  }));
}
