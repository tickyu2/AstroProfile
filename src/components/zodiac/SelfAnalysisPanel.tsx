/**
 * SelfAnalysisPanel - Susan Miller-style Self Analysis
 *
 * Displays Sun/Moon/Rising analysis for a single profile with:
 * - Core needs and stress signals
 * - Bonding language and conflict style
 * - Lens-specific insights
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState, useMemo } from 'react';
import { SIGN_LESSONS, type SignKey } from '../../zodiac/tropicalMap';
import { SIGN_NEEDS } from '../../zodiac/signNeeds';
import type { Lens } from '../../zodiac/narrativeEngine';
import { ProfileComparisonModal } from './ProfileComparisonModal';
import { CuspRibbon } from './CuspRibbon';
import { getSunBlendFromDate } from '../../zodiac/cusp/getSunBlendFromDate';
import { getBlendFromLongitude } from '../../zodiac/cusp/getBlendFromLongitude';

// =============================================================================
// TYPES
// =============================================================================

interface SelfAnalysisPanelProps {
  name: string;
  birthDate: string | null;
  sunSign: string | null;
  moonSign: string | null;
  risingSign: string | null;
  sunLongitude?: number | null;
  moonLongitude?: number | null;
  risingLongitude?: number | null;
  onClose?: () => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const LENS_ICONS: Record<Lens, string> = {
  Sun: '☉',
  Moon: '☽',
  Rising: '↑',
};

const LENS_DESCRIPTIONS: Record<Lens, string> = {
  Sun: 'Your core identity, ego, and conscious self. How you express your will and purpose.',
  Moon: 'Your emotional landscape, instincts, and inner world. What you need to feel safe.',
  Rising: 'Your social interface, first impression, and approach to life. How others see you.',
};

/**
 * Khan Academy-style "why this matters" for each lens.
 * Short, clear, no jargon — explains what it means in everyday life.
 */
const LENS_KHAN_ACADEMY: Record<Lens, { what: string; why: string; everyday: string }> = {
  Sun: {
    what: 'The Sun represents your fundamental character — the person you are becoming across your lifetime.',
    why: 'It moves about 1° per day, staying in each sign for ~30 days. Your Sun sign reflects the season you were born in and the core energy you radiate.',
    everyday: 'When someone asks "what\'s your sign?" — this is it. It shapes your ambitions, pride, and what makes you feel alive.',
  },
  Moon: {
    what: 'The Moon represents your emotional instincts — the private self that only close people see.',
    why: 'It moves the fastest of any celestial body (~12° per day), changing sign every ~2.5 days. That\'s why two people born days apart can feel very different.',
    everyday: 'It drives what you need to feel safe, how you react under stress, and what kind of comfort you crave.',
  },
  Rising: {
    what: 'The Rising sign (Ascendant) is the zodiac sign that was on the eastern horizon at the exact minute of your birth.',
    why: 'It changes sign every ~2 hours, making it the most time-sensitive point in your chart. Without an accurate birth time, it cannot be calculated.',
    everyday: 'It shapes your first impression, your physical style, and how you instinctively approach new situations and people.',
  },
};

/**
 * Format an ecliptic longitude (0-360°) into sign-relative degrees.
 * e.g., 42.7° → "12° 42'"  (12 degrees and 42 arc-minutes into Taurus)
 */
function formatSignDegree(longitude: number | null | undefined): string | null {
  if (longitude == null) return null;
  const inSign = longitude % 30;
  const deg = Math.floor(inSign);
  const min = Math.round((inSign - deg) * 60);
  return `${deg}° ${min.toString().padStart(2, '0')}'`;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const SelfAnalysisPanel: React.FC<SelfAnalysisPanelProps> = ({
  name,
  birthDate,
  sunSign,
  moonSign,
  risingSign,
  sunLongitude,
  moonLongitude,
  risingLongitude,
  onClose,
}) => {
  const [activeLens, setActiveLens] = useState<Lens>('Sun');
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Get the sign for current lens
  const currentSign = useMemo<SignKey | null>(() => {
    switch (activeLens) {
      case 'Sun': return sunSign as SignKey | null;
      case 'Moon': return moonSign as SignKey | null;
      case 'Rising': return risingSign as SignKey | null;
    }
  }, [activeLens, sunSign, moonSign, risingSign]);

  // Get the longitude for current lens
  const currentLongitude = useMemo(() => {
    switch (activeLens) {
      case 'Sun': return sunLongitude;
      case 'Moon': return moonLongitude;
      case 'Rising': return risingLongitude;
    }
  }, [activeLens, sunLongitude, moonLongitude, risingLongitude]);

  // Get lesson and needs for current sign
  const lesson = currentSign ? SIGN_LESSONS[currentSign] : null;
  const needs = currentSign ? SIGN_NEEDS[currentSign] : null;
  const khanAcademy = LENS_KHAN_ACADEMY[activeLens];

  // Compute cusp blends for Sun/Moon/Rising
  const sunBlendResult = useMemo(() => {
    if (!birthDate) return null;
    try {
      return getSunBlendFromDate(new Date(birthDate));
    } catch { return null; }
  }, [birthDate]);

  const moonBlend = useMemo(() => {
    if (moonLongitude == null) return null;
    return getBlendFromLongitude(moonLongitude);
  }, [moonLongitude]);

  const risingBlend = useMemo(() => {
    if (risingLongitude == null) return null;
    return getBlendFromLongitude(risingLongitude);
  }, [risingLongitude]);

  if (!sunSign && !moonSign && !risingSign) {
    return (
      <div className="self-analysis-panel empty">
        <p>No zodiac data available for this profile.</p>
      </div>
    );
  }

  return (
    <div className="self-analysis-panel">
      {/* Header */}
      <div className="self-panel-header">
        <div className="self-panel-title">
          <span className="panel-icon">🔮</span>
          <div>
            <h2>Self Analysis</h2>
            <p className="panel-subtitle">{name}</p>
          </div>
        </div>
        {onClose && (
          <button className="panel-close" onClick={onClose}>×</button>
        )}
      </div>

      {/* View Profile Details Button */}
      <button
        type="button"
        className="view-profile-btn"
        onClick={() => setShowProfileModal(true)}
      >
        <span>📊</span>
        <span>View Profile Details</span>
      </button>

      {/* Cusp Blending Ribbons */}
      <div className="cusp-ribbons-section">
        {sunBlendResult && sunBlendResult.blend.length > 0 && (
          <CuspRibbon
            title={`${name} Sun Blend`}
            blend={sunBlendResult.blend}
            cuspDescription={sunBlendResult.cuspDescription}
            birthDate={birthDate}
            compact
          />
        )}
        {moonBlend && moonBlend.length > 0 && (
          <CuspRibbon
            title={`${name} Moon Blend`}
            blend={moonBlend}
            compact
          />
        )}
        {risingBlend && risingBlend.length > 0 && (
          <CuspRibbon
            title={`${name} Rising Blend`}
            blend={risingBlend}
            compact
          />
        )}
      </div>

      {/* Lens Tabs */}
      <div className="lens-tabs">
        {(['Sun', 'Moon', 'Rising'] as Lens[]).map((lens) => {
          const sign = lens === 'Sun' ? sunSign : lens === 'Moon' ? moonSign : risingSign;
          const lon = lens === 'Sun' ? sunLongitude : lens === 'Moon' ? moonLongitude : risingLongitude;
          const deg = formatSignDegree(lon);
          return (
            <button
              key={lens}
              className={`lens-tab ${activeLens === lens ? 'active' : ''} ${!sign ? 'disabled' : ''}`}
              onClick={() => sign && setActiveLens(lens)}
              disabled={!sign}
            >
              <span className="lens-icon">{LENS_ICONS[lens]}</span>
              <span className="lens-label">{lens}</span>
              {sign && <span className="lens-sign">{sign}</span>}
              {deg && <span className="lens-degree">{deg}</span>}
            </button>
          );
        })}
      </div>

      {/* Lens Description */}
      <div className="lens-description">
        {LENS_DESCRIPTIONS[activeLens]}
      </div>

      {/* Khan Academy: What / Why / Everyday */}
      <div className="khan-box">
        <div className="khan-row">
          <span className="khan-label">What it is</span>
          <p className="khan-text">{khanAcademy.what}</p>
        </div>
        <div className="khan-row">
          <span className="khan-label">Why it matters</span>
          <p className="khan-text">{khanAcademy.why}</p>
        </div>
        <div className="khan-row">
          <span className="khan-label">In everyday life</span>
          <p className="khan-text">{khanAcademy.everyday}</p>
        </div>
        {currentLongitude != null && (
          <div className="khan-degree-row">
            <span className="khan-degree-icon">{LENS_ICONS[activeLens]}</span>
            <span className="khan-degree-text">
              {currentSign} at {formatSignDegree(currentLongitude)} — absolute position: {currentLongitude.toFixed(2)}° ecliptic
            </span>
          </div>
        )}
      </div>

      {/* Sign Content */}
      {lesson && needs && (
        <div className="self-content">
          {/* Sign Header */}
          <div className="sign-header-row">
            <span className="sign-symbol-large">{lesson.symbol}</span>
            <div className="sign-header-text">
              <h3>{lesson.sign}</h3>
              <p className="sign-mantra">{lesson.shortMantra}</p>
            </div>
          </div>

          {/* Element/Modality/Season */}
          <div className="sign-attributes">
            <span className="attr-chip element" data-element={lesson.element}>
              {lesson.element}
            </span>
            <span className="attr-chip modality">
              {lesson.modality}
            </span>
            <span className="attr-chip season">
              {lesson.season}
            </span>
          </div>

          {/* Academy Box */}
          <div className="academy-insight">
            <h4>✨ Insight</h4>
            <p>{lesson.academyBox.headline}</p>
            <p className="energy-flow">{lesson.academyBox.energyFlow}</p>
          </div>

          {/* Needs Section */}
          <div className="needs-section">
            <h4>🎯 Core Needs</h4>
            <div className="needs-chips">
              {needs.coreNeeds.map((need, i) => (
                <span key={i} className="need-chip">{need}</span>
              ))}
            </div>
          </div>

          {/* Bonding Language */}
          <div className="needs-section">
            <h4>💬 Bonding Language</h4>
            <p className="bonding-text">{needs.bondingLanguage.join(' • ')}</p>
          </div>

          {/* Stress Signals */}
          <div className="needs-section warning">
            <h4>⚠️ Stress Signals</h4>
            <div className="stress-chips">
              {needs.stressSignals.map((signal, i) => (
                <span key={i} className="stress-chip">{signal}</span>
              ))}
            </div>
          </div>

          {/* Conflict Style */}
          <div className="needs-section">
            <h4>⚔️ Conflict Style</h4>
            <p className="conflict-text">{needs.conflictStyle}</p>
          </div>

          {/* Lens-Specific */}
          {activeLens === 'Moon' && (
            <div className="needs-section emotional">
              <h4>🌙 Emotional Needs</h4>
              <div className="needs-chips">
                {needs.emotionalNeeds.map((need, i) => (
                  <span key={i} className="need-chip emotional">{need}</span>
                ))}
              </div>
            </div>
          )}

          {activeLens === 'Rising' && (
            <div className="needs-section social">
              <h4>↑ Social Style</h4>
              <p className="social-text">{needs.socialStyle}</p>
            </div>
          )}

          {/* Takeaway */}
          <div className="takeaway-box">
            <h4>📌 Takeaway</h4>
            <p>{lesson.academyBox.beginnerTakeaway}</p>
          </div>
        </div>
      )}

      {/* Profile Details Modal */}
      <ProfileComparisonModal
        profileA={{
          name,
          birthDate,
          sunSign,
          moonSign,
          risingSign,
        }}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      <style>{`
        .self-analysis-panel {
          background: rgba(15, 23, 42, 0.95);
          border-radius: 16px;
          padding: 20px;
          color: #e5e7eb;
          max-height: 80vh;
          overflow-y: auto;
          overflow-x: hidden;
          contain: paint;
        }

        .self-analysis-panel.empty {
          padding: 40px;
          text-align: center;
          color: #9ca3af;
        }

        .self-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .self-panel-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .self-panel-title .panel-icon {
          font-size: 28px;
        }

        .self-panel-title h2 {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          color: #fbbf24;
        }

        .panel-subtitle {
          font-size: 14px;
          color: #9ca3af;
          margin: 2px 0 0 0;
        }

        .panel-close {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #9ca3af;
          font-size: 20px;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .panel-close:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
        }

        /* View Profile Button */
        .view-profile-btn {
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

        .view-profile-btn:hover {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.5);
        }

        /* Cusp Ribbons Section */
        .cusp-ribbons-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
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
          padding: 12px 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid transparent;
          border-radius: 12px;
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
          font-size: 20px;
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

        .lens-sign {
          font-size: 12px;
          color: #e5e7eb;
        }

        .lens-degree {
          font-size: 10px;
          color: #60a5fa;
          font-weight: 500;
          font-family: monospace;
        }

        .lens-tab.active .lens-degree {
          color: #93c5fd;
        }

        .lens-description {
          font-size: 12px;
          color: #6b7280;
          font-style: italic;
          margin-bottom: 16px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
        }

        /* Khan Academy Box */
        .khan-box {
          background: rgba(59, 130, 246, 0.06);
          border: 1px solid rgba(59, 130, 246, 0.15);
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .khan-row {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .khan-label {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #60a5fa;
        }

        .khan-text {
          font-size: 12px;
          line-height: 1.6;
          color: #d1d5db;
          margin: 0;
        }

        .khan-degree-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 6px;
          margin-top: 2px;
        }

        .khan-degree-icon {
          font-size: 16px;
          color: #fbbf24;
        }

        .khan-degree-text {
          font-size: 11px;
          color: #9ca3af;
          font-family: monospace;
        }

        /* Sign Header */
        .sign-header-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .sign-symbol-large {
          font-size: 48px;
        }

        .sign-header-text h3 {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          color: #fff;
        }

        .sign-mantra {
          font-size: 14px;
          color: #a78bfa;
          margin: 4px 0 0 0;
          font-style: italic;
        }

        /* Attributes */
        .sign-attributes {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .attr-chip {
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }

        .attr-chip.element[data-element="Fire"] {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }
        .attr-chip.element[data-element="Earth"] {
          background: rgba(34, 197, 94, 0.2);
          color: #86efac;
        }
        .attr-chip.element[data-element="Air"] {
          background: rgba(56, 189, 248, 0.2);
          color: #7dd3fc;
        }
        .attr-chip.element[data-element="Water"] {
          background: rgba(139, 92, 246, 0.2);
          color: #c4b5fd;
        }

        .attr-chip.modality {
          background: rgba(251, 191, 36, 0.2);
          color: #fde68a;
        }

        .attr-chip.season {
          background: rgba(255, 255, 255, 0.1);
          color: #d1d5db;
        }

        /* Academy Insight */
        .academy-insight {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 16px;
        }

        .academy-insight h4 {
          font-size: 12px;
          font-weight: 600;
          color: #60a5fa;
          margin: 0 0 8px 0;
        }

        .academy-insight p {
          font-size: 13px;
          line-height: 1.6;
          margin: 0 0 8px 0;
          color: #e5e7eb;
        }

        .academy-insight .energy-flow {
          font-size: 12px;
          color: #9ca3af;
          font-style: italic;
        }

        /* Needs Sections */
        .needs-section {
          margin-bottom: 16px;
        }

        .needs-section h4 {
          font-size: 12px;
          font-weight: 600;
          color: #a78bfa;
          margin: 0 0 8px 0;
        }

        .needs-section.warning h4 {
          color: #f87171;
        }

        .needs-section.emotional h4 {
          color: #8b5cf6;
        }

        .needs-section.social h4 {
          color: #60a5fa;
        }

        .needs-chips, .stress-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .need-chip {
          padding: 4px 10px;
          background: rgba(167, 139, 250, 0.15);
          border: 1px solid rgba(167, 139, 250, 0.3);
          border-radius: 12px;
          font-size: 12px;
          color: #c4b5fd;
        }

        .need-chip.emotional {
          background: rgba(139, 92, 246, 0.15);
          border-color: rgba(139, 92, 246, 0.3);
          color: #a78bfa;
        }

        .stress-chip {
          padding: 4px 10px;
          background: rgba(248, 113, 113, 0.15);
          border: 1px solid rgba(248, 113, 113, 0.3);
          border-radius: 12px;
          font-size: 12px;
          color: #fca5a5;
        }

        .bonding-text, .conflict-text, .social-text {
          font-size: 13px;
          line-height: 1.6;
          color: #d1d5db;
        }

        /* Takeaway */
        .takeaway-box {
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 12px;
          padding: 14px;
          margin-top: 16px;
        }

        .takeaway-box h4 {
          font-size: 12px;
          font-weight: 600;
          color: #fbbf24;
          margin: 0 0 8px 0;
        }

        .takeaway-box p {
          font-size: 13px;
          line-height: 1.6;
          margin: 0;
          color: #fde68a;
        }
      `}</style>
    </div>
  );
};

export default SelfAnalysisPanel;
