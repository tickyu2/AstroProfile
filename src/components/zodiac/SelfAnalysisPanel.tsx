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

// =============================================================================
// TYPES
// =============================================================================

interface SelfAnalysisPanelProps {
  name: string;
  birthDate: string | null;
  sunSign: string | null;
  moonSign: string | null;
  risingSign: string | null;
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

// =============================================================================
// COMPONENT
// =============================================================================

export const SelfAnalysisPanel: React.FC<SelfAnalysisPanelProps> = ({
  name,
  birthDate,
  sunSign,
  moonSign,
  risingSign,
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

  // Get lesson and needs for current sign
  const lesson = currentSign ? SIGN_LESSONS[currentSign] : null;
  const needs = currentSign ? SIGN_NEEDS[currentSign] : null;

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

      {/* Lens Tabs */}
      <div className="lens-tabs">
        {(['Sun', 'Moon', 'Rising'] as Lens[]).map((lens) => {
          const sign = lens === 'Sun' ? sunSign : lens === 'Moon' ? moonSign : risingSign;
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
            </button>
          );
        })}
      </div>

      {/* Lens Description */}
      <div className="lens-description">
        {LENS_DESCRIPTIONS[activeLens]}
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

        .lens-description {
          font-size: 12px;
          color: #6b7280;
          font-style: italic;
          margin-bottom: 16px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
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
