/**
 * ============================================================================
 * CATHEDRAL INDEX - BARREL EXPORTS
 * ============================================================================
 *
 * Central export file for all cathedral modules.
 *
 * Usage:
 *   import { CathedralIndexPage, buildCoupleIndex, generateCeremonialNarrative } from '@/cathedral';
 *
 * ============================================================================
 */

// Types
export type {
  WingId,
  WingConfig,
  ModuleStatus,
  ModuleType,
  CathedralItem,
  CathedralSection,
  CathedralWing,
  SubjectType,
  CathedralSubject,
  CathedralIndex,
  CathedralMetadata,
  NavItem,
  NavState,
  Breadcrumb,
  CathedralSearchResult,
  CathedralFilterOptions,
  WingStats,
  CathedralStats
} from './indexTypes';

// Constants
export {
  WING_CONFIGS,
  STATUS_DISPLAY,
  TYPE_DISPLAY
} from './indexTypes';

// Data & Index Builders
export {
  ALL_WINGS,
  buildCathedralIndex,
  buildIndividualIndex,
  buildCoupleIndex,
  buildFamilyIndex,
  computeCathedralStats,
  filterCathedralItems,
  getCathedralItem,
  getBreadcrumbs
} from './indexData';

// Narrative Generator
export {
  generateCeremonialNarrative,
  generateWingNarrative,
  generateRelationshipDedication,
  generateProgressReport,
  generateModuleCard,
  generateQuickReference,
  exportCathedralAsMarkdown
} from './narrativeGenerator';

// React Components
export { CathedralIndexPage } from './CathedralIndexPage';
export {
  CathedralRoutes,
  CathedralProvider,
  CathedralBreadcrumbs,
  CathedralPageWrapper,
  WingOverviewPage,
  SectionOverviewPage,
  ItemDetailPage,
  useCathedral
} from './CathedralRoutes';

// Schema Map Types
export type {
  ModuleCategory,
  ModuleImplementationStatus,
  FlowDirection,
  ModuleDefinition,
  TypeReference,
  TypeDefinition,
  TypeProperty,
  DataFlowEdge,
  TimingFlowNode,
  TimingLayer,
  NarrativeFlowNode,
  NarrativeType,
  CathedralSchemaMap,
  SchemaStatistics
} from './cathedralSchemaMap';

// Schema Map Data & Utilities
export {
  MODULE_REGISTRY,
  TYPE_REGISTRY,
  DATA_FLOW_EDGES,
  TIMING_FLOW_NODES,
  NARRATIVE_FLOW_NODES,
  buildSchemaMap,
  getModuleById,
  getModulesByCategory,
  getModulesByStatus,
  getModuleDependenciesDeep,
  getModuleDependents,
  getTypeByName,
  getTypesUsedByModule,
  getDataFlowForModule,
  getTimingFlowByLayer,
  getNarrativeFlowByChapter,
  generateDataFlowMermaid,
  generateTimingFlowMermaid,
  generateDependencyTree,
  exportSchemaMapAsJSON,
  exportSchemaMapAsMarkdown
} from './cathedralSchemaMap';
