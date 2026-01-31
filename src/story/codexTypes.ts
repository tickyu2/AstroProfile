/**
 * Cathedral Knowledge Codex Types (大教堂法典类型)
 *
 * The scripture of the cathedral — a canonical, structured, beautifully
 * written book that documents the entire metaphysics OS.
 *
 * This is not documentation. It is a sacred text — mythic, architectural,
 * pedagogical, and ceremonial.
 *
 * Nine Books:
 * I.   The Foundation (基石之书)
 * II.  The Engines (引擎之书)
 * III. The Flows (流动之书)
 * IV.  The Knowledge Graph (图谱之书)
 * V.   The Story Canon (故事之书)
 * VI.  The Ritual Canon (仪式之书)
 * VII. The Memory Archive (记忆之书)
 * VIII.The Orchestration Manual (编排之书)
 * IX.  The Living Cathedral (大教堂之书)
 */

// ============================================================================
// CORE CODEX TYPES
// ============================================================================

/**
 * The nine books of the codex
 */
export type CodexBook =
  | 'foundation'      // Book I - The Foundation
  | 'engines'         // Book II - The Engines
  | 'flows'           // Book III - The Flows
  | 'knowledge_graph' // Book IV - The Knowledge Graph
  | 'story_canon'     // Book V - The Story Canon
  | 'ritual_canon'    // Book VI - The Ritual Canon
  | 'memory_archive'  // Book VII - The Memory Archive
  | 'orchestration'   // Book VIII - The Orchestration Manual
  | 'living_cathedral'; // Book IX - The Living Cathedral

/**
 * Content type within the codex
 */
export type CodexContentType =
  | 'prose'           // Narrative text
  | 'metaphor'        // Mythic metaphor
  | 'diagram'         // Visual diagram
  | 'example'         // Narrative example
  | 'technical'       // Technical explanation
  | 'ritual'          // Ritual instruction
  | 'invocation'      // Opening invocation
  | 'summary'         // Chapter summary
  | 'reference';      // Cross-reference

/**
 * Tone of codex content
 */
export type CodexTone =
  | 'mythic'          // Like the Upanishads
  | 'architectural'   // Like Palladio
  | 'technical'       // Like a software spec
  | 'ceremonial'      // Like a ritual manual
  | 'narrative'       // Like a story cycle
  | 'cartographic'    // Like a map
  | 'poetic'          // Like poetry
  | 'instructive'     // Like a teaching
  | 'visionary';      // Like prophecy

/**
 * A glyph for codex sections
 */
export interface CodexGlyph {
  symbol: string;           // Unicode symbol
  name: string;             // Glyph name
  meaning: string;          // What it represents
  color: string;            // Hex color
}

// ============================================================================
// BOOK STRUCTURE
// ============================================================================

/**
 * A book in the codex
 */
export interface CodexBookEntry {
  id: CodexBook;
  number: number;           // I, II, III...
  title: string;            // English title
  titleChinese: string;     // Chinese title
  subtitle: string;         // Descriptive subtitle
  glyph: CodexGlyph;
  tone: CodexTone;
  invocation: string;       // Opening invocation
  summary: string;          // Book summary
  chapters: CodexChapter[];
  crossReferences: CodexReference[];
}

/**
 * A chapter within a book
 */
export interface CodexChapter {
  id: string;
  number: number;
  title: string;
  titleChinese: string;
  glyph: CodexGlyph;
  invocation: string;
  summary: string;
  sections: CodexSection[];
  diagrams: CodexDiagram[];
  examples: CodexExample[];
  crossReferences: CodexReference[];
}

/**
 * A section within a chapter
 */
export interface CodexSection {
  id: string;
  title: string;
  titleChinese?: string;
  contentType: CodexContentType;
  tone: CodexTone;
  content: string;          // Markdown content
  annotations: CodexAnnotation[];
}

/**
 * An annotation or sidebar
 */
export interface CodexAnnotation {
  id: string;
  type: 'note' | 'warning' | 'insight' | 'metaphor' | 'reference';
  content: string;
  position: 'margin' | 'inline' | 'footer';
}

/**
 * A diagram in the codex
 */
export interface CodexDiagram {
  id: string;
  title: string;
  type: 'flow' | 'structure' | 'graph' | 'timeline' | 'mandala' | 'wheel';
  description: string;
  svgData?: string;         // Inline SVG
  imageUrl?: string;        // External image
  nodes?: DiagramNode[];
  edges?: DiagramEdge[];
  caption: string;
}

/**
 * A node in a diagram
 */
export interface DiagramNode {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  color?: string;
}

/**
 * An edge in a diagram
 */
export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  style?: 'solid' | 'dashed' | 'dotted';
}

/**
 * A narrative example
 */
export interface CodexExample {
  id: string;
  title: string;
  context: string;          // Setup/context
  narrative: string;        // The story
  technical: string;        // Technical explanation
  insight: string;          // Key takeaway
  relatedConcepts: string[];
}

/**
 * A cross-reference
 */
export interface CodexReference {
  id: string;
  sourceBook: CodexBook;
  sourceChapter: string;
  targetBook: CodexBook;
  targetChapter: string;
  description: string;
  relationship: 'builds_on' | 'explains' | 'contrasts' | 'implements' | 'extends';
}

// ============================================================================
// BOOK I: THE FOUNDATION (基石之书)
// ============================================================================

/**
 * Foundation layer concept
 */
export interface FoundationLayer {
  name: string;
  nameChinese: string;
  order: number;            // 1-5
  description: string;
  metaphor: string;
  components: string[];
}

/**
 * Cathedral philosophy concept
 */
export interface CathedralPhilosophy {
  principle: string;
  principleChinese: string;
  explanation: string;
  metaphor: string;
  implementation: string;
}

// ============================================================================
// BOOK II: THE ENGINES (引擎之书)
// ============================================================================

/**
 * Engine documentation
 */
export interface EngineDocumentation {
  id: string;
  name: string;
  nameChinese: string;
  purpose: string;
  inputs: EngineInput[];
  outputs: EngineOutput[];
  logic: string;            // Plain language explanation
  metaphor: string;         // Mythic metaphor
  example: CodexExample;
  dependencies: string[];
  dependents: string[];
}

/**
 * Engine input specification
 */
export interface EngineInput {
  name: string;
  type: string;
  description: string;
  required: boolean;
  source: string;           // Where it comes from
}

/**
 * Engine output specification
 */
export interface EngineOutput {
  name: string;
  type: string;
  description: string;
  consumers: string[];      // What uses this output
}

// ============================================================================
// BOOK III: THE FLOWS (流动之书)
// ============================================================================

/**
 * Flow documentation
 */
export interface FlowDocumentation {
  id: string;
  name: string;
  nameChinese: string;
  type: 'data' | 'timing' | 'narrative' | 'ritual' | 'orchestration' | 'environmental';
  description: string;
  stages: FlowStage[];
  triggers: string[];
  diagram: CodexDiagram;
  metaphor: string;
}

/**
 * A stage in a flow
 */
export interface FlowStage {
  order: number;
  name: string;
  description: string;
  inputs: string[];
  outputs: string[];
  transformations: string[];
}

// ============================================================================
// BOOK IV: THE KNOWLEDGE GRAPH (图谱之书)
// ============================================================================

/**
 * Knowledge graph documentation
 */
export interface KnowledgeGraphDocumentation {
  nodeCategories: NodeCategoryDoc[];
  edgeTypes: EdgeTypeDoc[];
  flowRelationships: FlowRelationshipDoc[];
  dependencyChains: DependencyChainDoc[];
  systemMaps: SystemMapDoc[];
}

/**
 * Node category documentation
 */
export interface NodeCategoryDoc {
  category: string;
  categoryChinese: string;
  description: string;
  examples: string[];
  properties: string[];
  relationships: string[];
}

/**
 * Edge type documentation
 */
export interface EdgeTypeDoc {
  type: string;
  typeChinese: string;
  description: string;
  fromCategories: string[];
  toCategories: string[];
  semantics: string;
}

/**
 * Flow relationship documentation
 */
export interface FlowRelationshipDoc {
  name: string;
  description: string;
  participants: string[];
  direction: 'unidirectional' | 'bidirectional' | 'cyclical';
}

/**
 * Dependency chain documentation
 */
export interface DependencyChainDoc {
  name: string;
  description: string;
  chain: string[];
  purpose: string;
}

/**
 * System map documentation
 */
export interface SystemMapDoc {
  name: string;
  description: string;
  diagram: CodexDiagram;
  components: string[];
}

// ============================================================================
// BOOK V: THE STORY CANON (故事之书)
// ============================================================================

/**
 * Story element documentation
 */
export interface StoryElementDoc {
  element: string;
  elementChinese: string;
  description: string;
  purpose: string;
  examples: string[];
  relationships: string[];
}

/**
 * Archetype template documentation
 */
export interface ArchetypeTemplateDoc {
  archetype: string;
  archetypeChinese: string;
  description: string;
  characteristics: string[];
  narrativePatterns: string[];
  examples: CodexExample[];
}

/**
 * Story weaving pattern
 */
export interface StoryWeavingPattern {
  name: string;
  description: string;
  components: string[];
  rules: string[];
  example: CodexExample;
}

// ============================================================================
// BOOK VI: THE RITUAL CANON (仪式之书)
// ============================================================================

/**
 * Ritual archetype documentation
 */
export interface RitualArchetypeDoc {
  archetype: string;
  archetypeChinese: string;
  symbol: string;
  description: string;
  timing: string;
  direction: string;
  ceremony: string;
  examples: CodexExample[];
}

/**
 * Ritual window documentation
 */
export interface RitualWindowDoc {
  type: string;
  typeChinese: string;
  description: string;
  factors: string[];
  optimal: string;
  avoid: string;
}

/**
 * Ceremony structure documentation
 */
export interface CeremonyStructureDoc {
  name: string;
  nameChinese: string;
  archetype: string;
  steps: CeremonyStepDoc[];
  timing: string;
  direction: string;
  materials: string[];
  aftercare: string[];
}

/**
 * Ceremony step documentation
 */
export interface CeremonyStepDoc {
  order: number;
  name: string;
  type: string;
  instruction: string;
  duration: string;
  purpose: string;
}

// ============================================================================
// BOOK VII: THE MEMORY ARCHIVE (记忆之书)
// ============================================================================

/**
 * Memory type documentation
 */
export interface MemoryTypeDoc {
  type: string;
  typeChinese: string;
  description: string;
  structure: string;
  persistence: string;
  evolution: string;
  examples: string[];
}

/**
 * Pattern extraction documentation
 */
export interface PatternExtractionDoc {
  name: string;
  description: string;
  inputs: string[];
  algorithm: string;
  outputs: string[];
  example: CodexExample;
}

// ============================================================================
// BOOK VIII: THE ORCHESTRATION MANUAL (编排之书)
// ============================================================================

/**
 * Pipeline documentation
 */
export interface PipelineDoc {
  name: string;
  nameChinese: string;
  purpose: string;
  stages: PipelineStageDoc[];
  conditions: string[];
  hooks: string[];
  scheduling: string;
}

/**
 * Pipeline stage documentation
 */
export interface PipelineStageDoc {
  order: number;
  name: string;
  operation: string;
  inputs: string[];
  outputs: string[];
  errorHandling: string;
}

/**
 * Orchestration pattern documentation
 */
export interface OrchestrationPatternDoc {
  name: string;
  description: string;
  type: 'sequential' | 'parallel' | 'conditional' | 'recursive' | 'ritual';
  structure: string;
  example: CodexExample;
}

// ============================================================================
// BOOK IX: THE LIVING CATHEDRAL (大教堂之书)
// ============================================================================

/**
 * System component documentation
 */
export interface SystemComponentDoc {
  name: string;
  nameChinese: string;
  category: 'deployment' | 'performance' | 'security' | 'sandbox' | 'devtools' | 'analytics' | 'ritual';
  purpose: string;
  architecture: string;
  integration: string;
  futureExpansion: string;
}

/**
 * Vision statement
 */
export interface VisionStatement {
  title: string;
  titleChinese: string;
  statement: string;
  implications: string[];
  roadmap: string[];
}

// ============================================================================
// SCRIPTORIUM UI (法典书阁)
// ============================================================================

/**
 * Scriptorium navigation state
 */
export interface ScriptoriumNavigation {
  currentBook: CodexBook;
  currentChapter: string;
  currentSection: string;
  breadcrumbs: Breadcrumb[];
  bookmarks: Bookmark[];
  recentlyViewed: ViewedItem[];
}

/**
 * Breadcrumb for navigation
 */
export interface Breadcrumb {
  level: 'book' | 'chapter' | 'section';
  id: string;
  title: string;
}

/**
 * User bookmark
 */
export interface Bookmark {
  id: string;
  book: CodexBook;
  chapter: string;
  section?: string;
  title: string;
  note?: string;
  createdAt: Date;
}

/**
 * Recently viewed item
 */
export interface ViewedItem {
  book: CodexBook;
  chapter: string;
  section?: string;
  viewedAt: Date;
}

/**
 * Search result
 */
export interface CodexSearchResult {
  book: CodexBook;
  chapter: string;
  section: string;
  title: string;
  snippet: string;
  relevance: number;
  matchType: 'title' | 'content' | 'glyph' | 'reference';
}

/**
 * Glyph index entry
 */
export interface GlyphIndexEntry {
  glyph: CodexGlyph;
  occurrences: {
    book: CodexBook;
    chapter: string;
    context: string;
  }[];
}

/**
 * Scriptorium display settings
 */
export interface ScriptoriumSettings {
  fontSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark' | 'sepia' | 'parchment';
  showAnnotations: boolean;
  showDiagrams: boolean;
  showCrossReferences: boolean;
  showGlyphs: boolean;
  readingMode: 'continuous' | 'paginated';
}

/**
 * Complete Scriptorium state
 */
export interface ScriptoriumState {
  initialized: boolean;
  navigation: ScriptoriumNavigation;
  settings: ScriptoriumSettings;
  searchQuery: string;
  searchResults: CodexSearchResult[];
  glyphIndex: GlyphIndexEntry[];
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// CODEX ENGINE STATE
// ============================================================================

/**
 * Codex generation configuration
 */
export interface CodexConfig {
  includeExamples: boolean;
  includeDiagrams: boolean;
  includeAnnotations: boolean;
  language: 'en' | 'zh' | 'bilingual';
  detailLevel: 'summary' | 'standard' | 'comprehensive';
}

/**
 * Complete Codex state
 */
export interface CodexState {
  initialized: boolean;
  config: CodexConfig;
  books: CodexBookEntry[];
  glyphIndex: GlyphIndexEntry[];
  referenceIndex: CodexReference[];
  scriptorium: ScriptoriumState;
  lastGenerated: Date;
  version: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Chinese translations for books
 */
export const BOOK_CHINESE: Record<CodexBook, string> = {
  foundation: '基石之书',
  engines: '引擎之书',
  flows: '流动之书',
  knowledge_graph: '图谱之书',
  story_canon: '故事之书',
  ritual_canon: '仪式之书',
  memory_archive: '记忆之书',
  orchestration: '编排之书',
  living_cathedral: '大教堂之书',
};

/**
 * English titles for books
 */
export const BOOK_TITLES: Record<CodexBook, string> = {
  foundation: 'The Foundation',
  engines: 'The Engines',
  flows: 'The Flows',
  knowledge_graph: 'The Knowledge Graph',
  story_canon: 'The Story Canon',
  ritual_canon: 'The Ritual Canon',
  memory_archive: 'The Memory Archive',
  orchestration: 'The Orchestration Manual',
  living_cathedral: 'The Living Cathedral',
};

/**
 * Book numbers (Roman numerals)
 */
export const BOOK_NUMBERS: Record<CodexBook, string> = {
  foundation: 'I',
  engines: 'II',
  flows: 'III',
  knowledge_graph: 'IV',
  story_canon: 'V',
  ritual_canon: 'VI',
  memory_archive: 'VII',
  orchestration: 'VIII',
  living_cathedral: 'IX',
};

/**
 * Book tones
 */
export const BOOK_TONES: Record<CodexBook, CodexTone> = {
  foundation: 'mythic',
  engines: 'architectural',
  flows: 'cartographic',
  knowledge_graph: 'cartographic',
  story_canon: 'poetic',
  ritual_canon: 'ceremonial',
  memory_archive: 'narrative',
  orchestration: 'instructive',
  living_cathedral: 'visionary',
};

/**
 * Book glyphs
 */
export const BOOK_GLYPHS: Record<CodexBook, CodexGlyph> = {
  foundation: {
    symbol: '◇',
    name: 'Diamond',
    meaning: 'The crystalline foundation',
    color: '#4169E1',
  },
  engines: {
    symbol: '⚙',
    name: 'Gear',
    meaning: 'The working mechanisms',
    color: '#CD853F',
  },
  flows: {
    symbol: '〰',
    name: 'Wave',
    meaning: 'The flowing currents',
    color: '#20B2AA',
  },
  knowledge_graph: {
    symbol: '✧',
    name: 'Star',
    meaning: 'The constellation of knowledge',
    color: '#FFD700',
  },
  story_canon: {
    symbol: '📖',
    name: 'Book',
    meaning: 'The living narrative',
    color: '#8B4513',
  },
  ritual_canon: {
    symbol: '☯',
    name: 'Yin-Yang',
    meaning: 'The ceremonial balance',
    color: '#9932CC',
  },
  memory_archive: {
    symbol: '⌘',
    name: 'Archive',
    meaning: 'The stored wisdom',
    color: '#708090',
  },
  orchestration: {
    symbol: '♬',
    name: 'Music',
    meaning: 'The harmonious coordination',
    color: '#FF6347',
  },
  living_cathedral: {
    symbol: '⛩',
    name: 'Torii',
    meaning: 'The sacred gateway',
    color: '#DC143C',
  },
};

/**
 * Book subtitles
 */
export const BOOK_SUBTITLES: Record<CodexBook, string> = {
  foundation: 'The metaphysical philosophy of the cathedral',
  engines: 'A clear explanation of every engine',
  flows: 'How data, timing, story, and ritual move',
  knowledge_graph: 'The entire cathedral knowledge graph',
  story_canon: 'Beats, chapters, arcs, and templates',
  ritual_canon: 'Archetypes, windows, and ceremonies',
  memory_archive: 'Structural, temporal, and pattern memory',
  orchestration: 'Pipelines, conditions, and scheduling',
  living_cathedral: 'Deployment, security, and future vision',
};

/**
 * Book invocations
 */
export const BOOK_INVOCATIONS: Record<CodexBook, string> = {
  foundation: 'Before the first stone was laid, there was intention. Before intention, there was understanding. This is where we begin.',
  engines: 'The engines are the heartbeat of the cathedral. Each one a chamber, each one a rhythm, each one a purpose.',
  flows: 'All things move. Data flows like water. Timing flows like breath. Story flows like life. This book traces those currents.',
  knowledge_graph: 'Everything is connected. This map shows how. Follow the edges. Trace the nodes. See the whole.',
  story_canon: 'We are storied beings. Our lives are narratives. This book teaches the grammar of that narrative.',
  ritual_canon: 'Ritual is intention made visible. Ceremony is timing made sacred. This book opens the ceremonial door.',
  memory_archive: 'What we remember shapes what we become. This book preserves the patterns of remembrance.',
  orchestration: 'Many voices, one symphony. Many engines, one flow. This book conducts the harmony.',
  living_cathedral: 'The cathedral breathes. It grows. It evolves. This book speaks of its living future.',
};

/**
 * Content type descriptions
 */
export const CONTENT_TYPE_DESCRIPTIONS: Record<CodexContentType, string> = {
  prose: 'Narrative explanatory text',
  metaphor: 'Mythic or poetic metaphor',
  diagram: 'Visual diagram or chart',
  example: 'Narrative example or case study',
  technical: 'Technical specification or detail',
  ritual: 'Ritual or ceremonial instruction',
  invocation: 'Opening invocation or blessing',
  summary: 'Chapter or section summary',
  reference: 'Cross-reference to other content',
};

/**
 * Tone descriptions
 */
export const TONE_DESCRIPTIONS: Record<CodexTone, string> = {
  mythic: 'Cosmological and foundational',
  architectural: 'Structural and precise',
  technical: 'Specification and detail',
  ceremonial: 'Sacred and instructive',
  narrative: 'Story and flow',
  cartographic: 'Mapping and navigation',
  poetic: 'Literary and evocative',
  instructive: 'Teaching and guiding',
  visionary: 'Future and possibility',
};

/**
 * Default codex configuration
 */
export const DEFAULT_CODEX_CONFIG: CodexConfig = {
  includeExamples: true,
  includeDiagrams: true,
  includeAnnotations: true,
  language: 'bilingual',
  detailLevel: 'standard',
};

/**
 * Default scriptorium settings
 */
export const DEFAULT_SCRIPTORIUM_SETTINGS: ScriptoriumSettings = {
  fontSize: 'medium',
  theme: 'parchment',
  showAnnotations: true,
  showDiagrams: true,
  showCrossReferences: true,
  showGlyphs: true,
  readingMode: 'continuous',
};

/**
 * The five foundation layers
 */
export const FOUNDATION_LAYERS: FoundationLayer[] = [
  {
    name: 'Chart',
    nameChinese: '命盘',
    order: 1,
    description: 'The natal blueprint — who you are at birth',
    metaphor: 'The seed containing the entire tree',
    components: ['Natal Chart Engine', 'BaZi Calculator', 'Western Astrology'],
  },
  {
    name: 'Timing',
    nameChinese: '时机',
    order: 2,
    description: 'The temporal currents — when energies align',
    metaphor: 'The river that carries all vessels',
    components: ['Timing Engine', 'Luck Pillars', 'Annual/Monthly/Daily Luck'],
  },
  {
    name: 'Story',
    nameChinese: '故事',
    order: 3,
    description: 'The narrative arc — where you are in your journey',
    metaphor: 'The book being written with every breath',
    components: ['Story Engine', 'Predictive Story Engine', 'Archetypes'],
  },
  {
    name: 'Ritual',
    nameChinese: '仪式',
    order: 4,
    description: 'The ceremonial interface — how to honor the timing',
    metaphor: 'The bridge between knowing and doing',
    components: ['Ritual Layer', 'Ceremony Chamber', 'Sanctuary'],
  },
  {
    name: 'Action',
    nameChinese: '行动',
    order: 5,
    description: 'The lived expression — what to do with this moment',
    metaphor: 'The hand that moves the world',
    components: ['Fate-to-Action Engine', 'Action Recommendations', 'Guidance'],
  },
];
