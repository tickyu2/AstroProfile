/**
 * Detector #27: Emotional Risk Tolerance Gap
 *
 * Pattern: Partners have incompatible thresholds for emotional risk
 * → stalled vulnerability → relational stagnation or collapse
 *
 * This is the risk collapse - how much emotional danger each partner can tolerate.
 *
 * Emerges when:
 * - One partner is willing to take emotional leaps, the other avoids them
 * - One initiates vulnerability, the other stays guarded
 * - One tolerates emotional uncertainty, the other needs emotional safety
 * - One risks emotional exposure, the other risks emotional withdrawal
 */

export function detectEmotionalRiskToleranceGap(profileA, profileB) {
  // High risk tolerance traits: high Expressive, high Initiator, high RiskSeeking, high FluidIdentity
  const highRiskAxes = ["Expressive", "Initiator", "RiskSeeking", "FluidIdentity"];

  // Low risk tolerance traits: high BoundaryAware, high Stabilizer, high OrderOriented
  const lowRiskAxes = ["BoundaryAware", "Stabilizer", "OrderOriented"];
  const lowExpressiveAxes = ["Expressive"];

  // Vulnerability traits: high Warm, high Relational, high DepthOriented
  const vulnerabilityAxes = ["Warm", "Relational", "DepthOriented"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_highRisk = avg(profileA, highRiskAxes);
  const B_highRisk = avg(profileB, highRiskAxes);

  const A_lowRisk = (avg(profileA, lowRiskAxes) + (1 - avg(profileA, lowExpressiveAxes))) / 2;
  const B_lowRisk = (avg(profileB, lowRiskAxes) + (1 - avg(profileB, lowExpressiveAxes))) / 2;

  const A_vuln = avg(profileA, vulnerabilityAxes);
  const B_vuln = avg(profileB, vulnerabilityAxes);

  // Divergence triggers when one partner is high-risk and the other is low-risk
  const A_risk_B_safe = A_highRisk >= 0.65 && B_lowRisk >= 0.65;
  const B_risk_A_safe = B_highRisk >= 0.65 && A_lowRisk >= 0.65;

  // Vulnerability amplifies the mismatch
  const vulnerabilityAmplifier = (A_vuln + B_vuln) / 2 >= 0.55;

  if ((A_risk_B_safe || B_risk_A_safe) && vulnerabilityAmplifier) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.12,
      gradeCap: "C",
      harmonyCap: 0.35,
      flag: "Emotional Risk Tolerance Gap",
      details: {
        pattern: "Risk-Taker vs Risk-Averse",
        A_highRisk: A_highRisk.toFixed(2),
        B_highRisk: B_highRisk.toFixed(2),
        A_lowRisk: A_lowRisk.toFixed(2),
        B_lowRisk: B_lowRisk.toFixed(2),
        vulnerabilityAmplifier
      }
    };
  }

  return { triggered: false };
}
