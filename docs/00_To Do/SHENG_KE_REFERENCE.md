# Sheng (生) & Ke (克) — Five Element Cycle Reference

_The creation and control cycles that govern Qi dynamics in the Zodiac Anatomy engine._

---

## The Two Fundamental Cycles

Traditional Chinese Medicine holds that the Five Elements (Wu Xin / 五行) relate to each other through two interlocking cycles:

| Cycle | Chinese | Meaning | Function |
|-------|---------|---------|----------|
| **Sheng** | 生 | Creation / Nourishment | Parent feeds child — maintains growth |
| **Ke** | 克 | Control / Restraint | Grandparent restrains grandchild — prevents excess |

Together, these cycles maintain dynamic equilibrium. Without Sheng, nothing grows. Without Ke, nothing is contained. Health is the balance between the two.

---

## The Sheng (生) Creation Cycle

**Water → Wood → Fire → Earth → Metal → Water**

Each element nourishes the next, like a parent feeding a child.

```
        🔥 Fire
       ↗       ↘
   🌳 Wood      🏔️ Earth
      ↑            ↓
   🌊 Water ← ⚔️ Metal
```

| Parent | Child | Nourishment Logic |
|--------|-------|-------------------|
| **Water** → Wood | Water nourishes trees | Kidney Jing feeds Liver Blood |
| **Wood** → Fire | Wood fuels flame | Liver Qi drives Heart activity |
| **Fire** → Earth | Fire creates ash/soil | Heart warmth supports Spleen digestion |
| **Earth** → Metal | Earth yields ore | Spleen Qi supports Lung function |
| **Metal** → Water | Metal channels water (condensation) | Lung Qi descends to nourish Kidney |

### Sheng in the 36-Row Atlas

When Sheng mode is active, Qi flows through organ groups by element:

| Flow Step | From Element | To Element | Example Organs |
|-----------|-------------|------------|----------------|
| 1 | Water (Femur, Plasma, Lumbar, PFC, DMN, Lymph Fluid) | → Wood | Water organs nourish Wood organs |
| 2 | Wood (Skeletal Muscle, Tendons, Nerves, Liver, Bile, Cervical) | → Fire | Wood organs fuel Fire organs |
| 3 | Fire (Synapses, SA Node, LV, RV, SI, RBC, Thoracic, Neocortex) | → Earth | Fire organs warm Earth organs |
| 4 | Earth (Smooth Muscle, Vagus, Stomach, Diaphragms, Lymph Nodes) | → Metal | Earth organs feed Metal organs |
| 5 | Metal (Rib Cage, LI, Bronchioles, Lungs, Alveoli, WBC, Immune) | → Water | Metal organs replenish Water organs |

---

## The Ke (克) Control Cycle

**Water → Fire → Metal → Wood → Earth → Water**

Each element restrains the one two steps ahead in the Sheng cycle. This prevents any element from growing unchecked.

```
        🔥 Fire
       ↗   ✕   ↘
   🌳 Wood  ✕  🏔️ Earth
      ✕            ✕
   🌊 Water ✕ ⚔️ Metal
```

| Controller | Controlled | Restraint Logic |
|------------|-----------|-----------------|
| **Water** → Fire | Water extinguishes flame | Kidney cools Heart excess |
| **Fire** → Metal | Fire melts metal | Heart heat controls Lung |
| **Metal** → Wood | Axe cuts tree | Lung Qi restrains Liver rising |
| **Wood** → Earth | Roots penetrate soil | Liver controls Spleen overwork |
| **Earth** → Water | Earth dams water | Spleen contains Kidney fluid |

### Ke in the 36-Row Atlas

When Ke mode is active and an organ is clicked:

- **Red arrows** → organs this one controls (e.g., Wood organ → all Earth organs)
- **Blue arrows** ← organs that control this one (e.g., Metal organs → this Wood organ)
- **Red halos** on controlled organs
- **Blue halos** on controller organs

#### Example: R13 Liver Core (Wood 木)

| Relationship | Direction | Element | Organs |
|-------------|-----------|---------|--------|
| **Controls** | Wood → Earth | 🏔️ | R0 Smooth Muscle, R8 Vagus, R15 Stomach, R24-26 Diaphragms, R33 Lymph Nodes |
| **Controlled by** | Metal → Wood | ⚔️ | R3 Rib Cage, R17 Large Intestine, R18-20 Lungs, R23 WBC, R35 Immune Signaling |

#### Example: R9 SA Node (Fire 火)

| Relationship | Direction | Element | Organs |
|-------------|-----------|---------|--------|
| **Controls** | Fire → Metal | ⚔️ | R3 Rib Cage, R17 LI, R18-20 Lungs, R23 WBC, R35 Immune |
| **Controlled by** | Water → Fire | 🌊 | R4 Femur, R5 Spinal Ribs, R21 Plasma, R27 Lumbar, R30 PFC, R32 DMN, R34 Lymph Fluid |

---

## Pathology: When Cycles Break Down

| Pattern | Chinese | Meaning | Body Signal |
|---------|---------|---------|-------------|
| **Sheng Excess** | 母病及子 | Mother overwhelms child | Liver (Wood) over-fuels Heart (Fire) → anxiety, palpitations |
| **Sheng Deficiency** | 子病及母 | Child drains mother | Heart (Fire) depletes Liver (Wood) → irritability, insomnia |
| **Ke Excess** (Over-control) | 相克太過 | Controller is too strong | Lung (Metal) over-restrains Liver (Wood) → depression, stiffness |
| **Ke Deficiency** (Under-control) | 相克不及 | Controller is too weak | Lung (Metal) fails to restrain Liver (Wood) → anger, Liver Qi stagnation |
| **Counter-Ke** (Rebellion) | 相侮 | Controlled element rebels | Liver (Wood) overwhelms Lung (Metal) → cough with anger, chest tightness |

---

## Sheng + Ke Together: The Diagnostic Framework

For any organ in the atlas, the full TCM diagnostic picture is:

```
                    Controlled by (Ke source)
                          ↓
    Nourished by    →  [ORGAN]  →    Nourishes
    (Sheng parent)                   (Sheng child)
                          ↓
                    Controls (Ke target)
```

This four-directional relationship map is the foundation of the Health Module.

---

## Implementation in the Engine

| Component | File | Status |
|-----------|------|--------|
| Wu Xin element assignments (36 rows) | `organCosmogram.js` → `ROW_ELEMENT` | Complete |
| Sheng cycle routing | `organCosmogram.js` → `getTcmFlowEdges()` | Complete |
| Ke relationship lookup | `organCosmogram.js` → `getKeRelationships()` | Complete |
| Sheng parent/child helpers | `organCosmogram.js` → `shengParent()`, `shengChild()` | Complete |
| Ke target/source helpers | `organCosmogram.js` → `keTarget()`, `keSource()` | Complete |
| 3D visualization (Mythic mode) | `ZodiacBody3D.jsx` → QiFlowLines | Complete |
| 3D visualization (Sheng mode) | `ZodiacBody3D.jsx` → QiFlowLines (TCM) | Complete |
| 3D visualization (Ke mode) | `ZodiacBody3D.jsx` → KeFlowLines | Complete |
| Mode toggle (Mythic / 生 Sheng / 克 Ke) | `ZodiacBody3D.jsx` bottom bar | Complete |
| TCM organ system data | `organSystems.js` | Complete |
| Qi adjustment pipeline | `qiAdjustmentFlow.js` | Complete |

---

_Auto-generated for the Zodiac Anatomy engine. Source data: `organCosmogram.js`, `organSystems.js`, `qiAdjustmentFlow.js`._
