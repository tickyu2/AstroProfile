/**
 * ZoneChip.jsx
 *
 * Hoverable "Zone X" chip that shows a rich tooltip with zone data.
 * Used by both ChartSortedView and NatalWheelPage Chart Summary.
 */

import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'


// ─── Element color helpers ───────────────────────────────────────────────────
const ELEMENT_COLORS = {
  fire: 'text-red-400', earth: 'text-lime-400', air: 'text-sky-400', water: 'text-cyan-400',
}
const ELEMENT_BG = {
  fire: 'bg-red-500', earth: 'bg-lime-500', air: 'bg-sky-500', water: 'bg-cyan-500',
}


// ─── Zone Tooltip (portal to body, positioned near cursor) ──────────────────
export function ZoneTooltip({ zone, sign, mouseX, mouseY }) {
  if (!zone) return null

  const topQualities = zone.qualities
    ? Object.entries(zone.qualities)
        .sort((a, b) => b[1].level - a[1].level)
        .slice(0, 4)
    : []

  const elements = zone.elementalMix || {}

  // Position near cursor, clamped to viewport
  const w = 380
  const estimatedH = 420
  const left = mouseX != null ? Math.min(mouseX + 16, window.innerWidth - w - 12) : undefined
  const top = mouseY != null ? Math.max(Math.min(mouseY - 60, window.innerHeight - estimatedH - 12), 8) : undefined
  const useCentered = left == null

  return createPortal(
    <div
      className="fixed z-[100] pointer-events-none"
      style={{ top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="absolute pointer-events-none rounded-xl border border-amber-500/30 shadow-2xl"
        style={{
          width: w,
          backgroundColor: '#0f1729',
          ...(useCentered
            ? { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
            : { left, top }),
        }}
      >
        {/* Header */}
        <div className="px-4 py-2.5 border-b border-amber-500/20" style={{ backgroundColor: '#1a2338' }}>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-[13px]">
              {sign} Zone {zone.id}
            </span>
            <span className="text-[10px] text-white/40">
              {zone.degreeRange?.start}° – {zone.degreeRange?.end}°
            </span>
          </div>
          <div className="text-[14px] text-amber-300 font-medium mt-0.5">
            &ldquo;{zone.name}&rdquo;
          </div>
          <div className="text-[10px] text-purple-300 mt-0.5">
            {zone.archetype}
          </div>
        </div>

        <div className="px-4 py-3 space-y-2.5">
          {/* Description */}
          <div className="text-[11px] text-white/70 leading-relaxed">
            {zone.description}
          </div>

          {/* Decan + Date Range */}
          <div className="flex gap-3 text-[10px]">
            {zone.decan && (
              <span className="text-white/50">
                {zone.decan.name} ({zone.decan.modality || ''}) · <span className="text-purple-300">{zone.decan.primaryRuler}</span>
              </span>
            )}
            {zone.dateRange && (
              <span className="text-white/40 ml-auto">
                {zone.dateRange.start} – {zone.dateRange.end}
              </span>
            )}
          </div>

          {/* Elemental Mix */}
          {Object.keys(elements).length > 0 && (
            <div className="flex gap-2 items-center">
              {Object.entries(elements).map(([el, pct]) => (
                <div key={el} className="flex items-center gap-1">
                  <span className={`text-[9px] ${ELEMENT_COLORS[el] || 'text-white/50'}`}>
                    {el.charAt(0).toUpperCase() + el.slice(1)}
                  </span>
                  <div className="w-14 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${ELEMENT_BG[el] || 'bg-white/30'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[8px] text-white/30">{pct}%</span>
                </div>
              ))}
            </div>
          )}

          {/* Top Qualities */}
          {topQualities.length > 0 && (
            <div>
              <div className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Qualities</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {topQualities.map(([name, q]) => (
                  <div key={name} className="flex items-center gap-1.5">
                    <span className="text-[10px] text-white/60 capitalize" style={{ width: 85 }}>
                      {name}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${q.level}%`,
                          backgroundColor: q.level >= 80 ? '#f59e0b' : q.level >= 50 ? '#8b5cf6' : '#64748b'
                        }}
                      />
                    </div>
                    <span className="text-[8px] text-white/30 w-5 text-right">{q.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths + Shadows */}
          <div className="grid grid-cols-2 gap-3">
            {zone.strengths?.length > 0 && (
              <div>
                <div className="text-[9px] text-emerald-400/60 uppercase tracking-wider mb-0.5">Strengths</div>
                {zone.strengths.slice(0, 3).map((s, i) => (
                  <div key={i} className="text-[9px] text-white/50 leading-snug">· {s}</div>
                ))}
              </div>
            )}
            {zone.shadows?.length > 0 && (
              <div>
                <div className="text-[9px] text-red-400/60 uppercase tracking-wider mb-0.5">Shadows</div>
                {zone.shadows.slice(0, 3).map((s, i) => (
                  <div key={i} className="text-[9px] text-white/50 leading-snug">· {s}</div>
                ))}
              </div>
            )}
          </div>

          {/* Career Signatures */}
          {zone.careerSignatures?.length > 0 && (
            <div>
              <div className="text-[9px] text-white/30 uppercase tracking-wider mb-0.5">Career</div>
              <div className="text-[9px] text-white/50">
                {zone.careerSignatures.slice(0, 4).join(' · ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}


// ─── ZoneChip — hoverable "Zone X" with tooltip ─────────────────────────────
export default function ZoneChip({ zone, sign, className = '' }) {
  const [hover, setHover] = useState(false)
  const mousePos = useRef({ x: 0, y: 0 })

  if (!zone) return null

  return (
    <span
      className={`text-amber-400 cursor-pointer hover:text-amber-300 ${className}`}
      onMouseEnter={(e) => { mousePos.current = { x: e.clientX, y: e.clientY }; setHover(true) }}
      onMouseMove={(e) => { mousePos.current = { x: e.clientX, y: e.clientY } }}
      onMouseLeave={() => setHover(false)}
    >
      Zone {zone.id}
      {hover && <ZoneTooltip zone={zone} sign={sign} mouseX={mousePos.current.x} mouseY={mousePos.current.y} />}
    </span>
  )
}
