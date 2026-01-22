/**
 * Rule Tuner Component
 *
 * Live sliders to adjust rule weights and see how the metaphysics change.
 * Provides real-time feedback on outcome changes.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

// ========================================
// CATEGORY COLORS
// ========================================

const CATEGORY_COLORS = {
  retrograde: 'text-purple-400',
  synastry: 'text-pink-400',
  timing: 'text-blue-400',
  authority: 'text-amber-400',
  composite: 'text-emerald-400'
};

// ========================================
// SINGLE RULE SLIDER
// ========================================

function RuleSlider({ rule, value, onChange, showDetails = true }) {
  const categoryColor = CATEGORY_COLORS[rule.category] || 'text-white';
  const isModified = value !== 1.0;

  return (
    <div className={`rule-tuner__slider ${isModified ? 'rule-tuner__slider--modified' : ''}`}>
      <div className="rule-tuner__slider-header">
        <div className="rule-tuner__slider-info">
          <span className={`rule-tuner__slider-category ${categoryColor}`}>
            {rule.category}
          </span>
          <span className="rule-tuner__slider-name">{rule.name}</span>
        </div>
        <div className="rule-tuner__slider-value">
          {value.toFixed(2)}x
          {isModified && (
            <button
              className="rule-tuner__reset-btn"
              onClick={() => onChange(rule.id, 1.0)}
              title="Reset to default"
            >
              \u{21BA}
            </button>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="rule-tuner__slider-description">
          {rule.description}
        </div>
      )}

      <div className="rule-tuner__slider-track">
        <input
          type="range"
          min={rule.minWeight}
          max={rule.maxWeight}
          step={0.05}
          value={value}
          onChange={(e) => onChange(rule.id, parseFloat(e.target.value))}
          className="rule-tuner__input"
        />
        <div className="rule-tuner__track-marks">
          <span>0</span>
          <span className="rule-tuner__track-default">1.0</span>
          <span>2</span>
        </div>
      </div>
    </div>
  );
}

RuleSlider.propTypes = {
  rule: PropTypes.object.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  showDetails: PropTypes.bool
};

// ========================================
// CATEGORY GROUP
// ========================================

function CategoryGroup({ category, rules, weights, onChange, collapsed, onToggle }) {
  const categoryColor = CATEGORY_COLORS[category] || 'text-white';
  const modifiedCount = rules.filter(r => weights.get(r.id) !== 1.0).length;

  return (
    <div className="rule-tuner__category">
      <button className="rule-tuner__category-header" onClick={onToggle}>
        <span className={`rule-tuner__category-name ${categoryColor}`}>
          {category}
        </span>
        <span className="rule-tuner__category-count">
          {rules.length} rules
          {modifiedCount > 0 && (
            <span className="rule-tuner__category-modified">
              ({modifiedCount} modified)
            </span>
          )}
        </span>
        <span className={`rule-tuner__category-chevron ${collapsed ? '' : 'rule-tuner__category-chevron--open'}`}>
          \u{25BC}
        </span>
      </button>

      {!collapsed && (
        <div className="rule-tuner__category-rules">
          {rules.map(rule => (
            <RuleSlider
              key={rule.id}
              rule={rule}
              value={weights.get(rule.id) ?? 1.0}
              onChange={onChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

CategoryGroup.propTypes = {
  category: PropTypes.string.isRequired,
  rules: PropTypes.array.isRequired,
  weights: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  collapsed: PropTypes.bool,
  onToggle: PropTypes.func.isRequired
};

// ========================================
// OUTCOME PREVIEW
// ========================================

function OutcomePreview({ original, adjusted }) {
  if (!original || !adjusted) return null;

  const scoreChange = adjusted.finalScore - original.finalScore;
  const outcomeChanged = original.outcome !== adjusted.outcome;

  const outcomeColors = {
    DoNow: 'text-emerald-400',
    GoodWindow: 'text-amber-400',
    Neutral: 'text-slate-400',
    Delay: 'text-orange-400',
    Avoid: 'text-red-400'
  };

  return (
    <div className={`rule-tuner__preview ${outcomeChanged ? 'rule-tuner__preview--changed' : ''}`}>
      <h5>Live Preview</h5>

      <div className="rule-tuner__preview-scores">
        <div className="rule-tuner__preview-original">
          <span className="rule-tuner__preview-label">Original</span>
          <span className={`rule-tuner__preview-outcome ${outcomeColors[original.outcome]}`}>
            {original.outcome}
          </span>
          <span className="rule-tuner__preview-score">
            {(original.finalScore * 100).toFixed(1)}%
          </span>
        </div>

        <div className="rule-tuner__preview-arrow">
          {outcomeChanged ? '\u{21D2}' : '\u{2192}'}
        </div>

        <div className="rule-tuner__preview-adjusted">
          <span className="rule-tuner__preview-label">Adjusted</span>
          <span className={`rule-tuner__preview-outcome ${outcomeColors[adjusted.outcome]}`}>
            {adjusted.outcome}
          </span>
          <span className="rule-tuner__preview-score">
            {(adjusted.finalScore * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      <div className={`rule-tuner__preview-delta ${scoreChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
        {scoreChange >= 0 ? '+' : ''}{(scoreChange * 100).toFixed(2)}% change
      </div>
    </div>
  );
}

OutcomePreview.propTypes = {
  original: PropTypes.object,
  adjusted: PropTypes.object
};

// ========================================
// MAIN RULE TUNER
// ========================================

function RuleTuner({
  rules,
  initialWeights,
  originalBreakdown,
  onWeightsChange,
  onRecompute,
  adjustedBreakdown,
  className = ''
}) {
  const [weights, setWeights] = useState(() => {
    const map = new Map();
    for (const rule of rules) {
      map.set(rule.id, initialWeights?.get(rule.id) ?? 1.0);
    }
    return map;
  });

  const [collapsedCategories, setCollapsedCategories] = useState(new Set());

  // Group rules by category
  const groupedRules = useMemo(() => {
    const groups = new Map();
    for (const rule of rules) {
      if (!groups.has(rule.category)) {
        groups.set(rule.category, []);
      }
      groups.get(rule.category).push(rule);
    }
    return groups;
  }, [rules]);

  const handleWeightChange = useCallback((ruleId, value) => {
    setWeights(prev => {
      const next = new Map(prev);
      next.set(ruleId, value);

      // Notify parent
      onWeightsChange?.(next);
      onRecompute?.(next);

      return next;
    });
  }, [onWeightsChange, onRecompute]);

  const handleCategoryToggle = useCallback((category) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  const handleResetAll = useCallback(() => {
    const reset = new Map();
    for (const rule of rules) {
      reset.set(rule.id, 1.0);
    }
    setWeights(reset);
    onWeightsChange?.(reset);
    onRecompute?.(reset);
  }, [rules, onWeightsChange, onRecompute]);

  const modifiedCount = Array.from(weights.values()).filter(w => w !== 1.0).length;

  return (
    <div className={`rule-tuner ${className}`}>
      <div className="rule-tuner__header">
        <h4>Rule Tuner</h4>
        {modifiedCount > 0 && (
          <button className="rule-tuner__reset-all" onClick={handleResetAll}>
            Reset All ({modifiedCount})
          </button>
        )}
      </div>

      {/* Live Preview */}
      <OutcomePreview original={originalBreakdown} adjusted={adjustedBreakdown} />

      {/* Rule Categories */}
      <div className="rule-tuner__categories">
        {Array.from(groupedRules.entries()).map(([category, categoryRules]) => (
          <CategoryGroup
            key={category}
            category={category}
            rules={categoryRules}
            weights={weights}
            onChange={handleWeightChange}
            collapsed={collapsedCategories.has(category)}
            onToggle={() => handleCategoryToggle(category)}
          />
        ))}
      </div>

      {/* Quick Presets */}
      <div className="rule-tuner__presets">
        <h5>Quick Presets</h5>
        <div className="rule-tuner__preset-buttons">
          <button
            className="rule-tuner__preset-btn"
            onClick={() => {
              const map = new Map(weights);
              for (const rule of rules) {
                if (rule.category === 'retrograde') {
                  map.set(rule.id, 1.5);
                }
              }
              setWeights(map);
              onWeightsChange?.(map);
              onRecompute?.(map);
            }}
          >
            Amplify Retrogrades
          </button>
          <button
            className="rule-tuner__preset-btn"
            onClick={() => {
              const map = new Map(weights);
              for (const rule of rules) {
                if (rule.category === 'retrograde') {
                  map.set(rule.id, 0.5);
                }
              }
              setWeights(map);
              onWeightsChange?.(map);
              onRecompute?.(map);
            }}
          >
            Dampen Retrogrades
          </button>
          <button
            className="rule-tuner__preset-btn"
            onClick={() => {
              const map = new Map(weights);
              for (const rule of rules) {
                if (rule.category === 'authority') {
                  map.set(rule.id, 1.5);
                }
              }
              setWeights(map);
              onWeightsChange?.(map);
              onRecompute?.(map);
            }}
          >
            Boost Authority
          </button>
        </div>
      </div>
    </div>
  );
}

RuleTuner.propTypes = {
  rules: PropTypes.array.isRequired,
  initialWeights: PropTypes.object,
  originalBreakdown: PropTypes.object,
  onWeightsChange: PropTypes.func,
  onRecompute: PropTypes.func,
  adjustedBreakdown: PropTypes.object,
  className: PropTypes.string
};

// ========================================
// STYLES
// ========================================

export const RuleTunerStyles = `
.rule-tuner {
  background: rgba(5, 5, 16, 0.9);
  border: 1px solid rgba(255, 215, 128, 0.15);
  border-radius: 12px;
  padding: 20px;
}

.rule-tuner__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 215, 128, 0.1);
}

.rule-tuner__header h4 {
  margin: 0;
  color: var(--cathedral-gold, #ffd780);
}

.rule-tuner__reset-all {
  padding: 6px 12px;
  background: rgba(255, 90, 120, 0.1);
  border: 1px solid rgba(255, 90, 120, 0.3);
  border-radius: 6px;
  color: #f87171;
  font-size: 12px;
  cursor: pointer;
  transition: all 150ms ease;
}

.rule-tuner__reset-all:hover {
  background: rgba(255, 90, 120, 0.2);
}

.rule-tuner__preview {
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  margin-bottom: 20px;
  transition: all 300ms ease;
}

.rule-tuner__preview--changed {
  background: rgba(255, 215, 128, 0.1);
  border: 1px solid rgba(255, 215, 128, 0.2);
}

.rule-tuner__preview h5 {
  margin: 0 0 12px 0;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.4);
}

.rule-tuner__preview-scores {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.rule-tuner__preview-original,
.rule-tuner__preview-adjusted {
  text-align: center;
}

.rule-tuner__preview-label {
  display: block;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 4px;
}

.rule-tuner__preview-outcome {
  display: block;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 2px;
}

.rule-tuner__preview-score {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.rule-tuner__preview-arrow {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.3);
}

.rule-tuner__preview-delta {
  text-align: center;
  margin-top: 12px;
  font-size: 13px;
  font-weight: 600;
}

.rule-tuner__categories {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.rule-tuner__category {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.rule-tuner__category-header {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 150ms ease;
}

.rule-tuner__category-header:hover {
  background: rgba(255, 255, 255, 0.06);
}

.rule-tuner__category-name {
  font-weight: 600;
  text-transform: capitalize;
}

.rule-tuner__category-count {
  flex: 1;
  margin-left: 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

.rule-tuner__category-modified {
  color: var(--cathedral-gold, #ffd780);
  margin-left: 4px;
}

.rule-tuner__category-chevron {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.3);
  transition: transform 200ms ease;
}

.rule-tuner__category-chevron--open {
  transform: rotate(180deg);
}

.rule-tuner__category-rules {
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
}

.rule-tuner__slider {
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
  margin-bottom: 8px;
  transition: all 150ms ease;
}

.rule-tuner__slider--modified {
  background: rgba(255, 215, 128, 0.05);
  border-left: 2px solid var(--cathedral-gold, #ffd780);
}

.rule-tuner__slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.rule-tuner__slider-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rule-tuner__slider-category {
  font-size: 10px;
  text-transform: uppercase;
}

.rule-tuner__slider-name {
  font-size: 13px;
  color: white;
}

.rule-tuner__slider-value {
  font-size: 12px;
  font-weight: 600;
  color: var(--cathedral-gold, #ffd780);
  display: flex;
  align-items: center;
  gap: 6px;
}

.rule-tuner__reset-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  font-size: 14px;
  padding: 0;
}

.rule-tuner__reset-btn:hover {
  color: white;
}

.rule-tuner__slider-description {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 8px;
}

.rule-tuner__slider-track {
  position: relative;
}

.rule-tuner__input {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  appearance: none;
  outline: none;
}

.rule-tuner__input::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--cathedral-gold, #ffd780);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(255, 215, 128, 0.5);
}

.rule-tuner__input::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--cathedral-gold, #ffd780);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 8px rgba(255, 215, 128, 0.5);
}

.rule-tuner__track-marks {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.3);
}

.rule-tuner__track-default {
  color: var(--cathedral-gold, #ffd780);
}

.rule-tuner__presets {
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.rule-tuner__presets h5 {
  margin: 0 0 12px 0;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.4);
}

.rule-tuner__preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.rule-tuner__preset-btn {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  cursor: pointer;
  transition: all 150ms ease;
}

.rule-tuner__preset-btn:hover {
  background: rgba(255, 215, 128, 0.1);
  border-color: rgba(255, 215, 128, 0.3);
  color: var(--cathedral-gold, #ffd780);
}
`;

export default RuleTuner;
