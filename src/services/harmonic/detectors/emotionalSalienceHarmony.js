/**
 * Harmonic Detector 13 - Emotional Salience Harmony
 *
 * Pattern: Partners assign similar importance to emotional cues
 *          → shared focus → smooth emotional coordination
 *
 * This is the Luna mirror of the Solar "Emotional Salience Prioritization Gap."
 *
 * This detector identifies when two people:
 * - Notice the same emotional signals
 * - Prioritize the same emotional cues
 * - Respond to emotional events with similar urgency
 * - Track the same emotional "highlights" in a moment
 * - Filter out the same emotional "noise"
 * - Orient toward emotional meaning with similar sensitivity
 *
 * It's the signature of relationships where partners say:
 * "Yes, that mattered to me too."
 * "We both picked up on that."
 * "We're tuned to the same emotional signals."
 * "We notice the same things."
 *
 * This is the Luna-axis of emotional attention -
 * the sense that emotional relevance is shared rather than mismatched.
 *
 * It emerges when:
 * - Both partners detect emotional shifts at similar thresholds
 * - Both respond to emotional cues with similar weight
 * - Both track emotional nuance with compatible sensitivity
 * - Both orient toward emotional meaning in similar ways
 * - Both feel emotionally "on the same page" about what matters
 * - Both experience emotional salience as a shared field
 *
 * This is the architecture of aligned emotional attention.
 */

export function detectEmotionalSalienceHarmony(profileA, profileB) {
  // High-salience sensitivity traits: high DepthOriented, high Relational
  const sensitivityAxes = ["DepthOriented", "Relational"];

  // Emotional relevance traits: high Expressive, high Warm
  const relevanceAxes = ["Expressive", "Warm"];

  // Salience filtering traits: high MindCentered, high BoundaryAware
  const filteringAxes = ["MindCentered", "BoundaryAware"];

  // Shared-attention traits: high Sustainer, high OrderOriented
  const attentionAxes = ["Sustainer", "OrderOriented"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_sens = avg(profileA, sensitivityAxes);
  const B_sens = avg(profileB, sensitivityAxes);

  const A_rel = avg(profileA, relevanceAxes);
  const B_rel = avg(profileB, relevanceAxes);

  const A_filt = avg(profileA, filteringAxes);
  const B_filt = avg(profileB, filteringAxes);

  const A_att = avg(profileA, attentionAxes);
  const B_att = avg(profileB, attentionAxes);

  // Harmony patterns: partners share compatible salience sensitivity, relevance, filtering, and attention
  const sensitivityHarmony = A_sens >= 0.55 && B_sens >= 0.55;
  const relevanceHarmony = A_rel >= 0.55 && B_rel >= 0.55;
  const filteringHarmony = A_filt >= 0.55 && B_filt >= 0.55;
  const attentionHarmony = A_att >= 0.55 && B_att >= 0.55;

  const harmonyCount =
    [sensitivityHarmony, relevanceHarmony, filteringHarmony, attentionHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.16,
      harmonyBoost: 0.34,
      flag: "emotional-salience-harmony",
      details: "Emotional Salience Harmony: Aligned Emotional Attention and Importance - Partners notice and prioritize the same things"
    };
  }

  return { triggered: false };
}
