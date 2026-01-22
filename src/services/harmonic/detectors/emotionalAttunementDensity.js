/**
 * Harmonic Detector 32 - Emotional Attunement Density
 *
 * Pattern: Partners maintain a rich, continuous field of emotional awareness
 *          → deep mutual sensing → stable, immersive connection
 *
 * This is the Luna mirror of the Solar "Attunement Saturation Gap."
 *
 * This detector identifies when two people:
 * - Stay emotionally aware of each other even between interactions
 * - Maintain a "felt sense" of the other's emotional state
 * - Track each other's subtle shifts without effort
 * - Hold each other in mind with warmth rather than vigilance
 * - Sustain a dense, continuous emotional presence
 * - Feel emotionally "in tune" even at a distance
 *
 * It's the signature of relationships where partners say:
 * "I can feel you even when we're not talking."
 * "We stay connected between moments."
 * "Your emotional world is familiar to me."
 * "We sense each other deeply and continuously."
 *
 * This is the Luna-axis of emotional field-coherence -
 * the sense that attunement is not episodic but ambient.
 *
 * It emerges when:
 * - Both partners maintain a stable emotional awareness of each other
 * - Both sense emotional shifts quickly and accurately
 * - Both feel "held in mind" without pressure
 * - Both maintain emotional presence across time and space
 * - Both experience attunement as a shared field rather than a task
 * - Both feel deeply known, even in silence
 *
 * This is the architecture of continuous emotional resonance.
 */

export function detectEmotionalAttunementDensity(profileA, profileB) {
  // Ambient awareness traits: high Relational, high DepthOriented
  const awarenessAxes = ["Relational", "DepthOriented"];

  // Subtle-signal sensitivity traits: high Warm, high FluidIdentity
  const sensitivityAxes = ["Warm", "FluidIdentity"];

  // Continuity traits: high Sustainer, high Stabilizer
  const continuityAxes = ["Sustainer", "Stabilizer"];

  // Emotional field coherence traits: high Expressive, high Transpersonal
  const fieldAxes = ["Expressive", "Transpersonal"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_aw = avg(profileA, awarenessAxes);
  const B_aw = avg(profileB, awarenessAxes);

  const A_sens = avg(profileA, sensitivityAxes);
  const B_sens = avg(profileB, sensitivityAxes);

  const A_cont = avg(profileA, continuityAxes);
  const B_cont = avg(profileB, continuityAxes);

  const A_field = avg(profileA, fieldAxes);
  const B_field = avg(profileB, fieldAxes);

  // Harmony patterns: partners share compatible awareness, sensitivity, continuity, and field coherence
  const awarenessHarmony = A_aw >= 0.55 && B_aw >= 0.55;
  const sensitivityHarmony = A_sens >= 0.55 && B_sens >= 0.55;
  const continuityHarmony = A_cont >= 0.55 && B_cont >= 0.55;
  const fieldHarmony = A_field >= 0.55 && B_field >= 0.55;

  const harmonyCount =
    [awarenessHarmony, sensitivityHarmony, continuityHarmony, fieldHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.24,
      harmonyBoost: 0.54,
      flag: "emotional-attunement-density",
      details: "Emotional Attunement Density: Continuous Mutual Awareness and Deep Emotional Field Coherence - Partners sense each other deeply"
    };
  }

  return { triggered: false };
}
