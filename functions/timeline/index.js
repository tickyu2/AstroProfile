/**
 * ============================================================================
 * TIMELINE CONSOLE - MODULE INDEX
 * ============================================================================
 * Central export for all timeline services
 *
 * Created: December 21, 2025
 * Updated: December 22, 2025 - Full Backend Pipeline + pgvector
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

const timelineQueries = require('./timelineQueries');
const summaryGenerator = require('./summaryGenerator');
const biographyExtractor = require('./biographyExtractor');
const timelineLLMEngine = require('./timelineLLMEngine');
const timelinePipeline = require('./timelinePipeline');
const timelineEventStore = require('./timelineEventStore');
const timelineQuestionStore = require('./timelineQuestionStore');
const timelineContext = require('./timelineContext');
const timelineQuestionAnswering = require('./timelineQuestionAnswering');
const timelineEndpoints = require('./timelineEndpoints');

module.exports = {
  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN PIPELINE (Entry Points)
  // ═══════════════════════════════════════════════════════════════════════════

  // Process message → extract → store → questions
  processTimelineForMessage: timelinePipeline.processTimelineForMessage,
  processBatchMessages: timelinePipeline.processBatchMessages,

  // Narrative generation
  generateBiographyNarrative: timelinePipeline.generateBiographyNarrative,
  generateAllPeriodSummaries: timelinePipeline.generateAllPeriodSummaries,

  // Chat integration
  getTimelineContextForChat: timelinePipeline.getTimelineContextForChat,
  formatTimelineForPrompt: timelinePipeline.formatTimelineForPrompt,

  // ═══════════════════════════════════════════════════════════════════════════
  // EVENT STORE (PostgreSQL + pgvector)
  // ═══════════════════════════════════════════════════════════════════════════

  // Person management
  ensurePerson: timelineEventStore.ensurePerson,
  getPerson: timelineEventStore.getPerson,

  // Event operations
  upsertEventsWithDedup: timelineEventStore.upsertEventsWithDedup,
  getEventsForPerson: timelineEventStore.getEventsForPerson,
  searchEventsSemantic: timelineEventStore.searchEventsSemantic,

  // ═══════════════════════════════════════════════════════════════════════════
  // QUESTION STORE (Neural Pathways)
  // ═══════════════════════════════════════════════════════════════════════════

  refreshQuestionsForPerson: timelineQuestionStore.refreshQuestionsForPerson,
  getActiveQuestions: timelineQuestionStore.getActiveQuestions,
  getNextQuestion: timelineQuestionStore.getNextQuestion,
  markQuestionAnswered: timelineQuestionStore.markQuestionAnswered,
  markQuestionSkipped: timelineQuestionStore.markQuestionSkipped,
  getQuestionStats: timelineQuestionStore.getQuestionStats,

  // ═══════════════════════════════════════════════════════════════════════════
  // LLM ENGINE (3-Mode System)
  // ═══════════════════════════════════════════════════════════════════════════

  // Mode 1: Structured Extraction
  llmExtractEvents: timelineLLMEngine.extractEvents,
  // Mode 2: Gap Detection (Neural Pathways)
  llmDetectGaps: timelineLLMEngine.detectGaps,
  // Mode 3: Narrative Generation
  llmGenerateNarrative: timelineLLMEngine.generateNarrative,
  llmGeneratePeriodSummary: timelineLLMEngine.generatePeriodSummary,
  // Mode 4: Question Checking
  llmCheckQuestionAnswered: timelineLLMEngine.checkQuestionAnswered,

  // ═══════════════════════════════════════════════════════════════════════════
  // LEGACY: Firestore-based (for migration compatibility)
  // ═══════════════════════════════════════════════════════════════════════════

  // Re-export all query functions
  ...timelineQueries,

  // Re-export summary generator functions
  generatePeriodSummary: summaryGenerator.generatePeriodSummary,
  generateAllSummaries: summaryGenerator.generateAllSummaries,
  generateYearSummaries: summaryGenerator.generateYearSummaries,
  calculateMetrics: summaryGenerator.calculateMetrics,
  extractHighlights: summaryGenerator.extractHighlights,
  formatPeriodLabel: summaryGenerator.formatPeriodLabel,

  // Biography Extractor (Firestore-based)
  extractLifeEvents: biographyExtractor.extractLifeEvents,
  storeLifeEvent: biographyExtractor.storeLifeEvent,
  getBiographyTimeline: biographyExtractor.getBiographyTimeline,
  getBiographyStats: biographyExtractor.getBiographyStats,
  getNeuralPathways: biographyExtractor.getNeuralPathways,

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTEXT FOR PROMPTS
  // ═══════════════════════════════════════════════════════════════════════════

  getTimelineContext: timelineContext.getTimelineContext,
  getQuestionsContext: timelineContext.getQuestionsContext,
  getFullTimelineContext: timelineContext.getFullTimelineContext,
  formatTimelineContext: timelineContext.formatTimelineContext,

  // ═══════════════════════════════════════════════════════════════════════════
  // QUESTION ANSWERING DETECTION
  // ═══════════════════════════════════════════════════════════════════════════

  processPotentialQuestionAnswer: timelineQuestionAnswering.processPotentialQuestionAnswer,
  processMessagesForAnswers: timelineQuestionAnswering.processMessagesForAnswers,

  // ═══════════════════════════════════════════════════════════════════════════
  // HTTP ENDPOINTS
  // ═══════════════════════════════════════════════════════════════════════════

  endpoints: timelineEndpoints,

  // ═══════════════════════════════════════════════════════════════════════════
  // CONSTANTS
  // ═══════════════════════════════════════════════════════════════════════════

  EVENT_TYPES: timelineLLMEngine.EVENT_TYPES,
  QUESTION_CATEGORIES: timelineLLMEngine.QUESTION_CATEGORIES,
  SIMILARITY_THRESHOLD: timelineEventStore.SIMILARITY_THRESHOLD,
  DISTANCE_THRESHOLD: timelineEventStore.DISTANCE_THRESHOLD
};
