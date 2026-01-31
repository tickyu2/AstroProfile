/**
 * ============================================================================
 * PREDICTIVE STORY ENGINE (叙事预测引擎)
 * ============================================================================
 *
 * The crown jewel of the cathedral.
 * The stained-glass window that turns structure into living myth.
 *
 * This engine orchestrates:
 * - Timing Engine → when things happen
 * - Environmental Engine → how the world supports or resists
 * - Lifecycle Engine → what phase the relationship is in
 * - Event Trigger Engine → what activates
 * - Narrative Enhancer → how to speak about it
 *
 * And produces:
 * - Story beats
 * - Chapter arcs
 * - Emotional tone shifts
 * - Turning points
 * - Foreshadowing
 * - Resolution patterns
 *
 * This is not fiction.
 * It is narrative-shaped interpretation of real metaphysical signals.
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  OverallArc,
  PredictiveStory,
  StoryChapter,
  StoryEngineInput,
  StoryEngineResult
} from './storyTypes';

import { buildStoryBeats, calculateBeatTrajectory } from './storyBeats';
import {
  groupBeatsIntoChapters,
  calculateStoryProgression,
  findClimaticChapter
} from './storyChapters';
import {
  writeChapterNarrative,
  generatePrologue,
  generateEpilogue,
  generateStoryTitle
} from './storyNarrative';

// ============================================================================
// OVERALL ARC DETERMINATION
// ============================================================================

/**
 * Determine overall story arc from chapters
 */
function determineOverallArc(chapters: StoryChapter[]): OverallArc {
  if (chapters.length === 0) return 'steadyClimb';

  // Analyze chapter composition
  const arcs = chapters.map(c => c.chapterArc);
  const intensities = chapters.map(c => c.intensity);

  // Count arc types
  const arcCounts: Record<string, number> = {};
  for (const arc of arcs) {
    arcCounts[arc] = (arcCounts[arc] || 0) + 1;
  }

  // Check for specific patterns
  const hasTurningPoint = arcs.includes('turningPoint');
  const hasChallenge = arcs.includes('challenge');
  const hasRenewal = arcs.includes('renewal');
  const hasAwakening = arcs.includes('awakening');
  const hasExpansion = arcs.includes('expansion');
  const hasResolution = arcs.includes('resolution');

  // Phoenix pattern: challenge → renewal
  if (hasChallenge && hasRenewal) {
    const challengeIdx = arcs.indexOf('challenge');
    const renewalIdx = arcs.indexOf('renewal');
    if (renewalIdx > challengeIdx) {
      return 'phoenix';
    }
  }

  // Hero's journey: awakening → challenge → resolution
  if (hasAwakening && hasChallenge && hasResolution) {
    return 'heroJourney';
  }

  // Love story: deepening + expansion
  if (arcs.includes('deepening') && hasExpansion) {
    return 'loveStory';
  }

  // Check intensity trajectory
  const firstHalfAvg = intensities.slice(0, Math.ceil(intensities.length / 2))
    .reduce((a, b) => a + b, 0) / Math.ceil(intensities.length / 2);
  const secondHalfAvg = intensities.slice(Math.ceil(intensities.length / 2))
    .reduce((a, b) => a + b, 0) / Math.floor(intensities.length / 2) || firstHalfAvg;

  // Steady climb pattern
  if (secondHalfAvg > firstHalfAvg + 10) {
    return 'steadyClimb';
  }

  // Check for wave pattern (high variance)
  const mean = intensities.reduce((a, b) => a + b, 0) / intensities.length;
  const variance = intensities.reduce((sum, i) => sum + Math.pow(i - mean, 2), 0) / intensities.length;

  if (variance > 300) {
    return 'wavePattern';
  }

  // Spiral pattern: repeated themes
  if (hasTurningPoint && arcs.filter(a => a === 'turningPoint').length >= 2) {
    return 'spiral';
  }

  // Coming of age: maturation present
  if (arcs.includes('maturation')) {
    return 'coming_of_age';
  }

  // Odyssey: long journey with challenges
  if (chapters.length >= 4 && hasChallenge) {
    return 'odyssey';
  }

  // Default to steady climb
  return 'steadyClimb';
}

/**
 * Overall arc Chinese names
 */
const OVERALL_ARC_CHINESE: Record<OverallArc, string> = {
  heroJourney: '英雄之旅',
  loveStory: '爱情故事',
  redemption: '救赎之旅',
  coming_of_age: '成长故事',
  odyssey: '奥德赛',
  phoenix: '凤凰涅槃',
  steadyClimb: '稳步攀升',
  wavePattern: '波浪变化',
  spiral: '螺旋之路'
};

// ============================================================================
// THEME EXTRACTION
// ============================================================================

/**
 * Extract overall themes from all chapters
 */
function extractOverallThemes(
  chapters: StoryChapter[],
  lifeThemes?: string[]
): { en: string[]; zh: string[] } {
  const themes = new Set<string>();

  // Add life themes if provided
  if (lifeThemes) {
    for (const theme of lifeThemes) {
      themes.add(theme);
    }
  }

  // Extract from chapters
  for (const chapter of chapters) {
    for (const theme of chapter.themes) {
      themes.add(theme);
    }
  }

  // Always include some universal themes
  themes.add('growth');
  themes.add('transformation');

  const enThemes = Array.from(themes);

  // Translate to Chinese
  const themeTranslations: Record<string, string> = {
    'personal growth': '个人成长',
    'romantic connection': '浪漫连接',
    'overcoming obstacles': '克服障碍',
    'transformation': '转变',
    'healing': '愈合',
    'expansion': '扩展',
    'commitment': '承诺',
    'building trust': '建立信任',
    'breakthrough moments': '突破时刻',
    'pivotal change': '关键转变',
    'navigating challenges': '应对挑战',
    'recovery and renewal': '恢复与更新',
    'passion': '激情',
    'tenderness': '温柔',
    'triumph': '胜利',
    'metamorphosis': '蜕变',
    'growth': '成长'
  };

  const zhThemes = enThemes.map(t => themeTranslations[t] || t);

  return { en: enThemes, zh: zhThemes };
}

// ============================================================================
// MAIN ENGINE
// ============================================================================

/**
 * Generate complete predictive story
 */
export function generatePredictiveStory(
  input: StoryEngineInput
): StoryEngineResult {
  try {
    const {
      timing,
      environment,
      lifecycle,
      events,
      lifeThemes,
      narrativeStyle = 'mythic'
    } = input;

    // Validate input
    if (!timing || timing.length === 0) {
      return { success: false, error: 'No timing windows provided' };
    }

    // Step 1: Build story beats from timing windows
    const beats = buildStoryBeats(timing, environment, lifecycle, events);

    if (beats.length === 0) {
      return { success: false, error: 'No story beats generated' };
    }

    // Step 2: Group beats into chapters
    let chapters = groupBeatsIntoChapters(beats);

    if (chapters.length === 0) {
      return { success: false, error: 'No chapters generated' };
    }

    // Step 3: Generate narratives for each chapter
    chapters = chapters.map(chapter => {
      const narratives = writeChapterNarrative(chapter, narrativeStyle);
      return {
        ...chapter,
        narrative: narratives.en,
        narrativeChinese: narratives.zh
      };
    });

    // Step 4: Determine overall arc
    const overallArc = determineOverallArc(chapters);

    // Step 5: Extract themes
    const themes = extractOverallThemes(chapters, lifeThemes);

    // Step 6: Generate prologue and epilogue
    const prologue = generatePrologue(overallArc, themes.en, narrativeStyle);
    const epilogue = generateEpilogue(chapters[chapters.length - 1], overallArc, narrativeStyle);

    // Step 7: Generate title
    const title = generateStoryTitle(overallArc, themes.en);

    // Step 8: Calculate current position
    const now = new Date().toISOString().split('T')[0];
    const progression = calculateStoryProgression(chapters, now);

    // Step 9: Determine time span
    const timeSpan = {
      start: chapters[0].timeSpan.start,
      end: chapters[chapters.length - 1].timeSpan.end
    };

    // Build complete story
    const story: PredictiveStory = {
      chapters,
      overallArc,
      overallArcChinese: OVERALL_ARC_CHINESE[overallArc],
      themes: themes.en,
      themesChinese: themes.zh,
      title: title.en,
      titleChinese: title.zh,
      prologue: prologue.en,
      prologueChinese: prologue.zh,
      epilogue: epilogue.en,
      epilogueChinese: epilogue.zh,
      timeSpan,
      currentChapter: progression.chapter,
      currentBeat: progression.beat,
      progress: progression.percent
    };

    return { success: true, data: story };

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

// ============================================================================
// STORY ANALYSIS
// ============================================================================

/**
 * Get story summary for quick display
 */
export function getStorySummary(story: PredictiveStory): {
  title: string;
  arc: string;
  currentPhase: string;
  progress: number;
  keyThemes: string[];
  climacticMoment: string | null;
} {
  const currentChapter = story.chapters[story.currentChapter - 1];

  return {
    title: story.title,
    arc: story.overallArcChinese,
    currentPhase: currentChapter?.title || 'Unknown',
    progress: story.progress,
    keyThemes: story.themes.slice(0, 3),
    climacticMoment: findClimaticChapter(story.chapters)?.title || null
  };
}

/**
 * Get current chapter narrative
 */
export function getCurrentChapterNarrative(
  story: PredictiveStory
): { title: string; narrative: string } | null {
  const chapter = story.chapters[story.currentChapter - 1];

  if (!chapter) return null;

  return {
    title: chapter.title,
    narrative: chapter.narrative
  };
}

/**
 * Get upcoming turning points
 */
export function getUpcomingTurningPoints(
  story: PredictiveStory
): Array<{ chapter: string; timeRange: string }> {
  const now = new Date().toISOString().split('T')[0];

  return story.chapters
    .filter(ch =>
      ch.chapterArc === 'turningPoint' &&
      ch.timeSpan.start > now
    )
    .map(ch => ({
      chapter: ch.title,
      timeRange: `${ch.timeSpan.start} to ${ch.timeSpan.end}`
    }));
}

/**
 * Get beat trajectory summary
 */
export function getTrajectory(story: PredictiveStory): string {
  const allBeats = story.chapters.flatMap(ch => ch.beats);
  const trajectory = calculateBeatTrajectory(allBeats);

  const descriptions: Record<string, string> = {
    rising: 'The overall trajectory is ascending, with energy building over time.',
    falling: 'The overall trajectory is descending, with energy consolidating.',
    stable: 'The overall trajectory is stable, maintaining steady energy.',
    volatile: 'The overall trajectory is dynamic, with significant fluctuations.'
  };

  return descriptions[trajectory];
}

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

export { buildStoryBeats } from './storyBeats';
export { groupBeatsIntoChapters } from './storyChapters';
export { writeChapterNarrative } from './storyNarrative';
