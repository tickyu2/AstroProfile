/**
 * Detector #50: Emotional Modulation Latency Gap
 *
 * Pattern: Partners modulate emotional states at different speeds
 * → timing mismatch → relational instability
 *
 * This is the latency collapse - the time it takes for the emotional system to respond and settle.
 *
 * Emerges when:
 * - One partner calms down quickly, the other slowly
 * - One escalates emotionally instantly, the other ramps up gradually
 * - One shifts emotional tone within seconds, the other needs minutes or hours
 * - One resets rapidly after conflict, the other needs decompression time
 */

export function detectEmotionalModulationLatencyGap(profileA, profileB) {
  // Fast modulation traits: high FluidIdentity, high Expressive, high Initiator
  const fastAxes = ["FluidIdentity", "Expressive", "Initiator"];

  // Slow modulation traits: high Stabilizer, high OrderOriented, high DepthOriented
  const slowAxes = ["Stabilizer", "OrderOriented", "DepthOriented"];

  // Latency amplifiers: high MindCentered (delayed emotional access), high Warm (rapid emotional access)
  const latencyAxes = ["MindCentered", "Warm"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_fast = avg(profileA, fastAxes);
  const B_fast = avg(profileB, fastAxes);

  const A_slow = avg(profileA, slowAxes);
  const B_slow = avg(profileB, slowAxes);

  const A_lat = avg(profileA, latencyAxes);
  const B_lat = avg(profileB, latencyAxes);

  // Divergence triggers when one partner modulates quickly and the other slowly
  const A_fast_B_slow = A_fast >= 0.65 && B_slow >= 0.65;
  const B_fast_A_slow = B_fast >= 0.65 && A_slow >= 0.65;

  // Latency traits amplify mismatch
  const latencyAmplifier = (A_lat + B_lat) / 2 >= 0.55;

  if ((A_fast_B_slow || B_fast_A_slow) && latencyAmplifier) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.12,
      gradeCap: "C",
      harmonyCap: 0.35,
      flag: "Emotional Modulation Latency Gap",
      details: {
        pattern: "Fast vs Slow Emotional Response Timing",
        A_fastModulation: A_fast.toFixed(2),
        B_fastModulation: B_fast.toFixed(2),
        A_slowModulation: A_slow.toFixed(2),
        B_slowModulation: B_slow.toFixed(2),
        latencyAmplifier
      }
    };
  }

  return { triggered: false };
}
