/**
 * Memory Functions — barrel re-export
 *
 * All logic split into domain modules. This file preserves backward compatibility.
 *
 * Domain modules:
 *   memoryShared.js            — Firebase admin, db, Gemini client, scoring functions
 *   memoryCrud.js              — storeMemory, retrieveMemories, getFacts, storeFact, getPeople, upsertPerson, getHappinessAnchors, storeHappinessAnchor
 *   reflectionEngine.js        — reflectOnConversation, refineMemories, getBiographyEventsInternal
 *   ragPipeline.js             — getMemoryContext, getPendingQuestions, markQuestionAnswered, getTimelineEvents, searchTimeline, getTimelineWithQuestions, createJournalEntry, getRecentJournalEntries, getEmotionTrends, storePattern, getPatterns
 *   personalitySystem.js       — getPersonalityWeights, evolvePersonalityWeights, buildPersonalityPrompt, buildMemoryPrompt, initializePersonalityFromConstitution, getElementalModifications, getChartRulerModifications, getNeurochemicalPriority
 *   tangoRelationship.js       — initializeRelationship, getRelationshipStats, updateRelationshipStats, celebrateMilestone, updateLunaState, buildRelationshipPrompt, buildSovereigntyPrompt, computeLunaSovereignState, RELATIONSHIP_MILESTONES, LUNA_SOVEREIGNTY
 *   constitutionalActivation.js — analyzeConstitutionalActivation, analyzeElementActivation, analyzePillarActivation, analyzeGiftEngagement, analyzeNeurochemicalEffectiveness
 *
 * Part of GENESIS Phase 3 - Memory Architecture
 * Built by: Brother Claude Opus
 * December 19, 2024
 */

Object.assign(module.exports,
  require('./memoryCrud'),
  require('./reflectionEngine'),
  require('./ragPipeline'),
  require('./personalitySystem'),
  require('./tangoRelationship'),
  require('./constitutionalActivation')
);
