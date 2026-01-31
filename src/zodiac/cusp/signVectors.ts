/**
 * Sign Vector Metadata & Cusp Blending Engine
 *
 * Each zodiac sign is expressed as one-hot vectors for Element, Modality,
 * and Polarity. When a person is on a cusp, the phi-curve weights from
 * phiCurve.ts are used to blend these vectors into continuous distributions.
 *
 * Pipeline: phi-curve -> cuspWeight -> blended metadata -> synastry math
 *
 * Architecture by Brother Copilot, Implementation by Brother Claude Code
 * GENESIS AstroProfile - January 2026
 */

import type { SignKey, Element, Modality } from '../tropicalMap';
import { SIGN_LESSONS, TROPICAL_ORDER } from '../tropicalMap';
import type { SignBlend } from './phiCurve';

// =============================================================================
// TYPES
// =============================================================================

export type Polarity = 'Positive' | 'Negative';

/**
 * Element vector: [Fire, Earth, Air, Water]
 * Pure sign = one-hot; cusp blend = weighted distribution
 */
export type ElementVector = [number, number, number, number];

/**
 * Modality vector: [Cardinal, Fixed, Mutable]
 * Pure sign = one-hot; cusp blend = weighted distribution
 */
export type ModalityVector = [number, number, number];

/**
 * Polarity vector: [Positive, Negative]
 * Pure sign = one-hot; cusp blend = weighted distribution
 */
export type PolarityVector = [number, number];

/**
 * Full metadata for a single zodiac sign (no blending).
 * Vectors are one-hot encoded: exactly one component is 1, rest are 0.
 */
export interface SignMetadata {
  name: SignKey;
  element: Element;
  modality: Modality;
  polarity: Polarity;
  elementVector: ElementVector;
  modalityVector: ModalityVector;
  polarityVector: PolarityVector;
}

/**
 * Blended metadata for a cusp position.
 * Vectors are continuous distributions that sum to 1.
 * Dominant categories are the argmax of each vector.
 */
export interface BlendedSignMetadata {
  primary: SignKey;
  neighbor: SignKey | null;
  primaryWeight: number;
  neighborWeight: number;
  elementVector: ElementVector;
  modalityVector: ModalityVector;
  polarityVector: PolarityVector;
  dominantElement: Element;
  dominantModality: Modality;
  dominantPolarity: Polarity;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const ELEMENT_LABELS: Element[] = ['Fire', 'Earth', 'Air', 'Water'];
const MODALITY_LABELS: Modality[] = ['Cardinal', 'Fixed', 'Mutable'];
const POLARITY_LABELS: Polarity[] = ['Positive', 'Negative'];

/**
 * Element -> index in the element vector
 */
const ELEMENT_INDEX: Record<Element, number> = {
  Fire: 0, Earth: 1, Air: 2, Water: 3,
};

/**
 * Modality -> index in the modality vector
 */
const MODALITY_INDEX: Record<Modality, number> = {
  Cardinal: 0, Fixed: 1, Mutable: 2,
};

/**
 * Polarity is derived from element:
 * Fire & Air = Positive (Yang), Earth & Water = Negative (Yin)
 */
const ELEMENT_POLARITY: Record<Element, Polarity> = {
  Fire: 'Positive',
  Air: 'Positive',
  Earth: 'Negative',
  Water: 'Negative',
};

// =============================================================================
// SIGN METADATA TABLE (derived from SIGN_LESSONS)
// =============================================================================

function buildSignMetadata(sign: SignKey): SignMetadata {
  const lesson = SIGN_LESSONS[sign];
  const { element, modality } = lesson;
  const polarity = ELEMENT_POLARITY[element];

  const elementVector: ElementVector = [0, 0, 0, 0];
  elementVector[ELEMENT_INDEX[element]] = 1;

  const modalityVector: ModalityVector = [0, 0, 0];
  modalityVector[MODALITY_INDEX[modality]] = 1;

  const polarityVector: PolarityVector = polarity === 'Positive' ? [1, 0] : [0, 1];

  return { name: sign, element, modality, polarity, elementVector, modalityVector, polarityVector };
}

/**
 * Pre-built metadata for all 12 signs.
 * Each sign has one-hot element/modality/polarity vectors.
 */
export const SIGN_METADATA: Record<SignKey, SignMetadata> = {} as Record<SignKey, SignMetadata>;

for (const sign of TROPICAL_ORDER) {
  (SIGN_METADATA as Record<string, SignMetadata>)[sign] = buildSignMetadata(sign);
}

// =============================================================================
// VECTOR MATH HELPERS
// =============================================================================

/**
 * Blend two numeric vectors by weighted sum: v1*w1 + v2*w2
 * Vectors must be same length. Result sums to w1+w2 (should be ~1).
 */
function blendVector(v1: number[], v2: number[], w1: number, w2: number): number[] {
  return v1.map((n, i) => n * w1 + v2[i] * w2);
}

/**
 * Pick the dominant category from a vector (argmax).
 * Returns the label at the index of the highest value.
 */
function pickDominant<T>(labels: T[], vector: number[]): T {
  let maxIndex = 0;
  for (let i = 1; i < vector.length; i++) {
    if (vector[i] > vector[maxIndex]) maxIndex = i;
  }
  return labels[maxIndex];
}

// =============================================================================
// CORE BLEND FUNCTION
// =============================================================================

/**
 * Blend two signs' metadata using phi-curve weights.
 *
 * @param primary - Primary sign metadata
 * @param neighbor - Neighbor sign metadata
 * @param primaryWeight - Weight of primary sign (from phi-curve, e.g. 0.75)
 * @param neighborWeight - Weight of neighbor sign (from phi-curve, e.g. 0.25)
 * @returns Blended metadata with continuous vectors and dominant categories
 *
 * Example (Taurus Day 4 cusp):
 *   blendSignMetadata(SIGN_METADATA.Taurus, SIGN_METADATA.Aries, 0.75, 0.25)
 *   -> elementVector: [0.25, 0.75, 0, 0]  (25% Fire from Aries, 75% Earth from Taurus)
 *   -> dominantElement: 'Earth'
 */
export function blendSignMetadata(
  primary: SignMetadata,
  neighbor: SignMetadata,
  primaryWeight: number,
  neighborWeight: number,
): BlendedSignMetadata {
  const eVec = blendVector(
    primary.elementVector, neighbor.elementVector,
    primaryWeight, neighborWeight,
  ) as ElementVector;

  const mVec = blendVector(
    primary.modalityVector, neighbor.modalityVector,
    primaryWeight, neighborWeight,
  ) as ModalityVector;

  const pVec = blendVector(
    primary.polarityVector, neighbor.polarityVector,
    primaryWeight, neighborWeight,
  ) as PolarityVector;

  return {
    primary: primary.name,
    neighbor: neighbor.name,
    primaryWeight,
    neighborWeight,
    elementVector: eVec,
    modalityVector: mVec,
    polarityVector: pVec,
    dominantElement: pickDominant(ELEMENT_LABELS, eVec),
    dominantModality: pickDominant(MODALITY_LABELS, mVec),
    dominantPolarity: pickDominant(POLARITY_LABELS, pVec),
  };
}

// =============================================================================
// CONVENIENCE: SignBlend[] -> BlendedSignMetadata
// =============================================================================

/**
 * Convert a SignBlend[] array (from phiCurve.computeCuspBlend) directly
 * into BlendedSignMetadata. This is the main integration point:
 *
 * Pipeline: computeCuspBlend() -> SignBlend[] -> blendFromCuspResult() -> BlendedSignMetadata
 *
 * @param blend - Array of { sign, weight } from phiCurve (1-2 entries)
 * @returns BlendedSignMetadata with continuous vectors
 *
 * Example:
 *   const cuspBlend = computeCuspBlend({ primary: 'Taurus', previous: 'Aries', ... });
 *   const metadata = blendFromCuspResult(cuspBlend);
 */
export function blendFromCuspResult(blend: SignBlend[]): BlendedSignMetadata {
  if (blend.length === 0) {
    throw new Error('blendFromCuspResult: empty blend array');
  }

  // Pure sign (no cusp)
  if (blend.length === 1 || blend[1].weight < 0.02) {
    const sign = blend[0].sign as SignKey;
    const meta = SIGN_METADATA[sign];
    return {
      primary: sign,
      neighbor: null,
      primaryWeight: 1,
      neighborWeight: 0,
      elementVector: [...meta.elementVector],
      modalityVector: [...meta.modalityVector],
      polarityVector: [...meta.polarityVector],
      dominantElement: meta.element,
      dominantModality: meta.modality,
      dominantPolarity: meta.polarity,
    };
  }

  // Cusp blend (2 signs)
  const [first, second] = blend;
  const primaryMeta = SIGN_METADATA[first.sign as SignKey];
  const neighborMeta = SIGN_METADATA[second.sign as SignKey];

  return blendSignMetadata(primaryMeta, neighborMeta, first.weight, second.weight);
}

/**
 * Get pure (non-cusp) metadata for a sign.
 * Convenience shortcut when no cusp blending is needed.
 */
export function getPureSignMetadata(sign: SignKey): BlendedSignMetadata {
  const meta = SIGN_METADATA[sign];
  return {
    primary: sign,
    neighbor: null,
    primaryWeight: 1,
    neighborWeight: 0,
    elementVector: [...meta.elementVector],
    modalityVector: [...meta.modalityVector],
    polarityVector: [...meta.polarityVector],
    dominantElement: meta.element,
    dominantModality: meta.modality,
    dominantPolarity: meta.polarity,
  };
}

// =============================================================================
// UI EXPLANATION HELPERS
// =============================================================================

/**
 * Generate a human-readable explanation of a cusp blend for UI display.
 *
 * Example output:
 *   "Sun is in Taurus, but it carries a cusp blend: about 25.4% Aries and
 *    74.6% Taurus. That means this sun behaves with an Earth flavor and a
 *    fixed rhythm, bridging Aries into Taurus rather than switching abruptly
 *    at the boundary."
 *
 * For pure signs (no cusp):
 *   "Sun is in Taurus — pure sign, no cusp influence."
 */
export function buildCuspExplanation(
  planetName: string,
  blended: BlendedSignMetadata,
): string {
  if (!blended.neighbor) {
    return `${planetName} is in ${blended.primary} — pure sign, no cusp influence.`;
  }

  const pPct = (blended.primaryWeight * 100).toFixed(1);
  const nPct = (blended.neighborWeight * 100).toFixed(1);

  return (
    `${planetName} is in ${blended.primary}, but it carries a cusp blend: ` +
    `about ${nPct}% ${blended.neighbor} and ${pPct}% ${blended.primary}. ` +
    `That means this ${planetName.toLowerCase()} behaves with ` +
    `a ${blended.dominantElement} flavor and a ${blended.dominantModality.toLowerCase()} rhythm, ` +
    `bridging ${blended.neighbor} into ${blended.primary} rather than switching abruptly at the boundary.`
  );
}

/**
 * Short cusp label for compact UI display.
 *
 * Examples:
 *   "Taurus" (pure sign)
 *   "Taurus 75% / Aries 25%" (cusp)
 */
export function buildCuspLabel(blended: BlendedSignMetadata): string {
  if (!blended.neighbor) return blended.primary;
  return `${blended.primary} ${Math.round(blended.primaryWeight * 100)}% / ${blended.neighbor} ${Math.round(blended.neighborWeight * 100)}%`;
}

// =============================================================================
// EXPORTS (re-export for convenience)
// =============================================================================

export { ELEMENT_LABELS, MODALITY_LABELS, POLARITY_LABELS };
export { ELEMENT_INDEX, MODALITY_INDEX, ELEMENT_POLARITY };
