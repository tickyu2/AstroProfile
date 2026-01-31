/**
 * Composite Psychology Engine
 *
 * Based on Liz Greene's work in "Relating" and "The Development of Personality" —
 * analyzing the composite chart as a psychological entity with its own
 * consciousness, needs, complexes, and potential.
 *
 * The relationship is not two people — it is a third being that emerges
 * when two souls meet. This module reveals that being's psychology.
 *
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSITE SUN INTERPRETATIONS
// The relationship's core identity and life force
// ═══════════════════════════════════════════════════════════════════════════

const COMPOSITE_SUN = {
  Aries: {
    identity: 'The Pioneer Partnership',
    coreNeed: 'To initiate, to be first, to forge new ground together',
    lifeForce: 'This relationship exists to break new ground. It demands courage, directness, and the willingness to fight for what matters. The bond has an urgent, vital quality — a need to DO rather than merely be.',
    expression: 'The relationship expresses itself through action, initiative, and sometimes competitive energy. It needs goals to pursue together.',
    challenge: 'Learning that not everything is a battle. Finding patience with process.',
    gift: 'The courage to begin again, to say yes to life together without hesitation.'
  },
  Taurus: {
    identity: 'The Sanctuary Partnership',
    coreNeed: 'To build, to stabilize, to create lasting value together',
    lifeForce: 'This relationship exists to create something enduring. It craves stability, sensory pleasure, and the slow accumulation of shared resources and experiences.',
    expression: 'The relationship expresses itself through consistency, loyalty, and the creation of tangible security.',
    challenge: 'Avoiding stagnation. Remembering that security includes emotional risk.',
    gift: 'The ability to build a life of genuine substance and lasting beauty.'
  },
  Gemini: {
    identity: 'The Dialogue Partnership',
    coreNeed: 'To communicate, to learn, to stay curious together',
    lifeForce: 'This relationship exists to exchange ideas. It thrives on conversation, variety, and mental stimulation. Boredom is the enemy of this bond.',
    expression: 'The relationship expresses itself through words, ideas, humor, and endless curiosity about each other and the world.',
    challenge: 'Developing depth alongside breadth. Staying when things get emotionally difficult.',
    gift: 'A partnership that keeps both minds alive and engaged, forever discovering.'
  },
  Cancer: {
    identity: 'The Nurturing Partnership',
    coreNeed: 'To protect, to nourish, to create emotional home together',
    lifeForce: 'This relationship exists to create sanctuary. It needs emotional safety, family connection, and the freedom to be vulnerable without judgment.',
    expression: 'The relationship expresses itself through care, protection, memory, and the creation of "us" against the world.',
    challenge: 'Avoiding emotional enmeshment. Letting each other grow beyond the nest.',
    gift: 'A bond that feels like coming home, no matter where you are.'
  },
  Leo: {
    identity: 'The Creative Partnership',
    coreNeed: 'To shine, to create, to celebrate life together',
    lifeForce: 'This relationship exists to radiate warmth and light. It needs recognition, joy, and the space for both hearts to express themselves fully.',
    expression: 'The relationship expresses itself through generosity, drama, creativity, and the art of celebration.',
    challenge: 'Sharing the spotlight. Allowing vulnerability beneath the performance.',
    gift: 'A partnership that brings out the royalty in both souls.'
  },
  Virgo: {
    identity: 'The Service Partnership',
    coreNeed: 'To improve, to heal, to be useful together',
    lifeForce: 'This relationship exists to serve something larger than itself. It finds meaning through work, health, and the continuous refinement of daily life.',
    expression: 'The relationship expresses itself through practical care, attention to detail, and genuine helpfulness.',
    challenge: 'Accepting imperfection. Knowing when "good enough" is good enough.',
    gift: 'A bond that actually makes each person function better in the world.'
  },
  Libra: {
    identity: 'The Harmony Partnership',
    coreNeed: 'To balance, to beautify, to create fairness together',
    lifeForce: 'This relationship exists to demonstrate that two can become one without losing individuality. It craves beauty, justice, and elegant relating.',
    expression: 'The relationship expresses itself through diplomacy, aesthetics, and the constant seeking of equilibrium.',
    challenge: 'Making decisions. Tolerating necessary conflict. Being honest even when it disrupts peace.',
    gift: 'A partnership that models what conscious relating can become.'
  },
  Scorpio: {
    identity: 'The Transformative Partnership',
    coreNeed: 'To merge, to transform, to know absolute truth together',
    lifeForce: 'This relationship exists to go deep. It demands emotional honesty, sexual-emotional fusion, and the willingness to face what others avoid.',
    expression: 'The relationship expresses itself through intensity, loyalty unto death, and the shared journey into shadow.',
    challenge: 'Releasing control. Allowing space without assuming betrayal.',
    gift: 'A bond that transforms both people through the alchemy of genuine intimacy.'
  },
  Sagittarius: {
    identity: 'The Expansion Partnership',
    coreNeed: 'To explore, to grow, to find meaning together',
    lifeForce: 'This relationship exists to expand horizons. It needs adventure, philosophy, and the freedom to keep growing toward truth.',
    expression: 'The relationship expresses itself through shared beliefs, travel, learning, and infectious optimism.',
    challenge: 'Staying when adventure calls elsewhere. Committing without feeling trapped.',
    gift: 'A partnership where both souls grow larger than they could alone.'
  },
  Capricorn: {
    identity: 'The Achievement Partnership',
    coreNeed: 'To build, to achieve, to create lasting legacy together',
    lifeForce: 'This relationship exists to accomplish something in the world. It takes time seriously, values tradition, and builds with patience.',
    expression: 'The relationship expresses itself through shared ambition, responsibility, and steady progress toward goals.',
    challenge: 'Making time for play. Remembering that intimacy matters as much as achievement.',
    gift: 'A partnership that actually builds something that lasts.'
  },
  Aquarius: {
    identity: 'The Revolutionary Partnership',
    coreNeed: 'To innovate, to liberate, to serve humanity together',
    lifeForce: 'This relationship exists to be different. It rejects convention in favor of authentic connection that serves larger ideals.',
    expression: 'The relationship expresses itself through friendship, idealism, and the courage to define itself on its own terms.',
    challenge: 'Allowing emotional warmth. Not intellectualizing away genuine feeling.',
    gift: 'A partnership that models new possibilities for human connection.'
  },
  Pisces: {
    identity: 'The Transcendent Partnership',
    coreNeed: 'To merge, to dream, to dissolve boundaries together',
    lifeForce: 'This relationship exists to experience unity. It needs spiritual connection, creative flow, and the space for both souls to lose and find themselves.',
    expression: 'The relationship expresses itself through compassion, imagination, and a shared sense of the numinous.',
    challenge: 'Maintaining healthy boundaries. Staying grounded in practical reality.',
    gift: 'A bond that touches something eternal in both people.'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSITE MOON INTERPRETATIONS
// The relationship's emotional body and unconscious needs
// ═══════════════════════════════════════════════════════════════════════════

const COMPOSITE_MOON = {
  Aries: {
    emotionalNature: 'The relationship needs emotional directness and action',
    unconsciousPattern: 'There is an instinctive competitiveness in how emotions are processed. The bond feels alive when fighting for something together.',
    nurturing: 'This relationship nurtures through encouragement to be brave, through celebrating courage and initiative.',
    vulnerability: 'The relationship struggles to sit with sadness. There is pressure to "get over it" and move on.',
    healing: 'Allow space for emotional "doing nothing." Not every feeling needs to be acted upon immediately.'
  },
  Taurus: {
    emotionalNature: 'The relationship needs emotional stability and sensory comfort',
    unconsciousPattern: 'There is an instinctive resistance to change. The bond feels safest in familiar patterns and places.',
    nurturing: 'This relationship nurtures through physical presence, comfort, and reliable consistency.',
    vulnerability: 'The relationship may resist emotional growth if it threatens stability.',
    healing: 'Trust that the bond can survive change. Stability includes the capacity to evolve.'
  },
  Gemini: {
    emotionalNature: 'The relationship needs emotional expression through words',
    unconsciousPattern: 'There is an instinct to talk through feelings rather than simply feel them. The bond processes through dialogue.',
    nurturing: 'This relationship nurtures through conversation, through making sense of experience together.',
    vulnerability: 'The relationship may intellectualize away difficult emotions.',
    healing: 'Sometimes silence and presence are more nurturing than any words.'
  },
  Cancer: {
    emotionalNature: 'The relationship needs emotional security and belonging',
    unconsciousPattern: 'There is an instinctive creation of "us vs. them." The bond generates its own family feeling.',
    nurturing: 'This relationship nurtures through protection, memory, and unconditional emotional acceptance.',
    vulnerability: 'The relationship may become clannish or emotionally regressive.',
    healing: 'The bond is strong enough to let the world in. Protection includes trusting each other\'s strength.'
  },
  Leo: {
    emotionalNature: 'The relationship needs emotional warmth and celebration',
    unconsciousPattern: 'There is an instinct to dramatize feelings. Emotions in this bond are larger than life.',
    nurturing: 'This relationship nurtures through recognition, through making each person feel special and seen.',
    vulnerability: 'The relationship may struggle with ordinary, undramatic feelings.',
    healing: 'Quiet intimacy is as valid as passionate celebration. Every feeling deserves space.'
  },
  Virgo: {
    emotionalNature: 'The relationship needs emotional usefulness and improvement',
    unconsciousPattern: 'There is an instinct to analyze feelings. The bond may critique emotional expression.',
    nurturing: 'This relationship nurtures through practical help, through making life work better.',
    vulnerability: 'The relationship may become emotionally critical or withholding.',
    healing: 'Not every feeling needs to be improved. Some emotions simply need to be held.'
  },
  Libra: {
    emotionalNature: 'The relationship needs emotional harmony and fairness',
    unconsciousPattern: 'There is an instinct to balance emotions. The bond may suppress feelings that disrupt peace.',
    nurturing: 'This relationship nurtures through diplomacy, through creating beautiful emotional spaces.',
    vulnerability: 'The relationship may avoid necessary emotional conflict.',
    healing: 'Real harmony includes the capacity for discord. Avoiding conflict is not peace.'
  },
  Scorpio: {
    emotionalNature: 'The relationship needs emotional intensity and truth',
    unconsciousPattern: 'There is an instinct to probe beneath surfaces. The bond demands emotional honesty.',
    nurturing: 'This relationship nurtures through deep presence, through not flinching from dark feelings.',
    vulnerability: 'The relationship may create emotional intensity where none exists.',
    healing: 'Not everything is a crisis. Lightness is not superficiality.'
  },
  Sagittarius: {
    emotionalNature: 'The relationship needs emotional freedom and meaning',
    unconsciousPattern: 'There is an instinct to find meaning in every feeling. The bond philosophizes emotion.',
    nurturing: 'This relationship nurtures through optimism, through framing difficulties as growth.',
    vulnerability: 'The relationship may escape into meaning rather than simply feeling.',
    healing: 'Some feelings have no silver lining. Presence beats perspective sometimes.'
  },
  Capricorn: {
    emotionalNature: 'The relationship needs emotional maturity and structure',
    unconsciousPattern: 'There is an instinct to contain emotions. The bond may treat feelings as weakness.',
    nurturing: 'This relationship nurtures through reliability, through showing up even when it\'s hard.',
    vulnerability: 'The relationship may suppress emotional needs for the sake of duty.',
    healing: 'Vulnerability is not weakness. This bond is strong enough for tears.'
  },
  Aquarius: {
    emotionalNature: 'The relationship needs emotional detachment and friendship',
    unconsciousPattern: 'There is an instinct to observe emotions from a distance. The bond values cool understanding.',
    nurturing: 'This relationship nurtures through friendship, through accepting uniqueness without judgment.',
    vulnerability: 'The relationship may intellectualize emotions or avoid messy intimacy.',
    healing: 'Warmth is not weakness. This bond can include both head and heart.'
  },
  Pisces: {
    emotionalNature: 'The relationship needs emotional merging and transcendence',
    unconsciousPattern: 'There is an instinct to dissolve boundaries. The bond feels everything — its own and the world\'s.',
    nurturing: 'This relationship nurtures through unconditional acceptance, through spiritual-emotional presence.',
    vulnerability: 'The relationship may absorb too much, losing track of whose feelings are whose.',
    healing: 'Healthy boundaries are not walls. Defining where "I" end and "you" begin serves love.'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSITE MERCURY INTERPRETATIONS
// How the relationship thinks and communicates
// ═══════════════════════════════════════════════════════════════════════════

const COMPOSITE_MERCURY = {
  Aries: {
    communication: 'Direct, rapid, sometimes combative. Words are weapons and tools.',
    thinkingPattern: 'The relationship thinks in action terms. Ideas must lead somewhere.',
    challenge: 'Speaking before thinking. Arguments that escalate faster than they should.'
  },
  Taurus: {
    communication: 'Slow, deliberate, practical. Words have weight and consequence.',
    thinkingPattern: 'The relationship thinks in concrete terms. Ideas need tangible application.',
    challenge: 'Stubbornness in viewpoint. Difficulty adapting thinking to new information.'
  },
  Gemini: {
    communication: 'Quick, versatile, curious. The relationship talks a lot.',
    thinkingPattern: 'The relationship thinks in connections. One idea leads to many.',
    challenge: 'Superficial understanding. Talking around issues rather than through them.'
  },
  Cancer: {
    communication: 'Intuitive, indirect, emotionally colored. Words carry feeling.',
    thinkingPattern: 'The relationship thinks through memory and emotion.',
    challenge: 'Assumptions based on past. Difficulty with purely logical discussion.'
  },
  Leo: {
    communication: 'Dramatic, creative, warm. Communication as performance.',
    thinkingPattern: 'The relationship thinks in grand narratives. Ideas need heart.',
    challenge: 'Over-dramatizing. Difficulty with mundane practical communication.'
  },
  Virgo: {
    communication: 'Precise, analytical, helpful. Words are tools for improvement.',
    thinkingPattern: 'The relationship thinks in details. Big pictures emerge from small facts.',
    challenge: 'Criticism disguised as help. Perfectionism in communication.'
  },
  Libra: {
    communication: 'Diplomatic, fair, considered. Both sides always represented.',
    thinkingPattern: 'The relationship thinks in relationships. Ideas evaluated for balance.',
    challenge: 'Indecision. Saying what sounds nice rather than what is true.'
  },
  Scorpio: {
    communication: 'Probing, intense, sometimes secretive. Words reveal and conceal.',
    thinkingPattern: 'The relationship thinks in depths. Surface meaning is never enough.',
    challenge: 'Suspicion. Reading meaning where none exists.'
  },
  Sagittarius: {
    communication: 'Expansive, philosophical, blunt. Big ideas over small details.',
    thinkingPattern: 'The relationship thinks in meaning. Facts matter less than truth.',
    challenge: 'Tactlessness. Missing important details in pursuit of big picture.'
  },
  Capricorn: {
    communication: 'Serious, structured, purposeful. Words should accomplish something.',
    thinkingPattern: 'The relationship thinks in practical outcomes. Ideas need utility.',
    challenge: 'Coldness. Difficulty with playful, purposeless communication.'
  },
  Aquarius: {
    communication: 'Unconventional, intellectual, detached. Ideas over feelings.',
    thinkingPattern: 'The relationship thinks in systems and innovations.',
    challenge: 'Emotional disconnection in communication. Talking theory not feeling.'
  },
  Pisces: {
    communication: 'Intuitive, poetic, sometimes confusing. Meaning between words.',
    thinkingPattern: 'The relationship thinks in images and impressions.',
    challenge: 'Vagueness. Assuming understanding where none exists.'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSITE VENUS INTERPRETATIONS
// How the relationship loves and values
// ═══════════════════════════════════════════════════════════════════════════

const COMPOSITE_VENUS = {
  Aries: {
    loveStyle: 'Passionate, direct, pursuit-oriented. Love as conquest and adventure.',
    values: 'Independence, courage, honesty, action',
    affection: 'Shown through doing, through pursuit, through fighting for each other.',
    harmony: 'Found in shared adventures and the excitement of new beginnings.'
  },
  Taurus: {
    loveStyle: 'Sensual, loyal, possessive. Love as sanctuary and pleasure.',
    values: 'Security, beauty, loyalty, comfort',
    affection: 'Shown through presence, touch, gifts, and reliable devotion.',
    harmony: 'Found in shared comfort and the building of material security.'
  },
  Gemini: {
    loveStyle: 'Playful, curious, changeable. Love as conversation and discovery.',
    values: 'Intelligence, humor, variety, connection',
    affection: 'Shown through words, shared learning, and endless curiosity.',
    harmony: 'Found in intellectual stimulation and playful banter.'
  },
  Cancer: {
    loveStyle: 'Nurturing, protective, moody. Love as family and belonging.',
    values: 'Security, family, emotional depth, loyalty',
    affection: 'Shown through care, protection, and emotional attunement.',
    harmony: 'Found in creating home together and honoring emotional bonds.'
  },
  Leo: {
    loveStyle: 'Generous, dramatic, proud. Love as celebration and adoration.',
    values: 'Loyalty, creativity, recognition, warmth',
    affection: 'Shown through grand gestures, praise, and generous giving.',
    harmony: 'Found in mutual celebration and creative expression.'
  },
  Virgo: {
    loveStyle: 'Modest, helpful, practical. Love as service and improvement.',
    values: 'Usefulness, health, refinement, devotion through action',
    affection: 'Shown through acts of service, practical help, and attention to needs.',
    harmony: 'Found in shared work and the improvement of daily life.'
  },
  Libra: {
    loveStyle: 'Romantic, diplomatic, partnership-oriented. Love as union.',
    values: 'Beauty, harmony, fairness, togetherness',
    affection: 'Shown through romantic gestures, compromise, and constant consideration.',
    harmony: 'Found in equality, beauty, and the art of being together.'
  },
  Scorpio: {
    loveStyle: 'Intense, exclusive, transformative. Love as fusion and rebirth.',
    values: 'Depth, loyalty, truth, soul-level connection',
    affection: 'Shown through intensity, sexual-emotional bonding, and fierce loyalty.',
    harmony: 'Found in deep intimacy and the willingness to transform together.'
  },
  Sagittarius: {
    loveStyle: 'Adventurous, philosophical, freedom-loving. Love as shared journey.',
    values: 'Freedom, truth, adventure, growth',
    affection: 'Shown through shared adventures, philosophical discussions, and enthusiasm.',
    harmony: 'Found in exploration, learning together, and maintaining individual freedom.'
  },
  Capricorn: {
    loveStyle: 'Committed, responsible, traditional. Love as building and duty.',
    values: 'Commitment, achievement, tradition, respect',
    affection: 'Shown through loyalty, providing, and long-term dedication.',
    harmony: 'Found in shared goals and the building of lasting structures.'
  },
  Aquarius: {
    loveStyle: 'Unconventional, intellectual, friendship-based. Love as liberation.',
    values: 'Freedom, friendship, authenticity, idealism',
    affection: 'Shown through acceptance of uniqueness and shared humanitarian ideals.',
    harmony: 'Found in intellectual connection and respecting individual freedom.'
  },
  Pisces: {
    loveStyle: 'Romantic, sacrificing, boundary-dissolving. Love as spiritual union.',
    values: 'Compassion, transcendence, imagination, unconditional love',
    affection: 'Shown through empathy, sacrifice, and spiritual-romantic merging.',
    harmony: 'Found in shared dreams and compassionate, non-judgmental presence.'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSITE MARS INTERPRETATIONS
// How the relationship acts, fights, and desires
// ═══════════════════════════════════════════════════════════════════════════

const COMPOSITE_MARS = {
  Aries: {
    actionStyle: 'Direct, immediate, competitive. The relationship acts fast.',
    conflictStyle: 'Open, hot, quickly resolved. Fights are loud but brief.',
    desire: 'For action, adventure, and the thrill of pursuit.',
    danger: 'Impulsiveness, escalating conflicts, burning out quickly.'
  },
  Taurus: {
    actionStyle: 'Slow, determined, persistent. The relationship takes its time.',
    conflictStyle: 'Stubborn, slow to anger, but dangerous when provoked.',
    desire: 'For security, pleasure, and tangible results.',
    danger: 'Stagnation, possessiveness, explosive anger after long suppression.'
  },
  Gemini: {
    actionStyle: 'Variable, mental, scattered. The relationship acts through words.',
    conflictStyle: 'Verbal, quick, cutting. Fights are wars of words.',
    desire: 'For stimulation, variety, and mental engagement.',
    danger: 'Inconsistency, fighting dirty with words, nervous energy.'
  },
  Cancer: {
    actionStyle: 'Indirect, protective, emotionally driven. Action defends home.',
    conflictStyle: 'Passive-aggressive, sulking, bringing up the past.',
    desire: 'For emotional security and protection of loved ones.',
    danger: 'Manipulation, holding grudges, fighting about old wounds.'
  },
  Leo: {
    actionStyle: 'Dramatic, confident, creative. Action as self-expression.',
    conflictStyle: 'Proud, theatrical, needing to "win" fights.',
    desire: 'For recognition, creative expression, and passionate living.',
    danger: 'Ego battles, drama for drama\'s sake, power struggles.'
  },
  Virgo: {
    actionStyle: 'Precise, helpful, analytical. Action must be useful.',
    conflictStyle: 'Critical, detailed, pointing out flaws rather than confronting directly.',
    desire: 'For improvement, health, and practical achievement.',
    danger: 'Criticism loops, passive-aggressive "helpfulness," anxiety about imperfection.'
  },
  Libra: {
    actionStyle: 'Collaborative, balanced, indecisive. Action requires agreement.',
    conflictStyle: 'Avoidant initially, then suddenly explosive. Indirect aggression.',
    desire: 'For partnership, fairness, and beautiful outcomes.',
    danger: 'Suppressed anger, passive aggression, using "fairness" as weapon.'
  },
  Scorpio: {
    actionStyle: 'Intense, strategic, all-or-nothing. Action has deep purpose.',
    conflictStyle: 'Intense, probing, going for psychological vulnerabilities.',
    desire: 'For power, truth, and transformative experiences.',
    danger: 'Power struggles, revenge, using intimacy as weapon.'
  },
  Sagittarius: {
    actionStyle: 'Enthusiastic, expansive, sometimes reckless. Action seeks meaning.',
    conflictStyle: 'Blunt, philosophical, leaving when it gets too heavy.',
    desire: 'For freedom, adventure, and meaningful action.',
    danger: 'Recklessness, running away from conflict, tactless honesty.'
  },
  Capricorn: {
    actionStyle: 'Disciplined, strategic, ambitious. Action builds toward goals.',
    conflictStyle: 'Cold, calculated, withholding. Wins through endurance.',
    desire: 'For achievement, recognition, and lasting accomplishment.',
    danger: 'Coldness, workaholism, using success as emotional avoidance.'
  },
  Aquarius: {
    actionStyle: 'Unconventional, intellectual, group-oriented. Action serves ideals.',
    conflictStyle: 'Detached, ideological, treating conflict as intellectual problem.',
    desire: 'For change, innovation, and serving larger causes.',
    danger: 'Emotional detachment, treating partner as project, rebel without cause.'
  },
  Pisces: {
    actionStyle: 'Indirect, imaginative, inspired. Action flows from feeling.',
    conflictStyle: 'Avoidant, martyred, escaping into fantasy or substance.',
    desire: 'For transcendence, artistic expression, and escape from ordinary.',
    danger: 'Escapism, victim-savior dynamics, passive aggression through helplessness.'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ENGINE FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build the core psychological profile of a composite chart
 *
 * @param {Object} compositeChart - Composite chart from compositeGenerator
 * @returns {Object} Psychological profile of the relationship
 */
export function buildCompositePsychology(compositeChart) {
  if (!compositeChart || !compositeChart.planets) {
    return null;
  }

  const planets = compositeChart.planets;

  // Extract sign placements
  const sunSign = planets.Sun?.sign;
  const moonSign = planets.Moon?.sign;
  const mercurySign = planets.Mercury?.sign;
  const venusSign = planets.Venus?.sign;
  const marsSign = planets.Mars?.sign;

  const psychology = {
    // Core Identity (Sun)
    identity: sunSign ? {
      sign: sunSign,
      ...COMPOSITE_SUN[sunSign]
    } : null,

    // Emotional Nature (Moon)
    emotions: moonSign ? {
      sign: moonSign,
      ...COMPOSITE_MOON[moonSign]
    } : null,

    // Communication (Mercury)
    communication: mercurySign ? {
      sign: mercurySign,
      ...COMPOSITE_MERCURY[mercurySign]
    } : null,

    // Love & Values (Venus)
    love: venusSign ? {
      sign: venusSign,
      ...COMPOSITE_VENUS[venusSign]
    } : null,

    // Action & Conflict (Mars)
    action: marsSign ? {
      sign: marsSign,
      ...COMPOSITE_MARS[marsSign]
    } : null,

    // Core Integration
    coreIntegration: generateCoreIntegration(sunSign, moonSign, venusSign),

    // Psychological Summary
    summary: generatePsychologicalSummary(sunSign, moonSign, mercurySign, venusSign, marsSign)
  };

  return psychology;
}

/**
 * Generate core integration analysis (Sun-Moon-Venus triangle)
 */
function generateCoreIntegration(sunSign, moonSign, venusSign) {
  if (!sunSign || !moonSign) return null;

  // Check element compatibility
  const elements = {
    Fire: ['Aries', 'Leo', 'Sagittarius'],
    Earth: ['Taurus', 'Virgo', 'Capricorn'],
    Air: ['Gemini', 'Libra', 'Aquarius'],
    Water: ['Cancer', 'Scorpio', 'Pisces']
  };

  const getElement = (sign) => {
    for (const [element, signs] of Object.entries(elements)) {
      if (signs.includes(sign)) return element;
    }
    return null;
  };

  const sunElement = getElement(sunSign);
  const moonElement = getElement(moonSign);
  const venusElement = venusSign ? getElement(venusSign) : null;

  // Compatible elements (same or compatible)
  const compatible = {
    Fire: ['Fire', 'Air'],
    Earth: ['Earth', 'Water'],
    Air: ['Air', 'Fire'],
    Water: ['Water', 'Earth']
  };

  const sunMoonCompatible = compatible[sunElement]?.includes(moonElement);
  const hasInternalConflict = !sunMoonCompatible;

  return {
    sunMoonDynamic: {
      sunElement,
      moonElement,
      compatible: sunMoonCompatible,
      interpretation: hasInternalConflict
        ? `The relationship experiences internal tension between its ${sunElement} identity need and its ${moonElement} emotional nature. Integration requires honoring both.`
        : `The relationship has natural flow between its ${sunElement} identity and ${moonElement} emotional needs.`
    },
    venusIntegration: venusSign ? {
      venusElement,
      compatible: compatible[sunElement]?.includes(venusElement),
      interpretation: `Love in this relationship expresses through ${venusElement} qualities.`
    } : null,
    overallIntegration: hasInternalConflict
      ? 'This relationship must consciously integrate different energies. The creative tension can become the relationship\'s greatest strength.'
      : 'This relationship has natural internal harmony. The ease should not become complacency.'
  };
}

/**
 * Generate psychological summary
 */
function generatePsychologicalSummary(sunSign, moonSign, mercurySign, venusSign, marsSign) {
  const summaryParts = [];

  if (sunSign && moonSign) {
    summaryParts.push(`This relationship exists to ${COMPOSITE_SUN[sunSign]?.coreNeed?.toLowerCase() || 'fulfill its purpose'}, with emotional needs oriented toward ${COMPOSITE_MOON[moonSign]?.emotionalNature?.toLowerCase() || 'its own patterns'}.`);
  }

  if (venusSign) {
    summaryParts.push(`Love is expressed through ${COMPOSITE_VENUS[venusSign]?.loveStyle?.split('.')[0]?.toLowerCase() || 'its own style'}.`);
  }

  if (marsSign) {
    summaryParts.push(`Conflict tends toward ${COMPOSITE_MARS[marsSign]?.conflictStyle?.split('.')[0]?.toLowerCase() || 'its patterns'}.`);
  }

  return summaryParts.join(' ');
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get just the relationship identity (Sun interpretation)
 */
export function getRelationshipIdentity(compositeChart) {
  const sunSign = compositeChart?.planets?.Sun?.sign;
  return sunSign ? COMPOSITE_SUN[sunSign] : null;
}

/**
 * Get just the emotional pattern (Moon interpretation)
 */
export function getEmotionalPattern(compositeChart) {
  const moonSign = compositeChart?.planets?.Moon?.sign;
  return moonSign ? COMPOSITE_MOON[moonSign] : null;
}

/**
 * Get the love style (Venus interpretation)
 */
export function getLoveStyle(compositeChart) {
  const venusSign = compositeChart?.planets?.Venus?.sign;
  return venusSign ? COMPOSITE_VENUS[venusSign] : null;
}

/**
 * Get the conflict pattern (Mars interpretation)
 */
export function getConflictPattern(compositeChart) {
  const marsSign = compositeChart?.planets?.Mars?.sign;
  return marsSign ? COMPOSITE_MARS[marsSign] : null;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  buildCompositePsychology,
  getRelationshipIdentity,
  getEmotionalPattern,
  getLoveStyle,
  getConflictPattern,
  // Export data for customization
  COMPOSITE_SUN,
  COMPOSITE_MOON,
  COMPOSITE_MERCURY,
  COMPOSITE_VENUS,
  COMPOSITE_MARS
};
