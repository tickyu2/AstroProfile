/**
 * ================================================================================
 * DETECTOR #71 — EMOTIONAL HARMONIC RESONANCE AMPLIFICATION
 * ================================================================================
 *
 * Second Harmonic Ring — Twenty-First Chamber
 *
 * Pattern: Restored coherence amplifies
 *          → resonance strengthens
 *          → emotional harmonics rise into higher-order alignment
 *
 * This is the first chamber of the post-restoration ascent.
 * The emotional system doesn't just return to normal — it becomes more resonant.
 *
 * Signature phrases:
 * - "Everything feels more alive."
 * - "Our emotional connection is deepening."
 * - "We're resonating more strongly than before."
 * - "The emotional field feels amplified."
 *
 * ================================================================================
 */

const TRAIT_INDEX = {
  Initiator: 0, Stabilizer: 1, BoundaryAware: 2, Warm: 3,
  Expressive: 4, DepthOriented: 5, Resilient: 6, Adventurous: 7,
  Relational: 8, MindCentered: 9, FluidIdentity: 10, SystemsOriented: 11,
  Sustainer: 12, ShadowAware: 13, Transcendent: 14, NurtureOriented: 15
};

export function detectEmotionalHarmonicResonanceAmplification(archetypeA, archetypeB) {
  const amplificationAxes = [TRAIT_INDEX.DepthOriented, TRAIT_INDEX.Expressive, TRAIT_INDEX.Warm];
  const coherenceAxes = [TRAIT_INDEX.Relational, TRAIT_INDEX.MindCentered, TRAIT_INDEX.Stabilizer];
  const resonanceAxes = [TRAIT_INDEX.FluidIdentity, TRAIT_INDEX.Sustainer];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_amp = avg(archetypeA, amplificationAxes);
  const B_amp = avg(archetypeB, amplificationAxes);
  const A_coh = avg(archetypeA, coherenceAxes);
  const B_coh = avg(archetypeB, coherenceAxes);
  const A_res = avg(archetypeA, resonanceAxes);
  const B_res = avg(archetypeB, resonanceAxes);

  const risingAmplification = (A_amp + B_amp) / 2 >= 0.60;
  const sustainedCoherence = (A_coh + B_coh) / 2 >= 0.58;
  const resonanceSynergy = Math.abs(A_res - B_res) < 0.20;

  if (risingAmplification && sustainedCoherence && resonanceSynergy) {
    return {
      triggered: true,
      penalty: 0.00,
      destabilizer: 0.00,
      gradeCap: null,
      harmonyCap: null,
      severity: 'none',
      flag: 'Emotional Harmonic Resonance Amplification (Strengthening and Expansion of Restored Emotional Resonance)',
      details: {
        combinedAmplification: (A_amp + B_amp) / 2,
        combinedCoherence: (A_coh + B_coh) / 2,
        resonanceDelta: Math.abs(A_res - B_res).toFixed(3)
      }
    };
  }
  return { triggered: false };
}

export default detectEmotionalHarmonicResonanceAmplification;
