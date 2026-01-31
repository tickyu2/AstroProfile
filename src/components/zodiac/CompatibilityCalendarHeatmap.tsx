/**
 * CompatibilityCalendarHeatmap.tsx
 * ================================
 *
 * A year-at-a-glance heatmap showing compatibility grades for every day
 * relative to an anchor date. Each day is colored by its grade (A/B/Neutral).
 *
 * Features:
 * - 12-month grid layout
 * - Grade-based coloring (Gold=A, Blue=B, Gray=Neutral)
 * - Hover tooltips showing date and grade
 * - Visual patterns emerge (e.g., Fire signs cluster gold)
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState, useMemo, useCallback } from 'react';
import { DayBlend, generateYearBlend, SIGN_ELEMENTS } from '../../data/zodiacBlendData';
import { GRADE_COLORS } from '../../data/compatibilityTypes';

// =============================================================================
// TYPES
// =============================================================================

interface CompatibilityCalendarHeatmapProps {
  anchorDate?: string; // YYYY-MM-DD format
  anchorBlend?: DayBlend;
  year?: number;
  onDayClick?: (day: DayBlend) => void;
  className?: string;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  content: string;
}

// =============================================================================
// GRADE CALCULATION (simplified for performance)
// =============================================================================

const GRADE_A_PAIRS = new Set([
  'Fire-Air', 'Air-Fire',
  'Earth-Water', 'Water-Earth',
]);

const GRADE_B_PAIRS = new Set([
  'Fire-Earth', 'Earth-Fire',
  'Fire-Water', 'Water-Fire',
  'Air-Earth', 'Earth-Air',
  'Air-Water', 'Water-Air',
]);

function getElementForSign(sign: string): string {
  return SIGN_ELEMENTS[sign as keyof typeof SIGN_ELEMENTS] || 'Fire';
}

function getDominantElement(blend: DayBlend): string {
  if (blend.cuspType === 'none' || blend.blendPercent < 0.5) {
    return getElementForSign(blend.primarySign);
  }
  // For significant blends, use the sign with higher percentage
  if (blend.blendPercent > 0.5 && blend.blendSign) {
    return getElementForSign(blend.blendSign);
  }
  return getElementForSign(blend.primarySign);
}

function calculateGrade(anchorBlend: DayBlend, dayBlend: DayBlend): 'A' | 'B' | 'Neutral' {
  const elementA = getDominantElement(anchorBlend);
  const elementB = getDominantElement(dayBlend);

  if (elementA === elementB) return 'Neutral';

  const pair = `${elementA}-${elementB}`;
  if (GRADE_A_PAIRS.has(pair)) return 'A';
  if (GRADE_B_PAIRS.has(pair)) return 'B';

  return 'Neutral';
}

// =============================================================================
// MONTH NAMES
// =============================================================================

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const MONTH_NAMES_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const CompatibilityCalendarHeatmap: React.FC<CompatibilityCalendarHeatmapProps> = ({
  anchorDate,
  anchorBlend,
  year = new Date().getFullYear(),
  onDayClick,
  className = '',
}) => {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    content: '',
  });

  // Generate year data with grades
  const yearData = useMemo(() => {
    if (!anchorBlend) return null;

    const blends = generateYearBlend(year);
    return blends.map((blend) => ({
      blend,
      grade: calculateGrade(anchorBlend, blend),
    }));
  }, [anchorBlend, year]);

  // Group by month
  const monthData = useMemo(() => {
    if (!yearData) return null;

    const months: { month: number; days: typeof yearData }[] = [];

    for (let m = 0; m < 12; m++) {
      const daysInMonth = yearData.filter((d) => {
        const [, month] = d.blend.date.split('-').map(Number);
        return month === m + 1;
      });
      months.push({ month: m, days: daysInMonth });
    }

    return months;
  }, [yearData]);

  // Calculate grade distribution stats
  const stats = useMemo(() => {
    if (!yearData) return null;

    let gradeA = 0;
    let gradeB = 0;
    let neutral = 0;

    yearData.forEach((d) => {
      if (d.grade === 'A') gradeA++;
      else if (d.grade === 'B') gradeB++;
      else neutral++;
    });

    return { gradeA, gradeB, neutral, total: yearData.length };
  }, [yearData]);

  // Handle mouse events
  const handleMouseEnter = useCallback(
    (e: React.MouseEvent, day: typeof yearData extends (infer T)[] | null ? T : never) => {
      if (!day) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const [, month, d] = day.blend.date.split('-').map(Number);

      setTooltip({
        visible: true,
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
        content: `${MONTH_NAMES_FULL[month - 1]} ${d}: ${day.blend.primarySign} - Grade ${day.grade}`,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  // No anchor - show placeholder
  if (!anchorBlend) {
    return (
      <div
        className={className}
        style={{
          background: 'rgba(13, 13, 26, 0.95)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.5 }}>📅</div>
        <div style={{ color: '#9ca3af', fontSize: '13px' }}>
          Select a birth date or click a day on the wheel<br />
          to see your year-at-a-glance compatibility map
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        background: 'rgba(13, 13, 26, 0.95)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '16px',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#e5e7eb', marginBottom: '4px' }}>
          📅 Year-at-a-Glance: {year}
        </div>
        <div style={{ fontSize: '11px', color: '#6b7280' }}>
          Compatibility for every day based on{' '}
          <span style={{ color: GRADE_COLORS.A.fill }}>{anchorBlend.primarySign}</span>
        </div>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '16px',
            padding: '10px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '8px',
            fontSize: '11px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '2px',
                background: GRADE_COLORS.A.fill,
              }}
            />
            <span style={{ color: GRADE_COLORS.A.fill, fontWeight: 600 }}>
              Grade A: {stats.gradeA}
            </span>
            <span style={{ color: '#6b7280' }}>({Math.round((stats.gradeA / stats.total) * 100)}%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '2px',
                background: GRADE_COLORS.B.fill,
              }}
            />
            <span style={{ color: GRADE_COLORS.B.fill, fontWeight: 600 }}>
              Grade B: {stats.gradeB}
            </span>
            <span style={{ color: '#6b7280' }}>({Math.round((stats.gradeB / stats.total) * 100)}%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '2px',
                background: GRADE_COLORS.Neutral.fill,
              }}
            />
            <span style={{ color: GRADE_COLORS.Neutral.fill, fontWeight: 600 }}>
              Neutral: {stats.neutral}
            </span>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
        }}
      >
        {monthData?.map((m) => (
          <div key={m.month}>
            {/* Month Label */}
            <div
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: '#9ca3af',
                marginBottom: '4px',
                textAlign: 'center',
              }}
            >
              {MONTH_NAMES[m.month]}
            </div>

            {/* Days Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '1px',
              }}
            >
              {m.days.map((day, i) => {
                const gradeColor = GRADE_COLORS[day.grade];
                const isAnchorDay = day.blend.date === anchorDate;

                return (
                  <div
                    key={i}
                    onClick={() => onDayClick?.(day.blend)}
                    onMouseEnter={(e) => handleMouseEnter(e, day)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '2px',
                      background: isAnchorDay ? '#fff' : gradeColor.fill,
                      opacity: isAnchorDay ? 1 : 0.7,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease-out',
                      border: isAnchorDay ? '1px solid #fbbf24' : 'none',
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLDivElement).style.opacity = '1';
                      (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.5)';
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLDivElement).style.opacity = isAnchorDay ? '1' : '0.7';
                      (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div
        style={{
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          fontSize: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '2px',
              background: GRADE_COLORS.A.fill,
            }}
          />
          <span style={{ color: '#9ca3af' }}>Natural Harmony (A)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '2px',
              background: GRADE_COLORS.B.fill,
            }}
          />
          <span style={{ color: '#9ca3af' }}>Growth Potential (B)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '2px',
              background: GRADE_COLORS.Neutral.fill,
            }}
          />
          <span style={{ color: '#9ca3af' }}>Same Element</span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// COMPACT VERSION (for sidebar)
// =============================================================================

export const CompatibilityCalendarCompact: React.FC<{
  anchorBlend?: DayBlend;
  year?: number;
  className?: string;
}> = ({ anchorBlend, year = new Date().getFullYear(), className = '' }) => {
  // Generate stats only
  const stats = useMemo(() => {
    if (!anchorBlend) return null;

    const blends = generateYearBlend(year);
    let gradeA = 0;
    let gradeB = 0;
    let neutral = 0;

    blends.forEach((blend) => {
      const grade = calculateGrade(anchorBlend, blend);
      if (grade === 'A') gradeA++;
      else if (grade === 'B') gradeB++;
      else neutral++;
    });

    return { gradeA, gradeB, neutral, total: blends.length };
  }, [anchorBlend, year]);

  if (!anchorBlend || !stats) {
    return (
      <div
        className={className}
        style={{
          padding: '12px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#6b7280',
        }}
      >
        Select a date to see compatibility stats
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        padding: '12px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '8px',
      }}
    >
      <div style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', marginBottom: '8px' }}>
        {year} Compatibility for {anchorBlend.primarySign}
      </div>

      {/* Stacked bar */}
      <div
        style={{
          height: '12px',
          borderRadius: '6px',
          overflow: 'hidden',
          display: 'flex',
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            width: `${(stats.gradeA / stats.total) * 100}%`,
            background: GRADE_COLORS.A.fill,
          }}
        />
        <div
          style={{
            width: `${(stats.gradeB / stats.total) * 100}%`,
            background: GRADE_COLORS.B.fill,
          }}
        />
        <div
          style={{
            width: `${(stats.neutral / stats.total) * 100}%`,
            background: GRADE_COLORS.Neutral.fill,
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
        <span style={{ color: GRADE_COLORS.A.fill }}>A: {stats.gradeA}</span>
        <span style={{ color: GRADE_COLORS.B.fill }}>B: {stats.gradeB}</span>
        <span style={{ color: GRADE_COLORS.Neutral.fill }}>N: {stats.neutral}</span>
      </div>
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default CompatibilityCalendarHeatmap;
