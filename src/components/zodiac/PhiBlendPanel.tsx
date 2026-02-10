/**
 * PhiBlendPanel - φ-Curve Sun Blend & Cusp-Weighted Compatibility
 *
 * A separate scrollable panel rendered below the Compatibility Analysis panel.
 * Contains:
 *   1. User A Sun Blend ribbon
 *   2. User B Sun Blend ribbon
 *   3. φ-Blend 5×5 Matrix (cusp-aware headers + φ-weighted scores)
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useMemo } from 'react';
import { CuspRibbon } from './CuspRibbon';
import { PhiBlendGrid } from './PhiBlendGrid';
import { PhiChemistryGrid } from './PhiChemistryGrid';
import { SynastryHouseOverlayPanel } from './SynastryHouseOverlayPanel';
import { GrowthTransformationPanel } from './GrowthTransformationPanel';
import { CommunicationPanel } from './CommunicationPanel';
import { SynastryCompositePanel, type ChamberScore } from './SynastryCompositePanel';
import {
  coreScore,
  passionScore,
  communicationScore as computeCommScore,
  growthScore as computeGrowthScore,
  transformationScore as computeTransformScore,
} from '../../zodiac/compatibility/chamberScore';
import { buildCompositeMidpoint, type CompositeChart } from '../../zodiac/compatibility/compositeMidpoint';
import { computeSynastryHouseOverlayPair } from '../../engines/overlays/synastryHouseOverlay';
import type { SynastryHouseOverlayPairResult } from '../../engines/overlays/synastryHouseOverlay';
import { getSunBlendFromDate, type SunBlendResult } from '../../zodiac/cusp/getSunBlendFromDate';
import { getBlendFromLongitude } from '../../zodiac/cusp/getBlendFromLongitude';
import type { SignBlend } from '../../zodiac/cusp/phiCurve';
import type { ZodiacSign } from '../../data/tropicalSeasons';
import type { RelationshipType } from '../../zodiac/narrativeEngine';

// =============================================================================
// TYPES
// =============================================================================

interface ProfileData {
  id: string;
  name: string;
  birthDate?: string | null;
  birthTime?: string | null;
  sunSign: string | null;
  moonSign: string | null;
  risingSign: string | null;
  venusSign?: string | null;
  marsSign?: string | null;
  moonLongitude?: number | null;    // Pre-calculated by Python Swiss Ephemeris (0-360°)
  risingLongitude?: number | null;  // Pre-calculated by Python Swiss Ephemeris (0-360°)
  venusLongitude?: number | null;   // Pre-calculated by Python Swiss Ephemeris (0-360°)
  marsLongitude?: number | null;    // Pre-calculated by Python Swiss Ephemeris (0-360°)
  sunLongitude?: number | null;     // Pre-calculated by Python Swiss Ephemeris (0-360°)
  houseCusps?: Array<{ house: number; longitude: number; sign: string; degree: number }> | null;
  allPlanetLongitudes?: Record<string, number> | null;
}

/** Check if birth time is genuinely known (not null/empty) */
function hasBirthTime(profile: ProfileData): boolean {
  return profile.birthTime != null && profile.birthTime !== '';
}

interface PhiBlendPanelProps {
  profileA: ProfileData;
  profileB: ProfileData;
  relationshipType?: RelationshipType;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const PhiBlendPanel: React.FC<PhiBlendPanelProps> = ({ profileA, profileB, relationshipType }) => {
  // Compute full Sun blend result for profile A (blend + primary + cuspDescription)
  const sunResultA = useMemo<SunBlendResult | null>(() => {
    if (profileA.birthDate) {
      try {
        const date = new Date(profileA.birthDate);
        if (!isNaN(date.getTime())) {
          return getSunBlendFromDate(date);
        }
      } catch { /* fall through */ }
    }
    return null;
  }, [profileA.birthDate]);

  // Compute full Sun blend result for profile B
  const sunResultB = useMemo<SunBlendResult | null>(() => {
    if (profileB.birthDate) {
      try {
        const date = new Date(profileB.birthDate);
        if (!isNaN(date.getTime())) {
          return getSunBlendFromDate(date);
        }
      } catch { /* fall through */ }
    }
    return null;
  }, [profileB.birthDate]);

  // Derive blend arrays (fallback to pure sign if no birth date)
  const sunBlendA: SignBlend[] = sunResultA?.blend
    ?? (profileA.sunSign ? [{ sign: profileA.sunSign as ZodiacSign, weight: 1 }] : []);
  const sunBlendB: SignBlend[] = sunResultB?.blend
    ?? (profileB.sunSign ? [{ sign: profileB.sunSign as ZodiacSign, weight: 1 }] : []);

  const cuspDescA = sunResultA?.cuspDescription;
  const cuspDescB = sunResultB?.cuspDescription;
  const calendarSignA = sunResultA?.primary;
  const calendarSignB = sunResultB?.primary;

  // Moon blend from pre-calculated longitude (only when birth time is known)
  const moonBlendA: SignBlend[] | undefined = useMemo(() => {
    if (profileA.moonLongitude != null && hasBirthTime(profileA)) {
      return getBlendFromLongitude(profileA.moonLongitude);
    }
    return undefined;
  }, [profileA.moonLongitude, profileA.birthTime]);

  const moonBlendB: SignBlend[] | undefined = useMemo(() => {
    if (profileB.moonLongitude != null && hasBirthTime(profileB)) {
      return getBlendFromLongitude(profileB.moonLongitude);
    }
    return undefined;
  }, [profileB.moonLongitude, profileB.birthTime]);

  // Rising blend from pre-calculated longitude (only when birth time is known)
  const risingBlendA: SignBlend[] | undefined = useMemo(() => {
    if (profileA.risingLongitude != null && hasBirthTime(profileA)) {
      return getBlendFromLongitude(profileA.risingLongitude);
    }
    return undefined;
  }, [profileA.risingLongitude, profileA.birthTime]);

  const risingBlendB: SignBlend[] | undefined = useMemo(() => {
    if (profileB.risingLongitude != null && hasBirthTime(profileB)) {
      return getBlendFromLongitude(profileB.risingLongitude);
    }
    return undefined;
  }, [profileB.risingLongitude, profileB.birthTime]);

  // Venus blend from pre-calculated longitude
  const venusBlendA: SignBlend[] | undefined = useMemo(() => {
    if (profileA.venusLongitude != null) {
      return getBlendFromLongitude(profileA.venusLongitude);
    }
    return undefined;
  }, [profileA.venusLongitude]);

  const venusBlendB: SignBlend[] | undefined = useMemo(() => {
    if (profileB.venusLongitude != null) {
      return getBlendFromLongitude(profileB.venusLongitude);
    }
    return undefined;
  }, [profileB.venusLongitude]);

  // Mars blend from pre-calculated longitude
  const marsBlendA: SignBlend[] | undefined = useMemo(() => {
    if (profileA.marsLongitude != null) {
      return getBlendFromLongitude(profileA.marsLongitude);
    }
    return undefined;
  }, [profileA.marsLongitude]);

  const marsBlendB: SignBlend[] | undefined = useMemo(() => {
    if (profileB.marsLongitude != null) {
      return getBlendFromLongitude(profileB.marsLongitude);
    }
    return undefined;
  }, [profileB.marsLongitude]);

  // Mercury blend from allPlanetLongitudes
  const mercuryBlendA: SignBlend[] | undefined = useMemo(() => {
    const lon = profileA.allPlanetLongitudes?.['Mercury'];
    return lon != null ? getBlendFromLongitude(lon) : undefined;
  }, [profileA.allPlanetLongitudes]);

  const mercuryBlendB: SignBlend[] | undefined = useMemo(() => {
    const lon = profileB.allPlanetLongitudes?.['Mercury'];
    return lon != null ? getBlendFromLongitude(lon) : undefined;
  }, [profileB.allPlanetLongitudes]);

  // Jupiter blend from allPlanetLongitudes
  const jupiterBlendA: SignBlend[] | undefined = useMemo(() => {
    const lon = profileA.allPlanetLongitudes?.['Jupiter'];
    return lon != null ? getBlendFromLongitude(lon) : undefined;
  }, [profileA.allPlanetLongitudes]);

  const jupiterBlendB: SignBlend[] | undefined = useMemo(() => {
    const lon = profileB.allPlanetLongitudes?.['Jupiter'];
    return lon != null ? getBlendFromLongitude(lon) : undefined;
  }, [profileB.allPlanetLongitudes]);

  // Saturn blend from allPlanetLongitudes
  const saturnBlendA: SignBlend[] | undefined = useMemo(() => {
    const lon = profileA.allPlanetLongitudes?.['Saturn'];
    return lon != null ? getBlendFromLongitude(lon) : undefined;
  }, [profileA.allPlanetLongitudes]);

  const saturnBlendB: SignBlend[] | undefined = useMemo(() => {
    const lon = profileB.allPlanetLongitudes?.['Saturn'];
    return lon != null ? getBlendFromLongitude(lon) : undefined;
  }, [profileB.allPlanetLongitudes]);

  // Uranus blend from allPlanetLongitudes
  const uranusBlendA: SignBlend[] | undefined = useMemo(() => {
    const lon = profileA.allPlanetLongitudes?.['Uranus'];
    return lon != null ? getBlendFromLongitude(lon) : undefined;
  }, [profileA.allPlanetLongitudes]);

  const uranusBlendB: SignBlend[] | undefined = useMemo(() => {
    const lon = profileB.allPlanetLongitudes?.['Uranus'];
    return lon != null ? getBlendFromLongitude(lon) : undefined;
  }, [profileB.allPlanetLongitudes]);

  // Neptune blend from allPlanetLongitudes
  const neptuneBlendA: SignBlend[] | undefined = useMemo(() => {
    const lon = profileA.allPlanetLongitudes?.['Neptune'];
    return lon != null ? getBlendFromLongitude(lon) : undefined;
  }, [profileA.allPlanetLongitudes]);

  const neptuneBlendB: SignBlend[] | undefined = useMemo(() => {
    const lon = profileB.allPlanetLongitudes?.['Neptune'];
    return lon != null ? getBlendFromLongitude(lon) : undefined;
  }, [profileB.allPlanetLongitudes]);

  // Pluto blend from allPlanetLongitudes
  const plutoBlendA: SignBlend[] | undefined = useMemo(() => {
    const lon = profileA.allPlanetLongitudes?.['Pluto'];
    return lon != null ? getBlendFromLongitude(lon) : undefined;
  }, [profileA.allPlanetLongitudes]);

  const plutoBlendB: SignBlend[] | undefined = useMemo(() => {
    const lon = profileB.allPlanetLongitudes?.['Pluto'];
    return lon != null ? getBlendFromLongitude(lon) : undefined;
  }, [profileB.allPlanetLongitudes]);

  // Check if Venus/Mars data is available for both profiles
  const hasChemistryData =
    (profileA.venusSign || venusBlendA) &&
    (profileB.venusSign || venusBlendB) &&
    (profileA.marsSign || marsBlendA) &&
    (profileB.marsSign || marsBlendB);

  // Check if Communication data is available (Mercury + Mars for both)
  const hasCommunicationData =
    mercuryBlendA && mercuryBlendB &&
    (marsBlendA || profileA.marsSign) &&
    (marsBlendB || profileB.marsSign);

  // Check if Growth & Transformation data is available
  const hasGrowthData = jupiterBlendA && jupiterBlendB && saturnBlendA && saturnBlendB;
  const hasTransformData = uranusBlendA && uranusBlendB && neptuneBlendA && neptuneBlendB && plutoBlendA && plutoBlendB;
  const hasGrowthTransformData = hasGrowthData || hasTransformData;

  // =========================================================================
  // COMPOSITE CHAMBER SCORES (for SynastryCompositePanel)
  // =========================================================================

  const chamberScores = useMemo<ChamberScore[] | null>(() => {
    // Need at minimum sun signs for both profiles
    if (!profileA.sunSign || !profileB.sunSign) return null;

    const fallbackBlend = (sign: string): [{ sign: ZodiacSign; weight: number }] =>
      [{ sign: sign as ZodiacSign, weight: 1 }];

    const chambers: ChamberScore[] = [];

    // Core (Sun/Moon/Rising) — always available
    const sA = sunBlendA.length > 0 ? sunBlendA : fallbackBlend(profileA.sunSign);
    const sB = sunBlendB.length > 0 ? sunBlendB : fallbackBlend(profileB.sunSign);
    const mA = moonBlendA || fallbackBlend(profileA.moonSign || profileA.sunSign);
    const mB = moonBlendB || fallbackBlend(profileB.moonSign || profileB.sunSign);
    const rA = risingBlendA || fallbackBlend(profileA.risingSign || profileA.sunSign);
    const rB = risingBlendB || fallbackBlend(profileB.risingSign || profileB.sunSign);
    const coreVal = coreScore(sA, sB, mA, mB, rA, rB);
    chambers.push({
      key: 'core', label: 'Core Identity', icon: '\u2609',
      score: coreVal, color: '#f97316',
      narrative: 'Sun, Moon, and Rising \u2014 the foundation of who you are together.',
    });

    // Passion (Venus/Mars)
    if (hasChemistryData) {
      const vA = venusBlendA || fallbackBlend(profileA.venusSign || profileA.sunSign!);
      const vB = venusBlendB || fallbackBlend(profileB.venusSign || profileB.sunSign!);
      const maA = marsBlendA || fallbackBlend(profileA.marsSign || profileA.sunSign!);
      const maB = marsBlendB || fallbackBlend(profileB.marsSign || profileB.sunSign!);
      const passionVal = passionScore(vA, vB, maA, maB);
      chambers.push({
        key: 'passion', label: 'Passion & Chemistry', icon: '\u2640',
        score: passionVal, color: '#ec4899',
        narrative: 'Venus and Mars \u2014 desire, attraction, and chemistry.',
      });
    }

    // Communication (Mercury/Mars)
    if (hasCommunicationData) {
      const meA = mercuryBlendA!;
      const meB = mercuryBlendB!;
      const maA = marsBlendA || fallbackBlend(profileA.marsSign || profileA.sunSign!);
      const maB = marsBlendB || fallbackBlend(profileB.marsSign || profileB.sunSign!);
      const commVal = computeCommScore(meA, meB, maA, maB);
      chambers.push({
        key: 'communication', label: 'Communication', icon: '\u263F',
        score: commVal, color: '#f59e0b',
        narrative: 'Mercury and Mars \u2014 how you think, speak, and act together.',
      });
    }

    // Growth (Jupiter/Saturn)
    if (hasGrowthData) {
      const growthVal = computeGrowthScore(jupiterBlendA!, jupiterBlendB!, saturnBlendA!, saturnBlendB!);
      chambers.push({
        key: 'growth', label: 'Growth & Commitment', icon: '\u2643',
        score: growthVal, color: '#14b8a6',
        narrative: 'Jupiter and Saturn \u2014 shared vision, structure, and long-term building.',
      });
    }

    // Transformation (Uranus/Neptune/Pluto)
    if (hasTransformData) {
      const transformVal = computeTransformScore(
        uranusBlendA!, uranusBlendB!, neptuneBlendA!, neptuneBlendB!, plutoBlendA!, plutoBlendB!,
      );
      chambers.push({
        key: 'transformation', label: 'Transformation', icon: '\u2645',
        score: transformVal, color: '#a855f7',
        narrative: 'Uranus, Neptune, and Pluto \u2014 deep cycles of revolution, dreams, and rebirth.',
      });
    }

    return chambers.length >= 2 ? chambers : null;
  }, [
    profileA.sunSign, profileB.sunSign,
    sunBlendA, sunBlendB, moonBlendA, moonBlendB, risingBlendA, risingBlendB,
    venusBlendA, venusBlendB, marsBlendA, marsBlendB,
    mercuryBlendA, mercuryBlendB,
    jupiterBlendA, jupiterBlendB, saturnBlendA, saturnBlendB,
    uranusBlendA, uranusBlendB, neptuneBlendA, neptuneBlendB, plutoBlendA, plutoBlendB,
    hasChemistryData, hasCommunicationData, hasGrowthData, hasTransformData,
  ]);

  // Synastry house overlay — requires house cusps + planet longitudes for both profiles
  const synastryHouseResult = useMemo<SynastryHouseOverlayPairResult | null>(() => {
    if (
      profileA.allPlanetLongitudes && profileA.houseCusps?.length === 12 &&
      profileB.allPlanetLongitudes && profileB.houseCusps?.length === 12
    ) {
      const cuspsA = profileA.houseCusps.map(h => ({ house: h.house, longitude: h.longitude }));
      const cuspsB = profileB.houseCusps.map(h => ({ house: h.house, longitude: h.longitude }));
      return computeSynastryHouseOverlayPair(
        profileA.allPlanetLongitudes,
        cuspsA,
        profileB.allPlanetLongitudes,
        cuspsB,
      );
    }
    return null;
  }, [profileA.allPlanetLongitudes, profileA.houseCusps, profileB.allPlanetLongitudes, profileB.houseCusps]);

  // Composite midpoint chart — requires allPlanetLongitudes for both profiles
  const compositeChart = useMemo<CompositeChart | null>(() => {
    if (profileA.allPlanetLongitudes && profileB.allPlanetLongitudes) {
      return buildCompositeMidpoint(profileA.allPlanetLongitudes, profileB.allPlanetLongitudes);
    }
    return null;
  }, [profileA.allPlanetLongitudes, profileB.allPlanetLongitudes]);

  if (!profileA.sunSign || !profileB.sunSign) return null;

  const signsA = {
    Sun: profileA.sunSign,
    Moon: profileA.moonSign || profileA.sunSign,
    Rising: profileA.risingSign || profileA.sunSign,
  };

  const signsB = {
    Sun: profileB.sunSign,
    Moon: profileB.moonSign || profileB.sunSign,
    Rising: profileB.risingSign || profileB.sunSign,
  };

  return (
    <div className="phi-blend-panel">
      {/* Panel header */}
      <div className="phi-panel-header">
        <span className="phi-panel-icon">φ</span>
        <div>
          <h2>φ-Blend Analysis</h2>
          <p className="phi-panel-subtitle">Golden ratio cusp-weighted compatibility</p>
        </div>
      </div>

      {/* User A Sun Blend */}
      {sunBlendA.length > 0 && (
        <CuspRibbon
          title={`${profileA.name} Sun Blend`}
          blend={sunBlendA}
          cuspDescription={cuspDescA}
          birthDate={profileA.birthDate}
          birthTime={profileA.birthTime}
          calendarSign={calendarSignA}
          compact
        />
      )}

      {/* User B Sun Blend */}
      {sunBlendB.length > 0 && (
        <CuspRibbon
          title={`${profileB.name} Sun Blend`}
          blend={sunBlendB}
          cuspDescription={cuspDescB}
          birthDate={profileB.birthDate}
          birthTime={profileB.birthTime}
          calendarSign={calendarSignB}
          compact
        />
      )}

      {/* φ-Blend Matrix */}
      <PhiBlendGrid
        nameA={profileA.name}
        nameB={profileB.name}
        birthDateA={profileA.birthDate}
        birthDateB={profileB.birthDate}
        signsA={signsA}
        signsB={signsB}
        blendA={sunBlendA}
        blendB={sunBlendB}
        moonBlendA={moonBlendA}
        moonBlendB={moonBlendB}
        risingBlendA={risingBlendA}
        risingBlendB={risingBlendB}
        relationshipType={relationshipType}
      />

      {/* φ-Chemistry & Desire (Venus/Mars) — separate 2×2 grid */}
      {hasChemistryData && (
        <PhiChemistryGrid
          nameA={profileA.name}
          nameB={profileB.name}
          venusSignA={profileA.venusSign || profileA.sunSign!}
          venusSignB={profileB.venusSign || profileB.sunSign!}
          marsSignA={profileA.marsSign || profileA.sunSign!}
          marsSignB={profileB.marsSign || profileB.sunSign!}
          venusBlendA={venusBlendA || [{ sign: (profileA.venusSign || profileA.sunSign!) as ZodiacSign, weight: 1 }]}
          venusBlendB={venusBlendB || [{ sign: (profileB.venusSign || profileB.sunSign!) as ZodiacSign, weight: 1 }]}
          marsBlendA={marsBlendA || [{ sign: (profileA.marsSign || profileA.sunSign!) as ZodiacSign, weight: 1 }]}
          marsBlendB={marsBlendB || [{ sign: (profileB.marsSign || profileB.sunSign!) as ZodiacSign, weight: 1 }]}
        />
      )}

      {/* Communication & Action (Mercury/Mars) — 2×2 grid */}
      {hasCommunicationData && (
        <CommunicationPanel
          nameA={profileA.name}
          nameB={profileB.name}
          mercuryBlendA={mercuryBlendA!}
          mercuryBlendB={mercuryBlendB!}
          marsBlendA={marsBlendA || [{ sign: (profileA.marsSign || profileA.sunSign!) as ZodiacSign, weight: 1 }]}
          marsBlendB={marsBlendB || [{ sign: (profileB.marsSign || profileB.sunSign!) as ZodiacSign, weight: 1 }]}
        />
      )}

      {/* Synastry House Overlays — planets in each other's houses */}
      {synastryHouseResult && (
        <SynastryHouseOverlayPanel
          nameA={profileA.name}
          nameB={profileB.name}
          result={synastryHouseResult}
        />
      )}

      {/* Growth & Transformation — Jupiter/Saturn + Outer Planets */}
      {hasGrowthTransformData && (
        <GrowthTransformationPanel
          nameA={profileA.name}
          nameB={profileB.name}
          jupiterBlendA={jupiterBlendA || [{ sign: (profileA.sunSign!) as ZodiacSign, weight: 1 }]}
          jupiterBlendB={jupiterBlendB || [{ sign: (profileB.sunSign!) as ZodiacSign, weight: 1 }]}
          saturnBlendA={saturnBlendA || [{ sign: (profileA.sunSign!) as ZodiacSign, weight: 1 }]}
          saturnBlendB={saturnBlendB || [{ sign: (profileB.sunSign!) as ZodiacSign, weight: 1 }]}
          uranusBlendA={uranusBlendA || [{ sign: (profileA.sunSign!) as ZodiacSign, weight: 1 }]}
          uranusBlendB={uranusBlendB || [{ sign: (profileB.sunSign!) as ZodiacSign, weight: 1 }]}
          neptuneBlendA={neptuneBlendA || [{ sign: (profileA.sunSign!) as ZodiacSign, weight: 1 }]}
          neptuneBlendB={neptuneBlendB || [{ sign: (profileB.sunSign!) as ZodiacSign, weight: 1 }]}
          plutoBlendA={plutoBlendA || [{ sign: (profileA.sunSign!) as ZodiacSign, weight: 1 }]}
          plutoBlendB={plutoBlendB || [{ sign: (profileB.sunSign!) as ZodiacSign, weight: 1 }]}
        />
      )}

      {/* Synastry Composite — 5-chamber synthesis with radar + mythic path */}
      {chamberScores && (
        <SynastryCompositePanel
          nameA={profileA.name}
          nameB={profileB.name}
          chambers={chamberScores}
          compositeChart={compositeChart}
        />
      )}

      <style>{`
        .phi-blend-panel {
          background: rgba(15, 23, 42, 0.95);
          border-radius: 16px;
          padding: 20px;
          color: #e5e7eb;
          max-height: 70vh;
          overflow-y: auto;
          margin-top: 16px;
        }

        .phi-panel-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .phi-panel-icon {
          font-size: 28px;
          font-weight: 800;
          color: #fbbf24;
          font-style: italic;
          background: rgba(251, 191, 36, 0.15);
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .phi-panel-header h2 {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          color: #fbbf24;
        }

        .phi-panel-subtitle {
          font-size: 13px;
          color: #9ca3af;
          margin: 2px 0 0 0;
        }

        .phi-blend-panel .cusp-ribbon {
          margin-bottom: 12px;
        }
      `}</style>
    </div>
  );
};

export default PhiBlendPanel;
