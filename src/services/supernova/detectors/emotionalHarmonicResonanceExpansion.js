/**
 * ================================================================================
 * DETECTOR #73 — EMOTIONAL HARMONIC RESONANCE EXPANSION
 * ================================================================================
 *
 * Second Harmonic Ring — Twenty-Third Chamber
 *
 * Pattern: Elevated resonance expands outward
 *          → emotional field widens
 *          → harmonics extend across broader relational space
 *
 * The chamber of expansion — resonance becomes spacious, radiant, and far-reaching.
 *
 * Signature phrases:
 * - "Our connection feels bigger than before."
 * - "The emotional field feels wide and open."
 * - "We're resonating across more of our lives."
 * - "Everything feels more expansive."
 *
 * ================================================================================
 */

const TRAIT_INDEX = {
  Initiator: 0, Stabilizer: 1, BoundaryAware: 2, Warm: 3,
  Expressive: 4, DepthOriented: 5, Resilient: 6, Adventurous: 7,
  Relational: 8, MindCentered: 9, FluidIdentity: 10, SystemsOriented: 11,
  Sustainer: 12, ShadowAware: 13, Transcendent: 14, NurtureOriented: 15
};

export function detectEmotionalHarmonicResonanceExpansion(archetypeA, archetypeB) {
  const expansionAxes = [TRAIT_INDEX.Relational, TRAIT_INDEX.Expressive, TRAIT_INDEX.DepthOriented];
  const elevationAxes = [TRAIT_INDEX.Warm, TRAIT_INDEX.FluidIdentity];
  const stabilityAxes = [TRAIT_INDEX.MindCentered, TRAIT_INDEX.Stabilizer, TRAIT_INDEX.Sustainer];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_exp = avg(archetypeA, expansionAxes);
  const B_exp = avg(archetypeB, expansionAxes);
  const A_ele = avg(archetypeA, elevationAxes);
  const B_ele = avg(archetypeB, elevationAxes);
  const A_stab = avg(archetypeA, stabilityAxes);
  const B_stab = avg(archetypeB, stabilityAxes);

  const risingExpansion = (A_exp + B_exp) / 2 >= 0.64;
  const strongElevation = (A_ele + B_ele) / 2 >= 0.58;
  const sustainedStability = (A_stab + B_stab) / 2 >= 0.55;

  if (risingExpansion && strongElevation && sustainedStability) {
    return {
      triggered: true,
      penalty: 0.00,
      destabilizer: 0.00,
      gradeCap: null,
      harmonyCap: null,
      severity: 'none',
      flag: 'Emotional Harmonic Resonance Expansion (Widening and Radiant Growth of Elevated Emotional Resonance)',
      details: {
        combinedExpansion: (A_exp + B_exp) / 2,
        combinedElevation: (A_ele + B_ele) / 2,
        combinedStability: (A_stab + B_stab) / 2
      }
    };
  }
  return { triggered: false };
}

export default detectEmotionalHarmonicResonanceExpansion;
