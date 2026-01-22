/**
 * Harmonic Detector 35 - Emotional Trust Renewal Harmony
 *
 * Pattern: Partners rebuild trust in compatible ways
 *          → stable emotional continuity → deepening relational security
 *
 * This is the Luna mirror of the Solar "Trust Renewal Gap."
 *
 * This detector identifies when two people:
 * - Renew trust at similar speeds
 * - Require similar forms of reassurance
 * - Offer repair gestures that feel meaningful to the other
 * - Return to emotional openness at compatible depths
 * - Maintain trust even after disruption
 * - Experience trust as a living, regenerating bond
 *
 * It's the signature of relationships where partners say:
 * "We know how to rebuild trust together."
 * "We heal in ways that make trust stronger, not weaker."
 * "We don't get stuck in mistrust cycles."
 * "Our trust grows through repair."
 *
 * This is the Luna-axis of emotional renewal -
 * the sense that trust is not fragile, but alive, capable of regrowth.
 *
 * It emerges when:
 * - Both partners need similar levels of reassurance
 * - Both offer trust-restoring behaviors naturally
 * - Both return to vulnerability at compatible tempos
 * - Both avoid reopening old wounds
 * - Both feel safe re-entering closeness
 * - Both experience trust renewal as a shared ritual
 *
 * This is the architecture of regenerative emotional security.
 */

export function detectEmotionalTrustRenewalHarmony(profileA, profileB) {
  // Reassurance traits: high Warm, high Relational
  const reassuranceAxes = ["Warm", "Relational"];

  // Trust rebuilding traits: high Stabilizer, high Sustainer
  const rebuildingAxes = ["Stabilizer", "Sustainer"];

  // Vulnerability reopening traits: high Expressive, high DepthOriented
  const vulnerabilityAxes = ["Expressive", "DepthOriented"];

  // Security restoration traits: high BoundaryAware, high MindCentered
  const securityAxes = ["BoundaryAware", "MindCentered"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_reas = avg(profileA, reassuranceAxes);
  const B_reas = avg(profileB, reassuranceAxes);

  const A_reb = avg(profileA, rebuildingAxes);
  const B_reb = avg(profileB, rebuildingAxes);

  const A_vul = avg(profileA, vulnerabilityAxes);
  const B_vul = avg(profileB, vulnerabilityAxes);

  const A_sec = avg(profileA, securityAxes);
  const B_sec = avg(profileB, securityAxes);

  // Harmony patterns: partners share compatible reassurance, rebuilding, vulnerability reopening, and security restoration
  const reassuranceHarmony = A_reas >= 0.55 && B_reas >= 0.55;
  const rebuildingHarmony = A_reb >= 0.55 && B_reb >= 0.55;
  const vulnerabilityHarmony = A_vul >= 0.55 && B_vul >= 0.55;
  const securityHarmony = A_sec >= 0.55 && B_sec >= 0.55;

  const harmonyCount =
    [reassuranceHarmony, rebuildingHarmony, vulnerabilityHarmony, securityHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.26,
      harmonyBoost: 0.58,
      flag: "emotional-trust-renewal-harmony",
      details: "Emotional Trust Renewal Harmony: Aligned Trust Rebuilding and Regenerative Security - Partners rebuild trust together"
    };
  }

  return { triggered: false };
}
