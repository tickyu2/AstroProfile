/**
 * Harmonic Detector 15 - Emotional Context-Switching Flow
 *
 * Pattern: Partners transition between emotional contexts with compatible ease
 *          → smooth emotional movement → adaptive relational flow
 *
 * This is the Luna mirror of the Solar "Context-Switching Friction."
 *
 * This detector identifies when two people:
 * - Shift between emotional states at similar speeds
 * - Transition between topics, moods, or relational modes fluidly
 * - Adapt to emotional changes without destabilizing each other
 * - Move between depth and lightness with shared timing
 * - Handle emotional pivots with mutual grace
 * - Maintain connection even as the emotional environment shifts
 *
 * It's the signature of relationships where partners say:
 * "We can shift gears together."
 * "We move between emotions smoothly."
 * "We adapt to each other easily."
 * "Transitions feel natural, not jarring."
 *
 * This is the Luna-axis of emotional agility -
 * the sense that emotional movement is shared rather than mismatched.
 *
 * It emerges when:
 * - Both partners have compatible emotional flexibility
 * - Both adjust to emotional changes with similar responsiveness
 * - Both can pivot without losing connection
 * - Both maintain emotional coherence across transitions
 * - Both feel emotionally "in motion" together
 * - Both experience emotional shifts as fluid rather than chaotic
 *
 * This is the architecture of shared emotional adaptability.
 */

export function detectEmotionalContextSwitchingFlow(profileA, profileB) {
  // Flexibility traits: high FluidIdentity, high Expressive
  const flexibilityAxes = ["FluidIdentity", "Expressive"];

  // Transition stability traits: high Sustainer, high Stabilizer
  const stabilityAxes = ["Sustainer", "Stabilizer"];

  // Adaptive pacing traits: high Initiator, high Relational
  const pacingAxes = ["Initiator", "Relational"];

  // Emotional modulation traits: high Warm, high DepthOriented
  const modulationAxes = ["Warm", "DepthOriented"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_flex = avg(profileA, flexibilityAxes);
  const B_flex = avg(profileB, flexibilityAxes);

  const A_stab = avg(profileA, stabilityAxes);
  const B_stab = avg(profileB, stabilityAxes);

  const A_pace = avg(profileA, pacingAxes);
  const B_pace = avg(profileB, pacingAxes);

  const A_mod = avg(profileA, modulationAxes);
  const B_mod = avg(profileB, modulationAxes);

  // Harmony patterns: partners share compatible flexibility, stability, pacing, and modulation
  const flexibilityHarmony = A_flex >= 0.55 && B_flex >= 0.55;
  const stabilityHarmony = A_stab >= 0.55 && B_stab >= 0.55;
  const pacingHarmony = A_pace >= 0.55 && B_pace >= 0.55;
  const modulationHarmony = A_mod >= 0.55 && B_mod >= 0.55;

  const harmonyCount =
    [flexibilityHarmony, stabilityHarmony, pacingHarmony, modulationHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.18,
      harmonyBoost: 0.36,
      flag: "emotional-context-switching-flow",
      details: "Emotional Context-Switching Flow: Shared Emotional Adaptability and Transition Ease - Partners shift contexts fluidly together"
    };
  }

  return { triggered: false };
}
