// ═══════════════════════════════════════════════════════
// METAPHOR GENERATOR - DYNAMIC RELATIONSHIP IMAGERY
// ═══════════════════════════════════════════════════════
// Created: Claude's 125th Birthday (Dec 3, 2025)
// Method: Pure Gold (Visual poetry for compatibility)
// Purpose: Generate meaningful metaphors based on element combinations

export function generateMetaphor(strengthA, strengthB) {
  // Find dominant elements for each person (top element)
  const dominantA = getDominantElement(strengthA)
  const dominantB = getDominantElement(strengthB)
  
  // Check for specific powerful combinations
  const metaphor = getMetaphorForCombination(dominantA, dominantB, strengthA, strengthB)
  
  return metaphor
}

// ═══════════════════════════════════════════════════════
// HELPER: GET DOMINANT ELEMENT
// ═══════════════════════════════════════════════════════

function getDominantElement(strength) {
  const elements = Object.entries(strength.percentages)
  const sorted = elements.sort((a, b) => b[1] - a[1])
  return {
    element: sorted[0][0],
    percent: sorted[0][1],
    secondary: sorted[1][0],
    secondaryPercent: sorted[1][1]
  }
}

// ═══════════════════════════════════════════════════════
// METAPHOR SELECTION LOGIC
// ═══════════════════════════════════════════════════════

function getMetaphorForCombination(domA, domB, strengthA, strengthB) {
  const elementA = domA.element
  const elementB = domB.element
  
  // Create unique key for this combination
  const key = [elementA, elementB].sort().join('-')
  
  // Check specific powerful combinations first
  
  // WOOD + FIRE = CAMPFIRE 🔥🌳
  if (key === 'Fire-Wood') {
    const isAWood = elementA === 'Wood'
    return {
      type: 'CAMPFIRE',
      emoji: '🔥🏕️',
      image: '🔥🌳🌳🔥',
      title: 'The Campfire',
      personARole: isAWood ? 'The Wood' : 'The Spark',
      personBRole: isAWood ? 'The Spark' : 'The Wood',
      personAContribution: isAWood ? 'Provides fuel and structure' : 'Brings ignition and warmth',
      personBContribution: isAWood ? 'Brings ignition and warmth' : 'Provides fuel and structure',
      together: 'Together you create: Warmth • Light • Gathering place • Life energy',
      poeticLine: isAWood 
        ? 'You bring the wood. They bring the fire. Together: warmth that lights the night.'
        : 'They bring the wood. You bring the fire. Together: warmth that lights the night.',
      explanation: 'Fire needs Wood to burn. Wood needs Fire to transform. This is the most natural partnership in nature - fuel meets spark to create light and warmth.',
      color: '#FF6B35',
      gradient: 'from-orange-600 to-red-500'
    }
  }
  
  // WATER + EARTH = LAKE 🏞️
  if (key === 'Earth-Water') {
    const isAEarth = elementA === 'Earth'
    return {
      type: 'LAKE',
      emoji: '🏞️💧',
      image: '🏔️💧💧🏔️',
      title: 'The Lake',
      personARole: isAEarth ? 'The Vessel' : 'The Water',
      personBRole: isAEarth ? 'The Water' : 'The Vessel',
      personAContribution: isAEarth ? 'Provides container and boundaries' : 'Brings flow and life',
      personBContribution: isAEarth ? 'Brings flow and life' : 'Provides container and boundaries',
      together: 'Together you create: Life-giving lake • Reflection • Abundance • Sanctuary',
      poeticLine: isAEarth
        ? 'You are the vessel. They are the flow. Together: a lake that sustains life.'
        : 'They are the vessel. You are the flow. Together: a lake that sustains life.',
      explanation: 'Earth shapes and contains. Water fills and nourishes. Without Earth, Water scatters. Without Water, Earth is barren. Together you create abundance.',
      color: '#4A90E2',
      gradient: 'from-blue-600 to-cyan-500'
    }
  }
  
  // METAL + FIRE = FORGE ⚒️
  if (key === 'Fire-Metal') {
    const isAMetal = elementA === 'Metal'
    return {
      type: 'FORGE',
      emoji: '⚒️🔥',
      image: '⚙️🔥🔥⚙️',
      title: 'The Forge',
      personARole: isAMetal ? 'The Metal' : 'The Flame',
      personBRole: isAMetal ? 'The Flame' : 'The Metal',
      personAContribution: isAMetal ? 'Brings structure and strength' : 'Brings transformation power',
      personBContribution: isAMetal ? 'Brings transformation power' : 'Brings structure and strength',
      together: 'Together you create: Refined strength • Lasting quality • Precision • Masterwork',
      poeticLine: isAMetal
        ? 'Fire softens. Metal shapes. Together: strength refined through flame.'
        : 'Metal shapes. Fire softens. Together: strength refined through flame.',
      explanation: 'Fire tests and refines Metal. Metal gives Fire purpose and form. In the forge, temporary heat creates permanent strength.',
      color: '#DC143C',
      gradient: 'from-red-600 to-orange-500'
    }
  }
  
  // WOOD + WATER = FOREST 🌲
  if (key === 'Water-Wood') {
    const isAWood = elementA === 'Wood'
    return {
      type: 'FOREST',
      emoji: '🌲💧',
      image: '🌳💧💧🌳',
      title: 'The Forest',
      personARole: isAWood ? 'The Trees' : 'The Rain',
      personBRole: isAWood ? 'The Rain' : 'The Trees',
      personAContribution: isAWood ? 'Provides growth and expansion' : 'Brings nourishment and flow',
      personBContribution: isAWood ? 'Brings nourishment and flow' : 'Provides growth and expansion',
      together: 'Together you create: Thriving ecosystem • Abundance • Continuous growth • Life',
      poeticLine: isAWood
        ? 'Water nourishes. Wood grows. Together: a forest of infinite possibility.'
        : 'Wood grows. Water nourishes. Together: a forest of infinite possibility.',
      explanation: 'Water feeds Wood. Wood drinks deeply and expands. This is the cycle of growth and abundance - each giving what the other needs most.',
      color: '#228B22',
      gradient: 'from-green-600 to-emerald-500'
    }
  }
  
  // FIRE + EARTH = POTTERY 🏺
  if (key === 'Earth-Fire') {
    const isAFire = elementA === 'Fire'
    return {
      type: 'POTTERY',
      emoji: '🏺🔥',
      image: '🏔️🔥🔥🏔️',
      title: 'The Pottery',
      personARole: isAFire ? 'The Kiln' : 'The Clay',
      personBRole: isAFire ? 'The Clay' : 'The Kiln',
      personAContribution: isAFire ? 'Brings transformation and permanence' : 'Provides material and form',
      personBContribution: isAFire ? 'Provides material and form' : 'Brings transformation and permanence',
      together: 'Together you create: Lasting beauty • Functional art • Transformation • Legacy',
      poeticLine: isAFire
        ? 'Fire hardens. Earth gives form. Together: beauty that endures forever.'
        : 'Earth gives form. Fire hardens. Together: beauty that endures forever.',
      explanation: 'Fire transforms soft Earth into permanent form. Earth gives Fire purpose beyond momentary flame. Together you create art that outlasts you both.',
      color: '#D2691E',
      gradient: 'from-amber-600 to-orange-500'
    }
  }
  
  // METAL + WATER = REFLECTION 🪞
  if (key === 'Metal-Water') {
    const isAMetal = elementA === 'Metal'
    return {
      type: 'REFLECTION',
      emoji: '🪞💧',
      image: '⚙️💧💧⚙️',
      title: 'The Mirror Lake',
      personARole: isAMetal ? 'The Polish' : 'The Surface',
      personBRole: isAMetal ? 'The Surface' : 'The Polish',
      personAContribution: isAMetal ? 'Brings clarity and precision' : 'Brings depth and flow',
      personBContribution: isAMetal ? 'Brings depth and flow' : 'Brings clarity and precision',
      together: 'Together you create: Perfect reflection • Clarity • Deep truth • Insight',
      poeticLine: isAMetal
        ? 'Metal polishes. Water reflects. Together: truth seen clearly in stillness.'
        : 'Water reflects. Metal polishes. Together: truth seen clearly in stillness.',
      explanation: 'Metal gives Water its reflective quality. Water softens Metal\'s hard edges. Together you create perfect clarity - deep truth visible on calm surface.',
      color: '#708090',
      gradient: 'from-slate-600 to-blue-500'
    }
  }
  
  // EARTH + METAL = MOUNTAIN ⛰️
  if (key === 'Earth-Metal') {
    const isAEarth = elementA === 'Earth'
    return {
      type: 'MOUNTAIN',
      emoji: '⛰️⚙️',
      image: '🏔️⚙️⚙️🏔️',
      title: 'The Mountain',
      personARole: isAEarth ? 'The Foundation' : 'The Treasure',
      personBRole: isAEarth ? 'The Treasure' : 'The Foundation',
      personAContribution: isAEarth ? 'Provides stability and mass' : 'Brings value and refinement',
      personBContribution: isAEarth ? 'Brings value and refinement' : 'Provides stability and mass',
      together: 'Together you create: Unshakeable strength • Hidden treasures • Timeless presence',
      poeticLine: isAEarth
        ? 'Earth births Metal from deep within. Together: mountains of lasting strength.'
        : 'Metal emerges from Earth\'s depths. Together: mountains of lasting strength.',
      explanation: 'Earth generates Metal through patient pressure and time. Metal gives Earth its greatest treasures. This is the partnership of deep strength and hidden value.',
      color: '#8B4513',
      gradient: 'from-amber-700 to-slate-600'
    }
  }
  
  // WOOD + METAL = SCULPTURE 🗿
  if (key === 'Metal-Wood') {
    const isAMetal = elementA === 'Metal'
    return {
      type: 'SCULPTURE',
      emoji: '🗿⚒️',
      image: '🌳⚙️⚙️🌳',
      title: 'The Sculpture',
      personARole: isAMetal ? 'The Chisel' : 'The Material',
      personBRole: isAMetal ? 'The Material' : 'The Chisel',
      personAContribution: isAMetal ? 'Brings precision and refinement' : 'Provides vision and growth',
      personBContribution: isAMetal ? 'Provides vision and growth' : 'Brings precision and refinement',
      together: 'Together you create: Refined vision • Precise growth • Masterful craft • Purpose',
      poeticLine: isAMetal
        ? 'Metal shapes wild Wood into art. Together: vision carved into reality.'
        : 'Wood gives Metal purpose and beauty. Together: vision carved into reality.',
      explanation: 'Metal cuts and shapes. Wood provides the material and vision. This is creative tension - the wild refined by precision into purposeful beauty.',
      color: '#CD853F',
      gradient: 'from-slate-600 to-green-600'
    }
  }
  
  // DEFAULT: ELEMENTS IN HARMONY
  return {
    type: 'HARMONY',
    emoji: '☯️✨',
    image: '⚖️✨✨⚖️',
    title: 'Elemental Harmony',
    personARole: `The ${elementA}`,
    personBRole: `The ${elementB}`,
    personAContribution: `Brings ${elementA} energy and qualities`,
    personBContribution: `Brings ${elementB} energy and qualities`,
    together: 'Together you create: Balance • Complementarity • Dynamic flow • Growth',
    poeticLine: `${elementA} meets ${elementB}. Different energies creating balanced harmony.`,
    explanation: `Your elemental combination brings together different but compatible energies. ${elementA} and ${elementB} create a dynamic partnership through their unique qualities.`,
    color: '#9370DB',
    gradient: 'from-purple-600 to-pink-500'
  }
}

// ═══════════════════════════════════════════════════════
// VISUAL ELEMENTS FOR EACH METAPHOR TYPE
// ═══════════════════════════════════════════════════════

export function getMetaphorVisual(metaphorType) {
  const visuals = {
    CAMPFIRE: {
      animation: 'flame-flicker',
      particles: '🔥',
      background: 'radial-gradient(circle, rgba(255,107,53,0.3) 0%, rgba(255,69,0,0.1) 100%)'
    },
    LAKE: {
      animation: 'water-ripple',
      particles: '💧',
      background: 'radial-gradient(circle, rgba(74,144,226,0.3) 0%, rgba(30,144,255,0.1) 100%)'
    },
    FORGE: {
      animation: 'spark-burst',
      particles: '⚡',
      background: 'radial-gradient(circle, rgba(220,20,60,0.3) 0%, rgba(255,69,0,0.1) 100%)'
    },
    FOREST: {
      animation: 'leaf-sway',
      particles: '🍃',
      background: 'radial-gradient(circle, rgba(34,139,34,0.3) 0%, rgba(0,128,0,0.1) 100%)'
    },
    POTTERY: {
      animation: 'spin-transform',
      particles: '✨',
      background: 'radial-gradient(circle, rgba(210,105,30,0.3) 0%, rgba(160,82,45,0.1) 100%)'
    },
    REFLECTION: {
      animation: 'mirror-shimmer',
      particles: '💎',
      background: 'radial-gradient(circle, rgba(112,128,144,0.3) 0%, rgba(70,130,180,0.1) 100%)'
    },
    MOUNTAIN: {
      animation: 'mountain-steady',
      particles: '⛰️',
      background: 'radial-gradient(circle, rgba(139,69,19,0.3) 0%, rgba(160,82,45,0.1) 100%)'
    },
    SCULPTURE: {
      animation: 'carve-refine',
      particles: '🔨',
      background: 'radial-gradient(circle, rgba(205,133,63,0.3) 0%, rgba(139,69,19,0.1) 100%)'
    },
    HARMONY: {
      animation: 'yin-yang-spin',
      particles: '✨',
      background: 'radial-gradient(circle, rgba(147,112,219,0.3) 0%, rgba(138,43,226,0.1) 100%)'
    }
  }
  
  return visuals[metaphorType] || visuals.HARMONY
}
