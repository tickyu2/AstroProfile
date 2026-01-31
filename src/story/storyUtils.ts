/**
 * ============================================================================
 * STORY UTILITIES (故事工具)
 * ============================================================================
 *
 * Dashboard integration and utility functions for the Predictive Story Engine.
 *
 * Features:
 * - Story card generation for UI display
 * - Timeline visualization data
 * - Progress tracking
 * - Quick insights
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  PredictiveStory,
  StoryBeat,
  StoryChapter,
  StoryEngineInput,
  EnvironmentalContext,
  LifecycleContext,
  EventTriggerContext,
  TimingWindow
} from './storyTypes';

import { generatePredictiveStory } from './storyEngine';

// ============================================================================
// STORY CARD FOR UI
// ============================================================================

/**
 * Story card data for dashboard display
 */
export interface StoryCard {
  title: string;
  titleChinese: string;
  arc: string;
  arcChinese: string;
  currentChapter: {
    number: number;
    title: string;
    titleChinese: string;
    emotionalTone: string;
    progress: number;
  };
  progress: number;
  keyInsight: string;
  keyInsightChinese: string;
  themes: string[];
  nextMilestone: string | null;
}

/**
 * Generate story card for dashboard display
 */
export function generateStoryCard(story: PredictiveStory): StoryCard {
  const currentChapter = story.chapters[story.currentChapter - 1];
  const currentBeat = currentChapter?.beats[story.currentBeat - 1];

  // Calculate chapter progress
  const chapterProgress = currentChapter
    ? Math.round((story.currentBeat / currentChapter.beats.length) * 100)
    : 0;

  // Generate key insight based on current position
  const keyInsight = generateKeyInsight(story, currentChapter, currentBeat);

  // Find next milestone
  const nextMilestone = findNextMilestone(story);

  return {
    title: story.title,
    titleChinese: story.titleChinese,
    arc: story.overallArc,
    arcChinese: story.overallArcChinese,
    currentChapter: {
      number: story.currentChapter,
      title: currentChapter?.title || 'Unknown',
      titleChinese: currentChapter?.titleChinese || '未知',
      emotionalTone: currentBeat?.emotionalTone || 'reflective',
      progress: chapterProgress
    },
    progress: story.progress,
    keyInsight: keyInsight.en,
    keyInsightChinese: keyInsight.zh,
    themes: story.themes.slice(0, 3),
    nextMilestone
  };
}

/**
 * Generate key insight from current story position
 */
function generateKeyInsight(
  story: PredictiveStory,
  chapter: StoryChapter | undefined,
  beat: StoryBeat | undefined
): { en: string; zh: string } {
  if (!chapter || !beat) {
    return {
      en: 'Your story continues to unfold.',
      zh: '你的故事继续展开。'
    };
  }

  const intensity = beat.intensity;

  if (intensity >= 80) {
    return {
      en: `This is a peak moment in your ${chapter.title.toLowerCase()} phase.`,
      zh: `这是你${chapter.titleChinese}阶段的高峰时刻。`
    };
  }

  if (intensity >= 60) {
    return {
      en: `Energy is building in your ${chapter.title.toLowerCase()} phase.`,
      zh: `能量在你的${chapter.titleChinese}阶段积聚。`
    };
  }

  if (intensity <= 30) {
    return {
      en: `A quieter period for integration and rest.`,
      zh: `一个安静的整合与休息时期。`
    };
  }

  return {
    en: `You are navigating the ${chapter.title.toLowerCase()} phase.`,
    zh: `你正在经历${chapter.titleChinese}阶段。`
  };
}

/**
 * Find next significant milestone
 */
function findNextMilestone(story: PredictiveStory): string | null {
  const now = new Date().toISOString().split('T')[0];

  // Find next peak or turning point beat
  for (const chapter of story.chapters) {
    for (const beat of chapter.beats) {
      if (beat.timeRange.start > now) {
        if (beat.beatType === 'peak') {
          return `Peak moment arriving: ${beat.timeRange.start}`;
        }
        if (beat.beatType === 'turning') {
          return `Turning point approaching: ${beat.timeRange.start}`;
        }
      }
    }
  }

  return null;
}

// ============================================================================
// TIMELINE VISUALIZATION
// ============================================================================

/**
 * Timeline segment for visualization
 */
export interface TimelineSegment {
  id: string;
  start: string;
  end: string;
  label: string;
  type: 'chapter' | 'beat';
  intensity: number;
  color: string;
  isCurrent: boolean;
}

/**
 * Generate timeline data for visualization
 */
export function generateTimelineData(story: PredictiveStory): TimelineSegment[] {
  const now = new Date().toISOString().split('T')[0];
  const segments: TimelineSegment[] = [];

  for (const chapter of story.chapters) {
    // Add chapter segment
    const isCurrent = now >= chapter.timeSpan.start && now <= chapter.timeSpan.end;

    segments.push({
      id: chapter.id,
      start: chapter.timeSpan.start,
      end: chapter.timeSpan.end,
      label: chapter.title,
      type: 'chapter',
      intensity: chapter.intensity,
      color: getIntensityColor(chapter.intensity),
      isCurrent
    });

    // Add beat segments
    for (const beat of chapter.beats) {
      const beatIsCurrent = now >= beat.timeRange.start && now <= beat.timeRange.end;

      segments.push({
        id: beat.id,
        start: beat.timeRange.start,
        end: beat.timeRange.end,
        label: beat.beatType,
        type: 'beat',
        intensity: beat.intensity,
        color: getBeatColor(beat.beatType),
        isCurrent: beatIsCurrent
      });
    }
  }

  return segments;
}

/**
 * Get color based on intensity
 */
function getIntensityColor(intensity: number): string {
  if (intensity >= 80) return '#22c55e'; // Green - high energy
  if (intensity >= 60) return '#3b82f6'; // Blue - good energy
  if (intensity >= 40) return '#a855f7'; // Purple - moderate
  if (intensity >= 20) return '#f59e0b'; // Amber - caution
  return '#ef4444'; // Red - challenging
}

/**
 * Get color based on beat type
 */
function getBeatColor(beatType: string): string {
  const colors: Record<string, string> = {
    opening: '#60a5fa',    // Light blue
    rising: '#34d399',     // Emerald
    peak: '#fbbf24',       // Amber
    conflict: '#f87171',   // Red
    turning: '#a78bfa',    // Purple
    healing: '#2dd4bf',    // Teal
    integration: '#818cf8', // Indigo
    resolution: '#22c55e'  // Green
  };
  return colors[beatType] || '#94a3b8';
}

// ============================================================================
// QUICK STORY GENERATION
// ============================================================================

/**
 * Simplified input for quick story generation
 */
export interface QuickStoryInput {
  /** Array of yearly scores (e.g., from DaYun) */
  yearlyScores: Array<{ year: number; score: number; events?: string[] }>;

  /** Current lifecycle phase */
  currentPhase: string;

  /** Optional environmental score override */
  environmentalScore?: number;

  /** Optional narrative style */
  style?: 'mythic' | 'emotional' | 'poetic' | 'practical';

  /** Optional life themes */
  themes?: string[];
}

/**
 * Generate story from simplified input
 */
export function generateQuickStory(input: QuickStoryInput): PredictiveStory | null {
  // Convert to full StoryEngineInput
  const timing: TimingWindow[] = input.yearlyScores.map(ys => ({
    year: ys.year,
    score: ys.score,
    favorable: ys.score >= 50,
    description: ys.score >= 70 ? 'Favorable period' : ys.score >= 40 ? 'Mixed period' : 'Challenging period',
    events: ys.events || []
  }));

  const environment: EnvironmentalContext = {
    environmentalScore: input.environmentalScore || 60,
    tier: input.environmentalScore && input.environmentalScore >= 70 ? 'good' : 'mixed',
    bestDirections: [],
    avoidDirections: [],
    notes: []
  };

  const lifecycle: LifecycleContext = {
    phase: input.currentPhase,
    phaseChinese: input.currentPhase,
    year: 1,
    intensity: 60,
    description: input.currentPhase
  };

  const events: EventTriggerContext = {
    triggers: [],
    overallActivation: 50
  };

  const fullInput: StoryEngineInput = {
    timing,
    environment,
    lifecycle,
    events,
    lifeThemes: input.themes,
    narrativeStyle: input.style || 'mythic'
  };

  const result = generatePredictiveStory(fullInput);

  return result.success ? result.data : null;
}

// ============================================================================
// STORY EXPORT
// ============================================================================

/**
 * Export story as markdown
 */
export function exportStoryAsMarkdown(story: PredictiveStory): string {
  let md = `# ${story.title}\n\n`;
  md += `*${story.overallArcChinese}*\n\n`;
  md += `---\n\n`;
  md += `## Prologue\n\n${story.prologue}\n\n`;

  for (const chapter of story.chapters) {
    md += `---\n\n`;
    md += `## Chapter ${chapter.number}: ${chapter.title}\n\n`;
    md += `*${chapter.titleChinese} | ${chapter.timeSpan.start} to ${chapter.timeSpan.end}*\n\n`;
    md += `${chapter.narrative}\n\n`;

    if (chapter.themes.length > 0) {
      md += `**Themes:** ${chapter.themes.join(', ')}\n\n`;
    }

    if (chapter.foreshadowing.length > 0) {
      md += `**Foreshadowing:** ${chapter.foreshadowing[0]}\n\n`;
    }
  }

  md += `---\n\n`;
  md += `## Epilogue\n\n${story.epilogue}\n\n`;
  md += `---\n\n`;
  md += `*Progress: ${story.progress}% | Current Chapter: ${story.currentChapter}*\n`;

  return md;
}

/**
 * Export story as JSON (for API responses)
 */
export function exportStoryAsJSON(story: PredictiveStory): string {
  return JSON.stringify(story, null, 2);
}

// ============================================================================
// STORY COMPARISON
// ============================================================================

/**
 * Compare two stories (e.g., for relationship compatibility)
 */
export interface StoryComparison {
  alignment: number;
  sharedThemes: string[];
  complementaryArcs: boolean;
  synchronizedPeaks: boolean;
  notes: string[];
}

/**
 * Compare two predictive stories
 */
export function compareStories(
  story1: PredictiveStory,
  story2: PredictiveStory
): StoryComparison {
  // Find shared themes
  const themes1 = new Set(story1.themes);
  const sharedThemes = story2.themes.filter(t => themes1.has(t));

  // Check arc complementarity
  const complementaryPairs = [
    ['heroJourney', 'loveStory'],
    ['steadyClimb', 'wavePattern'],
    ['phoenix', 'renewal'],
    ['coming_of_age', 'maturation']
  ];

  const complementaryArcs = complementaryPairs.some(pair =>
    (pair.includes(story1.overallArc) && pair.includes(story2.overallArc))
  ) || story1.overallArc === story2.overallArc;

  // Check for synchronized peaks
  const peaks1 = story1.chapters.flatMap(ch =>
    ch.beats.filter(b => b.beatType === 'peak').map(b => b.timeRange.start.slice(0, 4))
  );
  const peaks2Set = new Set(story2.chapters.flatMap(ch =>
    ch.beats.filter(b => b.beatType === 'peak').map(b => b.timeRange.start.slice(0, 4))
  ));
  const synchronizedPeaks = peaks1.some(p => peaks2Set.has(p));

  // Calculate overall alignment
  let alignment = 50;
  alignment += sharedThemes.length * 10;
  alignment += complementaryArcs ? 15 : 0;
  alignment += synchronizedPeaks ? 20 : 0;
  alignment = Math.min(100, alignment);

  // Generate notes
  const notes: string[] = [];

  if (sharedThemes.length > 0) {
    notes.push(`Shared themes: ${sharedThemes.join(', ')}`);
  }

  if (complementaryArcs) {
    notes.push('Your story arcs complement each other');
  }

  if (synchronizedPeaks) {
    notes.push('You have synchronized peak moments');
  }

  return {
    alignment,
    sharedThemes,
    complementaryArcs,
    synchronizedPeaks,
    notes
  };
}

// ============================================================================
// STORY INSIGHTS
// ============================================================================

/**
 * Get actionable insights from story
 */
export interface StoryInsight {
  type: 'opportunity' | 'warning' | 'guidance';
  title: string;
  description: string;
  timeframe: string;
  importance: 'high' | 'medium' | 'low';
}

/**
 * Extract insights from story
 */
export function extractStoryInsights(story: PredictiveStory): StoryInsight[] {
  const now = new Date().toISOString().split('T')[0];
  const insights: StoryInsight[] = [];

  for (const chapter of story.chapters) {
    for (const beat of chapter.beats) {
      // Only future beats
      if (beat.timeRange.start <= now) continue;

      // Peak = opportunity
      if (beat.beatType === 'peak') {
        insights.push({
          type: 'opportunity',
          title: 'Peak Moment Approaching',
          description: `A high-energy period in your ${chapter.title} phase. ${beat.summary}`,
          timeframe: beat.timeRange.start,
          importance: 'high'
        });
      }

      // Turning = guidance
      if (beat.beatType === 'turning') {
        insights.push({
          type: 'guidance',
          title: 'Turning Point Ahead',
          description: `A pivotal shift is indicated. ${beat.summary}`,
          timeframe: beat.timeRange.start,
          importance: 'high'
        });
      }

      // Conflict = warning
      if (beat.beatType === 'conflict' && beat.intensity <= 35) {
        insights.push({
          type: 'warning',
          title: 'Challenging Period',
          description: `Extra care advised during this time. ${beat.summary}`,
          timeframe: beat.timeRange.start,
          importance: 'medium'
        });
      }

      // Limit to 5 insights
      if (insights.length >= 5) break;
    }
    if (insights.length >= 5) break;
  }

  return insights;
}
