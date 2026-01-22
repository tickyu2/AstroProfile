/**
 * ================================================================================
 * DETECTOR #67 — EMOTIONAL HARMONIC BASELINE REVERSION
 * ================================================================================
 *
 * Second Harmonic Ring — Seventeenth Chamber
 *
 * Pattern: Emotional system begins returning toward its original harmonic baseline
 *          → early signs of resonance re-emergence
 *          → low-amplitude upward correction
 *
 * This is the first chamber that turns the emotional system upward again.
 * It marks the beginning of emotional harmonic recovery.
 *
 * Signature phrases:
 * - "Something feels like it's coming back online."
 * - "We're starting to feel a little more connected again."
 * - "The emotional field feels like it's re-forming."
 * - "There's a faint sense of resonance returning."
 *
 * ================================================================================
 */

const TRAIT_INDEX = {
  Initiator: 0, Stabilizer: 1, BoundaryAware: 2, Warm: 3,
  Expressive: 4, DepthOriented: 5, Resilient: 6, Adventurous: 7,
  Relational: 8, MindCentered: 9, FluidIdentity: 10, SystemsOriented: 11,
  Sustainer: 12, ShadowAware: 13, Transcendent: 14, NurtureOriented: 15
};

export function detectEmotionalHarmonicBaselineReversion(archetypeA, archetypeB) {
  const reversionAxes = [TRAIT_INDEX.Expressive, TRAIT_INDEX.Warm];
  const baselineAxes = [TRAIT_INDEX.Relational, TRAIT_INDEX.DepthOriented];
  const stabilityAxes = [TRAIT_INDEX.MindCentered, TRAIT_INDEX.Stabilizer, TRAIT_INDEX.Sustainer];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_rev = avg(archetypeA, reversionAxes);
  const B_rev = avg(archetypeB, reversionAxes);
  const A_base = avg(archetypeA, baselineAxes);
  const B_base = avg(archetypeB, baselineAxes);
  const A_stab = avg(archetypeA, stabilityAxes);
  const B_stab = avg(archetypeB, stabilityAxes);

  const lowDrift = (A_rev + B_rev) / 2 >= 0.40;
  const baselinePull = (A_base + B_base) / 2 >= 0.50;
  const moderateStability = (A_stab + B_stab) / 2 >= 0.48;

  if (lowDrift && baselinePull && moderateStability) {
    return {
      triggered: true,
      penalty: 0.30,
      destabilizer: 0.40,
      gradeCap: 'B-',
      harmonyCap: 72,
      severity: 'mild',
      flag: 'Emotional Harmonic Baseline Reversion (Early Return Toward Original Harmonic Baseline)',
      details: {
        combinedReversion: (A_rev + B_rev) / 2,
        combinedBaseline: (A_base + B_base) / 2,
        combinedStability: (A_stab + B_stab) / 2
      }
    };
  }
  return { triggered: false };
}

export default detectEmotionalHarmonicBaselineReversion;
