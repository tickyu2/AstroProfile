/**
 * Detector #30: Emotional Saturation Threshold Clash
 *
 * Pattern: Partners have different emotional "fullness" thresholds
 * → overload vs under-stimulation → relational instability
 *
 * This is the saturation collapse - the emotional "full tank" point.
 *
 * Emerges when:
 * - One partner reaches emotional fullness quickly, the other slowly
 * - One becomes overwhelmed by emotional intensity, the other thrives in it
 * - One needs breaks, the other needs continuation
 * - One saturates from closeness, the other saturates from distance
 */

export function detectEmotionalSaturationThresholdClash(profileA, profileB) {
  // Low saturation threshold traits: high FluidIdentity, high Expressive, high Warm
  const lowSatAxes = ["FluidIdentity", "Expressive", "Warm"];

  // High saturation threshold traits: high Stabilizer, high BoundaryAware, high OrderOriented
  const highSatAxes = ["Stabilizer", "BoundaryAware", "OrderOriented"];

  // Emotional endurance traits: high DepthOriented, high Relational
  const enduranceAxes = ["DepthOriented", "Relational"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_lowSat = avg(profileA, lowSatAxes);
  const B_lowSat = avg(profileB, lowSatAxes);

  const A_highSat = avg(profileA, highSatAxes);
  const B_highSat = avg(profileB, highSatAxes);

  const A_endure = avg(profileA, enduranceAxes);
  const B_endure = avg(profileB, enduranceAxes);

  // Divergence triggers when one saturates quickly and the other saturates slowly
  const A_quick_B_slow = A_lowSat >= 0.65 && B_highSat >= 0.65;
  const B_quick_A_slow = B_lowSat >= 0.65 && A_highSat >= 0.65;

  // Emotional endurance amplifies mismatch
  const enduranceAmplifier = (A_endure + B_endure) / 2 >= 0.55;

  if ((A_quick_B_slow || B_quick_A_slow) && enduranceAmplifier) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.12,
      gradeCap: "C",
      harmonyCap: 0.35,
      flag: "Emotional Saturation Threshold Clash",
      details: {
        pattern: "Quick-Fill vs Slow-Fill",
        A_lowSaturation: A_lowSat.toFixed(2),
        B_lowSaturation: B_lowSat.toFixed(2),
        A_highSaturation: A_highSat.toFixed(2),
        B_highSaturation: B_highSat.toFixed(2),
        enduranceAmplifier
      }
    };
  }

  return { triggered: false };
}
