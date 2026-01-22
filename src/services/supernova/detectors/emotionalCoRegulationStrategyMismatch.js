/**
 * Detector #42: Emotional Co-Regulation Strategy Mismatch
 *
 * Pattern: Partners use incompatible strategies to co-regulate
 * → failed soothing → relational instability
 *
 * This is the co-regulation collapse - the method each partner uses to regulate emotions together.
 *
 * Emerges when:
 * - One partner co-regulates through verbal processing, the other through quiet presence
 * - One co-regulates through physical closeness, the other through physical space
 * - One co-regulates through emotional mirroring, the other through emotional grounding
 * - One co-regulates through intensity matching, the other through intensity reduction
 */

export function detectEmotionalCoRegulationStrategyMismatch(profileA, profileB) {
  // Verbal co-regulation traits: high Expressive, high Warm, high Relational
  const verbalAxes = ["Expressive", "Warm", "Relational"];

  // Nonverbal co-regulation traits: high Stabilizer, high OrderOriented, low Expressive
  const nonverbalAxes = ["Stabilizer", "OrderOriented"];
  const lowExpressiveAxes = ["Expressive"];

  // Proximity-based co-regulation traits: high DepthOriented, high Transpersonal
  const proximityAxes = ["DepthOriented", "Transpersonal"];

  // Distance-based co-regulation traits: high BoundaryAware, high MindCentered
  const distanceAxes = ["BoundaryAware", "MindCentered"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_verbal = avg(profileA, verbalAxes);
  const B_verbal = avg(profileB, verbalAxes);

  const A_nonverbal = (avg(profileA, nonverbalAxes) + (1 - avg(profileA, lowExpressiveAxes))) / 2;
  const B_nonverbal = (avg(profileB, nonverbalAxes) + (1 - avg(profileB, lowExpressiveAxes))) / 2;

  const A_prox = avg(profileA, proximityAxes);
  const B_prox = avg(profileB, proximityAxes);

  const A_dist = avg(profileA, distanceAxes);
  const B_dist = avg(profileB, distanceAxes);

  // Divergence patterns:
  const verbalVsNonverbal =
    (A_verbal >= 0.65 && B_nonverbal >= 0.65) ||
    (B_verbal >= 0.65 && A_nonverbal >= 0.65);

  const proximityVsDistance =
    (A_prox >= 0.65 && B_dist >= 0.65) ||
    (B_prox >= 0.65 && A_dist >= 0.65);

  const divergenceCount =
    [verbalVsNonverbal, proximityVsDistance].filter(Boolean).length;

  if (divergenceCount >= 2) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.12,
      gradeCap: "C",
      harmonyCap: 0.35,
      flag: "Emotional Co-Regulation Strategy Mismatch",
      details: {
        pattern: "Incompatible Soothing Methods",
        A_verbal: A_verbal.toFixed(2),
        B_verbal: B_verbal.toFixed(2),
        A_nonverbal: A_nonverbal.toFixed(2),
        B_nonverbal: B_nonverbal.toFixed(2),
        verbalVsNonverbal,
        proximityVsDistance
      }
    };
  }

  return { triggered: false };
}
