/**
 * ============================================================================
 * EPOCH NAMING SYSTEM
 * ============================================================================
 * Gives poetic, mythic names to life epochs based on the chart.
 * Rising sign flavors the naming to honor the soul's unique lens.
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

/**
 * Rising sign flavors for epoch naming
 * Each sign brings its own mythic quality to the journey
 */
export const RISING_FLAVORS = {
  Aries: {
    earlyLife: "The First Flame",
    apprenticeship: "The Warrior's Training",
    becoming: "The Battle for Self",
    saturnReturn: "The Hero's Threshold",
    expansion: "The Conquest of Vision",
    greatTurning: "The Fire Reborn",
    harvest: "The Champion's Rest",
    elderFlame: "The Eternal Spark"
  },
  Taurus: {
    earlyLife: "The Rooting",
    apprenticeship: "The Soil of Learning",
    becoming: "The Garden Takes Shape",
    saturnReturn: "The Pruning",
    expansion: "The Abundant Harvest",
    greatTurning: "The Earth Renews",
    harvest: "The Orchard's Wisdom",
    elderFlame: "The Ancient Grove"
  },
  Gemini: {
    earlyLife: "The Winged Years",
    apprenticeship: "The Dance of Words",
    becoming: "Two Paths, One Soul",
    saturnReturn: "The Mind's Crucible",
    expansion: "The Messenger's Journey",
    greatTurning: "The Bridge Between Worlds",
    harvest: "The Stories Gathered",
    elderFlame: "The Eternal Conversation"
  },
  Cancer: {
    earlyLife: "The Tidal Era",
    apprenticeship: "The Shell Forms",
    becoming: "The Home Within",
    saturnReturn: "The Mother's Wisdom",
    expansion: "The Nurturing Expands",
    greatTurning: "The Depths Revealed",
    harvest: "The Family Tree",
    elderFlame: "The Silver Moon"
  },
  Leo: {
    earlyLife: "The Golden Chapter",
    apprenticeship: "The Young Lion",
    becoming: "The Crown Takes Shape",
    saturnReturn: "The King's Trial",
    expansion: "The Radiant Kingdom",
    greatTurning: "The Sun Sets to Rise",
    harvest: "The Legacy of Light",
    elderFlame: "The Eternal Sun"
  },
  Virgo: {
    earlyLife: "The Refining",
    apprenticeship: "The Craft Begins",
    becoming: "The Vessel Takes Form",
    saturnReturn: "The Perfectionist's Peace",
    expansion: "The Healing Arts",
    greatTurning: "The Sacred Service",
    harvest: "The Master's Hand",
    elderFlame: "The Wise Healer"
  },
  Libra: {
    earlyLife: "The Harmonizing",
    apprenticeship: "The Mirror's Lessons",
    becoming: "The Dance of Partnership",
    saturnReturn: "The Scales Balance",
    expansion: "Beauty Multiplied",
    greatTurning: "The Justice of Time",
    harvest: "The Art of Relationship",
    elderFlame: "The Peace Keeper"
  },
  Scorpio: {
    earlyLife: "The Descent",
    apprenticeship: "The Mysteries Beckon",
    becoming: "Death and Rebirth Begin",
    saturnReturn: "The Phoenix Rising",
    expansion: "The Power Wielded",
    greatTurning: "The Underworld Mastered",
    harvest: "The Transformer",
    elderFlame: "The Eternal Phoenix"
  },
  Sagittarius: {
    earlyLife: "The Pilgrimage",
    apprenticeship: "The Arrow Drawn",
    becoming: "The Quest Begins",
    saturnReturn: "The Truth Seeker's Test",
    expansion: "The Boundless Horizon",
    greatTurning: "The Philosopher's Stone",
    harvest: "The Teacher Emerges",
    elderFlame: "The Eternal Pilgrim"
  },
  Capricorn: {
    earlyLife: "The Mountain Path",
    apprenticeship: "The Foundations Laid",
    becoming: "The Climb Begins",
    saturnReturn: "The Summit Reached",
    expansion: "The Builder's Vision",
    greatTurning: "The Stone Cathedral",
    harvest: "The Elder Statesman",
    elderFlame: "The Mountain Sage"
  },
  Aquarius: {
    earlyLife: "The Awakening",
    apprenticeship: "The Different Path",
    becoming: "The Rebel's Road",
    saturnReturn: "The Vision Crystallizes",
    expansion: "The Revolution Expands",
    greatTurning: "The Future Made Present",
    harvest: "The Community Weaver",
    elderFlame: "The Star Keeper"
  },
  Pisces: {
    earlyLife: "The Dreaming",
    apprenticeship: "The Ocean Calls",
    becoming: "The Boundaries Dissolve",
    saturnReturn: "The Dream Made Real",
    expansion: "The Mystic's Journey",
    greatTurning: "The Union of All",
    harvest: "The Healer's Gift",
    elderFlame: "The Eternal Ocean"
  }
};

/**
 * Epoch label to key mapping
 */
const EPOCH_KEYS = {
  "Early Life": "earlyLife",
  "Apprenticeship": "apprenticeship",
  "Becoming": "becoming",
  "Saturn Return": "saturnReturn",
  "Expansion": "expansion",
  "The Great Turning": "greatTurning",
  "The Harvest": "harvest",
  "The Elder Flame": "elderFlame"
};

/**
 * Name an epoch with poetic, rising-sign-flavored title
 * @param {Object} epoch - The epoch object with label property
 * @param {string} risingSign - The rising sign (e.g., "Libra")
 * @returns {string} Poetic epoch name
 */
export function nameEpoch(epoch, risingSign) {
  const base = epoch.label;
  const epochKey = EPOCH_KEYS[base];

  // Get rising-specific flavor
  const signFlavors = RISING_FLAVORS[risingSign];
  const flavor = signFlavors?.[epochKey] || getDefaultFlavor(base);

  return `${base}: ${flavor}`;
}

/**
 * Get just the flavor portion of the name
 * @param {Object} epoch - The epoch object
 * @param {string} risingSign - The rising sign
 * @returns {string} Just the flavor/subtitle
 */
export function getEpochFlavor(epoch, risingSign) {
  const epochKey = EPOCH_KEYS[epoch.label];
  const signFlavors = RISING_FLAVORS[risingSign];
  return signFlavors?.[epochKey] || getDefaultFlavor(epoch.label);
}

/**
 * Get default flavor for unknown epochs
 * @param {string} label - Epoch label
 * @returns {string} Default flavor
 */
function getDefaultFlavor(label) {
  const defaults = {
    "Early Life": "The Rooting",
    "Apprenticeship": "The Learning",
    "Becoming": "The Shaping",
    "Saturn Return": "The Threshold",
    "Expansion": "The Widening",
    "The Great Turning": "The Transformation",
    "The Harvest": "The Gathering",
    "The Elder Flame": "The Wisdom Years"
  };
  return defaults[label] || "The Turning";
}

/**
 * Get all flavors for a rising sign
 * @param {string} risingSign - The rising sign
 * @returns {Object} All flavors for that sign
 */
export function getAllFlavorsForSign(risingSign) {
  return RISING_FLAVORS[risingSign] || RISING_FLAVORS.Aries;
}

export default {
  nameEpoch,
  getEpochFlavor,
  getAllFlavorsForSign,
  RISING_FLAVORS
};
