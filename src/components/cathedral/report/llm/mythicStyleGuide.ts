/**
 * Cathedral Mythic Style Guide
 *
 * Reusable prompt block that guarantees tone, symbolism, and narrative
 * coherence across all LLM calls in the Luna Wing.
 *
 * Usage:
 *   const prompt = `${MYTHIC_STYLE_GUIDE}\n\nWrite a narrative for...`;
 */

// ============================================================================
// MYTHIC STYLE GUIDE
// ============================================================================

/**
 * Canonical mythic style guide for all narrative LLM calls.
 * Ensures consistent tone, imagery, and voice across the cathedral.
 */
export const MYTHIC_STYLE_GUIDE = `
You are writing in the Cathedral Mythic Narrative style.

TONE:
- Symbolic, ceremonial, archetypal
- Neutral, descriptive, non-prescriptive
- No advice, no instructions, no should/ought language
- Mythic clarity without mystification

IMAGERY:
- Use elemental metaphors (stone, flame, tide, wind, mirror)
- Use architectural metaphors (chambers, arches, thresholds, resonance fields)
- Use cyclical metaphors (seasons, tides, spirals, orbits)
- Use celestial metaphors (constellations, harmonics, luminance)

VOICE:
- Calm, steady, observant
- Describes patterns without judging them
- Speaks as if mapping an inner landscape
- Third-person observational perspective

STRUCTURE:
- Begin with a framing sentence
- Describe the pattern in 2–4 symbolic images
- Close with a single integrative line

PROHIBITIONS:
- No advice
- No predictions
- No moralizing
- No therapy language
- No second-person instructions
- No "you should" or "you could"
- No future-tense prescriptions

PURPOSE:
- Illuminate the emotional architecture
- Reveal symbolic coherence
- Describe resonance without prescribing action
- Map the field as it exists, not as it "should" be
`.trim();

// ============================================================================
// TECHNICAL STYLE GUIDE
// ============================================================================

/**
 * Technical style guide for analytical LLM calls.
 * For factual, concise, literal descriptions.
 */
export const TECHNICAL_STYLE_GUIDE = `
You are writing in the Cathedral Technical style.

TONE:
- Precise, analytical, factual
- Neutral, objective, non-evaluative
- No metaphor, no flowery language
- Direct and accurate

FORMAT:
- Use clear, simple sentences
- Present data in structured form
- Use percentages, ratios, and concrete descriptors
- Be concise—no unnecessary elaboration

VOICE:
- Clinical, observational
- Describes measurements and patterns
- Avoids interpretation beyond the data

PROHIBITIONS:
- No advice or recommendations
- No emotional language
- No subjective assessments
- No future predictions

PURPOSE:
- Present data clearly
- Describe patterns accurately
- Provide factual foundation for analysis
`.trim();

// ============================================================================
// STYLE GUIDE VARIANTS
// ============================================================================

/**
 * Shorter mythic style for chamber-level descriptions
 */
export const MYTHIC_CHAMBER_STYLE = `
Write in mythic style: symbolic, archetypal, non-prescriptive.
Use elemental and architectural metaphors.
Describe the pattern in 2-3 sentences.
No advice. No predictions. No second-person.
`.trim();

/**
 * Shorter mythic style for single-paragraph summaries
 */
export const MYTHIC_SUMMARY_STYLE = `
Write in mythic style: symbolic, archetypal, non-prescriptive.
Use elemental metaphors (stone, flame, tide, wind).
Use architectural metaphors (chambers, arches, resonance).
Describe the pattern in 2-3 sentences.
No advice. No predictions.
`.trim();

/**
 * Style guide for cluster narratives
 */
export const MYTHIC_CLUSTER_STYLE = `
${MYTHIC_STYLE_GUIDE}

CLUSTER NARRATIVE SPECIFICS:
- Describe the cluster as a region or wing of the cathedral
- Relate chambers to each other as architectural features
- Use the cluster's thematic essence as an anchor metaphor
- Show how activation patterns create a coherent resonance field
`.trim();

/**
 * Style guide for the overall omniphonic narrative
 */
export const MYTHIC_OMNIPHONIC_STYLE = `
${MYTHIC_STYLE_GUIDE}

OMNIPHONIC NARRATIVE SPECIFICS:
- Describe the full cathedral as a unified harmonic field
- Show how clusters relate to each other as harmonic families
- Use the omniphonic score as a measure of total resonance
- Describe the signature archetype as the field's dominant voice
- Close with an integrative statement about the whole architecture
`.trim();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get style guide for a given mode
 */
export function getStyleGuide(mode: 'technical' | 'mythic'): string {
  return mode === 'mythic' ? MYTHIC_STYLE_GUIDE : TECHNICAL_STYLE_GUIDE;
}

/**
 * Get cluster-specific style guide
 */
export function getClusterStyleGuide(): string {
  return MYTHIC_CLUSTER_STYLE;
}

/**
 * Get chamber-specific style guide
 */
export function getChamberStyleGuide(): string {
  return MYTHIC_CHAMBER_STYLE;
}

/**
 * Get omniphonic-specific style guide
 */
export function getOmniphonicStyleGuide(): string {
  return MYTHIC_OMNIPHONIC_STYLE;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default MYTHIC_STYLE_GUIDE;
