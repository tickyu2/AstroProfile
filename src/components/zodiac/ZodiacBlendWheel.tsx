/**
 * ZodiacBlendWheel.tsx
 * ====================
 *
 * D3-powered React component for visualizing zodiac sign blending
 * with golden ratio cusp curves. Features dual-ring design with
 * breathing animation, radial gradients, and interactive exploration.
 *
 * ENHANCEMENTS:
 * 1. Today marker - Radial line highlighting current day
 * 2. Birth date indicator - Shows user's natal position
 * 3. Click to select - For exploring other people's birth dates
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import {
  generateYearBlend,
  getBlendForDate,
  DayBlend,
  ZodiacSign,
  SIGN_GLYPHS,
  SIGN_ELEMENTS,
  ELEMENT_COLORS,
  SIGN_RANGES,
  getActiveElements,
  getDominantElement,
  ELEMENT_EMOJIS,
} from '../../data/zodiacBlendData';
import { ELEMENT_INTERPRETATION } from '../../data/zodiacExplanationEngine';
import {
  CompatibilityHighlight,
  CompatibilityGrade,
  GRADE_COLORS,
} from '../../data/compatibilityTypes';

// =============================================================================
// TYPES
// =============================================================================

interface ZodiacBlendWheelProps {
  /** Year to display (defaults to current year) */
  year?: number;
  /** SVG width in pixels */
  width?: number;
  /** SVG height in pixels */
  height?: number;
  /** Show today marker (radial golden line) */
  showTodayMarker?: boolean;
  /** User's birth date for natal indicator ("YYYY-MM-DD") */
  birthDate?: string;
  /** Currently selected/explored date ("YYYY-MM-DD") */
  selectedDate?: string;
  /** Callback when a day is clicked for exploration */
  onDaySelect?: (day: DayBlend) => void;
  /** Callback when mouse hovers over a day (for learning panel) */
  onDayHover?: (day: DayBlend | null) => void;
  /** Callback when selection is cleared */
  onClearSelection?: () => void;
  /** Enable interactive mode (click to explore) */
  interactive?: boolean;
  /** Show breathing animation */
  animate?: boolean;
  /** Hide built-in tooltip (when using external explanation panel) */
  hideTooltip?: boolean;
  /** Custom class name */
  className?: string;
  /** Enable compatibility highlighting mode */
  compatibilityMode?: boolean;
  /** Map of date -> compatibility highlight (for coloring wheel) */
  compatibilityHighlights?: Map<string, CompatibilityHighlight>;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  day: DayBlend | null;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;

// Ring dimensions (as percentages of radius)
const INNER_RING_OUTER = 0.75;
const INNER_RING_INNER = 0.55;
const OUTER_RING_OUTER = 0.88;
const OUTER_RING_INNER = 0.77;
const GLYPH_RADIUS = 0.45;
const MONTH_TICK_RADIUS = 0.92;

// Marker colors
const TODAY_MARKER_COLOR = '#ffd700';      // Golden for today
const BIRTH_MARKER_COLOR = '#ff6b9d';      // Rose pink for birth
const SELECTED_MARKER_COLOR = '#00d4ff';   // Cyan for selected/exploring

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get element color for a sign
 */
function getSignColor(sign: ZodiacSign): string {
  const element = SIGN_ELEMENTS[sign];
  return ELEMENT_COLORS[element];
}

/**
 * Convert day of year to angle (radians) for Math.cos/sin positioning
 * Uses standard math convention: 0 = right (3 o'clock), counter-clockwise
 * With -π/2 offset to put Aries at top (12 o'clock)
 * @param offset - day offset (Aries start day - 1) to rotate wheel
 */
function dayToAngle(dayOfYear: number, totalDays: number, offset: number = 0): number {
  return ((dayOfYear - 1 - offset) / totalDays) * 2 * Math.PI - Math.PI / 2;
}

/**
 * Convert day of year to angle for D3 arc generator
 * D3 arc convention: 0 = top (12 o'clock), clockwise
 * @param offset - day offset (Aries start day - 1) to rotate wheel
 */
function dayToArcAngle(dayOfYear: number, totalDays: number, offset: number = 0): number {
  return ((dayOfYear - 1 - offset) / totalDays) * 2 * Math.PI;
}

/**
 * Get day of year from a date string
 */
function getDayOfYear(dateStr: string): number {
  const date = new Date(dateStr);
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Check if date string is valid
 */
function isValidDate(dateStr: string | undefined): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Format date for display (no year - zodiac dates are the same every year)
 * Parse manually to avoid timezone shift (ISO dates parsed as UTC)
 */
function formatDateDisplay(dateStr: string): string {
  const [, month, day] = dateStr.split('-').map(Number);
  const date = new Date(2000, month - 1, day); // Year doesn't matter
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// =============================================================================
// COMPONENT
// =============================================================================

export const ZodiacBlendWheel: React.FC<ZodiacBlendWheelProps> = ({
  year = new Date().getFullYear(),
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  showTodayMarker = true,
  birthDate,
  selectedDate,
  onDaySelect,
  onDayHover,
  onClearSelection,
  interactive = true,
  animate = true,
  hideTooltip = false,
  className = '',
  compatibilityMode = false,
  compatibilityHighlights,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    day: null,
  });

  // Generate year data
  const yearData = useMemo(() => generateYearBlend(year), [year]);
  const totalDays = yearData.length;

  // Get today's data
  const todayData = useMemo(() => {
    const today = new Date();
    if (today.getFullYear() !== year) return null;
    const dateStr = today.toISOString().split('T')[0];
    return yearData.find(d => d.date === dateStr) || null;
  }, [year, yearData]);

  // Get birth date data
  const birthData = useMemo(() => {
    if (!isValidDate(birthDate)) return null;
    // Create a date in the current year for positioning
    const birth = new Date(birthDate!);
    const yearDateStr = `${year}-${String(birth.getMonth() + 1).padStart(2, '0')}-${String(birth.getDate()).padStart(2, '0')}`;
    return yearData.find(d => d.date === yearDateStr) || null;
  }, [birthDate, year, yearData]);

  // Get selected date data
  const selectedData = useMemo(() => {
    if (!isValidDate(selectedDate)) return null;
    const selected = new Date(selectedDate!);
    const yearDateStr = `${year}-${String(selected.getMonth() + 1).padStart(2, '0')}-${String(selected.getDate()).padStart(2, '0')}`;
    return yearData.find(d => d.date === yearDateStr) || null;
  }, [selectedDate, year, yearData]);

  // Handle day click
  const handleDayClick = useCallback((day: DayBlend) => {
    if (interactive && onDaySelect && day && day.date && day.primarySign) {
      onDaySelect(day);
    } else if (interactive && onDaySelect && (!day || !day.date || !day.primarySign)) {
      console.warn('ZodiacBlendWheel: Invalid day object on click', day);
    }
  }, [interactive, onDaySelect]);

  // =============================================================================
  // D3 RENDERING
  // =============================================================================

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const cx = width / 2;
    const cy = height / 2;
    // Reduced radius to leave room for zodiac sign names outside the wheel
    // Increased ring size by ~20% total for easier interaction
    const radius = Math.min(cx, cy) - 35;

    // Aries-at-top: offset so Aries (Mar 21) sits at 12 o'clock
    const ariesStartDay = getDayOfYear(`${year}-03-21`);
    const ariesOffset = ariesStartDay - 1;

    // Create defs for gradients
    const defs = svg.append('defs');

    // Create radial gradients for each element
    Object.entries(ELEMENT_COLORS).forEach(([element, color]) => {
      const gradient = defs.append('radialGradient')
        .attr('id', `gradient-${element}`)
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0.9);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0.5);
    });

    // Create glow filter for markers
    const glowFilter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');

    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Translation group (positioning) - separate from animation
    const translateGroup = svg.append('g')
      .attr('transform', `translate(${cx}, ${cy})`);

    // Main group with breathing animation (nested inside translate group)
    const mainGroup = translateGroup.append('g')
      .attr('class', animate ? 'breathing' : '');

    // Arc generator for inner ring (primary sign)
    // Uses dayToArcAngle for D3's angle convention (0 = top, clockwise)
    const innerArc = d3.arc<DayBlend>()
      .innerRadius(radius * INNER_RING_INNER)
      .outerRadius(radius * INNER_RING_OUTER)
      .startAngle(d => dayToArcAngle(d.dayOfYear, totalDays, ariesOffset))
      .endAngle(d => dayToArcAngle(d.dayOfYear + 1, totalDays, ariesOffset))
      .padAngle(0.002);

    // Arc generator for outer ring (blend halo)
    // Uses dayToArcAngle for D3's angle convention (0 = top, clockwise)
    const outerArc = d3.arc<DayBlend>()
      .innerRadius(radius * OUTER_RING_INNER)
      .outerRadius(d => {
        // Modulate outer radius based on blend intensity
        const blendScale = d.blendPercent * 0.05;
        return radius * (OUTER_RING_OUTER + blendScale);
      })
      .startAngle(d => dayToArcAngle(d.dayOfYear, totalDays, ariesOffset))
      .endAngle(d => dayToArcAngle(d.dayOfYear + 1, totalDays, ariesOffset))
      .padAngle(0.001);

    // Draw outer blend ring first (behind)
    const outerRing = mainGroup.append('g').attr('class', 'outer-ring');

    outerRing.selectAll('path.blend-arc')
      .data(yearData.filter(d => d.blendSign !== null))
      .enter()
      .append('path')
      .attr('class', 'blend-arc')
      .attr('d', outerArc as any)
      .attr('fill', d => {
        const element = SIGN_ELEMENTS[d.blendSign!];
        return `url(#gradient-${element})`;
      })
      .attr('opacity', d => 0.3 + d.blendPercent * 0.5)
      .attr('pointer-events', 'none'); // Ensure outer ring doesn't capture mouse events

    // Draw inner primary ring
    const innerRing = mainGroup.append('g').attr('class', 'inner-ring');

    // Helper to get compatibility-based fill color
    const getArcFill = (d: DayBlend) => {
      if (compatibilityMode && compatibilityHighlights) {
        const highlight = compatibilityHighlights.get(d.date);
        if (highlight) {
          const gradeColor = GRADE_COLORS[highlight.grade];
          return gradeColor.fill;
        }
      }
      // Default: use element gradient
      const element = SIGN_ELEMENTS[d.primarySign];
      return `url(#gradient-${element})`;
    };

    // Helper to get compatibility-based opacity
    const getArcOpacity = (d: DayBlend) => {
      if (compatibilityMode && compatibilityHighlights) {
        const highlight = compatibilityHighlights.get(d.date);
        if (highlight) {
          return GRADE_COLORS[highlight.grade].opacity;
        }
        return 0.3; // Dim non-highlighted days
      }
      return 1;
    };

    innerRing.selectAll('path.day-arc')
      .data(yearData)
      .enter()
      .append('path')
      .attr('class', 'day-arc')
      .attr('d', innerArc as any)
      .attr('fill', getArcFill)
      .attr('opacity', getArcOpacity)
      .attr('stroke', '#1a1a2e')
      .attr('stroke-width', 0.5)
      .attr('cursor', interactive ? 'pointer' : 'default')
      .on('mouseenter', function(event, d) {
        const baseOpacity = getArcOpacity(d);
        d3.select(this).attr('opacity', Math.min(1, baseOpacity + 0.2));
        // Use getBoundingClientRect for accurate tooltip positioning
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (svgRect) {
          const x = event.clientX - svgRect.left;
          const y = event.clientY - svgRect.top;
          setTooltip({ visible: true, x, y, day: d });
        }
        // Call external hover callback for learning panel
        if (onDayHover) onDayHover(d);
      })
      .on('mouseleave', function(event, d) {
        d3.select(this).attr('opacity', getArcOpacity(d));
        setTooltip(prev => ({ ...prev, visible: false }));
        // Clear external hover
        if (onDayHover) onDayHover(null);
      })
      .on('click', function(event, d) {
        handleDayClick(d);
      });

    // ==========================================================================
    // SIGN GLYPHS
    // ==========================================================================

    const glyphGroup = mainGroup.append('g').attr('class', 'glyphs');

    SIGN_RANGES.forEach((range, index) => {
      // Calculate midpoint angle for the sign
      const startDay = getDayOfYear(`${year}-${String(range.start.month).padStart(2, '0')}-${String(range.start.day).padStart(2, '0')}`);
      const endDay = getDayOfYear(`${year}-${String(range.end.month).padStart(2, '0')}-${String(range.end.day).padStart(2, '0')}`);

      let midDay: number;
      if (range.sign === 'Capricorn') {
        // Handle year wrap
        midDay = startDay + 15;
        if (midDay > totalDays) midDay -= totalDays;
      } else {
        midDay = Math.floor((startDay + endDay) / 2);
      }

      const angle = dayToAngle(midDay, totalDays, ariesOffset);
      const x = Math.cos(angle) * radius * GLYPH_RADIUS;
      const y = Math.sin(angle) * radius * GLYPH_RADIUS;

      glyphGroup.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '24px')
        .attr('fill', getSignColor(range.sign))
        .attr('filter', 'url(#glow)')
        .text(SIGN_GLYPHS[range.sign]);
    });

    // ==========================================================================
    // MONTH TICKS
    // ==========================================================================

    const tickGroup = mainGroup.append('g').attr('class', 'month-ticks');

    MONTH_NAMES.forEach((month, index) => {
      const firstOfMonth = getDayOfYear(`${year}-${String(index + 1).padStart(2, '0')}-01`);
      const angle = dayToAngle(firstOfMonth, totalDays, ariesOffset);

      const x1 = Math.cos(angle) * radius * OUTER_RING_OUTER;
      const y1 = Math.sin(angle) * radius * OUTER_RING_OUTER;
      const x2 = Math.cos(angle) * radius * MONTH_TICK_RADIUS;
      const y2 = Math.sin(angle) * radius * MONTH_TICK_RADIUS;
      const xText = Math.cos(angle) * radius * 0.97;
      const yText = Math.sin(angle) * radius * 0.97;

      tickGroup.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', '#555')
        .attr('stroke-width', 1);

      tickGroup.append('text')
        .attr('x', xText)
        .attr('y', yText)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '13px')
        .attr('font-weight', '500')
        .attr('fill', '#aaa')
        .text(month);
    });

    // ==========================================================================
    // ZODIAC SIGN NAMES (outside wheel, like pie chart labels)
    // ==========================================================================

    const signNameGroup = mainGroup.append('g').attr('class', 'sign-names');
    const SIGN_NAME_RADIUS = 1.04; // Position outside the wheel (reduced further to fit all labels)

    SIGN_RANGES.forEach((range) => {
      // Calculate midpoint angle for the sign
      const startDay = getDayOfYear(`${year}-${String(range.start.month).padStart(2, '0')}-${String(range.start.day).padStart(2, '0')}`);
      const endDay = getDayOfYear(`${year}-${String(range.end.month).padStart(2, '0')}-${String(range.end.day).padStart(2, '0')}`);

      let midDay: number;
      if (range.sign === 'Capricorn') {
        // Handle year wrap
        midDay = startDay + 15;
        if (midDay > totalDays) midDay -= totalDays;
      } else {
        midDay = Math.floor((startDay + endDay) / 2);
      }

      const angle = dayToAngle(midDay, totalDays, ariesOffset);
      const x = Math.cos(angle) * radius * SIGN_NAME_RADIUS;
      const y = Math.sin(angle) * radius * SIGN_NAME_RADIUS;

      // Calculate text anchor based on position (left/right side of wheel)
      const angleDeg = (angle * 180 / Math.PI + 360) % 360;
      let textAnchor = 'middle';
      if (angleDeg > 45 && angleDeg < 135) {
        textAnchor = 'middle'; // bottom
      } else if (angleDeg >= 135 && angleDeg <= 225) {
        textAnchor = 'end'; // left side
      } else if (angleDeg > 225 && angleDeg < 315) {
        textAnchor = 'middle'; // top
      } else {
        textAnchor = 'start'; // right side
      }

      // Draw connecting line from wheel edge to label
      const lineStartX = Math.cos(angle) * radius * OUTER_RING_OUTER;
      const lineStartY = Math.sin(angle) * radius * OUTER_RING_OUTER;
      const lineEndX = Math.cos(angle) * radius * (SIGN_NAME_RADIUS - 0.03);
      const lineEndY = Math.sin(angle) * radius * (SIGN_NAME_RADIUS - 0.03);

      signNameGroup.append('line')
        .attr('x1', lineStartX)
        .attr('y1', lineStartY)
        .attr('x2', lineEndX)
        .attr('y2', lineEndY)
        .attr('stroke', getSignColor(range.sign))
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.5);

      // Small circle at the end of the line
      signNameGroup.append('circle')
        .attr('cx', lineEndX)
        .attr('cy', lineEndY)
        .attr('r', 3)
        .attr('fill', getSignColor(range.sign));

      // Sign name text
      signNameGroup.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', textAnchor)
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '11px')
        .attr('font-weight', '500')
        .attr('fill', getSignColor(range.sign))
        .text(range.sign);
    });

    // ==========================================================================
    // BIRTH DATE INDICATOR
    // ==========================================================================

    if (birthData) {
      const birthGroup = mainGroup.append('g').attr('class', 'birth-marker');
      const angle = dayToAngle(birthData.dayOfYear, totalDays, ariesOffset);

      // Radial line
      const x1 = Math.cos(angle) * radius * INNER_RING_INNER;
      const y1 = Math.sin(angle) * radius * INNER_RING_INNER;
      const x2 = Math.cos(angle) * radius * OUTER_RING_OUTER;
      const y2 = Math.sin(angle) * radius * OUTER_RING_OUTER;

      birthGroup.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', BIRTH_MARKER_COLOR)
        .attr('stroke-width', 2.5)
        .attr('filter', 'url(#glow)')
        .attr('stroke-dasharray', '4,2');

      // Star marker for birth
      const starX = Math.cos(angle) * radius * GLYPH_RADIUS;
      const starY = Math.sin(angle) * radius * GLYPH_RADIUS;

      birthGroup.append('text')
        .attr('x', starX)
        .attr('y', starY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '18px')
        .attr('fill', BIRTH_MARKER_COLOR)
        .attr('filter', 'url(#glow)')
        .text('★');

      // "BIRTH" label
      const labelX = Math.cos(angle) * radius * 1.08;
      const labelY = Math.sin(angle) * radius * 1.08;

      birthGroup.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '9px')
        .attr('font-weight', 'bold')
        .attr('fill', BIRTH_MARKER_COLOR)
        .text('BIRTH');
    }

    // ==========================================================================
    // ENHANCEMENT #3: SELECTED DATE MARKER (for exploring others)
    // ==========================================================================

    if (selectedData) {
      const selectGroup = mainGroup.append('g').attr('class', 'selected-marker');
      const angle = dayToAngle(selectedData.dayOfYear, totalDays, ariesOffset);

      // Animated pulsing ring
      const pulseX = Math.cos(angle) * radius * ((INNER_RING_INNER + INNER_RING_OUTER) / 2);
      const pulseY = Math.sin(angle) * radius * ((INNER_RING_INNER + INNER_RING_OUTER) / 2);

      selectGroup.append('circle')
        .attr('cx', pulseX)
        .attr('cy', pulseY)
        .attr('r', 12)
        .attr('fill', 'none')
        .attr('stroke', SELECTED_MARKER_COLOR)
        .attr('stroke-width', 3)
        .attr('filter', 'url(#glow)')
        .attr('class', 'pulse-ring');

      // Inner dot
      selectGroup.append('circle')
        .attr('cx', pulseX)
        .attr('cy', pulseY)
        .attr('r', 5)
        .attr('fill', SELECTED_MARKER_COLOR)
        .attr('filter', 'url(#glow)');

      // Radial line
      const x1 = Math.cos(angle) * radius * 0.3;
      const y1 = Math.sin(angle) * radius * 0.3;
      const x2 = Math.cos(angle) * radius * OUTER_RING_OUTER;
      const y2 = Math.sin(angle) * radius * OUTER_RING_OUTER;

      selectGroup.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', SELECTED_MARKER_COLOR)
        .attr('stroke-width', 2)
        .attr('filter', 'url(#glow)')
        .attr('stroke-dasharray', '6,3');

      // "EXPLORING" label
      const labelX = Math.cos(angle) * radius * 1.08;
      const labelY = Math.sin(angle) * radius * 1.08;

      selectGroup.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '9px')
        .attr('font-weight', 'bold')
        .attr('fill', SELECTED_MARKER_COLOR)
        .text('EXPLORING');
    }

  }, [year, width, height, yearData, totalDays, todayData, birthData, selectedData, interactive, animate, handleDayClick, showTodayMarker, onDayHover, compatibilityMode, compatibilityHighlights]);

  // =============================================================================
  // RENDER
  // =============================================================================

  // Handle mouse leaving the wheel area - hide tooltip
  const handleMouseLeave = useCallback(() => {
    setTooltip(prev => ({ ...prev, visible: false }));
    if (onDayHover) onDayHover(null);
  }, [onDayHover]);

  return (
    <div
      className={`zodiac-blend-wheel-container ${className}`}
      style={{ position: 'relative', width, height }}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ background: 'transparent', display: 'block' }}
      />

      {/* Tooltip (hidden when using external explanation panel) */}
      {!hideTooltip && tooltip.visible && tooltip.day && (
        <div
          className="zodiac-tooltip"
          style={{
            position: 'absolute',
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            background: 'rgba(26, 26, 46, 0.95)',
            border: `2px solid ${getSignColor(tooltip.day.primarySign)}`,
            borderRadius: '8px',
            padding: '12px',
            pointerEvents: 'none',
            zIndex: 100,
            minWidth: '180px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#fff' }}>
            {formatDateDisplay(tooltip.day.date)}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '20px' }}>{SIGN_GLYPHS[tooltip.day.primarySign]}</span>
            <span style={{ color: getSignColor(tooltip.day.primarySign), fontWeight: 'bold' }}>
              {tooltip.day.primarySign}
            </span>
          </div>

          {tooltip.day.blendSign && (
            <div style={{ fontSize: '12px', color: '#aaa' }}>
              <div style={{ marginBottom: '4px' }}>
                {tooltip.day.cuspType === 'backward' ? 'Emerging from' : 'Transitioning to'}{' '}
                <span style={{ color: getSignColor(tooltip.day.blendSign) }}>
                  {tooltip.day.blendSign}
                </span>
              </div>

              {/* Mini blend timeline */}
              <div style={{
                display: 'flex',
                height: '6px',
                borderRadius: '3px',
                overflow: 'hidden',
                marginTop: '8px',
              }}>
                <div style={{
                  width: `${(1 - tooltip.day.blendPercent) * 100}%`,
                  background: getSignColor(tooltip.day.primarySign),
                }} />
                <div style={{
                  width: `${tooltip.day.blendPercent * 100}%`,
                  background: getSignColor(tooltip.day.blendSign),
                }} />
              </div>
              <div style={{ fontSize: '10px', marginTop: '4px', textAlign: 'right' }}>
                {Math.round(tooltip.day.blendPercent * 100)}% {tooltip.day.blendSign}
              </div>
            </div>
          )}

          {/* Elemental Balance - compact display */}
          {(() => {
            const activeElements = getActiveElements(tooltip.day);
            const dominant = getDominantElement(tooltip.day);
            const interpretation = ELEMENT_INTERPRETATION[dominant.element];
            return (
              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '10px', color: '#666', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Elements
                </div>
                {/* Mini elemental bar */}
                <div style={{ display: 'flex', height: '4px', borderRadius: '2px', overflow: 'hidden', marginBottom: '6px' }}>
                  {activeElements.map(({ element, percent }) => (
                    <div
                      key={element}
                      style={{
                        width: `${percent * 100}%`,
                        background: element === 'fire' ? '#e74c3c' : element === 'earth' ? '#27ae60' : element === 'air' ? '#3498db' : '#9b59b6',
                      }}
                    />
                  ))}
                </div>
                {/* Element badges */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  {activeElements.map(({ element, emoji, percent }) => (
                    <span key={element} style={{ fontSize: '10px', color: percent > 0.5 ? '#fff' : '#888' }}>
                      {emoji} {Math.round(percent * 100)}%
                    </span>
                  ))}
                </div>
                {/* Dominant element interpretation */}
                <div style={{ fontSize: '10px', color: '#aaa', fontStyle: 'italic', lineHeight: '1.4' }}>
                  {interpretation?.short || `${dominant.elementName} energy is active.`}
                </div>
              </div>
            );
          })()}

          {interactive && (
            <div style={{ fontSize: '10px', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
              Click to explore this date
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        display: 'flex',
        gap: '16px',
        fontSize: '10px',
      }}>
        {birthData && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: 12, height: 3, background: BIRTH_MARKER_COLOR, borderRadius: 2 }} />
            <span style={{ color: BIRTH_MARKER_COLOR }}>Birth</span>
          </div>
        )}
        {selectedData && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: 12, height: 3, background: SELECTED_MARKER_COLOR, borderRadius: 2 }} />
            <span style={{ color: SELECTED_MARKER_COLOR }}>Selected</span>
          </div>
        )}
      </div>

      {/* Clear selection button */}
      {selectedData && onClearSelection && (
        <button
          onClick={onClearSelection}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(26, 26, 46, 0.9)',
            border: `1px solid ${SELECTED_MARKER_COLOR}`,
            borderRadius: '4px',
            padding: '6px 12px',
            color: SELECTED_MARKER_COLOR,
            fontSize: '11px',
            cursor: 'pointer',
          }}
        >
          Clear Selection
        </button>
      )}

      {/* CSS for animations */}
      <style>{`
        .breathing {
          animation: breathe 6s ease-in-out infinite;
          transform-origin: center center;
        }

        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .pulse-ring {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.5;
          }
        }

        .zodiac-tooltip {
          transition: opacity 0.2s ease;
        }
      `}</style>
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default ZodiacBlendWheel;
