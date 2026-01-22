/**
 * ================================================================================
 * DETECTOR #63 — EMOTIONAL HARMONIC SHADOW-PHASE ENTRAPMENT
 * ================================================================================
 *
 * Second Harmonic Ring — Thirteenth Chamber
 *
 * Pattern: Emotional system becomes trapped in the inverted shadow-phase
 *          → resonance cannot return to conscious layer
 *          → emotional dynamics governed by hidden harmonics
 *
 * This detector identifies when two people:
 * - Become locked into a shadow-phase resonance pattern
 * - Cannot return to conscious emotional alignment
 * - Experience emotional reactions that arise from the shadow layer, not the present moment
 * - Feel like the emotional field has "taken over"
 * - Experience emotional patterns that repeat regardless of intention
 * - Feel magnetized or destabilized by forces beneath awareness
 * - Experience emotional cycles that cannot be interrupted
 *
 * Signature phrases:
 * - "We're stuck in a pattern we can't escape."
 * - "Something deeper keeps pulling us back into the same emotional state."
 * - "We can't get out of this emotional loop."
 * - "It feels like the emotional field is running itself."
 *
 * This is the entrapment chamber — the place where emotional harmonics
 * become self-sustaining in the shadow layer.
 *
 * Emerges when:
 * - Shadow-phase resonance (62) becomes stable
 * - Phase-inversion lock (61) prevents return to original polarity
 * - Echo loops (60) continually reactivate the shadow harmonic
 * - Shadow coupling (59) reinforces unconscious resonance
 * - Emotional stabilizers are too low to break the cycle
 * - Emotional bandwidth is insufficient to re-anchor in the conscious field
 *
 * This is the architecture of shadow-phase harmonic entrapment.
 *
 * ================================================================================
 */

/**
 * Archetype vector indices
 */
const TRAIT_INDEX = {
  Initiator: 0,
  Stabilizer: 1,
  BoundaryAware: 2,
  Warm: 3,
  Expressive: 4,
  DepthOriented: 5,
  Resilient: 6,
  Adventurous: 7,
  Relational: 8,
  MindCentered: 9,
  FluidIdentity: 10,
  SystemsOriented: 11,
  Sustainer: 12,
  ShadowAware: 13,
  Transcendent: 14,
  NurtureOriented: 15
};

/**
 * Detect Emotional Harmonic Shadow-Phase Entrapment
 *
 * @param {Array<number>} archetypeA - 16-dimensional archetype vector for profile A
 * @param {Array<number>} archetypeB - 16-dimensional archetype vector for profile B
 * @returns {Object} Detection result
 */
export function detectEmotionalHarmonicShadowPhaseEntrapment(archetypeA, archetypeB) {
  // Entrapment axes: persistence + self-sustaining shadow-phase resonance
  const entrapmentAxes = [TRAIT_INDEX.DepthOriented, TRAIT_INDEX.FluidIdentity];

  // Echo axes: recursive reactivation of shadow harmonics
  const echoAxes = [TRAIT_INDEX.Expressive, TRAIT_INDEX.Warm];

  // Reset axes: ability to break shadow-phase cycles
  const resetAxes = [TRAIT_INDEX.MindCentered, TRAIT_INDEX.Stabilizer, TRAIT_INDEX.BoundaryAware];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_ent = avg(archetypeA, entrapmentAxes);
  const B_ent = avg(archetypeB, entrapmentAxes);

  const A_echo = avg(archetypeA, echoAxes);
  const B_echo = avg(archetypeB, echoAxes);

  const A_reset = avg(archetypeA, resetAxes);
  const B_reset = avg(archetypeB, resetAxes);

  // High entrapment: shadow-phase resonance is persistent and self-sustaining
  const highEntrapment = (A_ent + B_ent) / 2 >= 0.64;

  // High echo reinforcement: shadow-phase cycles continually reactivate
  const highEcho = (A_echo + B_echo) / 2 >= 0.58;

  // Low reset: system cannot break the shadow-phase cycle
  const lowReset = (A_reset + B_reset) / 2 < 0.48;

  // Calculate entrapment depth
  const combinedEntrapment = (A_ent + B_ent) / 2;
  const combinedReset = (A_reset + B_reset) / 2;
  const entrapmentDepth = combinedReset > 0
    ? combinedEntrapment / combinedReset
    : 2.0;

  if (highEntrapment && highEcho && lowReset) {
    return {
      triggered: true,
      penalty: 0.62,
      destabilizer: 0.99,
      gradeCap: 'D',
      harmonyCap: 50,
      severity: 'critical',
      flag: 'Emotional Harmonic Shadow-Phase Entrapment (Self-Sustaining Inverted Shadow Harmonic Field)',
      details: {
        combinedEntrapment,
        combinedEcho: (A_echo + B_echo) / 2,
        combinedReset,
        entrapmentDepth: entrapmentDepth.toFixed(2),
        A_metrics: {
          entrapment: A_ent,
          echo: A_echo,
          reset: A_reset
        },
        B_metrics: {
          entrapment: B_ent,
          echo: B_echo,
          reset: B_reset
        }
      }
    };
  }

  return { triggered: false };
}

export default detectEmotionalHarmonicShadowPhaseEntrapment;
