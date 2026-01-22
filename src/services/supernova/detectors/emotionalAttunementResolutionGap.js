/**
 * Detector #41: Emotional Attunement Resolution Gap
 *
 * Pattern: Partners attune at different levels of emotional precision
 * → micro-misattunements → relational instability
 *
 * This is the resolution collapse - the precision with which each partner reads emotional cues.
 *
 * Emerges when:
 * - One partner notices micro-shifts, the other notices only macro-shifts
 * - One tracks emotional nuance, the other tracks emotional categories
 * - One responds to subtle cues, the other responds only to explicit signals
 * - One reads emotional texture, the other reads emotional headlines
 */

export function detectEmotionalAttunementResolutionGap(profileA, profileB) {
  // High-resolution attunement traits: high Warm, high Relational, high DepthOriented, high Expressive
  const highResAxes = ["Warm", "Relational", "DepthOriented", "Expressive"];

  // Low-resolution attunement traits: high Stabilizer, high OrderOriented, high MindCentered, low Expressive
  const lowResAxes = ["Stabilizer", "OrderOriented", "MindCentered"];
  const lowExpressiveAxes = ["Expressive"];

  // Attunement adaptability traits: high FluidIdentity, high Initiator
  const adaptiveAxes = ["FluidIdentity", "Initiator"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_high = avg(profileA, highResAxes);
  const B_high = avg(profileB, highResAxes);

  const A_low = (avg(profileA, lowResAxes) + (1 - avg(profileA, lowExpressiveAxes))) / 2;
  const B_low = (avg(profileB, lowResAxes) + (1 - avg(profileB, lowExpressiveAxes))) / 2;

  const A_adapt = avg(profileA, adaptiveAxes);
  const B_adapt = avg(profileB, adaptiveAxes);

  // Divergence triggers when one partner attunes in high resolution and the other in low resolution
  const A_high_B_low = A_high >= 0.65 && B_low >= 0.65;
  const B_high_A_low = B_high >= 0.65 && A_low >= 0.65;

  // Adaptability amplifies mismatch
  const adaptabilityAmplifier = (A_adapt + B_adapt) / 2 >= 0.55;

  if ((A_high_B_low || B_high_A_low) && adaptabilityAmplifier) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.12,
      gradeCap: "C",
      harmonyCap: 0.35,
      flag: "Emotional Attunement Resolution Gap",
      details: {
        pattern: "High-Res vs Low-Res Attunement",
        A_highRes: A_high.toFixed(2),
        B_highRes: B_high.toFixed(2),
        A_lowRes: A_low.toFixed(2),
        B_lowRes: B_low.toFixed(2),
        adaptabilityAmplifier
      }
    };
  }

  return { triggered: false };
}
