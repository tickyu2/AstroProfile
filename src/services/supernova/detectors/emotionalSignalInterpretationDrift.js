/**
 * Detector #32: Emotional Signal Interpretation Drift
 *
 * Pattern: Partners interpret emotional cues differently
 * → chronic misreading → relational instability
 *
 * This is the interpretation collapse - how each partner decodes emotional signals.
 *
 * Emerges when:
 * - One partner interprets emotional cues literally, the other symbolically
 * - One interprets tone as information, the other as emotion
 * - One interprets silence as neutral, the other as withdrawal
 * - One interprets intensity as passion, the other as danger
 */

export function detectEmotionalSignalInterpretationDrift(profileA, profileB) {
  // Literal interpretation traits: high MindCentered, high OrderOriented, high BoundaryAware
  const literalAxes = ["MindCentered", "OrderOriented", "BoundaryAware"];

  // Symbolic interpretation traits: high Transpersonal, high DepthOriented, high FluidIdentity
  const symbolicAxes = ["Transpersonal", "DepthOriented", "FluidIdentity"];

  // Emotional sensitivity traits: high Warm, high Relational
  const sensitivityAxes = ["Warm", "Relational"];

  // Emotional neutrality traits: high Stabilizer, low Expressive
  const neutralityAxes = ["Stabilizer"];
  const lowExpressiveAxes = ["Expressive"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_literal = avg(profileA, literalAxes);
  const B_literal = avg(profileB, literalAxes);

  const A_symbolic = avg(profileA, symbolicAxes);
  const B_symbolic = avg(profileB, symbolicAxes);

  const A_sensitive = avg(profileA, sensitivityAxes);
  const B_sensitive = avg(profileB, sensitivityAxes);

  const A_neutral = (avg(profileA, neutralityAxes) + (1 - avg(profileA, lowExpressiveAxes))) / 2;
  const B_neutral = (avg(profileB, neutralityAxes) + (1 - avg(profileB, lowExpressiveAxes))) / 2;

  // Divergence triggers when partners decode emotional signals differently
  const literalVsSymbolic =
    (A_literal >= 0.65 && B_symbolic >= 0.65) ||
    (B_literal >= 0.65 && A_symbolic >= 0.65);

  const sensitiveVsNeutral =
    (A_sensitive >= 0.65 && B_neutral >= 0.65) ||
    (B_sensitive >= 0.65 && A_neutral >= 0.65);

  const divergenceCount =
    [literalVsSymbolic, sensitiveVsNeutral].filter(Boolean).length;

  if (divergenceCount >= 2) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.12,
      gradeCap: "C",
      harmonyCap: 0.35,
      flag: "Emotional Signal Interpretation Drift",
      details: {
        pattern: "Meaning-Decoding Mismatch",
        A_literal: A_literal.toFixed(2),
        B_literal: B_literal.toFixed(2),
        A_symbolic: A_symbolic.toFixed(2),
        B_symbolic: B_symbolic.toFixed(2),
        literalVsSymbolic,
        sensitiveVsNeutral
      }
    };
  }

  return { triggered: false };
}
