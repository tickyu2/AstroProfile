/**
 * Retrograde Calculators
 *
 * Core calculation engines for:
 * - Internal Authority Profile (IAP)
 * - Decision Modifiers
 * - Synastry Modifiers
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import type {
  Planet,
  PlanetState,
  DecisionContext,
  InternalAuthorityProfile,
  PlanetContribution,
  AuthorityTier,
  SynastryResult
} from './types';
import { RetrogradeMatrix, getRetrogradeProfile } from './matrix';
import { ALL_PLANETS } from './types';

// ========================================
// INTERNAL AUTHORITY PROFILE (IAP)
// ========================================

/**
 * Compute Internal Authority Profile for any chart
 *
 * The IAP measures how much a person's beliefs, rules, and vision
 * are internally generated vs externally sourced.
 *
 * Higher IAP = more self-referential decision system
 */
export function computeInternalAuthorityProfile(
  planets: PlanetState[]
): InternalAuthorityProfile {
  const contributions: PlanetContribution[] = [];
  let total = 0;
  let weightSum = 0;
  let dominantPlanet: Planet | null = null;
  let maxContribution = 0;

  for (const p of planets) {
    const profile = RetrogradeMatrix[p.planet];
    if (!profile) continue;

    const baseWeight = profile.internalizationWeight;
    const strength = p.strength ?? 1;
    const weight = baseWeight * strength;

    // Only retrograde planets contribute to IAP
    const contribution = p.isRetrograde ? weight : 0;

    if (contribution > 0) {
      total += contribution;

      if (contribution > maxContribution) {
        maxContribution = contribution;
        dominantPlanet = p.planet;
      }
    }

    weightSum += baseWeight;

    contributions.push({
      planet: p.planet,
      isRetrograde: p.isRetrograde,
      weight: baseWeight,
      contribution,
      description: p.isRetrograde
        ? profile.coreStatement
        : `${p.planet} direct - externally oriented`
    });
  }

  // Calculate final score (0-1)
  const score = weightSum === 0 ? 0 : Math.min(1, total / weightSum);

  // Determine tier
  const tier = getAuthorityTier(score);

  // Generate summary
  const summary = generateIAPSummary(score, contributions, dominantPlanet);

  // Decision style
  const decisionStyle = getDecisionStyle(tier, dominantPlanet);

  // Key phrases for AI prompts
  const keyPhrases = generateKeyPhrases(contributions.filter(c => c.isRetrograde));

  return {
    score,
    contributions,
    dominant: dominantPlanet,
    tier,
    summary,
    decisionStyle,
    keyPhrases
  };
}

/**
 * Get authority tier from score
 */
function getAuthorityTier(score: number): AuthorityTier {
  if (score >= 0.8) return 'sovereign';
  if (score >= 0.6) return 'autonomous';
  if (score >= 0.4) return 'internal';
  if (score >= 0.2) return 'balanced';
  return 'external';
}

/**
 * Generate summary narrative
 */
function generateIAPSummary(
  score: number,
  contributions: PlanetContribution[],
  dominant: Planet | null
): string {
  const retrogradeCount = contributions.filter(c => c.isRetrograde).length;

  if (retrogradeCount === 0) {
    return 'No retrograde planets - decision-making is primarily externally oriented, relying on consensus, experts, and established norms.';
  }

  const tier = getAuthorityTier(score);
  const retrogradeNames = contributions
    .filter(c => c.isRetrograde)
    .map(c => `${c.planet} Rx`)
    .join(', ');

  const tierDescriptions: Record<AuthorityTier, string> = {
    external: 'relies heavily on external validation and consensus',
    balanced: 'balances internal conviction with external input',
    internal: 'tends toward self-referential decision-making',
    autonomous: 'strongly self-directed with internalized authority',
    sovereign: 'operates from a fully self-referential belief and rule system'
  };

  let summary = `With ${retrogradeCount} retrograde planet${retrogradeCount > 1 ? 's' : ''} (${retrogradeNames}), this person ${tierDescriptions[tier]}.`;

  if (dominant) {
    const profile = getRetrogradeProfile(dominant);
    summary += ` The dominant influence is ${dominant} Rx: "${profile.coreStatement}"`;
  }

  return summary;
}

/**
 * Get decision style description
 */
function getDecisionStyle(tier: AuthorityTier, dominant: Planet | null): string {
  const baseStyles: Record<AuthorityTier, string> = {
    external: 'Seeks consensus and expert validation before major decisions',
    balanced: 'Considers both internal intuition and external input',
    internal: 'Trusts personal judgment but checks against reality',
    autonomous: 'Relies primarily on self-generated conclusions',
    sovereign: 'Operates from fully internalized beliefs, rules, and vision'
  };

  let style = baseStyles[tier];

  if (dominant) {
    const modifiers: Record<Planet, string> = {
      Mercury: ', with extensive internal processing before communication',
      Venus: ', filtered through deeply personal values',
      Mars: ', with strategic timing and indirect action',
      Jupiter: ', guided by self-authored philosophy',
      Saturn: ', following self-defined rules and boundaries',
      Uranus: ', with privately revolutionary thinking',
      Neptune: ', influenced by internal imagery and intuition',
      Pluto: ', through deep internal transformation processes'
    };
    style += modifiers[dominant];
  }

  return style;
}

/**
 * Generate key phrases for AI system prompts
 */
function generateKeyPhrases(retrogradeContributions: PlanetContribution[]): string[] {
  const phrases: string[] = [];

  for (const c of retrogradeContributions) {
    const profile = getRetrogradeProfile(c.planet);
    phrases.push(`${c.planet} Rx: "${profile.coreStatement}"`);
  }

  if (retrogradeContributions.length >= 3) {
    phrases.push('Self-referential decision system - beliefs, rules, and vision internally generated');
  }

  if (retrogradeContributions.length >= 2) {
    phrases.push('Internal authority orientation - trusts own conclusions over external consensus');
  }

  return phrases;
}

// ========================================
// DECISION MODIFIERS
// ========================================

/**
 * Apply retrograde decision modifiers to a base score
 *
 * @param baseScore - Starting decision confidence (0-1)
 * @param planets - Chart planet states
 * @param ctx - Decision context
 * @returns Modified score (0-1)
 */
export function applyRetrogradeDecisionModifier(
  baseScore: number,
  planets: PlanetState[],
  ctx: DecisionContext
): number {
  let score = baseScore;

  for (const p of planets) {
    if (!p.isRetrograde) continue;

    const profile = RetrogradeMatrix[p.planet];
    if (!profile) continue;

    // Apply the decision modifier
    score += profile.decisionModifier(ctx);
  }

  // Clamp to 0-1
  return Math.max(0, Math.min(1, score));
}

/**
 * Get detailed decision analysis for a context
 */
export function analyzeDecision(
  planets: PlanetState[],
  ctx: DecisionContext
): DecisionAnalysis {
  const modifiers: DecisionModifierDetail[] = [];
  let totalModifier = 0;

  for (const p of planets) {
    if (!p.isRetrograde) continue;

    const profile = RetrogradeMatrix[p.planet];
    if (!profile) continue;

    const modifier = profile.decisionModifier(ctx);
    totalModifier += modifier;

    modifiers.push({
      planet: p.planet,
      modifier,
      reason: getDecisionModifierReason(p.planet, ctx, modifier),
      advice: getDecisionAdvice(p.planet, ctx)
    });
  }

  const recommendation = generateDecisionRecommendation(ctx, modifiers, totalModifier);

  return {
    context: ctx,
    modifiers,
    totalModifier,
    recommendation,
    cautions: modifiers.filter(m => m.modifier < 0).map(m => m.reason),
    strengths: modifiers.filter(m => m.modifier > 0).map(m => m.reason)
  };
}

interface DecisionAnalysis {
  context: DecisionContext;
  modifiers: DecisionModifierDetail[];
  totalModifier: number;
  recommendation: string;
  cautions: string[];
  strengths: string[];
}

interface DecisionModifierDetail {
  planet: Planet;
  modifier: number;
  reason: string;
  advice: string;
}

function getDecisionModifierReason(planet: Planet, ctx: DecisionContext, modifier: number): string {
  const profile = getRetrogradeProfile(planet);

  if (modifier > 0) {
    return `${planet} Rx provides: ${profile.decision.strength}`;
  } else if (modifier < 0) {
    return `${planet} Rx caution: ${profile.decision.pitfall}`;
  }

  return `${planet} Rx: Neutral for this decision type`;
}

function getDecisionAdvice(planet: Planet, ctx: DecisionContext): string {
  const adviceMap: Record<Planet, Record<string, string>> = {
    Mercury: {
      communication: 'Take extra time to review and revise before communicating',
      default: 'Write thoughts down before making final decision'
    },
    Venus: {
      relationship: 'Check if choice aligns with your true values, not expectations',
      default: 'Consider what you genuinely value, not what seems valuable'
    },
    Mars: {
      conflict: 'Strategic timing matters - wait for optimal moment',
      default: 'Don\'t rush into action; let strategy emerge'
    },
    Jupiter: {
      default: 'Trust your internal belief system over external experts'
    },
    Saturn: {
      default: 'Create your own structure for this decision; don\'t accept imposed frameworks'
    },
    Uranus: {
      default: 'Your unique perspective is an asset - trust unconventional solutions'
    },
    Neptune: {
      default: 'Follow your intuition but verify with practical reality checks'
    },
    Pluto: {
      relationship: 'Consider the deeper power dynamics at play',
      default: 'Allow time for internal transformation before acting'
    }
  };

  const planetAdvice = adviceMap[planet];
  return planetAdvice[ctx.topic] || planetAdvice.default || 'Consider this retrograde influence';
}

function generateDecisionRecommendation(
  ctx: DecisionContext,
  modifiers: DecisionModifierDetail[],
  totalModifier: number
): string {
  if (modifiers.length === 0) {
    return 'No retrograde influences - proceed with standard decision-making process.';
  }

  if (totalModifier > 0.2) {
    return 'Retrograde configuration supports internal authority - trust your own judgment confidently.';
  } else if (totalModifier < -0.2) {
    return 'Retrograde configuration suggests caution - take extra time, verify assumptions, avoid rush.';
  }

  return 'Mixed retrograde influences - balance internal intuition with practical verification.';
}

// ========================================
// SYNASTRY MODIFIERS
// ========================================

/**
 * Compute retrograde-based synastry score between two charts
 */
export function computeRetrogradeSynastryScore(
  selfPlanets: PlanetState[],
  partnerPlanets: PlanetState[]
): SynastryAnalysis {
  const results: PlanetSynastryResult[] = [];
  let totalScore = 0;
  let totalFriction = 0;
  let totalResonance = 0;

  for (const p of selfPlanets) {
    if (!p.isRetrograde) continue;

    const profile = RetrogradeMatrix[p.planet];
    if (!profile) continue;

    const result = profile.synastryModifier(p, partnerPlanets);
    totalScore += result.score;
    totalFriction += result.friction;
    totalResonance += result.resonance;

    results.push({
      planet: p.planet,
      result,
      interpretation: interpretSynastryResult(p.planet, result)
    });
  }

  const count = results.length || 1;
  const dynamics = determineSynastryDynamics(totalScore / count, totalFriction / count, totalResonance / count);

  return {
    results,
    totalScore,
    averageScore: totalScore / count,
    averageFriction: totalFriction / count,
    averageResonance: totalResonance / count,
    overallDynamic: dynamics,
    summary: generateSynastryNarrative(results, dynamics)
  };
}

interface SynastryAnalysis {
  results: PlanetSynastryResult[];
  totalScore: number;
  averageScore: number;
  averageFriction: number;
  averageResonance: number;
  overallDynamic: string;
  summary: string;
}

interface PlanetSynastryResult {
  planet: Planet;
  result: SynastryResult;
  interpretation: string;
}

function interpretSynastryResult(planet: Planet, result: SynastryResult): string {
  const profile = getRetrogradeProfile(planet);

  switch (result.dynamic) {
    case 'harmonious':
      return `${planet} Rx finds resonance: ${profile.synastry.resonance}`;
    case 'karmic':
      return `${planet} Rx creates karmic depth: ${profile.synastry.bonding}`;
    case 'challenging':
      return `${planet} Rx friction point: ${profile.synastry.friction}`;
    case 'complementary':
      return `${planet} Rx complements partner: Different approaches work together`;
    default:
      return `${planet} Rx: Neutral synastry influence`;
  }
}

function determineSynastryDynamics(avgScore: number, avgFriction: number, avgResonance: number): string {
  if (avgResonance > 0.3 && avgFriction < 0.2) {
    return 'Deeply Harmonious - strong natural resonance with minimal friction';
  }
  if (avgFriction > 0.25 && avgResonance > 0.2) {
    return 'Growth-Oriented - challenges that lead to mutual evolution';
  }
  if (avgFriction > 0.3) {
    return 'Challenging - significant friction requiring conscious navigation';
  }
  if (avgScore > 0.1) {
    return 'Complementary - different approaches that enhance each other';
  }

  return 'Neutral - no strong retrograde synastry influences';
}

function generateSynastryNarrative(results: PlanetSynastryResult[], dynamics: string): string {
  if (results.length === 0) {
    return 'No retrograde synastry factors active in this comparison.';
  }

  const harmonious = results.filter(r => r.result.dynamic === 'harmonious' || r.result.dynamic === 'karmic');
  const challenging = results.filter(r => r.result.dynamic === 'challenging');

  let narrative = `Overall dynamic: ${dynamics}. `;

  if (harmonious.length > 0) {
    narrative += `Resonance through: ${harmonious.map(r => r.planet).join(', ')}. `;
  }

  if (challenging.length > 0) {
    narrative += `Growth edges: ${challenging.map(r => r.planet).join(', ')}. `;
  }

  return narrative;
}

// ========================================
// QUICK ANALYSIS FUNCTION
// ========================================

/**
 * Quick retrograde count and summary for a chart
 */
export function quickRetrogradeAnalysis(planets: PlanetState[]): QuickAnalysis {
  const retrograde = planets.filter(p => p.isRetrograde);
  const count = retrograde.length;

  let intensity: 'none' | 'light' | 'moderate' | 'strong' | 'dominant';
  if (count === 0) intensity = 'none';
  else if (count <= 1) intensity = 'light';
  else if (count <= 2) intensity = 'moderate';
  else if (count <= 4) intensity = 'strong';
  else intensity = 'dominant';

  return {
    count,
    planets: retrograde.map(p => p.planet),
    intensity,
    headline: getIntensityHeadline(intensity, retrograde),
    iap: computeInternalAuthorityProfile(planets)
  };
}

interface QuickAnalysis {
  count: number;
  planets: Planet[];
  intensity: 'none' | 'light' | 'moderate' | 'strong' | 'dominant';
  headline: string;
  iap: InternalAuthorityProfile;
}

function getIntensityHeadline(
  intensity: string,
  retrograde: PlanetState[]
): string {
  const headlines: Record<string, string> = {
    none: 'Externally oriented - seeks validation and consensus',
    light: 'Slight internal orientation - one area of self-reference',
    moderate: 'Balanced - some self-reference, some external orientation',
    strong: 'Internally oriented - significant self-referential patterns',
    dominant: 'Highly autonomous - strongly self-referential decision system'
  };

  let headline = headlines[intensity] || '';

  if (retrograde.length > 0) {
    const planets = retrograde.map(p => p.planet).join(', ');
    headline += ` (${planets} Rx)`;
  }

  return headline;
}
