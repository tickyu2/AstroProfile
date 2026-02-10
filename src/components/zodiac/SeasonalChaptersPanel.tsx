/**
 * SeasonalChaptersPanel - Transit-driven seasonal narrative arcs
 *
 * Renders:
 *   1. Timeline header with event count
 *   2. Seasonal chapter cards (expandable)
 *   3. Story beats within each chapter
 *   4. Relationship weather summary
 *
 * GENESIS AstroProfile - February 2026
 */

import React, { useState } from 'react';
import type { SeasonalChapter } from '../../zodiac/compatibility/seasonalChapter';
import type { StoryBeat } from '../../zodiac/compatibility/storyEvent';

// =============================================================================
// TYPES
// =============================================================================

interface SeasonalChaptersPanelProps {
  chapters: SeasonalChapter[];
  totalBeats: number;
}

// =============================================================================
// SEASON AESTHETICS
// =============================================================================

const SEASON_STYLE: Record<string, { icon: string; color: string; bg: string }> = {
  Winter: { icon: '\u2744\uFE0F', color: '#93c5fd', bg: 'rgba(147, 197, 253, 0.06)' },
  Spring: { icon: '\uD83C\uDF31', color: '#86efac', bg: 'rgba(134, 239, 172, 0.06)' },
  Summer: { icon: '\u2600\uFE0F', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.06)' },
  Autumn: { icon: '\uD83C\uDF42', color: '#f97316', bg: 'rgba(249, 115, 22, 0.06)' },
};

function getSeasonKey(seasonLabel: string): string {
  if (seasonLabel.includes('Winter')) return 'Winter';
  if (seasonLabel.includes('Spring')) return 'Spring';
  if (seasonLabel.includes('Summer')) return 'Summer';
  if (seasonLabel.includes('Autumn')) return 'Autumn';
  return 'Winter';
}

// =============================================================================
// BEAT CARD
// =============================================================================

const BeatCard: React.FC<{ beat: StoryBeat }> = ({ beat }) => {
  const isOpens = beat.direction === 'opens';
  const dirColor = isOpens ? '#86efac' : '#fca5a5';
  const dirLabel = isOpens ? 'Opens' : 'Tests';

  return (
    <div className="scp-beat">
      <div className="scp-beat-header">
        <span className="scp-beat-label">{beat.label}</span>
        <span className="scp-beat-dir" style={{ color: dirColor }}>
          {dirLabel}
        </span>
      </div>
      <p className="scp-beat-narrative">{beat.narrative}</p>
    </div>
  );
};

// =============================================================================
// COMPONENT
// =============================================================================

export const SeasonalChaptersPanel: React.FC<SeasonalChaptersPanelProps> = ({
  chapters,
  totalBeats,
}) => {
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);

  if (chapters.length === 0) return null;

  const toggleSeason = (i: number) => {
    setExpandedSeason(prev => (prev === i ? null : i));
  };

  return (
    <div className="scp-container">
      {/* Header */}
      <div className="scp-header">
        <h4 className="scp-title">Seasonal Transit Chapters</h4>
        <p className="scp-subtitle">
          {totalBeats} transit event{totalBeats !== 1 ? 's' : ''} across {chapters.length} season{chapters.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Chapter cards */}
      <div className="scp-chapters">
        {chapters.map((ch, i) => {
          const key = getSeasonKey(ch.season);
          const style = SEASON_STYLE[key] || SEASON_STYLE.Winter;
          const isExpanded = expandedSeason === i;
          const opens = ch.events.filter(e => e.direction === 'opens').length;
          const tests = ch.events.filter(e => e.direction === 'tests').length;

          return (
            <div key={i} className="scp-chapter" style={{ background: style.bg }}>
              <button
                type="button"
                className="scp-chapter-header"
                onClick={() => toggleSeason(i)}
              >
                <div className="scp-chapter-left">
                  <span className="scp-season-icon">{style.icon}</span>
                  <div>
                    <span className="scp-season-name" style={{ color: style.color }}>
                      {ch.season}
                    </span>
                    <span className="scp-season-theme">{ch.theme}</span>
                  </div>
                </div>
                <div className="scp-chapter-right">
                  <div className="scp-event-counts">
                    {opens > 0 && (
                      <span className="scp-count-opens">{opens} open{opens !== 1 ? 's' : ''}</span>
                    )}
                    {tests > 0 && (
                      <span className="scp-count-tests">{tests} test{tests !== 1 ? 's' : ''}</span>
                    )}
                  </div>
                  <span className="scp-toggle">
                    {isExpanded ? '\u25B2' : '\u25BC'}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="scp-chapter-body">
                  <p className="scp-chapter-summary">{ch.summary}</p>
                  <div className="scp-beats">
                    {ch.events.map((beat, j) => (
                      <BeatCard key={j} beat={beat} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .scp-container {
          margin-top: 16px;
          color: #e5e7eb;
        }

        .scp-header {
          margin-bottom: 10px;
        }

        .scp-title {
          font-size: 16px;
          font-weight: 700;
          color: #fbbf24;
          margin: 0;
        }

        .scp-subtitle {
          font-size: 12px;
          color: #9ca3af;
          margin: 4px 0 0 0;
        }

        /* Chapter cards */
        .scp-chapters {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .scp-chapter {
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          overflow: hidden;
        }

        .scp-chapter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 12px 14px;
          background: transparent;
          border: none;
          color: #e5e7eb;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
        }

        .scp-chapter-header:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .scp-chapter-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .scp-season-icon {
          font-size: 20px;
        }

        .scp-season-name {
          display: block;
          font-size: 13px;
          font-weight: 700;
        }

        .scp-season-theme {
          display: block;
          font-size: 11px;
          color: #9ca3af;
          font-style: italic;
        }

        .scp-chapter-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .scp-event-counts {
          display: flex;
          gap: 6px;
        }

        .scp-count-opens {
          font-size: 10px;
          color: #86efac;
          padding: 2px 6px;
          background: rgba(134, 239, 172, 0.1);
          border-radius: 10px;
        }

        .scp-count-tests {
          font-size: 10px;
          color: #fca5a5;
          padding: 2px 6px;
          background: rgba(252, 165, 165, 0.1);
          border-radius: 10px;
        }

        .scp-toggle {
          font-size: 10px;
          color: #6b7280;
        }

        /* Expanded body */
        .scp-chapter-body {
          padding: 0 14px 14px;
        }

        .scp-chapter-summary {
          font-size: 12px;
          line-height: 1.6;
          color: #d1d5db;
          margin: 0 0 10px 0;
          border-left: 2px solid rgba(255, 255, 255, 0.1);
          padding-left: 10px;
        }

        /* Story beats */
        .scp-beats {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .scp-beat {
          padding: 8px 10px;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 6px;
        }

        .scp-beat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .scp-beat-label {
          font-size: 11px;
          font-weight: 600;
          color: #e5e7eb;
        }

        .scp-beat-dir {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .scp-beat-narrative {
          font-size: 11px;
          line-height: 1.6;
          color: #9ca3af;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default SeasonalChaptersPanel;
