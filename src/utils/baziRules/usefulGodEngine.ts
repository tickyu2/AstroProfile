/**
 * ============================================
 * USEFUL GOD ENGINE
 * Evaluates Useful God (用神) exception rules
 * ============================================
 */

import {
  ChartContext,
  UsefulGodRule,
  UsefulGodEvaluation,
  Element,
  RuleMatch
} from './types';
import { evaluateRules } from './ruleMatcher';

/**
 * Evaluate useful god rules and determine effectiveness
 */
export function evaluateUsefulGod(
  ctx: ChartContext,
  rules: UsefulGodRule[]
): UsefulGodEvaluation {
  // Start with the chart's identified useful god
  let primaryUsefulGod = ctx.usefulGod?.element || null;
  let status: 'active' | 'weakened' | 'blocked' | 'latent' = 'active';
  let effectivenessPercent = 100;
  let secondaryUsefulGod: Element | undefined;
  const warnings: string[] = [];

  // Evaluate all matching rules
  const matchedRules = evaluateRules(rules, ctx);

  for (const match of matchedRules) {
    if (!match.matched) continue;

    const result = match.result;

    // Check if useful god is compromised
    if (result.usefulGodEffective === false) {
      status = 'blocked';
      effectivenessPercent = 0;

      if (result.needsSecondaryUsefulGod) {
        warnings.push('Primary useful god blocked - need secondary');
      }
    } else if (result.usefulGodEffective === 'weakened') {
      status = 'weakened';
      effectivenessPercent = result.effectivenessPercent || 50;
    } else if (result.usefulGodEffective === 'severely_weakened') {
      status = 'weakened';
      effectivenessPercent = result.effectivenessPercent || 30;
    } else if (result.usefulGodEffective === 'compromised') {
      status = 'weakened';
      effectivenessPercent = 60;
      if (result.hiddenDamage) {
        warnings.push('Hidden damage to useful god - surface appears fine');
      }
    } else if (result.usefulGodEffective === 'latent') {
      status = 'latent';
      effectivenessPercent = result.baseEffectiveness || 40;
      if (result.activationCondition) {
        warnings.push(`Useful god latent - activates when: ${result.activationCondition}`);
      }
    }

    // Handle secondary useful god activation
    if (result.activeUsefulGod === 'secondary' && status === 'blocked') {
      // Find secondary useful god from chart
      secondaryUsefulGod = findSecondaryUsefulGod(ctx);
      if (secondaryUsefulGod) {
        status = 'weakened'; // Downgrade from blocked since we have secondary
        effectivenessPercent = 60;
      }
    }

    // Collect warnings and recommendations
    if (result.warning) {
      warnings.push(result.warning);
    }
    if (result.recommendation) {
      warnings.push(`Recommendation: ${result.recommendation}`);
    }

    // Check if annoying god is neutralized (good news)
    if (result.annoyingGodActive === false && result.chartImproved) {
      warnings.push('Good: Annoying god neutralized by combination');
    }
  }

  return {
    primaryUsefulGod,
    status,
    effectivenessPercent,
    secondaryUsefulGod,
    matchedRules: matchedRules as RuleMatch<UsefulGodRule>[],
    warnings
  };
}

/**
 * Find secondary useful god based on chart analysis
 */
function findSecondaryUsefulGod(ctx: ChartContext): Element | undefined {
  // Standard useful god hierarchy based on day master strength
  const dmStrength = ctx.dayMaster.strength;
  const dmElement = ctx.dayMaster.element;

  // Element relationships
  const produces: Record<string, Element> = {
    'Wood': 'Fire',
    'Fire': 'Earth',
    'Earth': 'Metal',
    'Metal': 'Water',
    'Water': 'Wood'
  };

  const isProducedBy: Record<string, Element> = {
    'Wood': 'Water',
    'Fire': 'Wood',
    'Earth': 'Fire',
    'Metal': 'Earth',
    'Water': 'Metal'
  };

  const controls: Record<string, Element> = {
    'Wood': 'Earth',
    'Fire': 'Metal',
    'Earth': 'Water',
    'Metal': 'Wood',
    'Water': 'Fire'
  };

  // Weak day master needs resource (印) or peer (比劫) as secondary
  if (['extremely_weak', 'very_weak', 'weak'].includes(dmStrength)) {
    return isProducedBy[dmElement]; // Resource element
  }

  // Strong day master needs output (食伤) or wealth (财) as secondary
  if (['strong', 'very_strong'].includes(dmStrength)) {
    return produces[dmElement]; // Output element
  }

  return undefined;
}

/**
 * Check if useful god is affected by specific interaction
 */
export function checkUsefulGodInteraction(
  ctx: ChartContext,
  interactionType: 'clash' | 'harm' | 'combination'
): { affected: boolean; severity: 'minor' | 'moderate' | 'severe' } {
  if (!ctx.usefulGod) {
    return { affected: false, severity: 'minor' };
  }

  const ugPosition = ctx.usefulGod.position;

  // Check if useful god position is involved in interactions
  if (interactionType === 'clash') {
    const involved = ctx.clashes.some(clash =>
      clash.positions.includes(ugPosition as any)
    );
    return { affected: involved, severity: involved ? 'severe' : 'minor' };
  }

  if (interactionType === 'harm') {
    const involved = ctx.harms.some(harm =>
      harm.positions.includes(ugPosition as any)
    );
    return { affected: involved, severity: involved ? 'moderate' : 'minor' };
  }

  if (interactionType === 'combination') {
    const involved = ctx.combinations.some(combo =>
      combo.positions.includes(ugPosition as any)
    );
    // Combination can be good or bad depending on result
    return { affected: involved, severity: 'moderate' };
  }

  return { affected: false, severity: 'minor' };
}

/**
 * Get useful god effectiveness summary
 */
export function getUsefulGodSummary(evaluation: UsefulGodEvaluation): string {
  const { primaryUsefulGod, status, effectivenessPercent, secondaryUsefulGod } = evaluation;

  if (!primaryUsefulGod) {
    return 'No useful god identified';
  }

  let summary = `Useful God: ${primaryUsefulGod}`;

  switch (status) {
    case 'active':
      summary += ` (Active at ${effectivenessPercent}% effectiveness)`;
      break;
    case 'weakened':
      summary += ` (Weakened to ${effectivenessPercent}% effectiveness)`;
      break;
    case 'blocked':
      summary += ` (Blocked - ${effectivenessPercent}% effectiveness)`;
      break;
    case 'latent':
      summary += ` (Latent - ${effectivenessPercent}% when activated)`;
      break;
  }

  if (secondaryUsefulGod) {
    summary += ` | Secondary: ${secondaryUsefulGod}`;
  }

  return summary;
}
