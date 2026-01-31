/**
 * Pilgrim Journey Mapper
 *
 * Maps Greene's individuation stages to Pilgrim Journey chambers.
 * Provides the architectural translation between psychological
 * development and the Cathedral's chamber system.
 *
 * GENESIS AstroProfile - January 2026
 */

import {
  GREENE_INDIVIDUATION_STAGES,
  getStageById
} from "./greeneIndividuationEngine";

// ═══════════════════════════════════════════════════════════════════════════
// CHAMBER DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export const PILGRIM_CHAMBERS = {
  birth: {
    name: "Birth Chamber",
    symbol: "⟡",
    color: "purple",
    description: "Where the first stones of identity are laid",
    themes: ["origin", "imprint", "foundation", "innocence"]
  },
  foundations: {
    name: "Foundations Chamber",
    symbol: "☾",
    color: "slate",
    description: "Where the unseen structures live",
    themes: ["shadow", "hidden", "repressed", "subterranean"]
  },
  persona: {
    name: "Persona Chamber",
    symbol: "☿",
    color: "blue",
    description: "Where reflections multiply and distort",
    themes: ["masks", "mirrors", "projection", "relationship"]
  },
  ritual: {
    name: "Ritual Chamber",
    symbol: "🔥",
    color: "amber",
    description: "Where the psyche stages its initiations",
    themes: ["trial", "transformation", "guardian", "ceremony"]
  },
  ancestral: {
    name: "Ancestral Chamber",
    symbol: "⚰",
    color: "indigo",
    description: "Where lineage threads intertwine",
    themes: ["ancestry", "inheritance", "karma", "descent"]
  },
  mythos: {
    name: "Mythos Chamber",
    symbol: "✧",
    color: "gold",
    description: "Where destiny reveals itself",
    themes: ["symbol", "destiny", "Self", "revelation"]
  },
  sovereign: {
    name: "Sovereign Chamber",
    symbol: "♛",
    color: "red",
    description: "Where agency and authorship return",
    themes: ["authority", "choice", "alignment", "throne"]
  },
  completion: {
    name: "Completion Chamber",
    symbol: "∞",
    color: "cyan",
    description: "Where endings and beginnings touch",
    themes: ["spiral", "elixir", "wisdom", "legacy"]
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// MAPPING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map an individuation stage ID to its Pilgrim Journey chamber
 * @param {String} stageId - The Greene individuation stage ID
 * @returns {Object|null} - Chamber info with stage context
 */
export function mapIndividuationToPilgrimJourney(stageId) {
  const stage = getStageById(stageId);
  if (!stage) return null;

  const chamber = PILGRIM_CHAMBERS[stage.pilgrimChamber];
  if (!chamber) return null;

  return {
    stageId: stage.id,
    stageLabel: stage.label,
    chamber: stage.pilgrimChamber,
    chamberName: chamber.name,
    chamberSymbol: chamber.symbol,
    chamberColor: chamber.color,
    description: stage.description,
    chamberDescription: chamber.description,
    themes: chamber.themes,
    mapping: stage.mapping,
    jungianParallel: stage.jungianParallel,
    greeneInsight: stage.greeneInsight
  };
}

/**
 * Get the full journey path - all 8 stages in order
 * @returns {Array} - Array of stage-chamber mappings
 */
export function getFullPilgrimPath() {
  return GREENE_INDIVIDUATION_STAGES.map(stage => ({
    stageId: stage.id,
    stageLabel: stage.label,
    chamber: stage.pilgrimChamber,
    ...PILGRIM_CHAMBERS[stage.pilgrimChamber],
    ageRange: stage.ageRange,
    greeneInsight: stage.greeneInsight
  }));
}

/**
 * Get chamber details by chamber name
 * @param {String} chamberName - The chamber name (birth, foundations, etc.)
 * @returns {Object|null} - Chamber definition
 */
export function getChamberDetails(chamberName) {
  return PILGRIM_CHAMBERS[chamberName] || null;
}

/**
 * Find which stage corresponds to a given chamber
 * @param {String} chamberName - The chamber name
 * @returns {Object|null} - The Greene individuation stage
 */
export function getStageForChamber(chamberName) {
  return GREENE_INDIVIDUATION_STAGES.find(s => s.pilgrimChamber === chamberName) || null;
}

/**
 * Get the next chamber in the journey
 * @param {String} currentChamber - Current chamber name
 * @returns {Object|null} - Next chamber info or null if at completion
 */
export function getNextChamber(currentChamber) {
  const chamberOrder = ['birth', 'foundations', 'persona', 'ritual', 'ancestral', 'mythos', 'sovereign', 'completion'];
  const currentIndex = chamberOrder.indexOf(currentChamber);

  if (currentIndex === -1 || currentIndex >= chamberOrder.length - 1) {
    return null; // At completion or invalid
  }

  const nextChamberName = chamberOrder[currentIndex + 1];
  return {
    chamber: nextChamberName,
    ...PILGRIM_CHAMBERS[nextChamberName],
    stage: getStageForChamber(nextChamberName)
  };
}

/**
 * Get the previous chamber in the journey
 * @param {String} currentChamber - Current chamber name
 * @returns {Object|null} - Previous chamber info or null if at birth
 */
export function getPreviousChamber(currentChamber) {
  const chamberOrder = ['birth', 'foundations', 'persona', 'ritual', 'ancestral', 'mythos', 'sovereign', 'completion'];
  const currentIndex = chamberOrder.indexOf(currentChamber);

  if (currentIndex <= 0) {
    return null; // At birth or invalid
  }

  const prevChamberName = chamberOrder[currentIndex - 1];
  return {
    chamber: prevChamberName,
    ...PILGRIM_CHAMBERS[prevChamberName],
    stage: getStageForChamber(prevChamberName)
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  PILGRIM_CHAMBERS,
  mapIndividuationToPilgrimJourney,
  getFullPilgrimPath,
  getChamberDetails,
  getStageForChamber,
  getNextChamber,
  getPreviousChamber
};
