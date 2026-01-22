/**
 * ============================================
 * CLASH ENGINE
 * Evaluates Clash, Harm, Punishment, and Destruction rules
 * (冲害刑破)
 * ============================================
 */

import {
  ChartContext,
  ClashHarmPunishmentRule,
  ClashHarmPunishmentEvaluation,
  RuleMatch
} from './types';
import { evaluateRules } from './ruleMatcher';

/**
 * Evaluate clash, harm, and punishment rules
 */
export function evaluateClashHarmPunishment(
  ctx: ChartContext,
  rules: ClashHarmPunishmentRule[]
): ClashHarmPunishmentEvaluation {
  const clashResults: ClashHarmPunishmentEvaluation['clashes'] = [];
  const harmResults: ClashHarmPunishmentEvaluation['harms'] = [];
  const punishmentResults: ClashHarmPunishmentEvaluation['punishments'] = [];
  const healthWarnings: string[] = [];
  let structuralImpact = false;

  // Evaluate all rules first
  const matchedRules = evaluateRules(rules, ctx);

  // Process clashes
  for (const clash of ctx.clashes) {
    // Find applicable rules for this clash
    const clashRules = matchedRules.filter(match => {
      const conditions = match.rule.conditions;
      return (
        conditions.clashType === 'branch_clash' ||
        (conditions.clashPair &&
          conditions.clashPair.includes(clash.pair[0]) &&
          conditions.clashPair.includes(clash.pair[1]))
      );
    });

    const bestMatch = clashRules.length > 0 ? clashRules[0] : undefined;
    let effect: 'harmful' | 'beneficial' | 'neutral' = 'harmful'; // Default

    if (bestMatch?.result) {
      if (bestMatch.result.clashBeneficial) {
        effect = 'beneficial';
      }
      if (bestMatch.result.structureBroken) {
        structuralImpact = true;
      }
    }

    clashResults.push({
      clash,
      ruleApplied: bestMatch as RuleMatch<ClashHarmPunishmentRule> | undefined,
      effect
    });
  }

  // Process harms
  for (const harm of ctx.harms) {
    // Find applicable rules for this harm
    const harmRules = matchedRules.filter(match => {
      const conditions = match.rule.conditions;
      return (
        conditions.harmType === 'six_harm' ||
        (conditions.harmPair &&
          conditions.harmPair.includes(harm.pair[0]) &&
          conditions.harmPair.includes(harm.pair[1]))
      );
    });

    const bestMatch = harmRules.length > 0 ? harmRules[0] : undefined;

    if (bestMatch?.result) {
      if (bestMatch.result.healthWarning && bestMatch.result.affectedAreas) {
        healthWarnings.push(
          `Health concern: ${bestMatch.result.affectedAreas.join(', ')} - ` +
          (bestMatch.result.mitigationAdvice || 'Monitor carefully')
        );
      }
    }

    harmResults.push({
      harm,
      ruleApplied: bestMatch as RuleMatch<ClashHarmPunishmentRule> | undefined
    });
  }

  // Process punishments
  for (const punishment of ctx.punishments) {
    // Find applicable rules for this punishment
    const punishmentRules = matchedRules.filter(match => {
      const conditions = match.rule.conditions;
      return (
        conditions.punishmentType === punishment.type ||
        (conditions.branches &&
          punishment.participants.every(p => conditions.branches.includes(p)))
      );
    });

    const bestMatch = punishmentRules.length > 0 ? punishmentRules[0] : undefined;
    let severity = 'moderate';

    if (bestMatch?.result) {
      severity = bestMatch.result.punishmentSeverity || 'moderate';

      if (bestMatch.result.characterWarning) {
        healthWarnings.push(`Character note: ${bestMatch.result.characterWarning}`);
      }
      if (bestMatch.result.characterNote) {
        healthWarnings.push(`Character note: ${bestMatch.result.characterNote}`);
      }
    }

    punishmentResults.push({
      punishment,
      ruleApplied: bestMatch as RuleMatch<ClashHarmPunishmentRule> | undefined,
      severity
    });
  }

  return {
    clashes: clashResults,
    harms: harmResults,
    punishments: punishmentResults,
    structuralImpact,
    healthWarnings
  };
}

/**
 * Check if clash affects a specific pillar position
 */
export function getClashesAffectingPosition(
  evaluation: ClashHarmPunishmentEvaluation,
  position: string
): typeof evaluation.clashes {
  return evaluation.clashes.filter(c =>
    c.clash.positions.includes(position as any)
  );
}

/**
 * Get overall negative interaction intensity
 */
export function getNegativeInteractionIntensity(
  evaluation: ClashHarmPunishmentEvaluation
): 'low' | 'moderate' | 'high' | 'severe' {
  let score = 0;

  // Clashes add to intensity
  score += evaluation.clashes.filter(c => c.effect !== 'beneficial').length * 2;

  // Harms add moderate intensity
  score += evaluation.harms.length * 1.5;

  // Punishments add significant intensity
  for (const p of evaluation.punishments) {
    if (p.severity === 'high') score += 3;
    else if (p.severity === 'moderate') score += 2;
    else score += 1;
  }

  // Structural impact is serious
  if (evaluation.structuralImpact) score += 2;

  if (score >= 8) return 'severe';
  if (score >= 5) return 'high';
  if (score >= 2) return 'moderate';
  return 'low';
}

/**
 * Check if a combination resolves a clash
 */
export function checkCombinationResolvesClash(
  ctx: ChartContext,
  clashPair: [string, string]
): { resolved: boolean; resolution: string } {
  // Look for combinations involving clash participants
  for (const combo of ctx.combinations) {
    if (combo.participants.includes(clashPair[0]) ||
        combo.participants.includes(clashPair[1])) {
      return {
        resolved: true,
        resolution: `${combo.type} combination draws ${combo.participants.join(',')} away from clash`
      };
    }
  }

  return { resolved: false, resolution: '' };
}

/**
 * Get summary of all negative interactions
 */
export function getInteractionSummary(
  evaluation: ClashHarmPunishmentEvaluation
): string[] {
  const summary: string[] = [];

  for (const c of evaluation.clashes) {
    const effect = c.effect === 'beneficial' ? ' (beneficial)' : '';
    summary.push(`Clash: ${c.clash.pair.join('-')}${effect}`);
  }

  for (const h of evaluation.harms) {
    summary.push(`Harm: ${h.harm.pair.join('-')}`);
  }

  for (const p of evaluation.punishments) {
    summary.push(`Punishment (${p.punishment.type}): ${p.punishment.participants.join('-')} [${p.severity}]`);
  }

  return summary;
}
