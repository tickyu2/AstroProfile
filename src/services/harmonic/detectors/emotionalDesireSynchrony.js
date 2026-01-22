/**
 * Harmonic Detector 18 - Emotional Desire Synchrony
 *
 * Pattern: Partners desire similar emotional experiences
 *          → shared longing → unified relational momentum
 *
 * This is the Luna mirror of the Solar "Desire Gradient Mismatch."
 *
 * This detector identifies when two people:
 * - Long for similar emotional textures
 * - Desire closeness at similar intensities
 * - Seek similar emotional nourishment
 * - Crave similar forms of connection
 * - Want emotional expansion in compatible ways
 * - Feel pulled toward each other with matching emotional gravity
 *
 * It's the signature of relationships where partners say:
 * "We want the same emotional life."
 * "We crave the same kind of closeness."
 * "Our emotional desires match."
 * "We're drawn to each other in the same way."
 *
 * This is the Luna-axis of emotional appetite -
 * the sense that desire itself is shared, not negotiated.
 *
 * It emerges when:
 * - Both partners desire emotional depth or lightness in similar proportions
 * - Both want intimacy at similar frequencies
 * - Both crave emotional presence rather than distance
 * - Both seek emotional adventure or calm in compatible ways
 * - Both feel emotionally energized by the same relational experiences
 * - Both experience desire as a shared pull rather than a tug-of-war
 *
 * This is the architecture of aligned emotional longing.
 */

export function detectEmotionalDesireSynchrony(profileA, profileB) {
  // Desire for closeness: high Warm, high Relational
  const closenessAxes = ["Warm", "Relational"];

  // Desire for depth: high DepthOriented, high Transpersonal
  const depthAxes = ["DepthOriented", "Transpersonal"];

  // Desire for expression: high Expressive, high FluidIdentity
  const expressionAxes = ["Expressive", "FluidIdentity"];

  // Desire for stability: high Stabilizer, high Sustainer
  const stabilityAxes = ["Stabilizer", "Sustainer"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_close = avg(profileA, closenessAxes);
  const B_close = avg(profileB, closenessAxes);

  const A_depth = avg(profileA, depthAxes);
  const B_depth = avg(profileB, depthAxes);

  const A_expr = avg(profileA, expressionAxes);
  const B_expr = avg(profileB, expressionAxes);

  const A_stab = avg(profileA, stabilityAxes);
  const B_stab = avg(profileB, stabilityAxes);

  // Harmony patterns: partners share compatible emotional desires
  const closenessHarmony = A_close >= 0.55 && B_close >= 0.55;
  const depthHarmony = A_depth >= 0.55 && B_depth >= 0.55;
  const expressionHarmony = A_expr >= 0.55 && B_expr >= 0.55;
  const stabilityHarmony = A_stab >= 0.55 && B_stab >= 0.55;

  const harmonyCount =
    [closenessHarmony, depthHarmony, expressionHarmony, stabilityHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.18,
      harmonyBoost: 0.38,
      flag: "emotional-desire-synchrony",
      details: "Emotional Desire Synchrony: Aligned Emotional Longing and Relational Appetite - Partners crave the same emotional life"
    };
  }

  return { triggered: false };
}
