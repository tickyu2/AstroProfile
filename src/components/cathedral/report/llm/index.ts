/**
 * Cathedral LLM Module
 *
 * Multi-provider LLM system with automatic fallback,
 * streaming, token budgeting, and telemetry.
 *
 * Also includes the Narrative Engine for generating mythic
 * cluster, chamber, and omniphonic narratives.
 *
 * Usage:
 *   import { routeLLM, callTechnical, callMythic } from './llm';
 *
 *   // Simple call
 *   const text = await callTechnical('Describe this pattern...');
 *
 *   // Full request
 *   const response = await routeLLM({
 *     mode: 'mythic',
 *     prompt: 'Describe the emotional resonance...',
 *     context: { score: 78.5 },
 *     stream: true,
 *     onStreamChunk: (chunk) => console.log(chunk.textDelta)
 *   });
 *
 *   // Narrative generation
 *   import { generateClusterNarrative, MYTHIC_STYLE_GUIDE } from './llm';
 *   const narrative = await generateClusterNarrative(clusterData);
 */

// Types
export {
  LLMMode,
  LLMRequest,
  LLMResponse,
  LLMStreamChunk,
  LLMStreamHandler,
  ProviderName,
  ProviderArgs,
  ProviderResult,
  ProviderFunction,
  ProviderConfig,
  LLMEvent,
  TokenBudget,
  LLMErrorType,
  LLMError
} from './types';

// Configuration
export {
  MODE_CONFIGS,
  getModeConfig,
  getSystemPrompt,
  BUDGET_LIMITS,
  getBudget,
  consumeBudget,
  checkBudget,
  applyBudget,
  resetBudgets,
  formatContext,
  buildPrompt
} from './config';

// Telemetry
export {
  TelemetryConfig,
  configureTelemetry,
  getMetricsSummary,
  getRecentEvents,
  clearMetrics,
  logLLMEvent,
  createLLMEvent,
  logSuccess,
  logFailure
} from './telemetry';

// Providers
export {
  callOpenAI,
  openaiProvider,
  callAzureOpenAI,
  azureOpenaiProvider,
  callAnthropic,
  anthropicProvider,
  callGroq,
  groqProvider
} from './providers';

// Router
export {
  routeLLM,
  getAvailableProviders,
  getProvider,
  hasAvailableProvider,
  refreshProviders,
  callTechnical,
  callMythic,
  callStream,
  generateOmniphonicSummary,
  callMock,
  enableMockProvider,
  disableMockProvider
} from './router';

// Mythic Style Guide
export {
  MYTHIC_STYLE_GUIDE,
  TECHNICAL_STYLE_GUIDE,
  MYTHIC_CHAMBER_STYLE,
  MYTHIC_SUMMARY_STYLE,
  MYTHIC_CLUSTER_STYLE,
  MYTHIC_OMNIPHONIC_STYLE,
  getStyleGuide,
  getClusterStyleGuide,
  getChamberStyleGuide,
  getOmniphonicStyleGuide
} from './mythicStyleGuide';

// Cluster Prompts
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
} from './clusterPrompts';

export type {
  ChamberData,
  ClusterData,
  OmniphonicFieldData
} from './clusterPrompts';

// Narrative Engine
export {
  generateClusterNarrative,
  generateClusterSummary,
  generateAllClusterNarratives,
  generateChamberNarrative,
  generateChamberNarratives,
  generateOmniphonicNarrative,
  generateOmniphonicSummary as generateNarrativeSummary,
  generateComparisonNarrative,
  generateSynastryNarrative,
  generateCompleteNarratives,
  getFallbackClusterNarrative,
  getFallbackOmniphonicNarrative
} from './narrativeEngine';

export type {
  NarrativeOptions,
  NarrativeResult,
  CompleteNarrativeResult
} from './narrativeEngine';

// Default export
export { routeLLM as default } from './router';
