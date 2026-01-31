/**
 * Saturn Relationship Dynamics Data
 *
 * Based on Liz Greene's "Relating" — a psychological approach to
 * projection, shadow, fear, and the karmic contract of intimacy.
 *
 * This module provides the core relational interpretations:
 * - Projection Map (what we expect partners to carry)
 * - Compatibility Wound (sign-based relational fear)
 * - Partnership Contract (the soul lesson)
 * - Break Patterns (how we sabotage intimacy)
 * - Healing Patterns (the path to repair)
 *
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// SATURN PROJECTION MAP (by House)
// What you unconsciously expect partners to carry for you
// ═══════════════════════════════════════════════════════════════════════════

export const SATURN_PROJECTION_MAP = {
  1: "You expect partners to be more stable, mature, or emotionally contained than you allow yourself to be.",
  2: "You expect partners to provide security, reassurance, or validation of your worth.",
  3: "You expect partners to communicate flawlessly, never misunderstand you, and carry emotional clarity.",
  4: "You expect partners to provide emotional safety, grounding, or a sense of home you struggle to give yourself.",
  5: "You expect partners to validate your creativity, confidence, or desirability.",
  6: "You expect partners to be responsible, reliable, and self-disciplined — often more than you are with yourself.",
  7: "You expect partners to carry the weight of commitment, stability, and emotional maturity.",
  8: "You expect partners to handle intensity, vulnerability, and emotional truth for both of you.",
  9: "You expect partners to provide meaning, direction, or philosophical certainty.",
  10: "You expect partners to be accomplished, respectable, or socially validated.",
  11: "You expect partners to include you, understand your ideals, and provide belonging.",
  12: "You expect partners to intuit your needs without you expressing them."
};

// ═══════════════════════════════════════════════════════════════════════════
// SATURN COMPATIBILITY WOUND (by Sign)
// The core fear that surfaces in intimate relationships
// ═══════════════════════════════════════════════════════════════════════════

export const SATURN_COMPATIBILITY_WOUND = {
  Aries: "Fear of losing autonomy or being controlled.",
  Taurus: "Fear of instability or emotional inconsistency.",
  Gemini: "Fear of being misunderstood or intellectually dismissed.",
  Cancer: "Fear of emotional abandonment or rejection.",
  Leo: "Fear of humiliation or not being valued.",
  Virgo: "Fear of not being good enough or failing to meet expectations.",
  Libra: "Fear of conflict, imbalance, or disappointing the partner.",
  Scorpio: "Fear of betrayal, exposure, or losing control.",
  Sagittarius: "Fear of confinement, obligation, or losing freedom.",
  Capricorn: "Fear of failure, inadequacy, or disappointing the partner.",
  Aquarius: "Fear of losing individuality or being emotionally trapped.",
  Pisces: "Fear of being overwhelmed, engulfed, or abandoned."
};

// ═══════════════════════════════════════════════════════════════════════════
// SATURN PARTNERSHIP CONTRACT (by House)
// The soul lesson this placement brings to relationships
// ═══════════════════════════════════════════════════════════════════════════

export const SATURN_PARTNERSHIP_CONTRACT = {
  1: "To learn authenticity and vulnerability in presence.",
  2: "To learn self-worth independent of validation.",
  3: "To learn honest communication without self-censorship.",
  4: "To learn emotional safety through mutual openness.",
  5: "To learn creative risk and emotional expression.",
  6: "To learn healthy responsibility without self-erasure.",
  7: "To learn equality, boundaries, and mutual commitment.",
  8: "To learn trust, surrender, and shared power.",
  9: "To learn shared meaning and truth without dogma.",
  10: "To learn partnership that supports purpose, not performance.",
  11: "To learn belonging without self-abandonment.",
  12: "To learn compassion with boundaries and clarity."
};

// ═══════════════════════════════════════════════════════════════════════════
// SATURN BREAK PATTERNS (by House)
// How Saturn sabotages intimacy when triggered
// ═══════════════════════════════════════════════════════════════════════════

export const SATURN_BREAK_PATTERNS = {
  1: "Withdrawing into self-sufficiency and shutting out the partner.",
  2: "Clinging, overworking, or demanding reassurance.",
  3: "Overthinking, miscommunication, or shutting down emotionally.",
  4: "Emotional withdrawal, caretaking instead of connecting.",
  5: "Avoiding vulnerability, creative shutdown, or jealousy.",
  6: "Criticism, over-responsibility, or burnout.",
  7: "People-pleasing until resentment explodes.",
  8: "Control, testing, or emotional withholding.",
  9: "Dogmatism, avoidance, or philosophical distancing.",
  10: "Workaholism, emotional suppression, or status-driven conflict.",
  11: "Detachment, isolation, or idealizing others instead of connecting.",
  12: "Disappearing emotionally, escapism, or silent suffering."
};

// ═══════════════════════════════════════════════════════════════════════════
// SATURN HEALING PATTERNS (by House)
// The path to repair and relational growth
// ═══════════════════════════════════════════════════════════════════════════

export const SATURN_HEALING_PATTERNS = {
  1: "Showing vulnerability in small, consistent ways.",
  2: "Building inner worth instead of seeking external validation.",
  3: "Communicating needs before anxiety builds.",
  4: "Naming emotions instead of retreating.",
  5: "Expressing affection and creativity without perfection.",
  6: "Setting limits on responsibility and asking for help.",
  7: "Practicing clean conflict and honest boundaries.",
  8: "Sharing fears instead of testing loyalty.",
  9: "Exploring meaning together without needing agreement.",
  10: "Balancing ambition with emotional presence.",
  11: "Letting yourself belong without performing.",
  12: "Grounding emotions through clarity and boundaries."
};

// ═══════════════════════════════════════════════════════════════════════════
// SATURN RELATIONAL TRIGGERS (by House)
// What activates the Saturn wound in partnership
// ═══════════════════════════════════════════════════════════════════════════

export const SATURN_RELATIONAL_TRIGGERS = {
  1: [
    "Partner criticizing your appearance or presence",
    "Feeling invisible or unimportant",
    "Being asked to change who you are"
  ],
  2: [
    "Financial instability or disagreements",
    "Partner questioning your contributions",
    "Feeling taken for granted"
  ],
  3: [
    "Being interrupted or dismissed",
    "Partner not listening attentively",
    "Feeling intellectually inadequate"
  ],
  4: [
    "Partner emotionally unavailable",
    "Conflict about home or family",
    "Feeling unsafe or unsettled"
  ],
  5: [
    "Creative work being criticized",
    "Feeling unappreciated romantically",
    "Partner withdrawing affection"
  ],
  6: [
    "Partner being irresponsible",
    "Feeling overburdened with tasks",
    "Health or routine disruptions"
  ],
  7: [
    "Partner avoiding commitment",
    "Feeling alone in the relationship",
    "Unfair distribution of effort"
  ],
  8: [
    "Secrets or hidden information",
    "Partner avoiding emotional depth",
    "Feeling powerless or controlled"
  ],
  9: [
    "Partner dismissing your beliefs",
    "Feeling trapped or confined",
    "Loss of meaning in the relationship"
  ],
  10: [
    "Partner undermining your goals",
    "Public embarrassment",
    "Feeling like a failure"
  ],
  11: [
    "Feeling excluded by partner's friends",
    "Partner not sharing your vision",
    "Isolation from community"
  ],
  12: [
    "Partner not intuiting your needs",
    "Feeling spiritually alone",
    "Emotional overwhelm without support"
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// SATURN ASPECT RELATIONAL MODIFIERS
// How Saturn aspects intensify relational patterns
// ═══════════════════════════════════════════════════════════════════════════

export const SATURN_ASPECT_RELATIONAL_MODIFIERS = {
  "Moon-Saturn": {
    relationalWound: "Emotional deprivation; fear of needing too much",
    relationalDefense: "Emotional self-sufficiency; denying needs",
    relationalGift: "Deep empathy; capacity to hold others through difficulty",
    partnerProjection: "You may attract partners who seem emotionally unavailable, mirroring your early experience"
  },
  "Sun-Saturn": {
    relationalWound: "Identity suppression; fear of outshining or being outshone",
    relationalDefense: "Dimming yourself or competing for recognition",
    relationalGift: "Supporting partner's growth while honoring your own",
    partnerProjection: "You may attract partners who overshadow you or need you to be small"
  },
  "Venus-Saturn": {
    relationalWound: "Love felt conditional; fear of not being lovable",
    relationalDefense: "Withholding affection or over-giving to earn love",
    relationalGift: "Enduring love; loyalty; realistic expectations",
    partnerProjection: "You may attract partners who confirm your unworthiness or whom you must 'earn'"
  },
  "Mars-Saturn": {
    relationalWound: "Assertion felt dangerous; fear of conflict",
    relationalDefense: "Suppressed anger; passive aggression; over-control",
    relationalGift: "Strategic action; disciplined pursuit of shared goals",
    partnerProjection: "You may attract partners who dominate or whom you must control"
  },
  "Mercury-Saturn": {
    relationalWound: "Communication felt inadequate; fear of being wrong",
    relationalDefense: "Over-explaining; silence; intellectual one-upmanship",
    relationalGift: "Thoughtful communication; clear agreements",
    partnerProjection: "You may attract partners who criticize your thinking or make you feel stupid"
  },
  "Jupiter-Saturn": {
    relationalWound: "Expansion felt dangerous; fear of hoping too much",
    relationalDefense: "Pessimism; limiting beliefs about what's possible",
    relationalGift: "Grounded optimism; sustainable growth together",
    partnerProjection: "You may attract partners who seem overly optimistic or reckless"
  },
  "Uranus-Saturn": {
    relationalWound: "Uniqueness felt threatening; fear of not fitting",
    relationalDefense: "Conforming or rebelling; never quite belonging",
    relationalGift: "Innovative partnership structures; honoring both freedom and commitment",
    partnerProjection: "You may attract partners who are either too conventional or too chaotic"
  },
  "Neptune-Saturn": {
    relationalWound: "Dreams felt unrealistic; spiritual longing shamed",
    relationalDefense: "Cynicism; idealization followed by disappointment",
    relationalGift: "Practical mysticism; grounded spiritual partnership",
    partnerProjection: "You may attract partners you idealize then see through, or who seem 'too good to be true'"
  },
  "Pluto-Saturn": {
    relationalWound: "Power felt dangerous; fear of domination",
    relationalDefense: "Control; power struggles; avoiding vulnerability",
    relationalGift: "Transformative partnership; regenerative intimacy",
    partnerProjection: "You may attract partners who trigger power dynamics or deep transformation"
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get projection pattern for a house
 * @param {number} house - House number (1-12)
 * @returns {string} Projection description
 */
export function getProjectionPattern(house) {
  return SATURN_PROJECTION_MAP[house] || null;
}

/**
 * Get compatibility wound for a sign
 * @param {string} sign - Zodiac sign
 * @returns {string} Compatibility wound description
 */
export function getCompatibilityWound(sign) {
  return SATURN_COMPATIBILITY_WOUND[sign] || null;
}

/**
 * Get partnership contract for a house
 * @param {number} house - House number (1-12)
 * @returns {string} Partnership contract description
 */
export function getPartnershipContract(house) {
  return SATURN_PARTNERSHIP_CONTRACT[house] || null;
}

/**
 * Get break pattern for a house
 * @param {number} house - House number (1-12)
 * @returns {string} Break pattern description
 */
export function getBreakPattern(house) {
  return SATURN_BREAK_PATTERNS[house] || null;
}

/**
 * Get healing pattern for a house
 * @param {number} house - House number (1-12)
 * @returns {string} Healing pattern description
 */
export function getHealingPattern(house) {
  return SATURN_HEALING_PATTERNS[house] || null;
}

/**
 * Get relational triggers for a house
 * @param {number} house - House number (1-12)
 * @returns {Array} Array of trigger descriptions
 */
export function getRelationalTriggers(house) {
  return SATURN_RELATIONAL_TRIGGERS[house] || [];
}

/**
 * Get aspect relational modifier
 * @param {string} aspectKey - Aspect key (e.g., "Moon-Saturn")
 * @returns {Object|null} Relational modifier object
 */
export function getAspectRelationalModifier(aspectKey) {
  return SATURN_ASPECT_RELATIONAL_MODIFIERS[aspectKey] || null;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  SATURN_PROJECTION_MAP,
  SATURN_COMPATIBILITY_WOUND,
  SATURN_PARTNERSHIP_CONTRACT,
  SATURN_BREAK_PATTERNS,
  SATURN_HEALING_PATTERNS,
  SATURN_RELATIONAL_TRIGGERS,
  SATURN_ASPECT_RELATIONAL_MODIFIERS,
  getProjectionPattern,
  getCompatibilityWound,
  getPartnershipContract,
  getBreakPattern,
  getHealingPattern,
  getRelationalTriggers,
  getAspectRelationalModifier
};
