/**
 * CuspSliderInteractive.tsx
 * =========================
 *
 * Interactive slider component that lets users explore the φ-curve
 * cusp blend across the full 16-day transition range:
 *   2 pure days → 6 cusp days → boundary → 6 cusp days → 2 pure days
 *
 * Formula: neighborWeight = ((7-d)/7)^φ where φ = 1.618
 *
 * GENESIS AstroProfile - January 2026
 * Updated: February 2026 - Full 16-day range with both cusp sides
 */

import React, { useState, useMemo, useCallback } from 'react';
import { CUSP_ARCHETYPES, CuspTransition, CuspDayArchetype } from '../../data/cuspArchetypes';

// =============================================================================
// CONSTANTS
// =============================================================================

// The golden ratio curve values (pre-calculated for days 1-6)
// Formula: 1 - ((7-d)/7)^φ where φ = 1.618
const PHI_CURVE = [0.22, 0.42, 0.60, 0.75, 0.87, 0.96];

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

const MONTH_NAMES: Record<string, number> = {
  January: 0, February: 1, March: 2, April: 3,
  May: 4, June: 5, July: 6, August: 7,
  September: 8, October: 9, November: 10, December: 11,
};

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// =============================================================================
// TYPES
// =============================================================================

interface CuspSliderInteractiveProps {
  className?: string;
  defaultCuspIndex?: number;
}

type PositionSide = 'pure-from' | 'before' | 'after' | 'pure-to';

interface PositionData {
  fromPercent: number;
  toPercent: number;
  cuspDay: number | null;
  side: PositionSide;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Compute blend data for a slider position (1-16).
 *
 * Layout: [1,2] pure fromSign | [3-8] backward cusp (day 6→1) | [9-14] forward cusp (day 1→6) | [15,16] pure toSign
 */
function getPositionData(pos: number): PositionData {
  if (pos <= 2) return { fromPercent: 100, toPercent: 0, cuspDay: null, side: 'pure-from' };
  if (pos >= 15) return { fromPercent: 0, toPercent: 100, cuspDay: null, side: 'pure-to' };

  if (pos <= 8) {
    // Before boundary: positions 3-8 → cusp days 6,5,4,3,2,1 from boundary
    const dayFromBoundary = 8 - pos + 1; // 3→6, 4→5, 5→4, 6→3, 7→2, 8→1
    const fromPct = Math.round(PHI_CURVE[dayFromBoundary - 1] * 100);
    return { fromPercent: fromPct, toPercent: 100 - fromPct, cuspDay: dayFromBoundary, side: 'before' };
  }

  // After boundary: positions 9-14 → cusp days 1,2,3,4,5,6 from boundary
  const dayFromBoundary = pos - 8; // 9→1, 10→2, 11→3, 12→4, 13→5, 14→6
  const toPct = Math.round(PHI_CURVE[dayFromBoundary - 1] * 100);
  return { fromPercent: 100 - toPct, toPercent: toPct, cuspDay: dayFromBoundary, side: 'after' };
}

/**
 * Compute the date string for a slider position, based on the cusp's first archetype date.
 * Position 9 corresponds to the first archetype date (day 1 after boundary).
 */
function getPositionDate(pos: number, cusp: CuspTransition): string {
  const firstDate = cusp.archetypes[0].date; // e.g. "April 20"
  const parts = firstDate.split(' ');
  const monthIdx = MONTH_NAMES[parts[0]];
  const dayNum = parseInt(parts[1], 10);
  const d = new Date(2026, monthIdx, dayNum);
  d.setDate(d.getDate() + (pos - 9)); // position 9 = archetype day 1
  return `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}`;
}

/**
 * Neighbor blend height for the mini visualization (0-100).
 * Shows how much the "other" sign bleeds in at each position.
 */
function getNeighborBlend(pos: number): number {
  const data = getPositionData(pos);
  if (data.side === 'pure-from' || data.side === 'pure-to') return 0;
  if (data.side === 'before') return data.toPercent;
  return data.fromPercent;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const CuspSliderInteractive: React.FC<CuspSliderInteractiveProps> = ({
  className = '',
  defaultCuspIndex = 1, // Default to Aries→Taurus
}) => {
  const [cuspIndex, setCuspIndex] = useState(defaultCuspIndex);
  const [position, setPosition] = useState(8); // Default near boundary

  const cusp = CUSP_ARCHETYPES[cuspIndex];
  const posData = useMemo(() => getPositionData(position), [position]);
  const dateStr = useMemo(() => getPositionDate(position, cusp), [position, cusp]);

  // Archetype data — same cusp day distance from boundary applies to both sides
  const currentArchetype = useMemo((): CuspDayArchetype | null => {
    if ((posData.side === 'before' || posData.side === 'after') && posData.cuspDay) {
      return cusp.archetypes.find((a) => a.day === posData.cuspDay) || null;
    }
    return null;
  }, [cusp, posData]);

  // Handle cusp selection
  const handleCuspChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCuspIndex(parseInt(e.target.value, 10));
  }, []);

  // Handle position slider
  const handlePositionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPosition(parseInt(e.target.value, 10));
  }, []);

  // Position label for the center badge
  const positionLabel = useMemo(() => {
    if (posData.side === 'pure-from') return `Pure ${cusp.fromSign}`;
    if (posData.side === 'pure-to') return `Pure ${cusp.toSign}`;
    if (posData.side === 'before') return `Day ${posData.cuspDay} before`;
    return `Day ${posData.cuspDay} after`;
  }, [posData, cusp]);

  // Determine which sign is dominant at this position
  const dominantSign = posData.fromPercent >= posData.toPercent ? cusp.fromSign : cusp.toSign;

  return (
    <div
      className={className}
      style={{
        background: 'rgba(13, 13, 26, 0.95)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '16px',
        width: '320px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#e5e7eb', marginBottom: '4px' }}>
          🌀 Interactive Cusp Explorer
        </div>
        <div style={{ fontSize: '11px', color: '#6b7280' }}>
          Drag the slider across the full transition range
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
              opacity: posData.fromPercent > 0 ? 1 : 0.3,
            }}
          >
            {posData.fromPercent}%
          </div>
        </div>

        {/* Center Badge */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', color: '#6b7280', marginBottom: '4px' }}>→</div>
          <div
            style={{
              background: posData.side === 'pure-from' || posData.side === 'pure-to'
                ? 'rgba(139, 92, 246, 0.2)'
                : 'rgba(251, 191, 36, 0.2)',
              border: `1px solid ${
                posData.side === 'pure-from' || posData.side === 'pure-to'
                  ? 'rgba(139, 92, 246, 0.4)'
                  : 'rgba(251, 191, 36, 0.4)'
              }`,
              borderRadius: '12px',
              padding: '6px 12px',
              fontWeight: 600,
              color: posData.side === 'pure-from' || posData.side === 'pure-to' ? '#c4b5fd' : '#fbbf24',
            }}
          >
            <div style={{ fontSize: '11px' }}>{positionLabel}</div>
            {(posData.side === 'before' || posData.side === 'after') && (
              <div style={{ fontSize: '10px', fontWeight: 700, marginTop: '1px' }}>
                {posData.side === 'before' ? cusp.toSign : cusp.fromSign}
              </div>
            )}
            <div style={{ fontSize: '10px', color: '#fde68a', marginTop: '1px' }}>{dateStr}</div>
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
              opacity: posData.toPercent > 0 ? 1 : 0.3,
            }}
          >
            {posData.toPercent}%
          </div>
        </div>
      </div>

      {/* Position Slider */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', color: ELEMENT_COLORS[cusp.fromElement] }}>
            100% {cusp.fromSign}
          </span>
          <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 600 }}>
            {posData.side === 'pure-from' || posData.side === 'pure-to'
              ? `Pure ${dominantSign}`
              : `φ blend: ${posData.side === 'before' ? posData.toPercent : posData.fromPercent}% neighbor`}
          </span>
          <span style={{ fontSize: '10px', color: ELEMENT_COLORS[cusp.toElement] }}>
            100% {cusp.toSign}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="16"
          value={position}
          onChange={handlePositionChange}
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            background: `linear-gradient(90deg,
              ${ELEMENT_COLORS[cusp.fromElement]}44 0%,
              ${ELEMENT_COLORS[cusp.fromElement]}44 12.5%,
              ${ELEMENT_COLORS[cusp.toElement]}22 50%,
              ${ELEMENT_COLORS[cusp.toElement]}44 87.5%,
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
              width: `${posData.fromPercent}%`,
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
            {posData.fromPercent > 15 && `${cusp.fromSign}`}
          </div>
          <div
            style={{
              width: `${posData.toPercent}%`,
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
            {posData.toPercent > 15 && `${cusp.toSign}`}
          </div>
        </div>
      </div>

      {/* Cusp Zone Info — shown for cusp positions */}
      {(posData.side === 'before' || posData.side === 'after') && (
        <div
          style={{
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.2)',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '11px',
            marginBottom: currentArchetype ? '0' : '12px',
          }}
        >
          <div style={{ color: '#fbbf24', fontWeight: 600, marginBottom: '4px' }}>
            Cusp Zone — {posData.cuspDay === 1 ? 'Right at the boundary' : `${posData.cuspDay} days from boundary`}
          </div>
          <div style={{ color: '#9ca3af' }}>
            {posData.side === 'before'
              ? `Still in ${cusp.fromSign} territory, but ${cusp.toSign} energy is ${posData.toPercent}% present`
              : `Now in ${cusp.toSign} territory, with ${posData.fromPercent}% ${cusp.fromSign} energy lingering`}
          </div>
        </div>
      )}

      {/* Pure zone description */}
      {(posData.side === 'pure-from' || posData.side === 'pure-to') && (
        <div
          style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '11px',
            marginBottom: '12px',
          }}
        >
          <div style={{ color: '#c4b5fd', fontWeight: 600, marginBottom: '4px' }}>
            Pure {dominantSign} Expression
          </div>
          <div style={{ color: '#9ca3af' }}>
            {posData.side === 'pure-from'
              ? `Outside the cusp zone — undiluted ${cusp.fromSign} energy with no ${cusp.toSign} influence yet.`
              : `Beyond the cusp zone — full ${cusp.toSign} energy, ${cusp.fromSign} influence has faded completely.`}
          </div>
        </div>
      )}

      {/* Archetype Display Section — only for after-boundary positions */}
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

      {/* Mini Full-Range Visualization */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '8px' }}>
          Full Transition Profile:
        </div>
        <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '60px' }}>
          {Array.from({ length: 16 }, (_, i) => {
            const pos = i + 1;
            const blend = getNeighborBlend(pos);
            const isActive = pos === position;
            const isBoundary = pos === 8 || pos === 9;
            const isPure = pos <= 2 || pos >= 15;
            const pd = getPositionData(pos);
            const isFromSide = pd.side === 'pure-from' || pd.side === 'before';

            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: isPure ? '4px' : `${Math.max(6, blend)}%`,
                  background: isActive
                    ? 'linear-gradient(180deg, #fbbf24, #f59e0b)'
                    : isPure
                    ? 'rgba(255,255,255,0.15)'
                    : isFromSide
                    ? `${ELEMENT_COLORS[cusp.toElement]}66`
                    : `${ELEMENT_COLORS[cusp.fromElement]}66`,
                  borderRadius: '2px 2px 0 0',
                  transition: 'all 0.2s ease-out',
                  position: 'relative',
                  cursor: 'pointer',
                  borderRight: pos === 8 ? '2px solid rgba(251, 191, 36, 0.6)' : 'none',
                }}
                onClick={() => setPosition(pos)}
              >
                {isBoundary && pos === 8 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-16px',
                      right: '-8px',
                      fontSize: '8px',
                      color: '#fbbf24',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    boundary
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontSize: '8px', color: ELEMENT_COLORS[cusp.fromElement] }}>{cusp.fromSign}</span>
          <span style={{ fontSize: '8px', color: '#6b7280' }}>← cusp zone →</span>
          <span style={{ fontSize: '8px', color: ELEMENT_COLORS[cusp.toElement] }}>{cusp.toSign}</span>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default CuspSliderInteractive;
