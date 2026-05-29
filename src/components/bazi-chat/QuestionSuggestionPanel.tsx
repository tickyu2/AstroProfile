/**
 * Question Suggestion Panel
 *
 * 6 collapsible accordion sections (one per BaZi life domain),
 * each containing chart-aware questions generated from the user's chart.
 */

import React, { useState } from 'react';
import type { DomainQuestions, DomainId } from './questionGenerator';

interface Props {
  domains: DomainQuestions[];
  onQuestionSelect: (question: string, domain: DomainId) => void;
}

const QuestionSuggestionPanel: React.FC<Props> = ({ domains, onQuestionSelect }) => {
  const [expandedDomain, setExpandedDomain] = useState<DomainId | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {domains.map(d => {
        const isExpanded = expandedDomain === d.domain;
        return (
          <div key={d.domain}>
            {/* Accordion header */}
            <button
              type="button"
              onClick={() => setExpandedDomain(isExpanded ? null : d.domain)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                background: isExpanded ? `${d.color}12` : 'rgba(30, 41, 59, 0.5)',
                border: `1px solid ${isExpanded ? d.color + '40' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: isExpanded ? '10px 10px 0 0' : '10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '16px' }}>{d.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: isExpanded ? d.color : '#e2e8f0', fontWeight: 600, fontSize: '12px' }}>
                  {d.label}
                </div>
                <div style={{ color: '#64748b', fontSize: '10px', marginTop: '1px' }}>
                  {d.description}
                </div>
              </div>
              <span style={{ color: '#64748b', fontSize: '12px', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                ▾
              </span>
            </button>

            {/* Expanded questions */}
            {isExpanded && (
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: `1px solid ${d.color}25`,
                borderTop: 'none',
                borderRadius: '0 0 10px 10px',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}>
                {d.questions.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onQuestionSelect(q.text, d.domain)}
                    title={q.context}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: 'rgba(30, 41, 59, 0.4)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      color: '#cbd5e1',
                      fontSize: '11px',
                      lineHeight: 1.5,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      (e.target as HTMLElement).style.borderColor = d.color + '50';
                      (e.target as HTMLElement).style.background = d.color + '10';
                      (e.target as HTMLElement).style.color = '#f1f5f9';
                    }}
                    onMouseLeave={e => {
                      (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)';
                      (e.target as HTMLElement).style.background = 'rgba(30, 41, 59, 0.4)';
                      (e.target as HTMLElement).style.color = '#cbd5e1';
                    }}
                  >
                    {q.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuestionSuggestionPanel;
