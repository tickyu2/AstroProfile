/**
 * BRAIN 1A - Constitution Service
 *
 * Single source of truth for constitutional profile data.
 * Contains raw data + pre-computed interpretations for instant AI context.
 * Used by CCLR, Voice AI, Guest Chat, and all AI systems.
 *
 * GENESIS AstroProfile - January 4, 2026
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Import from single source of truth
import {
  reduceToSingleDigit,
  isMasterNumber,
  calculateLifePathWithFormula,
  calculateExpressionWithFormula,
  calculateSoulUrgeWithFormula,
  calculatePersonalityWithFormula,
  calculateBirthdayNumber,
  calculateMaturityNumber,
  calculatePersonalYearWithFormula,
  calculatePersonalMonthWithFormula
} from '../utils/numerologyCalculations';

import { lifePathInterpretations } from '../data/numerologyInterpretations';

// ============================================
// CORE FIRESTORE OPERATIONS
// ============================================

/**
 * Get the full constitution document for a profile
 */
export async function getConstitution(profileId) {
  try {
    const constitutionRef = doc(db, 'profiles', profileId, 'constitution', 'brain1a');
    const constitutionSnap = await getDoc(constitutionRef);

    if (constitutionSnap.exists()) {
      return constitutionSnap.data();
    }

    return null;
  } catch (error) {
    console.error('Error getting constitution:', error);
    return null;
  }
}

/**
 * Remove undefined values recursively - Firestore doesn't accept undefined
 */
function cleanForFirestore(obj) {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => cleanForFirestore(item)).filter(item => item !== undefined);
  }

  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      cleaned[key] = null; // Convert undefined to null
    } else if (typeof value === 'object' && value !== null) {
      cleaned[key] = cleanForFirestore(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

/**
 * Update/merge constitution data
 */
export async function updateConstitution(profileId, data) {
  try {
    const constitutionRef = doc(db, 'profiles', profileId, 'constitution', 'brain1a');

    // Clean all undefined values before saving to Firestore
    const cleanedData = cleanForFirestore({
      ...data,
      metadata: {
        ...(data.metadata || {}),
        updatedAt: new Date().toISOString(),
        version: '2.0.0',
        brainVersion: '1A'
      }
    });

    await setDoc(constitutionRef, cleanedData, { merge: true });

    console.log('✅ Constitution updated for profile:', profileId);
    return true;
  } catch (error) {
    console.error('Error updating constitution:', error);
    return false;
  }
}

/**
 * Get optimized constitution for AI prompts
 * This is the fast-access format for CCLR, Voice AI, etc.
 */
export async function getConstitutionForAI(profileId) {
  const constitution = await getConstitution(profileId);

  if (!constitution) return null;

  // Return optimized format for AI context
  return {
    // Identity
    name: constitution.identity?.displayName || 'Unknown',
    firstName: constitution.identity?.firstName,
    gender: constitution.identity?.gender,

    // Core Essence (from synthesis)
    archetype: constitution.constitutionalSynthesis?.coreArchetype || 'Seeker',
    essence: constitution.constitutionalSynthesis?.essenceStatement,

    // Quick Summary
    summary: {
      bazi: constitution.bazi?.dayMaster?.description,
      western: constitution.western?.synthesisName,
      numerology: constitution.numerology?.synthesisName,
      mbti: constitution.mbti?.type,
      enneagram: constitution.enneagram?.fullType
    },

    // For AI Communication
    communication: constitution.constitutionalSynthesis?.forAI?.communicationStyle,
    emotionalNeeds: constitution.constitutionalSynthesis?.forAI?.emotionalNeeds,
    conflictResponse: constitution.constitutionalSynthesis?.forAI?.conflictResponse,
    loveLanguage: constitution.constitutionalSynthesis?.forAI?.loveLanguage,
    decisionMaking: constitution.constitutionalSynthesis?.forAI?.decisionMaking,

    // Strengths & Challenges
    strengths: constitution.constitutionalSynthesis?.forAI?.strengthsToReference || [],
    challenges: constitution.constitutionalSynthesis?.forAI?.challengesToBeAwareOf || [],

    // Cross-system patterns
    patterns: constitution.constitutionalSynthesis?.crossSystemPatterns || [],

    // Full data available if needed
    fullConstitution: constitution
  };
}

// ============================================
// DATA EXTRACTORS - Pre-compute from profile
// ============================================

/**
 * Extract and pre-compute identity data
 */
export function extractIdentity(profile) {
  return {
    displayName: profile.displayName || `${profile.firstName} ${profile.lastName}`.trim(),
    firstName: profile.firstName,
    lastName: profile.lastName,
    nickname: profile.nickname || null,
    gender: profile.gender,
    pronouns: profile.pronouns || null
  };
}

/**
 * Extract and pre-compute birth data
 */
export function extractBirth(profile) {
  const age = profile.age || {};

  // Get coordinates from either location.coordinates or location directly
  const lat = profile.location?.coordinates?.lat ?? profile.location?.lat ?? null;
  const lng = profile.location?.coordinates?.lng ?? profile.location?.lng ?? null;

  return {
    date: profile.birthDate || null,
    time: profile.birthTime || null,
    location: profile.location?.fullAddress || profile.birthPlace || null,
    coordinates: (lat !== null && lng !== null) ? { lat, lng } : null,
    timezone: profile.location?.timezone || profile.timezone || null,
    precision: profile.location?.precision || null,
    age: {
      years: age.years ?? null,
      months: age.months ?? null,
      days: age.days ?? null
    }
  };
}

/**
 * Extract and pre-compute BaZi data with interpretations
 */
export function extractBazi(profile) {
  const fourPillars = profile.calculations?.fourPillars;
  const chinese = profile.calculations?.chinese;

  if (!fourPillars) return null;

  // Day Master interpretation
  const dayMaster = fourPillars.dayMaster || fourPillars.day?.stem;
  const dayMasterInfo = getDayMasterInterpretation(dayMaster);

  // Element balance with interpretation - check multiple sources
  const elementBalance = profile.calculations?.elementBalance ||
                         fourPillars.elementBalance ||  // Direct from fourPillars object
                         calculateElementBalance(fourPillars);
  const elementInterpretation = getElementBalanceInterpretation(elementBalance);

  return {
    dayMaster: {
      stem: dayMaster?.char || dayMaster?.chinese || dayMaster,
      stemEnglish: dayMaster?.english || dayMasterInfo.english,
      element: dayMaster?.element || dayMasterInfo.element,
      polarity: dayMaster?.polarity || dayMasterInfo.polarity,
      percentage: 70, // Day pillar is ~70% of chart
      description: dayMasterInfo.description
    },

    chineseZodiac: {
      animal: chinese?.animal,
      element: chinese?.element,
      fullSign: chinese?.element ? `${chinese.element} ${chinese.animal}` : chinese?.animal,
      year: chinese?.year,
      traits: getChineseZodiacTraits(chinese?.animal, chinese?.element)
    },

    fourPillars: {
      year: extractPillarData(fourPillars.year, 'year'),
      month: extractPillarData(fourPillars.month, 'month'),
      day: extractPillarData(fourPillars.day, 'day'),
      hour: extractPillarData(fourPillars.hour, 'hour')
    },

    elementBalance: {
      raw: elementBalance,
      weighted: elementBalance, // Could add weighted calculation later
      interpretation: elementInterpretation
    },

    tenGods: extractTenGods(fourPillars),

    seasonalStrength: {
      season: fourPillars.month?.season || getSeason(profile.birthDate),
      dayMasterStrength: calculateDayMasterStrength(fourPillars),
      interpretation: getSeasonalInterpretation(fourPillars)
    }
  };
}

/**
 * Extract and pre-compute Western astrology data
 */
export function extractWestern(profile) {
  const western = profile.calculations?.western;
  const sovereign = western?.sovereignCalculation;

  if (!western && !sovereign) return null;

  const sun = sovereign?.sun || western;
  const moon = sovereign?.moon || {};
  const rising = sovereign?.rising || {};
  const planets = sovereign?.planets || {};
  const aspects = sovereign?.aspects || [];
  const houses = sovereign?.houses || {};
  const elementBalance = sovereign?.elementBalance || {};

  // ============================================
  // SECTION A: RAW CALCULATIONS (Astro-Seek Format)
  // Copy & paste ready for AI queries
  // ============================================
  const sectionA_RawCalculations = {
    _description: "Raw astronomical calculations from GENESIS Sovereign Engine. Copy & paste to AI for interpretation.",

    // Planet Positions (like astro-seek)
    planetPositions: buildPlanetPositionsText(sun, moon, rising, planets),

    // Retrograde Planets (dedicated section)
    retrogradePlanets: buildRetrogradePlanetsText(planets),

    // House Positions (Placidus system)
    housePositions: buildHousePositionsText(houses),

    // Planet Aspects
    planetAspects: buildAspectsText(aspects),

    // Raw Data Objects (for programmatic access)
    rawData: {
      sun: {
        sign: sun?.sign,
        degree: sun?.degree,
        degreeFormatted: sun?.degreeFormatted || formatDegree(sun?.degree),
        house: sun?.house,
        isRetrograde: false
      },
      moon: {
        sign: moon?.sign,
        degree: moon?.degree,
        degreeFormatted: moon?.degreeFormatted || formatDegree(moon?.degree),
        house: moon?.house,
        phase: moon?.phase,
        illumination: moon?.illumination
      },
      rising: {
        sign: rising?.sign,
        degree: rising?.degree,
        degreeFormatted: rising?.degreeFormatted || formatDegree(rising?.degree)
      },
      planets: Object.fromEntries(
        Object.entries(planets).map(([name, data]) => [
          name,
          {
            sign: data?.sign,
            degree: data?.degree,
            degreeFormatted: data?.degreeFormatted || formatDegree(data?.degree),
            house: data?.house,
            isRetrograde: data?.isRetrograde || false
          }
        ])
      ),
      houses: houses,
      aspects: aspects.map(a => ({
        planet1: a.planets?.[0] || a.planet1,
        planet2: a.planets?.[1] || a.planet2,
        aspect: a.aspect || a.type,
        orb: a.orb,
        quality: a.quality,
        applying: a.applying
      })),
      elementBalance: {
        fire: elementBalance.fire || 0,
        earth: elementBalance.earth || 0,
        air: elementBalance.air || 0,
        water: elementBalance.water || 0,
        dominant: elementBalance.dominant
      }
    }
  };

  // ============================================
  // SECTION B: INTERPRETATIONS (Pre-computed)
  // AI does not need to calculate these
  // ============================================
  const sectionB_Interpretations = {
    _description: "Pre-computed interpretations. AI can reference directly without recalculating.",

    synthesisName: getSynthesisName(sun, moon, rising, elementBalance),

    sun: {
      sign: sun?.sign,
      element: getElement(sun?.sign),
      modality: getModality(sun?.sign),
      rulingPlanet: getRulingPlanet(sun?.sign),
      coreEssence: getSunEssence(sun?.sign),
      lifeMission: getSunMission(sun?.sign),
      strengths: getSunStrengths(sun?.sign),
      challenges: getSunChallenges(sun?.sign),
      shadowSide: getSunShadow(sun?.sign)
    },

    moon: {
      sign: moon?.sign,
      element: getElement(moon?.sign),
      modality: getModality(moon?.sign),
      emotionalNature: getMoonEmotionalNature(moon?.sign),
      innerNeeds: getMoonNeeds(moon?.sign),
      whenStressed: getMoonStress(moon?.sign),
      howToNurture: getMoonNurturing(moon?.sign),
      strengths: getMoonStrengths(moon?.sign),
      challenges: getMoonChallenges(moon?.sign)
    },

    rising: {
      sign: rising?.sign,
      element: getElement(rising?.sign),
      modality: getModality(rising?.sign),
      firstImpression: getRisingFirstImpression(rising?.sign),
      approach: getRisingApproach(rising?.sign),
      lifeLesson: getRisingLesson(rising?.sign)
    },

    planets: extractPlanetsData(planets),
    retrogrades: extractRetrogrades(planets),

    elementalProfile: {
      dominant: elementBalance.dominant,
      meaning: buildElementalMeaning(elementBalance)
    },

    constitutionalSynthesis: {
      coreIdentity: buildCoreIdentity(sun, moon, rising, elementBalance),
      worldview: buildWorldview(sun, elementBalance),
      emotionalPattern: buildEmotionalPattern(moon),
      lifeApproach: buildLifeApproach(sun, rising)
    }
  };

  return {
    sectionA_RawCalculations,
    sectionB_Interpretations
  };
}

// ============================================
// HELPER: Build Planet Positions Text (Astro-Seek format)
// ============================================
function buildPlanetPositionsText(sun, moon, rising, planets) {
  const lines = [];

  // Core trinity
  if (sun?.sign) {
    lines.push(`Sun in ${sun.sign} ${formatDegree(sun.degree)}, in ${ordinal(sun.house || 1)} House`);
  }
  if (moon?.sign) {
    lines.push(`Moon in ${moon.sign} ${formatDegree(moon.degree)}, in ${ordinal(moon.house || 1)} House`);
  }
  if (rising?.sign) {
    lines.push(`Ascendant (Rising) in ${rising.sign} ${formatDegree(rising.degree)}`);
  }

  // Other planets
  const planetOrder = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  for (const name of planetOrder) {
    const p = planets[name];
    if (p?.sign) {
      const retrograde = p.isRetrograde ? ', Retrograde' : '';
      lines.push(`${capitalize(name)} in ${p.sign} ${formatDegree(p.degree)}, in ${ordinal(p.house || 1)} House${retrograde}`);
    }
  }

  return lines.join('\n');
}

// ============================================
// HELPER: Build Retrograde Planets Text
// ============================================
function buildRetrogradePlanetsText(planets) {
  const retrogrades = [];

  const planetOrder = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  for (const name of planetOrder) {
    const p = planets[name];
    if (p?.isRetrograde) {
      retrogrades.push(`${capitalize(name)} Retrograde in ${p.sign} ${formatDegree(p.degree)}, in ${ordinal(p.house || 1)} House`);
    }
  }

  if (retrogrades.length === 0) {
    return "No retrograde planets at birth";
  }

  return `${retrogrades.length} planet(s) retrograde at birth:\n${retrogrades.join('\n')}`;
}

// ============================================
// HELPER: Build House Positions Text
// ============================================
function buildHousePositionsText(houses) {
  if (!houses || Object.keys(houses).length === 0) return "House data not available";

  const lines = [];
  for (let i = 1; i <= 12; i++) {
    const house = houses[i] || houses[`house${i}`];
    if (house) {
      const sign = house.sign || house;
      const degree = house.degree ? ` ${formatDegree(house.degree)}` : '';
      lines.push(`${ordinal(i)} House in ${sign}${degree}`);
    }
  }
  return lines.join('\n');
}

// ============================================
// HELPER: Build Aspects Text
// ============================================
function buildAspectsText(aspects) {
  if (!aspects || aspects.length === 0) return "Aspect data not available";

  return aspects.map(a => {
    const p1 = a.planets?.[0] || a.planet1;
    const p2 = a.planets?.[1] || a.planet2;
    const aspect = a.aspect || a.type;
    const orb = a.orb ? ` (Orb: ${typeof a.orb === 'number' ? a.orb.toFixed(2) : a.orb}°` : '';
    const applying = a.applying ? ', Applying)' : a.applying === false ? ', Separating)' : ')';
    return `${capitalize(p1)} ${aspect} ${capitalize(p2)}${orb}${applying}`;
  }).join('\n');
}

// ============================================
// HELPER: Format degree
// ============================================
function formatDegree(degree) {
  if (!degree && degree !== 0) return '';
  const d = typeof degree === 'number' ? degree : parseFloat(degree);
  if (isNaN(d)) return degree;
  const deg = Math.floor(d);
  const min = Math.round((d - deg) * 60);
  return `${deg}°${min}'`;
}

// ============================================
// HELPER: Ordinal number
// ============================================
function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ============================================
// HELPER: Capitalize
// ============================================
function capitalize(str) {
  if (!str && str !== 0) return '';
  const s = String(str);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Extract and pre-compute numerology data - GOLD STANDARD
 * Section A: Raw calculations with TRANSPARENT FORMULAS
 * Section B: Deep interpretations for AI context
 */
export function extractNumerology(profile) {
  const numerology = profile.calculations?.numerology || profile.numerology;
  const birthDate = profile.birthDate;

  // Get full name for name-based calculations
  const firstName = profile.firstName || profile.identity?.firstName || '';
  const lastName = profile.lastName || profile.identity?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();

  if (!numerology && !birthDate) return null;

  // ============================================
  // GOLD STANDARD: Calculate with transparent formulas
  // ============================================
  const lifePathCalc = calculateLifePathWithFormula(birthDate);
  const expressionCalc = fullName ? calculateExpressionWithFormula(fullName) : { number: null, calculation: null };
  const soulUrgeCalc = fullName ? calculateSoulUrgeWithFormula(fullName) : { number: null, calculation: null };
  const personalityCalc = fullName ? calculatePersonalityWithFormula(fullName) : { number: null, calculation: null };
  const birthdayCalc = calculateBirthdayNumber(birthDate);

  // Use calculated values OR fall back to stored values if no name available
  const lifePath = lifePathCalc.number || getNumberValue(numerology?.lifePath) || getNumberValue(numerology?.lifePathNumber);
  const destiny = expressionCalc.number || getNumberValue(numerology?.destiny) || getNumberValue(numerology?.expression) || getNumberValue(numerology?.destinyNumber);
  const soulUrge = soulUrgeCalc.number || getNumberValue(numerology?.soulUrge) || getNumberValue(numerology?.soulUrgeNumber);
  const personality = personalityCalc.number || getNumberValue(numerology?.personality) || getNumberValue(numerology?.personalityNumber);
  const birthdayReduced = birthdayCalc.number;
  const birthday = birthdayCalc.originalDay;

  // Calculate maturity and personal cycles
  const maturityCalc = calculateMaturityNumber(lifePath, destiny);
  const maturity = maturityCalc.number;
  const personalYearCalc = calculatePersonalYearWithFormula(birthDate);
  const personalMonthCalc = calculatePersonalMonthWithFormula(personalYearCalc.number);

  // ============================================
  // SECTION A: RAW CALCULATIONS (TRANSPARENCY = GOLD)
  // ============================================
  const sectionA_RawCalculations = {
    _description: "Raw numerology calculations with formulas shown. Copy & paste to AI for verification.",

    coreNumbers: buildNumerologyRawText(lifePath, destiny, soulUrge, personality, birthdayReduced, maturity),

    rawData: {
      lifePath: {
        number: lifePath,
        isMasterNumber: lifePathCalc.isMasterNumber || false,
        birthDate: birthDate,
        calculation: lifePathCalc.calculation || { fullFormula: 'Not calculated' }
      },
      expression: {
        number: destiny,
        isMasterNumber: expressionCalc.isMasterNumber || false,
        name: fullName || 'Name not provided',
        calculation: expressionCalc.calculation || { fullFormula: 'Name required for calculation' }
      },
      soulUrge: {
        number: soulUrge,
        isMasterNumber: soulUrgeCalc.isMasterNumber || false,
        vowels: soulUrgeCalc.vowels || 'Name not provided',
        calculation: soulUrgeCalc.calculation || { fullFormula: 'Name required for calculation' }
      },
      personality: {
        number: personality,
        isMasterNumber: personalityCalc.isMasterNumber || false,
        consonants: personalityCalc.consonants || 'Name not provided',
        calculation: personalityCalc.calculation || { fullFormula: 'Name required for calculation' }
      },
      birthdayNumber: {
        originalDay: birthday,
        number: birthdayReduced,
        calculation: birthdayCalc.calculation || 'Not calculated'
      },
      maturityNumber: {
        number: maturity,
        isMasterNumber: maturityCalc.isMasterNumber || false,
        calculation: maturityCalc.calculation || { formula: 'Requires Life Path + Expression' }
      },
      personalYear: {
        year: personalYearCalc.year,
        number: personalYearCalc.number,
        calculation: personalYearCalc.calculation || 'Not calculated'
      },
      personalMonth: {
        month: personalMonthCalc.month,
        number: personalMonthCalc.number,
        calculation: personalMonthCalc.calculation || 'Not calculated'
      }
    }
  };

  // ============================================
  // SECTION B: INTERPRETATIONS (Pre-computed)
  // ============================================
  const sectionB_Interpretations = {
    _description: "Pre-computed numerology interpretations. AI can reference directly.",

    synthesisName: getNumerologySynthesisName(lifePath),
    corePath: `Life Path ${lifePath} (${getNumerologySynthesisName(lifePath)}) + Destiny ${destiny} + Soul Urge ${soulUrge} + Personality ${personality}`,

    lifePath: {
      number: lifePath,
      title: getNumerologySynthesisName(lifePath),
      isMasterNumber: [11, 22, 33].includes(lifePath),
      coreEssence: getLifePathEssenceGold(lifePath),
      lifeMission: getLifePathMissionGold(lifePath),
      strengths: getLifePathStrengths(lifePath),
      challenges: getLifePathChallenges(lifePath),
      careerPaths: getLifePathCareers(lifePath),
      relationshipStyle: getLifePathRelationshipGold(lifePath),
      spiritualLesson: getLifePathSpiritualLesson(lifePath),
      shadowSide: getLifePathShadow(lifePath)
    },

    destiny: {
      number: destiny,
      title: getNumerologySynthesisName(destiny),
      purpose: getDestinyPurposeGold(destiny),
      calling: getDestinyCallingGold(destiny),
      howToFulfill: getDestinyFulfillmentGold(destiny),
      lifeWork: getDestinyLifeWork(destiny)
    },

    soulUrge: {
      number: soulUrge,
      title: getSoulUrgeTitle(soulUrge),
      deepDesires: getSoulUrgeDesiresGold(soulUrge),
      whatFeedsYourSpirit: getSoulUrgeSpiritGold(soulUrge),
      hiddenMotivations: getSoulUrgeHiddenMotivations(soulUrge),
      emotionalNeeds: getSoulUrgeEmotionalNeeds(soulUrge)
    },

    personality: {
      number: personality,
      title: getNumerologySynthesisName(personality),
      outerProjection: getPersonalityProjectionGold(personality),
      firstImpression: getPersonalityFirstImpressionGold(personality),
      socialMask: getPersonalitySocialMask(personality),
      howOthersPerceive: getPersonalityPerception(personality)
    },

    birthday: {
      number: birthdayReduced,
      originalDay: birthday,
      talent: getBirthdayTalent(birthdayReduced),
      gift: getBirthdayGift(birthday)
    },

    maturity: {
      number: maturity,
      meaning: getMaturityMeaning(maturity),
      ageOfActivation: 'Typically activates around age 40-50',
      integration: maturity ? `Your mature self integrates ${getNumerologySynthesisName(lifePath)} journey with ${getNumerologySynthesisName(destiny)} purpose, becoming ${getNumerologySynthesisName(maturity)}.` : null
    },

    interactions: {
      pathToPurpose: getPathToPurposeGold(lifePath, destiny),
      innerOuter: getInnerOuterInteractionGold(soulUrge, personality),
      coreConflicts: getCoreConflicts(lifePath, soulUrge, personality),
      harmonies: getCoreHarmonies(lifePath, destiny, soulUrge)
    }
  };

  return {
    sectionA_RawCalculations,
    sectionB_Interpretations
  };
}

/**
 * Extract MBTI data with interpretations
 */
export function extractMBTI(profile) {
  const mbtiType = profile.mbti;

  if (!mbtiType) return null;

  return {
    type: mbtiType,
    fullName: getMBTIFullName(mbtiType),
    cognitiveFunctions: getCognitiveFunctions(mbtiType),
    traits: getMBTITraits(mbtiType),
    strengths: getMBTIStrengths(mbtiType),
    challenges: getMBTIChallenges(mbtiType),
    communication: getMBTICommunication(mbtiType),
    relationships: getMBTIRelationships(mbtiType),
    careerFit: getMBTICareers(mbtiType),
    stressResponse: getMBTIStressResponse(mbtiType)
  };
}

/**
 * Extract Enneagram data with interpretations
 */
export function extractEnneagram(profile) {
  const enneagram = profile.enneagram;

  if (!enneagram) return null;

  const dominantType = enneagram.dominantType || enneagram.type;
  const wing = enneagram.wing;

  return {
    dominantType,
    wing,
    fullType: wing ? `${dominantType}w${wing}` : `${dominantType}`,
    name: getEnneagramName(dominantType, wing),
    subtitle: getEnneagramSubtitle(dominantType, wing),
    tritype: enneagram.tritype || null,
    scores: enneagram.scores || null,
    coreMotivation: getEnneagramMotivation(dominantType),
    coreFear: getEnneagramFear(dominantType),
    coreDesire: getEnneagramDesire(dominantType),
    traits: getEnneagramTraits(dominantType),
    wingInfluence: wing ? getWingInfluence(dominantType, wing) : null,
    growthPath: getEnneagramGrowthPath(dominantType),
    relationships: getEnneagramRelationships(dominantType),
    communication: getEnneagramCommunication(dominantType),
    stressResponse: getEnneagramStressResponse(dominantType)
  };
}

// ============================================
// CONSTITUTIONAL SYNTHESIS
// ============================================

/**
 * Generate cross-system synthesis for AI use
 */
export function generateConstitutionalSynthesis(constitution) {
  const { bazi, western, numerology, mbti, enneagram } = constitution;

  // Core archetype from dominant patterns
  const coreArchetype = deriveCoreArchetype(constitution);

  // Essence statement combining all systems
  const essenceStatement = buildEssenceStatement(constitution);

  // Cross-system patterns
  const crossSystemPatterns = identifyCrossSystemPatterns(constitution);

  // AI-optimized context
  const forAI = {
    communicationStyle: deriveCommunicationStyle(constitution),
    emotionalNeeds: deriveEmotionalNeeds(constitution),
    decisionMaking: deriveDecisionMaking(constitution),
    conflictResponse: deriveConflictResponse(constitution),
    loveLanguage: deriveLoveLanguage(constitution),
    growthAreas: deriveGrowthAreas(constitution),
    strengthsToReference: collectStrengths(constitution),
    challengesToBeAwareOf: collectChallenges(constitution)
  };

  return {
    version: '2.0.0',
    generatedAt: new Date().toISOString(),
    coreArchetype,
    essenceStatement,
    crossSystemPatterns,
    forAI
  };
}

// ============================================
// MAIN POPULATION FUNCTION
// ============================================

/**
 * Populate the full Brain 1A constitution from a profile
 * Call this when profile is created or updated
 */
export async function populateConstitution(profile) {
  if (!profile?.id) {
    console.error('Profile ID required to populate constitution');
    return false;
  }

  console.log('🧠 Populating Brain 1A for profile:', profile.displayName || profile.id);

  // Extract all systems
  const constitution = {
    identity: extractIdentity(profile),
    birth: extractBirth(profile),
    bazi: extractBazi(profile),
    western: extractWestern(profile),
    numerology: extractNumerology(profile),
    mbti: extractMBTI(profile),
    enneagram: extractEnneagram(profile),
    big5: { provided: false }, // Future
    lifePreferences: { questionnaire: { completed: false } }, // Future
    metadata: {
      profileId: profile.id,
      version: '2.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      brainVersion: '1A',
      systemsIncluded: getIncludedSystems(profile),
      completeness: calculateCompleteness(profile)
    }
  };

  // Generate synthesis from all available data
  constitution.constitutionalSynthesis = generateConstitutionalSynthesis(constitution);

  // Save to Firestore
  const success = await updateConstitution(profile.id, constitution);

  if (success) {
    console.log('✅ Brain 1A populated successfully');
  }

  return success;
}

// ============================================
// HELPER FUNCTIONS - Interpretations
// ============================================

function getNumberValue(val) {
  if (typeof val === 'object' && val !== null) return val.number;
  if (typeof val === 'number') return val;
  return null;
}

function getSeason(birthDate) {
  if (!birthDate) return 'Unknown';
  const month = new Date(birthDate).getMonth() + 1;
  if (month >= 3 && month <= 5) return 'Spring';
  if (month >= 6 && month <= 8) return 'Summer';
  if (month >= 9 && month <= 11) return 'Fall';
  return 'Winter';
}

function getElement(sign) {
  const elements = {
    'Aries': 'Fire', 'Leo': 'Fire', 'Sagittarius': 'Fire',
    'Taurus': 'Earth', 'Virgo': 'Earth', 'Capricorn': 'Earth',
    'Gemini': 'Air', 'Libra': 'Air', 'Aquarius': 'Air',
    'Cancer': 'Water', 'Scorpio': 'Water', 'Pisces': 'Water'
  };
  return elements[sign] || 'Unknown';
}

function getModality(sign) {
  const modalities = {
    'Aries': 'Cardinal', 'Cancer': 'Cardinal', 'Libra': 'Cardinal', 'Capricorn': 'Cardinal',
    'Taurus': 'Fixed', 'Leo': 'Fixed', 'Scorpio': 'Fixed', 'Aquarius': 'Fixed',
    'Gemini': 'Mutable', 'Virgo': 'Mutable', 'Sagittarius': 'Mutable', 'Pisces': 'Mutable'
  };
  return modalities[sign] || 'Unknown';
}

function getRulingPlanet(sign) {
  const rulers = {
    'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
    'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Pluto',
    'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Uranus', 'Pisces': 'Neptune'
  };
  return rulers[sign] || 'Unknown';
}

// Day Master interpretations
function getDayMasterInterpretation(dayMaster) {
  const stem = dayMaster?.char || dayMaster?.chinese || dayMaster;
  const interpretations = {
    '甲': { english: 'Yang Wood', element: 'Wood', polarity: 'Yang', description: 'Leader, pioneer, growth-oriented. Like a tall tree reaching for the sky.' },
    '乙': { english: 'Yin Wood', element: 'Wood', polarity: 'Yin', description: 'Flexible, adaptable, nurturing. Like grass that bends with the wind.' },
    '丙': { english: 'Yang Fire', element: 'Fire', polarity: 'Yang', description: 'Passionate, charismatic, illuminating. Like the sun giving light to all.' },
    '丁': { english: 'Yin Fire', element: 'Fire', polarity: 'Yin', description: 'Warm, intimate, perceptive. Like a candle flame providing gentle light.' },
    '戊': { english: 'Yang Earth', element: 'Earth', polarity: 'Yang', description: 'Stable, reliable, protective. Like a mountain standing firm through time.' },
    '己': { english: 'Yin Earth', element: 'Earth', polarity: 'Yin', description: 'Nurturing, productive, supportive. Like fertile soil growing abundance.' },
    '庚': { english: 'Yang Metal', element: 'Metal', polarity: 'Yang', description: 'Determined, righteous, decisive. Like a sword cutting through obstacles.' },
    '辛': { english: 'Yin Metal', element: 'Metal', polarity: 'Yin', description: 'Refined, elegant, precise. Like a precious gem reflecting light.' },
    '壬': { english: 'Yang Water', element: 'Water', polarity: 'Yang', description: 'Intelligent, flowing, adaptable. Like a river finding its path to the sea.' },
    '癸': { english: 'Yin Water', element: 'Water', polarity: 'Yin', description: 'Intuitive, nurturing, deep. Like morning dew nourishing all life.' }
  };
  return interpretations[stem] || { english: 'Unknown', element: 'Unknown', polarity: 'Unknown', description: 'Day Master not recognized' };
}

function getChineseZodiacTraits(animal, element) {
  const animalTraits = {
    'Rat': 'Quick-witted, resourceful, versatile',
    'Ox': 'Diligent, dependable, strong',
    'Tiger': 'Brave, competitive, confident',
    'Rabbit': 'Gentle, elegant, responsible',
    'Dragon': 'Confident, ambitious, charismatic',
    'Snake': 'Enigmatic, intelligent, wise',
    'Horse': 'Energetic, independent, impatient',
    'Goat': 'Calm, gentle, sympathetic',
    'Monkey': 'Sharp, curious, mischievous',
    'Rooster': 'Observant, hardworking, courageous',
    'Dog': 'Loyal, honest, prudent',
    'Pig': 'Compassionate, generous, diligent'
  };

  const elementModifier = {
    'Wood': 'growth-oriented and flexible',
    'Fire': 'passionate and dynamic',
    'Earth': 'grounded and stable',
    'Metal': 'determined and precise',
    'Water': 'adaptive and intuitive'
  };

  const base = animalTraits[animal] || 'Unknown traits';
  const modifier = elementModifier[element] || '';

  return modifier ? `${base}, ${modifier}` : base;
}

function extractPillarData(pillar, pillarType) {
  if (!pillar) return null;

  const interpretations = {
    year: 'Foundation pillar - ancestral influence and early life',
    month: 'Growth pillar - career and social standing',
    day: 'CORE IDENTITY - self and spouse',
    hour: 'Expression pillar - children and later life'
  };

  return {
    stem: pillar.stem?.char || pillar.stem?.chinese || pillar.stem,
    stemEnglish: pillar.stem?.english || getDayMasterInterpretation(pillar.stem).english,
    branch: pillar.branch?.char || pillar.branch?.chinese || pillar.branch,
    branchEnglish: pillar.branch?.english || pillar.branch,
    element: pillar.element,
    hiddenStems: pillar.hiddenStems || [],
    interpretation: interpretations[pillarType]
  };
}

function extractTenGods(fourPillars) {
  // Simplified Ten Gods extraction - would need full BaZi calculator for accuracy
  const dayMaster = fourPillars.dayMaster || fourPillars.day?.stem;
  return {
    selfElement: getDayMasterInterpretation(dayMaster).english,
    dominantPattern: 'Based on Day Master analysis',
    lifePath: 'Path determined by element interactions'
  };
}

/**
 * Calculate element balance from Four Pillars data
 * Parses ganZhi (干支) strings to extract elements from Heavenly Stems and Earthly Branches
 */
function calculateElementBalance(fourPillars) {
  if (!fourPillars) {
    return { Wood: 20, Fire: 20, Earth: 20, Metal: 20, Water: 20 };
  }

  // Heavenly Stems (天干) to element mapping
  const STEM_ELEMENTS = {
    '甲': 'Wood', '乙': 'Wood', 'Jia': 'Wood', 'Yi': 'Wood',
    '丙': 'Fire', '丁': 'Fire', 'Bing': 'Fire', 'Ding': 'Fire',
    '戊': 'Earth', '己': 'Earth', 'Wu': 'Earth', 'Ji': 'Earth',
    '庚': 'Metal', '辛': 'Metal', 'Geng': 'Metal', 'Xin': 'Metal',
    '壬': 'Water', '癸': 'Water', 'Ren': 'Water', 'Gui': 'Water'
  };

  // Earthly Branches (地支) to element mapping
  const BRANCH_ELEMENTS = {
    '寅': 'Wood', '卯': 'Wood', 'Yin': 'Wood', 'Mao': 'Wood',
    '巳': 'Fire', '午': 'Fire', 'Si': 'Fire', 'Wu': 'Fire',
    '辰': 'Earth', '戌': 'Earth', '丑': 'Earth', '未': 'Earth',
    'Chen': 'Earth', 'Xu': 'Earth', 'Chou': 'Earth', 'Wei': 'Earth',
    '申': 'Metal', '酉': 'Metal', 'Shen': 'Metal', 'You': 'Metal',
    '亥': 'Water', '子': 'Water', 'Hai': 'Water', 'Zi': 'Water'
  };

  const elementCounts = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };

  // Try different pillar key formats
  const pillarKeys = [
    ['year', 'month', 'day', 'hour'],
    ['yearPillar', 'monthPillar', 'dayPillar', 'hourPillar']
  ];

  let foundPillars = false;

  for (const keys of pillarKeys) {
    for (const key of keys) {
      const pillar = fourPillars[key];
      if (!pillar) continue;
      foundPillars = true;

      // Extract ganZhi string
      const ganZhi = pillar.ganZhi || pillar.ganzhi || pillar.ganzhi_cn ||
                     (typeof pillar === 'string' ? pillar : null);

      if (ganZhi && typeof ganZhi === 'string') {
        // Parse each character
        for (const char of ganZhi) {
          if (STEM_ELEMENTS[char]) {
            elementCounts[STEM_ELEMENTS[char]] += 1;
          } else if (BRANCH_ELEMENTS[char]) {
            elementCounts[BRANCH_ELEMENTS[char]] += 1;
          }
        }
      }

      // Also check explicit stem/branch objects
      if (pillar.stem) {
        const stemElement = pillar.stem.element || STEM_ELEMENTS[pillar.stem.chinese] ||
                           STEM_ELEMENTS[pillar.stem.pinyin] || STEM_ELEMENTS[pillar.stem];
        if (stemElement && elementCounts[stemElement] !== undefined) {
          elementCounts[stemElement] += 1;
        }
      }

      if (pillar.branch) {
        const branchElement = pillar.branch.element || BRANCH_ELEMENTS[pillar.branch.chinese] ||
                             BRANCH_ELEMENTS[pillar.branch.pinyin] || BRANCH_ELEMENTS[pillar.branch];
        if (branchElement && elementCounts[branchElement] !== undefined) {
          elementCounts[branchElement] += 1;
        }
      }
    }
    if (foundPillars) break;
  }

  // If no pillars found, return equal distribution
  const total = Object.values(elementCounts).reduce((a, b) => a + b, 0);
  if (total === 0) {
    return { Wood: 20, Fire: 20, Earth: 20, Metal: 20, Water: 20 };
  }

  // Convert to percentages
  const result = {};
  for (const [element, count] of Object.entries(elementCounts)) {
    result[element] = Math.round((count / total) * 100);
  }

  // Ensure total adds up to 100
  const resultTotal = Object.values(result).reduce((a, b) => a + b, 0);
  if (resultTotal !== 100) {
    // Adjust the largest element to make total 100
    const maxElement = Object.entries(result).sort((a, b) => b[1] - a[1])[0][0];
    result[maxElement] += (100 - resultTotal);
  }

  return result;
}

function getElementBalanceInterpretation(balance) {
  const entries = Object.entries(balance).sort((a, b) => b[1] - a[1]);
  const dominant = entries[0];
  const lacking = entries[entries.length - 1];

  return {
    dominant: `${dominant[0]} (${dominant[1]}%)`,
    lacking: `${lacking[0]} (${lacking[1]}%)`,
    meaning: `Strong ${dominant[0]} constitution creates ${dominant[0] === 'Metal' ? 'determination and precision' : dominant[0] === 'Water' ? 'adaptability and intuition' : dominant[0] === 'Wood' ? 'growth and flexibility' : dominant[0] === 'Fire' ? 'passion and charisma' : 'stability and grounding'}.`,
    constitutionalNeeds: `Needs ${lacking[0]} for balance`,
    strengths: getElementStrengths(dominant[0]),
    challenges: getElementChallenges(dominant[0])
  };
}

function getElementStrengths(element) {
  const strengths = {
    Wood: 'Growth, flexibility, vision',
    Fire: 'Passion, charisma, inspiration',
    Earth: 'Stability, reliability, nurturing',
    Metal: 'Determination, precision, righteousness',
    Water: 'Adaptability, wisdom, intuition'
  };
  return strengths[element] || 'Unknown';
}

function getElementChallenges(element) {
  const challenges = {
    Wood: 'Impatience, anger when blocked',
    Fire: 'Burnout, impulsiveness',
    Earth: 'Stubbornness, worry',
    Metal: 'Rigidity, grief',
    Water: 'Fear, indecisiveness'
  };
  return challenges[element] || 'Unknown';
}

function calculateDayMasterStrength(fourPillars) {
  return 'Moderate'; // Would need full seasonal analysis
}

function getSeasonalInterpretation(fourPillars) {
  return 'Day Master strength varies by season of birth';
}

// Western Astrology helpers
function getSynthesisName(sun, moon, rising, elementBalance) {
  const element = elementBalance?.dominant || getElement(sun?.sign);
  const names = {
    'Earth': 'The Grounded Builder',
    'Fire': 'The Passionate Pioneer',
    'Water': 'The Intuitive Healer',
    'Air': 'The Intellectual Visionary'
  };
  return names[element] || 'The Cosmic Soul';
}

function getLifePathFromSun(sun) {
  if (!sun?.sign) return 'To discover and express your authentic self';
  const paths = {
    'Aries': 'To lead with courage and initiative',
    'Taurus': 'To build lasting value and beauty',
    'Gemini': 'To communicate and connect ideas',
    'Cancer': 'To nurture and create emotional security',
    'Leo': 'To shine and inspire others',
    'Virgo': 'To serve and perfect through attention to detail',
    'Libra': 'To create harmony and balance',
    'Scorpio': 'To transform and reveal hidden truths',
    'Sagittarius': 'To seek wisdom and expand horizons',
    'Capricorn': 'To build structures that endure',
    'Aquarius': 'To innovate and serve humanity',
    'Pisces': 'To heal and transcend boundaries'
  };
  return paths[sun.sign] || 'To discover your unique path';
}

function getSunEssence(sign) {
  const essences = {
    'Aries': 'Pioneer spirit, courage, initiative. First to act, leads by example.',
    'Taurus': 'Patient builder, values beauty and stability. Creates lasting worth.',
    'Gemini': 'Quick mind, communication, curiosity. Connects ideas and people.',
    'Cancer': 'Nurturing soul, emotional depth, protective. Creates safe spaces.',
    'Leo': 'Radiant leader, generous heart, creative. Inspires through presence.',
    'Virgo': 'Analytical mind, service-oriented, precise. Improves everything touched.',
    'Libra': 'Harmony seeker, diplomatic, aesthetic. Creates balance and beauty.',
    'Scorpio': 'Intense transformer, depth seeker, powerful. Reveals hidden truths.',
    'Sagittarius': 'Truth seeker, adventurous, philosophical. Expands all horizons.',
    'Capricorn': 'Ambitious builder, disciplined, responsible. Achieves lasting success.',
    'Aquarius': 'Innovative humanitarian, independent, visionary. Serves the collective.',
    'Pisces': 'Compassionate dreamer, intuitive, artistic. Transcends boundaries.'
  };
  return essences[sign] || 'Unique soul with gifts to discover';
}

function getSunMission(sign) {
  return `To embody the highest expression of ${sign} energy and share your unique light with the world.`;
}

function getSunStrengths(sign) {
  const strengths = {
    'Aries': ['Courage', 'Initiative', 'Leadership', 'Energy'],
    'Taurus': ['Patience', 'Reliability', 'Determination', 'Sensuality'],
    'Gemini': ['Communication', 'Adaptability', 'Intelligence', 'Wit'],
    'Cancer': ['Nurturing', 'Intuition', 'Loyalty', 'Emotional depth'],
    'Leo': ['Generosity', 'Creativity', 'Leadership', 'Warmth'],
    'Virgo': ['Analysis', 'Service', 'Attention to detail', 'Healing'],
    'Libra': ['Diplomacy', 'Fairness', 'Charm', 'Aesthetic sense'],
    'Scorpio': ['Intensity', 'Insight', 'Determination', 'Transformation'],
    'Sagittarius': ['Optimism', 'Adventure', 'Wisdom', 'Honesty'],
    'Capricorn': ['Discipline', 'Ambition', 'Responsibility', 'Patience'],
    'Aquarius': ['Innovation', 'Humanitarianism', 'Independence', 'Vision'],
    'Pisces': ['Compassion', 'Creativity', 'Intuition', 'Spirituality']
  };
  return strengths[sign] || ['Unique gifts'];
}

function getSunChallenges(sign) {
  const challenges = {
    'Aries': ['Impatience', 'Aggression', 'Self-centeredness'],
    'Taurus': ['Stubbornness', 'Materialism', 'Resistance to change'],
    'Gemini': ['Inconsistency', 'Superficiality', 'Restlessness'],
    'Cancer': ['Moodiness', 'Over-sensitivity', 'Clinginess'],
    'Leo': ['Pride', 'Attention-seeking', 'Domination'],
    'Virgo': ['Perfectionism', 'Criticism', 'Worry'],
    'Libra': ['Indecision', 'People-pleasing', 'Avoidance'],
    'Scorpio': ['Jealousy', 'Manipulation', 'Secrecy'],
    'Sagittarius': ['Bluntness', 'Restlessness', 'Over-promising'],
    'Capricorn': ['Coldness', 'Workaholism', 'Pessimism'],
    'Aquarius': ['Detachment', 'Stubbornness', 'Rebelliousness'],
    'Pisces': ['Escapism', 'Victim mentality', 'Boundaries']
  };
  return challenges[sign] || ['Growth areas'];
}

function getSunShadow(sign) {
  return `When unbalanced, ${sign} energy can become distorted. Growth comes through awareness and integration.`;
}

function getMoonEmotionalNature(sign) {
  if (!sign) return 'Emotional nature varies based on Moon placement';
  const natures = {
    'Aries': 'Quick, passionate emotions. Needs action to process feelings.',
    'Taurus': 'Steady, sensual emotions. Needs security and comfort.',
    'Gemini': 'Changeable, curious emotions. Needs mental stimulation.',
    'Cancer': 'Deep, nurturing emotions. Needs home and family.',
    'Leo': 'Warm, dramatic emotions. Needs recognition and appreciation.',
    'Virgo': 'Analytical emotions. Needs order and usefulness.',
    'Libra': 'Harmonious emotions. Needs partnership and beauty.',
    'Scorpio': 'Intense, transformative emotions. Needs depth and truth.',
    'Sagittarius': 'Optimistic, restless emotions. Needs freedom and meaning.',
    'Capricorn': 'Controlled, practical emotions. Needs achievement and structure.',
    'Aquarius': 'Detached, humanitarian emotions. Needs independence and ideals.',
    'Pisces': 'Boundless, empathic emotions. Needs spirituality and escape.'
  };
  return natures[sign] || 'Emotional nature to explore';
}

function getMoonNeeds(sign) {
  return ['Emotional security', 'Feeling understood', 'Safe space to process'];
}

function getMoonStress(sign) {
  return 'Under stress, may withdraw or become reactive. Needs time and space.';
}

function getMoonNurturing(sign) {
  return 'Through patient presence, emotional validation, and practical support.';
}

function getMoonStrengths(sign) {
  return ['Emotional intelligence', 'Intuition', 'Nurturing ability'];
}

function getMoonChallenges(sign) {
  return ['Emotional reactivity', 'Mood fluctuations'];
}

function getRisingFirstImpression(sign) {
  if (!sign) return 'First impression varies';
  return `Others first perceive ${sign} energy - ${getElement(sign)} qualities shine through.`;
}

function getRisingApproach(sign) {
  return `Approaches life through ${sign} lens - ${getModality(sign)} energy drives interaction with world.`;
}

function getRisingLesson(sign) {
  return `Learning to authentically embody ${sign} while staying true to inner self.`;
}

function extractPlanetsData(planets) {
  if (!planets || Object.keys(planets).length === 0) return {};

  const result = {};
  const planetKeys = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

  planetKeys.forEach(key => {
    if (planets[key]) {
      result[key] = {
        sign: planets[key].sign,
        degree: planets[key].degreeFormatted || planets[key].degree,
        house: planets[key].house,
        retrograde: planets[key].isRetrograde || false,
        interpretation: getPlanetInterpretation(key, planets[key].sign)
      };
    }
  });

  return result;
}

function getPlanetInterpretation(planet, sign) {
  return `${planet.charAt(0).toUpperCase() + planet.slice(1)} in ${sign} brings unique energy to this life area.`;
}

function formatAspect(aspect) {
  return {
    planets: [aspect.planet1?.name, aspect.planet2?.name],
    aspect: aspect.aspect,
    orb: aspect.orb,
    meaning: `${aspect.planet1?.name} ${aspect.aspect} ${aspect.planet2?.name} creates ${aspect.quality} energy.`
  };
}

function extractRetrogrades(planets) {
  if (!planets) return [];
  return Object.entries(planets)
    .filter(([_, p]) => p?.isRetrograde)
    .map(([name, _]) => ({
      planet: name.charAt(0).toUpperCase() + name.slice(1),
      meaning: `${name} retrograde indicates internalized ${name} energy - works from within.`
    }));
}

function buildCoreIdentity(sun, moon, rising, elementBalance) {
  const sunSign = sun?.sign || 'Unknown';
  const moonSign = moon?.sign || 'Unknown';
  const risingSign = rising?.sign || sunSign;
  const dominant = elementBalance?.dominant || getElement(sunSign);

  return `A soul of ${dominant} wisdom with ${sunSign} Sun, ${moonSign} Moon, and ${risingSign} Rising. Designed to bring unique gifts through patient persistence and authentic expression.`;
}

function buildWorldview(sun, elementBalance) {
  const element = elementBalance?.dominant || getElement(sun?.sign);
  const views = {
    'Earth': 'Life is a garden requiring patient cultivation. Tangible results matter.',
    'Fire': 'Life is an adventure to be embraced with passion and courage.',
    'Water': 'Life is an ocean of feeling and connection. Intuition guides the way.',
    'Air': 'Life is a network of ideas and connections. Understanding illuminates all.'
  };
  return views[element] || 'Life is a journey of discovery.';
}

function buildEmotionalPattern(moon) {
  return `The ${moon?.sign || 'Moon'} placement reveals emotional nature that values authenticity and depth.`;
}

function buildLifeApproach(sun, rising) {
  return `Life approached through ${sun?.sign || 'authentic'} energy with ${rising?.sign || 'unique'} presentation to the world.`;
}

function buildElementalMeaning(elementBalance) {
  const dominant = elementBalance?.dominant || 'balanced';
  return `${dominant} dominance creates ${dominant === 'Earth' ? 'grounding and stability' : dominant === 'Fire' ? 'passion and drive' : dominant === 'Water' ? 'intuition and depth' : dominant === 'Air' ? 'intellect and connection' : 'unique expression'}.`;
}

// Numerology helpers
function getNumerologySynthesisName(lifePath) {
  const names = {
    1: 'The Pioneer',
    2: 'The Peacemaker',
    3: 'The Creator',
    4: 'The Builder',
    5: 'The Freedom Seeker',
    6: 'The Nurturer',
    7: 'The Seeker',
    8: 'The Achiever',
    9: 'The Humanitarian',
    11: 'The Illuminator',
    22: 'The Master Builder',
    33: 'The Master Teacher'
  };
  return names[lifePath] || 'The Seeker';
}

function getLifePathTitle(num) {
  return getNumerologySynthesisName(num);
}

function getLifePathEssence(num) {
  const essences = {
    1: 'Independent leader who pioneers new paths. Born to initiate and achieve.',
    2: 'Diplomatic peacemaker who values harmony. Born to cooperate and nurture.',
    3: 'Creative communicator who brings joy. Born to express and inspire.',
    4: 'Practical builder who creates stability. Born to organize and manifest.',
    5: 'Adventurous spirit who seeks freedom. Born to explore and adapt.',
    6: 'Nurturing caregiver who creates harmony. Born to serve and heal.',
    7: 'Philosophical seeker who pursues truth. Born to analyze and understand.',
    8: 'Ambitious achiever who manifests abundance. Born to lead and succeed.',
    9: 'Compassionate humanitarian who serves all. Born to complete and transcend.'
  };
  return essences[num] || 'Unique path to discover.';
}

function getLifePathMission(num) {
  return `To develop the highest expression of ${num} energy and share it with the world.`;
}

function getLifePathStrengths(num) {
  const strengths = {
    1: ['Leadership', 'Independence', 'Innovation', 'Courage'],
    2: ['Diplomacy', 'Cooperation', 'Sensitivity', 'Patience'],
    3: ['Creativity', 'Communication', 'Optimism', 'Expression'],
    4: ['Organization', 'Reliability', 'Dedication', 'Practicality'],
    5: ['Adaptability', 'Adventure', 'Freedom', 'Versatility'],
    6: ['Nurturing', 'Responsibility', 'Healing', 'Service'],
    7: ['Analysis', 'Wisdom', 'Intuition', 'Research'],
    8: ['Leadership', 'Manifestation', 'Business acumen', 'Authority'],
    9: ['Compassion', 'Wisdom', 'Creativity', 'Completion']
  };
  return strengths[num] || ['Unique gifts'];
}

function getLifePathChallenges(num) {
  const challenges = {
    1: ['Self-doubt', 'Aggression', 'Isolation'],
    2: ['Over-sensitivity', 'Dependency', 'Indecision'],
    3: ['Scattered energy', 'Superficiality', 'Criticism'],
    4: ['Rigidity', 'Limitation', 'Stubbornness'],
    5: ['Restlessness', 'Overindulgence', 'Inconsistency'],
    6: ['Martyrdom', 'Perfectionism', 'Meddling'],
    7: ['Isolation', 'Skepticism', 'Secrecy'],
    8: ['Materialism', 'Workaholism', 'Control'],
    9: ['Detachment', 'Martyrdom', 'Disappointment']
  };
  return challenges[num] || ['Growth areas'];
}

function getLifePathCareers(num) {
  const careers = {
    1: ['Entrepreneur', 'Executive', 'Inventor', 'Pioneer'],
    2: ['Counselor', 'Mediator', 'Artist', 'Diplomat'],
    3: ['Writer', 'Performer', 'Designer', 'Teacher'],
    4: ['Engineer', 'Architect', 'Manager', 'Accountant'],
    5: ['Travel Guide', 'Journalist', 'Salesperson', 'Entertainer'],
    6: ['Teacher', 'Counselor', 'Healer', 'Designer'],
    7: ['Researcher', 'Analyst', 'Philosopher', 'Scientist'],
    8: ['CEO', 'Banker', 'Lawyer', 'Real Estate'],
    9: ['Humanitarian', 'Artist', 'Teacher', 'Healer']
  };
  return careers[num] || ['Varied paths'];
}

function getLifePathRelationshipStyle(num) {
  return `Approaches relationships through ${num} energy - ${getNumerologySynthesisName(num)} style.`;
}

function getDestinyTitle(num) {
  return getNumerologySynthesisName(num);
}

function getDestinyPurpose(num) {
  return `To develop ${num} qualities and share them with the world.`;
}

function getDestinyCalling(num) {
  return `Called to embody ${getNumerologySynthesisName(num)} energy in all endeavors.`;
}

function getDestinyFulfillment(num) {
  return `Through expressing ${num} energy in service to others and self.`;
}

function getSoulUrgeTitle(num) {
  const titles = {
    1: 'Independence & Achievement',
    2: 'Peace & Partnership',
    3: 'Expression & Joy',
    4: 'Stability & Order',
    5: 'Freedom & Adventure',
    6: 'Love & Responsibility',
    7: 'Wisdom & Understanding',
    8: 'Success & Recognition',
    9: 'Service & Completion'
  };
  return titles[num] || 'Inner Drive';
}

function getSoulUrgeDesires(num) {
  return ['Deep fulfillment', 'Authentic expression', 'Connection'];
}

function getSoulUrgeSpirit(num) {
  return `Activities aligned with ${num} energy feed your spirit.`;
}

function getPersonalityTitle(num) {
  return getNumerologySynthesisName(num);
}

function getPersonalityProjection(num) {
  return `Projects ${getNumerologySynthesisName(num)} energy to the world.`;
}

function getPersonalityFirstImpression(num) {
  return `Others first perceive ${num} qualities - ${getNumerologySynthesisName(num)} impression.`;
}

function calculatePersonalYear(birthDate) {
  if (!birthDate) return { current: 1, theme: 'New Beginnings' };
  const now = new Date();
  const currentYear = now.getFullYear();
  const [year, month, day] = birthDate.split('-').map(Number);
  const sum = currentYear + month + day;
  const personalYear = reduceToSingleDigit(sum);
  return {
    current: personalYear,
    theme: getPersonalYearTheme(personalYear),
    guidance: `Year of ${getNumerologySynthesisName(personalYear)} energy`
  };
}

function calculatePersonalMonth(birthDate) {
  if (!birthDate) return { current: 1, theme: 'Initiative' };
  const personalYear = calculatePersonalYear(birthDate).current;
  const currentMonth = new Date().getMonth() + 1;
  const personalMonth = reduceToSingleDigit(personalYear + currentMonth);
  return {
    current: personalMonth,
    theme: getPersonalYearTheme(personalMonth)
  };
}

// reduceToSingleDigit is imported from numerologyCalculations.js

function getPersonalYearTheme(num) {
  const themes = {
    1: 'New Beginnings',
    2: 'Partnership & Patience',
    3: 'Creativity & Expression',
    4: 'Building & Foundation',
    5: 'Freedom & Change',
    6: 'Responsibility & Love',
    7: 'Reflection & Wisdom',
    8: 'Achievement & Power',
    9: 'Completion & Release'
  };
  return themes[num] || 'Transition';
}

function getPathToPurpose(lifePath, destiny) {
  return {
    pattern: 'Dynamic Growth',
    meaning: `Life Path ${lifePath} leads to Destiny ${destiny}`,
    integration: `The lessons of ${lifePath} prepare you for the purpose of ${destiny}.`
  };
}

function getInnerOuterInteraction(soulUrge, personality) {
  return {
    innerSelf: `Soul Urge ${soulUrge} - ${getSoulUrgeTitle(soulUrge)}`,
    outerSelf: `Personality ${personality} - ${getPersonalityTitle(personality)}`,
    tension: 'Inner and outer selves create dynamic expression',
    integration: 'Your inner drive supports your outer projection'
  };
}

// ============================================
// GOLD STANDARD NUMEROLOGY HELPERS
// ============================================

function buildNumerologyRawText(lifePath, destiny, soulUrge, personality, birthday, maturity) {
  const lines = [];
  if (lifePath) lines.push(`Life Path Number: ${lifePath} (${getNumerologySynthesisName(lifePath)})`);
  if (destiny) lines.push(`Destiny/Expression Number: ${destiny} (${getNumerologySynthesisName(destiny)})`);
  if (soulUrge) lines.push(`Soul Urge/Heart's Desire Number: ${soulUrge} (${getSoulUrgeTitle(soulUrge)})`);
  if (personality) lines.push(`Personality Number: ${personality} (${getNumerologySynthesisName(personality)})`);
  if (birthday) lines.push(`Birthday Number: ${birthday}`);
  if (maturity) lines.push(`Maturity Number: ${maturity} (${getNumerologySynthesisName(maturity)})`);
  return lines.join('\n') || 'No numerology data available';
}

// NOTE: calculateLifePathFromDate was removed as dead code.
// Use calculateLifePathWithFormula from numerologyCalculations.js instead (imported at top).

// ============================================
// GOLD STANDARD INTERPRETATION HELPERS
// Uses interpretations from numerologyInterpretations.js where available
// ============================================

function getLifePathEssenceGold(num) {
  // Use rich interpretation from single source if available
  const interp = lifePathInterpretations[num];
  if (interp?.coreEssence) return interp.coreEssence;

  // Fallback for any missing numbers
  const essences = {
    1: 'The Pioneer Soul. You are here to develop independence, originality, and self-leadership. Your essence is that of the trailblazer who initiates new beginnings and inspires others through courageous action. You carry the spark of creation itself.',
    2: 'The Diplomatic Soul. You are here to master cooperation, sensitivity, and partnership. Your essence is that of the peacemaker who creates harmony through patience and understanding. You are the glue that holds relationships together.',
    3: 'The Creative Soul. You are here to express, inspire, and bring joy. Your essence is that of the artist, communicator, and eternal optimist. You carry the gift of making life more beautiful and meaningful through self-expression.',
    4: 'The Builder Soul. You are here to create structure, stability, and lasting foundations. Your essence is that of the master craftsman who builds through dedication and hard work. You are the bedrock upon which others can depend.',
    5: 'The Freedom Soul. You are here to experience life fully and embrace change. Your essence is that of the adventurer who teaches through experience and inspires through versatility. You carry the spirit of transformation itself.',
    6: 'The Nurturer Soul. You are here to love, heal, and create harmony in home and community. Your essence is that of the cosmic parent who takes responsibility for beauty, justice, and the wellbeing of others.',
    7: 'The Seeker Soul. You are here to find truth, develop wisdom, and understand the mysteries of existence. Your essence is that of the philosopher, mystic, and analyst who seeks meaning beneath the surface of life.',
    8: 'The Power Soul. You are here to master the material world and achieve worldly success. Your essence is that of the executive who manifests abundance through strategic vision and karmic understanding of give and take.',
    9: 'The Humanitarian Soul. You are here to serve humanity and complete karmic cycles. Your essence is that of the old soul who has learned from many lifetimes and now gives back through compassion, wisdom, and selfless service.',
    11: 'The Illuminator Soul (Master Number). You carry double the energy of 1, amplified by spiritual insight. Your essence is that of the inspirational messenger who channels higher wisdom to illuminate the path for others. You are a bridge between worlds.',
    22: 'The Master Builder Soul (Master Number). You carry the vision of 11 with the practical power of 4. Your essence is that of the architect of dreams who can manifest the impossible into reality. You are here to leave a lasting legacy.',
    33: 'The Master Teacher Soul (Master Number). You carry the loving service of 6 doubled and elevated. Your essence is that of the selfless healer whose very presence uplifts others. You are here to embody unconditional love.'
  };
  return essences[num] || 'A unique soul with special gifts to discover.';
}

function getLifePathMissionGold(num) {
  const missions = {
    1: 'To develop authentic self-confidence and become a leader who inspires through original action. Learn to stand alone when necessary while remaining connected to others.',
    2: 'To master the art of cooperation without losing yourself. Learn to balance giving and receiving, and become the diplomat who creates peace through understanding.',
    3: 'To fully express your creative gifts and bring joy to the world. Learn to channel scattered energy into focused creative output that uplifts and inspires.',
    4: 'To build something of lasting value through patient, dedicated effort. Learn to embrace process over shortcuts and create stability that others can rely upon.',
    5: 'To embrace change as the constant of life and help others do the same. Learn to use freedom responsibly while experiencing all that life has to offer.',
    6: 'To create harmony in relationships and take loving responsibility for others. Learn to balance perfectionism with acceptance and serve without martyrdom.',
    7: 'To develop wisdom through contemplation and share insights with those ready to hear. Learn to balance solitude with connection and trust intuition alongside analysis.',
    8: 'To master the laws of abundance and use material success for the greater good. Learn that true power comes through integrity and karmic balance.',
    9: 'To release attachment to personal outcomes and serve the collective. Learn that endings are beginnings and that letting go opens space for new blessings.',
    11: 'To channel inspirational energy and illuminate the path for others while staying grounded. Learn to manage heightened sensitivity and nervous energy.',
    22: 'To manifest grand visions into practical reality for the benefit of many. Learn to balance visionary thinking with methodical action.',
    33: 'To embody selfless service and unconditional love. Learn to give without depleting yourself and heal without taking on others\' pain.'
  };
  return missions[num] || 'To discover and fulfill your unique purpose.';
}

function getLifePathRelationshipGold(num) {
  const styles = {
    1: 'In relationships, you need independence and respect for your individuality. You thrive with partners who admire your strength while maintaining their own. Avoid dominance or competition; seek mutual admiration.',
    2: 'In relationships, you are the devoted partner who creates harmony. You need emotional security and reciprocity. Avoid losing yourself in others; maintain your identity while nurturing the connection.',
    3: 'In relationships, you bring joy, humor, and creative spark. You need appreciation for your expression and someone who enjoys life. Avoid superficiality; seek depth beneath the playfulness.',
    4: 'In relationships, you offer stability, loyalty, and practical support. You need reliability and shared values. Avoid rigidity; allow room for spontaneity and emotional expression.',
    5: 'In relationships, you need freedom within commitment. You bring excitement and adaptability but need space to breathe. Avoid restlessness; find a partner who embraces adventure.',
    6: 'In relationships, you are the nurturer who creates a beautiful home. You need to feel needed and appreciated. Avoid perfectionism and codependency; love yourself first.',
    7: 'In relationships, you need intellectual connection and respect for your inner world. You offer depth and loyalty once trust is established. Avoid emotional walls; let yourself be known.',
    8: 'In relationships, you bring ambition and material security. You need a partner who respects your drive and shares your vision. Avoid power struggles; balance career with intimacy.',
    9: 'In relationships, you offer wisdom, compassion, and acceptance. You need a partner who understands your humanitarian focus. Avoid emotional distance; stay present with loved ones.',
    11: 'In relationships, you bring spiritual depth and inspiration. You need someone who understands your sensitivity and mission. Avoid absorbing others\' emotions; maintain energetic boundaries.',
    22: 'In relationships, you need a partner who supports your grand vision. You offer security and shared purpose. Avoid workaholism; make time for intimate connection.',
    33: 'In relationships, you embody unconditional love but must learn to receive. You need a partner who gives as selflessly as you do. Avoid self-sacrifice; healthy love flows both ways.'
  };
  return styles[num] || 'Your relationship style is unique to your path.';
}

function getLifePathSpiritualLesson(num) {
  const lessons = {
    1: 'Learning that true strength includes vulnerability, and that independence does not mean isolation.',
    2: 'Learning that your worth is inherent, not dependent on others\' approval or your usefulness to them.',
    3: 'Learning to channel creative energy purposefully rather than scattering it, and finding joy even in discipline.',
    4: 'Learning that flexibility is not weakness, and that life\'s foundations must include room for growth.',
    5: 'Learning that true freedom comes from inner peace, not external circumstances or constant movement.',
    6: 'Learning that you cannot heal everyone, and that self-love is not selfish but necessary.',
    7: 'Learning to trust the heart as much as the mind, and that connection does not compromise wisdom.',
    8: 'Learning that abundance flows most freely when shared, and that success without integrity is hollow.',
    9: 'Learning to release with grace, knowing that what leaves creates space for what\'s meant to come.',
    11: 'Learning to ground your spiritual gifts in practical reality without dimming your light.',
    22: 'Learning patience with the gap between vision and manifestation, trusting the process.',
    33: 'Learning that you serve best by being whole yourself, not by depleting your energy for others.'
  };
  return lessons[num] || 'Your spiritual lesson unfolds uniquely on your path.';
}

function getLifePathShadow(num) {
  const shadows = {
    1: 'Arrogance, aggression, selfishness, inability to cooperate, fear of vulnerability.',
    2: 'Codependency, manipulation, oversensitivity, passive-aggression, martyrdom.',
    3: 'Superficiality, scattered energy, criticism, gossip, emotional avoidance through humor.',
    4: 'Rigidity, stubbornness, workaholic tendencies, pessimism, resistance to change.',
    5: 'Irresponsibility, addiction, restlessness, commitment phobia, sensory overindulgence.',
    6: 'Perfectionism, meddling, martyrdom, self-righteousness, controlling behavior.',
    7: 'Isolation, cynicism, paranoia, emotional coldness, intellectual arrogance.',
    8: 'Materialism, workaholism, power abuse, manipulation, revenge-seeking.',
    9: 'Emotional detachment, aloofness, martyrdom, inability to let go, bitterness.',
    11: 'Nervous anxiety, fanaticism, impracticality, self-doubt, overwhelm.',
    22: 'Workaholic to exhaustion, controlling, frustrated visionary, inability to delegate.',
    33: 'Self-sacrifice to destruction, unable to receive, savior complex, emotional burden.'
  };
  return shadows[num] || 'Shadow aspects to be aware of.';
}

function getDestinyPurposeGold(num) {
  const purposes = {
    1: 'To become a pioneering leader who shows others what\'s possible through original achievement.',
    2: 'To become the master diplomat who creates peace and understanding wherever you go.',
    3: 'To become a joyful creative force who inspires and uplifts through artistic expression.',
    4: 'To become the reliable builder whose work stands the test of time and serves as foundation for others.',
    5: 'To become the agent of positive change who helps others embrace life\'s adventures.',
    6: 'To become the loving healer and nurturer who creates harmony in family and community.',
    7: 'To become the wise seeker who discovers and shares profound truths.',
    8: 'To become the successful leader who demonstrates how material mastery can serve higher purposes.',
    9: 'To become the compassionate humanitarian who serves the collective good.',
    11: 'To become the inspired teacher who illuminates spiritual truths for others.',
    22: 'To become the master builder who turns impossible dreams into reality for humanity\'s benefit.',
    33: 'To become the embodiment of unconditional love and healing presence.'
  };
  return purposes[num] || 'To fulfill your unique purpose.';
}

function getDestinyCallingGold(num) {
  const callings = {
    1: 'Called to leadership roles where your originality and courage can inspire others.',
    2: 'Called to roles requiring diplomacy, mediation, and the creation of harmony.',
    3: 'Called to creative fields where your self-expression can bring joy and beauty.',
    4: 'Called to building, organizing, and creating systems that serve practical needs.',
    5: 'Called to roles involving change, travel, communication, and helping others adapt.',
    6: 'Called to healing, teaching, counseling, and creating beautiful spaces.',
    7: 'Called to research, spiritual teaching, analysis, and wisdom-sharing.',
    8: 'Called to business, finance, law, and positions of material authority.',
    9: 'Called to humanitarian work, arts, and any service to the collective.',
    11: 'Called to spiritual teaching, counseling, and inspirational leadership.',
    22: 'Called to large-scale projects, organizations, and lasting institutions.',
    33: 'Called to healing arts, spiritual mastery, and selfless service.'
  };
  return callings[num] || 'Called to discover your unique contribution.';
}

function getDestinyFulfillmentGold(num) {
  const fulfillments = {
    1: 'By developing confidence to act on original ideas and lead without needing approval.',
    2: 'By mastering cooperation and supporting others while maintaining your own boundaries.',
    3: 'By committing to creative discipline and sharing your joy with the world.',
    4: 'By building patiently, trusting the process, and finding satisfaction in solid work.',
    5: 'By embracing change positively and using your experiences to guide others.',
    6: 'By creating beauty and harmony while practicing self-care alongside service.',
    7: 'By sharing your wisdom while staying connected to practical life.',
    8: 'By achieving success ethically and using resources to benefit others.',
    9: 'By releasing personal attachments and serving with an open heart.',
    11: 'By grounding your spiritual insights in practical, helpful ways.',
    22: 'By taking methodical steps toward your grand vision with patience.',
    33: 'By loving yourself as completely as you love others.'
  };
  return fulfillments[num] || 'By expressing your unique gifts.';
}

function getDestinyLifeWork(num) {
  const lifeWork = {
    1: 'Entrepreneurship, innovation, executive leadership, pioneering new fields.',
    2: 'Counseling, diplomacy, partnership roles, support services, peacemaking.',
    3: 'Arts, entertainment, writing, speaking, design, any creative profession.',
    4: 'Engineering, architecture, management, accounting, system building.',
    5: 'Travel, sales, media, politics, anything requiring adaptability.',
    6: 'Teaching, healing, interior design, family services, community work.',
    7: 'Research, academia, spirituality, technology, investigative work.',
    8: 'Business leadership, finance, law, real estate, organizational management.',
    9: 'Humanitarian work, international affairs, arts, healing, philanthropy.',
    11: 'Spiritual teaching, counseling, inspiration, media, inventions.',
    22: 'Large-scale business, government, international organizations, architecture.',
    33: 'Healing arts, spiritual leadership, education, nonprofit leadership.'
  };
  return lifeWork[num] || 'Life work suited to your unique path.';
}

function getSoulUrgeDesiresGold(num) {
  const desires = {
    1: ['To be recognized as an individual', 'To lead and pioneer', 'To achieve on your own terms', 'To be first and original'],
    2: ['To love and be loved', 'To create harmony', 'To be in partnership', 'To feel emotionally secure'],
    3: ['To express yourself fully', 'To create beauty', 'To be appreciated', 'To inspire joy in others'],
    4: ['To build something lasting', 'To feel secure', 'To be respected for hard work', 'To create order from chaos'],
    5: ['To experience freedom', 'To explore and adventure', 'To embrace change', 'To feel alive and stimulated'],
    6: ['To love and nurture', 'To create beauty', 'To feel needed', 'To have a harmonious home'],
    7: ['To understand life\'s mysteries', 'To have time for contemplation', 'To find truth', 'To connect with the divine'],
    8: ['To achieve material success', 'To be recognized for accomplishments', 'To have power and influence', 'To create abundance'],
    9: ['To make a difference', 'To help humanity', 'To be wise', 'To experience universal love'],
    11: ['To inspire others spiritually', 'To channel higher wisdom', 'To illuminate truth', 'To be a bridge between worlds'],
    22: ['To build something magnificent', 'To leave a lasting legacy', 'To serve humanity', 'To manifest the impossible'],
    33: ['To heal and uplift', 'To embody unconditional love', 'To teach through being', 'To serve the collective']
  };
  return desires[num] || ['To fulfill your deepest desires'];
}

function getSoulUrgeSpiritGold(num) {
  const spirits = {
    1: 'Activities that allow independence, leadership, and original achievement feed your spirit.',
    2: 'Harmony in relationships, peaceful environments, and meaningful partnerships feed your spirit.',
    3: 'Creative expression, social connection, and making others smile feed your spirit.',
    4: 'Accomplishing tangible goals, organizing chaos, and building stability feed your spirit.',
    5: 'New experiences, travel, variety, and freedom of choice feed your spirit.',
    6: 'Caring for loved ones, creating beauty, and maintaining harmony feed your spirit.',
    7: 'Quiet reflection, learning mysteries, and spiritual practice feed your spirit.',
    8: 'Achievement, recognition, and using resources for good feed your spirit.',
    9: 'Helping others, creative expression, and connecting with universal truths feed your spirit.',
    11: 'Spiritual practices, inspiring others, and channeling intuition feed your spirit.',
    22: 'Working on meaningful large-scale projects and creating lasting change feed your spirit.',
    33: 'Healing work, unconditional service, and spreading love feed your spirit.'
  };
  return spirits[num] || 'Activities aligned with your core values feed your spirit.';
}

function getSoulUrgeHiddenMotivations(num) {
  const motivations = {
    1: 'Deep down, you need to prove your worth through independent achievement.',
    2: 'Deep down, you fear being alone and seek security through connection.',
    3: 'Deep down, you fear not being seen or appreciated for who you truly are.',
    4: 'Deep down, you fear chaos and instability, driving you to create order.',
    5: 'Deep down, you fear being trapped or missing out on life\'s experiences.',
    6: 'Deep down, you fear being unworthy of love unless you are giving constantly.',
    7: 'Deep down, you fear being misunderstood and seek truth for validation.',
    8: 'Deep down, you fear powerlessness and seek control through achievement.',
    9: 'Deep down, you fear your own emotions and may use service to avoid personal pain.',
    11: 'Deep down, you carry the weight of sensitivity and seek to transform it into purpose.',
    22: 'Deep down, you fear your vision is too big and seek validation through manifestation.',
    33: 'Deep down, you fear not being loving enough and may overextend to prove your worth.'
  };
  return motivations[num] || 'Your hidden motivations are unique to your soul.';
}

function getSoulUrgeEmotionalNeeds(num) {
  const needs = {
    1: 'Recognition, respect for independence, space to lead.',
    2: 'Emotional security, appreciation, harmonious relationships.',
    3: 'Appreciation, audience, creative freedom, joy.',
    4: 'Stability, reliability, acknowledgment of hard work.',
    5: 'Freedom, variety, new experiences, stimulation.',
    6: 'To be needed, beautiful surroundings, family harmony.',
    7: 'Solitude, intellectual respect, spiritual connection.',
    8: 'Recognition of achievements, respect for authority, material security.',
    9: 'To make a difference, acceptance, emotional space.',
    11: 'Understanding of sensitivity, spiritual connection, inspired purpose.',
    22: 'Support for vision, patience from others, practical assistance.',
    33: 'Unconditional acceptance, reciprocal giving, rest from service.'
  };
  return needs[num] || 'Your emotional needs are unique.';
}

function getPersonalityProjectionGold(num) {
  const projections = {
    1: 'You project confidence, independence, and leadership ability.',
    2: 'You project warmth, cooperation, and approachability.',
    3: 'You project charm, creativity, and optimism.',
    4: 'You project reliability, practicality, and competence.',
    5: 'You project energy, adaptability, and excitement.',
    6: 'You project nurturing warmth, responsibility, and good taste.',
    7: 'You project intelligence, mystery, and thoughtfulness.',
    8: 'You project success, authority, and competence.',
    9: 'You project wisdom, compassion, and sophistication.',
    11: 'You project inspiration, intuition, and spiritual depth.',
    22: 'You project capability, vision, and master competence.',
    33: 'You project unconditional love, wisdom, and healing presence.'
  };
  return projections[num] || 'Your outer projection is unique.';
}

function getPersonalityFirstImpressionGold(num) {
  const impressions = {
    1: 'Others see you as a natural leader who is confident and capable.',
    2: 'Others see you as kind, supportive, and easy to work with.',
    3: 'Others see you as fun, creative, and socially engaging.',
    4: 'Others see you as dependable, hardworking, and practical.',
    5: 'Others see you as exciting, versatile, and full of life.',
    6: 'Others see you as caring, responsible, and aesthetically aware.',
    7: 'Others see you as intelligent, reserved, and somewhat mysterious.',
    8: 'Others see you as successful, powerful, and in control.',
    9: 'Others see you as wise, compassionate, and worldly.',
    11: 'Others see you as inspiring, intuitive, and spiritually aware.',
    22: 'Others see you as highly capable of achieving great things.',
    33: 'Others see you as a loving, healing presence.'
  };
  return impressions[num] || 'Your first impression varies.';
}

function getPersonalitySocialMask(num) {
  const masks = {
    1: 'Your mask may hide insecurity beneath confident exterior.',
    2: 'Your mask may hide personal needs behind constant giving.',
    3: 'Your mask may hide deeper emotions behind humor and charm.',
    4: 'Your mask may hide creative spirit behind practical exterior.',
    5: 'Your mask may hide need for stability behind adventurous facade.',
    6: 'Your mask may hide personal desires behind service to others.',
    7: 'Your mask may hide loneliness behind intellectual reserve.',
    8: 'Your mask may hide vulnerability behind powerful image.',
    9: 'Your mask may hide personal attachments behind detached wisdom.',
    11: 'Your mask may hide anxiety behind inspiring presence.',
    22: 'Your mask may hide self-doubt behind master competence.',
    33: 'Your mask may hide exhaustion behind selfless giving.'
  };
  return masks[num] || 'Your social mask serves a purpose.';
}

function getPersonalityPerception(num) {
  const perceptions = {
    1: 'People perceive you as someone who can handle challenges independently.',
    2: 'People perceive you as someone who makes them feel comfortable and heard.',
    3: 'People perceive you as someone who brings light and creativity to any situation.',
    4: 'People perceive you as someone they can count on for practical help.',
    5: 'People perceive you as someone who knows how to enjoy life.',
    6: 'People perceive you as someone who cares deeply about others\' wellbeing.',
    7: 'People perceive you as someone with deep knowledge and wisdom.',
    8: 'People perceive you as someone who knows how to succeed.',
    9: 'People perceive you as someone with broad perspective and compassion.',
    11: 'People perceive you as someone touched by spiritual insight.',
    22: 'People perceive you as someone capable of remarkable achievements.',
    33: 'People perceive you as someone whose love is transformational.'
  };
  return perceptions[num] || 'How others perceive you is unique.';
}

function getBirthdayTalent(num) {
  const talents = {
    1: 'Natural leadership and initiative - you know how to start things.',
    2: 'Cooperation and diplomacy - you bring people together.',
    3: 'Creative expression - you have a gift for communication.',
    4: 'Organization and building - you create structure.',
    5: 'Adaptability and resourcefulness - you thrive on change.',
    6: 'Nurturing and responsibility - you care for others naturally.',
    7: 'Analysis and intuition - you see beneath the surface.',
    8: 'Executive ability - you know how to achieve goals.',
    9: 'Compassion and wisdom - you understand the bigger picture.'
  };
  return talents[num] || 'A unique talent to discover.';
}

function getBirthdayGift(day) {
  if (!day) return null;
  const gifts = {
    1: 'Leadership', 2: 'Cooperation', 3: 'Expression', 4: 'Organization', 5: 'Freedom',
    6: 'Nurturing', 7: 'Analysis', 8: 'Achievement', 9: 'Compassion', 10: 'Independence',
    11: 'Inspiration (Master)', 12: 'Creativity', 13: 'Hard Work', 14: 'Adaptability',
    15: 'Home & Family', 16: 'Introspection', 17: 'Business Acumen', 18: 'Humanitarianism',
    19: 'Independence', 20: 'Sensitivity', 21: 'Social Grace', 22: 'Master Building',
    23: 'Communication', 24: 'Family', 25: 'Wisdom', 26: 'Business', 27: 'Humanitarian',
    28: 'Leadership', 29: 'Intuition', 30: 'Expression', 31: 'Creative Building'
  };
  return gifts[day] || 'Unique birthday gift';
}

function getMaturityMeaning(num) {
  const meanings = {
    1: 'In maturity, you become a true individual, comfortable with leadership and originality.',
    2: 'In maturity, you master partnership and cooperation without losing yourself.',
    3: 'In maturity, your creative gifts flower fully and you express with confidence.',
    4: 'In maturity, the structures you\'ve built become your legacy.',
    5: 'In maturity, you integrate wisdom from experiences into teaching others.',
    6: 'In maturity, your nurturing extends to community and broader service.',
    7: 'In maturity, your wisdom becomes a gift you share with others.',
    8: 'In maturity, you use accumulated success to empower others.',
    9: 'In maturity, you release personal attachments and serve with pure heart.',
    11: 'In maturity, your spiritual gifts are grounded and practically applied.',
    22: 'In maturity, your greatest building projects come to fruition.',
    33: 'In maturity, you embody the master teacher\'s unconditional love.'
  };
  return meanings[num] || 'Your maturity brings unique gifts.';
}

function getPathToPurposeGold(lifePath, destiny) {
  if (!lifePath || !destiny) return null;
  return {
    pattern: `${getNumerologySynthesisName(lifePath)} walking toward ${getNumerologySynthesisName(destiny)}`,
    meaning: `Your Life Path ${lifePath} provides the lessons needed to fulfill Destiny ${destiny}.`,
    integration: `The challenges of being ${getNumerologySynthesisName(lifePath)} prepare you for the purpose of ${getNumerologySynthesisName(destiny)}.`,
    harmony: lifePath === destiny ? 'Your path and purpose are aligned - powerful focus!' : 'Different energies create dynamic growth between journey and destination.'
  };
}

function getInnerOuterInteractionGold(soulUrge, personality) {
  if (!soulUrge || !personality) return null;
  const match = soulUrge === personality;
  return {
    innerSelf: `Soul Urge ${soulUrge} - ${getSoulUrgeTitle(soulUrge)}`,
    outerSelf: `Personality ${personality} - ${getNumerologySynthesisName(personality)}`,
    alignment: match ? 'High - inner desires match outer presentation' : 'Dynamic - inner self differs from how others see you',
    tension: match ? 'What you want and how you appear are naturally aligned.' : 'There may be tension between what you truly want and what you show the world.',
    integration: match ? 'Your authentic self shines through naturally.' : `Learn to honor both your ${getSoulUrgeTitle(soulUrge)} needs and your ${getNumerologySynthesisName(personality)} presentation.`
  };
}

function getCoreConflicts(lifePath, soulUrge, personality) {
  const conflicts = [];
  if (lifePath === 1 && soulUrge === 2) conflicts.push('Leadership drive vs. desire for partnership');
  if (lifePath === 4 && soulUrge === 5) conflicts.push('Need for stability vs. desire for freedom');
  if (lifePath === 7 && personality === 3) conflicts.push('Inner introvert vs. social exterior');
  if (lifePath === 8 && soulUrge === 9) conflicts.push('Material focus vs. humanitarian desires');
  if (personality === 1 && soulUrge === 2) conflicts.push('Independent image vs. need for connection');
  return conflicts.length > 0 ? conflicts : ['Numbers work in harmony - minimal internal conflict'];
}

function getCoreHarmonies(lifePath, destiny, soulUrge) {
  const harmonies = [];
  if (lifePath === destiny) harmonies.push('Life Path and Destiny aligned - powerful focus');
  if (lifePath === soulUrge) harmonies.push('Journey matches heart\'s desire - authentic path');
  if ([1, 5, 7].includes(lifePath) && [1, 5, 7].includes(destiny)) harmonies.push('Independent energies amplify each other');
  if ([2, 4, 6].includes(lifePath) && [2, 4, 6].includes(destiny)) harmonies.push('Service energies work together');
  if ([3, 6, 9].includes(lifePath) && [3, 6, 9].includes(destiny)) harmonies.push('Creative/humanitarian energies align');
  return harmonies.length > 0 ? harmonies : ['Each number contributes unique energy to your profile'];
}

// MBTI helpers
function getMBTIFullName(type) {
  const names = {
    'INTJ': 'The Architect', 'INTP': 'The Logician', 'ENTJ': 'The Commander', 'ENTP': 'The Debater',
    'INFJ': 'The Advocate', 'INFP': 'The Mediator', 'ENFJ': 'The Protagonist', 'ENFP': 'The Campaigner',
    'ISTJ': 'The Logistician', 'ISFJ': 'The Defender', 'ESTJ': 'The Executive', 'ESFJ': 'The Consul',
    'ISTP': 'The Virtuoso', 'ISFP': 'The Adventurer', 'ESTP': 'The Entrepreneur', 'ESFP': 'The Entertainer'
  };
  return names[type] || type;
}

function getCognitiveFunctions(type) {
  // Simplified cognitive functions
  return {
    dominant: 'Primary cognitive function',
    auxiliary: 'Supporting function',
    tertiary: 'Developing function',
    inferior: 'Growth edge function'
  };
}

function getMBTITraits(type) {
  return {
    extraversion: { level: type.startsWith('E') ? 'Moderate to High' : 'Low to Moderate' },
    intuition: { level: type.includes('N') ? 'High' : 'Moderate' },
    thinking: { level: type.includes('T') ? 'High' : 'Moderate' },
    judging: { level: type.includes('J') ? 'High' : 'Moderate' }
  };
}

function getMBTIStrengths(type) {
  return ['Type-specific strengths', 'Cognitive function gifts', 'Natural abilities'];
}

function getMBTIChallenges(type) {
  return ['Type-specific challenges', 'Growth areas', 'Blind spots'];
}

function getMBTICommunication(type) {
  return {
    style: `${type} communication style`,
    listening: 'Active listening approach',
    conflict: 'Conflict resolution style'
  };
}

function getMBTIRelationships(type) {
  return {
    strengths: 'Relationship gifts',
    needs: 'Relationship needs',
    compatibility: 'Best matches'
  };
}

function getMBTICareers(type) {
  return ['Career path 1', 'Career path 2', 'Career path 3'];
}

function getMBTIStressResponse(type) {
  return {
    underStress: 'Stress behavior',
    recovery: 'Recovery needs'
  };
}

// Enneagram helpers
function getEnneagramName(type, wing) {
  const names = {
    1: 'The Reformer', 2: 'The Helper', 3: 'The Achiever',
    4: 'The Individualist', 5: 'The Investigator', 6: 'The Loyalist',
    7: 'The Enthusiast', 8: 'The Challenger', 9: 'The Peacemaker'
  };
  const wingNames = {
    1: 'Perfectionist', 2: 'Helper', 3: 'Achiever',
    4: 'Individualist', 5: 'Investigator', 6: 'Loyalist',
    7: 'Enthusiast', 8: 'Challenger', 9: 'Peacemaker'
  };
  const baseName = names[type] || `Type ${type}`;
  if (wing) {
    return `${baseName} with ${wingNames[wing]} Wing`;
  }
  return baseName;
}

function getEnneagramSubtitle(type, wing) {
  return wing ? `${type}w${wing}` : `Type ${type}`;
}

function getEnneagramMotivation(type) {
  const motivations = {
    1: 'To be good, right, and improve the world',
    2: 'To be loved and needed by others',
    3: 'To be successful and admired',
    4: 'To be unique and authentic',
    5: 'To understand and be capable',
    6: 'To have security and support',
    7: 'To be happy and avoid pain',
    8: 'To be strong and protect oneself',
    9: 'To maintain peace and harmony'
  };
  return motivations[type] || 'To grow and evolve';
}

function getEnneagramFear(type) {
  const fears = {
    1: 'Being corrupt, evil, or defective',
    2: 'Being unloved or unwanted',
    3: 'Being worthless or without value',
    4: 'Being ordinary or without significance',
    5: 'Being useless, helpless, or incapable',
    6: 'Being without support or guidance',
    7: 'Being deprived or trapped in pain',
    8: 'Being controlled or violated',
    9: 'Conflict, loss, or separation'
  };
  return fears[type] || 'Core fear varies';
}

function getEnneagramDesire(type) {
  const desires = {
    1: 'To have integrity and be balanced',
    2: 'To be loved unconditionally',
    3: 'To feel valuable and worthwhile',
    4: 'To find significance and identity',
    5: 'To be competent and capable',
    6: 'To have security and support',
    7: 'To be satisfied and content',
    8: 'To protect self and be in control',
    9: 'To have inner peace and stability'
  };
  return desires[type] || 'Core desire varies';
}

function getEnneagramTraits(type) {
  return {
    healthy: ['Type-specific healthy traits'],
    average: ['Type-specific average traits'],
    unhealthy: ['Type-specific unhealthy traits']
  };
}

function getWingInfluence(type, wing) {
  return `Wing ${wing} adds ${getEnneagramName(wing)} qualities to core ${type} type.`;
}

function getEnneagramGrowthPath(type) {
  return {
    integration: `Growth direction for Type ${type}`,
    disintegration: `Stress direction for Type ${type}`
  };
}

function getEnneagramRelationships(type) {
  return {
    strengths: 'Relationship gifts',
    challenges: 'Relationship challenges',
    needs: 'Relationship needs'
  };
}

function getEnneagramCommunication(type) {
  return `Type ${type} communication style`;
}

function getEnneagramStressResponse(type) {
  return `Under stress, Type ${type} may move to lower expressions.`;
}

// Constitutional Synthesis helpers
function deriveCoreArchetype(constitution) {
  const archetypes = [];

  if (constitution.western?.synthesisName) archetypes.push(constitution.western.synthesisName);
  if (constitution.numerology?.synthesisName) archetypes.push(constitution.numerology.synthesisName);
  if (constitution.mbti?.fullName) archetypes.push(constitution.mbti.fullName);

  // Combine into unified archetype
  return archetypes[0] || 'The Seeker';
}

function buildEssenceStatement(constitution) {
  const parts = [];

  if (constitution.bazi?.dayMaster?.description) {
    parts.push(constitution.bazi.dayMaster.description);
  }

  if (constitution.western?.constitutionalSynthesis?.coreIdentity) {
    parts.push(constitution.western.constitutionalSynthesis.coreIdentity);
  }

  if (constitution.numerology?.lifePath?.coreEssence) {
    parts.push(`Walks the path of ${constitution.numerology.lifePath.title}.`);
  }

  return parts.join(' ') || 'A unique soul with gifts to share with the world.';
}

function identifyCrossSystemPatterns(constitution) {
  const patterns = [];

  // Look for element dominance across systems
  const baziElement = constitution.bazi?.dayMaster?.element;
  const westernElement = constitution.western?.elementBalance?.dominant || constitution.western?.sun?.element;

  if (baziElement && westernElement && baziElement === westernElement) {
    patterns.push({
      pattern: `${baziElement} Dominance`,
      systems: ['BaZi', 'Western'],
      interpretation: `Strong ${baziElement} constitution across multiple systems.`
    });
  }

  // Look for nurturer/teacher patterns
  if (constitution.numerology?.lifePath?.number === 6 ||
    constitution.mbti?.type?.includes('F') ||
    constitution.enneagram?.dominantType === 2) {
    patterns.push({
      pattern: 'Nurturer-Teacher',
      systems: ['Numerology', 'MBTI', 'Enneagram'].filter(s =>
        (s === 'Numerology' && constitution.numerology?.lifePath?.number === 6) ||
        (s === 'MBTI' && constitution.mbti?.type?.includes('F')) ||
        (s === 'Enneagram' && constitution.enneagram?.dominantType === 2)
      ),
      interpretation: 'Natural caregiver and teacher who nurtures through presence.'
    });
  }

  return patterns;
}

function deriveCommunicationStyle(constitution) {
  const styles = [];

  if (constitution.western?.planets?.mercury?.sign) {
    styles.push(`Mercury in ${constitution.western.planets.mercury.sign}`);
  }

  return {
    pace: constitution.western?.elementBalance?.dominant === 'Earth' ? 'Deliberate and thorough' : 'Moderate',
    tone: 'Warm and grounded',
    depth: 'Prefers substance over flash',
    medium: 'Best with face-to-face or written depth'
  };
}

function deriveEmotionalNeeds(constitution) {
  return {
    primary: constitution.western?.moon?.innerNeeds?.[0] || 'Emotional security',
    safety: 'Comes from tangible results and predictable patterns',
    stress: 'Needs time, space, and comfort to reset',
    vulnerability: 'Needs patient, non-demanding invitation'
  };
}

function deriveDecisionMaking(constitution) {
  return {
    process: 'Methodical, considers long-term impact',
    speed: 'Deliberate but firm once decided',
    factors: 'Values, people impact, tangible results'
  };
}

function deriveConflictResponse(constitution) {
  return {
    style: 'Avoids conflict but stands ground on values',
    triggers: ['Sudden changes', 'Being rushed', 'Disrespect of values'],
    deEscalation: 'Needs time, physical space, calm approach',
    resolution: 'Prefers practical solutions that honor everyone'
  };
}

function deriveLoveLanguage(constitution) {
  const venus = constitution.western?.planets?.venus;

  return {
    giving: ['Acts of Service', 'Creating Safe Spaces', 'Loyal Presence'],
    receiving: ['Quality Time', 'Physical Touch', 'Consistency']
  };
}

function deriveGrowthAreas(constitution) {
  return {
    current: 'Learning flexibility while maintaining values',
    lifelong: 'Balancing achievement with emotional connection',
    shadow: 'Allowing vulnerability, accepting impermanence'
  };
}

function collectStrengths(constitution) {
  const strengths = new Set();

  constitution.western?.sun?.strengths?.forEach(s => strengths.add(s));
  constitution.numerology?.lifePath?.strengths?.forEach(s => strengths.add(s));
  constitution.mbti?.strengths?.forEach(s => strengths.add(s));

  return Array.from(strengths).slice(0, 8);
}

function collectChallenges(constitution) {
  const challenges = new Set();

  constitution.western?.sun?.challenges?.forEach(c => challenges.add(c));
  constitution.numerology?.lifePath?.challenges?.forEach(c => challenges.add(c));
  constitution.mbti?.challenges?.forEach(c => challenges.add(c));

  return Array.from(challenges).slice(0, 6);
}

function getIncludedSystems(profile) {
  const systems = [];
  if (profile.calculations?.fourPillars) systems.push('BaZi');
  if (profile.calculations?.western) systems.push('Western');
  if (profile.calculations?.numerology || profile.numerology) systems.push('Numerology');
  if (profile.mbti) systems.push('MBTI');
  if (profile.enneagram) systems.push('Enneagram');
  return systems;
}

function calculateCompleteness(profile) {
  return {
    natal: profile.calculations?.fourPillars && profile.calculations?.western ? '100%' : '50%',
    psychology: profile.mbti ? '50%' : '0%',
    preferences: '0%'
  };
}

// Export all functions
export default {
  getConstitution,
  updateConstitution,
  getConstitutionForAI,
  populateConstitution,
  extractIdentity,
  extractBirth,
  extractBazi,
  extractWestern,
  extractNumerology,
  extractMBTI,
  extractEnneagram,
  generateConstitutionalSynthesis
};
