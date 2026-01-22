/**
 * Detector #47: Emotional Temporal Anchoring Divergence
 *
 * Pattern: Partners anchor emotional meaning to different temporal frames
 * → misalignment → relational instability
 *
 * This is the temporal-anchor collapse - the temporal "home base" for understanding emotions.
 *
 * Emerges when:
 * - One partner anchors emotions to the past, the other to the present
 * - One anchors emotions to the future, the other to the moment
 * - One uses temporal continuity ("This fits a pattern")
 * - The other uses temporal isolation ("This is a standalone event")
 */

export function detectEmotionalTemporalAnchoringDivergence(profileA, profileB) {
  // Past-anchored traits: high DepthOriented, high Relational
  const pastAxes = ["DepthOriented", "Relational"];

  // Present-anchored traits: high MindCentered, high Stabilizer
  const presentAxes = ["MindCentered", "Stabilizer"];

  // Future-anchored traits: high Transpersonal, high Initiator
  const futureAxes = ["Transpersonal", "Initiator"];

  // Temporal continuity traits: high OrderOriented
  const continuityAxes = ["OrderOriented"];

  // Temporal isolation traits: high FluidIdentity
  const isolationAxes = ["FluidIdentity"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_past = avg(profileA, pastAxes);
  const B_past = avg(profileB, pastAxes);

  const A_present = avg(profileA, presentAxes);
  const B_present = avg(profileB, presentAxes);

  const A_future = avg(profileA, futureAxes);
  const B_future = avg(profileB, futureAxes);

  const A_cont = avg(profileA, continuityAxes);
  const B_cont = avg(profileB, continuityAxes);

  const A_iso = avg(profileA, isolationAxes);
  const B_iso = avg(profileB, isolationAxes);

  // Divergence patterns:
  const pastVsPresent =
    (A_past >= 0.65 && B_present >= 0.65) ||
    (B_past >= 0.65 && A_present >= 0.65);

  const presentVsFuture =
    (A_present >= 0.65 && B_future >= 0.65) ||
    (B_present >= 0.65 && A_future >= 0.65);

  const continuityVsIsolation =
    (A_cont >= 0.65 && B_iso >= 0.65) ||
    (B_cont >= 0.65 && A_iso >= 0.65);

  const divergenceCount =
    [pastVsPresent, presentVsFuture, continuityVsIsolation].filter(Boolean).length;

  if (divergenceCount >= 2) {
    return {
      triggered: true,
      severity: 'severe',
      penalty: 0.14,
      gradeCap: "C-",
      harmonyCap: 0.30,
      flag: "Emotional Temporal Anchoring Divergence",
      details: {
        pattern: "Past vs Present vs Future Meaning",
        A_past: A_past.toFixed(2),
        B_past: B_past.toFixed(2),
        A_present: A_present.toFixed(2),
        B_present: B_present.toFixed(2),
        pastVsPresent,
        presentVsFuture,
        continuityVsIsolation
      }
    };
  }

  return { triggered: false };
}
