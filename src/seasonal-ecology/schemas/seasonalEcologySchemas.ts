/**
 * GENESIS - Zod Validation Schemas
 * Runtime type safety for API responses and data imports
 */

import { z } from "zod";

export const SeasonImprintSchema = z.object({
  code: z.enum(["spring", "summer", "autumn", "winter"]),
  name: z.string(),
  lightPattern: z.enum(["increasing", "peak", "declining", "minimal"]),
  psychologicalImprint: z.string(),
  environmentalNotes: z.string(),
  dateRange: z.string().optional()
});

export const TemperamentProfileSchema = z.object({
  drive: z.enum(["low", "medium", "high"]),
  stability: z.enum(["low", "medium", "high"]),
  cognitiveFlexibility: z.enum(["low", "medium", "high"]),
  emotionalSensitivity: z.enum(["low", "medium", "high", "variable"])
});

export const ElementProfileSchema = z.object({
  code: z.enum(["fire", "earth", "air", "water"]),
  name: z.string(),
  temperament: TemperamentProfileSchema,
  description: z.string(),
  neurochemicalBias: z.string().optional()
});

export const ModalityProfileSchema = z.object({
  code: z.enum(["cardinal", "fixed", "mutable"]),
  name: z.string(),
  chronotypeMapping: z.enum(["morning", "intermediate", "evening"]),
  momentumStyle: z.string(),
  energyPattern: z.string().optional()
});

export const AttachmentStyleSchema = z.enum([
  "secure",
  "anxious",
  "avoidant",
  "disorganized"
]);

export const AttachmentProfileSchema = z.object({
  inferredStyle: AttachmentStyleSchema,
  basis: z.object({
    modality: z.enum(["cardinal", "fixed", "mutable"]),
    element: z.enum(["fire", "earth", "air", "water"])
  }),
  notes: z.string(),
  disclaimer: z.string().optional()
});

export const EcologicalFrameSchema = z.object({
  summary: z.string(),
  keywords: z.array(z.string()),
  scientificBasis: z.array(z.string()).optional()
});

export const SeasonalPersonalityPanelSchema = z.object({
  season: SeasonImprintSchema,
  element: ElementProfileSchema,
  modality: ModalityProfileSchema,
  attachmentProfile: AttachmentProfileSchema.optional(),
  ecologicalFrame: EcologicalFrameSchema
});

export const SignPersonalityProfileSchema = z.object({
  sign: z.string(),
  symbol: z.string(),
  degreeRange: z.tuple([z.number(), z.number()]),
  panel: SeasonalPersonalityPanelSchema
});

export const ScienceNoteContentSchema = z.object({
  title: z.string(),
  content: z.string(),
  references: z.array(z.string()).optional()
});

export const ScienceNotesCollectionSchema = z.object({
  seasons: ScienceNoteContentSchema,
  modalities: ScienceNoteContentSchema,
  elements: ScienceNoteContentSchema,
  signs: ScienceNoteContentSchema,
  ecological: ScienceNoteContentSchema
});

// Inferred types for runtime-validated data
export type SeasonImprintSchemaType = z.infer<typeof SeasonImprintSchema>;
export type ElementProfileSchemaType = z.infer<typeof ElementProfileSchema>;
export type ModalityProfileSchemaType = z.infer<typeof ModalityProfileSchema>;
export type AttachmentProfileSchemaType = z.infer<typeof AttachmentProfileSchema>;
export type SeasonalPersonalityPanelSchemaType = z.infer<typeof SeasonalPersonalityPanelSchema>;
export type SignPersonalityProfileSchemaType = z.infer<typeof SignPersonalityProfileSchema>;
