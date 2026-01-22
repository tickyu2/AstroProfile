/**
 * Harmonic Detector 2 - Emotional Safety Coherence
 *
 * Pattern: Partners share compatible emotional safety requirements
 *          → mutual ease → stable relational foundation
 *
 * This is the Luna mirror of the Solar "Emotional Safety Calibration Gap."
 *
 * Where the collapse detector diagnoses mismatched safety needs,
 * the harmonic detector identifies shared safety architecture.
 *
 * Emotional Safety Coherence emerges when:
 * - Both partners feel safe under similar conditions
 * - Both prefer similar emotional environments (softness, directness, closeness, space)
 * - Both regulate best under similar relational cues
 * - Both interpret emotional intensity similarly
 * - Both feel secure with similar levels of predictability or spontaneity
 * - Both experience the relationship as a safe emotional home
 *
 * This is the signature of relationships that feel:
 * grounded, steady, trustworthy, warm, predictable in the best way, emotionally breathable
 *
 * It's the felt sense of "I can relax with you."
 */

export function detectEmotionalSafetyCoherence(profileA, profileB) {
  // Soft-safety traits: high Warm, high Relational, high Expressive
  const softAxes = ["Warm", "Relational", "Expressive"];

  // Structure-safety traits: high OrderOriented, high Stabilizer, high BoundaryAware
  const structureAxes = ["OrderOriented", "Stabilizer", "BoundaryAware"];

  // Authenticity-safety traits: high DepthOriented, high Transpersonal
  const authenticityAxes = ["DepthOriented", "Transpersonal"];

  // Distance-safety traits: high MindCentered, high Initiator
  const distanceAxes = ["MindCentered", "Initiator"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_soft = avg(profileA, softAxes);
  const B_soft = avg(profileB, softAxes);

  const A_struct = avg(profileA, structureAxes);
  const B_struct = avg(profileB, structureAxes);

  const A_auth = avg(profileA, authenticityAxes);
  const B_auth = avg(profileB, authenticityAxes);

  const A_dist = avg(profileA, distanceAxes);
  const B_dist = avg(profileB, distanceAxes);

  // Coherence patterns: both partners prefer the same safety mode
  const softCoherence = A_soft >= 0.55 && B_soft >= 0.55;
  const structureCoherence = A_struct >= 0.55 && B_struct >= 0.55;
  const authenticityCoherence = A_auth >= 0.55 && B_auth >= 0.55;
  const distanceCoherence = A_dist >= 0.55 && B_dist >= 0.55;

  const coherenceCount =
    [softCoherence, structureCoherence, authenticityCoherence, distanceCoherence]
      .filter(Boolean).length;

  if (coherenceCount >= 2) {
    return {
      triggered: true,
      bonus: 0.12,
      harmonyBoost: 0.25,
      flag: "emotional-safety-coherence",
      details: "Emotional Safety Coherence: Shared Emotional Safety Architecture - Both partners feel safe under similar conditions"
    };
  }

  return { triggered: false };
}
