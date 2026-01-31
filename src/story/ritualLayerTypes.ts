/**
 * Cathedral Ritual Layer Types (大教堂仪式层类型)
 *
 * The ceremonial interface — where the cathedral touches the human hand.
 * This is the sacred interaction model for pilgrims standing before the altar,
 * asking: What is the meaning of this moment?
 *
 * Four Chambers:
 * 1. Moment Chamber (时刻之室) - The meaning of now
 * 2. Day Chamber (日之室) - Daily ritual sequence
 * 3. Ceremony Chamber (仪式之室) - Guided rituals
 * 4. Journey Chamber (旅程之室) - Long arcs
 *
 * This layer sits on top of:
 * - Ritual Timing Engine
 * - Fate-to-Action Engine
 * - Predictive Story Engine
 * - Environmental Engine
 * - Timing Engine
 * - Analytics Engine
 */

// ============================================================================
// CORE RITUAL LAYER TYPES
// ============================================================================

/**
 * The four ritual archetypes (not to be confused with RitualType from ritualTypes)
 */
export type RitualArchetype = 'initiate' | 'deepen' | 'heal' | 'release';

/**
 * The four chambers of the ritual layer
 */
export type ChamberType = 'moment' | 'day' | 'ceremony' | 'journey';

/**
 * Cardinal and intercardinal directions
 */
export type CompassDirection =
  | 'north'
  | 'northeast'
  | 'east'
  | 'southeast'
  | 'south'
  | 'southwest'
  | 'west'
  | 'northwest'
  | 'center';

/**
 * Time of day phases
 */
export type DayPhase = 'morning' | 'afternoon' | 'evening' | 'night';

/**
 * Seasons of the year
 */
export type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter';

/**
 * Ceremony types for guided rituals
 */
export type GuidedCeremonyType = 'vow' | 'healing' | 'closure' | 'initiation';

/**
 * Ritual interaction step
 */
export type RitualInteractionStep = 'reveal' | 'align' | 'act' | 'integrate';

/**
 * Quality rating for timing windows
 */
export type TimingQuality = 'excellent' | 'good' | 'neutral' | 'challenging' | 'avoid';

// ============================================================================
// 🜁 1. MOMENT CHAMBER (时刻之室)
// ============================================================================

/**
 * A ritual glyph representing the archetype
 */
export interface RitualGlyph {
  archetype: RitualArchetype;
  symbol: string;            // Unicode or emoji glyph
  color: string;             // Hex color
  intensity: number;         // 0-1 glow intensity
  animation: 'pulse' | 'breathe' | 'shimmer' | 'steady';
}

/**
 * Directional guidance for the moment
 */
export interface DirectionalGuidance {
  auspiciousDirection: CompassDirection;
  directionDegrees: number;      // 0-360
  directionStrength: number;     // 0-1
  qiMenDoor: string;             // Active Qi Men door
  fengShuiSector: string;        // Active sector
  compassMessage: string;        // "Face North"
}

/**
 * Micro-timing window for precision ritual timing
 */
export interface MicroTimingWindow {
  start: Date;
  end: Date;
  quality: TimingQuality;
  durationMinutes: number;
  isActive: boolean;
  windowType: string;           // 'life_door' | 'nobleman' | 'star' etc.
  description: string;          // "Use the window between 10:45–11:00"
}

/**
 * Story alignment for the current moment
 */
export interface StoryBeatAlignment {
  currentBeat: string;           // The story beat name
  beatType: string;              // 'rising' | 'falling' | 'climax' | 'rest'
  emotionalTone: string;         // 'softness' | 'strength' | 'clarity' etc.
  storyMessage: string;          // "The story asks for softness"
  chapterId: string;
  arcId: string;
}

/**
 * The moment reading - essence of now
 */
export interface MomentReading {
  timestamp: Date;
  archetype: RitualArchetype;
  glyph: RitualGlyph;
  ceremonialMessage: string;     // "This is a HEALING moment"
  direction: DirectionalGuidance;
  microWindow: MicroTimingWindow;
  storyAlignment: StoryBeatAlignment;
  ritualName: string;            // "This is the ritual of presence"
  affirmation: string;           // Aligned affirmation
  energyDescription: string;     // Description of the moment's energy
}

/**
 * Moment card for UI display
 */
export interface MomentCard {
  reading: MomentReading;
  isGlowing: boolean;
  lastUpdated: Date;
  nextUpdate: Date;              // When the moment will shift
  transitionIn: number;          // Seconds until transition begins
}

// ============================================================================
// 🜂 2. DAY CHAMBER (日之室)
// ============================================================================

/**
 * A phase of the day with its ritual archetype
 */
export interface DailyPhaseReading {
  phase: DayPhase;
  archetype: RitualArchetype;
  timeRange: { start: string; end: string };  // "06:00" - "12:00"
  glyph: RitualGlyph;
  guidance: string;              // Short guidance text
  direction: CompassDirection;
  storyBeat: string;
}

/**
 * Environmental alignment for the day
 */
export interface DailyEnvironmentalAlignment {
  date: Date;
  qiMenChart: {
    lifeDoor: CompassDirection;
    openDoor: CompassDirection;
    restDoor: CompassDirection;
    deathDoor: CompassDirection;        // Direction to avoid
  };
  fengShuiEnergy: string;
  lunarPhase: string;
  solarTerm: string;
  elementOfDay: string;
}

/**
 * A ritual window during the day
 */
export interface DailyRitualWindow {
  id: string;
  start: Date;
  end: Date;
  archetype: RitualArchetype;
  quality: TimingQuality;
  purpose: string;               // "Best for initiating projects"
  direction: CompassDirection;
}

/**
 * Story beat marker on the daily timeline
 */
export interface DailyStoryBeatMarker {
  time: Date;
  beatName: string;
  beatType: string;
  emotionalValue: number;        // -1 to 1
  narrative: string;
}

/**
 * Full day ritual reading
 */
export interface DayReading {
  date: Date;
  phases: DailyPhaseReading[];
  environment: DailyEnvironmentalAlignment;
  ritualWindows: DailyRitualWindow[];
  storyBeats: DailyStoryBeatMarker[];
  dailyTheme: string;            // Overall theme of the day
  dailyRitualName: string;       // "This is the ritual of daily flow"
  primaryArchetype: RitualArchetype;
  secondaryArchetype: RitualArchetype;
}

/**
 * Ritual timeline for day chamber UI
 */
export interface RitualTimeline {
  reading: DayReading;
  currentPhaseIndex: number;
  currentWindowIndex: number;
  progressPercent: number;       // How far through the day
  nextTransition: Date;
}

// ============================================================================
// 🜃 3. CEREMONY CHAMBER (仪式之室)
// ============================================================================

/**
 * Breath pattern for ceremony
 */
export interface BreathPattern {
  name: string;                  // "grounding breath"
  inhaleSeconds: number;
  holdSeconds: number;
  exhaleSeconds: number;
  cycles: number;
  guidance: string;              // "Breathe slowly and deeply"
}

/**
 * Gesture or posture instruction
 */
export interface GesturePosture {
  name: string;                  // "hands together"
  description: string;
  imageUrl?: string;
  duration: string;              // "hold for the duration"
}

/**
 * Words or intention to speak
 */
export interface IntentionWords {
  template: string;              // "I release {what} and welcome {what}"
  placeholders: string[];        // Fields user fills in
  spokenAloud: boolean;
  timing: string;                // "during the Life Door window"
}

/**
 * A single step in a ceremony
 */
export interface CeremonyStep {
  id: string;
  order: number;
  title: string;
  type: 'direction' | 'breath' | 'gesture' | 'intention' | 'pause' | 'closing';
  direction?: CompassDirection;
  breath?: BreathPattern;
  gesture?: GesturePosture;
  intention?: IntentionWords;
  pauseSeconds?: number;
  instruction: string;
  isComplete: boolean;
}

/**
 * Ceremony timing alignment
 */
export interface CeremonyTimingAlignment {
  optimalStart: Date;
  optimalEnd: Date;
  quality: TimingQuality;
  window: MicroTimingWindow;
  direction: DirectionalGuidance;
  storyAlignment: StoryBeatAlignment;
}

/**
 * A complete ceremony
 */
export interface GuidedCeremony {
  id: string;
  type: GuidedCeremonyType;
  name: string;                  // "Vow Ritual"
  subtitle: string;              // "(Excellent Window)"
  description: string;
  archetype: RitualArchetype;
  steps: CeremonyStep[];
  timing: CeremonyTimingAlignment;
  durationMinutes: number;
  ritualName: string;            // "This is the ritual of transformation"
  prerequisites: string[];       // Things to prepare
  aftercare: string[];           // Post-ceremony guidance
}

/**
 * Active ceremony state
 */
export interface ActiveCeremony {
  ceremony: GuidedCeremony;
  startedAt: Date;
  currentStepIndex: number;
  completedSteps: string[];
  isPaused: boolean;
  pausedAt?: Date;
  userIntentions: Record<string, string>;  // Filled placeholders
}

/**
 * Ceremony result/completion
 */
export interface CeremonyCompletion {
  ceremonyId: string;
  completedAt: Date;
  durationActual: number;
  stepsCompleted: number;
  stepsTotal: number;
  userIntentions: Record<string, string>;
  timing: {
    quality: TimingQuality;
    withinOptimalWindow: boolean;
  };
  integration: string;           // How this fits the larger story
}

// ============================================================================
// 🜄 4. JOURNEY CHAMBER (旅程之室)
// ============================================================================

/**
 * Monthly timing reading
 */
export interface MonthlyReading {
  month: number;                 // 1-12
  year: number;
  archetype: RitualArchetype;
  theme: string;
  keyDates: { date: Date; significance: string }[];
  ritualWindows: { start: Date; end: Date; purpose: string }[];
  storyChapter: string;
  guidance: string;
}

/**
 * Seasonal arc reading
 */
export interface SeasonalArc {
  season: SeasonType;
  year: number;
  archetype: RitualArchetype;
  theme: string;                 // "Awakening" / "Expansion" / "Turning" / "Integration"
  startDate: Date;
  endDate: Date;
  keyMoments: { date: Date; description: string }[];
  storyArc: string;
  ritualFocus: string;
  elementalEnergy: string;
}

/**
 * Annual chapter reading
 */
export interface AnnualChapter {
  year: number;
  primaryArchetype: RitualArchetype;
  secondaryArchetype: RitualArchetype;
  theme: string;
  seasons: SeasonalArc[];
  majorTurningPoints: TurningPointMarker[];
  destinyKeywords: string[];
  annualRitualName: string;
}

/**
 * A turning point marker
 */
export interface TurningPointMarker {
  id: string;
  date: Date;
  type: 'initiation' | 'crisis' | 'revelation' | 'resolution' | 'integration';
  intensity: number;             // 0-1
  description: string;
  archetype: RitualArchetype;
  storySignificance: string;
}

/**
 * Healing cycle reading
 */
export interface HealingCycle {
  id: string;
  startDate: Date;
  endDate: Date;
  phase: 'recognition' | 'processing' | 'releasing' | 'integrating' | 'complete';
  theme: string;
  currentProgress: number;       // 0-1
  ritualWindows: { date: Date; purpose: string }[];
  guidance: string;
}

/**
 * Renewal cycle reading
 */
export interface RenewalCycle {
  id: string;
  startDate: Date;
  endDate: Date;
  phase: 'death' | 'void' | 'germination' | 'emergence' | 'bloom';
  theme: string;
  currentProgress: number;
  ritualWindows: { date: Date; purpose: string }[];
  guidance: string;
}

/**
 * Full journey reading
 */
export interface JourneyReading {
  generatedAt: Date;
  currentMonth: MonthlyReading;
  currentSeason: SeasonalArc;
  currentYear: AnnualChapter;
  upcomingTurningPoints: TurningPointMarker[];
  activeHealingCycles: HealingCycle[];
  activeRenewalCycles: RenewalCycle[];
  destinyArc: {
    pastTheme: string;
    presentTheme: string;
    futureTheme: string;
  };
  journeyRitualName: string;     // "This is the ritual of long-form destiny"
}

/**
 * Seasonal mandala for visualization
 */
export interface SeasonalMandala {
  year: number;
  seasons: {
    season: SeasonType;
    archetype: RitualArchetype;
    color: string;
    intensity: number;
    isActive: boolean;
  }[];
  centerSymbol: string;
  rotation: number;              // Current rotation in degrees
}

/**
 * Chapter wheel for visualization
 */
export interface ChapterWheel {
  chapters: {
    id: string;
    name: string;
    archetype: RitualArchetype;
    startAngle: number;
    endAngle: number;
    isCurrent: boolean;
    isComplete: boolean;
  }[];
  currentAngle: number;
  totalChapters: number;
}

/**
 * Destiny curve for visualization
 */
export interface DestinyCurve {
  points: {
    date: Date;
    value: number;               // -1 to 1 (challenge to opportunity)
    label?: string;
  }[];
  currentPosition: number;       // Index in points
  trend: 'ascending' | 'descending' | 'plateau' | 'volatile';
  nextPeak?: Date;
  nextValley?: Date;
}

// ============================================================================
// SANCTUARY UI (圣殿界面)
// ============================================================================

/**
 * Moment card state
 */
export interface MomentCardState {
  card: MomentCard;
  isExpanded: boolean;
  showDetails: boolean;
  animationPhase: 'entering' | 'present' | 'exiting';
}

/**
 * Ritual compass state
 */
export interface RitualCompassState {
  currentDirection: CompassDirection;
  targetDirection: CompassDirection;
  rotation: number;
  isAnimating: boolean;
  showQiMen: boolean;
  showFengShui: boolean;
}

/**
 * Micro-timing window display state
 */
export interface MicroTimingWindowState {
  windows: MicroTimingWindow[];
  activeWindowIndex: number;
  showCountdown: boolean;
  countdownSeconds: number;
}

/**
 * Archetype card display state
 */
export interface ArchetypeCardState {
  archetype: RitualArchetype;
  glyph: RitualGlyph;
  isActive: boolean;
  isHovered: boolean;
  message: string;
}

/**
 * Ceremony guide display state
 */
export interface CeremonyGuideState {
  availableCeremonies: GuidedCeremony[];
  activeCeremony: ActiveCeremony | null;
  completedCeremonies: CeremonyCompletion[];
  showStepDetails: boolean;
}

/**
 * Story alignment panel state
 */
export interface StoryAlignmentPanelState {
  currentAlignment: StoryBeatAlignment;
  showFullArc: boolean;
  arcVisualization: 'linear' | 'circular' | 'wave';
  highlightedBeat: string | null;
}

/**
 * Seasonal mandala display state
 */
export interface SeasonalMandalaState {
  mandala: SeasonalMandala;
  isAnimating: boolean;
  selectedSeason: SeasonType | null;
  showLabels: boolean;
}

/**
 * The Sanctuary - complete UI state
 */
export interface SanctuaryState {
  activeChamber: ChamberType;
  momentCard: MomentCardState;
  compass: RitualCompassState;
  microTiming: MicroTimingWindowState;
  archetypeCards: ArchetypeCardState[];
  ceremonyGuide: CeremonyGuideState;
  storyPanel: StoryAlignmentPanelState;
  mandala: SeasonalMandalaState;
  chapterWheel: ChapterWheel | null;
  destinyCurve: DestinyCurve | null;
  isFullscreen: boolean;
  ambientMode: boolean;          // Reduced UI, focus on essence
}

// ============================================================================
// RITUAL LAYER STATE
// ============================================================================

/**
 * Ritual layer configuration
 */
export interface RitualLayerConfig {
  updateIntervalMs: number;
  transitionDurationMs: number;
  showMicroTiming: boolean;
  showQiMen: boolean;
  showFengShui: boolean;
  showStoryAlignment: boolean;
  ambientModeTimeout: number;
  defaultChamber: ChamberType;
}

/**
 * Ritual layer event types
 */
export type RitualLayerEventType =
  | 'moment_shift'
  | 'phase_change'
  | 'window_open'
  | 'window_close'
  | 'ceremony_start'
  | 'ceremony_step'
  | 'ceremony_complete'
  | 'turning_point'
  | 'season_change'
  | 'archetype_shift';

/**
 * A ritual layer event
 */
export interface RitualLayerEvent {
  id: string;
  type: RitualLayerEventType;
  timestamp: Date;
  chamber: ChamberType;
  data: Record<string, unknown>;
  acknowledged: boolean;
}

/**
 * Complete ritual layer state
 */
export interface RitualLayerState {
  initialized: boolean;
  config: RitualLayerConfig;
  sanctuary: SanctuaryState;
  currentMoment: MomentReading | null;
  currentDay: DayReading | null;
  currentJourney: JourneyReading | null;
  activeCeremony: ActiveCeremony | null;
  recentEvents: RitualLayerEvent[];
  eventListeners: Map<RitualLayerEventType, ((event: RitualLayerEvent) => void)[]>;
  lastUpdated: Date;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Chinese translations for ritual archetypes
 */
export const ARCHETYPE_CHINESE: Record<RitualArchetype, string> = {
  initiate: '启动',
  deepen: '深化',
  heal: '愈合',
  release: '释放',
};

/**
 * Archetype descriptions
 */
export const ARCHETYPE_DESCRIPTIONS: Record<RitualArchetype, string> = {
  initiate: 'Begin something new. Plant seeds. Take first steps.',
  deepen: 'Go deeper. Strengthen roots. Build foundations.',
  heal: 'Restore balance. Mend wounds. Find wholeness.',
  release: 'Let go. Complete cycles. Create space for new.',
};

/**
 * Archetype symbols
 */
export const ARCHETYPE_SYMBOLS: Record<RitualArchetype, string> = {
  initiate: '☉',    // Sun - new beginnings
  deepen: '☽',      // Moon - going inward
  heal: '♡',        // Heart - restoration
  release: '☯',     // Yin-Yang - transformation
};

/**
 * Archetype colors
 */
export const ARCHETYPE_COLORS: Record<RitualArchetype, string> = {
  initiate: '#FFD700',   // Gold
  deepen: '#4169E1',     // Royal Blue
  heal: '#98FB98',       // Pale Green
  release: '#DDA0DD',    // Plum
};

/**
 * Chinese translations for chambers
 */
export const CHAMBER_CHINESE: Record<ChamberType, string> = {
  moment: '时刻之室',
  day: '日之室',
  ceremony: '仪式之室',
  journey: '旅程之室',
};

/**
 * Chamber descriptions
 */
export const CHAMBER_DESCRIPTIONS: Record<ChamberType, string> = {
  moment: 'Reveal the meaning of now.',
  day: 'Guide the daily ritual sequence.',
  ceremony: 'Perform guided rituals.',
  journey: 'Navigate long-form destiny.',
};

/**
 * Chinese translations for directions
 */
export const DIRECTION_CHINESE: Record<CompassDirection, string> = {
  north: '北',
  northeast: '东北',
  east: '东',
  southeast: '东南',
  south: '南',
  southwest: '西南',
  west: '西',
  northwest: '西北',
  center: '中',
};

/**
 * Direction degrees
 */
export const DIRECTION_DEGREES: Record<CompassDirection, number> = {
  north: 0,
  northeast: 45,
  east: 90,
  southeast: 135,
  south: 180,
  southwest: 225,
  west: 270,
  northwest: 315,
  center: 0,
};

/**
 * Chinese translations for day phases
 */
export const DAY_PHASE_CHINESE: Record<DayPhase, string> = {
  morning: '晨',
  afternoon: '午',
  evening: '暮',
  night: '夜',
};

/**
 * Day phase time ranges
 */
export const DAY_PHASE_TIMES: Record<DayPhase, { start: string; end: string }> = {
  morning: { start: '06:00', end: '12:00' },
  afternoon: { start: '12:00', end: '18:00' },
  evening: { start: '18:00', end: '22:00' },
  night: { start: '22:00', end: '06:00' },
};

/**
 * Chinese translations for seasons
 */
export const SEASON_CHINESE: Record<SeasonType, string> = {
  spring: '春',
  summer: '夏',
  autumn: '秋',
  winter: '冬',
};

/**
 * Season themes
 */
export const SEASON_THEMES: Record<SeasonType, string> = {
  spring: 'Awakening',
  summer: 'Expansion',
  autumn: 'Turning',
  winter: 'Integration',
};

/**
 * Season colors
 */
export const SEASON_COLORS: Record<SeasonType, string> = {
  spring: '#90EE90',     // Light green
  summer: '#FFD700',     // Gold
  autumn: '#CD853F',     // Peru/brown
  winter: '#87CEEB',     // Sky blue
};

/**
 * Chinese translations for ceremony types
 */
export const CEREMONY_TYPE_CHINESE: Record<GuidedCeremonyType, string> = {
  vow: '誓约仪式',
  healing: '疗愈仪式',
  closure: '结业仪式',
  initiation: '启蒙仪式',
};

/**
 * Ceremony type descriptions
 */
export const CEREMONY_TYPE_DESCRIPTIONS: Record<GuidedCeremonyType, string> = {
  vow: 'A ritual of commitment, union, and sacred promise.',
  healing: 'A ritual of restoration, forgiveness, and wholeness.',
  closure: 'A ritual of release, completion, and honoring what was.',
  initiation: 'A ritual of beginning, threshold-crossing, and new identity.',
};

/**
 * Chinese translations for timing quality
 */
export const TIMING_QUALITY_CHINESE: Record<TimingQuality, string> = {
  excellent: '极佳',
  good: '良好',
  neutral: '中性',
  challenging: '挑战',
  avoid: '回避',
};

/**
 * Timing quality colors
 */
export const TIMING_QUALITY_COLORS: Record<TimingQuality, string> = {
  excellent: '#00FF00',
  good: '#90EE90',
  neutral: '#FFD700',
  challenging: '#FFA500',
  avoid: '#FF0000',
};

/**
 * Chinese translations for interaction steps
 */
export const INTERACTION_STEP_CHINESE: Record<RitualInteractionStep, string> = {
  reveal: '揭示',
  align: '对齐',
  act: '行动',
  integrate: '整合',
};

/**
 * Interaction step descriptions
 */
export const INTERACTION_STEP_DESCRIPTIONS: Record<RitualInteractionStep, string> = {
  reveal: 'Show the meaning of the moment.',
  align: 'Show how to align with timing, direction, and story.',
  act: 'Guide the user through a ritual or action.',
  integrate: 'Show how the ritual fits into the larger story.',
};

/**
 * Default ritual layer configuration
 */
export const DEFAULT_RITUAL_LAYER_CONFIG: RitualLayerConfig = {
  updateIntervalMs: 60000,        // Update every minute
  transitionDurationMs: 2000,     // 2 second transitions
  showMicroTiming: true,
  showQiMen: true,
  showFengShui: true,
  showStoryAlignment: true,
  ambientModeTimeout: 300000,     // 5 minutes to ambient mode
  defaultChamber: 'moment',
};

/**
 * Default glyph for each archetype
 */
export const DEFAULT_ARCHETYPE_GLYPHS: Record<RitualArchetype, RitualGlyph> = {
  initiate: {
    archetype: 'initiate',
    symbol: '☉',
    color: '#FFD700',
    intensity: 0.8,
    animation: 'pulse',
  },
  deepen: {
    archetype: 'deepen',
    symbol: '☽',
    color: '#4169E1',
    intensity: 0.6,
    animation: 'breathe',
  },
  heal: {
    archetype: 'heal',
    symbol: '♡',
    color: '#98FB98',
    intensity: 0.7,
    animation: 'shimmer',
  },
  release: {
    archetype: 'release',
    symbol: '☯',
    color: '#DDA0DD',
    intensity: 0.5,
    animation: 'steady',
  },
};
