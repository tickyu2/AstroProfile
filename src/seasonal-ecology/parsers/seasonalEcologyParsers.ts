/**
 * GENESIS - Seasonal Ecological Psychology Engine
 * Zod Parsers for Runtime Validation
 */

import {
  SeasonImprintSchema,
  ElementProfileSchema,
  ModalityProfileSchema,
  AttachmentProfileSchema,
  EcologicalFrameSchema,
  SeasonalPersonalityPanelSchema,
  SignPersonalityProfileSchema,
  ScienceNoteContentSchema
} from '../schemas/seasonalEcologySchemas';

import type {
  SeasonImprint,
  ElementProfile,
  ModalityProfile,
  AttachmentProfile,
  EcologicalFrame,
  SeasonalPersonalityPanel,
  SignPersonalityProfile,
  ScienceNoteContent
} from '../types/seasonalEcology';

// ============================================================================
// INDIVIDUAL PARSERS
// ============================================================================

export function parseSeasonImprint(data: unknown): SeasonImprint {
  return SeasonImprintSchema.parse(data);
}

export function parseElementProfile(data: unknown): ElementProfile {
  return ElementProfileSchema.parse(data);
}

export function parseModalityProfile(data: unknown): ModalityProfile {
  return ModalityProfileSchema.parse(data);
}

export function parseAttachmentProfile(data: unknown): AttachmentProfile {
  return AttachmentProfileSchema.parse(data);
}

export function parseEcologicalFrame(data: unknown): EcologicalFrame {
  return EcologicalFrameSchema.parse(data);
}

export function parseSeasonalPersonalityPanel(data: unknown): SeasonalPersonalityPanel {
  return SeasonalPersonalityPanelSchema.parse(data);
}

export function parseSignPersonalityProfile(data: unknown): SignPersonalityProfile {
  return SignPersonalityProfileSchema.parse(data);
}

export function parseScienceNoteContent(data: unknown): ScienceNoteContent {
  return ScienceNoteContentSchema.parse(data);
}

// ============================================================================
// SAFE PARSERS (return null on failure)
// ============================================================================

export function safeParseSeasonImprint(data: unknown): SeasonImprint | null {
  const result = SeasonImprintSchema.safeParse(data);
  return result.success ? result.data : null;
}

export function safeParseSeasonalPersonalityPanel(data: unknown): SeasonalPersonalityPanel | null {
  const result = SeasonalPersonalityPanelSchema.safeParse(data);
  return result.success ? result.data : null;
}

export function safeParseSignPersonalityProfile(data: unknown): SignPersonalityProfile | null {
  const result = SignPersonalityProfileSchema.safeParse(data);
  return result.success ? result.data : null;
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function isValidSeasonImprint(data: unknown): data is SeasonImprint {
  return SeasonImprintSchema.safeParse(data).success;
}

export function isValidSeasonalPersonalityPanel(data: unknown): data is SeasonalPersonalityPanel {
  return SeasonalPersonalityPanelSchema.safeParse(data).success;
}

export function isValidSignPersonalityProfile(data: unknown): data is SignPersonalityProfile {
  return SignPersonalityProfileSchema.safeParse(data).success;
}
