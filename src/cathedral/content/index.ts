/**
 * ============================================
 * THE CATHEDRAL — CONTENT INDEX
 * Complete Website Content System
 *
 * All marketing content, diagram configuration,
 * onboarding flow, and wireframe definitions
 * for the Cathedral MetaOS website.
 * ============================================
 */

// ==================== WEBSITE COPY ====================
export {
  // Hero
  HERO_CONTENT,
  ENTRY_GATES,

  // Problem
  PROBLEM_CONTENT,

  // Solution
  SOLUTION_CONTENT,

  // Architecture
  ARCHITECTURE_CONTENT,

  // Demo
  DEMO_CONTENT,

  // Comparison
  COMPARISON_CONTENT,

  // Use Cases
  USE_CASES_CONTENT,

  // Pricing
  PRICING_CONTENT,

  // Manifesto
  MANIFESTO_CONTENT,

  // Pilgrim Journey
  PILGRIM_JOURNEY_CONTENT,

  // Membership
  MEMBERSHIP_CONTENT,

  // Initiation
  INITIATION_CONTENT,

  // Footer
  FOOTER_CONTENT,
} from './websiteCopy';

// ==================== CATHEDRAL DIAGRAM ====================
export {
  // Layer definitions
  CATHEDRAL_LAYERS,
  type CathedralLayer,

  // Ring definitions
  CATHEDRAL_RINGS,
  type CathedralRing,

  // Pillar definitions
  CATHEDRAL_PILLARS,
  type CathedralPillar,

  // Quadrant definitions
  CATHEDRAL_QUADRANTS,
  type CathedralQuadrant,

  // Configuration
  DIAGRAM_CONFIG,

  // Helper functions
  getLayerById,
  getLayersByRing,
  getRingForLayer,
  getLayersInRange,
  getTierLayers,
} from './cathedralDiagram';

// ==================== PILGRIM JOURNEY ====================
export {
  // Stage definitions
  JOURNEY_STAGES,
  type JourneyStage,
  type JourneyStageId,
  type UserPath,
  type StageAction,
  type StageOption,
  type StageInput,
  type StageOutput,

  // Emotional arc
  EMOTIONAL_ARC,

  // UX principles
  JOURNEY_UX_PRINCIPLES,

  // Archetype system
  SAMPLE_ARCHETYPES,
  type ArchetypeConstellation,
  type Archetype,

  // Helper functions
  getStageById,
  getNextStage,
  getPreviousStage,
  getUnlockedLayers,
  getEmotionalArcForStage,
} from './pilgrimJourney';

// ==================== WIREFRAMES ====================
export {
  // UI Principles
  UI_PRINCIPLES,

  // All wireframes
  ALL_WIREFRAMES,
  HOMEPAGE_WIREFRAME,
  PROBLEM_WIREFRAME,
  SOLUTION_WIREFRAME,
  ARCHITECTURE_WIREFRAME,
  CHAMBER_WIREFRAME,
  DEMO_WIREFRAME,
  COMPARISON_WIREFRAME,
  USE_CASES_WIREFRAME,
  PRICING_WIREFRAME,
  MANIFESTO_WIREFRAME,
  PILGRIM_JOURNEY_WIREFRAME,
  DASHBOARD_WIREFRAME,
  MEMBERSHIP_WIREFRAME,
  INITIATION_WIREFRAME,

  // Component registry
  COMPONENT_REGISTRY,

  // Types
  type PageId,
  type PageWireframe,
  type PageSection,
  type SectionType,
  type LayoutType,
  type SectionContent,
  type ContentItem,
  type CallToAction,
  type VisualElement,
  type Interaction,
  type PageMetadata,

  // Helper functions
  getWireframeByPath,
  getWireframeById,
} from './wireframes';
