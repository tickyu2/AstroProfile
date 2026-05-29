/**
 * ChartSortedView.jsx
 *
 * Floating draggable window — all chart placements sorted by House or Significance.
 * Two-column layout: Houses 1-6 left, Houses 7-12 right.
 */

import { useState, useRef, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import ZoneChip from './ZoneChip'


// ─── Significance weights ────────────────────────────────────────────────────
const SIGNIFICANCE = {
  sun: 10, moon: 9, ascendant: 8, midheaven: 7,
  mercury: 6, venus: 6, mars: 6,
  jupiter: 5, saturn: 5,
  uranus: 4, neptune: 4, pluto: 4,
  north_node: 3, south_node: 3,
  chiron: 3, ceres: 2, pallas: 2, juno: 2, vesta: 2,
}

// Traditional rulers for signs where modern differs (traditional shown first, modern in brackets)
const TRADITIONAL_RULER = {
  Scorpio: 'mars',      // modern = pluto
  Aquarius: 'saturn',   // modern = uranus
  Pisces: 'jupiter',    // modern = neptune
}

const TYPE_TAG = {
  angle:    { label: 'Angle',    cls: 'text-purple-300 border-purple-500/40 bg-purple-500/15' },
  planet:   { label: 'Planet',   cls: 'text-amber-300 border-amber-500/40 bg-amber-500/15' },
  asteroid: { label: 'Asteroid', cls: 'text-indigo-300 border-indigo-500/40 bg-indigo-500/15' },
  part:     { label: 'Part',     cls: 'text-orange-300 border-orange-500/40 bg-orange-500/15' },
}


export default function ChartSortedView({
  open,
  onClose,
  planets,
  angles,
  arabicParts,
  houseForLon,
  getLon,
  planetSym,
  planetName,
  asteroidKeys,
  fmtDeg,
  getZone,       // getZoneForPlacement(sign, degree) => { id, ... }
  houseArcs,     // [{num, sign, ...}] — cusp sign per house
  signRuler,     // {Aries:'mars', ...} — sign → ruling planet key
}) {
  const [sortMode, setSortMode] = useState('house')
  const [pos, setPos] = useState({ x: 80, y: 60 })
  const dragging = useRef(false)
  const dragOff = useRef({ x: 0, y: 0 })

  const onDragStart = useCallback((e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return
    dragging.current = true
    dragOff.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    const onMove = (ev) => {
      if (!dragging.current) return
      setPos({ x: ev.clientX - dragOff.current.x, y: ev.clientY - dragOff.current.y })
    }
    const onUp = () => { dragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [pos])

  // ── Build unified placement list ─────────────────────────────────────────
  const allPlacements = useMemo(() => {
    const items = []

    // Angles
    const angleMap = { ASC: { label: 'Ascendant', house: 1 }, MC: { label: 'Midheaven', house: 10 }, DSC: { label: 'Descendant', house: 7 }, IC: { label: 'Nadir', house: 4 } }
    for (const a of (angles || [])) {
      const info = angleMap[a.tag]
      if (!info) continue
      const zone = getZone?.(a.sign, a.degree)
      items.push({
        key: `angle_${a.tag}`,
        shortName: a.tag,
        symbol: '\u2B21',
        type: 'angle',
        sign: a.sign,
        degree: a.degree,
        house: info.house,
        zone: zone || null,
        retrograde: false,
        significance: SIGNIFICANCE[a.tag.toLowerCase()] || 8,
        color: a.tag === 'ASC' ? '#fbbf24' : a.tag === 'MC' ? '#c084fc' : '#94a3b8',
      })
    }

    // Planets + nodes
    for (const key of Object.keys(planets || {})) {
      const p = planets[key]
      if (!p?.sign) continue
      const isAsteroid = asteroidKeys.has(key)
      const deg = p.degree ?? p.degreeInSign ?? 0
      const pLon = getLon(p)
      const house = p.house || houseForLon(pLon)
      const isNode = key === 'north_node' || key === 'south_node'
      const zone = getZone?.(p.sign, deg)
      items.push({
        key,
        shortName: planetName[key] || key,
        symbol: planetSym[key] || '?',
        type: isAsteroid ? 'asteroid' : 'planet',
        sign: p.sign,
        degree: deg,
        house: house || 0,
        zone: zone || null,
        retrograde: p.retrograde && !isNode,
        significance: SIGNIFICANCE[key] || 1,
        color: isAsteroid ? '#818cf8' : '#fbbf24',
      })
    }

    // Arabic Parts
    for (const part of (arabicParts || [])) {
      const zone = getZone?.(part.sign, part.degree)
      items.push({
        key: `part_${part.key}`,
        shortName: part.name?.replace('Part of ', '') || part.key,
        symbol: part.symbol || '\u2295',
        type: 'part',
        sign: part.sign,
        degree: part.degree,
        house: part.house || 0,
        zone: zone || null,
        retrograde: false,
        significance: 1,
        color: part.color || '#f59e0b',
      })
    }

    return items
  }, [planets, angles, arabicParts, houseForLon, getLon, planetSym, planetName, asteroidKeys, getZone])

  // ── Sorted placements ───────────────────────────────────────────────────
  const sorted = useMemo(() => {
    const copy = [...allPlacements]
    if (sortMode === 'house') {
      copy.sort((a, b) => (a.house || 99) - (b.house || 99) || b.significance - a.significance)
    } else {
      copy.sort((a, b) => b.significance - a.significance || (a.house || 99) - (b.house || 99))
    }
    return copy
  }, [allPlacements, sortMode])

  // ── House rulers lookup (traditional first, modern in brackets if different)
  const houseRulers = useMemo(() => {
    if (!houseArcs || !signRuler) return {}
    const map = {}
    for (const arc of houseArcs) {
      const modernKey = signRuler[arc.sign]
      if (!modernKey) continue
      const tradKey = TRADITIONAL_RULER[arc.sign]
      // If sign has a traditional ruler, show that first with modern in brackets
      const primaryKey = tradKey || modernKey
      const entry = {
        key: primaryKey,
        name: planetName[primaryKey] || primaryKey,
        symbol: planetSym[primaryKey] || '?',
        sign: arc.sign,
      }
      if (tradKey && tradKey !== modernKey) {
        entry.modernRuler = {
          key: modernKey,
          name: planetName[modernKey] || modernKey,
          symbol: planetSym[modernKey] || '?',
        }
      }
      map[arc.num] = entry
    }
    return map
  }, [houseArcs, signRuler, planetName, planetSym])

  // ── Group by house ──────────────────────────────────────────────────────
  const groupedByHouse = useMemo(() => {
    const groups = {}
    for (let h = 1; h <= 12; h++) groups[h] = []
    for (const item of sorted) {
      const h = item.house || 0
      if (h >= 1 && h <= 12) groups[h].push(item)
      else {
        if (!groups[0]) groups[0] = []
        groups[0].push(item)
      }
    }
    return groups
  }, [sorted])


  if (!open) return null

  return createPortal(
    <div
      className="fixed z-50 flex flex-col rounded-2xl border border-purple-500/30 shadow-2xl"
      style={{
        left: pos.x,
        top: pos.y,
        width: 820,
        maxHeight: 'calc(100vh - 60px)',
        overflow: 'hidden',
        backgroundColor: '#0c1222',
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 cursor-move select-none"
        style={{ backgroundColor: '#111827' }}
        onMouseDown={onDragStart}
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/80 uppercase tracking-widest font-medium">
            Chart Placements
          </span>
          <span className="text-[9px] text-white/50">{allPlacements.length} items</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortMode('house')}
            className={`px-3 py-1 rounded-full border text-[10px] transition-colors cursor-pointer ${
              sortMode === 'house'
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                : 'border-white/10 text-white/40 hover:text-white/70'
            }`}
          >
            By House
          </button>
          <button
            onClick={() => setSortMode('significance')}
            className={`px-3 py-1 rounded-full border text-[10px] transition-colors cursor-pointer ${
              sortMode === 'significance'
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'border-white/10 text-white/40 hover:text-white/70'
            }`}
          >
            By Significance
          </button>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white text-sm px-1 ml-2 cursor-pointer"
          >
            &times;
          </button>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="overflow-y-auto p-3" style={{ maxHeight: 'calc(100vh - 140px)' }}>

        {/* ── House view: two columns ─────────────────────────────────── */}
        {sortMode === 'house' && (
          <div className="grid grid-cols-2 gap-3">
            {/* Left column: Houses 1-6 */}
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4, 5, 6].map(h => (
                <HouseGroup key={h} houseNum={h} items={groupedByHouse[h] || []} fmtDeg={fmtDeg} ruler={houseRulers[h]} />
              ))}
            </div>
            {/* Right column: Houses 7-12 */}
            <div className="flex flex-col gap-2">
              {[7, 8, 9, 10, 11, 12].map(h => (
                <HouseGroup key={h} houseNum={h} items={groupedByHouse[h] || []} fmtDeg={fmtDeg} ruler={houseRulers[h]} />
              ))}
            </div>
          </div>
        )}

        {/* ── Significance view: single ranked list ───────────────────── */}
        {sortMode === 'significance' && (
          <div className="grid grid-cols-2 gap-x-3">
            {sorted.map((item, i) => (
              <PlacementRow key={item.key} item={item} fmtDeg={fmtDeg} rank={i + 1} showHouse />
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}


// ─── House Group ─────────────────────────────────────────────────────────────
function HouseGroup({ houseNum, items, fmtDeg, ruler }) {
  return (
    <div className="rounded-lg border border-white/5" style={{ backgroundColor: '#111827' }}>
      <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-white/5" style={{ backgroundColor: '#1a2332' }}>
        <span className="w-5 h-5 rounded flex items-center justify-center bg-purple-500/25 text-purple-200 text-[10px] font-bold">
          {houseNum}
        </span>
        <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">
          House {houseNum}
        </span>
        {ruler && (
          <span className="text-[9px] text-amber-400 ml-1">
            <span className="text-amber-300" style={{ fontSize: 11 }}>{ruler.symbol}</span>
            {' '}{ruler.name}
            {ruler.modernRuler && (
              <span className="text-white/70">
                {' ('}
                <span className="text-amber-300/70" style={{ fontSize: 10 }}>{ruler.modernRuler.symbol}</span>
                {' '}{ruler.modernRuler.name}{')'}
              </span>
            )}
            <span className="text-white/70 ml-0.5">· {ruler.sign}</span>
          </span>
        )}
        <span className="text-[9px] text-white/40 ml-auto">{items.length}</span>
      </div>
      <div className="px-1.5 py-1">
        {items.length === 0 && (
          <div className="text-[9px] text-white/30 italic px-1 py-0.5">empty</div>
        )}
        {items.map(item => (
          <PlacementRow key={item.key} item={item} fmtDeg={fmtDeg} />
        ))}
      </div>
    </div>
  )
}


// ─── Placement Row ───────────────────────────────────────────────────────────
function PlacementRow({ item, fmtDeg, rank, showHouse }) {
  const tag = TYPE_TAG[item.type] || TYPE_TAG.planet
  const zone = item.zone // full zone object

  return (
    <div className="flex items-center text-[10px] py-0.5 px-1 rounded mb-0.5 hover:bg-white/5 transition-colors">
      {rank != null && (
        <span className="text-[9px] text-white/40 font-mono mr-1" style={{ width: 18 }}>
          {rank}.
        </span>
      )}
      <span style={{ fontSize: 13, color: item.color, width: 16 }}>
        {item.symbol}
      </span>
      <span className={`font-medium ${item.retrograde ? 'text-red-400' : 'text-white'}`} style={{ width: 68 }}>
        {item.shortName}
        {item.retrograde && <span className="text-red-400 text-[7px] font-bold ml-0.5">R</span>}
      </span>
      <span className="text-white/90 font-mono" style={{ width: 42 }}>{fmtDeg(item.degree)}</span>
      <span className="text-white/70 ml-0.5" style={{ width: 52 }}>{item.sign}</span>
      {zone && (
        <span className="text-[9px] ml-0.5" style={{ width: 42 }}>
          <ZoneChip zone={zone} sign={item.sign} />
        </span>
      )}
      {showHouse && item.house > 0 && (
        <span className="text-purple-300 text-[9px] ml-0.5">H{item.house}</span>
      )}
      <span className={`ml-auto text-[8px] px-1 py-0 rounded border ${tag.cls}`}>
        {tag.label}
      </span>
    </div>
  )
}


