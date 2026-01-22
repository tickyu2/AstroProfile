/**
 * Detector #40: Emotional Stability Baseline Divergence
 *
 * Pattern: Partners have different default emotional stability levels
 * → chronic misattunement → relational instability
 *
 * This is the baseline collapse - the emotional "resting state" each partner returns to.
 *
 * Emerges when:
 * - One partner's baseline is calm, the other's is activated
 * - One returns to emotional equilibrium quickly, the other slowly
 * - One lives in emotional steadiness, the other in emotional variability
 * - One expects stability, the other expects fluctuation
 */

export function detectEmotionalStabilityBaselineDivergence(profileA, profileB) {
  // High-stability baseline traits: high Stabilizer, high OrderOriented, low FluidIdentity
  const stableAxes = ["Stabilizer", "OrderOriented"];
  const lowFluidAxes = ["FluidIdentity"];

  // Low-stability baseline traits: high Expressive, high FluidIdentity, high Warm
  const variableAxes = ["Expressive", "FluidIdentity", "Warm"];

  // Reset traits: high MindCentered, high BoundaryAware
  const resetAxes = ["MindCentered", "BoundaryAware"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_stable = (avg(profileA, stableAxes) + (1 - avg(profileA, lowFluidAxes))) / 2;
  const B_stable = (avg(profileB, stableAxes) + (1 - avg(profileB, lowFluidAxes))) / 2;

  const A_variable = avg(profileA, variableAxes);
  const B_variable = avg(profileB, variableAxes);

  const A_reset = avg(profileA, resetAxes);
  const B_reset = avg(profileB, resetAxes);

  // Divergence triggers when one partner has a stable baseline and the other a variable baseline
  const A_stable_B_variable = A_stable >= 0.65 && B_variable >= 0.65;
  const B_stable_A_variable = B_stable >= 0.65 && A_variable >= 0.65;

  // Reset capacity amplifies mismatch
  const resetAmplifier = (A_reset + B_reset) / 2 >= 0.55;

  if ((A_stable_B_variable || B_stable_A_variable) && resetAmplifier) {
    return {
      triggered: true,
      severity: 'severe',
      penalty: 0.14,
      gradeCap: "C-",
      harmonyCap: 0.30,
      flag: "Emotional Stability Baseline Divergence",
      details: {
        pattern: "Calm vs Variable Default State",
        A_stable: A_stable.toFixed(2),
        B_stable: B_stable.toFixed(2),
        A_variable: A_variable.toFixed(2),
        B_variable: B_variable.toFixed(2),
        resetAmplifier
      }
    };
  }

  return { triggered: false };
}
