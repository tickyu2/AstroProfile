# Monthly Qi Adjustment Pipeline — React Flow Diagram

A node-by-node breakdown of the full pipeline, designed to map
directly onto React Flow nodes and edges.

## Pipeline Graph

```
┌─────────────┐     ┌──────────────┐
│  ATFQ (60%) │     │ ACYMFQ (40%) │
│  Natal Qi   │     │  Transit Qi  │
└──────┬──────┘     └──────┬───────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌──────────────┐
│   Pass A    │     │   Pass B     │
│ Natal 克    │     │ Transit 克   │
│ internal    │     │ internal     │
└──────┬──────┘     └──────┬───────┘
       │                   │
       ▼                   │
┌─────────────┐            │
│   Pass C    │◄───────────┘
│ Transit →   │  (transit attacks natal,
│ Natal 克    │   not reduced)
└──────┬──────┘
       │
       ▼
┌──────────────┐
│  Recombine   │
│ PassC + PassB│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Sheng     │
│     (生)     │
│ Parent feeds │
│ child +3%   │
│ cap 20%     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Damping    │
│     (耗)     │
│  All x 0.98 │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Transform    │
│     (化)     │
│ >1.5 & >3:1 │
│ 30% → child │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    MFFQ      │
│ Month Final  │
│ Functional   │
│ Qi Output    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Yong Shen   │
│  + Stone Rx  │
└──────────────┘
```

## React Flow Node Definitions

Each node below maps to a React Flow `<Node>` with its label and description.

### Node 1: ATFQ
- **Label:** ATFQ (60%)
- **Description:** Your natal Total Functional Qi, scaled to 60%. This is the structural "car" — your permanent elemental architecture.
- **Color:** Blue border
- **Type:** Input

### Node 2: ACYMFQ
- **Label:** ACYMFQ (40%)
- **Description:** Current Year + Month Functional Qi, scaled to 40%. This is the "weather" — the environmental modulation for this period.
- **Color:** Orange border
- **Type:** Input

### Node 3: Pass A — Natal Internal Clashes
- **Label:** Pass A: Natal 克
- **Description:** Your own elements fighting each other. Structural tensions that have always existed. Victim -10% of attacker, attacker -2%.
- **Color:** Red accent
- **Input:** ATFQ
- **Output:** ATFQ after internal clashes

### Node 4: Pass B — Transit Internal Clashes
- **Label:** Pass B: Transit 克
- **Description:** Year and Month pillars clashing with each other — the weather's own turbulence, independent of you. Same rates as Pass A.
- **Color:** Red accent
- **Input:** ACYMFQ
- **Output:** ACYMFQ after internal clashes

### Node 5: Pass C — Transit Presses Natal
- **Label:** Pass C: Transit → Natal 克
- **Description:** The environment pressing on you. Transit elements attack natal elements they control. One-directional: natal is the victim, transit is not reduced. The weather doesn't lose energy by hitting you.
- **Color:** Dark red accent
- **Input:** Pass A result + Pass B result
- **Output:** ATFQ after directional pressure

### Node 6: Recombine
- **Label:** Recombine
- **Description:** Pass C natal result + Pass B transit result = post-clash NTFQ. The two pools merge back into one combined Qi landscape.
- **Color:** Purple accent
- **Input:** Pass C natal + Pass B transit
- **Output:** Post-clash NTFQ

### Node 7: Sheng Nourishment
- **Label:** Sheng (生)
- **Description:** The Generating Cycle. Strong parent feeds its child: +3% of parent, capped at 20% of child. Parent is not drained. Gentle rebuilding after the storm.
- **Color:** Green accent
- **Input:** Post-clash NTFQ
- **Output:** Post-sheng Qi

### Node 8: Universal Damping
- **Label:** Damping (耗)
- **Description:** All elements x 0.98. The baseline cost of existing — natural friction, entropy, environmental resistance. Small but universal.
- **Color:** Gray accent
- **Input:** Post-sheng Qi
- **Output:** Post-damping Qi

### Node 9: Transformation
- **Label:** Transformation (化)
- **Description:** Extreme alchemy. If attacker > 1.5 pts AND ratio > 3:1, then 30% of victim transmutes into the controlling element's child. Rare and dramatic.
- **Color:** Gold accent
- **Input:** Post-damping Qi
- **Output:** Post-transformation Qi

### Node 10: MFFQ
- **Label:** MFFQ Output
- **Description:** Month Final Functional Qi — the finished elemental landscape for this month. Drives Yong Shen identification and stone/crystal recommendations.
- **Color:** Emerald border
- **Type:** Output

### Node 11: Prescriptions
- **Label:** Yong Shen + Stone Rx
- **Description:** The weakest or most needed element becomes the Yong Shen (用神). Stones and crystals are mapped to strengthen that element.
- **Color:** Crystal/diamond accent
- **Type:** Output

## Edge Definitions

```
ATFQ ──────→ Pass A
ACYMFQ ────→ Pass B
Pass A ────→ Pass C
Pass B ────→ Pass C (directional input, not reduced)
Pass B ────→ Recombine (transit result)
Pass C ────→ Recombine (natal result)
Recombine ─→ Sheng
Sheng ─────→ Damping
Damping ───→ Transformation
Transform ─→ MFFQ
MFFQ ──────→ Yong Shen + Stone Rx
```
