/**
 * LayerView.tsx
 *
 * Layer-by-layer compatibility view (Sun/Moon/Rising lens + direction toggle).
 * Extracted from CompatibilityAnalysisPanel for modularity.
 */

import React, { useState, useMemo } from 'react';
import './LayerView.css';
import { type SignKey } from '../../zodiac/tropicalMap';
import {
  buildPerspective,
  buildFullCompatibilityReport,
  type Lens,
  type Context,
} from '../../zodiac/narrativeEngine';

interface ProfileData {
  id: string;
  name: string;
  birthDate?: string | null;
  sunSign: string | null;
  moonSign: string | null;
  risingSign: string | null;
}

const LENS_ICONS: Record<Lens, string> = {
  Sun: '☉',
  Moon: '☽',
  Rising: '↑',
};

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

function getSignForLens(profile: ProfileData, lens: Lens): SignKey | null {
  switch (lens) {
    case 'Sun': return profile.sunSign as SignKey | null;
    case 'Moon': return profile.moonSign as SignKey | null;
    case 'Rising': return profile.risingSign as SignKey | null;
  }
}

interface LayerViewProps {
  profileA: ProfileData;
  profileB: ProfileData;
  activeContext: Context;
}

export const LayerView: React.FC<LayerViewProps> = ({
  profileA,
  profileB,
  activeContext,
}) => {
  const [activeLens, setActiveLens] = useState<Lens>('Sun');
  const [viewDirection, setViewDirection] = useState<'A→B' | 'B→A'>('A→B');

  const signA = getSignForLens(profileA, activeLens);
  const signB = getSignForLens(profileB, activeLens);

  const report = useMemo(() => {
    if (!signA || !signB) return null;
    const from = viewDirection === 'A→B' ? signA : signB;
    const to = viewDirection === 'A→B' ? signB : signA;
    return buildPerspective(from, to, activeLens, activeContext);
  }, [signA, signB, activeLens, activeContext, viewDirection]);

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

  const fromProfile = viewDirection === 'A→B' ? profileA : profileB;
  const toProfile = viewDirection === 'A→B' ? profileB : profileA;

  return (
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
  );
};
