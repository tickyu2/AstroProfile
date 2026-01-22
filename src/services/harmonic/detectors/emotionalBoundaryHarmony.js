/**
 * Harmonic Detector 26 - Emotional Boundary Harmony
 *
 * Pattern: Partners maintain compatible emotional boundaries
 *          → safe closeness → stable autonomy-within-connection
 *
 * This is the Luna mirror of the Solar "Boundary Tension Divergence."
 *
 * This detector identifies when two people:
 * - Respect each other's emotional limits
 * - Understand each other's need for space or closeness
 * - Maintain autonomy without disconnecting
 * - Allow closeness without intrusion
 * - Navigate emotional edges with mutual sensitivity
 * - Create a relationship where both can breathe
 *
 * It's the signature of relationships where partners say:
 * "You give me space without distance."
 * "You come close without overwhelming me."
 * "We understand each other's limits."
 * "Our boundaries fit together naturally."
 *
 * This is the Luna-axis of emotional sovereignty -
 * the sense that connection and individuality coexist in harmony.
 *
 * It emerges when:
 * - Both partners have compatible needs for closeness and space
 * - Both communicate boundaries clearly and kindly
 * - Both respond to boundaries with respect rather than defensiveness
 * - Both maintain emotional presence without overstepping
 * - Both feel safe expressing needs
 * - Both experience boundaries as supportive, not restrictive
 *
 * This is the architecture of mutual emotional respect.
 */

export function detectEmotionalBoundaryHarmony(profileA, profileB) {
  // Boundary clarity traits: high BoundaryAware, high MindCentered
  const clarityAxes = ["BoundaryAware", "MindCentered"];

  // Respectful closeness traits: high Warm, high Relational
  const closenessAxes = ["Warm", "Relational"];

  // Autonomy traits: high FluidIdentity, high Initiator
  const autonomyAxes = ["FluidIdentity", "Initiator"];

  // Stability traits: high Stabilizer, high Sustainer
  const stabilityAxes = ["Stabilizer", "Sustainer"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_clar = avg(profileA, clarityAxes);
  const B_clar = avg(profileB, clarityAxes);

  const A_close = avg(profileA, closenessAxes);
  const B_close = avg(profileB, closenessAxes);

  const A_auto = avg(profileA, autonomyAxes);
  const B_auto = avg(profileB, autonomyAxes);

  const A_stab = avg(profileA, stabilityAxes);
  const B_stab = avg(profileB, stabilityAxes);

  // Harmony patterns: partners share compatible boundary clarity, closeness, autonomy, and stability
  const clarityHarmony = A_clar >= 0.55 && B_clar >= 0.55;
  const closenessHarmony = A_close >= 0.55 && B_close >= 0.55;
  const autonomyHarmony = A_auto >= 0.55 && B_auto >= 0.55;
  const stabilityHarmony = A_stab >= 0.55 && B_stab >= 0.55;

  const harmonyCount =
    [clarityHarmony, closenessHarmony, autonomyHarmony, stabilityHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.22,
      harmonyBoost: 0.46,
      flag: "emotional-boundary-harmony",
      details: "Emotional Boundary Harmony: Aligned Closeness, Space, and Mutual Respect - Partners honor each other's limits"
    };
  }

  return { triggered: false };
}
