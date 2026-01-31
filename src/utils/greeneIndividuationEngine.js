/**
 * Greene Individuation Engine
 *
 * Maps Liz Greene's 8 individuation stages to the Pilgrim Journey chambers.
 * Each stage represents a phase of psychological development with specific
 * architectural mappings for the Cathedral system.
 *
 * Based on:
 * - Liz Greene's depth psychological astrology
 * - Carl Jung's individuation process
 * - Joseph Campbell's Hero's Journey
 *
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// GREENE INDIVIDUATION STAGES
// ═══════════════════════════════════════════════════════════════════════════

export const GREENE_INDIVIDUATION_STAGES = [
  {
    id: "egoFormation",
    label: "Ego Formation",
    pilgrimChamber: "birth",
    ageRange: [0, 14],
    description: "Initial ego architecture, early complexes, parental introjects.",
    jungianParallel: "Ego development from collective unconscious",
    greeneInsight: "The first architecture is built without your consent, yet shapes everything that follows.",
    mapping: {
      birthPillars: true,
      foundationalStones: true,
      natalPersonaSeed: true
    },
    saturnRelevance: "Pre-first-square: Learning the rules of the world",
    planetaryRulers: ["Moon", "Saturn"],
    houseEmphasis: [1, 4, 10]
  },
  {
    id: "shadowEmergence",
    label: "Shadow Emergence",
    pilgrimChamber: "foundations",
    ageRange: [14, 22],
    description: "Shadow contents, repressed drives, defensive patterns.",
    jungianParallel: "First encounter with the personal unconscious",
    greeneInsight: "What you cannot see in yourself, you will meet in the world as fate.",
    mapping: {
      foundationFractures: true,
      subterraneanRooms: true,
      structuralTensionLines: true
    },
    saturnRelevance: "First opposition through third square: Testing boundaries",
    planetaryRulers: ["Pluto", "Mars"],
    houseEmphasis: [8, 12]
  },
  {
    id: "animaAnimus",
    label: "Anima / Animus Encounter",
    pilgrimChamber: "persona",
    ageRange: [22, 30],
    description: "Projection fields, relational archetypes, fantasy patterns.",
    jungianParallel: "Meeting the contrasexual other within",
    greeneInsight: "We fall in love with our own unlived qualities, projected onto another.",
    mapping: {
      personaMasks: true,
      mirrorHall: true,
      relationalComplexInputs: true
    },
    saturnRelevance: "Approaching first return: Who am I really?",
    planetaryRulers: ["Venus", "Moon"],
    houseEmphasis: [5, 7]
  },
  {
    id: "complexConfrontation",
    label: "Complex Confrontation",
    pilgrimChamber: "ritual",
    ageRange: [30, 37],
    description: "Activation of complexes, symbolic trials, guardian figures.",
    jungianParallel: "Direct engagement with autonomous complexes",
    greeneInsight: "A complex is an unlived part of yourself with its own agenda.",
    mapping: {
      ritualTrials: true,
      guardianForms: true,
      riteOfRebinding: true
    },
    saturnRelevance: "Post-first-return through fourth square: Testing the structure",
    planetaryRulers: ["Saturn", "Pluto"],
    houseEmphasis: [6, 8, 12]
  },
  {
    id: "underworldDescent",
    label: "Underworld Descent",
    pilgrimChamber: "ancestral",
    ageRange: [37, 44],
    description: "Lineage patterns, generational complexes, karmic descent.",
    jungianParallel: "Encounter with the collective unconscious",
    greeneInsight: "You carry your ancestors' unfinished business until you complete it.",
    mapping: {
      ancestralThreads: true,
      hypergraphNodes: true,
      underworldCorridor: true
    },
    saturnRelevance: "Neptune square, Uranus opposition: Dissolution and revolution",
    planetaryRulers: ["Pluto", "Neptune"],
    houseEmphasis: [4, 8, 12]
  },
  {
    id: "encounterSelf",
    label: "Encounter with the Self",
    pilgrimChamber: "mythos",
    ageRange: [44, 52],
    description: "Self symbols, archetypal revelation, destiny motifs.",
    jungianParallel: "Ego-Self axis establishment",
    greeneInsight: "The Self is not who you think you are, but who you are meant to become.",
    mapping: {
      mythicSigils: true,
      narrativeCodex: true,
      mythicVectorMap: true
    },
    saturnRelevance: "Second opposition through Chiron return: Purpose crisis and healing",
    planetaryRulers: ["Sun", "Jupiter"],
    houseEmphasis: [9, 10, 11]
  },
  {
    id: "reintegration",
    label: "Reintegration",
    pilgrimChamber: "sovereign",
    ageRange: [52, 60],
    description: "Agency, authorship, alignment with the Self.",
    jungianParallel: "Ego becomes servant of the Self",
    greeneInsight: "True authority comes from alignment, not assertion.",
    mapping: {
      sovereignThrone: true,
      crownedPersonas: true,
      sovereignTimeline: true
    },
    saturnRelevance: "Fifth square approaching second return: Wisdom harvest",
    planetaryRulers: ["Saturn", "Sun"],
    houseEmphasis: [10, 1]
  },
  {
    id: "individuatedLife",
    label: "Individuated Life",
    pilgrimChamber: "completion",
    ageRange: [60, 100],
    description: "Elixir, spiral return, mastery, next cycle.",
    jungianParallel: "Living the individuated life, preparing for death",
    greeneInsight: "Individuation never ends; it spirals ever deeper.",
    mapping: {
      spiralPath: true,
      completedCodexPage: true,
      nextJourneyPortal: true
    },
    saturnRelevance: "Second return and beyond: Elder wisdom",
    planetaryRulers: ["Saturn", "Neptune"],
    houseEmphasis: [11, 12]
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// STAGE DETERMINATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Determine which individuation stage the user is currently in.
 * Uses age as primary determinant, with Saturn cycles and outer planet
 * initiations as modifiers.
 *
 * @param {Object} profile - User profile with age, saturn cycle, outer planet data
 * @returns {String} - Stage ID
 */
export function determineIndividuationStage(profile) {
  const age = profile?.age || calculateAge(profile?.birthDate);

  if (!age || age < 0) return "egoFormation";

  // Find stage by age range
  for (const stage of GREENE_INDIVIDUATION_STAGES) {
    const [minAge, maxAge] = stage.ageRange;
    if (age >= minAge && age < maxAge) {
      return stage.id;
    }
  }

  // Default to final stage for ages >= 60
  return "individuatedLife";
}

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
  return age;
}

/**
 * Get full stage data by ID
 */
export function getStageById(stageId) {
  return GREENE_INDIVIDUATION_STAGES.find(s => s.id === stageId) || null;
}

/**
 * Get stage by chamber name
 */
export function getStageByChamber(chamberName) {
  return GREENE_INDIVIDUATION_STAGES.find(s => s.pilgrimChamber === chamberName) || null;
}

/**
 * Get all stages as a map for quick lookup
 */
export function getStagesMap() {
  const map = {};
  GREENE_INDIVIDUATION_STAGES.forEach(stage => {
    map[stage.id] = stage;
  });
  return map;
}

/**
 * Determine stage with enhanced context
 * Returns stage plus relevant Saturn and outer planet information
 */
export function determineIndividuationStageEnhanced(profile, saturnCycles, outerPlanetInitiations) {
  const stageId = determineIndividuationStage(profile);
  const stage = getStageById(stageId);
  const age = profile?.age || calculateAge(profile?.birthDate);

  // Find relevant Saturn cycle
  let currentSaturnPhase = null;
  if (saturnCycles) {
    for (const [key, cycle] of Object.entries(saturnCycles)) {
      const cycleAge = parseInt(cycle.age?.split('-')[0] || '0');
      if (Math.abs(age - cycleAge) <= 2) {
        currentSaturnPhase = { key, ...cycle };
        break;
      }
    }
  }

  // Find relevant outer planet initiation
  let currentInitiation = null;
  if (outerPlanetInitiations) {
    for (const [key, init] of Object.entries(outerPlanetInitiations)) {
      const initAge = parseInt(init.age?.toString().split('-')[0] || '0');
      if (Math.abs(age - initAge) <= 2) {
        currentInitiation = { key, ...init };
        break;
      }
    }
  }

  return {
    stageId,
    stage,
    age,
    saturnPhase: currentSaturnPhase,
    outerPlanetInitiation: currentInitiation,
    isTransitional: currentSaturnPhase !== null || currentInitiation !== null
  };
}

/**
 * Get Greene-style individuation context for a profile
 * @param {Object} params - { birthDate, westernData }
 * @returns {Object} - Complete individuation context
 */
export function getGreeneIndividuationContext({ birthDate, westernData }) {
  // Get basic individuation stage
  const stage = determineIndividuationStage({ birthDate, westernData });

  return {
    currentStage: stage,
    allStages: GREENE_INDIVIDUATION_STAGES,
    stagesMap: getStagesMap(),
    profile: {
      birthDate,
      hasWesternData: !!westernData
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  GREENE_INDIVIDUATION_STAGES,
  determineIndividuationStage,
  determineIndividuationStageEnhanced,
  getStageById,
  getStageByChamber,
  getStagesMap
};
