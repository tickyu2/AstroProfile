/**
 * Harmonic Detector 38 - Emotional Purpose Alignment
 *
 * Pattern: Partners share compatible emotional purposes
 *          → unified direction → stable long-arc relational coherence
 *
 * This is the Luna mirror of the Solar "Purpose Divergence."
 *
 * This detector identifies when two people:
 * - Hold similar emotional intentions for the relationship
 * - Share a deeper "why" behind closeness, commitment, and connection
 * - Pursue emotional growth in compatible ways
 * - Align on the emotional purpose of partnership (healing, expansion, stability, creation, exploration, devotion, etc.)
 * - Reinforce each other's emotional mission rather than conflict with it
 * - Feel like they are moving toward the same emotional horizon
 *
 * It's the signature of relationships where partners say:
 * "We're in this for the same reasons."
 * "Our emotional goals align."
 * "We're building the same kind of life."
 * "Our deeper purpose feels shared."
 *
 * This is the Luna-axis of emotional directionality -
 * the sense that the relationship has a unified emotional mission.
 *
 * It emerges when:
 * - Both partners seek similar emotional outcomes (growth, safety, intimacy, meaning)
 * - Both value similar emotional virtues (honesty, depth, stability, exploration)
 * - Both pursue emotional development in compatible ways
 * - Both feel the relationship supports their deeper emotional purpose
 * - Both avoid purpose-clashes that destabilize the long arc
 * - Both experience the relationship as a shared emotional path
 *
 * This is the architecture of aligned emotional destiny.
 */

export function detectEmotionalPurposeAlignment(profileA, profileB) {
  // Purpose orientation traits: high DepthOriented, high Transpersonal
  const purposeAxes = ["DepthOriented", "Transpersonal"];

  // Emotional mission traits: high Relational, high Sustainer
  const missionAxes = ["Relational", "Sustainer"];

  // Growth orientation traits: high FluidIdentity, high Expressive
  const growthAxes = ["FluidIdentity", "Expressive"];

  // Directional stability traits: high Stabilizer, high MindCentered
  const stabilityAxes = ["Stabilizer", "MindCentered"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_purp = avg(profileA, purposeAxes);
  const B_purp = avg(profileB, purposeAxes);

  const A_miss = avg(profileA, missionAxes);
  const B_miss = avg(profileB, missionAxes);

  const A_growth = avg(profileA, growthAxes);
  const B_growth = avg(profileB, growthAxes);

  const A_stab = avg(profileA, stabilityAxes);
  const B_stab = avg(profileB, stabilityAxes);

  // Harmony patterns: partners share compatible purpose, mission, growth orientation, and directional stability
  const purposeHarmony = A_purp >= 0.55 && B_purp >= 0.55;
  const missionHarmony = A_miss >= 0.55 && B_miss >= 0.55;
  const growthHarmony = A_growth >= 0.55 && B_growth >= 0.55;
  const stabilityHarmony = A_stab >= 0.55 && B_stab >= 0.55;

  const harmonyCount =
    [purposeHarmony, missionHarmony, growthHarmony, stabilityHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.30,
      harmonyBoost: 0.62,
      flag: "emotional-purpose-alignment",
      details: "Emotional Purpose Alignment: Shared Emotional Mission and Unified Relational Direction - Partners move toward the same horizon"
    };
  }

  return { triggered: false };
}
