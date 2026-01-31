/**
 * ============================================================================
 * MULTI-RELATIONSHIP STORY WEAVING - TYPE DEFINITIONS (多关系故事编织类型)
 * ============================================================================
 *
 * The grand nave of the cathedral.
 * Types for weaving multiple destinies into a single story-world.
 *
 * Four Weaving Modes:
 * - Family (家族故事编织) - Multi-generational lineage
 * - Team (团队故事编织) - Organizational mission arc
 * - Polycule (多元关系故事编织) - Networked emotional ecosystem
 * - Generational (世代弧线编织) - Five-generation destiny arc
 *
 * Created: January 2026
 * ============================================================================
 */

import type { EmotionalTone, BeatType, ChapterArc, PredictiveStory } from './storyTypes';

// ============================================================================
// WEAVING MODES
// ============================================================================

/**
 * The four modes of story weaving
 */
export type WeavingMode =
  | 'family'       // 家族故事编织 - Multi-generational lineage
  | 'team'         // 团队故事编织 - Organizational mission
  | 'polycule'     // 多元关系故事编织 - Networked relationships
  | 'generational'; // 世代弧线编织 - Five-generation arc

export const WEAVING_MODE_CHINESE: Record<WeavingMode, string> = {
  family: '家族故事编织',
  team: '团队故事编织',
  polycule: '多元关系故事编织',
  generational: '世代弧线编织'
};

export const WEAVING_MODE_DESCRIPTIONS: Record<WeavingMode, string> = {
  family: 'Weave parents, children, siblings, ancestors into a multi-generational arc',
  team: 'Weave founders, collaborators, departments into a collective mission arc',
  polycule: 'Weave dyads, triads, metamours into a networked emotional ecosystem',
  generational: 'Weave five generations into an ancestral saga'
};

// ============================================================================
// PARTICIPANT TYPES
// ============================================================================

/**
 * A participant in the woven story
 */
export interface WeavingParticipant {
  id: string;
  name: string;
  nameChinese?: string;

  // Role in the weave
  role: ParticipantRole;
  roleChinese?: string;

  // Generational position (for family/generational modes)
  generation?: number; // -2 grandparent, -1 parent, 0 self, 1 child, 2 grandchild

  // Their individual story
  individualStory?: PredictiveStory;

  // Chart summary
  chartSummary?: {
    dayMaster: string;
    dominantElement: string;
    currentPhase: string;
  };
}

export type ParticipantRole =
  // Family roles
  | 'self'
  | 'partner'
  | 'parent'
  | 'child'
  | 'sibling'
  | 'grandparent'
  | 'grandchild'
  | 'ancestor'
  | 'descendant'
  // Team roles
  | 'founder'
  | 'leader'
  | 'collaborator'
  | 'member'
  | 'advisor'
  // Polycule roles
  | 'primary'
  | 'secondary'
  | 'metamour'
  | 'anchor'
  | 'satellite';

export const ROLE_CHINESE: Record<ParticipantRole, string> = {
  self: '自己',
  partner: '伴侣',
  parent: '父母',
  child: '子女',
  sibling: '兄弟姐妹',
  grandparent: '祖父母',
  grandchild: '孙子女',
  ancestor: '祖先',
  descendant: '后代',
  founder: '创始人',
  leader: '领导者',
  collaborator: '合作者',
  member: '成员',
  advisor: '顾问',
  primary: '主要伴侣',
  secondary: '次要伴侣',
  metamour: '元配',
  anchor: '锚点',
  satellite: '卫星'
};

// ============================================================================
// RELATIONSHIP EDGES
// ============================================================================

/**
 * A relationship edge between participants
 */
export interface WeavingEdge {
  id: string;
  participants: [string, string]; // Two participant IDs

  // Relationship type
  relationshipType: RelationshipType;
  relationshipTypeChinese?: string;

  // Synastry data
  synastryScore?: number;
  synastryQualities?: string[];

  // Composite data
  compositeTheme?: string;

  // Edge weight (for visualization)
  weight: number;
}

export type RelationshipType =
  | 'romantic'
  | 'familial'
  | 'collaborative'
  | 'friendship'
  | 'mentor-mentee'
  | 'ancestral';

// ============================================================================
// WOVEN BEATS
// ============================================================================

/**
 * A beat that involves multiple participants
 */
export interface WovenStoryBeat {
  id: string;

  // Who is involved
  participants: string[]; // participant IDs
  participantRoles: Record<string, ParticipantRole>;

  // Time range
  timeRange: {
    start: string; // ISO date
    end: string;   // ISO date
  };

  // Beat classification
  beatType: WovenBeatType;
  beatTypeChinese: string;

  // Emotional quality
  emotionalTone: EmotionalTone;
  emotionalToneChinese: string;

  // Collective intensity (0-100)
  collectiveIntensity: number;

  // Beat pattern
  pattern: BeatPattern;

  // Narrative content
  summary: string;
  narrative: string;

  // Source beats (from individual stories)
  sourceBeats?: Array<{
    participantId: string;
    beatId: string;
  }>;
}

/**
 * Types of woven beats
 */
export type WovenBeatType =
  // Collective beats
  | 'convergence'    // Multiple stories align
  | 'divergence'     // Stories split apart
  | 'resonance'      // Echo across relationships
  | 'dissonance'     // Tension across relationships
  | 'synchronicity'  // Meaningful coincidence
  // Systemic beats
  | 'systemic_shift' // Whole system changes
  | 'pattern_repeat' // Recurring theme
  | 'pattern_break'  // Breaking a pattern
  | 'generational_echo' // Cross-generation resonance
  | 'healing_window' // Collective healing opportunity
  // Relational beats
  | 'bonding'        // Relationships strengthen
  | 'fracturing'     // Relationships strain
  | 'reweaving'      // Relationships repair
  | 'expansion'      // Network grows
  | 'contraction';   // Network tightens

export const WOVEN_BEAT_TYPE_CHINESE: Record<WovenBeatType, string> = {
  convergence: '汇聚',
  divergence: '分流',
  resonance: '共振',
  dissonance: '不和谐',
  synchronicity: '同步性',
  systemic_shift: '系统转变',
  pattern_repeat: '模式重复',
  pattern_break: '模式打破',
  generational_echo: '代际回响',
  healing_window: '疗愈窗口',
  bonding: '连结',
  fracturing: '裂痕',
  reweaving: '重织',
  expansion: '扩展',
  contraction: '收缩'
};

/**
 * Beat patterns in the collective narrative
 */
export type BeatPattern =
  | 'shared'      // All participants experience together
  | 'parallel'    // Similar experiences at same time
  | 'sequential'  // One triggers another
  | 'echoing'     // Repeating across generations
  | 'polarized'   // Opposite experiences
  | 'cascading';  // Rippling through the network

// ============================================================================
// WOVEN CHAPTERS
// ============================================================================

/**
 * A chapter in the woven story
 */
export interface WovenStoryChapter {
  id: string;
  chapterNumber: number;

  // Title
  title: string;
  titleChinese: string;

  // Time span
  timeSpan: {
    start: string;
    end: string;
  };

  // Beats in this chapter
  beats: WovenStoryBeat[];

  // Chapter arc
  collectiveArc: CollectiveArc;
  collectiveArcChinese: string;

  // Emotional shift
  emotionalShift: {
    from: EmotionalTone;
    to: EmotionalTone;
    direction: 'ascending' | 'descending' | 'stable' | 'volatile';
    intensity: number;
  };

  // Key participants in this chapter
  protagonists: string[]; // IDs of main players

  // Themes
  themes: string[];
  themesChinese: string[];

  // Narrative
  narrative: string;
  foreshadowing?: string;
}

/**
 * Collective arc types
 */
export type CollectiveArc =
  | 'gathering'      // Coming together
  | 'ascending'      // Rising together
  | 'peak'           // Collective climax
  | 'descending'     // Settling together
  | 'dispersing'     // Moving apart
  | 'transforming'   // Collective metamorphosis
  | 'integrating'    // Becoming whole
  | 'differentiating'; // Becoming distinct

export const COLLECTIVE_ARC_CHINESE: Record<CollectiveArc, string> = {
  gathering: '聚集',
  ascending: '上升',
  peak: '顶峰',
  descending: '下降',
  dispersing: '离散',
  transforming: '蜕变',
  integrating: '整合',
  differentiating: '分化'
};

// ============================================================================
// WOVEN STORY
// ============================================================================

/**
 * The complete woven story
 */
export interface WovenStory {
  id: string;

  // Weaving mode
  mode: WeavingMode;
  modeChinese: string;

  // Title
  title: string;
  titleChinese: string;

  // Participants
  participants: WeavingParticipant[];
  participantCount: number;

  // Relationships
  edges: WeavingEdge[];

  // Chapters
  chapters: WovenStoryChapter[];

  // Time span
  timeSpan: {
    start: string;
    end: string;
    durationYears: number;
  };

  // Overarching themes
  overarchingThemes: WovenTheme[];

  // Systemic arc
  systemicArc: SystemicArc;

  // Prologue and epilogue
  prologue: string;
  epilogue: string;

  // Metadata
  metadata: {
    generatedAt: string;
    version: string;
  };
}

/**
 * A theme that spans the woven story
 */
export interface WovenTheme {
  id: string;
  theme: string;
  themeChinese: string;

  // How it manifests
  manifestations: Array<{
    participantId: string;
    expression: string;
  }>;

  // Generational pattern (for family/generational modes)
  generationalPattern?: {
    repeatsAcross: number[]; // generations
    evolutionDirection: 'intensifying' | 'resolving' | 'transforming';
  };

  // Emotional quality
  emotionalQuality: EmotionalTone;
}

/**
 * The overall systemic arc
 */
export interface SystemicArc {
  type: SystemicArcType;
  typeChinese: string;

  // Description
  summary: string;

  // Key turning points
  turningPoints: Array<{
    timestamp: string;
    description: string;
    participants: string[];
  }>;

  // Resolution status
  resolution: 'unfolding' | 'resolved' | 'transforming' | 'recurring';
}

export type SystemicArcType =
  | 'healing'        // System moving toward wholeness
  | 'expansion'      // System growing
  | 'contraction'    // System consolidating
  | 'transformation' // System metamorphosing
  | 'repetition'     // System repeating patterns
  | 'breakthrough'   // System breaking patterns
  | 'integration'    // System becoming coherent
  | 'differentiation'; // System becoming diverse

export const SYSTEMIC_ARC_TYPE_CHINESE: Record<SystemicArcType, string> = {
  healing: '疗愈',
  expansion: '扩展',
  contraction: '收缩',
  transformation: '蜕变',
  repetition: '重复',
  breakthrough: '突破',
  integration: '整合',
  differentiation: '分化'
};

// ============================================================================
// ENGINE INPUT/OUTPUT
// ============================================================================

/**
 * Input for the weaving engine
 */
export interface WeavingEngineInput {
  mode: WeavingMode;

  // Participants with their individual stories
  participants: WeavingParticipant[];

  // Relationship data
  relationships: WeavingEdge[];

  // Options
  options?: WeavingOptions;
}

export interface WeavingOptions {
  // Time range to weave
  timeRange?: {
    start: string;
    end: string;
  };

  // Narrative style
  narrativeStyle?: 'mythic' | 'romantic' | 'psychological' | 'cinematic' | 'poetic';

  // Focus participant (whose perspective to center)
  focusParticipantId?: string;

  // Depth of generational analysis
  generationalDepth?: number; // How many generations to include

  // Include environmental overlays
  includeEnvironmental?: boolean;

  // Language preference
  language?: 'en' | 'zh' | 'bilingual';
}

/**
 * Output from the weaving engine
 */
export interface WeavingEngineResult {
  success: boolean;
  story?: WovenStory;
  errors?: WeavingError[];
  warnings?: string[];
}

export interface WeavingError {
  code: string;
  message: string;
  participantId?: string;
}

// ============================================================================
// VISUALIZATION DATA
// ============================================================================

/**
 * Data for the network graph visualization
 */
export interface WeavingNetworkData {
  nodes: WeavingNetworkNode[];
  edges: WeavingNetworkEdge[];
}

export interface WeavingNetworkNode {
  id: string;
  label: string;
  labelChinese?: string;

  // Visual properties
  size: number;
  color: string;

  // Position (for fixed layouts)
  x?: number;
  y?: number;

  // Generation level (for hierarchical layouts)
  level?: number;

  // Metadata
  role: ParticipantRole;
  archetype?: string;
}

export interface WeavingNetworkEdge {
  id: string;
  source: string;
  target: string;

  // Visual properties
  weight: number;
  color: string;
  style: 'solid' | 'dashed' | 'dotted';

  // Label
  label?: string;
}

/**
 * Data for the collective timeline visualization
 */
export interface CollectiveTimelineData {
  // Time range
  timeRange: {
    start: string;
    end: string;
  };

  // Participant lanes
  lanes: Array<{
    participantId: string;
    participantName: string;
    beats: Array<{
      id: string;
      start: string;
      end: string;
      type: string;
      color: string;
    }>;
  }>;

  // Shared beats (spanning multiple lanes)
  sharedBeats: Array<{
    id: string;
    start: string;
    end: string;
    participants: string[];
    type: WovenBeatType;
    color: string;
  }>;

  // Chapter markers
  chapterMarkers: Array<{
    timestamp: string;
    chapterNumber: number;
    title: string;
  }>;
}

/**
 * Data for the generational ladder visualization
 */
export interface GenerationalLadderData {
  generations: Array<{
    level: number; // -2 to +2
    label: string;
    labelChinese: string;
    participants: Array<{
      id: string;
      name: string;
      position: number; // horizontal position
    }>;
  }>;

  // Vertical arcs connecting generations
  arcs: Array<{
    id: string;
    fromParticipant: string;
    toParticipant: string;
    theme: string;
    style: 'inheritance' | 'echo' | 'healing' | 'break';
  }>;
}
