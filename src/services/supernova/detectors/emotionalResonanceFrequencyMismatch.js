/**
 * ================================================================================
 * DETECTOR #51 — EMOTIONAL RESONANCE FREQUENCY MISMATCH
 * ================================================================================
 *
 * Second Harmonic Ring — First Chamber
 *
 * Pattern: Partners resonate emotionally, but at incompatible frequencies
 *          → emotional dissonance → unstable harmonic coupling
 *
 * This detector identifies when two people:
 * - Feel emotions at different intensity frequencies
 * - Process emotional waves at different vibrational speeds
 * - Express emotional resonance in incompatible amplitude patterns
 * - Attempt to connect emotionally but "miss each other's wavelength"
 * - Experience emotional closeness that flickers or destabilizes
 * - Feel like they're "almost in sync" but not quite
 *
 * Signature phrases:
 * - "We care about each other, but we're not on the same wavelength."
 * - "Our emotions don't land at the same time or intensity."
 * - "We resonate, but the resonance feels unstable."
 * - "We keep trying to connect, but the frequencies don't align."
 *
 * This is the meta-resonance chamber — the first chamber that diagnoses
 * frequency-level mismatch rather than content, timing, or meaning.
 *
 * Emerges when:
 * - One partner resonates at high emotional frequency (fast, intense, immediate)
 * - The other resonates at low frequency (slow, deep, gradual)
 * - Emotional waves amplify each other unpredictably
 * - Emotional attunement is attempted but unstable
 * - Emotional resonance exists, but the frequency coupling fails
 *
 * This is the architecture of resonance without coherence.
 *
 * ================================================================================
 */

/**
 * Archetype vector indices:
 * 0: Initiator    4: Expressive     8: Relational     12: Sustainer
 * 1: Stabilizer   5: DepthOriented  9: MindCentered   13: ShadowAware
 * 2: BoundaryAware 6: Resilient     10: FluidIdentity 14: Transcendent
 * 3: Warm         7: Adventurous    11: SystemsOriented 15: NurtureOriented
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
 * Detect Emotional Resonance Frequency Mismatch
 *
 * @param {Array<number>} archetypeA - 16-dimensional archetype vector for profile A
 * @param {Array<number>} archetypeB - 16-dimensional archetype vector for profile B
 * @returns {Object} Detection result
 */
export function detectEmotionalResonanceFrequencyMismatch(archetypeA, archetypeB) {
  // Frequency axes: intensity + speed of emotional resonance
  const frequencyAxes = [TRAIT_INDEX.Expressive, TRAIT_INDEX.DepthOriented];

  // Amplitude axes: emotional magnitude + emotional bandwidth
  const amplitudeAxes = [TRAIT_INDEX.Warm, TRAIT_INDEX.Relational];

  // Stability axes: ability to maintain resonance over time
  const stabilityAxes = [TRAIT_INDEX.Stabilizer, TRAIT_INDEX.Sustainer];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_freq = avg(archetypeA, frequencyAxes);
  const B_freq = avg(archetypeB, frequencyAxes);

  const A_amp = avg(archetypeA, amplitudeAxes);
  const B_amp = avg(archetypeB, amplitudeAxes);

  const A_stab = avg(archetypeA, stabilityAxes);
  const B_stab = avg(archetypeB, stabilityAxes);

  // Frequency mismatch: large difference in resonance frequency
  const freqMismatch = Math.abs(A_freq - B_freq) >= 0.25;

  // Amplitude mismatch: large difference in emotional amplitude
  const ampMismatch = Math.abs(A_amp - B_amp) >= 0.25;

  // Stability mismatch: insufficient stabilizing traits to compensate
  const lowStability = (A_stab + B_stab) / 2 < 0.50;

  if (freqMismatch && (ampMismatch || lowStability)) {
    return {
      triggered: true,
      penalty: 0.38,
      destabilizer: 0.72,
      gradeCap: 'B+',
      harmonyCap: 78,
      severity: 'moderate',
      flag: 'Emotional Resonance Frequency Mismatch (Incompatible Emotional Vibrational Rates)',
      details: {
        frequencyDelta: Math.abs(A_freq - B_freq),
        amplitudeDelta: Math.abs(A_amp - B_amp),
        combinedStability: (A_stab + B_stab) / 2,
        A_metrics: { frequency: A_freq, amplitude: A_amp, stability: A_stab },
        B_metrics: { frequency: B_freq, amplitude: B_amp, stability: B_stab }
      }
    };
  }

  return { triggered: false };
}

export default detectEmotionalResonanceFrequencyMismatch;
