/**
 * Saturn House Overlays
 *
 * Adds house-based overlays to the Saturn Journey profiles.
 * These merge with sign-based psychology to create complete Saturn portraits.
 *
 * House = where the fear lives (life arena)
 * Sign = how the fear behaves (psychological flavor)
 * Aspects = why it intensifies (relationship dynamics)
 *
 * Based on Liz Greene's approach to Saturn in houses.
 *
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// SATURN HOUSE OVERLAYS
// ═══════════════════════════════════════════════════════════════════════════

export const SATURN_HOUSE_OVERLAYS = {
  // 1ST HOUSE — IDENTITY, SELF-IMAGE
  1: {
    wound: {
      coreFear: "Being fundamentally inadequate or unworthy of respect.",
      earlyExperience: "Identity felt judged; you learned to perform competence.",
      authorityImprint: "Authority shaped your self-image directly."
    },
    defenses: {
      primary: "Self-control and hyper-responsibility.",
      secondary: "Emotional distance to appear strong.",
      protects: "Fear of being exposed as weak."
    },
    gift: {
      authorityStyle: "Quiet, grounded presence.",
      mastery: "Self-mastery and integrity.",
      trustedFor: "Stability and reliability."
    },
    returnTheme: {
      claim: "Your right to define yourself.",
      initiation: "Letting the real self emerge without armor."
    }
  },

  // 2ND HOUSE — VALUE, SECURITY, SELF-WORTH
  2: {
    wound: {
      coreFear: "Not having enough — materially or emotionally.",
      earlyExperience: "Security felt conditional or scarce.",
      authorityImprint: "Worth was tied to productivity or resources."
    },
    defenses: {
      primary: "Overworking to prove worth.",
      secondary: "Clinging to possessions, roles, or routines.",
      protects: "Fear of loss and instability."
    },
    gift: {
      authorityStyle: "Steady, dependable builder.",
      mastery: "Creating lasting value.",
      trustedFor: "Financial or material wisdom."
    },
    returnTheme: {
      claim: "Inner worth that doesn't depend on achievement.",
      initiation: "Letting go of scarcity patterns."
    }
  },

  // 3RD HOUSE — MIND, COMMUNICATION, LEARNING
  3: {
    wound: {
      coreFear: "Being misunderstood, wrong, or intellectually inadequate.",
      earlyExperience: "Communication was judged or restricted.",
      authorityImprint: "Authority controlled knowledge or narrative."
    },
    defenses: {
      primary: "Over-explaining; intellectualizing feelings.",
      secondary: "Avoiding emotional depth through analysis.",
      protects: "Fear of mental humiliation."
    },
    gift: {
      authorityStyle: "Clear, structured communicator.",
      mastery: "Teaching, writing, and system-building.",
      trustedFor: "Explaining complex ideas simply."
    },
    returnTheme: {
      claim: "Your voice and your truth.",
      initiation: "Speaking with authority, not apology."
    }
  },

  // 4TH HOUSE — ROOTS, FAMILY, EMOTIONAL FOUNDATION
  4: {
    wound: {
      coreFear: "Emotional instability or abandonment.",
      earlyExperience: "Home felt heavy, demanding, or unpredictable.",
      authorityImprint: "Authority was tied to family roles."
    },
    defenses: {
      primary: "Emotional withdrawal; caretaking others.",
      secondary: "Building inner walls for safety.",
      protects: "Fear of being emotionally unprotected."
    },
    gift: {
      authorityStyle: "Emotional anchor.",
      mastery: "Creating stability and sanctuary.",
      trustedFor: "Loyalty and emotional wisdom."
    },
    returnTheme: {
      claim: "A home that supports you.",
      initiation: "Healing family patterns."
    }
  },

  // 5TH HOUSE — CREATIVITY, SELF-EXPRESSION, JOY
  5: {
    wound: {
      coreFear: "Being judged, humiliated, or creatively inadequate.",
      earlyExperience: "Play or self-expression felt unsafe.",
      authorityImprint: "Approval was tied to performance."
    },
    defenses: {
      primary: "Perfectionism in creativity.",
      secondary: "Avoiding visibility.",
      protects: "Fear of creative rejection."
    },
    gift: {
      authorityStyle: "Creative mentor.",
      mastery: "Disciplined artistry.",
      trustedFor: "Taste, refinement, and creative leadership."
    },
    returnTheme: {
      claim: "Your right to create without fear.",
      initiation: "Letting joy be imperfect."
    }
  },

  // 6TH HOUSE — WORK, HEALTH, SERVICE, ROUTINE
  6: {
    wound: {
      coreFear: "Being incompetent, flawed, or not useful.",
      earlyExperience: "Love felt conditional on performance.",
      authorityImprint: "Authority = criticism or high standards."
    },
    defenses: {
      primary: "Overwork; hyper-perfectionism.",
      secondary: "Self-criticism as motivation.",
      protects: "Fear of failure or inadequacy."
    },
    gift: {
      authorityStyle: "Master craftsperson.",
      mastery: "Skill, precision, and service.",
      trustedFor: "Reliability and improvement."
    },
    returnTheme: {
      claim: "Healthy discipline, not self-punishment.",
      initiation: "Letting imperfection be human."
    }
  },

  // 7TH HOUSE — RELATIONSHIPS, PARTNERSHIP, PROJECTION
  7: {
    wound: {
      coreFear: "Rejection, betrayal, or being unlovable.",
      earlyExperience: "Partnerships felt imbalanced or demanding.",
      authorityImprint: "Authority was relational — approval-based."
    },
    defenses: {
      primary: "People-pleasing; avoiding conflict.",
      secondary: "Choosing partners who mirror the inner critic.",
      protects: "Fear of abandonment."
    },
    gift: {
      authorityStyle: "Fair, wise partner.",
      mastery: "Building balanced relationships.",
      trustedFor: "Diplomacy and commitment."
    },
    returnTheme: {
      claim: "Relationships that honor your truth.",
      initiation: "Facing conflict cleanly."
    }
  },

  // 8TH HOUSE — INTIMACY, POWER, SHADOW, TRANSFORMATION
  8: {
    wound: {
      coreFear: "Loss of control, betrayal, or emotional exposure.",
      earlyExperience: "Secrets, intensity, or power struggles.",
      authorityImprint: "Authority was hidden or manipulative."
    },
    defenses: {
      primary: "Control; emotional testing.",
      secondary: "Withholding vulnerability.",
      protects: "Fear of being hurt or powerless."
    },
    gift: {
      authorityStyle: "Shadow worker.",
      mastery: "Transformation and psychological insight.",
      trustedFor: "Depth, loyalty, and truth."
    },
    returnTheme: {
      claim: "Power without domination.",
      initiation: "Letting intimacy coexist with strength."
    }
  },

  // 9TH HOUSE — BELIEF, MEANING, TRUTH, WISDOM
  9: {
    wound: {
      coreFear: "Being wrong, lost, or without meaning.",
      earlyExperience: "Beliefs were judged or restricted.",
      authorityImprint: "Authority controlled truth or worldview."
    },
    defenses: {
      primary: "Dogmatism or over-philosophizing.",
      secondary: "Escaping into ideals.",
      protects: "Fear of meaninglessness."
    },
    gift: {
      authorityStyle: "Wise guide.",
      mastery: "Philosophy, teaching, and perspective.",
      trustedFor: "Insight and moral clarity."
    },
    returnTheme: {
      claim: "Your own philosophy of life.",
      initiation: "Living your truth, not inherited beliefs."
    }
  },

  // 10TH HOUSE — CAREER, PUBLIC ROLE, LEGACY
  10: {
    wound: {
      coreFear: "Public failure, shame, or not achieving enough.",
      earlyExperience: "High expectations; pressure to succeed.",
      authorityImprint: "Authority = career, status, reputation."
    },
    defenses: {
      primary: "Workaholism; overachievement.",
      secondary: "Emotional suppression to stay 'professional.'",
      protects: "Fear of public inadequacy."
    },
    gift: {
      authorityStyle: "Strategic leader.",
      mastery: "Long-term achievement and legacy building.",
      trustedFor: "Judgment and responsibility."
    },
    returnTheme: {
      claim: "A vocation aligned with your soul.",
      initiation: "Redefining success on your terms."
    }
  },

  // 11TH HOUSE — FUTURE, COMMUNITY, SYSTEMS, IDEALS
  11: {
    wound: {
      coreFear: "Exile, not belonging, or failed ideals.",
      earlyExperience: "Group belonging felt conditional.",
      authorityImprint: "Authority enforced conformity."
    },
    defenses: {
      primary: "Detachment; intellectualizing emotion.",
      secondary: "Rebellion as identity.",
      protects: "Fear of losing individuality."
    },
    gift: {
      authorityStyle: "Visionary architect.",
      mastery: "Systems design and collective reform.",
      trustedFor: "Innovation and principled thinking."
    },
    returnTheme: {
      claim: "Your place in the future you envision.",
      initiation: "Belonging without self-erasure."
    }
  },

  // 12TH HOUSE — UNCONSCIOUS, SPIRIT, LOSS, TRANSCENDENCE
  12: {
    wound: {
      coreFear: "Being overwhelmed, unseen, or dissolved.",
      earlyExperience: "Invisible burdens; emotional absorption.",
      authorityImprint: "Authority was diffuse, confusing, or absent."
    },
    defenses: {
      primary: "Withdrawal; escapism; spiritual bypassing.",
      secondary: "Self-sacrifice to avoid conflict.",
      protects: "Fear of being consumed by emotion."
    },
    gift: {
      authorityStyle: "Compassionate mystic.",
      mastery: "Healing, intuition, and spiritual depth.",
      trustedFor: "Empathy and symbolic insight."
    },
    returnTheme: {
      claim: "Boundaries that protect your sensitivity.",
      initiation: "Grounded spirituality."
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get house overlay for a given house number
 * @param {number} house - House number (1-12)
 * @returns {Object|null} House overlay or null
 */
export function getSaturnHouseOverlay(house) {
  return SATURN_HOUSE_OVERLAYS[house] || null;
}

/**
 * Merge house overlay with sign profile
 * @param {Object} signProfile - Base sign profile
 * @param {number} house - House number
 * @returns {Object} Merged profile
 */
export function mergeSaturnHouseWithSign(signProfile, house) {
  const houseOverlay = SATURN_HOUSE_OVERLAYS[house];
  if (!houseOverlay || !signProfile) return signProfile;

  return {
    ...signProfile,
    wound: {
      ...signProfile.wound,
      ...(houseOverlay.wound || {})
    },
    defenses: {
      ...signProfile.defenses,
      ...(houseOverlay.defenses || {})
    },
    gift: {
      ...signProfile.gift,
      ...(houseOverlay.gift || {})
    },
    turningPoint: {
      ...signProfile.turningPoint,
      ...(houseOverlay.returnTheme || {})
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  SATURN_HOUSE_OVERLAYS,
  getSaturnHouseOverlay,
  mergeSaturnHouseWithSign
};
