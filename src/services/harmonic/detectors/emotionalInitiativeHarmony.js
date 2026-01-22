/**
 * Harmonic Detector 19 - Emotional Initiative Harmony
 *
 * Pattern: Partners initiate emotional connection in compatible ways
 *          → shared momentum → balanced relational movement
 *
 * This is the Luna mirror of the Solar "Initiative Imbalance."
 *
 * This detector identifies when two people:
 * - Initiate emotional contact at similar frequencies
 * - Take emotional action with compatible timing
 * - Reach out in ways that feel natural to the other
 * - Share responsibility for emotional movement
 * - Create a balanced rhythm of emotional initiation
 * - Feel neither pressure nor stagnation
 *
 * It's the signature of relationships where partners say:
 * "We both reach for each other."
 * "We take turns initiating."
 * "It doesn't feel one-sided."
 * "We move toward each other in sync."
 *
 * This is the Luna-axis of emotional agency -
 * the sense that both partners participate in creating connection.
 *
 * It emerges when:
 * - Both partners initiate closeness at similar intervals
 * - Both feel comfortable taking emotional action
 * - Both respond to each other's bids with similar enthusiasm
 * - Both feel empowered rather than burdened
 * - Both experience emotional movement as shared
 * - Both feel the relationship has a natural, mutual momentum
 *
 * This is the architecture of balanced emotional initiative.
 */

export function detectEmotionalInitiativeHarmony(profileA, profileB) {
  // Initiative traits: high Initiator, high Expressive
  const initiativeAxes = ["Initiator", "Expressive"];

  // Responsiveness traits: high Warm, high Relational
  const responsivenessAxes = ["Warm", "Relational"];

  // Momentum traits: high FluidIdentity, high Sustainer
  const momentumAxes = ["FluidIdentity", "Sustainer"];

  // Stability traits: high Stabilizer, high BoundaryAware
  const stabilityAxes = ["Stabilizer", "BoundaryAware"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_init = avg(profileA, initiativeAxes);
  const B_init = avg(profileB, initiativeAxes);

  const A_resp = avg(profileA, responsivenessAxes);
  const B_resp = avg(profileB, responsivenessAxes);

  const A_mom = avg(profileA, momentumAxes);
  const B_mom = avg(profileB, momentumAxes);

  const A_stab = avg(profileA, stabilityAxes);
  const B_stab = avg(profileB, stabilityAxes);

  // Harmony patterns: partners share compatible initiative, responsiveness, momentum, and stability
  const initiativeHarmony = A_init >= 0.55 && B_init >= 0.55;
  const responsivenessHarmony = A_resp >= 0.55 && B_resp >= 0.55;
  const momentumHarmony = A_mom >= 0.55 && B_mom >= 0.55;
  const stabilityHarmony = A_stab >= 0.55 && B_stab >= 0.55;

  const harmonyCount =
    [initiativeHarmony, responsivenessHarmony, momentumHarmony, stabilityHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.18,
      harmonyBoost: 0.38,
      flag: "emotional-initiative-harmony",
      details: "Emotional Initiative Harmony: Balanced Emotional Action and Shared Momentum - Partners both reach for each other"
    };
  }

  return { triggered: false };
}
