/**
 * Harmonic Detector 29 - Emotional Reciprocity Timing Harmony
 *
 * Pattern: Partners give and receive emotional support at compatible times
 *          → smooth relational flow → balanced emotional rhythm
 *
 * This is the Luna mirror of the Solar "Timing Burden Divergence."
 *
 * This detector identifies when two people:
 * - Offer emotional support at the right moments
 * - Respond to each other's needs with compatible timing
 * - Give space or closeness at aligned intervals
 * - Match each other's emotional "windows of availability"
 * - Avoid timing mismatches that create frustration or missed bids
 * - Maintain a rhythm of emotional exchange that feels natural
 *
 * It's the signature of relationships where partners say:
 * "You show up when it matters."
 * "We respond to each other at the right time."
 * "Our emotional timing feels aligned."
 * "We don't miss each other's signals."
 *
 * This is the Luna-axis of emotional timing attunement -
 * the sense that emotional exchange happens when it's needed.
 *
 * It emerges when:
 * - Both partners respond to emotional bids with similar immediacy
 * - Both initiate support at compatible moments
 * - Both understand when the other needs space or closeness
 * - Both avoid overwhelming or abandoning each other
 * - Both maintain a shared cadence of emotional responsiveness
 * - Both experience timing as a mutual rhythm rather than a mismatch
 *
 * This is the architecture of synchronized emotional timing.
 */

export function detectEmotionalReciprocityTimingHarmony(profileA, profileB) {
  // Responsiveness timing traits: high Warm, high Expressive
  const responsivenessAxes = ["Warm", "Expressive"];

  // Support timing traits: high Relational, high Sustainer
  const supportAxes = ["Relational", "Sustainer"];

  // Space-giving timing traits: high BoundaryAware, high MindCentered
  const spaceAxes = ["BoundaryAware", "MindCentered"];

  // Emotional pacing traits: high Stabilizer, high FluidIdentity
  const pacingAxes = ["Stabilizer", "FluidIdentity"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_resp = avg(profileA, responsivenessAxes);
  const B_resp = avg(profileB, responsivenessAxes);

  const A_sup = avg(profileA, supportAxes);
  const B_sup = avg(profileB, supportAxes);

  const A_space = avg(profileA, spaceAxes);
  const B_space = avg(profileB, spaceAxes);

  const A_pace = avg(profileA, pacingAxes);
  const B_pace = avg(profileB, pacingAxes);

  // Harmony patterns: partners share compatible timing for responsiveness, support, space, and pacing
  const responsivenessHarmony = A_resp >= 0.55 && B_resp >= 0.55;
  const supportHarmony = A_sup >= 0.55 && B_sup >= 0.55;
  const spaceHarmony = A_space >= 0.55 && B_space >= 0.55;
  const pacingHarmony = A_pace >= 0.55 && B_pace >= 0.55;

  const harmonyCount =
    [responsivenessHarmony, supportHarmony, spaceHarmony, pacingHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.22,
      harmonyBoost: 0.50,
      flag: "emotional-reciprocity-timing-harmony",
      details: "Emotional Reciprocity Timing Harmony: Aligned Timing of Emotional Giving and Receiving - Partners show up when it matters"
    };
  }

  return { triggered: false };
}
