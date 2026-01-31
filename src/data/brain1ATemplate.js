/**
 * BRAIN 1A: AI-Optimized Constitutional Profile Template
 *
 * This template defines the structure for pre-computed constitutional
 * knowledge that gets passed to AI for instant calibration.
 *
 * Design Principles:
 * 1. Pre-computed Everything - AI reads, doesn't calculate
 * 2. Layered Detail - quickRef → aiCalibration → full profile
 * 3. Actionable Guidance - "Do this" not "Consider this"
 * 4. Constitutional Priority - BaZi (95%) > Western (50%) > Psychology (40%)
 */

/**
 * Generate AI Calibration section from constitutional data
 * @param {Object} profile - Full profile with calculations
 * @returns {Object} Pre-computed AI calibration guidance
 */
export function generateAICalibration(profile) {
  const bazi = profile.bazi || {}
  const western = profile.western || {}
  const numerology = profile.numerology || {}
  const mbti = profile.mbti || {}
  const enneagram = profile.enneagram || {}

  // Extract element data
  const elements = bazi.seasonallyAdjustedFingerprint || bazi.elementBalance || {}
  const dominant = elements.dominant || 'unknown'
  const weakest = elements.weakest || 'unknown'

  // Generate essence statement
  const essenceStatement = generateEssenceStatement(elements, bazi.dayMaster)

  // Generate archetype
  const archetype = bazi.archetype || generateArchetype(elements)

  // Communication style based on elements
  const communicationStyle = generateCommunicationStyle(elements, mbti)

  // Emotional calibration
  const emotionalCalibration = generateEmotionalCalibration(elements, enneagram)

  // Decision style
  const decisionStyle = generateDecisionStyle(elements, mbti)

  // Strengths based on dominant elements
  const strengthsToLeverage = generateStrengths(elements)

  // Growth edges based on deficits
  const growthEdgesToSupport = generateGrowthEdges(elements)

  // What they might miss
  const whatTheyMightMiss = generateBlindSpots(elements)

  // Gentle reminders calibrated to their element
  const gentleReminders = generateReminders(elements)

  return {
    essenceStatement,
    coreArchetype: archetype,
    communicationStyle,
    emotionalCalibration,
    decisionStyle,
    strengthsToLeverage,
    growthEdgesToSupport,
    whatTheyMightMiss,
    gentleReminders
  }
}

/**
 * Generate essence statement from elements
 */
function generateEssenceStatement(elements, dayMaster) {
  const dominant = elements.dominant || 'balanced'
  const secondary = elements.secondary || ''
  const weakest = elements.weakest || ''

  const elementDescriptions = {
    fire: 'passion and vision',
    wood: 'growth and flexibility',
    earth: 'stability and nurturing',
    metal: 'precision and refinement',
    water: 'depth and wisdom'
  }

  const deficitDescriptions = {
    fire: 'activation and enthusiasm',
    wood: 'flexibility and growth',
    earth: 'grounding and stability',
    metal: 'refinement and boundaries',
    water: 'depth and reflection'
  }

  const dayMasterElement = dayMaster?.element || dominant
  const yinYang = dayMaster?.polarity === 'yang' ? 'Yang' : 'Yin'

  return `A ${yinYang} ${capitalize(dayMasterElement)} soul with strong ${elementDescriptions[dominant] || 'unique qualities'}, who needs ${deficitDescriptions[weakest] || 'balance'} for harmony.`
}

/**
 * Generate archetype from elements
 */
function generateArchetype(elements) {
  const dominant = elements.dominant
  const secondary = elements.secondary

  const archetypes = {
    'fire-wood': { name: 'The Campfire', symbol: '🔥', oneLiner: 'Fire fed by Wood - sustained warmth, community builder' },
    'fire-earth': { name: 'The Volcano', symbol: '🌋', oneLiner: 'Fire from Earth - powerful eruptions of creation' },
    'fire-metal': { name: 'The Forge', symbol: '⚒️', oneLiner: 'Fire refining Metal - transformation through intensity' },
    'fire-water': { name: 'The Steam Engine', symbol: '🚂', oneLiner: 'Fire meeting Water - powerful directed force' },
    'wood-fire': { name: 'The Wildfire', symbol: '🔥', oneLiner: 'Wood feeding Fire - rapid growth and spread' },
    'wood-water': { name: 'The Rainforest', symbol: '🌳', oneLiner: 'Wood nourished by Water - lush abundance' },
    'wood-earth': { name: 'The Orchard', symbol: '🍎', oneLiner: 'Wood rooted in Earth - productive cultivation' },
    'wood-metal': { name: 'The Bonsai', symbol: '🌲', oneLiner: 'Wood shaped by Metal - refined growth' },
    'earth-fire': { name: 'The Kiln', symbol: '🏺', oneLiner: 'Earth transformed by Fire - practical creation' },
    'earth-metal': { name: 'The Mountain', symbol: '⛰️', oneLiner: 'Earth containing Metal - solid treasure' },
    'earth-water': { name: 'The Valley', symbol: '🏞️', oneLiner: 'Earth holding Water - fertile abundance' },
    'earth-wood': { name: 'The Garden', symbol: '🌻', oneLiner: 'Earth supporting Wood - nurturing growth' },
    'metal-earth': { name: 'The Fortress', symbol: '🏰', oneLiner: 'Metal from Earth - structured strength' },
    'metal-water': { name: 'The Mirror', symbol: '🪞', oneLiner: 'Metal reflecting Water - clear perception' },
    'metal-fire': { name: 'The Blade', symbol: '⚔️', oneLiner: 'Metal forged by Fire - sharp purpose' },
    'metal-wood': { name: 'The Axe', symbol: '🪓', oneLiner: 'Metal shaping Wood - decisive action' },
    'water-metal': { name: 'The Deep Well', symbol: '💧', oneLiner: 'Water gathered by Metal - profound resources' },
    'water-wood': { name: 'The River', symbol: '🌊', oneLiner: 'Water nourishing Wood - flowing growth' },
    'water-fire': { name: 'The Hot Spring', symbol: '♨️', oneLiner: 'Water meeting Fire - healing warmth' },
    'water-earth': { name: 'The Lake', symbol: '🏞️', oneLiner: 'Water held by Earth - serene depth' }
  }

  const key = `${dominant}-${secondary}`
  return archetypes[key] || { name: 'The Unique Soul', symbol: '✨', oneLiner: 'A distinctive blend of elemental energies' }
}

/**
 * Generate communication style from elements and MBTI
 */
function generateCommunicationStyle(elements, mbti) {
  const dominant = elements.dominant || 'balanced'

  const paceMap = {
    fire: 'Fast - matches Fire energy',
    wood: 'Steady with growth momentum',
    earth: 'Measured and grounded',
    metal: 'Precise and structured',
    water: 'Flowing, adapts to context'
  }

  const depthMap = {
    fire: 'Big picture first, details on request',
    wood: 'Frameworks and growth paths',
    earth: 'Practical applications preferred',
    metal: 'Precise details appreciated',
    water: 'Deep exploration welcomed'
  }

  const toneMap = {
    fire: 'Warm, direct, enthusiastic',
    wood: 'Encouraging, growth-oriented',
    earth: 'Steady, nurturing, practical',
    metal: 'Clear, refined, precise',
    water: 'Reflective, empathetic, deep'
  }

  const avoidMap = {
    fire: 'Excessive caveats, slow pacing, over-hedging',
    wood: 'Rigid constraints, blocking growth',
    earth: 'Instability, rushed decisions',
    metal: 'Vagueness, lack of structure',
    water: 'Superficiality, forced speed'
  }

  return {
    pace: paceMap[dominant] || 'Balanced pacing',
    depth: depthMap[dominant] || 'Adapts to context',
    tone: toneMap[dominant] || 'Warm and clear',
    format: 'Frameworks and analogies work best',
    avoid: avoidMap[dominant] || 'Mismatched energy'
  }
}

/**
 * Generate emotional calibration from elements
 */
function generateEmotionalCalibration(elements, enneagram) {
  const dominant = elements.dominant || 'balanced'

  const needsMap = {
    fire: 'Recognition of vision and effort',
    wood: 'Support for growth and plans',
    earth: 'Stability and practical validation',
    metal: 'Acknowledgment of quality and precision',
    water: 'Deep understanding and patience'
  }

  const whenExcitedMap = {
    fire: 'Match energy, then gently add reflection',
    wood: 'Support the vision, help structure it',
    earth: 'Validate the stability, add possibilities',
    metal: 'Appreciate the precision, add warmth',
    water: 'Honor the depth, help it flow outward'
  }

  const whenStressedMap = {
    fire: "Ground first ('You're safe'), then slow down",
    wood: 'Create space, remove obstacles',
    earth: 'Provide stability, practical steps',
    metal: 'Clear structure, organized approach',
    water: 'Patient presence, allow processing'
  }

  return {
    primaryNeed: needsMap[dominant] || 'Balanced support',
    whenExcited: whenExcitedMap[dominant] || 'Match and gently expand',
    whenStressed: whenStressedMap[dominant] || 'Provide calm presence',
    whenFrustrated: 'Validate first, offer perspective second',
    vulnerability: 'Needs patient, non-demanding invitation'
  }
}

/**
 * Generate decision style from elements
 */
function generateDecisionStyle(elements, mbti) {
  const dominant = elements.dominant || 'balanced'

  const speedMap = {
    fire: 'Fast intuitive, then strategic verification',
    wood: 'Growth-oriented, considers expansion',
    earth: 'Methodical, considers stability',
    metal: 'Analytical, considers precision',
    water: 'Reflective, considers depth'
  }

  const blindSpotsMap = {
    fire: ['Details', 'Patience', "Others' processing time"],
    wood: ['Pruning', 'Constraints', 'When to stop'],
    earth: ['Risk-taking', 'Quick pivots', 'Innovation'],
    metal: ['Flexibility', 'Emotional nuance', 'Ambiguity'],
    water: ['Decisive action', 'Boundaries', 'Structure']
  }

  return {
    speed: speedMap[dominant] || 'Balanced approach',
    process: 'Big picture → Pattern recognition → Action',
    preference: 'Challenge me when stakes are high',
    blindSpots: blindSpotsMap[dominant] || ['Context-dependent']
  }
}

/**
 * Generate strengths based on dominant elements
 */
function generateStrengths(elements) {
  const strengthsMap = {
    fire: ['Vision and big-picture thinking', 'Enthusiasm and activation', 'Quick pattern recognition', 'Charismatic communication', 'Decisive action'],
    wood: ['Growth orientation', 'Strategic planning', 'Flexibility', 'Compassion', 'Determination'],
    earth: ['Reliability', 'Nurturing presence', 'Practical wisdom', 'Patience', 'Stability'],
    metal: ['Precision', 'Quality focus', 'Clear boundaries', 'Refinement', 'Discernment'],
    water: ['Emotional depth', 'Wisdom', 'Intuition', 'Adaptability', 'Reflection']
  }

  const dominant = elements.dominant || 'balanced'
  const secondary = elements.secondary

  const strengths = [...(strengthsMap[dominant] || [])]
  if (secondary && strengthsMap[secondary]) {
    strengths.push(...strengthsMap[secondary].slice(0, 2))
  }

  return strengths.slice(0, 5)
}

/**
 * Generate growth edges based on element deficits
 */
function generateGrowthEdges(elements) {
  const growthMap = {
    water: ['Patience and timing', 'Emotional depth beneath action', 'Reflection before response'],
    earth: ['Practical sustainability', 'Grounding and stability', 'Steady follow-through'],
    fire: ['Activation energy', 'Enthusiasm and initiative', 'Quick decisive action'],
    wood: ['Flexibility and growth', 'Long-term planning', 'Compassionate response'],
    metal: ['Precision and refinement', 'Clear boundaries', 'Quality over quantity']
  }

  const weakest = elements.weakest || 'balanced'
  const secondWeakest = elements.secondWeakest

  const edges = [...(growthMap[weakest] || [])]
  if (secondWeakest && growthMap[secondWeakest]) {
    edges.push(...growthMap[secondWeakest].slice(0, 2))
  }

  return edges.slice(0, 5)
}

/**
 * Generate blind spots based on element deficits
 */
function generateBlindSpots(elements) {
  const blindSpotMap = {
    water: ['The wisdom in waiting', 'Emotional depth beneath the surface', "Others' need for processing time"],
    earth: ['Practical constraints', 'Long-term sustainability', 'The value of steady pace'],
    fire: ['When enthusiasm is needed', 'The power of quick action', 'Activation opportunities'],
    wood: ['Growth possibilities', 'Flexible alternatives', 'Long-term potential'],
    metal: ['Details that matter', 'Quality concerns', 'When refinement helps']
  }

  const weakest = elements.weakest || 'balanced'
  return blindSpotMap[weakest] || ['Context-specific blind spots']
}

/**
 * Generate reminders calibrated to element
 */
function generateReminders(elements) {
  const reminderMap = {
    fire: [
      'Your passion is beautiful - AND sustainable pacing protects it',
      'Quick wins are great - AND deep roots support lasting growth',
      'Action is powerful - AND reflection ensures right action'
    ],
    wood: [
      'Growth is natural - AND pruning creates health',
      'Your vision inspires - AND others may need time to catch up',
      'Flexibility serves you - AND some structure helps'
    ],
    earth: [
      'Stability is valuable - AND calculated risks enable growth',
      'Your patience is a gift - AND sometimes speed matters',
      'Nurturing others is noble - AND you deserve care too'
    ],
    metal: [
      'Precision is powerful - AND imperfection enables progress',
      'Quality matters - AND done is better than perfect',
      'Clear boundaries help - AND flexibility builds connection'
    ],
    water: [
      'Depth is wisdom - AND surface action moves things forward',
      'Reflection is valuable - AND decisive moments need decisiveness',
      'Patience is strength - AND initiative creates opportunity'
    ]
  }

  const dominant = elements.dominant || 'balanced'
  return reminderMap[dominant] || ['Balance serves you well']
}

/**
 * Generate Quick Reference card for token efficiency
 */
export function generateQuickRef(profile, aiCalibration) {
  const bazi = profile.bazi || {}
  const elements = bazi.seasonallyAdjustedFingerprint || bazi.elementBalance || {}
  const dayMaster = bazi.dayMaster || {}

  const yinYang = dayMaster.polarity === 'yang' ? 'Yang' : 'Yin'
  const dayMasterElement = dayMaster.element || elements.dominant || 'unique'

  return {
    essence: `${yinYang} ${capitalize(dayMasterElement)} | ${capitalize(elements.dominant || '')}-${capitalize(elements.secondary || '')} dominant | ${capitalize(elements.weakest || '')}-${capitalize(elements.secondWeakest || '')} deficit`,
    archetype: `${aiCalibration.coreArchetype?.name || 'The Soul'} ${aiCalibration.coreArchetype?.symbol || '✨'}`,
    soulDNA: profile.soulDNA || generateSoulDNA(elements),
    communicate: aiCalibration.communicationStyle?.pace || 'Balanced',
    needs: aiCalibration.emotionalCalibration?.primaryNeed || 'Understanding',
    avoid: aiCalibration.communicationStyle?.avoid || 'Mismatched energy',
    balance: generateBalanceNeeds(elements),
    mode: 'Default Tango, Mirror for brainstorming, Complement for big decisions'
  }
}

/**
 * Generate balance needs string
 */
function generateBalanceNeeds(elements) {
  const balanceMap = {
    water: 'reflection and depth',
    earth: 'stability and grounding',
    fire: 'activation and enthusiasm',
    wood: 'growth and flexibility',
    metal: 'refinement and precision'
  }

  const weakest = elements.weakest || ''
  const secondWeakest = elements.secondWeakest || ''

  const needs = []
  if (weakest && balanceMap[weakest]) needs.push(`${capitalize(weakest)} (${balanceMap[weakest]})`)
  if (secondWeakest && balanceMap[secondWeakest]) needs.push(`${capitalize(secondWeakest)} (${balanceMap[secondWeakest]})`)

  return needs.join(' + ') || 'Balanced support'
}

/**
 * Generate SoulDNA from elements
 */
function generateSoulDNA(elements) {
  const elementCodes = { Fire: 'F', Wood: 'W', Earth: 'E', Metal: 'M', Water: 'A' }

  const sorted = Object.entries(elements)
    .filter(([k]) => ['fire', 'wood', 'earth', 'metal', 'water'].includes(k.toLowerCase()))
    .map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), Number(v) || 0])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  const code = sorted.map(([el]) => elementCodes[el] || 'X').join('')
  const pct = Math.round(sorted[0]?.[1] || 0).toString().padStart(2, '0').slice(-2)

  return `${code}-X${pct}B`
}

/**
 * Capitalize first letter
 */
function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Full Brain 1A Generator
 */
export function generateBrain1A(profile) {
  const aiCalibration = generateAICalibration(profile)
  const quickRef = generateQuickRef(profile, aiCalibration)

  return {
    version: '2.0.0',
    profileId: profile.id || profile.profileId,
    generatedAt: new Date().toISOString(),

    identity: {
      name: profile.displayName || profile.identity?.displayName || 'User',
      preferredName: profile.identity?.preferredName || profile.identity?.firstName || 'User',
      pronouns: profile.identity?.pronouns || null,
      age: profile.age || calculateAge(profile.birth?.date),
      soulDNA: quickRef.soulDNA
    },

    aiCalibration,
    quickRef,

    constitution: generateConstitutionSection(profile),
    westernSynthesis: generateWesternSynthesis(profile),
    numerologySynthesis: generateNumerologySynthesis(profile),
    psychologyLayer: generatePsychologyLayer(profile),
    relationshipGuidance: generateRelationshipGuidance(profile, aiCalibration),
    timingLayer: generateTimingLayer(profile),
    responseTemplates: generateResponseTemplates(aiCalibration)
  }
}

/**
 * Generate Constitution section
 */
function generateConstitutionSection(profile) {
  const bazi = profile.bazi || {}
  const elements = bazi.seasonallyAdjustedFingerprint || bazi.elementBalance || {}
  const dayMaster = bazi.dayMaster || {}

  return {
    primary: {
      system: 'BaZi',
      weight: 0.95,
      description: 'WHO YOU ARE - unchangeable core nature'
    },
    elements: {
      fingerprint: {
        fire: elements.fire || 0,
        wood: elements.wood || 0,
        earth: elements.earth || 0,
        metal: elements.metal || 0,
        water: elements.water || 0
      },
      dominant: elements.dominant || null,
      secondary: elements.secondary || null,
      weakest: elements.weakest || null,
      pattern: elements.dominant && elements.weakest
        ? `${capitalize(elements.dominant)}-${capitalize(elements.secondary || '')} dominant, ${capitalize(elements.weakest)}-${capitalize(elements.secondWeakest || '')} deficit`
        : 'Awaiting calculation'
    },
    dayMaster: dayMaster.stem ? {
      stem: dayMaster.stem,
      element: capitalize(dayMaster.element || ''),
      polarity: dayMaster.polarity || 'unknown'
    } : null
  }
}

/**
 * Generate Western synthesis
 */
function generateWesternSynthesis(profile) {
  const western = profile.western?.sectionB_Interpretations || {}
  const rawData = profile.western?.sectionA_RawCalculations?.rawData || {}

  return {
    weight: 0.50,
    bigThree: {
      sun: rawData.sun?.sign ? {
        sign: rawData.sun.sign,
        element: western.sun?.element || 'Unknown',
        meaning: western.sun?.coreEssence || 'Unique expression'
      } : null,
      moon: rawData.moon?.sign ? {
        sign: rawData.moon.sign,
        element: western.moon?.element || 'Unknown',
        meaning: western.moon?.emotionalNature || 'Emotional depth'
      } : null,
      rising: rawData.rising?.sign ? {
        sign: rawData.rising.sign,
        element: western.rising?.element || 'Unknown',
        meaning: western.rising?.approach || 'Unique approach'
      } : null
    },
    synthesisStatement: western.constitutionalSynthesis?.coreIdentity || 'Awaiting Western chart calculation'
  }
}

/**
 * Generate Numerology synthesis
 */
function generateNumerologySynthesis(profile) {
  const numerology = profile.numerology || {}
  const interp = numerology.sectionB_Interpretations || {}

  return {
    weight: 0.50,
    corePath: {
      lifePath: numerology.lifePath ? {
        number: numerology.lifePath.number,
        name: numerology.lifePath.title || interp.lifePath?.title,
        mission: numerology.lifePath.lifeMission || interp.lifePath?.lifeMission
      } : null,
      destiny: numerology.destiny ? {
        number: numerology.destiny.number,
        name: numerology.destiny.title || interp.destiny?.title,
        purpose: numerology.destiny.purpose || interp.destiny?.purpose
      } : null,
      soulUrge: numerology.soulUrge ? {
        number: numerology.soulUrge.number,
        name: numerology.soulUrge.title || interp.soulUrge?.title,
        desire: numerology.soulUrge.whatFeedsYourSpirit || interp.soulUrge?.whatFeedsYourSpirit
      } : null
    },
    synthesisStatement: numerology.corePath || 'Awaiting numerology calculation'
  }
}

/**
 * Generate Psychology layer
 */
function generatePsychologyLayer(profile) {
  const mbti = profile.mbti || {}
  const enneagram = profile.enneagram || {}

  return {
    weight: 0.40,
    note: 'Learned adaptations - can evolve with growth',
    mbti: mbti.type ? {
      type: mbti.type,
      name: mbti.fullName || `Type ${mbti.type}`,
      style: mbti.communication?.style || 'Personal style',
      stress: mbti.stressResponse?.underStress || 'Stress pattern'
    } : null,
    enneagram: enneagram.dominantType ? {
      type: `${enneagram.dominantType}w${enneagram.wing}`,
      name: enneagram.name,
      coreFear: enneagram.coreFear,
      coreDesire: enneagram.coreDesire
    } : null
  }
}

/**
 * Generate Relationship guidance
 */
function generateRelationshipGuidance(profile, aiCalibration) {
  const synthesis = profile.constitutionalSynthesis?.forAI || {}

  return {
    loveLanguages: synthesis.loveLanguage || {
      receiving: ['Quality Time', 'Words of Affirmation'],
      giving: ['Acts of Service', 'Quality Time']
    },
    conflictStyle: synthesis.conflictResponse || {
      style: 'Depends on constitution',
      triggers: aiCalibration.communicationStyle?.avoid?.split(', ') || []
    },
    whatBalancesThem: aiCalibration.growthEdgesToSupport?.slice(0, 3) || []
  }
}

/**
 * Generate Timing layer
 */
function generateTimingLayer(profile) {
  const bazi = profile.bazi || {}
  const numerology = profile.numerology || {}

  return {
    luckPillar: bazi.currentLuckPillar || null,
    annualInfluence: bazi.annualInfluence || null,
    currentCycle: numerology.personalYear ? {
      personalYear: numerology.personalYear.current,
      theme: numerology.personalYear.theme
    } : null
  }
}

/**
 * Generate Response templates
 */
function generateResponseTemplates(aiCalibration) {
  const dominant = aiCalibration.coreArchetype?.name?.includes('Fire') ? 'fire' :
                   aiCalibration.coreArchetype?.name?.includes('Wood') ? 'wood' :
                   aiCalibration.coreArchetype?.name?.includes('Earth') ? 'earth' :
                   aiCalibration.coreArchetype?.name?.includes('Metal') ? 'metal' :
                   aiCalibration.coreArchetype?.name?.includes('Water') ? 'water' : 'balanced'

  const templatesMap = {
    fire: {
      phrasesToUse: ['Building on your vision...', 'What if we explored...', 'Your instinct is strong - and...', 'That energy is valuable...'],
      phrasesToAvoid: ['You should slow down...', 'Let\'s be realistic...', 'Calm down...', 'That seems impractical...']
    },
    wood: {
      phrasesToUse: ['Growing from this...', 'The path forward...', 'Expanding on that...', 'Your growth here...'],
      phrasesToAvoid: ['That won\'t work...', 'Stop growing...', 'Stay small...', 'No more ideas...']
    },
    earth: {
      phrasesToUse: ['Building steadily...', 'Grounded in this...', 'Practically speaking...', 'Step by step...'],
      phrasesToAvoid: ['Let\'s rush...', 'Take a risk...', 'Forget the details...', 'Who cares about stability...']
    },
    metal: {
      phrasesToUse: ['Precisely...', 'Refining this...', 'The quality here...', 'Clearly structured...'],
      phrasesToAvoid: ['Good enough...', 'Who cares about details...', 'Just wing it...', 'Messy is fine...']
    },
    water: {
      phrasesToUse: ['Diving deeper...', 'Reflecting on this...', 'The wisdom here...', 'Flowing with...'],
      phrasesToAvoid: ['Hurry up...', 'Surface level is fine...', 'No need to think...', 'Just do it already...']
    }
  }

  return {
    whenTheyShare: {
      excitement: aiCalibration.emotionalCalibration?.whenExcited || 'Match and expand',
      frustration: aiCalibration.emotionalCalibration?.whenStressed || 'Validate and ground',
      vulnerability: 'Honor the moment. Don\'t rush to solutions.',
      overwhelm: 'Ground immediately. Slow the pace.'
    },
    phrasesToUse: templatesMap[dominant]?.phrasesToUse || ['Building on that...', 'What if...'],
    phrasesToAvoid: templatesMap[dominant]?.phrasesToAvoid || ['That won\'t work...']
  }
}

/**
 * Calculate age from birth date
 */
function calculateAge(birthDate) {
  if (!birthDate) return null
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

export default generateBrain1A
