/**
 * ============================================================================
 * BAZI WEALTH TIMING ENGINE (财运时机)
 * ============================================================================
 *
 * The most practical, action-oriented timing module in the BaZi system.
 * This engine tells you:
 * - When wealth opportunities open
 * - What type of wealth is activated (direct/indirect/windfall/earned)
 * - Which cycles support accumulation vs spending vs investment
 * - When to push, when to conserve, when to pivot
 * - Best hours for deals, negotiations, launches, transactions
 *
 * Wealth in BaZi is determined by:
 * - Direct Wealth (正财) - Stable income, salary, earned wealth
 * - Indirect Wealth (偏财) - Windfall, speculation, unexpected gains
 * - Output (食神/伤官) - Produces wealth through creativity/skill
 * - Officer (正官/七杀) - Governs wealth flow, career advancement
 * - Resource (印/枭) - Stabilizes wealth, education, certifications
 * - Friend/Rob Wealth (比肩/劫财) - Competes for wealth
 *
 * Five Timing Layers:
 * - 财运大运 (Wealth Luck Pillars) - 10-year wealth cycles
 * - 财运流年 (Wealth Annual) - Year-by-year wealth activation
 * - 财运流月 (Wealth Monthly) - Month-by-month cashflow rhythm
 * - 财运流日 (Wealth Daily) - Micro-timing for deals, transactions
 * - 财运流时 (Wealth Hourly) - Ultra-fine timing for negotiations
 *
 * Based on: Classical BaZi wealth doctrine, Joey Yap methodology
 * Created: January 2026
 * ============================================================================
 */

import {
  NatalPillarsInput,
  STEM_TO_ELEMENT,
  BRANCH_TO_ELEMENT
} from './baziLuckFavorability';

// ============================================================================
// TYPES
// ============================================================================

export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

export type StemName = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';

export type BranchName = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

export type WealthTimingLayer = 'luck_pillar' | 'yearly' | 'monthly' | 'daily' | 'hourly';

export type WealthTier = 'excellent' | 'good' | 'neutral' | 'challenging' | 'difficult';

export type WealthType = 'direct' | 'indirect' | 'output' | 'mixed' | 'none';

/**
 * Ten Gods mapping for wealth analysis
 */
export type TenGodName =
  | 'Direct Wealth'      // 正财
  | 'Indirect Wealth'    // 偏财
  | 'Eating God'         // 食神
  | 'Hurting Officer'    // 伤官
  | 'Direct Officer'     // 正官
  | 'Seven Killings'     // 七杀
  | 'Direct Resource'    // 正印
  | 'Indirect Resource'  // 偏印/枭神
  | 'Friend'             // 比肩
  | 'Rob Wealth';        // 劫财

/**
 * Timing pillar structure
 */
export interface TimingPillar {
  stem: StemName;
  branch: BranchName;
}

/**
 * Wealth star activation hit
 */
export interface WealthStarHit {
  type: TenGodName;
  element: ElementName;
  source: 'stem' | 'branch' | 'hidden_stem';
  polarity: 'Yang' | 'Yin';
  weight: number;
  description: string;
}

/**
 * Wealth Shen Sha hit
 */
export interface WealthShenshaHit {
  name: string;
  chineseName: string;
  nature: 'auspicious' | 'inauspicious' | 'neutral';
  effect: string;
  weight: number;
}

/**
 * Wealth conflict hit
 */
export interface WealthConflictHit {
  type: 'clash' | 'harm' | 'punishment' | 'destruction';
  affectsWealth: boolean;
  description: string;
  severity: number;
}

/**
 * Wealth transformation hit
 */
export interface WealthTransformationHit {
  type: 'liuhe' | 'sanhe' | 'sanhui' | 'stem_combination';
  resultElement: ElementName;
  benefitsWealth: boolean;
  description: string;
  weight: number;
}

/**
 * DM (Day Master) strength context
 */
export interface DMStrengthContext {
  strength: number;  // 0-2 scale (0=very weak, 1=balanced, 2=very strong)
  category: 'very_weak' | 'weak' | 'balanced' | 'strong' | 'very_strong';
  needsSupport: boolean;
  canHandleWealth: boolean;
}

/**
 * Wealth timing result
 */
export interface WealthTimingResult {
  // Time identification
  timeUnit: WealthTimingLayer;
  date?: string;
  pillar: TimingPillar;
  pillarDisplay: string;

  // Scores
  score: number;
  tier: WealthTier;
  wealthType: WealthType;

  // Activations
  wealthStars: WealthStarHit[];
  outputStars: WealthStarHit[];
  officerStars: WealthStarHit[];
  competitionStars: WealthStarHit[];  // Rob Wealth, Friend

  // Analysis
  usefulActivated: ElementName[];
  annoyingActivated: ElementName[];
  transformations: WealthTransformationHit[];
  conflicts: WealthConflictHit[];
  shensha: WealthShenshaHit[];

  // DM context
  dmStrength: DMStrengthContext;

  // Seasonal
  seasonElement: ElementName;
  wealthInSeason: boolean;

  // Narrative
  reasoning: string[];
  summary: string;
  advice: string;

  // Activity recommendations
  suitableActivities: string[];
  avoidActivities: string[];
}

/**
 * Extended result types for each timing layer
 */
export interface WealthLuckPillarTiming extends WealthTimingResult {
  startAge: number;
  endAge: number;
  decadeTheme: string;
}

export interface WealthYearlyTiming extends WealthTimingResult {
  year: number;
  yearlyTheme: string;
}

export interface WealthMonthlyTiming extends WealthTimingResult {
  year: number;
  month: number;
  monthName: string;
  cashflowForecast: string;
}

export interface WealthDailyTiming extends WealthTimingResult {
  year: number;
  month: number;
  day: number;
  dayOfWeek: string;
  bestActionWindow: string;
}

export interface WealthHourlyTiming extends WealthTimingResult {
  year: number;
  month: number;
  day: number;
  hour: number;
  chineseHour: string;
  westernTimeRange: string;
  actionType: string;
}

// ============================================================================
// TEN GODS CALCULATION
// ============================================================================

/**
 * Element production cycle
 */
const ELEMENT_PRODUCES: Record<ElementName, ElementName> = {
  'Wood': 'Fire',
  'Fire': 'Earth',
  'Earth': 'Metal',
  'Metal': 'Water',
  'Water': 'Wood'
};

/**
 * Element control cycle
 */
const ELEMENT_CONTROLS: Record<ElementName, ElementName> = {
  'Wood': 'Earth',
  'Fire': 'Metal',
  'Earth': 'Water',
  'Metal': 'Wood',
  'Water': 'Fire'
};

/**
 * Element is controlled by
 */
const ELEMENT_CONTROLLED_BY: Record<ElementName, ElementName> = {
  'Wood': 'Metal',
  'Fire': 'Water',
  'Earth': 'Wood',
  'Metal': 'Fire',
  'Water': 'Earth'
};

/**
 * Element is produced by
 */
const ELEMENT_PRODUCED_BY: Record<ElementName, ElementName> = {
  'Wood': 'Water',
  'Fire': 'Wood',
  'Earth': 'Fire',
  'Metal': 'Earth',
  'Water': 'Metal'
};

/**
 * Stem polarity
 */
const STEM_POLARITY: Record<string, 'Yang' | 'Yin'> = {
  '甲': 'Yang', '乙': 'Yin',
  '丙': 'Yang', '丁': 'Yin',
  '戊': 'Yang', '己': 'Yin',
  '庚': 'Yang', '辛': 'Yin',
  '壬': 'Yang', '癸': 'Yin'
};

/**
 * Branch hidden stems (main hidden stem only for simplicity)
 */
const BRANCH_HIDDEN_STEMS: Record<string, string> = {
  '子': '癸', '丑': '己', '寅': '甲', '卯': '乙',
  '辰': '戊', '巳': '丙', '午': '丁', '未': '己',
  '申': '庚', '酉': '辛', '戌': '戊', '亥': '壬'
};

/**
 * Calculate Ten God relationship between two elements
 */
export function getTenGod(
  dmElement: ElementName,
  dmPolarity: 'Yang' | 'Yin',
  targetElement: ElementName,
  targetPolarity: 'Yang' | 'Yin'
): TenGodName {
  const samePolarity = dmPolarity === targetPolarity;

  // Same element
  if (dmElement === targetElement) {
    return samePolarity ? 'Friend' : 'Rob Wealth';
  }

  // Element I produce
  if (ELEMENT_PRODUCES[dmElement] === targetElement) {
    return samePolarity ? 'Eating God' : 'Hurting Officer';
  }

  // Element I control (Wealth)
  if (ELEMENT_CONTROLS[dmElement] === targetElement) {
    return samePolarity ? 'Indirect Wealth' : 'Direct Wealth';
  }

  // Element that controls me (Officer)
  if (ELEMENT_CONTROLLED_BY[dmElement] === targetElement) {
    return samePolarity ? 'Seven Killings' : 'Direct Officer';
  }

  // Element that produces me (Resource)
  if (ELEMENT_PRODUCED_BY[dmElement] === targetElement) {
    return samePolarity ? 'Indirect Resource' : 'Direct Resource';
  }

  return 'Friend'; // Fallback
}

/**
 * Analyze Ten Gods in a timing pillar relative to Day Master
 */
export function analyzeTenGods(
  timePillar: TimingPillar,
  dmStem: string
): { tenGods: Map<TenGodName, number>; details: WealthStarHit[] } {
  const dmElement = STEM_TO_ELEMENT[dmStem] as ElementName;
  const dmPolarity = STEM_POLARITY[dmStem];

  const tenGods = new Map<TenGodName, number>();
  const details: WealthStarHit[] = [];

  // Analyze stem
  const stemElement = STEM_TO_ELEMENT[timePillar.stem] as ElementName;
  const stemPolarity = STEM_POLARITY[timePillar.stem];
  const stemTenGod = getTenGod(dmElement, dmPolarity, stemElement, stemPolarity);

  tenGods.set(stemTenGod, (tenGods.get(stemTenGod) || 0) + 1);
  details.push({
    type: stemTenGod,
    element: stemElement,
    source: 'stem',
    polarity: stemPolarity,
    weight: 1.0,
    description: `${timePillar.stem} (${stemElement}) → ${stemTenGod}`
  });

  // Analyze branch main element
  const branchElement = BRANCH_TO_ELEMENT[timePillar.branch] as ElementName;
  // For branch, we use the hidden stem's polarity
  const hiddenStem = BRANCH_HIDDEN_STEMS[timePillar.branch];
  const branchPolarity = STEM_POLARITY[hiddenStem];
  const branchTenGod = getTenGod(dmElement, dmPolarity, branchElement, branchPolarity);

  tenGods.set(branchTenGod, (tenGods.get(branchTenGod) || 0) + 1);
  details.push({
    type: branchTenGod,
    element: branchElement,
    source: 'branch',
    polarity: branchPolarity,
    weight: 0.7,
    description: `${timePillar.branch} (${branchElement}) → ${branchTenGod}`
  });

  return { tenGods, details };
}

// ============================================================================
// WEALTH SHEN SHA (财运神煞)
// ============================================================================

/**
 * 禄神 (Prosperity Star / Lu Shen) - Based on day stem
 * The branch where the day stem is "at home"
 */
export const LU_SHEN_MAP: Record<string, string> = {
  '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午',
  '戊': '巳', '己': '午', '庚': '申', '辛': '酉',
  '壬': '亥', '癸': '子'
};

/**
 * 天厨 (Heavenly Kitchen) - Indicates food fortune and wealth from hospitality
 * Based on year branch
 */
export const HEAVENLY_KITCHEN_MAP: Record<string, string> = {
  '子': '巳', '丑': '午', '寅': '未', '卯': '申',
  '辰': '酉', '巳': '戌', '午': '亥', '未': '子',
  '申': '丑', '酉': '寅', '戌': '卯', '亥': '辰'
};

/**
 * 金舆 (Golden Carriage) - Wealth through status/position
 * Based on day stem
 */
export const GOLDEN_CARRIAGE_MAP: Record<string, string> = {
  '甲': '辰', '乙': '巳', '丙': '未', '丁': '申',
  '戊': '未', '己': '申', '庚': '戌', '辛': '亥',
  '壬': '丑', '癸': '寅'
};

/**
 * 天乙贵人 (Heavenly Nobleman) - Noble helper for wealth opportunities
 * Based on day stem
 */
export const NOBLEMAN_MAP: Record<string, string[]> = {
  '甲': ['丑', '未'], '乙': ['子', '申'], '丙': ['亥', '酉'],
  '丁': ['亥', '酉'], '戊': ['丑', '未'], '己': ['子', '申'],
  '庚': ['丑', '未'], '辛': ['寅', '午'], '壬': ['卯', '巳'],
  '癸': ['卯', '巳']
};

/**
 * 驿马 (Traveling Horse) - Wealth through movement/trade
 * Based on year or day branch
 */
export const TRAVELING_HORSE_MAP: Record<string, string> = {
  '寅': '申', '午': '申', '戌': '申',
  '申': '寅', '子': '寅', '辰': '寅',
  '巳': '亥', '酉': '亥', '丑': '亥',
  '亥': '巳', '卯': '巳', '未': '巳'
};

/**
 * Wealth Shen Sha definitions
 */
export const WEALTH_SHENSHA_DEFINITIONS: Record<string, {
  chineseName: string;
  nature: 'auspicious' | 'inauspicious' | 'neutral';
  meaning: string;
  wealthEffect: string;
  weight: number;
}> = {
  'Prosperity Star': {
    chineseName: '禄神',
    nature: 'auspicious',
    meaning: 'Natural prosperity and abundance',
    wealthEffect: 'Activates steady income flow, career advancement, natural wealth accumulation',
    weight: 12
  },
  'Heavenly Kitchen': {
    chineseName: '天厨',
    nature: 'auspicious',
    meaning: 'Abundance of food and hospitality fortune',
    wealthEffect: 'Benefits from F&B, hospitality, entertainment industries; never lacks sustenance',
    weight: 10
  },
  'Golden Carriage': {
    chineseName: '金舆',
    nature: 'auspicious',
    meaning: 'Wealth through position and status',
    wealthEffect: 'Financial benefits from elevated status, luxury goods, transportation',
    weight: 8
  },
  'Nobleman': {
    chineseName: '天乙贵人',
    nature: 'auspicious',
    meaning: 'Noble helper arrives',
    wealthEffect: 'Beneficial connections for wealth opportunities, rescue from financial difficulties',
    weight: 10
  },
  'Traveling Horse': {
    chineseName: '驿马',
    nature: 'neutral',
    meaning: 'Movement and change in fortune',
    wealthEffect: 'Wealth through travel, trade, imports/exports, movement of goods/services',
    weight: 6
  },
  'Rob Wealth Star': {
    chineseName: '劫财',
    nature: 'inauspicious',
    meaning: 'Competition for resources',
    wealthEffect: 'Increased competition, potential for financial loss through others, partnerships strain',
    weight: -10
  }
};

// ============================================================================
// BRANCH RELATIONSHIPS FOR WEALTH
// ============================================================================

/**
 * Six Clashes - Can disrupt wealth if wealth star is clashed
 */
export const CLASH_PAIRS: Array<[BranchName, BranchName]> = [
  ['子', '午'], ['丑', '未'], ['寅', '申'],
  ['卯', '酉'], ['辰', '戌'], ['巳', '亥']
];

/**
 * Get clash partner
 */
export function getClashPartner(branch: string): string | null {
  for (const [b1, b2] of CLASH_PAIRS) {
    if (branch === b1) return b2;
    if (branch === b2) return b1;
  }
  return null;
}

// ============================================================================
// SCORING WEIGHTS
// ============================================================================

export const WEALTH_SCORING_WEIGHTS = {
  // Wealth star weights
  wealthStars: {
    'Direct Wealth': 15,
    'Indirect Wealth': 12
  },

  // Output star weights (produces wealth)
  outputStars: {
    'Eating God': 8,
    'Hurting Officer': 6
  },

  // Officer star weights (governs wealth flow)
  officerStars: {
    'Direct Officer': 5,
    'Seven Killings': 4
  },

  // Resource star weights (stabilizes)
  resourceStars: {
    'Direct Resource': 3,
    'Indirect Resource': 2
  },

  // Competition (negative)
  competitionStars: {
    'Friend': -3,
    'Rob Wealth': -8
  },

  // Useful God alignment
  usefulGod: {
    activated: 10,
    wealthRelated: 15
  },

  // Annoying God
  annoyingGod: {
    activated: -12,
    wealthDraining: -15
  },

  // Transformations
  transformations: {
    producesWealth: 8,
    destroysWealth: -8
  },

  // Conflicts
  conflicts: {
    clash: -10,
    harm: -6,
    punishment: -8,
    destruction: -12
  },

  // Shen Sha (uses individual weights from definitions)
  shensha: {
    multiplier: 1.0
  },

  // DM strength adjustments
  dmStrength: {
    weakWithWealth: -5,
    weakWithOutput: -5,
    strongWithWealth: 5,
    strongWithOutput: 3
  },

  // Seasonal
  seasonal: {
    wealthInSeason: 5,
    wealthOutOfSeason: -3
  }
};

// ============================================================================
// SEASON ELEMENT MAPPING
// ============================================================================

/**
 * Determine season element from month branch
 */
export function getSeasonElement(monthBranch: string): ElementName {
  const seasonMap: Record<string, ElementName> = {
    '寅': 'Wood', '卯': 'Wood', '辰': 'Earth',  // Spring
    '巳': 'Fire', '午': 'Fire', '未': 'Earth',  // Summer
    '申': 'Metal', '酉': 'Metal', '戌': 'Earth', // Autumn
    '亥': 'Water', '子': 'Water', '丑': 'Earth'  // Winter
  };
  return seasonMap[monthBranch] || 'Earth';
}

// ============================================================================
// DM STRENGTH ANALYSIS
// ============================================================================

/**
 * Analyze DM strength for wealth handling capacity
 */
export function analyzeDMStrength(strengthScore: number): DMStrengthContext {
  // Assuming strength score is 0-2 scale
  let category: DMStrengthContext['category'];
  let needsSupport: boolean;
  let canHandleWealth: boolean;

  if (strengthScore < 0.4) {
    category = 'very_weak';
    needsSupport = true;
    canHandleWealth = false;
  } else if (strengthScore < 0.8) {
    category = 'weak';
    needsSupport = true;
    canHandleWealth = false;
  } else if (strengthScore < 1.2) {
    category = 'balanced';
    needsSupport = false;
    canHandleWealth = true;
  } else if (strengthScore < 1.6) {
    category = 'strong';
    needsSupport = false;
    canHandleWealth = true;
  } else {
    category = 'very_strong';
    needsSupport = false;
    canHandleWealth = true;
  }

  return {
    strength: strengthScore,
    category,
    needsSupport,
    canHandleWealth
  };
}

// ============================================================================
// WEALTH SHEN SHA DETECTION
// ============================================================================

/**
 * Detect wealth-related Shen Sha in a timing pillar
 */
export function detectWealthShensha(
  timePillar: TimingPillar,
  dayStem: string,
  yearBranch: string,
  dayBranch: string
): WealthShenshaHit[] {
  const hits: WealthShenshaHit[] = [];
  const { branch: timeBranch } = timePillar;

  // 1. Prosperity Star (禄神)
  const luShen = LU_SHEN_MAP[dayStem];
  if (timeBranch === luShen) {
    const def = WEALTH_SHENSHA_DEFINITIONS['Prosperity Star'];
    hits.push({
      name: 'Prosperity Star',
      chineseName: def.chineseName,
      nature: def.nature,
      effect: def.wealthEffect,
      weight: def.weight
    });
  }

  // 2. Heavenly Kitchen (天厨)
  const heavenlyKitchen = HEAVENLY_KITCHEN_MAP[yearBranch];
  if (timeBranch === heavenlyKitchen) {
    const def = WEALTH_SHENSHA_DEFINITIONS['Heavenly Kitchen'];
    hits.push({
      name: 'Heavenly Kitchen',
      chineseName: def.chineseName,
      nature: def.nature,
      effect: def.wealthEffect,
      weight: def.weight
    });
  }

  // 3. Golden Carriage (金舆)
  const goldenCarriage = GOLDEN_CARRIAGE_MAP[dayStem];
  if (timeBranch === goldenCarriage) {
    const def = WEALTH_SHENSHA_DEFINITIONS['Golden Carriage'];
    hits.push({
      name: 'Golden Carriage',
      chineseName: def.chineseName,
      nature: def.nature,
      effect: def.wealthEffect,
      weight: def.weight
    });
  }

  // 4. Nobleman (天乙贵人)
  const noblemanBranches = NOBLEMAN_MAP[dayStem] || [];
  if (noblemanBranches.includes(timeBranch)) {
    const def = WEALTH_SHENSHA_DEFINITIONS['Nobleman'];
    hits.push({
      name: 'Nobleman',
      chineseName: def.chineseName,
      nature: def.nature,
      effect: def.wealthEffect,
      weight: def.weight
    });
  }

  // 5. Traveling Horse (驿马)
  const travelingHorse = TRAVELING_HORSE_MAP[yearBranch] || TRAVELING_HORSE_MAP[dayBranch];
  if (timeBranch === travelingHorse) {
    const def = WEALTH_SHENSHA_DEFINITIONS['Traveling Horse'];
    hits.push({
      name: 'Traveling Horse',
      chineseName: def.chineseName,
      nature: def.nature,
      effect: def.wealthEffect,
      weight: def.weight
    });
  }

  return hits;
}

// ============================================================================
// WEALTH CONFLICT DETECTION
// ============================================================================

/**
 * Detect conflicts that affect wealth
 */
export function detectWealthConflicts(
  timePillar: TimingPillar,
  natalPillars: NatalPillarsInput,
  wealthElement: ElementName
): WealthConflictHit[] {
  const hits: WealthConflictHit[] = [];
  const { branch: timeBranch } = timePillar;

  // Get natal branches that contain wealth element
  const natalBranches = [
    natalPillars.yearBranch,
    natalPillars.monthBranch,
    natalPillars.dayBranch,
    natalPillars.hourBranch
  ];

  // Check if time pillar clashes with any natal branch containing wealth
  const clashPartner = getClashPartner(timeBranch);
  if (clashPartner && natalBranches.includes(clashPartner)) {
    const clashBranchElement = BRANCH_TO_ELEMENT[clashPartner];
    const affectsWealth = clashBranchElement === wealthElement;

    hits.push({
      type: 'clash',
      affectsWealth,
      description: `Time ${timeBranch} clashes with natal ${clashPartner}${affectsWealth ? ' (affects Wealth element)' : ''}`,
      severity: affectsWealth ? 10 : 6
    });
  }

  return hits;
}

// ============================================================================
// MAIN COMPUTATION FUNCTION
// ============================================================================

/**
 * Compute wealth timing for a given time unit
 */
export function computeWealthTiming(opts: {
  timeUnit: WealthTimingLayer;
  date?: string;
  timePillar: TimingPillar;
  natalPillars: NatalPillarsInput;
  usefulGod: ElementName;
  annoyingGod: ElementName;
  dmStrength: number;
  monthBranch: string;
}): WealthTimingResult {
  const {
    timeUnit,
    date,
    timePillar,
    natalPillars,
    usefulGod,
    annoyingGod,
    dmStrength,
    monthBranch
  } = opts;

  const reasoning: string[] = [];
  const dmStem = natalPillars.dayStem;
  const dmElement = STEM_TO_ELEMENT[dmStem] as ElementName;

  // Determine wealth element (element DM controls)
  const wealthElement = ELEMENT_CONTROLS[dmElement];

  // ========================================
  // STEP 1: Analyze Ten Gods
  // ========================================
  const { tenGods, details } = analyzeTenGods(timePillar, dmStem);

  // Categorize stars
  const wealthStars = details.filter(d =>
    d.type === 'Direct Wealth' || d.type === 'Indirect Wealth'
  );
  const outputStars = details.filter(d =>
    d.type === 'Eating God' || d.type === 'Hurting Officer'
  );
  const officerStars = details.filter(d =>
    d.type === 'Direct Officer' || d.type === 'Seven Killings'
  );
  const competitionStars = details.filter(d =>
    d.type === 'Friend' || d.type === 'Rob Wealth'
  );

  reasoning.push(`Ten Gods: ${Array.from(tenGods.keys()).join(', ')}`);

  // ========================================
  // STEP 2: Determine wealth type
  // ========================================
  let wealthType: WealthType = 'none';
  if (wealthStars.some(w => w.type === 'Direct Wealth') && wealthStars.some(w => w.type === 'Indirect Wealth')) {
    wealthType = 'mixed';
  } else if (wealthStars.some(w => w.type === 'Direct Wealth')) {
    wealthType = 'direct';
  } else if (wealthStars.some(w => w.type === 'Indirect Wealth')) {
    wealthType = 'indirect';
  } else if (outputStars.length > 0) {
    wealthType = 'output';
  }

  // ========================================
  // STEP 3: Useful/Annoying God activation
  // ========================================
  const stemElement = STEM_TO_ELEMENT[timePillar.stem] as ElementName;
  const branchElement = BRANCH_TO_ELEMENT[timePillar.branch] as ElementName;

  const usefulActivated: ElementName[] = [];
  const annoyingActivated: ElementName[] = [];

  if (stemElement === usefulGod || branchElement === usefulGod) {
    usefulActivated.push(usefulGod);
    reasoning.push(`Useful God (${usefulGod}) activated`);
  }
  if (stemElement === annoyingGod || branchElement === annoyingGod) {
    annoyingActivated.push(annoyingGod);
    reasoning.push(`Annoying God (${annoyingGod}) activated`);
  }

  // ========================================
  // STEP 4: Detect Shen Sha
  // ========================================
  const shensha = detectWealthShensha(
    timePillar,
    dmStem,
    natalPillars.yearBranch,
    natalPillars.dayBranch
  );

  if (shensha.length > 0) {
    reasoning.push(`Wealth Shen Sha: ${shensha.map(s => s.chineseName).join(', ')}`);
  }

  // ========================================
  // STEP 5: Detect conflicts
  // ========================================
  const conflicts = detectWealthConflicts(timePillar, natalPillars, wealthElement);

  if (conflicts.length > 0) {
    reasoning.push(`Conflicts: ${conflicts.map(c => c.type).join(', ')}`);
  }

  // ========================================
  // STEP 6: Seasonal analysis
  // ========================================
  const seasonElement = getSeasonElement(monthBranch);
  const wealthInSeason = wealthElement === seasonElement;

  if (wealthInSeason) {
    reasoning.push(`Wealth element (${wealthElement}) is in season`);
  }

  // ========================================
  // STEP 7: DM strength analysis
  // ========================================
  const dmContext = analyzeDMStrength(dmStrength);

  // ========================================
  // STEP 8: Calculate score
  // ========================================
  let score = 50; // Base score

  // Wealth stars
  for (const star of wealthStars) {
    const weight = WEALTH_SCORING_WEIGHTS.wealthStars[star.type as keyof typeof WEALTH_SCORING_WEIGHTS.wealthStars] || 0;
    score += weight * star.weight;
  }

  // Output stars
  for (const star of outputStars) {
    const weight = WEALTH_SCORING_WEIGHTS.outputStars[star.type as keyof typeof WEALTH_SCORING_WEIGHTS.outputStars] || 0;
    score += weight * star.weight;
  }

  // Officer stars
  for (const star of officerStars) {
    const weight = WEALTH_SCORING_WEIGHTS.officerStars[star.type as keyof typeof WEALTH_SCORING_WEIGHTS.officerStars] || 0;
    score += weight * star.weight;
  }

  // Competition stars (negative)
  for (const star of competitionStars) {
    const weight = WEALTH_SCORING_WEIGHTS.competitionStars[star.type as keyof typeof WEALTH_SCORING_WEIGHTS.competitionStars] || 0;
    score += weight * star.weight;
  }

  // Useful God activation
  if (usefulActivated.length > 0) {
    const bonus = usefulActivated.includes(wealthElement)
      ? WEALTH_SCORING_WEIGHTS.usefulGod.wealthRelated
      : WEALTH_SCORING_WEIGHTS.usefulGod.activated;
    score += bonus;
    reasoning.push(`Useful God bonus: +${bonus}`);
  }

  // Annoying God activation
  if (annoyingActivated.length > 0) {
    const penalty = annoyingActivated.includes(wealthElement)
      ? WEALTH_SCORING_WEIGHTS.annoyingGod.wealthDraining
      : WEALTH_SCORING_WEIGHTS.annoyingGod.activated;
    score += penalty;
    reasoning.push(`Annoying God penalty: ${penalty}`);
  }

  // Shen Sha bonuses/penalties
  let shenshaBonus = 0;
  for (const hit of shensha) {
    shenshaBonus += hit.weight * WEALTH_SCORING_WEIGHTS.shensha.multiplier;
  }
  score += shenshaBonus;

  // Conflict penalties
  for (const conflict of conflicts) {
    const penalty = WEALTH_SCORING_WEIGHTS.conflicts[conflict.type];
    score += conflict.affectsWealth ? penalty * 1.5 : penalty;
  }

  // DM strength adjustment
  if (!dmContext.canHandleWealth && wealthStars.length > 0) {
    score += WEALTH_SCORING_WEIGHTS.dmStrength.weakWithWealth;
    reasoning.push(`Weak DM struggles with wealth energy`);
  }
  if (!dmContext.canHandleWealth && outputStars.length > 0) {
    score += WEALTH_SCORING_WEIGHTS.dmStrength.weakWithOutput;
  }
  if (dmContext.canHandleWealth && wealthStars.length > 0) {
    score += WEALTH_SCORING_WEIGHTS.dmStrength.strongWithWealth;
    reasoning.push(`Strong DM benefits from wealth energy`);
  }

  // Seasonal adjustment
  if (wealthInSeason) {
    score += WEALTH_SCORING_WEIGHTS.seasonal.wealthInSeason;
  } else {
    score += WEALTH_SCORING_WEIGHTS.seasonal.wealthOutOfSeason;
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Determine tier
  const tier: WealthTier =
    score >= 80 ? 'excellent' :
    score >= 65 ? 'good' :
    score >= 45 ? 'neutral' :
    score >= 30 ? 'challenging' : 'difficult';

  reasoning.push(`Final score: ${score.toFixed(1)} (${tier})`);

  // ========================================
  // STEP 9: Generate summary and advice
  // ========================================
  const summary = generateWealthSummary(
    timeUnit, tier, wealthType, wealthStars, shensha, conflicts, dmContext
  );
  const advice = generateWealthAdvice(
    tier, wealthType, wealthStars, outputStars, competitionStars, shensha, dmContext
  );

  // ========================================
  // STEP 10: Activity recommendations
  // ========================================
  const { suitableActivities, avoidActivities } = generateWealthActivities(
    tier, wealthType, wealthStars, outputStars, shensha, conflicts
  );

  return {
    timeUnit,
    date,
    pillar: timePillar,
    pillarDisplay: `${timePillar.stem}${timePillar.branch}`,
    score: Math.round(score),
    tier,
    wealthType,
    wealthStars,
    outputStars,
    officerStars,
    competitionStars,
    usefulActivated,
    annoyingActivated,
    transformations: [], // Placeholder - can be enhanced
    conflicts,
    shensha,
    dmStrength: dmContext,
    seasonElement,
    wealthInSeason,
    reasoning,
    summary,
    advice,
    suitableActivities,
    avoidActivities
  };
}

// ============================================================================
// LAYER-SPECIFIC FUNCTIONS
// ============================================================================

/**
 * Compute wealth timing for Luck Pillar (10-year cycle)
 */
export function computeWealthLuckPillarTiming(opts: {
  luckPillar: TimingPillar;
  startAge: number;
  endAge: number;
  natalPillars: NatalPillarsInput;
  usefulGod: ElementName;
  annoyingGod: ElementName;
  dmStrength: number;
}): WealthLuckPillarTiming {
  const baseResult = computeWealthTiming({
    timeUnit: 'luck_pillar',
    date: `Age ${opts.startAge}-${opts.endAge}`,
    timePillar: opts.luckPillar,
    natalPillars: opts.natalPillars,
    usefulGod: opts.usefulGod,
    annoyingGod: opts.annoyingGod,
    dmStrength: opts.dmStrength,
    monthBranch: opts.natalPillars.monthBranch
  });

  const decadeTheme = generateDecadeTheme(baseResult);

  return {
    ...baseResult,
    startAge: opts.startAge,
    endAge: opts.endAge,
    decadeTheme
  };
}

/**
 * Compute yearly wealth timing
 */
export function computeWealthYearlyTiming(opts: {
  year: number;
  annualPillar: TimingPillar;
  natalPillars: NatalPillarsInput;
  usefulGod: ElementName;
  annoyingGod: ElementName;
  dmStrength: number;
}): WealthYearlyTiming {
  const baseResult = computeWealthTiming({
    timeUnit: 'yearly',
    date: `${opts.year}`,
    timePillar: opts.annualPillar,
    natalPillars: opts.natalPillars,
    usefulGod: opts.usefulGod,
    annoyingGod: opts.annoyingGod,
    dmStrength: opts.dmStrength,
    monthBranch: opts.natalPillars.monthBranch
  });

  const yearlyTheme = generateYearlyTheme(baseResult);

  return {
    ...baseResult,
    year: opts.year,
    yearlyTheme
  };
}

/**
 * Compute monthly wealth timing
 */
export function computeWealthMonthlyTiming(opts: {
  year: number;
  month: number;
  monthPillar: TimingPillar;
  natalPillars: NatalPillarsInput;
  usefulGod: ElementName;
  annoyingGod: ElementName;
  dmStrength: number;
}): WealthMonthlyTiming {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const baseResult = computeWealthTiming({
    timeUnit: 'monthly',
    date: `${opts.year}-${String(opts.month).padStart(2, '0')}`,
    timePillar: opts.monthPillar,
    natalPillars: opts.natalPillars,
    usefulGod: opts.usefulGod,
    annoyingGod: opts.annoyingGod,
    dmStrength: opts.dmStrength,
    monthBranch: opts.monthPillar.branch
  });

  const cashflowForecast = generateCashflowForecast(baseResult);

  return {
    ...baseResult,
    year: opts.year,
    month: opts.month,
    monthName: monthNames[opts.month - 1],
    cashflowForecast
  };
}

/**
 * Compute daily wealth timing
 */
export function computeWealthDailyTiming(opts: {
  year: number;
  month: number;
  day: number;
  dayPillar: TimingPillar;
  natalPillars: NatalPillarsInput;
  usefulGod: ElementName;
  annoyingGod: ElementName;
  dmStrength: number;
  monthBranch: string;
}): WealthDailyTiming {
  const dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(opts.year, opts.month - 1, opts.day);

  const baseResult = computeWealthTiming({
    timeUnit: 'daily',
    date: `${opts.year}-${String(opts.month).padStart(2, '0')}-${String(opts.day).padStart(2, '0')}`,
    timePillar: opts.dayPillar,
    natalPillars: opts.natalPillars,
    usefulGod: opts.usefulGod,
    annoyingGod: opts.annoyingGod,
    dmStrength: opts.dmStrength,
    monthBranch: opts.monthBranch
  });

  const bestActionWindow = generateBestActionWindow(baseResult);

  return {
    ...baseResult,
    year: opts.year,
    month: opts.month,
    day: opts.day,
    dayOfWeek: dayOfWeekNames[date.getDay()],
    bestActionWindow
  };
}

/**
 * Compute hourly wealth timing
 */
export function computeWealthHourlyTiming(opts: {
  year: number;
  month: number;
  day: number;
  hour: number;
  hourPillar: TimingPillar;
  natalPillars: NatalPillarsInput;
  usefulGod: ElementName;
  annoyingGod: ElementName;
  dmStrength: number;
  monthBranch: string;
}): WealthHourlyTiming {
  const CHINESE_HOURS = [
    { branch: '子', name: '子时', range: '23:00-01:00', start: 23 },
    { branch: '丑', name: '丑时', range: '01:00-03:00', start: 1 },
    { branch: '寅', name: '寅时', range: '03:00-05:00', start: 3 },
    { branch: '卯', name: '卯时', range: '05:00-07:00', start: 5 },
    { branch: '辰', name: '辰时', range: '07:00-09:00', start: 7 },
    { branch: '巳', name: '巳时', range: '09:00-11:00', start: 9 },
    { branch: '午', name: '午时', range: '11:00-13:00', start: 11 },
    { branch: '未', name: '未时', range: '13:00-15:00', start: 13 },
    { branch: '申', name: '申时', range: '15:00-17:00', start: 15 },
    { branch: '酉', name: '酉时', range: '17:00-19:00', start: 17 },
    { branch: '戌', name: '戌时', range: '19:00-21:00', start: 19 },
    { branch: '亥', name: '亥时', range: '21:00-23:00', start: 21 }
  ];

  const hourInfo = CHINESE_HOURS.find(h => {
    if (h.start === 23) return opts.hour >= 23 || opts.hour < 1;
    return opts.hour >= h.start && opts.hour < h.start + 2;
  }) || CHINESE_HOURS[0];

  const baseResult = computeWealthTiming({
    timeUnit: 'hourly',
    date: `${opts.year}-${String(opts.month).padStart(2, '0')}-${String(opts.day).padStart(2, '0')} ${String(opts.hour).padStart(2, '0')}:00`,
    timePillar: opts.hourPillar,
    natalPillars: opts.natalPillars,
    usefulGod: opts.usefulGod,
    annoyingGod: opts.annoyingGod,
    dmStrength: opts.dmStrength,
    monthBranch: opts.monthBranch
  });

  const actionType = determineActionType(baseResult);

  return {
    ...baseResult,
    year: opts.year,
    month: opts.month,
    day: opts.day,
    hour: opts.hour,
    chineseHour: hourInfo.name,
    westernTimeRange: hourInfo.range,
    actionType
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateWealthSummary(
  timeUnit: WealthTimingLayer,
  tier: WealthTier,
  wealthType: WealthType,
  wealthStars: WealthStarHit[],
  shensha: WealthShenshaHit[],
  conflicts: WealthConflictHit[],
  dmContext: DMStrengthContext
): string {
  const parts: string[] = [];

  const timeLabels: Record<WealthTimingLayer, string> = {
    luck_pillar: 'This decade',
    yearly: 'This year',
    monthly: 'This month',
    daily: 'Today',
    hourly: 'This hour'
  };

  const tierDescriptions: Record<WealthTier, string> = {
    excellent: 'brings exceptional wealth opportunities',
    good: 'supports financial growth',
    neutral: 'offers balanced financial energy',
    challenging: 'requires careful financial management',
    difficult: 'demands caution with finances'
  };

  parts.push(`${timeLabels[timeUnit]} ${tierDescriptions[tier]}.`);

  // Wealth type
  if (wealthType === 'direct') {
    parts.push('Focus on stable income and earned wealth.');
  } else if (wealthType === 'indirect') {
    parts.push('Opportunities for windfall or speculative gains.');
  } else if (wealthType === 'output') {
    parts.push('Wealth through creativity and skill expression.');
  } else if (wealthType === 'mixed') {
    parts.push('Multiple wealth channels are active.');
  }

  // Shen Sha highlight
  const auspiciousShensha = shensha.filter(s => s.nature === 'auspicious');
  if (auspiciousShensha.length > 0) {
    parts.push(`${auspiciousShensha[0].chineseName} (${auspiciousShensha[0].name}) supports your finances.`);
  }

  // DM context
  if (!dmContext.canHandleWealth && wealthStars.length > 0) {
    parts.push('Build support before pursuing large opportunities.');
  }

  // Conflicts
  if (conflicts.some(c => c.affectsWealth)) {
    parts.push('Watch for disruptions to existing income streams.');
  }

  return parts.join(' ');
}

function generateWealthAdvice(
  tier: WealthTier,
  wealthType: WealthType,
  wealthStars: WealthStarHit[],
  outputStars: WealthStarHit[],
  competitionStars: WealthStarHit[],
  shensha: WealthShenshaHit[],
  dmContext: DMStrengthContext
): string {
  const advice: string[] = [];

  // Tier-based advice
  switch (tier) {
    case 'excellent':
      advice.push('Ideal timing for major financial moves, investments, and negotiations.');
      break;
    case 'good':
      advice.push('Good period for pursuing new income opportunities and expanding business.');
      break;
    case 'neutral':
      advice.push('Maintain current financial activities. Avoid major risks.');
      break;
    case 'challenging':
      advice.push('Focus on preserving capital. Avoid speculative investments.');
      break;
    case 'difficult':
      advice.push('Minimize financial exposure. Build reserves. Wait for better timing.');
      break;
  }

  // Wealth type specific
  if (wealthType === 'direct' && wealthStars.length > 0) {
    advice.push('Negotiate salary increases or secure long-term contracts.');
  }
  if (wealthType === 'indirect' && wealthStars.length > 0) {
    advice.push('Consider calculated investments or side ventures.');
  }
  if (outputStars.length > 0) {
    advice.push('Monetize your skills and creative output.');
  }

  // Competition warning
  if (competitionStars.length > 0) {
    advice.push('Be cautious of partnerships and competition for resources.');
  }

  // Shen Sha specific
  if (shensha.some(s => s.name === 'Traveling Horse')) {
    advice.push('Financial opportunities through travel or trade.');
  }
  if (shensha.some(s => s.name === 'Nobleman')) {
    advice.push('Seek advice from mentors or influential connections.');
  }

  // DM context
  if (!dmContext.canHandleWealth) {
    advice.push('Strengthen your position before expanding.');
  }

  return advice.slice(0, 3).join(' ');
}

function generateWealthActivities(
  tier: WealthTier,
  wealthType: WealthType,
  wealthStars: WealthStarHit[],
  outputStars: WealthStarHit[],
  shensha: WealthShenshaHit[],
  conflicts: WealthConflictHit[]
): { suitableActivities: string[]; avoidActivities: string[] } {
  const suitableActivities: string[] = [];
  const avoidActivities: string[] = [];

  // Tier-based
  if (tier === 'excellent' || tier === 'good') {
    suitableActivities.push('Investment decisions', 'Contract negotiations', 'Business expansion');
  }
  if (tier === 'neutral') {
    suitableActivities.push('Routine transactions', 'Budget planning', 'Skill development');
  }
  if (tier === 'challenging' || tier === 'difficult') {
    avoidActivities.push('Major investments', 'Speculative trading', 'Large purchases');
    suitableActivities.push('Review expenses', 'Build emergency fund', 'Debt reduction');
  }

  // Wealth type
  if (wealthType === 'direct') {
    suitableActivities.push('Salary negotiation', 'Job interviews', 'Career advancement');
  }
  if (wealthType === 'indirect') {
    suitableActivities.push('Investment research', 'Calculated speculation', 'Side business');
  }
  if (outputStars.length > 0) {
    suitableActivities.push('Creative projects', 'Consulting work', 'Product launches');
  }

  // Shen Sha
  if (shensha.some(s => s.name === 'Heavenly Kitchen')) {
    suitableActivities.push('Food/hospitality ventures', 'Entertainment investments');
  }
  if (shensha.some(s => s.name === 'Traveling Horse')) {
    suitableActivities.push('Import/export deals', 'Remote work opportunities', 'Travel business');
  }

  // Conflicts
  if (conflicts.some(c => c.affectsWealth)) {
    avoidActivities.push('Risky ventures', 'Lending money', 'Joint investments');
  }

  return {
    suitableActivities: Array.from(new Set(suitableActivities)).slice(0, 5),
    avoidActivities: Array.from(new Set(avoidActivities)).slice(0, 4)
  };
}

function generateDecadeTheme(result: WealthTimingResult): string {
  if (result.tier === 'excellent') {
    return 'Peak wealth accumulation period';
  } else if (result.tier === 'good') {
    return 'Steady financial growth phase';
  } else if (result.tier === 'neutral') {
    return 'Consolidation and stability phase';
  } else if (result.tier === 'challenging') {
    return 'Rebuilding and restructuring phase';
  } else {
    return 'Conservation and patience phase';
  }
}

function generateYearlyTheme(result: WealthTimingResult): string {
  if (result.wealthStars.length > 0 && result.tier !== 'difficult') {
    return 'Wealth activation year';
  } else if (result.outputStars.length > 0) {
    return 'Productivity and creation year';
  } else if (result.competitionStars.length > 0) {
    return 'Competition and strategy year';
  } else {
    return 'Preparation and planning year';
  }
}

function generateCashflowForecast(result: WealthTimingResult): string {
  if (result.tier === 'excellent') {
    return 'Strong inflow expected. Expand investments.';
  } else if (result.tier === 'good') {
    return 'Positive cashflow. Good for savings.';
  } else if (result.tier === 'neutral') {
    return 'Balanced flow. Maintain budget discipline.';
  } else if (result.tier === 'challenging') {
    return 'Potential strain. Monitor expenses closely.';
  } else {
    return 'Conservative approach needed. Build reserves.';
  }
}

function generateBestActionWindow(result: WealthTimingResult): string {
  if (result.tier === 'excellent' || result.tier === 'good') {
    return 'Morning (9-11am) or afternoon (1-3pm) for financial decisions';
  } else if (result.tier === 'neutral') {
    return 'Mid-morning (10-11am) for routine transactions';
  } else {
    return 'Postpone major financial decisions if possible';
  }
}

function determineActionType(result: WealthTimingResult): string {
  if (result.tier === 'excellent') {
    return 'Execute major decisions';
  } else if (result.tier === 'good') {
    return 'Advance negotiations';
  } else if (result.tier === 'neutral') {
    return 'Research and plan';
  } else if (result.tier === 'challenging') {
    return 'Review and consolidate';
  } else {
    return 'Observe and wait';
  }
}

// ============================================================================
// BEST TIMING FINDER
// ============================================================================

/**
 * Find best days for wealth activities in a given period
 */
export function findBestDaysForWealth(
  dailyTimings: WealthDailyTiming[],
  minTier: WealthTier = 'good',
  wealthType?: WealthType
): WealthDailyTiming[] {
  const tierOrder: WealthTier[] = ['excellent', 'good', 'neutral', 'challenging', 'difficult'];
  const minTierIndex = tierOrder.indexOf(minTier);

  return dailyTimings
    .filter(d => tierOrder.indexOf(d.tier) <= minTierIndex)
    .filter(d => !wealthType || d.wealthType === wealthType || d.wealthType === 'mixed')
    .sort((a, b) => b.score - a.score);
}

/**
 * Find best hours for wealth activities on a given day
 */
export function findBestHoursForWealth(
  hourlyTimings: WealthHourlyTiming[],
  minTier: WealthTier = 'good'
): WealthHourlyTiming[] {
  const tierOrder: WealthTier[] = ['excellent', 'good', 'neutral', 'challenging', 'difficult'];
  const minTierIndex = tierOrder.indexOf(minTier);

  return hourlyTimings
    .filter(h => tierOrder.indexOf(h.tier) <= minTierIndex)
    .sort((a, b) => b.score - a.score);
}

// ============================================================================
// STORY/NARRATIVE BUILDER
// ============================================================================

/**
 * Build a narrative story for wealth timing
 */
export function buildWealthTimingStory(result: WealthTimingResult): string {
  const lines: string[] = [];

  // Header
  const timeLabel = result.timeUnit === 'luck_pillar' ? 'Decade' :
                    result.timeUnit === 'yearly' ? 'Year' :
                    result.timeUnit === 'monthly' ? 'Month' :
                    result.timeUnit === 'daily' ? 'Day' : 'Hour';

  lines.push(`## Wealth Timing — ${timeLabel} (财运${result.timeUnit === 'luck_pillar' ? '大运' : result.timeUnit === 'yearly' ? '流年' : result.timeUnit === 'monthly' ? '流月' : result.timeUnit === 'daily' ? '流日' : '流时'})`);
  lines.push('');
  lines.push(`**${result.date || result.pillarDisplay}** — ${result.pillarDisplay}`);
  lines.push(`Score: ${result.score} (${result.tier.charAt(0).toUpperCase() + result.tier.slice(1)})`);
  lines.push(`Wealth Type: ${result.wealthType}`);
  lines.push('');

  // Wealth Stars
  if (result.wealthStars.length > 0) {
    lines.push('### Wealth Stars');
    for (const star of result.wealthStars) {
      lines.push(`- ${star.type}: ${star.description}`);
    }
    lines.push('');
  }

  // Output Stars
  if (result.outputStars.length > 0) {
    lines.push('### Output Stars (Wealth Production)');
    for (const star of result.outputStars) {
      lines.push(`- ${star.type}: ${star.description}`);
    }
    lines.push('');
  }

  // Shen Sha
  if (result.shensha.length > 0) {
    lines.push('### Wealth Shen Sha');
    for (const hit of result.shensha) {
      lines.push(`- ${hit.chineseName} (${hit.name}): ${hit.effect}`);
    }
    lines.push('');
  }

  // Conflicts
  if (result.conflicts.length > 0) {
    lines.push('### Conflicts');
    for (const conflict of result.conflicts) {
      lines.push(`- ${conflict.type}: ${conflict.description}`);
    }
    lines.push('');
  }

  // Summary and Advice
  lines.push('### Interpretation');
  lines.push(result.summary);
  lines.push('');
  lines.push('### Advice');
  lines.push(result.advice);
  lines.push('');

  // Activities
  if (result.suitableActivities.length > 0) {
    lines.push('### Suitable Activities');
    lines.push(result.suitableActivities.map(a => `- ${a}`).join('\n'));
    lines.push('');
  }

  if (result.avoidActivities.length > 0) {
    lines.push('### Activities to Avoid');
    lines.push(result.avoidActivities.map(a => `- ${a}`).join('\n'));
  }

  return lines.join('\n');
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Main computation
  computeWealthTiming,
  computeWealthLuckPillarTiming,
  computeWealthYearlyTiming,
  computeWealthMonthlyTiming,
  computeWealthDailyTiming,
  computeWealthHourlyTiming,

  // Analysis
  analyzeTenGods,
  getTenGod,
  detectWealthShensha,
  detectWealthConflicts,
  analyzeDMStrength,

  // Best timing finder
  findBestDaysForWealth,
  findBestHoursForWealth,

  // Story builder
  buildWealthTimingStory,

  // Constants
  WEALTH_SCORING_WEIGHTS,
  WEALTH_SHENSHA_DEFINITIONS,
  LU_SHEN_MAP,
  HEAVENLY_KITCHEN_MAP,
  GOLDEN_CARRIAGE_MAP,
  NOBLEMAN_MAP,
  TRAVELING_HORSE_MAP
};
