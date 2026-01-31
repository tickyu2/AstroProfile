/**
 * ============================================================================
 * MICRO-TIMING SCORING ENGINE (微时序评分引擎)
 * ============================================================================
 *
 * Scores micro-segments against a subject's BaZi chart.
 *
 * Scoring Factors:
 * 1. Useful God alignment - Does the segment's element support the Useful God?
 * 2. Element balance - Does it address imbalances in the chart?
 * 3. Day Master interaction - How does it interact with the Day Master?
 * 4. Context-specific factors - Different weights for different domains
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  ElementName,
  MicroContext,
  MicroPillar,
  MicroQualityTier,
  MicroTimingSubject
} from './microTimingTypes';

import {
  calculateElementSupport,
  calculateElementChallenge,
  getElementRelation,
  ELEMENT_PRODUCES,
  ELEMENT_CONTROLS
} from './microPillarDerivation';

// ============================================================================
// SCORING WEIGHTS BY CONTEXT
// ============================================================================

/**
 * Weight configuration for different scoring factors
 */
interface ScoringWeights {
  usefulGodAlignment: number;
  dayMasterSupport: number;
  elementBalance: number;
  avoidElementPenalty: number;
}

/**
 * Context-specific weight configurations
 */
const CONTEXT_WEIGHTS: Record<MicroContext, ScoringWeights> = {
  relationship: {
    usefulGodAlignment: 0.35,
    dayMasterSupport: 0.25,
    elementBalance: 0.25,
    avoidElementPenalty: 0.15
  },
  action: {
    usefulGodAlignment: 0.30,
    dayMasterSupport: 0.35,
    elementBalance: 0.20,
    avoidElementPenalty: 0.15
  },
  wealth: {
    usefulGodAlignment: 0.40,
    dayMasterSupport: 0.20,
    elementBalance: 0.25,
    avoidElementPenalty: 0.15
  },
  health: {
    usefulGodAlignment: 0.30,
    dayMasterSupport: 0.30,
    elementBalance: 0.30,
    avoidElementPenalty: 0.10
  },
  communication: {
    usefulGodAlignment: 0.35,
    dayMasterSupport: 0.25,
    elementBalance: 0.20,
    avoidElementPenalty: 0.20
  },
  creativity: {
    usefulGodAlignment: 0.30,
    dayMasterSupport: 0.20,
    elementBalance: 0.35,
    avoidElementPenalty: 0.15
  },
  rest: {
    usefulGodAlignment: 0.25,
    dayMasterSupport: 0.35,
    elementBalance: 0.30,
    avoidElementPenalty: 0.10
  }
};

// ============================================================================
// TEN GODS CONTEXT MAPPING
// ============================================================================

/**
 * Ten Gods that favor each context
 * These are the relationship types that naturally support the activity
 */
const FAVORABLE_TEN_GODS: Record<MicroContext, string[]> = {
  relationship: [
    'Direct Officer',     // 正官 - Commitment, structure
    'Seven Killings',     // 七杀 - Intensity, passion
    'Direct Resource',    // 正印 - Nurturing, support
    'Eating God'          // 食神 - Pleasure, enjoyment
  ],
  action: [
    'Seven Killings',     // 七杀 - Decisive action
    'Hurting Officer',    // 伤官 - Bold moves
    'Rob Wealth',         // 劫财 - Competitive edge
    'Friend'              // 比肩 - Self-assertion
  ],
  wealth: [
    'Direct Wealth',      // 正财 - Stable income
    'Indirect Wealth',    // 偏财 - Windfalls
    'Eating God',         // 食神 - Wealth creation
    'Hurting Officer'     // 伤官 - Entrepreneurial
  ],
  health: [
    'Direct Resource',    // 正印 - Nurturing
    'Indirect Resource',  // 偏印 - Recovery
    'Friend',             // 比肩 - Self-care
    'Direct Officer'      // 正官 - Discipline
  ],
  communication: [
    'Eating God',         // 食神 - Smooth expression
    'Hurting Officer',    // 伤官 - Persuasive
    'Direct Resource',    // 正印 - Clear thinking
    'Indirect Resource'   // 偏印 - Creative ideas
  ],
  creativity: [
    'Hurting Officer',    // 伤官 - Original ideas
    'Eating God',         // 食神 - Artistic flow
    'Indirect Resource',  // 偏印 - Unconventional
    'Indirect Wealth'     // 偏财 - Opportunity spotting
  ],
  rest: [
    'Direct Resource',    // 正印 - Peaceful
    'Indirect Resource',  // 偏印 - Contemplative
    'Friend',             // 比肩 - Self-time
    'Eating God'          // 食神 - Relaxation
  ]
};

// ============================================================================
// CORE SCORING FUNCTIONS
// ============================================================================

/**
 * Score Useful God alignment (0-100)
 * Higher score = segment element better supports the Useful God
 */
export function scoreUsefulGodAlignment(
  segmentElement: ElementName,
  usefulGod: { element: ElementName; supportingElements: ElementName[] }
): number {
  // Direct match with Useful God
  if (segmentElement === usefulGod.element) {
    return 100;
  }

  // Match with supporting element
  if (usefulGod.supportingElements.includes(segmentElement)) {
    return 85;
  }

  // Element that produces the Useful God (indirect support)
  if (ELEMENT_PRODUCES[segmentElement] === usefulGod.element) {
    return 75;
  }

  // Neutral - no direct relationship
  const relation = getElementRelation(segmentElement, usefulGod.element);
  if (relation === 'same') return 100;
  if (relation === 'produces') return 75;
  if (relation === 'produced') return 50;
  if (relation === 'controlled') return 40;
  if (relation === 'controls') return 25;

  return 50;
}

/**
 * Score Day Master support (0-100)
 * Based on how the segment element interacts with Day Master
 */
export function scoreDayMasterSupport(
  segmentElement: ElementName,
  dayMaster: {
    element: ElementName;
    strengthScore: number;
    strengthCategory: string;
  }
): number {
  const baseSupport = calculateElementSupport(dayMaster.element, segmentElement);

  // Adjust based on Day Master strength
  // Strong Day Master benefits from controlling elements (wealth/output)
  // Weak Day Master benefits from supporting elements (resource/friend)
  const isStrong = dayMaster.strengthCategory === 'strong' || dayMaster.strengthCategory === 'very_strong';
  const isWeak = dayMaster.strengthCategory === 'weak' || dayMaster.strengthCategory === 'very_weak';

  const relation = getElementRelation(segmentElement, dayMaster.element);

  if (isStrong) {
    // Strong DM benefits from elements that drain energy (output, wealth)
    if (relation === 'produced') return baseSupport + 15; // More output
    if (relation === 'controlled') return baseSupport + 10; // Wealth opportunity
    if (relation === 'same') return baseSupport - 10; // Too much of same
  }

  if (isWeak) {
    // Weak DM benefits from supporting elements (resource, friend)
    if (relation === 'produces') return baseSupport + 15; // Resource support
    if (relation === 'same') return baseSupport + 10; // Friend support
    if (relation === 'controls') return baseSupport - 15; // Extra pressure
  }

  return Math.max(0, Math.min(100, baseSupport));
}

/**
 * Score element balance (0-100)
 * Higher score = segment element helps balance the chart
 */
export function scoreElementBalance(
  segmentElement: ElementName,
  elementDistribution: Record<ElementName, number>
): number {
  // Find the weakest element(s)
  const elements: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const sortedElements = [...elements].sort(
    (a, b) => elementDistribution[a] - elementDistribution[b]
  );

  const weakestElement = sortedElements[0];
  const secondWeakest = sortedElements[1];
  const strongestElement = sortedElements[4];

  // If segment provides the weakest element - excellent for balance
  if (segmentElement === weakestElement) {
    return 95;
  }

  // If segment provides second weakest - good for balance
  if (segmentElement === secondWeakest) {
    return 80;
  }

  // If segment provides the strongest element - might increase imbalance
  if (segmentElement === strongestElement) {
    return 35;
  }

  // Neutral elements
  return 60;
}

/**
 * Score avoid element penalty (0-100)
 * Lower penalty = better (segment doesn't clash with avoided elements)
 */
export function scoreAvoidElementPenalty(
  segmentElement: ElementName,
  avoidElements: ElementName[]
): number {
  // Direct match with avoid element - significant penalty
  if (avoidElements.includes(segmentElement)) {
    return 20; // Heavy penalty
  }

  // Element that produces an avoided element - mild penalty
  for (const avoid of avoidElements) {
    if (ELEMENT_PRODUCES[segmentElement] === avoid) {
      return 50; // Indirect penalty
    }
  }

  // No clash
  return 100;
}

// ============================================================================
// COMPOSITE SCORING
// ============================================================================

/**
 * Complete scoring result for a micro-segment
 */
export interface MicroSegmentScores {
  relationshipScore: number;
  actionScore: number;
  wealthScore: number;
  healthScore: number;
  communicationScore: number;
  creativityScore: number;
  restScore: number;
  overallScore: number;
  tier: MicroQualityTier;
  elementSupport: number;
  elementChallenge: number;
  notes: string[];
  warnings: string[];
}

/**
 * Score a micro-segment against a subject's chart
 */
export function scoreMicroSegment(
  pillar: MicroPillar,
  subject: MicroTimingSubject,
  primaryContext?: MicroContext
): MicroSegmentScores {
  const notes: string[] = [];
  const warnings: string[] = [];

  // Calculate base scores for each factor
  const usefulGodScore = scoreUsefulGodAlignment(
    pillar.dominantElement,
    subject.usefulGod
  );

  const dayMasterScore = scoreDayMasterSupport(
    pillar.dominantElement,
    subject.dayMaster
  );

  const balanceScore = scoreElementBalance(
    pillar.dominantElement,
    subject.elementDistribution
  );

  const avoidPenalty = scoreAvoidElementPenalty(
    pillar.dominantElement,
    subject.usefulGod.avoidElements
  );

  // Calculate context-specific scores
  const scores: Record<MicroContext, number> = {} as Record<MicroContext, number>;

  const contexts: MicroContext[] = [
    'relationship', 'action', 'wealth', 'health',
    'communication', 'creativity', 'rest'
  ];

  for (const context of contexts) {
    const weights = CONTEXT_WEIGHTS[context];
    const raw =
      weights.usefulGodAlignment * usefulGodScore +
      weights.dayMasterSupport * dayMasterScore +
      weights.elementBalance * balanceScore +
      weights.avoidElementPenalty * avoidPenalty;

    scores[context] = Math.round(Math.max(0, Math.min(100, raw)));
  }

  // Calculate element support/challenge
  const elementSupport = calculateElementSupport(
    subject.dayMaster.element,
    pillar.dominantElement
  );

  const elementChallenge = calculateElementChallenge(
    subject.dayMaster.element,
    pillar.dominantElement
  );

  // Calculate overall score (weighted by primary context if provided)
  let overallScore: number;
  if (primaryContext) {
    // Primary context gets 50% weight, others share 50%
    const otherContexts = contexts.filter(c => c !== primaryContext);
    const otherAvg = otherContexts.reduce((sum, c) => sum + scores[c], 0) / otherContexts.length;
    overallScore = Math.round(scores[primaryContext] * 0.5 + otherAvg * 0.5);
  } else {
    // Equal weight for all contexts
    overallScore = Math.round(
      contexts.reduce((sum, c) => sum + scores[c], 0) / contexts.length
    );
  }

  // Determine tier
  const tier = getTierFromScore(overallScore);

  // Generate notes
  if (usefulGodScore >= 85) {
    notes.push(`Strong ${subject.usefulGod.element} (Useful God) support`);
  }
  if (dayMasterScore >= 80) {
    notes.push(`Favorable for ${subject.dayMaster.element} Day Master`);
  }
  if (balanceScore >= 85) {
    notes.push(`Helps balance element distribution`);
  }

  // Generate warnings
  if (avoidPenalty <= 30) {
    warnings.push(`${pillar.dominantElement} clashes with avoided elements`);
  }
  if (dayMasterScore <= 30 && subject.dayMaster.strengthCategory.includes('weak')) {
    warnings.push(`May strain the weak Day Master`);
  }

  // Context-specific insights
  if (scores.relationship >= 85) {
    notes.push(`Excellent for relationship conversations`);
  }
  if (scores.action >= 85) {
    notes.push(`Strong window for decisive action`);
  }
  if (scores.wealth >= 85) {
    notes.push(`Favorable for financial matters`);
  }
  if (scores.communication >= 85) {
    notes.push(`Ideal for important communications`);
  }

  return {
    relationshipScore: scores.relationship,
    actionScore: scores.action,
    wealthScore: scores.wealth,
    healthScore: scores.health,
    communicationScore: scores.communication,
    creativityScore: scores.creativity,
    restScore: scores.rest,
    overallScore,
    tier,
    elementSupport,
    elementChallenge,
    notes,
    warnings
  };
}

/**
 * Get quality tier from score
 */
export function getTierFromScore(score: number): MicroQualityTier {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'neutral';
  if (score >= 30) return 'caution';
  return 'avoid';
}

// ============================================================================
// NARRATIVE GENERATION
// ============================================================================

/**
 * Generate narrative for a scored segment
 */
export function generateSegmentNarrative(
  scores: MicroSegmentScores,
  pillar: MicroPillar,
  context?: MicroContext
): { narrative: string; narrativeChinese: string } {
  const elementChinese: Record<ElementName, string> = {
    Wood: '木', Fire: '火', Earth: '土', Metal: '金', Water: '水'
  };

  const tierDescriptions: Record<MicroQualityTier, { en: string; zh: string }> = {
    excellent: { en: 'Peak window', zh: '最佳时段' },
    good: { en: 'Favorable window', zh: '良好时段' },
    neutral: { en: 'Average window', zh: '普通时段' },
    caution: { en: 'Cautious window', zh: '谨慎时段' },
    avoid: { en: 'Rest window', zh: '休息时段' }
  };

  const tierDesc = tierDescriptions[scores.tier];

  let narrative = `${tierDesc.en}. `;
  let narrativeChinese = `${tierDesc.zh}。`;

  if (scores.notes.length > 0) {
    narrative += scores.notes[0] + '. ';
  }

  if (scores.warnings.length > 0) {
    narrative += `Note: ${scores.warnings[0]}.`;
    narrativeChinese += `注意：${pillar.dominantElement}能量波动。`;
  }

  // Add element info
  narrative += ` (${pillar.dominantElement} energy)`;
  narrativeChinese += `（${elementChinese[pillar.dominantElement]}气当令）`;

  return { narrative, narrativeChinese };
}

