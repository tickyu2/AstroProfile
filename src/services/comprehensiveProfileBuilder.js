/**
 * ============================================================================
 * COMPREHENSIVE PROFILE BUILDER
 * ============================================================================
 *
 * A unified service that pre-packages ALL user data into a single JSON structure.
 * This data is computed LOCALLY and stored in Firestore for:
 *   - Cathedral Analysis (AI interprets, doesn't compute)
 *   - Soul Letters (all nuances available)
 *   - Partner Compatibility
 *   - Timeline Features
 *   - Any future prompts
 *
 * INCLUDES:
 *   1. Personal Information (name, DOB, time, location)
 *   2. Western Astrology (Sovereign Engine - Sun/Moon/Rising, planets, houses, aspects)
 *   3. BaZi (Four Pillars, Ten Gods, Element Analysis, Hidden Roots)
 *   4. Numerology (Life Path, Expression, Soul Urge, Personality, Personal Year)
 *   5. Chinese Zodiac (Animal, Element, Polarity)
 *   6. Yin/Yang Balance (7 Constitutional Battles)
 *   7. MBTI (Type, Temperament, Cognitive Stack)
 *   8. Enneagram (Type, Wing, Tritype, Center)
 *   9. Life Epochs (Saturn cycles, planetary ages)
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 26, 2024
 */

import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { calculateAge, getChineseZodiac, getWesternZodiac, getDayOfWeek, calculateYinYang, calculateNumerology } from '../utils/calculations';
import { calculateBaZi } from '../utils/baziCalculator';
import { calculateSovereignChartWithFallback } from './sovereignChartService';
import { generateEpochs } from '../soulGarden';
import { getCognitiveStack, getTemperament, getTypeName, generateMBTICode } from '../utils/mbti/mbtiCodeSystem';
import { ENNEAGRAM_TYPES, ENNEAGRAM_CENTERS } from '../components/enneagram/enneagramData';
import { getSynthesis, getLunaGuidance, isImplemented } from '../data/mbtiEnneagramSynthesis';

// Initialize Firestore
const db = getFirestore();

/**
 * ============================================================================
 * SCHEMA VERSION - Increment when schema changes
 * ============================================================================
 */
export const PROFILE_SCHEMA_VERSION = '1.0.0';

/**
 * ============================================================================
 * BUILD COMPREHENSIVE PROFILE
 * ============================================================================
 * The main function that computes ALL data locally
 *
 * @param {Object} params - Input parameters
 * @param {string} params.firstName - First name
 * @param {string} params.lastName - Last name (optional)
 * @param {string} params.birthDate - Birth date in 'YYYY-MM-DD' format
 * @param {string} params.birthTime - Birth time in 'HH:MM' format (optional)
 * @param {number} params.latitude - Birth location latitude (optional)
 * @param {number} params.longitude - Birth location longitude (optional)
 * @param {string} params.timezone - Timezone string (optional)
 * @param {string} params.gender - 'Male' | 'Female' | 'Other' (optional)
 * @param {string} params.mbtiType - MBTI type if known (optional)
 * @param {Object} params.enneagramResult - Enneagram assessment result (optional)
 * @returns {Promise<Object>} Complete profile JSON
 */
export async function buildComprehensiveProfile(params) {
  const {
    firstName = '',
    lastName = '',
    birthDate,
    birthTime = '12:00',
    latitude,
    longitude,
    timezone = 'UTC',
    gender = null,
    mbtiType = null,
    enneagramResult = null,
    locationName = null
  } = params;

  if (!birthDate) {
    throw new Error('Birth date is required');
  }

  console.log('[ComprehensiveProfileBuilder] Building profile for:', firstName, birthDate);

  // Parse birth date components
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour, minute] = (birthTime || '12:00').split(':').map(Number);

  // =========================================================================
  // 1. PERSONAL INFORMATION
  // =========================================================================
  const personal = {
    firstName,
    lastName,
    fullName: lastName ? `${firstName} ${lastName}` : firstName,
    birthDate,
    birthTime: birthTime || '12:00',
    birthLocation: {
      latitude: latitude || null,
      longitude: longitude || null,
      timezone: timezone || 'UTC',
      name: locationName || null
    },
    gender,
    age: calculateAge(birthDate)
  };

  // =========================================================================
  // 2. WESTERN ASTROLOGY (Simple + Sovereign)
  // =========================================================================
  const simpleWestern = getWesternZodiac(birthDate);

  // Get sovereign chart data if location available
  let sovereignChart = null;
  try {
    sovereignChart = await calculateSovereignChartWithFallback({
      birthDate,
      birthTime,
      latitude,
      longitude,
      timezone
    });
  } catch (error) {
    console.warn('[ComprehensiveProfileBuilder] Sovereign chart calculation failed:', error);
  }

  // Safely convert planets to array (API may return object keyed by planet name)
  const planetsArray = sovereignChart?.planets
    ? (Array.isArray(sovereignChart.planets)
        ? sovereignChart.planets
        : Object.values(sovereignChart.planets))
    : [];

  const western = {
    // Simple date-based calculation
    sunSign: {
      sign: simpleWestern.sign,
      element: simpleWestern.element,
      yinYang: simpleWestern.yinYang
    },
    // Sovereign astronomical data (if available)
    sovereign: sovereignChart ? {
      sun: sovereignChart.sun,
      moon: sovereignChart.moon,
      rising: sovereignChart.rising,
      planets: planetsArray,
      houses: sovereignChart.houses || [],
      aspects: sovereignChart.aspects || [],
      moonPhase: sovereignChart.moonPhase,
      elementBalance: sovereignChart.elementBalance,
      julianDay: sovereignChart.julianDay,
      engine: sovereignChart.engine
    } : null,
    // Summary Big Three
    bigThree: sovereignChart ? {
      sun: sovereignChart.sun?.sign || simpleWestern.sign,
      moon: sovereignChart.moon?.sign || null,
      rising: sovereignChart.rising?.sign || null
    } : {
      sun: simpleWestern.sign,
      moon: null,
      rising: null
    },
    // Retrograde analysis
    retrogrades: planetsArray.filter(p => p.retrograde),
    // Direct planets
    directPlanets: planetsArray.filter(p => !p.retrograde)
  };

  // =========================================================================
  // 3. BAZI (CHINESE ASTROLOGY)
  // =========================================================================
  const baziResult = calculateBaZi({
    year,
    month,
    day,
    hour,
    minute
  });

  const bazi = {
    // Core pillars
    pillars: baziResult.pillars || [],
    // Day Master (core essence)
    dayMaster: baziResult.dayMaster || null,
    // Element analysis
    elements: baziResult.elements || {},
    // Yin/Yang within BaZi
    yinYang: baziResult.yinYang || {},
    // Branch interactions (clashes, combines, etc.)
    interactions: baziResult.interactions || [],
    // Constitutional metaphor
    metaphor: baziResult.metaphor || null,
    // Ten Gods for each pillar
    tenGods: (baziResult.pillars || []).map(p => ({
      pillar: p.name,
      tenGod: p.tenGod
    })),
    // Calculation metadata
    calculationMethod: baziResult.calculationMethod,
    solarTermsRespected: baziResult.solarTermsRespected,
    hiddenRootsIncluded: baziResult.hiddenRootsIncluded
  };

  // =========================================================================
  // 4. CHINESE ZODIAC (Simple animal + element)
  // =========================================================================
  const chineseZodiacResult = getChineseZodiac(birthDate);

  const chineseZodiac = {
    animal: chineseZodiacResult.animal,
    element: chineseZodiacResult.element,
    polarity: chineseZodiacResult.yinYang,
    year: chineseZodiacResult.year,
    bornBeforeLiChun: chineseZodiacResult.bornBeforeLiChun,
    fullDescription: `${chineseZodiacResult.element} ${chineseZodiacResult.animal}`
  };

  // =========================================================================
  // 5. YIN/YANG BALANCE (7 Constitutional Battles)
  // =========================================================================
  const dayOfWeek = getDayOfWeek(birthDate);
  const yinYangResult = calculateYinYang(
    chineseZodiacResult,
    simpleWestern,
    gender,
    dayOfWeek,
    birthTime
  );

  const yinYangBalance = {
    yinPercentage: yinYangResult.yinPercentage,
    yangPercentage: yinYangResult.yangPercentage,
    balancedPercentage: yinYangResult.balancedPercentage,
    balance: yinYangResult.balance,
    factors: yinYangResult.factors,
    totalPoints: yinYangResult.totalPoints,
    calculationVersion: yinYangResult.calculationVersion
  };

  // =========================================================================
  // 6. NUMEROLOGY
  // =========================================================================
  const numerologyResult = calculateNumerology(firstName, lastName || '', birthDate);

  const numerology = {
    lifePath: numerologyResult.lifePath,
    expression: numerologyResult.expression,
    soulUrge: numerologyResult.soulUrge,
    personality: numerologyResult.personality,
    personalYear: numerologyResult.personalYear
  };

  // =========================================================================
  // 7. DAY OF WEEK / PLANETARY RULER
  // =========================================================================
  const birthDay = {
    day: dayOfWeek.day,
    planet: dayOfWeek.planet,
    traits: dayOfWeek.traits
  };

  // =========================================================================
  // 8. MBTI (if provided)
  // =========================================================================
  let mbti = null;
  if (mbtiType) {
    mbti = {
      type: mbtiType,
      name: getTypeName(mbtiType),
      temperament: getTemperament(mbtiType),
      cognitiveStack: getCognitiveStack(mbtiType),
      code: generateMBTICode(mbtiType)
    };
  }

  // =========================================================================
  // 9. ENNEAGRAM (if provided)
  // =========================================================================
  let enneagram = null;
  if (enneagramResult) {
    const typeData = ENNEAGRAM_TYPES[enneagramResult.dominantType];
    const centerData = ENNEAGRAM_CENTERS[typeData?.center];

    enneagram = {
      type: enneagramResult.dominantType,
      name: typeData?.name || `Type ${enneagramResult.dominantType}`,
      wing: enneagramResult.wing,
      wingNotation: `${enneagramResult.dominantType}w${enneagramResult.wing}`,
      tritype: enneagramResult.tritype,
      tritypeNotation: enneagramResult.tritype?.join('') || null,
      center: {
        name: centerData?.name || 'Unknown',
        emotion: centerData?.emotion || 'Unknown'
      },
      scores: enneagramResult.scores,
      essence: typeData?.essence,
      passion: typeData?.passion,
      virtue: typeData?.virtue,
      growthArrow: typeData?.growthArrow,
      stressArrow: typeData?.stressArrow
    };
  }

  // =========================================================================
  // 9.5. MBTI + ENNEAGRAM SYNTHESIS (if both are present)
  // =========================================================================
  let mbtiEnneagramSynthesis = null;
  if (mbtiType && enneagramResult?.dominantType) {
    const synthesisData = getSynthesis(mbtiType, enneagramResult.dominantType);
    if (synthesisData && synthesisData.implemented) {
      const lunaGuidance = getLunaGuidance(mbtiType, enneagramResult.dominantType);
      mbtiEnneagramSynthesis = {
        combination: `${mbtiType.toUpperCase()}-${enneagramResult.dominantType}`,
        archetype: synthesisData.archetype,
        frequency: synthesisData.frequency,
        synthesis: synthesisData.synthesis,
        cognitiveMotivationDance: synthesisData.cognitive_motivation_dance,
        strengths: synthesisData.strengths,
        challenges: synthesisData.challenges,
        growthPath: synthesisData.growth_path,
        lunaApproach: lunaGuidance,
        famousExamples: synthesisData.famous_examples,
        relationshipStyle: synthesisData.relationship_style,
        careerFits: synthesisData.career_fits,
        implemented: true
      };
    } else {
      // Fallback for unimplemented combinations
      mbtiEnneagramSynthesis = {
        combination: `${mbtiType.toUpperCase()}-${enneagramResult.dominantType}`,
        archetype: `${mbtiType.toUpperCase()} + Type ${enneagramResult.dominantType}`,
        note: 'This is a less common pairing. Luna will provide personalized insights based on your complete profile.',
        implemented: false
      };
    }
  }

  // =========================================================================
  // 10. LIFE EPOCHS (Saturn cycles, planetary ages)
  // =========================================================================
  const epochChart = {
    planets: western.sovereign?.planets || [],
    houses: western.sovereign?.houses || [],
    aspects: western.sovereign?.aspects || [],
    rising: western.sovereign?.rising || { sign: western.bigThree.sun }
  };

  const epochs = generateEpochs(epochChart);

  // =========================================================================
  // 11. SOUL SYNTHESIS (Key insights for AI prompts)
  // =========================================================================
  const soulSynthesis = {
    // Constitutional Identity
    identity: {
      sunSign: western.bigThree.sun,
      moonSign: western.bigThree.moon,
      risingSign: western.bigThree.rising,
      dayMasterElement: bazi.dayMaster?.element,
      chineseAnimal: chineseZodiac.animal,
      lifePath: numerology.lifePath?.number
    },
    // Elemental Constitution
    elements: {
      westernDominant: western.sovereign?.elementBalance?.dominant,
      baziDominant: bazi.elements?.dominant,
      baziWeakest: bazi.elements?.weaknesses?.[0]?.element,
      baziMissing: bazi.elements?.missing?.map(m => m.element) || []
    },
    // Energy Balance
    energy: {
      yinYangBalance: yinYangBalance.balance,
      retrogradeCount: western.retrogrades.length,
      retrogradePlanets: western.retrogrades.map(p => p.name || p.planet)
    },
    // Personality Framework
    personality: {
      mbtiType: mbti?.type,
      enneagramType: enneagram?.type,
      enneagramWing: enneagram?.wing
    }
  };

  // =========================================================================
  // BUILD FINAL PROFILE
  // =========================================================================
  const profile = {
    // Schema version for future migrations
    schemaVersion: PROFILE_SCHEMA_VERSION,

    // When this profile was computed
    computedAt: new Date().toISOString(),

    // Sections
    personal,
    western,
    bazi,
    chineseZodiac,
    yinYangBalance,
    numerology,
    birthDay,
    mbti,
    enneagram,
    mbtiEnneagramSynthesis,
    epochs,

    // Synthesis for AI prompts
    soulSynthesis,

    // Metadata
    meta: {
      hasSovereignChart: !!sovereignChart,
      hasBirthTime: !!birthTime && birthTime !== '12:00',
      hasLocation: !!(latitude && longitude),
      hasMBTI: !!mbtiType,
      hasEnneagram: !!enneagramResult,
      hasMBTIEnneagramSynthesis: !!mbtiEnneagramSynthesis?.implemented
    }
  };

  console.log('[ComprehensiveProfileBuilder] Profile built successfully');
  return profile;
}

/**
 * ============================================================================
 * FIRESTORE STORAGE
 * ============================================================================
 */

/**
 * Save comprehensive profile to Firestore
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {Object} profile - The comprehensive profile
 * @returns {Promise<void>}
 */
export async function saveComprehensiveProfile(userId, profileId, profile) {
  if (!userId || !profileId) {
    throw new Error('User ID and Profile ID are required');
  }

  const docRef = doc(db, 'users', userId, 'comprehensive_profiles', profileId);

  await setDoc(docRef, {
    ...profile,
    savedAt: new Date().toISOString(),
    userId,
    profileId
  });

  console.log('[ComprehensiveProfileBuilder] Profile saved to Firestore:', profileId);
}

/**
 * Get comprehensive profile from Firestore
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @returns {Promise<Object|null>}
 */
export async function getComprehensiveProfile(userId, profileId) {
  if (!userId || !profileId) {
    return null;
  }

  const docRef = doc(db, 'users', userId, 'comprehensive_profiles', profileId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }

  return null;
}

/**
 * Update specific section of comprehensive profile
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {string} section - Section name ('mbti', 'enneagram', etc.)
 * @param {Object} data - New data for the section
 * @returns {Promise<void>}
 */
export async function updateProfileSection(userId, profileId, section, data) {
  if (!userId || !profileId || !section) {
    throw new Error('User ID, Profile ID, and section are required');
  }

  const docRef = doc(db, 'users', userId, 'comprehensive_profiles', profileId);

  await updateDoc(docRef, {
    [section]: data,
    [`meta.has${section.charAt(0).toUpperCase() + section.slice(1)}`]: true,
    updatedAt: new Date().toISOString()
  });

  console.log(`[ComprehensiveProfileBuilder] Updated ${section} section`);
}

/**
 * Build or update comprehensive profile and save to Firestore
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {Object} params - Build parameters
 * @returns {Promise<Object>} The comprehensive profile
 */
export async function buildAndSaveProfile(userId, profileId, params) {
  // Check if profile exists
  const existing = await getComprehensiveProfile(userId, profileId);

  // Build new profile
  const profile = await buildComprehensiveProfile(params);

  // If existing, merge MBTI/Enneagram if not provided in params
  if (existing) {
    if (!params.mbtiType && existing.mbti) {
      profile.mbti = existing.mbti;
      profile.soulSynthesis.personality.mbtiType = existing.mbti.type;
      profile.meta.hasMBTI = true;
    }
    if (!params.enneagramResult && existing.enneagram) {
      profile.enneagram = existing.enneagram;
      profile.soulSynthesis.personality.enneagramType = existing.enneagram.type;
      profile.soulSynthesis.personality.enneagramWing = existing.enneagram.wing;
      profile.meta.hasEnneagram = true;
    }
  }

  // Save to Firestore
  await saveComprehensiveProfile(userId, profileId, profile);

  return profile;
}

/**
 * ============================================================================
 * PROFILE FOR AI PROMPTS
 * ============================================================================
 * Returns a streamlined version of the profile optimized for AI prompts
 * (reduces token usage while keeping all essential data)
 */
export function getProfileForAI(comprehensiveProfile) {
  const p = comprehensiveProfile;

  return {
    // Core identity
    name: p.personal?.firstName,
    birthDate: p.personal?.birthDate,
    birthTime: p.personal?.birthTime,
    age: p.personal?.age,

    // Western astrology
    western: {
      sun: p.western?.bigThree?.sun,
      moon: p.western?.bigThree?.moon,
      rising: p.western?.bigThree?.rising,
      planets: p.western?.sovereign?.planets || [],
      houses: p.western?.sovereign?.houses || [],
      aspects: p.western?.sovereign?.aspects || [],
      retrogrades: p.western?.retrogrades?.map(r => r.name || r.planet) || [],
      elementBalance: p.western?.sovereign?.elementBalance
    },

    // BaZi
    bazi: {
      dayMaster: p.bazi?.dayMaster,
      pillars: p.bazi?.pillars,
      elements: p.bazi?.elements,
      interactions: p.bazi?.interactions,
      metaphor: p.bazi?.metaphor
    },

    // Chinese Zodiac
    chineseZodiac: p.chineseZodiac,

    // Energy Balance
    yinYang: {
      balance: p.yinYangBalance?.balance,
      yinPercent: p.yinYangBalance?.yinPercentage,
      yangPercent: p.yinYangBalance?.yangPercentage
    },

    // Numerology
    numerology: p.numerology,

    // Birth day
    birthDay: p.birthDay,

    // Personality
    mbti: p.mbti ? {
      type: p.mbti.type,
      name: p.mbti.name,
      temperament: p.mbti.temperament,
      cognitiveStack: p.mbti.cognitiveStack
    } : null,

    enneagram: p.enneagram ? {
      type: p.enneagram.type,
      name: p.enneagram.name,
      wing: p.enneagram.wing,
      center: p.enneagram.center?.name,
      essence: p.enneagram.essence,
      passion: p.enneagram.passion,
      virtue: p.enneagram.virtue
    } : null,

    // Life epochs
    epochs: p.epochs,

    // Soul synthesis
    synthesis: p.soulSynthesis
  };
}

/**
 * ============================================================================
 * EXPORTS
 * ============================================================================
 */
export default {
  // Schema
  PROFILE_SCHEMA_VERSION,

  // Build
  buildComprehensiveProfile,

  // Firestore
  saveComprehensiveProfile,
  getComprehensiveProfile,
  updateProfileSection,
  buildAndSaveProfile,

  // AI
  getProfileForAI
};
