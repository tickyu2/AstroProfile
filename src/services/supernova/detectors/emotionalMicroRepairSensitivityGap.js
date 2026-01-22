/**
 * Detector #44: Emotional Micro-Repair Sensitivity Gap
 *
 * Pattern: Partners differ in sensitivity to micro-ruptures
 * → missed micro-repairs → relational instability
 *
 * This is the micro-repair collapse - the ability to detect tiny relational ruptures.
 *
 * Emerges when:
 * - One partner detects tiny shifts in tone, timing, or expression
 * - The other detects only clear, explicit ruptures
 * - One feels "offness" immediately, the other feels it only when it becomes obvious
 * - One initiates micro-repairs frequently, the other sees no need
 */

export function detectEmotionalMicroRepairSensitivityGap(profileA, profileB) {
  // Micro-sensitive traits: high Warm, high Relational, high DepthOriented, high Expressive
  const microAxes = ["Warm", "Relational", "DepthOriented", "Expressive"];

  // Macro-sensitive traits: high Stabilizer, high OrderOriented, high MindCentered, low Expressive
  const macroAxes = ["Stabilizer", "OrderOriented", "MindCentered"];
  const lowExpressiveAxes = ["Expressive"];

  // Micro-repair urgency traits: high FluidIdentity, high Initiator
  const urgencyAxes = ["FluidIdentity", "Initiator"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_micro = avg(profileA, microAxes);
  const B_micro = avg(profileB, microAxes);

  const A_macro = (avg(profileA, macroAxes) + (1 - avg(profileA, lowExpressiveAxes))) / 2;
  const B_macro = (avg(profileB, macroAxes) + (1 - avg(profileB, lowExpressiveAxes))) / 2;

  const A_urg = avg(profileA, urgencyAxes);
  const B_urg = avg(profileB, urgencyAxes);

  // Divergence triggers when one partner is micro-sensitive and the other macro-sensitive
  const A_micro_B_macro = A_micro >= 0.65 && B_macro >= 0.65;
  const B_micro_A_macro = B_micro >= 0.65 && A_macro >= 0.65;

  // Urgency amplifies mismatch
  const urgencyAmplifier = (A_urg + B_urg) / 2 >= 0.55;

  if ((A_micro_B_macro || B_micro_A_macro) && urgencyAmplifier) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.12,
      gradeCap: "C",
      harmonyCap: 0.35,
      flag: "Emotional Micro-Repair Sensitivity Gap",
      details: {
        pattern: "Micro vs Macro Rupture Detection",
        A_microSensitive: A_micro.toFixed(2),
        B_microSensitive: B_micro.toFixed(2),
        A_macroSensitive: A_macro.toFixed(2),
        B_macroSensitive: B_macro.toFixed(2),
        urgencyAmplifier
      }
    };
  }

  return { triggered: false };
}
