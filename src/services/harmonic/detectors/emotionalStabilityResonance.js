/**
 * Harmonic Detector 7 - Emotional Stability Resonance
 *
 * Pattern: Partners share compatible emotional baselines
 *          → mutual grounding → stable relational atmosphere
 *
 * This is the Luna mirror of the Solar "Emotional Stability Baseline Divergence."
 *
 * This detector identifies when two people have compatible default emotional states:
 * - Similar calmness levels
 * - Similar emotional reactivity thresholds
 * - Similar baseline optimism or realism
 * - Similar emotional pacing at rest
 * - Similar tolerance for emotional variability
 * - Similar "home frequency" of emotional presence
 *
 * It's the signature of relationships where partners say:
 * "We settle together."
 * "We calm each other."
 * "We don't destabilize each other."
 * "Our emotional baselines match."
 *
 * This is the Luna-axis of emotional grounding -
 * the sense that the relationship has a stable emotional climate.
 *
 * It emerges when:
 * - Both partners return to equilibrium at similar speeds
 * - Both maintain emotional steadiness in compatible ways
 * - Both regulate without creating turbulence for the other
 * - Both feel emotionally predictable in a comforting way
 * - Both experience the relationship as a stabilizing force
 * - Both feel the emotional "weather" of the relationship is gentle and coherent
 *
 * This is the architecture of shared emotional grounding.
 */

export function detectEmotionalStabilityResonance(profileA, profileB) {
  // Stability traits: high Stabilizer, high OrderOriented
  const stabilityAxes = ["Stabilizer", "OrderOriented"];

  // Calm baseline traits: high MindCentered, high BoundaryAware
  const calmAxes = ["MindCentered", "BoundaryAware"];

  // Warm stability traits: high Warm, high Sustainer
  const warmAxes = ["Warm", "Sustainer"];

  // Depth stability traits: high DepthOriented, high Transpersonal
  const depthAxes = ["DepthOriented", "Transpersonal"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_stab = avg(profileA, stabilityAxes);
  const B_stab = avg(profileB, stabilityAxes);

  const A_calm = avg(profileA, calmAxes);
  const B_calm = avg(profileB, calmAxes);

  const A_warm = avg(profileA, warmAxes);
  const B_warm = avg(profileB, warmAxes);

  const A_depth = avg(profileA, depthAxes);
  const B_depth = avg(profileB, depthAxes);

  // Harmony patterns: partners share similar stability baselines
  const stabilityHarmony = A_stab >= 0.55 && B_stab >= 0.55;
  const calmHarmony = A_calm >= 0.55 && B_calm >= 0.55;
  const warmHarmony = A_warm >= 0.55 && B_warm >= 0.55;
  const depthHarmony = A_depth >= 0.55 && B_depth >= 0.55;

  const harmonyCount =
    [stabilityHarmony, calmHarmony, warmHarmony, depthHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.14,
      harmonyBoost: 0.30,
      flag: "emotional-stability-resonance",
      details: "Emotional Stability Resonance: Shared Emotional Baseline and Grounding - Partners settle into the same emotional ground"
    };
  }

  return { triggered: false };
}
