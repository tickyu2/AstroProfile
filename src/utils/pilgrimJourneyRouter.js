/**
 * Pilgrim Journey Router
 *
 * Automatically loads the correct Pilgrim Journey script based on
 * the user's current individuation stage.
 *
 * GENESIS AstroProfile - January 2026
 */

import { determineIndividuationStage, getStageById } from "./greeneIndividuationEngine";
import { mapIndividuationToPilgrimJourney, PILGRIM_CHAMBERS } from "./pilgrimJourneyMapper";
import { PILGRIM_JOURNEY_SCRIPTS, getScript } from "../data/pilgrimJourneyScripts";

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ROUTER FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Returns the correct Pilgrim Journey script for the user.
 * @param {Object} profile - User profile with age/birthDate
 * @returns {Object} - Complete routing payload
 */
export function getPilgrimJourneyStage(profile) {
  const stageId = determineIndividuationStage(profile);
  const script = getScript(stageId);
  const stage = getStageById(stageId);
  const chamberMapping = mapIndividuationToPilgrimJourney(stageId);

  return {
    stageId,
    script,
    stage,
    chamber: script?.pilgrimChamber,
    chamberDetails: PILGRIM_CHAMBERS[script?.pilgrimChamber],
    mapping: chamberMapping
  };
}

/**
 * Get the full journey context for a user
 * Includes current stage, progress, and navigation
 * @param {Object} profile - User profile
 * @returns {Object} - Full journey context
 */
export function getFullJourneyContext(profile) {
  const { stageId, script, stage, chamber, chamberDetails, mapping } = getPilgrimJourneyStage(profile);

  // Calculate journey progress
  const stageOrder = [
    'egoFormation', 'shadowEmergence', 'animaAnimus', 'complexConfrontation',
    'underworldDescent', 'encounterSelf', 'reintegration', 'individuatedLife'
  ];
  const currentIndex = stageOrder.indexOf(stageId);
  const progress = ((currentIndex + 1) / stageOrder.length) * 100;

  // Get previous and next stages
  const previousStageId = currentIndex > 0 ? stageOrder[currentIndex - 1] : null;
  const nextStageId = currentIndex < stageOrder.length - 1 ? stageOrder[currentIndex + 1] : null;

  return {
    current: {
      stageId,
      script,
      stage,
      chamber,
      chamberDetails,
      mapping
    },
    navigation: {
      previousStage: previousStageId ? {
        stageId: previousStageId,
        script: getScript(previousStageId),
        stage: getStageById(previousStageId)
      } : null,
      nextStage: nextStageId ? {
        stageId: nextStageId,
        script: getScript(nextStageId),
        stage: getStageById(nextStageId)
      } : null
    },
    progress: {
      currentIndex,
      totalStages: stageOrder.length,
      percentage: progress,
      isComplete: stageId === 'individuatedLife'
    },
    allStages: stageOrder.map(id => ({
      stageId: id,
      label: getScript(id)?.label,
      chamber: getScript(id)?.pilgrimChamber,
      isCurrentOrPast: stageOrder.indexOf(id) <= currentIndex
    }))
  };
}

/**
 * Route to a specific stage (for manual navigation)
 * @param {String} stageId - The stage to route to
 * @returns {Object} - Stage routing payload
 */
export function routeToStage(stageId) {
  const script = getScript(stageId);
  const stage = getStageById(stageId);

  if (!script || !stage) {
    return null;
  }

  return {
    stageId,
    script,
    stage,
    chamber: script.pilgrimChamber,
    chamberDetails: PILGRIM_CHAMBERS[script.pilgrimChamber],
    mapping: mapIndividuationToPilgrimJourney(stageId)
  };
}

/**
 * Get routing metadata for Pilgrim Journey global router integration
 * @param {String} stageId - Current stage ID
 * @returns {Object} - Router metadata
 */
export function getRouterMetadata(stageId) {
  const mapping = mapIndividuationToPilgrimJourney(stageId);

  return {
    id: "greeneIndividuation",
    chamber: mapping?.chamber,
    stageId,
    description: mapping?.description,
    themes: mapping?.themes,
    jungianParallel: mapping?.jungianParallel,
    greeneInsight: mapping?.greeneInsight
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  getPilgrimJourneyStage,
  getFullJourneyContext,
  routeToStage,
  getRouterMetadata
};
