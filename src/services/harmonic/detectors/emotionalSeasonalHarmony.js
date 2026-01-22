/**
 * Harmonic Detector 46 - Emotional Seasonal Harmony
 *
 * Pattern: Partners move through emotional seasons in compatible rhythms
 *          → long-cycle stability → deep relational resilience
 *
 * This is the Luna mirror of the Solar "Seasonal Emotional Drift."
 *
 * This detector identifies when two people:
 * - Experience emotional cycles (growth, rest, intensity, reflection) at compatible tempos
 * - Understand each other's seasonal shifts without fear or confusion
 * - Maintain connection even when emotional climates change
 * - Adapt to each other's long-arc emotional rhythms
 * - Avoid seasonal mismatches ("I'm in expansion" vs. "I'm in retreat")
 * - Feel like their emotional climates interlock naturally
 *
 * It's the signature of relationships where partners say:
 * "We go through seasons together."
 * "Your emotional cycles make sense to me."
 * "We don't fall out of sync when life shifts."
 * "Our long-term rhythms feel aligned."
 *
 * This is the Luna-axis of emotional climatology -
 * the sense that two emotional ecosystems can coexist and flourish across time.
 *
 * It emerges when:
 * - Both partners have compatible cycles of emotional energy
 * - Both understand and respect each other's seasonal needs
 * - Both maintain connection through transitions
 * - Both adapt to long-term emotional shifts with grace
 * - Both avoid seasonal dissonance or misinterpretation
 * - Both experience the relationship as a stable, evolving climate
 *
 * This is the architecture of long-cycle emotional coherence.
 */

export function detectEmotionalSeasonalHarmony(profileA, profileB) {
  // Seasonal rhythm traits: high Stabilizer, high FluidIdentity
  const rhythmAxes = ["Stabilizer", "FluidIdentity"];

  // Seasonal awareness traits: high MindCentered, high DepthOriented
  const awarenessAxes = ["MindCentered", "DepthOriented"];

  // Seasonal adaptability traits: high Relational, high BoundaryAware
  const adaptabilityAxes = ["Relational", "BoundaryAware"];

  // Seasonal continuity traits: high Sustainer, high Warm
  const continuityAxes = ["Sustainer", "Warm"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_rhy = avg(profileA, rhythmAxes);
  const B_rhy = avg(profileB, rhythmAxes);

  const A_aw = avg(profileA, awarenessAxes);
  const B_aw = avg(profileB, awarenessAxes);

  const A_adapt = avg(profileA, adaptabilityAxes);
  const B_adapt = avg(profileB, adaptabilityAxes);

  const A_cont = avg(profileA, continuityAxes);
  const B_cont = avg(profileB, continuityAxes);

  // Harmony patterns: partners share compatible rhythm, awareness, adaptability, and continuity
  const rhythmHarmony = A_rhy >= 0.55 && B_rhy >= 0.55;
  const awarenessHarmony = A_aw >= 0.55 && B_aw >= 0.55;
  const adaptabilityHarmony = A_adapt >= 0.55 && B_adapt >= 0.55;
  const continuityHarmony = A_cont >= 0.55 && B_cont >= 0.55;

  const harmonyCount =
    [rhythmHarmony, awarenessHarmony, adaptabilityHarmony, continuityHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.34,
      harmonyBoost: 0.74,
      flag: "emotional-seasonal-harmony",
      details: "Emotional Seasonal Harmony: Aligned Emotional Cycles and Long-Term Rhythmic Coherence - Partners move through seasons together"
    };
  }

  return { triggered: false };
}
