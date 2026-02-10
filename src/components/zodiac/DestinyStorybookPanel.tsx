/**
 * DestinyStorybookPanel - Auto-generated relationship myth + chamber rituals
 *
 * Renders:
 *   1. Storybook title + prologue
 *   2. Expandable chapters
 *   3. Epilogue
 *   4. Chamber-aligned rituals
 *
 * GENESIS AstroProfile - February 2026
 */

import React, { useState } from 'react';
import type { DestinyStorybook } from '../../zodiac/compatibility/destinyStorybook';
import type { RelationshipRitual } from '../../zodiac/compatibility/relationshipRituals';

// =============================================================================
// TYPES
// =============================================================================

interface DestinyStorybookPanelProps {
  storybook: DestinyStorybook;
  rituals: RelationshipRitual[];
}

// =============================================================================
// COMPONENT
// =============================================================================

export const DestinyStorybookPanel: React.FC<DestinyStorybookPanelProps> = ({
  storybook,
  rituals,
}) => {
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
  const [showRituals, setShowRituals] = useState(false);

  const toggleChapter = (i: number) => {
    setExpandedChapter(prev => (prev === i ? null : i));
  };

  return (
    <div className="dsb-container">
      {/* Section header */}
      <div className="dsb-header">
        <h4 className="dsb-title">Destiny Storybook</h4>
        <p className="dsb-subtitle">The auto-generated myth of your connection</p>
      </div>

      {/* Storybook title */}
      <div className="dsb-book-title">{storybook.title}</div>

      {/* Prologue */}
      <div className="dsb-prologue">
        <span className="dsb-prologue-label">Prologue</span>
        <p>{storybook.prologue}</p>
      </div>

      {/* Chapters (expandable) */}
      <div className="dsb-chapters">
        {storybook.chapters.map((ch, i) => (
          <div key={i} className="dsb-chapter">
            <button
              className="dsb-chapter-header"
              onClick={() => toggleChapter(i)}
            >
              <span className="dsb-chapter-title">{ch.title}</span>
              <span className="dsb-chapter-toggle">
                {expandedChapter === i ? '\u25B2' : '\u25BC'}
              </span>
            </button>
            {expandedChapter === i && (
              <div className="dsb-chapter-body">
                <p>{ch.body}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Epilogue */}
      <div className="dsb-epilogue">
        <span className="dsb-prologue-label">Epilogue</span>
        <p>{storybook.epilogue}</p>
      </div>

      {/* Rituals toggle */}
      {rituals.length > 0 && (
        <div className="dsb-rituals-section">
          <button
            className="dsb-rituals-toggle"
            onClick={() => setShowRituals(prev => !prev)}
          >
            <span>{showRituals ? '\u25B2' : '\u25BC'}</span>
            <span>Chamber Rituals ({rituals.length})</span>
          </button>

          {showRituals && (
            <div className="dsb-rituals-list">
              {rituals.map((ritual, i) => (
                <div
                  key={i}
                  className="dsb-ritual-card"
                  style={{ borderLeftColor: `${ritual.color}80` }}
                >
                  <div className="dsb-ritual-header">
                    <span className="dsb-ritual-icon" style={{ color: ritual.color }}>
                      {ritual.chamberIcon}
                    </span>
                    <div>
                      <span className="dsb-ritual-chamber">{ritual.chamber}</span>
                      <span className="dsb-ritual-title" style={{ color: ritual.color }}>
                        {ritual.title}
                      </span>
                    </div>
                  </div>
                  <p className="dsb-ritual-intent">{ritual.intent}</p>
                  <ol className="dsb-ritual-steps">
                    {ritual.instructions.map((step, j) => (
                      <li key={j}>{step}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        .dsb-container {
          margin-top: 16px;
          color: #e5e7eb;
        }

        .dsb-header {
          margin-bottom: 10px;
        }

        .dsb-title {
          font-size: 16px;
          font-weight: 700;
          color: #a78bfa;
          margin: 0;
        }

        .dsb-subtitle {
          font-size: 12px;
          color: #9ca3af;
          margin: 4px 0 0 0;
        }

        .dsb-book-title {
          font-size: 14px;
          font-weight: 700;
          color: #c4b5fd;
          text-align: center;
          padding: 10px;
          margin-bottom: 10px;
          background: rgba(167, 139, 250, 0.06);
          border-radius: 8px;
          font-style: italic;
        }

        /* Prologue + Epilogue */
        .dsb-prologue,
        .dsb-epilogue {
          border-left: 3px solid rgba(167, 139, 250, 0.4);
          padding: 10px 12px;
          margin-bottom: 10px;
          background: rgba(167, 139, 250, 0.04);
          border-radius: 6px;
        }

        .dsb-prologue-label {
          display: block;
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #a78bfa;
          margin-bottom: 4px;
        }

        .dsb-prologue p,
        .dsb-epilogue p {
          font-size: 12px;
          line-height: 1.7;
          color: #d1d5db;
          margin: 0;
        }

        /* Chapters */
        .dsb-chapters {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 10px;
        }

        .dsb-chapter {
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          overflow: hidden;
        }

        .dsb-chapter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.03);
          border: none;
          color: #e5e7eb;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
        }

        .dsb-chapter-header:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .dsb-chapter-title {
          font-size: 12px;
          font-weight: 600;
          color: #c4b5fd;
        }

        .dsb-chapter-toggle {
          font-size: 10px;
          color: #6b7280;
        }

        .dsb-chapter-body {
          padding: 10px 12px;
          background: rgba(0, 0, 0, 0.15);
        }

        .dsb-chapter-body p {
          font-size: 12px;
          line-height: 1.7;
          color: #d1d5db;
          margin: 0;
        }

        /* Rituals */
        .dsb-rituals-section {
          margin-top: 10px;
        }

        .dsb-rituals-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 10px 12px;
          background: rgba(167, 139, 250, 0.06);
          border: 1px solid rgba(167, 139, 250, 0.2);
          border-radius: 8px;
          color: #a78bfa;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          font-family: inherit;
        }

        .dsb-rituals-toggle:hover {
          background: rgba(167, 139, 250, 0.1);
        }

        .dsb-rituals-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 8px;
        }

        .dsb-ritual-card {
          border-left: 3px solid;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 6px;
        }

        .dsb-ritual-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .dsb-ritual-icon {
          font-size: 18px;
        }

        .dsb-ritual-chamber {
          display: block;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #9ca3af;
          font-weight: 600;
        }

        .dsb-ritual-title {
          display: block;
          font-size: 13px;
          font-weight: 700;
        }

        .dsb-ritual-intent {
          font-size: 11px;
          color: #9ca3af;
          margin: 0 0 8px 0;
          font-style: italic;
        }

        .dsb-ritual-steps {
          margin: 0;
          padding: 0 0 0 18px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dsb-ritual-steps li {
          font-size: 11px;
          line-height: 1.6;
          color: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default DestinyStorybookPanel;
