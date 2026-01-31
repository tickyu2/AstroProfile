/**
 * ============================================================================
 * STORY DASHBOARD TYPES (故事仪表盘类型)
 * ============================================================================
 *
 * The rose window of the cathedral.
 * Data model for the unified narrative interface.
 *
 * This dashboard combines:
 * - Predictive Story Engine (beats, chapters, arcs)
 * - Timing Engine (destiny curves)
 * - Environmental Engine (Qi Men, Feng Shui)
 * - Lifecycle Engine (phases, transitions)
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  StoryBeat,
  StoryChapter,
  EmotionalTone,
  BeatType,
  ChapterArc
} from './storyTypes';

// ============================================================================
// EMOTIONAL ARC TYPES
// ============================================================================

/**
 * A point on the emotional arc
 */
export interface EmotionalArcPoint {
  /** Time (ISO date or year) */
  time: string;

  /** Emotional intensity value (0-100) */
  value: number;

  /** Emotional tone at this point */
  tone: EmotionalTone;

  /** Label for display */
  label?: string;
}

/**
 * Complete emotional arc data
 */
export interface EmotionalArcData {
  /** Points along the arc */
  points: EmotionalArcPoint[];

  /** Narrative summary */
  narrative: string;

  /** Chinese narrative */
  narrativeChinese: string;

  /** Overall emotional trajectory */
  trajectory: 'ascending' | 'descending' | 'stable' | 'volatile';

  /** Peak emotional moment */
  peak?: EmotionalArcPoint;

  /** Lowest emotional moment */
  nadir?: EmotionalArcPoint;
}

// ============================================================================
// TIMING CURVE TYPES
// ============================================================================

/**
 * A point on the timing/destiny curve
 */
export interface TimingCurvePoint {
  /** Time (ISO date or year) */
  time: string;

  /** Timing score (0-100) */
  score: number;

  /** Favorability */
  favorable: boolean;

  /** Associated life phase */
  phase?: string;

  /** Key events at this point */
  events?: string[];
}

/**
 * Complete timing curve data
 */
export interface TrajectoryCurve {
  /** Points along the curve */
  points: TimingCurvePoint[];

  /** Overall narrative */
  overallNarrative: string;

  /** Chinese narrative */
  overallNarrativeChinese: string;

  /** Peak timing window */
  peakWindow?: {
    start: string;
    end: string;
    score: number;
  };

  /** Caution periods */
  cautionPeriods?: Array<{
    start: string;
    end: string;
    reason: string;
  }>;

  /** Average score */
  averageScore: number;

  /** Trend direction */
  trend: 'improving' | 'declining' | 'steady' | 'cyclical';
}

// ============================================================================
// ENVIRONMENTAL OVERLAY TYPES
// ============================================================================

/**
 * Qi Men palace data for display
 */
export interface QiMenPalaceDisplay {
  /** Palace number (1-9) */
  number: number;

  /** Palace position */
  position: 'NW' | 'N' | 'NE' | 'W' | 'CENTER' | 'E' | 'SW' | 'S' | 'SE';

  /** Door in this palace */
  door: {
    name: string;
    nameChinese: string;
    nature: 'auspicious' | 'neutral' | 'inauspicious';
  };

  /** Star in this palace */
  star: {
    name: string;
    nameChinese: string;
    nature: 'auspicious' | 'neutral' | 'inauspicious';
  };

  /** Deity in this palace */
  deity?: {
    name: string;
    nameChinese: string;
  };

  /** Stem in this palace */
  stem?: {
    char: string;
    element: string;
  };

  /** Overall palace rating */
  rating: 'excellent' | 'good' | 'mixed' | 'caution' | 'challenging';

  /** Is this the key palace? */
  isKeyPalace: boolean;
}

/**
 * Feng Shui direction data for compass
 */
export interface FengShuiDirectionDisplay {
  /** Compass direction */
  direction: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

  /** Chinese direction name */
  directionChinese: string;

  /** Degree on compass */
  degree: number;

  /** Types of energy present */
  energies: Array<{
    type: 'nobleman' | 'wealth' | 'peachBlossom' | 'conflict' | 'sha' | 'grandDuke';
    strength: 'strong' | 'moderate' | 'weak';
    label: string;
    labelChinese: string;
  }>;

  /** Overall suitability */
  suitability: 'excellent' | 'good' | 'neutral' | 'caution' | 'avoid';

  /** Is this a best direction? */
  isBest: boolean;

  /** Is this an avoid direction? */
  isAvoid: boolean;
}

/**
 * Environmental snapshot for a time period
 */
export interface EnvironmentalSnapshot {
  /** Timestamp */
  timestamp: string;

  /** Overall environmental score */
  score: number;

  /** Environmental tier */
  tier: 'excellent' | 'good' | 'mixed' | 'caution' | 'challenging';

  /** Qi Men data */
  qiMen: {
    formation: string;
    formationChinese: string;
    rating: string;
    palaces: QiMenPalaceDisplay[];
  };

  /** Feng Shui data */
  fengShui: {
    directions: FengShuiDirectionDisplay[];
    bestDirections: string[];
    avoidDirections: string[];
  };

  /** Summary notes */
  notes: string[];
}

/**
 * Complete environmental overlay data
 */
export interface EnvironmentalOverlayData {
  /** Snapshots over time */
  snapshots: EnvironmentalSnapshot[];

  /** Summary narrative */
  summary: string;

  /** Chinese summary */
  summaryChinese: string;

  /** Current snapshot (most relevant) */
  current?: EnvironmentalSnapshot;

  /** Average environmental score */
  averageScore: number;
}

// ============================================================================
// DASHBOARD DATA MODEL
// ============================================================================

/**
 * Complete Story Dashboard payload
 */
export interface StoryDashboardData {
  /** Story beats */
  beats: StoryBeat[];

  /** Story chapters */
  chapters: StoryChapter[];

  /** Emotional arc data */
  emotionalArc: EmotionalArcData;

  /** Timing/destiny curve */
  timingCurve: TrajectoryCurve;

  /** Environmental overlay */
  environmental: EnvironmentalOverlayData;

  /** Current position in story */
  currentPosition: {
    chapter: number;
    beat: number;
    progress: number;
  };

  /** Story metadata */
  metadata: {
    title: string;
    titleChinese: string;
    arc: string;
    arcChinese: string;
    timeSpan: { start: string; end: string };
  };
}

// ============================================================================
// TIMELINE VISUALIZATION TYPES
// ============================================================================

/**
 * Timeline marker for beats
 */
export interface TimelineBeatMarker {
  id: string;
  position: number; // 0-100 percentage along timeline
  beatType: BeatType;
  emotionalTone: EmotionalTone;
  intensity: number;
  timeRange: { start: string; end: string };
  label: string;
  isCurrent: boolean;
}

/**
 * Timeline span for chapters
 */
export interface TimelineChapterSpan {
  id: string;
  startPosition: number;
  endPosition: number;
  chapterArc: ChapterArc;
  title: string;
  titleChinese: string;
  intensity: number;
  isCurrent: boolean;
}

/**
 * Complete timeline data
 */
export interface TimelineData {
  beats: TimelineBeatMarker[];
  chapters: TimelineChapterSpan[];
  currentPosition: number;
  timeRange: { start: string; end: string };
}

// ============================================================================
// INTERACTION TYPES
// ============================================================================

/**
 * Selection state for synchronized highlighting
 */
export interface DashboardSelection {
  /** Selected beat ID */
  beatId?: string;

  /** Selected chapter ID */
  chapterId?: string;

  /** Selected time point */
  timePoint?: string;

  /** Selected direction */
  direction?: string;

  /** Selected palace */
  palaceNumber?: number;
}

/**
 * Dashboard interaction callbacks
 */
export interface DashboardCallbacks {
  onBeatSelect?: (beat: StoryBeat) => void;
  onChapterSelect?: (chapter: StoryChapter) => void;
  onTimePointSelect?: (time: string) => void;
  onDirectionSelect?: (direction: string) => void;
  onPalaceSelect?: (palace: number) => void;
}

// ============================================================================
// STYLING TYPES
// ============================================================================

/**
 * Dashboard theme configuration
 */
export interface DashboardTheme {
  mode: 'light' | 'dark';

  colors: {
    // Beat type colors
    opening: string;
    rising: string;
    peak: string;
    conflict: string;
    turning: string;
    healing: string;
    integration: string;
    resolution: string;

    // Emotional tone colors
    hopeful: string;
    joyful: string;
    passionate: string;
    tender: string;
    reflective: string;
    challenging: string;
    transformative: string;
    peaceful: string;
    bittersweet: string;
    triumphant: string;

    // Environmental tier colors
    excellent: string;
    good: string;
    mixed: string;
    caution: string;
    challenging_env: string;

    // Base colors
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    accent: string;
    gold: string;
  };

  fonts: {
    heading: string;
    body: string;
    chinese: string;
  };
}

/**
 * Default cathedral theme
 */
export const CATHEDRAL_THEME: DashboardTheme = {
  mode: 'dark',
  colors: {
    // Beat types - ceremonial palette
    opening: '#60a5fa',    // Sky blue - new beginnings
    rising: '#34d399',     // Emerald - growth
    peak: '#fbbf24',       // Gold - climax
    conflict: '#f87171',   // Crimson - challenge
    turning: '#a78bfa',    // Purple - transformation
    healing: '#2dd4bf',    // Teal - restoration
    integration: '#818cf8', // Indigo - synthesis
    resolution: '#22c55e', // Green - completion

    // Emotional tones
    hopeful: '#60a5fa',
    joyful: '#fbbf24',
    passionate: '#f43f5e',
    tender: '#f9a8d4',
    reflective: '#94a3b8',
    challenging: '#ef4444',
    transformative: '#a855f7',
    peaceful: '#22d3ee',
    bittersweet: '#fb923c',
    triumphant: '#fbbf24',

    // Environmental tiers
    excellent: '#22c55e',
    good: '#3b82f6',
    mixed: '#a855f7',
    caution: '#f59e0b',
    challenging_env: '#ef4444',

    // Base colors - cathedral aesthetic
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    surface: 'rgba(30, 27, 75, 0.7)',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    border: 'rgba(255, 255, 255, 0.1)',
    accent: '#a855f7',
    gold: '#fbbf24'
  },
  fonts: {
    heading: "'Cinzel', serif",
    body: "'Inter', sans-serif",
    chinese: "'Noto Serif SC', serif"
  }
};
