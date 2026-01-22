/**
 * Harmonic Detector 28 - Emotional Expectation Harmony
 *
 * Pattern: Partners hold compatible emotional expectations
 *          → aligned relational agreements → stable, predictable emotional ecosystem
 *
 * This is the Luna mirror of the Solar "Expectation Load Divergence."
 *
 * This detector identifies when two people:
 * - Expect similar levels of emotional responsiveness
 * - Hold compatible assumptions about closeness, communication, and support
 * - Anticipate similar relational roles and responsibilities
 * - Share expectations about emotional effort and presence
 * - Maintain aligned standards for emotional behavior
 * - Feel neither overburdened nor under-supported
 *
 * It's the signature of relationships where partners say:
 * "We expect the same things from each other."
 * "We're aligned on what this relationship means."
 * "We don't disappoint each other by accident."
 * "Our emotional agreements feel natural."
 *
 * This is the Luna-axis of emotional alignment -
 * the sense that both partners are playing the same game by the same rules.
 *
 * It emerges when:
 * - Both partners expect similar levels of communication
 * - Both expect similar emotional availability
 * - Both expect similar relational effort
 * - Both expect similar boundaries and closeness
 * - Both expect similar conflict-repair rhythms
 * - Both experience expectations as shared, not imposed
 *
 * This is the architecture of mutual emotional coherence.
 */

export function detectEmotionalExpectationHarmony(profileA, profileB) {
  // Expectation of communication: high Expressive, high Relational
  const communicationAxes = ["Expressive", "Relational"];

  // Expectation of support: high Warm, high Sustainer
  const supportAxes = ["Warm", "Sustainer"];

  // Expectation of autonomy: high BoundaryAware, high MindCentered
  const autonomyAxes = ["BoundaryAware", "MindCentered"];

  // Expectation of emotional depth: high DepthOriented, high Transpersonal
  const depthAxes = ["DepthOriented", "Transpersonal"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_comm = avg(profileA, communicationAxes);
  const B_comm = avg(profileB, communicationAxes);

  const A_sup = avg(profileA, supportAxes);
  const B_sup = avg(profileB, supportAxes);

  const A_auto = avg(profileA, autonomyAxes);
  const B_auto = avg(profileB, autonomyAxes);

  const A_depth = avg(profileA, depthAxes);
  const B_depth = avg(profileB, depthAxes);

  // Harmony patterns: partners share compatible expectations for communication, support, autonomy, and depth
  const communicationHarmony = A_comm >= 0.55 && B_comm >= 0.55;
  const supportHarmony = A_sup >= 0.55 && B_sup >= 0.55;
  const autonomyHarmony = A_auto >= 0.55 && B_auto >= 0.55;
  const depthHarmony = A_depth >= 0.55 && B_depth >= 0.55;

  const harmonyCount =
    [communicationHarmony, supportHarmony, autonomyHarmony, depthHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.22,
      harmonyBoost: 0.48,
      flag: "emotional-expectation-harmony",
      details: "Emotional Expectation Harmony: Aligned Emotional Assumptions and Relational Agreements - Partners expect similar things"
    };
  }

  return { triggered: false };
}
