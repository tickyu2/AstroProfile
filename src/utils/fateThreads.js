/**
 * Mythic Fate Threads Engine
 *
 * Based on Liz Greene's "The Astrology of Fate" — extracting mythic
 * storylines from the chart using planetary archetypes.
 *
 * Each thread represents a different dimension of fate:
 * - Sun: Identity Fate (who you must become)
 * - Moon: Emotional Fate (what you must feel/nurture)
 * - Saturn: Karmic Fate (what you must master)
 * - Pluto: Shadow Fate (what you must transform)
 * - Nodes: Destiny Axis (where you're coming from / going to)
 *
 * GENESIS AstroProfile - January 2026
 */

import {
  validateSign,
  safeGet,
  safeExecute,
  logError,
  getFallbackFateThread,
  DataValidationError,
  MissingDataError
} from './cathedralErrorHandling';

// ═══════════════════════════════════════════════════════════════════════════
// FATE THREAD INTERPRETATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sun Sign Fate Threads - Identity Fate
 * "The hero you must become"
 */
const SUN_FATE_THREADS = {
  Aries: {
    myth: "The Warrior's Quest",
    fateThread: "Your fate is to pioneer new paths, to initiate action where others fear to tread.",
    challenge: "Learning that courage includes vulnerability",
    gift: "The ability to begin anew, to lead by example",
    shadow: "Recklessness mistaken for bravery"
  },
  Taurus: {
    myth: "The Earth Guardian",
    fateThread: "Your fate is to build lasting value, to embody steadfastness in a changing world.",
    challenge: "Releasing attachment while maintaining commitment",
    gift: "The ability to create enduring beauty and stability",
    shadow: "Stubbornness mistaken for strength"
  },
  Gemini: {
    myth: "The Divine Messenger",
    fateThread: "Your fate is to connect, translate, and bridge divided worlds.",
    challenge: "Finding depth without losing versatility",
    gift: "The ability to see multiple truths simultaneously",
    shadow: "Superficiality mistaken for adaptability"
  },
  Cancer: {
    myth: "The Soul's Keeper",
    fateThread: "Your fate is to nurture, protect, and hold emotional space for others.",
    challenge: "Releasing control disguised as care",
    gift: "The ability to create belonging and emotional safety",
    shadow: "Smothering mistaken for love"
  },
  Leo: {
    myth: "The Solar King/Queen",
    fateThread: "Your fate is to shine, to express your unique creative essence without apology.",
    challenge: "Generosity that doesn't require applause",
    gift: "The ability to inspire and uplift through authentic self-expression",
    shadow: "Pride mistaken for confidence"
  },
  Virgo: {
    myth: "The Sacred Craftsman",
    fateThread: "Your fate is to refine, serve, and bring order to chaos through devoted attention.",
    challenge: "Acceptance alongside improvement",
    gift: "The ability to heal through discernment and practical service",
    shadow: "Criticism mistaken for helpfulness"
  },
  Libra: {
    myth: "The Scales Bearer",
    fateThread: "Your fate is to create harmony, to embody justice and beauty in relationship.",
    challenge: "Taking a stand while honoring all sides",
    gift: "The ability to create peace and aesthetic beauty",
    shadow: "Indecision mistaken for fairness"
  },
  Scorpio: {
    myth: "The Phoenix",
    fateThread: "Your fate is to transform, to die and be reborn through the deepest truths.",
    challenge: "Surrendering control in the underworld",
    gift: "The ability to regenerate and see through illusion",
    shadow: "Manipulation mistaken for insight"
  },
  Sagittarius: {
    myth: "The Archer-Philosopher",
    fateThread: "Your fate is to seek meaning, to expand horizons and inspire through vision.",
    challenge: "Wisdom that includes humility",
    gift: "The ability to see the bigger picture and inspire hope",
    shadow: "Preaching mistaken for teaching"
  },
  Capricorn: {
    myth: "The Mountain Climber",
    fateThread: "Your fate is to build, to achieve mastery through patience and responsibility.",
    challenge: "Success that includes heart",
    gift: "The ability to create lasting structures and achievements",
    shadow: "Coldness mistaken for strength"
  },
  Aquarius: {
    myth: "The Water Bearer",
    fateThread: "Your fate is to innovate, to bring the waters of collective wisdom to humanity.",
    challenge: "Individuality that serves community",
    gift: "The ability to envision and create the future",
    shadow: "Detachment mistaken for objectivity"
  },
  Pisces: {
    myth: "The Mystic Dreamer",
    fateThread: "Your fate is to dissolve boundaries, to connect with the transcendent and heal through compassion.",
    challenge: "Groundedness alongside transcendence",
    gift: "The ability to imagine and feel beyond ordinary limits",
    shadow: "Escapism mistaken for spirituality"
  }
};

/**
 * Moon Sign Fate Threads - Emotional Fate
 * "What your soul must feel and nurture"
 */
const MOON_FATE_THREADS = {
  Aries: {
    myth: "The Emotional Warrior",
    fateThread: "Your emotional fate is to feel courage, to act on instinct without apology.",
    need: "Emotional independence and the freedom to feel strongly",
    challenge: "Patience with emotional process",
    nurture: "Through action, movement, and honoring impulses"
  },
  Taurus: {
    myth: "The Emotional Gardener",
    fateThread: "Your emotional fate is to feel security, to nurture through steady presence.",
    need: "Emotional stability and sensory comfort",
    challenge: "Flexibility when circumstances change",
    nurture: "Through touch, nature, and reliable routines"
  },
  Gemini: {
    myth: "The Emotional Storyteller",
    fateThread: "Your emotional fate is to understand feelings through naming them.",
    need: "Emotional variety and intellectual processing of feelings",
    challenge: "Sitting with feelings without analyzing them away",
    nurture: "Through conversation, learning, and mental stimulation"
  },
  Cancer: {
    myth: "The Emotional Mother",
    fateThread: "Your emotional fate is to feel deeply, to nurture and be nurtured.",
    need: "Emotional safety and belonging",
    challenge: "Releasing others while staying connected",
    nurture: "Through home, family, and emotional attunement"
  },
  Leo: {
    myth: "The Emotional Performer",
    fateThread: "Your emotional fate is to feel special, to shine and be seen in your feelings.",
    need: "Emotional recognition and creative expression of feelings",
    challenge: "Feeling worthy without external validation",
    nurture: "Through play, creativity, and genuine appreciation"
  },
  Virgo: {
    myth: "The Emotional Healer",
    fateThread: "Your emotional fate is to serve, to find security through usefulness.",
    need: "Emotional order and the ability to help",
    challenge: "Self-acceptance alongside self-improvement",
    nurture: "Through service, health rituals, and practical care"
  },
  Libra: {
    myth: "The Emotional Diplomat",
    fateThread: "Your emotional fate is to find peace, to feel through relationship.",
    need: "Emotional harmony and partnership",
    challenge: "Honoring your own feelings amidst others'",
    nurture: "Through beauty, partnership, and balanced environments"
  },
  Scorpio: {
    myth: "The Emotional Alchemist",
    fateThread: "Your emotional fate is to transform, to feel the depths others avoid.",
    need: "Emotional intensity and authentic connection",
    challenge: "Trust and vulnerability",
    nurture: "Through deep intimacy, privacy, and emotional truth"
  },
  Sagittarius: {
    myth: "The Emotional Explorer",
    fateThread: "Your emotional fate is to expand, to find meaning in feelings.",
    need: "Emotional freedom and inspiring experiences",
    challenge: "Staying present with difficult emotions",
    nurture: "Through adventure, learning, and philosophical understanding"
  },
  Capricorn: {
    myth: "The Emotional Elder",
    fateThread: "Your emotional fate is to mature, to find security through achievement.",
    need: "Emotional respect and accomplishment",
    challenge: "Allowing vulnerability and softness",
    nurture: "Through structure, goals, and earned recognition"
  },
  Aquarius: {
    myth: "The Emotional Revolutionary",
    fateThread: "Your emotional fate is to individuate, to feel differently than expected.",
    need: "Emotional freedom and space for uniqueness",
    challenge: "Intimacy without losing independence",
    nurture: "Through friendship, causes, and intellectual connection"
  },
  Pisces: {
    myth: "The Emotional Mystic",
    fateThread: "Your emotional fate is to merge, to feel the collective ocean of emotion.",
    need: "Emotional transcendence and spiritual connection",
    challenge: "Boundaries and groundedness",
    nurture: "Through art, spirituality, and compassionate service"
  }
};

/**
 * Saturn Sign Fate Threads - Karmic Fate
 * "The lesson your soul chose to master"
 */
const SATURN_FATE_THREADS = {
  Aries: {
    myth: "The Tested Warrior",
    fateThread: "Your karmic fate is to master authentic assertion through restraint.",
    karmicLesson: "True courage that includes consideration",
    fear: "Being powerless or ineffective",
    mastery: "Patient, strategic action that honors timing"
  },
  Taurus: {
    myth: "The Tested Builder",
    fateThread: "Your karmic fate is to master true security through inner worth.",
    karmicLesson: "Value that doesn't depend on possessions",
    fear: "Instability, poverty, loss of resources",
    mastery: "Unshakeable inner foundation"
  },
  Gemini: {
    myth: "The Tested Messenger",
    fateThread: "Your karmic fate is to master meaningful communication through depth.",
    karmicLesson: "Words that carry weight and truth",
    fear: "Being misunderstood or thought foolish",
    mastery: "Authoritative, clear communication"
  },
  Cancer: {
    myth: "The Tested Nurturer",
    fateThread: "Your karmic fate is to master emotional independence through self-parenting.",
    karmicLesson: "Nurturing that includes healthy boundaries",
    fear: "Abandonment, emotional rejection",
    mastery: "Being your own emotional anchor"
  },
  Leo: {
    myth: "The Tested Sovereign",
    fateThread: "Your karmic fate is to master authentic self-expression through humility.",
    karmicLesson: "Confidence that doesn't require applause",
    fear: "Invisibility, humiliation, being ordinary",
    mastery: "Quiet confidence and generous leadership"
  },
  Virgo: {
    myth: "The Tested Servant",
    fateThread: "Your karmic fate is to master service through self-acceptance.",
    karmicLesson: "Helpfulness without perfectionism",
    fear: "Inadequacy, making mistakes, chaos",
    mastery: "Practical wisdom and self-compassion"
  },
  Libra: {
    myth: "The Tested Partner",
    fateThread: "Your karmic fate is to master relationship through authentic selfhood.",
    karmicLesson: "Partnership that includes individuality",
    fear: "Rejection, conflict, being alone",
    mastery: "Relating authentically without losing yourself"
  },
  Scorpio: {
    myth: "The Tested Transformer",
    fateThread: "Your karmic fate is to master power through surrender.",
    karmicLesson: "Control through letting go",
    fear: "Betrayal, exposure, powerlessness",
    mastery: "Regenerative strength through vulnerability"
  },
  Sagittarius: {
    myth: "The Tested Seeker",
    fateThread: "Your karmic fate is to master freedom through commitment.",
    karmicLesson: "Wisdom that includes limitation",
    fear: "Confinement, meaninglessness, being ordinary",
    mastery: "Grounded vision and practical philosophy"
  },
  Capricorn: {
    myth: "The Tested Achiever",
    fateThread: "Your karmic fate is to master success through authentic purpose.",
    karmicLesson: "Achievement that includes heart",
    fear: "Failure, disgrace, never being enough",
    mastery: "Wise authority and sustainable success"
  },
  Aquarius: {
    myth: "The Tested Visionary",
    fateThread: "Your karmic fate is to master individuality through belonging.",
    karmicLesson: "Uniqueness that serves community",
    fear: "Conformity, being just like everyone else",
    mastery: "Innovative contribution to collective good"
  },
  Pisces: {
    myth: "The Tested Mystic",
    fateThread: "Your karmic fate is to master transcendence through presence.",
    karmicLesson: "Spirituality that includes embodiment",
    fear: "Being trapped in material reality",
    mastery: "Grounded compassion and practical spirituality"
  }
};

/**
 * Pluto Sign Fate Threads - Shadow Fate
 * "The collective shadow you must transform"
 */
const PLUTO_FATE_THREADS = {
  Aries: {
    myth: "The Shadow Warrior",
    fateThread: "Your shadow fate is to transform primal rage into courageous action.",
    collectiveShadow: "Violence, aggression, domination",
    transformation: "Transmuting anger into protective strength",
    generation: "1822-1853"
  },
  Taurus: {
    myth: "The Shadow Possessor",
    fateThread: "Your shadow fate is to transform material obsession into true value.",
    collectiveShadow: "Greed, materialism, exploitation of resources",
    transformation: "Transmuting possession into stewardship",
    generation: "1853-1884"
  },
  Gemini: {
    myth: "The Shadow Trickster",
    fateThread: "Your shadow fate is to transform deceptive communication into truth.",
    collectiveShadow: "Propaganda, misinformation, superficiality",
    transformation: "Transmuting manipulation into authentic exchange",
    generation: "1884-1914"
  },
  Cancer: {
    myth: "The Shadow Mother",
    fateThread: "Your shadow fate is to transform emotional manipulation into nurturing.",
    collectiveShadow: "Tribal warfare, nationalism, emotional manipulation",
    transformation: "Transmuting control into genuine care",
    generation: "1914-1939"
  },
  Leo: {
    myth: "The Shadow King",
    fateThread: "Your shadow fate is to transform narcissism into authentic leadership.",
    collectiveShadow: "Ego inflation, authoritarianism, spotlight addiction",
    transformation: "Transmuting self-obsession into generous creativity",
    generation: "1939-1957"
  },
  Virgo: {
    myth: "The Shadow Critic",
    fateThread: "Your shadow fate is to transform perfectionism into healing service.",
    collectiveShadow: "Health obsession, purity complexes, worker exploitation",
    transformation: "Transmuting criticism into discernment",
    generation: "1957-1972"
  },
  Libra: {
    myth: "The Shadow Judge",
    fateThread: "Your shadow fate is to transform codependency into authentic partnership.",
    collectiveShadow: "Relationship addiction, false harmony, injustice",
    transformation: "Transmuting dependence into interdependence",
    generation: "1972-1984"
  },
  Scorpio: {
    myth: "The Shadow Phoenix",
    fateThread: "Your shadow fate is to transform obsession into regeneration.",
    collectiveShadow: "Power abuse, sexual shadow, death denial",
    transformation: "Transmuting control into surrender",
    generation: "1984-1995"
  },
  Sagittarius: {
    myth: "The Shadow Prophet",
    fateThread: "Your shadow fate is to transform fanaticism into wisdom.",
    collectiveShadow: "Religious extremism, cultural imperialism, truth wars",
    transformation: "Transmuting righteousness into openness",
    generation: "1995-2008"
  },
  Capricorn: {
    myth: "The Shadow Patriarch",
    fateThread: "Your shadow fate is to transform corruption into authentic authority.",
    collectiveShadow: "Institutional decay, corporate abuse, power without accountability",
    transformation: "Transmuting control into responsibility",
    generation: "2008-2024"
  },
  Aquarius: {
    myth: "The Shadow Revolutionary",
    fateThread: "Your shadow fate is to transform detachment into humanitarian connection.",
    collectiveShadow: "Technology addiction, social isolation, dehumanization",
    transformation: "Transmuting alienation into authentic community",
    generation: "2024-2044"
  },
  Pisces: {
    myth: "The Shadow Martyr",
    fateThread: "Your shadow fate is to transform victimhood into compassionate service.",
    collectiveShadow: "Addiction, escapism, dissolution of boundaries",
    transformation: "Transmuting suffering into healing",
    generation: "2044-2068"
  }
};

/**
 * North Node Sign Fate Threads - Destiny Direction
 * "Where your soul is growing toward"
 */
const NORTH_NODE_FATE_THREADS = {
  Aries: {
    myth: "The Emerging Warrior",
    fateThread: "Your destiny is to develop courage, independence, and self-assertion.",
    direction: "From compromise toward authentic action",
    soulGrowth: "Learning to put yourself first without guilt",
    pastLife: "Over-accommodation, losing self in others (Libra South Node)"
  },
  Taurus: {
    myth: "The Emerging Builder",
    fateThread: "Your destiny is to develop security, stability, and self-worth.",
    direction: "From chaos toward peace",
    soulGrowth: "Learning to value simplicity and your own resources",
    pastLife: "Intensity, crisis, depending on others (Scorpio South Node)"
  },
  Gemini: {
    myth: "The Emerging Messenger",
    fateThread: "Your destiny is to develop curiosity, communication, and local connection.",
    direction: "From preaching toward listening",
    soulGrowth: "Learning to ask questions instead of having all the answers",
    pastLife: "Certainty, dogma, distant horizons (Sagittarius South Node)"
  },
  Cancer: {
    myth: "The Emerging Nurturer",
    fateThread: "Your destiny is to develop emotional depth, family, and nurturing.",
    direction: "From achievement toward belonging",
    soulGrowth: "Learning to feel and create emotional home",
    pastLife: "Career focus, emotional suppression (Capricorn South Node)"
  },
  Leo: {
    myth: "The Emerging Creator",
    fateThread: "Your destiny is to develop self-expression, creativity, and leadership.",
    direction: "From group consciousness toward individual expression",
    soulGrowth: "Learning to shine and be seen as special",
    pastLife: "Conformity, hiding in the group (Aquarius South Node)"
  },
  Virgo: {
    myth: "The Emerging Healer",
    fateThread: "Your destiny is to develop discernment, service, and practical skills.",
    direction: "From dreaming toward doing",
    soulGrowth: "Learning to be useful and attend to details",
    pastLife: "Escapism, martyrdom, boundary confusion (Pisces South Node)"
  },
  Libra: {
    myth: "The Emerging Partner",
    fateThread: "Your destiny is to develop relationship, cooperation, and balance.",
    direction: "From self-focus toward partnership",
    soulGrowth: "Learning to consider others and create harmony",
    pastLife: "Independence, selfishness, going it alone (Aries South Node)"
  },
  Scorpio: {
    myth: "The Emerging Transformer",
    fateThread: "Your destiny is to develop depth, intimacy, and transformative power.",
    direction: "From comfort toward growth",
    soulGrowth: "Learning to merge, trust, and transform through crisis",
    pastLife: "Material comfort, possessiveness, resistance to change (Taurus South Node)"
  },
  Sagittarius: {
    myth: "The Emerging Seeker",
    fateThread: "Your destiny is to develop meaning, faith, and expansive vision.",
    direction: "From facts toward wisdom",
    soulGrowth: "Learning to see the bigger picture and trust life",
    pastLife: "Information gathering, mental restlessness (Gemini South Node)"
  },
  Capricorn: {
    myth: "The Emerging Elder",
    fateThread: "Your destiny is to develop mastery, responsibility, and worldly achievement.",
    direction: "From nurturing toward leading",
    soulGrowth: "Learning to build, achieve, and carry authority",
    pastLife: "Emotional dependence, family focus, avoiding the world (Cancer South Node)"
  },
  Aquarius: {
    myth: "The Emerging Visionary",
    fateThread: "Your destiny is to develop individuality, innovation, and humanitarian service.",
    direction: "From personal drama toward collective contribution",
    soulGrowth: "Learning to serve the group and honor your uniqueness",
    pastLife: "Self-focus, need for recognition, drama (Leo South Node)"
  },
  Pisces: {
    myth: "The Emerging Mystic",
    fateThread: "Your destiny is to develop compassion, surrender, and spiritual connection.",
    direction: "From analysis toward acceptance",
    soulGrowth: "Learning to trust, let go, and connect with the transcendent",
    pastLife: "Perfectionism, criticism, worry (Virgo South Node)"
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ENGINE FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

const MODULE_NAME = 'FateThreadsEngine';

/**
 * Extract all planets needed for fate threads from chart
 * @param {Object} chart - Chart object with planets array
 * @returns {Object} Extracted planet positions
 */
function extractFatePlanets(chart) {
  // Handle null/undefined chart gracefully
  if (!chart) {
    logError(
      new MissingDataError('chart data', MODULE_NAME),
      MODULE_NAME,
      { action: 'Returning empty planets' }
    );
    return {
      sun: null,
      moon: null,
      saturn: null,
      pluto: null,
      northNode: null,
      southNode: null
    };
  }

  // Handle missing planets array
  if (!chart.planets) {
    logError(
      new MissingDataError('planets array', MODULE_NAME),
      MODULE_NAME,
      { chartKeys: Object.keys(chart), action: 'Checking alternative data structures' }
    );

    // Try alternative data structures
    const altPlanets = chart.westernData?.planets || chart.western?.planets || {};

    if (Object.keys(altPlanets).length === 0) {
      return {
        sun: null,
        moon: null,
        saturn: null,
        pluto: null,
        northNode: null,
        southNode: null
      };
    }

    // Use the alternative structure
    chart = { planets: altPlanets };
  }

  const findPlanet = (name) => {
    try {
      // Handle array format
      if (Array.isArray(chart.planets)) {
        const found = chart.planets.find(p =>
          (p.name || p.planet || '').toLowerCase() === name.toLowerCase()
        );
        if (found) {
          const sign = found.sign || found.Sign;
          return {
            name,
            sign: sign ? validateSign(sign, MODULE_NAME) : null,
            house: found.house || found.House,
            degree: found.degree || found.longitude
          };
        }
      }
      // Handle object format
      const planetKey = Object.keys(chart.planets).find(k => k.toLowerCase() === name.toLowerCase());
      if (planetKey && chart.planets[planetKey]) {
        const p = chart.planets[planetKey];
        const sign = p.sign || p.Sign;
        return {
          name,
          sign: sign ? validateSign(sign, MODULE_NAME) : null,
          house: p.house || p.House,
          degree: p.degree || p.longitude
        };
      }
    } catch (error) {
      logError(error, MODULE_NAME, { planet: name, action: 'Skipping planet' });
    }
    return null;
  };

  return {
    sun: findPlanet('Sun'),
    moon: findPlanet('Moon'),
    saturn: findPlanet('Saturn'),
    pluto: findPlanet('Pluto'),
    northNode: findPlanet('North Node') || findPlanet('NorthNode') || findPlanet('Rahu'),
    southNode: findPlanet('South Node') || findPlanet('SouthNode') || findPlanet('Ketu')
  };
}

/**
 * Get South Node sign from North Node sign
 * @param {string} northNodeSign - North Node sign
 * @returns {string} South Node sign (opposite)
 */
function getSouthNodeSign(northNodeSign) {
  const opposites = {
    Aries: 'Libra',
    Taurus: 'Scorpio',
    Gemini: 'Sagittarius',
    Cancer: 'Capricorn',
    Leo: 'Aquarius',
    Virgo: 'Pisces',
    Libra: 'Aries',
    Scorpio: 'Taurus',
    Sagittarius: 'Gemini',
    Capricorn: 'Cancer',
    Aquarius: 'Leo',
    Pisces: 'Virgo'
  };
  return opposites[northNodeSign] || null;
}

/**
 * Build complete Fate Threads from chart
 *
 * @param {Object} chart - Chart object with:
 *   - planets: Array of { name, sign, house } or object format
 * @param {Object} options - Options including allowFallback
 * @returns {Object} Complete fate threads profile
 */
export function buildFateThreads(chart, options = {}) {
  try {
    const planets = extractFatePlanets(chart);

    // Check if we have any valid data
    const hasAnyData = Object.values(planets).some(p => p && p.sign);

    if (!hasAnyData) {
      logError(
        new MissingDataError('planetary data', MODULE_NAME),
        MODULE_NAME,
        { action: options.allowFallback ? 'Returning fallback' : 'Returning empty threads' }
      );

      if (options.allowFallback) {
        return {
          sunThread: getFallbackFateThread('Sun'),
          moonThread: getFallbackFateThread('Moon'),
          saturnThread: getFallbackFateThread('Saturn'),
          plutoThread: getFallbackFateThread('Pluto'),
          destinyThread: null,
          threads: [],
          integratedNarrative: {
            opening: 'Your fate threads await discovery.',
            threads: ['Complete chart data needed to reveal your mythic story.'],
            closing: 'The journey begins with understanding your celestial blueprint.'
          },
          summary: {},
          metadata: { hasFallback: true, threadCount: 0 }
        };
      }
    }

  // Build individual threads
  const sunThread = planets.sun?.sign ? {
    planet: 'Sun',
    sign: planets.sun.sign,
    house: planets.sun.house,
    threadType: 'Identity Fate',
    ...SUN_FATE_THREADS[planets.sun.sign]
  } : null;

  const moonThread = planets.moon?.sign ? {
    planet: 'Moon',
    sign: planets.moon.sign,
    house: planets.moon.house,
    threadType: 'Emotional Fate',
    ...MOON_FATE_THREADS[planets.moon.sign]
  } : null;

  const saturnThread = planets.saturn?.sign ? {
    planet: 'Saturn',
    sign: planets.saturn.sign,
    house: planets.saturn.house,
    threadType: 'Karmic Fate',
    ...SATURN_FATE_THREADS[planets.saturn.sign]
  } : null;

  const plutoThread = planets.pluto?.sign ? {
    planet: 'Pluto',
    sign: planets.pluto.sign,
    house: planets.pluto.house,
    threadType: 'Shadow Fate',
    ...PLUTO_FATE_THREADS[planets.pluto.sign]
  } : null;

  // North Node thread (with South Node context)
  const northNodeSign = planets.northNode?.sign;
  const southNodeSign = planets.southNode?.sign || getSouthNodeSign(northNodeSign);

  const destinyThread = northNodeSign ? {
    northNode: {
      planet: 'North Node',
      sign: northNodeSign,
      house: planets.northNode.house,
      threadType: 'Destiny Direction',
      ...NORTH_NODE_FATE_THREADS[northNodeSign]
    },
    southNode: {
      planet: 'South Node',
      sign: southNodeSign,
      house: planets.southNode?.house,
      threadType: 'Karmic Past',
      description: `Past life patterns in ${southNodeSign} - what you're releasing`
    },
    axis: `${northNodeSign}/${southNodeSign} Destiny Axis`
  } : null;

  // Compile all threads
  const threads = [
    sunThread,
    moonThread,
    saturnThread,
    plutoThread
  ].filter(Boolean);

  // Generate integrated narrative
  const integratedNarrative = generateIntegratedNarrative(
    sunThread,
    moonThread,
    saturnThread,
    plutoThread,
    destinyThread
  );

  return {
    // Individual threads
    sunThread,
    moonThread,
    saturnThread,
    plutoThread,
    destinyThread,

    // All threads array
    threads,

    // Integrated narrative
    integratedNarrative,

    // Summary
    summary: {
      identityFate: sunThread?.myth || null,
      emotionalFate: moonThread?.myth || null,
      karmicFate: saturnThread?.myth || null,
      shadowFate: plutoThread?.myth || null,
      destinyDirection: destinyThread?.northNode?.myth || null
    },

    // Metadata
    metadata: {
      hasSunThread: !!sunThread,
      hasMoonThread: !!moonThread,
      hasSaturnThread: !!saturnThread,
      hasPlutoThread: !!plutoThread,
      hasDestinyThread: !!destinyThread,
      threadCount: threads.length
    }
  };

  } catch (error) {
    logError(error, MODULE_NAME, { chart: !!chart, action: 'Building fate threads' });

    // Return a safe fallback structure
    return {
      sunThread: null,
      moonThread: null,
      saturnThread: null,
      plutoThread: null,
      destinyThread: null,
      threads: [],
      integratedNarrative: {
        opening: 'An error occurred while reading your fate threads.',
        threads: [],
        closing: 'Please ensure your chart data is complete.'
      },
      summary: {},
      metadata: {
        error: true,
        errorMessage: error.message,
        threadCount: 0
      }
    };
  }
}

/**
 * Generate integrated narrative from all fate threads
 */
function generateIntegratedNarrative(sun, moon, saturn, pluto, destiny) {
  const parts = [];

  if (sun) {
    parts.push(`Your identity fate as ${sun.myth} calls you to ${sun.fateThread.toLowerCase()}`);
  }

  if (moon) {
    parts.push(`Emotionally, as ${moon.myth}, ${moon.fateThread.toLowerCase()}`);
  }

  if (saturn) {
    parts.push(`Your karmic lesson as ${saturn.myth} is ${saturn.karmicLesson.toLowerCase()}.`);
  }

  if (pluto) {
    parts.push(`The shadow work of ${pluto.myth} involves ${pluto.transformation.toLowerCase()}.`);
  }

  if (destiny?.northNode) {
    parts.push(`Your soul's growth direction as ${destiny.northNode.myth} is ${destiny.northNode.direction.toLowerCase()}.`);
  }

  return {
    opening: "Your fate threads weave together a unique mythic story.",
    threads: parts,
    closing: "These threads are not separate — they're woven together in your life's tapestry."
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get single fate thread by planet
 * @param {string} planet - Planet name
 * @param {string} sign - Sign name
 * @returns {Object} Fate thread
 */
export function getFateThread(planet, sign) {
  const threadMaps = {
    Sun: SUN_FATE_THREADS,
    Moon: MOON_FATE_THREADS,
    Saturn: SATURN_FATE_THREADS,
    Pluto: PLUTO_FATE_THREADS,
    'North Node': NORTH_NODE_FATE_THREADS
  };

  const map = threadMaps[planet];
  if (!map || !map[sign]) return null;

  return {
    planet,
    sign,
    ...map[sign]
  };
}

/**
 * Get all available fate threads (for lookup)
 * @returns {Object} All fate thread data
 */
export function getAllFateThreadData() {
  return {
    sun: SUN_FATE_THREADS,
    moon: MOON_FATE_THREADS,
    saturn: SATURN_FATE_THREADS,
    pluto: PLUTO_FATE_THREADS,
    northNode: NORTH_NODE_FATE_THREADS
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  buildFateThreads,
  getFateThread,
  getAllFateThreadData,
  // Re-export data for direct access
  SUN_FATE_THREADS,
  MOON_FATE_THREADS,
  SATURN_FATE_THREADS,
  PLUTO_FATE_THREADS,
  NORTH_NODE_FATE_THREADS
};
