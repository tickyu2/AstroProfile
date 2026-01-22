/**
 * Harmonic Detector 27 - Emotional Transparency Alignment
 *
 * Pattern: Partners share emotional truth with compatible clarity
 *          → mutual understanding → trust-rich relational atmosphere
 *
 * This is the Luna mirror of the Solar "Transparency Gap."
 *
 * This detector identifies when two people:
 * - Communicate emotional truth clearly
 * - Reveal inner states without distortion
 * - Express needs and feelings in compatible ways
 * - Avoid emotional ambiguity or concealment
 * - Maintain honesty without overwhelming each other
 * - Create a shared emotional "clear air"
 *
 * It's the signature of relationships where partners say:
 * "I know where you stand."
 * "You tell me the truth kindly."
 * "We don't hide from each other."
 * "Our emotional communication is clear and clean."
 *
 * This is the Luna-axis of emotional honesty -
 * the sense that transparency is mutual, safe, and aligned.
 *
 * It emerges when:
 * - Both partners express emotional truth with similar clarity
 * - Both avoid emotional fog or mixed signals
 * - Both communicate needs without guilt or pressure
 * - Both maintain honesty without harshness
 * - Both feel emotionally "seen without guessing"
 * - Both experience transparency as connection, not exposure
 *
 * This is the architecture of shared emotional clarity.
 */

export function detectEmotionalTransparencyAlignment(profileA, profileB) {
  // Clarity traits: high Expressive, high DepthOriented
  const clarityAxes = ["Expressive", "DepthOriented"];

  // Honesty traits: high Warm, high BoundaryAware
  const honestyAxes = ["Warm", "BoundaryAware"];

  // Directness traits: high Initiator, high Relational
  const directAxes = ["Initiator", "Relational"];

  // Consistency traits: high Sustainer, high Stabilizer
  const consistencyAxes = ["Sustainer", "Stabilizer"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_clar = avg(profileA, clarityAxes);
  const B_clar = avg(profileB, clarityAxes);

  const A_hon = avg(profileA, honestyAxes);
  const B_hon = avg(profileB, honestyAxes);

  const A_dir = avg(profileA, directAxes);
  const B_dir = avg(profileB, directAxes);

  const A_con = avg(profileA, consistencyAxes);
  const B_con = avg(profileB, consistencyAxes);

  // Harmony patterns: partners share compatible clarity, honesty, directness, and consistency
  const clarityHarmony = A_clar >= 0.55 && B_clar >= 0.55;
  const honestyHarmony = A_hon >= 0.55 && B_hon >= 0.55;
  const directnessHarmony = A_dir >= 0.55 && B_dir >= 0.55;
  const consistencyHarmony = A_con >= 0.55 && B_con >= 0.55;

  const harmonyCount =
    [clarityHarmony, honestyHarmony, directnessHarmony, consistencyHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.22,
      harmonyBoost: 0.48,
      flag: "emotional-transparency-alignment",
      details: "Emotional Transparency Alignment: Shared Emotional Honesty and Clarity - Partners communicate truth without distortion"
    };
  }

  return { triggered: false };
}
