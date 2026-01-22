/**
 * ============================================
 * KNOWLEDGE CODEX - TYPE DEFINITIONS
 * Schema for transforming rule engine outputs
 * into human-readable cathedral wisdom
 * ============================================
 */

/**
 * Reference to the underlying rule that triggered this entry
 */
export interface CodexRuleReference {
  id: string;                 // Matches JSON rule id (e.g., "fake_follow_wealth")
  name: string;               // Human-readable rule name
  chineseName?: string;       // Traditional name (e.g., "假从财格")
  category: CodexCategory;    // Category classification
  priority: number;           // Rule priority (lower = more specific)
}

/**
 * Categories for Codex entries
 */
export type CodexCategory =
  | 'structure'
  | 'combination'
  | 'useful_god'
  | 'clash'
  | 'harm'
  | 'punishment'
  | 'seasonal'
  | 'hidden_stem'
  | 'luck_pillar'
  | 'shen_sha';

/**
 * Multi-layered explanation for different audiences
 */
export interface CodexExplanation {
  title: string;              // Short human label
  summary: string;            // 1-2 sentence explanation for beginners
  technicalDetail: string;    // Precise classical logic for practitioners
  interpretation: string;     // How this feels / manifests in life
  recommendations?: string[]; // What to do / watch for
  warnings?: string[];        // Important cautions
}

/**
 * Severity level for the finding
 */
export type CodexSeverity = 'info' | 'minor' | 'moderate' | 'significant' | 'major';

/**
 * Effect type - positive, negative, or neutral
 */
export type CodexEffect = 'beneficial' | 'neutral' | 'challenging' | 'mixed';

/**
 * Complete Codex entry - the knowledge unit
 */
export interface CodexEntry {
  // Core reference
  rule: CodexRuleReference;
  explanation: CodexExplanation;

  // Metadata
  severity: CodexSeverity;
  effect: CodexEffect;
  confidence: number;         // 0-100, how certain we are this applies

  // Cathedral integration hooks
  personaHook: string;        // First-person cathedral voice (Luna/Guide)
  personaHookChinese?: string; // Chinese version of persona hook
  journeyStepHint: string;    // How to weave into Pilgrim Journey
  journeyChamber: string;     // Which chamber/hall this belongs to

  // Visual/UI hints
  iconHint?: string;          // Suggested icon or emoji
  colorHint?: string;         // Suggested color theme
}

/**
 * Complete Codex for a chart reading
 */
export interface KnowledgeCodex {
  // Metadata
  generatedAt: Date;
  chartId?: string;

  // Organized entries by category
  entries: CodexEntry[];

  // Summary statistics
  summary: {
    totalFindings: number;
    byCategory: Record<CodexCategory, number>;
    bySeverity: Record<CodexSeverity, number>;
    overallTone: CodexEffect;
  };

  // Top-level narrative
  openingNarrative: string;
  closingNarrative: string;
}

/**
 * Chamber definitions for the Pilgrim Journey
 */
export interface JourneyChamber {
  id: string;
  name: string;
  chineseName: string;
  description: string;
  categories: CodexCategory[];
  iconHint: string;
  order: number;
}

/**
 * A step in the Pilgrim Journey
 */
export interface JourneyStep {
  id: string;
  chamber: JourneyChamber;
  title: string;
  narrative: string;
  narrativeChinese?: string;
  entry: CodexEntry;
  order: number;
}

/**
 * Complete Pilgrim Journey
 */
export interface PilgrimJourney {
  title: string;
  introduction: string;
  chambers: JourneyChamber[];
  steps: JourneyStep[];
  conclusion: string;
}

/**
 * Predefined chambers for the journey
 */
export const JOURNEY_CHAMBERS: JourneyChamber[] = [
  {
    id: 'structure',
    name: 'Structure Chamber',
    chineseName: '格局殿',
    description: 'Where we examine the fundamental pattern of your destiny',
    categories: ['structure'],
    iconHint: '🏛️',
    order: 1
  },
  {
    id: 'elements',
    name: 'Elemental Winds Gallery',
    chineseName: '五行风廊',
    description: 'Where we feel the seasonal forces shaping your elements',
    categories: ['seasonal'],
    iconHint: '🌿',
    order: 2
  },
  {
    id: 'useful_god',
    name: 'Useful God Sanctuary',
    chineseName: '用神圣殿',
    description: 'Where we discover your guiding star and balancing force',
    categories: ['useful_god'],
    iconHint: '⭐',
    order: 3
  },
  {
    id: 'combinations',
    name: 'Heavenly Combinations Hall',
    chineseName: '合化之厅',
    description: 'Where we witness the dance of merging energies',
    categories: ['combination'],
    iconHint: '🔗',
    order: 4
  },
  {
    id: 'conflicts',
    name: 'Clash & Conflict Court',
    chineseName: '冲刑之庭',
    description: 'Where we acknowledge the tensions within your chart',
    categories: ['clash', 'harm', 'punishment'],
    iconHint: '⚡',
    order: 5
  },
  {
    id: 'hidden',
    name: 'Hidden Roots Crypt',
    chineseName: '藏干之窟',
    description: 'Where we unearth the hidden influences beneath the surface',
    categories: ['hidden_stem'],
    iconHint: '🔮',
    order: 6
  },
  {
    id: 'shen_sha',
    name: 'Star Light Pavilion',
    chineseName: '神煞阁',
    description: 'Where we read the special stars marking your path',
    categories: ['shen_sha'],
    iconHint: '✨',
    order: 7
  },
  {
    id: 'luck_pillar',
    name: 'DaYun Corridor',
    chineseName: '大运长廊',
    description: 'Where we walk the timeline of your luck pillars',
    categories: ['luck_pillar'],
    iconHint: '📅',
    order: 8
  }
];
