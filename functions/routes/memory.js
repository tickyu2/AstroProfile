/**
 * Memory Architecture Route Module
 *
 * GENESIS Phase 3: RAG pipeline with vector embeddings, facts table, reflection loop.
 * Hybrid-ready: Firestore now, PostgreSQL when scaling.
 *
 * Re-exports from:
 *   memoryFunctions, dualBrainFunctions, sleepConsolidation,
 *   brain1BService, brain8Consolidation, memoryStores, memoryBrain,
 *   voiceFunctions, elevenLabsService, toolChat, agencyFunctions,
 *   contextSummarization, usageFunctions
 */

const { onCall } = require('./shared');

// ---------------------------------------------------------------------------
// Module Imports (paths relative to functions/routes/)
// ---------------------------------------------------------------------------
const memoryFunctions = require('../memory/memoryFunctions');
const dualBrainFunctions = require('../memory/dualBrainFunctions');
const sleepConsolidation = require('../memory/sleepConsolidation');

// 8-Brain Memory Architecture v3.0 (Brain 1B Fact Extraction)
const brain1BService = require('../memory/brain1BService');
const brain8Consolidation = require('../memory/nightlyConsolidation');

// Semantic Search (Brain 2 & Brain 8 Vector Search)
const memoryStores = require('../memory/stores');
const memoryBrain = require('../memory/brain');

const voiceFunctions = require('../voice/voiceFunctions');
const elevenLabsService = require('../voice/elevenLabsService');
const toolChat = require('../tools/toolChat');
const agencyFunctions = require('../agency');
const contextSummarization = require('../memory/contextSummarization');

// Usage & Rate Limiting (Phase 6 - Production Hardening)
const {
  checkUsageLimits,
  getUsageSummary,
  getAdminUsageStats,
  getAdminUserUsage,
  getAdminUserList
} = require('../usage/usageFunctions');

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
module.exports = {
  // --- Core Memory Functions ---
  storeMemory: memoryFunctions.storeMemory,
  retrieveMemories: memoryFunctions.retrieveMemories,
  getFacts: memoryFunctions.getFacts,
  storeFact: memoryFunctions.storeFact,
  getPeople: memoryFunctions.getPeople,
  upsertPerson: memoryFunctions.upsertPerson,
  getHappinessAnchors: memoryFunctions.getHappinessAnchors,
  storeHappinessAnchor: memoryFunctions.storeHappinessAnchor,
  reflectOnConversation: memoryFunctions.reflectOnConversation,
  refineMemories: memoryFunctions.refineMemories,
  getMemoryContext: memoryFunctions.getMemoryContext,
  getPendingQuestions: memoryFunctions.getPendingQuestions,
  markQuestionAnswered: memoryFunctions.markQuestionAnswered,
  // NOTE: getTimelineEvents is in timeline.js (onCall version overrides this re-export)
  // NOTE: Renamed to searchTimelinePG to avoid conflict with newer onCall searchTimeline
  searchTimelinePG: memoryFunctions.searchTimeline,
  getTimelineWithQuestions: memoryFunctions.getTimelineWithQuestions,

  // --- Luna's Brain (SoulPartner's Private Journal & Patterns) ---
  createJournalEntry: memoryFunctions.createJournalEntry,
  getRecentJournalEntries: memoryFunctions.getRecentJournalEntries,
  getEmotionTrends: memoryFunctions.getEmotionTrends,
  storePattern: memoryFunctions.storePattern,
  getPatterns: memoryFunctions.getPatterns,

  // --- Semantic Search (Brain 2 & Brain 8 Vector Search) ---
  searchFacts: memoryStores.searchFacts,
  searchPeople: memoryStores.searchPeople,
  searchJournals: memoryBrain.searchJournals,
  searchPatterns: memoryBrain.searchPatterns,

  // --- Personality Weight Evolution ---
  getPersonalityWeights: memoryFunctions.getPersonalityWeights,
  evolvePersonalityWeights: memoryFunctions.evolvePersonalityWeights,

  // --- Tango Identity System (Relationship Milestones) ---
  initializeRelationship: memoryFunctions.initializeRelationship,
  getRelationshipStats: memoryFunctions.getRelationshipStats,
  updateRelationshipStats: memoryFunctions.updateRelationshipStats,
  celebrateMilestone: memoryFunctions.celebrateMilestone,
  updateLunaState: memoryFunctions.updateLunaState,

  // --- Dual-Brain Memory Architecture ---
  // User's Brain - Short-term
  bufferUserInput: dualBrainFunctions.bufferUserInput,
  getSessionBuffer: dualBrainFunctions.getSessionBuffer,

  // User's Brain - Long-term (Life Timeline)
  storeLifeMemory: dualBrainFunctions.storeLifeMemory,
  searchLifeTimeline: dualBrainFunctions.searchLifeTimeline,
  getMemoriesByChapter: dualBrainFunctions.getMemoriesByChapter,
  getLifeChapterSummary: dualBrainFunctions.getLifeChapterSummary,

  // SoulPartner's Brain - Short-term (Session Observations)
  storeSessionObservation: dualBrainFunctions.storeSessionObservation,
  getSessionObservations: dualBrainFunctions.getSessionObservations,

  // SoulPartner's Brain - Long-term (Interaction Timeline)
  storeInteractionObservation: dualBrainFunctions.storeInteractionObservation,
  searchInteractionTimeline: dualBrainFunctions.searchInteractionTimeline,
  getKeyObservations: dualBrainFunctions.getKeyObservations,

  // SoulPartner's Brain - Pattern Detection
  // NOTE: Renamed to avoid conflict with memoryFunctions.storePattern/getPatterns
  storeDualBrainPattern: dualBrainFunctions.storePattern,
  getDualBrainPatterns: dualBrainFunctions.getPatterns,

  // Unified Dual-Brain Context (main RAG entry point)
  getDualBrainContext: dualBrainFunctions.getDualBrainContext,

  // --- Sleep Consolidation (Nightly Processing) ---
  nightlyConsolidation: sleepConsolidation.nightlyConsolidation,
  manualConsolidation: sleepConsolidation.manualConsolidation,
  getConsolidationStatus: sleepConsolidation.getConsolidationStatus,

  // --- 8-Brain Memory Architecture v3.0 (Brain 1B Fact Extraction) ---
  // Brain 1B Service - Real-time fact processing
  processMessageForFacts: brain1BService.processMessage,
  getBrain1BFacts: brain1BService.getAllFacts,
  getBrain1BFactsByCategory: brain1BService.getFactsByCategory,
  getFactsAboutPerson: brain1BService.getFactsAboutPerson,
  getTodaysFacts: brain1BService.getTodaysFacts,
  searchBrain1BFacts: brain1BService.searchFacts,
  runBrain1BConsolidation: brain1BService.runConsolidation,

  // Brain 2 LTM - Validated facts
  getBrain2Facts: brain1BService.getBrain2Facts,
  getBrain2Relationships: brain1BService.getBrain2Relationships,
  getBrain2LifeStructure: brain1BService.getBrain2LifeStructure,
  buildUserProfileSummary: brain1BService.buildUserProfileSummary,

  // Semantic Search (Vector-based) - 768-dim Gemini embeddings
  searchFactsSemantically: brain1BService.searchFactsSemantically,
  findRelatedFacts: brain1BService.findRelatedFacts,
  checkSemanticDuplicate: brain1BService.checkSemanticDuplicate,

  // Brain 8 Consolidation - Scheduled nightly processing
  brain8NightlyConsolidation: brain8Consolidation.scheduledConsolidation,
  brain8ManualConsolidation: brain8Consolidation.manualConsolidation,

  // --- Luna Voice Interface (Gemini Live Audio) ---
  getVoiceSession: voiceFunctions.getVoiceSession,
  endVoiceSession: voiceFunctions.endVoiceSession,
  getVoiceCapabilities: voiceFunctions.getVoiceCapabilities,
  storeVoiceMemory: voiceFunctions.storeVoiceMemory,
  generateSpeech: voiceFunctions.generateSpeech,

  // --- ElevenLabs Voice Customization (Premium TTS) ---
  getAvailableVoices: elevenLabsService.getAvailableVoices,
  saveVoicePreferences: elevenLabsService.saveVoicePreferences,
  generateSpeechElevenLabs: elevenLabsService.generateSpeechElevenLabs,
  getVoicePreview: elevenLabsService.getVoicePreview,
  getVoiceStreamingSession: elevenLabsService.getVoiceStreamingSession,

  // --- Tool-Enabled Chat (Function Calling) ---
  toolEnabledChat: toolChat.toolEnabledChat,

  // --- Autonomous Agency (Proactive Engagement) ---
  agencyHeartbeat: agencyFunctions.agencyHeartbeat,
  getPendingNotifications: agencyFunctions.getPendingNotifications,
  dismissNotification: agencyFunctions.dismissNotification,
  triggerAgencyCheck: agencyFunctions.triggerAgencyCheck,

  // --- Context Summarization (Memory Compression) ---
  summarizeConversation: contextSummarization.summarizeConversation,
  getStorySoFar: contextSummarization.getStorySoFar,
  getSummaryHistory: contextSummarization.getSummaryHistory,
  checkSummarizationNeeded: contextSummarization.checkSummarizationNeeded,
  refreshSummary: contextSummarization.refreshSummary,

  // --- Usage & Rate Limiting ---
  checkUsageLimits,
  getUsageSummary,
  getAdminUsageStats,
  getAdminUserUsage,
  getAdminUserList,
};
