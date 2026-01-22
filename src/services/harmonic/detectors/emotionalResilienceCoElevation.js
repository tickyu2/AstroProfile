/**
 * Harmonic Detector 22 - Emotional Resilience Co-Elevation
 *
 * Pattern: Partners elevate each other's emotional resilience
 *          → shared strength → upward relational trajectory
 *
 * This is the Luna mirror of the Solar "Resilience Load Divergence."
 *
 * This detector identifies when two people:
 * - Help each other bounce back
 * - Amplify each other's emotional strength
 * - Recover faster together than separately
 * - Reinforce each other's coping strategies
 * - Turn challenges into shared growth
 * - Create a rising spiral of mutual resilience
 *
 * It's the signature of relationships where partners say:
 * "You make me stronger."
 * "We rise together."
 * "We help each other recover."
 * "Hard things become easier when we face them as a team."
 *
 * This is the Luna-axis of emotional fortification -
 * the sense that resilience is not just maintained, but enhanced through connection.
 *
 * It emerges when:
 * - Both partners support each other's emotional recovery
 * - Both encourage adaptive coping rather than avoidance
 * - Both reinforce each other's strengths
 * - Both help each other metabolize emotional difficulty
 * - Both feel more capable together than alone
 * - Both experience adversity as a shared ascent
 *
 * This is the architecture of mutual emotional uplift.
 */

export function detectEmotionalResilienceCoElevation(profileA, profileB) {
  // Recovery traits: high Stabilizer, high Sustainer
  const recoveryAxes = ["Stabilizer", "Sustainer"];

  // Encouragement traits: high Warm, high Expressive
  const encouragementAxes = ["Warm", "Expressive"];

  // Adaptive coping traits: high MindCentered, high BoundaryAware
  const copingAxes = ["MindCentered", "BoundaryAware"];

  // Growth-through-adversity traits: high DepthOriented, high Transpersonal
  const growthAxes = ["DepthOriented", "Transpersonal"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_rec = avg(profileA, recoveryAxes);
  const B_rec = avg(profileB, recoveryAxes);

  const A_enc = avg(profileA, encouragementAxes);
  const B_enc = avg(profileB, encouragementAxes);

  const A_cop = avg(profileA, copingAxes);
  const B_cop = avg(profileB, copingAxes);

  const A_gro = avg(profileA, growthAxes);
  const B_gro = avg(profileB, growthAxes);

  // Harmony patterns: partners share compatible recovery, encouragement, coping, and growth traits
  const recoveryHarmony = A_rec >= 0.55 && B_rec >= 0.55;
  const encouragementHarmony = A_enc >= 0.55 && B_enc >= 0.55;
  const copingHarmony = A_cop >= 0.55 && B_cop >= 0.55;
  const growthHarmony = A_gro >= 0.55 && B_gro >= 0.55;

  const harmonyCount =
    [recoveryHarmony, encouragementHarmony, copingHarmony, growthHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.20,
      harmonyBoost: 0.42,
      flag: "emotional-resilience-co-elevation",
      details: "Emotional Resilience Co-Elevation: Mutual Strengthening and Shared Recovery - Partners rise together through adversity"
    };
  }

  return { triggered: false };
}
