/**
 * Identity Erosion Loop Detector (13th)
 *
 * Pattern: One or both partners suppress core identity traits over time
 * -> chronic self-abandonment -> long-term structural collapse
 *
 * This is the "I shrink so we can survive" pattern.
 * - One or both partners have low boundary strength
 * - High relational compliance
 * - High emotional attunement
 * - Low self-assertion
 * - High fluid identity
 * - Chronic conflict avoidance and self-silencing
 *
 * This is the erosion of differentiation, the opposite of individuation.
 *
 * Trait Indices:
 * - Compliance: Warm(11), Relational(2), Sustainer(14)
 * - Low boundary: low BoundaryAware(15), low Direct(12)
 * - Fluidity: FluidIdentity(10)
 * - Dominance: Initiator(0), Direct(12), Expressive(6)
 */

const COMPLIANCE_INDICES = [11, 2, 14];     // Warm, Relational, Sustainer
const LOW_BOUNDARY_INDICES = [15, 12];       // BoundaryAware, Direct (low = erosion risk)
const FLUID_INDICES = [10];                  // FluidIdentity
const DOMINANCE_INDICES = [0, 12, 6];        // Initiator, Direct, Expressive

export function detectIdentityErosionLoop(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Calculate erosion index (high compliance + low boundary + high fluidity)
  const calcErosionIndex = (archetype) => {
    const compliance = COMPLIANCE_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / COMPLIANCE_INDICES.length;
    const lowBoundary = LOW_BOUNDARY_INDICES.reduce((s, i) => s + (1 - (archetype[i] || 0)), 0) / LOW_BOUNDARY_INDICES.length;
    const fluidity = FLUID_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / FLUID_INDICES.length;
    return (compliance + lowBoundary + fluidity) / 3;
  };

  // Calculate dominance index
  const calcDominanceIndex = (archetype) => {
    return DOMINANCE_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / DOMINANCE_INDICES.length;
  };

  const erosionA = calcErosionIndex(archetypeA);
  const erosionB = calcErosionIndex(archetypeB);
  const domA = calcDominanceIndex(archetypeA);
  const domB = calcDominanceIndex(archetypeB);

  // Detection thresholds
  const EROSION_THRESHOLD = 0.65;
  const DOMINANCE_THRESHOLD = 0.65;

  // Identity erosion triggers when:
  // 1. BOTH partners are eroding (mutual dissolution)
  // 2. OR one is eroding AND the other is high-dominance (asymmetric erosion)
  const bothEroding = erosionA >= EROSION_THRESHOLD && erosionB >= EROSION_THRESHOLD;
  const A_eroding_B_dominant = erosionA >= EROSION_THRESHOLD && domB >= DOMINANCE_THRESHOLD;
  const B_eroding_A_dominant = erosionB >= EROSION_THRESHOLD && domA >= DOMINANCE_THRESHOLD;

  if (bothEroding) {
    return {
      triggered: true,
      severity: 'moderate',
      penalty: 0.10,
      gradeCap: 'C-',
      harmonyCap: 0.35,
      flag: 'Identity Erosion Loop (Mutual Self-Abandonment)',
      details: {
        erosionA: Math.round(erosionA * 100),
        erosionB: Math.round(erosionB * 100),
        domA: Math.round(domA * 100),
        domB: Math.round(domB * 100),
        explanation: 'Both partners are prone to self-abandonment. Neither maintains strong identity boundaries, leading to mutual dissolution.'
      }
    };
  }

  if (A_eroding_B_dominant || B_eroding_A_dominant) {
    const erodingProfile = A_eroding_B_dominant ? 'A' : 'B';
    const dominantProfile = A_eroding_B_dominant ? 'B' : 'A';

    return {
      triggered: true,
      severity: 'moderate',
      penalty: 0.10,
      gradeCap: 'C',
      harmonyCap: 0.40,
      flag: 'Identity Erosion Loop (Self-Abandonment Pattern)',
      details: {
        erosionA: Math.round(erosionA * 100),
        erosionB: Math.round(erosionB * 100),
        domA: Math.round(domA * 100),
        domB: Math.round(domB * 100),
        erodingProfile,
        dominantProfile,
        explanation: `Profile ${erodingProfile} is prone to self-abandonment while Profile ${dominantProfile} is dominant. Risk of ${erodingProfile} losing their identity over time.`
      }
    };
  }

  // Milder form: One erosion-prone
  if (erosionA >= 0.55 || erosionB >= 0.55) {
    return {
      triggered: true,
      severity: 'mild',
      penalty: 0.04,
      gradeCap: 'B-',
      harmonyCap: 0.50,
      flag: 'Identity Boundary Weakness',
      details: {
        erosionA: Math.round(erosionA * 100),
        erosionB: Math.round(erosionB * 100),
        explanation: 'One or both partners may struggle to maintain identity boundaries in the relationship.'
      }
    };
  }

  return {
    triggered: false,
    details: {
      erosionA: Math.round(erosionA * 100),
      erosionB: Math.round(erosionB * 100),
      domA: Math.round(domA * 100),
      domB: Math.round(domB * 100)
    }
  };
}

export default detectIdentityErosionLoop;
