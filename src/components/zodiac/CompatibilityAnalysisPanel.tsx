/**
 * CompatibilityAnalysisPanel - Susan Miller-style Compatibility Analysis
 *
 * Displays compatibility analysis between two profiles with:
 * - Dual-lens view (A→B and B→A perspectives)
 * - Sun/Moon/Rising layer comparison
 * - Context tabs (Romance/Business/Friendship)
 * - Effort and Growth potential scores
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { type SignKey } from '../../zodiac/tropicalMap';
import {
  buildPerspective,
  buildFullCompatibilityReport,
  buildSynastryMatrix,
  type Lens,
  type Context,
  type PerspectiveReport,
  type RelationshipType,
} from '../../zodiac/narrativeEngine';
import {
  buildChemistryMatrix,
  buildCommunicationMatrix,
  buildGrowthMatrix,
  buildTransformationMatrix,
  computeFinalCompatibility,
  type PlanetPosition,
  type Planet,
  type PlanetaryMatrix,
  type FinalCompatibilityScore,
} from '../../zodiac/planetaryMatrices';
import { PlanetaryMatrixGrid } from './PlanetaryMatrixGrid';
import {
  type AllMatrices,
  generateSynastryReportWithStandouts,
} from '../../zodiac/synastryPreview';
import { SynastryPdfReport } from './SynastryPdfReport';
import { SynastryGrid } from './SynastryGrid';
import { ProfileComparisonModal } from './ProfileComparisonModal';
import { InDepthGuidance } from './InDepthGuidance';

type ViewMode = 'layer' | 'matrix';

/** Convert ProfileData outer-planet signs to PlanetPosition[] for matrix builders. */
function buildPlanetPositions(p: ProfileData): PlanetPosition[] {
  const pairs: [Planet, string | null | undefined][] = [
    ['Venus', p.venusSign],
    ['Mars', p.marsSign],
    ['Mercury', p.mercurySign],
    ['Jupiter', p.jupiterSign],
    ['Saturn', p.saturnSign],
    ['Uranus', p.uranusSign],
    ['Neptune', p.neptuneSign],
    ['Pluto', p.plutoSign],
  ];
  return pairs
    .filter((x): x is [Planet, string] => !!x[1])
    .map(([planet, sign]) => ({ planet, sign: sign as SignKey }));
}

// =============================================================================
// TYPES
// =============================================================================

interface ProfileData {
  id: string;
  name: string;
  birthDate?: string | null;  // ISO date string YYYY-MM-DD
  sunSign: string | null;
  moonSign: string | null;
  risingSign: string | null;
  venusSign?: string | null;
  marsSign?: string | null;
  mercurySign?: string | null;
  jupiterSign?: string | null;
  saturnSign?: string | null;
  uranusSign?: string | null;
  neptuneSign?: string | null;
  plutoSign?: string | null;
}

interface CompatibilityAnalysisPanelProps {
  profileA: ProfileData;
  profileB: ProfileData;
  onClose?: () => void;
  relationshipType?: RelationshipType;
  onRelationshipTypeChange?: (rt: RelationshipType) => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const LENS_ICONS: Record<Lens, string> = {
  Sun: '☉',
  Moon: '☽',
  Rising: '↑',
};

const CONTEXT_ICONS: Record<Context, string> = {
  romance: '💕',
  business: '💼',
  friendship: '🤝',
};

const CONTEXT_LABELS: Record<Context, string> = {
  romance: 'Romance',
  business: 'Business',
  friendship: 'Friendship',
};

const REL_TYPE_ICONS: Record<RelationshipType, string> = {
  romantic: '💕',
  bestFriend: '💜',
  friend: '🤝',
  coworker: '💼',
};

const REL_TYPE_LABELS: Record<RelationshipType, string> = {
  romantic: 'Romantic',
  bestFriend: 'Best Friend',
  friend: 'Friend',
  coworker: 'Coworker',
};

const REL_TYPES: RelationshipType[] = ['romantic', 'bestFriend', 'friend', 'coworker'];

const LAYER_LABELS: Record<string, string> = {
  coreBond: 'Core Bond',
  chemistry: 'Chemistry',
  communication: 'Communication',
  growth: 'Growth',
  transformation: 'Transformation',
};

/** Map relationship type to Context for layer-view narrative functions */
const REL_TO_CONTEXT: Record<RelationshipType, Context> = {
  romantic: 'romance',
  bestFriend: 'friendship',
  friend: 'friendship',
  coworker: 'business',
};

// =============================================================================
// SCORE BAR COMPONENT
// =============================================================================

const ScoreBar: React.FC<{ score: number; label: string; color: string }> = ({ score, label, color }) => (
  <div className="score-bar-container">
    <div className="score-bar-label">
      <span>{label}</span>
      <span className="score-value">{score}/10</span>
    </div>
    <div className="score-bar-track">
      <div
        className="score-bar-fill"
        style={{ width: `${score * 10}%`, background: color }}
      />
    </div>
  </div>
);

// =============================================================================
// COMPONENT
// =============================================================================

export const CompatibilityAnalysisPanel: React.FC<CompatibilityAnalysisPanelProps> = ({
  profileA,
  profileB,
  onClose,
  relationshipType: controlledRelType,
  onRelationshipTypeChange,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('matrix'); // Default to matrix view
  const [activeLens, setActiveLens] = useState<Lens>('Sun');
  const [internalRelType, setInternalRelType] = useState<RelationshipType>('romantic');
  const [viewDirection, setViewDirection] = useState<'A→B' | 'B→A'>('A→B');
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showPdfReport, setShowPdfReport] = useState(false);
  const [highlightA, setHighlightA] = useState<string | null>(null);
  const [highlightB, setHighlightB] = useState<string | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  // Use controlled prop if provided, otherwise internal state
  const activeRelType = controlledRelType ?? internalRelType;
  const setActiveRelType = (rt: RelationshipType) => {
    if (onRelationshipTypeChange) onRelationshipTypeChange(rt);
    else setInternalRelType(rt);
  };

  // Derive Context from relationship type for narrative functions
  const activeContext = REL_TO_CONTEXT[activeRelType];

  // Get signs for current lens
  const getSignForLens = (profile: ProfileData, lens: Lens): SignKey | null => {
    switch (lens) {
      case 'Sun': return profile.sunSign as SignKey | null;
      case 'Moon': return profile.moonSign as SignKey | null;
      case 'Rising': return profile.risingSign as SignKey | null;
    }
  };

  const signA = getSignForLens(profileA, activeLens);
  const signB = getSignForLens(profileB, activeLens);

  // Build perspective report
  const report = useMemo<PerspectiveReport | null>(() => {
    if (!signA || !signB) return null;

    const from = viewDirection === 'A→B' ? signA : signB;
    const to = viewDirection === 'A→B' ? signB : signA;

    return buildPerspective(from, to, activeLens, activeContext);
  }, [signA, signB, activeLens, activeContext, viewDirection]);

  // Build full report for overview
  const fullReport = useMemo(() => {
    if (!profileA.sunSign || !profileB.sunSign) return null;

    return buildFullCompatibilityReport(
      profileA.sunSign as SignKey,
      (profileA.moonSign || profileA.sunSign) as SignKey,
      (profileA.risingSign || profileA.sunSign) as SignKey,
      profileB.sunSign as SignKey,
      (profileB.moonSign || profileB.sunSign) as SignKey,
      (profileB.risingSign || profileB.sunSign) as SignKey,
      activeContext
    );
  }, [profileA, profileB, activeContext]);

  // Build 9-way synastry matrix
  const synastryMatrix = useMemo(() => {
    if (!profileA.sunSign || !profileB.sunSign) return null;

    return buildSynastryMatrix(
      profileA.sunSign as SignKey,
      (profileA.moonSign || profileA.sunSign) as SignKey,
      (profileA.risingSign || profileA.sunSign) as SignKey,
      profileB.sunSign as SignKey,
      (profileB.moonSign || profileB.sunSign) as SignKey,
      (profileB.risingSign || profileB.sunSign) as SignKey,
      activeContext,
      activeRelType
    );
  }, [profileA, profileB, activeContext, activeRelType]);

  // ── Planetary Matrices 2-5 ─────────────────────────────────────────────
  const positionsA = useMemo(() => buildPlanetPositions(profileA), [profileA]);
  const positionsB = useMemo(() => buildPlanetPositions(profileB), [profileB]);

  const chemistryMatrix = useMemo<PlanetaryMatrix | null>(() => {
    const hasVenus = positionsA.some(p => p.planet === 'Venus') && positionsB.some(p => p.planet === 'Venus');
    const hasMars = positionsA.some(p => p.planet === 'Mars') && positionsB.some(p => p.planet === 'Mars');
    if (!hasVenus && !hasMars) return null;
    return buildChemistryMatrix(positionsA, positionsB);
  }, [positionsA, positionsB]);

  const communicationMatrix = useMemo<PlanetaryMatrix | null>(() => {
    const has = positionsA.some(p => p.planet === 'Mercury') && positionsB.some(p => p.planet === 'Mercury');
    if (!has) return null;
    return buildCommunicationMatrix(positionsA, positionsB);
  }, [positionsA, positionsB]);

  const growthMatrix = useMemo<PlanetaryMatrix | null>(() => {
    const hasJ = positionsA.some(p => p.planet === 'Jupiter') && positionsB.some(p => p.planet === 'Jupiter');
    const hasS = positionsA.some(p => p.planet === 'Saturn') && positionsB.some(p => p.planet === 'Saturn');
    if (!hasJ && !hasS) return null;
    return buildGrowthMatrix(positionsA, positionsB);
  }, [positionsA, positionsB]);

  const transformationMatrix = useMemo<PlanetaryMatrix | null>(() => {
    const outer = ['Uranus', 'Neptune', 'Pluto'] as Planet[];
    const hasAny = outer.some(pl =>
      positionsA.some(p => p.planet === pl) && positionsB.some(p => p.planet === pl)
    );
    if (!hasAny) return null;
    return buildTransformationMatrix(positionsA, positionsB);
  }, [positionsA, positionsB]);

  // ── Final Weighted Score ───────────────────────────────────────────────
  const finalScore = useMemo<FinalCompatibilityScore>(() =>
    computeFinalCompatibility(synastryMatrix, chemistryMatrix, communicationMatrix, growthMatrix, transformationMatrix),
    [synastryMatrix, chemistryMatrix, communicationMatrix, growthMatrix, transformationMatrix],
  );

  // ── AllMatrices bundle (for synastry preview / PDF report) ─────────────
  const allMatrices = useMemo<AllMatrices>(() => ({
    coreBond: synastryMatrix,
    chemistry: chemistryMatrix,
    communication: communicationMatrix,
    growth: growthMatrix,
    transformation: transformationMatrix,
  }), [synastryMatrix, chemistryMatrix, communicationMatrix, growthMatrix, transformationMatrix]);

  // How many planetary matrices are available (beyond Core Bond)?
  const planetaryMatrixCount = [chemistryMatrix, communicationMatrix, growthMatrix, transformationMatrix].filter(Boolean).length;

  // ── Highlight callback for PlanetaryMatrixGrid cross-referencing ───────
  const handleHighlight = useCallback((pA: string | null, pB: string | null) => {
    setHighlightA(pA);
    setHighlightB(pB);
  }, []);

  // ── Print handler ──────────────────────────────────────────────────────
  const handlePrint = useCallback(() => {
    setShowPdfReport(true);
    setTimeout(() => {
      if (pdfRef.current) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write('<html><head><title>Synastry Report</title>');
          printWindow.document.write('<link rel="stylesheet" href="/src/components/zodiac/SynastryPdfReport.css">');
          printWindow.document.write('</head><body>');
          printWindow.document.write(pdfRef.current.innerHTML);
          printWindow.document.write('</body></html>');
          printWindow.document.close();
          printWindow.print();
        }
      }
    }, 200);
  }, []);

  if (!profileA.sunSign || !profileB.sunSign) {
    return (
      <div className="compat-panel empty">
        <p>Both profiles need at least a Sun sign for compatibility analysis.</p>
      </div>
    );
  }

  const fromProfile = viewDirection === 'A→B' ? profileA : profileB;
  const toProfile = viewDirection === 'A→B' ? profileB : profileA;

  return (
    <div className="compat-panel">
      {/* Close button - top right */}
      {onClose && (
        <button type="button" className="compat-close-btn" onClick={onClose}>×</button>
      )}

      {/* Header */}
      <div className="compat-header">
        <div className="compat-title">
          <span className="panel-icon">💫</span>
          <div>
            <h2>Compatibility Analysis</h2>
            <p className="panel-subtitle">{profileA.name} & {profileB.name}</p>
          </div>
        </div>
      </div>

      {/* Compare Profiles Button */}
      <button
        type="button"
        className="compare-profiles-btn"
        onClick={() => setShowComparisonModal(true)}
      >
        <span>📊</span>
        <span>Compare Profiles</span>
      </button>

      {/* View Mode Toggle */}
      <div className="view-mode-toggle">
        <button
          type="button"
          className={`mode-btn ${viewMode === 'matrix' ? 'active' : ''}`}
          onClick={() => setViewMode('matrix')}
        >
          <span className="mode-icon">🔢</span>
          <span className="mode-label">9-Way Matrix</span>
        </button>
        <button
          type="button"
          className={`mode-btn ${viewMode === 'layer' ? 'active' : ''}`}
          onClick={() => setViewMode('layer')}
        >
          <span className="mode-icon">📊</span>
          <span className="mode-label">Layer View</span>
        </button>
      </div>

      {/* Relationship Type Buttons */}
      <div className="rel-type-tabs">
        {REL_TYPES.map((rt) => (
          <button
            key={rt}
            type="button"
            className={`rel-type-btn ${activeRelType === rt ? 'active' : ''}`}
            onClick={() => setActiveRelType(rt)}
          >
            <span className="rel-icon">{REL_TYPE_ICONS[rt]}</span>
            <span className="rel-label">{REL_TYPE_LABELS[rt]}</span>
          </button>
        ))}
      </div>

      {/* MATRIX VIEW */}
      {viewMode === 'matrix' && (
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

          {/* Matrix 1: Core Bond (existing 9-way grid) */}
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
            <button type="button" className="print-report-btn" onClick={handlePrint}>
              <span>🖨️</span>
              <span>Print Synastry Report</span>
            </button>
          )}
        </>
      )}

      {/* LAYER VIEW - Same-lens comparisons */}
      {viewMode === 'layer' && (
        <>
          {/* Overall Scores */}
          {fullReport && (
            <div className="overall-scores">
              <ScoreBar
                score={fullReport.overallEffort}
                label="Effort Required"
                color="linear-gradient(90deg, #4ade80, #fbbf24, #ef4444)"
              />
              <ScoreBar
                score={fullReport.overallGrowth}
                label="Growth Potential"
                color="linear-gradient(90deg, #60a5fa, #a855f7)"
              />
              <p className="overall-summary">{fullReport.summary}</p>
            </div>
          )}

          {/* Lens Tabs */}
      <div className="lens-tabs">
        {(['Sun', 'Moon', 'Rising'] as Lens[]).map((lens) => {
          const sA = getSignForLens(profileA, lens);
          const sB = getSignForLens(profileB, lens);
          const available = sA && sB;

          return (
            <button
              key={lens}
              className={`lens-tab ${activeLens === lens ? 'active' : ''} ${!available ? 'disabled' : ''}`}
              onClick={() => available && setActiveLens(lens)}
              disabled={!available}
            >
              <span className="lens-icon">{LENS_ICONS[lens]}</span>
              <span className="lens-label">{lens}</span>
            </button>
          );
        })}
      </div>

      {/* Direction Toggle */}
      <div className="direction-toggle">
        <button
          className={`dir-btn ${viewDirection === 'A→B' ? 'active' : ''}`}
          onClick={() => setViewDirection('A→B')}
        >
          {profileA.name} → {profileB.name}
        </button>
        <button
          className={`dir-btn ${viewDirection === 'B→A' ? 'active' : ''}`}
          onClick={() => setViewDirection('B→A')}
        >
          {profileB.name} → {profileA.name}
        </button>
      </div>

      {/* Perspective Content */}
      {report && (
        <div className="perspective-content">
          {/* Current Comparison */}
          <div className="comparison-header">
            <div className="compare-sign">
              <span className="compare-label">From</span>
              <span className="compare-name">{report.from}</span>
              <span className="compare-profile">({fromProfile.name})</span>
            </div>
            <div className="compare-arrow">→</div>
            <div className="compare-sign">
              <span className="compare-label">To</span>
              <span className="compare-name">{report.to}</span>
              <span className="compare-profile">({toProfile.name})</span>
            </div>
          </div>

          {/* Angle Badge */}
          <div className="angle-badge">
            <span className="angle-name">{report.angle}</span>
            <span className="angle-degrees">{report.angleDegrees}°</span>
          </div>

          {/* Scores */}
          <div className="report-scores">
            <ScoreBar
              score={report.effortScore}
              label="Effort"
              color={report.effortScore <= 4 ? '#4ade80' : report.effortScore <= 6 ? '#fbbf24' : '#ef4444'}
            />
            <ScoreBar
              score={report.growthPotential}
              label="Growth"
              color="#a855f7"
            />
          </div>

          {/* Baseline Dynamics */}
          <div className="dynamics-section">
            <h4>⚡ Baseline Dynamics</h4>
            <div className="dynamic-item">
              <span className="dynamic-label">Element:</span>
              <span className="dynamic-text">{report.baseline.elementDynamic}</span>
            </div>
            <div className="dynamic-item">
              <span className="dynamic-label">Modality:</span>
              <span className="dynamic-text">{report.baseline.modalityDynamic}</span>
            </div>
            <div className="dynamic-item">
              <span className="dynamic-label">Season:</span>
              <span className="dynamic-text">{report.baseline.seasonalDynamic}</span>
            </div>
          </div>

          {/* Narrative */}
          <div className="narrative-section">
            <h4>👁️ How {report.from} Sees {report.to}</h4>
            <p>{report.narrative.howFromPerceivesTo}</p>
          </div>

          <div className="narrative-section">
            <h4>🎯 What {report.from} Needs</h4>
            <p>{report.narrative.whatFromNeedsFromTo}</p>
          </div>

          {/* Friction Points */}
          {report.narrative.frictionPoints.length > 0 && (
            <div className="friction-section">
              <h4>⚠️ Friction Points</h4>
              <ul>
                {report.narrative.frictionPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Growth Advice */}
          <div className="growth-section">
            <h4>🌱 Growth Advice</h4>
            <ul>
              {report.narrative.growthAdvice.map((advice, i) => (
                <li key={i}>{advice}</li>
              ))}
            </ul>
          </div>

          {/* Bridge Opportunities */}
          {report.narrative.bridgeOpportunities.length > 0 && (
            <div className="bridge-section">
              <h4>🌉 Bridge Opportunities</h4>
              <ul>
                {report.narrative.bridgeOpportunities.map((opp, i) => (
                  <li key={i}>{opp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
        </>
      )}

      {/* In-Depth Guidance - Susan Miller-style actionable advice */}
      {profileA.sunSign && profileB.sunSign && (
        <InDepthGuidance
          signA={profileA.sunSign as any}
          signB={profileB.sunSign as any}
          moonA={profileA.moonSign as any}
          moonB={profileB.moonSign as any}
          risingA={profileA.risingSign as any}
          risingB={profileB.risingSign as any}
          nameA={profileA.name}
          nameB={profileB.name}
          context={activeContext}
        />
      )}

      {/* Profile Comparison Modal */}
      <ProfileComparisonModal
        profileA={{
          name: profileA.name,
          birthDate: profileA.birthDate || null,
          sunSign: profileA.sunSign,
          moonSign: profileA.moonSign,
          risingSign: profileA.risingSign,
        }}
        profileB={{
          name: profileB.name,
          birthDate: profileB.birthDate || null,
          sunSign: profileB.sunSign,
          moonSign: profileB.moonSign,
          risingSign: profileB.risingSign,
        }}
        isOpen={showComparisonModal}
        onClose={() => setShowComparisonModal(false)}
      />

      {/* Hidden PDF Report (rendered off-screen for print) */}
      {showPdfReport && finalScore.finalPercent != null && (
        <div ref={pdfRef} style={{ position: 'absolute', left: '-9999px', top: 0 }}>
          <SynastryPdfReport
            personAName={profileA.name}
            personBName={profileB.name}
            scores={finalScore}
            matrices={allMatrices}
          />
        </div>
      )}

      <style>{`
        .compat-panel {
          position: relative;
          background: rgba(15, 23, 42, 0.95);
          border-radius: 16px;
          padding: 20px;
          color: #e5e7eb;
          max-height: 80vh;
          overflow-y: auto;
        }

        .compat-panel.empty {
          padding: 40px;
          text-align: center;
          color: #9ca3af;
        }

        .compat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .compat-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .compat-title .panel-icon {
          font-size: 28px;
        }

        .compat-title h2 {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          color: #a855f7;
        }

        .panel-subtitle {
          font-size: 14px;
          color: #9ca3af;
          margin: 2px 0 0 0;
        }

        .compat-close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #9ca3af;
          font-size: 18px;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 1;
        }

        .compat-close-btn:hover {
          background: rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        /* Compare Profiles Button */
        .compare-profiles-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 10px 16px;
          margin-bottom: 12px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #60a5fa;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .compare-profiles-btn:hover {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.5);
        }

        /* View Mode Toggle */
        .view-mode-toggle {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .mode-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          color: #9ca3af;
        }

        .mode-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .mode-btn.active {
          background: rgba(59, 130, 246, 0.15);
          border-color: rgba(59, 130, 246, 0.5);
          color: #60a5fa;
        }

        .mode-icon {
          font-size: 18px;
        }

        /* Relationship Type Tabs */
        .rel-type-tabs {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
        }

        .rel-type-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 8px 4px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          color: #9ca3af;
        }

        .rel-type-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .rel-type-btn.active {
          background: rgba(168, 85, 247, 0.15);
          border-color: rgba(168, 85, 247, 0.5);
          color: #c4b5fd;
        }

        .rel-icon {
          font-size: 16px;
        }

        .rel-label {
          font-size: 10px;
          font-weight: 600;
        }

        .mode-label {
          font-size: 13px;
          font-weight: 600;
        }

        /* Overall Scores */
        .overall-scores {
          background: rgba(168, 85, 247, 0.1);
          border: 1px solid rgba(168, 85, 247, 0.2);
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 16px;
        }

        .overall-summary {
          font-size: 13px;
          color: #c4b5fd;
          margin: 12px 0 0 0;
          font-style: italic;
        }

        /* Score Bar */
        .score-bar-container {
          margin-bottom: 10px;
        }

        .score-bar-container:last-of-type {
          margin-bottom: 0;
        }

        .score-bar-label {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #9ca3af;
          margin-bottom: 4px;
        }

        .score-value {
          font-weight: 600;
          color: #e5e7eb;
        }

        .score-bar-track {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .score-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        /* Context Tabs */
        .context-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .context-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .context-tab:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .context-tab.active {
          background: rgba(168, 85, 247, 0.15);
          border-color: rgba(168, 85, 247, 0.5);
        }

        .ctx-icon {
          font-size: 16px;
        }

        .ctx-label {
          font-size: 12px;
          font-weight: 500;
        }

        /* Lens Tabs */
        .lens-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .lens-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 10px 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .lens-tab:hover:not(.disabled) {
          background: rgba(255, 255, 255, 0.1);
        }

        .lens-tab.active {
          background: rgba(251, 191, 36, 0.15);
          border-color: rgba(251, 191, 36, 0.5);
        }

        .lens-tab.disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .lens-icon {
          font-size: 18px;
        }

        .lens-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: #9ca3af;
        }

        .lens-tab.active .lens-label {
          color: #fbbf24;
        }

        /* Direction Toggle */
        .direction-toggle {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .dir-btn {
          flex: 1;
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid transparent;
          border-radius: 8px;
          color: #9ca3af;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .dir-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .dir-btn.active {
          background: rgba(96, 165, 250, 0.15);
          border-color: rgba(96, 165, 250, 0.5);
          color: #60a5fa;
        }

        /* Comparison Header */
        .comparison-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 16px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
        }

        .compare-sign {
          text-align: center;
        }

        .compare-label {
          display: block;
          font-size: 10px;
          color: #6b7280;
          text-transform: uppercase;
        }

        .compare-name {
          display: block;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
        }

        .compare-profile {
          display: block;
          font-size: 11px;
          color: #9ca3af;
        }

        .compare-arrow {
          font-size: 24px;
          color: #60a5fa;
        }

        /* Angle Badge */
        .angle-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(251, 191, 36, 0.15);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 20px;
          margin-bottom: 16px;
        }

        .angle-name {
          font-size: 13px;
          font-weight: 600;
          color: #fbbf24;
          text-transform: capitalize;
        }

        .angle-degrees {
          font-size: 12px;
          color: #fde68a;
        }

        /* Report Scores */
        .report-scores {
          margin-bottom: 16px;
        }

        /* Sections */
        .dynamics-section,
        .narrative-section,
        .friction-section,
        .growth-section,
        .bridge-section {
          margin-bottom: 16px;
        }

        .dynamics-section h4,
        .narrative-section h4,
        .friction-section h4,
        .growth-section h4,
        .bridge-section h4 {
          font-size: 12px;
          font-weight: 600;
          margin: 0 0 10px 0;
        }

        .dynamics-section h4 { color: #60a5fa; }
        .narrative-section h4 { color: #a78bfa; }
        .friction-section h4 { color: #f87171; }
        .growth-section h4 { color: #4ade80; }
        .bridge-section h4 { color: #fbbf24; }

        .dynamic-item {
          margin-bottom: 8px;
          font-size: 13px;
        }

        .dynamic-label {
          font-weight: 600;
          color: #9ca3af;
          margin-right: 8px;
        }

        .dynamic-text {
          color: #e5e7eb;
        }

        .narrative-section p,
        .friction-section ul,
        .growth-section ul,
        .bridge-section ul {
          font-size: 13px;
          line-height: 1.6;
          color: #d1d5db;
          margin: 0;
        }

        .friction-section ul,
        .growth-section ul,
        .bridge-section ul {
          padding-left: 20px;
        }

        .friction-section li,
        .growth-section li,
        .bridge-section li {
          margin-bottom: 6px;
        }

        .friction-section {
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid rgba(248, 113, 113, 0.2);
          border-radius: 12px;
          padding: 14px;
        }

        .growth-section {
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.2);
          border-radius: 12px;
          padding: 14px;
        }

        .bridge-section {
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.2);
          border-radius: 12px;
          padding: 14px;
        }

        /* ── Final Score Banner ────────────────────────────── */
        .final-score-banner {
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(59, 130, 246, 0.15));
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 14px;
          padding: 16px 20px;
          margin-bottom: 16px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 14px;
        }

        .final-score-value {
          font-size: 36px;
          font-weight: 800;
          background: linear-gradient(135deg, #a78bfa, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .final-score-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .final-score-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #94a3b8;
        }

        .final-score-verdict {
          font-size: 13px;
          color: #cbd5e1;
        }

        .final-score-layers {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          width: 100%;
          margin-top: 4px;
        }

        .final-layer-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          padding: 4px 10px;
          font-size: 11px;
        }

        .final-layer-name {
          color: #94a3b8;
          font-weight: 500;
        }

        .final-layer-score {
          color: #e5e7eb;
          font-weight: 700;
        }

        .final-layer-weight {
          color: #64748b;
          font-size: 10px;
        }

        /* ── Matrix Sections ───────────────────────────────── */
        .matrix-section {
          margin-bottom: 16px;
        }

        .matrix-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #e5e7eb;
          margin: 0 0 8px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .matrix-section-icon {
          font-size: 16px;
        }

        .matrix-section-weight {
          margin-left: auto;
          font-size: 11px;
          font-weight: 500;
          color: #64748b;
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .no-matrix-data {
          text-align: center;
          padding: 24px;
          color: #64748b;
          font-size: 13px;
        }

        /* ── Print Report Button ───────────────────────────── */
        .print-report-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 12px 16px;
          margin-top: 12px;
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.3);
          border-radius: 10px;
          color: #4ade80;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .print-report-btn:hover {
          background: rgba(74, 222, 128, 0.2);
          border-color: rgba(74, 222, 128, 0.5);
        }
      `}</style>
    </div>
  );
};

export default CompatibilityAnalysisPanel;
