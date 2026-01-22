/**
 * ============================================================================
 * BAZI CAREER TIMING ENGINE (官杀时机)
 * ============================================================================
 *
 * The structurally elegant and strategically powerful timing module for career.
 * This engine tells you:
 * - When career opportunities open
 * - When promotions are likely
 * - When authority increases
 * - When pressure or competition rises
 * - When leadership is demanded
 * - When career transitions are favorable
 * - When to push, when to stabilize, when to avoid risk
 *
 * Career in BaZi is governed by:
 * - Direct Officer (正官) - Stable career, authority, reputation
 * - Seven Killings (七杀) - Pressure, leadership, competition, breakthroughs
 * - Eating God (食神) - Creativity, output, performance (regulates 官杀)
 * - Hurting Officer (伤官) - Innovation, disruption (controls 官)
 * - Direct Resource (正印) - Learning, credentials, support (supports 官杀)
 * - Indirect Resource (偏印) - Strategy, intuition, research
 * - Friend (比肩) - Competition
 * - Rob Wealth (劫财) - Conflict, politics, rivalry
 *
 * Five Timing Layers:
 * - 官杀大运 (Career Luck Pillars) - 10-year career cycles
 * - 官杀流年 (Career Annual) - Year-by-year activation
 * - 官杀流月 (Career Monthly) - Month-by-month career rhythm
 * - 官杀流日 (Career Daily) - Micro-timing for meetings, interviews
 * - 官杀流时 (Career Hourly) - Ultra-fine for calls, presentations
 *
 * Based on: Classical BaZi career doctrine, Joey Yap methodology
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

export type CareerTimingLayer = 'luck_pillar' | 'yearly' | 'monthly' | 'daily' | 'hourly';

export type CareerTier = 'excellent' | 'good' | 'neutral' | 'challenging' | 'difficult';

export type CareerType = 'officer' | 'killings' | 'mixed' | 'output' | 'resource' | 'none';

/**
 * Ten Gods mapping for career analysis
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
 * Career star activation hit
 */
export interface CareerStarHit {
  type: TenGodName;
  element: ElementName;
  source: 'stem' | 'branch' | 'hidden_stem';
  polarity: 'Yang' | 'Yin';
  weight: number;
  description: string;
}

/**
 * Career Shen Sha hit
 */
export interface CareerShenshaHit {
  name: string;
  chineseName: string;
  nature: 'auspicious' | 'inauspicious' | 'neutral';
  effect: string;
  weight: number;
}

/**
 * Career conflict hit
 */
export interface CareerConflictHit {
  type: 'clash' | 'harm' | 'punishment' | 'destruction';
  affectsCareer: boolean;
  description: string;
  severity: number;
}

/**
 * Career transformation hit
 */
export interface CareerTransformationHit {
  type: 'liuhe' | 'sanhe' | 'sanhui' | 'stem_combination';
  resultElement: ElementName;
  benefitsCareer: boolean;
  description: string;
  weight: number;
}

/**
 * DM (Day Master) strength context for career
 */
export interface DMStrengthContext {
  strength: number;  // 0-2 scale
  category: 'very_weak' | 'weak' | 'balanced' | 'strong' | 'very_strong';
  needsSupport: boolean;
  canHandleOfficer: boolean;
  canHandleKillings: boolean;
}

/**
 * Career timing result
 */
export interface CareerTimingResult {
  // Time identification
  timeUnit: CareerTimingLayer;
  date?: string;
  pillar: TimingPillar;
  pillarDisplay: string;

  // Scores
  score: number;
  tier: CareerTier;
  careerType: CareerType;

  // Activations
  officerStars: CareerStarHit[];
  outputStars: CareerStarHit[];
  resourceStars: CareerStarHit[];
  disruptorStars: CareerStarHit[];

  // Analysis
  usefulActivated: ElementName[];
  annoyingActivated: ElementName[];
  transformations: CareerTransformationHit[];
  conflicts: CareerConflictHit[];
  shensha: CareerShenshaHit[];

  // DM context
  dmStrength: DMStrengthContext;

  // Seasonal
  seasonElement: ElementName;
  officerInSeason: boolean;

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
export interface CareerLuckPillarTiming extends CareerTimingResult {
  startAge: number;
  endAge: number;
  decadeTheme: string;
}

export interface CareerYearlyTiming extends CareerTimingResult {
  year: number;
  yearlyTheme: string;
}

export interface CareerMonthlyTiming extends CareerTimingResult {
  year: number;
  month: number;
  monthName: string;
  careerForecast: string;
}

export interface CareerDailyTiming extends CareerTimingResult {
  year: number;
  month: number;
  day: number;
  dayOfWeek: string;
  bestActionWindow: string;
}

export interface CareerHourlyTiming extends CareerTimingResult {
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
 * Element is controlled by (Officer element)
 */
const ELEMENT_CONTROLLED_BY: Record<ElementName, ElementName> = {
  'Wood': 'Metal',
  'Fire': 'Water',
  'Earth': 'Wood',
  'Metal': 'Fire',
  'Water': 'Earth'
};

/**
 * Element is produced by (Resource element)
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
 * Branch hidden stems (main hidden stem)
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

  // Element I produce (Output)
  if (ELEMENT_PRODUCES[dmElement] === targetElement) {
    return samePolarity ? 'Eating God' : 'Hurting Officer';
  }

  // Element I control (Wealth)
  if (ELEMENT_CONTROLS[dmElement] === targetElement) {
    return samePolarity ? 'Indirect Wealth' : 'Direct Wealth';
  }

  // Element that controls me (Officer/Killings)
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
): { tenGods: Map<TenGodName, number>; details: CareerStarHit[] } {
  const dmElement = STEM_TO_ELEMENT[dmStem] as ElementName;
  const dmPolarity = STEM_POLARITY[dmStem];

  const tenGods = new Map<TenGodName, number>();
  const details: CareerStarHit[] = [];

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
// CAREER SHEN SHA (官杀神煞)
// ============================================================================

/**
 * 将星 (General Star) - Leadership and authority
 * Based on year or day branch (San He frame leader)
 */
export const GENERAL_STAR_MAP: Record<string, string> = {
  // Water frame (申子辰) → 子 is general
  '申': '子', '子': '子', '辰': '子',
  // Wood frame (亥卯未) → 卯 is general
  '亥': '卯', '卯': '卯', '未': '卯',
  // Fire frame (寅午戌) → 午 is general
  '寅': '午', '午': '午', '戌': '午',
  // Metal frame (巳酉丑) → 酉 is general
  '巳': '酉', '酉': '酉', '丑': '酉'
};

/**
 * 文昌 (Academic Star) - Learning, credentials, intellectual achievement
 * Based on day stem
 */
export const ACADEMIC_STAR_MAP: Record<string, string> = {
  '甲': '巳', '乙': '午', '丙': '申', '丁': '酉',
  '戊': '申', '己': '酉', '庚': '亥', '辛': '子',
  '壬': '寅', '癸': '卯'
};

/**
 * 天乙贵人 (Heavenly Nobleman) - Noble helper
 * Based on day stem
 */
export const NOBLEMAN_MAP: Record<string, string[]> = {
  '甲': ['丑', '未'], '乙': ['子', '申'], '丙': ['亥', '酉'],
  '丁': ['亥', '酉'], '戊': ['丑', '未'], '己': ['子', '申'],
  '庚': ['丑', '未'], '辛': ['寅', '午'], '壬': ['卯', '巳'],
  '癸': ['卯', '巳']
};

/**
 * 华盖 (Canopy Star) - Spirituality, solitude, specialized expertise
 * Based on year or day branch
 */
export const CANOPY_STAR_MAP: Record<string, string> = {
  '申': '辰', '子': '辰', '辰': '辰',
  '亥': '未', '卯': '未', '未': '未',
  '寅': '戌', '午': '戌', '戌': '戌',
  '巳': '丑', '酉': '丑', '丑': '丑'
};

/**
 * 驿马 (Traveling Horse) - Movement, promotion through relocation
 * Based on year or day branch
 */
export const TRAVELING_HORSE_MAP: Record<string, string> = {
  '寅': '申', '午': '申', '戌': '申',
  '申': '寅', '子': '寅', '辰': '寅',
  '巳': '亥', '酉': '亥', '丑': '亥',
  '亥': '巳', '卯': '巳', '未': '巳'
};

/**
 * 羊刃 (Goat Blade) - Aggressive energy, competitive edge
 * Based on day stem
 */
export const GOAT_BLADE_MAP: Record<string, string> = {
  '甲': '卯', '乙': '寅', '丙': '午', '丁': '巳',
  '戊': '午', '己': '巳', '庚': '酉', '辛': '申',
  '壬': '子', '癸': '亥'
};

/**
 * Career Shen Sha definitions
 */
export const CAREER_SHENSHA_DEFINITIONS: Record<string, {
  chineseName: string;
  nature: 'auspicious' | 'inauspicious' | 'neutral';
  meaning: string;
  careerEffect: string;
  weight: number;
}> = {
  'General Star': {
    chineseName: '将星',
    nature: 'auspicious',
    meaning: 'Leadership and commanding authority',
    careerEffect: 'Activates leadership roles, promotions to management, authority recognition',
    weight: 15
  },
  'Academic Star': {
    chineseName: '文昌',
    nature: 'auspicious',
    meaning: 'Intellectual achievement and credentials',
    careerEffect: 'Supports examinations, certifications, academic positions, research roles',
    weight: 12
  },
  'Nobleman': {
    chineseName: '天乙贵人',
    nature: 'auspicious',
    meaning: 'Noble helper arrives',
    careerEffect: 'Beneficial mentors, sponsors, influential connections for career advancement',
    weight: 10
  },
  'Canopy Star': {
    chineseName: '华盖',
    nature: 'neutral',
    meaning: 'Specialized expertise and solitude',
    careerEffect: 'Benefits specialized roles, research, technical expertise, independent work',
    weight: 6
  },
  'Traveling Horse': {
    chineseName: '驿马',
    nature: 'neutral',
    meaning: 'Movement and change',
    careerEffect: 'Career opportunities through relocation, travel, international roles',
    weight: 8
  },
  'Goat Blade': {
    chineseName: '羊刃',
    nature: 'neutral',
    meaning: 'Aggressive competitive energy',
    careerEffect: 'Competitive edge, decisive action, but risk of conflicts with authority',
    weight: 4
  }
};

// ============================================================================
// BRANCH RELATIONSHIPS FOR CAREER
// ============================================================================

/**
 * Six Clashes - Can disrupt career if officer star is clashed
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

export const CAREER_SCORING_WEIGHTS = {
  // Officer star weights
  officerStars: {
    'Direct Officer': 15,
    'Seven Killings': 12
  },

  // Output star weights (regulates 官杀)
  outputStars: {
    'Eating God': 10,
    'Hurting Officer': 6  // Can clash with 官
  },

  // Resource star weights (supports 官杀)
  resourceStars: {
    'Direct Resource': 8,
    'Indirect Resource': 6
  },

  // Disruptors (competition/conflict)
  disruptorStars: {
    'Friend': -6,
    'Rob Wealth': -10
  },

  // Useful God alignment
  usefulGod: {
    activated: 10,
    careerRelated: 15
  },

  // Annoying God
  annoyingGod: {
    activated: -12,
    careerDisrupting: -15
  },

  // Transformations
  transformations: {
    producesOfficer: 8,
    destroysOfficer: -8
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
    weakWithOfficer: -8,
    weakWithKillings: -12,
    strongWithOfficer: 8,
    strongWithKillings: 5
  },

  // Seasonal
  seasonal: {
    officerInSeason: 5,
    officerOutOfSeason: -3
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
    '寅': 'Wood', '卯': 'Wood', '辰': 'Earth',
    '巳': 'Fire', '午': 'Fire', '未': 'Earth',
    '申': 'Metal', '酉': 'Metal', '戌': 'Earth',
    '亥': 'Water', '子': 'Water', '丑': 'Earth'
  };
  return seasonMap[monthBranch] || 'Earth';
}

// ============================================================================
// DM STRENGTH ANALYSIS
// ============================================================================

/**
 * Analyze DM strength for career handling capacity
 */
export function analyzeDMStrength(strengthScore: number): DMStrengthContext {
  let category: DMStrengthContext['category'];
  let needsSupport: boolean;
  let canHandleOfficer: boolean;
  let canHandleKillings: boolean;

  if (strengthScore < 0.4) {
    category = 'very_weak';
    needsSupport = true;
    canHandleOfficer = false;
    canHandleKillings = false;
  } else if (strengthScore < 0.8) {
    category = 'weak';
    needsSupport = true;
    canHandleOfficer = false;
    canHandleKillings = false;
  } else if (strengthScore < 1.2) {
    category = 'balanced';
    needsSupport = false;
    canHandleOfficer = true;
    canHandleKillings = true;
  } else if (strengthScore < 1.6) {
    category = 'strong';
    needsSupport = false;
    canHandleOfficer = true;
    canHandleKillings = true;
  } else {
    category = 'very_strong';
    needsSupport = false;
    canHandleOfficer = true;
    canHandleKillings = true;
  }

  return {
    strength: strengthScore,
    category,
    needsSupport,
    canHandleOfficer,
    canHandleKillings
  };
}

// ============================================================================
// CAREER SHEN SHA DETECTION
// ============================================================================

/**
 * Detect career-related Shen Sha in a timing pillar
 */
export function detectCareerShensha(
  timePillar: TimingPillar,
  dayStem: string,
  yearBranch: string,
  dayBranch: string
): CareerShenshaHit[] {
  const hits: CareerShenshaHit[] = [];
  const { branch: timeBranch } = timePillar;

  // 1. General Star (将星)
  const generalStarFromYear = GENERAL_STAR_MAP[yearBranch];
  const generalStarFromDay = GENERAL_STAR_MAP[dayBranch];
  if (timeBranch === generalStarFromYear || timeBranch === generalStarFromDay) {
    const def = CAREER_SHENSHA_DEFINITIONS['General Star'];
    hits.push({
      name: 'General Star',
      chineseName: def.chineseName,
      nature: def.nature,
      effect: def.careerEffect,
      weight: def.weight
    });
  }

  // 2. Academic Star (文昌)
  const academicStar = ACADEMIC_STAR_MAP[dayStem];
  if (timeBranch === academicStar) {
    const def = CAREER_SHENSHA_DEFINITIONS['Academic Star'];
    hits.push({
      name: 'Academic Star',
      chineseName: def.chineseName,
      nature: def.nature,
      effect: def.careerEffect,
      weight: def.weight
    });
  }

  // 3. Nobleman (天乙贵人)
  const noblemanBranches = NOBLEMAN_MAP[dayStem] || [];
  if (noblemanBranches.includes(timeBranch)) {
    const def = CAREER_SHENSHA_DEFINITIONS['Nobleman'];
    hits.push({
      name: 'Nobleman',
      chineseName: def.chineseName,
      nature: def.nature,
      effect: def.careerEffect,
      weight: def.weight
    });
  }

  // 4. Canopy Star (华盖)
  const canopyStarFromYear = CANOPY_STAR_MAP[yearBranch];
  const canopyStarFromDay = CANOPY_STAR_MAP[dayBranch];
  if (timeBranch === canopyStarFromYear || timeBranch === canopyStarFromDay) {
    const def = CAREER_SHENSHA_DEFINITIONS['Canopy Star'];
    hits.push({
      name: 'Canopy Star',
      chineseName: def.chineseName,
      nature: def.nature,
      effect: def.careerEffect,
      weight: def.weight
    });
  }

  // 5. Traveling Horse (驿马)
  const travelingHorse = TRAVELING_HORSE_MAP[yearBranch] || TRAVELING_HORSE_MAP[dayBranch];
  if (timeBranch === travelingHorse) {
    const def = CAREER_SHENSHA_DEFINITIONS['Traveling Horse'];
    hits.push({
      name: 'Traveling Horse',
      chineseName: def.chineseName,
      nature: def.nature,
      effect: def.careerEffect,
      weight: def.weight
    });
  }

  // 6. Goat Blade (羊刃)
  const goatBlade = GOAT_BLADE_MAP[dayStem];
  if (timeBranch === goatBlade) {
    const def = CAREER_SHENSHA_DEFINITIONS['Goat Blade'];
    hits.push({
      name: 'Goat Blade',
      chineseName: def.chineseName,
      nature: def.nature,
      effect: def.careerEffect,
      weight: def.weight
    });
  }

  return hits;
}

// ============================================================================
// CAREER CONFLICT DETECTION
// ============================================================================

/**
 * Detect conflicts that affect career
 */
export function detectCareerConflicts(
  timePillar: TimingPillar,
  natalPillars: NatalPillarsInput,
  officerElement: ElementName
): CareerConflictHit[] {
  const hits: CareerConflictHit[] = [];
  const { branch: timeBranch } = timePillar;

  // Get natal branches
  const natalBranches = [
    natalPillars.yearBranch,
    natalPillars.monthBranch,
    natalPillars.dayBranch,
    natalPillars.hourBranch
  ];

  // Check if time pillar clashes with any natal branch containing officer
  const clashPartner = getClashPartner(timeBranch);
  if (clashPartner && natalBranches.includes(clashPartner)) {
    const clashBranchElement = BRANCH_TO_ELEMENT[clashPartner];
    const affectsCareer = clashBranchElement === officerElement;

    hits.push({
      type: 'clash',
      affectsCareer,
      description: `Time ${timeBranch} clashes with natal ${clashPartner}${affectsCareer ? ' (affects Officer element)' : ''}`,
      severity: affectsCareer ? 10 : 6
    });
  }

  return hits;
}

// ============================================================================
// MAIN COMPUTATION FUNCTION
// ============================================================================

/**
 * Compute career timing for a given time unit
 */
export function computeCareerTiming(opts: {
  timeUnit: CareerTimingLayer;
  date?: string;
  timePillar: TimingPillar;
  natalPillars: NatalPillarsInput;
  usefulGod: ElementName;
  annoyingGod: ElementName;
  dmStrength: number;
  monthBranch: string;
}): CareerTimingResult {
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

  // Determine officer element (element that controls DM)
  const officerElement = ELEMENT_CONTROLLED_BY[dmElement];

  // ========================================
  // STEP 1: Analyze Ten Gods
  // ========================================
  const { tenGods, details } = analyzeTenGods(timePillar, dmStem);

  // Categorize stars
  const officerStars = details.filter(d =>
    d.type === 'Direct Officer' || d.type === 'Seven Killings'
  );
  const outputStars = details.filter(d =>
    d.type === 'Eating God' || d.type === 'Hurting Officer'
  );
  const resourceStars = details.filter(d =>
    d.type === 'Direct Resource' || d.type === 'Indirect Resource'
  );
  const disruptorStars = details.filter(d =>
    d.type === 'Friend' || d.type === 'Rob Wealth'
  );

  reasoning.push(`Ten Gods: ${Array.from(tenGods.keys()).join(', ')}`);

  // ========================================
  // STEP 2: Determine career type
  // ========================================
  let careerType: CareerType = 'none';
  if (officerStars.some(s => s.type === 'Direct Officer') && officerStars.some(s => s.type === 'Seven Killings')) {
    careerType = 'mixed';
  } else if (officerStars.some(s => s.type === 'Direct Officer')) {
    careerType = 'officer';
  } else if (officerStars.some(s => s.type === 'Seven Killings')) {
    careerType = 'killings';
  } else if (outputStars.length > 0) {
    careerType = 'output';
  } else if (resourceStars.length > 0) {
    careerType = 'resource';
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
  const shensha = detectCareerShensha(
    timePillar,
    dmStem,
    natalPillars.yearBranch,
    natalPillars.dayBranch
  );

  if (shensha.length > 0) {
    reasoning.push(`Career Shen Sha: ${shensha.map(s => s.chineseName).join(', ')}`);
  }

  // ========================================
  // STEP 5: Detect conflicts
  // ========================================
  const conflicts = detectCareerConflicts(timePillar, natalPillars, officerElement);

  if (conflicts.length > 0) {
    reasoning.push(`Conflicts: ${conflicts.map(c => c.type).join(', ')}`);
  }

  // ========================================
  // STEP 6: Seasonal analysis
  // ========================================
  const seasonElement = getSeasonElement(monthBranch);
  const officerInSeason = officerElement === seasonElement;

  if (officerInSeason) {
    reasoning.push(`Officer element (${officerElement}) is in season`);
  }

  // ========================================
  // STEP 7: DM strength analysis
  // ========================================
  const dmContext = analyzeDMStrength(dmStrength);

  // ========================================
  // STEP 8: Calculate score
  // ========================================
  let score = 50; // Base score

  // Officer stars
  for (const star of officerStars) {
    const weight = CAREER_SCORING_WEIGHTS.officerStars[star.type as keyof typeof CAREER_SCORING_WEIGHTS.officerStars] || 0;
    score += weight * star.weight;
  }

  // Output stars
  for (const star of outputStars) {
    const weight = CAREER_SCORING_WEIGHTS.outputStars[star.type as keyof typeof CAREER_SCORING_WEIGHTS.outputStars] || 0;
    score += weight * star.weight;
  }

  // Resource stars
  for (const star of resourceStars) {
    const weight = CAREER_SCORING_WEIGHTS.resourceStars[star.type as keyof typeof CAREER_SCORING_WEIGHTS.resourceStars] || 0;
    score += weight * star.weight;
  }

  // Disruptor stars (negative)
  for (const star of disruptorStars) {
    const weight = CAREER_SCORING_WEIGHTS.disruptorStars[star.type as keyof typeof CAREER_SCORING_WEIGHTS.disruptorStars] || 0;
    score += weight * star.weight;
  }

  // Useful God activation
  if (usefulActivated.length > 0) {
    const bonus = usefulActivated.includes(officerElement)
      ? CAREER_SCORING_WEIGHTS.usefulGod.careerRelated
      : CAREER_SCORING_WEIGHTS.usefulGod.activated;
    score += bonus;
    reasoning.push(`Useful God bonus: +${bonus}`);
  }

  // Annoying God activation
  if (annoyingActivated.length > 0) {
    const penalty = annoyingActivated.includes(officerElement)
      ? CAREER_SCORING_WEIGHTS.annoyingGod.careerDisrupting
      : CAREER_SCORING_WEIGHTS.annoyingGod.activated;
    score += penalty;
    reasoning.push(`Annoying God penalty: ${penalty}`);
  }

  // Shen Sha bonuses
  let shenshaBonus = 0;
  for (const hit of shensha) {
    shenshaBonus += hit.weight * CAREER_SCORING_WEIGHTS.shensha.multiplier;
  }
  score += shenshaBonus;

  // Conflict penalties
  for (const conflict of conflicts) {
    const penalty = CAREER_SCORING_WEIGHTS.conflicts[conflict.type];
    score += conflict.affectsCareer ? penalty * 1.5 : penalty;
  }

  // DM strength adjustment
  const hasOfficer = officerStars.some(s => s.type === 'Direct Officer');
  const hasKillings = officerStars.some(s => s.type === 'Seven Killings');

  if (!dmContext.canHandleOfficer && hasOfficer) {
    score += CAREER_SCORING_WEIGHTS.dmStrength.weakWithOfficer;
    reasoning.push(`Weak DM struggles with Officer pressure`);
  }
  if (!dmContext.canHandleKillings && hasKillings) {
    score += CAREER_SCORING_WEIGHTS.dmStrength.weakWithKillings;
    reasoning.push(`Weak DM overwhelmed by Seven Killings`);
  }
  if (dmContext.canHandleOfficer && hasOfficer) {
    score += CAREER_SCORING_WEIGHTS.dmStrength.strongWithOfficer;
    reasoning.push(`Strong DM benefits from Officer energy`);
  }
  if (dmContext.canHandleKillings && hasKillings) {
    score += CAREER_SCORING_WEIGHTS.dmStrength.strongWithKillings;
    reasoning.push(`Strong DM channels Seven Killings energy`);
  }

  // Seasonal adjustment
  if (officerInSeason) {
    score += CAREER_SCORING_WEIGHTS.seasonal.officerInSeason;
  } else {
    score += CAREER_SCORING_WEIGHTS.seasonal.officerOutOfSeason;
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Determine tier
  const tier: CareerTier =
    score >= 80 ? 'excellent' :
    score >= 65 ? 'good' :
    score >= 45 ? 'neutral' :
    score >= 30 ? 'challenging' : 'difficult';

  reasoning.push(`Final score: ${score.toFixed(1)} (${tier})`);

  // ========================================
  // STEP 9: Generate summary and advice
  // ========================================
  const summary = generateCareerSummary(
    timeUnit, tier, careerType, officerStars, shensha, conflicts, dmContext
  );
  const advice = generateCareerAdvice(
    tier, careerType, officerStars, outputStars, resourceStars, disruptorStars, shensha, dmContext
  );

  // ========================================
  // STEP 10: Activity recommendations
  // ========================================
  const { suitableActivities, avoidActivities } = generateCareerActivities(
    tier, careerType, officerStars, outputStars, shensha, conflicts
  );

  return {
    timeUnit,
    date,
    pillar: timePillar,
    pillarDisplay: `${timePillar.stem}${timePillar.branch}`,
    score: Math.round(score),
    tier,
    careerType,
    officerStars,
    outputStars,
    resourceStars,
    disruptorStars,
    usefulActivated,
    annoyingActivated,
    transformations: [],
    conflicts,
    shensha,
    dmStrength: dmContext,
    seasonElement,
    officerInSeason,
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
 * Compute career timing for Luck Pillar (10-year cycle)
 */
export function computeCareerLuckPillarTiming(opts: {
  luckPillar: TimingPillar;
  startAge: number;
  endAge: number;
  natalPillars: NatalPillarsInput;
  usefulGod: ElementName;
  annoyingGod: ElementName;
  dmStrength: number;
}): CareerLuckPillarTiming {
  const baseResult = computeCareerTiming({
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
 * Compute yearly career timing
 */
export function computeCareerYearlyTiming(opts: {
  year: number;
  annualPillar: TimingPillar;
  natalPillars: NatalPillarsInput;
  usefulGod: ElementName;
  annoyingGod: ElementName;
  dmStrength: number;
}): CareerYearlyTiming {
  const baseResult = computeCareerTiming({
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
 * Compute monthly career timing
 */
export function computeCareerMonthlyTiming(opts: {
  year: number;
  month: number;
  monthPillar: TimingPillar;
  natalPillars: NatalPillarsInput;
  usefulGod: ElementName;
  annoyingGod: ElementName;
  dmStrength: number;
}): CareerMonthlyTiming {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const baseResult = computeCareerTiming({
    timeUnit: 'monthly',
    date: `${opts.year}-${String(opts.month).padStart(2, '0')}`,
    timePillar: opts.monthPillar,
    natalPillars: opts.natalPillars,
    usefulGod: opts.usefulGod,
    annoyingGod: opts.annoyingGod,
    dmStrength: opts.dmStrength,
    monthBranch: opts.monthPillar.branch
  });

  const careerForecast = generateCareerForecast(baseResult);

  return {
    ...baseResult,
    year: opts.year,
    month: opts.month,
    monthName: monthNames[opts.month - 1],
    careerForecast
  };
}

/**
 * Compute daily career timing
 */
export function computeCareerDailyTiming(opts: {
  year: number;
  month: number;
  day: number;
  dayPillar: TimingPillar;
  natalPillars: NatalPillarsInput;
  usefulGod: ElementName;
  annoyingGod: ElementName;
  dmStrength: number;
  monthBranch: string;
}): CareerDailyTiming {
  const dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(opts.year, opts.month - 1, opts.day);

  const baseResult = computeCareerTiming({
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
 * Compute hourly career timing
 */
export function computeCareerHourlyTiming(opts: {
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
}): CareerHourlyTiming {
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

  const baseResult = computeCareerTiming({
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

function generateCareerSummary(
  timeUnit: CareerTimingLayer,
  tier: CareerTier,
  careerType: CareerType,
  officerStars: CareerStarHit[],
  shensha: CareerShenshaHit[],
  conflicts: CareerConflictHit[],
  dmContext: DMStrengthContext
): string {
  const parts: string[] = [];

  const timeLabels: Record<CareerTimingLayer, string> = {
    luck_pillar: 'This decade',
    yearly: 'This year',
    monthly: 'This month',
    daily: 'Today',
    hourly: 'This hour'
  };

  const tierDescriptions: Record<CareerTier, string> = {
    excellent: 'brings exceptional career opportunities',
    good: 'supports professional growth',
    neutral: 'offers balanced career energy',
    challenging: 'requires careful career navigation',
    difficult: 'demands patience in career matters'
  };

  parts.push(`${timeLabels[timeUnit]} ${tierDescriptions[tier]}.`);

  // Career type
  if (careerType === 'officer') {
    parts.push('Focus on stable advancement and building authority.');
  } else if (careerType === 'killings') {
    parts.push('Opportunities through competitive pressure and bold moves.');
  } else if (careerType === 'mixed') {
    parts.push('Both stability and dynamic challenges present.');
  } else if (careerType === 'output') {
    parts.push('Career progress through creativity and performance.');
  } else if (careerType === 'resource') {
    parts.push('Career support through learning and credentials.');
  }

  // Shen Sha highlight
  const auspiciousShensha = shensha.filter(s => s.nature === 'auspicious');
  if (auspiciousShensha.length > 0) {
    parts.push(`${auspiciousShensha[0].chineseName} (${auspiciousShensha[0].name}) supports your career.`);
  }

  // DM context
  if (!dmContext.canHandleOfficer && officerStars.length > 0) {
    parts.push('Build support systems before taking on more responsibility.');
  }

  // Conflicts
  if (conflicts.some(c => c.affectsCareer)) {
    parts.push('Watch for disruptions to career stability.');
  }

  return parts.join(' ');
}

function generateCareerAdvice(
  tier: CareerTier,
  careerType: CareerType,
  officerStars: CareerStarHit[],
  outputStars: CareerStarHit[],
  resourceStars: CareerStarHit[],
  disruptorStars: CareerStarHit[],
  shensha: CareerShenshaHit[],
  dmContext: DMStrengthContext
): string {
  const advice: string[] = [];

  // Tier-based advice
  switch (tier) {
    case 'excellent':
      advice.push('Ideal timing for promotions, leadership roles, and major career decisions.');
      break;
    case 'good':
      advice.push('Good period for interviews, presentations, and expanding responsibilities.');
      break;
    case 'neutral':
      advice.push('Maintain current position. Build skills and relationships.');
      break;
    case 'challenging':
      advice.push('Focus on consolidation. Avoid confrontations with authority.');
      break;
    case 'difficult':
      advice.push('Stay low profile. Document work carefully. Wait for better timing.');
      break;
  }

  // Career type specific
  if (careerType === 'officer' && officerStars.length > 0) {
    advice.push('Seek recognition from superiors and formal advancement.');
  }
  if (careerType === 'killings' && officerStars.length > 0) {
    advice.push('Channel pressure into breakthrough achievements.');
  }
  if (outputStars.length > 0) {
    advice.push('Showcase your work and creative contributions.');
  }
  if (resourceStars.length > 0) {
    advice.push('Invest in learning and professional development.');
  }

  // Disruptor warning
  if (disruptorStars.length > 0) {
    advice.push('Be cautious of office politics and competition.');
  }

  // Shen Sha specific
  if (shensha.some(s => s.name === 'General Star')) {
    advice.push('Leadership opportunities are highlighted.');
  }
  if (shensha.some(s => s.name === 'Academic Star')) {
    advice.push('Examinations and certifications are favored.');
  }
  if (shensha.some(s => s.name === 'Traveling Horse')) {
    advice.push('Consider roles involving travel or relocation.');
  }

  // DM context
  if (!dmContext.canHandleOfficer) {
    advice.push('Build your support network before taking on more.');
  }

  return advice.slice(0, 3).join(' ');
}

function generateCareerActivities(
  tier: CareerTier,
  careerType: CareerType,
  officerStars: CareerStarHit[],
  outputStars: CareerStarHit[],
  shensha: CareerShenshaHit[],
  conflicts: CareerConflictHit[]
): { suitableActivities: string[]; avoidActivities: string[] } {
  const suitableActivities: string[] = [];
  const avoidActivities: string[] = [];

  // Tier-based
  if (tier === 'excellent' || tier === 'good') {
    suitableActivities.push('Job interviews', 'Promotion requests', 'Important presentations');
  }
  if (tier === 'neutral') {
    suitableActivities.push('Routine meetings', 'Skill development', 'Networking');
  }
  if (tier === 'challenging' || tier === 'difficult') {
    avoidActivities.push('Confronting superiors', 'Major career changes', 'High-stakes negotiations');
    suitableActivities.push('Documentation', 'Building alliances', 'Learning');
  }

  // Career type
  if (careerType === 'officer') {
    suitableActivities.push('Formal meetings', 'Policy discussions', 'Authority requests');
  }
  if (careerType === 'killings') {
    suitableActivities.push('Competitive bids', 'Bold initiatives', 'Problem-solving');
  }
  if (outputStars.length > 0) {
    suitableActivities.push('Creative presentations', 'Project proposals', 'Performance reviews');
  }

  // Shen Sha
  if (shensha.some(s => s.name === 'General Star')) {
    suitableActivities.push('Leadership meetings', 'Team management', 'Strategic planning');
  }
  if (shensha.some(s => s.name === 'Academic Star')) {
    suitableActivities.push('Exams', 'Certifications', 'Training programs');
  }
  if (shensha.some(s => s.name === 'Traveling Horse')) {
    suitableActivities.push('Business trips', 'Relocation discussions', 'International calls');
  }

  // Conflicts
  if (conflicts.some(c => c.affectsCareer)) {
    avoidActivities.push('Challenging authority', 'Risky proposals', 'Public confrontations');
  }

  return {
    suitableActivities: Array.from(new Set(suitableActivities)).slice(0, 5),
    avoidActivities: Array.from(new Set(avoidActivities)).slice(0, 4)
  };
}

function generateDecadeTheme(result: CareerTimingResult): string {
  if (result.tier === 'excellent') {
    return 'Peak career advancement period';
  } else if (result.tier === 'good') {
    return 'Steady professional growth phase';
  } else if (result.tier === 'neutral') {
    return 'Career consolidation phase';
  } else if (result.tier === 'challenging') {
    return 'Career restructuring phase';
  } else {
    return 'Career patience and preparation phase';
  }
}

function generateYearlyTheme(result: CareerTimingResult): string {
  if (result.officerStars.some(s => s.type === 'Direct Officer')) {
    return 'Authority and recognition year';
  } else if (result.officerStars.some(s => s.type === 'Seven Killings')) {
    return 'Competitive breakthrough year';
  } else if (result.outputStars.length > 0) {
    return 'Creative expression year';
  } else if (result.resourceStars.length > 0) {
    return 'Learning and development year';
  } else {
    return 'Foundation building year';
  }
}

function generateCareerForecast(result: CareerTimingResult): string {
  if (result.tier === 'excellent') {
    return 'Strong momentum. Pursue advancement opportunities.';
  } else if (result.tier === 'good') {
    return 'Positive energy. Good for meetings and presentations.';
  } else if (result.tier === 'neutral') {
    return 'Steady progress. Focus on routine responsibilities.';
  } else if (result.tier === 'challenging') {
    return 'Careful navigation needed. Avoid conflicts.';
  } else {
    return 'Low profile recommended. Focus on fundamentals.';
  }
}

function generateBestActionWindow(result: CareerTimingResult): string {
  if (result.tier === 'excellent' || result.tier === 'good') {
    return 'Morning (9-11am) for important meetings and decisions';
  } else if (result.tier === 'neutral') {
    return 'Mid-morning (10-11am) for routine career activities';
  } else {
    return 'Postpone major career decisions if possible';
  }
}

function determineActionType(result: CareerTimingResult): string {
  if (result.tier === 'excellent') {
    return 'Execute major initiatives';
  } else if (result.tier === 'good') {
    return 'Advance proposals';
  } else if (result.tier === 'neutral') {
    return 'Maintain progress';
  } else if (result.tier === 'challenging') {
    return 'Observe and adapt';
  } else {
    return 'Wait and prepare';
  }
}

// ============================================================================
// BEST TIMING FINDER
// ============================================================================

/**
 * Find best days for career activities in a given period
 */
export function findBestDaysForCareer(
  dailyTimings: CareerDailyTiming[],
  minTier: CareerTier = 'good',
  careerType?: CareerType
): CareerDailyTiming[] {
  const tierOrder: CareerTier[] = ['excellent', 'good', 'neutral', 'challenging', 'difficult'];
  const minTierIndex = tierOrder.indexOf(minTier);

  return dailyTimings
    .filter(d => tierOrder.indexOf(d.tier) <= minTierIndex)
    .filter(d => !careerType || d.careerType === careerType || d.careerType === 'mixed')
    .sort((a, b) => b.score - a.score);
}

/**
 * Find best hours for career activities on a given day
 */
export function findBestHoursForCareer(
  hourlyTimings: CareerHourlyTiming[],
  minTier: CareerTier = 'good'
): CareerHourlyTiming[] {
  const tierOrder: CareerTier[] = ['excellent', 'good', 'neutral', 'challenging', 'difficult'];
  const minTierIndex = tierOrder.indexOf(minTier);

  return hourlyTimings
    .filter(h => tierOrder.indexOf(h.tier) <= minTierIndex)
    .sort((a, b) => b.score - a.score);
}

// ============================================================================
// STORY/NARRATIVE BUILDER
// ============================================================================

/**
 * Build a narrative story for career timing
 */
export function buildCareerTimingStory(result: CareerTimingResult): string {
  const lines: string[] = [];

  // Header
  const timeLabel = result.timeUnit === 'luck_pillar' ? 'Decade' :
                    result.timeUnit === 'yearly' ? 'Year' :
                    result.timeUnit === 'monthly' ? 'Month' :
                    result.timeUnit === 'daily' ? 'Day' : 'Hour';

  lines.push(`## Career Timing — ${timeLabel} (官杀${result.timeUnit === 'luck_pillar' ? '大运' : result.timeUnit === 'yearly' ? '流年' : result.timeUnit === 'monthly' ? '流月' : result.timeUnit === 'daily' ? '流日' : '流时'})`);
  lines.push('');
  lines.push(`**${result.date || result.pillarDisplay}** — ${result.pillarDisplay}`);
  lines.push(`Score: ${result.score} (${result.tier.charAt(0).toUpperCase() + result.tier.slice(1)})`);
  lines.push(`Career Type: ${result.careerType}`);
  lines.push('');

  // Officer Stars
  if (result.officerStars.length > 0) {
    lines.push('### Officer Stars');
    for (const star of result.officerStars) {
      lines.push(`- ${star.type}: ${star.description}`);
    }
    lines.push('');
  }

  // Output Stars
  if (result.outputStars.length > 0) {
    lines.push('### Output Stars (Performance)');
    for (const star of result.outputStars) {
      lines.push(`- ${star.type}: ${star.description}`);
    }
    lines.push('');
  }

  // Resource Stars
  if (result.resourceStars.length > 0) {
    lines.push('### Resource Stars (Support)');
    for (const star of result.resourceStars) {
      lines.push(`- ${star.type}: ${star.description}`);
    }
    lines.push('');
  }

  // Shen Sha
  if (result.shensha.length > 0) {
    lines.push('### Career Shen Sha');
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
  computeCareerTiming,
  computeCareerLuckPillarTiming,
  computeCareerYearlyTiming,
  computeCareerMonthlyTiming,
  computeCareerDailyTiming,
  computeCareerHourlyTiming,

  // Analysis
  analyzeTenGods,
  getTenGod,
  detectCareerShensha,
  detectCareerConflicts,
  analyzeDMStrength,

  // Best timing finder
  findBestDaysForCareer,
  findBestHoursForCareer,

  // Story builder
  buildCareerTimingStory,

  // Constants
  CAREER_SCORING_WEIGHTS,
  CAREER_SHENSHA_DEFINITIONS,
  GENERAL_STAR_MAP,
  ACADEMIC_STAR_MAP,
  CANOPY_STAR_MAP,
  NOBLEMAN_MAP,
  TRAVELING_HORSE_MAP,
  GOAT_BLADE_MAP
};
