/**
 * Detector #46: Emotional Narrative Compression Mismatch
 *
 * Pattern: Partners compress emotional narratives at different levels
 * → miscommunication → relational instability
 *
 * This is the compression collapse - how emotional experience is packaged.
 *
 * Emerges when:
 * - One partner summarizes emotional events into essence, the other into sequence
 * - One uses high-compression storytelling, the other uses low-compression
 * - One stores emotional memory as themes, the other as episodes
 * - One communicates in symbolic shorthand, the other in literal detail
 */

export function detectEmotionalNarrativeCompressionMismatch(profileA, profileB) {
  // High-compression traits: high MindCentered, high OrderOriented, high Stabilizer
  const highCompAxes = ["MindCentered", "OrderOriented", "Stabilizer"];

  // Low-compression traits: high Expressive, high Relational, high DepthOriented
  const lowCompAxes = ["Expressive", "Relational", "DepthOriented"];

  // Narrative processing traits: high FluidIdentity (adaptive), high Initiator (sequential)
  const processingAxes = ["FluidIdentity", "Initiator"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_high = avg(profileA, highCompAxes);
  const B_high = avg(profileB, highCompAxes);

  const A_low = avg(profileA, lowCompAxes);
  const B_low = avg(profileB, lowCompAxes);

  const A_proc = avg(profileA, processingAxes);
  const B_proc = avg(profileB, processingAxes);

  // Divergence triggers when one partner compresses heavily and the other minimally
  const A_high_B_low = A_high >= 0.65 && B_low >= 0.65;
  const B_high_A_low = B_high >= 0.65 && A_low >= 0.65;

  // Narrative processing amplifies mismatch
  const processingAmplifier = (A_proc + B_proc) / 2 >= 0.55;

  if ((A_high_B_low || B_high_A_low) && processingAmplifier) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.12,
      gradeCap: "C",
      harmonyCap: 0.35,
      flag: "Emotional Narrative Compression Mismatch",
      details: {
        pattern: "Essence vs Sequence Storying",
        A_highCompression: A_high.toFixed(2),
        B_highCompression: B_high.toFixed(2),
        A_lowCompression: A_low.toFixed(2),
        B_lowCompression: B_low.toFixed(2),
        processingAmplifier
      }
    };
  }

  return { triggered: false };
}
