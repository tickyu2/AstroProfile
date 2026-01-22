/**
 * Harmonic Detector 10 - Emotional Intimacy Coherence
 *
 * Pattern: Partners open emotionally at compatible depths and tempos
 *          → mutual closeness → sustained emotional connection
 *
 * This is the Luna mirror of the Solar "Intimacy Gradient Mismatch."
 *
 * This detector identifies when two people:
 * - Open up at similar speeds
 * - Reveal themselves at compatible depths
 * - Feel comfortable with similar levels of emotional closeness
 * - Desire intimacy at similar frequencies
 * - Maintain closeness in a shared rhythm
 * - Experience vulnerability as mutual, not uneven
 *
 * It's the signature of relationships where partners say:
 * "We open up to each other naturally."
 * "We want closeness in the same way."
 * "We deepen together."
 * "Our vulnerability rhythms match."
 *
 * This is the Luna-axis of emotional closeness -
 * the sense that intimacy is a shared, safe, and mutually desired experience.
 *
 * It emerges when:
 * - Both partners enjoy similar levels of emotional depth
 * - Both feel comfortable sharing inner worlds
 * - Both feel nourished by closeness rather than overwhelmed
 * - Both maintain intimacy without pressure or withdrawal
 * - Both experience vulnerability as reciprocal
 * - Both deepen the relationship at a shared pace
 *
 * This is the architecture of mutual emotional openness.
 */

export function detectEmotionalIntimacyCoherence(profileA, profileB) {
  // Depth intimacy traits: high DepthOriented, high Transpersonal
  const depthAxes = ["DepthOriented", "Transpersonal"];

  // Warm intimacy traits: high Warm, high Relational
  const warmAxes = ["Warm", "Relational"];

  // Vulnerability traits: high Expressive, high FluidIdentity
  const vulnerabilityAxes = ["Expressive", "FluidIdentity"];

  // Intimacy pacing traits: high Sustainer, high Stabilizer
  const pacingAxes = ["Sustainer", "Stabilizer"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_depth = avg(profileA, depthAxes);
  const B_depth = avg(profileB, depthAxes);

  const A_warm = avg(profileA, warmAxes);
  const B_warm = avg(profileB, warmAxes);

  const A_vuln = avg(profileA, vulnerabilityAxes);
  const B_vuln = avg(profileB, vulnerabilityAxes);

  const A_pace = avg(profileA, pacingAxes);
  const B_pace = avg(profileB, pacingAxes);

  // Harmony patterns: partners share compatible intimacy depth, warmth, vulnerability, and pacing
  const depthHarmony = A_depth >= 0.55 && B_depth >= 0.55;
  const warmHarmony = A_warm >= 0.55 && B_warm >= 0.55;
  const vulnerabilityHarmony = A_vuln >= 0.55 && B_vuln >= 0.55;
  const pacingHarmony = A_pace >= 0.55 && B_pace >= 0.55;

  const harmonyCount =
    [depthHarmony, warmHarmony, vulnerabilityHarmony, pacingHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.16,
      harmonyBoost: 0.34,
      flag: "emotional-intimacy-coherence",
      details: "Emotional Intimacy Coherence: Aligned Depth, Vulnerability, and Closeness Rhythm - Partners deepen intimacy together naturally"
    };
  }

  return { triggered: false };
}
