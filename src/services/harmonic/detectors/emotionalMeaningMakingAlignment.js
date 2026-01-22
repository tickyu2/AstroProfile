/**
 * Harmonic Detector 11 - Emotional Meaning-Making Alignment
 *
 * Pattern: Partners interpret emotional experiences through compatible frameworks
 *          → shared narrative → deep relational coherence
 *
 * This is the Luna mirror of the Solar "Meaning-Making Divergence."
 *
 * This detector identifies when two people:
 * - Interpret emotional events similarly
 * - Assign similar meaning to emotional signals
 * - Understand each other's emotional logic
 * - Share compatible emotional metaphors and frameworks
 * - Derive similar lessons from emotional experiences
 * - Build a shared emotional narrative over time
 *
 * It's the signature of relationships where partners say:
 * "We see this the same way."
 * "We understand what this means for us."
 * "We make sense of things together."
 * "Our emotional interpretations align."
 *
 * This is the Luna-axis of emotional cognition -
 * the sense that emotional meaning is co-constructed rather than contested.
 *
 * It emerges when:
 * - Both partners interpret emotional cues with similar depth
 * - Both derive meaning from emotional events in compatible ways
 * - Both understand the emotional significance of moments similarly
 * - Both share a compatible emotional worldview
 * - Both feel emotionally "on the same page"
 * - Both experience emotional meaning as a shared language
 *
 * This is the architecture of shared emotional understanding.
 */

export function detectEmotionalMeaningMakingAlignment(profileA, profileB) {
  // Depth meaning traits: high DepthOriented, high Transpersonal
  const depthAxes = ["DepthOriented", "Transpersonal"];

  // Relational meaning traits: high Relational, high Warm
  const relationalAxes = ["Relational", "Warm"];

  // Interpretive clarity traits: high Expressive, high FluidIdentity
  const interpretAxes = ["Expressive", "FluidIdentity"];

  // Narrative coherence traits: high Sustainer, high OrderOriented
  const narrativeAxes = ["Sustainer", "OrderOriented"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_depth = avg(profileA, depthAxes);
  const B_depth = avg(profileB, depthAxes);

  const A_rel = avg(profileA, relationalAxes);
  const B_rel = avg(profileB, relationalAxes);

  const A_interp = avg(profileA, interpretAxes);
  const B_interp = avg(profileB, interpretAxes);

  const A_narr = avg(profileA, narrativeAxes);
  const B_narr = avg(profileB, narrativeAxes);

  // Harmony patterns: partners share compatible meaning-making frameworks
  const depthHarmony = A_depth >= 0.55 && B_depth >= 0.55;
  const relationalHarmony = A_rel >= 0.55 && B_rel >= 0.55;
  const interpretHarmony = A_interp >= 0.55 && B_interp >= 0.55;
  const narrativeHarmony = A_narr >= 0.55 && B_narr >= 0.55;

  const harmonyCount =
    [depthHarmony, relationalHarmony, interpretHarmony, narrativeHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.16,
      harmonyBoost: 0.34,
      flag: "emotional-meaning-making-alignment",
      details: "Emotional Meaning-Making Alignment: Shared Emotional Interpretation Framework - Partners make meaning together"
    };
  }

  return { triggered: false };
}
