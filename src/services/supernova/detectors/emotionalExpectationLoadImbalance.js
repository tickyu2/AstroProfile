/**
 * Detector #39: Emotional Expectation Load Imbalance
 *
 * Pattern: Partners place different emotional "load expectations" on the relationship
 * → strain, resentment → relational collapse
 *
 * This is the load collapse - the emotional weight each partner expects the relationship to hold.
 *
 * Emerges when:
 * - One partner expects the relationship to meet many emotional needs, the other only a few
 * - One expects emotional attunement, the other expects emotional independence
 * - One expects emotional reassurance, the other expects emotional self-regulation
 * - One expects emotional partnership, the other expects emotional coexistence
 */

export function detectEmotionalExpectationLoadImbalance(profileA, profileB) {
  // High expectation load traits: high Warm, high Relational, high DepthOriented, high Sustainer
  const highLoadAxes = ["Warm", "Relational", "DepthOriented", "Sustainer"];

  // Low expectation load traits: high BoundaryAware, high MindCentered, high Stabilizer, low Expressive
  const lowLoadAxes = ["BoundaryAware", "MindCentered", "Stabilizer"];
  const lowExpressiveAxes = ["Expressive"];

  // Expectation style traits: high OrderOriented (structured expectations), high FluidIdentity (adaptive expectations)
  const structuredAxes = ["OrderOriented"];
  const adaptiveAxes = ["FluidIdentity"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_high = avg(profileA, highLoadAxes);
  const B_high = avg(profileB, highLoadAxes);

  const A_low = (avg(profileA, lowLoadAxes) + (1 - avg(profileA, lowExpressiveAxes))) / 2;
  const B_low = (avg(profileB, lowLoadAxes) + (1 - avg(profileB, lowExpressiveAxes))) / 2;

  const A_struct = avg(profileA, structuredAxes);
  const B_struct = avg(profileB, structuredAxes);

  const A_adapt = avg(profileA, adaptiveAxes);
  const B_adapt = avg(profileB, adaptiveAxes);

  // Divergence triggers when one partner loads heavily and the other loads lightly
  const A_high_B_low = A_high >= 0.65 && B_low >= 0.65;
  const B_high_A_low = B_high >= 0.65 && A_low >= 0.65;

  // Expectation style mismatch amplifies imbalance
  const styleMismatch =
    (A_struct >= 0.60 && B_adapt >= 0.60) ||
    (B_struct >= 0.60 && A_adapt >= 0.60);

  if ((A_high_B_low || B_high_A_low) && styleMismatch) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.12,
      gradeCap: "C",
      harmonyCap: 0.35,
      flag: "Emotional Expectation Load Imbalance",
      details: {
        pattern: "Uneven Emotional Weighting",
        A_highLoad: A_high.toFixed(2),
        B_highLoad: B_high.toFixed(2),
        A_lowLoad: A_low.toFixed(2),
        B_lowLoad: B_low.toFixed(2),
        styleMismatch
      }
    };
  }

  return { triggered: false };
}
