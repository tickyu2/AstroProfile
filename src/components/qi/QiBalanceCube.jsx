/**
 * QiBalanceCube — 3D ratio visualization mapping 5 elements to 3 axes.
 *
 * Axes:  X = Wood − Metal,  Y = Fire − Water,  Z = Earth
 * Each month's MTFQ becomes a single point inside a cube.
 * Connected by a season-colored Qi trajectory ribbon.
 *
 * No Three.js — pure SVG + rotation matrices (same approach as QiVectorPlot3D).
 */
import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';

const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
const ELEM_COLORS = { Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#94a3b8', Water: '#3b82f6' };
const SEASON_COLORS = { Spring: '#22c55e', Summer: '#ef4444', Autumn: '#f59e0b', Winter: '#3b82f6' };
const MONTH_LABELS = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];

// ── 3D math ──
function rotateY(pts, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return pts.map(([x, y, z]) => [x * c + z * s, y, -x * s + z * c]);
}
function rotateX(pts, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return pts.map(([x, y, z]) => [x, y * c - z * s, y * s + z * c]);
}
function project(x, y, z, fov = 800) {
  const scale = fov / (fov + z);
  return { px: x * scale, py: y * scale, depth: z, scale };
}

// ── MTFQ → Cube coordinates ──
function mtfqToCube(qi) {
  const w = qi.Wood || 0, f = qi.Fire || 0, e = qi.Earth || 0, m = qi.Metal || 0, wa = qi.Water || 0;
  return [w - m, f - wa, e]; // X = Wood-Metal, Y = Fire-Water, Z = Earth
}

/**
 * @param {Object} props
 * @param {Array} props.months - QiMonthSnapshot[] (12 months)
 * @param {string} props.dayMasterPolarity - 'Yin' | 'Yang'
 * @param {Object} [props.natalTfq] - Natal TFQ for center reference
 * @param {Object} [props.daYunQi] - Da Yun Qi for tilt plane
 * @param {Array} [props.braceletStones] - Per-month bracelet data with remediedQi
 */
export default function QiBalanceCube({ months, dayMasterPolarity, natalTfq, daYunQi, braceletStones }) {
  const [rotXAngle, setRotXAngle] = useState(0.45);
  const [rotYAngle, setRotYAngle] = useState(-0.6);
  const [zoom, setZoom] = useState(1.0);
  const [hovered, setHovered] = useState(null);
  const [locked, setLocked] = useState(null);
  const [isSpinning, setIsSpinning] = useState(true);
  const [showRibbon, setShowRibbon] = useState(true);
  const [showDaYun, setShowDaYun] = useState(true);
  const [showBracelet, setShowBracelet] = useState(false);
  const [showCollapse, setShowCollapse] = useState(true);
  const dragRef = useRef(null);
  const svgRef = useRef(null);

  const hasBracelet = braceletStones && braceletStones.length > 0;

  // Auto-spin
  useEffect(() => {
    if (!isSpinning) return;
    let frame;
    const spin = () => {
      setRotYAngle(prev => prev + 0.003);
      frame = requestAnimationFrame(spin);
    };
    frame = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(frame);
  }, [isSpinning]);

  // Mouse drag
  const handleMouseDown = useCallback((e) => {
    setIsSpinning(false);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startRotX: rotXAngle, startRotY: rotYAngle };
  }, [rotXAngle, rotYAngle]);

  useEffect(() => {
    const handleMove = (e) => {
      if (!dragRef.current) return;
      setRotYAngle(dragRef.current.startRotY + (e.clientX - dragRef.current.startX) * 0.005);
      setRotXAngle(dragRef.current.startRotX + (e.clientY - dragRef.current.startY) * 0.005);
    };
    const handleUp = () => { dragRef.current = null; };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => { window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleUp); };
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.4, Math.min(2.5, prev - e.deltaY * 0.001)));
  }, []);

  // ── Compute cube data ──
  const data = useMemo(() => {
    if (!months || months.length === 0) return null;

    // Convert each month's MTFQ to cube coordinates
    const monthPoints = months.map((m, i) => {
      const qi = m.functionalQi || {};
      const [x, y, z] = mtfqToCube(qi);
      return {
        raw: [x, y, z],
        qi,
        label: m.monthName || MONTH_LABELS[i] || `M${i + 1}`,
        season: m.season,
        collapse: m.collapseInfo?.mode !== 'none',
        monthIndex: i,
      };
    });

    // Find max extent for normalization
    const allCoords = monthPoints.flatMap(p => p.raw.map(Math.abs));
    const maxExtent = Math.max(...allCoords, 0.01);

    // Natal TFQ center point
    const natalPt = natalTfq ? mtfqToCube(natalTfq) : [0, 0, 0];

    // Da Yun vector (for tilt plane)
    const daYunVec = daYunQi ? mtfqToCube(daYunQi) : null;

    // BRQe correction: compute pre/post bracelet points
    const braceletVectors = (hasBracelet && braceletStones) ? braceletStones.map(bs => {
      if (!bs?.remediedQi) return null;
      const month = months[bs.monthIndex];
      if (!month?.functionalQi) return null;
      const pre = mtfqToCube(month.functionalQi);
      const post = mtfqToCube(bs.remediedQi);
      return { monthIndex: bs.monthIndex, pre, post };
    }).filter(Boolean) : [];

    return { monthPoints, maxExtent, natalPt, daYunVec, braceletVectors };
  }, [months, natalTfq, daYunQi, braceletStones, hasBracelet]);

  // ── Project scene ──
  const rendered = useMemo(() => {
    if (!data) return null;
    const { monthPoints, maxExtent, natalPt, daYunVec, braceletVectors } = data;
    const cx = 300, cy = 300;
    const S = 140 * zoom; // Scale factor

    const proj3d = (pt) => {
      const scaled = [pt[0] / maxExtent * S, pt[1] / maxExtent * S, pt[2] / maxExtent * S];
      // Flip Y so Fire (+Y) goes up on screen
      scaled[1] = -scaled[1];
      let rotated = rotateX([scaled], rotXAngle);
      rotated = rotateY(rotated, rotYAngle);
      const [rx, ry, rz] = rotated[0];
      const p = project(rx, ry, rz);
      return { x: cx + p.px, y: cy + p.py, depth: p.depth, scale: p.scale };
    };

    // Project axis endpoints
    const axisLen = S * 1.15;
    const axes = [
      { label: 'Wood', dir: [1, 0, 0], color: ELEM_COLORS.Wood },
      { label: 'Metal', dir: [-1, 0, 0], color: ELEM_COLORS.Metal },
      { label: 'Fire', dir: [0, 1, 0], color: ELEM_COLORS.Fire },
      { label: 'Water', dir: [0, -1, 0], color: ELEM_COLORS.Water },
      { label: 'Earth', dir: [0, 0, 1], color: ELEM_COLORS.Earth },
    ].map(a => {
      const endPt = a.dir.map(d => d * axisLen / S * maxExtent);
      return { ...a, end: proj3d(endPt), origin: proj3d([0, 0, 0]) };
    });

    // Cube wireframe — 8 corners
    const cubeCorners = [];
    for (let sx of [-1, 1]) {
      for (let sy of [-1, 1]) {
        for (let sz of [-1, 1]) {
          cubeCorners.push(proj3d([sx * maxExtent, sy * maxExtent, sz * maxExtent]));
        }
      }
    }
    // 12 edges of a cube
    const cubeEdges = [
      [0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]
    ];

    // Monthly points projected
    const projPoints = monthPoints.map(mp => ({
      ...mp,
      proj: proj3d(mp.raw),
    }));

    // Natal center
    const natalProj = proj3d(natalPt);

    // Da Yun tilt plane — 4 corners of a plane perpendicular to daYunVec
    let daYunPlane = null;
    if (daYunVec && showDaYun) {
      // Create a disc/square in the plane perpendicular to the Da Yun vector
      const [dx, dy, dz] = daYunVec;
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (len > 0.01) {
        const nx = dx / len, ny = dy / len, nz = dz / len;
        // Find two perpendicular vectors to the normal
        let ux, uy, uz;
        if (Math.abs(nx) < 0.9) {
          ux = 0; uy = -nz; uz = ny;
        } else {
          ux = -nz; uy = 0; uz = nx;
        }
        const uLen = Math.sqrt(ux * ux + uy * uy + uz * uz) || 1;
        ux /= uLen; uy /= uLen; uz /= uLen;
        // Cross product for second perpendicular
        const vx = ny * uz - nz * uy;
        const vy = nz * ux - nx * uz;
        const vz = nx * uy - ny * ux;
        const r = maxExtent * 0.7; // plane size
        const planeCorners = [
          [r * ux + r * vx, r * uy + r * vy, r * uz + r * vz],
          [r * ux - r * vx, r * uy - r * vy, r * uz - r * vz],
          [-r * ux - r * vx, -r * uy - r * vy, -r * uz - r * vz],
          [-r * ux + r * vx, -r * uy + r * vy, -r * uz + r * vz],
        ];
        daYunPlane = {
          corners: planeCorners.map(c => proj3d(c)),
          normal: proj3d([dx, dy, dz]),
          element: getMaxElement(daYunQi),
        };
      }
    }

    // BRQe correction arrows
    const correctionArrows = braceletVectors.map(bv => ({
      ...bv,
      preProj: proj3d(bv.pre),
      postProj: proj3d(bv.post),
    }));

    // Collapse zones — one per element dominance direction
    const collapseZones = showCollapse ? [
      { label: 'Wood Dom.', center: [maxExtent * 0.7, 0, 0], color: ELEM_COLORS.Wood },
      { label: 'Fire Dom.',  center: [0, maxExtent * 0.7, 0], color: ELEM_COLORS.Fire },
      { label: 'Earth Dom.', center: [0, 0, maxExtent * 0.7], color: ELEM_COLORS.Earth },
      { label: 'Metal Dom.', center: [-maxExtent * 0.7, 0, 0], color: ELEM_COLORS.Metal },
      { label: 'Water Dom.', center: [0, -maxExtent * 0.7, 0], color: ELEM_COLORS.Water },
    ].map(cz => ({ ...cz, proj: proj3d(cz.center) })) : [];

    return { axes, cubeCorners, cubeEdges, projPoints, natalProj, daYunPlane, correctionArrows, collapseZones, cx, cy };
  }, [data, rotXAngle, rotYAngle, zoom, showDaYun, showCollapse]);

  if (!data || !rendered) return null;

  const activeIdx = locked ?? hovered;
  const activePoint = activeIdx !== null ? rendered.projPoints[activeIdx] : null;
  const isYin = dayMasterPolarity === 'Yin';

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/80 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 bg-white/5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-white">Qi Balance Cube — 3D Ratio Visualization</div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              X = Wood−Metal &middot; Y = Fire−Water &middot; Z = Earth &middot;
              <span style={{ color: isYin ? '#60a5fa' : '#f87171' }}> {dayMasterPolarity}</span>
            </div>
          </div>
          <div className="flex gap-1.5 items-center flex-wrap">
            <button onClick={() => setIsSpinning(s => !s)}
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors ${isSpinning ? 'border-teal-500/50 text-teal-400 bg-teal-900/30' : 'border-white/20 text-gray-400 hover:text-white'}`}
            >{isSpinning ? 'spinning' : 'spin'}</button>
            <button onClick={() => setShowRibbon(s => !s)}
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors ${showRibbon ? 'border-emerald-500/50 text-emerald-400 bg-emerald-900/30' : 'border-white/20 text-gray-400 hover:text-white'}`}
            >Ribbon</button>
            {daYunQi && (
              <button onClick={() => setShowDaYun(s => !s)}
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors ${showDaYun ? 'border-pink-500/50 text-pink-400 bg-pink-900/30' : 'border-white/20 text-gray-400 hover:text-white'}`}
              >Da Yun</button>
            )}
            <button onClick={() => setShowCollapse(s => !s)}
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors ${showCollapse ? 'border-red-500/50 text-red-400 bg-red-900/30' : 'border-white/20 text-gray-400 hover:text-white'}`}
            >Zones</button>
            {hasBracelet && (
              <button onClick={() => setShowBracelet(s => !s)}
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors ${showBracelet ? 'border-violet-500/50 text-violet-400 bg-violet-900/30' : 'border-white/20 text-gray-400 hover:text-white'}`}
              >BRQe</button>
            )}
            <span className="border-l border-white/10 h-4 mx-0.5" />
            <button onClick={() => setZoom(prev => Math.min(2.5, prev + 0.15))}
              className="text-[11px] font-mono w-5 h-5 flex items-center justify-center rounded border border-white/20 text-gray-400 hover:text-white transition-colors"
            >+</button>
            <button onClick={() => setZoom(prev => Math.max(0.4, prev - 0.15))}
              className="text-[11px] font-mono w-5 h-5 flex items-center justify-center rounded border border-white/20 text-gray-400 hover:text-white transition-colors"
            >−</button>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="px-6 py-2 flex justify-center">
        <svg ref={svgRef} viewBox="0 0 600 600" className="select-none"
          style={{ width: '100%', maxWidth: 640, height: 540, cursor: dragRef.current ? 'grabbing' : 'grab' }}
          onMouseDown={handleMouseDown} onWheel={handleWheel}
          onClick={() => { if (locked !== null) { setLocked(null); setHovered(null); } }}
        >
          {/* Background glow */}
          <defs>
            <radialGradient id="cubeGlow">
              <stop offset="0%" stopColor="rgba(99,102,241,0.08)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle cx={300} cy={300} r={260} fill="url(#cubeGlow)" />

          {/* Cube wireframe */}
          {rendered.cubeEdges.map(([a, b], i) => (
            <line key={`edge-${i}`}
              x1={rendered.cubeCorners[a].x} y1={rendered.cubeCorners[a].y}
              x2={rendered.cubeCorners[b].x} y2={rendered.cubeCorners[b].y}
              stroke="rgba(255,255,255,0.25)" strokeWidth={1}
            />
          ))}

          {/* Axis lines */}
          {rendered.axes.map((ax, i) => (
            <g key={`axis-${i}`}>
              <line
                x1={ax.origin.x} y1={ax.origin.y}
                x2={ax.end.x} y2={ax.end.y}
                stroke={ax.color} strokeWidth={1} opacity={0.4}
              />
              <text x={ax.end.x} y={ax.end.y - 6}
                fill={ax.color} fontSize={11} textAnchor="middle" fontFamily="monospace" fontWeight="bold"
                opacity={0.8}
              >{ax.label}</text>
            </g>
          ))}

          {/* Collapse zones — soft translucent circles */}
          {rendered.collapseZones.map((cz, i) => (
            <g key={`cz-${i}`} opacity={0.15}>
              <circle cx={cz.proj.x} cy={cz.proj.y} r={35 * cz.proj.scale}
                fill={cz.color}
              />
              <text x={cz.proj.x} y={cz.proj.y + 4}
                fill={cz.color} fontSize={7} textAnchor="middle" fontFamily="monospace" opacity={0.8}
              >{cz.label}</text>
            </g>
          ))}

          {/* Da Yun tilt plane */}
          {rendered.daYunPlane && (
            <polygon
              points={rendered.daYunPlane.corners.map(c => `${c.x},${c.y}`).join(' ')}
              fill={ELEM_COLORS[rendered.daYunPlane.element] || '#ec4899'}
              stroke={ELEM_COLORS[rendered.daYunPlane.element] || '#ec4899'}
              strokeWidth={0.8}
              fillOpacity={0.06}
              strokeOpacity={0.3}
              strokeDasharray="4 3"
            />
          )}

          {/* Natal center point */}
          <circle cx={rendered.natalProj.x} cy={rendered.natalProj.y} r={4}
            fill="none" stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="2 2" opacity={0.6}
          />

          {/* Qi Trajectory Ribbon */}
          {showRibbon && rendered.projPoints.length > 1 && (
            <polyline
              points={rendered.projPoints.map(p => `${p.proj.x},${p.proj.y}`).join(' ')}
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          )}

          {/* Ribbon season-colored segments */}
          {showRibbon && rendered.projPoints.map((p, i) => {
            if (i === 0) return null;
            const prev = rendered.projPoints[i - 1];
            const color = SEASON_COLORS[p.season] || '#888';
            return (
              <line key={`seg-${i}`}
                x1={prev.proj.x} y1={prev.proj.y}
                x2={p.proj.x} y2={p.proj.y}
                stroke={color} strokeWidth={2} opacity={0.5}
                strokeLinecap="round"
              />
            );
          })}

          {/* BRQe correction arrows */}
          {showBracelet && rendered.correctionArrows.map((ca, i) => {
            const isActive = activeIdx === ca.monthIndex;
            return (
              <g key={`brqe-${i}`} opacity={isActive ? 1 : 0.35}>
                {/* Arrow line: red → green */}
                <line
                  x1={ca.preProj.x} y1={ca.preProj.y}
                  x2={ca.postProj.x} y2={ca.postProj.y}
                  stroke="#a78bfa" strokeWidth={isActive ? 2 : 1}
                  markerEnd="url(#arrowhead)"
                />
                {/* Post-bracelet point */}
                <circle cx={ca.postProj.x} cy={ca.postProj.y} r={isActive ? 4 : 2}
                  fill="#22c55e" stroke="rgba(255,255,255,0.5)" strokeWidth={0.5}
                />
              </g>
            );
          })}

          {/* Arrowhead marker */}
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill="#a78bfa" />
            </marker>
          </defs>

          {/* Monthly points */}
          {rendered.projPoints.map((p, i) => {
            const isActive = activeIdx === i;
            const sColor = SEASON_COLORS[p.season] || '#888';
            const r = isActive ? 6 : 3.5;
            return (
              <g key={`pt-${i}`}
                onMouseEnter={() => { if (locked === null) setHovered(i); }}
                onMouseLeave={() => { if (locked === null) setHovered(null); }}
                onClick={(e) => { e.stopPropagation(); setLocked(prev => prev === i ? null : i); }}
                style={{ cursor: 'pointer' }}
              >
                {/* Collapse marker */}
                {p.collapse && (
                  <circle cx={p.proj.x} cy={p.proj.y} r={r + 4}
                    fill="none" stroke="rgba(239,68,68,0.5)" strokeWidth={1.5}
                  />
                )}
                {/* Point */}
                <circle cx={p.proj.x} cy={p.proj.y} r={r}
                  fill={sColor} stroke={isActive ? '#fff' : 'rgba(255,255,255,0.4)'}
                  strokeWidth={isActive ? 1.5 : 0.5}
                  opacity={isActive ? 1 : 0.7}
                />
                {/* Month label */}
                {isActive && (
                  <text x={p.proj.x} y={p.proj.y - r - 5}
                    fill="#fff" fontSize={10} textAnchor="middle" fontFamily="monospace"
                  >{p.label}</text>
                )}
              </g>
            );
          })}

          {/* Origin crosshair */}
          {(() => {
            const o = rendered.axes[0]?.origin;
            if (!o) return null;
            return (
              <g opacity={0.2}>
                <line x1={o.x - 6} y1={o.y} x2={o.x + 6} y2={o.y} stroke="#fff" strokeWidth={0.5} />
                <line x1={o.x} y1={o.y - 6} x2={o.x} y2={o.y + 6} stroke="#fff" strokeWidth={0.5} />
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Month scrubber */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-1">
          {(months || []).map((m, i) => {
            const isActive = activeIdx === i;
            const sColor = SEASON_COLORS[m.season] || '#888';
            return (
              <button key={i}
                onMouseEnter={() => { if (locked === null) setHovered(i); }}
                onMouseLeave={() => { if (locked === null) setHovered(null); }}
                onClick={() => setLocked(prev => prev === i ? null : i)}
                className="flex-1 flex flex-col items-center gap-0.5"
              >
                <div className="w-full rounded-sm transition-all"
                  style={{ height: isActive ? 12 : 4, background: sColor, opacity: isActive ? 1 : 0.35 }}
                />
                <span className="text-[7px] font-mono" style={{ color: isActive ? '#fff' : '#6b7280' }}>
                  {(m.monthName || MONTH_LABELS[i] || '').slice(0, 3)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tooltip / Interpretation panel */}
      {activePoint && (() => {
        const [x, y, z] = activePoint.raw;
        const mag = Math.sqrt(x * x + y * y + z * z);
        const qi = activePoint.qi;
        // Dominant direction
        const dirs = [
          { el: 'Wood', val: x }, { el: 'Metal', val: -x },
          { el: 'Fire', val: y }, { el: 'Water', val: -y },
          { el: 'Earth', val: z },
        ].sort((a, b) => b.val - a.val);
        const dominant = dirs[0];

        return (
          <div className="px-4 pb-3">
            <div className={`rounded border bg-black/40 text-[10px] font-mono text-gray-300 p-3 ${locked !== null ? 'border-teal-500/40' : 'border-white/10'}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-white font-semibold text-xs">{activePoint.label}</span>
                {locked !== null && <span className="text-teal-400 text-[8px]">LOCKED</span>}
                <span style={{ color: SEASON_COLORS[activePoint.season] }}>{activePoint.season}</span>
                {activePoint.collapse && <span className="text-red-400">COLLAPSE</span>}
              </div>

              {/* Raw MTFQ values */}
              <div className="flex gap-3 mb-1.5">
                {ELEMENTS.map(el => (
                  <span key={el}><span style={{ color: ELEM_COLORS[el] }}>{el}</span> {(qi[el] || 0).toFixed(2)}</span>
                ))}
              </div>

              {/* Formula steps */}
              <div className="text-gray-500 mb-2 space-y-0.5">
                <div>X = <span style={{ color: ELEM_COLORS.Wood }}>Wood({(qi.Wood || 0).toFixed(2)})</span> − <span style={{ color: ELEM_COLORS.Metal }}>Metal({(qi.Metal || 0).toFixed(2)})</span> = <span className="text-white">{x.toFixed(2)}</span> → <span style={{ color: x > 0 ? ELEM_COLORS.Wood : ELEM_COLORS.Metal }}>{x > 0 ? 'Wood' : 'Metal'} side</span></div>
                <div>Y = <span style={{ color: ELEM_COLORS.Fire }}>Fire({(qi.Fire || 0).toFixed(2)})</span> − <span style={{ color: ELEM_COLORS.Water }}>Water({(qi.Water || 0).toFixed(2)})</span> = <span className="text-white">{y.toFixed(2)}</span> → <span style={{ color: y > 0 ? ELEM_COLORS.Fire : ELEM_COLORS.Water }}>{y > 0 ? 'Fire' : 'Water'} side</span></div>
                <div>Z = <span style={{ color: ELEM_COLORS.Earth }}>Earth({(qi.Earth || 0).toFixed(2)})</span> = <span className="text-white">{z.toFixed(2)}</span></div>
                <div>|v| = sqrt({x.toFixed(2)}² + {y.toFixed(2)}² + {z.toFixed(2)}²) = <span className="text-white">{mag.toFixed(2)}</span></div>
              </div>

              {/* BRQe correction data */}
              {showBracelet && (() => {
                const ca = data.braceletVectors.find(bv => bv.monthIndex === activeIdx);
                if (!ca) return null;
                const [px, py, pz] = ca.post;
                const postMag = Math.sqrt(px * px + py * py + pz * pz);
                const bs = braceletStones?.find(b => b.monthIndex === activeIdx);
                const postQi = bs?.remediedQi;
                // Stone breakdown per element
                const stones = bs?.stones || [];
                const stoneByEl = {};
                stones.forEach(s => {
                  if (!stoneByEl[s.element]) stoneByEl[s.element] = { count: 0, qi: 0 };
                  stoneByEl[s.element].count++;
                  stoneByEl[s.element].qi += s.qiUnit || 0;
                });
                return (
                  <div className="border-t border-violet-500/20 pt-2 mt-1 mb-1">
                    <div className="text-violet-400 text-[9px] mb-1.5">BRQe Correction (purple arrow → green dot):</div>
                    {/* BRQe per-element correction */}
                    <div className="text-gray-500 mb-1.5">
                      <div className="text-[9px] text-gray-600 mb-0.5">BRQe = 35% of (MIFQ − MTFQ), capped at 50% of |gap|</div>
                      {ELEMENTS.map(el => {
                        const brqe = bs?.brqeCorrection?.[el] || 0;
                        if (Math.abs(brqe) < 0.001) return null;
                        return (
                          <div key={el}>
                            <span style={{ color: ELEM_COLORS[el] }}>{el}</span>: MTFQ {(qi[el] || 0).toFixed(3)} {brqe >= 0 ? '+' : ''} BRQe {brqe.toFixed(3)} = <span className="text-white">{((qi[el] || 0) + brqe).toFixed(3)}</span>
                          </div>
                        );
                      })}
                      {!bs?.brqeCorrection && <div>No BRQe data for this month</div>}
                    </div>
                    {/* Post-bracelet MTFQ */}
                    {postQi && (
                      <div className="flex gap-3 mb-1.5">
                        {ELEMENTS.map(el => {
                          const brqe = bs?.brqeCorrection?.[el] || 0;
                          return (
                            <span key={el}>
                              <span style={{ color: ELEM_COLORS[el] }}>{el}</span> {(postQi[el] || 0).toFixed(2)}
                              {Math.abs(brqe) > 0.001 && <span className={brqe > 0 ? 'text-emerald-500' : 'text-red-400'}> ({brqe >= 0 ? '+' : ''}{brqe.toFixed(3)})</span>}
                            </span>
                          );
                        })}
                      </div>
                    )}
                    {/* Post-bracelet cube formula */}
                    <div className="text-gray-500 space-y-0.5 mb-1.5">
                      <div>X' = {(postQi?.Wood || 0).toFixed(2)} − {(postQi?.Metal || 0).toFixed(2)} = <span className="text-white">{px.toFixed(2)}</span></div>
                      <div>Y' = {(postQi?.Fire || 0).toFixed(2)} − {(postQi?.Water || 0).toFixed(2)} = <span className="text-white">{py.toFixed(2)}</span></div>
                      <div>Z' = {(postQi?.Earth || 0).toFixed(2)} = <span className="text-white">{pz.toFixed(2)}</span></div>
                      <div>|v'| = <span className="text-white">{postMag.toFixed(2)}</span></div>
                    </div>
                    {/* Shift summary */}
                    <div className="text-gray-500">
                      Shift: X {(px - x) >= 0 ? '+' : ''}{(px - x).toFixed(2)} &middot;
                      Y {(py - y) >= 0 ? '+' : ''}{(py - y).toFixed(2)} &middot;
                      Z {(pz - z) >= 0 ? '+' : ''}{(pz - z).toFixed(2)} &middot;
                      |v| {postMag < mag ? '' : '+'}{(postMag - mag).toFixed(2)}
                      {postMag > mag && <span className="text-amber-400 ml-1">(further from center!)</span>}
                      {postMag < mag && <span className="text-emerald-400 ml-1">(closer to center)</span>}
                    </div>
                  </div>
                );
              })()}

              {/* Interpretation */}
              <div className="text-gray-400 border-t border-white/10 pt-2 mt-1">
                <span className="text-white">Dominant: </span>
                <span style={{ color: ELEM_COLORS[dominant.el] }}>{dominant.el}</span>
                <span> ({dominant.val.toFixed(2)})</span>
                {mag > data.maxExtent * 0.6 && (
                  <span className="text-amber-400 ml-2">Strong imbalance — vector far from center</span>
                )}
                {mag < data.maxExtent * 0.2 && (
                  <span className="text-green-400 ml-2">Well balanced — vector near center</span>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Legend */}
      <div className="px-4 pb-3 flex items-center gap-3 text-[9px] text-gray-300 font-mono flex-wrap">
        {Object.entries(SEASON_COLORS).map(([season, col]) => (
          <span key={season} className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: col }} /> {season}
          </span>
        ))}
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full border" style={{ borderColor: '#fbbf24' }} /> Natal
        </span>
        {showDaYun && daYunQi && (
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-0 border-t border-dashed" style={{ borderColor: '#ec4899' }} /> Da Yun Plane
          </span>
        )}
        {showBracelet && (
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: '#22c55e' }} /> Remedied
          </span>
        )}
      </div>
    </div>
  );
}

/** Find the element with the highest value */
function getMaxElement(qi) {
  if (!qi) return 'Fire';
  let best = 'Wood', bestVal = -Infinity;
  for (const el of ELEMENTS) {
    if ((qi[el] || 0) > bestVal) { bestVal = qi[el] || 0; best = el; }
  }
  return best;
}
