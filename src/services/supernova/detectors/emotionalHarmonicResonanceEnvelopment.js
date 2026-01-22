/**
 * ================================================================================
 * DETECTOR #78 — EMOTIONAL HARMONIC RESONANCE ENVELOPMENT
 * ================================================================================
 *
 * Second Harmonic Ring — Twenty-Eighth Chamber
 *
 * Pattern: Ambient resonance becomes fully enveloping
 *          → emotional field surrounds and contains experience
 *          → harmonics form a continuous holding field
 *
 * Where permeation becomes total harmonic containment.
 *
 * Signature phrases:
 * - "It feels like we're inside the connection."
 * - "The emotional field surrounds everything we do."
 * - "There's a sense of being held by the resonance."
 * - "The connection feels like an environment."
 *
 * ================================================================================
 */

const TRAIT_INDEX = {
  Initiator: 0, Stabilizer: 1, BoundaryAware: 2, Warm: 3,
  Expressive: 4, DepthOriented: 5, Resilient: 6, Adventurous: 7,
  Relational: 8, MindCentered: 9, FluidIdentity: 10, SystemsOriented: 11,
  Sustainer: 12, ShadowAware: 13, Transcendent: 14, NurtureOriented: 15
};

export function detectEmotionalHarmonicResonanceEnvelopment(archetypeA, archetypeB) {
  const envelopmentAxes = [TRAIT_INDEX.Relational, TRAIT_INDEX.DepthOriented, TRAIT_INDEX.Warm];
  const permeationAxes = [TRAIT_INDEX.MindCentered, TRAIT_INDEX.Stabilizer, TRAIT_INDEX.Sustainer];
  const diffusionAxes = [TRAIT_INDEX.Expressive, TRAIT_INDEX.FluidIdentity];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_env = avg(archetypeA, envelopmentAxes);
  const B_env = avg(archetypeB, envelopmentAxes);
  const A_perm = avg(archetypeA, permeationAxes);
  const B_perm = avg(archetypeB, permeationAxes);
  const A_diff = avg(archetypeA, diffusionAxes);
  const B_diff = avg(archetypeB, diffusionAxes);

  const highEnvelopment = (A_env + B_env) / 2 >= 0.70;
  const strongPermeation = (A_perm + B_perm) / 2 >= 0.62;
  const strongDiffusion = (A_diff + B_diff) / 2 >= 0.58;

  if (highEnvelopment && strongPermeation && strongDiffusion) {
    return {
      triggered: true,
      penalty: 0.00,
      destabilizer: 0.00,
      gradeCap: null,
      harmonyCap: null,
      severity: 'none',
      flag: 'Emotional Harmonic Resonance Envelopment (Immersive, Surrounding, Full-Field Harmonic Containment)',
      details: {
        combinedEnvelopment: (A_env + B_env) / 2,
        combinedPermeation: (A_perm + B_perm) / 2,
        combinedDiffusion: (A_diff + B_diff) / 2
      }
    };
  }
  return { triggered: false };
}

export default detectEmotionalHarmonicResonanceEnvelopment;
