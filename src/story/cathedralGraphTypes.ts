/**
 * ============================================================================
 * CATHEDRAL KNOWLEDGE GRAPH - TYPE DEFINITIONS (大教堂知识图谱类型)
 * ============================================================================
 *
 * The vaulted ceiling of the cathedral.
 * Types for the unified ontology that maps every module, type, flow,
 * narrative, and UI surface into a single queryable graph.
 *
 * Four Graph Layers:
 * - Module Layer (模块层) - Engines, calculators, renderers
 * - Type Layer (类型层) - Data structures, interfaces
 * - Flow Layer (流动层) - Data flow, timing flow, narrative flow
 * - Narrative Layer (叙事层) - Story beats, chapters, arcs
 *
 * This is the Rosetta Stone of the cathedral.
 *
 * Created: January 2026
 * ============================================================================
 */

// ============================================================================
// NODE CATEGORIES
// ============================================================================

/**
 * The five node categories in the cathedral graph
 */
export type NodeCategory = 'module' | 'type' | 'flow' | 'narrative' | 'ui';

export const NODE_CATEGORY_CHINESE: Record<NodeCategory, string> = {
  module: '模块',
  type: '类型',
  flow: '流动',
  narrative: '叙事',
  ui: '界面'
};

export const NODE_CATEGORY_COLORS: Record<NodeCategory, string> = {
  module: '#3b82f6',    // Blue
  type: '#22c55e',      // Green
  flow: '#f59e0b',      // Amber
  narrative: '#a855f7', // Purple
  ui: '#ec4899'         // Pink
};

export const NODE_CATEGORY_ICONS: Record<NodeCategory, string> = {
  module: '⚙️',
  type: '📦',
  flow: '🌊',
  narrative: '📖',
  ui: '🖼️'
};

// ============================================================================
// MODULE SUBCATEGORIES
// ============================================================================

export type ModuleSubcategory =
  | 'chart_engine'       // Natal, synastry, composite
  | 'timing_engine'      // Luck pillars, annual, monthly, etc.
  | 'lifecycle_engine'   // Relationship phases
  | 'event_engine'       // Triggers and events
  | 'trajectory_engine'  // Curves and projections
  | 'decision_engine'    // Recommendations
  | 'story_engine'       // Narrative generation
  | 'ritual_engine'      // Ceremonial timing
  | 'simulation_engine'  // Branching timelines
  | 'weaving_engine'     // Multi-relationship stories
  | 'template_engine'    // Archetypal transforms
  | 'renderer'           // HTML, PDF, exports
  | 'dashboard'          // UI components
  | 'service';           // API services

export const MODULE_SUBCATEGORY_CHINESE: Record<ModuleSubcategory, string> = {
  chart_engine: '命盘引擎',
  timing_engine: '时机引擎',
  lifecycle_engine: '生命周期引擎',
  event_engine: '事件引擎',
  trajectory_engine: '轨迹引擎',
  decision_engine: '决策引擎',
  story_engine: '故事引擎',
  ritual_engine: '仪式引擎',
  simulation_engine: '模拟引擎',
  weaving_engine: '编织引擎',
  template_engine: '模板引擎',
  renderer: '渲染器',
  dashboard: '仪表板',
  service: '服务'
};

// ============================================================================
// EDGE RELATIONS
// ============================================================================

/**
 * The types of relationships between nodes
 */
export type EdgeRelation =
  | 'produces'        // Module produces type
  | 'consumes'        // Module consumes type
  | 'depends_on'      // Module depends on module
  | 'transforms_into' // Type transforms into type
  | 'feeds'           // Type feeds module
  | 'activates'       // Flow activates layer
  | 'narrates'        // Module narrates beat/chapter
  | 'visualizes'      // UI visualizes type
  | 'contains'        // Parent contains child
  | 'extends'         // Type extends type
  | 'implements';     // Module implements interface

export const EDGE_RELATION_CHINESE: Record<EdgeRelation, string> = {
  produces: '产出',
  consumes: '消费',
  depends_on: '依赖',
  transforms_into: '转化为',
  feeds: '输入到',
  activates: '激活',
  narrates: '叙述',
  visualizes: '可视化',
  contains: '包含',
  extends: '扩展',
  implements: '实现'
};

export const EDGE_RELATION_COLORS: Record<EdgeRelation, string> = {
  produces: '#22c55e',      // Green
  consumes: '#3b82f6',      // Blue
  depends_on: '#64748b',    // Slate
  transforms_into: '#f59e0b', // Amber
  feeds: '#14b8a6',         // Teal
  activates: '#ef4444',     // Red
  narrates: '#a855f7',      // Purple
  visualizes: '#ec4899',    // Pink
  contains: '#6366f1',      // Indigo
  extends: '#84cc16',       // Lime
  implements: '#06b6d4'     // Cyan
};

// ============================================================================
// NODE TYPES
// ============================================================================

/**
 * A node in the cathedral knowledge graph
 */
export interface KGNode {
  id: string;
  label: string;
  labelChinese: string;
  category: NodeCategory;

  // Optional subcategory for modules
  subcategory?: ModuleSubcategory;

  // Description
  description?: string;
  descriptionChinese?: string;

  // Source file (for modules)
  sourceFile?: string;

  // Metadata
  metadata?: Record<string, unknown>;

  // Position (for visualization)
  position?: {
    x: number;
    y: number;
    layer?: number;
  };

  // Status
  status?: 'active' | 'planned' | 'deprecated';

  // Tags for search
  tags?: string[];
}

/**
 * An edge in the cathedral knowledge graph
 */
export interface KGEdge {
  id: string;
  from: string;
  to: string;
  relation: EdgeRelation;

  // Description of the relationship
  description?: string;

  // Data type flowing through edge (if applicable)
  dataType?: string;

  // Strength of connection (0-1)
  strength?: number;

  // Is this a primary or secondary connection
  primary?: boolean;

  // Metadata
  metadata?: Record<string, unknown>;
}

// ============================================================================
// GRAPH STRUCTURE
// ============================================================================

/**
 * The complete cathedral knowledge graph
 */
export interface CathedralKnowledgeGraph {
  // Identity
  id: string;
  name: string;
  nameChinese: string;
  version: string;

  // Graph data
  nodes: KGNode[];
  edges: KGEdge[];

  // Layer organization
  layers: GraphLayer[];

  // Subgraphs (named collections)
  subgraphs: NamedSubgraph[];

  // Metadata
  metadata: {
    createdAt: string;
    updatedAt: string;
    nodeCount: number;
    edgeCount: number;
    layerCount: number;
  };
}

/**
 * A layer in the graph
 */
export interface GraphLayer {
  id: string;
  name: string;
  nameChinese: string;
  category: NodeCategory;
  order: number;
  color: string;
  nodeIds: string[];
}

/**
 * A named subgraph (collection of related nodes/edges)
 */
export interface NamedSubgraph {
  id: string;
  name: string;
  nameChinese: string;
  description: string;
  nodeIds: string[];
  edgeIds: string[];
}

// ============================================================================
// QUERY TYPES
// ============================================================================

/**
 * Query options for graph traversal
 */
export interface GraphQueryOptions {
  // Starting node(s)
  startNodes?: string[];

  // Filter by category
  categories?: NodeCategory[];

  // Filter by relation type
  relations?: EdgeRelation[];

  // Depth limit
  maxDepth?: number;

  // Direction
  direction?: 'outgoing' | 'incoming' | 'both';

  // Include metadata
  includeMetadata?: boolean;

  // Tag filter
  tags?: string[];
}

/**
 * Result of a graph query
 */
export interface GraphQueryResult {
  // Matched nodes
  nodes: KGNode[];

  // Edges connecting matched nodes
  edges: KGEdge[];

  // Paths found (for path queries)
  paths?: GraphPath[];

  // Query metadata
  metadata: {
    query: GraphQueryOptions;
    executionTime: number;
    totalNodes: number;
    totalEdges: number;
  };
}

/**
 * A path through the graph
 */
export interface GraphPath {
  id: string;
  nodeIds: string[];
  edgeIds: string[];
  length: number;
  description: string;
}

// ============================================================================
// VISUALIZATION TYPES
// ============================================================================

/**
 * Data for force-directed graph visualization
 */
export interface ForceGraphData {
  nodes: ForceGraphNode[];
  links: ForceGraphLink[];
}

export interface ForceGraphNode {
  id: string;
  label: string;
  category: NodeCategory;
  color: string;
  size: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface ForceGraphLink {
  id: string;
  source: string;
  target: string;
  relation: EdgeRelation;
  color: string;
  strength: number;
}

/**
 * Data for hierarchical tree visualization
 */
export interface TreeData {
  id: string;
  name: string;
  children?: TreeData[];
  category?: NodeCategory;
  metadata?: Record<string, unknown>;
}

/**
 * Data for Sankey diagram (flow visualization)
 */
export interface SankeyData {
  nodes: Array<{
    id: string;
    name: string;
    category: NodeCategory;
  }>;
  links: Array<{
    source: number;
    target: number;
    value: number;
    relation: EdgeRelation;
  }>;
}

// ============================================================================
// INSPECTOR TYPES
// ============================================================================

/**
 * Detailed inspection of a single node
 */
export interface NodeInspection {
  node: KGNode;

  // Incoming connections
  inputs: Array<{
    node: KGNode;
    edge: KGEdge;
  }>;

  // Outgoing connections
  outputs: Array<{
    node: KGNode;
    edge: KGEdge;
  }>;

  // Dependencies
  dependencies: KGNode[];

  // Dependents
  dependents: KGNode[];

  // Related narrative elements
  narrativeConnections: KGNode[];

  // UI surfaces that visualize this
  visualizedBy: KGNode[];

  // Statistics
  stats: {
    inputCount: number;
    outputCount: number;
    dependencyDepth: number;
    dependentCount: number;
  };
}

/**
 * Module documentation extracted from graph
 */
export interface ModuleDocumentation {
  module: KGNode;

  // What it consumes
  inputs: Array<{
    type: KGNode;
    description: string;
  }>;

  // What it produces
  outputs: Array<{
    type: KGNode;
    description: string;
  }>;

  // What it depends on
  dependencies: KGNode[];

  // What depends on it
  dependents: KGNode[];

  // Narrative connections
  narrativeRole: string;

  // Example usage
  exampleUsage?: string;
}

// ============================================================================
// SEARCH TYPES
// ============================================================================

/**
 * Search result for graph queries
 */
export interface GraphSearchResult {
  node: KGNode;
  score: number;
  matchedFields: string[];
  context: string;
}

/**
 * Search options
 */
export interface GraphSearchOptions {
  query: string;
  categories?: NodeCategory[];
  limit?: number;
  includeDescription?: boolean;
  includeTags?: boolean;
}

// ============================================================================
// DIFF TYPES
// ============================================================================

/**
 * Difference between two graph states
 */
export interface GraphDiff {
  addedNodes: KGNode[];
  removedNodes: KGNode[];
  modifiedNodes: Array<{
    before: KGNode;
    after: KGNode;
    changes: string[];
  }>;
  addedEdges: KGEdge[];
  removedEdges: KGEdge[];
}
