/**
 * Cusp Explanation for Compatibility
 *
 * Interprets how cusp blends affect aspect dynamics.
 * "Your Taurus-Aries blend softens this opposition"
 *
 * This layer explains the math already happening in the synastry engine.
 *
 * GENESIS AstroProfile - January 2026
 */

import type { SignBlend } from '../cusp/phiCurve';
import type { AspectType } from './types';

// =============================================================================
// CUSP EFFECT ON ASPECT
// =============================================================================

/**
 * Explain how cusp blending affects an aspect
 *
 * @param aBlend - Person A's sign blend for this point
 * @param bBlend - Person B's sign blend for this point
 * @param aspect - The aspect type between them
 * @returns Explanation string, or null if no cusp effect
 */
export function explainCuspEffectOnAspect(
  aBlend: SignBlend[],
  bBlend: SignBlend[],
  aspect: AspectType
): string | null {
  // No cusp on either side
  if (aBlend.length <= 1 && bBlend.length <= 1) {
    return null;
  }

  const aHasCusp = aBlend.length > 1 && aBlend[1].weight >= 0.05;
  const bHasCusp = bBlend.length > 1 && bBlend[1].weight >= 0.05;

  if (!aHasCusp && !bHasCusp) {
    return null;
  }

  // Get secondary signs if present
  const aSecondary = aHasCusp ? aBlend[1].sign : null;
  const bSecondary = bHasCusp ? bBlend[1].sign : null;

  // Generate aspect-specific explanation
  switch (aspect) {
    case 'opposition':
      return generateOppositionExplanation(aHasCusp, bHasCusp, aSecondary, bSecondary);

    case 'square':
      return generateSquareExplanation(aHasCusp, bHasCusp);

    case 'trine':
      return generateTrineExplanation(aHasCusp, bHasCusp);

    case 'sextile':
      return generateSextileExplanation(aHasCusp, bHasCusp);

    case 'conjunction':
      return generateConjunctionExplanation(aHasCusp, bHasCusp);

    default:
      return null;
  }
}

// =============================================================================
// ASPECT-SPECIFIC EXPLANATIONS
// =============================================================================

function generateOppositionExplanation(
  aHasCusp: boolean,
  bHasCusp: boolean,
  _aSecondary: string | null,
  _bSecondary: string | null
): string {
  if (aHasCusp && bHasCusp) {
    return 'This opposition is significantly softened — both parties carry transitional energy, making the polarity more negotiable and less absolute.';
  }
  return 'Cusp blending softens this opposition. Transitional energy reduces polarity, making the dynamic more workable.';
}

function generateSquareExplanation(aHasCusp: boolean, bHasCusp: boolean): string {
  if (aHasCusp && bHasCusp) {
    return 'Cusp blending on both sides diffuses this square significantly. Instead of sharp friction, the tension becomes adjustable and developmental.';
  }
  return 'Cusp blending diffuses this square. The friction feels adjustable rather than fixed — there\'s room to negotiate.';
}

function generateTrineExplanation(aHasCusp: boolean, bHasCusp: boolean): string {
  if (aHasCusp && bHasCusp) {
    return 'Cusp energy adds texture to this trine, preventing stagnation. The ease is still there, but with more dynamic range.';
  }
  return 'Cusp blending adds nuance to this trine. The natural harmony gains depth without losing its supportive quality.';
}

function generateSextileExplanation(aHasCusp: boolean, bHasCusp: boolean): string {
  if (aHasCusp && bHasCusp) {
    return 'The sextile\'s opportunity energy is enhanced by cusp flexibility on both sides — more pathways for collaboration.';
  }
  return 'Cusp energy amplifies this sextile\'s potential. The opportunity for synergy gains additional expression channels.';
}

function generateConjunctionExplanation(aHasCusp: boolean, bHasCusp: boolean): string {
  if (aHasCusp && bHasCusp) {
    return 'Both carrying cusp blends adds complexity to this conjunction — the merger has more dimensions than a pure-sign fusion.';
  }
  return 'Cusp blending introduces subtle variation into this conjunction. The unity has an undertone of complementary difference.';
}

// =============================================================================
// CUSP COMPATIBILITY SUMMARY
// =============================================================================

/**
 * Generate a summary of how cusps affect overall compatibility
 */
export function generateCuspCompatibilitySummary(
  aName: string,
  aBlends: { Sun?: SignBlend[]; Moon?: SignBlend[]; Rising?: SignBlend[] },
  bName: string,
  bBlends: { Sun?: SignBlend[]; Moon?: SignBlend[]; Rising?: SignBlend[] }
): string {
  const aCusps: string[] = [];
  const bCusps: string[] = [];

  // Count cusps for each person
  if (aBlends.Sun && aBlends.Sun.length > 1) aCusps.push('Sun');
  if (aBlends.Moon && aBlends.Moon.length > 1) aCusps.push('Moon');
  if (aBlends.Rising && aBlends.Rising.length > 1) aCusps.push('Rising');

  if (bBlends.Sun && bBlends.Sun.length > 1) bCusps.push('Sun');
  if (bBlends.Moon && bBlends.Moon.length > 1) bCusps.push('Moon');
  if (bBlends.Rising && bBlends.Rising.length > 1) bCusps.push('Rising');

  // No cusps
  if (aCusps.length === 0 && bCusps.length === 0) {
    return `Neither ${aName} nor ${bName} has significant cusp energy — compatibility is based on pure archetypal dynamics.`;
  }

  // Both have cusps
  if (aCusps.length > 0 && bCusps.length > 0) {
    return `Both carry cusp energy (${aName}: ${aCusps.join(', ')}; ${bName}: ${bCusps.join(', ')}). This creates a relationship with more dimensional range — hard aspects soften, easy aspects gain texture.`;
  }

  // Only one has cusps
  const cuspPerson = aCusps.length > 0 ? aName : bName;
  const cuspList = aCusps.length > 0 ? aCusps : bCusps;
  const purePerson = aCusps.length > 0 ? bName : aName;

  return `${cuspPerson} brings cusp flexibility (${cuspList.join(', ')}) while ${purePerson} provides archetypal consistency. This combination offers adaptability grounded in clarity.`;
}

// =============================================================================
// CUSP TAGS FOR CELLS
// =============================================================================

/**
 * Generate tags for a synastry cell based on cusp influence
 */
export function generateCuspCellTags(
  aBlend: SignBlend[],
  bBlend: SignBlend[]
): string[] {
  const tags: string[] = [];

  const aHasCusp = aBlend.length > 1 && aBlend[1].weight >= 0.05;
  const bHasCusp = bBlend.length > 1 && bBlend[1].weight >= 0.05;

  if (aHasCusp && bHasCusp) {
    tags.push('Dual-Cusp');
  } else if (aHasCusp || bHasCusp) {
    tags.push('Cusp-Modified');
  }

  // Strong cusp influence (>20% secondary)
  const aStrong = aBlend.length > 1 && aBlend[1].weight >= 0.20;
  const bStrong = bBlend.length > 1 && bBlend[1].weight >= 0.20;

  if (aStrong || bStrong) {
    tags.push('Strong-Blend');
  }

  return tags;
}
