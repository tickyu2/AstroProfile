/**
 * Value System Divergence Detector (15th)
 *
 * Pattern: Partners hold incompatible core values
 * -> chronic philosophical friction -> long-term structural fracture
 *
 * This is the "we live by different truths" pattern.
 * - One is high OrderOriented, the other high FluidIdentity
 * - One is high Stabilizer, the other high RiskSeeking
 * - One is high Transpersonal, the other high MindCentered
 * - One is high DepthOriented, the other high Expressive
 *
 * These are not personality differences - they are VALUE differences.
 * When values diverge, the relationship becomes directionally incoherent.
 *
 * Trait Indices:
 * - Stability values: OrderOriented(9), Stabilizer(1)
 * - Freedom values: RiskSeeking(8), FluidIdentity(10)
 * - Depth values: DepthOriented(13), Transpersonal(7)
 * - Surface values: Expressive(6), MindCentered(3)
 * - Relational values: Warm(11), Relational(2)
 * - Autonomy values: BoundaryAware(15), Initiator(0)
 */

const STABILITY_VALUES = [9, 1];    // OrderOriented, Stabilizer
const FREEDOM_VALUES = [8, 10];     // RiskSeeking, FluidIdentity
const DEPTH_VALUES = [13, 7];       // DepthOriented, Transpersonal
const SURFACE_VALUES = [6, 3];      // Expressive, MindCentered
const RELATIONAL_VALUES = [11, 2];  // Warm, Relational
const AUTONOMY_VALUES = [15, 0];    // BoundaryAware, Initiator

export function detectValueSystemDivergence(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Helper to calculate average
  const avg = (archetype, indices) => {
    return indices.reduce((s, i) => s + (archetype[i] || 0), 0) / indices.length;
  };

  // Compute value clusters for both profiles
  const A_stability = avg(archetypeA, STABILITY_VALUES);
  const B_stability = avg(archetypeB, STABILITY_VALUES);
  const A_freedom = avg(archetypeA, FREEDOM_VALUES);
  const B_freedom = avg(archetypeB, FREEDOM_VALUES);
  const A_depth = avg(archetypeA, DEPTH_VALUES);
  const B_depth = avg(archetypeB, DEPTH_VALUES);
  const A_surface = avg(archetypeA, SURFACE_VALUES);
  const B_surface = avg(archetypeB, SURFACE_VALUES);
  const A_relational = avg(archetypeA, RELATIONAL_VALUES);
  const B_relational = avg(archetypeB, RELATIONAL_VALUES);
  const A_autonomy = avg(archetypeA, AUTONOMY_VALUES);
  const B_autonomy = avg(archetypeB, AUTONOMY_VALUES);

  // Detection threshold
  const DIVERGENCE_THRESHOLD = 0.60;

  // Check for value axis divergence (partners on opposite ends)
  const stabilityVsFreedom =
    (A_stability >= DIVERGENCE_THRESHOLD && B_freedom >= DIVERGENCE_THRESHOLD) ||
    (B_stability >= DIVERGENCE_THRESHOLD && A_freedom >= DIVERGENCE_THRESHOLD);

  const depthVsSurface =
    (A_depth >= DIVERGENCE_THRESHOLD && B_surface >= DIVERGENCE_THRESHOLD) ||
    (B_depth >= DIVERGENCE_THRESHOLD && A_surface >= DIVERGENCE_THRESHOLD);

  const relationalVsAutonomy =
    (A_relational >= DIVERGENCE_THRESHOLD && B_autonomy >= DIVERGENCE_THRESHOLD) ||
    (B_relational >= DIVERGENCE_THRESHOLD && A_autonomy >= DIVERGENCE_THRESHOLD);

  const divergenceCount = [stabilityVsFreedom, depthVsSurface, relationalVsAutonomy].filter(Boolean).length;
  const divergences = [];
  if (stabilityVsFreedom) divergences.push('stability-vs-freedom');
  if (depthVsSurface) divergences.push('depth-vs-surface');
  if (relationalVsAutonomy) divergences.push('relational-vs-autonomy');

  if (divergenceCount >= 2) {
    return {
      triggered: true,
      severity: 'severe',
      penalty: 0.15,
      gradeCap: 'C-',
      harmonyCap: 0.30,
      flag: 'Value System Divergence (Philosophical Incompatibility)',
      details: {
        divergenceCount,
        divergences,
        A_stability: Math.round(A_stability * 100),
        B_stability: Math.round(B_stability * 100),
        A_freedom: Math.round(A_freedom * 100),
        B_freedom: Math.round(B_freedom * 100),
        explanation: `Partners diverge on ${divergenceCount} fundamental value axes: ${divergences.join(', ')}. This creates chronic philosophical friction.`
      }
    };
  }

  if (divergenceCount === 1) {
    return {
      triggered: true,
      severity: 'mild',
      penalty: 0.06,
      gradeCap: 'C+',
      harmonyCap: 0.45,
      flag: 'Value Axis Tension',
      details: {
        divergenceCount,
        divergences,
        explanation: `Partners diverge on one value axis: ${divergences[0]}. May create tension around life decisions.`
      }
    };
  }

  return {
    triggered: false,
    details: {
      divergenceCount,
      A_stability: Math.round(A_stability * 100),
      B_freedom: Math.round(B_freedom * 100)
    }
  };
}

export default detectValueSystemDivergence;
