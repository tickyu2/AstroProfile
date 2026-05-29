/**
 * CauseMapPanel — "Why does my radar look like this?"
 *
 * Renders a structured breakdown of which pipeline module caused each
 * element to rise or fall. Collapsible per-stage, with delta bars,
 * per-element attribution, and a dominant-cause summary.
 *
 * Created: March 2026
 */

import React, { useState, useMemo } from 'react';
import type { CauseMapResult, CauseMapEntry, CauseDelta } from '../../utils/causeMapEngine';
import { buildScaledCauseMap } from '../../utils/causeMapEngine';
import type { ElementName } from '../../data/stoneDatabase';

const ELEM_COLORS: Record<string, string> = {
  Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#a1a1aa', Water: '#3b82f6',
};

const ELEMENTS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

const MODULE_ICONS: Record<string, string> = {
  'Seasonal Qi':        '&#127793;',  // seedling
  'Year Pillar Qi':     '&#127775;',  // star
  'Month Pillar Qi':    '&#127769;',  // moon
  'Clashes & Harms':    '&#9876;',    // swords
  'Control Cycle':      '&#10060;',   // x
  'Structural Collapse': '&#128165;', // collision
};

interface Props {
  causeMap: CauseMapResult;
  monthName?: string;
  /** Optional: season name for explanation panel */
  season?: string;
  /** Optional: Yong Shen data for explanation panel */
  yongShen?: { status?: string; collapseMode?: string; reasoning?: string; usefulElements?: string[]; forbidden?: string[] };
}

function fmtDelta(v: number): string {
  if (Math.abs(v) < 0.001) return '—';
  return (v >= 0 ? '+' : '') + v.toFixed(2);
}

function DeltaBar({ delta, maxAbs }: { delta: number; maxAbs: number }) {
  if (Math.abs(delta) < 0.001) {
    return <div className="h-3 w-full rounded bg-white/5" />;
  }
  const pct = Math.min((Math.abs(delta) / maxAbs) * 100, 100);
  const isPositive = delta > 0;

  return (
    <div className="relative h-3 w-full flex items-center">
      {/* center line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />
      {/* bar */}
      <div
        className="absolute h-3 rounded-sm"
        style={{
          backgroundColor: isPositive ? '#22c55e' : '#ef4444',
          opacity: 0.7,
          width: `${pct / 2}%`,
          ...(isPositive
            ? { left: '50%' }
            : { right: '50%' }),
        }}
      />
    </div>
  );
}

function StageCard({ entry, defaultOpen = false }: { entry: CauseMapEntry; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  const maxAbs = Math.max(...entry.deltas.map(d => Math.abs(d.delta)), 0.001);
  const hasImpact = entry.deltas.some(d => Math.abs(d.delta) > 0.001);
  const totalDelta = entry.totalAfter - entry.totalBefore;

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 hover:bg-white/10 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span
            className="text-base"
            dangerouslySetInnerHTML={{ __html: MODULE_ICONS[entry.module] || '&#9679;' }}
          />
          <span className="text-sm font-medium text-gray-200">
            {entry.module}
          </span>
          {entry.biggestMover && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-gray-400">
              {entry.biggestMover.delta > 0 ? '+' : ''}
              {entry.biggestMover.delta.toFixed(1)} {entry.biggestMover.element}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {hasImpact && (
            <span className={`text-xs font-mono ${totalDelta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalDelta >= 0 ? '+' : ''}{totalDelta.toFixed(1)} pts
            </span>
          )}
          <span className="text-gray-400">{open ? '\u25BE' : '\u25B8'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 py-3 space-y-3">
          {/* Notes */}
          {entry.notes.length > 0 && (
            <div className="text-xs text-gray-400 space-y-0.5">
              {entry.notes.map((n, i) => <div key={i}>{n}</div>)}
            </div>
          )}

          {/* Delta table */}
          <div className="rounded border border-white/10 overflow-hidden">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-2 py-1 text-left text-gray-400 w-16">Element</th>
                  <th className="px-2 py-1 text-right text-gray-400 w-16">Before</th>
                  <th className="px-2 py-1 text-right text-gray-400 w-16">After</th>
                  <th className="px-2 py-1 text-right text-gray-400 w-16">Delta</th>
                  <th className="px-2 py-1 text-gray-400">Impact</th>
                </tr>
              </thead>
              <tbody>
                {entry.deltas.map((d) => (
                  <tr key={d.element} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-2 py-1.5">
                      <span style={{ color: ELEM_COLORS[d.element] }}>{d.element}</span>
                    </td>
                    <td className="px-2 py-1.5 text-right text-gray-400">{d.before.toFixed(2)}</td>
                    <td className="px-2 py-1.5 text-right text-gray-300">{d.after.toFixed(2)}</td>
                    <td className={`px-2 py-1.5 text-right font-semibold ${
                      d.delta > 0.001 ? 'text-green-400' : d.delta < -0.001 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {fmtDelta(d.delta)}
                    </td>
                    <td className="px-2 py-1.5">
                      <DeltaBar delta={d.delta} maxAbs={maxAbs} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// DEBUG OVERLAY — Raw vs Scaled side-by-side
// ============================================================================

const EXTERNAL_MODULES = new Set(['Seasonal Qi', 'Year Pillar Qi', 'Month Pillar Qi']);

function DebugOverlay({ rawMap, scaledMap }: { rawMap: CauseMapResult; scaledMap: CauseMapResult }) {
  return (
    <div className="p-3 bg-slate-950/80 border border-rose-500/30 rounded-xl text-xs space-y-2">
      <div className="font-semibold text-rose-300">Cause Map Debug — Raw vs 60/40 Scaled</div>
      <div className="text-[10px] text-gray-400 mb-2">
        External layers (Seasonal, Year, Month) are scaled x0.40. Structural stages (Clash, Control, Collapse) stay raw.
      </div>
      {rawMap.entries.map((rawEntry, i) => {
        const scaledEntry = scaledMap.entries[i];
        const isExternal = EXTERNAL_MODULES.has(rawEntry.module);
        return (
          <div key={i} className="border-t border-slate-700 pt-2 mt-1">
            <div className="flex items-center justify-between text-gray-300 mb-1">
              <span className="font-medium">{rawEntry.module}</span>
              <span className="text-[9px] text-gray-400">{isExternal ? 'x0.40 scaled' : 'raw (structural)'}</span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {ELEMENTS.map(el => {
                const rawD = rawEntry.deltas.find(d => d.element === el);
                const scaledD = scaledEntry.deltas.find(d => d.element === el);
                if (!rawD || !scaledD) return null;
                return (
                  <div key={el} className="p-1 bg-slate-900/60 rounded text-center">
                    <div className="text-[9px]" style={{ color: ELEM_COLORS[el] }}>{el}</div>
                    <div className="text-[9px] text-gray-400">raw: {rawD.delta >= 0 ? '+' : ''}{rawD.delta.toFixed(2)}</div>
                    <div className={`text-[9px] font-semibold ${isExternal ? 'text-emerald-300' : 'text-gray-400'}`}>
                      40%: {scaledD.delta >= 0 ? '+' : ''}{scaledD.delta.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// WHY THIS MONTH PANEL — Narrative explanation
// ============================================================================

function WhyThisMonthPanel({
  dominantCause,
  perElement,
  monthName,
  season,
  yongShen,
  isScaled,
}: {
  dominantCause: CauseMapResult['dominantCause'];
  perElement: CauseMapResult['perElement'];
  monthName?: string;
  season?: string;
  yongShen?: Props['yongShen'];
  isScaled: boolean;
}) {
  const bullets: string[] = [];

  // Dominant element explanation
  const dir = dominantCause.delta > 0 ? 'boosting' : 'suppressing';
  const scaledLabel = isScaled ? ' (60/40 scaled)' : ' (raw pipeline)';
  bullets.push(
    `The biggest shift comes from ${dominantCause.module}, ${dir} ${dominantCause.element} by ${Math.abs(dominantCause.delta).toFixed(2)} pts${scaledLabel}.`
  );

  // Season context
  if (season) {
    const seasonElements: Record<string, string> = {
      Spring: 'Wood', Summer: 'Fire', Autumn: 'Metal', Winter: 'Water',
    };
    const inSeason = seasonElements[season];
    if (inSeason) {
      bullets.push(`${season} strengthens ${inSeason} energy. Elements out-of-season are weakened.`);
    }
  }

  // Per-element movers
  const movers = ELEMENTS
    .filter(el => Math.abs(perElement[el].delta) > 0.5)
    .sort((a, b) => Math.abs(perElement[b].delta) - Math.abs(perElement[a].delta));

  if (movers.length > 1) {
    const summary = movers.map(el => {
      const { module, delta } = perElement[el];
      return `${el} ${delta > 0 ? '+' : ''}${delta.toFixed(1)} (${module})`;
    }).join(', ');
    bullets.push(`Key movers: ${summary}.`);
  }

  // Yong Shen context
  if (yongShen?.collapseMode && yongShen.collapseMode !== 'none') {
    bullets.push(`Structural collapse detected: ${yongShen.collapseMode}. ${yongShen.reasoning || ''}`);
  }
  if (yongShen?.usefulElements?.length) {
    bullets.push(`Bracelet remedy targets: ${yongShen.usefulElements.join(', ')}.`);
  }
  if (yongShen?.forbidden?.length) {
    bullets.push(`Forbidden elements: ${yongShen.forbidden.join(', ')} — avoided in bracelet design.`);
  }

  return (
    <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20 space-y-2">
      <div className="text-xs font-semibold text-indigo-300">
        Why {monthName || 'this month'} behaves this way
      </div>
      <ul className="space-y-1.5">
        {bullets.map((b, i) => (
          <li key={i} className="text-[11px] text-gray-400 leading-relaxed flex gap-2">
            <span className="text-indigo-400 mt-0.5 flex-shrink-0">*</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CauseMapPanel({ causeMap, monthName, season, yongShen }: Props) {
  if (!causeMap || !causeMap.entries.length) return null;

  const [showScaled, setShowScaled] = useState(true); // default to scaled (corrected) view
  const [showDebug, setShowDebug] = useState(false);
  const [showWhy, setShowWhy] = useState(false);

  const scaledMap = useMemo(() => buildScaledCauseMap(causeMap), [causeMap]);
  const activeMap = showScaled ? scaledMap : causeMap;
  const { dominantCause, perElement } = activeMap;

  return (
    <div className="space-y-4">
      {/* Header + controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-base font-semibold text-gray-100">
          Cause Map {monthName ? `\u2014 ${monthName}` : ''}
        </h3>
        <div className="flex items-center gap-1.5">
          {/* Raw / Scaled toggle */}
          <button
            onClick={() => setShowScaled(!showScaled)}
            className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
              showScaled
                ? 'bg-teal-500/15 border-teal-500/30 text-teal-300'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
            }`}
          >
            {showScaled ? '60/40 Scaled' : 'Raw Pipeline'}
          </button>
          {/* Debug toggle */}
          <button
            onClick={() => setShowDebug(!showDebug)}
            className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
              showDebug
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                : 'bg-white/5 border-white/10 text-gray-400'
            }`}
          >
            Debug
          </button>
          {/* Why toggle */}
          <button
            onClick={() => setShowWhy(!showWhy)}
            className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
              showWhy
                ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                : 'bg-white/5 border-white/10 text-gray-400'
            }`}
          >
            Why?
          </button>
          <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
            Why does your radar look like this?
          </span>
        </div>
      </div>

      {/* Why this month explanation */}
      {showWhy && (
        <WhyThisMonthPanel
          dominantCause={dominantCause}
          perElement={perElement}
          monthName={monthName}
          season={season}
          yongShen={yongShen}
          isScaled={showScaled}
        />
      )}

      {/* Debug overlay — raw vs scaled side-by-side */}
      {showDebug && (
        <DebugOverlay rawMap={causeMap} scaledMap={scaledMap} />
      )}

      {/* Dominant cause callout */}
      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
        <div className="text-xs text-gray-400 mb-1">
          Biggest single shift this month
          <span className="ml-2 text-[9px] text-gray-400">
            ({showScaled ? '60/40 influence' : 'raw pipeline'})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-lg font-bold"
            style={{ color: ELEM_COLORS[dominantCause.element] }}
          >
            {dominantCause.element}
          </span>
          <span className={`text-sm font-mono font-semibold ${
            dominantCause.delta > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {dominantCause.delta > 0 ? '+' : ''}{dominantCause.delta.toFixed(2)} pts
          </span>
          <span className="text-xs text-gray-400">from {dominantCause.module}</span>
        </div>
      </div>

      {/* Per-element attribution summary */}
      <div className="grid grid-cols-5 gap-1.5">
        {ELEMENTS.map(el => {
          const attr = perElement[el];
          if (!attr || Math.abs(attr.delta) < 0.001) {
            return (
              <div key={el} className="text-center p-2 rounded bg-white/5">
                <div className="text-[10px]" style={{ color: ELEM_COLORS[el] }}>{el}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">stable</div>
              </div>
            );
          }
          return (
            <div key={el} className="text-center p-2 rounded bg-white/5 border border-white/5">
              <div className="text-[10px] font-medium" style={{ color: ELEM_COLORS[el] }}>{el}</div>
              <div className={`text-xs font-mono font-bold ${
                attr.delta > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {attr.delta > 0 ? '+' : ''}{attr.delta.toFixed(1)}
              </div>
              <div className="text-[9px] text-gray-400 mt-0.5 truncate">{attr.module}</div>
            </div>
          );
        })}
      </div>

      {/* Stage-by-stage breakdown */}
      <div className="space-y-2">
        {activeMap.entries.map((entry, i) => (
          <StageCard key={i} entry={entry} defaultOpen={i === 0} />
        ))}
      </div>
    </div>
  );
}
