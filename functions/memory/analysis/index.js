/**
 * ============================================================================
 * GENESIS LUNA - ANALYSIS INDEX
 * ============================================================================
 * Central exports for analysis and reflection modules.
 *
 * Modules:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  ANALYSIS MODULES                                                       │
 * │                                                                          │
 * │  ┌───────────────────────────┐  ┌───────────────────────────┐          │
 * │  │ reflectionEngine          │  │ constitutionalAnalysis    │          │
 * │  │ ─────────────────────────│  │ ─────────────────────────│          │
 * │  │ reflectOnConversation     │  │ analyzeConstitutional...  │          │
 * │  │ refineMemories            │  │ analyzeElementActivation  │          │
 * │  │                           │  │ analyzePillarActivation   │          │
 * │  └───────────────────────────┘  └───────────────────────────┘          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const reflectionEngine = require('./reflectionEngine');
const constitutionalAnalysis = require('./constitutionalAnalysis');

module.exports = {
  // Reflection Engine
  reflectOnConversation: reflectionEngine.reflectOnConversation,
  refineMemories: reflectionEngine.refineMemories,

  // Constitutional Analysis
  analyzeConstitutionalActivation: constitutionalAnalysis.analyzeConstitutionalActivation,
  analyzeElementActivation: constitutionalAnalysis.analyzeElementActivation,
  analyzePillarActivation: constitutionalAnalysis.analyzePillarActivation,
  analyzeGiftEngagement: constitutionalAnalysis.analyzeGiftEngagement,
  analyzeNeurochemicalEffectiveness: constitutionalAnalysis.analyzeNeurochemicalEffectiveness,
  getNeurochemicalPriority: constitutionalAnalysis.getNeurochemicalPriority,

  // Direct module access
  modules: {
    reflection: reflectionEngine,
    constitutional: constitutionalAnalysis
  }
};
