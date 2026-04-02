/**
 * ============================================================================
 * DA YUN QI OVERLAY
 * ============================================================================
 * Shows the active 大運 pillar and its Qi contribution, integrated into
 * the QiBraceletPage next to the monthly Qi console.
 *
 * Props:
 *   chart        — BaZi chart object (pillars, gender)
 *   birthDate    — "YYYY-MM-DD"
 *   birthTime    — "HH:MM"
 *   gender       — 'male' | 'female'
 *   selectedYear — Gregorian year being viewed
 *   currentMonthBranch — branch char of the selected BaZi month
 *   dayMasterElement   — "Wood" | "Fire" | etc.
 *   collapseMode       — from the monthly snapshot
 * ============================================================================
 */
import React, { useMemo, useState } from 'react';
import {
  calculateDaYun,
  computeDaYunQi,
  describeDaYunInfluence,
  DA_YUN_BUDGET,
  type DaYunPillar,
  type DaYunResult,
} from '../../utils/daYunEngine';
import { STEMS, BRANCHES, HIDDEN_STEMS } from '../../utils/baziEngine';
import { getSeasonalWeights } from '../../utils/baziSeasonality';

// Element colour map (mirrors QiDebugger / PentagonRadar)
const EL_COLORS: Record<string, { text: string; bg: string; bar: string; emoji: string }> = {
  Wood:  { text: 'text-green-400',  bg: 'bg-green-900/40',  bar: 'bg-green-500',  emoji: '🌿' },
  Fire:  { text: 'text-orange-400', bg: 'bg-orange-900/40', bar: 'bg-orange-500', emoji: '🔥' },
  Earth: { text: 'text-yellow-400', bg: 'bg-yellow-900/40', bar: 'bg-yellow-500', emoji: '⛰️' },
  Metal: { text: 'text-gray-300',   bg: 'bg-gray-700/40',   bar: 'bg-gray-400',   emoji: '⚙️' },
  Water: { text: 'text-blue-400',   bg: 'bg-blue-900/40',   bar: 'bg-blue-500',   emoji: '💧' },
};

const ELEMENT_KEYS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const;

// ============================================================================
// PILLAR BADGE
// ============================================================================

function PillarBadge({
  pillar,
  isSelected,
  onClick,
}: {
  pillar: DaYunPillar;
  isSelected: boolean;
  onClick: () => void;
  currentYear: number;
}) {
  const col = EL_COLORS[pillar.element] || EL_COLORS.Earth;
  const isActive = pillar.isCurrent;
  return (
    <button
      onClick={onClick}
      className={[
        'flex-shrink-0 rounded-lg px-3 py-2 border transition-all text-left',
        isActive
          ? `${col.bg} border-amber-400/60 ring-1 ring-amber-400/40`
          : isSelected
          ? `${col.bg} border-slate-500/60`
          : 'bg-slate-800/50 border-slate-700/40 hover:border-slate-600/60',
      ].join(' ')}
      style={{ minWidth: 80 }}
      title={`Ages ${pillar.ageStart}–${pillar.ageEnd} (${pillar.yearStart}–${pillar.yearEnd})`}
    >
      <div className={`text-lg font-bold ${isActive || isSelected ? col.text : 'text-slate-300'}`}>
        {pillar.stem}{pillar.branch}
      </div>
      <div className="text-[10px] text-slate-400 mt-0.5">
        {pillar.ageStart}–{pillar.ageEnd}
      </div>
      {isActive && (
        <div className="text-[9px] text-amber-400 font-semibold mt-0.5 uppercase tracking-wide">
          now
        </div>
      )}
    </button>
  );
}

// ============================================================================
// QI BAR
// ============================================================================

function QiBar({
  element,
  pts,
  maxPts,
}: {
  element: string;
  pts: number;
  maxPts: number;
}) {
  const col = EL_COLORS[element] || EL_COLORS.Earth;
  const pct = maxPts > 0 ? (pts / maxPts) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="w-4 text-sm">{col.emoji}</span>
      <span className={`w-14 text-xs font-medium ${col.text}`}>{element}</span>
      <div className="flex-1 bg-slate-700/50 rounded-full h-2">
        <div
          className={`h-full rounded-full ${col.bar} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-12 text-right text-xs text-slate-300">
        {pts.toFixed(2)} pts
      </span>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DaYunQiOverlay({
  chart,
  birthDate,
  birthTime = '12:00',
  gender = 'male',
  selectedYear = new Date().getFullYear(),
  currentMonthBranch,
  dayMasterElement = 'Metal',
  collapseMode = 'none',
}: {
  chart: any;
  birthDate: string;
  birthTime?: string;
  gender?: string;
  selectedYear?: number;
  currentMonthBranch: string;
  dayMasterElement?: string;
  collapseMode?: string;
}) {
  const [showSteps, setShowSteps] = useState(false);
  const [selectedPillarIndex, setSelectedPillarIndex] = useState<number | null>(null);

  // --- Calculate Da Yun sequence ---
  const daYunResult = useMemo<DaYunResult | null>(() => {
    if (!chart || !birthDate) return null;
    try {
      return calculateDaYun(chart, birthDate, birthTime, selectedYear, gender);
    } catch {
      return null;
    }
  }, [chart, birthDate, birthTime, selectedYear, gender]);

  // Active pillar for display (user-selected or current)
  const activePillar = useMemo<DaYunPillar | null>(() => {
    if (!daYunResult) return null;
    if (selectedPillarIndex !== null) {
      return daYunResult.pillars[selectedPillarIndex] || null;
    }
    return daYunResult.currentPillar || daYunResult.pillars[0] || null;
  }, [daYunResult, selectedPillarIndex]);

  // Qi contribution of active pillar for this month
  const qiContrib = useMemo(() => {
    if (!activePillar || !currentMonthBranch) return null;
    try {
      return computeDaYunQi(activePillar, currentMonthBranch);
    } catch {
      return null;
    }
  }, [activePillar, currentMonthBranch]);

  // Narrative
  const narrative = useMemo(() => {
    if (!activePillar) return '';
    return describeDaYunInfluence(activePillar, dayMasterElement, collapseMode);
  }, [activePillar, dayMasterElement, collapseMode]);

  if (!daYunResult || !birthDate) {
    return (
      <div className="rounded-xl bg-slate-800/50 border border-slate-700/40 p-4 text-slate-400 text-sm">
        大運 DaYun: birth date required
      </div>
    );
  }

  // Historical profiles: no pillar covers the selected year — Da Yun is not active
  const isHistorical = daYunResult.currentPillar === null;

  const col = activePillar ? (EL_COLORS[activePillar.element] || EL_COLORS.Earth) : EL_COLORS.Earth;
  const maxQiPts = qiContrib
    ? Math.max(...ELEMENT_KEYS.map(k => qiContrib.qi[k]), 0.01)
    : 1;

  return (
    <div className="rounded-xl border border-slate-700/40 overflow-hidden">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 px-4 py-3 flex items-center justify-between border-b border-slate-700/40">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold text-sm">大運</span>
          <span className="text-slate-300 text-sm">Da Yun — 10-Year Luck Pillar</span>
          <span className="text-xs text-slate-500 ml-2">
            {daYunResult.directionChinese} ({daYunResult.direction})
            {' · '}onset age {daYunResult.onsetAgeYears}y{daYunResult.onsetAgeMonths > 0 ? ` ${daYunResult.onsetAgeMonths}m` : ''}
          </span>
        </div>
        {isHistorical ? (
          <div className="text-xs text-slate-600 italic">Historical — no active Da Yun</div>
        ) : (
          <div className="text-xs text-slate-500">+{DA_YUN_BUDGET} pts · Seasonality + Polarity</div>
        )}
      </div>

      {/* ── Pillar Timeline ── */}
      <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-700/30">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {daYunResult.pillars.map((p) => (
            <PillarBadge
              key={p.index}
              pillar={p}
              isSelected={
                selectedPillarIndex !== null
                  ? selectedPillarIndex === p.index
                  : p.isCurrent
              }
              onClick={() =>
                setSelectedPillarIndex(
                  selectedPillarIndex === p.index ? null : p.index
                )
              }
              currentYear={selectedYear}
            />
          ))}
        </div>
      </div>

      {/* ── Active Pillar Detail ── */}
      {activePillar && (
        <div className={`px-4 py-4 ${col.bg} border-b border-slate-700/30`}>
          <div className="flex items-start justify-between gap-4">
            {/* Left: pillar identity */}
            <div>
              <div className="flex items-center gap-3">
                <span className={`text-3xl font-bold ${col.text}`}>
                  {activePillar.stem}{activePillar.branch}
                </span>
                <div>
                  <div className="text-sm text-slate-300">
                    {activePillar.stemEnglish} {activePillar.branchAnimal}
                  </div>
                  <div className="text-xs text-slate-400">
                    Ages {activePillar.ageStart}–{activePillar.ageEnd}
                    {' · '}
                    {activePillar.yearStart}–{activePillar.yearEnd}
                  </div>
                </div>
                {activePillar.isCurrent && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
                    CURRENT
                  </span>
                )}
              </div>
              {activePillar.isCurrent && activePillar.yearsRemaining > 0 && (
                <div className="mt-1 text-xs text-amber-300/70">
                  {activePillar.yearsRemaining} year{activePillar.yearsRemaining !== 1 ? 's' : ''} remaining in this decade
                </div>
              )}
            </div>

            {/* Right: Qi contribution summary */}
            {qiContrib && (
              <div className="text-right text-xs text-slate-400 shrink-0">
                <div className={`font-semibold mb-0.5 ${isHistorical && !activePillar?.isCurrent ? 'text-slate-500' : 'text-slate-300'}`}>
                  {isHistorical && !activePillar?.isCurrent
                    ? '— preview (not yet active)'
                    : `+${DA_YUN_BUDGET} raw pts`}
                </div>
                {ELEMENT_KEYS.filter(k => qiContrib.qi[k] > 0.1).map(k => (
                  <div key={k} className={isHistorical && !activePillar?.isCurrent ? 'text-slate-600' : EL_COLORS[k]?.text}>
                    {k}: {qiContrib.qi[k].toFixed(2)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Narrative */}
          {narrative && (
            <p className="mt-3 text-xs text-slate-300 leading-relaxed border-t border-slate-700/40 pt-3">
              {narrative}
            </p>
          )}
        </div>
      )}

      {/* ── Qi Bars + Baby-Step Calculation ── */}
      {qiContrib && activePillar && (
        <div className="px-4 py-3 bg-slate-900/40 border-b border-slate-700/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Da Yun Qi — Scaled to NTFQ
            </span>
            <button
              onClick={() => setShowSteps(s => !s)}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showSteps ? '▲ hide calculation' : '▼ show calculation'}
            </button>
          </div>
          <div className="space-y-1.5">
            {ELEMENT_KEYS.map(k => (
              <QiBar key={k} element={k} pts={qiContrib.qi[k]} maxPts={maxQiPts} />
            ))}
            <div className="text-[9px] text-slate-600 font-mono mt-1">
              Raw total: {ELEMENT_KEYS.reduce((s, k) => s + qiContrib.qi[k], 0).toFixed(2)} pts (scaled to NTFQ in MTFQ blend)
            </div>
          </div>

          {/* Baby-step calculation detail */}
          {showSteps && (() => {
            const stemChar = activePillar.stem;
            const branchChar = activePillar.branch;
            const sEl = ((STEMS as any)[stemChar]?.element || 'Earth') as string;
            const stemEng = ((STEMS as any)[stemChar]?.english || stemChar) as string;
            const brAnimal = ((BRANCHES as any)[branchChar]?.animal || branchChar) as string;
            const hidden = ((HIDDEN_STEMS as any)[branchChar] || []) as { stem: string; pct: number; type: string }[];
            const stemPol = ((STEMS as any)[stemChar]?.polarity || 'Yang') as string;

            // Step 1: Raw Qi
            const rawQi: Record<string, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
            rawQi[sEl] += 1; // stem = 1pt
            hidden.forEach(hs => {
              const hsEl = ((STEMS as any)[hs.stem]?.element || 'Earth') as string;
              rawQi[hsEl] += 10 * (hs.pct / 100);
            });

            // Step 2: Seasonality (Da Yun's own branch)
            const sw = getSeasonalWeights(branchChar) as any;
            const seasonQi: Record<string, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
            ELEMENT_KEYS.forEach(k => {
              const mult = sw?.[k.toLowerCase()] ?? 1.0;
              seasonQi[k] = rawQi[k] * mult;
            });

            // Step 3: Polarity (Da Yun's own stem)
            const polMults = stemPol === 'Yang'
              ? { Wood: 1.15, Fire: 1.05, Earth: 1.00, Metal: 1.00, Water: 1.10 }
              : { Wood: 0.85, Fire: 0.95, Earth: 1.00, Metal: 1.00, Water: 0.90 };
            const polQi: Record<string, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
            ELEMENT_KEYS.forEach(k => {
              polQi[k] = seasonQi[k] * (polMults as any)[k];
            });

            // Step 4: Normalize to budget
            // polTotal removed — no normalization step

            // Shared max for all bars
            const allVals = [...Object.values(rawQi), ...Object.values(seasonQi), ...Object.values(polQi), ...ELEMENT_KEYS.map(k => qiContrib!.qi[k])];
            const barMax = Math.max(...allVals, 0.01);

            const MiniBar = ({ qi, max }: { qi: Record<string, number>; max: number }) => (
              <div className="space-y-0.5 mt-1">
                {ELEMENT_KEYS.map(k => {
                  const v = qi[k] || 0;
                  const c = EL_COLORS[k] || EL_COLORS.Earth;
                  return (
                    <div key={k} className="flex items-center gap-1.5">
                      <span className={`w-10 text-[9px] text-right ${c.text}`}>{k}</span>
                      <div className="flex-1 bg-slate-700/40 rounded-full h-1.5">
                        <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${(v / max) * 100}%` }} />
                      </div>
                      <span className="w-12 text-[9px] text-right text-slate-400">{v.toFixed(3)}</span>
                    </div>
                  );
                })}
              </div>
            );

            return (
              <div className="mt-3 rounded-lg bg-slate-950/60 border border-slate-700/30 p-3 text-xs font-mono space-y-3">
                {/* A. Stem */}
                <div>
                  <div className="text-slate-400 font-semibold">A. Da Yun Stem</div>
                  <div className="text-slate-500 mt-0.5">
                    Stem {stemChar} (<span className={EL_COLORS[sEl]?.text || 'text-white'}>{stemEng}</span>)
                    = <span className="text-white">1 pt</span> → {sEl}
                  </div>
                </div>

                {/* B. Branch Hidden Stems */}
                <div>
                  <div className="text-slate-400 font-semibold">B. Da Yun Branch Hidden Stems</div>
                  <div className="text-slate-500 mt-0.5 mb-1">
                    {branchChar} {brAnimal} = <span className="text-white">10 pts</span> distributed:
                  </div>
                  {hidden.map((hs, i) => {
                    const hsEl = ((STEMS as any)[hs.stem]?.element || 'Earth') as string;
                    const hsEng = ((STEMS as any)[hs.stem]?.english || hs.stem) as string;
                    const pts = 10 * (hs.pct / 100);
                    return (
                      <div key={i} className="text-slate-500">
                        <span className={EL_COLORS[hsEl]?.text || 'text-white'}>{hs.stem} {hsEng}</span>
                        {' '}{hs.pct}% → <span className="text-white">{pts.toFixed(3)} pts</span> → {hsEl}
                      </div>
                    );
                  })}
                </div>

                {/* Raw total */}
                <div>
                  <div className="text-slate-400 font-semibold">Raw Da Yun Qi (Stem + Branch)</div>
                  <MiniBar qi={rawQi} max={barMax} />
                </div>

                {/* C. Seasonality */}
                <div>
                  <div className="text-slate-400 font-semibold">C. Seasonality (Da Yun branch {branchChar} {brAnimal})</div>
                  <div className="rounded border border-slate-700/30 overflow-hidden mt-1 mb-1">
                    <table className="w-full text-[10px]">
                      <thead>
                        <tr className="bg-slate-800/50">
                          <th className="px-2 py-0.5 text-left text-slate-500">Element</th>
                          <th className="px-2 py-0.5 text-right text-slate-500">Raw</th>
                          <th className="px-2 py-0.5 text-center text-slate-500">×</th>
                          <th className="px-2 py-0.5 text-right text-slate-500">Seasoned</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ELEMENT_KEYS.map(k => {
                          const mult = sw?.[k.toLowerCase()] ?? 1.0;
                          return (
                            <tr key={k} className="border-t border-slate-700/20">
                              <td className={`px-2 py-0.5 ${EL_COLORS[k]?.text}`}>{k}</td>
                              <td className="px-2 py-0.5 text-right text-slate-400">{rawQi[k].toFixed(3)}</td>
                              <td className="px-2 py-0.5 text-center text-slate-500">{mult.toFixed(1)}</td>
                              <td className="px-2 py-0.5 text-right text-white">{seasonQi[k].toFixed(3)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <MiniBar qi={seasonQi} max={barMax} />
                </div>

                {/* D. Polarity */}
                <div>
                  <div className="text-slate-400 font-semibold">D. Polarity ({stemPol} stem {stemChar})</div>
                  <div className="rounded border border-slate-700/30 overflow-hidden mt-1 mb-1">
                    <table className="w-full text-[10px]">
                      <thead>
                        <tr className="bg-slate-800/50">
                          <th className="px-2 py-0.5 text-left text-slate-500">Element</th>
                          <th className="px-2 py-0.5 text-right text-slate-500">Seasoned</th>
                          <th className="px-2 py-0.5 text-center text-slate-500">×</th>
                          <th className="px-2 py-0.5 text-right text-slate-500">Polarized</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ELEMENT_KEYS.map(k => (
                          <tr key={k} className="border-t border-slate-700/20">
                            <td className={`px-2 py-0.5 ${EL_COLORS[k]?.text}`}>{k}</td>
                            <td className="px-2 py-0.5 text-right text-slate-400">{seasonQi[k].toFixed(3)}</td>
                            <td className="px-2 py-0.5 text-center text-slate-500">{(polMults as any)[k].toFixed(2)}</td>
                            <td className="px-2 py-0.5 text-right text-white">{polQi[k].toFixed(3)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <MiniBar qi={polQi} max={barMax} />
                </div>

                {/* Final = Polarity output → Scaled to NTFQ */}
                <div>
                  <div className="text-amber-300 font-semibold">Da Yun Qi = Polarity output (raw pts)</div>
                  <div className="text-slate-500 mt-0.5 text-[9px]">
                    Raw pts are scaled to match NTFQ total during MTFQ blending. Scale factor = NTFQ_total / DaYun_raw_total.
                    All layers get equal mass; weights (×0.9) determine Da Yun's influence share.
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── Pipeline Note ── */}
      <div className="px-4 py-2 bg-slate-900/20">
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <span className="text-slate-600">Stem(1pt) + Branch(10pt)</span>
          <span className="text-slate-600 mx-0.5">→</span>
          <span className="text-amber-400/80 font-semibold">Seasonality</span>
          <span className="text-slate-600 mx-0.5">→</span>
          <span className="text-amber-400/80 font-semibold">Polarity</span>
          <span className="text-slate-600 mx-0.5">→</span>
          <span className="text-emerald-400/80 font-semibold">Da Yun Qi (raw pts)</span>
        </div>
        <div className="text-[9px] text-slate-600 mt-0.5">
          External climate — no clashes, combinations, or transformations
        </div>
      </div>
    </div>
  );
}
