/**
 * ============================================================================
 * MONTHLY LUCK FAVORABILITY ENGINE (流月喜忌)
 * ============================================================================
 *
 * This is the FINEST classical timing layer of BaZi - month-by-month analysis.
 *
 * Each Monthly Pillar (流月) is evaluated considering:
 * - The CURRENT Luck Pillar context (大运环境)
 * - The CURRENT Annual Pillar context (流年环境)
 * - Useful God (用神) activation
 * - Annoying God (忌神) activation
 * - SEASONAL INFLUENCE (very important at monthly level)
 * - Conflicts with natal chart, luck pillar, AND annual pillar
 * - Transformations at all levels
 * - Shen Sha activation (神煞)
 * - Triple compound effects (大运 + 流年 + 流月 synergy/clash)
 *
 * The Monthly layer reveals:
 * - Which months to push forward vs. hold back
 * - Optimal timing for important decisions
 * - When to expect turbulence within a year
 * - Seasonal rhythm alignment with your chart
 *
 * Joey Yap teaching:
 * "The Luck Pillar is the climate, the Annual Pillar is the weather,
 *  and the Monthly Pillar is the daily forecast.
 *  Master monthly timing for precision life navigation."
 *
 * 五虎遁 (Five Tiger Escape) Formula:
 * The monthly stem is derived from the year stem using this classical formula:
 * - 甲/己 year → Month 1 (寅) starts with 丙
 * - 乙/庚 year → Month 1 (寅) starts with 戊
 * - 丙/辛 year → Month 1 (寅) starts with 庚
 * - 丁/壬 year → Month 1 (寅) starts with 壬
 * - 戊/癸 year → Month 1 (寅) starts with 甲
 *
 * Created: January 2026
 * Based on: Classical BaZi Monthly Pillar (流月) doctrine, Joey Yap methodology
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

// Re-export for convenience
export { STEM_TO_ELEMENT, BRANCH_TO_ELEMENT, STEM_POLARITY };

// ============================================================================
// TYPES
// ============================================================================

export interface MonthlyPillarInput {
  year: number;           // Gregorian year
  month: number;          // 1-12 (Chinese solar months)
  stem: string;           // 月干
  branch: string;         // 月支
}

export interface CurrentAnnualContext {
  year: number;
  stem: string;
  branch: string;
  tier: FavorabilityTier;
  score: number;
}

export interface TripleCompoundEffect {
  type: 'triple_synergy' | 'double_synergy' | 'double_conflict' | 'triple_conflict' | 'mixed' | 'neutral';
  description: string;
  scoreModifier: number;
  layers: {
    luckPillar: 'supportive' | 'challenging' | 'neutral';
    annual: 'supportive' | 'challenging' | 'neutral';
    monthly: 'supportive' | 'challenging' | 'neutral';
  };
}

export interface SeasonalInfluence {
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'inter-season';
  seasonElement: ElementName;
  alignment: 'strong' | 'moderate' | 'weak' | 'contrary';
  description: string;
  scoreModifier: number;
}

export interface MonthlyLuckFavorability {
  // Basic info
  year: number;
  month: number;
  stem: string;
  branch: string;
  pillarDisplay: string;
  chineseMonth: string;

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

  // Seasonal influence
  seasonalInfluence: SeasonalInfluence;

  // Interactions with natal chart
  natalConflicts: ConflictTrigger[];
  natalTransformations: TransformationTrigger[];

  // Interactions with luck pillar
  luckPillarConflicts: ConflictTrigger[];
  luckPillarTransformations: TransformationTrigger[];

  // Interactions with annual pillar
  annualConflicts: ConflictTrigger[];
  annualTransformations: TransformationTrigger[];

  // Triple compound effects (luck + annual + monthly)
  tripleCompound: TripleCompoundEffect;

  // Shen Sha
  shensha: ShenshaTrigger[];

  // DM impact
  dmStrengthDelta: number;
  dmImpact: 'strengthens' | 'weakens' | 'neutral';

  // Context
  luckPillarContext: CurrentLuckPillarContext | null;
  annualContext: CurrentAnnualContext | null;

  // Narrative
  reasoning: string[];
  summary: string;
  advice: string;
}

export interface YearlyMonthsResult {
  year: number;
  months: MonthlyLuckFavorability[];
  bestMonth: MonthlyLuckFavorability | null;
  worstMonth: MonthlyLuckFavorability | null;
  currentMonth: MonthlyLuckFavorability | null;
  seasonalPattern: string;
  yearSummary: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * Chinese month branches (fixed - months always have same branches)
 * Month 1 = 寅 (Tiger), Month 2 = 卯 (Rabbit), etc.
 */
const MONTH_BRANCHES = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];

/**
 * Month names for display
 */
const MONTH_NAMES: Record<number, { chinese: string; english: string; solar: string }> = {
  1:  { chinese: '正月', english: 'Month 1', solar: 'Feb 4 - Mar 5' },
  2:  { chinese: '二月', english: 'Month 2', solar: 'Mar 6 - Apr 4' },
  3:  { chinese: '三月', english: 'Month 3', solar: 'Apr 5 - May 5' },
  4:  { chinese: '四月', english: 'Month 4', solar: 'May 6 - Jun 5' },
  5:  { chinese: '五月', english: 'Month 5', solar: 'Jun 6 - Jul 6' },
  6:  { chinese: '六月', english: 'Month 6', solar: 'Jul 7 - Aug 7' },
  7:  { chinese: '七月', english: 'Month 7', solar: 'Aug 8 - Sep 7' },
  8:  { chinese: '八月', english: 'Month 8', solar: 'Sep 8 - Oct 7' },
  9:  { chinese: '九月', english: 'Month 9', solar: 'Oct 8 - Nov 6' },
  10: { chinese: '十月', english: 'Month 10', solar: 'Nov 7 - Dec 6' },
  11: { chinese: '十一月', english: 'Month 11', solar: 'Dec 7 - Jan 5' },
  12: { chinese: '腊月', english: 'Month 12', solar: 'Jan 6 - Feb 3' }
};

/**
 * Seasonal mapping with inter-season (土旺) periods
 * Each season has 3 months, but Earth governs the last 18 days of each season
 */
const MONTH_SEASONS: Record<number, { season: 'spring' | 'summer' | 'autumn' | 'winter' | 'inter-season'; element: ElementName }> = {
  1:  { season: 'spring', element: 'Wood' },       // 寅月 - Early Spring
  2:  { season: 'spring', element: 'Wood' },       // 卯月 - Mid Spring
  3:  { season: 'inter-season', element: 'Earth' }, // 辰月 - Late Spring (Earth transition)
  4:  { season: 'summer', element: 'Fire' },       // 巳月 - Early Summer
  5:  { season: 'summer', element: 'Fire' },       // 午月 - Mid Summer
  6:  { season: 'inter-season', element: 'Earth' }, // 未月 - Late Summer (Earth transition)
  7:  { season: 'autumn', element: 'Metal' },      // 申月 - Early Autumn
  8:  { season: 'autumn', element: 'Metal' },      // 酉月 - Mid Autumn
  9:  { season: 'inter-season', element: 'Earth' }, // 戌月 - Late Autumn (Earth transition)
  10: { season: 'winter', element: 'Water' },      // 亥月 - Early Winter
  11: { season: 'winter', element: 'Water' },      // 子月 - Mid Winter
  12: { season: 'inter-season', element: 'Earth' }  // 丑月 - Late Winter (Earth transition)
};

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
// SCORING WEIGHTS (Monthly-specific)
// ============================================================================

const MONTHLY_SCORING_WEIGHTS = {
  // Useful/Annoying God (less impactful than annual/luck)
  usefulStem: 12,
  usefulBranch: 10,
  annoyingStem: -12,
  annoyingBranch: -10,

  // Seasonal alignment (very important at monthly level!)
  seasonalStrong: 8,
  seasonalModerate: 4,
  seasonalWeak: 0,
  seasonalContrary: -6,

  // Conflicts with natal
  natalClashMajor: -8,
  natalClashModerate: -5,
  natalClashMinor: -2,
  natalHarmMajor: -5,
  natalHarmModerate: -3,
  natalHarmMinor: -1,
  natalDestructionAny: -1,

  // Conflicts with luck pillar
  luckClash: -10,
  luckHarm: -5,
  luckDestruction: -2,

  // Conflicts with annual pillar
  annualClash: -8,
  annualHarm: -4,
  annualDestruction: -2,

  // Triple compound effects
  tripleSynergy: 15,
  doubleSynergy: 8,
  doubleConflict: -8,
  tripleConflict: -12,

  // Transformations
  transformationPositive: 5,
  transformationNeutral: 2,

  // Shen Sha
  shenshaPositive: 3,
  shenshaNegative: -3,

  // DM adjustment
  dmSupport: 3,
  dmDrain: -3
};

// ============================================================================
// FIVE TIGER ESCAPE (五虎遁) FORMULA
// ============================================================================

/**
 * Calculate the monthly stem using the 五虎遁 (Five Tiger Escape) formula
 *
 * The formula determines which stem starts Month 1 (寅) based on the year stem:
 * - 甲/己 year → 丙寅 (Month 1 starts with 丙)
 * - 乙/庚 year → 戊寅 (Month 1 starts with 戊)
 * - 丙/辛 year → 庚寅 (Month 1 starts with 庚)
 * - 丁/壬 year → 壬寅 (Month 1 starts with 壬)
 * - 戊/癸 year → 甲寅 (Month 1 starts with 甲)
 */
export function getMonthStem(yearStem: string, month: number): string {
  // Starting stem for Month 1 (寅) based on year stem
  const FIVE_TIGER_MAP: Record<string, number> = {
    '甲': 2,  // 丙 (index 2)
    '己': 2,
    '乙': 4,  // 戊 (index 4)
    '庚': 4,
    '丙': 6,  // 庚 (index 6)
    '辛': 6,
    '丁': 8,  // 壬 (index 8)
    '壬': 8,
    '戊': 0,  // 甲 (index 0)
    '癸': 0
  };

  const startIndex = FIVE_TIGER_MAP[yearStem] ?? 0;
  const monthOffset = month - 1; // Month 1 = offset 0
  const stemIndex = (startIndex + monthOffset) % 10;

  return STEMS[stemIndex];
}

/**
 * Get the monthly branch (fixed for each month)
 */
export function getMonthBranch(month: number): string {
  return MONTH_BRANCHES[month - 1];
}

/**
 * Get complete monthly pillar
 */
export function getMonthlyPillar(yearStem: string, month: number): { stem: string; branch: string } {
  return {
    stem: getMonthStem(yearStem, month),
    branch: getMonthBranch(month)
  };
}

/**
 * Get Chinese month display name
 */
export function getChineseMonthName(month: number, stem: string, branch: string): string {
  const monthInfo = MONTH_NAMES[month];
  return `${monthInfo.chinese} (${stem}${branch}) - ${monthInfo.solar}`;
}

// ============================================================================
// SEASONAL ANALYSIS
// ============================================================================

/**
 * Calculate seasonal influence on the monthly favorability
 */
function calculateSeasonalInfluence(
  month: number,
  dayMasterElement: ElementName,
  usefulElements: ElementName[],
  branchElement: ElementName
): SeasonalInfluence {
  const seasonInfo = MONTH_SEASONS[month];
  const season = seasonInfo.season;
  const seasonElement = seasonInfo.element;

  // Element production/control cycles
  const PRODUCTION: Record<ElementName, ElementName> = {
    'Wood': 'Fire', 'Fire': 'Earth', 'Earth': 'Metal',
    'Metal': 'Water', 'Water': 'Wood'
  };

  const CONTROLLED_BY: Record<ElementName, ElementName> = {
    'Wood': 'Metal', 'Fire': 'Water', 'Earth': 'Wood',
    'Metal': 'Fire', 'Water': 'Earth'
  };

  let alignment: 'strong' | 'moderate' | 'weak' | 'contrary';
  let description: string;
  let scoreModifier: number;

  // Check if season element is useful
  const seasonIsUseful = usefulElements.includes(seasonElement);

  // Check relationship between season element and DM
  if (seasonElement === dayMasterElement || PRODUCTION[seasonElement] === dayMasterElement) {
    // Season supports DM
    if (seasonIsUseful) {
      alignment = 'strong';
      description = `${season} (${seasonElement}) strongly supports both your Day Master and Useful God`;
      scoreModifier = MONTHLY_SCORING_WEIGHTS.seasonalStrong;
    } else {
      alignment = 'moderate';
      description = `${season} (${seasonElement}) supports your Day Master`;
      scoreModifier = MONTHLY_SCORING_WEIGHTS.seasonalModerate;
    }
  } else if (CONTROLLED_BY[dayMasterElement] === seasonElement) {
    // Season controls DM
    alignment = 'contrary';
    description = `${season} (${seasonElement}) challenges your Day Master (${dayMasterElement})`;
    scoreModifier = MONTHLY_SCORING_WEIGHTS.seasonalContrary;
  } else {
    alignment = 'weak';
    description = `${season} (${seasonElement}) has neutral effect on your chart`;
    scoreModifier = MONTHLY_SCORING_WEIGHTS.seasonalWeak;
  }

  return {
    season,
    seasonElement,
    alignment,
    description,
    scoreModifier
  };
}

// ============================================================================
// MAIN COMPUTATION FUNCTION
// ============================================================================

/**
 * Compute favorability of a single Monthly Pillar
 */
export function computeMonthlyLuckFavorability(
  monthly: MonthlyPillarInput,
  natalPillars: NatalPillarsInput,
  usefulGodResult: UsefulGodResult,
  dayMasterElement: ElementName,
  dmStrength: number,
  luckPillarContext?: CurrentLuckPillarContext,
  annualContext?: CurrentAnnualContext
): MonthlyLuckFavorability {
  const { year, month, stem, branch } = monthly;
  const reasoning: string[] = [];

  // ========================================
  // STEP 1: Get element information
  // ========================================
  const stemElement = STEM_TO_ELEMENT[stem] || 'Earth';
  const branchElement = BRANCH_TO_ELEMENT[branch] || 'Earth';
  const monthInfo = MONTH_NAMES[month];
  const chineseMonth = getChineseMonthName(month, stem, branch);

  reasoning.push(`📅 Monthly Pillar: ${year}/${month} - ${stem}${branch} (${monthInfo.chinese})`);
  reasoning.push(`   Stem: ${stem} → ${stemElement}`);
  reasoning.push(`   Branch: ${branch} → ${branchElement}`);
  reasoning.push(`   Solar Period: ${monthInfo.solar}`);

  if (luckPillarContext) {
    reasoning.push(`   Luck Pillar: ${luckPillarContext.stem}${luckPillarContext.branch} (${luckPillarContext.tier})`);
  }
  if (annualContext) {
    reasoning.push(`   Annual: ${annualContext.stem}${annualContext.branch} (${annualContext.tier})`);
  }

  // ========================================
  // STEP 2: Useful/Annoying God activation
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
    reasoning.push(`   ○ No Useful God elements this month`);
  }
  if (annoyingActivated.length > 0) {
    reasoning.push(`   ❌ Annoying activated: ${annoyingActivated.join(', ')}`);
  }

  // ========================================
  // STEP 3: Seasonal influence
  // ========================================
  const seasonalInfluence = calculateSeasonalInfluence(
    month,
    dayMasterElement,
    usefulGodResult.usefulElements,
    branchElement
  );

  reasoning.push(``);
  reasoning.push(`🌿 Seasonal Influence:`);
  reasoning.push(`   ${seasonalInfluence.season.toUpperCase()} (${seasonalInfluence.seasonElement})`);
  reasoning.push(`   Alignment: ${seasonalInfluence.alignment} - ${seasonalInfluence.description}`);

  // ========================================
  // STEP 4: Detect conflicts with natal chart
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
        description: `${branch}${natal.branch}冲 - Month clashes ${natal.name} Pillar`
      });
    }

    if (HARM_PAIRS[branch] === natal.branch) {
      const severity = natal.name === 'Day' ? 'moderate' : 'minor';
      natalConflicts.push({
        type: 'harm',
        withPillar: natal.name,
        branches: [branch, natal.branch],
        severity,
        description: `${branch}${natal.branch}害 - Month harms ${natal.name} Pillar`
      });
    }

    if (DESTRUCTION_PAIRS[branch] === natal.branch) {
      natalConflicts.push({
        type: 'destruction',
        withPillar: natal.name,
        branches: [branch, natal.branch],
        severity: 'minor',
        description: `${branch}${natal.branch}破 - Month breaks ${natal.name} Pillar`
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
  // STEP 5: Detect conflicts with luck pillar
  // ========================================
  const luckPillarConflicts: ConflictTrigger[] = [];
  const luckPillarTransformations: TransformationTrigger[] = [];

  if (luckPillarContext) {
    const lpBranch = luckPillarContext.branch;

    if (CLASH_PAIRS[branch] === lpBranch) {
      luckPillarConflicts.push({
        type: 'clash',
        withPillar: 'Luck',
        branches: [branch, lpBranch],
        severity: 'major',
        description: `${branch}${lpBranch}冲 - Month CLASHES with Luck Pillar!`
      });
    }

    if (HARM_PAIRS[branch] === lpBranch) {
      luckPillarConflicts.push({
        type: 'harm',
        withPillar: 'Luck',
        branches: [branch, lpBranch],
        severity: 'moderate',
        description: `${branch}${lpBranch}害 - Month harms Luck Pillar`
      });
    }

    // Check transformations with luck pillar
    const lpCombination = SIX_COMBINATIONS[branch];
    if (lpCombination && lpBranch === lpCombination.partner) {
      luckPillarTransformations.push({
        type: 'Six Combination (六合)',
        pillarsInvolved: [`Month:${branch}`, `Luck:${lpBranch}`],
        resultElement: lpCombination.result,
        description: `${branch}${lpBranch}合 → ${lpCombination.result}`
      });
    }
  }

  // ========================================
  // STEP 6: Detect conflicts with annual pillar
  // ========================================
  const annualConflicts: ConflictTrigger[] = [];
  const annualTransformations: TransformationTrigger[] = [];

  if (annualContext) {
    const annualBranch = annualContext.branch;

    if (CLASH_PAIRS[branch] === annualBranch) {
      annualConflicts.push({
        type: 'clash',
        withPillar: 'Annual',
        branches: [branch, annualBranch],
        severity: 'major',
        description: `${branch}${annualBranch}冲 - Month CLASHES with Annual Pillar!`
      });
    }

    if (HARM_PAIRS[branch] === annualBranch) {
      annualConflicts.push({
        type: 'harm',
        withPillar: 'Annual',
        branches: [branch, annualBranch],
        severity: 'moderate',
        description: `${branch}${annualBranch}害 - Month harms Annual Pillar`
      });
    }

    // Check transformations with annual
    const annualCombination = SIX_COMBINATIONS[branch];
    if (annualCombination && annualBranch === annualCombination.partner) {
      annualTransformations.push({
        type: 'Six Combination (六合)',
        pillarsInvolved: [`Month:${branch}`, `Annual:${annualBranch}`],
        resultElement: annualCombination.result,
        description: `${branch}${annualBranch}合 → ${annualCombination.result}`
      });
    }
  }

  if (luckPillarConflicts.length > 0 || annualConflicts.length > 0) {
    reasoning.push(``);
    reasoning.push(`🔥 Timing Layer Conflicts:`);
    luckPillarConflicts.forEach(c => {
      reasoning.push(`   LUCK: ${c.description}`);
    });
    annualConflicts.forEach(c => {
      reasoning.push(`   ANNUAL: ${c.description}`);
    });
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
          pillarsInvolved: [`Month:${branch}`, `${natal.name}:${natal.branch}`],
          resultElement: combination.result,
          description: `${branch}${natal.branch}合 → ${combination.result}`
        });
      }
    }
  }

  const allTransformations = [...natalTransformations, ...luckPillarTransformations, ...annualTransformations];
  if (allTransformations.length > 0) {
    reasoning.push(``);
    reasoning.push(`🔄 Transformations:`);
    allTransformations.forEach(t => {
      reasoning.push(`   ${t.description}`);
    });
  }

  // ========================================
  // STEP 8: Triple compound effect analysis
  // ========================================
  let tripleCompound: TripleCompoundEffect = {
    type: 'neutral',
    description: 'Standard monthly energy - no special compound effects.',
    scoreModifier: 0,
    layers: {
      luckPillar: 'neutral',
      annual: 'neutral',
      monthly: 'neutral'
    }
  };

  if (luckPillarContext && annualContext) {
    const lpStemElement = STEM_TO_ELEMENT[luckPillarContext.stem];
    const lpBranchElement = BRANCH_TO_ELEMENT[luckPillarContext.branch];
    const annualStemElement = STEM_TO_ELEMENT[annualContext.stem];
    const annualBranchElement = BRANCH_TO_ELEMENT[annualContext.branch];

    // Evaluate each layer
    const lpUseful = usefulGodResult.usefulElements.includes(lpStemElement) ||
                     usefulGodResult.usefulElements.includes(lpBranchElement);
    const lpAnnoying = usefulGodResult.annoyingElements.includes(lpStemElement) ||
                       usefulGodResult.annoyingElements.includes(lpBranchElement);

    const annualUseful = usefulGodResult.usefulElements.includes(annualStemElement) ||
                         usefulGodResult.usefulElements.includes(annualBranchElement);
    const annualAnnoying = usefulGodResult.annoyingElements.includes(annualStemElement) ||
                           usefulGodResult.annoyingElements.includes(annualBranchElement);

    const monthlyUseful = stemUseful || branchUseful;
    const monthlyAnnoying = stemAnnoying || branchAnnoying;

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

    // Count supportive/challenging layers
    const supportiveCount = [lpStatus, annualStatus, monthlyStatus].filter(s => s === 'supportive').length;
    const challengingCount = [lpStatus, annualStatus, monthlyStatus].filter(s => s === 'challenging').length;

    if (supportiveCount === 3) {
      tripleCompound = {
        type: 'triple_synergy',
        description: 'TRIPLE BLESSING! Luck Pillar + Annual + Month ALL support your Useful God!',
        scoreModifier: MONTHLY_SCORING_WEIGHTS.tripleSynergy,
        layers: { luckPillar: lpStatus, annual: annualStatus, monthly: monthlyStatus }
      };
    } else if (challengingCount === 3) {
      tripleCompound = {
        type: 'triple_conflict',
        description: 'Triple challenge - all timing layers activate Annoying God. Exercise maximum caution.',
        scoreModifier: MONTHLY_SCORING_WEIGHTS.tripleConflict,
        layers: { luckPillar: lpStatus, annual: annualStatus, monthly: monthlyStatus }
      };
    } else if (supportiveCount === 2 && challengingCount === 0) {
      tripleCompound = {
        type: 'double_synergy',
        description: 'Double blessing - two timing layers support you.',
        scoreModifier: MONTHLY_SCORING_WEIGHTS.doubleSynergy,
        layers: { luckPillar: lpStatus, annual: annualStatus, monthly: monthlyStatus }
      };
    } else if (challengingCount === 2 && supportiveCount === 0) {
      tripleCompound = {
        type: 'double_conflict',
        description: 'Double challenge - two timing layers oppose you.',
        scoreModifier: MONTHLY_SCORING_WEIGHTS.doubleConflict,
        layers: { luckPillar: lpStatus, annual: annualStatus, monthly: monthlyStatus }
      };
    } else if (supportiveCount > 0 && challengingCount > 0) {
      tripleCompound = {
        type: 'mixed',
        description: 'Mixed energy - some layers support, some challenge. Navigate carefully.',
        scoreModifier: 0,
        layers: { luckPillar: lpStatus, annual: annualStatus, monthly: monthlyStatus }
      };
    }

    if (tripleCompound.type !== 'neutral') {
      reasoning.push(``);
      reasoning.push(`✨ Triple Compound Effect: ${tripleCompound.type.toUpperCase()}`);
      reasoning.push(`   ${tripleCompound.description}`);
      reasoning.push(`   Layers: LP=${lpStatus}, Annual=${annualStatus}, Month=${monthlyStatus}`);
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
      description: 'Month of movement and change'
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
      description: 'Helpful people available this month'
    });
  }

  // Academic Star (文昌) - for intellectual months
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
      description: 'Month favors study, exams, and intellectual pursuits'
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
    dmStrengthDelta += 0.10;
    dmImpact = 'strengthens';
  }

  if (stemElement === dayMasterElement || branchElement === dayMasterElement) {
    dmStrengthDelta += 0.06;
    dmImpact = 'strengthens';
  }

  if (stemElement === CONTROLLED_BY[dayMasterElement] || branchElement === CONTROLLED_BY[dayMasterElement]) {
    dmStrengthDelta -= 0.10;
    dmImpact = 'weakens';
  }

  if (stemElement === PRODUCTION_CYCLE[dayMasterElement] || branchElement === PRODUCTION_CYCLE[dayMasterElement]) {
    dmStrengthDelta -= 0.06;
    if (dmImpact === 'neutral') dmImpact = 'weakens';
  }

  reasoning.push(``);
  reasoning.push(`💪 DM Impact: ${dmImpact} (Δ ${dmStrengthDelta > 0 ? '+' : ''}${(dmStrengthDelta * 100).toFixed(0)}%)`);

  // ========================================
  // STEP 11: Calculate final score
  // ========================================
  let score = 50; // Start neutral

  // Useful God activation
  if (stemUseful) score += MONTHLY_SCORING_WEIGHTS.usefulStem;
  if (branchUseful) score += MONTHLY_SCORING_WEIGHTS.usefulBranch;

  // Annoying God activation
  if (stemAnnoying) score += MONTHLY_SCORING_WEIGHTS.annoyingStem;
  if (branchAnnoying) score += MONTHLY_SCORING_WEIGHTS.annoyingBranch;

  // Seasonal influence
  score += seasonalInfluence.scoreModifier;

  // Natal conflicts
  natalConflicts.forEach(c => {
    if (c.type === 'clash') {
      if (c.severity === 'major') score += MONTHLY_SCORING_WEIGHTS.natalClashMajor;
      else if (c.severity === 'moderate') score += MONTHLY_SCORING_WEIGHTS.natalClashModerate;
      else score += MONTHLY_SCORING_WEIGHTS.natalClashMinor;
    } else if (c.type === 'harm') {
      if (c.severity === 'major') score += MONTHLY_SCORING_WEIGHTS.natalHarmMajor;
      else if (c.severity === 'moderate') score += MONTHLY_SCORING_WEIGHTS.natalHarmModerate;
      else score += MONTHLY_SCORING_WEIGHTS.natalHarmMinor;
    } else {
      score += MONTHLY_SCORING_WEIGHTS.natalDestructionAny;
    }
  });

  // Luck pillar conflicts
  luckPillarConflicts.forEach(c => {
    if (c.type === 'clash') score += MONTHLY_SCORING_WEIGHTS.luckClash;
    else if (c.type === 'harm') score += MONTHLY_SCORING_WEIGHTS.luckHarm;
    else score += MONTHLY_SCORING_WEIGHTS.luckDestruction;
  });

  // Annual conflicts
  annualConflicts.forEach(c => {
    if (c.type === 'clash') score += MONTHLY_SCORING_WEIGHTS.annualClash;
    else if (c.type === 'harm') score += MONTHLY_SCORING_WEIGHTS.annualHarm;
    else score += MONTHLY_SCORING_WEIGHTS.annualDestruction;
  });

  // Triple compound effect
  score += tripleCompound.scoreModifier;

  // Transformations
  allTransformations.forEach(t => {
    if (usefulGodResult.usefulElements.includes(t.resultElement as ElementName)) {
      score += MONTHLY_SCORING_WEIGHTS.transformationPositive;
    } else {
      score += MONTHLY_SCORING_WEIGHTS.transformationNeutral;
    }
  });

  // Shen Sha
  shensha.forEach(s => {
    score += s.isPositive ? MONTHLY_SCORING_WEIGHTS.shenshaPositive : MONTHLY_SCORING_WEIGHTS.shenshaNegative;
  });

  // DM context adjustment
  const isWeakDM = dmStrength < 1.0;
  if (isWeakDM && dmImpact === 'strengthens') {
    score += MONTHLY_SCORING_WEIGHTS.dmSupport;
  } else if (!isWeakDM && dmImpact === 'weakens') {
    score += MONTHLY_SCORING_WEIGHTS.dmSupport;
  } else if (isWeakDM && dmImpact === 'weakens') {
    score += MONTHLY_SCORING_WEIGHTS.dmDrain;
  } else if (!isWeakDM && dmImpact === 'strengthens') {
    score += MONTHLY_SCORING_WEIGHTS.dmDrain;
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
  // STEP 12: Generate summary and advice
  // ========================================
  const summary = generateMonthlySummary(
    month, score, tier, usefulActivated, annoyingActivated,
    seasonalInfluence, tripleCompound, luckPillarContext, annualContext
  );
  const advice = generateMonthlyAdvice(
    tier, usefulActivated, annoyingActivated, natalConflicts,
    luckPillarConflicts, annualConflicts, shensha, seasonalInfluence, tripleCompound
  );

  return {
    year,
    month,
    stem,
    branch,
    pillarDisplay: `${stem}${branch}`,
    chineseMonth,
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
    seasonalInfluence,
    natalConflicts,
    natalTransformations,
    luckPillarConflicts,
    luckPillarTransformations,
    annualConflicts,
    annualTransformations,
    tripleCompound,
    shensha,
    dmStrengthDelta,
    dmImpact,
    luckPillarContext: luckPillarContext || null,
    annualContext: annualContext || null,
    reasoning,
    summary,
    advice
  };
}

// ============================================================================
// YEARLY MONTHS COMPUTATION
// ============================================================================

/**
 * Compute favorability for all 12 months of a year
 */
export function computeYearlyMonths(
  year: number,
  yearStem: string,
  natalPillars: NatalPillarsInput,
  usefulGodResult: UsefulGodResult,
  dayMasterElement: ElementName,
  dmStrength: number,
  luckPillarContext?: CurrentLuckPillarContext,
  annualContext?: CurrentAnnualContext,
  currentMonth?: number
): YearlyMonthsResult {
  const months: MonthlyLuckFavorability[] = [];

  for (let month = 1; month <= 12; month++) {
    const { stem, branch } = getMonthlyPillar(yearStem, month);

    const monthResult = computeMonthlyLuckFavorability(
      { year, month, stem, branch },
      natalPillars,
      usefulGodResult,
      dayMasterElement,
      dmStrength,
      luckPillarContext,
      annualContext
    );

    months.push(monthResult);
  }

  // Find best and worst
  const sorted = [...months].sort((a, b) => b.score - a.score);
  const bestMonth = sorted[0] || null;
  const worstMonth = sorted[sorted.length - 1] || null;

  // Find current month
  let currentMonthResult: MonthlyLuckFavorability | null = null;
  if (currentMonth !== undefined) {
    currentMonthResult = months.find(m => m.month === currentMonth) || null;
  }

  // Determine seasonal pattern
  const seasonalPattern = generateSeasonalPattern(months);

  // Generate year summary
  const yearSummary = generateYearMonthsSummary(months, bestMonth, worstMonth, currentMonthResult);

  return {
    year,
    months,
    bestMonth,
    worstMonth,
    currentMonth: currentMonthResult,
    seasonalPattern,
    yearSummary
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateMonthlySummary(
  month: number,
  score: number,
  tier: FavorabilityTier,
  useful: ElementName[],
  annoying: ElementName[],
  seasonal: SeasonalInfluence,
  triple: TripleCompoundEffect,
  luckContext: CurrentLuckPillarContext | null,
  annualContext: CurrentAnnualContext | null
): string {
  const monthInfo = MONTH_NAMES[month];
  const parts: string[] = [];

  if (tier === 'excellent') {
    parts.push(`${monthInfo.chinese} is an outstanding month.`);
  } else if (tier === 'good') {
    parts.push(`${monthInfo.chinese} brings favorable energy.`);
  } else if (tier === 'neutral') {
    parts.push(`${monthInfo.chinese} is balanced.`);
  } else if (tier === 'challenging') {
    parts.push(`${monthInfo.chinese} requires navigation.`);
  } else {
    parts.push(`${monthInfo.chinese} demands patience.`);
  }

  // Triple compound
  if (triple.type === 'triple_synergy') {
    parts.push(`All timing layers align in your favor!`);
  } else if (triple.type === 'triple_conflict') {
    parts.push(`All timing layers present challenges.`);
  }

  // Seasonal
  if (seasonal.alignment === 'strong') {
    parts.push(`${seasonal.season} energy supports you.`);
  } else if (seasonal.alignment === 'contrary') {
    parts.push(`Seasonal energy challenges your chart.`);
  }

  // Key activations
  if (useful.length > 0) {
    parts.push(`Useful God active.`);
  }

  return parts.join(' ');
}

function generateMonthlyAdvice(
  tier: FavorabilityTier,
  useful: ElementName[],
  annoying: ElementName[],
  natalConflicts: ConflictTrigger[],
  luckConflicts: ConflictTrigger[],
  annualConflicts: ConflictTrigger[],
  shensha: ShenshaTrigger[],
  seasonal: SeasonalInfluence,
  triple: TripleCompoundEffect
): string {
  // Excellent/Good months
  if (tier === 'excellent' || tier === 'good') {
    if (shensha.some(s => s.name === 'Academic Star')) {
      return 'Excellent month for exams, learning, and intellectual pursuits.';
    }
    if (shensha.some(s => s.name === 'Traveling Horse')) {
      return 'Good month for travel, change, and new initiatives.';
    }
    if (shensha.some(s => s.name === 'Nobleman')) {
      return 'Seek help from others - support is available.';
    }
    if (triple.type === 'triple_synergy') {
      return 'Maximum support! Take bold action on important matters.';
    }
    return 'Favorable month for progress. Move forward on your goals.';
  }

  // Challenging/Difficult months
  if (tier === 'challenging' || tier === 'difficult') {
    const allConflicts = [...natalConflicts, ...luckConflicts, ...annualConflicts];
    if (allConflicts.some(c => c.type === 'clash')) {
      return 'Expect disruptions. Stay flexible and avoid confrontations.';
    }
    if (triple.type === 'triple_conflict') {
      return 'Minimize risk. Focus on maintenance, not expansion.';
    }
    if (seasonal.alignment === 'contrary') {
      return 'Seasonal energy opposes you. Conserve energy and wait.';
    }
    return 'Patience required. Focus on small, manageable tasks.';
  }

  // Neutral months
  return 'Balanced energy. Proceed with awareness and adaptability.';
}

function generateSeasonalPattern(months: MonthlyLuckFavorability[]): string {
  const seasonScores: Record<string, number[]> = {
    spring: [],
    summer: [],
    autumn: [],
    winter: [],
    'inter-season': []
  };

  months.forEach(m => {
    seasonScores[m.seasonalInfluence.season].push(m.score);
  });

  const seasonAverages: { season: string; avg: number }[] = Object.entries(seasonScores)
    .filter(([_, scores]) => scores.length > 0)
    .map(([season, scores]) => ({
      season,
      avg: scores.reduce((a, b) => a + b, 0) / scores.length
    }))
    .sort((a, b) => b.avg - a.avg);

  if (seasonAverages.length === 0) return 'Seasonal pattern unclear.';

  const best = seasonAverages[0];
  const worst = seasonAverages[seasonAverages.length - 1];

  return `Best season: ${best.season} (avg ${best.avg.toFixed(0)}). Most challenging: ${worst.season} (avg ${worst.avg.toFixed(0)}).`;
}

function generateYearMonthsSummary(
  months: MonthlyLuckFavorability[],
  best: MonthlyLuckFavorability | null,
  worst: MonthlyLuckFavorability | null,
  current: MonthlyLuckFavorability | null
): string {
  const parts: string[] = [];

  if (best) {
    parts.push(`Peak: ${MONTH_NAMES[best.month].chinese} (score: ${best.score}).`);
  }

  if (worst) {
    parts.push(`Challenging: ${MONTH_NAMES[worst.month].chinese} (score: ${worst.score}).`);
  }

  if (current) {
    parts.push(`Current: ${MONTH_NAMES[current.month].chinese} - ${current.tier} (${current.score}).`);
  }

  // Count tiers
  const excellent = months.filter(m => m.tier === 'excellent').length;
  const good = months.filter(m => m.tier === 'good').length;
  const challenging = months.filter(m => m.tier === 'challenging' || m.tier === 'difficult').length;

  parts.push(`Year breakdown: ${excellent} excellent, ${good} good, ${challenging} challenging months.`);

  return parts.join(' ');
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Get a quick favorability rating for a single month
 */
export function getQuickMonthlyFavorability(
  yearStem: string,
  month: number,
  usefulElements: ElementName[],
  annoyingElements: ElementName[]
): { favorable: boolean; score: number; pillar: string; reason: string } {
  const { stem, branch } = getMonthlyPillar(yearStem, month);
  const stemElement = STEM_TO_ELEMENT[stem];
  const branchElement = BRANCH_TO_ELEMENT[branch];

  let score = 50;
  const reasons: string[] = [];

  if (usefulElements.includes(stemElement)) {
    score += 12;
    reasons.push(`${stemElement} stem supports`);
  }
  if (usefulElements.includes(branchElement)) {
    score += 10;
    reasons.push(`${branchElement} branch supports`);
  }
  if (annoyingElements.includes(stemElement)) {
    score -= 12;
    reasons.push(`${stemElement} stem challenges`);
  }
  if (annoyingElements.includes(branchElement)) {
    score -= 10;
    reasons.push(`${branchElement} branch challenges`);
  }

  return {
    favorable: score >= 50,
    score: Math.max(0, Math.min(100, score)),
    pillar: `${stem}${branch}`,
    reason: reasons.length > 0 ? reasons.join('; ') : 'Neutral month'
  };
}

/**
 * Convert Gregorian month to Chinese solar month (approximate)
 * Note: Actual conversion requires solar term dates
 */
export function gregorianToChineseMonth(gregorianMonth: number): number {
  // Approximate mapping (Chinese months start ~Feb 4)
  // Jan = Month 12, Feb = Month 1, Mar = Month 2, etc.
  const mapping: Record<number, number> = {
    1: 12, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5,
    7: 6, 8: 7, 9: 8, 10: 9, 11: 10, 12: 11
  };
  return mapping[gregorianMonth];
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  computeMonthlyLuckFavorability,
  computeYearlyMonths,
  getQuickMonthlyFavorability,
  getMonthlyPillar,
  getMonthStem,
  getMonthBranch,
  getChineseMonthName,
  gregorianToChineseMonth,
  MONTH_NAMES,
  MONTH_SEASONS
};
