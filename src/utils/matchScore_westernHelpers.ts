/**
 * matchScore_westernHelpers.ts
 *
 * Western astrology helpers for compatibility scoring.
 * Integrates Western Expression Vector with the main matchScore formula.
 *
 * Extended Formula:
 * Total = (1-α-γ)*NEO + α*[(1-β)*WuXing + β*TenGods] * modifiers + γ*Western
 *
 * Where:
 * - α = 0.25 (BaZi weight)
 * - β = 0.30 (TenGods weight within BaZi)
 * - γ = 0.15 (Western weight) ← NEW
 */

import type {
  WesternExpressionVector,
  WesternCompatibilityScore,
  WesternSimilarityResult,
  SectionWeights
} from '../types/western.types';

import {
  flattenWesternVector,
  cosineSimilarity,
  westernSectionSimilarity,
  computeWesternCompatibility,
  createDefaultWesternVector
} from './westernExpressionVector';

import { DEFAULT_SECTION_WEIGHTS, DEFAULT_GAMMA } from '../types/western.types';

// =============================================================================
// PROFILE INTEGRATION
// =============================================================================

/**
 * Extract or build Western Expression Vector from a profile.
 *
 * If profile has pre-computed westernVector, use it.
 * Otherwise, build from available natal chart data.
 */
export function getWesternVectorFromProfile(
  profile: any
): WesternExpressionVector {
  // Check if pre-computed vector exists
  if (profile.westernVector) {
    return profile.westernVector;
  }

  // Check if western expression vector exists (different key)
  if (profile.westernExpressionVector) {
    return profile.westernExpressionVector;
  }

  // Build from natal chart data if available
  if (profile.natalChart || profile.western) {
    return buildWesternVectorFromChart(profile.natalChart || profile.western);
  }

  // Return default neutral vector
  console.warn('No Western data found for profile, using default vector');
  return createDefaultWesternVector();
}

/**
 * Build Western Expression Vector from natal chart data.
 *
 * This is a simplified builder for frontend use.
 * Full calculations should happen in Python backend.
 */
export function buildWesternVectorFromChart(
  chart: any
): WesternExpressionVector {
  const vector = createDefaultWesternVector();

  if (!chart) return vector;

  // Extract elements if available
  if (chart.elements) {
    vector.elements = {
      fire: chart.elements.fire ?? chart.elements.Fire ?? 0.25,
      earth: chart.elements.earth ?? chart.elements.Earth ?? 0.25,
      air: chart.elements.air ?? chart.elements.Air ?? 0.25,
      water: chart.elements.water ?? chart.elements.Water ?? 0.25
    };
  }

  // Extract modalities if available
  if (chart.modalities) {
    vector.modalities = {
      cardinal: chart.modalities.cardinal ?? chart.modalities.Cardinal ?? 0.33,
      fixed: chart.modalities.fixed ?? chart.modalities.Fixed ?? 0.33,
      mutable: chart.modalities.mutable ?? chart.modalities.Mutable ?? 0.34
    };
  }

  // Extract chart shape if available
  if (chart.chartShape) {
    vector.chartShape = {
      ...vector.chartShape,
      detected: chart.chartShape.primary || chart.chartShape.detected || 'splash'
    };
  }

  return vector;
}

// =============================================================================
// COMPATIBILITY CALCULATION
// =============================================================================

/**
 * Calculate Western compatibility between two profiles.
 *
 * @param profileA - First profile
 * @param profileB - Second profile
 * @param weights - Section weights (optional)
 * @returns Western compatibility score
 */
export function calculateWesternCompatibility(
  profileA: any,
  profileB: any,
  weights: SectionWeights = DEFAULT_SECTION_WEIGHTS
): WesternCompatibilityScore {
  const vecA = getWesternVectorFromProfile(profileA);
  const vecB = getWesternVectorFromProfile(profileB);

  return computeWesternCompatibility(vecA, vecB, weights);
}

/**
 * Get Western compatibility as a simple 0-1 score.
 *
 * This is the value used in the extended matchScore formula.
 */
export function getWesternCompatibilityScore(
  profileA: any,
  profileB: any
): number {
  const result = calculateWesternCompatibility(profileA, profileB);
  return result.total / 100;  // Convert to 0-1
}

/**
 * Get raw cosine similarity between two profiles' Western vectors.
 */
export function getWesternCosineSimilarity(
  profileA: any,
  profileB: any
): number {
  const vecA = flattenWesternVector(getWesternVectorFromProfile(profileA));
  const vecB = flattenWesternVector(getWesternVectorFromProfile(profileB));
  return cosineSimilarity(vecA, vecB);
}

// =============================================================================
// EXPLANATION GENERATION
// =============================================================================

/**
 * Generate Western compatibility explanation for UI display.
 */
export function generateWesternExplanation(
  score: WesternCompatibilityScore
): string[] {
  const notes: string[] = [];

  notes.push(
    `Western compatibility: ${score.total}% (vector cosine: ${score.vectorCosine.toFixed(2)})`
  );

  // Element harmony
  if (score.elementHarmony >= 70) {
    notes.push(`Strong elemental harmony (${score.elementHarmony}%) - temperaments align well.`);
  } else if (score.elementHarmony < 50) {
    notes.push(`Elemental contrast (${score.elementHarmony}%) - different approaches may require adaptation.`);
  }

  // Modality
  if (score.modalityScore >= 70) {
    notes.push(`Modality match (${score.modalityScore}%) - similar action styles.`);
  }

  // Archetype resonance
  if (score.archetypeResonance >= 70) {
    notes.push(`Archetype resonance (${score.archetypeResonance}%) - complementary life themes.`);
  }

  // Chart shape
  if (score.chartShapeCompat >= 60) {
    notes.push(`Compatible chart shapes (${score.chartShapeCompat}%) - energy patterns harmonize.`);
  }

  return notes;
}

/**
 * Get the strongest and weakest compatibility sections.
 */
export function getWesternStrengthsAndChallenges(
  score: WesternCompatibilityScore
): { strengths: string[]; challenges: string[] } {
  const sections = [
    { name: 'Element harmony', score: score.elementHarmony },
    { name: 'Modality match', score: score.modalityScore },
    { name: 'House overlay', score: score.houseOverlay },
    { name: 'Planetary interplay', score: score.planetaryInterplay },
    { name: 'Archetype resonance', score: score.archetypeResonance },
    { name: 'Aspect patterns', score: score.aspectPatternCompat },
    { name: 'Dominance alignment', score: score.dominanceAlignment },
    { name: 'Chart shape', score: score.chartShapeCompat }
  ];

  sections.sort((a, b) => b.score - a.score);

  const strengths = sections
    .filter(s => s.score >= 60)
    .slice(0, 3)
    .map(s => `${s.name}: ${s.score}%`);

  const challenges = sections
    .filter(s => s.score < 50)
    .slice(0, 2)
    .map(s => `${s.name}: ${s.score}%`);

  return { strengths, challenges };
}

// =============================================================================
// INTEGRATION WITH MAIN MATCH SCORE
// =============================================================================

export interface ExtendedMatchScoreOptions {
  alpha?: number;  // BaZi weight (default 0.25)
  beta?: number;   // TenGods weight within BaZi (default 0.30)
  gamma?: number;  // Western weight (default 0.15)
  includeWestern?: boolean;  // Whether to include Western (default true)
}

/**
 * Calculate the Western contribution to the total match score.
 *
 * @param profileA - First profile
 * @param profileB - Second profile
 * @param gamma - Western weight in formula
 * @returns Western contribution (gamma * westernScore)
 */
export function calculateWesternContribution(
  profileA: any,
  profileB: any,
  gamma: number = DEFAULT_GAMMA
): { contribution: number; score: number; details: WesternCompatibilityScore } {
  const westernScore = getWesternCompatibilityScore(profileA, profileB);
  const details = calculateWesternCompatibility(profileA, profileB);

  return {
    contribution: gamma * westernScore,
    score: westernScore,
    details
  };
}

/**
 * Adjust the total match score by including Western compatibility.
 *
 * Original: Total = (1-α)*NEO + α*BaZi
 * Extended: Total = (1-α-γ)*NEO + α*BaZi + γ*Western
 *
 * @param originalTotal - Original match score total (0-1)
 * @param originalNeo - Original NEO contribution
 * @param originalBazi - Original BaZi contribution
 * @param westernScore - Western compatibility (0-1)
 * @param options - Alpha, gamma weights
 */
export function adjustTotalWithWestern(
  originalNeo: number,
  originalBazi: number,
  westernScore: number,
  options: ExtendedMatchScoreOptions = {}
): number {
  const alpha = options.alpha ?? 0.25;
  const gamma = options.gamma ?? DEFAULT_GAMMA;

  // Recalculate with Western
  // NEO weight becomes (1 - alpha - gamma) instead of (1 - alpha)
  const neoWeight = 1 - alpha - gamma;

  const total = neoWeight * originalNeo + alpha * originalBazi + gamma * westernScore;

  return Math.max(0, Math.min(1, total));
}

// =============================================================================
// UTILITY EXPORTS
// =============================================================================

export {
  flattenWesternVector,
  cosineSimilarity,
  westernSectionSimilarity,
  createDefaultWesternVector
} from './westernExpressionVector';

export { DEFAULT_SECTION_WEIGHTS, DEFAULT_GAMMA } from '../types/western.types';
