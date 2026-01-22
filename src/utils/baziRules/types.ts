/**
 * ============================================
 * BAZI CLASSICAL RULES ENGINE - TYPE DEFINITIONS
 * Core types for the rule-based edge case evaluation system
 * ============================================
 */

// ==================== CORE ENUMS ====================

export type Element = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type Polarity = 'Yang' | 'Yin';
export type Season = 'spring' | 'summer' | 'late_summer' | 'autumn' | 'winter';
export type PillarPosition = 'year' | 'month' | 'day' | 'hour';

export type TenGod =
  | '比肩' | '劫财'      // Peers
  | '食神' | '伤官'      // Output
  | '偏财' | '正财'      // Wealth
  | '七杀' | '正官'      // Authority
  | '偏印' | '正印';     // Resource

export type StructureType =
  | 'normal'
  | 'true_follow'
  | 'fake_follow'
  | 'pseudo_follow'
  | 'half_follow'
  | 'jian_lu'       // Established Rank (建禄格)
  | 'yang_ren'      // Blade (羊刃格)
  | 'zhuan_wang';   // Dominant Element (专旺格)

export type CombinationType =
  | 'three_harmony'   // 三合
  | 'six_harmony'     // 六合
  | 'stem_combination' // 天干合
  | 'directional';    // 方合

export type NegativeInteraction =
  | 'clash'      // 冲
  | 'harm'       // 害
  | 'punishment' // 刑
  | 'destruction'; // 破

// ==================== CHART CONTEXT ====================

export interface Pillar {
  stem: string;           // Chinese character: 甲乙丙丁戊己庚辛壬癸
  branch: string;         // Chinese character: 子丑寅卯辰巳午未申酉戌亥
  stemElement: Element;
  branchElement: Element;
  hiddenStems: HiddenStem[];
}

export interface HiddenStem {
  stem: string;
  element: Element;
  percentage: number;     // 0-100
  type: 'main_qi' | 'zhong_qi' | 'yu_qi';  // 本气, 中气, 余气
}

export interface ElementBalance {
  Wood: number;
  Fire: number;
  Earth: number;
  Metal: number;
  Water: number;
}

export interface TenGodAnalysis {
  [key: string]: {
    count: number;
    positions: PillarPosition[];
    strength: number;
  };
}

export interface ChartContext {
  // Four Pillars
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar;
  };

  // Day Master
  dayMaster: {
    stem: string;
    element: Element;
    polarity: Polarity;
    strength: 'extremely_weak' | 'very_weak' | 'weak' | 'balanced' | 'strong' | 'very_strong';
  };

  // Season and timing
  season: Season;
  monthBranch: string;

  // Elemental analysis
  elementBalance: ElementBalance;
  dominantElement: Element;

  // Ten Gods
  tenGods: TenGodAnalysis;

  // Special conditions
  hasRoot: boolean;
  rootCount: number;
  emptyBranches: string[];

  // Current structure assessment
  currentStructure?: StructureType;

  // Useful God analysis
  usefulGod?: {
    element: Element;
    position: PillarPosition | 'hidden';
    strength: number;
  };
  annoyingGod?: {
    element: Element;
    position: PillarPosition | 'hidden';
  };

  // Detected interactions
  combinations: DetectedCombination[];
  clashes: DetectedClash[];
  harms: DetectedHarm[];
  punishments: DetectedPunishment[];

  // Shen Sha (optional - for enhanced analysis)
  shenSha?: ShenShaPresence[];

  // Luck Pillar (optional - for timing analysis)
  currentLuckPillar?: Pillar;
  previousLuckPillar?: Pillar;
}

// ==================== DETECTED INTERACTIONS ====================

export interface DetectedCombination {
  type: CombinationType;
  participants: string[];      // Branch characters involved
  resultElement?: Element;
  positions: PillarPosition[];
  transformed: boolean;
}

export interface DetectedClash {
  pair: [string, string];
  positions: [PillarPosition, PillarPosition];
  strength: 'full' | 'partial';
}

export interface DetectedHarm {
  pair: [string, string];
  positions: [PillarPosition, PillarPosition];
}

export interface DetectedPunishment {
  type: 'three_unkindness' | 'bullying' | 'self' | 'ungrateful';
  participants: string[];
  positions: PillarPosition[];
  complete: boolean;
}

export interface ShenShaPresence {
  name: string;
  chineseName: string;
  position: PillarPosition;
  active: boolean;
}

// ==================== RULE DEFINITIONS ====================

export interface RuleCondition {
  [key: string]: any;  // Flexible condition matching
}

export interface BaseRule {
  id: string;
  name: string;
  priority: number;
  conditions: RuleCondition;
}

export interface StructureRule extends BaseRule {
  result: {
    structureType: StructureType;
    usefulGodOverride?: Element | null;
    usefulGod?: Element | Element[];
    avoidElements?: (Element | TenGod)[];
    treatAs?: string;
    unstable?: boolean;
    followDominantElement?: boolean;
    warning?: string;
  };
}

export interface CombinationRule extends BaseRule {
  result: {
    transformationSuccess: boolean | 'partial';
    combinationBroken?: boolean;
    newElement?: Element;
    effectiveElement?: Element;
    affinityOnly?: boolean;
    partialEffect?: string;
    hiddenStemRetained?: boolean;
    originalStemsLoseIdentity?: boolean;
    punishmentActive?: boolean;
    elementStrengthBoost?: number;
    allBranchesBecome?: Element;
    residualTension?: string;
    reason?: string;
  };
}

export interface UsefulGodRule extends BaseRule {
  result: {
    usefulGodEffective: boolean | 'weakened' | 'compromised' | 'severely_weakened' | 'latent';
    needsSecondaryUsefulGod?: boolean;
    activeUsefulGod?: string;
    effectiveness?: string | number;
    effectivenessPercent?: number;
    needsResourceSupport?: boolean;
    activationCondition?: string;
    baseEffectiveness?: number;
    hiddenDamage?: boolean;
    annoyingGodActive?: boolean;
    chartImproved?: boolean;
    chartStrength?: string;
    primaryUsefulGod?: string;
    secondarySupports?: boolean;
    timing?: string;
    recommendation?: string;
    warning?: string;
    note?: string;
  };
}

export interface ClashHarmPunishmentRule extends BaseRule {
  result: {
    clashBeneficial?: boolean;
    annoyingGodWeakened?: boolean;
    structureBroken?: boolean;
    revertTo?: string;
    recalculateUsefulGod?: boolean;
    healthWarning?: boolean;
    affectedAreas?: string[];
    mitigationAdvice?: string;
    punishmentSeverity?: string;
    characterWarning?: string;
    characterNote?: string;
    timing?: string;
    advice?: string;
    clashResolved?: string;
    originalClashPower?: number;
    visibleEffect?: string;
    hiddenEffect?: string;
    effectSeverity?: string;
    considerOtherFactors?: boolean;
    elementalEffect?: string;
    warning?: string;
    note?: string;
  };
}

export interface SeasonalRule extends BaseRule {
  result: {
    strengthModifier: number;
    needsWoodSupport?: boolean;
    needsMetalSupport?: boolean;
    needsWaterSupport?: boolean;
    needsEarthSupport?: boolean;
    needsWaterCooling?: boolean;
    atPeakPower?: boolean;
    wellSupported?: boolean;
    earthStrengthBoost?: number;
    affectsAllElements?: string;
    polarityBonus?: number;
    interpretation?: string;
    canBeRevived?: string;
    note?: string;
  };
}

export interface HiddenStemRule extends BaseRule {
  result: {
    hiddenStemPower?: string;
    hiddenStemStatus?: string;
    strengthModifier?: number;
    dominantInfluence?: boolean;
    useForCalculations?: string;
    newElement?: string;
    originalLost?: boolean;
    influence?: string;
    activationCondition?: string;
    contributesToBalance?: boolean;
    usefulGodStatus?: string;
    effectiveness?: number;
    activation?: string;
    cumulativeStrength?: boolean;
    totalPercentage?: string;
    currentEffect?: string;
    note?: string;
  };
}

export interface LuckPillarRule extends BaseRule {
  result: {
    structureStatus?: string;
    periodQuality?: string;
    recalculateUsefulGod?: boolean;
    combinationActivated?: boolean;
    elementBoost?: Element;
    periodEffect?: string;
    punishmentActivated?: boolean;
    usefulGodActivated?: boolean;
    usefulGodWeakened?: boolean;
    directionChange?: boolean;
    transitionDifficulty?: string;
    effect?: string;
    interpretation?: string;
    canBePositiveOrNegative?: boolean;
    typically?: string;
    emptyFilled?: boolean;
    timing?: string;
    warning?: string;
    advice?: string;
    note?: string;
  };
}

export interface ShenShaRule extends BaseRule {
  result: {
    active: boolean | 'partial';
    benefit?: string;
    effect?: string;
    strength?: number | string;
    warning?: string;
    note?: string;
  };
}

// ==================== EVALUATION RESULTS ====================

export interface RuleMatch<T extends BaseRule> {
  rule: T;
  matched: boolean;
  matchedConditions: string[];
  result: T['result'];
}

export interface StructureEvaluation {
  determinedStructure: StructureType;
  matchedRules: RuleMatch<StructureRule>[];
  warnings: string[];
  usefulGodOverride?: Element | null;
}

export interface CombinationEvaluation {
  combinations: Array<{
    combination: DetectedCombination;
    ruleApplied?: RuleMatch<CombinationRule>;
    finalStatus: 'transformed' | 'partial' | 'broken' | 'affinity_only';
  }>;
}

export interface UsefulGodEvaluation {
  primaryUsefulGod: Element | null;
  status: 'active' | 'weakened' | 'blocked' | 'latent';
  effectivenessPercent: number;
  secondaryUsefulGod?: Element;
  matchedRules: RuleMatch<UsefulGodRule>[];
  warnings: string[];
}

export interface ClashHarmPunishmentEvaluation {
  clashes: Array<{
    clash: DetectedClash;
    ruleApplied?: RuleMatch<ClashHarmPunishmentRule>;
    effect: 'harmful' | 'beneficial' | 'neutral';
  }>;
  harms: Array<{
    harm: DetectedHarm;
    ruleApplied?: RuleMatch<ClashHarmPunishmentRule>;
  }>;
  punishments: Array<{
    punishment: DetectedPunishment;
    ruleApplied?: RuleMatch<ClashHarmPunishmentRule>;
    severity: string;
  }>;
  structuralImpact: boolean;
  healthWarnings: string[];
}

export interface SeasonalEvaluation {
  elementModifiers: ElementBalance;
  matchedRules: RuleMatch<SeasonalRule>[];
  supportNeeded: Element[];
}

export interface HiddenStemEvaluation {
  stems: Array<{
    pillar: PillarPosition;
    stem: HiddenStem;
    ruleApplied?: RuleMatch<HiddenStemRule>;
    effectiveStrength: number;
    status: 'active' | 'dormant' | 'transformed' | 'disrupted';
  }>;
}

export interface LuckPillarEvaluation {
  periodQuality: 'favorable' | 'neutral' | 'challenging' | 'turbulent';
  matchedRules: RuleMatch<LuckPillarRule>[];
  structureImpact?: string;
  usefulGodImpact?: string;
  activatedPatterns: string[];
  warnings: string[];
}

// ==================== MASTER RESULT ====================

export interface ClassicalEdgeCaseResult {
  structures: StructureEvaluation;
  combinations: CombinationEvaluation;
  usefulGod: UsefulGodEvaluation;
  clashHarmPunishment: ClashHarmPunishmentEvaluation;
  seasonal: SeasonalEvaluation;
  hiddenStems: HiddenStemEvaluation;
  luckPillar?: LuckPillarEvaluation;
}
