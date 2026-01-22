/**
 * Avoidant-Avoidant Freeze Detector
 *
 * Pattern: Two partners who both deactivate under stress -> relationship enters emotional stasis
 * This is the "silent implosion" pattern.
 * No explosions. No fights. Just... nothing.
 * The relationship freezes because neither partner initiates repair.
 *
 * Trait Indices:
 * - MindCentered(3), BoundaryAware(15) = Avoidant high traits
 * - Warm(11), Relational(2) = Connection traits (low = avoidant)
 */

const AVOIDANT_HIGH_INDICES = [3, 15];  // MindCentered, BoundaryAware
const CONNECTION_INDICES = [11, 2];      // Warm, Relational

export function detectAvoidantAvoidantFreeze(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Calculate avoidant score: high avoidant traits + low connection traits
  const calcAvoidantScore = (archetype) => {
    const avoidHigh = AVOIDANT_HIGH_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / AVOIDANT_HIGH_INDICES.length;
    const lowConnect = CONNECTION_INDICES.reduce((s, i) => s + (1 - (archetype[i] || 0)), 0) / CONNECTION_INDICES.length;
    return (avoidHigh + lowConnect) / 2;
  };

  const avoidA = calcAvoidantScore(archetypeA);
  const avoidB = calcAvoidantScore(archetypeB);

  // Both partners highly avoidant
  const AVOIDANT_THRESHOLD = 0.60;
  const bothAvoidant = avoidA >= AVOIDANT_THRESHOLD && avoidB >= AVOIDANT_THRESHOLD;

  if (bothAvoidant) {
    return {
      triggered: true,
      severity: 'moderate',
      penalty: 0.08,
      gradeCap: 'C',
      harmonyCap: 0.35,
      flag: 'Avoidant-Avoidant Freeze (Emotional Stasis)',
      details: {
        avoidA: Math.round(avoidA * 100),
        avoidB: Math.round(avoidB * 100),
        explanation: 'Both partners deactivate under stress. Neither initiates repair. The relationship enters emotional stasis - no explosions, but no connection either.'
      }
    };
  }

  // Milder form: Both moderately avoidant
  const mildAvoidant = avoidA >= 0.50 && avoidB >= 0.50;
  if (mildAvoidant) {
    return {
      triggered: true,
      severity: 'mild',
      penalty: 0.04,
      gradeCap: 'B-',
      harmonyCap: 0.50,
      flag: 'Mutual Emotional Distance',
      details: {
        avoidA: Math.round(avoidA * 100),
        avoidB: Math.round(avoidB * 100),
        explanation: 'Both partners tend toward emotional distance. May struggle with intimacy and repair.'
      }
    };
  }

  return {
    triggered: false,
    details: {
      avoidA: Math.round(avoidA * 100),
      avoidB: Math.round(avoidB * 100)
    }
  };
}

export default detectAvoidantAvoidantFreeze;
