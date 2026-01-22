/**
 * ================================================================================
 * DETECTOR #61 — EMOTIONAL HARMONIC PHASE-INVERSION LOCK
 * ================================================================================
 *
 * Second Harmonic Ring — Eleventh Chamber
 *
 * Pattern: Emotional field becomes locked in inverted phase
 *          → resonance cannot return to original polarity
 *          → emotional dynamics stabilize in reversed form
 *
 * This detector identifies when two people:
 * - Experience emotional inversion (58) that becomes persistent
 * - Feel emotional signals that remain reversed over time
 * - Cannot return to their original emotional polarity
 * - Experience emotional patterns that "stick" in their inverted form
 * - Feel like the emotional field has "flipped and frozen"
 * - Experience emotional reactions that no longer match conscious intentions
 *
 * Signature phrases:
 * - "It feels like we're stuck in the opposite of what we used to be."
 * - "Our emotional reactions don't reset anymore."
 * - "The inversion has become the new normal."
 * - "We can't get back to how we used to resonate."
 *
 * This is the phase-inversion lock chamber — the place where emotional
 * polarity becomes fixed in its reversed state.
 *
 * Emerges when:
 * - Emotional inversion (58) becomes stable
 * - Shadow coupling (59) reinforces the inverted polarity
 * - Echo loops (60) repeatedly re-activate the inverted harmonics
 * - Emotional stabilizers are too low to restore original phase
 * - Emotional cycles cannot complete or reset
 * - The emotional field reorganizes around the inverted baseline
 *
 * This is the architecture of locked emotional inversion.
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
 * Detect Emotional Harmonic Phase-Inversion Lock
 *
 * @param {Array<number>} archetypeA - 16-dimensional archetype vector for profile A
 * @param {Array<number>} archetypeB - 16-dimensional archetype vector for profile B
 * @returns {Object} Detection result
 */
export function detectEmotionalHarmonicPhaseInversionLock(archetypeA, archetypeB) {
  // Inversion axes: polarity reversal + emotional signal flipping
  const inversionAxes = [TRAIT_INDEX.Expressive, TRAIT_INDEX.FluidIdentity];

  // Lock axes: persistence + rigidity of emotional patterns
  const lockAxes = [TRAIT_INDEX.DepthOriented, TRAIT_INDEX.BoundaryAware];

  // Reset axes: ability to return to original emotional polarity
  const resetAxes = [TRAIT_INDEX.MindCentered, TRAIT_INDEX.Stabilizer, TRAIT_INDEX.Sustainer];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_inv = avg(archetypeA, inversionAxes);
  const B_inv = avg(archetypeB, inversionAxes);

  const A_lock = avg(archetypeA, lockAxes);
  const B_lock = avg(archetypeB, lockAxes);

  const A_reset = avg(archetypeA, resetAxes);
  const B_reset = avg(archetypeB, resetAxes);

  // High inversion: polarity is reversed
  const highInversion = (A_inv + B_inv) / 2 >= 0.60;

  // High lock: emotional patterns are rigid or persistent
  const highLock = (A_lock + B_lock) / 2 >= 0.58;

  // Low reset: system cannot return to original polarity
  const lowReset = (A_reset + B_reset) / 2 < 0.50;

  // Calculate lock intensity
  const combinedLock = (A_lock + B_lock) / 2;
  const combinedReset = (A_reset + B_reset) / 2;
  const lockIntensity = combinedReset > 0
    ? combinedLock / combinedReset
    : 2.0;

  if (highInversion && highLock && lowReset) {
    return {
      triggered: true,
      penalty: 0.58,
      destabilizer: 0.97,
      gradeCap: 'D+',
      harmonyCap: 55,
      severity: 'severe',
      flag: 'Emotional Harmonic Phase-Inversion Lock (Persistent Reversal of Emotional Resonance Polarity)',
      details: {
        combinedInversion: (A_inv + B_inv) / 2,
        combinedLock,
        combinedReset,
        lockIntensity: lockIntensity.toFixed(2),
        A_metrics: {
          inversion: A_inv,
          lock: A_lock,
          reset: A_reset
        },
        B_metrics: {
          inversion: B_inv,
          lock: B_lock,
          reset: B_reset
        }
      }
    };
  }

  return { triggered: false };
}

export default detectEmotionalHarmonicPhaseInversionLock;
