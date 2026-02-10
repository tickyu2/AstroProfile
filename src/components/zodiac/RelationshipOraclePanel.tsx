/**
 * RelationshipOraclePanel - Chamber-aware relationship Q&A
 *
 * Renders:
 *   1. Question input + suggestion chips
 *   2. Oracle answer card (chamber-routed, data-grounded)
 *   3. Answer history (last 3 answers)
 *
 * GENESIS AstroProfile - February 2026
 */

import React, { useState, useCallback, useRef } from 'react';
import { askOracle, ORACLE_SUGGESTIONS, type OracleInput, type OracleAnswer } from '../../zodiac/compatibility/relationshipOracle';

// =============================================================================
// TYPES
// =============================================================================

interface RelationshipOraclePanelProps {
  oracleInput: OracleInput;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const RelationshipOraclePanel: React.FC<RelationshipOraclePanelProps> = ({
  oracleInput,
}) => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState<(OracleAnswer & { question: string })[]>([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAsk = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    setIsRevealing(true);
    // Small delay for reveal animation
    setTimeout(() => {
      const answer = askOracle(trimmed, oracleInput);
      setAnswers(prev => [{ ...answer, question: trimmed }, ...prev].slice(0, 3));
      setQuestion('');
      setIsRevealing(false);
    }, 400);
  }, [oracleInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(question);
  };

  const handleSuggestion = (suggestion: string) => {
    setQuestion(suggestion);
    handleAsk(suggestion);
  };

  return (
    <div className="rop-container">
      {/* Header */}
      <div className="rop-header">
        <h4 className="rop-title">Relationship Oracle</h4>
        <p className="rop-subtitle">Ask a question about your connection</p>
      </div>

      {/* Input */}
      <form className="rop-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="rop-input"
          placeholder="What would you like to know?"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          maxLength={200}
        />
        <button
          type="submit"
          className="rop-ask-btn"
          disabled={!question.trim() || isRevealing}
        >
          {isRevealing ? '\u2728' : 'Ask'}
        </button>
      </form>

      {/* Suggestion chips */}
      {answers.length === 0 && (
        <div className="rop-suggestions">
          {ORACLE_SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              className="rop-chip"
              onClick={() => handleSuggestion(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Reveal animation */}
      {isRevealing && (
        <div className="rop-revealing">
          <span className="rop-revealing-icon">\u2728</span>
          <span>Consulting the chambers...</span>
        </div>
      )}

      {/* Answer cards */}
      {answers.map((ans, i) => (
        <div
          key={i}
          className={`rop-answer-card ${i === 0 ? 'rop-latest' : 'rop-older'}`}
          style={{ borderLeftColor: `${ans.chamberColor}80` }}
        >
          {/* Question echo */}
          <div className="rop-question-echo">&ldquo;{ans.question}&rdquo;</div>

          {/* Chamber badge */}
          <div className="rop-chamber-badge">
            <span className="rop-chamber-icon" style={{ color: ans.chamberColor }}>
              {ans.chamberIcon}
            </span>
            <span className="rop-chamber-label">{ans.chamber}</span>
            <span className="rop-chamber-score" style={{ color: ans.chamberColor }}>
              {ans.score}%
            </span>
          </div>

          {/* Answer */}
          <div className="rop-answer-title" style={{ color: ans.chamberColor }}>
            {ans.title}
          </div>
          <p className="rop-answer-body">{ans.body}</p>

          {/* Guidance */}
          <div className="rop-guidance">
            <span className="rop-guidance-icon">{'\u2727'}</span>
            <span>{ans.guidance}</span>
          </div>
        </div>
      ))}

      {/* Ask another prompt */}
      {answers.length > 0 && !isRevealing && (
        <button
          className="rop-another-btn"
          onClick={() => inputRef.current?.focus()}
        >
          Ask another question
        </button>
      )}

      <style>{`
        .rop-container {
          margin-top: 16px;
          color: #e5e7eb;
        }

        .rop-header {
          margin-bottom: 10px;
        }

        .rop-title {
          font-size: 16px;
          font-weight: 700;
          color: #fbbf24;
          margin: 0;
        }

        .rop-subtitle {
          font-size: 12px;
          color: #9ca3af;
          margin: 4px 0 0 0;
        }

        /* Input form */
        .rop-form {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
        }

        .rop-input {
          flex: 1;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(251, 191, 36, 0.2);
          border-radius: 8px;
          color: #e5e7eb;
          font-size: 13px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }

        .rop-input:focus {
          border-color: rgba(251, 191, 36, 0.5);
        }

        .rop-input::placeholder {
          color: #6b7280;
        }

        .rop-ask-btn {
          padding: 10px 18px;
          background: rgba(251, 191, 36, 0.15);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 8px;
          color: #fbbf24;
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.2s;
        }

        .rop-ask-btn:hover:not(:disabled) {
          background: rgba(251, 191, 36, 0.25);
        }

        .rop-ask-btn:disabled {
          opacity: 0.4;
          cursor: default;
        }

        /* Suggestion chips */
        .rop-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 10px;
        }

        .rop-chip {
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          color: #d1d5db;
          font-size: 11px;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }

        .rop-chip:hover {
          background: rgba(251, 191, 36, 0.08);
          border-color: rgba(251, 191, 36, 0.25);
          color: #fbbf24;
        }

        /* Revealing animation */
        .rop-revealing {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          color: #fbbf24;
          font-size: 13px;
          font-style: italic;
        }

        .rop-revealing-icon {
          font-size: 18px;
          animation: rop-pulse 0.8s ease-in-out infinite;
        }

        @keyframes rop-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* Answer card */
        .rop-answer-card {
          border-left: 3px solid;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          margin-bottom: 10px;
        }

        .rop-latest {
          animation: rop-fadein 0.3s ease;
        }

        .rop-older {
          opacity: 0.6;
        }

        @keyframes rop-fadein {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .rop-question-echo {
          font-size: 12px;
          color: #6b7280;
          font-style: italic;
          margin-bottom: 8px;
        }

        .rop-chamber-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }

        .rop-chamber-icon {
          font-size: 16px;
        }

        .rop-chamber-label {
          font-size: 11px;
          font-weight: 600;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .rop-chamber-score {
          font-size: 12px;
          font-weight: 700;
          margin-left: auto;
        }

        .rop-answer-title {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .rop-answer-body {
          font-size: 12px;
          line-height: 1.7;
          color: #d1d5db;
          margin: 0 0 10px 0;
        }

        .rop-guidance {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          padding: 8px 10px;
          background: rgba(251, 191, 36, 0.04);
          border-radius: 6px;
          font-size: 11px;
          color: #fbbf24;
          line-height: 1.5;
        }

        .rop-guidance-icon {
          font-size: 13px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* Ask another */
        .rop-another-btn {
          display: block;
          width: 100%;
          padding: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          color: #9ca3af;
          font-size: 12px;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }

        .rop-another-btn:hover {
          background: rgba(251, 191, 36, 0.06);
          color: #fbbf24;
        }
      `}</style>
    </div>
  );
};

export default RelationshipOraclePanel;
