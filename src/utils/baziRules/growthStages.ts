/**
 * ============================================
 * GROWTH STAGES ENGINE (長生十二運)
 * The 12 Stages of Life Cycle
 *
 * Each Day Master goes through 12 stages
 * relative to the Earthly Branches in the chart.
 *
 * Stages:
 * 長生 (ChangSheng) - Birth/Beginning
 * 沐浴 (MuYu) - Bathing/Exposure
 * 冠帶 (GuanDai) - Coming of Age
 * 臨官 (LinGuan) - Career Peak
 * 帝旺 (DiWang) - Emperor's Peak
 * 衰 (Shuai) - Decline
 * 病 (Bing) - Illness
 * 死 (Si) - Death
 * 墓 (Mu) - Tomb/Storage
 * 絕 (Jue) - Extinction
 * 胎 (Tai) - Conception
 * 養 (Yang) - Nurturing
 * ============================================
 */

// ==================== TYPES ====================

export type GrowthStage =
  | 'ChangSheng'  // 長生 - Birth
  | 'MuYu'        // 沐浴 - Bathing
  | 'GuanDai'     // 冠帶 - Coming of Age
  | 'LinGuan'     // 臨官 - Career Peak
  | 'DiWang'      // 帝旺 - Emperor's Peak
  | 'Shuai'       // 衰 - Decline
  | 'Bing'        // 病 - Illness
  | 'Si'          // 死 - Death
  | 'Mu'          // 墓 - Tomb
  | 'Jue'         // 絕 - Extinction
  | 'Tai'         // 胎 - Conception
  | 'Yang';       // 養 - Nurturing

export interface GrowthStageInfo {
  stage: GrowthStage;
  chineseName: string;
  englishName: string;
  description: string;
  descriptionZh: string;
  strength: number; // 0-100, relative power
  phase: 'rising' | 'peak' | 'declining' | 'dormant';
}

export interface StemBranch {
  stem: string;
  branch: string;
}

export interface GrowthStageResult {
  pillar: StemBranch;
  pillarType: 'Year' | 'Month' | 'Day' | 'Hour' | 'Luck' | 'Annual';
  stage: GrowthStage;
  info: GrowthStageInfo;
}

export interface ChartGrowthStages {
  yearPillar: GrowthStageResult;
  monthPillar: GrowthStageResult;
  dayPillar: GrowthStageResult;
  hourPillar: GrowthStageResult;
  luckPillar?: GrowthStageResult;
  annualPillar?: GrowthStageResult;
  summary: GrowthStageSummary;
}

export interface GrowthStageSummary {
  dominantPhase: 'rising' | 'peak' | 'declining' | 'dormant';
  averageStrength: number;
  strongStages: GrowthStage[];
  weakStages: GrowthStage[];
  interpretation: string;
  interpretationZh: string;
}

// ==================== CONSTANTS ====================

export const BRANCH_ORDER = [
  'Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si',
  'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'
];

export const STAGE_ORDER: GrowthStage[] = [
  'ChangSheng', 'MuYu', 'GuanDai', 'LinGuan', 'DiWang', 'Shuai',
  'Bing', 'Si', 'Mu', 'Jue', 'Tai', 'Yang'
];

/**
 * Growth stage lookup table
 * Key: Day Stem
 * Value: Array of stages indexed by branch position (0=Zi, 1=Chou, etc.)
 *
 * Yang stems (甲丙戊庚壬) follow one direction
 * Yin stems (乙丁己辛癸) follow reverse direction
 */
export const GROWTH_TABLE: Record<string, GrowthStage[]> = {
  // Yang Wood (甲) - starts ChangSheng at Hai
  'Jia': ['MuYu', 'GuanDai', 'LinGuan', 'DiWang', 'Shuai', 'Bing', 'Si', 'Mu', 'Jue', 'Tai', 'Yang', 'ChangSheng'],

  // Yin Wood (乙) - reverse, starts ChangSheng at Wu
  'Yi': ['Jue', 'Mu', 'Si', 'Bing', 'Shuai', 'DiWang', 'LinGuan', 'GuanDai', 'MuYu', 'ChangSheng', 'Yang', 'Tai'],

  // Yang Fire (丙) - starts ChangSheng at Yin
  'Bing': ['Tai', 'Yang', 'ChangSheng', 'MuYu', 'GuanDai', 'LinGuan', 'DiWang', 'Shuai', 'Bing', 'Si', 'Mu', 'Jue'],

  // Yin Fire (丁) - reverse, starts ChangSheng at You
  'Ding': ['Si', 'Bing', 'Shuai', 'DiWang', 'LinGuan', 'GuanDai', 'MuYu', 'ChangSheng', 'Yang', 'Tai', 'Jue', 'Mu'],

  // Yang Earth (戊) - same as Yang Fire
  'Wu': ['Tai', 'Yang', 'ChangSheng', 'MuYu', 'GuanDai', 'LinGuan', 'DiWang', 'Shuai', 'Bing', 'Si', 'Mu', 'Jue'],

  // Yin Earth (己) - same as Yin Fire
  'Ji': ['Si', 'Bing', 'Shuai', 'DiWang', 'LinGuan', 'GuanDai', 'MuYu', 'ChangSheng', 'Yang', 'Tai', 'Jue', 'Mu'],

  // Yang Metal (庚) - starts ChangSheng at Si
  'Geng': ['Mu', 'Jue', 'Tai', 'Yang', 'ChangSheng', 'MuYu', 'GuanDai', 'LinGuan', 'DiWang', 'Shuai', 'Bing', 'Si'],

  // Yin Metal (辛) - reverse, starts ChangSheng at Zi
  'Xin': ['ChangSheng', 'Yang', 'Tai', 'Jue', 'Mu', 'Si', 'Bing', 'Shuai', 'DiWang', 'LinGuan', 'GuanDai', 'MuYu'],

  // Yang Water (壬) - starts ChangSheng at Shen
  'Ren': ['LinGuan', 'GuanDai', 'MuYu', 'ChangSheng', 'Yang', 'Tai', 'Jue', 'Mu', 'Si', 'Bing', 'Shuai', 'DiWang'],

  // Yin Water (癸) - reverse, starts ChangSheng at Mao
  'Gui': ['Bing', 'Shuai', 'DiWang', 'LinGuan', 'GuanDai', 'MuYu', 'ChangSheng', 'Yang', 'Tai', 'Jue', 'Mu', 'Si']
};

/**
 * Stage metadata
 */
export const STAGE_INFO: Record<GrowthStage, Omit<GrowthStageInfo, 'stage'>> = {
  'ChangSheng': {
    chineseName: '長生',
    englishName: 'Birth',
    description: 'New beginnings, fresh energy, potential emerging.',
    descriptionZh: '新的开始，充满潜力，生命力萌发。',
    strength: 75,
    phase: 'rising'
  },
  'MuYu': {
    chineseName: '沐浴',
    englishName: 'Bathing',
    description: 'Vulnerability, exposure, learning through experience.',
    descriptionZh: '脆弱，暴露，通过经验学习。',
    strength: 50,
    phase: 'rising'
  },
  'GuanDai': {
    chineseName: '冠帶',
    englishName: 'Coming of Age',
    description: 'Maturing, gaining status, preparing for responsibility.',
    descriptionZh: '成熟，获得地位，准备承担责任。',
    strength: 70,
    phase: 'rising'
  },
  'LinGuan': {
    chineseName: '臨官',
    englishName: 'Career Peak',
    description: 'Professional success, authority, social recognition.',
    descriptionZh: '事业巅峰，权威，社会认可。',
    strength: 90,
    phase: 'peak'
  },
  'DiWang': {
    chineseName: '帝旺',
    englishName: 'Emperor\'s Peak',
    description: 'Maximum power, peak influence, full manifestation.',
    descriptionZh: '最大能量，巅峰影响力，完全显现。',
    strength: 100,
    phase: 'peak'
  },
  'Shuai': {
    chineseName: '衰',
    englishName: 'Decline',
    description: 'Beginning of decline, wisdom emerging, letting go.',
    descriptionZh: '开始衰落，智慧显现，学会放下。',
    strength: 65,
    phase: 'declining'
  },
  'Bing': {
    chineseName: '病',
    englishName: 'Illness',
    description: 'Weakness, vulnerability, need for healing.',
    descriptionZh: '虚弱，脆弱，需要疗愈。',
    strength: 40,
    phase: 'declining'
  },
  'Si': {
    chineseName: '死',
    englishName: 'Death',
    description: 'Transformation, endings leading to new cycles.',
    descriptionZh: '转化，结束引向新循环。',
    strength: 20,
    phase: 'declining'
  },
  'Mu': {
    chineseName: '墓',
    englishName: 'Tomb',
    description: 'Storage, hidden resources, dormant potential.',
    descriptionZh: '储藏，隐藏资源，潜伏的潜力。',
    strength: 35,
    phase: 'dormant'
  },
  'Jue': {
    chineseName: '絕',
    englishName: 'Extinction',
    description: 'Complete emptiness, the void before rebirth.',
    descriptionZh: '完全空无，重生前的虚空。',
    strength: 10,
    phase: 'dormant'
  },
  'Tai': {
    chineseName: '胎',
    englishName: 'Conception',
    description: 'Seeds planted, potential forming, invisible growth.',
    descriptionZh: '种子播下，潜力形成，无形成长。',
    strength: 25,
    phase: 'dormant'
  },
  'Yang': {
    chineseName: '養',
    englishName: 'Nurturing',
    description: 'Gestation, preparation, gathering strength.',
    descriptionZh: '孕育，准备，积蓄力量。',
    strength: 45,
    phase: 'dormant'
  }
};

// ==================== CORE FUNCTIONS ====================

/**
 * Compute the growth stage for a Day Stem relative to a branch
 */
export function computeGrowthStage(
  dayStem: string,
  branch: string
): GrowthStageResult {
  const branchIndex = BRANCH_ORDER.indexOf(branch);
  if (branchIndex === -1) {
    throw new Error(`Invalid branch: ${branch}`);
  }

  const stemTable = GROWTH_TABLE[dayStem];
  if (!stemTable) {
    throw new Error(`Invalid day stem: ${dayStem}`);
  }

  const stage = stemTable[branchIndex];
  const info = getStageInfo(stage);

  return {
    pillar: { stem: dayStem, branch },
    pillarType: 'Day',
    stage,
    info
  };
}

/**
 * Compute growth stages for all pillars in a chart
 */
export function computeChartGrowthStages(
  dayStem: string,
  yearBranch: string,
  monthBranch: string,
  dayBranch: string,
  hourBranch: string,
  luckBranch?: string,
  annualBranch?: string
): ChartGrowthStages {
  const yearResult = {
    ...computeGrowthStage(dayStem, yearBranch),
    pillarType: 'Year' as const
  };

  const monthResult = {
    ...computeGrowthStage(dayStem, monthBranch),
    pillarType: 'Month' as const
  };

  const dayResult = {
    ...computeGrowthStage(dayStem, dayBranch),
    pillarType: 'Day' as const
  };

  const hourResult = {
    ...computeGrowthStage(dayStem, hourBranch),
    pillarType: 'Hour' as const
  };

  const results = [yearResult, monthResult, dayResult, hourResult];

  let luckResult: GrowthStageResult | undefined;
  let annualResult: GrowthStageResult | undefined;

  if (luckBranch) {
    luckResult = {
      ...computeGrowthStage(dayStem, luckBranch),
      pillarType: 'Luck' as const
    };
    results.push(luckResult);
  }

  if (annualBranch) {
    annualResult = {
      ...computeGrowthStage(dayStem, annualBranch),
      pillarType: 'Annual' as const
    };
    results.push(annualResult);
  }

  const summary = computeGrowthStageSummary(results);

  return {
    yearPillar: yearResult,
    monthPillar: monthResult,
    dayPillar: dayResult,
    hourPillar: hourResult,
    luckPillar: luckResult,
    annualPillar: annualResult,
    summary
  };
}

/**
 * Get detailed info for a growth stage
 */
export function getStageInfo(stage: GrowthStage): GrowthStageInfo {
  return {
    stage,
    ...STAGE_INFO[stage]
  };
}

/**
 * Compute summary of growth stages
 */
function computeGrowthStageSummary(results: GrowthStageResult[]): GrowthStageSummary {
  const phases = results.map(r => r.info.phase);
  const strengths = results.map(r => r.info.strength);

  // Count phases
  const phaseCounts: Record<string, number> = {
    rising: 0, peak: 0, declining: 0, dormant: 0
  };
  phases.forEach(p => phaseCounts[p]++);

  const dominantPhase = Object.entries(phaseCounts)
    .sort((a, b) => b[1] - a[1])[0][0] as 'rising' | 'peak' | 'declining' | 'dormant';

  const averageStrength = Math.round(
    strengths.reduce((a, b) => a + b, 0) / strengths.length
  );

  const strongStages = results
    .filter(r => r.info.strength >= 70)
    .map(r => r.stage);

  const weakStages = results
    .filter(r => r.info.strength <= 30)
    .map(r => r.stage);

  const interpretation = generateInterpretation(dominantPhase, averageStrength, strongStages, weakStages);
  const interpretationZh = generateInterpretationZh(dominantPhase, averageStrength, strongStages, weakStages);

  return {
    dominantPhase,
    averageStrength,
    strongStages,
    weakStages,
    interpretation,
    interpretationZh
  };
}

function generateInterpretation(
  phase: string,
  strength: number,
  strong: GrowthStage[],
  weak: GrowthStage[]
): string {
  let text = `Overall life energy is in a ${phase} phase with ${strength}% average strength. `;

  if (strong.length > 0) {
    text += `Strong areas: ${strong.map(s => STAGE_INFO[s].englishName).join(', ')}. `;
  }

  if (weak.length > 0) {
    text += `Areas needing attention: ${weak.map(s => STAGE_INFO[s].englishName).join(', ')}.`;
  }

  return text;
}

function generateInterpretationZh(
  phase: string,
  strength: number,
  strong: GrowthStage[],
  weak: GrowthStage[]
): string {
  const phaseMap: Record<string, string> = {
    rising: '上升', peak: '巅峰', declining: '下降', dormant: '休眠'
  };

  let text = `整体生命能量处于${phaseMap[phase]}阶段，平均强度${strength}%。`;

  if (strong.length > 0) {
    text += `强势领域：${strong.map(s => STAGE_INFO[s].chineseName).join('、')}。`;
  }

  if (weak.length > 0) {
    text += `需要关注的领域：${weak.map(s => STAGE_INFO[s].chineseName).join('、')}。`;
  }

  return text;
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Check if a stage is in a strong phase
 */
export function isStrongStage(stage: GrowthStage): boolean {
  return STAGE_INFO[stage].strength >= 70;
}

/**
 * Check if a stage is in a weak phase
 */
export function isWeakStage(stage: GrowthStage): boolean {
  return STAGE_INFO[stage].strength <= 30;
}

/**
 * Get all stages for a Day Stem
 */
export function getAllStagesForStem(dayStem: string): Record<string, GrowthStage> {
  const table = GROWTH_TABLE[dayStem];
  if (!table) return {};

  const result: Record<string, GrowthStage> = {};
  BRANCH_ORDER.forEach((branch, idx) => {
    result[branch] = table[idx];
  });
  return result;
}

/**
 * Find which branches give a specific stage for a Day Stem
 */
export function findBranchesForStage(dayStem: string, targetStage: GrowthStage): string[] {
  const table = GROWTH_TABLE[dayStem];
  if (!table) return [];

  return BRANCH_ORDER.filter((_, idx) => table[idx] === targetStage);
}

/**
 * Get the next stage in the cycle
 */
export function getNextStage(currentStage: GrowthStage): GrowthStage {
  const idx = STAGE_ORDER.indexOf(currentStage);
  return STAGE_ORDER[(idx + 1) % 12];
}

/**
 * Get the previous stage in the cycle
 */
export function getPreviousStage(currentStage: GrowthStage): GrowthStage {
  const idx = STAGE_ORDER.indexOf(currentStage);
  return STAGE_ORDER[(idx - 1 + 12) % 12];
}

// ==================== EXPORTS ====================

export {
  computeGrowthStage,
  computeChartGrowthStages,
  getStageInfo,
  isStrongStage,
  isWeakStage,
  getAllStagesForStem,
  findBranchesForStage,
  getNextStage,
  getPreviousStage
};
