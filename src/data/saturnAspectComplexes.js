/**
 * Saturn Aspect Complexes
 *
 * Liz Greene-style psychological complexes for Saturn aspects.
 * These are the deep psychological patterns that form when Saturn
 * makes major aspects to personal planets.
 *
 * Each complex includes:
 * - Wound: The psychological injury
 * - Defense: How the psyche protects itself
 * - Gift: The mastery that emerges through integration
 * - Triggers: What activates this complex
 *
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// SATURN ASPECT COMPLEXES
// ═══════════════════════════════════════════════════════════════════════════

export const SATURN_ASPECT_COMPLEXES = {
  "Moon-Saturn": {
    wound: "Emotional deprivation; fear of needing too much.",
    defense: "Self-sufficiency, emotional withdrawal, caretaking others instead of receiving care.",
    gift: "Emotional endurance, deep empathy, capacity to hold others through difficulty.",
    triggers: [
      "Feeling emotionally unsupported",
      "Being told you're 'too sensitive'",
      "Having needs dismissed or minimized",
      "Feeling responsible for others' emotions"
    ],
    integrationPath: "Learning to nurture without abandoning needs; letting others care for you."
  },

  "Sun-Saturn": {
    wound: "Fear of inadequacy; identity shaped by judgment.",
    defense: "Overachievement, perfectionism, rigid self-control.",
    gift: "Integrity, earned authority, reliability under pressure.",
    triggers: [
      "Criticism of competence",
      "Feeling unseen or unrecognized",
      "Being compared to others",
      "High expectations without support"
    ],
    integrationPath: "Becoming your own father figure; defining success internally."
  },

  "Venus-Saturn": {
    wound: "Fear of rejection; love tied to performance or worthiness.",
    defense: "Guarded heart, testing partners, withholding affection.",
    gift: "Loyalty, devotion, mature love that endures difficulty.",
    triggers: [
      "Feeling unappreciated",
      "Fear of abandonment",
      "Receiving affection you don't trust",
      "Being asked to be vulnerable"
    ],
    integrationPath: "Receiving love without earning it; trusting that affection is real."
  },

  "Mars-Saturn": {
    wound: "Blocked will; fear of misusing power or acting wrongly.",
    defense: "Inhibition, passive-aggression, strategic avoidance.",
    gift: "Disciplined action, strategic courage, mastery under pressure.",
    triggers: [
      "Conflict or confrontation",
      "Feeling powerless",
      "Being rushed into decisions",
      "Having your competence questioned"
    ],
    integrationPath: "Using force appropriately; acting with clean aggression when needed."
  },

  "Mercury-Saturn": {
    wound: "Fear of being wrong; mind under constant pressure.",
    defense: "Over-preparation, mental rigidity, fear of speaking.",
    gift: "Disciplined thinking, mastery of systems, clear communication.",
    triggers: [
      "Being put on the spot",
      "Having to speak without preparation",
      "Mental errors being noticed",
      "Academic or intellectual comparison"
    ],
    integrationPath: "Speaking with authority, not just caution; trusting your mind."
  },

  "Jupiter-Saturn": {
    wound: "Pessimism blocking growth; fear of expansion.",
    defense: "Cynicism, refusing opportunities, staying small.",
    gift: "Grounded optimism, realistic growth, sustainable expansion.",
    triggers: [
      "Opportunities that feel too good",
      "Having to take leaps of faith",
      "Being asked to be positive",
      "Others' easy success"
    ],
    integrationPath: "Balancing hope and reality; growing within wise limits."
  },

  "Uranus-Saturn": {
    wound: "Fear vs. need for change; feeling trapped by tradition.",
    defense: "Rebellion without direction, or rigidity against all change.",
    gift: "Structured innovation, lasting reform, change that endures.",
    triggers: [
      "Being forced to conform",
      "Sudden disruptions to plans",
      "Feeling too different to belong",
      "Authority restricting freedom"
    ],
    integrationPath: "Making change that endures; innovation with structure."
  },

  "Neptune-Saturn": {
    wound: "Spiritual disillusionment; confusion about limits.",
    defense: "Either cynical materialism or spiritual escapism.",
    gift: "Grounded spirituality, practical compassion, making ideals real.",
    triggers: [
      "Disappointment in ideals",
      "Feeling spiritually abandoned",
      "Confusion about what's real",
      "Dreams not manifesting"
    ],
    integrationPath: "Making the ideal real; spirituality with structure."
  },

  "Pluto-Saturn": {
    wound: "Power struggles with authority; fear of loss of control.",
    defense: "Either submission to power or obsessive control.",
    gift: "Transformative leadership, deep endurance, wielding power wisely.",
    triggers: [
      "Power being taken away",
      "Having to surrender control",
      "Facing mortality or endings",
      "Authority figures who dominate"
    ],
    integrationPath: "Wielding power without control addiction; accepting death-rebirth cycles."
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// ASPECT QUALITY MODIFIERS
// ═══════════════════════════════════════════════════════════════════════════

export const ASPECT_QUALITY_MODIFIERS = {
  conjunction: {
    intensity: "The energies are fused; the complex is always active.",
    expression: "The Saturn theme is woven into the planet's core expression."
  },
  opposition: {
    intensity: "The energies are polarized; projected onto others.",
    expression: "Saturn themes often appear through relationships or external circumstances."
  },
  square: {
    intensity: "The energies are in friction; creates action through pressure.",
    expression: "The complex demands integration through crisis and effort."
  },
  trine: {
    intensity: "The energies flow easily; may be taken for granted.",
    expression: "Saturn's gifts are accessible but may require conscious activation."
  },
  sextile: {
    intensity: "The energies offer opportunity; requires initiative.",
    expression: "Saturn's structure supports the planet when effort is applied."
  },
  quincunx: {
    intensity: "The energies don't connect naturally; requires adjustment.",
    expression: "Saturn themes feel foreign but demand integration through health or service."
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get aspect complex for a Saturn-planet aspect
 * @param {string} planet - The planet aspecting Saturn
 * @returns {Object|null} The aspect complex
 */
export function getSaturnAspectComplex(planet) {
  // Normalize the key
  const key = `${planet}-Saturn`;
  return SATURN_ASPECT_COMPLEXES[key] || null;
}

/**
 * Get aspect quality modifier
 * @param {string} aspectType - Type of aspect
 * @returns {Object|null} Quality modifier
 */
export function getAspectQualityModifier(aspectType) {
  return ASPECT_QUALITY_MODIFIERS[aspectType.toLowerCase()] || null;
}

/**
 * Build complete aspect analysis
 * @param {string} planet - Planet name
 * @param {string} aspectType - Aspect type
 * @returns {Object} Complete aspect analysis
 */
export function buildSaturnAspectAnalysis(planet, aspectType) {
  const complex = getSaturnAspectComplex(planet);
  const quality = getAspectQualityModifier(aspectType);

  if (!complex) {
    return null;
  }

  return {
    complex,
    quality,
    summary: `${planet}-Saturn ${aspectType}: ${complex.wound} → ${complex.gift}`
  };
}

/**
 * Get all aspect complexes for a list of aspects
 * @param {Array} aspects - Array of aspect objects with planet1, planet2, type
 * @returns {Array} Array of aspect complexes
 */
export function getAspectComplexesFromNatal(aspects) {
  if (!aspects || !Array.isArray(aspects)) return [];

  return aspects
    .filter(a => {
      const p1 = (a.planet1 || '').toLowerCase();
      const p2 = (a.planet2 || '').toLowerCase();
      return p1 === 'saturn' || p2 === 'saturn';
    })
    .map(a => {
      const otherPlanet = a.planet1.toLowerCase() === 'saturn' ? a.planet2 : a.planet1;
      const complex = getSaturnAspectComplex(capitalize(otherPlanet));
      const quality = getAspectQualityModifier(a.aspect || a.type);

      if (!complex) return null;

      return {
        planet: capitalize(otherPlanet),
        aspectType: a.aspect || a.type,
        ...complex,
        quality
      };
    })
    .filter(Boolean);
}

/**
 * Capitalize first letter
 */
function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  SATURN_ASPECT_COMPLEXES,
  ASPECT_QUALITY_MODIFIERS,
  getSaturnAspectComplex,
  getAspectQualityModifier,
  buildSaturnAspectAnalysis,
  getAspectComplexesFromNatal
};
