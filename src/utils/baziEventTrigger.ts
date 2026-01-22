/**
 * =============================================================================
 * BAZI EVENT TRIGGER ENGINE (应期)
 * =============================================================================
 *
 * The crown jewel of the BaZi timing system. This engine synthesizes all
 * timing layers to predict when specific events are most likely to occur.
 *
 * CORE PRINCIPLE: Multi-Layer Resonance
 * An event is triggered when 3 or more timing layers activate the same theme:
 *   - 大运 (Luck Pillar) → 10-year foundation
 *   - 流年 (Annual)      → Yearly activation
 *   - 流月 (Monthly)     → Monthly window
 *   - 流日 (Daily)       → Day-level trigger
 *   - 流时 (Hourly)      → Hour-level precision
 *
 * The more layers align, the stronger the event probability.
 *
 * FOUR EVENT TYPES:
 *   1. Wealth Events (财应期)      → Income, opportunities, investments
 *   2. Relationship Events (感情应期) → Meeting, dating, commitment
 *   3. Career Events (事业应期)    → Promotion, recognition, leadership
 *   4. Health Events (健康应期)    → Vulnerability, recovery, vitality
 *
 * SCORING MODEL:
 *   80-100 → Strong Event Window (高度激活)
 *   65-79  → Likely Event Window (可能激活)
 *   45-64  → Mild Activation (轻度激活)
 *   <45    → No Event (未激活)
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

export type EventType = 'wealth' | 'relationship' | 'career' | 'health';
export type EventTier = 'strong' | 'likely' | 'mild' | 'none';
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

export type DMStrength = 'strong' | 'neutral' | 'weak';

/**
 * Individual layer activation result
 */
export interface LayerActivation {
  layer: TimingLayerName;
  layerChinese: string;
  pillar: TimingPillar;
  activated: boolean;
  score: number;
  triggers: ActivationTrigger[];
}

/**
 * Individual trigger within a layer
 */
export interface ActivationTrigger {
  type: string;
  chinese: string;
  description: string;
  weight: number;
  isPositive: boolean;
}

/**
 * Complete event trigger result
 */
export interface EventTriggerResult {
  eventType: EventType;
  eventTypeChinese: string;
  score: number;
  tier: EventTier;
  tierChinese: string;
  layerActivations: LayerActivation[];
  activeLayerCount: number;
  totalPossibleLayers: number;
  resonanceStrength: number; // 0-100 based on layer alignment
  keyTriggers: ActivationTrigger[];
  blockers: ActivationTrigger[];
  narrative: string;
  recommendation: string;
  debugInfo: EventDebugInfo;
}

/**
 * Debug information for transparency
 */
export interface EventDebugInfo {
  rawScore: number;
  bonusScore: number;
  penaltyScore: number;
  layerWeights: Record<TimingLayerName, number>;
  activationFormula: string;
}

/**
 * Comprehensive multi-event result
 */
export interface ComprehensiveEventTrigger {
  wealth: EventTriggerResult;
  relationship: EventTriggerResult;
  career: EventTriggerResult;
  health: EventTriggerResult;
  dominantEvent: EventType | null;
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

// ─────────────────────────────────────────────────────────────────────────────
// TEN GODS CALCULATION
// ─────────────────────────────────────────────────────────────────────────────

export const ELEMENT_PRODUCES: Record<ElementName, ElementName> = {
  Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood'
};

export const ELEMENT_CONTROLS: Record<ElementName, ElementName> = {
  Wood: 'Earth', Fire: 'Metal', Earth: 'Water', Metal: 'Wood', Water: 'Fire'
};

export const STEM_POLARITY: Record<string, 'Yang' | 'Yin'> = {
  '甲': 'Yang', '乙': 'Yin', '丙': 'Yang', '丁': 'Yin', '戊': 'Yang',
  '己': 'Yin', '庚': 'Yang', '辛': 'Yin', '壬': 'Yang', '癸': 'Yin'
};

export type TenGodName =
  | 'Rob Wealth' | 'Friend'
  | 'Eating God' | 'Hurting Officer'
  | 'Direct Wealth' | 'Indirect Wealth'
  | 'Direct Officer' | 'Seven Killings'
  | 'Direct Resource' | 'Indirect Resource';

/**
 * Calculate Ten God relationship from DM to another stem
 */
export function getTenGod(dmStem: StemName, targetStem: StemName): TenGodName {
  const dmElement = STEM_ELEMENT[dmStem];
  const targetElement = STEM_ELEMENT[targetStem];
  const dmPolarity = STEM_POLARITY[dmStem];
  const targetPolarity = STEM_POLARITY[targetStem];
  const samePolarity = dmPolarity === targetPolarity;

  // Same element → Companion stars
  if (targetElement === dmElement) {
    return samePolarity ? 'Friend' : 'Rob Wealth';
  }

  // DM produces target → Output stars
  if (ELEMENT_PRODUCES[dmElement] === targetElement) {
    return samePolarity ? 'Eating God' : 'Hurting Officer';
  }

  // DM controls target → Wealth stars
  if (ELEMENT_CONTROLS[dmElement] === targetElement) {
    return samePolarity ? 'Indirect Wealth' : 'Direct Wealth';
  }

  // Target controls DM → Officer stars
  if (ELEMENT_CONTROLS[targetElement] === dmElement) {
    return samePolarity ? 'Seven Killings' : 'Direct Officer';
  }

  // Target produces DM → Resource stars
  return samePolarity ? 'Indirect Resource' : 'Direct Resource';
}

// ─────────────────────────────────────────────────────────────────────────────
// SHEN SHA DEFINITIONS FOR EVENTS
// ─────────────────────────────────────────────────────────────────────────────

// Wealth Shen Sha
export const LU_SHEN_MAP: Record<string, string> = {
  '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午', '戊': '巳',
  '己': '午', '庚': '申', '辛': '酉', '壬': '亥', '癸': '子'
};

export const HEAVENLY_KITCHEN_MAP: Record<string, string> = {
  '甲': '巳', '乙': '午', '丙': '巳', '丁': '午', '戊': '巳',
  '己': '午', '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯'
};

export const GOLDEN_CARRIAGE_MAP: Record<string, string> = {
  '甲': '辰', '乙': '巳', '丙': '未', '丁': '申', '戊': '未',
  '己': '申', '庚': '戌', '辛': '亥', '壬': '丑', '癸': '寅'
};

export const TRAVELING_HORSE_MAP: Record<string, string> = {
  '申': '寅', '子': '寅', '辰': '寅',
  '寅': '申', '午': '申', '戌': '申',
  '亥': '巳', '卯': '巳', '未': '巳',
  '巳': '亥', '酉': '亥', '丑': '亥'
};

// Relationship Shen Sha
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

// Career Shen Sha
export const NOBLEMAN_MAP: Record<string, string[]> = {
  '甲': ['丑', '未'], '乙': ['子', '申'], '丙': ['亥', '酉'],
  '丁': ['亥', '酉'], '戊': ['丑', '未'], '己': ['子', '申'],
  '庚': ['丑', '未'], '辛': ['寅', '午'], '壬': ['卯', '巳'],
  '癸': ['卯', '巳']
};

export const ACADEMIC_STAR_MAP: Record<string, string> = {
  '甲': '巳', '乙': '午', '丙': '申', '丁': '酉', '戊': '申',
  '己': '酉', '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯'
};

export const GENERAL_STAR_MAP: Record<string, string> = {
  '申': '子', '子': '子', '辰': '子',
  '寅': '午', '午': '午', '戌': '午',
  '亥': '卯', '卯': '卯', '未': '卯',
  '巳': '酉', '酉': '酉', '丑': '酉'
};

// Health Shen Sha
export const HEAVENLY_DOCTOR_MAP: Record<string, string> = {
  '子': '亥', '丑': '子', '寅': '丑', '卯': '寅',
  '辰': '卯', '巳': '辰', '午': '巳', '未': '午',
  '申': '未', '酉': '申', '戌': '酉', '亥': '戌'
};

export const DISASTER_SHA_MAP: Record<string, string> = {
  '申': '午', '子': '午', '辰': '午',
  '寅': '子', '午': '子', '戌': '子',
  '亥': '酉', '卯': '酉', '未': '酉',
  '巳': '卯', '酉': '卯', '丑': '卯'
};

export const DEATH_SPIRIT_MAP: Record<string, string> = {
  '申': '亥', '子': '亥', '辰': '亥',
  '寅': '巳', '午': '巳', '戌': '巳',
  '亥': '寅', '卯': '寅', '未': '寅',
  '巳': '申', '酉': '申', '丑': '申'
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

export const SANHE_FRAMES: Record<string, { branches: [string, string, string]; result: ElementName }> = {
  Water: { branches: ['申', '子', '辰'], result: 'Water' },
  Wood: { branches: ['亥', '卯', '未'], result: 'Wood' },
  Fire: { branches: ['寅', '午', '戌'], result: 'Fire' },
  Metal: { branches: ['巳', '酉', '丑'], result: 'Metal' }
};

// ─────────────────────────────────────────────────────────────────────────────
// LAYER WEIGHT CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

export const LAYER_WEIGHTS: Record<TimingLayerName, number> = {
  luckPillar: 0.20,  // 20% - Foundation
  annual: 0.25,      // 25% - Main driver
  monthly: 0.25,     // 25% - Window
  daily: 0.18,       // 18% - Trigger
  hourly: 0.12       // 12% - Fine-tuning
};

export const LAYER_CHINESE_NAMES: Record<TimingLayerName, string> = {
  luckPillar: '大运',
  annual: '流年',
  monthly: '流月',
  daily: '流日',
  hourly: '流时'
};

// ─────────────────────────────────────────────────────────────────────────────
// EVENT TYPE CONFIGURATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const EVENT_TYPE_CONFIG: Record<EventType, {
  chinese: string;
  description: string;
  primaryTenGods: TenGodName[];
  supportingTenGods: TenGodName[];
  blockingTenGods: TenGodName[];
  primaryShensha: string[];
  supportingShensha: string[];
  blockingShensha: string[];
}> = {
  wealth: {
    chinese: '财应期',
    description: 'Wealth activation window',
    primaryTenGods: ['Direct Wealth', 'Indirect Wealth'],
    supportingTenGods: ['Eating God', 'Hurting Officer'],
    blockingTenGods: ['Rob Wealth', 'Seven Killings'],
    primaryShensha: ['禄神', '天厨'],
    supportingShensha: ['金舆', '驿马', '福星'],
    blockingShensha: ['劫煞', '亡神']
  },
  relationship: {
    chinese: '感情应期',
    description: 'Relationship activation window',
    primaryTenGods: ['Direct Officer', 'Direct Wealth'], // For females / males
    supportingTenGods: ['Direct Resource', 'Eating God'],
    blockingTenGods: ['Seven Killings', 'Hurting Officer'],
    primaryShensha: ['红鸾', '天喜', '桃花'],
    supportingShensha: ['天乙贵人', '天德', '月德'],
    blockingShensha: ['孤辰', '寡宿', '劫煞']
  },
  career: {
    chinese: '事业应期',
    description: 'Career activation window',
    primaryTenGods: ['Direct Officer', 'Seven Killings'],
    supportingTenGods: ['Eating God', 'Direct Resource', 'Indirect Resource'],
    blockingTenGods: ['Hurting Officer', 'Rob Wealth'],
    primaryShensha: ['将星', '文昌', '天乙贵人'],
    supportingShensha: ['华盖', '驿马', '天德'],
    blockingShensha: ['羊刃', '劫煞', '亡神']
  },
  health: {
    chinese: '健康应期',
    description: 'Health vulnerability/recovery window',
    primaryTenGods: ['Seven Killings', 'Hurting Officer'], // Negative markers
    supportingTenGods: ['Direct Resource', 'Indirect Resource'], // Recovery
    blockingTenGods: [], // N/A for health
    primaryShensha: ['天医'], // Positive
    supportingShensha: ['天德', '月德'],
    blockingShensha: ['灾煞', '亡神', '劫煞', '天罗', '地网']
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CORE ANALYSIS FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Analyze a single timing layer for event activation
 */
export function analyzeLayerForEvent(
  eventType: EventType,
  layerName: TimingLayerName,
  pillar: TimingPillar,
  natalPillars: NatalPillarsInput,
  dmStrength: DMStrength,
  usefulGod: ElementName | null,
  annoyingGod: ElementName | null
): LayerActivation {
  const config = EVENT_TYPE_CONFIG[eventType];
  const triggers: ActivationTrigger[] = [];
  let score = 0;

  const dayStem = natalPillars.dayStem;
  const yearBranch = natalPillars.yearBranch;
  const pillarStemElement = STEM_ELEMENT[pillar.stem];
  const pillarBranchElement = BRANCH_ELEMENT[pillar.branch];

  // ─────────────────────────────────────────────────────────────────────────
  // 1. TEN GODS ANALYSIS
  // ─────────────────────────────────────────────────────────────────────────

  const tenGod = getTenGod(dayStem, pillar.stem);

  // Primary Ten Gods
  if (config.primaryTenGods.includes(tenGod)) {
    const weight = eventType === 'health' ? -15 : 18; // Health: negative markers
    score += weight;
    triggers.push({
      type: 'ten_god_primary',
      chinese: tenGod,
      description: `Primary ${eventType} star: ${tenGod}`,
      weight,
      isPositive: eventType !== 'health'
    });
  }

  // Supporting Ten Gods
  if (config.supportingTenGods.includes(tenGod)) {
    const weight = 12;
    score += weight;
    triggers.push({
      type: 'ten_god_support',
      chinese: tenGod,
      description: `Supporting star: ${tenGod}`,
      weight,
      isPositive: true
    });
  }

  // Blocking Ten Gods
  if (config.blockingTenGods.includes(tenGod)) {
    const weight = -10;
    score += weight;
    triggers.push({
      type: 'ten_god_blocker',
      chinese: tenGod,
      description: `Blocking star: ${tenGod}`,
      weight,
      isPositive: false
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. SHEN SHA ANALYSIS
  // ─────────────────────────────────────────────────────────────────────────

  const shenshaHits = detectEventShensha(eventType, pillar, natalPillars);

  for (const hit of shenshaHits) {
    score += hit.weight;
    triggers.push(hit);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. USEFUL GOD / ANNOYING GOD ANALYSIS
  // ─────────────────────────────────────────────────────────────────────────

  if (usefulGod) {
    if (pillarStemElement === usefulGod || pillarBranchElement === usefulGod) {
      const weight = eventType === 'health' ? 15 : 12; // Health: useful god = recovery
      score += weight;
      triggers.push({
        type: 'useful_god',
        chinese: '用神',
        description: `Useful God (${usefulGod}) activated`,
        weight,
        isPositive: true
      });
    }
  }

  if (annoyingGod) {
    if (pillarStemElement === annoyingGod || pillarBranchElement === annoyingGod) {
      const weight = eventType === 'health' ? -15 : -10;
      score += weight;
      triggers.push({
        type: 'annoying_god',
        chinese: '忌神',
        description: `Annoying God (${annoyingGod}) activated`,
        weight,
        isPositive: false
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. CONFLICT ANALYSIS (Mainly for Health)
  // ─────────────────────────────────────────────────────────────────────────

  const conflicts = detectEventConflicts(pillar, natalPillars);

  if (eventType === 'health' && conflicts.length > 0) {
    for (const conflict of conflicts) {
      score -= conflict.severity;
      triggers.push({
        type: 'conflict',
        chinese: conflict.chinese,
        description: conflict.description,
        weight: -conflict.severity,
        isPositive: false
      });
    }
  } else if (eventType !== 'health' && conflicts.length > 0) {
    // For non-health events, conflicts are mild blockers
    for (const conflict of conflicts) {
      const weight = Math.floor(-conflict.severity / 2);
      score += weight;
      triggers.push({
        type: 'conflict',
        chinese: conflict.chinese,
        description: conflict.description,
        weight,
        isPositive: false
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 5. TRANSFORMATION ANALYSIS
  // ─────────────────────────────────────────────────────────────────────────

  const transformations = detectEventTransformations(eventType, pillar, natalPillars, usefulGod);

  for (const trans of transformations) {
    score += trans.weight;
    triggers.push(trans);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 6. DM STRENGTH MODIFIER
  // ─────────────────────────────────────────────────────────────────────────

  if (eventType === 'health') {
    if (dmStrength === 'weak') {
      // Weak DM is more vulnerable
      score -= 5;
      triggers.push({
        type: 'dm_strength',
        chinese: '身弱',
        description: 'Weak DM increases vulnerability',
        weight: -5,
        isPositive: false
      });
    } else if (dmStrength === 'strong') {
      score += 5;
      triggers.push({
        type: 'dm_strength',
        chinese: '身强',
        description: 'Strong DM provides resilience',
        weight: 5,
        isPositive: true
      });
    }
  } else if (eventType === 'wealth') {
    // For wealth, weak DM struggles to hold wealth
    if (dmStrength === 'weak' && config.primaryTenGods.includes(tenGod)) {
      score -= 5;
      triggers.push({
        type: 'dm_strength',
        chinese: '身弱不担财',
        description: 'Weak DM may struggle to hold wealth',
        weight: -5,
        isPositive: false
      });
    }
  } else if (eventType === 'career') {
    // For career, weak DM struggles under officer pressure
    if (dmStrength === 'weak' && tenGod === 'Seven Killings') {
      score -= 8;
      triggers.push({
        type: 'dm_strength',
        chinese: '身弱杀重',
        description: 'Weak DM under heavy Seven Killings pressure',
        weight: -8,
        isPositive: false
      });
    }
  }

  // Determine if activated (score > 0)
  const activated = score > 0;

  return {
    layer: layerName,
    layerChinese: LAYER_CHINESE_NAMES[layerName],
    pillar,
    activated,
    score: Math.max(0, Math.min(100, 50 + score)), // Normalize to 0-100
    triggers
  };
}

/**
 * Detect event-specific Shen Sha
 */
function detectEventShensha(
  eventType: EventType,
  pillar: TimingPillar,
  natalPillars: NatalPillarsInput
): ActivationTrigger[] {
  const triggers: ActivationTrigger[] = [];
  const { branch: timingBranch, stem: timingStem } = pillar;
  const yearBranch = natalPillars.yearBranch;
  const dayStem = natalPillars.dayStem;

  if (eventType === 'wealth') {
    // 禄神 (Prosperity Star)
    if (LU_SHEN_MAP[dayStem] === timingBranch) {
      triggers.push({
        type: 'shensha_primary',
        chinese: '禄神',
        description: 'Prosperity Star activated - wealth energy strong',
        weight: 15,
        isPositive: true
      });
    }

    // 天厨 (Heavenly Kitchen)
    if (HEAVENLY_KITCHEN_MAP[dayStem] === timingBranch) {
      triggers.push({
        type: 'shensha_primary',
        chinese: '天厨',
        description: 'Heavenly Kitchen activated - abundance energy',
        weight: 12,
        isPositive: true
      });
    }

    // 金舆 (Golden Carriage)
    if (GOLDEN_CARRIAGE_MAP[dayStem] === timingBranch) {
      triggers.push({
        type: 'shensha_support',
        chinese: '金舆',
        description: 'Golden Carriage activated - material support',
        weight: 10,
        isPositive: true
      });
    }

    // 驿马 (Traveling Horse)
    if (TRAVELING_HORSE_MAP[yearBranch] === timingBranch) {
      triggers.push({
        type: 'shensha_support',
        chinese: '驿马',
        description: 'Traveling Horse activated - movement brings opportunity',
        weight: 8,
        isPositive: true
      });
    }
  }

  if (eventType === 'relationship') {
    // 红鸾 (Red Matchmaker)
    if (RED_MATCHMAKER_MAP[yearBranch] === timingBranch) {
      triggers.push({
        type: 'shensha_primary',
        chinese: '红鸾',
        description: 'Red Matchmaker activated - marriage energy strong',
        weight: 18,
        isPositive: true
      });
    }

    // 天喜 (Sky Happiness)
    if (SKY_HAPPINESS_MAP[yearBranch] === timingBranch) {
      triggers.push({
        type: 'shensha_primary',
        chinese: '天喜',
        description: 'Sky Happiness activated - joyful relationship energy',
        weight: 15,
        isPositive: true
      });
    }

    // 桃花 (Peach Blossom)
    if (PEACH_BLOSSOM_MAP[yearBranch] === timingBranch) {
      triggers.push({
        type: 'shensha_primary',
        chinese: '桃花',
        description: 'Peach Blossom activated - attraction energy high',
        weight: 12,
        isPositive: true
      });
    }
  }

  if (eventType === 'career') {
    // 天乙贵人 (Nobleman)
    const noblemanBranches = NOBLEMAN_MAP[dayStem] || [];
    if (noblemanBranches.includes(timingBranch)) {
      triggers.push({
        type: 'shensha_primary',
        chinese: '天乙贵人',
        description: 'Nobleman activated - support from influential people',
        weight: 15,
        isPositive: true
      });
    }

    // 文昌 (Academic Star)
    if (ACADEMIC_STAR_MAP[dayStem] === timingBranch) {
      triggers.push({
        type: 'shensha_primary',
        chinese: '文昌',
        description: 'Academic Star activated - intellectual recognition',
        weight: 12,
        isPositive: true
      });
    }

    // 将星 (General Star)
    if (GENERAL_STAR_MAP[yearBranch] === timingBranch) {
      triggers.push({
        type: 'shensha_primary',
        chinese: '将星',
        description: 'General Star activated - leadership energy',
        weight: 15,
        isPositive: true
      });
    }
  }

  if (eventType === 'health') {
    // 天医 (Heavenly Doctor) - Positive
    if (HEAVENLY_DOCTOR_MAP[yearBranch] === timingBranch) {
      triggers.push({
        type: 'shensha_primary',
        chinese: '天医',
        description: 'Heavenly Doctor activated - healing energy strong',
        weight: 15,
        isPositive: true
      });
    }

    // 灾煞 (Disaster Sha) - Negative
    if (DISASTER_SHA_MAP[yearBranch] === timingBranch) {
      triggers.push({
        type: 'shensha_blocker',
        chinese: '灾煞',
        description: 'Disaster Sha activated - vulnerability window',
        weight: -15,
        isPositive: false
      });
    }

    // 亡神 (Death Spirit) - Negative
    if (DEATH_SPIRIT_MAP[yearBranch] === timingBranch) {
      triggers.push({
        type: 'shensha_blocker',
        chinese: '亡神',
        description: 'Death Spirit activated - energy depletion',
        weight: -12,
        isPositive: false
      });
    }
  }

  return triggers;
}

/**
 * Detect conflicts affecting the event
 */
function detectEventConflicts(
  pillar: TimingPillar,
  natalPillars: NatalPillarsInput
): Array<{ type: string; chinese: string; description: string; severity: number }> {
  const conflicts: Array<{ type: string; chinese: string; description: string; severity: number }> = [];
  const timingBranch = pillar.branch;

  const natalBranches = [
    natalPillars.yearBranch,
    natalPillars.monthBranch,
    natalPillars.dayBranch,
    natalPillars.hourBranch
  ];

  for (const natalBranch of natalBranches) {
    // Clashes
    for (const [b1, b2] of SIX_CLASHES) {
      if ((timingBranch === b1 && natalBranch === b2) ||
          (timingBranch === b2 && natalBranch === b1)) {
        conflicts.push({
          type: 'clash',
          chinese: '冲',
          description: `Clash between ${timingBranch} and ${natalBranch}`,
          severity: 12
        });
      }
    }

    // Punishments
    for (const [b1, b2] of PUNISHMENTS) {
      if (timingBranch === b1 && natalBranch === b2) {
        conflicts.push({
          type: 'punishment',
          chinese: '刑',
          description: `Punishment between ${timingBranch} and ${natalBranch}`,
          severity: 10
        });
      }
    }

    // Harms
    for (const [b1, b2] of SIX_HARMS) {
      if ((timingBranch === b1 && natalBranch === b2) ||
          (timingBranch === b2 && natalBranch === b1)) {
        conflicts.push({
          type: 'harm',
          chinese: '害',
          description: `Harm between ${timingBranch} and ${natalBranch}`,
          severity: 8
        });
      }
    }
  }

  // Remove duplicates
  return conflicts.filter((conflict, index, self) =>
    index === self.findIndex(c => c.type === conflict.type && c.description === conflict.description)
  );
}

/**
 * Detect transformations affecting the event
 */
function detectEventTransformations(
  eventType: EventType,
  pillar: TimingPillar,
  natalPillars: NatalPillarsInput,
  usefulGod: ElementName | null
): ActivationTrigger[] {
  const triggers: ActivationTrigger[] = [];
  const timingBranch = pillar.branch;

  const natalBranches = [
    natalPillars.yearBranch,
    natalPillars.monthBranch,
    natalPillars.dayBranch,
    natalPillars.hourBranch
  ];

  // Check 六合 (Liu He) combinations
  const liuheInfo = LIUHE_COMBINATIONS[timingBranch];
  if (liuheInfo && natalBranches.includes(liuheInfo.partner as BranchName)) {
    const resultElement = liuheInfo.result;
    const isUsefulGodResult = usefulGod === resultElement;

    let weight = 8;
    if (isUsefulGodResult) weight = 12;

    // Event-specific interpretation
    let description = `Six Combination (六合) produces ${resultElement}`;

    if (eventType === 'wealth' && (resultElement === 'Metal' || resultElement === 'Earth')) {
      weight += 4; // Wealth-favorable elements
      description += ' - supports material accumulation';
    } else if (eventType === 'relationship') {
      weight += 2; // Combinations are always good for relationships
      description += ' - harmonizing energy';
    }

    triggers.push({
      type: 'transformation',
      chinese: '六合',
      description,
      weight,
      isPositive: true
    });
  }

  // Check 三合 (San He) frames
  for (const [frameName, frameInfo] of Object.entries(SANHE_FRAMES)) {
    const matchingBranches = frameInfo.branches.filter(b =>
      natalBranches.includes(b as BranchName) || b === timingBranch
    );

    if (matchingBranches.length >= 2 && matchingBranches.includes(timingBranch)) {
      const isComplete = matchingBranches.length === 3;
      let weight = isComplete ? 15 : 8;

      const isUsefulGodResult = usefulGod === frameInfo.result;
      if (isUsefulGodResult) weight += 5;

      triggers.push({
        type: 'transformation',
        chinese: isComplete ? '三合成局' : '三合半局',
        description: `${frameName} Three Combination ${isComplete ? 'complete' : 'partial'} - ${frameInfo.result} energy activated`,
        weight,
        isPositive: true
      });
    }
  }

  return triggers;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EVENT TRIGGER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute event trigger for a specific event type
 */
export function computeEventTrigger(
  eventType: EventType,
  natalPillars: NatalPillarsInput,
  dmStrength: DMStrength,
  luckPillar: TimingPillar | null,
  annualPillar: TimingPillar,
  monthlyPillar: TimingPillar,
  dailyPillar: TimingPillar,
  hourlyPillar: TimingPillar,
  usefulGod: ElementName | null = null,
  annoyingGod: ElementName | null = null
): EventTriggerResult {

  const layerActivations: LayerActivation[] = [];
  let rawScore = 0;
  let bonusScore = 0;
  let penaltyScore = 0;

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

    const activation = analyzeLayerForEvent(
      eventType,
      name,
      pillar,
      natalPillars,
      dmStrength,
      usefulGod,
      annoyingGod
    );

    layerActivations.push(activation);

    // Apply layer weight to score
    const weightedScore = activation.score * LAYER_WEIGHTS[name];
    rawScore += weightedScore;

    // Track bonus/penalty
    for (const trigger of activation.triggers) {
      if (trigger.isPositive) {
        bonusScore += Math.abs(trigger.weight);
      } else {
        penaltyScore += Math.abs(trigger.weight);
      }
    }
  }

  // Count active layers
  const activeLayerCount = layerActivations.filter(l => l.activated).length;
  const totalPossibleLayers = layerActivations.length;

  // Calculate resonance strength (bonus for multiple layer alignment)
  let resonanceBonus = 0;
  if (activeLayerCount >= 4) {
    resonanceBonus = 15; // Strong resonance
  } else if (activeLayerCount >= 3) {
    resonanceBonus = 10; // Good resonance
  } else if (activeLayerCount >= 2) {
    resonanceBonus = 5; // Mild resonance
  }

  const finalScore = Math.max(0, Math.min(100, rawScore + resonanceBonus));

  // Determine tier
  const tier = getEventTier(finalScore);

  // Collect key triggers and blockers
  const allTriggers = layerActivations.flatMap(l => l.triggers);
  const keyTriggers = allTriggers.filter(t => t.isPositive).sort((a, b) => b.weight - a.weight).slice(0, 5);
  const blockers = allTriggers.filter(t => !t.isPositive).sort((a, b) => a.weight - b.weight).slice(0, 3);

  // Generate narrative
  const narrative = buildEventNarrative(eventType, tier, activeLayerCount, keyTriggers, blockers);

  // Generate recommendation
  const recommendation = buildEventRecommendation(eventType, tier, keyTriggers);

  // Calculate resonance strength percentage
  const resonanceStrength = totalPossibleLayers > 0
    ? Math.round((activeLayerCount / totalPossibleLayers) * 100)
    : 0;

  return {
    eventType,
    eventTypeChinese: EVENT_TYPE_CONFIG[eventType].chinese,
    score: Math.round(finalScore),
    tier,
    tierChinese: getTierChinese(tier),
    layerActivations,
    activeLayerCount,
    totalPossibleLayers,
    resonanceStrength,
    keyTriggers,
    blockers,
    narrative,
    recommendation,
    debugInfo: {
      rawScore: Math.round(rawScore),
      bonusScore: Math.round(bonusScore),
      penaltyScore: Math.round(penaltyScore),
      layerWeights: LAYER_WEIGHTS,
      activationFormula: `(Σ layer_score × layer_weight) + resonance_bonus = ${Math.round(rawScore)} + ${resonanceBonus} = ${Math.round(finalScore)}`
    }
  };
}

/**
 * Compute all event types at once
 */
export function computeComprehensiveEventTrigger(
  natalPillars: NatalPillarsInput,
  dmStrength: DMStrength,
  luckPillar: TimingPillar | null,
  annualPillar: TimingPillar,
  monthlyPillar: TimingPillar,
  dailyPillar: TimingPillar,
  hourlyPillar: TimingPillar,
  usefulGod: ElementName | null = null,
  annoyingGod: ElementName | null = null
): ComprehensiveEventTrigger {

  const wealth = computeEventTrigger('wealth', natalPillars, dmStrength, luckPillar, annualPillar, monthlyPillar, dailyPillar, hourlyPillar, usefulGod, annoyingGod);
  const relationship = computeEventTrigger('relationship', natalPillars, dmStrength, luckPillar, annualPillar, monthlyPillar, dailyPillar, hourlyPillar, usefulGod, annoyingGod);
  const career = computeEventTrigger('career', natalPillars, dmStrength, luckPillar, annualPillar, monthlyPillar, dailyPillar, hourlyPillar, usefulGod, annoyingGod);
  const health = computeEventTrigger('health', natalPillars, dmStrength, luckPillar, annualPillar, monthlyPillar, dailyPillar, hourlyPillar, usefulGod, annoyingGod);

  // Find dominant event
  const events = [wealth, relationship, career, health];
  const strongEvents = events.filter(e => e.tier === 'strong' || e.tier === 'likely');

  let dominantEvent: EventType | null = null;
  if (strongEvents.length > 0) {
    const highest = strongEvents.reduce((a, b) => a.score > b.score ? a : b);
    dominantEvent = highest.eventType;
  }

  // Build summary
  const summaryParts: string[] = [];

  if (dominantEvent) {
    summaryParts.push(`Primary activation: ${EVENT_TYPE_CONFIG[dominantEvent].chinese}`);
  } else {
    summaryParts.push('No strong event activation detected.');
  }

  const activeEventNames = strongEvents.map(e => EVENT_TYPE_CONFIG[e.eventType].chinese);
  if (activeEventNames.length > 1) {
    summaryParts.push(`Multiple themes active: ${activeEventNames.join(', ')}`);
  }

  // Health warning if challenging
  if (health.tier === 'mild' || health.tier === 'none') {
    // Health score is inverted - lower is actually better for health vulnerability
    // So mild/none means MORE vulnerable
  }

  return {
    wealth,
    relationship,
    career,
    health,
    dominantEvent,
    summary: summaryParts.join(' '),
    timestamp: new Date().toISOString()
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function getEventTier(score: number): EventTier {
  if (score >= 75) return 'strong';
  if (score >= 60) return 'likely';
  if (score >= 40) return 'mild';
  return 'none';
}

function getTierChinese(tier: EventTier): string {
  switch (tier) {
    case 'strong': return '高度激活';
    case 'likely': return '可能激活';
    case 'mild': return '轻度激活';
    case 'none': return '未激活';
  }
}

function buildEventNarrative(
  eventType: EventType,
  tier: EventTier,
  activeLayerCount: number,
  keyTriggers: ActivationTrigger[],
  blockers: ActivationTrigger[]
): string {
  const parts: string[] = [];
  const config = EVENT_TYPE_CONFIG[eventType];

  // Opening statement
  switch (tier) {
    case 'strong':
      parts.push(`Strong ${config.description.toLowerCase()} detected.`);
      parts.push(`${activeLayerCount} timing layers are aligned.`);
      break;
    case 'likely':
      parts.push(`Likely ${config.description.toLowerCase()}.`);
      parts.push(`Multiple layers show activation.`);
      break;
    case 'mild':
      parts.push(`Mild ${config.description.toLowerCase()}.`);
      parts.push(`Some supportive energy present.`);
      break;
    case 'none':
      parts.push(`No significant ${config.description.toLowerCase()}.`);
      parts.push(`Timing layers are not aligned for this event.`);
      break;
  }

  // Key triggers
  if (keyTriggers.length > 0) {
    const triggerNames = keyTriggers.slice(0, 3).map(t => t.chinese).join(', ');
    parts.push(`Key activators: ${triggerNames}.`);
  }

  // Blockers
  if (blockers.length > 0 && tier !== 'none') {
    const blockerNames = blockers.slice(0, 2).map(t => t.chinese).join(', ');
    parts.push(`Watch for: ${blockerNames}.`);
  }

  return parts.join(' ');
}

function buildEventRecommendation(
  eventType: EventType,
  tier: EventTier,
  keyTriggers: ActivationTrigger[]
): string {
  if (tier === 'none') {
    switch (eventType) {
      case 'wealth': return 'Focus on consolidation rather than expansion. Preserve existing resources.';
      case 'relationship': return 'Nurture existing connections. Not ideal for major relationship moves.';
      case 'career': return 'Maintain steady effort. Avoid major career changes or confrontations.';
      case 'health': return 'Good baseline health energy. Maintain regular wellness practices.';
    }
  }

  if (tier === 'mild') {
    switch (eventType) {
      case 'wealth': return 'Small opportunities may arise. Stay alert but don\'t overcommit.';
      case 'relationship': return 'Light social energy. Good for casual connections.';
      case 'career': return 'Steady progress possible. Focus on skill-building.';
      case 'health': return 'Minor vulnerability. Balance activity with adequate rest.';
    }
  }

  if (tier === 'likely') {
    switch (eventType) {
      case 'wealth': return 'Good window for financial initiatives. Consider investments or negotiations.';
      case 'relationship': return 'Favorable for dating or deepening bonds. Be open to connections.';
      case 'career': return 'Opportunity window. Pursue recognition, present ideas, network.';
      case 'health': return 'Pay attention to body signals. Preventive care recommended.';
    }
  }

  // Strong tier
  switch (eventType) {
    case 'wealth': return 'Excellent wealth window. Act on opportunities, close deals, launch ventures.';
    case 'relationship': return 'Prime relationship timing. Major moves (proposals, commitments) favored.';
    case 'career': return 'Peak career energy. Ideal for promotions, job changes, leadership moves.';
    case 'health': return 'Heightened vulnerability period. Prioritize rest, avoid overexertion, seek preventive care.';
  }

  return '';
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY MODE FORMATTER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate story mode output for an event trigger
 */
export function formatEventTriggerStory(result: EventTriggerResult): string {
  const lines: string[] = [];

  lines.push(`### Event Trigger: ${result.eventTypeChinese} (${result.eventType})`);
  lines.push('');
  lines.push(`**Score:** ${result.score} — ${result.tierChinese} (${result.tier})`);
  lines.push(`**Layer Alignment:** ${result.activeLayerCount}/${result.totalPossibleLayers} layers (${result.resonanceStrength}% resonance)`);
  lines.push('');

  // Layer breakdown
  lines.push('**Layer Breakdown:**');
  for (const layer of result.layerActivations) {
    const status = layer.activated ? '✓' : '○';
    lines.push(`- ${status} ${layer.layerChinese}: Score ${layer.score}`);

    if (layer.triggers.length > 0) {
      for (const trigger of layer.triggers.slice(0, 2)) {
        const sign = trigger.isPositive ? '+' : '-';
        lines.push(`  - ${sign} ${trigger.chinese}: ${trigger.description}`);
      }
    }
  }
  lines.push('');

  // Key activators
  if (result.keyTriggers.length > 0) {
    lines.push('**Key Activators:**');
    for (const trigger of result.keyTriggers) {
      lines.push(`- ${trigger.chinese} (+${trigger.weight}): ${trigger.description}`);
    }
    lines.push('');
  }

  // Blockers
  if (result.blockers.length > 0) {
    lines.push('**Blockers:**');
    for (const blocker of result.blockers) {
      lines.push(`- ${blocker.chinese} (${blocker.weight}): ${blocker.description}`);
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
 * Generate comprehensive story mode output
 */
export function formatComprehensiveEventTriggerStory(result: ComprehensiveEventTrigger): string {
  const lines: string[] = [];

  lines.push('# 应期 Event Trigger Analysis');
  lines.push('');
  lines.push(`**Generated:** ${result.timestamp}`);
  lines.push('');
  lines.push(`**Summary:** ${result.summary}`);

  if (result.dominantEvent) {
    lines.push(`**Dominant Theme:** ${EVENT_TYPE_CONFIG[result.dominantEvent].chinese}`);
  }
  lines.push('');

  // Quick overview
  lines.push('## Quick Overview');
  lines.push('| Event | Score | Tier | Layers |');
  lines.push('|-------|-------|------|--------|');
  lines.push(`| 财应期 | ${result.wealth.score} | ${result.wealth.tierChinese} | ${result.wealth.activeLayerCount}/${result.wealth.totalPossibleLayers} |`);
  lines.push(`| 感情应期 | ${result.relationship.score} | ${result.relationship.tierChinese} | ${result.relationship.activeLayerCount}/${result.relationship.totalPossibleLayers} |`);
  lines.push(`| 事业应期 | ${result.career.score} | ${result.career.tierChinese} | ${result.career.activeLayerCount}/${result.career.totalPossibleLayers} |`);
  lines.push(`| 健康应期 | ${result.health.score} | ${result.health.tierChinese} | ${result.health.activeLayerCount}/${result.health.totalPossibleLayers} |`);
  lines.push('');

  // Detailed sections
  lines.push('---');
  lines.push(formatEventTriggerStory(result.wealth));
  lines.push('');
  lines.push('---');
  lines.push(formatEventTriggerStory(result.relationship));
  lines.push('');
  lines.push('---');
  lines.push(formatEventTriggerStory(result.career));
  lines.push('');
  lines.push('---');
  lines.push(formatEventTriggerStory(result.health));

  return lines.join('\n');
}
