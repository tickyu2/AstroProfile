/**
 * Detector #24: Trust Formation Mismatch
 *
 * Pattern: Partners build trust through incompatible mechanisms or timelines
 * → chronic insecurity → relational instability
 *
 * This is the foundation collapse - the load-bearing beam of every relational structure.
 *
 * Emerges when:
 * - One partner forms trust quickly, the other slowly
 * - One needs emotional intimacy to trust, the other needs consistency
 * - One trusts through vulnerability, the other through predictability
 * - One trusts through shared depth, the other through shared action
 */

export function detectTrustFormationMismatch(profileA, profileB) {
  // Fast trust traits: high Warm, high Relational, high Expressive, high FluidIdentity
  const fastTrustAxes = ["Warm", "Relational", "Expressive", "FluidIdentity"];

  // Slow trust traits: high BoundaryAware, high Stabilizer, high OrderOriented, high MindCentered
  const slowTrustAxes = ["BoundaryAware", "Stabilizer", "OrderOriented", "MindCentered"];

  // Emotional trust traits: high DepthOriented, high Transpersonal
  const emotionalTrustAxes = ["DepthOriented", "Transpersonal"];

  // Practical trust traits: high Initiator, high Sustainer
  const practicalTrustAxes = ["Initiator", "Sustainer"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  // Compute trust formation clusters
  const A_fast = avg(profileA, fastTrustAxes);
  const B_fast = avg(profileB, fastTrustAxes);

  const A_slow = avg(profileA, slowTrustAxes);
  const B_slow = avg(profileB, slowTrustAxes);

  const A_emotional = avg(profileA, emotionalTrustAxes);
  const B_emotional = avg(profileB, emotionalTrustAxes);

  const A_practical = avg(profileA, practicalTrustAxes);
  const B_practical = avg(profileB, practicalTrustAxes);

  // Divergence triggers when partners sit on opposite ends of trust formation axes
  const fastVsSlow =
    (A_fast >= 0.65 && B_slow >= 0.65) ||
    (B_fast >= 0.65 && A_slow >= 0.65);

  const emotionalVsPractical =
    (A_emotional >= 0.65 && B_practical >= 0.65) ||
    (B_emotional >= 0.65 && A_practical >= 0.65);

  const divergenceCount = [fastVsSlow, emotionalVsPractical].filter(Boolean).length;

  if (divergenceCount >= 2) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.12,
      gradeCap: "C-",
      harmonyCap: 0.35,
      flag: "Trust Formation Mismatch",
      details: {
        pattern: "Incompatible Trust Pathways",
        A_fastTrust: A_fast.toFixed(2),
        B_fastTrust: B_fast.toFixed(2),
        A_slowTrust: A_slow.toFixed(2),
        B_slowTrust: B_slow.toFixed(2),
        fastVsSlow,
        emotionalVsPractical
      }
    };
  }

  return { triggered: false };
}
