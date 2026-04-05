/**
 * QiVectorPlot3D — Rotatable 3D pentagon sphere showing MTFQ across 12 months.
 *
 * Each month's MTFQ is plotted as a pentagon (5 elements) in 3D space.
 * Mouse drag rotates the view. Scroll zooms.
 * Da Yun is shown as a constant tilt shape.
 * Polarity = line color (Yang=warm, Yin=cool).
 *
 * No Three.js — pure SVG + rotation matrices.
 */
import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import EngineeredBraceletVisualizer from './EngineeredBraceletVisualizer';
import { computeQiYearMatrix } from '../../utils/qiEngine';

const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
const ELEM_COLORS = { Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#94a3b8', Water: '#3b82f6' };
const MONTH_LABELS = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
const SEASON_COLORS = { Spring: '#22c55e', Summer: '#ef4444', Autumn: '#f59e0b', Winter: '#3b82f6' };

const W_NATAL = 1.0;
const W_DAYUN = 0.9;
const W_YEAR  = 0.5;
const W_MONTH = 0.3;

function sumQi(qi) {
  if (!qi) return 0;
  return ELEMENTS.reduce((s, el) => s + (qi[el] || 0), 0);
}

// ── 3D rotation matrices ──
function rotateY(pts, angle) {
  const c = Math.cos(angle), s = Math.sin(angle);
  return pts.map(([x, y, z]) => [x * c + z * s, y, -x * s + z * c]);
}
function rotateX(pts, angle) {
  const c = Math.cos(angle), s = Math.sin(angle);
  return pts.map(([x, y, z]) => [x, y * c - z * s, y * s + z * c]);
}

// Perspective projection
function project(x, y, z, fov = 900) {
  const scale = fov / (fov + z);
  return { px: x * scale, py: y * scale, depth: z, scale };
}

// Pentagon vertex positions in 3D — 5 element axes spread evenly
// Arranged on XZ plane, Y is the "height" (month offset)
// Clockwise: Wood at top, then Fire, Earth, Metal, Water
function pentagonVertex(elIndex, radius) {
  const angle = -(elIndex / 5) * Math.PI * 2 - Math.PI / 2; // negative = clockwise, start from top
  return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
}

/**
 * @param {Object} props
 * @param {Array} props.months - QiMonthSnapshot[]
 * @param {string} props.dayMasterPolarity - 'Yin' | 'Yang'
 * @param {Array} [props.braceletStones] - Per-month bracelet stones:
 *   [{monthIndex, stones: [{element, name, color, qiUnit}], remediedQi: {Wood,Fire,Earth,Metal,Water}}]
 */
export default function QiVectorPlot3D({ months, dayMasterPolarity, braceletStones, chart, daYunResult, ntfq, birthYear }) {
  const [rotX, setRotX] = useState(0.55);
  const [rotY, setRotY] = useState(0.4);
  const [zoom, setZoom] = useState(1.0);
  const [hovered, setHovered] = useState(null);
  const [locked, setLocked] = useState(null); // locked month index
  const [selectedElement, setSelectedElement] = useState(null); // clicked element name
  const [viewMode, setViewMode] = useState('mtfq'); // 'mtfq' | '4d' | 'bars'
  const [layerVis, setLayerVis] = useState({ natal: true, dayun: true, year: true, month: true, mtfq: true });
  const [isSpinning, setIsSpinning] = useState(true);
  const [heartbeat, setHeartbeat] = useState(false);
  const [heartbeatPaused, setHeartbeatPaused] = useState(false);
  const [heartbeatMonth, setHeartbeatMonth] = useState(0);
  const [heartbeatPulse, setHeartbeatPulse] = useState(0); // 0→1 pulse phase
  const [showStones, setShowStones] = useState(false);
  const [showRemedied, setShowRemedied] = useState(false);
  const [floatingBracelet, setFloatingBracelet] = useState(null); // { monthIndex, pos }
  const [lifeMode, setLifeMode] = useState(false);
  const [lifeAge, setLifeAge] = useState(0);
  const [lifeAnimating, setLifeAnimating] = useState(false);
  const lifeAnimRef = useRef(null);
  const floatingDragRef = useRef(null);
  const heartbeatPausedRef = useRef(false);
  const heartbeatElapsedRef = useRef(0); // accumulated elapsed time when paused
  const dragRef = useRef(null);
  const animRef = useRef(null);
  const svgRef = useRef(null);
  const hasBracelet = braceletStones && braceletStones.length > 0;
  const canLife = !!(chart && daYunResult && birthYear);

  // ── Life Worm: precompute per-decade centroids + active year months ──
  const lifeData = useMemo(() => {
    if (!canLife || !lifeMode) return null;
    try {
      // Compute centroid for each Da Yun decade (midpoint year)
      const decadeCentroids = (daYunResult.pillars || []).map(pillar => {
        const midYear = Math.floor((pillar.yearStart + pillar.yearEnd) / 2);
        const matrix = computeQiYearMatrix(chart, midYear, daYunResult, ntfq);
        if (!matrix?.months?.length) return null;
        // Average functional Qi across 12 months → decade centroid
        const centroid = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
        matrix.months.forEach(m => {
          ELEMENTS.forEach(el => { centroid[el] += (m.functionalQi?.[el] || 0) / 12; });
        });
        return {
          age: pillar.ageStart,
          ageEnd: pillar.ageEnd,
          year: midYear,
          centroid,
          stem: pillar.stem,
          branch: pillar.branch,
          animal: pillar.branchAnimal,
          element: pillar.element,
        };
      }).filter(Boolean);

      // Compute months for the selected age
      const selectedYear = birthYear + Math.round(lifeAge);
      const matrix = computeQiYearMatrix(chart, selectedYear, daYunResult, ntfq);
      const activeMonths = matrix?.months || [];
      const activePillar = daYunResult.pillars?.find(
        p => selectedYear >= p.yearStart && selectedYear <= p.yearEnd
      );

      return { decadeCentroids, activeMonths, activePillar, dayMasterPolarity: matrix?.dayMasterPolarity };
    } catch (err) {
      console.error('Life worm computation error:', err);
      return null;
    }
  }, [canLife, lifeMode, lifeAge, chart, daYunResult, ntfq, birthYear]);

  // Life worm auto-play animation
  useEffect(() => {
    if (!lifeAnimating) { lifeAnimRef.current = null; return; }
    let frame;
    let lastTime = performance.now();
    const tick = (now) => {
      const dt = now - lastTime;
      lastTime = now;
      setLifeAge(prev => {
        const next = prev + dt * 0.003; // ~0.3 years per second (~5 min for full life)
        if (next >= 100) { setLifeAnimating(false); return 100; }
        return next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    lifeAnimRef.current = frame;
    return () => cancelAnimationFrame(frame);
  }, [lifeAnimating]);

  // Auto-spin
  useEffect(() => {
    if (!isSpinning) { animRef.current = null; return; }
    let frame;
    const spin = () => {
      setRotY(prev => prev + 0.003);
      frame = requestAnimationFrame(spin);
    };
    frame = requestAnimationFrame(spin);
    animRef.current = frame;
    return () => cancelAnimationFrame(frame);
  }, [isSpinning]);

  // Heartbeat animation — cycle months with pulse
  useEffect(() => {
    if (!heartbeat) return;
    setLocked(null);
    setHovered(0);
    setHeartbeatMonth(0);
    setHeartbeatPaused(false);
    heartbeatPausedRef.current = false;
    heartbeatElapsedRef.current = 0;
    const CYCLE_MS = 2000;
    let lastTime = performance.now();
    let frame;
    const tick = (now) => {
      if (!heartbeatPausedRef.current) {
        heartbeatElapsedRef.current += now - lastTime;
      }
      lastTime = now;
      const elapsed = heartbeatElapsedRef.current;
      const monthIdx = Math.floor(elapsed / CYCLE_MS) % 12;
      const phase = (elapsed % CYCLE_MS) / CYCLE_MS;
      // Pulse: quick rise then slow fall (ease-out)
      const pulse = phase < 0.25 ? phase / 0.25 : Math.max(0, 1 - (phase - 0.25) / 0.75);
      setHeartbeatMonth(monthIdx);
      setHeartbeatPulse(pulse);
      setHovered(monthIdx);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [heartbeat]);

  // Mouse drag rotation
  const handleMouseDown = useCallback((e) => {
    setIsSpinning(false);
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, startRotX: rotX, startRotY: rotY };
  }, [rotX, rotY]);

  useEffect(() => {
    const handleMove = (e) => {
      if (!dragRef.current) return;
      const dx = (e.clientX - dragRef.current.startX) * 0.005;
      const dy = (e.clientY - dragRef.current.startY) * 0.005;
      setRotY(dragRef.current.startRotY + dx);
      setRotX(dragRef.current.startRotX + dy);
    };
    const handleUp = () => { dragRef.current = null; };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, []);

  // Scroll zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.4, Math.min(2.5, prev - e.deltaY * 0.001)));
  }, []);

  // ── Compute 3D data ──
  // When life mode is active, use the slider year's months instead
  const effectiveMonths = (lifeMode && lifeData?.activeMonths?.length) ? lifeData.activeMonths : months;

  const data = useMemo(() => {
    if (!effectiveMonths || effectiveMonths.length === 0) return null;

    // For each month, compute per-element MTFQ values
    const monthData = effectiveMonths.map((m, i) => {
      // Use actual MTFQ (post-pipeline: after clashes, control, Sheng, etc.)
      const vals = {};
      // Per-layer per-element (for 4D decomposition)
      const layers = { natal: {}, dayun: {}, year: {}, month: {} };
      ELEMENTS.forEach(el => {
        vals[el] = m.functionalQi?.[el] || 0;
        // 4D layers: weighted contributions — what each layer adds to MTFQ
        layers.natal[el]  = (m.natalTfq?.[el] || 0) * W_NATAL;
        layers.dayun[el]  = (m.daYunQi?.[el]  || 0) * W_DAYUN;
        layers.year[el]   = (m.yearQi?.[el]   || 0) * W_YEAR;
        layers.month[el]  = (m.monthQi?.[el]  || 0) * W_MONTH;
      });
      return {
        label: m.monthName || MONTH_LABELS[i] || `M${i + 1}`,
        season: m.season,
        vals,
        layers,
        total: sumQi(m.functionalQi),
        collapse: m.collapseInfo?.mode !== 'none',
        // Decomposed totals
        natal:   sumQi(m.natalTfq) * W_NATAL,
        dayun:   sumQi(m.daYunQi)  * W_DAYUN,
        weather: sumQi(m.yearQi)   * W_YEAR + sumQi(m.monthQi) * W_MONTH,
      };
    });

    // DaYun shape (constant across year)
    const daYunShape = {};
    ELEMENTS.forEach(el => {
      daYunShape[el] = (effectiveMonths[0]?.daYunQi?.[el] || 0) * W_DAYUN;
    });

    // Natal shape (constant)
    const natalShape = {};
    ELEMENTS.forEach(el => {
      natalShape[el] = (effectiveMonths[0]?.natalTfq?.[el] || 0) * W_NATAL;
    });

    // Find max value for normalization
    const allVals = monthData.flatMap(m => ELEMENTS.map(el => m.vals[el]));
    const maxVal = Math.max(...allVals, 0.01);

    // Remedied Qi shapes (after bracelet stones applied)
    const remediedData = braceletStones ? monthData.map((m, i) => {
      const bs = braceletStones.find(b => b.monthIndex === i);
      if (!bs?.remediedQi) return null;
      return { vals: bs.remediedQi, stones: bs.stones || [] };
    }) : null;

    // Include remedied values in maxVal calculation
    const allVals2 = remediedData
      ? remediedData.filter(Boolean).flatMap(r => ELEMENTS.map(el => r.vals[el] || 0))
      : [];
    const finalMaxVal = Math.max(maxVal, ...allVals2, 0.01);

    return { monthData, daYunShape, natalShape, maxVal: finalMaxVal, remediedData };
  }, [effectiveMonths, braceletStones]);

  if (!data) return null;
  const { monthData, daYunShape, natalShape, maxVal, remediedData } = data;
  const isYin = dayMasterPolarity === 'Yin';
  const R = 160 * zoom; // base radius

  // ── Build 3D scene ──
  const scene = useMemo(() => {
    const monthSpacing = 54 * zoom;
    const totalHeight = (monthData.length - 1) * monthSpacing;
    const shapes = [];

    // Axis ring (reference pentagon at Y=0) — larger for visibility
    const axisRing = ELEMENTS.map((el, ei) => pentagonVertex(ei, R * 1.05));

    // Month pentagons stacked along Y axis
    monthData.forEach((m, mi) => {
      // Feb at top, Jan at bottom (positive Y = up after rotation)
      const yOff = (mi - (monthData.length - 1) / 2) * monthSpacing;
      const pts = ELEMENTS.map((el, ei) => {
        const [bx, , bz] = pentagonVertex(ei, (m.vals[el] / maxVal) * R);
        return [bx, yOff, bz];
      });
      shapes.push({ type: 'month', pts, month: m, index: mi, yOff });
    });

    // DaYun reference pentagon at center
    const daYunPts = ELEMENTS.map((el, ei) => {
      const [bx, , bz] = pentagonVertex(ei, (daYunShape[el] / maxVal) * R);
      return [bx, 0, bz];
    });

    // Natal reference pentagon at center
    const natalPts = ELEMENTS.map((el, ei) => {
      const [bx, , bz] = pentagonVertex(ei, (natalShape[el] / maxVal) * R);
      return [bx, 0, bz];
    });

    // 4D layer shapes: for each month, 4 nested pentagons (natal, dayun, year, month)
    const LAYER_DEFS = [
      { key: 'natal', color: '#fbbf24', label: 'NTFQ ×1.0' },
      { key: 'dayun', color: '#ec4899', label: 'DaYun ×0.9' },
      { key: 'year',  color: '#a78bfa', label: 'Year ×0.5' },
      { key: 'month', color: '#22d3ee', label: 'Month ×0.3' },
    ];
    const layerShapes = monthData.map((m, mi) => {
      const yOff = (mi - (monthData.length - 1) / 2) * monthSpacing;
      const perLayer = LAYER_DEFS.map(ld => {
        const pts = ELEMENTS.map((el, ei) => {
          const [bx, , bz] = pentagonVertex(ei, (m.layers[ld.key][el] / maxVal) * R);
          return [bx, yOff, bz];
        });
        return { ...ld, pts };
      });
      // MTFQ resultant pentagon (sum of all weighted layers)
      const mtfqPts = ELEMENTS.map((el, ei) => {
        const [bx, , bz] = pentagonVertex(ei, (m.vals[el] / maxVal) * R);
        return [bx, yOff, bz];
      });
      return { month: m, index: mi, yOff, perLayer, mtfqPts };
    });

    // Remedied pentagons (bracelet-adjusted Qi)
    const remediedShapes = remediedData ? remediedData.map((rd, mi) => {
      if (!rd) return null;
      const yOff = (mi - (monthData.length - 1) / 2) * monthSpacing;
      const pts = ELEMENTS.map((el, ei) => {
        const [bx, , bz] = pentagonVertex(ei, ((rd.vals[el] || 0) / maxVal) * R);
        return [bx, yOff, bz];
      });
      return { pts, stones: rd.stones, index: mi };
    }) : [];

    // Stone orbs — individual stones strung along the element axis.
    // The LENGTH of each strand shows correction strength (more stones = longer strand).
    const stoneOrbs = remediedData ? remediedData.flatMap((rd, mi) => {
      if (!rd?.stones?.length) return [];
      const yOff = (mi - (monthData.length - 1) / 2) * monthSpacing;
      // Group stones by element
      const byEl = {};
      rd.stones.forEach(s => {
        if (!byEl[s.element]) byEl[s.element] = [];
        byEl[s.element].push(s);
      });
      const orbs = [];
      ELEMENTS.forEach((el, ei) => {
        const group = byEl[el];
        if (!group?.length) return;
        const rawR = ((monthData[mi]?.vals[el] || 0) / maxVal) * R;
        const remR = ((rd.vals[el] || 0) / maxVal) * R;
        group.forEach((stone, si) => {
          const t = group.length === 1 ? 0.5 : si / (group.length - 1);
          const stoneR = rawR + (remR - rawR) * (0.2 + t * 0.7);
          const [bx, , bz] = pentagonVertex(ei, stoneR);
          orbs.push({
            pos: [bx, yOff, bz],
            stone,
            monthIndex: mi,
            element: el,
          });
        });
      });
      return orbs;
    }) : [];

    // Life ribbon: decade centroids projected into 3D pentagon space
    const lifeRibbon = (lifeMode && lifeData?.decadeCentroids) ? lifeData.decadeCentroids.map(dc => {
      // Project centroid as a weighted average of pentagon vertices
      const pt = [0, 0, 0];
      ELEMENTS.forEach((el, ei) => {
        const [bx, , bz] = pentagonVertex(ei, ((dc.centroid[el] || 0) / maxVal) * R);
        pt[0] += bx / 5;
        pt[2] += bz / 5;
      });
      // Map age to Y axis (same as month spacing but for decades)
      pt[1] = (dc.age / 100 - 0.5) * totalHeight * 1.2;
      return { ...dc, pos: pt };
    }) : [];

    // Current age marker on ribbon
    const lifeMarkerAge = lifeMode ? Math.round(lifeAge) : null;

    return { shapes, axisRing, daYunPts, natalPts, totalHeight, layerShapes, LAYER_DEFS, remediedShapes, stoneOrbs, lifeRibbon, lifeMarkerAge };
  }, [monthData, maxVal, R, zoom, daYunShape, natalShape, remediedData, lifeMode, lifeData, lifeAge]);

  // ── Project everything with current rotation ──
  const rendered = useMemo(() => {
    const cx = 290, cy = 290;

    // Project a set of 3D points
    const proj = (pts3d) => {
      let rotated = rotateX(pts3d, rotX);
      rotated = rotateY(rotated, rotY);
      return rotated.map(([x, y, z]) => {
        const p = project(x, y, z);
        return { x: cx + p.px, y: cy + p.py, depth: p.depth, scale: p.scale };
      });
    };

    // Axis ring
    const axisProj = proj(scene.axisRing);

    // Element labels at axis tips — pushed out for readability
    const labelPts = ELEMENTS.map((el, ei) => {
      const [bx, , bz] = pentagonVertex(ei, R * 1.28);
      const rotated = rotateY(rotateX([[bx, 0, bz]], rotX), rotY)[0];
      const p = project(...rotated);
      return { x: cx + p.px, y: cy + p.py, el, depth: p.depth };
    });

    // Month shapes projected
    const monthShapes = scene.shapes.map(s => {
      const projected = proj(s.pts);
      const avgDepth = projected.reduce((sum, p) => sum + p.depth, 0) / projected.length;
      return { ...s, projected, avgDepth };
    });

    // Sort by depth for painter's algorithm
    monthShapes.sort((a, b) => b.avgDepth - a.avgDepth);

    // DaYun + Natal reference shapes
    const daYunProj = proj(scene.daYunPts);
    const natalProj = proj(scene.natalPts);

    // Center vertical axis
    const topPt = proj([[0, -scene.totalHeight / 2 - 20, 0]])[0];
    const botPt = proj([[0, scene.totalHeight / 2 + 20, 0]])[0];

    // 4D layer projections
    const layerMonths = scene.layerShapes.map(ls => {
      const projLayers = ls.perLayer.map(layer => {
        const projected = proj(layer.pts);
        return { ...layer, projected };
      });
      const avgDepth = projLayers[0].projected.reduce((s, p) => s + p.depth, 0) / 5;
      const mtfqProjected = proj(ls.mtfqPts);
      return { ...ls, projLayers, avgDepth, mtfqProjected };
    });
    layerMonths.sort((a, b) => b.avgDepth - a.avgDepth);

    // Remedied pentagon projections
    const remediedProj = scene.remediedShapes.map(rs => {
      if (!rs) return null;
      const projected = proj(rs.pts);
      const avgDepth = projected.reduce((sum, p) => sum + p.depth, 0) / projected.length;
      return { ...rs, projected, avgDepth };
    });

    // Stone orb projections
    const stoneOrbProj = scene.stoneOrbs.map(orb => {
      const rotated = rotateY(rotateX([orb.pos], rotX), rotY)[0];
      const p = project(...rotated);
      return { ...orb, x: cx + p.px, y: cy + p.py, depth: p.depth, scale: p.scale };
    });
    // Sort by depth for proper z-ordering
    stoneOrbProj.sort((a, b) => b.depth - a.depth);

    // Life ribbon projection
    const ribbonProj = scene.lifeRibbon.map(rp => {
      const rotated = rotateY(rotateX([rp.pos], rotX), rotY)[0];
      const p = project(...rotated);
      return { ...rp, x: cx + p.px, y: cy + p.py, depth: p.depth, scale: p.scale };
    });
    // Life marker: interpolate position along ribbon for current age
    let lifeMarkerProj = null;
    if (scene.lifeMarkerAge !== null && ribbonProj.length >= 2) {
      const age = lifeAge;
      // Find the segment containing this age
      let before = ribbonProj[0];
      let after = ribbonProj[ribbonProj.length - 1];
      if (age <= before.age) {
        // Before first decade — clamp to first node
        after = before;
      } else if (age >= after.age) {
        // Past last decade — clamp to last node
        before = after;
      } else {
        for (let i = 0; i < ribbonProj.length - 1; i++) {
          if (age >= ribbonProj[i].age && age < ribbonProj[i + 1].age) {
            before = ribbonProj[i]; after = ribbonProj[i + 1];
            break;
          }
        }
      }
      const span = after.age - before.age || 1;
      const t = before === after ? 0 : Math.max(0, Math.min(1, (age - before.age) / span));
      lifeMarkerProj = {
        x: before.x + (after.x - before.x) * t,
        y: before.y + (after.y - before.y) * t,
        age,
      };
    }

    return { axisProj, labelPts, monthShapes, daYunProj, natalProj, topPt, botPt, cx, cy, layerMonths, remediedProj, stoneOrbProj, ribbonProj, lifeMarkerProj };
  }, [scene, rotX, rotY, R]);

  const polyPoints = (pts) => pts.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/80 overflow-hidden">
      <div className="px-4 py-2.5 bg-white/5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-white">
              {viewMode === '4d' ? '4D Qi Layers — Natal + Da Yun + Year + Month' : '3D MTFQ — Monthly Functional Qi across 12 Months'}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              Drag to rotate &middot; Scroll to zoom &middot;
              <span style={{ color: isYin ? '#60a5fa' : '#f87171' }}> {dayMasterPolarity} polarity</span>
              {showStones && <span className="text-emerald-400"> &middot; Stones ON</span>}
              {showRemedied && <span className="text-violet-400"> &middot; Before/After ON</span>}
              {lifeMode && <span className="text-orange-400"> &middot; Life Age {Math.round(lifeAge)}</span>}
            </div>
          </div>
          <div className="flex gap-1.5 items-center">
            <button
              onClick={() => setIsSpinning(s => !s)}
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors ${isSpinning ? 'border-teal-500/50 text-teal-400 bg-teal-900/30' : 'border-white/20 text-gray-400 hover:text-white'}`}
            >
              {isSpinning ? 'spinning' : 'spin'}
            </button>
            <button
              onClick={() => { setHeartbeat(h => !h); if (!heartbeat) { setIsSpinning(false); setLocked(null); } else { setHeartbeatPaused(false); heartbeatPausedRef.current = false; } }}
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors ${heartbeat ? 'border-pink-500/50 text-pink-400 bg-pink-900/30' : 'border-white/20 text-gray-400 hover:text-white'}`}
            >
              {heartbeat ? (heartbeatPaused ? '♥ paused' : '♥ beating') : '♥'}
            </button>
            {['mtfq', '4d', 'bars'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors ${viewMode === mode ? 'border-teal-500/50 text-teal-300 bg-teal-900/30' : 'border-white/20 text-gray-400 hover:text-white hover:border-white/40'}`}
              >
                {mode === 'mtfq' ? 'MTFQ' : mode === '4d' ? '4D Layers' : 'Bars'}
              </button>
            ))}
            {canLife && (
              <>
                <span className="border-l border-white/10 h-4 mx-0.5" />
                <button
                  onClick={() => { setLifeMode(m => !m); if (lifeMode) { setLifeAnimating(false); } else { setIsSpinning(false); setHeartbeat(false); setLifeAge(0); } }}
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors ${lifeMode ? 'border-orange-500/50 text-orange-400 bg-orange-900/30' : 'border-white/20 text-gray-400 hover:text-white'}`}
                  title="Life Worm — scrub age 0→100 to see Qi morph through Da Yun decades"
                >Life</button>
              </>
            )}
            {hasBracelet && (
              <>
                <span className="border-l border-white/10 h-4 mx-0.5" />
                <button
                  onClick={() => { setShowStones(s => { if (s) setFloatingBracelet(null); return !s; }); }}
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors ${showStones ? 'border-emerald-500/50 text-emerald-400 bg-emerald-900/30' : 'border-white/20 text-gray-400 hover:text-white'}`}
                  title="Show bracelet stones as glowing orbs"
                >Stones</button>
                <button
                  onClick={() => setShowRemedied(s => !s)}
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors ${showRemedied ? 'border-violet-500/50 text-violet-400 bg-violet-900/30' : 'border-white/20 text-gray-400 hover:text-white'}`}
                  title="Before/After — show remedied Qi shape"
                >B/A</button>
              </>
            )}
            <span className="border-l border-white/10 h-4 mx-0.5" />
            <button
              onClick={() => setZoom(prev => Math.min(2.5, prev + 0.15))}
              className="text-[11px] font-mono w-5 h-5 flex items-center justify-center rounded border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors"
              title="Zoom in"
            >+</button>
            <button
              onClick={() => setZoom(prev => Math.max(0.4, prev - 0.15))}
              className="text-[11px] font-mono w-5 h-5 flex items-center justify-center rounded border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors"
              title="Zoom out"
            >−</button>
            <button
              onClick={() => { setRotX(-Math.PI / 2); setRotY(0); setZoom(1.0); setIsSpinning(false); }}
              className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-400 transition-colors"
              title="Reset to flat pentagon view (90° to eye)"
            >RESET</button>
          </div>
        </div>
      </div>

      {viewMode === 'bars' ? (
        <PerElementBars monthData={monthData} maxVal={maxVal} hovered={locked ?? hovered} setHovered={locked === null ? setHovered : () => {}} onClickMonth={(i) => setLocked(prev => prev === i ? null : i)} />
      ) : (
        <div className="px-6 py-2 flex justify-center">
          <svg
            ref={svgRef}
            viewBox="0 0 580 580"
            className="select-none"
            style={{ width: '100%', maxWidth: 640, height: 540, cursor: heartbeat ? (heartbeatPaused ? 'play' : 'default') : (dragRef.current ? 'grabbing' : 'grab') }}
            onMouseDown={heartbeat ? undefined : handleMouseDown}
            onWheel={handleWheel}
            onClick={() => {
              if (heartbeat) {
                heartbeatPausedRef.current = !heartbeatPausedRef.current;
                setHeartbeatPaused(p => !p);
              } else if (locked !== null) {
                setLocked(null); setHovered(null); setFloatingBracelet(null);
              }
            }}
          >
            {/* Background glow */}
            <defs>
              <radialGradient id="bgGlow">
                <stop offset="0%" stopColor="rgba(59,130,246,0.10)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <circle cx={290} cy={290} r={260} fill="url(#bgGlow)" />

            {/* Vertical axis (time) */}
            <line
              x1={rendered.topPt.x} y1={rendered.topPt.y}
              x2={rendered.botPt.x} y2={rendered.botPt.y}
              stroke="rgba(255,255,255,0.12)" strokeWidth={1}
            />

            {/* Reference axis pentagon */}
            <polygon
              points={polyPoints(rendered.axisProj)}
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth={1}
            />
            {/* Axis lines from center to vertices — colored by element */}
            {rendered.axisProj.map((p, i) => (
              <line key={`ax-${i}`} x1={290} y1={290} x2={p.x} y2={p.y} stroke={ELEM_COLORS[ELEMENTS[i]]} strokeWidth={0.6} opacity={0.2} />
            ))}

            {/* Month shapes — MTFQ mode or 4D layer mode */}
            {viewMode === 'mtfq' ? (
              /* ── MTFQ: single pentagon per month ── */
              rendered.monthShapes.map((s, si) => {
                const { projected, month, index } = s;
                const isHov = (locked ?? hovered) === index;
                const isHeartbeatActive = heartbeat && index === heartbeatMonth;
                const sColor = SEASON_COLORS[month.season] || '#888';
                // Heartbeat: active month pulses bright, others dim heavily
                const opacity = heartbeat
                  ? (isHeartbeatActive ? 0.7 + heartbeatPulse * 0.3 : 0.12)
                  : (isHov ? 1.0 : 0.55 + (1 - Math.abs(s.avgDepth) / 300) * 0.35);
                const strokeW = heartbeat
                  ? (isHeartbeatActive ? 1.5 + heartbeatPulse * 2 : 0.8)
                  : (isHov ? 2.5 : 1.5);
                // Pulse scale: expand the active month's pentagon slightly from center
                const pulseScale = isHeartbeatActive ? 1 + heartbeatPulse * 0.08 : 1;
                const cx = 290, cy = 290;
                const pulsedProjected = pulseScale !== 1
                  ? projected.map(p => ({
                      ...p,
                      x: cx + (p.x - cx) * pulseScale,
                      y: cy + (p.y - cy) * pulseScale,
                    }))
                  : projected;
                return (
                  <g key={si}
                    onMouseEnter={() => { if (locked === null && !heartbeat) setHovered(index); }}
                    onMouseLeave={() => { if (locked === null && !heartbeat) setHovered(null); }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (heartbeat) return;
                      const newLocked = locked === index ? null : index;
                      setLocked(newLocked);
                      if (showStones && newLocked !== null && hasBracelet) {
                        const rect = svgRef.current?.getBoundingClientRect();
                        setFloatingBracelet({ monthIndex: newLocked, pos: { x: (rect?.right || 400) - 340, y: rect?.top || 100 } });
                      } else if (newLocked === null) {
                        setFloatingBracelet(null);
                      }
                    }}
                    style={{ cursor: heartbeat ? 'default' : 'pointer' }}
                  >
                    {/* Glow behind active heartbeat month */}
                    {isHeartbeatActive && heartbeatPulse > 0.1 && (
                      <polygon
                        points={polyPoints(pulsedProjected)}
                        fill={sColor}
                        stroke="none"
                        opacity={heartbeatPulse * 0.15}
                      />
                    )}
                    <polygon
                      points={polyPoints(pulsedProjected)}
                      fill="none"
                      stroke={sColor}
                      strokeWidth={strokeW}
                      opacity={opacity}
                    />
                    {month.collapse && (
                      <polygon points={polyPoints(pulsedProjected)}
                        fill="none" stroke="rgba(239,68,68,0.5)"
                        strokeWidth={2} opacity={0.6}
                      />
                    )}
                    {pulsedProjected.map((p, pi) => (
                      <circle key={pi} cx={p.x} cy={p.y} r={isHeartbeatActive ? 2.5 + heartbeatPulse * 2 : (isHov && !heartbeat ? 3.5 : 2)}
                        fill={ELEM_COLORS[ELEMENTS[pi]]}
                        opacity={heartbeat ? (isHeartbeatActive ? 0.7 + heartbeatPulse * 0.3 : 0.15) : (isHov ? 1 : Math.max(opacity, 0.6))}
                      />
                    ))}
                    {(isHeartbeatActive || (isHov && !heartbeat)) && (
                      <text x={pulsedProjected[0].x} y={pulsedProjected[0].y - 12}
                        fill="#fff" fontSize={10} textAnchor="middle" fontFamily="monospace"
                        opacity={isHeartbeatActive ? 0.6 + heartbeatPulse * 0.4 : 1}
                      >{month.label}</text>
                    )}
                  </g>
                );
              })
            ) : (
              /* ── 4D: four nested layer pentagons per month ── */
              rendered.layerMonths.map((lm, lmi) => {
                const isHov = (locked ?? hovered) === lm.index;
                const baseOp = isHov ? 0.95 : 0.35 + (1 - Math.abs(lm.avgDepth) / 300) * 0.3;
                return (
                  <g key={lmi}
                    onMouseEnter={() => { if (locked === null) setHovered(lm.index); }}
                    onMouseLeave={() => { if (locked === null) setHovered(null); }}
                    onClick={(e) => { e.stopPropagation(); setLocked(prev => prev === lm.index ? null : lm.index); }}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Render layers outer→inner: natal (biggest) first, month (smallest) last */}
                    {[...lm.projLayers].reverse().map((layer, li) => {
                      if (!layerVis[layer.key]) return null;
                      return (
                        <polygon
                          key={li}
                          points={polyPoints(layer.projected)}
                          fill="none"
                          stroke={layer.color}
                          strokeWidth={isHov ? 1.8 : 1}
                          opacity={baseOp + li * 0.05}
                        />
                      );
                    })}
                    {/* MTFQ resultant pentagon — the weighted sum */}
                    {layerVis.mtfq && (
                      <polygon
                        points={polyPoints(lm.mtfqProjected)}
                        fill="none"
                        stroke="#4ade80"
                        strokeWidth={isHov ? 2.5 : 1.5}
                        opacity={isHov ? 0.9 : baseOp * 0.8}
                      />
                    )}
                    {/* Vertex dots on MTFQ resultant */}
                    {layerVis.mtfq && lm.mtfqProjected.map((p, pi) => (
                      <circle key={pi} cx={p.x} cy={p.y} r={isHov ? 3 : 1.5}
                        fill={ELEM_COLORS[ELEMENTS[pi]]}
                        opacity={isHov ? 1 : 0.6}
                      />
                    ))}
                    {isHov && (
                      <text x={lm.projLayers[0].projected[0].x} y={lm.projLayers[0].projected[0].y - 12}
                        fill="#fff" fontSize={10} textAnchor="middle" fontFamily="monospace"
                      >{lm.month.label}</text>
                    )}
                  </g>
                );
              })
            )}

            {/* Element labels — clickable */}
            {rendered.labelPts.map((lp, i) => (
              <text key={i} x={lp.x} y={lp.y}
                fill={ELEM_COLORS[lp.el]}
                fontSize={selectedElement === lp.el ? 15 : 13}
                textAnchor="middle" dominantBaseline="middle"
                fontFamily="monospace" fontWeight="bold"
                opacity={selectedElement && selectedElement !== lp.el ? 0.4 : 0.85 + Math.max(0, -lp.depth / 500) * 0.15}
                style={{ cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); setSelectedElement(prev => prev === lp.el ? null : lp.el); }}
              >
                {lp.el}{selectedElement === lp.el ? ' ▼' : ''}
              </text>
            ))}

            {/* ── Remedied Qi shapes (Before/After overlay) ── */}
            {showRemedied && viewMode === 'mtfq' && rendered.remediedProj.map((rs, ri) => {
              if (!rs) return null;
              const isHov = (locked ?? hovered) === rs.index;
              const opacity = isHov ? 0.85 : 0.35;
              return (
                <g key={`rem-${ri}`}>
                  {/* Remedied pentagon — brighter, dashed */}
                  <polygon
                    points={polyPoints(rs.projected)}
                    fill="none"
                    stroke="#a78bfa"
                    strokeWidth={isHov ? 2.5 : 1.5}
                    strokeDasharray="6 3"
                    opacity={opacity}
                  />
                  {/* Fill the gap between raw and remedied with a subtle gradient */}
                  {isHov && (
                    <polygon
                      points={polyPoints(rs.projected)}
                      fill="rgba(167,139,250,0.08)"
                      stroke="none"
                    />
                  )}
                  {/* Remedied vertex dots */}
                  {rs.projected.map((p, pi) => (
                    <circle key={pi} cx={p.x} cy={p.y} r={isHov ? 3 : 1.5}
                      fill="#a78bfa" opacity={isHov ? 0.9 : 0.5}
                    />
                  ))}
                </g>
              );
            })}

            {/* ── Stone beads — individual dots strung along element axes ── */}
            {showStones && rendered.stoneOrbProj.map((orb, oi) => {
              const isMonthHov = (locked ?? hovered) === orb.monthIndex;
              const r = Math.max(2, 3 * orb.scale);
              const col = orb.stone.color || ELEM_COLORS[orb.element] || '#fff';
              return (
                <circle key={`orb-${oi}`}
                  cx={orb.x} cy={orb.y} r={r}
                  fill={col}
                  stroke={isMonthHov ? 'rgba(255,255,255,0.8)' : 'none'}
                  strokeWidth={isMonthHov ? 0.6 : 0}
                  opacity={isMonthHov ? 1.0 : 0.4}
                />
              );
            })}

            {/* ── Life ribbon — decade trajectory ── */}
            {lifeMode && rendered.ribbonProj.length >= 2 && (
              <g>
                {/* Ribbon path connecting decade centroids */}
                <polyline
                  points={rendered.ribbonProj.map(rp => `${rp.x},${rp.y}`).join(' ')}
                  fill="none"
                  stroke="rgba(251,146,60,0.5)"
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
                {/* Decade nodes */}
                {rendered.ribbonProj.map((rp, ri) => {
                  const isCurrent = lifeData?.activePillar && rp.age === lifeData.activePillar.ageStart;
                  return (
                    <g key={`rd-${ri}`}>
                      <circle cx={rp.x} cy={rp.y} r={isCurrent ? 5 : 3}
                        fill={isCurrent ? '#fb923c' : 'rgba(251,146,60,0.6)'}
                        stroke={isCurrent ? '#fff' : 'none'}
                        strokeWidth={isCurrent ? 1 : 0}
                      />
                      <text x={rp.x + 7} y={rp.y + 3}
                        fill={isCurrent ? '#fff' : 'rgba(255,255,255,0.5)'}
                        fontSize={isCurrent ? 9 : 7} fontFamily="monospace"
                      >{rp.age}</text>
                    </g>
                  );
                })}
                {/* Age marker — animated dot on ribbon */}
                {rendered.lifeMarkerProj && (
                  <g>
                    <circle cx={rendered.lifeMarkerProj.x} cy={rendered.lifeMarkerProj.y} r={7}
                      fill="none" stroke="#fb923c" strokeWidth={2} opacity={0.8}
                    />
                    <circle cx={rendered.lifeMarkerProj.x} cy={rendered.lifeMarkerProj.y} r={3}
                      fill="#fff"
                    />
                  </g>
                )}
              </g>
            )}

            {/* Paused indicator */}
            {heartbeat && heartbeatPaused && (
              <g opacity={0.6}>
                <rect x={270} y={268} width={10} height={28} rx={2} fill="#fff" />
                <rect x={286} y={268} width={10} height={28} rx={2} fill="#fff" />
                <text x={290} y={310} fill="#fff" fontSize={9} textAnchor="middle" fontFamily="monospace" opacity={0.5}>click to resume</text>
              </g>
            )}
          </svg>
        </div>
      )}

      {/* Heartbeat timeline */}
      {heartbeat && monthData.length > 0 && (
        <div className="px-4 pb-2">
          <div className="rounded border border-pink-500/20 bg-black/30 p-2.5">
            <div className="flex items-center gap-1.5">
              {monthData.map((m, i) => {
                const isActive = i === heartbeatMonth;
                const sColor = SEASON_COLORS[m.season] || '#888';
                return (
                  <button
                    key={i}
                    onClick={() => { setHeartbeatMonth(i); setHovered(i); }}
                    className="flex-1 flex flex-col items-center gap-0.5 group"
                  >
                    <div
                      className="w-full rounded-sm transition-all"
                      style={{
                        height: isActive ? 16 + heartbeatPulse * 8 : 6,
                        background: sColor,
                        opacity: isActive ? 0.7 + heartbeatPulse * 0.3 : 0.25,
                      }}
                    />
                    <span
                      className="text-[8px] font-mono transition-colors"
                      style={{ color: isActive ? '#fff' : '#6b7280' }}
                    >
                      {m.label.slice(0, 3)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Life Worm slider ── */}
      {lifeMode && lifeData && (
        <div className="px-4 pb-2">
          <div className="rounded border border-orange-500/20 bg-black/30 p-2.5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLifeAnimating(a => !a)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${lifeAnimating ? 'border-orange-500/50 text-orange-400 bg-orange-900/30' : 'border-white/20 text-gray-400 hover:text-white'}`}
              >{lifeAnimating ? 'pause' : 'play'}</button>
              <input
                type="range"
                min={0}
                max={100}
                step={0.5}
                value={lifeAge}
                onChange={(e) => { setLifeAge(Number(e.target.value)); setLifeAnimating(false); }}
                className="flex-1 h-1 accent-orange-500 cursor-pointer"
              />
              <span className="text-[11px] font-mono text-orange-300 w-16 text-right">Age {Math.round(lifeAge)}</span>
            </div>
            {/* Decade markers */}
            <div className="flex items-center mt-1.5 gap-px">
              {lifeData.decadeCentroids.map((dc, i) => {
                const isCurrent = lifeData.activePillar && dc.age === lifeData.activePillar.ageStart;
                const ELEM_COL = { Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#94a3b8', Water: '#3b82f6' };
                return (
                  <button
                    key={i}
                    onClick={() => { setLifeAge(dc.age + 5); setLifeAnimating(false); }}
                    className="flex-1 flex flex-col items-center gap-0.5"
                  >
                    <div
                      className="w-full rounded-sm"
                      style={{
                        height: isCurrent ? 10 : 4,
                        background: ELEM_COL[dc.element] || '#888',
                        opacity: isCurrent ? 1 : 0.4,
                      }}
                    />
                    <span className="text-[7px] font-mono" style={{ color: isCurrent ? '#fff' : '#6b7280' }}>
                      {dc.age}{dc.stem ? ` ${dc.stem}` : ''}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* Active decade info */}
            {lifeData.activePillar && (
              <div className="mt-1.5 text-[9px] font-mono text-gray-400 flex items-center gap-2">
                <span className="text-orange-400">Da Yun:</span>
                <span className="text-white">{lifeData.activePillar.stem} {lifeData.activePillar.branch}</span>
                <span>({lifeData.activePillar.branchAnimal})</span>
                <span style={{ color: ELEM_COLORS[lifeData.activePillar.element] }}>{lifeData.activePillar.element}</span>
                <span>Ages {lifeData.activePillar.ageStart}–{lifeData.activePillar.ageEnd}</span>
                <span className="text-white">Year {birthYear + Math.round(lifeAge)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Element drill-down — vertical bar chart for selected element */}
      {selectedElement && monthData.length > 0 && (() => {
        const el = selectedElement;
        const color = ELEM_COLORS[el];
        const totalPerMonth = monthData.map(m => ELEMENTS.reduce((s, e) => s + (m.vals[e] || 0), 0));
        const maxVal2 = Math.max(...monthData.map(m => m.vals[el] || 0), 0.01);
        return (
          <div className="px-4 pb-3">
            <div className="rounded border border-white/10 bg-black/30 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] font-mono font-semibold" style={{ color }}>{el} — Monthly Breakdown</div>
                <button onClick={() => setSelectedElement(null)} className="text-[9px] text-gray-400 hover:text-white px-1">✕</button>
              </div>
              <div className="space-y-1">
                {monthData.map((m, i) => {
                  const val = m.vals[el] || 0;
                  const pct = totalPerMonth[i] > 0 ? (val / totalPerMonth[i]) * 100 : 0;
                  const barW = (val / maxVal2) * 100;
                  const sColor = SEASON_COLORS[m.season] || '#888';
                  const isActive = (locked ?? hovered) === i;
                  return (
                    <div key={i}
                      className={`flex items-center gap-2 py-0.5 rounded px-1 ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
                      onMouseEnter={() => { if (locked === null) setHovered(i); }}
                      onMouseLeave={() => { if (locked === null) setHovered(null); }}
                      onClick={(e) => { e.stopPropagation(); setLocked(prev => prev === i ? null : i); }}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className="w-10 text-[10px] font-mono text-gray-300 text-right">{m.label.slice(0, 3)}</span>
                      <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ background: sColor }} />
                      <div className="flex-1 h-4 bg-white/5 rounded overflow-hidden relative">
                        <div className="h-full rounded" style={{ width: `${barW}%`, background: color, opacity: isActive ? 1 : 0.7 }} />
                      </div>
                      <span className="w-12 text-[10px] font-mono text-right" style={{ color }}>{val.toFixed(2)}</span>
                      <span className="w-10 text-[10px] font-mono text-right text-gray-400">{pct.toFixed(0)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Hover tooltip */}
      {(() => {
        const activeIdx = locked ?? hovered;
        if (activeIdx === null || !monthData[activeIdx]) return null;
        const m = monthData[activeIdx];
        return (
          <div className="px-4 pb-3">
            <div className={`px-3 py-2 rounded border bg-black/40 text-[10px] font-mono text-gray-300 flex gap-4 flex-wrap ${locked !== null ? 'border-teal-500/40' : 'border-white/10'}`}>
              <span className="text-white font-semibold">{m.label}</span>
              {locked !== null && <span className="text-teal-400 text-[8px]">LOCKED</span>}
              <span style={{ color: SEASON_COLORS[m.season] }}>{m.season}</span>
              {ELEMENTS.map(el => {
                const pct = m.total > 0 ? (m.vals[el] / m.total * 100) : 0;
                return (
                  <span key={el} className="text-[12px]" style={{ color: ELEM_COLORS[el] }}>
                    {el} {m.vals[el].toFixed(2)} {pct.toFixed(0)}%
                  </span>
                );
              })}
              <span><span className="text-amber-300">N</span>{m.natal.toFixed(1)} <span className="text-pink-300">D</span>{m.dayun.toFixed(1)} <span className="text-cyan-300">W</span>{m.weather.toFixed(1)}</span>
              {m.collapse && <span className="text-red-400">COLLAPSE</span>}
            </div>
          </div>
        );
      })()}

      {/* Legend */}
      <div className="px-4 pb-3 flex items-center gap-3 text-[9px] text-gray-300 font-mono flex-wrap">
        {viewMode === '4d' ? (
          <>
            <button
              className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-400 transition-colors mr-1"
              onClick={() => setLayerVis({ natal: true, dayun: true, year: true, month: true, mtfq: true })}
              title="Reset all layers visible"
            >RESET</button>
            {[
              { key: 'natal', color: '#fbbf24', label: 'Natal ×1.0' },
              { key: 'dayun', color: '#ec4899', label: 'Da Yun ×0.9' },
              { key: 'year',  color: '#a78bfa', label: 'Year ×0.5' },
              { key: 'month', color: '#22d3ee', label: 'Month ×0.3' },
              { key: 'mtfq',  color: '#4ade80', label: 'MTFQ (result)' },
            ].map(({ key, color, label }) => {
              const on = layerVis[key];
              return (
                <button
                  key={key}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded border transition-colors ${on ? 'border-white/20 bg-white/5' : 'border-white/5 bg-transparent'}`}
                  style={{ opacity: on ? 1 : 0.35 }}
                  onClick={() => setLayerVis(prev => ({ ...prev, [key]: !prev[key] }))}
                  title={`Toggle ${label}`}
                >
                  <span className="inline-block w-3 h-1 rounded-sm" style={{ background: color }} />
                  {on ? '' : <span className="line-through">{label}</span>}
                  {on ? label : ''}
                </button>
              );
            })}
          </>
        ) : (
          <>
            {Object.entries(SEASON_COLORS).map(([season, col]) => (
              <span key={season} className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: col }} /> {season}
              </span>
            ))}
            {showRemedied && (
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-0 border-t border-dashed" style={{ borderColor: '#a78bfa' }} /> Remedied
              </span>
            )}
            {showStones && (
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg, #22c55e, #3b82f6)' }} /> Stones
              </span>
            )}
          </>
        )}
      </div>

      {/* ── Floating draggable bracelet window ── */}
      {floatingBracelet && hasBracelet && (() => {
        const bs = braceletStones.find(b => b.monthIndex === floatingBracelet.monthIndex);
        const eng = bs?.engineered;
        if (!eng?.beads?.length) return null;
        return (
          <div
            style={{
              position: 'fixed',
              left: floatingBracelet.pos.x,
              top: floatingBracelet.pos.y,
              zIndex: 9999,
              width: 320,
              touchAction: 'none',
            }}
            className="rounded-xl border border-white/20 bg-slate-900/95 shadow-2xl backdrop-blur-sm"
          >
            {/* Drag handle */}
            <div
              className="flex items-center justify-between px-3 py-2 border-b border-white/10 cursor-move select-none"
              onMouseDown={(e) => {
                e.preventDefault();
                const startX = e.clientX - floatingBracelet.pos.x;
                const startY = e.clientY - floatingBracelet.pos.y;
                const onMove = (ev) => {
                  setFloatingBracelet(prev => prev ? { ...prev, pos: { x: ev.clientX - startX, y: ev.clientY - startY } } : null);
                };
                const onUp = () => {
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                };
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
              }}
            >
              <span className="text-[11px] font-mono text-white font-semibold">
                {bs.monthName} Bracelet — {eng.totalBeads} beads
              </span>
              <button
                onClick={() => { setFloatingBracelet(null); setLocked(null); }}
                className="text-gray-400 hover:text-white text-sm px-1"
              >✕</button>
            </div>
            <div className="p-2 flex justify-center">
              <EngineeredBraceletVisualizer
                beads={eng.beads}
                wrist={eng.wrist}
                wristReason={eng.wristReason}
                collapse={eng.collapse}
                qiTotals={eng.qiTotals}
                size={280}
                isDark
              />
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ── Per-element stacked bars (unchanged from before) ──
function PerElementBars({ monthData, maxVal, hovered, setHovered, onClickMonth }) {
  return (
    <div className="p-4 space-y-3">
      <div className="text-[9px] text-gray-400 font-mono mb-2">
        Per-element MTFQ decomposition — stacked bars: Natal (gold) + Da Yun (pink) + Year (purple) + Month (cyan)
      </div>
      {ELEMENTS.map(el => {
        const maxEl = Math.max(...monthData.map(m => m.vals[el]), 0.01);
        return (
          <div key={el} className="flex items-center gap-2">
            <div className="w-12 text-[10px] font-mono text-right" style={{ color: ELEM_COLORS[el] }}>{el}</div>
            <div className="flex-1 flex items-end gap-[3px]" style={{ height: 52 }}>
              {monthData.map((m, i) => {
                // We need per-layer breakdown — approximate from the month data
                const natal  = (m.vals?.[el] || 0) * 0.37; // ~37% of total from natal
                const dayun  = (m.vals?.[el] || 0) * 0.33;
                const year   = (m.vals?.[el] || 0) * 0.19;
                const month  = (m.vals?.[el] || 0) * 0.11;
                const total  = m.vals[el];
                const h = (total / maxEl) * 48;
                const nH = (natal / maxEl) * 48;
                const dH = (dayun / maxEl) * 48;
                const yH = (year / maxEl) * 48;
                const mH = (month / maxEl) * 48;
                const isHov = hovered === i;
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col-reverse rounded-t-sm overflow-hidden"
                    style={{ height: Math.max(h, 1), opacity: isHov ? 1 : 0.7 }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => onClickMonth?.(i)}
                    title={`${m.label}: ${el} = ${total.toFixed(2)}`}
                  >
                    <div style={{ height: nH, background: '#fbbf24' }} />
                    <div style={{ height: dH, background: '#ec4899' }} />
                    <div style={{ height: yH, background: '#a78bfa' }} />
                    <div style={{ height: mH, background: '#22d3ee' }} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="flex items-center gap-2">
        <div className="w-12" />
        <div className="flex-1 flex gap-[3px]">
          {monthData.map((m, i) => (
            <div key={i} className="flex-1 text-center text-[8px] font-mono text-gray-300">{m.label.slice(0, 3)}</div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 mt-1 text-[9px] text-gray-300 font-mono">
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2" style={{ background: '#fbbf24' }} /> Natal ×1.0</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2" style={{ background: '#ec4899' }} /> Da Yun ×0.9</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2" style={{ background: '#a78bfa' }} /> Year ×0.5</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2" style={{ background: '#22d3ee' }} /> Month ×0.3</span>
      </div>
    </div>
  );
}
