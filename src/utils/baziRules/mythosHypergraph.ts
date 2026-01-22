/**
 * ============================================
 * MYTHOS CODEX HYPERGRAPH
 * A hypergraph that maps archetypal interconnections:
 * - Archetype → Themes
 * - Archetype → Shadow
 * - Archetype → Gifts
 * - Archetype → Other Archetypes (shared themes)
 * - Archetype → Generational Threads
 *
 * This is the mythic relational intelligence of the Codex.
 * ============================================
 */

import { AncestralArchetype } from './mythosLayer';
import { GenerationalThread } from './generationalLadder';

// ==================== DATA MODEL ====================

export type HypergraphNodeType = 'archetype' | 'theme' | 'shadow' | 'gift' | 'thread' | 'generation';

export interface HypergraphNode {
  id: string;
  label: string;
  labelZh?: string;
  type: HypergraphNodeType;
  weight: number;         // 0-100, importance/centrality
  metadata?: Record<string, unknown>;
}

export type HypergraphRelation =
  | 'expresses'           // archetype → theme
  | 'shadow_of'           // archetype → shadow
  | 'gift_of'             // archetype → gift
  | 'shares_theme'        // archetype → archetype
  | 'manifests_in'        // archetype → generation
  | 'thread_of'           // thread → archetype
  | 'opposes'             // archetype → archetype (shadow conflict)
  | 'complements';        // archetype → archetype (gift synergy)

export interface HypergraphEdge {
  id: string;
  from: string;
  to: string;
  relation: HypergraphRelation;
  weight: number;         // 0-100, strength of connection
  bidirectional: boolean;
  metadata?: Record<string, unknown>;
}

export interface MythosHypergraph {
  id: string;
  nodes: HypergraphNode[];
  edges: HypergraphEdge[];
  metadata: {
    archetypeCount: number;
    themeCount: number;
    shadowCount: number;
    giftCount: number;
    edgeCount: number;
    density: number;      // edges / (nodes * (nodes-1))
  };
}

// ==================== HYPERGRAPH BUILDER ====================

/**
 * Build a hypergraph from archetypes
 */
export function buildMythosHypergraph(
  archetypes: AncestralArchetype[],
  threads?: GenerationalThread[]
): MythosHypergraph {
  const nodes: HypergraphNode[] = [];
  const edges: HypergraphEdge[] = [];
  const nodeIds = new Set<string>();

  // Helper to add node if not exists
  const addNode = (node: HypergraphNode) => {
    if (!nodeIds.has(node.id)) {
      nodes.push(node);
      nodeIds.add(node.id);
    }
  };

  // Helper to add edge
  let edgeIdx = 0;
  const addEdge = (from: string, to: string, relation: HypergraphRelation, weight: number = 50, bidirectional: boolean = false) => {
    edges.push({
      id: `edge-${edgeIdx++}`,
      from,
      to,
      relation,
      weight,
      bidirectional
    });
  };

  // 1. Add archetype nodes
  archetypes.forEach(arch => {
    addNode({
      id: arch.id,
      label: arch.name,
      labelZh: arch.nameZh,
      type: 'archetype',
      weight: 80,
      metadata: { generationIndex: arch.generationIndex }
    });

    // 2. Add theme nodes and edges
    arch.themes.forEach(theme => {
      const themeId = `theme-${theme.toLowerCase().replace(/\s+/g, '-')}`;
      addNode({
        id: themeId,
        label: theme,
        type: 'theme',
        weight: 60
      });
      addEdge(arch.id, themeId, 'expresses', 70);
    });

    // 3. Add shadow nodes and edges
    arch.shadow.forEach(shadow => {
      const shadowId = `shadow-${shadow.toLowerCase().replace(/\s+/g, '-')}`;
      addNode({
        id: shadowId,
        label: shadow,
        type: 'shadow',
        weight: 50
      });
      addEdge(arch.id, shadowId, 'shadow_of', 60);
    });

    // 4. Add gift nodes and edges
    arch.gifts.forEach(gift => {
      const giftId = `gift-${gift.toLowerCase().replace(/\s+/g, '-')}`;
      addNode({
        id: giftId,
        label: gift,
        type: 'gift',
        weight: 55
      });
      addEdge(arch.id, giftId, 'gift_of', 65);
    });

    // 5. Add generation nodes and edges
    if (arch.generationIndex !== undefined) {
      const genId = `generation-${arch.generationIndex}`;
      addNode({
        id: genId,
        label: `Generation ${arch.generationIndex}`,
        labelZh: `第${arch.generationIndex}代`,
        type: 'generation',
        weight: 40
      });
      addEdge(arch.id, genId, 'manifests_in', 50);
    }
  });

  // 6. Add inter-archetype connections (shared themes)
  archetypes.forEach(a1 => {
    archetypes.forEach(a2 => {
      if (a1.id === a2.id) return;

      const sharedThemes = a1.themes.filter(t =>
        a2.themes.some(t2 => t.toLowerCase() === t2.toLowerCase())
      );

      if (sharedThemes.length > 0) {
        addEdge(a1.id, a2.id, 'shares_theme', Math.min(100, sharedThemes.length * 30), true);
      }

      // Check for shadow/gift opposition or complementarity
      const shadowGiftOverlap = a1.shadow.filter(s =>
        a2.gifts.some(g => s.toLowerCase().includes(g.toLowerCase()) || g.toLowerCase().includes(s.toLowerCase()))
      );

      if (shadowGiftOverlap.length > 0) {
        addEdge(a1.id, a2.id, 'complements', 40);
      }
    });
  });

  // 7. Add thread connections if provided
  if (threads) {
    threads.forEach((thread, idx) => {
      const threadId = `thread-${idx}-${thread.theme.toLowerCase().replace(/\s+/g, '-')}`;
      addNode({
        id: threadId,
        label: `Thread: ${thread.theme}`,
        type: 'thread',
        weight: thread.intensity
      });

      // Connect thread to relevant archetypes
      archetypes.forEach(arch => {
        const hasTheme = arch.themes.some(t =>
          t.toLowerCase().includes(thread.theme.toLowerCase()) ||
          thread.theme.toLowerCase().includes(t.toLowerCase())
        );

        if (hasTheme) {
          addEdge(threadId, arch.id, 'thread_of', thread.intensity);
        }
      });
    });
  }

  // Calculate metadata
  const archetypeCount = nodes.filter(n => n.type === 'archetype').length;
  const themeCount = nodes.filter(n => n.type === 'theme').length;
  const shadowCount = nodes.filter(n => n.type === 'shadow').length;
  const giftCount = nodes.filter(n => n.type === 'gift').length;
  const density = nodes.length > 1
    ? edges.length / (nodes.length * (nodes.length - 1))
    : 0;

  return {
    id: `hypergraph-${Date.now()}`,
    nodes,
    edges,
    metadata: {
      archetypeCount,
      themeCount,
      shadowCount,
      giftCount,
      edgeCount: edges.length,
      density
    }
  };
}

// ==================== QUERY FUNCTIONS ====================

/**
 * Get nodes by type
 */
export function getNodesByType(
  graph: MythosHypergraph,
  type: HypergraphNodeType
): HypergraphNode[] {
  return graph.nodes.filter(n => n.type === type);
}

/**
 * Get edges by relation
 */
export function getEdgesByRelation(
  graph: MythosHypergraph,
  relation: HypergraphRelation
): HypergraphEdge[] {
  return graph.edges.filter(e => e.relation === relation);
}

/**
 * Get neighbors of a node
 */
export function getNeighbors(
  graph: MythosHypergraph,
  nodeId: string
): HypergraphNode[] {
  const neighborIds = new Set<string>();

  graph.edges.forEach(edge => {
    if (edge.from === nodeId) {
      neighborIds.add(edge.to);
    }
    if (edge.to === nodeId && edge.bidirectional) {
      neighborIds.add(edge.from);
    }
  });

  return graph.nodes.filter(n => neighborIds.has(n.id));
}

/**
 * Get edges connected to a node
 */
export function getNodeEdges(
  graph: MythosHypergraph,
  nodeId: string
): HypergraphEdge[] {
  return graph.edges.filter(e =>
    e.from === nodeId || (e.to === nodeId && e.bidirectional)
  );
}

/**
 * Find shortest path between two nodes
 */
export function findPath(
  graph: MythosHypergraph,
  fromId: string,
  toId: string
): string[] | null {
  const visited = new Set<string>();
  const queue: { id: string; path: string[] }[] = [{ id: fromId, path: [fromId] }];

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.id === toId) {
      return current.path;
    }

    if (visited.has(current.id)) continue;
    visited.add(current.id);

    const neighbors = getNeighbors(graph, current.id);
    neighbors.forEach(neighbor => {
      if (!visited.has(neighbor.id)) {
        queue.push({
          id: neighbor.id,
          path: [...current.path, neighbor.id]
        });
      }
    });
  }

  return null;
}

/**
 * Get subgraph for a specific theme
 */
export function getThemeSubgraph(
  graph: MythosHypergraph,
  theme: string
): MythosHypergraph {
  const themeNode = graph.nodes.find(n =>
    n.type === 'theme' && n.label.toLowerCase().includes(theme.toLowerCase())
  );

  if (!themeNode) {
    return { ...graph, nodes: [], edges: [], metadata: { ...graph.metadata, edgeCount: 0, density: 0 } };
  }

  const relevantNodeIds = new Set<string>([themeNode.id]);

  // Find all archetypes connected to this theme
  graph.edges.forEach(edge => {
    if (edge.to === themeNode.id && edge.relation === 'expresses') {
      relevantNodeIds.add(edge.from);
    }
  });

  // Find all other nodes connected to those archetypes
  graph.edges.forEach(edge => {
    if (relevantNodeIds.has(edge.from)) {
      relevantNodeIds.add(edge.to);
    }
  });

  const subNodes = graph.nodes.filter(n => relevantNodeIds.has(n.id));
  const subEdges = graph.edges.filter(e =>
    relevantNodeIds.has(e.from) && relevantNodeIds.has(e.to)
  );

  return {
    id: `subgraph-theme-${theme}`,
    nodes: subNodes,
    edges: subEdges,
    metadata: {
      ...graph.metadata,
      edgeCount: subEdges.length,
      density: subNodes.length > 1 ? subEdges.length / (subNodes.length * (subNodes.length - 1)) : 0
    }
  };
}

/**
 * Calculate node centrality (degree centrality)
 */
export function calculateCentrality(
  graph: MythosHypergraph
): Map<string, number> {
  const centrality = new Map<string, number>();

  graph.nodes.forEach(node => {
    const degree = graph.edges.filter(e =>
      e.from === node.id || e.to === node.id
    ).length;
    centrality.set(node.id, degree);
  });

  // Normalize to 0-100
  const maxDegree = Math.max(...centrality.values());
  centrality.forEach((value, key) => {
    centrality.set(key, maxDegree > 0 ? Math.round((value / maxDegree) * 100) : 0);
  });

  return centrality;
}

/**
 * Get most central nodes
 */
export function getMostCentralNodes(
  graph: MythosHypergraph,
  topN: number = 5
): HypergraphNode[] {
  const centrality = calculateCentrality(graph);

  return [...graph.nodes]
    .sort((a, b) => (centrality.get(b.id) || 0) - (centrality.get(a.id) || 0))
    .slice(0, topN);
}

// ==================== FORMATTING ====================

/**
 * Format hypergraph for display
 */
export function formatHypergraphForDisplay(
  graph: MythosHypergraph,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];

  lines.push('═══════════════════════════════════════');
  lines.push(lang === 'zh' ? '🕸️ 神话超图' : '🕸️ Mythos Hypergraph');
  lines.push('═══════════════════════════════════════');
  lines.push('');

  lines.push(lang === 'zh' ? '## 统计' : '## Statistics');
  lines.push(`${lang === 'zh' ? '原型' : 'Archetypes'}: ${graph.metadata.archetypeCount}`);
  lines.push(`${lang === 'zh' ? '主题' : 'Themes'}: ${graph.metadata.themeCount}`);
  lines.push(`${lang === 'zh' ? '阴影' : 'Shadows'}: ${graph.metadata.shadowCount}`);
  lines.push(`${lang === 'zh' ? '天赋' : 'Gifts'}: ${graph.metadata.giftCount}`);
  lines.push(`${lang === 'zh' ? '连接' : 'Connections'}: ${graph.metadata.edgeCount}`);
  lines.push(`${lang === 'zh' ? '密度' : 'Density'}: ${(graph.metadata.density * 100).toFixed(1)}%`);
  lines.push('');

  lines.push('---');
  lines.push(lang === 'zh' ? '## 原型节点' : '## Archetype Nodes');
  lines.push('');

  const archetypeNodes = getNodesByType(graph, 'archetype');
  archetypeNodes.forEach(node => {
    const label = lang === 'zh' && node.labelZh ? node.labelZh : node.label;
    const neighbors = getNeighbors(graph, node.id);
    lines.push(`• ${label} (${lang === 'zh' ? '连接' : 'connections'}: ${neighbors.length})`);
  });

  lines.push('');
  lines.push('═══════════════════════════════════════');

  return lines.join('\n');
}

/**
 * Export hypergraph as JSON for visualization
 */
export function exportHypergraphForVisualization(
  graph: MythosHypergraph
): { nodes: object[]; edges: object[] } {
  return {
    nodes: graph.nodes.map(n => ({
      id: n.id,
      label: n.label,
      group: n.type,
      value: n.weight
    })),
    edges: graph.edges.map(e => ({
      from: e.from,
      to: e.to,
      label: e.relation,
      value: e.weight,
      arrows: e.bidirectional ? 'to,from' : 'to'
    }))
  };
}

// ==================== EXPORTS ====================

export {
  buildMythosHypergraph,
  getNodesByType,
  getEdgesByRelation,
  getNeighbors,
  getNodeEdges,
  findPath,
  getThemeSubgraph,
  calculateCentrality,
  getMostCentralNodes,
  formatHypergraphForDisplay,
  exportHypergraphForVisualization
};
