/**
 * Harmonic Detector 14 - Emotional Signal Clarity Alignment
 *
 * Pattern: Partners perceive emotional signals with similar clarity
 *          → low distortion → high mutual understanding
 *
 * This is the Luna mirror of the Solar "Signal-to-Noise Ratio Divergence."
 *
 * This detector identifies when two people:
 * - Pick up emotional cues with similar sensitivity
 * - Distinguish emotional "signal" from emotional "noise" in compatible ways
 * - Interpret tone, timing, and micro-expressions with similar clarity
 * - Experience emotional environments as similarly legible
 * - Communicate emotional meaning without distortion
 * - Feel emotionally "transparent" to each other
 *
 * It's the signature of relationships where partners say:
 * "You read me clearly."
 * "I don't have to over-explain."
 * "We don't misinterpret each other."
 * "Our emotional signals land cleanly."
 *
 * This is the Luna-axis of emotional perceptual clarity -
 * the sense that emotional communication is crisp, accurate, and mutually legible.
 *
 * It emerges when:
 * - Both partners have compatible emotional sensitivity
 * - Both filter out emotional noise similarly
 * - Both detect emotional nuance at similar thresholds
 * - Both perceive emotional meaning with similar resolution
 * - Both experience emotional communication as clear rather than confusing
 * - Both feel emotionally "easy to read" to each other
 *
 * This is the architecture of shared emotional perceptual bandwidth.
 */

export function detectEmotionalSignalClarityAlignment(profileA, profileB) {
  // High-signal traits: high DepthOriented, high Relational, high Expressive
  const signalAxes = ["DepthOriented", "Relational", "Expressive"];

  // Low-noise traits: high Warm, high BoundaryAware
  const lowNoiseAxes = ["Warm", "BoundaryAware"];

  // Clarity amplification traits: high FluidIdentity, high Transpersonal
  const clarityAxes = ["FluidIdentity", "Transpersonal"];

  // Interpretive stability traits: high Sustainer, high OrderOriented
  const stabilityAxes = ["Sustainer", "OrderOriented"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_sig = avg(profileA, signalAxes);
  const B_sig = avg(profileB, signalAxes);

  const A_low = avg(profileA, lowNoiseAxes);
  const B_low = avg(profileB, lowNoiseAxes);

  const A_clar = avg(profileA, clarityAxes);
  const B_clar = avg(profileB, clarityAxes);

  const A_stab = avg(profileA, stabilityAxes);
  const B_stab = avg(profileB, stabilityAxes);

  // Harmony patterns: partners share compatible signal clarity, noise filtering, clarity amplification, and interpretive stability
  const signalHarmony = A_sig >= 0.55 && B_sig >= 0.55;
  const lowNoiseHarmony = A_low >= 0.55 && B_low >= 0.55;
  const clarityHarmony = A_clar >= 0.55 && B_clar >= 0.55;
  const stabilityHarmony = A_stab >= 0.55 && B_stab >= 0.55;

  const harmonyCount =
    [signalHarmony, lowNoiseHarmony, clarityHarmony, stabilityHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.16,
      harmonyBoost: 0.34,
      flag: "emotional-signal-clarity-alignment",
      details: "Emotional Signal Clarity Alignment: Shared Emotional Perceptual Resolution - Partners read each other with crystal clarity"
    };
  }

  return { triggered: false };
}
