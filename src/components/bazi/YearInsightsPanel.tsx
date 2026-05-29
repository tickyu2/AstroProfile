/**
 * YearInsightsPanel — Yearly overview combining all 5 new features:
 * 1. Collapse Mode Timeline
 * 2. Radar Stability Index
 * 3. Monthly Narrative
 * 4. Yearly Narrative
 * 5. Yearly Archetype
 *
 * Rendered once per year above the season cards.
 *
 * Created: March 2026
 */

import React, { useState, useMemo } from 'react';
import type { QiYearMatrix, QiMonthSnapshot, QiDist } from '../../utils/qiEngine';
import { buildCollapseTimeline, type CollapseTimeline } from '../../utils/collapseTimeline';
import { computeYearStability, type YearStabilityResult } from '../../utils/stabilityIndex';
import { generateYearlyNarrative, type YearlyNarrative } from '../../utils/narrativeEngine';
import { computeYearArchetypes, ARCHETYPES, type YearArchetypeResult } from '../../utils/archetypeEngine';

const ELEM_COLORS: Record<string, string> = {
  Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#a1a1aa', Water: '#3b82f6',
};

const COLLAPSE_COLORS: Record<string, string> = {
  'none': '#4ade80',
  'single-dominant': '#f59e0b',
  'bi-polar': '#a78bfa',
  'drained': '#6b7280',
  'inverted': '#ef4444',
};

const COLLAPSE_LABELS: Record<string, string> = {
  'none': 'Balanced',
  'single-dominant': 'Single Dominant',
  'bi-polar': 'Bi-polar',
  'drained': 'Drained',
  'inverted': 'Inverted',
};

const STABILITY_COLORS: Record<string, string> = {
  'stable': '#4ade80',
  'moderate': '#facc15',
  'volatile': '#f97316',
  'extreme': '#ef4444',
};

const ELEMENTS: (keyof QiDist)[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

interface Props {
  qiMatrix: QiYearMatrix;
  /** Render prop: given a month snapshot, render the pillar cards + Layer 1 + CYMFQ detail.
   *  This allows the parent (QiBraceletPage) to reuse its existing IncomingPillarWithFlap components. */
  renderMonthDetail?: (snap: QiMonthSnapshot) => React.ReactNode;
}

export default function YearInsightsPanel({ qiMatrix, renderMonthDetail }: Props) {
  const [activeTab, setActiveTab] = useState<'narrative' | 'timeline' | 'stability' | 'archetypes'>('narrative');

  const timeline = useMemo(() => buildCollapseTimeline(qiMatrix), [qiMatrix]);
  const stability = useMemo(() => computeYearStability(qiMatrix), [qiMatrix]);
  const narrative = useMemo(() => generateYearlyNarrative(qiMatrix), [qiMatrix]);
  const archetypes = useMemo(() => computeYearArchetypes(qiMatrix), [qiMatrix]);

  const tabs = [
    { key: 'narrative' as const, label: 'Year Story' },
    { key: 'timeline' as const, label: 'Collapse Timeline' },
    { key: 'stability' as const, label: 'Stability Index' },
    { key: 'archetypes' as const, label: 'Archetypes' },
  ];

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
      {/* Tab bar */}
      <div className="flex border-b border-white/10">
        {tabs.map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white/10 text-white border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === 'narrative' && <NarrativeTab narrative={narrative} qiMatrix={qiMatrix} renderMonthDetail={renderMonthDetail} />}
        {activeTab === 'timeline' && <TimelineTab timeline={timeline} />}
        {activeTab === 'stability' && <StabilityTab stability={stability} />}
        {activeTab === 'archetypes' && <ArchetypesTab archetypes={archetypes} />}
      </div>
    </div>
  );
}

// ============================================================================
// NARRATIVE TAB
// ============================================================================

function NarrativeTab({ narrative, qiMatrix, renderMonthDetail }: {
  narrative: YearlyNarrative;
  qiMatrix: QiYearMatrix;
  renderMonthDetail?: (snap: QiMonthSnapshot) => React.ReactNode;
}) {
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {/* Yearly summary */}
      <div className="p-3 rounded-lg bg-indigo-900/20 border border-indigo-500/20">
        <div className="text-xs text-indigo-300 mb-1 font-medium">{narrative.year} — Year Overview</div>
        <div className="text-sm text-gray-200 leading-relaxed">{narrative.summary}</div>
      </div>

      {/* Inflection points */}
      {narrative.inflectionPoints.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {narrative.inflectionPoints.map((ip, i) => (
            <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
              {ip.monthName}: {COLLAPSE_LABELS[ip.from] || ip.from} → {COLLAPSE_LABELS[ip.to] || ip.to}
            </span>
          ))}
        </div>
      )}

      {/* Monthly chapters */}
      <div className="space-y-1.5">
        {narrative.chapters.map(ch => {
          const snap = qiMatrix.months[ch.monthIndex];
          return (
            <div key={ch.monthIndex} className="border border-white/5 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedMonth(expandedMonth === ch.monthIndex ? null : ch.monthIndex)}
                className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-200">{ch.monthName}</span>
                  {ch.collapseMode !== 'none' && (
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: COLLAPSE_COLORS[ch.collapseMode] + '20', color: COLLAPSE_COLORS[ch.collapseMode] }}
                    >
                      {COLLAPSE_LABELS[ch.collapseMode]}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-mono"
                    style={{ color: STABILITY_COLORS[ch.stabilityIndex <= 15 ? 'stable' : ch.stabilityIndex <= 35 ? 'moderate' : ch.stabilityIndex <= 60 ? 'volatile' : 'extreme'] }}
                  >
                    {ch.stabilityIndex}/100
                  </span>
                  <span className="text-gray-500">{expandedMonth === ch.monthIndex ? '\u25BE' : '\u25B8'}</span>
                </div>
              </button>
              {expandedMonth === ch.monthIndex && snap && (
                <div className="px-3 py-2.5 space-y-3 bg-white/[0.02]">
                  {/* Narrative body */}
                  <div className="text-xs text-gray-300 leading-relaxed">{ch.body}</div>

                  {/* Render month detail via parent-provided render prop */}
                  {renderMonthDetail ? renderMonthDetail(snap) : <FallbackCYMFQTable snap={snap} />}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// FALLBACK CYMFQ TABLE — used when no renderMonthDetail prop is provided
// ============================================================================

function FallbackCYMFQTable({ snap }: { snap: QiMonthSnapshot }) {
  const rows: { label: string; qi: QiDist; color: string }[] = [
    { label: 'Natal TFQ (×1.0)', qi: snap.natalTfq || snap.seasonalQi, color: 'text-amber-400' },
  ];
  if (snap.daYunQi) {
    rows.push({ label: 'Da Yun Qi (×0.9)', qi: snap.daYunQi, color: 'text-pink-400' });
  }
  rows.push(
    { label: 'Year Qi (×0.5)', qi: snap.yearQi, color: 'text-purple-400' },
    { label: 'Month Qi (×0.3)', qi: snap.monthQi, color: 'text-blue-400' },
    { label: 'MTFQ', qi: snap.mtfqQi || snap.combinedQi, color: 'text-white' },
    { label: 'Post-Clash', qi: snap.postClashQi, color: 'text-orange-400' },
    { label: 'Post-Control', qi: snap.postControlQi, color: 'text-yellow-400' },
    { label: 'TotalQi', qi: snap.functionalQi, color: 'text-green-400' },
  );

  const mffqTotal = ELEMENTS.reduce((s, el) => s + (snap.functionalQi[el] || 0), 0) || 1;

  return (
    <div className="rounded-lg border border-white/10 bg-slate-900/60 overflow-hidden">
      <div className="px-3 py-2 bg-white/5 border-b border-white/10">
        <div className="text-[10px] font-semibold text-white">
          {snap.monthName} — Qi Pipeline (MTFQ → TotalQi)
        </div>
        <div className="text-[9px] text-gray-500">How external Qi layers combine with your natal baseline</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[9px] font-mono">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-2 py-1.5 text-left text-gray-500 w-24">Step</th>
              {ELEMENTS.map(el => (
                <th key={el} className="px-1.5 py-1.5 text-right" style={{ color: ELEM_COLORS[el] }}>
                  {el[0]}
                </th>
              ))}
              <th className="px-2 py-1.5 text-right text-gray-500">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const total = ELEMENTS.reduce((s, el) => s + (row.qi[el] || 0), 0);
              const isFinal = row.label === 'TotalQi';
              return (
                <tr key={i} className={`border-t border-white/5 ${isFinal ? 'bg-green-900/10' : 'hover:bg-white/5'}`}>
                  <td className={`px-2 py-1 ${row.color} ${isFinal ? 'font-bold' : ''}`}>
                    {row.label}
                    {row.label === 'Combined Qi' && <span className="text-gray-600 ml-1">=</span>}
                  </td>
                  {ELEMENTS.map(el => (
                    <td key={el} className={`px-1.5 py-1 text-right ${isFinal ? 'text-white font-semibold' : 'text-gray-400'}`}>
                      {(row.qi[el] || 0).toFixed(2)}
                    </td>
                  ))}
                  <td className={`px-2 py-1 text-right ${isFinal ? 'text-white font-bold' : 'text-gray-500'}`}>
                    {total.toFixed(2)}
                  </td>
                </tr>
              );
            })}
            {/* Percentage row */}
            <tr className="border-t border-white/20 bg-white/5">
              <td className="px-2 py-1 text-green-400 font-bold">TotalQi %</td>
              {ELEMENTS.map(el => {
                const pct = ((snap.functionalQi[el] || 0) / mffqTotal) * 100;
                return (
                  <td key={el} className="px-1.5 py-1 text-right font-semibold" style={{ color: ELEM_COLORS[el] }}>
                    {pct.toFixed(1)}%
                  </td>
                );
              })}
              <td className="px-2 py-1 text-right text-white font-bold">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// TIMELINE TAB
// ============================================================================

function TimelineTab({ timeline }: { timeline: CollapseTimeline }) {
  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 rounded-lg bg-white/5">
          <div className="text-2xl font-bold text-white">{timeline.collapseMonths}</div>
          <div className="text-[10px] text-gray-400">Collapse Months</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-white/5">
          <div className="text-2xl font-bold text-white">{timeline.stableMonths}</div>
          <div className="text-[10px] text-gray-400">Stable Months</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-white/5">
          <div className="text-2xl font-bold" style={{ color: COLLAPSE_COLORS[timeline.dominantMode] }}>
            {COLLAPSE_LABELS[timeline.dominantMode]}
          </div>
          <div className="text-[10px] text-gray-400">Dominant Pattern</div>
        </div>
      </div>

      {/* Visual timeline */}
      <div className="space-y-1">
        {timeline.entries.map(entry => (
          <div key={entry.monthIndex} className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 w-20 text-right font-mono">{entry.monthName}</span>
            <div className="flex-1 h-6 rounded-md flex items-center px-2" style={{
              backgroundColor: COLLAPSE_COLORS[entry.collapseMode] + '20',
              borderLeft: `3px solid ${COLLAPSE_COLORS[entry.collapseMode]}`,
            }}>
              <span className="text-[10px] font-medium" style={{ color: COLLAPSE_COLORS[entry.collapseMode] }}>
                {COLLAPSE_LABELS[entry.collapseMode]}
                {entry.primary && entry.collapseMode !== 'none' && (
                  <span className="text-gray-400 ml-1.5">
                    {entry.primary}{entry.primaryShare ? ` (${(entry.primaryShare * 100).toFixed(0)}%)` : ''}
                    {entry.secondary ? ` / ${entry.secondary}` : ''}
                  </span>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// STABILITY TAB
// ============================================================================

function StabilityTab({ stability }: { stability: YearStabilityResult }) {
  return (
    <div className="space-y-4">
      {/* Year summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 rounded-lg bg-white/5">
          <div className="text-2xl font-bold" style={{ color: STABILITY_COLORS[stability.yearCategory] }}>
            {stability.yearAverage}
          </div>
          <div className="text-[10px] text-gray-400">Year Average</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-white/5">
          <div className="text-sm font-bold text-green-400">{stability.mostStableMonth}</div>
          <div className="text-[10px] text-gray-400">Most Stable</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-white/5">
          <div className="text-sm font-bold text-red-400">{stability.mostVolatileMonth}</div>
          <div className="text-[10px] text-gray-400">Most Volatile</div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="space-y-1">
        {stability.months.map(m => {
          const color = STABILITY_COLORS[m.category];
          return (
            <div key={m.monthIndex} className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 w-20 text-right font-mono">{m.monthName}</span>
              <div className="flex-1 h-5 rounded bg-white/5 relative overflow-hidden">
                <div
                  className="absolute left-0 top-0 bottom-0 rounded"
                  style={{
                    width: `${m.index}%`,
                    backgroundColor: color,
                    opacity: 0.6,
                  }}
                />
                <span className="absolute right-2 top-0 bottom-0 flex items-center text-[10px] font-mono text-white/80">
                  {m.index}
                </span>
              </div>
              <span className="text-[9px] w-14 text-right" style={{ color }}>
                {m.category}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// ARCHETYPES TAB
// ============================================================================

const ELEM_BADGE_COLORS: Record<string, string> = {
  Wood: 'bg-green-900/40 text-green-300 border-green-600/30',
  Fire: 'bg-red-900/40 text-red-300 border-red-600/30',
  Earth: 'bg-amber-900/40 text-amber-300 border-amber-600/30',
  Metal: 'bg-gray-700/40 text-gray-300 border-gray-500/30',
  Water: 'bg-blue-900/40 text-blue-300 border-blue-600/30',
};

function ArchetypesTab({ archetypes }: { archetypes: YearArchetypeResult }) {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between px-1">
        <div className="text-xs text-gray-400">
          {archetypes.distinctCount} distinct archetypes across 12 months
        </div>
        <div className="text-xs text-gray-300">
          Dominant: <span className="font-semibold text-white">{archetypes.dominantArchetype}</span>
        </div>
      </div>

      {/* Archetype grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {archetypes.months.map(m => {
          const info = ARCHETYPES[m.archetype];
          const isExpanded = expandedCard === m.monthIndex;
          return (
            <div
              key={m.monthIndex}
              className={`rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer ${
                isExpanded ? 'col-span-2 md:col-span-3 lg:col-span-4' : ''
              }`}
              onClick={() => setExpandedCard(isExpanded ? null : m.monthIndex)}
            >
              {/* Compact header (always visible) */}
              <div className="p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="text-base"
                    dangerouslySetInnerHTML={{ __html: info.symbol }}
                  />
                  <span className="text-[10px] text-gray-400">{m.monthName}</span>
                  <span className="ml-auto text-gray-500 text-[10px]">{isExpanded ? '\u25BE' : '\u25B8'}</span>
                </div>
                <div className="text-xs font-semibold text-gray-100 mb-0.5">{m.archetype}</div>
                <div className="text-[10px] text-gray-500 italic mb-1">{info.tagline}</div>
                <div className="text-[9px] text-gray-400 leading-relaxed">{m.reason}</div>
              </div>

              {/* Expanded: Persona + Ritual + Bracelet */}
              {isExpanded && (
                <div className="border-t border-white/10 p-3 space-y-3">
                  {/* Description + Theme */}
                  <div className="text-[11px] text-gray-300 leading-relaxed">
                    {info.description}
                  </div>
                  <div className="flex flex-wrap gap-2 text-[9px]">
                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-gray-400">Theme: {info.theme}</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-gray-400">Behavior: {info.behavior}</span>
                  </div>

                  {/* Mythic Persona */}
                  <div className="p-2.5 rounded-lg bg-indigo-900/20 border border-indigo-500/20">
                    <div className="text-[10px] text-indigo-300 font-medium mb-1">
                      Mythic Persona — {info.persona.name}
                    </div>
                    <div className="text-[11px] text-gray-300 leading-relaxed italic">
                      {info.persona.description}
                    </div>
                  </div>

                  {/* Monthly Ritual */}
                  <div className="p-2.5 rounded-lg bg-purple-900/20 border border-purple-500/20">
                    <div className="text-[10px] text-purple-300 font-medium mb-1">
                      {info.ritual.name}
                    </div>
                    <div className="text-[11px] text-gray-300 leading-relaxed">
                      {info.ritual.instruction}
                    </div>
                  </div>

                  {/* Bracelet Prescription */}
                  <div className="p-2.5 rounded-lg bg-amber-900/20 border border-amber-500/20">
                    <div className="text-[10px] text-amber-300 font-medium mb-1">
                      Bracelet Prescription
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      {info.bracelet.elements.map(el => (
                        <span key={el} className={`text-[10px] px-1.5 py-0.5 rounded border ${ELEM_BADGE_COLORS[el] || ''}`}>
                          {el}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {info.bracelet.stones.map(stone => (
                        <span key={stone} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                          {stone}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
