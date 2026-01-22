/**
 * ============================================================================
 * BAZI RELATIONSHIP TIMING ENGINE (合婚时机)
 * ============================================================================
 *
 * Temporal synastry engine showing when two people naturally harmonize,
 * when tension peaks, when attraction activates, and when karmic triggers fire.
 *
 * This engine computes relationship timing at four layers:
 * - 合婚流年 (Yearly) - Relationship climate for the year
 * - 合婚流月 (Monthly) - Relationship rhythm for each month
 * - 合婚流日 (Daily) - Micro-timing for dates, communication, decisions
 * - 合婚流时 (Hourly) - Ultra-fine timing for proposals, intimacy, resolution
 *
 * For each time unit, we analyze:
 * 1. Individual favorability (A and B)
 * 2. Synastry activation (Peach Blossom, Nobleman, element resonance)
 * 3. Conflict activation (Clash, Harm, Punishment, Destruction)
 * 4. Relationship Shen Sha (红鸾, 天喜, 桃花, 咸池)
 * 5. Relationship transformations (六合, 三合 across charts)
 * 6. Useful God alignment between partners
 *
 * Based on: Classical 合婚 (marriage matching) timing doctrine
 * Aligned with: Joey Yap methodology
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

export type TimingLayer = 'yearly' | 'monthly' | 'daily' | 'hourly';

/**
 * Stem polarity mapping
 */
export const STEM_POLARITY: Record<string, 'Yang' | 'Yin'> = {
  '甲': 'Yang', '乙': 'Yin',
  '丙': 'Yang', '丁': 'Yin',
  '戊': 'Yang', '己': 'Yin',
  '庚': 'Yang', '辛': 'Yin',
  '壬': 'Yang', '癸': 'Yin'
};

export type RelationshipTier = 'excellent' | 'good' | 'neutral' | 'challenging' | 'difficult';

/**
 * Pillar structure for timing analysis
 */
export interface TimingPillar {
  stem: StemName;
  branch: BranchName;
}

/**
 * Individual favorability context from timing engines
 */
export interface IndividualFavorability {
  score: number;
  tier: string;
  usefulActivated: ElementName[];
  annoyingActivated: ElementName[];
  shensha: Array<{ name: string; type: string }>;
  conflicts: Array<{ type: string; pillars: string[] }>;
  transformations: Array<{ type: string; result?: string }>;
}

/**
 * Synastry activation hit
 */
export interface SynastryHit {
  type: 'peach_blossom' | 'nobleman' | 'element_resonance' | 'polarity_complement' |
        'officer_wealth' | 'rootedness' | 'structure_support' | 'useful_god_share';
  description: string;
  personA: string;
  personB: string;
  weight: number;
}

/**
 * Relationship conflict hit
 */
export interface RelationshipConflictHit {
  type: 'clash' | 'harm' | 'punishment' | 'destruction' | 'break' | 'overwhelm';
  description: string;
  between: string;
  severity: number;
}

/**
 * Relationship Shen Sha hit
 */
export interface RelationshipShenshaHit {
  name: string;
  chineseName: string;
  activatedFor: 'A' | 'B' | 'both';
  nature: 'auspicious' | 'inauspicious' | 'neutral';
  description: string;
  weight: number;
}

/**
 * Relationship transformation hit
 */
export interface RelationshipTransformationHit {
  type: 'liuhe' | 'sanhe' | 'sanhui' | 'stem_combination';
  branches: string[];
  result?: ElementName;
  description: string;
  crossChart: boolean;
  weight: number;
}

/**
 * Useful God alignment analysis
 */
export interface UsefulGodAlignment {
  sharedUseful: ElementName[];
  conflictingUseful: boolean;  // A's useful is B's annoying
  mutualSupport: boolean;
  description: string;
  score: number;
}

/**
 * Complete relationship timing result
 */
export interface RelationshipTimingResult {
  // Time identification
  timeUnit: TimingLayer;
  date?: string;
  pillar: TimingPillar;
  pillarDisplay: string;

  // Scores
  score: number;
  tier: RelationshipTier;
  aScore: number;
  bScore: number;

  // Detailed hits
  synastryHits: SynastryHit[];
  conflictHits: RelationshipConflictHit[];
  shenshaHits: RelationshipShenshaHit[];
  transformationHits: RelationshipTransformationHit[];
  usefulGodAlignment: UsefulGodAlignment;

  // Narrative
  reasoning: string[];
  summary: string;
  advice: string;

  // Activity recommendations
  suitableActivities: string[];
  avoidActivities: string[];
}

/**
 * Yearly relationship timing
 */
export interface YearlyRelationshipTiming extends RelationshipTimingResult {
  year: number;
  seasonalInfluence: string;
}

/**
 * Monthly relationship timing
 */
export interface MonthlyRelationshipTiming extends RelationshipTimingResult {
  year: number;
  month: number;
  monthName: string;
}

/**
 * Daily relationship timing
 */
export interface DailyRelationshipTiming extends RelationshipTimingResult {
  year: number;
  month: number;
  day: number;
  dayOfWeek: string;
}

/**
 * Hourly relationship timing
 */
export interface HourlyRelationshipTiming extends RelationshipTimingResult {
  year: number;
  month: number;
  day: number;
  hour: number;
  chineseHour: string;
  westernTimeRange: string;
}

// ============================================================================
// RELATIONSHIP SHEN SHA (合婚神煞)
// ============================================================================

/**
 * 红鸾 (Red Matchmaker) - Primary marriage star
 * Calculated from year branch
 */
export const RED_MATCHMAKER_MAP: Record<string, string> = {
  '子': '卯', '丑': '寅', '寅': '丑', '卯': '子',
  '辰': '亥', '巳': '戌', '午': '酉', '未': '申',
  '申': '未', '酉': '午', '戌': '巳', '亥': '辰'
};

/**
 * 天喜 (Sky Happiness) - Secondary marriage star
 * Opposite to 红鸾
 */
export const SKY_HAPPINESS_MAP: Record<string, string> = {
  '子': '酉', '丑': '申', '寅': '未', '卯': '午',
  '辰': '巳', '巳': '辰', '午': '卯', '未': '寅',
  '申': '丑', '酉': '子', '戌': '亥', '亥': '戌'
};

/**
 * 桃花 (Peach Blossom) - Romance/attraction star
 * Based on year or day branch
 */
export const PEACH_BLOSSOM_MAP: Record<string, string> = {
  '子': '酉', '丑': '午', '寅': '卯', '卯': '子',
  '辰': '酉', '巳': '午', '午': '卯', '未': '子',
  '申': '酉', '酉': '午', '戌': '卯', '亥': '子'
};

/**
 * 咸池 (Salty Pool) - Intense attraction/passion star
 * Same calculation as Peach Blossom but interpreted differently
 */
export const SALTY_POOL_MAP = PEACH_BLOSSOM_MAP;

/**
 * 天乙贵人 (Heavenly Nobleman) - Noble helper star
 * Based on day stem
 */
export const NOBLEMAN_MAP: Record<string, string[]> = {
  '甲': ['丑', '未'], '乙': ['子', '申'], '丙': ['亥', '酉'],
  '丁': ['亥', '酉'], '戊': ['丑', '未'], '己': ['子', '申'],
  '庚': ['丑', '未'], '辛': ['寅', '午'], '壬': ['卯', '巳'],
  '癸': ['卯', '巳']
};

/**
 * 天德 (Heavenly Virtue) - Monthly virtue star
 * Maps month branch to the virtue-bearing stem
 */
export const HEAVENLY_VIRTUE_MAP: Record<string, string> = {
  '寅': '丁', '卯': '壬', '辰': '壬', '巳': '辛',
  '午': '甲', '未': '甲', '申': '癸', '酉': '壬',
  '戌': '丙', '亥': '乙', '子': '己', '丑': '庚'
};

/**
 * 月德 (Monthly Virtue) - Monthly virtue star
 * Maps month branch to the virtue-bearing stem
 */
export const MONTHLY_VIRTUE_MAP: Record<string, string> = {
  '寅': '丙', '卯': '甲', '辰': '壬', '巳': '庚',
  '午': '丙', '未': '甲', '申': '壬', '酉': '庚',
  '戌': '丙', '亥': '甲', '子': '壬', '丑': '庚'
};

/**
 * Relationship Shen Sha definitions
 */
export const RELATIONSHIP_SHENSHA_DEFINITIONS: Record<string, {
  chineseName: string;
  nature: 'auspicious' | 'inauspicious' | 'neutral';
  meaning: string;
  relationshipEffect: string;
  weight: number;
}> = {
  'Red Matchmaker': {
    chineseName: '红鸾',
    nature: 'auspicious',
    meaning: 'Primary marriage and romance star',
    relationshipEffect: 'Activates marriage potential, romantic encounters, commitment energy',
    weight: 12
  },
  'Sky Happiness': {
    chineseName: '天喜',
    nature: 'auspicious',
    meaning: 'Joy and celebration in relationships',
    relationshipEffect: 'Brings happy events, celebrations, joyful connection moments',
    weight: 10
  },
  'Peach Blossom': {
    chineseName: '桃花',
    nature: 'neutral',
    meaning: 'Romantic attraction and charm',
    relationshipEffect: 'Heightens attraction, social appeal, romantic opportunities',
    weight: 8
  },
  'Salty Pool': {
    chineseName: '咸池',
    nature: 'neutral',
    meaning: 'Intense passion and desire',
    relationshipEffect: 'Amplifies physical attraction, can indicate affairs if afflicted',
    weight: 6
  },
  'Nobleman': {
    chineseName: '天乙贵人',
    nature: 'auspicious',
    meaning: 'Noble helper and benefactor',
    relationshipEffect: 'Provides relationship support, helpful introductions, protection',
    weight: 10
  },
  'Heavenly Virtue': {
    chineseName: '天德',
    nature: 'auspicious',
    meaning: 'Heavenly blessing and protection',
    relationshipEffect: 'Brings divine protection to the relationship, smooths difficulties',
    weight: 8
  },
  'Monthly Virtue': {
    chineseName: '月德',
    nature: 'auspicious',
    meaning: 'Monthly blessing energy',
    relationshipEffect: 'Provides gentle support for relationship matters',
    weight: 6
  }
};

// ============================================================================
// BRANCH RELATIONSHIPS
// ============================================================================

/**
 * 六合 (Six Combinations) - Harmonious pairings
 */
export const LIUHE_PAIRS: Array<[BranchName, BranchName, ElementName]> = [
  ['子', '丑', 'Earth'],
  ['寅', '亥', 'Wood'],
  ['卯', '戌', 'Fire'],
  ['辰', '酉', 'Metal'],
  ['巳', '申', 'Water'],
  ['午', '未', 'Fire']
];

/**
 * 三合 (Three Harmonies) - Elemental frames
 */
export const SANHE_FRAMES: Array<{ branches: [BranchName, BranchName, BranchName]; element: ElementName }> = [
  { branches: ['申', '子', '辰'], element: 'Water' },
  { branches: ['亥', '卯', '未'], element: 'Wood' },
  { branches: ['寅', '午', '戌'], element: 'Fire' },
  { branches: ['巳', '酉', '丑'], element: 'Metal' }
];

/**
 * 三会 (Seasonal Gatherings)
 */
export const SANHUI_FRAMES: Array<{ branches: [BranchName, BranchName, BranchName]; element: ElementName; season: string }> = [
  { branches: ['亥', '子', '丑'], element: 'Water', season: 'Winter' },
  { branches: ['寅', '卯', '辰'], element: 'Wood', season: 'Spring' },
  { branches: ['巳', '午', '未'], element: 'Fire', season: 'Summer' },
  { branches: ['申', '酉', '戌'], element: 'Metal', season: 'Autumn' }
];

/**
 * 六冲 (Six Clashes) - Direct oppositions
 */
export const CLASH_PAIRS: Array<[BranchName, BranchName]> = [
  ['子', '午'], ['丑', '未'], ['寅', '申'],
  ['卯', '酉'], ['辰', '戌'], ['巳', '亥']
];

/**
 * 六害 (Six Harms) - Subtle friction
 */
export const HARM_PAIRS: Array<[BranchName, BranchName]> = [
  ['子', '未'], ['丑', '午'], ['寅', '巳'],
  ['卯', '辰'], ['申', '亥'], ['酉', '戌']
];

/**
 * 刑 (Punishments) - Internal tension
 */
export const PUNISHMENT_GROUPS = {
  mutual: [
    ['寅', '巳', '申'],  // Mutual punishment of power
    ['丑', '戌', '未']   // Mutual punishment of bullying
  ],
  self: ['辰', '午', '酉', '亥'],  // Self-punishment
  uncivilized: ['子', '卯']  // Uncivilized punishment
};

/**
 * 破 (Destruction) - Minor breaking
 */
export const DESTRUCTION_PAIRS: Array<[BranchName, BranchName]> = [
  ['子', '酉'], ['丑', '辰'], ['寅', '亥'],
  ['卯', '午'], ['巳', '申'], ['未', '戌']
];

// ============================================================================
// STEM COMBINATIONS
// ============================================================================

/**
 * 天干合 (Heavenly Stem Combinations)
 */
export const STEM_COMBINATIONS: Array<[StemName, StemName, ElementName]> = [
  ['甲', '己', 'Earth'],
  ['乙', '庚', 'Metal'],
  ['丙', '辛', 'Water'],
  ['丁', '壬', 'Wood'],
  ['戊', '癸', 'Fire']
];

// ============================================================================
// SCORING WEIGHTS
// ============================================================================

/**
 * Relationship timing scoring weights
 */
export const RELATIONSHIP_SCORING_WEIGHTS = {
  // Base weights for individual scores
  individualA: 0.35,
  individualB: 0.35,
  synastryBase: 0.30,

  // Synastry bonuses
  synastry: {
    peach_blossom: 10,
    nobleman: 8,
    element_resonance: 6,
    polarity_complement: 5,
    officer_wealth: 7,
    rootedness: 4,
    structure_support: 5,
    useful_god_share: 10
  },

  // Relationship Shen Sha bonuses
  shensha: {
    'Red Matchmaker': 12,
    'Sky Happiness': 10,
    'Peach Blossom': 8,
    'Salty Pool': 6,
    'Nobleman': 10,
    'Heavenly Virtue': 8,
    'Monthly Virtue': 6
  },

  // Transformation bonuses
  transformations: {
    liuhe: 8,
    sanhe: 10,
    sanhui: 8,
    stem_combination: 6
  },

  // Conflict penalties
  conflicts: {
    clash: -12,
    harm: -8,
    punishment: -10,
    destruction: -6,
    break: -8,
    overwhelm: -10
  },

  // Useful God alignment
  usefulGod: {
    shared: 12,
    conflicting: -15,
    neutral: 0
  }
};

// ============================================================================
// DETECTION FUNCTIONS
// ============================================================================

/**
 * Detect synastry activations between two charts for a given time pillar
 */
export function detectSynastryActivation(
  personA: NatalPillarsInput,
  personB: NatalPillarsInput,
  timePillar: TimingPillar,
  aUsefulGod?: ElementName,
  bUsefulGod?: ElementName
): SynastryHit[] {
  const hits: SynastryHit[] = [];
  const { stem: timeStem, branch: timeBranch } = timePillar;
  const timeElement = STEM_TO_ELEMENT[timeStem];
  const timeBranchElement = BRANCH_TO_ELEMENT[timeBranch];

  // Get natal branches for both
  const aBranches = [personA.yearBranch, personA.monthBranch, personA.dayBranch, personA.hourBranch];
  const bBranches = [personB.yearBranch, personB.monthBranch, personB.dayBranch, personB.hourBranch];
  const aStems = [personA.yearStem, personA.monthStem, personA.dayStem, personA.hourStem];
  const bStems = [personB.yearStem, personB.monthStem, personB.dayStem, personB.hourStem];

  // 1. Peach Blossom activation
  const aPeachBlossom = PEACH_BLOSSOM_MAP[personA.yearBranch];
  const bPeachBlossom = PEACH_BLOSSOM_MAP[personB.yearBranch];

  if (timeBranch === aPeachBlossom && bBranches.includes(aPeachBlossom)) {
    hits.push({
      type: 'peach_blossom',
      description: `Time pillar activates ${personA.yearBranch}'s Peach Blossom (${aPeachBlossom}) present in B's chart`,
      personA: 'Peach Blossom activated',
      personB: 'Has matching branch',
      weight: RELATIONSHIP_SCORING_WEIGHTS.synastry.peach_blossom
    });
  }

  if (timeBranch === bPeachBlossom && aBranches.includes(bPeachBlossom)) {
    hits.push({
      type: 'peach_blossom',
      description: `Time pillar activates ${personB.yearBranch}'s Peach Blossom (${bPeachBlossom}) present in A's chart`,
      personA: 'Has matching branch',
      personB: 'Peach Blossom activated',
      weight: RELATIONSHIP_SCORING_WEIGHTS.synastry.peach_blossom
    });
  }

  // 2. Nobleman activation
  const aNoblemanBranches = NOBLEMAN_MAP[personA.dayStem] || [];
  const bNoblemanBranches = NOBLEMAN_MAP[personB.dayStem] || [];

  if (aNoblemanBranches.includes(timeBranch) && bBranches.includes(timeBranch)) {
    hits.push({
      type: 'nobleman',
      description: `Time pillar activates A's Nobleman (${timeBranch}) present in B's chart`,
      personA: 'Nobleman activated',
      personB: 'Provides Nobleman energy',
      weight: RELATIONSHIP_SCORING_WEIGHTS.synastry.nobleman
    });
  }

  if (bNoblemanBranches.includes(timeBranch) && aBranches.includes(timeBranch)) {
    hits.push({
      type: 'nobleman',
      description: `Time pillar activates B's Nobleman (${timeBranch}) present in A's chart`,
      personA: 'Provides Nobleman energy',
      personB: 'Nobleman activated',
      weight: RELATIONSHIP_SCORING_WEIGHTS.synastry.nobleman
    });
  }

  // 3. Element resonance - time pillar element matches both charts
  const aHasElement = aStems.some(s => STEM_TO_ELEMENT[s] === timeElement) ||
                      aBranches.some(b => BRANCH_TO_ELEMENT[b] === timeElement);
  const bHasElement = bStems.some(s => STEM_TO_ELEMENT[s] === timeElement) ||
                      bBranches.some(b => BRANCH_TO_ELEMENT[b] === timeElement);

  if (aHasElement && bHasElement) {
    hits.push({
      type: 'element_resonance',
      description: `Time pillar's ${timeElement} element resonates with both charts`,
      personA: `Has ${timeElement}`,
      personB: `Has ${timeElement}`,
      weight: RELATIONSHIP_SCORING_WEIGHTS.synastry.element_resonance
    });
  }

  // 4. Polarity complement - Yin/Yang balance
  const timePolarity = STEM_POLARITY[timeStem];
  const aDMPolarity = STEM_POLARITY[personA.dayStem];
  const bDMPolarity = STEM_POLARITY[personB.dayStem];

  if (aDMPolarity !== bDMPolarity &&
      (timePolarity === aDMPolarity || timePolarity === bDMPolarity)) {
    hits.push({
      type: 'polarity_complement',
      description: `Time pillar supports the Yin-Yang balance between partners`,
      personA: `${aDMPolarity} DM`,
      personB: `${bDMPolarity} DM`,
      weight: RELATIONSHIP_SCORING_WEIGHTS.synastry.polarity_complement
    });
  }

  // 5. Useful God sharing
  if (aUsefulGod && bUsefulGod && aUsefulGod === bUsefulGod) {
    if (timeElement === aUsefulGod || timeBranchElement === aUsefulGod) {
      hits.push({
        type: 'useful_god_share',
        description: `Time pillar activates shared Useful God (${aUsefulGod})`,
        personA: `Useful God: ${aUsefulGod}`,
        personB: `Useful God: ${bUsefulGod}`,
        weight: RELATIONSHIP_SCORING_WEIGHTS.synastry.useful_god_share
      });
    }
  }

  return hits;
}

/**
 * Detect relationship conflicts triggered by time pillar
 */
export function detectRelationshipConflicts(
  personA: NatalPillarsInput,
  personB: NatalPillarsInput,
  timePillar: TimingPillar
): RelationshipConflictHit[] {
  const hits: RelationshipConflictHit[] = [];
  const { branch: timeBranch } = timePillar;

  // Get natal branches for both
  const aBranches = [
    { name: 'A-Year', branch: personA.yearBranch },
    { name: 'A-Month', branch: personA.monthBranch },
    { name: 'A-Day', branch: personA.dayBranch },
    { name: 'A-Hour', branch: personA.hourBranch }
  ];
  const bBranches = [
    { name: 'B-Year', branch: personB.yearBranch },
    { name: 'B-Month', branch: personB.monthBranch },
    { name: 'B-Day', branch: personB.dayBranch },
    { name: 'B-Hour', branch: personB.hourBranch }
  ];

  // Check each conflict type

  // 1. Clashes - time pillar clashes with A, and A clashes with B
  for (const [b1, b2] of CLASH_PAIRS) {
    // Time clashes with A's branch
    for (const aB of aBranches) {
      if ((timeBranch === b1 && aB.branch === b2) || (timeBranch === b2 && aB.branch === b1)) {
        // Now check if this same branch pattern appears in B
        for (const bB of bBranches) {
          if (aB.branch === b1 && bB.branch === b2 || aB.branch === b2 && bB.branch === b1) {
            hits.push({
              type: 'clash',
              description: `Time pillar (${timeBranch}) triggers ${aB.branch}-${bB.branch} clash between partners`,
              between: `${aB.name} ↔ ${bB.name}`,
              severity: Math.abs(RELATIONSHIP_SCORING_WEIGHTS.conflicts.clash)
            });
          }
        }
      }
    }

    // Time clashes with B's branch
    for (const bB of bBranches) {
      if ((timeBranch === b1 && bB.branch === b2) || (timeBranch === b2 && bB.branch === b1)) {
        for (const aB of aBranches) {
          if (bB.branch === b1 && aB.branch === b2 || bB.branch === b2 && aB.branch === b1) {
            // Already captured above, skip duplicates
          }
        }
      }
    }
  }

  // 2. Harms
  for (const [b1, b2] of HARM_PAIRS) {
    for (const aB of aBranches) {
      for (const bB of bBranches) {
        if ((aB.branch === b1 && bB.branch === b2) || (aB.branch === b2 && bB.branch === b1)) {
          // Check if time pillar activates this harm
          if (timeBranch === b1 || timeBranch === b2) {
            hits.push({
              type: 'harm',
              description: `Time pillar (${timeBranch}) activates ${aB.branch}-${bB.branch} harm between partners`,
              between: `${aB.name} ↔ ${bB.name}`,
              severity: Math.abs(RELATIONSHIP_SCORING_WEIGHTS.conflicts.harm)
            });
          }
        }
      }
    }
  }

  // 3. Punishments
  for (const group of PUNISHMENT_GROUPS.mutual) {
    const allBranches = [...aBranches.map(b => b.branch), ...bBranches.map(b => b.branch), timeBranch];
    const matchCount = group.filter(b => allBranches.includes(b as BranchName)).length;
    if (matchCount >= 2 && group.includes(timeBranch as string)) {
      hits.push({
        type: 'punishment',
        description: `Time pillar (${timeBranch}) activates mutual punishment pattern (${group.join('-')})`,
        between: 'Cross-chart punishment',
        severity: Math.abs(RELATIONSHIP_SCORING_WEIGHTS.conflicts.punishment)
      });
    }
  }

  // 4. Destructions
  for (const [b1, b2] of DESTRUCTION_PAIRS) {
    for (const aB of aBranches) {
      for (const bB of bBranches) {
        if ((aB.branch === b1 && bB.branch === b2) || (aB.branch === b2 && bB.branch === b1)) {
          if (timeBranch === b1 || timeBranch === b2) {
            hits.push({
              type: 'destruction',
              description: `Time pillar (${timeBranch}) activates ${aB.branch}-${bB.branch} destruction`,
              between: `${aB.name} ↔ ${bB.name}`,
              severity: Math.abs(RELATIONSHIP_SCORING_WEIGHTS.conflicts.destruction)
            });
          }
        }
      }
    }
  }

  // Remove duplicate hits
  const uniqueHits: RelationshipConflictHit[] = [];
  const seen = new Set<string>();
  for (const hit of hits) {
    const key = `${hit.type}-${hit.between}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueHits.push(hit);
    }
  }

  return uniqueHits;
}

/**
 * Detect relationship Shen Sha activated by time pillar
 */
export function detectRelationshipShensha(
  personA: NatalPillarsInput,
  personB: NatalPillarsInput,
  timePillar: TimingPillar,
  monthBranch?: BranchName
): RelationshipShenshaHit[] {
  const hits: RelationshipShenshaHit[] = [];
  const { stem: timeStem, branch: timeBranch } = timePillar;

  // 1. Red Matchmaker (红鸾)
  const aRedMatchmaker = RED_MATCHMAKER_MAP[personA.yearBranch];
  const bRedMatchmaker = RED_MATCHMAKER_MAP[personB.yearBranch];

  if (timeBranch === aRedMatchmaker) {
    hits.push({
      name: 'Red Matchmaker',
      chineseName: '红鸾',
      activatedFor: 'A',
      nature: 'auspicious',
      description: `Time pillar activates A's Red Matchmaker (${aRedMatchmaker})`,
      weight: RELATIONSHIP_SHENSHA_DEFINITIONS['Red Matchmaker'].weight
    });
  }
  if (timeBranch === bRedMatchmaker) {
    hits.push({
      name: 'Red Matchmaker',
      chineseName: '红鸾',
      activatedFor: 'B',
      nature: 'auspicious',
      description: `Time pillar activates B's Red Matchmaker (${bRedMatchmaker})`,
      weight: RELATIONSHIP_SHENSHA_DEFINITIONS['Red Matchmaker'].weight
    });
  }

  // 2. Sky Happiness (天喜)
  const aSkyHappiness = SKY_HAPPINESS_MAP[personA.yearBranch];
  const bSkyHappiness = SKY_HAPPINESS_MAP[personB.yearBranch];

  if (timeBranch === aSkyHappiness) {
    hits.push({
      name: 'Sky Happiness',
      chineseName: '天喜',
      activatedFor: 'A',
      nature: 'auspicious',
      description: `Time pillar activates A's Sky Happiness (${aSkyHappiness})`,
      weight: RELATIONSHIP_SHENSHA_DEFINITIONS['Sky Happiness'].weight
    });
  }
  if (timeBranch === bSkyHappiness) {
    hits.push({
      name: 'Sky Happiness',
      chineseName: '天喜',
      activatedFor: 'B',
      nature: 'auspicious',
      description: `Time pillar activates B's Sky Happiness (${bSkyHappiness})`,
      weight: RELATIONSHIP_SHENSHA_DEFINITIONS['Sky Happiness'].weight
    });
  }

  // 3. Peach Blossom (桃花)
  const aPeachBlossom = PEACH_BLOSSOM_MAP[personA.yearBranch];
  const bPeachBlossom = PEACH_BLOSSOM_MAP[personB.yearBranch];

  if (timeBranch === aPeachBlossom) {
    hits.push({
      name: 'Peach Blossom',
      chineseName: '桃花',
      activatedFor: 'A',
      nature: 'neutral',
      description: `Time pillar activates A's Peach Blossom (${aPeachBlossom})`,
      weight: RELATIONSHIP_SHENSHA_DEFINITIONS['Peach Blossom'].weight
    });
  }
  if (timeBranch === bPeachBlossom) {
    hits.push({
      name: 'Peach Blossom',
      chineseName: '桃花',
      activatedFor: 'B',
      nature: 'neutral',
      description: `Time pillar activates B's Peach Blossom (${bPeachBlossom})`,
      weight: RELATIONSHIP_SHENSHA_DEFINITIONS['Peach Blossom'].weight
    });
  }

  // 4. Nobleman (天乙贵人)
  const aNoblemanBranches = NOBLEMAN_MAP[personA.dayStem] || [];
  const bNoblemanBranches = NOBLEMAN_MAP[personB.dayStem] || [];

  if (aNoblemanBranches.includes(timeBranch)) {
    hits.push({
      name: 'Nobleman',
      chineseName: '天乙贵人',
      activatedFor: 'A',
      nature: 'auspicious',
      description: `Time pillar activates A's Nobleman (${timeBranch})`,
      weight: RELATIONSHIP_SHENSHA_DEFINITIONS['Nobleman'].weight
    });
  }
  if (bNoblemanBranches.includes(timeBranch)) {
    hits.push({
      name: 'Nobleman',
      chineseName: '天乙贵人',
      activatedFor: 'B',
      nature: 'auspicious',
      description: `Time pillar activates B's Nobleman (${timeBranch})`,
      weight: RELATIONSHIP_SHENSHA_DEFINITIONS['Nobleman'].weight
    });
  }

  // 5. Heavenly Virtue (天德) - only if month branch provided
  if (monthBranch) {
    const heavenlyVirtue = HEAVENLY_VIRTUE_MAP[monthBranch];
    if (timeStem === heavenlyVirtue) {
      hits.push({
        name: 'Heavenly Virtue',
        chineseName: '天德',
        activatedFor: 'both',
        nature: 'auspicious',
        description: `Time pillar carries Heavenly Virtue (${heavenlyVirtue}) for ${monthBranch} month`,
        weight: RELATIONSHIP_SHENSHA_DEFINITIONS['Heavenly Virtue'].weight
      });
    }

    // 6. Monthly Virtue (月德)
    const monthlyVirtue = MONTHLY_VIRTUE_MAP[monthBranch];
    if (timeStem === monthlyVirtue) {
      hits.push({
        name: 'Monthly Virtue',
        chineseName: '月德',
        activatedFor: 'both',
        nature: 'auspicious',
        description: `Time pillar carries Monthly Virtue (${monthlyVirtue}) for ${monthBranch} month`,
        weight: RELATIONSHIP_SHENSHA_DEFINITIONS['Monthly Virtue'].weight
      });
    }
  }

  return hits;
}

/**
 * Detect relationship transformations activated by time pillar
 */
export function detectRelationshipTransformations(
  personA: NatalPillarsInput,
  personB: NatalPillarsInput,
  timePillar: TimingPillar
): RelationshipTransformationHit[] {
  const hits: RelationshipTransformationHit[] = [];
  const { stem: timeStem, branch: timeBranch } = timePillar;

  // Get all branches
  const aBranches = [personA.yearBranch, personA.monthBranch, personA.dayBranch, personA.hourBranch];
  const bBranches = [personB.yearBranch, personB.monthBranch, personB.dayBranch, personB.hourBranch];
  const allBranches = [...aBranches, ...bBranches, timeBranch];

  // Get all stems
  const aStems = [personA.yearStem, personA.monthStem, personA.dayStem, personA.hourStem];
  const bStems = [personB.yearStem, personB.monthStem, personB.dayStem, personB.hourStem];

  // 1. 六合 (Six Combinations)
  for (const [b1, b2, result] of LIUHE_PAIRS) {
    if (timeBranch === b1) {
      // Check if b2 is in either chart
      const inA = aBranches.includes(b2);
      const inB = bBranches.includes(b2);
      if (inA || inB) {
        hits.push({
          type: 'liuhe',
          branches: [b1, b2],
          result,
          description: `Time ${b1} combines with ${b2} (→ ${result})`,
          crossChart: inA && inB,
          weight: RELATIONSHIP_SCORING_WEIGHTS.transformations.liuhe
        });
      }
    }
    if (timeBranch === b2) {
      const inA = aBranches.includes(b1);
      const inB = bBranches.includes(b1);
      if (inA || inB) {
        hits.push({
          type: 'liuhe',
          branches: [b1, b2],
          result,
          description: `Time ${b2} combines with ${b1} (→ ${result})`,
          crossChart: inA && inB,
          weight: RELATIONSHIP_SCORING_WEIGHTS.transformations.liuhe
        });
      }
    }
  }

  // 2. 三合 (Three Harmonies) - Cross-chart frames
  for (const { branches, element } of SANHE_FRAMES) {
    // Count how many are in A, B, and time
    const inA = branches.filter(b => aBranches.includes(b)).length;
    const inB = branches.filter(b => bBranches.includes(b)).length;
    const isTime = branches.includes(timeBranch);

    // Cross-chart frame: at least 1 from A, 1 from B, time pillar completes
    if (inA >= 1 && inB >= 1 && isTime) {
      const presentBranches = branches.filter(b => allBranches.includes(b));
      if (presentBranches.length >= 3) {
        hits.push({
          type: 'sanhe',
          branches: [...presentBranches],
          result: element,
          description: `Cross-chart ${element} frame (${branches.join('-')}) activated by time pillar`,
          crossChart: true,
          weight: RELATIONSHIP_SCORING_WEIGHTS.transformations.sanhe
        });
      }
    }
  }

  // 3. 三会 (Seasonal Gatherings)
  for (const { branches, element, season } of SANHUI_FRAMES) {
    const inA = branches.filter(b => aBranches.includes(b)).length;
    const inB = branches.filter(b => bBranches.includes(b)).length;
    const isTime = branches.includes(timeBranch);

    if (inA >= 1 && inB >= 1 && isTime) {
      const presentBranches = branches.filter(b => allBranches.includes(b));
      if (presentBranches.length >= 3) {
        hits.push({
          type: 'sanhui',
          branches: [...presentBranches],
          result: element,
          description: `${season} gathering (${branches.join('-')}) activated across charts`,
          crossChart: true,
          weight: RELATIONSHIP_SCORING_WEIGHTS.transformations.sanhui
        });
      }
    }
  }

  // 4. 天干合 (Stem Combinations)
  for (const [s1, s2, result] of STEM_COMBINATIONS) {
    if (timeStem === s1) {
      const inA = aStems.includes(s2);
      const inB = bStems.includes(s2);
      if (inA || inB) {
        hits.push({
          type: 'stem_combination',
          branches: [],
          result,
          description: `Time stem ${s1} combines with ${s2} (→ ${result})`,
          crossChart: inA && inB,
          weight: RELATIONSHIP_SCORING_WEIGHTS.transformations.stem_combination
        });
      }
    }
    if (timeStem === s2) {
      const inA = aStems.includes(s1);
      const inB = bStems.includes(s1);
      if (inA || inB) {
        hits.push({
          type: 'stem_combination',
          branches: [],
          result,
          description: `Time stem ${s2} combines with ${s1} (→ ${result})`,
          crossChart: inA && inB,
          weight: RELATIONSHIP_SCORING_WEIGHTS.transformations.stem_combination
        });
      }
    }
  }

  // Remove duplicates
  const uniqueHits: RelationshipTransformationHit[] = [];
  const seen = new Set<string>();
  for (const hit of hits) {
    const key = `${hit.type}-${hit.branches.sort().join('')}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueHits.push(hit);
    }
  }

  return uniqueHits;
}

/**
 * Analyze Useful God alignment between partners
 */
export function analyzeUsefulGodAlignment(
  aUsefulGod: ElementName | undefined,
  aAnnoyingGod: ElementName | undefined,
  bUsefulGod: ElementName | undefined,
  bAnnoyingGod: ElementName | undefined,
  timePillar: TimingPillar
): UsefulGodAlignment {
  const timeElement = STEM_TO_ELEMENT[timePillar.stem];
  const timeBranchElement = BRANCH_TO_ELEMENT[timePillar.branch];

  let score = 0;
  const descriptions: string[] = [];
  let sharedUseful: ElementName[] = [];
  let conflictingUseful = false;
  let mutualSupport = false;

  // Check for shared Useful God
  if (aUsefulGod && bUsefulGod && aUsefulGod === bUsefulGod) {
    sharedUseful = [aUsefulGod];
    mutualSupport = true;

    // Bonus if time pillar activates shared Useful God
    if (timeElement === aUsefulGod || timeBranchElement === aUsefulGod) {
      score += RELATIONSHIP_SCORING_WEIGHTS.usefulGod.shared;
      descriptions.push(`Time pillar activates shared Useful God (${aUsefulGod}) - peak harmony!`);
    } else {
      score += RELATIONSHIP_SCORING_WEIGHTS.usefulGod.shared / 2;
      descriptions.push(`Partners share Useful God (${aUsefulGod}) - natural alignment`);
    }
  }

  // Check for conflicting Useful God (A's useful = B's annoying, or vice versa)
  if (aUsefulGod && bAnnoyingGod && aUsefulGod === bAnnoyingGod) {
    conflictingUseful = true;
    // Extra penalty if time activates A's useful (which is B's annoying)
    if (timeElement === aUsefulGod || timeBranchElement === aUsefulGod) {
      score += RELATIONSHIP_SCORING_WEIGHTS.usefulGod.conflicting;
      descriptions.push(`Time pillar activates A's Useful God (${aUsefulGod}), which is B's Annoying God - tension point`);
    }
  }

  if (bUsefulGod && aAnnoyingGod && bUsefulGod === aAnnoyingGod) {
    conflictingUseful = true;
    if (timeElement === bUsefulGod || timeBranchElement === bUsefulGod) {
      score += RELATIONSHIP_SCORING_WEIGHTS.usefulGod.conflicting;
      descriptions.push(`Time pillar activates B's Useful God (${bUsefulGod}), which is A's Annoying God - tension point`);
    }
  }

  if (descriptions.length === 0) {
    descriptions.push('Useful God patterns are neutral between partners');
  }

  return {
    sharedUseful,
    conflictingUseful,
    mutualSupport,
    description: descriptions.join(' '),
    score
  };
}

// ============================================================================
// MAIN COMPUTATION FUNCTION
// ============================================================================

/**
 * Compute relationship timing for a given time unit
 */
export function computeRelationshipTiming(opts: {
  timeUnit: TimingLayer;
  date?: string;
  timePillar: TimingPillar;
  personA: NatalPillarsInput;
  personB: NatalPillarsInput;
  aFavorability: IndividualFavorability;
  bFavorability: IndividualFavorability;
  aUsefulGod?: ElementName;
  aAnnoyingGod?: ElementName;
  bUsefulGod?: ElementName;
  bAnnoyingGod?: ElementName;
  monthBranch?: BranchName;
}): RelationshipTimingResult {
  const {
    timeUnit,
    date,
    timePillar,
    personA,
    personB,
    aFavorability,
    bFavorability,
    aUsefulGod,
    aAnnoyingGod,
    bUsefulGod,
    bAnnoyingGod,
    monthBranch
  } = opts;

  const reasoning: string[] = [];

  // ========================================
  // STEP 1: Detect all relationship factors
  // ========================================

  const synastryHits = detectSynastryActivation(personA, personB, timePillar, aUsefulGod, bUsefulGod);
  const conflictHits = detectRelationshipConflicts(personA, personB, timePillar);
  const shenshaHits = detectRelationshipShensha(personA, personB, timePillar, monthBranch);
  const transformationHits = detectRelationshipTransformations(personA, personB, timePillar);
  const usefulGodAlignment = analyzeUsefulGodAlignment(
    aUsefulGod, aAnnoyingGod, bUsefulGod, bAnnoyingGod, timePillar
  );

  reasoning.push(`Detected ${synastryHits.length} synastry activation(s)`);
  reasoning.push(`Detected ${conflictHits.length} conflict trigger(s)`);
  reasoning.push(`Detected ${shenshaHits.length} relationship Shen Sha`);
  reasoning.push(`Detected ${transformationHits.length} transformation(s)`);

  // ========================================
  // STEP 2: Calculate base score
  // ========================================

  let score =
    RELATIONSHIP_SCORING_WEIGHTS.individualA * aFavorability.score +
    RELATIONSHIP_SCORING_WEIGHTS.individualB * bFavorability.score;

  reasoning.push(`Base score: ${score.toFixed(1)} (A: ${aFavorability.score}, B: ${bFavorability.score})`);

  // ========================================
  // STEP 3: Apply synastry bonuses
  // ========================================

  let synastryBonus = 0;
  for (const hit of synastryHits) {
    synastryBonus += hit.weight;
  }
  score += synastryBonus;
  if (synastryBonus > 0) {
    reasoning.push(`Synastry bonus: +${synastryBonus}`);
  }

  // ========================================
  // STEP 4: Apply Shen Sha bonuses
  // ========================================

  let shenshaBonus = 0;
  for (const hit of shenshaHits) {
    if (hit.nature === 'auspicious') {
      shenshaBonus += hit.weight;
    } else if (hit.nature === 'inauspicious') {
      shenshaBonus -= hit.weight;
    }
  }
  score += shenshaBonus;
  if (shenshaBonus !== 0) {
    reasoning.push(`Shen Sha adjustment: ${shenshaBonus > 0 ? '+' : ''}${shenshaBonus}`);
  }

  // ========================================
  // STEP 5: Apply transformation bonuses
  // ========================================

  let transformationBonus = 0;
  for (const hit of transformationHits) {
    // Extra weight for cross-chart transformations
    const weight = hit.crossChart ? hit.weight * 1.5 : hit.weight;
    transformationBonus += weight;
  }
  score += transformationBonus;
  if (transformationBonus > 0) {
    reasoning.push(`Transformation bonus: +${transformationBonus.toFixed(1)}`);
  }

  // ========================================
  // STEP 6: Apply conflict penalties
  // ========================================

  let conflictPenalty = 0;
  for (const hit of conflictHits) {
    conflictPenalty -= hit.severity;
  }
  score += conflictPenalty;
  if (conflictPenalty < 0) {
    reasoning.push(`Conflict penalty: ${conflictPenalty}`);
  }

  // ========================================
  // STEP 7: Apply Useful God alignment
  // ========================================

  score += usefulGodAlignment.score;
  if (usefulGodAlignment.score !== 0) {
    reasoning.push(`Useful God alignment: ${usefulGodAlignment.score > 0 ? '+' : ''}${usefulGodAlignment.score}`);
  }

  // ========================================
  // STEP 8: Clamp score and determine tier
  // ========================================

  score = Math.max(0, Math.min(100, score));

  const tier: RelationshipTier =
    score >= 80 ? 'excellent' :
    score >= 65 ? 'good' :
    score >= 45 ? 'neutral' :
    score >= 30 ? 'challenging' : 'difficult';

  reasoning.push(`Final score: ${score.toFixed(1)} (${tier})`);

  // ========================================
  // STEP 9: Generate summary and advice
  // ========================================

  const summary = generateRelationshipSummary(
    timeUnit, tier, synastryHits, conflictHits, shenshaHits, transformationHits
  );

  const advice = generateRelationshipAdvice(
    tier, synastryHits, conflictHits, shenshaHits, usefulGodAlignment
  );

  // ========================================
  // STEP 10: Activity recommendations
  // ========================================

  const { suitableActivities, avoidActivities } = generateActivityRecommendations(
    tier, synastryHits, conflictHits, shenshaHits, transformationHits
  );

  return {
    timeUnit,
    date,
    pillar: timePillar,
    pillarDisplay: `${timePillar.stem}${timePillar.branch}`,
    score: Math.round(score),
    tier,
    aScore: aFavorability.score,
    bScore: bFavorability.score,
    synastryHits,
    conflictHits,
    shenshaHits,
    transformationHits,
    usefulGodAlignment,
    reasoning,
    summary,
    advice,
    suitableActivities,
    avoidActivities
  };
}

// ============================================================================
// YEARLY RELATIONSHIP TIMING
// ============================================================================

/**
 * Compute yearly relationship timing (合婚流年)
 */
export function computeYearlyRelationshipTiming(opts: {
  year: number;
  annualPillar: TimingPillar;
  personA: NatalPillarsInput;
  personB: NatalPillarsInput;
  aAnnualFavorability: IndividualFavorability;
  bAnnualFavorability: IndividualFavorability;
  aUsefulGod?: ElementName;
  aAnnoyingGod?: ElementName;
  bUsefulGod?: ElementName;
  bAnnoyingGod?: ElementName;
}): YearlyRelationshipTiming {
  const baseResult = computeRelationshipTiming({
    timeUnit: 'yearly',
    date: `${opts.year}`,
    timePillar: opts.annualPillar,
    personA: opts.personA,
    personB: opts.personB,
    aFavorability: opts.aAnnualFavorability,
    bFavorability: opts.bAnnualFavorability,
    aUsefulGod: opts.aUsefulGod,
    aAnnoyingGod: opts.aAnnoyingGod,
    bUsefulGod: opts.bUsefulGod,
    bAnnoyingGod: opts.bAnnoyingGod
  });

  // Determine seasonal influence based on annual branch
  const branchElement = BRANCH_TO_ELEMENT[opts.annualPillar.branch];
  const seasonalInfluence = getSeasonalInfluence(branchElement);

  return {
    ...baseResult,
    year: opts.year,
    seasonalInfluence
  };
}

// ============================================================================
// MONTHLY RELATIONSHIP TIMING
// ============================================================================

/**
 * Compute monthly relationship timing (合婚流月)
 */
export function computeMonthlyRelationshipTiming(opts: {
  year: number;
  month: number;
  monthPillar: TimingPillar;
  personA: NatalPillarsInput;
  personB: NatalPillarsInput;
  aMonthlyFavorability: IndividualFavorability;
  bMonthlyFavorability: IndividualFavorability;
  aUsefulGod?: ElementName;
  aAnnoyingGod?: ElementName;
  bUsefulGod?: ElementName;
  bAnnoyingGod?: ElementName;
}): MonthlyRelationshipTiming {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const baseResult = computeRelationshipTiming({
    timeUnit: 'monthly',
    date: `${opts.year}-${String(opts.month).padStart(2, '0')}`,
    timePillar: opts.monthPillar,
    personA: opts.personA,
    personB: opts.personB,
    aFavorability: opts.aMonthlyFavorability,
    bFavorability: opts.bMonthlyFavorability,
    aUsefulGod: opts.aUsefulGod,
    aAnnoyingGod: opts.aAnnoyingGod,
    bUsefulGod: opts.bUsefulGod,
    bAnnoyingGod: opts.bAnnoyingGod,
    monthBranch: opts.monthPillar.branch
  });

  return {
    ...baseResult,
    year: opts.year,
    month: opts.month,
    monthName: monthNames[opts.month - 1]
  };
}

// ============================================================================
// DAILY RELATIONSHIP TIMING
// ============================================================================

/**
 * Compute daily relationship timing (合婚流日)
 */
export function computeDailyRelationshipTiming(opts: {
  year: number;
  month: number;
  day: number;
  dayPillar: TimingPillar;
  personA: NatalPillarsInput;
  personB: NatalPillarsInput;
  aDailyFavorability: IndividualFavorability;
  bDailyFavorability: IndividualFavorability;
  aUsefulGod?: ElementName;
  aAnnoyingGod?: ElementName;
  bUsefulGod?: ElementName;
  bAnnoyingGod?: ElementName;
  monthBranch?: BranchName;
}): DailyRelationshipTiming {
  const dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(opts.year, opts.month - 1, opts.day);

  const baseResult = computeRelationshipTiming({
    timeUnit: 'daily',
    date: `${opts.year}-${String(opts.month).padStart(2, '0')}-${String(opts.day).padStart(2, '0')}`,
    timePillar: opts.dayPillar,
    personA: opts.personA,
    personB: opts.personB,
    aFavorability: opts.aDailyFavorability,
    bFavorability: opts.bDailyFavorability,
    aUsefulGod: opts.aUsefulGod,
    aAnnoyingGod: opts.aAnnoyingGod,
    bUsefulGod: opts.bUsefulGod,
    bAnnoyingGod: opts.bAnnoyingGod,
    monthBranch: opts.monthBranch
  });

  return {
    ...baseResult,
    year: opts.year,
    month: opts.month,
    day: opts.day,
    dayOfWeek: dayOfWeekNames[date.getDay()]
  };
}

// ============================================================================
// HOURLY RELATIONSHIP TIMING
// ============================================================================

/**
 * Chinese hour mapping
 */
const CHINESE_HOURS: Array<{
  branch: BranchName;
  name: string;
  westernRange: string;
  startHour: number;
}> = [
  { branch: '子', name: '子时', westernRange: '23:00-01:00', startHour: 23 },
  { branch: '丑', name: '丑时', westernRange: '01:00-03:00', startHour: 1 },
  { branch: '寅', name: '寅时', westernRange: '03:00-05:00', startHour: 3 },
  { branch: '卯', name: '卯时', westernRange: '05:00-07:00', startHour: 5 },
  { branch: '辰', name: '辰时', westernRange: '07:00-09:00', startHour: 7 },
  { branch: '巳', name: '巳时', westernRange: '09:00-11:00', startHour: 9 },
  { branch: '午', name: '午时', westernRange: '11:00-13:00', startHour: 11 },
  { branch: '未', name: '未时', westernRange: '13:00-15:00', startHour: 13 },
  { branch: '申', name: '申时', westernRange: '15:00-17:00', startHour: 15 },
  { branch: '酉', name: '酉时', westernRange: '17:00-19:00', startHour: 17 },
  { branch: '戌', name: '戌时', westernRange: '19:00-21:00', startHour: 19 },
  { branch: '亥', name: '亥时', westernRange: '21:00-23:00', startHour: 21 }
];

/**
 * Compute hourly relationship timing (合婚流时)
 */
export function computeHourlyRelationshipTiming(opts: {
  year: number;
  month: number;
  day: number;
  hour: number;
  hourPillar: TimingPillar;
  personA: NatalPillarsInput;
  personB: NatalPillarsInput;
  aHourlyFavorability: IndividualFavorability;
  bHourlyFavorability: IndividualFavorability;
  aUsefulGod?: ElementName;
  aAnnoyingGod?: ElementName;
  bUsefulGod?: ElementName;
  bAnnoyingGod?: ElementName;
  monthBranch?: BranchName;
}): HourlyRelationshipTiming {
  // Find Chinese hour info
  const chineseHourInfo = CHINESE_HOURS.find(h => {
    if (h.startHour === 23) {
      return opts.hour >= 23 || opts.hour < 1;
    }
    return opts.hour >= h.startHour && opts.hour < h.startHour + 2;
  }) || CHINESE_HOURS[0];

  const baseResult = computeRelationshipTiming({
    timeUnit: 'hourly',
    date: `${opts.year}-${String(opts.month).padStart(2, '0')}-${String(opts.day).padStart(2, '0')} ${String(opts.hour).padStart(2, '0')}:00`,
    timePillar: opts.hourPillar,
    personA: opts.personA,
    personB: opts.personB,
    aFavorability: opts.aHourlyFavorability,
    bFavorability: opts.bHourlyFavorability,
    aUsefulGod: opts.aUsefulGod,
    aAnnoyingGod: opts.aAnnoyingGod,
    bUsefulGod: opts.bUsefulGod,
    bAnnoyingGod: opts.bAnnoyingGod,
    monthBranch: opts.monthBranch
  });

  return {
    ...baseResult,
    year: opts.year,
    month: opts.month,
    day: opts.day,
    hour: opts.hour,
    chineseHour: chineseHourInfo.name,
    westernTimeRange: chineseHourInfo.westernRange
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getSeasonalInfluence(element: ElementName): string {
  switch (element) {
    case 'Wood': return 'Spring energy - growth, new beginnings, expansion';
    case 'Fire': return 'Summer energy - passion, expression, visibility';
    case 'Earth': return 'Transitional energy - stability, grounding, nurturing';
    case 'Metal': return 'Autumn energy - refinement, clarity, letting go';
    case 'Water': return 'Winter energy - introspection, depth, wisdom';
    default: return 'Mixed seasonal energy';
  }
}

function generateRelationshipSummary(
  timeUnit: TimingLayer,
  tier: RelationshipTier,
  synastryHits: SynastryHit[],
  conflictHits: RelationshipConflictHit[],
  shenshaHits: RelationshipShenshaHit[],
  transformationHits: RelationshipTransformationHit[]
): string {
  const parts: string[] = [];

  // Tier description
  const tierDescriptions: Record<RelationshipTier, string> = {
    excellent: 'exceptional harmony and connection',
    good: 'favorable energy for the relationship',
    neutral: 'balanced energy requiring conscious effort',
    challenging: 'tension that demands patience',
    difficult: 'significant obstacles to navigate'
  };

  const timeLabels: Record<TimingLayer, string> = {
    yearly: 'This year brings',
    monthly: 'This month brings',
    daily: 'This day brings',
    hourly: 'This hour brings'
  };

  parts.push(`${timeLabels[timeUnit]} ${tierDescriptions[tier]}.`);

  // Highlight key synastry
  if (synastryHits.length > 0) {
    const synastryTypes = synastryHits.map(h => h.type.replace(/_/g, ' ')).slice(0, 2);
    parts.push(`Active synastry: ${synastryTypes.join(', ')}.`);
  }

  // Highlight relationship Shen Sha
  const auspiciousShensha = shenshaHits.filter(h => h.nature === 'auspicious');
  if (auspiciousShensha.length > 0) {
    parts.push(`${auspiciousShensha[0].chineseName} (${auspiciousShensha[0].name}) is active.`);
  }

  // Mention conflicts
  if (conflictHits.length > 0) {
    parts.push(`Watch for ${conflictHits[0].type} energy between charts.`);
  }

  // Mention transformations
  const crossChartTransforms = transformationHits.filter(t => t.crossChart);
  if (crossChartTransforms.length > 0) {
    parts.push(`Cross-chart ${crossChartTransforms[0].type} activation strengthens the bond.`);
  }

  return parts.join(' ');
}

function generateRelationshipAdvice(
  tier: RelationshipTier,
  synastryHits: SynastryHit[],
  conflictHits: RelationshipConflictHit[],
  shenshaHits: RelationshipShenshaHit[],
  usefulGodAlignment: UsefulGodAlignment
): string {
  const advice: string[] = [];

  // Tier-based general advice
  switch (tier) {
    case 'excellent':
      advice.push('Ideal timing for important relationship decisions, proposals, and deepening commitment.');
      break;
    case 'good':
      advice.push('Favorable for dates, meaningful conversations, and building connection.');
      break;
    case 'neutral':
      advice.push('Normal energy - maintain routine and avoid forcing major changes.');
      break;
    case 'challenging':
      advice.push('Practice patience and empathy. Avoid sensitive topics if possible.');
      break;
    case 'difficult':
      advice.push('Focus on self-care. Postpone major relationship discussions if possible.');
      break;
  }

  // Synastry-specific advice
  if (synastryHits.some(h => h.type === 'peach_blossom')) {
    advice.push('Romance energy is high - express affection openly.');
  }
  if (synastryHits.some(h => h.type === 'nobleman')) {
    advice.push('Seek support from mutual friends or mentors.');
  }

  // Shensha-specific advice
  if (shenshaHits.some(h => h.name === 'Red Matchmaker')) {
    advice.push('Marriage and commitment discussions are favored.');
  }
  if (shenshaHits.some(h => h.name === 'Sky Happiness')) {
    advice.push('Plan celebrations or joyful activities together.');
  }

  // Conflict-specific advice
  if (conflictHits.some(h => h.type === 'clash')) {
    advice.push('Give each other space to process. Avoid confrontation.');
  }
  if (conflictHits.some(h => h.type === 'harm')) {
    advice.push('Be mindful of subtle irritations. Practice active listening.');
  }

  // Useful God advice
  if (usefulGodAlignment.mutualSupport) {
    advice.push('Your shared goals align well - collaborate on projects.');
  }
  if (usefulGodAlignment.conflictingUseful) {
    advice.push('Be aware that what energizes one may drain the other.');
  }

  return advice.slice(0, 3).join(' ');
}

function generateActivityRecommendations(
  tier: RelationshipTier,
  synastryHits: SynastryHit[],
  conflictHits: RelationshipConflictHit[],
  shenshaHits: RelationshipShenshaHit[],
  transformationHits: RelationshipTransformationHit[]
): { suitableActivities: string[]; avoidActivities: string[] } {
  const suitableActivities: string[] = [];
  const avoidActivities: string[] = [];

  // Base activities by tier
  if (tier === 'excellent' || tier === 'good') {
    suitableActivities.push('Important conversations', 'Date nights', 'Meeting families');
  }
  if (tier === 'neutral') {
    suitableActivities.push('Routine activities', 'Light socializing', 'Shared hobbies');
  }
  if (tier === 'challenging' || tier === 'difficult') {
    avoidActivities.push('Major decisions', 'Financial discussions', 'Introducing to family');
    suitableActivities.push('Individual activities', 'Light exercise together', 'Nature walks');
  }

  // Synastry-based
  if (synastryHits.some(h => h.type === 'peach_blossom')) {
    suitableActivities.push('Romantic dinners', 'Creative dates', 'Expressing feelings');
  }

  // Shensha-based
  if (shenshaHits.some(h => h.name === 'Red Matchmaker')) {
    suitableActivities.push('Engagement', 'Wedding planning', 'Commitment ceremonies');
  }
  if (shenshaHits.some(h => h.name === 'Sky Happiness')) {
    suitableActivities.push('Celebrations', 'Parties together', 'Travel');
  }

  // Transformation-based
  if (transformationHits.some(t => t.crossChart)) {
    suitableActivities.push('Joint projects', 'Team activities', 'Building together');
  }

  // Conflict-based avoidance
  if (conflictHits.some(h => h.type === 'clash')) {
    avoidActivities.push('Confrontational discussions', 'Major changes');
  }
  if (conflictHits.some(h => h.type === 'harm')) {
    avoidActivities.push('Sensitive topics', 'Criticism');
  }

  return {
    suitableActivities: Array.from(new Set(suitableActivities)).slice(0, 5),
    avoidActivities: Array.from(new Set(avoidActivities)).slice(0, 4)
  };
}

// ============================================================================
// BEST TIMING FINDER
// ============================================================================

/**
 * Find best days for relationship activities in a given period
 */
export function findBestDaysForRelationship(
  dailyTimings: DailyRelationshipTiming[],
  minTier: RelationshipTier = 'good',
  activity?: string
): DailyRelationshipTiming[] {
  const tierOrder: RelationshipTier[] = ['excellent', 'good', 'neutral', 'challenging', 'difficult'];
  const minTierIndex = tierOrder.indexOf(minTier);

  return dailyTimings
    .filter(d => tierOrder.indexOf(d.tier) <= minTierIndex)
    .filter(d => !activity || d.suitableActivities.some(a =>
      a.toLowerCase().includes(activity.toLowerCase())
    ))
    .sort((a, b) => b.score - a.score);
}

/**
 * Find best hours for relationship activities on a given day
 */
export function findBestHoursForRelationship(
  hourlyTimings: HourlyRelationshipTiming[],
  minTier: RelationshipTier = 'good',
  activity?: string
): HourlyRelationshipTiming[] {
  const tierOrder: RelationshipTier[] = ['excellent', 'good', 'neutral', 'challenging', 'difficult'];
  const minTierIndex = tierOrder.indexOf(minTier);

  return hourlyTimings
    .filter(h => tierOrder.indexOf(h.tier) <= minTierIndex)
    .filter(h => !activity || h.suitableActivities.some(a =>
      a.toLowerCase().includes(activity.toLowerCase())
    ))
    .sort((a, b) => b.score - a.score);
}

// ============================================================================
// STORY/NARRATIVE BUILDER
// ============================================================================

/**
 * Build a narrative story for relationship timing
 */
export function buildRelationshipTimingStory(
  result: RelationshipTimingResult,
  personAName?: string,
  personBName?: string
): string {
  const nameA = personAName || 'Partner A';
  const nameB = personBName || 'Partner B';

  const lines: string[] = [];

  // Header
  const timeLabel = result.timeUnit === 'yearly' ? 'Year' :
                    result.timeUnit === 'monthly' ? 'Month' :
                    result.timeUnit === 'daily' ? 'Day' : 'Hour';

  lines.push(`## Relationship Timing — ${timeLabel} (合婚${result.timeUnit === 'yearly' ? '流年' : result.timeUnit === 'monthly' ? '流月' : result.timeUnit === 'daily' ? '流日' : '流时'})`);
  lines.push('');
  lines.push(`**${result.date || result.pillarDisplay}** — ${result.pillarDisplay}`);
  lines.push(`Score: ${result.score} (${result.tier.charAt(0).toUpperCase() + result.tier.slice(1)})`);
  lines.push('');

  // Individual scores
  lines.push('### Individual Energy');
  lines.push(`- ${nameA}: ${result.aScore}`);
  lines.push(`- ${nameB}: ${result.bScore}`);
  lines.push('');

  // Synastry
  if (result.synastryHits.length > 0) {
    lines.push('### Synastry Activation');
    for (const hit of result.synastryHits) {
      lines.push(`- ${hit.type.replace(/_/g, ' ')}: ${hit.description}`);
    }
    lines.push('');
  }

  // Conflicts
  if (result.conflictHits.length > 0) {
    lines.push('### Conflict Triggers');
    for (const hit of result.conflictHits) {
      lines.push(`- ${hit.type}: ${hit.description}`);
    }
    lines.push('');
  }

  // Shen Sha
  if (result.shenshaHits.length > 0) {
    lines.push('### Relationship Shen Sha');
    for (const hit of result.shenshaHits) {
      lines.push(`- ${hit.chineseName} (${hit.name}): ${hit.description}`);
    }
    lines.push('');
  }

  // Transformations
  if (result.transformationHits.length > 0) {
    lines.push('### Transformations');
    for (const hit of result.transformationHits) {
      lines.push(`- ${hit.type}: ${hit.description}${hit.crossChart ? ' [Cross-chart]' : ''}`);
    }
    lines.push('');
  }

  // Summary and advice
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
  computeRelationshipTiming,
  computeYearlyRelationshipTiming,
  computeMonthlyRelationshipTiming,
  computeDailyRelationshipTiming,
  computeHourlyRelationshipTiming,

  // Detection
  detectSynastryActivation,
  detectRelationshipConflicts,
  detectRelationshipShensha,
  detectRelationshipTransformations,
  analyzeUsefulGodAlignment,

  // Best timing finder
  findBestDaysForRelationship,
  findBestHoursForRelationship,

  // Story builder
  buildRelationshipTimingStory,

  // Constants
  RELATIONSHIP_SCORING_WEIGHTS,
  RELATIONSHIP_SHENSHA_DEFINITIONS,
  RED_MATCHMAKER_MAP,
  SKY_HAPPINESS_MAP,
  PEACH_BLOSSOM_MAP,
  NOBLEMAN_MAP
};
