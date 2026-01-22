/**
 * Harmonic Detector 36 - Emotional Meaning Reinforcement Harmony
 *
 * Pattern: Partners reinforce similar emotional meanings
 *          → shared narrative → coherent relational identity
 *
 * This is the Luna mirror of the Solar "Meaning Reinforcement Gap."
 *
 * This detector identifies when two people:
 * - Interpret emotional events in compatible ways
 * - Reinforce similar meanings behind gestures, conflicts, and milestones
 * - Share a coherent emotional narrative of the relationship
 * - Assign similar significance to closeness, rituals, and turning points
 * - Maintain a shared emotional "story arc"
 * - Avoid mismatches like "this meant everything to me" vs. "I didn't think it mattered"
 *
 * It's the signature of relationships where partners say:
 * "We see this relationship the same way."
 * "We agree on what our moments mean."
 * "We make sense of things together."
 * "Our emotional story feels shared."
 *
 * This is the Luna-axis of emotional narrative coherence -
 * the sense that meaning is not accidental, but mutually reinforced.
 *
 * It emerges when:
 * - Both partners interpret emotional signals similarly
 * - Both assign compatible significance to relational events
 * - Both reinforce each other's emotional interpretations
 * - Both maintain a shared sense of "what this relationship is"
 * - Both avoid meaning-collisions that destabilize connection
 * - Both experience meaning-making as a collaborative act
 *
 * This is the architecture of shared emotional storytelling.
 */

export function detectEmotionalMeaningReinforcementHarmony(profileA, profileB) {
  // Meaning-making traits: high DepthOriented, high Transpersonal
  const meaningAxes = ["DepthOriented", "Transpersonal"];

  // Emotional interpretation traits: high Relational, high Expressive
  const interpretationAxes = ["Relational", "Expressive"];

  // Narrative coherence traits: high Sustainer, high Stabilizer
  const coherenceAxes = ["Sustainer", "Stabilizer"];

  // Significance sensitivity traits: high Warm, high FluidIdentity
  const significanceAxes = ["Warm", "FluidIdentity"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_mean = avg(profileA, meaningAxes);
  const B_mean = avg(profileB, meaningAxes);

  const A_interp = avg(profileA, interpretationAxes);
  const B_interp = avg(profileB, interpretationAxes);

  const A_coh = avg(profileA, coherenceAxes);
  const B_coh = avg(profileB, coherenceAxes);

  const A_sig = avg(profileA, significanceAxes);
  const B_sig = avg(profileB, significanceAxes);

  // Harmony patterns: partners share compatible meaning-making, interpretation, coherence, and significance sensitivity
  const meaningHarmony = A_mean >= 0.55 && B_mean >= 0.55;
  const interpretationHarmony = A_interp >= 0.55 && B_interp >= 0.55;
  const coherenceHarmony = A_coh >= 0.55 && B_coh >= 0.55;
  const significanceHarmony = A_sig >= 0.55 && B_sig >= 0.55;

  const harmonyCount =
    [meaningHarmony, interpretationHarmony, coherenceHarmony, significanceHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.28,
      harmonyBoost: 0.60,
      flag: "emotional-meaning-reinforcement-harmony",
      details: "Emotional Meaning Reinforcement Harmony: Shared Emotional Interpretation and Narrative Coherence - Partners make meaning together"
    };
  }

  return { triggered: false };
}
