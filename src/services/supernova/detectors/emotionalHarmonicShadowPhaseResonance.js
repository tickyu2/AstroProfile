/**
 * ================================================================================
 * DETECTOR #62 — EMOTIONAL HARMONIC SHADOW-PHASE RESONANCE
 * ================================================================================
 *
 * Second Harmonic Ring — Twelfth Chamber
 *
 * Pattern: Shadow harmonics synchronize in inverted phase
 *          → stable resonance emerges in the shadow layer
 *          → emotional field operates on hidden polarity
 *
 * This detector identifies when two people:
 * - Resonate more strongly in their shadow-phase than in their conscious emotional field
 * - Experience emotional synchronization that occurs beneath awareness
 * - Feel emotional reactions that "fit together" even when consciously misaligned
 * - Experience emotional patterns that feel fated, magnetic, or uncanny
 * - Feel like the emotional field has reorganized around a hidden harmonic
 * - Experience emotional stability that is paradoxically destabilizing
 *
 * Signature phrases:
 * - "We're out of sync on the surface, but something deeper keeps pulling us into rhythm."
 * - "Our shadows resonate even when we don't."
 * - "There's a hidden emotional pattern that keeps re-forming."
 * - "It feels like we're synchronized at a level we can't see."
 *
 * This is the shadow-phase resonance chamber — the place where emotional
 * harmonics synchronize in the inverted, unconscious layer.
 *
 * Emerges when:
 * - Shadow coupling (59) creates unconscious resonance
 * - Echo loops (60) reinforce the shadow harmonic
 * - Phase-inversion lock (61) freezes the polarity
 * - Emotional cycles synchronize in the shadow layer
 * - Conscious emotional alignment becomes secondary
 * - The emotional field stabilizes around the inverted phase
 *
 * This is the architecture of shadow-phase harmonic resonance.
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
 * Detect Emotional Harmonic Shadow-Phase Resonance
 *
 * @param {Array<number>} archetypeA - 16-dimensional archetype vector for profile A
 * @param {Array<number>} archetypeB - 16-dimensional archetype vector for profile B
 * @returns {Object} Detection result
 */
export function detectEmotionalHarmonicShadowPhaseResonance(archetypeA, archetypeB) {
  // Shadow-phase axes: unconscious resonance + inverted-phase synchronization
  const shadowPhaseAxes = [TRAIT_INDEX.DepthOriented, TRAIT_INDEX.FluidIdentity];

  // Echo axes: recursive emotional reactivation
  const echoAxes = [TRAIT_INDEX.Expressive, TRAIT_INDEX.Warm];

  // Lock axes: persistence of inverted-phase patterns
  const lockAxes = [TRAIT_INDEX.BoundaryAware, TRAIT_INDEX.Stabilizer];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_shadowPhase = avg(archetypeA, shadowPhaseAxes);
  const B_shadowPhase = avg(archetypeB, shadowPhaseAxes);

  const A_echo = avg(archetypeA, echoAxes);
  const B_echo = avg(archetypeB, echoAxes);

  const A_lock = avg(archetypeA, lockAxes);
  const B_lock = avg(archetypeB, lockAxes);

  // High shadow-phase resonance: unconscious harmonics synchronize
  const highShadowPhase = (A_shadowPhase + B_shadowPhase) / 2 >= 0.62;

  // High echo reinforcement: shadow-phase resonance is self-sustaining
  const highEcho = (A_echo + B_echo) / 2 >= 0.58;

  // High lock: inverted-phase resonance persists over time
  const highLock = (A_lock + B_lock) / 2 >= 0.55;

  // Calculate shadow resonance strength
  const combinedShadow = (A_shadowPhase + B_shadowPhase) / 2;
  const combinedEcho = (A_echo + B_echo) / 2;
  const shadowResonanceStrength = (combinedShadow + combinedEcho) / 2;

  if (highShadowPhase && highEcho && highLock) {
    return {
      triggered: true,
      penalty: 0.60,
      destabilizer: 0.98,
      gradeCap: 'D',
      harmonyCap: 52,
      severity: 'severe',
      flag: 'Emotional Harmonic Shadow-Phase Resonance (Stable Resonance in the Inverted Shadow Harmonic Layer)',
      details: {
        combinedShadowPhase: combinedShadow,
        combinedEcho,
        combinedLock: (A_lock + B_lock) / 2,
        shadowResonanceStrength: shadowResonanceStrength.toFixed(2),
        A_metrics: {
          shadowPhase: A_shadowPhase,
          echo: A_echo,
          lock: A_lock
        },
        B_metrics: {
          shadowPhase: B_shadowPhase,
          echo: B_echo,
          lock: B_lock
        }
      }
    };
  }

  return { triggered: false };
}

export default detectEmotionalHarmonicShadowPhaseResonance;
