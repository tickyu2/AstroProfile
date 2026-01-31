/**
 * ============================================================================
 * STORY TIMELINE COMPONENT (故事时间线)
 * ============================================================================
 *
 * A horizontal timeline showing:
 * - Chapter spans (colored backgrounds)
 * - Beat markers (positioned dots)
 * - Current position indicator
 * - Hover tooltips with details
 *
 * Created: January 2026
 * ============================================================================
 */

import React, { useMemo, useState } from 'react';
import type { StoryBeat, StoryChapter, BeatType, ChapterArc } from '../storyTypes';
import type { DashboardTheme } from '../storyDashboardTypes';
import { CATHEDRAL_THEME } from '../storyDashboardTypes';

// ============================================================================
// TYPES
// ============================================================================

interface StoryTimelineProps {
  beats: StoryBeat[];
  chapters: StoryChapter[];
  currentPosition?: number; // 0-100 percentage
  onBeatClick?: (beat: StoryBeat) => void;
  onChapterClick?: (chapter: StoryChapter) => void;
  theme?: DashboardTheme;
  compact?: boolean;
}

interface TooltipData {
  x: number;
  y: number;
  content: {
    title: string;
    subtitle: string;
    details: string[];
  };
}

// ============================================================================
// CONSTANTS
// ============================================================================

const BEAT_ICONS: Record<BeatType, string> = {
  opening: '🌅',
  rising: '📈',
  peak: '⭐',
  conflict: '⚔️',
  turning: '🔄',
  healing: '💚',
  integration: '🔗',
  resolution: '✨'
};

const CHAPTER_ARC_LABELS: Record<ChapterArc, { en: string; zh: string }> = {
  awakening: { en: 'Awakening', zh: '觉醒' },
  deepening: { en: 'Deepening', zh: '深化' },
  challenge: { en: 'Challenge', zh: '挑战' },
  turningPoint: { en: 'Turning Point', zh: '转折' },
  renewal: { en: 'Renewal', zh: '更新' },
  maturation: { en: 'Maturation', zh: '成熟' },
  expansion: { en: 'Expansion', zh: '扩展' },
  integration: { en: 'Integration', zh: '整合' },
  resolution: { en: 'Resolution', zh: '解决' }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate position on timeline (0-100)
 */
function calculatePosition(
  date: string,
  startDate: string,
  endDate: string
): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const current = new Date(date).getTime();

  if (end === start) return 50;

  const position = ((current - start) / (end - start)) * 100;
  return Math.max(0, Math.min(100, position));
}

/**
 * Get chapter color based on arc
 */
function getChapterColor(arc: ChapterArc, theme: DashboardTheme): string {
  const arcColorMap: Record<ChapterArc, keyof typeof theme.colors> = {
    awakening: 'opening',
    deepening: 'integration',
    challenge: 'conflict',
    turningPoint: 'turning',
    renewal: 'healing',
    maturation: 'resolution',
    expansion: 'rising',
    integration: 'integration',
    resolution: 'resolution'
  };

  return theme.colors[arcColorMap[arc]];
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const StoryTimeline: React.FC<StoryTimelineProps> = ({
  beats,
  chapters,
  currentPosition = 0,
  onBeatClick,
  onChapterClick,
  theme = CATHEDRAL_THEME,
  compact = false
}) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [hoveredBeatId, setHoveredBeatId] = useState<string | null>(null);

  // Calculate time range from all chapters
  const timeRange = useMemo(() => {
    if (chapters.length === 0) return { start: '', end: '' };

    const start = chapters[0].timeSpan.start;
    const end = chapters[chapters.length - 1].timeSpan.end;
    return { start, end };
  }, [chapters]);

  // Process chapters for display
  const chapterSpans = useMemo(() => {
    return chapters.map(chapter => ({
      ...chapter,
      startPos: calculatePosition(chapter.timeSpan.start, timeRange.start, timeRange.end),
      endPos: calculatePosition(chapter.timeSpan.end, timeRange.start, timeRange.end)
    }));
  }, [chapters, timeRange]);

  // Process beats for display
  const beatMarkers = useMemo(() => {
    return beats.map(beat => {
      const midpoint = new Date(
        (new Date(beat.timeRange.start).getTime() + new Date(beat.timeRange.end).getTime()) / 2
      ).toISOString().split('T')[0];

      return {
        ...beat,
        position: calculatePosition(midpoint, timeRange.start, timeRange.end)
      };
    });
  }, [beats, timeRange]);

  // Handle beat hover
  const handleBeatHover = (
    beat: typeof beatMarkers[0],
    event: React.MouseEvent
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      content: {
        title: `${BEAT_ICONS[beat.beatType]} ${beat.beatType.charAt(0).toUpperCase() + beat.beatType.slice(1)}`,
        subtitle: `${beat.timeRange.start} → ${beat.timeRange.end}`,
        details: [
          `Intensity: ${beat.intensity}%`,
          `Tone: ${beat.emotionalTone}`,
          beat.summary.slice(0, 60) + '...'
        ]
      }
    });
    setHoveredBeatId(beat.id);
  };

  // Handle chapter hover
  const handleChapterHover = (
    chapter: typeof chapterSpans[0],
    event: React.MouseEvent
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      content: {
        title: `Chapter ${chapter.number}: ${chapter.title}`,
        subtitle: `${chapter.timeSpan.start} → ${chapter.timeSpan.end}`,
        details: [
          `Arc: ${CHAPTER_ARC_LABELS[chapter.chapterArc].en}`,
          `Intensity: ${chapter.intensity}%`,
          `Themes: ${chapter.themes.slice(0, 2).join(', ')}`
        ]
      }
    });
  };

  const height = compact ? 80 : 140;

  return (
    <div
      className="story-timeline"
      style={{
        position: 'relative',
        width: '100%',
        height: `${height}px`,
        background: theme.colors.surface,
        borderRadius: '12px',
        padding: '16px',
        boxSizing: 'border-box'
      }}
    >
      {/* Chapter Spans (Background Layer) */}
      <div
        style={{
          position: 'absolute',
          top: compact ? '20px' : '40px',
          left: '16px',
          right: '16px',
          height: compact ? '24px' : '32px',
          borderRadius: '4px',
          overflow: 'hidden',
          display: 'flex'
        }}
      >
        {chapterSpans.map((chapter, index) => {
          const width = chapter.endPos - chapter.startPos;
          const color = getChapterColor(chapter.chapterArc, theme);

          return (
            <div
              key={chapter.id}
              onClick={() => onChapterClick?.(chapter)}
              onMouseEnter={(e) => handleChapterHover(chapter, e)}
              onMouseLeave={() => setTooltip(null)}
              style={{
                width: `${width}%`,
                height: '100%',
                backgroundColor: color,
                opacity: 0.3,
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
                borderRight: index < chapterSpans.length - 1 ? `1px solid ${theme.colors.border}` : 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.opacity = '0.5';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.opacity = '0.3';
              }}
            />
          );
        })}
      </div>

      {/* Timeline Track */}
      <div
        style={{
          position: 'absolute',
          top: compact ? '30px' : '54px',
          left: '16px',
          right: '16px',
          height: '4px',
          backgroundColor: theme.colors.border,
          borderRadius: '2px'
        }}
      />

      {/* Beat Markers */}
      {beatMarkers.map(beat => {
        const color = theme.colors[beat.beatType as keyof typeof theme.colors] || theme.colors.accent;
        const isHovered = hoveredBeatId === beat.id;

        return (
          <div
            key={beat.id}
            onClick={() => onBeatClick?.(beat)}
            onMouseEnter={(e) => handleBeatHover(beat, e)}
            onMouseLeave={() => {
              setTooltip(null);
              setHoveredBeatId(null);
            }}
            style={{
              position: 'absolute',
              top: compact ? '24px' : '48px',
              left: `calc(${beat.position}% + 16px - 8px)`,
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: color,
              border: `2px solid ${isHovered ? theme.colors.gold : 'transparent'}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              transform: isHovered ? 'scale(1.3)' : 'scale(1)',
              zIndex: isHovered ? 10 : 1,
              boxShadow: isHovered
                ? `0 0 12px ${color}`
                : `0 2px 4px rgba(0,0,0,0.3)`
            }}
            title={`${beat.beatType}: ${beat.summary.slice(0, 40)}...`}
          />
        );
      })}

      {/* Current Position Indicator */}
      {currentPosition > 0 && (
        <div
          style={{
            position: 'absolute',
            top: compact ? '16px' : '36px',
            left: `calc(${currentPosition}% + 16px - 1px)`,
            width: '2px',
            height: compact ? '48px' : '68px',
            backgroundColor: theme.colors.gold,
            boxShadow: `0 0 8px ${theme.colors.gold}`,
            zIndex: 20
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-8px',
              left: '-6px',
              width: '14px',
              height: '14px',
              backgroundColor: theme.colors.gold,
              borderRadius: '50%',
              boxShadow: `0 0 12px ${theme.colors.gold}`
            }}
          />
        </div>
      )}

      {/* Chapter Labels (Bottom) */}
      {!compact && (
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '16px',
            right: '16px',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          {chapterSpans.map(chapter => {
            const centerPos = (chapter.startPos + chapter.endPos) / 2;
            const width = chapter.endPos - chapter.startPos;

            if (width < 10) return null; // Too small to show label

            return (
              <div
                key={`label-${chapter.id}`}
                style={{
                  position: 'absolute',
                  left: `${centerPos}%`,
                  transform: 'translateX(-50%)',
                  fontSize: '10px',
                  color: theme.colors.textMuted,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  maxWidth: `${width}%`
                }}
              >
                {chapter.title}
              </div>
            );
          })}
        </div>
      )}

      {/* Time Range Labels */}
      <div
        style={{
          position: 'absolute',
          top: '4px',
          left: '16px',
          fontSize: '10px',
          color: theme.colors.textMuted
        }}
      >
        {timeRange.start.slice(0, 4)}
      </div>
      <div
        style={{
          position: 'absolute',
          top: '4px',
          right: '16px',
          fontSize: '10px',
          color: theme.colors.textMuted
        }}
      >
        {timeRange.end.slice(0, 4)}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
            backgroundColor: '#1e1b4b',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '8px',
            padding: '12px',
            minWidth: '200px',
            zIndex: 1000,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          }}
        >
          <div style={{ fontWeight: 'bold', color: theme.colors.text, marginBottom: '4px' }}>
            {tooltip.content.title}
          </div>
          <div style={{ fontSize: '11px', color: theme.colors.gold, marginBottom: '8px' }}>
            {tooltip.content.subtitle}
          </div>
          {tooltip.content.details.map((detail, i) => (
            <div key={i} style={{ fontSize: '11px', color: theme.colors.textMuted }}>
              {detail}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryTimeline;
