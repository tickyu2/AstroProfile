# Compatibility Engine Tuning Log

## Engine: `src/utils/zodiacCompatibilityEngine.ts`

Five-layer directional compatibility engine computing a 36x36 cusp matrix.

---

## Current Coefficients (v3 — 2026-04-09)

### Wu Xing Cycle Coefficients (E-layer)
| Coefficient | Value | Meaning |
|---|---|---|
| K_GEN_GIVE | +25 | A generates B's element (A feels nurturing) |
| K_GEN_RECV | +35 | B generates A's element (A feels supported) |
| K_CTRL_OVER | 0 | A controls B's element (neutral — controlling someone isn't a gift) |
| K_CTRL_UNDER | -85 | B controls A's element (A feels constrained — painful) |
| K_COSINE | 50 | Base resonance from vector similarity |

### Aspect Anchors (A-layer)
| Aspect | Distance | Anchor |
|---|---|---|
| Conjunction | 0 | 78 |
| Near-conjunction | 1 | 74 |
| Semi-sextile zone | 2 | 70 |
| Semi-sextile | 3 | 68 |
| Sextile | 6 | 75 |
| Square | 9 | 68 |
| Trine | 12 | 82 |
| Quincunx | 15 | 55 |
| Opposition | 18 | 70 |

### Psychology Sigmoid (P-layer)
- Center: 0.72, Slope: 12
- Output clamp: [10, 97]
- Formula: `sigmoid = 1 / (1 + exp(-12 * (cos - 0.72)))`

### Similarity Dampeners
| Type | Threshold | Max Penalty | Effect at 1.0 |
|---|---|---|---|
| Element | 0.96 | 20% | x0.80 |
| Psychology | 0.93 | 15% | x0.85 |

### Rescale
- Formula: `(dampened - 48) * (48/21) + 52`
- Clamp: [48, 97]

### Layer Weights
| Layer | Weight |
|---|---|
| Elemental (E) | 0.25 |
| Modality (M) | 0.15 |
| Aspect (A) | 0.15 |
| Seasonal (Q) | 0.20 |
| Psychology (P) | 0.25 |

---

## Profile Adjustments (v3)

### Aries Family — Softened Peaks
Aries profiles had extreme Wood + Fire dominance, creating a double control-channel penalty
(Wood->Earth and Fire->Metal) that made Aries columns uniformly penalized.

Peaks were shaved ~3% and redistributed to Earth/Metal/Water:
- AR-PI: Wood 1.135->1.10, Fire 1.065->1.03, Earth 0.915->0.95, Metal 0.715->0.75
- AR: Wood 1.10->1.07, Fire 1.10->1.07, Earth 0.95->0.97, Metal 0.75->0.77, Water 0.70->0.72
- AR-TA: Wood 1.00->0.98, Fire 1.165->1.13, Earth 0.9825->1.00, Metal 0.7875->0.81, Water 0.70->0.72

Aries columns still have fewer A-tier scores (0 incoming 90+), which is realistic — Aries energy
is admired but intense to receive.

### Aquarius-Pisces — Sharpened from Flat
AQ-PI had an overly flat element vector creating universal appeal (16 golden cells in column).
Sharpened Wood higher, dropped Metal and Earth:
- Wood 1.1575->1.22, Fire 0.9025->0.90, Earth 0.875->0.83, Metal 0.6675->0.62, Water 0.8175->0.85

Reduced from 16 to 11 A-tier incoming. Still high, but AQ-PI is known as the "cosmic empath"
cusp — the most universally appealing cusp in pop astrology.

### Pure Gemini — Sharpened from Flat
Gemini had Fire 1.20 + Earth 1.00 + Metal 0.85 creating a spread profile that was hard
to constrain (low Wood/Water meant control cycles had nothing to penalize).
Sharpened Fire dominance, lowered Earth and Metal:
- Fire 1.20->1.28, Earth 1.00->0.93, Metal 0.85->0.78

Reduced from 14 to 10 A-tier incoming.

---

## Matrix Analytics: A-tier vs Mutual A-tier

### A-tier Column Count (Sociability / Social Openness)
Counts how many archetypes score 90+ **toward** a given archetype (column).
This measures **how easy it is to connect with this person** — social warmth, approachability,
likability. It's a one-directional measure: "everyone feels great around you."

High A-tier column count = Social butterfly / Universally appealing energy
- Gemini (col 8): 10 — social magnet, adaptable charm
- AQ-PI (col 33): 11 — cosmic empath, universal warmth
- Aries family (cols 1-4): 0 — polarizing intensity

### Mutual A-tier (True Compatibility)
Counts pairs where **both** directions score 90+ (A->B >= 90 AND B->A >= 90).
This measures **deep reciprocal compatibility** — both people feel great about each other.

The distinction is significant:
- Total A-tier cells: ~115
- Total mutual A-tier pairs: ~30
- Only ~25% of A-tier feelings are reciprocated at A-tier level

**Key insight:** Being liked is not the same as being compatible. The most socially popular
archetypes (high column A-tier) don't necessarily have the most mutual A-tier connections.
True compatibility requires resonance in both directions — not just one-sided charm.

This mirrors real human relationships: the most likable people aren't always the ones
who form the deepest mutual bonds.

---

## Tuning Lessons Learned

1. **The rescale amplifier**: The stretch formula (x2.3) amplifies all upstream changes.
   A 10-point change to K_CTRL_UNDER creates a ~23-point swing in final scores.
   Always change ONE variable at a time and observe.

2. **Flat profiles = universal appeal**: When an archetype's element vector is too flat
   (no strong peaks), it avoids triggering control-cycle penalties from anyone.
   The fix is profile sharpening, not global coefficient changes.

3. **Stacking changes cascade**: Five simultaneous coefficient changes that each seem
   modest (2-3 points) can compound multiplicatively through weighted layers and rescale,
   collapsing the entire distribution.

4. **Column asymmetry tells a story**: Different A-tier counts per column reflect
   real personality dynamics — some signs are universally warm, others are polarizing.
   This is a feature, not a bug.
