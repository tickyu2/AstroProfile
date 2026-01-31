/**
 * CuspSliderInteractive.tsx
 * =========================
 *
 * Interactive slider component that lets users explore the φ-curve
 * cusp blend in real-time. Drag through days 1-6 and watch the
 * blend percentages animate.
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState, useMemo, useCallback } from 'react';
import { CUSP_ARCHETYPES, CuspTransition, CuspDayArchetype } from '../../data/cuspArchetypes';

// =============================================================================
// CONSTANTS
// =============================================================================

// The golden ratio curve values (pre-calculated for days 1-6)
const PHI_CURVE = [0.13, 0.37, 0.58, 0.75, 0.89, 0.98];

// Month abbreviations for display
const MONTH_ABBREV = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#ef4444',
  Earth: '#22c55e',
  Air: '#38bdf8',
  Water: '#8b5cf6',
};

const ELEMENT_EMOJI: Record<string, string> = {
  Fire: '🔥',
  Earth: '🌍',
  Air: '💨',
  Water: '💧',
};

// =============================================================================
// TYPES
// =============================================================================

interface CuspSliderInteractiveProps {
  className?: string;
  defaultCuspIndex?: number;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const CuspSliderInteractive: React.FC<CuspSliderInteractiveProps> = ({
  className = '',
  defaultCuspIndex = 1, // Default to Aries→Taurus
}) => {
  const [cuspIndex, setCuspIndex] = useState(defaultCuspIndex);
  const [day, setDay] = useState(3); // Day 1-6, default to middle

  const cusp = CUSP_ARCHETYPES[cuspIndex];

  // Get the current day's archetype data
  const currentArchetype = useMemo(() => {
    return cusp.archetypes.find((a) => a.day === day);
  }, [cusp, day]);

  // Get actual date from the archetype data
  const actualDate = useMemo(() => {
    if (currentArchetype) {
      return currentArchetype.date;
    }
    return '';
  }, [currentArchetype]);

  // Calculate blend percentages using φ-curve
  const blendPercent = useMemo(() => {
    return Math.round(PHI_CURVE[day - 1] * 100);
  }, [day]);

  const primaryPercent = 100 - blendPercent;

  // Calculate what a linear blend would give (for comparison)
  const linearPercent = useMemo(() => {
    return Math.round((day / 6) * 100);
  }, [day]);

  // Handle cusp selection
  const handleCuspChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCuspIndex(parseInt(e.target.value, 10));
  }, []);

  // Handle day slider
  const handleDayChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDay(parseInt(e.target.value, 10));
  }, []);

  return (
    <div
      className={className}
      style={{
        background: 'rgba(13, 13, 26, 0.95)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '16px',
        minWidth: '300px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#e5e7eb', marginBottom: '4px' }}>
          🌀 Interactive Cusp Explorer
        </div>
        <div style={{ fontSize: '11px', color: '#6b7280' }}>
          Drag the slider to see the φ-curve blend in real-time
        </div>
      </div>

      {/* Cusp Selector */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '11px', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
          Select Cusp Transition:
        </label>
        <select
          value={cuspIndex}
          onChange={handleCuspChange}
          style={{
            width: '100%',
            padding: '8px 10px',
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px',
            color: '#e5e7eb',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          {CUSP_ARCHETYPES.map((c, i) => (
            <option key={i} value={i}>
              {c.fromSymbol} {c.fromSign} → {c.toSymbol} {c.toSign}
            </option>
          ))}
        </select>
      </div>

      {/* Current Transition Display */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '8px',
          marginBottom: '16px',
        }}
      >
        {/* From Sign */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px', marginBottom: '4px' }}>{cusp.fromSymbol}</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: ELEMENT_COLORS[cusp.fromElement] }}>
            {cusp.fromSign}
          </div>
          <div style={{ fontSize: '10px', color: '#6b7280' }}>
            {ELEMENT_EMOJI[cusp.fromElement]} {cusp.fromElement}
          </div>
          <div
            style={{
              marginTop: '8px',
              fontSize: '18px',
              fontWeight: 700,
              color: ELEMENT_COLORS[cusp.fromElement],
            }}
          >
            {primaryPercent}%
          </div>
        </div>

        {/* Arrow with Day */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', color: '#6b7280', marginBottom: '4px' }}>→</div>
          <div
            style={{
              background: 'rgba(251, 191, 36, 0.2)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              borderRadius: '12px',
              padding: '6px 12px',
              fontWeight: 600,
              color: '#fbbf24',
            }}
          >
            <div style={{ fontSize: '12px' }}>Day {day}</div>
            <div style={{ fontSize: '10px', color: '#fde68a', marginTop: '2px' }}>{actualDate}</div>
          </div>
        </div>

        {/* To Sign */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px', marginBottom: '4px' }}>{cusp.toSymbol}</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: ELEMENT_COLORS[cusp.toElement] }}>
            {cusp.toSign}
          </div>
          <div style={{ fontSize: '10px', color: '#6b7280' }}>
            {ELEMENT_EMOJI[cusp.toElement]} {cusp.toElement}
          </div>
          <div
            style={{
              marginTop: '8px',
              fontSize: '18px',
              fontWeight: 700,
              color: ELEMENT_COLORS[cusp.toElement],
            }}
          >
            {blendPercent}%
          </div>
        </div>
      </div>

      {/* Day Slider */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', color: '#9ca3af' }}>Day 1</span>
          <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 600 }}>
            φ-Curve: {blendPercent}%
          </span>
          <span style={{ fontSize: '11px', color: '#9ca3af' }}>Day 6</span>
        </div>
        <input
          type="range"
          min="1"
          max="6"
          value={day}
          onChange={handleDayChange}
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            background: `linear-gradient(90deg,
              ${ELEMENT_COLORS[cusp.fromElement]}44 0%,
              ${ELEMENT_COLORS[cusp.toElement]}44 100%)`,
            cursor: 'pointer',
            accentColor: '#fbbf24',
          }}
        />
      </div>

      {/* Blend Visualization Bar */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px' }}>
          Energy Blend:
        </div>
        <div
          style={{
            height: '24px',
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div
            style={{
              width: `${primaryPercent}%`,
              background: `linear-gradient(90deg, ${ELEMENT_COLORS[cusp.fromElement]}, ${ELEMENT_COLORS[cusp.fromElement]}88)`,
              transition: 'width 0.2s ease-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 600,
              color: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {primaryPercent > 15 && `${cusp.fromSign}`}
          </div>
          <div
            style={{
              width: `${blendPercent}%`,
              background: `linear-gradient(90deg, ${ELEMENT_COLORS[cusp.toElement]}88, ${ELEMENT_COLORS[cusp.toElement]})`,
              transition: 'width 0.2s ease-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 600,
              color: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {blendPercent > 15 && `${cusp.toSign}`}
          </div>
        </div>
      </div>

      {/* φ vs Linear Comparison */}
      <div
        style={{
          background: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.2)',
          borderRadius: '8px',
          padding: '10px',
          fontSize: '11px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ color: '#9ca3af' }}>Linear would be:</span>
          <span style={{ color: '#9ca3af' }}>{linearPercent}%</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#fbbf24', fontWeight: 600 }}>φ-Curve gives:</span>
          <span style={{ color: '#fbbf24', fontWeight: 600 }}>{blendPercent}%</span>
        </div>
        <div style={{ marginTop: '8px', color: '#a78bfa', fontSize: '10px' }}>
          {blendPercent < linearPercent
            ? `φ-curve is ${linearPercent - blendPercent}% slower here (ease-in effect)`
            : blendPercent > linearPercent
            ? `φ-curve is ${blendPercent - linearPercent}% faster here (ease-out effect)`
            : 'φ-curve matches linear at this point'}
        </div>
      </div>

      {/* Archetype Display Section */}
      {currentArchetype && (
        <div
          style={{
            marginTop: '16px',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '10px',
            padding: '14px',
          }}
        >
          {/* Mythic Name & Title */}
          <div style={{ marginBottom: '12px' }}>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#c4b5fd',
                marginBottom: '4px',
              }}
            >
              {currentArchetype.mythicName}
            </div>
            <div
              style={{
                fontSize: '11px',
                fontStyle: 'italic',
                color: '#a78bfa',
              }}
            >
              "{currentArchetype.title}"
            </div>
          </div>

          {/* Psychological Profile */}
          <div style={{ marginBottom: '12px' }}>
            <div
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px',
              }}
            >
              Psychological Profile
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#e5e7eb',
                lineHeight: '1.5',
              }}
            >
              {currentArchetype.psychologicalProfile}
            </div>
          </div>

          {/* Strengths & Shadows */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            {/* Strengths */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#4ade80',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px',
                }}
              >
                Strengths
              </div>
              <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '11px', color: '#d1d5db' }}>
                {currentArchetype.strengths.map((s, i) => (
                  <li key={i} style={{ marginBottom: '2px' }}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Shadows */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#f87171',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px',
                }}
              >
                Shadows
              </div>
              <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '11px', color: '#d1d5db' }}>
                {currentArchetype.shadows.map((s, i) => (
                  <li key={i} style={{ marginBottom: '2px' }}>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Life Theme */}
          <div
            style={{
              background: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              borderRadius: '6px',
              padding: '10px',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: '#fbbf24',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px',
              }}
            >
              Life Theme
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#fde68a',
                fontStyle: 'italic',
              }}
            >
              {currentArchetype.lifeTheme}
            </div>
          </div>
        </div>
      )}

      {/* Cusp Name Badge */}
      <div
        style={{
          marginTop: '12px',
          textAlign: 'center',
          padding: '8px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '8px',
        }}
      >
        <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>
          Cusp Transition
        </div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#a78bfa' }}>
          {cusp.cuspName}
        </div>
        <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
          {cusp.elementalDynamic}
        </div>
      </div>

      {/* Mini φ-Curve Visualization */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '8px' }}>
          φ-Curve Shape:
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '60px' }}>
          {PHI_CURVE.map((value, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${value * 100}%`,
                background: i + 1 === day
                  ? `linear-gradient(180deg, #fbbf24, #f59e0b)`
                  : 'rgba(255,255,255,0.1)',
                borderRadius: '3px 3px 0 0',
                transition: 'all 0.2s ease-out',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: '-18px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '9px',
                  color: i + 1 === day ? '#fbbf24' : '#6b7280',
                  fontWeight: i + 1 === day ? 600 : 400,
                }}
              >
                {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default CuspSliderInteractive;
