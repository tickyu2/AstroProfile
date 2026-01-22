/**
 * Harmonic Detector 30 - Emotional Responsiveness Harmony
 *
 * Pattern: Partners respond to each other's emotional signals with compatible sensitivity
 *          → attuned connection → stable emotional flow
 *
 * This is the Luna mirror of the Solar "Responsiveness Load Divergence."
 *
 * This detector identifies when two people:
 * - Respond to emotional cues with similar sensitivity
 * - Match each other's emotional tone and intensity
 * - Offer support in ways that feel "just right"
 * - Avoid over-reacting or under-responding
 * - Maintain a balanced rhythm of emotional engagement
 * - Create a sense of being emotionally "met"
 *
 * It's the signature of relationships where partners say:
 * "You get me."
 * "You respond in a way that feels right."
 * "We match each other's emotional tone."
 * "I feel understood and met where I am."
 *
 * This is the Luna-axis of emotional attunement-in-motion -
 * the sense that responsiveness is neither too much nor too little.
 *
 * It emerges when:
 * - Both partners respond with similar emotional intensity
 * - Both adjust their tone to match the other's state
 * - Both offer comfort or space in attuned ways
 * - Both avoid emotional over-functioning
 * - Both feel emotionally "received"
 * - Both experience responsiveness as a shared dance
 *
 * This is the architecture of mutual emotional attunement.
 */

export function detectEmotionalResponsivenessHarmony(profileA, profileB) {
  // Sensitivity traits: high Warm, high Expressive
  const sensitivityAxes = ["Warm", "Expressive"];

  // Attunement traits: high Relational, high DepthOriented
  const attunementAxes = ["Relational", "DepthOriented"];

  // Modulation traits: high Stabilizer, high FluidIdentity
  const modulationAxes = ["Stabilizer", "FluidIdentity"];

  // Support traits: high Sustainer, high BoundaryAware
  const supportAxes = ["Sustainer", "BoundaryAware"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_sens = avg(profileA, sensitivityAxes);
  const B_sens = avg(profileB, sensitivityAxes);

  const A_att = avg(profileA, attunementAxes);
  const B_att = avg(profileB, attunementAxes);

  const A_mod = avg(profileA, modulationAxes);
  const B_mod = avg(profileB, modulationAxes);

  const A_sup = avg(profileA, supportAxes);
  const B_sup = avg(profileB, supportAxes);

  // Harmony patterns: partners share compatible sensitivity, attunement, modulation, and support responsiveness
  const sensitivityHarmony = A_sens >= 0.55 && B_sens >= 0.55;
  const attunementHarmony = A_att >= 0.55 && B_att >= 0.55;
  const modulationHarmony = A_mod >= 0.55 && B_mod >= 0.55;
  const supportHarmony = A_sup >= 0.55 && B_sup >= 0.55;

  const harmonyCount =
    [sensitivityHarmony, attunementHarmony, modulationHarmony, supportHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.24,
      harmonyBoost: 0.52,
      flag: "emotional-responsiveness-harmony",
      details: "Emotional Responsiveness Harmony: Aligned Emotional Sensitivity and Attuned Support - Partners match each other's tone"
    };
  }

  return { triggered: false };
}
