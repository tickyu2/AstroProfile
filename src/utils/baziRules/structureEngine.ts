/**
 * ============================================
 * STRUCTURE ENGINE
 * Evaluates special BaZi structure rules
 * (Follow structures, Established Rank, Blade, etc.)
 * ============================================
 */

import {
  ChartContext,
  StructureRule,
  StructureEvaluation,
  StructureType,
  RuleMatch
} from './types';
import { evaluateRules } from './ruleMatcher';

/**
 * Evaluate structure rules against the chart context
 */
export function evaluateStructures(
  ctx: ChartContext,
  rules: StructureRule[]
): StructureEvaluation {
  const matchedRules = evaluateRules(rules, ctx);
  const warnings: string[] = [];

  // Default to normal structure
  let determinedStructure: StructureType = 'normal';
  let usefulGodOverride: any = undefined;

  // Process matched rules in priority order
  for (const match of matchedRules) {
    if (match.matched) {
      const result = match.result;

      // First matching rule determines the structure
      if (determinedStructure === 'normal' && result.structureType) {
        determinedStructure = result.structureType;
      }

      // Collect warnings
      if (result.warning) {
        warnings.push(result.warning);
      }

      // Check for useful god override
      if (result.usefulGodOverride !== undefined) {
        usefulGodOverride = result.usefulGodOverride;
      }

      // Handle unstable structures
      if (result.unstable) {
        warnings.push(`Structure is unstable and may break during certain luck pillars`);
      }
    }
  }

  // Additional validation for follow structures
  if (determinedStructure.includes('follow')) {
    const validationWarnings = validateFollowStructure(ctx, determinedStructure);
    warnings.push(...validationWarnings);
  }

  return {
    determinedStructure,
    matchedRules: matchedRules as RuleMatch<StructureRule>[],
    warnings,
    usefulGodOverride
  };
}

/**
 * Validate follow structure conditions
 */
function validateFollowStructure(
  ctx: ChartContext,
  structureType: StructureType
): string[] {
  const warnings: string[] = [];

  // Check for hidden roots that might invalidate follow
  if (ctx.hasRoot && ctx.rootCount > 0) {
    if (structureType === 'true_follow') {
      warnings.push('True Follow structure questionable - hidden root detected');
    }
  }

  // Check season compatibility
  if (structureType.includes('follow')) {
    const dmElement = ctx.dayMaster.element;
    const season = ctx.season;

    // Season that produces day master element can help break follow
    const producingSeasons: Record<string, string[]> = {
      'Wood': ['winter'],      // Water produces Wood
      'Fire': ['spring'],       // Wood produces Fire
      'Earth': ['summer'],      // Fire produces Earth
      'Metal': ['late_summer'], // Earth produces Metal
      'Water': ['autumn']       // Metal produces Water
    };

    if (producingSeasons[dmElement]?.includes(season)) {
      warnings.push(`Season (${season}) may provide hidden support to Day Master`);
    }
  }

  return warnings;
}

/**
 * Quick check if chart has any special structure
 */
export function hasSpecialStructure(
  ctx: ChartContext,
  rules: StructureRule[]
): boolean {
  const evaluation = evaluateStructures(ctx, rules);
  return evaluation.determinedStructure !== 'normal';
}

/**
 * Get structure-specific useful god recommendations
 */
export function getStructureUsefulGod(
  evaluation: StructureEvaluation
): { recommended: string[]; avoid: string[] } {
  const recommended: string[] = [];
  const avoid: string[] = [];

  for (const match of evaluation.matchedRules) {
    if (match.matched && match.result) {
      // Add recommended useful gods
      if (match.result.usefulGod) {
        const ug = match.result.usefulGod;
        if (Array.isArray(ug)) {
          recommended.push(...ug);
        } else {
          recommended.push(ug);
        }
      }

      // Add elements to avoid
      if (match.result.avoidElements) {
        avoid.push(...match.result.avoidElements);
      }
    }
  }

  return {
    recommended: [...new Set(recommended)],
    avoid: [...new Set(avoid)]
  };
}
