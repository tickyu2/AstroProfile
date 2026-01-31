/**
 * ============================================================================
 * STORY DASHBOARD (故事仪表盘)
 * ============================================================================
 *
 * The rose window of the cathedral.
 * A unified UI panel showing:
 * - Beats & Chapters (Timeline)
 * - Emotional Arcs & Timing Curves (Dual Charts)
 * - Environmental Overlays (Qi Men + Feng Shui)
 *
 * This is the narrative cockpit of the metaphysics OS.
 *
 * Created: January 2026
 * ============================================================================
 */

import React, { useState, useMemo, useCallback } from 'react';
import type {
  StoryDashboardData,
  DashboardSelection,
  DashboardCallbacks,
  DashboardTheme,
  EmotionalArcPoint,
  TimingCurvePoint
} from '../storyDashboardTypes';
import { CATHEDRAL_THEME } from '../storyDashboardTypes';
import type { StoryBeat, StoryChapter } from '../storyTypes';

import { StoryTimeline } from './StoryTimeline';
import { EmotionalArcChart } from './EmotionalArcChart';
import { TimingCurveChart } from './TimingCurveChart';
import { QiMenGrid } from './QiMenGrid';
import { FengShuiCompass } from './FengShuiCompass';

import './StoryDashboard.css';

// ============================================================================
// TYPES
// ============================================================================

interface StoryDashboardProps {
  data: StoryDashboardData;
  callbacks?: DashboardCallbacks;
  theme?: DashboardTheme;
  compact?: boolean;
  showEnvironmental?: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const StoryDashboard: React.FC<StoryDashboardProps> = ({
  data,
  callbacks,
  theme = CATHEDRAL_THEME,
  compact = false,
  showEnvironmental = true
}) => {
  const [selection, setSelection] = useState<DashboardSelection>({});
  const [activeSection, setActiveSection] = useState<'timeline' | 'charts' | 'environment'>('timeline');

  const {
    beats,
    chapters,
    emotionalArc,
    timingCurve,
    environmental,
    currentPosition,
    metadata
  } = data;

  // Handle beat selection with synchronization
  const handleBeatSelect = useCallback((beat: StoryBeat) => {
    setSelection(prev => ({
      ...prev,
      beatId: beat.id,
      timePoint: beat.timeRange.start
    }));
    callbacks?.onBeatSelect?.(beat);
  }, [callbacks]);

  // Handle chapter selection
  const handleChapterSelect = useCallback((chapter: StoryChapter) => {
    setSelection(prev => ({
      ...prev,
      chapterId: chapter.id,
      timePoint: chapter.timeSpan.start
    }));
    callbacks?.onChapterSelect?.(chapter);
  }, [callbacks]);

  // Handle emotional arc point selection
  const handleEmotionalPointSelect = useCallback((point: EmotionalArcPoint) => {
    setSelection(prev => ({
      ...prev,
      timePoint: point.time
    }));
    callbacks?.onTimePointSelect?.(point.time);
  }, [callbacks]);

  // Handle timing curve point selection
  const handleTimingPointSelect = useCallback((point: TimingCurvePoint) => {
    setSelection(prev => ({
      ...prev,
      timePoint: point.time
    }));
    callbacks?.onTimePointSelect?.(point.time);
  }, [callbacks]);

  // Current chapter info
  const currentChapter = useMemo(() => {
    return chapters[currentPosition.chapter - 1];
  }, [chapters, currentPosition.chapter]);

  return (
    <div
      className={`story-dashboard ${theme.mode === 'dark' ? 'dark' : 'light'} ${compact ? 'compact' : ''}`}
      style={{
        background: theme.colors.background,
        color: theme.colors.text,
        fontFamily: theme.fonts.body
      }}
    >
      {/* Header */}
      <header className="story-dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title" style={{ fontFamily: theme.fonts.heading }}>
            {metadata.title}
          </h1>
          <span className="dashboard-subtitle" style={{ fontFamily: theme.fonts.chinese }}>
            {metadata.titleChinese}
          </span>
        </div>

        <div className="header-right">
          <div className="arc-badge" style={{ borderColor: theme.colors.gold }}>
            <span className="arc-label">Arc:</span>
            <span className="arc-value" style={{ color: theme.colors.gold }}>
              {metadata.arcChinese}
            </span>
          </div>

          <div className="progress-indicator">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${currentPosition.progress}%`,
                  backgroundColor: theme.colors.gold
                }}
              />
            </div>
            <span className="progress-text">{currentPosition.progress}% complete</span>
          </div>
        </div>
      </header>

      {/* Section Navigation (for compact mode) */}
      {compact && (
        <nav className="section-nav">
          <button
            className={activeSection === 'timeline' ? 'active' : ''}
            onClick={() => setActiveSection('timeline')}
          >
            Timeline
          </button>
          <button
            className={activeSection === 'charts' ? 'active' : ''}
            onClick={() => setActiveSection('charts')}
          >
            Charts
          </button>
          {showEnvironmental && (
            <button
              className={activeSection === 'environment' ? 'active' : ''}
              onClick={() => setActiveSection('environment')}
            >
              Environment
            </button>
          )}
        </nav>
      )}

      {/* Main Content */}
      <main className="story-dashboard-content">
        {/* Section 1: Story Timeline */}
        {(!compact || activeSection === 'timeline') && (
          <section className="dashboard-section timeline-section">
            <div className="section-header">
              <h2>
                <span className="section-icon">📜</span>
                Story Timeline
                <span className="section-chinese" style={{ fontFamily: theme.fonts.chinese }}>
                  故事时间线
                </span>
              </h2>
              {currentChapter && (
                <div className="current-chapter-badge">
                  Chapter {currentPosition.chapter}: {currentChapter.title}
                </div>
              )}
            </div>

            <StoryTimeline
              beats={beats}
              chapters={chapters}
              currentPosition={currentPosition.progress}
              onBeatClick={handleBeatSelect}
              onChapterClick={handleChapterSelect}
              theme={theme}
              compact={compact}
            />
          </section>
        )}

        {/* Section 2: Emotional Arc & Timing Curve */}
        {(!compact || activeSection === 'charts') && (
          <section className="dashboard-section charts-section">
            <div className="section-header">
              <h2>
                <span className="section-icon">📈</span>
                Emotional Arc & Timing Curve
                <span className="section-chinese" style={{ fontFamily: theme.fonts.chinese }}>
                  情绪弧线 + 运势曲线
                </span>
              </h2>
            </div>

            <div className="dual-chart-container">
              <div className="chart-panel">
                <h3 className="chart-title">Emotional Arc</h3>
                <EmotionalArcChart
                  data={emotionalArc}
                  onPointClick={handleEmotionalPointSelect}
                  selectedTime={selection.timePoint}
                  theme={theme}
                  height={compact ? 200 : 280}
                  showNarrative={!compact}
                />
              </div>

              <div className="chart-panel">
                <h3 className="chart-title">Destiny Timing Curve</h3>
                <TimingCurveChart
                  curve={timingCurve}
                  onPointClick={handleTimingPointSelect}
                  selectedTime={selection.timePoint}
                  theme={theme}
                  height={compact ? 200 : 280}
                  showNarrative={!compact}
                />
              </div>
            </div>
          </section>
        )}

        {/* Section 3: Environmental Overlay */}
        {showEnvironmental && (!compact || activeSection === 'environment') && (
          <section className="dashboard-section environmental-section">
            <div className="section-header">
              <h2>
                <span className="section-icon">🧭</span>
                Environmental Overlay
                <span className="section-chinese" style={{ fontFamily: theme.fonts.chinese }}>
                  环境叠加
                </span>
              </h2>
              {environmental.current && (
                <div
                  className="env-score-badge"
                  style={{
                    backgroundColor: `${theme.colors[environmental.current.tier]}20`,
                    color: theme.colors[environmental.current.tier as keyof typeof theme.colors],
                    borderColor: `${theme.colors[environmental.current.tier as keyof typeof theme.colors]}40`
                  }}
                >
                  Score: {environmental.current.score} ({environmental.current.tier})
                </div>
              )}
            </div>

            <div className="environmental-container">
              <div className="env-panel">
                <h3 className="env-title">
                  Qi Men Dun Jia
                  <span style={{ fontFamily: theme.fonts.chinese, marginLeft: '8px', opacity: 0.7 }}>
                    奇门遁甲
                  </span>
                </h3>
                <QiMenGrid
                  snapshots={environmental.snapshots}
                  selectedTime={selection.timePoint}
                  onPalaceClick={(palace) => {
                    setSelection(prev => ({ ...prev, palaceNumber: palace.number }));
                    callbacks?.onPalaceSelect?.(palace.number);
                  }}
                  theme={theme}
                  compact={compact}
                />
              </div>

              <div className="env-panel">
                <h3 className="env-title">
                  Feng Shui Directions
                  <span style={{ fontFamily: theme.fonts.chinese, marginLeft: '8px', opacity: 0.7 }}>
                    风水方位
                  </span>
                </h3>
                <FengShuiCompass
                  snapshots={environmental.snapshots}
                  selectedTime={selection.timePoint}
                  onDirectionClick={(dir) => {
                    setSelection(prev => ({ ...prev, direction: dir.direction }));
                    callbacks?.onDirectionSelect?.(dir.direction);
                  }}
                  theme={theme}
                  size={compact ? 240 : 300}
                />
              </div>
            </div>

            {/* Environmental Summary */}
            {!compact && environmental.summary && (
              <div className="env-summary">
                <p>{environmental.summary}</p>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer with metadata */}
      <footer className="story-dashboard-footer">
        <div className="footer-left">
          <span className="time-span">
            {metadata.timeSpan.start.slice(0, 4)} → {metadata.timeSpan.end.slice(0, 4)}
          </span>
        </div>
        <div className="footer-right">
          <span className="sync-indicator" style={{ color: theme.colors.gold }}>
            {selection.timePoint ? `Viewing: ${selection.timePoint.slice(0, 4)}` : 'Click to explore'}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default StoryDashboard;
