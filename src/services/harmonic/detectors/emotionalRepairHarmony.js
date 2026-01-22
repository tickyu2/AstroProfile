/**
 * Harmonic Detector 8 - Emotional Repair Harmony
 *
 * Pattern: Partners repair emotional ruptures in compatible ways
 *          → smooth reconnection → resilient relational bond
 *
 * This is the Luna mirror of the Solar "Repair Threshold Mismatch"
 * and "Repair Strategy Mismatch."
 *
 * This detector identifies when two people:
 * - Repair at similar speeds
 * - Use compatible repair strategies
 * - Feel soothed by similar gestures
 * - Interpret repair attempts similarly
 * - Return to connection in a shared rhythm
 * - Experience repair as mutual, not one-sided
 *
 * It's the signature of relationships where partners say:
 * "We know how to fix things together."
 * "We come back to each other easily."
 * "Our repair styles match."
 * "We don't stay disconnected for long."
 *
 * This is the Luna-axis of emotional healing -
 * the sense that rupture is temporary and reconnection is natural.
 *
 * It emerges when:
 * - Both partners initiate repair in compatible ways
 * - Both respond well to each other's repair attempts
 * - Both feel repair is meaningful and sincere
 * - Both return to emotional equilibrium together
 * - Both feel repair strengthens the bond rather than draining it
 * - Both experience conflict as survivable and repairable
 *
 * This is the architecture of shared emotional resilience.
 */

export function detectEmotionalRepairHarmony(profileA, profileB) {
  // Repair initiation traits: high Warm, high Expressive, high Initiator
  const initiationAxes = ["Warm", "Expressive", "Initiator"];

  // Repair receptivity traits: high Relational, high DepthOriented
  const receptivityAxes = ["Relational", "DepthOriented"];

  // Repair stability traits: high Stabilizer, high Sustainer
  const stabilityAxes = ["Stabilizer", "Sustainer"];

  // Repair flexibility traits: high FluidIdentity, high Transpersonal
  const flexibilityAxes = ["FluidIdentity", "Transpersonal"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_init = avg(profileA, initiationAxes);
  const B_init = avg(profileB, initiationAxes);

  const A_recv = avg(profileA, receptivityAxes);
  const B_recv = avg(profileB, receptivityAxes);

  const A_stab = avg(profileA, stabilityAxes);
  const B_stab = avg(profileB, stabilityAxes);

  const A_flex = avg(profileA, flexibilityAxes);
  const B_flex = avg(profileB, flexibilityAxes);

  // Harmony patterns: partners share compatible repair initiation, receptivity, stability, and flexibility
  const initiationHarmony = A_init >= 0.55 && B_init >= 0.55;
  const receptivityHarmony = A_recv >= 0.55 && B_recv >= 0.55;
  const stabilityHarmony = A_stab >= 0.55 && B_stab >= 0.55;
  const flexibilityHarmony = A_flex >= 0.55 && B_flex >= 0.55;

  const harmonyCount =
    [initiationHarmony, receptivityHarmony, stabilityHarmony, flexibilityHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.16,
      harmonyBoost: 0.32,
      flag: "emotional-repair-harmony",
      details: "Emotional Repair Harmony: Shared Rupture-to-Repair Flow - Partners repair in a shared, healing way"
    };
  }

  return { triggered: false };
}
