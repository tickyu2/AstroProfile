/**
 * Q PILLAR PREVIEW PANEL
 *
 * Verification harness for the Happiness engine's Q (Qi Optimization) pillar.
 * Renders the 5 sub-scores produced by scoreQiPillar() for the current chart
 * so the math can be eyeballed against the visible TFQ table on the same page.
 *
 * Pure preview — does NOT mutate happinessEngine state or persist anything.
 */

import React, { useMemo } from 'react';
import { calculateSurvivalKit, detectCollapse } from '../../data/stoneDatabase';
import { getSeasonalWeights } from '../../utils/baziSeasonality';
import { scoreQiPillar, Q_SUB_WEIGHTS } from '../../utils/pillarScorerQ';

const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

/**
 * calculateSurvivalKit expects element values on a 0-100 percentage scale, not
 * raw TFQ points. Replicates the same conversion qiEngine does at line 1219.
 */
function tfqToPercent(tfq) {
  const total = ELEMENTS.reduce((s, el) => s + (tfq[el] || 0), 0);
  if (total <= 0) return { Wood: 20, Fire: 20, Earth: 20, Metal: 20, Water: 20 };
  const out = {};
  for (const el of ELEMENTS) out[el] = ((tfq[el] || 0) / total) * 100;
  return out;
}

const ELEM_COLORS = {
  Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#a1a1aa', Water: '#3b82f6',
};

const SUB_META = {
  flow:       { label: 'Flow',               desc: 'Structural alignment × balance' },
  coherence:  { label: 'Coherence',          desc: 'DM polarity ↔ Sun/Moon' },
  efficiency: { label: 'Efficiency',         desc: 'Distance from balanced' },
  balance:    { label: 'Element Balance',    desc: 'Shannon entropy' },
  seasonal:   { label: 'Seasonal Alignment', desc: 'DM in birth season' },
  vitality:   { label: 'Vitality',           desc: 'Full DM strength gauntlet' },
};

function ScoreBar({ score }) {
  const pct = Math.round(score * 100);
  const color =
    pct >= 70 ? '#22c55e' :
    pct >= 50 ? '#f59e0b' :
    pct >= 30 ? '#fb923c' : '#ef4444';
  return (
    <div className="flex-1 h-3 bg-white/5 rounded overflow-hidden relative">
      <div className="h-full" style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.75 }} />
    </div>
  );
}

export default function QPillarPreviewPanel({
  userTfq,
  dayStemChar,
  dmPolarity,
  dmElement,
  birthMonthBranch,
  dmStrengthScore,
  sunSign,
  moonSign,
}) {
  const result = useMemo(() => {
    if (!userTfq || !dayStemChar || !dmPolarity || !dmElement || !birthMonthBranch) {
      return null;
    }
    try {
      // Same pipeline qiEngine uses (qiEngine.ts:1219-1227): convert TFQ to %,
      // detect collapse, then run survival kit with collapse override active.
      const fqPct = tfqToPercent(userTfq);
      const collapseInfo = detectCollapse(fqPct);
      const yongShen = calculateSurvivalKit(fqPct, dayStemChar, 4, collapseInfo);
      const sw = getSeasonalWeights(birthMonthBranch);
      const seasonalDMWeight = sw ? (sw[dmElement.toLowerCase()] ?? 1.0) : 1.0;

      const scores = scoreQiPillar({
        tfq: userTfq,
        usefulElements: yongShen.usefulElements || [],
        annoyingElements: yongShen.forbidden || [],
        dmPolarity,
        seasonalDMWeight,
        dmStrengthScore: dmStrengthScore ?? 50,
        westernSunSign: sunSign,
        westernMoonSign: moonSign,
      });
      return { scores, yongShen, seasonalDMWeight };
    } catch (err) {
      console.error('Q pillar scoring error:', err);
      return null;
    }
  }, [userTfq, dayStemChar, dmPolarity, dmElement, birthMonthBranch, dmStrengthScore, sunSign, moonSign]);

  if (!result) return null;

  const { scores, yongShen, seasonalDMWeight } = result;
  const totalPct = Math.round(scores.total * 100);

  return (
    <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-blue-200">🌀 Q Pillar — Qi Optimization Score (preview)</h3>
          <p className="text-[10px] text-blue-300/60 mt-0.5">
            Verification harness for happinessEngine.ts Q pillar (not wired into the wheel yet).
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white font-mono">{totalPct}</div>
          <div className="text-[9px] text-blue-300/60 uppercase tracking-wide">Q total / 100</div>
        </div>
      </div>

      {/* Sub-score bars */}
      <div className="space-y-1.5">
        {Object.keys(SUB_META).map(key => {
          const s = scores[key];
          const meta = SUB_META[key];
          const weight = Q_SUB_WEIGHTS[key];
          const reason = scores.reasoning[key];
          return (
            <div key={key} className="text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-28 text-right">
                  <span className="text-white/80 font-semibold">{meta.label}</span>
                  <span className="text-white/30 ml-1">({Math.round(weight * 100)}%)</span>
                </div>
                <ScoreBar score={s} />
                <div className="w-12 text-right font-mono text-white/80">{(s * 100).toFixed(0)}%</div>
              </div>
              <div className="ml-28 pl-2 text-[10px] text-white/40 font-mono">{reason}</div>
            </div>
          );
        })}
      </div>

      {/* Inputs trace */}
      <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-mono text-white/60">
        <div>
          <span className="text-white/40">Useful:</span>{' '}
          {(yongShen.usefulElements || []).map(el => (
            <span key={el} style={{ color: ELEM_COLORS[el] }} className="font-semibold mr-1">{el}</span>
          ))}
          {(yongShen.usefulElements || []).length === 0 && <span className="text-white/30">—</span>}
        </div>
        <div>
          <span className="text-white/40">Forbidden:</span>{' '}
          {(yongShen.forbidden || []).map(el => (
            <span key={el} style={{ color: ELEM_COLORS[el] }} className="font-semibold mr-1">{el}</span>
          ))}
          {(yongShen.forbidden || []).length === 0 && <span className="text-white/30">—</span>}
        </div>
        <div>
          <span className="text-white/40">DM polarity:</span>{' '}
          <span className="text-white">{dmPolarity}</span>{' '}
          <span style={{ color: ELEM_COLORS[dmElement] }} className="font-semibold">{dmElement}</span>
        </div>
        <div>
          <span className="text-white/40">DM seasonal weight:</span>{' '}
          <span className="text-white">{seasonalDMWeight.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-white/40">Sun sign:</span>{' '}
          <span className="text-white">{sunSign || <span className="text-white/30">—</span>}</span>
        </div>
        <div>
          <span className="text-white/40">Moon sign:</span>{' '}
          <span className="text-white">{moonSign || <span className="text-white/30">—</span>}</span>
        </div>
      </div>
    </div>
  );
}
