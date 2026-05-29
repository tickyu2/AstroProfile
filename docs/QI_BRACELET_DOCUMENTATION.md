# Qi Bracelet — Functional Element Strength Engine

## Documentation v1.3 — March 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Philosophy](#philosophy)
3. [System Architecture Flowchart](#system-architecture-flowchart)
4. [Layer 1: Pillar Composition](#layer-1-pillar-composition)
5. [Layer 2: Natal TFQ Pipeline](#layer-2-natal-tfq-pipeline)
6. [Layer 3: Monthly Analysis Pipeline](#layer-3-monthly-analysis-pipeline)
7. [Educational Content & MD Files](#educational-content--md-files)
8. [Scoring Reference](#scoring-reference)
9. [Glossary](#glossary)

---

## Overview

The Qi Bracelet page (`/qi-bracelet`) is a **transparent, educational calculation engine** that computes a user's functional elemental Qi — from their natal BaZi Four Pillars of Destiny through to monthly environmental influence — resulting in stone/crystal prescriptions for energetic balance.

It uses **raw Qi points** (not percentages) through a multi-step pipeline, with every calculation visible and expandable in "Khan Academy baby-step" style.

### Key Files

| File | Purpose |
|------|---------|
| `src/pages/QiBraceletPage.jsx` | Main page — UI, pipeline Steps 6–9, inline MD explanations, education panel |
| `src/utils/qiEngine.ts` | Core computation engine — natal Qi, pillar breakdowns, year matrix |
| `src/utils/baziSeasonality.ts` | Seasonal weight multipliers per month |
| `src/components/bazi/molecules/ModularPillarCard.jsx` | Pillar card with hidden stems display |
| `src/data/qiAdjustmentFlow.js` | React Flow node/edge config + pipeline steps data |
| `src/stories/QiAdjustmentPipeline.stories.tsx` | Storybook stories for pipeline components |
| `public/qi-adjustments/` | 21 standalone educational MD files (3 levels x 5 adjustments + unified docs) |

---

## Philosophy

> **60% Natal = Structural Qi** — the architecture of the person. It does not change.
>
> **40% Current Cycle = Modulating Qi** — the weather. Monthly and seasonal forces that amplify, suppress, redirect, distort, or nourish.

The system models **energetic influence**, not destiny prediction. The 60/40 ratio means:
- The car (natal) is always more important than the weather
- But the weather can dramatically change how the car behaves

---

## System Architecture Flowchart

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FOUR PILLARS OF DESTINY                          │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │   YEAR   │  │  MONTH   │  │   DAY    │  │   HOUR   │           │
│  │ Qi = 10% │  │ Qi = 30% │  │ DM = 35% │  │ Qi = 10% │           │
│  │          │  │          │  │ DB = 15% │  │          │           │
│  │ Stem: 1pt│  │ Stem: 1pt│  │ Stem: 1pt│  │ Stem: 1pt│           │
│  │Branch:10 │  │Branch:10 │  │Branch:10 │  │Branch:10 │           │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘           │
│       │              │              │              │                 │
│       └──────────────┴──────┬───────┴──────────────┘                │
│                             │                                       │
│                    LAYER 1: Raw Composition                         │
│                    (stem=1 + branch hidden stems=10)                │
│                             │                                       │
│                    LAYER 2: Per-Pillar Pipeline                     │
│                    A. Stem Element Count                             │
│                    B. Branch Element Count (hidden stems %)          │
│                    C. Birth Season Adjustment (×multiplier)          │
│                    D. Polarity Adjustment (Yang/Yin ×multiplier)     │
│                    E. Qi Weighting (×pillar weight %)                │
│                             │                                       │
│              ┌──────────────┴──────────────┐                        │
│              │   TOTAL FUNCTIONAL QI (TFQ)  │                       │
│              │   = Sum of all pillar FQs    │                       │
│              └──────────────┬──────────────┘                        │
│                             │                                       │
└─────────────────────────────┼───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    MONTHLY ANALYSIS PIPELINE                        │
│                                                                     │
│  ┌──────────────────────────────────────────────┐                   │
│  │  INCOMING YEAR PILLAR    INCOMING MONTH PILLAR│                  │
│  │  (same A–E pipeline)     (same A–E pipeline)  │                  │
│  │  Qi Weight = 10%         Qi Weight = 30%      │                  │
│  │  Season = CURRENT month  Season = CURRENT month│                 │
│  └──────────────┬───────────────────┬────────────┘                  │
│                 │                   │                                │
│          ┌──────┴───────────────────┴──────┐                        │
│          │  STEP 1: CYMFQ                  │                        │
│          │  = CYFQ (Year) + CMFQ (Month)   │                        │
│          └──────────────┬─────────────────┘                         │
│                         │                                           │
│          ┌──────────────┴─────────────────┐                         │
│          │  STEP 2: Influence Panel        │                        │
│          │  TFQ vs CYMFQ comparison        │                        │
│          │  +/- % per element              │                        │
│          └──────────────┬─────────────────┘                         │
│                         │                                           │
│          ┌──────────────┴─────────────────┐                         │
│          │  STEP 3: Normalized 60/40       │                        │
│          │  ATFQ  = TFQ × 60%             │                        │
│          │  ACYMFQ = CYMFQ × 40%          │                        │
│          │  NTFQ = ATFQ + ACYMFQ          │                        │
│          └──────────────┬─────────────────┘                         │
│                         │                                           │
│          ┌──────────────┴─────────────────┐                         │
│          │  STEP 6: Clash Adjustment (克)   │                       │
│          │  Controlling cycle interactions  │                        │
│          │  Victim −10%, Attacker −2%       │                        │
│          └──────────────┬─────────────────┘                         │
│                         │                                           │
│          ┌──────────────┴─────────────────┐                         │
│          │  STEP 7: Sheng Nourishment (生)  │                       │
│          │  Parent feeds child (+3%)       │                        │
│          │  Capped at +20% of child       │                        │
│          └──────────────┬─────────────────┘                         │
│                         │                                           │
│          ┌──────────────┴─────────────────┐                         │
│          │  STEP 7.5: Overcrowding (溢)    │                        │
│          │  Soft bleed-off when dominant   │                        │
│          │  10% excess → child element    │                        │
│          └──────────────┬─────────────────┘                         │
│                         │                                           │
│          ┌──────────────┴─────────────────┐                         │
│          │  STEP 8: Control Cycle Pressure │                        │
│          │  Universal 2% damping (×0.98)   │                        │
│          └──────────────┬─────────────────┘                         │
│                         │                                           │
│          ┌──────────────┴─────────────────┐                         │
│          │  STEP 9: Transformation (化)     │                       │
│          │  Extreme ratio transmutation    │                        │
│          │  30% victim → child element     │                        │
│          └──────────────┬─────────────────┘                         │
│                         │                                           │
│          ┌──────────────┴─────────────────┐                         │
│          │  STEP 10: MFFQ                  │                        │
│          │  Month Final Functional Qi      │                        │
│          │  → Yong Shen + Stone Rx         │                        │
│          └────────────────────────────────┘                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Layer 1: Pillar Composition

Every pillar (Year, Month, Day, Hour) contributes **11 raw points**:

| Component | Points | Source |
|-----------|--------|--------|
| Heavenly Stem (天干) | 1 pt | Single element of the stem |
| Earthly Branch (地支) | 10 pts | Distributed across hidden stems by % |

### Hidden Stems Example

| Branch | Hidden Stem 1 | Hidden Stem 2 | Hidden Stem 3 |
|--------|--------------|--------------|--------------|
| 子 Rat | Yang Water 60% (6 pts) | Yang Wood 30% (3 pts) | — |
| 寅 Tiger | Yang Wood 60% (6 pts) | Yang Fire 30% (3 pts) | Yang Earth 10% (1 pt) |
| 酉 Rooster | Yin Metal 100% (10 pts) | — | — |

---

## Layer 2: Natal TFQ Pipeline

Each pillar goes through a 5-section "baby-step" calculation (A through E):

### Section A: Stem Element Count

For each of the 5 elements, count if the pillar's stem matches (0 or 1 point).

```
Example: Stem = 丙 (Yang Fire)
Wood=0, Fire=1, Earth=0, Metal=0, Water=0
```

### Section B: Branch Element Count

Distribute 10 points across elements per hidden stem percentages.

```
Example: Branch = 寅 Tiger
Hidden stems: 甲 Yang Wood 60%, 丙 Yang Fire 30%, 戊 Yang Earth 10%
Wood = 6.000, Fire = 3.000, Earth = 1.000, Metal = 0.000, Water = 0.000
```

**Raw Total = Stem + Branch**

```
Wood = 0 + 6 = 6.000
Fire = 1 + 3 = 4.000
Earth = 0 + 1 = 1.000
Metal = 0 + 0 = 0.000
Water = 0 + 0 = 0.000
Total = 11.000 pts
```

### Section C: Birth Season Adjustment (Seasonality)

Multiply raw totals by **birth month** seasonal weights.

| Season Level | Chinese | Multiplier | Meaning |
|-------------|---------|------------|---------|
| 旺 Prosperous | Wang | ×1.0 | At peak power |
| 相 Phase | Xiang | ×0.8 | Strong — generated by seasonal element |
| 休 Resting | Xiu | ×0.6 | Moderate — supportive role |
| 囚 Imprisoned | Qiu | ×0.4 | Weakened — controlled by season |
| 死 Dead | Si | ×0.2 | Dormant — overwhelmed by season |

```
Example: Born in Autumn (Metal season)
Wood × 0.4 = 2.400    (Imprisoned — Metal controls Wood)
Fire × 0.2 = 0.800    (Dead — Fire generates the controller)
Earth × 0.8 = 0.800   (Phase — Earth generates Metal)
Metal × 1.0 = 0.000   (Prosperous — in its own season)
Water × 0.6 = 0.000   (Resting)
```

### Section D: Polarity Adjustment

Multiply by Yang or Yin multiplier based on Day Master polarity.

**Yang Day Master multipliers:**

| Element | Multiplier | Rationale |
|---------|-----------|-----------|
| Wood | ×1.15 | Yang expands growth |
| Fire | ×1.05 | Yang slightly amplifies fire |
| Earth | ×1.00 | Neutral |
| Metal | ×1.00 | Neutral |
| Water | ×1.10 | Yang amplifies flow |

**Yin Day Master multipliers:**

| Element | Multiplier | Rationale |
|---------|-----------|-----------|
| Wood | ×0.85 | Yin constrains growth |
| Fire | ×0.95 | Yin slightly dampens fire |
| Earth | ×1.00 | Neutral |
| Metal | ×1.00 | Neutral |
| Water | ×0.90 | Yin constrains flow |

### Section E: Qi Weighting

Apply the pillar's importance weight to get its contribution to TFQ.

| Pillar | Weight | Meaning |
|--------|--------|---------|
| Year (年) | 10% | Ancestry, social environment |
| Month (月) | 30% | Season, career, parents |
| Day Master (日干) | 35% | Core self — the "you" |
| Day Branch (日支) | 15% | Internal reservoir, spouse palace |
| Hour (時) | 10% | Inner mind, children, late life |

```
Functional Qi = Polarity-Adjusted × (Weight / 100)
```

### Total Functional Qi (TFQ)

```
TFQ[element] = Year_FQ + Month_FQ + DayMaster_FQ + DayBranch_FQ + Hour_FQ
```

**The Day Pillar is special** — it splits into two sub-pipelines:
- **Day Master (DM):** Only the stem's 1 point → Season → Polarity → ×35%
- **Day Branch (DB):** Only the branch's points → Season → Polarity → ×15%

---

## Layer 3: Monthly Analysis Pipeline

For each month of the selected year, the system runs this pipeline:

### Incoming Pillar Processing

Both the **Current Year Pillar** and **Current Month Pillar** go through the same A–E baby-step calculation as natal pillars, with two key differences:

1. **Seasonality uses the CURRENT month** (not the birth month)
2. **Qi weights are**: Year = 10%, Month = 30%

### Step 1: Combined Year/Month Functional Qi (CYMFQ)

```
CYFQ = Year Pillar Functional Qi (after A–E with 10% weight)
CMFQ = Month Pillar Functional Qi (after A–E with 30% weight)
CYMFQ[element] = CYFQ[element] + CMFQ[element]
```

### Step 2: Influence Panel

Side-by-side comparison of user's natal TFQ vs incoming CYMFQ:

```
For each element:
  Influence = ((CYMFQ[el] - TFQ[el]) / TFQ[el]) × 100%
```

Highlights weak natal elements receiving seasonal boosts.

### Step 3: Normalized 60/40 — NTFQ

```
ATFQ[element]   = TFQ[element] × 0.60        (Adjusted natal)
ACYMFQ[element] = CYMFQ[element] × 0.40      (Adjusted incoming)
NTFQ[element]   = ATFQ[element] + ACYMFQ[element]
```

Shows Natal % vs Normalized %, with +/- shift per element.

### Step 6: Three-Pass Clash Adjustment — Controlling Cycle (克)

Clashes are computed in **three separate passes** to distinguish internal tensions from environmental pressure. This is metaphysically correct because natal-on-natal, transit-on-transit, and transit-on-natal are three fundamentally different phenomena.

**The five controlling relationships:**

```
Metal → chops → Wood
Water → quenches → Fire
Fire  → melts → Metal
Wood  → penetrates → Earth
Earth → dams → Water
```

**Condition:** Attacker value > Victim value AND Attacker > 0

**Internal clash effect (Passes A & B):**
```
Victim  = Victim  − (Attacker × 0.10)   // 10% of attacker's strength
Attacker = Attacker − (Attacker × 0.02)  // 2% effort cost
```

**Directional clash effect (Pass C):**
```
Victim  = Victim  − (Transit Attacker × 0.10)   // transit presses natal
Transit attacker is NOT reduced                   // weather doesn't lose energy
```

#### Pass A — Natal Internal Tensions (ATFQ)

Apply internal clashes only within the 60% natal Qi pool.

```
ATFQ_afterClash = applyClashes(ATFQ)
```

This reveals structural tensions within the person — diagnostic, shows where the person's own elements fight.

#### Pass B — Transit Internal Clashes (ACYMFQ)

Apply internal clashes only within the 40% year/month Qi pool.

```
ACYMFQ_afterClash = applyClashes(ACYMFQ)
```

This shows how the Year and Month pillars fight each other — weather turbulence.

#### Pass C — Transit → Natal Directional Pressure

Apply **one-directional** clashes: transit elements attack natal elements they control. The natal element is the victim; the transit element is the attacker.

```
ATFQ_afterPressure = applyDirectionalClashes(ATFQ_afterClash, ACYMFQ_afterClash)
```

This is the real "weather hitting the car" — the only pass that modifies the person's functional Qi.

#### Recombination

```
Post-Clash NTFQ = Pass C natal result + Pass B transit result
```

*All values floored at 0.*

### Step 7: Sheng Cycle Nourishment — Generating Cycle (生)

After destructive clashes settle, the productive cycle gently nourishes. A strong parent feeds its child element.

**The Five Generating Relationships:**

| Parent | → | Child | Description |
|--------|---|-------|-------------|
| Wood | → | Fire | Wood feeds Fire |
| Fire | → | Earth | Fire creates Earth (ash) |
| Earth | → | Metal | Earth bears Metal |
| Metal | → | Water | Metal enriches Water |
| Water | → | Wood | Water nourishes Wood |

**Condition:** Parent value > Child value AND Parent > 0

**Effect:**
```
rawBoost = Parent × 0.03               // 3% of parent's strength
maxBoost = Child × 0.20                // capped at 20% of child's current value
boost    = MIN(rawBoost, maxBoost)      // whichever is smaller
Child    = Child + boost                // child is nourished
Parent is NOT reduced                   // gentle nourishment, not exhaustion
```

**Why here?** Sheng is supportive, not destructive. It operates on the post-clash landscape before universal friction. Transformation (化) is extreme crisis-level alchemy and must come last.

### Step 7.5: Overcrowding — Soft Bleed-Off (溢)

When one element dominates the post-Sheng landscape, excess energy softly overflows into its generating-cycle child.

**Trigger conditions (either one):**

| Condition | Threshold |
|-----------|-----------|
| Share of total Qi | > 35% |
| Ratio to five-element average | > 2.0× |

**Effect:**
```
excess   = Element − (Average × 2.0)
rawBleed = excess × 0.10              // 10% of excess
bleed    = MIN(rawBleed, 0.50)        // capped at 0.50 pts
Element  = Element − bleed            // parent loses
Child    = Child + bleed              // child gains (generating cycle)
```

**Overcrowding vs Transformation:**

| | Overcrowding (溢) | Transformation (化) |
|---|---|---|
| Trigger | Share >35% or ratio >2× avg | Attacker >1.5 AND ratio >3:1 |
| Mechanism | Excess overflows to 生 child | Victim transmutes to victim's child |
| Severity | Gentle — 10% of excess, cap 0.50 | Dramatic — 30% of victim |

**Why here?** Sheng may amplify a dominant element further. Overcrowding catches the post-Sheng peak before damping and transformation fire.

### Step 8: Control Cycle Pressure — Universal Damping

All elements experience natural friction:

```
element = element × 0.98   (2% universal loss)
```

Models the cost of maintaining elemental balance — no element exists in isolation.

### Step 9: Transformation — Elemental Transmutation (化)

When one element overwhelms another, the victim **transforms into its productive-cycle child**.

**Rules:**

| Attacker | Victim | Product | Description |
|----------|--------|---------|-------------|
| Fire | Metal | Water | Fire melts Metal → Water |
| Metal | Wood | Fire | Metal chops Wood → Fire |
| Water | Fire | Earth | Water drowns Fire → Earth |
| Wood | Earth | Metal | Wood uproots Earth → Metal |
| Earth | Water | Wood | Earth absorbs Water → Wood |

**Trigger condition:**
```
Attacker > 1.5 pts  AND  (Attacker / Victim) > 3:1
```

**Effect:**
```
melt = Victim × 0.30          // 30% of victim transforms
Victim = Victim − melt
Product = Product + melt       // Added to child element
```

### Step 10: Month Final Functional Qi (MFFQ)

The final output after the full pipeline:

```
MFFQ = applyTransformations(applyControl(applyOvercrowding(applySheng(computeThreePassClashes(ATFQ, ACYMFQ)))))
```

**Pipeline order (and why):**
```
ATFQ (60%)          ACYMFQ (40%)
  ↓                     ↓
Pass A: internal    Pass B: internal
clashes (克)         clashes (克)
  ↓                     ↓
Pass C: transit → natal directional pressure (克)
  ↓                     ↓
Recombine: Pass C result + Pass B result
  ↓
Step 7:    applySheng()         — 生 gentle nourishment
  ↓
Step 7.5:  applyOvercrowding()  — 溢 soft bleed-off (>35% or >2× avg)
  ↓
Step 8:    applyControl()       — 耗 universal friction (×0.98)
  ↓
Step 9:  applyTransformations() — 化 extreme transmutation
  ↓
Step 10: MFFQ                 — final output
```

This drives:
- **Yong Shen (用神) recommendations** — the "useful god" element needed for balance
- **Stone/crystal prescriptions** — specific stones mapped to needed elements

### Design Notes

- **Clashes operate on ATFQ and ACYMFQ separately** via the three-pass system (Pass A: natal internal, Pass B: transit internal, Pass C: transit→natal directional). Sheng, overcrowding, damping, and transformation then operate on the recombined post-clash result.
- **Transit elements are not reduced in Pass C** — the weather doesn't lose energy by pressing on the car.
- **Natal internal clashes (Pass A) are diagnostic** — they reveal where the person's own elements fight, independent of current environmental forces.
- **The Day Pillar's DM/DB split is natal-only** — incoming Year/Month pillars do not split this way.
- **Steps 4–5 are reserved** for future use (e.g., He 合 combinations, San He/San Hui, Void/Emptiness).

---

## Educational Content & MD Files

The Qi Bracelet page includes a multi-layer educational system that explains the adjustment pipeline at three audience levels, plus per-adjustment deep dives.

### In-Page Components

| Component | Location in UI | Description |
|-----------|---------------|-------------|
| `QiEducationPanel` | Above TFQ radar / Monthly Analysis | Expandable panel with SVG pipeline diagram + Beginner/Intermediate/Advanced toggle |
| `PipelineDiagram` | Inside QiEducationPanel | Pure SVG flowchart showing ATFQ/ACYMFQ → 3-pass → Sheng → Damping → Transform → MFFQ |
| "Learn more" toggles | Inside each Step 6–9 panel | Self-contained inline explanation that expands below the step description |

### Inline MD Constants (in `QiBraceletPage.jsx`)

These are embedded directly in the page as template literal strings, rendered as plain text in expandable sections:

| Constant | Used By | Content |
|----------|---------|---------|
| `CLASH_EXPLANATION_MD` | Step 6 "Learn more" | Three-pass clash system, controlling pairs, car metaphor |
| `SHENG_EXPLANATION_MD` | Step 7 "Learn more" | Generating cycle, 3%/20% formula, tailwind metaphor |
| `DAMPING_EXPLANATION_MD` | Step 8 "Learn more" | Universal friction, pipeline ordering rationale |
| `TRANSFORMATION_EXPLANATION_MD` | Step 9 "Learn more" | Transmutation rules, dual trigger, 30% conversion |
| `OVERCROWDING_EXPLANATION_MD` | Step 7.5 "Learn more" | Self-generated instability, bleed-off, thresholds |
| `PIPELINE_OVERVIEW_MD` | — (available) | Unified pipeline summary with car metaphor |
| `BEGINNER_EXPLANATION_MD` | QiEducationPanel (Beginner tab) | Garden metaphor, zero-knowledge, 4 adjustments |
| `INTERMEDIATE_EXPLANATION_MD` | QiEducationPanel (Intermediate tab) | Pipeline mechanics with rates and three-pass overview |
| `ADVANCED_EXPLANATION_MD` | QiEducationPanel (Advanced tab) | Classical BaZi (三關克, 運克命), Chinese terminology |
| `QI_WEIGHTING_MD` | FloatingMdWindow popup | Qi vs Elements, 5W+H, pillar weights |
| `ELEMENTS_COMPOSITION_MD` | FloatingMdWindow popup | Layer 1 raw composition |
| `FUNCTIONAL_QI_MD` | FloatingMdWindow popup | What is Functional Qi |
| `POLARITY_MD` | FloatingMdWindow popup | Yang/Yin multiplier tables |
| `SEASONALITY_MATRIX_MD` | FloatingMdWindow popup | Full 12-month seasonal matrix |

### Public MD Files (`public/qi-adjustments/`)

Standalone markdown files served from `/qi-adjustments/`. Can be fetched by any component or external tool.

#### Per-Adjustment — Full Explanations

| File | Content |
|------|---------|
| `ADJUSTMENT_CLASH.md` | Three-pass clash system, Pass A/B/C, rates, car metaphor |
| `ADJUSTMENT_SHENG.md` | Generating cycle, 3%/20% formula, why after clashes |
| `ADJUSTMENT_DAMPING.md` | Universal 2% friction, pipeline ordering |
| `ADJUSTMENT_TRANSFORMATION.md` | Transmutation rules, worked example, why last |
| `ADJUSTMENT_OVERCROWDING.md` | Self-generated instability, thresholds, bleed formula, car metaphor |

#### Per-Adjustment — Intermediate Level

| File | Content |
|------|---------|
| `INTERMEDIATE_CLASH.md` | Three-pass table, effects, recombination |
| `INTERMEDIATE_SHENG.md` | Generating pairs, formula table, why after clashes |
| `INTERMEDIATE_DAMPING.md` | Rule, what it models, why 2% |
| `INTERMEDIATE_TRANSFORMATION.md` | Trigger conditions, product table, pipeline position |
| `INTERMEDIATE_OVERCROWDING.md` | Trigger conditions, bleed mechanics, pipeline position |

#### Unified & Cross-Cutting

| File | Content |
|------|---------|
| `ADJUSTMENT_OVERVIEW.md` | All 4 phases in one document with pipeline ASCII |
| `ADJUSTMENT_VISUAL_DIAGRAM.md` | Full ASCII pipeline from Four Pillars → MFFQ |
| `ADJUSTMENT_GLOSSARY.md` | All abbreviations, Chinese terms, controlling/generating pairs |
| `ADJUSTMENT_STORY_CAR.md` | Car metaphor — gremlins, roses, tailwinds, monthly example |
| `ADJUSTMENT_BEGINNER.md` | Zero-knowledge: what is Qi, garden metaphor, stone mapping |
| `ADJUSTMENT_INTERMEDIATE.md` | Standalone intermediate: 60/40 blend, three-pass, pipeline table |
| `ADJUSTMENT_ADVANCED.md` | Classical BaZi: 本命內克, 運克命, seasonal strength, limitations |
| `ADJUSTMENT_MERMAID.md` | Mermaid.js diagrams: full pipeline, simplified linear, five element cycles |
| `ADJUSTMENT_REACT_FLOW.md` | React Flow node/edge definitions with labels, colors, types |

### Data & Component Files

| File | Purpose |
|------|---------|
| `src/data/qiAdjustmentFlow.js` | React Flow node/edge JSON config + flat `qiPipelineSteps` array |
| `src/components/qi/QiAdjustmentFlowDiagram.tsx` | Interactive React Flow component (requires `@xyflow/react`) |
| `src/stories/QiAdjustmentPipeline.stories.tsx` | Storybook stories: Pipeline, Education Toggle, Single Step, Qi Bar |
| `tailwind.config.js` | Element color tokens: `element.wood/fire/earth/metal/water` |

---

## Scoring Reference

### Element Colors

| Element | Color | Hex |
|---------|-------|-----|
| Wood 木 | Green | `#22c55e` |
| Fire 火 | Red | `#ef4444` |
| Earth 土 | Amber | `#f59e0b` |
| Metal 金 | Zinc | `#a1a1aa` |
| Water 水 | Blue | `#3b82f6` |

### Point Budgets

| Source | Points |
|--------|--------|
| Each natal pillar (stem + branch) | 11 pts |
| Total natal raw | 44 pts |
| Year Qi budget (qiEngine) | 20 pts |
| Month Qi budget (qiEngine) | 10 pts |

### Qi Weight Distribution

```
Year:       10%  ─┐
Month:      30%   │
Day Master: 35%   ├── = 100%
Day Branch: 15%   │
Hour:       10%  ─┘
```

### Normalization Ratio

```
Natal (TFQ):           60%  — structural skeleton
Year + Month (CYMFQ):  40%  — environmental modulation
```

### Pipeline Reduction Summary

| Step | Cycle | Effect | Magnitude |
|------|-------|--------|-----------|
| 6. Clash Adjustment | 克 Controlling | Three-pass: natal internal, transit internal, transit→natal directional | Victim −10% of attacker, Attacker −2% (internal); Victim −10% of transit attacker, attacker unchanged (directional) |
| 7. Sheng Nourishment | 生 Generating | Strong parent feeds child | Child +3% of parent, capped at +20% of child |
| 7.5 Overcrowding | 溢 Overflow | Dominant element bleeds to child | 10% of excess → generating child, capped at 0.50 pts |
| 8. Control Damping | 耗 Friction | Universal entropy | All ×0.98 |
| 9. Transformation | 化 Transmutation | Extreme ratio alchemy | 30% victim → child element |

---

## Glossary

| Abbreviation | Full Name | Description |
|-------------|-----------|-------------|
| **TFQ** | Total Functional Qi | User's natal elemental profile from all 4 pillars |
| **CYFQ** | Current Year Functional Qi | Year pillar contribution (10% weighted) |
| **CMFQ** | Current Month Functional Qi | Month pillar contribution (30% weighted) |
| **CYMFQ** | Combined Year/Month Functional Qi | CYFQ + CMFQ |
| **ATFQ** | Adjusted Total Functional Qi | TFQ × 60% |
| **ACYMFQ** | Adjusted Combined Year/Month FQ | CYMFQ × 40% |
| **NTFQ** | Normalized Total Functional Qi | ATFQ + ACYMFQ (input to clash pipeline) |
| **MFFQ** | Month Final Functional Qi | Post-pipeline output (after clashes, control, transform) |
| **DM** | Day Master | Day pillar's Heavenly Stem — the core "you" |
| **DB** | Day Branch | Day pillar's Earthly Branch — internal reservoir |
| **FQ** | Functional Qi | Weighted, adjusted elemental energy |

### Chinese Terms

| Term | Pinyin | Meaning |
|------|--------|---------|
| 克 | Kè | Controlling / Overcoming cycle |
| 生 | Shēng | Generating / Producing cycle |
| 溢 | Yì | Overflow / Overcrowding |
| 耗 | Hào | Friction / Exhaustion |
| 化 | Huà | Transformation / Transmutation |
| 用神 | Yòng Shén | "Useful God" — the element needed for balance |
| 天干 | Tiān Gān | Heavenly Stems (10 stems) |
| 地支 | Dì Zhī | Earthly Branches (12 branches) |
| 藏干 | Cáng Gān | Hidden Stems inside a branch |
| 旺 | Wàng | Prosperous — element at peak in its season |
| 相 | Xiàng | Phase — element strong as child of seasonal element |
| 休 | Xiū | Resting — element in moderate supportive role |
| 囚 | Qiú | Imprisoned — element weakened by controlling cycle |
| 死 | Sǐ | Dead — element dormant, overwhelmed by season |

---

*Generated: March 2026 — AstroProfile Qi Bracelet Engine v1.3*
*v1.1: Three-pass clash system (Pass A/B/C), Sheng cycle nourishment (生)*
*v1.2: Educational MD system (19 files), inline "Learn more" toggles, QiEducationPanel, SVG pipeline diagram, Storybook stories, Tailwind element colors, React Flow config*
*v1.3: Overcrowding module (溢) — soft bleed-off when element >35% share or >2× average, 10% excess → generating child, capped at 0.50 pts*
