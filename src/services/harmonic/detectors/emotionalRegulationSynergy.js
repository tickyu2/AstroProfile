/**
 * Harmonic Detector 16 - Emotional Regulation Synergy
 *
 * Pattern: Partners regulate emotions in complementary, mutually supportive ways
 *          → shared stability → co-regulated emotional flow
 *
 * This is the Luna mirror of the Solar "Regulation Load Imbalance."
 *
 * This detector identifies when two people:
 * - Help each other calm down
 * - Help each other stay grounded
 * - Help each other return to equilibrium
 * - Regulate emotions in ways that fit together
 * - Balance each other's emotional intensity
 * - Create a shared emotional "homeostasis"
 *
 * It's the signature of relationships where partners say:
 * "You help me stay centered."
 * "We regulate each other well."
 * "You calm me without suppressing me."
 * "We balance each other's emotional energy."
 *
 * This is the Luna-axis of emotional co-regulation -
 * the sense that emotional stability is a shared system, not an individual burden.
 *
 * It emerges when:
 * - Both partners have compatible regulation strategies
 * - Both soothe each other in ways that feel natural
 * - Both respond to emotional intensity with complementary pacing
 * - Both help each other return to baseline
 * - Both feel emotionally steadier together than alone
 * - Both experience emotional regulation as mutual, not one-sided
 *
 * This is the architecture of shared emotional homeostasis.
 */

export function detectEmotionalRegulationSynergy(profileA, profileB) {
  // Self-regulation traits: high MindCentered, high BoundaryAware
  const selfRegAxes = ["MindCentered", "BoundaryAware"];

  // Co-regulation traits: high Warm, high Relational
  const coRegAxes = ["Warm", "Relational"];

  // Emotional grounding traits: high Stabilizer, high Sustainer
  const groundingAxes = ["Stabilizer", "Sustainer"];

  // Emotional modulation traits: high DepthOriented, high Expressive
  const modulationAxes = ["DepthOriented", "Expressive"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_self = avg(profileA, selfRegAxes);
  const B_self = avg(profileB, selfRegAxes);

  const A_co = avg(profileA, coRegAxes);
  const B_co = avg(profileB, coRegAxes);

  const A_ground = avg(profileA, groundingAxes);
  const B_ground = avg(profileB, groundingAxes);

  const A_mod = avg(profileA, modulationAxes);
  const B_mod = avg(profileB, modulationAxes);

  // Harmony patterns: partners share compatible self-regulation, co-regulation, grounding, and modulation
  const selfRegHarmony = A_self >= 0.55 && B_self >= 0.55;
  const coRegHarmony = A_co >= 0.55 && B_co >= 0.55;
  const groundingHarmony = A_ground >= 0.55 && B_ground >= 0.55;
  const modulationHarmony = A_mod >= 0.55 && B_mod >= 0.55;

  const harmonyCount =
    [selfRegHarmony, coRegHarmony, groundingHarmony, modulationHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.18,
      harmonyBoost: 0.36,
      flag: "emotional-regulation-synergy",
      details: "Emotional Regulation Synergy: Mutual Co-Regulation and Shared Emotional Homeostasis - Partners help each other stay centered"
    };
  }

  return { triggered: false };
}
