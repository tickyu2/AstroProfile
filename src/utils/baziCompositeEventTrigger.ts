/**
 * ============================================================================
 * BAZI COMPOSITE EVENT TRIGGER ENGINE (合盘应期)
 * ============================================================================
 *
 * The apex of the relationship architecture — where the relationship's own
 * 命盘 becomes a living timeline predicting relationship-specific events.
 *
 * A composite event occurs when multiple timing layers activate the composite
 * chart's core themes simultaneously. This is different from individual event
 * triggers — these are events for the relationship entity itself.
 *
 * Four Types of Composite Events:
 * 1. Relationship Events (感情应期) - Emotional breakthroughs, commitment
 * 2. Growth Events (成长应期) - Shared projects, creativity, expansion
 * 3. Challenge Events (挑战应期) - Conflict windows, stress cycles
 * 4. Destiny Events (命运应期) - Fated meetings, turning points
 *
 * Multi-Layer Activation Model:
 * - Composite Luck Pillar
 * - Composite Annual
 * - Composite Monthly
 * - Composite Daily
 * - Composite Hourly
 * - Synastry Resonance
 * - Individual Timing Convergence
 * - Composite Shen Sha
 * - Composite Useful God
 *
 * Based on: Classical 应期 (event timing) methodology
 * Aligned with: Joey Yap relationship timing framework
 * Created: January 2026
 * ============================================================================
 */

import type {
  CompositeChart,
  CompositePillar,
  CompositeDayMaster,
  CompositeUsefulGod,
  CompositeShenSha,
  CompositeLuckPillar
} from './baziCompositeChart';

import type { SynastryHeatmap, SynastryCell } from './baziSynastryHeatmap';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type StemName = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
export type BranchName = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

/**
 * Timing pillar structure
 */
export interface TimingPillar {
  stem: StemName;
  branch: BranchName;
}

/**
 * Individual partner timing context
 */
export interface PartnerTimingContext {
  name: string;
  overallScore: number;
  relationshipScore: number;
  wealthScore: number;
  careerScore: number;
  healthScore: number;
  usefulGodActive: boolean;
  annoyingGodActive: boolean;
  favorableTier: 'excellent' | 'good' | 'neutral' | 'challenging' | 'difficult';
}

/**
 * Composite event type
 */
export type CompositeEventType = 'relationship' | 'growth' | 'challenge' | 'destiny';

/**
 * Event tier classification
 */
export type EventTier = 'strong' | 'likely' | 'mild' | 'none';

/**
 * Layer activation result
 */
export interface LayerActivation {
  layer: string;
  layerChinese: string;
  pillar: string;
  activations: string[];
  score: number;
  usefulGodActive: boolean;
  annoyingGodActive: boolean;
  shenshaActivated: string[];
  conflictsTriggered: string[];
  transformationsActive: string[];
}

/**
 * Event type analysis
 */
export interface EventTypeAnalysis {
  type: CompositeEventType;
  typeChinese: string;
  score: number;
  tier: EventTier;
  activationFactors: string[];
  likelihood: number; // 0-100
  peakWindow: string;
  interpretation: string;
}

/**
 * Synastry resonance analysis
 */
export interface SynastryResonanceResult {
  overallResonance: number;
  dayDayHarmony: number;
  dayMonthHarmony: number;
  yearYearTension: number;
  monthMonthHarmony: number;
  karmicHits: string[];
  romanticActivation: boolean;
}

/**
 * Partner convergence analysis
 */
export interface PartnerConvergence {
  bothFavorable: boolean;
  bothRelationshipHigh: boolean;
  convergenceScore: number;
  divergenceAreas: string[];
  synergyAreas: string[];
}

/**
 * Complete composite event trigger result
 */
export interface CompositeEventTriggerResult {
  // Core scores
  overallScore: number;
  overallTier: EventTier;

  // Event types
  relationshipEvent: EventTypeAnalysis;
  growthEvent: EventTypeAnalysis;
  challengeEvent: EventTypeAnalysis;
  destinyEvent: EventTypeAnalysis;

  // Dominant event
  dominantEvent: CompositeEventType;
  dominantEventChinese: string;

  // Layer analysis
  layers: LayerActivation[];

  // Synastry
  synastryResonance: SynastryResonanceResult;

  // Partner analysis
  partnerConvergence: PartnerConvergence;

  // Activations
  usefulGodActivations: string[];
  shenshaActivations: string[];
  conflictActivations: string[];
  transformationActivations: string[];

  // Summary
  summary: string;
  interpretation: string;
  recommendations: string[];

  // Timing
  timeUnit: string;
  pillarDisplay: string;
  computedAt: string;
}

/**
 * Comprehensive composite event analysis (multiple time layers)
 */
export interface ComprehensiveCompositeEventResult {
  luckPillar: CompositeEventTriggerResult | null;
  annual: CompositeEventTriggerResult | null;
  monthly: CompositeEventTriggerResult | null;
  daily: CompositeEventTriggerResult | null;
  hourly: CompositeEventTriggerResult | null;

  // Combined
  combinedScore: number;
  combinedTier: EventTier;
  dominantEventType: CompositeEventType;

  // Peak windows
  relationshipPeakWindows: string[];
  growthPeakWindows: string[];
  challengeWindows: string[];
  destinyWindows: string[];

  // Overall
  overallSummary: string;
  overallInterpretation: string;
  keyRecommendations: string[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Stem to element mapping
 */
const STEM_ELEMENT: Record<string, ElementName> = {
  '甲': 'Wood', '乙': 'Wood',
  '丙': 'Fire', '丁': 'Fire',
  '戊': 'Earth', '己': 'Earth',
  '庚': 'Metal', '辛': 'Metal',
  '壬': 'Water', '癸': 'Water'
};

/**
 * Branch to element mapping
 */
const BRANCH_ELEMENT: Record<string, ElementName> = {
  '子': 'Water', '丑': 'Earth',
  '寅': 'Wood', '卯': 'Wood',
  '辰': 'Earth', '巳': 'Fire',
  '午': 'Fire', '未': 'Earth',
  '申': 'Metal', '酉': 'Metal',
  '戌': 'Earth', '亥': 'Water'
};

/**
 * Element production cycle
 */
const ELEMENT_PRODUCES: Record<ElementName, ElementName> = {
  Wood: 'Fire',
  Fire: 'Earth',
  Earth: 'Metal',
  Metal: 'Water',
  Water: 'Wood'
};

/**
 * Element control cycle
 */
const ELEMENT_CONTROLS: Record<ElementName, ElementName> = {
  Wood: 'Earth',
  Fire: 'Metal',
  Earth: 'Water',
  Metal: 'Wood',
  Water: 'Fire'
};

/**
 * 六合 (Six Combinations) pairs
 */
const LIUHE_PAIRS: Array<[string, string, ElementName]> = [
  ['子', '丑', 'Earth'],
  ['寅', '亥', 'Wood'],
  ['卯', '戌', 'Fire'],
  ['辰', '酉', 'Metal'],
  ['巳', '申', 'Water'],
  ['午', '未', 'Fire']
];

/**
 * 三合 (Three Combinations) frames
 */
const SANHE_FRAMES: Record<ElementName, [string, string, string]> = {
  Water: ['申', '子', '辰'],
  Wood: ['亥', '卯', '未'],
  Fire: ['寅', '午', '戌'],
  Metal: ['巳', '酉', '丑'],
  Earth: ['丑', '辰', '未'] // Auxiliary
};

/**
 * Clash pairs (冲)
 */
const CLASH_PAIRS: Array<[string, string]> = [
  ['子', '午'], ['丑', '未'], ['寅', '申'],
  ['卯', '酉'], ['辰', '戌'], ['巳', '亥']
];

/**
 * Harm pairs (害)
 */
const HARM_PAIRS: Array<[string, string]> = [
  ['子', '未'], ['丑', '午'], ['寅', '巳'],
  ['卯', '辰'], ['申', '亥'], ['酉', '戌']
];

/**
 * Punishment groups (刑)
 */
const PUNISHMENT_GROUPS: Array<string[]> = [
  ['寅', '巳', '申'],  // Ungrateful punishment
  ['丑', '戌', '未'],  // Bullying punishment
  ['子', '卯'],        // Rude punishment
  ['辰', '辰'],        // Self punishment
  ['午', '午'],
  ['酉', '酉'],
  ['亥', '亥']
];

/**
 * Romantic Shen Sha names
 */
const ROMANTIC_SHENSHA = ['红鸾', '天喜', '桃花', '咸池'];

/**
 * Noble Shen Sha names
 */
const NOBLE_SHENSHA = ['天乙贵人', '将星', '文昌'];

/**
 * Layer weights for scoring
 */
const LAYER_WEIGHTS: Record<string, number> = {
  luckPillar: 0.20,
  annual: 0.25,
  monthly: 0.25,
  daily: 0.18,
  hourly: 0.12
};

/**
 * Event type Chinese names
 */
const EVENT_TYPE_CHINESE: Record<CompositeEventType, string> = {
  relationship: '感情应期',
  growth: '成长应期',
  challenge: '挑战应期',
  destiny: '命运应期'
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if two branches form 六合
 */
function checkLiuhe(branch1: string, branch2: string): { combines: boolean; result?: ElementName } {
  for (const [b1, b2, result] of LIUHE_PAIRS) {
    if ((branch1 === b1 && branch2 === b2) || (branch1 === b2 && branch2 === b1)) {
      return { combines: true, result };
    }
  }
  return { combines: false };
}

/**
 * Check if branches form part of 三合
 */
function checkSanhe(branches: string[]): { forms: boolean; element?: ElementName; complete: boolean } {
  for (const [element, frame] of Object.entries(SANHE_FRAMES)) {
    const matches = frame.filter(b => branches.includes(b)).length;
    if (matches >= 2) {
      return {
        forms: true,
        element: element as ElementName,
        complete: matches === 3
      };
    }
  }
  return { forms: false, complete: false };
}

/**
 * Check if two branches clash
 */
function checkClash(branch1: string, branch2: string): boolean {
  for (const [b1, b2] of CLASH_PAIRS) {
    if ((branch1 === b1 && branch2 === b2) || (branch1 === b2 && branch2 === b1)) {
      return true;
    }
  }
  return false;
}

/**
 * Check if two branches form harm
 */
function checkHarm(branch1: string, branch2: string): boolean {
  for (const [b1, b2] of HARM_PAIRS) {
    if ((branch1 === b1 && branch2 === b2) || (branch1 === b2 && branch2 === b1)) {
      return true;
    }
  }
  return false;
}

/**
 * Check if branches form punishment
 */
function checkPunishment(branches: string[]): boolean {
  for (const group of PUNISHMENT_GROUPS) {
    const matches = group.filter(b => branches.includes(b)).length;
    if (matches >= 2 || (group.length === 2 && matches === 2)) {
      return true;
    }
  }
  return false;
}

/**
 * Get tier from score
 */
function getTierFromScore(score: number): EventTier {
  if (score >= 75) return 'strong';
  if (score >= 55) return 'likely';
  if (score >= 35) return 'mild';
  return 'none';
}

// ============================================================================
// LAYER ACTIVATION ANALYSIS
// ============================================================================

/**
 * Analyze timing layer activation against composite chart
 */
export function analyzeLayerActivation(
  layerName: string,
  layerChinese: string,
  timingPillar: TimingPillar,
  composite: CompositeChart
): LayerActivation {
  const activations: string[] = [];
  let score = 50; // Base score
  let usefulGodActive = false;
  let annoyingGodActive = false;
  const shenshaActivated: string[] = [];
  const conflictsTriggered: string[] = [];
  const transformationsActive: string[] = [];

  const timingStemElement = STEM_ELEMENT[timingPillar.stem];
  const timingBranchElement = BRANCH_ELEMENT[timingPillar.branch];

  // 1. Useful God activation
  if (timingStemElement === composite.usefulGod.element ||
      timingBranchElement === composite.usefulGod.element) {
    usefulGodActive = true;
    score += 15;
    activations.push(`Useful God (${composite.usefulGod.element}) activated`);
  }

  // 2. Supporting elements
  if (composite.usefulGod.supportingElements.includes(timingStemElement)) {
    score += 8;
    activations.push(`Supporting element ${timingStemElement} present`);
  }

  // 3. Annoying God check
  if (composite.usefulGod.avoidElements.includes(timingStemElement) ||
      composite.usefulGod.avoidElements.includes(timingBranchElement)) {
    annoyingGodActive = true;
    score -= 12;
    activations.push(`Avoid element activated`);
  }

  // 4. Composite Shen Sha activation
  for (const sha of composite.shenSha) {
    // Check if timing branch matches Shen Sha location patterns
    if (sha.location.includes(timingPillar.branch)) {
      shenshaActivated.push(sha.chineseName);
      if (sha.nature === 'auspicious') {
        score += 10;
        activations.push(`${sha.chineseName} (${sha.name}) activated`);
      } else if (sha.nature === 'inauspicious') {
        score -= 8;
        activations.push(`${sha.chineseName} challenges activated`);
      }
    }
  }

  // 5. Six Combination (六合) with composite Day Branch
  const liuheResult = checkLiuhe(timingPillar.branch, composite.dayPillar.branch);
  if (liuheResult.combines) {
    score += 12;
    transformationsActive.push(`六合 → ${liuheResult.result}`);
    activations.push(`六合 with composite Day Branch → ${liuheResult.result}`);
  }

  // 6. Three Combination (三合) formation
  const compositeBranches = [
    composite.yearPillar.branch,
    composite.monthPillar.branch,
    composite.dayPillar.branch,
    composite.hourPillar.branch
  ];
  const sanheResult = checkSanhe([...compositeBranches, timingPillar.branch]);
  if (sanheResult.forms) {
    const bonus = sanheResult.complete ? 15 : 10;
    score += bonus;
    transformationsActive.push(`三合 ${sanheResult.element}${sanheResult.complete ? ' (complete)' : ''}`);
    activations.push(`三合 ${sanheResult.element} frame ${sanheResult.complete ? 'completed' : 'activated'}`);
  }

  // 7. Clash with composite Day Branch
  if (checkClash(timingPillar.branch, composite.dayPillar.branch)) {
    score -= 15;
    conflictsTriggered.push('冲 (Clash)');
    activations.push(`冲 (Clash) with composite Day Branch`);
  }

  // 8. Harm with composite pillars
  for (const pillarName of ['Year', 'Month', 'Day', 'Hour']) {
    const pillar = composite[`${pillarName.toLowerCase()}Pillar` as keyof CompositeChart] as CompositePillar;
    if (pillar && checkHarm(timingPillar.branch, pillar.branch)) {
      score -= 8;
      conflictsTriggered.push(`害 (Harm) - ${pillarName}`);
      activations.push(`害 (Harm) with composite ${pillarName} Branch`);
      break; // Count once
    }
  }

  // 9. Punishment check
  if (checkPunishment([...compositeBranches, timingPillar.branch])) {
    score -= 10;
    conflictsTriggered.push('刑 (Punishment)');
    activations.push(`刑 (Punishment) pattern triggered`);
  }

  // 10. DM strength support
  const dmElement = composite.dayMaster.element;
  const producerElement = Object.entries(ELEMENT_PRODUCES).find(([_, prod]) => prod === dmElement)?.[0] as ElementName | undefined;

  if (composite.dayMaster.strengthCategory === 'weak' || composite.dayMaster.strengthCategory === 'very_weak') {
    // Weak DM benefits from resource/friend
    if (timingStemElement === dmElement || timingStemElement === producerElement) {
      score += 8;
      activations.push(`Timing supports weak composite DM`);
    }
  } else if (composite.dayMaster.strengthCategory === 'strong' || composite.dayMaster.strengthCategory === 'very_strong') {
    // Strong DM benefits from output/wealth
    const outputElement = ELEMENT_PRODUCES[dmElement];
    const wealthElement = ELEMENT_CONTROLS[dmElement];
    if (timingStemElement === outputElement || timingStemElement === wealthElement) {
      score += 8;
      activations.push(`Timing channels strong composite DM`);
    }
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  return {
    layer: layerName,
    layerChinese,
    pillar: `${timingPillar.stem}${timingPillar.branch}`,
    activations,
    score,
    usefulGodActive,
    annoyingGodActive,
    shenshaActivated,
    conflictsTriggered,
    transformationsActive
  };
}

// ============================================================================
// SYNASTRY RESONANCE ANALYSIS
// ============================================================================

/**
 * Analyze synastry resonance for timing
 */
export function analyzeSynastryResonance(
  synastry: SynastryHeatmap,
  timingPillar: TimingPillar
): SynastryResonanceResult {
  let overallResonance = synastry.overallScore;
  let dayDayHarmony = 0;
  let dayMonthHarmony = 0;
  let yearYearTension = 0;
  let monthMonthHarmony = 0;
  const karmicHits: string[] = [];
  let romanticActivation = false;

  // Flatten grid for analysis
  const flatGrid = synastry.grid.flat();

  // Find specific cell interactions
  for (const cell of flatGrid) {
    // Day-Day interaction
    if (cell.aPillar === 'Day' && cell.bPillar === 'Day') {
      dayDayHarmony = cell.normalizedScore;
    }
    // Day-Month interactions
    if ((cell.aPillar === 'Day' && cell.bPillar === 'Month') ||
        (cell.aPillar === 'Month' && cell.bPillar === 'Day')) {
      dayMonthHarmony = Math.max(dayMonthHarmony, cell.normalizedScore);
    }
    // Year-Year tension
    if (cell.aPillar === 'Year' && cell.bPillar === 'Year') {
      if (cell.normalizedScore < 0) {
        yearYearTension = Math.abs(cell.normalizedScore);
      }
    }
    // Month-Month harmony
    if (cell.aPillar === 'Month' && cell.bPillar === 'Month') {
      monthMonthHarmony = cell.normalizedScore;
    }

    // Check for karmic hits (clash + harmony in same chart)
    const hasClash = cell.interactions.some(i => i.type === 'clash');
    const hasHarmony = cell.interactions.some(i => i.type === 'liuhe' || i.type === 'sanhe');
    if (hasClash && hasHarmony) {
      karmicHits.push(`${cell.aPillar}-${cell.bPillar} karmic pattern`);
    }

    // Check for romantic activation
    const hasRomantic = cell.interactions.some(i =>
      i.type === 'peach_blossom' || i.type === 'red_matchmaker'
    );
    if (hasRomantic) {
      romanticActivation = true;
    }
  }

  // Adjust resonance based on timing pillar
  // If there are romance hotspots in synastry, boost resonance
  if (synastry.romanceHotspots.length > 0) {
    overallResonance += 10;
    romanticActivation = true;
  }

  return {
    overallResonance: Math.max(0, Math.min(100, overallResonance)),
    dayDayHarmony,
    dayMonthHarmony,
    yearYearTension,
    monthMonthHarmony,
    karmicHits,
    romanticActivation
  };
}

// ============================================================================
// PARTNER CONVERGENCE ANALYSIS
// ============================================================================

/**
 * Analyze partner timing convergence
 */
export function analyzePartnerConvergence(
  partnerA: PartnerTimingContext,
  partnerB: PartnerTimingContext
): PartnerConvergence {
  const divergenceAreas: string[] = [];
  const synergyAreas: string[] = [];

  // Check if both favorable
  const bothFavorable =
    (partnerA.favorableTier === 'excellent' || partnerA.favorableTier === 'good') &&
    (partnerB.favorableTier === 'excellent' || partnerB.favorableTier === 'good');

  // Check relationship scores
  const bothRelationshipHigh =
    partnerA.relationshipScore >= 65 && partnerB.relationshipScore >= 65;

  // Calculate convergence score
  let convergenceScore = 50;

  // Both favorable bonus
  if (bothFavorable) {
    convergenceScore += 20;
    synergyAreas.push('Both partners in favorable timing');
  }

  // Both relationship high
  if (bothRelationshipHigh) {
    convergenceScore += 15;
    synergyAreas.push('Both partners have high relationship energy');
  }

  // Useful God alignment
  if (partnerA.usefulGodActive && partnerB.usefulGodActive) {
    convergenceScore += 10;
    synergyAreas.push('Both partners\' Useful Gods active');
  }

  // Check for divergence
  const overallDiff = Math.abs(partnerA.overallScore - partnerB.overallScore);
  if (overallDiff > 30) {
    convergenceScore -= 15;
    divergenceAreas.push(`Overall timing gap: ${Math.round(overallDiff)} points`);
  }

  const relationshipDiff = Math.abs(partnerA.relationshipScore - partnerB.relationshipScore);
  if (relationshipDiff > 25) {
    convergenceScore -= 10;
    divergenceAreas.push(`Relationship timing gap: ${Math.round(relationshipDiff)} points`);
  }

  // Annoying God conflicts
  if (partnerA.annoyingGodActive && partnerB.annoyingGodActive) {
    convergenceScore -= 15;
    divergenceAreas.push('Both partners facing challenges');
  }

  // Health concerns
  if (partnerA.healthScore < 40 || partnerB.healthScore < 40) {
    convergenceScore -= 10;
    divergenceAreas.push('Health timing concerns for one partner');
  }

  return {
    bothFavorable,
    bothRelationshipHigh,
    convergenceScore: Math.max(0, Math.min(100, convergenceScore)),
    divergenceAreas,
    synergyAreas
  };
}

// ============================================================================
// EVENT TYPE SCORING
// ============================================================================

/**
 * Score relationship event type
 */
function scoreRelationshipEvent(
  layerActivations: LayerActivation[],
  synastryResonance: SynastryResonanceResult,
  partnerConvergence: PartnerConvergence,
  composite: CompositeChart
): EventTypeAnalysis {
  let score = 40; // Base
  const factors: string[] = [];

  // Useful God activation across layers
  const usefulGodLayers = layerActivations.filter(l => l.usefulGodActive).length;
  if (usefulGodLayers >= 2) {
    score += 15;
    factors.push(`Useful God active in ${usefulGodLayers} layers`);
  }

  // Romantic Shen Sha
  const romanticShensha = composite.shenSha.filter(s =>
    ROMANTIC_SHENSHA.includes(s.chineseName)
  );
  if (romanticShensha.length > 0) {
    score += romanticShensha.length * 10;
    factors.push(`Romantic Shen Sha: ${romanticShensha.map(s => s.chineseName).join(', ')}`);
  }

  // Synastry resonance
  if (synastryResonance.romanticActivation) {
    score += 15;
    factors.push('Romantic activation in synastry');
  }
  if (synastryResonance.dayDayHarmony > 50) {
    score += 10;
    factors.push('Day-Day harmony strong');
  }

  // Partner convergence
  if (partnerConvergence.bothRelationshipHigh) {
    score += 12;
    factors.push('Both partners high relationship energy');
  }

  // 六合 with Day Branch
  const hasLiuhe = layerActivations.some(l =>
    l.transformationsActive.some(t => t.includes('六合'))
  );
  if (hasLiuhe) {
    score += 10;
    factors.push('六合 transformation with Day Branch');
  }

  // Conflicts reduce score
  const totalConflicts = layerActivations.reduce(
    (sum, l) => sum + l.conflictsTriggered.length, 0
  );
  if (totalConflicts > 0) {
    score -= totalConflicts * 5;
    factors.push(`${totalConflicts} conflict(s) present`);
  }

  score = Math.max(0, Math.min(100, score));

  return {
    type: 'relationship',
    typeChinese: EVENT_TYPE_CHINESE.relationship,
    score,
    tier: getTierFromScore(score),
    activationFactors: factors,
    likelihood: score,
    peakWindow: score >= 60 ? 'Active' : 'Dormant',
    interpretation: buildRelationshipInterpretation(score, factors)
  };
}

/**
 * Score growth event type
 */
function scoreGrowthEvent(
  layerActivations: LayerActivation[],
  synastryResonance: SynastryResonanceResult,
  partnerConvergence: PartnerConvergence,
  composite: CompositeChart
): EventTypeAnalysis {
  let score = 40;
  const factors: string[] = [];

  // Output/Wealth Ten Gods in composite
  const hasOutputWealth =
    composite.tenGods.eatingGod !== null ||
    composite.tenGods.hurtingOfficer !== null ||
    composite.tenGods.directWealth !== null ||
    composite.tenGods.indirectWealth !== null;

  if (hasOutputWealth) {
    score += 10;
    factors.push('Output/Wealth Ten Gods present in composite');
  }

  // Useful God = Fire/Wood (growth elements)
  if (composite.usefulGod.element === 'Fire' || composite.usefulGod.element === 'Wood') {
    const usefulActive = layerActivations.filter(l => l.usefulGodActive).length;
    if (usefulActive > 0) {
      score += usefulActive * 8;
      factors.push(`Growth Useful God (${composite.usefulGod.element}) active`);
    }
  }

  // 三合 formations
  const sanheCount = layerActivations.reduce(
    (sum, l) => sum + l.transformationsActive.filter(t => t.includes('三合')).length, 0
  );
  if (sanheCount > 0) {
    score += sanheCount * 10;
    factors.push(`${sanheCount} 三合 formation(s)`);
  }

  // Month-Month synastry harmony
  if (synastryResonance.monthMonthHarmony > 30) {
    score += 10;
    factors.push('Month-Month harmony supports shared projects');
  }

  // Partner convergence in wealth/career
  if (partnerConvergence.bothFavorable) {
    score += 12;
    factors.push('Both partners in favorable timing for growth');
  }

  // Academic Star
  const hasAcademic = composite.shenSha.some(s => s.chineseName === '文昌');
  if (hasAcademic) {
    score += 8;
    factors.push('Academic Star supports learning growth');
  }

  score = Math.max(0, Math.min(100, score));

  return {
    type: 'growth',
    typeChinese: EVENT_TYPE_CHINESE.growth,
    score,
    tier: getTierFromScore(score),
    activationFactors: factors,
    likelihood: score,
    peakWindow: score >= 60 ? 'Active' : 'Dormant',
    interpretation: buildGrowthInterpretation(score, factors)
  };
}

/**
 * Score challenge event type
 */
function scoreChallengeEvent(
  layerActivations: LayerActivation[],
  synastryResonance: SynastryResonanceResult,
  partnerConvergence: PartnerConvergence,
  composite: CompositeChart
): EventTypeAnalysis {
  let score = 30; // Lower base for challenges
  const factors: string[] = [];

  // Annoying God activation
  const annoyingLayers = layerActivations.filter(l => l.annoyingGodActive).length;
  if (annoyingLayers > 0) {
    score += annoyingLayers * 12;
    factors.push(`Avoid elements active in ${annoyingLayers} layer(s)`);
  }

  // Conflicts
  const totalConflicts = layerActivations.reduce(
    (sum, l) => sum + l.conflictsTriggered.length, 0
  );
  if (totalConflicts > 0) {
    score += totalConflicts * 10;
    factors.push(`${totalConflicts} conflict pattern(s) triggered`);
  }

  // Synastry tension
  if (synastryResonance.yearYearTension > 30) {
    score += 12;
    factors.push('Year-Year tension in synastry');
  }

  // Karmic hits (conflict + harmony = challenging growth)
  if (synastryResonance.karmicHits.length > 0) {
    score += synastryResonance.karmicHits.length * 8;
    factors.push(`Karmic patterns: ${synastryResonance.karmicHits.join(', ')}`);
  }

  // Partner divergence
  if (partnerConvergence.divergenceAreas.length > 0) {
    score += partnerConvergence.divergenceAreas.length * 5;
    factors.push(`Partner divergence in ${partnerConvergence.divergenceAreas.length} area(s)`);
  }

  // Inauspicious Shen Sha
  const challengingShensha = composite.shenSha.filter(s => s.nature === 'inauspicious');
  if (challengingShensha.length > 0) {
    score += challengingShensha.length * 8;
    factors.push(`Challenging Shen Sha: ${challengingShensha.map(s => s.chineseName).join(', ')}`);
  }

  // Weak composite DM under pressure
  if (composite.dayMaster.strengthCategory === 'weak' ||
      composite.dayMaster.strengthCategory === 'very_weak') {
    if (annoyingLayers > 0 || totalConflicts > 0) {
      score += 10;
      factors.push('Weak composite DM under pressure');
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    type: 'challenge',
    typeChinese: EVENT_TYPE_CHINESE.challenge,
    score,
    tier: getTierFromScore(score),
    activationFactors: factors,
    likelihood: score,
    peakWindow: score >= 50 ? 'Active' : 'Dormant',
    interpretation: buildChallengeInterpretation(score, factors)
  };
}

/**
 * Score destiny event type
 */
function scoreDestinyEvent(
  layerActivations: LayerActivation[],
  synastryResonance: SynastryResonanceResult,
  partnerConvergence: PartnerConvergence,
  composite: CompositeChart
): EventTypeAnalysis {
  let score = 35;
  const factors: string[] = [];

  // Noble Shen Sha
  const nobleShensha = composite.shenSha.filter(s =>
    NOBLE_SHENSHA.includes(s.chineseName) || ROMANTIC_SHENSHA.includes(s.chineseName)
  );

  // Check for activated Shen Sha across layers
  const activatedShensha = new Set<string>();
  for (const layer of layerActivations) {
    for (const sha of layer.shenshaActivated) {
      activatedShensha.add(sha);
    }
  }

  const noblesActivated = nobleShensha.filter(s =>
    activatedShensha.has(s.chineseName)
  );

  if (noblesActivated.length > 0) {
    score += noblesActivated.length * 12;
    factors.push(`Noble/Romantic Shen Sha activated: ${noblesActivated.map(s => s.chineseName).join(', ')}`);
  }

  // Karmic resonance (clash + harmony simultaneously)
  if (synastryResonance.karmicHits.length > 0) {
    score += 15;
    factors.push('Karmic resonance pattern detected');
  }

  // Partner convergence at high level
  if (partnerConvergence.convergenceScore >= 70) {
    score += 12;
    factors.push('Strong partner timing convergence');
  }

  // Both partners' event triggers high (simulated by overall scores)
  if (partnerConvergence.bothFavorable && partnerConvergence.bothRelationshipHigh) {
    score += 15;
    factors.push('Both partners in peak relationship timing');
  }

  // Luck pillar favorability
  const hasExcellentLuck = composite.luckPillars.some(p => p.favorability === 'excellent');
  if (hasExcellentLuck) {
    score += 10;
    factors.push('Excellent luck pillar period');
  }

  // Multiple transformations
  const totalTransformations = layerActivations.reduce(
    (sum, l) => sum + l.transformationsActive.length, 0
  );
  if (totalTransformations >= 2) {
    score += 10;
    factors.push(`${totalTransformations} elemental transformations`);
  }

  score = Math.max(0, Math.min(100, score));

  return {
    type: 'destiny',
    typeChinese: EVENT_TYPE_CHINESE.destiny,
    score,
    tier: getTierFromScore(score),
    activationFactors: factors,
    likelihood: score,
    peakWindow: score >= 65 ? 'Active' : 'Dormant',
    interpretation: buildDestinyInterpretation(score, factors)
  };
}

// ============================================================================
// INTERPRETATION BUILDERS
// ============================================================================

function buildRelationshipInterpretation(score: number, factors: string[]): string {
  if (score >= 75) {
    return 'A powerful window for emotional breakthroughs, deepening commitment, or romantic milestones. The relationship energy is strongly activated.';
  } else if (score >= 55) {
    return 'Favorable conditions for relationship growth and emotional connection. Good timing for important conversations or commitments.';
  } else if (score >= 35) {
    return 'Moderate relationship energy. Steady connection but not peak timing for major moves.';
  } else {
    return 'Relationship energy is quiet. Focus on maintaining existing connection rather than major changes.';
  }
}

function buildGrowthInterpretation(score: number, factors: string[]): string {
  if (score >= 75) {
    return 'Excellent window for shared projects, creative endeavors, or expansion. The relationship supports mutual growth powerfully.';
  } else if (score >= 55) {
    return 'Good conditions for building together. Shared projects and creative collaboration are favored.';
  } else if (score >= 35) {
    return 'Moderate growth energy. Progress is possible but may require more effort.';
  } else {
    return 'Growth energy is low. Focus on consolidation rather than expansion.';
  }
}

function buildChallengeInterpretation(score: number, factors: string[]): string {
  if (score >= 75) {
    return 'Significant challenges may surface. This is a testing period requiring patience, communication, and mutual support. Avoid major decisions.';
  } else if (score >= 55) {
    return 'Some friction or challenges present. Navigate with care and open communication.';
  } else if (score >= 35) {
    return 'Minor challenges possible but manageable. Stay aware but not alarmed.';
  } else {
    return 'Challenge energy is low. The relationship is relatively stable.';
  }
}

function buildDestinyInterpretation(score: number, factors: string[]): string {
  if (score >= 75) {
    return 'A fated window where major turning points or destiny-level events may occur. Pay attention to significant meetings, opportunities, or realizations.';
  } else if (score >= 55) {
    return 'Destiny currents are active. The relationship may experience meaningful synchronicities or path-defining moments.';
  } else if (score >= 35) {
    return 'Destiny energy is present but subtle. Stay open to meaningful coincidences.';
  } else {
    return 'Destiny energy is quiet. Focus on conscious creation rather than waiting for fate.';
  }
}

// ============================================================================
// MAIN COMPUTATION FUNCTION
// ============================================================================

/**
 * Compute composite event trigger for a specific timing
 */
export function computeCompositeEventTrigger(
  composite: CompositeChart,
  synastry: SynastryHeatmap,
  partnerA: PartnerTimingContext,
  partnerB: PartnerTimingContext,
  timingPillar: TimingPillar,
  timeUnit: string,
  timeUnitChinese: string
): CompositeEventTriggerResult {
  // Analyze layer activation
  const layerActivation = analyzeLayerActivation(
    timeUnit, timeUnitChinese, timingPillar, composite
  );

  // Analyze synastry resonance
  const synastryResonance = analyzeSynastryResonance(synastry, timingPillar);

  // Analyze partner convergence
  const partnerConvergence = analyzePartnerConvergence(partnerA, partnerB);

  // Score each event type
  const layers = [layerActivation];
  const relationshipEvent = scoreRelationshipEvent(layers, synastryResonance, partnerConvergence, composite);
  const growthEvent = scoreGrowthEvent(layers, synastryResonance, partnerConvergence, composite);
  const challengeEvent = scoreChallengeEvent(layers, synastryResonance, partnerConvergence, composite);
  const destinyEvent = scoreDestinyEvent(layers, synastryResonance, partnerConvergence, composite);

  // Calculate overall score (weighted by event types)
  const overallScore = Math.round(
    relationshipEvent.score * 0.30 +
    growthEvent.score * 0.25 +
    (100 - challengeEvent.score) * 0.25 + // Invert challenge for overall positivity
    destinyEvent.score * 0.20
  );

  // Determine dominant event
  const eventScores = [
    { type: 'relationship' as CompositeEventType, score: relationshipEvent.score },
    { type: 'growth' as CompositeEventType, score: growthEvent.score },
    { type: 'challenge' as CompositeEventType, score: challengeEvent.score },
    { type: 'destiny' as CompositeEventType, score: destinyEvent.score }
  ];
  eventScores.sort((a, b) => b.score - a.score);
  const dominantEvent = eventScores[0].type;

  // Collect activations
  const usefulGodActivations = layerActivation.usefulGodActive
    ? [`${timeUnit}: Useful God active`]
    : [];
  const shenshaActivations = layerActivation.shenshaActivated.map(s => `${timeUnit}: ${s}`);
  const conflictActivations = layerActivation.conflictsTriggered.map(c => `${timeUnit}: ${c}`);
  const transformationActivations = layerActivation.transformationsActive.map(t => `${timeUnit}: ${t}`);

  // Build summary
  const summary = buildEventSummary(
    overallScore, dominantEvent, relationshipEvent, challengeEvent
  );

  // Build interpretation
  const interpretation = buildOverallInterpretation(
    dominantEvent, relationshipEvent, growthEvent, challengeEvent, destinyEvent
  );

  // Build recommendations
  const recommendations = buildRecommendations(
    dominantEvent, relationshipEvent, challengeEvent, partnerConvergence
  );

  return {
    overallScore,
    overallTier: getTierFromScore(overallScore),
    relationshipEvent,
    growthEvent,
    challengeEvent,
    destinyEvent,
    dominantEvent,
    dominantEventChinese: EVENT_TYPE_CHINESE[dominantEvent],
    layers: [layerActivation],
    synastryResonance,
    partnerConvergence,
    usefulGodActivations,
    shenshaActivations,
    conflictActivations,
    transformationActivations,
    summary,
    interpretation,
    recommendations,
    timeUnit,
    pillarDisplay: `${timingPillar.stem}${timingPillar.branch}`,
    computedAt: new Date().toISOString()
  };
}

/**
 * Build event summary
 */
function buildEventSummary(
  score: number,
  dominant: CompositeEventType,
  relationship: EventTypeAnalysis,
  challenge: EventTypeAnalysis
): string {
  const tier = getTierFromScore(score);
  const tierText = tier === 'strong' ? 'Strong' :
                   tier === 'likely' ? 'Favorable' :
                   tier === 'mild' ? 'Moderate' : 'Quiet';

  let summary = `${tierText} composite event window. `;

  if (dominant === 'relationship') {
    summary += 'Primary energy: relationship deepening and emotional connection.';
  } else if (dominant === 'growth') {
    summary += 'Primary energy: shared growth and creative expansion.';
  } else if (dominant === 'challenge') {
    summary += 'Primary energy: testing and transformation through challenge.';
  } else {
    summary += 'Primary energy: destiny currents and fated developments.';
  }

  if (challenge.score >= 60) {
    summary += ' Note: challenges are also active.';
  }

  return summary;
}

/**
 * Build overall interpretation
 */
function buildOverallInterpretation(
  dominant: CompositeEventType,
  relationship: EventTypeAnalysis,
  growth: EventTypeAnalysis,
  challenge: EventTypeAnalysis,
  destiny: EventTypeAnalysis
): string {
  const parts: string[] = [];

  // Lead with dominant
  if (dominant === 'relationship' && relationship.score >= 55) {
    parts.push(relationship.interpretation);
  } else if (dominant === 'growth' && growth.score >= 55) {
    parts.push(growth.interpretation);
  } else if (dominant === 'challenge' && challenge.score >= 55) {
    parts.push(challenge.interpretation);
  } else if (dominant === 'destiny' && destiny.score >= 55) {
    parts.push(destiny.interpretation);
  }

  // Add notable secondaries
  if (dominant !== 'relationship' && relationship.score >= 65) {
    parts.push('Relationship energy is also strong.');
  }
  if (dominant !== 'destiny' && destiny.score >= 65) {
    parts.push('Destiny currents may bring meaningful developments.');
  }
  if (dominant !== 'challenge' && challenge.score >= 70) {
    parts.push('Be aware of potential friction requiring attention.');
  }

  return parts.join(' ');
}

/**
 * Build recommendations
 */
function buildRecommendations(
  dominant: CompositeEventType,
  relationship: EventTypeAnalysis,
  challenge: EventTypeAnalysis,
  convergence: PartnerConvergence
): string[] {
  const recs: string[] = [];

  if (dominant === 'relationship' && relationship.score >= 60) {
    recs.push('Good timing for important relationship conversations');
    recs.push('Consider meaningful gestures or commitments');
  }

  if (dominant === 'growth') {
    recs.push('Start or advance shared projects');
    recs.push('Plan creative collaborations');
  }

  if (dominant === 'destiny') {
    recs.push('Stay open to significant meetings or opportunities');
    recs.push('Pay attention to synchronicities');
  }

  if (challenge.score >= 60) {
    recs.push('Practice patience and clear communication');
    recs.push('Avoid major decisions during conflict peaks');
  }

  if (convergence.divergenceAreas.length > 0) {
    recs.push('Address areas of partner timing divergence');
  }

  if (convergence.synergyAreas.length > 0) {
    recs.push('Leverage partner synergy for joint endeavors');
  }

  return recs.slice(0, 5);
}

// ============================================================================
// COMPREHENSIVE ANALYSIS
// ============================================================================

/**
 * Compute comprehensive composite event analysis across all time layers
 */
export function computeComprehensiveCompositeEvent(
  composite: CompositeChart,
  synastry: SynastryHeatmap,
  partnerA: PartnerTimingContext,
  partnerB: PartnerTimingContext,
  luckPillar?: TimingPillar,
  annual?: TimingPillar,
  monthly?: TimingPillar,
  daily?: TimingPillar,
  hourly?: TimingPillar
): ComprehensiveCompositeEventResult {
  // Compute each layer
  const luckPillarResult = luckPillar
    ? computeCompositeEventTrigger(composite, synastry, partnerA, partnerB, luckPillar, 'luckPillar', '大运')
    : null;

  const annualResult = annual
    ? computeCompositeEventTrigger(composite, synastry, partnerA, partnerB, annual, 'annual', '流年')
    : null;

  const monthlyResult = monthly
    ? computeCompositeEventTrigger(composite, synastry, partnerA, partnerB, monthly, 'monthly', '流月')
    : null;

  const dailyResult = daily
    ? computeCompositeEventTrigger(composite, synastry, partnerA, partnerB, daily, 'daily', '流日')
    : null;

  const hourlyResult = hourly
    ? computeCompositeEventTrigger(composite, synastry, partnerA, partnerB, hourly, 'hourly', '流时')
    : null;

  // Calculate combined score
  const results = [luckPillarResult, annualResult, monthlyResult, dailyResult, hourlyResult].filter(Boolean) as CompositeEventTriggerResult[];

  let combinedScore = 0;
  const weights = ['luckPillar', 'annual', 'monthly', 'daily', 'hourly'];

  for (const result of results) {
    const weight = LAYER_WEIGHTS[result.timeUnit] || 0.2;
    combinedScore += result.overallScore * weight;
  }

  // Normalize if not all layers present
  const totalWeight = results.reduce((sum, r) => sum + (LAYER_WEIGHTS[r.timeUnit] || 0.2), 0);
  if (totalWeight > 0 && totalWeight < 1) {
    combinedScore = combinedScore / totalWeight;
  }

  combinedScore = Math.round(combinedScore);

  // Determine dominant event type across all layers
  const eventTypeTotals: Record<CompositeEventType, number> = {
    relationship: 0,
    growth: 0,
    challenge: 0,
    destiny: 0
  };

  for (const result of results) {
    eventTypeTotals.relationship += result.relationshipEvent.score;
    eventTypeTotals.growth += result.growthEvent.score;
    eventTypeTotals.challenge += result.challengeEvent.score;
    eventTypeTotals.destiny += result.destinyEvent.score;
  }

  const dominantEventType = (Object.entries(eventTypeTotals) as [CompositeEventType, number][])
    .sort((a, b) => b[1] - a[1])[0][0];

  // Find peak windows
  const relationshipPeakWindows = results
    .filter(r => r.relationshipEvent.tier === 'strong' || r.relationshipEvent.tier === 'likely')
    .map(r => r.timeUnit);

  const growthPeakWindows = results
    .filter(r => r.growthEvent.tier === 'strong' || r.growthEvent.tier === 'likely')
    .map(r => r.timeUnit);

  const challengeWindows = results
    .filter(r => r.challengeEvent.tier === 'strong' || r.challengeEvent.tier === 'likely')
    .map(r => r.timeUnit);

  const destinyWindows = results
    .filter(r => r.destinyEvent.tier === 'strong' || r.destinyEvent.tier === 'likely')
    .map(r => r.timeUnit);

  // Build overall summary
  const overallSummary = buildOverallSummary(
    combinedScore, dominantEventType, relationshipPeakWindows, challengeWindows
  );

  // Build overall interpretation
  const overallInterpretation = buildComprehensiveInterpretation(
    results, dominantEventType, combinedScore
  );

  // Consolidate recommendations
  const allRecommendations = new Set<string>();
  for (const result of results) {
    result.recommendations.forEach(r => allRecommendations.add(r));
  }

  return {
    luckPillar: luckPillarResult,
    annual: annualResult,
    monthly: monthlyResult,
    daily: dailyResult,
    hourly: hourlyResult,
    combinedScore,
    combinedTier: getTierFromScore(combinedScore),
    dominantEventType,
    relationshipPeakWindows,
    growthPeakWindows,
    challengeWindows,
    destinyWindows,
    overallSummary,
    overallInterpretation,
    keyRecommendations: Array.from(allRecommendations).slice(0, 6)
  };
}

/**
 * Build overall summary
 */
function buildOverallSummary(
  score: number,
  dominant: CompositeEventType,
  relationshipPeaks: string[],
  challengeWindows: string[]
): string {
  const tier = getTierFromScore(score);

  let summary = `Combined composite event score: ${score}/100 (${tier}). `;
  summary += `Dominant energy: ${EVENT_TYPE_CHINESE[dominant]} (${dominant}). `;

  if (relationshipPeaks.length > 0) {
    summary += `Relationship peaks in: ${relationshipPeaks.join(', ')}. `;
  }

  if (challengeWindows.length > 0) {
    summary += `Challenge windows in: ${challengeWindows.join(', ')}.`;
  }

  return summary;
}

/**
 * Build comprehensive interpretation
 */
function buildComprehensiveInterpretation(
  results: CompositeEventTriggerResult[],
  dominant: CompositeEventType,
  score: number
): string {
  const parts: string[] = [];

  if (score >= 70) {
    parts.push('This is a significant timing window for the relationship.');
  } else if (score >= 50) {
    parts.push('This is a moderately active timing window.');
  } else {
    parts.push('This is a quieter timing period.');
  }

  if (dominant === 'relationship') {
    parts.push('Emotional connection and bonding energy lead. Good for deepening intimacy.');
  } else if (dominant === 'growth') {
    parts.push('Shared growth and expansion energy lead. Good for joint projects.');
  } else if (dominant === 'challenge') {
    parts.push('Testing energy is prominent. Focus on communication and patience.');
  } else {
    parts.push('Destiny currents are active. Stay open to meaningful developments.');
  }

  // Add layer-specific notes
  const strongLayers = results.filter(r => r.overallTier === 'strong');
  if (strongLayers.length > 0) {
    parts.push(`Strong activation in: ${strongLayers.map(l => l.timeUnit).join(', ')}.`);
  }

  return parts.join(' ');
}

// ============================================================================
// STORY FORMATTERS
// ============================================================================

/**
 * Format composite event trigger as narrative story
 */
export function formatCompositeEventTriggerStory(result: CompositeEventTriggerResult): string {
  const lines: string[] = [];

  lines.push(`## Composite Event Trigger (合盘应期)`);
  lines.push(`### ${result.timeUnit} — ${result.pillarDisplay}`);
  lines.push('');

  // Overall score
  lines.push(`**Overall Score:** ${result.overallScore}/100 (${result.overallTier})`);
  lines.push(`**Dominant Event:** ${result.dominantEventChinese} (${result.dominantEvent})`);
  lines.push('');

  // Event types
  lines.push(`### Event Type Analysis`);
  lines.push('');

  const events = [
    result.relationshipEvent,
    result.growthEvent,
    result.challengeEvent,
    result.destinyEvent
  ];

  for (const event of events) {
    const icon = event.tier === 'strong' ? '★' :
                 event.tier === 'likely' ? '☆' :
                 event.tier === 'mild' ? '○' : '·';
    lines.push(`**${icon} ${event.typeChinese}** (${event.type}) — Score: ${event.score} (${event.tier})`);
    if (event.activationFactors.length > 0) {
      lines.push(`  Factors: ${event.activationFactors.slice(0, 3).join('; ')}`);
    }
    lines.push('');
  }

  // Activations
  if (result.usefulGodActivations.length > 0 ||
      result.shenshaActivations.length > 0 ||
      result.transformationActivations.length > 0) {
    lines.push(`### Activations`);
    lines.push('');

    if (result.usefulGodActivations.length > 0) {
      lines.push(`**Useful God:** ${result.usefulGodActivations.join(', ')}`);
    }
    if (result.shenshaActivations.length > 0) {
      lines.push(`**Shen Sha:** ${result.shenshaActivations.join(', ')}`);
    }
    if (result.transformationActivations.length > 0) {
      lines.push(`**Transformations:** ${result.transformationActivations.join(', ')}`);
    }
    if (result.conflictActivations.length > 0) {
      lines.push(`**Conflicts:** ${result.conflictActivations.join(', ')}`);
    }
    lines.push('');
  }

  // Partner & Synastry
  lines.push(`### Partner Convergence`);
  lines.push(`Score: ${result.partnerConvergence.convergenceScore}/100`);
  if (result.partnerConvergence.synergyAreas.length > 0) {
    lines.push(`Synergy: ${result.partnerConvergence.synergyAreas.join('; ')}`);
  }
  if (result.partnerConvergence.divergenceAreas.length > 0) {
    lines.push(`Divergence: ${result.partnerConvergence.divergenceAreas.join('; ')}`);
  }
  lines.push('');

  // Interpretation
  lines.push(`### Interpretation`);
  lines.push(result.interpretation);
  lines.push('');

  // Recommendations
  if (result.recommendations.length > 0) {
    lines.push(`### Recommendations`);
    for (const rec of result.recommendations) {
      lines.push(`- ${rec}`);
    }
  }

  return lines.join('\n');
}

/**
 * Format comprehensive result as story
 */
export function formatComprehensiveCompositeEventStory(
  result: ComprehensiveCompositeEventResult
): string {
  const lines: string[] = [];

  lines.push(`## Comprehensive Composite Event Analysis (合盘应期综合分析)`);
  lines.push('');

  // Overall
  lines.push(`**Combined Score:** ${result.combinedScore}/100 (${result.combinedTier})`);
  lines.push(`**Dominant Event Type:** ${EVENT_TYPE_CHINESE[result.dominantEventType]} (${result.dominantEventType})`);
  lines.push('');

  // Peak windows
  if (result.relationshipPeakWindows.length > 0) {
    lines.push(`**Relationship Peaks:** ${result.relationshipPeakWindows.join(', ')}`);
  }
  if (result.growthPeakWindows.length > 0) {
    lines.push(`**Growth Peaks:** ${result.growthPeakWindows.join(', ')}`);
  }
  if (result.destinyWindows.length > 0) {
    lines.push(`**Destiny Windows:** ${result.destinyWindows.join(', ')}`);
  }
  if (result.challengeWindows.length > 0) {
    lines.push(`**Challenge Windows:** ${result.challengeWindows.join(', ')}`);
  }
  lines.push('');

  // Layer summaries
  lines.push(`### Layer Analysis`);
  lines.push('');

  const layers = [
    { name: '大运 (Luck Pillar)', result: result.luckPillar },
    { name: '流年 (Annual)', result: result.annual },
    { name: '流月 (Monthly)', result: result.monthly },
    { name: '流日 (Daily)', result: result.daily },
    { name: '流时 (Hourly)', result: result.hourly }
  ];

  for (const layer of layers) {
    if (layer.result) {
      const r = layer.result;
      lines.push(`**${layer.name}** — ${r.pillarDisplay}`);
      lines.push(`  Score: ${r.overallScore} | Dominant: ${r.dominantEventChinese}`);
      lines.push('');
    }
  }

  // Interpretation
  lines.push(`### Overall Interpretation`);
  lines.push(result.overallInterpretation);
  lines.push('');

  // Recommendations
  if (result.keyRecommendations.length > 0) {
    lines.push(`### Key Recommendations`);
    for (const rec of result.keyRecommendations) {
      lines.push(`- ${rec}`);
    }
  }

  return lines.join('\n');
}

/**
 * Format for UI display
 */
export function formatCompositeEventForUI(result: CompositeEventTriggerResult): {
  overall: { score: number; tier: string; dominant: string; dominantChinese: string };
  events: Array<{ type: string; chinese: string; score: number; tier: string; interpretation: string }>;
  activations: { usefulGod: string[]; shensha: string[]; transformations: string[]; conflicts: string[] };
  convergence: { score: number; synergy: string[]; divergence: string[] };
  summary: string;
  recommendations: string[];
} {
  return {
    overall: {
      score: result.overallScore,
      tier: result.overallTier,
      dominant: result.dominantEvent,
      dominantChinese: result.dominantEventChinese
    },
    events: [
      {
        type: 'relationship',
        chinese: result.relationshipEvent.typeChinese,
        score: result.relationshipEvent.score,
        tier: result.relationshipEvent.tier,
        interpretation: result.relationshipEvent.interpretation
      },
      {
        type: 'growth',
        chinese: result.growthEvent.typeChinese,
        score: result.growthEvent.score,
        tier: result.growthEvent.tier,
        interpretation: result.growthEvent.interpretation
      },
      {
        type: 'challenge',
        chinese: result.challengeEvent.typeChinese,
        score: result.challengeEvent.score,
        tier: result.challengeEvent.tier,
        interpretation: result.challengeEvent.interpretation
      },
      {
        type: 'destiny',
        chinese: result.destinyEvent.typeChinese,
        score: result.destinyEvent.score,
        tier: result.destinyEvent.tier,
        interpretation: result.destinyEvent.interpretation
      }
    ],
    activations: {
      usefulGod: result.usefulGodActivations,
      shensha: result.shenshaActivations,
      transformations: result.transformationActivations,
      conflicts: result.conflictActivations
    },
    convergence: {
      score: result.partnerConvergence.convergenceScore,
      synergy: result.partnerConvergence.synergyAreas,
      divergence: result.partnerConvergence.divergenceAreas
    },
    summary: result.summary,
    recommendations: result.recommendations
  };
}

// All functions are exported inline with 'export' keyword
