/**
 * Detector #28: Emotional Forecasting Mismatch
 *
 * Pattern: Partners predict emotional outcomes differently
 * → chronic misalignment → relational instability
 *
 * This is the future-mapping collapse - how each partner models the future emotional landscape.
 *
 * Emerges when:
 * - One partner anticipates emotional expansion, the other anticipates contraction
 * - One expects positive outcomes, the other expects negative or cautious ones
 * - One forecasts growth, the other forecasts risk
 * - One sees possibility, the other sees threat
 */

export function detectEmotionalForecastingMismatch(profileA, profileB) {
  // Optimistic forecasting traits: high Warm, high Expressive, high Initiator, high RiskSeeking
  const optimisticAxes = ["Warm", "Expressive", "Initiator", "RiskSeeking"];

  // Cautious forecasting traits: high BoundaryAware, high Stabilizer, high OrderOriented
  const cautiousAxes = ["BoundaryAware", "Stabilizer", "OrderOriented"];
  const lowExpressiveAxes = ["Expressive"];

  // Emotional projection traits: high DepthOriented, high Transpersonal
  const projectionAxes = ["DepthOriented", "Transpersonal"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_opt = avg(profileA, optimisticAxes);
  const B_opt = avg(profileB, optimisticAxes);

  const A_caut = (avg(profileA, cautiousAxes) + (1 - avg(profileA, lowExpressiveAxes))) / 2;
  const B_caut = (avg(profileB, cautiousAxes) + (1 - avg(profileB, lowExpressiveAxes))) / 2;

  const A_proj = avg(profileA, projectionAxes);
  const B_proj = avg(profileB, projectionAxes);

  // Divergence triggers when one forecasts optimistically and the other cautiously
  const A_opt_B_caut = A_opt >= 0.65 && B_caut >= 0.65;
  const B_opt_A_caut = B_opt >= 0.65 && A_caut >= 0.65;

  // Projection amplifies mismatch
  const projectionAmplifier = (A_proj + B_proj) / 2 >= 0.55;

  if ((A_opt_B_caut || B_opt_A_caut) && projectionAmplifier) {
    return {
      triggered: true,
      severity: 'high',
      penalty: 0.12,
      gradeCap: "C",
      harmonyCap: 0.35,
      flag: "Emotional Forecasting Mismatch",
      details: {
        pattern: "Optimist vs Cautious Forecaster",
        A_optimistic: A_opt.toFixed(2),
        B_optimistic: B_opt.toFixed(2),
        A_cautious: A_caut.toFixed(2),
        B_cautious: B_caut.toFixed(2),
        projectionAmplifier
      }
    };
  }

  return { triggered: false };
}
