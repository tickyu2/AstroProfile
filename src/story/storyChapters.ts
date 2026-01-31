/**
 * ============================================================================
 * STORY CHAPTERS ENGINE (故事章节引擎)
 * ============================================================================
 *
 * Groups story beats into meaningful chapters.
 * Each chapter has:
 * - A collection of beats
 * - An arc shape (awakening, deepening, challenge, etc.)
 * - An emotional shift
 * - Themes and foreshadowing
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  BeatType,
  ChapterArc,
  EmotionalShift,
  EmotionalTone,
  StoryBeat,
  StoryChapter
} from './storyTypes';

import { TONE_CHINESE } from './storyBeats';

// ============================================================================
// CHAPTER BOUNDARIES
// ============================================================================

/**
 * Beat types that typically end a chapter
 */
const CHAPTER_ENDING_BEATS: BeatType[] = ['peak', 'turning', 'resolution'];

/**
 * Minimum beats per chapter
 */
const MIN_BEATS_PER_CHAPTER = 2;

/**
 * Maximum beats per chapter
 */
const MAX_BEATS_PER_CHAPTER = 5;

// ============================================================================
// CHAPTER ARC DERIVATION
// ============================================================================

/**
 * Chapter arc Chinese names
 */
export const ARC_CHINESE: Record<ChapterArc, string> = {
  awakening: '觉醒',
  deepening: '深化',
  challenge: '挑战',
  turningPoint: '转折点',
  renewal: '更新',
  maturation: '成熟',
  expansion: '扩展',
  integration: '整合',
  resolution: '解决'
};

/**
 * Derive chapter arc from beat composition
 */
export function deriveChapterArc(beats: StoryBeat[]): ChapterArc {
  if (beats.length === 0) return 'integration';

  // Count beat types
  const beatTypes = beats.map(b => b.beatType);
  const hasOpening = beatTypes.includes('opening');
  const hasPeak = beatTypes.includes('peak');
  const hasTurning = beatTypes.includes('turning');
  const hasConflict = beatTypes.includes('conflict');
  const hasHealing = beatTypes.includes('healing');
  const hasResolution = beatTypes.includes('resolution');

  // Determine arc based on composition
  if (hasOpening && !hasPeak) {
    return 'awakening';
  }

  if (hasTurning) {
    return 'turningPoint';
  }

  if (hasConflict && !hasHealing) {
    return 'challenge';
  }

  if (hasHealing) {
    return 'renewal';
  }

  if (hasPeak) {
    return 'expansion';
  }

  if (hasResolution) {
    return 'resolution';
  }

  // Check average intensity for other arcs
  const avgIntensity = beats.reduce((sum, b) => sum + b.intensity, 0) / beats.length;

  if (avgIntensity >= 70) {
    return 'expansion';
  }

  if (avgIntensity >= 55) {
    return 'deepening';
  }

  if (avgIntensity >= 40) {
    return 'maturation';
  }

  return 'integration';
}

// ============================================================================
// EMOTIONAL SHIFT DERIVATION
// ============================================================================

/**
 * Derive emotional shift through a chapter
 */
export function deriveEmotionalShift(beats: StoryBeat[]): EmotionalShift {
  if (beats.length === 0) {
    return {
      from: 'reflective',
      to: 'reflective',
      description: 'A period of steady contemplation.',
      descriptionChinese: '一段稳定沉思的时期。'
    };
  }

  const fromTone = beats[0].emotionalTone;
  const toTone = beats[beats.length - 1].emotionalTone;

  // Generate description based on shift
  const description = generateShiftDescription(fromTone, toTone);

  return {
    from: fromTone,
    to: toTone,
    description: description.en,
    descriptionChinese: description.zh
  };
}

/**
 * Generate description for emotional shift
 */
function generateShiftDescription(
  from: EmotionalTone,
  to: EmotionalTone
): { en: string; zh: string } {
  // Same tone = steady
  if (from === to) {
    return {
      en: `A consistent period of ${from} energy throughout.`,
      zh: `贯穿始终的${TONE_CHINESE[from]}能量。`
    };
  }

  // Positive to positive = elevation
  const positiveTonesSet = new Set(['hopeful', 'joyful', 'triumphant', 'passionate']);
  if (positiveTonesSet.has(from) && positiveTonesSet.has(to)) {
    return {
      en: `The energy elevates from ${from} to ${to}.`,
      zh: `能量从${TONE_CHINESE[from]}提升到${TONE_CHINESE[to]}。`
    };
  }

  // Challenging to positive = transformation
  const challengingTones = new Set(['challenging', 'bittersweet', 'reflective']);
  if (challengingTones.has(from) && positiveTonesSet.has(to)) {
    return {
      en: `A transformative shift from ${from} to ${to}.`,
      zh: `从${TONE_CHINESE[from]}到${TONE_CHINESE[to]}的蜕变。`
    };
  }

  // Positive to challenging = test
  if (positiveTonesSet.has(from) && challengingTones.has(to)) {
    return {
      en: `The chapter transitions from ${from} into a more ${to} phase.`,
      zh: `章节从${TONE_CHINESE[from]}过渡到更${TONE_CHINESE[to]}的阶段。`
    };
  }

  // Default
  return {
    en: `The emotional journey moves from ${from} toward ${to}.`,
    zh: `情感旅程从${TONE_CHINESE[from]}走向${TONE_CHINESE[to]}。`
  };
}

// ============================================================================
// CHAPTER TITLE GENERATION
// ============================================================================

/**
 * Chapter titles by arc type
 */
const ARC_TITLES: Record<ChapterArc, { en: string; zh: string }[]> = {
  awakening: [
    { en: 'The Awakening', zh: '觉醒' },
    { en: 'First Light', zh: '初光' },
    { en: 'New Dawn', zh: '新黎明' }
  ],
  deepening: [
    { en: 'The Deepening', zh: '深化' },
    { en: 'Growing Roots', zh: '扎根' },
    { en: 'Into the Heart', zh: '深入心扉' }
  ],
  challenge: [
    { en: 'The Challenge', zh: '挑战' },
    { en: 'Trial by Fire', zh: '火的考验' },
    { en: 'The Test', zh: '试炼' }
  ],
  turningPoint: [
    { en: 'The Turning Point', zh: '转折点' },
    { en: 'Crossroads', zh: '十字路口' },
    { en: 'The Pivot', zh: '枢纽' }
  ],
  renewal: [
    { en: 'Renewal', zh: '更新' },
    { en: 'Spring Returns', zh: '春回' },
    { en: 'Fresh Start', zh: '崭新开始' }
  ],
  maturation: [
    { en: 'Coming of Age', zh: '成熟' },
    { en: 'Wisdom Earned', zh: '智慧所得' },
    { en: 'The Ripening', zh: '成熟期' }
  ],
  expansion: [
    { en: 'The Expansion', zh: '扩展' },
    { en: 'Horizons Widen', zh: '视野开阔' },
    { en: 'The Rising Tide', zh: '上升潮' }
  ],
  integration: [
    { en: 'Integration', zh: '整合' },
    { en: 'Weaving Together', zh: '交织融合' },
    { en: 'Finding Balance', zh: '寻找平衡' }
  ],
  resolution: [
    { en: 'Resolution', zh: '解决' },
    { en: 'The Completion', zh: '完成' },
    { en: 'Full Circle', zh: '圆满' }
  ]
};

/**
 * Generate chapter title
 */
export function deriveChapterTitle(
  arc: ChapterArc,
  chapterNumber: number
): { en: string; zh: string } {
  const titles = ARC_TITLES[arc];
  // Rotate through available titles based on chapter number
  const titleIndex = chapterNumber % titles.length;
  return titles[titleIndex];
}

// ============================================================================
// THEME EXTRACTION
// ============================================================================

/**
 * Extract themes from chapter beats
 */
export function extractChapterThemes(beats: StoryBeat[]): string[] {
  const themes: Set<string> = new Set();

  // Add lifecycle phase themes
  for (const beat of beats) {
    const phase = beat.lifecyclePhase.toLowerCase();

    if (phase.includes('growth')) themes.add('personal growth');
    if (phase.includes('love')) themes.add('romantic connection');
    if (phase.includes('challenge')) themes.add('overcoming obstacles');
    if (phase.includes('transform')) themes.add('transformation');
    if (phase.includes('heal')) themes.add('healing');
    if (phase.includes('expand')) themes.add('expansion');
    if (phase.includes('commit')) themes.add('commitment');
    if (phase.includes('trust')) themes.add('building trust');
  }

  // Add beat type themes
  const beatTypes = beats.map(b => b.beatType);

  if (beatTypes.includes('peak')) themes.add('breakthrough moments');
  if (beatTypes.includes('turning')) themes.add('pivotal change');
  if (beatTypes.includes('conflict')) themes.add('navigating challenges');
  if (beatTypes.includes('healing')) themes.add('recovery and renewal');

  // Add emotional themes
  const tones = beats.map(b => b.emotionalTone);

  if (tones.includes('passionate')) themes.add('passion');
  if (tones.includes('tender')) themes.add('tenderness');
  if (tones.includes('triumphant')) themes.add('triumph');
  if (tones.includes('transformative')) themes.add('metamorphosis');

  return Array.from(themes);
}

// ============================================================================
// FORESHADOWING GENERATION
// ============================================================================

/**
 * Generate foreshadowing hints for future chapters
 */
export function generateForeshadowing(
  currentArc: ChapterArc,
  beats: StoryBeat[]
): string[] {
  const foreshadowing: string[] = [];
  const lastBeat = beats[beats.length - 1];

  if (!lastBeat) return foreshadowing;

  // Based on how chapter ends, hint at what's coming
  switch (lastBeat.beatType) {
    case 'peak':
      foreshadowing.push('After the peak, integration awaits.');
      foreshadowing.push('What rises must find its new level.');
      break;

    case 'turning':
      foreshadowing.push('A new direction has been set.');
      foreshadowing.push('The seeds of change have been planted.');
      break;

    case 'conflict':
      foreshadowing.push('The challenge carries lessons yet to be revealed.');
      foreshadowing.push('What does not break you shapes you.');
      break;

    case 'rising':
      foreshadowing.push('The momentum continues to build.');
      foreshadowing.push('A crescendo approaches on the horizon.');
      break;

    case 'healing':
      foreshadowing.push('Strength is being quietly rebuilt.');
      foreshadowing.push('From this stillness, new growth will emerge.');
      break;

    default:
      foreshadowing.push('The journey continues to unfold.');
  }

  return foreshadowing;
}

// ============================================================================
// CHAPTER BUILDER
// ============================================================================

/**
 * Build a single chapter from beats
 */
export function buildChapter(
  beats: StoryBeat[],
  chapterNumber: number
): StoryChapter {
  const arc = deriveChapterArc(beats);
  const title = deriveChapterTitle(arc, chapterNumber);
  const emotionalShift = deriveEmotionalShift(beats);
  const themes = extractChapterThemes(beats);
  const foreshadowing = generateForeshadowing(arc, beats);

  // Calculate chapter intensity
  const intensity = Math.round(
    beats.reduce((sum, b) => sum + b.intensity, 0) / beats.length
  );

  // Determine time span
  const timeSpan = {
    start: beats[0]?.timeRange.start || '',
    end: beats[beats.length - 1]?.timeRange.end || ''
  };

  return {
    id: `chapter-${chapterNumber}`,
    number: chapterNumber,
    title: title.en,
    titleChinese: title.zh,
    beats,
    chapterArc: arc,
    emotionalShift,
    narrative: '', // Will be filled by narrative engine
    narrativeChinese: '',
    timeSpan,
    intensity,
    themes,
    foreshadowing
  };
}

// ============================================================================
// MAIN CHAPTER GROUPING
// ============================================================================

/**
 * Group beats into chapters
 */
export function groupBeatsIntoChapters(beats: StoryBeat[]): StoryChapter[] {
  if (beats.length === 0) return [];

  const chapters: StoryChapter[] = [];
  let currentBeats: StoryBeat[] = [];
  let chapterNumber = 1;

  for (const beat of beats) {
    currentBeats.push(beat);

    // Check if this beat ends the chapter
    const isChapterEnding = CHAPTER_ENDING_BEATS.includes(beat.beatType);
    const hasMinBeats = currentBeats.length >= MIN_BEATS_PER_CHAPTER;
    const hasMaxBeats = currentBeats.length >= MAX_BEATS_PER_CHAPTER;

    if ((isChapterEnding && hasMinBeats) || hasMaxBeats) {
      // Build chapter and reset
      chapters.push(buildChapter(currentBeats, chapterNumber));
      currentBeats = [];
      chapterNumber++;
    }
  }

  // Handle remaining beats
  if (currentBeats.length > 0) {
    // If only 1 beat left, merge with previous chapter if possible
    if (currentBeats.length === 1 && chapters.length > 0) {
      const lastChapter = chapters[chapters.length - 1];
      lastChapter.beats.push(...currentBeats);
      // Recalculate chapter properties
      lastChapter.emotionalShift = deriveEmotionalShift(lastChapter.beats);
      lastChapter.intensity = Math.round(
        lastChapter.beats.reduce((sum, b) => sum + b.intensity, 0) / lastChapter.beats.length
      );
      lastChapter.timeSpan.end = currentBeats[0].timeRange.end;
      lastChapter.themes = extractChapterThemes(lastChapter.beats);
      lastChapter.foreshadowing = generateForeshadowing(lastChapter.chapterArc, lastChapter.beats);
    } else {
      // Create final chapter
      chapters.push(buildChapter(currentBeats, chapterNumber));
    }
  }

  return chapters;
}

// ============================================================================
// CHAPTER ANALYSIS UTILITIES
// ============================================================================

/**
 * Find the most intense chapter
 */
export function findClimaticChapter(chapters: StoryChapter[]): StoryChapter | null {
  if (chapters.length === 0) return null;

  return chapters.reduce((most, ch) =>
    ch.intensity > most.intensity ? ch : most
  );
}

/**
 * Get chapter containing a specific date
 */
export function getChapterAtDate(
  chapters: StoryChapter[],
  date: string
): StoryChapter | null {
  for (const chapter of chapters) {
    if (date >= chapter.timeSpan.start && date <= chapter.timeSpan.end) {
      return chapter;
    }
  }
  return null;
}

/**
 * Calculate overall story progression
 */
export function calculateStoryProgression(
  chapters: StoryChapter[],
  currentDate: string
): { chapter: number; beat: number; percent: number } {
  let totalBeats = 0;
  let beatsCompleted = 0;
  let currentChapter = 1;
  let currentBeat = 1;

  for (const chapter of chapters) {
    for (const beat of chapter.beats) {
      totalBeats++;

      if (currentDate >= beat.timeRange.end) {
        beatsCompleted++;
      } else if (currentDate >= beat.timeRange.start) {
        currentChapter = chapter.number;
        currentBeat = chapter.beats.indexOf(beat) + 1;
        beatsCompleted += 0.5; // Partially through
      }
    }
  }

  const percent = totalBeats > 0 ? Math.round((beatsCompleted / totalBeats) * 100) : 0;

  return { chapter: currentChapter, beat: currentBeat, percent };
}
