/**
 * Saturn Journey Profile Orchestrator
 *
 * The single, clean entry point for the Saturn OS.
 * Takes a chart and returns a complete Saturn Journey profile.
 *
 * GENESIS AstroProfile - January 2026
 */

import { SATURN_PHASES, SATURN_ORBIT_YEARS } from './saturnJourneyConstants';
import { getSaturnSignProfile } from '../data/saturnJourneyInterpretations';
import { buildSaturnJourneyNarrative } from './saturnJourneyNarrative';
import { buildSaturnShadowProfile } from './saturnShadowIntegration';
import {
  generateSaturnReturnReport,
  calculateSaturnReturnWindows,
  checkSaturnReturnStatus
} from './saturnReturnReport';
import { SATURN_CATHEDRAL_PATH, getSaturnChamber } from '../data/saturnCathedralPath';
import { buildLunaSaturnResponses } from './saturnLunaDialogue';
import {
  SATURN_ASPECT_COMPLEXES,
  getAspectComplexesFromNatal
} from '../data/saturnAspectComplexes';
import {
  SATURN_JOURNALING_PROMPTS,
  SATURN_LUNA_TRIGGERS,
  SATURN_INNER_CRITIC_SCRIPTS,
  getLunaTriggers,
  getJournalingPrompts,
  getInnerCriticScriptsForHouse
} from '../data/saturnLunaIntegration';
import {
  getSaturnHouseOverlay,
  mergeSaturnHouseWithSign
} from '../data/saturnHouseOverlays';
import {
  getSaturnArchetype,
  getSaturnMythicTitle
} from '../data/saturnCombinedArchetypes';
import {
  buildSaturnRelationshipDynamics,
  getRelationshipQuickSummary,
  detectRelationalTrigger
} from './saturnRelationshipEngine';

// Astrology of Fate modules
import { buildFateThreads } from './fateThreads';
import { assignArchetype } from './fateArchetypes';
import { detectCrossroads } from './fateCrossroads';
import { computeFateChoiceIndex } from './fateChoiceIndex';

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Extract Saturn from chart planets
 * @param {Object} chart - Chart with planets array
 * @returns {Object} Saturn position data
 */
function getSaturn(chart) {
  if (!chart || !chart.planets) {
    throw new Error('Saturn not found in chart: missing planets array');
  }

  // Handle various chart formats
  const saturn = chart.planets.find(p =>
    p.name === 'Saturn' ||
    p.name === 'saturn' ||
    p.planet === 'Saturn' ||
    p.planet === 'saturn'
  );

  if (!saturn) {
    // Try object format
    if (chart.planets.Saturn || chart.planets.saturn) {
      const s = chart.planets.Saturn || chart.planets.saturn;
      return {
        name: 'Saturn',
        sign: s.sign || s.Sign,
        house: s.house || s.House,
        degree: s.degree || s.longitude,
        isRetrograde: s.isRetrograde || s.retrograde || false
      };
    }
    throw new Error('Saturn not found in chart');
  }

  return {
    name: 'Saturn',
    sign: saturn.sign || saturn.Sign,
    house: saturn.house || saturn.House,
    degree: saturn.degree || saturn.longitude,
    isRetrograde: saturn.isRetrograde || saturn.retrograde || false
  };
}

/**
 * Detect Saturn aspect keys from natal aspects
 * @param {Array} aspects - Array of natal aspects
 * @returns {Array} Array of aspect keys like "Moon-Saturn"
 */
function detectSaturnAspectKeys(aspects) {
  if (!aspects || !Array.isArray(aspects)) return [];

  const keys = [];
  const pairs = [
    ['Moon', 'Saturn', 'Moon-Saturn'],
    ['Sun', 'Saturn', 'Sun-Saturn'],
    ['Venus', 'Saturn', 'Venus-Saturn'],
    ['Mars', 'Saturn', 'Mars-Saturn'],
    ['Mercury', 'Saturn', 'Mercury-Saturn'],
    ['Jupiter', 'Saturn', 'Jupiter-Saturn'],
    ['Uranus', 'Saturn', 'Uranus-Saturn'],
    ['Neptune', 'Saturn', 'Neptune-Saturn'],
    ['Pluto', 'Saturn', 'Pluto-Saturn']
  ];

  for (const [p1, p2, key] of pairs) {
    const hit = aspects.find(a => {
      const a1 = (a.p1 || a.planet1 || '').toLowerCase();
      const a2 = (a.p2 || a.planet2 || '').toLowerCase();
      return (
        (a1 === p1.toLowerCase() && a2 === p2.toLowerCase()) ||
        (a1 === p2.toLowerCase() && a2 === p1.toLowerCase())
      );
    });

    if (hit && SATURN_ASPECT_COMPLEXES[key]) {
      keys.push(key);
    }
  }

  return keys;
}

/**
 * Calculate age from birth date
 * @param {string} birthDateISO - Birth date in ISO format
 * @returns {number} Age in years (with decimal)
 */
function calculateAge(birthDateISO) {
  if (!birthDateISO) return null;

  const birth = new Date(birthDateISO);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  // Return decimal age
  const dayOfYear = d => {
    const start = new Date(d.getFullYear(), 0, 0);
    return Math.floor((d - start) / (1000 * 60 * 60 * 24));
  };

  const dayDiff = dayOfYear(today) - dayOfYear(birth);
  return age + (dayDiff / 365.25);
}

/**
 * Extract Pluto sign from chart
 * @param {Object} chart - Chart with planets array
 * @returns {string|null} Pluto sign
 */
function extractPlutoSign(chart) {
  if (!chart || !chart.planets) return null;

  // Handle array format
  if (Array.isArray(chart.planets)) {
    const pluto = chart.planets.find(p =>
      (p.name || p.planet || '').toLowerCase() === 'pluto'
    );
    return pluto ? (pluto.sign || pluto.Sign) : null;
  }

  // Handle object format
  if (chart.planets.Pluto || chart.planets.pluto) {
    const p = chart.planets.Pluto || chart.planets.pluto;
    return p.sign || p.Sign;
  }

  return null;
}

/**
 * Build Saturn phase markers for timeline UX
 * @param {string} birthDateISO - Birth date
 * @param {Array} phases - Saturn phases
 * @returns {Array} Phase markers with dates
 */
function buildSaturnPhaseMarkers(birthDateISO, phases) {
  if (!birthDateISO) return [];

  const birthDate = new Date(birthDateISO);
  const today = new Date();
  const age = calculateAge(birthDateISO);

  return phases.map(phase => {
    const phaseDate = new Date(birthDate);
    phaseDate.setFullYear(birthDate.getFullYear() + Math.floor(phase.exactAgeYears));

    // Add fractional year as days
    const fractionalDays = (phase.exactAgeYears % 1) * 365.25;
    phaseDate.setDate(phaseDate.getDate() + Math.round(fractionalDays));

    const isPast = phaseDate < today;
    const isCurrent = age >= phase.ageWindowYears[0] && age <= phase.ageWindowYears[1];
    const yearsUntil = phase.exactAgeYears - age;

    return {
      key: phase.key,
      label: phase.label,
      exactDate: phaseDate.toISOString().split('T')[0],
      exactAge: phase.exactAgeYears,
      window: phase.ageWindowYears,
      isPast,
      isCurrent,
      yearsUntil: isPast ? null : yearsUntil
    };
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build complete Saturn Journey profile from chart
 *
 * @param {Object} chart - Chart object with:
 *   - birthDateISO: string (e.g., "1983-07-06")
 *   - planets: Array of { name, sign, house } or object { Saturn: { sign, house } }
 *   - aspects: Array of { p1/planet1, p2/planet2, type }
 *   - saturnReturnWindows: (optional) pre-computed windows
 *
 * @returns {Object} Complete Saturn Journey profile
 */
export function buildSaturnJourneyProfile(chart) {
  // Extract Saturn data
  const saturn = getSaturn(chart);
  const saturnSign = saturn.sign;
  const saturnHouse = saturn.house;

  // Detect aspect keys
  const aspectKeys = detectSaturnAspectKeys(chart.aspects || []);
  const aspectComplexes = aspectKeys
    .map(k => ({ key: k, ...SATURN_ASPECT_COMPLEXES[k] }))
    .filter(Boolean);

  // Get sign profile
  const signProfile = getSaturnSignProfile(saturnSign);

  // Get house overlay
  const houseOverlay = saturnHouse ? getSaturnHouseOverlay(saturnHouse) : null;

  // Get combined archetype (sign + house)
  const combinedArchetype = saturnHouse ? getSaturnArchetype(saturnSign, saturnHouse) : null;
  const mythicTitle = saturnHouse ? getSaturnMythicTitle(saturnSign, saturnHouse) : null;

  // Merge sign + house for comprehensive wound/defense/gift
  const mergedProfile = saturnHouse ? mergeSaturnHouseWithSign(saturnHouse, signProfile) : null;

  // 1) Narrative (sign + house + aspects)
  const narrativeInput = {
    saturn: {
      sign: saturnSign,
      house: saturnHouse,
      degree: saturn.degree,
      isRetrograde: saturn.isRetrograde
    },
    wound: signProfile?.wound,
    defenses: signProfile?.defenses,
    gift: signProfile?.gift,
    turningPoint: signProfile?.turningPoint,
    houseOverlay,
    aspectComplexes
  };
  const narrative = buildSaturnJourneyNarrative(narrativeInput);

  // 2) Shadow profile (house + aspects)
  const shadowProfile = saturnHouse
    ? buildSaturnShadowProfile(saturnHouse, aspectKeys)
    : null;

  // 3) Return report
  const returnWindows = chart.saturnReturnWindows ||
    (chart.birthDateISO ? calculateSaturnReturnWindows(chart.birthDateISO) : []);

  const returnStatus = chart.birthDateISO
    ? checkSaturnReturnStatus(chart.birthDateISO)
    : null;

  const returnReport = (chart.birthDateISO && saturnHouse)
    ? generateSaturnReturnReport(
        saturnHouse,
        saturnSign,
        chart.birthDateISO,
        returnStatus?.returnNumber || 1
      )
    : null;

  // 4) Cathedral chamber (house)
  const cathedralChamber = saturnHouse ? getSaturnChamber(saturnHouse) : null;

  // 5) Phase markers (timeline UX)
  const phaseMarkers = buildSaturnPhaseMarkers(chart.birthDateISO, SATURN_PHASES);

  // 6) Luna responses (house + aspects + prompts)
  const journalingPrompts = saturnHouse ? getJournalingPrompts(saturnHouse) : [];
  const triggers = saturnHouse ? getLunaTriggers(saturnHouse) : [];
  const innerCriticScripts = saturnHouse ? getInnerCriticScriptsForHouse(saturnHouse) : [];

  const lunaResponses = shadowProfile
    ? buildLunaSaturnResponses({
        house: saturnHouse,
        sign: saturnSign,
        shadowProfile,
        aspectComplexes
      })
    : null;

  // 7) Calculate current age and cycle position
  const age = calculateAge(chart.birthDateISO);
  const cyclePosition = age !== null ? {
    position: (age % SATURN_ORBIT_YEARS) / SATURN_ORBIT_YEARS,
    cycleNumber: Math.floor(age / SATURN_ORBIT_YEARS) + 1,
    degreesComplete: ((age % SATURN_ORBIT_YEARS) / SATURN_ORBIT_YEARS) * 360,
    yearsIntoCurrentCycle: age % SATURN_ORBIT_YEARS
  } : null;

  // 8) Relationship Dynamics (Liz Greene's "Relating")
  const relationshipDynamics = (saturnSign && saturnHouse)
    ? buildSaturnRelationshipDynamics(saturnSign, saturnHouse, aspectComplexes)
    : null;

  // ═══════════════════════════════════════════════════════════════════════
  // ASTROLOGY OF FATE MODULES (Liz Greene's "The Astrology of Fate")
  // ═══════════════════════════════════════════════════════════════════════

  // 9) Fate Threads (mythic storylines from chart)
  const fateThreads = buildFateThreads(chart);

  // 10) Fate Archetype (Saturn + Pluto combination)
  const plutoSign = extractPlutoSign(chart);
  const fateArchetype = (saturnSign && plutoSign)
    ? assignArchetype(saturnSign, plutoSign)
    : null;

  // 11) Life Crossroads Detection
  const crossroads = chart.birthDateISO
    ? detectCrossroads(chart.birthDateISO)
    : null;

  // 12) Fate vs Choice Index
  const fateChoiceIndex = computeFateChoiceIndex(chart);

  // ═══════════════════════════════════════════════════════════════════════
  // RETURN COMPLETE PROFILE
  // ═══════════════════════════════════════════════════════════════════════

  return {
    // Core Saturn data
    saturnSign,
    saturnHouse,
    saturnDegree: saturn.degree,
    isRetrograde: saturn.isRetrograde,

    // Sign profile
    signProfile,

    // House overlay
    houseOverlay,

    // Combined archetype
    combinedArchetype,
    mythicTitle,

    // Merged profile (sign + house)
    mergedProfile,

    // Aspect data
    aspectKeys,
    aspectComplexes,

    // Generated content
    narrative,
    shadowProfile,
    returnReport,
    returnStatus,
    returnWindows,
    cathedralChamber,
    phaseMarkers,

    // Luna integration
    lunaResponses,
    triggers,
    journalingPrompts,
    innerCriticScripts,

    // Relationship dynamics (Liz Greene's "Relating")
    relationshipDynamics,

    // Astrology of Fate (Liz Greene's "The Astrology of Fate")
    fateThreads,
    fateArchetype,
    crossroads,
    fateChoiceIndex,

    // Age and cycle
    age,
    cyclePosition,

    // Metadata
    metadata: {
      saturnOrbitYears: SATURN_ORBIT_YEARS,
      hasSignProfile: !!signProfile,
      hasHouseOverlay: !!houseOverlay,
      hasCathedralChamber: !!cathedralChamber,
      aspectComplexCount: aspectComplexes.length,
      hasShadowProfile: !!shadowProfile,
      hasReturnReport: !!returnReport,
      hasRelationshipDynamics: !!relationshipDynamics,
      hasFateThreads: !!fateThreads,
      hasFateArchetype: !!fateArchetype,
      hasCrossroads: !!crossroads,
      hasFateChoiceIndex: !!fateChoiceIndex,
      isInReturn: returnStatus?.inReturn || false,
      isApproachingReturn: returnStatus?.approaching || false,
      isInCrossroads: crossroads?.active?.length > 0 || false,
      fateScore: fateChoiceIndex?.fateScore || null
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Quick build from minimal data
 * @param {string} sign - Saturn sign
 * @param {number} house - Saturn house
 * @param {string} birthDateISO - Optional birth date
 * @param {Array} aspects - Optional aspects array
 * @returns {Object} Saturn Journey profile
 */
export function buildSaturnJourneyQuick(sign, house, birthDateISO = null, aspects = []) {
  return buildSaturnJourneyProfile({
    birthDateISO,
    planets: [{ name: 'Saturn', sign, house }],
    aspects
  });
}

/**
 * Build from western astrology result
 * @param {Object} westernResult - Result from western astrology calculation
 * @param {string} birthDateISO - Birth date
 * @returns {Object} Saturn Journey profile
 */
export function buildSaturnJourneyFromWestern(westernResult, birthDateISO) {
  // Convert western result format to chart format
  const planets = [];

  if (westernResult.planets) {
    for (const [name, data] of Object.entries(westernResult.planets)) {
      planets.push({
        name,
        sign: data.sign || data.Sign,
        house: data.house || data.House,
        degree: data.degree || data.longitude
      });
    }
  }

  return buildSaturnJourneyProfile({
    birthDateISO,
    planets,
    aspects: westernResult.aspects || []
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  buildSaturnJourneyProfile,
  buildSaturnJourneyQuick,
  buildSaturnJourneyFromWestern,
  // Re-export helpers for direct access
  buildSaturnPhaseMarkers,
  detectSaturnAspectKeys,
  calculateAge,
  // Relationship dynamics
  buildSaturnRelationshipDynamics,
  getRelationshipQuickSummary,
  detectRelationalTrigger,
  // Astrology of Fate
  buildFateThreads,
  assignArchetype,
  detectCrossroads,
  computeFateChoiceIndex
};
