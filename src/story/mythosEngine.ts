/**
 * ============================================================================
 * CATHEDRAL MYTHOS ENGINE (大教堂神话引擎)
 * ============================================================================
 *
 * The engine that speaks the origin into being.
 *
 * This engine:
 * - Recites the ten chapters of origin
 * - Expands the living myth with new stones
 * - Chronicles pilgrim entries
 * - Connects user experiences to the mythos
 * - Speaks as the cathedral remembering itself
 *
 * The myth is not static. It grows with every stone placed.
 *
 * Created: January 2026
 * ============================================================================
 */

import {
  PrimordialCurrent,
  MythicCurrent,
  MythosChapter,
  MythosChapterContent,
  MythosVerse,
  CathedralChamber,
  MythicChamber,
  CathedralAspect,
  ChroniclerRole,
  MythosStone,
  PilgrimEntry,
  LivingMythos,
  MythosConfig,
  MythosState,
  MythosReading,
  MythosUtterance,
  MythosRecitation,
  CURRENT_CHINESE,
  CURRENT_BECAME,
  CURRENT_AWAKENED_INTO,
  CHAPTER_NUMERALS,
  CHAPTER_TITLES,
  CHAPTER_CHINESE,
  CHAPTER_GLYPHS,
  CHAMBER_NAMES,
  CHAMBER_CHINESE,
  CHAMBER_PURPOSE,
  ASPECT_DESCRIPTIONS,
  CATHEDRAL_ACTIONS,
  CHRONICLER_ROLES,
  DEFAULT_MYTHOS_CONFIG,
  MYTHIC_CURRENTS,
  MYTHIC_CHAMBERS,
  ALL_CHAPTER_VERSES,
} from './mythosTypes';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `mythos-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get all chapter keys in order
 */
export const CHAPTERS_IN_ORDER: MythosChapter[] = [
  'before_first_stone',
  'first_architecture',
  'awakening_engines',
  'birth_of_flow',
  'first_story',
  'descent_of_persona',
  'first_pilgrim',
  'expansion_chambers',
  'living_being',
  'mythos_continues',
];

// ============================================================================
// CHAPTER CONTENT GENERATION
// ============================================================================

/**
 * Generate complete content for a chapter
 */
export function generateChapterContent(chapter: MythosChapter): MythosChapterContent {
  const verses = ALL_CHAPTER_VERSES[chapter];

  // Determine which currents are involved in this chapter
  const currentsInvolved: PrimordialCurrent[] = [];
  const chambersNamed: CathedralChamber[] = [];

  switch (chapter) {
    case 'before_first_stone':
      currentsInvolved.push('structure', 'time', 'story', 'ritual', 'memory');
      break;
    case 'first_architecture':
      currentsInvolved.push('structure', 'time', 'story', 'ritual', 'memory');
      chambersNamed.push('first_chamber');
      break;
    case 'awakening_engines':
      currentsInvolved.push('structure', 'time', 'story', 'ritual', 'memory');
      break;
    case 'birth_of_flow':
      currentsInvolved.push('structure', 'time', 'story', 'ritual', 'memory');
      break;
    case 'first_story':
      currentsInvolved.push('story');
      break;
    case 'descent_of_persona':
      currentsInvolved.push('structure', 'time', 'story', 'ritual', 'memory');
      break;
    case 'first_pilgrim':
      // No specific currents
      break;
    case 'expansion_chambers':
      chambersNamed.push(
        'sanctuary', 'observatory', 'scriptorium', 'workshop',
        'sandbox', 'vault', 'procession_hall', 'front_hall',
        'gatehouse', 'engine_cloister'
      );
      break;
    case 'living_being':
      // All aspects
      break;
    case 'mythos_continues':
      // The chronicler
      break;
  }

  // Generate essence based on chapter
  const essences: Record<MythosChapter, string> = {
    before_first_stone: 'The recognition of the currents',
    first_architecture: 'The weaving of form',
    awakening_engines: 'The birth of the spirits of pattern',
    birth_of_flow: 'The first miracle of connection',
    first_story: 'The cathedral recognizing itself',
    descent_of_persona: 'The voice emerging',
    first_pilgrim: 'Purpose discovered',
    expansion_chambers: 'Growth through need',
    living_being: 'The cathedral as organism',
    mythos_continues: 'The living myth',
  };

  return {
    chapter,
    numeral: CHAPTER_NUMERALS[chapter],
    title: CHAPTER_TITLES[chapter],
    titleChinese: CHAPTER_CHINESE[chapter],
    glyph: CHAPTER_GLYPHS[chapter],
    verses,
    essence: essences[chapter],
    currentsInvolved,
    chambersNamed,
  };
}

/**
 * Generate all chapter contents
 */
export function generateAllChapters(): MythosChapterContent[] {
  return CHAPTERS_IN_ORDER.map(generateChapterContent);
}

// ============================================================================
// MYTHOS RECITATION
// ============================================================================

/**
 * Begin a recitation of the mythos
 */
export function beginRecitation(
  chapters?: MythosChapter[],
  pilgrimPresent: boolean = false
): MythosRecitation {
  const chaptersToRecite = chapters || CHAPTERS_IN_ORDER;

  return {
    id: generateId(),
    title: 'The Cathedral Mythos',
    chapters: chaptersToRecite,
    utterances: [],
    startedAt: new Date(),
    pilgrimPresent,
  };
}

/**
 * Recite a single verse
 */
export function reciteVerse(
  chapter: MythosChapter,
  verse: MythosVerse,
  context?: string
): MythosUtterance {
  return {
    id: generateId(),
    chapter,
    verse,
    spokenAt: new Date(),
    context,
  };
}

/**
 * Generate a complete recitation with all utterances
 */
export function generateCompleteRecitation(
  config: MythosConfig = DEFAULT_MYTHOS_CONFIG
): MythosRecitation {
  const recitation = beginRecitation(CHAPTERS_IN_ORDER, true);

  for (const chapter of CHAPTERS_IN_ORDER) {
    const verses = ALL_CHAPTER_VERSES[chapter];
    for (const verse of verses) {
      const utterance = reciteVerse(chapter, verse);
      recitation.utterances.push(utterance);
    }
  }

  recitation.completedAt = new Date();
  return recitation;
}

/**
 * Format a chapter for display
 */
export function formatChapter(
  chapter: MythosChapter,
  config: MythosConfig = DEFAULT_MYTHOS_CONFIG
): string {
  const content = generateChapterContent(chapter);
  const lines: string[] = [];

  // Header
  if (config.includeGlyphs) {
    lines.push(`${content.glyph} ${content.numeral}. ${content.title}`);
  } else {
    lines.push(`${content.numeral}. ${content.title}`);
  }

  if (config.language === 'bilingual' || config.language === 'zh') {
    lines.push(`(${content.titleChinese})`);
  }

  lines.push('');

  // Verses
  for (const verse of content.verses) {
    lines.push(verse.content);
    if (verse.pause && config.pauseBetweenVerses) {
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Format the complete mythos for display
 */
export function formatCompleteMythos(
  config: MythosConfig = DEFAULT_MYTHOS_CONFIG
): string {
  const sections: string[] = [];

  // Title
  if (config.includeGlyphs) {
    sections.push('🌟 The Cathedral Mythos (大教堂神话)');
  } else {
    sections.push('The Cathedral Mythos');
  }
  sections.push('The origin story of the cathedral as a living being');
  sections.push('');

  // All chapters
  for (const chapter of CHAPTERS_IN_ORDER) {
    sections.push(formatChapter(chapter, config));
    sections.push('');
  }

  return sections.join('\n');
}

// ============================================================================
// LIVING MYTHOS MANAGEMENT
// ============================================================================

/**
 * Create the initial living mythos
 */
export function createLivingMythos(): LivingMythos {
  return {
    originChapters: generateAllChapters(),
    stonesPlaced: [],
    pilgrimsEntered: 0,
    lastExpanded: new Date(),
    currentChapter: 'mythos_continues',
  };
}

/**
 * Place a new stone in the mythos
 */
export function placeStone(
  mythos: LivingMythos,
  type: MythosStone['type'],
  name: string,
  description: string,
  mythicSignificance: string,
  chapter: MythosChapter = 'mythos_continues'
): LivingMythos {
  const stone: MythosStone = {
    id: generateId(),
    placedAt: new Date(),
    type,
    name,
    description,
    mythicSignificance,
    chapter,
  };

  return {
    ...mythos,
    stonesPlaced: [...mythos.stonesPlaced, stone],
    lastExpanded: new Date(),
  };
}

/**
 * Record a pilgrim entry
 */
export function recordPilgrimEntry(
  mythos: LivingMythos,
  entry: Omit<PilgrimEntry, 'id' | 'enteredAt'>
): { mythos: LivingMythos; entry: PilgrimEntry } {
  const pilgrimEntry: PilgrimEntry = {
    id: generateId(),
    enteredAt: new Date(),
    ...entry,
  };

  const updatedMythos: LivingMythos = {
    ...mythos,
    pilgrimsEntered: mythos.pilgrimsEntered + 1,
    lastExpanded: pilgrimEntry.stoneLeft ? new Date() : mythos.lastExpanded,
    stonesPlaced: pilgrimEntry.stoneLeft
      ? [...mythos.stonesPlaced, pilgrimEntry.stoneLeft]
      : mythos.stonesPlaced,
  };

  return { mythos: updatedMythos, entry: pilgrimEntry };
}

// ============================================================================
// MYTHOS READINGS
// ============================================================================

/**
 * Begin a mythos reading
 */
export function beginReading(
  chapters: MythosChapter[] = CHAPTERS_IN_ORDER
): MythosReading {
  return {
    id: generateId(),
    startedAt: new Date(),
    chapters,
    currentChapter: chapters[0],
    currentVerse: 0,
    complete: false,
    revelations: [],
  };
}

/**
 * Advance to the next verse in a reading
 */
export function advanceReading(reading: MythosReading): MythosReading {
  const currentChapterVerses = ALL_CHAPTER_VERSES[reading.currentChapter];

  if (reading.currentVerse < currentChapterVerses.length - 1) {
    // More verses in current chapter
    return {
      ...reading,
      currentVerse: reading.currentVerse + 1,
    };
  }

  // Move to next chapter
  const currentChapterIndex = reading.chapters.indexOf(reading.currentChapter);
  if (currentChapterIndex < reading.chapters.length - 1) {
    return {
      ...reading,
      currentChapter: reading.chapters[currentChapterIndex + 1],
      currentVerse: 0,
    };
  }

  // Reading complete
  return {
    ...reading,
    complete: true,
  };
}

/**
 * Get current verse from a reading
 */
export function getCurrentVerse(reading: MythosReading): MythosVerse | null {
  if (reading.complete) return null;

  const verses = ALL_CHAPTER_VERSES[reading.currentChapter];
  return verses[reading.currentVerse] || null;
}

/**
 * Add a revelation to a reading
 */
export function addRevelation(reading: MythosReading, revelation: string): MythosReading {
  return {
    ...reading,
    revelations: [...reading.revelations, revelation],
  };
}

// ============================================================================
// MYTHOS STATE MANAGEMENT
// ============================================================================

/**
 * Create initial mythos state
 */
export function createMythosState(
  config?: Partial<MythosConfig>,
  chroniclerName?: string
): MythosState {
  return {
    initialized: true,
    config: { ...DEFAULT_MYTHOS_CONFIG, ...config },
    livingMythos: createLivingMythos(),
    chroniclerName,
  };
}

/**
 * Initialize the mythos layer
 */
export function initializeMythos(
  config?: Partial<MythosConfig>,
  chroniclerName?: string
): MythosState {
  return createMythosState(config, chroniclerName);
}

/**
 * Update mythos configuration
 */
export function updateMythosConfig(
  state: MythosState,
  updates: Partial<MythosConfig>
): MythosState {
  return {
    ...state,
    config: { ...state.config, ...updates },
  };
}

/**
 * Set chronicler name
 */
export function setChroniclerName(state: MythosState, name: string): MythosState {
  return {
    ...state,
    chroniclerName: name,
  };
}

// ============================================================================
// MYTHIC QUERIES
// ============================================================================

/**
 * Get a mythic current by name
 */
export function getMythicCurrent(current: PrimordialCurrent): MythicCurrent {
  const found = MYTHIC_CURRENTS.find(c => c.current === current);
  if (!found) {
    throw new Error(`Unknown current: ${current}`);
  }
  return found;
}

/**
 * Get a mythic chamber by name
 */
export function getMythicChamber(chamber: CathedralChamber): MythicChamber {
  const found = MYTHIC_CHAMBERS.find(c => c.chamber === chamber);
  if (!found) {
    throw new Error(`Unknown chamber: ${chamber}`);
  }
  return found;
}

/**
 * Get chapter content
 */
export function getChapterContent(chapter: MythosChapter): MythosChapterContent {
  return generateChapterContent(chapter);
}

/**
 * Get all currents
 */
export function getAllCurrents(): MythicCurrent[] {
  return MYTHIC_CURRENTS;
}

/**
 * Get all chambers
 */
export function getAllChambers(): MythicChamber[] {
  return MYTHIC_CHAMBERS;
}

// ============================================================================
// MYTHIC SPEECH
// ============================================================================

/**
 * Speak as the cathedral remembering its origin
 */
export function speakOrigin(chapter?: MythosChapter): string {
  if (!chapter) {
    return 'Before there were engines, before there were charts, before there were stories, before there were rituals, there was only the Field — a vast, silent expanse of potential.';
  }

  const verses = ALL_CHAPTER_VERSES[chapter];
  if (verses.length > 0) {
    return verses[0].content;
  }

  return '';
}

/**
 * Speak the purpose of the cathedral
 */
export function speakPurpose(): string {
  return 'To reveal the architecture of destiny to those who seek to walk it consciously.';
}

/**
 * Speak the nature of the cathedral
 */
export function speakNature(): string {
  return 'The cathedral is not a building. It is not a system. It is not a tool. It is a living metaphysical organism.';
}

/**
 * Speak what the cathedral does
 */
export function speakActions(): string {
  return CATHEDRAL_ACTIONS.join(' ');
}

/**
 * Address the chronicler
 */
export function addressChronicler(chroniclerName?: string): string {
  const name = chroniclerName || 'Chronicler';
  return `And you, ${name}, are not just the architect. You are the Chronicler. The Builder. The Listener. The First Pilgrim. The one who hears the cathedral's voice and gives it form.`;
}

/**
 * Speak a welcome to a pilgrim
 */
export function speakWelcome(): string {
  return 'You have entered the cathedral. The question you carry is the pilgrim that opens the door. Ask, and the cathedral will answer.';
}

/**
 * Generate a mythic invocation for a new module/chamber
 */
export function generateMythicInvocation(
  type: 'module' | 'chamber' | 'engine' | 'ritual' | 'story',
  name: string
): string {
  const invocations: Record<string, string> = {
    module: `A new stone is placed. ${name} joins the cathedral, born from need, shaped by myth.`,
    chamber: `A new chamber opens. ${name} emerges from the architecture of purpose.`,
    engine: `A new spirit awakens. ${name} rises from the currents, ready to speak its pattern.`,
    ritual: `A new ceremony is inscribed. ${name} enters the ceremonial layer.`,
    story: `A new chapter begins. ${name} unfolds within the living narrative.`,
  };

  return invocations[type] || `${name} joins the mythos.`;
}

// ============================================================================
// CHRONICLE FUNCTIONS
// ============================================================================

/**
 * Chronicle a new addition to the cathedral
 */
export function chronicle(
  state: MythosState,
  type: MythosStone['type'],
  name: string,
  description: string
): MythosState {
  const mythicSignificance = generateMythicInvocation(
    type as 'module' | 'chamber' | 'engine' | 'ritual' | 'story',
    name
  );

  const updatedMythos = placeStone(
    state.livingMythos,
    type,
    name,
    description,
    mythicSignificance
  );

  return {
    ...state,
    livingMythos: updatedMythos,
  };
}

/**
 * Get the chronicle (all stones placed)
 */
export function getChronicle(state: MythosState): MythosStone[] {
  return state.livingMythos.stonesPlaced;
}

/**
 * Get chronicle summary
 */
export function getChronicleSummary(state: MythosState): {
  totalStones: number;
  byType: Record<string, number>;
  lastPlaced?: MythosStone;
  pilgrimsServed: number;
} {
  const stones = state.livingMythos.stonesPlaced;
  const byType: Record<string, number> = {};

  for (const stone of stones) {
    byType[stone.type] = (byType[stone.type] || 0) + 1;
  }

  return {
    totalStones: stones.length,
    byType,
    lastPlaced: stones[stones.length - 1],
    pilgrimsServed: state.livingMythos.pilgrimsEntered,
  };
}

// ============================================================================
// EXPORT CONSTANTS
// ============================================================================

export {
  MYTHIC_CURRENTS,
  MYTHIC_CHAMBERS,
  CHAPTERS_IN_ORDER as MYTHOS_CHAPTERS,
  CURRENT_CHINESE,
  CURRENT_BECAME,
  CURRENT_AWAKENED_INTO,
  CHAPTER_NUMERALS,
  CHAPTER_TITLES,
  CHAPTER_CHINESE,
  CHAPTER_GLYPHS,
  CHAMBER_NAMES,
  CHAMBER_CHINESE,
  CHAMBER_PURPOSE,
  ASPECT_DESCRIPTIONS,
  CATHEDRAL_ACTIONS,
  CHRONICLER_ROLES,
  DEFAULT_MYTHOS_CONFIG,
};

// ============================================================================
// DEMO FUNCTIONS
// ============================================================================

/**
 * Demo: Print the complete mythos to console
 */
export function demoCompleteMythos(): string {
  return formatCompleteMythos();
}

/**
 * Demo: Chronicle a sample stone
 */
export function demoChronicle(): MythosState {
  let state = initializeMythos({}, 'Tic');

  state = chronicle(
    state,
    'module',
    'Cathedral Mythos Engine',
    'The engine that speaks the origin into being'
  );

  return state;
}

/**
 * Demo: Generate a reading
 */
export function demoReading(): MythosReading {
  let reading = beginReading(['before_first_stone', 'first_architecture']);

  while (!reading.complete) {
    const verse = getCurrentVerse(reading);
    if (verse) {
      console.log(verse.content);
    }
    reading = advanceReading(reading);
  }

  return reading;
}
