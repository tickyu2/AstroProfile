/**
 * GENESIS - Seasonal Ecological Psychology Engine
 * Factory Functions
 *
 * Provides:
 * - Strong typing with defaults
 * - Composable overrides
 * - Predictable object shapes
 * - Pre-configured presets
 */

import {
  SeasonImprint,
  ElementProfile,
  TemperamentProfile,
  ModalityProfile,
  AttachmentProfile,
  EcologicalFrame,
  SeasonalPersonalityPanel,
  SignPersonalityProfile
} from '../types/seasonalEcology';

// ============================================================================
// SEASON FACTORY
// ============================================================================

export function createSeasonImprint(
  overrides: Partial<SeasonImprint> = {}
): SeasonImprint {
  return {
    code: "spring",
    name: "Spring",
    lightPattern: "increasing",
    psychologicalImprint: "Emergence, activation, growth orientation",
    environmentalNotes: "Increasing light, rising temperatures, imprint of expansion.",
    dateRange: "MAR 20 – JUN 20",
    ...overrides
  };
}

// ============================================================================
// ELEMENT FACTORIES
// ============================================================================

export function createTemperamentProfile(
  overrides: Partial<TemperamentProfile> = {}
): TemperamentProfile {
  return {
    drive: "medium",
    stability: "medium",
    cognitiveFlexibility: "medium",
    emotionalSensitivity: "medium",
    ...overrides
  };
}

export function createElementProfile(
  overrides: Partial<ElementProfile> = {}
): ElementProfile {
  return {
    code: "fire",
    name: "Fire",
    temperament: createTemperamentProfile(),
    description: "Enthusiastic, initiating, motivated by inspiration and challenge.",
    neurochemicalBias: "dopamine-leaning",
    ...overrides
  };
}

// ============================================================================
// MODALITY FACTORY
// ============================================================================

export function createModalityProfile(
  overrides: Partial<ModalityProfile> = {}
): ModalityProfile {
  return {
    code: "cardinal",
    name: "Cardinal",
    chronotypeMapping: "morning",
    momentumStyle: "Initiates, front-loads energy, starts cycles.",
    energyPattern: "front-loads",
    ...overrides
  };
}

// ============================================================================
// ATTACHMENT FACTORY
// ============================================================================

export function createAttachmentProfile(
  overrides: Partial<AttachmentProfile> = {}
): AttachmentProfile {
  return {
    inferredStyle: "secure",
    basis: {
      modality: "fixed",
      element: "earth"
    },
    notes: "Stable, grounded, consistent in bonding patterns.",
    disclaimer: "This is a general tendency based on constitutional wiring, not a fixed diagnosis.",
    ...overrides
  };
}

// ============================================================================
// ECOLOGICAL FRAME FACTORY
// ============================================================================

export function createEcologicalFrame(
  overrides: Partial<EcologicalFrame> = {}
): EcologicalFrame {
  return {
    summary: "Environmental imprint: season + temperament + circadian momentum.",
    keywords: [
      "seasonal psychology",
      "environmental imprinting",
      "ecological temperament",
      "non-predictive astrology"
    ],
    scientificBasis: [
      "Seasonal Affective Imprinting",
      "Temperament Theory",
      "Circadian Chronotype",
      "Ecological Psychology"
    ],
    ...overrides
  };
}

// ============================================================================
// FULL SEASONAL PERSONALITY PANEL FACTORY
// ============================================================================

export function createSeasonalPersonalityPanel(
  overrides: Partial<SeasonalPersonalityPanel> = {}
): SeasonalPersonalityPanel {
  return {
    season: createSeasonImprint(),
    element: createElementProfile(),
    modality: createModalityProfile(),
    attachmentProfile: createAttachmentProfile(),
    ecologicalFrame: createEcologicalFrame(),
    ...overrides
  };
}

// ============================================================================
// SIGN-LEVEL FACTORY
// ============================================================================

export function createSignPersonalityProfile(
  sign: string,
  symbol: string,
  degreeRange: [number, number],
  panelOverrides: Partial<SeasonalPersonalityPanel> = {}
): SignPersonalityProfile {
  return {
    sign,
    symbol,
    degreeRange,
    panel: createSeasonalPersonalityPanel(panelOverrides)
  };
}

// ============================================================================
// CONVENIENCE PRESETS - SEASONS
// ============================================================================

export const seasonPresets = {
  spring: () => createSeasonImprint({
    code: "spring",
    name: "Spring",
    lightPattern: "increasing",
    psychologicalImprint: "Emergence, activation, growth orientation",
    environmentalNotes: "Increasing light, rising temperatures, early-life imprint of expansion.",
    dateRange: "MAR 20 – JUN 20"
  }),

  summer: () => createSeasonImprint({
    code: "summer",
    name: "Summer",
    lightPattern: "peak",
    psychologicalImprint: "Expression, outwardness, radiance",
    environmentalNotes: "Peak sunlight, maximum vitamin D, high-energy baseline.",
    dateRange: "JUN 21 – SEP 22"
  }),

  autumn: () => createSeasonImprint({
    code: "autumn",
    name: "Autumn",
    lightPattern: "declining",
    psychologicalImprint: "Preparation, depth, discernment",
    environmentalNotes: "Declining light, harvest energy, conservation wiring.",
    dateRange: "SEP 23 – DEC 20"
  }),

  winter: () => createSeasonImprint({
    code: "winter",
    name: "Winter",
    lightPattern: "minimal",
    psychologicalImprint: "Endurance, introspection, conservation",
    environmentalNotes: "Minimal light, low-energy baseline, depth-seeking patterns.",
    dateRange: "DEC 21 – MAR 19"
  })
};

// ============================================================================
// CONVENIENCE PRESETS - ELEMENTS
// ============================================================================

export const elementPresets = {
  fire: () => createElementProfile({
    code: "fire",
    name: "Fire",
    temperament: createTemperamentProfile({
      drive: "high",
      stability: "medium",
      cognitiveFlexibility: "medium",
      emotionalSensitivity: "variable"
    }),
    description: "Enthusiastic, initiating, motivated by inspiration and challenge.",
    neurochemicalBias: "dopamine-leaning"
  }),

  earth: () => createElementProfile({
    code: "earth",
    name: "Earth",
    temperament: createTemperamentProfile({
      drive: "medium",
      stability: "high",
      cognitiveFlexibility: "low",
      emotionalSensitivity: "low"
    }),
    description: "Grounded, practical, motivated by tangible results and stability.",
    neurochemicalBias: "serotonin-stable"
  }),

  air: () => createElementProfile({
    code: "air",
    name: "Air",
    temperament: createTemperamentProfile({
      drive: "medium",
      stability: "low",
      cognitiveFlexibility: "high",
      emotionalSensitivity: "low"
    }),
    description: "Analytical, communicative, motivated by ideas and connections.",
    neurochemicalBias: "cognitive-flexible"
  }),

  water: () => createElementProfile({
    code: "water",
    name: "Water",
    temperament: createTemperamentProfile({
      drive: "low",
      stability: "medium",
      cognitiveFlexibility: "medium",
      emotionalSensitivity: "high"
    }),
    description: "Empathetic, intuitive, motivated by emotional depth and meaning.",
    neurochemicalBias: "limbic-sensitive"
  })
};

// ============================================================================
// CONVENIENCE PRESETS - MODALITIES
// ============================================================================

export const modalityPresets = {
  cardinal: () => createModalityProfile({
    code: "cardinal",
    name: "Cardinal",
    chronotypeMapping: "morning",
    momentumStyle: "Initiates, front-loads energy, starts cycles.",
    energyPattern: "front-loads"
  }),

  fixed: () => createModalityProfile({
    code: "fixed",
    name: "Fixed",
    chronotypeMapping: "intermediate",
    momentumStyle: "Sustains, maintains steady rhythm, stabilizes.",
    energyPattern: "steady"
  }),

  mutable: () => createModalityProfile({
    code: "mutable",
    name: "Mutable",
    chronotypeMapping: "evening",
    momentumStyle: "Adapts, flexible rhythm, transitions cycles.",
    energyPattern: "flexible"
  })
};

// ============================================================================
// HELPER: Generate attachment from modality + element
// ============================================================================

export function generateAttachment(
  modality: ModalityProfile["code"],
  element: ElementProfile["code"]
): AttachmentProfile {
  // Cardinal + Fire/Water → Anxious
  if (modality === "cardinal" && (element === "fire" || element === "water")) {
    return createAttachmentProfile({
      inferredStyle: "anxious",
      basis: { modality, element },
      notes: "Tends to activate quickly in relationships, seeks reassurance and engagement."
    });
  }

  // Fixed + Air/Earth → Avoidant-leaning
  if (modality === "fixed" && (element === "air" || element === "earth")) {
    return createAttachmentProfile({
      inferredStyle: "avoidant",
      basis: { modality, element },
      notes: "Self-regulating, values independence, may create emotional distance."
    });
  }

  // Mutable + Water/Fire → Disorganized-leaning
  if (modality === "mutable" && (element === "water" || element === "fire")) {
    return createAttachmentProfile({
      inferredStyle: "disorganized",
      basis: { modality, element },
      notes: "Mixed signals in relationships, high emotional load, adaptive but sometimes conflicted."
    });
  }

  // Default → Secure
  return createAttachmentProfile({
    inferredStyle: "secure",
    basis: { modality, element },
    notes: "Stable, grounded, consistent in bonding patterns."
  });
}

// ============================================================================
// COMPLETE SIGN BUILDER (combines everything)
// ============================================================================

export function buildSignProfile(
  sign: string,
  symbol: string,
  degreeRange: [number, number],
  season: keyof typeof seasonPresets,
  element: keyof typeof elementPresets,
  modality: keyof typeof modalityPresets
): SignPersonalityProfile {
  const seasonData = seasonPresets[season]();
  const elementData = elementPresets[element]();
  const modalityData = modalityPresets[modality]();
  const attachmentData = generateAttachment(modality, element);

  return createSignPersonalityProfile(sign, symbol, degreeRange, {
    season: seasonData,
    element: elementData,
    modality: modalityData,
    attachmentProfile: attachmentData,
    ecologicalFrame: createEcologicalFrame()
  });
}
