/**
 * Harmonic Detector 24 - Emotional Presence Synchrony
 *
 * Pattern: Partners are emotionally present in compatible rhythms
 *          → shared attunement → stable, nourishing connection
 *
 * This is the Luna mirror of the Solar "Presence Availability Gap."
 *
 * This detector identifies when two people:
 * - Show up emotionally at similar times
 * - Maintain presence with compatible consistency
 * - Offer attention and attunement in aligned rhythms
 * - Are available when the other reaches out
 * - Feel "with" each other even in silence
 * - Experience presence as mutual rather than uneven
 *
 * It's the signature of relationships where partners say:
 * "You're here when I need you."
 * "We're present for each other."
 * "Our availability matches."
 * "We meet each other in the moment."
 *
 * This is the Luna-axis of emotional attunement -
 * the sense that presence is shared, not chased.
 *
 * It emerges when:
 * - Both partners maintain emotional availability at similar frequencies
 * - Both respond to emotional bids with similar immediacy
 * - Both hold space for each other in compatible ways
 * - Both feel emotionally reachable and reachable-to
 * - Both experience presence as a shared field
 * - Both feel "together" even without words
 *
 * This is the architecture of synchronized emotional availability.
 */

export function detectEmotionalPresenceSynchrony(profileA, profileB) {
  // Availability traits: high Warm, high Relational
  const availabilityAxes = ["Warm", "Relational"];

  // Attunement traits: high Expressive, high DepthOriented
  const attunementAxes = ["Expressive", "DepthOriented"];

  // Consistency traits: high Sustainer, high Stabilizer
  const consistencyAxes = ["Sustainer", "Stabilizer"];

  // Accessibility traits: high FluidIdentity, high BoundaryAware
  const accessibilityAxes = ["FluidIdentity", "BoundaryAware"];

  function avg(p, axes) {
    return axes.reduce((s, a) => s + Number(p?.raw_traits?.[a] || 0), 0) / axes.length;
  }

  const A_avail = avg(profileA, availabilityAxes);
  const B_avail = avg(profileB, availabilityAxes);

  const A_att = avg(profileA, attunementAxes);
  const B_att = avg(profileB, attunementAxes);

  const A_cons = avg(profileA, consistencyAxes);
  const B_cons = avg(profileB, consistencyAxes);

  const A_acc = avg(profileA, accessibilityAxes);
  const B_acc = avg(profileB, accessibilityAxes);

  // Harmony patterns: partners share compatible availability, attunement, consistency, and accessibility
  const availabilityHarmony = A_avail >= 0.55 && B_avail >= 0.55;
  const attunementHarmony = A_att >= 0.55 && B_att >= 0.55;
  const consistencyHarmony = A_cons >= 0.55 && B_cons >= 0.55;
  const accessibilityHarmony = A_acc >= 0.55 && B_acc >= 0.55;

  const harmonyCount =
    [availabilityHarmony, attunementHarmony, consistencyHarmony, accessibilityHarmony]
      .filter(Boolean).length;

  if (harmonyCount >= 2) {
    return {
      triggered: true,
      bonus: 0.20,
      harmonyBoost: 0.44,
      flag: "emotional-presence-synchrony",
      details: "Emotional Presence Synchrony: Aligned Emotional Availability and Attunement - Partners are present for each other"
    };
  }

  return { triggered: false };
}
