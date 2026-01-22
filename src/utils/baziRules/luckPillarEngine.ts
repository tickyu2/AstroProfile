/**
 * ============================================
 * LUCK PILLAR ENGINE
 * Evaluates luck pillar (大运) exception rules
 * ============================================
 */

import {
  ChartContext,
  LuckPillarRule,
  LuckPillarEvaluation,
  RuleMatch
} from './types';
import { evaluateRules } from './ruleMatcher';

/**
 * Evaluate luck pillar rules
 */
export function evaluateLuckPillarRules(
  ctx: ChartContext,
  rules: LuckPillarRule[]
): LuckPillarEvaluation {
  // If no luck pillar in context, return minimal evaluation
  if (!ctx.currentLuckPillar) {
    return {
      periodQuality: 'neutral',
      matchedRules: [],
      activatedPatterns: [],
      warnings: ['No current luck pillar provided']
    };
  }

  // Enhance context with luck pillar analysis
  const enhancedCtx = enhanceContextForLuckPillar(ctx);

  // Evaluate rules
  const matchedRules = evaluateRules(rules, enhancedCtx);

  // Process results
  let periodQuality: 'favorable' | 'neutral' | 'challenging' | 'turbulent' = 'neutral';
  const activatedPatterns: string[] = [];
  const warnings: string[] = [];
  let structureImpact: string | undefined;
  let usefulGodImpact: string | undefined;

  for (const match of matchedRules) {
    if (!match.matched) continue;

    const result = match.result;

    // Determine period quality
    if (result.periodQuality) {
      const qualityMap: Record<string, 'favorable' | 'neutral' | 'challenging' | 'turbulent'> = {
        'favorable': 'favorable',
        'challenging': 'challenging',
        'turbulent': 'turbulent'
      };

      const newQuality = qualityMap[result.periodQuality];
      if (newQuality) {
        // Turbulent overrides everything, then challenging, etc.
        if (newQuality === 'turbulent' ||
            (newQuality === 'challenging' && periodQuality !== 'turbulent') ||
            (newQuality === 'favorable' && periodQuality === 'neutral')) {
          periodQuality = newQuality;
        }
      }
    }

    // Track structure impact
    if (result.structureStatus) {
      structureImpact = result.structureStatus;
      if (result.structureStatus === 'broken') {
        warnings.push('Special structure may break during this period');
        periodQuality = 'turbulent';
      }
    }

    // Track useful god impact
    if (result.usefulGodActivated) {
      usefulGodImpact = 'activated';
      activatedPatterns.push('Useful god strengthened');
      if (periodQuality === 'neutral') periodQuality = 'favorable';
    }
    if (result.usefulGodWeakened) {
      usefulGodImpact = 'weakened';
      warnings.push('Useful god clashed - protect key life areas');
      if (periodQuality === 'neutral') periodQuality = 'challenging';
    }

    // Track activated patterns
    if (result.combinationActivated) {
      activatedPatterns.push(`Three Harmony ${result.elementBoost} activated`);
    }
    if (result.punishmentActivated) {
      activatedPatterns.push('Punishment pattern completed');
      warnings.push(result.warning || 'Period of tests and challenges');
    }
    if (result.emptyFilled) {
      activatedPatterns.push('Empty branch filled - latent potential manifests');
    }

    // Handle Fan Yin / Fu Yin
    if (result.effect === 'intensification') {
      activatedPatterns.push('Fan Yin (伏吟) - natal themes intensified');
    }
    if (result.effect === 'disruption') {
      activatedPatterns.push('Fu Yin (反吟) - period of upheaval');
      if (periodQuality !== 'turbulent') periodQuality = 'challenging';
    }

    // Collect warnings
    if (result.warning) {
      warnings.push(result.warning);
    }
    if (result.advice) {
      warnings.push(`Advice: ${result.advice}`);
    }
  }

  return {
    periodQuality,
    matchedRules: matchedRules as RuleMatch<LuckPillarRule>[],
    structureImpact,
    usefulGodImpact,
    activatedPatterns,
    warnings
  };
}

/**
 * Enhance context with luck pillar specific data
 */
function enhanceContextForLuckPillar(ctx: ChartContext): ChartContext {
  const lp = ctx.currentLuckPillar!;
  const prevLp = ctx.previousLuckPillar;

  // Detect what the luck pillar brings
  const luckPillarBrings: string[] = [];

  // Check element of luck pillar stem
  luckPillarBrings.push(lp.stemElement);

  // Check if it's resource or 比劫 for day master
  const dmElement = ctx.dayMaster.element;
  const producing: Record<string, string> = {
    'Wood': 'Water', 'Fire': 'Wood', 'Earth': 'Fire', 'Metal': 'Earth', 'Water': 'Metal'
  };

  if (lp.stemElement === producing[dmElement]) {
    luckPillarBrings.push('resource');
  }
  if (lp.stemElement === dmElement) {
    luckPillarBrings.push('比劫');
  }

  // Check for completing three harmony
  const natalBranches = [
    ctx.pillars.year.branch,
    ctx.pillars.month.branch,
    ctx.pillars.day.branch,
    ctx.pillars.hour.branch
  ];

  // Three Harmony sets
  const threeHarmonyGroups = [
    { branches: ['申', '子', '辰'], element: 'Water' },
    { branches: ['寅', '午', '戌'], element: 'Fire' },
    { branches: ['亥', '卯', '未'], element: 'Wood' },
    { branches: ['巳', '酉', '丑'], element: 'Metal' }
  ];

  let completesThreeHarmony: string | null = null;
  for (const group of threeHarmonyGroups) {
    const natalHas = group.branches.filter(b => natalBranches.includes(b));
    if (natalHas.length === 2 && group.branches.includes(lp.branch)) {
      completesThreeHarmony = group.element;
    }
  }

  // Check for completing punishment
  const punishmentGroups = [
    { branches: ['寅', '巳', '申'], type: 'three_unkindness' },
    { branches: ['丑', '戌', '未'], type: 'bullying' }
  ];

  let completesPunishment: string | null = null;
  for (const group of punishmentGroups) {
    const natalHas = group.branches.filter(b => natalBranches.includes(b));
    if (natalHas.length === 2 && group.branches.includes(lp.branch)) {
      completesPunishment = group.type;
    }
  }

  // Check for Fan Yin / Fu Yin
  const matchesNatalPillar =
    (lp.stem === ctx.pillars.year.stem && lp.branch === ctx.pillars.year.branch) ||
    (lp.stem === ctx.pillars.month.stem && lp.branch === ctx.pillars.month.branch) ||
    (lp.stem === ctx.pillars.day.stem && lp.branch === ctx.pillars.day.branch);

  // Check for clashing natal useful god
  const clashPairs: Record<string, string> = {
    '子': '午', '丑': '未', '寅': '申', '卯': '酉', '辰': '戌', '巳': '亥',
    '午': '子', '未': '丑', '申': '寅', '酉': '卯', '戌': '辰', '亥': '巳'
  };

  let clashesUsefulGod = false;
  if (ctx.usefulGod?.position && ctx.usefulGod.position !== 'hidden') {
    const ugBranch = ctx.pillars[ctx.usefulGod.position as keyof typeof ctx.pillars].branch;
    clashesUsefulGod = clashPairs[lp.branch] === ugBranch;
  }

  // Check for filling empty branch
  const fillsEmpty = ctx.emptyBranches.includes(lp.branch);

  // Direction change detection
  let transitionSharp = false;
  if (prevLp) {
    // Check if element changed from supportive to unsupportive
    const wasSupporting = prevLp.stemElement === producing[dmElement] || prevLp.stemElement === dmElement;
    const nowSupporting = lp.stemElement === producing[dmElement] || lp.stemElement === dmElement;
    transitionSharp = wasSupporting && !nowSupporting;
  }

  return {
    ...ctx,
    // Enhanced properties for rule matching
    natalStructure: ctx.currentStructure,
    luckPillarBrings,
    strengthSufficient: true, // Simplified
    natalHas: natalBranches,
    completesThreeHarmony,
    completesPunishment,
    luckPillar: matchesNatalPillar ? 'matches_natal_pillar' : 'different',
    sameGanZhi: matchesNatalPillar,
    luckPillarBranch: clashesUsefulGod ? 'clashes_useful_god' : 'neutral',
    natalEmptyBranch: ctx.emptyBranches.length > 0 ? 'present' : 'none',
    previousLuckElement: prevLp?.stemElement,
    currentLuckElement: lp.stemElement,
    transitionSharp
  } as any;
}

/**
 * Get luck pillar quality summary
 */
export function getLuckPillarSummary(evaluation: LuckPillarEvaluation): string {
  const qualityDescriptions = {
    'favorable': '✓ Favorable period',
    'neutral': '○ Neutral period',
    'challenging': '⚠ Challenging period',
    'turbulent': '⚡ Turbulent period'
  };

  let summary = qualityDescriptions[evaluation.periodQuality];

  if (evaluation.activatedPatterns.length > 0) {
    summary += '\n  Patterns: ' + evaluation.activatedPatterns.join(', ');
  }

  if (evaluation.warnings.length > 0) {
    summary += '\n  Notes: ' + evaluation.warnings.slice(0, 2).join('; ');
  }

  return summary;
}
