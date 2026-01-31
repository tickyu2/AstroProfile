/**
 * Saturn Journey Engine
 *
 * The main generator for the Saturn Journey module - the psychological backbone
 * that transforms astrology into adulthood. This engine synthesizes:
 * - Saturn sign placement
 * - Saturn house placement
 * - Saturn aspects to other planets
 * - Current age and life phase
 *
 * Based on Liz Greene's approach to Saturn as the place where
 * the soul must grow up.
 *
 * GENESIS AstroProfile - January 2026
 */

import { SATURN_PHASES, SATURN_ORBIT_YEARS } from './saturnJourneyConstants';
import {
  getSaturnSignProfile,
  getSaturnHouseModifier,
  getSaturnAspectModifier,
  SATURN_SIGN_PROFILES
} from '../data/saturnJourneyInterpretations';
import {
  validateSign,
  validateHouse,
  validateDate,
  safeGet,
  safeExecute,
  logError,
  getFallbackSaturnData,
  wrapResult,
  wrapError,
  DataValidationError,
  MissingDataError
} from './cathedralErrorHandling';
import {
  buildSaturnJourneyNarrative,
  buildLunaIntegration
} from './saturnJourneyNarrative';

// ═══════════════════════════════════════════════════════════════════════════
// NEW SATURN JOURNEY v2.0 MODULES
// ═══════════════════════════════════════════════════════════════════════════

import {
  SATURN_HOUSE_OVERLAYS,
  getSaturnHouseOverlay,
  mergeSaturnHouseWithSign
} from '../data/saturnHouseOverlays';

import {
  SATURN_COMBINED_ARCHETYPES,
  SATURN_MYTHIC_SKIN,
  getSaturnArchetype,
  getSaturnMythicTitle
} from '../data/saturnCombinedArchetypes';

import {
  SATURN_ASPECT_COMPLEXES,
  ASPECT_QUALITY_MODIFIERS,
  getSaturnAspectComplex,
  getAspectQualityModifier,
  buildSaturnAspectAnalysis,
  getAspectComplexesFromNatal
} from '../data/saturnAspectComplexes';

import {
  SATURN_LUNA_TRIGGERS,
  SATURN_INNER_CRITIC_SCRIPTS,
  SATURN_JOURNALING_PROMPTS,
  getLunaTriggers,
  getJournalingPrompts,
  getRandomInnerCriticScript,
  getInnerCriticScriptsForHouse
} from '../data/saturnLunaIntegration';

import {
  SATURN_MYTHIC_TITLES,
  SATURN_CATHEDRAL_PATH,
  getSaturnChamber,
  getSaturnMythicTitle as getChamberMythicTitle,
  getAllSaturnChambers,
  getSaturnChamberByKey
} from '../data/saturnCathedralPath';

import {
  buildSaturnShadowProfile,
  getRandomIntegrationMove,
  getHouseWound,
  getHouseDefense,
  BASE_HOUSE_WOUNDS,
  BASE_HOUSE_DEFENSES,
  BASE_INTEGRATION_MOVES
} from './saturnShadowIntegration';

import {
  generateSaturnReturnReport,
  calculateSaturnReturnWindows,
  checkSaturnReturnStatus,
  RETURN_TITLES,
  HOUSE_THEMES
} from './saturnReturnReport';

import {
  buildLunaSaturnResponses,
  generateSaturnResponse,
  detectSaturnTrigger,
  generateSaturnOpening,
  generateSaturnValidation,
  generateSaturnClosing
} from './saturnLunaDialogue';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate the complete Saturn Journey analysis
 * @param {Object} westernData - Western astrology data with planet positions
 * @param {Object} options - Options including birthDate, aspects, etc.
 * @returns {Object} - Complete Saturn Journey result
 */
export function generateSaturnJourney(westernData, options = {}) {
  const MODULE_NAME = 'SaturnJourneyEngine';

  try {
    // Extract Saturn data with fallback
    let saturnData = extractSaturnData(westernData);

    // Validate and normalize sign
    if (!saturnData.sign) {
      if (options.allowFallback) {
        saturnData = getFallbackSaturnData(saturnData);
        logError(
          new MissingDataError('Saturn sign', MODULE_NAME),
          MODULE_NAME,
          { action: 'Using fallback data' }
        );
      } else {
        throw new MissingDataError('Saturn sign', MODULE_NAME);
      }
    }

    // Normalize the sign
    const normalizedSign = validateSign(saturnData.sign, MODULE_NAME);
    saturnData.sign = normalizedSign;

    // Validate house if present
    if (saturnData.house) {
      saturnData.house = validateHouse(saturnData.house, MODULE_NAME);
    }

    // Get base profile from sign
    const signProfile = getSaturnSignProfile(saturnData.sign);

    if (!signProfile) {
      throw new DataValidationError(
        `No Saturn profile found for sign: ${saturnData.sign}`,
        MODULE_NAME,
        { sign: saturnData.sign }
      );
    }

  // Get house modifier if available
  const houseModifier = saturnData.house ? getSaturnHouseModifier(saturnData.house) : null;

  // Process aspects
  const aspectModifiers = processAspects(options.aspects || []);

  // Apply aspect modifications to wound/defenses
  const modifiedWound = applyAspectModifications(signProfile.wound, aspectModifiers);
  const modifiedDefenses = applyDefenseModifications(signProfile.defenses, aspectModifiers);

  // Calculate current phase
  const age = calculateAge(options.birthDate);
  const currentPhase = detectCurrentPhase(age);

  // ═══════════════════════════════════════════════════════════════════════
  // V2.0 ENHANCED DATA
  // ═══════════════════════════════════════════════════════════════════════

  // Get house overlay (wound, defense, gift, return theme for the life arena)
  const houseOverlay = saturnData.house ? getSaturnHouseOverlay(saturnData.house) : null;

  // Get combined archetype (sign + house → mythic title)
  const combinedArchetype = saturnData.house
    ? getSaturnArchetype(saturnData.sign, saturnData.house)
    : null;

  // Get mythic chamber title
  const mythicTitle = saturnData.house
    ? getSaturnMythicTitle(saturnData.sign, saturnData.house)
    : null;

  // Get cathedral chamber for this house
  const cathedralChamber = saturnData.house ? getSaturnChamber(saturnData.house) : null;

  // Get aspect complexes (deep psychological patterns)
  const aspectComplexes = getAspectComplexesFromNatal(options.aspects || []);

  // Build shadow integration profile
  const aspectKeys = aspectComplexes.map(c => `${c.planet}-Saturn`);
  const shadowProfile = saturnData.house
    ? buildSaturnShadowProfile(saturnData.house, aspectKeys)
    : null;

  // Get Luna triggers and journaling prompts for this house
  const lunaTriggers = saturnData.house ? getLunaTriggers(saturnData.house) : [];
  const journalingPrompts = saturnData.house ? getJournalingPrompts(saturnData.house) : [];
  const innerCriticScripts = saturnData.house ? getInnerCriticScriptsForHouse(saturnData.house) : [];

  // Get Saturn Return status and report (if birth date provided)
  const returnStatus = options.birthDate ? checkSaturnReturnStatus(options.birthDate) : null;
  const returnReport = (options.birthDate && saturnData.house && saturnData.sign)
    ? generateSaturnReturnReport(
        saturnData.house,
        saturnData.sign,
        options.birthDate,
        returnStatus?.returnNumber || 1
      )
    : null;

  // Build Luna dialogue responses
  const lunaDialogueResponses = shadowProfile
    ? buildLunaSaturnResponses({
        house: saturnData.house,
        sign: saturnData.sign,
        shadowProfile,
        aspectComplexes
      })
    : null;

  // ═══════════════════════════════════════════════════════════════════════
  // BUILD COMPLETE RESULT OBJECT
  // ═══════════════════════════════════════════════════════════════════════

  const result = {
    saturn: {
      sign: saturnData.sign,
      house: saturnData.house,
      degree: saturnData.degree,
      isRetrograde: saturnData.isRetrograde || false
    },
    wound: modifiedWound,
    defenses: modifiedDefenses,
    phases: SATURN_PHASES,
    currentPhase: currentPhase ? {
      phase: currentPhase,
      currentAgeYears: age,
      withinWindow: isInWindow(age, currentPhase.ageWindowYears)
    } : null,
    turningPoint: signProfile.turningPoint,
    gift: signProfile.gift,
    houseModifier,
    aspectModifiers,
    lunaGuidance: signProfile.lunaGuidance,
    age,

    // ═══════════════════════════════════════════════════════════════════════
    // V2.0 ENHANCED DATA
    // ═══════════════════════════════════════════════════════════════════════

    // House overlay (life arena specific)
    houseOverlay,

    // Combined archetype (sign + house)
    combinedArchetype,
    mythicTitle,

    // Cathedral chamber (initiation path)
    cathedralChamber,

    // Aspect complexes (deep psychological patterns)
    aspectComplexes,

    // Shadow integration profile
    shadowProfile,

    // Luna integration data
    lunaTriggers,
    journalingPrompts,
    innerCriticScripts,
    lunaDialogueResponses,

    // Saturn Return data
    returnStatus,
    returnReport,

    // Metadata
    metadata: {
      saturnOrbitYears: SATURN_ORBIT_YEARS,
      firstReturn: { age: SATURN_ORBIT_YEARS, window: [28, 31.5] },
      secondReturn: { age: 2 * SATURN_ORBIT_YEARS, window: [58, 61.5] },
      sign: saturnData.sign,
      woundType: signProfile.wound.woundType,
      defenseCategory: signProfile.defenses.category,
      // V2.0 metadata
      hasHouseOverlay: !!houseOverlay,
      hasCathedralChamber: !!cathedralChamber,
      aspectComplexCount: aspectComplexes.length,
      hasShadowProfile: !!shadowProfile
    }
  };

  // Generate narrative
  result.narrative = safeExecute(
    () => buildSaturnJourneyNarrative(result),
    { opening: 'Your Saturn journey is unfolding.', chapters: [], closing: 'Trust the process.' },
    { module: MODULE_NAME }
  );

  // Generate Luna integration
  result.lunaIntegration = safeExecute(
    () => buildLunaIntegration(result),
    { guidance: 'Luna is with you on this journey.' },
    { module: MODULE_NAME }
  );

  return result;

  } catch (error) {
    logError(error, MODULE_NAME, { westernData: !!westernData, options: Object.keys(options) });

    // Re-throw validation errors
    if (error instanceof MissingDataError || error instanceof DataValidationError) {
      throw error;
    }

    // For unexpected errors, wrap and re-throw
    throw new DataValidationError(
      `Saturn Journey generation failed: ${error.message}`,
      MODULE_NAME,
      { originalError: error.message }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXTRACTION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Extract Saturn data from western astrology data
 */
function extractSaturnData(westernData) {
  if (!westernData) {
    return { sign: null, house: null, degree: null, isRetrograde: false };
  }

  // Handle different data structures
  const saturn = westernData.saturn || westernData.Saturn || westernData.planets?.saturn || westernData.planets?.Saturn;

  if (!saturn) {
    return { sign: null, house: null, degree: null, isRetrograde: false };
  }

  return {
    sign: saturn.sign || saturn.Sign,
    house: saturn.house || saturn.House,
    degree: saturn.degree || saturn.Degree || saturn.longitude,
    isRetrograde: saturn.isRetrograde || saturn.retrograde || false
  };
}

/**
 * Process aspects to Saturn
 */
function processAspects(aspects) {
  if (!aspects || !Array.isArray(aspects)) return [];

  const saturnAspects = aspects.filter(aspect => {
    const p1 = (aspect.planet1 || '').toLowerCase();
    const p2 = (aspect.planet2 || '').toLowerCase();
    return p1 === 'saturn' || p2 === 'saturn';
  });

  return saturnAspects.map(aspect => {
    const otherPlanet = aspect.planet1.toLowerCase() === 'saturn'
      ? aspect.planet2
      : aspect.planet1;

    const modifier = getSaturnAspectModifier(capitalize(otherPlanet));
    const aspectType = aspect.type || aspect.aspectType || 'conjunction';
    const aspectQuality = getAspectQuality(aspectType);

    return {
      planet: capitalize(otherPlanet),
      aspectType,
      aspectQuality,
      orb: aspect.orb,
      modifier
    };
  }).filter(a => a.modifier); // Only keep aspects we have data for
}

/**
 * Determine if aspect is challenging or harmonious
 */
function getAspectQuality(aspectType) {
  const type = aspectType.toLowerCase();
  if (['opposition', 'square', 'quincunx'].includes(type)) {
    return 'challenging';
  }
  if (['trine', 'sextile'].includes(type)) {
    return 'harmonious';
  }
  return 'neutral'; // conjunction
}

// ═══════════════════════════════════════════════════════════════════════════
// MODIFICATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Apply aspect modifications to wound
 */
function applyAspectModifications(wound, aspectModifiers) {
  const modifiedWound = { ...wound };

  aspectModifiers.forEach(mod => {
    if (!mod.modifier) return;

    // Moon-Saturn intensifies emotional component
    if (mod.planet === 'Moon' && mod.aspectQuality === 'challenging') {
      modifiedWound.coreFear = `${wound.coreFear} (Moon-Saturn intensifies the emotional weight)`;
      modifiedWound.earlyExperience += ' Emotional nurturing may have felt conditional or unavailable.';
    }

    // Sun-Saturn intensifies identity/father themes
    if (mod.planet === 'Sun' && mod.aspectQuality === 'challenging') {
      modifiedWound.authorityImprint += ' Identity recognition and father themes are emphasized.';
    }

    // Mercury-Saturn adds mental pressure
    if (mod.planet === 'Mercury' && mod.aspectQuality === 'challenging') {
      modifiedWound.innerCriticVoice += ' (Mercury-Saturn: the mind demands constant proof)';
    }

    // Venus-Saturn affects self-worth
    if (mod.planet === 'Venus' && mod.aspectQuality === 'challenging') {
      modifiedWound.coreFear += ' Love and acceptance may feel especially hard to trust.';
    }
  });

  return modifiedWound;
}

/**
 * Apply aspect modifications to defenses
 */
function applyDefenseModifications(defenses, aspectModifiers) {
  const modifiedDefenses = { ...defenses };

  aspectModifiers.forEach(mod => {
    if (!mod.modifier) return;

    // Moon-Saturn adds emotional heaviness
    if (mod.planet === 'Moon' && mod.aspectQuality === 'challenging') {
      modifiedDefenses.cost += ' Emotional heaviness may spike under responsibility.';
    }

    // Mars-Saturn can add suppressed anger
    if (mod.planet === 'Mars' && mod.aspectQuality === 'challenging') {
      modifiedDefenses.secondary += ' Anger may be suppressed or emerge as resentment.';
    }
  });

  return modifiedDefenses;
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE DETECTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Detect current Saturn phase based on age
 */
function detectCurrentPhase(age) {
  if (age === null || age === undefined) return null;

  // First, check if we're in any window
  const matchingPhases = SATURN_PHASES.filter(phase =>
    isInWindow(age, phase.ageWindowYears)
  );

  if (matchingPhases.length > 0) {
    // If multiple matches, prefer the tighter window
    matchingPhases.sort((a, b) =>
      (a.ageWindowYears[1] - a.ageWindowYears[0]) -
      (b.ageWindowYears[1] - b.ageWindowYears[0])
    );
    return matchingPhases[0];
  }

  // If not in any window, find the nearest phase
  let nearestPhase = SATURN_PHASES[0];
  let nearestDistance = Math.abs(age - SATURN_PHASES[0].exactAgeYears);

  SATURN_PHASES.forEach(phase => {
    const distance = Math.abs(age - phase.exactAgeYears);
    if (distance < nearestDistance) {
      nearestPhase = phase;
      nearestDistance = distance;
    }
  });

  return nearestPhase;
}

/**
 * Check if age is within a window
 */
function isInWindow(age, window) {
  return age >= window[0] && age <= window[1];
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate age from birth date
 */
function calculateAge(birthDate) {
  if (!birthDate) return null;

  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  // Return decimal age for more precision
  const dayOfYear = getDayOfYear(today) - getDayOfYear(birth);
  return age + (dayOfYear / 365.25);
}

/**
 * Get day of year
 */
function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Capitalize first letter
 */
function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ═══════════════════════════════════════════════════════════════════════════
// ADDITIONAL EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get Saturn phases for display
 */
export function getSaturnPhases() {
  return SATURN_PHASES;
}

/**
 * Get all Saturn sign profiles
 */
export function getAllSaturnProfiles() {
  return SATURN_SIGN_PROFILES;
}

/**
 * Check if user is in or near Saturn Return
 */
export function isSaturnReturnActive(birthDate) {
  const age = calculateAge(birthDate);
  if (!age) return { isActive: false, which: null };

  // First Saturn Return window
  if (age >= 28 && age <= 31.5) {
    return { isActive: true, which: 'first', age };
  }

  // Second Saturn Return window
  if (age >= 58 && age <= 61.5) {
    return { isActive: true, which: 'second', age };
  }

  // Approaching first return
  if (age >= 26 && age < 28) {
    return { isActive: false, approaching: 'first', age };
  }

  // Approaching second return
  if (age >= 56 && age < 58) {
    return { isActive: false, approaching: 'second', age };
  }

  return { isActive: false, which: null, age };
}

/**
 * Get Saturn cycle position (0-1 through the 29.5 year cycle)
 */
export function getSaturnCyclePosition(birthDate) {
  const age = calculateAge(birthDate);
  if (!age) return null;

  // Position within the current Saturn cycle (0-1)
  const cyclePosition = (age % SATURN_ORBIT_YEARS) / SATURN_ORBIT_YEARS;

  // Which cycle (1 = first, 2 = second, 3 = third)
  const cycleNumber = Math.floor(age / SATURN_ORBIT_YEARS) + 1;

  return {
    position: cyclePosition,
    cycleNumber,
    degreesComplete: cyclePosition * 360,
    yearsIntoCurrentCycle: age % SATURN_ORBIT_YEARS
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// V2.0 CONVENIENCE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get complete Saturn Journey v2.0 data for a house
 * @param {number} house - House number (1-12)
 * @returns {Object} Complete house data including chamber, overlay, wounds, defenses
 */
export function getSaturnHouseComplete(house) {
  return {
    chamber: getSaturnChamber(house),
    overlay: getSaturnHouseOverlay(house),
    mythicTitle: getChamberMythicTitle(house),
    wound: getHouseWound(house),
    defense: getHouseDefense(house),
    triggers: getLunaTriggers(house),
    prompts: getJournalingPrompts(house),
    innerCriticScripts: getInnerCriticScriptsForHouse(house),
    integrationMoves: BASE_INTEGRATION_MOVES[house] || []
  };
}

/**
 * Get Luna dialogue context for Saturn work
 * @param {number} house - House number
 * @param {string} sign - Saturn sign
 * @param {Array} aspects - Natal aspects
 * @returns {Object} Luna dialogue context
 */
export function getLunaSaturnContext(house, sign, aspects = []) {
  const aspectComplexes = getAspectComplexesFromNatal(aspects);
  const aspectKeys = aspectComplexes.map(c => `${c.planet}-Saturn`);
  const shadowProfile = buildSaturnShadowProfile(house, aspectKeys);

  return {
    shadowProfile,
    aspectComplexes,
    triggers: getLunaTriggers(house),
    prompts: getJournalingPrompts(house),
    innerCriticScripts: getInnerCriticScriptsForHouse(house),
    dialogueResponses: buildLunaSaturnResponses({
      house,
      sign,
      shadowProfile,
      aspectComplexes
    })
  };
}

/**
 * Detect Saturn trigger in user message and generate response
 * @param {string} message - User message
 * @param {number} house - Saturn house
 * @param {string} sign - Saturn sign
 * @returns {Object|null} Response object or null
 */
export function processLunaSaturnMessage(message, house, sign) {
  const trigger = detectSaturnTrigger(message, house);
  if (!trigger) return null;

  const shadowProfile = buildSaturnShadowProfile(house, []);
  const context = { house, sign, shadowProfile, aspectComplexes: [] };

  return {
    trigger,
    response: generateSaturnResponse(trigger, context),
    opening: generateSaturnOpening(house),
    validation: generateSaturnValidation(house),
    closing: generateSaturnClosing(context)
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  // Core functions
  generateSaturnJourney,
  getSaturnPhases,
  getAllSaturnProfiles,
  isSaturnReturnActive,
  getSaturnCyclePosition,

  // V2.0 convenience functions
  getSaturnHouseComplete,
  getLunaSaturnContext,
  processLunaSaturnMessage,

  // House overlays
  SATURN_HOUSE_OVERLAYS,
  getSaturnHouseOverlay,
  mergeSaturnHouseWithSign,

  // Combined archetypes
  SATURN_COMBINED_ARCHETYPES,
  SATURN_MYTHIC_SKIN,
  getSaturnArchetype,
  getSaturnMythicTitle,

  // Aspect complexes
  SATURN_ASPECT_COMPLEXES,
  ASPECT_QUALITY_MODIFIERS,
  getSaturnAspectComplex,
  getAspectQualityModifier,
  buildSaturnAspectAnalysis,
  getAspectComplexesFromNatal,

  // Luna integration
  SATURN_LUNA_TRIGGERS,
  SATURN_INNER_CRITIC_SCRIPTS,
  SATURN_JOURNALING_PROMPTS,
  getLunaTriggers,
  getJournalingPrompts,
  getRandomInnerCriticScript,
  getInnerCriticScriptsForHouse,

  // Cathedral path
  SATURN_MYTHIC_TITLES,
  SATURN_CATHEDRAL_PATH,
  getSaturnChamber,
  getAllSaturnChambers,
  getSaturnChamberByKey,

  // Shadow integration
  buildSaturnShadowProfile,
  getRandomIntegrationMove,
  getHouseWound,
  getHouseDefense,
  BASE_HOUSE_WOUNDS,
  BASE_HOUSE_DEFENSES,
  BASE_INTEGRATION_MOVES,

  // Saturn Return
  generateSaturnReturnReport,
  calculateSaturnReturnWindows,
  checkSaturnReturnStatus,
  RETURN_TITLES,
  HOUSE_THEMES,

  // Luna dialogue
  buildLunaSaturnResponses,
  generateSaturnResponse,
  detectSaturnTrigger,
  generateSaturnOpening,
  generateSaturnValidation,
  generateSaturnClosing
};
