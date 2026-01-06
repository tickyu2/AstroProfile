/**
 * ============================================================================
 * GENESIS LUNA - MEMORY MODULE INDEX
 * ============================================================================
 * Central exports for all memory-related functionality.
 *
 * Architecture (after modularization):
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        MEMORY MODULE STRUCTURE                          │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────────┐│
 * │  │                    USER'S BRAIN (stores/)                           ││
 * │  │  memoryStore │ factsStore │ peopleStore │ anchorStore              ││
 * │  │  questionsStore │ timelineStore                                     ││
 * │  └─────────────────────────────────────────────────────────────────────┘│
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────────┐│
 * │  │                    LUNA'S BRAIN (brain/)                            ││
 * │  │  journalStore │ patternsStore │ emotionTrends                      ││
 * │  └─────────────────────────────────────────────────────────────────────┘│
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────────┐│
 * │  │                    PERSONALITY (personality/)                        ││
 * │  │  personalityWeights │ sovereignty                                   ││
 * │  └─────────────────────────────────────────────────────────────────────┘│
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────────┐│
 * │  │                    TANGO (tango/)                                    ││
 * │  │  relationshipStore (birthday, milestones, bond levels)              ││
 * │  └─────────────────────────────────────────────────────────────────────┘│
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────────┐│
 * │  │                    ANALYSIS (analysis/)                              ││
 * │  │  reflectionEngine │ constitutionalAnalysis                          ││
 * │  └─────────────────────────────────────────────────────────────────────┘│
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────────┐│
 * │  │                    ORCHESTRATOR                                      ││
 * │  │  getMemoryContext │ buildMemoryPrompt                               ││
 * │  └─────────────────────────────────────────────────────────────────────┘│
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

// ============================================================================
// MODULAR IMPORTS (NEW - USE THESE)
// ============================================================================

// Stores (User's Brain)
let stores;
try {
  stores = require('./stores');
} catch (e) {
  console.warn('[Memory] stores not available:', e.message);
  stores = {};
}

// Brain (Luna's Private Memory)
let brain;
try {
  brain = require('./brain');
} catch (e) {
  console.warn('[Memory] brain not available:', e.message);
  brain = {};
}

// Personality & Sovereignty
let personality;
try {
  personality = require('./personality');
} catch (e) {
  console.warn('[Memory] personality not available:', e.message);
  personality = {};
}

// Tango (Relationship System)
let tango;
try {
  tango = require('./tango');
} catch (e) {
  console.warn('[Memory] tango not available:', e.message);
  tango = {};
}

// Analysis (Reflection & Constitutional)
let analysis;
try {
  analysis = require('./analysis');
} catch (e) {
  console.warn('[Memory] analysis not available:', e.message);
  analysis = {};
}

// Orchestrator
let orchestrator;
try {
  orchestrator = require('./orchestrator');
} catch (e) {
  console.warn('[Memory] orchestrator not available:', e.message);
  orchestrator = {};
}

// ============================================================================
// LEGACY IMPORTS (FOR BACKWARDS COMPATIBILITY)
// ============================================================================

// Scoring utilities
const scoringUtils = require('./scoringUtils');

// Three-tier memory architecture
let clarifiedMemory;
try {
  clarifiedMemory = require('./clarifiedMemoryArchitecture');
} catch (e) {
  clarifiedMemory = {};
}

// Consolidation engines
let consolidationEngine, sleepConsolidation;
try {
  consolidationEngine = require('./consolidationEngineV2');
} catch (e) { consolidationEngine = {}; }
try {
  sleepConsolidation = require('./sleepConsolidation');
} catch (e) { sleepConsolidation = {}; }

// Hybrid retrieval
let hybridRetrieval;
try {
  hybridRetrieval = require('./hybridRetrieval');
} catch (e) { hybridRetrieval = {}; }

// Processing
let semanticChunker, constitutionalTagger;
try {
  semanticChunker = require('./semanticChunker');
} catch (e) { semanticChunker = {}; }
try {
  constitutionalTagger = require('./constitutionalTagger');
} catch (e) { constitutionalTagger = {}; }

// Anchors
let anchorDetector, anchorRetrieval;
try {
  anchorDetector = require('./anchorDetector');
  anchorRetrieval = require('./anchorRetrieval');
} catch (e) { anchorDetector = {}; anchorRetrieval = {}; }

// ============================================================================
// BRAIN 1B FACT EXTRACTION (NEW - 8-Brain Architecture v3.0)
// ============================================================================

// Fact Extractor - Core extraction logic
let factExtractor;
try {
  factExtractor = require('./factExtractor');
} catch (e) {
  console.warn('[Memory] factExtractor not available:', e.message);
  factExtractor = {};
}

// Brain 1B Service - Firebase operations for facts STM
let brain1BService;
try {
  brain1BService = require('./brain1BService');
} catch (e) {
  console.warn('[Memory] brain1BService not available:', e.message);
  brain1BService = {};
}

// Nightly Consolidation - 8-Brain consolidation engine
let nightlyConsolidation;
try {
  nightlyConsolidation = require('./nightlyConsolidation');
} catch (e) {
  console.warn('[Memory] nightlyConsolidation not available:', e.message);
  nightlyConsolidation = {};
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // ═══════════════════════════════════════════════════════════════════════
  // NEW MODULAR EXPORTS (USE THESE FOR NEW CODE)
  // ═══════════════════════════════════════════════════════════════════════

  // Stores (User's Brain)
  ...stores,

  // Brain (Luna's Private Memory)
  ...brain,

  // Personality & Sovereignty
  ...personality,

  // Tango (Relationship System)
  ...tango,

  // Analysis (Reflection & Constitutional)
  ...analysis,

  // Orchestrator
  getMemoryContext: orchestrator.getMemoryContext,
  buildMemoryPrompt: orchestrator.buildMemoryPrompt,

  // ═══════════════════════════════════════════════════════════════════════
  // LEGACY EXPORTS (BACKWARDS COMPATIBILITY)
  // ═══════════════════════════════════════════════════════════════════════

  // Scoring utilities
  ...scoringUtils,

  // Three-tier memory
  ...clarifiedMemory,

  // Consolidation
  consolidationEngine,
  sleepConsolidation,

  // Retrieval
  hybridRetrieval,

  // Processing
  semanticChunker,
  constitutionalTagger,

  // Anchors
  anchorDetector,
  anchorRetrieval,

  // ═══════════════════════════════════════════════════════════════════════
  // BRAIN 1B FACT EXTRACTION (8-Brain Architecture v3.0)
  // ═══════════════════════════════════════════════════════════════════════

  // Fact Extractor - Core extraction functions
  extractFacts: factExtractor.extractFacts,
  extractProperNames: factExtractor.extractProperNames,
  extractLifeStructureFacts: factExtractor.extractLifeStructureFacts,
  isTransientContent: factExtractor.isTransientContent,
  consolidateFacts: factExtractor.consolidateFacts,
  calculatePromotionScore: factExtractor.calculatePromotionScore,
  shouldPromoteToBrain2: factExtractor.shouldPromoteToBrain2,

  // Brain 1B Service - Firebase operations
  processMessage: brain1BService.processMessage,
  getAllFacts: brain1BService.getAllFacts,
  getFactsByCategory: brain1BService.getFactsByCategory,
  getFactsAboutPerson: brain1BService.getFactsAboutPerson,
  getTodaysFacts: brain1BService.getTodaysFacts,
  searchFacts: brain1BService.searchFacts,
  runConsolidation: brain1BService.runConsolidation,
  getBrain2Facts: brain1BService.getBrain2Facts,
  getBrain2Relationships: brain1BService.getBrain2Relationships,
  getBrain2LifeStructure: brain1BService.getBrain2LifeStructure,
  buildUserProfileSummary: brain1BService.buildUserProfileSummary,

  // Nightly Consolidation - Cloud Functions
  nightlyConsolidation,

  // ═══════════════════════════════════════════════════════════════════════
  // DIRECT MODULE ACCESS
  // ═══════════════════════════════════════════════════════════════════════

  modules: {
    // New modular structure
    stores,
    brain,
    personality,
    tango,
    analysis,
    orchestrator,

    // 8-Brain Architecture v3.0
    factExtractor,
    brain1BService,
    nightlyConsolidation,

    // Legacy modules
    scoring: scoringUtils,
    architecture: clarifiedMemory,
    consolidation: consolidationEngine,
    sleep: sleepConsolidation,
    hybrid: hybridRetrieval,
    chunker: semanticChunker,
    tagger: constitutionalTagger,
    anchorDetector,
    anchorRetrieval
  }
};
