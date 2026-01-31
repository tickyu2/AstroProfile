/**
 * Saturn Cathedral Path
 *
 * The 12 Saturn initiation chambers - one for each house.
 * Each chamber represents a threshold in the Saturn Journey where
 * specific psychological work must be done.
 *
 * Based on Liz Greene's approach to Saturn as initiator.
 *
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// MYTHIC TITLES FOR HOUSES
// ═══════════════════════════════════════════════════════════════════════════

export const SATURN_MYTHIC_TITLES = {
  1: "The Gate of the Self-Forged",
  2: "The Vault of Worth",
  3: "The Scriptorium of Truth",
  4: "The Ancestral Hearth",
  5: "The Chamber of Radiant Risk",
  6: "The Hall of Sacred Labor",
  7: "The Mirror of Sacred Contracts",
  8: "The Crypt of Transformation",
  9: "The Observatory of Meaning",
  10: "The Tower of Legacy",
  11: "The Constellation Forge",
  12: "The Veiled Sanctuary"
};

// ═══════════════════════════════════════════════════════════════════════════
// SATURN CATHEDRAL PATH - 12 CHAMBERS
// ═══════════════════════════════════════════════════════════════════════════

export const SATURN_CATHEDRAL_PATH = [
  {
    house: 1,
    key: "saturn_house_1",
    title: "The Gate of the Self-Forged",
    theme: "Responsibility for identity and presence.",
    thresholdQuestion: "Who am I when no role protects me?",
    riteOfPassage: "Standing in your own name without apology or disguise.",
    guardianTest: "Can you be yourself without performing competence?",
    shadowMaterial: "The fear of being seen as inadequate.",
    initiationGift: "Authentic self-authority; quiet presence.",
    chamberColor: "Iron Gray",
    chamberElement: "Stone and Mirror"
  },
  {
    house: 2,
    key: "saturn_house_2",
    title: "The Vault of Worth",
    theme: "Responsibility for value, resources, and self-worth.",
    thresholdQuestion: "What do I believe I must earn to deserve rest?",
    riteOfPassage: "Redefining worth beyond productivity or possessions.",
    guardianTest: "Can you feel valuable when you own nothing?",
    shadowMaterial: "The fear of scarcity and loss.",
    initiationGift: "Inner security; knowing true value.",
    chamberColor: "Copper",
    chamberElement: "Gold and Earth"
  },
  {
    house: 3,
    key: "saturn_house_3",
    title: "The Scriptorium of Truth",
    theme: "Responsibility for words, thought, and learning.",
    thresholdQuestion: "What truths do I silence to stay safe?",
    riteOfPassage: "Speaking with integrity even when your voice shakes.",
    guardianTest: "Can you say the true thing without certainty of reception?",
    shadowMaterial: "The fear of being wrong or misunderstood.",
    initiationGift: "Clear communication; earned mental authority.",
    chamberColor: "Silver",
    chamberElement: "Parchment and Quill"
  },
  {
    house: 4,
    key: "saturn_house_4",
    title: "The Ancestral Hearth",
    theme: "Responsibility for roots, family, and emotional foundations.",
    thresholdQuestion: "Which burdens are mine, and which belong to my lineage?",
    riteOfPassage: "Choosing which ancestral patterns end with you.",
    guardianTest: "Can you honor your roots without being bound by them?",
    shadowMaterial: "The fear of emotional abandonment and rootlessness.",
    initiationGift: "True sanctuary; lineage healing.",
    chamberColor: "Deep Blue",
    chamberElement: "Hearth and Stone"
  },
  {
    house: 5,
    key: "saturn_house_5",
    title: "The Chamber of Radiant Risk",
    theme: "Responsibility for creativity, joy, and visibility.",
    thresholdQuestion: "What would I create if I feared no judgment?",
    riteOfPassage: "Letting your heart be seen without guarantees.",
    guardianTest: "Can you create imperfectly and still feel worthy?",
    shadowMaterial: "The fear of creative rejection and humiliation.",
    initiationGift: "Disciplined artistry; earned creative authority.",
    chamberColor: "Gold",
    chamberElement: "Light and Stage"
  },
  {
    house: 6,
    key: "saturn_house_6",
    title: "The Hall of Sacred Labor",
    theme: "Responsibility for work, service, and craft.",
    thresholdQuestion: "Where do I confuse self-worth with usefulness?",
    riteOfPassage: "Choosing sustainable devotion over self-erasure.",
    guardianTest: "Can you serve without losing yourself?",
    shadowMaterial: "The fear of being useless or inadequate.",
    initiationGift: "Mastery of craft; healthy discipline.",
    chamberColor: "Forest Green",
    chamberElement: "Tool and Workbench"
  },
  {
    house: 7,
    key: "saturn_house_7",
    title: "The Mirror of Sacred Contracts",
    theme: "Responsibility for partnership and commitment.",
    thresholdQuestion: "What do I fear most in true mutuality?",
    riteOfPassage: "Entering agreements where you are fully present, not half-vanished.",
    guardianTest: "Can you stay whole while deeply connected?",
    shadowMaterial: "The fear of rejection and abandonment in love.",
    initiationGift: "Mature partnership; relational wisdom.",
    chamberColor: "Rose",
    chamberElement: "Mirror and Balance"
  },
  {
    house: 8,
    key: "saturn_house_8",
    title: "The Crypt of Transformation",
    theme: "Responsibility for power, intimacy, and shared resources.",
    thresholdQuestion: "What am I afraid will happen if I fully trust?",
    riteOfPassage: "Letting an old identity die so a truer one can live.",
    guardianTest: "Can you surrender control without losing power?",
    shadowMaterial: "The fear of betrayal, exposure, and powerlessness.",
    initiationGift: "Transformative leadership; depth of intimacy.",
    chamberColor: "Obsidian",
    chamberElement: "Shadow and Flame"
  },
  {
    house: 9,
    key: "saturn_house_9",
    title: "The Observatory of Meaning",
    theme: "Responsibility for belief, truth, and worldview.",
    thresholdQuestion: "Which beliefs keep me safe but small?",
    riteOfPassage: "Living a truth you can no longer just think about.",
    guardianTest: "Can you commit to meaning while holding uncertainty?",
    shadowMaterial: "The fear of meaninglessness and wrong belief.",
    initiationGift: "Hard-won wisdom; teaching authority.",
    chamberColor: "Purple",
    chamberElement: "Star Map and Book"
  },
  {
    house: 10,
    key: "saturn_house_10",
    title: "The Tower of Legacy",
    theme: "Responsibility for career, status, and public role.",
    thresholdQuestion: "Whose approval am I still chasing?",
    riteOfPassage: "Defining success on your own terms and acting accordingly.",
    guardianTest: "Can you build without needing applause?",
    shadowMaterial: "The fear of public failure and wasted potential.",
    initiationGift: "Lasting achievement; respected authority.",
    chamberColor: "Mountain Gray",
    chamberElement: "Stone Tower and Flag"
  },
  {
    house: 11,
    key: "saturn_house_11",
    title: "The Constellation Forge",
    theme: "Responsibility for community, future, and contribution.",
    thresholdQuestion: "Where do I exile myself to avoid disappointment?",
    riteOfPassage: "Choosing your people and your future on purpose.",
    guardianTest: "Can you belong without losing your uniqueness?",
    shadowMaterial: "The fear of exile and failed ideals.",
    initiationGift: "Visionary architecture; community building.",
    chamberColor: "Electric Blue",
    chamberElement: "Star and Network"
  },
  {
    house: 12,
    key: "saturn_house_12",
    title: "The Veiled Sanctuary",
    theme: "Responsibility for the unseen, the unconscious, and surrender.",
    thresholdQuestion: "What do I refuse to feel because it feels too big?",
    riteOfPassage: "Letting go of control where control was never possible.",
    guardianTest: "Can you be present without dissolving?",
    shadowMaterial: "The fear of being overwhelmed and lost.",
    initiationGift: "Grounded spirituality; compassionate wisdom.",
    chamberColor: "Sea Mist",
    chamberElement: "Veil and Water"
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get the Saturn chamber for a given house
 * @param {number} house - House number (1-12)
 * @returns {Object|null} Chamber data or null
 */
export function getSaturnChamber(house) {
  return SATURN_CATHEDRAL_PATH.find(c => c.house === house) || null;
}

/**
 * Get the mythic title for a given house
 * @param {number} house - House number (1-12)
 * @returns {string} Mythic title
 */
export function getSaturnMythicTitle(house) {
  return SATURN_MYTHIC_TITLES[house] || "The Stone Gate";
}

/**
 * Get all chambers
 * @returns {Array} All 12 chambers
 */
export function getAllSaturnChambers() {
  return SATURN_CATHEDRAL_PATH;
}

/**
 * Get chamber by key
 * @param {string} key - Chamber key (e.g., "saturn_house_1")
 * @returns {Object|null} Chamber data
 */
export function getSaturnChamberByKey(key) {
  return SATURN_CATHEDRAL_PATH.find(c => c.key === key) || null;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  SATURN_MYTHIC_TITLES,
  SATURN_CATHEDRAL_PATH,
  getSaturnChamber,
  getSaturnMythicTitle,
  getAllSaturnChambers,
  getSaturnChamberByKey
};
