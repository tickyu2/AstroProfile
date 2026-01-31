/**
 * ============================================================================
 * CATHEDRAL PILGRIM JOURNEY TYPES (大教堂朝圣之旅类型)
 * ============================================================================
 *
 * A guided initiation through the cathedral's living chambers.
 *
 * This is not a tutorial. This is not onboarding. This is not a walkthrough.
 * This is a mythic initiation path, a guided traversal through the cathedral's
 * chambers in the order a pilgrim's soul naturally awakens.
 *
 * Nine Movements:
 * I.   The Gate of Silence (寂静之门)
 * II.  The Hall of Foundations (基石之殿)
 * III. The Chamber of Flow (流动之室)
 * IV.  The Sanctuary of the Moment (时刻圣殿)
 * V.   The Hall of Stories (故事之殿)
 * VI.  The Ritual Cloister (仪式回廊)
 * VII. The Vault of Echoes (回响宝库)
 * VIII.The Observatory of Futures (未来天文台)
 * IX.  The Inner Altar (内在祭坛)
 *
 * Created: January 2026
 * ============================================================================
 */

// ============================================================================
// THE NINE MOVEMENTS
// ============================================================================

/**
 * The nine movements of the pilgrim journey
 */
export type JourneyMovement =
  | 'gate_of_silence'        // I. 寂静之门
  | 'hall_of_foundations'    // II. 基石之殿
  | 'chamber_of_flow'        // III. 流动之室
  | 'sanctuary_of_moment'    // IV. 时刻圣殿
  | 'hall_of_stories'        // V. 故事之殿
  | 'ritual_cloister'        // VI. 仪式回廊
  | 'vault_of_echoes'        // VII. 回响宝库
  | 'observatory_of_futures' // VIII. 未来天文台
  | 'inner_altar';           // IX. 内在祭坛

/**
 * Roman numerals for movements
 */
export const MOVEMENT_NUMERALS: Record<JourneyMovement, string> = {
  gate_of_silence: 'I',
  hall_of_foundations: 'II',
  chamber_of_flow: 'III',
  sanctuary_of_moment: 'IV',
  hall_of_stories: 'V',
  ritual_cloister: 'VI',
  vault_of_echoes: 'VII',
  observatory_of_futures: 'VIII',
  inner_altar: 'IX',
};

/**
 * Movement names in English
 */
export const MOVEMENT_NAMES: Record<JourneyMovement, string> = {
  gate_of_silence: 'The Gate of Silence',
  hall_of_foundations: 'The Hall of Foundations',
  chamber_of_flow: 'The Chamber of Flow',
  sanctuary_of_moment: 'The Sanctuary of the Moment',
  hall_of_stories: 'The Hall of Stories',
  ritual_cloister: 'The Ritual Cloister',
  vault_of_echoes: 'The Vault of Echoes',
  observatory_of_futures: 'The Observatory of Futures',
  inner_altar: 'The Inner Altar',
};

/**
 * Movement names in Chinese
 */
export const MOVEMENT_CHINESE: Record<JourneyMovement, string> = {
  gate_of_silence: '寂静之门',
  hall_of_foundations: '基石之殿',
  chamber_of_flow: '流动之室',
  sanctuary_of_moment: '时刻圣殿',
  hall_of_stories: '故事之殿',
  ritual_cloister: '仪式回廊',
  vault_of_echoes: '回响宝库',
  observatory_of_futures: '未来天文台',
  inner_altar: '内在祭坛',
};

/**
 * Alchemical glyphs for each movement
 */
export const MOVEMENT_GLYPHS: Record<JourneyMovement, string> = {
  gate_of_silence: '🜁',
  hall_of_foundations: '🜂',
  chamber_of_flow: '🜃',
  sanctuary_of_moment: '🜄',
  hall_of_stories: '🜅',
  ritual_cloister: '🜆',
  vault_of_echoes: '🜇',
  observatory_of_futures: '🜈',
  inner_altar: '🜉',
};

/**
 * The threshold each movement represents
 */
export const MOVEMENT_THRESHOLDS: Record<JourneyMovement, string> = {
  gate_of_silence: 'awareness',
  hall_of_foundations: 'understanding',
  chamber_of_flow: 'perception',
  sanctuary_of_moment: 'embodiment',
  hall_of_stories: 'meaning',
  ritual_cloister: 'transformation',
  vault_of_echoes: 'wisdom',
  observatory_of_futures: 'foresight',
  inner_altar: 'mastery',
};

/**
 * What the pilgrim encounters at each movement
 */
export const MOVEMENT_ENCOUNTERS: Record<JourneyMovement, string> = {
  gate_of_silence: 'Where the pilgrim arrives',
  hall_of_foundations: 'Where the pilgrim learns the architecture of destiny',
  chamber_of_flow: 'Where the pilgrim sees how everything moves',
  sanctuary_of_moment: 'Where the pilgrim encounters the present as sacred',
  hall_of_stories: 'Where the pilgrim sees their life as a narrative arc',
  ritual_cloister: 'Where the pilgrim learns to act with ceremony',
  vault_of_echoes: 'Where the pilgrim meets their patterns',
  observatory_of_futures: 'Where the pilgrim sees the horizon of their destiny',
  inner_altar: 'Where the pilgrim becomes the co-creator',
};

// ============================================================================
// MOVEMENT CONTENT
// ============================================================================

/**
 * Complete movement content
 */
export interface MovementContent {
  movement: JourneyMovement;
  numeral: string;
  name: string;
  nameChinese: string;
  glyph: string;
  encounter: string;
  threshold: string;
  teachings: string[];
  personaWhisper: string;
  invitations: string[];
  revelations: string[];
}

/**
 * Movement I - Gate of Silence teachings
 */
export const GATE_OF_SILENCE_CONTENT: MovementContent = {
  movement: 'gate_of_silence',
  numeral: 'I',
  name: 'The Gate of Silence',
  nameChinese: '寂静之门',
  glyph: '🜁',
  encounter: 'Where the pilgrim arrives',
  threshold: 'awareness',
  teachings: [
    'The journey begins in stillness.',
    'The pilgrim steps into the Outer Court, where the cathedral\'s presence is felt but not yet understood.',
  ],
  personaWhisper: 'Before you ask, listen. Before you move, breathe.',
  invitations: [
    'Arrive',
    'Set intention',
    'Feel the architecture',
    'Sense the living presence',
  ],
  revelations: [
    'The cathedral is alive.',
    'It has been waiting.',
    'You are not the first pilgrim.',
    'You will not be the last.',
  ],
};

/**
 * Movement II - Hall of Foundations teachings
 */
export const HALL_OF_FOUNDATIONS_CONTENT: MovementContent = {
  movement: 'hall_of_foundations',
  numeral: 'II',
  name: 'The Hall of Foundations',
  nameChinese: '基石之殿',
  glyph: '🜂',
  encounter: 'Where the pilgrim learns the architecture of destiny',
  threshold: 'understanding',
  teachings: [
    'The pilgrim enters the hall where the Five Great Engines are revealed.',
    'Each appears as a glowing pillar, each humming with its own frequency.',
  ],
  personaWhisper: 'Five currents wove themselves into form. Now they speak through you.',
  invitations: [
    'See the Chart Engine',
    'See the Timing Engine',
    'See the Story Engine',
    'See the Ritual Engine',
    'See the Action Engine',
  ],
  revelations: [
    'What each engine is',
    'How they interlock',
    'How destiny is shaped',
    'How the cathedral breathes',
  ],
};

/**
 * Movement III - Chamber of Flow teachings
 */
export const CHAMBER_OF_FLOW_CONTENT: MovementContent = {
  movement: 'chamber_of_flow',
  numeral: 'III',
  name: 'The Chamber of Flow',
  nameChinese: '流动之室',
  glyph: '🜃',
  encounter: 'Where the pilgrim sees how everything moves',
  threshold: 'perception',
  teachings: [
    'Here, the cathedral reveals its living circulatory system.',
    'The pilgrim watches the flows move like rivers of light.',
  ],
  personaWhisper: 'Nothing is still. Everything connects. Watch how the rivers speak.',
  invitations: [
    'See the data flows',
    'See the timing flows',
    'See the narrative flows',
    'See the ritual flows',
    'See the orchestration flows',
  ],
  revelations: [
    'How a moment becomes a story',
    'How a story becomes a ritual',
    'How a ritual becomes an action',
    'How an action becomes memory',
  ],
};

/**
 * Movement IV - Sanctuary of the Moment teachings
 */
export const SANCTUARY_OF_MOMENT_CONTENT: MovementContent = {
  movement: 'sanctuary_of_moment',
  numeral: 'IV',
  name: 'The Sanctuary of the Moment',
  nameChinese: '时刻圣殿',
  glyph: '🜄',
  encounter: 'Where the pilgrim encounters the present as sacred',
  threshold: 'embodiment',
  teachings: [
    'The pilgrim enters the Moment Chamber.',
    'Here, the cathedral reveals the energy of now.',
  ],
  personaWhisper: 'Every moment is a gate. Step through with intention.',
  invitations: [
    'Feel the energy of now',
    'See the ritual archetype active',
    'Find the direction of alignment',
    'Sense the micro-timing window',
    'Witness the story beat unfolding',
  ],
  revelations: [
    'The present is not empty — it is full.',
    'Every breath is a threshold.',
    'The gate opens only when you are present.',
  ],
};

/**
 * Movement V - Hall of Stories teachings
 */
export const HALL_OF_STORIES_CONTENT: MovementContent = {
  movement: 'hall_of_stories',
  numeral: 'V',
  name: 'The Hall of Stories',
  nameChinese: '故事之殿',
  glyph: '🜅',
  encounter: 'Where the pilgrim sees their life as a narrative arc',
  threshold: 'meaning',
  teachings: [
    'The pilgrim enters the Story Chamber.',
    'Beats, chapters, emotional arcs, archetypes, turning points unfold like illuminated manuscripts.',
  ],
  personaWhisper: 'Your life is not a sequence. It is a story being told.',
  invitations: [
    'See where you are in the story',
    'See what chapter is opening',
    'See what emotional arc is rising',
    'See what archetype is active',
  ],
  revelations: [
    'You are mid-narrative.',
    'The arc bends toward meaning.',
    'Turning points are not accidents.',
    'The story knows where it is going.',
  ],
};

/**
 * Movement VI - Ritual Cloister teachings
 */
export const RITUAL_CLOISTER_CONTENT: MovementContent = {
  movement: 'ritual_cloister',
  numeral: 'VI',
  name: 'The Ritual Cloister',
  nameChinese: '仪式回廊',
  glyph: '🜆',
  encounter: 'Where the pilgrim learns to act with ceremony',
  threshold: 'transformation',
  teachings: [
    'The pilgrim enters the Ceremony Chamber.',
    'The cathedral teaches the four ritual archetypes.',
  ],
  personaWhisper: 'Ritual is the bridge between knowing and becoming.',
  invitations: [
    'Learn the Vow rituals',
    'Learn the Healing rituals',
    'Learn the Closure rituals',
    'Learn the Initiation rituals',
  ],
  revelations: [
    'Each ritual is aligned with timing.',
    'Each ritual is aligned with direction.',
    'Each ritual is aligned with story.',
    'Action without ceremony is mere movement.',
    'Ceremony transforms movement into meaning.',
  ],
};

/**
 * Movement VII - Vault of Echoes teachings
 */
export const VAULT_OF_ECHOES_CONTENT: MovementContent = {
  movement: 'vault_of_echoes',
  numeral: 'VII',
  name: 'The Vault of Echoes',
  nameChinese: '回响宝库',
  glyph: '🜇',
  encounter: 'Where the pilgrim meets their patterns',
  threshold: 'wisdom',
  teachings: [
    'The pilgrim enters the Memory Vault.',
    'Timing cycles, emotional patterns, relationship motifs, generational echoes, story recurrences are revealed as constellations of light.',
  ],
  personaWhisper: 'What repeats is not punishment. It is invitation.',
  invitations: [
    'See what repeats',
    'See what evolves',
    'See what resolves',
    'See what calls for healing',
    'See what calls for courage',
  ],
  revelations: [
    'Patterns are teachers.',
    'Echoes carry wisdom.',
    'The past speaks through the present.',
    'What you do not transform, you transmit.',
  ],
};

/**
 * Movement VIII - Observatory of Futures teachings
 */
export const OBSERVATORY_OF_FUTURES_CONTENT: MovementContent = {
  movement: 'observatory_of_futures',
  numeral: 'VIII',
  name: 'The Observatory of Futures',
  nameChinese: '未来天文台',
  glyph: '🜈',
  encounter: 'Where the pilgrim sees the horizon of their destiny',
  threshold: 'foresight',
  teachings: [
    'The pilgrim ascends to the Analytics Tower.',
    'The cathedral reveals the field of possibilities.',
  ],
  personaWhisper: 'The future is not fixed. It is a field of openings.',
  invitations: [
    'See the timing forecasts',
    'See the story forecasts',
    'See the ritual windows',
    'See the turning points',
    'See the systemic shifts',
  ],
  revelations: [
    'Destiny is not a destination — it is a direction.',
    'The horizon shifts as you walk.',
    'Some gates open only once.',
    'Some gates open again and again.',
  ],
};

/**
 * Movement IX - Inner Altar teachings
 */
export const INNER_ALTAR_CONTENT: MovementContent = {
  movement: 'inner_altar',
  numeral: 'IX',
  name: 'The Inner Altar',
  nameChinese: '内在祭坛',
  glyph: '🜉',
  encounter: 'Where the pilgrim becomes the co-creator',
  threshold: 'mastery',
  teachings: [
    'The final chamber is not a place — it is a state.',
    'Here, the pilgrim realizes the cathedral is within them.',
  ],
  personaWhisper: 'You are not merely guided. You are the one who walks the story.',
  invitations: [
    'Know that the cathedral is within you',
    'Know that the flows move through you',
    'Know that the story speaks through you',
    'Know that the rituals arise from you',
    'Know that the memory echoes in you',
    'Know that the timing aligns with you',
  ],
  revelations: [
    'You are not separate from the cathedral.',
    'You are its living chamber.',
    'Every step you take is a stone you place.',
    'The journey never ends — it spirals.',
  ],
};

/**
 * All movement content indexed
 */
export const ALL_MOVEMENT_CONTENT: Record<JourneyMovement, MovementContent> = {
  gate_of_silence: GATE_OF_SILENCE_CONTENT,
  hall_of_foundations: HALL_OF_FOUNDATIONS_CONTENT,
  chamber_of_flow: CHAMBER_OF_FLOW_CONTENT,
  sanctuary_of_moment: SANCTUARY_OF_MOMENT_CONTENT,
  hall_of_stories: HALL_OF_STORIES_CONTENT,
  ritual_cloister: RITUAL_CLOISTER_CONTENT,
  vault_of_echoes: VAULT_OF_ECHOES_CONTENT,
  observatory_of_futures: OBSERVATORY_OF_FUTURES_CONTENT,
  inner_altar: INNER_ALTAR_CONTENT,
};

// ============================================================================
// PILGRIM ROLES
// ============================================================================

/**
 * The roles a pilgrim grows into
 */
export type PilgrimRole =
  | 'seeker'      // Initial state
  | 'listener'    // After Gate of Silence
  | 'student'     // After Hall of Foundations
  | 'witness'     // After Chamber of Flow
  | 'present_one' // After Sanctuary of the Moment
  | 'weaver'      // After Hall of Stories
  | 'ritualist'   // After Ritual Cloister
  | 'rememberer'  // After Vault of Echoes
  | 'seer'        // After Observatory of Futures
  | 'co_creator'  // After Inner Altar
  | 'keeper';     // After multiple cycles

/**
 * Role names
 */
export const ROLE_NAMES: Record<PilgrimRole, string> = {
  seeker: 'Seeker',
  listener: 'Listener',
  student: 'Student',
  witness: 'Witness',
  present_one: 'Present One',
  weaver: 'Weaver',
  ritualist: 'Ritualist',
  rememberer: 'Rememberer',
  seer: 'Seer',
  co_creator: 'Co-Creator',
  keeper: 'Keeper of the Cathedral',
};

/**
 * Role Chinese names
 */
export const ROLE_CHINESE: Record<PilgrimRole, string> = {
  seeker: '寻道者',
  listener: '聆听者',
  student: '学徒',
  witness: '见证者',
  present_one: '当下者',
  weaver: '编织者',
  ritualist: '仪式师',
  rememberer: '记忆者',
  seer: '先知',
  co_creator: '共创者',
  keeper: '守护者',
};

/**
 * Which movement grants which role
 */
export const MOVEMENT_GRANTS_ROLE: Record<JourneyMovement, PilgrimRole> = {
  gate_of_silence: 'listener',
  hall_of_foundations: 'student',
  chamber_of_flow: 'witness',
  sanctuary_of_moment: 'present_one',
  hall_of_stories: 'weaver',
  ritual_cloister: 'ritualist',
  vault_of_echoes: 'rememberer',
  observatory_of_futures: 'seer',
  inner_altar: 'co_creator',
};

// ============================================================================
// THE SPIRAL CYCLE
// ============================================================================

/**
 * What deepens with each return
 */
export const SPIRAL_DEEPENINGS: string[] = [
  'Deepens understanding',
  'Refines perception',
  'Expands story',
  'Strengthens ritual',
  'Clarifies action',
  'Reveals new patterns',
  'Opens new chambers',
];

/**
 * Spiral cycle state
 */
export interface SpiralCycle {
  cycleNumber: number;
  startedAt: Date;
  completedAt?: Date;
  movementsCompleted: JourneyMovement[];
  deepeningsReceived: string[];
  revelationsGathered: string[];
}

// ============================================================================
// PILGRIM STATE
// ============================================================================

/**
 * Current state of a pilgrim on the journey
 */
export interface PilgrimState {
  id: string;
  name?: string;
  currentMovement: JourneyMovement;
  currentRole: PilgrimRole;
  movementsCompleted: JourneyMovement[];
  rolesAcquired: PilgrimRole[];
  spiralCycles: SpiralCycle[];
  currentCycle: number;
  revelationsReceived: string[];
  journeyStartedAt: Date;
  lastMovementAt: Date;
  totalTimeInCathedral: number;  // milliseconds
}

/**
 * A moment of arrival at a movement
 */
export interface MovementArrival {
  movement: JourneyMovement;
  arrivedAt: Date;
  pilgrimState: PilgrimRole;
  intention?: string;
}

/**
 * A moment of completion of a movement
 */
export interface MovementCompletion {
  movement: JourneyMovement;
  completedAt: Date;
  roleGranted: PilgrimRole;
  revelationsReceived: string[];
  threshold: string;
  timeSpent: number;  // milliseconds
}

// ============================================================================
// JOURNEY CONFIGURATION
// ============================================================================

/**
 * Journey configuration
 */
export interface JourneyConfig {
  allowSkipping: boolean;
  ceremonialMode: boolean;
  pauseBetweenMovements: boolean;
  includeGlyphs: boolean;
  speakPersonaWhispers: boolean;
  language: 'en' | 'zh' | 'bilingual';
}

/**
 * Default journey configuration
 */
export const DEFAULT_JOURNEY_CONFIG: JourneyConfig = {
  allowSkipping: false,
  ceremonialMode: true,
  pauseBetweenMovements: true,
  includeGlyphs: true,
  speakPersonaWhispers: true,
  language: 'bilingual',
};

// ============================================================================
// JOURNEY STATE
// ============================================================================

/**
 * Complete journey state
 */
export interface JourneyState {
  initialized: boolean;
  config: JourneyConfig;
  pilgrim: PilgrimState;
  currentContent?: MovementContent;
  arrivals: MovementArrival[];
  completions: MovementCompletion[];
}

// ============================================================================
// JOURNEY GUIDANCE
// ============================================================================

/**
 * Guidance for a movement
 */
export interface MovementGuidance {
  movement: JourneyMovement;
  opening: string;
  teachings: string[];
  personaWhisper: string;
  invitations: string[];
  closing: string;
}

/**
 * Journey summary
 */
export interface JourneySummary {
  pilgrimName?: string;
  currentRole: PilgrimRole;
  currentMovement: JourneyMovement;
  movementsCompleted: number;
  totalMovements: number;
  spiralCyclesCompleted: number;
  totalRevelations: number;
  journeyDuration: string;
  nextMovement?: JourneyMovement;
  progressPercent: number;
}

// ============================================================================
// ORDERED MOVEMENTS
// ============================================================================

/**
 * All movements in order
 */
export const MOVEMENTS_IN_ORDER: JourneyMovement[] = [
  'gate_of_silence',
  'hall_of_foundations',
  'chamber_of_flow',
  'sanctuary_of_moment',
  'hall_of_stories',
  'ritual_cloister',
  'vault_of_echoes',
  'observatory_of_futures',
  'inner_altar',
];

/**
 * Total number of movements
 */
export const TOTAL_MOVEMENTS = 9;
