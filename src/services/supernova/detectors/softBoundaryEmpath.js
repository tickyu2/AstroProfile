/**
 * Soft-Boundary Empath Collapse Detector
 *
 * Detects when one partner is too soft, too permeable, too sensitive
 * and paired with a dominant, low-warmth personality.
 *
 * Outcome: Emotional flooding, retreat, boundary erosion, exhaustion.
 *
 * Trait Indices (from SIGN_ARCHETYPE_VECTORS):
 * - Warm(11), Relational(2), FluidIdentity(10) = Soft/Permeable
 * - BoundaryAware(15), Direct(12) = Boundary firmness
 * - Initiator(0), RiskSeeking(8), Direct(12) = Dominance
 */

const SOFT_INDICES = [11, 2, 10];     // Warm, Relational, FluidIdentity
const BOUNDARY_INDICES = [15, 12];    // BoundaryAware, Direct
const DOMINANCE_INDICES = [0, 8, 12]; // Initiator, RiskSeeking, Direct

export function detectSoftBoundaryEmpath(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Calculate softness (high soft traits - low boundary traits)
  const calcSoftness = (archetype) => {
    const softAvg = SOFT_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / SOFT_INDICES.length;
    const boundaryAvg = BOUNDARY_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / BOUNDARY_INDICES.length;
    return softAvg - boundaryAvg; // Positive = soft, Negative = firm
  };

  // Calculate dominance
  const calcDominance = (archetype) => {
    return DOMINANCE_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / DOMINANCE_INDICES.length;
  };

  const softnessA = calcSoftness(archetypeA);
  const softnessB = calcSoftness(archetypeB);
  const domA = calcDominance(archetypeA);
  const domB = calcDominance(archetypeB);

  // Detection: One very soft (>0.25) paired with one very dominant (>0.65)
  const SOFT_THRESHOLD = 0.25;
  const FIRM_THRESHOLD = -0.10;
  const DOM_THRESHOLD = 0.65;

  const softAFirmB = softnessA >= SOFT_THRESHOLD && softnessB <= FIRM_THRESHOLD && domB >= DOM_THRESHOLD;
  const softBFirmA = softnessB >= SOFT_THRESHOLD && softnessA <= FIRM_THRESHOLD && domA >= DOM_THRESHOLD;

  if (softAFirmB || softBFirmA) {
    const softProfile = softAFirmB ? 'A' : 'B';
    const domProfile = softAFirmB ? 'B' : 'A';

    return {
      triggered: true,
      severity: 'severe',
      penalty: 0.12,
      gradeCap: 'D',
      harmonyCap: 0.35,
      flag: 'Soft-Boundary Empath Collapse',
      details: {
        softnessA: Math.round(softnessA * 100),
        softnessB: Math.round(softnessB * 100),
        domA: Math.round(domA * 100),
        domB: Math.round(domB * 100),
        softProfile,
        domProfile,
        explanation: `Profile ${softProfile} is highly permeable/soft while Profile ${domProfile} is dominant. The soft partner will be overwhelmed and retreat.`
      }
    };
  }

  // Milder form: One soft, one moderately firm
  const mildSoftAFirmB = softnessA >= 0.15 && softnessB <= 0 && domB >= 0.55;
  const mildSoftBFirmA = softnessB >= 0.15 && softnessA <= 0 && domA >= 0.55;

  if (mildSoftAFirmB || mildSoftBFirmA) {
    return {
      triggered: true,
      severity: 'mild',
      penalty: 0.05,
      gradeCap: 'C',
      harmonyCap: 0.50,
      flag: 'Boundary Asymmetry',
      details: {
        softnessA: Math.round(softnessA * 100),
        softnessB: Math.round(softnessB * 100),
        explanation: 'Moderate boundary asymmetry detected. One partner more permeable than the other.'
      }
    };
  }

  return {
    triggered: false,
    details: {
      softnessA: Math.round(softnessA * 100),
      softnessB: Math.round(softnessB * 100)
    }
  };
}

export default detectSoftBoundaryEmpath;
