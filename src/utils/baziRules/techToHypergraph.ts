/**
 * ============================================
 * TECHNICAL → HYPERGRAPH MAPPING
 * Maps:
 * - Technical rules
 * - Interactions
 * - Useful God logic
 * - Annual influences
 *
 * into the Mythos Hypergraph.
 *
 * This allows:
 * - Technical → Archetype
 * - Technical → Theme
 * - Technical → Shadow
 * - Technical → Gift
 *
 * connections.
 * ============================================
 */

import { MythosHypergraph, HypergraphNode, HypergraphEdge } from './mythosHypergraph';

// ==================== DATA MODEL ====================

export interface TechnicalHypergraphMapping {
  id: string;
  rule: string;
  ruleZh?: string;
  mappedNodes: MappedNode[];
  mappedEdges: MappedEdge[];
  confidence: number; // 0-100
  narrative: string;
  narrativeZh: string;
}

export interface MappedNode {
  nodeId: string;
  nodeType: 'archetype' | 'theme' | 'shadow' | 'gift' | 'thread' | 'generation';
  relevance: number; // 0-100
  reason: string;
  reasonZh?: string;
}

export interface MappedEdge {
  edgeId: string;
  from: string;
  to: string;
  relation: string;
  strength: number; // 0-100
}

export interface InteractionInput {
  type: string;
  pillarA: string;
  pillarB: string;
  description: string;
  descriptionZh?: string;
}

export interface UsefulGodInput {
  element: string;
  elementZh?: string;
  strength: 'strong' | 'moderate' | 'weak';
  explanation: string;
  explanationZh?: string;
}

export interface TechHypergraphBridge {
  mappings: TechnicalHypergraphMapping[];
  hypergraphEnrichment: HypergraphEnrichment;
  summary: BridgeSummary;
}

export interface HypergraphEnrichment {
  newNodes: HypergraphNode[];
  newEdges: HypergraphEdge[];
  updatedNodes: { nodeId: string; updates: Partial<HypergraphNode> }[];
}

export interface BridgeSummary {
  totalMappings: number;
  avgConfidence: number;
  dominantArchetype?: string;
  dominantTheme?: string;
  technicalToMythosRatio: number;
  insight: string;
  insightZh: string;
}

// ==================== MAPPING RULES ====================

/**
 * Rule to archetype mappings
 */
const RULE_TO_ARCHETYPE: Record<string, string[]> = {
  'clash': ['warrior', 'transformer', 'rebel'],
  'harm': ['wounded_healer', 'shadow_dancer', 'alchemist'],
  'punishment': ['judge', 'shadow_dancer', 'transformer'],
  'combination': ['weaver', 'bridge_builder', 'harmonizer'],
  'destruction': ['transformer', 'warrior', 'rebel'],
  'useful_god': ['sage', 'guide', 'catalyst'],
  'luck_transition': ['traveler', 'transformer', 'pioneer'],
  'annual': ['cycler', 'season_keeper', 'time_walker'],
  'seasonal': ['season_keeper', 'nature_child', 'cycler'],
  'nobleman': ['benefactor', 'guide', 'guardian'],
  'peach_blossom': ['lover', 'artist', 'muse'],
  'traveling_horse': ['traveler', 'pioneer', 'messenger']
};

/**
 * Rule to theme mappings
 */
const RULE_TO_THEME: Record<string, string[]> = {
  'clash': ['conflict', 'change', 'decision', 'breakthrough'],
  'harm': ['vulnerability', 'healing', 'relationship_wound'],
  'punishment': ['consequence', 'lesson', 'karma', 'reckoning'],
  'combination': ['union', 'support', 'collaboration', 'harmony'],
  'destruction': ['ending', 'transformation', 'release'],
  'useful_god': ['resource', 'strength', 'direction', 'guidance'],
  'luck_transition': ['transition', 'new_chapter', 'evolution'],
  'annual': ['timing', 'opportunity', 'season'],
  'seasonal': ['cycle', 'nature', 'flow'],
  'nobleman': ['help', 'mentor', 'blessing'],
  'peach_blossom': ['romance', 'attraction', 'beauty', 'creativity'],
  'traveling_horse': ['movement', 'travel', 'change', 'adventure']
};

/**
 * Rule to shadow mappings
 */
const RULE_TO_SHADOW: Record<string, string[]> = {
  'clash': ['avoidance', 'aggression', 'rigidity'],
  'harm': ['betrayal_wound', 'trust_issues', 'isolation'],
  'punishment': ['self_punishment', 'guilt', 'shame'],
  'destruction': ['loss_fear', 'attachment', 'resistance'],
  'useful_god_weak': ['depletion', 'scarcity_mindset', 'self_doubt']
};

/**
 * Rule to gift mappings
 */
const RULE_TO_GIFT: Record<string, string[]> = {
  'clash': ['courage', 'decisiveness', 'catalyst_energy'],
  'combination': ['diplomacy', 'connection', 'harmony_creation'],
  'useful_god_strong': ['natural_talent', 'abundance', 'magnetism'],
  'nobleman': ['blessing_attraction', 'guidance_reception'],
  'peach_blossom': ['charm', 'creativity', 'beauty']
};

// ==================== MAPPING ENGINE ====================

/**
 * Map technical data to hypergraph
 */
export function mapTechnicalToHypergraph(
  interactions: InteractionInput[],
  usefulGods: UsefulGodInput[],
  hypergraph: MythosHypergraph
): TechHypergraphBridge {
  const mappings: TechnicalHypergraphMapping[] = [];

  // Map interactions
  interactions.forEach((i, idx) => {
    const mapping = mapInteractionToHypergraph(i, hypergraph, idx);
    mappings.push(mapping);
  });

  // Map useful gods
  usefulGods.forEach((u, idx) => {
    const mapping = mapUsefulGodToHypergraph(u, hypergraph, idx);
    mappings.push(mapping);
  });

  // Build hypergraph enrichment
  const hypergraphEnrichment = buildHypergraphEnrichment(mappings, hypergraph);

  // Generate summary
  const summary = generateBridgeSummary(mappings, hypergraph);

  return {
    mappings,
    hypergraphEnrichment,
    summary
  };
}

/**
 * Map single interaction to hypergraph
 */
function mapInteractionToHypergraph(
  interaction: InteractionInput,
  hypergraph: MythosHypergraph,
  index: number
): TechnicalHypergraphMapping {
  const ruleLower = interaction.type.toLowerCase();
  const mappedNodes: MappedNode[] = [];
  const mappedEdges: MappedEdge[] = [];

  // Find archetype matches
  const archetypeKeys = Object.keys(RULE_TO_ARCHETYPE).filter(k => ruleLower.includes(k));
  archetypeKeys.forEach(key => {
    const archetypes = RULE_TO_ARCHETYPE[key];
    archetypes.forEach(archetype => {
      const node = hypergraph.nodes.find(n =>
        n.type === 'archetype' &&
        (n.id.includes(archetype) || n.label.toLowerCase().includes(archetype))
      );
      if (node) {
        mappedNodes.push({
          nodeId: node.id,
          nodeType: 'archetype',
          relevance: 80,
          reason: `${interaction.type} activates the ${archetype} archetype.`,
          reasonZh: `「${interaction.type}」激活「${archetype}」原型。`
        });
      }
    });
  });

  // Find theme matches
  const themeKeys = Object.keys(RULE_TO_THEME).filter(k => ruleLower.includes(k));
  themeKeys.forEach(key => {
    const themes = RULE_TO_THEME[key];
    themes.forEach(theme => {
      const node = hypergraph.nodes.find(n =>
        n.type === 'theme' &&
        (n.id.includes(theme) || n.label.toLowerCase().includes(theme))
      );
      if (node) {
        mappedNodes.push({
          nodeId: node.id,
          nodeType: 'theme',
          relevance: 75,
          reason: `${interaction.type} connects to the theme of ${theme}.`,
          reasonZh: `「${interaction.type}」连接到「${theme}」主题。`
        });
      }
    });
  });

  // Find shadow matches
  const shadowKeys = Object.keys(RULE_TO_SHADOW).filter(k => ruleLower.includes(k));
  shadowKeys.forEach(key => {
    const shadows = RULE_TO_SHADOW[key];
    shadows.forEach(shadow => {
      const node = hypergraph.nodes.find(n =>
        n.type === 'shadow' &&
        (n.id.includes(shadow) || n.label.toLowerCase().includes(shadow))
      );
      if (node) {
        mappedNodes.push({
          nodeId: node.id,
          nodeType: 'shadow',
          relevance: 70,
          reason: `${interaction.type} may activate the shadow of ${shadow}.`,
          reasonZh: `「${interaction.type}」可能激活「${shadow}」阴影。`
        });
      }
    });
  });

  // Find gift matches
  const giftKeys = Object.keys(RULE_TO_GIFT).filter(k => ruleLower.includes(k));
  giftKeys.forEach(key => {
    const gifts = RULE_TO_GIFT[key];
    gifts.forEach(gift => {
      const node = hypergraph.nodes.find(n =>
        n.type === 'gift' &&
        (n.id.includes(gift) || n.label.toLowerCase().includes(gift))
      );
      if (node) {
        mappedNodes.push({
          nodeId: node.id,
          nodeType: 'gift',
          relevance: 75,
          reason: `${interaction.type} can manifest as the gift of ${gift}.`,
          reasonZh: `「${interaction.type}」可以表现为「${gift}」天赋。`
        });
      }
    });
  });

  // Build edges between mapped nodes
  for (let i = 0; i < mappedNodes.length; i++) {
    for (let j = i + 1; j < mappedNodes.length; j++) {
      mappedEdges.push({
        edgeId: `tech-edge-${index}-${i}-${j}`,
        from: mappedNodes[i].nodeId,
        to: mappedNodes[j].nodeId,
        relation: 'technical_link',
        strength: Math.round((mappedNodes[i].relevance + mappedNodes[j].relevance) / 2)
      });
    }
  }

  // Calculate confidence
  const confidence = mappedNodes.length > 0
    ? Math.round(mappedNodes.reduce((sum, n) => sum + n.relevance, 0) / mappedNodes.length)
    : 30;

  // Generate narrative
  const narrative = generateMappingNarrative(interaction.type, mappedNodes);

  return {
    id: `interaction-mapping-${index}`,
    rule: interaction.type,
    mappedNodes,
    mappedEdges,
    confidence,
    narrative: narrative.en,
    narrativeZh: narrative.zh
  };
}

/**
 * Map useful god to hypergraph
 */
function mapUsefulGodToHypergraph(
  usefulGod: UsefulGodInput,
  hypergraph: MythosHypergraph,
  index: number
): TechnicalHypergraphMapping {
  const mappedNodes: MappedNode[] = [];
  const mappedEdges: MappedEdge[] = [];
  const strengthKey = `useful_god_${usefulGod.strength}`;

  // Find archetype matches
  const archetypes = RULE_TO_ARCHETYPE['useful_god'] || [];
  archetypes.forEach(archetype => {
    const node = hypergraph.nodes.find(n =>
      n.type === 'archetype' &&
      (n.id.includes(archetype) || n.label.toLowerCase().includes(archetype))
    );
    if (node) {
      mappedNodes.push({
        nodeId: node.id,
        nodeType: 'archetype',
        relevance: usefulGod.strength === 'strong' ? 90 : usefulGod.strength === 'moderate' ? 70 : 50,
        reason: `Useful God ${usefulGod.element} (${usefulGod.strength}) activates the ${archetype} archetype.`,
        reasonZh: `用神${usefulGod.elementZh || usefulGod.element}（${usefulGod.strength}）激活「${archetype}」原型。`
      });
    }
  });

  // Find theme matches
  const themes = RULE_TO_THEME['useful_god'] || [];
  themes.forEach(theme => {
    const node = hypergraph.nodes.find(n =>
      n.type === 'theme' &&
      (n.id.includes(theme) || n.label.toLowerCase().includes(theme))
    );
    if (node) {
      mappedNodes.push({
        nodeId: node.id,
        nodeType: 'theme',
        relevance: 80,
        reason: `Useful God connects to the theme of ${theme}.`,
        reasonZh: `用神连接到「${theme}」主题。`
      });
    }
  });

  // Check for shadow (weak useful god)
  if (usefulGod.strength === 'weak') {
    const shadows = RULE_TO_SHADOW['useful_god_weak'] || [];
    shadows.forEach(shadow => {
      const node = hypergraph.nodes.find(n =>
        n.type === 'shadow' &&
        (n.id.includes(shadow) || n.label.toLowerCase().includes(shadow))
      );
      if (node) {
        mappedNodes.push({
          nodeId: node.id,
          nodeType: 'shadow',
          relevance: 70,
          reason: `Weak Useful God may activate the shadow of ${shadow}.`,
          reasonZh: `弱用神可能激活「${shadow}」阴影。`
        });
      }
    });
  }

  // Check for gift (strong useful god)
  if (usefulGod.strength === 'strong') {
    const gifts = RULE_TO_GIFT['useful_god_strong'] || [];
    gifts.forEach(gift => {
      const node = hypergraph.nodes.find(n =>
        n.type === 'gift' &&
        (n.id.includes(gift) || n.label.toLowerCase().includes(gift))
      );
      if (node) {
        mappedNodes.push({
          nodeId: node.id,
          nodeType: 'gift',
          relevance: 85,
          reason: `Strong Useful God manifests as the gift of ${gift}.`,
          reasonZh: `强用神表现为「${gift}」天赋。`
        });
      }
    });
  }

  // Build edges
  for (let i = 0; i < mappedNodes.length; i++) {
    for (let j = i + 1; j < mappedNodes.length; j++) {
      mappedEdges.push({
        edgeId: `useful-god-edge-${index}-${i}-${j}`,
        from: mappedNodes[i].nodeId,
        to: mappedNodes[j].nodeId,
        relation: 'useful_god_link',
        strength: Math.round((mappedNodes[i].relevance + mappedNodes[j].relevance) / 2)
      });
    }
  }

  const confidence = mappedNodes.length > 0
    ? Math.round(mappedNodes.reduce((sum, n) => sum + n.relevance, 0) / mappedNodes.length)
    : 30;

  const narrative = generateUsefulGodNarrative(usefulGod, mappedNodes);

  return {
    id: `useful-god-mapping-${index}`,
    rule: `useful_god_${usefulGod.element}`,
    ruleZh: `用神_${usefulGod.elementZh || usefulGod.element}`,
    mappedNodes,
    mappedEdges,
    confidence,
    narrative: narrative.en,
    narrativeZh: narrative.zh
  };
}

/**
 * Generate mapping narrative
 */
function generateMappingNarrative(
  rule: string,
  mappedNodes: MappedNode[]
): { en: string; zh: string } {
  if (mappedNodes.length === 0) {
    return {
      en: `The ${rule} interaction does not strongly map to the current hypergraph structure.`,
      zh: `「${rule}」互动没有强烈映射到当前超图结构。`
    };
  }

  const archetypes = mappedNodes.filter(n => n.nodeType === 'archetype').map(n => n.nodeId);
  const themes = mappedNodes.filter(n => n.nodeType === 'theme').map(n => n.nodeId);

  let en = `The ${rule} interaction activates`;
  let zh = `「${rule}」互动激活`;

  if (archetypes.length > 0) {
    en += ` the ${archetypes.join(', ')} archetype(s)`;
    zh += `「${archetypes.join('、')}」原型`;
  }
  if (themes.length > 0) {
    en += `${archetypes.length > 0 ? ' and' : ''} resonates with the theme(s) of ${themes.join(', ')}`;
    zh += `${archetypes.length > 0 ? '，并' : ''}与「${themes.join('、')}」主题共振`;
  }

  en += '.';
  zh += '。';

  return { en, zh };
}

/**
 * Generate useful god narrative
 */
function generateUsefulGodNarrative(
  usefulGod: UsefulGodInput,
  mappedNodes: MappedNode[]
): { en: string; zh: string } {
  const strengthText = {
    'strong': { en: 'strongly supports', zh: '强力支持' },
    'moderate': { en: 'moderately influences', zh: '适度影响' },
    'weak': { en: 'weakly manifests, revealing shadows in', zh: '微弱显现，揭示阴影于' }
  };

  const text = strengthText[usefulGod.strength];

  if (mappedNodes.length === 0) {
    return {
      en: `Your ${usefulGod.element} Useful God ${text.en} your journey, though specific hypergraph connections are subtle.`,
      zh: `你的${usefulGod.elementZh || usefulGod.element}用神${text.zh}你的旅程，尽管具体超图连接较微妙。`
    };
  }

  const nodeTypes = mappedNodes.map(n => n.nodeType);
  const uniqueTypes = [...new Set(nodeTypes)];

  return {
    en: `Your ${usefulGod.element} Useful God ${text.en} your ${uniqueTypes.join(' and ')} dimensions.`,
    zh: `你的${usefulGod.elementZh || usefulGod.element}用神${text.zh}你的「${uniqueTypes.join('、')}」维度。`
  };
}

// ==================== ENRICHMENT ====================

/**
 * Build hypergraph enrichment from mappings
 */
function buildHypergraphEnrichment(
  mappings: TechnicalHypergraphMapping[],
  hypergraph: MythosHypergraph
): HypergraphEnrichment {
  const newNodes: HypergraphNode[] = [];
  const newEdges: HypergraphEdge[] = [];
  const updatedNodes: { nodeId: string; updates: Partial<HypergraphNode> }[] = [];

  // Collect all mapped edges that don't exist
  mappings.forEach(mapping => {
    mapping.mappedEdges.forEach(edge => {
      const exists = hypergraph.edges.some(e =>
        (e.from === edge.from && e.to === edge.to) ||
        (e.from === edge.to && e.to === edge.from)
      );

      if (!exists) {
        newEdges.push({
          id: edge.edgeId,
          from: edge.from,
          to: edge.to,
          relation: edge.relation as any,
          weight: edge.strength / 100
        });
      }
    });
  });

  // Update node weights based on mapping relevance
  const nodeRelevanceMap = new Map<string, number[]>();
  mappings.forEach(mapping => {
    mapping.mappedNodes.forEach(node => {
      const existing = nodeRelevanceMap.get(node.nodeId) || [];
      existing.push(node.relevance);
      nodeRelevanceMap.set(node.nodeId, existing);
    });
  });

  nodeRelevanceMap.forEach((relevances, nodeId) => {
    const avgRelevance = relevances.reduce((a, b) => a + b, 0) / relevances.length;
    updatedNodes.push({
      nodeId,
      updates: {
        weight: avgRelevance / 100
      }
    });
  });

  return { newNodes, newEdges, updatedNodes };
}

/**
 * Generate bridge summary
 */
function generateBridgeSummary(
  mappings: TechnicalHypergraphMapping[],
  hypergraph: MythosHypergraph
): BridgeSummary {
  const totalMappings = mappings.length;
  const avgConfidence = totalMappings > 0
    ? Math.round(mappings.reduce((sum, m) => sum + m.confidence, 0) / totalMappings)
    : 0;

  // Find dominant archetype
  const archetypeCounts = new Map<string, number>();
  mappings.forEach(m => {
    m.mappedNodes
      .filter(n => n.nodeType === 'archetype')
      .forEach(n => {
        archetypeCounts.set(n.nodeId, (archetypeCounts.get(n.nodeId) || 0) + 1);
      });
  });

  let dominantArchetype: string | undefined;
  let maxArchetypeCount = 0;
  archetypeCounts.forEach((count, id) => {
    if (count > maxArchetypeCount) {
      maxArchetypeCount = count;
      dominantArchetype = id;
    }
  });

  // Find dominant theme
  const themeCounts = new Map<string, number>();
  mappings.forEach(m => {
    m.mappedNodes
      .filter(n => n.nodeType === 'theme')
      .forEach(n => {
        themeCounts.set(n.nodeId, (themeCounts.get(n.nodeId) || 0) + 1);
      });
  });

  let dominantTheme: string | undefined;
  let maxThemeCount = 0;
  themeCounts.forEach((count, id) => {
    if (count > maxThemeCount) {
      maxThemeCount = count;
      dominantTheme = id;
    }
  });

  // Calculate ratio
  const technicalToMythosRatio = hypergraph.nodes.length > 0
    ? totalMappings / hypergraph.nodes.length
    : 0;

  // Generate insight
  const { insight, insightZh } = generateBridgeInsight(
    avgConfidence,
    dominantArchetype,
    dominantTheme
  );

  return {
    totalMappings,
    avgConfidence,
    dominantArchetype,
    dominantTheme,
    technicalToMythosRatio,
    insight,
    insightZh
  };
}

/**
 * Generate bridge insight
 */
function generateBridgeInsight(
  confidence: number,
  archetype?: string,
  theme?: string
): { insight: string; insightZh: string } {
  if (confidence > 70) {
    return {
      insight: `Your technical chart strongly resonates with the ${archetype || 'mythic'} archetype and ${theme || 'transformative'} themes. The math and the meaning align.`,
      insightZh: `你的技术命盘与「${archetype || '神话'}」原型和「${theme || '转化'}」主题强烈共振。数学与意义对齐。`
    };
  } else if (confidence > 40) {
    return {
      insight: `There are meaningful connections between your technical indicators and the hypergraph, centered on ${theme || 'growth'} themes.`,
      insightZh: `你的技术指标与超图之间存在有意义的连接，以「${theme || '成长'}」主题为中心。`
    };
  } else {
    return {
      insight: `The technical-to-mythic mapping is subtle, suggesting a unique path not fully captured by common patterns.`,
      insightZh: `技术到神话的映射是微妙的，暗示一条不完全被常见模式捕捉的独特路径。`
    };
  }
}

// ==================== RENDERING ====================

/**
 * Render bridge as markdown
 */
export function renderTechHypergraphBridgeMarkdown(
  bridge: TechHypergraphBridge,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];

  lines.push(`# ${lang === 'zh' ? '技术→超图桥梁' : 'Technical → Hypergraph Bridge'}`);
  lines.push('');

  // Summary
  lines.push(`## ${lang === 'zh' ? '摘要' : 'Summary'}`);
  lines.push(`- ${lang === 'zh' ? '总映射数' : 'Total Mappings'}: ${bridge.summary.totalMappings}`);
  lines.push(`- ${lang === 'zh' ? '平均置信度' : 'Average Confidence'}: ${bridge.summary.avgConfidence}%`);
  if (bridge.summary.dominantArchetype) {
    lines.push(`- ${lang === 'zh' ? '主导原型' : 'Dominant Archetype'}: ${bridge.summary.dominantArchetype}`);
  }
  if (bridge.summary.dominantTheme) {
    lines.push(`- ${lang === 'zh' ? '主导主题' : 'Dominant Theme'}: ${bridge.summary.dominantTheme}`);
  }
  lines.push('');
  lines.push(`> ${lang === 'zh' ? bridge.summary.insightZh : bridge.summary.insight}`);
  lines.push('');

  // Mappings
  lines.push(`## ${lang === 'zh' ? '映射详情' : 'Mapping Details'}`);
  bridge.mappings.forEach(m => {
    const rule = lang === 'zh' && m.ruleZh ? m.ruleZh : m.rule;
    lines.push(`### ${rule} (${m.confidence}% ${lang === 'zh' ? '置信度' : 'confidence'})`);
    lines.push(lang === 'zh' ? m.narrativeZh : m.narrative);
    lines.push('');
    lines.push(`**${lang === 'zh' ? '映射节点' : 'Mapped Nodes'}:**`);
    m.mappedNodes.forEach(n => {
      const reason = lang === 'zh' && n.reasonZh ? n.reasonZh : n.reason;
      lines.push(`- ${n.nodeId} (${n.nodeType}): ${reason}`);
    });
    lines.push('');
  });

  return lines.join('\n');
}

// ==================== EXPORTS ====================

export {
  mapTechnicalToHypergraph,
  renderTechHypergraphBridgeMarkdown
};
