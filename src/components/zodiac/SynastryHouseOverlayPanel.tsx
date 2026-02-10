/**
 * SynastryHouseOverlayPanel - Synastry House Overlays UI
 *
 * Shows "Person A's planets in Person B's houses" and vice versa.
 * Color-coded by house mode: Angular (blue), Succedent (green), Cadent (purple).
 * Click-to-expand for detailed interpretation + house theme keywords.
 *
 * GENESIS AstroProfile - February 2026
 */

import React, { useState } from 'react';
import type {
  SynastryHouseOverlayPairResult,
  SynastryHouseOverlayResult,
  SynastryHouseOverlayEntry,
} from '../../engines/overlays/synastryHouseOverlay';
import { getModeColor } from '../../engines/overlays/synastryHouseOverlay';

// =============================================================================
// TYPES
// =============================================================================

interface SynastryHouseOverlayPanelProps {
  nameA: string;
  nameB: string;
  result: SynastryHouseOverlayPairResult;
}

// =============================================================================
// HELPERS
// =============================================================================

function getScoreColor(score: number): string {
  if (score >= 70) return '#22c55e';
  if (score >= 50) return '#84cc16';
  if (score >= 35) return '#eab308';
  if (score >= 20) return '#f97316';
  return '#ef4444';
}

function ordinal(n: number): string {
  const suffixes: Record<number, string> = { 1: 'st', 2: 'nd', 3: 'rd' };
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || 'th');
}

// =============================================================================
// COMPONENT
// =============================================================================

export const SynastryHouseOverlayPanel: React.FC<SynastryHouseOverlayPanelProps> = ({
  nameA,
  nameB,
  result,
}) => {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const toggleEntry = (key: string) => {
    setExpandedEntry(prev => (prev === key ? null : key));
  };

  const renderDirection = (
    direction: SynastryHouseOverlayResult,
    ownerName: string,
    targetName: string,
    prefix: string,
  ) => (
    <div className="sho-direction">
      <div className="sho-direction-header">
        <span className="sho-direction-title">
          {ownerName}&rsquo;s planets in {targetName}&rsquo;s houses
        </span>
        <span className="sho-direction-mode">
          {direction.dominantMode} emphasis
        </span>
      </div>

      <div className="sho-entries">
        {direction.entries.map((entry: SynastryHouseOverlayEntry) => {
          const key = `${prefix}-${entry.planet}`;
          const isExpanded = expandedEntry === key;
          const modeColor = getModeColor(entry.houseMode);

          return (
            <div key={key} className="sho-entry-wrapper">
              <div
                className={`sho-entry ${isExpanded ? 'expanded' : ''}`}
                onClick={() => toggleEntry(key)}
                style={{ borderLeftColor: modeColor }}
              >
                <span className="sho-planet-icon">{entry.planetIcon}</span>
                <span className="sho-planet-name">{entry.planet}</span>
                <span className="sho-arrow">{'\u2192'}</span>
                <span className="sho-house-num" style={{ color: modeColor }}>
                  {ordinal(entry.synastryHouse)}
                </span>
                <span className="sho-house-name">{entry.houseName}</span>
                <span className="sho-mode-dot" style={{ background: modeColor }} />
              </div>

              {isExpanded && (
                <div className="sho-entry-detail" style={{ borderLeftColor: modeColor }}>
                  <p className="sho-interpretation">{entry.interpretation}</p>
                  <div className="sho-keywords">
                    {entry.houseKeywords.map((kw, i) => (
                      <span key={i} className="sho-keyword" style={{ borderColor: `${modeColor}40`, color: modeColor }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                  <div className="sho-entry-meta">
                    <span className="sho-meta-mode" style={{ color: modeColor }}>{entry.houseMode}</span>
                    <span className="sho-meta-theme">{entry.houseTheme}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {direction.highlights.length > 0 && (
        <div className="sho-highlights">
          {direction.highlights.map((h, i) => (
            <span key={i} className="sho-highlight-chip">{h}</span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="sho-container">
      {/* Header */}
      <div className="sho-header">
        <div className="sho-title-row">
          <div>
            <h4 className="sho-title">Synastry House Overlays</h4>
            <p className="sho-subtitle">Where your planets land in each other&rsquo;s houses</p>
          </div>
          <div className="sho-score-badge">
            <span className="sho-score-value" style={{ color: getScoreColor(result.combinedScore) }}>
              {result.combinedScore}%
            </span>
            <span className="sho-score-sublabel">House Resonance</span>
          </div>
        </div>
        <div className="sho-score-bar">
          <div
            className="sho-score-fill"
            style={{ width: `${result.combinedScore}%` }}
          />
        </div>
      </div>

      {/* A in B */}
      {renderDirection(result.aInB, nameA, nameB, 'aInB')}

      {/* B in A */}
      {renderDirection(result.bInA, nameB, nameA, 'bInA')}

      {/* Combined narrative */}
      <div className="sho-combined-narrative">
        <p>{result.combinedNarrative}</p>
      </div>

      <style>{`
        .sho-container {
          color: #e5e7eb;
          margin-top: 16px;
        }

        /* Header */
        .sho-header {
          margin-bottom: 16px;
        }

        .sho-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .sho-title {
          font-size: 16px;
          font-weight: 700;
          color: #f59e0b;
          margin: 0;
        }

        .sho-subtitle {
          font-size: 12px;
          color: #9ca3af;
          margin: 4px 0 0 0;
        }

        .sho-score-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid rgba(245, 158, 11, 0.35);
          border-radius: 10px;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.03);
        }

        .sho-score-value {
          font-size: 22px;
          font-weight: 800;
        }

        .sho-score-sublabel {
          font-size: 10px;
          color: #9ca3af;
          text-transform: uppercase;
        }

        .sho-score-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .sho-score-fill {
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, rgba(245, 158, 11, 0.5), #f59e0b);
          transition: width 0.5s ease;
        }

        /* Direction sections */
        .sho-direction {
          margin-bottom: 14px;
        }

        .sho-direction-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          padding: 6px 10px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 8px;
        }

        .sho-direction-title {
          font-size: 13px;
          font-weight: 600;
          color: #d1d5db;
        }

        .sho-direction-mode {
          font-size: 11px;
          color: #9ca3af;
          font-style: italic;
        }

        /* Entries */
        .sho-entries {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .sho-entry {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 10px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 6px;
          border-left: 3px solid transparent;
          cursor: pointer;
          transition: background 0.15s;
        }

        .sho-entry:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .sho-entry.expanded {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px 6px 0 0;
        }

        .sho-planet-icon {
          font-size: 16px;
          width: 22px;
          text-align: center;
        }

        .sho-planet-name {
          font-size: 12px;
          font-weight: 600;
          color: #e5e7eb;
          min-width: 56px;
        }

        .sho-arrow {
          font-size: 11px;
          color: #6b7280;
        }

        .sho-house-num {
          font-size: 13px;
          font-weight: 700;
          min-width: 28px;
        }

        .sho-house-name {
          font-size: 11px;
          color: #9ca3af;
          flex: 1;
        }

        .sho-mode-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* Expanded detail */
        .sho-entry-detail {
          padding: 10px 12px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 0 0 6px 6px;
          border-left: 3px solid transparent;
          margin-bottom: 2px;
        }

        .sho-interpretation {
          font-size: 12px;
          line-height: 1.6;
          color: #d1d5db;
          margin: 0 0 8px 0;
        }

        .sho-keywords {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 6px;
        }

        .sho-keyword {
          font-size: 10px;
          padding: 2px 8px;
          border: 1px solid;
          border-radius: 12px;
        }

        .sho-entry-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 10px;
        }

        .sho-meta-mode {
          font-weight: 600;
        }

        .sho-meta-theme {
          color: #6b7280;
        }

        /* Highlights */
        .sho-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 6px;
          padding: 0 4px;
        }

        .sho-highlight-chip {
          font-size: 10px;
          padding: 2px 8px;
          background: rgba(245, 158, 11, 0.12);
          color: #fbbf24;
          border-radius: 12px;
        }

        /* Combined narrative */
        .sho-combined-narrative {
          margin-top: 12px;
          padding: 10px 12px;
          background: rgba(245, 158, 11, 0.06);
          border-left: 3px solid rgba(245, 158, 11, 0.4);
          border-radius: 6px;
        }

        .sho-combined-narrative p {
          font-size: 12px;
          line-height: 1.6;
          color: #d1d5db;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default SynastryHouseOverlayPanel;
