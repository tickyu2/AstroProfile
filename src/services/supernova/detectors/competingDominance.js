/**
 * Competing Dominance Detector (Double-Solar Pattern)
 *
 * Detects when two high-dominance, low-yield personalities collide.
 * This is the classic Musk x Jobs pattern - two suns in the same system.
 *
 * Trait Indices (from SIGN_ARCHETYPE_VECTORS):
 * - 0: Initiator, 1: Stabilizer, 2: Relational, 3: MindCentered
 * - 4: Intuitive, 5: Concrete, 6: Expressive, 7: Transpersonal
 * - 8: RiskSeeking, 9: OrderOriented, 10: FluidIdentity, 11: Warm
 * - 12: Direct, 13: DepthOriented, 14: Sustainer, 15: BoundaryAware
 *
 * Dominance Cluster: Initiator(0), RiskSeeking(8), Direct(12), Expressive(6)
 * Buffer Cluster: Warm(11), Relational(2), BoundaryAware(15), Sustainer(14)
 */

const DOMINANCE_INDICES = [0, 8, 12, 6];  // Initiator, RiskSeeking, Direct, Expressive
const BUFFER_INDICES = [11, 2, 15, 14];   // Warm, Relational, BoundaryAware, Sustainer

export function detectCompetingDominance(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Calculate average dominance and buffer for each profile
  const avgDominance = (archetype) => {
    return DOMINANCE_INDICES.reduce((sum, i) => sum + (archetype[i] || 0), 0) / DOMINANCE_INDICES.length;
  };

  const avgBuffer = (archetype) => {
    return BUFFER_INDICES.reduce((sum, i) => sum + (archetype[i] || 0), 0) / BUFFER_INDICES.length;
  };

  const domA = avgDominance(archetypeA);
  const domB = avgDominance(archetypeB);
  const bufA = avgBuffer(archetypeA);
  const bufB = avgBuffer(archetypeB);

  // Detection thresholds
  const HIGH_DOMINANCE_THRESHOLD = 0.65;
  const LOW_BUFFER_THRESHOLD = 0.45;

  const highDomA = domA >= HIGH_DOMINANCE_THRESHOLD;
  const highDomB = domB >= HIGH_DOMINANCE_THRESHOLD;
  const lowBufA = bufA <= LOW_BUFFER_THRESHOLD;
  const lowBufB = bufB <= LOW_BUFFER_THRESHOLD;

  // Competing Dominance: Both high dominance AND both low buffer
  const competingDominance = highDomA && highDomB && lowBufA && lowBufB;

  // Milder form: Both high dominance but only one low buffer
  const partialCompeting = highDomA && highDomB && (lowBufA || lowBufB);

  if (competingDominance) {
    return {
      triggered: true,
      severity: 'severe',
      penalty: 0.15,
      gradeCap: 'C+',
      harmonyCap: 0.30,
      flag: 'Competing Dominance (Double-Solar Supernova)',
      details: {
        domA: Math.round(domA * 100),
        domB: Math.round(domB * 100),
        bufA: Math.round(bufA * 100),
        bufB: Math.round(bufB * 100),
        explanation: 'Both profiles are high-dominance with low buffering capacity. This creates a power struggle dynamic with no natural yielding point.'
      }
    };
  }

  if (partialCompeting) {
    return {
      triggered: true,
      severity: 'moderate',
      penalty: 0.08,
      gradeCap: 'B-',
      harmonyCap: 0.45,
      flag: 'High Dominance Collision',
      details: {
        domA: Math.round(domA * 100),
        domB: Math.round(domB * 100),
        bufA: Math.round(bufA * 100),
        bufB: Math.round(bufB * 100),
        explanation: 'Both profiles are high-dominance. One has some buffer capacity, but tension is likely.'
      }
    };
  }

  return {
    triggered: false,
    details: {
      domA: Math.round(domA * 100),
      domB: Math.round(domB * 100),
      bufA: Math.round(bufA * 100),
      bufB: Math.round(bufB * 100)
    }
  };
}

export default detectCompetingDominance;
