/**
 * ============================================================================
 * BAZI FAMILY CONSTELLATION ENGINE (家族系统排列)
 * ============================================================================
 *
 * The mythic, ancestral layer where BaZi becomes a living family map —
 * a multi-generational field of relationships, patterns, inheritances,
 * and karmic echoes.
 *
 * This module reveals:
 * - How ancestral patterns flow into the present
 * - How generational themes repeat or resolve
 * - How family members form energetic triangles
 * - How inherited strengths and wounds propagate
 * - How timing cycles ripple across generations
 * - How the family system evolves as a whole
 *
 * Four Layers:
 * 1. Generational Layer (祖辈层) - Mapping ancestors, parents, siblings, children
 * 2. Relational Layer (关系层) - Synastry, composites, archetypes, timing
 * 3. Systemic Layer (系统层) - Family element distribution, Useful God, Shen Sha
 * 4. Temporal Layer (时间层) - Generational timing cycles, event triggers
 *
 * Based on: Classical 命理 systemic constellation
 * Aligned with: Ancestral pattern recognition through BaZi
 * Created: January 2026
 * ============================================================================
 */

import type { CompositeChart, CompositeShenSha, CompositeLuckPillar } from './baziCompositeChart';
import type { SynastryHeatmap } from './baziSynastryHeatmap';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type Polarity = 'Yang' | 'Yin';
export type StemName = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
export type BranchName = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

/**
 * Generation level in the family tree
 */
export type GenerationLevel =
  | 'great_grandparent'  // 曾祖父母
  | 'grandparent'        // 祖父母
  | 'parent'             // 父母
  | 'self'               // 本人
  | 'sibling'            // 兄弟姐妹
  | 'child'              // 子女
  | 'grandchild';        // 孙辈

/**
 * Family relationship type
 */
export type FamilyRelationType =
  | 'spouse'
  | 'parent_child'
  | 'sibling'
  | 'grandparent_grandchild'
  | 'uncle_aunt_niece_nephew'
  | 'cousin'
  | 'in_law';

/**
 * Pillar structure
 */
export interface Pillar {
  stem: StemName;
  branch: BranchName;
}

/**
 * Natal chart input for family member
 */
export interface FamilyMemberInput {
  id: string;
  name: string;
  birthDate: Date;
  birthHour?: number;
  gender: 'male' | 'female';
  generationLevel: GenerationLevel;
  relationToRoot: string; // e.g., "father", "mother", "self", "son", "daughter"
  isRoot?: boolean; // Is this the focal person?
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar?: Pillar;
  dayMasterElement: ElementName;
  dayMasterPolarity: Polarity;
  dayMasterStrength: number; // 0-100
  elementDistribution: Record<ElementName, number>;
  shenSha?: string[];
}

/**
 * Family constellation node (processed family member)
 */
export interface ConstellationNode {
  id: string;
  name: string;
  generationLevel: GenerationLevel;
  relationToRoot: string;
  isRoot: boolean;

  // Natal data
  dayMaster: {
    element: ElementName;
    polarity: Polarity;
    strength: number;
    strengthCategory: 'weak' | 'moderate' | 'strong';
  };
  dominantElement: ElementName;
  deficientElement: ElementName;
  elementDistribution: Record<ElementName, number>;

  // Ten Gods relative to root (if not root)
  tenGodToRoot?: string;
  tenGodFromRoot?: string;

  // Shen Sha
  shenSha: string[];

  // Position in visualization
  position?: { x: number; y: number };

  // Computed archetype
  archetype?: string;
  archetypeChinese?: string;
}

/**
 * Family constellation edge (relationship between two members)
 */
export interface ConstellationEdge {
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  relationshipType: FamilyRelationType;

  // Synastry summary
  synastryScore: number;
  synastryNature: 'harmony' | 'tension' | 'neutral' | 'mixed';
  strongestHarmony?: string;
  strongestTension?: string;

  // Composite summary
  compositeElement?: ElementName;
  compositeArchetype?: string;
  compositeArchetypeChinese?: string;

  // Lifecycle phase
  lifecyclePhase?: string;

  // Edge weight for visualization
  weight: number;
  color: string;
}

/**
 * Generational layer data
 */
export interface GenerationalLayer {
  level: GenerationLevel;
  levelChinese: string;
  members: ConstellationNode[];
  layerElementDistribution: Record<ElementName, number>;
  layerDominantElement: ElementName;
  layerArchetype: string;
  layerTheme: string;
  karmicPatterns: string[];
}

/**
 * Ancestral pattern
 */
export interface AncestralPattern {
  patternName: string;
  patternNameChinese: string;
  type: 'inheritance' | 'repetition' | 'resolution' | 'transformation';
  description: string;
  sourceGeneration: GenerationLevel;
  affectedGenerations: GenerationLevel[];
  element?: ElementName;
  shenSha?: string;
  strength: 'strong' | 'moderate' | 'subtle';
}

/**
 * Family systemic field
 */
export interface FamilySystemicField {
  // Element ecosystem
  systemElementDistribution: Record<ElementName, number>;
  systemDominantElement: ElementName;
  systemDeficientElement: ElementName;
  systemUsefulGod: ElementName;
  systemAnnoyingGod: ElementName;

  // System personality
  systemArchetype: string;
  systemArchetypeChinese: string;
  systemSignature: string;

  // System Shen Sha
  systemShenSha: Array<{
    name: string;
    chineseName: string;
    frequency: number; // How many members have it
    significance: string;
  }>;

  // System Ten Gods distribution
  tenGodsDistribution: Record<string, number>;
  dominantTenGod: string;

  // Collective wound and gift
  collectiveWound: string;
  collectiveGift: string;
  collectiveDestiny: string;
}

/**
 * Timing wave for the family system
 */
export interface FamilyTimingWave {
  year: number;
  element: ElementName;
  branch: BranchName;
  systemResonance: number; // 0-100
  affectedMembers: string[];
  collectiveTheme: string;
  isTransitionYear: boolean;
  eventPotential: string[];
}

/**
 * Family temporal layer
 */
export interface FamilyTemporalLayer {
  currentYear: number;
  currentSystemResonance: number;

  // Collective timing
  familyLuckPillars: Array<{
    startYear: number;
    endYear: number;
    element: ElementName;
    favorability: 'excellent' | 'good' | 'neutral' | 'challenging' | 'difficult';
    theme: string;
  }>;

  // Timeline
  timingWaves: FamilyTimingWave[];

  // Key windows
  healingWindows: Array<{ years: string; description: string }>;
  transitionWindows: Array<{ years: string; description: string }>;
  breakthroughWindows: Array<{ years: string; description: string }>;

  // Generational cycles
  generationalCycles: Array<{
    cycleName: string;
    cycleLength: number;
    currentPhase: string;
    nextTransition: number;
  }>;
}

/**
 * Triangular relationship (three-way dynamic)
 */
export interface FamilyTriangle {
  memberA: ConstellationNode;
  memberB: ConstellationNode;
  memberC: ConstellationNode;

  triangleType: 'supportive' | 'tense' | 'balanced' | 'transformative';
  triangleElement: ElementName;
  triangleArchetype: string;
  triangleNarrative: string;

  // Edge summaries
  edgeAB?: ConstellationEdge;
  edgeBC?: ConstellationEdge;
  edgeAC?: ConstellationEdge;
}

/**
 * Complete Family Constellation
 */
export interface FamilyConstellation {
  // Identity
  familyName: string;
  rootPerson: ConstellationNode;

  // Graph structure
  nodes: ConstellationNode[];
  edges: ConstellationEdge[];
  triangles: FamilyTriangle[];

  // Layers
  generationalLayers: GenerationalLayer[];
  systemicField: FamilySystemicField;
  temporalLayer: FamilyTemporalLayer;

  // Patterns
  ancestralPatterns: AncestralPattern[];
  karmicEchoes: string[];

  // Summary
  constellationNarrative: string;
  systemInterpretation: string;

  // Metadata
  computedAt: string;
  memberCount: number;
  generationCount: number;
}

// ============================================================================
// ELEMENT MAPPINGS
// ============================================================================

const STEM_ELEMENT: Record<string, ElementName> = {
  '甲': 'Wood', '乙': 'Wood',
  '丙': 'Fire', '丁': 'Fire',
  '戊': 'Earth', '己': 'Earth',
  '庚': 'Metal', '辛': 'Metal',
  '壬': 'Water', '癸': 'Water'
};

const BRANCH_ELEMENT: Record<string, ElementName> = {
  '寅': 'Wood', '卯': 'Wood',
  '巳': 'Fire', '午': 'Fire',
  '辰': 'Earth', '丑': 'Earth', '未': 'Earth', '戌': 'Earth',
  '申': 'Metal', '酉': 'Metal',
  '亥': 'Water', '子': 'Water'
};

const STEM_POLARITY: Record<string, Polarity> = {
  '甲': 'Yang', '乙': 'Yin', '丙': 'Yang', '丁': 'Yin', '戊': 'Yang',
  '己': 'Yin', '庚': 'Yang', '辛': 'Yin', '壬': 'Yang', '癸': 'Yin'
};

const ELEMENT_CHINESE: Record<ElementName, string> = {
  Wood: '木', Fire: '火', Earth: '土', Metal: '金', Water: '水'
};

const ELEMENT_PRODUCES: Record<ElementName, ElementName> = {
  Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood'
};

const ELEMENT_CONTROLS: Record<ElementName, ElementName> = {
  Wood: 'Earth', Fire: 'Metal', Earth: 'Water', Metal: 'Wood', Water: 'Fire'
};

const GENERATION_CHINESE: Record<GenerationLevel, string> = {
  great_grandparent: '曾祖父母',
  grandparent: '祖父母',
  parent: '父母',
  self: '本人',
  sibling: '兄弟姐妹',
  child: '子女',
  grandchild: '孙辈'
};

const GENERATION_ORDER: GenerationLevel[] = [
  'great_grandparent',
  'grandparent',
  'parent',
  'self',
  'sibling',
  'child',
  'grandchild'
];

// ============================================================================
// TEN GODS RELATIVE MAPPING
// ============================================================================

/**
 * Calculate Ten God relationship between two Day Masters
 */
export function calculateTenGodRelation(
  fromElement: ElementName,
  fromPolarity: Polarity,
  toElement: ElementName,
  toPolarity: Polarity
): string {
  const samePolarity = fromPolarity === toPolarity;

  // Same element
  if (fromElement === toElement) {
    return samePolarity ? 'Companion (比肩)' : 'Rob Wealth (劫财)';
  }

  // Element that produces fromElement
  if (ELEMENT_PRODUCES[toElement] === fromElement) {
    return samePolarity ? 'Direct Resource (正印)' : 'Indirect Resource (偏印)';
  }

  // Element that fromElement produces
  if (ELEMENT_PRODUCES[fromElement] === toElement) {
    return samePolarity ? 'Eating God (食神)' : 'Hurting Officer (伤官)';
  }

  // Element that fromElement controls
  if (ELEMENT_CONTROLS[fromElement] === toElement) {
    return samePolarity ? 'Direct Wealth (正财)' : 'Indirect Wealth (偏财)';
  }

  // Element that controls fromElement
  if (ELEMENT_CONTROLS[toElement] === fromElement) {
    return samePolarity ? 'Direct Officer (正官)' : 'Seven Killings (七杀)';
  }

  return 'Unknown';
}

// ============================================================================
// NODE BUILDING
// ============================================================================

/**
 * Build a constellation node from family member input
 */
export function buildConstellationNode(
  member: FamilyMemberInput,
  rootMember?: FamilyMemberInput
): ConstellationNode {
  const strengthCategory: 'weak' | 'moderate' | 'strong' =
    member.dayMasterStrength >= 60 ? 'strong' :
    member.dayMasterStrength >= 40 ? 'moderate' : 'weak';

  // Find dominant and deficient elements
  const elements: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  let dominant: ElementName = 'Wood';
  let deficient: ElementName = 'Water';
  let maxVal = 0;
  let minVal = 100;

  for (const el of elements) {
    const val = member.elementDistribution[el] || 0;
    if (val > maxVal) {
      maxVal = val;
      dominant = el;
    }
    if (val < minVal) {
      minVal = val;
      deficient = el;
    }
  }

  // Calculate Ten God relationship to root
  let tenGodToRoot: string | undefined;
  let tenGodFromRoot: string | undefined;

  if (rootMember && member.id !== rootMember.id) {
    tenGodToRoot = calculateTenGodRelation(
      member.dayMasterElement,
      member.dayMasterPolarity,
      rootMember.dayMasterElement,
      rootMember.dayMasterPolarity
    );
    tenGodFromRoot = calculateTenGodRelation(
      rootMember.dayMasterElement,
      rootMember.dayMasterPolarity,
      member.dayMasterElement,
      member.dayMasterPolarity
    );
  }

  // Determine archetype based on Day Master
  const archetype = getDayMasterArchetype(member.dayMasterElement, member.dayMasterPolarity);

  return {
    id: member.id,
    name: member.name,
    generationLevel: member.generationLevel,
    relationToRoot: member.relationToRoot,
    isRoot: member.isRoot || false,
    dayMaster: {
      element: member.dayMasterElement,
      polarity: member.dayMasterPolarity,
      strength: member.dayMasterStrength,
      strengthCategory
    },
    dominantElement: dominant,
    deficientElement: deficient,
    elementDistribution: member.elementDistribution,
    tenGodToRoot,
    tenGodFromRoot,
    shenSha: member.shenSha || [],
    archetype: archetype.name,
    archetypeChinese: archetype.chinese
  };
}

/**
 * Get Day Master archetype
 */
function getDayMasterArchetype(element: ElementName, polarity: Polarity): { name: string; chinese: string } {
  const archetypes: Record<string, { name: string; chinese: string }> = {
    'Wood_Yang': { name: 'The Pioneer', chinese: '开拓者' },
    'Wood_Yin': { name: 'The Nurturer', chinese: '培育者' },
    'Fire_Yang': { name: 'The Illuminator', chinese: '照耀者' },
    'Fire_Yin': { name: 'The Artist', chinese: '艺术家' },
    'Earth_Yang': { name: 'The Mountain', chinese: '稳固者' },
    'Earth_Yin': { name: 'The Garden', chinese: '耕耘者' },
    'Metal_Yang': { name: 'The Warrior', chinese: '战士' },
    'Metal_Yin': { name: 'The Jeweler', chinese: '精工者' },
    'Water_Yang': { name: 'The Explorer', chinese: '探索者' },
    'Water_Yin': { name: 'The Mystic', chinese: '智慧者' }
  };

  return archetypes[`${element}_${polarity}`] || { name: 'The Seeker', chinese: '求索者' };
}

// ============================================================================
// EDGE BUILDING
// ============================================================================

/**
 * Build constellation edges between all family members
 */
export function buildConstellationEdges(
  nodes: ConstellationNode[],
  synastryData?: Map<string, SynastryHeatmap>,
  compositeData?: Map<string, CompositeChart>
): ConstellationEdge[] {
  const edges: ConstellationEdge[] = [];

  // Build edges for all pairs
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeA = nodes[i];
      const nodeB = nodes[j];

      // Determine relationship type
      const relationType = determineRelationshipType(nodeA, nodeB);

      // Get synastry if available
      const pairKey = `${nodeA.id}_${nodeB.id}`;
      const synastry = synastryData?.get(pairKey);

      // Get composite if available
      const composite = compositeData?.get(pairKey);

      // Build edge
      const edge = buildEdge(nodeA, nodeB, relationType, synastry, composite);
      edges.push(edge);
    }
  }

  return edges;
}

/**
 * Determine relationship type between two nodes
 */
function determineRelationshipType(nodeA: ConstellationNode, nodeB: ConstellationNode): FamilyRelationType {
  const levelA = GENERATION_ORDER.indexOf(nodeA.generationLevel);
  const levelB = GENERATION_ORDER.indexOf(nodeB.generationLevel);
  const levelDiff = Math.abs(levelA - levelB);

  // Same generation
  if (levelDiff === 0) {
    if (nodeA.relationToRoot.includes('spouse') || nodeB.relationToRoot.includes('spouse')) {
      return 'spouse';
    }
    return 'sibling';
  }

  // One generation apart
  if (levelDiff === 1) {
    return 'parent_child';
  }

  // Two generations apart
  if (levelDiff === 2) {
    return 'grandparent_grandchild';
  }

  // More distant
  return 'cousin';
}

/**
 * Build a single edge
 */
function buildEdge(
  nodeA: ConstellationNode,
  nodeB: ConstellationNode,
  relationType: FamilyRelationType,
  synastry?: SynastryHeatmap,
  composite?: CompositeChart
): ConstellationEdge {
  // Calculate element-based compatibility
  const elementScore = calculateElementCompatibility(
    nodeA.dayMaster.element,
    nodeB.dayMaster.element
  );

  // Use synastry score if available, otherwise use element score
  const synastryScore = synastry?.overallScore ?? elementScore;

  // Determine synastry nature
  let synastryNature: 'harmony' | 'tension' | 'neutral' | 'mixed' = 'neutral';
  if (synastryScore >= 70) {
    synastryNature = 'harmony';
  } else if (synastryScore <= 40) {
    synastryNature = 'tension';
  } else if (synastry?.strongestHarmony && synastry?.strongestTension) {
    synastryNature = 'mixed';
  }

  // Get composite info
  const compositeElement = composite?.dayMaster?.element;

  // Determine edge color based on nature
  const color = synastryNature === 'harmony' ? '#4CAF50' :
                synastryNature === 'tension' ? '#F44336' :
                synastryNature === 'mixed' ? '#FF9800' : '#9E9E9E';

  // Calculate weight (for visualization)
  const weight = Math.max(1, Math.round(synastryScore / 20));

  return {
    fromId: nodeA.id,
    toId: nodeB.id,
    fromName: nodeA.name,
    toName: nodeB.name,
    relationshipType: relationType,
    synastryScore,
    synastryNature,
    strongestHarmony: synastry?.strongestHarmony?.summary,
    strongestTension: synastry?.strongestTension?.summary,
    compositeElement,
    weight,
    color
  };
}

/**
 * Calculate element compatibility score
 */
function calculateElementCompatibility(elementA: ElementName, elementB: ElementName): number {
  // Same element
  if (elementA === elementB) {
    return 60; // Compatible but may compete
  }

  // Producing relationship (harmony)
  if (ELEMENT_PRODUCES[elementA] === elementB || ELEMENT_PRODUCES[elementB] === elementA) {
    return 75;
  }

  // Controlling relationship (tension)
  if (ELEMENT_CONTROLS[elementA] === elementB || ELEMENT_CONTROLS[elementB] === elementA) {
    return 45;
  }

  // Neutral (no direct relationship)
  return 55;
}

// ============================================================================
// GENERATIONAL LAYER COMPUTATION
// ============================================================================

/**
 * Compute generational layers from nodes
 */
export function computeGenerationalLayers(nodes: ConstellationNode[]): GenerationalLayer[] {
  const layers: GenerationalLayer[] = [];

  // Group nodes by generation level
  const levelGroups = new Map<GenerationLevel, ConstellationNode[]>();

  for (const node of nodes) {
    const existing = levelGroups.get(node.generationLevel) || [];
    existing.push(node);
    levelGroups.set(node.generationLevel, existing);
  }

  // Build layers in order
  for (const level of GENERATION_ORDER) {
    const members = levelGroups.get(level);
    if (!members || members.length === 0) continue;

    // Compute layer element distribution
    const layerDistribution = computeLayerElementDistribution(members);
    const dominant = getStrongestElement(layerDistribution);

    // Determine layer archetype and theme
    const archetype = getLayerArchetype(dominant, members.length);
    const theme = getLayerTheme(dominant, level);

    // Find karmic patterns in this layer
    const karmicPatterns = findLayerKarmicPatterns(members);

    layers.push({
      level,
      levelChinese: GENERATION_CHINESE[level],
      members,
      layerElementDistribution: layerDistribution,
      layerDominantElement: dominant,
      layerArchetype: archetype,
      layerTheme: theme,
      karmicPatterns
    });
  }

  return layers;
}

/**
 * Compute layer element distribution
 */
function computeLayerElementDistribution(members: ConstellationNode[]): Record<ElementName, number> {
  const distribution: Record<ElementName, number> = {
    Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0
  };

  if (members.length === 0) return distribution;

  for (const member of members) {
    for (const el of ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as ElementName[]) {
      distribution[el] += member.elementDistribution[el] || 0;
    }
  }

  // Normalize to percentages
  const total = distribution.Wood + distribution.Fire + distribution.Earth +
                distribution.Metal + distribution.Water;

  if (total > 0) {
    for (const el of ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as ElementName[]) {
      distribution[el] = Math.round((distribution[el] / total) * 100);
    }
  }

  return distribution;
}

/**
 * Get strongest element from distribution
 */
function getStrongestElement(distribution: Record<ElementName, number>): ElementName {
  let strongest: ElementName = 'Wood';
  let maxVal = 0;

  for (const el of ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as ElementName[]) {
    if (distribution[el] > maxVal) {
      maxVal = distribution[el];
      strongest = el;
    }
  }

  return strongest;
}

/**
 * Get weakest element from distribution
 */
function getWeakestElement(distribution: Record<ElementName, number>): ElementName {
  let weakest: ElementName = 'Wood';
  let minVal = 100;

  for (const el of ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as ElementName[]) {
    if (distribution[el] < minVal) {
      minVal = distribution[el];
      weakest = el;
    }
  }

  return weakest;
}

/**
 * Get layer archetype
 */
function getLayerArchetype(dominant: ElementName, memberCount: number): string {
  const archetypes: Record<ElementName, string> = {
    Wood: memberCount > 2 ? 'The Growing Forest' : 'The Twin Trees',
    Fire: memberCount > 2 ? 'The Blazing Hearth' : 'The Dancing Flames',
    Earth: memberCount > 2 ? 'The Mountain Range' : 'The Foundation Stones',
    Metal: memberCount > 2 ? 'The Forged Alliance' : 'The Mirror Pair',
    Water: memberCount > 2 ? 'The Deep River' : 'The Connected Wells'
  };

  return archetypes[dominant];
}

/**
 * Get layer theme
 */
function getLayerTheme(dominant: ElementName, level: GenerationLevel): string {
  const themes: Record<ElementName, Record<GenerationLevel, string>> = {
    Wood: {
      great_grandparent: 'Ancestral growth and pioneering spirit',
      grandparent: 'Foundation of family expansion',
      parent: 'Nurturing growth and emotional support',
      self: 'Personal growth and creative expression',
      sibling: 'Shared growth journey',
      child: 'Seeds of future growth',
      grandchild: 'Legacy of expansion'
    },
    Fire: {
      great_grandparent: 'Ancestral passion and visibility',
      grandparent: 'Wisdom through transformation',
      parent: 'Guiding light and inspiration',
      self: 'Personal illumination',
      sibling: 'Shared flame',
      child: 'Spark of new fire',
      grandchild: 'Continuation of the flame'
    },
    Earth: {
      great_grandparent: 'Ancient stability and tradition',
      grandparent: 'Foundation of security',
      parent: 'Grounding and nurturing',
      self: 'Personal stability',
      sibling: 'Shared ground',
      child: 'Building new foundations',
      grandchild: 'Legacy of stability'
    },
    Metal: {
      great_grandparent: 'Ancestral discipline and structure',
      grandparent: 'Refined wisdom',
      parent: 'Clarity and boundaries',
      self: 'Personal refinement',
      sibling: 'Shared precision',
      child: 'New clarity',
      grandchild: 'Polished legacy'
    },
    Water: {
      great_grandparent: 'Deep ancestral wisdom',
      grandparent: 'Intuitive knowing',
      parent: 'Emotional depth',
      self: 'Personal wisdom',
      sibling: 'Shared intuition',
      child: 'New depths',
      grandchild: 'Flow of wisdom'
    }
  };

  return themes[dominant][level] || 'Generational energy';
}

/**
 * Find karmic patterns in a layer
 */
function findLayerKarmicPatterns(members: ConstellationNode[]): string[] {
  const patterns: string[] = [];

  // Check for repeated Day Master elements
  const dmElements = members.map(m => m.dayMaster.element);
  const elementCounts = new Map<ElementName, number>();

  for (const el of dmElements) {
    elementCounts.set(el, (elementCounts.get(el) || 0) + 1);
  }

  const elementEntries = Array.from(elementCounts.entries());
  for (const [element, count] of elementEntries) {
    if (count >= 2) {
      patterns.push(`Repeated ${element} Day Master — shared elemental destiny`);
    }
  }

  // Check for shared Shen Sha
  const allShenSha: string[] = [];
  for (const member of members) {
    allShenSha.push(...member.shenSha);
  }

  const shenshaCounts = new Map<string, number>();
  for (const ss of allShenSha) {
    shenshaCounts.set(ss, (shenshaCounts.get(ss) || 0) + 1);
  }

  const shenShaEntries = Array.from(shenshaCounts.entries());
  for (const [ss, count] of shenShaEntries) {
    if (count >= 2) {
      patterns.push(`Shared ${ss} — inherited star pattern`);
    }
  }

  return patterns;
}

// ============================================================================
// SYSTEMIC FIELD COMPUTATION
// ============================================================================

/**
 * Compute the family systemic field
 */
export function computeFamilySystemicField(nodes: ConstellationNode[]): FamilySystemicField {
  // Compute system element distribution
  const systemDistribution = computeLayerElementDistribution(nodes);
  const dominant = getStrongestElement(systemDistribution);
  const deficient = getWeakestElement(systemDistribution);

  // Compute system Useful God and Annoying God
  const usefulGod = computeSystemUsefulGod(systemDistribution, dominant);
  const annoyingGod = computeSystemAnnoyingGod(usefulGod);

  // Compute system archetype
  const archetype = getSystemArchetype(dominant, nodes.length);
  const signature = getSystemSignature(systemDistribution);

  // Compute system Shen Sha
  const systemShenSha = computeSystemShenSha(nodes);

  // Compute Ten Gods distribution
  const tenGodsDistribution = computeTenGodsDistribution(nodes);
  const dominantTenGod = getDominantTenGod(tenGodsDistribution);

  // Determine collective patterns
  const collectiveWound = findCollectiveWound(deficient, tenGodsDistribution);
  const collectiveGift = findCollectiveGift(dominant, tenGodsDistribution);
  const collectiveDestiny = findCollectiveDestiny(dominant, usefulGod, systemShenSha);

  return {
    systemElementDistribution: systemDistribution,
    systemDominantElement: dominant,
    systemDeficientElement: deficient,
    systemUsefulGod: usefulGod,
    systemAnnoyingGod: annoyingGod,
    systemArchetype: archetype.name,
    systemArchetypeChinese: archetype.chinese,
    systemSignature: signature,
    systemShenSha,
    tenGodsDistribution,
    dominantTenGod,
    collectiveWound,
    collectiveGift,
    collectiveDestiny
  };
}

/**
 * Compute system Useful God
 */
function computeSystemUsefulGod(
  distribution: Record<ElementName, number>,
  dominant: ElementName
): ElementName {
  // If system is too dominant in one element, need the controlling or draining element
  if (distribution[dominant] >= 35) {
    // Need element that controls dominant or element that dominant produces
    const controlling = Object.entries(ELEMENT_CONTROLS).find(([_, v]) => v === dominant)?.[0] as ElementName;
    if (controlling) return controlling;
  }

  // Otherwise, strengthen the weakest productive element
  const deficient = getWeakestElement(distribution);
  const producer = Object.entries(ELEMENT_PRODUCES).find(([_, v]) => v === deficient)?.[0] as ElementName;

  return producer || 'Earth';
}

/**
 * Compute system Annoying God
 */
function computeSystemAnnoyingGod(usefulGod: ElementName): ElementName {
  // Annoying God is what controls the Useful God
  return Object.entries(ELEMENT_CONTROLS).find(([_, v]) => v === usefulGod)?.[0] as ElementName || 'Wood';
}

/**
 * Get system archetype
 */
function getSystemArchetype(dominant: ElementName, memberCount: number): { name: string; chinese: string } {
  const archetypes: Record<ElementName, { name: string; chinese: string }> = {
    Wood: { name: 'The Growing Forest Clan', chinese: '成长森林族' },
    Fire: { name: 'The Illuminated House', chinese: '光明之家' },
    Earth: { name: 'The Mountain Fortress', chinese: '山岳堡垒' },
    Metal: { name: 'The Forged Dynasty', chinese: '锻造王朝' },
    Water: { name: 'The Flowing River Lineage', chinese: '流水血脉' }
  };

  return archetypes[dominant];
}

/**
 * Get system signature
 */
function getSystemSignature(distribution: Record<ElementName, number>): string {
  const elements: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const sorted = elements.sort((a, b) => distribution[b] - distribution[a]);

  return `${ELEMENT_CHINESE[sorted[0]]}${distribution[sorted[0]]}%-${ELEMENT_CHINESE[sorted[1]]}${distribution[sorted[1]]}%-${ELEMENT_CHINESE[sorted[2]]}${distribution[sorted[2]]}%`;
}

/**
 * Compute system Shen Sha
 */
function computeSystemShenSha(nodes: ConstellationNode[]): FamilySystemicField['systemShenSha'] {
  const shenShaCounts = new Map<string, number>();

  for (const node of nodes) {
    for (const ss of node.shenSha) {
      shenShaCounts.set(ss, (shenShaCounts.get(ss) || 0) + 1);
    }
  }

  const result: FamilySystemicField['systemShenSha'] = [];

  const shenShaEntries = Array.from(shenShaCounts.entries());
  for (const [name, count] of shenShaEntries) {
    const significance = count >= 3 ? 'Strong family pattern' :
                        count >= 2 ? 'Repeated across generations' :
                        'Individual presence';

    result.push({
      name,
      chineseName: getShenShaChineseName(name),
      frequency: count,
      significance
    });
  }

  // Sort by frequency
  result.sort((a, b) => b.frequency - a.frequency);

  return result.slice(0, 10); // Top 10
}

/**
 * Get Shen Sha Chinese name
 */
function getShenShaChineseName(name: string): string {
  const names: Record<string, string> = {
    'Peach Blossom': '桃花',
    'Red Matchmaker': '红鸾',
    'Sky Happiness': '天喜',
    'Heavenly Nobleman': '天乙贵人',
    'Academic Star': '文昌',
    'General Star': '将星',
    'Traveling Horse': '驿马',
    'Loneliness Star': '孤辰',
    'Widow Star': '寡宿'
  };

  return names[name] || name;
}

/**
 * Compute Ten Gods distribution across family
 */
function computeTenGodsDistribution(nodes: ConstellationNode[]): Record<string, number> {
  const distribution: Record<string, number> = {
    'Companion': 0,
    'Rob Wealth': 0,
    'Eating God': 0,
    'Hurting Officer': 0,
    'Direct Wealth': 0,
    'Indirect Wealth': 0,
    'Direct Officer': 0,
    'Seven Killings': 0,
    'Direct Resource': 0,
    'Indirect Resource': 0
  };

  for (const node of nodes) {
    if (node.tenGodToRoot) {
      const tenGod = node.tenGodToRoot.split(' (')[0]; // Extract name without Chinese
      if (distribution[tenGod] !== undefined) {
        distribution[tenGod]++;
      }
    }
  }

  return distribution;
}

/**
 * Get dominant Ten God
 */
function getDominantTenGod(distribution: Record<string, number>): string {
  let dominant = 'Companion';
  let maxCount = 0;

  for (const [tenGod, count] of Object.entries(distribution)) {
    if (count > maxCount) {
      maxCount = count;
      dominant = tenGod;
    }
  }

  return dominant;
}

/**
 * Find collective wound
 */
function findCollectiveWound(
  deficient: ElementName,
  _tenGods: Record<string, number>
): string {
  const wounds: Record<ElementName, string> = {
    Wood: 'Difficulty with growth, flexibility, or emotional expression',
    Fire: 'Challenges with visibility, passion, or self-expression',
    Earth: 'Struggles with stability, groundedness, or trust',
    Metal: 'Issues with boundaries, structure, or letting go',
    Water: 'Difficulty with depth, intuition, or emotional flow'
  };

  return wounds[deficient];
}

/**
 * Find collective gift
 */
function findCollectiveGift(
  dominant: ElementName,
  _tenGods: Record<string, number>
): string {
  const gifts: Record<ElementName, string> = {
    Wood: 'Natural capacity for growth, healing, and emotional intelligence',
    Fire: 'Innate ability to inspire, create, and bring joy',
    Earth: 'Deep stability, reliability, and nurturing presence',
    Metal: 'Clear boundaries, precision, and refined excellence',
    Water: 'Profound wisdom, intuition, and adaptability'
  };

  return gifts[dominant];
}

/**
 * Find collective destiny
 */
function findCollectiveDestiny(
  dominant: ElementName,
  usefulGod: ElementName,
  systemShenSha: FamilySystemicField['systemShenSha']
): string {
  const hasNobleman = systemShenSha.some(s => s.name === 'Heavenly Nobleman' && s.frequency >= 2);
  const hasAcademic = systemShenSha.some(s => s.name === 'Academic Star' && s.frequency >= 2);
  const hasRomantic = systemShenSha.some(s =>
    (s.name === 'Peach Blossom' || s.name === 'Red Matchmaker') && s.frequency >= 2
  );

  let destiny = `A lineage of ${dominant} energy, thriving when aligned with ${usefulGod}. `;

  if (hasNobleman) {
    destiny += 'Protected by noble energy across generations. ';
  }
  if (hasAcademic) {
    destiny += 'A family of learners and teachers. ';
  }
  if (hasRomantic) {
    destiny += 'Deep romantic and emotional connections run through the bloodline. ';
  }

  return destiny.trim();
}

// ============================================================================
// TEMPORAL LAYER COMPUTATION
// ============================================================================

/**
 * Compute family temporal layer
 */
export function computeFamilyTemporalLayer(
  nodes: ConstellationNode[],
  systemicField: FamilySystemicField,
  currentYear: number = new Date().getFullYear()
): FamilyTemporalLayer {
  // Compute timing waves for next 20 years
  const timingWaves = computeTimingWaves(nodes, systemicField, currentYear, 20);

  // Find current system resonance
  const currentWave = timingWaves.find(w => w.year === currentYear);
  const currentResonance = currentWave?.systemResonance ?? 50;

  // Compute family luck pillars
  const familyLuckPillars = computeFamilyLuckPillars(systemicField, currentYear);

  // Find key windows
  const healingWindows = findHealingWindows(timingWaves, systemicField);
  const transitionWindows = findTransitionWindows(timingWaves);
  const breakthroughWindows = findBreakthroughWindows(timingWaves, systemicField);

  // Compute generational cycles
  const generationalCycles = computeGenerationalCycles(nodes, currentYear);

  return {
    currentYear,
    currentSystemResonance: currentResonance,
    familyLuckPillars,
    timingWaves,
    healingWindows,
    transitionWindows,
    breakthroughWindows,
    generationalCycles
  };
}

/**
 * Compute timing waves
 */
function computeTimingWaves(
  nodes: ConstellationNode[],
  systemicField: FamilySystemicField,
  startYear: number,
  years: number
): FamilyTimingWave[] {
  const waves: FamilyTimingWave[] = [];

  const yearBranches: BranchName[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const yearStems: StemName[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

  for (let i = 0; i < years; i++) {
    const year = startYear + i;

    // Calculate year's element (simplified)
    const branchIndex = (year - 4) % 12;
    const stemIndex = (year - 4) % 10;

    const branch = yearBranches[branchIndex];
    const stem = yearStems[stemIndex];
    const element = STEM_ELEMENT[stem];

    // Calculate system resonance
    const resonance = calculateYearResonance(
      element,
      systemicField.systemUsefulGod,
      systemicField.systemAnnoyingGod,
      systemicField.systemElementDistribution
    );

    // Find affected members
    const affected = findAffectedMembers(nodes, element, branch);

    // Determine collective theme
    const theme = getYearCollectiveTheme(element, resonance);

    // Check if transition year
    const isTransition = resonance <= 40 || resonance >= 75 || i % 10 === 0;

    // Event potential
    const events = getEventPotential(element, resonance, systemicField);

    waves.push({
      year,
      element,
      branch,
      systemResonance: resonance,
      affectedMembers: affected,
      collectiveTheme: theme,
      isTransitionYear: isTransition,
      eventPotential: events
    });
  }

  return waves;
}

/**
 * Calculate year resonance with family system
 */
function calculateYearResonance(
  yearElement: ElementName,
  usefulGod: ElementName,
  annoyingGod: ElementName,
  systemDistribution: Record<ElementName, number>
): number {
  let resonance = 50; // Base

  // Useful God alignment
  if (yearElement === usefulGod) {
    resonance += 25;
  }

  // Annoying God activation
  if (yearElement === annoyingGod) {
    resonance -= 20;
  }

  // Element produces Useful God
  if (ELEMENT_PRODUCES[yearElement] === usefulGod) {
    resonance += 15;
  }

  // Element produces Annoying God
  if (ELEMENT_PRODUCES[yearElement] === annoyingGod) {
    resonance -= 10;
  }

  // System element support
  if (systemDistribution[yearElement] >= 25) {
    resonance += 10; // Year element is strong in system
  }

  return Math.max(0, Math.min(100, resonance));
}

/**
 * Find affected members for a given year
 */
function findAffectedMembers(
  nodes: ConstellationNode[],
  element: ElementName,
  _branch: BranchName
): string[] {
  const affected: string[] = [];

  for (const node of nodes) {
    // Day Master same element
    if (node.dayMaster.element === element) {
      affected.push(node.name);
      continue;
    }

    // Dominant element same
    if (node.dominantElement === element) {
      affected.push(node.name);
    }
  }

  return affected;
}

/**
 * Get collective theme for year
 */
function getYearCollectiveTheme(element: ElementName, resonance: number): string {
  const themes: Record<ElementName, { high: string; low: string }> = {
    Wood: {
      high: 'Family growth and new beginnings',
      low: 'Growth challenges, need for flexibility'
    },
    Fire: {
      high: 'Family visibility and celebration',
      low: 'Passion conflicts, burnout risk'
    },
    Earth: {
      high: 'Family stability and grounding',
      low: 'Stagnation concerns, need for movement'
    },
    Metal: {
      high: 'Family structure and refinement',
      low: 'Rigidity issues, need for softness'
    },
    Water: {
      high: 'Family wisdom and depth',
      low: 'Emotional overwhelm, need for clarity'
    }
  };

  return resonance >= 60 ? themes[element].high : themes[element].low;
}

/**
 * Get event potential for year
 */
function getEventPotential(
  element: ElementName,
  resonance: number,
  systemicField: FamilySystemicField
): string[] {
  const events: string[] = [];

  if (resonance >= 75) {
    events.push('Major positive family event likely');
    if (element === systemicField.systemUsefulGod) {
      events.push('Peak year for family prosperity');
    }
  }

  if (resonance >= 60) {
    events.push('Good year for family gatherings');
    if (element === 'Fire') {
      events.push('Celebrations and recognition');
    }
    if (element === 'Water') {
      events.push('Deep family conversations');
    }
  }

  if (resonance <= 40) {
    events.push('Year requiring family attention');
    if (element === systemicField.systemAnnoyingGod) {
      events.push('Navigate challenges together');
    }
  }

  return events;
}

/**
 * Compute family luck pillars
 */
function computeFamilyLuckPillars(
  systemicField: FamilySystemicField,
  currentYear: number
): FamilyTemporalLayer['familyLuckPillars'] {
  const pillars: FamilyTemporalLayer['familyLuckPillars'] = [];
  const elements: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  // Generate 6 ten-year pillars
  for (let i = 0; i < 6; i++) {
    const startYear = currentYear + (i * 10);
    const endYear = startYear + 9;
    const element = elements[i % 5];

    // Determine favorability based on Useful God alignment
    let favorability: 'excellent' | 'good' | 'neutral' | 'challenging' | 'difficult';

    if (element === systemicField.systemUsefulGod) {
      favorability = 'excellent';
    } else if (ELEMENT_PRODUCES[element] === systemicField.systemUsefulGod) {
      favorability = 'good';
    } else if (element === systemicField.systemAnnoyingGod) {
      favorability = 'challenging';
    } else if (ELEMENT_PRODUCES[element] === systemicField.systemAnnoyingGod) {
      favorability = 'difficult';
    } else {
      favorability = 'neutral';
    }

    const theme = getLuckPillarTheme(element, favorability);

    pillars.push({
      startYear,
      endYear,
      element,
      favorability,
      theme
    });
  }

  return pillars;
}

/**
 * Get luck pillar theme
 */
function getLuckPillarTheme(element: ElementName, favorability: string): string {
  if (favorability === 'excellent' || favorability === 'good') {
    const themes: Record<ElementName, string> = {
      Wood: 'Period of family growth and expansion',
      Fire: 'Era of family visibility and achievement',
      Earth: 'Time of family stability and accumulation',
      Metal: 'Phase of family refinement and structure',
      Water: 'Period of family wisdom and depth'
    };
    return themes[element];
  } else {
    const themes: Record<ElementName, string> = {
      Wood: 'Navigate growth challenges together',
      Fire: 'Manage intensity and passion',
      Earth: 'Address stagnation and routine',
      Metal: 'Balance structure with flexibility',
      Water: 'Navigate emotional depths'
    };
    return themes[element];
  }
}

/**
 * Find healing windows
 */
function findHealingWindows(
  waves: FamilyTimingWave[],
  systemicField: FamilySystemicField
): Array<{ years: string; description: string }> {
  const windows: Array<{ years: string; description: string }> = [];

  let windowStart: number | null = null;

  for (const wave of waves) {
    const isHealing =
      wave.element === 'Water' ||
      wave.element === systemicField.systemUsefulGod ||
      wave.systemResonance >= 70;

    if (isHealing && windowStart === null) {
      windowStart = wave.year;
    } else if (!isHealing && windowStart !== null) {
      windows.push({
        years: windowStart === wave.year - 1 ? `${windowStart}` : `${windowStart}-${wave.year - 1}`,
        description: `Healing and restoration period for the family`
      });
      windowStart = null;
    }
  }

  if (windowStart !== null) {
    windows.push({
      years: `${windowStart}+`,
      description: `Ongoing healing period`
    });
  }

  return windows.slice(0, 5);
}

/**
 * Find transition windows
 */
function findTransitionWindows(
  waves: FamilyTimingWave[]
): Array<{ years: string; description: string }> {
  const windows: Array<{ years: string; description: string }> = [];

  for (const wave of waves) {
    if (wave.isTransitionYear) {
      windows.push({
        years: `${wave.year}`,
        description: `${wave.element} transition — ${wave.collectiveTheme}`
      });
    }
  }

  return windows.slice(0, 5);
}

/**
 * Find breakthrough windows
 */
function findBreakthroughWindows(
  waves: FamilyTimingWave[],
  systemicField: FamilySystemicField
): Array<{ years: string; description: string }> {
  const windows: Array<{ years: string; description: string }> = [];

  for (const wave of waves) {
    if (wave.systemResonance >= 75 && wave.element === systemicField.systemUsefulGod) {
      windows.push({
        years: `${wave.year}`,
        description: `Peak ${wave.element} year — optimal for family breakthroughs`
      });
    }
  }

  return windows.slice(0, 5);
}

/**
 * Compute generational cycles
 */
function computeGenerationalCycles(
  nodes: ConstellationNode[],
  currentYear: number
): FamilyTemporalLayer['generationalCycles'] {
  const cycles: FamilyTemporalLayer['generationalCycles'] = [];

  // 12-year cycle (Earth Branch cycle)
  cycles.push({
    cycleName: '12-Year Earth Branch Cycle',
    cycleLength: 12,
    currentPhase: `Year ${(currentYear - 4) % 12 + 1} of 12`,
    nextTransition: currentYear + (12 - ((currentYear - 4) % 12))
  });

  // 60-year JiaZi cycle
  cycles.push({
    cycleName: '60-Year JiaZi Cycle',
    cycleLength: 60,
    currentPhase: `Year ${(currentYear - 4) % 60 + 1} of 60`,
    nextTransition: currentYear + (60 - ((currentYear - 4) % 60))
  });

  // Generational cycle based on family members
  const generations = new Set(nodes.map(n => n.generationLevel));
  cycles.push({
    cycleName: 'Family Generational Cycle',
    cycleLength: 30, // Approximately one generation
    currentPhase: `${generations.size} generations active`,
    nextTransition: currentYear + 10 // Estimate
  });

  return cycles;
}

// ============================================================================
// ANCESTRAL PATTERN DETECTION
// ============================================================================

/**
 * Detect ancestral patterns across generations
 */
export function detectAncestralPatterns(
  layers: GenerationalLayer[],
  edges: ConstellationEdge[]
): AncestralPattern[] {
  const patterns: AncestralPattern[] = [];

  // Pattern 1: Element inheritance
  patterns.push(...detectElementInheritance(layers));

  // Pattern 2: Shen Sha repetition
  patterns.push(...detectShenShaRepetition(layers));

  // Pattern 3: Relationship pattern repetition
  patterns.push(...detectRelationshipPatterns(edges, layers));

  // Pattern 4: Day Master lineage
  patterns.push(...detectDayMasterLineage(layers));

  // Pattern 5: Transformational patterns
  patterns.push(...detectTransformationalPatterns(layers));

  return patterns;
}

/**
 * Detect element inheritance patterns
 */
function detectElementInheritance(layers: GenerationalLayer[]): AncestralPattern[] {
  const patterns: AncestralPattern[] = [];

  // Check if dominant element persists across generations
  const dominants = layers.map(l => l.layerDominantElement);
  const elementCounts = new Map<ElementName, number>();

  for (const el of dominants) {
    elementCounts.set(el, (elementCounts.get(el) || 0) + 1);
  }

  const elementEntries = Array.from(elementCounts.entries());
  for (const [element, count] of elementEntries) {
    if (count >= 2) {
      patterns.push({
        patternName: `${element} Lineage`,
        patternNameChinese: `${ELEMENT_CHINESE[element]}脉传承`,
        type: 'inheritance',
        description: `${element} energy dominates across ${count} generations, indicating an inherited elemental destiny.`,
        sourceGeneration: layers[0].level,
        affectedGenerations: layers.filter(l => l.layerDominantElement === element).map(l => l.level),
        element,
        strength: count >= 3 ? 'strong' : 'moderate'
      });
    }
  }

  return patterns;
}

/**
 * Detect Shen Sha repetition patterns
 */
function detectShenShaRepetition(layers: GenerationalLayer[]): AncestralPattern[] {
  const patterns: AncestralPattern[] = [];

  // Collect all Shen Sha across generations
  const shenShaByGeneration = new Map<string, GenerationLevel[]>();

  for (const layer of layers) {
    for (const member of layer.members) {
      for (const ss of member.shenSha) {
        const existing = shenShaByGeneration.get(ss) || [];
        if (!existing.includes(layer.level)) {
          existing.push(layer.level);
        }
        shenShaByGeneration.set(ss, existing);
      }
    }
  }

  const shenShaEntries = Array.from(shenShaByGeneration.entries());
  for (const [ss, gens] of shenShaEntries) {
    if (gens.length >= 2) {
      patterns.push({
        patternName: `Inherited ${ss}`,
        patternNameChinese: `${getShenShaChineseName(ss)}传承`,
        type: 'repetition',
        description: `${ss} appears across ${gens.length} generations, suggesting an inherited star pattern.`,
        sourceGeneration: gens[0],
        affectedGenerations: gens,
        shenSha: ss,
        strength: gens.length >= 3 ? 'strong' : 'moderate'
      });
    }
  }

  return patterns;
}

/**
 * Detect relationship pattern repetition
 */
function detectRelationshipPatterns(
  edges: ConstellationEdge[],
  layers: GenerationalLayer[]
): AncestralPattern[] {
  const patterns: AncestralPattern[] = [];

  // Check for repeated high-harmony or high-tension patterns
  const harmonyEdges = edges.filter(e => e.synastryNature === 'harmony');
  const tensionEdges = edges.filter(e => e.synastryNature === 'tension');

  if (harmonyEdges.length >= edges.length * 0.6) {
    patterns.push({
      patternName: 'Harmony Lineage',
      patternNameChinese: '和谐传承',
      type: 'inheritance',
      description: 'Strong harmony patterns dominate family relationships, indicating inherited relational ease.',
      sourceGeneration: layers[0]?.level || 'grandparent',
      affectedGenerations: layers.map(l => l.level),
      strength: 'strong'
    });
  }

  if (tensionEdges.length >= edges.length * 0.4) {
    patterns.push({
      patternName: 'Karmic Tension Pattern',
      patternNameChinese: '业力张力',
      type: 'resolution',
      description: 'Recurring tension patterns suggest karmic work being processed through the family system.',
      sourceGeneration: layers[0]?.level || 'grandparent',
      affectedGenerations: layers.map(l => l.level),
      strength: 'moderate'
    });
  }

  return patterns;
}

/**
 * Detect Day Master lineage patterns
 */
function detectDayMasterLineage(layers: GenerationalLayer[]): AncestralPattern[] {
  const patterns: AncestralPattern[] = [];

  // Check for repeated Day Master elements across generations
  const dmElements: ElementName[] = [];

  for (const layer of layers) {
    for (const member of layer.members) {
      dmElements.push(member.dayMaster.element);
    }
  }

  const dmCounts = new Map<ElementName, number>();
  for (const el of dmElements) {
    dmCounts.set(el, (dmCounts.get(el) || 0) + 1);
  }

  const dmEntries = Array.from(dmCounts.entries());
  for (const [element, count] of dmEntries) {
    const percentage = (count / dmElements.length) * 100;
    if (percentage >= 40) {
      patterns.push({
        patternName: `${element} Day Master Lineage`,
        patternNameChinese: `${ELEMENT_CHINESE[element]}日主血脉`,
        type: 'inheritance',
        description: `${Math.round(percentage)}% of family members share ${element} Day Master, indicating strong elemental inheritance.`,
        sourceGeneration: layers[0]?.level || 'grandparent',
        affectedGenerations: layers.map(l => l.level),
        element,
        strength: percentage >= 50 ? 'strong' : 'moderate'
      });
    }
  }

  return patterns;
}

/**
 * Detect transformational patterns
 */
function detectTransformationalPatterns(layers: GenerationalLayer[]): AncestralPattern[] {
  const patterns: AncestralPattern[] = [];

  // Check for element shifts across generations
  if (layers.length >= 2) {
    for (let i = 0; i < layers.length - 1; i++) {
      const current = layers[i];
      const next = layers[i + 1];

      if (current.layerDominantElement !== next.layerDominantElement) {
        // Check if it's a productive shift (element produces next)
        const isProductive = ELEMENT_PRODUCES[current.layerDominantElement] === next.layerDominantElement;

        if (isProductive) {
          patterns.push({
            patternName: 'Generational Evolution',
            patternNameChinese: '代际演进',
            type: 'transformation',
            description: `${current.layerDominantElement} energy transforms into ${next.layerDominantElement} across generations — a natural evolutionary pattern.`,
            sourceGeneration: current.level,
            affectedGenerations: [current.level, next.level],
            element: next.layerDominantElement,
            strength: 'moderate'
          });
        }
      }
    }
  }

  return patterns;
}

// ============================================================================
// TRIANGLE COMPUTATION
// ============================================================================

/**
 * Build family triangles
 */
export function buildFamilyTriangles(
  nodes: ConstellationNode[],
  edges: ConstellationEdge[]
): FamilyTriangle[] {
  const triangles: FamilyTriangle[] = [];

  // Find significant triangles (parent-child-child, grandparent-parent-child, etc.)
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      for (let k = j + 1; k < nodes.length; k++) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];
        const nodeC = nodes[k];

        // Check if this is a meaningful triangle
        if (!isMeaningfulTriangle(nodeA, nodeB, nodeC)) continue;

        // Find edges
        const edgeAB = edges.find(e =>
          (e.fromId === nodeA.id && e.toId === nodeB.id) ||
          (e.fromId === nodeB.id && e.toId === nodeA.id)
        );
        const edgeBC = edges.find(e =>
          (e.fromId === nodeB.id && e.toId === nodeC.id) ||
          (e.fromId === nodeC.id && e.toId === nodeB.id)
        );
        const edgeAC = edges.find(e =>
          (e.fromId === nodeA.id && e.toId === nodeC.id) ||
          (e.fromId === nodeC.id && e.toId === nodeA.id)
        );

        // Compute triangle properties
        const triangle = computeTriangle(nodeA, nodeB, nodeC, edgeAB, edgeBC, edgeAC);
        triangles.push(triangle);
      }
    }
  }

  return triangles.slice(0, 10); // Limit to top 10 triangles
}

/**
 * Check if triangle is meaningful
 */
function isMeaningfulTriangle(
  nodeA: ConstellationNode,
  nodeB: ConstellationNode,
  nodeC: ConstellationNode
): boolean {
  // Include root in at least one node
  if (!nodeA.isRoot && !nodeB.isRoot && !nodeC.isRoot) {
    // Still include if it spans multiple generations
    const levels = new Set([nodeA.generationLevel, nodeB.generationLevel, nodeC.generationLevel]);
    return levels.size >= 2;
  }

  return true;
}

/**
 * Compute triangle properties
 */
function computeTriangle(
  nodeA: ConstellationNode,
  nodeB: ConstellationNode,
  nodeC: ConstellationNode,
  edgeAB?: ConstellationEdge,
  edgeBC?: ConstellationEdge,
  edgeAC?: ConstellationEdge
): FamilyTriangle {
  // Calculate average synastry score
  const scores = [
    edgeAB?.synastryScore ?? 50,
    edgeBC?.synastryScore ?? 50,
    edgeAC?.synastryScore ?? 50
  ];
  const avgScore = scores.reduce((a, b) => a + b, 0) / 3;

  // Determine triangle type
  let triangleType: 'supportive' | 'tense' | 'balanced' | 'transformative';

  if (avgScore >= 70) {
    triangleType = 'supportive';
  } else if (avgScore <= 40) {
    triangleType = 'tense';
  } else if (Math.max(...scores) - Math.min(...scores) >= 30) {
    triangleType = 'transformative';
  } else {
    triangleType = 'balanced';
  }

  // Find triangle element (most common)
  const elements = [nodeA.dayMaster.element, nodeB.dayMaster.element, nodeC.dayMaster.element];
  const triangleElement = findMostCommon(elements);

  // Generate archetype and narrative
  const archetype = getTriangleArchetype(triangleType, triangleElement);
  const narrative = getTriangleNarrative(nodeA, nodeB, nodeC, triangleType);

  return {
    memberA: nodeA,
    memberB: nodeB,
    memberC: nodeC,
    triangleType,
    triangleElement,
    triangleArchetype: archetype,
    triangleNarrative: narrative,
    edgeAB,
    edgeBC,
    edgeAC
  };
}

/**
 * Find most common element
 */
function findMostCommon<T>(items: T[]): T {
  const counts = new Map<T, number>();
  for (const item of items) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }

  let maxItem = items[0];
  let maxCount = 0;

  const entries = Array.from(counts.entries());
  for (const [item, count] of entries) {
    if (count > maxCount) {
      maxCount = count;
      maxItem = item;
    }
  }

  return maxItem;
}

/**
 * Get triangle archetype
 */
function getTriangleArchetype(type: string, element: ElementName): string {
  const archetypes: Record<string, Record<ElementName, string>> = {
    supportive: {
      Wood: 'The Growing Trinity',
      Fire: 'The Blazing Triangle',
      Earth: 'The Foundation Triad',
      Metal: 'The Forged Three',
      Water: 'The Deep Connection'
    },
    tense: {
      Wood: 'The Competing Trees',
      Fire: 'The Friction Fire',
      Earth: 'The Fault Lines',
      Metal: 'The Clashing Swords',
      Water: 'The Turbulent Waters'
    },
    balanced: {
      Wood: 'The Balanced Grove',
      Fire: 'The Steady Flame',
      Earth: 'The Stable Ground',
      Metal: 'The Measured Craft',
      Water: 'The Calm Depths'
    },
    transformative: {
      Wood: 'The Evolution Triangle',
      Fire: 'The Phoenix Triad',
      Earth: 'The Shifting Foundation',
      Metal: 'The Alchemy Three',
      Water: 'The Transformation Current'
    }
  };

  return archetypes[type]?.[element] || 'The Family Triangle';
}

/**
 * Get triangle narrative
 */
function getTriangleNarrative(
  nodeA: ConstellationNode,
  nodeB: ConstellationNode,
  nodeC: ConstellationNode,
  type: string
): string {
  const names = `${nodeA.name}, ${nodeB.name}, and ${nodeC.name}`;

  switch (type) {
    case 'supportive':
      return `${names} form a supportive triangle of mutual reinforcement. Their combined energies create a stable foundation for family growth.`;
    case 'tense':
      return `${names} form a tense triangle requiring conscious navigation. This dynamic offers opportunities for growth through challenge.`;
    case 'balanced':
      return `${names} form a balanced triangle with moderate energy flow. This stable configuration supports steady family development.`;
    case 'transformative':
      return `${names} form a transformative triangle with dynamic tension and support. This configuration catalyzes growth and change.`;
    default:
      return `${names} form a significant family triangle.`;
  }
}

// ============================================================================
// MAIN COMPUTATION FUNCTION
// ============================================================================

/**
 * Compute the complete Family Constellation
 */
export function computeFamilyConstellation(
  familyMembers: FamilyMemberInput[],
  familyName: string,
  synastryData?: Map<string, SynastryHeatmap>,
  compositeData?: Map<string, CompositeChart>
): FamilyConstellation {
  // Find root person
  const rootInput = familyMembers.find(m => m.isRoot) || familyMembers[0];

  // Build nodes
  const nodes = familyMembers.map(m => buildConstellationNode(m, rootInput));
  const rootNode = nodes.find(n => n.isRoot) || nodes[0];

  // Build edges
  const edges = buildConstellationEdges(nodes, synastryData, compositeData);

  // Compute generational layers
  const generationalLayers = computeGenerationalLayers(nodes);

  // Compute systemic field
  const systemicField = computeFamilySystemicField(nodes);

  // Compute temporal layer
  const temporalLayer = computeFamilyTemporalLayer(nodes, systemicField);

  // Detect ancestral patterns
  const ancestralPatterns = detectAncestralPatterns(generationalLayers, edges);

  // Build triangles
  const triangles = buildFamilyTriangles(nodes, edges);

  // Generate karmic echoes
  const karmicEchoes = generateKarmicEchoes(ancestralPatterns, systemicField);

  // Generate narratives
  const constellationNarrative = generateConstellationNarrative(
    nodes, generationalLayers, systemicField, ancestralPatterns
  );
  const systemInterpretation = generateSystemInterpretation(systemicField);

  return {
    familyName,
    rootPerson: rootNode,
    nodes,
    edges,
    triangles,
    generationalLayers,
    systemicField,
    temporalLayer,
    ancestralPatterns,
    karmicEchoes,
    constellationNarrative,
    systemInterpretation,
    computedAt: new Date().toISOString(),
    memberCount: nodes.length,
    generationCount: generationalLayers.length
  };
}

/**
 * Generate karmic echoes
 */
function generateKarmicEchoes(
  patterns: AncestralPattern[],
  systemicField: FamilySystemicField
): string[] {
  const echoes: string[] = [];

  // From patterns
  for (const pattern of patterns.slice(0, 3)) {
    echoes.push(`${pattern.patternName}: ${pattern.description.split('.')[0]}.`);
  }

  // From system Shen Sha
  for (const ss of systemicField.systemShenSha.slice(0, 2)) {
    if (ss.frequency >= 2) {
      echoes.push(`${ss.name} echoes across ${ss.frequency} family members — ${ss.significance}.`);
    }
  }

  return echoes;
}

/**
 * Generate constellation narrative
 */
function generateConstellationNarrative(
  nodes: ConstellationNode[],
  layers: GenerationalLayer[],
  systemicField: FamilySystemicField,
  patterns: AncestralPattern[]
): string {
  const parts: string[] = [];

  parts.push(`This family constellation spans ${layers.length} generations with ${nodes.length} members mapped.`);
  parts.push('');

  parts.push(`The family system is dominated by ${systemicField.systemDominantElement} energy (${systemicField.systemElementDistribution[systemicField.systemDominantElement]}%), creating the archetype of "${systemicField.systemArchetype}" (${systemicField.systemArchetypeChinese}).`);
  parts.push('');

  if (patterns.length > 0) {
    parts.push('**Ancestral Patterns Detected:**');
    for (const pattern of patterns.slice(0, 3)) {
      parts.push(`- ${pattern.patternName} (${pattern.patternNameChinese}): ${pattern.description.split('.')[0]}.`);
    }
    parts.push('');
  }

  parts.push(`**Collective Gift:** ${systemicField.collectiveGift}`);
  parts.push(`**Collective Wound:** ${systemicField.collectiveWound}`);
  parts.push('');

  parts.push(`The family's Useful God is ${systemicField.systemUsefulGod} — the family thrives when aligned with ${ELEMENT_CHINESE[systemicField.systemUsefulGod]} energy.`);

  return parts.join('\n');
}

/**
 * Generate system interpretation
 */
function generateSystemInterpretation(systemicField: FamilySystemicField): string {
  return `This is a ${systemicField.systemArchetype} family system, characterized by ${systemicField.systemDominantElement} dominance and ${systemicField.systemDeficientElement} deficiency. The collective destiny is: ${systemicField.collectiveDestiny}`;
}

// ============================================================================
// STORY MODE OUTPUT
// ============================================================================

/**
 * Format constellation for story output
 */
export function formatConstellationStory(constellation: FamilyConstellation): string {
  const parts: string[] = [];

  // Title
  parts.push(`# Family Constellation: ${constellation.familyName} (家族系统排列)`);
  parts.push('');
  parts.push(`*Centered on ${constellation.rootPerson.name}*`);
  parts.push('');

  // System Element Balance
  parts.push('## System Element Balance');
  parts.push('');
  const dist = constellation.systemicField.systemElementDistribution;
  parts.push(`Wood ${dist.Wood}% — Fire ${dist.Fire}% — Earth ${dist.Earth}% — Metal ${dist.Metal}% — Water ${dist.Water}%`);
  parts.push('');
  parts.push(`The family system is defined by ${getElementDescription(constellation.systemicField.systemDominantElement)}.`);
  parts.push('');

  // System Useful God
  parts.push('## System Useful God');
  parts.push('');
  parts.push(`**${constellation.systemicField.systemUsefulGod}** (${ELEMENT_CHINESE[constellation.systemicField.systemUsefulGod]})`);
  parts.push('');
  parts.push(`The family thrives when aligned around ${getUsefulGodDescription(constellation.systemicField.systemUsefulGod)}.`);
  parts.push('');

  // Generational Patterns
  parts.push('## Generational Patterns');
  parts.push('');
  for (const layer of constellation.generationalLayers) {
    const memberList = layer.members.map(m => m.name).join(', ');
    parts.push(`- **${layer.levelChinese}** (${memberList}): ${layer.layerDominantElement} dominant — ${layer.layerTheme}`);
  }
  parts.push('');

  // Karmic Echoes
  if (constellation.karmicEchoes.length > 0) {
    parts.push('## Karmic Echoes');
    parts.push('');
    for (const echo of constellation.karmicEchoes) {
      parts.push(`- ${echo}`);
    }
    parts.push('');
  }

  // System Timing
  if (constellation.temporalLayer.timingWaves.length > 0) {
    parts.push('## System Timing');
    parts.push('');
    const currentWave = constellation.temporalLayer.timingWaves[0];
    parts.push(`**Current Year (${currentWave.year}):** ${currentWave.element} energy, ${currentWave.systemResonance}/100 resonance`);
    parts.push(`*${currentWave.collectiveTheme}*`);
    parts.push('');

    // Upcoming transitions
    const transitions = constellation.temporalLayer.transitionWindows.slice(0, 3);
    if (transitions.length > 0) {
      parts.push('**Upcoming Transition Windows:**');
      for (const t of transitions) {
        parts.push(`- ${t.years}: ${t.description}`);
      }
      parts.push('');
    }
  }

  // Interpretation
  parts.push('## Interpretation');
  parts.push('');
  parts.push(constellation.systemInterpretation);

  return parts.join('\n');
}

/**
 * Get element description
 */
function getElementDescription(element: ElementName): string {
  const descriptions: Record<ElementName, string> = {
    Wood: 'creativity, growth, and emotional resonance',
    Fire: 'passion, visibility, and transformative energy',
    Earth: 'stability, groundedness, and nurturing presence',
    Metal: 'precision, structure, and refined excellence',
    Water: 'wisdom, intuition, and emotional depth'
  };

  return descriptions[element];
}

/**
 * Get Useful God description
 */
function getUsefulGodDescription(element: ElementName): string {
  const descriptions: Record<ElementName, string> = {
    Wood: 'shared growth, healing, and new beginnings',
    Fire: 'shared purpose, warmth, and visibility',
    Earth: 'stability, trust, and grounded presence',
    Metal: 'clear boundaries, structure, and refinement',
    Water: 'wisdom, depth, and emotional flow'
  };

  return descriptions[element];
}

// ============================================================================
// UI-READY OUTPUT
// ============================================================================

/**
 * Format constellation for UI
 */
export function formatConstellationForUI(constellation: FamilyConstellation): {
  summary: {
    familyName: string;
    rootPerson: string;
    memberCount: number;
    generationCount: number;
    systemArchetype: string;
    systemArchetypeChinese: string;
    systemUsefulGod: ElementName;
    systemUsefulGodChinese: string;
  };
  elementChart: {
    labels: string[];
    values: number[];
    colors: string[];
  };
  nodes: Array<{
    id: string;
    name: string;
    generation: string;
    element: ElementName;
    archetype: string;
    size: number;
    color: string;
  }>;
  edges: Array<{
    source: string;
    target: string;
    weight: number;
    color: string;
    nature: string;
  }>;
  timeline: Array<{
    year: number;
    resonance: number;
    theme: string;
    isTransition: boolean;
  }>;
  patterns: Array<{
    name: string;
    nameChinese: string;
    type: string;
    strength: string;
    description: string;
  }>;
} {
  const elementColors: Record<ElementName, string> = {
    Wood: '#4CAF50',
    Fire: '#F44336',
    Earth: '#FF9800',
    Metal: '#9E9E9E',
    Water: '#2196F3'
  };

  return {
    summary: {
      familyName: constellation.familyName,
      rootPerson: constellation.rootPerson.name,
      memberCount: constellation.memberCount,
      generationCount: constellation.generationCount,
      systemArchetype: constellation.systemicField.systemArchetype,
      systemArchetypeChinese: constellation.systemicField.systemArchetypeChinese,
      systemUsefulGod: constellation.systemicField.systemUsefulGod,
      systemUsefulGodChinese: ELEMENT_CHINESE[constellation.systemicField.systemUsefulGod]
    },
    elementChart: {
      labels: ['Wood', 'Fire', 'Earth', 'Metal', 'Water'],
      values: [
        constellation.systemicField.systemElementDistribution.Wood,
        constellation.systemicField.systemElementDistribution.Fire,
        constellation.systemicField.systemElementDistribution.Earth,
        constellation.systemicField.systemElementDistribution.Metal,
        constellation.systemicField.systemElementDistribution.Water
      ],
      colors: ['#4CAF50', '#F44336', '#FF9800', '#9E9E9E', '#2196F3']
    },
    nodes: constellation.nodes.map(n => ({
      id: n.id,
      name: n.name,
      generation: GENERATION_CHINESE[n.generationLevel],
      element: n.dayMaster.element,
      archetype: n.archetype || 'Unknown',
      size: 10 + (n.dayMaster.strength / 10),
      color: elementColors[n.dayMaster.element]
    })),
    edges: constellation.edges.map(e => ({
      source: e.fromId,
      target: e.toId,
      weight: e.weight,
      color: e.color,
      nature: e.synastryNature
    })),
    timeline: constellation.temporalLayer.timingWaves.slice(0, 20).map(w => ({
      year: w.year,
      resonance: w.systemResonance,
      theme: w.collectiveTheme,
      isTransition: w.isTransitionYear
    })),
    patterns: constellation.ancestralPatterns.map(p => ({
      name: p.patternName,
      nameChinese: p.patternNameChinese,
      type: p.type,
      strength: p.strength,
      description: p.description
    }))
  };
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

/**
 * Export constellation as JSON
 */
export function exportConstellationAsJSON(constellation: FamilyConstellation): string {
  return JSON.stringify(constellation, null, 2);
}

/**
 * Export constellation as Markdown
 */
export function exportConstellationAsMarkdown(constellation: FamilyConstellation): string {
  return formatConstellationStory(constellation);
}

// All functions are exported inline with 'export' keyword
