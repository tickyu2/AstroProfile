# GENESIS - BATCH 1: FOUNDATION LAYER
## Complete Implementation Package

**Total Files:** 5  
**Installation Time:** 30 minutes  
**Dependencies:** `zod`, `react-markdown`, `d3`, `@types/d3`

---

## 📂 FILE STRUCTURE

```
src/seasonal-ecology/
├── types/
│   └── seasonalEcology.ts (FILE 1)
├── schemas/
│   └── seasonalEcologySchemas.ts (FILE 2)
├── data/
│   ├── seasonalEcologyData.ts (FILE 3)
│   └── scienceContent.ts (FILE 5)
└── parsers/
    └── seasonalEcologyParsers.ts (FILE 4)
```

---

## 🚀 QUICK START

```bash
# 1. Install dependencies
npm install zod react-markdown d3 @types/d3

# 2. Create directory structure
mkdir -p src/seasonal-ecology/{types,schemas,data,parsers}

# 3. Copy each file below to its designated location

# 4. Verify compilation
npm run type-check
```

---

## FILE 1: types/seasonalEcology.ts

```typescript
/**
 * GENESIS - Seasonal Ecological Psychology Engine
 * TypeScript Type Definitions
 * 
 * Complete type system for constitutional analysis based on:
 * - Seasonal Affective Imprinting (environmental psychology)
 * - Temperament Theory (neurotransmitter sensitivity)
 * - Circadian Chronotype (timing preferences)
 * - Attachment Theory (relational patterns)
 * - Ecological Psychology (environmental shaping)
 */

// ============================================================================
// SEASON RING — Environmental Imprinting
// ============================================================================

export interface SeasonImprint {
  code: "spring" | "summer" | "autumn" | "winter";
  name: string;
  lightPattern: "increasing" | "peak" | "declining" | "minimal";
  psychologicalImprint: string;
  environmentalNotes: string;
  dateRange?: string;
}

// ============================================================================
// ELEMENT RING — Constitutional Temperament
// ============================================================================

export interface TemperamentProfile {
  drive: "low" | "medium" | "high";
  stability: "low" | "medium" | "high";
  cognitiveFlexibility: "low" | "medium" | "high";
  emotionalSensitivity: "low" | "medium" | "high" | "variable";
}

export interface ElementProfile {
  code: "fire" | "earth" | "air" | "water";
  name: string;
  temperament: TemperamentProfile;
  description: string;
  neurochemicalBias?: string;
}

// ============================================================================
// MODALITY RING — Circadian Momentum Style
// ============================================================================

export interface ModalityProfile {
  code: "cardinal" | "fixed" | "mutable";
  name: string;
  chronotypeMapping: "morning" | "intermediate" | "evening";
  momentumStyle: string;
  energyPattern?: string;
}

// ============================================================================
// ATTACHMENT LAYER — Relational Expression
// ============================================================================

export type AttachmentStyle =
  | "secure"
  | "anxious"
  | "avoidant"
  | "disorganized";

export interface AttachmentProfile {
  inferredStyle: AttachmentStyle;
  basis: {
    modality: ModalityProfile["code"];
    element: ElementProfile["code"];
  };
  notes: string;
  disclaimer?: string;
}

// ============================================================================
// ECOLOGICAL FRAME — Meta-Layer Philosophy
// ============================================================================

export interface EcologicalFrame {
  summary: string;
  keywords: string[];
  scientificBasis?: string[];
}

// ============================================================================
// COMPLETE SEASONAL PERSONALITY PANEL
// ============================================================================

export interface SeasonalPersonalityPanel {
  season: SeasonImprint;
  element: ElementProfile;
  modality: ModalityProfile;
  attachmentProfile?: AttachmentProfile;
  ecologicalFrame: EcologicalFrame;
}

// ============================================================================
// SIGN-LEVEL WRAPPER
// ============================================================================

export interface SignPersonalityProfile {
  sign: string;
  symbol: string;
  degreeRange: [number, number];
  panel: SeasonalPersonalityPanel;
}

// ============================================================================
// SCIENCE NOTE CONTENT STRUCTURE
// ============================================================================

export interface ScienceNoteContent {
  title: string;
  content: string;
  references?: string[];
}

export interface ScienceNotesCollection {
  seasons: ScienceNoteContent;
  modalities: ScienceNoteContent;
  elements: ScienceNoteContent;
  signs: ScienceNoteContent;
  ecological: ScienceNoteContent;
}

// ============================================================================
// REACT COMPONENT PROPS
// ============================================================================

export interface SeasonPanelProps {
  season: SeasonImprint;
  showScience?: boolean;
}

export interface ElementPanelProps {
  element: ElementProfile;
  showScience?: boolean;
}

export interface ModalityPanelProps {
  modality: ModalityProfile;
  showScience?: boolean;
}

export interface AttachmentPanelProps {
  attachment: AttachmentProfile;
  showDisclaimer?: boolean;
}

export interface SeasonalPersonalityProps {
  data: SeasonalPersonalityPanel;
  showAttachment?: boolean;
  defaultScienceExpanded?: boolean;
}

// ============================================================================
// STUDY THE WHEEL TAB TYPES
// ============================================================================

export type StudyWheelTab = 
  | "seasons"
  | "modes" 
  | "elements"
  | "signs"
  | "table";

export interface StudyWheelState {
  activeTab: StudyWheelTab;
  scienceNotesExpanded: Record<StudyWheelTab, boolean>;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type SeasonCode = SeasonImprint["code"];
export type ElementCode = ElementProfile["code"];
export type ModalityCode = ModalityProfile["code"];

export interface SeasonElementCombination {
  season: SeasonCode;
  element: ElementCode;
  modality: ModalityCode;
  sign: string;
}

// ============================================================================
// D3 VISUALIZATION TYPES
// ============================================================================

export interface RingSegment {
  ring: "season" | "modality" | "element";
  label: string;
  code: string;
  startAngle: number;
  endAngle: number;
  startDegree: number;
  endDegree: number;
  color: string;
  sign?: string;
  highlighted?: boolean;
  meta?: Record<string, unknown>;
}

export interface FullZodiacRingLayout {
  segments: RingSegment[];
  totalSegments: number;
  ringsCount: 3;
}

// ============================================================================
// ZOOM STRIP TYPES
// ============================================================================

export interface ZoomStripProps {
  sign: string;
  degree: number;
  onDegreeChange?: (degree: number) => void;
  animated?: boolean;
}

export interface DecanInfo {
  number: 1 | 2 | 3;
  ruler: string;
  description: string;
}

export interface ZoneInfo {
  number: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  phase: string;
}
```

---

## FILE 2: schemas/seasonalEcologySchemas.ts

```typescript
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

export type SeasonImprintSchemaType = z.infer<typeof SeasonImprintSchema>;
export type ElementProfileSchemaType = z.infer<typeof ElementProfileSchema>;
export type ModalityProfileSchemaType = z.infer<typeof ModalityProfileSchema>;
export type AttachmentProfileSchemaType = z.infer<typeof AttachmentProfileSchema>;
export type SeasonalPersonalityPanelSchemaType = z.infer<typeof SeasonalPersonalityPanelSchema>;
export type SignPersonalityProfileSchemaType = z.infer<typeof SignPersonalityProfileSchema>;
```

---

*Continuing in next file due to length...*
</parameter>
</invoke>