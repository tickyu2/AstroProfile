/**
 * ============================================================================
 * ANNUAL LUCK FAVORABILITY ENGINE (流年喜忌)
 * ============================================================================
 *
 * This is the YEARLY LAYER of BaZi timing - fine-grained year-by-year analysis.
 *
 * Each Annual Pillar (流年) is evaluated considering:
 * - The CURRENT Luck Pillar context (大运环境)
 * - Useful God (用神) activation
 * - Annoying God (忌神) activation
 * - Conflicts with BOTH natal chart AND current luck pillar
 * - Transformations with natal + luck pillar
 * - Shen Sha activation (神煞)
 * - Compound effects (大运+流年 synergy/clash)
 *
 * The Annual layer reveals:
 * - Why certain years feel smooth within a good decade
 * - Why certain years feel rough even in a favorable decade
 * - The "hidden years" of breakthrough or crisis
 * - Month-by-month activation patterns (optional)
 *
 * Joey Yap teaching:
 * "The Luck Pillar is the climate; the Annual Pillar is the weather.
 *  A good year in a bad decade can still shine through.
 *  A bad year in a good decade is just a passing storm."
 *
 * Created: January 2026
 * Based on: Classical BaZi Annual Pillar (流年) doctrine, Joey Yap methodology
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

// Re-export for convenience
export { STEM_TO_ELEMENT, BRANCH_TO_ELEMENT, STEM_POLARITY };

// ============================================================================
// TYPES
// ============================================================================

export interface AnnualPillarInput {
  year: number;           // Gregorian year (e.g., 2026)
  stem: string;           // 天干
  branch: string;         // 地支
}

export interface CurrentLuckPillarContext {
  stem: string;
  branch: string;
  startAge: number;
  endAge: number;
  tier: FavorabilityTier;
  score: number;
}

export interface CompoundEffect {
  type: 'synergy' | 'conflict' | 'neutral';
  description: string;
  scoreModifier: number;
}

export interface AnnualLuckFavorability {
  // Basic info
  year: number;
  stem: string;
  branch: string;
  pillarDisplay: string;
  chineseYear: string;

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

  // Interactions with natal chart
  natalConflicts: ConflictTrigger[];
  natalTransformations: TransformationTrigger[];

  // Interactions with luck pillar
  luckPillarConflicts: ConflictTrigger[];
  luckPillarTransformations: TransformationTrigger[];

  // Compound effects (luck pillar + annual synergy/clash)
  compoundEffect: CompoundEffect;

  // Shen Sha
  shensha: ShenshaTrigger[];

  // DM impact
  dmStrengthDelta: number;
  dmImpact: 'strengthens' | 'weakens' | 'neutral';

  // Context
  luckPillarContext: CurrentLuckPillarContext | null;

  // Narrative
  reasoning: string[];
  summary: string;
  advice: string;
  monthHighlights: MonthHighlight[];
}

export interface MonthHighlight {
  month: number;          // 1-12
  monthStem: string;
  monthBranch: string;
  isSignificant: boolean;
  reason: string;
}

export interface AnnualTimelineResult {
  years: AnnualLuckFavorability[];
  bestYear: AnnualLuckFavorability | null;
  worstYear: AnnualLuckFavorability | null;
  currentYear: AnnualLuckFavorability | null;
  overallPattern: string;
  periodSummary: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * The 60-year cycle (六十甲子) - Stem-Branch combinations
 */
const SIXTY_JIAZI: string[] = [
  '甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉',
  '甲戌', '乙亥', '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未',
  '甲申', '乙酉', '丙戌', '丁亥', '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳',
  '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥', '庚子', '辛丑', '壬寅', '癸卯',
  '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥', '壬子', '癸丑',
  '甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥'
];

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * Chinese zodiac names for display
 */
const BRANCH_ZODIAC: Record<string, string> = {
  '子': 'Rat', '丑': 'Ox', '寅': 'Tiger', '卯': 'Rabbit',
  '辰': 'Dragon', '巳': 'Snake', '午': 'Horse', '未': 'Goat',
  '申': 'Monkey', '酉': 'Rooster', '戌': 'Dog', '亥': 'Pig'
};

// ============================================================================
// CLASH/HARM/TRANSFORMATION PAIRS
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
// SCORING WEIGHTS (Annual-specific)
// ============================================================================

const ANNUAL_SCORING_WEIGHTS = {
  // Useful/Annoying God (slightly less impactful than luck pillar)
  usefulStem: 15,
  usefulBranch: 12,
  annoyingStem: -15,
  annoyingBranch: -12,

  // Conflicts with natal
  natalClashMajor: -10,
  natalClashModerate: -6,
  natalClashMinor: -3,
  natalHarmMajor: -6,
  natalHarmModerate: -4,
  natalHarmMinor: -2,
  natalDestructionAny: -2,

  // Conflicts with luck pillar (important!)
  luckClash: -12,           // Annual clashing luck pillar is significant
  luckHarm: -6,
  luckDestruction: -3,

  // Compound effects
  compoundSynergy: 10,      // Annual + Luck working together
  compoundConflict: -8,     // Annual + Luck opposing

  // Transformations
  transformationPositive: 6,
  transformationNeutral: 2,

  // Shen Sha
  shenshaPositive: 4,
  shenshaNegative: -4,

  // DM adjustment
  dmSupport: 4,
  dmDrain: -4
};

// ============================================================================
// YEAR CALCULATION HELPERS
// ============================================================================

/**
 * Get the stem and branch for a given Gregorian year
 */
export function getAnnualPillar(year: number): { stem: string; branch: string } {
  // The 60-year cycle reference: 1984 = 甲子 (index 0)
  // Formula: (year - 4) % 60 gives the cycle position
  const cyclePosition = ((year - 4) % 60 + 60) % 60;
  const stemIndex = cyclePosition % 10;
  const branchIndex = cyclePosition % 12;

  return {
    stem: STEMS[stemIndex],
    branch: BRANCHES[branchIndex]
  };
}

/**
 * Get Chinese year name with zodiac
 */
export function getChineseYearName(stem: string, branch: string): string {
  return `${stem}${branch}年 (${BRANCH_ZODIAC[branch]} Year)`;
}

// ============================================================================
// MAIN COMPUTATION FUNCTION
// ============================================================================

/**
 * Compute favorability of a single Annual Pillar
 */
export function computeAnnualLuckFavorability(
  annual: AnnualPillarInput,
  natalPillars: NatalPillarsInput,
  usefulGodResult: UsefulGodResult,
  dayMasterElement: ElementName,
  dmStrength: number,
  luckPillarContext?: CurrentLuckPillarContext
): AnnualLuckFavorability {
  const { year, stem, branch } = annual;
  const reasoning: string[] = [];

  // ========================================
  // STEP 1: Get element information
  // ========================================
  const stemElement = STEM_TO_ELEMENT[stem] || 'Earth';
  const branchElement = BRANCH_TO_ELEMENT[branch] || 'Earth';
  const chineseYear = getChineseYearName(stem, branch);

  reasoning.push(`📅 Annual Pillar ${year}: ${stem}${branch} (${BRANCH_ZODIAC[branch]} Year)`);
  reasoning.push(`   Stem: ${stem} → ${stemElement}`);
  reasoning.push(`   Branch: ${branch} → ${branchElement}`);

  if (luckPillarContext) {
    reasoning.push(`   Within Luck Pillar: ${luckPillarContext.stem}${luckPillarContext.branch} (Age ${luckPillarContext.startAge}-${luckPillarContext.endAge}, ${luckPillarContext.tier})`);
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
    reasoning.push(`   ○ No Useful God elements this year`);
  }
  if (annoyingActivated.length > 0) {
    reasoning.push(`   ❌ Annoying activated: ${annoyingActivated.join(', ')}`);
  }

  // ========================================
  // STEP 3: Detect conflicts with natal chart
  // ========================================
  const natalConflicts: ConflictTrigger[] = [];
  const natalBranches = [
    { name: 'Year', branch: natalPillars.yearBranch },
    { name: 'Month', branch: natalPillars.monthBranch },
    { name: 'Day', branch: natalPillars.dayBranch },
    { name: 'Hour', branch: natalPillars.hourBranch }
  ];

  for (const natal of natalBranches) {
    // Check clash
    if (CLASH_PAIRS[branch] === natal.branch) {
      const severity = natal.name === 'Day' ? 'major' : (natal.name === 'Month' ? 'moderate' : 'minor');
      natalConflicts.push({
        type: 'clash',
        withPillar: natal.name,
        branches: [branch, natal.branch],
        severity,
        description: `${branch}${natal.branch}冲 - Annual clashes ${natal.name} Pillar`
      });
    }

    // Check harm
    if (HARM_PAIRS[branch] === natal.branch) {
      const severity = natal.name === 'Day' ? 'moderate' : 'minor';
      natalConflicts.push({
        type: 'harm',
        withPillar: natal.name,
        branches: [branch, natal.branch],
        severity,
        description: `${branch}${natal.branch}害 - Annual harms ${natal.name} Pillar`
      });
    }

    // Check destruction
    if (DESTRUCTION_PAIRS[branch] === natal.branch) {
      natalConflicts.push({
        type: 'destruction',
        withPillar: natal.name,
        branches: [branch, natal.branch],
        severity: 'minor',
        description: `${branch}${natal.branch}破 - Annual breaks ${natal.name} Pillar`
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
  // STEP 4: Detect conflicts with luck pillar
  // ========================================
  const luckPillarConflicts: ConflictTrigger[] = [];

  if (luckPillarContext) {
    const lpBranch = luckPillarContext.branch;

    // Clash with luck pillar
    if (CLASH_PAIRS[branch] === lpBranch) {
      luckPillarConflicts.push({
        type: 'clash',
        withPillar: 'Luck',
        branches: [branch, lpBranch],
        severity: 'major',
        description: `${branch}${lpBranch}冲 - Annual CLASHES with Luck Pillar! Year may disrupt decade's energy.`
      });
    }

    // Harm with luck pillar
    if (HARM_PAIRS[branch] === lpBranch) {
      luckPillarConflicts.push({
        type: 'harm',
        withPillar: 'Luck',
        branches: [branch, lpBranch],
        severity: 'moderate',
        description: `${branch}${lpBranch}害 - Annual harms Luck Pillar. Subtle friction this year.`
      });
    }

    // Destruction with luck pillar
    if (DESTRUCTION_PAIRS[branch] === lpBranch) {
      luckPillarConflicts.push({
        type: 'destruction',
        withPillar: 'Luck',
        branches: [branch, lpBranch],
        severity: 'minor',
        description: `${branch}${lpBranch}破 - Minor disruption to decade energy.`
      });
    }

    if (luckPillarConflicts.length > 0) {
      reasoning.push(``);
      reasoning.push(`🔥 Luck Pillar Conflicts:`);
      luckPillarConflicts.forEach(c => {
        reasoning.push(`   ${c.severity.toUpperCase()}: ${c.description}`);
      });
    }
  }

  // ========================================
  // STEP 5: Detect transformations
  // ========================================
  const natalTransformations: TransformationTrigger[] = [];
  const luckPillarTransformations: TransformationTrigger[] = [];

  const combination = SIX_COMBINATIONS[branch];
  if (combination) {
    // Check transformations with natal pillars
    for (const natal of natalBranches) {
      if (natal.branch === combination.partner) {
        natalTransformations.push({
          type: 'Six Combination (六合)',
          pillarsInvolved: [`Annual:${branch}`, `${natal.name}:${natal.branch}`],
          resultElement: combination.result,
          description: `${branch}${natal.branch}合 → ${combination.result}`
        });
      }
    }

    // Check transformations with luck pillar
    if (luckPillarContext && luckPillarContext.branch === combination.partner) {
      luckPillarTransformations.push({
        type: 'Six Combination with Luck (六合)',
        pillarsInvolved: [`Annual:${branch}`, `Luck:${luckPillarContext.branch}`],
        resultElement: combination.result,
        description: `${branch}${luckPillarContext.branch}合 → ${combination.result} (Annual + Luck Pillar combine!)`
      });
    }
  }

  if (natalTransformations.length > 0 || luckPillarTransformations.length > 0) {
    reasoning.push(``);
    reasoning.push(`🔄 Transformations:`);
    natalTransformations.forEach(t => {
      reasoning.push(`   ${t.description}`);
    });
    luckPillarTransformations.forEach(t => {
      reasoning.push(`   ⭐ ${t.description}`);
    });
  }

  // ========================================
  // STEP 6: Compound effect analysis
  // ========================================
  let compoundEffect: CompoundEffect = {
    type: 'neutral',
    description: 'Annual and Luck Pillar operating independently.',
    scoreModifier: 0
  };

  if (luckPillarContext) {
    const lpStemElement = STEM_TO_ELEMENT[luckPillarContext.stem];
    const lpBranchElement = BRANCH_TO_ELEMENT[luckPillarContext.branch];

    // Check synergy - same useful elements or complementary
    const lpUseful = usefulGodResult.usefulElements.includes(lpStemElement) ||
                     usefulGodResult.usefulElements.includes(lpBranchElement);
    const annualUseful = stemUseful || branchUseful;

    if (lpUseful && annualUseful) {
      // Both luck pillar and annual bring useful energy
      compoundEffect = {
        type: 'synergy',
        description: 'Double blessing! Both Luck Pillar and Annual activate Useful God.',
        scoreModifier: ANNUAL_SCORING_WEIGHTS.compoundSynergy
      };
      reasoning.push(``);
      reasoning.push(`✨ COMPOUND SYNERGY: Luck Pillar + Annual Year both support you!`);
    }

    const lpAnnoying = usefulGodResult.annoyingElements.includes(lpStemElement) ||
                       usefulGodResult.annoyingElements.includes(lpBranchElement);
    const annualAnnoying = stemAnnoying || branchAnnoying;

    if (lpAnnoying && annualAnnoying) {
      // Both bring annoying energy
      compoundEffect = {
        type: 'conflict',
        description: 'Double challenge! Both Luck Pillar and Annual activate Annoying God.',
        scoreModifier: ANNUAL_SCORING_WEIGHTS.compoundConflict
      };
      reasoning.push(``);
      reasoning.push(`⚠️ COMPOUND CHALLENGE: Luck Pillar + Annual Year both challenge you!`);
    }

    // If luck pillar conflicts with annual
    if (luckPillarConflicts.some(c => c.type === 'clash')) {
      compoundEffect = {
        type: 'conflict',
        description: 'Year disrupts the decade energy. Expect turbulence.',
        scoreModifier: ANNUAL_SCORING_WEIGHTS.compoundConflict
      };
    }

    // If luck pillar combines with annual
    if (luckPillarTransformations.length > 0) {
      const transformedElement = luckPillarTransformations[0].resultElement as ElementName;
      if (usefulGodResult.usefulElements.includes(transformedElement)) {
        compoundEffect = {
          type: 'synergy',
          description: `Luck + Annual combine into ${transformedElement} - Useful God transformation!`,
          scoreModifier: ANNUAL_SCORING_WEIGHTS.compoundSynergy + 5
        };
      }
    }
  }

  // ========================================
  // STEP 7: Shen Sha activation
  // ========================================
  const shensha: ShenshaTrigger[] = [];

  // Traveling Horse (驿马) check
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
      description: 'Year of movement, travel, or significant change'
    });
  }

  // Nobleman (天乙贵人) check
  const NOBLEMAN: Record<string, string[]> = {
    '甲': ['丑', '未'], '戊': ['丑', '未'],
    '乙': ['子', '申'], '己': ['子', '申'],
    '丙': ['亥', '酉'], '丁': ['亥', '酉'],
    '庚': ['丑', '未'], '辛': ['寅', '午'],
    '壬': ['卯', '巳'], '癸': ['卯', '巳']
  };

  const dayMasterStem = natalPillars.dayStem;
  if (NOBLEMAN[dayMasterStem]?.includes(branch)) {
    shensha.push({
      name: 'Nobleman',
      chineseName: '天乙贵人',
      isPositive: true,
      description: 'Benefactors and helpful people appear this year'
    });
  }

  // Peach Blossom (桃花) - relationship star
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
      description: 'Romantic opportunities and social popularity'
    });
  }

  // Tai Sui (太岁) - Grand Duke year (same as birth year animal)
  if (branch === natalPillars.yearBranch) {
    shensha.push({
      name: 'Tai Sui Return',
      chineseName: '本命年',
      isPositive: false,
      description: 'Your zodiac year - traditionally requires extra caution'
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
  // STEP 8: DM strength impact
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

  // Resource strengthens DM
  if (stemElement === PRODUCED_BY[dayMasterElement] || branchElement === PRODUCED_BY[dayMasterElement]) {
    dmStrengthDelta += 0.12;
    dmImpact = 'strengthens';
  }

  // Same element strengthens
  if (stemElement === dayMasterElement || branchElement === dayMasterElement) {
    dmStrengthDelta += 0.08;
    dmImpact = 'strengthens';
  }

  // What controls DM weakens
  if (stemElement === CONTROLLED_BY[dayMasterElement] || branchElement === CONTROLLED_BY[dayMasterElement]) {
    dmStrengthDelta -= 0.12;
    dmImpact = 'weakens';
  }

  // Output drains
  if (stemElement === PRODUCTION_CYCLE[dayMasterElement] || branchElement === PRODUCTION_CYCLE[dayMasterElement]) {
    dmStrengthDelta -= 0.08;
    if (dmImpact === 'neutral') dmImpact = 'weakens';
  }

  reasoning.push(``);
  reasoning.push(`💪 DM Impact: ${dmImpact} (Δ ${dmStrengthDelta > 0 ? '+' : ''}${(dmStrengthDelta * 100).toFixed(0)}%)`);

  // ========================================
  // STEP 9: Calculate final score
  // ========================================
  let score = 50; // Start neutral

  // Useful God activation
  if (stemUseful) score += ANNUAL_SCORING_WEIGHTS.usefulStem;
  if (branchUseful) score += ANNUAL_SCORING_WEIGHTS.usefulBranch;

  // Annoying God activation
  if (stemAnnoying) score += ANNUAL_SCORING_WEIGHTS.annoyingStem;
  if (branchAnnoying) score += ANNUAL_SCORING_WEIGHTS.annoyingBranch;

  // Natal conflicts
  natalConflicts.forEach(c => {
    if (c.type === 'clash') {
      if (c.severity === 'major') score += ANNUAL_SCORING_WEIGHTS.natalClashMajor;
      else if (c.severity === 'moderate') score += ANNUAL_SCORING_WEIGHTS.natalClashModerate;
      else score += ANNUAL_SCORING_WEIGHTS.natalClashMinor;
    } else if (c.type === 'harm') {
      if (c.severity === 'major') score += ANNUAL_SCORING_WEIGHTS.natalHarmMajor;
      else if (c.severity === 'moderate') score += ANNUAL_SCORING_WEIGHTS.natalHarmModerate;
      else score += ANNUAL_SCORING_WEIGHTS.natalHarmMinor;
    } else {
      score += ANNUAL_SCORING_WEIGHTS.natalDestructionAny;
    }
  });

  // Luck pillar conflicts
  luckPillarConflicts.forEach(c => {
    if (c.type === 'clash') score += ANNUAL_SCORING_WEIGHTS.luckClash;
    else if (c.type === 'harm') score += ANNUAL_SCORING_WEIGHTS.luckHarm;
    else score += ANNUAL_SCORING_WEIGHTS.luckDestruction;
  });

  // Compound effect
  score += compoundEffect.scoreModifier;

  // Transformations
  const allTransformations = [...natalTransformations, ...luckPillarTransformations];
  allTransformations.forEach(t => {
    if (usefulGodResult.usefulElements.includes(t.resultElement as ElementName)) {
      score += ANNUAL_SCORING_WEIGHTS.transformationPositive;
    } else {
      score += ANNUAL_SCORING_WEIGHTS.transformationNeutral;
    }
  });

  // Shen Sha
  shensha.forEach(s => {
    score += s.isPositive ? ANNUAL_SCORING_WEIGHTS.shenshaPositive : ANNUAL_SCORING_WEIGHTS.shenshaNegative;
  });

  // DM context adjustment
  const isWeakDM = dmStrength < 1.0;
  if (isWeakDM && dmImpact === 'strengthens') {
    score += ANNUAL_SCORING_WEIGHTS.dmSupport;
  } else if (!isWeakDM && dmImpact === 'weakens') {
    score += ANNUAL_SCORING_WEIGHTS.dmSupport;
  } else if (isWeakDM && dmImpact === 'weakens') {
    score += ANNUAL_SCORING_WEIGHTS.dmDrain;
  } else if (!isWeakDM && dmImpact === 'strengthens') {
    score += ANNUAL_SCORING_WEIGHTS.dmDrain;
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
  // STEP 10: Generate month highlights
  // ========================================
  const monthHighlights = generateMonthHighlights(branch, natalPillars, usefulGodResult);

  // ========================================
  // STEP 11: Generate summary and advice
  // ========================================
  const summary = generateAnnualSummary(
    year, score, tier, usefulActivated, annoyingActivated,
    natalConflicts, luckPillarConflicts, compoundEffect, luckPillarContext
  );
  const advice = generateAnnualAdvice(
    tier, usefulActivated, annoyingActivated, natalConflicts,
    luckPillarConflicts, shensha, compoundEffect, luckPillarContext
  );

  return {
    year,
    stem,
    branch,
    pillarDisplay: `${stem}${branch}`,
    chineseYear,
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
    natalConflicts,
    natalTransformations,
    luckPillarConflicts,
    luckPillarTransformations,
    compoundEffect,
    shensha,
    dmStrengthDelta,
    dmImpact,
    luckPillarContext: luckPillarContext || null,
    reasoning,
    summary,
    advice,
    monthHighlights
  };
}

// ============================================================================
// TIMELINE COMPUTATION
// ============================================================================

/**
 * Compute favorability for multiple years
 */
export function computeAnnualTimeline(
  startYear: number,
  endYear: number,
  natalPillars: NatalPillarsInput,
  usefulGodResult: UsefulGodResult,
  dayMasterElement: ElementName,
  dmStrength: number,
  getLuckPillarForYear?: (year: number) => CurrentLuckPillarContext | undefined,
  currentYear?: number
): AnnualTimelineResult {
  const years: AnnualLuckFavorability[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const { stem, branch } = getAnnualPillar(year);
    const luckPillarContext = getLuckPillarForYear ? getLuckPillarForYear(year) : undefined;

    const annualResult = computeAnnualLuckFavorability(
      { year, stem, branch },
      natalPillars,
      usefulGodResult,
      dayMasterElement,
      dmStrength,
      luckPillarContext
    );

    years.push(annualResult);
  }

  // Find best and worst
  const sorted = [...years].sort((a, b) => b.score - a.score);
  const bestYear = sorted[0] || null;
  const worstYear = sorted[sorted.length - 1] || null;

  // Find current year
  let currentYearResult: AnnualLuckFavorability | null = null;
  if (currentYear !== undefined) {
    currentYearResult = years.find(y => y.year === currentYear) || null;
  }

  // Determine overall pattern
  const avgScore = years.reduce((sum, y) => sum + y.score, 0) / years.length;
  let overallPattern: string;

  if (avgScore >= 65) {
    overallPattern = 'Favorable period with strong support years.';
  } else if (avgScore >= 50) {
    overallPattern = 'Mixed period with both opportunities and challenges.';
  } else if (avgScore >= 35) {
    overallPattern = 'Challenging period requiring resilience.';
  } else {
    overallPattern = 'Difficult period - focus on inner development.';
  }

  // Generate period summary
  const periodSummary = generatePeriodSummary(years, bestYear, worstYear, currentYearResult);

  return {
    years,
    bestYear,
    worstYear,
    currentYear: currentYearResult,
    overallPattern,
    periodSummary
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateMonthHighlights(
  annualBranch: string,
  natalPillars: NatalPillarsInput,
  usefulGodResult: UsefulGodResult
): MonthHighlight[] {
  // Simplified month stems/branches for 2024-2030 range
  // In practice, month stems depend on the year stem (using 五虎遁 formula)
  const monthBranches = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
  const highlights: MonthHighlight[] = [];

  for (let month = 1; month <= 12; month++) {
    const monthBranch = monthBranches[month - 1];
    let isSignificant = false;
    let reason = '';

    // Check for clash with annual branch
    if (CLASH_PAIRS[monthBranch] === annualBranch) {
      isSignificant = true;
      reason = `Month clashes with annual: ${monthBranch}${annualBranch}冲`;
    }

    // Check for clash with natal day branch
    if (CLASH_PAIRS[monthBranch] === natalPillars.dayBranch) {
      isSignificant = true;
      reason = reason ? `${reason}; Also clashes natal Day` : `Month clashes natal Day`;
    }

    // Check if month element is useful god
    const monthElement = BRANCH_TO_ELEMENT[monthBranch];
    if (usefulGodResult.usefulElements.includes(monthElement)) {
      if (!isSignificant) {
        isSignificant = true;
        reason = `${monthElement} month activates Useful God`;
      }
    }

    highlights.push({
      month,
      monthStem: '?', // Would need year stem to calculate properly
      monthBranch,
      isSignificant,
      reason: reason || 'Standard month'
    });
  }

  return highlights;
}

function generateAnnualSummary(
  year: number,
  score: number,
  tier: FavorabilityTier,
  useful: ElementName[],
  annoying: ElementName[],
  natalConflicts: ConflictTrigger[],
  luckConflicts: ConflictTrigger[],
  compound: CompoundEffect,
  luckContext: CurrentLuckPillarContext | null
): string {
  const parts: string[] = [];

  // Overall rating
  if (tier === 'excellent') {
    parts.push(`${year} is an exceptional year for you.`);
  } else if (tier === 'good') {
    parts.push(`${year} brings favorable energy.`);
  } else if (tier === 'neutral') {
    parts.push(`${year} is mixed - neither strongly positive nor negative.`);
  } else if (tier === 'challenging') {
    parts.push(`${year} presents obstacles to navigate.`);
  } else {
    parts.push(`${year} requires patience and careful management.`);
  }

  // Compound effect with luck pillar
  if (compound.type === 'synergy' && luckContext) {
    parts.push(`This year amplifies the good fortune of your current decade.`);
  } else if (compound.type === 'conflict' && luckContext) {
    parts.push(`This year disrupts the decade's energy - expect turbulence.`);
  }

  // Key activations
  if (useful.length > 0) {
    parts.push(`Useful God (${useful.join(', ')}) is active.`);
  }

  if (annoying.length > 0) {
    parts.push(`Annoying God (${annoying.join(', ')}) also present.`);
  }

  // Conflicts
  const majorConflicts = [...natalConflicts, ...luckConflicts].filter(c => c.severity === 'major');
  if (majorConflicts.length > 0) {
    parts.push(`Watch for significant conflicts.`);
  }

  return parts.join(' ');
}

function generateAnnualAdvice(
  tier: FavorabilityTier,
  useful: ElementName[],
  annoying: ElementName[],
  natalConflicts: ConflictTrigger[],
  luckConflicts: ConflictTrigger[],
  shensha: ShenshaTrigger[],
  compound: CompoundEffect,
  luckContext: CurrentLuckPillarContext | null
): string {
  // Excellent/Good years
  if (tier === 'excellent' || tier === 'good') {
    if (shensha.some(s => s.name === 'Traveling Horse')) {
      return 'This is your year for movement - relocate, travel, or change careers. Fortune favors the bold.';
    }
    if (shensha.some(s => s.name === 'Nobleman')) {
      return 'Helpful people will appear. Network actively, accept assistance, and pay it forward.';
    }
    if (shensha.some(s => s.name === 'Peach Blossom')) {
      return 'Romance and social opportunities abound. Put yourself out there and nurture relationships.';
    }
    if (compound.type === 'synergy') {
      return 'Double blessing year! Take big swings - launch projects, make commitments, pursue dreams.';
    }
    return 'Favorable energy supports initiative. Move forward on delayed plans and seize opportunities.';
  }

  // Challenging/Difficult years
  if (tier === 'challenging' || tier === 'difficult') {
    if (shensha.some(s => s.name === 'Tai Sui Return')) {
      return 'Your zodiac year: wear red, stay humble, avoid major changes. This too shall pass.';
    }
    if (luckConflicts.some(c => c.type === 'clash')) {
      return 'Year clashes with your decade - expect disruption. Stay flexible, avoid rigid commitments.';
    }
    if (natalConflicts.some(c => c.severity === 'major')) {
      return 'Major conflict year. Move cautiously, avoid confrontation, and focus on damage control.';
    }
    if (compound.type === 'conflict') {
      return 'Double challenge year. Conserve energy, delay major decisions, and ride out the storm.';
    }
    return 'Patience is key. Focus on maintenance rather than expansion. Build inner resilience.';
  }

  // Neutral years
  return 'Balanced year with mixed energy. Stay adaptable and capitalize on smaller opportunities.';
}

function generatePeriodSummary(
  years: AnnualLuckFavorability[],
  best: AnnualLuckFavorability | null,
  worst: AnnualLuckFavorability | null,
  current: AnnualLuckFavorability | null
): string {
  const parts: string[] = [];

  if (best) {
    parts.push(`Best year: ${best.year} (${best.pillarDisplay}, score: ${best.score}).`);
  }

  if (worst) {
    parts.push(`Most challenging: ${worst.year} (${worst.pillarDisplay}, score: ${worst.score}).`);
  }

  if (current) {
    parts.push(`This year (${current.year}): ${current.tier} (score: ${current.score}).`);
  }

  // Identify streaks
  let goodStreak = 0;
  let maxGoodStreak = 0;
  let streakStart = 0;
  let bestStreakStart = 0;

  for (let i = 0; i < years.length; i++) {
    if (years[i].score >= 60) {
      if (goodStreak === 0) streakStart = years[i].year;
      goodStreak++;
      if (goodStreak > maxGoodStreak) {
        maxGoodStreak = goodStreak;
        bestStreakStart = streakStart;
      }
    } else {
      goodStreak = 0;
    }
  }

  if (maxGoodStreak >= 3) {
    parts.push(`Strong period: ${bestStreakStart}-${bestStreakStart + maxGoodStreak - 1}.`);
  }

  return parts.join(' ');
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Get a quick favorability rating for a single year
 */
export function getQuickAnnualFavorability(
  year: number,
  usefulElements: ElementName[],
  annoyingElements: ElementName[]
): { favorable: boolean; score: number; pillar: string; reason: string } {
  const { stem, branch } = getAnnualPillar(year);
  const stemElement = STEM_TO_ELEMENT[stem];
  const branchElement = BRANCH_TO_ELEMENT[branch];

  let score = 50;
  const reasons: string[] = [];

  if (usefulElements.includes(stemElement)) {
    score += 15;
    reasons.push(`${stemElement} stem supports`);
  }
  if (usefulElements.includes(branchElement)) {
    score += 12;
    reasons.push(`${branchElement} branch supports`);
  }
  if (annoyingElements.includes(stemElement)) {
    score -= 15;
    reasons.push(`${stemElement} stem challenges`);
  }
  if (annoyingElements.includes(branchElement)) {
    score -= 12;
    reasons.push(`${branchElement} branch challenges`);
  }

  return {
    favorable: score >= 50,
    score: Math.max(0, Math.min(100, score)),
    pillar: `${stem}${branch}`,
    reason: reasons.length > 0 ? reasons.join('; ') : 'Neutral year'
  };
}

/**
 * Get years within a range that match a given zodiac animal
 */
export function getYearsByZodiac(
  zodiacBranch: string,
  startYear: number,
  endYear: number
): number[] {
  const years: number[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const { branch } = getAnnualPillar(year);
    if (branch === zodiacBranch) {
      years.push(year);
    }
  }

  return years;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  computeAnnualLuckFavorability,
  computeAnnualTimeline,
  getQuickAnnualFavorability,
  getAnnualPillar,
  getChineseYearName,
  getYearsByZodiac,
  BRANCH_ZODIAC
};
