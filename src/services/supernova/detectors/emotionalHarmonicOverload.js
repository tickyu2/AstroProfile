/**
 * ================================================================================
 * DETECTOR #54 — EMOTIONAL HARMONIC OVERLOAD
 * ================================================================================
 *
 * Second Harmonic Ring — Fourth Chamber
 *
 * Pattern: Too many emotional harmonics activate simultaneously
 *          → emotional saturation → system instability or collapse
 *
 * This detector identifies when two people:
 * - Activate multiple emotional harmonics at once
 * - Generate emotional resonance across too many layers simultaneously
 * - Experience emotional intensity that exceeds their stabilizing capacity
 * - Feel overwhelmed by the complexity of the emotional field
 * - Oscillate between deep connection and sudden shutdown
 * - Experience emotional "overheating" even in positive moments
 *
 * Signature phrases:
 * - "It's too much, even when it's good."
 * - "Our emotional connection overwhelms us."
 * - "We activate everything at once and then crash."
 * - "The emotional field becomes too dense to hold."
 *
 * This is the harmonic-overload chamber — the place where emotional resonance
 * becomes hyper-resonance, exceeding the system's ability to stabilize.
 *
 * Emerges when:
 * - Multiple emotional frequencies activate simultaneously
 * - Emotional amplitude is high across several axes
 * - Emotional phase alignment fluctuates rapidly
 * - Emotional bandwidth is insufficient to process the harmonic density
 * - Emotional stabilizers (Stabilizer, Sustainer, MindCentered) are too low
 *
 * This is the architecture of emotional harmonic saturation.
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
 * Detect Emotional Harmonic Overload
 *
 * @param {Array<number>} archetypeA - 16-dimensional archetype vector for profile A
 * @param {Array<number>} archetypeB - 16-dimensional archetype vector for profile B
 * @returns {Object} Detection result
 */
export function detectEmotionalHarmonicOverload(archetypeA, archetypeB) {
  // Harmonic density axes: number of emotional harmonics activated
  const densityAxes = [
    TRAIT_INDEX.Expressive,
    TRAIT_INDEX.DepthOriented,
    TRAIT_INDEX.Relational,
    TRAIT_INDEX.Warm
  ];

  // Stabilizing axes: ability to regulate high harmonic load
  const stabilizerAxes = [
    TRAIT_INDEX.Stabilizer,
    TRAIT_INDEX.Sustainer,
    TRAIT_INDEX.MindCentered
  ];

  // Bandwidth axes: capacity to process multiple emotional layers
  const bandwidthAxes = [TRAIT_INDEX.FluidIdentity, TRAIT_INDEX.BoundaryAware];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_den = avg(archetypeA, densityAxes);
  const B_den = avg(archetypeB, densityAxes);

  const A_stab = avg(archetypeA, stabilizerAxes);
  const B_stab = avg(archetypeB, stabilizerAxes);

  const A_band = avg(archetypeA, bandwidthAxes);
  const B_band = avg(archetypeB, bandwidthAxes);

  // Harmonic density: too many emotional harmonics active
  const highDensity = (A_den + B_den) / 2 >= 0.70;

  // Low stabilizers: insufficient regulation for high harmonic load
  const lowStability = (A_stab + B_stab) / 2 < 0.55;

  // Low bandwidth: insufficient capacity to process harmonic complexity
  const lowBandwidth = (A_band + B_band) / 2 < 0.50;

  // Calculate overload ratio
  const combinedDensity = (A_den + B_den) / 2;
  const combinedStability = (A_stab + B_stab) / 2;
  const overloadRatio = combinedStability > 0 ? combinedDensity / combinedStability : 2.0;

  if (highDensity && (lowStability || lowBandwidth)) {
    return {
      triggered: true,
      penalty: 0.44,
      destabilizer: 0.82,
      gradeCap: 'B-',
      harmonyCap: 70,
      severity: 'moderate',
      flag: 'Emotional Harmonic Overload (Excessive Emotional Harmonic Density Exceeding System Capacity)',
      details: {
        combinedDensity,
        combinedStability,
        combinedBandwidth: (A_band + B_band) / 2,
        overloadRatio: overloadRatio.toFixed(2),
        A_metrics: { density: A_den, stability: A_stab, bandwidth: A_band },
        B_metrics: { density: B_den, stability: B_stab, bandwidth: B_band }
      }
    };
  }

  return { triggered: false };
}

export default detectEmotionalHarmonicOverload;
