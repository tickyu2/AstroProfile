/**
 * Detector #49: Emotional Signal-to-Noise Ratio Divergence
 *
 * Pattern: Partners perceive emotional signals with different clarity
 * → misreading, overwhelm → relational instability
 *
 * This is the signal-to-noise collapse - the clarity of emotional perception.
 *
 * Emerges when:
 * - One partner perceives emotional cues as clear, the other as ambiguous
 * - One detects emotional meaning easily, the other struggles to extract signal from noise
 * - One interprets tone, timing, micro-expressions as meaningful
 * - The other perceives these as background noise
 */

export function detectEmotionalSignalToNoiseRatioDivergence(profileA, profileB) {
  // High-signal traits: high DepthOriented, high Relational, high Expressive
  const signalAxes = ["DepthOriented", "Relational", "Expressive"];

  // High-noise traits: high MindCentered, high Stabilizer, low Expressive
  const noiseAxes = ["MindCentered", "Stabilizer"];
  const lowExpressiveAxes = ["Expressive"];

  // Sensory amplification traits: high FluidIdentity, high Warm
  const amplificationAxes = ["FluidIdentity", "Warm"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_signal = avg(profileA, signalAxes);
  const B_signal = avg(profileB, signalAxes);

  const A_noise = (avg(profileA, noiseAxes) + (1 - avg(profileA, lowExpressiveAxes))) / 2;
  const B_noise = (avg(profileB, noiseAxes) + (1 - avg(profileB, lowExpressiveAxes))) / 2;

  const A_amp = avg(profileA, amplificationAxes);
  const B_amp = avg(profileB, amplificationAxes);

  // Divergence triggers when one partner perceives high signal and the other high noise
  const A_signal_B_noise = A_signal >= 0.65 && B_noise >= 0.65;
  const B_signal_A_noise = B_signal >= 0.65 && A_noise >= 0.65;

  // Amplification increases the perceptual gap
  const amplificationAmplifier = (A_amp + B_amp) / 2 >= 0.55;

  if ((A_signal_B_noise || B_signal_A_noise) && amplificationAmplifier) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.12,
      gradeCap: "C",
      harmonyCap: 0.35,
      flag: "Emotional Signal-to-Noise Ratio Divergence",
      details: {
        pattern: "High-Signal vs High-Noise Perception",
        A_signal: A_signal.toFixed(2),
        B_signal: B_signal.toFixed(2),
        A_noise: A_noise.toFixed(2),
        B_noise: B_noise.toFixed(2),
        amplificationAmplifier
      }
    };
  }

  return { triggered: false };
}
