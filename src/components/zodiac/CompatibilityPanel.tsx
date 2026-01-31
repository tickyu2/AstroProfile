/**
 * CompatibilityPanel.tsx
 * ======================
 *
 * React component for displaying elemental compatibility results.
 * Shows the chemistry, communication, love language, conflict, and growth
 * narratives for any two elemental profiles.
 *
 * Features:
 * - Grade-based coloring (A = gold, B = sky blue, Neutral = gray)
 * - Element breakdown with emoji visualization
 * - Expandable narrative sections
 * - Breathing animation synced with wheel
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState } from 'react';
import {
  CompatibilityResult,
  CompatibilityGrade,
  Element,
  ELEMENT_EMOJI,
  GRADE_COLORS,
} from '../../data/compatibilityTypes';
import { GRADE_EXPLANATIONS } from '../../data/elementalNarratives';

// =============================================================================
// TYPES
// =============================================================================

interface CompatibilityPanelProps {
  result: CompatibilityResult | null;
  expanded?: boolean;
  theme?: 'dark' | 'light';
  breathe?: boolean;
  className?: string;
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

const GradeBadge: React.FC<{ grade: CompatibilityGrade }> = ({ grade }) => {
  const colors = GRADE_COLORS[grade];
  const explanation = GRADE_EXPLANATIONS[grade];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        background: `${colors.fill}22`,
        border: `2px solid ${colors.fill}`,
        borderRadius: '20px',
        boxShadow: `0 0 12px ${colors.glow}`,
      }}
    >
      <span
        style={{
          fontSize: '18px',
          fontWeight: 700,
          color: colors.fill,
        }}
      >
        Grade {grade}
      </span>
      <span style={{ fontSize: '12px', color: '#aaa' }}>
        {explanation.label}
      </span>
    </div>
  );
};

const ElementBadge: React.FC<{
  element: Element;
  percent: number;
  label: string;
}> = ({ element, percent, label }) => {
  const emoji = ELEMENT_EMOJI[element];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        padding: '8px 12px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        minWidth: '80px',
      }}
    >
      <span style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{ fontSize: '24px' }}>{emoji}</span>
      <span
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#fff',
          textTransform: 'capitalize',
        }}
      >
        {element}
      </span>
      <span style={{ fontSize: '11px', color: '#888' }}>
        {Math.round(percent * 100)}%
      </span>
    </div>
  );
};

const NarrativeSection: React.FC<{
  title: string;
  icon: string;
  content: string;
  color?: string;
  defaultExpanded?: boolean;
}> = ({ title, icon, content, color = '#aaa', defaultExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div style={{ marginBottom: '12px' }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 0',
          width: '100%',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '14px' }}>{icon}</span>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color,
          }}
        >
          {title}
        </span>
        <span style={{ marginLeft: 'auto', color: '#666', fontSize: '12px' }}>
          {isExpanded ? '−' : '+'}
        </span>
      </button>
      {isExpanded && (
        <div
          style={{
            color: '#ccc',
            fontSize: '13px',
            lineHeight: '1.6',
            paddingLeft: '20px',
            marginTop: '4px',
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

const ScoreBar: React.FC<{ score: number; grade: CompatibilityGrade }> = ({
  score,
  grade,
}) => {
  const colors = GRADE_COLORS[grade];

  return (
    <div style={{ marginTop: '12px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '10px',
          color: '#666',
          marginBottom: '4px',
        }}
      >
        <span>Compatibility Score</span>
        <span style={{ color: colors.fill }}>{Math.round(score * 100)}%</span>
      </div>
      <div
        style={{
          height: '6px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '3px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${score * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${colors.fill}88, ${colors.fill})`,
            borderRadius: '3px',
            transition: 'width 0.5s ease-out',
          }}
        />
      </div>
    </div>
  );
};

// =============================================================================
// IDLE STATE
// =============================================================================

const IdlePanel: React.FC = () => (
  <div style={{ padding: '24px', textAlign: 'center' }}>
    <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.5 }}>
      🔥🌍💨💧
    </div>
    <div style={{ color: '#888', fontSize: '14px', marginBottom: '16px' }}>
      Click any day to see elemental compatibility
    </div>
    <div style={{ color: '#666', fontSize: '12px', lineHeight: '1.8' }}>
      <p style={{ margin: '0 0 8px 0' }}>
        The wheel will light up showing how each day's elemental energy
        interacts with your selected date.
      </p>
      <p style={{ margin: '0 0 8px 0' }}>
        <span style={{ color: '#ffd700' }}>Gold (Grade A)</span> = Natural harmony
      </p>
      <p style={{ margin: '0 0 8px 0' }}>
        <span style={{ color: '#87ceeb' }}>Blue (Grade B)</span> = Growth potential
      </p>
      <p style={{ margin: 0 }}>
        <span style={{ color: '#888' }}>Gray (Neutral)</span> = Same element mirror
      </p>
    </div>
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const CompatibilityPanel: React.FC<CompatibilityPanelProps> = ({
  result,
  expanded = true,
  theme = 'dark',
  breathe = false,
  className = '',
}) => {
  const bgColor = theme === 'dark' ? 'rgba(13, 13, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const textColor = theme === 'dark' ? '#fff' : '#1a1a2e';

  if (!result) {
    return (
      <div
        className={className}
        style={{
          background: bgColor,
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden',
          minHeight: '300px',
        }}
      >
        <IdlePanel />
      </div>
    );
  }

  const {
    personA,
    personB,
    dominantA,
    dominantB,
    grade,
    narrative,
    score,
    secondaryElements,
  } = result;

  const gradeColors = GRADE_COLORS[grade];

  // Format dates for display
  const formatDate = (dateStr: string) => {
    const [, month, day] = dateStr.split('-').map(Number);
    const date = new Date(2000, month - 1, day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className={`compatibility-panel ${className}`}
      style={{
        background: bgColor,
        borderRadius: '12px',
        border: `1px solid ${gradeColors.fill}44`,
        overflow: 'hidden',
        boxShadow: `0 0 20px ${gradeColors.glow}`,
        animation: breathe ? 'compatBreathe 6s ease-in-out infinite' : undefined,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: `linear-gradient(135deg, ${gradeColors.fill}11, transparent)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '12px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: textColor,
                marginBottom: '4px',
              }}
            >
              {narrative.title}
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              {formatDate(personA.date)} × {formatDate(personB.date)}
            </div>
          </div>
          <GradeBadge grade={grade} />
        </div>

        {/* Element comparison */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '16px',
          }}
        >
          <ElementBadge
            element={dominantA}
            percent={personA.elements[dominantA]}
            label="You"
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '24px',
              color: gradeColors.fill,
            }}
          >
            ↔
          </div>
          <ElementBadge
            element={dominantB}
            percent={personB.elements[dominantB]}
            label="Them"
          />
        </div>

        <ScoreBar score={score} grade={grade} />
      </div>

      {/* Content */}
      <div
        style={{
          padding: '20px',
          maxHeight: expanded ? '500px' : '200px',
          overflowY: 'auto',
        }}
      >
        {/* Chemistry - always visible */}
        <div
          style={{
            marginBottom: '20px',
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '8px',
            borderLeft: `3px solid ${gradeColors.fill}`,
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: gradeColors.fill,
              marginBottom: '8px',
            }}
          >
            {narrative.emoji} Chemistry
          </div>
          <div
            style={{
              fontSize: '14px',
              color: '#ddd',
              lineHeight: '1.6',
            }}
          >
            {narrative.chemistry}
          </div>
        </div>

        {/* Detailed sections */}
        {expanded && (
          <>
            <NarrativeSection
              title="Communication"
              icon="💬"
              content={narrative.communication}
              color="#84b6f4"
            />
            <NarrativeSection
              title="Love Language"
              icon="💕"
              content={narrative.loveLanguage}
              color="#ff9999"
            />
            <NarrativeSection
              title="Conflict Pattern"
              icon="⚡"
              content={narrative.conflict}
              color="#ffa500"
            />
            <NarrativeSection
              title="Growth Opportunity"
              icon="🌱"
              content={narrative.growth}
              color="#77dd77"
            />
          </>
        )}

        {/* Secondary elements insight */}
        {secondaryElements && expanded && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#888',
            }}
          >
            <span style={{ fontWeight: 600 }}>Undertones: </span>
            Your {ELEMENT_EMOJI[secondaryElements.a]} {secondaryElements.a} meets their{' '}
            {ELEMENT_EMOJI[secondaryElements.b]} {secondaryElements.b} — adding subtle
            complexity to your dynamic.
          </div>
        )}
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes compatBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.008); }
        }

        .compatibility-panel {
          transform-origin: center center;
        }
      `}</style>
    </div>
  );
};

// =============================================================================
// COMPACT VERSION
// =============================================================================

export const CompatibilityPanelCompact: React.FC<{
  result: CompatibilityResult | null;
  className?: string;
}> = ({ result, className = '' }) => {
  if (!result) {
    return (
      <div
        className={className}
        style={{
          padding: '12px 14px',
          background: 'rgba(0,0,0,0.85)',
          color: '#ddd',
          borderRadius: '8px',
          fontSize: '13px',
        }}
      >
        Click any day to see compatibility chemistry.
      </div>
    );
  }

  const { dominantA, dominantB, grade, narrative, score } = result;
  const colors = GRADE_COLORS[grade];

  return (
    <div
      className={className}
      style={{
        padding: '14px 16px',
        background: 'rgba(0,0,0,0.9)',
        borderRadius: '8px',
        fontSize: '13px',
        lineHeight: 1.5,
        maxWidth: '320px',
        border: `1px solid ${colors.fill}44`,
        boxShadow: `0 0 12px ${colors.glow}`,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: '4px', color: colors.fill }}>
        Grade {grade} — {narrative.title}
      </div>
      <div style={{ marginBottom: '8px', fontSize: '12px', color: '#888' }}>
        {ELEMENT_EMOJI[dominantA]} {dominantA} × {ELEMENT_EMOJI[dominantB]} {dominantB}
        <span style={{ marginLeft: '8px' }}>({Math.round(score * 100)}% match)</span>
      </div>
      <div style={{ color: '#ccc', fontSize: '12px' }}>
        {narrative.chemistry.slice(0, 120)}...
      </div>
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default CompatibilityPanel;
