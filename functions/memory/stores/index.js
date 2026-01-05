/**
 * ============================================================================
 * GENESIS LUNA - STORES INDEX
 * ============================================================================
 * Central exports for all memory store modules.
 *
 * Store Modules:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  USER'S BRAIN (8 Stores)                                               │
 * │                                                                          │
 * │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐               │
 * │  │ memoryStore   │  │ factsStore    │  │ peopleStore   │               │
 * │  │ ─────────────│  │ ─────────────│  │ ─────────────│               │
 * │  │ storeMemory   │  │ getFacts      │  │ getPeople     │               │
 * │  │ retrieveMemory│  │ storeFact     │  │ upsertPerson  │               │
 * │  └───────────────┘  └───────────────┘  └───────────────┘               │
 * │                                                                          │
 * │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐               │
 * │  │ anchorStore   │  │ questionsStore│  │ timelineStore │               │
 * │  │ ─────────────│  │ ─────────────│  │ ─────────────│               │
 * │  │ getAnchors    │  │ getPending    │  │ getEvents     │               │
 * │  │ storeAnchor   │  │ markAnswered  │  │ searchTimeline│               │
 * │  └───────────────┘  └───────────────┘  └───────────────┘               │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const memoryStore = require('./memoryStore');
const factsStore = require('./factsStore');
const peopleStore = require('./peopleStore');
const anchorStore = require('./anchorStore');
const questionsStore = require('./questionsStore');
const timelineStore = require('./timelineStore');

module.exports = {
  // Memory Store
  storeMemory: memoryStore.storeMemory,
  retrieveMemories: memoryStore.retrieveMemories,

  // Facts Store
  getFacts: factsStore.getFacts,
  storeFact: factsStore.storeFact,
  searchFacts: factsStore.searchFacts,

  // People Store
  getPeople: peopleStore.getPeople,
  upsertPerson: peopleStore.upsertPerson,
  searchPeople: peopleStore.searchPeople,

  // Anchor Store
  getHappinessAnchors: anchorStore.getHappinessAnchors,
  storeHappinessAnchor: anchorStore.storeHappinessAnchor,

  // Questions Store
  getPendingQuestions: questionsStore.getPendingQuestions,
  markQuestionAnswered: questionsStore.markQuestionAnswered,
  storeQuestion: questionsStore.storeQuestion,

  // Timeline Store
  getTimelineEvents: timelineStore.getTimelineEvents,
  searchTimeline: timelineStore.searchTimeline,
  getTimelineWithQuestions: timelineStore.getTimelineWithQuestions,
  storeTimelineEvent: timelineStore.storeTimelineEvent,

  // Direct module access
  modules: {
    memory: memoryStore,
    facts: factsStore,
    people: peopleStore,
    anchors: anchorStore,
    questions: questionsStore,
    timeline: timelineStore
  }
};
