/**
 * Harmonic Detector 3 - Emotional Priority Harmony
 *
 * Pattern: Partners share compatible emotional priorities
 *          → aligned focus → relational ease and flow
 *
 * This is the Luna mirror of the Solar "Emotional Priority Hierarchy Misalignment."
 *
 * This detector identifies when two people naturally prioritize:
 * - The same emotional needs
 * - The same emotional signals
 * - The same emotional responsibilities
 * - The same emotional timing
 * - The same emotional values
 *
 * It's the signature of relationships where partners say:
 * "Yes, that matters to me too."
 * "I feel the same way about that."
 * "We're aligned on what's important."
 *
 * This is the Luna-axis of emotional alignment -
 * the sense that both people are rowing in the same direction emotionally.
 *
 * It emerges when:
 * - Both prioritize connection over avoidance
 * - Both prioritize repair over withdrawal
 * - Both prioritize honesty over harmony (or vice versa)
 * - Both prioritize emotional presence over emotional efficiency
 * - Both prioritize shared meaning over individual interpretation
 *
 * This is the architecture of shared emotional values.
 */

export function detectEmotionalPriorityHarmony(profileA, profileB) {
  // Connection-priority traits: high Warm, high Relational, high Expressive
  const connectionAxes = ["Warm", "Relational", "Expressive"];

  // Stability-priority traits: high Stabilizer, high OrderOriented, high BoundaryAware
  const stabilityAxes = ["Stabilizer", "OrderOriented", "BoundaryAware"];

  // Depth-priority traits: high DepthOriented, high Transpersonal
  const depthAxes = ["DepthOriented", "Transpersonal"];

  // Autonomy-priority traits: high MindCentered, high Initiator
  const autonomyAxes = ["MindCentered", "Initiator"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_conn = avg(profileA, connectionAxes);
  const B_conn = avg(profileB, connectionAxes);

  const A_stab = avg(profileA, stabilityAxes);
  const B_stab = avg(profileB, stabilityAxes);

  const A_depth = avg(profileA, depthAxes);
  const B_depth = avg(profileB, depthAxes);

  const A_auto = avg(profileA, autonomyAxes);
  const B_auto = avg(profileB, autonomyAxes);

  // Harmony patterns: both partners prioritize the same emotional domain
  const connectionHarmony = A_conn >= 0.55 && B_conn >= 0.55;
  const stabilityHarmony = A_stab >= 0.55 && B_stab >= 0.55;
  const depthHarmony = A_depth >= 0.55 && B_depth >= 0.55;
  const autonomyHarmony = A_auto >= 0.55 && B_auto >= 0.55;

  const harmonyCount =
    [connectionHarmony, stabilityHarmony, depthHarmony, autonomyHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.12,
      harmonyBoost: 0.25,
      flag: "emotional-priority-harmony",
      details: "Emotional Priority Harmony: Aligned Emotional Value Hierarchy - Partners care about the same emotional things"
    };
  }

  return { triggered: false };
}
