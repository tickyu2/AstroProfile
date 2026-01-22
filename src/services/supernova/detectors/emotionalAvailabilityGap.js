/**
 * Emotional Availability Gap Detector (22nd)
 *
 * Pattern: Partners have dramatically different levels of emotional availability
 * -> one partner is present, the other is distant -> chronic connection deficit
 *
 * This is the "I'm here but you're not" pattern.
 * - One is emotionally present and engaged
 * - One is emotionally unavailable (absorbed in work, inner world, or walls)
 * - Present partner feels lonely despite being in relationship
 * - Unavailable partner feels pressured for more than they can give
 *
 * This is relational presence asymmetry.
 *
 * Trait Indices:
 * - High availability: Warm(11), Relational(2), Sustainer(14), Expressive(6)
 * - Low availability: MindCentered(3), Initiator(0), BoundaryAware(15), Transpersonal(7)
 */

const HIGH_AVAILABILITY_INDICES = [11, 2, 14, 6];     // Warm, Relational, Sustainer, Expressive
const LOW_AVAILABILITY_INDICES = [3, 0, 15, 7];       // MindCentered, Initiator, BoundaryAware, Transpersonal

export function detectEmotionalAvailabilityGap(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Calculate availability index
  const calcAvailabilityIndex = (archetype) => {
    const high = HIGH_AVAILABILITY_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / HIGH_AVAILABILITY_INDICES.length;
    const low = LOW_AVAILABILITY_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / LOW_AVAILABILITY_INDICES.length;
    return high - low * 0.35;
  };

  const availabilityA = calcAvailabilityIndex(archetypeA);
  const availabilityB = calcAvailabilityIndex(archetypeB);
  const availabilityGap = Math.abs(availabilityA - availabilityB);

  // Identify available and unavailable profiles
  const availableProfile = availabilityA > availabilityB ? 'A' : 'B';
  const unavailableProfile = availabilityA > availabilityB ? 'B' : 'A';

  // Check for one high, one low (not just difference)
  const HIGH_THRESHOLD = 0.55;
  const LOW_THRESHOLD = 0.20;
  const polarizedGap =
    (availabilityA >= HIGH_THRESHOLD && availabilityB <= LOW_THRESHOLD) ||
    (availabilityB >= HIGH_THRESHOLD && availabilityA <= LOW_THRESHOLD);

  // Detection thresholds
  const SEVERE_GAP = 0.50;
  const MODERATE_GAP = 0.35;
  const MILD_GAP = 0.25;

  if (polarizedGap && availabilityGap >= SEVERE_GAP) {
    return {
      triggered: true,
      severity: 'severe',
      penalty: 0.12,
      gradeCap: 'C-',
      harmonyCap: 0.32,
      flag: 'Emotional Availability Gap (Chronic Connection Deficit)',
      details: {
        availabilityA: Math.round(availabilityA * 100),
        availabilityB: Math.round(availabilityB * 100),
        availabilityGap: Math.round(availabilityGap * 100),
        availableProfile,
        unavailableProfile,
        explanation: `Profile ${availableProfile} is emotionally present and seeking connection while Profile ${unavailableProfile} is emotionally distant or absorbed elsewhere. ${availableProfile} will feel lonely in the relationship; ${unavailableProfile} will feel pressured.`
      }
    };
  }

  if (availabilityGap >= MODERATE_GAP) {
    return {
      triggered: true,
      severity: 'moderate',
      penalty: 0.07,
      gradeCap: 'C+',
      harmonyCap: 0.44,
      flag: 'Emotional Presence Mismatch',
      details: {
        availabilityA: Math.round(availabilityA * 100),
        availabilityB: Math.round(availabilityB * 100),
        availabilityGap: Math.round(availabilityGap * 100),
        availableProfile,
        unavailableProfile,
        explanation: `Partners have different levels of emotional availability. ${unavailableProfile} may need to increase presence; ${availableProfile} may need to tolerate more space.`
      }
    };
  }

  if (availabilityGap >= MILD_GAP) {
    return {
      triggered: true,
      severity: 'mild',
      penalty: 0.03,
      gradeCap: 'B',
      harmonyCap: 0.55,
      flag: 'Presence Level Difference',
      details: {
        availabilityA: Math.round(availabilityA * 100),
        availabilityB: Math.round(availabilityB * 100),
        availabilityGap: Math.round(availabilityGap * 100),
        explanation: 'Some difference in emotional availability levels. Negotiable with clear communication.'
      }
    };
  }

  return {
    triggered: false,
    details: {
      availabilityA: Math.round(availabilityA * 100),
      availabilityB: Math.round(availabilityB * 100),
      availabilityGap: Math.round(availabilityGap * 100)
    }
  };
}

export default detectEmotionalAvailabilityGap;
