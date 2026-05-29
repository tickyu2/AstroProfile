# Yong Shen (用神) — The Useful God

The Yong Shen is the single most important concept in professional BaZi
chart reading. It is the element your chart needs most — the "useful god"
that brings balance, health, and favorable outcomes.

Everything in the Qi Bracelet engine — stone prescriptions, monthly
forecasts, forbidden elements — flows from the Yong Shen decision.

---

## What Is Yong Shen?

In classical BaZi, your chart has a Day Master (日主) — the Heavenly Stem
of your Day Pillar. This is "you." The Yong Shen is the element that
best supports your Day Master given the current state of your chart.

Think of it as a doctor's prescription: after examining ALL your
elemental vitals (the full pipeline), the engine prescribes the one
element that would help you most right now.

---

## How Is It Selected?

The Yong Shen engine runs at the very end of the pipeline — after all
nine steps have shaped the Qi landscape:

```
Natal Qi -> Polarity -> Year -> Month -> Season -> Void -> Combos ->
Clash (3-pass) -> Sheng -> Overcrowding -> Control -> Transform ->
[Structural Collapse Check] -> Yong Shen Selection -> Stone Prescription
```

### Normal Charts (No Collapse)

For balanced charts, the engine uses standard deficit-filling logic:

1. **Convert final Qi to percentages** — each element as % of total
2. **Check for critical threat** — any element above 40%?
3. **If no threat** — fill the largest deficits with polarity-matched stones
4. **If threat detected** — apply controlling + exhausting elements

#### Threat Response Logic

When one element dominates (>40%), the engine identifies:

| Role | Relationship | Example (Fire threat) |
|------|-------------|----------------------|
| **Threat** | The dominant element | Fire (45%) |
| **Controller** | What controls the threat | Water controls Fire |
| **Exhaustor** | What the threat produces | Earth exhausts Fire |
| **Mother** | What feeds the threat | Wood feeds Fire |
| **Victim** | What the threat controls | Metal (Fire melts Metal) |

**Prescription**: Use Controller + Exhaustor
**Forbidden**: Threat + Mother (adding Wood would fuel the Fire)

---

## Structural Collapse Overrides

When the Structural Collapse Engine detects an extreme pattern, normal
Yong Shen rules are **completely replaced** by classical special-structure
rules (格局用神). This is the most important upgrade in the engine.

### Why Override?

In a normal chart, you fight imbalance — strengthen the weak, control
the strong. But in a collapsed chart, fighting the dominant force is
like trying to stop a river with your hands. Classical masters recognized
this centuries ago: some charts must be read "in reverse."

### The Four Override Modes

#### 1. Single Dominant — 從旺格 (Follow the Strong)

**Trigger**: One element holds >55% AND leads second place by >20%

**Rule Change**: DO NOT control the dominant. Follow it.

| Normal Logic | Override Logic |
|-------------|---------------|
| Use Water to control Fire | Use Earth (Fire's child) to exhaust |
| Fight the dominant | Flow with the dominant |
| Controller is useful | Controller is FORBIDDEN |

**Why**: The structure is too powerful to resist. A tiny Water stone
cannot stop a roaring Fire. Instead, let Fire produce Earth — this
gently exhausts the dominant without creating destructive conflict.

**Stone Example**: Fire dominates at 60% -> prescribe Earth stones
(Tiger's Eye, Citrine), NOT Water stones (Aquamarine, Lapis).

#### 2. Bi-Polar — 兩神成象 (Two Gods Form Image)

**Trigger**: Top two elements together hold >80%

**Rule Change**: Bridge the two poles instead of balancing five elements.

The chart has become a two-element system. The three minor elements
are too weak to matter. The Yong Shen is the element that mediates
between the two dominant forces.

**Bridge Element**: The child of the primary pole.

**Stone Example**: Wood (45%) + Fire (38%) dominate -> prescribe
Earth stones (Fire's child) to bridge and mediate.

#### 3. Drained — 虛弱 (Deficiency)

**Trigger**: Any element drops below 5%

**Rule Change**: Feed through the mother, not directly.

A critically drained element cannot hold Qi — pouring Water into a
cracked vessel is wasteful. Instead, strengthen the mother element
so it can gradually rebuild what was lost.

| Direct Feeding | Mother Feeding |
|---------------|----------------|
| Give Water stones | Give Metal stones (Metal produces Water) |
| Water leaks out immediately | Metal builds a foundation for Water |
| Temporary fix | Structural repair |

**Forbidden**: The controller of the drained element (would suppress
it further).

**Stone Example**: Water at 3% -> prescribe Metal stones (mother of
Water), NOT Earth stones (Earth controls Water).

#### 4. Inverted — 反局 (Reversed Structure)

**Trigger**: Strongest element is >3x the weakest

**Rule Change**: Use the controller directly (hard counter).

Unlike Single Dominant (where the structure is too strong to fight),
an inverted chart is tilted but not collapsed. Direct intervention
with the controlling element is appropriate and effective.

**Stone Example**: Fire at 35%, Metal at 8% (ratio 4.4x) -> prescribe
Water stones (Water controls Fire) + Earth stones (Fire's child to
exhaust).

---

## Three Yong Shen Statuses

The engine returns one of three statuses for every month:

| Status | Color | Meaning |
|--------|-------|---------|
| `balanced` | Green | No critical threat. Minor deficit filling. |
| `critical_imbalance` | Red | Element >40% dominant. Standard counter-measures. |
| `collapse_override` | Purple | Structural collapse detected. Classical rules override. |

---

## Polarity Matching

Every Yong Shen prescription is polarity-aware:

- **Yang Day Master** (甲 丙 戊 庚 壬) -> Yang stones for "proper control" (正克)
- **Yin Day Master** (乙 丁 己 辛 癸) -> Yin stones for refined correction

Yang stones are heavier, deeper remedies (ocean-depth, mountain-force).
Yin stones are lighter, more precise (stream-flow, breeze-touch).

---

## Forbidden Elements

Every Yong Shen result includes a `forbidden` list — elements that
would make things WORSE. The `forbiddenReason` field explains why
in plain language.

Common forbidden patterns:

| Situation | Forbidden | Why |
|-----------|-----------|-----|
| Fire threat | Wood | Wood feeds Fire (generative cycle) |
| Follow-Strong Fire | Water | Cannot fight a collapsed structure |
| Drained Water | Earth | Earth controls Water (suppresses it further) |
| Inverted Fire | Fire, Wood | Adding fuel to the dominant force |

---

## Stone Prescription Flow

```
Yong Shen Decision
    |
    v
Useful Elements (1-2 elements)
    |
    v
Polarity Filter (match Day Master)
    |
    v
Stone Database Lookup
    |
    v
Ranked Recommendations (up to 4 stones)
    |
    v
Each stone gets:
  - Element alignment
  - Polarity match
  - Priority score
  - Metaphor (classical meaning)
  - Reason (why this stone, this month)
```

---

## Monthly Variation

Yong Shen is recalculated every month because the transit pillars
(Year + Month) change the Qi landscape. A stone that helps in March
may be harmful in July. This is why the Qi Bracelet page shows
per-month stone recommendations.

The full pipeline runs 12 times — once per month — and each month
gets its own Yong Shen decision, collapse check, and stone prescription.

---

## Pipeline Position

```
NTFQ -> Void -> Combos -> Clash(3-pass) -> Sheng -> Overcrowding ->
Control -> Transform -> [Collapse Detection] -> [Yong Shen] -> Stones
```

Yong Shen is the second-to-last step. Only stone selection comes after.
This ensures the Yong Shen sees the COMPLETE picture — every clash,
combination, transformation, and structural pattern has already been
resolved before the prescription is written.
