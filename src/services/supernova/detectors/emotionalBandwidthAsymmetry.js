/**
 * Emotional Bandwidth Asymmetry Detector (21st)
 *
 * Pattern: Partners have dramatically different emotional processing capacity
 * -> one partner overwhelms the other -> chronic capacity mismatch
 *
 * This is the "you have too many feelings for me to handle" pattern.
 * - One has high emotional intensity and complexity
 * - One has limited emotional bandwidth
 * - High-bandwidth partner feels "too much" for the other
 * - Low-bandwidth partner feels overwhelmed and inadequate
 *
 * This is emotional channel capacity mismatch.
 *
 * Trait Indices:
 * - High bandwidth: Warm(11), Relational(2), DepthOriented(13), Expressive(6), Intuitive(4)
 * - Low bandwidth: MindCentered(3), Concrete(5), BoundaryAware(15), Stabilizer(1)
 */

const HIGH_BANDWIDTH_INDICES = [11, 2, 13, 6, 4];    // Warm, Relational, DepthOriented, Expressive, Intuitive
const LOW_BANDWIDTH_INDICES = [3, 5, 15, 1];          // MindCentered, Concrete, BoundaryAware, Stabilizer

export function detectEmotionalBandwidthAsymmetry(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Calculate bandwidth index
  const calcBandwidthIndex = (archetype) => {
    const highBW = HIGH_BANDWIDTH_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / HIGH_BANDWIDTH_INDICES.length;
    const lowBW = LOW_BANDWIDTH_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / LOW_BANDWIDTH_INDICES.length;
    return highBW - lowBW * 0.4;
  };

  const bandwidthA = calcBandwidthIndex(archetypeA);
  const bandwidthB = calcBandwidthIndex(archetypeB);
  const bandwidthDiff = Math.abs(bandwidthA - bandwidthB);

  // Identify high and low bandwidth profiles
  const highBWProfile = bandwidthA > bandwidthB ? 'A' : 'B';
  const lowBWProfile = bandwidthA > bandwidthB ? 'B' : 'A';

  // Detection thresholds
  const SEVERE_ASYMMETRY = 0.50;
  const MODERATE_ASYMMETRY = 0.35;
  const MILD_ASYMMETRY = 0.25;

  if (bandwidthDiff >= SEVERE_ASYMMETRY) {
    return {
      triggered: true,
      severity: 'severe',
      penalty: 0.10,
      gradeCap: 'C',
      harmonyCap: 0.38,
      flag: 'Emotional Bandwidth Asymmetry (Capacity Overload)',
      details: {
        bandwidthA: Math.round(bandwidthA * 100),
        bandwidthB: Math.round(bandwidthB * 100),
        bandwidthDiff: Math.round(bandwidthDiff * 100),
        highBWProfile,
        lowBWProfile,
        explanation: `Profile ${highBWProfile} has high emotional complexity and intensity while Profile ${lowBWProfile} has limited emotional processing capacity. ${highBWProfile} will feel "too much" for ${lowBWProfile}; ${lowBWProfile} will feel chronically overwhelmed.`
      }
    };
  }

  if (bandwidthDiff >= MODERATE_ASYMMETRY) {
    return {
      triggered: true,
      severity: 'moderate',
      penalty: 0.06,
      gradeCap: 'C+',
      harmonyCap: 0.46,
      flag: 'Emotional Capacity Mismatch',
      details: {
        bandwidthA: Math.round(bandwidthA * 100),
        bandwidthB: Math.round(bandwidthB * 100),
        bandwidthDiff: Math.round(bandwidthDiff * 100),
        highBWProfile,
        lowBWProfile,
        explanation: `Partners have different emotional processing capacities. ${highBWProfile} may need to modulate intensity; ${lowBWProfile} may need to expand capacity.`
      }
    };
  }

  if (bandwidthDiff >= MILD_ASYMMETRY) {
    return {
      triggered: true,
      severity: 'mild',
      penalty: 0.03,
      gradeCap: 'B',
      harmonyCap: 0.55,
      flag: 'Emotional Depth Difference',
      details: {
        bandwidthA: Math.round(bandwidthA * 100),
        bandwidthB: Math.round(bandwidthB * 100),
        bandwidthDiff: Math.round(bandwidthDiff * 100),
        explanation: 'Some difference in emotional processing capacity. Manageable with mutual adjustment.'
      }
    };
  }

  return {
    triggered: false,
    details: {
      bandwidthA: Math.round(bandwidthA * 100),
      bandwidthB: Math.round(bandwidthB * 100),
      bandwidthDiff: Math.round(bandwidthDiff * 100)
    }
  };
}

export default detectEmotionalBandwidthAsymmetry;
