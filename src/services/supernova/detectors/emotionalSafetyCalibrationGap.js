/**
 * Detector #38: Emotional Safety Calibration Gap
 *
 * Pattern: Partners require different conditions to feel emotionally safe
 * → chronic misattunement → relational instability
 *
 * This is the safety collapse - the internal "settings" that determine what feels safe.
 *
 * Emerges when:
 * - One partner needs predictability, the other needs authenticity
 * - One needs softness, the other needs directness
 * - One needs emotional closeness, the other needs emotional space
 * - One needs verbal reassurance, the other needs behavioral consistency
 */

export function detectEmotionalSafetyCalibrationGap(profileA, profileB) {
  // Safety-through-softness traits: high Warm, high Relational, high Expressive
  const softnessAxes = ["Warm", "Relational", "Expressive"];

  // Safety-through-structure traits: high OrderOriented, high Stabilizer, high BoundaryAware
  const structureAxes = ["OrderOriented", "Stabilizer", "BoundaryAware"];

  // Safety-through-authenticity traits: high DepthOriented, high Transpersonal
  const authenticityAxes = ["DepthOriented", "Transpersonal"];

  // Safety-through-distance traits: high MindCentered, high Initiator
  const distanceAxes = ["MindCentered", "Initiator"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_soft = avg(profileA, softnessAxes);
  const B_soft = avg(profileB, softnessAxes);

  const A_struct = avg(profileA, structureAxes);
  const B_struct = avg(profileB, structureAxes);

  const A_auth = avg(profileA, authenticityAxes);
  const B_auth = avg(profileB, authenticityAxes);

  const A_dist = avg(profileA, distanceAxes);
  const B_dist = avg(profileB, distanceAxes);

  // Divergence patterns:
  const softnessVsStructure =
    (A_soft >= 0.65 && B_struct >= 0.65) ||
    (B_soft >= 0.65 && A_struct >= 0.65);

  const authenticityVsDistance =
    (A_auth >= 0.65 && B_dist >= 0.65) ||
    (B_auth >= 0.65 && A_dist >= 0.65);

  const divergenceCount =
    [softnessVsStructure, authenticityVsDistance].filter(Boolean).length;

  if (divergenceCount >= 2) {
    return {
      triggered: true,
      severity: 'severe',
      penalty: 0.14,
      gradeCap: "C-",
      harmonyCap: 0.30,
      flag: "Emotional Safety Calibration Gap",
      details: {
        pattern: "Different Safety Requirements",
        A_softness: A_soft.toFixed(2),
        B_softness: B_soft.toFixed(2),
        A_structure: A_struct.toFixed(2),
        B_structure: B_struct.toFixed(2),
        softnessVsStructure,
        authenticityVsDistance
      }
    };
  }

  return { triggered: false };
}
