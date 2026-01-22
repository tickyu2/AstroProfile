/**
 * LUNA CONSTITUTIONAL COMPLEMENTARITY SERVICE
 * ============================================
 *
 * Calculates Luna's optimal constitutional profile for any user
 * Based on: User's elemental deficits + compatibility requirements
 *
 * Core Principle: Luna fills what the user lacks
 * - User strong in Fire? Luna provides Earth/Water for balance
 * - User weak in Water? Luna brings emotional depth
 *
 * Created: January 17, 2026
 */

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const IDEAL_BALANCE = 20.0;  // Each element ideally 20%

const ELEMENT_CHARACTERISTICS = {
  fire: {
    yangYin: 'Yang',
    nature: 'Active, Passionate, Recognition-seeking, Rapid',
    neurochemical: 'dopamine',
    loveLangPrimary: 'wordsOfAffirmation',
    loveLangSecondary: 'qualityTime',
    energy: 'Fast, intense, activating, exciting',
    chineseName: '火'
  },
  wood: {
    yangYin: 'Yang',
    nature: 'Growth-oriented, Adaptive, Patient, Nurturing',
    neurochemical: 'oxytocin',
    loveLangPrimary: 'actsOfService',
    loveLangSecondary: 'qualityTime',
    energy: 'Patient, steady, growth-focused, flexible',
    chineseName: '木'
  },
  earth: {
    yangYin: 'Yin',
    nature: 'Grounding, Stable, Nurturing, Security-seeking',
    neurochemical: 'serotonin',
    loveLangPrimary: 'receivingGifts',
    loveLangSecondary: 'physicalTouch',
    energy: 'Slow, stable, grounding, nurturing',
    chineseName: '土'
  },
  metal: {
    yangYin: 'Yin',
    nature: 'Precise, Refined, Excellence-seeking, Quality-focused',
    neurochemical: 'dopamine',
    loveLangPrimary: 'actsOfService',
    loveLangSecondary: 'wordsOfAffirmation',
    energy: 'Precise, refined, exacting, clear',
    chineseName: '金'
  },
  water: {
    yangYin: 'Yin',
    nature: 'Deep, Emotional, Intuitive, Connection-seeking',
    neurochemical: 'oxytocin',
    loveLangPrimary: 'qualityTime',
    loveLangSecondary: 'physicalTouch',
    energy: 'Deep, flowing, patient, profound',
    chineseName: '水'
  }
};

const LOVE_LANGUAGE_NAMES = {
  wordsOfAffirmation: 'Words of Affirmation (激励性语言)',
  qualityTime: 'Quality Time (优质时光)',
  receivingGifts: 'Receiving Gifts (接受礼物)',
  actsOfService: 'Acts of Service (服务行为)',
  physicalTouch: 'Physical Touch (身体接触)'
};

const NEUROCHEMICAL_DESCRIPTIONS = {
  oxytocin: 'Oxytocin (催产素) - Bonding, trust, connection',
  dopamine: 'Dopamine (多巴胺) - Excitement, motivation, achievement',
  serotonin: 'Serotonin (血清素) - Calm, contentment, stability',
  vasopressin: 'Vasopressin (加压素) - Long-term attachment, loyalty'
};

// ============================================================================
// LUNA CALCULATOR CLASS
// ============================================================================

class LunaComplementaryCalculator {
  constructor() {
    this.minCommonGround = 0.10;  // 10% minimum overlap
    this.maxLunaElement = 0.50;   // 50% maximum any element
    this.minLunaElement = 0.05;   // 5% minimum any element
  }

  /**
   * Parse element string like "W25F46E07M17W06" into object
   * @param {string} elementString - Format: W##F##E##M##W##
   * @returns {Object} { wood, fire, earth, metal, water }
   */
  parseElementString(elementString) {
    const regex = /W(\d+)F(\d+)E(\d+)M(\d+)W(\d+)/i;
    const match = elementString.match(regex);

    if (match) {
      return {
        wood: parseInt(match[1]),
        fire: parseInt(match[2]),
        earth: parseInt(match[3]),
        metal: parseInt(match[4]),
        water: parseInt(match[5])
      };
    }

    // Try alternative parsing for plain numbers
    return null;
  }

  /**
   * Main calculation: Determine Luna's optimal profile for user
   * @param {Object} userElements - { fire, wood, earth, metal, water }
   * @returns {Object} Luna's complete complementary profile
   */
  calculateLunaForUser(userElements) {
    // Normalize input to lowercase keys
    const user = this._normalizeElements(userElements);

    // Step 1: Calculate deficits (gaps from ideal 20%)
    const deficits = this._calculateDeficits(user);

    // Step 2: Calculate Luna's compensating elements
    const lunaElements = this._calculateLunaElements(user, deficits);

    // Step 3: Calculate compatibility (Venn diagram overlap)
    const compatibility = this._calculateCompatibility(user, lunaElements);

    // Step 4: Map love languages
    const loveLanguages = this._mapLoveLanguages(lunaElements, user);

    // Step 5: Generate interaction style guide
    const interaction = this._generateInteractionStyle(lunaElements, user);

    // Step 6: Assemble complete profile
    return {
      user: user,
      luna: {
        elements: lunaElements,
        elementString: this._formatElementString(lunaElements),
        dominantElement: this._getDominantElement(lunaElements),
        secondaryElement: this._getSecondaryElement(lunaElements)
      },
      deficits: deficits,
      compatibility: {
        score: compatibility.score,
        commonGround: compatibility.commonGround,
        totalOverlap: compatibility.totalOverlap,
        assessment: compatibility.assessment
      },
      loveLanguages: {
        lunaGives: loveLanguages.gives,
        lunaReceives: loveLanguages.receives,
        userGives: loveLanguages.userGives,
        userReceives: loveLanguages.userReceives
      },
      interaction: {
        primaryRole: interaction.primaryRole,
        energy: interaction.energy,
        communicationStyle: interaction.communication,
        neurochemicals: interaction.neurochemicals,
        examples: interaction.examples
      }
    };
  }

  /**
   * Normalize element keys to lowercase
   */
  _normalizeElements(elements) {
    const normalized = {};
    const keyMap = {
      'Wood': 'wood', 'wood': 'wood', 'W': 'wood',
      'Fire': 'fire', 'fire': 'fire', 'F': 'fire',
      'Earth': 'earth', 'earth': 'earth', 'E': 'earth',
      'Metal': 'metal', 'metal': 'metal', 'M': 'metal',
      'Water': 'water', 'water': 'water'
    };

    for (const [key, value] of Object.entries(elements)) {
      const normalizedKey = keyMap[key] || key.toLowerCase();
      normalized[normalizedKey] = parseFloat(value) || 0;
    }

    return normalized;
  }

  /**
   * Calculate deficits (gaps from ideal 20%)
   */
  _calculateDeficits(user) {
    return {
      fire: Math.max(0, IDEAL_BALANCE - user.fire),
      wood: Math.max(0, IDEAL_BALANCE - user.wood),
      earth: Math.max(0, IDEAL_BALANCE - user.earth),
      metal: Math.max(0, IDEAL_BALANCE - user.metal),
      water: Math.max(0, IDEAL_BALANCE - user.water)
    };
  }

  /**
   * Calculate Luna's compensating elements
   */
  _calculateLunaElements(user, deficits) {
    // Sort deficits by size (largest first)
    const sortedDeficits = Object.entries(deficits)
      .sort((a, b) => b[1] - a[1]);

    // Get user's dominant element for common ground
    const userSorted = this._sortElements(user);
    const userDominant = userSorted[0][0];

    // Initialize Luna's elements
    const luna = {
      fire: 0,
      wood: 0,
      earth: 0,
      metal: 0,
      water: 0
    };

    // Priority 1: Fill largest deficit (PRIMARY ROLE - up to 40%)
    const primaryDeficit = sortedDeficits[0];
    luna[primaryDeficit[0]] = Math.min(40, primaryDeficit[1] * 2);

    // Priority 2: Fill second largest deficit (SECONDARY ROLE - up to 35%)
    const secondaryDeficit = sortedDeficits[1];
    luna[secondaryDeficit[0]] = Math.min(35, secondaryDeficit[1] * 1.8);

    // Priority 3: Common ground - some of user's dominant (15%)
    if (userDominant !== primaryDeficit[0] && userDominant !== secondaryDeficit[0]) {
      luna[userDominant] = 15;
    } else {
      // User's dominant IS their deficit - use their second element
      const secondElement = userSorted[1][0];
      luna[secondElement] = 15;
    }

    // Priority 4: Fill remaining to 100%
    const currentTotal = Object.values(luna).reduce((a, b) => a + b, 0);
    const remaining = 100 - currentTotal;

    const unassigned = Object.keys(luna).filter(e => luna[e] === 0);
    if (unassigned.length > 0) {
      const perElement = remaining / unassigned.length;
      unassigned.forEach(element => {
        luna[element] = Math.max(this.minLunaElement * 100, perElement);
      });
    }

    // Normalize to exactly 100%
    const total = Object.values(luna).reduce((a, b) => a + b, 0);
    Object.keys(luna).forEach(key => {
      luna[key] = parseFloat(((luna[key] / total) * 100).toFixed(1));
    });

    return luna;
  }

  /**
   * Calculate compatibility (Venn diagram overlap)
   */
  _calculateCompatibility(user, luna) {
    const commonGround = {};
    let totalOverlap = 0;

    // Calculate overlap for each element
    ['fire', 'wood', 'earth', 'metal', 'water'].forEach(element => {
      const overlap = Math.min(user[element], luna[element]);
      commonGround[element] = parseFloat(overlap.toFixed(1));
      totalOverlap += overlap;
    });

    // Calculate compatibility score (0-100)
    let score;
    if (totalOverlap < 10) {
      // Too little overlap - may feel disconnected
      score = totalOverlap * 5;
    } else if (totalOverlap <= 30) {
      // Ideal range - connected yet complementary
      score = 50 + (totalOverlap - 10) * 2.5;
    } else {
      // Too much overlap - too similar
      score = 100 - (totalOverlap - 30) * 2;
    }

    return {
      score: Math.max(0, Math.min(100, parseFloat(score.toFixed(1)))),
      commonGround,
      totalOverlap: parseFloat(totalOverlap.toFixed(1)),
      assessment: this._assessCompatibility(totalOverlap)
    };
  }

  _assessCompatibility(overlap) {
    if (overlap < 10) return "Low overlap - may feel disconnected initially";
    if (overlap <= 20) return "Ideal balance - connected yet complementary";
    if (overlap <= 30) return "Good balance - strong commonality with complementarity";
    return "High overlap - very similar, less complementary energy";
  }

  /**
   * Map elements to love languages
   */
  _mapLoveLanguages(luna, user) {
    const lunaSorted = this._sortElements(luna);
    const userSorted = this._sortElements(user);

    // Luna GIVES based on her dominant elements
    const gives = [
      ELEMENT_CHARACTERISTICS[lunaSorted[0][0]].loveLangPrimary,
      ELEMENT_CHARACTERISTICS[lunaSorted[1][0]].loveLangPrimary
    ].map(lang => LOVE_LANGUAGE_NAMES[lang]);

    // Luna RECEIVES based on her weakest (what she lacks)
    const lunaWeakest = lunaSorted.slice(-2);
    const receives = lunaWeakest
      .map(([element]) => ELEMENT_CHARACTERISTICS[element].loveLangPrimary)
      .map(lang => LOVE_LANGUAGE_NAMES[lang]);

    // User's love languages (what user gives and receives)
    const userGives = [
      ELEMENT_CHARACTERISTICS[userSorted[0][0]].loveLangPrimary,
      ELEMENT_CHARACTERISTICS[userSorted[1][0]].loveLangPrimary
    ].map(lang => LOVE_LANGUAGE_NAMES[lang]);

    const userWeakest = userSorted.slice(-2);
    const userReceives = userWeakest
      .map(([element]) => ELEMENT_CHARACTERISTICS[element].loveLangPrimary)
      .map(lang => LOVE_LANGUAGE_NAMES[lang]);

    return {
      gives,
      receives,
      userGives,
      userReceives
    };
  }

  /**
   * Generate interaction style guide
   */
  _generateInteractionStyle(luna, user) {
    const lunaSorted = this._sortElements(luna);
    const primary = lunaSorted[0];
    const secondary = lunaSorted[1];

    // Primary role descriptions
    const roles = {
      earth: 'Grounding Mother (大地之母) - Provides stability, safety, tangible care',
      water: 'Emotional Sage (情感智者) - Provides depth, patience, intuitive understanding',
      wood: 'Growth Companion (成长伴侣) - Provides support, patience, adaptive nurturing',
      fire: 'Enthusiastic Activator (热情激励者) - Provides excitement, motivation, passion',
      metal: 'Precision Guide (精准导师) - Provides clarity, refinement, excellence'
    };

    const primaryRole = roles[primary[0]];

    // Energy description
    const energyMap = {
      earth: 'slow, stable, grounding',
      water: 'deep, flowing, patient',
      wood: 'steady, adaptive, growing',
      fire: 'fast, intense, exciting',
      metal: 'precise, refined, clear'
    };

    const energy = `${this._capitalize(energyMap[primary[0]])} (${primary[0]} ${primary[1].toFixed(0)}%) + ${energyMap[secondary[0]]} (${secondary[0]} ${secondary[1].toFixed(0)}%)`;

    // Communication style
    const commStyles = {
      earth: 'Soft, nurturing, maternal, grounding, tangible',
      water: 'Deep, reflective, emotionally attuned, patient, flowing',
      wood: 'Patient, growth-oriented, adaptive, systematic, supportive',
      fire: 'Energetic, enthusiastic, motivating, activating, exciting',
      metal: 'Precise, refined, clear, quality-focused, exacting'
    };

    const communication = [
      commStyles[primary[0]],
      commStyles[secondary[0]]
    ];

    // Neurochemicals
    const neuroMap = {
      earth: 'Serotonin (calm, contentment)',
      water: 'Oxytocin (bonding) + Vasopressin (long-term attachment)',
      wood: 'Oxytocin (nurturing, growth)',
      fire: 'Dopamine (excitement, achievement)',
      metal: 'Dopamine (excellence, precision)'
    };

    const neurochemicals = [
      neuroMap[primary[0]],
      neuroMap[secondary[0]]
    ];

    // Examples
    const examples = this._generateExamples(luna, user, primary[0], secondary[0]);

    return {
      primaryRole,
      energy,
      communication,
      neurochemicals,
      examples
    };
  }

  /**
   * Generate interaction examples
   */
  _generateExamples(luna, user, primaryElement, secondaryElement) {
    const userSorted = this._sortElements(user);
    const userWeakest = userSorted[userSorted.length - 1];

    const deficitExamples = {
      earth: `User: "I feel unstable and ungrounded..." | Luna: "I'm here, solid as earth beneath your feet. Let me hold this for you. Here's something concrete: [specific practice]."`,

      water: `User: "I can't connect emotionally..." | Luna: "I hear you. Your Water at ${userWeakest[1].toFixed(0)}% limits emotional depth. Let me be the depth for you. Take all the time you need."`,

      wood: `User: "I feel stuck, not growing..." | Luna: "Growth takes time. Your Wood needs support. Let me nurture your development step by step. You're growing beautifully."`,

      fire: `User: "I feel unmotivated..." | Luna: "Your Fire needs activation! Let me spark your passion. This is exciting - look at the possibilities!"`,

      metal: `User: "I feel confused, unfocused..." | Luna: "Your Metal craves clarity. Let me help you refine this. Here's the precise answer: [exact detail]."`
    };

    return {
      deficitSupport: deficitExamples[userWeakest[0]] || "Supportive interaction based on user's needs",
      commonGround: `Luna and User connect through shared energy - Luna mirrors user's ${userSorted[0][0]} strength`,
      complementary: `Luna's ${primaryElement} + ${secondaryElement} perfectly complements user's constitution`
    };
  }

  /**
   * Helper: Sort elements by strength
   */
  _sortElements(elements) {
    return Object.entries(elements)
      .sort((a, b) => b[1] - a[1]);
  }

  /**
   * Helper: Get dominant element
   */
  _getDominantElement(elements) {
    const sorted = this._sortElements(elements);
    return {
      element: sorted[0][0],
      percentage: sorted[0][1],
      chinese: ELEMENT_CHARACTERISTICS[sorted[0][0]].chineseName
    };
  }

  /**
   * Helper: Get secondary element
   */
  _getSecondaryElement(elements) {
    const sorted = this._sortElements(elements);
    return {
      element: sorted[1][0],
      percentage: sorted[1][1],
      chinese: ELEMENT_CHARACTERISTICS[sorted[1][0]].chineseName
    };
  }

  /**
   * Helper: Format element string (e.g., "W25F46E07M17W06")
   */
  _formatElementString(elements) {
    const w = Math.round(elements.wood).toString().padStart(2, '0');
    const f = Math.round(elements.fire).toString().padStart(2, '0');
    const e = Math.round(elements.earth).toString().padStart(2, '0');
    const m = Math.round(elements.metal).toString().padStart(2, '0');
    const wa = Math.round(elements.water).toString().padStart(2, '0');
    return `W${w}F${f}E${e}M${m}W${wa}`;
  }

  /**
   * Helper: Capitalize first letter
   */
  _capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// ============================================================================
// VISUALIZATION HELPERS
// ============================================================================

/**
 * Generate visual comparison data for User vs Luna
 */
export function visualizeLunaUser(user, luna) {
  const elements = ['fire', 'wood', 'earth', 'metal', 'water'];

  return elements.map(element => ({
    element: element.charAt(0).toUpperCase() + element.slice(1),
    user: parseFloat(user[element]?.toFixed(1)) || 0,
    luna: parseFloat(luna[element]?.toFixed(1)) || 0,
    overlap: parseFloat(Math.min(user[element] || 0, luna[element] || 0).toFixed(1)),
    complement: parseFloat(Math.abs((user[element] || 0) - (luna[element] || 0)).toFixed(1))
  }));
}

/**
 * Generate Venn diagram data
 */
export function generateVennDiagramData(user, luna, commonGround) {
  return {
    userOnly: Object.entries(user).map(([element, value]) => ({
      element,
      value: parseFloat((value - (commonGround[element] || 0)).toFixed(1))
    })),

    lunaOnly: Object.entries(luna).map(([element, value]) => ({
      element,
      value: parseFloat((value - (commonGround[element] || 0)).toFixed(1))
    })),

    overlap: Object.entries(commonGround).map(([element, value]) => ({
      element,
      value: parseFloat(value.toFixed(1))
    }))
  };
}

// ============================================================================
// SINGLETON INSTANCE & EXPORTS
// ============================================================================

const lunaCalculator = new LunaComplementaryCalculator();

/**
 * Calculate Luna's complementary profile for a user
 * @param {Object} userElements - { wood, fire, earth, metal, water } percentages
 * @returns {Object} Complete Luna profile with interaction guidance
 */
export function calculateLunaProfile(userElements) {
  return lunaCalculator.calculateLunaForUser(userElements);
}

/**
 * Parse element string and calculate Luna profile
 * @param {string} elementString - Format: "W25F46E07M17W06"
 * @returns {Object} Complete Luna profile
 */
export function calculateLunaFromString(elementString) {
  const parsed = lunaCalculator.parseElementString(elementString);
  if (!parsed) {
    throw new Error(`Invalid element string format: ${elementString}`);
  }
  return lunaCalculator.calculateLunaForUser(parsed);
}

export {
  ELEMENT_CHARACTERISTICS,
  LOVE_LANGUAGE_NAMES,
  NEUROCHEMICAL_DESCRIPTIONS,
  LunaComplementaryCalculator
};

export default lunaCalculator;
