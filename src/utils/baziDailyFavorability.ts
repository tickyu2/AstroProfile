/**
 * ============================================================================
 * DAILY LUCK FAVORABILITY ENGINE (流日喜忌)
 * ============================================================================
 *
 * This is the ULTRA-FINE classical timing layer of BaZi - day-by-day analysis.
 * Classical practitioners use this layer for:
 *
 * - Choosing auspicious dates (择日)
 * - Understanding mood/energy fluctuations
 * - Predicting micro-events
 * - Relationship timing (meeting dates, proposals)
 * - Wealth/career activation windows
 * - Health sensitivity days
 * - Creative flow days
 * - Travel days
 * - Conflict-trigger days
 *
 * Each Daily Pillar (流日) is evaluated considering:
 * - The CURRENT Luck Pillar context (大运环境)
 * - The CURRENT Annual Pillar context (流年环境)
 * - The CURRENT Monthly Pillar context (流月环境)
 * - Useful God (用神) activation
 * - Annoying God (忌神) activation
 * - Day Clash (日冲) - EXTREMELY important at daily level
 * - Day Officer (十二值日神) - classical day selection system
 * - Conflicts with natal chart, luck pillar, annual, AND monthly pillars
 * - Transformations at all levels
 * - Shen Sha activation (神煞)
 * - Quadruple compound effects (大运 + 流年 + 流月 + 流日)
 *
 * Joey Yap teaching:
 * "The Luck Pillar is the climate, the Annual is the weather,
 *  the Monthly is the daily forecast, and the Daily Pillar is
 *  the hour-by-hour barometer. Master daily timing for precision
 *  life navigation and date selection (择日)."
 *
 * Daily Pillar Calculation:
 * Unlike monthly pillars which use 五虎遁, daily pillars cycle through
 * the full 六十甲子 (60 Jiazi) cycle continuously. We use a reference
 * date to calculate any day's pillar.
 *
 * Created: January 2026
 * Based on: Classical BaZi Daily Pillar (流日) doctrine, Joey Yap methodology
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

// Re-export for convenience
export { STEM_TO_ELEMENT, BRANCH_TO_ELEMENT, STEM_POLARITY };

// ============================================================================
// TYPES
// ============================================================================

export interface DailyPillarInput {
  year: number;           // Gregorian year
  month: number;          // Gregorian month (1-12)
  day: number;            // Gregorian day (1-31)
  stem: string;           // 日干
  branch: string;         // 日支
}

export interface CurrentMonthlyContext {
  year: number;
  month: number;
  stem: string;
  branch: string;
  tier: FavorabilityTier;
  score: number;
}

export interface QuadrupleCompoundEffect {
  type: 'quadruple_synergy' | 'triple_synergy' | 'double_synergy' | 'double_conflict' | 'triple_conflict' | 'quadruple_conflict' | 'mixed' | 'neutral';
  description: string;
  scoreModifier: number;
  layers: {
    luckPillar: 'supportive' | 'challenging' | 'neutral';
    annual: 'supportive' | 'challenging' | 'neutral';
    monthly: 'supportive' | 'challenging' | 'neutral';
    daily: 'supportive' | 'challenging' | 'neutral';
  };
}

export interface DayOfficerInfo {
  name: string;
  chineseName: string;
  nature: 'auspicious' | 'inauspicious' | 'neutral';
  suitableFor: string[];
  avoidFor: string[];
  description: string;
}

export interface DayClashInfo {
  hasClash: boolean;
  clashWith: string | null;
  clashPillar: string | null;
  severity: 'major' | 'moderate' | 'minor' | null;
  description: string;
}

export interface DailyLuckFavorability {
  // Basic info
  year: number;
  month: number;
  day: number;
  stem: string;
  branch: string;
  pillarDisplay: string;
  dateDisplay: string;
  dayOfWeek: string;

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

  // Day-specific features
  dayOfficer: DayOfficerInfo;
  dayClash: DayClashInfo;

  // Interactions with natal chart
  natalConflicts: ConflictTrigger[];
  natalTransformations: TransformationTrigger[];

  // Interactions with luck pillar
  luckPillarConflicts: ConflictTrigger[];
  luckPillarTransformations: TransformationTrigger[];

  // Interactions with annual pillar
  annualConflicts: ConflictTrigger[];
  annualTransformations: TransformationTrigger[];

  // Interactions with monthly pillar
  monthlyConflicts: ConflictTrigger[];
  monthlyTransformations: TransformationTrigger[];

  // Quadruple compound effects (luck + annual + monthly + daily)
  quadrupleCompound: QuadrupleCompoundEffect;

  // Shen Sha
  shensha: ShenshaTrigger[];

  // DM impact
  dmStrengthDelta: number;
  dmImpact: 'strengthens' | 'weakens' | 'neutral';

  // Context
  luckPillarContext: CurrentLuckPillarContext | null;
  annualContext: CurrentAnnualContext | null;
  monthlyContext: CurrentMonthlyContext | null;

  // Narrative
  reasoning: string[];
  summary: string;
  advice: string;

  // Activity recommendations
  suitableActivities: string[];
  avoidActivities: string[];
}

export interface MonthlyDaysResult {
  year: number;
  month: number;
  days: DailyLuckFavorability[];
  bestDay: DailyLuckFavorability | null;
  worstDay: DailyLuckFavorability | null;
  todayResult: DailyLuckFavorability | null;
  weekPattern: string;
  monthSummary: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const DAY_OF_WEEK_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Reference date for daily pillar calculation
 * January 1, 1900 was 甲戌 (index 10 in 60 Jiazi cycle)
 */
const REFERENCE_DATE = new Date(1900, 0, 1);
const REFERENCE_JIAZI_INDEX = 10;

/**
 * The 60-year/day cycle (六十甲子) - Reference for documentation
 * Each day cycles through this sequence continuously
 */
const _SIXTY_JIAZI_REFERENCE: string[] = [
  '甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉',
  '甲戌', '乙亥', '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未',
  '甲申', '乙酉', '丙戌', '丁亥', '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳',
  '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥', '庚子', '辛丑', '壬寅', '癸卯',
  '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥', '壬子', '癸丑',
  '甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥'
];

// ============================================================================
// DAY OFFICER SYSTEM (十二值日神)
// ============================================================================

/**
 * The Twelve Day Officers (十二值日神)
 * This is the classical Chinese day selection system.
 * Each day has one of 12 officers that cycles continuously.
 */
const DAY_OFFICERS: DayOfficerInfo[] = [
  {
    name: 'Establish',
    chineseName: '建',
    nature: 'auspicious',
    suitableFor: ['Starting projects', 'Ceremonies', 'Construction', 'Opening businesses'],
    avoidFor: ['Litigation', 'Medical procedures'],
    description: 'Day of establishment and new beginnings. Strong foundation energy.'
  },
  {
    name: 'Remove',
    chineseName: '除',
    nature: 'auspicious',
    suitableFor: ['Cleaning', 'Medical treatment', 'Ending bad habits', 'Removing obstacles'],
    avoidFor: ['Weddings', 'Starting new ventures'],
    description: 'Day for removal and cleansing. Good for clearing away the old.'
  },
  {
    name: 'Full',
    chineseName: '满',
    nature: 'auspicious',
    suitableFor: ['Celebrations', 'Weddings', 'Grand openings', 'Receiving wealth'],
    avoidFor: ['Funerals', 'Medical procedures', 'Litigation'],
    description: 'Day of fullness and abundance. Peak positive energy.'
  },
  {
    name: 'Balance',
    chineseName: '平',
    nature: 'neutral',
    suitableFor: ['Routine activities', 'Minor tasks', 'Maintenance'],
    avoidFor: ['Major decisions', 'Important ceremonies'],
    description: 'Balanced day with neutral energy. Good for ordinary activities.'
  },
  {
    name: 'Stable',
    chineseName: '定',
    nature: 'auspicious',
    suitableFor: ['Signing contracts', 'Appointments', 'Making commitments', 'Meetings'],
    avoidFor: ['Travel', 'Moving', 'Litigation'],
    description: 'Day of stability and certainty. Excellent for commitments.'
  },
  {
    name: 'Initiate',
    chineseName: '执',
    nature: 'neutral',
    suitableFor: ['Legal matters', 'Collecting debts', 'Enforcement'],
    avoidFor: ['Weddings', 'Celebrations', 'Starting businesses'],
    description: 'Day of execution and enforcement. Good for following through.'
  },
  {
    name: 'Destruction',
    chineseName: '破',
    nature: 'inauspicious',
    suitableFor: ['Demolition', 'Breaking bad habits', 'Ending relationships'],
    avoidFor: ['Starting anything new', 'Weddings', 'Construction', 'Signing contracts'],
    description: 'Day of destruction. Avoid starting important matters.'
  },
  {
    name: 'Danger',
    chineseName: '危',
    nature: 'inauspicious',
    suitableFor: ['Quiet reflection', 'Prayer', 'Caution'],
    avoidFor: ['Travel', 'Surgery', 'Major decisions', 'Starting projects'],
    description: 'Day of danger. Proceed with extreme caution.'
  },
  {
    name: 'Success',
    chineseName: '成',
    nature: 'auspicious',
    suitableFor: ['Completing projects', 'Weddings', 'Signing contracts', 'Moving', 'Business'],
    avoidFor: ['Litigation', 'Funerals'],
    description: 'Day of success and completion. Highly auspicious for achievements.'
  },
  {
    name: 'Receive',
    chineseName: '收',
    nature: 'auspicious',
    suitableFor: ['Collecting debts', 'Harvesting', 'Receiving', 'Closing deals'],
    avoidFor: ['Funerals', 'Medical procedures'],
    description: 'Day of receiving and gathering. Good for collecting what is owed.'
  },
  {
    name: 'Open',
    chineseName: '开',
    nature: 'auspicious',
    suitableFor: ['Grand openings', 'Starting businesses', 'Travel', 'Learning', 'Meetings'],
    avoidFor: ['Funerals', 'Burials'],
    description: 'Day of opening and opportunity. Excellent for new beginnings.'
  },
  {
    name: 'Close',
    chineseName: '闭',
    nature: 'inauspicious',
    suitableFor: ['Burials', 'Closing matters', 'Rest', 'Meditation'],
    avoidFor: ['Starting projects', 'Weddings', 'Opening businesses', 'Travel'],
    description: 'Day of closure. Not suitable for starting new things.'
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
// SCORING WEIGHTS (Daily-specific - smaller than monthly)
// ============================================================================

const DAILY_SCORING_WEIGHTS = {
  // Useful/Annoying God (smallest impact - daily fluctuations)
  usefulStem: 8,
  usefulBranch: 6,
  annoyingStem: -8,
  annoyingBranch: -6,

  // Day Officer (important for day selection)
  dayOfficerAuspicious: 6,
  dayOfficerInauspicious: -6,
  dayOfficerNeutral: 0,

  // Day Clash (very important!)
  dayClashMajor: -12,      // Clash with natal Day Branch
  dayClashModerate: -8,    // Clash with natal Month Branch
  dayClashMinor: -4,       // Clash with natal Year/Hour Branch

  // Conflicts with natal
  natalClashMajor: -6,
  natalClashModerate: -4,
  natalClashMinor: -2,
  natalHarmMajor: -4,
  natalHarmModerate: -2,
  natalHarmMinor: -1,
  natalDestructionAny: -1,

  // Conflicts with timing pillars
  luckClash: -6,
  luckHarm: -3,
  annualClash: -5,
  annualHarm: -2,
  monthlyClash: -4,
  monthlyHarm: -2,

  // Quadruple compound effects
  quadrupleSynergy: 20,
  tripleSynergy: 12,
  doubleSynergy: 6,
  doubleConflict: -6,
  tripleConflict: -10,
  quadrupleConflict: -15,

  // Transformations
  transformationPositive: 4,
  transformationNeutral: 1,

  // Shen Sha
  shenshaPositive: 2,
  shenshaNegative: -2,

  // DM adjustment
  dmSupport: 2,
  dmDrain: -2
};

// ============================================================================
// DAILY PILLAR CALCULATION
// ============================================================================

/**
 * Calculate the daily pillar for a given Gregorian date
 * Uses the continuous 60 Jiazi cycle from a reference date
 */
export function getDailyPillar(year: number, month: number, day: number): { stem: string; branch: string; jiaziIndex: number } {
  const targetDate = new Date(year, month - 1, day);
  const diffTime = targetDate.getTime() - REFERENCE_DATE.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Calculate position in 60 Jiazi cycle
  const jiaziIndex = ((diffDays + REFERENCE_JIAZI_INDEX) % 60 + 60) % 60;
  const stemIndex = jiaziIndex % 10;
  const branchIndex = jiaziIndex % 12;

  return {
    stem: STEMS[stemIndex],
    branch: BRANCHES[branchIndex],
    jiaziIndex
  };
}

/**
 * Get Day Officer for a given date
 * The 12 Day Officers cycle based on the month and day
 */
export function getDayOfficer(year: number, month: number, day: number, monthBranch: string): DayOfficerInfo {
  // Day Officer calculation based on month branch and day branch
  const { branch: dayBranch } = getDailyPillar(year, month, day);
  const monthBranchIndex = BRANCHES.indexOf(monthBranch);
  const dayBranchIndex = BRANCHES.indexOf(dayBranch);

  // The Day Officer is determined by the relationship between month and day branches
  // Starting from 'Establish' on the month's branch
  const officerIndex = ((dayBranchIndex - monthBranchIndex) % 12 + 12) % 12;

  return DAY_OFFICERS[officerIndex];
}

/**
 * Calculate Day Clash with natal chart
 */
function calculateDayClash(
  dayBranch: string,
  natalPillars: NatalPillarsInput
): DayClashInfo {
  const clashPartner = CLASH_PAIRS[dayBranch];

  if (!clashPartner) {
    return {
      hasClash: false,
      clashWith: null,
      clashPillar: null,
      severity: null,
      description: 'No day clash.'
    };
  }

  // Check each natal pillar for clash
  if (natalPillars.dayBranch === clashPartner) {
    return {
      hasClash: true,
      clashWith: clashPartner,
      clashPillar: 'Day',
      severity: 'major',
      description: `${dayBranch}${clashPartner}冲 - Daily branch clashes with your natal Day Branch! Major impact on self and spouse.`
    };
  }

  if (natalPillars.monthBranch === clashPartner) {
    return {
      hasClash: true,
      clashWith: clashPartner,
      clashPillar: 'Month',
      severity: 'moderate',
      description: `${dayBranch}${clashPartner}冲 - Daily branch clashes with natal Month Branch. Impact on career and parents.`
    };
  }

  if (natalPillars.yearBranch === clashPartner) {
    return {
      hasClash: true,
      clashWith: clashPartner,
      clashPillar: 'Year',
      severity: 'minor',
      description: `${dayBranch}${clashPartner}冲 - Daily branch clashes with natal Year Branch. Ancestral/social friction.`
    };
  }

  if (natalPillars.hourBranch === clashPartner) {
    return {
      hasClash: true,
      clashWith: clashPartner,
      clashPillar: 'Hour',
      severity: 'minor',
      description: `${dayBranch}${clashPartner}冲 - Daily branch clashes with natal Hour Branch. Impact on children and investments.`
    };
  }

  return {
    hasClash: false,
    clashWith: null,
    clashPillar: null,
    severity: null,
    description: 'No day clash with natal chart.'
  };
}

// ============================================================================
// MAIN COMPUTATION FUNCTION
// ============================================================================

/**
 * Compute favorability of a single Daily Pillar
 */
export function computeDailyLuckFavorability(
  daily: DailyPillarInput,
  natalPillars: NatalPillarsInput,
  usefulGodResult: UsefulGodResult,
  dayMasterElement: ElementName,
  dmStrength: number,
  monthBranch: string,
  luckPillarContext?: CurrentLuckPillarContext,
  annualContext?: CurrentAnnualContext,
  monthlyContext?: CurrentMonthlyContext
): DailyLuckFavorability {
  const { year, month, day, stem, branch } = daily;
  const reasoning: string[] = [];

  // ========================================
  // STEP 1: Get element information
  // ========================================
  const stemElement = STEM_TO_ELEMENT[stem] || 'Earth';
  const branchElement = BRANCH_TO_ELEMENT[branch] || 'Earth';
  const dateObj = new Date(year, month - 1, day);
  const dayOfWeek = DAY_OF_WEEK_NAMES[dateObj.getDay()];
  const dateDisplay = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  reasoning.push(`📅 Daily Pillar: ${dateDisplay} (${dayOfWeek}) - ${stem}${branch}`);
  reasoning.push(`   Stem: ${stem} → ${stemElement}`);
  reasoning.push(`   Branch: ${branch} → ${branchElement}`);

  if (luckPillarContext) {
    reasoning.push(`   Luck Pillar: ${luckPillarContext.stem}${luckPillarContext.branch} (${luckPillarContext.tier})`);
  }
  if (annualContext) {
    reasoning.push(`   Annual: ${annualContext.stem}${annualContext.branch} (${annualContext.tier})`);
  }
  if (monthlyContext) {
    reasoning.push(`   Monthly: ${monthlyContext.stem}${monthlyContext.branch} (${monthlyContext.tier})`);
  }

  // ========================================
  // STEP 2: Day Officer (十二值日神)
  // ========================================
  const dayOfficer = getDayOfficer(year, month, day, monthBranch);

  reasoning.push(``);
  reasoning.push(`📜 Day Officer: ${dayOfficer.chineseName} (${dayOfficer.name}) - ${dayOfficer.nature.toUpperCase()}`);
  reasoning.push(`   ${dayOfficer.description}`);

  // ========================================
  // STEP 3: Day Clash (日冲)
  // ========================================
  const dayClash = calculateDayClash(branch, natalPillars);

  if (dayClash.hasClash) {
    reasoning.push(``);
    reasoning.push(`⚡ DAY CLASH DETECTED: ${dayClash.severity?.toUpperCase()}`);
    reasoning.push(`   ${dayClash.description}`);
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
    reasoning.push(`   ○ No Useful God elements today`);
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
      const severity = natal.name === 'Day' ? 'major' : (natal.name === 'Month' ? 'moderate' : 'minor');
      natalConflicts.push({
        type: 'clash',
        withPillar: natal.name,
        branches: [branch, natal.branch],
        severity,
        description: `${branch}${natal.branch}冲 - Day clashes ${natal.name} Pillar`
      });
    }

    if (HARM_PAIRS[branch] === natal.branch) {
      const severity = natal.name === 'Day' ? 'moderate' : 'minor';
      natalConflicts.push({
        type: 'harm',
        withPillar: natal.name,
        branches: [branch, natal.branch],
        severity,
        description: `${branch}${natal.branch}害 - Day harms ${natal.name} Pillar`
      });
    }

    if (DESTRUCTION_PAIRS[branch] === natal.branch) {
      natalConflicts.push({
        type: 'destruction',
        withPillar: natal.name,
        branches: [branch, natal.branch],
        severity: 'minor',
        description: `${branch}${natal.branch}破 - Day breaks ${natal.name} Pillar`
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
  // STEP 6: Detect conflicts with timing pillars
  // ========================================
  const luckPillarConflicts: ConflictTrigger[] = [];
  const luckPillarTransformations: TransformationTrigger[] = [];
  const annualConflicts: ConflictTrigger[] = [];
  const annualTransformations: TransformationTrigger[] = [];
  const monthlyConflicts: ConflictTrigger[] = [];
  const monthlyTransformations: TransformationTrigger[] = [];

  // Check luck pillar
  if (luckPillarContext) {
    const lpBranch = luckPillarContext.branch;
    if (CLASH_PAIRS[branch] === lpBranch) {
      luckPillarConflicts.push({
        type: 'clash',
        withPillar: 'Luck',
        branches: [branch, lpBranch],
        severity: 'major',
        description: `${branch}${lpBranch}冲 - Day clashes Luck Pillar`
      });
    }
    if (HARM_PAIRS[branch] === lpBranch) {
      luckPillarConflicts.push({
        type: 'harm',
        withPillar: 'Luck',
        branches: [branch, lpBranch],
        severity: 'moderate',
        description: `${branch}${lpBranch}害 - Day harms Luck Pillar`
      });
    }

    // Transformation with luck pillar
    const lpCombination = SIX_COMBINATIONS[branch];
    if (lpCombination && lpBranch === lpCombination.partner) {
      luckPillarTransformations.push({
        type: 'Six Combination (六合)',
        pillarsInvolved: [`Day:${branch}`, `Luck:${lpBranch}`],
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
        severity: 'major',
        description: `${branch}${annualBranch}冲 - Day clashes Annual Pillar`
      });
    }
    if (HARM_PAIRS[branch] === annualBranch) {
      annualConflicts.push({
        type: 'harm',
        withPillar: 'Annual',
        branches: [branch, annualBranch],
        severity: 'moderate',
        description: `${branch}${annualBranch}害 - Day harms Annual Pillar`
      });
    }

    // Transformation with annual
    const annualCombination = SIX_COMBINATIONS[branch];
    if (annualCombination && annualBranch === annualCombination.partner) {
      annualTransformations.push({
        type: 'Six Combination (六合)',
        pillarsInvolved: [`Day:${branch}`, `Annual:${annualBranch}`],
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
        severity: 'major',
        description: `${branch}${monthlyBranch}冲 - Day clashes Monthly Pillar`
      });
    }
    if (HARM_PAIRS[branch] === monthlyBranch) {
      monthlyConflicts.push({
        type: 'harm',
        withPillar: 'Monthly',
        branches: [branch, monthlyBranch],
        severity: 'moderate',
        description: `${branch}${monthlyBranch}害 - Day harms Monthly Pillar`
      });
    }

    // Transformation with monthly
    const monthlyCombination = SIX_COMBINATIONS[branch];
    if (monthlyCombination && monthlyBranch === monthlyCombination.partner) {
      monthlyTransformations.push({
        type: 'Six Combination (六合)',
        pillarsInvolved: [`Day:${branch}`, `Monthly:${monthlyBranch}`],
        resultElement: monthlyCombination.result,
        description: `${branch}${monthlyBranch}合 → ${monthlyCombination.result}`
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
          pillarsInvolved: [`Daily:${branch}`, `${natal.name}:${natal.branch}`],
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
    ...monthlyTransformations
  ];

  if (allTransformations.length > 0) {
    reasoning.push(``);
    reasoning.push(`🔄 Transformations:`);
    allTransformations.forEach(t => {
      reasoning.push(`   ${t.description}`);
    });
  }

  // ========================================
  // STEP 8: Quadruple compound effect analysis
  // ========================================
  let quadrupleCompound: QuadrupleCompoundEffect = {
    type: 'neutral',
    description: 'Standard daily energy - no special compound effects.',
    scoreModifier: 0,
    layers: {
      luckPillar: 'neutral',
      annual: 'neutral',
      monthly: 'neutral',
      daily: 'neutral'
    }
  };

  if (luckPillarContext && annualContext && monthlyContext) {
    const lpStemElement = STEM_TO_ELEMENT[luckPillarContext.stem];
    const lpBranchElement = BRANCH_TO_ELEMENT[luckPillarContext.branch];
    const annualStemElement = STEM_TO_ELEMENT[annualContext.stem];
    const annualBranchElement = BRANCH_TO_ELEMENT[annualContext.branch];
    const monthlyStemElement = STEM_TO_ELEMENT[monthlyContext.stem];
    const monthlyBranchElement = BRANCH_TO_ELEMENT[monthlyContext.branch];

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

    const dailyUseful = stemUseful || branchUseful;
    const dailyAnnoying = stemAnnoying || branchAnnoying;

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

    // Count supportive/challenging layers
    const allStatuses = [lpStatus, annualStatus, monthlyStatus, dailyStatus];
    const supportiveCount = allStatuses.filter(s => s === 'supportive').length;
    const challengingCount = allStatuses.filter(s => s === 'challenging').length;

    if (supportiveCount === 4) {
      quadrupleCompound = {
        type: 'quadruple_synergy',
        description: 'QUADRUPLE BLESSING! All four timing layers support your Useful God!',
        scoreModifier: DAILY_SCORING_WEIGHTS.quadrupleSynergy,
        layers: { luckPillar: lpStatus, annual: annualStatus, monthly: monthlyStatus, daily: dailyStatus }
      };
    } else if (challengingCount === 4) {
      quadrupleCompound = {
        type: 'quadruple_conflict',
        description: 'Quadruple challenge - all timing layers activate Annoying God. Maximum caution.',
        scoreModifier: DAILY_SCORING_WEIGHTS.quadrupleConflict,
        layers: { luckPillar: lpStatus, annual: annualStatus, monthly: monthlyStatus, daily: dailyStatus }
      };
    } else if (supportiveCount === 3 && challengingCount === 0) {
      quadrupleCompound = {
        type: 'triple_synergy',
        description: 'Triple blessing - three timing layers support you.',
        scoreModifier: DAILY_SCORING_WEIGHTS.tripleSynergy,
        layers: { luckPillar: lpStatus, annual: annualStatus, monthly: monthlyStatus, daily: dailyStatus }
      };
    } else if (challengingCount === 3 && supportiveCount === 0) {
      quadrupleCompound = {
        type: 'triple_conflict',
        description: 'Triple challenge - three timing layers oppose you.',
        scoreModifier: DAILY_SCORING_WEIGHTS.tripleConflict,
        layers: { luckPillar: lpStatus, annual: annualStatus, monthly: monthlyStatus, daily: dailyStatus }
      };
    } else if (supportiveCount >= 2 && challengingCount === 0) {
      quadrupleCompound = {
        type: 'double_synergy',
        description: 'Double blessing - two timing layers support you.',
        scoreModifier: DAILY_SCORING_WEIGHTS.doubleSynergy,
        layers: { luckPillar: lpStatus, annual: annualStatus, monthly: monthlyStatus, daily: dailyStatus }
      };
    } else if (challengingCount >= 2 && supportiveCount === 0) {
      quadrupleCompound = {
        type: 'double_conflict',
        description: 'Double challenge - two timing layers oppose you.',
        scoreModifier: DAILY_SCORING_WEIGHTS.doubleConflict,
        layers: { luckPillar: lpStatus, annual: annualStatus, monthly: monthlyStatus, daily: dailyStatus }
      };
    } else if (supportiveCount > 0 && challengingCount > 0) {
      quadrupleCompound = {
        type: 'mixed',
        description: 'Mixed energy - some layers support, some challenge. Navigate carefully.',
        scoreModifier: 0,
        layers: { luckPillar: lpStatus, annual: annualStatus, monthly: monthlyStatus, daily: dailyStatus }
      };
    }

    if (quadrupleCompound.type !== 'neutral') {
      reasoning.push(``);
      reasoning.push(`✨ Quadruple Compound Effect: ${quadrupleCompound.type.toUpperCase()}`);
      reasoning.push(`   ${quadrupleCompound.description}`);
      reasoning.push(`   Layers: LP=${lpStatus}, Annual=${annualStatus}, Monthly=${monthlyStatus}, Daily=${dailyStatus}`);
    }
  }

  // ========================================
  // STEP 9: Shen Sha activation
  // ========================================
  const shensha: ShenshaTrigger[] = [];

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
      description: 'Day of movement and change'
    });
  }

  // Nobleman check
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
      description: 'Helpful people available today'
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
      description: 'Day favors study, exams, and intellectual pursuits'
    });
  }

  // Peach Blossom check
  const PEACH_BLOSSOM: Record<string, string> = {
    '寅': '卯', '午': '卯', '戌': '卯',
    '申': '酉', '子': '酉', '辰': '酉',
    '亥': '子', '卯': '子', '未': '子',
    '巳': '午', '酉': '午', '丑': '午'
  };

  if (PEACH_BLOSSOM[natalPillars.dayBranch] === branch) {
    shensha.push({
      name: 'Peach Blossom',
      chineseName: '桃花',
      isPositive: true,
      description: 'Day of romantic and social opportunities'
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
    dmStrengthDelta += 0.08;
    dmImpact = 'strengthens';
  }

  if (stemElement === dayMasterElement || branchElement === dayMasterElement) {
    dmStrengthDelta += 0.05;
    dmImpact = 'strengthens';
  }

  if (stemElement === CONTROLLED_BY[dayMasterElement] || branchElement === CONTROLLED_BY[dayMasterElement]) {
    dmStrengthDelta -= 0.08;
    dmImpact = 'weakens';
  }

  if (stemElement === PRODUCTION_CYCLE[dayMasterElement] || branchElement === PRODUCTION_CYCLE[dayMasterElement]) {
    dmStrengthDelta -= 0.05;
    if (dmImpact === 'neutral') dmImpact = 'weakens';
  }

  reasoning.push(``);
  reasoning.push(`💪 DM Impact: ${dmImpact} (Δ ${dmStrengthDelta > 0 ? '+' : ''}${(dmStrengthDelta * 100).toFixed(0)}%)`);

  // ========================================
  // STEP 11: Calculate final score
  // ========================================
  let score = 50; // Start neutral

  // Useful God activation
  if (stemUseful) score += DAILY_SCORING_WEIGHTS.usefulStem;
  if (branchUseful) score += DAILY_SCORING_WEIGHTS.usefulBranch;

  // Annoying God activation
  if (stemAnnoying) score += DAILY_SCORING_WEIGHTS.annoyingStem;
  if (branchAnnoying) score += DAILY_SCORING_WEIGHTS.annoyingBranch;

  // Day Officer
  if (dayOfficer.nature === 'auspicious') score += DAILY_SCORING_WEIGHTS.dayOfficerAuspicious;
  else if (dayOfficer.nature === 'inauspicious') score += DAILY_SCORING_WEIGHTS.dayOfficerInauspicious;

  // Day Clash (very important!)
  if (dayClash.hasClash) {
    if (dayClash.severity === 'major') score += DAILY_SCORING_WEIGHTS.dayClashMajor;
    else if (dayClash.severity === 'moderate') score += DAILY_SCORING_WEIGHTS.dayClashModerate;
    else score += DAILY_SCORING_WEIGHTS.dayClashMinor;
  }

  // Natal conflicts
  natalConflicts.forEach(c => {
    if (c.type === 'clash') {
      if (c.severity === 'major') score += DAILY_SCORING_WEIGHTS.natalClashMajor;
      else if (c.severity === 'moderate') score += DAILY_SCORING_WEIGHTS.natalClashModerate;
      else score += DAILY_SCORING_WEIGHTS.natalClashMinor;
    } else if (c.type === 'harm') {
      if (c.severity === 'major') score += DAILY_SCORING_WEIGHTS.natalHarmMajor;
      else if (c.severity === 'moderate') score += DAILY_SCORING_WEIGHTS.natalHarmModerate;
      else score += DAILY_SCORING_WEIGHTS.natalHarmMinor;
    } else {
      score += DAILY_SCORING_WEIGHTS.natalDestructionAny;
    }
  });

  // Timing pillar conflicts
  luckPillarConflicts.forEach(c => {
    if (c.type === 'clash') score += DAILY_SCORING_WEIGHTS.luckClash;
    else if (c.type === 'harm') score += DAILY_SCORING_WEIGHTS.luckHarm;
  });

  annualConflicts.forEach(c => {
    if (c.type === 'clash') score += DAILY_SCORING_WEIGHTS.annualClash;
    else if (c.type === 'harm') score += DAILY_SCORING_WEIGHTS.annualHarm;
  });

  monthlyConflicts.forEach(c => {
    if (c.type === 'clash') score += DAILY_SCORING_WEIGHTS.monthlyClash;
    else if (c.type === 'harm') score += DAILY_SCORING_WEIGHTS.monthlyHarm;
  });

  // Quadruple compound effect
  score += quadrupleCompound.scoreModifier;

  // Transformations
  allTransformations.forEach(t => {
    if (usefulGodResult.usefulElements.includes(t.resultElement as ElementName)) {
      score += DAILY_SCORING_WEIGHTS.transformationPositive;
    } else {
      score += DAILY_SCORING_WEIGHTS.transformationNeutral;
    }
  });

  // Shen Sha
  shensha.forEach(s => {
    score += s.isPositive ? DAILY_SCORING_WEIGHTS.shenshaPositive : DAILY_SCORING_WEIGHTS.shenshaNegative;
  });

  // DM context adjustment
  const isWeakDM = dmStrength < 1.0;
  if (isWeakDM && dmImpact === 'strengthens') {
    score += DAILY_SCORING_WEIGHTS.dmSupport;
  } else if (!isWeakDM && dmImpact === 'weakens') {
    score += DAILY_SCORING_WEIGHTS.dmSupport;
  } else if (isWeakDM && dmImpact === 'weakens') {
    score += DAILY_SCORING_WEIGHTS.dmDrain;
  } else if (!isWeakDM && dmImpact === 'strengthens') {
    score += DAILY_SCORING_WEIGHTS.dmDrain;
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
  const suitableActivities = [...dayOfficer.suitableFor];
  const avoidActivities = [...dayOfficer.avoidFor];

  if (usefulActivated.length > 0) {
    suitableActivities.push('Activities aligned with your favorable elements');
  }
  if (shensha.some(s => s.name === 'Traveling Horse')) {
    suitableActivities.push('Travel', 'Moving', 'Starting journeys');
  }
  if (shensha.some(s => s.name === 'Academic Star')) {
    suitableActivities.push('Studying', 'Taking exams', 'Learning new skills');
  }
  if (shensha.some(s => s.name === 'Peach Blossom')) {
    suitableActivities.push('Dating', 'Social events', 'Networking');
  }
  if (shensha.some(s => s.name === 'Nobleman')) {
    suitableActivities.push('Seeking help', 'Important meetings', 'Negotiations');
  }

  if (dayClash.hasClash) {
    avoidActivities.push('Major decisions', 'Confrontations');
  }
  if (annoyingActivated.length > 0) {
    avoidActivities.push('Activities related to challenging elements');
  }

  // ========================================
  // STEP 13: Generate summary and advice
  // ========================================
  const summary = generateDailySummary(
    dateDisplay, dayOfWeek, tier, usefulActivated,
    dayOfficer, dayClash, quadrupleCompound
  );
  const advice = generateDailyAdvice(
    tier, usefulActivated, annoyingActivated, natalConflicts,
    dayOfficer, dayClash, shensha, quadrupleCompound
  );

  return {
    year,
    month,
    day,
    stem,
    branch,
    pillarDisplay: `${stem}${branch}`,
    dateDisplay,
    dayOfWeek,
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
    dayOfficer,
    dayClash,
    natalConflicts,
    natalTransformations,
    luckPillarConflicts,
    luckPillarTransformations,
    annualConflicts,
    annualTransformations,
    monthlyConflicts,
    monthlyTransformations,
    quadrupleCompound,
    shensha,
    dmStrengthDelta,
    dmImpact,
    luckPillarContext: luckPillarContext || null,
    annualContext: annualContext || null,
    monthlyContext: monthlyContext || null,
    reasoning,
    summary,
    advice,
    suitableActivities: Array.from(new Set(suitableActivities)),
    avoidActivities: Array.from(new Set(avoidActivities))
  };
}

// ============================================================================
// MONTHLY DAYS COMPUTATION
// ============================================================================

/**
 * Compute favorability for all days in a month
 */
export function computeMonthlyDays(
  year: number,
  month: number,
  monthBranch: string,
  natalPillars: NatalPillarsInput,
  usefulGodResult: UsefulGodResult,
  dayMasterElement: ElementName,
  dmStrength: number,
  luckPillarContext?: CurrentLuckPillarContext,
  annualContext?: CurrentAnnualContext,
  monthlyContext?: CurrentMonthlyContext,
  today?: { year: number; month: number; day: number }
): MonthlyDaysResult {
  const days: DailyLuckFavorability[] = [];

  // Get number of days in the month
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const { stem, branch } = getDailyPillar(year, month, day);

    const dayResult = computeDailyLuckFavorability(
      { year, month, day, stem, branch },
      natalPillars,
      usefulGodResult,
      dayMasterElement,
      dmStrength,
      monthBranch,
      luckPillarContext,
      annualContext,
      monthlyContext
    );

    days.push(dayResult);
  }

  // Find best and worst
  const sorted = [...days].sort((a, b) => b.score - a.score);
  const bestDay = sorted[0] || null;
  const worstDay = sorted[sorted.length - 1] || null;

  // Find today
  let todayResult: DailyLuckFavorability | null = null;
  if (today && today.year === year && today.month === month) {
    todayResult = days.find(d => d.day === today.day) || null;
  }

  // Determine week pattern
  const weekPattern = generateWeekPattern(days);

  // Generate month summary
  const monthSummary = generateMonthDaysSummary(days, bestDay, worstDay, todayResult);

  return {
    year,
    month,
    days,
    bestDay,
    worstDay,
    todayResult,
    weekPattern,
    monthSummary
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateDailySummary(
  dateDisplay: string,
  dayOfWeek: string,
  tier: FavorabilityTier,
  useful: ElementName[],
  dayOfficer: DayOfficerInfo,
  dayClash: DayClashInfo,
  quadruple: QuadrupleCompoundEffect
): string {
  const parts: string[] = [];

  if (tier === 'excellent') {
    parts.push(`${dateDisplay} (${dayOfWeek}) is an excellent day.`);
  } else if (tier === 'good') {
    parts.push(`${dateDisplay} (${dayOfWeek}) brings favorable energy.`);
  } else if (tier === 'neutral') {
    parts.push(`${dateDisplay} (${dayOfWeek}) is balanced.`);
  } else if (tier === 'challenging') {
    parts.push(`${dateDisplay} (${dayOfWeek}) requires navigation.`);
  } else {
    parts.push(`${dateDisplay} (${dayOfWeek}) demands patience.`);
  }

  // Day Officer
  parts.push(`Day Officer: ${dayOfficer.chineseName} (${dayOfficer.name}) - ${dayOfficer.nature}.`);

  // Day Clash
  if (dayClash.hasClash) {
    parts.push(`Day Clash with ${dayClash.clashPillar} Pillar.`);
  }

  // Quadruple compound
  if (quadruple.type === 'quadruple_synergy') {
    parts.push(`All timing layers align in your favor!`);
  } else if (quadruple.type === 'quadruple_conflict') {
    parts.push(`All timing layers present challenges.`);
  }

  // Key activations
  if (useful.length > 0) {
    parts.push(`Useful God active.`);
  }

  return parts.join(' ');
}

function generateDailyAdvice(
  tier: FavorabilityTier,
  _useful: ElementName[],
  _annoying: ElementName[],
  _natalConflicts: ConflictTrigger[],
  dayOfficer: DayOfficerInfo,
  dayClash: DayClashInfo,
  shensha: ShenshaTrigger[],
  quadruple: QuadrupleCompoundEffect
): string {
  // Excellent/Good days
  if (tier === 'excellent' || tier === 'good') {
    if (shensha.some(s => s.name === 'Academic Star')) {
      return 'Excellent day for studying, exams, and intellectual pursuits.';
    }
    if (shensha.some(s => s.name === 'Traveling Horse')) {
      return 'Good day for travel, moving, and new initiatives.';
    }
    if (shensha.some(s => s.name === 'Nobleman')) {
      return 'Seek help from others today - support is available.';
    }
    if (shensha.some(s => s.name === 'Peach Blossom')) {
      return 'Excellent for romantic encounters and social events.';
    }
    if (quadruple.type === 'quadruple_synergy' || quadruple.type === 'triple_synergy') {
      return 'Maximum support! Take bold action on important matters.';
    }
    if (dayOfficer.name === 'Success') {
      return 'Day of achievement - complete important tasks and sign contracts.';
    }
    if (dayOfficer.name === 'Open') {
      return 'Day of opportunity - start new projects and make connections.';
    }
    return 'Favorable day for progress. Move forward on your goals.';
  }

  // Challenging/Difficult days
  if (tier === 'challenging' || tier === 'difficult') {
    if (dayClash.hasClash && dayClash.severity === 'major') {
      return 'Major clash day - avoid confrontations and major decisions. Stay flexible.';
    }
    if (dayOfficer.name === 'Destruction') {
      return 'Destruction day - avoid starting new things. Good for endings only.';
    }
    if (dayOfficer.name === 'Danger') {
      return 'Danger day - proceed with extreme caution. Avoid travel and surgery.';
    }
    if (dayOfficer.name === 'Close') {
      return 'Closure day - rest and reflect. Not suitable for new beginnings.';
    }
    if (quadruple.type === 'quadruple_conflict' || quadruple.type === 'triple_conflict') {
      return 'Minimize risk. Focus on maintenance, not expansion.';
    }
    return 'Patience required. Focus on small, manageable tasks.';
  }

  // Neutral days
  return 'Balanced energy. Proceed with awareness and adaptability.';
}

function generateWeekPattern(days: DailyLuckFavorability[]): string {
  // Group by day of week
  const weekdayScores: Record<string, number[]> = {
    'Monday': [], 'Tuesday': [], 'Wednesday': [], 'Thursday': [],
    'Friday': [], 'Saturday': [], 'Sunday': []
  };

  days.forEach(d => {
    weekdayScores[d.dayOfWeek]?.push(d.score);
  });

  const weekdayAverages: { day: string; avg: number }[] = Object.entries(weekdayScores)
    .filter(([_, scores]) => scores.length > 0)
    .map(([day, scores]) => ({
      day,
      avg: scores.reduce((a, b) => a + b, 0) / scores.length
    }))
    .sort((a, b) => b.avg - a.avg);

  if (weekdayAverages.length === 0) return 'Week pattern unclear.';

  const best = weekdayAverages[0];
  const worst = weekdayAverages[weekdayAverages.length - 1];

  return `Best weekday: ${best.day} (avg ${best.avg.toFixed(0)}). Most challenging: ${worst.day} (avg ${worst.avg.toFixed(0)}).`;
}

function generateMonthDaysSummary(
  days: DailyLuckFavorability[],
  best: DailyLuckFavorability | null,
  worst: DailyLuckFavorability | null,
  today: DailyLuckFavorability | null
): string {
  const parts: string[] = [];

  if (best) {
    parts.push(`Best day: ${best.dateDisplay} (${best.pillarDisplay}, score: ${best.score}).`);
  }

  if (worst) {
    parts.push(`Most challenging: ${worst.dateDisplay} (${worst.pillarDisplay}, score: ${worst.score}).`);
  }

  if (today) {
    parts.push(`Today: ${today.dateDisplay} - ${today.tier} (${today.score}).`);
  }

  // Count tiers
  const excellent = days.filter(d => d.tier === 'excellent').length;
  const good = days.filter(d => d.tier === 'good').length;
  const challenging = days.filter(d => d.tier === 'challenging' || d.tier === 'difficult').length;

  parts.push(`Month breakdown: ${excellent} excellent, ${good} good, ${challenging} challenging days.`);

  return parts.join(' ');
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Get a quick favorability rating for a single day
 */
export function getQuickDailyFavorability(
  year: number,
  month: number,
  day: number,
  usefulElements: ElementName[],
  annoyingElements: ElementName[]
): { favorable: boolean; score: number; pillar: string; reason: string } {
  const { stem, branch } = getDailyPillar(year, month, day);
  const stemElement = STEM_TO_ELEMENT[stem];
  const branchElement = BRANCH_TO_ELEMENT[branch];

  let score = 50;
  const reasons: string[] = [];

  if (usefulElements.includes(stemElement)) {
    score += 8;
    reasons.push(`${stemElement} stem supports`);
  }
  if (usefulElements.includes(branchElement)) {
    score += 6;
    reasons.push(`${branchElement} branch supports`);
  }
  if (annoyingElements.includes(stemElement)) {
    score -= 8;
    reasons.push(`${stemElement} stem challenges`);
  }
  if (annoyingElements.includes(branchElement)) {
    score -= 6;
    reasons.push(`${branchElement} branch challenges`);
  }

  return {
    favorable: score >= 50,
    score: Math.max(0, Math.min(100, score)),
    pillar: `${stem}${branch}`,
    reason: reasons.length > 0 ? reasons.join('; ') : 'Neutral day'
  };
}

/**
 * Find best days in a date range for a specific activity
 */
export function findBestDaysForActivity(
  startDate: { year: number; month: number; day: number },
  endDate: { year: number; month: number; day: number },
  activity: string,
  usefulElements: ElementName[],
  count: number = 5
): { date: string; pillar: string; score: number; dayOfficer: string }[] {
  const results: { date: string; pillar: string; score: number; dayOfficer: string }[] = [];

  const start = new Date(startDate.year, startDate.month - 1, startDate.day);
  const end = new Date(endDate.year, endDate.month - 1, endDate.day);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();

    const { stem, branch } = getDailyPillar(year, month, day);
    const stemElement = STEM_TO_ELEMENT[stem];
    const branchElement = BRANCH_TO_ELEMENT[branch];

    // Simplified month branch (would need proper calculation in production)
    const monthBranch = BRANCHES[(month + 1) % 12]; // Approximate
    const dayOfficer = getDayOfficer(year, month, day, monthBranch);

    let score = 50;

    // Useful element bonus
    if (usefulElements.includes(stemElement)) score += 10;
    if (usefulElements.includes(branchElement)) score += 8;

    // Day Officer alignment with activity
    if (dayOfficer.suitableFor.some(s => s.toLowerCase().includes(activity.toLowerCase()))) {
      score += 15;
    }
    if (dayOfficer.avoidFor.some(s => s.toLowerCase().includes(activity.toLowerCase()))) {
      score -= 15;
    }

    // Day Officer general favorability
    if (dayOfficer.nature === 'auspicious') score += 5;
    if (dayOfficer.nature === 'inauspicious') score -= 5;

    results.push({
      date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      pillar: `${stem}${branch}`,
      score: Math.max(0, Math.min(100, score)),
      dayOfficer: `${dayOfficer.chineseName} (${dayOfficer.name})`
    });
  }

  // Sort by score and return top N
  return results.sort((a, b) => b.score - a.score).slice(0, count);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  computeDailyLuckFavorability,
  computeMonthlyDays,
  getQuickDailyFavorability,
  getDailyPillar,
  getDayOfficer,
  findBestDaysForActivity,
  DAY_OFFICERS,
  DAILY_SCORING_WEIGHTS
};
