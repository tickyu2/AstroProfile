# Structural Collapse Detection (格局)

After all pipeline stages complete (Void, Combinations, Clashes, Sheng,
Overcrowding, Control, Transformation), the engine examines whether the
resulting Qi has collapsed into a recognizable extreme structural pattern.

This is a **diagnostic layer** — it does not modify Qi values. It characterizes
the final distribution to guide remedy selection.

---

## Four Collapse Modes

### 1. Single Dominant (從旺格) — "Follow the Strong"

- **Trigger**: One element holds >55% of total Qi AND leads second place by >25%
- **Classical meaning**: The chart has surrendered to one force
- **Remedy strategy**: Support the dominant element, do not fight it
- **Icon**: Mountain

### 2. Bi-Polar (兩神成象) — "Two Gods Form Image"

- **Trigger**: Top two elements together hold >80% of total Qi
- **Classical meaning**: Two forces dominate, squeezing out the other three
- **Remedy strategy**: Mediate between the two poles rather than boosting a deficit
- **Icon**: Balance scale

### 3. Drained Element (虛弱) — "Deficiency"

- **Trigger**: Any element drops below 5% of total Qi
- **Classical meaning**: One aspect of life force is critically depleted
- **Remedy strategy**: Urgent support for the drained element through its
  parent in the generating cycle
- **Icon**: Droplet

### 4. Inverted Ratio (反局) — "Reversed Structure"

- **Trigger**: Strongest element exceeds weakest by >3x ratio
- **Classical meaning**: Structural lopsidedness without full collapse
- **Remedy strategy**: Moderate support for the weak element; structure
  is stressed but not collapsed
- **Icon**: Cycle arrows

---

## Pipeline Position

```
NTFQ -> Void -> Combos -> Clash(3-pass) -> Sheng -> Overcrowding -> Control -> Transform -> [Collapse Detection] -> MFFQ
```

Collapse detection runs on the post-Transform Qi (the final functional values)
as a read-only diagnostic. The MFFQ values are unchanged.

---

## Why This Matters

Standard BaZi analysis assumes a "normal" chart where all five elements
participate. When the pipeline produces extreme distributions, the normal
Yong Shen (useful god) logic may need to be reversed:

- **Normal chart**: Strengthen the weak, control the strong
- **Collapsed chart (從旺格)**: Support the dominant, go with the flow
- **Bi-polar chart**: Balance the two poles, not the five elements

Professional BaZi consultants check for these special structures before
prescribing remedies. The collapse detection automates this assessment.

---

## Collapse-Aware Yong Shen (用神) Rules

When a structural collapse is detected, the normal Yong Shen selection
logic is **overridden** by classical special-structure rules (格局用神).

### Normal Chart (no collapse)
- Strengthen the weak, control the strong
- Standard deficit filling with polarity awareness
- Controller + exhaustor of the threat element

### Single Dominant (從旺格) — Follow the Strong
- **DO NOT** control the dominant element — the structure is too powerful
- **USE** the child element (what the dominant produces) to gently exhaust
- Example: Wood dominates → use Fire (Wood's child) to exhaust
- Influence: **Very High** — completely overrides normal rules

### Bi-Polar (兩神成象) — Bridge the Poles
- **USE** the element that bridges the two dominant elements
- Bridge = child of the primary pole (mediates the flow)
- Example: Wood + Fire dominate → use Earth (Fire's child) to bridge
- Influence: **High** — modifies normal rules

### Drained (虛弱) — Feed Through the Mother
- **DO NOT** feed the drained element directly — it cannot hold Qi
- **USE** the mother (parent in generating cycle) to build foundation
- **AVOID** the controller of the drained element
- Example: Water drained → use Metal (Water's mother), avoid Earth
- Influence: **Medium** — modifies normal rules

### Inverted (反局) — Counter the Dominant
- **USE** the controller of the dominant element (direct intervention)
- **USE** the exhaustor (child of dominant) as backup
- **AVOID** the dominant element and its mother
- Example: Fire excessive → use Water (controller) + Earth (exhaustor)
- Influence: **Medium-High** — modifies normal rules

### Stone Prescription Integration

The collapse mode flows directly into stone selection:
- `status: 'collapse_override'` replaces `'balanced'` or `'critical_imbalance'`
- `collapseMode` field identifies which classical structure applies
- `forbiddenReason` explains WHY certain stones are contraindicated
- `reasoning` provides the full classical justification
