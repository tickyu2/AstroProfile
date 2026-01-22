/**
 * Detector #43: Emotional Repair Threshold Mismatch
 *
 * Pattern: Partners have different thresholds for when emotional repair is needed
 * → misaligned urgency → relational instability
 *
 * This is the threshold collapse - the internal trigger point for when repair becomes necessary.
 *
 * Emerges when:
 * - One partner feels rupture early, the other feels rupture only at high intensity
 * - One initiates repair at the first sign of tension, the other waits until tension peaks
 * - One perceives micro-ruptures, the other perceives only macro-ruptures
 * - One thinks "this needs fixing," the other thinks "this will pass"
 */

export function detectEmotionalRepairThresholdMismatch(profileA, profileB) {
  // Low repair threshold traits: high Warm, high Relational, high Expressive, high DepthOriented
  const lowThreshAxes = ["Warm", "Relational", "Expressive", "DepthOriented"];

  // High repair threshold traits: high Stabilizer, high OrderOriented, high MindCentered, low Expressive
  const highThreshAxes = ["Stabilizer", "OrderOriented", "MindCentered"];
  const lowExpressiveAxes = ["Expressive"];

  // Repair urgency traits: high FluidIdentity, high Initiator
  const urgencyAxes = ["FluidIdentity", "Initiator"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_low = avg(profileA, lowThreshAxes);
  const B_low = avg(profileB, lowThreshAxes);

  const A_high = (avg(profileA, highThreshAxes) + (1 - avg(profileA, lowExpressiveAxes))) / 2;
  const B_high = (avg(profileB, highThreshAxes) + (1 - avg(profileB, lowExpressiveAxes))) / 2;

  const A_urg = avg(profileA, urgencyAxes);
  const B_urg = avg(profileB, urgencyAxes);

  // Divergence triggers when one partner has a low repair threshold and the other a high repair threshold
  const A_low_B_high = A_low >= 0.65 && B_high >= 0.65;
  const B_low_A_high = B_low >= 0.65 && A_high >= 0.65;

  // Urgency amplifies mismatch
  const urgencyAmplifier = (A_urg + B_urg) / 2 >= 0.55;

  if ((A_low_B_high || B_low_A_high) && urgencyAmplifier) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.12,
      gradeCap: "C",
      harmonyCap: 0.35,
      flag: "Emotional Repair Threshold Mismatch",
      details: {
        pattern: "Low-Threshold vs High-Threshold Repair",
        A_lowThreshold: A_low.toFixed(2),
        B_lowThreshold: B_low.toFixed(2),
        A_highThreshold: A_high.toFixed(2),
        B_highThreshold: B_high.toFixed(2),
        urgencyAmplifier
      }
    };
  }

  return { triggered: false };
}
