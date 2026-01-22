/**
 * Harmonic Detector 25 - Emotional Tempo Compatibility
 *
 * Pattern: Partners move through emotional experiences at compatible speeds
 *          → smooth pacing → stable emotional flow
 *
 * This is the Luna mirror of the Solar "Emotional Tempo Divergence."
 *
 * This detector identifies when two people:
 * - Process emotions at similar speeds
 * - Shift between emotional states with compatible timing
 * - Escalate or de-escalate emotional intensity at similar rates
 * - Take emotional action at a shared pace
 * - Recover from emotional events in aligned rhythms
 * - Maintain a relational tempo that feels neither rushed nor slow
 *
 * It's the signature of relationships where partners say:
 * "We move at the same emotional speed."
 * "We don't rush or drag each other."
 * "Our pacing feels natural."
 * "We process things in sync."
 *
 * This is the Luna-axis of emotional pacing -
 * the sense that emotional timing is shared rather than negotiated.
 *
 * It emerges when:
 * - Both partners process emotional information at similar speeds
 * - Both escalate emotional engagement at compatible tempos
 * - Both slow down or pause in similar ways
 * - Both recover from emotional intensity at similar rates
 * - Both feel neither overwhelmed nor under-stimulated
 * - Both experience emotional pacing as a shared rhythm
 *
 * This is the architecture of synchronized emotional timing.
 */

export function detectEmotionalTempoCompatibility(profileA, profileB) {
  // Processing speed traits: high Expressive, high MindCentered
  const processingAxes = ["Expressive", "MindCentered"];

  // Engagement tempo traits: high Initiator, high Relational
  const engagementAxes = ["Initiator", "Relational"];

  // Recovery tempo traits: high Stabilizer, high Sustainer
  const recoveryAxes = ["Stabilizer", "Sustainer"];

  // Modulation tempo traits: high DepthOriented, high FluidIdentity
  const modulationAxes = ["DepthOriented", "FluidIdentity"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_proc = avg(profileA, processingAxes);
  const B_proc = avg(profileB, processingAxes);

  const A_eng = avg(profileA, engagementAxes);
  const B_eng = avg(profileB, engagementAxes);

  const A_rec = avg(profileA, recoveryAxes);
  const B_rec = avg(profileB, recoveryAxes);

  const A_mod = avg(profileA, modulationAxes);
  const B_mod = avg(profileB, modulationAxes);

  // Harmony patterns: partners share compatible processing, engagement, recovery, and modulation tempos
  const processingHarmony = A_proc >= 0.55 && B_proc >= 0.55;
  const engagementHarmony = A_eng >= 0.55 && B_eng >= 0.55;
  const recoveryHarmony = A_rec >= 0.55 && B_rec >= 0.55;
  const modulationHarmony = A_mod >= 0.55 && B_mod >= 0.55;

  const harmonyCount =
    [processingHarmony, engagementHarmony, recoveryHarmony, modulationHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.22,
      harmonyBoost: 0.46,
      flag: "emotional-tempo-compatibility",
      details: "Emotional Tempo Compatibility: Aligned Emotional Pacing and Processing Speed - Partners move at the same emotional speed"
    };
  }

  return { triggered: false };
}
