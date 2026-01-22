/**
 * Harmonic Detector 42 - Emotional Mythos Harmony
 *
 * Pattern: Partners share a compatible emotional mythos
 *          → unified symbolic world → deep relational coherence
 *
 * This is the Luna mirror of the Solar "Mythos Divergence."
 *
 * This detector identifies when two people:
 * - Hold compatible inner mythologies (hero, healer, explorer, guardian, creator, etc.)
 * - Interpret the relationship through similar symbolic lenses
 * - Share metaphors, rituals, and emotional archetypes
 * - Co-create a mythic narrative that feels natural to both
 * - Reinforce each other's symbolic identities
 * - Experience the relationship as part of a larger emotional cosmology
 *
 * It's the signature of relationships where partners say:
 * "We live inside the same story."
 * "Our symbols and metaphors match."
 * "We understand each other's inner worlds."
 * "Our relationship has its own mythology."
 *
 * This is the Luna-axis of emotional cosmology -
 * the sense that two emotional universes merge into a shared mythic field.
 *
 * It emerges when:
 * - Both partners resonate with similar archetypes
 * - Both use compatible symbolic languages
 * - Both create rituals that reinforce shared meaning
 * - Both interpret emotional events through aligned mythic frames
 * - Both avoid mythic collisions (e.g., one sees conflict as a battle, the other as a puzzle)
 * - Both experience the relationship as a mythic co-creation
 *
 * This is the architecture of shared emotional mythology.
 */

export function detectEmotionalMythosHarmony(profileA, profileB) {
  // Archetypal resonance traits: high DepthOriented, high Transpersonal
  const archetypeAxes = ["DepthOriented", "Transpersonal"];

  // Symbolic language traits: high Expressive, high FluidIdentity
  const symbolicAxes = ["Expressive", "FluidIdentity"];

  // Ritual coherence traits: high Relational, high Sustainer
  const ritualAxes = ["Relational", "Sustainer"];

  // Mythic interpretation traits: high Warm, high MindCentered
  const interpretationAxes = ["Warm", "MindCentered"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_arch = avg(profileA, archetypeAxes);
  const B_arch = avg(profileB, archetypeAxes);

  const A_sym = avg(profileA, symbolicAxes);
  const B_sym = avg(profileB, symbolicAxes);

  const A_rit = avg(profileA, ritualAxes);
  const B_rit = avg(profileB, ritualAxes);

  const A_int = avg(profileA, interpretationAxes);
  const B_int = avg(profileB, interpretationAxes);

  // Harmony patterns: partners share compatible archetypes, symbols, rituals, and mythic interpretations
  const archetypeHarmony = A_arch >= 0.55 && B_arch >= 0.55;
  const symbolicHarmony = A_sym >= 0.55 && B_sym >= 0.55;
  const ritualHarmony = A_rit >= 0.55 && B_rit >= 0.55;
  const interpretationHarmony = A_int >= 0.55 && B_int >= 0.55;

  const harmonyCount =
    [archetypeHarmony, symbolicHarmony, ritualHarmony, interpretationHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.32,
      harmonyBoost: 0.68,
      flag: "emotional-mythos-harmony",
      details: "Emotional Mythos Harmony: Shared Emotional Cosmology and Symbolic Narrative - Partners live inside the same story"
    };
  }

  return { triggered: false };
}
