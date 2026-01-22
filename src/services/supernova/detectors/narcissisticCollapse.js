/**
 * Narcissistic Collapse Pattern Detector
 *
 * Pattern: One partner requires admiration + one partner requires emotional safety -> collapse
 * This is NOT a clinical diagnosis. It's a structural pattern:
 * - One partner has high self-narrative dominance
 * - Low empathy, high need for validation
 * - Low repair willingness, high volatility when challenged
 * - Paired with someone who needs emotional consistency -> collapse
 *
 * Trait Indices:
 * - Initiator(0), Expressive(6), Direct(12) = Self-assertion traits
 * - Warm(11), Relational(2) = Empathy traits (low = narcissistic pattern)
 * - RiskSeeking(8), FluidIdentity(10) = Volatility traits
 * - Stabilizer(1), BoundaryAware(15) = Safety-need traits
 */

const SELF_ASSERTION_INDICES = [0, 6, 12];  // Initiator, Expressive, Direct
const EMPATHY_INDICES = [11, 2];             // Warm, Relational
const VOLATILITY_INDICES = [8, 10];          // RiskSeeking, FluidIdentity
const SAFETY_NEED_INDICES = [11, 2, 1, 15];  // Warm, Relational, Stabilizer, BoundaryAware

export function detectNarcissisticCollapse(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Calculate narcissistic index: high self + low empathy + high volatility
  const calcNarcissisticIndex = (archetype) => {
    const selfAssert = SELF_ASSERTION_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / SELF_ASSERTION_INDICES.length;
    const lowEmpathy = EMPATHY_INDICES.reduce((s, i) => s + (1 - (archetype[i] || 0)), 0) / EMPATHY_INDICES.length;
    const volatility = VOLATILITY_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / VOLATILITY_INDICES.length;
    return (selfAssert + lowEmpathy + volatility) / 3;
  };

  // Calculate safety need index
  const calcSafetyNeedIndex = (archetype) => {
    return SAFETY_NEED_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / SAFETY_NEED_INDICES.length;
  };

  const narcA = calcNarcissisticIndex(archetypeA);
  const narcB = calcNarcissisticIndex(archetypeB);
  const safetyA = calcSafetyNeedIndex(archetypeA);
  const safetyB = calcSafetyNeedIndex(archetypeB);

  // Detection thresholds
  const NARC_THRESHOLD = 0.65;
  const SAFETY_THRESHOLD = 0.60;

  // Collapse: One narcissistic pattern + one high safety need
  const collapseA = narcA >= NARC_THRESHOLD && safetyB >= SAFETY_THRESHOLD;
  const collapseB = narcB >= NARC_THRESHOLD && safetyA >= SAFETY_THRESHOLD;

  if (collapseA || collapseB) {
    const narcProfile = collapseA ? 'A' : 'B';
    const safetyProfile = collapseA ? 'B' : 'A';

    return {
      triggered: true,
      severity: 'severe',
      penalty: 0.15,
      gradeCap: 'D',
      harmonyCap: 0.20,
      flag: 'Narcissistic Collapse Pattern (Admiration vs Safety Conflict)',
      details: {
        narcA: Math.round(narcA * 100),
        narcB: Math.round(narcB * 100),
        safetyA: Math.round(safetyA * 100),
        safetyB: Math.round(safetyB * 100),
        narcProfile,
        safetyProfile,
        explanation: `Profile ${narcProfile} has high self-focus with low empathy and volatility. Profile ${safetyProfile} needs emotional safety and consistency. This creates an unresolvable conflict.`
      }
    };
  }

  // Milder form: Moderate narcissistic traits vs moderate safety needs
  const mildCollapseA = narcA >= 0.55 && safetyB >= 0.55;
  const mildCollapseB = narcB >= 0.55 && safetyA >= 0.55;

  if (mildCollapseA || mildCollapseB) {
    return {
      triggered: true,
      severity: 'mild',
      penalty: 0.06,
      gradeCap: 'C+',
      harmonyCap: 0.45,
      flag: 'Self-Focus vs Safety-Need Tension',
      details: {
        narcA: Math.round(narcA * 100),
        narcB: Math.round(narcB * 100),
        safetyA: Math.round(safetyA * 100),
        safetyB: Math.round(safetyB * 100),
        explanation: 'One partner leans toward self-focus while the other needs emotional security. Tension likely under stress.'
      }
    };
  }

  return {
    triggered: false,
    details: {
      narcA: Math.round(narcA * 100),
      narcB: Math.round(narcB * 100),
      safetyA: Math.round(safetyA * 100),
      safetyB: Math.round(safetyB * 100)
    }
  };
}

export default detectNarcissisticCollapse;
