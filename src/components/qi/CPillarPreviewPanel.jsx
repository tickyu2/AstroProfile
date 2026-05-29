/**
 * C PILLAR PREVIEW PANEL
 *
 * Verification harness for the Happiness engine's C (Cognition) pillar.
 * Renders the 5 sub-scores + 5 clarity micros produced by scoreCognitionPillar()
 * for the current chart, alongside the diagnostic inputs.
 *
 * Pure preview — does NOT mutate happinessEngine state or persist anything.
 */

import React, { useMemo } from 'react';
import { scoreCognitionPillar, C_SUB_WEIGHTS, C_CLARITY_MICRO_WEIGHTS } from '../../utils/pillarScorerC';
import { toNormalizedWeights } from '../../utils/qiNormalization';

const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

const SUB_META = {
  clarity:    { label: 'Mental Clarity', desc: '5 micro-components composite' },
  memory:     { label: 'Memory',         desc: 'Mercury dignity + Moon-Mercury soft + BaZi Earth' },
  creativity: { label: 'Creativity',     desc: 'Mercury-Neptune/Venus soft + 5th house ruler' },
  learning:   { label: 'Learning Speed', desc: 'Jupiter dignity + BaZi Wood' },
  decision:   { label: 'Decision Making',desc: 'Mars dignity + Sun-Jupiter + Y/Y balance' },
};

const MICRO_META = {
  focus:        { label: 'Focus Stability',       inverse: false },
  organization: { label: 'Thought Organization',  inverse: false },
  fog:          { label: 'Cognitive Fog',         inverse: true  },
  processing:   { label: 'Processing Ease',       inverse: false },
  emotion:      { label: 'Emotional Interference',inverse: true  },
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

export default function CPillarPreviewPanel({
  userTfq,
  dmPolarity,
  profileWestern,
}) {
  const result = useMemo(() => {
    if (!userTfq || !dmPolarity) return null;
    try {
      const baziWeights = toNormalizedWeights(userTfq);
      const w = profileWestern || {};
      const planetLons = w.allPlanetLongitudes || {};

      const signs = {
        Sun: w.sunSign,
        Moon: w.moonSign,
        Mercury: w.mercurySign,
        Venus: w.venusSign,
        Mars: w.marsSign,
        Jupiter: w.jupiterSign,
        Saturn: w.saturnSign,
        Uranus: w.uranusSign,
        Neptune: w.neptuneSign,
        Pluto: w.plutoSign,
      };
      const longitudes = {
        Sun: w.sunLongitude ?? planetLons.Sun,
        Moon: w.moonLongitude ?? planetLons.Moon,
        Mercury: planetLons.Mercury,
        Venus: w.venusLongitude ?? planetLons.Venus,
        Mars: w.marsLongitude ?? planetLons.Mars,
        Jupiter: planetLons.Jupiter,
        Saturn: planetLons.Saturn,
        Uranus: planetLons.Uranus,
        Neptune: planetLons.Neptune,
        Pluto: planetLons.Pluto,
      };

      const scores = scoreCognitionPillar({
        baziWeights,
        signs,
        longitudes,
        houseCusps: w.houseCusps,
        dmPolarity,
      });
      return { scores, signs, longitudes, baziWeights };
    } catch (err) {
      console.error('C pillar scoring error:', err);
      return null;
    }
  }, [userTfq, dmPolarity, profileWestern]);

  if (!result) return null;

  const { scores, signs } = result;
  const totalPct = Math.round(scores.total * 100);

  return (
    <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-purple-200">🧠 C Pillar — Cognitive Performance (preview)</h3>
          <p className="text-[10px] text-purple-300/60 mt-0.5">
            Verification harness for happinessEngine.ts C pillar (not wired into the wheel yet).
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white font-mono">{totalPct}</div>
          <div className="text-[9px] text-purple-300/60 uppercase tracking-wide">C total / 100</div>
        </div>
      </div>

      {/* Top-level subs */}
      <div className="space-y-1.5">
        {Object.keys(SUB_META).map(key => {
          const s = scores[key];
          const meta = SUB_META[key];
          const weight = C_SUB_WEIGHTS[key];
          const reason = scores.reasoning[key];
          return (
            <div key={key} className="text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-32 text-right">
                  <span className="text-white/80 font-semibold">{meta.label}</span>
                  <span className="text-white/30 ml-1">({Math.round(weight * 100)}%)</span>
                </div>
                <ScoreBar score={s} />
                <div className="w-12 text-right font-mono text-white/80">{(s * 100).toFixed(0)}%</div>
              </div>
              <div className="ml-32 pl-2 text-[10px] text-white/40 font-mono">{reason}</div>
            </div>
          );
        })}
      </div>

      {/* Clarity micros — nested */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="text-[10px] text-purple-300/70 mb-2 ml-32 pl-2">↳ Mental Clarity breakdown:</div>
        <div className="space-y-1">
          {Object.keys(MICRO_META).map(key => {
            const raw = scores.micros[key];
            const meta = MICRO_META[key];
            const effective = meta.inverse ? (1 - raw) : raw;
            const microWeight = C_CLARITY_MICRO_WEIGHTS[key];
            return (
              <div key={key} className="text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="w-32 text-right">
                    <span className="text-white/60">{meta.label}</span>
                    <span className="text-white/30 ml-1">({Math.round(microWeight * 100)}%)</span>
                    {meta.inverse && <span className="text-white/30 ml-1">↻</span>}
                  </div>
                  <ScoreBar score={effective} />
                  <div className="w-16 text-right font-mono text-white/60">
                    {(raw * 100).toFixed(0)}{meta.inverse && ` → ${(effective * 100).toFixed(0)}`}%
                  </div>
                </div>
                <div className="ml-32 pl-2 text-[9px] text-white/30 font-mono">
                  {scores.microReasoning[key]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inputs trace */}
      <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-mono text-white/60">
        <div><span className="text-white/40">Mercury:</span> <span className="text-white">{signs.Mercury || '—'}</span></div>
        <div><span className="text-white/40">Jupiter:</span> <span className="text-white">{signs.Jupiter || '—'}</span></div>
        <div><span className="text-white/40">Mars:</span> <span className="text-white">{signs.Mars || '—'}</span></div>
        <div><span className="text-white/40">Saturn:</span> <span className="text-white">{signs.Saturn || '—'}</span></div>
        <div><span className="text-white/40">Neptune:</span> <span className="text-white">{signs.Neptune || '—'}</span></div>
        <div><span className="text-white/40">Venus:</span> <span className="text-white">{signs.Venus || '—'}</span></div>
        <div><span className="text-white/40">DM polarity:</span> <span className="text-white">{dmPolarity}</span></div>
        <div>
          <span className="text-white/40">BaZi (W/F/E/M/W):</span>{' '}
          {ELEMENTS.map(el => `${Math.round((result.baziWeights[el] || 0) * 100)}`).join('/')}
        </div>
      </div>
    </div>
  );
}
