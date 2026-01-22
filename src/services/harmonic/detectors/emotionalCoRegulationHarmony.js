/**
 * Harmonic Detector 33 - Emotional Co-Regulation Harmony
 *
 * Pattern: Partners help each other regulate emotions in balanced, attuned ways
 *          → shared stability → resilient emotional ecosystem
 *
 * This is the Luna mirror of the Solar "Co-Regulation Burden Divergence."
 *
 * This detector identifies when two people:
 * - Soothe each other without overfunctioning
 * - Uplift each other without pressure
 * - Help each other calm, ground, or re-center
 * - Respond to dysregulation with attuned support
 * - Maintain emotional balance together
 * - Create a shared regulatory rhythm
 *
 * It's the signature of relationships where partners say:
 * "You help me find my center."
 * "We steady each other."
 * "We regulate together, not alone."
 * "Your presence helps me return to myself."
 *
 * This is the Luna-axis of emotional co-stability -
 * the sense that two nervous systems form a shared, supportive loop.
 *
 * It emerges when:
 * - Both partners offer grounding support in compatible ways
 * - Both respond to dysregulation with steadiness rather than escalation
 * - Both help each other metabolize emotional intensity
 * - Both maintain balance without losing themselves
 * - Both feel emotionally safer together than apart
 * - Both experience co-regulation as mutual, not burdensome
 *
 * This is the architecture of shared emotional equilibrium.
 */

export function detectEmotionalCoRegulationHarmony(profileA, profileB) {
  // Grounding traits: high Stabilizer, high BoundaryAware
  const groundingAxes = ["Stabilizer", "BoundaryAware"];

  // Soothing traits: high Warm, high Expressive
  const soothingAxes = ["Warm", "Expressive"];

  // Emotional balance traits: high MindCentered, high Sustainer
  const balanceAxes = ["MindCentered", "Sustainer"];

  // Co-regulation attunement traits: high Relational, high DepthOriented
  const attunementAxes = ["Relational", "DepthOriented"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_ground = avg(profileA, groundingAxes);
  const B_ground = avg(profileB, groundingAxes);

  const A_soothe = avg(profileA, soothingAxes);
  const B_soothe = avg(profileB, soothingAxes);

  const A_bal = avg(profileA, balanceAxes);
  const B_bal = avg(profileB, balanceAxes);

  const A_att = avg(profileA, attunementAxes);
  const B_att = avg(profileB, attunementAxes);

  // Harmony patterns: partners share compatible grounding, soothing, balance, and co-regulation attunement
  const groundingHarmony = A_ground >= 0.55 && B_ground >= 0.55;
  const soothingHarmony = A_soothe >= 0.55 && B_soothe >= 0.55;
  const balanceHarmony = A_bal >= 0.55 && B_bal >= 0.55;
  const attunementHarmony = A_att >= 0.55 && B_att >= 0.55;

  const harmonyCount =
    [groundingHarmony, soothingHarmony, balanceHarmony, attunementHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.26,
      harmonyBoost: 0.56,
      flag: "emotional-co-regulation-harmony",
      details: "Emotional Co-Regulation Harmony: Mutual Emotional Stabilization and Shared Regulatory Rhythm - Partners steady each other"
    };
  }

  return { triggered: false };
}
