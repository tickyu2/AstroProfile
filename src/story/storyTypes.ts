/**
 * ============================================================================
 * PREDICTIVE STORY ENGINE TYPES (叙事预测引擎)
 * ============================================================================
 *
 * The stained-glass window of the cathedral.
 * Transforms pure structure into living myth.
 *
 * Three Layers:
 * - Beat Layer (情节节点层) - Individual timing moments
 * - Arc Layer (故事弧线层) - Grouped chapter progressions
 * - Narrative Layer (叙事层) - Mythic storytelling
 *
 * This is not fiction. It is narrative-shaped interpretation
 * of real metaphysical signals.
 *
 * Created: January 2026
 * ============================================================================
 */

// ============================================================================
// BEAT TYPES (情节节点)
// ============================================================================

/**
 * Story beat classifications
 * Each timing window becomes one of these narrative moments
 */
export type BeatType =
  | 'opening'      // 开场 - Beginning, setting the stage
  | 'rising'       // 上升 - Building momentum
  | 'peak'         // 高峰 - Climax, breakthrough moment
  | 'conflict'     // 冲突 - Challenge, tension
  | 'turning'      // 转折 - Pivot point, change of direction
  | 'healing'      // 修复 - Recovery, integration
  | 'integration'  // 整合 - Synthesis, deepening
  | 'resolution';  // 结局 - Completion, closure

/**
 * Emotional tone for beats and chapters
 */
export type EmotionalTone =
  | 'hopeful'      // 希望
  | 'joyful'       // 喜悦
  | 'passionate'   // 热烈
  | 'tender'       // 温柔
  | 'reflective'   // 沉思
  | 'challenging'  // 挑战
  | 'transformative' // 蜕变
  | 'peaceful'     // 平和
  | 'bittersweet'  // 苦乐参半
  | 'triumphant';  // 胜利

/**
 * Story beat - a single narrative moment
 */
export interface StoryBeat {
  /** Unique identifier */
  id: string;

  /** Time range this beat covers */
  timeRange: {
    start: string;  // ISO date
    end: string;    // ISO date
  };

  /** Classification of this narrative moment */
  beatType: BeatType;

  /** Scores from source engines */
  timingScore: number;
  environmentalScore: number;
  eventScore: number;

  /** Current lifecycle phase */
  lifecyclePhase: string;

  /** Emotional coloring */
  emotionalTone: EmotionalTone;

  /** Brief summary of this beat */
  summary: string;

  /** Chinese summary */
  summaryChinese: string;

  /** Key events or triggers in this beat */
  keyEvents: string[];

  /** Intensity level (0-100) */
  intensity: number;
}

// ============================================================================
// CHAPTER TYPES (章节)
// ============================================================================

/**
 * Chapter arc types - the shape of each chapter's journey
 */
export type ChapterArc =
  | 'awakening'    // 觉醒 - Discovery, new beginnings
  | 'deepening'    // 深化 - Growing intimacy
  | 'challenge'    // 挑战 - Tests and trials
  | 'turningPoint' // 转折点 - Pivotal change
  | 'renewal'      // 更新 - Fresh start
  | 'maturation'   // 成熟 - Wisdom gained
  | 'expansion'    // 扩展 - Growth outward
  | 'integration'  // 整合 - Coming together
  | 'resolution';  // 解决 - Completion

/**
 * Emotional shift within a chapter
 */
export interface EmotionalShift {
  /** Starting emotional tone */
  from: EmotionalTone;

  /** Ending emotional tone */
  to: EmotionalTone;

  /** Description of the shift */
  description: string;

  /** Chinese description */
  descriptionChinese: string;
}

/**
 * Story chapter - a collection of beats forming an arc
 */
export interface StoryChapter {
  /** Unique identifier */
  id: string;

  /** Chapter number */
  number: number;

  /** Chapter title */
  title: string;

  /** Chinese title */
  titleChinese: string;

  /** Beats contained in this chapter */
  beats: StoryBeat[];

  /** The arc shape of this chapter */
  chapterArc: ChapterArc;

  /** How emotions shift through this chapter */
  emotionalShift: EmotionalShift;

  /** Full narrative text */
  narrative: string;

  /** Chinese narrative */
  narrativeChinese: string;

  /** Time span this chapter covers */
  timeSpan: {
    start: string;
    end: string;
  };

  /** Overall intensity of this chapter (0-100) */
  intensity: number;

  /** Key themes in this chapter */
  themes: string[];

  /** Foreshadowing for future chapters */
  foreshadowing: string[];
}

// ============================================================================
// STORY TYPES (完整故事)
// ============================================================================

/**
 * Overall story arc - the meta-shape of the entire narrative
 */
export type OverallArc =
  | 'heroJourney'      // 英雄之旅 - Classic transformation
  | 'loveStory'        // 爱情故事 - Romance arc
  | 'redemption'       // 救赎 - Fall and rise
  | 'coming_of_age'    // 成长 - Maturation
  | 'odyssey'          // 奥德赛 - Long journey home
  | 'phoenix'          // 凤凰 - Death and rebirth
  | 'steadyClimb'      // 稳步攀升 - Gradual ascent
  | 'wavePattern'      // 波浪形态 - Cycles of rise and fall
  | 'spiral';          // 螺旋 - Returning themes at higher levels

/**
 * Complete predictive story
 */
export interface PredictiveStory {
  /** All chapters in sequence */
  chapters: StoryChapter[];

  /** The overall arc shape */
  overallArc: OverallArc;

  /** Chinese arc name */
  overallArcChinese: string;

  /** Major themes across the story */
  themes: string[];

  /** Chinese themes */
  themesChinese: string[];

  /** Story title */
  title: string;

  /** Chinese title */
  titleChinese: string;

  /** Opening narrative (prologue) */
  prologue: string;

  /** Chinese prologue */
  prologueChinese: string;

  /** Closing vision (epilogue) */
  epilogue: string;

  /** Chinese epilogue */
  epilogueChinese: string;

  /** Total time span covered */
  timeSpan: {
    start: string;
    end: string;
  };

  /** Current position in the story */
  currentChapter: number;

  /** Current beat within current chapter */
  currentBeat: number;

  /** Percentage through the story (0-100) */
  progress: number;
}

// ============================================================================
// INPUT TYPES (输入数据)
// ============================================================================

/**
 * Timing window from Timing Engine
 */
export interface TimingWindow {
  year: number;
  month?: number;
  score: number;
  favorable: boolean;
  description: string;
  events: string[];
}

/**
 * Environmental snapshot from Environmental Engine
 */
export interface EnvironmentalContext {
  environmentalScore: number;
  tier: 'excellent' | 'good' | 'mixed' | 'caution' | 'challenging';
  bestDirections: string[];
  avoidDirections: string[];
  notes: string[];
}

/**
 * Lifecycle phase from Lifecycle Engine
 */
export interface LifecycleContext {
  phase: string;
  phaseChinese: string;
  year: number;
  intensity: number;
  description: string;
}

/**
 * Event triggers from Event Trigger Engine
 */
export interface EventTriggerContext {
  triggers: Array<{
    type: string;
    intensity: number;
    description: string;
  }>;
  overallActivation: number;
}

/**
 * Complete input for story generation
 */
export interface StoryEngineInput {
  /** Timing windows (usually 10 years of DaYun or annual) */
  timing: TimingWindow[];

  /** Environmental context for each period */
  environment: EnvironmentalContext;

  /** Current lifecycle phase */
  lifecycle: LifecycleContext;

  /** Event triggers */
  events: EventTriggerContext;

  /** Relationship archetype */
  archetype?: string;

  /** Life themes */
  lifeThemes?: string[];

  /** Destiny trajectory score */
  destinyScore?: number;

  /** User's preferred narrative style */
  narrativeStyle?: 'mythic' | 'emotional' | 'poetic' | 'practical';
}

// ============================================================================
// OUTPUT TYPES (输出数据)
// ============================================================================

/**
 * Story generation result
 */
export interface StoryResult {
  success: true;
  data: PredictiveStory;
}

/**
 * Story generation error
 */
export interface StoryError {
  success: false;
  error: string;
}

/**
 * Combined result type
 */
export type StoryEngineResult = StoryResult | StoryError;

// ============================================================================
// NARRATIVE STYLE CONFIGURATION
// ============================================================================

/**
 * Narrative style settings
 */
export interface NarrativeStyle {
  /** Style name */
  name: 'mythic' | 'emotional' | 'poetic' | 'practical';

  /** Use metaphors and archetypes */
  useMetaphors: boolean;

  /** Include Chinese characters */
  includeChinese: boolean;

  /** Emotional depth (0-100) */
  emotionalDepth: number;

  /** Sentence length preference */
  sentenceLength: 'short' | 'medium' | 'long';

  /** Voice (first, second, third person) */
  voice: 'first' | 'second' | 'third';
}

/**
 * Default narrative styles
 */
export const NARRATIVE_STYLES: Record<string, NarrativeStyle> = {
  mythic: {
    name: 'mythic',
    useMetaphors: true,
    includeChinese: true,
    emotionalDepth: 80,
    sentenceLength: 'long',
    voice: 'third'
  },
  emotional: {
    name: 'emotional',
    useMetaphors: true,
    includeChinese: false,
    emotionalDepth: 100,
    sentenceLength: 'medium',
    voice: 'second'
  },
  poetic: {
    name: 'poetic',
    useMetaphors: true,
    includeChinese: true,
    emotionalDepth: 90,
    sentenceLength: 'short',
    voice: 'third'
  },
  practical: {
    name: 'practical',
    useMetaphors: false,
    includeChinese: false,
    emotionalDepth: 40,
    sentenceLength: 'short',
    voice: 'second'
  }
};
