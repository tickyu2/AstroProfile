/**
 * Detector #45: Emotional Meaning-Making Framework Divergence
 *
 * Pattern: Partners use different frameworks to interpret emotional experiences
 * → incompatible meaning → relational instability
 *
 * This is the meaning-making collapse - the deep architecture that gives emotions meaning.
 *
 * Emerges when:
 * - One partner interprets emotions through a psychological lens, the other through a moral lens
 * - One interprets conflict as growth, the other as danger
 * - One interprets vulnerability as connection, the other as instability
 * - One interprets emotional intensity as authenticity, the other as dysregulation
 */

export function detectEmotionalMeaningMakingFrameworkDivergence(profileA, profileB) {
  // Psychological meaning-making: high DepthOriented, high Relational, high Expressive
  const psychAxes = ["DepthOriented", "Relational", "Expressive"];

  // Moral/structural meaning-making: high OrderOriented, high BoundaryAware, high Stabilizer
  const moralAxes = ["OrderOriented", "BoundaryAware", "Stabilizer"];

  // Existential meaning-making: high Transpersonal, high FluidIdentity
  const existentialAxes = ["Transpersonal", "FluidIdentity"];

  // Pragmatic meaning-making: high MindCentered, high Initiator
  const pragmaticAxes = ["MindCentered", "Initiator"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_psych = avg(profileA, psychAxes);
  const B_psych = avg(profileB, psychAxes);

  const A_moral = avg(profileA, moralAxes);
  const B_moral = avg(profileB, moralAxes);

  const A_exist = avg(profileA, existentialAxes);
  const B_exist = avg(profileB, existentialAxes);

  const A_prag = avg(profileA, pragmaticAxes);
  const B_prag = avg(profileB, pragmaticAxes);

  // Divergence patterns:
  const psychVsMoral =
    (A_psych >= 0.65 && B_moral >= 0.65) ||
    (B_psych >= 0.65 && A_moral >= 0.65);

  const existentialVsPragmatic =
    (A_exist >= 0.65 && B_prag >= 0.65) ||
    (B_exist >= 0.65 && A_prag >= 0.65);

  const divergenceCount =
    [psychVsMoral, existentialVsPragmatic].filter(Boolean).length;

  if (divergenceCount >= 2) {
    return {
      triggered: true,
      severity: 'severe',
      penalty: 0.14,
      gradeCap: "C-",
      harmonyCap: 0.30,
      flag: "Emotional Meaning-Making Framework Divergence",
      details: {
        pattern: "Different Emotional Interpretive Systems",
        A_psychological: A_psych.toFixed(2),
        B_psychological: B_psych.toFixed(2),
        A_moral: A_moral.toFixed(2),
        B_moral: B_moral.toFixed(2),
        psychVsMoral,
        existentialVsPragmatic
      }
    };
  }

  return { triggered: false };
}
