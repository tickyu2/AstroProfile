/**
 * Detector #31: Emotional Containment Capacity Gap
 *
 * Pattern: Partners differ in how much emotional intensity they can internally hold
 * → overflow vs implosion → relational instability
 *
 * This is the containment collapse - the internal "emotional vessel size."
 *
 * Emerges when:
 * - One partner can hold emotional intensity internally for long periods
 * - The other must express or release emotions quickly
 * - One processes emotions inwardly, the other outwardly
 * - One regulates through containment, the other through expression
 */

export function detectEmotionalContainmentCapacityGap(profileA, profileB) {
  // High containment traits: high Stabilizer, high BoundaryAware, high OrderOriented, low Expressive
  const highContainAxes = ["Stabilizer", "BoundaryAware", "OrderOriented"];
  const lowExpressiveAxes = ["Expressive"];

  // Low containment traits: high Expressive, high Warm, high FluidIdentity
  const lowContainAxes = ["Expressive", "Warm", "FluidIdentity"];

  // Emotional pressure traits: high DepthOriented, high Relational
  const pressureAxes = ["DepthOriented", "Relational"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_highContain =
    (avg(profileA, highContainAxes) + (1 - avg(profileA, lowExpressiveAxes))) / 2;
  const B_highContain =
    (avg(profileB, highContainAxes) + (1 - avg(profileB, lowExpressiveAxes))) / 2;

  const A_lowContain = avg(profileA, lowContainAxes);
  const B_lowContain = avg(profileB, lowContainAxes);

  const A_pressure = avg(profileA, pressureAxes);
  const B_pressure = avg(profileB, pressureAxes);

  // Divergence triggers when one partner contains and the other must release
  const A_contain_B_release = A_highContain >= 0.65 && B_lowContain >= 0.65;
  const B_contain_A_release = B_highContain >= 0.65 && A_lowContain >= 0.65;

  // Emotional pressure amplifies mismatch
  const pressureAmplifier = (A_pressure + B_pressure) / 2 >= 0.55;

  if ((A_contain_B_release || B_contain_A_release) && pressureAmplifier) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.12,
      gradeCap: "C",
      harmonyCap: 0.35,
      flag: "Emotional Containment Capacity Gap",
      details: {
        pattern: "Contain vs Release",
        A_highContainment: A_highContain.toFixed(2),
        B_highContainment: B_highContain.toFixed(2),
        A_lowContainment: A_lowContain.toFixed(2),
        B_lowContainment: B_lowContain.toFixed(2),
        pressureAmplifier
      }
    };
  }

  return { triggered: false };
}
