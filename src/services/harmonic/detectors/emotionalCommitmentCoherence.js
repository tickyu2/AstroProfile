/**
 * Harmonic Detector 20 - Emotional Commitment Coherence
 *
 * Pattern: Partners maintain compatible levels of emotional commitment
 *          → shared investment → stable long-term relational trajectory
 *
 * This is the Luna mirror of the Solar "Commitment Gradient Divergence."
 *
 * This detector identifies when two people:
 * - Commit at similar depths
 * - Invest emotional energy at similar levels
 * - Maintain the relationship with compatible consistency
 * - Show up reliably for each other
 * - Hold similar visions of long-term emotional continuity
 * - Experience commitment as mutual rather than uneven
 *
 * It's the signature of relationships where partners say:
 * "We're in this together."
 * "We both show up."
 * "We're equally invested."
 * "Our commitment levels match."
 *
 * This is the Luna-axis of emotional dedication -
 * the sense that both partners are building the same future with the same steadiness.
 *
 * It emerges when:
 * - Both partners maintain emotional presence consistently
 * - Both follow through on emotional commitments
 * - Both invest in the relationship at similar intensities
 * - Both value long-term emotional continuity
 * - Both feel secure in the other's dedication
 * - Both experience commitment as a shared foundation
 *
 * This is the architecture of aligned emotional investment.
 */

export function detectEmotionalCommitmentCoherence(profileA, profileB) {
  // Long-term dedication traits: high Sustainer, high Stabilizer
  const dedicationAxes = ["Sustainer", "Stabilizer"];

  // Emotional reliability traits: high BoundaryAware, high OrderOriented
  const reliabilityAxes = ["BoundaryAware", "OrderOriented"];

  // Relational investment traits: high Warm, high Relational
  const investmentAxes = ["Warm", "Relational"];

  // Vision alignment traits: high DepthOriented, high Transpersonal
  const visionAxes = ["DepthOriented", "Transpersonal"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_ded = avg(profileA, dedicationAxes);
  const B_ded = avg(profileB, dedicationAxes);

  const A_rel = avg(profileA, reliabilityAxes);
  const B_rel = avg(profileB, reliabilityAxes);

  const A_inv = avg(profileA, investmentAxes);
  const B_inv = avg(profileB, investmentAxes);

  const A_vis = avg(profileA, visionAxes);
  const B_vis = avg(profileB, visionAxes);

  // Harmony patterns: partners share compatible dedication, reliability, investment, and long-term vision
  const dedicationHarmony = A_ded >= 0.55 && B_ded >= 0.55;
  const reliabilityHarmony = A_rel >= 0.55 && B_rel >= 0.55;
  const investmentHarmony = A_inv >= 0.55 && B_inv >= 0.55;
  const visionHarmony = A_vis >= 0.55 && B_vis >= 0.55;

  const harmonyCount =
    [dedicationHarmony, reliabilityHarmony, investmentHarmony, visionHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.20,
      harmonyBoost: 0.40,
      flag: "emotional-commitment-coherence",
      details: "Emotional Commitment Coherence: Aligned Emotional Investment and Long-Term Dedication - Partners are equally committed"
    };
  }

  return { triggered: false };
}
