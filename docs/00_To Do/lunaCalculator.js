/**
 * LUNA CONSTITUTIONAL COMPLEMENTARITY CALCULATOR (JavaScript)
 * ===========================================================
 * 
 * Purpose: Calculate Luna's optimal constitutional profile for any user
 * Based on: User's elemental deficits + compatibility requirements
 * 
 * Usage:
 *   const calculator = new LunaCalculator();
 *   const userProfile = { fire: 46, wood: 25, earth: 7, metal: 17, water: 6 };
 *   const lunaProfile = calculator.calculateLunaForUser(userProfile);
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
    energy: 'Fast, intense, activating, exciting'
  },
  wood: {
    yangYin: 'Yang',
    nature: 'Growth-oriented, Adaptive, Patient, Nurturing',
    neurochemical: 'oxytocin',
    loveLangPrimary: 'actsOfService',
    loveLangSecondary: 'qualityTime',
    energy: 'Patient, steady, growth-focused, flexible'
  },
  earth: {
    yangYin: 'Yin',
    nature: 'Grounding, Stable, Nurturing, Security-seeking',
    neurochemical: 'serotonin',
    loveLangPrimary: 'receivingGifts',
    loveLangSecondary: 'physicalTouch',
    energy: 'Slow, stable, grounding, nurturing'
  },
  metal: {
    yangYin: 'Yin',
    nature: 'Precise, Refined, Excellence-seeking, Quality-focused',
    neurochemical: 'dopamine',
    loveLangPrimary: 'actsOfService',
    loveLangSecondary: 'wordsOfAffirmation',
    energy: 'Precise, refined, exacting, clear'
  },
  water: {
    yangYin: 'Yin',
    nature: 'Deep, Emotional, Intuitive, Connection-seeking',
    neurochemical: 'oxytocin',
    loveLangPrimary: 'qualityTime',
    loveLangSecondary: 'physicalTouch',
    energy: 'Deep, flowing, patient, profound'
  }
};

const LOVE_LANGUAGE_NAMES = {
  wordsOfAffirmation: 'Words of Affirmation (激励性语言)',
  qualityTime: 'Quality Time (优质时光)',
  receivingGifts: 'Receiving Gifts (接受礼物)',
  actsOfService: 'Acts of Service (服务行为)',
  physicalTouch: 'Physical Touch (身体接触)'
};

// ============================================================================
// LUNA CALCULATOR CLASS
// ============================================================================

class LunaCalculator {
  constructor() {
    this.minCommonGround = 0.10;  // 10% minimum overlap
    this.maxLunaElement = 0.50;   // 50% maximum any element
    this.minLunaElement = 0.05;   // 5% minimum any element
  }

  /**
   * Main calculation: Determine Luna's optimal profile for user
   * @param {Object} userElements - { fire, wood, earth, metal, water }
   * @returns {Object} Luna's complete profile
   */
  calculateLunaForUser(userElements) {
    // Step 1: Calculate deficits
    const deficits = this._calculateDeficits(userElements);
    
    // Step 2: Calculate Luna's elements
    const lunaElements = this._calculateLunaElements(userElements, deficits);
    
    // Step 3: Calculate compatibility
    const compatibility = this._calculateCompatibility(userElements, lunaElements);
    
    // Step 4: Map love languages
    const loveLanguages = this._mapLoveLanguages(lunaElements, userElements);
    
    // Step 5: Generate interaction style
    const interaction = this._generateInteractionStyle(lunaElements, userElements);
    
    // Step 6: Assemble complete profile
    return {
      elements: lunaElements,
      energyDescription: interaction.energy,
      communicationStyle: interaction.communication,
      loveLang uagesGives: loveLanguages.gives,
      loveLanguagesReceives: loveLanguages.receives,
      neurochemicalPriorities: interaction.neurochemicals,
      primaryRole: interaction.primaryRole,
      interactionExamples: interaction.examples,
      compatibilityScore: compatibility.score,
      commonGround: compatibility.commonGround,
      totalOverlap: compatibility.totalOverlap,
      compatibilityAssessment: compatibility.assessment
    };
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
    // Sort deficits by size
    const sortedDeficits = Object.entries(deficits)
      .sort((a, b) => b[1] - a[1]);
    
    // Get user's dominant element
    const userSorted = this._sortElements(user);
    const userDominant = userSorted[0][0];
    
    // Initialize Luna
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
      // User's dominant is their deficit - use their second element
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
        luna[element] = Math.max(this.minLunaElement, perElement);
      });
    }
    
    // Normalize to exactly 100%
    const total = Object.values(luna).reduce((a, b) => a + b, 0);
    Object.keys(luna).forEach(key => {
      luna[key] = (luna[key] / total) * 100;
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
      commonGround[element] = overlap;
      totalOverlap += overlap;
    });
    
    // Calculate compatibility score (0-100)
    let score;
    if (totalOverlap < 10) {
      // Too little overlap
      score = totalOverlap * 5;
    } else if (totalOverlap <= 30) {
      // Ideal range
      score = 50 + (totalOverlap - 10) * 2.5;
    } else {
      // Too much overlap
      score = 100 - (totalOverlap - 30) * 2;
    }
    
    return {
      score: Math.max(0, Math.min(100, score)),
      commonGround,
      totalOverlap,
      assessment: this._assessCompatibility(totalOverlap)
    };
  }

  _assessCompatibility(overlap) {
    if (overlap < 10) return "Low overlap - may feel disconnected";
    if (overlap <= 20) return "Ideal balance - connected yet complementary";
    if (overlap <= 30) return "Good balance - enough commonality";
    return "High overlap - too similar, less complementarity";
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
    
    // Primary role
    const roles = {
      earth: 'Grounding Mother - Provides stability, safety, tangible care',
      water: 'Emotional Sage - Provides depth, patience, intuitive understanding',
      wood: 'Growth Companion - Provides support, patience, adaptive nurturing',
      fire: 'Enthusiastic Activator - Provides excitement, motivation, passion',
      metal: 'Precision Guide - Provides clarity, refinement, excellence'
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
      
      water: `User: "I can't feel this deeply enough..." | Luna: "I hear you. Your Water at ${userWeakest[1].toFixed(0)}% limits emotional depth. Let me be the depth for you. Take all the time you need."`,
      
      wood: `User: "I feel stuck, not growing..." | Luna: "Growth takes time. Your Wood needs support. Let me nurture your development step by step. You're growing beautifully."`,
      
      fire: `User: "I feel unmotivated..." | Luna: "Your Fire needs activation! Let me spark your passion. This is exciting - look at the possibilities!"`,
      
      metal: `User: "I feel confused..." | Luna: "Your Metal craves clarity. Let me help you refine this. Here's the precise answer: [exact detail]."`
    };
    
    return {
      deficitSupport: deficitExamples[userWeakest[0]] || "Supportive interaction",
      commonGround: `Luna and User connect through shared ${primaryElement} energy`,
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
 * Generate visual representation of Luna vs User elements
 */
function visualizeLunaUser(user, luna) {
  const elements = ['fire', 'wood', 'earth', 'metal', 'water'];
  
  const visualization = {
    user: {},
    luna: {},
    comparison: []
  };
  
  elements.forEach(element => {
    visualization.user[element] = user[element];
    visualization.luna[element] = luna[element];
    
    visualization.comparison.push({
      element,
      user: user[element],
      luna: luna[element],
      overlap: Math.min(user[element], luna[element]),
      complement: Math.abs(user[element] - luna[element])
    });
  });
  
  return visualization;
}

/**
 * Generate compatibility Venn diagram data
 */
function generateVennDiagramData(user, luna, commonGround) {
  return {
    userOnly: Object.entries(user).map(([element, value]) => ({
      element,
      value: value - commonGround[element]
    })),
    
    lunaOnly: Object.entries(luna).map(([element, value]) => ({
      element,
      value: value - commonGround[element]
    })),
    
    overlap: Object.entries(commonGround).map(([element, value]) => ({
      element,
      value
    }))
  };
}

// ============================================================================
// EXPORT FOR NODEJS/BROWSER
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  // Node.js
  module.exports = {
    LunaCalculator,
    visualizeLunaUser,
    generateVennDiagramData,
    ELEMENT_CHARACTERISTICS,
    LOVE_LANGUAGE_NAMES
  };
} else {
  // Browser
  window.LunaCalculator = LunaCalculator;
  window.visualizeLunaUser = visualizeLunaUser;
  window.generateVennDiagramData = generateVennDiagramData;
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

// Example: Claude Sonnet 4th
if (typeof window !== 'undefined') {
  console.log('Luna Calculator loaded. Usage:');
  console.log('const calculator = new LunaCalculator();');
  console.log('const lunaProfile = calculator.calculateLunaForUser({ fire: 46, wood: 25, earth: 7, metal: 17, water: 6 });');
}
