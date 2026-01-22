/**
 * ============================================================================
 * BAZI COMPOSITE CHART ENGINE (合盘命盘)
 * ============================================================================
 *
 * The sacred architectural module where two individual destinies merge into
 * a third entity — the relationship itself as a living being.
 *
 * A composite chart is NOT:
 * - A simple average
 * - A synastry overlay
 * - A Western midpoint chart
 *
 * In classical Chinese metaphysics, a composite chart IS:
 * - A third 命盘 constructed from structural resonance between two charts
 * - The energetic child of the relationship
 * - The relationship's own destiny
 *
 * Features:
 * - Four Composite Pillars (midpoint + harmony preference)
 * - Composite Day Master (relationship personality)
 * - Composite Element Distribution
 * - Composite Ten Gods
 * - Composite Useful God (合盘用神)
 * - Composite Shen Sha (合盘神煞)
 * - Composite Luck Cycles (合盘大运)
 *
 * Based on: Classical 合盘 (composite chart) methodology
 * Aligned with: Joey Yap compatibility framework
 * Created: January 2026
 * ============================================================================
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type Polarity = 'Yang' | 'Yin';
export type StemName = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
export type BranchName = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

/**
 * Input structure for natal pillars (flat format)
 */
export interface NatalPillarsInput {
  yearStem: string;
  yearBranch: string;
  monthStem: string;
  monthBranch: string;
  dayStem: string;
  dayBranch: string;
  hourStem: string;
  hourBranch: string;
}

/**
 * Single pillar structure
 */
export interface Pillar {
  stem: StemName;
  branch: BranchName;
  stemElement: ElementName;
  branchElement: ElementName;
  stemPolarity: Polarity;
}

/**
 * Composite pillar with combination details
 */
export interface CompositePillar extends Pillar {
  combinationMethod: 'identical' | 'stem_combination' | 'branch_combination' | 'liuhe' | 'sanhe' | 'midpoint';
  combinationNotes: string;
}

/**
 * Composite Day Master analysis
 */
export interface CompositeDayMaster {
  stem: StemName;
  element: ElementName;
  polarity: Polarity;
  chineseName: string;
  personality: string;
  strengthScore: number;
  strengthCategory: 'very_weak' | 'weak' | 'balanced' | 'strong' | 'very_strong';
  strengthAnalysis: string;
}

/**
 * Element distribution in composite chart
 */
export interface CompositeElementDistribution {
  Wood: number;
  Fire: number;
  Earth: number;
  Metal: number;
  Water: number;
  dominant: ElementName;
  weakest: ElementName;
  balance: 'balanced' | 'slightly_imbalanced' | 'imbalanced' | 'severely_imbalanced';
  balanceScore: number;
}

/**
 * Ten God structure
 */
export interface TenGodInfo {
  name: string;
  chineseName: string;
  element: ElementName;
  relationship: string;
  strength: number;
  pillarLocation: string;
}

/**
 * Composite Ten Gods analysis
 */
export interface CompositeTenGods {
  directWealth: TenGodInfo | null;
  indirectWealth: TenGodInfo | null;
  directOfficer: TenGodInfo | null;
  sevenKillings: TenGodInfo | null;
  directResource: TenGodInfo | null;
  indirectResource: TenGodInfo | null;
  robWealth: TenGodInfo | null;
  friend: TenGodInfo | null;
  eatingGod: TenGodInfo | null;
  hurtingOfficer: TenGodInfo | null;
  dominant: string;
  dominantChinese: string;
  interpretation: string;
}

/**
 * Useful God result
 */
export interface CompositeUsefulGod {
  element: ElementName;
  chineseName: string;
  reason: string;
  structureType: 'normal' | 'follow_wealth' | 'follow_officer' | 'follow_resource' | 'special';
  supportingElements: ElementName[];
  avoidElements: ElementName[];
  stabilizingAdvice: string;
}

/**
 * Shen Sha (symbolic star)
 */
export interface CompositeShenSha {
  name: string;
  chineseName: string;
  nature: 'auspicious' | 'inauspicious' | 'neutral';
  location: string;
  description: string;
  relationshipMeaning: string;
}

/**
 * Luck pillar for composite chart
 */
export interface CompositeLuckPillar {
  startAge: number;
  endAge: number;
  stem: StemName;
  branch: BranchName;
  element: ElementName;
  favorability: 'excellent' | 'good' | 'neutral' | 'challenging' | 'difficult';
  usefulGodActive: boolean;
  description: string;
}

/**
 * Complete Composite Chart
 */
export interface CompositeChart {
  // Core pillars
  yearPillar: CompositePillar;
  monthPillar: CompositePillar;
  dayPillar: CompositePillar;
  hourPillar: CompositePillar;

  // Day Master
  dayMaster: CompositeDayMaster;

  // Element ecosystem
  elementDistribution: CompositeElementDistribution;

  // Ten Gods
  tenGods: CompositeTenGods;

  // Useful God
  usefulGod: CompositeUsefulGod;

  // Shen Sha
  shenSha: CompositeShenSha[];

  // Luck cycles
  luckPillars: CompositeLuckPillar[];

  // Metadata
  personAName: string;
  personBName: string;
  relationshipName: string;
  computedAt: string;

  // Interpretation
  relationshipPersonality: string;
  coreStrengths: string[];
  coreVulnerabilities: string[];
  karmicPurpose: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Stem to element mapping
 */
export const STEM_ELEMENT: Record<string, ElementName> = {
  '甲': 'Wood', '乙': 'Wood',
  '丙': 'Fire', '丁': 'Fire',
  '戊': 'Earth', '己': 'Earth',
  '庚': 'Metal', '辛': 'Metal',
  '壬': 'Water', '癸': 'Water'
};

/**
 * Branch to element mapping
 */
export const BRANCH_ELEMENT: Record<string, ElementName> = {
  '子': 'Water', '丑': 'Earth',
  '寅': 'Wood', '卯': 'Wood',
  '辰': 'Earth', '巳': 'Fire',
  '午': 'Fire', '未': 'Earth',
  '申': 'Metal', '酉': 'Metal',
  '戌': 'Earth', '亥': 'Water'
};

/**
 * Stem polarity mapping
 */
export const STEM_POLARITY: Record<string, Polarity> = {
  '甲': 'Yang', '乙': 'Yin',
  '丙': 'Yang', '丁': 'Yin',
  '戊': 'Yang', '己': 'Yin',
  '庚': 'Yang', '辛': 'Yin',
  '壬': 'Yang', '癸': 'Yin'
};

/**
 * Ten Heavenly Stems in order
 */
export const STEMS: StemName[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

/**
 * Twelve Earthly Branches in order
 */
export const BRANCHES: BranchName[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * Stem combinations (天干合) - produces transformed element
 */
export const STEM_COMBINATIONS: Record<string, { partner: string; result: ElementName }> = {
  '甲': { partner: '己', result: 'Earth' },
  '己': { partner: '甲', result: 'Earth' },
  '乙': { partner: '庚', result: 'Metal' },
  '庚': { partner: '乙', result: 'Metal' },
  '丙': { partner: '辛', result: 'Water' },
  '辛': { partner: '丙', result: 'Water' },
  '丁': { partner: '壬', result: 'Wood' },
  '壬': { partner: '丁', result: 'Wood' },
  '戊': { partner: '癸', result: 'Fire' },
  '癸': { partner: '戊', result: 'Fire' }
};

/**
 * 六合 (Six Combinations) - Branch pairs
 */
export const LIUHE_PAIRS: Array<[string, string, ElementName]> = [
  ['子', '丑', 'Earth'],
  ['寅', '亥', 'Wood'],
  ['卯', '戌', 'Fire'],
  ['辰', '酉', 'Metal'],
  ['巳', '申', 'Water'],
  ['午', '未', 'Fire']
];

/**
 * 三合 (Three Combinations) - Elemental frames
 */
export const SANHE_FRAMES: Record<ElementName, [string, string, string]> = {
  Water: ['申', '子', '辰'],
  Wood: ['亥', '卯', '未'],
  Fire: ['寅', '午', '戌'],
  Metal: ['巳', '酉', '丑'],
  Earth: ['丑', '辰', '未']  // Earth center frame (auxiliary)
};

/**
 * Day Master personality descriptions
 */
export const DM_PERSONALITIES: Record<string, { name: string; personality: string }> = {
  '甲': {
    name: 'Yang Wood (甲木)',
    personality: 'A relationship defined by growth, expansion, leadership, and pioneering spirit. Like a tall tree reaching upward.'
  },
  '乙': {
    name: 'Yin Wood (乙木)',
    personality: 'A relationship defined by sensitivity, flexibility, emotional resonance, and gentle adaptability. Like graceful vines.'
  },
  '丙': {
    name: 'Yang Fire (丙火)',
    personality: 'A relationship defined by passion, visibility, warmth, and radiant energy. Like the brilliant sun.'
  },
  '丁': {
    name: 'Yin Fire (丁火)',
    personality: 'A relationship defined by intimacy, warmth, flickering devotion, and quiet passion. Like a candle flame.'
  },
  '戊': {
    name: 'Yang Earth (戊土)',
    personality: 'A relationship defined by stability, duty, reliability, and grounded presence. Like a mountain.'
  },
  '己': {
    name: 'Yin Earth (己土)',
    personality: 'A relationship defined by nurturing, support, cultivation, and fertile growth. Like rich farmland.'
  },
  '庚': {
    name: 'Yang Metal (庚金)',
    personality: 'A relationship defined by structure, clarity, decisiveness, and unwavering commitment. Like a sword.'
  },
  '辛': {
    name: 'Yin Metal (辛金)',
    personality: 'A relationship defined by refinement, precision, elegance, and precious beauty. Like a jewel.'
  },
  '壬': {
    name: 'Yang Water (壬水)',
    personality: 'A relationship defined by flow, adaptability, expansiveness, and powerful momentum. Like the ocean.'
  },
  '癸': {
    name: 'Yin Water (癸水)',
    personality: 'A relationship defined by intuition, depth, mystery, and gentle persistence. Like morning dew.'
  }
};

/**
 * Ten God names
 */
export const TEN_GOD_NAMES: Record<string, { english: string; chinese: string }> = {
  'direct_wealth': { english: 'Direct Wealth', chinese: '正财' },
  'indirect_wealth': { english: 'Indirect Wealth', chinese: '偏财' },
  'direct_officer': { english: 'Direct Officer', chinese: '正官' },
  'seven_killings': { english: 'Seven Killings', chinese: '七杀' },
  'direct_resource': { english: 'Direct Resource', chinese: '正印' },
  'indirect_resource': { english: 'Indirect Resource', chinese: '偏印' },
  'rob_wealth': { english: 'Rob Wealth', chinese: '劫财' },
  'friend': { english: 'Friend', chinese: '比肩' },
  'eating_god': { english: 'Eating God', chinese: '食神' },
  'hurting_officer': { english: 'Hurting Officer', chinese: '伤官' }
};

/**
 * Element production cycle
 */
export const ELEMENT_PRODUCES: Record<ElementName, ElementName> = {
  Wood: 'Fire',
  Fire: 'Earth',
  Earth: 'Metal',
  Metal: 'Water',
  Water: 'Wood'
};

/**
 * Element control cycle
 */
export const ELEMENT_CONTROLS: Record<ElementName, ElementName> = {
  Wood: 'Earth',
  Fire: 'Metal',
  Earth: 'Water',
  Metal: 'Wood',
  Water: 'Fire'
};

/**
 * Branch seasonality (for DM strength)
 */
export const BRANCH_SEASON: Record<string, ElementName> = {
  '寅': 'Wood', '卯': 'Wood', '辰': 'Wood',
  '巳': 'Fire', '午': 'Fire', '未': 'Fire',
  '申': 'Metal', '酉': 'Metal', '戌': 'Metal',
  '亥': 'Water', '子': 'Water', '丑': 'Water'
};

/**
 * Shen Sha definitions for composite charts
 */
export const COMPOSITE_SHENSHA_DEFS: Record<string, {
  name: string;
  chineseName: string;
  nature: 'auspicious' | 'inauspicious' | 'neutral';
  meaning: string;
}> = {
  'red_matchmaker': {
    name: 'Red Matchmaker',
    chineseName: '红鸾',
    nature: 'auspicious',
    meaning: 'The relationship has a karmic romantic destiny. Deep emotional bonding is favored.'
  },
  'sky_happiness': {
    name: 'Sky Happiness',
    chineseName: '天喜',
    nature: 'auspicious',
    meaning: 'The relationship brings joy and celebration. Happy events are destined.'
  },
  'nobleman': {
    name: 'Heavenly Nobleman',
    chineseName: '天乙贵人',
    nature: 'auspicious',
    meaning: 'The relationship attracts helpers and support. Noble energy protects the bond.'
  },
  'academic_star': {
    name: 'Academic Star',
    chineseName: '文昌',
    nature: 'auspicious',
    meaning: 'The relationship supports intellectual growth and shared learning.'
  },
  'general_star': {
    name: 'General Star',
    chineseName: '将星',
    nature: 'auspicious',
    meaning: 'The relationship has leadership potential. Together you command respect.'
  },
  'peach_blossom': {
    name: 'Peach Blossom',
    chineseName: '桃花',
    nature: 'neutral',
    meaning: 'The relationship has strong romantic/attraction energy. Can indicate passion or temptation.'
  },
  'traveling_horse': {
    name: 'Traveling Horse',
    chineseName: '驿马',
    nature: 'neutral',
    meaning: 'The relationship involves movement, travel, or constant change.'
  },
  'loneliness_star': {
    name: 'Loneliness Star',
    chineseName: '孤辰',
    nature: 'inauspicious',
    meaning: 'The relationship may face periods of isolation or emotional distance.'
  },
  'widow_star': {
    name: 'Widow Star',
    chineseName: '寡宿',
    nature: 'inauspicious',
    meaning: 'The relationship may face separation challenges or independence needs.'
  }
};

// ============================================================================
// PILLAR COMBINATION LOGIC
// ============================================================================

/**
 * Get stem index in cycle
 */
function getStemIndex(stem: string): number {
  return STEMS.indexOf(stem as StemName);
}

/**
 * Get branch index in cycle
 */
function getBranchIndex(branch: string): number {
  return BRANCHES.indexOf(branch as BranchName);
}

/**
 * Get midpoint stem between two stems
 */
function getMidpointStem(stemA: string, stemB: string): StemName {
  const indexA = getStemIndex(stemA);
  const indexB = getStemIndex(stemB);

  if (indexA === -1 || indexB === -1) {
    return stemA as StemName; // Fallback
  }

  // Calculate midpoint, handling wrap-around
  let diff = indexB - indexA;
  if (diff < 0) diff += 10;

  const midOffset = Math.floor(diff / 2);
  const midIndex = (indexA + midOffset) % 10;

  return STEMS[midIndex];
}

/**
 * Get midpoint branch between two branches
 */
function getMidpointBranch(branchA: string, branchB: string): BranchName {
  const indexA = getBranchIndex(branchA);
  const indexB = getBranchIndex(branchB);

  if (indexA === -1 || indexB === -1) {
    return branchA as BranchName; // Fallback
  }

  // Calculate midpoint, handling wrap-around
  let diff = indexB - indexA;
  if (diff < 0) diff += 12;

  const midOffset = Math.floor(diff / 2);
  const midIndex = (indexA + midOffset) % 12;

  return BRANCHES[midIndex];
}

/**
 * Check if two stems form a combination
 */
function checkStemCombination(stemA: string, stemB: string): { combines: boolean; result?: ElementName } {
  const combo = STEM_COMBINATIONS[stemA];
  if (combo && combo.partner === stemB) {
    return { combines: true, result: combo.result };
  }
  return { combines: false };
}

/**
 * Check if two branches form 六合
 */
function checkLiuhe(branchA: string, branchB: string): { combines: boolean; result?: ElementName } {
  for (const [b1, b2, result] of LIUHE_PAIRS) {
    if ((branchA === b1 && branchB === b2) || (branchA === b2 && branchB === b1)) {
      return { combines: true, result };
    }
  }
  return { combines: false };
}

/**
 * Check if two branches share a 三合 frame
 */
function checkSanhe(branchA: string, branchB: string): { shares: boolean; element?: ElementName } {
  for (const [element, frame] of Object.entries(SANHE_FRAMES)) {
    if (frame.includes(branchA) && frame.includes(branchB)) {
      return { shares: true, element: element as ElementName };
    }
  }
  return { shares: false };
}

/**
 * Get stem for an element and polarity
 */
function getStemForElement(element: ElementName, polarity: Polarity): StemName {
  const stemMap: Record<ElementName, Record<Polarity, StemName>> = {
    Wood: { Yang: '甲', Yin: '乙' },
    Fire: { Yang: '丙', Yin: '丁' },
    Earth: { Yang: '戊', Yin: '己' },
    Metal: { Yang: '庚', Yin: '辛' },
    Water: { Yang: '壬', Yin: '癸' }
  };
  return stemMap[element][polarity];
}

/**
 * Get branch for an element (primary branch)
 */
function getBranchForElement(element: ElementName): BranchName {
  const branchMap: Record<ElementName, BranchName> = {
    Wood: '卯',
    Fire: '午',
    Earth: '辰',
    Metal: '酉',
    Water: '子'
  };
  return branchMap[element];
}

/**
 * Combine two pillars into a composite pillar
 * Priority: identical → combination → liuhe → sanhe → midpoint
 */
export function combinePillars(
  stemA: string,
  branchA: string,
  stemB: string,
  branchB: string,
  pillarName: string
): CompositePillar {
  let compositeStem: StemName;
  let compositeBranch: BranchName;
  let method: CompositePillar['combinationMethod'] = 'midpoint';
  let notes = '';

  // STEM COMBINATION LOGIC
  if (stemA === stemB) {
    // Identical stems
    compositeStem = stemA as StemName;
    method = 'identical';
    notes = `Both have ${stemA}`;
  } else {
    // Check for stem combination (天干合)
    const stemCombo = checkStemCombination(stemA, stemB);
    if (stemCombo.combines && stemCombo.result) {
      // Use the resulting element's stem (prefer Yang)
      compositeStem = getStemForElement(stemCombo.result, 'Yang');
      method = 'stem_combination';
      notes = `${stemA}+${stemB} combine → ${stemCombo.result}`;
    } else {
      // Midpoint
      compositeStem = getMidpointStem(stemA, stemB);
      notes = `Midpoint of ${stemA} and ${stemB}`;
    }
  }

  // BRANCH COMBINATION LOGIC
  if (branchA === branchB) {
    // Identical branches
    compositeBranch = branchA as BranchName;
    if (method === 'identical') {
      notes += ` + both have ${branchA}`;
    } else {
      method = 'identical';
      notes += `, both have ${branchA}`;
    }
  } else {
    // Check for 六合
    const liuheResult = checkLiuhe(branchA, branchB);
    if (liuheResult.combines && liuheResult.result) {
      compositeBranch = getBranchForElement(liuheResult.result);
      if (method === 'midpoint') method = 'liuhe';
      notes += `, ${branchA}+${branchB} 六合 → ${liuheResult.result}`;
    } else {
      // Check for 三合 frame sharing
      const sanheResult = checkSanhe(branchA, branchB);
      if (sanheResult.shares && sanheResult.element) {
        compositeBranch = getBranchForElement(sanheResult.element);
        if (method === 'midpoint') method = 'sanhe';
        notes += `, ${branchA}+${branchB} share 三合 ${sanheResult.element} frame`;
      } else {
        // Midpoint
        compositeBranch = getMidpointBranch(branchA, branchB);
        notes += `, branch midpoint of ${branchA} and ${branchB}`;
      }
    }
  }

  return {
    stem: compositeStem,
    branch: compositeBranch,
    stemElement: STEM_ELEMENT[compositeStem],
    branchElement: BRANCH_ELEMENT[compositeBranch],
    stemPolarity: STEM_POLARITY[compositeStem],
    combinationMethod: method,
    combinationNotes: `${pillarName}: ${notes.trim()}`
  };
}

// ============================================================================
// DAY MASTER ANALYSIS
// ============================================================================

/**
 * Compute composite Day Master with strength analysis
 */
export function computeCompositeDayMaster(
  compositeDayStem: StemName,
  compositeMonthBranch: BranchName,
  personA: NatalPillarsInput,
  personB: NatalPillarsInput,
  elementDist: CompositeElementDistribution
): CompositeDayMaster {
  const element = STEM_ELEMENT[compositeDayStem];
  const polarity = STEM_POLARITY[compositeDayStem];
  const dmInfo = DM_PERSONALITIES[compositeDayStem];

  // Calculate strength score
  let strengthScore = 50; // Base neutral

  // 1. Seasonality bonus (month branch support)
  const monthSeason = BRANCH_SEASON[compositeMonthBranch];
  if (monthSeason === element) {
    strengthScore += 15; // In season
  } else if (ELEMENT_PRODUCES[monthSeason] === element) {
    strengthScore += 8; // Supported by season
  } else if (ELEMENT_CONTROLS[monthSeason] === element) {
    strengthScore -= 10; // Controlled by season
  }

  // 2. Element distribution support
  const dmElementPercent = elementDist[element];
  if (dmElementPercent >= 30) {
    strengthScore += 12;
  } else if (dmElementPercent >= 20) {
    strengthScore += 6;
  } else if (dmElementPercent < 10) {
    strengthScore -= 8;
  }

  // 3. Resource element support (element that produces DM)
  const resourceElement = Object.entries(ELEMENT_PRODUCES).find(([_, prod]) => prod === element)?.[0] as ElementName | undefined;
  if (resourceElement) {
    const resourcePercent = elementDist[resourceElement];
    if (resourcePercent >= 20) {
      strengthScore += 8;
    }
  }

  // 4. Friend element (same element in both charts)
  const aElements = [
    STEM_ELEMENT[personA.yearStem], STEM_ELEMENT[personA.monthStem],
    STEM_ELEMENT[personA.dayStem], STEM_ELEMENT[personA.hourStem],
    BRANCH_ELEMENT[personA.yearBranch], BRANCH_ELEMENT[personA.monthBranch],
    BRANCH_ELEMENT[personA.dayBranch], BRANCH_ELEMENT[personA.hourBranch]
  ];
  const bElements = [
    STEM_ELEMENT[personB.yearStem], STEM_ELEMENT[personB.monthStem],
    STEM_ELEMENT[personB.dayStem], STEM_ELEMENT[personB.hourStem],
    BRANCH_ELEMENT[personB.yearBranch], BRANCH_ELEMENT[personB.monthBranch],
    BRANCH_ELEMENT[personB.dayBranch], BRANCH_ELEMENT[personB.hourBranch]
  ];

  const aHasDMElement = aElements.filter(e => e === element).length;
  const bHasDMElement = bElements.filter(e => e === element).length;
  strengthScore += Math.min(aHasDMElement + bHasDMElement, 6) * 2;

  // Clamp score
  strengthScore = Math.max(0, Math.min(100, strengthScore));

  // Determine category
  let strengthCategory: CompositeDayMaster['strengthCategory'];
  if (strengthScore >= 75) strengthCategory = 'very_strong';
  else if (strengthScore >= 60) strengthCategory = 'strong';
  else if (strengthScore >= 40) strengthCategory = 'balanced';
  else if (strengthScore >= 25) strengthCategory = 'weak';
  else strengthCategory = 'very_weak';

  // Build analysis
  let strengthAnalysis = '';
  if (strengthCategory === 'very_strong') {
    strengthAnalysis = 'The relationship has abundant energy and strong presence. May need outlets for expression.';
  } else if (strengthCategory === 'strong') {
    strengthAnalysis = 'The relationship has good vitality and resilience. Can weather challenges together.';
  } else if (strengthCategory === 'balanced') {
    strengthAnalysis = 'The relationship has balanced energy. Neither dominating nor passive.';
  } else if (strengthCategory === 'weak') {
    strengthAnalysis = 'The relationship benefits from external support and nurturing environments.';
  } else {
    strengthAnalysis = 'The relationship may feel fragile and needs careful cultivation and support.';
  }

  return {
    stem: compositeDayStem,
    element,
    polarity,
    chineseName: dmInfo.name,
    personality: dmInfo.personality,
    strengthScore,
    strengthCategory,
    strengthAnalysis
  };
}

// ============================================================================
// ELEMENT DISTRIBUTION
// ============================================================================

/**
 * Count element occurrences in a chart
 */
function countElements(pillars: NatalPillarsInput): Record<ElementName, number> {
  const counts: Record<ElementName, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };

  // Stems (weight: 1.0)
  counts[STEM_ELEMENT[pillars.yearStem]] += 1;
  counts[STEM_ELEMENT[pillars.monthStem]] += 1;
  counts[STEM_ELEMENT[pillars.dayStem]] += 1;
  counts[STEM_ELEMENT[pillars.hourStem]] += 1;

  // Branches (weight: 1.2 - branches carry more mass)
  counts[BRANCH_ELEMENT[pillars.yearBranch]] += 1.2;
  counts[BRANCH_ELEMENT[pillars.monthBranch]] += 1.2;
  counts[BRANCH_ELEMENT[pillars.dayBranch]] += 1.2;
  counts[BRANCH_ELEMENT[pillars.hourBranch]] += 1.2;

  return counts;
}

/**
 * Compute composite element distribution
 */
export function computeCompositeElementDistribution(
  personA: NatalPillarsInput,
  personB: NatalPillarsInput
): CompositeElementDistribution {
  const countsA = countElements(personA);
  const countsB = countElements(personB);

  // Sum both charts
  const combined: Record<ElementName, number> = {
    Wood: countsA.Wood + countsB.Wood,
    Fire: countsA.Fire + countsB.Fire,
    Earth: countsA.Earth + countsB.Earth,
    Metal: countsA.Metal + countsB.Metal,
    Water: countsA.Water + countsB.Water
  };

  // Normalize to percentages
  const total = combined.Wood + combined.Fire + combined.Earth + combined.Metal + combined.Water;
  const normalized: Record<ElementName, number> = {
    Wood: Math.round((combined.Wood / total) * 100),
    Fire: Math.round((combined.Fire / total) * 100),
    Earth: Math.round((combined.Earth / total) * 100),
    Metal: Math.round((combined.Metal / total) * 100),
    Water: Math.round((combined.Water / total) * 100)
  };

  // Find dominant and weakest
  const entries = Object.entries(normalized) as [ElementName, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const dominant = entries[0][0];
  const weakest = entries[entries.length - 1][0];

  // Calculate balance score (how evenly distributed - 20% each is perfect)
  const idealPercent = 20;
  let imbalanceSum = 0;
  for (const [_, percent] of entries) {
    imbalanceSum += Math.abs(percent - idealPercent);
  }
  const balanceScore = Math.max(0, 100 - imbalanceSum);

  let balance: CompositeElementDistribution['balance'];
  if (balanceScore >= 70) balance = 'balanced';
  else if (balanceScore >= 50) balance = 'slightly_imbalanced';
  else if (balanceScore >= 30) balance = 'imbalanced';
  else balance = 'severely_imbalanced';

  return {
    ...normalized,
    dominant,
    weakest,
    balance,
    balanceScore
  };
}

// ============================================================================
// TEN GODS COMPUTATION
// ============================================================================

/**
 * Get the Ten God relationship between DM element and another element
 */
function getTenGodRelation(
  dmElement: ElementName,
  dmPolarity: Polarity,
  otherElement: ElementName,
  otherPolarity: Polarity
): string {
  const produces = ELEMENT_PRODUCES[dmElement];
  const controls = ELEMENT_CONTROLS[dmElement];
  const producedBy = Object.entries(ELEMENT_PRODUCES).find(([_, prod]) => prod === dmElement)?.[0] as ElementName;
  const controlledBy = Object.entries(ELEMENT_CONTROLS).find(([_, ctrl]) => ctrl === dmElement)?.[0] as ElementName;

  const samePolarity = dmPolarity === otherPolarity;

  if (otherElement === dmElement) {
    return samePolarity ? 'friend' : 'rob_wealth';
  } else if (otherElement === produces) {
    return samePolarity ? 'eating_god' : 'hurting_officer';
  } else if (otherElement === controls) {
    return samePolarity ? 'indirect_wealth' : 'direct_wealth';
  } else if (otherElement === controlledBy) {
    return samePolarity ? 'seven_killings' : 'direct_officer';
  } else if (otherElement === producedBy) {
    return samePolarity ? 'indirect_resource' : 'direct_resource';
  }

  return 'friend'; // Fallback
}

/**
 * Compute composite Ten Gods
 */
export function computeCompositeTenGods(
  dayMaster: CompositeDayMaster,
  yearPillar: CompositePillar,
  monthPillar: CompositePillar,
  dayPillar: CompositePillar,
  hourPillar: CompositePillar
): CompositeTenGods {
  const dmElement = dayMaster.element;
  const dmPolarity = dayMaster.polarity;

  const godCounts: Record<string, { count: number; locations: string[] }> = {};
  const pillars = [
    { pillar: yearPillar, name: 'Year' },
    { pillar: monthPillar, name: 'Month' },
    { pillar: dayPillar, name: 'Day' },
    { pillar: hourPillar, name: 'Hour' }
  ];

  // Analyze each position
  for (const { pillar, name } of pillars) {
    // Stem
    const stemGod = getTenGodRelation(dmElement, dmPolarity, pillar.stemElement, pillar.stemPolarity);
    if (!godCounts[stemGod]) godCounts[stemGod] = { count: 0, locations: [] };
    godCounts[stemGod].count += 1;
    godCounts[stemGod].locations.push(`${name} Stem`);

    // Branch (use Yang polarity for branches)
    const branchGod = getTenGodRelation(dmElement, dmPolarity, pillar.branchElement, 'Yang');
    if (!godCounts[branchGod]) godCounts[branchGod] = { count: 0, locations: [] };
    godCounts[branchGod].count += 1.2; // Branches have more weight
    godCounts[branchGod].locations.push(`${name} Branch`);
  }

  // Build Ten Gods structure
  const buildGodInfo = (key: string): TenGodInfo | null => {
    const data = godCounts[key];
    if (!data || data.count === 0) return null;

    const names = TEN_GOD_NAMES[key];
    const element = getElementForGod(dmElement, key);

    return {
      name: names.english,
      chineseName: names.chinese,
      element,
      relationship: getGodRelationship(key),
      strength: Math.round(data.count * 10),
      pillarLocation: data.locations.join(', ')
    };
  };

  // Find dominant god
  const sortedGods = Object.entries(godCounts)
    .sort((a, b) => b[1].count - a[1].count);
  const dominantKey = sortedGods[0]?.[0] || 'friend';
  const dominantNames = TEN_GOD_NAMES[dominantKey];

  return {
    directWealth: buildGodInfo('direct_wealth'),
    indirectWealth: buildGodInfo('indirect_wealth'),
    directOfficer: buildGodInfo('direct_officer'),
    sevenKillings: buildGodInfo('seven_killings'),
    directResource: buildGodInfo('direct_resource'),
    indirectResource: buildGodInfo('indirect_resource'),
    robWealth: buildGodInfo('rob_wealth'),
    friend: buildGodInfo('friend'),
    eatingGod: buildGodInfo('eating_god'),
    hurtingOfficer: buildGodInfo('hurting_officer'),
    dominant: dominantNames?.english || 'Friend',
    dominantChinese: dominantNames?.chinese || '比肩',
    interpretation: getDominantGodInterpretation(dominantKey)
  };
}

/**
 * Get element for a given Ten God type
 */
function getElementForGod(dmElement: ElementName, godType: string): ElementName {
  const produces = ELEMENT_PRODUCES[dmElement];
  const controls = ELEMENT_CONTROLS[dmElement];
  const producedBy = Object.entries(ELEMENT_PRODUCES).find(([_, prod]) => prod === dmElement)?.[0] as ElementName;
  const controlledBy = Object.entries(ELEMENT_CONTROLS).find(([_, ctrl]) => ctrl === dmElement)?.[0] as ElementName;

  switch (godType) {
    case 'friend':
    case 'rob_wealth':
      return dmElement;
    case 'eating_god':
    case 'hurting_officer':
      return produces;
    case 'direct_wealth':
    case 'indirect_wealth':
      return controls;
    case 'direct_officer':
    case 'seven_killings':
      return controlledBy;
    case 'direct_resource':
    case 'indirect_resource':
      return producedBy;
    default:
      return dmElement;
  }
}

/**
 * Get relationship description for Ten God
 */
function getGodRelationship(godType: string): string {
  const relationships: Record<string, string> = {
    'friend': 'Same element, same polarity - cooperation and support',
    'rob_wealth': 'Same element, opposite polarity - competition and challenge',
    'eating_god': 'Produced element, same polarity - creativity and expression',
    'hurting_officer': 'Produced element, opposite polarity - rebellion and innovation',
    'direct_wealth': 'Controlled element, opposite polarity - steady resources',
    'indirect_wealth': 'Controlled element, same polarity - unexpected gains',
    'direct_officer': 'Controller element, opposite polarity - structure and discipline',
    'seven_killings': 'Controller element, same polarity - pressure and drive',
    'direct_resource': 'Producer element, opposite polarity - nurturing support',
    'indirect_resource': 'Producer element, same polarity - unconventional wisdom'
  };
  return relationships[godType] || 'Unknown relationship';
}

/**
 * Get interpretation for dominant Ten God
 */
function getDominantGodInterpretation(godType: string): string {
  const interpretations: Record<string, string> = {
    'friend': 'This relationship thrives on equality, mutual support, and shared identity. Partners see each other as true companions.',
    'rob_wealth': 'This relationship has competitive energy. Partners challenge each other to grow but may struggle over resources.',
    'eating_god': 'This relationship is creative and expressive. Partners inspire each other\'s artistic and intellectual pursuits.',
    'hurting_officer': 'This relationship values freedom and innovation. Partners push boundaries and challenge conventions together.',
    'direct_wealth': 'This relationship focuses on stability and material security. Partners build tangible assets together.',
    'indirect_wealth': 'This relationship attracts unexpected opportunities. Partners bring good fortune to each other.',
    'direct_officer': 'This relationship values structure and commitment. Partners honor duties and responsibilities.',
    'seven_killings': 'This relationship is intense and transformative. Partners drive each other to overcome obstacles.',
    'direct_resource': 'This relationship is nurturing and supportive. Partners care for each other\'s wellbeing.',
    'indirect_resource': 'This relationship values wisdom and unconventional paths. Partners learn from each other\'s unique perspectives.'
  };
  return interpretations[godType] || 'A balanced relationship with diverse influences.';
}

// ============================================================================
// USEFUL GOD COMPUTATION
// ============================================================================

/**
 * Compute composite Useful God (用神)
 */
export function computeCompositeUsefulGod(
  dayMaster: CompositeDayMaster,
  elementDist: CompositeElementDistribution,
  _tenGods: CompositeTenGods
): CompositeUsefulGod {
  const dmElement = dayMaster.element;
  const dmStrength = dayMaster.strengthCategory;

  const produces = ELEMENT_PRODUCES[dmElement];
  const controls = ELEMENT_CONTROLS[dmElement];
  const producedBy = Object.entries(ELEMENT_PRODUCES).find(([_, prod]) => prod === dmElement)?.[0] as ElementName;
  const controlledBy = Object.entries(ELEMENT_CONTROLS).find(([_, ctrl]) => ctrl === dmElement)?.[0] as ElementName;

  let usefulElement: ElementName;
  let reason: string;
  let structureType: CompositeUsefulGod['structureType'] = 'normal';
  let supportingElements: ElementName[] = [];
  let avoidElements: ElementName[] = [];

  if (dmStrength === 'very_strong' || dmStrength === 'strong') {
    // Strong DM needs to be drained or controlled
    // Priority: Wealth → Output → Officer
    if (elementDist[controls] < 15) {
      usefulElement = controls;
      reason = `Strong ${dmElement} relationship needs ${controls} (Wealth) to create purpose and direction.`;
    } else if (elementDist[produces] < 15) {
      usefulElement = produces;
      reason = `Strong ${dmElement} relationship benefits from ${produces} (Output) for expression and creation.`;
    } else {
      usefulElement = controlledBy;
      reason = `Strong ${dmElement} relationship needs ${controlledBy} (Officer) for structure and discipline.`;
    }
    supportingElements = [produces, controls];
    avoidElements = [dmElement, producedBy];
  } else if (dmStrength === 'very_weak' || dmStrength === 'weak') {
    // Weak DM needs support
    // Priority: Resource → Friend
    if (elementDist[producedBy] < 20) {
      usefulElement = producedBy;
      reason = `Weak ${dmElement} relationship needs ${producedBy} (Resource) for nurturing and support.`;
    } else {
      usefulElement = dmElement;
      reason = `Weak ${dmElement} relationship needs more ${dmElement} (Friend) energy for strength.`;
    }
    supportingElements = [dmElement, producedBy];
    avoidElements = [controlledBy, controls];
  } else {
    // Balanced - use what's missing
    const weakestElement = elementDist.weakest;
    usefulElement = weakestElement;
    reason = `Balanced relationship benefits from ${weakestElement} to address its weakest area.`;
    supportingElements = [ELEMENT_PRODUCES[weakestElement]];
    avoidElements = [];
  }

  // Check for special follow structures
  const dominantPercent = elementDist[elementDist.dominant];
  if (dominantPercent >= 45 && elementDist.dominant !== dmElement) {
    structureType = elementDist.dominant === controls ? 'follow_wealth' :
                    elementDist.dominant === controlledBy ? 'follow_officer' :
                    elementDist.dominant === producedBy ? 'follow_resource' : 'special';
    usefulElement = elementDist.dominant;
    reason = `Special follow structure - the relationship follows ${elementDist.dominant} energy.`;
    supportingElements = [elementDist.dominant];
  }

  const elementChinese: Record<ElementName, string> = {
    Wood: '木', Fire: '火', Earth: '土', Metal: '金', Water: '水'
  };

  return {
    element: usefulElement,
    chineseName: elementChinese[usefulElement],
    reason,
    structureType,
    supportingElements,
    avoidElements,
    stabilizingAdvice: getStabilizingAdvice(usefulElement)
  };
}

/**
 * Get stabilizing advice for Useful God element
 */
function getStabilizingAdvice(element: ElementName): string {
  const advice: Record<ElementName, string> = {
    Wood: 'Cultivate growth through learning, travel, and new experiences. Nature and plants bring harmony.',
    Fire: 'Add warmth through passion, celebration, and shared joy. Light, colors, and social gatherings help.',
    Earth: 'Build stability through routine, home, and grounding activities. Mountains and earth tones support.',
    Metal: 'Create structure through organization, clarity, and decisive actions. White/metallic accents help.',
    Water: 'Flow with adaptability, communication, and emotional depth. Water features and dark colors support.'
  };
  return advice[element];
}

// ============================================================================
// SHEN SHA COMPUTATION
// ============================================================================

/**
 * Red Matchmaker (红鸾) map - from year branch
 */
const RED_MATCHMAKER_MAP: Record<string, string> = {
  '子': '卯', '丑': '寅', '寅': '丑', '卯': '子',
  '辰': '亥', '巳': '戌', '午': '酉', '未': '申',
  '申': '未', '酉': '午', '戌': '巳', '亥': '辰'
};

/**
 * Sky Happiness (天喜) map - opposite to 红鸾
 */
const SKY_HAPPINESS_MAP: Record<string, string> = {
  '子': '酉', '丑': '申', '寅': '未', '卯': '午',
  '辰': '巳', '巳': '辰', '午': '卯', '未': '寅',
  '申': '丑', '酉': '子', '戌': '亥', '亥': '戌'
};

/**
 * Nobleman (天乙贵人) map - from day stem
 */
const NOBLEMAN_MAP: Record<string, string[]> = {
  '甲': ['丑', '未'], '乙': ['子', '申'], '丙': ['亥', '酉'],
  '丁': ['亥', '酉'], '戊': ['丑', '未'], '己': ['子', '申'],
  '庚': ['丑', '未'], '辛': ['寅', '午'], '壬': ['卯', '巳'],
  '癸': ['卯', '巳']
};

/**
 * Academic Star (文昌) map - from day stem
 */
const ACADEMIC_STAR_MAP: Record<string, string> = {
  '甲': '巳', '乙': '午', '丙': '申', '丁': '酉',
  '戊': '申', '己': '酉', '庚': '亥', '辛': '子',
  '壬': '寅', '癸': '卯'
};

/**
 * General Star (将星) map - from year branch
 */
const GENERAL_STAR_MAP: Record<string, string> = {
  '子': '子', '丑': '酉', '寅': '午', '卯': '卯',
  '辰': '子', '巳': '酉', '午': '午', '未': '卯',
  '申': '子', '酉': '酉', '戌': '午', '亥': '卯'
};

/**
 * Peach Blossom (桃花) map - from year branch
 */
const PEACH_BLOSSOM_MAP: Record<string, string> = {
  '子': '酉', '丑': '午', '寅': '卯', '卯': '子',
  '辰': '酉', '巳': '午', '午': '卯', '未': '子',
  '申': '酉', '酉': '午', '戌': '卯', '亥': '子'
};

/**
 * Traveling Horse (驿马) map - from year branch
 */
const TRAVELING_HORSE_MAP: Record<string, string> = {
  '子': '寅', '丑': '亥', '寅': '申', '卯': '巳',
  '辰': '寅', '巳': '亥', '午': '申', '未': '巳',
  '申': '寅', '酉': '亥', '戌': '申', '亥': '巳'
};

/**
 * Loneliness Star (孤辰) map - from year branch
 */
const LONELINESS_STAR_MAP: Record<string, string> = {
  '子': '寅', '丑': '寅', '寅': '巳', '卯': '巳',
  '辰': '巳', '巳': '申', '午': '申', '未': '申',
  '申': '亥', '酉': '亥', '戌': '亥', '亥': '寅'
};

/**
 * Widow Star (寡宿) map - from year branch
 */
const WIDOW_STAR_MAP: Record<string, string> = {
  '子': '戌', '丑': '戌', '寅': '丑', '卯': '丑',
  '辰': '丑', '巳': '辰', '午': '辰', '未': '辰',
  '申': '未', '酉': '未', '戌': '未', '亥': '戌'
};

/**
 * Compute composite Shen Sha
 */
export function computeCompositeShenSha(
  yearPillar: CompositePillar,
  monthPillar: CompositePillar,
  dayPillar: CompositePillar,
  hourPillar: CompositePillar
): CompositeShenSha[] {
  const shenSha: CompositeShenSha[] = [];
  const allBranches = [yearPillar.branch, monthPillar.branch, dayPillar.branch, hourPillar.branch];

  // Red Matchmaker (红鸾)
  const redMatchmaker = RED_MATCHMAKER_MAP[yearPillar.branch];
  if (redMatchmaker && allBranches.includes(redMatchmaker as BranchName)) {
    shenSha.push({
      ...COMPOSITE_SHENSHA_DEFS['red_matchmaker'],
      location: `Year Branch → ${redMatchmaker}`,
      description: `Red Matchmaker activated from composite year branch ${yearPillar.branch}`,
      relationshipMeaning: COMPOSITE_SHENSHA_DEFS['red_matchmaker'].meaning
    });
  }

  // Sky Happiness (天喜)
  const skyHappiness = SKY_HAPPINESS_MAP[yearPillar.branch];
  if (skyHappiness && allBranches.includes(skyHappiness as BranchName)) {
    shenSha.push({
      ...COMPOSITE_SHENSHA_DEFS['sky_happiness'],
      location: `Year Branch → ${skyHappiness}`,
      description: `Sky Happiness activated from composite year branch ${yearPillar.branch}`,
      relationshipMeaning: COMPOSITE_SHENSHA_DEFS['sky_happiness'].meaning
    });
  }

  // Nobleman (天乙贵人)
  const noblemanBranches = NOBLEMAN_MAP[dayPillar.stem] || [];
  for (const nb of noblemanBranches) {
    if (allBranches.includes(nb as BranchName)) {
      shenSha.push({
        ...COMPOSITE_SHENSHA_DEFS['nobleman'],
        location: `Day Stem ${dayPillar.stem} → ${nb}`,
        description: `Heavenly Nobleman activated from composite day stem`,
        relationshipMeaning: COMPOSITE_SHENSHA_DEFS['nobleman'].meaning
      });
      break; // Only count once
    }
  }

  // Academic Star (文昌)
  const academicStar = ACADEMIC_STAR_MAP[dayPillar.stem];
  if (academicStar && allBranches.includes(academicStar as BranchName)) {
    shenSha.push({
      ...COMPOSITE_SHENSHA_DEFS['academic_star'],
      location: `Day Stem ${dayPillar.stem} → ${academicStar}`,
      description: `Academic Star activated from composite day stem`,
      relationshipMeaning: COMPOSITE_SHENSHA_DEFS['academic_star'].meaning
    });
  }

  // General Star (将星)
  const generalStar = GENERAL_STAR_MAP[yearPillar.branch];
  if (generalStar && allBranches.includes(generalStar as BranchName)) {
    shenSha.push({
      ...COMPOSITE_SHENSHA_DEFS['general_star'],
      location: `Year Branch → ${generalStar}`,
      description: `General Star activated from composite year branch`,
      relationshipMeaning: COMPOSITE_SHENSHA_DEFS['general_star'].meaning
    });
  }

  // Peach Blossom (桃花)
  const peachBlossom = PEACH_BLOSSOM_MAP[yearPillar.branch];
  if (peachBlossom && allBranches.includes(peachBlossom as BranchName)) {
    shenSha.push({
      ...COMPOSITE_SHENSHA_DEFS['peach_blossom'],
      location: `Year Branch → ${peachBlossom}`,
      description: `Peach Blossom activated from composite year branch`,
      relationshipMeaning: COMPOSITE_SHENSHA_DEFS['peach_blossom'].meaning
    });
  }

  // Traveling Horse (驿马)
  const travelingHorse = TRAVELING_HORSE_MAP[yearPillar.branch];
  if (travelingHorse && allBranches.includes(travelingHorse as BranchName)) {
    shenSha.push({
      ...COMPOSITE_SHENSHA_DEFS['traveling_horse'],
      location: `Year Branch → ${travelingHorse}`,
      description: `Traveling Horse activated from composite year branch`,
      relationshipMeaning: COMPOSITE_SHENSHA_DEFS['traveling_horse'].meaning
    });
  }

  // Loneliness Star (孤辰)
  const lonelinessStar = LONELINESS_STAR_MAP[yearPillar.branch];
  if (lonelinessStar && allBranches.includes(lonelinessStar as BranchName)) {
    shenSha.push({
      ...COMPOSITE_SHENSHA_DEFS['loneliness_star'],
      location: `Year Branch → ${lonelinessStar}`,
      description: `Loneliness Star activated from composite year branch`,
      relationshipMeaning: COMPOSITE_SHENSHA_DEFS['loneliness_star'].meaning
    });
  }

  // Widow Star (寡宿)
  const widowStar = WIDOW_STAR_MAP[yearPillar.branch];
  if (widowStar && allBranches.includes(widowStar as BranchName)) {
    shenSha.push({
      ...COMPOSITE_SHENSHA_DEFS['widow_star'],
      location: `Year Branch → ${widowStar}`,
      description: `Widow Star activated from composite year branch`,
      relationshipMeaning: COMPOSITE_SHENSHA_DEFS['widow_star'].meaning
    });
  }

  return shenSha;
}

// ============================================================================
// LUCK PILLARS COMPUTATION
// ============================================================================

/**
 * Compute composite luck pillars (大运)
 */
export function computeCompositeLuckPillars(
  monthPillar: CompositePillar,
  dayMaster: CompositeDayMaster,
  usefulGod: CompositeUsefulGod,
  startAge: number = 0,
  count: number = 8
): CompositeLuckPillar[] {
  const luckPillars: CompositeLuckPillar[] = [];

  // Direction based on composite DM polarity (simplified)
  // Yang goes forward, Yin goes backward through the cycle
  const direction = dayMaster.polarity === 'Yang' ? 1 : -1;

  let currentStemIndex = getStemIndex(monthPillar.stem);
  let currentBranchIndex = getBranchIndex(monthPillar.branch);

  for (let i = 0; i < count; i++) {
    // Move to next/previous pillar
    currentStemIndex = (currentStemIndex + direction + 10) % 10;
    currentBranchIndex = (currentBranchIndex + direction + 12) % 12;

    const stem = STEMS[currentStemIndex];
    const branch = BRANCHES[currentBranchIndex];
    const element = STEM_ELEMENT[stem];

    // Calculate favorability based on Useful God
    const isUseful = element === usefulGod.element || usefulGod.supportingElements.includes(element);
    const isAvoided = usefulGod.avoidElements.includes(element);

    let favorability: CompositeLuckPillar['favorability'];
    if (isUseful && !isAvoided) {
      favorability = element === usefulGod.element ? 'excellent' : 'good';
    } else if (isAvoided) {
      favorability = 'challenging';
    } else {
      favorability = 'neutral';
    }

    const pillarStartAge = startAge + (i * 10);
    const pillarEndAge = pillarStartAge + 9;

    luckPillars.push({
      startAge: pillarStartAge,
      endAge: pillarEndAge,
      stem,
      branch,
      element,
      favorability,
      usefulGodActive: isUseful,
      description: getLuckPillarDescription(stem, branch, element, favorability, pillarStartAge)
    });
  }

  return luckPillars;
}

/**
 * Get luck pillar description
 */
function getLuckPillarDescription(
  stem: StemName,
  branch: BranchName,
  element: ElementName,
  favorability: CompositeLuckPillar['favorability'],
  startAge: number
): string {
  const elementChinese: Record<ElementName, string> = {
    Wood: '木', Fire: '火', Earth: '土', Metal: '金', Water: '水'
  };

  let desc = `${stem}${branch} (${elementChinese[element]}) - `;

  switch (favorability) {
    case 'excellent':
      desc += 'A golden period for the relationship. Growth and harmony flourish.';
      break;
    case 'good':
      desc += 'Favorable energy supports the bond. Good progress together.';
      break;
    case 'neutral':
      desc += 'Stable period with balanced influences. Maintain equilibrium.';
      break;
    case 'challenging':
      desc += 'Testing period requiring patience and communication.';
      break;
    case 'difficult':
      desc += 'Challenging time demanding extra effort to maintain harmony.';
      break;
  }

  if (startAge <= 10) {
    desc += ' Foundation-building years.';
  } else if (startAge >= 50) {
    desc += ' Mature partnership phase.';
  }

  return desc;
}

// ============================================================================
// MAIN COMPUTATION FUNCTION
// ============================================================================

/**
 * Compute complete composite chart for two people
 */
export function computeCompositeChart(
  personA: NatalPillarsInput,
  personB: NatalPillarsInput,
  personAName: string = 'Person A',
  personBName: string = 'Person B'
): CompositeChart {
  // 1. Compute composite pillars
  const yearPillar = combinePillars(
    personA.yearStem, personA.yearBranch,
    personB.yearStem, personB.yearBranch,
    'Year'
  );

  const monthPillar = combinePillars(
    personA.monthStem, personA.monthBranch,
    personB.monthStem, personB.monthBranch,
    'Month'
  );

  const dayPillar = combinePillars(
    personA.dayStem, personA.dayBranch,
    personB.dayStem, personB.dayBranch,
    'Day'
  );

  const hourPillar = combinePillars(
    personA.hourStem, personA.hourBranch,
    personB.hourStem, personB.hourBranch,
    'Hour'
  );

  // 2. Compute element distribution
  const elementDistribution = computeCompositeElementDistribution(personA, personB);

  // 3. Compute Day Master
  const dayMaster = computeCompositeDayMaster(
    dayPillar.stem,
    monthPillar.branch,
    personA,
    personB,
    elementDistribution
  );

  // 4. Compute Ten Gods
  const tenGods = computeCompositeTenGods(dayMaster, yearPillar, monthPillar, dayPillar, hourPillar);

  // 5. Compute Useful God
  const usefulGod = computeCompositeUsefulGod(dayMaster, elementDistribution, tenGods);

  // 6. Compute Shen Sha
  const shenSha = computeCompositeShenSha(yearPillar, monthPillar, dayPillar, hourPillar);

  // 7. Compute Luck Pillars
  const luckPillars = computeCompositeLuckPillars(monthPillar, dayMaster, usefulGod);

  // 8. Generate interpretations
  const coreStrengths = generateCoreStrengths(dayMaster, tenGods, shenSha, elementDistribution);
  const coreVulnerabilities = generateCoreVulnerabilities(dayMaster, elementDistribution, usefulGod);
  const karmicPurpose = generateKarmicPurpose(dayMaster, tenGods, shenSha);

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayMaster,
    elementDistribution,
    tenGods,
    usefulGod,
    shenSha,
    luckPillars,
    personAName,
    personBName,
    relationshipName: `${personAName} & ${personBName}`,
    computedAt: new Date().toISOString(),
    relationshipPersonality: dayMaster.personality,
    coreStrengths,
    coreVulnerabilities,
    karmicPurpose
  };
}

// ============================================================================
// INTERPRETATION GENERATORS
// ============================================================================

/**
 * Generate core strengths from composite chart
 */
function generateCoreStrengths(
  dayMaster: CompositeDayMaster,
  tenGods: CompositeTenGods,
  shenSha: CompositeShenSha[],
  elementDist: CompositeElementDistribution
): string[] {
  const strengths: string[] = [];

  // Day Master strength
  if (dayMaster.strengthCategory === 'very_strong' || dayMaster.strengthCategory === 'strong') {
    strengths.push(`Strong ${dayMaster.element} foundation provides resilience and vitality`);
  }

  // Dominant Ten God
  if (tenGods.dominant === 'Direct Resource' || tenGods.dominant === 'Indirect Resource') {
    strengths.push('Natural nurturing and supportive dynamic');
  } else if (tenGods.dominant === 'Friend') {
    strengths.push('Equal partnership with mutual respect');
  } else if (tenGods.dominant === 'Eating God') {
    strengths.push('Creative and expressive bond');
  } else if (tenGods.dominant === 'Direct Wealth' || tenGods.dominant === 'Indirect Wealth') {
    strengths.push('Strong material and practical foundation');
  }

  // Auspicious Shen Sha
  const auspicious = shenSha.filter(s => s.nature === 'auspicious');
  for (const sha of auspicious.slice(0, 2)) {
    strengths.push(`${sha.chineseName} (${sha.name}) blesses the relationship`);
  }

  // Element balance
  if (elementDist.balance === 'balanced') {
    strengths.push('Well-balanced elemental ecosystem');
  }

  // Dominant element
  strengths.push(`${elementDist.dominant} energy dominates, bringing ${getElementQuality(elementDist.dominant)}`);

  return strengths.slice(0, 5);
}

/**
 * Generate core vulnerabilities
 */
function generateCoreVulnerabilities(
  dayMaster: CompositeDayMaster,
  elementDist: CompositeElementDistribution,
  usefulGod: CompositeUsefulGod
): string[] {
  const vulnerabilities: string[] = [];

  // Weak Day Master
  if (dayMaster.strengthCategory === 'very_weak' || dayMaster.strengthCategory === 'weak') {
    vulnerabilities.push(`Weak ${dayMaster.element} core may need external support and nurturing`);
  }

  // Element imbalance
  if (elementDist.balance === 'severely_imbalanced') {
    vulnerabilities.push('Severe elemental imbalance may cause instability');
  } else if (elementDist.balance === 'imbalanced') {
    vulnerabilities.push(`Lacking ${elementDist.weakest} energy - consider cultivating this element`);
  }

  // Avoid elements
  for (const avoid of usefulGod.avoidElements.slice(0, 2)) {
    vulnerabilities.push(`${avoid} periods may bring challenges`);
  }

  // Weak element warning
  if (elementDist[elementDist.weakest] < 10) {
    vulnerabilities.push(`Very low ${elementDist.weakest} (${elementDist[elementDist.weakest]}%) creates vulnerability`);
  }

  return vulnerabilities.slice(0, 4);
}

/**
 * Generate karmic purpose interpretation
 */
function generateKarmicPurpose(
  dayMaster: CompositeDayMaster,
  tenGods: CompositeTenGods,
  shenSha: CompositeShenSha[]
): string {
  const parts: string[] = [];

  // Day Master purpose
  const dmPurposes: Record<ElementName, string> = {
    Wood: 'to grow together and reach new heights',
    Fire: 'to shine light into each other\'s lives',
    Earth: 'to build a stable and lasting foundation',
    Metal: 'to refine and perfect each other',
    Water: 'to flow together through life\'s journeys'
  };
  parts.push(`This relationship exists ${dmPurposes[dayMaster.element]}.`);

  // Ten God purpose
  if (tenGods.dominant === 'Direct Resource' || tenGods.dominant === 'Indirect Resource') {
    parts.push('The karmic lesson is unconditional support and nurturing.');
  } else if (tenGods.dominant === 'Direct Officer' || tenGods.dominant === 'Seven Killings') {
    parts.push('The karmic lesson is discipline, commitment, and transformation.');
  } else if (tenGods.dominant === 'Eating God' || tenGods.dominant === 'Hurting Officer') {
    parts.push('The karmic lesson is creative expression and authentic self-expression.');
  } else if (tenGods.dominant === 'Direct Wealth' || tenGods.dominant === 'Indirect Wealth') {
    parts.push('The karmic lesson is building tangible value together.');
  } else {
    parts.push('The karmic lesson is mutual growth and equal partnership.');
  }

  // Shen Sha purpose
  const hasRomantic = shenSha.some(s => s.chineseName === '红鸾' || s.chineseName === '天喜');
  if (hasRomantic) {
    parts.push('A destined romantic connection with karmic significance.');
  }

  const hasNobleman = shenSha.some(s => s.chineseName === '天乙贵人');
  if (hasNobleman) {
    parts.push('You are meant to be noble helpers for each other.');
  }

  return parts.join(' ');
}

/**
 * Get quality description for an element
 */
function getElementQuality(element: ElementName): string {
  const qualities: Record<ElementName, string> = {
    Wood: 'growth, expansion, and vitality',
    Fire: 'passion, warmth, and visibility',
    Earth: 'stability, nurturing, and grounding',
    Metal: 'clarity, structure, and refinement',
    Water: 'adaptability, wisdom, and depth'
  };
  return qualities[element];
}

// ============================================================================
// STORY FORMATTERS
// ============================================================================

/**
 * Format composite chart as narrative story
 */
export function formatCompositeChartStory(chart: CompositeChart): string {
  const lines: string[] = [];

  lines.push(`## Composite Chart (合盘命盘)`);
  lines.push(`### ${chart.relationshipName}`);
  lines.push('');

  // Day Master Section
  lines.push(`**Composite Day Master: ${chart.dayMaster.chineseName}**`);
  lines.push(chart.dayMaster.personality);
  lines.push('');
  lines.push(`Strength: ${chart.dayMaster.strengthCategory.replace('_', ' ')} (${chart.dayMaster.strengthScore}/100)`);
  lines.push(chart.dayMaster.strengthAnalysis);
  lines.push('');

  // Element Distribution
  lines.push(`**Composite Element Balance**`);
  lines.push(`Wood ${chart.elementDistribution.Wood}% — Fire ${chart.elementDistribution.Fire}% — Earth ${chart.elementDistribution.Earth}% — Metal ${chart.elementDistribution.Metal}% — Water ${chart.elementDistribution.Water}%`);
  lines.push(`Balance: ${chart.elementDistribution.balance.replace('_', ' ')} | Dominant: ${chart.elementDistribution.dominant} | Weakest: ${chart.elementDistribution.weakest}`);
  lines.push('');

  // Useful God
  lines.push(`**Composite Useful God (用神): ${chart.usefulGod.element} (${chart.usefulGod.chineseName})**`);
  lines.push(chart.usefulGod.reason);
  lines.push('');
  lines.push(`*${chart.usefulGod.stabilizingAdvice}*`);
  lines.push('');

  // Ten Gods
  lines.push(`**Dominant Ten God: ${chart.tenGods.dominant} (${chart.tenGods.dominantChinese})**`);
  lines.push(chart.tenGods.interpretation);
  lines.push('');

  // Shen Sha
  if (chart.shenSha.length > 0) {
    lines.push(`**Composite Shen Sha (神煞)**`);
    for (const sha of chart.shenSha) {
      const icon = sha.nature === 'auspicious' ? '✓' : sha.nature === 'inauspicious' ? '✗' : '○';
      lines.push(`- ${icon} ${sha.chineseName} (${sha.name}): ${sha.relationshipMeaning}`);
    }
    lines.push('');
  }

  // Core Strengths
  lines.push(`**Core Strengths**`);
  for (const strength of chart.coreStrengths) {
    lines.push(`- ${strength}`);
  }
  lines.push('');

  // Core Vulnerabilities
  if (chart.coreVulnerabilities.length > 0) {
    lines.push(`**Areas for Growth**`);
    for (const vuln of chart.coreVulnerabilities) {
      lines.push(`- ${vuln}`);
    }
    lines.push('');
  }

  // Karmic Purpose
  lines.push(`**Karmic Purpose**`);
  lines.push(chart.karmicPurpose);
  lines.push('');

  // Luck Cycles Preview
  lines.push(`**Relationship Luck Cycles (大运)**`);
  for (const lp of chart.luckPillars.slice(0, 4)) {
    const icon = lp.favorability === 'excellent' ? '★' :
                 lp.favorability === 'good' ? '☆' :
                 lp.favorability === 'challenging' ? '!' : '·';
    lines.push(`- ${icon} Ages ${lp.startAge}-${lp.endAge}: ${lp.stem}${lp.branch} (${lp.element}) — ${lp.favorability}`);
  }

  return lines.join('\n');
}

/**
 * Format composite chart for debugging
 */
export function formatCompositeChartDebug(chart: CompositeChart): string {
  const lines: string[] = [];

  lines.push('=== COMPOSITE CHART DEBUG ===');
  lines.push(`Computed: ${chart.computedAt}`);
  lines.push('');

  lines.push('PILLARS:');
  lines.push(`  Year:  ${chart.yearPillar.stem}${chart.yearPillar.branch} (${chart.yearPillar.combinationMethod})`);
  lines.push(`         ${chart.yearPillar.combinationNotes}`);
  lines.push(`  Month: ${chart.monthPillar.stem}${chart.monthPillar.branch} (${chart.monthPillar.combinationMethod})`);
  lines.push(`         ${chart.monthPillar.combinationNotes}`);
  lines.push(`  Day:   ${chart.dayPillar.stem}${chart.dayPillar.branch} (${chart.dayPillar.combinationMethod})`);
  lines.push(`         ${chart.dayPillar.combinationNotes}`);
  lines.push(`  Hour:  ${chart.hourPillar.stem}${chart.hourPillar.branch} (${chart.hourPillar.combinationMethod})`);
  lines.push(`         ${chart.hourPillar.combinationNotes}`);
  lines.push('');

  lines.push('DAY MASTER:');
  lines.push(`  ${chart.dayMaster.chineseName}`);
  lines.push(`  Element: ${chart.dayMaster.element} | Polarity: ${chart.dayMaster.polarity}`);
  lines.push(`  Strength: ${chart.dayMaster.strengthCategory} (${chart.dayMaster.strengthScore})`);
  lines.push('');

  lines.push('ELEMENT DISTRIBUTION:');
  lines.push(`  Wood: ${chart.elementDistribution.Wood}%`);
  lines.push(`  Fire: ${chart.elementDistribution.Fire}%`);
  lines.push(`  Earth: ${chart.elementDistribution.Earth}%`);
  lines.push(`  Metal: ${chart.elementDistribution.Metal}%`);
  lines.push(`  Water: ${chart.elementDistribution.Water}%`);
  lines.push(`  Balance Score: ${chart.elementDistribution.balanceScore}`);
  lines.push('');

  lines.push('USEFUL GOD:');
  lines.push(`  Element: ${chart.usefulGod.element} (${chart.usefulGod.chineseName})`);
  lines.push(`  Structure: ${chart.usefulGod.structureType}`);
  lines.push(`  Supporting: ${chart.usefulGod.supportingElements.join(', ')}`);
  lines.push(`  Avoid: ${chart.usefulGod.avoidElements.join(', ')}`);
  lines.push('');

  lines.push('TEN GODS:');
  lines.push(`  Dominant: ${chart.tenGods.dominant} (${chart.tenGods.dominantChinese})`);
  lines.push('');

  lines.push('SHEN SHA:');
  for (const sha of chart.shenSha) {
    lines.push(`  ${sha.chineseName} (${sha.name}) - ${sha.nature}`);
  }
  lines.push('');

  lines.push('LUCK PILLARS:');
  for (const lp of chart.luckPillars) {
    lines.push(`  ${lp.startAge}-${lp.endAge}: ${lp.stem}${lp.branch} (${lp.element}) - ${lp.favorability}`);
  }

  return lines.join('\n');
}

/**
 * Format for UI display (structured data)
 */
export function formatForUI(chart: CompositeChart): {
  pillars: Array<{ name: string; stem: string; branch: string; element: string; method: string }>;
  dayMaster: { name: string; element: string; polarity: string; strength: number; category: string };
  elements: Array<{ element: string; percent: number; isDominant: boolean; isWeakest: boolean }>;
  usefulGod: { element: string; chinese: string; advice: string };
  shenSha: Array<{ name: string; chinese: string; nature: string; meaning: string }>;
  luckPillars: Array<{ ages: string; pillar: string; element: string; favorability: string }>;
  strengths: string[];
  vulnerabilities: string[];
  karmicPurpose: string;
} {
  return {
    pillars: [
      { name: 'Year', stem: chart.yearPillar.stem, branch: chart.yearPillar.branch, element: chart.yearPillar.stemElement, method: chart.yearPillar.combinationMethod },
      { name: 'Month', stem: chart.monthPillar.stem, branch: chart.monthPillar.branch, element: chart.monthPillar.stemElement, method: chart.monthPillar.combinationMethod },
      { name: 'Day', stem: chart.dayPillar.stem, branch: chart.dayPillar.branch, element: chart.dayPillar.stemElement, method: chart.dayPillar.combinationMethod },
      { name: 'Hour', stem: chart.hourPillar.stem, branch: chart.hourPillar.branch, element: chart.hourPillar.stemElement, method: chart.hourPillar.combinationMethod }
    ],
    dayMaster: {
      name: chart.dayMaster.chineseName,
      element: chart.dayMaster.element,
      polarity: chart.dayMaster.polarity,
      strength: chart.dayMaster.strengthScore,
      category: chart.dayMaster.strengthCategory
    },
    elements: [
      { element: 'Wood', percent: chart.elementDistribution.Wood, isDominant: chart.elementDistribution.dominant === 'Wood', isWeakest: chart.elementDistribution.weakest === 'Wood' },
      { element: 'Fire', percent: chart.elementDistribution.Fire, isDominant: chart.elementDistribution.dominant === 'Fire', isWeakest: chart.elementDistribution.weakest === 'Fire' },
      { element: 'Earth', percent: chart.elementDistribution.Earth, isDominant: chart.elementDistribution.dominant === 'Earth', isWeakest: chart.elementDistribution.weakest === 'Earth' },
      { element: 'Metal', percent: chart.elementDistribution.Metal, isDominant: chart.elementDistribution.dominant === 'Metal', isWeakest: chart.elementDistribution.weakest === 'Metal' },
      { element: 'Water', percent: chart.elementDistribution.Water, isDominant: chart.elementDistribution.dominant === 'Water', isWeakest: chart.elementDistribution.weakest === 'Water' }
    ],
    usefulGod: {
      element: chart.usefulGod.element,
      chinese: chart.usefulGod.chineseName,
      advice: chart.usefulGod.stabilizingAdvice
    },
    shenSha: chart.shenSha.map(s => ({
      name: s.name,
      chinese: s.chineseName,
      nature: s.nature,
      meaning: s.relationshipMeaning
    })),
    luckPillars: chart.luckPillars.map(lp => ({
      ages: `${lp.startAge}-${lp.endAge}`,
      pillar: `${lp.stem}${lp.branch}`,
      element: lp.element,
      favorability: lp.favorability
    })),
    strengths: chart.coreStrengths,
    vulnerabilities: chart.coreVulnerabilities,
    karmicPurpose: chart.karmicPurpose
  };
}

// All functions are exported inline with 'export' keyword
