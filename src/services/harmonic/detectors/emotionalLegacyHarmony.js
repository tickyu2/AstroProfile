/**
 * Harmonic Detector 41 - Emotional Legacy Harmony
 *
 * Pattern: Partners share a compatible emotional legacy
 *          → unified long-arc contribution → enduring relational meaning
 *
 * This is the Luna mirror of the Solar "Legacy Divergence."
 *
 * This detector identifies when two people:
 * - Envision similar emotional contributions to the world
 * - Share a sense of what their relationship leaves behind
 * - Align on the emotional imprint they want to create (kindness, stability, creativity, healing, transformation, etc.)
 * - Reinforce each other's long-term emotional impact
 * - Build a relationship that radiates outward in coherent ways
 * - Feel that their emotional union has a purpose beyond the present moment
 *
 * It's the signature of relationships where partners say:
 * "We want to leave the same emotional mark on the world."
 * "Our relationship contributes something meaningful."
 * "We're building a legacy together."
 * "Our emotional impact is shared, not separate."
 *
 * This is the Luna-axis of emotional continuity -
 * the sense that the relationship participates in something larger than itself.
 *
 * It emerges when:
 * - Both partners care about similar emotional virtues they want to pass on
 * - Both imagine similar futures for the emotional culture of their relationship
 * - Both feel their bond shapes their communities, families, or creative worlds in aligned ways
 * - Both avoid legacy-collisions (e.g., one wants stability, the other wants disruption)
 * - Both experience their relationship as part of a larger emotional lineage
 * - Both feel their shared emotional impact is coherent and meaningful
 *
 * This is the architecture of shared emotional inheritance.
 */

export function detectEmotionalLegacyHarmony(profileA, profileB) {
  // Legacy vision traits: high Transpersonal, high DepthOriented
  const visionAxes = ["Transpersonal", "DepthOriented"];

  // Emotional contribution traits: high Warm, high Expressive
  const contributionAxes = ["Warm", "Expressive"];

  // Continuity traits: high Sustainer, high Stabilizer
  const continuityAxes = ["Sustainer", "Stabilizer"];

  // Generational impact traits: high Relational, high MindCentered
  const impactAxes = ["Relational", "MindCentered"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_vis = avg(profileA, visionAxes);
  const B_vis = avg(profileB, visionAxes);

  const A_contrib = avg(profileA, contributionAxes);
  const B_contrib = avg(profileB, contributionAxes);

  const A_cont = avg(profileA, continuityAxes);
  const B_cont = avg(profileB, continuityAxes);

  const A_imp = avg(profileA, impactAxes);
  const B_imp = avg(profileB, impactAxes);

  // Harmony patterns: partners share compatible legacy vision, contribution style, continuity, and impact orientation
  const visionHarmony = A_vis >= 0.55 && B_vis >= 0.55;
  const contributionHarmony = A_contrib >= 0.55 && B_contrib >= 0.55;
  const continuityHarmony = A_cont >= 0.55 && B_cont >= 0.55;
  const impactHarmony = A_imp >= 0.55 && B_imp >= 0.55;

  const harmonyCount =
    [visionHarmony, contributionHarmony, continuityHarmony, impactHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.32,
      harmonyBoost: 0.66,
      flag: "emotional-legacy-harmony",
      details: "Emotional Legacy Harmony: Shared Emotional Inheritance and Long-Arc Contribution - Partners leave the same emotional imprint"
    };
  }

  return { triggered: false };
}
