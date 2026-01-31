/**
 * ============================================
 * THE CATHEDRAL — BRAND INDEX
 * Complete Brand System Exports
 *
 * All brand identity, brand book, and UI component
 * definitions for the Cathedral MetaOS.
 * ============================================
 */

// ==================== BRAND IDENTITY ====================
export {
  // Essence
  BRAND_ESSENCE,
  BRAND_VALUES,

  // Symbol System
  PRIMARY_SIGIL,
  LAYER_SIGILS,
  PILLAR_SIGILS,
  QUADRANT_SIGILS,
  NAVIGATION_SIGILS,
  type Sigil,

  // Color System
  COLOR_PALETTE,
  COLOR_USAGE_LOGIC,
  type BrandColor,

  // Typography
  TYPOGRAPHY_SYSTEM,
  TYPE_SCALE,
  type TypefaceSpec,

  // Motion
  MOTION_PRINCIPLES,
  MOTION_SPECS,
  type MotionSpec,

  // Voice & Tone
  VOICE_QUALITIES,
  TONE_VARIANTS,
  VOICE_NEVER,
  VOICE_RULES,

  // Taglines & Signatures
  TAGLINES,
  BRAND_SIGNATURES,

  // Helper Functions
  getColorByName,
  getSigilByLayer,
  getAllSigils,
  getMotionSpec,
} from './brandIdentity';

// ==================== BRAND BOOK ====================
export {
  // Chapter Types
  type BrandChapter,
  type BrandSection,
  type BrandGuideline,
  type BrandExample,

  // Chapters
  CHAPTER_FOUNDATION,
  CHAPTER_VISUAL,
  CHAPTER_COLOR,
  CHAPTER_TYPOGRAPHY,
  CHAPTER_MOTION,
  CHAPTER_VOICE,
  CHAPTER_APPLICATIONS,
  CHAPTER_MESSAGING,

  // Complete Book
  BRAND_BOOK,

  // Quick Reference
  QUICK_REFERENCE,

  // Helper Functions
  getChapterById,
  getSectionById,
  getAllGuidelines,
  getDoGuidelines,
  getDontGuidelines,
} from './brandBook';

// ==================== UI COMPONENTS ====================
export {
  // Component Types
  type ComponentCategory,
  type ComponentVariant,
  type ComponentSize,
  type ComponentState,
  type ComponentSpec,
  type ComponentProp,
  type CssVariable,
  type ComponentExample,

  // Atoms
  ATOM_COMPONENTS,

  // Molecules
  MOLECULE_COMPONENTS,

  // Organisms
  ORGANISM_COMPONENTS,

  // Layouts
  LAYOUT_COMPONENTS,

  // Rituals
  RITUAL_COMPONENTS,

  // Complete Library
  ALL_COMPONENTS,
  COMPONENT_CATEGORIES,

  // Design Tokens
  DESIGN_TOKENS,

  // Helper Functions
  getComponentById,
  getComponentsByCategory,
  getComponentPropTypes,
  getComponentCssVars,
} from './uiComponents';

// ==================== SIGIL DESIGNS ====================
export {
  // Types
  type SigilCategory,
  type GeometricPrimitive,
  type GeometricElement,
  type SigilDesign,
  type SigilStyleGuide,

  // Master Sigil
  MASTER_SIGIL_DESIGN,

  // Layer Sigils (1-23)
  LAYER_SIGIL_DESIGNS,

  // Pillar Sigils
  PILLAR_SIGIL_DESIGNS,

  // Quadrant Sigils
  QUADRANT_SIGIL_DESIGNS,

  // Style Guide
  SIGIL_STYLE_GUIDE,

  // Rendering Specs
  SIGIL_RENDERING_SPECS,

  // Helper Functions
  getSigilDesignByLayer,
  getSigilDesignById,
  getAllSigilDesigns,
  getSigilsByTier,
} from './sigilDesigns';

// ==================== MOTION PROTOTYPES ====================
export {
  // Types
  type MotionPrincipleId,
  type MotionPrototypeId,
  type InteractionType,
  type MotionPrinciple,
  type MotionPrototype,
  type MotionStep,
  type MotionTiming,
  type InteractionMotion,

  // Motion Feel
  MOTION_FEEL,

  // Motion Principles
  MOTION_PRINCIPLES_DETAILED,

  // Motion Prototypes
  MOTION_PROTOTYPES,

  // Interaction Motion Rules
  INTERACTION_MOTIONS,

  // Timing Constants
  TIMING_CONSTANTS,

  // Easing Presets
  EASING_PRESETS,

  // Helper Functions
  getMotionPrototypeById,
  getMotionsByPrinciple,
  getInteractionMotion,
  calculateTotalDuration,
} from './motionPrototypes';

// ==================== LAUNCH STRATEGY ====================
export {
  // Types
  type PhaseId,
  type PhaseEmoji,
  type LaunchPhase,
  type PhaseAction,
  type LaunchPrinciple,

  // Launch Philosophy
  LAUNCH_PHILOSOPHY,

  // Launch Principles
  LAUNCH_PRINCIPLES,

  // Launch Phases (0-7)
  LAUNCH_PHASES,

  // Phase Progression
  PHASE_PROGRESSION,

  // Target Audiences
  TARGET_AUDIENCES,

  // Helper Functions
  getPhaseById,
  getPhaseByOrder,
  getNextPhase,
  getPhaseDependencies,
  getActionsByType,
  getCriticalActions,
  getPhasesForAudience,
} from './launchStrategy';
