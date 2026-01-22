/**
 * Detector #33: Emotional Feedback Loop Inversion
 *
 * Pattern: Emotional signals produce opposite emotional responses
 * → recursive misattunement → relational instability
 *
 * This is the inversion collapse - how emotional signals change the partner's state.
 *
 * Emerges when:
 * - Reassurance increases anxiety
 * - Vulnerability triggers withdrawal
 * - Affection triggers overwhelm
 * - Space triggers abandonment fear
 * - Directness triggers defensiveness
 * - Intensity triggers shutdown
 */

export function detectEmotionalFeedbackLoopInversion(profileA, profileB) {
  // Reassurance sensitivity: high FluidIdentity, high Warm, high Relational
  const reassuranceAxes = ["FluidIdentity", "Warm", "Relational"];

  // Autonomy sensitivity: high BoundaryAware, high Initiator, high MindCentered
  const autonomyAxes = ["BoundaryAware", "Initiator", "MindCentered"];

  // Vulnerability response: high DepthOriented, high Transpersonal
  const vulnAxes = ["DepthOriented", "Transpersonal"];

  // Withdrawal response: high Stabilizer, low Expressive
  const withdrawalAxes = ["Stabilizer"];
  const lowExpressiveAxes = ["Expressive"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  // Compute response clusters
  const A_reassure = avg(profileA, reassuranceAxes);
  const B_reassure = avg(profileB, reassuranceAxes);

  const A_auto = avg(profileA, autonomyAxes);
  const B_auto = avg(profileB, autonomyAxes);

  const A_vuln = avg(profileA, vulnAxes);
  const B_vuln = avg(profileB, vulnAxes);

  const A_withdraw = (avg(profileA, withdrawalAxes) + (1 - avg(profileA, lowExpressiveAxes))) / 2;
  const B_withdraw = (avg(profileB, withdrawalAxes) + (1 - avg(profileB, lowExpressiveAxes))) / 2;

  // Inversion patterns:
  // A sends reassurance → B increases anxiety (B_autonomy high, B_withdraw high)
  const A_reassure_B_invert = A_reassure >= 0.65 && (B_auto >= 0.65 || B_withdraw >= 0.65);

  // B sends reassurance → A increases anxiety
  const B_reassure_A_invert = B_reassure >= 0.65 && (A_auto >= 0.65 || A_withdraw >= 0.65);

  // A sends vulnerability → B withdraws
  const A_vuln_B_withdraw = A_vuln >= 0.65 && B_withdraw >= 0.65;

  // B sends vulnerability → A withdraws
  const B_vuln_A_withdraw = B_vuln >= 0.65 && A_withdraw >= 0.65;

  const inversionCount =
    [
      A_reassure_B_invert,
      B_reassure_A_invert,
      A_vuln_B_withdraw,
      B_vuln_A_withdraw
    ].filter(Boolean).length;

  if (inversionCount >= 2) {
    return {
      triggered: true,
      severity: 'severe',
      penalty: 0.14,
      gradeCap: "C-",
      harmonyCap: 0.30,
      flag: "Emotional Feedback Loop Inversion",
      details: {
        pattern: "Reverse Emotional Response",
        A_reassurance: A_reassure.toFixed(2),
        B_reassurance: B_reassure.toFixed(2),
        A_withdrawal: A_withdraw.toFixed(2),
        B_withdrawal: B_withdraw.toFixed(2),
        inversionCount
      }
    };
  }

  return { triggered: false };
}
