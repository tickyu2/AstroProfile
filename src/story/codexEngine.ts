/**
 * Cathedral Knowledge Codex Engine (大教堂法典引擎)
 *
 * The engine that generates, maintains, and navigates the sacred text
 * of the cathedral — the canonical, human-readable book of the entire
 * metaphysics OS.
 *
 * This engine produces literature, not documentation.
 */

import type {
  CodexBook,
  CodexContentType,
  CodexTone,
  CodexGlyph,
  CodexBookEntry,
  CodexChapter,
  CodexSection,
  CodexAnnotation,
  CodexDiagram,
  CodexExample,
  CodexReference,
  EngineDocumentation,
  FlowDocumentation,
  RitualArchetypeDoc,
  CeremonyStructureDoc,
  MemoryTypeDoc,
  PipelineDoc,
  SystemComponentDoc,
  ScriptoriumNavigation,
  Breadcrumb,
  Bookmark,
  ViewedItem,
  CodexSearchResult,
  GlyphIndexEntry,
  ScriptoriumSettings,
  ScriptoriumState,
  CodexConfig,
  CodexState,
} from './codexTypes';

import {
  BOOK_CHINESE,
  BOOK_TITLES,
  BOOK_NUMBERS,
  BOOK_TONES,
  BOOK_GLYPHS,
  BOOK_SUBTITLES,
  BOOK_INVOCATIONS,
  FOUNDATION_LAYERS,
  DEFAULT_CODEX_CONFIG,
  DEFAULT_SCRIPTORIUM_SETTINGS,
} from './codexTypes';

// ============================================================================
// INTERNAL STATE
// ============================================================================

let codexState: CodexState | null = null;

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `codex_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ============================================================================
// BOOK GENERATION
// ============================================================================

/**
 * Generate Book I: The Foundation
 */
function generateFoundationBook(): CodexBookEntry {
  return {
    id: 'foundation',
    number: 1,
    title: BOOK_TITLES.foundation,
    titleChinese: BOOK_CHINESE.foundation,
    subtitle: BOOK_SUBTITLES.foundation,
    glyph: BOOK_GLYPHS.foundation,
    tone: BOOK_TONES.foundation,
    invocation: BOOK_INVOCATIONS.foundation,
    summary: 'This book establishes the metaphysical philosophy of the cathedral — the five layers, the living architecture, and the purpose of the entire system.',
    chapters: [
      generateChapter('foundation', 1, 'The Five Layers', '五层之道', {
        invocation: 'Chart, Timing, Story, Ritual, Action — these are the five sacred layers.',
        summary: 'Understanding the foundational architecture of the cathedral.',
        sections: FOUNDATION_LAYERS.map(layer => ({
          id: generateId(),
          title: `${layer.name} (${layer.nameChinese})`,
          contentType: 'prose' as CodexContentType,
          tone: 'mythic' as CodexTone,
          content: `**${layer.name}** — *${layer.metaphor}*\n\n${layer.description}\n\nComponents: ${layer.components.join(', ')}`,
          annotations: [{
            id: generateId(),
            type: 'metaphor' as const,
            content: layer.metaphor,
            position: 'margin' as const,
          }],
        })),
      }),
      generateChapter('foundation', 2, 'The Cathedral as Organism', '大教堂生命体', {
        invocation: 'The cathedral breathes. It remembers. It grows.',
        summary: 'Understanding the cathedral as a living, evolving system.',
        sections: [
          createSection('The Living Architecture', 'prose', 'mythic',
            'The cathedral is not a static structure. It is a living organism — breathing with timing, remembering through memory, growing through story, expressing through ritual.'),
          createSection('The Breath of Timing', 'metaphor', 'poetic',
            'Like the breath that sustains life, timing flows through every aspect of the cathedral. Annual luck, monthly luck, daily luck, hourly luck — each a rhythm in the greater symphony.'),
          createSection('The Memory of Pattern', 'prose', 'narrative',
            'The cathedral remembers. Not just data, but patterns. Not just facts, but wisdom. This memory evolves, consolidates, and informs every reading.'),
        ],
      }),
      generateChapter('foundation', 3, 'The Purpose of the System', '系统之目的', {
        invocation: 'We build not to calculate, but to illuminate.',
        summary: 'Understanding why the cathedral exists.',
        sections: [
          createSection('Beyond Calculation', 'prose', 'visionary',
            'The purpose of this system is not prediction. It is understanding. It is not fortune-telling. It is self-knowledge. It is not fate. It is navigation.'),
          createSection('The Pilgrim\'s Journey', 'metaphor', 'poetic',
            'Every user is a pilgrim standing before the altar. The cathedral does not tell them what will happen. It shows them where they are, what currents are moving, and how to align.'),
        ],
      }),
    ],
    crossReferences: [
      {
        id: generateId(),
        sourceBook: 'foundation',
        sourceChapter: 'chapter_1',
        targetBook: 'engines',
        targetChapter: 'chapter_1',
        description: 'The five layers are implemented by specific engines',
        relationship: 'implements',
      },
    ],
  };
}

/**
 * Generate Book II: The Engines
 */
function generateEnginesBook(): CodexBookEntry {
  const engines: EngineDocumentation[] = [
    {
      id: 'natal_chart',
      name: 'Natal Chart Engine',
      nameChinese: '命盘引擎',
      purpose: 'Calculate the natal BaZi chart from birth data',
      inputs: [
        { name: 'birthDate', type: 'Date', description: 'Date of birth', required: true, source: 'User input' },
        { name: 'birthTime', type: 'Time', description: 'Time of birth', required: true, source: 'User input' },
        { name: 'birthPlace', type: 'Location', description: 'Place of birth', required: false, source: 'User input' },
      ],
      outputs: [
        { name: 'fourPillars', type: 'FourPillars', description: 'Year, Month, Day, Hour pillars', consumers: ['Timing Engine', 'Story Engine'] },
        { name: 'dayMaster', type: 'Element', description: 'The central identity element', consumers: ['All engines'] },
      ],
      logic: 'Converts solar calendar to lunar calendar, calculates Heavenly Stems and Earthly Branches for each pillar using traditional algorithms.',
      metaphor: 'The seed from which the entire tree grows — everything in the cathedral traces back to this natal moment.',
      example: createExample('Natal Calculation', 'A person born January 15, 1990 at 14:30', 'The engine calculates: Year: 己巳 (Earth Snake), Month: 丁丑 (Fire Ox), Day: 壬午 (Water Horse), Hour: 丁未 (Fire Goat).'),
      dependencies: ['Lunar Calendar Service'],
      dependents: ['Synastry Engine', 'Timing Engine', 'Story Engine'],
    },
    {
      id: 'timing',
      name: 'Timing Engine',
      nameChinese: '时机引擎',
      purpose: 'Calculate luck pillars and current timing influences',
      inputs: [
        { name: 'natalChart', type: 'FourPillars', description: 'The natal chart', required: true, source: 'Natal Chart Engine' },
        { name: 'currentDate', type: 'Date', description: 'Date to analyze', required: true, source: 'System' },
      ],
      outputs: [
        { name: 'luckPillars', type: 'LuckPillar[]', description: '10-year luck periods', consumers: ['Story Engine'] },
        { name: 'annualLuck', type: 'AnnualLuck', description: 'Current year influences', consumers: ['Ritual Engine'] },
      ],
      logic: 'Calculates 大运 (luck pillars) based on gender and year stem, then overlays annual, monthly, daily influences.',
      metaphor: 'The river that carries the vessel — timing determines which currents are available.',
      example: createExample('Timing Analysis', 'Analyzing timing for a Wood Day Master in 2024 (Wood Dragon year)', 'The engine detects strong Wood support, indicating a favorable period for growth and new initiatives.'),
      dependencies: ['Natal Chart Engine'],
      dependents: ['Story Engine', 'Ritual Engine', 'Fate-to-Action Engine'],
    },
    {
      id: 'story',
      name: 'Story Engine',
      nameChinese: '故事引擎',
      purpose: 'Generate narrative arcs from chart and timing data',
      inputs: [
        { name: 'natalChart', type: 'FourPillars', description: 'The natal chart', required: true, source: 'Natal Chart Engine' },
        { name: 'timing', type: 'TimingData', description: 'Current timing context', required: true, source: 'Timing Engine' },
      ],
      outputs: [
        { name: 'storyArc', type: 'StoryArc', description: 'Current narrative arc', consumers: ['Ritual Layer'] },
        { name: 'chapters', type: 'Chapter[]', description: 'Story chapters', consumers: ['UI'] },
      ],
      logic: 'Weaves timing transitions into narrative beats, identifies turning points, generates coherent story arcs.',
      metaphor: 'The author that writes the living book of experience.',
      example: createExample('Story Generation', 'A person entering a new luck pillar', 'The engine generates a "Threshold Crossing" chapter, with beats for preparation, transition, and emergence.'),
      dependencies: ['Timing Engine', 'Archetype Templates'],
      dependents: ['Ritual Layer', 'Memory Engine'],
    },
  ];

  return {
    id: 'engines',
    number: 2,
    title: BOOK_TITLES.engines,
    titleChinese: BOOK_CHINESE.engines,
    subtitle: BOOK_SUBTITLES.engines,
    glyph: BOOK_GLYPHS.engines,
    tone: BOOK_TONES.engines,
    invocation: BOOK_INVOCATIONS.engines,
    summary: 'This book documents every engine in the cathedral — their purpose, inputs, outputs, logic, and mythic meaning.',
    chapters: engines.map((engine, index) =>
      generateEngineChapter(engine, index + 1)
    ),
    crossReferences: [],
  };
}

/**
 * Generate Book III: The Flows
 */
function generateFlowsBook(): CodexBookEntry {
  const flows: FlowDocumentation[] = [
    {
      id: 'data_flow',
      name: 'Data Flow',
      nameChinese: '数据流',
      type: 'data',
      description: 'How data moves from input to insight',
      stages: [
        { order: 1, name: 'Input', description: 'User provides birth data', inputs: ['birthDate', 'birthTime', 'birthPlace'], outputs: ['rawInput'], transformations: ['validation'] },
        { order: 2, name: 'Calculation', description: 'Engines process data', inputs: ['rawInput'], outputs: ['charts', 'timing'], transformations: ['calendar conversion', 'pillar calculation'] },
        { order: 3, name: 'Analysis', description: 'Patterns are extracted', inputs: ['charts', 'timing'], outputs: ['insights', 'patterns'], transformations: ['pattern detection', 'significance scoring'] },
        { order: 4, name: 'Narrative', description: 'Stories are generated', inputs: ['insights', 'patterns'], outputs: ['story', 'guidance'], transformations: ['story weaving', 'action mapping'] },
      ],
      triggers: ['User input', 'Date change', 'Manual refresh'],
      diagram: createFlowDiagram('data_flow', 'Data Flow', ['Input', 'Calculation', 'Analysis', 'Narrative']),
      metaphor: 'Water flowing from mountain spring to ocean — transformed at each stage but always moving toward depth.',
    },
    {
      id: 'timing_flow',
      name: 'Timing Flow',
      nameChinese: '时机流',
      type: 'timing',
      description: 'How timing cascades through the system',
      stages: [
        { order: 1, name: 'Cosmic', description: 'Annual energies set the stage', inputs: ['year'], outputs: ['annualEnergy'], transformations: ['stem-branch calculation'] },
        { order: 2, name: 'Seasonal', description: 'Monthly rhythms emerge', inputs: ['annualEnergy', 'month'], outputs: ['monthlyEnergy'], transformations: ['seasonal adjustment'] },
        { order: 3, name: 'Daily', description: 'Daily pulses manifest', inputs: ['monthlyEnergy', 'day'], outputs: ['dailyEnergy'], transformations: ['day officer calculation'] },
        { order: 4, name: 'Moment', description: 'Hourly windows open', inputs: ['dailyEnergy', 'hour'], outputs: ['momentEnergy'], transformations: ['micro-timing'] },
      ],
      triggers: ['Time passage', 'Date change', 'Hour change'],
      diagram: createFlowDiagram('timing_flow', 'Timing Cascade', ['Cosmic', 'Seasonal', 'Daily', 'Moment']),
      metaphor: 'Breath within breath — the year breathes months, months breathe days, days breathe hours.',
    },
  ];

  return {
    id: 'flows',
    number: 3,
    title: BOOK_TITLES.flows,
    titleChinese: BOOK_CHINESE.flows,
    subtitle: BOOK_SUBTITLES.flows,
    glyph: BOOK_GLYPHS.flows,
    tone: BOOK_TONES.flows,
    invocation: BOOK_INVOCATIONS.flows,
    summary: 'This book traces the currents that move through the cathedral — data, timing, story, ritual, and orchestration.',
    chapters: flows.map((flow, index) =>
      generateFlowChapter(flow, index + 1)
    ),
    crossReferences: [],
  };
}

/**
 * Generate Book IV: The Knowledge Graph
 */
function generateKnowledgeGraphBook(): CodexBookEntry {
  return {
    id: 'knowledge_graph',
    number: 4,
    title: BOOK_TITLES.knowledge_graph,
    titleChinese: BOOK_CHINESE.knowledge_graph,
    subtitle: BOOK_SUBTITLES.knowledge_graph,
    glyph: BOOK_GLYPHS.knowledge_graph,
    tone: BOOK_TONES.knowledge_graph,
    invocation: BOOK_INVOCATIONS.knowledge_graph,
    summary: 'This book maps the constellation of knowledge — nodes, edges, and the web of relationships that binds the cathedral.',
    chapters: [
      generateChapter('knowledge_graph', 1, 'Node Categories', '节点类别', {
        invocation: 'Every concept is a star. This chapter names them.',
        summary: 'The categories of nodes in the cathedral knowledge graph.',
        sections: [
          createSection('Profile Nodes', 'technical', 'architectural',
            '**Profile nodes** represent people — natal charts, personality data, biographical information. They are the subjects of all readings.'),
          createSection('Timing Nodes', 'technical', 'architectural',
            '**Timing nodes** represent temporal structures — years, months, days, hours, luck pillars, event triggers.'),
          createSection('Story Nodes', 'technical', 'architectural',
            '**Story nodes** represent narrative elements — beats, chapters, arcs, archetypes, themes.'),
          createSection('Ritual Nodes', 'technical', 'architectural',
            '**Ritual nodes** represent ceremonial elements — ceremonies, steps, windows, directions.'),
        ],
      }),
      generateChapter('knowledge_graph', 2, 'Edge Types', '边类型', {
        invocation: 'Every connection has meaning. This chapter names those meanings.',
        summary: 'The types of edges that connect nodes in the graph.',
        sections: [
          createSection('Structural Edges', 'technical', 'architectural',
            '**HAS_PILLAR**, **CONTAINS_ELEMENT**, **BELONGS_TO** — edges that define structural relationships.'),
          createSection('Temporal Edges', 'technical', 'architectural',
            '**OCCURS_DURING**, **PRECEDES**, **FOLLOWS** — edges that define temporal relationships.'),
          createSection('Narrative Edges', 'technical', 'architectural',
            '**TRIGGERS**, **TRANSFORMS**, **RESOLVES** — edges that define story relationships.'),
        ],
      }),
    ],
    crossReferences: [],
  };
}

/**
 * Generate Book V: The Story Canon
 */
function generateStoryCanonBook(): CodexBookEntry {
  return {
    id: 'story_canon',
    number: 5,
    title: BOOK_TITLES.story_canon,
    titleChinese: BOOK_CHINESE.story_canon,
    subtitle: BOOK_SUBTITLES.story_canon,
    glyph: BOOK_GLYPHS.story_canon,
    tone: BOOK_TONES.story_canon,
    invocation: BOOK_INVOCATIONS.story_canon,
    summary: 'This book teaches the grammar of narrative — beats, chapters, arcs, and the templates that shape lived experience.',
    chapters: [
      generateChapter('story_canon', 1, 'Story Beats', '故事节拍', {
        invocation: 'Every moment is a beat in the greater rhythm.',
        summary: 'Understanding the atomic units of narrative.',
        sections: [
          createSection('What is a Beat?', 'prose', 'poetic',
            'A **beat** is the smallest unit of story — a single moment of change, revelation, or emotion. Beats combine to form chapters, chapters combine to form arcs.'),
          createSection('Beat Types', 'technical', 'narrative',
            '**Rising beats** build tension. **Falling beats** release it. **Climax beats** transform. **Rest beats** integrate.'),
        ],
      }),
      generateChapter('story_canon', 2, 'Archetypal Templates', '原型模板', {
        invocation: 'The same stories echo across all lives.',
        summary: 'The universal patterns that shape individual narratives.',
        sections: [
          createSection('The Hero\'s Journey', 'prose', 'mythic',
            'The journey of departure, initiation, and return. Every major life transition echoes this pattern.'),
          createSection('The Healing Arc', 'prose', 'mythic',
            'The journey from wound to wisdom. Recognition, processing, releasing, integrating.'),
        ],
      }),
    ],
    crossReferences: [],
  };
}

/**
 * Generate Book VI: The Ritual Canon
 */
function generateRitualCanonBook(): CodexBookEntry {
  const archetypes: RitualArchetypeDoc[] = [
    {
      archetype: 'Initiate',
      archetypeChinese: '启动',
      symbol: '☉',
      description: 'Beginning something new. Planting seeds. Taking first steps.',
      timing: 'Morning hours, new moon, spring, start of cycles',
      direction: 'East',
      ceremony: 'The Initiation Ritual',
      examples: [],
    },
    {
      archetype: 'Deepen',
      archetypeChinese: '深化',
      symbol: '☽',
      description: 'Going deeper. Strengthening roots. Building foundations.',
      timing: 'Afternoon hours, waxing moon, summer, middle of cycles',
      direction: 'South',
      ceremony: 'The Deepening Ritual',
      examples: [],
    },
    {
      archetype: 'Heal',
      archetypeChinese: '愈合',
      symbol: '♡',
      description: 'Restoring balance. Mending wounds. Finding wholeness.',
      timing: 'Evening hours, full moon, autumn, times of restoration',
      direction: 'North',
      ceremony: 'The Healing Ritual',
      examples: [],
    },
    {
      archetype: 'Release',
      archetypeChinese: '释放',
      symbol: '☯',
      description: 'Letting go. Completing cycles. Creating space for new.',
      timing: 'Night hours, waning moon, winter, end of cycles',
      direction: 'West',
      ceremony: 'The Release Ritual',
      examples: [],
    },
  ];

  return {
    id: 'ritual_canon',
    number: 6,
    title: BOOK_TITLES.ritual_canon,
    titleChinese: BOOK_CHINESE.ritual_canon,
    subtitle: BOOK_SUBTITLES.ritual_canon,
    glyph: BOOK_GLYPHS.ritual_canon,
    tone: BOOK_TONES.ritual_canon,
    invocation: BOOK_INVOCATIONS.ritual_canon,
    summary: 'This book opens the ceremonial door — archetypes, windows, directions, and the structure of sacred action.',
    chapters: [
      generateChapter('ritual_canon', 1, 'The Four Archetypes', '四大原型', {
        invocation: 'Initiate. Deepen. Heal. Release. These are the sacred four.',
        summary: 'The four ritual archetypes that govern ceremonial timing.',
        sections: archetypes.map(arch => ({
          id: generateId(),
          title: `${arch.archetype} (${arch.archetypeChinese}) ${arch.symbol}`,
          contentType: 'ritual' as CodexContentType,
          tone: 'ceremonial' as CodexTone,
          content: `**${arch.description}**\n\n*Timing:* ${arch.timing}\n\n*Direction:* ${arch.direction}\n\n*Ceremony:* ${arch.ceremony}`,
          annotations: [],
        })),
      }),
      generateChapter('ritual_canon', 2, 'Ceremony Structures', '仪式结构', {
        invocation: 'Every ceremony has a form. This is that form.',
        summary: 'The structure of guided ceremonies.',
        sections: [
          createSection('Opening Direction', 'ritual', 'ceremonial',
            'Every ceremony begins by facing the auspicious direction. This aligns the body with cosmic currents.'),
          createSection('Breath Pattern', 'ritual', 'ceremonial',
            'Breath is the bridge between intention and action. Each ceremony has its appropriate rhythm.'),
          createSection('Gesture and Posture', 'ritual', 'ceremonial',
            'The body embodies the intention. Hands together, arms raised, bowing — each gesture carries meaning.'),
          createSection('Words and Intention', 'ritual', 'ceremonial',
            'Spoken or silent, the intention is named. This crystallizes the ceremony\'s purpose.'),
          createSection('Closing', 'ritual', 'ceremonial',
            'Every ceremony closes with grounding. The energy is sealed. The ritual is complete.'),
        ],
      }),
    ],
    crossReferences: [],
  };
}

/**
 * Generate Book VII: The Memory Archive
 */
function generateMemoryArchiveBook(): CodexBookEntry {
  return {
    id: 'memory_archive',
    number: 7,
    title: BOOK_TITLES.memory_archive,
    titleChinese: BOOK_CHINESE.memory_archive,
    subtitle: BOOK_SUBTITLES.memory_archive,
    glyph: BOOK_GLYPHS.memory_archive,
    tone: BOOK_TONES.memory_archive,
    invocation: BOOK_INVOCATIONS.memory_archive,
    summary: 'This book preserves the patterns of remembrance — how the cathedral stores, evolves, and learns from experience.',
    chapters: [
      generateChapter('memory_archive', 1, 'Types of Memory', '记忆类型', {
        invocation: 'What we remember shapes what we become.',
        summary: 'The different types of memory in the cathedral.',
        sections: [
          createSection('Structural Memory', 'prose', 'architectural',
            '**Structural memory** stores the fixed architecture — natal charts, relationship definitions, system configurations.'),
          createSection('Temporal Memory', 'prose', 'narrative',
            '**Temporal memory** stores time-indexed events — timing analyses, ritual completions, story progressions.'),
          createSection('Pattern Memory', 'prose', 'mythic',
            '**Pattern memory** stores extracted wisdom — recurring patterns, consolidated insights, learned associations.'),
        ],
      }),
      generateChapter('memory_archive', 2, 'Pattern Evolution', '模式进化', {
        invocation: 'Patterns are not static. They breathe and grow.',
        summary: 'How patterns are extracted, consolidated, and evolved.',
        sections: [
          createSection('Extraction', 'technical', 'architectural',
            'Patterns are extracted from accumulated data through analysis engines. What recurs is noted. What matters is weighted.'),
          createSection('Consolidation', 'prose', 'narrative',
            'Nightly consolidation processes merge similar patterns, prune obsolete ones, and strengthen significant ones.'),
          createSection('Evolution', 'prose', 'visionary',
            'Over time, the cathedral\'s understanding deepens. Patterns become wisdom. Data becomes knowing.'),
        ],
      }),
    ],
    crossReferences: [],
  };
}

/**
 * Generate Book VIII: The Orchestration Manual
 */
function generateOrchestrationBook(): CodexBookEntry {
  return {
    id: 'orchestration',
    number: 8,
    title: BOOK_TITLES.orchestration,
    titleChinese: BOOK_CHINESE.orchestration,
    subtitle: BOOK_SUBTITLES.orchestration,
    glyph: BOOK_GLYPHS.orchestration,
    tone: BOOK_TONES.orchestration,
    invocation: BOOK_INVOCATIONS.orchestration,
    summary: 'This book conducts the harmony — pipelines, conditions, scheduling, and the coordination of many engines.',
    chapters: [
      generateChapter('orchestration', 1, 'Pipeline Architecture', '管道架构', {
        invocation: 'Many voices, one symphony.',
        summary: 'How pipelines coordinate engine execution.',
        sections: [
          createSection('What is a Pipeline?', 'technical', 'instructive',
            'A **pipeline** is a sequence of engine executions, coordinated by conditions and connected by data flow.'),
          createSection('Sequential Execution', 'technical', 'instructive',
            'Steps that depend on previous outputs execute sequentially. Each step waits for its inputs.'),
          createSection('Parallel Execution', 'technical', 'instructive',
            'Independent steps execute in parallel, improving performance. The orchestrator manages synchronization.'),
        ],
      }),
      generateChapter('orchestration', 2, 'Ritual Processions', '仪式行列', {
        invocation: 'Some orchestrations are sacred.',
        summary: 'Ceremonial orchestration patterns.',
        sections: [
          createSection('The Ritual Procession', 'prose', 'ceremonial',
            'A **ritual procession** is an orchestration pattern where each step carries ceremonial significance. Timing matters. Order is sacred.'),
          createSection('Hooks and Gates', 'technical', 'architectural',
            '**Hooks** allow external intervention at defined points. **Gates** require approval before proceeding.'),
        ],
      }),
    ],
    crossReferences: [],
  };
}

/**
 * Generate Book IX: The Living Cathedral
 */
function generateLivingCathedralBook(): CodexBookEntry {
  return {
    id: 'living_cathedral',
    number: 9,
    title: BOOK_TITLES.living_cathedral,
    titleChinese: BOOK_CHINESE.living_cathedral,
    subtitle: BOOK_SUBTITLES.living_cathedral,
    glyph: BOOK_GLYPHS.living_cathedral,
    tone: BOOK_TONES.living_cathedral,
    invocation: BOOK_INVOCATIONS.living_cathedral,
    summary: 'This book speaks of the cathedral\'s life — its deployment, its security, its tools, and its future.',
    chapters: [
      generateChapter('living_cathedral', 1, 'The Cathedral in the World', '世间的大教堂', {
        invocation: 'The cathedral exists not in abstraction, but in lived reality.',
        summary: 'Deployment, performance, and real-world operation.',
        sections: [
          createSection('Deployment', 'technical', 'architectural',
            'The cathedral runs on cloud infrastructure — Firebase for data, Cloud Functions for engines, Neo4j for the knowledge graph.'),
          createSection('Performance', 'technical', 'architectural',
            'Performance is sacred. Slow calculation is disrespectful to the pilgrim. Every engine is optimized.'),
          createSection('Security', 'technical', 'ceremonial',
            'The cathedral is protected by six shields. Every input is validated. Every output is verified. Every flow is monitored.'),
        ],
      }),
      generateChapter('living_cathedral', 2, 'The Future Vision', '未来愿景', {
        invocation: 'The cathedral grows. This is its direction.',
        summary: 'The vision for the cathedral\'s evolution.',
        sections: [
          createSection('Expansion', 'prose', 'visionary',
            'New engines will be added. New rituals will be defined. New stories will be told. The cathedral is never complete.'),
          createSection('Deepening', 'prose', 'visionary',
            'Existing systems will deepen. Pattern recognition will improve. Story generation will become more nuanced. Ritual timing will become more precise.'),
          createSection('Integration', 'prose', 'visionary',
            'The cathedral will integrate with the lived world — calendars, reminders, physical spaces. The temple will touch the everyday.'),
        ],
      }),
    ],
    crossReferences: [],
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateChapter(
  book: CodexBook,
  number: number,
  title: string,
  titleChinese: string,
  content: {
    invocation: string;
    summary: string;
    sections: CodexSection[];
  }
): CodexChapter {
  return {
    id: `${book}_chapter_${number}`,
    number,
    title,
    titleChinese,
    glyph: BOOK_GLYPHS[book],
    invocation: content.invocation,
    summary: content.summary,
    sections: content.sections,
    diagrams: [],
    examples: [],
    crossReferences: [],
  };
}

function createSection(
  title: string,
  contentType: CodexContentType,
  tone: CodexTone,
  content: string
): CodexSection {
  return {
    id: generateId(),
    title,
    contentType,
    tone,
    content,
    annotations: [],
  };
}

function createExample(title: string, context: string, narrative: string): CodexExample {
  return {
    id: generateId(),
    title,
    context,
    narrative,
    technical: '',
    insight: '',
    relatedConcepts: [],
  };
}

function createFlowDiagram(id: string, title: string, stages: string[]): CodexDiagram {
  const nodes = stages.map((stage, i) => ({
    id: `node_${i}`,
    label: stage,
    type: 'stage',
    x: i * 150,
    y: 100,
  }));

  const edges = stages.slice(0, -1).map((_, i) => ({
    from: `node_${i}`,
    to: `node_${i + 1}`,
    style: 'solid' as const,
  }));

  return {
    id,
    title,
    type: 'flow',
    description: `Flow through ${stages.length} stages`,
    nodes,
    edges,
    caption: `The ${title.toLowerCase()} moves through ${stages.join(' → ')}`,
  };
}

function generateEngineChapter(engine: EngineDocumentation, number: number): CodexChapter {
  return {
    id: `engines_chapter_${number}`,
    number,
    title: engine.name,
    titleChinese: engine.nameChinese,
    glyph: BOOK_GLYPHS.engines,
    invocation: engine.metaphor,
    summary: engine.purpose,
    sections: [
      createSection('Purpose', 'prose', 'architectural', engine.purpose),
      createSection('Inputs', 'technical', 'architectural',
        engine.inputs.map(i => `- **${i.name}** (${i.type}): ${i.description}`).join('\n')),
      createSection('Outputs', 'technical', 'architectural',
        engine.outputs.map(o => `- **${o.name}** (${o.type}): ${o.description}`).join('\n')),
      createSection('Logic', 'prose', 'technical', engine.logic),
      createSection('Metaphor', 'metaphor', 'mythic', engine.metaphor),
    ],
    diagrams: [],
    examples: [engine.example],
    crossReferences: [],
  };
}

function generateFlowChapter(flow: FlowDocumentation, number: number): CodexChapter {
  return {
    id: `flows_chapter_${number}`,
    number,
    title: flow.name,
    titleChinese: flow.nameChinese,
    glyph: BOOK_GLYPHS.flows,
    invocation: flow.metaphor,
    summary: flow.description,
    sections: [
      createSection('Overview', 'prose', 'cartographic', flow.description),
      ...flow.stages.map(stage =>
        createSection(`Stage ${stage.order}: ${stage.name}`, 'technical', 'architectural', stage.description)
      ),
      createSection('Metaphor', 'metaphor', 'poetic', flow.metaphor),
    ],
    diagrams: [flow.diagram],
    examples: [],
    crossReferences: [],
  };
}

// ============================================================================
// CODEX GENERATION
// ============================================================================

/**
 * Generate all books of the codex
 */
export function generateAllBooks(): CodexBookEntry[] {
  return [
    generateFoundationBook(),
    generateEnginesBook(),
    generateFlowsBook(),
    generateKnowledgeGraphBook(),
    generateStoryCanonBook(),
    generateRitualCanonBook(),
    generateMemoryArchiveBook(),
    generateOrchestrationBook(),
    generateLivingCathedralBook(),
  ];
}

/**
 * Generate the glyph index
 */
export function generateGlyphIndex(books: CodexBookEntry[]): GlyphIndexEntry[] {
  const index: Map<string, GlyphIndexEntry> = new Map();

  for (const book of books) {
    const glyph = book.glyph;
    if (!index.has(glyph.symbol)) {
      index.set(glyph.symbol, {
        glyph,
        occurrences: [],
      });
    }
    index.get(glyph.symbol)!.occurrences.push({
      book: book.id,
      chapter: 'cover',
      context: book.title,
    });

    for (const chapter of book.chapters) {
      if (!index.has(chapter.glyph.symbol)) {
        index.set(chapter.glyph.symbol, {
          glyph: chapter.glyph,
          occurrences: [],
        });
      }
      index.get(chapter.glyph.symbol)!.occurrences.push({
        book: book.id,
        chapter: chapter.id,
        context: chapter.title,
      });
    }
  }

  return Array.from(index.values());
}

/**
 * Generate all cross-references
 */
export function generateReferenceIndex(books: CodexBookEntry[]): CodexReference[] {
  const references: CodexReference[] = [];

  for (const book of books) {
    references.push(...book.crossReferences);
    for (const chapter of book.chapters) {
      references.push(...chapter.crossReferences);
    }
  }

  return references;
}

// ============================================================================
// SCRIPTORIUM NAVIGATION
// ============================================================================

/**
 * Initialize the scriptorium
 */
export function initializeScriptorium(): ScriptoriumState {
  return {
    initialized: true,
    navigation: {
      currentBook: 'foundation',
      currentChapter: 'foundation_chapter_1',
      currentSection: '',
      breadcrumbs: [
        { level: 'book', id: 'foundation', title: BOOK_TITLES.foundation },
      ],
      bookmarks: [],
      recentlyViewed: [],
    },
    settings: DEFAULT_SCRIPTORIUM_SETTINGS,
    searchQuery: '',
    searchResults: [],
    glyphIndex: [],
    isLoading: false,
    error: null,
  };
}

/**
 * Navigate to a book
 */
export function navigateToBook(book: CodexBook): void {
  if (!codexState) return;

  codexState.scriptorium.navigation.currentBook = book;
  codexState.scriptorium.navigation.currentChapter = '';
  codexState.scriptorium.navigation.currentSection = '';
  codexState.scriptorium.navigation.breadcrumbs = [
    { level: 'book', id: book, title: BOOK_TITLES[book] },
  ];

  recordViewedItem(book, '');
}

/**
 * Navigate to a chapter
 */
export function navigateToChapter(book: CodexBook, chapterId: string): void {
  if (!codexState) return;

  const bookEntry = codexState.books.find(b => b.id === book);
  const chapter = bookEntry?.chapters.find(c => c.id === chapterId);

  if (!chapter) return;

  codexState.scriptorium.navigation.currentBook = book;
  codexState.scriptorium.navigation.currentChapter = chapterId;
  codexState.scriptorium.navigation.currentSection = '';
  codexState.scriptorium.navigation.breadcrumbs = [
    { level: 'book', id: book, title: BOOK_TITLES[book] },
    { level: 'chapter', id: chapterId, title: chapter.title },
  ];

  recordViewedItem(book, chapterId);
}

/**
 * Navigate to a section
 */
export function navigateToSection(book: CodexBook, chapterId: string, sectionId: string): void {
  if (!codexState) return;

  const bookEntry = codexState.books.find(b => b.id === book);
  const chapter = bookEntry?.chapters.find(c => c.id === chapterId);
  const section = chapter?.sections.find(s => s.id === sectionId);

  if (!section) return;

  codexState.scriptorium.navigation.currentBook = book;
  codexState.scriptorium.navigation.currentChapter = chapterId;
  codexState.scriptorium.navigation.currentSection = sectionId;
  codexState.scriptorium.navigation.breadcrumbs = [
    { level: 'book', id: book, title: BOOK_TITLES[book] },
    { level: 'chapter', id: chapterId, title: chapter!.title },
    { level: 'section', id: sectionId, title: section.title },
  ];

  recordViewedItem(book, chapterId, sectionId);
}

/**
 * Record a viewed item
 */
function recordViewedItem(book: CodexBook, chapter: string, section?: string): void {
  if (!codexState) return;

  const viewed: ViewedItem = {
    book,
    chapter,
    section,
    viewedAt: new Date(),
  };

  codexState.scriptorium.navigation.recentlyViewed.unshift(viewed);

  // Keep only last 20
  if (codexState.scriptorium.navigation.recentlyViewed.length > 20) {
    codexState.scriptorium.navigation.recentlyViewed.pop();
  }
}

/**
 * Add a bookmark
 */
export function addBookmark(
  book: CodexBook,
  chapter: string,
  section?: string,
  note?: string
): Bookmark {
  const bookEntry = codexState?.books.find(b => b.id === book);
  const chapterEntry = bookEntry?.chapters.find(c => c.id === chapter);

  const bookmark: Bookmark = {
    id: generateId(),
    book,
    chapter,
    section,
    title: chapterEntry?.title ?? BOOK_TITLES[book],
    note,
    createdAt: new Date(),
  };

  if (codexState) {
    codexState.scriptorium.navigation.bookmarks.push(bookmark);
  }

  return bookmark;
}

/**
 * Remove a bookmark
 */
export function removeBookmark(bookmarkId: string): void {
  if (!codexState) return;

  const index = codexState.scriptorium.navigation.bookmarks.findIndex(
    b => b.id === bookmarkId
  );

  if (index >= 0) {
    codexState.scriptorium.navigation.bookmarks.splice(index, 1);
  }
}

/**
 * Search the codex
 */
export function searchCodex(query: string): CodexSearchResult[] {
  if (!codexState || !query.trim()) return [];

  const results: CodexSearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  for (const book of codexState.books) {
    // Search book title
    if (book.title.toLowerCase().includes(lowerQuery)) {
      results.push({
        book: book.id,
        chapter: '',
        section: '',
        title: book.title,
        snippet: book.summary,
        relevance: 1.0,
        matchType: 'title',
      });
    }

    for (const chapter of book.chapters) {
      // Search chapter title
      if (chapter.title.toLowerCase().includes(lowerQuery)) {
        results.push({
          book: book.id,
          chapter: chapter.id,
          section: '',
          title: chapter.title,
          snippet: chapter.summary,
          relevance: 0.9,
          matchType: 'title',
        });
      }

      for (const section of chapter.sections) {
        // Search section content
        if (section.content.toLowerCase().includes(lowerQuery)) {
          const snippetStart = section.content.toLowerCase().indexOf(lowerQuery);
          const snippetEnd = Math.min(snippetStart + 100, section.content.length);
          results.push({
            book: book.id,
            chapter: chapter.id,
            section: section.id,
            title: section.title,
            snippet: section.content.substring(snippetStart, snippetEnd) + '...',
            relevance: 0.7,
            matchType: 'content',
          });
        }
      }
    }
  }

  // Sort by relevance
  results.sort((a, b) => b.relevance - a.relevance);

  if (codexState) {
    codexState.scriptorium.searchQuery = query;
    codexState.scriptorium.searchResults = results;
  }

  return results;
}

/**
 * Update scriptorium settings
 */
export function updateScriptoriumSettings(
  updates: Partial<ScriptoriumSettings>
): void {
  if (!codexState) return;

  codexState.scriptorium.settings = {
    ...codexState.scriptorium.settings,
    ...updates,
  };
}

// ============================================================================
// ACCESSORS
// ============================================================================

/**
 * Get a book by ID
 */
export function getBook(bookId: CodexBook): CodexBookEntry | null {
  return codexState?.books.find(b => b.id === bookId) ?? null;
}

/**
 * Get a chapter
 */
export function getChapter(bookId: CodexBook, chapterId: string): CodexChapter | null {
  const book = getBook(bookId);
  return book?.chapters.find(c => c.id === chapterId) ?? null;
}

/**
 * Get all books
 */
export function getAllBooks(): CodexBookEntry[] {
  return codexState?.books ?? [];
}

/**
 * Get current navigation
 */
export function getCurrentNavigation(): ScriptoriumNavigation | null {
  return codexState?.scriptorium.navigation ?? null;
}

/**
 * Get scriptorium state
 */
export function getScriptoriumState(): ScriptoriumState | null {
  return codexState?.scriptorium ?? null;
}

// ============================================================================
// ENGINE LIFECYCLE
// ============================================================================

/**
 * Initialize the codex engine
 */
export function initializeCodex(config?: Partial<CodexConfig>): CodexState {
  const fullConfig: CodexConfig = {
    ...DEFAULT_CODEX_CONFIG,
    ...config,
  };

  const books = generateAllBooks();

  codexState = {
    initialized: true,
    config: fullConfig,
    books,
    glyphIndex: generateGlyphIndex(books),
    referenceIndex: generateReferenceIndex(books),
    scriptorium: initializeScriptorium(),
    lastGenerated: new Date(),
    version: '1.0.0',
  };

  codexState.scriptorium.glyphIndex = codexState.glyphIndex;

  return codexState;
}

/**
 * Get codex state
 */
export function getCodexState(): CodexState | null {
  return codexState;
}

/**
 * Regenerate the codex
 */
export function regenerateCodex(): void {
  if (!codexState) return;

  const books = generateAllBooks();
  codexState.books = books;
  codexState.glyphIndex = generateGlyphIndex(books);
  codexState.referenceIndex = generateReferenceIndex(books);
  codexState.scriptorium.glyphIndex = codexState.glyphIndex;
  codexState.lastGenerated = new Date();
}

/**
 * Shutdown the codex engine
 */
export function shutdownCodex(): void {
  codexState = null;
}
