/**
 * Co-Dependency Loop Detector (12th)
 *
 * Pattern: Both partners rely on each other for emotional regulation
 * -> chronic instability -> mutual reinforcement of dysfunction
 *
 * This is the "I can't function unless you stabilize me" pattern.
 * - Both partners have low internal stability
 * - Both have high emotional intensity
 * - Both have low boundaries
 * - Both rely on the other for emotional soothing
 * - Both panic when the other withdraws
 * - Both escalate to maintain connection
 *
 * This is the mutual addiction pattern - not clinical, but structural.
 *
 * Trait Indices:
 * - Emotional intensity: Warm(11), Relational(2), Expressive(6)
 * - Low stability: low BoundaryAware(15), low Stabilizer(1), high FluidIdentity(10)
 */

const INTENSITY_INDICES = [11, 2, 6];       // Warm, Relational, Expressive
const LOW_STABILITY_INDICES = [15, 1];      // BoundaryAware, Stabilizer (low = unstable)
const VOLATILITY_INDICES = [10];             // FluidIdentity

export function detectCoDependencyLoop(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Calculate emotional intensity
  const calcEmotionalIntensity = (archetype) => {
    return INTENSITY_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / INTENSITY_INDICES.length;
  };

  // Calculate instability index
  const calcInstabilityIndex = (archetype) => {
    const lowStable = LOW_STABILITY_INDICES.reduce((s, i) => s + (1 - (archetype[i] || 0)), 0) / LOW_STABILITY_INDICES.length;
    const volatility = VOLATILITY_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / VOLATILITY_INDICES.length;
    return (lowStable + volatility) / 2;
  };

  const intensityA = calcEmotionalIntensity(archetypeA);
  const intensityB = calcEmotionalIntensity(archetypeB);
  const instabilityA = calcInstabilityIndex(archetypeA);
  const instabilityB = calcInstabilityIndex(archetypeB);

  // Detection thresholds
  const INTENSITY_THRESHOLD = 0.65;
  const INSTABILITY_THRESHOLD = 0.55;

  // Co-dependency: Both intense AND both unstable
  const bothIntense = intensityA >= INTENSITY_THRESHOLD && intensityB >= INTENSITY_THRESHOLD;
  const bothUnstable = instabilityA >= INSTABILITY_THRESHOLD && instabilityB >= INSTABILITY_THRESHOLD;

  if (bothIntense && bothUnstable) {
    return {
      triggered: true,
      severity: 'moderate',
      penalty: 0.12,
      gradeCap: 'C-',
      harmonyCap: 0.30,
      flag: 'Co-Dependency Loop (Mutual Emotional Reliance)',
      details: {
        intensityA: Math.round(intensityA * 100),
        intensityB: Math.round(intensityB * 100),
        instabilityA: Math.round(instabilityA * 100),
        instabilityB: Math.round(instabilityB * 100),
        explanation: 'Both partners have high emotional intensity with low internal stability. They rely on each other for regulation, creating mutual addiction dynamics.'
      }
    };
  }

  // Milder form: Both intense (but one more stable)
  if (bothIntense && (instabilityA >= 0.45 || instabilityB >= 0.45)) {
    return {
      triggered: true,
      severity: 'mild',
      penalty: 0.05,
      gradeCap: 'C+',
      harmonyCap: 0.45,
      flag: 'High Emotional Interdependence',
      details: {
        intensityA: Math.round(intensityA * 100),
        intensityB: Math.round(intensityB * 100),
        instabilityA: Math.round(instabilityA * 100),
        instabilityB: Math.round(instabilityB * 100),
        explanation: 'Both partners are emotionally intense. May develop unhealthy reliance patterns under stress.'
      }
    };
  }

  return {
    triggered: false,
    details: {
      intensityA: Math.round(intensityA * 100),
      intensityB: Math.round(intensityB * 100),
      instabilityA: Math.round(instabilityA * 100),
      instabilityB: Math.round(instabilityB * 100)
    }
  };
}

export default detectCoDependencyLoop;
