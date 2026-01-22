/**
 * Detector #34: Emotional Reciprocity Timing Offset
 *
 * Pattern: Partners reciprocate emotional energy at different times
 * → perceived imbalance → relational instability
 *
 * This is the timing collapse - the temporal aspect of emotional return.
 *
 * Emerges when:
 * - One partner gives emotional energy immediately, the other gives it delayed
 * - One expresses appreciation in the moment, the other expresses it later
 * - One responds emotionally in real-time, the other responds after reflection
 * - One initiates vulnerability early, the other reciprocates only after safety builds
 */

export function detectEmotionalReciprocityTimingOffset(profileA, profileB) {
  // Fast reciprocity traits: high Expressive, high Warm, high Relational, high Initiator
  const fastAxes = ["Expressive", "Warm", "Relational", "Initiator"];

  // Slow reciprocity traits: high Stabilizer, high BoundaryAware, high MindCentered, low Expressive
  const slowAxes = ["Stabilizer", "BoundaryAware", "MindCentered"];
  const lowExpressiveAxes = ["Expressive"];

  // Emotional pacing traits: high DepthOriented, high Sustainer
  const pacingAxes = ["DepthOriented", "Sustainer"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_fast = avg(profileA, fastAxes);
  const B_fast = avg(profileB, fastAxes);

  const A_slow = (avg(profileA, slowAxes) + (1 - avg(profileA, lowExpressiveAxes))) / 2;
  const B_slow = (avg(profileB, slowAxes) + (1 - avg(profileB, lowExpressiveAxes))) / 2;

  const A_pace = avg(profileA, pacingAxes);
  const B_pace = avg(profileB, pacingAxes);

  // Divergence triggers when one reciprocates quickly and the other reciprocates slowly
  const A_fast_B_slow = A_fast >= 0.65 && B_slow >= 0.65;
  const B_fast_A_slow = B_fast >= 0.65 && A_slow >= 0.65;

  // Emotional pacing amplifies mismatch
  const pacingAmplifier = (A_pace + B_pace) / 2 >= 0.55;

  if ((A_fast_B_slow || B_fast_A_slow) && pacingAmplifier) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.10,
      gradeCap: "C",
      harmonyCap: 0.40,
      flag: "Emotional Reciprocity Timing Offset",
      details: {
        pattern: "Fast-Return vs Slow-Return",
        A_fastReciprocity: A_fast.toFixed(2),
        B_fastReciprocity: B_fast.toFixed(2),
        A_slowReciprocity: A_slow.toFixed(2),
        B_slowReciprocity: B_slow.toFixed(2),
        pacingAmplifier
      }
    };
  }

  return { triggered: false };
}
