/**
 * Story Questions Assessment Data
 * 8 Relatable Life Scenarios for Personality Profiling
 *
 * Each level reveals different aspects of who you are:
 * - Levels 1-2: Daily life patterns
 * - Levels 3-4: How you handle relationships
 * - Levels 5-6: Stress and pressure moments
 * - Levels 7-8: Big life choices
 *
 * Part of GENESIS Phase 2 - Story Questions Assessment
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 15, 2024
 */

export const STORY_QUESTIONS = [
  // ========================================
  // LEVEL 1: THE MORNING COFFEE ☕
  // Tests: Social Energy, Daily Rhythm
  // ========================================
  {
    level: 1,
    title: "The Morning Coffee",
    emoji: "☕",
    category: "DAILY LIFE",
    scenario: `It's Saturday morning. No work, no school. You wake up to sunshine and the smell of coffee. Your phone shows three messages from friends.`,
    question: "What do you do first?",
    choices: [
      {
        id: "1A",
        text: "Check the messages right away - what if it's something fun?",
        emoji: "📱",
        traits: {
          social_orientation: "external",
          communication_style: "responsive",
          energy_source: "connection",
          anxiety_pattern: "FOMO"
        }
      },
      {
        id: "1B",
        text: "Enjoy the quiet for a bit - messages can wait",
        emoji: "🧘",
        traits: {
          social_orientation: "internal",
          communication_style: "deliberate",
          energy_source: "solitude",
          self_care: "prioritized"
        }
      },
      {
        id: "1C",
        text: "Grab coffee first, then check the phone while sipping",
        emoji: "☕",
        traits: {
          social_orientation: "balanced",
          communication_style: "moderate",
          energy_source: "ritual",
          approach: "grounded"
        }
      },
      {
        id: "1D",
        text: "Leave the phone alone and start on something you've been wanting to do",
        emoji: "🎨",
        traits: {
          social_orientation: "autonomous",
          communication_style: "selective",
          energy_source: "creation",
          focus_style: "deep"
        }
      }
    ],
    psychological_dimension: "social_energy",
    constitutional_mapping: {
      "1A": { element_affinity: "Fire", yin_yang: "Yang", ten_god: "Rob Wealth" },
      "1B": { element_affinity: "Water", yin_yang: "Yin", ten_god: "Indirect Resource" },
      "1C": { element_affinity: "Earth", yin_yang: "Balanced", ten_god: "Friend" },
      "1D": { element_affinity: "Wood", yin_yang: "Yang", ten_god: "Eating God" }
    }
  },

  // ========================================
  // LEVEL 2: THE PARTY INVITE 🎉
  // Tests: Social Comfort, How You Handle New Situations
  // ========================================
  {
    level: 2,
    title: "The Party Invite",
    emoji: "🎉",
    category: "SOCIAL LIFE",
    scenario: `A friend invites you to a party tonight. You won't know most people there. "Come on, it'll be fun!" they say.`,
    question: "What's your honest reaction?",
    choices: [
      {
        id: "2A",
        text: "\"Yes! New people, new stories - let's go!\"",
        emoji: "🎉",
        traits: {
          social_comfort: "adventurous",
          risk_appetite: "high",
          energy_style: "extraverted",
          openness: "high"
        }
      },
      {
        id: "2B",
        text: "\"Hmm, let me think about it...\" (probably staying home)",
        emoji: "🤔",
        traits: {
          social_comfort: "cautious",
          risk_appetite: "low",
          energy_style: "introverted",
          honesty_style: "indirect"
        }
      },
      {
        id: "2C",
        text: "\"Only if you stay with me - don't leave me alone there!\"",
        emoji: "🤝",
        traits: {
          social_comfort: "conditional",
          risk_appetite: "moderate",
          attachment_style: "secure-anxious",
          support_need: "high"
        }
      },
      {
        id: "2D",
        text: "\"Parties aren't my thing, but I'll come to hang with you\"",
        emoji: "💜",
        traits: {
          social_comfort: "purposeful",
          risk_appetite: "moderate",
          motivation: "relationship",
          authenticity: "high"
        }
      }
    ],
    psychological_dimension: "social_comfort",
    constitutional_mapping: {
      "2A": { element_affinity: "Fire", yin_yang: "Yang", ten_god: "Hurting Officer" },
      "2B": { element_affinity: "Metal", yin_yang: "Yin", ten_god: "Direct Resource" },
      "2C": { element_affinity: "Earth", yin_yang: "Yin", ten_god: "Direct Officer" },
      "2D": { element_affinity: "Water", yin_yang: "Yang", ten_god: "Direct Wealth" }
    }
  },

  // ========================================
  // LEVEL 3: THE CRUSH TEXT 💕
  // Tests: Vulnerability, Romantic Patterns, Patience
  // ========================================
  {
    level: 3,
    title: "The Crush Text",
    emoji: "💕",
    category: "LOVE & ROMANCE",
    scenario: `You really like someone. You've been texting back and forth, and it felt like things were going well. Then... silence. It's been three days since they replied.`,
    question: "What do you do?",
    choices: [
      {
        id: "3A",
        text: "Send another text - maybe they just forgot to reply",
        emoji: "📱",
        traits: {
          conflict_style: "direct",
          emotional_processing: "external",
          communication_stress: "proactive",
          resolution_need: "immediate"
        }
      },
      {
        id: "3B",
        text: "Wait it out - if they're interested, they'll text back",
        emoji: "⏳",
        traits: {
          conflict_style: "patient",
          emotional_processing: "internal",
          communication_stress: "measured",
          resolution_need: "dignity"
        }
      },
      {
        id: "3C",
        text: "Ask a friend to find out what's going on",
        emoji: "🕵️",
        traits: {
          conflict_style: "indirect",
          emotional_processing: "social",
          communication_stress: "cautious",
          resolution_need: "information"
        }
      },
      {
        id: "3D",
        text: "Move on - if they wanted to talk, they would",
        emoji: "🚶",
        traits: {
          conflict_style: "protective",
          emotional_processing: "decisive",
          communication_stress: "guarded",
          resolution_need: "self-respect"
        }
      }
    ],
    psychological_dimension: "romantic_attachment",
    constitutional_mapping: {
      "3A": { element_affinity: "Fire", yin_yang: "Yang", ten_god: "7 Killings" },
      "3B": { element_affinity: "Water", yin_yang: "Yin", ten_god: "Indirect Resource" },
      "3C": { element_affinity: "Earth", yin_yang: "Yin", ten_god: "Friend" },
      "3D": { element_affinity: "Metal", yin_yang: "Yang", ten_god: "Hurting Officer" }
    }
  },

  // ========================================
  // LEVEL 4: THE FRIEND'S SECRET 🤫
  // Tests: Loyalty, Ethics, Relationships
  // ========================================
  {
    level: 4,
    title: "The Friend's Secret",
    emoji: "🤫",
    category: "FRIENDSHIP",
    scenario: `Your best friend tells you a secret about another friend in your group - something that could hurt them if it got out. A week later, that other friend asks you directly: "Do you know something I should know?"`,
    question: "What do you say?",
    choices: [
      {
        id: "4A",
        text: "Tell them the truth - they deserve to know",
        emoji: "💯",
        traits: {
          decision_style: "principled",
          risk_tolerance: "honest",
          change_orientation: "truth-focused",
          loyalty_pattern: "universal"
        }
      },
      {
        id: "4B",
        text: "Say you don't know anything - protect your best friend",
        emoji: "🤐",
        traits: {
          decision_style: "protective",
          risk_tolerance: "loyal",
          change_orientation: "relationship-focused",
          loyalty_pattern: "personal"
        }
      },
      {
        id: "4C",
        text: "Tell them to talk to your best friend directly",
        emoji: "🔄",
        traits: {
          decision_style: "diplomatic",
          risk_tolerance: "balanced",
          change_orientation: "solution-focused",
          loyalty_pattern: "mediating"
        }
      },
      {
        id: "4D",
        text: "Give hints without fully telling - let them figure it out",
        emoji: "🧩",
        traits: {
          decision_style: "subtle",
          risk_tolerance: "cautious",
          change_orientation: "indirect",
          loyalty_pattern: "conflicted"
        }
      }
    ],
    psychological_dimension: "loyalty_ethics",
    constitutional_mapping: {
      "4A": { element_affinity: "Metal", yin_yang: "Yang", ten_god: "Direct Officer" },
      "4B": { element_affinity: "Earth", yin_yang: "Yin", ten_god: "Friend" },
      "4C": { element_affinity: "Water", yin_yang: "Balanced", ten_god: "Eating God" },
      "4D": { element_affinity: "Wood", yin_yang: "Yin", ten_god: "Indirect Resource" }
    }
  },

  // ========================================
  // LEVEL 5: THE BIG TEST 📝
  // Tests: Pressure Response, Competition, Self-Worth
  // ========================================
  {
    level: 5,
    title: "The Big Test",
    emoji: "📝",
    category: "PRESSURE & STRESS",
    scenario: `You studied hard for an important exam. When results come out, you did okay - but your friend who barely studied got a higher score. They're celebrating while you're trying to process this.`,
    question: "What's going through your mind?",
    choices: [
      {
        id: "5A",
        text: "\"I should have studied harder. I need to work more.\"",
        emoji: "📚",
        traits: {
          inner_critic: "achiever",
          self_worth: "effort-based",
          core_fear: "not-enough",
          coping: "harder-work"
        }
      },
      {
        id: "5B",
        text: "\"Maybe I'm just not as smart as them. Some people are just gifted.\"",
        emoji: "😔",
        traits: {
          inner_critic: "comparing",
          self_worth: "ability-based",
          core_fear: "inferior",
          coping: "resignation"
        }
      },
      {
        id: "5C",
        text: "\"Good for them, but I know what I learned. Grades don't define me.\"",
        emoji: "🤷",
        traits: {
          inner_critic: "balanced",
          self_worth: "internal",
          core_fear: "none-strong",
          coping: "perspective"
        }
      },
      {
        id: "5D",
        text: "\"This is so unfair. I put in way more effort than they did.\"",
        emoji: "😤",
        traits: {
          inner_critic: "justice-focused",
          self_worth: "fairness-based",
          core_fear: "injustice",
          coping: "frustration"
        }
      }
    ],
    psychological_dimension: "pressure_response",
    constitutional_mapping: {
      "5A": { element_affinity: "Wood", yin_yang: "Yang", ten_god: "Direct Officer" },
      "5B": { element_affinity: "Water", yin_yang: "Yin", ten_god: "Indirect Resource" },
      "5C": { element_affinity: "Earth", yin_yang: "Balanced", ten_god: "Friend" },
      "5D": { element_affinity: "Fire", yin_yang: "Yang", ten_god: "7 Killings" }
    }
  },

  // ========================================
  // LEVEL 6: THE FAMILY DINNER 🍽️
  // Tests: Family Dynamics, Standing Up, Conflict
  // ========================================
  {
    level: 6,
    title: "The Family Dinner",
    emoji: "🍽️",
    category: "FAMILY",
    scenario: `At a family dinner, a relative makes a comment about your life choices - your job, relationship, or appearance. It stings, and everyone at the table heard it.`,
    question: "How do you respond in the moment?",
    choices: [
      {
        id: "6A",
        text: "Say something back - stand up for yourself right there",
        emoji: "🗣️",
        traits: {
          trust_pattern: "defensive",
          forgiveness_style: "immediate-response",
          self_protection: "confrontational",
          healing_approach: "direct"
        }
      },
      {
        id: "6B",
        text: "Let it go at dinner, but talk to them privately later",
        emoji: "⏰",
        traits: {
          trust_pattern: "strategic",
          forgiveness_style: "delayed",
          self_protection: "calculated",
          healing_approach: "private"
        }
      },
      {
        id: "6C",
        text: "Laugh it off and change the subject - not worth the drama",
        emoji: "😅",
        traits: {
          trust_pattern: "avoidant",
          forgiveness_style: "suppressing",
          self_protection: "deflecting",
          healing_approach: "minimizing"
        }
      },
      {
        id: "6D",
        text: "Stay quiet but let it hurt - you'll remember this",
        emoji: "😶",
        traits: {
          trust_pattern: "wounded",
          forgiveness_style: "internal-processing",
          self_protection: "absorbing",
          healing_approach: "resentful"
        }
      }
    ],
    psychological_dimension: "family_conflict",
    constitutional_mapping: {
      "6A": { element_affinity: "Fire", yin_yang: "Yang", ten_god: "7 Killings" },
      "6B": { element_affinity: "Metal", yin_yang: "Yang", ten_god: "Direct Officer" },
      "6C": { element_affinity: "Earth", yin_yang: "Yin", ten_god: "Friend" },
      "6D": { element_affinity: "Water", yin_yang: "Yin", ten_god: "Indirect Resource" }
    }
  },

  // ========================================
  // LEVEL 7: THE DREAM VS THE SAFE PATH 🎸
  // Tests: Risk Taking, Following Dreams, Practicality
  // ========================================
  {
    level: 7,
    title: "The Dream vs The Safe Path",
    emoji: "🎸",
    category: "LIFE CHOICES",
    scenario: `You have two options: A stable job that pays well but bores you, or chasing something you're passionate about that might not work out. People you trust are split on what you should do.`,
    question: "Which way do you lean?",
    choices: [
      {
        id: "7A",
        text: "Go for the dream - you only live once, and you'll always wonder \"what if\"",
        emoji: "🚀",
        traits: {
          life_purpose: "passion",
          values_primary: "fulfillment",
          mortality_response: "no-regrets",
          meaning_source: "following-heart"
        }
      },
      {
        id: "7B",
        text: "Take the stable job - build security first, dreams can come later",
        emoji: "🏠",
        traits: {
          life_purpose: "security",
          values_primary: "stability",
          mortality_response: "practical",
          meaning_source: "foundation"
        }
      },
      {
        id: "7C",
        text: "Find a middle path - keep the job, chase the dream on the side",
        emoji: "⚖️",
        traits: {
          life_purpose: "balance",
          values_primary: "both",
          mortality_response: "cautious-optimism",
          meaning_source: "compromise"
        }
      },
      {
        id: "7D",
        text: "Whatever feels right when the moment comes - plans change anyway",
        emoji: "🌊",
        traits: {
          life_purpose: "flow",
          values_primary: "flexibility",
          mortality_response: "present-focused",
          meaning_source: "adaptability"
        }
      }
    ],
    psychological_dimension: "life_philosophy",
    constitutional_mapping: {
      "7A": { element_affinity: "Fire", yin_yang: "Yang", ten_god: "Hurting Officer" },
      "7B": { element_affinity: "Earth", yin_yang: "Yin", ten_god: "Direct Wealth" },
      "7C": { element_affinity: "Metal", yin_yang: "Balanced", ten_god: "Direct Officer" },
      "7D": { element_affinity: "Water", yin_yang: "Yin", ten_god: "Eating God" }
    }
  },

  // ========================================
  // LEVEL 8: THE OLD FRIEND 👋
  // Tests: Forgiveness, Past Relationships, Moving Forward
  // ========================================
  {
    level: 8,
    title: "The Old Friend",
    emoji: "👋",
    category: "HEALING & GROWTH",
    scenario: `You run into someone you used to be close with - maybe an old best friend or an ex. You had a falling out years ago and never really talked about it. They smile and walk toward you.`,
    question: "What do you feel?",
    choices: [
      {
        id: "8A",
        text: "Happy to see them - people grow, and maybe you both have changed",
        emoji: "😊",
        traits: {
          self_perception: "forgiving",
          growth_edge: "openness",
          authentic_self: "optimistic",
          self_relationship: "healed"
        }
      },
      {
        id: "8B",
        text: "Guarded but curious - willing to talk, but keeping walls up",
        emoji: "🤔",
        traits: {
          self_perception: "cautious",
          growth_edge: "trust",
          authentic_self: "protective",
          self_relationship: "learning"
        }
      },
      {
        id: "8C",
        text: "Uncomfortable - too much history, prefer to keep walking",
        emoji: "😬",
        traits: {
          self_perception: "avoidant",
          growth_edge: "confronting-past",
          authentic_self: "guarded",
          self_relationship: "unresolved"
        }
      },
      {
        id: "8D",
        text: "A mix of everything - nostalgia, hurt, wonder about what could have been",
        emoji: "🥲",
        traits: {
          self_perception: "complex",
          growth_edge: "processing",
          authentic_self: "feeling-deeply",
          self_relationship: "evolving"
        }
      }
    ],
    psychological_dimension: "authentic_self",
    constitutional_mapping: {
      "8A": { element_affinity: "Fire", yin_yang: "Yang", ten_god: "Eating God" },
      "8B": { element_affinity: "Metal", yin_yang: "Balanced", ten_god: "Direct Officer" },
      "8C": { element_affinity: "Wood", yin_yang: "Yang", ten_god: "7 Killings" },
      "8D": { element_affinity: "Water", yin_yang: "Yin", ten_god: "Indirect Resource" }
    }
  }
];

/**
 * Psychological Dimensions mapped by assessment
 */
export const PSYCHOLOGICAL_DIMENSIONS = {
  social_energy: {
    name: "Social Energy",
    description: "How you recharge and connect",
    levels: [1]
  },
  social_comfort: {
    name: "Social Comfort",
    description: "How you handle new social situations",
    levels: [2]
  },
  romantic_attachment: {
    name: "Love & Romance",
    description: "How you handle romantic feelings and uncertainty",
    levels: [3]
  },
  loyalty_ethics: {
    name: "Loyalty & Ethics",
    description: "How you navigate friendship and truth",
    levels: [4]
  },
  pressure_response: {
    name: "Under Pressure",
    description: "How you handle setbacks and comparison",
    levels: [5]
  },
  family_conflict: {
    name: "Family Dynamics",
    description: "How you handle family tension",
    levels: [6]
  },
  life_philosophy: {
    name: "Dreams & Reality",
    description: "How you balance passion and practicality",
    levels: [7]
  },
  authentic_self: {
    name: "Healing & Growth",
    description: "How you handle your past",
    levels: [8]
  }
};

/**
 * Get story question by level
 */
export function getStoryQuestion(level) {
  return STORY_QUESTIONS.find(q => q.level === level);
}

/**
 * Get all story questions
 */
export function getAllStoryQuestions() {
  return STORY_QUESTIONS;
}

export default STORY_QUESTIONS;
