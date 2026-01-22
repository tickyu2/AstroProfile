/**
 * Harmonic Detector 39 - Emotional Value System Harmony
 *
 * Pattern: Partners share compatible emotional values
 *          → unified relational ethos → stable long-term coherence
 *
 * This is the Luna mirror of the Solar "Value System Divergence."
 *
 * This detector identifies when two people:
 * - Hold similar emotional virtues (honesty, depth, loyalty, curiosity, gentleness, resilience, etc.)
 * - Prioritize similar emotional needs (connection, autonomy, growth, stability)
 * - Value similar relational principles (communication, fairness, devotion, exploration)
 * - Make emotional decisions guided by compatible internal compasses
 * - Avoid value-collisions that destabilize the relationship
 * - Feel aligned in what "matters most" emotionally
 *
 * It's the signature of relationships where partners say:
 * "We care about the same things."
 * "Our emotional values match."
 * "We're guided by the same principles."
 * "We build the same kind of emotional world."
 *
 * This is the Luna-axis of emotional ethos -
 * the sense that the relationship is built on shared emotional soil.
 *
 * It emerges when:
 * - Both partners value similar emotional virtues
 * - Both prioritize similar relational needs
 * - Both make decisions guided by compatible emotional frameworks
 * - Both avoid value-based misunderstandings
 * - Both feel emotionally "aligned at the core"
 * - Both experience the relationship as ethically and emotionally coherent
 *
 * This is the architecture of shared emotional integrity.
 */

export function detectEmotionalValueSystemHarmony(profileA, profileB) {
  // Core emotional values: high Warm, high BoundaryAware
  const valueAxes = ["Warm", "BoundaryAware"];

  // Relational principles: high Relational, high Stabilizer
  const principleAxes = ["Relational", "Stabilizer"];

  // Emotional priorities: high DepthOriented, high Sustainer
  const priorityAxes = ["DepthOriented", "Sustainer"];

  // Decision-making ethos: high MindCentered, high Expressive
  const ethosAxes = ["MindCentered", "Expressive"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_val = avg(profileA, valueAxes);
  const B_val = avg(profileB, valueAxes);

  const A_pri = avg(profileA, principleAxes);
  const B_pri = avg(profileB, principleAxes);

  const A_prior = avg(profileA, priorityAxes);
  const B_prior = avg(profileB, priorityAxes);

  const A_eth = avg(profileA, ethosAxes);
  const B_eth = avg(profileB, ethosAxes);

  // Harmony patterns: partners share compatible values, principles, priorities, and ethos
  const valueHarmony = A_val >= 0.55 && B_val >= 0.55;
  const principleHarmony = A_pri >= 0.55 && B_pri >= 0.55;
  const priorityHarmony = A_prior >= 0.55 && B_prior >= 0.55;
  const ethosHarmony = A_eth >= 0.55 && B_eth >= 0.55;

  const harmonyCount =
    [valueHarmony, principleHarmony, priorityHarmony, ethosHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.30,
      harmonyBoost: 0.64,
      flag: "emotional-value-system-harmony",
      details: "Emotional Value System Harmony: Shared Emotional Virtues, Priorities, and Relational Ethos - Partners care about the same things"
    };
  }

  return { triggered: false };
}
