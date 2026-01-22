/**
 * Omniphonic Report Module - Index
 *
 * Complete PDF report generation system for the Luna Wing harmonic analysis.
 *
 * Exports:
 * - SVG diagram generator
 * - Report data builders
 * - Pipeline functions
 * - LLM client (Cathedral Oracle) - Legacy single-provider
 * - Multi-provider LLM system (Azure, Anthropic, Groq, OpenAI)
 * - PDF renderer (Playwright-based)
 * - Type definitions
 *
 * HTML/CSS assets are in the same directory:
 * - omniphonic-report.html (Handlebars template)
 * - omniphonic-report.css (Theme-aware styles)
 */

// SVG Diagram Generator
export { buildOmniphonicFieldSvg, default as omniphonicFieldSvg } from './omniphonicFieldSvg';
export type { FieldSvgOptions } from './omniphonicFieldSvg';

// Report Pipeline
export {
  // Main pipeline
  generateOmniphonicReport,
  default as reportPipeline,

  // Data builders
  buildReportData,
  buildClusterView,
  buildDetectorReference,
  renderReportHtml,

  // Helpers
  getStrengthLabel,
  getDominantCluster,
  getSignatureArchetype,
  generateReportId,

  // LLM integration
  generateLLMSummary
} from './reportPipeline';

// LLM Client (Cathedral Oracle)
export {
  callLLM,
  callLLMTechnical,
  callLLMMythic,
  generateOmniphonicSummary,
  setLLMProvider,
  getLLMProvider,
  mockLLMProvider,
  MODE_CONFIGS,
  DEFAULT_SYSTEM_PROMPTS,
  LLMError,
  LLMErrorType
} from './llmClient';

// PDF Renderer
export {
  renderPdf,
  renderOmniphonicReportPdf,
  renderSimplePdf,
  closePdfBrowser,
  isPlaywrightAvailable,
  preparePdfHtml,
  CATHEDRAL_PDF_CONFIG
} from './pdfRenderer';

// Types
export type {
  ReportProfile,
  ReportRequest,
  ReportOptions,
  ReportData,
  HeatmapTemplateCell,
  ClusterTemplateData,
  ChamberTemplateData,
  DetectorTemplateData,
  LLMClient,
  PipelineDependencies
} from './reportPipeline';

export type {
  LLMMode,
  LLMRequest,
  LLMResponse,
  LLMProvider
} from './llmClient';

export type {
  RenderPdfOptions,
  PdfRendererConfig
} from './pdfRenderer';

// Multi-Provider LLM System (NEW - with fallback, streaming, budgeting)
export {
  // Main router
  routeLLM,
  callTechnical,
  callMythic,
  callStream,
  generateOmniphonicSummary as generateOmniphonicSummaryMulti,

  // Provider management
  getAvailableProviders,
  getProvider,
  hasAvailableProvider,
  refreshProviders,

  // Individual providers
  callOpenAI,
  callAzureOpenAI,
  callAnthropic,
  callGroq,

  // Mock provider (testing)
  callMock,
  enableMockProvider,
  disableMockProvider,

  // Configuration
  MODE_CONFIGS as MULTI_MODE_CONFIGS,
  getModeConfig,
  getSystemPrompt,
  BUDGET_LIMITS,
  getBudget,
  checkBudget,
  resetBudgets,

  // Telemetry
  configureTelemetry,
  getMetricsSummary,
  getRecentEvents,
  clearMetrics,
  logSuccess,
  logFailure
} from './llm';

export type {
  LLMStreamChunk,
  LLMStreamHandler,
  ProviderName,
  ProviderArgs,
  ProviderResult,
  ProviderConfig,
  LLMEvent,
  TokenBudget,
  TelemetryConfig
} from './llm';
