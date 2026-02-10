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

import './CompatibilityAnalysisPanel.css';
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { type SignKey } from '../../zodiac/tropicalMap';
import {
  buildSynastryMatrix,
  type Context,
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
import {
  type AllMatrices,
} from '../../zodiac/synastryPreview';
import { SynastryPdfReport } from './SynastryPdfReport';
import { ProfileComparisonModal } from './ProfileComparisonModal';
import { InDepthGuidance } from './InDepthGuidance';
import { MatrixView } from './MatrixView';
import { LayerView } from './LayerView';

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

/** Map relationship type to Context for layer-view narrative functions */
const REL_TO_CONTEXT: Record<RelationshipType, Context> = {
  romantic: 'romance',
  bestFriend: 'friendship',
  friend: 'friendship',
  coworker: 'business',
};

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
  const [viewMode, setViewMode] = useState<ViewMode>('matrix');
  const [internalRelType, setInternalRelType] = useState<RelationshipType>('romantic');
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showPdfReport, setShowPdfReport] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  // Use controlled prop if provided, otherwise internal state
  const activeRelType = controlledRelType ?? internalRelType;
  const setActiveRelType = (rt: RelationshipType) => {
    if (onRelationshipTypeChange) onRelationshipTypeChange(rt);
    else setInternalRelType(rt);
  };

  // Derive Context from relationship type for narrative functions
  const activeContext = REL_TO_CONTEXT[activeRelType];

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
        <MatrixView
          finalScore={finalScore}
          synastryMatrix={synastryMatrix}
          chemistryMatrix={chemistryMatrix}
          communicationMatrix={communicationMatrix}
          growthMatrix={growthMatrix}
          transformationMatrix={transformationMatrix}
          profileA={profileA}
          profileB={profileB}
          planetaryMatrixCount={planetaryMatrixCount}
          onPrint={handlePrint}
        />
      )}

      {/* LAYER VIEW - Same-lens comparisons */}
      {viewMode === 'layer' && (
        <LayerView
          profileA={profileA}
          profileB={profileB}
          activeContext={activeContext}
        />
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
    </div>
  );
};

export default CompatibilityAnalysisPanel;
