/**
 * ================================================================================
 * DETECTOR #52 — EMOTIONAL AMPLITUDE INTERFERENCE PATTERN
 * ================================================================================
 *
 * Second Harmonic Ring — Second Chamber
 *
 * Pattern: Emotional amplitudes collide → constructive or destructive interference
 *          → unstable emotional field
 *
 * This detector identifies when two people:
 * - Experience emotional intensity at incompatible amplitude levels
 * - Generate emotional waves that over-amplify or cancel each other
 * - Trigger emotional escalation loops (constructive interference)
 * - Trigger emotional flattening or shutdown loops (destructive interference)
 * - Feel like emotional reactions "bounce off each other" unpredictably
 * - Experience emotional turbulence even when intentions are aligned
 *
 * Signature phrases:
 * - "When we react, it gets big fast."
 * - "Your emotions overwhelm mine, or mine overwhelm yours."
 * - "We amplify each other in ways we can't control."
 * - "Sometimes we cancel each other out emotionally."
 *
 * This is the amplitude-interference chamber — the place where emotional waves
 * collide and create patterns neither partner intended.
 *
 * Emerges when:
 * - One partner has high emotional amplitude (big emotional waves)
 * - The other has low amplitude (subtle emotional waves)
 * - Emotional reactions amplify each other (constructive interference)
 * - Emotional reactions cancel each other (destructive interference)
 * - Emotional stability is insufficient to absorb the interference
 * - Emotional bandwidth is mismatched
 *
 * This is the architecture of emotional wave interference.
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
 * Detect Emotional Amplitude Interference Pattern
 *
 * @param {Array<number>} archetypeA - 16-dimensional archetype vector for profile A
 * @param {Array<number>} archetypeB - 16-dimensional archetype vector for profile B
 * @returns {Object} Detection result
 */
export function detectEmotionalAmplitudeInterferencePattern(archetypeA, archetypeB) {
  // Amplitude axes: emotional magnitude + emotional expressiveness
  const amplitudeAxes = [TRAIT_INDEX.Expressive, TRAIT_INDEX.Warm];

  // Bandwidth axes: emotional capacity + relational openness
  const bandwidthAxes = [TRAIT_INDEX.Relational, TRAIT_INDEX.DepthOriented];

  // Stability axes: ability to absorb emotional waves
  const stabilityAxes = [TRAIT_INDEX.Stabilizer, TRAIT_INDEX.Sustainer];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_amp = avg(archetypeA, amplitudeAxes);
  const B_amp = avg(archetypeB, amplitudeAxes);

  const A_band = avg(archetypeA, bandwidthAxes);
  const B_band = avg(archetypeB, bandwidthAxes);

  const A_stab = avg(archetypeA, stabilityAxes);
  const B_stab = avg(archetypeB, stabilityAxes);

  // Amplitude mismatch: large difference in emotional amplitude
  const ampMismatch = Math.abs(A_amp - B_amp) >= 0.28;

  // Bandwidth mismatch: insufficient capacity to absorb amplitude differences
  const lowBandwidth = (A_band + B_band) / 2 < 0.50;

  // Stability mismatch: low stabilizing traits → interference becomes turbulent
  const lowStability = (A_stab + B_stab) / 2 < 0.52;

  // Interference type detection
  const highAmplitudes = A_amp >= 0.65 && B_amp >= 0.65;
  const lowAmplitudes = A_amp <= 0.35 && B_amp <= 0.35;
  const interferenceType = highAmplitudes ? 'constructive' :
                          lowAmplitudes ? 'destructive' :
                          'mixed';

  if (ampMismatch && (lowBandwidth || lowStability)) {
    return {
      triggered: true,
      penalty: 0.40,
      destabilizer: 0.78,
      gradeCap: 'B',
      harmonyCap: 75,
      severity: 'moderate',
      flag: 'Emotional Amplitude Interference Pattern (Constructive/Destructive Emotional Wave Collision)',
      details: {
        amplitudeDelta: Math.abs(A_amp - B_amp),
        combinedBandwidth: (A_band + B_band) / 2,
        combinedStability: (A_stab + B_stab) / 2,
        interferenceType,
        A_metrics: { amplitude: A_amp, bandwidth: A_band, stability: A_stab },
        B_metrics: { amplitude: B_amp, bandwidth: B_band, stability: B_stab }
      }
    };
  }

  return { triggered: false };
}

export default detectEmotionalAmplitudeInterferencePattern;
