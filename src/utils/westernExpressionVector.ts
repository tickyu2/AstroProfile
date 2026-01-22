/**
 * westernExpressionVector.ts
 *
 * Vector operations for Western Expression Vectors.
 * Provides cosine similarity and section-weighted compatibility.
 */

import type {
  WesternExpressionVector,
  WesternSimilarityResult,
  SectionWeights,
  WesternCompatibilityScore
} from '../types/western.types';

import { DEFAULT_SECTION_WEIGHTS, DEFAULT_GAMMA } from '../types/western.types';

// =============================================================================
// VECTOR OPERATIONS
// =============================================================================

/**
 * Flatten WesternExpressionVector to number array.
 * Returns 66-dimensional vector (expandable to 72).
 */
export function flattenWesternVector(vec: WesternExpressionVector): number[] {
  // If pre-computed vector exists, use it
  if (vec.vector && vec.vector.length > 0) {
    return vec.vector;
  }

  return [
    // Elements (4)
    vec.elements.fire,
    vec.elements.earth,
    vec.elements.air,
    vec.elements.water,

    // Modalities (3)
    vec.modalities.cardinal,
    vec.modalities.fixed,
    vec.modalities.mutable,

    // Houses (12)
    ...(vec.houseIntensities || Array(12).fill(0.083)),

    // Planetary Psychology (15)
    vec.planetaryPsychology.sun,
    vec.planetaryPsychology.moon,
    vec.planetaryPsychology.mercury,
    vec.planetaryPsychology.venus,
    vec.planetaryPsychology.mars,
    vec.planetaryPsychology.jupiter,
    vec.planetaryPsychology.saturn,
    vec.planetaryPsychology.uranus,
    vec.planetaryPsychology.neptune,
    vec.planetaryPsychology.pluto,
    vec.planetaryPsychology.ascendant,
    vec.planetaryPsychology.midheaven,
    vec.planetaryPsychology.northNode,
    vec.planetaryPsychology.chiron,
    vec.planetaryPsychology.lilith,

    // Archetypes (9)
    vec.archetypes.warrior,
    vec.archetypes.builder,
    vec.archetypes.messenger,
    vec.archetypes.nurturer,
    vec.archetypes.performer,
    vec.archetypes.analyst,
    vec.archetypes.harmonizer,
    vec.archetypes.transformer,
    vec.archetypes.philosopher,

    // Aspect Patterns (8)
    vec.aspectPatterns.grandTrine,
    vec.aspectPatterns.grandCross,
    vec.aspectPatterns.tSquare,
    vec.aspectPatterns.yod,
    Math.min(1.0, vec.aspectPatterns.stelliumCount / 4.0),
    vec.aspectPatterns.oppositionTension,
    vec.aspectPatterns.conjunctionPower,
    vec.aspectPatterns.aspectHarmony,

    // Dominance (9)
    vec.dominance.dominantSign?.strength ?? 0.5,
    vec.dominance.dominantPlanet?.strength ?? 0.5,
    vec.dominance.dominantHouse?.strength ?? 0.5,
    vec.dominance.elementPurity,
    vec.dominance.modalityPurity,
    vec.dominance.yangYinRatio,
    vec.dominance.nightDayEmphasis,
    Math.min(1.0, vec.dominance.retrogradeCount / 10.0),
    vec.dominance.dignityScore,

    // Chart Shape (6)
    vec.chartShape.bowl,
    vec.chartShape.bucket,
    vec.chartShape.locomotive,
    vec.chartShape.bundle,
    vec.chartShape.splash,
    vec.chartShape.seesaw
  ];  // Total: 4+3+12+15+9+8+9+6 = 66 dimensions
}

/**
 * Calculate cosine similarity between two vectors.
 * Returns value from 0 (orthogonal) to 1 (identical direction).
 */
export function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) {
    console.warn(`Vector length mismatch: ${vectorA.length} vs ${vectorB.length}`);
    // Use shorter length
    const len = Math.min(vectorA.length, vectorB.length);
    vectorA = vectorA.slice(0, len);
    vectorB = vectorB.slice(0, len);
  }

  if (vectorA.length === 0) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    const a = vectorA[i] || 0;
    const b = vectorB[i] || 0;
    dot += a * b;
    normA += a * a;
    normB += b * b;
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);

  if (denominator === 0) return 0;

  return dot / denominator;
}

/**
 * Calculate cosine similarity for a section of the vector.
 */
function sectionCosineSimilarity(
  vectorA: number[],
  vectorB: number[],
  startIdx: number,
  endIdx: number
): number {
  const sectionA = vectorA.slice(startIdx, endIdx);
  const sectionB = vectorB.slice(startIdx, endIdx);
  return cosineSimilarity(sectionA, sectionB);
}

// =============================================================================
// WESTERN COMPATIBILITY
// =============================================================================

/**
 * Section indices in the flattened vector.
 */
const SECTION_INDICES = {
  element: { start: 0, end: 4 },
  modality: { start: 4, end: 7 },
  house: { start: 7, end: 19 },
  planetary: { start: 19, end: 34 },
  archetype: { start: 34, end: 43 },
  aspect: { start: 43, end: 51 },
  dominance: { start: 51, end: 60 },
  shape: { start: 60, end: 66 }
} as const;

/**
 * Calculate section-weighted Western compatibility.
 *
 * Uses cosine similarity per section, then weighted sum.
 */
export function westernSectionSimilarity(
  vectorA: number[],
  vectorB: number[],
  weights: SectionWeights = DEFAULT_SECTION_WEIGHTS
): WesternSimilarityResult {
  const sections: WesternSimilarityResult['sections'] = {
    element: sectionCosineSimilarity(
      vectorA, vectorB,
      SECTION_INDICES.element.start,
      SECTION_INDICES.element.end
    ),
    modality: sectionCosineSimilarity(
      vectorA, vectorB,
      SECTION_INDICES.modality.start,
      SECTION_INDICES.modality.end
    ),
    house: sectionCosineSimilarity(
      vectorA, vectorB,
      SECTION_INDICES.house.start,
      SECTION_INDICES.house.end
    ),
    planetary: sectionCosineSimilarity(
      vectorA, vectorB,
      SECTION_INDICES.planetary.start,
      SECTION_INDICES.planetary.end
    ),
    archetype: sectionCosineSimilarity(
      vectorA, vectorB,
      SECTION_INDICES.archetype.start,
      SECTION_INDICES.archetype.end
    ),
    aspect: sectionCosineSimilarity(
      vectorA, vectorB,
      SECTION_INDICES.aspect.start,
      SECTION_INDICES.aspect.end
    ),
    dominance: sectionCosineSimilarity(
      vectorA, vectorB,
      SECTION_INDICES.dominance.start,
      SECTION_INDICES.dominance.end
    ),
    shape: sectionCosineSimilarity(
      vectorA, vectorB,
      SECTION_INDICES.shape.start,
      SECTION_INDICES.shape.end
    )
  };

  // Weighted total
  const total =
    sections.element * weights.element +
    sections.modality * weights.modality +
    sections.house * weights.house +
    sections.planetary * weights.planetary +
    sections.archetype * weights.archetype +
    sections.aspect * weights.aspect +
    sections.dominance * weights.dominance +
    sections.shape * weights.shape;

  return {
    total: clamp01(total),
    sections
  };
}

/**
 * Calculate full Western compatibility score between two expression vectors.
 */
export function computeWesternCompatibility(
  vecA: WesternExpressionVector,
  vecB: WesternExpressionVector,
  weights: SectionWeights = DEFAULT_SECTION_WEIGHTS
): WesternCompatibilityScore {
  const flatA = flattenWesternVector(vecA);
  const flatB = flattenWesternVector(vecB);

  // Overall cosine
  const vectorCosine = cosineSimilarity(flatA, flatB);

  // Section-wise
  const similarity = westernSectionSimilarity(flatA, flatB, weights);

  return {
    total: Math.round(similarity.total * 100),
    vectorCosine: Number(vectorCosine.toFixed(3)),

    elementHarmony: Math.round(similarity.sections.element * 100),
    modalityScore: Math.round(similarity.sections.modality * 100),
    houseOverlay: Math.round(similarity.sections.house * 100),
    planetaryInterplay: Math.round(similarity.sections.planetary * 100),
    archetypeResonance: Math.round(similarity.sections.archetype * 100),
    aspectPatternCompat: Math.round(similarity.sections.aspect * 100),
    dominanceAlignment: Math.round(similarity.sections.dominance * 100),
    chartShapeCompat: Math.round(similarity.sections.shape * 100),

    vectorADims: flatA.length,
    vectorBDims: flatB.length
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

/**
 * Create a default/neutral Western Expression Vector.
 */
export function createDefaultWesternVector(): WesternExpressionVector {
  return {
    elements: { fire: 0.25, earth: 0.25, air: 0.25, water: 0.25 },
    modalities: { cardinal: 0.33, fixed: 0.33, mutable: 0.34 },
    houseIntensities: Array(12).fill(0.083),
    planetaryPsychology: {
      sun: 0.5, moon: 0.5, mercury: 0.5, venus: 0.5, mars: 0.5,
      jupiter: 0.5, saturn: 0.5, uranus: 0.5, neptune: 0.5, pluto: 0.5,
      ascendant: 0.5, midheaven: 0.5, northNode: 0.5, chiron: 0.5, lilith: 0.5
    },
    archetypes: {
      warrior: 0.11, builder: 0.11, messenger: 0.11, nurturer: 0.11,
      performer: 0.11, analyst: 0.11, harmonizer: 0.11, transformer: 0.11,
      philosopher: 0.12
    },
    aspectPatterns: {
      grandTrine: 0, grandCross: 0, tSquare: 0, yod: 0,
      stelliumCount: 0, oppositionTension: 0, conjunctionPower: 0, aspectHarmony: 0.5
    },
    dominance: {
      dominantSign: { sign: 'Aries', strength: 0.25 },
      dominantPlanet: { planet: 'Sun', strength: 0.5 },
      dominantHouse: { house: 1, strength: 0.25 },
      elementPurity: 0.25,
      modalityPurity: 0.33,
      yangYinRatio: 0.5,
      nightDayEmphasis: 0.5,
      retrogradeCount: 0,
      dignityScore: 0.5
    },
    chartShape: {
      bowl: 0, bucket: 0, locomotive: 0, bundle: 0, splash: 1, seesaw: 0,
      detected: 'splash'
    }
  };
}

/**
 * Get compatibility level label from score.
 */
export function getWesternCompatibilityLevel(score: number): string {
  if (score >= 85) return 'Exceptional';
  if (score >= 70) return 'Strong';
  if (score >= 55) return 'Moderate';
  if (score >= 40) return 'Challenging';
  return 'Difficult';
}

/**
 * Euclidean distance between two vectors.
 * Useful for some distance-based comparisons.
 */
export function euclideanDistance(vectorA: number[], vectorB: number[]): number {
  const len = Math.min(vectorA.length, vectorB.length);
  let sumSquares = 0;

  for (let i = 0; i < len; i++) {
    const diff = (vectorA[i] || 0) - (vectorB[i] || 0);
    sumSquares += diff * diff;
  }

  return Math.sqrt(sumSquares);
}

/**
 * Normalize Euclidean distance to 0-1 similarity score.
 */
export function euclideanSimilarity(vectorA: number[], vectorB: number[]): number {
  const dist = euclideanDistance(vectorA, vectorB);
  const maxDist = Math.sqrt(vectorA.length);  // Max possible distance
  return 1 - (dist / maxDist);
}
