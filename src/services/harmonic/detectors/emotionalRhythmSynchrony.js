/**
 * Harmonic Detector 6 - Emotional Rhythm Synchrony
 *
 * Pattern: Partners shift emotional states in compatible rhythms
 *          → smooth transitions → stable relational flow
 *
 * This is the Luna mirror of the Solar "Modulation Latency Gap"
 * and "Context-Switching Friction."
 *
 * This detector identifies when two people move through emotional modes
 * at similar speeds, with similar timing, and with compatible emotional pacing.
 *
 * It's the signature of relationships where partners say:
 * "We bounce back together."
 * "We shift gears at the same time."
 * "We calm down at the same pace."
 * "We move emotionally in sync."
 *
 * This is the Luna-axis of emotional timing -
 * the sense that emotional transitions feel natural, shared, and mutually regulating.
 *
 * It emerges when:
 * - Both partners escalate and de-escalate at similar speeds
 * - Both transition between emotional contexts with similar ease
 * - Both recover from conflict at compatible rates
 * - Both shift between depth and lightness in a shared rhythm
 * - Both feel the emotional tempo of the relationship is "just right"
 * - Both experience emotional timing as a source of harmony, not friction
 *
 * This is the architecture of shared emotional tempo.
 */

export function detectEmotionalRhythmSynchrony(profileA, profileB) {
  // Fast-rhythm traits: high FluidIdentity, high Expressive, high Initiator
  const fastAxes = ["FluidIdentity", "Expressive", "Initiator"];

  // Slow-rhythm traits: high Stabilizer, high OrderOriented, high DepthOriented
  const slowAxes = ["Stabilizer", "OrderOriented", "DepthOriented"];

  // Synchrony traits: high Warm, high Relational, high Sustainer
  const syncAxes = ["Warm", "Relational", "Sustainer"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_fast = avg(profileA, fastAxes);
  const B_fast = avg(profileB, fastAxes);

  const A_slow = avg(profileA, slowAxes);
  const B_slow = avg(profileB, slowAxes);

  const A_sync = avg(profileA, syncAxes);
  const B_sync = avg(profileB, syncAxes);

  // Harmony patterns: partners share similar emotional tempo (fast-fast or slow-slow)
  const fastHarmony = A_fast >= 0.55 && B_fast >= 0.55;
  const slowHarmony = A_slow >= 0.55 && B_slow >= 0.55;

  // Synchrony amplifies the match
  const synchronyAlignment = A_sync >= 0.55 && B_sync >= 0.55;

  const harmonyCount =
    [fastHarmony, slowHarmony, synchronyAlignment].filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.14,
      harmonyBoost: 0.30,
      flag: "emotional-rhythm-synchrony",
      details: "Emotional Rhythm Synchrony: Shared Emotional Tempo and Timing - Partners move emotionally in sync"
    };
  }

  return { triggered: false };
}
