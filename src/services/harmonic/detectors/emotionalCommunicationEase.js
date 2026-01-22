/**
 * Harmonic Detector 5 - Emotional Communication Ease
 *
 * Pattern: Partners communicate emotional meaning with natural clarity
 *          → low friction → high mutual understanding
 *
 * This is the Luna mirror of the Solar "Communication Modality Incompatibility"
 * and "Signal Interpretation Drift."
 *
 * This detector identifies when emotional communication feels:
 * - Smooth
 * - Intuitive
 * - Low-effort
 * - Low-translation
 * - High-clarity
 * - Mutually affirming
 *
 * It's the signature of relationships where partners say:
 * "I get what you mean."
 * "You don't have to explain - I understand."
 * "Talking to you feels easy."
 * "We communicate in the same emotional language."
 *
 * This is the Luna-axis of emotional expression -
 * the sense that emotional meaning flows without distortion.
 *
 * It emerges when:
 * - Both partners express emotions in compatible styles
 * - Both interpret tone, timing, and nuance similarly
 * - Both feel understood without over-explaining
 * - Both feel heard without misinterpretation
 * - Both can shift between emotional and practical communication smoothly
 * - Both feel communication is a source of connection, not friction
 *
 * This is the architecture of effortless emotional dialogue.
 */

export function detectEmotionalCommunicationEase(profileA, profileB) {
  // Expressive clarity traits: high Expressive, high Warm
  const clarityAxes = ["Expressive", "Warm"];

  // Interpretive clarity traits: high Relational, high DepthOriented
  const interpretAxes = ["Relational", "DepthOriented"];

  // Communication flow traits: high FluidIdentity, high Initiator, high Sustainer
  const flowAxes = ["FluidIdentity", "Initiator", "Sustainer"];

  // Low-friction traits: low MindCentered, low OrderOriented (less rigid communication)
  const lowFrictionAxes = ["MindCentered", "OrderOriented"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_clarity = avg(profileA, clarityAxes);
  const B_clarity = avg(profileB, clarityAxes);

  const A_interp = avg(profileA, interpretAxes);
  const B_interp = avg(profileB, interpretAxes);

  const A_flow = avg(profileA, flowAxes);
  const B_flow = avg(profileB, flowAxes);

  const A_lowF = 1 - avg(profileA, lowFrictionAxes);
  const B_lowF = 1 - avg(profileB, lowFrictionAxes);

  // Harmony patterns: both partners communicate with compatible clarity, interpretation, and flow
  const clarityHarmony = A_clarity >= 0.55 && B_clarity >= 0.55;
  const interpretHarmony = A_interp >= 0.55 && B_interp >= 0.55;
  const flowHarmony = A_flow >= 0.55 && B_flow >= 0.55;
  const lowFrictionHarmony = A_lowF >= 0.55 && B_lowF >= 0.55;

  const harmonyCount =
    [clarityHarmony, interpretHarmony, flowHarmony, lowFrictionHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.14,
      harmonyBoost: 0.30,
      flag: "emotional-communication-ease",
      details: "Emotional Communication Ease: Effortless Emotional Understanding - Partners communicate in the same emotional language"
    };
  }

  return { triggered: false };
}
