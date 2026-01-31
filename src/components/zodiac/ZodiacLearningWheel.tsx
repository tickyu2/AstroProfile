/**
 * ZodiacLearningWheel.tsx
 * =======================
 *
 * Integrated learning component combining the Zodiac Blend Wheel with
 * the Explanation Panel. This is the primary teaching tool for exploring
 * how zodiac blends shape identity, behavior, and growth.
 *
 * Features:
 * - Real-time explanation updates on hover
 * - 84 unique psychological micro-explanations
 * - Click to lock/explore any date
 * - Today marker and birth date indicator
 * - Luna's insights for each day
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState, useCallback } from 'react';
import { ZodiacBlendWheel } from './ZodiacBlendWheel';
import { ZodiacExplanationPanel } from './ZodiacExplanationPanel';
import {
  DayBlend,
  ZodiacSign,
  SIGN_GLYPHS,
  SIGN_ELEMENTS,
  ELEMENT_COLORS,
} from '../../data/zodiacBlendData';
import { getExplanationStats } from '../../data/zodiacExplanationEngine';

// =============================================================================
// TYPES
// =============================================================================

interface ZodiacLearningWheelProps {
  /** Year to display */
  year?: number;
  /** User's birth date ("YYYY-MM-DD") */
  birthDate?: string;
  /** Wheel size */
  wheelSize?: number;
  /** Panel width */
  panelWidth?: number;
  /** Layout direction */
  layout?: 'horizontal' | 'vertical';
  /** Custom class name */
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const ZodiacLearningWheel: React.FC<ZodiacLearningWheelProps> = ({
  year = new Date().getFullYear(),
  birthDate,
  wheelSize = 500,
  panelWidth = 380,
  layout = 'horizontal',
  className = '',
}) => {
  // Track hovered and selected days
  const [hoveredDay, setHoveredDay] = useState<DayBlend | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayBlend | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  // Handle hover events
  const handleDayHover = useCallback((day: DayBlend | null) => {
    if (!isLocked) {
      setHoveredDay(day);
    }
  }, [isLocked]);

  // Handle click events (lock/unlock)
  const handleDaySelect = useCallback((day: DayBlend) => {
    if (selectedDay?.date === day.date) {
      // Clicking same day unlocks
      setIsLocked(false);
      setSelectedDay(null);
    } else {
      // Click new day to lock
      setIsLocked(true);
      setSelectedDay(day);
      setHoveredDay(day);
    }
  }, [selectedDay]);

  // Clear selection
  const handleClearSelection = useCallback(() => {
    setIsLocked(false);
    setSelectedDay(null);
    setHoveredDay(null);
  }, []);

  // The day to show in the panel
  const displayDay = isLocked ? selectedDay : hoveredDay;

  // Get stats for footer
  const stats = getExplanationStats();

  const isHorizontal = layout === 'horizontal';

  return (
    <div
      className={`zodiac-learning-wheel ${className}`}
      style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        gap: '24px',
        padding: '24px',
        background: '#0d0d1a',
        minHeight: '100%',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header for vertical layout */}
      {!isHorizontal && (
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h2 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 600,
            color: '#fff',
          }}>
            Zodiac Learning Wheel
          </h2>
          <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#666' }}>
            Hover to explore • Click to lock • {stats.total} unique explanations
          </p>
        </div>
      )}

      {/* Wheel Section */}
      <div style={{ flex: '0 0 auto', position: 'relative' }}>
        {isHorizontal && (
          <div style={{
            marginBottom: '12px',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: '#666',
          }}>
            Zodiac Blend Wheel
          </div>
        )}

        <ZodiacBlendWheel
          year={year}
          width={wheelSize}
          height={wheelSize}
          showTodayMarker={true}
          birthDate={birthDate}
          selectedDate={selectedDay?.date}
          onDaySelect={handleDaySelect}
          onDayHover={handleDayHover}
          onClearSelection={handleClearSelection}
          interactive={true}
          animate={true}
          hideTooltip={true}  // Use external panel instead
        />

        {/* Lock indicator */}
        {isLocked && (
          <div
            style={{
              position: 'absolute',
              top: isHorizontal ? 32 : 8,
              right: 8,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: 'rgba(0, 212, 255, 0.2)',
              border: '1px solid rgba(0, 212, 255, 0.4)',
              borderRadius: '12px',
              fontSize: '11px',
              color: '#00d4ff',
            }}
          >
            <span>Locked</span>
            <button
              onClick={handleClearSelection}
              style={{
                background: 'none',
                border: 'none',
                color: '#00d4ff',
                cursor: 'pointer',
                padding: 0,
                fontSize: '14px',
              }}
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Explanation Panel Section */}
      <div
        style={{
          flex: isHorizontal ? '1' : '0 0 auto',
          minWidth: isHorizontal ? panelWidth : 'auto',
          maxWidth: isHorizontal ? panelWidth : 'none',
        }}
      >
        {isHorizontal && (
          <div style={{
            marginBottom: '12px',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: '#666',
          }}>
            Learning Panel
          </div>
        )}

        <ZodiacExplanationPanel
          day={displayDay}
          expanded={true}
          theme="dark"
        />
      </div>
    </div>
  );
};

// =============================================================================
// COMPACT VERSION (for embedding)
// =============================================================================

export const ZodiacLearningWheelCompact: React.FC<{
  year?: number;
  birthDate?: string;
  size?: number;
}> = ({
  year = new Date().getFullYear(),
  birthDate,
  size = 400,
}) => {
  const [hoveredDay, setHoveredDay] = useState<DayBlend | null>(null);

  return (
    <div style={{ position: 'relative' }}>
      <ZodiacBlendWheel
        year={year}
        width={size}
        height={size}
        showTodayMarker={true}
        birthDate={birthDate}
        onDayHover={setHoveredDay}
        interactive={true}
        animate={true}
        hideTooltip={true}
      />

      {/* Floating explanation card */}
      {hoveredDay && (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '300px',
          }}
        >
          <QuickExplanation day={hoveredDay} />
        </div>
      )}
    </div>
  );
};

// =============================================================================
// QUICK EXPLANATION CARD
// =============================================================================

const QuickExplanation: React.FC<{ day: DayBlend }> = ({ day }) => {
  const primaryColor = ELEMENT_COLORS[SIGN_ELEMENTS[day.primarySign]];
  const blendColor = day.blendSign ? ELEMENT_COLORS[SIGN_ELEMENTS[day.blendSign]] : null;
  const primaryPercent = 1 - (day.blendPercent || 0);

  return (
    <div
      style={{
        background: 'rgba(13, 13, 26, 0.95)',
        border: `1px solid ${primaryColor}44`,
        borderRadius: '12px',
        padding: '14px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {/* Date and sign */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <span style={{ fontSize: '24px' }}>{SIGN_GLYPHS[day.primarySign]}</span>
        <div>
          <div style={{ color: '#888', fontSize: '10px' }}>{day.date}</div>
          <div style={{ color: primaryColor, fontWeight: 600 }}>
            {day.primarySign} {Math.round(primaryPercent * 100)}%
          </div>
        </div>
        {day.blendSign && day.blendPercent > 0 && (
          <>
            <span style={{ color: '#444' }}>+</span>
            <span style={{ fontSize: '20px' }}>{SIGN_GLYPHS[day.blendSign]}</span>
            <span style={{ color: blendColor || '#888', fontSize: '13px' }}>
              {Math.round(day.blendPercent * 100)}%
            </span>
          </>
        )}
      </div>

      {/* Cusp info */}
      {day.cuspType !== 'none' && day.blendSign && (
        <div style={{ fontSize: '12px', color: '#aaa' }}>
          {day.cuspType === 'backward'
            ? `Emerging from ${day.blendSign}`
            : `Transitioning toward ${day.blendSign}`}
          {' — Day '}
          {day.cuspDay}
          {' of 6'}
        </div>
      )}

      {day.cuspType === 'none' && (
        <div style={{ fontSize: '12px', color: '#888' }}>
          Pure {day.primarySign} expression
        </div>
      )}
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default ZodiacLearningWheel;
