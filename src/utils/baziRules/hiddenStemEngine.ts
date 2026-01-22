/**
 * ============================================
 * HIDDEN STEM ENGINE
 * Evaluates hidden stem (藏干) exception rules
 * ============================================
 */

import {
  ChartContext,
  HiddenStemRule,
  HiddenStemEvaluation,
  HiddenStem,
  PillarPosition,
  RuleMatch
} from './types';
import { evaluateRules } from './ruleMatcher';

/**
 * Evaluate hidden stem rules for all pillars
 */
export function evaluateHiddenStems(
  ctx: ChartContext,
  rules: HiddenStemRule[]
): HiddenStemEvaluation {
  const stems: HiddenStemEvaluation['stems'] = [];

  // Process each pillar
  const pillarPositions: PillarPosition[] = ['year', 'month', 'day', 'hour'];

  for (const position of pillarPositions) {
    const pillar = ctx.pillars[position];

    for (const hiddenStem of pillar.hiddenStems) {
      // Create context-specific conditions for rule matching
      const stemContext = createHiddenStemContext(ctx, position, hiddenStem);

      // Find applicable rules
      const matchedRules = evaluateRules(rules, stemContext as any);
      const bestMatch = matchedRules.length > 0 ? matchedRules[0] : undefined;

      // Determine effective strength and status
      let effectiveStrength = hiddenStem.percentage;
      let status: 'active' | 'dormant' | 'transformed' | 'disrupted' = 'active';

      if (bestMatch?.result) {
        const result = bestMatch.result;

        // Apply strength modifier
        if (result.strengthModifier !== undefined) {
          effectiveStrength = hiddenStem.percentage * result.strengthModifier;
        }

        // Determine status
        if (result.hiddenStemStatus === 'transformed' || result.originalLost) {
          status = 'transformed';
        } else if (result.hiddenStemStatus === 'dormant' || result.currentEffect === 'minimal') {
          status = 'dormant';
        } else if (result.hiddenStemPower === 'disrupted') {
          status = 'disrupted';
          effectiveStrength *= 0.5;
        } else if (result.hiddenStemPower === 'fully_activated') {
          status = 'active';
          effectiveStrength *= (result.strengthModifier || 1.5);
        }
      }

      // Check if stem appears in heavenly stems (reveals hidden)
      if (isRevealedInStems(ctx, hiddenStem.stem)) {
        status = 'active';
        effectiveStrength = Math.max(effectiveStrength, hiddenStem.percentage * 1.5);
      }

      // Check if branch is clashed (disrupts hidden stems)
      if (isBranchClashed(ctx, position)) {
        status = 'disrupted';
        effectiveStrength *= 0.5;
      }

      stems.push({
        pillar: position,
        stem: hiddenStem,
        ruleApplied: bestMatch as RuleMatch<HiddenStemRule> | undefined,
        effectiveStrength: Math.round(effectiveStrength * 10) / 10,
        status
      });
    }
  }

  return { stems };
}

/**
 * Create context for hidden stem rule evaluation
 */
function createHiddenStemContext(
  ctx: ChartContext,
  position: PillarPosition,
  hiddenStem: HiddenStem
): Partial<ChartContext> & { hiddenStemPosition: string; percentageInBranch: number } {
  const pillar = ctx.pillars[position];

  // Check if stem appears in heavenly stems
  const alsoInHeavenlyStem =
    ctx.pillars.year.stem === hiddenStem.stem ||
    ctx.pillars.month.stem === hiddenStem.stem ||
    ctx.pillars.day.stem === hiddenStem.stem ||
    ctx.pillars.hour.stem === hiddenStem.stem;

  // Check branch status
  const isClashed = isBranchClashed(ctx, position);
  const isCombined = isBranchCombined(ctx, position);
  const isEmpty = ctx.emptyBranches.includes(pillar.branch);

  return {
    ...ctx,
    hiddenStemPosition: hiddenStem.type,
    percentageInBranch: hiddenStem.percentage,
    alsoInHeavenlyStem,
    sameElement: true,
    branchStatus: isClashed ? 'clashed' : isCombined ? 'combined' : isEmpty ? 'empty' : 'normal',
    hiddenStemsAffected: isClashed,
    hiddenStemsInEmpty: isEmpty,
    combinationTransforms: isCombined,
    hiddenStemsChange: isCombined
  } as any;
}

/**
 * Check if a hidden stem is revealed in heavenly stems
 */
function isRevealedInStems(ctx: ChartContext, stem: string): boolean {
  return (
    ctx.pillars.year.stem === stem ||
    ctx.pillars.month.stem === stem ||
    ctx.pillars.day.stem === stem ||
    ctx.pillars.hour.stem === stem
  );
}

/**
 * Check if a branch is involved in a clash
 */
function isBranchClashed(ctx: ChartContext, position: PillarPosition): boolean {
  return ctx.clashes.some(clash =>
    clash.positions.includes(position)
  );
}

/**
 * Check if a branch is involved in a combination
 */
function isBranchCombined(ctx: ChartContext, position: PillarPosition): boolean {
  return ctx.combinations.some(combo =>
    combo.positions.includes(position)
  );
}

/**
 * Get total hidden element strength across all pillars
 */
export function getTotalHiddenElementStrength(
  evaluation: HiddenStemEvaluation
): Record<string, number> {
  const totals: Record<string, number> = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0
  };

  for (const stem of evaluation.stems) {
    if (stem.status !== 'transformed') {
      totals[stem.stem.element] += stem.effectiveStrength;
    }
  }

  return totals;
}

/**
 * Find useful god in hidden stems
 */
export function findUsefulGodInHiddenStems(
  evaluation: HiddenStemEvaluation,
  usefulGodElement: string
): { found: boolean; positions: PillarPosition[]; totalStrength: number } {
  const matches = evaluation.stems.filter(s =>
    s.stem.element === usefulGodElement && s.status !== 'transformed'
  );

  return {
    found: matches.length > 0,
    positions: matches.map(m => m.pillar),
    totalStrength: matches.reduce((sum, m) => sum + m.effectiveStrength, 0)
  };
}

/**
 * Get hidden stem summary for a pillar
 */
export function getHiddenStemSummary(
  evaluation: HiddenStemEvaluation,
  position: PillarPosition
): string[] {
  return evaluation.stems
    .filter(s => s.pillar === position)
    .map(s => {
      const statusEmoji = {
        'active': '✓',
        'dormant': '○',
        'transformed': '→',
        'disrupted': '×'
      }[s.status];

      return `${statusEmoji} ${s.stem.stem} (${s.stem.element}) ${s.effectiveStrength}%`;
    });
}
