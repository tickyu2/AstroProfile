/**
 * Life Trajectory Mismatch Detector (16th)
 *
 * Pattern: Partners have incompatible long-term life directions
 * -> chronic misalignment -> eventual structural fracture
 *
 * This is the "we love each other, but we're not going to the same place" pattern.
 * - One is high Initiator, the other high Sustainer
 * - One is high RiskSeeking, the other high Stabilizer
 * - One is high Transpersonal, the other high MindCentered
 * - One is high FluidIdentity, the other high OrderOriented
 *
 * These are not personality differences - they are TRAJECTORY vectors.
 * When trajectories diverge, the relationship cannot synchronize long-term.
 *
 * Trait Indices:
 * - Expansion: Initiator(0), RiskSeeking(8), Expressive(6)
 * - Stability: Sustainer(14), Stabilizer(1), OrderOriented(9)
 * - Transcendence: Transpersonal(7), DepthOriented(13)
 * - Pragmatic: MindCentered(3), BoundaryAware(15)
 * - Fluidity: FluidIdentity(10)
 * - Structure: OrderOriented(9)
 */

const EXPANSION_INDICES = [0, 8, 6];     // Initiator, RiskSeeking, Expressive
const STABILITY_INDICES = [14, 1, 9];    // Sustainer, Stabilizer, OrderOriented
const TRANSCENDENCE_INDICES = [7, 13];   // Transpersonal, DepthOriented
const PRAGMATIC_INDICES = [3, 15];       // MindCentered, BoundaryAware
const FLUIDITY_INDICES = [10];           // FluidIdentity
const STRUCTURE_INDICES = [9];           // OrderOriented

export function detectLifeTrajectoryMismatch(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Helper to calculate average
  const avg = (archetype, indices) => {
    return indices.reduce((s, i) => s + (archetype[i] || 0), 0) / indices.length;
  };

  // Compute directional clusters for both profiles
  const A_expansion = avg(archetypeA, EXPANSION_INDICES);
  const B_expansion = avg(archetypeB, EXPANSION_INDICES);
  const A_stability = avg(archetypeA, STABILITY_INDICES);
  const B_stability = avg(archetypeB, STABILITY_INDICES);
  const A_transcend = avg(archetypeA, TRANSCENDENCE_INDICES);
  const B_transcend = avg(archetypeB, TRANSCENDENCE_INDICES);
  const A_pragmatic = avg(archetypeA, PRAGMATIC_INDICES);
  const B_pragmatic = avg(archetypeB, PRAGMATIC_INDICES);
  const A_fluid = avg(archetypeA, FLUIDITY_INDICES);
  const B_fluid = avg(archetypeB, FLUIDITY_INDICES);
  const A_struct = avg(archetypeA, STRUCTURE_INDICES);
  const B_struct = avg(archetypeB, STRUCTURE_INDICES);

  // Detection threshold
  const DIVERGENCE_THRESHOLD = 0.60;

  // Check for trajectory axis divergence (partners moving in opposite directions)
  const expansionVsStability =
    (A_expansion >= DIVERGENCE_THRESHOLD && B_stability >= DIVERGENCE_THRESHOLD) ||
    (B_expansion >= DIVERGENCE_THRESHOLD && A_stability >= DIVERGENCE_THRESHOLD);

  const transcendVsPragmatic =
    (A_transcend >= DIVERGENCE_THRESHOLD && B_pragmatic >= DIVERGENCE_THRESHOLD) ||
    (B_transcend >= DIVERGENCE_THRESHOLD && A_pragmatic >= DIVERGENCE_THRESHOLD);

  const fluidVsStructured =
    (A_fluid >= DIVERGENCE_THRESHOLD && B_struct >= DIVERGENCE_THRESHOLD) ||
    (B_fluid >= DIVERGENCE_THRESHOLD && A_struct >= DIVERGENCE_THRESHOLD);

  const divergenceCount = [expansionVsStability, transcendVsPragmatic, fluidVsStructured].filter(Boolean).length;
  const divergences = [];
  if (expansionVsStability) divergences.push('expansion-vs-stability');
  if (transcendVsPragmatic) divergences.push('transcendence-vs-pragmatic');
  if (fluidVsStructured) divergences.push('fluid-vs-structured');

  if (divergenceCount >= 2) {
    return {
      triggered: true,
      severity: 'severe',
      penalty: 0.15,
      gradeCap: 'C-',
      harmonyCap: 0.30,
      flag: 'Life Trajectory Mismatch (Directional Incompatibility)',
      details: {
        divergenceCount,
        divergences,
        A_expansion: Math.round(A_expansion * 100),
        B_expansion: Math.round(B_expansion * 100),
        A_stability: Math.round(A_stability * 100),
        B_stability: Math.round(B_stability * 100),
        explanation: `Partners are moving in fundamentally different life directions across ${divergenceCount} axes: ${divergences.join(', ')}. Long-term synchronization is unlikely.`
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
      flag: 'Life Direction Tension',
      details: {
        divergenceCount,
        divergences,
        explanation: `Partners diverge on one trajectory axis: ${divergences[0]}. May create friction around long-term planning.`
      }
    };
  }

  return {
    triggered: false,
    details: {
      divergenceCount,
      A_expansion: Math.round(A_expansion * 100),
      B_stability: Math.round(B_stability * 100)
    }
  };
}

export default detectLifeTrajectoryMismatch;
