/**
 * ============================================================================
 * HOURLY LUCK FAVORABILITY ENGINE (流时喜忌)
 * ============================================================================
 *
 * This is the ATOMIC RESOLUTION timing layer of classical BaZi.
 * The finest granularity before we enter speculative territory.
 *
 * Classical practitioners use this layer for:
 * - Micro-event prediction
 * - Identifying "activation windows" within a single day
 * - Choosing the best hour for meetings, launches, travel, surgery, exams
 * - Detecting hour-level clashes, harms, punishments
 * - Hourly Useful God activation
 * - Hourly Shen Sha activation
 * - Hourly transformations
 * - Hourly DM strength modulation
 * - Ultra-fine relationship timing
 *
 * Each Hourly Pillar (流时) is evaluated considering:
 * - The CURRENT Luck Pillar context (大运环境)
 * - The CURRENT Annual Pillar context (流年环境)
 * - The CURRENT Monthly Pillar context (流月环境)
 * - The CURRENT Daily Pillar context (流日环境)
 * - Useful God (用神) activation
 * - Annoying God (忌神) activation
 * - Hour Clash (时冲) - important at hourly level
 * - Hour Officer (值时神) - classical hour selection system
 * - Conflicts with natal chart and all timing pillars
 * - Transformations at all levels
 * - Shen Sha activation (神煞)
 * - Quintuple compound effects (大运 + 流年 + 流月 + 流日 + 流时)
 *
 * Chinese Hours (时辰):
 * Each Chinese hour (时辰) spans 2 Western hours:
 * - 子时 (23:00-01:00) - Rat Hour
 * - 丑时 (01:00-03:00) - Ox Hour
 * - 寅时 (03:00-05:00) - Tiger Hour
 * - 卯时 (05:00-07:00) - Rabbit Hour
 * - 辰时 (07:00-09:00) - Dragon Hour
 * - 巳时 (09:00-11:00) - Snake Hour
 * - 午时 (11:00-13:00) - Horse Hour
 * - 未时 (13:00-15:00) - Goat Hour
 * - 申时 (15:00-17:00) - Monkey Hour
 * - 酉时 (17:00-19:00) - Rooster Hour
 * - 戌时 (19:00-21:00) - Dog Hour
 * - 亥时 (21:00-23:00) - Pig Hour
 *
 * Hour Stem Calculation (五鼠遁 - Five Rat Escape):
 * The hour stem is derived from the day stem:
 * - 甲/己 day → Hour 子 starts with 甲
 * - 乙/庚 day → Hour 子 starts with 丙
 * - 丙/辛 day → Hour 子 starts with 戊
 * - 丁/壬 day → Hour 子 starts with 庚
 * - 戊/癸 day → Hour 子 starts with 壬
 *
 * Joey Yap teaching:
 * "The hourly pillar is like the second hand on a cosmic clock.
 *  It reveals the micro-rhythms within each day. Master this,
 *  and you can pinpoint the exact moment for maximum impact."
 *
 * Created: January 2026
 * Based on: Classical BaZi Hourly Pillar (流时) doctrine, Joey Yap methodology
 * ============================================================================
 */

import { UsefulGodResult, ElementName } from './baziUsefulGod';
import {
  FavorabilityTier,
  NatalPillarsInput,
  ConflictTrigger,
  TransformationTrigger,
  ShenshaTrigger,
  STEM_TO_ELEMENT,
  BRANCH_TO_ELEMENT,
  STEM_POLARITY
} from './baziLuckFavorability';
import { CurrentLuckPillarContext } from './baziAnnualFavorability';
import { CurrentAnnualContext } from './baziMonthlyFavorability';
import { CurrentMonthlyContext } from './baziDailyFavorability';

// Re-export for convenience
export { STEM_TO_ELEMENT, BRANCH_TO_ELEMENT, STEM_POLARITY };

// ============================================================================
// TYPES
// ============================================================================

export interface HourlyPillarInput {
  hourIndex: number;      // 0-11 (子时 to 亥时)
  stem: string;           // 时干
  branch: string;         // 时支
}

export interface CurrentDailyContext {
  year: number;
  month: number;
  day: number;
  stem: string;
  branch: string;
  tier: FavorabilityTier;
  score: number;
}

export interface QuintupleCompoundEffect {
  type: 'quintuple_synergy' | 'quadruple_synergy' | 'triple_synergy' | 'double_synergy' |
        'double_conflict' | 'triple_conflict' | 'quadruple_conflict' | 'quintuple_conflict' |
        'mixed' | 'neutral';
  description: string;
  scoreModifier: number;
  layers: {
    luckPillar: 'supportive' | 'challenging' | 'neutral';
    annual: 'supportive' | 'challenging' | 'neutral';
    monthly: 'supportive' | 'challenging' | 'neutral';
    daily: 'supportive' | 'challenging' | 'neutral';
    hourly: 'supportive' | 'challenging' | 'neutral';
  };
}

export interface HourOfficerInfo {
  name: string;
  chineseName: string;
  nature: 'auspicious' | 'inauspicious' | 'neutral';
  suitableFor: string[];
  avoidFor: string[];
  description: string;
}

export interface HourClashInfo {
  hasClash: boolean;
  clashWith: string | null;
  clashPillar: string | null;
  severity: 'major' | 'moderate' | 'minor' | null;
  description: string;
}

export interface ChineseHourInfo {
  index: number;          // 0-11
  branch: string;         // 时支
  chineseName: string;    // e.g., "子时"
  englishName: string;    // e.g., "Rat Hour"
  animal: string;         // e.g., "Rat"
  startTime: string;      // e.g., "23:00"
  endTime: string;        // e.g., "01:00"
  element: ElementName;
}

export interface HourlyLuckFavorability {
  // Basic info
  hourIndex: number;
  stem: string;
  branch: string;
  pillarDisplay: string;
  hourInfo: ChineseHourInfo;

  // Scoring
  score: number;          // 0-100
  tier: FavorabilityTier;
  confidence: number;     // 0-1

  // Element analysis
  stemElement: ElementName;
  branchElement: ElementName;
  stemUseful: boolean;
  stemAnnoying: boolean;
  branchUseful: boolean;
  branchAnnoying: boolean;

  // Activations
  usefulActivated: ElementName[];
  annoyingActivated: ElementName[];

  // Hour-specific features
  hourOfficer: HourOfficerInfo;
  hourClash: HourClashInfo;

  // Interactions with natal chart
  natalConflicts: ConflictTrigger[];
  natalTransformations: TransformationTrigger[];

  // Interactions with timing pillars
  luckPillarConflicts: ConflictTrigger[];
  luckPillarTransformations: TransformationTrigger[];
  annualConflicts: ConflictTrigger[];
  annualTransformations: TransformationTrigger[];
  monthlyConflicts: ConflictTrigger[];
  monthlyTransformations: TransformationTrigger[];
  dailyConflicts: ConflictTrigger[];
  dailyTransformations: TransformationTrigger[];

  // Quintuple compound effects (luck + annual + monthly + daily + hourly)
  quintupleCompound: QuintupleCompoundEffect;

  // Shen Sha
  shensha: ShenshaTrigger[];

  // DM impact
  dmStrengthDelta: number;
  dmImpact: 'strengthens' | 'weakens' | 'neutral';

  // Context
  luckPillarContext: CurrentLuckPillarContext | null;
  annualContext: CurrentAnnualContext | null;
  monthlyContext: CurrentMonthlyContext | null;
  dailyContext: CurrentDailyContext | null;

  // Narrative
  reasoning: string[];
  summary: string;
  advice: string;

  // Activity recommendations
  suitableActivities: string[];
  avoidActivities: string[];
}

export interface DailyHoursResult {
  date: string;
  dayStem: string;
  hours: HourlyLuckFavorability[];
  bestHour: HourlyLuckFavorability | null;
  worstHour: HourlyLuckFavorability | null;
  currentHour: HourlyLuckFavorability | null;
  morningPattern: string;
  afternoonPattern: string;
  eveningPattern: string;
  daySummary: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * Chinese hour information (12 时辰)
 * Note: 子时 spans midnight (23:00-01:00)
 */
const CHINESE_HOURS: ChineseHourInfo[] = [
  { index: 0,  branch: '子', chineseName: '子时', englishName: 'Rat Hour',     animal: 'Rat',     startTime: '23:00', endTime: '01:00', element: 'Water' },
  { index: 1,  branch: '丑', chineseName: '丑时', englishName: 'Ox Hour',      animal: 'Ox',      startTime: '01:00', endTime: '03:00', element: 'Earth' },
  { index: 2,  branch: '寅', chineseName: '寅时', englishName: 'Tiger Hour',   animal: 'Tiger',   startTime: '03:00', endTime: '05:00', element: 'Wood' },
  { index: 3,  branch: '卯', chineseName: '卯时', englishName: 'Rabbit Hour',  animal: 'Rabbit',  startTime: '05:00', endTime: '07:00', element: 'Wood' },
  { index: 4,  branch: '辰', chineseName: '辰时', englishName: 'Dragon Hour',  animal: 'Dragon',  startTime: '07:00', endTime: '09:00', element: 'Earth' },
  { index: 5,  branch: '巳', chineseName: '巳时', englishName: 'Snake Hour',   animal: 'Snake',   startTime: '09:00', endTime: '11:00', element: 'Fire' },
  { index: 6,  branch: '午', chineseName: '午时', englishName: 'Horse Hour',   animal: 'Horse',   startTime: '11:00', endTime: '13:00', element: 'Fire' },
  { index: 7,  branch: '未', chineseName: '未时', englishName: 'Goat Hour',    animal: 'Goat',    startTime: '13:00', endTime: '15:00', element: 'Earth' },
  { index: 8,  branch: '申', chineseName: '申时', englishName: 'Monkey Hour',  animal: 'Monkey',  startTime: '15:00', endTime: '17:00', element: 'Metal' },
  { index: 9,  branch: '酉', chineseName: '酉时', englishName: 'Rooster Hour', animal: 'Rooster', startTime: '17:00', endTime: '19:00', element: 'Metal' },
  { index: 10, branch: '戌', chineseName: '戌时', englishName: 'Dog Hour',     animal: 'Dog',     startTime: '19:00', endTime: '21:00', element: 'Earth' },
  { index: 11, branch: '亥', chineseName: '亥时', englishName: 'Pig Hour',     animal: 'Pig',     startTime: '21:00', endTime: '23:00', element: 'Water' }
];

// ============================================================================
// HOUR OFFICER SYSTEM (值时神)
// ============================================================================

/**
 * The Twelve Hour Officers (值时神)
 * Classical hour selection system - cycles through the 12 hours
 */
const HOUR_OFFICERS: HourOfficerInfo[] = [
  {
    name: 'Establish',
    chineseName: '建',
    nature: 'auspicious',
    suitableFor: ['Starting important tasks', 'Initiating projects', 'Making plans'],
    avoidFor: ['Rest', 'Passive activities'],
    description: 'Hour of establishment. Good for starting things.'
  },
  {
    name: 'Remove',
    chineseName: '除',
    nature: 'auspicious',
    suitableFor: ['Cleaning', 'Decluttering', 'Breaking bad habits', 'Medical treatments'],
    avoidFor: ['Starting new ventures'],
    description: 'Hour of removal. Good for cleansing activities.'
  },
  {
    name: 'Full',
    chineseName: '满',
    nature: 'auspicious',
    suitableFor: ['Celebrations', 'Signing contracts', 'Receiving', 'Completion'],
    avoidFor: ['Funerals', 'Surgery'],
    description: 'Hour of fullness. Peak positive energy.'
  },
  {
    name: 'Balance',
    chineseName: '平',
    nature: 'neutral',
    suitableFor: ['Routine tasks', 'Maintenance', 'Regular work'],
    avoidFor: ['Major decisions', 'Important meetings'],
    description: 'Hour of balance. Neutral energy for ordinary activities.'
  },
  {
    name: 'Stable',
    chineseName: '定',
    nature: 'auspicious',
    suitableFor: ['Negotiations', 'Commitments', 'Important meetings', 'Contracts'],
    avoidFor: ['Travel', 'Movement'],
    description: 'Hour of stability. Excellent for settling matters.'
  },
  {
    name: 'Initiate',
    chineseName: '执',
    nature: 'neutral',
    suitableFor: ['Follow-through', 'Execution', 'Legal matters'],
    avoidFor: ['Creative work', 'Brainstorming'],
    description: 'Hour of execution. Good for following through on plans.'
  },
  {
    name: 'Destruction',
    chineseName: '破',
    nature: 'inauspicious',
    suitableFor: ['Breaking things down', 'Demolition', 'Ending relationships'],
    avoidFor: ['Starting anything', 'Important meetings', 'Contracts'],
    description: 'Hour of destruction. Avoid starting important matters.'
  },
  {
    name: 'Danger',
    chineseName: '危',
    nature: 'inauspicious',
    suitableFor: ['Caution', 'Reflection', 'Prayer'],
    avoidFor: ['Travel', 'Surgery', 'Risky activities', 'Major decisions'],
    description: 'Hour of danger. Proceed with extreme caution.'
  },
  {
    name: 'Success',
    chineseName: '成',
    nature: 'auspicious',
    suitableFor: ['Completing tasks', 'Signing deals', 'Achievements', 'Interviews'],
    avoidFor: ['Litigation'],
    description: 'Hour of success. Highly favorable for achievements.'
  },
  {
    name: 'Receive',
    chineseName: '收',
    nature: 'auspicious',
    suitableFor: ['Collecting payments', 'Receiving', 'Harvesting results'],
    avoidFor: ['Giving away', 'Charity'],
    description: 'Hour of receiving. Good for collecting what is owed.'
  },
  {
    name: 'Open',
    chineseName: '开',
    nature: 'auspicious',
    suitableFor: ['Openings', 'Launches', 'Travel', 'Starting journeys', 'Meetings'],
    avoidFor: ['Funerals'],
    description: 'Hour of opening. Excellent for new beginnings.'
  },
  {
    name: 'Close',
    chineseName: '闭',
    nature: 'inauspicious',
    suitableFor: ['Rest', 'Meditation', 'Closing matters'],
    avoidFor: ['Starting things', 'Travel', 'Important calls'],
    description: 'Hour of closure. Not suitable for new activities.'
  }
];

// ============================================================================
// CONFLICT/TRANSFORMATION PAIRS
// ============================================================================

const CLASH_PAIRS: Record<string, string> = {
  '子': '午', '午': '子',
  '丑': '未', '未': '丑',
  '寅': '申', '申': '寅',
  '卯': '酉', '酉': '卯',
  '辰': '戌', '戌': '辰',
  '巳': '亥', '亥': '巳'
};

const HARM_PAIRS: Record<string, string> = {
  '子': '未', '未': '子',
  '丑': '午', '午': '丑',
  '寅': '巳', '巳': '寅',
  '卯': '辰', '辰': '卯',
  '申': '亥', '亥': '申',
  '酉': '戌', '戌': '酉'
};

const DESTRUCTION_PAIRS: Record<string, string> = {
  '子': '酉', '酉': '子',
  '午': '卯', '卯': '午',
  '辰': '丑', '丑': '辰',
  '戌': '未', '未': '戌',
  '寅': '亥', '亥': '寅',
  '巳': '申', '申': '巳'
};

const SIX_COMBINATIONS: Record<string, { partner: string; result: ElementName }> = {
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

// ============================================================================
// SCORING WEIGHTS (Hourly-specific - smallest of all layers)
// ============================================================================

const HOURLY_SCORING_WEIGHTS = {
  // Useful/Annoying God (smallest impact - micro fluctuations)
  usefulStem: 5,
  usefulBranch: 4,
  annoyingStem: -5,
  annoyingBranch: -4,

  // Hour Officer (important for hour selection)
  hourOfficerAuspicious: 4,
  hourOfficerInauspicious: -4,
  hourOfficerNeutral: 0,

  // Hour Clash
  hourClashMajor: -8,      // Clash with natal Hour Branch
  hourClashModerate: -5,   // Clash with natal Day Branch
  hourClashMinor: -3,      // Clash with other natal branches

  // Conflicts with natal
  natalClashMajor: -4,
  natalClashModerate: -3,
  natalClashMinor: -1,
  natalHarmMajor: -3,
  natalHarmModerate: -2,
  natalHarmMinor: -1,
  natalDestructionAny: -1,

  // Conflicts with timing pillars
  luckClash: -3,
  luckHarm: -2,
  annualClash: -3,
  annualHarm: -1,
  monthlyClash: -2,
  monthlyHarm: -1,
  dailyClash: -4,    // Daily clash is more relevant at hourly level
  dailyHarm: -2,

  // Quintuple compound effects
  quintupleSynergy: 25,
  quadrupleSynergy: 18,
  tripleSynergy: 10,
  doubleSynergy: 5,
  doubleConflict: -5,
  tripleConflict: -8,
  quadrupleConflict: -12,
  quintupleConflict: -18,

  // Transformations
  transformationPositive: 3,
  transformationNeutral: 1,

  // Shen Sha
  shenshaPositive: 2,
  shenshaNegative: -2,

  // DM adjustment
  dmSupport: 1,
  dmDrain: -1
};

// ============================================================================
// HOURLY PILLAR CALCULATION
// ============================================================================

/**
 * Calculate the hour stem using the 五鼠遁 (Five Rat Escape) formula
 *
 * The formula determines which stem starts the Rat Hour (子时) based on the day stem:
 * - 甲/己 day → 子时 starts with 甲
 * - 乙/庚 day → 子时 starts with 丙
 * - 丙/辛 day → 子时 starts with 戊
 * - 丁/壬 day → 子时 starts with 庚
 * - 戊/癸 day → 子时 starts with 壬
 */
export function getHourStem(dayStem: string, hourIndex: number): string {
  // Starting stem for Rat Hour (子时) based on day stem
  const FIVE_RAT_MAP: Record<string, number> = {
    '甲': 0,  // 甲 (index 0)
    '己': 0,
    '乙': 2,  // 丙 (index 2)
    '庚': 2,
    '丙': 4,  // 戊 (index 4)
    '辛': 4,
    '丁': 6,  // 庚 (index 6)
    '壬': 6,
    '戊': 8,  // 壬 (index 8)
    '癸': 8
  };

  const startIndex = FIVE_RAT_MAP[dayStem] ?? 0;
  const stemIndex = (startIndex + hourIndex) % 10;

  return STEMS[stemIndex];
}

/**
 * Get the hour branch (fixed for each hour)
 */
export function getHourBranch(hourIndex: number): string {
  return BRANCHES[hourIndex];
}

/**
 * Get complete hourly pillar
 */
export function getHourlyPillar(dayStem: string, hourIndex: number): { stem: string; branch: string } {
  return {
    stem: getHourStem(dayStem, hourIndex),
    branch: getHourBranch(hourIndex)
  };
}

/**
 * Get Chinese hour info
 */
export function getChineseHourInfo(hourIndex: number): ChineseHourInfo {
  return CHINESE_HOURS[hourIndex];
}

/**
 * Convert Western hour to Chinese hour index
 * Note: 子时 (Rat Hour) spans 23:00-01:00
 */
export function westernToChineseHour(hour: number): number {
  // Handle the special case of 子时 spanning midnight
  if (hour >= 23 || hour < 1) return 0;  // 子时
  if (hour >= 1 && hour < 3) return 1;   // 丑时
  if (hour >= 3 && hour < 5) return 2;   // 寅时
  if (hour >= 5 && hour < 7) return 3;   // 卯时
  if (hour >= 7 && hour < 9) return 4;   // 辰时
  if (hour >= 9 && hour < 11) return 5;  // 巳时
  if (hour >= 11 && hour < 13) return 6; // 午时
  if (hour >= 13 && hour < 15) return 7; // 未时
  if (hour >= 15 && hour < 17) return 8; // 申时
  if (hour >= 17 && hour < 19) return 9; // 酉时
  if (hour >= 19 && hour < 21) return 10; // 戌时
  return 11; // 亥时 (21:00-23:00)
}

/**
 * Get Hour Officer for a given hour
 */
export function getHourOfficer(hourIndex: number, dayBranch: string): HourOfficerInfo {
  // Hour Officer cycles based on the relationship between day branch and hour branch
  const dayBranchIndex = BRANCHES.indexOf(dayBranch);
  const officerIndex = ((hourIndex - dayBranchIndex) % 12 + 12) % 12;

  return HOUR_OFFICERS[officerIndex];
}

/**
 * Calculate Hour Clash with natal chart
 */
function calculateHourClash(
  hourBranch: string,
  natalPillars: NatalPillarsInput
): HourClashInfo {
  const clashPartner = CLASH_PAIRS[hourBranch];

  if (!clashPartner) {
    return {
      hasClash: false,
      clashWith: null,
      clashPillar: null,
      severity: null,
      description: 'No hour clash.'
    };
  }

  // Check each natal pillar for clash - Hour pillar clash with natal Hour is most significant
  if (natalPillars.hourBranch === clashPartner) {
    return {
      hasClash: true,
      clashWith: clashPartner,
      clashPillar: 'Hour',
      severity: 'major',
      description: `${hourBranch}${clashPartner}冲 - Hour clashes with your natal Hour Branch! Impact on investments and children.`
    };
  }

  if (natalPillars.dayBranch === clashPartner) {
    return {
      hasClash: true,
      clashWith: clashPartner,
      clashPillar: 'Day',
      severity: 'moderate',
      description: `${hourBranch}${clashPartner}冲 - Hour clashes with natal Day Branch. Impact on self and spouse.`
    };
  }

  if (natalPillars.monthBranch === clashPartner) {
    return {
      hasClash: true,
      clashWith: clashPartner,
      clashPillar: 'Month',
      severity: 'minor',
      description: `${hourBranch}${clashPartner}冲 - Hour clashes with natal Month Branch. Career/parent friction.`
    };
  }

  if (natalPillars.yearBranch === clashPartner) {
    return {
      hasClash: true,
      clashWith: clashPartner,
      clashPillar: 'Year',
      severity: 'minor',
      description: `${hourBranch}${clashPartner}冲 - Hour clashes with natal Year Branch. Social/ancestral friction.`
    };
  }

  return {
    hasClash: false,
    clashWith: null,
    clashPillar: null,
    severity: null,
    description: 'No hour clash with natal chart.'
  };
}

// ============================================================================
// MAIN COMPUTATION FUNCTION
// ============================================================================

/**
 * Compute favorability of a single Hourly Pillar
 */
export function computeHourlyLuckFavorability(
  hourly: HourlyPillarInput,
  natalPillars: NatalPillarsInput,
  usefulGodResult: UsefulGodResult,
  dayMasterElement: ElementName,
  dmStrength: number,
  dayBranch: string,
  luckPillarContext?: CurrentLuckPillarContext,
  annualContext?: CurrentAnnualContext,
  monthlyContext?: CurrentMonthlyContext,
  dailyContext?: CurrentDailyContext
): HourlyLuckFavorability {
  const { hourIndex, stem, branch } = hourly;
  const reasoning: string[] = [];

  // ========================================
  // STEP 1: Get element information
  // ========================================
  const stemElement = STEM_TO_ELEMENT[stem] || 'Earth';
  const branchElement = BRANCH_TO_ELEMENT[branch] || 'Earth';
  const hourInfo = getChineseHourInfo(hourIndex);

  reasoning.push(`🕐 Hourly Pillar: ${hourInfo.chineseName} (${hourInfo.startTime}-${hourInfo.endTime}) - ${stem}${branch}`);
  reasoning.push(`   Stem: ${stem} → ${stemElement}`);
  reasoning.push(`   Branch: ${branch} → ${branchElement} (${hourInfo.animal})`);

  if (dailyContext) {
    reasoning.push(`   Daily: ${dailyContext.stem}${dailyContext.branch} (${dailyContext.tier})`);
  }
  if (monthlyContext) {
    reasoning.push(`   Monthly: ${monthlyContext.stem}${monthlyContext.branch} (${monthlyContext.tier})`);
  }

  // ========================================
  // STEP 2: Hour Officer (值时神)
  // ========================================
  const hourOfficer = getHourOfficer(hourIndex, dayBranch);

  reasoning.push(``);
  reasoning.push(`📜 Hour Officer: ${hourOfficer.chineseName} (${hourOfficer.name}) - ${hourOfficer.nature.toUpperCase()}`);
  reasoning.push(`   ${hourOfficer.description}`);

  // ========================================
  // STEP 3: Hour Clash (时冲)
  // ========================================
  const hourClash = calculateHourClash(branch, natalPillars);

  if (hourClash.hasClash) {
    reasoning.push(``);
    reasoning.push(`⚡ HOUR CLASH DETECTED: ${hourClash.severity?.toUpperCase()}`);
    reasoning.push(`   ${hourClash.description}`);
  }

  // ========================================
  // STEP 4: Useful/Annoying God activation
  // ========================================
  const stemUseful = usefulGodResult.usefulElements.includes(stemElement);
  const stemAnnoying = usefulGodResult.annoyingElements.includes(stemElement);
  const branchUseful = usefulGodResult.usefulElements.includes(branchElement);
  const branchAnnoying = usefulGodResult.annoyingElements.includes(branchElement);

  const usefulActivated: ElementName[] = [];
  const annoyingActivated: ElementName[] = [];

  if (stemUseful) usefulActivated.push(stemElement);
  if (branchUseful && !usefulActivated.includes(branchElement)) {
    usefulActivated.push(branchElement);
  }
  if (stemAnnoying) annoyingActivated.push(stemElement);
  if (branchAnnoying && !annoyingActivated.includes(branchElement)) {
    annoyingActivated.push(branchElement);
  }

  reasoning.push(``);
  reasoning.push(`⚖️ Useful God Analysis:`);
  if (usefulActivated.length > 0) {
    reasoning.push(`   ✅ Useful activated: ${usefulActivated.join(', ')}`);
  } else {
    reasoning.push(`   ○ No Useful God elements this hour`);
  }
  if (annoyingActivated.length > 0) {
    reasoning.push(`   ❌ Annoying activated: ${annoyingActivated.join(', ')}`);
  }

  // ========================================
  // STEP 5: Detect conflicts with natal chart
  // ========================================
  const natalConflicts: ConflictTrigger[] = [];
  const natalBranches = [
    { name: 'Year', branch: natalPillars.yearBranch },
    { name: 'Month', branch: natalPillars.monthBranch },
    { name: 'Day', branch: natalPillars.dayBranch },
    { name: 'Hour', branch: natalPillars.hourBranch }
  ];

  for (const natal of natalBranches) {
    if (CLASH_PAIRS[branch] === natal.branch) {
      const severity = natal.name === 'Hour' ? 'major' : (natal.name === 'Day' ? 'moderate' : 'minor');
      natalConflicts.push({
        type: 'clash',
        withPillar: natal.name,
        branches: [branch, natal.branch],
        severity,
        description: `${branch}${natal.branch}冲 - Hour clashes ${natal.name} Pillar`
      });
    }

    if (HARM_PAIRS[branch] === natal.branch) {
      const severity = natal.name === 'Hour' ? 'moderate' : 'minor';
      natalConflicts.push({
        type: 'harm',
        withPillar: natal.name,
        branches: [branch, natal.branch],
        severity,
        description: `${branch}${natal.branch}害 - Hour harms ${natal.name} Pillar`
      });
    }

    if (DESTRUCTION_PAIRS[branch] === natal.branch) {
      natalConflicts.push({
        type: 'destruction',
        withPillar: natal.name,
        branches: [branch, natal.branch],
        severity: 'minor',
        description: `${branch}${natal.branch}破 - Hour breaks ${natal.name} Pillar`
      });
    }
  }

  if (natalConflicts.length > 0) {
    reasoning.push(``);
    reasoning.push(`⚔️ Natal Conflicts:`);
    natalConflicts.forEach(c => {
      reasoning.push(`   ${c.severity.toUpperCase()}: ${c.description}`);
    });
  }

  // ========================================
  // STEP 6: Detect conflicts with all timing pillars
  // ========================================
  const luckPillarConflicts: ConflictTrigger[] = [];
  const luckPillarTransformations: TransformationTrigger[] = [];
  const annualConflicts: ConflictTrigger[] = [];
  const annualTransformations: TransformationTrigger[] = [];
  const monthlyConflicts: ConflictTrigger[] = [];
  const monthlyTransformations: TransformationTrigger[] = [];
  const dailyConflicts: ConflictTrigger[] = [];
  const dailyTransformations: TransformationTrigger[] = [];

  // Check luck pillar
  if (luckPillarContext) {
    const lpBranch = luckPillarContext.branch;
    if (CLASH_PAIRS[branch] === lpBranch) {
      luckPillarConflicts.push({
        type: 'clash',
        withPillar: 'Luck',
        branches: [branch, lpBranch],
        severity: 'moderate',
        description: `${branch}${lpBranch}冲 - Hour clashes Luck Pillar`
      });
    }
    const lpCombination = SIX_COMBINATIONS[branch];
    if (lpCombination && lpBranch === lpCombination.partner) {
      luckPillarTransformations.push({
        type: 'Six Combination (六合)',
        pillarsInvolved: [`Hour:${branch}`, `Luck:${lpBranch}`],
        resultElement: lpCombination.result,
        description: `${branch}${lpBranch}合 → ${lpCombination.result}`
      });
    }
  }

  // Check annual pillar
  if (annualContext) {
    const annualBranch = annualContext.branch;
    if (CLASH_PAIRS[branch] === annualBranch) {
      annualConflicts.push({
        type: 'clash',
        withPillar: 'Annual',
        branches: [branch, annualBranch],
        severity: 'moderate',
        description: `${branch}${annualBranch}冲 - Hour clashes Annual Pillar`
      });
    }
    const annualCombination = SIX_COMBINATIONS[branch];
    if (annualCombination && annualBranch === annualCombination.partner) {
      annualTransformations.push({
        type: 'Six Combination (六合)',
        pillarsInvolved: [`Hour:${branch}`, `Annual:${annualBranch}`],
        resultElement: annualCombination.result,
        description: `${branch}${annualBranch}合 → ${annualCombination.result}`
      });
    }
  }

  // Check monthly pillar
  if (monthlyContext) {
    const monthlyBranch = monthlyContext.branch;
    if (CLASH_PAIRS[branch] === monthlyBranch) {
      monthlyConflicts.push({
        type: 'clash',
        withPillar: 'Monthly',
        branches: [branch, monthlyBranch],
        severity: 'moderate',
        description: `${branch}${monthlyBranch}冲 - Hour clashes Monthly Pillar`
      });
    }
    const monthlyCombination = SIX_COMBINATIONS[branch];
    if (monthlyCombination && monthlyBranch === monthlyCombination.partner) {
      monthlyTransformations.push({
        type: 'Six Combination (六合)',
        pillarsInvolved: [`Hour:${branch}`, `Monthly:${monthlyBranch}`],
        resultElement: monthlyCombination.result,
        description: `${branch}${monthlyBranch}合 → ${monthlyCombination.result}`
      });
    }
  }

  // Check daily pillar
  if (dailyContext) {
    const dailyBranch = dailyContext.branch;
    if (CLASH_PAIRS[branch] === dailyBranch) {
      dailyConflicts.push({
        type: 'clash',
        withPillar: 'Daily',
        branches: [branch, dailyBranch],
        severity: 'major',
        description: `${branch}${dailyBranch}冲 - Hour CLASHES with Daily Pillar!`
      });
    }
    const dailyCombination = SIX_COMBINATIONS[branch];
    if (dailyCombination && dailyBranch === dailyCombination.partner) {
      dailyTransformations.push({
        type: 'Six Combination (六合)',
        pillarsInvolved: [`Hour:${branch}`, `Daily:${dailyBranch}`],
        resultElement: dailyCombination.result,
        description: `${branch}${dailyBranch}合 → ${dailyCombination.result}`
      });
    }
  }

  // ========================================
  // STEP 7: Detect transformations with natal
  // ========================================
  const natalTransformations: TransformationTrigger[] = [];

  const combination = SIX_COMBINATIONS[branch];
  if (combination) {
    for (const natal of natalBranches) {
      if (natal.branch === combination.partner) {
        natalTransformations.push({
          type: 'Six Combination (六合)',
          pillarsInvolved: [`Hour:${branch}`, `${natal.name}:${natal.branch}`],
          resultElement: combination.result,
          description: `${branch}${natal.branch}合 → ${combination.result}`
        });
      }
    }
  }

  const allTransformations = [
    ...natalTransformations,
    ...luckPillarTransformations,
    ...annualTransformations,
    ...monthlyTransformations,
    ...dailyTransformations
  ];

  if (allTransformations.length > 0) {
    reasoning.push(``);
    reasoning.push(`🔄 Transformations:`);
    allTransformations.forEach(t => {
      reasoning.push(`   ${t.description}`);
    });
  }

  // ========================================
  // STEP 8: Quintuple compound effect analysis
  // ========================================
  let quintupleCompound: QuintupleCompoundEffect = {
    type: 'neutral',
    description: 'Standard hourly energy - no special compound effects.',
    scoreModifier: 0,
    layers: {
      luckPillar: 'neutral',
      annual: 'neutral',
      monthly: 'neutral',
      daily: 'neutral',
      hourly: 'neutral'
    }
  };

  if (luckPillarContext && annualContext && monthlyContext && dailyContext) {
    const lpStemElement = STEM_TO_ELEMENT[luckPillarContext.stem];
    const lpBranchElement = BRANCH_TO_ELEMENT[luckPillarContext.branch];
    const annualStemElement = STEM_TO_ELEMENT[annualContext.stem];
    const annualBranchElement = BRANCH_TO_ELEMENT[annualContext.branch];
    const monthlyStemElement = STEM_TO_ELEMENT[monthlyContext.stem];
    const monthlyBranchElement = BRANCH_TO_ELEMENT[monthlyContext.branch];
    const dailyStemElement = STEM_TO_ELEMENT[dailyContext.stem];
    const dailyBranchElement = BRANCH_TO_ELEMENT[dailyContext.branch];

    // Evaluate each layer
    const lpUseful = usefulGodResult.usefulElements.includes(lpStemElement) ||
                     usefulGodResult.usefulElements.includes(lpBranchElement);
    const lpAnnoying = usefulGodResult.annoyingElements.includes(lpStemElement) ||
                       usefulGodResult.annoyingElements.includes(lpBranchElement);

    const annualUseful = usefulGodResult.usefulElements.includes(annualStemElement) ||
                         usefulGodResult.usefulElements.includes(annualBranchElement);
    const annualAnnoying = usefulGodResult.annoyingElements.includes(annualStemElement) ||
                           usefulGodResult.annoyingElements.includes(annualBranchElement);

    const monthlyUseful = usefulGodResult.usefulElements.includes(monthlyStemElement) ||
                          usefulGodResult.usefulElements.includes(monthlyBranchElement);
    const monthlyAnnoying = usefulGodResult.annoyingElements.includes(monthlyStemElement) ||
                            usefulGodResult.annoyingElements.includes(monthlyBranchElement);

    const dailyUseful = usefulGodResult.usefulElements.includes(dailyStemElement) ||
                        usefulGodResult.usefulElements.includes(dailyBranchElement);
    const dailyAnnoying = usefulGodResult.annoyingElements.includes(dailyStemElement) ||
                          usefulGodResult.annoyingElements.includes(dailyBranchElement);

    const hourlyUseful = stemUseful || branchUseful;
    const hourlyAnnoying = stemAnnoying || branchAnnoying;

    // Determine layer status
    const lpStatus: 'supportive' | 'challenging' | 'neutral' =
      lpUseful && !lpAnnoying ? 'supportive' :
      lpAnnoying && !lpUseful ? 'challenging' : 'neutral';

    const annualStatus: 'supportive' | 'challenging' | 'neutral' =
      annualUseful && !annualAnnoying ? 'supportive' :
      annualAnnoying && !annualUseful ? 'challenging' : 'neutral';

    const monthlyStatus: 'supportive' | 'challenging' | 'neutral' =
      monthlyUseful && !monthlyAnnoying ? 'supportive' :
      monthlyAnnoying && !monthlyUseful ? 'challenging' : 'neutral';

    const dailyStatus: 'supportive' | 'challenging' | 'neutral' =
      dailyUseful && !dailyAnnoying ? 'supportive' :
      dailyAnnoying && !dailyUseful ? 'challenging' : 'neutral';

    const hourlyStatus: 'supportive' | 'challenging' | 'neutral' =
      hourlyUseful && !hourlyAnnoying ? 'supportive' :
      hourlyAnnoying && !hourlyUseful ? 'challenging' : 'neutral';

    // Count supportive/challenging layers
    const allStatuses = [lpStatus, annualStatus, monthlyStatus, dailyStatus, hourlyStatus];
    const supportiveCount = allStatuses.filter(s => s === 'supportive').length;
    const challengingCount = allStatuses.filter(s => s === 'challenging').length;

    if (supportiveCount === 5) {
      quintupleCompound = {
        type: 'quintuple_synergy',
        description: 'QUINTUPLE BLESSING! All five timing layers support your Useful God! Maximum cosmic alignment!',
        scoreModifier: HOURLY_SCORING_WEIGHTS.quintupleSynergy,
        layers: { luckPillar: lpStatus, annual: annualStatus, monthly: monthlyStatus, daily: dailyStatus, hourly: hourlyStatus }
      };
    } else if (challengingCount === 5) {
      quintupleCompound = {
        type: 'quintuple_conflict',
        description: 'Quintuple challenge - all timing layers oppose you. Avoid important activities.',
        scoreModifier: HOURLY_SCORING_WEIGHTS.quintupleConflict,
        layers: { luckPillar: lpStatus, annual: annualStatus, monthly: monthlyStatus, daily: dailyStatus, hourly: hourlyStatus }
      };
    } else if (supportiveCount === 4 && challengingCount === 0) {
      quintupleCompound = {
        type: 'quadruple_synergy',
        description: 'Quadruple blessing - four timing layers support you.',
        scoreModifier: HOURLY_SCORING_WEIGHTS.quadrupleSynergy,
        layers: { luckPillar: lpStatus, annual: annualStatus, monthly: monthlyStatus, daily: dailyStatus, hourly: hourlyStatus }
      };
    } else if (challengingCount === 4 && supportiveCount === 0) {
      quintupleCompound = {
        type: 'quadruple_conflict',
        description: 'Quadruple challenge - four timing layers oppose you.',
        scoreModifier: HOURLY_SCORING_WEIGHTS.quadrupleConflict,
        layers: { luckPillar: lpStatus, annual: annualStatus, monthly: monthlyStatus, daily: dailyStatus, hourly: hourlyStatus }
      };
    } else if (supportiveCount === 3 && challengingCount === 0) {
      quintupleCompound = {
        type: 'triple_synergy',
        description: 'Triple blessing - three timing layers support you.',
        scoreModifier: HOURLY_SCORING_WEIGHTS.tripleSynergy,
        layers: { luckPillar: lpStatus, annual: annualStatus, monthly: monthlyStatus, daily: dailyStatus, hourly: hourlyStatus }
      };
    } else if (challengingCount === 3 && supportiveCount === 0) {
      quintupleCompound = {
        type: 'triple_conflict',
        description: 'Triple challenge - three timing layers oppose you.',
        scoreModifier: HOURLY_SCORING_WEIGHTS.tripleConflict,
        layers: { luckPillar: lpStatus, annual: annualStatus, monthly: monthlyStatus, daily: dailyStatus, hourly: hourlyStatus }
      };
    } else if (supportiveCount >= 2 && challengingCount === 0) {
      quintupleCompound = {
        type: 'double_synergy',
        description: 'Double blessing - two timing layers support you.',
        scoreModifier: HOURLY_SCORING_WEIGHTS.doubleSynergy,
        layers: { luckPillar: lpStatus, annual: annualStatus, monthly: monthlyStatus, daily: dailyStatus, hourly: hourlyStatus }
      };
    } else if (challengingCount >= 2 && supportiveCount === 0) {
      quintupleCompound = {
        type: 'double_conflict',
        description: 'Double challenge - two timing layers oppose you.',
        scoreModifier: HOURLY_SCORING_WEIGHTS.doubleConflict,
        layers: { luckPillar: lpStatus, annual: annualStatus, monthly: monthlyStatus, daily: dailyStatus, hourly: hourlyStatus }
      };
    } else if (supportiveCount > 0 && challengingCount > 0) {
      quintupleCompound = {
        type: 'mixed',
        description: 'Mixed energy - some layers support, some challenge. Choose activities carefully.',
        scoreModifier: 0,
        layers: { luckPillar: lpStatus, annual: annualStatus, monthly: monthlyStatus, daily: dailyStatus, hourly: hourlyStatus }
      };
    }

    if (quintupleCompound.type !== 'neutral') {
      reasoning.push(``);
      reasoning.push(`✨ Quintuple Compound Effect: ${quintupleCompound.type.toUpperCase()}`);
      reasoning.push(`   ${quintupleCompound.description}`);
      reasoning.push(`   Layers: LP=${lpStatus}, Annual=${annualStatus}, Monthly=${monthlyStatus}, Daily=${dailyStatus}, Hourly=${hourlyStatus}`);
    }
  }

  // ========================================
  // STEP 9: Shen Sha activation
  // ========================================
  const shensha: ShenshaTrigger[] = [];

  // Nobleman check (most important Shen Sha)
  const NOBLEMAN: Record<string, string[]> = {
    '甲': ['丑', '未'], '戊': ['丑', '未'],
    '乙': ['子', '申'], '己': ['子', '申'],
    '丙': ['亥', '酉'], '丁': ['亥', '酉'],
    '庚': ['丑', '未'], '辛': ['寅', '午'],
    '壬': ['卯', '巳'], '癸': ['卯', '巳']
  };

  if (NOBLEMAN[natalPillars.dayStem]?.includes(branch)) {
    shensha.push({
      name: 'Nobleman',
      chineseName: '天乙贵人',
      isPositive: true,
      description: 'Nobleman hour - help is available now'
    });
  }

  // Academic Star check
  const ACADEMIC_STAR: Record<string, string> = {
    '甲': '巳', '乙': '午', '丙': '申', '丁': '酉',
    '戊': '申', '己': '酉', '庚': '亥', '辛': '子',
    '壬': '寅', '癸': '卯'
  };

  if (ACADEMIC_STAR[natalPillars.dayStem] === branch) {
    shensha.push({
      name: 'Academic Star',
      chineseName: '文昌',
      isPositive: true,
      description: 'Academic hour - excellent for study and exams'
    });
  }

  // Traveling Horse check
  const TRAVELING_HORSE: Record<string, string> = {
    '寅': '申', '午': '申', '戌': '申',
    '申': '寅', '子': '寅', '辰': '寅',
    '亥': '巳', '卯': '巳', '未': '巳',
    '巳': '亥', '酉': '亥', '丑': '亥'
  };

  if (TRAVELING_HORSE[natalPillars.dayBranch] === branch) {
    shensha.push({
      name: 'Traveling Horse',
      chineseName: '驿马',
      isPositive: true,
      description: 'Movement hour - good for travel and action'
    });
  }

  if (shensha.length > 0) {
    reasoning.push(``);
    reasoning.push(`✨ Shen Sha Activated:`);
    shensha.forEach(s => {
      reasoning.push(`   ${s.isPositive ? '✅' : '⚠️'} ${s.chineseName} (${s.name})`);
    });
  }

  // ========================================
  // STEP 10: DM strength impact
  // ========================================
  let dmStrengthDelta = 0;
  let dmImpact: 'strengthens' | 'weakens' | 'neutral' = 'neutral';

  const PRODUCTION_CYCLE: Record<ElementName, ElementName> = {
    'Wood': 'Fire', 'Fire': 'Earth', 'Earth': 'Metal',
    'Metal': 'Water', 'Water': 'Wood'
  };

  const PRODUCED_BY: Record<ElementName, ElementName> = {
    'Wood': 'Water', 'Fire': 'Wood', 'Earth': 'Fire',
    'Metal': 'Earth', 'Water': 'Metal'
  };

  const CONTROLLED_BY: Record<ElementName, ElementName> = {
    'Wood': 'Metal', 'Fire': 'Water', 'Earth': 'Wood',
    'Metal': 'Fire', 'Water': 'Earth'
  };

  if (stemElement === PRODUCED_BY[dayMasterElement] || branchElement === PRODUCED_BY[dayMasterElement]) {
    dmStrengthDelta += 0.05;
    dmImpact = 'strengthens';
  }

  if (stemElement === dayMasterElement || branchElement === dayMasterElement) {
    dmStrengthDelta += 0.03;
    dmImpact = 'strengthens';
  }

  if (stemElement === CONTROLLED_BY[dayMasterElement] || branchElement === CONTROLLED_BY[dayMasterElement]) {
    dmStrengthDelta -= 0.05;
    dmImpact = 'weakens';
  }

  if (stemElement === PRODUCTION_CYCLE[dayMasterElement] || branchElement === PRODUCTION_CYCLE[dayMasterElement]) {
    dmStrengthDelta -= 0.03;
    if (dmImpact === 'neutral') dmImpact = 'weakens';
  }

  reasoning.push(``);
  reasoning.push(`💪 DM Impact: ${dmImpact} (Δ ${dmStrengthDelta > 0 ? '+' : ''}${(dmStrengthDelta * 100).toFixed(0)}%)`);

  // ========================================
  // STEP 11: Calculate final score
  // ========================================
  let score = 50; // Start neutral

  // Useful God activation
  if (stemUseful) score += HOURLY_SCORING_WEIGHTS.usefulStem;
  if (branchUseful) score += HOURLY_SCORING_WEIGHTS.usefulBranch;

  // Annoying God activation
  if (stemAnnoying) score += HOURLY_SCORING_WEIGHTS.annoyingStem;
  if (branchAnnoying) score += HOURLY_SCORING_WEIGHTS.annoyingBranch;

  // Hour Officer
  if (hourOfficer.nature === 'auspicious') score += HOURLY_SCORING_WEIGHTS.hourOfficerAuspicious;
  else if (hourOfficer.nature === 'inauspicious') score += HOURLY_SCORING_WEIGHTS.hourOfficerInauspicious;

  // Hour Clash
  if (hourClash.hasClash) {
    if (hourClash.severity === 'major') score += HOURLY_SCORING_WEIGHTS.hourClashMajor;
    else if (hourClash.severity === 'moderate') score += HOURLY_SCORING_WEIGHTS.hourClashModerate;
    else score += HOURLY_SCORING_WEIGHTS.hourClashMinor;
  }

  // Natal conflicts
  natalConflicts.forEach(c => {
    if (c.type === 'clash') {
      if (c.severity === 'major') score += HOURLY_SCORING_WEIGHTS.natalClashMajor;
      else if (c.severity === 'moderate') score += HOURLY_SCORING_WEIGHTS.natalClashModerate;
      else score += HOURLY_SCORING_WEIGHTS.natalClashMinor;
    } else if (c.type === 'harm') {
      if (c.severity === 'major') score += HOURLY_SCORING_WEIGHTS.natalHarmMajor;
      else if (c.severity === 'moderate') score += HOURLY_SCORING_WEIGHTS.natalHarmModerate;
      else score += HOURLY_SCORING_WEIGHTS.natalHarmMinor;
    } else {
      score += HOURLY_SCORING_WEIGHTS.natalDestructionAny;
    }
  });

  // Timing pillar conflicts
  luckPillarConflicts.forEach(c => {
    if (c.type === 'clash') score += HOURLY_SCORING_WEIGHTS.luckClash;
    else score += HOURLY_SCORING_WEIGHTS.luckHarm;
  });

  annualConflicts.forEach(c => {
    if (c.type === 'clash') score += HOURLY_SCORING_WEIGHTS.annualClash;
    else score += HOURLY_SCORING_WEIGHTS.annualHarm;
  });

  monthlyConflicts.forEach(c => {
    if (c.type === 'clash') score += HOURLY_SCORING_WEIGHTS.monthlyClash;
    else score += HOURLY_SCORING_WEIGHTS.monthlyHarm;
  });

  dailyConflicts.forEach(c => {
    if (c.type === 'clash') score += HOURLY_SCORING_WEIGHTS.dailyClash;
    else score += HOURLY_SCORING_WEIGHTS.dailyHarm;
  });

  // Quintuple compound effect
  score += quintupleCompound.scoreModifier;

  // Transformations
  allTransformations.forEach(t => {
    if (usefulGodResult.usefulElements.includes(t.resultElement as ElementName)) {
      score += HOURLY_SCORING_WEIGHTS.transformationPositive;
    } else {
      score += HOURLY_SCORING_WEIGHTS.transformationNeutral;
    }
  });

  // Shen Sha
  shensha.forEach(s => {
    score += s.isPositive ? HOURLY_SCORING_WEIGHTS.shenshaPositive : HOURLY_SCORING_WEIGHTS.shenshaNegative;
  });

  // DM context adjustment
  const isWeakDM = dmStrength < 1.0;
  if (isWeakDM && dmImpact === 'strengthens') {
    score += HOURLY_SCORING_WEIGHTS.dmSupport;
  } else if (!isWeakDM && dmImpact === 'weakens') {
    score += HOURLY_SCORING_WEIGHTS.dmSupport;
  } else if (isWeakDM && dmImpact === 'weakens') {
    score += HOURLY_SCORING_WEIGHTS.dmDrain;
  } else if (!isWeakDM && dmImpact === 'strengthens') {
    score += HOURLY_SCORING_WEIGHTS.dmDrain;
  }

  // Clamp score
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Determine tier
  let tier: FavorabilityTier;
  if (score >= 75) tier = 'excellent';
  else if (score >= 60) tier = 'good';
  else if (score >= 40) tier = 'neutral';
  else if (score >= 25) tier = 'challenging';
  else tier = 'difficult';

  reasoning.push(``);
  reasoning.push(`📊 Final Score: ${score}/100 → ${tier.toUpperCase()}`);

  // ========================================
  // STEP 12: Generate activity recommendations
  // ========================================
  const suitableActivities = [...hourOfficer.suitableFor];
  const avoidActivities = [...hourOfficer.avoidFor];

  if (usefulActivated.length > 0) {
    suitableActivities.push('Activities aligned with your favorable elements');
  }
  if (shensha.some(s => s.name === 'Nobleman')) {
    suitableActivities.push('Seeking help', 'Important meetings', 'Negotiations');
  }
  if (shensha.some(s => s.name === 'Academic Star')) {
    suitableActivities.push('Studying', 'Exams', 'Learning');
  }
  if (shensha.some(s => s.name === 'Traveling Horse')) {
    suitableActivities.push('Travel', 'Movement', 'Action');
  }

  if (hourClash.hasClash) {
    avoidActivities.push('Major decisions', 'Confrontations');
  }
  if (annoyingActivated.length > 0) {
    avoidActivities.push('Activities related to challenging elements');
  }

  // ========================================
  // STEP 13: Generate summary and advice
  // ========================================
  const summary = generateHourlySummary(
    hourInfo, tier, usefulActivated,
    hourOfficer, hourClash, quintupleCompound
  );
  const advice = generateHourlyAdvice(
    tier, hourOfficer, hourClash, shensha, quintupleCompound
  );

  return {
    hourIndex,
    stem,
    branch,
    pillarDisplay: `${stem}${branch}`,
    hourInfo,
    score,
    tier,
    confidence: 0.85,
    stemElement,
    branchElement,
    stemUseful,
    stemAnnoying,
    branchUseful,
    branchAnnoying,
    usefulActivated,
    annoyingActivated,
    hourOfficer,
    hourClash,
    natalConflicts,
    natalTransformations,
    luckPillarConflicts,
    luckPillarTransformations,
    annualConflicts,
    annualTransformations,
    monthlyConflicts,
    monthlyTransformations,
    dailyConflicts,
    dailyTransformations,
    quintupleCompound,
    shensha,
    dmStrengthDelta,
    dmImpact,
    luckPillarContext: luckPillarContext || null,
    annualContext: annualContext || null,
    monthlyContext: monthlyContext || null,
    dailyContext: dailyContext || null,
    reasoning,
    summary,
    advice,
    suitableActivities: Array.from(new Set(suitableActivities)),
    avoidActivities: Array.from(new Set(avoidActivities))
  };
}

// ============================================================================
// DAILY HOURS COMPUTATION
// ============================================================================

/**
 * Compute favorability for all 12 hours in a day
 */
export function computeDailyHours(
  dayStem: string,
  dayBranch: string,
  natalPillars: NatalPillarsInput,
  usefulGodResult: UsefulGodResult,
  dayMasterElement: ElementName,
  dmStrength: number,
  luckPillarContext?: CurrentLuckPillarContext,
  annualContext?: CurrentAnnualContext,
  monthlyContext?: CurrentMonthlyContext,
  dailyContext?: CurrentDailyContext,
  currentWesternHour?: number
): DailyHoursResult {
  const hours: HourlyLuckFavorability[] = [];

  for (let hourIndex = 0; hourIndex < 12; hourIndex++) {
    const { stem, branch } = getHourlyPillar(dayStem, hourIndex);

    const hourResult = computeHourlyLuckFavorability(
      { hourIndex, stem, branch },
      natalPillars,
      usefulGodResult,
      dayMasterElement,
      dmStrength,
      dayBranch,
      luckPillarContext,
      annualContext,
      monthlyContext,
      dailyContext
    );

    hours.push(hourResult);
  }

  // Find best and worst
  const sorted = [...hours].sort((a, b) => b.score - a.score);
  const bestHour = sorted[0] || null;
  const worstHour = sorted[sorted.length - 1] || null;

  // Find current hour
  let currentHour: HourlyLuckFavorability | null = null;
  if (currentWesternHour !== undefined) {
    const currentChineseHour = westernToChineseHour(currentWesternHour);
    currentHour = hours.find(h => h.hourIndex === currentChineseHour) || null;
  }

  // Generate patterns
  const morningPattern = generatePeriodPattern(hours.filter(h => h.hourIndex >= 2 && h.hourIndex <= 5), 'Morning');
  const afternoonPattern = generatePeriodPattern(hours.filter(h => h.hourIndex >= 6 && h.hourIndex <= 9), 'Afternoon');
  const eveningPattern = generatePeriodPattern(hours.filter(h => h.hourIndex >= 10 || h.hourIndex <= 1), 'Evening');

  // Generate day summary
  const daySummary = generateDayHoursSummary(hours, bestHour, worstHour, currentHour);

  return {
    date: dailyContext ? `${dailyContext.year}-${String(dailyContext.month).padStart(2, '0')}-${String(dailyContext.day).padStart(2, '0')}` : 'Unknown',
    dayStem,
    hours,
    bestHour,
    worstHour,
    currentHour,
    morningPattern,
    afternoonPattern,
    eveningPattern,
    daySummary
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateHourlySummary(
  hourInfo: ChineseHourInfo,
  tier: FavorabilityTier,
  useful: ElementName[],
  hourOfficer: HourOfficerInfo,
  hourClash: HourClashInfo,
  quintuple: QuintupleCompoundEffect
): string {
  const parts: string[] = [];

  if (tier === 'excellent') {
    parts.push(`${hourInfo.chineseName} (${hourInfo.startTime}-${hourInfo.endTime}) is an excellent hour.`);
  } else if (tier === 'good') {
    parts.push(`${hourInfo.chineseName} (${hourInfo.startTime}-${hourInfo.endTime}) brings favorable energy.`);
  } else if (tier === 'neutral') {
    parts.push(`${hourInfo.chineseName} (${hourInfo.startTime}-${hourInfo.endTime}) is balanced.`);
  } else if (tier === 'challenging') {
    parts.push(`${hourInfo.chineseName} (${hourInfo.startTime}-${hourInfo.endTime}) requires caution.`);
  } else {
    parts.push(`${hourInfo.chineseName} (${hourInfo.startTime}-${hourInfo.endTime}) is challenging.`);
  }

  // Hour Officer
  parts.push(`Hour Officer: ${hourOfficer.chineseName} (${hourOfficer.name}).`);

  // Hour Clash
  if (hourClash.hasClash) {
    parts.push(`Hour Clash detected.`);
  }

  // Quintuple compound
  if (quintuple.type === 'quintuple_synergy') {
    parts.push(`All timing layers align!`);
  } else if (quintuple.type === 'quintuple_conflict') {
    parts.push(`All timing layers challenge.`);
  }

  // Key activations
  if (useful.length > 0) {
    parts.push(`Useful God active.`);
  }

  return parts.join(' ');
}

function generateHourlyAdvice(
  tier: FavorabilityTier,
  hourOfficer: HourOfficerInfo,
  hourClash: HourClashInfo,
  shensha: ShenshaTrigger[],
  quintuple: QuintupleCompoundEffect
): string {
  // Excellent/Good hours
  if (tier === 'excellent' || tier === 'good') {
    if (shensha.some(s => s.name === 'Nobleman')) {
      return 'Nobleman hour - seek help and make important calls now.';
    }
    if (shensha.some(s => s.name === 'Academic Star')) {
      return 'Academic hour - optimal for study, exams, and intellectual work.';
    }
    if (shensha.some(s => s.name === 'Traveling Horse')) {
      return 'Movement hour - good for travel and taking action.';
    }
    if (quintuple.type === 'quintuple_synergy') {
      return 'Maximum cosmic alignment! Take your most important actions now.';
    }
    if (hourOfficer.name === 'Success') {
      return 'Success hour - complete important tasks and close deals.';
    }
    if (hourOfficer.name === 'Open') {
      return 'Opening hour - start new initiatives and make connections.';
    }
    return 'Favorable hour. Good for important activities.';
  }

  // Challenging/Difficult hours
  if (tier === 'challenging' || tier === 'difficult') {
    if (hourClash.hasClash && hourClash.severity === 'major') {
      return 'Major clash hour - avoid confrontations and important decisions.';
    }
    if (hourOfficer.name === 'Destruction') {
      return 'Destruction hour - avoid starting important things.';
    }
    if (hourOfficer.name === 'Danger') {
      return 'Danger hour - proceed with extreme caution.';
    }
    if (hourOfficer.name === 'Close') {
      return 'Closure hour - rest and reflect rather than act.';
    }
    if (quintuple.type === 'quintuple_conflict') {
      return 'All layers oppose - postpone important activities if possible.';
    }
    return 'Challenging hour. Handle only routine matters.';
  }

  // Neutral hours
  return 'Balanced energy. Proceed normally with awareness.';
}

function generatePeriodPattern(hours: HourlyLuckFavorability[], periodName: string): string {
  if (hours.length === 0) return `${periodName} pattern unclear.`;

  const avgScore = hours.reduce((sum, h) => sum + h.score, 0) / hours.length;
  const bestInPeriod = hours.reduce((best, h) => h.score > best.score ? h : best, hours[0]);

  if (avgScore >= 65) {
    return `${periodName}: Favorable (avg ${avgScore.toFixed(0)}). Best: ${bestInPeriod.hourInfo.chineseName} (${bestInPeriod.score}).`;
  } else if (avgScore >= 45) {
    return `${periodName}: Mixed (avg ${avgScore.toFixed(0)}). Best: ${bestInPeriod.hourInfo.chineseName} (${bestInPeriod.score}).`;
  } else {
    return `${periodName}: Challenging (avg ${avgScore.toFixed(0)}). Best: ${bestInPeriod.hourInfo.chineseName} (${bestInPeriod.score}).`;
  }
}

function generateDayHoursSummary(
  hours: HourlyLuckFavorability[],
  best: HourlyLuckFavorability | null,
  worst: HourlyLuckFavorability | null,
  current: HourlyLuckFavorability | null
): string {
  const parts: string[] = [];

  if (best) {
    parts.push(`Best: ${best.hourInfo.chineseName} (${best.hourInfo.startTime}-${best.hourInfo.endTime}, score: ${best.score}).`);
  }

  if (worst) {
    parts.push(`Avoid: ${worst.hourInfo.chineseName} (${worst.hourInfo.startTime}-${worst.hourInfo.endTime}, score: ${worst.score}).`);
  }

  if (current) {
    parts.push(`Now: ${current.hourInfo.chineseName} - ${current.tier} (${current.score}).`);
  }

  // Count tiers
  const excellent = hours.filter(h => h.tier === 'excellent').length;
  const good = hours.filter(h => h.tier === 'good').length;
  const challenging = hours.filter(h => h.tier === 'challenging' || h.tier === 'difficult').length;

  parts.push(`Day breakdown: ${excellent} excellent, ${good} good, ${challenging} challenging hours.`);

  return parts.join(' ');
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Get a quick favorability rating for a single hour
 */
export function getQuickHourlyFavorability(
  dayStem: string,
  hourIndex: number,
  usefulElements: ElementName[],
  annoyingElements: ElementName[]
): { favorable: boolean; score: number; pillar: string; hourInfo: ChineseHourInfo; reason: string } {
  const { stem, branch } = getHourlyPillar(dayStem, hourIndex);
  const hourInfo = getChineseHourInfo(hourIndex);
  const stemElement = STEM_TO_ELEMENT[stem];
  const branchElement = BRANCH_TO_ELEMENT[branch];

  let score = 50;
  const reasons: string[] = [];

  if (usefulElements.includes(stemElement)) {
    score += 5;
    reasons.push(`${stemElement} stem supports`);
  }
  if (usefulElements.includes(branchElement)) {
    score += 4;
    reasons.push(`${branchElement} branch supports`);
  }
  if (annoyingElements.includes(stemElement)) {
    score -= 5;
    reasons.push(`${stemElement} stem challenges`);
  }
  if (annoyingElements.includes(branchElement)) {
    score -= 4;
    reasons.push(`${branchElement} branch challenges`);
  }

  return {
    favorable: score >= 50,
    score: Math.max(0, Math.min(100, score)),
    pillar: `${stem}${branch}`,
    hourInfo,
    reason: reasons.length > 0 ? reasons.join('; ') : 'Neutral hour'
  };
}

/**
 * Find best hours in a day for a specific activity
 */
export function findBestHoursForActivity(
  dayStem: string,
  dayBranch: string,
  activity: string,
  usefulElements: ElementName[],
  count: number = 3
): { hourInfo: ChineseHourInfo; pillar: string; score: number; hourOfficer: string }[] {
  const results: { hourInfo: ChineseHourInfo; pillar: string; score: number; hourOfficer: string }[] = [];

  for (let hourIndex = 0; hourIndex < 12; hourIndex++) {
    const { stem, branch } = getHourlyPillar(dayStem, hourIndex);
    const hourInfo = getChineseHourInfo(hourIndex);
    const hourOfficer = getHourOfficer(hourIndex, dayBranch);

    const stemElement = STEM_TO_ELEMENT[stem];
    const branchElement = BRANCH_TO_ELEMENT[branch];

    let score = 50;

    // Useful element bonus
    if (usefulElements.includes(stemElement)) score += 8;
    if (usefulElements.includes(branchElement)) score += 6;

    // Hour Officer alignment with activity
    if (hourOfficer.suitableFor.some(s => s.toLowerCase().includes(activity.toLowerCase()))) {
      score += 12;
    }
    if (hourOfficer.avoidFor.some(s => s.toLowerCase().includes(activity.toLowerCase()))) {
      score -= 12;
    }

    // Hour Officer general favorability
    if (hourOfficer.nature === 'auspicious') score += 4;
    if (hourOfficer.nature === 'inauspicious') score -= 4;

    results.push({
      hourInfo,
      pillar: `${stem}${branch}`,
      score: Math.max(0, Math.min(100, score)),
      hourOfficer: `${hourOfficer.chineseName} (${hourOfficer.name})`
    });
  }

  // Sort by score and return top N
  return results.sort((a, b) => b.score - a.score).slice(0, count);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  computeHourlyLuckFavorability,
  computeDailyHours,
  getQuickHourlyFavorability,
  getHourlyPillar,
  getHourStem,
  getHourBranch,
  getHourOfficer,
  getChineseHourInfo,
  westernToChineseHour,
  findBestHoursForActivity,
  CHINESE_HOURS,
  HOUR_OFFICERS,
  HOURLY_SCORING_WEIGHTS
};
