/**
 * ThinkingLevelSelector.jsx
 * UI Component for adjusting Luna's "Brainpower" (Gemini 3 thinkingLevel)
 *
 * Allows users to control how deeply Luna thinks:
 * - Minimal: Fast responses for simple queries
 * - Medium: Balanced (default)
 * - High: Deep reasoning for complex problems
 *
 * Part of GENESIS Phase 4 - Gemini 3 Migration
 * December 19, 2024
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  THINKING_LEVELS,
  THINKING_LEVEL_DESCRIPTIONS,
  DEFAULT_THINKING_LEVEL
} from '../../services/gemini3Service';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function ThinkingLevelSelector({
  value = DEFAULT_THINKING_LEVEL,
  onChange,
  compact = false,
  showDescription = true,
  disabled = false,
  autoMode = false,  // If true, shows "Auto" option that auto-detects complexity
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLevel = THINKING_LEVEL_DESCRIPTIONS[value] || THINKING_LEVEL_DESCRIPTIONS.medium;

  const handleSelect = (level) => {
    onChange?.(level);
    setIsOpen(false);
  };

  // Compact inline version
  if (compact) {
    return (
      <div className={`thinking-level-compact ${className}`}>
        <button
          className="thinking-level-button-compact"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          title={`Luna's Brainpower: ${currentLevel.label}`}
        >
          <span className="icon">{currentLevel.icon}</span>
          <span className="label">{currentLevel.label}</span>
          <span className="chevron">{isOpen ? '▲' : '▼'}</span>
        </button>

        {isOpen && (
          <div className="thinking-level-dropdown-compact" ref={dropdownRef}>
            {autoMode && (
              <button
                className={`dropdown-option ${value === 'auto' ? 'active' : ''}`}
                onClick={() => handleSelect('auto')}
              >
                <span className="icon">🔮</span>
                <span className="label">Auto</span>
              </button>
            )}
            {Object.entries(THINKING_LEVELS).map(([key, level]) => (
              <button
                key={level}
                className={`dropdown-option ${value === level ? 'active' : ''}`}
                onClick={() => handleSelect(level)}
              >
                <span className="icon">{THINKING_LEVEL_DESCRIPTIONS[level].icon}</span>
                <span className="label">{THINKING_LEVEL_DESCRIPTIONS[level].label}</span>
              </button>
            ))}
          </div>
        )}

        <style>{`
          .thinking-level-compact {
            position: relative;
            display: inline-block;
          }

          .thinking-level-button-compact {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .thinking-level-button-compact:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
          }

          .thinking-level-button-compact:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .thinking-level-button-compact .chevron {
            font-size: 8px;
            margin-left: 2px;
          }

          .thinking-level-dropdown-compact {
            position: absolute;
            top: 100%;
            left: 0;
            margin-top: 4px;
            background: #1a1a2e;
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 8px;
            padding: 4px;
            min-width: 120px;
            z-index: 100;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          }

          .dropdown-option {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            padding: 6px 10px;
            background: transparent;
            border: none;
            border-radius: 6px;
            color: rgba(255, 255, 255, 0.8);
            font-size: 12px;
            cursor: pointer;
            text-align: left;
            transition: background 0.2s;
          }

          .dropdown-option:hover {
            background: rgba(255, 255, 255, 0.1);
          }

          .dropdown-option.active {
            background: rgba(100, 108, 255, 0.2);
            color: #818cf8;
          }
        `}</style>
      </div>
    );
  }

  // Full version with descriptions
  return (
    <div className={`thinking-level-selector ${className}`} ref={dropdownRef}>
      <div className="thinking-level-header">
        <label className="thinking-level-label">
          Luna's Brainpower
          <span
            className="info-icon"
            onMouseEnter={() => setShowTooltip('main')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            ?
          </span>
        </label>
        {showTooltip === 'main' && (
          <div className="tooltip">
            Adjust how deeply Luna thinks about your questions.
            Higher levels provide more nuanced responses but take longer.
          </div>
        )}
      </div>

      <div className="thinking-level-options">
        {autoMode && (
          <button
            className={`thinking-option ${value === 'auto' ? 'active' : ''}`}
            onClick={() => handleSelect('auto')}
            disabled={disabled}
          >
            <div className="option-icon">🔮</div>
            <div className="option-content">
              <div className="option-label">Auto</div>
              <div className="option-description">Let Luna decide based on your question</div>
            </div>
          </button>
        )}

        {Object.entries(THINKING_LEVELS).map(([key, level]) => {
          const desc = THINKING_LEVEL_DESCRIPTIONS[level];
          return (
            <button
              key={level}
              className={`thinking-option ${value === level ? 'active' : ''}`}
              onClick={() => handleSelect(level)}
              disabled={disabled}
              onMouseEnter={() => setShowTooltip(level)}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <div className="option-icon">{desc.icon}</div>
              <div className="option-content">
                <div className="option-label">{desc.label}</div>
                {showDescription && (
                  <div className="option-description">{desc.description}</div>
                )}
              </div>
              {value === level && <div className="option-check">✓</div>}
            </button>
          );
        })}
      </div>

      {showDescription && value && THINKING_LEVEL_DESCRIPTIONS[value] && (
        <div className="thinking-level-use-case">
          <strong>Best for:</strong> {THINKING_LEVEL_DESCRIPTIONS[value].useCase}
        </div>
      )}

      <style>{`
        .thinking-level-selector {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 16px;
          font-family: inherit;
        }

        .thinking-level-header {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }

        .thinking-level-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }

        .info-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.6);
          cursor: help;
        }

        .tooltip {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 8px;
          padding: 10px 12px;
          background: #1a1a2e;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          max-width: 250px;
          z-index: 100;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .thinking-level-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .thinking-option {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .thinking-option:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .thinking-option.active {
          background: rgba(100, 108, 255, 0.15);
          border-color: rgba(100, 108, 255, 0.4);
        }

        .thinking-option:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .option-icon {
          font-size: 20px;
          width: 32px;
          text-align: center;
        }

        .option-content {
          flex: 1;
        }

        .option-label {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.95);
        }

        .option-description {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 2px;
        }

        .option-check {
          color: #818cf8;
          font-size: 16px;
          font-weight: bold;
        }

        .thinking-level-use-case {
          margin-top: 12px;
          padding: 10px;
          background: rgba(100, 108, 255, 0.08);
          border-radius: 8px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }

        .thinking-level-use-case strong {
          color: rgba(255, 255, 255, 0.9);
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// THINKING INDICATOR (Shows current thinking state during response)
// ═══════════════════════════════════════════════════════════════════════════

export function ThinkingIndicator({
  level = DEFAULT_THINKING_LEVEL,
  isThinking = false,
  showThinkingContent = false,
  thinkingContent = ''
}) {
  const desc = THINKING_LEVEL_DESCRIPTIONS[level] || THINKING_LEVEL_DESCRIPTIONS.medium;

  if (!isThinking) return null;

  return (
    <div className="thinking-indicator">
      <div className="thinking-header">
        <span className="thinking-icon">{desc.icon}</span>
        <span className="thinking-label">Luna is thinking ({desc.label})...</span>
        <div className="thinking-dots">
          <span>.</span><span>.</span><span>.</span>
        </div>
      </div>

      {showThinkingContent && thinkingContent && (
        <div className="thinking-content">
          <div className="thinking-content-label">Thinking process:</div>
          <div className="thinking-content-text">{thinkingContent}</div>
        </div>
      )}

      <style>{`
        .thinking-indicator {
          padding: 12px 16px;
          background: rgba(100, 108, 255, 0.1);
          border: 1px solid rgba(100, 108, 255, 0.2);
          border-radius: 12px;
          margin-bottom: 12px;
        }

        .thinking-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        .thinking-icon {
          font-size: 18px;
        }

        .thinking-label {
          flex: 1;
        }

        .thinking-dots span {
          animation: dot-pulse 1.4s infinite ease-in-out both;
        }

        .thinking-dots span:nth-child(1) { animation-delay: -0.32s; }
        .thinking-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes dot-pulse {
          0%, 80%, 100% { opacity: 0.3; }
          40% { opacity: 1; }
        }

        .thinking-content {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .thinking-content-label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .thinking-content-text {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
          line-height: 1.5;
          max-height: 100px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default ThinkingLevelSelector;
