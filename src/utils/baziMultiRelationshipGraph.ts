/**
 * ============================================================================
 * BAZI MULTI-RELATIONSHIP MAPPING ENGINE (多重关系图谱)
 * ============================================================================
 *
 * The relational constellation engine — where your system stops analyzing pairs
 * and begins analyzing networks: families, partners, collaborators, teams,
 * creative duos, founders, mentors, children, and ancestral lines.
 *
 * This module maps:
 * - Nodes = people
 * - Edges = relationship types
 * - Edge weights = synastry scores
 * - Edge colors = harmony/tension
 * - Node fields = individual timing
 * - Composite nodes = relationship entities
 * - Group fields = collective timing
 *
 * Three Layers of Analysis:
 * 1. Pairwise Layer (二元层) - All pair relationships
 * 2. Triadic Layer (三元层) - Three-way resonance patterns
 * 3. Systemic Layer (系统层) - Full constellation field
 *
 * Based on: Classical 命理 network analysis
 * Aligned with: Systems-level metaphysics
 * Created: January 2026
 * ============================================================================
 */

import type { CompositeChart } from './baziCompositeChart';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type Polarity = 'Yang' | 'Yin';
export type StemName = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
export type BranchName = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

/**
 * Pillar structure
 */
export interface Pillar {
  stem: StemName;
  branch: BranchName;
}

/**
 * Four Pillars structure
 */
export interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}

/**
 * Individual node in the relationship graph
 */
export interface RelationshipNode {
  id: string;
  name: string;
  birthDate: Date;
  pillars: FourPillars;
  dayMaster: {
    stem: StemName;
    element: ElementName;
    polarity: Polarity;
  };
  elementDistribution: Record<ElementName, number>;
  usefulGod?: ElementName;
  annoyingGod?: ElementName;
  currentTiming?: NodeTimingContext;
  metadata?: Record<string, unknown>;
}

/**
 * Node timing context
 */
export interface NodeTimingContext {
  luckPillarAge: number;
  luckPillarElement: ElementName;
  annualElement: ElementName;
  overallScore: number;
  favorableTier: 'excellent' | 'good' | 'neutral' | 'challenging' | 'difficult';
}

/**
 * Edge between two nodes (pairwise relationship)
 */
export interface RelationshipEdge {
  id: string;
  nodeA: string;
  nodeB: string;
  synastryScore: number;
  harmonyScore: number;
  tensionScore: number;
  archetype?: string;
  archetypeChinese?: string;
  compositeId?: string;
  nature: 'harmonious' | 'challenging' | 'complex' | 'neutral';
  label?: string;
}

/**
 * Triadic relationship (three-way)
 */
export interface TriadicRelationship {
  id: string;
  nodeA: string;
  nodeB: string;
  nodeC: string;
  tripleHarmony: number;
  tripleTension: number;
  dominantElement: ElementName;
  triadicArchetype: string;
  triadicArchetypeChinese: string;
  resonancePattern: 'convergent' | 'divergent' | 'balanced' | 'volatile';
  compositeTriad?: TriadicComposite;
}

/**
 * Triadic pillar (local type for graph module)
 */
export interface TriadicPillar {
  stem: StemName;
  branch: BranchName;
  stemElement: ElementName;
  branchElement: ElementName;
  combinationMethod: string;
}

/**
 * Triadic Day Master (local type for graph module)
 */
export interface TriadicDayMaster {
  stem: StemName;
  element: ElementName;
  polarity: Polarity;
  strengthScore: number;
  strengthCategory: 'weak' | 'moderate' | 'strong';
  description: string;
}

/**
 * Triadic element distribution (local type for graph module)
 */
export interface TriadicElementDistribution {
  Wood: number;
  Fire: number;
  Earth: number;
  Metal: number;
  Water: number;
  dominant: ElementName;
  deficient: ElementName;
}

/**
 * Triadic composite chart
 */
export interface TriadicComposite {
  pillars: {
    year: TriadicPillar;
    month: TriadicPillar;
    day: TriadicPillar;
    hour: TriadicPillar;
  };
  dayMaster: TriadicDayMaster;
  elementDistribution: TriadicElementDistribution;
  usefulGod: ElementName;
  triadNature: string;
}

/**
 * System-level element distribution
 */
export interface SystemElementDistribution {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
  dominant: ElementName;
  deficient: ElementName;
  balance: 'balanced' | 'slightly_imbalanced' | 'imbalanced' | 'severely_imbalanced';
  interpretation: string;
}

/**
 * System-level Useful God
 */
export interface SystemUsefulGod {
  element: ElementName;
  chineseName: string;
  reason: string;
  stabilizes: string[];
  destabilizes: string[];
  groupNeeds: string[];
}

/**
 * System-level Shen Sha
 */
export interface SystemShenSha {
  name: string;
  chineseName: string;
  nature: 'auspicious' | 'inauspicious' | 'neutral';
  prevalence: number; // How many relationships have this
  meaning: string;
}

/**
 * System timing result
 */
export interface SystemTimingResult {
  year: number;
  systemScore: number;
  systemTier: 'breakthrough' | 'growth' | 'stable' | 'challenging' | 'crisis';
  activatedNodes: string[];
  activatedEdges: string[];
  convergenceLevel: number;
  narrative: string;
}

/**
 * System event trigger
 */
export interface SystemEventTrigger {
  type: 'milestone' | 'breakthrough' | 'crisis' | 'healing' | 'transition';
  typeChinese: string;
  year: number;
  month?: number;
  probability: number;
  tier: 'strong' | 'likely' | 'mild' | 'none';
  affectedNodes: string[];
  affectedEdges: string[];
  description: string;
  narrative: string;
}

/**
 * The complete relationship graph
 */
export interface RelationshipGraph {
  id: string;
  name: string;
  nodes: RelationshipNode[];
  edges: RelationshipEdge[];
  triads: TriadicRelationship[];
  composites: Map<string, CompositeChart>;
  systemField: SystemField;
  systemTiming: SystemTimingResult[];
  systemEvents: SystemEventTrigger[];
  metadata: GraphMetadata;
}

/**
 * System field (collective destiny)
 */
export interface SystemField {
  elementDistribution: SystemElementDistribution;
  usefulGod: SystemUsefulGod;
  annoyingGod: ElementName;
  shenSha: SystemShenSha[];
  collectiveStrengths: string[];
  collectiveVulnerabilities: string[];
  groupDynamics: string;
  karmicPurpose: string;
}

/**
 * Graph metadata
 */
export interface GraphMetadata {
  createdAt: Date;
  nodeCount: number;
  edgeCount: number;
  triadCount: number;
  averageSynastry: number;
  systemHarmony: number;
  systemTension: number;
  dominantArchetype: string;
}

/**
 * Graph visualization config
 */
export interface GraphVisualization {
  nodePositions: Map<string, { x: number; y: number }>;
  edgeColors: Map<string, string>;
  nodeColors: Map<string, string>;
  nodeSizes: Map<string, number>;
  edgeWidths: Map<string, number>;
  layout: 'force' | 'radial' | 'hierarchical' | 'circular';
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Element to Chinese mapping
 */
export const ELEMENT_CHINESE: Record<ElementName, string> = {
  Wood: '木',
  Fire: '火',
  Earth: '土',
  Metal: '金',
  Water: '水'
};

/**
 * Stem to element mapping
 */
export const STEM_ELEMENT: Record<StemName, ElementName> = {
  '甲': 'Wood', '乙': 'Wood',
  '丙': 'Fire', '丁': 'Fire',
  '戊': 'Earth', '己': 'Earth',
  '庚': 'Metal', '辛': 'Metal',
  '壬': 'Water', '癸': 'Water'
};

/**
 * Branch to element mapping
 */
export const BRANCH_ELEMENT: Record<BranchName, ElementName> = {
  '寅': 'Wood', '卯': 'Wood',
  '巳': 'Fire', '午': 'Fire',
  '辰': 'Earth', '丑': 'Earth', '未': 'Earth', '戌': 'Earth',
  '申': 'Metal', '酉': 'Metal',
  '亥': 'Water', '子': 'Water'
};

/**
 * Triadic archetype definitions
 */
export const TRIADIC_ARCHETYPES: Record<string, {
  name: string;
  chineseName: string;
  pattern: string;
  meaning: string;
}> = {
  'creative_trinity': {
    name: 'Creative Trinity',
    chineseName: '创造三元',
    pattern: 'Wood-Fire-Earth dominant',
    meaning: 'A generative trio that creates, nurtures, and manifests together.'
  },
  'power_triangle': {
    name: 'Power Triangle',
    chineseName: '权力三角',
    pattern: 'Metal-Water-Wood dominant',
    meaning: 'A strategic trio with complementary strengths and clear hierarchy.'
  },
  'wisdom_circle': {
    name: 'Wisdom Circle',
    chineseName: '智慧圆环',
    pattern: 'Water-Wood-Fire balanced',
    meaning: 'An intuitive trio that learns, grows, and illuminates together.'
  },
  'stability_foundation': {
    name: 'Stability Foundation',
    chineseName: '稳定根基',
    pattern: 'Earth-Metal-Earth dominant',
    meaning: 'A grounding trio that provides structure, resources, and security.'
  },
  'dynamic_flux': {
    name: 'Dynamic Flux',
    chineseName: '动态变化',
    pattern: 'Fire-Metal-Water volatile',
    meaning: 'A transformative trio with intense energy exchanges and rapid changes.'
  },
  'karmic_knot': {
    name: 'Karmic Knot',
    chineseName: '因缘结',
    pattern: 'High tension + high harmony',
    meaning: 'A fated trio with deep karmic work, mirrors, and transformation.'
  },
  'harmonious_triad': {
    name: 'Harmonious Triad',
    chineseName: '和谐三合',
    pattern: 'Balanced elements, low tension',
    meaning: 'A naturally compatible trio with smooth energy flow.'
  },
  'challenging_triangle': {
    name: 'Challenging Triangle',
    chineseName: '挑战三角',
    pattern: 'High tension, clashing elements',
    meaning: 'A growth-oriented trio that learns through friction and challenge.'
  }
};

/**
 * System event type definitions
 */
export const SYSTEM_EVENT_TYPES: Record<string, {
  name: string;
  chineseName: string;
  meaning: string;
}> = {
  'milestone': {
    name: 'Group Milestone',
    chineseName: '群体里程碑',
    meaning: 'A significant achievement or marker for the entire group.'
  },
  'breakthrough': {
    name: 'Collective Breakthrough',
    chineseName: '集体突破',
    meaning: 'A moment when the group transcends previous limitations.'
  },
  'crisis': {
    name: 'System Crisis',
    chineseName: '系统危机',
    meaning: 'A challenging period requiring collective adaptation.'
  },
  'healing': {
    name: 'Healing Window',
    chineseName: '疗愈窗口',
    meaning: 'A period favorable for collective healing and reconciliation.'
  },
  'transition': {
    name: 'Major Transition',
    chineseName: '重大转变',
    meaning: 'A turning point in the group\'s collective journey.'
  }
};

// ============================================================================
// GRAPH BUILDING FUNCTIONS
// ============================================================================

/**
 * Create a new relationship graph
 */
export function createRelationshipGraph(
  name: string,
  nodes: RelationshipNode[]
): RelationshipGraph {
  const id = `graph_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Build all pairwise edges
  const edges = buildAllEdges(nodes);

  // Build all triadic relationships
  const triads = buildAllTriads(nodes, edges);

  // Create composite charts map
  const composites = new Map<string, CompositeChart>();

  // Build system field
  const systemField = buildSystemField(nodes, edges, triads);

  // Build system timing
  const systemTiming = buildSystemTiming(nodes, edges, systemField);

  // Build system events
  const systemEvents = buildSystemEvents(nodes, edges, systemField, systemTiming);

  // Build metadata
  const metadata = buildGraphMetadata(nodes, edges, triads);

  return {
    id,
    name,
    nodes,
    edges,
    triads,
    composites,
    systemField,
    systemTiming,
    systemEvents,
    metadata
  };
}

/**
 * Add a node to an existing graph
 */
export function addNodeToGraph(
  graph: RelationshipGraph,
  node: RelationshipNode
): RelationshipGraph {
  const updatedNodes = [...graph.nodes, node];

  // Build new edges for this node
  const newEdges: RelationshipEdge[] = [];
  for (const existingNode of graph.nodes) {
    const edge = buildEdge(node, existingNode);
    newEdges.push(edge);
  }

  const updatedEdges = [...graph.edges, ...newEdges];

  // Rebuild triads
  const updatedTriads = buildAllTriads(updatedNodes, updatedEdges);

  // Rebuild system field
  const updatedSystemField = buildSystemField(updatedNodes, updatedEdges, updatedTriads);

  // Rebuild timing and events
  const updatedTiming = buildSystemTiming(updatedNodes, updatedEdges, updatedSystemField);
  const updatedEvents = buildSystemEvents(updatedNodes, updatedEdges, updatedSystemField, updatedTiming);

  // Update metadata
  const updatedMetadata = buildGraphMetadata(updatedNodes, updatedEdges, updatedTriads);

  return {
    ...graph,
    nodes: updatedNodes,
    edges: updatedEdges,
    triads: updatedTriads,
    systemField: updatedSystemField,
    systemTiming: updatedTiming,
    systemEvents: updatedEvents,
    metadata: updatedMetadata
  };
}

/**
 * Remove a node from the graph
 */
export function removeNodeFromGraph(
  graph: RelationshipGraph,
  nodeId: string
): RelationshipGraph {
  const updatedNodes = graph.nodes.filter(n => n.id !== nodeId);
  const updatedEdges = graph.edges.filter(e => e.nodeA !== nodeId && e.nodeB !== nodeId);
  const updatedTriads = graph.triads.filter(t =>
    t.nodeA !== nodeId && t.nodeB !== nodeId && t.nodeC !== nodeId
  );

  // Rebuild system field
  const updatedSystemField = buildSystemField(updatedNodes, updatedEdges, updatedTriads);

  // Rebuild timing and events
  const updatedTiming = buildSystemTiming(updatedNodes, updatedEdges, updatedSystemField);
  const updatedEvents = buildSystemEvents(updatedNodes, updatedEdges, updatedSystemField, updatedTiming);

  // Update metadata
  const updatedMetadata = buildGraphMetadata(updatedNodes, updatedEdges, updatedTriads);

  return {
    ...graph,
    nodes: updatedNodes,
    edges: updatedEdges,
    triads: updatedTriads,
    systemField: updatedSystemField,
    systemTiming: updatedTiming,
    systemEvents: updatedEvents,
    metadata: updatedMetadata
  };
}

// ============================================================================
// EDGE BUILDING FUNCTIONS (PAIRWISE LAYER)
// ============================================================================

/**
 * Build all pairwise edges
 */
export function buildAllEdges(nodes: RelationshipNode[]): RelationshipEdge[] {
  const edges: RelationshipEdge[] = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const edge = buildEdge(nodes[i], nodes[j]);
      edges.push(edge);
    }
  }

  return edges;
}

/**
 * Build a single edge between two nodes
 */
export function buildEdge(
  nodeA: RelationshipNode,
  nodeB: RelationshipNode
): RelationshipEdge {
  const id = `edge_${nodeA.id}_${nodeB.id}`;

  // Calculate synastry score based on element compatibility
  const synastryScore = calculatePairSynastry(nodeA, nodeB);
  const harmonyScore = calculatePairHarmony(nodeA, nodeB);
  const tensionScore = calculatePairTension(nodeA, nodeB);

  // Determine nature
  const nature = determineEdgeNature(harmonyScore, tensionScore);

  // Determine archetype
  const { archetype, archetypeChinese } = determinePairArchetype(nodeA, nodeB, synastryScore);

  return {
    id,
    nodeA: nodeA.id,
    nodeB: nodeB.id,
    synastryScore,
    harmonyScore,
    tensionScore,
    archetype,
    archetypeChinese,
    nature,
    label: `${nodeA.name} ↔ ${nodeB.name}`
  };
}

/**
 * Calculate pairwise synastry score
 */
export function calculatePairSynastry(
  nodeA: RelationshipNode,
  nodeB: RelationshipNode
): number {
  let score = 50; // Base score

  // Day Master compatibility
  const dmA = nodeA.dayMaster.element;
  const dmB = nodeB.dayMaster.element;

  // Generating relationship (相生)
  if (isGenerating(dmA, dmB)) {
    score += 15;
  }

  // Controlling relationship (相克)
  if (isControlling(dmA, dmB)) {
    score -= 10;
  }

  // Same element (比劫)
  if (dmA === dmB) {
    score += 5;
  }

  // Polarity compatibility
  if (nodeA.dayMaster.polarity !== nodeB.dayMaster.polarity) {
    score += 5; // Yin-Yang balance
  }

  // Element distribution compatibility
  const distScore = calculateDistributionCompatibility(
    nodeA.elementDistribution,
    nodeB.elementDistribution
  );
  score += distScore;

  // Useful God alignment
  if (nodeA.usefulGod && nodeB.usefulGod) {
    if (nodeA.usefulGod === nodeB.usefulGod) {
      score += 10; // Aligned needs
    }
    // One provides what the other needs
    if (hasAbundant(nodeA.elementDistribution, nodeB.usefulGod)) {
      score += 8;
    }
    if (hasAbundant(nodeB.elementDistribution, nodeA.usefulGod)) {
      score += 8;
    }
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate pairwise harmony score
 */
export function calculatePairHarmony(
  nodeA: RelationshipNode,
  nodeB: RelationshipNode
): number {
  let harmony = 0;

  const dmA = nodeA.dayMaster.element;
  const dmB = nodeB.dayMaster.element;

  // Generating relationships add harmony
  if (isGenerating(dmA, dmB) || isGenerating(dmB, dmA)) {
    harmony += 30;
  }

  // Same element adds some harmony
  if (dmA === dmB) {
    harmony += 15;
  }

  // Complementary distributions
  const aWeak = getWeakestElement(nodeA.elementDistribution);
  const bWeak = getWeakestElement(nodeB.elementDistribution);
  const aStrong = getStrongestElement(nodeA.elementDistribution);
  const bStrong = getStrongestElement(nodeB.elementDistribution);

  if (aStrong === bWeak || bStrong === aWeak) {
    harmony += 20; // Complementary
  }

  // Yin-Yang balance
  if (nodeA.dayMaster.polarity !== nodeB.dayMaster.polarity) {
    harmony += 10;
  }

  return Math.max(0, Math.min(100, harmony));
}

/**
 * Calculate pairwise tension score
 */
export function calculatePairTension(
  nodeA: RelationshipNode,
  nodeB: RelationshipNode
): number {
  let tension = 0;

  const dmA = nodeA.dayMaster.element;
  const dmB = nodeB.dayMaster.element;

  // Controlling relationships add tension
  if (isControlling(dmA, dmB) || isControlling(dmB, dmA)) {
    tension += 25;
  }

  // Both strong in same element (competition)
  const aStrong = getStrongestElement(nodeA.elementDistribution);
  const bStrong = getStrongestElement(nodeB.elementDistribution);
  if (aStrong === bStrong) {
    tension += 15;
  }

  // Conflicting Useful Gods
  if (nodeA.usefulGod && nodeB.usefulGod) {
    if (isControlling(nodeA.usefulGod, nodeB.usefulGod)) {
      tension += 20;
    }
  }

  // Same polarity (can create friction)
  if (nodeA.dayMaster.polarity === nodeB.dayMaster.polarity) {
    tension += 5;
  }

  return Math.max(0, Math.min(100, tension));
}

/**
 * Determine edge nature
 */
export function determineEdgeNature(
  harmony: number,
  tension: number
): 'harmonious' | 'challenging' | 'complex' | 'neutral' {
  if (harmony >= 50 && tension < 30) return 'harmonious';
  if (tension >= 50 && harmony < 30) return 'challenging';
  if (harmony >= 40 && tension >= 40) return 'complex';
  return 'neutral';
}

/**
 * Determine pair archetype (simplified)
 */
export function determinePairArchetype(
  nodeA: RelationshipNode,
  nodeB: RelationshipNode,
  synastryScore: number
): { archetype: string; archetypeChinese: string } {
  const dmA = nodeA.dayMaster.element;
  const dmB = nodeB.dayMaster.element;

  // Wood-Wood: Sacred Grove
  if (dmA === 'Wood' && dmB === 'Wood') {
    return { archetype: 'Sacred Grove', archetypeChinese: '林园结' };
  }

  // Fire-Fire: Twin Flames
  if (dmA === 'Fire' && dmB === 'Fire') {
    return { archetype: 'Twin Flames', archetypeChinese: '双火焰' };
  }

  // Wood-Fire: Phoenix Union
  if ((dmA === 'Wood' && dmB === 'Fire') || (dmA === 'Fire' && dmB === 'Wood')) {
    return { archetype: 'Phoenix Union', archetypeChinese: '凤凰合' };
  }

  // Earth-Earth: Mountain Pact
  if (dmA === 'Earth' && dmB === 'Earth') {
    return { archetype: 'Mountain Pact', archetypeChinese: '山盟' };
  }

  // Metal-Metal: Metal Mirror
  if (dmA === 'Metal' && dmB === 'Metal') {
    return { archetype: 'Metal Mirror', archetypeChinese: '金镜' };
  }

  // Water-Water: River Bond
  if (dmA === 'Water' && dmB === 'Water') {
    return { archetype: 'River Bond', archetypeChinese: '江河缘' };
  }

  // Water-Wood: Wisdom Alliance
  if ((dmA === 'Water' && dmB === 'Wood') || (dmA === 'Wood' && dmB === 'Water')) {
    return { archetype: 'Wisdom Alliance', archetypeChinese: '智慧盟' };
  }

  // Fire-Earth: Builder's Alliance
  if ((dmA === 'Fire' && dmB === 'Earth') || (dmA === 'Earth' && dmB === 'Fire')) {
    return { archetype: "Builder's Alliance", archetypeChinese: '建造盟' };
  }

  // Earth-Metal: Prosperity Pair
  if ((dmA === 'Earth' && dmB === 'Metal') || (dmA === 'Metal' && dmB === 'Earth')) {
    return { archetype: 'Prosperity Pair', archetypeChinese: '财禄对' };
  }

  // Metal-Water: Scholar's Bond
  if ((dmA === 'Metal' && dmB === 'Water') || (dmA === 'Water' && dmB === 'Metal')) {
    return { archetype: "Scholar's Bond", archetypeChinese: '学者缘' };
  }

  // High synastry with tension: Karmic Mirror
  if (synastryScore >= 70) {
    return { archetype: 'Destiny Weavers', archetypeChinese: '命运织者' };
  }

  // Default
  return { archetype: 'Companion Bond', archetypeChinese: '同行缘' };
}

// ============================================================================
// TRIADIC LAYER FUNCTIONS
// ============================================================================

/**
 * Build all triadic relationships
 */
export function buildAllTriads(
  nodes: RelationshipNode[],
  edges: RelationshipEdge[]
): TriadicRelationship[] {
  const triads: TriadicRelationship[] = [];

  // Need at least 3 nodes for triads
  if (nodes.length < 3) return triads;

  // Generate all combinations of 3 nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      for (let k = j + 1; k < nodes.length; k++) {
        const triad = buildTriad(nodes[i], nodes[j], nodes[k], edges);
        triads.push(triad);
      }
    }
  }

  return triads;
}

/**
 * Build a single triadic relationship
 */
export function buildTriad(
  nodeA: RelationshipNode,
  nodeB: RelationshipNode,
  nodeC: RelationshipNode,
  edges: RelationshipEdge[]
): TriadicRelationship {
  const id = `triad_${nodeA.id}_${nodeB.id}_${nodeC.id}`;

  // Find the three edges
  const edgeAB = edges.find(e =>
    (e.nodeA === nodeA.id && e.nodeB === nodeB.id) ||
    (e.nodeA === nodeB.id && e.nodeB === nodeA.id)
  );
  const edgeBC = edges.find(e =>
    (e.nodeA === nodeB.id && e.nodeB === nodeC.id) ||
    (e.nodeA === nodeC.id && e.nodeB === nodeB.id)
  );
  const edgeAC = edges.find(e =>
    (e.nodeA === nodeA.id && e.nodeB === nodeC.id) ||
    (e.nodeA === nodeC.id && e.nodeB === nodeA.id)
  );

  // Calculate triadic harmony (average of edges)
  const tripleHarmony = Math.round(
    ((edgeAB?.harmonyScore || 0) + (edgeBC?.harmonyScore || 0) + (edgeAC?.harmonyScore || 0)) / 3
  );

  // Calculate triadic tension (average of edges)
  const tripleTension = Math.round(
    ((edgeAB?.tensionScore || 0) + (edgeBC?.tensionScore || 0) + (edgeAC?.tensionScore || 0)) / 3
  );

  // Determine dominant element in the triad
  const combinedDist = combineElementDistributions([
    nodeA.elementDistribution,
    nodeB.elementDistribution,
    nodeC.elementDistribution
  ]);
  const dominantElement = getStrongestElement(combinedDist);

  // Determine resonance pattern
  const resonancePattern = determineResonancePattern(tripleHarmony, tripleTension);

  // Determine triadic archetype
  const { archetype, archetypeChinese } = determineTriadicArchetype(
    combinedDist,
    tripleHarmony,
    tripleTension,
    resonancePattern
  );

  // Build triadic composite
  const compositeTriad = buildTriadicComposite(nodeA, nodeB, nodeC);

  return {
    id,
    nodeA: nodeA.id,
    nodeB: nodeB.id,
    nodeC: nodeC.id,
    tripleHarmony,
    tripleTension,
    dominantElement,
    triadicArchetype: archetype,
    triadicArchetypeChinese: archetypeChinese,
    resonancePattern,
    compositeTriad
  };
}

/**
 * Determine resonance pattern
 */
export function determineResonancePattern(
  harmony: number,
  tension: number
): 'convergent' | 'divergent' | 'balanced' | 'volatile' {
  if (harmony >= 60 && tension < 30) return 'convergent';
  if (tension >= 60 && harmony < 30) return 'divergent';
  if (harmony >= 40 && tension >= 40) return 'volatile';
  return 'balanced';
}

/**
 * Determine triadic archetype
 */
export function determineTriadicArchetype(
  distribution: Record<ElementName, number>,
  harmony: number,
  tension: number,
  pattern: string
): { archetype: string; archetypeChinese: string } {
  const dominant = getStrongestElement(distribution);
  const secondary = getSecondStrongestElement(distribution);

  // Creative Trinity: Wood-Fire-Earth dominant
  if (
    (dominant === 'Wood' || dominant === 'Fire' || dominant === 'Earth') &&
    (secondary === 'Wood' || secondary === 'Fire' || secondary === 'Earth') &&
    harmony >= 50
  ) {
    return {
      archetype: TRIADIC_ARCHETYPES['creative_trinity'].name,
      archetypeChinese: TRIADIC_ARCHETYPES['creative_trinity'].chineseName
    };
  }

  // Power Triangle: Metal-Water-Wood dominant
  if (
    (dominant === 'Metal' || dominant === 'Water') &&
    harmony >= 40 && tension >= 30
  ) {
    return {
      archetype: TRIADIC_ARCHETYPES['power_triangle'].name,
      archetypeChinese: TRIADIC_ARCHETYPES['power_triangle'].chineseName
    };
  }

  // Wisdom Circle: Water-Wood-Fire balanced
  if (
    distribution['Water'] >= 15 &&
    distribution['Wood'] >= 15 &&
    distribution['Fire'] >= 15 &&
    harmony >= 50
  ) {
    return {
      archetype: TRIADIC_ARCHETYPES['wisdom_circle'].name,
      archetypeChinese: TRIADIC_ARCHETYPES['wisdom_circle'].chineseName
    };
  }

  // Stability Foundation: Earth-Metal dominant
  if (
    (dominant === 'Earth' || dominant === 'Metal') &&
    (secondary === 'Earth' || secondary === 'Metal') &&
    tension < 40
  ) {
    return {
      archetype: TRIADIC_ARCHETYPES['stability_foundation'].name,
      archetypeChinese: TRIADIC_ARCHETYPES['stability_foundation'].chineseName
    };
  }

  // Karmic Knot: High harmony AND high tension
  if (harmony >= 50 && tension >= 50) {
    return {
      archetype: TRIADIC_ARCHETYPES['karmic_knot'].name,
      archetypeChinese: TRIADIC_ARCHETYPES['karmic_knot'].chineseName
    };
  }

  // Dynamic Flux: Volatile pattern
  if (pattern === 'volatile') {
    return {
      archetype: TRIADIC_ARCHETYPES['dynamic_flux'].name,
      archetypeChinese: TRIADIC_ARCHETYPES['dynamic_flux'].chineseName
    };
  }

  // Harmonious Triad: Convergent pattern
  if (pattern === 'convergent') {
    return {
      archetype: TRIADIC_ARCHETYPES['harmonious_triad'].name,
      archetypeChinese: TRIADIC_ARCHETYPES['harmonious_triad'].chineseName
    };
  }

  // Challenging Triangle: Divergent pattern
  if (pattern === 'divergent') {
    return {
      archetype: TRIADIC_ARCHETYPES['challenging_triangle'].name,
      archetypeChinese: TRIADIC_ARCHETYPES['challenging_triangle'].chineseName
    };
  }

  // Default: Harmonious Triad
  return {
    archetype: TRIADIC_ARCHETYPES['harmonious_triad'].name,
    archetypeChinese: TRIADIC_ARCHETYPES['harmonious_triad'].chineseName
  };
}

/**
 * Build triadic composite chart
 */
export function buildTriadicComposite(
  nodeA: RelationshipNode,
  nodeB: RelationshipNode,
  nodeC: RelationshipNode
): TriadicComposite {
  // Combine all three charts
  const yearPillar = combineThreePillars(
    nodeA.pillars.year,
    nodeB.pillars.year,
    nodeC.pillars.year
  );
  const monthPillar = combineThreePillars(
    nodeA.pillars.month,
    nodeB.pillars.month,
    nodeC.pillars.month
  );
  const dayPillar = combineThreePillars(
    nodeA.pillars.day,
    nodeB.pillars.day,
    nodeC.pillars.day
  );
  const hourPillar = combineThreePillars(
    nodeA.pillars.hour,
    nodeB.pillars.hour,
    nodeC.pillars.hour
  );

  // Combined element distribution
  const elementDistribution = combineElementDistributions([
    nodeA.elementDistribution,
    nodeB.elementDistribution,
    nodeC.elementDistribution
  ]);

  // Determine composite Day Master
  const dayMaster = determineTriadicDayMaster(nodeA, nodeB, nodeC, dayPillar);

  // Determine Useful God
  const usefulGod = determineTriadicUsefulGod(elementDistribution, dayMaster);

  // Determine triad nature
  const triadNature = describeTriadNature(elementDistribution);

  const triadicElementDist: TriadicElementDistribution = {
    Wood: elementDistribution['Wood'],
    Fire: elementDistribution['Fire'],
    Earth: elementDistribution['Earth'],
    Metal: elementDistribution['Metal'],
    Water: elementDistribution['Water'],
    dominant: getStrongestElement(elementDistribution),
    deficient: getWeakestElement(elementDistribution)
  };

  return {
    pillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar
    },
    dayMaster,
    elementDistribution: triadicElementDist,
    usefulGod,
    triadNature
  };
}

/**
 * Combine three pillars into a composite
 */
export function combineThreePillars(
  pillarA: Pillar,
  pillarB: Pillar,
  pillarC: Pillar
): TriadicPillar {
  // Use voting for stem
  const stems = [pillarA.stem, pillarB.stem, pillarC.stem];
  const stemCounts = new Map<StemName, number>();
  for (const stem of stems) {
    stemCounts.set(stem, (stemCounts.get(stem) || 0) + 1);
  }

  // Find most common or middle element
  let compositeStem: StemName = stems[0];
  const stemCountsArray = Array.from(stemCounts.values());
  const maxCount = Math.max(...stemCountsArray);
  if (maxCount >= 2) {
    // Use the most common
    const entries = Array.from(stemCounts.entries());
    for (const [stem, count] of entries) {
      if (count === maxCount) {
        compositeStem = stem;
        break;
      }
    }
  } else {
    // Use harmonic middle (based on element)
    const elements = stems.map(s => STEM_ELEMENT[s]);
    compositeStem = findHarmonicMiddleStem(stems, elements);
  }

  // Same for branch
  const branches = [pillarA.branch, pillarB.branch, pillarC.branch];
  const branchCounts = new Map<BranchName, number>();
  for (const branch of branches) {
    branchCounts.set(branch, (branchCounts.get(branch) || 0) + 1);
  }

  let compositeBranch: BranchName = branches[0];
  const branchCountsArray = Array.from(branchCounts.values());
  const maxBranchCount = Math.max(...branchCountsArray);
  if (maxBranchCount >= 2) {
    const branchEntries = Array.from(branchCounts.entries());
    for (const [branch, count] of branchEntries) {
      if (count === maxBranchCount) {
        compositeBranch = branch;
        break;
      }
    }
  } else {
    const branchElements = branches.map(b => BRANCH_ELEMENT[b]);
    compositeBranch = findHarmonicMiddleBranch(branches, branchElements);
  }

  const stemElement = STEM_ELEMENT[compositeStem];
  const branchElement = BRANCH_ELEMENT[compositeBranch];

  return {
    stem: compositeStem,
    branch: compositeBranch,
    stemElement,
    branchElement,
    combinationMethod: 'triadic_vote'
  };
}

/**
 * Determine triadic Day Master
 */
export function determineTriadicDayMaster(
  nodeA: RelationshipNode,
  nodeB: RelationshipNode,
  nodeC: RelationshipNode,
  dayPillar: TriadicPillar
): TriadicDayMaster {
  // Use the composite day pillar's stem
  const stem = dayPillar.stem;
  const element = STEM_ELEMENT[stem];
  const polarity = getStemPolarity(stem);

  // Calculate strength from all three
  const avgStrength = Math.round(
    (getElementStrength(nodeA.elementDistribution, element) +
     getElementStrength(nodeB.elementDistribution, element) +
     getElementStrength(nodeC.elementDistribution, element)) / 3
  );

  const strengthCategory: 'weak' | 'moderate' | 'strong' =
    avgStrength >= 60 ? 'strong' : avgStrength >= 40 ? 'moderate' : 'weak';

  return {
    stem,
    element,
    polarity,
    strengthScore: avgStrength,
    strengthCategory,
    description: `${polarity} ${element} — ${strengthCategory} triadic presence`
  };
}

/**
 * Determine triadic Useful God
 */
export function determineTriadicUsefulGod(
  _distribution: Record<ElementName, number>,
  dayMaster: TriadicDayMaster
): ElementName {
  const dmElement = dayMaster.element;
  const isStrong = dayMaster.strengthCategory === 'strong';

  // If DM is strong, weaken it
  // If DM is weak, strengthen it
  if (isStrong) {
    // Need element that controls or drains DM
    return getControllingElement(dmElement) || getDrainingElement(dmElement);
  } else {
    // Need element that supports or generates DM
    return getGeneratingElement(dmElement) || dmElement;
  }
}

// ============================================================================
// SYSTEM FIELD FUNCTIONS
// ============================================================================

/**
 * Build the system field
 */
export function buildSystemField(
  nodes: RelationshipNode[],
  edges: RelationshipEdge[],
  triads: TriadicRelationship[]
): SystemField {
  // System element distribution
  const elementDistribution = buildSystemElementDistribution(nodes);

  // System Useful God
  const usefulGod = buildSystemUsefulGod(nodes, elementDistribution);

  // System Annoying God
  const annoyingGod = determineSystemAnnoyingGod(elementDistribution, usefulGod);

  // System Shen Sha
  const shenSha = buildSystemShenSha(edges, triads);

  // Collective strengths
  const collectiveStrengths = identifyCollectiveStrengths(elementDistribution, edges);

  // Collective vulnerabilities
  const collectiveVulnerabilities = identifyCollectiveVulnerabilities(elementDistribution, edges);

  // Group dynamics
  const groupDynamics = describeGroupDynamics(edges, triads);

  // Karmic purpose
  const karmicPurpose = describeKarmicPurpose(shenSha, triads);

  return {
    elementDistribution,
    usefulGod,
    annoyingGod,
    shenSha,
    collectiveStrengths,
    collectiveVulnerabilities,
    groupDynamics,
    karmicPurpose
  };
}

/**
 * Build system element distribution
 */
export function buildSystemElementDistribution(
  nodes: RelationshipNode[]
): SystemElementDistribution {
  const combined = combineElementDistributions(
    nodes.map(n => n.elementDistribution)
  );

  const dominant = getStrongestElement(combined);
  const deficient = getWeakestElement(combined);

  // Determine balance
  const values = Object.values(combined);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min;

  let balance: SystemElementDistribution['balance'];
  if (range <= 10) balance = 'balanced';
  else if (range <= 20) balance = 'slightly_imbalanced';
  else if (range <= 35) balance = 'imbalanced';
  else balance = 'severely_imbalanced';

  const interpretation = buildDistributionInterpretation(combined, dominant, deficient, balance);

  return {
    wood: combined['Wood'],
    fire: combined['Fire'],
    earth: combined['Earth'],
    metal: combined['Metal'],
    water: combined['Water'],
    dominant,
    deficient,
    balance,
    interpretation
  };
}

/**
 * Build distribution interpretation
 */
export function buildDistributionInterpretation(
  distribution: Record<ElementName, number>,
  dominant: ElementName,
  deficient: ElementName,
  balance: string
): string {
  const traits: Record<ElementName, string> = {
    Wood: 'growth, vision, and expansion',
    Fire: 'passion, visibility, and transformation',
    Earth: 'stability, nurturing, and grounding',
    Metal: 'precision, structure, and refinement',
    Water: 'wisdom, flow, and adaptability'
  };

  let interpretation = `A system defined by ${traits[dominant]}. `;

  if (balance === 'balanced') {
    interpretation += 'The elements flow harmoniously, creating natural stability.';
  } else if (balance === 'slightly_imbalanced') {
    interpretation += `Could benefit from more ${traits[deficient].split(',')[0]}.`;
  } else if (balance === 'imbalanced') {
    interpretation += `Needs conscious cultivation of ${ELEMENT_CHINESE[deficient]} (${deficient}) energy.`;
  } else {
    interpretation += `The ${ELEMENT_CHINESE[deficient]} deficiency creates a significant blind spot.`;
  }

  return interpretation;
}

/**
 * Build system Useful God
 */
export function buildSystemUsefulGod(
  nodes: RelationshipNode[],
  distribution: SystemElementDistribution
): SystemUsefulGod {
  // Determine what the system needs
  const deficient = distribution.deficient;
  const dominant = distribution.dominant;

  // The system's Useful God is what balances it
  let element: ElementName;
  let reason: string;

  if (distribution.balance === 'balanced') {
    // Maintain with Earth (stability)
    element = 'Earth';
    reason = 'The system is balanced — Earth maintains harmony and grounding.';
  } else {
    // Need the deficient element or what generates it
    element = deficient;
    reason = `The system lacks ${ELEMENT_CHINESE[deficient]} — cultivating this energy brings balance.`;
  }

  const elementNames: Record<ElementName, string> = {
    Wood: '木', Fire: '火', Earth: '土', Metal: '金', Water: '水'
  };

  // What stabilizes
  const stabilizes = [
    `${element} activities and environments`,
    `People with strong ${element} charts`,
    `Timing periods that bring ${element}`
  ];

  // What destabilizes
  const controlling = getControllingElement(element);
  const destabilizes = [
    `Excess ${dominant} energy without outlet`,
    `${controlling} energy in conflict with group needs`,
    `Timing periods that further weaken ${deficient}`
  ];

  // What group needs
  const groupNeeds = buildGroupNeeds(distribution, nodes);

  return {
    element,
    chineseName: elementNames[element],
    reason,
    stabilizes,
    destabilizes,
    groupNeeds
  };
}

/**
 * Build group needs
 */
export function buildGroupNeeds(
  distribution: SystemElementDistribution,
  nodes: RelationshipNode[]
): string[] {
  const needs: string[] = [];

  // Based on deficiency
  switch (distribution.deficient) {
    case 'Wood':
      needs.push('More vision and long-term planning');
      needs.push('Growth opportunities and expansion');
      break;
    case 'Fire':
      needs.push('More passion and shared purpose');
      needs.push('Visibility and recognition');
      break;
    case 'Earth':
      needs.push('More stability and grounding');
      needs.push('Nurturing and care for each member');
      break;
    case 'Metal':
      needs.push('More structure and clear boundaries');
      needs.push('Quality focus and refinement');
      break;
    case 'Water':
      needs.push('More wisdom and reflection time');
      needs.push('Flexibility and adaptability');
      break;
  }

  // Based on individual Useful Gods
  const usefulGods = nodes
    .filter(n => n.usefulGod)
    .map(n => n.usefulGod!);
  const uniqueNeeds = Array.from(new Set(usefulGods));

  if (uniqueNeeds.length > 0) {
    const mostCommon = findMostCommon(usefulGods);
    needs.push(`Aligned support for ${ELEMENT_CHINESE[mostCommon]} — the most needed element`);
  }

  return needs.slice(0, 4);
}

/**
 * Determine system Annoying God
 */
export function determineSystemAnnoyingGod(
  distribution: SystemElementDistribution,
  usefulGod: SystemUsefulGod
): ElementName {
  // The element that controls the Useful God
  return getControllingElement(usefulGod.element);
}

/**
 * Build system Shen Sha
 */
export function buildSystemShenSha(
  edges: RelationshipEdge[],
  triads: TriadicRelationship[]
): SystemShenSha[] {
  const shenSha: SystemShenSha[] = [];

  // Count archetypes
  const archetypeCounts = new Map<string, number>();
  for (const edge of edges) {
    if (edge.archetype) {
      archetypeCounts.set(edge.archetype, (archetypeCounts.get(edge.archetype) || 0) + 1);
    }
  }

  // Add Shen Sha based on prevalence
  if (archetypeCounts.has('Twin Flames') || archetypeCounts.has('Phoenix Union')) {
    shenSha.push({
      name: 'Peach Blossom Constellation',
      chineseName: '桃花星群',
      nature: 'neutral',
      prevalence: (archetypeCounts.get('Twin Flames') || 0) + (archetypeCounts.get('Phoenix Union') || 0),
      meaning: 'Strong romantic and attraction energy pervades the system.'
    });
  }

  if (archetypeCounts.has('Prosperity Pair') || archetypeCounts.has("Builder's Alliance")) {
    shenSha.push({
      name: 'Wealth Star Network',
      chineseName: '财星网络',
      nature: 'auspicious',
      prevalence: (archetypeCounts.get('Prosperity Pair') || 0) + (archetypeCounts.get("Builder's Alliance") || 0),
      meaning: 'The system attracts resources and material success.'
    });
  }

  // Check triadic patterns
  const karmicTriads = triads.filter(t => t.triadicArchetype === 'Karmic Knot');
  if (karmicTriads.length > 0) {
    shenSha.push({
      name: 'Karmic Web',
      chineseName: '因缘网',
      nature: 'neutral',
      prevalence: karmicTriads.length,
      meaning: 'Deep karmic bonds connect members — growth through challenge.'
    });
  }

  const harmoniousTriads = triads.filter(t => t.triadicArchetype === 'Harmonious Triad');
  if (harmoniousTriads.length > 0) {
    shenSha.push({
      name: 'Heavenly Harmony',
      chineseName: '天和',
      nature: 'auspicious',
      prevalence: harmoniousTriads.length,
      meaning: 'Natural compatibility creates smooth collaboration.'
    });
  }

  const creativeTriads = triads.filter(t => t.triadicArchetype === 'Creative Trinity');
  if (creativeTriads.length > 0) {
    shenSha.push({
      name: 'Creative Star',
      chineseName: '文昌星群',
      nature: 'auspicious',
      prevalence: creativeTriads.length,
      meaning: 'The system has powerful creative and generative potential.'
    });
  }

  // Check for challenging patterns
  const challengingEdges = edges.filter(e => e.nature === 'challenging');
  if (challengingEdges.length >= edges.length * 0.3) {
    shenSha.push({
      name: 'Transformation Furnace',
      chineseName: '化炉',
      nature: 'inauspicious',
      prevalence: challengingEdges.length,
      meaning: 'High friction requires conscious transformation work.'
    });
  }

  return shenSha;
}

/**
 * Identify collective strengths
 */
export function identifyCollectiveStrengths(
  distribution: SystemElementDistribution,
  edges: RelationshipEdge[]
): string[] {
  const strengths: string[] = [];

  // Based on dominant element
  switch (distribution.dominant) {
    case 'Wood':
      strengths.push('Vision and strategic thinking');
      strengths.push('Growth mindset and expansion');
      break;
    case 'Fire':
      strengths.push('Passion and shared purpose');
      strengths.push('Charisma and visibility');
      break;
    case 'Earth':
      strengths.push('Stability and reliability');
      strengths.push('Nurturing and support');
      break;
    case 'Metal':
      strengths.push('Precision and quality');
      strengths.push('Clear boundaries and structure');
      break;
    case 'Water':
      strengths.push('Wisdom and adaptability');
      strengths.push('Deep emotional intelligence');
      break;
  }

  // Based on relationship quality
  const avgHarmony = edges.reduce((sum, e) => sum + e.harmonyScore, 0) / edges.length;
  if (avgHarmony >= 50) {
    strengths.push('Natural compatibility and flow');
  }

  const avgSynastry = edges.reduce((sum, e) => sum + e.synastryScore, 0) / edges.length;
  if (avgSynastry >= 70) {
    strengths.push('Deep mutual understanding');
  }

  return strengths.slice(0, 5);
}

/**
 * Identify collective vulnerabilities
 */
export function identifyCollectiveVulnerabilities(
  distribution: SystemElementDistribution,
  edges: RelationshipEdge[]
): string[] {
  const vulnerabilities: string[] = [];

  // Based on deficient element
  switch (distribution.deficient) {
    case 'Wood':
      vulnerabilities.push('May lack long-term vision');
      vulnerabilities.push('Risk of stagnation');
      break;
    case 'Fire':
      vulnerabilities.push('May lack passion or direction');
      vulnerabilities.push('Risk of invisibility');
      break;
    case 'Earth':
      vulnerabilities.push('May lack grounding');
      vulnerabilities.push('Risk of instability');
      break;
    case 'Metal':
      vulnerabilities.push('May lack structure');
      vulnerabilities.push('Risk of boundary issues');
      break;
    case 'Water':
      vulnerabilities.push('May lack flexibility');
      vulnerabilities.push('Risk of rigidity');
      break;
  }

  // Based on relationship quality
  const avgTension = edges.reduce((sum, e) => sum + e.tensionScore, 0) / edges.length;
  if (avgTension >= 40) {
    vulnerabilities.push('Underlying friction requires attention');
  }

  const challengingCount = edges.filter(e => e.nature === 'challenging').length;
  if (challengingCount >= edges.length * 0.3) {
    vulnerabilities.push('Multiple challenging dynamics need navigation');
  }

  return vulnerabilities.slice(0, 5);
}

/**
 * Describe group dynamics
 */
export function describeGroupDynamics(
  edges: RelationshipEdge[],
  triads: TriadicRelationship[]
): string {
  const avgHarmony = edges.reduce((sum, e) => sum + e.harmonyScore, 0) / edges.length;
  const avgTension = edges.reduce((sum, e) => sum + e.tensionScore, 0) / edges.length;

  let dynamics = '';

  if (avgHarmony >= 60 && avgTension < 30) {
    dynamics = 'A naturally harmonious group with smooth energy flow and mutual support.';
  } else if (avgTension >= 60 && avgHarmony < 30) {
    dynamics = 'A challenging group requiring conscious effort to navigate friction.';
  } else if (avgHarmony >= 40 && avgTension >= 40) {
    dynamics = 'A dynamic group with both deep connection and growth-inducing tension.';
  } else {
    dynamics = 'A balanced group with stable interactions and moderate energy exchange.';
  }

  // Add triadic flavor
  if (triads.length > 0) {
    const dominantTriadType = findMostCommonTriadArchetype(triads);
    dynamics += ` The dominant triadic pattern is ${dominantTriadType}.`;
  }

  return dynamics;
}

/**
 * Describe karmic purpose
 */
export function describeKarmicPurpose(
  shenSha: SystemShenSha[],
  triads: TriadicRelationship[]
): string {
  const purposes: string[] = [];

  // Based on Shen Sha
  for (const sha of shenSha) {
    if (sha.name === 'Creative Star') {
      purposes.push('collective creative expression');
    }
    if (sha.name === 'Wealth Star Network') {
      purposes.push('shared prosperity and abundance');
    }
    if (sha.name === 'Karmic Web') {
      purposes.push('mutual healing and growth');
    }
    if (sha.name === 'Heavenly Harmony') {
      purposes.push('harmonious collaboration');
    }
  }

  // Based on triads
  const karmicTriads = triads.filter(t => t.triadicArchetype === 'Karmic Knot');
  if (karmicTriads.length > 0) {
    purposes.push('resolving ancestral patterns');
  }

  if (purposes.length === 0) {
    return 'This constellation gathers for mutual support and shared journey.';
  }

  return `This constellation gathers for ${purposes.join(', ')}.`;
}

// ============================================================================
// SYSTEM TIMING FUNCTIONS
// ============================================================================

/**
 * Build system timing projections
 */
export function buildSystemTiming(
  nodes: RelationshipNode[],
  edges: RelationshipEdge[],
  systemField: SystemField
): SystemTimingResult[] {
  const currentYear = new Date().getFullYear();
  const results: SystemTimingResult[] = [];

  // Project 10 years
  for (let year = currentYear; year <= currentYear + 10; year++) {
    const result = computeSystemTimingForYear(year, nodes, edges, systemField);
    results.push(result);
  }

  return results;
}

/**
 * Compute system timing for a specific year
 */
export function computeSystemTimingForYear(
  year: number,
  nodes: RelationshipNode[],
  edges: RelationshipEdge[],
  systemField: SystemField
): SystemTimingResult {
  // Determine annual element
  const annualElement = getAnnualElement(year);

  // Check how many nodes are activated
  const activatedNodes: string[] = [];
  for (const node of nodes) {
    if (node.usefulGod === annualElement) {
      activatedNodes.push(node.id);
    }
    if (isGenerating(annualElement, node.dayMaster.element)) {
      activatedNodes.push(node.id);
    }
  }

  // Check how many edges are activated
  const activatedEdges: string[] = [];
  for (const edge of edges) {
    // Edges with harmonious nodes are activated
    const nodeA = nodes.find(n => n.id === edge.nodeA);
    const nodeB = nodes.find(n => n.id === edge.nodeB);
    if (nodeA && nodeB) {
      const aActive = activatedNodes.includes(nodeA.id);
      const bActive = activatedNodes.includes(nodeB.id);
      if (aActive && bActive) {
        activatedEdges.push(edge.id);
      }
    }
  }

  // Calculate convergence
  const convergenceLevel = activatedNodes.length / nodes.length;

  // Calculate system score
  let systemScore = 50; // Base

  // Useful God activated
  if (annualElement === systemField.usefulGod.element) {
    systemScore += 20;
  }

  // Annoying God activated
  if (annualElement === systemField.annoyingGod) {
    systemScore -= 15;
  }

  // Convergence bonus
  systemScore += convergenceLevel * 20;

  // Determine tier
  let systemTier: SystemTimingResult['systemTier'];
  if (systemScore >= 80) systemTier = 'breakthrough';
  else if (systemScore >= 65) systemTier = 'growth';
  else if (systemScore >= 50) systemTier = 'stable';
  else if (systemScore >= 35) systemTier = 'challenging';
  else systemTier = 'crisis';

  // Build narrative
  const narrative = buildSystemTimingNarrative(
    year,
    annualElement,
    systemScore,
    systemTier,
    activatedNodes.length,
    nodes.length,
    systemField
  );

  return {
    year,
    systemScore: Math.round(systemScore),
    systemTier,
    activatedNodes: Array.from(new Set(activatedNodes)),
    activatedEdges,
    convergenceLevel: Math.round(convergenceLevel * 100),
    narrative
  };
}

/**
 * Get annual element from year
 */
export function getAnnualElement(year: number): ElementName {
  const stemIndex = (year - 4) % 10;
  const stems: StemName[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const stem = stems[stemIndex];
  return STEM_ELEMENT[stem];
}

/**
 * Build system timing narrative
 */
export function buildSystemTimingNarrative(
  year: number,
  annualElement: ElementName,
  score: number,
  tier: string,
  activatedCount: number,
  totalCount: number,
  systemField: SystemField
): string {
  let narrative = `${year} brings ${ELEMENT_CHINESE[annualElement]} (${annualElement}) energy. `;

  if (annualElement === systemField.usefulGod.element) {
    narrative += 'This aligns with the group\'s Useful God — excellent support. ';
  }

  if (activatedCount >= totalCount * 0.7) {
    narrative += 'High convergence — most members benefit simultaneously. ';
  } else if (activatedCount >= totalCount * 0.4) {
    narrative += 'Moderate convergence — some members more activated than others. ';
  } else {
    narrative += 'Low convergence — individual journeys diverge this year. ';
  }

  switch (tier) {
    case 'breakthrough':
      narrative += 'A breakthrough year for the entire constellation.';
      break;
    case 'growth':
      narrative += 'A growth year with expansion opportunities.';
      break;
    case 'stable':
      narrative += 'A stable year for consolidation.';
      break;
    case 'challenging':
      narrative += 'A challenging year requiring adaptation.';
      break;
    case 'crisis':
      narrative += 'A crisis year demanding collective resilience.';
      break;
  }

  return narrative;
}

// ============================================================================
// SYSTEM EVENT FUNCTIONS
// ============================================================================

/**
 * Build system events
 */
export function buildSystemEvents(
  nodes: RelationshipNode[],
  edges: RelationshipEdge[],
  systemField: SystemField,
  systemTiming: SystemTimingResult[]
): SystemEventTrigger[] {
  const events: SystemEventTrigger[] = [];

  for (const timing of systemTiming) {
    // Breakthrough events
    if (timing.systemTier === 'breakthrough') {
      events.push({
        type: 'breakthrough',
        typeChinese: SYSTEM_EVENT_TYPES['breakthrough'].chineseName,
        year: timing.year,
        probability: 80,
        tier: 'strong',
        affectedNodes: timing.activatedNodes,
        affectedEdges: timing.activatedEdges,
        description: SYSTEM_EVENT_TYPES['breakthrough'].meaning,
        narrative: `${timing.year}: A powerful breakthrough window opens for the constellation.`
      });
    }

    // Crisis events
    if (timing.systemTier === 'crisis') {
      events.push({
        type: 'crisis',
        typeChinese: SYSTEM_EVENT_TYPES['crisis'].chineseName,
        year: timing.year,
        probability: 70,
        tier: 'likely',
        affectedNodes: timing.activatedNodes,
        affectedEdges: timing.activatedEdges,
        description: SYSTEM_EVENT_TYPES['crisis'].meaning,
        narrative: `${timing.year}: The constellation faces a collective challenge.`
      });
    }

    // Milestone events (high convergence)
    if (timing.convergenceLevel >= 70) {
      events.push({
        type: 'milestone',
        typeChinese: SYSTEM_EVENT_TYPES['milestone'].chineseName,
        year: timing.year,
        probability: 60,
        tier: timing.convergenceLevel >= 85 ? 'strong' : 'likely',
        affectedNodes: timing.activatedNodes,
        affectedEdges: timing.activatedEdges,
        description: SYSTEM_EVENT_TYPES['milestone'].meaning,
        narrative: `${timing.year}: High convergence suggests a significant group milestone.`
      });
    }

    // Healing events (check for specific conditions)
    const annualElement = getAnnualElement(timing.year);
    if (annualElement === 'Water' || annualElement === 'Earth') {
      events.push({
        type: 'healing',
        typeChinese: SYSTEM_EVENT_TYPES['healing'].chineseName,
        year: timing.year,
        probability: 50,
        tier: 'mild',
        affectedNodes: timing.activatedNodes,
        affectedEdges: timing.activatedEdges,
        description: SYSTEM_EVENT_TYPES['healing'].meaning,
        narrative: `${timing.year}: ${ELEMENT_CHINESE[annualElement]} energy supports collective healing.`
      });
    }

    // Transition events (year-to-year tier change)
    const prevTiming = systemTiming.find(t => t.year === timing.year - 1);
    if (prevTiming && prevTiming.systemTier !== timing.systemTier) {
      events.push({
        type: 'transition',
        typeChinese: SYSTEM_EVENT_TYPES['transition'].chineseName,
        year: timing.year,
        probability: 75,
        tier: 'likely',
        affectedNodes: timing.activatedNodes,
        affectedEdges: timing.activatedEdges,
        description: SYSTEM_EVENT_TYPES['transition'].meaning,
        narrative: `${timing.year}: The constellation shifts from ${prevTiming.systemTier} to ${timing.systemTier}.`
      });
    }
  }

  return events;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if element A generates element B
 */
export function isGenerating(a: ElementName, b: ElementName): boolean {
  const generatingMap: Record<ElementName, ElementName> = {
    Wood: 'Fire',
    Fire: 'Earth',
    Earth: 'Metal',
    Metal: 'Water',
    Water: 'Wood'
  };
  return generatingMap[a] === b;
}

/**
 * Check if element A controls element B
 */
export function isControlling(a: ElementName, b: ElementName): boolean {
  const controllingMap: Record<ElementName, ElementName> = {
    Wood: 'Earth',
    Earth: 'Water',
    Water: 'Fire',
    Fire: 'Metal',
    Metal: 'Wood'
  };
  return controllingMap[a] === b;
}

/**
 * Get the element that controls the given element
 */
export function getControllingElement(element: ElementName): ElementName {
  const controlledBy: Record<ElementName, ElementName> = {
    Wood: 'Metal',
    Fire: 'Water',
    Earth: 'Wood',
    Metal: 'Fire',
    Water: 'Earth'
  };
  return controlledBy[element];
}

/**
 * Get the element that generates the given element
 */
export function getGeneratingElement(element: ElementName): ElementName {
  const generatedBy: Record<ElementName, ElementName> = {
    Wood: 'Water',
    Fire: 'Wood',
    Earth: 'Fire',
    Metal: 'Earth',
    Water: 'Metal'
  };
  return generatedBy[element];
}

/**
 * Get the element that drains the given element
 */
export function getDrainingElement(element: ElementName): ElementName {
  const drains: Record<ElementName, ElementName> = {
    Wood: 'Fire',
    Fire: 'Earth',
    Earth: 'Metal',
    Metal: 'Water',
    Water: 'Wood'
  };
  return drains[element];
}

/**
 * Combine multiple element distributions
 */
export function combineElementDistributions(
  distributions: Record<ElementName, number>[]
): Record<ElementName, number> {
  const combined: Record<ElementName, number> = {
    Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0
  };

  for (const dist of distributions) {
    combined.Wood += dist.Wood || 0;
    combined.Fire += dist.Fire || 0;
    combined.Earth += dist.Earth || 0;
    combined.Metal += dist.Metal || 0;
    combined.Water += dist.Water || 0;
  }

  // Normalize to 100%
  const total = combined.Wood + combined.Fire + combined.Earth + combined.Metal + combined.Water;
  if (total > 0) {
    combined.Wood = Math.round((combined.Wood / total) * 100);
    combined.Fire = Math.round((combined.Fire / total) * 100);
    combined.Earth = Math.round((combined.Earth / total) * 100);
    combined.Metal = Math.round((combined.Metal / total) * 100);
    combined.Water = Math.round((combined.Water / total) * 100);
  }

  return combined;
}

/**
 * Get strongest element in distribution
 */
export function getStrongestElement(distribution: Record<ElementName, number>): ElementName {
  const elements: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  return elements.reduce((max, el) =>
    distribution[el] > distribution[max] ? el : max
  , 'Wood');
}

/**
 * Get weakest element in distribution
 */
export function getWeakestElement(distribution: Record<ElementName, number>): ElementName {
  const elements: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  return elements.reduce((min, el) =>
    distribution[el] < distribution[min] ? el : min
  , 'Wood');
}

/**
 * Get second strongest element
 */
export function getSecondStrongestElement(distribution: Record<ElementName, number>): ElementName {
  const elements: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const sorted = [...elements].sort((a, b) => distribution[b] - distribution[a]);
  return sorted[1];
}

/**
 * Calculate distribution compatibility
 */
export function calculateDistributionCompatibility(
  distA: Record<ElementName, number>,
  distB: Record<ElementName, number>
): number {
  let score = 0;

  const elements: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  for (const element of elements) {
    const diff = Math.abs(distA[element] - distB[element]);
    if (diff <= 10) score += 2; // Similar
    else if (diff >= 20) score -= 1; // Very different
  }

  // Complementary bonus
  const aStrong = getStrongestElement(distA);
  const bWeak = getWeakestElement(distB);
  const bStrong = getStrongestElement(distB);
  const aWeak = getWeakestElement(distA);

  if (aStrong === bWeak) score += 3;
  if (bStrong === aWeak) score += 3;

  return score;
}

/**
 * Check if distribution has abundant element
 */
export function hasAbundant(
  distribution: Record<ElementName, number>,
  element: ElementName
): boolean {
  return distribution[element] >= 25;
}

/**
 * Get element strength
 */
export function getElementStrength(
  distribution: Record<ElementName, number>,
  element: ElementName
): number {
  return distribution[element] || 0;
}

/**
 * Get stem polarity
 */
export function getStemPolarity(stem: StemName): Polarity {
  const yangStems: StemName[] = ['甲', '丙', '戊', '庚', '壬'];
  return yangStems.includes(stem) ? 'Yang' : 'Yin';
}

/**
 * Get hidden stems for branch
 */
export function getHiddenStems(branch: BranchName): StemName[] {
  const hiddenStems: Record<BranchName, StemName[]> = {
    '子': ['癸'],
    '丑': ['己', '癸', '辛'],
    '寅': ['甲', '丙', '戊'],
    '卯': ['乙'],
    '辰': ['戊', '乙', '癸'],
    '巳': ['丙', '庚', '戊'],
    '午': ['丁', '己'],
    '未': ['己', '丁', '乙'],
    '申': ['庚', '壬', '戊'],
    '酉': ['辛'],
    '戌': ['戊', '辛', '丁'],
    '亥': ['壬', '甲']
  };
  return hiddenStems[branch];
}

/**
 * Describe pillar nature
 */
export function describePillarNature(stemElement: ElementName, branchElement: ElementName): string {
  if (stemElement === branchElement) {
    return `Pure ${stemElement} pillar — concentrated energy`;
  }
  if (isGenerating(stemElement, branchElement)) {
    return `${stemElement} generates ${branchElement} — productive flow`;
  }
  if (isGenerating(branchElement, stemElement)) {
    return `${branchElement} supports ${stemElement} — grounded expression`;
  }
  if (isControlling(stemElement, branchElement)) {
    return `${stemElement} controls ${branchElement} — dynamic tension`;
  }
  return `${stemElement} and ${branchElement} in neutral balance`;
}

/**
 * Find harmonic middle stem
 */
export function findHarmonicMiddleStem(stems: StemName[], elements: ElementName[]): StemName {
  // Prefer generating cycle order
  const elementOrder: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const indices = elements.map(e => elementOrder.indexOf(e));
  const avgIndex = Math.round(indices.reduce((a, b) => a + b, 0) / indices.length);
  const targetElement = elementOrder[avgIndex % 5];

  // Find a stem with this element
  for (const stem of stems) {
    if (STEM_ELEMENT[stem] === targetElement) {
      return stem;
    }
  }

  // Default to first stem
  return stems[0];
}

/**
 * Find harmonic middle branch
 */
export function findHarmonicMiddleBranch(branches: BranchName[], elements: ElementName[]): BranchName {
  const elementOrder: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const indices = elements.map(e => elementOrder.indexOf(e));
  const avgIndex = Math.round(indices.reduce((a, b) => a + b, 0) / indices.length);
  const targetElement = elementOrder[avgIndex % 5];

  for (const branch of branches) {
    if (BRANCH_ELEMENT[branch] === targetElement) {
      return branch;
    }
  }

  return branches[0];
}

/**
 * Find most common item in array
 */
export function findMostCommon<T>(items: T[]): T {
  const counts = new Map<T, number>();
  for (const item of items) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }

  let maxItem = items[0];
  let maxCount = 0;
  const countEntries = Array.from(counts.entries());
  for (const [item, count] of countEntries) {
    if (count > maxCount) {
      maxCount = count;
      maxItem = item;
    }
  }

  return maxItem;
}

/**
 * Find most common triadic archetype
 */
export function findMostCommonTriadArchetype(triads: TriadicRelationship[]): string {
  const archetypes = triads.map(t => t.triadicArchetype);
  return findMostCommon(archetypes);
}

/**
 * Describe triad nature
 */
export function describeTriadNature(distribution: Record<ElementName, number>): string {
  const dominant = getStrongestElement(distribution);
  const secondary = getSecondStrongestElement(distribution);

  return `${ELEMENT_CHINESE[dominant]}-${ELEMENT_CHINESE[secondary]} composite — ${dominant}-${secondary} energy dominates`;
}

/**
 * Build graph metadata
 */
export function buildGraphMetadata(
  nodes: RelationshipNode[],
  edges: RelationshipEdge[],
  triads: TriadicRelationship[]
): GraphMetadata {
  const avgSynastry = edges.length > 0
    ? edges.reduce((sum, e) => sum + e.synastryScore, 0) / edges.length
    : 0;

  const avgHarmony = edges.length > 0
    ? edges.reduce((sum, e) => sum + e.harmonyScore, 0) / edges.length
    : 0;

  const avgTension = edges.length > 0
    ? edges.reduce((sum, e) => sum + e.tensionScore, 0) / edges.length
    : 0;

  // Find dominant archetype
  const archetypeCounts = new Map<string, number>();
  for (const edge of edges) {
    if (edge.archetype) {
      archetypeCounts.set(edge.archetype, (archetypeCounts.get(edge.archetype) || 0) + 1);
    }
  }

  let dominantArchetype = 'Mixed';
  let maxCount = 0;
  const archetypeEntries = Array.from(archetypeCounts.entries());
  for (const [archetype, count] of archetypeEntries) {
    if (count > maxCount) {
      maxCount = count;
      dominantArchetype = archetype;
    }
  }

  return {
    createdAt: new Date(),
    nodeCount: nodes.length,
    edgeCount: edges.length,
    triadCount: triads.length,
    averageSynastry: Math.round(avgSynastry),
    systemHarmony: Math.round(avgHarmony),
    systemTension: Math.round(avgTension),
    dominantArchetype
  };
}

// ============================================================================
// STORY FORMATTERS
// ============================================================================

/**
 * Format relationship graph as story
 */
export function formatGraphStory(graph: RelationshipGraph): string {
  const parts: string[] = [];

  parts.push(`### ${graph.name} (多重关系图谱)`);
  parts.push('');

  // System overview
  parts.push('**System Overview**');
  parts.push(`${graph.nodes.length} members | ${graph.edges.length} relationships | ${graph.triads.length} triads`);
  parts.push('');

  // Element distribution
  const dist = graph.systemField.elementDistribution;
  parts.push('**System Element Balance**');
  parts.push(`木 ${dist.wood}% — 火 ${dist.fire}% — 土 ${dist.earth}% — 金 ${dist.metal}% — 水 ${dist.water}%`);
  parts.push(dist.interpretation);
  parts.push('');

  // Useful God
  parts.push('**System Useful God**');
  parts.push(`${graph.systemField.usefulGod.chineseName} (${graph.systemField.usefulGod.element})`);
  parts.push(graph.systemField.usefulGod.reason);
  parts.push('');

  // Key relationships
  parts.push('**Key Relationships**');
  const sortedEdges = [...graph.edges].sort((a, b) => b.synastryScore - a.synastryScore);
  for (const edge of sortedEdges.slice(0, 5)) {
    const nodeA = graph.nodes.find(n => n.id === edge.nodeA);
    const nodeB = graph.nodes.find(n => n.id === edge.nodeB);
    if (nodeA && nodeB) {
      parts.push(`- ${nodeA.name} ↔ ${nodeB.name}: ${edge.archetype} (${edge.synastryScore}%)`);
    }
  }
  parts.push('');

  // Triadic patterns
  if (graph.triads.length > 0) {
    parts.push('**Triadic Patterns**');
    for (const triad of graph.triads.slice(0, 3)) {
      const nodeA = graph.nodes.find(n => n.id === triad.nodeA);
      const nodeB = graph.nodes.find(n => n.id === triad.nodeB);
      const nodeC = graph.nodes.find(n => n.id === triad.nodeC);
      if (nodeA && nodeB && nodeC) {
        parts.push(`- ${nodeA.name}–${nodeB.name}–${nodeC.name}: ${triad.triadicArchetypeChinese} (${triad.triadicArchetype})`);
      }
    }
    parts.push('');
  }

  // System timing highlights
  parts.push('**System Timing Highlights**');
  const breakthroughs = graph.systemTiming.filter(t => t.systemTier === 'breakthrough');
  const challenges = graph.systemTiming.filter(t => t.systemTier === 'crisis' || t.systemTier === 'challenging');

  if (breakthroughs.length > 0) {
    parts.push(`Breakthrough years: ${breakthroughs.map(t => t.year).join(', ')}`);
  }
  if (challenges.length > 0) {
    parts.push(`Challenging years: ${challenges.map(t => t.year).join(', ')}`);
  }
  parts.push('');

  // Collective purpose
  parts.push('**Karmic Purpose**');
  parts.push(graph.systemField.karmicPurpose);

  return parts.join('\n');
}

/**
 * Format graph for debug
 */
export function formatGraphDebug(graph: RelationshipGraph): string {
  const lines: string[] = [];

  lines.push('=== MULTI-RELATIONSHIP GRAPH DEBUG ===');
  lines.push(`ID: ${graph.id}`);
  lines.push(`Name: ${graph.name}`);
  lines.push(`Nodes: ${graph.metadata.nodeCount}`);
  lines.push(`Edges: ${graph.metadata.edgeCount}`);
  lines.push(`Triads: ${graph.metadata.triadCount}`);
  lines.push('');

  lines.push('--- NODES ---');
  for (const node of graph.nodes) {
    lines.push(`${node.id}: ${node.name} | DM: ${node.dayMaster.element} ${node.dayMaster.polarity}`);
  }
  lines.push('');

  lines.push('--- EDGES ---');
  for (const edge of graph.edges) {
    lines.push(`${edge.nodeA} ↔ ${edge.nodeB}: ${edge.synastryScore}% | H:${edge.harmonyScore} T:${edge.tensionScore} | ${edge.archetype}`);
  }
  lines.push('');

  lines.push('--- SYSTEM FIELD ---');
  lines.push(`Useful God: ${graph.systemField.usefulGod.element}`);
  lines.push(`Annoying God: ${graph.systemField.annoyingGod}`);
  lines.push(`Balance: ${graph.systemField.elementDistribution.balance}`);
  lines.push('');

  lines.push('--- SYSTEM TIMING ---');
  for (const timing of graph.systemTiming) {
    lines.push(`${timing.year}: ${timing.systemTier} (${timing.systemScore}%) | Convergence: ${timing.convergenceLevel}%`);
  }

  return lines.join('\n');
}

// ============================================================================
// UI FORMATTERS
// ============================================================================

/**
 * Format graph for UI consumption
 */
export function formatGraphForUI(graph: RelationshipGraph): {
  nodes: Array<{
    id: string;
    name: string;
    element: ElementName;
    elementChinese: string;
    x?: number;
    y?: number;
    size: number;
    color: string;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    score: number;
    harmony: number;
    tension: number;
    nature: string;
    archetype: string;
    color: string;
    width: number;
  }>;
  systemField: {
    elementDistribution: SystemElementDistribution;
    usefulGod: SystemUsefulGod;
    strengths: string[];
    vulnerabilities: string[];
    dynamics: string;
    purpose: string;
  };
  timing: Array<{
    year: number;
    score: number;
    tier: string;
    narrative: string;
  }>;
  events: Array<{
    type: string;
    typeChinese: string;
    year: number;
    probability: number;
    narrative: string;
  }>;
} {
  // Element colors
  const elementColors: Record<ElementName, string> = {
    Wood: '#4CAF50',
    Fire: '#F44336',
    Earth: '#FF9800',
    Metal: '#9E9E9E',
    Water: '#2196F3'
  };

  // Format nodes
  const uiNodes = graph.nodes.map(node => ({
    id: node.id,
    name: node.name,
    element: node.dayMaster.element,
    elementChinese: ELEMENT_CHINESE[node.dayMaster.element],
    size: 30 + (node.elementDistribution[node.dayMaster.element] / 5),
    color: elementColors[node.dayMaster.element]
  }));

  // Format edges
  const uiEdges = graph.edges.map(edge => ({
    id: edge.id,
    source: edge.nodeA,
    target: edge.nodeB,
    score: edge.synastryScore,
    harmony: edge.harmonyScore,
    tension: edge.tensionScore,
    nature: edge.nature,
    archetype: edge.archetype || 'Unknown',
    color: edge.nature === 'harmonious' ? '#4CAF50' :
           edge.nature === 'challenging' ? '#F44336' :
           edge.nature === 'complex' ? '#FF9800' : '#9E9E9E',
    width: 1 + (edge.synastryScore / 25)
  }));

  // Format system field
  const uiSystemField = {
    elementDistribution: graph.systemField.elementDistribution,
    usefulGod: graph.systemField.usefulGod,
    strengths: graph.systemField.collectiveStrengths,
    vulnerabilities: graph.systemField.collectiveVulnerabilities,
    dynamics: graph.systemField.groupDynamics,
    purpose: graph.systemField.karmicPurpose
  };

  // Format timing
  const uiTiming = graph.systemTiming.map(t => ({
    year: t.year,
    score: t.systemScore,
    tier: t.systemTier,
    narrative: t.narrative
  }));

  // Format events
  const uiEvents = graph.systemEvents.map(e => ({
    type: e.type,
    typeChinese: e.typeChinese,
    year: e.year,
    probability: e.probability,
    narrative: e.narrative
  }));

  return {
    nodes: uiNodes,
    edges: uiEdges,
    systemField: uiSystemField,
    timing: uiTiming,
    events: uiEvents
  };
}

/**
 * Generate graph visualization layout
 */
export function generateGraphLayout(
  graph: RelationshipGraph,
  layout: 'force' | 'radial' | 'hierarchical' | 'circular' = 'force'
): GraphVisualization {
  const nodePositions = new Map<string, { x: number; y: number }>();
  const nodeColors = new Map<string, string>();
  const nodeSizes = new Map<string, number>();
  const edgeColors = new Map<string, string>();
  const edgeWidths = new Map<string, number>();

  const elementColors: Record<ElementName, string> = {
    Wood: '#4CAF50',
    Fire: '#F44336',
    Earth: '#FF9800',
    Metal: '#9E9E9E',
    Water: '#2196F3'
  };

  // Position nodes based on layout
  const centerX = 400;
  const centerY = 300;
  const radius = 200;

  for (let i = 0; i < graph.nodes.length; i++) {
    const node = graph.nodes[i];

    let x: number, y: number;

    switch (layout) {
      case 'circular':
        const angle = (2 * Math.PI * i) / graph.nodes.length;
        x = centerX + radius * Math.cos(angle);
        y = centerY + radius * Math.sin(angle);
        break;
      case 'radial':
        // Place by element
        const elementAngle = getElementAngle(node.dayMaster.element);
        const elementRadius = radius * (0.5 + Math.random() * 0.5);
        x = centerX + elementRadius * Math.cos(elementAngle);
        y = centerY + elementRadius * Math.sin(elementAngle);
        break;
      case 'hierarchical':
        // Simple vertical layout
        x = centerX + (Math.random() - 0.5) * 200;
        y = 100 + i * 80;
        break;
      default: // force
        // Random initial positions
        x = centerX + (Math.random() - 0.5) * radius * 2;
        y = centerY + (Math.random() - 0.5) * radius * 2;
    }

    nodePositions.set(node.id, { x, y });
    nodeColors.set(node.id, elementColors[node.dayMaster.element]);
    nodeSizes.set(node.id, 20 + node.elementDistribution[node.dayMaster.element] / 3);
  }

  // Set edge properties
  for (const edge of graph.edges) {
    const color = edge.nature === 'harmonious' ? '#4CAF50' :
                  edge.nature === 'challenging' ? '#F44336' :
                  edge.nature === 'complex' ? '#FF9800' : '#9E9E9E';
    edgeColors.set(edge.id, color);
    edgeWidths.set(edge.id, 1 + edge.synastryScore / 30);
  }

  return {
    nodePositions,
    edgeColors,
    nodeColors,
    nodeSizes,
    edgeWidths,
    layout
  };
}

/**
 * Get angle for element in radial layout
 */
function getElementAngle(element: ElementName): number {
  const angles: Record<ElementName, number> = {
    Wood: 0,              // East
    Fire: Math.PI / 2,    // South
    Earth: Math.PI,       // Center-ish
    Metal: -Math.PI / 2,  // West
    Water: Math.PI        // North
  };
  return angles[element];
}

// ============================================================================
// EXPORTS
// ============================================================================

// All functions and types are exported inline with 'export' keyword
