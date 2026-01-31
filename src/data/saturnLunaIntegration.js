/**
 * Saturn Luna Integration
 *
 * Behavioral triggers and response patterns for Luna to use when
 * detecting Saturn-related emotional states in the user.
 *
 * Includes:
 * - House-based triggers (what activates Saturn wound by life arena)
 * - Inner critic scripts (Saturn's voice + counter-scripts)
 * - Journaling prompts (therapeutic depth work)
 *
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// SATURN LUNA TRIGGERS (by house)
// ═══════════════════════════════════════════════════════════════════════════

export const SATURN_LUNA_TRIGGERS = {
  1: [
    "Feels criticized about identity",
    "Feels exposed or incompetent",
    "Avoids vulnerability to maintain control",
    "Takes on too much responsibility to prove worth",
    "Judges self harshly for perceived weakness"
  ],
  2: [
    "Feels financially insecure",
    "Feels undervalued or unappreciated",
    "Clings to routines or possessions",
    "Overworks to feel safe",
    "Ties self-worth to productivity"
  ],
  3: [
    "Feels misunderstood",
    "Over-explains to avoid being wrong",
    "Intellectualizes emotions",
    "Fears speaking up",
    "Anxious about communication mistakes"
  ],
  4: [
    "Withdraws emotionally",
    "Feels unsafe or unrooted",
    "Caretakes instead of expressing needs",
    "Carries family burdens",
    "Struggles with belonging"
  ],
  5: [
    "Avoids creative risks",
    "Feels judged or humiliated",
    "Over-perfects creative work",
    "Struggles to accept joy",
    "Fears visibility"
  ],
  6: [
    "Overworks to avoid feeling inadequate",
    "Becomes self-critical",
    "Feels responsible for everything",
    "Health anxiety when stressed",
    "Cannot rest without guilt"
  ],
  7: [
    "Avoids conflict",
    "People-pleases",
    "Feels unworthy of partnership",
    "Fears abandonment",
    "Loses self in relationships"
  ],
  8: [
    "Tests trust",
    "Withholds vulnerability",
    "Feels threatened by intimacy",
    "Control issues in close relationships",
    "Fear of being powerless"
  ],
  9: [
    "Becomes dogmatic",
    "Avoids commitment through philosophy",
    "Feels lost or meaningless",
    "Escapes into ideals",
    "Fears being wrong about big questions"
  ],
  10: [
    "Overworks",
    "Feels judged by society",
    "Avoids emotional expression to stay 'professional'",
    "Fears public failure",
    "Chases approval from authority figures"
  ],
  11: [
    "Feels like an outsider",
    "Detaches emotionally",
    "Rebels to protect individuality",
    "Struggles with group belonging",
    "Fears losing self in community"
  ],
  12: [
    "Withdraws into fantasy",
    "Feels overwhelmed",
    "Loses boundaries",
    "Self-sacrifices to avoid conflict",
    "Absorbs others' pain"
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// INNER CRITIC SCRIPTS
// ═══════════════════════════════════════════════════════════════════════════

export const SATURN_INNER_CRITIC_SCRIPTS = [
  {
    script: "You're not doing enough.",
    counter: "You are allowed to rest. Discipline includes recovery."
  },
  {
    script: "If you fail, everyone will see.",
    counter: "Courage is visible too. Imperfection is human."
  },
  {
    script: "You must handle this alone.",
    counter: "Support is strength, not weakness."
  },
  {
    script: "You should have known better.",
    counter: "Learning is not failure. It's Saturn's curriculum."
  },
  {
    script: "Don't show weakness.",
    counter: "Vulnerability is how real authority is born."
  },
  {
    script: "You haven't earned rest yet.",
    counter: "Rest is part of mastery, not a reward."
  },
  {
    script: "You're falling behind.",
    counter: "Saturn's timing is longer than anxiety's clock."
  },
  {
    script: "People are judging you.",
    counter: "The judge you fear most is internal."
  },
  {
    script: "You're not ready.",
    counter: "Readiness comes through action, not waiting."
  },
  {
    script: "If you ask for help, you're weak.",
    counter: "Asking for help is a form of strength."
  },
  {
    script: "You don't deserve success.",
    counter: "Success earned through effort is legitimately yours."
  },
  {
    script: "You're too old to start over.",
    counter: "Saturn rewards those who begin regardless of age."
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// JOURNALING PROMPTS (by house)
// ═══════════════════════════════════════════════════════════════════════════

export const SATURN_JOURNALING_PROMPTS = {
  1: [
    "Where did I learn that I must be strong to be accepted?",
    "What parts of myself do I hide to avoid judgment?",
    "What does true self-respect feel like in my body?",
    "When do I perform competence instead of feeling it?",
    "What would I be if no role protected me?"
  ],
  2: [
    "What do I believe I must earn before I can rest?",
    "Where does my fear of scarcity originate?",
    "What does 'enough' mean to me?",
    "How do I tie my worth to what I produce?",
    "What would I be worth if I achieved nothing?"
  ],
  3: [
    "When did I first learn that speaking was risky?",
    "What truths do I avoid saying out loud?",
    "How can I communicate without self-censorship?",
    "What ideas do I silence before they're fully formed?",
    "Whose voice do I hear when I doubt my mind?"
  ],
  4: [
    "What emotional patterns did I inherit?",
    "Where do I still feel unsafe?",
    "What does a 'home within myself' look like?",
    "Which family burdens are mine to carry?",
    "What part of my childhood needed more protection?"
  ],
  5: [
    "What creative risks do I avoid and why?",
    "Where did I learn that joy must be earned?",
    "What would I create if I feared no judgment?",
    "When do I let perfectionism kill spontaneity?",
    "What would imperfect play look like?"
  ],
  6: [
    "What standards do I hold myself to that no one else does?",
    "Where does my fear of failure live in my body?",
    "What would healthy discipline look like?",
    "When did usefulness become the price of love?",
    "What is good enough work?"
  ],
  7: [
    "What conflicts do I avoid and why?",
    "Where do I lose myself in relationships?",
    "What does a balanced partnership feel like?",
    "When do I choose peace over truth?",
    "What would I need to say if I weren't afraid of loss?"
  ],
  8: [
    "What am I afraid will happen if I fully trust someone?",
    "Where do I hold power too tightly?",
    "What part of me is ready to transform?",
    "What secrets do I keep that keep me alone?",
    "What would surrender without defeat look like?"
  ],
  9: [
    "What beliefs no longer serve me?",
    "Where do I use philosophy to avoid vulnerability?",
    "What truth am I being called to live?",
    "When do I escape into meaning instead of facing life?",
    "What would committed belief look like?"
  ],
  10: [
    "Whose approval am I still chasing?",
    "What does success mean to me now?",
    "What legacy do I want to build?",
    "When did achievement become the measure of my worth?",
    "What would I do if status didn't matter?"
  ],
  11: [
    "Where do I fear not belonging?",
    "What future am I secretly building?",
    "How can I belong without losing myself?",
    "When did being different become dangerous?",
    "What community would let me be fully me?"
  ],
  12: [
    "What emotions do I avoid because they feel too big?",
    "Where do I lose boundaries?",
    "What spiritual practices ground me?",
    "When do I sacrifice myself to avoid conflict?",
    "What would protected sensitivity look like?"
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get Luna triggers for a given house
 * @param {number} house - House number (1-12)
 * @returns {Array} Array of trigger phrases
 */
export function getLunaTriggers(house) {
  return SATURN_LUNA_TRIGGERS[house] || [];
}

/**
 * Get journaling prompts for a given house
 * @param {number} house - House number (1-12)
 * @returns {Array} Array of journaling prompts
 */
export function getJournalingPrompts(house) {
  return SATURN_JOURNALING_PROMPTS[house] || [];
}

/**
 * Get a random inner critic script
 * @returns {Object} { script, counter }
 */
export function getRandomInnerCriticScript() {
  const idx = Math.floor(Math.random() * SATURN_INNER_CRITIC_SCRIPTS.length);
  return SATURN_INNER_CRITIC_SCRIPTS[idx];
}

/**
 * Get inner critic scripts relevant to a house
 * @param {number} house - House number
 * @returns {Array} Relevant scripts
 */
export function getInnerCriticScriptsForHouse(house) {
  // Map houses to most relevant scripts
  const houseScriptMap = {
    1: [0, 4, 3],     // "not enough", "don't show weakness", "should have known"
    2: [0, 5, 10],    // "not enough", "haven't earned rest", "don't deserve"
    3: [3, 8, 7],     // "should have known", "not ready", "people judging"
    4: [2, 9, 6],     // "handle alone", "ask for help = weak", "falling behind"
    5: [1, 4, 8],     // "everyone will see", "don't show weakness", "not ready"
    6: [0, 5, 10],    // "not enough", "haven't earned", "don't deserve"
    7: [9, 4, 1],     // "ask = weak", "don't show weakness", "everyone will see"
    8: [2, 4, 9],     // "handle alone", "don't show weakness", "ask = weak"
    9: [3, 7, 11],    // "should have known", "judging", "too old"
    10: [0, 7, 10],   // "not enough", "judging", "don't deserve"
    11: [2, 7, 9],    // "handle alone", "judging", "ask = weak"
    12: [4, 2, 5]     // "don't show weakness", "handle alone", "haven't earned"
  };

  const indices = houseScriptMap[house] || [0, 1, 2];
  return indices.map(i => SATURN_INNER_CRITIC_SCRIPTS[i]);
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  SATURN_LUNA_TRIGGERS,
  SATURN_INNER_CRITIC_SCRIPTS,
  SATURN_JOURNALING_PROMPTS,
  getLunaTriggers,
  getJournalingPrompts,
  getRandomInnerCriticScript,
  getInnerCriticScriptsForHouse
};
