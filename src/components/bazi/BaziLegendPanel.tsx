/**
 * BaZi Legend Panel
 *
 * Educational reference components for BaZi Learning Page:
 * - BaziElementLegend: Five Elements with colors, glyphs, descriptions
 * - BaziPolarityLegend: Yin/Yang explanation
 * - SeasonLegend: Current season from Month pillar
 * - FiveElementCycle: SVG pentagon with Sheng (generating) and Ke (controlling) lines
 * - BaziLegendPanel: Combines all above in a collapsible panel
 */

import React, { useState, useMemo } from 'react';
import {
  ELEMENT_COLORS,
  ELEMENT_GLYPHS,
  POLARITY_ICONS,
  SEASON_COLORS,
  SEASON_DESCRIPTIONS,
  SEASON_ELEMENT,
  FIVE_ELEMENTS_CYCLE,
  SHENG_CYCLE,
  KE_CYCLE,
  SHENG_DESCRIPTIONS,
  KE_DESCRIPTIONS,
  SEASONAL_STRENGTH,
  PILLAR_LABELS,
  QI_FLOW_STEPS,
  CYCLE_JUMP_INFO,
  SOLAR_TERMS,
  SOLAR_TERM_SLOT_DEG,
  getSolarTermIndex,
  arcPath,
  segmentCenter,
  getSeasonFromMonthBranch,
  type SolarTermData,
} from '../../utils/baziWheels';

// =============================================================================
// ELEMENT DESCRIPTIONS
// =============================================================================

const ELEMENT_DESCRIPTIONS: Record<string, string> = {
  Wood:  'Growth, flexibility, compassion',
  Fire:  'Passion, charisma, transformation',
  Earth: 'Stability, nourishment, trust',
  Metal: 'Precision, discipline, clarity',
  Water: 'Wisdom, adaptability, depth',
};

// =============================================================================
// FIVE ELEMENT LEGEND
// =============================================================================

const BaziElementLegend: React.FC = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
    {FIVE_ELEMENTS_CYCLE.map(el => (
      <div key={el} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${ELEMENT_COLORS[el]}30`,
        minWidth: '140px',
      }}>
        <span style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: ELEMENT_COLORS[el],
          opacity: 0.8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          color: '#fff',
          fontWeight: 700,
          fontFamily: "'Noto Sans SC', serif",
          flexShrink: 0,
        }}>
          {ELEMENT_GLYPHS[el]}
        </span>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: ELEMENT_COLORS[el] }}>
            {el}
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8', lineHeight: 1.3 }}>
            {ELEMENT_DESCRIPTIONS[el]}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// =============================================================================
// YIN/YANG POLARITY LEGEND
// =============================================================================

const BaziPolarityLegend: React.FC = () => (
  <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontSize: '16px' }}>{POLARITY_ICONS.Yang}</span>
      <div>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0' }}>Yang</span>
        <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '6px' }}>
          Active, outward, bright
        </span>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontSize: '16px' }}>{POLARITY_ICONS.Yin}</span>
      <div>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0' }}>Yin</span>
        <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '6px' }}>
          Receptive, inward, subtle
        </span>
      </div>
    </div>
  </div>
);

// =============================================================================
// SEASON LEGEND
// =============================================================================

interface SeasonLegendProps {
  monthBranchIdx: number;
}

const SeasonLegend: React.FC<SeasonLegendProps> = ({ monthBranchIdx }) => {
  const season = getSeasonFromMonthBranch(monthBranchIdx);
  const sc = SEASON_COLORS[season] || SEASON_COLORS.Spring;
  const desc = SEASON_DESCRIPTIONS[season] || '';
  const dominantEl = SEASON_ELEMENT[season] || 'Wood';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 12px',
      borderRadius: '10px',
      background: sc.bg,
      border: `1px solid ${sc.border}`,
      transition: 'background 0.5s, border-color 0.5s',
    }}>
      <span style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: ELEMENT_COLORS[dominantEl],
        opacity: 0.7,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        color: '#fff',
        fontWeight: 700,
        fontFamily: "'Noto Sans SC', serif",
        flexShrink: 0,
      }}>
        {ELEMENT_GLYPHS[dominantEl]}
      </span>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>
          {sc.label}
        </div>
        <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.4 }}>
          {desc}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// FIVE ELEMENT CYCLE DIAGRAM
// =============================================================================

interface FiveElementCycleProps {
  activeElement?: string;
}

const FiveElementCycle: React.FC<FiveElementCycleProps> = ({ activeElement }) => {
  const [hoveredEl, setHoveredEl] = useState<string | null>(null);
  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const R = 85;
  const nodeR = 20;

  // Pentagon positions: clockwise from top
  // Fire(0), Earth(72), Metal(144), Water(216), Wood(288)
  const positions = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    FIVE_ELEMENTS_CYCLE.forEach((el, i) => {
      const angle = i * 72;
      const rad = (angle - 90) * (Math.PI / 180);
      map[el] = {
        x: cx + R * Math.cos(rad),
        y: cy + R * Math.sin(rad),
      };
    });
    return map;
  }, [cx, cy]);

  // Index lookup for Ke cycle star pattern
  const elIndex: Record<string, number> = {};
  FIVE_ELEMENTS_CYCLE.forEach((el, i) => { elIndex[el] = i; });

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <marker id="sheng-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill="rgba(34, 197, 94, 0.6)" />
          </marker>
          <marker id="ke-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill="rgba(239, 68, 68, 0.4)" />
          </marker>
        </defs>

        {/* Sheng cycle arrows (pentagon edges, clockwise) */}
        {SHENG_CYCLE.map(([parent, child]) => {
          const p = positions[parent];
          const c = positions[child];
          if (!p || !c) return null;
          // Shorten line to not overlap nodes
          const dx = c.x - p.x;
          const dy = c.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const nx = dx / dist;
          const ny = dy / dist;
          const x1 = p.x + nx * (nodeR + 2);
          const y1 = p.y + ny * (nodeR + 2);
          const x2 = c.x - nx * (nodeR + 4);
          const y2 = c.y - ny * (nodeR + 4);
          const key = `${parent}\u2192${child}`;
          const desc = SHENG_DESCRIPTIONS[key] || '';
          const isHighlighted = hoveredEl === parent || hoveredEl === child;
          return (
            <line
              key={`sheng-${parent}-${child}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(34, 197, 94, 0.5)"
              strokeWidth={isHighlighted ? 2.5 : 1.5}
              markerEnd="url(#sheng-arrow)"
              opacity={isHighlighted ? 1 : 0.6}
              style={{ transition: 'opacity 0.2s, stroke-width 0.2s' }}
            >
              <title>{desc}</title>
            </line>
          );
        })}

        {/* Ke cycle lines (star pattern, dashed) */}
        {KE_CYCLE.map(([controller, controlled]) => {
          const p = positions[controller];
          const c = positions[controlled];
          if (!p || !c) return null;
          const dx = c.x - p.x;
          const dy = c.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const nx = dx / dist;
          const ny = dy / dist;
          const x1 = p.x + nx * (nodeR + 2);
          const y1 = p.y + ny * (nodeR + 2);
          const x2 = c.x - nx * (nodeR + 4);
          const y2 = c.y - ny * (nodeR + 4);
          const key = `${controller}\u2192${controlled}`;
          const desc = KE_DESCRIPTIONS[key] || '';
          const isHighlighted = hoveredEl === controller || hoveredEl === controlled;
          return (
            <line
              key={`ke-${controller}-${controlled}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(239, 68, 68, 0.35)"
              strokeWidth={isHighlighted ? 2 : 1}
              strokeDasharray="5 3"
              markerEnd="url(#ke-arrow)"
              opacity={isHighlighted ? 0.9 : 0.4}
              style={{ transition: 'opacity 0.2s, stroke-width 0.2s' }}
            >
              <title>{desc}</title>
            </line>
          );
        })}

        {/* Element nodes */}
        {FIVE_ELEMENTS_CYCLE.map(el => {
          const pos = positions[el];
          if (!pos) return null;
          const color = ELEMENT_COLORS[el] || '#64748b';
          const isActive = el === activeElement;
          const isHovered = el === hoveredEl;
          const r = isActive ? nodeR + 3 : nodeR;
          return (
            <g
              key={el}
              onMouseEnter={() => setHoveredEl(el)}
              onMouseLeave={() => setHoveredEl(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Glow ring for active element */}
              {isActive && (
                <circle cx={pos.x} cy={pos.y} r={r + 5} fill={color} opacity={0.15} />
              )}
              <circle
                cx={pos.x} cy={pos.y} r={r}
                fill={color}
                fillOpacity={isActive ? 0.35 : (isHovered ? 0.3 : 0.2)}
                stroke={color}
                strokeWidth={isActive ? 2.5 : (isHovered ? 2 : 1.5)}
                style={{ transition: 'fill-opacity 0.2s, stroke-width 0.2s' }}
              />
              <text
                x={pos.x} y={pos.y - 3}
                textAnchor="middle" dominantBaseline="middle"
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  fill: '#fff',
                  fontFamily: "'Noto Sans SC', serif",
                  pointerEvents: 'none',
                }}
              >
                {ELEMENT_GLYPHS[el]}
              </text>
              <text
                x={pos.x} y={pos.y + 11}
                textAnchor="middle" dominantBaseline="middle"
                style={{
                  fontSize: '8px',
                  fill: 'rgba(255,255,255,0.7)',
                  pointerEvents: 'none',
                }}
              >
                {el}
              </text>
            </g>
          );
        })}

        {/* Legend labels */}
        <text x={4} y={size - 4} style={{ fontSize: '8px', fill: '#64748b' }}>
          <tspan fill="rgba(34, 197, 94, 0.7)">--- Sheng (generates)</tspan>
          {'   '}
          <tspan fill="rgba(239, 68, 68, 0.5)">- - Ke (controls)</tspan>
        </text>
      </svg>
    </div>
  );
};

// =============================================================================
// M. QI FLOW LEGEND
// =============================================================================

const QiFlowLegend: React.FC = () => (
  <div>
    {/* Pillar flow diagram */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      marginBottom: '10px',
    }}>
      {PILLAR_LABELS.map((label, i) => (
        <React.Fragment key={label}>
          <span style={{
            padding: '3px 10px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: 700,
            color: i === 2 ? '#fbbf24' : '#e2e8f0',
            border: i === 2 ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(255,255,255,0.08)',
          }}>
            {label.toUpperCase()}
          </span>
          {i < 3 && (
            <span style={{ fontSize: '10px', color: '#64748b' }}>{'\u2192'}</span>
          )}
        </React.Fragment>
      ))}
    </div>
    {/* Step explanations */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {QI_FLOW_STEPS.map((step, i) => (
        <div key={i} style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'baseline',
          padding: '3px 0',
        }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#a78bfa', minWidth: '90px', flexShrink: 0 }}>
            {step.label}
          </span>
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>
            {step.meaning}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// =============================================================================
// O. SEASONAL STRENGTH LEGEND
// =============================================================================

interface SeasonalStrengthLegendProps {
  season: string;
}

const SeasonalStrengthLegend: React.FC<SeasonalStrengthLegendProps> = ({ season }) => {
  const strengths = SEASONAL_STRENGTH[season] || SEASONAL_STRENGTH.Spring;
  const elements = FIVE_ELEMENTS_CYCLE;

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {elements.map(el => {
          const str = strengths[el] ?? 0.5;
          const color = ELEMENT_COLORS[el] || '#64748b';
          return (
            <div key={el} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: color,
                opacity: 0.7,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                color: '#fff',
                fontWeight: 700,
                fontFamily: "'Noto Sans SC', serif",
                flexShrink: 0,
              }}>
                {ELEMENT_GLYPHS[el]}
              </span>
              <span style={{ fontSize: '10px', color: '#94a3b8', width: '40px', flexShrink: 0 }}>
                {el}
              </span>
              {/* Bar */}
              <div style={{
                flex: 1,
                height: '10px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '5px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${str * 100}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${color}60, ${color})`,
                  borderRadius: '5px',
                  transition: 'width 0.4s ease-out',
                }} />
              </div>
              <span style={{
                fontSize: '9px',
                color: str >= 0.8 ? '#fbbf24' : (str <= 0.3 ? '#ef4444' : '#94a3b8'),
                fontWeight: 600,
                width: '28px',
                textAlign: 'right',
                flexShrink: 0,
              }}>
                {Math.round(str * 100)}%
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: '9px', color: '#64748b', marginTop: '6px', textAlign: 'center' }}>
        Element strength in {season} season
      </div>
    </div>
  );
};

// =============================================================================
// S. SOLAR TERM COMPASS
// =============================================================================

interface SolarTermCompassProps {
  currentDate: Date;
}

const SEASON_COMPASS_COLORS: Record<string, string> = {
  Spring: 'rgba(34, 197, 94, 0.4)',
  Summer: 'rgba(239, 68, 68, 0.4)',
  Autumn: 'rgba(161, 161, 170, 0.4)',
  Winter: 'rgba(59, 130, 246, 0.4)',
};

const SolarTermCompass: React.FC<SolarTermCompassProps> = ({ currentDate }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const activeIdx = useMemo(() => getSolarTermIndex(currentDate), [currentDate]);

  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.44;
  const innerR = size * 0.22;
  const gap = 0.3;
  const slotDeg = SOLAR_TERM_SLOT_DEG;

  // Rotation to place active term at top
  const rotation = -(activeIdx * slotDeg);

  const activeTerm = SOLAR_TERMS[activeIdx];
  const hoveredTerm = hoveredIdx !== null ? SOLAR_TERMS[hoveredIdx] : null;

  return (
    <div style={{ position: 'relative' }}>
      {/* Active term label */}
      <div style={{
        textAlign: 'center',
        marginBottom: '8px',
        fontSize: '12px',
        color: '#e2e8f0',
      }}>
        <span style={{ fontFamily: "'Noto Sans SC', serif", fontSize: '16px', color: ELEMENT_COLORS[activeTerm.element], fontWeight: 700 }}>
          {activeTerm.chinese}
        </span>
        {' '}
        <span style={{ color: '#94a3b8' }}>
          {activeTerm.description}
        </span>
        {activeTerm.type === 'jie' && (
          <span style={{ marginLeft: '6px', fontSize: '9px', padding: '1px 5px', borderRadius: '4px', background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>
            Jie {'\u7BC0'}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background */}
          <circle cx={cx} cy={cy} r={outerR + 2} fill="rgba(15, 23, 42, 0.6)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

          {/* Top indicator */}
          <polygon
            points={`${cx - 5},${cy - outerR - 5} ${cx + 5},${cy - outerR - 5} ${cx},${cy - outerR + 1}`}
            fill="#fbbf24" opacity={0.9}
          />

          {/* Rotating group */}
          <g
            transform={`rotate(${rotation}, ${cx}, ${cy})`}
            style={{ transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            {SOLAR_TERMS.map((term, i) => {
              const startDeg = i * slotDeg + gap / 2;
              const endDeg = (i + 1) * slotDeg - gap / 2;
              const midDeg = (startDeg + endDeg) / 2;
              const isActive = i === activeIdx;
              const isHovered = i === hoveredIdx;
              const color = SEASON_COMPASS_COLORS[term.season] || '#64748b';
              const elColor = ELEMENT_COLORS[term.element] || '#64748b';

              const { x: tx, y: ty } = segmentCenter(cx, cy, innerR, outerR, midDeg);
              const textRot = -rotation;

              return (
                <g key={i}>
                  <path
                    d={arcPath(cx, cy, innerR, outerR, startDeg, endDeg)}
                    fill={isActive ? elColor : color}
                    fillOpacity={isActive ? 0.7 : (isHovered ? 0.5 : 0.15)}
                    stroke={isActive ? '#fbbf24' : (isHovered ? 'rgba(255,255,255,0.3)' : (term.type === 'jie' ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.06)'))}
                    strokeWidth={isActive ? 1.5 : 0.5}
                    style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s' }}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                  <text
                    x={tx} y={ty}
                    textAnchor="middle" dominantBaseline="middle"
                    transform={`rotate(${textRot}, ${tx}, ${ty})`}
                    style={{
                      fontSize: isActive ? '10px' : '7px',
                      fontWeight: isActive ? 700 : 400,
                      fill: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                      fontFamily: "'Noto Sans SC', serif",
                      pointerEvents: 'none',
                    }}
                  >
                    {term.chinese}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Center label */}
          <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: '10px', fontWeight: 700, fill: '#e2e8f0' }}>
            {'\u4E8C\u5341\u56DB'}
          </text>
          <text x={cx} y={cy + 8} textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: '10px', fontWeight: 700, fill: '#e2e8f0' }}>
            {'\u8282\u6C14'}
          </text>
          <text x={cx} y={cy + 22} textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: '7px', fill: '#64748b' }}>
            24 Solar Terms
          </text>
        </svg>
      </div>

      {/* Hover tooltip */}
      {hoveredTerm && (
        <div style={{
          textAlign: 'center',
          marginTop: '6px',
          fontSize: '11px',
          color: '#cbd5e1',
          animation: 'bazi-season-fade 0.15s ease-out',
        }}>
          <span style={{ color: ELEMENT_COLORS[hoveredTerm.element], fontWeight: 600, fontFamily: "'Noto Sans SC', serif" }}>
            {hoveredTerm.chinese}
          </span>
          {' '}{hoveredTerm.pinyin} — {hoveredTerm.description}
          {' '}
          <span style={{ color: '#64748b' }}>
            (~{hoveredTerm.approxMonth}/{hoveredTerm.approxDay})
          </span>
          {hoveredTerm.type === 'jie' && (
            <span style={{ color: '#fbbf24', marginLeft: '4px', fontSize: '9px' }}>
              Month boundary
            </span>
          )}
        </div>
      )}

      {/* Season ring labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '8px',
        flexWrap: 'wrap',
      }}>
        {['Spring', 'Summer', 'Autumn', 'Winter'].map(s => (
          <span key={s} style={{
            fontSize: '9px',
            padding: '2px 6px',
            borderRadius: '4px',
            background: SEASON_COMPASS_COLORS[s],
            color: '#e2e8f0',
          }}>
            {SEASON_COLORS[s]?.label || s}
          </span>
        ))}
        <span style={{
          fontSize: '9px',
          padding: '2px 6px',
          borderRadius: '4px',
          background: 'rgba(251,191,36,0.1)',
          color: '#fbbf24',
          border: '1px solid rgba(251,191,36,0.2)',
        }}>
          {'\u7BC0'} = Jie (month boundary)
        </span>
      </div>
    </div>
  );
};

// =============================================================================
// R. CYCLE JUMP LEGEND
// =============================================================================

const CycleJumpLegend: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {CYCLE_JUMP_INFO.map((item, i) => (
      <div key={i} style={{
        padding: '6px 10px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '2px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0' }}>
            {item.label}
          </span>
          <span style={{ fontSize: '10px', color: '#a78bfa', fontFamily: "'Noto Sans SC', serif" }}>
            {item.chinese}
          </span>
        </div>
        <div style={{ fontSize: '10px', color: '#94a3b8', lineHeight: 1.4 }}>
          {item.meaning}
        </div>
        <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px', fontFamily: "'Noto Sans SC', serif" }}>
          {item.example}
        </div>
      </div>
    ))}
  </div>
);

// =============================================================================
// COMBINED LEGEND PANEL
// =============================================================================

interface BaziLegendPanelProps {
  monthBranchIdx: number;
  dayMasterElement?: string;
  currentDate?: Date;
}

/** Reusable collapsible section button */
const LegendSection: React.FC<{
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, open, onToggle, children }) => (
  <div style={{ marginBottom: '4px' }}>
    <button
      type="button"
      onClick={onToggle}
      style={{
        width: '100%',
        padding: '8px 12px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px',
        color: '#e2e8f0',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span>{title}</span>
      <span style={{ color: '#94a3b8', fontSize: '11px' }}>{open ? '\u25BC' : '\u25B8'}</span>
    </button>
    {open && (
      <div style={{ marginTop: '8px', padding: '0 4px' }}>
        {children}
      </div>
    )}
  </div>
);

const BaziLegendPanel: React.FC<BaziLegendPanelProps> = ({
  monthBranchIdx,
  dayMasterElement,
  currentDate,
}) => {
  const [showCycle, setShowCycle] = useState(false);
  const [showQiFlow, setShowQiFlow] = useState(false);
  const [showSeasonStr, setShowSeasonStr] = useState(false);
  const [showCycleJump, setShowCycleJump] = useState(false);
  const [showSolarTerm, setShowSolarTerm] = useState(false);

  const season = getSeasonFromMonthBranch(monthBranchIdx);

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.5)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '20px',
    }}>
      {/* Header */}
      <h3 style={{
        fontSize: '16px',
        fontWeight: 700,
        color: '#e2e8f0',
        marginBottom: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        BaZi Reference
      </h3>

      {/* Current Season */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.5px' }}>
          CURRENT SEASON
        </div>
        <SeasonLegend monthBranchIdx={monthBranchIdx} />
      </div>

      {/* Five Elements */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.5px' }}>
          FIVE ELEMENTS
        </div>
        <BaziElementLegend />
      </div>

      {/* Yin/Yang */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.5px' }}>
          YIN / YANG POLARITY
        </div>
        <BaziPolarityLegend />
      </div>

      {/* Collapsible sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* N. Five Element Cycle Diagram */}
        <LegendSection title="Five Element Cycle Diagram" open={showCycle} onToggle={() => setShowCycle(!showCycle)}>
          <FiveElementCycle activeElement={dayMasterElement} />
          <div style={{
            marginTop: '8px',
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '8px',
            fontSize: '11px',
            color: '#94a3b8',
            lineHeight: 1.6,
          }}>
            <div style={{ marginBottom: '4px' }}>
              <span style={{ color: 'rgba(34, 197, 94, 0.8)', fontWeight: 600 }}>Sheng (generating):</span>
              {' '}Wood feeds Fire, Fire creates Earth, Earth bears Metal, Metal collects Water, Water nourishes Wood
            </div>
            <div>
              <span style={{ color: 'rgba(239, 68, 68, 0.7)', fontWeight: 600 }}>Ke (controlling):</span>
              {' '}Wood parts Earth, Earth dams Water, Water extinguishes Fire, Fire melts Metal, Metal chops Wood
            </div>
          </div>
        </LegendSection>

        {/* M. Qi Flow Legend */}
        <LegendSection title="Qi Flow (Four Pillar Energy)" open={showQiFlow} onToggle={() => setShowQiFlow(!showQiFlow)}>
          <QiFlowLegend />
        </LegendSection>

        {/* O. Seasonal Strength Legend */}
        <LegendSection title="Seasonal Element Strength" open={showSeasonStr} onToggle={() => setShowSeasonStr(!showSeasonStr)}>
          <SeasonalStrengthLegend season={season} />
        </LegendSection>

        {/* R. Cycle Jump Legend */}
        <LegendSection title="Cycle Jumps Explained" open={showCycleJump} onToggle={() => setShowCycleJump(!showCycleJump)}>
          <CycleJumpLegend />
        </LegendSection>

        {/* S. Solar Term Compass */}
        <LegendSection title="Solar Term Compass (二十四节气)" open={showSolarTerm} onToggle={() => setShowSolarTerm(!showSolarTerm)}>
          <SolarTermCompass currentDate={currentDate || new Date()} />
        </LegendSection>
      </div>
    </div>
  );
};

export default BaziLegendPanel;
export {
  SeasonLegend,
  FiveElementCycle,
  BaziElementLegend,
  BaziPolarityLegend,
  QiFlowLegend,
  SeasonalStrengthLegend,
  CycleJumpLegend,
  SolarTermCompass,
};
