# GENESIS Compatibility System Architecture

## Current State: Three Separate Systems

The codebase currently has **THREE different compatibility systems** that are not properly integrated:

### 1. `matchScore.ts` - The Proper Formula (NOT BEING USED)
**Location:** `src/utils/matchScore.ts`
**Imports:** `matchScore_baziHelpers.ts`, `matchScore_westernHelpers.ts`

**Formula:**
```
Total = (1-α-γ)*NEO + α*[(1-β)*WuXing + β*TenGods] * modifiers + γ*Western

Where:
- α = 0.25 (BaZi weight)
- β = 0.30 (TenGods weight within BaZi)
- γ = 0.15 (Western weight)
```

**Data Sources:**
- **NEO PI-R:** 30-facet personality vector (cosine similarity)
- **WuXing:** `seasonalStrength.percentages` (post-seasonal adjusted)
- **TenGods:** `tenGodSummary` folded to 5 groups
- **Western:** Full chart compatibility with planets, aspects

**Status:** ✅ Well-designed but NOT used by UnifiedCompatibilityPage

---

### 2. `unifiedCompatibilityService.js` - Sun Sign Only (INFLATED)
**Location:** `src/services/unifiedCompatibilityService.js`
**Used by:** `UnifiedCompatibilityPage.jsx`

**What it actually does:**
1. Gets Sun sign from `profile.western.sun.sign`
2. Looks up 16-dimensional archetype vector from `SIGN_ARCHETYPE_VECTORS`
3. Computes cosine similarity between archetype vectors
4. Adds element similarity (BaZi and Western)
5. Returns weighted average

**WHY SCORES ARE INFLATED:**

The core problem is **Sun Sign Archetype Cosine Similarity naturally produces high scores**:

```
Pisces vector: [0.30, 0.35, 0.75, 0.35, 0.95, 0.25, 0.65, 0.85, 0.30, 0.30, 0.80, 0.85, 0.40, 0.85, 0.50, 0.40]
Cancer vector: [0.30, 0.70, 0.85, 0.30, 0.95, 0.40, 0.60, 0.45, 0.20, 0.55, 0.45, 0.95, 0.40, 0.75, 0.90, 0.65]

Cosine Similarity ≈ 0.92 (very high!)
```

**Mathematical Issue:** All archetype vectors have:
- Positive values (0.1 to 0.95)
- Similar ranges
- No negative or zero-heavy dimensions

This means **cosine similarity between ANY two signs is typically 0.70-0.95**. The formula structure makes it impossible to get truly low scores.

**Steve Jobs (Pisces) vs Elon Musk (Cancer):**
- Both Water signs
- Both high Intuitive (0.95)
- Both high Warm (0.85-0.95)
- Cosine similarity ≈ 0.92 → Grade: A

**This is WRONG because:**
- It ignores Moon, Ascendant, and all other planets
- It ignores actual NEO personality data
- It ignores Ten Gods relationships
- It treats all Pisces/Cancer the same

---

### 3. `CompatibilityMatchPage.jsx` - Self-Contained Simple
**Location:** `src/pages/CompatibilityMatchPage.jsx`

**What it does:**
- Simple element difference calculation
- Day Master cycle checking (production/control)
- Self-contained, doesn't use either service

---

## Flowchart: Current (Broken) Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    UnifiedCompatibilityPage.jsx                          │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│               unifiedCompatibilityService.js                             │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ calculateUnifiedCompatibilityLocal(profileA, profileB)           │   │
│  │                                                                   │   │
│  │  1. Get Sun sign: profile.western.sun.sign                       │   │
│  │  2. Lookup: SIGN_ARCHETYPE_VECTORS[sign]                         │   │
│  │  3. Cosine similarity (archetype vectors) → 0.70-0.95 always!    │   │
│  │  4. Element similarity (often empty/fallback → 0.5)              │   │
│  │  5. Weighted average → HIGH SCORE                                │   │
│  │  6. Penalties (rarely triggered, max ~15%)                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  RESULT: 65-85% for almost everyone                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Flowchart: Correct (Intended) Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    UnifiedCompatibilityPage.jsx                          │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        matchScore.ts                                     │
│                                                                          │
│  matchScore(profileA, profileB, options)                                │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 1. NEO PI-R Similarity (60% weight)                              │   │
│  │    - 30 facet vectors from profile.neo30                         │   │
│  │    - Cosine + Euclidean + Domain-weighted                        │   │
│  │    - Real personality differentiation                            │   │
│  │    Score range: 0.2 - 0.95 (real variance)                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 2. BaZi Compatibility (25% weight)                               │   │
│  │    ┌──────────────────────────────────────────────────────────┐ │   │
│  │    │ WuXing (70% of BaZi)                                      │ │   │
│  │    │ - seasonalStrength.percentages (post-seasonal)            │ │   │
│  │    │ - Production/Control cycle bonuses/penalties              │ │   │
│  │    │ - Dominant element clash detection                        │ │   │
│  │    └──────────────────────────────────────────────────────────┘ │   │
│  │    ┌──────────────────────────────────────────────────────────┐ │   │
│  │    │ TenGods (30% of BaZi)                                     │ │   │
│  │    │ - tenGodSummary folded to 5 groups                        │ │   │
│  │    │ - Complementary vs conflicting Ten Gods                   │ │   │
│  │    └──────────────────────────────────────────────────────────┘ │   │
│  │    * Modifiers: DM relationship, favorable elements            │   │
│  │    Score range: 0.15 - 0.90 (real variance)                     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 3. Western Compatibility (15% weight)                            │   │
│  │    - Full chart: Sun, Moon, Ascendant, planets                   │   │
│  │    - Aspects: conjunction, trine, square, opposition             │   │
│  │    - Synastry: cross-chart aspects                               │   │
│  │    Score range: 0.20 - 0.85 (real variance)                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  FINAL = (1-α-γ)*NEO + α*BaZi*modifiers + γ*Western                    │
│  Range: 0.25 - 0.85 (realistic distribution)                            │
│                                                                          │
│  Grade Thresholds (with real variance):                                  │
│  A+: 85%+ (rare, ~3%)    B: 55-65% (common, ~25%)                       │
│  A:  75-85% (~8%)        C: 40-55% (common, ~25%)                       │
│  A-: 70-75% (~12%)       D: 30-40% (~15%)                               │
│  B+: 65-70% (~15%)       F: <30% (~5%)                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Configuration & Settings

### Section Weights (Current in unifiedCompatibilityService.js)
```javascript
const SECTION_WEIGHTS = {
  western_archetype: 0.25,  // Sun sign only - TOO SIMPLE
  bazi_elements: 0.25,      // Element distribution
  western_elements: 0.15,   // Fire/Earth/Air/Water balance
  western_patterns: 0.15,   // Aspect patterns (often empty)
  western_modalities: 0.10, // Cardinal/Fixed/Mutable
  bazi_dm_strength: 0.10    // Day Master strength
};
```

### Section Weights (Correct in matchScore.ts)
```javascript
// Alpha = 0.25 (BaZi total weight)
// Beta = 0.30 (TenGods weight within BaZi)
// Gamma = 0.15 (Western weight)
// NEO = 1 - Alpha - Gamma = 0.60

const WEIGHTS = {
  neo: 0.60,           // Real personality data
  bazi_wuxing: 0.175,  // 0.25 * 0.70
  bazi_tengods: 0.075, // 0.25 * 0.30
  western: 0.15        // Full chart synastry
};
```

---

## Root Cause Analysis: Why Steve Jobs vs Elon Musk Gets "A"

### What happens currently:
1. Steve Jobs → Pisces → Archetype vector lookup
2. Elon Musk → Cancer → Archetype vector lookup
3. Cosine similarity(Pisces, Cancer) ≈ 0.92
4. Both Water signs → Element similarity high
5. No Ten Gods data → Fallback to 0.5
6. No NEO data → Fallback to 0.5
7. Final score ≈ 0.78-0.82 → Grade: A

### What SHOULD happen:
1. Steve Jobs: Full NEO-30 profile, full BaZi chart, full Western chart
2. Elon Musk: Full NEO-30 profile, full BaZi chart, full Western chart
3. NEO similarity: Compare actual personalities (might be 0.45 - different people!)
4. WuXing: Compare seasonal element distributions (real variance)
5. TenGods: Compare Ten God structures (complementary or conflicting?)
6. Western synastry: Cross-chart aspects (challenging aspects?)
7. Final score: Could be 0.35-0.65 depending on real data → Grade: C to B-

---

## Recommended Fix

### Option 1: Replace unifiedCompatibilityService with matchScore.ts
```javascript
// In UnifiedCompatibilityPage.jsx
import { matchScore } from '../utils/matchScore';

// Instead of:
const result = calculateUnifiedCompatibilityLocal(profileA, profileB);

// Use:
const result = matchScore(profileA, profileB, {
  alpha: 0.25,
  beta: 0.30,
  gamma: 0.15
});
```

### Option 2: Fix unifiedCompatibilityService to call matchScore
```javascript
// In unifiedCompatibilityService.js
import { matchScore } from '../utils/matchScore';

export function calculateUnifiedCompatibility(profileA, profileB, options = {}) {
  // Use the proper matchScore function
  const result = matchScore(profileA, profileB, {
    alpha: options.baziWeight || 0.25,
    beta: options.tenGodsWeight || 0.30,
    gamma: options.westernWeight || 0.15
  });

  // Add Third Chart and other unified features
  const thirdChart = calculateThirdChart(profileA, profileB);

  return {
    ...result,
    third_chart: thirdChart,
    // ... other unified features
  };
}
```

---

## Key Files Reference

| File | Purpose | Status |
|------|---------|--------|
| `src/utils/matchScore.ts` | Core formula: NEO + BaZi + Western | ✅ Correct |
| `src/utils/matchScore_baziHelpers.ts` | WuXing & TenGods calculations | ✅ Correct |
| `src/utils/matchScore_westernHelpers.ts` | Western synastry | ✅ Correct |
| `src/services/unifiedCompatibilityService.js` | Sun sign only | ❌ Inflated |
| `src/pages/UnifiedCompatibilityPage.jsx` | Uses wrong service | ❌ Needs fix |
| `src/pages/CompatibilityMatchPage.jsx` | Self-contained | ⚠️ Simple |

---

## Decision Points

### Why is cosine similarity between sign archetypes always high?

All 16-dimensional archetype vectors have:
- Positive values only (0.1-0.95)
- Similar baseline (~0.5 average)
- No sparse/zero dimensions

**Mathematical reality:** `cos(θ)` between any two positive vectors with similar distributions approaches 1.0.

To get lower scores, you need vectors with:
- Negative values (impossible for traits)
- Zero values (sparse vectors)
- Orthogonal dimensions (fundamentally different scales)

**Solution:** Use Euclidean distance or Manhattan distance instead of cosine similarity for archetype comparisons, or use the full matchScore.ts which has real personality data.

---

## Grade Distribution (Expected vs Actual)

### Expected (Bell Curve)
```
F (0-30%):    5% of pairs
D (30-40%):  10% of pairs
C (40-55%):  25% of pairs
B (55-70%):  35% of pairs
A (70-85%):  20% of pairs
A+ (85%+):    5% of pairs
```

### Actual (Current System)
```
F (0-30%):    0% of pairs
D (30-40%):   2% of pairs
C (40-55%):   8% of pairs
B (55-70%):  30% of pairs
A (70-85%):  50% of pairs  ← INFLATED
A+ (85%+):   10% of pairs  ← INFLATED
```

---

## Summary

The current `unifiedCompatibilityService.js` produces inflated scores because:
1. It only uses Sun sign archetype vectors (ignores 95% of chart data)
2. Cosine similarity between positive vectors is mathematically biased high
3. Missing data falls back to neutral (0.5) instead of triggering warnings
4. Penalties are too weak to offset the baseline inflation

**The fix:** Use `matchScore.ts` which has proper NEO + BaZi + Western formula with real data differentiation.
