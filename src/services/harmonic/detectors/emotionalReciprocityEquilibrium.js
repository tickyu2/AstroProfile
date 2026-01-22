/**
 * Harmonic Detector 23 - Emotional Reciprocity Equilibrium
 *
 * Pattern: Partners give and receive emotional energy in balanced, sustainable ways
 *          → mutual nourishment → stable relational flow
 *
 * This is the Luna mirror of the Solar "Reciprocity Load Divergence."
 *
 * This detector identifies when two people:
 * - Contribute emotional energy in compatible proportions
 * - Feel neither drained nor overburdened
 * - Receive emotional care in ways that feel fair and natural
 * - Give emotional support without resentment or depletion
 * - Maintain a sustainable rhythm of emotional exchange
 * - Experience reciprocity as a living, breathing balance
 *
 * It's the signature of relationships where partners say:
 * "We both show up."
 * "We support each other equally."
 * "It doesn't feel lopsided."
 * "Our emotional exchange feels natural and fair."
 *
 * This is the Luna-axis of emotional balance -
 * the sense that the relationship is a shared ecosystem, not a one-way channel.
 *
 * It emerges when:
 * - Both partners give emotional support at similar frequencies
 * - Both receive support with similar openness
 * - Both feel nourished rather than depleted
 * - Both maintain emotional presence without overextending
 * - Both feel the relationship is energetically sustainable
 * - Both experience reciprocity as equilibrium, not negotiation
 *
 * This is the architecture of mutual emotional sustainability.
 */

export function detectEmotionalReciprocityEquilibrium(profileA, profileB) {
  // Giving traits: high Warm, high Expressive
  const givingAxes = ["Warm", "Expressive"];

  // Receiving traits: high Relational, high FluidIdentity
  const receivingAxes = ["Relational", "FluidIdentity"];

  // Sustainability traits: high Stabilizer, high Sustainer
  const sustainAxes = ["Stabilizer", "Sustainer"];

  // Boundary balance traits: high BoundaryAware, high MindCentered
  const boundaryAxes = ["BoundaryAware", "MindCentered"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_give = avg(profileA, givingAxes);
  const B_give = avg(profileB, givingAxes);

  const A_recv = avg(profileA, receivingAxes);
  const B_recv = avg(profileB, receivingAxes);

  const A_sus = avg(profileA, sustainAxes);
  const B_sus = avg(profileB, sustainAxes);

  const A_bound = avg(profileA, boundaryAxes);
  const B_bound = avg(profileB, boundaryAxes);

  // Harmony patterns: partners share compatible giving, receiving, sustainability, and boundary balance
  const givingHarmony = A_give >= 0.55 && B_give >= 0.55;
  const receivingHarmony = A_recv >= 0.55 && B_recv >= 0.55;
  const sustainabilityHarmony = A_sus >= 0.55 && B_sus >= 0.55;
  const boundaryHarmony = A_bound >= 0.55 && B_bound >= 0.55;

  const harmonyCount =
    [givingHarmony, receivingHarmony, sustainabilityHarmony, boundaryHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.20,
      harmonyBoost: 0.42,
      flag: "emotional-reciprocity-equilibrium",
      details: "Emotional Reciprocity Equilibrium: Balanced Emotional Exchange and Mutual Sustainability - Partners nourish each other equally"
    };
  }

  return { triggered: false };
}
