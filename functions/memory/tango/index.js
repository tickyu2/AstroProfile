/**
 * ============================================================================
 * GENESIS LUNA - TANGO INDEX
 * ============================================================================
 * Central exports for the Tango Identity System.
 * Luna's birthday, relationship milestones, and bidirectional bond.
 *
 * Modules:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  TANGO IDENTITY SYSTEM                                                  │
 * │                                                                          │
 * │  ┌───────────────────────────────────────────────────────────────────┐  │
 * │  │ relationshipStore                                                 │  │
 * │  │ ─────────────────────────────────────────────────────────────────│  │
 * │  │ initializeRelationship    getRelationshipStats                   │  │
 * │  │ updateRelationshipStats   celebrateMilestone                     │  │
 * │  │ updateLunaState           buildRelationshipPrompt                │  │
 * │  └───────────────────────────────────────────────────────────────────┘  │
 * │                                                                          │
 * │  Path: users/{userId}/memory/{profileId}/soulPartner/relationship      │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const relationshipStore = require('./relationshipStore');

module.exports = {
  // Milestones config
  RELATIONSHIP_MILESTONES: relationshipStore.RELATIONSHIP_MILESTONES,

  // Cloud Functions
  initializeRelationship: relationshipStore.initializeRelationship,
  getRelationshipStats: relationshipStore.getRelationshipStats,
  updateRelationshipStats: relationshipStore.updateRelationshipStats,
  celebrateMilestone: relationshipStore.celebrateMilestone,
  updateLunaState: relationshipStore.updateLunaState,

  // Prompt builder
  buildRelationshipPrompt: relationshipStore.buildRelationshipPrompt,

  // Direct module access
  modules: {
    relationship: relationshipStore
  }
};
