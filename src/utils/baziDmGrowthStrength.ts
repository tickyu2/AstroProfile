/**
 * ============================================================================
 * BAZI DAY MASTER GROWTH STRENGTH HELPER
 * ============================================================================
 *
 * Computes DM strength modifier based on the 12 Growth Stages (长生十二运).
 * This is a classical method for refining Day Master strength assessment.
 *
 * The 12 Growth Stages represent the life cycle of the Day Master's element
 * as it passes through each Earthly Branch. The month branch is traditionally
 * the most important indicator for DM seasonal strength.
 *
 * Usage:
 * - Multiply existing DM strength by the growth stage modifier
 * - Include in story mode and debug panels
 * - Factor into structure (格局) classification
 *
 * Created: January 2026
 * Based on: Classical BaZi 12 Growth Stages doctrine
 * ============================================================================
 */

import {
  getGrowthStage,
  getFourPillarsGrowthStages,
  getStrengthCategory,
  isStrongStage,
  GrowthStageInfo,
  GrowthStageKey,
  GROWTH_STAGE_DEFS
} from './baziGrowthPhases';

// ============================================================================
// TYPES
// ============================================================================

export interface DmGrowthStrengthResult {
  // Stage information
  stage: GrowthStageInfo | null;
  stageLabel: string | null;
  han: string | null;

  // Strength metrics
  rawStrength: number;       // 0-1 from stage definition
  modifier: number;          // Multiplier for existing DM strength (0.7-1.3)
  category: 'strong' | 'moderate' | 'weak';

  // Analysis flags
  isInStrongPhase: boolean;
  isInWeakPhase: boolean;

  // Explanation
  explanation: string;
  briefLabel: string;
}

export interface FourPillarsGrowthResult {
  // Individual pillar stages
  year: GrowthStageInfo | null;
  month: GrowthStageInfo | null;
  day: GrowthStageInfo | null;
  hour: GrowthStageInfo | null;

  // Computed metrics
  weightedStrength: number;
  weightedModifier: number;
  strongPillarCount: number;
  weakPillarCount: number;

  // Summary
  summary: string;
  explanation: string;
}

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Compute DM growth-stage-based modifier using Day Stem + Month Branch.
 * This is the classical way to assess DM strength through the growth cycle.
 *
 * @param dayStem - The Day Master stem (e.g., '甲', '乙')
 * @param monthBranch - The month's Earthly Branch (e.g., '寅', '午')
 * @returns DmGrowthStrengthResult with modifier and explanation
 */
export function computeDmGrowthStrength(
  dayStem: string,
  monthBranch: string
): DmGrowthStrengthResult {
  const stage = getGrowthStage(dayStem, monthBranch);

  if (!stage) {
    return {
      stage: null,
      stageLabel: null,
      han: null,
      rawStrength: 0.5,
      modifier: 1.0,
      category: 'moderate',
      isInStrongPhase: false,
      isInWeakPhase: false,
      explanation: `No growth stage mapping found for Day Stem ${dayStem} in month branch ${monthBranch}.`,
      briefLabel: 'Unknown'
    };
  }

  // Convert raw strength (0-1) to modifier (0.7-1.3)
  // Weak stages (0.1-0.3) → 0.7-0.85
  // Moderate stages (0.4-0.6) → 0.9-1.1
  // Strong stages (0.7-1.0) → 1.1-1.3
  const modifier = 0.7 + (stage.strength * 0.6);

  const category = getStrengthCategory(stage);
  const isInStrongPhase = isStrongStage(stage.key);
  const isInWeakPhase = stage.strength < 0.35;

  const explanation = generateGrowthExplanation(dayStem, monthBranch, stage, modifier);
  const briefLabel = `${stage.han} (${stage.label})`;

  return {
    stage,
    stageLabel: stage.label,
    han: stage.han,
    rawStrength: stage.strength,
    modifier,
    category,
    isInStrongPhase,
    isInWeakPhase,
    explanation,
    briefLabel
  };
}

/**
 * Compute DM growth strength across all four pillars.
 * This gives a more complete picture of the DM's strength throughout the chart.
 *
 * @param dayStem - The Day Master stem
 * @param pillars - Object with year, month, day, hour branches
 * @returns FourPillarsGrowthResult with weighted analysis
 */
export function computeFourPillarsGrowthStrength(
  dayStem: string,
  pillars: { year: string; month: string; day: string; hour: string }
): FourPillarsGrowthResult {
  const stages = getFourPillarsGrowthStages(dayStem, pillars);

  // Pillar weights (month is most important for seasonal strength)
  const weights = {
    year: 0.15,
    month: 0.35,
    day: 0.30,
    hour: 0.20
  };

  let totalStrength = 0;
  let totalWeight = 0;
  let strongCount = 0;
  let weakCount = 0;

  const pillarKeys = ['year', 'month', 'day', 'hour'] as const;

  for (const key of pillarKeys) {
    const stage = stages[key];
    if (stage) {
      totalStrength += stage.strength * weights[key];
      totalWeight += weights[key];

      if (isStrongStage(stage.key)) strongCount++;
      if (stage.strength < 0.35) weakCount++;
    }
  }

  const weightedStrength = totalWeight > 0 ? totalStrength / totalWeight : 0.5;
  const weightedModifier = 0.7 + (weightedStrength * 0.6);

  const explanation = generateFourPillarsExplanation(
    dayStem,
    pillars,
    stages,
    weights,
    weightedStrength,
    weightedModifier
  );

  return {
    year: stages.year,
    month: stages.month,
    day: stages.day,
    hour: stages.hour,
    weightedStrength,
    weightedModifier,
    strongPillarCount: strongCount,
    weakPillarCount: weakCount,
    summary: stages.summary,
    explanation
  };
}

// ============================================================================
// EXPLANATION GENERATORS
// ============================================================================

function generateGrowthExplanation(
  dayStem: string,
  monthBranch: string,
  stage: GrowthStageInfo,
  modifier: number
): string {
  const pct = (n: number) => (n * 100).toFixed(0);
  const modDir = modifier >= 1 ? '+' : '';

  return `
12 Growth Stage Analysis (长生十二运)
${'═'.repeat(50)}

Day Master: ${dayStem}
Month Branch: ${monthBranch}
Growth Stage: ${stage.han} (${stage.label})

Phase: ${stage.phase.charAt(0).toUpperCase() + stage.phase.slice(1)}
${stage.description}

${'─'.repeat(50)}
CALCULATION:

Stage Raw Strength: ${pct(stage.strength)}%
DM Strength Modifier: ×${modifier.toFixed(2)} (${modDir}${pct(modifier - 1)}%)

This modifier adjusts the Day Master's base strength based on its
life phase in the birth month.

${'─'.repeat(50)}
INTERPRETATION:

${getPhaseInterpretation(stage)}
`.trim();
}

function generateFourPillarsExplanation(
  dayStem: string,
  pillars: { year: string; month: string; day: string; hour: string },
  stages: {
    year: GrowthStageInfo | null;
    month: GrowthStageInfo | null;
    day: GrowthStageInfo | null;
    hour: GrowthStageInfo | null;
  },
  weights: { year: number; month: number; day: number; hour: number },
  weightedStrength: number,
  weightedModifier: number
): string {
  const fmt = (stage: GrowthStageInfo | null, branch: string, weight: number) => {
    if (!stage) return `${branch}: Unknown (weight: ${(weight * 100).toFixed(0)}%)`;
    return `${branch}: ${stage.han} (${stage.label}) - ${(stage.strength * 100).toFixed(0)}% × ${(weight * 100).toFixed(0)}%`;
  };

  return `
Four Pillars Growth Stage Analysis
${'═'.repeat(50)}

Day Master: ${dayStem}

Year  (${pillars.year}):  ${fmt(stages.year, pillars.year, weights.year)}
Month (${pillars.month}): ${fmt(stages.month, pillars.month, weights.month)}
Day   (${pillars.day}):   ${fmt(stages.day, pillars.day, weights.day)}
Hour  (${pillars.hour}):  ${fmt(stages.hour, pillars.hour, weights.hour)}

${'─'.repeat(50)}
WEIGHTED CALCULATION:

Weighted Average Strength: ${(weightedStrength * 100).toFixed(0)}%
Combined DM Modifier: ×${weightedModifier.toFixed(2)}

${'─'.repeat(50)}
KEY INSIGHT:

${stages.month ? getMonthPhaseInsight(stages.month) : 'Month stage not available for analysis.'}
`.trim();
}

function getPhaseInterpretation(stage: GrowthStageInfo): string {
  const interpretations: Record<GrowthStageKey, string> = {
    chang_sheng: 'The Day Master is in its birth phase - fresh energy, new beginnings, strong vitality. This is a favorable position indicating natural strength and potential.',
    mu_yu: 'The Day Master is in the bath phase - exposed and vulnerable but also cleansed and renewed. Some instability but high sensitivity and adaptability.',
    guan_dai: 'The Day Master is coming of age - growing in confidence and capability. Not yet at peak but developing steadily. Good for learning and preparation.',
    lin_guan: 'The Day Master is taking office - strong, capable, ready for responsibility. This is one of the most favorable positions for asserting authority.',
    di_wang: 'The Day Master is at absolute peak - emperor\'s throne. Maximum strength and influence. Powerful but must watch for excess or arrogance.',
    shuai: 'The Day Master is beginning to decline - past peak but still capable. Wisdom accumulating as raw strength fades. Time for reflection and delegation.',
    bing: 'The Day Master is in a weakened state - needs support and rest. Vulnerable but also a time for inner work and transformation.',
    si: 'The Day Master is at lowest visible point - death phase. But in BaZi, this is transformation, not ending. Old patterns dying for new to emerge.',
    mu: 'The Day Master is in the grave/storage phase - hidden but protected. Resources accumulated, potential stored. Strength is present but not visible.',
    jue: 'The Day Master is at termination - the empty point before renewal. Complete letting go of old cycle. Paradoxically, this can indicate hidden determination.',
    tai: 'The Day Master is at conception - new life forming. Potential gathering invisibly. Destiny being written. Things are beginning but not yet manifest.',
    yang: 'The Day Master is being nurtured - in the womb, protected and growing. Building strength quietly. Good foundation being laid for future.'
  };

  return interpretations[stage.key] || 'Phase interpretation not available.';
}

function getMonthPhaseInsight(monthStage: GrowthStageInfo): string {
  if (monthStage.strength >= 0.85) {
    return `The Day Master is in a STRONG month phase (${monthStage.han}). This is a significant boost to DM strength, indicating the season naturally supports this element.`;
  } else if (monthStage.strength >= 0.6) {
    return `The Day Master is in a FAVORABLE month phase (${monthStage.han}). Good seasonal support, though not at peak. The element has reasonable backing from the environment.`;
  } else if (monthStage.strength >= 0.4) {
    return `The Day Master is in a NEUTRAL month phase (${monthStage.han}). Neither strongly supported nor weakened by the season. Other factors become more important.`;
  } else {
    return `The Day Master is in a WEAK month phase (${monthStage.han}). The season does not naturally support this element. DM draws strength from other sources - luck cycles, relationships, or conscious cultivation.`;
  }
}

// ============================================================================
// QUICK HELPERS
// ============================================================================

/**
 * Quick check if DM is in a strong growth stage for the month
 */
export function isDmInStrongMonth(dayStem: string, monthBranch: string): boolean {
  const stage = getGrowthStage(dayStem, monthBranch);
  return stage ? isStrongStage(stage.key) : false;
}

/**
 * Get a brief strength label for the DM in month
 */
export function getDmMonthStrengthLabel(dayStem: string, monthBranch: string): string {
  const stage = getGrowthStage(dayStem, monthBranch);
  if (!stage) return 'Unknown';

  const category = getStrengthCategory(stage);
  return `${stage.han} - ${category.charAt(0).toUpperCase() + category.slice(1)}`;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  computeDmGrowthStrength,
  computeFourPillarsGrowthStrength,
  isDmInStrongMonth,
  getDmMonthStrengthLabel
};
