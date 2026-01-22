/**
 * Detector #29: Emotional Momentum Divergence
 *
 * Pattern: Partners generate, sustain, and release emotional energy at different rates
 * → chronic misalignment → relational instability
 *
 * This is the kinetic collapse - the physics of emotional motion.
 *
 * Emerges when:
 * - One partner's emotions build quickly, the other's build slowly
 * - One sustains emotional intensity, the other dissipates it rapidly
 * - One escalates emotional energy, the other stabilizes or neutralizes it
 * - One rides emotional waves, the other steps off the wave early
 */

export function detectEmotionalMomentumDivergence(profileA, profileB) {
  // Momentum-up traits: high Expressive, high Warm, high RiskSeeking, high FluidIdentity
  const momentumUpAxes = ["Expressive", "Warm", "RiskSeeking", "FluidIdentity"];

  // Momentum-down traits: high Stabilizer, high BoundaryAware, high OrderOriented
  const momentumDownAxes = ["Stabilizer", "BoundaryAware", "OrderOriented"];
  const lowExpressiveAxes = ["Expressive"];

  // Emotional carry-through traits: high DepthOriented, high Relational
  const carryAxes = ["DepthOriented", "Relational"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_up = avg(profileA, momentumUpAxes);
  const B_up = avg(profileB, momentumUpAxes);

  const A_down = (avg(profileA, momentumDownAxes) + (1 - avg(profileA, lowExpressiveAxes))) / 2;
  const B_down = (avg(profileB, momentumDownAxes) + (1 - avg(profileB, lowExpressiveAxes))) / 2;

  const A_carry = avg(profileA, carryAxes);
  const B_carry = avg(profileB, carryAxes);

  // Divergence triggers when one accelerates emotional energy and the other decelerates
  const A_up_B_down = A_up >= 0.65 && B_down >= 0.65;
  const B_up_A_down = B_up >= 0.65 && A_down >= 0.65;

  // Emotional carry-through amplifies mismatch
  const carryAmplifier = (A_carry + B_carry) / 2 >= 0.55;

  if ((A_up_B_down || B_up_A_down) && carryAmplifier) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.12,
      gradeCap: "C",
      harmonyCap: 0.35,
      flag: "Emotional Momentum Divergence",
      details: {
        pattern: "Acceleration vs Dissipation",
        A_momentumUp: A_up.toFixed(2),
        B_momentumUp: B_up.toFixed(2),
        A_momentumDown: A_down.toFixed(2),
        B_momentumDown: B_down.toFixed(2),
        carryAmplifier
      }
    };
  }

  return { triggered: false };
}
