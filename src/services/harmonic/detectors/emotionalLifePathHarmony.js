/**
 * Harmonic Detector 40 - Emotional Life-Path Harmony
 *
 * Pattern: Partners' emotional life-paths move in compatible directions
 *          → long-term coherence → shared emotional future
 *
 * This is the Luna mirror of the Solar "Life-Path Divergence."
 *
 * This detector identifies when two people:
 * - Envision similar emotional futures
 * - Move through life transitions at compatible tempos
 * - Pursue long-arc emotional goals that reinforce each other
 * - Maintain aligned emotional priorities across seasons of life
 * - Adapt to change in ways that remain mutually supportive
 * - Feel like their emotional journeys "fit" together
 *
 * It's the signature of relationships where partners say:
 * "We're growing in the same direction."
 * "Our emotional futures align."
 * "We evolve in ways that support each other."
 * "Our life arcs feel compatible."
 *
 * This is the Luna-axis of emotional destiny coherence -
 * the sense that two emotional timelines can coexist without strain, sacrifice, or fragmentation.
 *
 * It emerges when:
 * - Both partners have compatible emotional visions for the future
 * - Both adapt to life changes with similar emotional flexibility
 * - Both maintain long-term emotional commitments at similar depths
 * - Both navigate major transitions (career, family, identity, purpose) with aligned emotional frameworks
 * - Both avoid life-path collisions that destabilize the relationship
 * - Both experience the relationship as a shared emotional journey
 *
 * This is the architecture of aligned emotional evolution.
 */

export function detectEmotionalLifePathHarmony(profileA, profileB) {
  // Future orientation traits: high Transpersonal, high DepthOriented
  const futureAxes = ["Transpersonal", "DepthOriented"];

  // Long-term stability traits: high Sustainer, high Stabilizer
  const stabilityAxes = ["Sustainer", "Stabilizer"];

  // Adaptive evolution traits: high FluidIdentity, high MindCentered
  const evolutionAxes = ["FluidIdentity", "MindCentered"];

  // Relational trajectory traits: high Relational, high Expressive
  const trajectoryAxes = ["Relational", "Expressive"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_future = avg(profileA, futureAxes);
  const B_future = avg(profileB, futureAxes);

  const A_stab = avg(profileA, stabilityAxes);
  const B_stab = avg(profileB, stabilityAxes);

  const A_evo = avg(profileA, evolutionAxes);
  const B_evo = avg(profileB, evolutionAxes);

  const A_traj = avg(profileA, trajectoryAxes);
  const B_traj = avg(profileB, trajectoryAxes);

  // Harmony patterns: partners share compatible future orientation, stability, evolution, and relational trajectory
  const futureHarmony = A_future >= 0.55 && B_future >= 0.55;
  const stabilityHarmony = A_stab >= 0.55 && B_stab >= 0.55;
  const evolutionHarmony = A_evo >= 0.55 && B_evo >= 0.55;
  const trajectoryHarmony = A_traj >= 0.55 && B_traj >= 0.55;

  const harmonyCount =
    [futureHarmony, stabilityHarmony, evolutionHarmony, trajectoryHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.30,
      harmonyBoost: 0.64,
      flag: "emotional-life-path-harmony",
      details: "Emotional Life-Path Harmony: Aligned Emotional Futures and Compatible Long-Arc Evolution - Partners grow in the same direction"
    };
  }

  return { triggered: false };
}
