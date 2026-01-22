/**
 * Harmonic Detector 4 - Emotional Reciprocity Flow
 *
 * Pattern: Partners exchange emotional energy in a balanced, natural rhythm
 *          → mutual nourishment → relational vitality
 *
 * This is the Luna mirror of the Solar "Emotional Reciprocity Deficit"
 * and "Reciprocity Timing Offset."
 *
 * This detector identifies when emotional giving and receiving feels:
 * - Effortless
 * - Balanced
 * - Rhythmic
 * - Mutually energizing
 * - Attuned
 * - Sustainable
 *
 * It's the signature of relationships where partners say:
 * "I love how we take care of each other."
 * "It feels good to give to you."
 * "You meet me where I meet you."
 * "We both show up."
 *
 * This is the Luna-axis of emotional circulation -
 * the sense that emotional energy flows between partners like a well-tuned system.
 *
 * It emerges when:
 * - Both partners give and receive in compatible amounts
 * - Both initiate and respond in a natural rhythm
 * - Both feel nourished rather than depleted
 * - Both feel seen, valued, and emotionally held
 * - Both feel the relationship is a two-way current
 * - Both feel the emotional exchange is alive and reciprocal
 *
 * This is the architecture of mutual emotional generosity.
 */

export function detectEmotionalReciprocityFlow(profileA, profileB) {
  // Giving traits: high Warm, high Expressive, high Relational
  const givingAxes = ["Warm", "Expressive", "Relational"];

  // Receiving traits: high DepthOriented, high Transpersonal
  const receivingAxes = ["DepthOriented", "Transpersonal"];

  // Flow traits: high FluidIdentity, high Initiator, high Sustainer
  const flowAxes = ["FluidIdentity", "Initiator", "Sustainer"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_give = avg(profileA, givingAxes);
  const B_give = avg(profileB, givingAxes);

  const A_recv = avg(profileA, receivingAxes);
  const B_recv = avg(profileB, receivingAxes);

  const A_flow = avg(profileA, flowAxes);
  const B_flow = avg(profileB, flowAxes);

  // Harmony patterns: both partners give, receive, and flow at compatible levels
  const givingHarmony = A_give >= 0.55 && B_give >= 0.55;
  const receivingHarmony = A_recv >= 0.55 && B_recv >= 0.55;
  const flowHarmony = A_flow >= 0.55 && B_flow >= 0.55;

  const harmonyCount =
    [givingHarmony, receivingHarmony, flowHarmony].filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.14,
      harmonyBoost: 0.28,
      flag: "emotional-reciprocity-flow",
      details: "Emotional Reciprocity Flow: Balanced Emotional Exchange Rhythm - Partners give and receive in a natural, nourishing rhythm"
    };
  }

  return { triggered: false };
}
