/**
 * BraceletDashboard — Full bracelet analysis panel with preview,
 * quality score, comparison, goal recommendations, and stone effectiveness.
 *
 * Designed to be embedded inside QiBraceletPage's monthly expanded view.
 * Positioned at TOP of month card for full width.
 */

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  designBracelet,
  scoreBracelet,
  scoreAllStones,
  compareBracelets,
  findSubstitutes,
  recommendBraceletForGoal,
  simulateRadarShift,
  getRepairSuggestion,
  GOAL_DESCRIPTIONS,
  GENERATES,
  CONTROLLED_BY,
  STONE_DATABASE,
  MONTHLY_MULTIPLIERS,
} from '../../data/stoneDatabase';
import EngineeredBraceletVisualizer, { CollapseDiagnosisPanel } from '../qi/EngineeredBraceletVisualizer';
import StoneEncyclopedia from '../qi/StoneEncyclopedia';
import FloatingMdWindow from '../shared/FloatingMdWindow';
import { PentagonRadar, QiBar } from '../qi/PentagonRadar';

// ============================================================================
// CONSTANTS
// ============================================================================

const ELEM_COLORS = {
  Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#a1a1aa', Water: '#3b82f6',
};

const GOALS = [
  { key: 'stability', label: 'Stability' },
  { key: 'creativity', label: 'Creativity' },
  { key: 'wealth', label: 'Wealth' },
  { key: 'protection', label: 'Protection' },
  { key: 'clarity', label: 'Clarity' },
  { key: 'emotionalHealing', label: 'Emotional Healing' },
  { key: 'careerGrowth', label: 'Career Growth' },
  { key: 'health', label: 'Health' },
];

/** Two-letter abbreviation that disambiguates Wood (Wd) from Water (Wa) */
function elAbbr(el) {
  if (el === 'Wood')  return 'Wd';
  if (el === 'Water') return 'Wa';
  return el[0];
}

const GRADE_COLORS = {
  S: 'text-yellow-300 bg-yellow-900/40 border-yellow-500/50',
  A: 'text-green-300 bg-green-900/40 border-green-500/50',
  B: 'text-blue-300 bg-blue-900/40 border-blue-500/50',
  C: 'text-orange-300 bg-orange-900/40 border-orange-500/50',
  D: 'text-red-300 bg-red-900/40 border-red-500/50',
  F: 'text-red-500 bg-red-900/60 border-red-500/70',
};

// ============================================================================
// BRACELET PREVIEW — Circular bead ring (SVG)
// ============================================================================

function BraceletPreview({ visualBeads, size = 280 }) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 24;
  const beadScale = size > 240 ? 0.85 : 0.7;

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Wrist circle */}
      <circle cx={cx} cy={cy} r={radius - 10} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
      {visualBeads.map((bead, i) => {
        const angle = (bead.angleDeg - 90) * (Math.PI / 180);
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        const r = bead.sizeMm * beadScale;

        return (
          <g key={bead.id}>
            <circle
              cx={x} cy={y} r={r}
              fill={bead.color}
              stroke={bead.polarity === 'Yang' ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'}
              strokeWidth={1.2}
            />
            {/* Sheng arrow to next bead */}
            {i < visualBeads.length - 1 && GENERATES[bead.element] === visualBeads[i + 1]?.element && (
              <line
                x1={x} y1={y}
                x2={cx + radius * Math.cos(((visualBeads[i + 1].angleDeg - 90) * Math.PI) / 180)}
                y2={cy + radius * Math.sin(((visualBeads[i + 1].angleDeg - 90) * Math.PI) / 180)}
                stroke="rgba(34,197,94,0.15)" strokeWidth={0.5}
              />
            )}
            <title>{`${bead.stone.name} (${bead.element}, ${bead.polarity})`}</title>
          </g>
        );
      })}
      {/* Center label */}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={12}>
        {visualBeads.length} beads
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={9}>
        Sheng cycle
      </text>
    </svg>
  );
}

// ============================================================================
// QUALITY SCORE CARD
// ============================================================================

const ELEM_ORDER = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

// ── Yong Shen floating guide content ────────────────────────────────────────
const YONG_SHEN_GUIDE_MD = `# 🌿 用神 Yong Shen — The Useful God
### The element your chart needs to breathe

Yong Shen (用神) is the **single most important element** in your BaZi chart.

It is the **remedy**, the **stabilizer**, the **balancing force** — the Qi that
restores correct flow when your chart is out of balance.

> If BaZi were medicine, Yong Shen is the prescription.
> If BaZi were engineering, Yong Shen is the load-bearing beam.
> If BaZi were Qi mechanics, Yong Shen is the element that makes the system run.

---

## 🌗 Why Yong Shen Exists

A BaZi chart is rarely balanced. Most charts have:

- Too much of one element (dominance)
- Too little of another (deficiency)
- A broken generating cycle
- A collapsed structure
- A Day Master too strong or too weak
- A season distorting the field

Yong Shen is the **one element** that corrects the structural problem.

---

## 🌑 How Yong Shen Is Determined

Yong Shen is chosen by analyzing:

1. **Day Master strength** — Strong? Weak? Over-strong? Over-weak?
2. **Seasonal influence** — 旺/相/休/囚/死 (Prospering / Supported / Resting / Imprisoned / Dead)
3. **Structure type** — Normal, Follow, Inverted, Single-Dominant, Bi-Polar, Drained
4. **Elemental distribution** — Which element is excessive? Which is missing?
5. **Control & support cycles** — 生 (generate) / 克 (control) / 泄 (drain)
6. **DaYun decade context** — The 10-year wind that can flip the entire structure

---

## 🌒 What Yong Shen Is NOT

- It is **not** your Day Master element
- It is **not** your favorite or "lucky" element
- It is **not** fixed forever — the decade cycle can change it
- It is **not** the element you feel drawn to

> Yong Shen is the element your chart **needs**, not the one you prefer.

---

## 🔮 How Yong Shen Shapes Your Bracelet

| What it controls | How |
|---|---|
| Allowed stones | Must support or be Yong Shen |
| Forbidden stones | Elements that harm Yong Shen are blocked |
| Bead counts | Higher allocation to Yong Shen element |
| Stone polarity | Must match the balancing polarity of the DM |
| Controller stones | May use Yong Shen to control excess element |
| Substitute ranking | Closer to Yong Shen = higher rank |

---

## 🌕 Alignment Score (0–30 pts)

The bracelet is scored on how many of its beads carry the Yong Shen element
(or elements that directly support it).

| Alignment | Score |
|---|---|
| Balanced chart (no prescription) | 28 pts |
| ≥ 80% of beads on Yong Shen | 30 pts |
| ≥ 60% | 25 pts |
| ≥ 40% | 18 pts |
| < 40% | 10 pts |

A high alignment score means your bracelet is directly addressing the core
structural imbalance of your chart.

---

## 🌗 Yong Shen and Da Yun (大運)

Every 10-year luck pillar can:

- Strengthen or weaken your Day Master
- Shift the dominant element
- Change which element is excessive
- Flip the structure type (e.g. Normal → Follow)
- Change the remedy element

This is why your Yong Shen is **recalculated each decade** — and why your
bracelet changes with the years.

---

> **The essence of Yong Shen:**
> It is the element that restores your chart's natural Qi flow.
> Without it, the system collapses.
> It is the medicine, the remedy, the useful god.
`;

function YongShenFlap({ ys }) {
  if (!ys) return null;
  const [showGuide, setShowGuide] = React.useState(false);
  const [showSequence, setShowSequence] = React.useState(false);

  const { usefulElements, forbiddenElements, totalBeads, usefulBeadCount,
          usefulBeadPct, isBalancedChart, perElement, sequence = [] } = ys;
  const pct = (usefulBeadPct * 100).toFixed(1);

  const threshold =
    isBalancedChart        ? { score: 28, label: 'Balanced chart (all elements)', color: 'text-green-400' } :
    usefulBeadPct >= 0.8   ? { score: 30, label: 'Excellent alignment (≥80%)',   color: 'text-green-400' } :
    usefulBeadPct >= 0.6   ? { score: 25, label: 'Good alignment (≥60%)',        color: 'text-teal-400'  } :
    usefulBeadPct >= 0.4   ? { score: 18, label: 'Partial alignment (≥40%)',     color: 'text-amber-400' } :
                             { score: 10, label: 'Low alignment (<40%)',          color: 'text-red-400'   };

  // Neutral = not useful AND not forbidden
  const neutralElements = ELEM_ORDER.filter(
    el => !usefulElements.includes(el) && !forbiddenElements.includes(el)
  );

  return (
    <>
      {showGuide && (
        <FloatingMdWindow
          content={YONG_SHEN_GUIDE_MD}
          title="🌿 用神 Yong Shen — The Useful God"
          onClose={() => setShowGuide(false)}
          width={660}
        />
      )}

      <div className="mt-1.5 rounded-lg bg-slate-900/70 border border-slate-700/50 p-3 space-y-2 text-[11px]">

        {/* Header row: prescription tags + guide button */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1">
            {/* Useful elements */}
            <div className="flex flex-wrap gap-1 items-center">
              <span className="text-white/40 shrink-0 w-16">Useful:</span>
              {isBalancedChart ? (
                <span className="text-white/50 italic">Balanced chart — no prescription</span>
              ) : usefulElements.length > 0 ? (
                usefulElements.map(el => (
                  <span key={el} className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                    style={{ backgroundColor: ELEM_COLORS[el] + '33', color: ELEM_COLORS[el] }}>
                    ✓ {el}
                  </span>
                ))
              ) : (
                <span className="text-white/40 italic">none specified</span>
              )}
            </div>
            {/* Forbidden */}
            {forbiddenElements.length > 0 && (
              <div className="flex flex-wrap gap-1 items-center">
                <span className="text-white/40 shrink-0 w-16">Forbidden:</span>
                {forbiddenElements.map(el => (
                  <span key={el} className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-900/30 text-red-400">
                    ✗ {el}
                  </span>
                ))}
              </div>
            )}
            {/* Neutral */}
            {neutralElements.length > 0 && (
              <div className="flex flex-wrap gap-1 items-center">
                <span className="text-white/40 shrink-0 w-16">Neutral:</span>
                {neutralElements.map(el => (
                  <span key={el} className="px-1.5 py-0.5 rounded text-[10px] text-white/30 border border-white/10">
                    {el}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowGuide(v => !v)}
            className="shrink-0 text-[10px] px-2 py-1 rounded border border-amber-400/30 text-amber-300/70 hover:text-amber-200 hover:bg-amber-500/10 transition-colors"
          >
            📖 What is Yong Shen?
          </button>
        </div>

        {/* Per-element bead count grid */}
        <div className="grid grid-cols-5 gap-1.5">
          {ELEM_ORDER.map(el => {
            const count = perElement[el] || 0;
            const isUseful = usefulElements.includes(el);
            const isForbidden = forbiddenElements.includes(el);
            return (
              <div key={el} className={`rounded-lg p-1.5 text-center border ${
                isForbidden ? 'border-red-500/30 bg-red-900/20'
                : isUseful  ? 'border-teal-500/30 bg-teal-900/20'
                : 'border-white/5 bg-white/3'
              }`}>
                <div className="text-sm font-bold" style={{ color: ELEM_COLORS[el] }}>{count}</div>
                <div className="text-[9px] text-white/35">{el.slice(0, 2)}</div>
                {isForbidden && <div className="text-[8px] text-red-400">✗ forbid</div>}
                {isUseful    && <div className="text-[8px] text-teal-400">✓ useful</div>}
                {!isForbidden && !isUseful && <div className="text-[8px] text-white/20">neutral</div>}
              </div>
            );
          })}
        </div>

        {/* Calculation trace */}
        {!isBalancedChart && (
          <div className="font-mono bg-black/20 rounded p-2 space-y-0.5 text-white/50">
            <div className="text-white/30 text-[10px] mb-1">Alignment calculation:</div>
            <div>
              Useful beads (✓) = {usefulElements.map(el => `${perElement[el] || 0} ${el}`).join(' + ')}
              {' = '}
              <span className="text-teal-300 font-semibold">{usefulBeadCount}</span>
            </div>
            <div>
              Total beads = <span className="text-white/70">{totalBeads}</span>
            </div>
            <div className="border-t border-white/10 pt-0.5 mt-0.5">
              Alignment = {usefulBeadCount} ÷ {totalBeads} = <span className="text-white/80 font-semibold">{pct}%</span>
            </div>
          </div>
        )}

        {/* Score band */}
        <div className={`flex items-center justify-between rounded-md bg-white/5 px-2 py-1 ${threshold.color}`}>
          <span>{threshold.label}</span>
          <span className="font-bold">{threshold.score}/30</span>
        </div>

        {/* Visual bar */}
        {!isBalancedChart && (
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-0.5">
              <span>0%</span><span>40%</span><span>60%</span><span>80%</span><span>100%</span>
            </div>
            <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
              <div className="absolute top-0 bottom-0 w-px bg-red-500/40"    style={{ left: '40%' }} />
              <div className="absolute top-0 bottom-0 w-px bg-amber-500/40"  style={{ left: '60%' }} />
              <div className="absolute top-0 bottom-0 w-px bg-green-500/40"  style={{ left: '80%' }} />
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-600 to-teal-400 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        {/* Sequential bead list */}
        {sequence.length > 0 && (
          <div>
            <button
              onClick={() => setShowSequence(v => !v)}
              className="w-full flex items-center justify-between text-[10px] text-white/40 hover:text-white/60 transition-colors py-0.5"
            >
              <span>Stone selection order ({sequence.length} beads)</span>
              <span>{showSequence ? '▲ hide' : '▼ show'}</span>
            </button>
            {showSequence && (
              <div className="mt-1.5 max-h-48 overflow-y-auto rounded border border-white/10 bg-black/20">
                <div className="grid grid-cols-1 divide-y divide-white/5">
                  {sequence.map(b => (
                    <div
                      key={b.pos}
                      className={`flex items-center gap-2 px-2 py-1 text-[10px] ${
                        b.isForbidden ? 'bg-red-900/20'
                        : b.isUseful  ? 'bg-teal-900/10'
                        : b.isBridge  ? 'bg-amber-900/10'
                        : ''
                      }`}
                    >
                      <span className="text-white/25 w-5 text-right shrink-0">#{b.pos}</span>
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: ELEM_COLORS[b.element] || '#888' }}
                      />
                      <span className="flex-1 text-white/70 truncate">{b.name}</span>
                      <span className="text-white/25 shrink-0">{b.element.slice(0, 2)}</span>
                      <span className={`shrink-0 text-[9px] ${
                        b.isForbidden ? 'text-red-400' :
                        b.isUseful    ? 'text-teal-400' :
                        b.isBridge    ? 'text-amber-400/60' :
                        'text-white/20'
                      }`}>
                        {b.isForbidden ? '✗' : b.isUseful ? '✓' : b.isBridge ? '⬡' : '·'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function PolarityFlap({ pd }) {
  if (!pd) return null;
  const { yangCount, yinCount, yinYangCount, effectiveYang, effectiveYin,
          polarityRatio, totalBeads, dmPolarity, balancingPolarity } = pd;
  const pct = (polarityRatio * 100).toFixed(1);
  const threshold =
    polarityRatio >= 0.8 ? { score: 20, label: 'Well-balanced (≥80%)', color: 'text-green-400' } :
    polarityRatio >= 0.6 ? { score: 15, label: 'Good balance (≥60%)', color: 'text-teal-400' } :
    polarityRatio >= 0.4 ? { score: 8,  label: 'Imbalanced (≥40%)',   color: 'text-amber-400' } :
    polarityRatio >= 0.25 ? { score: 3, label: 'Severe (≥25%)',        color: 'text-orange-400' } :
                            { score: 0, label: 'Extreme (<25%)',         color: 'text-red-400' };

  return (
    <div className="mt-1.5 rounded-lg bg-slate-900/70 border border-slate-700/50 p-3 space-y-2 text-[11px]">
      {/* DM context */}
      <div className="flex gap-4 text-white/50">
        <span>Day Master: <span className="text-white/80 font-semibold">{dmPolarity}</span></span>
        <span>Bracelet should favour: <span className="text-amber-300 font-semibold">{balancingPolarity}</span></span>
      </div>

      {/* Bead counts */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Yang beads', count: yangCount, color: 'text-orange-300' },
          { label: 'Yin beads',  count: yinCount,  color: 'text-blue-300'   },
          { label: 'Yin-Yang',   count: yinYangCount, color: 'text-purple-300' },
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-white/5 rounded-lg p-2 text-center">
            <div className={`text-base font-bold ${color}`}>{count}</div>
            <div className="text-white/40 text-[10px]">{label}</div>
          </div>
        ))}
      </div>

      {/* Effective ratio calculation */}
      <div className="font-mono text-white/50 space-y-0.5">
        <div>Effective Yang = {yangCount} + {yinYangCount}×0.5 = <span className="text-orange-300">{effectiveYang.toFixed(1)}</span></div>
        <div>Effective Yin  = {yinCount} + {yinYangCount}×0.5 = <span className="text-blue-300">{effectiveYin.toFixed(1)}</span></div>
        <div>Ratio = min({effectiveYang.toFixed(1)}, {effectiveYin.toFixed(1)}) ÷ max = <span className="text-white/80 font-semibold">{pct}%</span></div>
      </div>

      {/* Score band */}
      <div className={`flex items-center justify-between rounded-md bg-white/5 px-2 py-1 ${threshold.color}`}>
        <span>{threshold.label}</span>
        <span className="font-bold">{threshold.score}/20</span>
      </div>

      {/* Visual bar */}
      <div>
        <div className="flex justify-between text-[10px] text-white/30 mb-0.5">
          <span>0%</span><span>60%</span><span>80%</span><span>100%</span>
        </div>
        <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
          {/* threshold markers */}
          <div className="absolute top-0 bottom-0 w-px bg-amber-500/40" style={{ left: '60%' }} />
          <div className="absolute top-0 bottom-0 w-px bg-green-500/40"  style={{ left: '80%' }} />
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-600 to-teal-400 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CONTROLLER STONE PANEL
// ============================================================================

const CONTROLLER_STONE_GUIDE_MD = `# 🌕 調候石 Controller Stone
### The Qi Valve of the Decade

The Controller Stone is a **single, precisely placed bead** in your bracelet.

Its purpose is to **regulate the dominant element of your current 大運 Da Yun decade** —
preventing excess, preventing collapse, and keeping the Qi loop stable.

> If the bracelet were a river, the Controller Stone is the sluice gate.
> If it were a body, it is the liver valve.
> One stone. Precisely placed. Metaphysically critical.

---

## 🌑 Controller Stone vs. Anchor Stone (命門 Mingmen)

These are two completely different metaphysical organs in your bracelet:

| | Anchor Stone (命門) | Controller Stone (調候石) |
|---|---|---|
| Position | Always Bead 1 | Dynamic — changes by decade |
| Purpose | Root of Qi flow | Regulates dominant element |
| Basis | Your Yong Shen / birth gate | Da Yun dominant element |
| Fixed? | Yes — always at start | No — placed by decade logic |
| Function | Heart Gate | Liver Valve |

**If you placed the controller stone at Bead 1**, you would:
- Distort the Sheng cycle
- Break the anchor logic
- Override the wearer's Mingmen
- Collapse the polarity alternation
- Misalign the decade's regulation point

They must be **separate stones with separate placements**.

---

## 🌗 Why Only One Controller Stone?

- Too many controller stones → over-regulation → collapse
- Too few → insufficient regulation
- **One is the classical standard**
- One is the metaphysical valve
- One keeps the bracelet stable without overpowering the flow

---

## 🌒 The Controlling Cycle (克 Ke Cycle)

The 克 (Ke) cycle defines which element controls which:

\`\`\`
Wood   → controls → Earth
Earth  → controls → Water
Water  → controls → Fire
Fire   → controls → Metal
Metal  → controls → Wood
\`\`\`

When your decade is dominated by, say, **Fire** — the controller element is **Water**
(Water controls Fire in the 克 cycle).

---

## 🌕 How the DaYun-Aware Placement Engine Works

The engine computes five things:

### 1. Decade Dominant Element
From the Da Yun Qi vector — whichever element carries the most Qi in the decade.

### 2. Controller Element
Using the 克 cycle: the element that controls the decade dominant.

### 3. Controller Stone Selection
From available stones of the controller element, ranked by:
- Polarity match (balancing polarity scores highest)
- Yin-Yang adaptable stones (bonus)
- Base Qi strength

### 4. Optimal Placement Index
The engine finds the longest run of the dominant element in the Sheng cycle
sequence, then places the controller stone **just before** it — to prevent overflow
before the peak rather than catching collapse after it.

### 5. Sheng Cycle Smoothing
The insertion is tested at ±1 positions. The position that minimizes
**Sheng cycle breaks** is chosen — so the bracelet's generative flow
is disrupted as little as possible.

---

## 🌑 Polarity Safety

The controller stone must **not break the Yin/Yang alternation** of the bracelet.

If both neighbors share the same polarity as the controller stone,
the engine shifts the insertion point left or right to find a polarity-safe slot.

Yin-Yang stones are always safe (they adapt to either neighbour).

---

## 🌕 Loop Closure

The bracelet is a **closed loop** — Bead 21 connects back to Bead 1.
The controller placement engine validates that the loop closure remains
smooth (no hard elemental break at the boundary).

---

## 🌗 Why Placement Changes by Decade

Imagine your decade is Fire-dominant.
Your controller element is Water.

- If **Fire peaks early** in the decade's Qi cycle →
  controller stone goes **early** in the bracelet.
- If **Fire peaks late** →
  controller stone goes **later** in the bracelet.

The decade shapes the Qi topology of the bracelet.
The controller stone must match that topology.

---

> **The essence of the Controller Stone:**
> It is not a remedy.
> It is not your Yong Shen.
> It is the regulator — the single stone that prevents the decade
> from pushing your Qi field into excess or collapse.
> Placed correctly, it keeps everything flowing.
`;

/** Count Sheng-cycle breaks in a sequence of BraceletBead objects */
function countShengBreaks(sequence) {
  if (!sequence || sequence.length < 2) return 0;
  let breaks = 0;
  for (let i = 0; i < sequence.length; i++) {
    const a = sequence[i].stone?.element;
    const b = sequence[(i + 1) % sequence.length].stone?.element;
    if (a && b && GENERATES[a] !== b) breaks++;
  }
  return breaks;
}

function ControllerStonePanel({ daYunQi, bracelet, engineeredBracelet }) {
  const [showGuide, setShowGuide] = React.useState(false);

  const seq = bracelet?.sequence || [];
  const engBeads = engineeredBracelet?.beads || [];
  const hasSeq = seq.length > 0 || engBeads.length > 0;
  if (!hasSeq) return null;

  const refBeads = engBeads.length > 0 ? engBeads : seq;
  const shengBreaks = countShengBreaks(refBeads);

  // When no Da Yun is active, show a minimal "awaiting Da Yun" state
  if (!daYunQi) {
    return (
      <div className="mt-4 rounded-xl bg-slate-900/70 border border-slate-700/50 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 bg-slate-800/50 border-b border-slate-700/30">
          <span className="flex flex-col leading-tight">
            <span className="text-xs font-semibold text-amber-300">Controller Stone</span>
            <span className="text-[9px] text-amber-400/50">調候石</span>
          </span>
          <button onClick={() => setShowGuide(true)} className="text-[10px] text-teal-400/70 hover:text-teal-300 transition-colors px-2 py-0.5 rounded hover:bg-white/5">
            📖 Guide
          </button>
        </div>
        <div className="px-3 py-3 text-[11px] text-white/30 italic">
          No active Da Yun for this period — controller placement requires a decade pillar.
        </div>
        <div className="px-3 pb-2 text-[11px] text-white/40">
          Sheng breaks (current bracelet): <span className={`font-bold ${shengBreaks === 0 ? 'text-green-400' : shengBreaks <= 3 ? 'text-amber-400' : 'text-red-400'}`}>{shengBreaks}</span> of {refBeads.length} links
        </div>
        {showGuide && <FloatingMdWindow content={CONTROLLER_STONE_GUIDE_MD} title="調候石 Controller Stone — Placement Guide" onClose={() => setShowGuide(false)} width={560} />}
      </div>
    );
  }

  // 1. Decade dominant
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const decadeDominant = elements.reduce(
    (best, el) => (daYunQi[el] || 0) > (daYunQi[best] || 0) ? el : best,
    elements[0],
  );

  // 2. Controller element (克 cycle)
  const controllerEl = CONTROLLED_BY[decadeDominant];

  // 3. Use engine-selected controller if available, else search bracelet
  const engineIdx = engineeredBracelet?.controllerIndex;
  const engineControllerBead = engineIdx != null ? engBeads[engineIdx] : null;

  // Fallback: search bracelet sequence for any bead of the controller element
  const fallbackBead = !engineControllerBead
    ? (refBeads.find(b => (b.stone?.element || b.element) === controllerEl) || null)
    : null;

  const controllerBead = engineControllerBead || fallbackBead;
  const controllerIndex = engineIdx != null
    ? engineIdx
    : (fallbackBead ? refBeads.indexOf(fallbackBead) : null);

  const isEngineSelected = engineControllerBead != null;

  const colEl = ELEM_COLORS[controllerEl] || '#94a3b8';
  const domEl = ELEM_COLORS[decadeDominant] || '#94a3b8';

  // Flags
  const anchorConflict = controllerIndex === 0;
  const isForbidden = (engineeredBracelet?.collapse?.forbidden || []).includes(controllerEl);

  return (
    <div className="mt-4 rounded-xl bg-slate-900/70 border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-800/50 border-b border-slate-700/30">
        <div className="flex items-center gap-2">
          <span className="flex items-baseline gap-2">
            <span className="text-xs font-semibold text-amber-300">Controller Stone</span>
            <span className="text-[11px] text-amber-300/70">調候石</span>
          </span>
          {isEngineSelected && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold">
              ACTIVE
            </span>
          )}
        </div>
        <button
          onClick={() => setShowGuide(true)}
          className="text-[10px] text-teal-400/70 hover:text-teal-300 transition-colors px-2 py-0.5 rounded hover:bg-white/5"
        >
          📖 Guide
        </button>
      </div>

      {/* Anchor conflict warning */}
      {anchorConflict && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-red-900/40 border border-red-500/40 text-[11px] text-red-300">
          <span className="font-semibold">⚠ Anchor conflict:</span> Controller stone is at Bead 1 (命門 Mingmen).
        </div>
      )}

      {/* Controller Stone Skipped — badge + eligibility meter + expandable Why panel */}
      {(() => {
        // Eligibility: 0=forbidden, 1=risky (controller weak but not banned), 2=safe
        const eligibility = isForbidden ? 0 : (!controllerBead ? 1 : 2);
        const eligibilityPct = (eligibility / 2) * 100;
        const eligibilityColor = eligibility === 2 ? 'bg-green-500' : eligibility === 1 ? 'bg-yellow-500' : 'bg-red-500';
        const eligibilityText = eligibility === 2 ? 'Safe to insert controller stone' : eligibility === 1 ? 'Risky — controller element weak this month' : 'Forbidden — controller stone skipped';
        const forbiddenList = engineeredBracelet?.collapse?.forbidden || [];
        const recommendedList = elements.filter(el => !forbiddenList.includes(el));

        return (
          <div className="mx-3 mt-3 space-y-2">
            {/* Badge */}
            {isForbidden && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-900/40 border border-red-600/50 text-red-200 text-xs font-semibold">
                <span>Controller Stone Skipped</span>
                <span className="text-[9px] font-normal text-red-300/60">從旺格 Follow Structure</span>
              </div>
            )}

            {/* Eligibility Meter */}
            <div className="rounded-lg bg-black/30 border border-gray-700/50 p-3">
              <div className="text-[10px] font-semibold text-gray-400 mb-1.5">Controller Stone Eligibility</div>
              <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${eligibilityColor}`}
                  style={{ width: `${Math.max(eligibilityPct, 4)}%` }}
                />
              </div>
              <div className="mt-1 text-[10px] text-gray-400">{eligibilityText}</div>

              {/* Allowed / Forbidden indicators */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {elements.map(el => {
                  const elIsForbidden = forbiddenList.includes(el);
                  const isController = el === controllerEl;
                  return (
                    <span key={el} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono border ${
                      elIsForbidden
                        ? 'bg-red-900/30 border-red-600/40 text-red-300'
                        : 'bg-green-900/20 border-green-600/30 text-green-300'
                    } ${isController ? 'ring-1 ring-amber-400/50' : ''}`}>
                      <span>{elIsForbidden ? '\u2717' : '\u2713'}</span>
                      <span style={{ color: ELEM_COLORS[el] }}>{el}</span>
                      {isController && <span className="text-amber-400/70 text-[8px]">ctrl</span>}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Why Skipped? expandable */}
            {isForbidden && (
              <details className="group rounded-lg bg-black/30 border border-gray-700/50 overflow-hidden">
                <summary className="cursor-pointer px-3 py-2 text-[11px] text-gray-300 font-medium flex items-center justify-between hover:bg-white/5 transition-colors">
                  <span>Why was the controller stone skipped?</span>
                  <span className="text-gray-500 group-open:rotate-90 transition-transform">▸</span>
                </summary>
                <div className="px-3 pb-3 pt-1 space-y-3">
                  <div className="text-[11px] text-gray-400 leading-relaxed space-y-1.5">
                    <div>The controller element for this decade is <span className="font-semibold" style={{ color: colEl }}>{controllerEl}</span>, but it is <span className="text-red-400 font-semibold">forbidden</span> this month.</div>
                    <div>In a {decadeDominant}-dominant collapse (從旺格), {controllerEl} cannot control {decadeDominant} — it would be overwhelmed and damage the Qi circuit.</div>
                    <div>The bracelet follows the dominant instead, using elements that harmonize with {decadeDominant}.</div>
                  </div>

                  {/* Animated decision flowchart */}
                  <div className="rounded-lg bg-black/40 border border-gray-700/40 p-3">
                    <div className="text-[10px] font-semibold text-gray-400 mb-3">Controller Stone Decision Flow</div>
                    <div className="text-[10px] text-gray-300 space-y-1">

                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-4">1.</span>
                        <span>Decade dominant</span>
                        <span className="text-gray-600">→</span>
                        <span className="font-semibold" style={{ color: domEl }}>{decadeDominant}</span>
                      </div>
                      <div className="text-center text-gray-600 animate-pulse text-sm">↓</div>

                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-4">2.</span>
                        <span>Controller (克 cycle)</span>
                        <span className="text-gray-600">→</span>
                        <span className="font-semibold" style={{ color: colEl }}>{controllerEl}</span>
                        <span className="text-gray-500 text-[9px]">controls {decadeDominant}</span>
                      </div>
                      <div className="text-center text-gray-600 animate-pulse text-sm">↓</div>

                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-4">3.</span>
                        <span>Monthly structure</span>
                        <span className="text-gray-600">→</span>
                        <span className="text-purple-300 font-semibold">{decadeDominant}-dominant collapse</span>
                      </div>
                      <div className="text-center text-gray-600 animate-pulse text-sm">↓</div>

                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-4">4.</span>
                        <span>{controllerEl} allowed?</span>
                        <span className="text-gray-600">→</span>
                        <span className="px-2 py-0.5 rounded bg-red-700/50 text-red-200 text-[9px] font-semibold">Forbidden</span>
                      </div>
                      <div className="text-center text-gray-600 animate-pulse text-sm">↓</div>

                      <div className="px-3 py-1.5 rounded bg-red-900/30 border border-red-700/40 text-red-300 font-semibold text-[10px]">
                        5. Controller stone skipped
                      </div>
                      <div className="text-center text-gray-600 animate-pulse text-sm">↓</div>

                      <div className="px-3 py-1.5 rounded bg-teal-900/30 border border-teal-700/40 text-teal-300 font-semibold text-[10px]">
                        6. Follow dominant (從旺格) → {recommendedList.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            )}

            {/* Why Forbidden? Deep-dive — elemental physics */}
            {isForbidden && (() => {
              // Compute elemental states from Da Yun Qi
              const daYunTotal = elements.reduce((s, el) => s + (daYunQi[el] || 0), 0);
              const shares = {};
              elements.forEach(el => { shares[el] = daYunTotal > 0 ? (daYunQi[el] || 0) / daYunTotal : 0.2; });
              const sorted = [...elements].sort((a, b) => shares[b] - shares[a]);

              const stateOf = (el) => {
                if (forbiddenList.includes(el)) {
                  return el === controllerEl ? 'Collapsed' : shares[el] > 0.25 ? 'Feeds dominant' : 'Forbidden';
                }
                if (el === decadeDominant) return 'Dominant';
                if (shares[el] >= 0.25) return 'Strong';
                if (shares[el] >= 0.15) return 'Moderate';
                return 'Weak';
              };

              const stateBg = (state) => {
                switch (state) {
                  case 'Dominant': return 'bg-gray-800/60 border-gray-500/60';
                  case 'Strong': return 'bg-blue-900/40 border-blue-700/50';
                  case 'Moderate': return 'bg-slate-800/40 border-slate-600/40';
                  case 'Weak': return 'bg-slate-900/40 border-slate-700/30';
                  case 'Collapsed': return 'bg-red-900/40 border-red-700/50';
                  case 'Feeds dominant': return 'bg-amber-900/30 border-amber-700/40';
                  case 'Forbidden': return 'bg-red-900/30 border-red-600/40';
                  default: return 'bg-white/5 border-white/10';
                }
              };

              // Sheng cycle order
              const shengOrder = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
              // Ke cycle: each element controls the one 2 steps ahead
              const keTarget = { Wood: 'Earth', Fire: 'Metal', Earth: 'Water', Metal: 'Wood', Water: 'Fire' };

              return (
                <details className="group rounded-lg bg-black/30 border border-gray-700/50 overflow-hidden">
                  <summary className="cursor-pointer px-3 py-2 text-[11px] text-gray-300 font-medium flex items-center justify-between hover:bg-white/5 transition-colors">
                    <span>Why is <span style={{ color: colEl }}>{controllerEl}</span> forbidden? <span className="text-gray-500">(elemental physics)</span></span>
                    <span className="text-gray-500 group-open:rotate-90 transition-transform">▸</span>
                  </summary>
                  <div className="px-3 pb-3 pt-2 space-y-4">

                    {/* Section 1: Elemental states grid */}
                    <div>
                      <div className="text-[10px] font-semibold text-gray-400 mb-2">Elemental States This Month</div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {shengOrder.map(el => {
                          const state = stateOf(el);
                          const isFb = forbiddenList.includes(el);
                          const isCtrl = el === controllerEl;
                          const isDom = el === decadeDominant;
                          return (
                            <div key={el} className={`rounded-lg p-2 border text-center ${stateBg(state)} ${isCtrl ? 'ring-1 ring-red-500/50' : isDom ? 'ring-1 ring-amber-400/50' : ''}`}>
                              <div className="text-[10px] font-bold" style={{ color: ELEM_COLORS[el] }}>{el}</div>
                              <div className={`text-[9px] mt-0.5 ${isFb ? 'text-red-400' : isDom ? 'text-amber-300' : 'text-gray-400'}`}>{state}</div>
                              <div className="text-[8px] text-gray-500 mt-0.5">{(shares[el] * 100).toFixed(1)}%</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 2: Sheng / Ke cycle */}
                    <div>
                      <div className="text-[10px] font-semibold text-gray-400 mb-2">Sheng / Ke Cycle Dynamics</div>
                      <div className="rounded-lg bg-black/40 border border-gray-700/40 p-3 space-y-2">
                        {/* Sheng (生) */}
                        <div className="flex items-center justify-center gap-1 text-[10px]">
                          <span className="text-gray-500 text-[9px] w-8">Sheng</span>
                          {shengOrder.map((el, i) => (
                            <React.Fragment key={el}>
                              <span className="font-semibold" style={{ color: ELEM_COLORS[el] }}>{el}</span>
                              {i < 4 && <span className="text-green-500/60 animate-pulse">→</span>}
                            </React.Fragment>
                          ))}
                        </div>
                        {/* Ke (克) */}
                        <div className="flex items-center justify-center gap-1 text-[10px]">
                          <span className="text-gray-500 text-[9px] w-8">Ke</span>
                          {shengOrder.map((el, i) => (
                            <React.Fragment key={el}>
                              <span className="font-semibold" style={{ color: ELEM_COLORS[el] }}>{el}</span>
                              {i < 4 && <span className="text-red-500/60 animate-pulse">→</span>}
                            </React.Fragment>
                          ))}
                        </div>
                        <div className="text-center text-[10px] mt-1">
                          <span style={{ color: colEl }}>{controllerEl}</span>
                          <span className="text-red-400 mx-1 animate-pulse">→ Ke →</span>
                          <span style={{ color: domEl }}>{decadeDominant}</span>
                          <span className="text-gray-500 ml-2">but {controllerEl} is too weak ({(shares[controllerEl] * 100).toFixed(1)}%) to control {decadeDominant} ({(shares[decadeDominant] * 100).toFixed(1)}%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Physics explanation */}
                    <div>
                      <div className="text-[10px] font-semibold text-gray-400 mb-1.5">Why {controllerEl} Cannot Be Used</div>
                      <div className="text-[10px] text-gray-400 space-y-1 leading-relaxed">
                        <div>{decadeDominant} is overwhelmingly dominant at <span className="text-white font-semibold">{(shares[decadeDominant] * 100).toFixed(1)}%</span> of decade Qi.</div>
                        <div>{controllerEl} holds only <span className="text-white font-semibold">{(shares[controllerEl] * 100).toFixed(1)}%</span> — far too weak to regulate {decadeDominant} through the Ke cycle.</div>
                        <div>Inserting a {controllerEl} controller stone would be <span className="text-red-400">destroyed by {decadeDominant}'s overwhelming force</span>, damaging the bracelet's Qi circuit.</div>
                        {(() => {
                          const feeder = Object.entries(GENERATES).find(([_, child]) => child === decadeDominant)?.[0];
                          if (feeder && forbiddenList.includes(feeder)) {
                            return <div>{feeder} is also forbidden because it <span className="text-amber-400">feeds {decadeDominant}</span> through the Sheng cycle.</div>;
                          }
                          return null;
                        })()}
                        <div>The correct strategy is <span className="text-teal-300 font-semibold">從旺格 (Follow the Dominant)</span> — harmonize with {decadeDominant}, do not fight it.</div>
                      </div>
                    </div>

                    {/* Section 4: Verdict */}
                    <div className="px-3 py-2 rounded-lg bg-red-900/30 border border-red-700/40 text-[10px] text-red-300 font-semibold">
                      {controllerEl} is forbidden this month. The controller stone is intentionally skipped to prevent destructive Ke interactions.
                    </div>
                  </div>
                </details>
              );
            })()}
          </div>
        );
      })()}

      {/* 5-column grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 text-[11px]">
        {/* Decade dominant */}
        <div className="bg-white/5 rounded-lg p-2 space-y-0.5">
          <div className="text-white/40 text-[10px]">Decade Dominant</div>
          <div className="font-bold" style={{ color: domEl }}>{decadeDominant}</div>
          <div className="text-white/30 font-mono">{(daYunQi[decadeDominant] || 0).toFixed(2)} qi</div>
        </div>

        {/* Controller element */}
        <div className="bg-white/5 rounded-lg p-2 space-y-0.5">
          <div className="text-white/40 text-[10px]">Controller (克)</div>
          <div className="font-bold" style={{ color: colEl }}>{controllerEl}</div>
          <div className="text-white/30 text-[10px]">{controllerEl} controls {decadeDominant}</div>
        </div>

        {/* Chosen stone */}
        <div className={`rounded-lg p-2 space-y-0.5 sm:col-span-1 col-span-2 ${isEngineSelected ? 'bg-teal-900/20 border border-teal-500/20' : 'bg-white/5'}`}>
          <div className="text-white/40 text-[10px]">Controller Stone</div>
          {controllerBead && !isForbidden ? (
            <>
              <div className="font-semibold text-white/80 truncate">{controllerBead.stone?.name || controllerBead.name}</div>
              <div className="text-white/30 text-[10px]">
                {controllerBead.stone?.element || controllerBead.element} · {controllerBead.stone?.polarity || controllerBead.polarity}
                {isEngineSelected && <span className="text-teal-400/70"> · engine</span>}
              </div>
            </>
          ) : (
            <div className={`text-[10px] ${isForbidden ? 'text-red-400' : 'text-white/30'}`}>
              {isForbidden ? 'Skipped' : `No ${controllerEl} stone`}
            </div>
          )}
        </div>

        {/* Position */}
        <div className={`rounded-lg p-2 space-y-0.5 ${anchorConflict ? 'bg-red-900/30 border border-red-500/30' : 'bg-white/5'}`}>
          <div className="text-white/40 text-[10px]">Position</div>
          {isForbidden ? (
            <div className="text-red-400/70 text-[10px]">forbidden</div>
          ) : controllerIndex != null ? (
            <div className={`font-bold ${anchorConflict ? 'text-red-400' : isEngineSelected ? 'text-teal-300' : 'text-white/60'}`}>
              Bead {controllerIndex + 1}
              {anchorConflict && ' ⚠'}
            </div>
          ) : (
            <div className="text-white/30">—</div>
          )}
        </div>

        {/* Sheng breaks */}
        <div className="bg-white/5 rounded-lg p-2 space-y-0.5">
          <div className="text-white/40 text-[10px]">Sheng Breaks</div>
          <div className={`font-bold ${shengBreaks === 0 ? 'text-green-400' : shengBreaks <= 3 ? 'text-amber-400' : 'text-red-400'}`}>
            {shengBreaks}
          </div>
          <div className="text-white/30 text-[10px]">of {refBeads.length} links</div>
        </div>
      </div>

      {/* Engine explanation */}
      {isEngineSelected && controllerBead && (
        <div className="px-3 pb-2 text-[10px] text-teal-400/50">
          Engine selected <span className="text-teal-300/70 font-semibold">{controllerBead.stone?.name}</span> (baseQi {controllerBead.stone?.baseQi?.toFixed(2)}) — replaces a {decadeDominant} bead at position {controllerIndex + 1} to regulate decade Fire via 克 cycle.
        </div>
      )}

      {showGuide && (
        <FloatingMdWindow
          content={CONTROLLER_STONE_GUIDE_MD}
          title="調候石 Controller Stone — Placement Guide"
          onClose={() => setShowGuide(false)}
          width={560}
        />
      )}
    </div>
  );
}

function QualityScoreCard({ quality }) {
  const { overall, grade, breakdown, warnings, strengths } = quality;
  const gradeStyle = GRADE_COLORS[grade] || GRADE_COLORS.C;
  const [yongShenOpen, setYongShenOpen] = React.useState(false);
  const [polarityOpen, setPolarityOpen] = React.useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${gradeStyle}`}>
          {grade}
        </span>
        <div>
          <div className="text-sm font-semibold text-white/80">{overall}/100</div>
          <div className="text-[10px] text-white/40">Quality Score</div>
        </div>
      </div>

      {/* Breakdown bars */}
      <div className="space-y-2 text-xs">
        {[
          { label: 'Yong Shen', value: breakdown.yongShenAlignment, max: 30 },
          { label: 'Polarity', value: breakdown.polarityBalance, max: 20 },
          { label: 'Sheng Flow', value: breakdown.shengCycleFlow, max: 20 },
          { label: 'Forbidden', value: breakdown.forbiddenCheck, max: 15 },
          { label: 'Diversity', value: breakdown.diversityScore, max: 15 },
        ].map(({ label, value, max }) => {
          const isYS = label === 'Yong Shen';
          const isPol = label === 'Polarity';
          const isOpen = isYS ? yongShenOpen : isPol ? polarityOpen : false;
          const toggle = isYS
            ? () => setYongShenOpen(o => !o)
            : isPol ? () => setPolarityOpen(o => !o) : null;
          return (
            <div key={label}>
              <div className="flex items-center gap-2">
                {toggle ? (
                  <button
                    onClick={toggle}
                    className="w-16 text-left text-teal-300/80 hover:text-teal-200 transition-colors shrink-0 flex items-center gap-0.5"
                    title={`Show ${label} calculation`}
                  >
                    {label}
                    <span className="text-[9px] opacity-60">{isOpen ? '▾' : '▸'}</span>
                  </button>
                ) : (
                  <span className="w-16 text-white/50 shrink-0">{label}</span>
                )}
                <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-600 to-teal-400"
                    style={{ width: `${(value / max) * 100}%` }}
                  />
                </div>
                <span className="text-white/40 w-10 text-right font-mono">{value}/{max}</span>
              </div>
              {isYS  && yongShenOpen  && <YongShenFlap ys={breakdown.yongShenDetails} />}
              {isPol && polarityOpen  && <PolarityFlap pd={breakdown.polarityDetails} />}
            </div>
          );
        })}
      </div>

      {/* Strengths / Warnings */}
      {strengths.length > 0 && (
        <div className="space-y-0.5">
          {strengths.map((s, i) => (
            <p key={i} className="text-xs text-green-400/80">+ {s}</p>
          ))}
        </div>
      )}
      {warnings.length > 0 && (
        <div className="space-y-0.5">
          {warnings.map((w, i) => (
            <p key={i} className="text-xs text-amber-400/80">! {w}</p>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ELEMENT RATIO BAR
// ============================================================================

function ElementRatioBar({ ratios }) {
  const els = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const total = els.reduce((s, el) => s + (ratios[el] || 0), 0) || 1;

  return (
    <div className="space-y-1.5">
      <div className="flex h-4 rounded-full overflow-hidden bg-white/5">
        {els.map(el => {
          const pct = ((ratios[el] || 0) / total) * 100;
          if (pct < 1) return null;
          return (
            <div
              key={el}
              style={{ width: `${pct}%`, backgroundColor: ELEM_COLORS[el] }}
              className="h-full transition-all duration-300"
              title={`${el}: ${pct.toFixed(0)}%`}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-white/50 font-mono">
        {els.map(el => (
          <span key={el} style={{ color: ELEM_COLORS[el] }}>
            {elAbbr(el)} {((ratios[el] || 0) * 100).toFixed(0)}%
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// STONE LIST
// ============================================================================

function StoneList({ bracelet, stoneScores, yongShen, dayMasterStem, onSubstitute }) {
  const uniqueStones = [];
  const seen = new Set();
  for (const bead of bracelet.sequence) {
    if (!seen.has(bead.stone.name)) {
      seen.add(bead.stone.name);
      uniqueStones.push(bead.stone);
    }
  }

  return (
    <div className="space-y-1.5">
      {uniqueStones.map(stone => {
        const score = stoneScores?.find(s => s.stone.name === stone.name);
        const count = bracelet.sequence.filter(b => b.stone.name === stone.name).length;
        const gradeStyle = score ? (GRADE_COLORS[score.grade] || '') : '';

        return (
          <div key={stone.name} className="bg-white/5 rounded-lg px-3 py-2 space-y-1">
            {/* Row 1: color dot + full name + swap button */}
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full shrink-0 border border-white/20"
                style={{ backgroundColor: stone.color }}
              />
              <p className="text-xs text-white/80 flex-1">
                {stone.name} {stone.chineseName ? `(${stone.chineseName})` : ''}
              </p>
              {onSubstitute && (
                <button
                  onClick={() => onSubstitute(stone)}
                  className="text-[10px] text-teal-400/60 hover:text-teal-300 transition-colors shrink-0"
                  title="Find substitutes"
                >
                  swap
                </button>
              )}
            </div>
            {/* Row 2: element, polarity, count, grade, effectiveness % */}
            <div className="flex items-center gap-2 pl-6 text-[10px]">
              <span className="text-white/40">{stone.element} {stone.polarity}</span>
              <span className="text-white/30">x{count}</span>
              {score && (
                <>
                  <span className={`px-1.5 py-0.5 rounded border ${gradeStyle}`}>
                    {score.grade}
                  </span>
                  <span className="text-white/50 font-mono">{score.totalScore}%</span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// STONES WITH SWAP PANEL — all bracelet stones with inline substitutes
// ============================================================================

function StonesWithSwapPanel({ currentBeads, stoneScores, allStoneSubstitutes, swappedBeads, onSwap, onReset }) {
  const [expandedStone, setExpandedStone] = useState(null);

  // Build unique stone list from current beads (skip bridge beads)
  const uniqueStones = [];
  const seen = new Set();
  for (const bead of (currentBeads || [])) {
    if (bead.isBridge) continue;
    const name = bead.stone?.name;
    if (name && !seen.has(name)) {
      seen.add(name);
      uniqueStones.push({ stone: bead.stone, element: bead.element, polarity: bead.polarity });
    }
  }

  return (
    <div className="space-y-1.5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-white/60">Stones (effectiveness graded)</h4>
        {swappedBeads && (
          <button
            onClick={onReset}
            className="text-[10px] px-2 py-0.5 rounded border border-amber-500/30 text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
          >
            ↺ Reset
          </button>
        )}
      </div>

      {uniqueStones.map(({ stone, element, polarity }) => {
        const score = stoneScores?.find(s => s.stone.name === stone.name);
        const gradeStyle = score ? (GRADE_COLORS[score.grade] || '') : '';
        const subs = allStoneSubstitutes?.[stone.name] || [];
        const isExpanded = expandedStone === stone.name;
        const isSwapped = swappedBeads && swappedBeads.some(b => b.stone?.name === stone.name && b.stone?.name !== (currentBeads?.find(orig => orig.element === element)?.stone?.name));

        return (
          <div key={stone.name} className="rounded-lg overflow-hidden border border-white/5">
            {/* Stone row — two lines: name on top, metadata below */}
            <div className="flex items-start gap-2.5 bg-white/5 px-3 py-2">
              <div className="w-4 h-4 rounded-full shrink-0 border border-white/20 mt-0.5" style={{ backgroundColor: stone.color }} />
              <div className="flex-1 min-w-0">
                {/* Line 1: stone name */}
                <p className="text-xs text-white/85 font-medium leading-snug">
                  {stone.name}
                  {stone.chineseName ? <span className="text-white/40 font-normal ml-1">({stone.chineseName})</span> : null}
                </p>
                {/* Line 2: element · polarity · grade · score · swap */}
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span className="text-[10px] text-white/40">{element}</span>
                  <span className="text-[10px] text-white/25">·</span>
                  <span className="text-[10px] text-white/35">{polarity}</span>
                  {score && (
                    <>
                      <span className="text-[10px] text-white/25">·</span>
                      <span className={`text-[10px] px-1 py-0.5 rounded border ${gradeStyle}`}>{score.grade}</span>
                      <span className="text-[10px] text-white/50 font-mono">{score.totalScore}%</span>
                    </>
                  )}
                  {subs.length > 0 && (
                    <button
                      onClick={() => setExpandedStone(isExpanded ? null : stone.name)}
                      className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ml-auto ${
                        isExpanded
                          ? 'border-teal-500/40 text-teal-300 bg-teal-500/10'
                          : 'border-white/10 text-white/35 hover:text-teal-300 hover:border-teal-500/30'
                      }`}
                    >
                      swap {isExpanded ? '▴' : '▾'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Inline substitutes */}
            {isExpanded && subs.length > 0 && (
              <div className="bg-black/20 divide-y divide-white/5">
                {subs.map((sub, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-1.5">
                    <div className="w-3 h-3 rounded-full shrink-0 border border-white/20" style={{ backgroundColor: sub.replacement.color }} />
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] text-white/75">{sub.replacement.name}</span>
                      <span className="text-[10px] text-white/30 ml-2">{sub.replacement.element} {sub.replacement.polarity}</span>
                    </div>
                    <span className={`text-[10px] font-mono w-7 text-right shrink-0 ${sub.qualityRetention >= 80 ? 'text-green-400' : sub.qualityRetention >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                      {sub.qualityRetention}%
                    </span>
                    <button
                      onClick={() => { onSwap(stone.name, sub.replacement); setExpandedStone(null); }}
                      className="text-[10px] px-2 py-0.5 rounded border border-teal-500/30 text-teal-400 hover:bg-teal-500/15 transition-colors shrink-0"
                    >
                      Use
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// COMPARISON PANEL
// ============================================================================

function ComparisonPanel({ comparison }) {
  if (!comparison) return null;
  const els = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-white/60">
        {comparison.from} vs {comparison.to}
      </h4>
      <div className="grid grid-cols-5 gap-2">
        {els.map(el => {
          const d = comparison.ratioDiff[el];
          const color = d > 0.05 ? 'text-green-400' : d < -0.05 ? 'text-red-400' : 'text-white/30';
          return (
            <div key={el} className="text-center bg-white/5 rounded-lg p-2">
              <div className="text-[10px] text-white/40">{elAbbr(el)}</div>
              <div className={`text-xs font-mono font-semibold ${color}`}>
                {d > 0 ? '+' : ''}{(d * 100).toFixed(0)}%
              </div>
            </div>
          );
        })}
      </div>
      {comparison.addedStones.length > 0 && (
        <p className="text-[10px] text-green-400/70">+ {comparison.addedStones.join(', ')}</p>
      )}
      {comparison.removedStones.length > 0 && (
        <p className="text-[10px] text-red-400/70">- {comparison.removedStones.join(', ')}</p>
      )}
      <p className="text-[10px] text-white/40">{comparison.collapseShift}</p>
      {comparison.qualityDiff !== 0 && (
        <p className={`text-[10px] ${comparison.qualityDiff > 0 ? 'text-green-400' : 'text-red-400'}`}>
          Quality: {comparison.qualityDiff > 0 ? '+' : ''}{comparison.qualityDiff} pts
        </p>
      )}
    </div>
  );
}

// ============================================================================
// SUBSTITUTION PANEL
// ============================================================================

function SubstitutionPanel({ stone, substitutes, onClose }) {
  if (!stone || !substitutes) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-white/80">
          Substitutes for <span className="text-teal-300">{stone.name}</span>
        </h4>
        <button onClick={onClose} className="text-white/40 hover:text-white text-sm">x</button>
      </div>
      <div className="space-y-1.5">
        {substitutes.map((sub, i) => (
          <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2">
            <div
              className="w-4 h-4 rounded-full shrink-0 border border-white/20"
              style={{ backgroundColor: sub.replacement.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/80">{sub.replacement.name}</p>
              <p className="text-[10px] text-white/40">{sub.reason}</p>
            </div>
            <span className={`text-[10px] font-mono ${sub.qualityRetention >= 80 ? 'text-green-400' : sub.qualityRetention >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
              {sub.qualityRetention}%
            </span>
            {sub.isBudget && (
              <span className="text-[10px] text-amber-400/60 border border-amber-500/20 rounded px-1">$</span>
            )}
          </div>
        ))}
        {substitutes.length === 0 && (
          <p className="text-xs text-white/40">No substitutes found.</p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// GOAL RECOMMENDATION PANEL
// ============================================================================

function GoalPanel({ monthBracelets, selectedGoal, onGoalChange }) {
  const recommendations = useMemo(() => {
    if (!selectedGoal || !monthBracelets || monthBracelets.length === 0) return [];
    return recommendBraceletForGoal(monthBracelets, selectedGoal).slice(0, 3);
  }, [monthBracelets, selectedGoal]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h4 className="text-xs font-semibold text-white/60">Goal Recommendation</h4>
        <select
          value={selectedGoal || ''}
          onChange={(e) => onGoalChange(e.target.value || null)}
          className="bg-slate-700 border border-white/10 rounded text-[11px] text-white/70 px-2 py-1"
        >
          <option value="">Select goal...</option>
          {GOALS.map(g => (
            <option key={g.key} value={g.key}>{g.label}</option>
          ))}
        </select>
      </div>

      {selectedGoal && GOAL_DESCRIPTIONS[selectedGoal] && (
        <p className="text-[10px] text-white/40 italic">{GOAL_DESCRIPTIONS[selectedGoal]}</p>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-1.5">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2">
              <span className="text-[10px] text-white/30 w-4">{i + 1}.</span>
              <span className="text-xs text-white/70 flex-1">{rec.monthLabel}</span>
              <span className="text-[10px] text-teal-400 font-mono">{rec.goalAlignment}%</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${GRADE_COLORS[rec.quality.grade] || ''}`}>
                {rec.quality.grade}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// RADAR SHIFT PANEL — Shows bracelet influence on the Five-Element radar
// ============================================================================

function RadarShiftPanel({ radarShift }) {
  if (!radarShift) return null;
  const els = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const { tfq, mffq, afterBracelet, delta, totalShiftPct, monthType } = radarShift;

  const monthLabel = monthType === 'drained' ? 'Drained (+25% leverage)'
    : monthType === 'overcrowded' ? 'Overcrowded (-25% leverage)'
    : 'Normal';

  return (
    <div className="bg-white/5 rounded-lg p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-white/60">Bracelet Qi Influence</h4>
        <span className="text-[10px] text-white/30 font-mono">{monthLabel}</span>
      </div>

      {/* Per-element shift bars */}
      <div className="space-y-2">
        {els.map(el => {
          const tfqVal = tfq[el] || 0;
          const mffqVal = mffq[el] || 0;
          const afterVal = afterBracelet[el] || 0;
          const d = delta[el] || 0;
          const maxVal = Math.max(tfqVal, mffqVal, afterVal, 1);
          const color = ELEM_COLORS[el];

          return (
            <div key={el} className="space-y-0.5">
              <div className="flex items-center justify-between text-[10px]">
                <span style={{ color }}>{el}</span>
                <span className={`font-mono font-semibold ${d > 0.1 ? 'text-green-400' : d < -0.1 ? 'text-red-400' : 'text-white/30'}`}>
                  {d > 0 ? '+' : ''}{d.toFixed(2)}
                </span>
              </div>
              {/* Three stacked bars: TFQ (faint), TotalQi (medium), After (bright) */}
              <div className="relative h-4 bg-white/5 rounded overflow-hidden">
                {/* TFQ baseline */}
                <div className="absolute inset-y-0 left-0 rounded" style={{
                  width: `${(tfqVal / maxVal) * 100}%`,
                  backgroundColor: color,
                  opacity: 0.15,
                }} />
                {/* TotalQi */}
                <div className="absolute inset-y-0 left-0 rounded" style={{
                  width: `${(mffqVal / maxVal) * 100}%`,
                  backgroundColor: color,
                  opacity: 0.35,
                }} />
                {/* After bracelet */}
                <div className="absolute inset-y-0 left-0 rounded" style={{
                  width: `${(afterVal / maxVal) * 100}%`,
                  backgroundColor: color,
                  opacity: 0.85,
                }} />
                {/* Values */}
                <div className="absolute inset-0 flex items-center justify-between px-1.5 text-[9px] font-mono text-white/70">
                  <span>{mffqVal.toFixed(1)}</span>
                  <span className="text-white/90">{afterVal.toFixed(1)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend + total shift */}
      <div className="flex items-center justify-between text-[9px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-1.5 bg-white/15 rounded" />
            <span className="text-white/30">Natal TFQ</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1.5 bg-white/35 rounded" />
            <span className="text-white/40">TotalQi</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1.5 bg-teal-400/80 rounded" />
            <span className="text-white/50">+ Bracelet</span>
          </div>
        </div>
        <span className="text-teal-400/70 font-mono">Total shift: {totalShiftPct.toFixed(1)}</span>
      </div>
    </div>
  );
}

// ============================================================================
// COLLAPSE MODE VISUALIZER — Why the system flags a structural collapse
// ============================================================================

function CollapseModePanel({ dynamicPool, yongShen }) {
  if (!dynamicPool || !yongShen) return null;
  const els = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const total = els.reduce((s, el) => s + (dynamicPool[el] || 0), 0) || 1;
  const sorted = els
    .map(el => ({ el, val: dynamicPool[el] || 0, pct: ((dynamicPool[el] || 0) / total) * 100 }))
    .sort((a, b) => b.pct - a.pct);

  const dominant = sorted[0];
  const second = sorted[1];
  const ratio = second.pct > 0 ? (dominant.pct / second.pct).toFixed(1) : '---';
  const isCollapse = yongShen.status === 'collapse_override';
  const mode = yongShen.collapseMode || 'none';

  const modeLabels = {
    'single-dominant': 'Single-Dominant',
    'bi-polar': 'Bi-Polar Bridge',
    'drained': 'Drained Element',
    'inverted': 'Inverted Structure',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-white/60">Structure Analysis</h4>
        {isCollapse && (
          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-purple-300">
            {modeLabels[mode] || mode}
          </span>
        )}
      </div>

      {/* Element bars */}
      <div className="space-y-1">
        {sorted.map(({ el, pct }) => (
          <div key={el} className="flex items-center gap-2">
            <span className="text-[10px] w-10 text-right" style={{ color: ELEM_COLORS[el] }}>{el}</span>
            <div className="flex-1 h-3 bg-white/5 rounded overflow-hidden">
              <div className="h-full rounded" style={{
                width: `${pct}%`,
                backgroundColor: ELEM_COLORS[el],
                opacity: el === dominant.el && isCollapse ? 0.9 : 0.5,
              }} />
            </div>
            <span className="text-[10px] text-white/40 font-mono w-10">{pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>

      {/* Explanation */}
      {isCollapse && (
        <div className="text-[10px] text-white/40 bg-white/5 rounded-lg p-2 space-y-1">
          <p><span className="text-purple-300 font-semibold">{dominant.el}</span> = {dominant.pct.toFixed(1)}%, next = {second.el} {second.pct.toFixed(1)}% (ratio {ratio}x)</p>
          {mode === 'single-dominant' && (
            <p>Follow-structure: support {dominant.el}, exhaust via its child. Never control with {yongShen.forbidden?.[0] || 'the controlling element'}.</p>
          )}
          {mode === 'drained' && (
            <p>One element has nearly vanished. The bracelet feeds it through its mother element.</p>
          )}
          {mode === 'bi-polar' && (
            <p>Two elements dominate equally. The bracelet bridges them with a mediating element.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// YONG SHEN STABILITY HEATMAP — 12-month element stability overview
// ============================================================================

function StabilityHeatmap({ allMonthBracelets, userTfq }) {
  if (!allMonthBracelets || allMonthBracelets.length === 0 || !userTfq) return null;
  const els = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  // For each month, compute stability per element (how close TotalQi is to TFQ)
  const months = allMonthBracelets.filter(m => m.mffq).map(m => {
    const total = els.reduce((s, el) => s + (m.mffq[el] || 0), 0) || 1;
    const tfqTotal = els.reduce((s, el) => s + (userTfq[el] || 0), 0) || 1;
    const cells = {};
    for (const el of els) {
      const mffqPct = ((m.mffq[el] || 0) / total) * 100;
      const tfqPct = ((userTfq[el] || 0) / tfqTotal) * 100;
      const drift = mffqPct - tfqPct; // positive = element grew, negative = element shrank
      cells[el] = drift;
    }
    return { label: m.label, cells, yongShen: m.yongShen };
  });

  if (months.length === 0) return null;

  const driftColor = (d) => {
    if (d > 8) return 'bg-red-500/60';
    if (d > 3) return 'bg-amber-500/40';
    if (d < -8) return 'bg-blue-500/60';
    if (d < -3) return 'bg-blue-500/30';
    return 'bg-green-500/25';
  };

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-white/60">Monthly Element Drift from Natal</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-[9px] font-mono">
          <thead>
            <tr>
              <th className="text-left text-white/30 px-1 pb-1">Month</th>
              {els.map(el => (
                <th key={el} className="text-center px-1 pb-1" style={{ color: ELEM_COLORS[el] }}>{elAbbr(el)}</th>
              ))}
              <th className="text-center text-white/30 px-1 pb-1">Mode</th>
            </tr>
          </thead>
          <tbody>
            {months.map(m => (
              <tr key={m.label}>
                <td className="text-white/40 px-1 py-0.5 whitespace-nowrap">{m.label?.slice(0, 3)}</td>
                {els.map(el => (
                  <td key={el} className="text-center px-0.5 py-0.5">
                    <span className={`inline-block w-full rounded px-1 py-0.5 text-white/70 ${driftColor(m.cells[el])}`}>
                      {m.cells[el] > 0 ? '+' : ''}{m.cells[el].toFixed(0)}
                    </span>
                  </td>
                ))}
                <td className="text-center text-white/30 px-1 py-0.5 whitespace-nowrap">
                  {m.yongShen?.collapseMode?.slice(0, 5) || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-3 text-[9px] text-white/30">
        <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-green-500/25" /> Stable</span>
        <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-amber-500/40" /> Excess</span>
        <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-red-500/60" /> Surge</span>
        <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-blue-500/30" /> Deficit</span>
      </div>
    </div>
  );
}

// ============================================================================
// YONG SHEN PRESSURE CHART — Dominant element % over the year
// ============================================================================

function PressureChart({ allMonthBracelets, userTfq }) {
  if (!allMonthBracelets || allMonthBracelets.length === 0 || !userTfq) return null;
  const els = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const tfqTotal = els.reduce((s, el) => s + (userTfq[el] || 0), 0) || 1;

  // Find the dominant natal element
  const tfqPcts = els.map(el => ({ el, pct: ((userTfq[el] || 0) / tfqTotal) * 100 }));
  const dominant = tfqPcts.sort((a, b) => b.pct - a.pct)[0];

  const months = allMonthBracelets.filter(m => m.mffq).map(m => {
    const total = els.reduce((s, el) => s + (m.mffq[el] || 0), 0) || 1;
    return {
      label: m.label?.slice(0, 3) || '?',
      pct: ((m.mffq[dominant.el] || 0) / total) * 100,
    };
  });

  if (months.length === 0) return null;
  const maxPct = Math.max(...months.map(m => m.pct), dominant.pct, 1);

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-white/60">
        <span style={{ color: ELEM_COLORS[dominant.el] }}>{dominant.el}</span> Pressure Over Year
      </h4>
      <div className="flex items-end gap-1 h-20">
        {months.map((m, i) => {
          const h = (m.pct / maxPct) * 100;
          const isHigh = m.pct > dominant.pct + 10;
          const isLow = m.pct < dominant.pct - 10;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full rounded-t relative" style={{
                height: `${h}%`,
                backgroundColor: ELEM_COLORS[dominant.el],
                opacity: isHigh ? 0.9 : isLow ? 0.25 : 0.5,
              }}>
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/50">
                  {m.pct.toFixed(0)}
                </span>
              </div>
              <span className="text-[8px] text-white/30">{m.label}</span>
            </div>
          );
        })}
      </div>
      {/* Natal baseline line */}
      <div className="flex items-center gap-2 text-[9px]">
        <div className="w-6 h-0.5 border-t border-dashed" style={{ borderColor: ELEM_COLORS[dominant.el] }} />
        <span className="text-white/30">Natal {dominant.el}: {dominant.pct.toFixed(1)}%</span>
      </div>
    </div>
  );
}

// ============================================================================
// WHY THIS REMEDY PANEL — Explains why the bracelet uses these elements
// ============================================================================

function WhyThisRemedyPanel({ yongShen, dynamicPool, userTfq, bracelet, dmStrengthScore, dmElement }) {
  if (!yongShen || !dynamicPool || !bracelet) return null;
  const els = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const useful = yongShen.usefulElements || [];
  const forbidden = yongShen.forbidden || [];
  const isCollapse = yongShen.status === 'collapse_override';
  const mode = yongShen.collapseMode;

  // Find dominant element in TotalQi
  const total = els.reduce((s, el) => s + (dynamicPool[el] || 0), 0) || 1;
  const sorted = els.map(el => ({ el, pct: ((dynamicPool[el] || 0) / total) * 100 })).sort((a, b) => b.pct - a.pct);
  const dominant = sorted[0];

  // Element role map
  const GENERATES_MAP = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };
  const CONTROLS_MAP = { Wood: 'Earth', Fire: 'Metal', Earth: 'Water', Metal: 'Wood', Water: 'Fire' };
  const PARENT_MAP = { Wood: 'Water', Fire: 'Wood', Earth: 'Fire', Metal: 'Earth', Water: 'Metal' };
  const CONTROLLER_MAP = { Wood: 'Metal', Fire: 'Water', Earth: 'Wood', Metal: 'Fire', Water: 'Earth' };

  const elemRoles = els.map(el => {
    const isUseful = useful.includes(el);
    const isForbidden = forbidden.includes(el);
    const inBracelet = bracelet.ratios[el] > 0;
    let role = 'neutral';
    if (isForbidden) role = 'forbidden';
    else if (isUseful) role = 'prescribed';
    else if (inBracelet) role = 'supporting';
    return { el, role, pct: sorted.find(s => s.el === el)?.pct || 0 };
  });

  // DM Strength data
  const hasDm = dmStrengthScore != null && dmElement;
  const band = hasDm ? (dmStrengthScore < 20 ? 'Overweak' : dmStrengthScore < 40 ? 'Weak' : dmStrengthScore < 60 ? 'Balanced' : dmStrengthScore < 80 ? 'Strong' : 'Overstrong') : null;
  const isWeak = band === 'Weak' || band === 'Overweak';
  const isStrong = band === 'Strong' || band === 'Overstrong';

  // Ten God role targets for DM Strength
  const tenGodRoles = hasDm && band !== 'Balanced' ? (() => {
    const child = GENERATES_MAP[dmElement];
    const controlled = CONTROLS_MAP[dmElement];
    const controller = CONTROLLER_MAP[dmElement];
    const parent = PARENT_MAP[dmElement];
    if (isWeak) {
      return [
        { role: 'Resource', chinese: '印', el: parent, weight: isWeak && band === 'Overweak' ? 1.0 : 0.8, desc: `generates ${dmElement}` },
        { role: 'Companion', chinese: '比劫', el: dmElement, weight: isWeak && band === 'Overweak' ? 0.8 : 0.5, desc: `same element — reinforces ${dmElement}` },
      ];
    }
    return [
      { role: 'Output', chinese: '食伤', el: child, weight: band === 'Overstrong' ? 1.0 : 0.8, desc: `${dmElement} produces it — drains excess` },
      { role: 'Wealth', chinese: '财', el: controlled, weight: band === 'Overstrong' ? 0.8 : 0.6, desc: `${dmElement} controls it — channels strength` },
      { role: 'Officer', chinese: '官杀', el: controller, weight: band === 'Overstrong' ? 0.6 : 0.4, desc: `controls ${dmElement} — provides structure` },
    ];
  })() : null;

  const ELEM_COLORS = { Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#a1a1aa', Water: '#3b82f6' };

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-white/80">Why This Remedy</h4>

      {/* Element role badges */}
      <div className="flex flex-wrap gap-1.5">
        {elemRoles.map(({ el, role }) => {
          const bg = role === 'prescribed' ? 'bg-green-500/20 border-green-500/30 text-green-300'
            : role === 'forbidden' ? 'bg-red-500/20 border-red-500/30 text-red-300'
            : role === 'supporting' ? 'bg-teal-500/20 border-teal-500/30 text-teal-300'
            : 'bg-white/5 border-white/10 text-white/40';
          const label = role === 'prescribed' ? 'Rx' : role === 'forbidden' ? 'X' : role === 'supporting' ? '+' : '-';
          return (
            <span key={el} className={`text-[10px] px-2 py-0.5 rounded border ${bg}`}>
              {label} {el}
            </span>
          );
        })}
      </div>

      {/* ── Section 1: Structure Analysis ── */}
      <div className="text-[10px] text-white/70 space-y-1.5">
        {isCollapse && mode === 'single-dominant' && (
          <p><span className="text-purple-300 font-semibold">從旺格 (Follow the Strong)</span> — <span className="text-white">{dominant.el}</span> is {dominant.pct.toFixed(0)}% of functional Qi, too dominant to control. The bracelet follows the structure and exhausts {dominant.el} through <span className="text-teal-300">{GENERATES_MAP[dominant.el]}</span>.</p>
        )}
        {isCollapse && mode === 'drained' && (
          <p><span className="text-cyan-300 font-semibold">虛弱 (Drained)</span> — A key element has nearly vanished. The bracelet feeds it through its mother element to rebuild structural integrity.</p>
        )}
        {isCollapse && mode === 'bi-polar' && (
          <p><span className="text-purple-300 font-semibold">兩神成象 (Bi-Polar)</span> — Two elements dominate equally. The bracelet bridges them with their shared child element to prevent oscillation.</p>
        )}
        {!isCollapse && yongShen.status === 'critical_imbalance' && (
          <p><span className="text-amber-300 font-semibold">Critical Deficit</span> — The bracelet supplies {useful.join(' + ')} to restore functional balance.</p>
        )}
        {!isCollapse && yongShen.status === 'balanced' && (
          <p><span className="text-green-300 font-semibold">Balanced</span> — Chart is relatively balanced. Gentle maintenance for minor monthly deficits.</p>
        )}

        {useful.length > 0 && (
          <p>Prescribed elements: <span className="text-green-300 font-semibold">{useful.join(', ')}</span> — Yong Shen remedy for this month.</p>
        )}
        {forbidden.length > 0 && (
          <p>Forbidden: <span className="text-red-300 font-semibold">{forbidden.join(', ')}</span> — {forbidden.map(f => `${f} ${CONTROLS_MAP[f] ? `controls ${CONTROLS_MAP[f]}` : ''}`).join('; ')}. Would destabilize the structure.</p>
        )}
      </div>

      {/* ── Section 2: DM Strength → Role Targeting ── */}
      {hasDm && band !== 'Balanced' && tenGodRoles && (
        <div className="border-t border-white/10 pt-2 mt-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-pink-300">DM Strength {dmStrengthScore.toFixed(0)} ({band})</span>
            <span className="text-[9px] text-white/50">→ IFQ prescription bias</span>
          </div>

          <div className="text-[10px] text-white/70 mb-2">
            {isWeak ? (
              <span>{dmElement} Day Master is <span className="text-pink-300 font-semibold">{band}</span> — needs support. Bracelet IFQ is biased toward elements that feed and reinforce the DM.</span>
            ) : (
              <span>{dmElement} Day Master is <span className="text-pink-300 font-semibold">{band}</span> — has surplus strength. Bracelet IFQ is biased toward elements that channel and drain excess Qi.</span>
            )}
          </div>

          {/* Role → Element targeting table */}
          <div className="rounded border border-white/10 overflow-hidden">
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="bg-white/5 text-white/60">
                  <th className="px-2 py-1 text-left">Ten God Role</th>
                  <th className="px-2 py-1 text-left">Element</th>
                  <th className="px-2 py-1 text-right">IFQ Bias</th>
                  <th className="px-2 py-1 text-left">Why</th>
                </tr>
              </thead>
              <tbody>
                {tenGodRoles.map(r => (
                  <tr key={r.role} className="border-t border-white/5">
                    <td className="px-2 py-1 text-white/80">
                      {r.role} <span className="text-white/40">{r.chinese}</span>
                    </td>
                    <td className="px-2 py-1 font-semibold" style={{ color: ELEM_COLORS[r.el] }}>
                      {r.el}
                    </td>
                    <td className="px-2 py-1 text-right text-pink-300 font-semibold">
                      +{(r.weight * 8).toFixed(1)}%
                    </td>
                    <td className="px-2 py-1 text-white/50">
                      {r.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-[9px] text-white/40 mt-1">
            These adjustments shift IFQ after Yong Shen, before seasonal correction. Max ±8% per element.
          </div>
        </div>
      )}

      {hasDm && band === 'Balanced' && (
        <div className="border-t border-white/10 pt-2 mt-1">
          <div className="text-[10px] text-white/60">
            <span className="text-pink-300 font-semibold">DM Strength {dmStrengthScore.toFixed(0)} (Balanced)</span> — no DM-driven bias applied. Yong Shen and seasonal adjustments drive the prescription alone.
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SECONDARY PANEL — tabs for Comparison / Goals / Substitution
// ============================================================================

function SecondaryPanel({ comparison, allMonthBracelets, selectedGoal, onGoalChange }) {
  const [tab, setTab] = useState(comparison ? 'compare' : 'goals');

  const tabs = [];
  if (comparison) tabs.push({ key: 'compare', label: 'vs Prev Month' });
  tabs.push({ key: 'goals', label: 'Goals' });

  const activeTab = tabs.find(t => t.key === tab) ? tab : tabs[0]?.key || 'goals';

  return (
    <div>
      {tabs.length > 1 && (
        <div className="flex gap-1 mb-3">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`text-[10px] px-2 py-1 rounded transition-colors ${
                activeTab === t.key
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'text-white/40 hover:text-white/60 border border-transparent'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {activeTab === 'compare' && <ComparisonPanel comparison={comparison} />}
      {activeTab === 'goals' && (
        <GoalPanel
          monthBracelets={allMonthBracelets}
          selectedGoal={selectedGoal}
          onGoalChange={onGoalChange}
        />
      )}
    </div>
  );
}

// ============================================================================
// BEAD SWAP WINDOW — floating draggable panel opened by clicking a bead
// ============================================================================

function BeadSwapWindow({ bead, beadIndex, originalBead, substitutes, onSwap, onSwapAll, onRevert, onClose, initialPos, elementBeadCount = 1 }) {
  const [pos, setPos] = useState(initialPos || { x: 80, y: 80 });
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e) => {
    dragging.current = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
  }, [pos]);

  useEffect(() => {
    function onMove(e) {
      if (!dragging.current) return;
      setPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    }
    function onUp() { dragging.current = false; }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  if (!bead) return null;
  const stone = bead.stone;
  const elemColor = { Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#a1a1aa', Water: '#3b82f6' }[bead.element] || '#888';
  const isChanged = originalBead && originalBead.stone?.name !== stone?.name;

  return (
    <div
      style={{ position: 'fixed', left: pos.x, top: pos.y, zIndex: 9999, width: 360, userSelect: 'none' }}
      className="rounded-xl border border-white/15 bg-slate-900/95 shadow-2xl shadow-black/60 backdrop-blur-sm"
    >
      {/* Drag handle / header */}
      <div
        onMouseDown={onMouseDown}
        className="flex items-center justify-between px-3 py-2 border-b border-white/10 cursor-move rounded-t-xl bg-white/5"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-4 h-4 rounded-full shrink-0 border border-white/25" style={{ backgroundColor: stone?.color }} />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white/90 truncate">{stone?.name}</p>
            {stone?.chineseName && <p className="text-[10px] text-white/40 truncate">{stone.chineseName}</p>}
          </div>
        </div>
        <button onClick={onClose} className="text-white/35 hover:text-white/80 text-lg leading-none ml-2 shrink-0">×</button>
      </div>

      {/* Current stone info */}
      <div className="px-3 py-2 flex items-center gap-3 border-b border-white/5">
        <div className="flex gap-2 text-[10px]">
          <span style={{ color: elemColor }}>{bead.element}</span>
          <span className="text-white/30">·</span>
          <span className="text-white/50">{stone?.polarity}</span>
          <span className="text-white/30">·</span>
          <span className="text-white/50 font-mono">{bead.size || 10}mm</span>
          <span className="text-white/30">·</span>
          <span className="text-white/50 font-mono">Qi {(bead.qiUnit || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Revert row — only shown when this bead was changed */}
      {isChanged && (
        <div className="px-3 pt-2 pb-1 border-b border-white/5">
          <div className="flex items-center gap-2 rounded-lg bg-amber-500/8 border border-amber-500/20 px-2 py-1.5">
            <div className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20" style={{ backgroundColor: originalBead.stone?.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-amber-300/80 truncate">
                {originalBead.stone?.name}
                {originalBead.stone?.chineseName && <span className="text-white/35 ml-1">({originalBead.stone.chineseName})</span>}
              </p>
              <p className="text-[10px] text-white/30">Original prescription</p>
            </div>
            <button
              onClick={() => onRevert(beadIndex)}
              className="text-[10px] px-2 py-0.5 rounded border border-amber-500/35 text-amber-400 hover:bg-amber-500/15 transition-colors shrink-0"
            >
              ↺ Revert
            </button>
          </div>
        </div>
      )}

      {/* Substitutes */}
      <div className="px-3 py-2 space-y-1.5 max-h-56 overflow-y-auto">
        <p className="text-[10px] text-white/35 uppercase tracking-wider mb-1">Substitutes (from 32-stone reference)</p>
        {substitutes.length === 0 && (
          <p className="text-[11px] text-white/35 py-2">No substitutes available.</p>
        )}
        {substitutes.map((sub, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1.5 hover:bg-white/10 transition-colors">
            <div className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20" style={{ backgroundColor: sub.replacement.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-white/85 font-medium">{sub.replacement.name}
                {sub.replacement.chineseName && (
                  <span className="text-white/50 ml-1.5 font-normal">{sub.replacement.chineseName}</span>
                )}
              </p>
              <p className={`text-[10px] ${sub.reason.includes('⚠') ? 'text-amber-400/75' : 'text-white/45'}`}>{sub.reason}</p>
            </div>
            <span className={`text-[10px] font-mono w-8 text-right shrink-0 ${sub.qualityRetention >= 80 ? 'text-green-400' : sub.qualityRetention >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
              {sub.qualityRetention}%
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onSwap(beadIndex, sub.replacement)}
                className="text-[10px] px-2 py-0.5 rounded border border-teal-500/35 text-teal-400 hover:bg-teal-500/15 transition-colors"
              >
                Use
              </button>
              {elementBeadCount > 1 && (
                <button
                  onClick={() => onSwapAll(bead.element, sub.replacement)}
                  className="text-[10px] px-1.5 py-0.5 rounded border border-purple-500/35 text-purple-300 hover:bg-purple-500/15 transition-colors whitespace-nowrap"
                  title={`Replace all ${elementBeadCount} ${bead.element} beads`}
                >
                  All ×{elementBeadCount}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Budget note */}
      <div className="px-3 pb-2.5 pt-1">
        <p className="text-[9px] text-white/20 italic">Single-stone choices reduce diversity score — intentional for budget.</p>
      </div>
    </div>
  );
}

// ============================================================================
// BEAD SUMMARY POPUP
// ============================================================================

const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

function BeadSummaryPopup({ beads, monthBranchAnimal, onClose }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [panelSize, setPanelSize] = React.useState({ w: 800, h: 0 }); // h=0 means auto
  const [centered, setCentered] = React.useState(true);
  const dragState = React.useRef({ isDragging: false, startX: 0, startY: 0 });
  const resizeState = React.useRef({ isResizing: false, startX: 0, startY: 0, startW: 0, startH: 0 });
  const posRef = React.useRef(position);
  const panelRef = React.useRef(null);
  posRef.current = position;

  React.useEffect(() => {
    const onMouseMove = (e) => {
      if (dragState.current.isDragging) {
        e.preventDefault();
        setPosition({
          x: e.clientX - dragState.current.startX,
          y: e.clientY - dragState.current.startY,
        });
      } else if (resizeState.current.isResizing) {
        e.preventDefault();
        const dw = e.clientX - resizeState.current.startX;
        const dh = e.clientY - resizeState.current.startY;
        setPanelSize({
          w: Math.max(400, resizeState.current.startW + dw),
          h: Math.max(200, resizeState.current.startH + dh),
        });
      }
    };
    const onMouseUp = () => {
      if (dragState.current.isDragging) {
        dragState.current.isDragging = false;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
      if (resizeState.current.isResizing) {
        resizeState.current.isResizing = false;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const handleDragStart = (e) => {
    if (e.target.closest('button')) return;
    e.preventDefault();
    // On first drag, convert from centered to absolute positioning
    if (centered && panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      posRef.current = { x: rect.left, y: rect.top };
      setPosition(posRef.current);
      setPanelSize({ w: rect.width, h: rect.height });
      setCentered(false);
    }
    dragState.current = {
      isDragging: true,
      startX: e.clientX - posRef.current.x,
      startY: e.clientY - posRef.current.y,
    };
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  };

  const handleResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (centered && panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      posRef.current = { x: rect.left, y: rect.top };
      setPosition(posRef.current);
      setPanelSize({ w: rect.width, h: rect.height });
      setCentered(false);
    }
    const rect = panelRef.current?.getBoundingClientRect();
    resizeState.current = {
      isResizing: true,
      startX: e.clientX,
      startY: e.clientY,
      startW: rect?.width || panelSize.w,
      startH: rect?.height || panelSize.h || 500,
    };
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'nwse-resize';
  };

  if (!beads || beads.length === 0) return null;

  const month = monthBranchAnimal || 'Tiger';
  const multipliers = MONTHLY_MULTIPLIERS[month] || {};

  // Build rows with role detection
  const rows = beads.map((bead, i) => {
    const stone = bead.stone;
    const isBridge = !!bead.isBridge;
    const sizeMm = isBridge ? 5 : (bead.size || 10);
    const baseQi = stone.baseQi || 0;
    const seasonFactor = multipliers[stone.element] || 1.0;
    // Bridge beads: no Qi contribution (polarity still noted)
    const adjustedQi = isBridge ? 0 : baseQi * seasonFactor * (sizeMm / 10);
    const isController = !!bead.isController;
    const role = i === 0 ? 'Anchor' : isBridge ? 'Bridge' : isController ? 'Controller' : '';
    return { index: i + 1, role, stone, baseQi, seasonFactor, adjustedQi, element: stone.element, bead, isBridge, isController, sizeMm };
  });

  const mainBeads = rows.filter(r => !r.isBridge);
  const bridgeCount = rows.length - mainBeads.length;

  // Element summaries (only non-bridge beads contribute Qi)
  const elSummary = {};
  ELEMENTS.forEach(el => { elSummary[el] = { base: 0, adjusted: 0, count: 0 }; });
  mainBeads.forEach(r => {
    elSummary[r.element].base += r.baseQi * (r.sizeMm / 10);
    elSummary[r.element].adjusted += r.adjustedQi;
    elSummary[r.element].count += 1;
  });
  const totalBase = ELEMENTS.reduce((s, el) => s + elSummary[el].base, 0);
  const totalAdj = ELEMENTS.reduce((s, el) => s + elSummary[el].adjusted, 0);

  const panelStyle = centered
    ? { maxWidth: 800, width: '95vw', maxHeight: collapsed ? 'auto' : '85vh' }
    : {
        position: 'fixed', left: position.x, top: position.y, zIndex: 9999,
        width: panelSize.w,
        height: collapsed ? 'auto' : (panelSize.h > 0 ? panelSize.h : undefined),
        maxHeight: collapsed ? 'auto' : (panelSize.h > 0 ? undefined : '85vh'),
        transition: (dragState.current.isDragging || resizeState.current.isResizing) ? 'none' : 'width 0.1s ease, height 0.1s ease',
      };

  const panel = (
    <div
      ref={panelRef}
      className="bg-slate-900 border border-white/15 rounded-xl shadow-2xl flex flex-col relative"
      style={panelStyle}
      onClick={e => e.stopPropagation()}
    >
      {/* Header — drag handle */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/5 rounded-t-xl cursor-grab active:cursor-grabbing select-none flex-shrink-0"
        onMouseDown={handleDragStart}
      >
        <div>
          <div className="text-sm font-semibold text-white">Bracelet Bead Summary</div>
          {!collapsed && (
            <div className="text-[10px] text-gray-500">{beads.length} beads{bridgeCount > 0 ? ` (${mainBeads.length} + ${bridgeCount} bridge)` : ''} &mdash; {month} month seasonal adjustment</div>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-xs"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? '\u25B3' : '\u25BD'}
          </button>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-lg leading-none">
            &times;
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="overflow-auto flex-1 min-h-0">
          {/* Bead table */}
          <div className="px-4 py-3 overflow-x-auto">
            <table className="w-full text-[10px] font-mono border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-400">
                  <th className="px-2 py-1.5 text-left">#</th>
                  <th className="px-2 py-1.5 text-left">Role</th>
                  <th className="px-2 py-1.5 text-left">Stone</th>
                  <th className="px-2 py-1.5 text-left">Element</th>
                  <th className="px-2 py-1.5 text-center">Polarity</th>
                  <th className="px-2 py-1.5 text-right">Size</th>
                  <th className="px-2 py-1.5 text-right">Base Qi</th>
                  <th className="px-2 py-1.5 text-right">Season &times;</th>
                  <th className="px-2 py-1.5 text-right">Adj. Qi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.index} className={`border-t border-white/5 hover:bg-white/5 ${r.isBridge ? 'bg-cyan-900/10' : r.isController ? 'bg-teal-900/10' : ''}`}>
                    <td className="px-2 py-1.5 text-gray-500">{r.index}</td>
                    <td className="px-2 py-1.5">
                      {r.role === 'Anchor' && <span className="text-amber-400 font-semibold">Anchor</span>}
                      {r.role === 'Bridge' && <span className="text-cyan-400 font-semibold">Bridge</span>}
                      {r.role === 'Controller' && <span className="text-teal-400 font-semibold">Controller</span>}
                    </td>
                    <td className="px-2 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full flex-shrink-0" style={{
                          background: `radial-gradient(circle at 35% 30%, #fff4, ${r.stone.color} 55%)`,
                          border: r.isController ? '2px solid rgba(0,210,210,0.5)' : '1px solid rgba(255,255,255,0.15)',
                        }} />
                        <div>
                          <div className={r.isBridge ? 'text-cyan-300/80' : r.isController ? 'text-teal-300' : 'text-white'}>{r.stone.name}</div>
                          <div className="text-gray-500">{r.stone.chineseName || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-1.5" style={{ color: ELEM_COLORS[r.element] }}>{r.element}</td>
                    <td className="px-2 py-1.5 text-center">
                      <span className={r.stone.polarity === 'Yang' ? 'text-amber-300' : r.stone.polarity === 'Yin-Yang' ? 'text-purple-300' : 'text-blue-300'}>
                        {r.stone.polarity}
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-right text-gray-400">{r.sizeMm}mm</td>
                    <td className="px-2 py-1.5 text-right text-gray-300">{r.isBridge ? <span className="text-gray-600">&mdash;</span> : r.baseQi.toFixed(2)}</td>
                    <td className="px-2 py-1.5 text-right text-gray-400">{r.isBridge ? <span className="text-gray-600">&mdash;</span> : <>&times;{r.seasonFactor.toFixed(1)}</>}</td>
                    <td className="px-2 py-1.5 text-right text-white font-semibold">{r.isBridge ? <span className="text-gray-600">0</span> : r.adjustedQi.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Element summary */}
          <div className="px-4 py-3 border-t border-white/10">
            <div className="text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-wider">Element Qi Summary</div>
            <table className="w-full text-[10px] font-mono border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-400">
                  <th className="px-2 py-1.5 text-left">Element</th>
                  <th className="px-2 py-1.5 text-right">Beads</th>
                  <th className="px-2 py-1.5 text-right">Base Qi</th>
                  <th className="px-2 py-1.5 text-right">Season &times;</th>
                  <th className="px-2 py-1.5 text-right">Adjusted Qi</th>
                </tr>
              </thead>
              <tbody>
                {ELEMENTS.map(el => {
                  const s = elSummary[el];
                  const sf = multipliers[el] || 1.0;
                  return (
                    <tr key={el} className="border-t border-white/5">
                      <td className="px-2 py-1.5 font-semibold" style={{ color: ELEM_COLORS[el] }}>{el}</td>
                      <td className="px-2 py-1.5 text-right text-gray-400">{s.count}</td>
                      <td className="px-2 py-1.5 text-right text-gray-300">{s.base.toFixed(3)}</td>
                      <td className="px-2 py-1.5 text-right text-gray-400">&times;{sf.toFixed(1)}</td>
                      <td className="px-2 py-1.5 text-right text-white font-semibold">{s.adjusted.toFixed(3)}</td>
                    </tr>
                  );
                })}
                <tr className="border-t border-white/20 bg-white/5">
                  <td className="px-2 py-1.5 text-gray-400 font-semibold">Total</td>
                  <td className="px-2 py-1.5 text-right text-gray-400">{mainBeads.length}{bridgeCount > 0 ? <span className="text-cyan-400/60"> +{bridgeCount}</span> : ''}</td>
                  <td className="px-2 py-1.5 text-right text-gray-300 font-semibold">{totalBase.toFixed(3)}</td>
                  <td className="px-2 py-1.5" />
                  <td className="px-2 py-1.5 text-right text-white font-bold">{totalAdj.toFixed(3)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resize handle — bottom-right corner */}
      <div
        onMouseDown={handleResizeStart}
        className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize flex items-end justify-end pr-0.5 pb-0.5 opacity-40 hover:opacity-80 transition-opacity"
        title="Resize"
      >
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path d="M9 1L1 9M9 4L4 9M9 7L7 9" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
        </svg>
      </div>
    </div>
  );

  // When centered, wrap in a backdrop; once dragged, render as free-floating
  if (centered) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40" onClick={onClose}>
        {panel}
      </div>
    );
  }

  return panel;
}

// ============================================================================
// MAIN DASHBOARD
// ============================================================================

export default function BraceletDashboard({
  bracelet,
  yongShen,
  dayMasterStem,
  dynamicPool,
  userTfq,
  mifqQi,             // MIFQ ideal target — new BRQ pipeline target
  monthLabel,
  monthBranchAnimal,
  prevBracelet,
  prevYongShen,
  prevLabel,
  allMonthBracelets,
  engineeredBracelet,
  collapseReport,
  daYunStem,          // optional: active 大運 stem char — intensifies polarity bias when same as DM
  daYunQi,            // optional: Da Yun Qi vector — drives controller stone placement engine
  dmStrengthScore,    // optional: DM Strength score (0–100) — influences IFQ prescription bias
  dmElement,          // optional: DM element name — for DM Strength explanation
}) {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [whyOpen, setWhyOpen] = useState(true);
  const [encyclopediaOpen, setEncyclopediaOpen] = useState(false);
  const [swappedBeads, setSwappedBeads] = useState(null); // null = original prescription
  const [savedBeads, setSavedBeads] = useState(null);     // user's saved slot
  const [saveFlash, setSaveFlash] = useState(false);      // brief ✓ toast feedback
  const [beadSwapWindow, setBeadSwapWindow] = useState(null); // { bead, beadIndex, pos }
  const [summaryOpen, setSummaryOpen] = useState(false);

  // Working bead set: user swaps > original prescription
  const currentBeads = swappedBeads || engineeredBracelet?.beads || null;
  const originalBeads = engineeredBracelet?.beads || null;

  // Beads with bridge insertions (mirrors EngineeredBraceletVisualizer logic)
  const summaryBeads = useMemo(() => {
    if (!currentBeads || currentBeads.length < 2) return currentBeads;
    const repair = getRepairSuggestion(currentBeads);
    if (!repair.needsRepair || repair.bridges.length === 0 || repair.totalBreaks > 1) return currentBeads;
    const insertBeads = repair.bridges.map(b => ({
      stone: { name: b.stoneName, color: b.color, element: b.element, polarity: 'Yang', chineseName: '', baseQi: 0 },
      element: b.element,
      size: 5,
      qiUnit: 0,
      isBridge: true,
    }));
    const result = [...currentBeads];
    result.splice(repair.breakIndex + 1, 0, ...insertBeads);
    return result;
  }, [currentBeads]);

  // Which bead indices differ from the original prescription
  const changedIndices = useMemo(() => {
    if (!swappedBeads || !originalBeads) return new Set();
    const s = new Set();
    swappedBeads.forEach((bead, i) => {
      if (originalBeads[i] && bead.stone?.name !== originalBeads[i].stone?.name) s.add(i);
    });
    return s;
  }, [swappedBeads, originalBeads]);

  // Derive what the SAVED button should show / do
  const savedButtonState = useMemo(() => {
    if (!savedBeads) return 'save';
    const cur = currentBeads;
    if (!cur || cur.length !== savedBeads.length) return 'save';
    const same = cur.every((b, i) => b.stone?.name === savedBeads[i]?.stone?.name);
    return same ? 'current' : (swappedBeads ? 'update' : 'load');
  }, [savedBeads, currentBeads, swappedBeads]);

  // Swap all beads sharing a stone name (used from StonesWithSwapPanel)
  function handleSwap(originalName, replacement) {
    const base = currentBeads || [];
    const next = base.map(bead =>
      bead.isBridge || bead.stone?.name !== originalName
        ? bead
        : { ...bead, stone: replacement, element: replacement.element, polarity: replacement.polarity, qiUnit: replacement.baseQi ?? bead.qiUnit }
    );
    setSwappedBeads(next);
  }

  // Swap all non-bridge beads of a given element (used from BeadSwapWindow "All ×N")
  function handleSwapAllByElement(element, replacement) {
    const base = currentBeads || [];
    const next = base.map(bead =>
      bead.isBridge || bead.element !== element
        ? bead
        : { ...bead, stone: replacement, element: replacement.element, polarity: replacement.polarity, qiUnit: replacement.baseQi ?? bead.qiUnit }
    );
    setSwappedBeads(next);
  }

  // Swap a single bead by index (used from BeadSwapWindow click)
  function handleSwapByIndex(idx, replacement) {
    const base = currentBeads || [];
    const next = base.map((bead, i) =>
      i !== idx
        ? bead
        : { ...bead, stone: replacement, element: replacement.element, polarity: replacement.polarity, qiUnit: replacement.baseQi ?? bead.qiUnit }
    );
    setSwappedBeads(next);
  }

  // Revert a single bead to its original prescription stone
  function handleRevertBead(idx) {
    const orig = originalBeads?.[idx];
    if (!orig) return;
    const base = currentBeads || [];
    const next = base.map((bead, i) => i === idx ? orig : bead);
    // If all beads are back to original, clear swapped state entirely
    const allOriginal = next.every((b, i) => b.stone?.name === originalBeads[i]?.stone?.name);
    setSwappedBeads(allOriginal ? null : next);
  }

  function handleRemedy() { setSwappedBeads(null); }
  function handleReset() { setSwappedBeads(null); }

  function handleSavedButton() {
    if (savedButtonState === 'save' || savedButtonState === 'update') {
      setSavedBeads([...(currentBeads || [])]);
      setSaveFlash(true);
      setTimeout(() => setSaveFlash(false), 1800);
    } else if (savedButtonState === 'load') {
      setSwappedBeads([...savedBeads]);
    }
    // 'current' → no-op (already viewing saved state)
  }

  function handleClear() {
    setSavedBeads(null);
    setSwappedBeads(null);
  }

  const quality = useMemo(() => {
    if (!bracelet || !yongShen) return null;
    // Score the engineered sequence (current beads) so the Sheng flow reflects the
    // actual wear order and bridge-bead repairs. Bridge beads are Qi-neutral — excluded.
    const allBeads = currentBeads || bracelet.sequence || [];
    const scoreBeads  = allBeads.filter(b => !b.isBridge);
    const bridgeBeads = allBeads.filter(b => b.isBridge).map(b => ({
      stone: b.stone ?? { polarity: b.polarity ?? 'Yin-Yang' },
    }));
    if (scoreBeads.length === 0) return scoreBracelet(bracelet, yongShen, undefined, dayMasterStem);
    const engineeredDesign = {
      ...bracelet,
      sequence: scoreBeads.map(b => ({ stone: b.stone ?? { element: b.element, polarity: b.polarity, name: b.element } })),
      totalBeads: scoreBeads.length,
    };
    // When scoring the unswapped engineered beads, align the yongShen used for scoring with
    // the collapseReport that was actually used to design those beads. The two analysis engines
    // (calculateYongShen vs diagnoseCollapse) can disagree on useful/forbidden elements, which
    // causes false penalties — e.g. yongShen marks Earth forbidden while diagnoseCollapse
    // recommended Earth, or yongShen says usefulElements=[Metal,Fire] while the engineered
    // bracelet is a balanced all-5-element design.
    const isUnswappedEngineered = !swappedBeads && !!engineeredBracelet;
    const scoreYongShen = isUnswappedEngineered && collapseReport
      ? {
          ...yongShen,
          forbidden: collapseReport.forbidden || [],
          // Useful elements = everything NOT forbidden in the collapse prescription.
          // collapseReport.recommended only lists [child, dominant] but the engineered bracelet
          // also uses non-forbidden remainder elements (e.g. Earth at 50% for Wood dominance).
          // Scoring against recommended alone undercounts — use non-forbidden instead.
          // Empty forbidden = balanced chart → usefulElements = [] triggers "Balanced chart" credit.
          usefulElements: (collapseReport.forbidden || []).length > 0
            ? ['Wood', 'Fire', 'Earth', 'Metal', 'Water'].filter(el => !(collapseReport.forbidden || []).includes(el))
            : [],
        }
      : yongShen;
    return scoreBracelet(engineeredDesign, scoreYongShen, bridgeBeads, dayMasterStem);
  }, [bracelet, yongShen, currentBeads, swappedBeads, engineeredBracelet, collapseReport]);

  const stoneScores = useMemo(
    () => yongShen && dynamicPool && dayMasterStem
      ? scoreAllStones(yongShen, dynamicPool, dayMasterStem, daYunStem)
      : [],
    [yongShen, dynamicPool, dayMasterStem],
  );

  // Qi Physics: compute radar shift (MTFQ → MTFQ + Bracelet, targeting MIFQ)
  const radarShift = useMemo(() => {
    if (!bracelet || !yongShen || !dynamicPool) return null;
    return simulateRadarShift(mifqQi || null, dynamicPool, bracelet, yongShen, 8, userTfq);
  }, [bracelet, yongShen, mifqQi, userTfq, dynamicPool]);

  const comparison = useMemo(() => {
    if (!prevBracelet || !prevYongShen || !bracelet || !yongShen) return null;
    return compareBracelets(prevBracelet, bracelet, prevLabel || 'Prev', monthLabel || 'Current', prevYongShen, yongShen);
  }, [prevBracelet, prevYongShen, bracelet, yongShen, prevLabel, monthLabel]);

  // Substitutes for all unique non-bridge stones in the current bead set
  const allStoneSubstitutes = useMemo(() => {
    if (!yongShen || !dayMasterStem || !currentBeads) return {};
    const seen = new Set();
    const result = {};
    for (const bead of currentBeads) {
      if (bead.isBridge) continue;
      const name = bead.stone?.name;
      if (name && !seen.has(name)) {
        seen.add(name);
        result[name] = findSubstitutes(bead.stone, yongShen, dayMasterStem, 12, daYunStem).slice(0, 4);
      }
    }
    return result;
  }, [currentBeads, yongShen, dayMasterStem]);

  if (!bracelet || !yongShen) {
    return <p className="text-xs text-white/30">No bracelet data available.</p>;
  }

  return (
    <div className="rounded-xl border border-teal-500/20 bg-slate-900/60 p-4 space-y-4">
      {/* Bead Summary Popup — includes bridge beads */}
      {summaryOpen && (
        <BeadSummaryPopup
          beads={summaryBeads}
          monthBranchAnimal={monthBranchAnimal}
          onClose={() => setSummaryOpen(false)}
        />
      )}

      {/* Why This Remedy — collapsible, at top so user sees analysis alongside bracelet */}
      <div>
        <button
          onClick={() => setWhyOpen(!whyOpen)}
          className="w-full flex items-center justify-between text-xs font-semibold text-purple-400/70 hover:text-purple-300 transition-colors mb-2"
        >
          <span>Why This Remedy?</span>
          <span>{whyOpen ? '▾' : '▸'}</span>
        </button>
        {whyOpen && (
          <div className="space-y-4 bg-white/[0.02] rounded-lg p-3 border border-white/5">
            <CollapseModePanel dynamicPool={dynamicPool} yongShen={yongShen} />
            <WhyThisRemedyPanel yongShen={yongShen} dynamicPool={dynamicPool} userTfq={userTfq} bracelet={bracelet} dmStrengthScore={dmStrengthScore} dmElement={dmElement} />
            <PressureChart allMonthBracelets={allMonthBracelets} userTfq={userTfq} />
            <StabilityHeatmap allMonthBracelets={allMonthBracelets} userTfq={userTfq} />
          </div>
        )}
      </div>

      {/* Bracelet preview — use engineered ring when available, fallback to old */}
      <div className="flex flex-col items-center">

        {/* Design control buttons */}
        {engineeredBracelet && (
          <div className="flex items-center gap-2 mb-3">
            {/* REMEDY — always restores AI prescription */}
            <button
              onClick={handleRemedy}
              disabled={!swappedBeads}
              className={`text-[11px] px-3 py-1 rounded-lg border font-medium transition-colors ${
                swappedBeads
                  ? 'border-purple-500/40 text-purple-300 hover:bg-purple-500/15'
                  : 'border-white/10 text-white/20 cursor-default'
              }`}
            >
              Remedy
            </button>

            {/* SAVED — adaptive: Save / Update / Load / Saved✓ */}
            <button
              onClick={handleSavedButton}
              disabled={savedButtonState === 'current'}
              className={`text-[11px] px-3 py-1 rounded-lg border font-medium transition-colors ${
                savedButtonState === 'current'
                  ? 'border-green-500/30 text-green-400/50 cursor-default'
                  : savedButtonState === 'update'
                    ? 'border-amber-500/40 text-amber-300 hover:bg-amber-500/15'
                    : savedButtonState === 'load'
                      ? 'border-teal-500/40 text-teal-300 hover:bg-teal-500/15'
                      : 'border-white/20 text-white/60 hover:bg-white/8'
              }`}
            >
              {savedButtonState === 'save'    && '💾 Save'}
              {savedButtonState === 'update'  && '↑ Update'}
              {savedButtonState === 'load'    && '↶ Load Saved'}
              {savedButtonState === 'current' && '✓ Saved'}
            </button>

            {/* SUMMARY — bead summary popup */}
            <button
              onClick={() => setSummaryOpen(true)}
              className="text-[11px] px-3 py-1 rounded-lg border border-blue-500/30 text-blue-300 hover:bg-blue-500/15 font-medium transition-colors"
            >
              Summary
            </button>

            {/* SAVE FLASH — brief success toast */}
            {saveFlash && (
              <span className="text-[11px] text-green-400 font-semibold animate-pulse">
                ✓ Saved!
              </span>
            )}

            {/* CLEAR — only when saved slot has content */}
            {savedBeads && (
              <button
                onClick={handleClear}
                className="text-[11px] px-3 py-1 rounded-lg border border-red-500/25 text-red-400/60 hover:text-red-300 hover:bg-red-500/10 transition-colors font-medium"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {engineeredBracelet ? (
          <EngineeredBraceletVisualizer
            beads={currentBeads || engineeredBracelet.beads}
            wrist={engineeredBracelet.wrist}
            wristReason={engineeredBracelet.wristReason}
            collapse={collapseReport}
            qiTotals={engineeredBracelet.qiTotals}
            size={300}
            isDark={true}
            onBeadClick={(bead, pos, idx) => setBeadSwapWindow({ bead, beadIndex: idx, pos })}
            changedIndices={changedIndices}
          />
        ) : (
          <>
            <BraceletPreview visualBeads={bracelet.visualBeads} size={280} />
            <p className="text-[11px] text-white/40 mt-1">
              Wear on <span className="text-teal-300">{bracelet.wristSide}</span> wrist
            </p>
          </>
        )}
      </div>

      {/* Stone Encyclopedia link */}
      <div className="flex justify-center">
        <button
          onClick={() => setEncyclopediaOpen(true)}
          className="text-[11px] text-teal-400/70 hover:text-teal-300 transition-colors flex items-center gap-1.5 px-3 py-1 rounded-lg hover:bg-white/5"
        >
          <span>💎</span> Stone Encyclopedia — {STONE_DATABASE.length} gemstones reference
        </button>
      </div>
      <StoneEncyclopedia isOpen={encyclopediaOpen} onClose={() => setEncyclopediaOpen(false)} />

      {/* Quality + Element Distribution + Yong Shen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>{quality && <QualityScoreCard quality={quality} />}</div>
        <div>
          <h4 className="text-xs font-semibold text-white/60 mb-2">Element Distribution</h4>
          <ElementRatioBar ratios={bracelet.ratios} />
        </div>
        <div className="text-[10px] text-white/40 bg-white/5 rounded-lg p-2 self-start">
          <span className="text-teal-400/70 font-semibold">Yong Shen:</span>{' '}
          {yongShen.neededElement} ({yongShen.status === 'collapse_override' ? yongShen.collapseMode : yongShen.status})
          {yongShen.forbiddenElement && (
            <span className="text-red-400/70 ml-2">Avoid: {yongShen.forbiddenElement}</span>
          )}
        </div>
      </div>

      {/* Bracelet Qi — bar chart + spider graph */}
      {engineeredBracelet?.qiTotals && (
        <div className="bg-white/5 rounded-lg p-3 space-y-4">
          <h4 className="text-xs font-semibold text-white/60">Bracelet Qi Output</h4>
          <QiBar qi={engineeredBracelet.qiTotals} showPct />
          <div className="text-[9px] text-white/30 font-mono text-right">
            Total: {Object.values(engineeredBracelet.qiTotals).reduce((s, v) => s + v, 0).toFixed(2)} QiUnits
          </div>
          <div className="flex justify-center">
            <PentagonRadar qi={engineeredBracelet.qiTotals} label="Bracelet Qi" size={220} />
          </div>
        </div>
      )}

      {/* Radar Shift */}
      <RadarShiftPanel radarShift={radarShift} />

      {/* Collapse Diagnosis */}
      {collapseReport && collapseReport.isCollapsed && (
        <CollapseDiagnosisPanel collapse={collapseReport} isDark={true} />
      )}

      {/* Controller Stone Placement Engine */}
      <ControllerStonePanel daYunQi={daYunQi} bracelet={bracelet} engineeredBracelet={engineeredBracelet} />

      {/* Stones with inline substitutes + Goals panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StonesWithSwapPanel
          currentBeads={currentBeads}
          stoneScores={stoneScores}
          allStoneSubstitutes={allStoneSubstitutes}
          swappedBeads={swappedBeads}
          onSwap={handleSwap}
          onReset={handleReset}
        />
        <GoalPanel
          monthBracelets={allMonthBracelets}
          selectedGoal={selectedGoal}
          onGoalChange={setSelectedGoal}
        />
      </div>

      {/* Narrative */}
      {bracelet.narrative && (
        <div className="bg-white/5 rounded-lg p-3">
          <h4 className="text-xs font-semibold text-white/60 mb-1">Remedy Narrative</h4>
          <p className="text-xs text-white/50 whitespace-pre-line leading-relaxed">{bracelet.narrative}</p>
        </div>
      )}

      {/* Notes */}
      {bracelet.notes?.length > 0 && (
        <div className="text-[10px] text-white/30 space-y-0.5">
          {bracelet.notes.map((note, i) => (
            <p key={i}>- {note}</p>
          ))}
        </div>
      )}

      {/* Floating bead swap window — opened by clicking a bead in the ring */}
      {beadSwapWindow && (
        <BeadSwapWindow
          bead={beadSwapWindow.bead}
          beadIndex={beadSwapWindow.beadIndex}
          originalBead={originalBeads?.[beadSwapWindow.beadIndex]}
          substitutes={allStoneSubstitutes[beadSwapWindow.bead?.stone?.name] || []}
          onSwap={(idx, replacement) => { handleSwapByIndex(idx, replacement); setBeadSwapWindow(null); }}
          onSwapAll={(element, replacement) => { handleSwapAllByElement(element, replacement); setBeadSwapWindow(null); }}
          onRevert={(idx) => { handleRevertBead(idx); setBeadSwapWindow(null); }}
          onClose={() => setBeadSwapWindow(null)}
          elementBeadCount={(currentBeads || []).filter(b => !b.isBridge && b.element === beadSwapWindow.bead?.element).length}
          initialPos={{ x: Math.min(beadSwapWindow.pos.x + 12, window.innerWidth - 370), y: Math.min(beadSwapWindow.pos.y + 12, window.innerHeight - 420) }}
        />
      )}
    </div>
  );
}
