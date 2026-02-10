/**
 * PhiChemistryGrid - φ-Blend 2×2 Chemistry & Desire Matrix
 *
 * Separate 2×2 Venus/Mars grid using the same 4-layer scoring engine
 * (Aspect + Element + Modality + Seasonal) as the main φ-Blend matrix.
 *
 * Follows the same architecture as PlanetaryMatrixGrid but with
 * cusp-aware φ-weighted scoring instead of Effort-Harmony.
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useMemo, useState } from 'react';
import { type SignKey } from '../../zodiac/tropicalMap';
import { getAngleBetweenSigns, type AngleKey } from '../../zodiac/angles';
import { formatBlendPercent, type SignBlend } from '../../zodiac/cusp/phiCurve';
import { interpretCell } from '../../zodiac/compatibility/phiInterpretation';
import { explainCell, type CellExplanation } from '../../zodiac/compatibility/explainCell';
import { LAYER_WEIGHTS, SEASONAL_PHASE_DISPLAY } from '../../zodiac/compatibility/elementModality';
import type { ZodiacSign } from '../../data/tropicalSeasons';

// =============================================================================
// TYPES
// =============================================================================

type ChemLens = 'Venus' | 'Mars';

interface PhiChemistryGridProps {
  nameA: string;
  nameB: string;
  venusSignA: string;
  venusSignB: string;
  marsSignA: string;
  marsSignB: string;
  venusBlendA: SignBlend[];
  venusBlendB: SignBlend[];
  marsBlendA: SignBlend[];
  marsBlendB: SignBlend[];
}

interface ChemCellData {
  fromLens: ChemLens;
  toLens: ChemLens;
  phiHarmony: number;
  interpretation: string;
  angleKey: AngleKey;
  explanation: CellExplanation;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const CHEM_LENSES: ChemLens[] = ['Venus', 'Mars'];
const CHEM_ICONS: Record<ChemLens, string> = { Venus: '♀', Mars: '♂' };
const CHEM_LABELS: Record<ChemLens, string> = { Venus: 'Venus', Mars: 'Mars' };

/** Cell weights matching existing CHEMISTRY_CELL_WEIGHTS */
const CHEM_CELL_WEIGHTS: Record<string, number> = {
  'Venus-Venus': 0.20,
  'Venus-Mars':  0.30,
  'Mars-Venus':  0.30,
  'Mars-Mars':   0.20,
};

const ACCENT = '#f472b6'; // Pink — matches existing chemistry layer

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

function getBlendForChemLens(
  lens: ChemLens,
  venusBlend: SignBlend[],
  marsBlend: SignBlend[],
  venusSign: string,
  marsSign: string,
): SignBlend[] {
  if (lens === 'Venus' && venusBlend.length > 0) return venusBlend;
  if (lens === 'Mars' && marsBlend.length > 0) return marsBlend;
  const sign = lens === 'Venus' ? venusSign : marsSign;
  return [{ sign: sign as ZodiacSign, weight: 1 }];
}

// =============================================================================
// COMPONENT
// =============================================================================

export const PhiChemistryGrid: React.FC<PhiChemistryGridProps> = ({
  nameA,
  nameB,
  venusSignA,
  venusSignB,
  marsSignA,
  marsSignB,
  venusBlendA,
  venusBlendB,
  marsBlendA,
  marsBlendB,
}) => {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [showCalc, setShowCalc] = useState(false);

  // Compute 4-layer scores for all 4 cells
  const grid = useMemo(() => {
    const cells: ChemCellData[] = [];
    for (const fromLens of CHEM_LENSES) {
      for (const toLens of CHEM_LENSES) {
        const fromBlend = getBlendForChemLens(fromLens, venusBlendA, marsBlendA, venusSignA, marsSignA);
        const toBlend = getBlendForChemLens(toLens, venusBlendB, marsBlendB, venusSignB, marsSignB);

        const explanation = explainCell(fromLens, toLens, fromBlend, toBlend);
        const harmony = explanation.score10;

        const dominantFrom = [...fromBlend].sort((a, b) => b.weight - a.weight)[0];
        const dominantTo = [...toBlend].sort((a, b) => b.weight - a.weight)[0];
        const angleResult = getAngleBetweenSigns(dominantFrom.sign as SignKey, dominantTo.sign as SignKey);
        const angleKey = (angleResult?.key ?? 'conjunction') as AngleKey;

        const interpretation = interpretCell(fromLens, toLens, fromBlend, toBlend, angleKey, harmony);
        cells.push({ fromLens, toLens, phiHarmony: harmony, interpretation, angleKey, explanation });
      }
    }
    return cells;
  }, [venusBlendA, venusBlendB, marsBlendA, marsBlendB, venusSignA, venusSignB, marsSignA, marsSignB]);

  // Overall weighted score (1-100)
  const overallScore = useMemo(() => {
    let total = 0;
    for (const cell of grid) {
      const key = `${cell.fromLens}-${cell.toLens}`;
      const weight = CHEM_CELL_WEIGHTS[key] || 0;
      total += cell.phiHarmony * weight * 10;
    }
    return Math.round(total);
  }, [grid]);

  const getCell = (from: ChemLens, to: ChemLens) =>
    grid.find(c => c.fromLens === from && c.toLens === to);

  // Render blend info in header cells
  const renderBlendLabel = (blend: SignBlend[]) => {
    const sorted = [...blend].sort((a, b) => b.weight - a.weight);
    const primary = sorted[0];
    const secondary = sorted[1];
    const hasCusp = secondary && formatBlendPercent(secondary.weight) >= 5;

    if (!hasCusp || !primary) {
      return (
        <span className="phc-sign-label">
          {primary ? `${primary.sign.slice(0, 3)} 100%` : '\u2014'}
        </span>
      );
    }

    return (
      <span className="phc-sign-label">
        <span className="phc-sign-primary">
          {primary.sign.slice(0, 3)} {formatBlendPercent(primary.weight)}%
        </span>
        <span className="phc-sign-secondary">
          {secondary.sign.slice(0, 3)} {formatBlendPercent(secondary.weight)}%
        </span>
      </span>
    );
  };

  return (
    <div className="phc-container">
      {/* Header */}
      <div className="phc-header">
        <div className="phc-title-row">
          <div>
            <h4 className="phc-title">
              <span className="phc-icon">♀♂</span> φ-Chemistry & Desire
            </h4>
            <p className="phc-subtitle">Venus/Mars — cusp-weighted attraction & passion</p>
          </div>
          <div className="phc-score-badge">
            <span className="phc-score-value" style={{ color: getHarmonyColor(overallScore / 10) }}>
              {overallScore}%
            </span>
            <span className="phc-score-sublabel">φ-Chemistry</span>
          </div>
        </div>
        <div className="phc-score-bar">
          <div
            className="phc-score-fill"
            style={{ width: `${overallScore}%` }}
          />
        </div>
      </div>

      {/* 2×2 Grid */}
      <div className="phc-matrix">
        {/* Header row: corner + 2 column headers */}
        <div className="phc-cell phc-corner">
          <span className="phc-corner-label">{nameA} ↓ / {nameB} →</span>
        </div>
        {CHEM_LENSES.map(lens => {
          const blend = getBlendForChemLens(lens, venusBlendB, marsBlendB, venusSignB, marsSignB);
          return (
            <div key={`hdr-${lens}`} className="phc-cell phc-col-header">
              <span className="phc-lens-icon">{CHEM_ICONS[lens]}</span>
              <span className="phc-lens-name">{CHEM_LABELS[lens]}</span>
              {renderBlendLabel(blend)}
            </div>
          );
        })}

        {/* Data rows */}
        {CHEM_LENSES.map(fromLens => {
          const fromBlend = getBlendForChemLens(fromLens, venusBlendA, marsBlendA, venusSignA, marsSignA);
          return (
            <React.Fragment key={`row-${fromLens}`}>
              <div className="phc-cell phc-row-header">
                <span className="phc-lens-icon">{CHEM_ICONS[fromLens]}</span>
                <span className="phc-lens-name">{CHEM_LABELS[fromLens]}</span>
                {renderBlendLabel(fromBlend)}
              </div>

              {CHEM_LENSES.map(toLens => {
                const cell = getCell(fromLens, toLens);
                if (!cell) return <div key={`c-${fromLens}-${toLens}`} className="phc-cell phc-empty" />;

                const cellKey = `${fromLens}-${toLens}`;
                const isSelected = selectedCell === cellKey;
                const color = getHarmonyColor(cell.phiHarmony);
                const weight = CHEM_CELL_WEIGHTS[cellKey] || 0;

                return (
                  <div
                    key={`c-${fromLens}-${toLens}`}
                    className={`phc-cell phc-data ${isSelected ? 'selected' : ''}`}
                    style={{
                      background: `${color}20`,
                      borderColor: isSelected ? color : `${color}40`,
                    }}
                    onClick={() => { setSelectedCell(isSelected ? null : cellKey); setShowCalc(false); }}
                    title={`${fromLens}\u2192${toLens}: ${cell.phiHarmony.toFixed(1)}/10`}
                  >
                    <div className="phc-cell-harmony" style={{ color }}>
                      {cell.phiHarmony.toFixed(1)}
                    </div>
                    <div className="phc-cell-label">harmony</div>
                    <div className="phc-cell-weight">{Math.round(weight * 100)}%</div>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>

      {/* Selected cell detail */}
      {selectedCell && (() => {
        const [fromLens, toLens] = selectedCell.split('-') as [ChemLens, ChemLens];
        const cell = getCell(fromLens, toLens);
        if (!cell) return null;

        const { steps } = cell.explanation;

        return (
          <div className="phc-detail">
            <div className="phc-detail-header">
              <span className="phc-detail-pair">
                {CHEM_ICONS[fromLens]} {fromLens} → {CHEM_ICONS[toLens]} {toLens}
              </span>
              <span className="phc-detail-score">
                {cell.phiHarmony.toFixed(1)} / 10
              </span>
            </div>

            {/* Sign Pair Breakdown */}
            <div className="phc-detail-pairs">
              {steps.signPairs.map((pair, i) => (
                <div key={i} className="phc-pair-card">
                  <div className="phc-aspect-badge" style={{ borderColor: `${pair.aspectColor}60`, background: `${pair.aspectColor}15` }}>
                    <span className="phc-aspect-symbol">{pair.aspectSymbol}</span>
                    <span className="phc-aspect-name">{pair.aspectName}</span>
                    <span className="phc-aspect-degrees">{pair.aspectAngle}\u00B0</span>
                  </div>

                  <div className="phc-pair-header-row">
                    <span className="phc-pair-signs">
                      {pair.a.slice(0, 3)} → {pair.b.slice(0, 3)}
                    </span>
                    <span className="phc-pair-combined" style={{ color: getHarmonyColor(pair.combinedBaseScore * 10) }}>
                      {(pair.combinedBaseScore * 10).toFixed(1)}
                    </span>
                    <span className="phc-pair-weight">
                      {Math.round(pair.fromWeight * 100)}% \u00D7 {Math.round(pair.toWeight * 100)}% = {Math.round(pair.weight * 100)}%
                    </span>
                  </div>

                  <div className="phc-pair-layers">
                    <span className="phc-chip aspect">
                      {pair.aspectName} {pair.aspectAngle}\u00B0 = {pair.aspectScore.toFixed(2)}
                    </span>
                    <span className="phc-chip element">
                      {pair.elementA}\u2192{pair.elementB} = {pair.elementScore.toFixed(2)}
                    </span>
                    <span className="phc-chip modality">
                      {pair.modalityA}\u2192{pair.modalityB} = {pair.modalityScore.toFixed(2)}
                    </span>
                    <span className="phc-chip seasonal">
                      {SEASONAL_PHASE_DISPLAY[pair.seasonalPhaseA]}\u2192{SEASONAL_PHASE_DISPLAY[pair.seasonalPhaseB]} = {pair.seasonalScore.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Formula */}
            <div className="phc-formula-bar">
              <span className="phc-formula-label">Formula:</span>
              <span className="phc-formula-text">
                {Math.round(LAYER_WEIGHTS.aspect * 100)}% Aspect + {Math.round(LAYER_WEIGHTS.element * 100)}% Element + {Math.round(LAYER_WEIGHTS.modality * 100)}% Modality + {Math.round(LAYER_WEIGHTS.seasonal * 100)}% Seasonal
              </span>
            </div>

            {/* Show Calculation Toggle */}
            <button
              type="button"
              className="phc-show-calc-btn"
              onClick={() => setShowCalc(!showCalc)}
            >
              {showCalc ? 'Hide' : 'Show'} Calculation
            </button>

            {showCalc && (
              <pre className="phc-calc-text">{cell.explanation.explanation}</pre>
            )}

            <p className="phc-interpretation">{cell.interpretation}</p>
          </div>
        );
      })()}

      <style>{`
        .phc-container {
          color: #e5e7eb;
        }

        /* Header */
        .phc-header {
          margin-bottom: 14px;
        }

        .phc-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .phc-title {
          font-size: 16px;
          font-weight: 700;
          color: ${ACCENT};
          margin: 0;
        }

        .phc-icon {
          margin-right: 6px;
        }

        .phc-subtitle {
          font-size: 12px;
          color: #9ca3af;
          margin: 4px 0 0 0;
        }

        .phc-score-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid ${ACCENT}60;
          border-radius: 10px;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.03);
        }

        .phc-score-value {
          font-size: 22px;
          font-weight: 800;
        }

        .phc-score-sublabel {
          font-size: 10px;
          color: #9ca3af;
          text-transform: uppercase;
        }

        .phc-score-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .phc-score-fill {
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, ${ACCENT}88, ${ACCENT});
          transition: width 0.5s ease;
        }

        /* 2×2 Grid */
        .phc-matrix {
          display: grid;
          grid-template-columns: 80px repeat(2, 1fr);
          gap: 4px;
          margin-bottom: 14px;
        }

        .phc-cell {
          padding: 8px;
          border-radius: 8px;
          text-align: center;
        }

        .phc-corner {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.03);
        }

        .phc-corner-label {
          font-size: 8px;
          color: #9ca3af;
          text-align: center;
          line-height: 1.3;
        }

        .phc-col-header,
        .phc-row-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          background: rgba(255, 255, 255, 0.04);
        }

        .phc-lens-icon {
          font-size: 18px;
        }

        .phc-lens-name {
          font-size: 10px;
          font-weight: 500;
          color: #9ca3af;
        }

        .phc-sign-label {
          display: flex;
          flex-direction: column;
          gap: 1px;
          font-size: 10px;
          font-weight: 600;
          color: #c4b5fd;
        }

        .phc-sign-secondary {
          font-size: 9px;
          color: #9ca3af;
        }

        /* Data Cells */
        .phc-data {
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .phc-data:hover {
          transform: scale(1.03);
        }

        .phc-data.selected {
          border-width: 2px;
        }

        .phc-cell-harmony {
          font-size: 18px;
          font-weight: 800;
        }

        .phc-cell-label {
          font-size: 9px;
          color: #6b7280;
          text-transform: uppercase;
        }

        .phc-cell-weight {
          font-size: 9px;
          color: #6b7280;
        }

        /* Detail Panel */
        .phc-detail {
          background: rgba(244, 114, 182, 0.06);
          border: 1px solid ${ACCENT}40;
          border-radius: 12px;
          padding: 14px;
          margin-top: 4px;
        }

        .phc-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .phc-detail-pair {
          font-size: 14px;
          font-weight: 700;
          color: ${ACCENT};
        }

        .phc-detail-score {
          font-size: 16px;
          font-weight: 700;
          color: #e5e7eb;
        }

        .phc-detail-pairs {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 12px;
        }

        .phc-pair-card {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          padding: 10px;
        }

        .phc-aspect-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          border: 1px solid;
          border-radius: 20px;
          margin-bottom: 8px;
        }

        .phc-aspect-symbol { font-size: 14px; }
        .phc-aspect-name { font-size: 12px; font-weight: 600; color: #e5e7eb; }
        .phc-aspect-degrees { font-size: 11px; color: #9ca3af; }

        .phc-pair-header-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }

        .phc-pair-signs {
          font-size: 12px;
          font-weight: 600;
          color: #e5e7eb;
        }

        .phc-pair-combined {
          font-size: 14px;
          font-weight: 700;
        }

        .phc-pair-weight {
          font-size: 10px;
          color: #9ca3af;
          margin-left: auto;
        }

        .phc-pair-layers {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .phc-chip {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 12px;
          font-weight: 500;
        }

        .phc-chip.aspect {
          background: rgba(96, 165, 250, 0.15);
          color: #93c5fd;
        }

        .phc-chip.element {
          background: rgba(34, 197, 94, 0.15);
          color: #86efac;
        }

        .phc-chip.modality {
          background: rgba(168, 85, 247, 0.15);
          color: #c4b5fd;
        }

        .phc-chip.seasonal {
          background: rgba(251, 191, 36, 0.15);
          color: #fcd34d;
        }

        .phc-formula-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 6px;
          margin-bottom: 8px;
        }

        .phc-formula-label {
          font-size: 10px;
          font-weight: 600;
          color: #9ca3af;
          text-transform: uppercase;
        }

        .phc-formula-text {
          font-size: 11px;
          color: #d1d5db;
        }

        .phc-show-calc-btn {
          display: block;
          width: 100%;
          padding: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: #9ca3af;
          font-size: 11px;
          cursor: pointer;
          margin-bottom: 8px;
          transition: background 0.2s;
        }

        .phc-show-calc-btn:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .phc-calc-text {
          font-size: 11px;
          line-height: 1.5;
          color: #9ca3af;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 10px;
          margin: 0 0 8px 0;
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .phc-interpretation {
          font-size: 13px;
          line-height: 1.6;
          color: #f9a8d4;
          margin: 0;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}</style>
    </div>
  );
};

export default PhiChemistryGrid;
