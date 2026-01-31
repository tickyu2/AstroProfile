/**
 * ============================================================================
 * CATHEDRAL KNOWLEDGE GRAPH - SERVICE LAYER (大教堂知识图谱服务)
 * ============================================================================
 *
 * The librarian of the cathedral.
 * Query, traverse, search, and inspect the knowledge graph.
 *
 * Key Functions:
 * - getNode, getEdge - Basic retrieval
 * - getNeighbors, getPath - Graph traversal
 * - search - Full-text search
 * - inspect - Deep node analysis
 * - generateVisualization - Data for UI
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  CathedralKnowledgeGraph,
  KGNode,
  KGEdge,
  NodeCategory,
  EdgeRelation,
  GraphQueryOptions,
  GraphQueryResult,
  GraphPath,
  ForceGraphData,
  ForceGraphNode,
  ForceGraphLink,
  TreeData,
  SankeyData,
  NodeInspection,
  ModuleDocumentation,
  GraphSearchResult,
  GraphSearchOptions,
  GraphDiff,
  NamedSubgraph
} from './cathedralGraphTypes';

import {
  NODE_CATEGORY_COLORS,
  EDGE_RELATION_COLORS
} from './cathedralGraphTypes';

import { CATHEDRAL_KNOWLEDGE_GRAPH } from './cathedralGraph';

// ============================================================================
// BASIC RETRIEVAL
// ============================================================================

/**
 * Get a node by ID
 */
export function getNode(nodeId: string, graph = CATHEDRAL_KNOWLEDGE_GRAPH): KGNode | undefined {
  return graph.nodes.find(n => n.id === nodeId);
}

/**
 * Get multiple nodes by IDs
 */
export function getNodes(nodeIds: string[], graph = CATHEDRAL_KNOWLEDGE_GRAPH): KGNode[] {
  return graph.nodes.filter(n => nodeIds.includes(n.id));
}

/**
 * Get an edge by ID
 */
export function getEdge(edgeId: string, graph = CATHEDRAL_KNOWLEDGE_GRAPH): KGEdge | undefined {
  return graph.edges.find(e => e.id === edgeId);
}

/**
 * Get all nodes in a category
 */
export function getNodesByCategory(
  category: NodeCategory,
  graph = CATHEDRAL_KNOWLEDGE_GRAPH
): KGNode[] {
  return graph.nodes.filter(n => n.category === category);
}

/**
 * Get all edges of a relation type
 */
export function getEdgesByRelation(
  relation: EdgeRelation,
  graph = CATHEDRAL_KNOWLEDGE_GRAPH
): KGEdge[] {
  return graph.edges.filter(e => e.relation === relation);
}

/**
 * Get a named subgraph
 */
export function getSubgraph(
  subgraphId: string,
  graph = CATHEDRAL_KNOWLEDGE_GRAPH
): NamedSubgraph | undefined {
  return graph.subgraphs.find(s => s.id === subgraphId);
}

/**
 * Get nodes and edges for a named subgraph
 */
export function getSubgraphData(
  subgraphId: string,
  graph = CATHEDRAL_KNOWLEDGE_GRAPH
): { nodes: KGNode[]; edges: KGEdge[] } | undefined {
  const subgraph = getSubgraph(subgraphId, graph);
  if (!subgraph) return undefined;

  const nodes = graph.nodes.filter(n => subgraph.nodeIds.includes(n.id));
  const edges = graph.edges.filter(e => subgraph.edgeIds.includes(e.id));

  return { nodes, edges };
}

// ============================================================================
// GRAPH TRAVERSAL
// ============================================================================

/**
 * Get neighboring nodes (directly connected)
 */
export function getNeighbors(
  nodeId: string,
  direction: 'outgoing' | 'incoming' | 'both' = 'both',
  graph = CATHEDRAL_KNOWLEDGE_GRAPH
): { node: KGNode; edge: KGEdge; direction: 'outgoing' | 'incoming' }[] {
  const neighbors: { node: KGNode; edge: KGEdge; direction: 'outgoing' | 'incoming' }[] = [];

  for (const edge of graph.edges) {
    if (direction === 'outgoing' || direction === 'both') {
      if (edge.from === nodeId) {
        const node = getNode(edge.to, graph);
        if (node) {
          neighbors.push({ node, edge, direction: 'outgoing' });
        }
      }
    }
    if (direction === 'incoming' || direction === 'both') {
      if (edge.to === nodeId) {
        const node = getNode(edge.from, graph);
        if (node) {
          neighbors.push({ node, edge, direction: 'incoming' });
        }
      }
    }
  }

  return neighbors;
}

/**
 * Get all nodes reachable from a starting node
 */
export function getReachable(
  startNodeId: string,
  maxDepth: number = 10,
  direction: 'outgoing' | 'incoming' | 'both' = 'outgoing',
  graph = CATHEDRAL_KNOWLEDGE_GRAPH
): KGNode[] {
  const visited = new Set<string>();
  const queue: { nodeId: string; depth: number }[] = [{ nodeId: startNodeId, depth: 0 }];

  while (queue.length > 0) {
    const { nodeId, depth } = queue.shift()!;

    if (visited.has(nodeId) || depth > maxDepth) continue;
    visited.add(nodeId);

    const neighbors = getNeighbors(nodeId, direction, graph);
    for (const { node } of neighbors) {
      if (!visited.has(node.id)) {
        queue.push({ nodeId: node.id, depth: depth + 1 });
      }
    }
  }

  return getNodes([...visited], graph);
}

/**
 * Find shortest path between two nodes
 */
export function findPath(
  fromNodeId: string,
  toNodeId: string,
  graph = CATHEDRAL_KNOWLEDGE_GRAPH
): GraphPath | null {
  if (fromNodeId === toNodeId) {
    return {
      id: `path_${fromNodeId}_${toNodeId}`,
      nodeIds: [fromNodeId],
      edgeIds: [],
      length: 0,
      description: 'Same node'
    };
  }

  // BFS for shortest path
  const visited = new Set<string>();
  const queue: { nodeId: string; path: string[]; edges: string[] }[] = [
    { nodeId: fromNodeId, path: [fromNodeId], edges: [] }
  ];

  while (queue.length > 0) {
    const { nodeId, path, edges } = queue.shift()!;

    if (visited.has(nodeId)) continue;
    visited.add(nodeId);

    const neighbors = getNeighbors(nodeId, 'both', graph);
    for (const { node, edge } of neighbors) {
      if (node.id === toNodeId) {
        return {
          id: `path_${fromNodeId}_${toNodeId}`,
          nodeIds: [...path, node.id],
          edgeIds: [...edges, edge.id],
          length: path.length,
          description: `Path from ${fromNodeId} to ${toNodeId}`
        };
      }

      if (!visited.has(node.id)) {
        queue.push({
          nodeId: node.id,
          path: [...path, node.id],
          edges: [...edges, edge.id]
        });
      }
    }
  }

  return null;
}

/**
 * Find all paths between two nodes (up to maxPaths)
 */
export function findAllPaths(
  fromNodeId: string,
  toNodeId: string,
  maxDepth: number = 5,
  maxPaths: number = 10,
  graph = CATHEDRAL_KNOWLEDGE_GRAPH
): GraphPath[] {
  const paths: GraphPath[] = [];

  function dfs(
    currentId: string,
    targetId: string,
    visited: Set<string>,
    path: string[],
    edges: string[],
    depth: number
  ) {
    if (depth > maxDepth || paths.length >= maxPaths) return;

    if (currentId === targetId) {
      paths.push({
        id: `path_${paths.length}`,
        nodeIds: [...path],
        edgeIds: [...edges],
        length: path.length - 1,
        description: `Path ${paths.length + 1}`
      });
      return;
    }

    const neighbors = getNeighbors(currentId, 'outgoing', graph);
    for (const { node, edge } of neighbors) {
      if (!visited.has(node.id)) {
        visited.add(node.id);
        dfs(node.id, targetId, visited, [...path, node.id], [...edges, edge.id], depth + 1);
        visited.delete(node.id);
      }
    }
  }

  const visited = new Set<string>([fromNodeId]);
  dfs(fromNodeId, toNodeId, visited, [fromNodeId], [], 0);

  return paths;
}

// ============================================================================
// QUERY ENGINE
// ============================================================================

/**
 * Query the graph with options
 */
export function query(
  options: GraphQueryOptions,
  graph = CATHEDRAL_KNOWLEDGE_GRAPH
): GraphQueryResult {
  const startTime = Date.now();
  let matchedNodes: KGNode[] = [];
  let matchedEdges: KGEdge[] = [];

  // Start from specified nodes or all nodes
  if (options.startNodes && options.startNodes.length > 0) {
    // Traverse from start nodes
    for (const startId of options.startNodes) {
      const reachable = getReachable(
        startId,
        options.maxDepth || 5,
        options.direction || 'both',
        graph
      );
      matchedNodes.push(...reachable);
    }
    matchedNodes = [...new Map(matchedNodes.map(n => [n.id, n])).values()];
  } else {
    matchedNodes = [...graph.nodes];
  }

  // Filter by category
  if (options.categories && options.categories.length > 0) {
    matchedNodes = matchedNodes.filter(n => options.categories!.includes(n.category));
  }

  // Filter by tags
  if (options.tags && options.tags.length > 0) {
    matchedNodes = matchedNodes.filter(n =>
      n.tags?.some(t => options.tags!.includes(t))
    );
  }

  // Get edges connecting matched nodes
  const nodeIds = new Set(matchedNodes.map(n => n.id));
  matchedEdges = graph.edges.filter(e =>
    nodeIds.has(e.from) && nodeIds.has(e.to)
  );

  // Filter by relation type
  if (options.relations && options.relations.length > 0) {
    matchedEdges = matchedEdges.filter(e => options.relations!.includes(e.relation));
  }

  return {
    nodes: matchedNodes,
    edges: matchedEdges,
    metadata: {
      query: options,
      executionTime: Date.now() - startTime,
      totalNodes: matchedNodes.length,
      totalEdges: matchedEdges.length
    }
  };
}

// ============================================================================
// SEARCH
// ============================================================================

/**
 * Search nodes by text query
 */
export function search(
  options: GraphSearchOptions,
  graph = CATHEDRAL_KNOWLEDGE_GRAPH
): GraphSearchResult[] {
  const { query: searchQuery, categories, limit = 20, includeDescription = true, includeTags = true } = options;
  const lowerQuery = searchQuery.toLowerCase();
  const results: GraphSearchResult[] = [];

  for (const node of graph.nodes) {
    // Category filter
    if (categories && categories.length > 0 && !categories.includes(node.category)) {
      continue;
    }

    let score = 0;
    const matchedFields: string[] = [];

    // Search in ID
    if (node.id.toLowerCase().includes(lowerQuery)) {
      score += 10;
      matchedFields.push('id');
    }

    // Search in label
    if (node.label.toLowerCase().includes(lowerQuery)) {
      score += 15;
      matchedFields.push('label');
    }

    // Search in Chinese label
    if (node.labelChinese.includes(searchQuery)) {
      score += 15;
      matchedFields.push('labelChinese');
    }

    // Search in description
    if (includeDescription && node.description?.toLowerCase().includes(lowerQuery)) {
      score += 5;
      matchedFields.push('description');
    }

    // Search in tags
    if (includeTags && node.tags?.some(t => t.toLowerCase().includes(lowerQuery))) {
      score += 8;
      matchedFields.push('tags');
    }

    if (score > 0) {
      results.push({
        node,
        score,
        matchedFields,
        context: node.description || node.label
      });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit);
}

// ============================================================================
// INSPECTION
// ============================================================================

/**
 * Deep inspection of a node
 */
export function inspect(
  nodeId: string,
  graph = CATHEDRAL_KNOWLEDGE_GRAPH
): NodeInspection | null {
  const node = getNode(nodeId, graph);
  if (!node) return null;

  const neighbors = getNeighbors(nodeId, 'both', graph);

  const inputs = neighbors
    .filter(n => n.direction === 'incoming')
    .map(n => ({ node: n.node, edge: n.edge }));

  const outputs = neighbors
    .filter(n => n.direction === 'outgoing')
    .map(n => ({ node: n.node, edge: n.edge }));

  // Get dependencies (modules this depends on)
  const dependencies = inputs
    .filter(i => i.edge.relation === 'depends_on')
    .map(i => i.node);

  // Get dependents (modules that depend on this)
  const dependents = outputs
    .filter(o => o.edge.relation === 'depends_on')
    .map(o => o.node);

  // Narrative connections
  const narrativeConnections = [
    ...inputs.filter(i => i.node.category === 'narrative').map(i => i.node),
    ...outputs.filter(o => o.node.category === 'narrative').map(o => o.node)
  ];

  // UI surfaces that visualize this
  const visualizedBy = outputs
    .filter(o => o.edge.relation === 'visualizes' || o.node.category === 'ui')
    .map(o => o.node);

  // Calculate dependency depth
  let dependencyDepth = 0;
  let currentDeps = dependencies;
  while (currentDeps.length > 0 && dependencyDepth < 10) {
    dependencyDepth++;
    const nextDeps: KGNode[] = [];
    for (const dep of currentDeps) {
      const depNeighbors = getNeighbors(dep.id, 'incoming', graph);
      for (const n of depNeighbors) {
        if (n.edge.relation === 'depends_on') {
          nextDeps.push(n.node);
        }
      }
    }
    currentDeps = nextDeps;
  }

  return {
    node,
    inputs,
    outputs,
    dependencies,
    dependents,
    narrativeConnections,
    visualizedBy,
    stats: {
      inputCount: inputs.length,
      outputCount: outputs.length,
      dependencyDepth,
      dependentCount: dependents.length
    }
  };
}

/**
 * Generate documentation for a module
 */
export function generateModuleDoc(
  moduleId: string,
  graph = CATHEDRAL_KNOWLEDGE_GRAPH
): ModuleDocumentation | null {
  const module = getNode(moduleId, graph);
  if (!module || module.category !== 'module') return null;

  const inspection = inspect(moduleId, graph);
  if (!inspection) return null;

  // Find input types
  const inputs = inspection.inputs
    .filter(i => i.node.category === 'type' && i.edge.relation === 'consumes')
    .map(i => ({
      type: i.node,
      description: i.edge.description || `Consumes ${i.node.label}`
    }));

  // Add feeds relationships
  const feedsInputs = inspection.inputs
    .filter(i => i.edge.relation === 'feeds')
    .map(i => ({
      type: i.node,
      description: i.edge.description || `Fed by ${i.node.label}`
    }));
  inputs.push(...feedsInputs);

  // Find output types
  const outputs = inspection.outputs
    .filter(o => o.node.category === 'type' && o.edge.relation === 'produces')
    .map(o => ({
      type: o.node,
      description: o.edge.description || `Produces ${o.node.label}`
    }));

  // Determine narrative role
  let narrativeRole = 'No direct narrative connection';
  if (inspection.narrativeConnections.length > 0) {
    narrativeRole = `Connects to: ${inspection.narrativeConnections.map(n => n.label).join(', ')}`;
  }

  return {
    module,
    inputs,
    outputs,
    dependencies: inspection.dependencies,
    dependents: inspection.dependents,
    narrativeRole
  };
}

// ============================================================================
// VISUALIZATION DATA GENERATORS
// ============================================================================

/**
 * Generate force-directed graph data
 */
export function generateForceGraphData(
  nodeIds?: string[],
  graph = CATHEDRAL_KNOWLEDGE_GRAPH
): ForceGraphData {
  const nodes: ForceGraphNode[] = [];
  const links: ForceGraphLink[] = [];

  const filteredNodes = nodeIds
    ? graph.nodes.filter(n => nodeIds.includes(n.id))
    : graph.nodes;

  const nodeIdSet = new Set(filteredNodes.map(n => n.id));

  for (const node of filteredNodes) {
    nodes.push({
      id: node.id,
      label: node.label,
      category: node.category,
      color: NODE_CATEGORY_COLORS[node.category],
      size: node.category === 'module' ? 20 : node.category === 'type' ? 15 : 10
    });
  }

  for (const edge of graph.edges) {
    if (nodeIdSet.has(edge.from) && nodeIdSet.has(edge.to)) {
      links.push({
        id: edge.id,
        source: edge.from,
        target: edge.to,
        relation: edge.relation,
        color: EDGE_RELATION_COLORS[edge.relation],
        strength: edge.strength || 0.5
      });
    }
  }

  return { nodes, links };
}

/**
 * Generate hierarchical tree data
 */
export function generateTreeData(
  rootNodeId: string,
  maxDepth: number = 3,
  direction: 'outgoing' | 'incoming' = 'outgoing',
  graph = CATHEDRAL_KNOWLEDGE_GRAPH
): TreeData | null {
  const rootNode = getNode(rootNodeId, graph);
  if (!rootNode) return null;

  function buildTree(nodeId: string, depth: number, visited: Set<string>): TreeData {
    const node = getNode(nodeId, graph)!;
    const tree: TreeData = {
      id: node.id,
      name: node.label,
      category: node.category
    };

    if (depth < maxDepth) {
      const neighbors = getNeighbors(nodeId, direction, graph);
      const children: TreeData[] = [];

      for (const { node: childNode } of neighbors) {
        if (!visited.has(childNode.id)) {
          visited.add(childNode.id);
          children.push(buildTree(childNode.id, depth + 1, visited));
        }
      }

      if (children.length > 0) {
        tree.children = children;
      }
    }

    return tree;
  }

  const visited = new Set<string>([rootNodeId]);
  return buildTree(rootNodeId, 0, visited);
}

/**
 * Generate Sankey diagram data
 */
export function generateSankeyData(
  subgraphId?: string,
  graph = CATHEDRAL_KNOWLEDGE_GRAPH
): SankeyData {
  let nodes: KGNode[];
  let edges: KGEdge[];

  if (subgraphId) {
    const subgraphData = getSubgraphData(subgraphId, graph);
    if (!subgraphData) {
      nodes = [];
      edges = [];
    } else {
      nodes = subgraphData.nodes;
      edges = subgraphData.edges;
    }
  } else {
    nodes = graph.nodes;
    edges = graph.edges;
  }

  const nodeIndex = new Map<string, number>();
  nodes.forEach((n, i) => nodeIndex.set(n.id, i));

  const sankeyNodes = nodes.map(n => ({
    id: n.id,
    name: n.label,
    category: n.category
  }));

  const sankeyLinks = edges
    .filter(e => nodeIndex.has(e.from) && nodeIndex.has(e.to))
    .map(e => ({
      source: nodeIndex.get(e.from)!,
      target: nodeIndex.get(e.to)!,
      value: e.strength || 1,
      relation: e.relation
    }));

  return { nodes: sankeyNodes, links: sankeyLinks };
}

// ============================================================================
// DIFF FUNCTIONS
// ============================================================================

/**
 * Compare two graph states
 */
export function diffGraphs(
  before: CathedralKnowledgeGraph,
  after: CathedralKnowledgeGraph
): GraphDiff {
  const beforeNodeIds = new Set(before.nodes.map(n => n.id));
  const afterNodeIds = new Set(after.nodes.map(n => n.id));

  const addedNodes = after.nodes.filter(n => !beforeNodeIds.has(n.id));
  const removedNodes = before.nodes.filter(n => !afterNodeIds.has(n.id));

  const modifiedNodes: GraphDiff['modifiedNodes'] = [];
  for (const afterNode of after.nodes) {
    if (beforeNodeIds.has(afterNode.id)) {
      const beforeNode = before.nodes.find(n => n.id === afterNode.id)!;
      const changes: string[] = [];

      if (beforeNode.label !== afterNode.label) changes.push('label');
      if (beforeNode.description !== afterNode.description) changes.push('description');
      if (beforeNode.category !== afterNode.category) changes.push('category');

      if (changes.length > 0) {
        modifiedNodes.push({ before: beforeNode, after: afterNode, changes });
      }
    }
  }

  const beforeEdgeIds = new Set(before.edges.map(e => e.id));
  const afterEdgeIds = new Set(after.edges.map(e => e.id));

  const addedEdges = after.edges.filter(e => !beforeEdgeIds.has(e.id));
  const removedEdges = before.edges.filter(e => !afterEdgeIds.has(e.id));

  return {
    addedNodes,
    removedNodes,
    modifiedNodes,
    addedEdges,
    removedEdges
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get graph statistics
 */
export function getGraphStats(graph = CATHEDRAL_KNOWLEDGE_GRAPH) {
  const stats = {
    totalNodes: graph.nodes.length,
    totalEdges: graph.edges.length,
    nodesByCategory: {} as Record<NodeCategory, number>,
    edgesByRelation: {} as Record<EdgeRelation, number>,
    averageConnections: 0,
    mostConnected: null as KGNode | null,
    leastConnected: null as KGNode | null
  };

  // Count by category
  for (const node of graph.nodes) {
    stats.nodesByCategory[node.category] = (stats.nodesByCategory[node.category] || 0) + 1;
  }

  // Count by relation
  for (const edge of graph.edges) {
    stats.edgesByRelation[edge.relation] = (stats.edgesByRelation[edge.relation] || 0) + 1;
  }

  // Connection analysis
  let totalConnections = 0;
  let maxConnections = 0;
  let minConnections = Infinity;

  for (const node of graph.nodes) {
    const connections = getNeighbors(node.id, 'both', graph).length;
    totalConnections += connections;

    if (connections > maxConnections) {
      maxConnections = connections;
      stats.mostConnected = node;
    }
    if (connections < minConnections) {
      minConnections = connections;
      stats.leastConnected = node;
    }
  }

  stats.averageConnections = totalConnections / graph.nodes.length;

  return stats;
}

/**
 * Validate graph integrity
 */
export function validateGraph(graph = CATHEDRAL_KNOWLEDGE_GRAPH): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  const nodeIds = new Set(graph.nodes.map(n => n.id));

  // Check for duplicate node IDs
  const seenIds = new Set<string>();
  for (const node of graph.nodes) {
    if (seenIds.has(node.id)) {
      errors.push(`Duplicate node ID: ${node.id}`);
    }
    seenIds.add(node.id);
  }

  // Check for orphan edges
  for (const edge of graph.edges) {
    if (!nodeIds.has(edge.from)) {
      errors.push(`Edge ${edge.id} references non-existent 'from' node: ${edge.from}`);
    }
    if (!nodeIds.has(edge.to)) {
      errors.push(`Edge ${edge.id} references non-existent 'to' node: ${edge.to}`);
    }
  }

  // Check for isolated nodes
  for (const node of graph.nodes) {
    const connections = getNeighbors(node.id, 'both', graph);
    if (connections.length === 0) {
      warnings.push(`Isolated node: ${node.id}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Re-export graph data
  CATHEDRAL_KNOWLEDGE_GRAPH
};
