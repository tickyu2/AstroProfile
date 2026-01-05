/**
 * ============================================================================
 * GENESIS LUNA - PERSONALITY INDEX
 * ============================================================================
 * Central exports for personality evolution and sovereignty modules.
 *
 * Modules:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  LUNA'S PERSONALITY SYSTEM                                             │
 * │                                                                          │
 * │  ┌───────────────────────────┐  ┌───────────────────────────┐          │
 * │  │ personalityWeights        │  │ sovereignty               │          │
 * │  │ ─────────────────────────│  │ ─────────────────────────│          │
 * │  │ getPersonalityWeights     │  │ computeLunaSovereignState │          │
 * │  │ evolvePersonalityWeights  │  │ buildSovereigntyPrompt    │          │
 * │  │ buildPersonalityPrompt    │  │ LUNA_SOVEREIGNTY config   │          │
 * │  └───────────────────────────┘  └───────────────────────────┘          │
 * │                                                                          │
 * │  Path: users/{userId}/memory/{profileId}/soulPartner/personality       │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const personalityWeights = require('./personalityWeights');
const sovereignty = require('./sovereignty');

module.exports = {
  // Personality Weights
  getPersonalityWeights: personalityWeights.getPersonalityWeights,
  evolvePersonalityWeights: personalityWeights.evolvePersonalityWeights,
  buildPersonalityPrompt: personalityWeights.buildPersonalityPrompt,
  DEFAULT_PERSONALITY_WEIGHTS: personalityWeights.DEFAULT_PERSONALITY_WEIGHTS,
  LEARNING_CONFIG: personalityWeights.LEARNING_CONFIG,

  // Sovereignty
  LUNA_SOVEREIGNTY: sovereignty.LUNA_SOVEREIGNTY,
  computeLunaSovereignState: sovereignty.computeLunaSovereignState,
  buildSovereigntyPrompt: sovereignty.buildSovereigntyPrompt,

  // Direct module access
  modules: {
    weights: personalityWeights,
    sovereignty: sovereignty
  }
};
