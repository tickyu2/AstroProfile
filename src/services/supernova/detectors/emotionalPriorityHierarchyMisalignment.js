/**
 * Detector #35: Emotional Priority Hierarchy Misalignment
 *
 * Pattern: Partners rank emotional needs, cues, and responsibilities differently
 * → chronic misalignment → relational instability
 *
 * This is the hierarchy collapse - the internal ranking system of emotional importance.
 *
 * Emerges when:
 * - One partner prioritizes emotional connection, the other prioritizes stability
 * - One prioritizes repair, the other prioritizes autonomy
 * - One prioritizes vulnerability, the other prioritizes predictability
 * - One prioritizes shared emotional experience, the other prioritizes individual regulation
 */

export function detectEmotionalPriorityHierarchyMisalignment(profileA, profileB) {
  // Connection-first traits: high Warm, high Relational, high Expressive
  const connectionAxes = ["Warm", "Relational", "Expressive"];

  // Stability-first traits: high Stabilizer, high OrderOriented, high BoundaryAware
  const stabilityAxes = ["Stabilizer", "OrderOriented", "BoundaryAware"];

  // Vulnerability-first traits: high DepthOriented, high Transpersonal
  const vulnerabilityAxes = ["DepthOriented", "Transpersonal"];

  // Autonomy-first traits: high Initiator, high MindCentered
  const autonomyAxes = ["Initiator", "MindCentered"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  // Compute priority clusters
  const A_conn = avg(profileA, connectionAxes);
  const B_conn = avg(profileB, connectionAxes);

  const A_stab = avg(profileA, stabilityAxes);
  const B_stab = avg(profileB, stabilityAxes);

  const A_vuln = avg(profileA, vulnerabilityAxes);
  const B_vuln = avg(profileB, vulnerabilityAxes);

  const A_auto = avg(profileA, autonomyAxes);
  const B_auto = avg(profileB, autonomyAxes);

  // Divergence patterns:
  const connectionVsStability =
    (A_conn >= 0.65 && B_stab >= 0.65) ||
    (B_conn >= 0.65 && A_stab >= 0.65);

  const vulnerabilityVsAutonomy =
    (A_vuln >= 0.65 && B_auto >= 0.65) ||
    (B_vuln >= 0.65 && A_auto >= 0.65);

  const divergenceCount =
    [connectionVsStability, vulnerabilityVsAutonomy].filter(Boolean).length;

  if (divergenceCount >= 2) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.12,
      gradeCap: "C",
      harmonyCap: 0.35,
      flag: "Emotional Priority Hierarchy Misalignment",
      details: {
        pattern: "Different Emotional Ordering",
        A_connection: A_conn.toFixed(2),
        B_connection: B_conn.toFixed(2),
        A_stability: A_stab.toFixed(2),
        B_stability: B_stab.toFixed(2),
        connectionVsStability,
        vulnerabilityVsAutonomy
      }
    };
  }

  return { triggered: false };
}
