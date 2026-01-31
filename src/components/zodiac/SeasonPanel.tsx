/**
 * SeasonPanel.tsx
 *
 * Displays detailed information about a seasonal archetype.
 * Features tabbed navigation for Overview, Modality Flow, and Sign Overlays.
 *
 * Extracted from TropicalSeasonsPage.tsx for better modularity.
 */

import React, { useState } from 'react';
import {
  SIGN_METADATA,
  SIGN_SYMBOLS,
  ELEMENT_COLORS,
  MODALITY_COLORS,
  SeasonalProfile,
} from '../../data/tropicalSeasons';

interface SeasonPanelProps {
  profile: SeasonalProfile;
  onClose: () => void;
}

export const SeasonPanel: React.FC<SeasonPanelProps> = ({ profile, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'flow' | 'signs'>('overview');

  return (
    <div className="seasons-panel season-detail-panel">
      <div className="panel-header">
        <span className="panel-icon">{profile.icon}</span>
        <div className="panel-header-text">
          <h2 className="panel-title">{profile.season}</h2>
          <span className="panel-archetype-title">{profile.archetype.title}</span>
        </div>
        <button className="panel-close" onClick={onClose}>×</button>
      </div>

      {/* Keywords */}
      <div className="panel-keywords">
        {profile.keywords.map((kw, i) => (
          <span key={i} className="keyword-chip">{kw}</span>
        ))}
      </div>

      {/* Tabs */}
      <div className="panel-tabs">
        <button
          className={`panel-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`panel-tab ${activeTab === 'flow' ? 'active' : ''}`}
          onClick={() => setActiveTab('flow')}
        >
          Modality Flow
        </button>
        <button
          className={`panel-tab ${activeTab === 'signs' ? 'active' : ''}`}
          onClick={() => setActiveTab('signs')}
        >
          Sign Overlays
        </button>
      </div>

      <div className="panel-content">
        {activeTab === 'overview' && (
          <>
            {/* Summary */}
            <div className="panel-section">
              <p className="archetype-summary">{profile.archetype.summary}</p>
            </div>

            {/* Core Essence */}
            <div className="panel-section">
              <h4>Core Essence</h4>
              <p className="panel-text">{profile.archetype.themes.core_essence}</p>
            </div>

            {/* Gifts */}
            <div className="panel-section">
              <h4>Gifts</h4>
              <ul className="themed-list gifts">
                {profile.archetype.themes.gifts.map((gift, i) => (
                  <li key={i}>{gift}</li>
                ))}
              </ul>
            </div>

            {/* Challenges */}
            <div className="panel-section">
              <h4>Challenges</h4>
              <ul className="themed-list challenges">
                {profile.archetype.themes.challenges.map((challenge, i) => (
                  <li key={i}>{challenge}</li>
                ))}
              </ul>
            </div>

            {/* Relational Style */}
            <div className="panel-section">
              <h4>Relational Style</h4>
              <p className="panel-text">{profile.archetype.themes.relational_style}</p>
            </div>

            {/* Life Mission */}
            <div className="panel-section mission-section">
              <h4>Life Mission</h4>
              <p className="mission-text">{profile.archetype.themes.life_mission}</p>
            </div>

            {/* Light Curve */}
            <div className="panel-section light-curve-section">
              <h4>Light Curve</h4>
              <p className="light-curve-qual">{profile.light_curve.qualitative}</p>
              <ul className="light-curve-notes">
                {profile.light_curve.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        {activeTab === 'flow' && (
          <div className="modality-flow-tab">
            <p className="flow-intro">
              Each season unfolds through three modalities: Cardinal (initiate), Fixed (stabilize), Mutable (adapt).
            </p>
            <div className="modality-flow-cards">
              {profile.modality_flow.map((entry) => (
                <div key={entry.order} className="modality-flow-card">
                  <div className="flow-card-header">
                    <span className="flow-order">{entry.order}</span>
                    <span className="flow-sign-symbol">{SIGN_SYMBOLS[entry.sign]}</span>
                    <div className="flow-sign-info">
                      <span className="flow-sign-name">{entry.sign}</span>
                      <span className="flow-modality" style={{ color: MODALITY_COLORS[entry.modality] }}>
                        {entry.modality}
                      </span>
                    </div>
                  </div>
                  <div className="flow-card-label">{entry.label}</div>
                  <p className="flow-card-desc">{entry.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'signs' && (
          <div className="sign-overlays-tab">
            <p className="overlays-intro">
              Each sign expresses {profile.season}'s themes through its own lens:
            </p>
            <div className="sign-overlay-cards">
              {profile.sign_overlays.map((overlay) => {
                const meta = SIGN_METADATA.find(m => m.sign === overlay.sign)!;
                return (
                  <div key={overlay.sign} className="sign-overlay-card">
                    <div className="overlay-header">
                      <span className="overlay-symbol" style={{ color: ELEMENT_COLORS[meta.element] }}>
                        {meta.symbol}
                      </span>
                      <span className="overlay-name">{overlay.sign}</span>
                      <span className="overlay-element" style={{ background: ELEMENT_COLORS[meta.element] }}>
                        {meta.element}
                      </span>
                    </div>
                    <p className="overlay-emphasis">{overlay.emphasis}</p>
                  </div>
                );
              })}
            </div>

            {/* Hemisphere Note */}
            <div className="hemisphere-note">
              <h4>Hemisphere Awareness</h4>
              <p>{profile.hemisphere_overrides.south.archetype_adjustment}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeasonPanel;
