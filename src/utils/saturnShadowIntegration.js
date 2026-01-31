/**
 * Saturn Shadow Integration Engine
 *
 * Generates shadow integration profiles based on house and aspects.
 * Returns practical integration moves - concrete steps for psychological work.
 *
 * GENESIS AstroProfile - January 2026
 */

import { SATURN_ASPECT_COMPLEXES } from '../data/saturnAspectComplexes';

// ═══════════════════════════════════════════════════════════════════════════
// BASE HOUSE WOUNDS
// ═══════════════════════════════════════════════════════════════════════════

const BASE_HOUSE_WOUNDS = {
  1: "Fear of being fundamentally inadequate or unworthy as a person.",
  2: "Fear of not having enough or not being enough materially or intrinsically.",
  3: "Fear of sounding foolish, ignorant, or misunderstood.",
  4: "Fear of emotional instability, abandonment, or rootlessness.",
  5: "Fear of humiliation, creative failure, or being laughed at.",
  6: "Fear of failure through imperfection or lack of usefulness.",
  7: "Fear of rejection, betrayal, or unequal commitment.",
  8: "Fear of losing control, being exposed, or being powerless.",
  9: "Fear of being wrong about life's meaning or direction.",
  10: "Fear of public failure, disgrace, or wasted potential.",
  11: "Fear of exclusion, irrelevance, or not belonging anywhere.",
  12: "Fear of being overwhelmed by the unconscious or losing oneself."
};

// ═══════════════════════════════════════════════════════════════════════════
// BASE HOUSE DEFENSES
// ═══════════════════════════════════════════════════════════════════════════

const BASE_HOUSE_DEFENSES = {
  1: "Rigid self-control, over-serious persona, avoidance of vulnerability.",
  2: "Overwork for security, hoarding, clinging to the familiar.",
  3: "Over-intellectualizing, perfectionistic speech, silence when unsure.",
  4: "Emotional withdrawal, caretaking others instead of expressing needs.",
  5: "Self-censorship, only creating when 'perfect', hiding joy.",
  6: "Workaholism, self-criticism, taking on too much responsibility.",
  7: "People-pleasing, avoidance of conflict, choosing 'safe' partners.",
  8: "Control, testing others, withholding vulnerability.",
  9: "Dogmatism, endless searching, avoiding commitment through philosophy.",
  10: "Over-identification with status, constant striving, emotional suppression.",
  11: "Detachment, staying on the margins, ironic distance.",
  12: "Escapism, dissociation, spiritual bypassing."
};

// ═══════════════════════════════════════════════════════════════════════════
// INTEGRATION MOVES (by house)
// ═══════════════════════════════════════════════════════════════════════════

const BASE_INTEGRATION_MOVES = {
  1: [
    "Practice small acts of visible vulnerability (sharing uncertainty, asking for help).",
    "Differentiate between role and self: you are more than your function.",
    "Stand in a room without performing competence—just be present.",
    "Ask: 'What would I do if I weren't trying to impress anyone?'"
  ],
  2: [
    "Define 'enough' in concrete terms and honor it.",
    "Experiment with generosity that doesn't endanger you.",
    "Notice when you cling—possessions, routines, people—and ask what you fear losing.",
    "Practice receiving without immediately reciprocating."
  ],
  3: [
    "Speak before you feel fully prepared in low-risk contexts.",
    "Allow imperfect words to exist without immediate correction.",
    "Write something and share it before it's 'ready.'",
    "Listen without preparing your response."
  ],
  4: [
    "Name your needs explicitly to at least one safe person.",
    "Create a physical ritual of 'home' that belongs only to you.",
    "Write a letter to an ancestor (real or imagined) releasing a burden.",
    "Practice saying 'I need' without apologizing."
  ],
  5: [
    "Share a small, imperfect creative work.",
    "Schedule play that has no productive outcome.",
    "Let someone see you enjoying yourself without self-consciousness.",
    "Create something ugly on purpose—and keep it."
  ],
  6: [
    "Set a hard limit on work hours for one week.",
    "Delegate one task you usually hoard.",
    "Practice 'good enough' instead of perfect in one area.",
    "Rest without calling it 'recovery' or 'strategy.'"
  ],
  7: [
    "State a boundary clearly in one relationship.",
    "Ask directly for what you want in partnership.",
    "Let a small conflict exist without resolving it immediately.",
    "Notice when you're performing harmony instead of feeling it."
  ],
  8: [
    "Reveal one honest fear to someone you cautiously trust.",
    "Release one secret you no longer need to carry alone.",
    "Let someone help you without testing their motives first.",
    "Practice surrender in a small, safe domain."
  ],
  9: [
    "Act on a belief instead of just refining it.",
    "Allow your worldview to be questioned without immediate defense.",
    "Commit to one thing longer than feels comfortable.",
    "Replace 'seeking' with 'practicing' for one month."
  ],
  10: [
    "Define success in one sentence that doesn't mention status.",
    "Take one visible action aligned with your own definition.",
    "Let someone see you uncertain or struggling professionally.",
    "Ask: 'What would I do if no one was watching?'"
  ],
  11: [
    "Join or initiate one small group aligned with your values.",
    "Let yourself be seen as you are, not as you 'should' be.",
    "Belong to something without critique for one full season.",
    "Share a weird opinion with people who might disagree."
  ],
  12: [
    "Schedule time for feeling without distraction.",
    "Ground spiritual practice in simple, embodied routines.",
    "Set one firm boundary with someone who drains you.",
    "Notice when you're escaping—and gently return."
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ENGINE FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build a complete Saturn shadow profile
 * @param {number} house - House number (1-12)
 * @param {Array} aspectKeys - Array of aspect keys (e.g., ["Moon-Saturn", "Sun-Saturn"])
 * @returns {Object} Complete shadow profile
 */
export function buildSaturnShadowProfile(house, aspectKeys = []) {
  // Get aspect complexes
  const aspectComplexes = aspectKeys
    .map(k => SATURN_ASPECT_COMPLEXES[k])
    .filter(Boolean);

  // Get base material
  const coreWound = BASE_HOUSE_WOUNDS[house] || "Fear of inadequacy.";
  const coreDefense = BASE_HOUSE_DEFENSES[house] || "Over-control and withdrawal.";
  const baseIntegrationMoves = BASE_INTEGRATION_MOVES[house] || [];

  // Add aspect-specific integration moves
  const aspectMoves = aspectComplexes.map(c =>
    `Honor this Saturn gift: ${c.gift}`
  );

  // Combine all integration moves
  const integrationMoves = [...baseIntegrationMoves, ...aspectMoves];

  return {
    house,
    coreWound,
    coreDefense,
    integrationMoves,
    aspectComplexes,
    shadowSummary: buildShadowSummary(house, aspectComplexes),
    integrationTheme: buildIntegrationTheme(house)
  };
}

/**
 * Build a narrative shadow summary
 */
function buildShadowSummary(house, aspectComplexes) {
  const houseThemes = {
    1: "identity and self-presentation",
    2: "worth and security",
    3: "communication and learning",
    4: "home and emotional foundations",
    5: "creativity and self-expression",
    6: "work and service",
    7: "partnership and commitment",
    8: "intimacy and transformation",
    9: "meaning and belief",
    10: "career and public role",
    11: "community and future vision",
    12: "spirituality and the unconscious"
  };

  let summary = `Your Saturn shadow lives in the domain of ${houseThemes[house] || "life responsibilities"}.`;

  if (aspectComplexes.length > 0) {
    const aspectWounds = aspectComplexes.map(c => c.wound).join("; ");
    summary += ` This is intensified by: ${aspectWounds}`;
  }

  return summary;
}

/**
 * Build the integration theme
 */
function buildIntegrationTheme(house) {
  const themes = {
    1: "Becoming authentically yourself without armor.",
    2: "Knowing your worth beyond possessions or productivity.",
    3: "Speaking your truth without needing universal agreement.",
    4: "Creating internal home that no one can take away.",
    5: "Creating freely without fear of judgment.",
    6: "Serving sustainably without self-erasure.",
    7: "Committing while staying whole.",
    8: "Trusting while remaining powerful.",
    9: "Living your beliefs instead of just thinking them.",
    10: "Defining success internally and building accordingly.",
    11: "Belonging without losing yourself.",
    12: "Feeling fully while staying grounded."
  };

  return themes[house] || "Integrating Saturn's lessons with grace.";
}

// ═══════════════════════════════════════════════════════════════════════════
// ADDITIONAL UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get a single random integration move for a house
 * @param {number} house - House number
 * @returns {string} Random integration move
 */
export function getRandomIntegrationMove(house) {
  const moves = BASE_INTEGRATION_MOVES[house];
  if (!moves || moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}

/**
 * Get the primary wound for a house
 * @param {number} house - House number
 * @returns {string} Core wound description
 */
export function getHouseWound(house) {
  return BASE_HOUSE_WOUNDS[house] || null;
}

/**
 * Get the primary defense for a house
 * @param {number} house - House number
 * @returns {string} Core defense description
 */
export function getHouseDefense(house) {
  return BASE_HOUSE_DEFENSES[house] || null;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

// Named exports for direct import
export {
  BASE_HOUSE_WOUNDS,
  BASE_HOUSE_DEFENSES,
  BASE_INTEGRATION_MOVES
};

export default {
  buildSaturnShadowProfile,
  getRandomIntegrationMove,
  getHouseWound,
  getHouseDefense,
  BASE_HOUSE_WOUNDS,
  BASE_HOUSE_DEFENSES,
  BASE_INTEGRATION_MOVES
};
