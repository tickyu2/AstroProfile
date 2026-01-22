/**
 * Cathedral Cluster Prompt Generators
 *
 * Per-cluster prompt builders for the Luna Wing narrative engine.
 * Each function produces an LLM-ready prompt that uses the Mythic Style Guide.
 */

import {
  MYTHIC_STYLE_GUIDE,
  MYTHIC_CLUSTER_STYLE,
  MYTHIC_CHAMBER_STYLE,
  MYTHIC_OMNIPHONIC_STYLE,
  MYTHIC_SUMMARY_STYLE
} from './mythicStyleGuide';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Chamber data for prompt generation
 */
export interface ChamberData {
  id: number;
  name: string;
  triggered: boolean;
  harmonyBoost: number;
  bonus: number;
  description?: string;
  family?: string;
}

/**
 * Cluster data for prompt generation
 */
export interface ClusterData {
  name: string;
  active: number;
  total: number;
  percent: number;
  chambers: ChamberData[];
  thematicEssence?: string;
}

/**
 * Omniphonic field data for prompt generation
 */
export interface OmniphonicFieldData {
  omniphonicScore: number;
  activeChambers: number;
  totalChambers: number;
  strengthLabel: string;
  dominantCluster: string;
  signatureArchetype: string;
  clusters: ClusterData[];
  topChambers?: ChamberData[];
}

// ============================================================================
// CLUSTER THEMATIC ESSENCES
// ============================================================================

/**
 * Thematic essence descriptions for each harmonic family
 */
export const CLUSTER_ESSENCES: Record<string, string> = {
  Foundation: 'The bedrock of connection—trust, stability, and the architecture of safety.',
  Flow: 'The movement of emotional exchange—giving, receiving, and the rhythm of mutual care.',
  Communication: 'The bridge of understanding—voice, listening, and the architecture of meaning.',
  Meaning: 'The depth of shared purpose—values, vision, and the architecture of significance.',
  Regulation: 'The balance of emotional climate—calm, stability, and the architecture of peace.',
  Connection: 'The intimacy of presence—closeness, warmth, and the architecture of belonging.',
  Drive: 'The momentum of shared ambition—growth, aspiration, and the architecture of becoming.',
  Repair: 'The resilience of recovery—healing, forgiveness, and the architecture of renewal.',
  Identity: 'The coherence of self—authenticity, recognition, and the architecture of being.',
  Transcendence: 'The expansion beyond self—wonder, awe, and the architecture of the infinite.'
};

// ============================================================================
// CLUSTER PROMPT BUILDERS
// ============================================================================

/**
 * Build a mythic narrative prompt for a single cluster
 */
export function buildClusterPrompt(cluster: ClusterData): string {
  const essence = cluster.thematicEssence ?? CLUSTER_ESSENCES[cluster.name] ?? '';

  const chamberList = cluster.chambers
    .map(c =>
      `• #${c.id}. ${c.name} — ${c.triggered ? 'ACTIVE' : 'dormant'} ` +
      `(harmonyBoost: ${c.harmonyBoost.toFixed(2)}, bonus: ${c.bonus.toFixed(2)})`
    )
    .join('\n');

  return `
${MYTHIC_CLUSTER_STYLE}

---

Write a mythic narrative describing the emotional architecture of the "${cluster.name}" cluster.

CLUSTER ESSENCE:
${essence}

CLUSTER SUMMARY:
- Active chambers: ${cluster.active} / ${cluster.total}
- Activation: ${cluster.percent.toFixed(1)}%

CHAMBERS:
${chamberList}

INSTRUCTIONS:
- Describe the symbolic meaning of this cluster's activation pattern.
- Use mythic metaphors (architecture, resonance, cycles, elements).
- Relate the active chambers to each other as features of a unified region.
- Note dormant chambers as potential spaces, not failures.
- Do not give advice.
- Do not prescribe actions.
- Do not address the reader directly.
- Focus on describing the emotional field as a landscape or structure.
- Write 3-5 sentences.
`.trim();
}

/**
 * Build a short cluster summary prompt
 */
export function buildClusterSummaryPrompt(cluster: ClusterData): string {
  const essence = cluster.thematicEssence ?? CLUSTER_ESSENCES[cluster.name] ?? '';

  return `
${MYTHIC_SUMMARY_STYLE}

---

Summarize the "${cluster.name}" cluster in 2 sentences.
Activation: ${cluster.active}/${cluster.total} chambers (${cluster.percent.toFixed(1)}%)
Essence: ${essence}

Describe what this activation pattern means symbolically. No advice.
`.trim();
}

// ============================================================================
// CHAMBER PROMPT BUILDERS
// ============================================================================

/**
 * Build a mythic description prompt for a single chamber
 */
export function buildChamberPrompt(chamber: ChamberData): string {
  return `
${MYTHIC_CHAMBER_STYLE}

---

Write a mythic description of this harmony chamber:

Chamber #${chamber.id}: "${chamber.name}"
Status: ${chamber.triggered ? 'ACTIVE' : 'Dormant'}
Harmony Boost: ${chamber.harmonyBoost.toFixed(2)}
Bonus: ${chamber.bonus.toFixed(2)}
${chamber.family ? `Family: ${chamber.family}` : ''}
${chamber.description ? `Description: ${chamber.description}` : ''}

INSTRUCTIONS:
- Describe what this chamber represents symbolically.
- If active, describe what its activation means in the emotional field.
- If dormant, describe it as a potential space, not a failure.
- Use architectural and elemental metaphors.
- No advice, no prescriptions.
- Write 2-3 sentences.
`.trim();
}

/**
 * Build a short chamber label prompt
 */
export function buildChamberLabelPrompt(chamber: ChamberData): string {
  return `
Write a 3-5 word mythic label for this harmony chamber:
"${chamber.name}" — ${chamber.triggered ? 'active' : 'dormant'}

Style: symbolic, archetypal, concise. No advice.
`.trim();
}

// ============================================================================
// OMNIPHONIC PROMPT BUILDERS
// ============================================================================

/**
 * Build the full omniphonic narrative prompt
 */
export function buildOmniphonicPrompt(field: OmniphonicFieldData): string {
  const clusterSummaries = field.clusters
    .map(c => `• ${c.name}: ${c.active}/${c.total} active (${c.percent.toFixed(1)}%)`)
    .join('\n');

  const topChamberList = field.topChambers
    ?.slice(0, 5)
    .map(c => `• #${c.id}. ${c.name} (boost: ${c.harmonyBoost.toFixed(2)})`)
    .join('\n') ?? 'Not provided';

  return `
${MYTHIC_OMNIPHONIC_STYLE}

---

Write a mythic narrative describing the full Omniphonic Harmony Field.

FIELD OVERVIEW:
- Omniphonic Score: ${field.omniphonicScore.toFixed(1)} / 100
- Strength: ${field.strengthLabel}
- Active Chambers: ${field.activeChambers} / ${field.totalChambers}
- Dominant Cluster: ${field.dominantCluster}
- Signature Archetype: ${field.signatureArchetype}

CLUSTER ACTIVATIONS:
${clusterSummaries}

TOP RESONANCE CHAMBERS:
${topChamberList}

INSTRUCTIONS:
- Describe the cathedral as a unified harmonic field.
- Show how the clusters relate to each other as harmonic families.
- Use the omniphonic score as a measure of total resonance.
- Describe the signature archetype as the field's dominant voice.
- Close with an integrative statement about the whole architecture.
- Do not give advice.
- Do not prescribe actions.
- Write 4-6 sentences.
`.trim();
}

/**
 * Build a short omniphonic summary prompt
 */
export function buildOmniphonicSummaryPrompt(
  score: number,
  dominantCluster: string,
  activeChambers: number
): string {
  return `
${MYTHIC_SUMMARY_STYLE}

---

Score: ${score.toFixed(1)} / 100
Dominant harmonic family: ${dominantCluster}
Active chambers: ${activeChambers} / 50

Write 2-3 concise sentences describing this emotional harmony field.
Do not give advice. Do not prescribe actions.
Focus on what the field shows, not what should be done.
`.trim();
}

// ============================================================================
// SPECIALIZED PROMPT BUILDERS
// ============================================================================

/**
 * Build a comparison prompt for two fields
 */
export function buildComparisonPrompt(
  fieldA: OmniphonicFieldData,
  fieldB: OmniphonicFieldData,
  personAName: string,
  personBName: string
): string {
  return `
${MYTHIC_STYLE_GUIDE}

---

Compare the harmonic fields of ${personAName} and ${personBName}.

${personAName.toUpperCase()}:
- Omniphonic Score: ${fieldA.omniphonicScore.toFixed(1)}
- Dominant Cluster: ${fieldA.dominantCluster}
- Active Chambers: ${fieldA.activeChambers}

${personBName.toUpperCase()}:
- Omniphonic Score: ${fieldB.omniphonicScore.toFixed(1)}
- Dominant Cluster: ${fieldB.dominantCluster}
- Active Chambers: ${fieldB.activeChambers}

INSTRUCTIONS:
- Describe where the two fields resonate together.
- Describe where they differ in architecture.
- Use mythic metaphors (resonance, harmony, architecture).
- Do not give advice.
- Do not prescribe actions.
- Write 4-5 sentences.
`.trim();
}

/**
 * Build a synastry prompt for relationship harmony
 */
export function buildSynastryPrompt(
  sharedChambers: ChamberData[],
  uniqueToA: ChamberData[],
  uniqueToB: ChamberData[],
  personAName: string,
  personBName: string
): string {
  const sharedList = sharedChambers
    .map(c => `• #${c.id}. ${c.name}`)
    .join('\n') || 'None';

  const uniqueAList = uniqueToA
    .map(c => `• #${c.id}. ${c.name}`)
    .join('\n') || 'None';

  const uniqueBList = uniqueToB
    .map(c => `• #${c.id}. ${c.name}`)
    .join('\n') || 'None';

  return `
${MYTHIC_STYLE_GUIDE}

---

Describe the harmonic synastry between ${personAName} and ${personBName}.

SHARED CHAMBERS (both active):
${sharedList}

UNIQUE TO ${personAName.toUpperCase()}:
${uniqueAList}

UNIQUE TO ${personBName.toUpperCase()}:
${uniqueBList}

INSTRUCTIONS:
- Describe the shared chambers as points of natural resonance.
- Describe unique chambers as complementary offerings.
- Use architectural metaphors (bridges, gateways, shared foundations).
- Do not give advice.
- Write 4-5 sentences.
`.trim();
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  buildClusterPrompt,
  buildClusterSummaryPrompt,
  buildChamberPrompt,
  buildChamberLabelPrompt,
  buildOmniphonicPrompt,
  buildOmniphonicSummaryPrompt,
  buildComparisonPrompt,
  buildSynastryPrompt,
  CLUSTER_ESSENCES
};
