/**
 * ElementFlowTimeline.tsx
 *
 * Visual timeline showing how elements move through the year.
 * Each element has an arc—rising, peaking, fading, then resting.
 *
 * Also includes:
 * - SeasonalResonancePanel - The Mirror for personal seasonal reading
 * - HomeChallengeCard - Compact home/challenge season display
 */

import React, { useState } from 'react';
import './ElementFlowTimeline.css';
import {
  SEASON_COLORS,
  SEASONAL_PROFILE,
  getSeasonalMirrorReading,
  getCurrentSeason,
  ELEMENT_FLOWS,
  SEASONAL_IMBALANCE_INSIGHTS,
  type Season,
  type ResonanceState,
  type ElementFlowPhase,
} from '../../data/tropicalConstants';

// =============================================================================
// LOCAL CONSTANTS
// =============================================================================

const SEASONS: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter'];
const ELEMENTS = ['Fire', 'Water', 'Earth', 'Air'] as const;

const PHASE_LABELS: Record<ElementFlowPhase, { label: string; color: string }> = {
  emergence: { label: 'Rising', color: '#4ade80' },
  peak: { label: 'Peak', color: '#fbbf24' },
  transition: { label: 'Fading', color: '#f97316' },
  absence: { label: 'Resting', color: '#64748b' },
};

// =============================================================================
// ELEMENT FLOW TIMELINE
// =============================================================================

interface ElementFlowTimelineProps {
  highlightElement?: string;
  showNarratives?: boolean;
}

export const ElementFlowTimeline: React.FC<ElementFlowTimelineProps> = ({
  highlightElement,
  showNarratives = true,
}) => {
  const [expandedElement, setExpandedElement] = useState<string | null>(null);
  const [showSeasonInsight, setShowSeasonInsight] = useState<Season | null>(null);
  const currentSeason = getCurrentSeason();

  const toggleElement = (element: string) => {
    setExpandedElement(expandedElement === element ? null : element);
  };

  return (
    <div className="element-flow-timeline">
      <div className="flow-header">
        <h4>Elemental Flow Through the Year</h4>
        <p className="flow-subtitle">
          Each element has an arc—rising, peaking, fading, then resting.
          The empty cells in the zodiac table are where elements sleep.
        </p>
      </div>

      {/* Season Headers */}
      <div className="flow-seasons-header">
        <div className="flow-element-label" />
        {SEASONS.map((season) => {
          const seasonInfo = SEASON_COLORS[season];
          const isCurrentSeason = season === currentSeason;
          return (
            <div
              key={season}
              className={`flow-season-header ${isCurrentSeason ? 'current' : ''}`}
              style={{ borderBottomColor: seasonInfo.color }}
              onClick={() => setShowSeasonInsight(showSeasonInsight === season ? null : season)}
            >
              <span className="flow-season-icon">{seasonInfo.icon}</span>
              <span className="flow-season-name" style={{ color: seasonInfo.color }}>
                {season}
              </span>
              {isCurrentSeason && <span className="current-badge">Now</span>}
            </div>
          );
        })}
      </div>

      {/* Season Imbalance Insight (expandable) */}
      {showSeasonInsight && (
        <div
          className="season-imbalance-insight"
          style={{
            borderColor: SEASON_COLORS[showSeasonInsight].color,
            backgroundColor: `${SEASON_COLORS[showSeasonInsight].color}10`,
          }}
        >
          <div className="imbalance-header">
            <span className="imbalance-icon">{SEASONAL_IMBALANCE_INSIGHTS[showSeasonInsight].missingIcon}</span>
            <span className="imbalance-title">
              {showSeasonInsight} lacks {SEASONAL_IMBALANCE_INSIGHTS[showSeasonInsight].missingElement}
            </span>
            <button
              className="close-insight"
              onClick={(e) => { e.stopPropagation(); setShowSeasonInsight(null); }}
            >
              ×
            </button>
          </div>
          <p className="imbalance-effect">{SEASONAL_IMBALANCE_INSIGHTS[showSeasonInsight].psychologicalEffect}</p>
          <p className="imbalance-wisdom">{SEASONAL_IMBALANCE_INSIGHTS[showSeasonInsight].survivalWisdom}</p>
        </div>
      )}

      {/* Element Flow Rows */}
      <div className="flow-rows">
        {ELEMENTS.map((element) => {
          const flow = ELEMENT_FLOWS[element];
          const isExpanded = expandedElement === element;
          const isHighlighted = highlightElement === element;

          return (
            <div
              key={element}
              className={`flow-row ${isExpanded ? 'expanded' : ''} ${isHighlighted ? 'highlighted' : ''}`}
            >
              {/* Element Label */}
              <div
                className="flow-element-label"
                style={{ color: flow.color }}
                onClick={() => toggleElement(element)}
              >
                <span className="element-icon">{flow.icon}</span>
                <span className="element-name">{element}</span>
                <span className="expand-indicator">{isExpanded ? '▼' : '▶'}</span>
              </div>

              {/* Intensity Bars for Each Season */}
              {SEASONS.map((season) => {
                const phase = flow.arc[season];
                const isAbsent = phase.phase === 'absence';
                const phaseInfo = PHASE_LABELS[phase.phase];

                return (
                  <div
                    key={`${element}-${season}`}
                    className={`flow-cell ${isAbsent ? 'absent' : ''}`}
                    title={phase.description}
                  >
                    <div className="intensity-bar-container">
                      <div
                        className="intensity-bar"
                        style={{
                          width: `${phase.intensity}%`,
                          backgroundColor: isAbsent ? '#334155' : flow.color,
                          opacity: isAbsent ? 0.3 : 0.7 + (phase.intensity / 400),
                        }}
                      />
                      {!isAbsent && (
                        <span className="intensity-sign">{phase.sign}</span>
                      )}
                    </div>
                    <span
                      className="phase-label"
                      style={{ color: phaseInfo.color }}
                    >
                      {phaseInfo.label}
                    </span>
                    {isAbsent && (
                      <span className="absent-indicator">—</span>
                    )}
                  </div>
                );
              })}

              {/* Expanded Narrative */}
              {isExpanded && showNarratives && (
                <div className="flow-narrative" style={{ borderColor: flow.color }}>
                  <div className="narrative-content">
                    <p className="full-cycle">{flow.fullCycleNarrative}</p>
                    <div className="absence-teaching">
                      <span className="absence-season-badge" style={{ backgroundColor: `${flow.color}20`, color: flow.color }}>
                        {flow.icon} absent in {flow.absenceSeason}
                      </span>
                      <p>{flow.absenceTeaching}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flow-legend">
        <div className="legend-phases">
          {Object.entries(PHASE_LABELS).map(([phase, info]) => (
            <div key={phase} className="legend-phase">
              <span className="phase-dot" style={{ backgroundColor: info.color }} />
              <span className="phase-name">{info.label}</span>
            </div>
          ))}
        </div>
        <p className="legend-insight">
          Click any element row to reveal its complete yearly arc.
          Click any season header to see what's missing.
        </p>
      </div>
    </div>
  );
};

// =============================================================================
// SEASONAL RESONANCE PANEL - The Mirror
// =============================================================================
// "Your rhythm is not a flaw. It's a function."
// =============================================================================

interface SeasonalResonancePanelProps {
  sign: string;
  currentDate?: Date;
}

export const SeasonalResonancePanel: React.FC<SeasonalResonancePanelProps> = ({
  sign,
  currentDate = new Date(),
}) => {
  const reading = getSeasonalMirrorReading(sign, currentDate);

  const resonanceColors: Record<ResonanceState, string> = {
    Aligned: '#4ade80',
    Neutral: '#fbbf24',
    Challenged: '#f97316',
  };

  const resonanceIcons: Record<ResonanceState, string> = {
    Aligned: '🌱',
    Neutral: '🔄',
    Challenged: '❄️',
  };

  return (
    <div className="seasonal-resonance-panel">
      <div className="resonance-header">
        <span className="resonance-icon">{reading.narrative.icon}</span>
        <div className="resonance-titles">
          <h4>Seasonal Resonance</h4>
          <span className="resonance-subtitle">
            {sign} in {reading.currentSeason}
          </span>
        </div>
      </div>

      {/* Status Badge */}
      <div
        className="resonance-badge"
        style={{ backgroundColor: `${resonanceColors[reading.resonance]}20`, borderColor: resonanceColors[reading.resonance] }}
      >
        <span className="badge-icon">{resonanceIcons[reading.resonance]}</span>
        <span className="badge-state" style={{ color: resonanceColors[reading.resonance] }}>
          {reading.resonance}
        </span>
        <span className="badge-title">{reading.narrative.title}</span>
      </div>

      {/* Validation Narrative */}
      <div className="resonance-validation">
        <p>{reading.narrative.validation}</p>
      </div>

      {/* Guidance */}
      <div className="resonance-guidance">
        <div className="guidance-section lean-into">
          <span className="guidance-label">✓ Lean Into</span>
          <ul className="guidance-list">
            {reading.narrative.guidance.leanInto.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="guidance-section release">
          <span className="guidance-label">↓ Release</span>
          <ul className="guidance-list">
            {reading.narrative.guidance.release.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Season Profile */}
      <div className="season-profile">
        <div className="profile-row home">
          <span className="profile-label">🏠 Home Season:</span>
          <span className="profile-value">{SEASONAL_PROFILE[sign]?.home}</span>
        </div>
        <p className="profile-description">{reading.homeSeasonDescription}</p>

        <div className="profile-row challenge">
          <span className="profile-label">⚡ Challenging Season:</span>
          <span className="profile-value">{SEASONAL_PROFILE[sign]?.challenge}</span>
        </div>
        <p className="profile-description">{reading.challengeSeasonDescription}</p>
      </div>

      {/* Wisdom Footer */}
      <div className="resonance-wisdom">
        <em>"Your rhythm is not a flaw. It's a function."</em>
      </div>
    </div>
  );
};

// =============================================================================
// HOME VS CHALLENGE PANEL - For Sign Education
// =============================================================================

interface HomeChallengeCardProps {
  sign: string;
}

export const HomeChallengeCard: React.FC<HomeChallengeCardProps> = ({ sign }) => {
  const profile = SEASONAL_PROFILE[sign];
  if (!profile) return null;

  const seasonIcons: Record<Season, string> = {
    Spring: '🌱',
    Summer: '☀️',
    Autumn: '🍂',
    Winter: '❄️',
  };

  const seasonColors: Record<Season, string> = {
    Spring: '#4ade80',
    Summer: '#fbbf24',
    Autumn: '#f97316',
    Winter: '#94a3b8',
  };

  const homeDescriptions: Record<Season, string> = {
    Spring: 'You lead naturally when growth is visible and effort produces results.',
    Summer: 'You thrive when nurturing is valued and abundance surrounds you.',
    Autumn: 'You excel when partnership matters and depth is honored.',
    Winter: 'You shine when structure is valued and discipline is rewarded.',
  };

  const challengeDescriptions: Record<Season, string> = {
    Spring: 'The rush to action may feel exhausting or pointless.',
    Summer: 'The constant warmth and social demands may feel draining.',
    Autumn: 'The emphasis on depth and partnership may feel overwhelming.',
    Winter: 'The scarcity and coldness may feel isolating.',
  };

  return (
    <div className="home-challenge-card">
      <div className="hc-row home-season" style={{ borderColor: seasonColors[profile.home] }}>
        <div className="hc-header">
          <span className="hc-icon">{seasonIcons[profile.home]}</span>
          <span className="hc-label">Home Season</span>
          <span className="hc-value" style={{ color: seasonColors[profile.home] }}>{profile.home}</span>
        </div>
        <p className="hc-description">{homeDescriptions[profile.home]}</p>
      </div>

      <div className="hc-row challenge-season" style={{ borderColor: seasonColors[profile.challenge] }}>
        <div className="hc-header">
          <span className="hc-icon">{seasonIcons[profile.challenge]}</span>
          <span className="hc-label">Challenging Season</span>
          <span className="hc-value" style={{ color: seasonColors[profile.challenge] }}>{profile.challenge}</span>
        </div>
        <p className="hc-description">{challengeDescriptions[profile.challenge]}</p>
        <p className="hc-support"><em>Support—not self-criticism—is needed during this season.</em></p>
      </div>
    </div>
  );
};

export default ElementFlowTimeline;
