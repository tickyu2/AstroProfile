/**
 * Hero's Journey Individuation Framework
 * Based on Joseph Campbell's monomyth and Carl Jung's individuation process
 * Applied to astrological chart analysis in the Liz Greene tradition
 */

// The 12 Stages of the Hero's Journey mapped to Houses
const JOURNEY_STAGES = {
  1: {
    stage: 'The Ordinary World',
    house: 1,
    phase: 'departure',
    description: 'The hero exists in their familiar environment, not yet aware of the adventure awaiting.',
    astroSignificance: 'The Ascendant and 1st house show our default persona, the mask we wear in everyday life.',
    challenge: 'Recognizing the limitations of the current self-concept',
    integration: 'Understanding that identity is not fixed but a starting point for transformation',
    questions: [
      'What persona do I present to the world?',
      'How does my self-image limit my potential?',
      'What aspects of myself remain unexplored?'
    ]
  },
  2: {
    stage: 'The Call to Adventure',
    house: 4,
    phase: 'departure',
    description: 'Something disrupts the ordinary world, calling the hero to a new path.',
    astroSignificance: 'The IC and 4th house represent our deepest roots and the unconscious call from within.',
    challenge: 'Hearing the inner voice that demands growth',
    integration: 'Accepting that comfort must sometimes be sacrificed for authenticity',
    questions: [
      'What deep yearning have I been ignoring?',
      'What family patterns am I being called to transform?',
      'Where does my soul want to go?'
    ]
  },
  3: {
    stage: 'Refusal of the Call',
    house: 12,
    phase: 'departure',
    description: 'Fear and doubt cause the hero to hesitate or refuse the journey.',
    astroSignificance: 'The 12th house shows our hidden fears, self-undoing patterns, and where we sabotage growth.',
    challenge: 'Confronting the fears that keep us small',
    integration: 'Recognizing resistance as a natural part of transformation',
    questions: [
      'What fears prevent me from stepping into my power?',
      'How do I unconsciously sabotage my own growth?',
      'What hidden part of myself am I afraid to face?'
    ]
  },
  4: {
    stage: 'Meeting the Mentor',
    house: 9,
    phase: 'departure',
    description: 'A wise figure appears who provides guidance, tools, or wisdom for the journey.',
    astroSignificance: 'The 9th house governs teachers, philosophy, and the higher wisdom that guides us.',
    challenge: 'Being open to guidance from unexpected sources',
    integration: 'Internalizing wisdom rather than depending on external authorities',
    questions: [
      'What teachings have shaped my worldview?',
      'Who has been my guide or mentor?',
      'What wisdom do I need to embrace?'
    ]
  },
  5: {
    stage: 'Crossing the Threshold',
    house: 7,
    phase: 'initiation',
    description: 'The hero commits to the journey, leaving the ordinary world behind.',
    astroSignificance: 'The Descendant and 7th house mark the horizon of the Other—the unknown we must engage.',
    challenge: 'Letting go of the familiar self to engage with the Other',
    integration: 'Understanding that relationship is the crucible of transformation',
    questions: [
      'What must I leave behind to move forward?',
      'How do relationships mirror my unlived self?',
      'What unknown territory am I being called to enter?'
    ]
  },
  6: {
    stage: 'Tests, Allies, and Enemies',
    house: 6,
    phase: 'initiation',
    description: 'The hero faces challenges and discovers who can be trusted.',
    astroSignificance: 'The 6th house governs daily trials, service, and the discipline required for growth.',
    challenge: 'Developing discernment and practical skills',
    integration: 'Transforming obstacles into opportunities for mastery',
    questions: [
      'What daily practices support my transformation?',
      'How do I distinguish true allies from false friends?',
      'What skills must I develop for this journey?'
    ]
  },
  7: {
    stage: 'Approach to the Inmost Cave',
    house: 8,
    phase: 'initiation',
    description: 'The hero approaches the central crisis, preparing for the supreme ordeal.',
    astroSignificance: 'The 8th house is the realm of death, transformation, and the psyche\'s depths.',
    challenge: 'Facing the darkest aspects of self and existence',
    integration: 'Accepting that death (of the ego) precedes rebirth',
    questions: [
      'What must die in me for new life to emerge?',
      'What taboo territory must I explore?',
      'How do I prepare for profound transformation?'
    ]
  },
  8: {
    stage: 'The Ordeal',
    house: 8,
    phase: 'initiation',
    description: 'The hero faces their greatest fear and experiences a form of death.',
    astroSignificance: 'The 8th house crisis point—ego death and the encounter with the shadow.',
    challenge: 'Surrendering to transformation rather than fighting it',
    integration: 'Discovering that destruction of the false self reveals the true self',
    questions: [
      'What is my greatest fear about myself?',
      'What would it mean to truly let go?',
      'How have past crises transformed me?'
    ]
  },
  9: {
    stage: 'Reward (Seizing the Sword)',
    house: 5,
    phase: 'return',
    description: 'Having survived death, the hero claims their reward or new power.',
    astroSignificance: 'The 5th house represents creative self-expression and the gold retrieved from the depths.',
    challenge: 'Claiming one\'s authentic creative power',
    integration: 'Expressing the transformed self through creative acts',
    questions: [
      'What gift have I retrieved from the depths?',
      'How will I express my transformed self?',
      'What creative power have I claimed?'
    ]
  },
  10: {
    stage: 'The Road Back',
    house: 3,
    phase: 'return',
    description: 'The hero must return to the ordinary world with their treasure.',
    astroSignificance: 'The 3rd house governs communication and the bridge between inner and outer worlds.',
    challenge: 'Translating profound experience into communicable wisdom',
    integration: 'Finding words and ways to share the journey\'s gifts',
    questions: [
      'How do I communicate what I\'ve learned?',
      'What resistance do I face in returning?',
      'How has my way of thinking transformed?'
    ]
  },
  11: {
    stage: 'Resurrection',
    house: 10,
    phase: 'return',
    description: 'The hero faces a final test where everything is at stake.',
    astroSignificance: 'The MC and 10th house represent our public identity and ultimate calling.',
    challenge: 'Integrating the journey into one\'s visible life purpose',
    integration: 'Becoming a living example of the transformation',
    questions: [
      'How does my transformation serve my calling?',
      'What final test must I pass?',
      'How do I embody my journey\'s wisdom publicly?'
    ]
  },
  12: {
    stage: 'Return with the Elixir',
    house: 11,
    phase: 'return',
    description: 'The hero returns with something to benefit the ordinary world.',
    astroSignificance: 'The 11th house governs community and how we serve the collective with our gifts.',
    challenge: 'Using personal transformation to serve others',
    integration: 'Becoming a healing presence in the collective',
    questions: [
      'What elixir do I bring back for others?',
      'How does my journey serve humanity?',
      'What community awaits my gifts?'
    ]
  }
};

// Saturn cycle stages of individuation
const SATURN_CYCLES = {
  first_square: {
    age: '7-8',
    phase: 'Awakening Consciousness',
    description: 'First awareness of self as separate from parents',
    challenge: 'Developing individual will while maintaining security',
    integration: 'Building the foundation of autonomous identity'
  },
  first_opposition: {
    age: '14-15',
    phase: 'Identity Rebellion',
    description: 'Conflict between authentic self and societal expectations',
    challenge: 'Differentiating from family and finding peer identity',
    integration: 'Testing personal values against collective norms'
  },
  third_square: {
    age: '21-22',
    phase: 'Adult Emergence',
    description: 'Taking responsibility for one\'s own life direction',
    challenge: 'Making real-world commitments that define identity',
    integration: 'Choosing conscious limitations that enable growth'
  },
  first_return: {
    age: '28-30',
    phase: 'Maturity Initiation',
    description: 'Major life restructuring—the "Saturn Return" crisis',
    challenge: 'Releasing what no longer serves authentic development',
    integration: 'Building structures aligned with true self'
  },
  fourth_square: {
    age: '36-37',
    phase: 'Mid-life Reckoning',
    description: 'Questioning the structures built during first return',
    challenge: 'Balancing duty with unfulfilled dreams',
    integration: 'Integrating shadow material into conscious identity'
  },
  second_opposition: {
    age: '44-45',
    phase: 'Purpose Crisis',
    description: 'Confronting mortality and life meaning at midlife',
    challenge: 'Accepting what will and will not be achieved',
    integration: 'Finding meaning beyond ego accomplishment'
  },
  fifth_square: {
    age: '51-52',
    phase: 'Wisdom Harvest',
    description: 'Distilling life experience into transmittable wisdom',
    challenge: 'Becoming an elder rather than clinging to youth',
    integration: 'Mentoring others with hard-won knowledge'
  },
  second_return: {
    age: '58-60',
    phase: 'Elder Emergence',
    description: 'Second major restructuring—embracing elderhood',
    challenge: 'Finding new purpose in the final chapters of life',
    integration: 'Becoming a wise presence for the collective'
  }
};

// Individuation milestones based on outer planet transits
const OUTER_PLANET_INITIATIONS = {
  uranus_square: {
    age: '21',
    planet: 'Uranus',
    aspect: 'Square',
    theme: 'Liberation',
    description: 'First major break for freedom and authenticity',
    crisis: 'Rebellion against constraining structures',
    gift: 'Discovery of unique individual path'
  },
  neptune_square: {
    age: '41',
    planet: 'Neptune',
    aspect: 'Square',
    theme: 'Disillusionment',
    description: 'Spiritual crisis and questioning of life meaning',
    crisis: 'Loss of certainty, dissolution of ego defenses',
    gift: 'Opening to transcendent dimensions of experience'
  },
  uranus_opposition: {
    age: '42',
    planet: 'Uranus',
    aspect: 'Opposition',
    theme: 'Revolution',
    description: 'Midlife urge for radical authenticity',
    crisis: 'Feeling trapped in one\'s own life choices',
    gift: 'Second chance at unlived life'
  },
  chiron_return: {
    age: '50-51',
    planet: 'Chiron',
    aspect: 'Return',
    theme: 'Wounded Healer',
    description: 'Full integration of core wound as healing gift',
    crisis: 'Confronting deepest wound with full awareness',
    gift: 'Transforming personal suffering into collective service'
  },
  neptune_trine: {
    age: '55',
    planet: 'Neptune',
    aspect: 'Trine',
    theme: 'Spiritual Harvest',
    description: 'Easy access to spiritual wisdom accumulated',
    crisis: 'None—this is a grace period',
    gift: 'Natural spiritual authority and guidance capacity'
  },
  uranus_return: {
    age: '84',
    planet: 'Uranus',
    aspect: 'Return',
    theme: 'Liberation Complete',
    description: 'Full cycle of individuation—freedom achieved',
    crisis: 'Releasing attachment to physical identity',
    gift: 'Embodying the unique self fully before death'
  }
};

// Archetypal fingerprint components
const ARCHETYPE_SIGNATURES = {
  hero: {
    markers: ['Sun', 'Mars', 'Aries', '1st house'],
    description: 'The warrior spirit that confronts challenges',
    healthy: 'Courage to face life\'s battles, protection of the vulnerable',
    shadow: 'Aggression, competitiveness, inability to surrender',
    integration: 'Strength in service of love'
  },
  lover: {
    markers: ['Venus', 'Moon', 'Libra', 'Taurus', '7th house', '2nd house'],
    description: 'The capacity for deep connection and appreciation of beauty',
    healthy: 'Passionate engagement, aesthetic sensitivity, relational harmony',
    shadow: 'Obsession, addiction, loss of self in other',
    integration: 'Love that includes self and other equally'
  },
  sage: {
    markers: ['Mercury', 'Jupiter', 'Virgo', 'Sagittarius', '9th house', '3rd house'],
    description: 'The seeker of truth and wisdom',
    healthy: 'Intellectual clarity, wisdom-sharing, quest for meaning',
    shadow: 'Dogmatism, intellectualization, disconnection from feeling',
    integration: 'Wisdom embodied in daily life'
  },
  magician: {
    markers: ['Pluto', 'Uranus', 'Scorpio', '8th house'],
    description: 'The transformer who works with hidden forces',
    healthy: 'Catalyzing change, psychological insight, healing power',
    shadow: 'Manipulation, power abuse, obsession with control',
    integration: 'Power used for healing, not domination'
  },
  sovereign: {
    markers: ['Sun', 'Saturn', 'Leo', 'Capricorn', '10th house'],
    description: 'The inner king/queen who takes responsibility',
    healthy: 'Leadership, integrity, creating order',
    shadow: 'Tyranny, rigidity, identification with role',
    integration: 'Authority earned through service'
  },
  innocent: {
    markers: ['Moon', 'Neptune', 'Cancer', 'Pisces', '4th house', '12th house'],
    description: 'The child within who trusts life',
    healthy: 'Faith, wonder, emotional authenticity',
    shadow: 'Naivety, denial, victim consciousness',
    integration: 'Wise innocence—trust without gullibility'
  }
};

/**
 * Determine current Hero's Journey stage based on chart transits and age
 */
function determineJourneyStage(chartData, age) {
  const stages = [];

  // Check Saturn cycle position
  const saturnCycle = getSaturnCycleStage(age);
  if (saturnCycle) {
    stages.push({
      type: 'saturn_cycle',
      ...SATURN_CYCLES[saturnCycle],
      relevance: 'high'
    });
  }

  // Check outer planet initiations
  const outerPlanetStage = getOuterPlanetInitiation(age);
  if (outerPlanetStage) {
    stages.push({
      type: 'outer_planet',
      ...OUTER_PLANET_INITIATIONS[outerPlanetStage],
      relevance: 'high'
    });
  }

  // Determine primary journey stage based on most activated house
  const activatedHouse = findMostActivatedHouse(chartData);
  const journeyStage = Object.values(JOURNEY_STAGES).find(s => s.house === activatedHouse);
  if (journeyStage) {
    stages.push({
      type: 'journey_stage',
      ...journeyStage,
      relevance: 'primary'
    });
  }

  return stages;
}

/**
 * Get Saturn cycle stage based on age
 */
function getSaturnCycleStage(age) {
  if (age >= 7 && age <= 8) return 'first_square';
  if (age >= 14 && age <= 15) return 'first_opposition';
  if (age >= 21 && age <= 22) return 'third_square';
  if (age >= 28 && age <= 30) return 'first_return';
  if (age >= 36 && age <= 37) return 'fourth_square';
  if (age >= 44 && age <= 45) return 'second_opposition';
  if (age >= 51 && age <= 52) return 'fifth_square';
  if (age >= 58 && age <= 60) return 'second_return';
  return null;
}

/**
 * Get outer planet initiation based on age
 */
function getOuterPlanetInitiation(age) {
  if (age >= 20 && age <= 22) return 'uranus_square';
  if (age >= 40 && age <= 42) return 'neptune_square';
  if (age >= 41 && age <= 43) return 'uranus_opposition';
  if (age >= 49 && age <= 52) return 'chiron_return';
  if (age >= 54 && age <= 56) return 'neptune_trine';
  if (age >= 83 && age <= 85) return 'uranus_return';
  return null;
}

/**
 * Find most activated house based on planetary placements and aspects
 */
function findMostActivatedHouse(chartData) {
  if (!chartData?.planets) return 1;

  const houseScores = {};

  // Score houses based on planetary presence
  Object.entries(chartData.planets).forEach(([planet, data]) => {
    const house = data.house || 1;
    const weight = planet === 'sun' || planet === 'moon' ? 3 :
                   planet === 'saturn' || planet === 'pluto' ? 2 : 1;
    houseScores[house] = (houseScores[house] || 0) + weight;
  });

  // Find highest scoring house
  let maxHouse = 1;
  let maxScore = 0;
  Object.entries(houseScores).forEach(([house, score]) => {
    if (score > maxScore) {
      maxScore = score;
      maxHouse = parseInt(house);
    }
  });

  return maxHouse;
}

/**
 * Generate archetypal fingerprint based on chart
 */
function generateArchetypalFingerprint(chartData) {
  const fingerprint = {
    primary: null,
    secondary: null,
    shadow: null,
    scores: {}
  };

  if (!chartData?.planets) return fingerprint;

  // Score each archetype based on chart placements
  Object.entries(ARCHETYPE_SIGNATURES).forEach(([archetype, data]) => {
    let score = 0;

    Object.entries(chartData.planets).forEach(([planet, planetData]) => {
      // Check if planet matches archetype marker
      if (data.markers.includes(planet.charAt(0).toUpperCase() + planet.slice(1))) {
        score += 3;
      }
      // Check if sign matches
      if (data.markers.includes(planetData.sign)) {
        score += 2;
      }
      // Check if house matches (format: "1st house", "2nd house", etc.)
      const houseStr = `${planetData.house || 1}${getOrdinalSuffix(planetData.house || 1)} house`;
      if (data.markers.includes(houseStr)) {
        score += 2;
      }
    });

    fingerprint.scores[archetype] = score;
  });

  // Sort and assign primary/secondary/shadow
  const sorted = Object.entries(fingerprint.scores)
    .sort((a, b) => b[1] - a[1]);

  if (sorted.length >= 1 && sorted[0][1] > 0) {
    const [key] = sorted[0];
    fingerprint.primary = {
      name: key,
      ...ARCHETYPE_SIGNATURES[key]
    };
  }

  if (sorted.length >= 2 && sorted[1][1] > 0) {
    const [key] = sorted[1];
    fingerprint.secondary = {
      name: key,
      ...ARCHETYPE_SIGNATURES[key]
    };
  }

  // Shadow is often the least developed archetype
  if (sorted.length >= 1) {
    const [key] = sorted[sorted.length - 1];
    fingerprint.shadow = {
      name: key,
      ...ARCHETYPE_SIGNATURES[key]
    };
  }

  return fingerprint;
}

/**
 * Get ordinal suffix for numbers
 */
function getOrdinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

/**
 * Generate individuation roadmap based on chart and age
 */
function generateIndividuationRoadmap(chartData, age = 35) {
  const roadmap = {
    currentPhase: null,
    completedMilestones: [],
    upcomingInitiations: [],
    lifeThemes: [],
    integrationTasks: []
  };

  // Determine current phase
  if (age < 28) {
    roadmap.currentPhase = {
      name: 'First Saturn Cycle: Building the Ego',
      description: 'The work of establishing a functional identity in the world',
      task: 'Developing a strong enough ego to later transcend it'
    };
  } else if (age < 42) {
    roadmap.currentPhase = {
      name: 'Post-Return Integration: Testing the Structure',
      description: 'Living with the choices made at the Saturn return',
      task: 'Discovering what truly matters versus what was inherited'
    };
  } else if (age < 60) {
    roadmap.currentPhase = {
      name: 'Midlife Individuation: Meeting the Shadow',
      description: 'The crisis of meaning and integration of unlived life',
      task: 'Retrieving gold from the shadow, becoming whole'
    };
  } else {
    roadmap.currentPhase = {
      name: 'Elder Wisdom: Harvest and Transmission',
      description: 'Distilling and sharing accumulated wisdom',
      task: 'Becoming a healing presence for the collective'
    };
  }

  // Completed milestones
  Object.entries(SATURN_CYCLES).forEach(([key, data]) => {
    const cycleAge = parseInt(data.age.split('-')[0]);
    if (age > cycleAge + 2) {
      roadmap.completedMilestones.push({
        type: 'saturn',
        ...data
      });
    }
  });

  Object.entries(OUTER_PLANET_INITIATIONS).forEach(([key, data]) => {
    const initAge = parseInt(data.age.toString().split('-')[0]);
    if (age > initAge + 2) {
      roadmap.completedMilestones.push({
        type: 'outer_planet',
        ...data
      });
    }
  });

  // Upcoming initiations
  Object.entries(SATURN_CYCLES).forEach(([key, data]) => {
    const cycleAge = parseInt(data.age.split('-')[0]);
    if (age < cycleAge && cycleAge - age <= 10) {
      roadmap.upcomingInitiations.push({
        type: 'saturn',
        yearsAway: cycleAge - age,
        ...data
      });
    }
  });

  Object.entries(OUTER_PLANET_INITIATIONS).forEach(([key, data]) => {
    const initAge = parseInt(data.age.toString().split('-')[0]);
    if (age < initAge && initAge - age <= 10) {
      roadmap.upcomingInitiations.push({
        type: 'outer_planet',
        yearsAway: initAge - age,
        ...data
      });
    }
  });

  // Sort upcoming by years away
  roadmap.upcomingInitiations.sort((a, b) => a.yearsAway - b.yearsAway);

  // Life themes based on chart
  const fingerprint = generateArchetypalFingerprint(chartData);
  if (fingerprint.primary) {
    roadmap.lifeThemes.push({
      theme: `Embodying the ${fingerprint.primary.name.charAt(0).toUpperCase() + fingerprint.primary.name.slice(1)}`,
      description: fingerprint.primary.healthy,
      shadow: fingerprint.primary.shadow,
      integration: fingerprint.primary.integration
    });
  }

  // Integration tasks based on current phase
  roadmap.integrationTasks = generateIntegrationTasks(chartData, age, fingerprint);

  return roadmap;
}

/**
 * Generate specific integration tasks
 */
function generateIntegrationTasks(chartData, age, fingerprint) {
  const tasks = [];

  // Age-appropriate tasks
  if (age < 30) {
    tasks.push({
      priority: 'high',
      task: 'Establish authentic identity separate from family expectations',
      method: 'Experiment with different ways of being; notice what feels genuinely "you"'
    });
  } else if (age >= 28 && age <= 32) {
    tasks.push({
      priority: 'urgent',
      task: 'Saturn Return: Rebuild life structures on authentic foundation',
      method: 'Question every commitment—keep only what serves your true self'
    });
  } else if (age >= 40 && age <= 45) {
    tasks.push({
      priority: 'urgent',
      task: 'Midlife: Integrate shadow and retrieve unlived life',
      method: 'What did you sacrifice for success? Those things are calling you now.'
    });
  }

  // Archetype-based tasks
  if (fingerprint?.shadow) {
    tasks.push({
      priority: 'ongoing',
      task: `Develop the underdeveloped ${fingerprint.shadow.name} archetype`,
      method: fingerprint.shadow.healthy
    });
  }

  // Universal tasks
  tasks.push({
    priority: 'foundation',
    task: 'Maintain dialogue with the unconscious',
    method: 'Dreams, active imagination, creative expression, therapy'
  });

  return tasks;
}

/**
 * Main analysis function
 */
export function analyzeHerosJourney(chartData, birthDate) {
  // Calculate age
  const age = birthDate ?
    Math.floor((new Date() - new Date(birthDate)) / (365.25 * 24 * 60 * 60 * 1000)) : 35;

  const journeyStages = determineJourneyStage(chartData, age);
  const fingerprint = generateArchetypalFingerprint(chartData);
  const roadmap = generateIndividuationRoadmap(chartData, age);

  return {
    age,
    currentStages: journeyStages,
    archetypalFingerprint: fingerprint,
    individuationRoadmap: roadmap,
    allJourneyStages: JOURNEY_STAGES,
    saturnCycles: SATURN_CYCLES,
    outerPlanetInitiations: OUTER_PLANET_INITIATIONS,
    summary: generateJourneySummary(journeyStages, fingerprint, roadmap, age)
  };
}

/**
 * Generate human-readable summary
 */
function generateJourneySummary(stages, fingerprint, roadmap, age) {
  let summary = `At age ${age}, you are in the "${roadmap.currentPhase?.name}" phase of individuation. `;

  if (fingerprint.primary) {
    summary += `Your primary archetypal energy is the ${fingerprint.primary.name.charAt(0).toUpperCase() + fingerprint.primary.name.slice(1)},
    with the gift of ${fingerprint.primary.healthy}. `;
  }

  if (fingerprint.shadow) {
    summary += `Your shadow work involves developing the ${fingerprint.shadow.name} archetype—
    the qualities you may have rejected or neglected. `;
  }

  if (roadmap.upcomingInitiations.length > 0) {
    const nextInit = roadmap.upcomingInitiations[0];
    summary += `Your next major initiation is the ${nextInit.planet || 'Saturn'} ${nextInit.aspect || nextInit.phase}
    (${nextInit.theme}) in approximately ${nextInit.yearsAway} years.`;
  }

  return summary;
}

export {
  JOURNEY_STAGES,
  SATURN_CYCLES,
  OUTER_PLANET_INITIATIONS,
  ARCHETYPE_SIGNATURES,
  determineJourneyStage,
  generateArchetypalFingerprint,
  generateIndividuationRoadmap
};
