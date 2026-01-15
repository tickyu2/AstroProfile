/**
 * ============================================================================
 * LUCK PILLAR FAVORABILITY ENGINE (大运喜忌)
 * ============================================================================
 *
 * This is the TIMING ENGINE of BaZi - where everything converges.
 *
 * Each 10-year Luck Pillar (大运) is evaluated using:
 * - Useful God (用神) activation
 * - Annoying God (忌神) activation
 * - DM strength adjustment
 * - Element support/drain cycles
 * - Transformations with natal pillars (合化/三合/三会)
 * - Conflicts with natal pillars (冲/害/刑/破)
 * - Shen Sha activation (神煞)
 * - Seasonal alignment
 *
 * This module tells the user:
 * - Which decades help them
 * - Which decades challenge them
 * - Why certain periods feel easy or hard
 * - How their chart interacts with external energy over time
 *
 * Joey Yap teaching:
 * "BaZi without timing is like a map without directions.
 *  The Luck Pillars show WHEN the potential in your chart activates."
 *
 * Created: January 2026
 * Based on: Classical BaZi Luck Pillar (大运) doctrine, Joey Yap methodology
 * ============================================================================
 */

import { UsefulGodResult, ElementName, evaluateLuckPillarElement } from './baziUsefulGod';

// ============================================================================
// TYPES
// ============================================================================

export type FavorabilityTier = 'excellent' | 'good' | 'neutral' | 'challenging' | 'difficult';

export interface LuckPillarInput {
  stem: string;           // 天干
  branch: string;         // 地支
  startAge: number;       // Age when this pillar starts
  endAge: number;         // Age when this pillar ends
}

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

export interface ConflictTrigger {
  type: 'clash' | 'harm' | 'punishment' | 'destruction';
  withPillar: string;
  branches: [string, string];
  severity: 'major' | 'moderate' | 'minor';
  description: string;
}

export interface TransformationTrigger {
  type: string;
  pillarsInvolved: string[];
  resultElement: string;
  description: string;
}

export interface ShenshaTrigger {
  name: string;
  chineseName: string;
  isPositive: boolean;
  description: string;
}

export interface LuckPillarFavorability {
  // Basic info
  pillarStem: string;
  pillarBranch: string;
  pillarDisplay: string;
  startAge: number;
  endAge: number;

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
  transformations: TransformationTrigger[];
  conflicts: ConflictTrigger[];
  shensha: ShenshaTrigger[];

  // DM impact
  dmStrengthDelta: number;
  dmImpact: 'strengthens' | 'weakens' | 'neutral';

  // Narrative
  reasoning: string[];
  summary: string;
  advice: string;
}

export interface LuckPillarTimelineResult {
  pillars: LuckPillarFavorability[];
  bestDecade: LuckPillarFavorability | null;
  worstDecade: LuckPillarFavorability | null;
  currentDecade: LuckPillarFavorability | null;
  overallPattern: string;
  lifeSummary: string;
}

// ============================================================================
// ELEMENT MAPPINGS
// ============================================================================

export const STEM_TO_ELEMENT: Record<string, ElementName> = {
  '甲': 'Wood', '乙': 'Wood',
  '丙': 'Fire', '丁': 'Fire',
  '戊': 'Earth', '己': 'Earth',
  '庚': 'Metal', '辛': 'Metal',
  '壬': 'Water', '癸': 'Water'
};

export const BRANCH_TO_ELEMENT: Record<string, ElementName> = {
  '子': 'Water',
  '丑': 'Earth',
  '寅': 'Wood',
  '卯': 'Wood',
  '辰': 'Earth',
  '巳': 'Fire',
  '午': 'Fire',
  '未': 'Earth',
  '申': 'Metal',
  '酉': 'Metal',
  '戌': 'Earth',
  '亥': 'Water'
};

export const STEM_POLARITY: Record<string, 'yang' | 'yin'> = {
  '甲': 'yang', '乙': 'yin',
  '丙': 'yang', '丁': 'yin',
  '戊': 'yang', '己': 'yin',
  '庚': 'yang', '辛': 'yin',
  '壬': 'yang', '癸': 'yin'
};

// ============================================================================
// CLASH PAIRS (for quick lookup)
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

// ============================================================================
// SCORING WEIGHTS
// ============================================================================

const SCORING_WEIGHTS = {
  // Useful/Annoying God
  usefulStem: 18,
  usefulBranch: 15,
  annoyingStem: -18,
  annoyingBranch: -15,

  // Conflicts
  clashMajor: -12,
  clashModerate: -8,
  clashMinor: -4,
  harmMajor: -8,
  harmModerate: -5,
  harmMinor: -2,
  punishmentMajor: -10,
  punishmentModerate: -6,
  punishmentMinor: -3,
  destructionMajor: -5,
  destructionModerate: -3,
  destructionMinor: -1,

  // Transformations
  transformationPositive: 8,
  transformationNeutral: 3,

  // Shen Sha
  shenshaPositive: 5,
  shenshaNegative: -5,

  // DM adjustment
  dmSupport: 5,
  dmDrain: -5
};

// ============================================================================
// MAIN COMPUTATION FUNCTION
// ============================================================================

/**
 * Compute favorability of a single Luck Pillar
 */
export function computeLuckPillarFavorability(
  luckPillar: LuckPillarInput,
  natalPillars: NatalPillarsInput,
  usefulGodResult: UsefulGodResult,
  dayMasterElement: ElementName,
  dmStrength: number
): LuckPillarFavorability {
  const { stem, branch, startAge, endAge } = luckPillar;
  const reasoning: string[] = [];

  // ========================================
  // STEP 1: Get element information
  // ========================================
  const stemElement = STEM_TO_ELEMENT[stem] || 'Earth';
  const branchElement = BRANCH_TO_ELEMENT[branch] || 'Earth';

  reasoning.push(`📅 Luck Pillar: ${stem}${branch} (Age ${startAge}-${endAge})`);
  reasoning.push(`   Stem: ${stem} → ${stemElement}`);
  reasoning.push(`   Branch: ${branch} → ${branchElement}`);

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
    reasoning.push(`   ○ No Useful God elements in this pillar`);
  }
  if (annoyingActivated.length > 0) {
    reasoning.push(`   ❌ Annoying activated: ${annoyingActivated.join(', ')}`);
  }

  // ========================================
  // STEP 3: Detect conflicts with natal chart
  // ========================================
  const conflicts: ConflictTrigger[] = [];
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
      conflicts.push({
        type: 'clash',
        withPillar: natal.name,
        branches: [branch, natal.branch],
        severity,
        description: `${branch}${natal.branch}冲 - Luck Pillar clashes with ${natal.name} Pillar`
      });
    }

    // Check harm
    if (HARM_PAIRS[branch] === natal.branch) {
      const severity = natal.name === 'Day' ? 'moderate' : 'minor';
      conflicts.push({
        type: 'harm',
        withPillar: natal.name,
        branches: [branch, natal.branch],
        severity,
        description: `${branch}${natal.branch}害 - Luck Pillar harms ${natal.name} Pillar`
      });
    }
  }

  if (conflicts.length > 0) {
    reasoning.push(``);
    reasoning.push(`⚔️ Conflicts Detected:`);
    conflicts.forEach(c => {
      reasoning.push(`   ${c.severity.toUpperCase()}: ${c.description}`);
    });
  }

  // ========================================
  // STEP 4: Detect transformations (simplified)
  // ========================================
  const transformations: TransformationTrigger[] = [];

  // Check for Six Combinations (六合) with luck pillar branch
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

  const combination = SIX_COMBINATIONS[branch];
  if (combination) {
    for (const natal of natalBranches) {
      if (natal.branch === combination.partner) {
        transformations.push({
          type: 'Six Combination (六合)',
          pillarsInvolved: [`Luck:${branch}`, `${natal.name}:${natal.branch}`],
          resultElement: combination.result,
          description: `${branch}${natal.branch}合 → ${combination.result}`
        });
      }
    }
  }

  if (transformations.length > 0) {
    reasoning.push(``);
    reasoning.push(`🔄 Transformations:`);
    transformations.forEach(t => {
      reasoning.push(`   ${t.type}: ${t.description}`);
    });
  }

  // ========================================
  // STEP 5: Shen Sha activation (simplified)
  // ========================================
  const shensha: ShenshaTrigger[] = [];

  // Traveling Horse (驿马) - activated by luck pillar branch
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
      description: 'Movement, travel, change of environment activated'
    });
  }

  // Nobleman (天乙贵人) - simplified check
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
      description: 'Help from benefactors, smooth problem resolution'
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
  // STEP 6: DM strength impact
  // ========================================
  let dmStrengthDelta = 0;
  let dmImpact: 'strengthens' | 'weakens' | 'neutral' = 'neutral';

  // Elements that strengthen DM
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

  // Resource (what produces DM) strengthens
  if (stemElement === PRODUCED_BY[dayMasterElement] || branchElement === PRODUCED_BY[dayMasterElement]) {
    dmStrengthDelta += 0.15;
    dmImpact = 'strengthens';
  }

  // Same element strengthens
  if (stemElement === dayMasterElement || branchElement === dayMasterElement) {
    dmStrengthDelta += 0.1;
    dmImpact = 'strengthens';
  }

  // What controls DM weakens
  if (stemElement === CONTROLLED_BY[dayMasterElement] || branchElement === CONTROLLED_BY[dayMasterElement]) {
    dmStrengthDelta -= 0.15;
    dmImpact = 'weakens';
  }

  // Output (what DM produces) drains
  if (stemElement === PRODUCTION_CYCLE[dayMasterElement] || branchElement === PRODUCTION_CYCLE[dayMasterElement]) {
    dmStrengthDelta -= 0.1;
    if (dmImpact === 'neutral') dmImpact = 'weakens';
  }

  reasoning.push(``);
  reasoning.push(`💪 DM Impact: ${dmImpact} (Δ ${dmStrengthDelta > 0 ? '+' : ''}${(dmStrengthDelta * 100).toFixed(0)}%)`);

  // ========================================
  // STEP 7: Calculate final score
  // ========================================
  let score = 50; // Start neutral

  // Useful God activation
  if (stemUseful) score += SCORING_WEIGHTS.usefulStem;
  if (branchUseful) score += SCORING_WEIGHTS.usefulBranch;

  // Annoying God activation
  if (stemAnnoying) score += SCORING_WEIGHTS.annoyingStem;
  if (branchAnnoying) score += SCORING_WEIGHTS.annoyingBranch;

  // Conflicts
  conflicts.forEach(c => {
    const weight = SCORING_WEIGHTS[`${c.type}${c.severity.charAt(0).toUpperCase() + c.severity.slice(1)}` as keyof typeof SCORING_WEIGHTS] as number;
    score += weight || -5;
  });

  // Transformations (generally positive if they produce useful elements)
  transformations.forEach(t => {
    if (usefulGodResult.usefulElements.includes(t.resultElement as ElementName)) {
      score += SCORING_WEIGHTS.transformationPositive;
    } else {
      score += SCORING_WEIGHTS.transformationNeutral;
    }
  });

  // Shen Sha
  shensha.forEach(s => {
    score += s.isPositive ? SCORING_WEIGHTS.shenshaPositive : SCORING_WEIGHTS.shenshaNegative;
  });

  // DM context adjustment
  const isWeakDM = dmStrength < 1.0;
  if (isWeakDM && dmImpact === 'strengthens') {
    score += SCORING_WEIGHTS.dmSupport;
  } else if (!isWeakDM && dmImpact === 'weakens') {
    score += SCORING_WEIGHTS.dmSupport; // Draining strong DM is good
  } else if (isWeakDM && dmImpact === 'weakens') {
    score += SCORING_WEIGHTS.dmDrain;
  } else if (!isWeakDM && dmImpact === 'strengthens') {
    score += SCORING_WEIGHTS.dmDrain; // Strengthening strong DM is bad
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
  // STEP 8: Generate summary and advice
  // ========================================
  const summary = generateSummary(score, tier, usefulActivated, annoyingActivated, conflicts, transformations);
  const advice = generateAdvice(tier, usefulActivated, annoyingActivated, conflicts, shensha, dayMasterElement);

  return {
    pillarStem: stem,
    pillarBranch: branch,
    pillarDisplay: `${stem}${branch}`,
    startAge,
    endAge,
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
    transformations,
    conflicts,
    shensha,
    dmStrengthDelta,
    dmImpact,
    reasoning,
    summary,
    advice
  };
}

// ============================================================================
// TIMELINE COMPUTATION
// ============================================================================

/**
 * Compute favorability for all luck pillars
 */
export function computeLuckPillarTimeline(
  luckPillars: LuckPillarInput[],
  natalPillars: NatalPillarsInput,
  usefulGodResult: UsefulGodResult,
  dayMasterElement: ElementName,
  dmStrength: number,
  currentAge?: number
): LuckPillarTimelineResult {
  const pillars = luckPillars.map(lp =>
    computeLuckPillarFavorability(lp, natalPillars, usefulGodResult, dayMasterElement, dmStrength)
  );

  // Find best and worst
  const sorted = [...pillars].sort((a, b) => b.score - a.score);
  const bestDecade = sorted[0] || null;
  const worstDecade = sorted[sorted.length - 1] || null;

  // Find current decade
  let currentDecade: LuckPillarFavorability | null = null;
  if (currentAge !== undefined) {
    currentDecade = pillars.find(p => currentAge >= p.startAge && currentAge < p.endAge) || null;
  }

  // Determine overall pattern
  const avgScore = pillars.reduce((sum, p) => sum + p.score, 0) / pillars.length;
  let overallPattern: string;

  if (avgScore >= 65) {
    overallPattern = 'Generally favorable timeline with strong support periods.';
  } else if (avgScore >= 50) {
    overallPattern = 'Mixed timeline with both opportunities and challenges.';
  } else if (avgScore >= 35) {
    overallPattern = 'Challenging timeline requiring resilience and adaptation.';
  } else {
    overallPattern = 'Difficult timeline - focus on building inner strength.';
  }

  // Generate life summary
  const lifeSummary = generateLifeSummary(pillars, bestDecade, worstDecade, currentDecade);

  return {
    pillars,
    bestDecade,
    worstDecade,
    currentDecade,
    overallPattern,
    lifeSummary
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateSummary(
  score: number,
  tier: FavorabilityTier,
  useful: ElementName[],
  annoying: ElementName[],
  conflicts: ConflictTrigger[],
  transformations: TransformationTrigger[]
): string {
  const parts: string[] = [];

  if (tier === 'excellent') {
    parts.push('This decade strongly supports your chart.');
  } else if (tier === 'good') {
    parts.push('This decade brings favorable energy overall.');
  } else if (tier === 'neutral') {
    parts.push('This decade is mixed - neither particularly helpful nor harmful.');
  } else if (tier === 'challenging') {
    parts.push('This decade presents obstacles to navigate.');
  } else {
    parts.push('This decade requires careful management and patience.');
  }

  if (useful.length > 0) {
    parts.push(`Useful God (${useful.join(', ')}) is activated.`);
  }

  if (annoying.length > 0) {
    parts.push(`Annoying God (${annoying.join(', ')}) is also present.`);
  }

  if (conflicts.length > 0) {
    const majorConflicts = conflicts.filter(c => c.severity === 'major');
    if (majorConflicts.length > 0) {
      parts.push(`Watch for major conflicts with your natal chart.`);
    }
  }

  if (transformations.length > 0) {
    parts.push(`Transformations may shift the energy positively.`);
  }

  return parts.join(' ');
}

function generateAdvice(
  tier: FavorabilityTier,
  useful: ElementName[],
  annoying: ElementName[],
  conflicts: ConflictTrigger[],
  shensha: ShenshaTrigger[],
  dayMasterElement: ElementName
): string {
  if (tier === 'excellent' || tier === 'good') {
    if (shensha.some(s => s.name === 'Traveling Horse')) {
      return 'This is an excellent time for travel, relocation, or career changes. Take advantage of the movement energy.';
    }
    if (shensha.some(s => s.name === 'Nobleman')) {
      return 'Helpful people will appear during this period. Network actively and accept help gracefully.';
    }
    return 'This favorable period is good for major initiatives. Take calculated risks and pursue your goals.';
  }

  if (tier === 'challenging' || tier === 'difficult') {
    if (conflicts.some(c => c.type === 'clash')) {
      return 'Expect changes and disruptions. Stay flexible and avoid major commitments in volatile periods.';
    }
    if (annoying.length > 0) {
      return `Be mindful of ${annoying.join(' and ')} energy. Focus on strengthening your Useful God elements.`;
    }
    return 'This period requires patience and resilience. Focus on inner development rather than external achievements.';
  }

  return 'Maintain balance and stay adaptable. This period has both opportunities and challenges.';
}

function generateLifeSummary(
  pillars: LuckPillarFavorability[],
  best: LuckPillarFavorability | null,
  worst: LuckPillarFavorability | null,
  current: LuckPillarFavorability | null
): string {
  const parts: string[] = [];

  if (best) {
    parts.push(`Peak period: Age ${best.startAge}-${best.endAge} (${best.pillarDisplay}) - ${best.tier} (score: ${best.score}).`);
  }

  if (worst) {
    parts.push(`Challenging period: Age ${worst.startAge}-${worst.endAge} (${worst.pillarDisplay}) - ${worst.tier} (score: ${worst.score}).`);
  }

  if (current) {
    parts.push(`Current period: ${current.pillarDisplay} - ${current.tier} (score: ${current.score}).`);
  }

  // Identify transitions
  const transitions: string[] = [];
  for (let i = 1; i < pillars.length; i++) {
    const prev = pillars[i - 1];
    const curr = pillars[i];
    const scoreDiff = curr.score - prev.score;

    if (Math.abs(scoreDiff) >= 25) {
      if (scoreDiff > 0) {
        transitions.push(`Major improvement at age ${curr.startAge}`);
      } else {
        transitions.push(`Significant shift at age ${curr.startAge}`);
      }
    }
  }

  if (transitions.length > 0) {
    parts.push(`Key transitions: ${transitions.join('; ')}.`);
  }

  return parts.join(' ');
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Get a simple favorability rating for a single luck pillar
 */
export function getQuickFavorability(
  luckStem: string,
  luckBranch: string,
  usefulElements: ElementName[],
  annoyingElements: ElementName[]
): { favorable: boolean; score: number; reason: string } {
  const stemElement = STEM_TO_ELEMENT[luckStem];
  const branchElement = BRANCH_TO_ELEMENT[luckBranch];

  let score = 50;
  const reasons: string[] = [];

  if (usefulElements.includes(stemElement)) {
    score += 20;
    reasons.push(`${stemElement} stem supports you`);
  }
  if (usefulElements.includes(branchElement)) {
    score += 15;
    reasons.push(`${branchElement} branch supports you`);
  }
  if (annoyingElements.includes(stemElement)) {
    score -= 20;
    reasons.push(`${stemElement} stem challenges you`);
  }
  if (annoyingElements.includes(branchElement)) {
    score -= 15;
    reasons.push(`${branchElement} branch challenges you`);
  }

  return {
    favorable: score >= 50,
    score: Math.max(0, Math.min(100, score)),
    reason: reasons.length > 0 ? reasons.join('; ') : 'Neutral period'
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  computeLuckPillarFavorability,
  computeLuckPillarTimeline,
  getQuickFavorability,
  STEM_TO_ELEMENT,
  BRANCH_TO_ELEMENT,
  STEM_POLARITY
};
