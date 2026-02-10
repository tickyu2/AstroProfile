import React, { useState } from 'react';
import './ThinkingStyleDisplay.css';

/**
 * Universal Thinking Style Display Component
 * Works for ANY zodiac sign (Aries, Gemini, Taurus, etc.)
 * Shows complete cognitive, behavioral, and motivational profile
 */
const ThinkingStyleDisplay = ({ sign, zone, thinkingData }) => {
  const [expandedSections, setExpandedSections] = useState({
    cognition: true,
    motivation: false,
    action: false,
    goals: false,
    decisions: false,
    behavior: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="thinking-style-container">
      {/* Header */}
      <div className="thinking-header">
        <h2>{sign} Zone {zone}: {thinkingData.name}</h2>
        <p className="archetype">{thinkingData.archetype}</p>
        <p className="degree-range">
          {thinkingData.degreeRange.start}° - {thinkingData.degreeRange.end}°
        </p>
      </div>

      {/* Section 1: COGNITION */}
      <div className="thinking-section">
        <div 
          className="section-header"
          onClick={() => toggleSection('cognition')}
        >
          <span className="section-icon">🧠</span>
          <h3>Cognitive Processing</h3>
          <span className="toggle-icon">
            {expandedSections.cognition ? '▼' : '▶'}
          </span>
        </div>

        {expandedSections.cognition && (
          <div className="section-content">
            <div className="metrics-grid">
              {Object.entries(thinkingData.cognition).map(([key, value]) => (
                <div key={key} className="metric-card">
                  <div className="metric-label">
                    {formatLabel(key)}
                  </div>
                  <div className="metric-bar">
                    <div 
                      className="metric-fill"
                      style={{ width: `${value}%` }}
                    >
                      <span className="metric-value">{value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section 2: MOTIVATION */}
      <div className="thinking-section">
        <div 
          className="section-header"
          onClick={() => toggleSection('motivation')}
        >
          <span className="section-icon">🎯</span>
          <h3>Motivation Drivers</h3>
          <span className="toggle-icon">
            {expandedSections.motivation ? '▼' : '▶'}
          </span>
        </div>

        {expandedSections.motivation && (
          <div className="section-content">
            <div className="primary-motivation">
              <strong>Primary Drive:</strong> {thinkingData.motivation.primary}
            </div>

            <div className="drivers-list">
              <h4>What Makes Them ACT:</h4>
              {thinkingData.motivation.drivers.map((driver, idx) => (
                <div key={idx} className="driver-item">
                  <div className="driver-header">
                    <span className="driver-name">{driver.factor}</span>
                    <span className="driver-weight">{driver.weight}%</span>
                  </div>
                  <div className="driver-bar">
                    <div 
                      className="driver-fill"
                      style={{ width: `${driver.weight}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section 3: ACTION TIMING */}
      <div className="thinking-section">
        <div 
          className="section-header"
          onClick={() => toggleSection('action')}
        >
          <span className="section-icon">⚡</span>
          <h3>Action Timing</h3>
          <span className="toggle-icon">
            {expandedSections.action ? '▼' : '▶'}
          </span>
        </div>

        {expandedSections.action && (
          <div className="section-content">
            <div className="timing-grid">
              <div className="timing-card">
                <div className="timing-label">Decision Speed</div>
                <div className="timing-value">{thinkingData.actionTiming.decisionSpeed}</div>
              </div>

              <div className="timing-card">
                <div className="timing-label">Impulsivity</div>
                <div className="timing-bar">
                  <div 
                    className="timing-fill impulsive"
                    style={{ width: `${thinkingData.actionTiming.impulsivity}%` }}
                  >
                    {thinkingData.actionTiming.impulsivity}%
                  </div>
                </div>
              </div>

              <div className="timing-card">
                <div className="timing-label">Planning Tendency</div>
                <div className="timing-bar">
                  <div 
                    className="timing-fill planning"
                    style={{ width: `${thinkingData.actionTiming.planningTendency}%` }}
                  >
                    {thinkingData.actionTiming.planningTendency}%
                  </div>
                </div>
              </div>
            </div>

            <div className="timeframe-breakdown">
              <h4>Action Distribution:</h4>
              <div className="timeframe-chart">
                <div className="timeframe-bar">
                  <div 
                    className="timeframe-segment immediate"
                    style={{ width: `${thinkingData.actionTiming.immediateActions}%` }}
                    title="Immediate"
                  >
                    {thinkingData.actionTiming.immediateActions}% Now
                  </div>
                  <div 
                    className="timeframe-segment short"
                    style={{ width: `${thinkingData.actionTiming.shortTermActions}%` }}
                    title="Short-term"
                  >
                    {thinkingData.actionTiming.shortTermActions}% Short
                  </div>
                  <div 
                    className="timeframe-segment medium"
                    style={{ width: `${thinkingData.actionTiming.mediumTermActions}%` }}
                    title="Medium-term"
                  >
                    {thinkingData.actionTiming.mediumTermActions}% Med
                  </div>
                  <div 
                    className="timeframe-segment long"
                    style={{ width: `${thinkingData.actionTiming.longTermActions}%` }}
                    title="Long-term"
                  >
                    {thinkingData.actionTiming.longTermActions}% Long
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 4: GOAL ORIENTATION */}
      <div className="thinking-section">
        <div 
          className="section-header"
          onClick={() => toggleSection('goals')}
        >
          <span className="section-icon">🎯</span>
          <h3>Goal Orientation</h3>
          <span className="toggle-icon">
            {expandedSections.goals ? '▼' : '▶'}
          </span>
        </div>

        {expandedSections.goals && (
          <div className="section-content">
            <div className="goals-grid">
              <div className="goal-card">
                <h4>Short-Term</h4>
                <div className="goal-weight">{thinkingData.goals.shortTerm.weight}%</div>
                <div className="goal-focus">{thinkingData.goals.shortTerm.focus}</div>
              </div>

              <div className="goal-card">
                <h4>Medium-Term</h4>
                <div className="goal-weight">{thinkingData.goals.mediumTerm.weight}%</div>
                <div className="goal-focus">{thinkingData.goals.mediumTerm.focus}</div>
              </div>

              <div className="goal-card">
                <h4>Long-Term</h4>
                <div className="goal-weight">{thinkingData.goals.longTerm.weight}%</div>
                <div className="goal-focus">{thinkingData.goals.longTerm.focus}</div>
              </div>
            </div>

            <div className="goal-pie-chart">
              {/* Simple SVG pie chart */}
              <svg viewBox="0 0 200 200" className="pie">
                <circle 
                  r="90" 
                  cx="100" 
                  cy="100"
                  fill="none"
                  stroke="#FF6B35"
                  strokeWidth="60"
                  strokeDasharray={`${thinkingData.goals.shortTerm.weight * 5.65} 565`}
                  transform="rotate(-90 100 100)"
                />
                <circle 
                  r="90" 
                  cx="100" 
                  cy="100"
                  fill="none"
                  stroke="#FFA500"
                  strokeWidth="60"
                  strokeDasharray={`${thinkingData.goals.mediumTerm.weight * 5.65} 565`}
                  strokeDashoffset={`-${thinkingData.goals.shortTerm.weight * 5.65}`}
                  transform="rotate(-90 100 100)"
                />
                <circle 
                  r="90" 
                  cx="100" 
                  cy="100"
                  fill="none"
                  stroke="#FFD700"
                  strokeWidth="60"
                  strokeDasharray={`${thinkingData.goals.longTerm.weight * 5.65} 565`}
                  strokeDashoffset={`-${(thinkingData.goals.shortTerm.weight + thinkingData.goals.mediumTerm.weight) * 5.65}`}
                  transform="rotate(-90 100 100)"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Section 5: DECISION WEIGHTS */}
      <div className="thinking-section">
        <div 
          className="section-header"
          onClick={() => toggleSection('decisions')}
        >
          <span className="section-icon">⚖️</span>
          <h3>Decision-Making Factors</h3>
          <span className="toggle-icon">
            {expandedSections.decisions ? '▼' : '▶'}
          </span>
        </div>

        {expandedSections.decisions && (
          <div className="section-content">
            <p className="decision-intro">
              When making choices, these factors matter in this order:
            </p>

            <div className="decision-weights">
              {thinkingData.decisionWeights
                .sort((a, b) => b.weight - a.weight)
                .map((factor, idx) => (
                  <div key={idx} className="decision-item">
                    <div className="decision-rank">#{idx + 1}</div>
                    <div className="decision-content">
                      <div className="decision-header">
                        <span className="decision-factor">{factor.factor}</span>
                        <span className="decision-weight">{factor.weight}%</span>
                      </div>
                      <div className="decision-bar">
                        <div 
                          className="decision-fill"
                          style={{ 
                            width: `${factor.weight}%`,
                            backgroundColor: getDecisionColor(idx)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Section 6: BEHAVIOR PATTERNS */}
      <div className="thinking-section">
        <div 
          className="section-header"
          onClick={() => toggleSection('behavior')}
        >
          <span className="section-icon">🎭</span>
          <h3>Behavioral Patterns</h3>
          <span className="toggle-icon">
            {expandedSections.behavior ? '▼' : '▶'}
          </span>
        </div>

        {expandedSections.behavior && (
          <div className="section-content">
            <div className="behavior-grid">
              <div className="behavior-card">
                <div className="behavior-label">In Conflict</div>
                <div className="behavior-response">{thinkingData.behavior.conflict}</div>
              </div>

              <div className="behavior-card">
                <div className="behavior-label">Under Stress</div>
                <div className="behavior-response">{thinkingData.behavior.stress}</div>
              </div>

              <div className="behavior-card">
                <div className="behavior-label">After Success</div>
                <div className="behavior-response">{thinkingData.behavior.success}</div>
              </div>

              <div className="behavior-card">
                <div className="behavior-label">After Failure</div>
                <div className="behavior-response">{thinkingData.behavior.failure}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Motto */}
      <div className="thinking-motto">
        <span className="motto-icon">💭</span>
        <div className="motto-text">"{thinkingData.motto}"</div>
      </div>
    </div>
  );
};

// Helper functions
const formatLabel = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const getDecisionColor = (index) => {
  const colors = [
    '#FF6B35', // Highest priority - red
    '#FFA500', // Orange
    '#FFD700', // Gold
    '#90EE90', // Light green
    '#87CEEB', // Sky blue
    '#DDA0DD'  // Plum - lowest priority
  ];
  return colors[index] || '#CCC';
};

export default ThinkingStyleDisplay;
