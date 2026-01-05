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
