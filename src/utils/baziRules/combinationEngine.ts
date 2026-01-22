/**
 * ============================================
 * COMBINATION ENGINE
 * Evaluates combination/transformation rules
 * (Three Harmony, Six Harmony, Stem Combinations)
 * ============================================
 */

import {
  ChartContext,
  CombinationRule,
  CombinationEvaluation,
  DetectedCombination,
  RuleMatch
} from './types';
import { evaluateRules, matchConditions } from './ruleMatcher';

/**
 * Evaluate combination rules against detected combinations
 */
export function evaluateCombinations(
  ctx: ChartContext,
  rules: CombinationRule[]
): CombinationEvaluation {
  const results: CombinationEvaluation['combinations'] = [];

  // Process each detected combination in the chart
  for (const combination of ctx.combinations) {
    // Find applicable rules for this combination
    const applicableRules = rules.filter(rule => {
      // Match by combination type
      if (rule.conditions.combinationType !== combination.type) {
        return false;
      }

      // Match by branches if specified
      if (rule.conditions.branches) {
        const ruleBranches = rule.conditions.branches as string[];
        const combBranches = combination.participants;

        // Check if all rule branches are in the combination
        const branchMatch = ruleBranches.every(rb => combBranches.includes(rb));
        if (!branchMatch) return false;
      }

      return true;
    });

    // Evaluate applicable rules
    const matchedRules = evaluateRules(applicableRules, ctx);
    const bestMatch = matchedRules.length > 0 ? matchedRules[0] : undefined;

    // Determine final status
    let finalStatus: 'transformed' | 'partial' | 'broken' | 'affinity_only' = 'transformed';

    if (bestMatch) {
      const result = bestMatch.result;

      if (result.combinationBroken) {
        finalStatus = 'broken';
      } else if (result.transformationSuccess === false || result.affinityOnly) {
        finalStatus = 'affinity_only';
      } else if (result.transformationSuccess === 'partial') {
        finalStatus = 'partial';
      }
    } else {
      // Default: check if combination can transform based on season
      finalStatus = checkDefaultTransformation(combination, ctx);
    }

    results.push({
      combination,
      ruleApplied: bestMatch as RuleMatch<CombinationRule> | undefined,
      finalStatus
    });
  }

  return { combinations: results };
}

/**
 * Check default transformation success based on season
 */
function checkDefaultTransformation(
  combination: DetectedCombination,
  ctx: ChartContext
): 'transformed' | 'partial' | 'affinity_only' {
  if (!combination.resultElement) {
    return 'affinity_only';
  }

  // Three Harmony transformations depend on season
  if (combination.type === 'three_harmony') {
    const resultElement = combination.resultElement;
    const season = ctx.season;

    // Element prospers in its season
    const elementSeasons: Record<string, string[]> = {
      'Wood': ['spring'],
      'Fire': ['summer'],
      'Earth': ['late_summer'],
      'Metal': ['autumn'],
      'Water': ['winter']
    };

    // Check if result element is supported by season
    if (elementSeasons[resultElement]?.includes(season)) {
      return 'transformed';
    }

    // Check for opposing season (transformation fails)
    const opposingSeasons: Record<string, string[]> = {
      'Wood': ['autumn'],
      'Fire': ['winter'],
      'Earth': ['spring'],
      'Metal': ['summer'],
      'Water': ['late_summer']
    };

    if (opposingSeasons[resultElement]?.includes(season)) {
      return 'affinity_only';
    }

    // Neutral season - partial transformation
    return 'partial';
  }

  // Six Harmony - more likely to transform
  if (combination.type === 'six_harmony') {
    // Check if result element has support in chart
    const hasSupport = ctx.elementBalance[combination.resultElement] > 20;
    return hasSupport ? 'transformed' : 'partial';
  }

  // Stem combinations need strong season or chart support
  if (combination.type === 'stem_combination') {
    const resultElement = combination.resultElement;
    const hasChartSupport = ctx.elementBalance[resultElement] > 25;
    return hasChartSupport ? 'transformed' : 'affinity_only';
  }

  // Directional combinations usually transform
  if (combination.type === 'directional') {
    return 'transformed';
  }

  return 'partial';
}

/**
 * Check if a clash breaks a combination
 */
export function checkClashBreaksCombination(
  ctx: ChartContext
): DetectedCombination[] {
  const brokenCombinations: DetectedCombination[] = [];

  for (const combination of ctx.combinations) {
    // Check if any branch in the combination is clashed
    const isClashed = ctx.clashes.some(clash =>
      combination.participants.includes(clash.pair[0]) ||
      combination.participants.includes(clash.pair[1])
    );

    if (isClashed) {
      brokenCombinations.push(combination);
    }
  }

  return brokenCombinations;
}

/**
 * Calculate effective element after combination transformations
 */
export function getEffectiveElements(
  evaluation: CombinationEvaluation,
  originalBalance: Record<string, number>
): Record<string, number> {
  const effective = { ...originalBalance };

  for (const combo of evaluation.combinations) {
    if (combo.finalStatus === 'transformed' && combo.combination.resultElement) {
      const resultElement = combo.combination.resultElement;

      // Add strength to result element (simplified calculation)
      effective[resultElement] = (effective[resultElement] || 0) + 15;
    }
  }

  return effective;
}
