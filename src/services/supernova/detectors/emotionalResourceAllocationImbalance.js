/**
 * Detector #36: Emotional Resource Allocation Imbalance
 *
 * Pattern: Partners allocate emotional time, energy, and attention differently
 * → chronic imbalance → relational instability
 *
 * This is the allocation collapse - how each partner spends emotional resources.
 *
 * Emerges when:
 * - One partner allocates emotional energy to the relationship first, the other last
 * - One invests heavily in emotional maintenance, the other invests in crisis only
 * - One distributes emotional attention evenly, the other distributes it reactively
 * - One budgets emotional energy proactively, the other budgets it situationally
 */

export function detectEmotionalResourceAllocationImbalance(profileA, profileB) {
  // High allocation traits: high Warm, high Relational, high Expressive, high Sustainer
  const highAllocAxes = ["Warm", "Relational", "Expressive", "Sustainer"];

  // Low allocation traits: high BoundaryAware, high MindCentered, high Stabilizer, low Expressive
  const lowAllocAxes = ["BoundaryAware", "MindCentered", "Stabilizer"];
  const lowExpressiveAxes = ["Expressive"];

  // Allocation strategy traits: high OrderOriented (structured), high FluidIdentity (reactive)
  const structuredAxes = ["OrderOriented"];
  const reactiveAxes = ["FluidIdentity"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_high = avg(profileA, highAllocAxes);
  const B_high = avg(profileB, highAllocAxes);

  const A_low = (avg(profileA, lowAllocAxes) + (1 - avg(profileA, lowExpressiveAxes))) / 2;
  const B_low = (avg(profileB, lowAllocAxes) + (1 - avg(profileB, lowExpressiveAxes))) / 2;

  const A_struct = avg(profileA, structuredAxes);
  const B_struct = avg(profileB, structuredAxes);

  const A_react = avg(profileA, reactiveAxes);
  const B_react = avg(profileB, reactiveAxes);

  // Divergence triggers when one allocates heavily and the other allocates minimally
  const A_high_B_low = A_high >= 0.65 && B_low >= 0.65;
  const B_high_A_low = B_high >= 0.65 && A_low >= 0.65;

  // Strategy mismatch amplifies imbalance
  const strategyMismatch =
    (A_struct >= 0.60 && B_react >= 0.60) ||
    (B_struct >= 0.60 && A_react >= 0.60);

  if ((A_high_B_low || B_high_A_low) && strategyMismatch) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.12,
      gradeCap: "C",
      harmonyCap: 0.35,
      flag: "Emotional Resource Allocation Imbalance",
      details: {
        pattern: "Uneven Emotional Budgeting",
        A_highAllocation: A_high.toFixed(2),
        B_highAllocation: B_high.toFixed(2),
        A_lowAllocation: A_low.toFixed(2),
        B_lowAllocation: B_low.toFixed(2),
        strategyMismatch
      }
    };
  }

  return { triggered: false };
}
