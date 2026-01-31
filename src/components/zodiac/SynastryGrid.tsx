/**
 * SynastryGrid - 9-Way Cross-Aspect Compatibility Matrix
 *
 * Displays all 9 Sun/Moon/Rising interactions between two profiles:
 * - 3x3 grid visualization
 * - Color-coded harmony scores
 * - Weighted overall score
 * - Key insight highlights
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState } from 'react';
import type { SynastryMatrix, CrossAspectReport, CrossAspect, Lens } from '../../zodiac/narrativeEngine';
import { getCompatibilityLabel } from '../../zodiac/narrativeEngine';
import { ScoringTheoryFlap } from './ScoringTheoryFlap';

// =============================================================================
// TYPES
// =============================================================================

interface SynastryGridProps {
  matrix: SynastryMatrix;
  nameA: string;
  nameB: string;
  birthDateA?: string | null;
  birthDateB?: string | null;
  onCellClick?: (aspect: CrossAspectReport) => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const LENS_ICONS: Record<Lens, string> = {
  Sun: '☉',
  Moon: '☽',
  Rising: '↑',
};

const LENS_LABELS: Record<Lens, string> = {
  Sun: 'Sun',
  Moon: 'Moon',
  Rising: 'Rising',
};

// Get color based on harmony score
function getHarmonyColor(score: number): string {
  if (score >= 8) return '#22c55e'; // Green - excellent
  if (score >= 6) return '#84cc16'; // Lime - good
  if (score >= 5) return '#eab308'; // Yellow - moderate
  if (score >= 4) return '#f97316'; // Orange - challenging
  return '#ef4444'; // Red - difficult
}

// Get angle symbol
function getAngleSymbol(angle: string): string {
  const symbols: Record<string, string> = {
    'conjunction': '☌',
    'semi-sextile': '⚺',
    'sextile': '⚹',
    'square': '□',
    'trine': '△',
    'quincunx': '⚻',
    'opposition': '☍',
  };
  return symbols[angle] || '•';
}

// Get angle degrees
function getAngleDegrees(angle: string): number {
  const degrees: Record<string, number> = {
    'conjunction': 0,
    'semi-sextile': 30,
    'sextile': 60,
    'square': 90,
    'trine': 120,
    'quincunx': 150,
    'opposition': 180,
  };
  return degrees[angle] ?? 0;
}

// =============================================================================
// COMPONENT
// =============================================================================

// Format ISO date string to short display (e.g. "Apr 17, 1974")
function formatBirthDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export const SynastryGrid: React.FC<SynastryGridProps> = ({
  matrix,
  nameA,
  nameB,
  birthDateA,
  birthDateB,
  onCellClick,
}) => {
  const [selectedCell, setSelectedCell] = useState<CrossAspect | null>(null);
  const [showTheory, setShowTheory] = useState(false);

  const { grid, weightedScore, keyInsights, strengths, challenges, growthAreas } = matrix;
  const label = getCompatibilityLabel(weightedScore);

  // Organize grid into 3x3 matrix
  const lenses: Lens[] = ['Sun', 'Moon', 'Rising'];
  const getCell = (fromLens: Lens, toLens: Lens): CrossAspectReport | undefined => {
    return grid.find(g => g.fromLens === fromLens && g.toLens === toLens);
  };

  // Extract zodiac signs for each person from the grid data
  const signsA: Record<Lens, string> = { Sun: '', Moon: '', Rising: '' };
  const signsB: Record<Lens, string> = { Sun: '', Moon: '', Rising: '' };
  lenses.forEach(lens => {
    const cell = grid.find(g => g.fromLens === lens);
    if (cell) signsA[lens] = cell.fromSign;
  });
  lenses.forEach(lens => {
    const cell = grid.find(g => g.toLens === lens);
    if (cell) signsB[lens] = cell.toSign;
  });

  const handleCellClick = (cell: CrossAspectReport) => {
    setSelectedCell(selectedCell === cell.aspect ? null : cell.aspect);
    onCellClick?.(cell);
  };

  const selectedReport = grid.find(g => g.aspect === selectedCell);

  return (
    <div className="synastry-grid-container">
      {/* Overall Score Header */}
      <div className="synastry-header">
        <div className="score-display">
          <span className="score-emoji">{label.emoji}</span>
          <div className="synastry-score-text">
            <span className="score-value" style={{ color: label.color }}>{weightedScore}%</span>
            <span className="score-label">{label.label} Match</span>
          </div>
        </div>
        <div className="score-bar">
          <div
            className="score-fill"
            style={{
              width: `${weightedScore}%`,
              background: `linear-gradient(90deg, ${label.color}aa, ${label.color})`,
            }}
          />
        </div>
      </div>

      {/* 3x3 Grid */}
      <div className="matrix-section">
        <div className="matrix-header-row">
          <div>
            <h4>Synastry Matrix</h4>
            <p className="matrix-subtitle">{nameA} → {nameB}</p>
          </div>
          <button
            type="button"
            className="theory-btn"
            onClick={() => setShowTheory(true)}
          >
            📐 Scoring Theory
          </button>
        </div>

        <div className="matrix-grid">
          {/* Row 0: Header row — corner + zodiac label + 3 lens headers */}
          <div className="grid-cell header corner">
            <span className="header-label">{nameA} ↓ / {nameB} →</span>
          </div>
          <div className="grid-cell header zodiac-col-header">
            <span className="zodiac-col-label">{nameB}</span>
            {birthDateB && <span className="zodiac-birth-date">{formatBirthDate(birthDateB)}</span>}
          </div>
          {lenses.map(lens => (
            <div key={`header-${lens}`} className="grid-cell header">
              <span className="lens-icon">{LENS_ICONS[lens]}</span>
              <span className="lens-name">{LENS_LABELS[lens]}</span>
            </div>
          ))}

          {/* Row 1: Person B's zodiac signs */}
          <div className="grid-cell zodiac-row-label">
            <span className="zodiac-person-label">{nameA}</span>
            {birthDateA && <span className="zodiac-birth-date">{formatBirthDate(birthDateA)}</span>}
          </div>
          <div className="grid-cell zodiac-empty" />
          {lenses.map(lens => (
            <div key={`signB-${lens}`} className="grid-cell zodiac-sign">
              <span className="zodiac-sign-name">{signsB[lens].slice(0, 3)}</span>
            </div>
          ))}

          {/* Rows 2-4: Data rows with Person A's zodiac signs */}
          {lenses.map(fromLens => (
            <React.Fragment key={`row-${fromLens}`}>
              {/* Row header (lens) */}
              <div className="grid-cell row-header">
                <span className="lens-icon">{LENS_ICONS[fromLens]}</span>
                <span className="lens-name">{LENS_LABELS[fromLens]}</span>
              </div>

              {/* Person A's zodiac sign for this lens */}
              <div className="grid-cell zodiac-sign row-zodiac">
                <span className="zodiac-sign-name">{signsA[fromLens].slice(0, 3)}</span>
              </div>

              {/* 3 data cells */}
              {lenses.map(toLens => {
                const cell = getCell(fromLens, toLens);
                if (!cell) return <div key={`cell-${fromLens}-${toLens}`} className="grid-cell empty" />;

                const isSelected = selectedCell === cell.aspect;
                const bgColor = getHarmonyColor(cell.harmonyScore);

                return (
                  <div
                    key={`cell-${fromLens}-${toLens}`}
                    className={`grid-cell data ${isSelected ? 'selected' : ''}`}
                    style={{
                      background: `${bgColor}20`,
                      borderColor: isSelected ? bgColor : `${bgColor}40`,
                    }}
                    onClick={() => handleCellClick(cell)}
                  >
                    <div className="cell-signs">
                      {cell.fromSign.slice(0, 3)} → {cell.toSign.slice(0, 3)}
                    </div>
                    <div className="cell-angle" style={{ color: bgColor }}>
                      {getAngleSymbol(cell.angle)}
                    </div>
                    <div className="cell-degrees">
                      {getAngleDegrees(cell.angle)}°
                    </div>
                    <div className="cell-score" style={{ color: bgColor }}>
                      {cell.harmonyScore}/10
                    </div>
                    <div className="cell-weight">
                      {Math.round(cell.weight * 100)}%
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="key-insights">
        <h4>Key Insights</h4>
        <div className="insights-list">
          {keyInsights.map((insight, i) => (
            <div key={i} className="insight-item">{insight}</div>
          ))}
        </div>
      </div>

      {/* Selected Cell Detail */}
      {selectedReport && (
        <div className="selected-detail">
          <div className="detail-header">
            <span className="detail-aspect">{selectedReport.aspect}</span>
            <span className="detail-signs">
              {selectedReport.fromSign} → {selectedReport.toSign}
            </span>
          </div>
          <div className="detail-angle">
            {getAngleSymbol(selectedReport.angle)} {selectedReport.angle}
          </div>
          <p className="detail-insight">{selectedReport.insight}</p>
          <div className="detail-scores">
            <div className="score-item">
              <span className="score-name">Harmony</span>
              <span className="score-val" style={{ color: getHarmonyColor(selectedReport.harmonyScore) }}>
                {selectedReport.harmonyScore}/10
              </span>
            </div>
            <div className="score-item">
              <span className="score-name">Effort</span>
              <span className="score-val">{selectedReport.effortScore}/10</span>
            </div>
            <div className="score-item">
              <span className="score-name">Weight</span>
              <span className="score-val">{Math.round(selectedReport.weight * 100)}%</span>
            </div>
          </div>

          {/* Step-by-step breakdown — Khan Academy "show your work" */}
          <div className="score-breakdown">
            <h5>Show Your Work</h5>
            {selectedReport.steps.map((step, i) => {
              const isBaseline = step.label === 'Baseline effort';
              const isFinal = step.label === 'Final effort (1-10)';
              const isHarmony = step.label === 'Harmony (1-10)';
              const numVal = typeof step.value === 'number' ? step.value : 0;
              const isPositive = !isBaseline && !isFinal && !isHarmony && numVal > 0
                && step.label !== 'Orb factor' && step.label !== 'Raw effort'
                && !step.label.startsWith('Planet weight') && !step.label.startsWith('Sum');
              const isNegative = !isBaseline && !isFinal && !isHarmony && numVal < 0
                && step.label !== 'Raw effort';

              const rowClass = isBaseline ? 'breakdown-row base'
                : isFinal ? 'breakdown-row total'
                : isHarmony ? 'breakdown-row harmony'
                : 'breakdown-row';

              const valueClass = isPositive ? 'breakdown-value positive'
                : isNegative ? 'breakdown-value negative'
                : 'breakdown-value';

              return (
                <div key={i} className={rowClass}>
                  <span className="breakdown-label">
                    {step.label}
                    <span className="breakdown-reason">{step.explanation}</span>
                  </span>
                  <span
                    className={valueClass}
                    style={isHarmony ? { color: getHarmonyColor(numVal) } : undefined}
                  >
                    {typeof step.value === 'number'
                      ? (isPositive ? '+' : '') + (Number.isInteger(step.value) ? step.value : step.value.toFixed(2))
                      : step.value}
                    {isHarmony ? '/10' : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Strengths & Challenges */}
      <div className="analysis-sections">
        {strengths.length > 0 && (
          <div className="analysis-section strengths">
            <h5>Strengths</h5>
            {strengths.map((s, i) => (
              <div key={i} className="analysis-item">{s}</div>
            ))}
          </div>
        )}

        {challenges.length > 0 && (
          <div className="analysis-section challenges">
            <h5>Challenges</h5>
            {challenges.map((c, i) => (
              <div key={i} className="analysis-item">{c}</div>
            ))}
          </div>
        )}

        {growthAreas.length > 0 && (
          <div className="analysis-section growth">
            <h5>Growth Areas</h5>
            {growthAreas.map((g, i) => (
              <div key={i} className="analysis-item">{g}</div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .synastry-grid-container {
          background: rgba(15, 23, 42, 0.95);
          border-radius: 16px;
          padding: 20px;
          color: #e5e7eb;
        }

        /* Header & Score */
        .synastry-header {
          margin-bottom: 20px;
        }

        .score-display {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .score-emoji {
          font-size: 32px;
        }

        .synastry-score-text {
          display: flex;
          flex-direction: column;
        }

        .score-value {
          font-size: 28px;
          font-weight: 800;
        }

        .score-label {
          font-size: 14px;
          color: #9ca3af;
        }

        .score-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .score-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        /* Key Insights */
        .key-insights {
          margin-bottom: 20px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
        }

        .key-insights h4 {
          font-size: 12px;
          font-weight: 600;
          color: #fbbf24;
          margin: 0 0 8px 0;
          text-transform: uppercase;
        }

        .insights-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .insight-item {
          font-size: 13px;
          line-height: 1.5;
          color: #d1d5db;
        }

        /* Matrix Section */
        .matrix-section {
          margin-bottom: 20px;
        }

        .matrix-section h4 {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 4px 0;
        }

        .matrix-subtitle {
          font-size: 12px;
          color: #9ca3af;
          margin: 0 0 12px 0;
        }

        /* Grid — 5x5: row-header + zodiac-sign + 3 data columns */
        .matrix-grid {
          display: grid;
          grid-template-columns: 60px 56px repeat(3, 1fr);
          gap: 4px;
        }

        .grid-cell {
          padding: 8px;
          border-radius: 8px;
          text-align: center;
        }

        .grid-cell.header {
          background: rgba(251, 191, 36, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .grid-cell.header.corner {
          font-size: 8px;
          color: #d1d5db;
          justify-content: center;
          padding: 6px 4px;
        }

        .header-label {
          line-height: 1.3;
        }

        .grid-cell.row-header {
          background: rgba(251, 191, 36, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
        }

        .lens-icon {
          font-size: 16px;
        }

        .lens-name {
          font-size: 10px;
          font-weight: 500;
          color: #9ca3af;
        }

        /* Zodiac sign column & row */
        .grid-cell.zodiac-col-header {
          justify-content: center;
        }

        .zodiac-col-label {
          font-size: 9px;
          color: #d1d5db;
          font-weight: 600;
        }

        .zodiac-birth-date {
          font-size: 8px;
          color: #9ca3af;
          font-weight: 400;
        }

        .grid-cell.zodiac-row-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(251, 191, 36, 0.08);
          border-radius: 8px;
          gap: 1px;
        }

        .zodiac-person-label {
          font-size: 9px;
          color: #d1d5db;
          font-weight: 600;
          text-align: center;
          line-height: 1.2;
          word-break: break-word;
        }

        .grid-cell.zodiac-empty {
          background: transparent;
        }

        .grid-cell.zodiac-sign {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(167, 139, 250, 0.1);
          border-radius: 8px;
        }

        .grid-cell.row-zodiac {
          background: rgba(167, 139, 250, 0.1);
        }

        .zodiac-sign-name {
          font-size: 11px;
          font-weight: 600;
          color: #c4b5fd;
          letter-spacing: 0.5px;
        }

        .grid-cell.data {
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .grid-cell.data:hover {
          transform: scale(1.02);
        }

        .grid-cell.data.selected {
          border-width: 2px;
        }

        .cell-signs {
          font-size: 10px;
          color: #9ca3af;
        }

        .cell-angle {
          font-size: 18px;
          font-weight: 600;
        }

        .cell-degrees {
          font-size: 9px;
          color: #6b7280;
          margin-top: -2px;
        }

        .cell-score {
          font-size: 12px;
          font-weight: 700;
        }

        .cell-weight {
          font-size: 9px;
          color: #6b7280;
        }

        /* Selected Detail */
        .selected-detail {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 16px;
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .detail-aspect {
          font-size: 14px;
          font-weight: 700;
          color: #60a5fa;
        }

        .detail-signs {
          font-size: 12px;
          color: #9ca3af;
        }

        .detail-angle {
          font-size: 16px;
          color: #a78bfa;
          margin-bottom: 8px;
        }

        .detail-insight {
          font-size: 13px;
          line-height: 1.6;
          color: #e5e7eb;
          margin: 0 0 12px 0;
        }

        .detail-scores {
          display: flex;
          gap: 16px;
        }

        .score-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .score-name {
          font-size: 10px;
          color: #6b7280;
          text-transform: uppercase;
        }

        .score-val {
          font-size: 14px;
          font-weight: 600;
        }

        /* Score Breakdown - Transparency */
        .score-breakdown {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .score-breakdown h5 {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: #fbbf24;
          margin: 0 0 10px 0;
        }

        .breakdown-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 6px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .breakdown-row.base {
          background: rgba(255, 255, 255, 0.03);
          padding: 6px 8px;
          border-radius: 4px;
          margin-bottom: 4px;
        }

        .breakdown-row.total {
          background: rgba(59, 130, 246, 0.1);
          padding: 6px 8px;
          border-radius: 4px;
          margin-top: 8px;
          border: none;
        }

        .breakdown-row.harmony {
          background: rgba(34, 197, 94, 0.1);
          padding: 8px;
          border-radius: 6px;
          margin-top: 4px;
          border: none;
        }

        .breakdown-label {
          font-size: 12px;
          color: #d1d5db;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .breakdown-reason {
          font-size: 10px;
          color: #6b7280;
          font-style: italic;
        }

        .breakdown-value {
          font-size: 13px;
          font-weight: 600;
          color: #e5e7eb;
          min-width: 40px;
          text-align: right;
        }

        .breakdown-value.positive {
          color: #f97316;
        }

        .breakdown-value.negative {
          color: #22c55e;
        }

        /* Analysis Sections */
        .analysis-sections {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .analysis-section {
          padding: 12px;
          border-radius: 10px;
        }

        .analysis-section.strengths {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .analysis-section.challenges {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .analysis-section.growth {
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.2);
        }

        .analysis-section h5 {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          margin: 0 0 8px 0;
        }

        .strengths h5 { color: #22c55e; }
        .challenges h5 { color: #ef4444; }
        .growth h5 { color: #fbbf24; }

        .analysis-item {
          font-size: 12px;
          color: #d1d5db;
          line-height: 1.5;
          padding: 4px 0;
        }

        /* Matrix Header Row */
        .matrix-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .theory-btn {
          background: rgba(99, 102, 241, 0.2);
          border: 1px solid rgba(99, 102, 241, 0.4);
          color: #a5b4fc;
          font-size: 12px;
          font-weight: 500;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .theory-btn:hover {
          background: rgba(99, 102, 241, 0.3);
          border-color: rgba(99, 102, 241, 0.6);
          color: #c7d2fe;
        }
      `}</style>

      {/* Scoring Theory Flap */}
      <ScoringTheoryFlap
        isOpen={showTheory}
        onClose={() => setShowTheory(false)}
      />
    </div>
  );
};

export default SynastryGrid;
