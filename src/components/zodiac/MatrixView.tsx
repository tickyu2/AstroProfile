/**
 * MatrixView.tsx
 *
 * Displays the 5-matrix synastry grid view for compatibility analysis.
 * Extracted from CompatibilityAnalysisPanel for modularity.
 */

import React, { useState, useCallback } from 'react';
import './MatrixView.css';
import { SynastryGrid } from './SynastryGrid';
import { PlanetaryMatrixGrid } from './PlanetaryMatrixGrid';
import type { PlanetaryMatrix, FinalCompatibilityScore } from '../../zodiac/planetaryMatrices';

interface ProfileData {
  id: string;
  name: string;
  birthDate?: string | null;
  sunSign: string | null;
  moonSign: string | null;
  risingSign: string | null;
}

const LAYER_LABELS: Record<string, string> = {
  coreBond: 'Core Bond',
  chemistry: 'Chemistry',
  communication: 'Communication',
  growth: 'Growth',
  transformation: 'Transformation',
};

interface MatrixViewProps {
  finalScore: FinalCompatibilityScore;
  synastryMatrix: any;
  chemistryMatrix: PlanetaryMatrix | null;
  communicationMatrix: PlanetaryMatrix | null;
  growthMatrix: PlanetaryMatrix | null;
  transformationMatrix: PlanetaryMatrix | null;
  profileA: ProfileData;
  profileB: ProfileData;
  planetaryMatrixCount: number;
  onPrint: () => void;
}

export const MatrixView: React.FC<MatrixViewProps> = ({
  finalScore,
  synastryMatrix,
  chemistryMatrix,
  communicationMatrix,
  growthMatrix,
  transformationMatrix,
  profileA,
  profileB,
  planetaryMatrixCount,
  onPrint,
}) => {
  const [highlightA, setHighlightA] = useState<string | null>(null);
  const [highlightB, setHighlightB] = useState<string | null>(null);

  const handleHighlight = useCallback((pA: string | null, pB: string | null) => {
    setHighlightA(pA);
    setHighlightB(pB);
  }, []);

  return (
    <>
      {/* Final Weighted Score Banner */}
      {finalScore.finalPercent != null && (
        <div className="final-score-banner">
          <div className="final-score-value">{finalScore.finalPercent}%</div>
          <div className="final-score-details">
            <span className="final-score-label">Overall Harmony</span>
            <span className="final-score-verdict">{finalScore.verdict}</span>
          </div>
          {finalScore.layerScores.length > 1 && (
            <div className="final-score-layers">
              {finalScore.layerScores.map(ls => (
                <div key={ls.layer} className="final-layer-chip">
                  <span className="final-layer-name">{LAYER_LABELS[ls.layer] || ls.layer}</span>
                  <span className="final-layer-score">{ls.score != null ? ls.score.toFixed(1) : '—'}</span>
                  <span className="final-layer-weight">{Math.round(ls.weight * 100)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Matrix 1: Core Bond */}
      {synastryMatrix && (
        <div className="matrix-section">
          <h3 className="matrix-section-title">
            <span className="matrix-section-icon">🔗</span>
            Core Bond
            <span className="matrix-section-weight">45%</span>
          </h3>
          <SynastryGrid
            matrix={synastryMatrix}
            nameA={profileA.name}
            nameB={profileB.name}
            birthDateA={profileA.birthDate}
            birthDateB={profileB.birthDate}
          />
        </div>
      )}

      {/* Matrix 2: Chemistry */}
      {chemistryMatrix && (
        <div className="matrix-section">
          <h3 className="matrix-section-title">
            <span className="matrix-section-icon">🔥</span>
            Chemistry
            <span className="matrix-section-weight">20%</span>
          </h3>
          <PlanetaryMatrixGrid
            matrix={chemistryMatrix}
            nameA={profileA.name}
            nameB={profileB.name}
            highlightA={highlightA}
            highlightB={highlightB}
          />
        </div>
      )}

      {/* Matrix 3: Communication */}
      {communicationMatrix && (
        <div className="matrix-section">
          <h3 className="matrix-section-title">
            <span className="matrix-section-icon">💬</span>
            Communication
            <span className="matrix-section-weight">15%</span>
          </h3>
          <PlanetaryMatrixGrid
            matrix={communicationMatrix}
            nameA={profileA.name}
            nameB={profileB.name}
            highlightA={highlightA}
            highlightB={highlightB}
          />
        </div>
      )}

      {/* Matrix 4: Growth */}
      {growthMatrix && (
        <div className="matrix-section">
          <h3 className="matrix-section-title">
            <span className="matrix-section-icon">🌱</span>
            Growth
            <span className="matrix-section-weight">12%</span>
          </h3>
          <PlanetaryMatrixGrid
            matrix={growthMatrix}
            nameA={profileA.name}
            nameB={profileB.name}
            highlightA={highlightA}
            highlightB={highlightB}
          />
        </div>
      )}

      {/* Matrix 5: Transformation */}
      {transformationMatrix && (
        <div className="matrix-section">
          <h3 className="matrix-section-title">
            <span className="matrix-section-icon">🦋</span>
            Transformation
            <span className="matrix-section-weight">8%</span>
          </h3>
          <PlanetaryMatrixGrid
            matrix={transformationMatrix}
            nameA={profileA.name}
            nameB={profileB.name}
            highlightA={highlightA}
            highlightB={highlightB}
          />
        </div>
      )}

      {/* No planetary data message */}
      {!synastryMatrix && planetaryMatrixCount === 0 && (
        <div className="no-matrix-data">
          <p>Insufficient sign data to build compatibility matrices.</p>
        </div>
      )}

      {/* Print Report Button */}
      {finalScore.finalPercent != null && (
        <button type="button" className="print-report-btn" onClick={onPrint}>
          <span>🖨️</span>
          <span>Print Synastry Report</span>
        </button>
      )}
    </>
  );
};
