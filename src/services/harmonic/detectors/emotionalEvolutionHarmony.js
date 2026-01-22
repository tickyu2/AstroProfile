/**
 * Harmonic Detector 47 - Emotional Evolution Harmony
 *
 * Pattern: Partners evolve emotionally at compatible tempos and trajectories
 *          → long-term growth coherence → resilient relational becoming
 *
 * This is the Luna mirror of the Solar "Evolution Pace Divergence."
 *
 * This detector identifies when two people:
 * - Grow emotionally at similar speeds
 * - Evolve in ways that complement each other
 * - Adapt to life's changes with compatible emotional styles
 * - Support each other's transformation without pressure or stagnation
 * - Avoid mismatches like "I'm transforming fast" vs. "I'm staying the same"
 * - Feel like their emotional evolution is a shared journey
 *
 * It's the signature of relationships where partners say:
 * "We're growing together."
 * "Your evolution supports mine."
 * "We change in ways that stay aligned."
 * "Our emotional becoming feels shared."
 *
 * This is the Luna-axis of emotional metamorphosis -
 * the sense that two people's inner transformations harmonize rather than collide.
 *
 * It emerges when:
 * - Both partners have compatible growth arcs
 * - Both adapt to emotional challenges with similar flexibility
 * - Both maintain curiosity and openness at aligned levels
 * - Both avoid growth-pressure or growth-avoidance dynamics
 * - Both feel emotionally supported in their evolution
 * - Both experience the relationship as a catalyst for becoming
 *
 * This is the architecture of synchronized emotional evolution.
 */

export function detectEmotionalEvolutionHarmony(profileA, profileB) {
  // Growth tempo traits: high FluidIdentity, high Expressive
  const tempoAxes = ["FluidIdentity", "Expressive"];

  // Evolution stability traits: high Stabilizer, high Sustainer
  const stabilityAxes = ["Stabilizer", "Sustainer"];

  // Adaptive transformation traits: high MindCentered, high Relational
  const adaptiveAxes = ["MindCentered", "Relational"];

  // Evolution direction traits: high DepthOriented, high Transpersonal
  const directionAxes = ["DepthOriented", "Transpersonal"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_temp = avg(profileA, tempoAxes);
  const B_temp = avg(profileB, tempoAxes);

  const A_stab = avg(profileA, stabilityAxes);
  const B_stab = avg(profileB, stabilityAxes);

  const A_adapt = avg(profileA, adaptiveAxes);
  const B_adapt = avg(profileB, adaptiveAxes);

  const A_dir = avg(profileA, directionAxes);
  const B_dir = avg(profileB, directionAxes);

  // Harmony patterns: partners share compatible tempo, stability, adaptability, and direction
  const tempoHarmony = A_temp >= 0.55 && B_temp >= 0.55;
  const stabilityHarmony = A_stab >= 0.55 && B_stab >= 0.55;
  const adaptabilityHarmony = A_adapt >= 0.55 && B_adapt >= 0.55;
  const directionHarmony = A_dir >= 0.55 && B_dir >= 0.55;

  const harmonyCount =
    [tempoHarmony, stabilityHarmony, adaptabilityHarmony, directionHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.36,
      harmonyBoost: 0.76,
      flag: "emotional-evolution-harmony",
      details: "Emotional Evolution Harmony: Aligned Growth Tempo, Direction, and Adaptive Transformation - Partners grow together"
    };
  }

  return { triggered: false };
}
