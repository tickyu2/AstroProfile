/**
 * ================================================================================
 * DETECTOR #66 — EMOTIONAL HARMONIC GROUND-STATE DRIFT
 * ================================================================================
 *
 * Second Harmonic Ring — Sixteenth Chamber
 *
 * Pattern: Emotional system drifts toward a new low-energy baseline
 *          → resonance no longer anchors
 *          → emotional field reconfigures into a neutral, drifting ground-state
 *
 * This detector identifies when two people:
 * - Feel the emotional field settling into a quiet, low-energy baseline
 * - Experience emotional reactions that feel muted, slow, or directionless
 * - Sense that the emotional system is no longer anchored to its old patterns
 * - Feel like the emotional field is "floating" or "drifting"
 * - Experience emotional cycles that no longer have clear peaks or troughs
 * - Feel like the emotional connection is neither present nor absent — just drifting
 *
 * Signature phrases:
 * - "It feels like everything has gone quiet."
 * - "We're not fighting, but we're not connecting either."
 * - "The emotional field feels neutral, suspended."
 * - "It's like we're drifting without direction."
 *
 * This is the ground-state drift chamber — the place where the emotional
 * system begins to settle into a new equilibrium after collapse and decay.
 *
 * ================================================================================
 */

const TRAIT_INDEX = {
  Initiator: 0, Stabilizer: 1, BoundaryAware: 2, Warm: 3,
  Expressive: 4, DepthOriented: 5, Resilient: 6, Adventurous: 7,
  Relational: 8, MindCentered: 9, FluidIdentity: 10, SystemsOriented: 11,
  Sustainer: 12, ShadowAware: 13, Transcendent: 14, NurtureOriented: 15
};

export function detectEmotionalHarmonicGroundStateDrift(archetypeA, archetypeB) {
  const driftAxes = [TRAIT_INDEX.Expressive, TRAIT_INDEX.Warm];
  const groundAxes = [TRAIT_INDEX.MindCentered, TRAIT_INDEX.BoundaryAware];
  const energyAxes = [TRAIT_INDEX.Relational, TRAIT_INDEX.DepthOriented, TRAIT_INDEX.Stabilizer];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_drift = avg(archetypeA, driftAxes);
  const B_drift = avg(archetypeB, driftAxes);
  const A_ground = avg(archetypeA, groundAxes);
  const B_ground = avg(archetypeB, groundAxes);
  const A_energy = avg(archetypeA, energyAxes);
  const B_energy = avg(archetypeB, energyAxes);

  const highDrift = (A_drift + B_drift) / 2 < 0.45;
  const groundNeutrality = (A_ground + B_ground) / 2 >= 0.50;
  const lowEnergy = (A_energy + B_energy) / 2 < 0.48;

  if (highDrift && groundNeutrality && lowEnergy) {
    return {
      triggered: true,
      penalty: 0.68,
      destabilizer: 1.00,
      gradeCap: 'D-',
      harmonyCap: 42,
      severity: 'critical',
      flag: 'Emotional Harmonic Ground-State Drift (Reconfiguration into Low-Energy Emotional Baseline)',
      details: {
        combinedDrift: (A_drift + B_drift) / 2,
        combinedGround: (A_ground + B_ground) / 2,
        combinedEnergy: (A_energy + B_energy) / 2
      }
    };
  }
  return { triggered: false };
}

export default detectEmotionalHarmonicGroundStateDrift;
