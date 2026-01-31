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
import { type SignKey } from '../../zodiac/tropicalMap';
import { getAngleBetweenSigns, type AngleKey } from '../../zodiac/angles';
import { RELATIONSHIP_WEIGHTS, type RelationshipType } from '../../zodiac/narrativeEngine';
import { formatBlendPercent, type SignBlend } from '../../zodiac/cusp/phiCurve';
import { baseAspectScore } from '../../zodiac/compatibility/scoringPrimitives';
import type { AspectType } from '../../zodiac/compatibility/types';
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

interface BlendPairDetail {
  fromSign: string;
  toSign: string;
  harmony: number;  // aspect-based harmony (baseAspectScore × 10)
  weight: number;   // combined blend weight (0-1)
}

interface PhiCellData {
  fromLens: Lens;
  toLens: Lens;
  phiHarmony: number;     // φ-weighted aspect harmony (1-10)
  blendDetails: string;   // e.g., "25% Ari→Can + 75% Tau→Can"
  blendPairs: BlendPairDetail[];
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

/** Bridge AngleKey (hyphens) → AspectType (underscores) */
function toAspectType(angleKey: AngleKey): AspectType {
  if (angleKey === 'semi-sextile') return 'semi_sextile';
  return angleKey as AspectType;
}

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

function computePhiWeightedScore(
  fromBlend: SignBlend[],
  toBlend: SignBlend[]
): { harmony: number; details: string; pairs: BlendPairDetail[] } {
  let totalHarmony = 0;
  const detailParts: string[] = [];
  const pairs: BlendPairDetail[] = [];

  for (const from of fromBlend) {
    for (const to of toBlend) {
      const fromKey = from.sign as SignKey;
      const toKey = to.sign as SignKey;

      const angleResult = getAngleBetweenSigns(fromKey, toKey);
      const angle = (angleResult?.key ?? 'conjunction') as AngleKey;

      // Aspect-based harmony (pure angle scoring)
      const harmony = baseAspectScore(toAspectType(angle)) * 10; // 0-1 → 0-10

      const combinedWeight = from.weight * to.weight;
      totalHarmony += harmony * combinedWeight;

      if (combinedWeight > 0.01) {
        detailParts.push(
          `${Math.round(combinedWeight * 100)}% ${from.sign.slice(0, 3)}→${to.sign.slice(0, 3)}`
        );
        pairs.push({
          fromSign: from.sign,
          toSign: to.sign,
          harmony: Math.round(harmony * 10) / 10,
          weight: combinedWeight,
        });
      }
    }
  }

  return {
    harmony: Math.round(totalHarmony * 10) / 10,
    details: detailParts.join(' + '),
    pairs,
  };
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

  // Use relationship-specific weights from narrativeEngine
  const cellWeights = RELATIONSHIP_WEIGHTS[relationshipType];

  // Compute φ-weighted scores for all 9 cells
  const grid = useMemo(() => {
    const cells: PhiCellData[] = [];
    for (const fromLens of LENSES) {
      for (const toLens of LENSES) {
        const fromBlend = getBlendForLens(fromLens, blendA, signsA[fromLens], moonBlendA, risingBlendA);
        const toBlend = getBlendForLens(toLens, blendB, signsB[toLens], moonBlendB, risingBlendB);
        const { harmony, details, pairs } = computePhiWeightedScore(fromBlend, toBlend);
        cells.push({ fromLens, toLens, phiHarmony: harmony, blendDetails: details, blendPairs: pairs });
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
          <span className="phi-score-label">Aspect Harmony</span>
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
                    onClick={() => setSelectedCell(isSelected ? null : cellKey)}
                    title={cell.blendDetails}
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

      {/* Selected cell detail */}
      {selectedCell && (() => {
        const [fromLens, toLens] = selectedCell.split('-') as [Lens, Lens];
        const cell = getCell(fromLens, toLens);
        if (!cell) return null;

        return (
          <div className="phi-cell-detail">
            <div className="phi-detail-header">
              <span className="phi-detail-aspect">
                {LENS_ICONS[fromLens]} {fromLens} → {LENS_ICONS[toLens]} {toLens}
              </span>
              <span className="phi-detail-scores">
                Harmony {cell.phiHarmony.toFixed(1)}
              </span>
            </div>
            {cell.blendPairs.length > 1 ? (
              <div className="phi-detail-pairs">
                {cell.blendPairs.map((pair, i) => (
                  <div key={i} className="phi-detail-pair-row">
                    <span className="phi-pair-signs">
                      {pair.fromSign.slice(0, 3)}→{pair.toSign.slice(0, 3)}
                    </span>
                    <span className="phi-pair-harmony" style={{ color: getHarmonyColor(pair.harmony) }}>
                      {pair.harmony.toFixed(1)}
                    </span>
                    <span className="phi-pair-weight">
                      {Math.round(pair.weight * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="phi-detail-blend">{cell.blendDetails}</p>
            )}
          </div>
        );
      })()}

      <style>{`
        .phi-blend-grid-container {
          color: #e5e7eb;
        }

        .phi-grid-header {
          margin-bottom: 12px;
        }

        .phi-grid-header h4 {
          font-size: 14px;
          font-weight: 600;
          color: #fbbf24;
          margin: 0 0 2px 0;
        }

        .phi-grid-subtitle {
          font-size: 12px;
          color: #9ca3af;
          margin: 0;
        }

        /* φ Score */
        .phi-score-display {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .phi-score-icon {
          font-size: 28px;
          font-weight: 800;
          color: #fbbf24;
          font-style: italic;
        }

        .phi-score-text {
          display: flex;
          flex-direction: column;
        }

        .phi-score-value {
          font-size: 24px;
          font-weight: 800;
        }

        .phi-score-label {
          font-size: 12px;
          color: #9ca3af;
        }

        /* Grid */
        .phi-matrix-grid {
          display: grid;
          grid-template-columns: 60px 70px repeat(3, 1fr);
          gap: 4px;
        }

        .phi-cell {
          padding: 8px 4px;
          border-radius: 8px;
          text-align: center;
        }

        .phi-cell.header {
          background: rgba(251, 191, 36, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .phi-cell.header.corner {
          font-size: 8px;
          color: #d1d5db;
          justify-content: center;
          padding: 6px 2px;
        }

        .phi-corner-label {
          line-height: 1.3;
        }

        .phi-cell.row-header {
          background: rgba(251, 191, 36, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
        }

        .phi-lens-icon {
          font-size: 16px;
        }

        .phi-lens-name {
          font-size: 10px;
          font-weight: 500;
          color: #9ca3af;
        }

        .phi-cell.zodiac-col-hdr {
          justify-content: center;
        }

        .phi-col-name {
          font-size: 9px;
          color: #d1d5db;
          font-weight: 600;
        }

        .phi-birth-date {
          font-size: 8px;
          color: #9ca3af;
          font-weight: 400;
        }

        .phi-cell.zodiac-row-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(251, 191, 36, 0.08);
          border-radius: 8px;
          gap: 1px;
        }

        .phi-row-name {
          font-size: 9px;
          color: #d1d5db;
          font-weight: 600;
          text-align: center;
          line-height: 1.2;
          word-break: break-word;
        }

        .phi-cell.zodiac-empty {
          background: transparent;
        }

        .phi-cell.zodiac-sign {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(167, 139, 250, 0.1);
          border-radius: 8px;
        }

        .phi-cell.row-zodiac {
          background: rgba(167, 139, 250, 0.1);
        }

        /* Blend label in zodiac cells */
        .phi-blend-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        }

        .phi-sign-primary {
          font-size: 11px;
          font-weight: 600;
          color: #c4b5fd;
          letter-spacing: 0.3px;
        }

        .phi-sign-secondary {
          font-size: 9px;
          font-weight: 500;
          color: #a78bfa;
          opacity: 0.8;
        }

        /* Data cells */
        .phi-cell.data {
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1px;
          min-height: 56px;
        }

        .phi-cell.data:hover {
          transform: scale(1.02);
        }

        .phi-cell.data.selected {
          border-width: 2px;
        }

        .phi-cell-harmony {
          font-size: 16px;
          font-weight: 700;
        }

        .phi-cell-label {
          font-size: 8px;
          color: #6b7280;
          text-transform: uppercase;
        }

        .phi-cell-weight {
          font-size: 9px;
          color: #6b7280;
        }

        /* Detail */
        .phi-cell-detail {
          margin-top: 12px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 12px;
          padding: 12px;
        }

        .phi-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .phi-detail-aspect {
          font-size: 13px;
          font-weight: 700;
          color: #60a5fa;
        }

        .phi-detail-scores {
          font-size: 11px;
          color: #9ca3af;
        }

        .phi-detail-blend {
          font-size: 12px;
          color: #d1d5db;
          margin: 0;
          line-height: 1.5;
        }

        .phi-detail-pairs {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 4px;
        }

        .phi-detail-pair-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          padding: 3px 6px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.04);
        }

        .phi-pair-signs {
          color: #d1d5db;
          font-weight: 600;
          min-width: 80px;
        }

        .phi-pair-harmony {
          font-weight: 700;
          min-width: 30px;
          text-align: right;
        }

        .phi-pair-weight {
          color: #6b7280;
          font-size: 11px;
          margin-left: auto;
        }
      `}</style>
    </div>
  );
};

export default PhiBlendGrid;
