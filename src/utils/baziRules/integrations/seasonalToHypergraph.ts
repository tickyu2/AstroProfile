/**
 * ============================================
 * SEASONAL TO HYPERGRAPH INTEGRATION
 * Map Seasonal Strength to Graph Relationships
 *
 * Transforms seasonal analysis into:
 * - Hypergraph node relationships
 * - Temporal energy flows
 * - Seasonal connection weights
 * - Cyclical pattern visualization
 * ============================================
 */

import {
  SeasonalAnalysis,
  SeasonalStrength,
  MonthCommander,
  computeSeasonalStrength,
  getMonthCommander,
  analyzeSeasonalInfluence
} from '../seasonalStrengthEngine';

// ==================== TYPES ====================

export interface HypergraphNode {
  id: string;
  type: 'element' | 'season' | 'branch' | 'energy' | 'activity';
  label: string;
  labelZh: string;
  weight: number; // 0-100
  metadata: Record<string, unknown>;
}

export interface HypergraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: 'produces' | 'controls' | 'supports' | 'weakens' | 'resonates' | 'conflicts';
  weight: number; // 0-100
  label: string;
  labelZh: string;
  bidirectional: boolean;
}

export interface HyperEdge {
  id: string;
  nodes: string[];
  relationship: string;
  relationshipZh: string;
  strength: number;
}

export interface TemporalFlow {
  from: string;
  to: string;
  phase: 'waxing' | 'peak' | 'waning' | 'dormant';
  intensity: number;
  duration: string;
  durationZh: string;
}

export interface SeasonalHypergraph {
  nodes: HypergraphNode[];
  edges: HypergraphEdge[];
  hyperEdges: HyperEdge[];
  temporalFlows: TemporalFlow[];
  centralNode: string;
  seasonalTheme: string;
  seasonalThemeZh: string;
}

// ==================== CONSTANTS ====================

const ELEMENT_PRODUCTION_CYCLE = [
  { from: 'Wood', to: 'Fire' },
  { from: 'Fire', to: 'Earth' },
  { from: 'Earth', to: 'Metal' },
  { from: 'Metal', to: 'Water' },
  { from: 'Water', to: 'Wood' }
];

const ELEMENT_CONTROL_CYCLE = [
  { from: 'Wood', to: 'Earth' },
  { from: 'Fire', to: 'Metal' },
  { from: 'Earth', to: 'Water' },
  { from: 'Metal', to: 'Wood' },
  { from: 'Water', to: 'Fire' }
];

const BRANCH_ELEMENT_MAP: Record<string, string> = {
  Yin: 'Wood', Mao: 'Wood',
  Si: 'Fire', Wu: 'Fire',
  Chen: 'Earth', Xu: 'Earth', Chou: 'Earth', Wei: 'Earth',
  Shen: 'Metal', You: 'Metal',
  Hai: 'Water', Zi: 'Water'
};

const SEASONAL_ACTIVITIES: Record<string, string[]> = {
  Wood: ['planting', 'starting', 'creating', 'learning'],
  Fire: ['promoting', 'celebrating', 'networking', 'performing'],
  Earth: ['consolidating', 'managing', 'building', 'nurturing'],
  Metal: ['harvesting', 'refining', 'organizing', 'completing'],
  Water: ['resting', 'planning', 'reflecting', 'researching']
};

// ==================== CORE FUNCTIONS ====================

/**
 * Generate seasonal hypergraph from month branch
 */
export function generateSeasonalHypergraph(monthBranch: string): SeasonalHypergraph {
  const analysis = analyzeSeasonalInfluence(monthBranch);
  const commander = analysis.commander;

  const nodes = generateNodes(analysis);
  const edges = generateEdges(analysis);
  const hyperEdges = generateHyperEdges(analysis);
  const temporalFlows = generateTemporalFlows(analysis);

  return {
    nodes,
    edges,
    hyperEdges,
    temporalFlows,
    centralNode: commander.commanderElement,
    seasonalTheme: `${commander.season} - ${commander.commanderElement} commands`,
    seasonalThemeZh: `${commander.seasonZh} - ${getElementZh(commander.commanderElement)}主令`
  };
}

/**
 * Generate nodes for hypergraph
 */
function generateNodes(analysis: SeasonalAnalysis): HypergraphNode[] {
  const nodes: HypergraphNode[] = [];

  // Element nodes
  analysis.elementStrengths.forEach(es => {
    nodes.push({
      id: `element-${es.element}`,
      type: 'element',
      label: es.element,
      labelZh: getElementZh(es.element),
      weight: es.strength,
      metadata: {
        status: es.status,
        statusZh: es.statusZh,
        isProsperus: es.strength === 100,
        isDead: es.strength === 10
      }
    });
  });

  // Season node
  nodes.push({
    id: `season-${analysis.commander.monthBranch}`,
    type: 'season',
    label: analysis.commander.season,
    labelZh: analysis.commander.seasonZh,
    weight: 100,
    metadata: {
      commander: analysis.commander.commanderElement,
      monthBranch: analysis.commander.monthBranch
    }
  });

  // Branch node
  nodes.push({
    id: `branch-${analysis.commander.monthBranch}`,
    type: 'branch',
    label: analysis.commander.monthBranch,
    labelZh: getBranchZh(analysis.commander.monthBranch),
    weight: 80,
    metadata: {
      element: BRANCH_ELEMENT_MAP[analysis.commander.monthBranch]
    }
  });

  // Activity nodes
  const activities = SEASONAL_ACTIVITIES[analysis.commander.commanderElement] || [];
  activities.forEach((activity, idx) => {
    nodes.push({
      id: `activity-${activity}`,
      type: 'activity',
      label: activity,
      labelZh: getActivityZh(activity),
      weight: 80 - idx * 10,
      metadata: {
        favorable: true,
        element: analysis.commander.commanderElement
      }
    });
  });

  return nodes;
}

/**
 * Generate edges for hypergraph
 */
function generateEdges(analysis: SeasonalAnalysis): HypergraphEdge[] {
  const edges: HypergraphEdge[] = [];
  let edgeId = 0;

  // Production cycle edges
  ELEMENT_PRODUCTION_CYCLE.forEach(({ from, to }) => {
    const fromStrength = analysis.elementStrengths.find(e => e.element === from)?.strength || 50;
    const toStrength = analysis.elementStrengths.find(e => e.element === to)?.strength || 50;

    edges.push({
      id: `edge-${edgeId++}`,
      source: `element-${from}`,
      target: `element-${to}`,
      relationship: 'produces',
      weight: Math.min(fromStrength, 80),
      label: `${from} produces ${to}`,
      labelZh: `${getElementZh(from)}生${getElementZh(to)}`,
      bidirectional: false
    });
  });

  // Control cycle edges
  ELEMENT_CONTROL_CYCLE.forEach(({ from, to }) => {
    const fromStrength = analysis.elementStrengths.find(e => e.element === from)?.strength || 50;

    edges.push({
      id: `edge-${edgeId++}`,
      source: `element-${from}`,
      target: `element-${to}`,
      relationship: 'controls',
      weight: fromStrength >= 80 ? 70 : 30,
      label: `${from} controls ${to}`,
      labelZh: `${getElementZh(from)}克${getElementZh(to)}`,
      bidirectional: false
    });
  });

  // Season to commander element
  edges.push({
    id: `edge-${edgeId++}`,
    source: `season-${analysis.commander.monthBranch}`,
    target: `element-${analysis.commander.commanderElement}`,
    relationship: 'supports',
    weight: 100,
    label: 'Seasonal command',
    labelZh: '季节主令',
    bidirectional: false
  });

  // Commander element to favorable activities
  const activities = SEASONAL_ACTIVITIES[analysis.commander.commanderElement] || [];
  activities.forEach(activity => {
    edges.push({
      id: `edge-${edgeId++}`,
      source: `element-${analysis.commander.commanderElement}`,
      target: `activity-${activity}`,
      relationship: 'resonates',
      weight: 80,
      label: 'Favorable activity',
      labelZh: '有利活动',
      bidirectional: false
    });
  });

  return edges;
}

/**
 * Generate hyper-edges (multi-node relationships)
 */
function generateHyperEdges(analysis: SeasonalAnalysis): HyperEdge[] {
  const hyperEdges: HyperEdge[] = [];

  // Three harmonies groupings
  const harmonies = [
    { nodes: ['Yin', 'Wu', 'Xu'], element: 'Fire' },
    { nodes: ['Si', 'You', 'Chou'], element: 'Metal' },
    { nodes: ['Shen', 'Zi', 'Chen'], element: 'Water' },
    { nodes: ['Hai', 'Mao', 'Wei'], element: 'Wood' }
  ];

  harmonies.forEach((harmony, idx) => {
    if (harmony.nodes.includes(analysis.commander.monthBranch)) {
      hyperEdges.push({
        id: `hyper-${idx}`,
        nodes: harmony.nodes.map(n => `branch-${n}`),
        relationship: `Three Harmony to ${harmony.element}`,
        relationshipZh: `三合${getElementZh(harmony.element)}局`,
        strength: 80
      });
    }
  });

  // Seasonal element grouping
  const prosperousElement = analysis.prosperousElement;
  const supportingElements: string[] = [];

  // Find elements that support the prosperous element
  ELEMENT_PRODUCTION_CYCLE.forEach(({ from, to }) => {
    if (to === prosperousElement) {
      supportingElements.push(from);
    }
  });

  if (supportingElements.length > 0) {
    hyperEdges.push({
      id: `hyper-support`,
      nodes: [...supportingElements, prosperousElement].map(e => `element-${e}`),
      relationship: 'Seasonal Support Chain',
      relationshipZh: '季节支持链',
      strength: 70
    });
  }

  return hyperEdges;
}

/**
 * Generate temporal flows
 */
function generateTemporalFlows(analysis: SeasonalAnalysis): TemporalFlow[] {
  const flows: TemporalFlow[] = [];
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const commanderIdx = elements.indexOf(analysis.commander.commanderElement);

  elements.forEach((element, idx) => {
    const strength = analysis.elementStrengths.find(e => e.element === element)?.strength || 50;

    let phase: TemporalFlow['phase'];
    if (strength === 100) phase = 'peak';
    else if (strength === 80) phase = 'waxing';
    else if (strength === 30) phase = 'waning';
    else if (strength === 10) phase = 'dormant';
    else phase = 'waning';

    // Flow to next element in cycle
    const nextIdx = (idx + 1) % 5;
    const nextElement = elements[nextIdx];

    flows.push({
      from: element,
      to: nextElement,
      phase,
      intensity: strength,
      duration: getFlowDuration(phase),
      durationZh: getFlowDurationZh(phase)
    });
  });

  return flows;
}

// ==================== UTILITY FUNCTIONS ====================

function getElementZh(element: string): string {
  const map: Record<string, string> = {
    Wood: '木', Fire: '火', Earth: '土', Metal: '金', Water: '水'
  };
  return map[element] || element;
}

function getBranchZh(branch: string): string {
  const map: Record<string, string> = {
    Zi: '子', Chou: '丑', Yin: '寅', Mao: '卯',
    Chen: '辰', Si: '巳', Wu: '午', Wei: '未',
    Shen: '申', You: '酉', Xu: '戌', Hai: '亥'
  };
  return map[branch] || branch;
}

function getActivityZh(activity: string): string {
  const map: Record<string, string> = {
    planting: '播种', starting: '开始', creating: '创造', learning: '学习',
    promoting: '推广', celebrating: '庆祝', networking: '社交', performing: '表演',
    consolidating: '整合', managing: '管理', building: '建设', nurturing: '滋养',
    harvesting: '收获', refining: '精炼', organizing: '组织', completing: '完成',
    resting: '休息', planning: '规划', reflecting: '反思', researching: '研究'
  };
  return map[activity] || activity;
}

function getFlowDuration(phase: TemporalFlow['phase']): string {
  const durations: Record<string, string> = {
    peak: 'Full season (3 months)',
    waxing: 'Rising (2 months)',
    waning: 'Declining (2 months)',
    dormant: 'Resting (transition)'
  };
  return durations[phase] || 'Variable';
}

function getFlowDurationZh(phase: TemporalFlow['phase']): string {
  const durations: Record<string, string> = {
    peak: '整季（3个月）',
    waxing: '上升期（2个月）',
    waning: '下降期（2个月）',
    dormant: '休息（过渡期）'
  };
  return durations[phase] || '可变';
}

/**
 * Get graph visualization data
 */
export function getVisualizationData(graph: SeasonalHypergraph): {
  nodes: Array<{ id: string; label: string; size: number; color: string }>;
  edges: Array<{ source: string; target: string; weight: number; style: string }>;
} {
  const colorMap: Record<string, string> = {
    Wood: '#4CAF50',
    Fire: '#F44336',
    Earth: '#FF9800',
    Metal: '#9E9E9E',
    Water: '#2196F3'
  };

  const nodes = graph.nodes.map(n => ({
    id: n.id,
    label: n.label,
    size: n.weight / 10,
    color: n.type === 'element' ? colorMap[n.label] || '#666' : '#999'
  }));

  const edges = graph.edges.map(e => ({
    source: e.source,
    target: e.target,
    weight: e.weight / 100,
    style: e.relationship === 'controls' ? 'dashed' : 'solid'
  }));

  return { nodes, edges };
}

/**
 * Find strongest connections for an element
 */
export function findStrongestConnections(
  graph: SeasonalHypergraph,
  elementId: string
): HypergraphEdge[] {
  return graph.edges
    .filter(e => e.source === elementId || e.target === elementId)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5);
}

/**
 * Get seasonal energy summary
 */
export function getSeasonalEnergySummary(graph: SeasonalHypergraph): {
  dominant: string;
  rising: string[];
  falling: string[];
  dormant: string;
} {
  const flows = graph.temporalFlows;

  return {
    dominant: flows.find(f => f.phase === 'peak')?.from || graph.centralNode,
    rising: flows.filter(f => f.phase === 'waxing').map(f => f.from),
    falling: flows.filter(f => f.phase === 'waning').map(f => f.from),
    dormant: flows.find(f => f.phase === 'dormant')?.from || ''
  };
}

// ==================== EXPORTS ====================

export {
  generateSeasonalHypergraph,
  getVisualizationData,
  findStrongestConnections,
  getSeasonalEnergySummary,
  ELEMENT_PRODUCTION_CYCLE,
  ELEMENT_CONTROL_CYCLE,
  BRANCH_ELEMENT_MAP
};
