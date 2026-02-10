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
