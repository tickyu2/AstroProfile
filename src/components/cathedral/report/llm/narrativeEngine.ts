/**
 * Cathedral Narrative Engine
 *
 * Generates mythic narratives for clusters, chambers, and the full omniphonic field
 * using the unified LLM layer.
 */

import { routeLLM, LLMRequest, LLMResponse } from './router';
import {
  ClusterData,
  ChamberData,
  OmniphonicFieldData,
  buildClusterPrompt,
  buildClusterSummaryPrompt,
  buildChamberPrompt,
  buildOmniphonicPrompt,
  buildOmniphonicSummaryPrompt,
  buildComparisonPrompt,
  buildSynastryPrompt,
  CLUSTER_ESSENCES
} from './clusterPrompts';

// ============================================================================
// TYPES
// ============================================================================

export interface NarrativeOptions {
  /** Max tokens for generation */
  maxTokens?: number;

  /** Use streaming mode */
  stream?: boolean;

  /** Stream chunk handler */
  onStreamChunk?: (chunk: { textDelta: string; done: boolean }) => void;

  /** Force specific provider */
  provider?: 'openai' | 'azure-openai' | 'anthropic' | 'groq';

  /** Custom metadata for logging */
  metadata?: Record<string, unknown>;
}

export interface NarrativeResult {
  text: string;
  tokensUsed: number;
  latencyMs?: number;
}

// ============================================================================
// CLUSTER NARRATIVES
// ============================================================================

/**
 * Generate a mythic narrative for a single cluster
 */
export async function generateClusterNarrative(
  cluster: ClusterData,
  options: NarrativeOptions = {}
): Promise<NarrativeResult> {
  const prompt = buildClusterPrompt(cluster);

  const request: LLMRequest = {
    mode: 'mythic',
    prompt,
    maxTokens: options.maxTokens ?? 400,
    stream: options.stream,
    onStreamChunk: options.onStreamChunk,
    provider: options.provider,
    metadata: {
      type: 'cluster_narrative',
      cluster: cluster.name,
      ...options.metadata
    }
  };

  const response = await routeLLM(request);

  return {
    text: response.text,
    tokensUsed: response.tokensUsed,
    latencyMs: response.latencyMs
  };
}

/**
 * Generate a short cluster summary
 */
export async function generateClusterSummary(
  cluster: ClusterData,
  options: NarrativeOptions = {}
): Promise<NarrativeResult> {
  const prompt = buildClusterSummaryPrompt(cluster);

  const request: LLMRequest = {
    mode: 'mythic',
    prompt,
    maxTokens: options.maxTokens ?? 150,
    stream: options.stream,
    onStreamChunk: options.onStreamChunk,
    provider: options.provider,
    metadata: {
      type: 'cluster_summary',
      cluster: cluster.name,
      ...options.metadata
    }
  };

  const response = await routeLLM(request);

  return {
    text: response.text,
    tokensUsed: response.tokensUsed,
    latencyMs: response.latencyMs
  };
}

/**
 * Generate narratives for all clusters
 */
export async function generateAllClusterNarratives(
  clusters: ClusterData[],
  options: NarrativeOptions = {}
): Promise<Map<string, NarrativeResult>> {
  const results = new Map<string, NarrativeResult>();

  // Generate in parallel for speed
  const promises = clusters.map(async (cluster) => {
    const result = await generateClusterNarrative(cluster, options);
    return { name: cluster.name, result };
  });

  const settled = await Promise.allSettled(promises);

  for (const outcome of settled) {
    if (outcome.status === 'fulfilled') {
      results.set(outcome.value.name, outcome.value.result);
    }
  }

  return results;
}

// ============================================================================
// CHAMBER NARRATIVES
// ============================================================================

/**
 * Generate a mythic description for a single chamber
 */
export async function generateChamberNarrative(
  chamber: ChamberData,
  options: NarrativeOptions = {}
): Promise<NarrativeResult> {
  const prompt = buildChamberPrompt(chamber);

  const request: LLMRequest = {
    mode: 'mythic',
    prompt,
    maxTokens: options.maxTokens ?? 150,
    stream: options.stream,
    onStreamChunk: options.onStreamChunk,
    provider: options.provider,
    metadata: {
      type: 'chamber_narrative',
      chamber: chamber.name,
      chamberId: chamber.id,
      ...options.metadata
    }
  };

  const response = await routeLLM(request);

  return {
    text: response.text,
    tokensUsed: response.tokensUsed,
    latencyMs: response.latencyMs
  };
}

/**
 * Generate narratives for multiple chambers
 */
export async function generateChamberNarratives(
  chambers: ChamberData[],
  options: NarrativeOptions = {}
): Promise<Map<number, NarrativeResult>> {
  const results = new Map<number, NarrativeResult>();

  // Generate in parallel
  const promises = chambers.map(async (chamber) => {
    const result = await generateChamberNarrative(chamber, options);
    return { id: chamber.id, result };
  });

  const settled = await Promise.allSettled(promises);

  for (const outcome of settled) {
    if (outcome.status === 'fulfilled') {
      results.set(outcome.value.id, outcome.value.result);
    }
  }

  return results;
}

// ============================================================================
// OMNIPHONIC NARRATIVES
// ============================================================================

/**
 * Generate the full omniphonic field narrative
 */
export async function generateOmniphonicNarrative(
  field: OmniphonicFieldData,
  options: NarrativeOptions = {}
): Promise<NarrativeResult> {
  const prompt = buildOmniphonicPrompt(field);

  const request: LLMRequest = {
    mode: 'mythic',
    prompt,
    maxTokens: options.maxTokens ?? 500,
    stream: options.stream,
    onStreamChunk: options.onStreamChunk,
    provider: options.provider,
    metadata: {
      type: 'omniphonic_narrative',
      score: field.omniphonicScore,
      ...options.metadata
    }
  };

  const response = await routeLLM(request);

  return {
    text: response.text,
    tokensUsed: response.tokensUsed,
    latencyMs: response.latencyMs
  };
}

/**
 * Generate a short omniphonic summary
 */
export async function generateOmniphonicSummary(
  score: number,
  dominantCluster: string,
  activeChambers: number,
  options: NarrativeOptions = {}
): Promise<NarrativeResult> {
  const prompt = buildOmniphonicSummaryPrompt(score, dominantCluster, activeChambers);

  const request: LLMRequest = {
    mode: 'mythic',
    prompt,
    maxTokens: options.maxTokens ?? 200,
    stream: options.stream,
    onStreamChunk: options.onStreamChunk,
    provider: options.provider,
    metadata: {
      type: 'omniphonic_summary',
      score,
      dominantCluster,
      ...options.metadata
    }
  };

  const response = await routeLLM(request);

  return {
    text: response.text,
    tokensUsed: response.tokensUsed,
    latencyMs: response.latencyMs
  };
}

// ============================================================================
// COMPARISON NARRATIVES
// ============================================================================

/**
 * Generate a comparison narrative for two omniphonic fields
 */
export async function generateComparisonNarrative(
  fieldA: OmniphonicFieldData,
  fieldB: OmniphonicFieldData,
  personAName: string,
  personBName: string,
  options: NarrativeOptions = {}
): Promise<NarrativeResult> {
  const prompt = buildComparisonPrompt(fieldA, fieldB, personAName, personBName);

  const request: LLMRequest = {
    mode: 'mythic',
    prompt,
    maxTokens: options.maxTokens ?? 400,
    stream: options.stream,
    onStreamChunk: options.onStreamChunk,
    provider: options.provider,
    metadata: {
      type: 'comparison_narrative',
      personA: personAName,
      personB: personBName,
      ...options.metadata
    }
  };

  const response = await routeLLM(request);

  return {
    text: response.text,
    tokensUsed: response.tokensUsed,
    latencyMs: response.latencyMs
  };
}

/**
 * Generate a synastry narrative for relationship harmony
 */
export async function generateSynastryNarrative(
  sharedChambers: ChamberData[],
  uniqueToA: ChamberData[],
  uniqueToB: ChamberData[],
  personAName: string,
  personBName: string,
  options: NarrativeOptions = {}
): Promise<NarrativeResult> {
  const prompt = buildSynastryPrompt(
    sharedChambers,
    uniqueToA,
    uniqueToB,
    personAName,
    personBName
  );

  const request: LLMRequest = {
    mode: 'mythic',
    prompt,
    maxTokens: options.maxTokens ?? 400,
    stream: options.stream,
    onStreamChunk: options.onStreamChunk,
    provider: options.provider,
    metadata: {
      type: 'synastry_narrative',
      personA: personAName,
      personB: personBName,
      sharedCount: sharedChambers.length,
      ...options.metadata
    }
  };

  const response = await routeLLM(request);

  return {
    text: response.text,
    tokensUsed: response.tokensUsed,
    latencyMs: response.latencyMs
  };
}

// ============================================================================
// COMPLETE REPORT NARRATIVE GENERATION
// ============================================================================

export interface CompleteNarrativeResult {
  omniphonic: NarrativeResult;
  clusters: Map<string, NarrativeResult>;
  topChambers?: Map<number, NarrativeResult>;
  totalTokensUsed: number;
  totalLatencyMs: number;
}

/**
 * Generate all narratives for a complete omniphonic report
 */
export async function generateCompleteNarratives(
  field: OmniphonicFieldData,
  options: NarrativeOptions & { includeChamberNarratives?: boolean } = {}
): Promise<CompleteNarrativeResult> {
  const startTime = Date.now();
  let totalTokens = 0;

  // Generate omniphonic narrative
  const omniphonic = await generateOmniphonicNarrative(field, options);
  totalTokens += omniphonic.tokensUsed;

  // Generate all cluster narratives in parallel
  const clusters = await generateAllClusterNarratives(field.clusters, options);
  for (const result of clusters.values()) {
    totalTokens += result.tokensUsed;
  }

  // Optionally generate top chamber narratives
  let topChambers: Map<number, NarrativeResult> | undefined;
  if (options.includeChamberNarratives && field.topChambers) {
    topChambers = await generateChamberNarratives(field.topChambers.slice(0, 5), options);
    for (const result of topChambers.values()) {
      totalTokens += result.tokensUsed;
    }
  }

  const totalLatencyMs = Date.now() - startTime;

  return {
    omniphonic,
    clusters,
    topChambers,
    totalTokensUsed: totalTokens,
    totalLatencyMs
  };
}

// ============================================================================
// FALLBACK NARRATIVES
// ============================================================================

/**
 * Fallback cluster narrative when LLM unavailable
 */
export function getFallbackClusterNarrative(cluster: ClusterData): string {
  const essence = CLUSTER_ESSENCES[cluster.name] ?? 'the essence of connection';
  const strength = cluster.percent >= 60 ? 'strong' : cluster.percent >= 30 ? 'developing' : 'emerging';

  return `The ${cluster.name} cluster shows ${strength} activation with ${cluster.active} of ${cluster.total} chambers resonating. This region of the cathedral embodies ${essence.toLowerCase()} The pattern suggests ${cluster.percent >= 50 ? 'a well-established foundation' : 'room for growth'} in this harmonic family.`;
}

/**
 * Fallback omniphonic narrative when LLM unavailable
 */
export function getFallbackOmniphonicNarrative(field: OmniphonicFieldData): string {
  const strength = field.strengthLabel.toLowerCase();

  if (field.omniphonicScore >= 80) {
    return `This exceptional harmonic field shows strong resonance across ${field.activeChambers} chambers, with particular depth in ${field.dominantCluster} patterns. The ${field.signatureArchetype} archetype anchors the emotional architecture, supporting profound connection and resilient co-becoming.`;
  }
  if (field.omniphonicScore >= 60) {
    return `This ${strength} harmonic field demonstrates meaningful alignment across ${field.activeChambers} chambers, anchored by ${field.dominantCluster} themes. The ${field.signatureArchetype} archetype provides a stable foundation for sustained emotional coherence.`;
  }
  if (field.omniphonicScore >= 40) {
    return `This developing harmonic field shows resonance in ${field.activeChambers} chambers, with emphasis on ${field.dominantCluster} patterns. The ${field.signatureArchetype} archetype offers meaningful anchors for continued growth.`;
  }
  return `This emerging harmonic field has ${field.activeChambers} active chambers, centered on ${field.dominantCluster} themes. The ${field.signatureArchetype} archetype shows initial resonance, with potential for growth through conscious attention.`;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  generateClusterNarrative,
  generateClusterSummary,
  generateAllClusterNarratives,
  generateChamberNarrative,
  generateChamberNarratives,
  generateOmniphonicNarrative,
  generateOmniphonicSummary,
  generateComparisonNarrative,
  generateSynastryNarrative,
  generateCompleteNarratives,
  getFallbackClusterNarrative,
  getFallbackOmniphonicNarrative
};

// Re-export types
export type {
  ClusterData,
  ChamberData,
  OmniphonicFieldData
} from './clusterPrompts';

export { CLUSTER_ESSENCES } from './clusterPrompts';
