/**
 * PhiBlendGrid - φ-Curve Cusp-Aware 5×5 Synastry Matrix
 *
 * Same 5×5 layout as SynastryGrid but with cusp blend info in headers
 * and φ-weighted compatibility scores in data cells.
 *
 * Header cells show:
 *   Pure sign:  "Ari 100%"
 *   Cusp blend: "Ari 40%" (top) + "Tau 60%" (bottom)
 *
 * Data cells show φ-weighted harmony scores:
 *   φ-score = Σ (blend_weight × harmony(sign, target))
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useMemo, useState } from 'react';
import './PhiBlendGrid.css';
import { type SignKey } from '../../zodiac/tropicalMap';
import { getAngleBetweenSigns, type AngleKey } from '../../zodiac/angles';
import { RELATIONSHIP_WEIGHTS, type RelationshipType } from '../../zodiac/narrativeEngine';
import { formatBlendPercent, type SignBlend } from '../../zodiac/cusp/phiCurve';
import { interpretCell } from '../../zodiac/compatibility/phiInterpretation';
import { explainCell, type CellExplanation } from '../../zodiac/compatibility/explainCell';
import { LAYER_WEIGHTS, SEASONAL_PHASE_DISPLAY } from '../../zodiac/compatibility/elementModality';
import { buildNarrativeSynthesis } from '../../zodiac/compatibility/narrativeSynthesis';
import type { ZodiacSign } from '../../data/tropicalSeasons';

// =============================================================================
// TYPES
// =============================================================================

type Lens = 'Sun' | 'Moon' | 'Rising';

interface PhiBlendGridProps {
  nameA: string;
  nameB: string;
  birthDateA?: string | null;
  birthDateB?: string | null;
  signsA: Record<Lens, string>;
  signsB: Record<Lens, string>;
  blendA: SignBlend[];  // Sun blend for profile A
  blendB: SignBlend[];  // Sun blend for profile B
  moonBlendA?: SignBlend[];   // Moon blend (from longitude, when birth time known)
  moonBlendB?: SignBlend[];
  risingBlendA?: SignBlend[]; // Rising blend (from longitude, when birth time known)
  risingBlendB?: SignBlend[];
  relationshipType?: RelationshipType;
}

interface PhiCellData {
  fromLens: Lens;
  toLens: Lens;
  phiHarmony: number;     // φ-weighted 3-layer harmony (0-10)
  interpretation: string; // 3-sentence human-readable interpretation
  angleKey: AngleKey;     // Dominant aspect between primary signs
  explanation: CellExplanation; // Full calculation breakdown
}

// =============================================================================
// CONSTANTS
// =============================================================================

const LENS_ICONS: Record<Lens, string> = { Sun: '☉', Moon: '☽', Rising: '↑' };
const LENS_LABELS: Record<Lens, string> = { Sun: 'Sun', Moon: 'Moon', Rising: 'Rising' };
const LENSES: Lens[] = ['Sun', 'Moon', 'Rising'];

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

function getBlendForLens(
  lens: Lens,
  sunBlend: SignBlend[],
  sign: string,
  moonBlend?: SignBlend[],
  risingBlend?: SignBlend[],
): SignBlend[] {
  if (lens === 'Sun' && sunBlend.length > 0) return sunBlend;
  if (lens === 'Moon' && moonBlend && moonBlend.length > 0) return moonBlend;
  if (lens === 'Rising' && risingBlend && risingBlend.length > 0) return risingBlend;
  return [{ sign: sign as ZodiacSign, weight: 1 }];
}

function formatBirthDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export const PhiBlendGrid: React.FC<PhiBlendGridProps> = ({
  nameA,
  nameB,
  birthDateA,
  birthDateB,
  signsA,
  signsB,
  blendA,
  blendB,
  moonBlendA,
  moonBlendB,
  risingBlendA,
  risingBlendB,
  relationshipType = 'romantic',
}) => {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [showCalc, setShowCalc] = useState(false);
  const [showNarrative, setShowNarrative] = useState(false);

  // Use relationship-specific weights from narrativeEngine
  const cellWeights = RELATIONSHIP_WEIGHTS[relationshipType];

  // Compute φ-weighted 3-layer scores for all 9 cells
  const grid = useMemo(() => {
    const cells: PhiCellData[] = [];
    for (const fromLens of LENSES) {
      for (const toLens of LENSES) {
        const fromBlend = getBlendForLens(fromLens, blendA, signsA[fromLens], moonBlendA, risingBlendA);
        const toBlend = getBlendForLens(toLens, blendB, signsB[toLens], moonBlendB, risingBlendB);

        // 3-layer scoring: aspect 50% + element 30% + modality 20%
        const explanation = explainCell(fromLens, toLens, fromBlend, toBlend);
        const harmony = explanation.score10;

        // Dominant angle for interpretation + badge
        const dominantFrom = [...fromBlend].sort((a, b) => b.weight - a.weight)[0];
        const dominantTo = [...toBlend].sort((a, b) => b.weight - a.weight)[0];
        const angleResult = getAngleBetweenSigns(dominantFrom.sign as SignKey, dominantTo.sign as SignKey);
        const angleKey = (angleResult?.key ?? 'conjunction') as AngleKey;

        const interpretation = interpretCell(fromLens, toLens, fromBlend, toBlend, angleKey, harmony);
        cells.push({ fromLens, toLens, phiHarmony: harmony, interpretation, angleKey, explanation });
      }
    }
    return cells;
  }, [signsA, signsB, blendA, blendB, moonBlendA, moonBlendB, risingBlendA, risingBlendB]);

  // Overall φ-weighted aspect score
  const overallScore = useMemo(() => {
    let total = 0;
    for (const cell of grid) {
      const key = `${cell.fromLens}-${cell.toLens}`;
      const weight = cellWeights[key as keyof typeof cellWeights] || 0;
      total += cell.phiHarmony * weight * 10;
    }
    return Math.round(total);
  }, [grid, cellWeights]);

  // Narrative synthesis (3 chambers + overall story)
  const narrative = useMemo(
    () => buildNarrativeSynthesis(grid, overallScore, nameA, nameB),
    [grid, overallScore, nameA, nameB],
  );

  const getCell = (from: Lens, to: Lens) =>
    grid.find(c => c.fromLens === from && c.toLens === to);

  // Render blend info in header cells
  const renderBlendLabel = (blend: SignBlend[]) => {
    const sorted = [...blend].sort((a, b) => b.weight - a.weight);
    const primary = sorted[0];
    const secondary = sorted[1];
    const hasCusp = secondary && formatBlendPercent(secondary.weight) >= 5;

    if (!hasCusp || !primary) {
      return (
        <div className="phi-blend-label">
          <span className="phi-sign-primary">
            {primary ? `${primary.sign.slice(0, 3)} 100%` : '—'}
          </span>
        </div>
      );
    }

    return (
      <div className="phi-blend-label">
        <span className="phi-sign-primary">
          {primary.sign.slice(0, 3)} {formatBlendPercent(primary.weight)}%
        </span>
        <span className="phi-sign-secondary">
          {secondary.sign.slice(0, 3)} {formatBlendPercent(secondary.weight)}%
        </span>
      </div>
    );
  };

  return (
    <div className="phi-blend-grid-container">
      {/* Header */}
      <div className="phi-grid-header">
        <div>
          <h4>φ-Blend Matrix</h4>
          <p className="phi-grid-subtitle">Cusp-weighted compatibility</p>
        </div>
      </div>

      {/* Overall φ-Score */}
      <div className="phi-score-display">
        <span className="phi-score-icon">φ</span>
        <div className="phi-score-text">
          <span className="phi-score-value" style={{ color: getHarmonyColor(overallScore / 10) }}>
            {overallScore}%
          </span>
          <span className="phi-score-label">Aspect · Element · Modality · Seasonal</span>
        </div>
      </div>

      {/* 5×5 Grid */}
      <div className="phi-matrix-grid">
        {/* Row 0: Header row */}
        <div className="phi-cell header corner">
          <span className="phi-corner-label">{nameA} ↓ / {nameB} →</span>
        </div>
        <div className="phi-cell header zodiac-col-hdr">
          <span className="phi-col-name">{nameB}</span>
          {birthDateB && <span className="phi-birth-date">{formatBirthDate(birthDateB)}</span>}
        </div>
        {LENSES.map(lens => (
          <div key={`hdr-${lens}`} className="phi-cell header">
            <span className="phi-lens-icon">{LENS_ICONS[lens]}</span>
            <span className="phi-lens-name">{LENS_LABELS[lens]}</span>
          </div>
        ))}

        {/* Row 1: Person B's blend labels */}
        <div className="phi-cell zodiac-row-label">
          <span className="phi-row-name">{nameA}</span>
          {birthDateA && <span className="phi-birth-date">{formatBirthDate(birthDateA)}</span>}
        </div>
        <div className="phi-cell zodiac-empty" />
        {LENSES.map(lens => {
          const blend = getBlendForLens(lens, blendB, signsB[lens], moonBlendB, risingBlendB);
          return (
            <div key={`signB-${lens}`} className="phi-cell zodiac-sign">
              {renderBlendLabel(blend)}
            </div>
          );
        })}

        {/* Rows 2-4: Data rows */}
        {LENSES.map(fromLens => {
          const fromBlend = getBlendForLens(fromLens, blendA, signsA[fromLens], moonBlendA, risingBlendA);
          return (
            <React.Fragment key={`row-${fromLens}`}>
              {/* Lens header */}
              <div className="phi-cell row-header">
                <span className="phi-lens-icon">{LENS_ICONS[fromLens]}</span>
                <span className="phi-lens-name">{LENS_LABELS[fromLens]}</span>
              </div>

              {/* Person A's blend label */}
              <div className="phi-cell zodiac-sign row-zodiac">
                {renderBlendLabel(fromBlend)}
              </div>

              {/* 3 data cells */}
              {LENSES.map(toLens => {
                const cell = getCell(fromLens, toLens);
                if (!cell) return <div key={`c-${fromLens}-${toLens}`} className="phi-cell empty" />;

                const cellKey = `${fromLens}-${toLens}`;
                const isSelected = selectedCell === cellKey;
                const color = getHarmonyColor(cell.phiHarmony);
                const weight = cellWeights[cellKey as keyof typeof cellWeights] || 0;

                return (
                  <div
                    key={`c-${fromLens}-${toLens}`}
                    className={`phi-cell data ${isSelected ? 'selected' : ''}`}
                    style={{
                      background: `${color}20`,
                      borderColor: isSelected ? color : `${color}40`,
                    }}
                    onClick={() => { setSelectedCell(isSelected ? null : cellKey); setShowCalc(false); }}
                    title={`${fromLens}→${toLens}: ${cell.phiHarmony.toFixed(1)}/10`}
                  >
                    <div className="phi-cell-harmony" style={{ color }}>
                      {cell.phiHarmony.toFixed(1)}
                    </div>
                    <div className="phi-cell-label">harmony</div>
                    <div className="phi-cell-weight">
                      {Math.round(weight * 100)}%
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>

      {/* Narrative Synthesis */}
      <div className="phi-narrative-section">
        <button
          type="button"
          className="phi-narrative-toggle"
          onClick={() => setShowNarrative(!showNarrative)}
        >
          {showNarrative ? 'Hide' : 'Show'} Story
        </button>

        {showNarrative && (
          <div className="phi-narrative-content">
            {narrative.chambers.map(chamber => (
              <div key={chamber.id} className="phi-narrative-chamber">
                <div className="phi-chamber-header">
                  <span className="phi-chamber-title">{chamber.title}</span>
                  <span className="phi-chamber-score" style={{ color: getHarmonyColor(chamber.avgScore) }}>
                    {chamber.avgScore.toFixed(1)}/10
                  </span>
                </div>
                <p className="phi-chamber-text">{chamber.paragraph}</p>
              </div>
            ))}

            <div className="phi-narrative-synthesis">
              <div className="phi-chamber-header">
                <span className="phi-chamber-title">Synthesis</span>
                <span className="phi-chamber-score" style={{ color: getHarmonyColor(narrative.synthesis.overallScore / 10) }}>
                  {narrative.synthesis.overallScore}%
                </span>
              </div>
              <p className="phi-chamber-text">{narrative.synthesis.paragraph}</p>
            </div>
          </div>
        )}
      </div>

      {/* Selected cell detail */}
      {selectedCell && (() => {
        const [fromLens, toLens] = selectedCell.split('-') as [Lens, Lens];
        const cell = getCell(fromLens, toLens);
        if (!cell) return null;

        const { steps } = cell.explanation;

        return (
          <div className="phi-cell-detail">
            {/* Header */}
            <div className="phi-detail-header">
              <span className="phi-detail-aspect">
                {LENS_ICONS[fromLens]} {fromLens} → {LENS_ICONS[toLens]} {toLens}
              </span>
              <span className="phi-detail-scores">
                {cell.phiHarmony.toFixed(1)} / 10
              </span>
            </div>

            {/* Sign Pair Breakdown — each pair gets its own aspect badge */}
            <div className="phi-detail-pairs">
              {steps.signPairs.map((pair, i) => (
                <div key={i} className="phi-detail-pair-card">
                  {/* Per-pair aspect badge */}
                  <div className="phi-detail-aspect-badge" style={{ borderColor: `${pair.aspectColor}60`, background: `${pair.aspectColor}15` }}>
                    <span className="phi-aspect-symbol">{pair.aspectSymbol}</span>
                    <span className="phi-aspect-name">{pair.aspectName}</span>
                    <span className="phi-aspect-degrees">{pair.aspectAngle}°</span>
                  </div>

                  <div className="phi-pair-header-row">
                    <span className="phi-pair-signs">
                      {pair.a.slice(0, 3)} → {pair.b.slice(0, 3)}
                    </span>
                    <span className="phi-pair-combined" style={{ color: getHarmonyColor(pair.combinedBaseScore * 10) }}>
                      {(pair.combinedBaseScore * 10).toFixed(1)}
                    </span>
                    <span className="phi-pair-weight">
                      {Math.round(pair.fromWeight * 100)}% × {Math.round(pair.toWeight * 100)}% = {Math.round(pair.weight * 100)}%
                    </span>
                  </div>
                  <div className="phi-pair-layers">
                    <span className="phi-layer-chip aspect">
                      {pair.aspectName} {pair.aspectAngle}° = {pair.aspectScore.toFixed(2)}
                    </span>
                    <span className="phi-layer-chip element">
                      {pair.elementA}→{pair.elementB} = {pair.elementScore.toFixed(2)}
                    </span>
                    <span className="phi-layer-chip modality">
                      {pair.modalityA}→{pair.modalityB} = {pair.modalityScore.toFixed(2)}
                    </span>
                    <span className="phi-layer-chip seasonal">
                      {SEASONAL_PHASE_DISPLAY[pair.seasonalPhaseA]}→{SEASONAL_PHASE_DISPLAY[pair.seasonalPhaseB]} = {pair.seasonalScore.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Layer Weight Formula */}
            <div className="phi-formula-bar">
              <span className="phi-formula-label">Formula:</span>
              <span className="phi-formula-text">
                {Math.round(LAYER_WEIGHTS.aspect * 100)}% Aspect + {Math.round(LAYER_WEIGHTS.element * 100)}% Element + {Math.round(LAYER_WEIGHTS.modality * 100)}% Modality + {Math.round(LAYER_WEIGHTS.seasonal * 100)}% Seasonal
              </span>
            </div>

            {/* Show Calculation Toggle */}
            <button
              type="button"
              className="phi-show-calc-btn"
              onClick={() => setShowCalc(!showCalc)}
            >
              {showCalc ? 'Hide' : 'Show'} Calculation
            </button>

            {showCalc && (
              <pre className="phi-calc-text">{cell.explanation.explanation}</pre>
            )}

            {/* Interpretation Paragraph */}
            <p className="phi-detail-interpretation">{cell.interpretation}</p>
          </div>
        );
      })()}

    </div>
  );
};

export default PhiBlendGrid;
