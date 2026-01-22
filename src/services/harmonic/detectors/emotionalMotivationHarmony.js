/**
 * Harmonic Detector 17 - Emotional Motivation Harmony
 *
 * Pattern: Partners share compatible emotional motivations
 *          → aligned drive → coherent relational momentum
 *
 * This is the Luna mirror of the Solar "Motivation Gradient Divergence."
 *
 * This detector identifies when two people:
 * - Are driven by similar emotional needs
 * - Pursue emotional goals with compatible intentions
 * - Act from similar emotional impulses
 * - Seek similar emotional rewards
 * - Move toward connection for similar reasons
 * - Feel energized by the same emotional experiences
 *
 * It's the signature of relationships where partners say:
 * "We want the same emotional things."
 * "We're motivated by similar feelings."
 * "We move toward each other for the same reasons."
 * "Our emotional engines match."
 *
 * This is the Luna-axis of emotional propulsion -
 * the sense that both partners are fueled by compatible emotional currents.
 *
 * It emerges when:
 * - Both partners are motivated by connection rather than avoidance
 * - Both seek emotional depth or emotional lightness in similar proportions
 * - Both pursue emotional growth at similar intensities
 * - Both are energized by similar relational experiences
 * - Both feel emotionally rewarded by similar gestures
 * - Both experience emotional motivation as shared rather than conflicting
 *
 * This is the architecture of aligned emotional drive.
 */

export function detectEmotionalMotivationHarmony(profileA, profileB) {
  // Connection-driven traits: high Warm, high Relational
  const connectionAxes = ["Warm", "Relational"];

  // Growth-driven traits: high DepthOriented, high Transpersonal
  const growthAxes = ["DepthOriented", "Transpersonal"];

  // Expression-driven traits: high Expressive, high FluidIdentity
  const expressionAxes = ["Expressive", "FluidIdentity"];

  // Stability-driven traits: high Stabilizer, high Sustainer
  const stabilityAxes = ["Stabilizer", "Sustainer"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_conn = avg(profileA, connectionAxes);
  const B_conn = avg(profileB, connectionAxes);

  const A_growth = avg(profileA, growthAxes);
  const B_growth = avg(profileB, growthAxes);

  const A_expr = avg(profileA, expressionAxes);
  const B_expr = avg(profileB, expressionAxes);

  const A_stab = avg(profileA, stabilityAxes);
  const B_stab = avg(profileB, stabilityAxes);

  // Harmony patterns: partners share compatible emotional motivations
  const connectionHarmony = A_conn >= 0.55 && B_conn >= 0.55;
  const growthHarmony = A_growth >= 0.55 && B_growth >= 0.55;
  const expressionHarmony = A_expr >= 0.55 && B_expr >= 0.55;
  const stabilityHarmony = A_stab >= 0.55 && B_stab >= 0.55;

  const harmonyCount =
    [connectionHarmony, growthHarmony, expressionHarmony, stabilityHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.18,
      harmonyBoost: 0.38,
      flag: "emotional-motivation-harmony",
      details: "Emotional Motivation Harmony: Aligned Emotional Drives and Intentions - Partners are fueled by compatible emotional engines"
    };
  }

  return { triggered: false };
}
