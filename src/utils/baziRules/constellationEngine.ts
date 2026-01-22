/**
 * ============================================
 * CONSTELLATION ENGINE
 * Multi-person relationship analysis engine
 * Synastry, composite charts, and relationship dynamics
 * ============================================
 */

// ==================== TYPES ====================

export interface RawBaZiInput {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  gender: 'male' | 'female';
  location?: { lat: number; lng: number };
}

export interface ParsedChart {
  yearPillar: { stem: string; branch: string };
  monthPillar: { stem: string; branch: string };
  dayPillar: { stem: string; branch: string };
  hourPillar: { stem: string; branch: string };
  dayMaster: string;
  dayMasterElement: string;
  dayMasterYinYang: 'yin' | 'yang';
  elementDistribution: Record<string, number>;
  usefulGod?: string;
  annoyingGod?: string;
}

export interface PersonNode {
  id: string;
  name: string;
  baziInput: RawBaZiInput;
  parsedChart?: ParsedChart;
  role?: string;
}

export interface RelationshipEdge {
  id: string;
  from: string;
  to: string;
  type: 'family' | 'romantic' | 'friendship' | 'professional' | 'mentor' | 'other';
  label?: string;
  bidirectional: boolean;
}

export interface ConstellationInput {
  persons: PersonNode[];
  relationships: RelationshipEdge[];
}

export interface SynastryScore {
  axis: string;
  score: number; // -100 to 100
  weight: number; // 0 to 1
  notes: string;
  details?: string[];
}

export interface SynastryAnalysis {
  person1Id: string;
  person2Id: string;
  overallScore: number;
  overallAssessment: 'excellent' | 'good' | 'moderate' | 'challenging' | 'difficult';
  scores: SynastryScore[];
  keyDynamics: string[];
  recommendations: string[];
  triggeredRules: string[];
}

export interface CompositeElement {
  element: string;
  percentage: number;
  source: string;
}

export interface CompositeChart {
  edgeId: string;
  compositeYearPillar: { stem: string; branch: string };
  compositeMonthPillar: { stem: string; branch: string };
  compositeDayPillar: { stem: string; branch: string };
  compositeHourPillar: { stem: string; branch: string };
  combinedElements: CompositeElement[];
  relationshipNature: string;
  strengthAreas: string[];
  challengeAreas: string[];
}

export interface RelationshipAnalysis {
  edgeId: string;
  type: RelationshipEdge['type'];
  synastry: SynastryAnalysis;
  composite?: CompositeChart;
  keyRules: string[];
  overallHealth: 'thriving' | 'stable' | 'working' | 'strained' | 'critical';
  advice: string[];
}

export interface ConstellationAnalysis {
  id: string;
  analyzedAt: Date;
  persons: PersonNode[];
  relationships: RelationshipAnalysis[];
  groupDynamics?: GroupDynamics;
  narrativeSummary: string;
}

export interface GroupDynamics {
  centralFigure?: string;
  powerBalance: 'equal' | 'dominated' | 'fragmented';
  overallCohesion: number; // 0-100
  conflictPoints: string[];
  harmonyPoints: string[];
}

// ==================== ELEMENT CONSTANTS ====================

const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

const ELEMENT_RELATIONSHIPS: Record<string, Record<string, string>> = {
  Wood: { produces: 'Fire', controls: 'Earth', weakens: 'Water', controlled_by: 'Metal' },
  Fire: { produces: 'Earth', controls: 'Metal', weakens: 'Wood', controlled_by: 'Water' },
  Earth: { produces: 'Metal', controls: 'Water', weakens: 'Fire', controlled_by: 'Wood' },
  Metal: { produces: 'Water', controls: 'Wood', weakens: 'Earth', controlled_by: 'Fire' },
  Water: { produces: 'Wood', controls: 'Fire', weakens: 'Metal', controlled_by: 'Earth' }
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

// ==================== SYNASTRY AXES ====================

const SYNASTRY_AXES = [
  { id: 'day_master_harmony', name: 'Day Master Harmony', weight: 0.25 },
  { id: 'element_balance', name: 'Element Balance', weight: 0.20 },
  { id: 'useful_god_support', name: 'Useful God Support', weight: 0.20 },
  { id: 'branch_combinations', name: 'Branch Combinations', weight: 0.15 },
  { id: 'clash_conflicts', name: 'Clash/Conflict Patterns', weight: 0.10 },
  { id: 'timing_alignment', name: 'Timing Alignment', weight: 0.10 }
];

// ==================== CORE ANALYSIS FUNCTIONS ====================

/**
 * Calculate Day Master relationship
 */
function analyzeDayMasterHarmony(chart1: ParsedChart, chart2: ParsedChart): SynastryScore {
  const dm1 = chart1.dayMasterElement;
  const dm2 = chart2.dayMasterElement;

  let score = 0;
  let notes = '';
  const details: string[] = [];

  // Same element
  if (dm1 === dm2) {
    score = 60;
    notes = 'Same Day Master element - natural understanding, but may lack complementary energy';
    details.push('Similar perspectives and values');
    details.push('May reinforce same blind spots');
  }
  // Producing relationship
  else if (ELEMENT_RELATIONSHIPS[dm1].produces === dm2) {
    score = 85;
    notes = `${dm1} produces ${dm2} - Person 1 naturally supports Person 2`;
    details.push('One-way nurturing dynamic');
    details.push('Person 1 gives, Person 2 receives');
  }
  else if (ELEMENT_RELATIONSHIPS[dm2].produces === dm1) {
    score = 85;
    notes = `${dm2} produces ${dm1} - Person 2 naturally supports Person 1`;
    details.push('One-way nurturing dynamic');
    details.push('Person 2 gives, Person 1 receives');
  }
  // Controlling relationship
  else if (ELEMENT_RELATIONSHIPS[dm1].controls === dm2) {
    score = 30;
    notes = `${dm1} controls ${dm2} - Power imbalance, Person 1 dominates`;
    details.push('Potential for control dynamics');
    details.push('Person 2 may feel restricted');
  }
  else if (ELEMENT_RELATIONSHIPS[dm2].controls === dm1) {
    score = 30;
    notes = `${dm2} controls ${dm1} - Power imbalance, Person 2 dominates`;
    details.push('Potential for control dynamics');
    details.push('Person 1 may feel restricted');
  }
  // Weakening relationship
  else {
    score = 50;
    notes = 'Neutral element relationship - neither support nor conflict';
    details.push('Relatively independent dynamics');
  }

  return {
    axis: 'day_master_harmony',
    score,
    weight: 0.25,
    notes,
    details
  };
}

/**
 * Analyze element balance between charts
 */
function analyzeElementBalance(chart1: ParsedChart, chart2: ParsedChart): SynastryScore {
  const details: string[] = [];
  let score = 50;

  // Check if elements complement
  for (const element of ELEMENTS) {
    const p1Has = chart1.elementDistribution[element] > 20;
    const p2Has = chart2.elementDistribution[element] > 20;
    const p1Lacks = chart1.elementDistribution[element] < 10;
    const p2Lacks = chart2.elementDistribution[element] < 10;

    if (p1Lacks && p2Has) {
      score += 10;
      details.push(`Person 2's ${element} complements Person 1's lack`);
    }
    if (p2Lacks && p1Has) {
      score += 10;
      details.push(`Person 1's ${element} complements Person 2's lack`);
    }
    if (p1Lacks && p2Lacks) {
      score -= 5;
      details.push(`Both lack ${element} - shared weakness`);
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    axis: 'element_balance',
    score,
    weight: 0.20,
    notes: score > 70 ? 'Good elemental complementarity' :
           score > 50 ? 'Moderate elemental balance' :
           'Element imbalances may create friction',
    details
  };
}

/**
 * Analyze Useful God support
 */
function analyzeUsefulGodSupport(chart1: ParsedChart, chart2: ParsedChart): SynastryScore {
  const details: string[] = [];
  let score = 50;

  // Check if one person's chart supports other's useful god
  if (chart1.usefulGod && chart2.elementDistribution[chart1.usefulGod] > 25) {
    score += 25;
    details.push(`Person 2 provides strong ${chart1.usefulGod} support for Person 1's Useful God`);
  }
  if (chart2.usefulGod && chart1.elementDistribution[chart2.usefulGod] > 25) {
    score += 25;
    details.push(`Person 1 provides strong ${chart2.usefulGod} support for Person 2's Useful God`);
  }

  // Check if one person's annoying god is strengthened
  if (chart1.annoyingGod && chart2.elementDistribution[chart1.annoyingGod] > 30) {
    score -= 15;
    details.push(`Warning: Person 2 strengthens Person 1's Annoying God`);
  }
  if (chart2.annoyingGod && chart1.elementDistribution[chart2.annoyingGod] > 30) {
    score -= 15;
    details.push(`Warning: Person 1 strengthens Person 2's Annoying God`);
  }

  score = Math.max(0, Math.min(100, score));

  return {
    axis: 'useful_god_support',
    score,
    weight: 0.20,
    notes: score > 70 ? 'Mutual Useful God support - excellent compatibility' :
           score > 50 ? 'Some supportive dynamics' :
           'Careful: may amplify challenges',
    details
  };
}

/**
 * Check for branch combinations (六合, 三合)
 */
function analyzeBranchCombinations(chart1: ParsedChart, chart2: ParsedChart): SynastryScore {
  const details: string[] = [];
  let score = 50;

  // Six Harmony pairs
  const sixHarmonyPairs: [string, string][] = [
    ['子', '丑'], ['寅', '亥'], ['卯', '戌'],
    ['辰', '酉'], ['巳', '申'], ['午', '未']
  ];

  const branches1 = [
    chart1.yearPillar.branch, chart1.monthPillar.branch,
    chart1.dayPillar.branch, chart1.hourPillar.branch
  ];
  const branches2 = [
    chart2.yearPillar.branch, chart2.monthPillar.branch,
    chart2.dayPillar.branch, chart2.hourPillar.branch
  ];

  for (const [a, b] of sixHarmonyPairs) {
    if ((branches1.includes(a) && branches2.includes(b)) ||
        (branches1.includes(b) && branches2.includes(a))) {
      score += 15;
      details.push(`Six Harmony: ${a}-${b} connection between charts`);
    }
  }

  // Day branch combination (most significant)
  const dayBranch1 = chart1.dayPillar.branch;
  const dayBranch2 = chart2.dayPillar.branch;

  for (const [a, b] of sixHarmonyPairs) {
    if ((dayBranch1 === a && dayBranch2 === b) ||
        (dayBranch1 === b && dayBranch2 === a)) {
      score += 20;
      details.push(`Day Branch Six Harmony (${a}-${b}) - strong personal bond`);
    }
  }

  score = Math.min(100, score);

  return {
    axis: 'branch_combinations',
    score,
    weight: 0.15,
    notes: score > 70 ? 'Strong branch combinations indicate natural affinity' :
           score > 50 ? 'Some favorable combinations' :
           'Limited natural combinations',
    details
  };
}

/**
 * Check for clash/conflict patterns
 */
function analyzeClashConflicts(chart1: ParsedChart, chart2: ParsedChart): SynastryScore {
  const details: string[] = [];
  let score = 70; // Start neutral-positive

  // Branch clashes
  const clashPairs: [string, string][] = [
    ['子', '午'], ['丑', '未'], ['寅', '申'],
    ['卯', '酉'], ['辰', '戌'], ['巳', '亥']
  ];

  const branches1 = [
    chart1.yearPillar.branch, chart1.monthPillar.branch,
    chart1.dayPillar.branch, chart1.hourPillar.branch
  ];
  const branches2 = [
    chart2.yearPillar.branch, chart2.monthPillar.branch,
    chart2.dayPillar.branch, chart2.hourPillar.branch
  ];

  for (const [a, b] of clashPairs) {
    if ((branches1.includes(a) && branches2.includes(b)) ||
        (branches1.includes(b) && branches2.includes(a))) {
      score -= 10;
      details.push(`Branch clash: ${a}-${b} creates friction`);
    }
  }

  // Day branch clash (most problematic)
  const dayBranch1 = chart1.dayPillar.branch;
  const dayBranch2 = chart2.dayPillar.branch;

  for (const [a, b] of clashPairs) {
    if ((dayBranch1 === a && dayBranch2 === b) ||
        (dayBranch1 === b && dayBranch2 === a)) {
      score -= 25;
      details.push(`Day Branch Clash (${a}-${b}) - significant personal friction`);
    }
  }

  score = Math.max(0, score);

  return {
    axis: 'clash_conflicts',
    score,
    weight: 0.10,
    notes: score > 60 ? 'Minimal conflict patterns' :
           score > 40 ? 'Some clash dynamics to navigate' :
           'Significant conflicts require conscious effort',
    details
  };
}

/**
 * Analyze timing alignment (luck pillar phases)
 */
function analyzeTimingAlignment(chart1: ParsedChart, chart2: ParsedChart): SynastryScore {
  // Simplified timing analysis based on element cycles
  let score = 60;
  const details: string[] = [];

  // Check if day masters are in same phase of cycle
  const elementOrder = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const idx1 = elementOrder.indexOf(chart1.dayMasterElement);
  const idx2 = elementOrder.indexOf(chart2.dayMasterElement);

  const distance = Math.abs(idx1 - idx2);

  if (distance === 0) {
    score = 75;
    details.push('Same elemental phase - synchronized timing');
  } else if (distance === 1 || distance === 4) {
    score = 70;
    details.push('Adjacent phases - complementary timing');
  } else if (distance === 2 || distance === 3) {
    score = 55;
    details.push('Different phases - may need patience with timing');
  }

  return {
    axis: 'timing_alignment',
    score,
    weight: 0.10,
    notes: 'Timing alignment affects when relationship peaks and challenges occur',
    details
  };
}

// ==================== MAIN ANALYSIS FUNCTION ====================

/**
 * Perform complete synastry analysis between two charts
 */
export function analyzeSynastry(
  person1: PersonNode,
  person2: PersonNode
): SynastryAnalysis {
  const chart1 = person1.parsedChart;
  const chart2 = person2.parsedChart;

  if (!chart1 || !chart2) {
    throw new Error('Both persons must have parsed charts');
  }

  const scores: SynastryScore[] = [
    analyzeDayMasterHarmony(chart1, chart2),
    analyzeElementBalance(chart1, chart2),
    analyzeUsefulGodSupport(chart1, chart2),
    analyzeBranchCombinations(chart1, chart2),
    analyzeClashConflicts(chart1, chart2),
    analyzeTimingAlignment(chart1, chart2)
  ];

  // Calculate weighted overall score
  const overallScore = Math.round(
    scores.reduce((sum, s) => sum + (s.score * s.weight), 0)
  );

  // Determine assessment
  let overallAssessment: SynastryAnalysis['overallAssessment'];
  if (overallScore >= 80) overallAssessment = 'excellent';
  else if (overallScore >= 65) overallAssessment = 'good';
  else if (overallScore >= 50) overallAssessment = 'moderate';
  else if (overallScore >= 35) overallAssessment = 'challenging';
  else overallAssessment = 'difficult';

  // Extract key dynamics
  const keyDynamics: string[] = [];
  for (const score of scores) {
    if (score.score >= 75) {
      keyDynamics.push(`Strength: ${score.notes}`);
    } else if (score.score <= 35) {
      keyDynamics.push(`Challenge: ${score.notes}`);
    }
  }

  // Generate recommendations
  const recommendations = generateRecommendations(scores, overallAssessment);

  return {
    person1Id: person1.id,
    person2Id: person2.id,
    overallScore,
    overallAssessment,
    scores,
    keyDynamics,
    recommendations,
    triggeredRules: []
  };
}

function generateRecommendations(
  scores: SynastryScore[],
  assessment: SynastryAnalysis['overallAssessment']
): string[] {
  const recommendations: string[] = [];

  for (const score of scores) {
    if (score.score < 50) {
      switch (score.axis) {
        case 'day_master_harmony':
          recommendations.push('Practice understanding different perspectives');
          break;
        case 'element_balance':
          recommendations.push('Be aware of shared weaknesses and compensate together');
          break;
        case 'useful_god_support':
          recommendations.push('Seek external support for individual growth');
          break;
        case 'clash_conflicts':
          recommendations.push('Develop conflict resolution strategies');
          break;
        case 'timing_alignment':
          recommendations.push('Be patient with different life rhythms');
          break;
      }
    }
  }

  if (assessment === 'excellent' || assessment === 'good') {
    recommendations.push('Build on natural strengths while staying aware of blind spots');
  }

  return recommendations;
}

/**
 * Generate composite chart from two persons
 */
export function generateComposite(
  person1: PersonNode,
  person2: PersonNode,
  edgeId: string
): CompositeChart {
  const chart1 = person1.parsedChart;
  const chart2 = person2.parsedChart;

  if (!chart1 || !chart2) {
    throw new Error('Both persons must have parsed charts');
  }

  // Combine element distributions
  const combinedElements: CompositeElement[] = [];
  for (const element of ELEMENTS) {
    const avg = (chart1.elementDistribution[element] + chart2.elementDistribution[element]) / 2;
    combinedElements.push({
      element,
      percentage: Math.round(avg * 10) / 10,
      source: 'average'
    });
  }

  // Determine relationship nature based on dominant combined elements
  const sorted = [...combinedElements].sort((a, b) => b.percentage - a.percentage);
  const dominant = sorted[0].element;
  const secondary = sorted[1].element;

  const natureMap: Record<string, string> = {
    Wood: 'growth-oriented, nurturing',
    Fire: 'passionate, inspiring',
    Earth: 'stable, grounded',
    Metal: 'principled, structured',
    Water: 'adaptive, flowing'
  };

  const relationshipNature = `${natureMap[dominant]} with ${natureMap[secondary]} undertones`;

  // Identify strengths and challenges
  const strengthAreas = sorted.slice(0, 2).map(e =>
    `${e.element} energy (${e.percentage.toFixed(1)}%)`
  );
  const challengeAreas = sorted.slice(-2).map(e =>
    `${e.element} deficiency (${e.percentage.toFixed(1)}%)`
  );

  return {
    edgeId,
    compositeYearPillar: { stem: '?', branch: '?' },
    compositeMonthPillar: { stem: '?', branch: '?' },
    compositeDayPillar: { stem: '?', branch: '?' },
    compositeHourPillar: { stem: '?', branch: '?' },
    combinedElements,
    relationshipNature,
    strengthAreas,
    challengeAreas
  };
}

/**
 * Analyze complete constellation
 */
export function analyzeConstellation(input: ConstellationInput): ConstellationAnalysis {
  const relationships: RelationshipAnalysis[] = [];

  for (const edge of input.relationships) {
    const person1 = input.persons.find(p => p.id === edge.from);
    const person2 = input.persons.find(p => p.id === edge.to);

    if (!person1 || !person2) continue;

    const synastry = analyzeSynastry(person1, person2);
    const composite = generateComposite(person1, person2, edge.id);

    // Determine overall health
    let overallHealth: RelationshipAnalysis['overallHealth'];
    if (synastry.overallScore >= 75) overallHealth = 'thriving';
    else if (synastry.overallScore >= 60) overallHealth = 'stable';
    else if (synastry.overallScore >= 45) overallHealth = 'working';
    else if (synastry.overallScore >= 30) overallHealth = 'strained';
    else overallHealth = 'critical';

    relationships.push({
      edgeId: edge.id,
      type: edge.type,
      synastry,
      composite,
      keyRules: synastry.triggeredRules,
      overallHealth,
      advice: synastry.recommendations
    });
  }

  // Analyze group dynamics if more than 2 people
  let groupDynamics: GroupDynamics | undefined;
  if (input.persons.length > 2) {
    groupDynamics = analyzeGroupDynamics(input.persons, relationships);
  }

  // Generate narrative summary
  const narrativeSummary = generateConstellationNarrative(input.persons, relationships);

  return {
    id: `constellation_${Date.now()}`,
    analyzedAt: new Date(),
    persons: input.persons,
    relationships,
    groupDynamics,
    narrativeSummary
  };
}

function analyzeGroupDynamics(
  persons: PersonNode[],
  relationships: RelationshipAnalysis[]
): GroupDynamics {
  // Find central figure (most connections)
  const connectionCounts: Record<string, number> = {};
  for (const person of persons) {
    connectionCounts[person.id] = relationships.filter(
      r => r.synastry.person1Id === person.id || r.synastry.person2Id === person.id
    ).length;
  }

  const maxConnections = Math.max(...Object.values(connectionCounts));
  const centralFigure = Object.entries(connectionCounts)
    .find(([_, count]) => count === maxConnections)?.[0];

  // Calculate overall cohesion
  const avgScore = relationships.reduce((sum, r) => sum + r.synastry.overallScore, 0) /
                   (relationships.length || 1);

  // Determine power balance
  let powerBalance: GroupDynamics['powerBalance'] = 'equal';
  const scoreVariance = relationships.map(r => r.synastry.overallScore)
    .reduce((variance, score) => variance + Math.pow(score - avgScore, 2), 0) /
    (relationships.length || 1);

  if (scoreVariance > 400) powerBalance = 'fragmented';
  else if (maxConnections > persons.length / 2) powerBalance = 'dominated';

  // Find conflict and harmony points
  const conflictPoints = relationships
    .filter(r => r.synastry.overallScore < 45)
    .map(r => `${r.synastry.person1Id}-${r.synastry.person2Id} tension`);

  const harmonyPoints = relationships
    .filter(r => r.synastry.overallScore > 70)
    .map(r => `${r.synastry.person1Id}-${r.synastry.person2Id} affinity`);

  return {
    centralFigure,
    powerBalance,
    overallCohesion: Math.round(avgScore),
    conflictPoints,
    harmonyPoints
  };
}

function generateConstellationNarrative(
  persons: PersonNode[],
  relationships: RelationshipAnalysis[]
): string {
  const lines: string[] = [];

  lines.push(`This constellation of ${persons.length} souls reveals a complex web of connections.`);
  lines.push('');

  // Overall assessment
  const avgScore = relationships.reduce((sum, r) => sum + r.synastry.overallScore, 0) /
                   (relationships.length || 1);

  if (avgScore >= 70) {
    lines.push('The overall energy is harmonious, with natural affinities supporting growth.');
  } else if (avgScore >= 50) {
    lines.push('A mix of harmony and friction creates dynamic tension within the group.');
  } else {
    lines.push('Significant challenges exist that require conscious effort to navigate.');
  }

  lines.push('');

  // Key relationships
  const strongest = [...relationships].sort((a, b) =>
    b.synastry.overallScore - a.synastry.overallScore
  )[0];

  const weakest = [...relationships].sort((a, b) =>
    a.synastry.overallScore - b.synastry.overallScore
  )[0];

  if (strongest) {
    lines.push(`The strongest bond connects ${strongest.synastry.person1Id} and ${strongest.synastry.person2Id} (${strongest.synastry.overallScore}%).`);
  }
  if (weakest && weakest !== strongest) {
    lines.push(`The most challenging dynamic exists between ${weakest.synastry.person1Id} and ${weakest.synastry.person2Id} (${weakest.synastry.overallScore}%).`);
  }

  return lines.join('\n');
}

// ==================== EXPORTS ====================

export {
  analyzeDayMasterHarmony,
  analyzeElementBalance,
  analyzeUsefulGodSupport,
  analyzeBranchCombinations,
  analyzeClashConflicts,
  analyzeTimingAlignment,
  generateRecommendations,
  analyzeGroupDynamics,
  generateConstellationNarrative
};
