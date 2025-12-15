// ═══════════════════════════════════════════════════════════════════════════
// TEN GODS (十神) CALCULATION SYSTEM - PROFESSIONAL BAZI
// ═══════════════════════════════════════════════════════════════════════════
// The Ten Gods describe relationships between Day Master and other elements
// This unlocks deep personality analysis and the 25-compatibility matrix
// Created for GENESIS by Claude - Mathematical precision meets ancient wisdom
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// FIVE ELEMENTS CYCLES
// ═══════════════════════════════════════════════════════════════════════════

// Production Cycle (生): I produce this element
const PRODUCTION_CYCLE = {
  'Wood': 'Fire',    // Wood feeds Fire
  'Fire': 'Earth',   // Fire creates Earth (ash)
  'Earth': 'Metal',  // Earth contains Metal
  'Metal': 'Water',  // Metal collects Water (condensation)
  'Water': 'Wood'    // Water nourishes Wood
}

// Control Cycle (克): I control/overcome this element
const CONTROL_CYCLE = {
  'Wood': 'Earth',   // Wood penetrates Earth (roots)
  'Earth': 'Water',  // Earth blocks Water (dams)
  'Water': 'Fire',   // Water extinguishes Fire
  'Fire': 'Metal',   // Fire melts Metal
  'Metal': 'Wood'    // Metal cuts Wood (axe)
}

// Reverse lookups: What element produces/controls ME
const PRODUCES_ME = {
  'Wood': 'Water',   // Water produces Wood
  'Fire': 'Wood',    // Wood produces Fire
  'Earth': 'Fire',   // Fire produces Earth
  'Metal': 'Earth',  // Earth produces Metal
  'Water': 'Metal'   // Metal produces Water
}

const CONTROLS_ME = {
  'Wood': 'Metal',   // Metal controls Wood (cuts)
  'Fire': 'Water',   // Water controls Fire (extinguishes)
  'Earth': 'Wood',   // Wood controls Earth (penetrates)
  'Metal': 'Fire',   // Fire controls Metal (melts)
  'Water': 'Earth'   // Earth controls Water (dams)
}

// ═══════════════════════════════════════════════════════════════════════════
// HEAVENLY STEMS MAPPING (天干)
// ═══════════════════════════════════════════════════════════════════════════

const STEM_MAPPING = {
  // Yang Wood
  '甲': { element: 'Wood', polarity: 'Yang', pinyin: 'Jiǎ' },
  'Jia': { element: 'Wood', polarity: 'Yang', pinyin: 'Jiǎ' },

  // Yin Wood
  '乙': { element: 'Wood', polarity: 'Yin', pinyin: 'Yǐ' },
  'Yi': { element: 'Wood', polarity: 'Yin', pinyin: 'Yǐ' },

  // Yang Fire
  '丙': { element: 'Fire', polarity: 'Yang', pinyin: 'Bǐng' },
  'Bing': { element: 'Fire', polarity: 'Yang', pinyin: 'Bǐng' },

  // Yin Fire
  '丁': { element: 'Fire', polarity: 'Yin', pinyin: 'Dīng' },
  'Ding': { element: 'Fire', polarity: 'Yin', pinyin: 'Dīng' },

  // Yang Earth
  '戊': { element: 'Earth', polarity: 'Yang', pinyin: 'Wù' },
  'Wu': { element: 'Earth', polarity: 'Yang', pinyin: 'Wù' },

  // Yin Earth
  '己': { element: 'Earth', polarity: 'Yin', pinyin: 'Jǐ' },
  'Ji': { element: 'Earth', polarity: 'Yin', pinyin: 'Jǐ' },

  // Yang Metal
  '庚': { element: 'Metal', polarity: 'Yang', pinyin: 'Gēng' },
  'Geng': { element: 'Metal', polarity: 'Yang', pinyin: 'Gēng' },

  // Yin Metal
  '辛': { element: 'Metal', polarity: 'Yin', pinyin: 'Xīn' },
  'Xin': { element: 'Metal', polarity: 'Yin', pinyin: 'Xīn' },

  // Yang Water
  '壬': { element: 'Water', polarity: 'Yang', pinyin: 'Rén' },
  'Ren': { element: 'Water', polarity: 'Yang', pinyin: 'Rén' },

  // Yin Water
  '癸': { element: 'Water', polarity: 'Yin', pinyin: 'Guǐ' },
  'Gui': { element: 'Water', polarity: 'Yin', pinyin: 'Guǐ' }
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: Get stem information
// ═══════════════════════════════════════════════════════════════════════════

function getStemInfo(stem) {
  if (!stem) return null

  // Try direct lookup (handles both Chinese characters and pinyin)
  if (STEM_MAPPING[stem]) {
    return STEM_MAPPING[stem]
  }

  // If stem is an object with properties, extract the character
  if (typeof stem === 'object') {
    if (stem.chinese && STEM_MAPPING[stem.chinese]) {
      return STEM_MAPPING[stem.chinese]
    }
    if (stem.pinyin && STEM_MAPPING[stem.pinyin]) {
      return STEM_MAPPING[stem.pinyin]
    }
    if (stem.name && STEM_MAPPING[stem.name]) {
      return STEM_MAPPING[stem.name]
    }
  }

  return null
}

// ═══════════════════════════════════════════════════════════════════════════
// CORE FUNCTION: Calculate Ten God Relationship
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate Ten God relationship between Day Master and another element
 *
 * @param {string} dayMasterElement - Day Master's element (Wood, Fire, Earth, Metal, Water)
 * @param {string} dayMasterPolarity - Day Master's polarity (Yang, Yin)
 * @param {string} otherElement - Other element to compare
 * @param {string} otherPolarity - Other element's polarity (Yang, Yin)
 * @returns {Object} Ten God name, Chinese, pinyin, and relationship description
 */
export function getTenGod(dayMasterElement, dayMasterPolarity, otherElement, otherPolarity) {
  if (!dayMasterElement || !dayMasterPolarity || !otherElement || !otherPolarity) {
    return null
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CASE 1: SAME ELEMENT (比劫 - Companion & Rob Wealth)
  // ═══════════════════════════════════════════════════════════════════════

  if (dayMasterElement === otherElement) {
    // Same polarity: Friend/Shoulder (比肩)
    if (dayMasterPolarity === otherPolarity) {
      return {
        name: 'Friend',
        chinese: '比肩',
        pinyin: 'Bǐ Jiān',
        type: 'same-same',
        category: 'companion',
        relationship: 'equality',
        description: 'Represents siblings, friends, equality, mutual support, healthy competition',
        emoji: '🤝'
      }
    }
    // Opposite polarity: Rob Wealth (劫財)
    else {
      return {
        name: 'Rob Wealth',
        chinese: '劫財',
        pinyin: 'Jié Cái',
        type: 'same-opposite',
        category: 'companion',
        relationship: 'competitive cooperation',
        description: 'Represents rivals who help, competitive friends, shared resources',
        emoji: '⚔️'
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CASE 2: I PRODUCE OTHER (食傷 - Output Stars)
  // ═══════════════════════════════════════════════════════════════════════

  if (PRODUCTION_CYCLE[dayMasterElement] === otherElement) {
    // Same polarity: Eating God (食神)
    if (dayMasterPolarity === otherPolarity) {
      return {
        name: 'Eating God',
        chinese: '食神',
        pinyin: 'Shí Shén',
        type: 'produce-same',
        category: 'output',
        relationship: 'natural expression',
        description: 'Represents creativity, children, joy, natural talent, enjoyment',
        emoji: '🎨'
      }
    }
    // Opposite polarity: Hurting Officer (傷官)
    else {
      return {
        name: 'Hurting Officer',
        chinese: '傷官',
        pinyin: 'Shāng Guān',
        type: 'produce-opposite',
        category: 'output',
        relationship: 'creative tension',
        description: 'Represents rebellion, talent, challenging authority, innovation',
        emoji: '⚡'
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CASE 3: I CONTROL OTHER (財 - Wealth Stars)
  // ═══════════════════════════════════════════════════════════════════════

  if (CONTROL_CYCLE[dayMasterElement] === otherElement) {
    // Same polarity: Direct Wealth (正財)
    if (dayMasterPolarity === otherPolarity) {
      return {
        name: 'Direct Wealth',
        chinese: '正財',
        pinyin: 'Zhèng Cái',
        type: 'control-same',
        category: 'wealth',
        relationship: 'stable control',
        description: 'Represents wife (for men), stable income, steady work, responsibility',
        emoji: '💰'
      }
    }
    // Opposite polarity: Indirect Wealth (偏財)
    else {
      return {
        name: 'Indirect Wealth',
        chinese: '偏財',
        pinyin: 'Piān Cái',
        type: 'control-opposite',
        category: 'wealth',
        relationship: 'dynamic control',
        description: 'Represents father, unexpected money, opportunities, risk-taking',
        emoji: '💸'
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CASE 4: OTHER PRODUCES ME (印 - Resource Stars)
  // ═══════════════════════════════════════════════════════════════════════

  if (PRODUCES_ME[dayMasterElement] === otherElement) {
    // Same polarity: Direct Resource (正印)
    if (dayMasterPolarity === otherPolarity) {
      return {
        name: 'Direct Resource',
        chinese: '正印',
        pinyin: 'Zhèng Yìn',
        type: 'nourish-same',
        category: 'resource',
        relationship: 'direct support',
        description: 'Represents mother, education, knowledge, protection, traditional learning',
        emoji: '📚'
      }
    }
    // Opposite polarity: Indirect Resource (偏印)
    else {
      return {
        name: 'Indirect Resource',
        chinese: '偏印',
        pinyin: 'Piān Yìn',
        type: 'nourish-opposite',
        category: 'resource',
        relationship: 'indirect support',
        description: 'Represents stepmother, unorthodox learning, intuition, spiritual knowledge',
        emoji: '🔮'
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CASE 5: OTHER CONTROLS ME (官殺 - Authority Stars)
  // ═══════════════════════════════════════════════════════════════════════

  if (CONTROLS_ME[dayMasterElement] === otherElement) {
    // Same polarity: Direct Officer (正官)
    if (dayMasterPolarity === otherPolarity) {
      return {
        name: 'Direct Officer',
        chinese: '正官',
        pinyin: 'Zhèng Guān',
        type: 'pressure-same',
        category: 'authority',
        relationship: 'structured guidance',
        description: 'Represents husband (for women), career, authority, discipline, order',
        emoji: '👔'
      }
    }
    // Opposite polarity: Indirect Officer / 7 Killings (偏官/七殺)
    else {
      return {
        name: 'Indirect Officer',
        alternativeName: '7 Killings',
        chinese: '偏官',
        alternativeChinese: '七殺',
        pinyin: 'Piān Guān / Qī Shā',
        type: 'pressure-opposite',
        category: 'authority',
        relationship: 'dynamic pressure',
        description: 'Represents challenges, power, pressure, competition, transformation',
        emoji: '⚡'
      }
    }
  }

  // Should never reach here if elements are valid
  return null
}

// ═══════════════════════════════════════════════════════════════════════════
// GET DAY MASTER FROM FOUR PILLARS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Extract Day Master (日主) from Four Pillars
 * Day Master is the Heavenly Stem of the Day Pillar - represents the person's core self
 *
 * @param {Object} fourPillars - Complete Four Pillars data structure
 * @returns {Object} Day Master element, polarity, and stem info
 */
export function getDayMaster(fourPillars) {
  if (!fourPillars?.pillars?.day?.stem) {
    return null
  }

  const dayStem = fourPillars.pillars.day.stem

  // Try to get stem info (handles both Chinese characters and pinyin)
  let stemInfo = null

  // If stem is an object, try to extract properties
  if (typeof dayStem === 'object') {
    if (dayStem.chinese) {
      stemInfo = getStemInfo(dayStem.chinese)
    } else if (dayStem.pinyin) {
      stemInfo = getStemInfo(dayStem.pinyin)
    } else if (dayStem.name) {
      stemInfo = getStemInfo(dayStem.name)
    }
  } else {
    // If stem is a string (Chinese character or pinyin)
    stemInfo = getStemInfo(dayStem)
  }

  if (!stemInfo) {
    console.error('❌ Could not determine Day Master from stem:', dayStem)
    return null
  }

  return {
    element: stemInfo.element,
    polarity: stemInfo.polarity,
    stem: dayStem,
    pinyin: stemInfo.pinyin,
    displayName: `${stemInfo.polarity} ${stemInfo.element}`
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CALCULATE ALL TEN GODS IN A CHART
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate Ten Gods for all four pillars in a BaZi chart
 *
 * @param {Object} fourPillars - Complete Four Pillars data
 * @returns {Object} Ten Gods analysis for all pillars
 */
export function calculateTenGods(fourPillars) {
  const dayMaster = getDayMaster(fourPillars)

  if (!dayMaster) {
    console.warn('⚠️ Cannot calculate Ten Gods: Day Master not found')
    return null
  }

  const result = {
    dayMaster: dayMaster,
    pillars: {
      year: null,
      month: null,
      day: null,
      hour: null
    }
  }

  // Calculate Ten God for each pillar's Heavenly Stem
  const pillars = fourPillars.pillars || fourPillars

  ;['year', 'month', 'day', 'hour'].forEach(pillarName => {
    const pillar = pillars[pillarName]

    if (!pillar?.stem) {
      return
    }

    // Get stem info
    let stemInfo = null
    const stem = pillar.stem

    if (typeof stem === 'object') {
      if (stem.chinese) {
        stemInfo = getStemInfo(stem.chinese)
      } else if (stem.pinyin) {
        stemInfo = getStemInfo(stem.pinyin)
      }
    } else {
      stemInfo = getStemInfo(stem)
    }

    if (!stemInfo) {
      console.warn(`⚠️ Could not get stem info for ${pillarName} pillar:`, stem)
      return
    }

    // Calculate Ten God
    const tenGod = getTenGod(
      dayMaster.element,
      dayMaster.polarity,
      stemInfo.element,
      stemInfo.polarity
    )

    if (tenGod) {
      result.pillars[pillarName] = {
        ...tenGod,
        stem: stem,
        element: stemInfo.element,
        polarity: stemInfo.polarity
      }
    }
  })

  return result
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPATIBILITY: Calculate Ten God relationship between two people
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate how two people see each other through Ten Gods lens
 * This is the foundation for the 25-compatibility matrix
 *
 * @param {Object} person1FourPillars - Person 1's Four Pillars
 * @param {Object} person2FourPillars - Person 2's Four Pillars
 * @returns {Object} Mutual Ten God relationships
 */
export function calculateTenGodCompatibility(person1FourPillars, person2FourPillars) {
  const person1DayMaster = getDayMaster(person1FourPillars)
  const person2DayMaster = getDayMaster(person2FourPillars)

  if (!person1DayMaster || !person2DayMaster) {
    console.warn('⚠️ Cannot calculate Ten God compatibility: Missing Day Master')
    return null
  }

  // Calculate how Person 1 sees Person 2
  const person1Perspective = getTenGod(
    person1DayMaster.element,
    person1DayMaster.polarity,
    person2DayMaster.element,
    person2DayMaster.polarity
  )

  // Calculate how Person 2 sees Person 1
  const person2Perspective = getTenGod(
    person2DayMaster.element,
    person2DayMaster.polarity,
    person1DayMaster.element,
    person1DayMaster.polarity
  )

  return {
    person1: {
      dayMaster: person1DayMaster,
      seesOtherAs: person1Perspective
    },
    person2: {
      dayMaster: person2DayMaster,
      seesOtherAs: person2Perspective
    },
    mutualRelationship: getMutualRelationshipQuality(person1Perspective, person2Perspective)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MUTUAL RELATIONSHIP QUALITY (25-Compatibility Matrix Foundation)
// ═══════════════════════════════════════════════════════════════════════════

function getMutualRelationshipQuality(god1, god2) {
  if (!god1 || !god2) {
    return {
      score: 50,
      quality: 'neutral',
      description: 'Unable to determine compatibility'
    }
  }

  // Create compatibility key
  const key = `${god1.name}-${god2.name}`

  // 25-COMPATIBILITY MATRIX (Simplified version - can be expanded)
  const compatibilityMatrix = {
    // Friend-X combinations
    'Friend-Friend': {
      score: 70,
      quality: 'good',
      description: 'Equal partnership with mutual understanding and support'
    },
    'Friend-Rob Wealth': {
      score: 65,
      quality: 'moderate',
      description: 'Cooperative competition, shared goals with friendly rivalry'
    },

    // Direct Resource-X (Nurturing relationships)
    'Direct Resource-Eating God': {
      score: 85,
      quality: 'excellent',
      description: 'Nourishing creativity - support flows naturally into expression'
    },
    'Direct Resource-Direct Wealth': {
      score: 75,
      quality: 'good',
      description: 'Supportive stability - resources enable steady growth'
    },

    // Direct Officer-X (Authority relationships)
    'Direct Officer-Direct Resource': {
      score: 80,
      quality: 'excellent',
      description: 'Guided learning - authority provides structured support'
    },
    'Direct Officer-Direct Wealth': {
      score: 70,
      quality: 'good',
      description: 'Responsible partnership - discipline meets stability'
    },

    // Eating God-X (Creative relationships)
    'Eating God-Direct Resource': {
      score: 85,
      quality: 'excellent',
      description: 'Inspired creation - support fuels natural expression'
    },
    'Eating God-Eating God': {
      score: 75,
      quality: 'good',
      description: 'Mutual creativity and joy, playful collaboration'
    },

    // Wealth-X combinations
    'Direct Wealth-Direct Resource': {
      score: 70,
      quality: 'good',
      description: 'Stable growth - resources build lasting wealth'
    },
    'Indirect Wealth-Indirect Resource': {
      score: 75,
      quality: 'good',
      description: 'Dynamic opportunity - unconventional support leads to gains'
    },

    // Challenging but transformative combinations
    'Indirect Officer-Direct Resource': {
      score: 60,
      quality: 'moderate',
      description: 'Pressure meets support - challenges softened by resources'
    },
    'Hurting Officer-Direct Officer': {
      score: 45,
      quality: 'challenging',
      description: 'Rebellion vs authority - creative tension requires balance'
    },

    // Add more combinations as needed...
  }

  // Look up the combination (try both directions)
  let result = compatibilityMatrix[key]

  if (!result) {
    // Try reverse direction
    const reverseKey = `${god2.name}-${god1.name}`
    result = compatibilityMatrix[reverseKey]
  }

  // Default for unspecified combinations
  if (!result) {
    // Determine basic quality based on categories
    const sameCategory = god1.category === god2.category

    if (sameCategory) {
      result = {
        score: 60,
        quality: 'moderate',
        description: `Similar energies (both ${god1.category}) - understanding but may lack complementarity`
      }
    } else {
      result = {
        score: 55,
        quality: 'moderate',
        description: `Different energies (${god1.category} & ${god2.category}) - potential for balance`
      }
    }
  }

  return {
    ...result,
    combination: key,
    person1God: god1.name,
    person2God: god2.name
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PERSONALITY TRAITS FROM TEN GODS
// ═══════════════════════════════════════════════════════════════════════════

// Personality trait contributions by each Ten God
const TEN_GODS_TRAITS = {
  'Friend': {
    independence: 15,
    collaboration: 10,
    selfConfidence: 12,
    competitiveDrive: 8
  },
  'Rob Wealth': {
    riskTaking: 15,
    opportunism: 12,
    resourcefulness: 10,
    competitiveEdge: 10
  },
  'Eating God': {
    creativity: 18,
    optimism: 15,
    expressiveness: 12,
    joyfulness: 10
  },
  'Hurting Officer': {
    innovation: 20,
    rebelliousness: 15,
    talentExpression: 15,
    nonConformity: 12
  },
  'Direct Wealth': {
    responsibility: 18,
    practicality: 15,
    stabilitySeeking: 12,
    workEthic: 10
  },
  'Indirect Wealth': {
    entrepreneurship: 20,
    riskAppetite: 15,
    generosity: 12,
    opportunism: 10
  },
  'Direct Officer': {
    discipline: 18,
    respectForAuthority: 15,
    structureSeeking: 12,
    responsibility: 10
  },
  'Indirect Officer': {
    resilience: 20,
    powerSeeking: 15,
    courageUnderPressure: 15,
    determination: 12
  },
  'Direct Resource': {
    learningAbility: 18,
    wisdomSeeking: 15,
    nurturingNature: 12,
    knowledgeRetention: 10
  },
  'Indirect Resource': {
    intuition: 20,
    unconventionalThinking: 15,
    spiritualInclination: 12,
    independentLearning: 10
  }
}

// Pillar influence weights (how much each pillar contributes to personality)
const PILLAR_WEIGHTS = {
  year: 0.15,   // 15% - Foundation & Ancestry
  month: 0.30,  // 30% - Career & Parents (strongest)
  day: 0.40,    // 40% - Core Self (most important)
  hour: 0.15    // 15% - Children & Legacy
}

/**
 * Calculate personality traits from Ten Gods configuration
 * Each pillar's Ten God contributes weighted percentages to personality traits
 *
 * @param {Object} tenGods - Complete Ten Gods analysis
 * @returns {Object} Personality trait percentages
 */
export function calculatePersonalityTraits(tenGods) {
  if (!tenGods || !tenGods.pillars) return null

  const traits = {}

  // For each pillar, add weighted trait contributions
  ;['year', 'month', 'day', 'hour'].forEach(pillarName => {
    const pillar = tenGods.pillars[pillarName]
    if (!pillar || !pillar.name) return

    const godTraits = TEN_GODS_TRAITS[pillar.name]
    if (!godTraits) return

    const weight = PILLAR_WEIGHTS[pillarName]

    // Add weighted contribution to each trait
    Object.entries(godTraits).forEach(([trait, value]) => {
      if (!traits[trait]) traits[trait] = 0
      traits[trait] += value * weight
    })
  })

  // Round to 1 decimal place
  Object.keys(traits).forEach(trait => {
    traits[trait] = Math.round(traits[trait] * 10) / 10
  })

  // Sort by value descending
  const sortedTraits = Object.entries(traits)
    .sort(([, a], [, b]) => b - a)
    .reduce((obj, [key, val]) => {
      obj[key] = val
      return obj
    }, {})

  return sortedTraits
}

/**
 * Get top personality traits above a threshold
 *
 * @param {Object} traits - All personality traits with percentages
 * @param {number} threshold - Minimum percentage to include (default 3%)
 * @returns {Array} Top traits with descriptions
 */
export function getTopTraits(traits, threshold = 3) {
  if (!traits) return []

  const traitDescriptions = {
    independence: 'You value autonomy and self-direction',
    collaboration: 'You work well with others as equals',
    selfConfidence: 'You have strong belief in your abilities',
    competitiveDrive: 'You thrive in competitive environments',
    riskTaking: 'You embrace calculated risks',
    opportunism: 'You spot and seize opportunities',
    resourcefulness: 'You find creative solutions',
    competitiveEdge: 'You have a drive to win',
    creativity: 'You express yourself creatively',
    optimism: 'You maintain positive outlook',
    expressiveness: 'You communicate openly',
    joyfulness: 'You bring joy and playfulness',
    innovation: 'You pioneer new approaches',
    rebelliousness: 'You challenge conventions',
    talentExpression: 'You showcase your unique talents',
    nonConformity: 'You forge your own path',
    responsibility: 'You take obligations seriously',
    practicality: 'You focus on what works',
    stabilitySeeking: 'You value security and stability',
    workEthic: 'You have strong dedication to work',
    entrepreneurship: 'You have business mindset',
    riskAppetite: 'You embrace bold ventures',
    generosity: 'You share freely with others',
    discipline: 'You maintain self-control and order',
    respectForAuthority: 'You honor hierarchy and rules',
    structureSeeking: 'You prefer organized systems',
    resilience: 'You bounce back from adversity',
    powerSeeking: 'You pursue positions of influence',
    courageUnderPressure: 'You stay calm in challenges',
    determination: 'You persist toward goals',
    learningAbility: 'You absorb knowledge easily',
    wisdomSeeking: 'You pursue deep understanding',
    nurturingNature: 'You support others\' growth',
    knowledgeRetention: 'You remember what you learn',
    intuition: 'You trust your gut feelings',
    unconventionalThinking: 'You think outside the box',
    spiritualInclination: 'You explore deeper meanings',
    independentLearning: 'You teach yourself'
  }

  return Object.entries(traits)
    .filter(([, value]) => value >= threshold)
    .map(([trait, value]) => ({
      trait,
      value,
      description: traitDescriptions[trait] || trait,
      displayName: trait.replace(/([A-Z])/g, ' $1').trim()
    }))
}

/**
 * Get trait contributions for a specific pillar
 * Used to show which traits come from which life phase
 *
 * @param {string} godName - Name of the Ten God
 * @param {string} pillarName - year, month, day, or hour
 * @returns {Object} Traits with their weighted contributions
 */
export function getPillarTraitContributions(godName, pillarName) {
  const godTraits = TEN_GODS_TRAITS[godName]
  if (!godTraits) return {}

  const weight = PILLAR_WEIGHTS[pillarName]
  const contributions = {}

  Object.entries(godTraits).forEach(([trait, value]) => {
    contributions[trait] = Math.round(value * weight * 10) / 10
  })

  return contributions
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export {
  PRODUCTION_CYCLE,
  CONTROL_CYCLE,
  PRODUCES_ME,
  CONTROLS_ME,
  STEM_MAPPING,
  getStemInfo,
  TEN_GODS_TRAITS,
  PILLAR_WEIGHTS
}
