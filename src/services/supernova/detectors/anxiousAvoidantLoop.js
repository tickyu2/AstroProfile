/**
 * Anxious-Avoidant Loop Detector
 *
 * Pattern: One partner pursues connection -> the other withdraws -> cycle escalates
 * This is the classic "pursuer-withdrawer" dynamic.
 *
 * - The anxious partner seeks closeness, reassurance, emotional contact
 * - The avoidant partner seeks space, autonomy, emotional distance
 * - Each partner's coping strategy triggers the other's
 * - The loop becomes self-reinforcing
 *
 * This is not a collapse of dominance. It's a collapse of attachment polarity.
 *
 * Trait Indices:
 * - Anxious: high Warm(11), Relational(2), Expressive(6), low BoundaryAware(15)
 * - Avoidant: high MindCentered(3), BoundaryAware(15), low Warm(11), Relational(2)
 */

const ANXIOUS_HIGH_INDICES = [11, 2, 6];  // Warm, Relational, Expressive
const ANXIOUS_LOW_INDICES = [15];          // BoundaryAware (low = anxious)
const AVOIDANT_HIGH_INDICES = [3, 15];     // MindCentered, BoundaryAware
const AVOIDANT_LOW_INDICES = [11, 2];      // Warm, Relational (low = avoidant)

export function detectAnxiousAvoidantLoop(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Calculate anxious index
  const calcAnxiousIndex = (archetype) => {
    const high = ANXIOUS_HIGH_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / ANXIOUS_HIGH_INDICES.length;
    const low = ANXIOUS_LOW_INDICES.reduce((s, i) => s + (1 - (archetype[i] || 0)), 0) / ANXIOUS_LOW_INDICES.length;
    return (high + low) / 2;
  };

  // Calculate avoidant index
  const calcAvoidantIndex = (archetype) => {
    const high = AVOIDANT_HIGH_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / AVOIDANT_HIGH_INDICES.length;
    const low = AVOIDANT_LOW_INDICES.reduce((s, i) => s + (1 - (archetype[i] || 0)), 0) / AVOIDANT_LOW_INDICES.length;
    return (high + low) / 2;
  };

  const anxA = calcAnxiousIndex(archetypeA);
  const anxB = calcAnxiousIndex(archetypeB);
  const avoidA = calcAvoidantIndex(archetypeA);
  const avoidB = calcAvoidantIndex(archetypeB);

  // Detection thresholds
  const ANXIOUS_THRESHOLD = 0.60;
  const AVOIDANT_THRESHOLD = 0.60;

  // Loop: One anxious + one avoidant
  const loopA = anxA >= ANXIOUS_THRESHOLD && avoidB >= AVOIDANT_THRESHOLD;
  const loopB = anxB >= ANXIOUS_THRESHOLD && avoidA >= AVOIDANT_THRESHOLD;

  if (loopA || loopB) {
    const anxiousProfile = loopA ? 'A' : 'B';
    const avoidantProfile = loopA ? 'B' : 'A';

    return {
      triggered: true,
      severity: 'moderate',
      penalty: 0.12,
      gradeCap: 'C',
      harmonyCap: 0.30,
      flag: 'Anxious-Avoidant Loop (Pursuer-Withdrawer Cycle)',
      details: {
        anxA: Math.round(anxA * 100),
        anxB: Math.round(anxB * 100),
        avoidA: Math.round(avoidA * 100),
        avoidB: Math.round(avoidB * 100),
        anxiousProfile,
        avoidantProfile,
        explanation: `Profile ${anxiousProfile} pursues connection while Profile ${avoidantProfile} withdraws. Each triggers the other's defense, creating a self-reinforcing loop.`
      }
    };
  }

  // Milder form: Moderate anxious-avoidant polarity
  const mildLoopA = anxA >= 0.50 && avoidB >= 0.50;
  const mildLoopB = anxB >= 0.50 && avoidA >= 0.50;

  if (mildLoopA || mildLoopB) {
    return {
      triggered: true,
      severity: 'mild',
      penalty: 0.05,
      gradeCap: 'B-',
      harmonyCap: 0.50,
      flag: 'Attachment Style Polarity',
      details: {
        anxA: Math.round(anxA * 100),
        anxB: Math.round(anxB * 100),
        avoidA: Math.round(avoidA * 100),
        avoidB: Math.round(avoidB * 100),
        explanation: 'Different attachment styles may create occasional pursuer-withdrawer dynamics under stress.'
      }
    };
  }

  return {
    triggered: false,
    details: {
      anxA: Math.round(anxA * 100),
      anxB: Math.round(anxB * 100),
      avoidA: Math.round(avoidA * 100),
      avoidB: Math.round(avoidB * 100)
    }
  };
}

export default detectAnxiousAvoidantLoop;
