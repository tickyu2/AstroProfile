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
  moonLongitude?: number | null;    // Pre-calculated by Python Swiss Ephemeris (0-360°)
  risingLongitude?: number | null;  // Pre-calculated by Python Swiss Ephemeris (0-360°)
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
