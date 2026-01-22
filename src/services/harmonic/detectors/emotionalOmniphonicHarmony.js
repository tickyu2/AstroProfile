/**
 * Harmonic Detector 50 - Emotional Omniphonic Harmony
 *
 * Pattern: Partners achieve full-spectrum emotional resonance
 *          → total coherence across all dimensions → complete relational symphony
 *
 * This is the Luna capstone - the ultimate harmonic detector.
 *
 * This detector identifies when two people:
 * - Resonate across ALL emotional dimensions simultaneously
 * - Experience total coherence: safety, rhythm, meaning, repair, trust, intimacy, purpose
 * - Maintain alignment through every emotional frequency
 * - Navigate life's full spectrum of challenges with unified response
 * - Avoid partial harmonics (where some dimensions align but others fracture)
 * - Experience the relationship as a complete, living symphony
 *
 * It's the signature of relationships where partners say:
 * "We're in tune on every level."
 * "Our connection is complete."
 * "Nothing is out of sync between us."
 * "We resonate as one."
 *
 * This is the Luna-axis apex -
 * the sense that two emotional systems have achieved full integration.
 *
 * It emerges when:
 * - Both partners have exceptional capacity for resonance
 * - Both experience coherence across multiple dimensions
 * - Both maintain stability through all emotional frequencies
 * - Both adapt with unified flexibility
 * - Both feel the relationship as a complete harmonic field
 * - Both experience omniphonic unity - every instrument, every motif aligned
 *
 * This is the emotional equivalent of two entire symphonies merging -
 * not blending into noise, but forming a single, omniphonic composition
 * where every instrument, every motif, every rhythm aligns.
 *
 * NOTE: This detector uses HIGHER thresholds (0.60) and requires
 * MORE matches (3+) than standard detectors, reflecting its apex status.
 */

export function detectEmotionalOmniphonicHarmony(profileA, profileB) {
  // Full-spectrum resonance traits: high Transpersonal, high DepthOriented
  const resonanceAxes = ["Transpersonal", "DepthOriented"];

  // Multi-dimensional coherence traits: high Relational, high Expressive
  const coherenceAxes = ["Relational", "Expressive"];

  // Omniphonic stability traits: high Stabilizer, high Sustainer
  const stabilityAxes = ["Stabilizer", "Sustainer"];

  // Omniphonic adaptability traits: high FluidIdentity, high MindCentered
  const adaptabilityAxes = ["FluidIdentity", "MindCentered"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_res = avg(profileA, resonanceAxes);
  const B_res = avg(profileB, resonanceAxes);

  const A_coh = avg(profileA, coherenceAxes);
  const B_coh = avg(profileB, coherenceAxes);

  const A_stab = avg(profileA, stabilityAxes);
  const B_stab = avg(profileB, stabilityAxes);

  const A_adapt = avg(profileA, adaptabilityAxes);
  const B_adapt = avg(profileB, adaptabilityAxes);

  // HIGHER THRESHOLDS (0.60) for apex detector
  const resonanceHarmony = A_res >= 0.60 && B_res >= 0.60;
  const coherenceHarmony = A_coh >= 0.60 && B_coh >= 0.60;
  const stabilityHarmony = A_stab >= 0.60 && B_stab >= 0.60;
  const adaptabilityHarmony = A_adapt >= 0.60 && B_adapt >= 0.60;

  const harmonyCount =
    [resonanceHarmony, coherenceHarmony, stabilityHarmony, adaptabilityHarmony]
      .filter(Boolean).length;

  // REQUIRES 3+ MATCHES (not 2+) for apex detector
  if (harmonyCount >= 3) {
    return {
      triggered: true,
      bonus: 0.40,
      harmonyBoost: 0.85,
      flag: "emotional-omniphonic-harmony",
      details: "Emotional Omniphonic Harmony: Full-Spectrum Resonance Across All Dimensions - Partners form a complete, living symphony"
    };
  }

  return { triggered: false };
}
