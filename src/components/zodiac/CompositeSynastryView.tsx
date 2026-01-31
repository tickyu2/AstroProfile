/**
 * CompositeSynastryView - All 5 Matrices Side by Side
 *
 * Top bar:  Final overall % with verdict
 * Middle:   5 matrix panels in responsive grid (2-3 columns)
 * Bottom:   Mythic narratives per layer
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState } from 'react';
import type { SynastryCompatibilityReport } from '../../zodiac/planetaryMatrices';
import {
  MATRIX_LAYER_COLORS,
  MATRIX_WEIGHTS,
  LAYER_NARRATIVES,
  type MatrixLayerKey,
  type LayerScore,
} from '../../zodiac/planetaryMatrices';
import { getCompatibilityLabel } from '../../zodiac/narrativeEngine';
import { SynastryGrid } from './SynastryGrid';
import { PlanetaryMatrixGrid } from './PlanetaryMatrixGrid';

// =============================================================================
// TYPES
// =============================================================================

interface CompositeSynastryViewProps {
  report: SynastryCompatibilityReport;
}

// =============================================================================
// HELPERS
// =============================================================================

function getHarmonyColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 70) return '#84cc16';
  if (score >= 60) return '#eab308';
  if (score >= 50) return '#f97316';
  return '#ef4444';
}

// =============================================================================
// COMPONENT
// =============================================================================

export const CompositeSynastryView: React.FC<CompositeSynastryViewProps> = ({ report }) => {
  const [expandedNarrative, setExpandedNarrative] = useState<MatrixLayerKey | null>(null);

  const { personA, personB, matrices, scores, seasonalDynamics, cuspInteractions } = report;
  const nameA = personA.name;
  const nameB = personB.name;

  const finalPercent = scores.finalPercent ?? 0;
  const label = getCompatibilityLabel(finalPercent);

  // Layer scores for the bar chart
  const layerOrder: MatrixLayerKey[] = ['coreBond', 'chemistry', 'communication', 'growth', 'transformation'];

  return (
    <div className="csv-container">
      {/* ================================================================== */}
      {/* TOP BAR: Final Score */}
      {/* ================================================================== */}
      <div className="csv-top-bar">
        <div className="csv-final-score">
          <span className="csv-final-emoji">{label.emoji}</span>
          <div className="csv-final-text">
            <span className="csv-final-value" style={{ color: label.color }}>
              {finalPercent}%
            </span>
            <span className="csv-final-label">Overall Harmony</span>
          </div>
        </div>
        <p className="csv-verdict">{scores.verdict}</p>
        <div className="csv-final-bar">
          <div
            className="csv-final-fill"
            style={{
              width: `${finalPercent}%`,
              background: `linear-gradient(90deg, ${label.color}88, ${label.color})`,
            }}
          />
        </div>
      </div>

      {/* ================================================================== */}
      {/* LAYER SCORE BARS */}
      {/* ================================================================== */}
      <div className="csv-layer-bars">
        {scores.layerScores.map(ls => {
          if (ls.score == null) return null;
          const color = MATRIX_LAYER_COLORS[ls.layer];
          const narrativeData = LAYER_NARRATIVES[ls.layer];
          return (
            <div key={ls.layer} className="csv-layer-row">
              <div className="csv-layer-info">
                <span className="csv-layer-name" style={{ color }}>{narrativeData.title}</span>
                <span className="csv-layer-weight">{Math.round(ls.weight * 100)}%</span>
              </div>
              <div className="csv-layer-bar-track">
                <div
                  className="csv-layer-bar-fill"
                  style={{
                    width: `${ls.score}%`,
                    background: `linear-gradient(90deg, ${color}66, ${color})`,
                  }}
                />
              </div>
              <span className="csv-layer-score" style={{ color: getHarmonyColor(ls.score) }}>
                {ls.score}%
              </span>
            </div>
          );
        })}
      </div>

      {/* ================================================================== */}
      {/* SEASONAL DYNAMICS (if available) */}
      {/* ================================================================== */}
      {seasonalDynamics && (
        <div className="csv-seasonal">
          <h5>Seasonal Leadership</h5>
          <div className="csv-season-grid">
            {(['Spring', 'Summer', 'Autumn', 'Winter'] as const).map(season => {
              const leader = seasonalDynamics[season];
              if (!leader) return null;
              const leaderName = leader === 'A' ? nameA : leader === 'B' ? nameB : 'Shared';
              const seasonIcons: Record<string, string> = {
                Spring: '\u{1F331}', Summer: '\u{2600}\u{FE0F}',
                Autumn: '\u{1F342}', Winter: '\u{2744}\u{FE0F}',
              };
              return (
                <div key={season} className="csv-season-cell">
                  <span className="csv-season-icon">{seasonIcons[season]}</span>
                  <span className="csv-season-name">{season}</span>
                  <span className="csv-season-leader">{leaderName}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* CUSP INTERACTIONS (if available) */}
      {/* ================================================================== */}
      {cuspInteractions?.hasCuspOverlap && (
        <div className="csv-cusp-note">
          <span className="csv-cusp-icon">{'\u{1F300}'}</span>
          <span>
            Cusp overlap detected ({cuspInteractions.sharedCuspBoundary}) —
            your sign boundaries blend, amplifying connection by{' '}
            {Math.round((cuspInteractions.blendAmplification ?? 0) * 100)}%.
          </span>
        </div>
      )}

      {/* ================================================================== */}
      {/* MATRIX PANELS — Responsive grid */}
      {/* ================================================================== */}
      <div className="csv-matrices">
        {/* Matrix 1: Core Bond (existing SynastryGrid) */}
        {matrices.coreBond && (
          <div className="csv-matrix-panel csv-panel-full">
            <SynastryGrid
              matrix={matrices.coreBond}
              nameA={nameA}
              nameB={nameB}
              birthDateA={personA.birthDate}
              birthDateB={personB.birthDate}
            />
          </div>
        )}

        {/* Matrix 2: Chemistry */}
        {matrices.chemistry && (
          <div className="csv-matrix-panel">
            <PlanetaryMatrixGrid
              matrix={matrices.chemistry}
              nameA={nameA}
              nameB={nameB}
            />
          </div>
        )}

        {/* Matrix 3: Communication */}
        {matrices.communication && (
          <div className="csv-matrix-panel">
            <PlanetaryMatrixGrid
              matrix={matrices.communication}
              nameA={nameA}
              nameB={nameB}
            />
          </div>
        )}

        {/* Matrix 4: Growth */}
        {matrices.growth && (
          <div className="csv-matrix-panel">
            <PlanetaryMatrixGrid
              matrix={matrices.growth}
              nameA={nameA}
              nameB={nameB}
            />
          </div>
        )}

        {/* Matrix 5: Transformation */}
        {matrices.transformation && (
          <div className="csv-matrix-panel csv-panel-muted">
            <PlanetaryMatrixGrid
              matrix={matrices.transformation}
              nameA={nameA}
              nameB={nameB}
            />
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* MYTHIC NARRATIVES */}
      {/* ================================================================== */}
      <div className="csv-narratives">
        <h4>Layer Narratives</h4>
        {layerOrder.map(layer => {
          const data = LAYER_NARRATIVES[layer];
          const color = MATRIX_LAYER_COLORS[layer];
          const ls = scores.layerScores.find(s => s.layer === layer);
          if (!ls || ls.score == null) return null;
          const isExpanded = expandedNarrative === layer;

          return (
            <div
              key={layer}
              className={`csv-narrative-card ${isExpanded ? 'expanded' : ''}`}
              style={{ borderLeftColor: color }}
              onClick={() => setExpandedNarrative(isExpanded ? null : layer)}
            >
              <div className="csv-narrative-header">
                <span className="csv-narrative-title" style={{ color }}>{data.title}</span>
                <span className="csv-narrative-score" style={{ color: getHarmonyColor(ls.score) }}>
                  {ls.score}%
                </span>
              </div>
              {isExpanded && (
                <p className="csv-narrative-text">{data.narrative}</p>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .csv-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          color: #e5e7eb;
        }

        /* TOP BAR */
        .csv-top-bar {
          background: rgba(15, 23, 42, 0.95);
          border-radius: 16px;
          padding: 20px;
        }

        .csv-final-score {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 8px;
        }

        .csv-final-emoji {
          font-size: 36px;
        }

        .csv-final-text {
          display: flex;
          flex-direction: column;
        }

        .csv-final-value {
          font-size: 32px;
          font-weight: 800;
        }

        .csv-final-label {
          font-size: 13px;
          color: #9ca3af;
        }

        .csv-verdict {
          font-size: 13px;
          color: #d1d5db;
          margin: 8px 0 12px 0;
          line-height: 1.5;
        }

        .csv-final-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .csv-final-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.6s ease;
        }

        /* LAYER BARS */
        .csv-layer-bars {
          background: rgba(15, 23, 42, 0.95);
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .csv-layer-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .csv-layer-info {
          display: flex;
          flex-direction: column;
          min-width: 110px;
        }

        .csv-layer-name {
          font-size: 12px;
          font-weight: 600;
        }

        .csv-layer-weight {
          font-size: 10px;
          color: #6b7280;
        }

        .csv-layer-bar-track {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 3px;
          overflow: hidden;
        }

        .csv-layer-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .csv-layer-score {
          font-size: 13px;
          font-weight: 700;
          min-width: 36px;
          text-align: right;
        }

        /* SEASONAL DYNAMICS */
        .csv-seasonal {
          background: rgba(15, 23, 42, 0.95);
          border-radius: 16px;
          padding: 16px 20px;
        }

        .csv-seasonal h5 {
          font-size: 12px;
          font-weight: 600;
          color: #fbbf24;
          text-transform: uppercase;
          margin: 0 0 10px 0;
        }

        .csv-season-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .csv-season-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 10px 6px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 10px;
        }

        .csv-season-icon {
          font-size: 20px;
        }

        .csv-season-name {
          font-size: 11px;
          color: #9ca3af;
        }

        .csv-season-leader {
          font-size: 12px;
          font-weight: 600;
          color: #e5e7eb;
        }

        /* CUSP NOTE */
        .csv-cusp-note {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: rgba(167, 139, 250, 0.1);
          border: 1px solid rgba(167, 139, 250, 0.3);
          border-radius: 12px;
          font-size: 13px;
          color: #d1d5db;
          line-height: 1.5;
        }

        .csv-cusp-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        /* MATRIX PANELS */
        .csv-matrices {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 768px) {
          .csv-matrices {
            grid-template-columns: repeat(2, 1fr);
          }
          .csv-panel-full {
            grid-column: 1 / -1;
          }
        }

        @media (min-width: 1200px) {
          .csv-matrices {
            grid-template-columns: repeat(3, 1fr);
          }
          .csv-panel-full {
            grid-column: 1 / -1;
          }
        }

        .csv-matrix-panel {
          min-width: 0;
        }

        .csv-panel-muted {
          opacity: 0.85;
        }

        /* NARRATIVES */
        .csv-narratives {
          background: rgba(15, 23, 42, 0.95);
          border-radius: 16px;
          padding: 20px;
        }

        .csv-narratives h4 {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 14px 0;
        }

        .csv-narrative-card {
          border-left: 3px solid;
          padding: 10px 14px;
          margin-bottom: 8px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 0 10px 10px 0;
          cursor: pointer;
          transition: all 0.2s;
        }

        .csv-narrative-card:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .csv-narrative-card.expanded {
          background: rgba(255, 255, 255, 0.06);
        }

        .csv-narrative-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .csv-narrative-title {
          font-size: 13px;
          font-weight: 600;
        }

        .csv-narrative-score {
          font-size: 14px;
          font-weight: 700;
        }

        .csv-narrative-text {
          font-size: 13px;
          color: #d1d5db;
          line-height: 1.7;
          margin: 10px 0 0 0;
        }
      `}</style>
    </div>
  );
};

export default CompositeSynastryView;
