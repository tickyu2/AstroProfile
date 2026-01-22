/**
 * ================================================================================
 * DETECTOR #60 — EMOTIONAL HARMONIC ECHO LOOP
 * ================================================================================
 *
 * Second Harmonic Ring — Tenth Chamber (Final)
 *
 * Pattern: Recursive emotional resonance creates self-amplifying loops
 *          → emotional echoes reactivate shadow patterns → endless cycles
 *
 * This detector identifies when two people:
 * - Create emotional resonance that echoes back on itself
 * - Experience emotional patterns that recursively amplify
 * - Feel like emotional issues keep coming back in cycles
 * - Cannot escape recurring emotional dynamics
 * - Experience shadow material that keeps reactivating
 * - Feel trapped in emotional loops that reinforce themselves
 *
 * Signature phrases:
 * - "We keep having the same emotional cycle over and over."
 * - "Our issues echo back no matter what we do."
 * - "Every fight reactivates the same wounds."
 * - "We're trapped in an emotional loop we can't break."
 *
 * This is the echo-loop chamber — the place where emotional resonance
 * becomes recursive and self-perpetuating.
 *
 * Emerges when:
 * - Emotional patterns lack natural dampening
 * - Shadow material is not processed, only suppressed
 * - Resolution attempts fail to break the cycle
 * - Emotional memory keeps reactivating old patterns
 * - The system lacks the capacity to exit recursive loops
 *
 * This is the architecture of recursive emotional entrapment.
 *
 * ================================================================================
 */

/**
 * Archetype vector indices
 */
const TRAIT_INDEX = {
  Initiator: 0,
  Stabilizer: 1,
  BoundaryAware: 2,
  Warm: 3,
  Expressive: 4,
  DepthOriented: 5,
  Resilient: 6,
  Adventurous: 7,
  Relational: 8,
  MindCentered: 9,
  FluidIdentity: 10,
  SystemsOriented: 11,
  Sustainer: 12,
  ShadowAware: 13,
  Transcendent: 14,
  NurtureOriented: 15
};

/**
 * Detect Emotional Harmonic Echo Loop
 *
 * @param {Array<number>} archetypeA - 16-dimensional archetype vector for profile A
 * @param {Array<number>} archetypeB - 16-dimensional archetype vector for profile B
 * @returns {Object} Detection result
 */
export function detectEmotionalHarmonicEchoLoop(archetypeA, archetypeB) {
  // Echo susceptibility axes: tendency for patterns to recur
  const echoAxes = [TRAIT_INDEX.DepthOriented, TRAIT_INDEX.Relational];

  // Dampening axes: ability to prevent recursive amplification
  const dampeningAxes = [TRAIT_INDEX.Stabilizer, TRAIT_INDEX.MindCentered];

  // Resolution axes: ability to break cycles through processing
  const resolutionAxes = [TRAIT_INDEX.ShadowAware, TRAIT_INDEX.Transcendent];

  // Exit axes: capacity to leave recursive loops
  const exitAxes = [TRAIT_INDEX.Resilient, TRAIT_INDEX.Adventurous];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_echo = avg(archetypeA, echoAxes);
  const B_echo = avg(archetypeB, echoAxes);

  const A_damp = avg(archetypeA, dampeningAxes);
  const B_damp = avg(archetypeB, dampeningAxes);

  const A_res = avg(archetypeA, resolutionAxes);
  const B_res = avg(archetypeB, resolutionAxes);

  const A_exit = avg(archetypeA, exitAxes);
  const B_exit = avg(archetypeB, exitAxes);

  // High echo susceptibility: patterns tend to recur
  const highEcho = (A_echo + B_echo) / 2 >= 0.62;

  // Low dampening: recursive amplification not prevented
  const lowDampening = (A_damp + B_damp) / 2 < 0.50;

  // Low resolution: cycles cannot be broken through processing
  const lowResolution = (A_res + B_res) / 2 < 0.48;

  // Low exit: cannot escape recursive loops
  const lowExit = (A_exit + B_exit) / 2 < 0.50;

  // Calculate loop intensity
  const combinedEcho = (A_echo + B_echo) / 2;
  const combinedDampening = (A_damp + B_damp) / 2;
  const loopIntensity = combinedDampening > 0
    ? combinedEcho / combinedDampening
    : 2.0;

  if (highEcho && lowDampening && (lowResolution || lowExit)) {
    const baseSeverity = (lowResolution && lowExit) ? 'critical' : 'severe';

    return {
      triggered: true,
      penalty: 0.56,
      destabilizer: 0.96,
      gradeCap: baseSeverity === 'critical' ? 'D' : 'D+',
      harmonyCap: baseSeverity === 'critical' ? 48 : 53,
      severity: baseSeverity,
      flag: 'Emotional Harmonic Echo Loop (Recursive Emotional Resonance and Shadow Reactivation)',
      details: {
        combinedEcho,
        combinedDampening,
        combinedResolution: (A_res + B_res) / 2,
        combinedExit: (A_exit + B_exit) / 2,
        loopIntensity: loopIntensity.toFixed(2),
        A_metrics: {
          echo: A_echo,
          dampening: A_damp,
          resolution: A_res,
          exit: A_exit
        },
        B_metrics: {
          echo: B_echo,
          dampening: B_damp,
          resolution: B_res,
          exit: B_exit
        }
      }
    };
  }

  return { triggered: false };
}

export default detectEmotionalHarmonicEchoLoop;
