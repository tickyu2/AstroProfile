/**
 * Outcome Timeline Component
 *
 * Interactive timeline showing how relationship outcomes change over time.
 * Features: auto-scrub, keyboard navigation, zoom levels, heatmap overlay.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';

// ========================================
// OUTCOME COLOR MAPPING
// ========================================

const OUTCOME_COLORS = {
  DoNow: {
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500',
    text: 'text-emerald-400',
    fill: '#34d399'
  },
  GoodWindow: {
    bg: 'bg-amber-500/20',
    border: 'border-amber-500',
    text: 'text-amber-400',
    fill: '#fbbf24'
  },
  Neutral: {
    bg: 'bg-slate-500/20',
    border: 'border-slate-500',
    text: 'text-slate-400',
    fill: '#94a3b8'
  },
  Delay: {
    bg: 'bg-orange-500/20',
    border: 'border-orange-500',
    text: 'text-orange-400',
    fill: '#fb923c'
  },
  Avoid: {
    bg: 'bg-red-500/20',
    border: 'border-red-500',
    text: 'text-red-400',
    fill: '#f87171'
  }
};

// ========================================
// TIMELINE POINT COMPONENT
// ========================================

function TimelinePoint({
  point,
  isActive,
  showHeatmap,
  heatmapIntensity,
  onClick,
  onHover,
  compact
}) {
  const colors = OUTCOME_COLORS[point.outcome] || OUTCOME_COLORS.Neutral;

  return (
    <div
      className={`
        outcome-timeline__point
        ${colors.bg}
        ${isActive ? 'outcome-timeline__point--active' : ''}
      `}
      onClick={() => onClick?.(point)}
      onMouseEnter={() => onHover?.(point)}
      role="button"
      tabIndex={0}
      aria-label={`${point.date}: ${point.outcome}`}
    >
      {/* Heatmap overlay */}
      {showHeatmap && (
        <div
          className="outcome-timeline__heat"
          style={{ backgroundColor: `rgba(255, 90, 120, ${Math.min(1, heatmapIntensity * 2)})` }}
        />
      )}

      {/* Score bar */}
      <div className="outcome-timeline__bar">
        <div
          className="outcome-timeline__bar-fill"
          style={{
            width: `${point.decisionScore * 100}%`,
            backgroundColor: colors.fill
          }}
        />
      </div>

      {/* Date label */}
      {!compact && (
        <div className="outcome-timeline__date">
          {formatDate(point.date)}
        </div>
      )}

      {/* Outcome indicator */}
      <div className={`outcome-timeline__indicator ${colors.text}`}>
        {getOutcomeIcon(point.outcome)}
      </div>
    </div>
  );
}

// ========================================
// ZOOM CONTROLS
// ========================================

function ZoomControls({ zoom, onZoomChange }) {
  return (
    <div className="outcome-timeline__zoom-controls">
      {['day', 'week', 'month'].map(level => (
        <button
          key={level}
          onClick={() => onZoomChange(level)}
          className={`
            outcome-timeline__zoom-btn
            ${zoom === level ? 'outcome-timeline__zoom-btn--active' : ''}
          `}
        >
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </button>
      ))}
    </div>
  );
}

// ========================================
// PLAYBACK CONTROLS
// ========================================

function PlaybackControls({
  isPlaying,
  onPlayPause,
  onStepBack,
  onStepForward,
  speed,
  onSpeedChange
}) {
  return (
    <div className="outcome-timeline__playback">
      <button onClick={onStepBack} className="outcome-timeline__playback-btn" title="Previous (Left Arrow)">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      <button onClick={onPlayPause} className="outcome-timeline__playback-btn outcome-timeline__playback-btn--main">
        {isPlaying ? (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <button onClick={onStepForward} className="outcome-timeline__playback-btn" title="Next (Right Arrow)">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      </button>

      <select
        value={speed}
        onChange={e => onSpeedChange(parseFloat(e.target.value))}
        className="outcome-timeline__speed-select"
      >
        <option value="0.5">0.5x</option>
        <option value="1">1x</option>
        <option value="2">2x</option>
        <option value="4">4x</option>
      </select>
    </div>
  );
}

// ========================================
// MAIN TIMELINE COMPONENT
// ========================================

function OutcomeTimeline({
  series,
  activeDate,
  onHover,
  onClick,
  showHeatmap = false,
  showPlayback = true,
  showZoom = true,
  compact = false,
  className = ''
}) {
  const [zoom, setZoom] = useState('day');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  const containerRef = useRef(null);
  const playIntervalRef = useRef(null);

  const points = series?.points || [];

  // Find active index
  const activeIndex = points.findIndex(p => p.date === activeDate);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepBack();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepForward();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [points, activeIndex]);

  // Auto-play logic
  useEffect(() => {
    if (isPlaying && points.length > 0) {
      playIntervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          const next = (prev + 1) % points.length;
          onHover?.(points[next]);
          return next;
        });
      }, 800 / playbackSpeed);
    } else {
      clearInterval(playIntervalRef.current);
    }

    return () => clearInterval(playIntervalRef.current);
  }, [isPlaying, points, playbackSpeed, onHover]);

  // Sync current index with active date
  useEffect(() => {
    if (activeIndex >= 0) {
      setCurrentIndex(activeIndex);
    }
  }, [activeIndex]);

  const togglePlayback = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const stepBack = useCallback(() => {
    if (points.length === 0) return;
    const newIndex = Math.max(0, (activeIndex >= 0 ? activeIndex : currentIndex) - 1);
    onHover?.(points[newIndex]);
  }, [points, activeIndex, currentIndex, onHover]);

  const stepForward = useCallback(() => {
    if (points.length === 0) return;
    const newIndex = Math.min(points.length - 1, (activeIndex >= 0 ? activeIndex : currentIndex) + 1);
    onHover?.(points[newIndex]);
  }, [points, activeIndex, currentIndex, onHover]);

  // Compute heatmap intensity
  const getHeatmapIntensity = (point) => {
    if (!point.breakdown) return 0;
    return Math.abs(
      point.breakdown.retroDecisionDelta +
      point.breakdown.retroSynastryDelta +
      point.breakdown.autonomyBoost
    );
  };

  return (
    <div className={`outcome-timeline ${className}`} ref={containerRef}>
      {/* Controls */}
      <div className="outcome-timeline__controls">
        {showPlayback && (
          <PlaybackControls
            isPlaying={isPlaying}
            onPlayPause={togglePlayback}
            onStepBack={stepBack}
            onStepForward={stepForward}
            speed={playbackSpeed}
            onSpeedChange={setPlaybackSpeed}
          />
        )}

        {showZoom && (
          <ZoomControls zoom={zoom} onZoomChange={setZoom} />
        )}

        {showHeatmap && (
          <div className="outcome-timeline__heatmap-toggle">
            <span className="text-xs text-cathedral-slate-400">Heatmap: ON</span>
          </div>
        )}
      </div>

      {/* Timeline track */}
      <div className="outcome-timeline__track">
        {points.map((point, idx) => (
          <TimelinePoint
            key={point.date}
            point={point}
            isActive={point.date === activeDate || idx === currentIndex}
            showHeatmap={showHeatmap}
            heatmapIntensity={getHeatmapIntensity(point)}
            onClick={onClick}
            onHover={onHover}
            compact={compact}
          />
        ))}
      </div>

      {/* Summary */}
      {series?.summary && (
        <div className="outcome-timeline__summary">
          <span>Avg: {(series.summary.averageScore * 100).toFixed(0)}%</span>
          <span className="mx-2">|</span>
          <span>Dominant: {series.summary.dominantOutcome}</span>
          <span className="mx-2">|</span>
          <span>Volatility: {(series.summary.volatility * 100).toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getOutcomeIcon(outcome) {
  const icons = {
    DoNow: '\u{1F315}',
    GoodWindow: '\u{1F316}',
    Neutral: '\u{1F317}',
    Delay: '\u{1F318}',
    Avoid: '\u{1F311}'
  };
  return icons[outcome] || '\u{1F317}';
}

// ========================================
// TIMELINE CSS
// ========================================

export const TimelineStyles = `
.outcome-timeline {
  padding: 16px 0;
}

.outcome-timeline__controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.outcome-timeline__track {
  display: flex;
  gap: 8px;
  padding: 12px 0;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 128, 0.3) transparent;
}

.outcome-timeline__track::-webkit-scrollbar {
  height: 6px;
}

.outcome-timeline__track::-webkit-scrollbar-track {
  background: transparent;
}

.outcome-timeline__track::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 128, 0.3);
  border-radius: 3px;
}

.outcome-timeline__point {
  position: relative;
  min-width: 60px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 150ms ease, background 150ms ease;
  border: 1px solid transparent;
}

.outcome-timeline__point:hover {
  transform: translateY(-2px);
}

.outcome-timeline__point--active {
  transform: scale(1.05);
  border-color: rgba(255, 215, 128, 0.4);
  box-shadow: 0 0 16px rgba(255, 215, 128, 0.3);
}

.outcome-timeline__heat {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  pointer-events: none;
  opacity: 0.6;
}

.outcome-timeline__bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}

.outcome-timeline__bar-fill {
  height: 100%;
  transition: width 300ms ease;
}

.outcome-timeline__date {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  margin-bottom: 4px;
}

.outcome-timeline__indicator {
  text-align: center;
  font-size: 14px;
}

.outcome-timeline__summary {
  display: flex;
  justify-content: center;
  gap: 4px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 12px;
}

/* Playback controls */
.outcome-timeline__playback {
  display: flex;
  align-items: center;
  gap: 8px;
}

.outcome-timeline__playback-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 150ms ease;
}

.outcome-timeline__playback-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.outcome-timeline__playback-btn--main {
  width: 40px;
  height: 40px;
  background: rgba(255, 215, 128, 0.1);
  border-color: rgba(255, 215, 128, 0.3);
  color: var(--cathedral-gold, #ffd780);
}

.outcome-timeline__playback-btn--main:hover {
  background: rgba(255, 215, 128, 0.2);
}

.outcome-timeline__speed-select {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
  padding: 4px 8px;
  font-size: 11px;
}

/* Zoom controls */
.outcome-timeline__zoom-controls {
  display: flex;
  gap: 4px;
}

.outcome-timeline__zoom-btn {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
  cursor: pointer;
  transition: all 150ms ease;
}

.outcome-timeline__zoom-btn:hover {
  color: rgba(255, 255, 255, 0.8);
}

.outcome-timeline__zoom-btn--active {
  background: rgba(255, 215, 128, 0.1);
  border-color: rgba(255, 215, 128, 0.3);
  color: var(--cathedral-gold, #ffd780);
}

.outcome-timeline__heatmap-toggle {
  padding: 4px 8px;
  background: rgba(255, 90, 120, 0.1);
  border: 1px solid rgba(255, 90, 120, 0.3);
  border-radius: 4px;
}
`;

export default OutcomeTimeline;
