/**
 * Emotional Labor Imbalance Detector (14th)
 *
 * Pattern: One partner performs the majority of emotional regulation,
 * conflict processing, and relational maintenance -> chronic depletion -> collapse
 *
 * This is the "I carry the emotional weight for both of us" pattern.
 * - One partner has high emotional intelligence, awareness, empathy
 * - The other has low emotional awareness, low relational contribution
 * - The emotional laborer becomes the "therapist"
 * - The other becomes the "client"
 * - Resentment accumulates, burnout occurs
 *
 * This is emotional over-functioning.
 *
 * Trait Indices:
 * - Emotional labor: Warm(11), Relational(2), DepthOriented(13), Sustainer(14)
 * - Low contribution: low Warm(11), low Relational(2), low Expressive(6), high MindCentered(3)
 */

const LABOR_INDICES = [11, 2, 13, 14];          // Warm, Relational, DepthOriented, Sustainer
const LOW_CONTRIBUTION_INDICES = [11, 2, 6];    // Warm, Relational, Expressive (low = not contributing)
const MIND_INDICES = [3];                        // MindCentered (high = emotionally distant)

export function detectEmotionalLaborImbalance(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Calculate emotional labor index
  const calcLaborIndex = (archetype) => {
    return LABOR_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / LABOR_INDICES.length;
  };

  // Calculate low contribution index
  const calcLowContributionIndex = (archetype) => {
    const low = LOW_CONTRIBUTION_INDICES.reduce((s, i) => s + (1 - (archetype[i] || 0)), 0) / LOW_CONTRIBUTION_INDICES.length;
    const mind = MIND_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / MIND_INDICES.length;
    return (low + mind) / 2;
  };

  const laborA = calcLaborIndex(archetypeA);
  const laborB = calcLaborIndex(archetypeB);
  const lowContribA = calcLowContributionIndex(archetypeA);
  const lowContribB = calcLowContributionIndex(archetypeB);

  // Detection thresholds
  const LABOR_THRESHOLD = 0.65;
  const LOW_CONTRIB_THRESHOLD = 0.60;

  // Pattern: One high laborer + one low contributor
  const A_labor_B_low = laborA >= LABOR_THRESHOLD && lowContribB >= LOW_CONTRIB_THRESHOLD;
  const B_labor_A_low = laborB >= LABOR_THRESHOLD && lowContribA >= LOW_CONTRIB_THRESHOLD;

  if (A_labor_B_low || B_labor_A_low) {
    const laborerProfile = A_labor_B_low ? 'A' : 'B';
    const lowContribProfile = A_labor_B_low ? 'B' : 'A';

    return {
      triggered: true,
      severity: 'moderate',
      penalty: 0.10,
      gradeCap: 'C',
      harmonyCap: 0.40,
      flag: 'Emotional Labor Imbalance (One-Sided Emotional Workload)',
      details: {
        laborA: Math.round(laborA * 100),
        laborB: Math.round(laborB * 100),
        lowContribA: Math.round(lowContribA * 100),
        lowContribB: Math.round(lowContribB * 100),
        laborerProfile,
        lowContribProfile,
        explanation: `Profile ${laborerProfile} carries most emotional regulation and repair work while Profile ${lowContribProfile} contributes little. This creates chronic depletion.`
      }
    };
  }

  // Milder form: Moderate imbalance
  const mildImbalance = (laborA >= 0.55 && lowContribB >= 0.50) || (laborB >= 0.55 && lowContribA >= 0.50);
  if (mildImbalance) {
    return {
      triggered: true,
      severity: 'mild',
      penalty: 0.04,
      gradeCap: 'B-',
      harmonyCap: 0.50,
      flag: 'Emotional Contribution Asymmetry',
      details: {
        laborA: Math.round(laborA * 100),
        laborB: Math.round(laborB * 100),
        lowContribA: Math.round(lowContribA * 100),
        lowContribB: Math.round(lowContribB * 100),
        explanation: 'Some asymmetry in emotional labor contribution. One partner may feel they do more relational work.'
      }
    };
  }

  return {
    triggered: false,
    details: {
      laborA: Math.round(laborA * 100),
      laborB: Math.round(laborB * 100),
      lowContribA: Math.round(lowContribA * 100),
      lowContribB: Math.round(lowContribB * 100)
    }
  };
}

export default detectEmotionalLaborImbalance;
