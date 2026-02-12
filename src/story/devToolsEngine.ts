/**
 * Cathedral DevTools Engine (大教堂开发工具引擎)
 *
 * The ritual instruments for debugging destiny, inspecting story flows,
 * tracing timing pipelines, and visualizing the cathedral's internal architecture.
 *
 * This is the Architect's Chamber - where the cathedral becomes transparent,
 * inspectable, teachable, maintainable, and evolvable.
 */

import type {
  DebugLevel,
  BreakpointType,
  DebugBreakpoint,
  DebugSession,
  DebugStackFrame,
  WatchedValue,
  DebugLogEntry,
  ModuleDebugInfo,
  CalculationStep,
  TimingLayerDebug,
  DebugOverlayConfig,
  DebugDiff,
  FlowViewType,
  FlowNode,
  FlowEdge,
  FlowGraph,
  FlowInspectionOptions,
  FlowTransformationDetail,
  GraphViewMode,
  GraphNodeType,
  GraphNode,
  GraphEdge,
  KnowledgeGraph,
  GraphLayout,
  GraphSearchQuery,
  KnowledgeGraphSearchResult,
  TimingLayer,
  TimingAnalysis,
  TimingLayerAnalysis,
  TimingScoreBreakdown,
  ClashHarmAnalysis,
  NoblemanAnalysis,
  StarAnalysis,
  TimingEventTrigger,
  DestinyCurvePoint,
  MicroWindow,
  TimingWarning,
  TimingHeatmap,
  TimingHeatmapCell,
  StoryDebugAnalysis,
  BeatDebugInfo,
  ChapterDebugInfo,
  ArcDebugInfo,
  EmotionalArcDebug,
  RitualDebugAnalysis,
  RitualScoreBreakdown,
  ConsoleLogType,
  ConsoleEntry,
  PerformanceMetrics,
  MemorySnapshot,
  OrchestrationTrace,
  OrchestrationStepTrace,
  ApiCallTrace,
  ConsoleFilterOptions,
  DevToolsPanelType,
  DevToolsWorkspace,
  DevToolsState,
  DevToolsConfig,
  DevToolsEvent,
  DevToolsEventType,
  DevToolsEventListener,
} from './devToolsTypes';

import { DEFAULT_DEVTOOLS_CONFIG } from './devToolsTypes';

// ============================================================================
// SAFE CONDITION EVALUATOR
// ============================================================================

/** Resolve a value token — context property, number, boolean, or quoted string */
function resolveValue(token: string, context: Record<string, unknown>): unknown {
  if (token === 'true') return true;
  if (token === 'false') return false;
  if (token === 'null') return null;
  if (token === 'undefined') return undefined;
  if (/^-?\d+(\.\d+)?$/.test(token)) return Number(token);
  if ((token.startsWith("'") && token.endsWith("'")) ||
      (token.startsWith('"') && token.endsWith('"'))) {
    return token.slice(1, -1);
  }
  return token.split('.').reduce<unknown>((obj, key) =>
    obj != null && typeof obj === 'object' ? (obj as Record<string, unknown>)[key] : undefined,
    context
  );
}

/** Safely evaluate a condition string without new Function() */
function safeEvalCondition(condition: string, context: Record<string, unknown>): boolean {
  const trimmed = condition.trim();
  if (trimmed.startsWith('!')) return !resolveValue(trimmed.slice(1).trim(), context);
  const operators = ['===', '!==', '>=', '<=', '==', '!=', '>', '<'] as const;
  for (const op of operators) {
    const idx = trimmed.indexOf(op);
    if (idx !== -1) {
      const left = resolveValue(trimmed.slice(0, idx).trim(), context);
      const right = resolveValue(trimmed.slice(idx + op.length).trim(), context);
      switch (op) {
        case '===': return left === right;
        case '!==': return left !== right;
        case '==':  return left == right;
        case '!=':  return left != right;
        case '>':   return (left as number) > (right as number);
        case '>=':  return (left as number) >= (right as number);
        case '<':   return (left as number) < (right as number);
        case '<=':  return (left as number) <= (right as number);
      }
    }
  }
  return !!resolveValue(trimmed, context);
}

// ============================================================================
// INTERNAL STATE
// ============================================================================

let devToolsConfig: DevToolsConfig = { ...DEFAULT_DEVTOOLS_CONFIG };
let devToolsState: DevToolsState | null = null;
let currentDebugSession: DebugSession | null = null;
const eventListeners: Map<DevToolsEventType, Set<DevToolsEventListener>> = new Map();
const consoleEntries: ConsoleEntry[] = [];
const performanceMetrics: Map<string, PerformanceMetrics[]> = new Map();
const orchestrationTraces: OrchestrationTrace[] = [];
const apiCallTraces: ApiCallTrace[] = [];

// Module registry for debugging
const registeredModules: Map<string, {
  name: string;
  type: string;
  inputs: string[];
  outputs: string[];
  dependencies: string[];
}> = new Map();

// ============================================================================
// 🜁 1. MODULE DEBUGGER (模块调试器)
// ============================================================================

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Start a new debug session
 */
export function startDebugSession(): DebugSession {
  currentDebugSession = {
    id: generateId(),
    state: 'running',
    startedAt: new Date(),
    breakpoints: [],
    callStack: [],
    watchedValues: [],
    logs: [],
  };

  emitEvent('stepCompleted', 'debugger', { action: 'sessionStarted', sessionId: currentDebugSession.id });
  return currentDebugSession;
}

/**
 * Stop the current debug session
 */
export function stopDebugSession(): void {
  if (currentDebugSession) {
    currentDebugSession.state = 'completed';
    emitEvent('stepCompleted', 'debugger', { action: 'sessionStopped', sessionId: currentDebugSession.id });
    currentDebugSession = null;
  }
}

/**
 * Get the current debug session
 */
export function getDebugSession(): DebugSession | null {
  return currentDebugSession;
}

/**
 * Add a breakpoint
 */
export function addBreakpoint(
  type: BreakpointType,
  target: string,
  condition?: string,
  description?: string
): DebugBreakpoint {
  const breakpoint: DebugBreakpoint = {
    id: generateId(),
    type,
    target,
    condition,
    enabled: true,
    hitCount: 0,
    description,
  };

  if (currentDebugSession) {
    currentDebugSession.breakpoints.push(breakpoint);
  }

  return breakpoint;
}

/**
 * Remove a breakpoint
 */
export function removeBreakpoint(breakpointId: string): boolean {
  if (!currentDebugSession) return false;

  const index = currentDebugSession.breakpoints.findIndex(bp => bp.id === breakpointId);
  if (index !== -1) {
    currentDebugSession.breakpoints.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Toggle a breakpoint
 */
export function toggleBreakpoint(breakpointId: string): boolean {
  if (!currentDebugSession) return false;

  const breakpoint = currentDebugSession.breakpoints.find(bp => bp.id === breakpointId);
  if (breakpoint) {
    breakpoint.enabled = !breakpoint.enabled;
    return true;
  }
  return false;
}

/**
 * Check if a breakpoint should trigger
 */
export function checkBreakpoint(
  type: BreakpointType,
  target: string,
  context: Record<string, unknown>
): DebugBreakpoint | null {
  if (!currentDebugSession || currentDebugSession.state !== 'running') {
    return null;
  }

  for (const bp of currentDebugSession.breakpoints) {
    if (!bp.enabled) continue;
    if (bp.type !== type) continue;
    if (bp.target !== target && bp.target !== '*') continue;

    // Evaluate condition if present
    if (bp.condition) {
      try {
        if (!safeEvalCondition(bp.condition, context)) continue;
      } catch {
        // Condition evaluation failed, skip this breakpoint
        continue;
      }
    }

    bp.hitCount++;
    currentDebugSession.state = 'paused';
    currentDebugSession.pausedAt = new Date();
    currentDebugSession.currentBreakpoint = bp;

    emitEvent('breakpointHit', 'debugger', { breakpoint: bp, context });
    return bp;
  }

  return null;
}

/**
 * Resume execution after a breakpoint
 */
export function resumeExecution(): void {
  if (currentDebugSession && currentDebugSession.state === 'paused') {
    currentDebugSession.state = 'running';
    currentDebugSession.pausedAt = undefined;
    currentDebugSession.currentBreakpoint = undefined;
  }
}

/**
 * Step through execution
 */
export function stepExecution(): void {
  if (currentDebugSession && currentDebugSession.state === 'paused') {
    currentDebugSession.state = 'stepping';
  }
}

/**
 * Push a stack frame
 */
export function pushStackFrame(
  moduleName: string,
  functionName: string,
  inputs: Record<string, unknown>
): DebugStackFrame {
  const frame: DebugStackFrame = {
    id: generateId(),
    moduleName,
    functionName,
    inputs,
    intermediateValues: {},
    timestamp: new Date(),
    children: [],
  };

  if (currentDebugSession) {
    currentDebugSession.callStack.push(frame);
  }

  return frame;
}

/**
 * Pop a stack frame and record outputs
 */
export function popStackFrame(outputs: Record<string, unknown>): DebugStackFrame | null {
  if (!currentDebugSession || currentDebugSession.callStack.length === 0) {
    return null;
  }

  const frame = currentDebugSession.callStack.pop()!;
  frame.outputs = outputs;
  frame.duration = Date.now() - frame.timestamp.getTime();

  return frame;
}

/**
 * Record an intermediate value
 */
export function recordIntermediateValue(
  frameId: string,
  name: string,
  value: unknown
): void {
  if (!currentDebugSession) return;

  const frame = findStackFrame(currentDebugSession.callStack, frameId);
  if (frame) {
    frame.intermediateValues[name] = value;
  }
}

/**
 * Find a stack frame by ID
 */
function findStackFrame(frames: DebugStackFrame[], id: string): DebugStackFrame | null {
  for (const frame of frames) {
    if (frame.id === id) return frame;
    const found = findStackFrame(frame.children, id);
    if (found) return found;
  }
  return null;
}

/**
 * Add a watched value
 */
export function addWatchedValue(expression: string): WatchedValue {
  const watched: WatchedValue = {
    id: generateId(),
    expression,
    value: undefined,
    hasChanged: false,
    type: 'unknown',
  };

  if (currentDebugSession) {
    currentDebugSession.watchedValues.push(watched);
  }

  return watched;
}

/**
 * Update a watched value
 */
export function updateWatchedValue(
  watchedId: string,
  value: unknown
): void {
  if (!currentDebugSession) return;

  const watched = currentDebugSession.watchedValues.find(w => w.id === watchedId);
  if (watched) {
    watched.previousValue = watched.value;
    watched.value = value;
    watched.hasChanged = watched.previousValue !== value;
    watched.type = typeof value;
  }
}

/**
 * Get module debug info
 */
export function getModuleDebugInfo(
  moduleName: string,
  inputs: Record<string, unknown>,
  outputs: Record<string, unknown>,
  intermediates: Record<string, unknown>,
  pipeline: CalculationStep[],
  timingLayers: TimingLayerDebug[],
  duration: number
): ModuleDebugInfo {
  return {
    moduleName,
    moduleType: registeredModules.get(moduleName)?.type || 'unknown',
    inputs: Object.fromEntries(
      Object.entries(inputs).map(([k, v]) => [k, { type: typeof v, value: v }])
    ),
    outputs: Object.fromEntries(
      Object.entries(outputs).map(([k, v]) => [k, { type: typeof v, value: v }])
    ),
    intermediateValues: Object.fromEntries(
      Object.entries(intermediates).map(([k, v], i) => [k, { step: i + 1, value: v }])
    ),
    calculationPipeline: pipeline,
    timingLayers,
    eventTriggers: [],
    lifecycleTransitions: [],
    storyTransformations: [],
    duration,
    memoryUsage: 0, // Would need actual memory tracking
  };
}

/**
 * Compare expected vs actual output
 */
export function diffOutputs(
  expected: Record<string, unknown>,
  actual: Record<string, unknown>,
  path: string = ''
): DebugDiff[] {
  const diffs: DebugDiff[] = [];

  const allKeys = new Set([...Object.keys(expected), ...Object.keys(actual)]);

  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key;
    const expectedVal = expected[key];
    const actualVal = actual[key];

    if (!(key in expected)) {
      diffs.push({
        path: currentPath,
        expected: undefined,
        actual: actualVal,
        match: false,
        diffType: 'extra',
      });
    } else if (!(key in actual)) {
      diffs.push({
        path: currentPath,
        expected: expectedVal,
        actual: undefined,
        match: false,
        diffType: 'missing',
      });
    } else if (typeof expectedVal !== typeof actualVal) {
      diffs.push({
        path: currentPath,
        expected: expectedVal,
        actual: actualVal,
        match: false,
        diffType: 'type_mismatch',
      });
    } else if (typeof expectedVal === 'object' && expectedVal !== null) {
      const nestedDiffs = diffOutputs(
        expectedVal as Record<string, unknown>,
        actualVal as Record<string, unknown>,
        currentPath
      );
      diffs.push(...nestedDiffs);
    } else if (expectedVal !== actualVal) {
      diffs.push({
        path: currentPath,
        expected: expectedVal,
        actual: actualVal,
        match: false,
        diffType: 'changed',
      });
    }
  }

  return diffs;
}

/**
 * Create default debug overlay config
 */
export function createDebugOverlayConfig(overrides?: Partial<DebugOverlayConfig>): DebugOverlayConfig {
  return {
    enabled: true,
    showInputs: true,
    showOutputs: true,
    showIntermediates: false,
    showTiming: true,
    showMemory: false,
    showDiffs: false,
    highlightChanges: true,
    compactMode: false,
    ...overrides,
  };
}

// ============================================================================
// 🜂 2. FLOW INSPECTOR (流动检查器)
// ============================================================================

/**
 * Build a flow graph from registered modules
 */
export function buildFlowGraph(options: FlowInspectionOptions): FlowGraph {
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];
  const nodeMap = new Map<string, FlowNode>();

  // Build nodes from registered modules
  for (const [name, module] of registeredModules) {
    if (options.filterByCategory && !options.filterByCategory.includes(module.type)) {
      continue;
    }

    const node: FlowNode = {
      id: name,
      type: 'module',
      label: name,
      category: module.type,
      data: { inputs: module.inputs, outputs: module.outputs },
      isBottleneck: false,
      isMissing: false,
      isCircular: false,
    };

    nodes.push(node);
    nodeMap.set(name, node);
  }

  // Build edges from dependencies
  for (const [name, module] of registeredModules) {
    if (!nodeMap.has(name)) continue;

    for (const dep of module.dependencies) {
      if (nodeMap.has(dep)) {
        edges.push({
          id: `${dep}->${name}`,
          source: dep,
          target: name,
          transformations: [],
          isBottleneck: false,
          isMissing: false,
          isCircular: false,
          weight: 1,
        });
      } else if (options.detectMissing) {
        // Create a missing node
        const missingNode: FlowNode = {
          id: dep,
          type: 'module',
          label: `${dep} (missing)`,
          category: 'unknown',
          data: {},
          isBottleneck: false,
          isMissing: true,
          isCircular: false,
        };
        nodes.push(missingNode);
        nodeMap.set(dep, missingNode);

        edges.push({
          id: `${dep}->${name}`,
          source: dep,
          target: name,
          transformations: [],
          isBottleneck: false,
          isMissing: true,
          isCircular: false,
          weight: 1,
        });
      }
    }
  }

  // Detect circular flows
  const circularFlows: string[][] = [];
  if (options.detectCircular) {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const path: string[] = [];

    function detectCycle(nodeId: string): boolean {
      visited.add(nodeId);
      recursionStack.add(nodeId);
      path.push(nodeId);

      const outgoingEdges = edges.filter(e => e.source === nodeId);
      for (const edge of outgoingEdges) {
        if (!visited.has(edge.target)) {
          if (detectCycle(edge.target)) return true;
        } else if (recursionStack.has(edge.target)) {
          // Found a cycle
          const cycleStart = path.indexOf(edge.target);
          const cycle = [...path.slice(cycleStart), edge.target];
          circularFlows.push(cycle);

          // Mark nodes and edges as circular
          for (const nodeId of cycle) {
            const node = nodeMap.get(nodeId);
            if (node) node.isCircular = true;
          }
          for (const e of edges) {
            if (cycle.includes(e.source) && cycle.includes(e.target)) {
              e.isCircular = true;
            }
          }
        }
      }

      path.pop();
      recursionStack.delete(nodeId);
      return false;
    }

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        detectCycle(node.id);
      }
    }
  }

  // Detect bottlenecks (nodes with many incoming edges)
  const bottlenecks: string[] = [];
  if (options.detectBottlenecks) {
    const incomingCounts = new Map<string, number>();
    for (const edge of edges) {
      incomingCounts.set(edge.target, (incomingCounts.get(edge.target) || 0) + 1);
    }

    const avgIncoming = edges.length / nodes.length;
    for (const [nodeId, count] of incomingCounts) {
      if (count > avgIncoming * 2) {
        bottlenecks.push(nodeId);
        const node = nodeMap.get(nodeId);
        if (node) node.isBottleneck = true;
      }
    }
  }

  return {
    viewType: options.viewType,
    nodes,
    edges,
    bottlenecks,
    missingDependencies: nodes.filter(n => n.isMissing).map(n => n.id),
    circularFlows,
    metadata: {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      maxDepth: calculateMaxDepth(nodes, edges),
      generatedAt: new Date(),
    },
  };
}

/**
 * Calculate max depth of the flow graph
 */
function calculateMaxDepth(nodes: FlowNode[], edges: FlowEdge[]): number {
  const depths = new Map<string, number>();
  const visited = new Set<string>();

  // Find root nodes (no incoming edges)
  const hasIncoming = new Set(edges.map(e => e.target));
  const roots = nodes.filter(n => !hasIncoming.has(n.id));

  function calculateNodeDepth(nodeId: string, currentDepth: number): void {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    depths.set(nodeId, Math.max(depths.get(nodeId) || 0, currentDepth));

    const outgoing = edges.filter(e => e.source === nodeId);
    for (const edge of outgoing) {
      calculateNodeDepth(edge.target, currentDepth + 1);
    }
  }

  for (const root of roots) {
    calculateNodeDepth(root.id, 0);
  }

  return Math.max(...depths.values(), 0);
}

/**
 * Get flow transformation details for an edge
 */
export function getFlowTransformationDetails(edgeId: string): FlowTransformationDetail | null {
  // This would be populated based on actual module transformations
  return {
    edgeId,
    sourceType: 'unknown',
    targetType: 'unknown',
    transformations: [],
  };
}

/**
 * Register a module for flow tracking
 */
export function registerModuleForFlow(
  name: string,
  type: string,
  inputs: string[],
  outputs: string[],
  dependencies: string[]
): void {
  registeredModules.set(name, { name, type, inputs, outputs, dependencies });
}

// ============================================================================
// 🜃 3. KNOWLEDGE GRAPH EXPLORER (知识图谱浏览器)
// ============================================================================

let knowledgeGraph: KnowledgeGraph | null = null;

/**
 * Initialize the knowledge graph
 */
export function initializeKnowledgeGraph(viewMode: GraphViewMode = 'module'): KnowledgeGraph {
  knowledgeGraph = {
    nodes: new Map(),
    edges: new Map(),
    viewMode,
    selectedNodes: new Set(),
    expandedNodes: new Set(),
    searchResults: [],
    layout: {
      type: 'force',
      forceParams: {
        linkDistance: 100,
        chargeStrength: -300,
        centerStrength: 0.1,
      },
    },
    metadata: {
      totalNodes: 0,
      totalEdges: 0,
      lastUpdated: new Date(),
    },
  };

  // Populate from registered modules
  for (const [name, module] of registeredModules) {
    addGraphNode({
      id: name,
      type: categorizeModuleType(module.type),
      label: name,
      category: module.type,
      dependencies: module.dependencies,
      dependents: [],
      narrativeConnections: [],
      orchestrationPipelines: [],
      metadata: { inputs: module.inputs, outputs: module.outputs },
      expanded: false,
      visible: true,
      highlighted: false,
    });

    for (const dep of module.dependencies) {
      addGraphEdge({
        id: `${dep}->${name}`,
        source: dep,
        target: name,
        type: 'dependency',
        weight: 1,
        bidirectional: false,
        metadata: {},
      });
    }
  }

  return knowledgeGraph;
}

/**
 * Categorize module type to graph node type
 */
function categorizeModuleType(type: string): GraphNodeType {
  const typeMap: Record<string, GraphNodeType> = {
    engine: 'engine',
    calculator: 'calculator',
    transformer: 'transformer',
    timing: 'timing',
    story: 'beat',
    ritual: 'ritual',
    environment: 'environment',
    orchestration: 'orchestration',
  };
  return typeMap[type.toLowerCase()] || 'type';
}

/**
 * Add a node to the knowledge graph
 */
export function addGraphNode(node: GraphNode): void {
  if (!knowledgeGraph) initializeKnowledgeGraph();
  knowledgeGraph!.nodes.set(node.id, node);
  knowledgeGraph!.metadata.totalNodes = knowledgeGraph!.nodes.size;
  knowledgeGraph!.metadata.lastUpdated = new Date();
}

/**
 * Add an edge to the knowledge graph
 */
export function addGraphEdge(edge: GraphEdge): void {
  if (!knowledgeGraph) initializeKnowledgeGraph();
  knowledgeGraph!.edges.set(edge.id, edge);
  knowledgeGraph!.metadata.totalEdges = knowledgeGraph!.edges.size;
  knowledgeGraph!.metadata.lastUpdated = new Date();

  // Update dependents list
  const targetNode = knowledgeGraph!.nodes.get(edge.target);
  const sourceNode = knowledgeGraph!.nodes.get(edge.source);
  if (sourceNode && !sourceNode.dependents.includes(edge.target)) {
    sourceNode.dependents.push(edge.target);
  }
}

/**
 * Get the knowledge graph
 */
export function getKnowledgeGraph(): KnowledgeGraph | null {
  return knowledgeGraph;
}

/**
 * Search the knowledge graph
 */
export function searchKnowledgeGraph(query: GraphSearchQuery): KnowledgeGraphSearchResult {
  const startTime = Date.now();
  const matchedNodes: GraphNode[] = [];
  const matchedEdges: GraphEdge[] = [];
  const paths: GraphNode[][] = [];

  if (!knowledgeGraph) {
    return {
      query,
      matchedNodes: [],
      matchedEdges: [],
      paths: [],
      executionTime: 0,
    };
  }

  const queryLower = query.query.toLowerCase();

  // Search nodes
  for (const node of knowledgeGraph.nodes.values()) {
    // Apply type filter
    if (query.filters?.nodeTypes && !query.filters.nodeTypes.includes(node.type)) {
      continue;
    }

    // Apply category filter
    if (query.filters?.categories && !query.filters.categories.includes(node.category)) {
      continue;
    }

    // Apply narrative filter
    if (query.filters?.hasNarrativeConnections && node.narrativeConnections.length === 0) {
      continue;
    }

    // Apply pipeline filter
    if (query.filters?.inPipeline && !node.orchestrationPipelines.includes(query.filters.inPipeline)) {
      continue;
    }

    // Match query
    let matches = false;
    if (query.searchType === 'natural') {
      matches = node.label.toLowerCase().includes(queryLower) ||
                (node.description?.toLowerCase().includes(queryLower) || false) ||
                node.category.toLowerCase().includes(queryLower);
    } else if (query.searchType === 'regex') {
      try {
        const regex = new RegExp(query.query, 'i');
        matches = regex.test(node.label) ||
                  regex.test(node.description || '') ||
                  regex.test(node.category);
      } catch {
        // Invalid regex
      }
    }

    if (matches) {
      matchedNodes.push(node);
      if (query.limit && matchedNodes.length >= query.limit) {
        break;
      }
    }
  }

  // Search edges related to matched nodes
  const matchedNodeIds = new Set(matchedNodes.map(n => n.id));
  for (const edge of knowledgeGraph.edges.values()) {
    if (matchedNodeIds.has(edge.source) || matchedNodeIds.has(edge.target)) {
      matchedEdges.push(edge);
    }
  }

  // Path search (find paths between nodes matching the query)
  if (query.searchType === 'path' && matchedNodes.length >= 2) {
    // Simple BFS to find paths
    const start = matchedNodes[0];
    const end = matchedNodes[matchedNodes.length - 1];
    const path = findPath(start.id, end.id);
    if (path.length > 0) {
      paths.push(path.map(id => knowledgeGraph!.nodes.get(id)!).filter(Boolean));
    }
  }

  return {
    query,
    matchedNodes,
    matchedEdges,
    paths,
    executionTime: Date.now() - startTime,
  };
}

/**
 * Find a path between two nodes using BFS
 */
function findPath(startId: string, endId: string): string[] {
  if (!knowledgeGraph) return [];

  const visited = new Set<string>();
  const queue: { id: string; path: string[] }[] = [{ id: startId, path: [startId] }];

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.id === endId) {
      return current.path;
    }

    if (visited.has(current.id)) continue;
    visited.add(current.id);

    // Find all edges from current node
    for (const edge of knowledgeGraph.edges.values()) {
      if (edge.source === current.id && !visited.has(edge.target)) {
        queue.push({ id: edge.target, path: [...current.path, edge.target] });
      }
      if (edge.bidirectional && edge.target === current.id && !visited.has(edge.source)) {
        queue.push({ id: edge.source, path: [...current.path, edge.source] });
      }
    }
  }

  return [];
}

/**
 * Expand or collapse a node in the graph
 */
export function toggleGraphNode(nodeId: string): void {
  if (!knowledgeGraph) return;

  const node = knowledgeGraph.nodes.get(nodeId);
  if (node) {
    node.expanded = !node.expanded;
    if (node.expanded) {
      knowledgeGraph.expandedNodes.add(nodeId);
    } else {
      knowledgeGraph.expandedNodes.delete(nodeId);
    }
  }
}

/**
 * Set graph layout
 */
export function setGraphLayout(layout: GraphLayout): void {
  if (knowledgeGraph) {
    knowledgeGraph.layout = layout;
  }
}

// ============================================================================
// 🜄 4. TIMING ANALYZER (时序分析器)
// ============================================================================

/**
 * Analyze timing for a specific moment
 */
export function analyzeTimingForDate(
  date: Date,
  natalChart?: Record<string, unknown>
): TimingAnalysis {
  // This would integrate with the actual timing engines
  const layers = {
    annual: createTimingLayerAnalysis('annual', date),
    monthly: createTimingLayerAnalysis('monthly', date),
    daily: createTimingLayerAnalysis('daily', date),
    hourly: createTimingLayerAnalysis('hourly', date),
    micro: createTimingLayerAnalysis('micro15', date),
  };

  // Calculate composite score
  const compositeScore = (
    layers.annual.score * 0.3 +
    layers.monthly.score * 0.25 +
    layers.daily.score * 0.25 +
    layers.hourly.score * 0.15 +
    layers.micro.score * 0.05
  );

  const analysis: TimingAnalysis = {
    timestamp: date,
    layers,
    compositeScore,
    usefulGodAlignment: 0, // Would calculate from natal chart
    annoyingGodAvoidance: 0,
    eventTriggers: [],
    destinyCurve: generateDestinyCurve(date),
    bestWindows: findBestMicroWindows(date),
    warnings: detectTimingWarnings(layers),
  };

  emitEvent('timingAnalyzed', 'timingAnalyzer', { date, analysis });
  return analysis;
}

/**
 * Create timing layer analysis
 */
function createTimingLayerAnalysis(layer: TimingLayer, date: Date): TimingLayerAnalysis {
  // Placeholder implementation - would use actual BaZi calculations
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  const year = date.getFullYear();
  const stemIndex = (year - 4) % 10;
  const branchIndex = (year - 4) % 12;

  const breakdown: TimingScoreBreakdown = {
    baseScore: 50,
    elementSupport: Math.random() * 20 - 10,
    usefulGodBonus: Math.random() * 15,
    annoyingGodPenalty: -Math.random() * 10,
    clashPenalty: 0,
    harmPenalty: 0,
    punishmentPenalty: 0,
    noblemanBonus: Math.random() > 0.7 ? 10 : 0,
    starInfluence: Math.random() * 10 - 5,
    environmentalModifier: 0,
    finalScore: 0,
    factors: [],
  };

  breakdown.finalScore = Math.max(0, Math.min(100,
    breakdown.baseScore +
    breakdown.elementSupport +
    breakdown.usefulGodBonus +
    breakdown.annoyingGodPenalty +
    breakdown.clashPenalty +
    breakdown.noblemanBonus +
    breakdown.starInfluence
  ));

  return {
    layer,
    stem: stems[stemIndex],
    branch: branches[branchIndex],
    element: elements[stemIndex % 5],
    score: breakdown.finalScore,
    breakdown,
    clashes: [],
    noblemen: [],
    stars: [],
  };
}

/**
 * Generate destiny curve for surrounding dates
 */
function generateDestinyCurve(centerDate: Date): DestinyCurvePoint[] {
  const curve: DestinyCurvePoint[] = [];
  const days = 30;

  for (let i = -days; i <= days; i++) {
    const date = new Date(centerDate);
    date.setDate(date.getDate() + i);

    const score = 50 + Math.sin(i / 7) * 20 + Math.random() * 10;
    const prevScore = curve.length > 0 ? curve[curve.length - 1].score : score;

    curve.push({
      timestamp: date,
      score,
      trend: score > prevScore ? 'rising' : score < prevScore ? 'falling' : 'stable',
      significantEvents: [],
    });
  }

  return curve;
}

/**
 * Find best micro timing windows
 */
function findBestMicroWindows(date: Date): MicroWindow[] {
  const windows: MicroWindow[] = [];

  // Generate sample windows for the day
  for (let hour = 6; hour <= 22; hour += 2) {
    const start = new Date(date);
    start.setHours(hour, 0, 0, 0);

    const end = new Date(start);
    end.setMinutes(15);

    const score = 50 + Math.random() * 50;

    windows.push({
      start,
      end,
      score,
      recommendation: score > 75 ? 'Highly favorable' : score > 50 ? 'Favorable' : 'Neutral',
      activities: score > 75 ? ['Important meetings', 'Signing contracts'] : ['Routine tasks'],
    });
  }

  return windows.sort((a, b) => b.score - a.score).slice(0, 5);
}

/**
 * Detect timing warnings
 */
function detectTimingWarnings(layers: Record<string, TimingLayerAnalysis>): TimingWarning[] {
  const warnings: TimingWarning[] = [];

  for (const [layerName, layer] of Object.entries(layers)) {
    if (layer.score < 30) {
      warnings.push({
        severity: layer.score < 20 ? 'high' : 'medium',
        type: 'low_score',
        message: `${layerName} timing score is low (${layer.score.toFixed(1)})`,
        affectedLayers: [layerName as TimingLayer],
        mitigation: 'Consider postponing important activities',
      });
    }

    if (layer.clashes.length > 0) {
      warnings.push({
        severity: 'medium',
        type: 'clash',
        message: `${layerName} has active clashes`,
        affectedLayers: [layerName as TimingLayer],
        mitigation: 'Be cautious in interactions',
      });
    }
  }

  return warnings;
}

/**
 * Generate a timing heatmap
 */
export function generateTimingHeatmap(
  startDate: Date,
  endDate: Date,
  granularity: 'hour' | 'day' | 'week' | 'month' = 'day'
): TimingHeatmap {
  const cells: TimingHeatmapCell[] = [];
  const current = new Date(startDate);

  const increment = {
    hour: () => current.setHours(current.getHours() + 1),
    day: () => current.setDate(current.getDate() + 1),
    week: () => current.setDate(current.getDate() + 7),
    month: () => current.setMonth(current.getMonth() + 1),
  };

  while (current <= endDate) {
    const score = 50 + Math.sin(current.getTime() / 86400000) * 30 + Math.random() * 20;
    const normalizedScore = Math.max(0, Math.min(100, score));

    cells.push({
      timestamp: new Date(current),
      score: normalizedScore,
      color: scoreToColor(normalizedScore),
      events: [],
      tooltip: `Score: ${normalizedScore.toFixed(1)}`,
    });

    increment[granularity]();
  }

  return {
    startDate,
    endDate,
    granularity,
    cells,
    legend: {
      min: 0,
      max: 100,
      colorScale: ['#ff4444', '#ffaa44', '#ffff44', '#44ff44', '#44ffaa'],
    },
  };
}

/**
 * Convert score to color
 */
function scoreToColor(score: number): string {
  if (score >= 80) return '#44ffaa';
  if (score >= 60) return '#44ff44';
  if (score >= 40) return '#ffff44';
  if (score >= 20) return '#ffaa44';
  return '#ff4444';
}

// ============================================================================
// 🜅 5. STORY & RITUAL DEBUGGER (故事与仪式调试器)
// ============================================================================

/**
 * Analyze story for debugging
 */
export function analyzeStoryForDebug(
  beats: Array<{ id: string; type: string; content: unknown }>,
  chapters: Array<{ id: string; type: string; beatIds: string[] }>,
  arcs: Array<{ id: string; type: string; chapterIds: string[] }>
): StoryDebugAnalysis {
  const beatAnalysis: BeatDebugInfo[] = beats.map(beat => ({
    beatId: beat.id,
    beatType: beat.type,
    classification: {
      method: 'rule-based',
      confidence: 0.85,
      alternatives: [],
    },
    reasons: [
      {
        factor: 'timing_score',
        weight: 0.3,
        value: 65,
        contribution: 0.2,
        description: 'Timing score indicates stable period',
      },
    ],
    timing: {
      score: 65,
      dip: false,
    },
    environment: {
      clashes: [],
      support: ['Wood element support'],
    },
    lifecycle: {
      current: 'Growth',
    },
  }));

  const chapterAnalysis: ChapterDebugInfo[] = chapters.map(chapter => ({
    chapterId: chapter.id,
    chapterType: chapter.type,
    beats: chapter.beatIds,
    groupingLogic: {
      method: 'emotional-coherence',
      thresholds: { emotionalRange: 30 },
      boundaryReasons: ['Emotional shift detected'],
    },
    emotionalRange: { min: 30, max: 70 },
    narrativeCoherence: 0.85,
  }));

  const arcAnalysis: ArcDebugInfo[] = arcs.map(arc => ({
    arcId: arc.id,
    arcType: arc.type,
    chapters: arc.chapterIds,
    arcPattern: 'Transformation',
    patternMatch: 0.78,
    keyMoments: [
      { position: 0.25, type: 'inciting_incident', description: 'Initial challenge' },
      { position: 0.5, type: 'midpoint', description: 'Major revelation' },
      { position: 0.75, type: 'climax', description: 'Peak tension' },
    ],
  }));

  const emotionalArc: EmotionalArcDebug = {
    dataPoints: beats.map((_, i) => ({
      position: i / (beats.length - 1 || 1),
      value: 50 + Math.sin(i / 3) * 30,
      label: `Beat ${i + 1}`,
    })),
    peaks: [0.5],
    valleys: [0.25, 0.75],
    trend: 'fluctuating',
    emotionalRange: 60,
    catharsisMoments: [0.9],
  };

  return {
    beatAnalysis,
    chapterAnalysis,
    arcAnalysis,
    emotionalArc,
    narrativeTone: {
      primaryTone: 'hopeful',
      secondaryTones: ['contemplative'],
      toneSelection: {
        factors: [{ name: 'timing', weight: 0.5, value: 'stable' }],
        alternatives: [{ tone: 'dramatic', score: 0.6 }],
      },
      toneShifts: [],
    },
    archetypeTransformations: [],
    storyWeavingLogic: {
      weavingMethod: 'parallel-threads',
      threadCount: 2,
      threads: [],
      intersections: [],
      coherenceScore: 0.85,
    },
  };
}

/**
 * Analyze ritual for debugging
 */
export function analyzeRitualForDebug(
  ritualType: string,
  date: Date,
  userChart?: Record<string, unknown>
): RitualDebugAnalysis {
  const timingAnalysis = analyzeTimingForDate(date, userChart);

  const breakdown: RitualScoreBreakdown = {
    timingScore: timingAnalysis.compositeScore,
    environmentalScore: 70,
    directionalScore: 65,
    qiMenScore: 72,
    personalScore: 68,
    compositeScore: 0,
    factors: [
      { name: 'Annual Timing', score: timingAnalysis.layers.annual.score, weight: 0.2, contribution: 0 },
      { name: 'Environmental Alignment', score: 70, weight: 0.25, contribution: 0 },
      { name: 'Directional Harmony', score: 65, weight: 0.15, contribution: 0 },
      { name: 'Qi Men Dun Jia', score: 72, weight: 0.25, contribution: 0 },
      { name: 'Personal Resonance', score: 68, weight: 0.15, contribution: 0 },
    ],
  };

  // Calculate contributions
  breakdown.factors.forEach(f => {
    f.contribution = f.score * f.weight;
  });
  breakdown.compositeScore = breakdown.factors.reduce((sum, f) => sum + f.contribution, 0);

  const analysis: RitualDebugAnalysis = {
    ritualId: generateId(),
    ritualType,
    overallScore: breakdown.compositeScore,
    breakdown,
    environmentalAlignment: {
      yearSha: { direction: 'West', active: false },
      monthSha: { direction: 'North', active: false },
      daySha: { direction: 'South', active: true },
      fengShuiFactors: [
        { name: 'Flying Star 8', direction: 'Southeast', influence: 15 },
      ],
      alignmentScore: 70,
      warnings: ['Avoid South direction today'],
    },
    directionalGuidance: {
      auspiciousDirections: [
        { direction: 'East', score: 85, reason: 'Noble direction active' },
        { direction: 'Southeast', score: 78, reason: 'Prosperity star present' },
      ],
      inauspiciousDirections: [
        { direction: 'South', score: 25, reason: 'Day Sha active' },
      ],
      selectedDirection: 'East',
      selectionReason: 'Highest score with noble support',
    },
    qiMenSelection: {
      palace: 3,
      door: 'Life Door',
      star: 'Heart',
      deity: 'Nine Heavens',
      score: 72,
      selectionLogic: {
        doorScore: 80,
        starScore: 70,
        deityScore: 75,
        palaceScore: 65,
        combinedScore: 72,
      },
      alternatives: [
        { palace: 1, score: 68 },
        { palace: 6, score: 65 },
      ],
    },
    microTimingIntegration: {
      selectedWindow: timingAnalysis.bestWindows[0],
      allWindows: timingAnalysis.bestWindows,
      selectionCriteria: ['Highest composite score', 'Life Door alignment'],
      optimizationApplied: true,
    },
    recommendations: [
      { type: 'do', action: 'Face East during ritual', reason: 'Noble direction', priority: 1 },
      { type: 'do', action: 'Perform during selected time window', reason: 'Optimal timing', priority: 2 },
      { type: 'avoid', action: 'Do not face South', reason: 'Day Sha active', priority: 1 },
    ],
  };

  emitEvent('ritualAnalyzed', 'ritualDebugger', { ritualType, date, analysis });
  return analysis;
}

// ============================================================================
// 🜅 6. DEVTOOLS CONSOLE (开发者控制台)
// ============================================================================

/**
 * Log a console entry
 */
export function log(
  type: ConsoleLogType,
  source: string,
  message: string,
  data?: unknown,
  tags: string[] = []
): ConsoleEntry {
  const entry: ConsoleEntry = {
    id: generateId(),
    timestamp: new Date(),
    type,
    source,
    message,
    data,
    tags,
  };

  consoleEntries.push(entry);

  // Trim to max entries
  while (consoleEntries.length > devToolsConfig.maxLogEntries) {
    consoleEntries.shift();
  }

  // Also log to actual console in development
  if (type === 'error') {
    console.error(`[${source}]`, message, data);
  } else if (type === 'warn') {
    console.warn(`[${source}]`, message, data);
  }

  return entry;
}

/**
 * Log convenience methods
 */
export const devLog = {
  trace: (source: string, message: string, data?: unknown) => log('trace', source, message, data),
  debug: (source: string, message: string, data?: unknown) => log('log', source, message, data),
  info: (source: string, message: string, data?: unknown) => log('info', source, message, data),
  warn: (source: string, message: string, data?: unknown) => log('warn', source, message, data),
  error: (source: string, message: string, data?: unknown) => log('error', source, message, data),
  performance: (source: string, operation: string, duration: number) =>
    log('performance', source, `${operation} completed in ${duration}ms`, { duration }),
  api: (source: string, method: string, endpoint: string, duration: number, status: number) =>
    log('api', source, `${method} ${endpoint} → ${status} (${duration}ms)`, { method, endpoint, duration, status }),
};

/**
 * Record performance metrics
 */
export function recordPerformanceMetrics(
  moduleName: string,
  operation: string,
  duration: number,
  memoryBefore?: number,
  memoryAfter?: number
): PerformanceMetrics {
  const key = `${moduleName}:${operation}`;
  const existing = performanceMetrics.get(key) || [];

  const metrics: PerformanceMetrics = {
    timestamp: new Date(),
    moduleName,
    operation,
    duration,
    memoryBefore: memoryBefore || 0,
    memoryAfter: memoryAfter || 0,
    memoryDelta: (memoryAfter || 0) - (memoryBefore || 0),
    callCount: existing.length + 1,
    avgDuration: 0,
    p95Duration: 0,
    p99Duration: 0,
  };

  existing.push(metrics);

  // Calculate statistics
  const durations = existing.map(m => m.duration).sort((a, b) => a - b);
  metrics.avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  metrics.p95Duration = durations[Math.floor(durations.length * 0.95)] || metrics.duration;
  metrics.p99Duration = durations[Math.floor(durations.length * 0.99)] || metrics.duration;

  performanceMetrics.set(key, existing.slice(-1000)); // Keep last 1000 entries

  // Warn if slow
  if (duration > devToolsConfig.performanceThreshold) {
    emitEvent('performanceWarning', moduleName, {
      operation,
      duration,
      threshold: devToolsConfig.performanceThreshold,
    });
  }

  return metrics;
}

/**
 * Get performance metrics for a module
 */
export function getPerformanceMetrics(moduleName: string): PerformanceMetrics[] {
  const results: PerformanceMetrics[] = [];
  for (const [key, metrics] of performanceMetrics) {
    if (key.startsWith(moduleName + ':')) {
      results.push(...metrics);
    }
  }
  return results;
}

/**
 * Take a memory snapshot
 */
export function takeMemorySnapshot(): MemorySnapshot {
  // In a real implementation, this would use performance.memory or similar
  return {
    timestamp: new Date(),
    heapUsed: 0,
    heapTotal: 0,
    external: 0,
    arrayBuffers: 0,
    byModule: {},
    largestObjects: [],
  };
}

/**
 * Start an orchestration trace
 */
export function startOrchestrationTrace(pipelineId: string, pipelineName: string): OrchestrationTrace {
  const trace: OrchestrationTrace = {
    pipelineId,
    pipelineName,
    startedAt: new Date(),
    status: 'running',
    steps: [],
    errors: [],
  };

  orchestrationTraces.unshift(trace);

  // Keep only recent traces
  while (orchestrationTraces.length > devToolsConfig.maxTraceHistory) {
    orchestrationTraces.pop();
  }

  return trace;
}

/**
 * Add a step to an orchestration trace
 */
export function addOrchestrationStep(
  pipelineId: string,
  stepNumber: number,
  stepId: string,
  stepName: string,
  inputs: Record<string, unknown>
): OrchestrationStepTrace {
  const trace = orchestrationTraces.find(t => t.pipelineId === pipelineId);
  if (!trace) {
    throw new Error(`Trace not found: ${pipelineId}`);
  }

  const step: OrchestrationStepTrace = {
    stepNumber,
    stepId,
    stepName,
    startedAt: new Date(),
    status: 'running',
    inputs,
  };

  trace.steps.push(step);
  return step;
}

/**
 * Complete an orchestration step
 */
export function completeOrchestrationStep(
  pipelineId: string,
  stepId: string,
  outputs: Record<string, unknown>,
  error?: string
): void {
  const trace = orchestrationTraces.find(t => t.pipelineId === pipelineId);
  if (!trace) return;

  const step = trace.steps.find(s => s.stepId === stepId);
  if (!step) return;

  step.completedAt = new Date();
  step.duration = step.completedAt.getTime() - step.startedAt.getTime();
  step.outputs = outputs;

  if (error) {
    step.status = 'failed';
    step.error = error;
    trace.errors.push({ step: stepId, error });
  } else {
    step.status = 'completed';
  }
}

/**
 * Complete an orchestration trace
 */
export function completeOrchestrationTrace(
  pipelineId: string,
  success: boolean
): void {
  const trace = orchestrationTraces.find(t => t.pipelineId === pipelineId);
  if (!trace) return;

  trace.completedAt = new Date();
  trace.totalDuration = trace.completedAt.getTime() - trace.startedAt.getTime();
  trace.status = success ? 'completed' : 'failed';

  emitEvent('pipelineTraced', 'orchestration', {
    pipelineId,
    pipelineName: trace.pipelineName,
    duration: trace.totalDuration,
    success,
    stepCount: trace.steps.length,
  });
}

/**
 * Get orchestration traces
 */
export function getOrchestrationTraces(): OrchestrationTrace[] {
  return [...orchestrationTraces];
}

/**
 * Record an API call
 */
export function recordApiCall(
  method: string,
  endpoint: string,
  source: string,
  duration: number,
  statusCode: number,
  requestData?: unknown,
  responseData?: unknown,
  error?: string
): ApiCallTrace {
  const trace: ApiCallTrace = {
    id: generateId(),
    timestamp: new Date(),
    method,
    endpoint,
    requestData,
    responseData,
    statusCode,
    duration,
    success: statusCode >= 200 && statusCode < 400,
    error,
    source,
  };

  apiCallTraces.unshift(trace);

  // Keep only recent traces
  while (apiCallTraces.length > 1000) {
    apiCallTraces.pop();
  }

  devLog.api(source, method, endpoint, duration, statusCode);

  return trace;
}

/**
 * Get API call traces
 */
export function getApiCallTraces(): ApiCallTrace[] {
  return [...apiCallTraces];
}

/**
 * Get console entries with optional filtering
 */
export function getConsoleEntries(filter?: ConsoleFilterOptions): ConsoleEntry[] {
  let entries = [...consoleEntries];

  if (filter) {
    if (filter.types && filter.types.length > 0) {
      entries = entries.filter(e => filter.types!.includes(e.type));
    }

    if (filter.sources && filter.sources.length > 0) {
      entries = entries.filter(e => filter.sources!.includes(e.source));
    }

    if (filter.searchText) {
      const search = filter.searchText.toLowerCase();
      entries = entries.filter(e =>
        e.message.toLowerCase().includes(search) ||
        e.source.toLowerCase().includes(search)
      );
    }

    if (filter.startTime) {
      entries = entries.filter(e => e.timestamp >= filter.startTime!);
    }

    if (filter.endTime) {
      entries = entries.filter(e => e.timestamp <= filter.endTime!);
    }

    if (filter.tags && filter.tags.length > 0) {
      entries = entries.filter(e =>
        e.tags.some(t => filter.tags!.includes(t))
      );
    }
  }

  return entries;
}

/**
 * Clear console entries
 */
export function clearConsole(): void {
  consoleEntries.length = 0;
}

// ============================================================================
// 🜅 7. DEVTOOLS STATE MANAGEMENT (建筑师之室)
// ============================================================================

/**
 * Initialize DevTools state
 */
export function initializeDevTools(config?: Partial<DevToolsConfig>): DevToolsState {
  devToolsConfig = { ...DEFAULT_DEVTOOLS_CONFIG, ...config };

  const defaultWorkspace: DevToolsWorkspace = {
    id: 'default',
    name: 'Default Workspace',
    panels: [],
    layout: 'tabs',
    theme: 'system',
    savedAt: new Date(),
  };

  devToolsState = {
    isOpen: devToolsConfig.autoOpen,
    workspace: defaultWorkspace,
    moduleInspector: {
      overlayConfig: createDebugOverlayConfig(),
      expandedSections: [],
    },
    flowExplorer: {
      viewType: 'data',
      zoomLevel: 1,
      panOffset: { x: 0, y: 0 },
      showLabels: true,
      showPerformance: false,
    },
    graphViewer: {
      viewMode: 'module',
      layout: {
        type: 'force',
        forceParams: {
          linkDistance: 100,
          chargeStrength: -300,
          centerStrength: 0.1,
        },
      },
      selectedNodes: [],
      expandedNodes: [],
    },
    timingAnalyzer: {
      heatmapRange: {
        start: new Date(),
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      granularity: 'day',
      showEnvironmental: true,
      showQiMen: true,
    },
    storyDebugger: {
      expandedSections: [],
      showEmotionalArc: true,
      showArchetypes: true,
    },
    ritualDebugger: {
      expandedSections: [],
      showEnvironmental: true,
      showQiMen: true,
    },
    orchestrationViewer: {
      traces: [],
      autoRefresh: true,
      refreshInterval: 5000,
    },
    memoryVaultInspector: {
      memories: [],
      sortBy: 'timestamp',
      sortOrder: 'desc',
    },
    console: {
      entries: [],
      filter: {},
      isPaused: false,
      maxEntries: devToolsConfig.maxLogEntries,
      autoScroll: true,
    },
  };

  return devToolsState;
}

/**
 * Get DevTools state
 */
export function getDevToolsState(): DevToolsState | null {
  return devToolsState;
}

/**
 * Toggle DevTools open/closed
 */
export function toggleDevTools(): boolean {
  if (devToolsState) {
    devToolsState.isOpen = !devToolsState.isOpen;
    return devToolsState.isOpen;
  }
  return false;
}

/**
 * Set active panel
 */
export function setActivePanel(panel: DevToolsPanelType): void {
  if (devToolsState) {
    devToolsState.workspace.activePanel = panel;
  }
}

/**
 * Update DevTools configuration
 */
export function updateDevToolsConfig(config: Partial<DevToolsConfig>): DevToolsConfig {
  devToolsConfig = { ...devToolsConfig, ...config };
  return devToolsConfig;
}

/**
 * Get DevTools configuration
 */
export function getDevToolsConfig(): DevToolsConfig {
  return { ...devToolsConfig };
}

/**
 * Save workspace
 */
export function saveWorkspace(name: string): DevToolsWorkspace | null {
  if (!devToolsState) return null;

  devToolsState.workspace.name = name;
  devToolsState.workspace.savedAt = new Date();

  // In production, would persist to localStorage or backend
  return { ...devToolsState.workspace };
}

/**
 * Load workspace
 */
export function loadWorkspace(workspace: DevToolsWorkspace): void {
  if (devToolsState) {
    devToolsState.workspace = workspace;
  }
}

// ============================================================================
// EVENT SYSTEM
// ============================================================================

/**
 * Add an event listener
 */
export function addEventListener(
  type: DevToolsEventType,
  listener: DevToolsEventListener
): () => void {
  if (!eventListeners.has(type)) {
    eventListeners.set(type, new Set());
  }
  eventListeners.get(type)!.add(listener);

  // Return unsubscribe function
  return () => {
    eventListeners.get(type)?.delete(listener);
  };
}

/**
 * Remove an event listener
 */
export function removeEventListener(
  type: DevToolsEventType,
  listener: DevToolsEventListener
): void {
  eventListeners.get(type)?.delete(listener);
}

/**
 * Emit an event
 */
export function emitEvent(
  type: DevToolsEventType,
  source: string,
  data: Record<string, unknown>
): void {
  const event: DevToolsEvent = {
    type,
    timestamp: new Date(),
    source,
    data,
  };

  const listeners = eventListeners.get(type);
  if (listeners) {
    for (const listener of listeners) {
      try {
        listener(event);
      } catch (error) {
        console.error('DevTools event listener error:', error);
      }
    }
  }
}

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

/**
 * Format a debug log for display
 */
export function formatDebugLog(entry: DebugLogEntry): string {
  const time = entry.timestamp.toISOString().split('T')[1].replace('Z', '');
  const level = entry.level.toUpperCase().padEnd(5);
  return `[${time}] ${level} [${entry.module}] ${entry.message}`;
}

/**
 * Format an orchestration trace for display
 */
export function formatOrchestrationTrace(trace: OrchestrationTrace): string[] {
  const lines: string[] = [];
  lines.push(`[TRACE] Pipeline: ${trace.pipelineName}`);

  for (const step of trace.steps) {
    const status = step.status === 'completed' ? '✓' : step.status === 'failed' ? '✗' : '...';
    const duration = step.duration ? `(${step.duration}ms)` : '';
    lines.push(`  ${status} Step ${step.stepNumber}: ${step.stepName} ${duration}`);
  }

  if (trace.totalDuration) {
    lines.push(`  Total: ${trace.totalDuration}ms`);
  }

  return lines;
}

/**
 * Format timing analysis for display
 */
export function formatTimingAnalysis(analysis: TimingAnalysis): string[] {
  const lines: string[] = [];
  lines.push(`[Timing Analyzer]`);
  lines.push(`Date: ${analysis.timestamp.toISOString().split('T')[0]}`);
  lines.push(`- Annual Support: ${analysis.layers.annual.score > 50 ? '+' : ''}${(analysis.layers.annual.score - 50).toFixed(0)}`);
  lines.push(`- Monthly: ${analysis.layers.monthly.score > 50 ? '+' : ''}${(analysis.layers.monthly.score - 50).toFixed(0)}`);
  lines.push(`- Daily: ${analysis.layers.daily.score > 50 ? '+' : ''}${(analysis.layers.daily.score - 50).toFixed(0)}`);
  lines.push(`- Composite Score: ${analysis.compositeScore.toFixed(1)}`);

  if (analysis.bestWindows.length > 0) {
    const best = analysis.bestWindows[0];
    const start = best.start.toTimeString().slice(0, 5);
    const end = best.end.toTimeString().slice(0, 5);
    lines.push(`- Best Window: ${start}–${end}`);
  }

  return lines;
}

/**
 * Format story debug for display
 */
export function formatStoryDebug(beat: BeatDebugInfo): string[] {
  const lines: string[] = [];
  lines.push(`[Story Debugger]`);
  lines.push(`Beat Type: ${beat.beatType}`);
  lines.push(`Reason:`);

  for (const reason of beat.reasons) {
    lines.push(`  - ${reason.description}`);
  }

  if (beat.timing.dip) {
    lines.push(`  - Timing Score Dip (${beat.timing.dipMagnitude || 0})`);
  }

  lines.push(`Lifecycle: ${beat.lifecycle.current}${beat.lifecycle.transition ? ` → ${beat.lifecycle.transition}` : ''}`);

  return lines;
}
