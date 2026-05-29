/**
 * RelationshipHealthSpace — 3D scatter plot of all 630 unique archetype pairs.
 *
 * Axes: X = Mutuality, Y = Balance, Z = Chemistry
 * Each pair is a point, colored by RHS final score, sized by psych alignment.
 * Mutual A-tier pairs get golden halos.
 *
 * Pure SVG + rotation matrices (same approach as QiBalanceCube).
 */
import React, { useMemo, useState, useRef, useCallback } from 'react';
import { RHS_PAIRS } from '../../utils/zodiacCompatibilityEngine';

// ── 3D math ──
function rotateY(pts, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return pts.map(([x, y, z]) => [x * c + z * s, y, -x * s + z * c]);
}
function rotateX(pts, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return pts.map(([x, y, z]) => [x, y * c - z * s, y * s + z * c]);
}
function project(x, y, z, fov = 600) {
  const scale = fov / (fov + z);
  return { px: x * scale, py: y * scale, depth: z, scale };
}

function tierColor(score) {
  if (score >= 80) return '#fbbf24';  // gold
  if (score >= 70) return '#a78bfa';  // purple
  if (score >= 60) return '#22d3ee';  // cyan
  return '#86efac';                    // green
}

const W = 700, H = 500;
const CX = W / 2, CY = H / 2;
const CUBE_SIZE = 180;

export default function RelationshipHealthSpace() {
  const [rotX, setRotX] = useState(-0.35);
  const [rotYAngle, setRotYAngle] = useState(0.65);
  const [zoom, setZoom] = useState(1.0);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [pinned, setPinned] = useState(null);
  const [visibleTiers, setVisibleTiers] = useState({ gold: true, purple: true, cyan: true, green: true, mutualA: true });
  const dragging = useRef(false);
  const panning = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e) => {
    if (e.button === 2 || e.shiftKey) {
      panning.current = true;
    } else {
      dragging.current = true;
    }
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e) => {
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    if (panning.current) {
      setPanX(prev => prev + dx);
      setPanY(prev => prev + dy);
    } else if (dragging.current) {
      setRotYAngle(prev => prev + dx * 0.005);
      setRotX(prev => Math.max(-1.2, Math.min(1.2, prev - dy * 0.005)));
    }
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseUp = useCallback(() => { dragging.current = false; panning.current = false; }, []);

  const onWheel = useCallback((e) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.3, Math.min(8.0, prev - e.deltaY * 0.002)));
  }, []);

  // Normalize pair data to cube coordinates using actual data range
  const points = useMemo(() => {
    // Find actual min/max for each axis to center the data
    let minM = Infinity, maxM = -Infinity, minB = Infinity, maxB = -Infinity, minC = Infinity, maxC = -Infinity;
    for (const p of RHS_PAIRS) {
      if (p.mutuality < minM) minM = p.mutuality; if (p.mutuality > maxM) maxM = p.mutuality;
      if (p.balance < minB) minB = p.balance; if (p.balance > maxB) maxB = p.balance;
      if (p.chemistry < minC) minC = p.chemistry; if (p.chemistry > maxC) maxC = p.chemistry;
    }
    // Add small padding
    const padM = (maxM - minM) * 0.05, padB = (maxB - minB) * 0.05, padC = (maxC - minC) * 0.05;
    const rngM = (maxM - minM) + padM * 2 || 1;
    const rngB = (maxB - minB) + padB * 2 || 1;
    const rngC = (maxC - minC) + padC * 2 || 1;

    return RHS_PAIRS.map((p, i) => {
      const x = ((p.mutuality - minM + padM) / rngM) * CUBE_SIZE - CUBE_SIZE / 2;
      const y = -(((p.balance - minB + padB) / rngB) * CUBE_SIZE - CUBE_SIZE / 2);  // invert Y
      const z = ((p.chemistry - minC + padC) / rngC) * CUBE_SIZE - CUBE_SIZE / 2;
      const size = 1.5 + (p.psych / 96) * 3;
      return { ...p, x, y, z, size, idx: i };
    });
  }, []);

  // Cube wireframe corners
  const cubeCorners = useMemo(() => {
    const s = CUBE_SIZE / 2;
    return [
      [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
      [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s],
    ];
  }, []);

  const cubeEdges = [
    [0,1],[1,2],[2,3],[3,0], // back
    [4,5],[5,6],[6,7],[7,4], // front
    [0,4],[1,5],[2,6],[3,7], // connecting
  ];

  // Axis label positions
  const axisLabels = useMemo(() => {
    const s = CUBE_SIZE / 2 + 20;
    return [
      { pos: [s, 0, 0], label: 'Mutuality →', color: '#fbbf24' },
      { pos: [0, -s - 10, 0], label: '↑ Balance', color: '#34d399' },
      { pos: [0, 0, s], label: 'Chemistry →', color: '#f472b6' },
    ];
  }, []);

  // Apply rotation + zoom to all geometry
  const transformed = useMemo(() => {
    const ptCoords = points.map(p => [p.x * zoom, p.y * zoom, p.z * zoom]);
    const rotated = rotateX(rotateY(ptCoords, rotYAngle), rotX);
    const projected = rotated.map(([x, y, z], i) => {
      const proj = project(x, y, z);
      return { ...points[i], px: CX + panX + proj.px, py: CY + panY + proj.py, depth: proj.depth, projScale: proj.scale };
    });
    // Sort by depth (far first)
    projected.sort((a, b) => a.depth - b.depth);

    // Cube (scaled by zoom)
    const cubeZoomed = cubeCorners.map(([x, y, z]) => [x * zoom, y * zoom, z * zoom]);
    const cubeRot = rotateX(rotateY(cubeZoomed, rotYAngle), rotX);
    const cubeProj = cubeRot.map(([x, y, z]) => {
      const p = project(x, y, z);
      return { px: CX + panX + p.px, py: CY + panY + p.py };
    });

    // Axis labels (scaled by zoom)
    const labelCoords = axisLabels.map(l => l.pos.map(v => v * zoom));
    const labelRot = rotateX(rotateY(labelCoords, rotYAngle), rotX);
    const labelProj = labelRot.map(([x, y, z], i) => {
      const p = project(x, y, z);
      return { px: CX + panX + p.px, py: CY + panY + p.py, ...axisLabels[i] };
    });

    return { points: projected, cube: cubeProj, labels: labelProj };
  }, [points, rotX, rotYAngle, zoom, panX, panY, cubeCorners, axisLabels]);

  return (
    <div className="bg-slate-900/80 border border-white/10 rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Relationship Health Space</h3>
          <p className="text-[10px] text-white/40">630 pairs — X: Mutuality, Y: Balance, Z: Chemistry. Drag to rotate.</p>
        </div>
        <div className="flex items-center gap-2 text-[9px] flex-wrap">
          {[
            { key: 'gold', label: 'RHS 80+', color: '#fbbf24', bg: 'bg-amber-400' },
            { key: 'purple', label: '70-79', color: '#a78bfa', bg: 'bg-purple-400' },
            { key: 'cyan', label: '60-69', color: '#22d3ee', bg: 'bg-cyan-400' },
            { key: 'green', label: '<60', color: '#86efac', bg: '' },
          ].map(t => (
            <button key={t.key} onClick={() => setVisibleTiers(prev => ({ ...prev, [t.key]: !prev[t.key] }))}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-opacity ${visibleTiers[t.key] ? 'opacity-100' : 'opacity-30 line-through'}`}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
              {t.label}
            </button>
          ))}
          <button onClick={() => setVisibleTiers(prev => ({ ...prev, mutualA: !prev.mutualA }))}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-opacity ${visibleTiers.mutualA ? 'opacity-100' : 'opacity-30 line-through'}`}>
            <span className="w-3 h-3 rounded-full border-2 border-amber-400 bg-transparent" />Mutual A
          </button>
          <span className="text-white/20">|</span>
          <button onClick={() => setZoom(z => Math.min(8, z + 0.5))} className="px-1.5 py-0.5 bg-white/10 rounded text-white/60 hover:bg-white/20">+</button>
          <button onClick={() => setZoom(z => Math.max(0.3, z - 0.5))} className="px-1.5 py-0.5 bg-white/10 rounded text-white/60 hover:bg-white/20">−</button>
          <button onClick={() => { setZoom(1); setPanX(0); setPanY(0); setRotX(-0.35); setRotYAngle(0.65); }}
            className="px-1.5 py-0.5 bg-white/10 rounded text-white/60 hover:bg-white/20 text-[8px]">Reset</button>
        </div>
      </div>

      <svg
        width={W} height={H}
        className="cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        onContextMenu={(e) => e.preventDefault()}
      >
        <defs>
          <radialGradient id="rhs-glow">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background — click to unpin */}
        <rect width={W} height={H} fill="transparent" onClick={() => setPinned(null)} />

        {/* Cube wireframe */}
        {cubeEdges.map(([a, b], i) => (
          <line key={`edge-${i}`}
            x1={transformed.cube[a].px} y1={transformed.cube[a].py}
            x2={transformed.cube[b].px} y2={transformed.cube[b].py}
            stroke="rgba(255,255,255,0.08)" strokeWidth={1}
          />
        ))}

        {/* Axis labels */}
        {transformed.labels.map((l, i) => (
          <text key={`lbl-${i}`} x={l.px} y={l.py}
            fill={l.color} fontSize={10} fontFamily="monospace"
            textAnchor="middle" dominantBaseline="middle" opacity={0.6}>
            {l.label}
          </text>
        ))}

        {/* Data points */}
        {transformed.points.map((p, i) => {
          const r = p.size * p.projScale;
          const opacity = 0.3 + p.projScale * 0.5;
          const color = tierColor(p.final);
          const isPinned = pinned === p.idx;
          const isHov = hovered === p.idx || isPinned;

          // Tier visibility filter
          const tier = p.final >= 80 ? 'gold' : p.final >= 70 ? 'purple' : p.final >= 60 ? 'cyan' : 'green';
          // If mutualA filter is on and this is a mutual A pair, always show it
          const showByMutualA = p.isMutualA && visibleTiers.mutualA;
          if (!visibleTiers[tier] && !showByMutualA) return null;

          return (
            <g key={p.idx}
              onMouseEnter={() => { if (pinned === null) setHovered(p.idx); }}
              onMouseLeave={() => { if (pinned === null) setHovered(null); }}
              onClick={(e) => { e.stopPropagation(); setPinned(pinned === p.idx ? null : p.idx); setHovered(null); }}
              style={{ cursor: 'pointer' }}
            >
              {/* Mutual A-tier halo */}
              {p.isMutualA && visibleTiers.mutualA && (
                <circle cx={p.px} cy={p.py} r={r + 5}
                  fill="none" stroke="#fbbf24" strokeWidth={1.5} opacity={0.6} />
              )}
              {/* Point */}
              <circle cx={p.px} cy={p.py} r={isHov ? r + 2 : r}
                fill={color} opacity={isHov ? 1 : opacity}
                stroke={isHov ? '#fff' : 'none'} strokeWidth={isHov ? 1 : 0}
              />
            </g>
          );
        })}

        {/* Hover/pinned tooltip */}
        {(pinned !== null || hovered !== null) && (() => {
          const activeIdx = pinned !== null ? pinned : hovered;
          const p = transformed.points.find(pt => pt.idx === activeIdx);
          if (!p) return null;
          const tx = Math.min(p.px + 12, W - 180);
          const ty = Math.max(p.py - 50, 10);
          return (
            <g>
              <rect x={tx} y={ty} width={170} height={80} rx={6}
                fill="rgba(15,23,42,0.95)" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
              <text x={tx + 8} y={ty + 14} fill="#fff" fontSize={10} fontWeight="bold">
                {p.labelA} ↔ {p.labelB}
              </text>
              <text x={tx + 8} y={ty + 28} fill={tierColor(p.final)} fontSize={11} fontWeight="bold">
                RHS: {p.final}
              </text>
              <text x={tx + 8} y={ty + 42} fill="#94a3b8" fontSize={9}>
                Mut: {Math.round(p.mutuality)} | Bal: {Math.round(p.balance)} | Chem: {Math.round(p.chemistry)}
              </text>
              <text x={tx + 8} y={ty + 54} fill="#94a3b8" fontSize={9}>
                Psych: {Math.round(p.psych)}
              </text>
              {p.isMutualA && (
                <text x={tx + 8} y={ty + 68} fill="#fbbf24" fontSize={9} fontWeight="bold">
                  ★ Mutual A-Tier
                </text>
              )}
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
