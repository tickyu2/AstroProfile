/**
 * Detector #48: Emotional Context-Switching Friction
 *
 * Pattern: Partners switch emotional contexts at different speeds and costs
 * → lag, misalignment → relational instability
 *
 * This is the context-switch collapse - the emotional equivalent of cognitive switching cost.
 *
 * Emerges when:
 * - One partner can shift from conflict → affection quickly, the other needs time
 * - One can move from emotional depth → logistical planning instantly, the other cannot
 * - One transitions smoothly between emotional modes, the other experiences switching "costs"
 * - One can re-enter connection after rupture easily, the other needs decompression
 */

export function detectEmotionalContextSwitchingFriction(profileA, profileB) {
  // Fast-switch traits: high FluidIdentity, high Initiator, high Expressive
  const fastAxes = ["FluidIdentity", "Initiator", "Expressive"];

  // Slow-switch traits: high Stabilizer, high OrderOriented, high BoundaryAware
  const slowAxes = ["Stabilizer", "OrderOriented", "BoundaryAware"];

  // Mode rigidity traits: high MindCentered (task lock), high DepthOriented (emotional lock)
  const rigidityAxes = ["MindCentered", "DepthOriented"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_fast = avg(profileA, fastAxes);
  const B_fast = avg(profileB, fastAxes);

  const A_slow = avg(profileA, slowAxes);
  const B_slow = avg(profileB, slowAxes);

  const A_rigid = avg(profileA, rigidityAxes);
  const B_rigid = avg(profileB, rigidityAxes);

  // Divergence triggers when one partner is fast-switching and the other slow-switching
  const A_fast_B_slow = A_fast >= 0.65 && B_slow >= 0.65;
  const B_fast_A_slow = B_fast >= 0.65 && A_slow >= 0.65;

  // Rigidity amplifies mismatch
  const rigidityAmplifier = (A_rigid + B_rigid) / 2 >= 0.55;

  if ((A_fast_B_slow || B_fast_A_slow) && rigidityAmplifier) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.12,
      gradeCap: "C",
      harmonyCap: 0.35,
      flag: "Emotional Context-Switching Friction",
      details: {
        pattern: "Fast vs Slow Emotional Mode Transitions",
        A_fastSwitch: A_fast.toFixed(2),
        B_fastSwitch: B_fast.toFixed(2),
        A_slowSwitch: A_slow.toFixed(2),
        B_slowSwitch: B_slow.toFixed(2),
        rigidityAmplifier
      }
    };
  }

  return { triggered: false };
}
