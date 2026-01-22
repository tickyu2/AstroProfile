/**
 * Detector #37: Emotional Boundary Elasticity Mismatch
 *
 * Pattern: Partners have different levels of boundary flexibility
 * → rigidity vs permeability → relational instability
 *
 * This is the elasticity collapse - how boundaries move under emotional pressure.
 *
 * Emerges when:
 * - One partner's boundaries stretch easily, the other's barely move
 * - One adapts boundaries situationally, the other maintains fixed rules
 * - One adjusts emotional access dynamically, the other keeps it constant
 * - One expands boundaries under connection, the other contracts under pressure
 */

export function detectEmotionalBoundaryElasticityMismatch(profileA, profileB) {
  // Rigid boundary traits: high BoundaryAware, high OrderOriented, high Stabilizer
  const rigidAxes = ["BoundaryAware", "OrderOriented", "Stabilizer"];

  // Elastic boundary traits: high Warm, high Relational, high Expressive, high FluidIdentity
  const elasticAxes = ["Warm", "Relational", "Expressive", "FluidIdentity"];

  // Boundary stress traits: high DepthOriented, high Initiator
  const stressAxes = ["DepthOriented", "Initiator"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_rigid = avg(profileA, rigidAxes);
  const B_rigid = avg(profileB, rigidAxes);

  const A_elastic = avg(profileA, elasticAxes);
  const B_elastic = avg(profileB, elasticAxes);

  const A_stress = avg(profileA, stressAxes);
  const B_stress = avg(profileB, stressAxes);

  // Divergence triggers when one partner is rigid and the other is elastic
  const A_rigid_B_elastic = A_rigid >= 0.65 && B_elastic >= 0.65;
  const B_rigid_A_elastic = B_rigid >= 0.65 && A_elastic >= 0.65;

  // Stress amplifies mismatch
  const stressAmplifier = (A_stress + B_stress) / 2 >= 0.55;

  if ((A_rigid_B_elastic || B_rigid_A_elastic) && stressAmplifier) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.12,
      gradeCap: "C",
      harmonyCap: 0.35,
      flag: "Emotional Boundary Elasticity Mismatch",
      details: {
        pattern: "Rigid vs Elastic Boundaries",
        A_rigid: A_rigid.toFixed(2),
        B_rigid: B_rigid.toFixed(2),
        A_elastic: A_elastic.toFixed(2),
        B_elastic: B_elastic.toFixed(2),
        stressAmplifier
      }
    };
  }

  return { triggered: false };
}
