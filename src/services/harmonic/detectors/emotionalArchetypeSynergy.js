/**
 * Harmonic Detector 43 - Emotional Archetype Synergy
 *
 * Pattern: Partners' emotional archetypes reinforce each other
 *          → mutual empowerment → coherent relational mythos
 *
 * This is the Luna mirror of the Solar "Archetype Collision."
 *
 * This detector identifies when two people:
 * - Embody archetypes that naturally complement each other
 * - Activate each other's strengths rather than wounds
 * - Fall into emotional roles that feel balanced, not burdensome
 * - Create a relational dynamic where each archetype enhances the other
 * - Avoid archetypal dominance, collapse, or shadow-triggering
 * - Experience their archetypes as part of a shared emotional ecosystem
 *
 * It's the signature of relationships where partners say:
 * "Your strengths bring out mine."
 * "Our emotional roles fit together."
 * "We activate each other's best selves."
 * "Our archetypes dance instead of collide."
 *
 * This is the Luna-axis of emotional role synergy -
 * the sense that each person's inner characters harmonize with the other's.
 *
 * It emerges when:
 * - Both partners' core archetypes interlock naturally
 * - Both avoid shadow-archetype activation
 * - Both reinforce each other's growth archetypes
 * - Both maintain balance between giving and receiving roles
 * - Both feel emotionally "met" at the archetypal level
 * - Both experience the relationship as a synergistic mythic system
 *
 * This is the architecture of mutual archetypal resonance.
 */

export function detectEmotionalArchetypeSynergy(profileA, profileB) {
  // Core archetype resonance traits: high DepthOriented, high Expressive
  const coreAxes = ["DepthOriented", "Expressive"];

  // Complementarity traits: high Relational, high BoundaryAware
  const complementAxes = ["Relational", "BoundaryAware"];

  // Growth archetype traits: high FluidIdentity, high Warm
  const growthAxes = ["FluidIdentity", "Warm"];

  // Shadow-resilience traits: high Stabilizer, high MindCentered
  const shadowAxes = ["Stabilizer", "MindCentered"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_core = avg(profileA, coreAxes);
  const B_core = avg(profileB, coreAxes);

  const A_comp = avg(profileA, complementAxes);
  const B_comp = avg(profileB, complementAxes);

  const A_growth = avg(profileA, growthAxes);
  const B_growth = avg(profileB, growthAxes);

  const A_shadow = avg(profileA, shadowAxes);
  const B_shadow = avg(profileB, shadowAxes);

  // Harmony patterns: partners share compatible core archetypes, complementarity, growth orientation, and shadow resilience
  const coreHarmony = A_core >= 0.55 && B_core >= 0.55;
  const complementHarmony = A_comp >= 0.55 && B_comp >= 0.55;
  const growthHarmony = A_growth >= 0.55 && B_growth >= 0.55;
  const shadowHarmony = A_shadow >= 0.55 && B_shadow >= 0.55;

  const harmonyCount =
    [coreHarmony, complementHarmony, growthHarmony, shadowHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.32,
      harmonyBoost: 0.70,
      flag: "emotional-archetype-synergy",
      details: "Emotional Archetype Synergy: Mutually Reinforcing Emotional Roles and Archetypal Resonance - Partners activate each other's best selves"
    };
  }

  return { triggered: false };
}
