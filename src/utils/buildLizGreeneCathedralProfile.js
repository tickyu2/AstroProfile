/**
 * Liz Greene Cathedral Profile - Master Orchestrator
 * ===================================================
 *
 * The single entry point for the entire Cathedral OS.
 * Wires together all psychological astrology engines into one unified profile.
 *
 * "The Cathedral is not a building—it is a living map of the psyche,
 * where every stone is a symbol, every chamber a stage of becoming."
 *
 * Engines Orchestrated:
 * 1. Core Psychological Profile (planets, houses, aspects)
 * 2. Aspect Patterns (Grand Trine, T-Square, Yod, etc.)
 * 3. Psychological Narrative (7-section mythic story)
 * 4. Archetypal Fingerprint (Greene × Jung)
 * 5. Individuation Engine (life stage detection)
 * 6. Pilgrim Journey (8-chamber mythic experience)
 * 7. Saturn Journey v2.0 (complete Saturn OS)
 * 8. Fate Threads (Astrology of Fate)
 * 9. Composite Profile (if partner data present)
 * 10. Relationship Destiny (if partner data present)
 */

// ============================================================================
// IMPORTS
// ============================================================================

// Core generators
import { generatePsychologicalProfile } from './psychologicalProfileGenerator.js';
import { detectAspectPatterns } from './aspectPatternDetector.js';
import { generatePsychologicalNarrative } from './psychologicalNarrativeGenerator.js';

// Archetypal systems
import { getArchetypalFingerprint } from './mythicArchetypeSystem.js';
import { getGreeneIndividuationContext } from './greeneIndividuationEngine.js';

// Pilgrim Journey
import { getPilgrimJourneyStage, getFullJourneyContext } from './pilgrimJourneyRouter.js';

// Saturn Journey
import { buildSaturnJourneyProfile } from './buildSaturnJourneyProfile.js';

// Fate Threads
import { buildFateThreads } from './fateThreads.js';
import { assignArchetype as buildFateArchetype } from './fateArchetypes.js';
import { detectCrossroads } from './fateCrossroads.js';
import { computeFateChoiceIndex } from './fateChoiceIndex.js';

// Composite & Relationship
import { buildCompositePsychologicalProfile } from './buildCompositePsychologicalProfile.js';
import { buildRelationshipDestinyReport } from './buildRelationshipDestinyReport.js';
import { buildSynastryFateEngine } from './synastryFateEngine.js';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Safely call a function, returning null on error
 */
function safeCall(fn, args, fallback = null) {
  try {
    const result = fn(args);
    return result || fallback;
  } catch (error) {
    console.warn(`[Cathedral] ${fn.name || 'Function'} failed:`, error.message);
    return fallback;
  }
}

/**
 * Safely call an async function
 */
async function safeCallAsync(fn, args, fallback = null) {
  try {
    const result = await fn(args);
    return result || fallback;
  } catch (error) {
    console.warn(`[Cathedral] ${fn.name || 'Async function'} failed:`, error.message);
    return fallback;
  }
}

/**
 * Extract birth date as ISO string
 */
function getBirthDateISO(birthData) {
  if (!birthData) return null;
  if (birthData.birthDateISO) return birthData.birthDateISO;
  if (birthData.birthDate) {
    if (typeof birthData.birthDate === 'string') return birthData.birthDate;
    if (birthData.birthDate instanceof Date) return birthData.birthDate.toISOString().split('T')[0];
  }
  if (birthData.year && birthData.month && birthData.day) {
    return `${birthData.year}-${String(birthData.month).padStart(2, '0')}-${String(birthData.day).padStart(2, '0')}`;
  }
  return null;
}

/**
 * Extract elemental distribution from western data
 */
function getElementalDistribution(westernData) {
  if (westernData?.statistics?.elementBalance) {
    return westernData.statistics.elementBalance;
  }

  // Calculate from planets
  const elements = { fire: 0, earth: 0, air: 0, water: 0 };
  const elementMap = {
    Aries: 'fire', Leo: 'fire', Sagittarius: 'fire',
    Taurus: 'earth', Virgo: 'earth', Capricorn: 'earth',
    Gemini: 'air', Libra: 'air', Aquarius: 'air',
    Cancer: 'water', Scorpio: 'water', Pisces: 'water'
  };

  const planets = westernData?.planets || [];
  planets.forEach(p => {
    const sign = p.sign || p.zodiacSign;
    if (sign && elementMap[sign]) {
      elements[elementMap[sign]]++;
    }
  });

  return elements;
}

/**
 * Build Trinity block from western data
 */
function buildTrinityBlock(westernData, coreProfile) {
  const sun = westernData?.sun || westernData?.planets?.find(p => p.name === 'Sun') || {};
  const moon = westernData?.moon || westernData?.planets?.find(p => p.name === 'Moon') || {};
  const rising = westernData?.ascendant || westernData?.asc || {};

  return {
    sun: {
      sign: sun.sign || sun.zodiacSign || 'Unknown',
      degree: sun.degree || sun.longitude % 30 || 0,
      house: sun.house || 1,
      ruler: sun.ruler || getPlanetaryRuler(sun.sign || sun.zodiacSign)
    },
    moon: {
      sign: moon.sign || moon.zodiacSign || 'Unknown',
      degree: moon.degree || moon.longitude % 30 || 0,
      house: moon.house || 1,
      ruler: moon.ruler || getPlanetaryRuler(moon.sign || moon.zodiacSign)
    },
    rising: {
      sign: rising.sign || rising.zodiacSign || 'Unknown',
      degree: rising.degree || rising.longitude % 30 || 0,
      house: 1,
      ruler: rising.ruler || getPlanetaryRuler(rising.sign || rising.zodiacSign)
    },
    lifeQuestion: coreProfile?.lifeQuestion || generateLifeQuestion(sun, moon, rising),
    elementalNature: getElementalDistribution(westernData),
    growthPathPreview: coreProfile?.growthPathPreview || 'Your journey unfolds through the integration of light and shadow.'
  };
}

/**
 * Get planetary ruler for a sign
 */
function getPlanetaryRuler(sign) {
  const rulers = {
    Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
    Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Pluto',
    Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Uranus', Pisces: 'Neptune'
  };
  return rulers[sign] || 'Unknown';
}

/**
 * Generate a life question based on trinity
 */
function generateLifeQuestion(sun, moon, rising) {
  const sunSign = sun?.sign || sun?.zodiacSign || 'Unknown';
  const moonSign = moon?.sign || moon?.zodiacSign || 'Unknown';

  const questions = {
    Aries: 'How do I lead authentically without losing others?',
    Taurus: 'How do I find security while remaining open to change?',
    Gemini: 'How do I integrate my many selves into one voice?',
    Cancer: 'How do I nurture others without losing myself?',
    Leo: 'How do I shine my light without overshadowing others?',
    Virgo: 'How do I serve the whole while honoring my own needs?',
    Libra: 'How do I find balance between self and other?',
    Scorpio: 'How do I transform darkness into light?',
    Sagittarius: 'How do I find meaning in the chaos of life?',
    Capricorn: 'How do I build lasting structures without becoming rigid?',
    Aquarius: 'How do I belong while remaining uniquely myself?',
    Pisces: 'How do I navigate the material world while honoring the spiritual?'
  };

  return questions[sunSign] || 'What is my unique path to wholeness?';
}

/**
 * Build Fate Threads block
 */
function buildFateThreadsBlock(westernData, birthDateISO) {
  let threads = [];
  let crossroads = [];
  let fateChoiceIndex = 50;
  let fateArchetype = null;

  try {
    // Build fate threads
    const fateThreadsResult = buildFateThreads(westernData);
    threads = fateThreadsResult?.threads || [];

    // Build fate archetype
    const saturnSign = westernData?.saturn?.sign ||
      westernData?.planets?.find(p => p.name === 'Saturn')?.sign;
    const plutoSign = westernData?.pluto?.sign ||
      westernData?.planets?.find(p => p.name === 'Pluto')?.sign;

    if (saturnSign && plutoSign) {
      fateArchetype = buildFateArchetype(saturnSign, plutoSign);
    }

    // Detect crossroads
    if (birthDateISO) {
      const crossroadsResult = detectCrossroads(birthDateISO);
      crossroads = crossroadsResult?.all || [];
    }

    // Compute fate/choice index
    const indexResult = computeFateChoiceIndex(westernData);
    fateChoiceIndex = indexResult?.fateScore || 50;
  } catch (error) {
    console.warn('[Cathedral] Fate threads build failed:', error.message);
  }

  return {
    threads,
    crossroads,
    fateChoiceIndex,
    fateArchetype
  };
}

/**
 * Build Shadow Work block
 */
function buildShadowWorkBlock(coreProfile, westernData) {
  return {
    defensesBySign: coreProfile?.defensesBySign || {},
    shadowArchetypes: coreProfile?.shadowArchetypes || {},
    mythicArchetypes: coreProfile?.mythicArchetypes || {},
    primaryDefense: coreProfile?.primaryDefense || null,
    integrationPath: coreProfile?.integrationPath || []
  };
}

/**
 * Build Greene × Jung block
 */
function buildGreeneJungBlock(archetypalFingerprint, individuationContext) {
  return {
    archetypalFingerprint: archetypalFingerprint || {
      primary: 'Unknown',
      secondary: 'Unknown',
      shadow: 'Unknown'
    },
    individuationStage: individuationContext?.currentStage || null,
    individuationTimeline: individuationContext?.timeline || [],
    activeHerosJourneyStages: individuationContext?.activeHerosJourneyStages || [],
    upcomingInitiations: individuationContext?.upcomingInitiations || []
  };
}

/**
 * Build Pilgrim Journey block
 */
function buildPilgrimJourneyBlock(pilgrimCurrent, fullJourneyContext) {
  return {
    current: pilgrimCurrent || {
      stageId: 'birth',
      script: null,
      chamber: 'Birth',
      chamberDetails: null
    },
    navigation: {
      previousStage: fullJourneyContext?.navigation?.previous || null,
      nextStage: fullJourneyContext?.navigation?.next || null
    },
    progress: fullJourneyContext?.progress || {
      currentIndex: 0,
      totalStages: 8,
      percentage: 0,
      isComplete: false
    },
    allStages: fullJourneyContext?.allStages || []
  };
}

/**
 * Build Planetary Psychology block
 */
function buildPlanetaryPsychologyBlock(coreProfile, westernData) {
  // If core profile has per-planet data, use it
  if (coreProfile?.planets) {
    return coreProfile.planets;
  }

  if (coreProfile?.planetaryPsychology) {
    return coreProfile.planetaryPsychology;
  }

  // Build from western data
  const planets = westernData?.planets || [];
  const psychology = {};

  planets.forEach(planet => {
    const name = planet.name || planet.planet;
    if (name) {
      psychology[name] = {
        function: getPlanetFunction(name),
        light: planet.light || `${name} in ${planet.sign} expresses through...`,
        shadow: planet.shadow || `Shadow ${name} may manifest as...`,
        retrograde: planet.retrograde || false
      };
    }
  });

  return psychology;
}

/**
 * Get basic planet function
 */
function getPlanetFunction(planet) {
  const functions = {
    Sun: 'Core identity, vitality, purpose',
    Moon: 'Emotions, instincts, unconscious patterns',
    Mercury: 'Communication, thought, learning',
    Venus: 'Love, values, aesthetics, relating',
    Mars: 'Action, desire, assertion, energy',
    Jupiter: 'Expansion, meaning, belief, growth',
    Saturn: 'Structure, limitation, mastery, time',
    Uranus: 'Innovation, awakening, individuation',
    Neptune: 'Transcendence, imagination, dissolution',
    Pluto: 'Transformation, power, death-rebirth'
  };
  return functions[planet] || 'Archetypal energy';
}

// ============================================================================
// MAIN ORCHESTRATOR FUNCTION
// ============================================================================

/**
 * Build the complete Liz Greene Cathedral Profile
 *
 * @param {Object} input - Input configuration
 * @param {Object} input.primary - Primary person's data
 * @param {Object} input.primary.birthData - Birth data (date, time, location)
 * @param {Object} input.primary.westernData - Western astrology calculation result
 * @param {Object} [input.partner] - Optional partner's data for relationship mode
 * @param {Object} [input.partner.birthData] - Partner's birth data
 * @param {Object} [input.partner.westernData] - Partner's western astrology data
 * @param {Object} [options] - Additional options
 * @param {Date|string} [options.relationshipStartDate] - For relationship timeline
 * @param {Object} [options.currentChallenges] - For healing recommendations
 * @returns {Promise<CathedralProfile>} Complete cathedral profile
 */
export async function buildLizGreeneCathedralProfile(input, options = {}) {
  const { primary, partner } = input;
  const { relationshipStartDate, currentChallenges } = options;

  console.log('[Cathedral] Building Liz Greene Cathedral Profile...');
  const startTime = Date.now();

  // Validate input
  if (!primary?.westernData) {
    throw new Error('Primary western data is required');
  }

  const birthDateISO = getBirthDateISO(primary.birthData);
  const mode = partner ? 'relationship' : 'individual';

  // ========== LAYER 1: Core Psychological Profile ==========
  console.log('[Cathedral] Layer 1: Core psychological profile...');

  const coreProfile = safeCall(generatePsychologicalProfile, primary.westernData, {});

  // ========== LAYER 2: Aspect Patterns ==========
  console.log('[Cathedral] Layer 2: Aspect patterns...');

  const aspectPatterns = safeCall(detectAspectPatterns, primary.westernData, {
    patterns: [],
    quincunxes: []
  });

  // ========== LAYER 3: Psychological Narrative ==========
  console.log('[Cathedral] Layer 3: Psychological narrative...');

  const psychologicalNarrative = safeCall(generatePsychologicalNarrative, {
    westernData: primary.westernData,
    coreProfile,
    aspectPatterns
  }, { sections: [] });

  // ========== LAYER 4: Archetypal Fingerprint ==========
  console.log('[Cathedral] Layer 4: Archetypal fingerprint...');

  const archetypalFingerprint = safeCall(getArchetypalFingerprint, primary.westernData, null);

  // ========== LAYER 5: Individuation Context ==========
  console.log('[Cathedral] Layer 5: Individuation context...');

  const greeneIndividuation = safeCall(getGreeneIndividuationContext, {
    birthDate: birthDateISO,
    westernData: primary.westernData
  }, {});

  // ========== LAYER 6: Pilgrim Journey ==========
  console.log('[Cathedral] Layer 6: Pilgrim journey...');

  const pilgrimCurrent = safeCall(getPilgrimJourneyStage, {
    birthDate: birthDateISO,
    westernData: primary.westernData
  }, null);

  const fullJourneyContext = safeCall(getFullJourneyContext, {
    birthDate: birthDateISO,
    westernData: primary.westernData
  }, {});

  // ========== LAYER 7: Saturn Journey ==========
  console.log('[Cathedral] Layer 7: Saturn journey...');

  const saturnJourney = safeCall(buildSaturnJourneyProfile, {
    birthDateISO,
    planets: primary.westernData?.planets,
    aspects: primary.westernData?.aspects
  }, {});

  // ========== LAYER 8: Fate Threads ==========
  console.log('[Cathedral] Layer 8: Fate threads...');

  const fateThreads = buildFateThreadsBlock(primary.westernData, birthDateISO);

  // ========== LAYER 9: Composite & Relationship (if partner present) ==========
  let composite = null;
  let relationshipDestiny = null;
  let synastry = null;

  if (partner?.westernData) {
    console.log('[Cathedral] Layer 9: Relationship modules...');

    // Synastry
    synastry = safeCall(buildSynastryFateEngine, {
      chartA: primary.westernData,
      chartB: partner.westernData
    }, null);

    // Composite
    composite = safeCall(buildCompositePsychologicalProfile, {
      chartA: primary.westernData,
      chartB: partner.westernData
    }, null);

    // Relationship Destiny
    if (relationshipStartDate) {
      relationshipDestiny = safeCall(buildRelationshipDestinyReport, [
        primary.westernData,
        partner.westernData,
        relationshipStartDate,
        { currentChallenges }
      ], null);
    }
  }

  // ========== LAYER 10: Assemble Blocks ==========
  console.log('[Cathedral] Layer 10: Assembling final profile...');

  const trinity = buildTrinityBlock(primary.westernData, coreProfile);
  const shadowWork = buildShadowWorkBlock(coreProfile, primary.westernData);
  const greeneJung = buildGreeneJungBlock(archetypalFingerprint, greeneIndividuation);
  const pilgrimJourney = buildPilgrimJourneyBlock(pilgrimCurrent, fullJourneyContext);
  const planetaryPsychology = buildPlanetaryPsychologyBlock(coreProfile, primary.westernData);

  // ========== FINAL CATHEDRAL PROFILE ==========
  const cathedralProfile = {
    meta: {
      mode,
      generatedAt: new Date().toISOString(),
      generationTimeMs: Date.now() - startTime,
      version: '1.0.0',
      framework: 'Liz Greene Psychological Astrology'
    },

    // Core blocks
    trinity,
    psychologicalNarrative,
    aspectPatterns,
    planetaryPsychology,
    shadowWork,
    greeneJung,
    pilgrimJourney,
    saturnJourney,
    fateThreads,

    // Relationship blocks (null if individual mode)
    composite,
    synastry,
    relationshipDestiny,

    // Quick access for common operations
    quickAccess: {
      sunSign: trinity.sun.sign,
      moonSign: trinity.moon.sign,
      risingSign: trinity.rising.sign,
      saturnSign: saturnJourney?.signProfile?.sign || null,
      saturnHouse: saturnJourney?.houseOverlay?.house || null,
      currentPilgrimStage: pilgrimJourney.current.stageId,
      fateScore: fateThreads.fateChoiceIndex,
      mode
    }
  };

  console.log(`[Cathedral] Profile complete in ${Date.now() - startTime}ms`);

  return cathedralProfile;
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Quick build for individual profile (no relationship)
 */
export async function buildIndividualCathedralProfile(birthData, westernData) {
  return buildLizGreeneCathedralProfile({
    primary: { birthData, westernData }
  });
}

/**
 * Quick build for relationship profile
 */
export async function buildRelationshipCathedralProfile(
  primaryBirthData, primaryWesternData,
  partnerBirthData, partnerWesternData,
  relationshipStartDate = null
) {
  return buildLizGreeneCathedralProfile({
    primary: { birthData: primaryBirthData, westernData: primaryWesternData },
    partner: { birthData: partnerBirthData, westernData: partnerWesternData }
  }, { relationshipStartDate });
}

/**
 * Get just the Saturn Journey from western data
 */
export function getQuickSaturnProfile(westernData, birthDateISO) {
  return safeCall(buildSaturnJourneyProfile, {
    birthDateISO,
    planets: westernData?.planets,
    aspects: westernData?.aspects
  }, {});
}

/**
 * Get just the Trinity block
 */
export function getQuickTrinity(westernData) {
  return buildTrinityBlock(westernData, {});
}

/**
 * Get just the Fate Threads
 */
export function getQuickFateThreads(westernData, birthDateISO) {
  return buildFateThreadsBlock(westernData, birthDateISO);
}

// Default export
export default buildLizGreeneCathedralProfile;
