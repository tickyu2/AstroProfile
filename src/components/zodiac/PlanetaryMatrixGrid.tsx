/**
 * PlanetaryMatrixGrid - Generic N×M Compatibility Matrix
 *
 * Reusable grid component for Matrices 2-5:
 *   Matrix 2: Chemistry & Desire (Venus/Mars) — 2×2
 *   Matrix 3: Communication (Mercury/Mars)     — 2×2
 *   Matrix 4: Growth & Commitment (Jup/Sat)   — 2×2
 *   Matrix 5: Transformation (Ura/Nep/Plu)    — 3×3
 *
 * Each matrix follows the same visual pattern as SynastryGrid:
 * - Color-coded harmony cells
 * - Click-to-expand detail panel with "show your work" steps
 * - Weighted overall score
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState } from 'react';
import type { PlanetaryMatrix, PlanetaryCellReport, Planet } from '../../zodiac/planetaryMatrices';
import { PLANET_ICONS, PLANET_LABELS, MATRIX_LAYER_COLORS, PLANET_ROLE, CELL_DESCRIPTION, LAYER_NARRATIVES } from '../../zodiac/planetaryMatrices';
import { getCompatibilityLabel } from '../../zodiac/narrativeEngine';

// =============================================================================
// TYPES
// =============================================================================

interface PlanetaryMatrixGridProps {
  matrix: PlanetaryMatrix;
  nameA: string;
  nameB: string;
  /** Highlighted planet from Person A (row highlight) */
  highlightA?: string | null;
  /** Highlighted planet from Person B (column highlight) */
  highlightB?: string | null;
}

// =============================================================================
// HELPERS
// =============================================================================

function getHarmonyColor(score: number): string {
  if (score >= 8) return '#22c55e';
  if (score >= 6) return '#84cc16';
  if (score >= 5) return '#eab308';
  if (score >= 4) return '#f97316';
  return '#ef4444';
}

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

export const PlanetaryMatrixGrid: React.FC<PlanetaryMatrixGridProps> = ({
  matrix,
  nameA,
  nameB,
  highlightA = null,
  highlightB = null,
}) => {
  const [selectedPairKey, setSelectedPairKey] = useState<string | null>(null);

  const { layer, title, subtitle, rows, cols, grid, weightedScore, keyInsights } = matrix;
  const label = getCompatibilityLabel(weightedScore);
  const accentColor = MATRIX_LAYER_COLORS[layer];

  // Find cell by planet pair
  const getCell = (fromPlanet: Planet, toPlanet: Planet): PlanetaryCellReport | undefined => {
    return grid.find(g => g.fromPlanet === fromPlanet && g.toPlanet === toPlanet);
  };

  const handleCellClick = (cell: PlanetaryCellReport) => {
    setSelectedPairKey(selectedPairKey === cell.pairKey ? null : cell.pairKey);
  };

  const selectedReport = grid.find(g => g.pairKey === selectedPairKey);

  // Grid template: row-header + N data columns
  const gridCols = `60px repeat(${cols.length}, 1fr)`;

  return (
    <div className="pm-grid-container">
      {/* Header */}
      <div className="pm-header">
        <div className="pm-title-row">
          <div>
            <h4 className="pm-title" style={{ color: accentColor }}>{title}</h4>
            <p className="pm-subtitle">{subtitle}</p>
          </div>
          <div className="pm-score-badge" style={{ borderColor: `${accentColor}60` }}>
            <span className="pm-score-value" style={{ color: label.color }}>{weightedScore}%</span>
            <span className="pm-score-label">{label.label}</span>
          </div>
        </div>
        <div className="pm-score-bar">
          <div
            className="pm-score-fill"
            style={{
              width: `${weightedScore}%`,
              background: `linear-gradient(90deg, ${accentColor}88, ${accentColor})`,
            }}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="pm-matrix" style={{ gridTemplateColumns: gridCols }}>
        {/* Header row: corner + column planet headers */}
        <div className="pm-cell pm-corner">
          <span className="pm-corner-label">{nameA} ↓ / {nameB} →</span>
        </div>
        {cols.map(colPlanet => {
          const isColHighlighted = highlightB === colPlanet;
          return (
          <div key={`hdr-${colPlanet}`} className={`pm-cell pm-col-header${isColHighlighted ? ' pm-highlighted' : ''}`} style={{ borderBottomColor: `${accentColor}40` }}>
            <span className="pm-planet-icon">{PLANET_ICONS[colPlanet]}</span>
            <span className="pm-planet-name">{PLANET_LABELS[colPlanet]}</span>
            {/* Show Person B's sign for this planet */}
            {(() => {
              const cell = grid.find(g => g.toPlanet === colPlanet);
              return cell ? <span className="pm-planet-sign">{cell.toSign.slice(0, 3)}</span> : null;
            })()}
          </div>
          );
        })}

        {/* Data rows */}
        {rows.map(rowPlanet => {
          const isRowHighlighted = highlightA === rowPlanet;
          return (
          <React.Fragment key={`row-${rowPlanet}`}>
            {/* Row header */}
            <div className={`pm-cell pm-row-header${isRowHighlighted ? ' pm-highlighted' : ''}`} style={{ borderRightColor: `${accentColor}40` }}>
              <span className="pm-planet-icon">{PLANET_ICONS[rowPlanet]}</span>
              <span className="pm-planet-name">{PLANET_LABELS[rowPlanet]}</span>
              {/* Show Person A's sign for this planet */}
              {(() => {
                const cell = grid.find(g => g.fromPlanet === rowPlanet);
                return cell ? <span className="pm-planet-sign">{cell.fromSign.slice(0, 3)}</span> : null;
              })()}
            </div>

            {/* Data cells */}
            {cols.map(colPlanet => {
              const cell = getCell(rowPlanet, colPlanet);
              if (!cell) return <div key={`cell-${rowPlanet}-${colPlanet}`} className="pm-cell pm-empty" />;

              const isSelected = selectedPairKey === cell.pairKey;
              const isCellHighlighted = (highlightA === rowPlanet) || (highlightB === colPlanet);
              const isCrossHighlighted = (highlightA === rowPlanet) && (highlightB === colPlanet);
              const bgColor = getHarmonyColor(cell.harmonyScore);

              return (
                <div
                  key={`cell-${rowPlanet}-${colPlanet}`}
                  className={`pm-cell pm-data ${isSelected ? 'selected' : ''} ${isCellHighlighted ? 'pm-cell-highlighted' : ''} ${isCrossHighlighted ? 'pm-cell-cross-highlighted animate-pulse-soft' : ''}`}
                  style={{
                    background: `${bgColor}20`,
                    borderColor: isSelected ? bgColor : `${bgColor}40`,
                  }}
                  onClick={() => handleCellClick(cell)}
                >
                  <div className="pm-cell-signs">
                    {cell.fromSign.slice(0, 3)} → {cell.toSign.slice(0, 3)}
                  </div>
                  <div className="pm-cell-angle" style={{ color: bgColor }}>
                    {getAngleSymbol(cell.angle)}
                  </div>
                  <div className="pm-cell-degrees">
                    {getAngleDegrees(cell.angle)}°
                  </div>
                  <div className="pm-cell-score" style={{ color: bgColor }}>
                    {cell.harmonyScore}/10
                  </div>
                  <div className="pm-cell-weight">
                    {Math.round(cell.weight * 100)}%
                  </div>
                </div>
              );
            })}
          </React.Fragment>
          );
        })}
      </div>

      {/* Key Insights */}
      {keyInsights.length > 0 && (
        <div className="pm-insights" style={{ borderColor: `${accentColor}30` }}>
          <h5 style={{ color: accentColor }}>Key Insights</h5>
          <div className="pm-insights-list">
            {keyInsights.map((insight, i) => (
              <div key={i} className="pm-insight-item">{insight}</div>
            ))}
          </div>
        </div>
      )}

      {/* Layer narrative — what this matrix measures */}
      <div className="pm-narrative" style={{ borderColor: `${accentColor}40` }}>
        <p className="pm-narrative-text">{LAYER_NARRATIVES[layer]?.narrative}</p>
      </div>

      {/* Selected Cell Detail + Show Your Work */}
      {selectedReport && (
        <div className="pm-detail" style={{ borderColor: `${accentColor}40` }}>
          <div className="pm-detail-header">
            <span className="pm-detail-pair" style={{ color: accentColor }}>
              {PLANET_ICONS[selectedReport.fromPlanet]} {PLANET_LABELS[selectedReport.fromPlanet]}
              {' → '}
              {PLANET_ICONS[selectedReport.toPlanet]} {PLANET_LABELS[selectedReport.toPlanet]}
            </span>
            <span className="pm-detail-signs">
              {selectedReport.fromSign} → {selectedReport.toSign}
            </span>
          </div>

          {/* Khan Academy: What each planet governs */}
          <div className="pm-planet-roles">
            <div className="pm-role-row">
              <span className="pm-role-icon" style={{ color: accentColor }}>{PLANET_ICONS[selectedReport.fromPlanet]}</span>
              <span className="pm-role-planet">{PLANET_LABELS[selectedReport.fromPlanet]}:</span>
              <span className="pm-role-desc">{PLANET_ROLE[selectedReport.fromPlanet]}</span>
            </div>
            <span className="pm-role-cross">×</span>
            <div className="pm-role-row">
              <span className="pm-role-icon" style={{ color: accentColor }}>{PLANET_ICONS[selectedReport.toPlanet]}</span>
              <span className="pm-role-planet">{PLANET_LABELS[selectedReport.toPlanet]}:</span>
              <span className="pm-role-desc">{PLANET_ROLE[selectedReport.toPlanet]}</span>
            </div>
          </div>

          {/* Khan Academy: Why this cell matters */}
          {CELL_DESCRIPTION[selectedReport.pairKey] && (
            <div className="pm-why-box">
              <span className="pm-why-label">Why this matters</span>
              <p className="pm-why-text">{CELL_DESCRIPTION[selectedReport.pairKey]}</p>
            </div>
          )}

          <div className="pm-detail-angle">
            {getAngleSymbol(selectedReport.angle)} {selectedReport.angle} ({getAngleDegrees(selectedReport.angle)}°)
          </div>
          <p className="pm-detail-insight">{selectedReport.insight}</p>
          <div className="pm-detail-scores">
            <div className="pm-score-item">
              <span className="pm-score-name">Harmony</span>
              <span className="pm-score-val" style={{ color: getHarmonyColor(selectedReport.harmonyScore) }}>
                {selectedReport.harmonyScore}/10
              </span>
            </div>
            <div className="pm-score-item">
              <span className="pm-score-name">Effort</span>
              <span className="pm-score-val">{selectedReport.effortScore}/10</span>
            </div>
            <div className="pm-score-item">
              <span className="pm-score-name">Weight</span>
              <span className="pm-score-val">{Math.round(selectedReport.weight * 100)}%</span>
            </div>
          </div>

          {/* Khan Academy: How we calculate — formula bar */}
          <div className="pm-formula-bar">
            <span className="pm-formula-label">How we score:</span>
            <span className="pm-formula-text">
              Aspect angle → base effort → element match → modality match → planet weight → harmony = 11 − effort
            </span>
          </div>

          {/* Step-by-step breakdown — Khan Academy "show your work" */}
          <div className="pm-breakdown">
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

              const rowClass = isBaseline ? 'pm-bk-row base'
                : isFinal ? 'pm-bk-row total'
                : isHarmony ? 'pm-bk-row harmony'
                : 'pm-bk-row';

              const valueClass = isPositive ? 'pm-bk-value positive'
                : isNegative ? 'pm-bk-value negative'
                : 'pm-bk-value';

              return (
                <div key={i} className={rowClass}>
                  <span className="pm-bk-label">
                    {step.label}
                    <span className="pm-bk-reason">{step.explanation}</span>
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

      <style>{`
        .pm-grid-container {
          background: rgba(15, 23, 42, 0.95);
          border-radius: 16px;
          padding: 20px;
          color: #e5e7eb;
        }

        /* Header */
        .pm-header {
          margin-bottom: 16px;
        }

        .pm-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .pm-title {
          font-size: 16px;
          font-weight: 700;
          margin: 0;
        }

        .pm-subtitle {
          font-size: 12px;
          color: #9ca3af;
          margin: 4px 0 0 0;
        }

        .pm-score-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid;
          border-radius: 10px;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.03);
        }

        .pm-score-value {
          font-size: 22px;
          font-weight: 800;
        }

        .pm-score-label {
          font-size: 10px;
          color: #9ca3af;
          text-transform: uppercase;
        }

        .pm-score-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .pm-score-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        /* Matrix Grid */
        .pm-matrix {
          display: grid;
          gap: 4px;
          margin-bottom: 16px;
        }

        .pm-cell {
          padding: 8px;
          border-radius: 8px;
          text-align: center;
        }

        .pm-corner {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.03);
        }

        .pm-corner-label {
          font-size: 8px;
          color: #9ca3af;
          text-align: center;
          line-height: 1.3;
        }

        .pm-col-header,
        .pm-row-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          background: rgba(255, 255, 255, 0.04);
          border-bottom: 2px solid transparent;
        }

        .pm-row-header {
          border-bottom: none;
          border-right: 2px solid transparent;
        }

        .pm-planet-icon {
          font-size: 18px;
        }

        .pm-planet-name {
          font-size: 10px;
          font-weight: 500;
          color: #9ca3af;
        }

        .pm-planet-sign {
          font-size: 10px;
          font-weight: 600;
          color: #c4b5fd;
        }

        /* Data Cells */
        .pm-data {
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .pm-data:hover {
          transform: scale(1.03);
        }

        .pm-data.selected {
          border-width: 2px;
        }

        .pm-cell-signs {
          font-size: 10px;
          color: #9ca3af;
        }

        .pm-cell-angle {
          font-size: 18px;
          font-weight: 600;
        }

        .pm-cell-degrees {
          font-size: 9px;
          color: #6b7280;
          margin-top: -2px;
        }

        .pm-cell-score {
          font-size: 12px;
          font-weight: 700;
        }

        .pm-cell-weight {
          font-size: 9px;
          color: #6b7280;
        }

        /* Key Insights */
        .pm-insights {
          padding: 12px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid;
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .pm-insights h5 {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          margin: 0 0 8px 0;
        }

        .pm-insights-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .pm-insight-item {
          font-size: 13px;
          line-height: 1.5;
          color: #d1d5db;
        }

        /* Layer Narrative */
        .pm-narrative {
          border-left: 3px solid;
          border-radius: 6px;
          padding: 10px 12px;
          margin-bottom: 16px;
          background: rgba(255, 255, 255, 0.03);
        }

        .pm-narrative-text {
          font-size: 12px;
          line-height: 1.6;
          color: #d1d5db;
          margin: 0;
        }

        /* Planet Roles (Khan Academy: what each planet governs) */
        .pm-planet-roles {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .pm-role-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pm-role-icon {
          font-size: 16px;
        }

        .pm-role-planet {
          font-size: 11px;
          font-weight: 600;
          color: #e5e7eb;
        }

        .pm-role-desc {
          font-size: 11px;
          color: #9ca3af;
          font-style: italic;
        }

        .pm-role-cross {
          font-size: 12px;
          color: #6b7280;
          font-weight: 700;
        }

        /* Why Box (Khan Academy: why this cell matters) */
        .pm-why-box {
          padding: 8px 10px;
          background: rgba(251, 191, 36, 0.06);
          border-radius: 8px;
          margin-bottom: 8px;
          border: 1px solid rgba(251, 191, 36, 0.15);
        }

        .pm-why-label {
          display: block;
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #fbbf24;
          margin-bottom: 4px;
        }

        .pm-why-text {
          font-size: 12px;
          line-height: 1.5;
          color: #e5e7eb;
          margin: 0;
        }

        /* Formula Bar (Khan Academy: how we calculate) */
        .pm-formula-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 6px;
          margin-bottom: 4px;
          flex-wrap: wrap;
        }

        .pm-formula-label {
          font-size: 10px;
          font-weight: 600;
          color: #9ca3af;
          text-transform: uppercase;
        }

        .pm-formula-text {
          font-size: 11px;
          color: #d1d5db;
        }

        /* Detail Panel */
        .pm-detail {
          background: rgba(59, 130, 246, 0.06);
          border: 1px solid;
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 16px;
        }

        .pm-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .pm-detail-pair {
          font-size: 14px;
          font-weight: 700;
        }

        .pm-detail-signs {
          font-size: 12px;
          color: #9ca3af;
        }

        .pm-detail-angle {
          font-size: 16px;
          color: #a78bfa;
          margin-bottom: 8px;
        }

        .pm-detail-insight {
          font-size: 13px;
          line-height: 1.6;
          color: #e5e7eb;
          margin: 0 0 12px 0;
        }

        .pm-detail-scores {
          display: flex;
          gap: 16px;
          margin-bottom: 4px;
        }

        .pm-score-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .pm-score-name {
          font-size: 10px;
          color: #6b7280;
          text-transform: uppercase;
        }

        .pm-score-val {
          font-size: 14px;
          font-weight: 600;
        }

        /* Breakdown (Show Your Work) */
        .pm-breakdown {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .pm-breakdown h5 {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: #fbbf24;
          margin: 0 0 10px 0;
        }

        .pm-bk-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 6px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .pm-bk-row.base {
          background: rgba(255, 255, 255, 0.03);
          padding: 6px 8px;
          border-radius: 4px;
          margin-bottom: 4px;
        }

        .pm-bk-row.total {
          background: rgba(59, 130, 246, 0.1);
          padding: 6px 8px;
          border-radius: 4px;
          margin-top: 8px;
          border: none;
        }

        .pm-bk-row.harmony {
          background: rgba(34, 197, 94, 0.1);
          padding: 8px;
          border-radius: 6px;
          margin-top: 4px;
          border: none;
        }

        .pm-bk-label {
          font-size: 12px;
          color: #d1d5db;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .pm-bk-reason {
          font-size: 10px;
          color: #6b7280;
          font-style: italic;
        }

        .pm-bk-value {
          font-size: 13px;
          font-weight: 600;
          color: #e5e7eb;
          min-width: 40px;
          text-align: right;
        }

        .pm-bk-value.positive {
          color: #f97316;
        }

        .pm-bk-value.negative {
          color: #22c55e;
        }

        /* Highlight styles for planet cross-referencing */
        .pm-highlighted {
          background: rgba(251, 191, 36, 0.12) !important;
          box-shadow: inset 0 0 0 1px rgba(251, 191, 36, 0.3);
        }

        .pm-cell-highlighted {
          box-shadow: inset 0 0 0 1px rgba(251, 191, 36, 0.25);
          background-color: rgba(251, 191, 36, 0.08) !important;
        }

        .pm-cell-cross-highlighted {
          box-shadow: 0 0 12px rgba(251, 191, 36, 0.35), inset 0 0 0 2px rgba(251, 191, 36, 0.5) !important;
          z-index: 2;
          position: relative;
        }

        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PlanetaryMatrixGrid;
