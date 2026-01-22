/**
 * Harmonic Detector 37 - Emotional Identity Coherence
 *
 * Pattern: Partners' emotional identities coexist in harmony
 *          → mutual authenticity → stable relational selfhood
 *
 * This is the Luna mirror of the Solar "Identity Meaning Divergence."
 *
 * This detector identifies when two people:
 * - Maintain their emotional identity without losing themselves
 * - Feel free to express their authentic emotional style
 * - Experience the relationship as identity-affirming, not identity-eroding
 * - Understand and respect each other's emotional "signature"
 * - Integrate each other's emotional worlds without conflict
 * - Feel like themselves with each other, not despite each other
 *
 * It's the signature of relationships where partners say:
 * "I feel like myself with you."
 * "You understand who I am emotionally."
 * "Our identities fit together."
 * "We don't distort each other's emotional truth."
 *
 * This is the Luna-axis of emotional self-coherence -
 * the sense that the relationship supports, rather than destabilizes, who each person is.
 *
 * It emerges when:
 * - Both partners have compatible emotional self-concepts
 * - Both express emotions in ways that feel natural to the other
 * - Both avoid identity-erasing dynamics
 * - Both feel emotionally recognized and mirrored
 * - Both maintain individuality within connection
 * - Both experience identity as coherent, not compromised
 *
 * This is the architecture of mutual emotional authenticity.
 */

export function detectEmotionalIdentityCoherence(profileA, profileB) {
  // Core emotional identity traits: high DepthOriented, high FluidIdentity
  const identityAxes = ["DepthOriented", "FluidIdentity"];

  // Authentic expression traits: high Expressive, high Warm
  const expressionAxes = ["Expressive", "Warm"];

  // Self-consistency traits: high Stabilizer, high Sustainer
  const consistencyAxes = ["Stabilizer", "Sustainer"];

  // Mutual recognition traits: high Relational, high BoundaryAware
  const recognitionAxes = ["Relational", "BoundaryAware"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_id = avg(profileA, identityAxes);
  const B_id = avg(profileB, identityAxes);

  const A_expr = avg(profileA, expressionAxes);
  const B_expr = avg(profileB, expressionAxes);

  const A_cons = avg(profileA, consistencyAxes);
  const B_cons = avg(profileB, consistencyAxes);

  const A_rec = avg(profileA, recognitionAxes);
  const B_rec = avg(profileB, recognitionAxes);

  // Harmony patterns: partners share compatible identity, expression, consistency, and mutual recognition
  const identityHarmony = A_id >= 0.55 && B_id >= 0.55;
  const expressionHarmony = A_expr >= 0.55 && B_expr >= 0.55;
  const consistencyHarmony = A_cons >= 0.55 && B_cons >= 0.55;
  const recognitionHarmony = A_rec >= 0.55 && B_rec >= 0.55;

  const harmonyCount =
    [identityHarmony, expressionHarmony, consistencyHarmony, recognitionHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.28,
      harmonyBoost: 0.60,
      flag: "emotional-identity-coherence",
      details: "Emotional Identity Coherence: Mutual Authenticity and Compatible Emotional Selfhood - Partners feel like themselves together"
    };
  }

  return { triggered: false };
}
