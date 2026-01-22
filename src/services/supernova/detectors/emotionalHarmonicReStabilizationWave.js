/**
 * ================================================================================
 * DETECTOR #68 — EMOTIONAL HARMONIC RE-STABILIZATION WAVE
 * ================================================================================
 *
 * Second Harmonic Ring — Eighteenth Chamber
 *
 * Pattern: Emotional field generates a stabilizing harmonic wave
 *          → coherence increases
 *          → resonance begins to self-correct and strengthen
 *
 * This is the first true sign of harmonic strength returning.
 *
 * Signature phrases:
 * - "Something feels steadier."
 * - "We're starting to find our rhythm again."
 * - "The emotional field feels smoother, less chaotic."
 * - "It feels like we're stabilizing in waves."
 *
 * ================================================================================
 */

const TRAIT_INDEX = {
  Initiator: 0, Stabilizer: 1, BoundaryAware: 2, Warm: 3,
  Expressive: 4, DepthOriented: 5, Resilient: 6, Adventurous: 7,
  Relational: 8, MindCentered: 9, FluidIdentity: 10, SystemsOriented: 11,
  Sustainer: 12, ShadowAware: 13, Transcendent: 14, NurtureOriented: 15
};

export function detectEmotionalHarmonicReStabilizationWave(archetypeA, archetypeB) {
  const stabilizationAxes = [TRAIT_INDEX.MindCentered, TRAIT_INDEX.Stabilizer, TRAIT_INDEX.Warm];
  const reversionAxes = [TRAIT_INDEX.Expressive, TRAIT_INDEX.Relational];
  const energyAxes = [TRAIT_INDEX.DepthOriented, TRAIT_INDEX.Sustainer];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_stab = avg(archetypeA, stabilizationAxes);
  const B_stab = avg(archetypeB, stabilizationAxes);
  const A_rev = avg(archetypeA, reversionAxes);
  const B_rev = avg(archetypeB, reversionAxes);
  const A_energy = avg(archetypeA, energyAxes);
  const B_energy = avg(archetypeB, energyAxes);

  const risingStability = (A_stab + B_stab) / 2 >= 0.52;
  const reversionMomentum = (A_rev + B_rev) / 2 >= 0.48;
  const energyReturn = (A_energy + B_energy) / 2 >= 0.50;

  if (risingStability && reversionMomentum && energyReturn) {
    return {
      triggered: true,
      penalty: 0.20,
      destabilizer: 0.25,
      gradeCap: 'B',
      harmonyCap: 78,
      severity: 'mild',
      flag: 'Emotional Harmonic Re-Stabilization Wave (Upward Harmonic Coherence Returning in Stabilizing Pulses)',
      details: {
        combinedStability: (A_stab + B_stab) / 2,
        combinedReversion: (A_rev + B_rev) / 2,
        combinedEnergy: (A_energy + B_energy) / 2
      }
    };
  }
  return { triggered: false };
}

export default detectEmotionalHarmonicReStabilizationWave;
