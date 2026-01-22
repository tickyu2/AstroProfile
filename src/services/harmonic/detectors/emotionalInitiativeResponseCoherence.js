/**
 * Harmonic Detector 31 - Emotional Initiative-Response Coherence
 *
 * Pattern: Partners' emotional initiatives and responses form a coherent loop
 *          → fluid relational movement → stable emotional rhythm
 *
 * This is the Luna mirror of the Solar "Initiative-Response Imbalance."
 *
 * This detector identifies when two people:
 * - Initiate emotional contact in ways that invite natural responses
 * - Respond in ways that encourage further connection
 * - Maintain a balanced cycle of reaching and receiving
 * - Avoid patterns where one always leads and the other always follows
 * - Create a relational "call-and-response" that feels alive
 * - Sustain emotional momentum without pressure or stagnation
 *
 * It's the signature of relationships where partners say:
 * "When you reach, I respond — and vice versa."
 * "Our emotional flow feels mutual."
 * "We don't get stuck in one-sided loops."
 * "We move each other forward."
 *
 * This is the Luna-axis of emotional reciprocity-in-motion -
 * the sense that emotional action and response form a single, coherent rhythm.
 *
 * It emerges when:
 * - Both partners initiate in ways that feel inviting
 * - Both respond in ways that feel encouraging
 * - Both avoid shutting down or overwhelming the loop
 * - Both maintain a dynamic, balanced emotional exchange
 * - Both feel emotionally "in motion" together
 * - Both experience initiative and response as a shared dance
 *
 * This is the architecture of mutual emotional propulsion.
 */

export function detectEmotionalInitiativeResponseCoherence(profileA, profileB) {
  // Initiative traits: high Initiator, high Expressive
  const initiativeAxes = ["Initiator", "Expressive"];

  // Response traits: high Warm, high Relational
  const responseAxes = ["Warm", "Relational"];

  // Loop stability traits: high Stabilizer, high Sustainer
  const stabilityAxes = ["Stabilizer", "Sustainer"];

  // Loop fluidity traits: high FluidIdentity, high DepthOriented
  const fluidityAxes = ["FluidIdentity", "DepthOriented"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_init = avg(profileA, initiativeAxes);
  const B_init = avg(profileB, initiativeAxes);

  const A_resp = avg(profileA, responseAxes);
  const B_resp = avg(profileB, responseAxes);

  const A_stab = avg(profileA, stabilityAxes);
  const B_stab = avg(profileB, stabilityAxes);

  const A_fluid = avg(profileA, fluidityAxes);
  const B_fluid = avg(profileB, fluidityAxes);

  // Harmony patterns: partners share compatible initiative, responsiveness, stability, and fluidity
  const initiativeHarmony = A_init >= 0.55 && B_init >= 0.55;
  const responseHarmony = A_resp >= 0.55 && B_resp >= 0.55;
  const stabilityHarmony = A_stab >= 0.55 && B_stab >= 0.55;
  const fluidityHarmony = A_fluid >= 0.55 && B_fluid >= 0.55;

  const harmonyCount =
    [initiativeHarmony, responseHarmony, stabilityHarmony, fluidityHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.24,
      harmonyBoost: 0.52,
      flag: "emotional-initiative-response-coherence",
      details: "Emotional Initiative-Response Coherence: Balanced Emotional Action and Attuned Response Loop - Partners reach and respond in harmony"
    };
  }

  return { triggered: false };
}
