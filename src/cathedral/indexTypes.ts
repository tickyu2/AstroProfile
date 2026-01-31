/**
 * ============================================================================
 * CATHEDRAL INDEX TYPE DEFINITIONS (大教堂索引类型)
 * ============================================================================
 *
 * The type system for the Cathedral Index — the master navigation layer
 * that organizes every module, engine, chart, timeline, and narrative
 * in the Genesis Soul metaphysics universe.
 *
 * Seven Wings of the Cathedral:
 * 1. Core Identity Wing (命盘本体殿) - Natal charts, elements, life themes
 * 2. Relationship Wing (关系殿) - Synastry, composite, archetypes, lifecycle
 * 3. Timing Wing (时序殿) - Luck pillars, events, trajectory curves
 * 4. Family & System Wing (家族系统殿) - Multi-relationship graphs, constellations
 * 5. Decision Wing (决策殿) - Timing-aware guidance engine
 * 6. Reports Wing (文献殿) - Composite forecasts, system reports
 * 7. Archive Wing (档案殿) - Charts, exports, data archives
 *
 * Created: January 2026
 * ============================================================================
 */

// ============================================================================
// CORE TYPE DEFINITIONS
// ============================================================================

/**
 * Wing identifiers — the seven domains of the cathedral
 */
export type WingId =
  | 'coreIdentity'
  | 'relationship'
  | 'timing'
  | 'familySystem'
  | 'decision'
  | 'reports'
  | 'archive';

/**
 * Wing display configuration
 */
export interface WingConfig {
  id: WingId;
  label: string;
  labelChinese: string;
  icon: string;
  color: string;
  description: string;
}

/**
 * Module status — tracks implementation completeness
 */
export type ModuleStatus =
  | 'complete'      // Fully implemented and tested
  | 'implemented'   // Code exists, needs testing
  | 'partial'       // Partially implemented
  | 'planned'       // Designed but not coded
  | 'future';       // Future roadmap item

/**
 * Module type — categorizes the nature of each module
 */
export type ModuleType =
  | 'engine'        // Core computation engine
  | 'chart'         // Visual chart/graph
  | 'report'        // Generated report
  | 'utility'       // Helper/utility module
  | 'data'          // Data structure/schema
  | 'ui'            // UI component
  | 'service';      // Service layer

/**
 * A single item in the cathedral index
 */
export interface CathedralItem {
  id: string;
  label: string;
  labelChinese: string;
  description: string;
  route?: string;
  sourceFile?: string;
  status: ModuleStatus;
  type: ModuleType;
  dependencies?: string[];
  exports?: string[];
  tags?: string[];
}

/**
 * A section within a wing
 */
export interface CathedralSection {
  id: string;
  label: string;
  labelChinese: string;
  description: string;
  items: CathedralItem[];
}

/**
 * A wing of the cathedral
 */
export interface CathedralWing {
  id: WingId;
  label: string;
  labelChinese: string;
  icon: string;
  color: string;
  description: string;
  sections: CathedralSection[];
}

/**
 * Subject type — who or what the cathedral is built for
 */
export type SubjectType = 'individual' | 'couple' | 'family' | 'system';

/**
 * Subject metadata
 */
export interface CathedralSubject {
  id: string;
  type: SubjectType;
  label: string;
  labelChinese?: string;
  partnerA?: { name: string; birthDate: string };
  partnerB?: { name: string; birthDate: string };
  members?: Array<{ name: string; birthDate: string; role: string }>;
}

/**
 * Complete cathedral index
 */
export interface CathedralIndex {
  subject: CathedralSubject;
  wings: CathedralWing[];
  metadata: CathedralMetadata;
}

/**
 * Cathedral metadata
 */
export interface CathedralMetadata {
  version: string;
  generatedAt: string;
  totalModules: number;
  completedModules: number;
  implementedModules: number;
  plannedModules: number;
  lastUpdated: string;
}

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

/**
 * Navigation item for UI rendering
 */
export interface NavItem {
  id: string;
  label: string;
  labelChinese: string;
  route: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
  isExpanded?: boolean;
  isActive?: boolean;
}

/**
 * Navigation state
 */
export interface NavState {
  currentWing: WingId | null;
  currentSection: string | null;
  currentItem: string | null;
  expandedWings: WingId[];
  expandedSections: string[];
}

/**
 * Breadcrumb item
 */
export interface Breadcrumb {
  label: string;
  labelChinese: string;
  route: string;
}

// ============================================================================
// SEARCH & FILTER TYPES
// ============================================================================

/**
 * Search result
 */
export interface CathedralSearchResult {
  item: CathedralItem;
  wing: WingId;
  section: string;
  relevance: number;
  matchedFields: string[];
}

/**
 * Filter options
 */
export interface CathedralFilterOptions {
  status?: ModuleStatus[];
  type?: ModuleType[];
  wing?: WingId[];
  tags?: string[];
  searchQuery?: string;
}

// ============================================================================
// STATISTICS TYPES
// ============================================================================

/**
 * Wing statistics
 */
export interface WingStats {
  wingId: WingId;
  totalItems: number;
  completeItems: number;
  implementedItems: number;
  partialItems: number;
  plannedItems: number;
  completionPercentage: number;
}

/**
 * Overall cathedral statistics
 */
export interface CathedralStats {
  totalWings: number;
  totalSections: number;
  totalItems: number;
  byStatus: Record<ModuleStatus, number>;
  byType: Record<ModuleType, number>;
  byWing: WingStats[];
  overallCompletion: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Wing configuration constants
 */
export const WING_CONFIGS: Record<WingId, WingConfig> = {
  coreIdentity: {
    id: 'coreIdentity',
    label: 'Core Identity Wing',
    labelChinese: '命盘本体殿',
    icon: '🜁',
    color: '#6366f1',
    description: 'Natal charts, elements, Ten Gods, and life themes'
  },
  relationship: {
    id: 'relationship',
    label: 'Relationship Wing',
    labelChinese: '关系殿',
    icon: '🜂',
    color: '#ec4899',
    description: 'Synastry, composite charts, archetypes, and lifecycle'
  },
  timing: {
    id: 'timing',
    label: 'Timing Wing',
    labelChinese: '时序殿',
    icon: '🜃',
    color: '#f59e0b',
    description: 'Luck pillars, events, and destiny trajectory curves'
  },
  familySystem: {
    id: 'familySystem',
    label: 'Family & System Wing',
    labelChinese: '家族系统殿',
    icon: '🜄',
    color: '#22c55e',
    description: 'Multi-relationship graphs and family constellations'
  },
  decision: {
    id: 'decision',
    label: 'Decision Wing',
    labelChinese: '决策殿',
    icon: '🜅',
    color: '#3b82f6',
    description: 'Timing-aware guidance for real-world choices'
  },
  reports: {
    id: 'reports',
    label: 'Reports Wing',
    labelChinese: '文献殿',
    icon: '🜆',
    color: '#8b5cf6',
    description: 'Composite forecasts, system reports, and documents'
  },
  archive: {
    id: 'archive',
    label: 'Archive Wing',
    labelChinese: '档案殿',
    icon: '🜇',
    color: '#64748b',
    description: 'Charts, exports, and data archives'
  }
};

/**
 * Status display configuration
 */
export const STATUS_DISPLAY: Record<ModuleStatus, { label: string; color: string; icon: string }> = {
  complete: { label: 'Complete', color: '#22c55e', icon: '✓' },
  implemented: { label: 'Implemented', color: '#3b82f6', icon: '◉' },
  partial: { label: 'Partial', color: '#f59e0b', icon: '◐' },
  planned: { label: 'Planned', color: '#8b5cf6', icon: '○' },
  future: { label: 'Future', color: '#94a3b8', icon: '◌' }
};

/**
 * Module type display configuration
 */
export const TYPE_DISPLAY: Record<ModuleType, { label: string; icon: string }> = {
  engine: { label: 'Engine', icon: '⚙' },
  chart: { label: 'Chart', icon: '📊' },
  report: { label: 'Report', icon: '📄' },
  utility: { label: 'Utility', icon: '🔧' },
  data: { label: 'Data', icon: '📦' },
  ui: { label: 'UI', icon: '🖼' },
  service: { label: 'Service', icon: '🔌' }
};
