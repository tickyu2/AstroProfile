/**
 * Detector #26: Autonomy-Closeness Equilibrium Break
 *
 * Pattern: Partners require different levels of autonomy vs closeness
 * → chronic tension → relational destabilization
 *
 * This is the equilibrium collapse - the fundamental balance of togetherness vs independence.
 *
 * Emerges when:
 * - One partner feels secure through closeness, the other through space
 * - One seeks shared life, the other seeks parallel life
 * - One bonds through interdependence, the other through independence
 * - One feels smothered, the other feels abandoned
 */

export function detectAutonomyClosenessEquilibriumBreak(profileA, profileB) {
  // Closeness traits: high Warm, high Relational, high Expressive, high Sustainer
  const closenessAxes = ["Warm", "Relational", "Expressive", "Sustainer"];

  // Autonomy traits: high BoundaryAware, high Initiator, high MindCentered, high Stabilizer
  const autonomyAxes = ["BoundaryAware", "Initiator", "MindCentered", "Stabilizer"];

  // Overwhelm sensitivity: high FluidIdentity amplifies closeness needs
  const sensitivityAxes = ["FluidIdentity"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_close = avg(profileA, closenessAxes);
  const B_close = avg(profileB, closenessAxes);

  const A_auto = avg(profileA, autonomyAxes);
  const B_auto = avg(profileB, autonomyAxes);

  const A_sens = avg(profileA, sensitivityAxes);
  const B_sens = avg(profileB, sensitivityAxes);

  // Divergence triggers when partners sit on opposite ends of the autonomy-closeness spectrum
  const A_closeness_B_autonomy = A_close >= 0.65 && B_auto >= 0.65;
  const B_closeness_A_autonomy = B_close >= 0.65 && A_auto >= 0.65;

  // Sensitivity amplifies the mismatch
  const sensitivityAmplifier = (A_sens + B_sens) / 2 >= 0.55;

  if ((A_closeness_B_autonomy || B_closeness_A_autonomy) && sensitivityAmplifier) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.12,
      gradeCap: "C",
      harmonyCap: 0.35,
      flag: "Autonomy-Closeness Equilibrium Break",
      details: {
        pattern: "Independence vs Togetherness",
        A_closeness: A_close.toFixed(2),
        B_closeness: B_close.toFixed(2),
        A_autonomy: A_auto.toFixed(2),
        B_autonomy: B_auto.toFixed(2),
        sensitivityAmplifier
      }
    };
  }

  return { triggered: false };
}
