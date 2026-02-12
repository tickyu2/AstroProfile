/**
 * Relationship DevTools Overlay
 *
 * Metaphysical debugger showing exact scores and retrograde
 * contributions behind each outcome.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import React from 'react';

// ========================================
// SCORE BAR COMPONENT
// ========================================

function ScoreBar({ label, value, min = -0.5, max = 0.5, color = 'gold' }) {
  const percentage = ((value - min) / (max - min)) * 100;
  const isPositive = value >= 0;

  const colorMap = {
    gold: 'bg-cathedral-gold',
    emerald: 'bg-cathedral-emerald',
    red: 'bg-red-400',
    blue: 'bg-blue-400',
    purple: 'bg-cathedral-purple'
  };

  return (
    <div className="devtools-score-bar">
      <div className="devtools-score-bar__label">{label}</div>
      <div className="devtools-score-bar__track">
        <div
          className={`devtools-score-bar__fill ${colorMap[color]}`}
          style={{
            width: `${Math.abs(percentage - 50)}%`,
            left: isPositive ? '50%' : `${percentage}%`
          }}
        />
        <div className="devtools-score-bar__center" />
      </div>
      <div className={`devtools-score-bar__value ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
        {value >= 0 ? '+' : ''}{(value * 100).toFixed(1)}%
      </div>
    </div>
  );
}

// ========================================
// MAIN DEVTOOLS OVERLAY
// ========================================

function RelationshipDevToolsOverlay({ breakdown, isOpen = true, onClose }) {
  if (!breakdown || !isOpen) return null;

  const outcomeColors = {
    DoNow: 'text-emerald-400',
    GoodWindow: 'text-amber-400',
    Neutral: 'text-slate-400',
    Delay: 'text-orange-400',
    Avoid: 'text-red-400'
  };

  return (
    <aside className="relationship-devtools">
      <div className="relationship-devtools__header">
        <h4>Metaphysical Debugger</h4>
        {onClose && (
          <button onClick={onClose} className="relationship-devtools__close">
            &times;
          </button>
        )}
      </div>

      <div className="relationship-devtools__content">
        {/* Final Outcome */}
        <div className="relationship-devtools__outcome">
          <span className="relationship-devtools__outcome-label">Outcome:</span>
          <span className={`relationship-devtools__outcome-value ${outcomeColors[breakdown.outcome]}`}>
            {breakdown.outcome}
          </span>
        </div>

        {/* Final Score */}
        <div className="relationship-devtools__final-score">
          <div className="relationship-devtools__score-ring">
            <svg viewBox="0 0 100 100" className="relationship-devtools__score-svg">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${breakdown.finalScore * 283} 283`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                className={outcomeColors[breakdown.outcome]}
              />
            </svg>
            <div className="relationship-devtools__score-text">
              {(breakdown.finalScore * 100).toFixed(0)}%
            </div>
          </div>
          <div className="relationship-devtools__score-label">Final Score</div>
        </div>

        {/* Score Breakdown */}
        <div className="relationship-devtools__breakdown">
          <h5>Score Breakdown</h5>

          <div className="relationship-devtools__row">
            <span className="relationship-devtools__label">Base Score</span>
            <span className="relationship-devtools__value">
              {(breakdown.baseScore * 100).toFixed(1)}%
            </span>
          </div>

          <ScoreBar
            label="Retrograde Decision Delta"
            value={breakdown.retroDecisionDelta}
            color={breakdown.retroDecisionDelta >= 0 ? 'emerald' : 'red'}
          />

          <ScoreBar
            label="Retrograde Synastry Delta"
            value={breakdown.retroSynastryDelta}
            color={breakdown.retroSynastryDelta >= 0 ? 'emerald' : 'red'}
          />

          <ScoreBar
            label="Autonomy Boost"
            value={breakdown.autonomyBoost}
            color={breakdown.autonomyBoost >= 0 ? 'purple' : 'red'}
          />
        </div>

        {/* Internal Authority */}
        <div className="relationship-devtools__authority">
          <h5>Internal Authority</h5>
          <div className="relationship-devtools__row">
            <span className="relationship-devtools__label">IAP Score</span>
            <span className="relationship-devtools__value">
              {(breakdown.iap * 100).toFixed(1)}%
            </span>
          </div>
          <div className="relationship-devtools__row">
            <span className="relationship-devtools__label">Tier</span>
            <span className="relationship-devtools__value relationship-devtools__tier">
              {breakdown.iapTier}
            </span>
          </div>
        </div>

        {/* Retrograde Planets */}
        <div className="relationship-devtools__retrogrades">
          <h5>Retrograde Planets ({breakdown.retrogradeCount})</h5>
          {breakdown.retrogradePlanets.length > 0 ? (
            <div className="relationship-devtools__planet-list">
              {breakdown.retrogradePlanets.map(planet => (
                <span key={planet} className="relationship-devtools__planet">
                  {planet} Rx
                </span>
              ))}
            </div>
          ) : (
            <span className="relationship-devtools__none">No retrogrades</span>
          )}
        </div>

        {/* Formula */}
        <div className="relationship-devtools__formula">
          <h5>Calculation</h5>
          <code className="relationship-devtools__code">
            {breakdown.baseScore.toFixed(3)}
            {breakdown.retroDecisionDelta >= 0 ? ' + ' : ' - '}
            {Math.abs(breakdown.retroDecisionDelta).toFixed(3)}
            {breakdown.retroSynastryDelta >= 0 ? ' + ' : ' - '}
            {Math.abs(breakdown.retroSynastryDelta).toFixed(3)}
            {breakdown.autonomyBoost >= 0 ? ' + ' : ' - '}
            {Math.abs(breakdown.autonomyBoost).toFixed(3)}
            {' = '}
            {breakdown.finalScore.toFixed(3)}
          </code>
        </div>
      </div>
    </aside>
  );
}

// ========================================
// COMPACT DEVTOOLS (for inline display)
// ========================================

export function DevToolsCompact({ breakdown }) {
  if (!breakdown) return null;

  return (
    <div className="devtools-compact">
      <span className="devtools-compact__score">
        {(breakdown.finalScore * 100).toFixed(0)}%
      </span>
      <span className="devtools-compact__outcome">
        {breakdown.outcome}
      </span>
      <span className="devtools-compact__retro">
        {breakdown.retrogradeCount} Rx
      </span>
    </div>
  );
}

// ========================================
// DEVTOOLS CSS
// ========================================

export const DevToolsStyles = `
.relationship-devtools {
  background: rgba(5, 5, 16, 0.95);
  border: 1px solid rgba(255, 215, 128, 0.2);
  border-radius: 12px;
  padding: 16px;
  font-family: var(--cathedral-font-mono, monospace);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  max-width: 320px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.relationship-devtools__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 215, 128, 0.1);
}

.relationship-devtools__header h4 {
  margin: 0;
  font-size: 14px;
  color: var(--cathedral-gold, #ffd780);
}

.relationship-devtools__close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.relationship-devtools__close:hover {
  color: white;
}

.relationship-devtools__outcome {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.relationship-devtools__outcome-label {
  color: rgba(255, 255, 255, 0.5);
}

.relationship-devtools__outcome-value {
  font-weight: 600;
  font-size: 16px;
}

.relationship-devtools__final-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.relationship-devtools__score-ring {
  position: relative;
  width: 80px;
  height: 80px;
}

.relationship-devtools__score-svg {
  width: 100%;
  height: 100%;
}

.relationship-devtools__score-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
}

.relationship-devtools__score-label {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.5);
}

.relationship-devtools__breakdown,
.relationship-devtools__authority,
.relationship-devtools__retrogrades,
.relationship-devtools__formula {
  margin-bottom: 16px;
}

.relationship-devtools__breakdown h5,
.relationship-devtools__authority h5,
.relationship-devtools__retrogrades h5,
.relationship-devtools__formula h5 {
  margin: 0 0 8px 0;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.4);
}

.relationship-devtools__row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}

.relationship-devtools__label {
  color: rgba(255, 255, 255, 0.6);
}

.relationship-devtools__value {
  font-weight: 500;
}

.relationship-devtools__tier {
  text-transform: capitalize;
  color: var(--cathedral-purple, #a855f7);
}

.relationship-devtools__planet-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.relationship-devtools__planet {
  background: rgba(255, 215, 128, 0.1);
  border: 1px solid rgba(255, 215, 128, 0.2);
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 11px;
}

.relationship-devtools__none {
  color: rgba(255, 255, 255, 0.3);
  font-style: italic;
}

.relationship-devtools__formula {
  padding-top: 12px;
  border-top: 1px solid rgba(255, 215, 128, 0.1);
}

.relationship-devtools__code {
  display: block;
  background: rgba(0, 0, 0, 0.3);
  padding: 8px;
  border-radius: 4px;
  font-size: 10px;
  word-break: break-all;
}

/* Score Bar */
.devtools-score-bar {
  display: grid;
  grid-template-columns: 1fr 100px 50px;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.devtools-score-bar__label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.devtools-score-bar__track {
  position: relative;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.devtools-score-bar__fill {
  position: absolute;
  top: 0;
  height: 100%;
  border-radius: 3px;
  transition: width 300ms ease;
}

.devtools-score-bar__center {
  position: absolute;
  left: 50%;
  top: -2px;
  bottom: -2px;
  width: 1px;
  background: rgba(255, 255, 255, 0.3);
}

.devtools-score-bar__value {
  font-size: 11px;
  font-weight: 500;
  text-align: right;
}

/* Compact DevTools */
.devtools-compact {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--cathedral-font-mono, monospace);
  font-size: 11px;
  background: rgba(0, 0, 0, 0.4);
  padding: 4px 8px;
  border-radius: 4px;
}

.devtools-compact__score {
  font-weight: 600;
  color: var(--cathedral-gold, #ffd780);
}

.devtools-compact__outcome {
  color: rgba(255, 255, 255, 0.7);
}

.devtools-compact__retro {
  color: rgba(255, 255, 255, 0.4);
}
`;

export default RelationshipDevToolsOverlay;
