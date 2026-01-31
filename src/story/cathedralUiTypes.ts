/**
 * ============================================================================
 * CATHEDRAL FRONTEND FRAMEWORK - TYPE DEFINITIONS (大教堂前端框架类型)
 * ============================================================================
 *
 * The façade of the cathedral.
 * The stained glass, the arches, the iconography.
 *
 * Component Taxonomy:
 * - Atoms (原子) - Icons, glyphs, badges
 * - Molecules (分子) - Cards, charts, panels
 * - Organisms (有机体) - Dashboards, views
 * - Layouts (布局) - Sacred geometry primitives
 *
 * This is the visual grammar of your metaphysics OS.
 *
 * Created: January 2026
 * ============================================================================
 */

import type { EmotionalTone, BeatType } from './storyTypes';
import type { LifecyclePhase, RitualType, QiMenDoor } from './ritualTypes';
import type { ActionType } from './actionTypes';

// ============================================================================
// COMPONENT CATEGORIES
// ============================================================================

export type ComponentCategory = 'atom' | 'molecule' | 'organism' | 'layout';

export const COMPONENT_CATEGORY_CHINESE: Record<ComponentCategory, string> = {
  atom: '原子组件',
  molecule: '分子组件',
  organism: '有机体组件',
  layout: '布局原语'
};

// ============================================================================
// THEME MODES
// ============================================================================

export type ThemeMode = 'light' | 'dark' | 'ceremonial';

export const THEME_MODE_CHINESE: Record<ThemeMode, string> = {
  light: '黎明',
  dark: '午夜',
  ceremonial: '仪式'
};

export const THEME_MODE_DESCRIPTIONS: Record<ThemeMode, {
  en: string;
  zh: string;
  palette: string[];
}> = {
  light: {
    en: 'Dawn - Ivory parchment, gold accents',
    zh: '黎明 - 象牙羊皮纸，金色点缀',
    palette: ['#fdfbf7', '#f5f0e6', '#1e1b4b', '#d4af37', '#8b7355']
  },
  dark: {
    en: 'Midnight - Obsidian, moonlit silver',
    zh: '午夜 - 黑曜石，月光银',
    palette: ['#0f0f1a', '#1a1a2e', '#e2e8f0', '#94a3b8', '#3b82f6']
  },
  ceremonial: {
    en: 'Ritual - Crimson, gold leaf, black marble',
    zh: '仪式 - 深红，金箔，黑色大理石',
    palette: ['#1a0a0a', '#2d1b1b', '#d4af37', '#dc2626', '#fbbf24']
  }
};

// ============================================================================
// ELEMENT COLORS & SYMBOLS
// ============================================================================

export type Element = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

export const ELEMENT_COLORS: Record<Element, {
  primary: string;
  light: string;
  dark: string;
  gradient: string;
}> = {
  Wood: {
    primary: '#22c55e',
    light: '#86efac',
    dark: '#166534',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #166534 100%)'
  },
  Fire: {
    primary: '#ef4444',
    light: '#fca5a5',
    dark: '#991b1b',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)'
  },
  Earth: {
    primary: '#f59e0b',
    light: '#fcd34d',
    dark: '#92400e',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #92400e 100%)'
  },
  Metal: {
    primary: '#94a3b8',
    light: '#e2e8f0',
    dark: '#475569',
    gradient: 'linear-gradient(135deg, #94a3b8 0%, #475569 100%)'
  },
  Water: {
    primary: '#3b82f6',
    light: '#93c5fd',
    dark: '#1e40af',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)'
  }
};

export const ELEMENT_SYMBOLS: Record<Element, {
  unicode: string;
  chinese: string;
  icon: string;
}> = {
  Wood: { unicode: '☴', chinese: '木', icon: '🌳' },
  Fire: { unicode: '☲', chinese: '火', icon: '🔥' },
  Earth: { unicode: '☷', chinese: '土', icon: '🌍' },
  Metal: { unicode: '☰', chinese: '金', icon: '⚔️' },
  Water: { unicode: '☵', chinese: '水', icon: '💧' }
};

// ============================================================================
// EMOTIONAL COLORS
// ============================================================================

export const EMOTIONAL_TONE_COLORS: Record<EmotionalTone, {
  primary: string;
  background: string;
  border: string;
}> = {
  hopeful: { primary: '#22c55e', background: '#f0fdf4', border: '#86efac' },
  tense: { primary: '#ef4444', background: '#fef2f2', border: '#fca5a5' },
  melancholic: { primary: '#6366f1', background: '#eef2ff', border: '#a5b4fc' },
  passionate: { primary: '#ec4899', background: '#fdf2f8', border: '#f9a8d4' },
  serene: { primary: '#06b6d4', background: '#ecfeff', border: '#67e8f9' },
  triumphant: { primary: '#f59e0b', background: '#fffbeb', border: '#fcd34d' },
  anxious: { primary: '#8b5cf6', background: '#f5f3ff', border: '#c4b5fd' },
  reflective: { primary: '#64748b', background: '#f8fafc', border: '#cbd5e1' },
  joyful: { primary: '#fbbf24', background: '#fefce8', border: '#fde047' },
  grieving: { primary: '#1e293b', background: '#f1f5f9', border: '#94a3b8' }
};

// ============================================================================
// BEAT TYPE COLORS
// ============================================================================

export const BEAT_TYPE_COLORS: Record<BeatType, {
  primary: string;
  icon: string;
}> = {
  inciting: { primary: '#ef4444', icon: '⚡' },
  rising: { primary: '#f59e0b', icon: '📈' },
  crisis: { primary: '#dc2626', icon: '🌋' },
  climax: { primary: '#7c3aed', icon: '🎭' },
  falling: { primary: '#3b82f6', icon: '📉' },
  resolution: { primary: '#22c55e', icon: '✨' },
  denouement: { primary: '#06b6d4', icon: '🌅' }
};

// ============================================================================
// LIFECYCLE PHASE COLORS
// ============================================================================

export const LIFECYCLE_PHASE_COLORS: Record<LifecyclePhase, {
  primary: string;
  secondary: string;
  icon: string;
}> = {
  Awakening: { primary: '#fbbf24', secondary: '#fef3c7', icon: '🌅' },
  Deepening: { primary: '#ec4899', secondary: '#fce7f3', icon: '💞' },
  Challenge: { primary: '#ef4444', secondary: '#fee2e2', icon: '⚔️' },
  Turning: { primary: '#8b5cf6', secondary: '#ede9fe', icon: '🔄' },
  Renewal: { primary: '#22c55e', secondary: '#dcfce7', icon: '🌱' },
  Integration: { primary: '#06b6d4', secondary: '#cffafe', icon: '🔗' },
  Completion: { primary: '#d4af37', secondary: '#fef9e7', icon: '👑' }
};

// ============================================================================
// ACTION TYPE COLORS
// ============================================================================

export const ACTION_UI_COLORS: Record<ActionType, {
  primary: string;
  background: string;
  icon: string;
  chinese: string;
}> = {
  initiate: { primary: '#ef4444', background: '#fef2f2', icon: '🚀', chinese: '启动' },
  deepen: { primary: '#f59e0b', background: '#fffbeb', icon: '💝', chinese: '深化' },
  heal: { primary: '#3b82f6', background: '#eff6ff', icon: '💙', chinese: '疗愈' },
  release: { primary: '#6b7280', background: '#f9fafb', icon: '🕊️', chinese: '放下' }
};

// ============================================================================
// RITUAL TYPE COLORS
// ============================================================================

export const RITUAL_UI_COLORS: Record<RitualType, {
  primary: string;
  icon: string;
}> = {
  deepConversation: { primary: '#8b5cf6', icon: '💬' },
  dateNight: { primary: '#ec4899', icon: '🌙' },
  conflictResolution: { primary: '#f59e0b', icon: '🤝' },
  intimacy: { primary: '#ef4444', icon: '❤️' },
  sharedCreation: { primary: '#22c55e', icon: '🎨' },
  silentPresence: { primary: '#06b6d4', icon: '🧘' },
  celebration: { primary: '#fbbf24', icon: '🎉' },
  renewal: { primary: '#10b981', icon: '🌸' }
};

// ============================================================================
// ATOMIC COMPONENT PROPS
// ============================================================================

/**
 * ElementIcon props
 */
export interface ElementIconProps {
  element: Element;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'filled' | 'outlined' | 'glyph';
  showLabel?: boolean;
  animated?: boolean;
}

/**
 * StemGlyph props
 */
export interface StemGlyphProps {
  stem: string;           // 甲乙丙丁戊己庚辛壬癸
  size?: 'sm' | 'md' | 'lg';
  showElement?: boolean;
  interactive?: boolean;
}

/**
 * BranchGlyph props
 */
export interface BranchGlyphProps {
  branch: string;         // 子丑寅卯辰巳午未申酉戌亥
  size?: 'sm' | 'md' | 'lg';
  showAnimal?: boolean;
  showElement?: boolean;
  interactive?: boolean;
}

/**
 * TenGodBadge props
 */
export interface TenGodBadgeProps {
  tenGod: string;         // 比劫印枭食伤财才官杀
  size?: 'sm' | 'md' | 'lg';
  showEnglish?: boolean;
  variant?: 'badge' | 'chip' | 'tag';
}

/**
 * ShenShaBadge props
 */
export interface ShenShaBadgeProps {
  shenSha: string;
  isAuspicious: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

/**
 * DirectionArrow props
 */
export interface DirectionArrowProps {
  direction: string;      // N NE E SE S SW W NW
  size?: 'sm' | 'md' | 'lg';
  quality?: 'excellent' | 'good' | 'neutral' | 'avoid';
  animated?: boolean;
}

/**
 * QiMenSymbol props
 */
export interface QiMenSymbolProps {
  door: QiMenDoor;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  interactive?: boolean;
}

/**
 * RitualGlyph props
 */
export interface RitualGlyphProps {
  ritual: RitualType;
  size?: 'sm' | 'md' | 'lg';
  tier?: 'golden' | 'silver' | 'bronze';
  animated?: boolean;
}

/**
 * BeatMarker props
 */
export interface BeatMarkerProps {
  beatType: BeatType;
  intensity?: number;     // 0-100
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * PhaseBadge props
 */
export interface PhaseBadgeProps {
  phase: LifecyclePhase;
  progress?: number;      // 0-100
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

/**
 * ArchetypeIcon props
 */
export interface ArchetypeIconProps {
  archetype: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'circle' | 'square' | 'hexagon';
}

// ============================================================================
// MOLECULAR COMPONENT PROPS
// ============================================================================

/**
 * InfoCard props
 */
export interface InfoCardProps {
  title: string;
  titleChinese?: string;
  subtitle?: string;
  value?: string | number;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

/**
 * ScoreCard props
 */
export interface ScoreCardProps {
  label: string;
  labelChinese?: string;
  score: number;          // 0-100
  tier?: 'excellent' | 'good' | 'neutral' | 'challenging';
  showTier?: boolean;
  showBar?: boolean;
  icon?: React.ReactNode;
}

/**
 * ElementBar props
 */
export interface ElementBarProps {
  distribution: Record<Element, number>;
  height?: number;
  showLabels?: boolean;
  showPercentages?: boolean;
  animated?: boolean;
}

/**
 * ElementDonut props
 */
export interface ElementDonutProps {
  distribution: Record<Element, number>;
  size?: number;
  innerRadius?: number;
  showLegend?: boolean;
  centerContent?: React.ReactNode;
}

/**
 * SynastryHeatmap props
 */
export interface SynastryHeatmapProps {
  personAName: string;
  personBName: string;
  pillars: Array<{
    pillarA: string;
    pillarB: string;
    score: number;
    relationship: string;
  }>;
  showLabels?: boolean;
  interactive?: boolean;
}

/**
 * DestinyCurveChart props
 */
export interface DestinyCurveChartProps {
  data: Array<{
    year: number;
    score: number;
    label?: string;
  }>;
  currentYear?: number;
  showMarkers?: boolean;
  showTooltip?: boolean;
  height?: number;
}

/**
 * EmotionalArcChartProps
 */
export interface EmotionalArcChartProps {
  data: Array<{
    date: string;
    tone: EmotionalTone;
    intensity: number;
  }>;
  height?: number;
  showLabels?: boolean;
  interactive?: boolean;
}

/**
 * QiMenGrid props
 */
export interface QiMenGridProps {
  palaces: Array<{
    position: number;     // 1-9
    door: QiMenDoor;
    star: string;
    deity: string;
    isActive?: boolean;
  }>;
  highlightPosition?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

/**
 * FengShuiCompass props
 */
export interface FengShuiCompassProps {
  directions: Array<{
    direction: string;
    degree: number;
    quality: 'excellent' | 'good' | 'neutral' | 'avoid';
    element?: Element;
  }>;
  highlightDirection?: string;
  size?: number;
  showLabels?: boolean;
}

/**
 * RitualWindowCard props
 */
export interface RitualWindowCardProps {
  ritual: RitualType;
  ritualChinese: string;
  tier: 'golden' | 'silver' | 'bronze';
  score: number;
  startTime: string;
  endTime: string;
  direction?: string;
  qiMenDoor?: QiMenDoor;
  onClick?: () => void;
}

/**
 * StoryBeatCard props
 */
export interface StoryBeatCardProps {
  beatType: BeatType;
  beatTypeChinese: string;
  emotionalTone: EmotionalTone;
  summary: string;
  startDate: string;
  endDate: string;
  intensity: number;
  scores?: {
    timing?: number;
    environmental?: number;
    event?: number;
  };
  onClick?: () => void;
}

/**
 * ChapterCard props
 */
export interface ChapterCardProps {
  chapterNumber: number;
  title: string;
  titleChinese?: string;
  arc: string;
  startDate: string;
  endDate: string;
  beatCount: number;
  emotionalShift: {
    from: EmotionalTone;
    to: EmotionalTone;
  };
  isCurrentChapter?: boolean;
  onClick?: () => void;
}

/**
 * SimulationBranchCard props
 */
export interface SimulationBranchCardProps {
  branchLabel: string;
  probability: number;
  predictedOutcome: string;
  isActual?: boolean;
  color?: string;
  onClick?: () => void;
}

/**
 * PatternCard props
 */
export interface PatternCardProps {
  patternName: string;
  patternNameChinese?: string;
  patternType: string;
  confidence: number;
  occurrences: number;
  lastOccurrence?: string;
  nextPredicted?: string;
  color?: string;
  onClick?: () => void;
}

// ============================================================================
// ORGANISM COMPONENT PROPS
// ============================================================================

/**
 * RelationshipOverviewPanel props
 */
export interface RelationshipOverviewPanelProps {
  personAName: string;
  personBName: string;
  synastryScore: number;
  compatibilityTier: string;
  dayMasterInteraction: string;
  elementBalance: Record<Element, number>;
  currentPhase: LifecyclePhase;
  phaseProgress: number;
}

/**
 * CompositeSummaryPanel props
 */
export interface CompositeSummaryPanelProps {
  compositeDayMaster: string;
  compositeElement: Element;
  usefulGod: string;
  annoyingGod: string;
  compositeTheme: string;
  elementDistribution: Record<Element, number>;
}

/**
 * LifecyclePanel props
 */
export interface LifecyclePanelProps {
  currentPhase: LifecyclePhase;
  progress: number;
  phases: Array<{
    phase: LifecyclePhase;
    startDate: string;
    endDate: string;
    isActive: boolean;
    isPast: boolean;
  }>;
  trajectory: 'rising' | 'falling' | 'stable';
}

/**
 * TimingPanel props
 */
export interface TimingPanelProps {
  currentScore: number;
  curveDirection: 'rising' | 'falling' | 'stable' | 'volatile';
  usefulGodActive: boolean;
  annoyingGodActive: boolean;
  dayOfficer: string;
  curveData: Array<{ date: string; score: number }>;
}

/**
 * EnvironmentalPanel props
 */
export interface EnvironmentalPanelProps {
  qiMenPalaces: QiMenGridProps['palaces'];
  fengShuiDirections: FengShuiCompassProps['directions'];
  bestDirection: string;
  dominantElement: Element;
  environmentalScore: number;
}

/**
 * RitualPanel props
 */
export interface RitualPanelProps {
  windows: Array<{
    ritual: RitualType;
    tier: 'golden' | 'silver' | 'bronze';
    score: number;
    startTime: string;
    endTime: string;
  }>;
  bestRitual: RitualType | null;
  bestWindow: { start: string; end: string } | null;
}

/**
 * StoryTimeline props
 */
export interface StoryTimelineProps {
  beats: Array<{
    id: string;
    beatType: BeatType;
    startDate: string;
    endDate: string;
    intensity: number;
  }>;
  chapters: Array<{
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    arc: string;
  }>;
  currentDate?: string;
  onBeatClick?: (beatId: string) => void;
  onChapterClick?: (chapterId: string) => void;
}

/**
 * StoryChapterView props
 */
export interface StoryChapterViewProps {
  chapter: ChapterCardProps;
  beats: StoryBeatCardProps[];
  narrative: string;
  onBeatClick?: (index: number) => void;
}

/**
 * SimulationComparisonView props
 */
export interface SimulationComparisonViewProps {
  baseline: {
    label: string;
    timeline: Array<{ date: string; score: number }>;
  };
  branches: Array<{
    label: string;
    probability: number;
    timeline: Array<{ date: string; score: number }>;
    color: string;
  }>;
  choiceDescription: string;
}

/**
 * MemoryVaultTimeline props
 */
export interface MemoryVaultTimelineProps {
  items: Array<{
    id: string;
    date: string;
    type: string;
    title: string;
    layer: string;
    intensity: number;
    verified: boolean;
    color: string;
  }>;
  patternMarkers: Array<{
    patternId: string;
    patternName: string;
    occurrenceDates: string[];
    color: string;
  }>;
  startDate: string;
  endDate: string;
  onItemClick?: (itemId: string) => void;
}

/**
 * KnowledgeGraphViewer props
 */
export interface KnowledgeGraphViewerProps {
  nodes: Array<{
    id: string;
    label: string;
    category: string;
    color: string;
    size: number;
  }>;
  edges: Array<{
    id: string;
    from: string;
    to: string;
    relation: string;
    color: string;
  }>;
  selectedNodeId?: string;
  onNodeClick?: (nodeId: string) => void;
  layout?: 'force' | 'tree' | 'radial';
}

// ============================================================================
// LAYOUT COMPONENT PROPS
// ============================================================================

/**
 * SacredGrid props
 */
export interface SacredGridProps {
  columns: 3 | 4 | 12;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * RadialLayout props
 */
export interface RadialLayoutProps {
  items: React.ReactNode[];
  centerContent?: React.ReactNode;
  radius?: number;
  startAngle?: number;
}

/**
 * MandalaLayout props
 */
export interface MandalaLayoutProps {
  layers: Array<{
    items: React.ReactNode[];
    radius: number;
  }>;
  centerContent?: React.ReactNode;
}

/**
 * TimelineLayout props
 */
export interface TimelineLayoutProps {
  items: Array<{
    date: string;
    content: React.ReactNode;
    marker?: React.ReactNode;
  }>;
  orientation?: 'horizontal' | 'vertical';
  showConnectors?: boolean;
}

/**
 * SplitPane props
 */
export interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  ratio?: number;          // 0-1, left pane ratio
  direction?: 'horizontal' | 'vertical';
  resizable?: boolean;
}

/**
 * CardGrid props
 */
export interface CardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

/**
 * SectionDivider props
 */
export interface SectionDividerProps {
  title?: string;
  titleChinese?: string;
  variant?: 'line' | 'ornate' | 'dots';
  color?: string;
}

// ============================================================================
// INTERACTION PATTERNS
// ============================================================================

export type InteractionPattern = 'hover-reveal' | 'click-expand' | 'zoom-focus' | 'sync-align';

export interface HoverRevealConfig {
  delay?: number;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export interface ClickExpandConfig {
  expandedContent: React.ReactNode;
  animation?: 'fade' | 'slide' | 'scale';
  duration?: number;
}

export interface ZoomFocusConfig {
  zoomLevel: number;
  focusContent: React.ReactNode;
  onZoom?: (level: number) => void;
}

export interface SyncAlignConfig {
  syncGroup: string;
  highlightOnSync?: boolean;
  onSync?: (sourceId: string) => void;
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export type DashboardType =
  | 'relationship'
  | 'story'
  | 'ritual'
  | 'simulation'
  | 'memory'
  | 'knowledge';

export const DASHBOARD_TYPE_CHINESE: Record<DashboardType, string> = {
  relationship: '关系仪表盘',
  story: '故事仪表盘',
  ritual: '仪式仪表盘',
  simulation: '模拟仪表盘',
  memory: '记忆宝库',
  knowledge: '知识图谱'
};

/**
 * Dashboard configuration
 */
export interface DashboardConfig {
  type: DashboardType;
  title: string;
  titleChinese: string;
  panels: Array<{
    id: string;
    component: string;
    position: { row: number; col: number; rowSpan?: number; colSpan?: number };
    props: Record<string, unknown>;
  }>;
  theme?: ThemeMode;
  layout?: 'grid' | 'flex' | 'tabs';
}

// ============================================================================
// ANIMATION TYPES
// ============================================================================

export type AnimationType =
  | 'fade'
  | 'slide'
  | 'scale'
  | 'rotate'
  | 'pulse'
  | 'glow'
  | 'shimmer';

export interface AnimationConfig {
  type: AnimationType;
  duration?: number;
  delay?: number;
  easing?: string;
  repeat?: boolean | number;
}

// ============================================================================
// RESPONSIVE BREAKPOINTS
// ============================================================================

export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// ============================================================================
// SPACING SCALE (Sacred Geometry)
// ============================================================================

export const SPACING = {
  0: '0',
  1: '0.25rem',     // 4px
  2: '0.5rem',      // 8px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  32: '8rem',       // 128px
  golden: '1.618rem' // Golden ratio
} as const;

export type SpacingKey = keyof typeof SPACING;

// ============================================================================
// TYPOGRAPHY SCALE
// ============================================================================

export const FONT_SIZES = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
  '6xl': '3.75rem'  // 60px
} as const;

export type FontSizeKey = keyof typeof FONT_SIZES;

export const FONT_WEIGHTS = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700
} as const;

// ============================================================================
// SHADOW SCALE
// ============================================================================

export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  ceremonial: '0 0 30px rgb(212 175 55 / 0.3)',
  glow: '0 0 20px rgb(59 130 246 / 0.5)'
} as const;

export type ShadowKey = keyof typeof SHADOWS;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const RADII = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
  circle: '50%'
} as const;

export type RadiusKey = keyof typeof RADII;

