/**
 * Retrograde Analysis Service
 *
 * JavaScript wrapper for the TypeScript Retrograde Behavioral Matrix engine.
 * Provides easy integration with existing React components and profiles.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

// Import from TypeScript engine
import {
  analyzeRetrogrades,
  computeInternalAuthorityProfile,
  computeRetrogradeSynastryScore,
  computeRelationshipDynamics,
  analyzeRelationshipCompatibility,
  generateNarratives,
  generateSystemPromptSection,
  applyRetrogradeDecisionModifier,
  quickRetrogradeAnalysis,
  fromSovereignChart,
  getRetrogradeProfile,
  RetrogradeMatrix,
  PLANET_SYMBOLS,
  ALL_PLANETS,
  // Relationship Outcome imports
  getRelationshipOutcome,
  getRelationshipNarrative,
  getNarrativeInTone,
  getNarrativeVoice,
  getPilgrimJourneyStep,
  quickRelationshipCheck,
  getAllOutcomeOptions,
  getOutcomeColor,
  getOutcomeGradient,
  RelationshipOutcomeNarratives,
  mapScoreToRelationshipOutcome,
  // Persona Voice imports
  RelationshipPersonaVoices,
  RelationshipOutcomeAnimations,
  selectTone,
  selectPersonaRole,
  buildPersonaBundle,
  getPersonaVoice,
  getAnimationCue,
  getAllPersonaVoices,
  PersonaRoleMetadataMap,
  getPersonaRoleMetadata,
  // Pilgrim Journey imports
  PilgrimJourneySteps,
  OutcomeToStepId,
  StepIdToOutcome,
  CathedralChambers,
  getPilgrimStep,
  getPilgrimStepByOutcome,
  getStepIndex,
  calculateProgress,
  createJourneyState,
  updateJourneyState,
  getJourneyNarrative,
  getMythicLocation,
  getChamberMetadata
} from '../engines/retrograde';

// ========================================
// PROFILE INTEGRATION
// ========================================

/**
 * Analyze retrogrades from a profile's calculations
 *
 * @param {Object} profile - User profile with calculations.western.planets
 * @returns {Object} Full retrograde analysis
 */
export function analyzeProfileRetrogrades(profile) {
  if (!profile?.calculations?.western?.planets) {
    console.warn('Profile has no planetary data for retrograde analysis');
    return null;
  }

  // Convert profile planets to PlanetState format
  const planets = convertProfilePlanets(profile.calculations.western.planets);

  // Get ascendant if available
  const ascendant = profile.calculations?.western?.rising
    ? {
        sign: profile.calculations.western.rising.sign,
        degree: profile.calculations.western.rising.degree || 0
      }
    : undefined;

  // Check for Sun-Uranus conjunction
  const sunUranusConjunct = checkSunUranusConjunction(profile.calculations.western);

  return analyzeRetrogrades(planets, ascendant, sunUranusConjunct);
}

/**
 * Convert profile's planet data to PlanetState array
 */
function convertProfilePlanets(planets) {
  const planetMap = {
    mercury: 'Mercury',
    venus: 'Venus',
    mars: 'Mars',
    jupiter: 'Jupiter',
    saturn: 'Saturn',
    uranus: 'Uranus',
    neptune: 'Neptune',
    pluto: 'Pluto'
  };

  const states = [];

  for (const [key, planet] of Object.entries(planets || {})) {
    const planetName = planetMap[key];
    if (!planetName || !planet) continue;

    states.push({
      planet: planetName,
      sign: planet.sign || '',
      degree: planet.degree || 0,
      house: planet.house || 0,
      isRetrograde: planet.isRetrograde === true
    });
  }

  return states;
}

/**
 * Check if profile has Sun-Uranus conjunction (within 10° orb)
 */
function checkSunUranusConjunction(western) {
  const sun = western?.sun;
  const uranus = western?.planets?.uranus;

  if (!sun || !uranus) return false;
  if (sun.sign !== uranus.sign) return false;

  const orb = Math.abs((sun.degree || 0) - (uranus.degree || 0));
  return orb <= 10;
}

// ========================================
// QUICK ANALYSIS
// ========================================

/**
 * Quick retrograde count and summary for a profile
 *
 * @param {Object} profile - User profile
 * @returns {Object} Quick analysis with count, intensity, headline
 */
export function quickProfileRetrogradeAnalysis(profile) {
  const planets = convertProfilePlanets(profile?.calculations?.western?.planets);
  return quickRetrogradeAnalysis(planets);
}

/**
 * Get retrograde count for a profile
 */
export function getProfileRetrogradeCount(profile) {
  const planets = convertProfilePlanets(profile?.calculations?.western?.planets);
  return planets.filter(p => p.isRetrograde).length;
}

/**
 * Check if specific planet is retrograde in profile
 */
export function isProfilePlanetRetrograde(profile, planet) {
  const planets = convertProfilePlanets(profile?.calculations?.western?.planets);
  const found = planets.find(p => p.planet === planet);
  return found?.isRetrograde ?? false;
}

// ========================================
// SYNASTRY & COMPATIBILITY
// ========================================

/**
 * Calculate retrograde synastry between two profiles
 *
 * @param {Object} profile1 - First profile
 * @param {Object} profile2 - Second profile
 * @returns {Object} Synastry analysis
 */
export function calculateRetrogradeSynastry(profile1, profile2) {
  const planets1 = convertProfilePlanets(profile1?.calculations?.western?.planets);
  const planets2 = convertProfilePlanets(profile2?.calculations?.western?.planets);

  return computeRetrogradeSynastryScore(planets1, planets2);
}

/**
 * Full relationship compatibility based on retrogrades
 *
 * @param {Object} profile1 - First profile
 * @param {Object} profile2 - Second profile
 * @returns {Object} Compatibility analysis
 */
export function calculateRetrogradeCompatibility(profile1, profile2) {
  const planets1 = convertProfilePlanets(profile1?.calculations?.western?.planets);
  const planets2 = convertProfilePlanets(profile2?.calculations?.western?.planets);

  return analyzeRelationshipCompatibility(planets1, planets2);
}

// ========================================
// DECISION ANALYSIS
// ========================================

/**
 * Apply retrograde modifiers to a decision
 *
 * @param {Object} profile - User profile
 * @param {number} baseScore - Base decision score (0-1)
 * @param {Object} context - Decision context
 * @returns {number} Modified score
 */
export function applyProfileDecisionModifier(profile, baseScore, context) {
  const planets = convertProfilePlanets(profile?.calculations?.western?.planets);
  return applyRetrogradeDecisionModifier(baseScore, planets, context);
}

// ========================================
// RELATIONSHIP DYNAMICS
// ========================================

/**
 * Get relationship dynamics profile based on retrogrades
 *
 * @param {Object} profile - User profile
 * @returns {Object} Relationship dynamics
 */
export function getProfileRelationshipDynamics(profile) {
  const planets = convertProfilePlanets(profile?.calculations?.western?.planets);
  return computeRelationshipDynamics(planets);
}

// ========================================
// INTERNAL AUTHORITY PROFILE
// ========================================

/**
 * Compute Internal Authority Profile for a user
 *
 * @param {Object} profile - User profile
 * @returns {Object} IAP with score, tier, summary
 */
export function getInternalAuthorityProfile(profile) {
  const planets = convertProfilePlanets(profile?.calculations?.western?.planets);
  return computeInternalAuthorityProfile(planets);
}

// ========================================
// NARRATIVES & AI INTEGRATION
// ========================================

/**
 * Generate narrative templates for AI personas
 *
 * @param {Object} profile - User profile
 * @returns {Object} Narrative templates
 */
export function getProfileNarratives(profile) {
  const planets = convertProfilePlanets(profile?.calculations?.western?.planets);
  return generateNarratives(planets);
}

/**
 * Generate system prompt section for AI
 *
 * @param {Object} profile - User profile
 * @returns {string} Formatted system prompt section
 */
export function getProfileSystemPromptSection(profile) {
  const planets = convertProfilePlanets(profile?.calculations?.western?.planets);
  const ascendant = profile?.calculations?.western?.rising
    ? {
        sign: profile.calculations.western.rising.sign,
        degree: profile.calculations.western.rising.degree || 0
      }
    : undefined;

  return generateSystemPromptSection(planets, ascendant);
}

// ========================================
// PLANET INFO
// ========================================

/**
 * Get retrograde profile for a specific planet
 */
export function getPlanetRetrogradeProfile(planet) {
  return getRetrogradeProfile(planet);
}

/**
 * Get all planet profiles
 */
export function getAllPlanetProfiles() {
  return Object.entries(RetrogradeMatrix).map(([planet, profile]) => ({
    planet,
    symbol: PLANET_SYMBOLS[planet],
    ...profile
  }));
}

// ========================================
// RELATIONSHIP OUTCOMES
// ========================================

/**
 * Get full relationship outcome with mythic narratives
 *
 * @param {Object} profile1 - First profile (self)
 * @param {Object} profile2 - Second profile (partner)
 * @param {Object} baseInputs - Base relationship inputs { synastryScore, compositeScore, timingScore }
 * @param {Object} context - Decision context { topic, urgency, riskTolerance, emotionalWeight }
 * @returns {Object} Full relationship analysis with outcome, narratives, and breakdown
 */
export function getProfileRelationshipOutcome(profile1, profile2, baseInputs = {}, context = {}) {
  const planets1 = convertProfilePlanets(profile1?.calculations?.western?.planets);
  const planets2 = convertProfilePlanets(profile2?.calculations?.western?.planets);

  const base = {
    synastryScore: baseInputs.synastryScore ?? 0,
    compositeScore: baseInputs.compositeScore ?? 0.5,
    timingScore: baseInputs.timingScore ?? 0.5
  };

  const ctx = {
    topic: 'relationship',
    urgency: context.urgency ?? 0.5,
    riskTolerance: context.riskTolerance ?? 0.5,
    externalPressure: context.externalPressure ?? 0.3,
    emotionalWeight: context.emotionalWeight ?? 0.5,
    relationshipType: context.relationshipType ?? 'existing'
  };

  return getRelationshipOutcome(planets1, planets2, base, ctx);
}

/**
 * Quick relationship check without full analysis
 *
 * @param {Object} profile1 - First profile
 * @param {Object} profile2 - Second profile
 * @param {number} synastryScore - Optional synastry score (-1 to 1)
 * @returns {Object} Quick result with outcome, title, icon
 */
export function quickProfileRelationshipCheck(profile1, profile2, synastryScore = 0) {
  const planets1 = convertProfilePlanets(profile1?.calculations?.western?.planets);
  const planets2 = convertProfilePlanets(profile2?.calculations?.western?.planets);

  return quickRelationshipCheck(planets1, planets2, synastryScore);
}

/**
 * Get narrative for a specific outcome in a specific tone
 *
 * @param {string} outcome - DoNow | GoodWindow | Neutral | Delay | Avoid
 * @param {string} tone - gentle | direct | poetic | clinical
 * @returns {string} Narrative text
 */
export function getOutcomeNarrativeInTone(outcome, tone) {
  return getNarrativeInTone(outcome, tone);
}

/**
 * Get narrative in a specific voice (codex, persona, mythic)
 *
 * @param {string} outcome - DoNow | GoodWindow | Neutral | Delay | Avoid
 * @param {string} voice - codex | persona | mythic
 * @returns {string} Narrative text
 */
export function getOutcomeNarrativeVoice(outcome, voice) {
  return getNarrativeVoice(outcome, voice);
}

/**
 * Get pilgrim journey step for outcome
 *
 * @param {string} outcome - Outcome tier
 * @returns {string} Pilgrim journey narrative
 */
export function getOutcomePilgrimStep(outcome) {
  return getPilgrimJourneyStep(outcome);
}

/**
 * Get full UI narrative block for an outcome
 *
 * @param {string} outcome - Outcome tier
 * @returns {Object} Full UI narrative block
 */
export function getOutcomeUIBlock(outcome) {
  return getRelationshipNarrative(outcome);
}

// ========================================
// DISPLAY HELPERS
// ========================================

/**
 * Format retrograde list for display
 */
export function formatRetrogradeList(profile) {
  const planets = convertProfilePlanets(profile?.calculations?.western?.planets);
  const retrograde = planets.filter(p => p.isRetrograde);

  if (retrograde.length === 0) {
    return 'No retrograde planets';
  }

  return retrograde.map(p => `${PLANET_SYMBOLS[p.planet]} ${p.planet} Rx`).join(', ');
}

/**
 * Get authority tier label
 */
export function getAuthorityTierLabel(tier) {
  const labels = {
    external: 'Externally Oriented',
    balanced: 'Balanced Authority',
    internal: 'Internal Authority',
    autonomous: 'Autonomous',
    sovereign: 'Self-Sovereign'
  };
  return labels[tier] || tier;
}

/**
 * Get authority tier color class
 */
export function getAuthorityTierColor(tier) {
  const colors = {
    external: 'text-blue-400',
    balanced: 'text-green-400',
    internal: 'text-amber-400',
    autonomous: 'text-orange-400',
    sovereign: 'text-purple-400'
  };
  return colors[tier] || 'text-white';
}

// ========================================
// EXPORTS FOR DIRECT ENGINE ACCESS
// ========================================

export {
  PLANET_SYMBOLS,
  ALL_PLANETS,
  RetrogradeMatrix,
  // Re-export engine functions for direct access
  analyzeRetrogrades,
  computeInternalAuthorityProfile,
  computeRetrogradeSynastryScore,
  computeRelationshipDynamics,
  analyzeRelationshipCompatibility,
  generateNarratives,
  generateSystemPromptSection,
  applyRetrogradeDecisionModifier,
  quickRetrogradeAnalysis,
  fromSovereignChart,
  getRetrogradeProfile,
  // Relationship Outcome exports
  getRelationshipOutcome,
  getRelationshipNarrative,
  getNarrativeInTone,
  getNarrativeVoice,
  getPilgrimJourneyStep,
  quickRelationshipCheck,
  getAllOutcomeOptions,
  getOutcomeColor,
  getOutcomeGradient,
  RelationshipOutcomeNarratives,
  mapScoreToRelationshipOutcome,
  // Persona Voice exports
  RelationshipPersonaVoices,
  RelationshipOutcomeAnimations,
  selectTone,
  selectPersonaRole,
  buildPersonaBundle,
  getPersonaVoice,
  getAnimationCue,
  getAllPersonaVoices,
  PersonaRoleMetadataMap,
  getPersonaRoleMetadata,
  // Pilgrim Journey exports
  PilgrimJourneySteps,
  OutcomeToStepId,
  StepIdToOutcome,
  CathedralChambers,
  getPilgrimStep,
  getPilgrimStepByOutcome,
  getStepIndex,
  calculateProgress,
  createJourneyState,
  updateJourneyState,
  getJourneyNarrative,
  getMythicLocation,
  getChamberMetadata
};

export default {
  analyzeProfileRetrogrades,
  quickProfileRetrogradeAnalysis,
  getProfileRetrogradeCount,
  isProfilePlanetRetrograde,
  calculateRetrogradeSynastry,
  calculateRetrogradeCompatibility,
  applyProfileDecisionModifier,
  getProfileRelationshipDynamics,
  getInternalAuthorityProfile,
  getProfileNarratives,
  getProfileSystemPromptSection,
  getPlanetRetrogradeProfile,
  getAllPlanetProfiles,
  formatRetrogradeList,
  getAuthorityTierLabel,
  getAuthorityTierColor,
  // Relationship Outcome exports
  getProfileRelationshipOutcome,
  quickProfileRelationshipCheck,
  getOutcomeNarrativeInTone,
  getOutcomeNarrativeVoice,
  getOutcomePilgrimStep,
  getOutcomeUIBlock,
  getAllOutcomeOptions,
  getOutcomeColor,
  getOutcomeGradient,
  // Persona Voice exports
  RelationshipPersonaVoices,
  RelationshipOutcomeAnimations,
  selectTone,
  selectPersonaRole,
  buildPersonaBundle,
  getPersonaVoice,
  getAnimationCue,
  getAllPersonaVoices,
  PersonaRoleMetadataMap,
  getPersonaRoleMetadata,
  // Pilgrim Journey exports
  PilgrimJourneySteps,
  OutcomeToStepId,
  StepIdToOutcome,
  CathedralChambers,
  getPilgrimStep,
  getPilgrimStepByOutcome,
  getStepIndex,
  calculateProgress,
  createJourneyState,
  updateJourneyState,
  getJourneyNarrative,
  getMythicLocation,
  getChamberMetadata,
  PLANET_SYMBOLS,
  ALL_PLANETS
};
