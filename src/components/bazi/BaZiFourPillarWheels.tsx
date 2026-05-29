/**
 * BaZi Four Pillar Wheels
 *
 * Interactive rotating wheels with element-colored segments,
 * Yin/Yang brightness tinting, hover tooltips, seasonal wash,
 * and energy flow visualization.
 */

import React, { useRef, useCallback, useEffect, useMemo, useState } from 'react';
import {
  STEM_SEGMENTS,
  BRANCH_SEGMENTS,
  STEM_SLOT_DEG,
  BRANCH_SLOT_DEG,
  ELEMENT_COLORS,
  ELEMENT_GLYPHS,
  POLARITY_ICONS,
  POLARITY_TINT,
  PILLAR_LABELS,
  PILLAR_CHINESE,
  PILLAR_KEYS,
  SEASON_COLORS,
  HIDDEN_STEMS,
  getSeasonFromMonthBranch,
  getSeasonalStrength,
  getElementRelation,
  RELATION_COLORS,
  RELATION_LABELS,
  arcPath,
  segmentCenter,
  shiftDateBy,
  buildStemTooltip,
  buildBranchTooltip,
  getTenGod,
  buildHiddenStemStory,
  DAY_MASTER_DESCRIPTIONS,
  type HiddenStemData,
  type TenGodInfo,
  type TstBreakdown,
} from '../../utils/baziWheels';
import { getSeasonalWeights } from '../../utils/baziSeasonality';

// =============================================================================
// SEASONAL ELEMENT WEIGHTING REFERENCE DATA
// =============================================================================
const SEASONAL_REFERENCE = [
  {
    season: 'Spring', emoji: '🌸', chinese: '春',
    branches: [
      { char: '寅', animal: 'Tiger', polarity: 'Yang', element: 'Wood', term: '立春 Spring Begins' },
      { char: '卯', animal: 'Rabbit', polarity: 'Yin', element: 'Wood', term: '驚蟄 Insects Awaken' },
      { char: '辰', animal: 'Dragon', polarity: 'Yang', element: 'Earth', term: '清明 Clear & Bright', earthTransition: true }
    ]
  },
  {
    season: 'Summer', emoji: '☀️', chinese: '夏',
    branches: [
      { char: '巳', animal: 'Snake', polarity: 'Yin', element: 'Fire', term: '立夏 Summer Begins' },
      { char: '午', animal: 'Horse', polarity: 'Yang', element: 'Fire', term: '芒種 Grain in Ear' },
      { char: '未', animal: 'Goat', polarity: 'Yin', element: 'Earth', term: '小暑 Slight Heat', earthTransition: true }
    ]
  },
  {
    season: 'Autumn', emoji: '🍂', chinese: '秋',
    branches: [
      { char: '申', animal: 'Monkey', polarity: 'Yang', element: 'Metal', term: '立秋 Autumn Begins' },
      { char: '酉', animal: 'Rooster', polarity: 'Yin', element: 'Metal', term: '白露 White Dew' },
      { char: '戌', animal: 'Dog', polarity: 'Yang', element: 'Earth', term: '寒露 Cold Dew', earthTransition: true }
    ]
  },
  {
    season: 'Winter', emoji: '❄️', chinese: '冬',
    branches: [
      { char: '亥', animal: 'Pig', polarity: 'Yin', element: 'Water', term: '立冬 Winter Begins' },
      { char: '子', animal: 'Rat', polarity: 'Yang', element: 'Water', term: '大雪 Heavy Snow' },
      { char: '丑', animal: 'Ox', polarity: 'Yin', element: 'Earth', term: '小寒 Slight Cold', earthTransition: true }
    ]
  }
];

const SW_ELEM_COLORS: Record<string, string> = {
  wood: '#22c55e', fire: '#ef4444', earth: '#f59e0b', metal: '#d4d4d8', water: '#3b82f6'
};

// =============================================================================
// SOLAR TERM BOUNDARY TYPES
// =============================================================================

/** A single solar term boundary with exact UTC time from the API */
interface SolarTermBoundary {
  isoString: string;
  name: string;       // Chinese name
  english: string;
  date: Date;
}

/** Boundary navigation data for one pillar */
interface PillarBoundaryNav {
  current: SolarTermBoundary;
  prev: SolarTermBoundary;
  next: SolarTermBoundary;
  displayTime: string;
  displayTimeEnd?: string;   // end of period (month only)
  timezoneLabel: string;
}

// =============================================================================
// CSS ANIMATIONS (injected once)
// =============================================================================

const WHEEL_KEYFRAMES = `
@keyframes bazi-flow-dot {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.8; }
}
@keyframes bazi-season-fade {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
@keyframes bazi-root-grow {
  0% { opacity: 0; stroke-dashoffset: 20; }
  100% { opacity: 1; stroke-dashoffset: 0; }
}
@keyframes bazi-hs-resonance {
  0% { opacity: 0.3; }
  30% { opacity: 1; }
  100% { opacity: 1; }
}
.bazi-today-btn:active {
  background: rgba(251, 191, 36, 0.35) !important;
  transform: scale(0.95);
}
.bazi-today-btn:hover {
  background: rgba(251, 191, 36, 0.22) !important;
}
`;

let _stylesInjected = false;
function ensureStyles() {
  if (_stylesInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.textContent = WHEEL_KEYFRAMES;
  document.head.appendChild(el);
  _stylesInjected = true;
}

// =============================================================================
// ENRICHED SEGMENT TYPE
// =============================================================================

interface EnrichedSegment {
  char: string;
  element: string;
  polarity: 'Yang' | 'Yin';
  glyph: string;
  polarityIcon: string;
  tooltip: string;
  hiddenStems?: HiddenStemData[];
}

// =============================================================================
// ENERGY FLOW BAR
// =============================================================================

interface EnergyFlowBarProps {
  pillars: Array<{
    stem: { index: number; char: string; element: string };
    branch: { index: number; char: string; element: string };
  }>;
}

const EnergyFlowBar: React.FC<EnergyFlowBarProps> = ({ pillars }) => {
  const w = 360;
  const h = 52;
  const dotR = 14;
  const gap = (w - 40) / 3;
  const x0 = 20;
  const cy = 22;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Connecting lines */}
        {pillars.slice(0, -1).map((p, i) => {
          const ax = x0 + i * gap + dotR;
          const bx = x0 + (i + 1) * gap - dotR;
          const c1 = ELEMENT_COLORS[p.stem.element] || '#64748b';
          const c2 = ELEMENT_COLORS[pillars[i + 1].stem.element] || '#64748b';
          const gid = `efg-${i}`;
          return (
            <React.Fragment key={`l-${i}`}>
              <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={c1} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={c2} stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <line x1={ax} y1={cy} x2={bx} y2={cy} stroke={`url(#${gid})`} strokeWidth={2} strokeDasharray="4 3" />
              <circle
                cx={(ax + bx) / 2} cy={cy} r={2.5}
                fill={c1} opacity={0.5}
                style={{ animation: `bazi-flow-dot 2s ease-in-out ${i * 0.5}s infinite` }}
              />
            </React.Fragment>
          );
        })}

        {/* Element dots */}
        {pillars.map((p, i) => {
          const x = x0 + i * gap;
          const col = ELEMENT_COLORS[p.stem.element] || '#64748b';
          const isDay = i === 2;
          const r = isDay ? dotR + 2 : dotR;
          return (
            <g key={`d-${i}`}>
              {isDay && <circle cx={x} cy={cy} r={r + 4} fill={col} opacity={0.12} />}
              <circle cx={x} cy={cy} r={r} fill={col} fillOpacity={0.18} stroke={col} strokeWidth={isDay ? 2 : 1.5} />
              <text
                x={x} y={cy}
                textAnchor="middle" dominantBaseline="middle"
                style={{
                  fontSize: isDay ? '12px' : '10px',
                  fontWeight: isDay ? 700 : 500,
                  fill: '#fff',
                  fontFamily: "'Noto Sans SC', serif",
                }}
              >
                {ELEMENT_GLYPHS[p.stem.element]}
              </text>
              <text
                x={x} y={cy + r + 9}
                textAnchor="middle" dominantBaseline="middle"
                style={{ fontSize: '8px', fill: '#cbd5e1' }}
              >
                {PILLAR_LABELS[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// =============================================================================
// SEGMENTED WHEEL (Enhanced)
// =============================================================================

interface SegmentedWheelProps {
  wheelId: string;
  segmentCount: number;
  segments: EnrichedSegment[];
  activeIndex: number;
  size: number;
  slotDeg: number;
  cumulativeRotation: number;
  onSegmentClick?: (segmentIdx: number) => void;
  selectedIdx?: number | null;
  season?: string;
  dayMasterElement?: string;
  disabledIndices?: Set<number>;
}

const SegmentedWheel: React.FC<SegmentedWheelProps> = ({
  wheelId,
  segmentCount,
  segments,
  activeIndex,
  size,
  slotDeg,
  cumulativeRotation,
  onSegmentClick,
  selectedIdx,
  season,
  dayMasterElement,
  disabledIndices,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.46;
  const innerR = size * 0.18;
  const gap = 0.8;
  const glowId = `glow-${wheelId}`;

  const hoveredSeg = hoveredIdx !== null ? segments[hoveredIdx] : null;

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background ring */}
        <circle cx={cx} cy={cy} r={outerR + 2} fill="rgba(15, 23, 42, 0.6)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

        {/* Top indicator triangle */}
        <polygon
          points={`${cx - 6},${cy - outerR - 6} ${cx + 6},${cy - outerR - 6} ${cx},${cy - outerR + 2}`}
          fill="#fbbf24" opacity={0.9}
        />

        {/* Rotating group */}
        <g
          transform={`rotate(${cumulativeRotation}, ${cx}, ${cy})`}
          style={{ transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          {segments.map((seg, i) => {
            const startDeg = i * slotDeg + gap / 2;
            const endDeg = (i + 1) * slotDeg - gap / 2;
            const midDeg = (startDeg + endDeg) / 2;
            const isActive = i === activeIndex;
            const isDisabled = disabledIndices?.has(i) ?? false;
            const isHovered = !isDisabled && i === hoveredIdx;
            const color = ELEMENT_COLORS[seg.element] || '#64748b';
            const tint = POLARITY_TINT[seg.polarity] || 1.0;

            // Text positions at different radii within the segment
            const { x: tx, y: ty } = segmentCenter(cx, cy, innerR, outerR, midDeg);

            const glyphR = innerR * 0.2 + outerR * 0.8;
            const glyphRad = (midDeg - 90) * (Math.PI / 180);
            const gx = cx + glyphR * Math.cos(glyphRad);
            const gy = cy + glyphR * Math.sin(glyphRad);

            const iconR = innerR * 0.8 + outerR * 0.2;
            const iconRad = (midDeg - 90) * (Math.PI / 180);
            const ix = cx + iconR * Math.cos(iconRad);
            const iy = cy + iconR * Math.sin(iconRad);

            const textRot = -cumulativeRotation;
            const baseOpacity = isDisabled ? 0.12 : (isActive ? 0.9 : (isHovered ? 0.7 : 0.5));
            const fillOpacity = baseOpacity * tint;

            return (
              <g key={i} style={isDisabled ? { opacity: 0.25 } : undefined}>
                <path
                  d={arcPath(cx, cy, innerR, outerR, startDeg, endDeg)}
                  fill={color}
                  fillOpacity={fillOpacity}
                  stroke={isDisabled ? 'rgba(255,255,255,0.05)' : (isActive ? '#fbbf24' : (isHovered ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'))}
                  strokeWidth={isActive && !isDisabled ? 2.5 : (isHovered ? 1.5 : 0.8)}
                  filter={isActive && !isDisabled ? `url(#${glowId})` : undefined}
                  style={{ cursor: isDisabled ? 'not-allowed' : 'pointer', transition: 'fill-opacity 0.2s, stroke-width 0.15s' }}
                  onClick={isDisabled ? undefined : () => onSegmentClick?.(i)}
                  onMouseEnter={isDisabled ? undefined : () => setHoveredIdx(i)}
                  onMouseLeave={isDisabled ? undefined : () => setHoveredIdx(null)}
                />
                {/* Main Chinese character */}
                <text
                  x={tx} y={ty}
                  textAnchor="middle" dominantBaseline="middle"
                  transform={`rotate(${textRot}, ${tx}, ${ty})`}
                  style={{
                    fontSize: isActive && !isDisabled ? '16px' : '12px',
                    fontWeight: isActive && !isDisabled ? 700 : 600,
                    fill: isDisabled ? 'rgba(255,255,255,0.2)' : (isActive ? '#fff' : `rgba(255,255,255,${(0.75 + tint * 0.2).toFixed(2)})`),
                    fontFamily: "'Noto Sans SC', serif",
                    pointerEvents: 'none',
                  }}
                >
                  {seg.char}
                </text>
                {/* Element glyph (outer area) */}
                <text
                  x={gx} y={gy}
                  textAnchor="middle" dominantBaseline="middle"
                  transform={`rotate(${textRot}, ${gx}, ${gy})`}
                  style={{
                    fontSize: isActive ? '9px' : '7px',
                    fill: isActive ? color : `rgba(255,255,255,${(0.6 * tint).toFixed(2)})`,
                    fontFamily: "'Noto Sans SC', serif",
                    pointerEvents: 'none',
                  }}
                >
                  {seg.glyph}
                </text>
                {/* Polarity icon (inner area) */}
                <text
                  x={ix} y={iy}
                  textAnchor="middle" dominantBaseline="middle"
                  transform={`rotate(${textRot}, ${ix}, ${iy})`}
                  style={{
                    fontSize: isActive ? '8px' : '6px',
                    fill: isActive ? 'rgba(255,255,255,0.9)' : `rgba(255,255,255,${(0.55 * tint).toFixed(2)})`,
                    pointerEvents: 'none',
                  }}
                >
                  {seg.polarityIcon}
                </text>
                {/* Hidden stem inner ring: arcs + root lines + resonance */}
                {/* Opacity modulated by seasonal strength (I), root lines colored by DM relationship (K) */}
                {seg.hiddenStems && seg.hiddenStems.length > 0 && (() => {
                  const hs = seg.hiddenStems!;
                  const hsOuterR = innerR - 1;
                  const hsInnerR = innerR - 7;
                  const segSpan = endDeg - startDeg;
                  const showDetail = isActive || isHovered;
                  const isSelected = i === selectedIdx;
                  const arcGap = 0.4;
                  const elements: React.ReactNode[] = [];
                  let arcStart = startDeg;
                  hs.forEach((h, di) => {
                    const arcSpan = (h.percentage / 100) * segSpan;
                    const arcEnd = arcStart + arcSpan;
                    const hColor = ELEMENT_COLORS[h.element] || '#64748b';
                    // Seasonal strength modulation (Layer I)
                    const seasonMod = season ? getSeasonalStrength(h.element, season) : 1.0;
                    // Element relationship to Day Master (Layer K)
                    const relation = dayMasterElement ? getElementRelation(dayMasterElement, h.element) : 'unknown';
                    const relationColor = RELATION_COLORS[relation] || RELATION_COLORS.unknown;
                    // Base opacity modulated by season: strong elements glow brighter
                    const baseOp = isSelected ? 0.85 : (showDetail ? 0.65 : 0.2);
                    const seasonalOp = baseOp * (0.4 + 0.6 * seasonMod);
                    // Arc slice
                    elements.push(
                      <path
                        key={`hs-${i}-${di}`}
                        d={arcPath(cx, cy, hsInnerR, hsOuterR, arcStart + arcGap, arcEnd - arcGap)}
                        fill={hColor}
                        fillOpacity={seasonalOp}
                        stroke={showDetail ? 'rgba(255,255,255,0.25)' : 'none'}
                        strokeWidth={0.4}
                        style={{ pointerEvents: 'none', transition: 'fill-opacity 0.35s' }}
                      />
                    );
                    // Root line — colored by relationship to Day Master (Layer K)
                    if (showDetail) {
                      const lineMidDeg = (arcStart + arcEnd) / 2;
                      const rootLen = 6 + (h.percentage / 100) * 8;
                      const rad = (lineMidDeg - 90) * (Math.PI / 180);
                      const lx1 = cx + hsInnerR * Math.cos(rad);
                      const ly1 = cy + hsInnerR * Math.sin(rad);
                      const lx2 = cx + (hsInnerR - rootLen) * Math.cos(rad);
                      const ly2 = cy + (hsInnerR - rootLen) * Math.sin(rad);
                      // Use relation color for root line; thicker for support (resource), dashed for control (power)
                      const isSupport = relation === 'resource' || relation === 'self';
                      const isControl = relation === 'power';
                      elements.push(
                        <line
                          key={`root-${i}-${di}`}
                          x1={lx1} y1={ly1} x2={lx2} y2={ly2}
                          stroke={dayMasterElement ? relationColor : hColor}
                          strokeWidth={isSupport ? 1.8 : (isControl ? 1.0 : 1.2)}
                          strokeLinecap="round"
                          strokeDasharray={isControl ? '3 2' : '20'}
                          opacity={(0.25 + h.percentage / 200) * seasonMod}
                          style={{
                            pointerEvents: 'none',
                            animation: 'bazi-root-grow 0.5s ease-out forwards',
                          }}
                        />
                      );
                    }
                    arcStart = arcEnd;
                  });
                  // Wrap in group with resonance pulse for active segment
                  return (
                    <g
                      key={isActive ? `hs-active-${activeIndex}` : `hs-static-${i}`}
                      style={isActive ? { animation: 'bazi-hs-resonance 0.4s ease-out' } : undefined}
                    >
                      {elements}
                    </g>
                  );
                })()}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Hover tooltip */}
      {hoveredSeg && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '4px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: `1px solid ${ELEMENT_COLORS[hoveredSeg.element] || '#64748b'}`,
          borderRadius: '8px',
          padding: '6px 10px',
          whiteSpace: 'pre-line',
          fontSize: '11px',
          color: '#e2e8f0',
          lineHeight: 1.5,
          zIndex: 10,
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          minWidth: '140px',
          textAlign: 'center',
        }}>
          {hoveredSeg.tooltip}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// ZANG GAN PANEL (Hidden Stem Strength Meters)
// =============================================================================

interface ZangGanPanelProps {
  branchIdx: number;
  onClose: () => void;
  dayMasterElement?: string;
  dayMasterPolarity?: string;
  season?: string;
}

const ZangGanPanel: React.FC<ZangGanPanelProps> = ({ branchIdx, onClose, dayMasterElement, dayMasterPolarity, season }) => {
  const [storyIdx, setStoryIdx] = useState<number | null>(null);
  const branch = BRANCH_SEGMENTS[branchIdx];
  const hidden = HIDDEN_STEMS[branchIdx];
  if (!branch || !hidden) return null;

  const QI_LABELS = ['本气 Main Qi', '中气 Mid Qi', '余气 Residual Qi'];

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.92)',
      border: `1px solid ${ELEMENT_COLORS[branch.element]}50`,
      borderRadius: '10px',
      padding: '12px 16px',
      margin: '4px 60px',
      animation: 'bazi-season-fade 0.2s ease-out',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0' }}>
          <span style={{ fontFamily: "'Noto Sans SC', serif", fontSize: '16px', color: ELEMENT_COLORS[branch.element], marginRight: '6px' }}>
            {branch.char}
          </span>
          <span>{branch.pinyin} — {branch.animal}</span>
          <span style={{ marginLeft: '8px', fontSize: '11px', color: '#cbd5e1', fontWeight: 400 }}>
            Hidden Stems (藏干)
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '6px',
            lineHeight: 1.4,
          }}
        >
          ✕
        </button>
      </div>

      {/* Strength meter bars — with seasonal strength + relationship indicators */}
      {hidden.map((h, i) => {
        const hColor = ELEMENT_COLORS[h.element] || '#64748b';
        const tenGod: TenGodInfo | null = dayMasterElement && dayMasterPolarity
          ? getTenGod(dayMasterElement, dayMasterPolarity, h.element, h.polarity)
          : null;
        const seasonStr = season ? getSeasonalStrength(h.element, season) : 1.0;
        const relation = dayMasterElement ? getElementRelation(dayMasterElement, h.element) : 'unknown';
        const relColor = RELATION_COLORS[relation] || RELATION_COLORS.unknown;
        const relLabel = RELATION_LABELS[relation] || '';
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: i < hidden.length - 1 ? '6px' : 0 }}>
            {/* Relationship color indicator dot */}
            {dayMasterElement && (
              <span
                title={relLabel}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: relColor,
                  flexShrink: 0,
                  boxShadow: `0 0 4px ${relColor}60`,
                }}
              />
            )}
            <span
              onClick={() => setStoryIdx(storyIdx === i ? null : i)}
              title="Click for story"
              style={{
                fontSize: '18px',
                fontFamily: "'Noto Sans SC', serif",
                color: hColor,
                fontWeight: 700,
                width: '26px',
                textAlign: 'center',
                flexShrink: 0,
                cursor: dayMasterElement ? 'pointer' : 'default',
                textShadow: storyIdx === i ? `0 0 6px ${hColor}` : 'none',
                transition: 'text-shadow 0.2s',
              }}
            >
              {h.char}
            </span>
            <span style={{ fontSize: '10px', color: '#cbd5e1', width: '64px', flexShrink: 0 }}>
              {ELEMENT_GLYPHS[h.element]} {h.element}
            </span>
            {/* Bar container with seasonal overlay */}
            <div style={{
              flex: 1,
              height: '16px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
            }}>
              {/* Base bar */}
              <div style={{
                width: `${h.percentage}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${hColor}50, ${hColor})`,
                borderRadius: '8px',
                transition: 'width 0.4s ease-out, opacity 0.4s',
                opacity: 0.4 + 0.6 * seasonStr,
              }} />
              {/* Seasonal strength marker (thin vertical line) */}
              {season && (
                <div
                  title={`Seasonal: ${Math.round(seasonStr * 100)}%`}
                  style={{
                    position: 'absolute',
                    left: `${seasonStr * 100}%`,
                    top: 0,
                    bottom: 0,
                    width: '2px',
                    background: seasonStr >= 0.7 ? '#fbbf24' : (seasonStr <= 0.3 ? '#ef4444' : '#94a3b8'),
                    opacity: 0.7,
                    transition: 'left 0.4s, background 0.4s',
                  }}
                />
              )}
              <span style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '9px',
                fontWeight: 700,
                color: '#e2e8f0',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              }}>
                {h.percentage}%
              </span>
            </div>
            <span style={{ fontSize: '8px', color: '#94a3b8', width: '18px', textAlign: 'center', flexShrink: 0 }}>
              {POLARITY_ICONS[h.polarity]}
            </span>
            {/* Ten God label */}
            {tenGod && (
              <span style={{
                fontSize: '10px',
                color: '#e2e8f0',
                background: `${relColor}15`,
                border: `1px solid ${relColor}40`,
                borderRadius: '4px',
                padding: '1px 6px',
                flexShrink: 0,
                fontFamily: "'Noto Sans SC', serif",
                whiteSpace: 'nowrap',
              }}>
                {tenGod.chinese}
                <span style={{ fontSize: '8px', color: '#94a3b8', marginLeft: '3px' }}>
                  {tenGod.english}
                </span>
              </span>
            )}
          </div>
        );
      })}

      {/* Qi type labels */}
      <div style={{ display: 'flex', gap: '14px', marginTop: '8px', fontSize: '9px', color: '#94a3b8' }}>
        {hidden.map((h, i) => (
          <span key={i}>
            <span style={{ color: ELEMENT_COLORS[h.element], marginRight: '3px' }}>{h.char}</span>
            {QI_LABELS[i] || ''}
          </span>
        ))}
      </div>

      {/* Seasonal strength + relationship mini-legend */}
      {(season || dayMasterElement) && (
        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '8px',
          paddingTop: '6px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          {season && (
            <span style={{ fontSize: '9px', color: '#94a3b8' }}>
              Season: <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{season}</span>
              <span style={{ marginLeft: '4px', color: '#fbbf24', fontSize: '8px' }}>▎</span>
              <span style={{ fontSize: '8px', color: '#94a3b8' }}>= strong</span>
              <span style={{ marginLeft: '3px', color: '#ef4444', fontSize: '8px' }}>▎</span>
              <span style={{ fontSize: '8px', color: '#94a3b8' }}>= weak</span>
            </span>
          )}
          {dayMasterElement && (
            <span style={{ fontSize: '9px', color: '#94a3b8', display: 'flex', gap: '4px', alignItems: 'center' }}>
              {['resource', 'self', 'output', 'wealth', 'power'].map(r => (
                <span key={r} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                  <span style={{
                    width: '5px', height: '5px', borderRadius: '50%',
                    background: RELATION_COLORS[r],
                    display: 'inline-block',
                  }} />
                  <span style={{ fontSize: '7px' }}>{r.slice(0, 3)}</span>
                </span>
              ))}
            </span>
          )}
        </div>
      )}

      {/* Q. Hidden Stem Story Mode */}
      {storyIdx !== null && dayMasterElement && dayMasterPolarity && season && (() => {
        const h = hidden[storyIdx];
        if (!h) return null;
        const story = buildHiddenStemStory(h, dayMasterElement, dayMasterPolarity, season);
        const hColor = ELEMENT_COLORS[h.element] || '#64748b';
        return (
          <div style={{
            marginTop: '8px',
            padding: '10px 12px',
            background: `${hColor}08`,
            border: `1px solid ${hColor}30`,
            borderRadius: '8px',
            animation: 'bazi-season-fade 0.2s ease-out',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: hColor,
                fontFamily: "'Noto Sans SC', serif",
              }}>
                {h.char} Story
              </span>
              <button
                onClick={() => setStoryIdx(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '10px',
                  padding: '0 4px',
                }}
              >
                {'\u2715'}
              </button>
            </div>
            <div style={{
              fontSize: '10px',
              color: '#cbd5e1',
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
            }}>
              {story}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

// =============================================================================
// PILLAR WHEEL ROW
// =============================================================================

interface PillarWheelRowProps {
  label: string;
  chinese: string;
  stemIdx: number;
  branchIdx: number;
  stemRotation: number;
  branchRotation: number;
  isDay: boolean;
  wheelSize: number;
  onStartMomentum: (pillar: string, target: 'stem' | 'branch', direction: 1 | -1) => void;
  onStopMomentum: () => void;
  onStep: (pillar: string, target: 'stem' | 'branch', direction: 1 | -1) => void;
  onBranchClick?: (branchIdx: number) => void;
  playMode?: boolean;
  onPlayModeSegmentClick?: (wheelType: 'stem' | 'branch', targetIdx: number) => void;
  lockedStem?: number;
  lockedBranch?: number;
  onToggleLock?: (wheelType: 'stem' | 'branch') => void;
  selectedBranchIdx?: number | null;
  dayMasterElement?: string;
  dayMasterPolarity?: string;
  season?: string;
  dateRange?: string;
  boundaryNav?: PillarBoundaryNav | null;
  onBoundaryJump?: (targetDate: Date) => void;
  boundaryLoading?: boolean;
  extraLabel?: React.ReactNode;
  onInfoClick?: (info: { stemElement: string; branchAnimal: string }) => void;
}

const BOUNDARY_ARROW_STYLE: React.CSSProperties = {
  padding: '2px 7px',
  background: 'rgba(139, 92, 246, 0.08)',
  border: '1px solid rgba(139, 92, 246, 0.25)',
  borderRadius: '4px',
  color: '#a78bfa',
  fontSize: '11px',
  cursor: 'pointer',
  lineHeight: 1,
  transition: 'background 0.15s',
};

const NAV_BTN_STYLE: React.CSSProperties = {
  padding: '6px 10px',
  background: 'rgba(139, 92, 246, 0.12)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '8px',
  color: '#a78bfa',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  transition: 'background 0.15s',
  lineHeight: 1,
};

const CYCLE_BTN_STYLE: React.CSSProperties = {
  padding: '3px 8px',
  background: 'rgba(100, 116, 139, 0.1)',
  border: '1px solid rgba(100, 116, 139, 0.25)',
  borderRadius: '6px',
  color: '#cbd5e1',
  fontSize: '10px',
  fontWeight: 600,
  cursor: 'pointer',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  transition: 'background 0.15s, color 0.15s',
  lineHeight: 1,
  fontFamily: "'JetBrains Mono', monospace",
};

const PillarWheelRow: React.FC<PillarWheelRowProps> = ({
  label,
  chinese,
  stemIdx,
  branchIdx,
  stemRotation,
  branchRotation,
  isDay,
  wheelSize,
  onStartMomentum,
  onStopMomentum,
  onStep,
  onBranchClick,
  selectedBranchIdx,
  dayMasterElement,
  dayMasterPolarity,
  season,
  dateRange,
  boundaryNav,
  onBoundaryJump,
  boundaryLoading,
  playMode,
  onPlayModeSegmentClick,
  lockedStem,
  lockedBranch,
  onToggleLock,
  extraLabel,
  onInfoClick,
}) => {
  const pillarKey = label.toLowerCase();
  const stemSeg = STEM_SEGMENTS[stemIdx];
  const branchSeg = BRANCH_SEGMENTS[branchIdx];

  // Polarity dimming: when one wheel is locked, disable opposite-polarity segments on the other
  const disabledBranches = useMemo(() => {
    if (lockedStem === undefined) return undefined;
    const pol = STEM_SEGMENTS[lockedStem].polarity;
    return new Set(BRANCH_SEGMENTS.filter(b => b.polarity !== pol).map(b => b.index));
  }, [lockedStem]);
  const disabledStems = useMemo(() => {
    if (lockedBranch === undefined) return undefined;
    const pol = BRANCH_SEGMENTS[lockedBranch].polarity;
    return new Set(STEM_SEGMENTS.filter(s => s.polarity !== pol).map(s => s.index));
  }, [lockedBranch]);

  // Build enriched segment arrays with glyphs, polarity icons, and tooltips
  const stemSegments: EnrichedSegment[] = useMemo(() =>
    STEM_SEGMENTS.map(s => ({
      char: s.char,
      element: s.element,
      polarity: s.polarity,
      glyph: ELEMENT_GLYPHS[s.element] || '',
      polarityIcon: POLARITY_ICONS[s.polarity] || '',
      tooltip: buildStemTooltip(s),
    })),
  []);

  const branchSegments: EnrichedSegment[] = useMemo(() =>
    BRANCH_SEGMENTS.map(b => ({
      char: b.char,
      element: b.element,
      polarity: b.polarity,
      glyph: ELEMENT_GLYPHS[b.element] || '',
      polarityIcon: POLARITY_ICONS[b.polarity] || '',
      tooltip: buildBranchTooltip(b, dayMasterElement, dayMasterPolarity),
      hiddenStems: HIDDEN_STEMS[b.index] || [],
    })),
  [dayMasterElement, dayMasterPolarity]);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '60px 1fr auto 1fr',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 0',
      borderBottom: isDay ? '2px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(255,255,255,0.05)',
    }}>
      {/* Pillar label */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          color: isDay ? '#fbbf24' : '#e2e8f0',
          letterSpacing: '0.5px',
        }}>
          {label.toUpperCase()}
        </div>
        <div style={{
          fontSize: '9px',
          fontWeight: 600,
          color: isDay ? 'rgba(251, 191, 36, 0.6)' : 'rgba(226, 232, 240, 0.5)',
          letterSpacing: '1px',
        }}>
          PILLAR
        </div>
        <div style={{
          fontSize: '14px',
          color: isDay ? '#fbbf24' : '#f1f5f9',
          fontFamily: "'Noto Sans SC', serif",
        }}>
          {chinese}
        </div>
        {extraLabel}
      </div>

      {/* Stem section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
        <button
          style={NAV_BTN_STYLE}
          onClick={() => onStep(pillarKey, 'stem', -1)}
          onMouseDown={() => onStartMomentum(pillarKey, 'stem', -1)}
          onMouseUp={onStopMomentum}
          onMouseLeave={onStopMomentum}
          onTouchStart={(e) => { e.preventDefault(); onStartMomentum(pillarKey, 'stem', -1); }}
          onTouchEnd={onStopMomentum}
        >
          &#9664;
        </button>

        <div style={{ position: 'relative', display: 'inline-block',
          border: lockedStem !== undefined ? '2px solid rgba(251,191,36,0.3)' : '2px solid transparent',
          borderRadius: '50%', transition: 'border-color 0.2s' }}>
          {playMode && (
            <div onClick={() => onToggleLock?.('stem')}
              style={{ position: 'absolute', top: 0, left: 0, zIndex: 5,
                cursor: 'pointer', fontSize: '13px', lineHeight: 1,
                color: lockedStem !== undefined ? '#fbbf24' : '#64748b',
                opacity: lockedStem !== undefined ? 1 : 0.45,
                filter: lockedStem !== undefined ? 'drop-shadow(0 0 3px rgba(251,191,36,0.5))' : 'none',
                transition: 'all 0.2s', userSelect: 'none',
              }}
              title={lockedStem !== undefined ? 'Unlock stem wheel' : 'Lock stem at current position'}>
              {lockedStem !== undefined ? '🔒' : '🔓'}
            </div>
          )}
          <SegmentedWheel
            wheelId={`${pillarKey}-stem`}
            segmentCount={10}
            segments={stemSegments}
            activeIndex={stemIdx}
            size={wheelSize}
            slotDeg={STEM_SLOT_DEG}
            cumulativeRotation={stemRotation}
            onSegmentClick={playMode ? (idx) => onPlayModeSegmentClick?.('stem', idx) : undefined}
            disabledIndices={disabledStems}
          />
        </div>

        <button
          style={NAV_BTN_STYLE}
          onClick={() => onStep(pillarKey, 'stem', 1)}
          onMouseDown={() => onStartMomentum(pillarKey, 'stem', 1)}
          onMouseUp={onStopMomentum}
          onMouseLeave={onStopMomentum}
          onTouchStart={(e) => { e.preventDefault(); onStartMomentum(pillarKey, 'stem', 1); }}
          onTouchEnd={onStopMomentum}
        >
          &#9654;
        </button>
      </div>

      {/* Current pillar result */}
      <div style={{ minWidth: '200px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '4px' }}>
          <span style={{
            fontSize: '34px',
            fontFamily: "'Noto Sans SC', serif",
            color: ELEMENT_COLORS[stemSeg.element],
            fontWeight: 700,
          }}>
            {stemSeg.char}
          </span>
          <span style={{
            fontSize: '34px',
            fontFamily: "'Noto Sans SC', serif",
            color: ELEMENT_COLORS[branchSeg.element],
            fontWeight: 700,
          }}>
            {branchSeg.char}
          </span>
        </div>
        <div
          onClick={onInfoClick ? () => onInfoClick({ stemElement: stemSeg.element, branchAnimal: branchSeg.animal }) : undefined}
          style={{
            fontSize: '13px', color: '#e2e8f0', lineHeight: 1.3, fontWeight: 500,
            cursor: onInfoClick ? 'pointer' : 'default',
            borderBottom: onInfoClick ? '1px dashed rgba(139, 92, 246, 0.4)' : 'none',
            paddingBottom: onInfoClick ? '1px' : 0,
            display: 'inline-block',
            transition: 'color 0.15s',
          }}
          title={onInfoClick ? `Open ${stemSeg.english} ${branchSeg.animal} MD` : undefined}
        >
          <span>{stemSeg.english}</span>
          <span style={{ margin: '0 5px', color: '#94a3b8' }}>|</span>
          <span>{branchSeg.polarity} {branchSeg.element} {branchSeg.animal}</span>
        </div>
        <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>
          {ELEMENT_GLYPHS[stemSeg.element]} {POLARITY_ICONS[stemSeg.polarity]}
          <span style={{ margin: '0 4px' }}>/</span>
          {ELEMENT_GLYPHS[branchSeg.element]} {POLARITY_ICONS[branchSeg.polarity]}
        </div>
        {/* Solar term boundary navigator OR fallback date range */}
        {boundaryNav ? (
          <div style={{ marginTop: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            {/* Term name for year/month */}
            {boundaryNav.current.english && (
              <div style={{ fontSize: '9px', color: '#a78bfa', fontWeight: 600, letterSpacing: '0.5px' }}>
                {boundaryNav.current.name} {boundaryNav.current.english}
              </div>
            )}
            {/* ◀ DateTime ▶ */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => onBoundaryJump?.(boundaryNav.prev.date)}
                disabled={boundaryLoading}
                style={{ ...BOUNDARY_ARROW_STYLE, opacity: boundaryLoading ? 0.4 : 1 }}
                title={boundaryNav.prev.english ? `Jump to ${boundaryNav.prev.english}` : 'Previous'}
              >&#9664;</button>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '11px', color: '#e2e8f0', whiteSpace: 'nowrap',
                  fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.3px',
                }}>
                  {boundaryNav.displayTime}
                </div>
                {boundaryNav.displayTimeEnd && (
                  <div style={{
                    fontSize: '10px', color: '#94a3b8', whiteSpace: 'nowrap',
                    fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.3px',
                    marginTop: '1px',
                  }}>
                    → {boundaryNav.displayTimeEnd}
                  </div>
                )}
              </div>
              <button
                onClick={() => onBoundaryJump?.(boundaryNav.next.date)}
                disabled={boundaryLoading}
                style={{ ...BOUNDARY_ARROW_STYLE, opacity: boundaryLoading ? 0.4 : 1 }}
                title={boundaryNav.next.english ? `Jump to ${boundaryNav.next.english}` : 'Next'}
              >&#9654;</button>
            </div>
            {/* Timezone label for year/month only */}
            {boundaryNav.timezoneLabel && (
              <div style={{ fontSize: '8px', color: '#64748b', fontFamily: "'JetBrains Mono', monospace" }}>
                {boundaryNav.timezoneLabel}
              </div>
            )}
          </div>
        ) : dateRange ? (
          <div style={{
            fontSize: '12px', color: '#94a3b8', marginTop: '4px',
            fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.3px',
          }}>
            {dateRange}
          </div>
        ) : null}
      </div>

      {/* Branch section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
        <button
          style={NAV_BTN_STYLE}
          onClick={() => onStep(pillarKey, 'branch', -1)}
          onMouseDown={() => onStartMomentum(pillarKey, 'branch', -1)}
          onMouseUp={onStopMomentum}
          onMouseLeave={onStopMomentum}
          onTouchStart={(e) => { e.preventDefault(); onStartMomentum(pillarKey, 'branch', -1); }}
          onTouchEnd={onStopMomentum}
        >
          &#9664;
        </button>

        <div style={{ position: 'relative', display: 'inline-block',
          border: lockedBranch !== undefined ? '2px solid rgba(251,191,36,0.3)' : '2px solid transparent',
          borderRadius: '50%', transition: 'border-color 0.2s' }}>
          {playMode && (
            <div onClick={() => onToggleLock?.('branch')}
              style={{ position: 'absolute', top: 0, left: 0, zIndex: 5,
                cursor: 'pointer', fontSize: '13px', lineHeight: 1,
                color: lockedBranch !== undefined ? '#fbbf24' : '#64748b',
                opacity: lockedBranch !== undefined ? 1 : 0.45,
                filter: lockedBranch !== undefined ? 'drop-shadow(0 0 3px rgba(251,191,36,0.5))' : 'none',
                transition: 'all 0.2s', userSelect: 'none',
              }}
              title={lockedBranch !== undefined ? 'Unlock branch wheel' : 'Lock branch at current position'}>
              {lockedBranch !== undefined ? '🔒' : '🔓'}
            </div>
          )}
          <SegmentedWheel
            wheelId={`${pillarKey}-branch`}
            segmentCount={12}
            segments={branchSegments}
            activeIndex={branchIdx}
            size={wheelSize}
            slotDeg={BRANCH_SLOT_DEG}
            cumulativeRotation={branchRotation}
            onSegmentClick={playMode ? (idx) => onPlayModeSegmentClick?.('branch', idx) : onBranchClick}
            selectedIdx={selectedBranchIdx}
            season={season}
            dayMasterElement={dayMasterElement}
            disabledIndices={disabledBranches}
          />
        </div>

        <button
          style={NAV_BTN_STYLE}
          onClick={() => onStep(pillarKey, 'branch', 1)}
          onMouseDown={() => onStartMomentum(pillarKey, 'branch', 1)}
          onMouseUp={onStopMomentum}
          onMouseLeave={onStopMomentum}
          onTouchStart={(e) => { e.preventDefault(); onStartMomentum(pillarKey, 'branch', 1); }}
          onTouchEnd={onStopMomentum}
        >
          &#9654;
        </button>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN: BaZiFourPillarWheels
// =============================================================================

interface BaZiFourPillarWheelsProps {
  baziResult: {
    pillars: Array<{
      stem: { index: number; char: string; element: string; english: string };
      branch: { index: number; char: string; element: string; animal: string };
      name: string;
    }>;
  };
  currentDate: Date;
  onDateChange: (newDate: Date) => void;
  onReset?: () => void;
  solarTermData?: Map<number, any>;
  solarTermLoading?: boolean;
  tstInfo?: TstBreakdown | null;
  onPillarInfoClick?: (info: { stemElement: string; branchAnimal: string }) => void;
}

type PillarKey = 'year' | 'month' | 'day' | 'hour';
type WheelTarget = 'stem' | 'branch';

interface RotationState {
  year: { stem: number; branch: number };
  month: { stem: number; branch: number };
  day: { stem: number; branch: number };
  hour: { stem: number; branch: number };
}

/**
 * Find smallest |delta| where (curStem+delta)%10===tgtStem AND (curBranch+delta)%12===tgtBranch.
 * Uses brute-force over one 60-unit sexagenary cycle.  Returns null if no solution (polarity mismatch).
 */
function findNearestPillarDelta(
  curStem: number, curBranch: number,
  tgtStem: number, tgtBranch: number,
): number | null {
  const stemDiff = ((tgtStem - curStem) % 10 + 10) % 10;
  const branchDiff = ((tgtBranch - curBranch) % 12 + 12) % 12;
  for (let d = stemDiff; d < 60; d += 10) {
    if (d % 12 === branchDiff) return d <= 30 ? d : d - 60;
  }
  return null;
}

const EMPTY_LOCKS: Record<PillarKey, { stem?: number; branch?: number }> = { year: {}, month: {}, day: {}, hour: {} };

const BaZiFourPillarWheels: React.FC<BaZiFourPillarWheelsProps> = ({
  baziResult,
  currentDate,
  onDateChange,
  onReset,
  solarTermData,
  solarTermLoading,
  tstInfo,
  onPillarInfoClick,
}) => {
  const wheelSize = 180;

  // Expanded Zang Gan panel state: { pillarKey, branchIdx } or null
  const [expandedZangGan, setExpandedZangGan] = useState<{ pillarKey: PillarKey; branchIdx: number } | null>(null);

  // Seasons table state
  const [showSeasons, setShowSeasons] = useState(false);
  const [showSeasonsInfo, setShowSeasonsInfo] = useState(false);
  const [showSeasonalWeighting, setShowSeasonalWeighting] = useState(false);
  const [seasonsPanelPos, setSeasonsPanelPos] = useState<{ x: number; y: number; w: number } | null>(null);

  // Day Master analysis state
  const [showDayMaster, setShowDayMaster] = useState(false);
  const [dayMasterPanelPos, setDayMasterPanelPos] = useState<{ x: number; y: number; w: number } | null>(null);
  const dayMasterDragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const handleDayMasterDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const panel = (e.currentTarget as HTMLElement).closest('[data-daymaster-panel]') as HTMLElement | null;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    dayMasterDragRef.current = { startX: e.clientX, startY: e.clientY, origX: rect.left, origY: rect.top };
    const w = rect.width;
    const onMove = (ev: MouseEvent) => {
      if (!dayMasterDragRef.current) return;
      const dx = ev.clientX - dayMasterDragRef.current.startX;
      const dy = ev.clientY - dayMasterDragRef.current.startY;
      setDayMasterPanelPos({ x: dayMasterDragRef.current.origX + dx, y: dayMasterDragRef.current.origY + dy, w });
    };
    const onUp = () => {
      dayMasterDragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, []);

  const dayMasterAnalysis = useMemo(() => {
    if (!baziResult?.pillars) return null;
    return computeDayMasterAnalysis(baziResult.pillars);
  }, [baziResult]);
  const seasonsDragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const handleSeasonsDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const panel = (e.currentTarget as HTMLElement).closest('[data-seasons-panel]') as HTMLElement | null;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    seasonsDragRef.current = { startX: e.clientX, startY: e.clientY, origX: rect.left, origY: rect.top };
    const w = rect.width;
    const onMove = (ev: MouseEvent) => {
      if (!seasonsDragRef.current) return;
      const dx = ev.clientX - seasonsDragRef.current.startX;
      const dy = ev.clientY - seasonsDragRef.current.startY;
      setSeasonsPanelPos({ x: seasonsDragRef.current.origX + dx, y: seasonsDragRef.current.origY + dy, w });
    };
    const onUp = () => {
      seasonsDragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, []);

  // Play Mode: clicking any wheel segment jumps the date
  const [playMode, setPlayMode] = useState(false);

  // Wheel lock: per-pillar per-wheel index overrides (only meaningful in Play Mode)
  const [lockedIndices, setLockedIndices] = useState<Record<PillarKey, { stem?: number; branch?: number }>>(EMPTY_LOCKS);
  const [lockSearchResult, setLockSearchResult] = useState<{ pillarKey: PillarKey; delta: number; found: boolean } | null>(null);

  // Auto-clear search badge after 4 seconds
  useEffect(() => {
    if (!lockSearchResult) return;
    const t = setTimeout(() => setLockSearchResult(null), 4000);
    return () => clearTimeout(t);
  }, [lockSearchResult]);

  // True Solar Time education panel
  const [showTstPanel, setShowTstPanel] = useState(false);

  // New Year navigation state (only active in Play Mode)
  const [newYearInput, setNewYearInput] = useState(() => String(currentDate.getFullYear()));
  const [newYearLoading, setNewYearLoading] = useState(false);
  const newYearFocused = useRef(false);

  // Local state for the Play Mode date input — prevents re-render fighting with browser's year editor
  const [playDateInput, setPlayDateInput] = useState(() => dateToLocalInput(currentDate));
  const playDateFocused = useRef(false);
  useEffect(() => {
    // Sync from parent only when the input is NOT focused (user is not editing)
    if (!playDateFocused.current) {
      setPlayDateInput(dateToLocalInput(currentDate));
    }
  }, [currentDate]);

  // Sync New Year input only when user is NOT editing the field
  useEffect(() => {
    if (!newYearFocused.current) {
      setNewYearInput(String(currentDate.getFullYear()));
    }
  }, [currentDate]);

  // Inject CSS animations
  useEffect(() => { ensureStyles(); }, []);

  // Derive Day Master element & polarity from Day pillar stem
  const dayMasterElement = useMemo(() => {
    if (!baziResult?.pillars?.[2]) return undefined;
    return baziResult.pillars[2].stem.element;
  }, [baziResult]);
  const dayMasterPolarity = useMemo(() => {
    if (!baziResult?.pillars?.[2]) return undefined;
    return STEM_SEGMENTS[baziResult.pillars[2].stem.index]?.polarity;
  }, [baziResult]);

  // Derive season from Month pillar's branch
  const monthSeason = useMemo(() => {
    if (!baziResult?.pillars?.[1]) return 'Spring';
    return getSeasonFromMonthBranch(baziResult.pillars[1].branch.index);
  }, [baziResult]);

  const seasonStyle = SEASON_COLORS[monthSeason] || SEASON_COLORS.Spring;

  // Compute date ranges for each pillar (fallback for when API data is unavailable)
  const pillarDateRanges = useMemo(() => getPillarDateRanges(currentDate), [currentDate]);

  // Build season table data with exact dates from API
  const seasonTableData = useMemo(() => {
    if (!solarTermData || solarTermData.size === 0) return null;
    return buildSeasonTableData(solarTermData, currentDate);
  }, [solarTermData, currentDate]);

  // Compute exact boundary navigation from solar term API data
  const boundaryNav = useMemo(() => {
    if (!solarTermData || solarTermData.size === 0) return null;
    return computeBoundaryNav(currentDate, solarTermData);
  }, [currentDate, solarTermData]);

  // Boundary navigation: jump currentDate to an exact solar term moment
  const handleBoundaryJump = useCallback((targetDate: Date) => {
    onDateChange(targetDate);
  }, [onDateChange]);

  // Jump to a specific year's Li Chun (立春)
  const handleNewYearJump = useCallback((targetYear: number) => {
    if (isNaN(targetYear) || targetYear < 1 || targetYear > 9999) return;
    setNewYearInput(String(targetYear));
    setNewYearLoading(true);
    import('../../services/sovereignSolarTermService').then(({ getSolarTermsForYear }) =>
      getSolarTermsForYear(targetYear)
    ).then((data: any) => {
      if (data?.liChun?.isoString) {
        onDateChange(new Date(data.liChun.isoString));
      } else {
        // Fallback: approximate Li Chun as Feb 4 of that year
        onDateChange(new Date(targetYear, 1, 4, 11, 0));
      }
    }).catch(() => {
      // Fallback on error
      onDateChange(new Date(targetYear, 1, 4, 11, 0));
    }).finally(() => {
      setNewYearLoading(false);
    });
  }, [onDateChange]);

  // Track cumulative rotations
  const rotationsRef = useRef<RotationState>({
    year:  { stem: 0, branch: 0 },
    month: { stem: 0, branch: 0 },
    day:   { stem: 0, branch: 0 },
    hour:  { stem: 0, branch: 0 },
  });
  const [rotations, setRotations] = React.useState<RotationState>(rotationsRef.current);

  // Momentum
  const moveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moveDelayRef = useRef(400);

  // Sync rotations on baziResult change (respects locked overrides)
  const prevIndicesRef = useRef<string>('');
  useEffect(() => {
    if (!baziResult?.pillars) return;
    const lockKey = PILLAR_KEYS.map(pk => `${lockedIndices[pk].stem ?? ''}_${lockedIndices[pk].branch ?? ''}`).join(',');
    const key = baziResult.pillars.map(p => `${p.stem.index}-${p.branch.index}`).join(',') + '|' + lockKey;
    if (key === prevIndicesRef.current) return;

    const newRot = { ...rotationsRef.current };
    PILLAR_KEYS.forEach((pk, i) => {
      const pillar = baziResult.pillars[i];
      const effectiveStem = lockedIndices[pk].stem ?? pillar.stem.index;
      const effectiveBranch = lockedIndices[pk].branch ?? pillar.branch.index;
      const targetStem = -(effectiveStem * STEM_SLOT_DEG);
      const targetBranch = -(effectiveBranch * BRANCH_SLOT_DEG);
      newRot[pk] = {
        stem: nearestRotation(newRot[pk].stem, targetStem, 360),
        branch: nearestRotation(newRot[pk].branch, targetBranch, 360),
      };
    });

    rotationsRef.current = newRot;
    setRotations({ ...newRot });
    prevIndicesRef.current = key;
  }, [baziResult, lockedIndices]);

  // Update a locked index directly (for clicking segments or arrows on a locked wheel)
  const setLockedIdx = useCallback((pillarKey: PillarKey, wheelType: 'stem' | 'branch', idx: number) => {
    setLockedIndices(prev => ({
      ...prev,
      [pillarKey]: { ...prev[pillarKey], [wheelType]: idx },
    }));
  }, []);

  const handleStep = useCallback((pillar: string, target: WheelTarget, direction: 1 | -1) => {
    const pk = pillar as PillarKey;

    // If this wheel is locked, step the locked index directly (no date change)
    const lockVal = lockedIndices[pk][target];
    if (lockVal !== undefined) {
      const N = target === 'stem' ? 10 : 12;
      const newIdx = ((lockVal + direction) % N + N) % N;
      setLockedIdx(pk, target, newIdx);
      return;
    }

    const slotDeg = target === 'stem' ? STEM_SLOT_DEG : BRANCH_SLOT_DEG;
    const deltaDeg = -direction * slotDeg;

    rotationsRef.current = {
      ...rotationsRef.current,
      [pk]: {
        ...rotationsRef.current[pk],
        [target]: rotationsRef.current[pk][target] + deltaDeg,
      },
    };
    setRotations({ ...rotationsRef.current });

    // For year/month: use exact solar term boundary dates when available
    const nav = boundaryNav;
    if (pk === 'year' && nav?.year) {
      const target = direction === 1 ? nav.year.next.date : nav.year.prev.date;
      onDateChange(target);
      return;
    }
    if (pk === 'month' && nav?.month) {
      const target = direction === 1 ? nav.month.next.date : nav.month.prev.date;
      onDateChange(target);
      return;
    }

    // Fallback: simple calendar math for day/hour
    const dateDeltas: Record<string, { years?: number; months?: number; days?: number; hours?: number }> = {
      year: { years: direction },
      month: { months: direction },
      day: { days: direction },
      hour: { hours: direction * 2 },
    };
    const d = dateDeltas[pillar];
    if (d) onDateChange(shiftDateBy(currentDate, d));
  }, [currentDate, onDateChange, boundaryNav, lockedIndices, setLockedIdx]);

  const startMomentum = useCallback((pillar: string, target: WheelTarget, direction: 1 | -1) => {
    moveDelayRef.current = 400;
    const tick = () => {
      handleStep(pillar, target, direction);
      moveDelayRef.current = Math.max(50, moveDelayRef.current * 0.85);
      moveTimerRef.current = setTimeout(tick, moveDelayRef.current);
    };
    moveTimerRef.current = setTimeout(tick, moveDelayRef.current);
  }, [handleStep]);

  const stopMomentum = useCallback(() => {
    if (moveTimerRef.current) {
      clearTimeout(moveTimerRef.current);
      moveTimerRef.current = null;
    }
    moveDelayRef.current = 400;
  }, []);

  useEffect(() => {
    return () => { if (moveTimerRef.current) clearTimeout(moveTimerRef.current); };
  }, []);

  const handleDateStep = useCallback((days: number) => {
    onDateChange(shiftDateBy(currentDate, { days }));
  }, [currentDate, onDateChange]);

  const handleToday = useCallback(() => {
    setPlayMode(false);
    onDateChange(new Date());
  }, [onDateChange]);

  // Cycle jump handlers
  const handleCycleJump = useCallback((delta: { years?: number; months?: number; days?: number; hours?: number }) => {
    onDateChange(shiftDateBy(currentDate, delta));
  }, [currentDate, onDateChange]);

  // Branch click → toggle Zang Gan panel
  const handleBranchClick = useCallback((pillarKey: PillarKey, branchIdx: number) => {
    setExpandedZangGan(prev =>
      prev && prev.pillarKey === pillarKey && prev.branchIdx === branchIdx
        ? null
        : { pillarKey, branchIdx }
    );
  }, []);

  // Lock toggle: pin/unpin a single wheel; when both are pinned, find nearest date & jump
  const handleToggleLock = useCallback((pillarKey: PillarKey, wheelType: 'stem' | 'branch') => {
    const pillarIdx = PILLAR_KEYS.indexOf(pillarKey);
    const pillar = baziResult.pillars[pillarIdx];

    setLockedIndices(prev => {
      const cur = prev[pillarKey][wheelType];
      if (cur !== undefined) {
        // UNLOCK
        const next = { ...prev[pillarKey] };
        delete next[wheelType];
        setLockSearchResult(null);
        return { ...prev, [pillarKey]: next };
      }
      // LOCK at current effective index
      const idx = prev[pillarKey][wheelType] ?? (wheelType === 'stem' ? pillar.stem.index : pillar.branch.index);
      const newLocks = { ...prev, [pillarKey]: { ...prev[pillarKey], [wheelType]: idx } };

      // Both locked? → find nearest date
      const otherType: 'stem' | 'branch' = wheelType === 'stem' ? 'branch' : 'stem';
      const otherIdx = newLocks[pillarKey][otherType];
      if (otherIdx !== undefined) {
        const stemTarget = wheelType === 'stem' ? idx : otherIdx;
        const branchTarget = wheelType === 'branch' ? idx : otherIdx;
        const delta = findNearestPillarDelta(pillar.stem.index, pillar.branch.index, stemTarget, branchTarget);
        if (delta !== null) {
          if (delta !== 0) {
            const timeDeltas: Record<PillarKey, any> = {
              year: { years: delta }, month: { months: delta },
              day: { days: delta }, hour: { hours: delta * 2 },
            };
            onDateChange(shiftDateBy(currentDate, timeDeltas[pillarKey]));
          }
          setLockSearchResult({ pillarKey, delta, found: true });
          return { ...EMPTY_LOCKS }; // auto-release
        }
        // polarity mismatch — should be blocked by dimming, but safety fallback
        setLockSearchResult({ pillarKey, delta: 0, found: false });
      }
      return newLocks;
    });
  }, [baziResult, currentDate, onDateChange]);


  // Play Mode: click a wheel segment → jump date by shortest-path delta
  const handlePlayModeClick = useCallback((pillarKey: PillarKey, wheelType: 'stem' | 'branch', targetIdx: number) => {
    // If this wheel is locked, just update the locked index
    if (lockedIndices[pillarKey][wheelType] !== undefined) {
      setLockedIdx(pillarKey, wheelType, targetIdx);
      return;
    }

    const pillarIdx = PILLAR_KEYS.indexOf(pillarKey);
    const pillar = baziResult.pillars[pillarIdx];

    // If the OTHER wheel is locked, find nearest date for the combo (locked + clicked)
    const otherType: 'stem' | 'branch' = wheelType === 'stem' ? 'branch' : 'stem';
    const otherLocked = lockedIndices[pillarKey][otherType];
    if (otherLocked !== undefined) {
      const stemTarget = wheelType === 'stem' ? targetIdx : otherLocked;
      const branchTarget = wheelType === 'branch' ? targetIdx : otherLocked;
      const crtDelta = findNearestPillarDelta(pillar.stem.index, pillar.branch.index, stemTarget, branchTarget);
      if (crtDelta !== null) {
        if (crtDelta !== 0) {
          const td: Record<PillarKey, any> = {
            year: { years: crtDelta }, month: { months: crtDelta },
            day: { days: crtDelta }, hour: { hours: crtDelta * 2 },
          };
          onDateChange(shiftDateBy(currentDate, td[pillarKey]));
        }
        setLockSearchResult({ pillarKey, delta: crtDelta, found: true });
        setLockedIndices({ ...EMPTY_LOCKS }); // auto-release
      } else {
        setLockSearchResult({ pillarKey, delta: 0, found: false });
      }
      return;
    }

    // Normal play mode: shift date by stem/branch delta
    const currentIdx = wheelType === 'stem' ? pillar.stem.index : pillar.branch.index;
    const N = wheelType === 'stem' ? 10 : 12;
    let delta = ((targetIdx - currentIdx) % N + N) % N;
    if (delta > N / 2) delta -= N;
    if (delta === 0) return;

    const timeDeltas: Record<PillarKey, { years?: number; months?: number; days?: number; hours?: number }> = {
      year:  { years: delta },
      month: { months: delta },
      day:   { days: delta },
      hour:  { hours: delta * 2 },
    };
    onDateChange(shiftDateBy(currentDate, timeDeltas[pillarKey]));
  }, [baziResult, currentDate, onDateChange, lockedIndices, setLockedIdx]);

  if (!baziResult?.pillars) return null;

  return (
    <div style={{
      position: 'relative',
      background: seasonStyle.bg,
      border: `1px solid ${seasonStyle.border}`,
      borderRadius: '12px',
      padding: '16px',
      transition: 'background 0.6s, border-color 0.6s',
      animation: 'bazi-season-fade 0.6s ease-out',
    }}>
      {/* Season badge + date nav */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '12px',
        padding: '6px 0',
        flexWrap: 'wrap',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Season badge */}
        <span style={{
          padding: '3px 10px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 600,
          background: seasonStyle.border,
          color: '#e2e8f0',
          letterSpacing: '0.5px',
        }}>
          {seasonStyle.label}
        </span>

        {onReset && (
          <button
            type="button"
            onClick={() => { setPlayMode(false); onReset(); }}
            style={{
              padding: '5px 14px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              borderRadius: '8px',
              color: '#f87171',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              cursor: 'pointer',
              position: 'relative',
              zIndex: 11,
              transition: 'background 0.15s, transform 0.1s',
            }}
          >
            RESET
          </button>
        )}

        <button
          type="button"
          className="bazi-today-btn"
          onClick={handleToday}
          style={{
            padding: '5px 14px',
            background: 'rgba(251, 191, 36, 0.12)',
            border: '1px solid rgba(251, 191, 36, 0.4)',
            borderRadius: '8px',
            color: '#fbbf24',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            position: 'relative',
            zIndex: 11,
            transition: 'background 0.15s, transform 0.1s',
          }}
        >
          Today
        </button>

        <button onClick={() => handleDateStep(-1)} style={NAV_BTN_STYLE}>
          &#9664; Prev Day
        </button>

        <span style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#e2e8f0',
          fontFamily: "'JetBrains Mono', monospace",
          minWidth: '150px',
          textAlign: 'center',
        }}>
          {formatDate(currentDate)}
          {isToday(currentDate) && (
            <span style={{ fontSize: '10px', color: '#fbbf24', marginLeft: '6px', fontWeight: 400 }}>
              (Today)
            </span>
          )}
        </span>

        <button onClick={() => handleDateStep(1)} style={NAV_BTN_STYLE}>
          Next Day &#9654;
        </button>
      </div>

      {/* True Solar Time + New Year navigation — single row */}
      {(tstInfo || playMode) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '2px 0',
          fontSize: '11px',
        }}>
          {/* New Year navigation — only in Play Mode */}
          {playMode && (
            <>
              <button
                type="button"
                title="Previous New Year (立春)"
                disabled={newYearLoading}
                onClick={() => {
                  handleNewYearJump(parseInt(newYearInput, 10) - 1);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#60a5fa',
                  fontSize: '16px',
                  cursor: newYearLoading ? 'wait' : 'pointer',
                  padding: '2px 6px',
                  opacity: newYearLoading ? 0.4 : 1,
                }}
              >◀</button>

              <button
                type="button"
                title="Jump to this year's 立春 (click to reset to current year)"
                disabled={newYearLoading}
                onClick={() => {
                  const thisYear = new Date().getFullYear();
                  setNewYearInput(String(thisYear));
                  handleNewYearJump(thisYear);
                }}
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '6px 0 0 6px',
                  color: '#fbbf24',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '4px 10px',
                  cursor: newYearLoading ? 'wait' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                New Year:
              </button>
              <input
                type="text"
                placeholder="YYYY"
                maxLength={4}
                value={newYearInput}
                onFocus={(e) => {
                  newYearFocused.current = true;
                  e.target.select();
                }}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setNewYearInput(v);
                  if (v.length === 4) {
                    const yr = parseInt(v, 10);
                    if (!isNaN(yr) && yr >= 1 && yr !== currentDate.getFullYear()) {
                      handleNewYearJump(yr);
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const yr = parseInt(newYearInput, 10);
                    if (!isNaN(yr) && yr >= 1) {
                      handleNewYearJump(yr);
                      (e.target as HTMLInputElement).blur();
                    }
                  }
                }}
                onBlur={() => {
                  newYearFocused.current = false;
                  const yr = parseInt(newYearInput, 10);
                  if (isNaN(yr) || yr < 1 || yr > 9999) {
                    setNewYearInput(String(currentDate.getFullYear()));
                  }
                }}
                style={{
                  width: '52px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  color: '#fbbf24',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderLeft: 'none',
                  borderRadius: '0 6px 6px 0',
                  padding: '4px 6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                  textAlign: 'center',
                }}
              />

              <button
                type="button"
                title="Next New Year (立春)"
                disabled={newYearLoading}
                onClick={() => {
                  handleNewYearJump(parseInt(newYearInput, 10) + 1);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#60a5fa',
                  fontSize: '16px',
                  cursor: newYearLoading ? 'wait' : 'pointer',
                  padding: '2px 6px',
                  opacity: newYearLoading ? 0.4 : 1,
                }}
              >▶</button>

              {newYearLoading && (
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>Loading...</span>
              )}
            </>
          )}

          {/* Separator when both are visible */}
          {tstInfo && playMode && (
            <span style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.12)' }} />
          )}

          {/* True Solar Time indicator — clickable badge + correction formula */}
          {tstInfo && (() => {
            const ct = tstInfo.clockTime;
            const st = tstInfo.correctedTime;
            const fmtTime = (d: Date) => {
              const h = d.getHours(), m = d.getMinutes();
              const ampm = h >= 12 ? 'PM' : 'AM';
              const h12 = h % 12 || 12;
              return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
            };
            const sign = tstInfo.totalOffset >= 0 ? '+' : '\u2212'; // minus sign
            const absOff = Math.abs(tstInfo.totalOffset);
            return (
              <>
                <span
                  onClick={() => setShowTstPanel(p => !p)}
                  title="Click to learn about True Solar Time"
                  style={{
                    background: showTstPanel ? 'rgba(234, 179, 8, 0.22)' : 'rgba(234, 179, 8, 0.12)',
                    border: `1px solid rgba(234, 179, 8, ${showTstPanel ? '0.5' : '0.3'})`,
                    borderRadius: '6px',
                    padding: '3px 10px',
                    color: '#facc15',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    userSelect: 'none' as const,
                  }}>
                  ☀ True Solar Time {showTstPanel ? '▾' : '▸'}
                </span>
                <span style={{ color: '#e2e8f0', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.3px' }}>
                  {fmtTime(ct)} {sign} {absOff.toFixed(1)} min = <span style={{ color: '#facc15', fontWeight: 700 }}>{fmtTime(st)}</span>
                </span>
                <span style={{ color: '#64748b', fontSize: '10px' }}>
                  (lng {tstInfo.longitude.toFixed(2)}°)
                </span>
              </>
            );
          })()}
        </div>
      )}

      {/* True Solar Time education panel */}
      {showTstPanel && tstInfo && (() => {
        const sign = (v: number) => v >= 0 ? '+' : '\u2212';
        const abs = (v: number) => Math.abs(v).toFixed(1);
        return (
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(234, 179, 8, 0.25)',
            borderRadius: '10px',
            padding: '14px 18px',
            margin: '4px 0 2px',
            fontSize: '11px',
            lineHeight: 1.7,
            color: '#cbd5e1',
            maxWidth: '680px',
            alignSelf: 'center',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#facc15' }}>
                ☀ True Solar Time (真太阳时)
              </span>
              <span
                onClick={() => setShowTstPanel(false)}
                style={{ cursor: 'pointer', color: '#64748b', fontSize: '14px', padding: '0 4px' }}
                title="Close"
              >✕</span>
            </div>

            {/* Why */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '3px' }}>Why True Solar Time?</div>
              <div>BaZi predates time zones — it uses the sun's actual position overhead, not clock time.
              Your birth hour pillar depends on when the sun truly crossed your local meridian.
              A few minutes' difference can shift the entire hour pillar, changing your chart.</div>
            </div>

            {/* Formula */}
            <div style={{
              background: 'rgba(234, 179, 8, 0.08)',
              border: '1px solid rgba(234, 179, 8, 0.2)',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '10px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10.5px',
            }}>
              <div style={{ fontWeight: 700, color: '#facc15', marginBottom: '6px', fontFamily: 'inherit' }}>
                TST = Standard Time + Longitude Correction + Equation of Time
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2px 12px' }}>
                <span style={{ color: '#94a3b8' }}>Longitude Correction:</span>
                <span>
                  (lng {tstInfo.longitude.toFixed(2)}° − meridian {tstInfo.standardMeridian}°) × 4 min/°
                  = <span style={{ color: '#38bdf8', fontWeight: 600 }}>{sign(tstInfo.longitudeCorrection)}{abs(tstInfo.longitudeCorrection)} min</span>
                </span>
                <span style={{ color: '#94a3b8' }}>Equation of Time:</span>
                <span>
                  Seasonal orbit correction
                  = <span style={{ color: '#a78bfa', fontWeight: 600 }}>{sign(tstInfo.equationOfTime)}{abs(tstInfo.equationOfTime)} min</span>
                </span>
                <span style={{ color: '#94a3b8' }}>Total Correction:</span>
                <span style={{ color: '#facc15', fontWeight: 700 }}>
                  {sign(tstInfo.totalOffset)}{abs(tstInfo.totalOffset)} min
                </span>
              </div>
            </div>

            {/* Breakdown cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              {/* Longitude Correction */}
              <div style={{
                background: 'rgba(56, 189, 248, 0.06)',
                border: '1px solid rgba(56, 189, 248, 0.15)',
                borderRadius: '8px',
                padding: '8px 10px',
              }}>
                <div style={{ fontWeight: 600, color: '#38bdf8', marginBottom: '4px', fontSize: '10px' }}>
                  Longitude Correction
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                  Your location is {Math.abs(tstInfo.longitude - tstInfo.standardMeridian).toFixed(2)}°
                  {tstInfo.longitude > tstInfo.standardMeridian ? ' east' : ' west'} of
                  the UTC{tstInfo.gmtOffsetHours >= 0 ? '+' : ''}{tstInfo.gmtOffsetHours} standard
                  meridian ({tstInfo.standardMeridian}°).
                  Each degree = 4 minutes of solar time difference.
                </div>
              </div>
              {/* Equation of Time */}
              <div style={{
                background: 'rgba(167, 139, 250, 0.06)',
                border: '1px solid rgba(167, 139, 250, 0.15)',
                borderRadius: '8px',
                padding: '8px 10px',
              }}>
                <div style={{ fontWeight: 600, color: '#a78bfa', marginBottom: '4px', fontSize: '10px' }}>
                  Equation of Time
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                  Earth's elliptical orbit and axial tilt cause the sun to drift
                  up to +16 min (Nov) or −14 min (Feb) from mean solar time.
                  This seasonal correction varies daily.
                </div>
              </div>
            </div>

            {/* Sensitivity note */}
            <div style={{ fontSize: '10px', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px' }}>
              <span style={{ color: '#f59e0b' }}>⚠</span> Births near hour-pillar boundaries (e.g. 11:00 AM, 1:00 PM)
              are especially sensitive — a few minutes' TST correction can shift the entire Hour Pillar.
            </div>
          </div>
        );
      })()}

      {/* Play Mode toggle + result + input — single row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '10px',
        position: 'relative',
        zIndex: 10,
        flexWrap: 'wrap',
      }}>
        <button
          type="button"
          onClick={() => { setPlayMode(p => !p); setLockedIndices({ ...EMPTY_LOCKS }); setLockSearchResult(null); }}
          style={{
            padding: '4px 14px',
            background: playMode ? 'rgba(34, 197, 94, 0.15)' : 'rgba(100, 116, 139, 0.1)',
            border: `1px solid ${playMode ? 'rgba(34, 197, 94, 0.4)' : 'rgba(100, 116, 139, 0.25)'}`,
            borderRadius: '8px',
            color: playMode ? '#4ade80' : '#94a3b8',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Play Mode {playMode ? 'ON' : 'OFF'}
        </button>
        {playMode && (
          <>
            <span style={{
              fontSize: '12px',
              color: '#e2e8f0',
              fontFamily: "'JetBrains Mono', monospace",
              background: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '6px',
              padding: '3px 10px',
            }}>
              Play Mode, {formatPlayModeResult(currentDate)}
            </span>
            <span style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)' }} />
            <span style={{ fontSize: '10px', color: '#facc15', fontWeight: 700, letterSpacing: '0.3px' }}>Set Date:</span>
            <input
              type="text"
              title="Set date and time (YYYY-MM-DD h:mm AM/PM)"
              placeholder="YYYY-MM-DD h:mm AM"
              value={playDateInput}
              onFocus={() => { playDateFocused.current = true; }}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9\-: AaMmPp]/g, '');
                setPlayDateInput(v);
              }}
              onBlur={(e) => {
                playDateFocused.current = false;
                if (!e.target.value) return;
                const parsed = parseLocalInput(e.target.value);
                if (parsed) {
                  onDateChange(parsed);
                } else {
                  setPlayDateInput(dateToLocalInput(currentDate));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  (e.target as HTMLInputElement).blur();
                }
              }}
              maxLength={22}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                color: '#fbbf24',
                colorScheme: 'dark',
                border: '1px solid rgba(250, 204, 21, 0.4)',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace",
                cursor: 'pointer',
              }}
            />
          </>
        )}
      </div>

      {/* Column headers — above the Year row only */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '60px 1fr auto 1fr',
        gap: '8px',
        padding: '0',
        marginBottom: '-6px',
      }}>
        <div />
        <div style={{ textAlign: 'center', fontSize: '9px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.3px' }}>
          10 Heavenly Stems (10 Elemental Energies)
        </div>
        <div style={{ width: '180px' }} />
        <div style={{ textAlign: 'center', fontSize: '9px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.3px' }}>
          12 Earthly Branches (12 Animal Signs)
        </div>
      </div>

      {/* Four pillar wheel rows */}
      {PILLAR_KEYS.map((key, i) => {
        const pillar = baziResult.pillars[i];
        const isExpanded = expandedZangGan?.pillarKey === key;
        const effectiveStemIdx = lockedIndices[key].stem ?? pillar.stem.index;
        const effectiveBranchIdx = lockedIndices[key].branch ?? pillar.branch.index;
        return (
          <React.Fragment key={key}>
            <PillarWheelRow
              label={PILLAR_LABELS[i]}
              chinese={PILLAR_CHINESE[i]}
              stemIdx={effectiveStemIdx}
              branchIdx={effectiveBranchIdx}
              stemRotation={rotations[key].stem}
              branchRotation={rotations[key].branch}
              isDay={key === 'day'}
              wheelSize={wheelSize}
              onStep={handleStep}
              onStartMomentum={startMomentum}
              onStopMomentum={stopMomentum}
              onBranchClick={(branchIdx) => handleBranchClick(key, branchIdx)}
              selectedBranchIdx={isExpanded ? expandedZangGan!.branchIdx : null}
              dayMasterElement={dayMasterElement}
              dayMasterPolarity={dayMasterPolarity}
              season={monthSeason}
              dateRange={pillarDateRanges[key]}
              boundaryNav={boundaryNav?.[key] ?? null}
              onBoundaryJump={handleBoundaryJump}
              boundaryLoading={solarTermLoading}
              playMode={playMode}
              onPlayModeSegmentClick={(wheelType, targetIdx) => handlePlayModeClick(key, wheelType, targetIdx)}
              lockedStem={lockedIndices[key].stem}
              lockedBranch={lockedIndices[key].branch}
              onToggleLock={(wheelType) => handleToggleLock(key, wheelType)}
              onInfoClick={onPillarInfoClick}
              extraLabel={key === 'month' ? (
                <button
                  type="button"
                  onClick={() => { setShowSeasons(s => !s); setSeasonsPanelPos(null); }}
                  style={{
                    marginTop: '6px',
                    padding: '4px 10px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: showSeasons ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.08)',
                    border: `1px solid ${showSeasons ? 'rgba(168, 85, 247, 0.5)' : 'rgba(168, 85, 247, 0.25)'}`,
                    color: showSeasons ? '#c084fc' : '#a78bfa',
                    transition: 'all 0.2s',
                  }}
                >
                  Seasons
                </button>
              ) : key === 'day' ? (
                <button
                  type="button"
                  onClick={() => { setShowDayMaster(s => !s); setDayMasterPanelPos(null); }}
                  style={{
                    marginTop: '6px',
                    padding: '4px 10px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: showDayMaster ? 'rgba(234, 179, 8, 0.2)' : 'rgba(234, 179, 8, 0.08)',
                    border: `1px solid ${showDayMaster ? 'rgba(234, 179, 8, 0.5)' : 'rgba(234, 179, 8, 0.25)'}`,
                    color: showDayMaster ? '#fbbf24' : '#d97706',
                    transition: 'all 0.2s',
                  }}
                >
                  Day Master
                </button>
              ) : undefined}
            />
            {lockSearchResult?.pillarKey === key && (
              <div style={{ textAlign: 'center', padding: '4px 0', animation: 'bazi-season-fade 0.3s ease' }}>
                <span style={{
                  display: 'inline-block', fontSize: '11px', padding: '3px 10px', borderRadius: '12px',
                  background: lockSearchResult.found ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                  color: lockSearchResult.found ? '#4ade80' : '#f87171',
                  border: `1px solid ${lockSearchResult.found ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                }}>
                  {lockSearchResult.found
                    ? lockSearchResult.delta === 0
                      ? '✓ Already at this combination'
                      : `✓ Found: ${lockSearchResult.delta > 0 ? '+' : ''}${lockSearchResult.delta} day${Math.abs(lockSearchResult.delta) !== 1 ? 's' : ''}`
                    : '⚠ No valid date (Yin/Yang mismatch)'}
                </span>
              </div>
            )}
            {isExpanded && (
              <ZangGanPanel
                branchIdx={expandedZangGan!.branchIdx}
                onClose={() => setExpandedZangGan(null)}
                dayMasterElement={dayMasterElement}
                dayMasterPolarity={dayMasterPolarity}
                season={monthSeason}
              />
            )}
          </React.Fragment>
        );
      })}

      {/* Seasons floating overlay — covers DAY and HOUR wheel area */}
      {showSeasons && (
        <div
          data-seasons-panel
          style={seasonsPanelPos ? {
            position: 'fixed',
            left: `${seasonsPanelPos.x}px`,
            top: `${seasonsPanelPos.y}px`,
            width: `${seasonsPanelPos.w}px`,
            zIndex: 9999,
            padding: '14px 16px',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            borderRadius: '14px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            overflow: 'visible',
          } : {
            position: 'absolute',
            left: '10px',
            right: '10px',
            top: '52%',
            zIndex: 20,
            padding: '14px 16px',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            borderRadius: '14px',
            overflow: 'visible',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <div
            onMouseDown={handleSeasonsDragStart}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', cursor: 'grab', userSelect: 'none' }}
          >
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#c084fc' }}>
              ☰ Seasonal Cycle — 12 Earthly Branch Months
            </span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setShowSeasonsInfo(v => !v)}
                style={{ background: showSeasonsInfo ? 'rgba(168,85,247,0.25)' : 'rgba(100,116,139,0.15)', border: `1px solid ${showSeasonsInfo ? 'rgba(168,85,247,0.5)' : 'rgba(100,116,139,0.25)'}`, borderRadius: '6px', color: showSeasonsInfo ? '#c084fc' : '#94a3b8', fontSize: '11px', cursor: 'pointer', padding: '2px 8px', fontWeight: 600 }}
              >More Info</button>
              <button
                type="button"
                onClick={() => setShowSeasonalWeighting(v => !v)}
                style={{ background: showSeasonalWeighting ? 'rgba(234,179,8,0.25)' : 'rgba(100,116,139,0.15)', border: `1px solid ${showSeasonalWeighting ? 'rgba(234,179,8,0.5)' : 'rgba(100,116,139,0.25)'}`, borderRadius: '6px', color: showSeasonalWeighting ? '#facc15' : '#94a3b8', fontSize: '11px', cursor: 'pointer', padding: '2px 8px', fontWeight: 600 }}
              >Weights</button>
              <button
                type="button"
                onClick={() => { setShowSeasons(false); setSeasonsPanelPos(null); setShowSeasonsInfo(false); setShowSeasonalWeighting(false); }}
                style={{ background: 'rgba(100,116,139,0.15)', border: '1px solid rgba(100,116,139,0.25)', borderRadius: '6px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', padding: '2px 8px' }}
              >✕</button>
            </div>
          </div>
          {/* More Info popup — appears above the Seasonal Cycle panel */}
          {showSeasonsInfo && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: 0,
              right: 0,
              marginBottom: '6px',
              padding: '14px 18px',
              background: 'rgba(15, 23, 42, 0.97)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              borderRadius: '12px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 -4px 24px rgba(0,0,0,0.5)',
              fontSize: '12px',
              lineHeight: '1.6',
              color: '#e2e8f0',
              maxHeight: '340px',
              overflowY: 'auto',
              zIndex: 10,
            }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#c084fc', marginBottom: '8px' }}>Understanding the Seasonal Cycle</div>

              <p style={{ margin: '0 0 8px' }}>Total 4 Seasons. Each season has 3 months.<br />
              The first two months of a season consist of its native element.<br />
              The native elements for each of the 4 Seasons are <span style={{ color: '#4ade80' }}>Wood</span>, <span style={{ color: '#f87171' }}>Fire</span>, <span style={{ color: '#e2e8f0' }}>Metal</span>, <span style={{ color: '#60a5fa' }}>Water</span></p>

              <div style={{ margin: '0 0 8px', paddingLeft: '8px', borderLeft: '2px solid rgba(168,85,247,0.3)' }}>
                <div><span style={{ color: '#4ade80', fontWeight: 600 }}>Spring Season (Wood)</span>, for Tiger and Rabbit, 1st and 2nd month</div>
                <div><span style={{ color: '#f87171', fontWeight: 600 }}>Summer Season (Fire)</span>, for Snake and Horse, 1st and 2nd month</div>
                <div><span style={{ color: '#e2e8f0', fontWeight: 600 }}>Autumn Season (Metal)</span>, for Monkey and Rooster, 1st and 2nd month</div>
                <div><span style={{ color: '#60a5fa', fontWeight: 600 }}>Winter Season (Water)</span>, for Pig and Rat, 1st and 2nd month</div>
              </div>

              <p style={{ margin: '0 0 8px' }}>The third month, the last month of a season is a <span style={{ color: '#fbbf24', fontWeight: 600 }}>Transition</span> month.<br />
              Transition from one season to the next: Spring to Summer, Summer to Autumn, Autumn to Winter, Winter back to Spring.<br />
              The element for the Transition month is <span style={{ color: '#fbbf24', fontWeight: 600 }}>Earth</span>.<br />
              This is why Earth has 4 animals (Dragon, Goat, Dog, Ox) — they{"'"}re the seasonal bridges, called <span style={{ color: '#fbbf24' }}>墓库</span> (storage/tomb) branches.</p>

              <div style={{ fontWeight: 700, fontSize: '12px', color: '#c084fc', marginBottom: '6px' }}>Putting it together:</div>
              <div style={{ paddingLeft: '8px', borderLeft: '2px solid rgba(168,85,247,0.3)' }}>
                <div><span style={{ color: '#4ade80', fontWeight: 600 }}>Spring (Wood)</span> — Tiger and Rabbit, 1st and 2nd month</div>
                <div style={{ paddingLeft: '12px', color: '#fbbf24' }}>Transition: Dragon (Earth), 3rd month</div>
                <div style={{ marginTop: '4px' }}><span style={{ color: '#f87171', fontWeight: 600 }}>Summer (Fire)</span> — Snake and Horse, 1st and 2nd month</div>
                <div style={{ paddingLeft: '12px', color: '#fbbf24' }}>Transition: Goat (Earth), 3rd month</div>
                <div style={{ marginTop: '4px' }}><span style={{ color: '#e2e8f0', fontWeight: 600 }}>Autumn (Metal)</span> — Monkey and Rooster, 1st and 2nd month</div>
                <div style={{ paddingLeft: '12px', color: '#fbbf24' }}>Transition: Dog (Earth), 3rd month</div>
                <div style={{ marginTop: '4px' }}><span style={{ color: '#60a5fa', fontWeight: 600 }}>Winter (Water)</span> — Pig and Rat, 1st and 2nd month</div>
                <div style={{ paddingLeft: '12px', color: '#fbbf24' }}>Transition: Ox (Earth), 3rd month</div>
              </div>

              <p style={{ margin: '8px 0 0', fontStyle: 'italic', color: '#94a3b8' }}>The native element for each Chinese Zodiac Animal is summarized in the Seasonal Cycle Table.</p>
            </div>
          )}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(168, 85, 247, 0.2)' }}>
                <th style={{ padding: '6px 8px', textAlign: 'left', color: '#a78bfa', fontWeight: 700, fontSize: '11px' }}>Season</th>
                <th style={{ padding: '6px 8px', textAlign: 'left', color: '#a78bfa', fontWeight: 700, fontSize: '11px' }}>Branch</th>
                <th style={{ padding: '6px 8px', textAlign: 'left', color: '#a78bfa', fontWeight: 700, fontSize: '11px' }}>Element</th>
                <th style={{ padding: '6px 8px', textAlign: 'left', color: '#a78bfa', fontWeight: 700, fontSize: '11px' }}>Solar Term</th>
                <th style={{ padding: '6px 8px', textAlign: 'left', color: '#a78bfa', fontWeight: 700, fontSize: '11px' }}>Start → End</th>
              </tr>
            </thead>
            <tbody>
              {(seasonTableData ?? SEASON_TABLE_ROWS.map(row => ({ row, startDate: null, endDate: null }))).map(({ row, startDate, endDate }, idx) => {
                const isActive = baziResult?.pillars?.[1]?.branch?.index === row.branchIdx;
                const showSeasonLabel = idx === 0 || row.season !== SEASON_TABLE_ROWS[idx - 1].season;
                const elColor = SEASON_ELEMENT_COLORS[row.element] || '#94a3b8';
                return (
                  <tr
                    key={row.branchIdx}
                    onClick={() => {
                      if (startDate) {
                        // Add 1 minute past the boundary to ensure we're in the new month
                        onDateChange(new Date(startDate.getTime() + 60000));
                      }
                    }}
                    style={{
                      cursor: startDate ? 'pointer' : 'default',
                      background: isActive ? 'rgba(168, 85, 247, 0.18)' : (SEASON_BG[row.season] || 'transparent'),
                      borderLeft: isActive ? '3px solid #a78bfa' : '3px solid transparent',
                      transition: 'background 0.15s',
                      borderBottom: row.isTransition ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = SEASON_BG[row.season] || 'transparent'; }}
                  >
                    <td style={{ padding: '5px 8px', color: '#e2e8f0', fontWeight: showSeasonLabel ? 700 : 400, fontSize: showSeasonLabel ? '12px' : '11px' }}>
                      {showSeasonLabel ? row.season : ''}
                    </td>
                    <td style={{ padding: '5px 8px', whiteSpace: 'nowrap' }}>
                      <span style={{ color: elColor, fontWeight: 700, fontSize: '14px' }}>{row.char}</span>
                      <span style={{ color: '#e2e8f0', marginLeft: '6px', fontWeight: isActive ? 700 : 400 }}>{row.polarity} {row.animal}</span>
                    </td>
                    <td style={{ padding: '5px 8px', color: elColor, fontWeight: 600 }}>
                      {row.element}
                      {row.isTransition && <span style={{ color: '#94a3b8', fontSize: '10px', marginLeft: '4px' }}>↻ transition</span>}
                    </td>
                    <td style={{ padding: '5px 8px', whiteSpace: 'nowrap' }}>
                      <span style={{ color: '#c084fc', fontWeight: 600 }}>{row.termName}</span>
                      <span style={{ color: '#cbd5e1', marginLeft: '5px' }}>{row.termEnglish}</span>
                    </td>
                    <td style={{ padding: '5px 8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#cbd5e1', whiteSpace: 'nowrap' }}>
                      {startDate ? formatDate(startDate) : '~'}
                      <span style={{ margin: '0 4px', color: '#64748b' }}>→</span>
                      {endDate ? formatDate(endDate) : '~'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Seasonal Element Weighting table — toggled by Weights button */}
          {showSeasonalWeighting && (() => {
            const monthBranchChar = baziResult?.pillars?.[1]?.branch?.char;
            const borderColor = 'rgba(148, 163, 184, 0.15)';
            const allRows = SEASONAL_REFERENCE.flatMap(sg =>
              sg.branches.map((b, i) => ({ ...b, season: sg.season, emoji: sg.emoji, chinese: sg.chinese, isFirstInSeason: i === 0, seasonSize: sg.branches.length }))
            );
            return (
              <div style={{ marginTop: '12px', borderTop: '1px solid rgba(168, 85, 247, 0.2)', paddingTop: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#facc15', marginBottom: '8px' }}>
                  🌏 Seasonal Element Weighting — Five Element Multipliers per Month
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', minWidth: '620px' }}>
                    <thead>
                      <tr style={{ background: 'rgba(30, 41, 59, 0.5)' }}>
                        <th style={{ padding: '7px 8px', textAlign: 'left', fontWeight: 700, color: '#cbd5e1', borderBottom: `2px solid ${borderColor}`, fontSize: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Season</th>
                        <th style={{ padding: '7px 6px', textAlign: 'left', fontWeight: 700, color: '#cbd5e1', borderBottom: `2px solid ${borderColor}`, fontSize: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Branch</th>
                        <th style={{ padding: '7px 6px', textAlign: 'left', fontWeight: 700, color: '#cbd5e1', borderBottom: `2px solid ${borderColor}`, fontSize: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Elem</th>
                        <th style={{ padding: '7px 6px', textAlign: 'left', fontWeight: 700, color: '#94a3b8', borderBottom: `2px solid ${borderColor}`, fontSize: '9px' }}>Solar Term</th>
                        {['Wood', 'Fire', 'Earth', 'Metal', 'Water'].map(el => (
                          <th key={el} style={{ padding: '7px 5px', textAlign: 'center', fontWeight: 700, color: SW_ELEM_COLORS[el.toLowerCase()], borderBottom: `2px solid ${borderColor}`, fontSize: '10px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '2px', background: SW_ELEM_COLORS[el.toLowerCase()] }} />
                              {el}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {allRows.map((row, idx) => {
                        const weights = getSeasonalWeights(row.char);
                        const isActive = row.char === monthBranchChar;
                        const isLastInSeason = idx < allRows.length - 1 && allRows[idx + 1]?.isFirstInSeason;
                        const seasonBorder = isLastInSeason ? `2px solid rgba(148, 163, 184, 0.25)` : `1px solid ${borderColor}`;
                        return (
                          <tr key={row.char} style={{ background: isActive ? 'rgba(234, 179, 8, 0.12)' : 'transparent', transition: 'background 0.2s' }}>
                            {row.isFirstInSeason && (
                              <td rowSpan={row.seasonSize} style={{ padding: '6px 8px', fontWeight: 700, fontSize: '11px', color: '#e2e8f0', borderBottom: seasonBorder, verticalAlign: 'middle', background: 'rgba(30, 41, 59, 0.3)', borderRight: `1px solid ${borderColor}`, whiteSpace: 'nowrap' }}>
                                <div>{row.emoji} {row.season}</div>
                                <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 400 }}>({row.chinese})</div>
                              </td>
                            )}
                            <td style={{ padding: '5px 6px', borderBottom: seasonBorder, whiteSpace: 'nowrap' }}>
                              <span style={{ fontSize: '13px', fontFamily: "'Noto Serif SC', serif", color: '#f8fafc' }}>{row.char}</span>
                              <span style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '10px', marginLeft: '5px' }}>{row.polarity} {row.animal}</span>
                              {isActive && <span style={{ fontSize: '7px', fontWeight: 700, color: '#facc15', background: 'rgba(250,204,21,0.15)', padding: '1px 4px', borderRadius: '3px', border: '1px solid rgba(250,204,21,0.3)', marginLeft: '4px' }}>YOU</span>}
                            </td>
                            <td style={{ padding: '5px 6px', borderBottom: seasonBorder }}>
                              <span style={{ fontSize: '9px', fontWeight: 700, color: SW_ELEM_COLORS[row.element.toLowerCase()], background: `${SW_ELEM_COLORS[row.element.toLowerCase()]}18`, padding: '1px 5px', borderRadius: '3px', border: `1px solid ${SW_ELEM_COLORS[row.element.toLowerCase()]}40` }}>{row.element}</span>
                              {row.earthTransition && <span style={{ fontSize: '8px', color: '#f59e0b', marginLeft: '3px', fontWeight: 600 }}>四季土</span>}
                            </td>
                            <td style={{ padding: '5px 6px', borderBottom: seasonBorder, color: '#e2e8f0', fontSize: '9px', fontStyle: 'italic' }}>{row.term}</td>
                            {(['wood', 'fire', 'earth', 'metal', 'water'] as const).map(el => {
                              const w = weights[el];
                              const isMax = w === 1.0;
                              const isHigh = w >= 0.8;
                              return (
                                <td key={el} style={{ padding: '5px 4px', textAlign: 'center', borderBottom: seasonBorder, fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: isMax ? 800 : isHigh ? 700 : 500, color: isMax ? SW_ELEM_COLORS[el] : isHigh ? SW_ELEM_COLORS[el] : '#e2e8f0', background: isMax ? `${SW_ELEM_COLORS[el]}15` : 'transparent' }}>
                                  {w.toFixed(1)}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Day Master analysis floating panel */}
      {showDayMaster && dayMasterAnalysis && (() => {
        const a = dayMasterAnalysis;
        const DM_EL_COLORS: Record<string, string> = { Wood: '#4ade80', Fire: '#f87171', Earth: '#fbbf24', Metal: '#e2e8f0', Water: '#60a5fa' };
        const REL_COLORS: Record<string, string> = { self: '#4ade80', resource: '#60a5fa', output: '#fbbf24', power: '#f87171', wealth: '#c084fc' };
        const REL_ICONS: Record<string, string> = { self: '+', resource: '+', output: '-', power: '-', wealth: '-' };
        // Group steps by pillar position
        const groups: Array<{ title: string; steps: DayMasterStep[] }> = [];
        let currentGroup: { title: string; steps: DayMasterStep[] } | null = null;
        for (const step of a.steps) {
          const groupKey = step.label.startsWith('Month Hidden') ? 'Month Hidden Stems (藏干)'
            : step.label.startsWith('Day Seat') ? `Day Seat — ${step.label.match(/\((.+)\)/)?.[1] || 'sitting'}`
            : step.label.startsWith('Year Branch') ? `Year Hidden Stems (${step.label.match(/\((.+)\)/)?.[1] || ''})`
            : step.label.startsWith('Hour Branch') ? `Hour Hidden Stems (${step.label.match(/\((.+)\)/)?.[1] || ''})`
            : step.label;
          if (!currentGroup || currentGroup.title !== groupKey) {
            currentGroup = { title: groupKey, steps: [] };
            groups.push(currentGroup);
          }
          currentGroup.steps.push(step);
        }

        return (
          <div
            data-daymaster-panel
            style={dayMasterPanelPos ? {
              position: 'fixed',
              left: `${dayMasterPanelPos.x}px`,
              top: `${dayMasterPanelPos.y}px`,
              width: `${dayMasterPanelPos.w}px`,
              zIndex: 9999,
              padding: '14px 16px',
              background: 'rgba(15, 23, 42, 0.97)',
              border: '1px solid rgba(234, 179, 8, 0.4)',
              borderRadius: '14px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              maxHeight: '75vh',
              overflowY: 'auto',
            } : {
              position: 'absolute',
              left: '10px',
              right: '10px',
              top: '6%',
              zIndex: 20,
              padding: '14px 16px',
              background: 'rgba(15, 23, 42, 0.97)',
              border: '1px solid rgba(234, 179, 8, 0.4)',
              borderRadius: '14px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              maxHeight: '75vh',
              overflowY: 'auto',
            }}
          >
            {/* Title bar — draggable */}
            <div
              onMouseDown={handleDayMasterDragStart}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', cursor: 'grab', userSelect: 'none' }}
            >
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#fbbf24' }}>
                ☰ Day Master Strength Analysis
              </span>
              <button
                type="button"
                onClick={() => { setShowDayMaster(false); setDayMasterPanelPos(null); }}
                style={{ background: 'rgba(100,116,139,0.15)', border: '1px solid rgba(100,116,139,0.25)', borderRadius: '6px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', padding: '2px 8px' }}
              >✕</button>
            </div>

            {/* Content */}
            <div>

            {/* Day Master identification */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', marginBottom: '12px',
              background: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.2)', borderRadius: '10px',
            }}>
              <span style={{ fontSize: '28px', color: a.dmColor, fontWeight: 700 }}>{a.dmChar}</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: a.dmColor }}>
                  {a.dmPolarity} {a.dmElement} — Day Master (日主)
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                  Starting Strength: <span style={{ color: '#e2e8f0', fontWeight: 600 }}>50%</span> (neutral baseline)
                </div>
              </div>
            </div>

            {/* Starting baseline row */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '6px 10px', marginBottom: '10px',
              background: 'rgba(234, 179, 8, 0.06)', borderRadius: '6px',
              borderLeft: '3px solid rgba(234, 179, 8, 0.4)',
            }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#fbbf24' }}>Starting Strength</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0', fontFamily: "'JetBrains Mono', monospace" }}>50%</span>
            </div>

            {/* Step-by-step analysis */}
            {groups.map((group, gi) => (
              <div key={gi} style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Step {gi + 1}: {group.title}
                </div>
                {group.steps.map((step, si) => {
                  const isPositive = step.adjustment > 0;
                  const adjColor = isPositive ? '#4ade80' : step.adjustment < 0 ? '#f87171' : '#94a3b8';
                  const relColor = REL_COLORS[step.relation] || '#94a3b8';
                  return (
                    <div key={si} style={{
                      display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 10px', marginBottom: '2px',
                      background: 'rgba(255,255,255,0.02)', borderRadius: '6px',
                      borderLeft: `3px solid ${relColor}`,
                    }}>
                      {/* Source info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', color: '#e2e8f0' }}>
                          <span style={{ color: DM_EL_COLORS[step.element] || '#e2e8f0', fontWeight: 600 }}>{step.source}</span>
                        </div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '1px' }}>
                          {step.tenGod && (
                            <span style={{ color: relColor, fontWeight: 600 }}>{step.tenGod.chinese} {step.tenGod.english}</span>
                          )}
                          {step.tenGod && ' — '}{step.effect}
                        </div>
                      </div>
                      {/* Adjustment */}
                      <div style={{ textAlign: 'right', minWidth: '50px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: adjColor, fontFamily: "'JetBrains Mono', monospace" }}>
                          {isPositive ? '+' : ''}{step.adjustment}%
                        </div>
                      </div>
                      {/* Running total */}
                      <div style={{ textAlign: 'right', minWidth: '42px' }}>
                        <div style={{ fontSize: '11px', color: '#cbd5e1', fontFamily: "'JetBrains Mono', monospace" }}>
                          {Math.round(step.runningTotal)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Final result */}
            <div style={{
              marginTop: '8px', padding: '12px 14px',
              background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '10px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24' }}>Final Day Master Strength</span>
                <span style={{ fontSize: '20px', fontWeight: 700, color: a.finalScore >= 50 ? '#4ade80' : '#f87171', fontFamily: "'JetBrains Mono', monospace" }}>
                  {a.finalScore}%
                </span>
              </div>
              {/* Progress bar */}
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
                <div style={{
                  height: '100%',
                  width: `${a.finalScore}%`,
                  background: a.finalScore >= 55 ? 'linear-gradient(90deg, #4ade80, #22c55e)' :
                    a.finalScore >= 45 ? 'linear-gradient(90deg, #fbbf24, #f59e0b)' :
                    'linear-gradient(90deg, #f87171, #ef4444)',
                  borderRadius: '4px',
                  transition: 'width 0.5s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b' }}>
                <span>Weak 弱</span>
                <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '12px' }}>{a.assessment}</span>
                <span>Strong 旺</span>
              </div>
            </div>

            {/* Legend */}
            <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '10px' }}>
              {[
                { label: 'Self 比', color: REL_COLORS.self, sign: '+' },
                { label: 'Resource 印', color: REL_COLORS.resource, sign: '+' },
                { label: 'Output 泄', color: REL_COLORS.output, sign: '-' },
                { label: 'Power 官', color: REL_COLORS.power, sign: '-' },
                { label: 'Wealth 财', color: REL_COLORS.wealth, sign: '-' },
              ].map(l => (
                <span key={l.label} style={{ color: l.color, fontWeight: 600 }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', background: l.color, borderRadius: '2px', marginRight: '3px', verticalAlign: 'middle' }} />
                  {l.sign} {l.label}
                </span>
              ))}
            </div>

            {/* Explanation section */}
            <div style={{ marginTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24', marginBottom: '8px' }}>
                What Day Master Strength Means
              </div>
              <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '10px' }}>
                Your score of <span style={{ fontWeight: 700, color: a.finalScore >= 50 ? '#4ade80' : '#f87171' }}>{a.finalScore}%</span> = <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{a.assessment}</span>{a.finalScore >= 45 && a.finalScore < 55 ? ', leaning slightly ' + (a.finalScore >= 50 ? 'strong' : 'weak') : ''}. In BaZi:
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: '10px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(234, 179, 8, 0.2)' }}>
                    <th style={{ padding: '4px 6px', textAlign: 'left', color: '#fbbf24', fontWeight: 700 }}>Strength</th>
                    <th style={{ padding: '4px 6px', textAlign: 'left', color: '#fbbf24', fontWeight: 700 }}>What it means</th>
                    <th style={{ padding: '4px 6px', textAlign: 'left', color: '#fbbf24', fontWeight: 700 }}>What helps</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { range: 'Strong (65%+)', means: 'Too much self-energy — needs outlets', helps: 'Wealth (spend energy), Output (express/create), Power (discipline)', min: 65, max: 100 },
                    { range: 'Slightly Strong (55-64%)', means: 'Confident, self-reliant', helps: 'Moderate draining is healthy', min: 55, max: 64 },
                    { range: 'Balanced (45-54%)', means: 'Harmonious — adaptable', helps: 'Already in good shape', min: 45, max: 54 },
                    { range: 'Slightly Weak (35-44%)', means: 'Needs support', helps: 'Resource (learning, mentors), Self (friends, allies)', min: 35, max: 44 },
                    { range: 'Weak (<35%)', means: 'Easily overwhelmed', helps: 'Strongly needs Resource and Self elements', min: 0, max: 34 },
                  ].map(row => {
                    const isYou = a.finalScore >= row.min && a.finalScore <= row.max;
                    return (
                      <tr key={row.range} style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        background: isYou ? 'rgba(234, 179, 8, 0.1)' : 'transparent',
                        borderLeft: isYou ? '3px solid #fbbf24' : '3px solid transparent',
                      }}>
                        <td style={{ padding: '4px 6px', color: isYou ? '#fbbf24' : '#94a3b8', fontWeight: isYou ? 700 : 400, whiteSpace: 'nowrap' }}>{row.range}</td>
                        <td style={{ padding: '4px 6px', color: isYou ? '#e2e8f0' : '#94a3b8' }}>{row.means}</td>
                        <td style={{ padding: '4px 6px', color: isYou ? '#e2e8f0' : '#94a3b8' }}>{row.helps}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Personalized interpretation */}
              {(() => {
                const dmColor = DM_EL_COLORS[a.dmElement] || '#e2e8f0';
                // Find main supports and drains
                const supports = a.steps.filter(s => s.adjustment > 0).sort((x, y) => y.adjustment - x.adjustment);
                const drains = a.steps.filter(s => s.adjustment < 0).sort((x, y) => x.adjustment - y.adjustment);
                const topSupport = supports[0];
                const topDrain = drains[0];
                // Determine what elements help
                const needsHelp = a.finalScore < 50;
                const resourceEl = { Wood: 'Water', Fire: 'Wood', Earth: 'Fire', Metal: 'Earth', Water: 'Metal' }[a.dmElement] || '';
                const resourceColor = DM_EL_COLORS[resourceEl] || '#e2e8f0';
                return (
                  <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.6 }}>
                    For you at <span style={{ fontWeight: 700, color: a.finalScore >= 50 ? '#4ade80' : '#f87171' }}>{a.finalScore}%</span>: your{' '}
                    <span style={{ fontWeight: 700, color: dmColor }}>{a.dmPolarity} {a.dmElement}</span> is{' '}
                    <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{a.assessment.toLowerCase()}</span>
                    {needsHelp ? ' — could use more support' : a.finalScore >= 55 ? ' — has abundant energy' : ' — in good balance'}.
                    {topSupport && (
                      <> The biggest boost comes from <span style={{ fontWeight: 600, color: DM_EL_COLORS[topSupport.element] || '#e2e8f0' }}>{topSupport.source.split('(')[0].trim()}</span> ({topSupport.tenGod?.english || 'support'}, <span style={{ color: '#4ade80' }}>+{topSupport.adjustment}%</span>).</>
                    )}
                    {topDrain && (
                      <> The main draw is <span style={{ fontWeight: 600, color: DM_EL_COLORS[topDrain.element] || '#e2e8f0' }}>{topDrain.source.split('(')[0].trim()}</span> ({topDrain.tenGod?.english || 'drain'}, <span style={{ color: '#f87171' }}>{topDrain.adjustment}%</span>).</>
                    )}
                    {needsHelp && (
                      <> <span style={{ color: resourceColor, fontWeight: 600 }}>Resource ({resourceEl})</span> and <span style={{ color: dmColor, fontWeight: 600 }}>Self ({a.dmElement})</span> elements are beneficial.</>
                    )}
                  </div>
                );
              })()}
            </div>

            </div>
          </div>
        );
      })()}

      {/* Cycle jump buttons — below wheel rows */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        marginTop: '6px',
        marginBottom: '10px',
        flexWrap: 'wrap',
        position: 'relative',
        zIndex: 10,
      }}>
        <span style={{ fontSize: '10px', color: '#94a3b8', marginRight: '4px' }}>Cycle Jump:</span>
        <button onClick={() => handleCycleJump({ years: -12 })} style={CYCLE_BTN_STYLE}>-12yr</button>
        <button onClick={() => handleCycleJump({ years: 12 })} style={CYCLE_BTN_STYLE}>+12yr</button>
        <button onClick={() => handleCycleJump({ years: -6 })} style={CYCLE_BTN_STYLE}>-6yr</button>
        <button onClick={() => handleCycleJump({ years: 6 })} style={CYCLE_BTN_STYLE}>+6yr</button>
        <span style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />
        <button onClick={() => handleCycleJump({ months: -6 })} style={CYCLE_BTN_STYLE}>-6mo</button>
        <button onClick={() => handleCycleJump({ months: 6 })} style={CYCLE_BTN_STYLE}>+6mo</button>
        <span style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />
        <button onClick={() => handleCycleJump({ days: -6 })} style={CYCLE_BTN_STYLE}>-6day</button>
        <button onClick={() => handleCycleJump({ days: 6 })} style={CYCLE_BTN_STYLE}>+6day</button>
        <span style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />
        <button onClick={() => handleCycleJump({ hours: -12 })} style={CYCLE_BTN_STYLE}>-12hr</button>
        <button onClick={() => handleCycleJump({ hours: 12 })} style={CYCLE_BTN_STYLE}>+12hr</button>
      </div>

      {/* Energy flow bar — below all wheel rows */}
      <EnergyFlowBar pillars={baziResult.pillars} />
    </div>
  );
};

// =============================================================================
// HELPERS
// =============================================================================

function nearestRotation(current: number, target: number, period: number): number {
  const diff = target - current;
  const normalizedDiff = ((diff % period) + period + period / 2) % period - period / 2;
  return current + normalizedDiff;
}

/** Format 24h hour to "H:MM AM/PM" */
function fmt12(hour: number, minute = 0): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${String(minute).padStart(2, '0')} ${period}`;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d} ${fmt12(date.getHours(), date.getMinutes())}`;
}

function isToday(date: Date): boolean {
  const now = new Date();
  return date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate();
}

/** Get the 2-hour Shi Chen window string for a date, e.g. "1:00 PM - 3:00 PM" */
function getShiChenWindow(date: Date): string {
  const h = date.getHours();
  const idx = Math.floor((h + 1) / 2) % 12;
  const start = idx === 0 ? 23 : 2 * idx - 1;
  const end = (start + 2) % 24;
  return `${fmt12(start)} - ${fmt12(end)}`;
}

/** Convert Date to YYYY-MM-DD h:mm AM/PM display format */
function dateToLocalInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hours = date.getHours();
  const h12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const ampm = hours < 12 ? 'AM' : 'PM';
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h12}:${min} ${ampm}`;
}

/** Parse "YYYY-MM-DD h:mm AM/PM" or "YYYY-MM-DD HH:mm" text back to Date */
function parseLocalInput(val: string): Date | null {
  // Try AM/PM format first (require exactly 4-digit year, valid month 1-12, day 1-31, hour 1-12)
  const ampmMatch = val.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);
  if (ampmMatch) {
    const [, yr, mo, dy, hrStr, mn, period] = ampmMatch;
    if (+yr < 1 || +yr > 9999 || +mo < 1 || +mo > 12 || +dy < 1 || +dy > 31) return null;
    if (+hrStr < 1 || +hrStr > 12 || +mn > 59) return null;
    let hr = +hrStr;
    if (period.toUpperCase() === 'PM' && hr !== 12) hr += 12;
    if (period.toUpperCase() === 'AM' && hr === 12) hr = 0;
    const date = new Date(+yr, +mo - 1, +dy, hr, +mn);
    if (isNaN(date.getTime()) || date.getFullYear() !== +yr) return null;
    return date;
  }
  // Fallback: 24-hour format (require exactly 4-digit year)
  const match = val.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const [, yr, mo, dy, hr, mn] = match;
  if (+yr < 1 || +yr > 9999 || +mo < 1 || +mo > 12 || +dy < 1 || +dy > 31) return null;
  if (+hr > 23 || +mn > 59) return null;
  const date = new Date(+yr, +mo - 1, +dy, +hr, +mn);
  if (isNaN(date.getTime()) || date.getFullYear() < 1 || date.getFullYear() > 9999) return null;
  return date;
}

/** Format date for Play Mode result display */
function formatPlayModeResult(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d} ${getShiChenWindow(date)}`;
}

/**
 * Compute approximate date-range strings for each pillar.
 * Year/month boundaries follow Jie (节) solar-term transitions.
 * Hour boundaries follow the traditional 2-hour Shi Chen (时辰) system.
 */
function getPillarDateRanges(date: Date): Record<PillarKey, string> {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();
  const hour = date.getHours();
  const MN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // --- Year: Li Chun (~Feb 4) to day before next Li Chun (~Feb 3) ---
  const beforeLichun = month < 2 || (month === 2 && day < 4);
  const baziYear = beforeLichun ? year - 1 : year;
  const yearRange = `Feb 4, ${baziYear} – Feb 3, ${baziYear + 1}`;

  // --- Month: Jie (节) term boundaries in calendar order ---
  // [month, day] of each Jie that starts a new BaZi month
  const JIE: [number, number][] = [
    [1, 6],   // Xiaohan  → Ox 丑
    [2, 4],   // Lichun   → Tiger 寅
    [3, 6],   // Jingzhe  → Rabbit 卯
    [4, 5],   // Qingming → Dragon 辰
    [5, 6],   // Lixia    → Snake 巳
    [6, 6],   // Mangzhong→ Horse 午
    [7, 7],   // Xiaoshu  → Goat 未
    [8, 7],   // Liqiu    → Monkey 申
    [9, 8],   // Bailu    → Rooster 酉
    [10, 8],  // Hanlu    → Dog 戌
    [11, 7],  // Lidong   → Pig 亥
    [12, 7],  // Daxue    → Rat 子
  ];

  let curJie = JIE.length - 1;
  for (let i = 0; i < JIE.length; i++) {
    const [jm, jd] = JIE[i];
    if (month < jm || (month === jm && day < jd)) {
      curJie = (i - 1 + JIE.length) % JIE.length;
      break;
    }
  }
  const [sm, sd] = JIE[curJie];
  const [em, ed] = JIE[(curJie + 1) % JIE.length];
  const monthRange = `${MN[sm - 1]} ${sd} – ${MN[em - 1]} ${ed - 1}`;

  // --- Day: the specific date ---
  const dayRange = `${MN[month - 1]} ${day}, ${year}`;

  // --- Hour: 2-hour Shi Chen windows (AM/PM) ---
  const HR: string[] = [
    '11:00 PM – 1:00 AM', '1:00 AM – 3:00 AM', '3:00 AM – 5:00 AM', '5:00 AM – 7:00 AM',
    '7:00 AM – 9:00 AM', '9:00 AM – 11:00 AM', '11:00 AM – 1:00 PM', '1:00 PM – 3:00 PM',
    '3:00 PM – 5:00 PM', '5:00 PM – 7:00 PM', '7:00 PM – 9:00 PM', '9:00 PM – 11:00 PM',
  ];
  const hIdx = hour === 23 ? 0 : Math.floor((hour + 1) / 2);
  const hourRange = HR[hIdx];

  return { year: yearRange, month: monthRange, day: dayRange, hour: hourRange };
}

// =============================================================================
// SEASONS TABLE DATA
// =============================================================================

/** The 12 BaZi months in seasonal order (starting from Tiger = 1st month of Spring) */
const SEASON_TABLE_ROWS: Array<{
  season: string;
  branchIdx: number;
  char: string;
  animal: string;
  element: string;
  polarity: string;
  termName: string;
  termEnglish: string;
  isTransition: boolean;
}> = [
  { season: 'Spring', branchIdx: 2,  char: '寅', animal: 'Tiger',   element: 'Wood',  polarity: 'Yang', termName: '立春', termEnglish: 'Spring Begins',      isTransition: false },
  { season: 'Spring', branchIdx: 3,  char: '卯', animal: 'Rabbit',  element: 'Wood',  polarity: 'Yin',  termName: '驚蟄', termEnglish: 'Awakening Insects',  isTransition: false },
  { season: 'Spring', branchIdx: 4,  char: '辰', animal: 'Dragon',  element: 'Earth', polarity: 'Yang', termName: '清明', termEnglish: 'Clear & Bright',     isTransition: true  },
  { season: 'Summer', branchIdx: 5,  char: '巳', animal: 'Snake',   element: 'Fire',  polarity: 'Yin',  termName: '立夏', termEnglish: 'Summer Begins',      isTransition: false },
  { season: 'Summer', branchIdx: 6,  char: '午', animal: 'Horse',   element: 'Fire',  polarity: 'Yang', termName: '芒種', termEnglish: 'Grain in Ear',       isTransition: false },
  { season: 'Summer', branchIdx: 7,  char: '未', animal: 'Goat',    element: 'Earth', polarity: 'Yin',  termName: '小暑', termEnglish: 'Minor Heat',         isTransition: true  },
  { season: 'Autumn', branchIdx: 8,  char: '申', animal: 'Monkey',  element: 'Metal', polarity: 'Yang', termName: '立秋', termEnglish: 'Autumn Begins',      isTransition: false },
  { season: 'Autumn', branchIdx: 9,  char: '酉', animal: 'Rooster', element: 'Metal', polarity: 'Yin',  termName: '白露', termEnglish: 'White Dew',          isTransition: false },
  { season: 'Autumn', branchIdx: 10, char: '戌', animal: 'Dog',     element: 'Earth', polarity: 'Yang', termName: '寒露', termEnglish: 'Cold Dew',           isTransition: true  },
  { season: 'Winter', branchIdx: 11, char: '亥', animal: 'Pig',     element: 'Water', polarity: 'Yin',  termName: '立冬', termEnglish: 'Winter Begins',      isTransition: false },
  { season: 'Winter', branchIdx: 0,  char: '子', animal: 'Rat',     element: 'Water', polarity: 'Yang', termName: '大雪', termEnglish: 'Major Snow',         isTransition: false },
  { season: 'Winter', branchIdx: 1,  char: '丑', animal: 'Ox',      element: 'Earth', polarity: 'Yin',  termName: '小寒', termEnglish: 'Minor Cold',         isTransition: true  },
];

const SEASON_ELEMENT_COLORS: Record<string, string> = {
  Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#a1a1aa', Water: '#3b82f6',
};

const SEASON_BG: Record<string, string> = {
  Spring: 'rgba(34, 197, 94, 0.06)',
  Summer: 'rgba(239, 68, 68, 0.06)',
  Autumn: 'rgba(161, 161, 170, 0.06)',
  Winter: 'rgba(59, 130, 246, 0.06)',
};

/**
 * Build season table with exact dates from the solar term API data.
 * Returns enriched rows with start/end dates.
 */
function buildSeasonTableData(
  solarTermData: Map<number, any>,
  currentDate: Date,
): Array<{ row: typeof SEASON_TABLE_ROWS[0]; startDate: Date | null; endDate: Date | null }> {
  // Collect all Jie (month boundary) terms, deduplicate, sort
  const seen = new Set<string>();
  const jies: Array<{ name: string; english: string; date: Date }> = [];
  for (const [, data] of solarTermData) {
    if (!data?.solarTerms) continue;
    for (const t of data.solarTerms) {
      if (!t.isBaziMonthBoundary || seen.has(t.isoString)) continue;
      seen.add(t.isoString);
      jies.push({ name: t.name, english: t.english, date: new Date(t.isoString) });
    }
  }
  jies.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Find the Li Chun (立春) that starts the current BaZi year
  // = the most recent 立春 that is <= currentDate
  const now = currentDate.getTime();
  const liChuns = jies.filter(j => j.name === '立春');
  let cycleStartIdx = -1;
  for (let i = liChuns.length - 1; i >= 0; i--) {
    if (liChuns[i].date.getTime() <= now) {
      // Find this Li Chun in the full jies array
      cycleStartIdx = jies.findIndex(j => j.date.getTime() === liChuns[i].date.getTime());
      break;
    }
  }
  if (cycleStartIdx < 0 && liChuns.length > 0) {
    // If currentDate is before all Li Chuns, use the earliest
    cycleStartIdx = jies.findIndex(j => j.date.getTime() === liChuns[0].date.getTime());
  }

  // Build 12 consecutive Jie terms starting from the found Li Chun
  const cycleJies: Array<{ name: string; english: string; date: Date }> = [];
  if (cycleStartIdx >= 0) {
    for (let i = 0; i < 13 && cycleStartIdx + i < jies.length; i++) {
      cycleJies.push(jies[cycleStartIdx + i]);
    }
  }

  // Map each season row to its start/end date from the cycle
  return SEASON_TABLE_ROWS.map((row, i) => {
    const startJie = cycleJies[i] ?? null;
    const endJie = cycleJies[i + 1] ?? null;
    return {
      row,
      startDate: startJie?.date ?? null,
      endDate: endJie?.date ?? null,
    };
  });
}

// =============================================================================
// SOLAR TERM BOUNDARY NAVIGATION HELPERS
// =============================================================================
// DAY MASTER STRENGTH ANALYSIS
// =============================================================================

interface DayMasterStep {
  label: string;            // e.g. "Month Branch Season"
  source: string;           // e.g. "辰 Dragon"
  element: string;          // e.g. "Earth"
  polarity: string;         // e.g. "Yang"
  relation: string;         // e.g. "output"
  tenGod: TenGodInfo | null;
  effect: string;           // e.g. "DM energy is drained"
  adjustment: number;       // e.g. -8
  runningTotal: number;     // cumulative
  qiType?: string;          // 'main' | 'middle' | 'residual' for hidden stems
}

interface DayMasterAnalysis {
  dmChar: string;
  dmElement: string;
  dmPolarity: string;
  dmColor: string;
  steps: DayMasterStep[];
  finalScore: number;
  assessment: string;
}

// Season element lookup for the month branch
const SEASON_ELEMENT: Record<string, string> = {
  Spring: 'Wood', Summer: 'Fire', Autumn: 'Metal', Winter: 'Water',
};

// Adjustment weights by position
const POS_WEIGHT = {
  season: 15,      // Month branch seasonal qi — strongest
  monthStem: 8,    // Month heavenly stem
  monthHidden: 6,  // Month branch hidden stems (scaled by qi %)
  daySeat: 8,      // Day branch hidden stems ("sitting")
  yearStem: 4,     // Year heavenly stem
  yearHidden: 4,   // Year branch hidden stems
  hourStem: 4,     // Hour heavenly stem
  hourHidden: 4,   // Hour branch hidden stems
};

// Relationship multipliers: positive = support, negative = drain/pressure
const REL_MULT: Record<string, number> = {
  self: 1.0,
  resource: 0.8,
  output: -0.5,
  power: -0.8,
  wealth: -0.3,
};

const RELATION_EFFECTS: Record<string, string> = {
  self: 'Same element — DM gains support',
  resource: 'Produces DM — DM is nourished',
  output: 'DM produces this — DM energy is drained',
  power: 'Controls DM — DM is pressured',
  wealth: 'DM controls this — DM expends effort',
};

function computeDayMasterAnalysis(
  pillars: Array<{ stem: { index: number }; branch: { index: number } }>,
): DayMasterAnalysis | null {
  if (!pillars || pillars.length < 4) return null;

  const dmStem = STEM_SEGMENTS[pillars[2].stem.index];
  if (!dmStem) return null;

  const dmElement = dmStem.element;
  const dmPolarity = dmStem.polarity;
  const dmColor = ELEMENT_COLORS[dmElement] || '#e2e8f0';

  let score = 50; // Start neutral
  const steps: DayMasterStep[] = [];

  const addStep = (
    label: string, source: string, element: string, polarity: string,
    weight: number, qiType?: string,
  ) => {
    const relation = getElementRelation(dmElement, element);
    const mult = REL_MULT[relation] ?? 0;
    const adjustment = Math.round(weight * mult * 10) / 10;
    score = Math.round((score + adjustment) * 10) / 10;
    const tenGod = getTenGod(dmElement, dmPolarity, element, polarity);
    steps.push({
      label, source, element, polarity, relation,
      tenGod,
      effect: RELATION_EFFECTS[relation] || '',
      adjustment,
      runningTotal: score,
      qiType,
    });
  };

  // Step 1: Season (Month Branch element = seasonal qi)
  const monthBranch = BRANCH_SEGMENTS[pillars[1].branch.index];
  const seasonElement = SEASON_ELEMENT[monthBranch.season] || monthBranch.element;
  // For transition months (Earth), use Earth as the seasonal element
  const actualSeasonEl = monthBranch.element === 'Earth' ? 'Earth' : seasonElement;
  addStep(
    'Seasonal Qi (Month Branch)',
    `${monthBranch.char} ${monthBranch.animal} — ${monthBranch.season} season`,
    actualSeasonEl, monthBranch.polarity, POS_WEIGHT.season,
  );

  // Step 2: Month Stem
  const monthStem = STEM_SEGMENTS[pillars[1].stem.index];
  addStep('Month Stem', `${monthStem.char} ${monthStem.english}`, monthStem.element, monthStem.polarity, POS_WEIGHT.monthStem);

  // Step 3: Month Branch Hidden Stems
  const monthHidden = HIDDEN_STEMS[pillars[1].branch.index] || [];
  for (const h of monthHidden) {
    const qiLabel = h.percentage >= 60 ? 'main qi' : h.percentage >= 25 ? 'middle qi' : 'residual qi';
    addStep(
      'Month Hidden Stem',
      `${h.char} ${h.element} (${h.percentage}% ${qiLabel})`,
      h.element, h.polarity,
      POS_WEIGHT.monthHidden * (h.percentage / 100),
      qiLabel,
    );
  }

  // Step 4: Day Branch Hidden Stems ("sitting on")
  const dayHidden = HIDDEN_STEMS[pillars[2].branch.index] || [];
  const dayBranch = BRANCH_SEGMENTS[pillars[2].branch.index];
  for (const h of dayHidden) {
    const qiLabel = h.percentage >= 60 ? 'main qi' : h.percentage >= 25 ? 'middle qi' : 'residual qi';
    addStep(
      `Day Seat (${dayBranch.char} ${dayBranch.animal})`,
      `${h.char} ${h.element} (${h.percentage}% ${qiLabel})`,
      h.element, h.polarity,
      POS_WEIGHT.daySeat * (h.percentage / 100),
      qiLabel,
    );
  }

  // Step 5: Year Stem
  const yearStem = STEM_SEGMENTS[pillars[0].stem.index];
  addStep('Year Stem', `${yearStem.char} ${yearStem.english}`, yearStem.element, yearStem.polarity, POS_WEIGHT.yearStem);

  // Step 6: Year Branch Hidden Stems
  const yearHidden = HIDDEN_STEMS[pillars[0].branch.index] || [];
  const yearBranch = BRANCH_SEGMENTS[pillars[0].branch.index];
  for (const h of yearHidden) {
    const qiLabel = h.percentage >= 60 ? 'main qi' : h.percentage >= 25 ? 'middle qi' : 'residual qi';
    addStep(
      `Year Branch (${yearBranch.char} ${yearBranch.animal})`,
      `${h.char} ${h.element} (${h.percentage}% ${qiLabel})`,
      h.element, h.polarity,
      POS_WEIGHT.yearHidden * (h.percentage / 100),
      qiLabel,
    );
  }

  // Step 7: Hour Stem
  const hourStem = STEM_SEGMENTS[pillars[3].stem.index];
  addStep('Hour Stem', `${hourStem.char} ${hourStem.english}`, hourStem.element, hourStem.polarity, POS_WEIGHT.hourStem);

  // Step 8: Hour Branch Hidden Stems
  const hourHidden = HIDDEN_STEMS[pillars[3].branch.index] || [];
  const hourBranch = BRANCH_SEGMENTS[pillars[3].branch.index];
  for (const h of hourHidden) {
    const qiLabel = h.percentage >= 60 ? 'main qi' : h.percentage >= 25 ? 'middle qi' : 'residual qi';
    addStep(
      `Hour Branch (${hourBranch.char} ${hourBranch.animal})`,
      `${h.char} ${h.element} (${h.percentage}% ${qiLabel})`,
      h.element, h.polarity,
      POS_WEIGHT.hourHidden * (h.percentage / 100),
      qiLabel,
    );
  }

  // Clamp final score
  const finalScore = Math.max(5, Math.min(95, Math.round(score)));

  let assessment: string;
  if (finalScore >= 65) assessment = 'Strong (旺)';
  else if (finalScore >= 55) assessment = 'Slightly Strong';
  else if (finalScore >= 45) assessment = 'Balanced (中和)';
  else if (finalScore >= 35) assessment = 'Slightly Weak';
  else assessment = 'Weak (弱)';

  return { dmChar: dmStem.char, dmElement, dmPolarity, dmColor, steps, finalScore, assessment };
}

// =============================================================================

/**
 * Compute exact boundary navigation data for each pillar from API solar term data.
 * Year: Li Chun boundaries.  Month: Jie (节) term boundaries.
 * Day/Hour: simple arithmetic, no API needed.
 */
function computeBoundaryNav(
  currentDate: Date,
  solarTermData: Map<number, any>,
): Record<PillarKey, PillarBoundaryNav | null> {
  const result: Record<PillarKey, PillarBoundaryNav | null> = {
    year: null, month: null, day: null, hour: null,
  };

  // Collect all terms across cached years, deduplicate, sort
  const seen = new Set<string>();
  const allTerms: Array<{
    name: string; english: string; isoString: string; date: Date;
    isBaziYearBoundary: boolean; isBaziMonthBoundary: boolean;
  }> = [];

  for (const [, data] of solarTermData) {
    if (!data?.solarTerms) continue;
    for (const t of data.solarTerms) {
      if (seen.has(t.isoString)) continue;
      seen.add(t.isoString);
      allTerms.push({
        name: t.name, english: t.english, isoString: t.isoString,
        date: new Date(t.isoString),
        isBaziYearBoundary: !!t.isBaziYearBoundary,
        isBaziMonthBoundary: !!t.isBaziMonthBoundary,
      });
    }
  }
  allTerms.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Floor to the minute so displayed boundary times ("11:55 AM") match user-set times
  const floorMin = (ms: number) => Math.floor(ms / 60000) * 60000;
  const now = floorMin(currentDate.getTime());
  const toBound = (t: typeof allTerms[0]): SolarTermBoundary => ({
    isoString: t.isoString, name: t.name, english: t.english, date: t.date,
  });

  // ---- YEAR: Li Chun boundaries ----
  const liChuns = allTerms.filter(t => t.isBaziYearBoundary);
  if (liChuns.length >= 2) {
    let ci = 0;
    for (let i = liChuns.length - 1; i >= 0; i--) {
      if (floorMin(liChuns[i].date.getTime()) <= now) { ci = i; break; }
    }
    const nextLiChunIdx = Math.min(liChuns.length - 1, ci + 1);
    result.year = {
      current: toBound(liChuns[ci]),
      prev: toBound(liChuns[Math.max(0, ci - 1)]),
      next: toBound(liChuns[nextLiChunIdx]),
      displayTime: fmtBoundaryTime(liChuns[ci].date),
      displayTimeEnd: ci !== nextLiChunIdx ? fmtBoundaryTime(liChuns[nextLiChunIdx].date) : undefined,
      timezoneLabel: fmtTimezone(liChuns[ci].date),
    };
  }

  // ---- MONTH: Jie (节) term boundaries ----
  const jies = allTerms.filter(t => t.isBaziMonthBoundary);
  if (jies.length >= 2) {
    let ci = 0;
    for (let i = jies.length - 1; i >= 0; i--) {
      if (floorMin(jies[i].date.getTime()) <= now) { ci = i; break; }
    }
    const nextJieIdx = Math.min(jies.length - 1, ci + 1);
    result.month = {
      current: toBound(jies[ci]),
      prev: toBound(jies[Math.max(0, ci - 1)]),
      next: toBound(jies[nextJieIdx]),
      displayTime: fmtBoundaryTime(jies[ci].date),
      displayTimeEnd: ci !== nextJieIdx ? fmtBoundaryTime(jies[nextJieIdx].date) : undefined,
      timezoneLabel: fmtTimezone(jies[ci].date),
    };
  }

  // ---- DAY: simple arithmetic ----
  const MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const prevDay = new Date(currentDate); prevDay.setDate(prevDay.getDate() - 1);
  const nextDay = new Date(currentDate); nextDay.setDate(nextDay.getDate() + 1);
  const emptyBound: SolarTermBoundary = { isoString: '', name: '', english: '', date: currentDate };
  result.day = {
    current: emptyBound,
    prev: { ...emptyBound, date: prevDay },
    next: { ...emptyBound, date: nextDay },
    displayTime: `${MN[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`,
    timezoneLabel: '',
  };

  // ---- HOUR: 2-hour Shi Chen ----
  const hour = currentDate.getHours();
  let shiStart: number;
  if (hour >= 23 || hour < 1) shiStart = 23;
  else shiStart = Math.floor((hour - 1) / 2) * 2 + 1;

  const hCur = new Date(currentDate);
  hCur.setMinutes(0, 0, 0);
  hCur.setHours(shiStart);
  if (hour < 1 && shiStart === 23) hCur.setDate(hCur.getDate() - 1);

  const hPrev = new Date(hCur); hPrev.setHours(hPrev.getHours() - 2);
  const hNext = new Date(hCur); hNext.setHours(hNext.getHours() + 2);
  const endH = (shiStart + 2) % 24;

  result.hour = {
    current: { ...emptyBound, date: hCur },
    prev: { ...emptyBound, date: hPrev },
    next: { ...emptyBound, date: hNext },
    displayTime: `${fmt12(shiStart)} – ${fmt12(endH)}`,
    timezoneLabel: '',
  };

  return result;
}

function fmtBoundaryTime(date: Date): string {
  return date.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

/** Format timezone label using the target date for correct DST handling */
function fmtTimezone(targetDate: Date): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Use targetDate (not new Date()) so the abbreviation matches DST at that date
    const short = targetDate.toLocaleString('en-US', { timeZoneName: 'short' }).split(' ').pop() || '';
    const offset = -targetDate.getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    const hrs = Math.floor(Math.abs(offset) / 60);
    const mins = Math.abs(offset) % 60;
    const utcLabel = mins ? `UTC${sign}${hrs}:${String(mins).padStart(2, '0')}` : `UTC${sign}${hrs}`;
    return `${tz.replace(/_/g, ' ')} (${short} / ${utcLabel})`;
  } catch {
    return 'Local Time';
  }
}

export default BaZiFourPillarWheels;
