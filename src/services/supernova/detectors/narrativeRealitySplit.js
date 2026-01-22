/**
 * Narrative Reality Split Detector (17th)
 *
 * Pattern: Partners experience and interpret the relationship through
 * incompatible narrative frameworks -> chronic misunderstanding -> divergent realities
 *
 * This is the "we remember the same events completely differently" pattern.
 * - One is high Intuitive, the other high Concrete
 * - One is high Transpersonal, the other high MindCentered
 * - One is high DepthOriented, the other high Expressive
 * - One is high FluidIdentity, the other high OrderOriented
 *
 * These are not perspective differences - they are REALITY CONSTRUCTION differences.
 * When partners construct reality differently, they cannot share a coherent narrative.
 *
 * Trait Indices:
 * - Abstract reality: Intuitive(4), Transpersonal(7), DepthOriented(13), FluidIdentity(10)
 * - Concrete reality: Concrete(5), MindCentered(3), Expressive(6), OrderOriented(9)
 */

const ABSTRACT_REALITY_INDICES = [4, 7, 13, 10];   // Intuitive, Transpersonal, DepthOriented, FluidIdentity
const CONCRETE_REALITY_INDICES = [5, 3, 6, 9];     // Concrete, MindCentered, Expressive, OrderOriented

export function detectNarrativeRealitySplit(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Helper to calculate average
  const avg = (archetype, indices) => {
    return indices.reduce((s, i) => s + (archetype[i] || 0), 0) / indices.length;
  };

  // Compute reality construction modes for both profiles
  const A_abstract = avg(archetypeA, ABSTRACT_REALITY_INDICES);
  const B_abstract = avg(archetypeB, ABSTRACT_REALITY_INDICES);
  const A_concrete = avg(archetypeA, CONCRETE_REALITY_INDICES);
  const B_concrete = avg(archetypeB, CONCRETE_REALITY_INDICES);

  // Detection threshold
  const SPLIT_THRESHOLD = 0.60;

  // Check for reality axis divergence (one abstract, one concrete)
  const realitySplit =
    (A_abstract >= SPLIT_THRESHOLD && B_concrete >= SPLIT_THRESHOLD) ||
    (B_abstract >= SPLIT_THRESHOLD && A_concrete >= SPLIT_THRESHOLD);

  // Calculate divergence magnitude
  const divergenceMagnitude = Math.abs((A_abstract - A_concrete) - (B_abstract - B_concrete)) / 2;

  if (realitySplit && divergenceMagnitude >= 0.50) {
    const abstractProfile = A_abstract > B_abstract ? 'A' : 'B';
    const concreteProfile = A_abstract > B_abstract ? 'B' : 'A';

    return {
      triggered: true,
      severity: 'severe',
      penalty: 0.12,
      gradeCap: 'C-',
      harmonyCap: 0.35,
      flag: 'Narrative Reality Split (Incompatible Reality Construction)',
      details: {
        A_abstract: Math.round(A_abstract * 100),
        B_abstract: Math.round(B_abstract * 100),
        A_concrete: Math.round(A_concrete * 100),
        B_concrete: Math.round(B_concrete * 100),
        divergenceMagnitude: Math.round(divergenceMagnitude * 100),
        abstractProfile,
        concreteProfile,
        explanation: `Profile ${abstractProfile} constructs reality through abstraction and meaning while Profile ${concreteProfile} constructs reality through facts and evidence. They will "remember" the same events completely differently.`
      }
    };
  }

  if (realitySplit) {
    return {
      triggered: true,
      severity: 'moderate',
      penalty: 0.08,
      gradeCap: 'C',
      harmonyCap: 0.42,
      flag: 'Narrative Framework Tension',
      details: {
        A_abstract: Math.round(A_abstract * 100),
        B_abstract: Math.round(B_abstract * 100),
        A_concrete: Math.round(A_concrete * 100),
        B_concrete: Math.round(B_concrete * 100),
        divergenceMagnitude: Math.round(divergenceMagnitude * 100),
        explanation: 'Partners interpret reality through different lenses. May experience chronic "that\'s not what happened" moments.'
      }
    };
  }

  // Milder form: Some narrative divergence
  if (divergenceMagnitude >= 0.35) {
    return {
      triggered: true,
      severity: 'mild',
      penalty: 0.04,
      gradeCap: 'B-',
      harmonyCap: 0.55,
      flag: 'Narrative Style Difference',
      details: {
        A_abstract: Math.round(A_abstract * 100),
        B_abstract: Math.round(B_abstract * 100),
        divergenceMagnitude: Math.round(divergenceMagnitude * 100),
        explanation: 'Some difference in how partners construct meaning from shared experiences.'
      }
    };
  }

  return {
    triggered: false,
    details: {
      A_abstract: Math.round(A_abstract * 100),
      B_abstract: Math.round(B_abstract * 100),
      A_concrete: Math.round(A_concrete * 100),
      B_concrete: Math.round(B_concrete * 100),
      divergenceMagnitude: Math.round(divergenceMagnitude * 100)
    }
  };
}

export default detectNarrativeRealitySplit;
