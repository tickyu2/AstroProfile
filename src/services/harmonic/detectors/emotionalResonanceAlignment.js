/**
 * Harmonic Detector 1 - Emotional Resonance Alignment
 *
 * Pattern: Partners naturally resonate at compatible emotional frequencies
 *          → effortless attunement → relational harmony
 *
 * This is the Luna mirror of the Solar "Emotional Attunement Resolution Gap"
 * and "Signal-to-Noise Divergence."
 *
 * Where the collapse detectors diagnose mismatch,
 * the harmonic detectors diagnose coherence.
 *
 * Emotional Resonance Alignment emerges when:
 * - Partners intuitively "feel each other"
 * - Emotional cues are picked up without effort
 * - Emotional timing feels synchronized
 * - Emotional presence feels mutually regulating
 * - Emotional meaning is shared without translation
 * - Emotional rhythms fall into natural harmony
 *
 * This is the signature of relationships that feel:
 * easy, warm, connected, alive, safe, mutually regulating
 *
 * It's the felt sense of being on the same wavelength.
 */

export function detectEmotionalResonanceAlignment(profileA, profileB) {
  // High-resonance traits: high Warm, high Relational, high Expressive, high DepthOriented
  const resonanceAxes = ["Warm", "Relational", "Expressive", "DepthOriented"];

  // Signal clarity traits: high FluidIdentity, high Transpersonal
  const clarityAxes = ["FluidIdentity", "Transpersonal"];

  // Emotional synchrony traits: high Initiator, high Sustainer
  const synchronyAxes = ["Initiator", "Sustainer"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_res = avg(profileA, resonanceAxes);
  const B_res = avg(profileB, resonanceAxes);

  const A_clarity = avg(profileA, clarityAxes);
  const B_clarity = avg(profileB, clarityAxes);

  const A_sync = avg(profileA, synchronyAxes);
  const B_sync = avg(profileB, synchronyAxes);

  // Alignment triggers when both partners score high on resonance, clarity, and synchrony
  const resonanceAlignment = A_res >= 0.60 && B_res >= 0.60;
  const clarityAlignment = A_clarity >= 0.55 && B_clarity >= 0.55;
  const synchronyAlignment = A_sync >= 0.55 && B_sync >= 0.55;

  const alignmentCount =
    [resonanceAlignment, clarityAlignment, synchronyAlignment].filter(Boolean).length;

  if (alignmentCount >= 2) {
    return {
      triggered: true,
      bonus: 0.10,
      harmonyBoost: 0.20,
      flag: "emotional-resonance-alignment",
      details: "Emotional Resonance Alignment: Natural Emotional Wavelength Match - Partners intuitively feel each other without effort"
    };
  }

  return { triggered: false };
}
