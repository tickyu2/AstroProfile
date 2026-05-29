# Synergy — Wu Xing Generation Cycle Amplification

## Position in Pipeline

```
Natal Pipeline → NTFQ
                          ↓
DaYun (raw) ──→ Scale to NTFQ total ──→ DaYun′
Year  (raw) ──→ Scale to NTFQ total ──→ Year′   ──→ ★ SYNERGY ★ ──→ DaYun″ Year″ Month″
Month (raw) ──→ Scale to NTFQ total ──→ Month′
                                                            ↓
                              MTFQ = 1.0×NTFQ + 0.9×DaYun″ + 0.5×Year″ + 0.3×Month″
```

Synergy sits **after NTFQ-scaling** and **before MTFQ blending**.
It modifies only external layers (DaYun, Year, Month) — never NTFQ.

---

## Classical Foundation

The Wu Xing producing (生 shēng) cycle:

| Generator | Generated | Classical meaning |
|-----------|-----------|-------------------|
| Wood (木) | Fire (火) | Wood feeds Fire |
| Fire (火) | Earth (土) | Fire creates Earth (ash) |
| Earth (土) | Metal (金) | Earth bears Metal (ore) |
| Metal (金) | Water (水) | Metal enriches Water (condensation) |
| Water (水) | Wood (木) | Water nourishes Wood |

**Key metaphysical property:** This is **generative**, not conservative.
- The generator does NOT lose Qi.
- The generated element GAINS Qi.
- Qi is **created** through transformation.
- This is not a closed system — it is a catalytic process.

Professional BaZi masters (Joey Yap, Raymond Lo, Master Chan) apply this
principle **qualitatively** in readings. Our engine translates it into a
**quantitative, computational model** for the Qi physics pipeline.

---

## The Synergy Matrix

Generation-only matrix with coefficient **k = 0.2** (exported as `SYNERGY_K`):

| Generator → Generated | Wood | Fire | Earth | Metal | Water |
|------------------------|------|------|-------|-------|-------|
| **Wood**               | 0    | 0.2  | 0     | 0     | 0     |
| **Fire**               | 0    | 0    | 0.2   | 0     | 0     |
| **Earth**              | 0    | 0    | 0     | 0.2   | 0     |
| **Metal**              | 0    | 0    | 0     | 0     | 0.2   |
| **Water**              | 0.2  | 0    | 0     | 0     | 0     |

---

## Baby-Step Calculation

### Step 1: Sum External Qi (post-scaling, pre-synergy)

For each element, sum the three external layers:

```
External[el] = DaYun′[el] + Year′[el] + Month′[el]
```

**Example** (Chunmei Lu, March 2026):
```
External = { Wood: 0.18, Fire: 0.12, Earth: 0.08, Metal: 0.15, Water: 0.10 }
```

### Step 2: Seasonal Synergy Factor

The generator's expressiveness in the current month modulates the synergy
coefficient within a gentle **0.8–1.2** band:

```
E = generator's seasonal expressiveness (0.2–1.0, from 旺相休囚死 matrix)
S = 0.8 + 0.4 × (E − 0.2) / 0.8
κ_eff = κ_base × S
```

| Expressiveness | Season state | S factor | κ_eff |
|---------------|-------------|----------|-------|
| E = 0.2 (Dead 死) | Out of season | 0.80 | 0.160 |
| E = 0.4 (Imprisoned 囚) | Weakened | 0.90 | 0.180 |
| E = 0.6 (Resting 休) | Neutral | 1.00 | 0.200 |
| E = 0.8 (Prospering 相) | Growing | 1.10 | 0.220 |
| E = 1.0 (Flourishing 旺) | Peak season | 1.20 | 0.240 |

### Step 3: Compute Per-Element Synergy Gains

For each generator→generated pair:

```
gain[generated] += κ_eff × External[generator]
```

**Example** (March, 卯 — Wood flourishing):
```
Seasonal: Wood E=1.0, Fire E=0.8, Earth E=0.4, Metal E=0.2, Water E=0.6

Wood  → Fire:   κ=0.2 × S=1.20 (E=1.0) × 0.18 = +0.043 Fire
Fire  → Earth:  κ=0.2 × S=1.10 (E=0.8) × 0.12 = +0.026 Earth
Earth → Metal:  κ=0.2 × S=0.90 (E=0.4) × 0.08 = +0.014 Metal
Metal → Water:  κ=0.2 × S=0.80 (E=0.2) × 0.15 = +0.024 Water
Water → Wood:   κ=0.2 × S=1.00 (E=0.6) × 0.10 = +0.020 Wood
```

```
Synergy gains = { Wood: 0.020, Fire: 0.043, Earth: 0.026, Metal: 0.014, Water: 0.024 }
Total new Qi created = 0.127 pts
```

Notice: In March, Wood is flourishing (S=1.20) so Wood→Fire produces **more** Fire.
Metal is dead (S=0.80) so Metal→Water produces **less** Water.

### Full 12-Month Synergy Matrix

Each cell shows: **E** (expressiveness) → **S** (synergy factor) → **κ_eff** (effective coefficient)

S = 0.8 + 0.4 × (E − 0.2) / 0.8 &nbsp;&nbsp;|&nbsp;&nbsp; κ_eff = 0.2 × S

| Month | Branch | Wood→Fire | Fire→Earth | Earth→Metal | Metal→Water | Water→Wood |
|-------|--------|-----------|------------|-------------|-------------|------------|
| **Feb** | 寅 | E=1.0 S=1.20 **κ=0.240** | E=0.8 S=1.10 **κ=0.220** | E=0.4 S=0.90 **κ=0.180** | E=0.2 S=0.80 **κ=0.160** | E=0.6 S=1.00 **κ=0.200** |
| **Mar** | 卯 | E=1.0 S=1.20 **κ=0.240** | E=0.8 S=1.10 **κ=0.220** | E=0.4 S=0.90 **κ=0.180** | E=0.2 S=0.80 **κ=0.160** | E=0.6 S=1.00 **κ=0.200** |
| **Apr** | 辰 | E=0.8 S=1.10 **κ=0.220** | E=0.4 S=0.90 **κ=0.180** | E=1.0 S=1.20 **κ=0.240** | E=0.2 S=0.80 **κ=0.160** | E=0.6 S=1.00 **κ=0.200** |
| **May** | 巳 | E=0.6 S=1.00 **κ=0.200** | E=1.0 S=1.20 **κ=0.240** | E=0.8 S=1.10 **κ=0.220** | E=0.2 S=0.80 **κ=0.160** | E=0.4 S=0.90 **κ=0.180** |
| **Jun** | 午 | E=0.6 S=1.00 **κ=0.200** | E=1.0 S=1.20 **κ=0.240** | E=0.8 S=1.10 **κ=0.220** | E=0.4 S=0.90 **κ=0.180** | E=0.2 S=0.80 **κ=0.160** |
| **Jul** | 未 | E=0.4 S=0.90 **κ=0.180** | E=0.8 S=1.10 **κ=0.220** | E=1.0 S=1.20 **κ=0.240** | E=0.6 S=1.00 **κ=0.200** | E=0.2 S=0.80 **κ=0.160** |
| **Aug** | 申 | E=0.2 S=0.80 **κ=0.160** | E=0.6 S=1.00 **κ=0.200** | E=0.8 S=1.10 **κ=0.220** | E=1.0 S=1.20 **κ=0.240** | E=0.4 S=0.90 **κ=0.180** |
| **Sep** | 酉 | E=0.2 S=0.80 **κ=0.160** | E=0.4 S=0.90 **κ=0.180** | E=0.6 S=1.00 **κ=0.200** | E=1.0 S=1.20 **κ=0.240** | E=0.8 S=1.10 **κ=0.220** |
| **Oct** | 戌 | E=0.4 S=0.90 **κ=0.180** | E=0.2 S=0.80 **κ=0.160** | E=1.0 S=1.20 **κ=0.240** | E=0.8 S=1.10 **κ=0.220** | E=0.6 S=1.00 **κ=0.200** |
| **Nov** | 亥 | E=0.8 S=1.10 **κ=0.220** | E=0.2 S=0.80 **κ=0.160** | E=0.4 S=0.90 **κ=0.180** | E=0.6 S=1.00 **κ=0.200** | E=1.0 S=1.20 **κ=0.240** |
| **Dec** | 子 | E=0.6 S=1.00 **κ=0.200** | E=0.2 S=0.80 **κ=0.160** | E=0.4 S=0.90 **κ=0.180** | E=0.8 S=1.10 **κ=0.220** | E=1.0 S=1.20 **κ=0.240** |
| **Jan** | 丑 | E=0.4 S=0.90 **κ=0.180** | E=0.2 S=0.80 **κ=0.160** | E=1.0 S=1.20 **κ=0.240** | E=0.6 S=1.00 **κ=0.200** | E=0.8 S=1.10 **κ=0.220** |

**Reading the table:** Each column is a synergy pair (generator→generated).
The generator's expressiveness E determines S and κ_eff for that month.

**Key patterns:**
- Spring (Feb–Mar): Wood→Fire strongest (κ=0.240), Metal→Water weakest (κ=0.160)
- Summer (May–Jun): Fire→Earth strongest (κ=0.240), Water→Wood weakest (κ=0.160–0.180)
- Autumn (Aug–Sep): Metal→Water strongest (κ=0.240), Wood→Fire weakest (κ=0.160)
- Winter (Nov–Dec): Water→Wood strongest (κ=0.240), Fire→Earth weakest (κ=0.160)
- Earth pivots (Apr, Jul, Oct, Jan): Earth→Metal strongest (κ=0.240)

### Step 3: Redistribute Gains Into Layers

Gains are distributed back into DaYun/Year/Month **proportionally**
to each layer's original share of that element.

For each element:
```
extBefore = DaYun′[el] + Year′[el] + Month′[el]
extAfter  = extBefore + gain[el]

DaYun″[el] = (DaYun′[el] / extBefore) × extAfter
Year″[el]  = (Year′[el]  / extBefore) × extAfter
Month″[el] = (Month′[el] / extBefore) × extAfter
```

This preserves each layer's relative contribution while distributing
the new synergy Qi.

**Edge case:** If `extBefore = 0` for an element (no external Qi),
the gain is split equally among the three layers (gain/3 each).

### Step 4: Feed Into MTFQ Blending

The synergy-enhanced layers replace the pre-synergy layers:

```
MTFQ[el] = 1.0 × NTFQ[el] + 0.9 × DaYun″[el] + 0.5 × Year″[el] + 0.3 × Month″[el]
```

---

## Why Synergy Was Impossible Before NTFQ-Scaling

Before the scaling fix:
- DaYun was ~7× larger than NTFQ
- Year was ~5× larger
- Month was ~3× larger
- Synergy would have caused **runaway amplification**
- Fire, Water, etc. would blow up exponentially
- Collapse detection and BRQe correction would break

After scaling:
- All layers have equal mass (~NTFQ total each)
- Synergy is a small, controlled boost (~20% of each generator)
- No runaway behavior
- Predictable, stable amplification

---

## What Synergy IS and IS NOT

### It IS:
- A modern, computational translation of classical Wu Xing generation physics
- Additive amplification (new Qi is created)
- Applied only to external climate layers (DaYun, Year, Month)
- A controlled, proportional boost based on generator strength
- Grounded in real Wu Xing metaphysics (生 shēng cycle)

### It is NOT:
- Classical BaZi numerical computation (no traditional system quantifies this)
- A transfer or subtraction (no element loses Qi)
- A conservation rule or zero-sum exchange
- Applied to NTFQ (natal constitution is untouched)
- From Joey Yap, Raymond Lo, or any existing software

---

## Elemental "Magnetism" — Amplification Pairs

Some elements naturally amplify each other through the producing cycle:

| Pair | Effect | Classical Reasoning |
|------|--------|-------------------|
| Wood → Fire | +20% Fire | Wood feeds Fire — strong Wood in climate creates more Fire |
| Fire → Earth | +20% Earth | Fire creates ash/Earth — strong Fire in climate creates more Earth |
| Earth → Metal | +20% Metal | Earth bears ore/Metal — strong Earth in climate creates more Metal |
| Metal → Water | +20% Water | Metal condenses Water — strong Metal in climate creates more Water |
| Water → Wood | +20% Wood | Water nourishes Wood — strong Water in climate creates more Wood |

**Practical meaning:**
- A Wood-heavy Da Yun + Fire-heavy Year produces **more Fire** than raw numbers suggest
- A Water-heavy Da Yun + Metal-heavy Month produces **more Water** than raw numbers suggest
- Earth stabilizes but does not amplify without a generator

---

## Implementation Reference

**Source:** `src/utils/qiEngine.ts`
- `SYNERGY_K` — coefficient constant (0.2)
- `SYNERGY_PAIRS` — the 5 generator→generated pairs
- `computeSynergyGains()` — computes per-element gains from external total
- `applySynergyToLayers()` — redistributes gains into DaYun/Year/Month proportionally

**Data:** `QiMonthSnapshot.synergyGains` — per-element Qi created (for UI display)

**Trace:** Steps D.5 and D.6 in the Qi Physics Console show full baby-step math.

---

## Future Extensions

Once synergy is validated, the following can be layered on top:

1. **Polarity weighting** — Yang generators produce slightly more than Yin
2. **Seasonal sine wave modulation** — synergy strength varies by season
3. **Collapse physics** — synergy may trigger or prevent collapse states
4. **BRQe correction vectors** — bracelet stones interact with synergy gains
5. **Qi trajectory smoothing** — synergy affects the 3D trajectory path
6. **Qi survival timeline** — long-term synergy effects across Da Yun decades
