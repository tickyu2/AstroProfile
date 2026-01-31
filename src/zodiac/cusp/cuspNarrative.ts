/**
 * Cusp Narrative Generator
 *
 * Transforms φ-math into human recognition.
 * "Why April 23 feels different than April 30"
 *
 * This layer provides the "Ah-ha" moment without jargon.
 *
 * GENESIS AstroProfile - January 2026
 */

import type { ZodiacSign } from '../../data/tropicalSeasons';
import type { SignBlend } from './phiCurve';

// =============================================================================
// TYPES
// =============================================================================

export interface CuspNarrative {
  headline: string;
  explanation: string;
  livedExperience: string;
}

// =============================================================================
// SIGN ARCHETYPE KEYWORDS
// =============================================================================

const SIGN_KEYWORDS: Record<ZodiacSign, { essence: string; verb: string }> = {
  Aries: { essence: 'initiative', verb: 'initiating' },
  Taurus: { essence: 'stability', verb: 'grounding' },
  Gemini: { essence: 'curiosity', verb: 'exploring' },
  Cancer: { essence: 'nurturing', verb: 'protecting' },
  Leo: { essence: 'expression', verb: 'creating' },
  Virgo: { essence: 'refinement', verb: 'perfecting' },
  Libra: { essence: 'harmony', verb: 'balancing' },
  Scorpio: { essence: 'depth', verb: 'transforming' },
  Sagittarius: { essence: 'expansion', verb: 'seeking' },
  Capricorn: { essence: 'structure', verb: 'building' },
  Aquarius: { essence: 'innovation', verb: 'revolutionizing' },
  Pisces: { essence: 'transcendence', verb: 'dissolving' },
};

// =============================================================================
// MAIN NARRATIVE GENERATOR
// =============================================================================

/**
 * Generate a human-readable narrative for a cusp day
 *
 * @param dateLabel - Human-readable date (e.g., "April 23")
 * @param blend - The φ-curve blend for this day
 * @returns Narrative with headline, explanation, and lived experience
 */
export function generateCuspNarrative(
  dateLabel: string,
  blend: SignBlend[]
): CuspNarrative {
  // Pure sign - no cusp
  if (blend.length === 1) {
    const sign = blend[0].sign as ZodiacSign;
    const { essence } = SIGN_KEYWORDS[sign] || { essence: 'energy' };

    return {
      headline: `${dateLabel} — Pure Seasonal Expression`,
      explanation: `This day sits fully within ${sign} season, expressing its archetype without transitional tension.`,
      livedExperience: `Your energy flows cleanly through ${essence}. There's no pull between seasons — just consistent, focused expression.`,
    };
  }

  // Cusp blend
  const [primary, secondary] = [...blend].sort((a, b) => b.weight - a.weight);
  const p = Math.round(primary.weight * 100);
  const s = Math.round(secondary.weight * 100);

  const primarySign = primary.sign as ZodiacSign;
  const secondarySign = secondary.sign as ZodiacSign;

  const primaryKeywords = SIGN_KEYWORDS[primarySign] || { essence: 'energy', verb: 'expressing' };
  const secondaryKeywords = SIGN_KEYWORDS[secondarySign] || { essence: 'energy', verb: 'expressing' };

  return {
    headline: `${dateLabel} — A Seasonal Threshold`,
    explanation: `This day lies within a cusp window, where ${primarySign} season is stabilizing while ${secondarySign} is still releasing its influence.`,
    livedExperience: `You are primarily ${primarySign} (${p}%), but still carry ${secondarySign} energy (${s}%). This often feels like having one foot planted and the other still in motion — more ${secondaryKeywords.essence} than typical ${primarySign}, more ${primaryKeywords.essence} than typical ${secondarySign}.`,
  };
}

// =============================================================================
// EXTENDED NARRATIVE (with cusp name)
// =============================================================================

/**
 * Generate extended narrative including cusp name
 */
export function generateExtendedCuspNarrative(
  dateLabel: string,
  blend: SignBlend[],
  cuspName?: string
): CuspNarrative & { cuspName?: string; integration: string } {
  const base = generateCuspNarrative(dateLabel, blend);

  if (blend.length === 1) {
    return {
      ...base,
      integration: 'No integration needed — you express one archetype fully.',
    };
  }

  const [primary, secondary] = [...blend].sort((a, b) => b.weight - a.weight);
  const primarySign = primary.sign as ZodiacSign;
  const secondarySign = secondary.sign as ZodiacSign;

  const primaryKeywords = SIGN_KEYWORDS[primarySign];
  const secondaryKeywords = SIGN_KEYWORDS[secondarySign];

  return {
    ...base,
    cuspName,
    integration: `Your growth path: Learn to use ${secondaryKeywords?.essence || 'secondary energy'} as fuel for ${primaryKeywords?.verb || 'primary expression'}, not as a competing force.`,
  };
}

// =============================================================================
// COMPATIBILITY NARRATIVE
// =============================================================================

/**
 * Generate narrative for how two cusp blends interact
 */
export function generateCuspCompatibilityNarrative(
  aName: string,
  aBlend: SignBlend[],
  bName: string,
  bBlend: SignBlend[]
): string {
  const aIsCusp = aBlend.length > 1;
  const bIsCusp = bBlend.length > 1;

  if (!aIsCusp && !bIsCusp) {
    return `Both ${aName} and ${bName} express pure seasonal archetypes — their dynamic is straightforward and direct.`;
  }

  if (aIsCusp && bIsCusp) {
    return `Both carry cusp energy, creating a dynamic interplay of transitional qualities. This adds complexity and nuance — neither is "just one thing."`;
  }

  const cuspPerson = aIsCusp ? aName : bName;
  const purePerson = aIsCusp ? bName : aName;

  return `${cuspPerson} brings cusp energy — flexibility and bridging qualities. ${purePerson} provides stable, focused expression. This combination offers both adaptability and grounding.`;
}
