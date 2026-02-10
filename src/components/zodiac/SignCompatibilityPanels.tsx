/**
 * SignCompatibilityPanels.tsx
 *
 * Sign-based compatibility panels for the Tropical Zodiac wheel.
 * Contains both legacy and enhanced versions.
 *
 * Extracted from TropicalSeasonsPage.tsx for better modularity.
 */

import './SignCompatibilityPanels.css';
import React, { useState } from 'react';
import {
  ELEMENT_COLORS,
  MODALITY_COLORS,
  SEASON_COLORS,
  CompatibilityResult,
  CompatibilityPayload,
  SignMeta,
} from '../../data/tropicalSeasons';

// =============================================================================
// LEGACY COMPATIBILITY PANEL
// =============================================================================

interface LegacyCompatibilityPanelProps {
  result: CompatibilityResult;
  metaA: SignMeta;
  metaB: SignMeta;
  onClose: () => void;
}

export const LegacyCompatibilityPanel: React.FC<LegacyCompatibilityPanelProps> = ({
  result,
  metaA,
  metaB,
  onClose,
}) => {
  const scoreColor = result.overallScore >= 80 ? '#4ade80' :
    result.overallScore >= 60 ? '#fbbf24' : '#f87171';

  return (
    <div className="seasons-panel compat-panel">
      <div className="panel-header">
        <div className="compat-signs">
          <span className="compat-sign">{metaA.symbol} {metaA.sign}</span>
          <span className="compat-vs">×</span>
          <span className="compat-sign">{metaB.symbol} {metaB.sign}</span>
        </div>
        <button className="panel-close" onClick={onClose}>×</button>
      </div>
      <div className="panel-content">
        <div className="compat-score-section">
          <div className="compat-score" style={{ borderColor: scoreColor }}>
            <span className="score-value" style={{ color: scoreColor }}>
              {result.overallScore}%
            </span>
            <span className="score-label">Chemistry</span>
          </div>
        </div>

        <div className="compat-breakdown">
          <div className="compat-factor">
            <div className="factor-header">
              <span className="factor-label">Element</span>
              <span className="factor-score">{result.elementScore}%</span>
            </div>
            <div className="factor-bar">
              <div
                className="factor-fill element"
                style={{ width: `${result.elementScore}%` }}
              />
            </div>
            <p className="factor-text">{result.elementRelation}</p>
          </div>

          <div className="compat-factor">
            <div className="factor-header">
              <span className="factor-label">Modality</span>
              <span className="factor-score">{result.modalityScore}%</span>
            </div>
            <div className="factor-bar">
              <div
                className="factor-fill modality"
                style={{ width: `${result.modalityScore}%` }}
              />
            </div>
            <p className="factor-text">{result.modalityRelation}</p>
          </div>

          <div className="compat-factor">
            <div className="factor-header">
              <span className="factor-label">Season</span>
              <span className="factor-score">{result.seasonScore}%</span>
            </div>
            <div className="factor-bar">
              <div
                className="factor-fill season"
                style={{ width: `${result.seasonScore}%` }}
              />
            </div>
            <p className="factor-text">{result.seasonRelation}</p>
          </div>
        </div>

        <div className="compat-summary">
          <p>{result.summary}</p>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// ENHANCED COMPATIBILITY PANEL
// =============================================================================

interface EnhancedCompatibilityPanelProps {
  payload: CompatibilityPayload;
  metaA: SignMeta;
  metaB: SignMeta;
  onClose: () => void;
  onSwap: () => void;
}

export const EnhancedCompatibilityPanel: React.FC<EnhancedCompatibilityPanelProps> = ({
  payload,
  metaA,
  metaB,
  onClose,
  onSwap,
}) => {
  const [activeTab, setActiveTab] = useState<'scores' | 'narrative' | 'details'>('scores');

  const getScoreColor = (score: number) =>
    score >= 80 ? '#4ade80' : score >= 60 ? '#fbbf24' : '#f87171';

  const getScoreLabel = (score: number) =>
    score >= 85 ? 'Exceptional' :
    score >= 75 ? 'Strong' :
    score >= 65 ? 'Good' :
    score >= 50 ? 'Moderate' : 'Challenging';

  return (
    <div className="seasons-panel enhanced-compat-panel">
      <div className="panel-header compat-header">
        <div className="compat-signs-enhanced">
          <div className="compat-sign-card" style={{ borderColor: ELEMENT_COLORS[metaA.element] }}>
            <span className="sign-symbol-large">{metaA.symbol}</span>
            <span className="sign-name-small">{metaA.sign}</span>
            <span className="sign-element-tag" style={{ background: ELEMENT_COLORS[metaA.element] }}>
              {metaA.element}
            </span>
          </div>
          <button className="swap-button" onClick={onSwap} title="Swap signs">
            ⇄
          </button>
          <div className="compat-sign-card" style={{ borderColor: ELEMENT_COLORS[metaB.element] }}>
            <span className="sign-symbol-large">{metaB.symbol}</span>
            <span className="sign-name-small">{metaB.sign}</span>
            <span className="sign-element-tag" style={{ background: ELEMENT_COLORS[metaB.element] }}>
              {metaB.element}
            </span>
          </div>
        </div>
        <button className="panel-close" onClick={onClose}>×</button>
      </div>

      {/* Overall Score Circle */}
      <div className="overall-score-section">
        <div className="overall-score-ring" style={{ borderColor: getScoreColor(payload.scores.overall) }}>
          <span className="overall-score-value" style={{ color: getScoreColor(payload.scores.overall) }}>
            {payload.scores.overall}%
          </span>
          <span className="overall-score-label">{getScoreLabel(payload.scores.overall)}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="panel-tabs">
        <button
          className={`panel-tab ${activeTab === 'scores' ? 'active' : ''}`}
          onClick={() => setActiveTab('scores')}
        >
          Scores
        </button>
        <button
          className={`panel-tab ${activeTab === 'narrative' ? 'active' : ''}`}
          onClick={() => setActiveTab('narrative')}
        >
          Narrative
        </button>
        <button
          className={`panel-tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
      </div>

      <div className="panel-content">
        {activeTab === 'scores' && (
          <div className="scores-tab">
            {/* Multi-dimensional scores */}
            <div className="score-dimensions">
              {[
                { key: 'chemistry', label: 'Chemistry', icon: '🔥', color: '#ef4444' },
                { key: 'communication', label: 'Communication', icon: '💬', color: '#3b82f6' },
                { key: 'stability', label: 'Stability', icon: '🏛️', color: '#22c55e' },
                { key: 'growth', label: 'Growth', icon: '🌱', color: '#8b5cf6' },
              ].map(({ key, label, icon, color }) => {
                const score = payload.scores[key as keyof typeof payload.scores];
                return (
                  <div key={key} className="score-dimension">
                    <div className="dimension-header">
                      <span className="dimension-icon">{icon}</span>
                      <span className="dimension-label">{label}</span>
                      <span className="dimension-score" style={{ color: getScoreColor(score) }}>
                        {score}%
                      </span>
                    </div>
                    <div className="dimension-bar">
                      <div
                        className="dimension-fill"
                        style={{ width: `${score}%`, background: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Element/Modality/Season Relations */}
            <div className="relation-cards">
              <div className="relation-card">
                <span className="relation-type">Element</span>
                <span className="relation-value">{payload.element.relation}</span>
                <p className="relation-notes">{payload.element.notes}</p>
              </div>
              <div className="relation-card">
                <span className="relation-type">Modality</span>
                <span className="relation-value">{payload.modality.relation}</span>
                <p className="relation-notes">{payload.modality.notes}</p>
              </div>
              <div className="relation-card">
                <span className="relation-type">Season</span>
                <span className="relation-value">{payload.season.relation}</span>
                <p className="relation-notes">{payload.season.notes}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'narrative' && (
          <div className="narrative-tab">
            {/* Summary */}
            <div className="narrative-summary">
              <p>{payload.narrative.summary}</p>
            </div>

            {/* Strengths */}
            <div className="narrative-section">
              <h4>💪 Strengths</h4>
              <ul className="narrative-list strengths">
                {payload.narrative.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Challenges */}
            <div className="narrative-section">
              <h4>⚡ Challenges</h4>
              <ul className="narrative-list challenges">
                {payload.narrative.challenges.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Advice */}
            <div className="narrative-section">
              <h4>💡 Growth Advice</h4>
              <ul className="narrative-list advice">
                {payload.narrative.advice.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="details-tab">
            {/* Sign A Details */}
            <div className="sign-detail-card">
              <div className="detail-header">
                <span className="detail-symbol">{metaA.symbol}</span>
                <span className="detail-name">{metaA.sign}</span>
              </div>
              <div className="detail-badges">
                <span className="detail-badge" style={{ background: ELEMENT_COLORS[metaA.element] }}>
                  {metaA.element}
                </span>
                <span className="detail-badge" style={{ background: MODALITY_COLORS[metaA.modality] }}>
                  {metaA.modality}
                </span>
                <span className="detail-badge" style={{ background: SEASON_COLORS[metaA.season] }}>
                  {metaA.season}
                </span>
              </div>
              <p className="detail-dates">{metaA.dateRange}</p>
              <p className="detail-ruling">Ruled by {metaA.ruling}</p>
            </div>

            {/* Sign B Details */}
            <div className="sign-detail-card">
              <div className="detail-header">
                <span className="detail-symbol">{metaB.symbol}</span>
                <span className="detail-name">{metaB.sign}</span>
              </div>
              <div className="detail-badges">
                <span className="detail-badge" style={{ background: ELEMENT_COLORS[metaB.element] }}>
                  {metaB.element}
                </span>
                <span className="detail-badge" style={{ background: MODALITY_COLORS[metaB.modality] }}>
                  {metaB.modality}
                </span>
                <span className="detail-badge" style={{ background: SEASON_COLORS[metaB.season] }}>
                  {metaB.season}
                </span>
              </div>
              <p className="detail-dates">{metaB.dateRange}</p>
              <p className="detail-ruling">Ruled by {metaB.ruling}</p>
            </div>

            {/* Solar Phase if available */}
            {payload.solar_phase && (
              <div className="solar-phase-section">
                <h4>☀️ Solar Phase</h4>
                <div className="solar-phases">
                  <span className="solar-phase">{metaA.sign}: {payload.solar_phase.signA_phase}</span>
                  <span className="solar-phase">{metaB.sign}: {payload.solar_phase.signB_phase}</span>
                </div>
                {payload.solar_phase.notes && (
                  <p className="solar-notes">{payload.solar_phase.notes}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  LegacyCompatibilityPanel,
  EnhancedCompatibilityPanel,
};
