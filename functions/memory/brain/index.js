/**
 * ============================================================================
 * GENESIS LUNA - BRAIN INDEX (Luna's Private Memory)
 * ============================================================================
 * Central exports for Luna's brain modules.
 * These are Luna's PRIVATE observations - her perspective, not the user's.
 *
 * Brain Modules:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  LUNA'S BRAIN (SoulPartner's Private Insights)                         │
 * │                                                                          │
 * │  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐   │
 * │  │ journalStore      │  │ patternsStore     │  │ emotionTrends     │   │
 * │  │ ─────────────────│  │ ─────────────────│  │ ─────────────────│   │
 * │  │ createJournalEntry│  │ storePattern      │  │ getEmotionTrends  │   │
 * │  │ getRecentJournals │  │ getPatterns       │  │                   │   │
 * │  └───────────────────┘  └───────────────────┘  └───────────────────┘   │
 * │                                                                          │
 * │  Path Structure:                                                         │
 * │  users/{userId}/memory/{profileId}/soulPartner/                         │
 * │    ├── journals/entries/{date}                                          │
 * │    ├── patterns/learned/{patternId}                                     │
 * │    └── emotionLogs/entries/{logId}                                      │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const journalStore = require('./journalStore');
const patternsStore = require('./patternsStore');
const emotionTrends = require('./emotionTrends');

module.exports = {
  // Journal Store
  createJournalEntry: journalStore.createJournalEntry,
  getRecentJournalEntries: journalStore.getRecentJournalEntries,
  searchJournals: journalStore.searchJournals,

  // Patterns Store
  storePattern: patternsStore.storePattern,
  getPatterns: patternsStore.getPatterns,
  searchPatterns: patternsStore.searchPatterns,

  // Emotion Trends
  getEmotionTrends: emotionTrends.getEmotionTrends,

  // Direct module access
  modules: {
    journal: journalStore,
    patterns: patternsStore,
    emotions: emotionTrends
  }
};
