/**
 * Detector #25: Intimacy Gradient Mismatch
 *
 * Pattern: Partners desire or tolerate intimacy at different depths
 * → chronic misalignment → relational instability
 *
 * This is the depth collapse - how deep each person naturally goes.
 *
 * Emerges when:
 * - One partner prefers deep emotional intimacy, the other prefers light
 * - One wants sustained closeness, the other wants episodic closeness
 * - One bonds through depth, the other bonds through presence
 * - One shares inner worlds, the other shares outer experiences
 */

export function detectIntimacyGradientMismatch(profileA, profileB) {
  // Deep intimacy traits: high DepthOriented, high Transpersonal, high Warm, high Relational
  const deepAxes = ["DepthOriented", "Transpersonal", "Warm", "Relational"];

  // Light intimacy traits: high Expressive, high Initiator, high BoundaryAware, high MindCentered
  const lightAxes = ["Expressive", "Initiator", "BoundaryAware", "MindCentered"];

  // Intimacy tolerance traits: high Stabilizer, high Sustainer
  const toleranceAxes = ["Stabilizer", "Sustainer"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  // Compute intimacy clusters
  const A_deep = avg(profileA, deepAxes);
  const B_deep = avg(profileB, deepAxes);

  const A_light = avg(profileA, lightAxes);
  const B_light = avg(profileB, lightAxes);

  const A_tol = avg(profileA, toleranceAxes);
  const B_tol = avg(profileB, toleranceAxes);

  // Divergence triggers when partners sit on opposite ends of intimacy gradients
  const deepVsLight =
    (A_deep >= 0.65 && B_light >= 0.65) ||
    (B_deep >= 0.65 && A_light >= 0.65);

  // Low tolerance amplifies mismatch
  const lowTolerance =
    (A_tol <= 0.45 && B_tol >= 0.55) ||
    (B_tol <= 0.45 && A_tol >= 0.55);

  if (deepVsLight && lowTolerance) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.12,
      gradeCap: "C",
      harmonyCap: 0.35,
      flag: "Intimacy Gradient Mismatch",
      details: {
        pattern: "Depth vs Light Intimacy",
        A_deep: A_deep.toFixed(2),
        B_deep: B_deep.toFixed(2),
        A_light: A_light.toFixed(2),
        B_light: B_light.toFixed(2),
        toleranceMismatch: lowTolerance
      }
    };
  }

  return { triggered: false };
}
