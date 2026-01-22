/**
 * ============================================
 * CONSTELLATION ENGINE V2
 * Full 5-axis synastry model with Codex,
 * Persona, and Journey integration
 *
 * Axes:
 * 1. Support (助力) - Nourishment
 * 2. Friction (冲突) - Conflict
 * 3. Timing (时机) - Cycle alignment
 * 4. Destiny (命格相合) - Structure compatibility
 * 5. Shadow (阴影/业力) - Karmic patterns
 * ============================================
 */

import { CodexEntry } from './codexTypes';

// ==================== CORE TYPES ====================

export interface RawBaZiInput {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  gender: 'male' | 'female';
  location?: { lat: number; lng: number };
  name?: string;
}

export interface Pillar {
  stem: string;
  branch: string;
  hiddenStems?: string[];
}

export interface BaZiAnalysis {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;
  dayMaster: string;
  dayMasterElement: string;
  dayMasterYinYang: 'yin' | 'yang';
  dayMasterStrength: 'strong' | 'weak' | 'neutral';
  elementDistribution: Record<string, number>;
  usefulGod?: string;
  annoyingGod?: string;
  structure?: string;
  season: string;
  seasonElement: string;
  luckPillars?: LuckPillar[];
  triggeredRules?: string[];
}

export interface LuckPillar {
  index: number;
  stem: string;
  branch: string;
  startAge: number;
  endAge: number;
  element: string;
  effect?: 'favorable' | 'unfavorable' | 'mixed';
}

// ==================== PERSON & RELATIONSHIP TYPES ====================

export interface PersonNode {
  id: string;
  name: string;
  baziInput: RawBaZiInput;
  chart: BaZiAnalysis;
  role?: string;
  color?: string;
}

export interface RelationshipEdge {
  id: string;
  from: string;
  to: string;
  type: 'family' | 'romantic' | 'friendship' | 'professional' | 'mentor' | 'rival' | 'karmic' | 'other';
  label?: string;
  bidirectional?: boolean;
}

export interface ConstellationInput {
  persons: PersonNode[];
  relationships: RelationshipEdge[];
}

// ==================== SYNASTRY AXIS TYPES ====================

export interface SynastryAxisScore {
  axis: 'support' | 'friction' | 'timing' | 'destiny' | 'shadow';
  axisZh: string;
  score: number; // -100 to +100
  weight: number; // 0 to 1 for overall calculation
  notes: string[];
  keyRules: string[];
  codexReferences: string[];
  details: AxisDetail[];
}

export interface AxisDetail {
  factor: string;
  factorZh: string;
  contribution: number;
  description: string;
  ruleId?: string;
}

export interface TimingWindow {
  id: string;
  startAge: number;
  endAge: number;
  type: 'shared_peak' | 'shared_trough' | 'complementary' | 'conflicting' | 'activation';
  description: string;
  intensity: number; // 0-100
  affectedPersons: string[];
}

export interface CompositeChart {
  compositeDayMasterElement: string;
  compositeStrength: 'strong' | 'weak' | 'balanced';
  compositeElements: Record<string, number>;
  sharedUsefulGod?: string;
  relationshipNature: string;
  strengthAreas: string[];
  challengeAreas: string[];
  karmaThemes: string[];
}

export interface RelationshipAnalysis {
  edgeId: string;
  personA: string;
  personB: string;
  type: RelationshipEdge['type'];
  axes: SynastryAxisScore[];
  overallScore: number;
  overallAssessment: 'soulmate' | 'excellent' | 'good' | 'workable' | 'challenging' | 'karmic_lesson';
  compositeChart: CompositeChart;
  timingWindows: TimingWindow[];
  personaNarrative: string;
  personaNarrativeZh: string;
  journeySteps: RelationshipJourneyStep[];
  recommendations: string[];
}

export interface RelationshipJourneyStep {
  step: number;
  axis: string;
  axisZh: string;
  teaching: string;
  trial: string;
  insight: string;
}

export interface ConstellationAnalysis {
  id: string;
  analyzedAt: Date;
  persons: PersonNode[];
  relationships: RelationshipAnalysis[];
  constellationMap: ConstellationMap;
  groupDynamics?: GroupDynamics;
  overallNarrative: string;
}

// ==================== CONSTELLATION MAP TYPES ====================

export interface ConstellationMapNode {
  id: string;
  label: string;
  labelZh?: string;
  x: number;
  y: number;
  size: number;
  color: string;
  element: string;
  strength: number;
}

export interface ConstellationMapEdge {
  id: string;
  from: string;
  to: string;
  thickness: number;
  color: string;
  style: 'solid' | 'dashed' | 'dotted';
  label: string;
  score: number;
}

export interface ConstellationMap {
  nodes: ConstellationMapNode[];
  edges: ConstellationMapEdge[];
  centerOfMass: { x: number; y: number };
}

export interface GroupDynamics {
  centralFigure?: string;
  powerBalance: 'equal' | 'dominated' | 'fragmented' | 'hierarchical';
  overallCohesion: number;
  strongestBond: { from: string; to: string; score: number };
  weakestBond: { from: string; to: string; score: number };
  groupUsefulGod?: string;
  groupChallenges: string[];
  groupStrengths: string[];
}

// ==================== ELEMENT CONSTANTS ====================

const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

const ELEMENT_PRODUCES: Record<string, string> = {
  Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood'
};

const ELEMENT_CONTROLS: Record<string, string> = {
  Wood: 'Earth', Earth: 'Water', Water: 'Fire', Fire: 'Metal', Metal: 'Wood'
};

const ELEMENT_WEAKENS: Record<string, string> = {
  Wood: 'Water', Fire: 'Wood', Earth: 'Fire', Metal: 'Earth', Water: 'Metal'
};

const ELEMENT_COLORS: Record<string, string> = {
  Wood: '#4caf50',
  Fire: '#f44336',
  Earth: '#ff9800',
  Metal: '#9e9e9e',
  Water: '#2196f3'
};

const STEM_ELEMENTS: Record<string, string> = {
  '甲': 'Wood', '乙': 'Wood',
  '丙': 'Fire', '丁': 'Fire',
  '戊': 'Earth', '己': 'Earth',
  '庚': 'Metal', '辛': 'Metal',
  '壬': 'Water', '癸': 'Water'
};

const BRANCH_ELEMENTS: Record<string, string> = {
  '子': 'Water', '丑': 'Earth', '寅': 'Wood', '卯': 'Wood',
  '辰': 'Earth', '巳': 'Fire', '午': 'Fire', '未': 'Earth',
  '申': 'Metal', '酉': 'Metal', '戌': 'Earth', '亥': 'Water'
};

// Clash pairs
const BRANCH_CLASHES: [string, string][] = [
  ['子', '午'], ['丑', '未'], ['寅', '申'],
  ['卯', '酉'], ['辰', '戌'], ['巳', '亥']
];

// Harm pairs
const BRANCH_HARMS: [string, string][] = [
  ['子', '未'], ['丑', '午'], ['寅', '巳'],
  ['卯', '辰'], ['申', '亥'], ['酉', '戌']
];

// Six Harmony pairs
const BRANCH_SIX_HARMONY: [string, string][] = [
  ['子', '丑'], ['寅', '亥'], ['卯', '戌'],
  ['辰', '酉'], ['巳', '申'], ['午', '未']
];

// ==================== AXIS 1: SUPPORT (助力) ====================

function computeSupportAxis(A: BaZiAnalysis, B: BaZiAnalysis): SynastryAxisScore {
  let score = 50; // Start neutral
  const notes: string[] = [];
  const details: AxisDetail[] = [];
  const keyRules: string[] = [];
  const codexRefs: string[] = [];

  // 1. Day Master Element Relationship
  const dmA = A.dayMasterElement;
  const dmB = B.dayMasterElement;

  if (ELEMENT_PRODUCES[dmA] === dmB) {
    score += 25;
    details.push({
      factor: 'Day Master Production',
      factorZh: '日主生助',
      contribution: 25,
      description: `${A.dayMaster}(${dmA}) produces ${B.dayMaster}(${dmB}) - A nourishes B`
    });
    notes.push(`${dmA} nourishes ${dmB} - A supports B's growth`);
    keyRules.push('day_master_production');
  } else if (ELEMENT_PRODUCES[dmB] === dmA) {
    score += 25;
    details.push({
      factor: 'Day Master Production',
      factorZh: '日主生助',
      contribution: 25,
      description: `${B.dayMaster}(${dmB}) produces ${A.dayMaster}(${dmA}) - B nourishes A`
    });
    notes.push(`${dmB} nourishes ${dmA} - B supports A's growth`);
    keyRules.push('day_master_production');
  } else if (dmA === dmB) {
    score += 15;
    details.push({
      factor: 'Same Day Master Element',
      factorZh: '同元素日主',
      contribution: 15,
      description: 'Same element day masters - natural understanding'
    });
    notes.push('Same element - intuitive mutual understanding');
    keyRules.push('same_element_harmony');
  }

  // 2. Useful God Support
  if (B.usefulGod && A.elementDistribution[B.usefulGod] > 20) {
    const contribution = Math.min(20, Math.round(A.elementDistribution[B.usefulGod] / 2));
    score += contribution;
    details.push({
      factor: 'Useful God Support',
      factorZh: '用神相助',
      contribution,
      description: `A provides ${B.usefulGod} which is B's Useful God`
    });
    notes.push(`A's ${B.usefulGod} supports B's Useful God`);
    keyRules.push('useful_god_support');
    codexRefs.push('useful_god_blocked'); // Reference to when it's NOT supported
  }

  if (A.usefulGod && B.elementDistribution[A.usefulGod] > 20) {
    const contribution = Math.min(20, Math.round(B.elementDistribution[A.usefulGod] / 2));
    score += contribution;
    details.push({
      factor: 'Useful God Support',
      factorZh: '用神相助',
      contribution,
      description: `B provides ${A.usefulGod} which is A's Useful God`
    });
    notes.push(`B's ${A.usefulGod} supports A's Useful God`);
    keyRules.push('useful_god_support');
  }

  // 3. Branch Combinations (Six Harmony)
  const branchesA = [A.yearPillar.branch, A.monthPillar.branch, A.dayPillar.branch, A.hourPillar.branch];
  const branchesB = [B.yearPillar.branch, B.monthPillar.branch, B.dayPillar.branch, B.hourPillar.branch];

  for (const [a, b] of BRANCH_SIX_HARMONY) {
    if ((branchesA.includes(a) && branchesB.includes(b)) ||
        (branchesA.includes(b) && branchesB.includes(a))) {
      score += 10;
      details.push({
        factor: 'Six Harmony',
        factorZh: '六合',
        contribution: 10,
        description: `${a}-${b} Six Harmony between charts`
      });
      keyRules.push('branch_six_harmony');
      codexRefs.push('branch_six_harmony');
    }
  }

  // 4. Day Branch Six Harmony (most important)
  for (const [a, b] of BRANCH_SIX_HARMONY) {
    if ((A.dayPillar.branch === a && B.dayPillar.branch === b) ||
        (A.dayPillar.branch === b && B.dayPillar.branch === a)) {
      score += 15;
      details.push({
        factor: 'Day Branch Six Harmony',
        factorZh: '日支六合',
        contribution: 15,
        description: `Day pillars form ${a}-${b} Six Harmony - deep personal bond`
      });
      notes.push('Day branch Six Harmony - powerful intimate connection');
      keyRules.push('day_branch_six_harmony');
    }
  }

  // 5. Seasonal Support
  if (A.seasonElement === B.usefulGod) {
    score += 8;
    details.push({
      factor: 'Seasonal Alignment',
      factorZh: '季节相助',
      contribution: 8,
      description: `A's season (${A.seasonElement}) supports B's Useful God`
    });
    keyRules.push('seasonal_alignment');
  }

  // 6. Complementary Element Distribution
  for (const element of ELEMENTS) {
    const aLacks = A.elementDistribution[element] < 10;
    const bHas = B.elementDistribution[element] > 25;
    const bLacks = B.elementDistribution[element] < 10;
    const aHas = A.elementDistribution[element] > 25;

    if (aLacks && bHas) {
      score += 5;
      details.push({
        factor: 'Complementary Elements',
        factorZh: '互补五行',
        contribution: 5,
        description: `B's ${element} compensates A's deficiency`
      });
    }
    if (bLacks && aHas) {
      score += 5;
      details.push({
        factor: 'Complementary Elements',
        factorZh: '互补五行',
        contribution: 5,
        description: `A's ${element} compensates B's deficiency`
      });
    }
  }

  score = Math.max(-100, Math.min(100, score));

  return {
    axis: 'support',
    axisZh: '助力',
    score,
    weight: 0.25,
    notes,
    keyRules,
    codexReferences: codexRefs,
    details
  };
}

// ==================== AXIS 2: FRICTION (冲突) ====================

function computeFrictionAxis(A: BaZiAnalysis, B: BaZiAnalysis): SynastryAxisScore {
  let score = 70; // Start positive (no friction)
  const notes: string[] = [];
  const details: AxisDetail[] = [];
  const keyRules: string[] = [];
  const codexRefs: string[] = [];

  const branchesA = [A.yearPillar.branch, A.monthPillar.branch, A.dayPillar.branch, A.hourPillar.branch];
  const branchesB = [B.yearPillar.branch, B.monthPillar.branch, B.dayPillar.branch, B.hourPillar.branch];

  // 1. Branch Clashes
  for (const [a, b] of BRANCH_CLASHES) {
    if ((branchesA.includes(a) && branchesB.includes(b)) ||
        (branchesA.includes(b) && branchesB.includes(a))) {
      score -= 12;
      details.push({
        factor: 'Branch Clash',
        factorZh: '地支相冲',
        contribution: -12,
        description: `${a}-${b} clash creates friction`
      });
      keyRules.push('branch_clash');
      codexRefs.push('clash_harmful');
    }
  }

  // 2. Day Branch Clash (most severe)
  for (const [a, b] of BRANCH_CLASHES) {
    if ((A.dayPillar.branch === a && B.dayPillar.branch === b) ||
        (A.dayPillar.branch === b && B.dayPillar.branch === a)) {
      score -= 25;
      details.push({
        factor: 'Day Branch Clash',
        factorZh: '日支相冲',
        contribution: -25,
        description: `Day pillars clash (${a}-${b}) - significant personal friction`
      });
      notes.push('Day branch clash - fundamental tension in intimacy');
      keyRules.push('day_branch_clash');
      codexRefs.push('clash_day_year');
    }
  }

  // 3. Branch Harms
  for (const [a, b] of BRANCH_HARMS) {
    if ((branchesA.includes(a) && branchesB.includes(b)) ||
        (branchesA.includes(b) && branchesB.includes(a))) {
      score -= 8;
      details.push({
        factor: 'Branch Harm',
        factorZh: '地支相害',
        contribution: -8,
        description: `${a}-${b} harm creates hidden resentment`
      });
      keyRules.push('branch_harm');
      codexRefs.push('harm_detected');
    }
  }

  // 4. Day Master Control (one controls the other)
  const dmA = A.dayMasterElement;
  const dmB = B.dayMasterElement;

  if (ELEMENT_CONTROLS[dmA] === dmB) {
    score -= 15;
    details.push({
      factor: 'Day Master Control',
      factorZh: '日主相克',
      contribution: -15,
      description: `${dmA} controls ${dmB} - A may dominate B`
    });
    notes.push(`${dmA} controls ${dmB} - potential power imbalance`);
    keyRules.push('day_master_control');
  } else if (ELEMENT_CONTROLS[dmB] === dmA) {
    score -= 15;
    details.push({
      factor: 'Day Master Control',
      factorZh: '日主相克',
      contribution: -15,
      description: `${dmB} controls ${dmA} - B may dominate A`
    });
    notes.push(`${dmB} controls ${dmA} - potential power imbalance`);
    keyRules.push('day_master_control');
  }

  // 5. Opposing Useful Gods
  if (A.usefulGod && B.annoyingGod && A.usefulGod === B.annoyingGod) {
    score -= 18;
    details.push({
      factor: 'Useful God Conflict',
      factorZh: '用神冲突',
      contribution: -18,
      description: `A's Useful God is B's Annoying God - opposing needs`
    });
    notes.push('What helps A may harm B');
    keyRules.push('useful_god_conflict');
    codexRefs.push('annoying_god_revealed');
  }

  if (B.usefulGod && A.annoyingGod && B.usefulGod === A.annoyingGod) {
    score -= 18;
    details.push({
      factor: 'Useful God Conflict',
      factorZh: '用神冲突',
      contribution: -18,
      description: `B's Useful God is A's Annoying God - opposing needs`
    });
    notes.push('What helps B may harm A');
    keyRules.push('useful_god_conflict');
  }

  // 6. Amplifying Annoying God
  if (A.annoyingGod && B.elementDistribution[A.annoyingGod] > 30) {
    score -= 10;
    details.push({
      factor: 'Annoying God Amplification',
      factorZh: '忌神加强',
      contribution: -10,
      description: `B strengthens A's Annoying God (${A.annoyingGod})`
    });
    keyRules.push('annoying_god_amplification');
  }

  if (B.annoyingGod && A.elementDistribution[B.annoyingGod] > 30) {
    score -= 10;
    details.push({
      factor: 'Annoying God Amplification',
      factorZh: '忌神加强',
      contribution: -10,
      description: `A strengthens B's Annoying God (${B.annoyingGod})`
    });
    keyRules.push('annoying_god_amplification');
  }

  score = Math.max(-100, Math.min(100, score));

  return {
    axis: 'friction',
    axisZh: '冲突',
    score,
    weight: 0.20,
    notes,
    keyRules,
    codexReferences: codexRefs,
    details
  };
}

// ==================== AXIS 3: TIMING (时机) ====================

function computeTimingAxis(A: BaZiAnalysis, B: BaZiAnalysis): SynastryAxisScore {
  let score = 50; // Neutral
  const notes: string[] = [];
  const details: AxisDetail[] = [];
  const keyRules: string[] = [];
  const codexRefs: string[] = [];

  // 1. Luck Pillar Phase Alignment
  if (A.luckPillars && B.luckPillars) {
    let alignedPeriods = 0;
    let conflictingPeriods = 0;

    for (let i = 0; i < Math.min(A.luckPillars.length, B.luckPillars.length); i++) {
      const lpA = A.luckPillars[i];
      const lpB = B.luckPillars[i];

      if (lpA.effect === lpB.effect) {
        alignedPeriods++;
      } else if ((lpA.effect === 'favorable' && lpB.effect === 'unfavorable') ||
                 (lpA.effect === 'unfavorable' && lpB.effect === 'favorable')) {
        conflictingPeriods++;
      }
    }

    if (alignedPeriods > conflictingPeriods) {
      score += 15 + (alignedPeriods * 3);
      details.push({
        factor: 'Luck Pillar Alignment',
        factorZh: '大运同步',
        contribution: 15 + (alignedPeriods * 3),
        description: `${alignedPeriods} aligned luck pillar periods`
      });
      notes.push('Life timing tends to sync - shared peaks and valleys');
      keyRules.push('luck_pillar_alignment');
      codexRefs.push('luck_pillar_seasonal_alignment');
    } else if (conflictingPeriods > alignedPeriods) {
      score -= 10 + (conflictingPeriods * 2);
      details.push({
        factor: 'Luck Pillar Misalignment',
        factorZh: '大运错位',
        contribution: -(10 + (conflictingPeriods * 2)),
        description: `${conflictingPeriods} conflicting luck pillar periods`
      });
      notes.push('Life timing often opposed - patience required');
      keyRules.push('luck_pillar_misalignment');
    }
  }

  // 2. Activation Potential (hidden stem revelation)
  const hiddenA = [
    ...(A.yearPillar.hiddenStems || []),
    ...(A.monthPillar.hiddenStems || []),
    ...(A.dayPillar.hiddenStems || []),
    ...(A.hourPillar.hiddenStems || [])
  ];

  const stemsB = [B.yearPillar.stem, B.monthPillar.stem, B.dayPillar.stem, B.hourPillar.stem];

  const activations = hiddenA.filter(h => stemsB.includes(h)).length;
  if (activations > 0) {
    score += activations * 8;
    details.push({
      factor: 'Hidden Stem Activation',
      factorZh: '藏干透出',
      contribution: activations * 8,
      description: `B reveals ${activations} of A's hidden stems`
    });
    notes.push("B activates A's latent potential");
    keyRules.push('hidden_stem_activation');
    codexRefs.push('hidden_stem_revealed');
  }

  // 3. Seasonal Phase Compatibility
  const seasonOrder = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const idxA = seasonOrder.indexOf(A.seasonElement);
  const idxB = seasonOrder.indexOf(B.seasonElement);
  const seasonDistance = Math.abs(idxA - idxB);

  if (seasonDistance <= 1 || seasonDistance >= 4) {
    score += 10;
    details.push({
      factor: 'Seasonal Harmony',
      factorZh: '季节和谐',
      contribution: 10,
      description: 'Birth seasons in harmony'
    });
    keyRules.push('seasonal_harmony');
  } else if (seasonDistance === 2) {
    score -= 5;
    details.push({
      factor: 'Seasonal Tension',
      factorZh: '季节张力',
      contribution: -5,
      description: 'Birth seasons create mild tension'
    });
  }

  score = Math.max(-100, Math.min(100, score));

  return {
    axis: 'timing',
    axisZh: '时机',
    score,
    weight: 0.15,
    notes,
    keyRules,
    codexReferences: codexRefs,
    details
  };
}

// ==================== AXIS 4: DESTINY (命格相合) ====================

function computeDestinyAxis(A: BaZiAnalysis, B: BaZiAnalysis): SynastryAxisScore {
  let score = 50;
  const notes: string[] = [];
  const details: AxisDetail[] = [];
  const keyRules: string[] = [];
  const codexRefs: string[] = [];

  // 1. Structure Compatibility
  if (A.structure && B.structure) {
    // Same structure type
    if (A.structure === B.structure) {
      score += 20;
      details.push({
        factor: 'Same Structure',
        factorZh: '同格局',
        contribution: 20,
        description: `Both have ${A.structure} structure`
      });
      notes.push('Shared life structure - deep understanding');
      keyRules.push('structure_match');
      codexRefs.push('special_structure_override');
    }
    // Complementary structures (e.g., Follow Wealth + Follow Authority)
    else if (A.structure.includes('Follow') && B.structure.includes('Follow')) {
      score += 10;
      details.push({
        factor: 'Complementary Structure',
        factorZh: '互补格局',
        contribution: 10,
        description: 'Both have Follow-type structures'
      });
      keyRules.push('structure_complement');
    }
  }

  // 2. Useful God Synergy
  if (A.usefulGod && B.usefulGod) {
    if (A.usefulGod === B.usefulGod) {
      score += 15;
      details.push({
        factor: 'Shared Useful God',
        factorZh: '同用神',
        contribution: 15,
        description: `Both need ${A.usefulGod}`
      });
      notes.push('Shared Useful God - seek the same support');
      keyRules.push('shared_useful_god');
    } else if (ELEMENT_PRODUCES[A.usefulGod] === B.usefulGod) {
      score += 12;
      details.push({
        factor: 'Useful God Production Cycle',
        factorZh: '用神相生',
        contribution: 12,
        description: `${A.usefulGod} produces ${B.usefulGod}`
      });
      keyRules.push('useful_god_cycle');
    }
  }

  // 3. Element Dominance Match
  const dominantA = Object.entries(A.elementDistribution)
    .sort((a, b) => b[1] - a[1])[0][0];
  const dominantB = Object.entries(B.elementDistribution)
    .sort((a, b) => b[1] - a[1])[0][0];

  if (dominantA === dominantB) {
    score += 10;
    details.push({
      factor: 'Shared Dominant Element',
      factorZh: '同主导五行',
      contribution: 10,
      description: `Both dominated by ${dominantA}`
    });
    keyRules.push('element_dominance_match');
  } else if (ELEMENT_PRODUCES[dominantA] === dominantB ||
             ELEMENT_PRODUCES[dominantB] === dominantA) {
    score += 8;
    details.push({
      factor: 'Complementary Dominance',
      factorZh: '互补主导',
      contribution: 8,
      description: 'Dominant elements in production cycle'
    });
  }

  // 4. Day Master Strength Match
  if (A.dayMasterStrength === B.dayMasterStrength) {
    if (A.dayMasterStrength === 'strong') {
      score += 5;
      details.push({
        factor: 'Both Strong Day Masters',
        factorZh: '双强日主',
        contribution: 5,
        description: 'Both have strong Day Masters'
      });
    } else if (A.dayMasterStrength === 'weak') {
      score += 5;
      details.push({
        factor: 'Both Weak Day Masters',
        factorZh: '双弱日主',
        contribution: 5,
        description: 'Both have weak Day Masters - mutual understanding of need for support'
      });
    }
  } else if ((A.dayMasterStrength === 'strong' && B.dayMasterStrength === 'weak') ||
             (A.dayMasterStrength === 'weak' && B.dayMasterStrength === 'strong')) {
    // Complementary - one can support the other
    score += 8;
    details.push({
      factor: 'Complementary Strength',
      factorZh: '强弱互补',
      contribution: 8,
      description: 'One strong, one weak - natural support dynamic'
    });
    keyRules.push('strength_complement');
  }

  score = Math.max(-100, Math.min(100, score));

  return {
    axis: 'destiny',
    axisZh: '命格相合',
    score,
    weight: 0.25,
    notes,
    keyRules,
    codexReferences: codexRefs,
    details
  };
}

// ==================== AXIS 5: SHADOW / KARMA (阴影/业力) ====================

function computeShadowAxis(A: BaZiAnalysis, B: BaZiAnalysis): SynastryAxisScore {
  let score = 60; // Start slightly positive (less karma is better)
  const notes: string[] = [];
  const details: AxisDetail[] = [];
  const keyRules: string[] = [];
  const codexRefs: string[] = [];

  const branchesA = [A.yearPillar.branch, A.monthPillar.branch, A.dayPillar.branch, A.hourPillar.branch];
  const branchesB = [B.yearPillar.branch, B.monthPillar.branch, B.dayPillar.branch, B.hourPillar.branch];

  // 1. Three Punishments (Unkindness - 寅巳申)
  const unkindnessBranches = ['寅', '巳', '申'];
  const unkindnessA = branchesA.filter(b => unkindnessBranches.includes(b)).length;
  const unkindnessB = branchesB.filter(b => unkindnessBranches.includes(b)).length;

  if (unkindnessA > 0 && unkindnessB > 0) {
    const combined = new Set([
      ...branchesA.filter(b => unkindnessBranches.includes(b)),
      ...branchesB.filter(b => unkindnessBranches.includes(b))
    ]);
    if (combined.size >= 2) {
      score -= 20;
      details.push({
        factor: 'Unkindness Punishment',
        factorZh: '恃势之刑',
        contribution: -20,
        description: 'Combined charts form Unkindness Punishment (寅巳申)'
      });
      notes.push('Karmic theme: trust and betrayal');
      keyRules.push('three_punishment_unkindness');
      codexRefs.push('punishment_unkindness');
    }
  }

  // 2. Three Punishments (Bullying - 丑未戌)
  const bullyingBranches = ['丑', '未', '戌'];
  const bullyingA = branchesA.filter(b => bullyingBranches.includes(b)).length;
  const bullyingB = branchesB.filter(b => bullyingBranches.includes(b)).length;

  if (bullyingA > 0 && bullyingB > 0) {
    const combined = new Set([
      ...branchesA.filter(b => bullyingBranches.includes(b)),
      ...branchesB.filter(b => bullyingBranches.includes(b))
    ]);
    if (combined.size >= 2) {
      score -= 18;
      details.push({
        factor: 'Bullying Punishment',
        factorZh: '无恩之刑',
        contribution: -18,
        description: 'Combined charts form Bullying Punishment (丑未戌)'
      });
      notes.push('Karmic theme: power dynamics');
      keyRules.push('three_punishment_bullying');
      codexRefs.push('punishment_bullying');
    }
  }

  // 3. Self-Punishment Resonance
  const selfPunishment = ['辰', '午', '酉', '亥'];
  for (const branch of selfPunishment) {
    if (branchesA.includes(branch) && branchesB.includes(branch)) {
      score -= 10;
      details.push({
        factor: 'Self-Punishment Resonance',
        factorZh: '自刑共振',
        contribution: -10,
        description: `Both have ${branch} self-punishment potential`
      });
      notes.push(`Shared self-sabotage patterns around ${branch}`);
      keyRules.push('self_punishment_resonance');
      codexRefs.push('punishment_self');
    }
  }

  // 4. Grave Storage Entanglement (辰戌丑未)
  const graveBranches = ['辰', '戌', '丑', '未'];
  const gravesA = branchesA.filter(b => graveBranches.includes(b)).length;
  const gravesB = branchesB.filter(b => graveBranches.includes(b)).length;

  if (gravesA >= 2 && gravesB >= 2) {
    score -= 12;
    details.push({
      factor: 'Grave Storage Entanglement',
      factorZh: '墓库纠缠',
      contribution: -12,
      description: 'Multiple graves in both charts - complex karmic storage'
    });
    notes.push('Deep karmic storage requires conscious processing');
    keyRules.push('grave_entanglement');
    codexRefs.push('hidden_stem_grave_storage');
  }

  // 5. Shared Annoying God Pattern
  if (A.annoyingGod && B.annoyingGod && A.annoyingGod === B.annoyingGod) {
    score -= 8;
    details.push({
      factor: 'Shared Annoying God',
      factorZh: '同忌神',
      contribution: -8,
      description: `Both challenged by ${A.annoyingGod}`
    });
    notes.push('Shared shadow element - may amplify challenges');
    keyRules.push('shared_annoying_god');
  }

  // 6. Karmic Indicator: Year Branch to Day Branch
  for (const [a, b] of BRANCH_HARMS) {
    if ((A.yearPillar.branch === a && B.dayPillar.branch === b) ||
        (A.yearPillar.branch === b && B.dayPillar.branch === a)) {
      score -= 15;
      details.push({
        factor: 'Year-Day Karmic Harm',
        factorZh: '年日业力害',
        contribution: -15,
        description: "A's ancestral line harms B's personal space (or vice versa)"
      });
      notes.push('Family karma enters personal relationship');
      keyRules.push('year_day_karmic_harm');
    }
  }

  score = Math.max(-100, Math.min(100, score));

  return {
    axis: 'shadow',
    axisZh: '阴影/业力',
    score,
    weight: 0.15,
    notes,
    keyRules,
    codexReferences: codexRefs,
    details
  };
}

// ==================== COMPOSITE CHART ====================

function computeCompositeChart(A: BaZiAnalysis, B: BaZiAnalysis): CompositeChart {
  // Average element distributions
  const compositeElements: Record<string, number> = {};
  for (const element of ELEMENTS) {
    compositeElements[element] = (
      A.elementDistribution[element] + B.elementDistribution[element]
    ) / 2;
  }

  // Determine composite day master element (dominant)
  const sorted = Object.entries(compositeElements).sort((a, b) => b[1] - a[1]);
  const compositeDayMasterElement = sorted[0][0];

  // Composite strength
  const avgStrengthA = A.dayMasterStrength === 'strong' ? 3 :
                       A.dayMasterStrength === 'weak' ? 1 : 2;
  const avgStrengthB = B.dayMasterStrength === 'strong' ? 3 :
                       B.dayMasterStrength === 'weak' ? 1 : 2;
  const avgStrength = (avgStrengthA + avgStrengthB) / 2;
  const compositeStrength = avgStrength > 2.5 ? 'strong' :
                            avgStrength < 1.5 ? 'weak' : 'balanced';

  // Shared useful god
  let sharedUsefulGod: string | undefined;
  if (A.usefulGod === B.usefulGod) {
    sharedUsefulGod = A.usefulGod;
  } else if (A.usefulGod && B.usefulGod &&
             ELEMENT_PRODUCES[A.usefulGod] === B.usefulGod) {
    sharedUsefulGod = B.usefulGod;
  }

  // Relationship nature based on dominant composite elements
  const natureMap: Record<string, string> = {
    Wood: 'Growth-oriented, expansive, nurturing potential',
    Fire: 'Passionate, inspiring, dynamic energy',
    Earth: 'Stable, grounded, loyal foundation',
    Metal: 'Principled, structured, refined standards',
    Water: 'Adaptive, flowing, emotionally deep'
  };
  const relationshipNature = natureMap[compositeDayMasterElement] +
    ` with ${natureMap[sorted[1][0]].toLowerCase()} undertones.`;

  // Strength areas (top 2 elements)
  const strengthAreas = sorted.slice(0, 2).map(([el, pct]) =>
    `${el} energy (${pct.toFixed(1)}%) - ${getElementStrengthDescription(el)}`
  );

  // Challenge areas (bottom 2 elements)
  const challengeAreas = sorted.slice(-2).map(([el, pct]) =>
    `${el} deficiency (${pct.toFixed(1)}%) - ${getElementChallengeDescription(el)}`
  );

  // Karma themes based on combined weaknesses
  const karmaThemes: string[] = [];
  if (compositeElements.Water < 15) karmaThemes.push('Communication and emotional flow');
  if (compositeElements.Fire < 15) karmaThemes.push('Passion and inspiration');
  if (compositeElements.Earth < 15) karmaThemes.push('Stability and trust');
  if (compositeElements.Metal < 15) karmaThemes.push('Boundaries and principles');
  if (compositeElements.Wood < 15) karmaThemes.push('Growth and flexibility');

  return {
    compositeDayMasterElement,
    compositeStrength,
    compositeElements,
    sharedUsefulGod,
    relationshipNature,
    strengthAreas,
    challengeAreas,
    karmaThemes
  };
}

function getElementStrengthDescription(element: string): string {
  const descriptions: Record<string, string> = {
    Wood: 'creativity, growth, vision',
    Fire: 'passion, visibility, warmth',
    Earth: 'reliability, nurturing, groundedness',
    Metal: 'clarity, standards, refinement',
    Water: 'adaptability, depth, intuition'
  };
  return descriptions[element] || '';
}

function getElementChallengeDescription(element: string): string {
  const descriptions: Record<string, string> = {
    Wood: 'may struggle with growth and flexibility',
    Fire: 'may lack spark and visibility',
    Earth: 'may need more stability and grounding',
    Metal: 'may need clearer boundaries',
    Water: 'may need more emotional depth'
  };
  return descriptions[element] || '';
}

// ==================== TIMING WINDOWS ====================

function computeTimingWindows(A: BaZiAnalysis, B: BaZiAnalysis): TimingWindow[] {
  const windows: TimingWindow[] = [];

  if (!A.luckPillars || !B.luckPillars) return windows;

  for (let i = 0; i < Math.min(A.luckPillars.length, B.luckPillars.length); i++) {
    const lpA = A.luckPillars[i];
    const lpB = B.luckPillars[i];

    // Shared peak
    if (lpA.effect === 'favorable' && lpB.effect === 'favorable') {
      windows.push({
        id: `shared_peak_${i}`,
        startAge: Math.max(lpA.startAge, lpB.startAge),
        endAge: Math.min(lpA.endAge, lpB.endAge),
        type: 'shared_peak',
        description: 'Both experience favorable luck - best for major joint ventures',
        intensity: 85,
        affectedPersons: ['A', 'B']
      });
    }

    // Shared trough
    if (lpA.effect === 'unfavorable' && lpB.effect === 'unfavorable') {
      windows.push({
        id: `shared_trough_${i}`,
        startAge: Math.max(lpA.startAge, lpB.startAge),
        endAge: Math.min(lpA.endAge, lpB.endAge),
        type: 'shared_trough',
        description: 'Both face challenges - mutual support crucial',
        intensity: 70,
        affectedPersons: ['A', 'B']
      });
    }

    // Complementary (one up, one down)
    if ((lpA.effect === 'favorable' && lpB.effect === 'unfavorable') ||
        (lpA.effect === 'unfavorable' && lpB.effect === 'favorable')) {
      const supporter = lpA.effect === 'favorable' ? 'A' : 'B';
      windows.push({
        id: `complementary_${i}`,
        startAge: Math.max(lpA.startAge, lpB.startAge),
        endAge: Math.min(lpA.endAge, lpB.endAge),
        type: 'complementary',
        description: `${supporter} can support the other through challenges`,
        intensity: 60,
        affectedPersons: ['A', 'B']
      });
    }
  }

  return windows;
}

// ==================== PERSONA NARRATIVE ====================

function generatePersonaNarrative(
  analysis: Omit<RelationshipAnalysis, 'personaNarrative' | 'personaNarrativeZh'>
): { en: string; zh: string } {
  const { axes, overallScore, compositeChart } = analysis;
  const support = axes.find(a => a.axis === 'support')!;
  const friction = axes.find(a => a.axis === 'friction')!;
  const destiny = axes.find(a => a.axis === 'destiny')!;
  const shadow = axes.find(a => a.axis === 'shadow')!;

  // English narrative
  let en = '';
  if (overallScore >= 75) {
    en = `This is a deeply harmonious connection. `;
  } else if (overallScore >= 55) {
    en = `This is a workable relationship with both strengths and growth areas. `;
  } else {
    en = `This relationship brings significant karmic lessons. `;
  }

  if (support.score > 70) {
    en += `${support.notes[0] || 'Natural support flows between you.'} `;
  }
  if (friction.score < 50) {
    en += `However, ${friction.notes[0] || 'friction requires conscious navigation.'} `;
  }
  if (shadow.score < 50) {
    en += `Deep karmic patterns are at play: ${shadow.notes[0] || 'past-life themes resurface.'} `;
  }

  en += `Together, your energy is ${compositeChart.relationshipNature}`;

  // Chinese narrative
  let zh = '';
  if (overallScore >= 75) {
    zh = '这是一段深度和谐的连接。';
  } else if (overallScore >= 55) {
    zh = '这段关系既有优势也有成长空间。';
  } else {
    zh = '这段关系带来重要的业力功课。';
  }

  if (support.score > 70) {
    zh += '天然的支持能量在你们之间流动。';
  }
  if (friction.score < 50) {
    zh += '然而，冲突需要有意识地调和。';
  }
  if (shadow.score < 50) {
    zh += '深层的业力模式正在运作，过去世的主题重新浮现。';
  }

  return { en, zh };
}

// ==================== JOURNEY STEPS ====================

function generateJourneySteps(axes: SynastryAxisScore[]): RelationshipJourneyStep[] {
  return axes.map((axis, i) => ({
    step: i + 1,
    axis: axis.axis,
    axisZh: axis.axisZh,
    teaching: getAxisTeaching(axis),
    trial: getAxisTrial(axis),
    insight: getAxisInsight(axis)
  }));
}

function getAxisTeaching(axis: SynastryAxisScore): string {
  const teachings: Record<string, string> = {
    support: 'Where do you nourish each other? Where does support flow naturally?',
    friction: 'Where does tension arise? What triggers conflict between you?',
    timing: 'How do your life cycles interact? When are you in sync, when out of phase?',
    destiny: 'What deeper structural patterns connect you? What is the purpose of this bond?',
    shadow: 'What karmic patterns do you carry together? What past-life themes resurface?'
  };
  return teachings[axis.axis] || '';
}

function getAxisTrial(axis: SynastryAxisScore): string {
  if (axis.score > 70) {
    return 'The trial is to receive this blessing without attachment or expectation.';
  } else if (axis.score > 40) {
    return 'The trial is to navigate complexity without forcing resolution.';
  } else {
    return 'The trial is to face this challenge without avoidance or blame.';
  }
}

function getAxisInsight(axis: SynastryAxisScore): string {
  const insights: Record<string, string> = {
    support: 'Support is not transaction. Give freely, receive graciously.',
    friction: 'Friction polishes. Without it, you cannot grow together.',
    timing: 'Time is your ally when you stop fighting it.',
    destiny: 'You are here together for a reason. Trust the pattern.',
    shadow: 'The shadow, once faced, becomes fuel for transformation.'
  };
  return insights[axis.axis] || '';
}

// ==================== CONSTELLATION MAP ====================

function buildConstellationMap(
  persons: PersonNode[],
  relationships: RelationshipAnalysis[]
): ConstellationMap {
  // Position nodes in a circle
  const nodes: ConstellationMapNode[] = [];
  const radius = 200;
  const centerX = 300;
  const centerY = 300;

  persons.forEach((person, i) => {
    const angle = (2 * Math.PI * i) / persons.length - Math.PI / 2;
    nodes.push({
      id: person.id,
      label: person.name,
      labelZh: person.baziInput.name,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      size: 40 + (person.chart.dayMasterStrength === 'strong' ? 10 : 0),
      color: ELEMENT_COLORS[person.chart.dayMasterElement] || '#9e9e9e',
      element: person.chart.dayMasterElement,
      strength: person.chart.dayMasterStrength === 'strong' ? 80 :
                person.chart.dayMasterStrength === 'weak' ? 40 : 60
    });
  });

  // Create edges
  const edges: ConstellationMapEdge[] = relationships.map(rel => {
    const color = rel.overallScore >= 70 ? '#4caf50' :
                  rel.overallScore >= 50 ? '#ff9800' : '#f44336';
    const style = rel.overallScore >= 60 ? 'solid' :
                  rel.overallScore >= 40 ? 'dashed' : 'dotted';

    return {
      id: rel.edgeId,
      from: rel.personA,
      to: rel.personB,
      thickness: Math.max(1, Math.round(rel.overallScore / 20)),
      color,
      style,
      label: rel.type,
      score: rel.overallScore
    };
  });

  return {
    nodes,
    edges,
    centerOfMass: { x: centerX, y: centerY }
  };
}

// ==================== MAIN ANALYSIS FUNCTION ====================

/**
 * Perform complete constellation analysis
 */
export function analyzeConstellationV2(input: ConstellationInput): ConstellationAnalysis {
  const relationships: RelationshipAnalysis[] = [];

  for (const edge of input.relationships) {
    const personA = input.persons.find(p => p.id === edge.from);
    const personB = input.persons.find(p => p.id === edge.to);

    if (!personA || !personB) continue;

    // Compute all 5 axes
    const axes: SynastryAxisScore[] = [
      computeSupportAxis(personA.chart, personB.chart),
      computeFrictionAxis(personA.chart, personB.chart),
      computeTimingAxis(personA.chart, personB.chart),
      computeDestinyAxis(personA.chart, personB.chart),
      computeShadowAxis(personA.chart, personB.chart)
    ];

    // Calculate overall score
    const overallScore = Math.round(
      axes.reduce((sum, a) => sum + (a.score * a.weight), 0)
    );

    // Determine assessment
    let overallAssessment: RelationshipAnalysis['overallAssessment'];
    if (overallScore >= 85) overallAssessment = 'soulmate';
    else if (overallScore >= 70) overallAssessment = 'excellent';
    else if (overallScore >= 55) overallAssessment = 'good';
    else if (overallScore >= 40) overallAssessment = 'workable';
    else if (overallScore >= 25) overallAssessment = 'challenging';
    else overallAssessment = 'karmic_lesson';

    // Compute composite chart
    const compositeChart = computeCompositeChart(personA.chart, personB.chart);

    // Compute timing windows
    const timingWindows = computeTimingWindows(personA.chart, personB.chart);

    // Generate narratives
    const partialAnalysis = {
      edgeId: edge.id,
      personA: personA.id,
      personB: personB.id,
      type: edge.type,
      axes,
      overallScore,
      overallAssessment,
      compositeChart,
      timingWindows,
      journeySteps: [] as RelationshipJourneyStep[],
      recommendations: [] as string[]
    };

    const narratives = generatePersonaNarrative(partialAnalysis);
    const journeySteps = generateJourneySteps(axes);

    // Generate recommendations
    const recommendations = generateRelationshipRecommendations(axes, overallAssessment);

    relationships.push({
      ...partialAnalysis,
      personaNarrative: narratives.en,
      personaNarrativeZh: narratives.zh,
      journeySteps,
      recommendations
    });
  }

  // Build constellation map
  const constellationMap = buildConstellationMap(input.persons, relationships);

  // Analyze group dynamics if more than 2 people
  let groupDynamics: GroupDynamics | undefined;
  if (input.persons.length > 2) {
    groupDynamics = analyzeGroupDynamicsV2(input.persons, relationships);
  }

  // Generate overall narrative
  const overallNarrative = generateOverallNarrative(input.persons, relationships);

  return {
    id: `constellation_${Date.now()}`,
    analyzedAt: new Date(),
    persons: input.persons,
    relationships,
    constellationMap,
    groupDynamics,
    overallNarrative
  };
}

function generateRelationshipRecommendations(
  axes: SynastryAxisScore[],
  assessment: RelationshipAnalysis['overallAssessment']
): string[] {
  const recommendations: string[] = [];

  // Based on weak axes
  for (const axis of axes) {
    if (axis.score < 40) {
      switch (axis.axis) {
        case 'support':
          recommendations.push('Actively find ways to support each other\'s growth');
          recommendations.push('Express appreciation for small acts of care');
          break;
        case 'friction':
          recommendations.push('Develop conflict resolution rituals');
          recommendations.push('Take breaks during heated moments');
          break;
        case 'timing':
          recommendations.push('Be patient with different life rhythms');
          recommendations.push('Plan major moves when both are in favorable periods');
          break;
        case 'destiny':
          recommendations.push('Explore shared purposes and goals');
          recommendations.push('Accept that you may have different life paths');
          break;
        case 'shadow':
          recommendations.push('Consider couples therapy or counseling');
          recommendations.push('Be aware of projection and old patterns');
          break;
      }
    }
  }

  // Based on assessment
  if (assessment === 'karmic_lesson') {
    recommendations.push('This relationship is here to teach, not necessarily to last');
    recommendations.push('Focus on what you are learning, not what you are getting');
  } else if (assessment === 'soulmate' || assessment === 'excellent') {
    recommendations.push('Build on your natural strengths together');
    recommendations.push('Don\'t take harmony for granted - nurture it');
  }

  return recommendations;
}

function analyzeGroupDynamicsV2(
  persons: PersonNode[],
  relationships: RelationshipAnalysis[]
): GroupDynamics {
  // Find strongest and weakest bonds
  const sortedByScore = [...relationships].sort((a, b) => b.overallScore - a.overallScore);
  const strongest = sortedByScore[0];
  const weakest = sortedByScore[sortedByScore.length - 1];

  // Calculate overall cohesion
  const avgScore = relationships.reduce((sum, r) => sum + r.overallScore, 0) /
                   (relationships.length || 1);

  // Find central figure (most connections with high scores)
  const personScores: Record<string, number> = {};
  for (const person of persons) {
    const connectedRels = relationships.filter(
      r => r.personA === person.id || r.personB === person.id
    );
    personScores[person.id] = connectedRels.reduce((sum, r) => sum + r.overallScore, 0) /
                              (connectedRels.length || 1);
  }
  const centralFigure = Object.entries(personScores)
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  // Determine power balance
  const scoreVariance = relationships.map(r => r.overallScore)
    .reduce((v, s) => v + Math.pow(s - avgScore, 2), 0) / (relationships.length || 1);

  let powerBalance: GroupDynamics['powerBalance'] = 'equal';
  if (scoreVariance > 400) powerBalance = 'fragmented';
  else if (personScores[centralFigure] > avgScore * 1.3) powerBalance = 'dominated';

  // Find group useful god (most common)
  const usefulGodCounts: Record<string, number> = {};
  for (const person of persons) {
    if (person.chart.usefulGod) {
      usefulGodCounts[person.chart.usefulGod] =
        (usefulGodCounts[person.chart.usefulGod] || 0) + 1;
    }
  }
  const groupUsefulGod = Object.entries(usefulGodCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  // Group challenges and strengths
  const groupChallenges = relationships
    .filter(r => r.overallScore < 50)
    .map(r => `${r.personA}-${r.personB}: ${r.overallAssessment}`);

  const groupStrengths = relationships
    .filter(r => r.overallScore >= 70)
    .map(r => `${r.personA}-${r.personB}: ${r.overallAssessment}`);

  return {
    centralFigure,
    powerBalance,
    overallCohesion: Math.round(avgScore),
    strongestBond: {
      from: strongest?.personA || '',
      to: strongest?.personB || '',
      score: strongest?.overallScore || 0
    },
    weakestBond: {
      from: weakest?.personA || '',
      to: weakest?.personB || '',
      score: weakest?.overallScore || 0
    },
    groupUsefulGod,
    groupChallenges,
    groupStrengths
  };
}

function generateOverallNarrative(
  persons: PersonNode[],
  relationships: RelationshipAnalysis[]
): string {
  const lines: string[] = [];

  lines.push(`This constellation of ${persons.length} souls reveals:`);
  lines.push('');

  // Overall assessment
  const avgScore = relationships.reduce((sum, r) => sum + r.overallScore, 0) /
                   (relationships.length || 1);

  if (avgScore >= 70) {
    lines.push('A harmonious web of connections, with natural affinities supporting collective growth.');
  } else if (avgScore >= 50) {
    lines.push('A mix of harmony and challenge, creating dynamic tension that can fuel evolution.');
  } else {
    lines.push('Significant karmic work is present. This group has come together for deep learning.');
  }

  lines.push('');

  // Element balance
  const elementTotals: Record<string, number> = {};
  for (const person of persons) {
    for (const [element, pct] of Object.entries(person.chart.elementDistribution)) {
      elementTotals[element] = (elementTotals[element] || 0) + pct;
    }
  }
  const dominantGroupElement = Object.entries(elementTotals)
    .sort((a, b) => b[1] - a[1])[0][0];

  lines.push(`The group's dominant energy is ${dominantGroupElement}, bringing ${getElementStrengthDescription(dominantGroupElement)}.`);

  return lines.join('\n');
}

// ==================== EXPORTS ====================

export {
  computeSupportAxis,
  computeFrictionAxis,
  computeTimingAxis,
  computeDestinyAxis,
  computeShadowAxis,
  computeCompositeChart,
  computeTimingWindows,
  generatePersonaNarrative,
  generateJourneySteps,
  buildConstellationMap,
  analyzeGroupDynamicsV2,
  generateOverallNarrative
};
