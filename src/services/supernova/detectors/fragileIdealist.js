/**
 * Fragile Idealist Breakdown Detector
 *
 * Detects when one or both partners are highly idealistic but low resilience.
 * They cannot tolerate abrasive communication, take dominance personally,
 * and break under stress.
 *
 * Outcome: Emotional collapse, no repair capacity, needs reassurance
 * the partner cannot provide.
 *
 * Trait Indices (from SIGN_ARCHETYPE_VECTORS):
 * - Transpersonal(7), Warm(11), DepthOriented(13) = Idealism
 * - BoundaryAware(15), Stabilizer(1) = Resilience
 */

const IDEALISM_INDICES = [7, 11, 13];    // Transpersonal, Warm, DepthOriented
const RESILIENCE_INDICES = [15, 1];       // BoundaryAware, Stabilizer

export function detectFragileIdealist(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Calculate idealism and resilience scores
  const calcIdealism = (archetype) => {
    return IDEALISM_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / IDEALISM_INDICES.length;
  };

  const calcResilience = (archetype) => {
    return RESILIENCE_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / RESILIENCE_INDICES.length;
  };

  const idealismA = calcIdealism(archetypeA);
  const idealismB = calcIdealism(archetypeB);
  const resilienceA = calcResilience(archetypeA);
  const resilienceB = calcResilience(archetypeB);

  // Detection thresholds
  const HIGH_IDEALISM_THRESHOLD = 0.70;
  const LOW_RESILIENCE_THRESHOLD = 0.45;

  // Fragile Idealist: High idealism + Low resilience
  const fragileA = idealismA >= HIGH_IDEALISM_THRESHOLD && resilienceA <= LOW_RESILIENCE_THRESHOLD;
  const fragileB = idealismB >= HIGH_IDEALISM_THRESHOLD && resilienceB <= LOW_RESILIENCE_THRESHOLD;

  // Both fragile idealists = extremely problematic (no one can hold the structure)
  if (fragileA && fragileB) {
    return {
      triggered: true,
      severity: 'severe',
      penalty: 0.15,
      gradeCap: 'D-',
      harmonyCap: 0.25,
      flag: 'Double Fragile Idealist Collapse',
      details: {
        idealismA: Math.round(idealismA * 100),
        idealismB: Math.round(idealismB * 100),
        resilienceA: Math.round(resilienceA * 100),
        resilienceB: Math.round(resilienceB * 100),
        explanation: 'Both profiles are highly idealistic with low resilience. Neither can hold the structure when stress arrives.'
      }
    };
  }

  // One fragile idealist
  if (fragileA || fragileB) {
    const fragileProfile = fragileA ? 'A' : 'B';

    return {
      triggered: true,
      severity: 'moderate',
      penalty: 0.10,
      gradeCap: 'D+',
      harmonyCap: 0.40,
      flag: 'Fragile Idealist Breakdown Risk',
      details: {
        idealismA: Math.round(idealismA * 100),
        idealismB: Math.round(idealismB * 100),
        resilienceA: Math.round(resilienceA * 100),
        resilienceB: Math.round(resilienceB * 100),
        fragileProfile,
        explanation: `Profile ${fragileProfile} is highly idealistic but lacks resilience. They need constant reassurance and cannot handle abrasive communication.`
      }
    };
  }

  // Milder form: Moderately high idealism with moderate-low resilience
  const mildFragileA = idealismA >= 0.60 && resilienceA <= 0.50;
  const mildFragileB = idealismB >= 0.60 && resilienceB <= 0.50;

  if (mildFragileA || mildFragileB) {
    return {
      triggered: true,
      severity: 'mild',
      penalty: 0.04,
      gradeCap: 'C',
      harmonyCap: 0.55,
      flag: 'Idealism-Resilience Imbalance',
      details: {
        idealismA: Math.round(idealismA * 100),
        idealismB: Math.round(idealismB * 100),
        resilienceA: Math.round(resilienceA * 100),
        resilienceB: Math.round(resilienceB * 100),
        explanation: 'One or both partners have idealism that exceeds their resilience capacity. May struggle under prolonged stress.'
      }
    };
  }

  return {
    triggered: false,
    details: {
      idealismA: Math.round(idealismA * 100),
      idealismB: Math.round(idealismB * 100),
      resilienceA: Math.round(resilienceA * 100),
      resilienceB: Math.round(resilienceB * 100)
    }
  };
}

export default detectFragileIdealist;
