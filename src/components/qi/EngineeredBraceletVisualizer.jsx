/**
 * EngineeredBraceletVisualizer — SVG circular bracelet visualization
 * for the new Qi-flow engineering system (Steps 1–7).
 *
 * Renders:
 *   - Beads in circular layout with gemstone radial gradients
 *   - Anchor stones with animated golden glow
 *   - Qi pulse animation with staggered bead breathing
 *   - Sheng-cycle flow arcs with animated directional dash
 *   - Wrist orientation with animated flow arrow
 *   - Center Qi summary
 *   - Rich hover detail card
 *
 * Step 8A/8C — Bracelet Visualizer + Qi Flow Animation
 */

import React, { useState, useMemo, useId } from 'react';
import { GENERATES } from './elemConstants';
import { validateShengCycle, getRepairSuggestion, BRIDGE_PALETTE } from '../../data/stoneDatabase';

// ============================================================================
// ELEMENT COLORS — matches existing system palette
// ============================================================================

const ELEM_COLORS = {
  Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#a1a1aa', Water: '#3b82f6',
};

const ELEM_GLOW = {
  Wood: 'rgba(34,197,94,0.5)',
  Fire: 'rgba(239,68,68,0.5)',
  Earth: 'rgba(245,158,11,0.5)',
  Metal: 'rgba(161,161,170,0.5)',
  Water: 'rgba(59,130,246,0.5)',
};

// Lighter tint for radial gradient highlights
const ELEM_HIGHLIGHT = {
  Wood: '#86efac', Fire: '#fca5a5', Earth: '#fde68a', Metal: '#e4e4e7', Water: '#93c5fd',
};

// Element config matching Stone Encyclopedia for consistent bead rendering
const ELEMENTS_CFG = {
  Wood:  { highlight: '#86efac' },
  Fire:  { highlight: '#fca5a5' },
  Earth: { highlight: '#fde68a' },
  Metal: { highlight: '#e4e4e7' },
  Water: { highlight: '#93c5fd' },
};

// ============================================================================
// SVG KEYFRAME STYLES — injected once via <style> inside <svg>
// ============================================================================

const SVG_STYLES = `
  @keyframes qiPulse {
    0%, 100% { opacity: 0.92; }
    50% { opacity: 1; }
  }
  @keyframes anchorGlow {
    0%, 100% { opacity: 0.45; }
    50% { opacity: 0.85; }
  }
  @keyframes flowDash {
    to { stroke-dashoffset: -20; }
  }
  @keyframes flowDashReverse {
    to { stroke-dashoffset: 20; }
  }
  @keyframes centerPulse {
    0%, 100% { opacity: 0.35; }
    50% { opacity: 0.55; }
  }
  @keyframes arrowOrbit {
    from { transform-origin: center; }
    to { transform-origin: center; }
  }
  @keyframes changedHalo {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.9; }
  }
  @keyframes controllerGlow {
    0%, 100% { opacity: 0.35; stroke-width: 2; }
    50% { opacity: 0.85; stroke-width: 2.5; }
  }
`;

// ============================================================================
// BRACELET RING — Circular SVG bead layout with animations
// ============================================================================

/**
 * @param {Object} props
 * @param {import('../../data/stoneDatabase').EngineeredBead[]} props.beads
 * @param {'left'|'right'} props.wrist
 * @param {string} props.wristReason
 * @param {import('../../data/stoneDatabase').CollapseReport} [props.collapse]
 * @param {Record<string, number>} [props.qiTotals]
 * @param {number} [props.size]
 * @param {boolean} [props.isDark]
 */
export default function EngineeredBraceletVisualizer({
  beads = [],
  wrist = 'left',
  wristReason = '',
  collapse = null,
  qiTotals = null,
  size = 320,
  isDark = true,
  onBeadClick = null,
  changedIndices = null, // Set<number> — beads swapped from the original prescription
}) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  // Unique prefix per instance — prevents gradient ID collisions when
  // multiple bracelet SVGs are rendered on the same page
  const uid = useId().replace(/:/g, '');

  // Scale up SVG to fit beads with visible gaps for flow lines
  const svgSize = Math.max(size, 380);
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const radius = svgSize / 2 - 40;

  // Auto-insert all bridge beads needed to fill the Sheng gap.
  // Supports 1-, 2-, or 3-step gaps (e.g. Wood→Earth = 1 Fire bead;
  // Wood→Metal = 2 beads: Fire + Earth). All bridge beads are 5mm Qi-neutral
  // display-only spacers — they do NOT alter element ratios or QiUnits.
  const displayBeads = useMemo(() => {
    if (beads.length < 2) return beads;
    const repair = getRepairSuggestion(beads);
    if (!repair.needsRepair || repair.bridges.length === 0 || repair.totalBreaks > 1) return beads;
    const insertBeads = repair.bridges.map(b => ({
      stone: { name: b.stoneName, color: b.color, element: b.element, polarity: 'Yang', chineseName: '' },
      element: b.element,
      size: 5,
      qiUnit: 0,
      isBridge: true,
    }));
    const result = [...beads];
    // Insert all bridge beads right after the break position (in Sheng order)
    result.splice(repair.breakIndex + 1, 0, ...insertBeads);
    return result;
  }, [beads]);

  // Detect anchor position — single Mingmen at position 0
  const anchorPositions = useMemo(() => {
    const s = new Set();
    if (displayBeads.length >= 1) {
      s.add(0);
    }
    return s;
  }, [displayBeads.length]);

  // Total Qi for center display (bridge adds 0, so total is unchanged)
  const totalQi = qiTotals
    ? Object.values(qiTotals).reduce((a, b) => a + b, 0)
    : beads.reduce((s, b) => s + (b.qiUnit || 0), 0);

  // Element count summary (non-bridge beads only)
  const elementCounts = useMemo(() => {
    const c = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
    beads.forEach(b => { if (!b.isBridge && b.element && c[b.element] !== undefined) c[b.element]++; });
    return c;
  }, [beads]);

  // Collapse-aware pulse speed
  const pulseSpeed = collapse?.severity === 'severe' ? 1.8 : collapse?.severity === 'moderate' ? 2.2 : 2.8;
  // Dash animation: always flows start→end of each line segment.
  // The bead layout direction (CW vs CCW) determines the visual flow direction.
  const flowAnim = 'flowDash';

  // Bead positions pre-computed (using displayBeads length for even spacing)
  // Left wrist (absorb): clockwise layout — Qi flows in through left
  // Right wrist (release): counter-clockwise layout — Qi flows out through right
  // Based on 左吸右出 (zuǒ xī yòu chū) convention
  const beadRadius = Math.max(11, Math.min(16, (2 * Math.PI * radius) / (displayBeads.length * 3.2)));
  const beadPositions = useMemo(() =>
    displayBeads.map((_, i) => {
      const direction = wrist === 'left' ? 1 : -1;
      const angleDeg = direction * (i / displayBeads.length) * 360 - 90;
      const angle = angleDeg * (Math.PI / 180);
      return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle), angle };
    }), [displayBeads.length, cx, cy, radius, wrist]);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* === SVG Bracelet Ring === */}
      <svg
        width={svgSize}
        height={svgSize}
        className="mx-auto"
        style={{ filter: 'drop-shadow(0 0 24px rgba(0,0,0,0.4))' }}
      >
        <style>{SVG_STYLES}</style>
        <defs>
          {/* Anchor glow filter — soft golden halo */}
          <filter id={`${uid}-anchor-glow`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Bead specular highlight filter */}
          <filter id={`${uid}-bead-light`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="shadow" />
            <feOffset dx="0" dy="1" in="shadow" result="offset" />
            <feComposite in="SourceGraphic" in2="offset" operator="over" />
          </filter>

          {/* Bead inner shadow for 3D depth */}
          <filter id={`${uid}-bead-3d`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset dx="0" dy="1.5" in="blur" result="offsetShadow" />
            <feFlood floodColor="#000000" floodOpacity="0.35" result="shadowColor" />
            <feComposite in="shadowColor" in2="offsetShadow" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Per-bead radial gradients — unique IDs per instance prevent collisions
              when multiple bracelet SVGs are on the same page */}
          {displayBeads.map((bead, i) => {
            const stoneColor = bead.stone?.color || ELEM_COLORS[bead.element] || '#888';
            const highlight = ELEM_HIGHLIGHT[bead.element] || '#ffffff';
            return (
              <React.Fragment key={`grad-${i}`}>
                <radialGradient id={`${uid}-bead-grad-${i}`} cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stopColor={highlight} stopOpacity="0.5" />
                  <stop offset="35%" stopColor={stoneColor} stopOpacity="0.9" />
                  <stop offset="55%" stopColor={stoneColor} stopOpacity="1" />
                  <stop offset="100%" stopColor={stoneColor} stopOpacity="0.8" />
                </radialGradient>
              </React.Fragment>
            );
          })}

        </defs>

        {/* === Background ring — string/band === */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
          strokeWidth={beadRadius * 2 + 4}
        />
        {/* Inner ring shadow */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={isDark ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.04)'}
          strokeWidth={beadRadius * 2 + 8}
        />

        {/* === Continuous Qi flow ring — animated dashes connecting all beads === */}
        {/* Lines are shortened to start/end at bead edges so they're visible in the gap */}
        {displayBeads.map((bead, i) => {
          const p1 = beadPositions[i];
          const p2 = beadPositions[(i + 1) % displayBeads.length];
          if (!p1 || !p2) return null;

          // Shorten line to start/end at bead edge (not center)
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < beadRadius * 2.5) return null; // skip if beads overlap
          const ux = dx / dist;
          const uy = dy / dist;
          const pad = beadRadius + 2; // gap from bead edge
          const x1 = p1.x + ux * pad;
          const y1 = p1.y + uy * pad;
          const x2 = p2.x - ux * pad;
          const y2 = p2.y - uy * pad;

          const next = displayBeads[(i + 1) % displayBeads.length];
          const isSheng = next && GENERATES[bead.element] === next.element;
          const isSameElement = next && bead.element === next.element;
          // Sheng = generative transition (colored, bold)
          // Same element = same conductor, Qi flows freely (colored, medium)
          // Other = weak/no connection (dim white)
          const flowColor = (isSheng || isSameElement) ? ELEM_COLORS[bead.element] : 'rgba(255,255,255,0.35)';
          const lineWidth = isSheng ? 2.5 : isSameElement ? 1.8 : 1;
          const lineOpacity = isSheng ? 0.8 : isSameElement ? 0.55 : 0.2;
          const dashPattern = isSheng ? '5,4' : isSameElement ? '3,3' : '2,4';
          return (
            <line
              key={`flow-${i}`}
              x1={x1} y1={y1}
              x2={x2} y2={y2}
              stroke={flowColor}
              strokeWidth={lineWidth}
              strokeDasharray={dashPattern}
              strokeLinecap="round"
              opacity={lineOpacity}
              style={{ animation: `${flowAnim} 1.5s linear infinite` }}
            />
          );
        })}

        {/* === Beads — gemstone rendered === */}
        {displayBeads.map((bead, i) => {
          const { x, y } = beadPositions[i] || {};
          if (x === undefined) return null;
          const isAnchor = anchorPositions.has(i);
          const isHovered = hoveredIdx === i;
          const isChanged = changedIndices?.has(i) ?? false;
          const delay = (i / displayBeads.length) * pulseSpeed;
          // Bridge beads render at 50% radius (5mm vs 10mm)
          const r = bead.isBridge ? beadRadius * 0.5 : beadRadius;

          return (
            <g
              key={`bead-${i}`}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={(!bead.isBridge && onBeadClick) ? (e) => { e.stopPropagation(); onBeadClick(bead, { x: e.clientX, y: e.clientY }, i); } : undefined}
              style={{ cursor: bead.isBridge ? 'default' : 'pointer' }}
            >
              {/* Anchor outer glow ring — animated */}
              {isAnchor && (
                <circle
                  cx={x} cy={y} r={r + 6}
                  fill="none"
                  stroke="rgba(255,215,0,0.6)"
                  strokeWidth={2}
                  filter={`url(#${uid}-anchor-glow)`}
                  style={{ animation: `anchorGlow 3.2s ease-in-out infinite` }}
                />
              )}

              {/* Controller stone glow ring — teal/cyan pulsing (調候石) */}
              {bead.isController && (
                <>
                  <circle
                    cx={x} cy={y} r={r + 6}
                    fill="none"
                    stroke="rgba(0,210,210,0.6)"
                    strokeWidth={2}
                    style={{ animation: `controllerGlow 3.2s ease-in-out infinite` }}
                  />
                  <circle
                    cx={x} cy={y} r={r + 10}
                    fill="none"
                    stroke="rgba(0,210,210,0.2)"
                    strokeWidth={1}
                    style={{ animation: `controllerGlow 3.2s ease-in-out infinite`, animationDelay: '0.5s' }}
                  />
                </>
              )}

              {/* Changed bead halo — amber pulsing ring when stone was swapped */}
              {isChanged && (
                <>
                  <circle
                    cx={x} cy={y} r={r + 7}
                    fill="none"
                    stroke="rgba(251,191,36,0.55)"
                    strokeWidth={2}
                    style={{ animation: `changedHalo 2.2s ease-in-out infinite` }}
                  />
                  <circle
                    cx={x} cy={y} r={r + 11}
                    fill="none"
                    stroke="rgba(251,191,36,0.18)"
                    strokeWidth={1}
                    style={{ animation: `changedHalo 2.2s ease-in-out infinite`, animationDelay: '0.4s' }}
                  />
                </>
              )}

              {/* Bridge bead outer ring — dashed to signal Qi-neutral */}
              {bead.isBridge && (
                <circle
                  cx={x} cy={y} r={r + 3}
                  fill="none"
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth={1}
                  strokeDasharray="2,2"
                />
              )}

              {/* Bead drop shadow — offset and blurred */}
              <circle
                cx={x + 0.8} cy={y + 1.5}
                r={r + 0.5}
                fill="rgba(0,0,0,0.35)"
                style={{ filter: 'blur(1.5px)' }}
              />

              {/* Bead body — radial gradient matching Stone Encyclopedia */}
              <circle
                cx={x} cy={y}
                r={isHovered ? r + 2 : r}
                fill={`url(#${uid}-bead-grad-${i})`}
                stroke={
                  bead.isBridge
                    ? 'rgba(255,255,255,0.4)'
                    : isAnchor
                      ? 'rgba(255,215,0,0.8)'
                      : isHovered
                        ? 'rgba(255,255,255,0.6)'
                        : bead.stone?.polarity === 'Yang'
                          ? 'rgba(255,255,255,0.2)'
                          : 'rgba(255,255,255,0.08)'
                }
                strokeWidth={isAnchor ? 2 : isHovered ? 1.5 : 0.6}
                filter={`url(#${uid}-bead-3d)`}
                style={{
                  transition: 'r 0.2s ease, stroke-width 0.2s ease',
                  animation: `qiPulse ${pulseSpeed}s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                }}
              />

              {/* Primary specular highlight — circular gloss top-left */}
              <circle
                cx={x - r * 0.22}
                cy={y - r * 0.25}
                r={r * 0.25}
                fill="rgba(255,255,255,0.45)"
                style={{ pointerEvents: 'none' }}
              />

              {/* Secondary specular — tiny bright dot */}
              <circle
                cx={x - r * 0.32}
                cy={y - r * 0.32}
                r={r * 0.1}
                fill="rgba(255,255,255,0.7)"
                style={{ pointerEvents: 'none' }}
              />

              {/* Element initial on larger beads (not bridge beads) */}
              {!bead.isBridge && r >= 10 && (
                <text
                  x={x} y={y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(255,255,255,0.85)"
                  fontSize={r * 0.8}
                  fontWeight="bold"
                  style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  {bead.element?.[0]}
                </text>
              )}

              {/* Bridge bead: tiny "B" label */}
              {bead.isBridge && (
                <text
                  x={x} y={y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(255,255,255,0.6)"
                  fontSize={r * 0.9}
                  fontWeight="bold"
                  style={{ pointerEvents: 'none' }}
                >
                  B
                </text>
              )}

              {/* Bead number — inside the ring */}
              <text
                x={cx + (radius - beadRadius - 9) * Math.cos(beadPositions[i].angle)}
                y={cy + (radius - beadRadius - 9) * Math.sin(beadPositions[i].angle) + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'}
                fontSize={8}
                fontWeight="600"
                style={{ pointerEvents: 'none' }}
              >
                {i + 1}
              </text>

              {/* SVG native tooltip */}
              <title>
                {bead.isBridge
                  ? `${bead.element} Bridge Bead (5mm)\nQi-neutral spacer — repairs Sheng cycle break\nRestores ${bead.element} transition`
                  : `${bead.stone?.name || 'Unknown'}${bead.stone?.chineseName ? ` (${bead.stone.chineseName})` : ''}\n` +
                    `${bead.element} · ${bead.stone?.polarity || '?'}\n` +
                    `Qi: ${(bead.qiUnit || 0).toFixed(3)}\n` +
                    `${bead.size || 10}mm${isAnchor ? ' · Anchor Stone' : ''}`}
              </title>
            </g>
          );
        })}

        {/* === Flow direction arrow — orbiting dot === */}
        {(() => {
          const orbitR = radius + 18;
          // Full circle path centered on cx,cy — two half-arcs
          const orbitPath = `M ${cx - orbitR} ${cy} A ${orbitR} ${orbitR} 0 1 1 ${cx + orbitR} ${cy} A ${orbitR} ${orbitR} 0 1 1 ${cx - orbitR} ${cy}`;
          const dur = `${pulseSpeed * 6}s`;
          const kp = wrist === 'left' ? '0;1' : '1;0';
          return (
            <>
              <circle r="3" fill="rgba(255,255,255,0.45)">
                <animateMotion dur={dur} repeatCount="indefinite" keyPoints={kp} keyTimes="0;1" calcMode="linear" path={orbitPath} />
              </circle>
              <circle r="1.5" fill="rgba(255,255,255,0.85)">
                <animateMotion dur={dur} repeatCount="indefinite" keyPoints={kp} keyTimes="0;1" calcMode="linear" path={orbitPath} />
              </circle>
            </>
          );
        })()}

        {/* === Center info — pure SVG text, no foreignObject === */}
        {/* Bead count */}
        <text x={cx} y={cy - 46} textAnchor="middle"
          fill={isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.7)'}
          fontSize={14} fontWeight="700">
          {beads.length} beads{displayBeads.length > beads.length ? ` + ${displayBeads.length - beads.length} bridge` : ''}
        </text>
        {/* Qi */}
        <text x={cx} y={cy - 29} textAnchor="middle"
          fill={isDark ? 'rgba(255,255,255,0.80)' : 'rgba(0,0,0,0.6)'}
          fontSize={13} fontWeight="600"
          style={{ animation: 'centerPulse 3s ease-in-out infinite' }}>
          Qi: {totalQi.toFixed(2)}
        </text>
        {/* Wrist */}
        <text x={cx} y={cy - 14} textAnchor="middle"
          fill={isDark ? 'rgba(255,255,255,0.70)' : 'rgba(0,0,0,0.5)'}
          fontSize={11} fontWeight="500">
          {wrist === 'left' ? '吸氣 Absorb' : '出氣 Release'}
        </text>
        {/* Element counts row 1: W  F  E */}
        <text x={cx - 38} y={cy + 1} textAnchor="middle" fontSize={11} fontWeight="700" fontFamily="monospace"
          fill={ELEM_COLORS.Wood} opacity={elementCounts.Wood === 0 ? 0.45 : 1.0}>W:{elementCounts.Wood}</text>
        <text x={cx}      y={cy + 1} textAnchor="middle" fontSize={11} fontWeight="700" fontFamily="monospace"
          fill={ELEM_COLORS.Fire} opacity={elementCounts.Fire === 0 ? 0.45 : 1.0}>F:{elementCounts.Fire}</text>
        <text x={cx + 38} y={cy + 1} textAnchor="middle" fontSize={11} fontWeight="700" fontFamily="monospace"
          fill={ELEM_COLORS.Earth} opacity={elementCounts.Earth === 0 ? 0.45 : 1.0}>E:{elementCounts.Earth}</text>
        {/* Element counts row 2: M  Wa */}
        <text x={cx - 22} y={cy + 15} textAnchor="middle" fontSize={11} fontWeight="700" fontFamily="monospace"
          fill={ELEM_COLORS.Metal} opacity={elementCounts.Metal === 0 ? 0.45 : 1.0}>M:{elementCounts.Metal}</text>
        <text x={cx + 22} y={cy + 15} textAnchor="middle" fontSize={11} fontWeight="700" fontFamily="monospace"
          fill={ELEM_COLORS.Water} opacity={elementCounts.Water === 0 ? 0.45 : 1.0}>Wa:{elementCounts.Water}</text>
        {/* Bridge bead details */}
        {displayBeads.filter(b => b.isBridge).map((b, i) => (
          <text key={i} x={cx} y={cy + 30 + i * 14} textAnchor="middle"
            fontSize={10} fontWeight="600" fontFamily="monospace"
            fill={ELEM_COLORS[b.element]} opacity={0.80}>
            Bridge #{displayBeads.findIndex(db => db === b) + 1} {b.element}
          </text>
        ))}
      </svg>

      {/* === Wrist Indicator === */}
      <div className={`text-center px-4 py-2 rounded-lg border ${
        isDark
          ? 'bg-slate-800/50 border-slate-700/50'
          : 'bg-white/80 border-slate-200'
      }`}>
        <div className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
          {wrist === 'left' ? '← Left Wrist (吸氣 Absorb)' : 'Right Wrist (出氣 Release) →'}
        </div>
        {wristReason && (
          <div className={`text-[11px] mt-1 ${isDark ? 'text-white/65' : 'text-slate-500'}`}>
            {wristReason}
          </div>
        )}
      </div>

      {/* === Hovered Bead Detail === */}
      {hoveredIdx !== null && displayBeads[hoveredIdx] && (
        <HoveredBeadDetail bead={displayBeads[hoveredIdx]} index={hoveredIdx} isAnchor={anchorPositions.has(hoveredIdx)} isController={displayBeads[hoveredIdx]?.isController === true} isDark={isDark} />
      )}

      {/* === Sheng-Cycle Flow Summary — pass original beads for validation panel === */}
      {beads.length > 0 && (
        <ShengFlowSummary beads={beads} displayBeads={displayBeads} isDark={isDark} />
      )}
    </div>
  );
}

// ============================================================================
// HOVERED BEAD DETAIL — Rich info card when hovering a bead
// ============================================================================

function HoveredBeadDetail({ bead, index, isAnchor, isController, isDark }) {
  const color = bead.stone?.color || ELEM_COLORS[bead.element] || '#888';
  const highlight = ELEM_HIGHLIGHT[bead.element] || '#fff';

  const glowColor = isController
    ? 'rgba(0,210,210,0.5)'
    : isAnchor
      ? 'rgba(255,215,0,0.6)'
      : undefined;
  const borderColor = isController
    ? '2px solid rgba(0,210,210,0.6)'
    : isAnchor
      ? '2px solid rgba(255,215,0,0.7)'
      : '1px solid rgba(255,255,255,0.15)';

  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border shadow-lg transition-all duration-200 ${
      isDark
        ? 'bg-slate-800/90 border-slate-600/50 backdrop-blur-sm'
        : 'bg-white/95 border-slate-200 backdrop-blur-sm'
    }`}>
      {/* Gemstone preview dot */}
      <div
        className="rounded-full flex-shrink-0"
        style={{
          width: 28, height: 28,
          background: `radial-gradient(circle at 35% 30%, ${highlight}90, ${color} 50%, ${color}dd 100%)`,
          boxShadow: glowColor
            ? `0 0 12px ${glowColor}, inset 0 -2px 4px rgba(0,0,0,0.2)`
            : `0 2px 6px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.15)`,
          border: borderColor,
        }}
      />
      {/* Info */}
      <div className="min-w-0">
        <div className={`text-sm font-semibold ${isDark ? 'text-white/90' : 'text-slate-800'}`}>
          {bead.stone?.name || 'Unknown'}
          {bead.stone?.chineseName && (
            <span className={`ml-1.5 font-normal ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
              {bead.stone.chineseName}
            </span>
          )}
        </div>
        <div className={`text-[11px] flex items-center gap-1.5 flex-wrap ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: ELEM_COLORS[bead.element] }} />
          {bead.element} · {bead.stone?.polarity || '?'} · {bead.size || 10}mm
          <span className="font-mono">Qi {(bead.qiUnit || 0).toFixed(3)}</span>
          {isAnchor && (
            <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              ANCHOR
            </span>
          )}
          {isController && (
            <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              CONTROLLER
            </span>
          )}
        </div>
        {isController && (
          <div className={`text-[10px] mt-0.5 ${isDark ? 'text-teal-400/60' : 'text-teal-600'}`}>
            調候石 — Controls decade dominant via 克 cycle
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// QI TOTALS BAR — Element breakdown with proportional bars
// ============================================================================

/**
 * Horizontal bar chart showing Qi totals per element.
 *
 * @param {Object} props
 * @param {Record<string, number>} props.qiTotals
 * @param {boolean} [props.isDark]
 */
export function QiTotalsBar({ qiTotals, isDark = true }) {
  if (!qiTotals) return null;

  const ELS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const maxQi = Math.max(...ELS.map(el => qiTotals[el] || 0), 0.01);

  return (
    <div className="space-y-1.5 w-full">
      {ELS.map(el => {
        const qi = qiTotals[el] || 0;
        const pct = (qi / maxQi) * 100;

        return (
          <div key={el} className="flex items-center gap-2">
            <div className={`text-[11px] w-12 text-right font-mono ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
              {el}
            </div>
            <div className={`flex-1 h-3 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.max(pct, 1)}%`,
                  backgroundColor: ELEM_COLORS[el],
                  opacity: qi > 0 ? 0.8 : 0.15,
                }}
              />
            </div>
            <div className={`text-[11px] w-10 font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
              {qi.toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// COLLAPSE DIAGNOSIS PANEL — Shows collapse type, severity, strategy
// ============================================================================

/**
 * @param {Object} props
 * @param {import('../../data/stoneDatabase').CollapseReport} props.collapse
 * @param {boolean} [props.isDark]
 */
export function CollapseDiagnosisPanel({ collapse, isDark = true }) {
  if (!collapse) return null;

  const ELS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const SHENG = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };
  const KE = { Wood: 'Earth', Fire: 'Metal', Earth: 'Water', Metal: 'Wood', Water: 'Fire' };

  const severityColors = {
    none: 'text-green-400 bg-green-900/20 border-green-500/30',
    mild: 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30',
    moderate: 'text-orange-400 bg-orange-900/20 border-orange-500/30',
    severe: 'text-red-400 bg-red-900/20 border-red-500/30',
  };
  const severityPct = { none: 0, mild: 33, moderate: 66, severe: 100 };
  const severityBarColor = { none: 'bg-green-500', mild: 'bg-yellow-500', moderate: 'bg-orange-500', severe: 'bg-red-600' };
  const severityStyle = severityColors[collapse.severity] || severityColors.none;

  const dom = collapse.dominantElement;
  const forbiddenSet = new Set(collapse.forbidden || []);
  const recommendedSet = new Set(collapse.recommended || []);

  // Derive reason per element
  const reasonFor = (el) => {
    if (el === dom) return 'Dominant force';
    if (forbiddenSet.has(el)) {
      if (SHENG[el] === dom) return `Feeds ${dom} (Sheng)`;
      if (KE[el] === dom) return `Too weak to control ${dom}`;
      return `Overwhelmed by ${dom} (Ke)`;
    }
    if (recommendedSet.has(el)) {
      if (SHENG[dom] === el) return `Exhausts ${dom} (child)`;
      if (el === dom) return `Harmonizes with dominant`;
      return `Safe — supports balance`;
    }
    return 'Neutral';
  };

  // State label
  const stateOf = (el) => {
    if (el === dom) return 'Dominant';
    if (forbiddenSet.has(el) && SHENG[el] === dom) return 'Feeds dominant';
    if (forbiddenSet.has(el)) return 'Collapsed';
    if (recommendedSet.has(el)) return 'Recommended';
    return 'Neutral';
  };

  const stateBg = (el) => {
    const s = stateOf(el);
    if (s === 'Dominant') return 'bg-gray-800/60 border-gray-400/50';
    if (s === 'Collapsed') return 'bg-red-900/40 border-red-600/40';
    if (s === 'Feeds dominant') return 'bg-amber-900/30 border-amber-600/40';
    if (s === 'Recommended') return 'bg-green-900/30 border-green-600/40';
    return 'bg-slate-800/40 border-slate-600/30';
  };

  return (
    <div className={`rounded-lg border p-4 space-y-4 ${
      isDark ? 'bg-slate-900/50 border-slate-700/50' : 'bg-white border-slate-200'
    }`}>
      {/* Header + severity badge */}
      <div className="flex items-center justify-between">
        <div className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
          Collapse Diagnosis
        </div>
        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${severityStyle}`}>
          {collapse.severity.toUpperCase()}
        </span>
      </div>

      {/* Structure badge */}
      {collapse.type && (
        <div className="px-3 py-1.5 rounded-lg bg-purple-900/30 border border-purple-600/40 text-purple-300 text-[12px] font-semibold">
          {collapse.type} ({dom})
        </div>
      )}

      {/* Forbidden / Recommended badges */}
      <div className="flex gap-4">
        {collapse.forbidden.length > 0 && (
          <div>
            <div className={`text-[10px] uppercase tracking-wider mb-1 ${isDark ? 'text-red-400/60' : 'text-red-500'}`}>Forbidden</div>
            <div className="flex gap-1">
              {collapse.forbidden.map(el => (
                <span key={el} className="px-1.5 py-0.5 rounded text-[11px] font-medium border border-red-500/30 bg-red-900/20 text-red-300">{el}</span>
              ))}
            </div>
          </div>
        )}
        {collapse.recommended.length > 0 && (
          <div>
            <div className={`text-[10px] uppercase tracking-wider mb-1 ${isDark ? 'text-green-400/60' : 'text-green-500'}`}>Recommended</div>
            <div className="flex gap-1">
              {collapse.recommended.map(el => (
                <span key={el} className="px-1.5 py-0.5 rounded text-[11px] font-medium border border-green-500/30 bg-green-900/20 text-green-300" style={{ borderLeftColor: ELEM_COLORS[el], borderLeftWidth: 3 }}>{el}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Strategy text */}
      {collapse.strategy && (
        <div className={`text-[12px] leading-relaxed ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
          {collapse.strategy}
        </div>
      )}

      {/* Severity meter */}
      <div>
        <div className="text-[10px] font-semibold text-gray-400 mb-1">Collapse Severity</div>
        <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
          <div
            className={`h-full rounded-full transition-all duration-700 ${severityBarColor[collapse.severity] || 'bg-green-500'}`}
            style={{ width: `${Math.max(severityPct[collapse.severity] || 0, 4)}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-gray-600 mt-0.5 px-0.5">
          <span>Mild</span><span>Moderate</span><span>Severe</span>
        </div>
      </div>

      {/* Elemental State Grid */}
      <div>
        <div className="text-[10px] font-semibold text-gray-400 mb-1.5">Elemental States</div>
        <div className="grid grid-cols-5 gap-1.5">
          {ELS.map(el => (
            <div key={el} className={`rounded-lg p-2 border text-center ${stateBg(el)} ${el === dom ? 'ring-1 ring-amber-400/50' : ''}`}>
              <div className="text-[10px] font-bold" style={{ color: ELEM_COLORS[el] }}>{el}</div>
              <div className={`text-[9px] mt-0.5 ${forbiddenSet.has(el) ? 'text-red-400' : el === dom ? 'text-amber-300' : 'text-gray-400'}`}>{stateOf(el)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sheng / Ke cycle */}
      <div>
        <div className="text-[10px] font-semibold text-gray-400 mb-1.5">Cycle Dynamics</div>
        <div className="rounded-lg bg-black/30 border border-gray-700/40 p-3 space-y-2">
          <div className="flex items-center justify-center gap-1 text-[10px]">
            <span className="text-gray-500 text-[9px] w-12">Sheng 生</span>
            {ELS.map((el, i) => (
              <React.Fragment key={el}>
                <span className="font-semibold" style={{ color: ELEM_COLORS[el] }}>{el}</span>
                {i < 4 && <span className="text-green-500/60 animate-pulse text-[9px]">→</span>}
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center justify-center gap-1 text-[10px]">
            <span className="text-gray-500 text-[9px] w-12">Ke 克</span>
            {ELS.map((el, i) => (
              <React.Fragment key={el}>
                <span className="font-semibold" style={{ color: ELEM_COLORS[el] }}>{el}</span>
                {i < 4 && <span className="text-red-500/60 animate-pulse text-[9px]">→</span>}
              </React.Fragment>
            ))}
          </div>
          {dom && collapse.forbidden.length > 0 && (
            <div className="text-center text-[10px] mt-1 text-red-400/80">
              <span style={{ color: ELEM_COLORS[dom] }}>{dom}</span>
              <span className="mx-1 animate-pulse">→ Ke →</span>
              <span style={{ color: ELEM_COLORS[collapse.forbidden[0]] }}>{collapse.forbidden[0]}</span>
              <span className="text-gray-500 ml-2">(destructive axis)</span>
            </div>
          )}
        </div>
      </div>

      {/* Element Safety Matrix — expandable */}
      <details className="group rounded-lg bg-black/20 border border-gray-700/40 overflow-hidden">
        <summary className="cursor-pointer px-3 py-2 text-[11px] text-gray-300 font-medium flex items-center justify-between hover:bg-white/5 transition-colors">
          <span>Element Safety Matrix</span>
          <span className="text-gray-500 group-open:rotate-90 transition-transform">▸</span>
        </summary>
        <div className="px-3 pb-3">
          <table className="w-full text-[10px] font-mono">
            <thead>
              <tr className="text-gray-500 border-b border-gray-700/50">
                <th className="py-1 text-left">Element</th>
                <th className="py-1 text-left">Status</th>
                <th className="py-1 text-left">Reason</th>
              </tr>
            </thead>
            <tbody>
              {ELS.map(el => {
                const isFb = forbiddenSet.has(el);
                const isRec = recommendedSet.has(el);
                return (
                  <tr key={el} className="border-b border-gray-800/50">
                    <td className="py-1.5" style={{ color: ELEM_COLORS[el] }}>{el}</td>
                    <td className="py-1.5">
                      {isFb ? <span className="text-red-400 font-semibold">{'\u2717'} Forbidden</span>
                       : isRec ? <span className="text-green-400 font-semibold">{'\u2713'} Recommended</span>
                       : <span className="text-gray-500">Neutral</span>}
                    </td>
                    <td className="py-1.5 text-gray-400">{reasonFor(el)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>

      {/* Root Cause Summary */}
      {dom && (
        <div className="px-3 py-2 rounded-lg bg-gray-900/40 border border-gray-700/50 text-[11px] text-gray-300 leading-relaxed">
          <span className="text-gray-400 font-semibold">Root cause: </span>
          <span style={{ color: ELEM_COLORS[dom] }}>{dom}</span> is excessively dominant.
          {collapse.forbidden.length > 0 && <> <span style={{ color: ELEM_COLORS[collapse.forbidden[0]] }}>{collapse.forbidden[0]}</span> collapses under Ke pressure.</>}
          {collapse.forbidden.length > 1 && <> <span style={{ color: ELEM_COLORS[collapse.forbidden[1]] }}>{collapse.forbidden[1]}</span> feeds the collapse.</>}
          {collapse.recommended.length > 0 && <> <span style={{ color: ELEM_COLORS[collapse.recommended[0]] }}>{collapse.recommended[0]}</span> is the primary regulator.</>}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BRACELET SUMMARY CARD — Complete bracelet overview for sharing
// ============================================================================

/**
 * @param {Object} props
 * @param {import('../../data/stoneDatabase').EngineeredBracelet} props.bracelet
 * @param {string} [props.monthLabel]
 * @param {boolean} [props.isDark]
 */
export function BraceletSummaryCard({ bracelet, monthLabel = '', isDark = true }) {
  if (!bracelet) return null;

  const ELS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  // Deduplicated stone list with counts
  const stoneCounts = {};
  for (const b of bracelet.beads) {
    const key = b.stone?.name || 'Unknown';
    if (!stoneCounts[key]) {
      stoneCounts[key] = { stone: b.stone, count: 0, element: b.element };
    }
    stoneCounts[key].count++;
  }
  const stoneList = Object.values(stoneCounts).sort((a, b) => b.count - a.count);

  return (
    <div className={`rounded-lg border p-4 space-y-4 ${
      isDark ? 'bg-slate-900/50 border-slate-700/50' : 'bg-white border-slate-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
          Bracelet Summary{monthLabel ? ` — ${monthLabel}` : ''}
        </div>
        <div className={`text-[11px] px-2 py-0.5 rounded ${
          isDark ? 'bg-slate-800 text-white/50' : 'bg-slate-100 text-slate-500'
        }`}>
          {bracelet.totalBeads} beads · {bracelet.wrist === 'left' ? 'Left (吸氣)' : 'Right (出氣)'}
        </div>
      </div>

      {/* Target Ratios */}
      <div>
        <div className={`text-[10px] uppercase tracking-wider mb-1.5 ${isDark ? 'text-white/35' : 'text-slate-400'}`}>
          Target Ratios
        </div>
        <div className="flex gap-1.5">
          {ELS.filter(el => bracelet.targetRatios[el] > 0).map(el => (
            <div
              key={el}
              className="flex items-center gap-1 px-2 py-1 rounded text-[11px]"
              style={{
                backgroundColor: `${ELEM_COLORS[el]}15`,
                border: `1px solid ${ELEM_COLORS[el]}30`,
                color: ELEM_COLORS[el],
              }}
            >
              <span className="font-semibold">{el}</span>
              <span className="opacity-70">{(bracelet.targetRatios[el] * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stone List */}
      <div>
        <div className={`text-[10px] uppercase tracking-wider mb-1.5 ${isDark ? 'text-white/35' : 'text-slate-400'}`}>
          Stones
        </div>
        <div className="space-y-1">
          {stoneList.map(({ stone, count, element }) => {
            const stoneColor = stone?.color || ELEM_COLORS[element];
            const hl = ELEM_HIGHLIGHT[element] || '#fff';
            return (
              <div key={stone?.name} className="flex items-center gap-2">
                <div
                  className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, ${hl}80, ${stoneColor} 60%)`,
                    boxShadow: `0 1px 3px rgba(0,0,0,0.3)`,
                  }}
                />
                <div className={`text-[12px] flex-1 ${isDark ? 'text-white/65' : 'text-slate-600'}`}>
                  {stone?.name || 'Unknown'}
                  {stone?.chineseName && (
                    <span className={isDark ? 'text-white/30' : 'text-slate-400'}> ({stone.chineseName})</span>
                  )}
                </div>
                <div className={`text-[11px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                  ×{count}
                </div>
                <div className={`text-[11px] font-mono ${isDark ? 'text-white/30' : 'text-slate-300'}`}>
                  {element}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Narrative */}
      {bracelet.narrative && (
        <div className={`text-[12px] leading-relaxed pt-2 border-t ${
          isDark ? 'text-white/40 border-slate-700/50' : 'text-slate-500 border-slate-200'
        }`}>
          {bracelet.narrative}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BRIDGE REPAIR PANEL — Suggests a 5mm Qi-neutral bridge bead to fix the break
// ============================================================================

const ELEM_COLORS_LOCAL = {
  Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#a1a1aa', Water: '#3b82f6',
};

function BridgeRepairPanel({ beads, validation, isDark }) {
  const repair = useMemo(() => getRepairSuggestion(beads), [beads]);

  if (!repair.needsRepair) return null;
  if (repair.bridges.length === 0 && repair.reusedElements.length === 0) return null;

  const { bridges, reusedElements, fullPath, from, to, breakIndex, totalBreaks, confidence } = repair;
  const fromColor = ELEM_COLORS_LOCAL[from] || '#888';
  const toColor = ELEM_COLORS_LOCAL[to] || '#888';
  const confidencePct = Math.round(confidence * 100);
  const fullyOptimised = bridges.length === 0 && reusedElements.length > 0;
  const totalQiBefore = beads.reduce((s, b) => s + (b.qiUnit || 0), 0);
  const reusedSet = new Set(reusedElements);

  const headerLabel = fullyOptimised
    ? 'Adjacent stones cover the gap — no new beads needed'
    : reusedElements.length > 0
      ? `Bridge Repair — ${bridges.length} new + ${reusedElements.length} reused`
      : `Bridge Bead Repair — ${bridges.length} bead${bridges.length > 1 ? 's' : ''}`;

  return (
    <div className={`mt-2 rounded-lg border px-4 py-3 space-y-3 ${
      isDark ? 'bg-amber-950/20 border-amber-600/25' : 'bg-amber-50 border-amber-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {bridges.length > 0 && (
            <div className="flex gap-0.5">
              {bridges.map((b, i) => {
                const c = ELEM_COLORS_LOCAL[b.element] || b.color;
                return (
                  <div key={i} className="w-3 h-3 rounded-full border border-white/30"
                    style={{ background: `radial-gradient(circle at 35% 30%, ${c}80, ${b.color})` }} />
                );
              })}
            </div>
          )}
          {fullyOptimised && (
            <div className="w-3 h-3 rounded-full border-2 border-green-400/60 bg-green-400/10" />
          )}
          <span className={`text-[10px] uppercase tracking-wider font-semibold ${
            fullyOptimised
              ? (isDark ? 'text-green-400/70' : 'text-green-700')
              : (isDark ? 'text-amber-400/70' : 'text-amber-700')
          }`}>
            {headerLabel}
          </span>
        </div>
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
          confidence >= 0.9
            ? 'text-green-400 border-green-500/30 bg-green-900/20'
            : 'text-amber-400 border-amber-500/30 bg-amber-900/20'
        }`}>
          {confidencePct}% confidence
        </span>
      </div>

      {/* Before → After flow diagram */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] flex-wrap">
          <span className={isDark ? 'text-white/35' : 'text-slate-400'}>Before:</span>
          <span className="font-mono font-semibold" style={{ color: fromColor }}>#{breakIndex + 1} {from}</span>
          <span className="text-red-400">→✗</span>
          <span className="font-mono font-semibold" style={{ color: toColor }}>#{breakIndex + 2} {to}</span>
          <span className="text-red-400/60 ml-1">(missing {fullPath.join(', ')})</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] flex-wrap">
          <span className={isDark ? 'text-white/35' : 'text-slate-400'}>After: &nbsp;</span>
          <span className="font-mono font-semibold" style={{ color: fromColor }}>#{breakIndex + 1} {from}</span>
          {fullPath.map((el, i) => {
            const bc = ELEM_COLORS_LOCAL[el] || '#888';
            const isReused = reusedSet.has(el);
            return (
              <React.Fragment key={i}>
                <span className={isReused ? 'text-white/25' : 'text-green-400'}>→</span>
                {isReused ? (
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-dashed"
                    style={{ color: `${bc}99`, borderColor: `${bc}30`, backgroundColor: `${bc}08` }}>
                    [{el}]
                  </span>
                ) : (
                  <span className="font-mono font-semibold px-1.5 py-0.5 rounded border"
                    style={{ color: bc, borderColor: `${bc}40`, backgroundColor: `${bc}15` }}>
                    B {el} 5mm
                  </span>
                )}
              </React.Fragment>
            );
          })}
          <span className="text-green-400">→</span>
          <span className="font-mono font-semibold" style={{ color: toColor }}>#{breakIndex + 2} {to}</span>
          <span className="text-green-400/60 ml-1">✓</span>
        </div>
      </div>

      {/* Per-bead spec rows */}
      <div className="space-y-1.5">
        {bridges.map((b, i) => {
          const bc = ELEM_COLORS_LOCAL[b.element] || b.color;
          return (
            <div key={`bridge-${i}`} className={`flex items-center gap-3 text-[11px] py-1.5 px-3 rounded-lg ${
              isDark ? 'bg-slate-800/60' : 'bg-white/80'
            }`}>
              <div className="rounded-full flex-shrink-0 border border-white/20"
                style={{ width: 14, height: 14, background: `radial-gradient(circle at 35% 30%, ${bc}60, ${b.color})` }} />
              <div className="flex-1">
                <span className={`font-semibold ${isDark ? 'text-white/75' : 'text-slate-700'}`}>{b.stoneName}</span>
                <span className={`ml-3 ${isDark ? 'text-white/35' : 'text-slate-400'}`}>
                  <span style={{ color: bc }}>{b.element}</span>{' · '}5mm{' · '}
                  <span className="font-mono">Qi: 0</span>
                </span>
              </div>
              <div className={`text-[10px] text-right ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                insert after #{breakIndex + 1}
              </div>
            </div>
          );
        })}
        {reusedElements.map((el, i) => {
          const bc = ELEM_COLORS_LOCAL[el] || '#888';
          return (
            <div key={`reused-${i}`} className={`flex items-center gap-3 text-[11px] py-1.5 px-3 rounded-lg border border-dashed ${
              isDark ? 'bg-slate-800/30 border-slate-600/30' : 'bg-slate-50/80 border-slate-300/50'
            }`}>
              <div className="rounded-full flex-shrink-0 border-2 border-dashed"
                style={{ width: 14, height: 14, borderColor: `${bc}60`, backgroundColor: `${bc}15` }} />
              <div className="flex-1">
                <span className={`font-semibold ${isDark ? 'text-white/45' : 'text-slate-500'}`}>Adjacent {el} stone</span>
                <span className={`ml-3 ${isDark ? 'text-white/25' : 'text-slate-400'}`}>
                  <span style={{ color: `${bc}99` }}>{el}</span>{' · '}existing{' · '}
                  <span className="font-mono">no insert</span>
                </span>
              </div>
              <div className={`text-[10px] text-right ${isDark ? 'text-green-400/40' : 'text-green-600/60'}`}>reused</div>
            </div>
          );
        })}
        {fullyOptimised && (
          <div className={`text-[11px] py-2 px-3 rounded-lg ${
            isDark ? 'bg-green-900/20 text-green-400/70' : 'bg-green-50 text-green-700'
          }`}>
            Adjacent stones already bridge the gap — Sheng flow restored without inserting new beads.
          </div>
        )}
      </div>

      {/* Qi simulation */}
      <div className={`flex items-center justify-between text-[10px] ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
        <span>Qi before: <span className="font-mono text-white/50">{totalQiBefore.toFixed(3)}</span></span>
        <span className="text-white/15">→</span>
        <span>Qi after: <span className="font-mono text-white/50">{totalQiBefore.toFixed(3)}</span></span>
        <span className="text-green-400/60">(ratios preserved)</span>
      </div>

      {totalBreaks > 1 && (
        <div className={`text-[10px] ${isDark ? 'text-amber-400/50' : 'text-amber-600'}`}>
          ⚠ {totalBreaks} breaks detected — only the first is repaired. Consider revising the prescription.
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SHENG FLOW SUMMARY — Shows generative cycle connections between beads
// ============================================================================

function ShengFlowSummary({ beads, displayBeads, isDark }) {
  // Use displayBeads (with bridges) for all position numbering so numbers match the ring.
  // Keep original beads for validation (bridge-free Sheng logic).
  const ringBeads = displayBeads && displayBeads.length > 0 ? displayBeads : beads;

  // Anchor is always at position 0 (non-bridge)
  const anchorSet = new Set();
  if (ringBeads.length >= 1) anchorSet.add(0);

  // Find all adjacent Sheng-cycle pairs and same-element conductor runs (skip bridge beads for runs)
  const shengPairs = [];
  const conductorRuns = [];
  let runStart = null; // 0-based index of current run's first bead
  for (let i = 0; i < ringBeads.length; i++) {
    const curr = ringBeads[i];
    const next = ringBeads[(i + 1) % ringBeads.length];
    if (GENERATES[curr.element] === next.element) {
      shengPairs.push({ from: i + 1, to: (i + 1) % ringBeads.length + 1, fromEl: curr.element, toEl: next.element });
    }
    // Conductor runs: consecutive same-element non-bridge beads
    if (!curr.isBridge) {
      if (runStart === null) {
        runStart = i;
      } else if (curr.element !== ringBeads[runStart].element) {
        const runLen = i - runStart;
        if (runLen > 1) conductorRuns.push({ from: runStart + 1, to: i, element: ringBeads[runStart].element, count: runLen });
        runStart = i;
      }
    } else {
      // Bridge bead breaks conductor run
      if (runStart !== null) {
        const runLen = i - runStart;
        if (runLen > 1) conductorRuns.push({ from: runStart + 1, to: i, element: ringBeads[runStart].element, count: runLen });
        runStart = null;
      }
    }
  }
  // Close final run
  if (runStart !== null) {
    const runLen = ringBeads.length - runStart;
    if (runLen > 1) conductorRuns.push({ from: runStart + 1, to: ringBeads.length, element: ringBeads[runStart].element, count: runLen });
  }

  // Collect anchor info for display
  const anchors = [...anchorSet].map(idx => ({
    num: idx + 1,
    element: ringBeads[idx]?.element,
    name: ringBeads[idx]?.stone?.name || 'Unknown',
  }));

  // Run canonical Sheng Cycle Validator
  const validation = beads.length > 1 ? validateShengCycle(beads) : null;

  return (
    <div className={`rounded-lg border px-4 py-3 space-y-3 ${
      isDark ? 'bg-slate-800/40 border-slate-700/40' : 'bg-white/80 border-slate-200'
    }`}>
      {/* Anchor Stones Section */}
      {anchors.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-amber-400/60' : 'text-amber-600'}`}>
              Anchor Stone — Mingmen (命門)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {anchors.map(a => (
              <div key={a.num} className="flex items-center gap-1.5 text-[11px]">
                <span
                  className="font-mono font-semibold px-1.5 py-0.5 rounded border"
                  style={{
                    color: '#fbbf24',
                    backgroundColor: 'rgba(251,191,36,0.1)',
                    borderColor: 'rgba(251,191,36,0.25)',
                  }}
                >
                  #{a.num}
                </span>
                <span style={{ color: ELEM_COLORS[a.element] }} className="text-[10px] font-medium">{a.element}</span>
                <span className={isDark ? 'text-white/35' : 'text-slate-400'}>{a.name}</span>
              </div>
            ))}
          </div>
          <p className={`text-[10px] leading-relaxed ${isDark ? 'text-white/55' : 'text-slate-400'}`}>
            Single anchor at position #1 — the Mingmen (命門) origin of the Qi circuit.
            One origin point = one coherent cycle. Stabilizes flow without splitting direction.
          </p>
        </div>
      )}

      {/* Sheng Cycle Flow Section */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-white/65' : 'text-slate-500'}`}>
            生 Sheng Cycle Flow
          </span>
          <span className={`text-[10px] ${isDark ? 'text-white/45' : 'text-slate-400'}`}>
            {shengPairs.length} connection{shengPairs.length !== 1 ? 's' : ''}
          </span>
        </div>
        {shengPairs.length === 0 ? (
          <div className={`text-[11px] ${isDark ? 'text-white/55' : 'text-slate-400'}`}>
            No adjacent Sheng-cycle connections in this layout
          </div>
        ) : (
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {shengPairs.map((pair, idx) => (
              <div key={idx} className="flex items-center gap-1 text-[11px]">
                <span
                  className="font-mono font-semibold px-1 rounded"
                  style={{ color: ELEM_COLORS[pair.fromEl], backgroundColor: `${ELEM_COLORS[pair.fromEl]}15` }}
                >
                  #{pair.from}
                </span>
                <span style={{ color: ELEM_COLORS[pair.fromEl] }} className="text-[10px]">{pair.fromEl}</span>
                <span className={isDark ? 'text-white/55' : 'text-slate-400'}>→</span>
                <span
                  className="font-mono font-semibold px-1 rounded"
                  style={{ color: ELEM_COLORS[pair.toEl], backgroundColor: `${ELEM_COLORS[pair.toEl]}15` }}
                >
                  #{pair.to}
                </span>
                <span style={{ color: ELEM_COLORS[pair.toEl] }} className="text-[10px]">{pair.toEl}</span>
                {idx < shengPairs.length - 1 && (
                  <span className={`ml-1 ${isDark ? 'text-white/30' : 'text-slate-200'}`}>·</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conductor Runs — same-element blocks where Qi flows freely */}
      {conductorRuns.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-white/65' : 'text-slate-500'}`}>
              Conductor Runs
            </span>
            <span className={`text-[10px] ${isDark ? 'text-white/45' : 'text-slate-400'}`}>
              same element = free Qi flow
            </span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {conductorRuns.map((run, idx) => (
              <div key={idx} className="flex items-center gap-1 text-[11px]">
                <span
                  className="font-mono font-semibold px-1 rounded"
                  style={{ color: ELEM_COLORS[run.element], backgroundColor: `${ELEM_COLORS[run.element]}15` }}
                >
                  #{run.from}–#{run.to}
                </span>
                <span style={{ color: ELEM_COLORS[run.element] }} className="text-[10px]">{run.element}</span>
                <span className={isDark ? 'text-white/55' : 'text-slate-400'}>×{run.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Closed Loop Validator — the bracelet must breathe */}
      {validation && (
        <div className="space-y-1.5 pt-1 border-t border-slate-700/40">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-white/65' : 'text-slate-500'}`}>
              Closed Loop Validator
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
            <span className={validation.anchorFed ? 'text-green-400' : 'text-red-400'}>
              {validation.anchorFed ? '✓' : '✗'} Bead 1→2 {validation.anchorFed ? 'feeds' : 'BROKEN'}
            </span>
            <span className={validation.wrapClosed ? 'text-green-400' : 'text-red-400'}>
              {validation.wrapClosed ? '✓' : '✗'} Bead {beads.length}→1 {validation.wrapClosed ? 'closes' : 'BROKEN'}
            </span>
            <span className={isDark ? 'text-white/65' : 'text-slate-500'}>
              {validation.shengCount} Sheng · {validation.conductorCount} conductor · {validation.breakCount} break{validation.breakCount !== 1 ? 's' : ''}
            </span>
          </div>
          {validation.breakCount > 0 && (
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {validation.errors.map((err, idx) => (
                <span key={idx} className="text-[10px] text-red-400/70">
                  #{err.index + 1} {err.from}→{err.to} (need {err.expected})
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bridge Bead Repair Suggestion */}
      {validation && validation.breakCount > 0 && (
        <BridgeRepairPanel beads={beads} validation={validation} isDark={isDark} />
      )}
    </div>
  );
}
