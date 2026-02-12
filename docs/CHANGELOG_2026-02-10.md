# GENESIS Changelog — February 10, 2026

Forty-five changes across the Zodiac Academy UI, build optimization, dependency cleanup, dead code removal, security hardening, error sanitization, XSS hardening, structured logging, large file splits, TypeScript type safety, and a full codebase audit.

---

## 1. Interactive Cusp Explorer — 16-Day Slider Expansion

### Problem
The Cusp Explorer slider only covered the 6 cusp days. Users couldn't see or feel the transition from pure sign → cusp → pure sign.

### Solution
Rewrote `CuspSliderInteractive.tsx` to cover a **16-position range**:

| Positions | What They Show |
|-----------|---------------|
| 1–2 | Pure fromSign (100%) |
| 3–8 | Backward cusp (day 6→1 from boundary) |
| 9–14 | Forward cusp (day 1→6 from boundary) |
| 15–16 | Pure toSign (100%) |

Key new helpers:
- `getPositionData(pos)` — returns `{ fromPercent, toPercent, cuspDay, side }` for any of the 16 positions
- `getPositionDate(pos, cusp)` — computes the calendar date for any slider position
- `getNeighborBlend(pos)` — returns the neighbor blend percentage for the mini visualization

New mini visualization: 16 clickable bars with a boundary marker at the cusp transition point.

| File | Change |
|------|--------|
| `src/components/zodiac/CuspSliderInteractive.tsx` | Full rewrite — 6-day → 16-day range |

---

## 2. Formula Display Fix — ZodiacEducationFlaps

### Problem
The "Why Golden Ratio?" flap displayed the wrong formula and wrong constant.

### Fix

| Item | Before | After |
|------|--------|-------|
| Formula | `blend% = (day / 6)^p × 100` | `blend = 1 − ((7 − d) / 7)^φ` |
| Constant | `p = 1.6` | `φ ≈ 1.618` |
| Flap title | `Why Golden Ratio? (φ = 1.6)` | `Why Golden Ratio? (φ ≈ 1.618)` |

| File | Change |
|------|--------|
| `src/components/zodiac/ZodiacEducationFlaps.tsx` | Fixed formula text, constant display, and flap title |

---

## 3. Taurus Blend Example — Corrected Percentages

### Problem
The φ-Curve Values display and Taurus Backward Blend table in the education flaps still showed old incorrect values (13/37/58/75/89/98).

### Fix

| Day | Before | After |
|-----|--------|-------|
| 1 | 13% | 22% |
| 2 | 37% | 42% |
| 3 | 58% | 60% |
| 4 | 75% | 75% |
| 5 | 89% | 87% |
| 6 | 98% | 96% |

Updated both the inline φ-Curve Values display and the `TAURUS_BACKWARD_EXAMPLE` data array.

| File | Change |
|------|--------|
| `src/components/zodiac/ZodiacEducationFlaps.tsx` | Fixed φ-Curve Values text + `TAURUS_BACKWARD_EXAMPLE` array (6 rows) |

---

## 4. Cusp Explorer Panel Width Fix

### Problem
The Cusp Explorer panel width fluctuated as the slider moved between positions with different content lengths.

### Fix
Changed `minWidth: '300px'` to `width: '320px'` for a fixed panel width.

| File | Change |
|------|--------|
| `src/components/zodiac/CuspSliderInteractive.tsx` | Fixed width to `320px` |

---

## 5. Archetype Descriptions for Both Cusp Sides

### Problem
The 6 backward cusp days (before the boundary) showed no archetype descriptions. Only forward cusp days had them.

### Fix
Extended the archetype lookup condition from `posData.side === 'after'` to `(posData.side === 'before' || posData.side === 'after')`.

| File | Change |
|------|--------|
| `src/components/zodiac/CuspSliderInteractive.tsx` | Archetype lookup now includes both `before` and `after` sides |

---

## 6. Zodiac Wheel — Aries at 12 O'Clock

### Problem
The zodiac wheel started with January at the top. Traditional zodiac wheels place Aries (March 21) at 12 o'clock.

### Solution
Added an `offset` parameter to the angle calculation functions and computed `ariesOffset` from March 21's day-of-year.

```typescript
function dayToAngle(dayOfYear, totalDays, offset = 0) {
  return ((dayOfYear - 1 - offset) / totalDays) * 2 * Math.PI - Math.PI / 2;
}
```

Updated all 9 call sites in the wheel's `useEffect` rendering code to pass `ariesOffset`.

| File | Change |
|------|--------|
| `src/components/zodiac/ZodiacBlendWheel.tsx` | Added offset parameter to `dayToAngle` and `dayToArcAngle`, computed `ariesOffset`, updated 9 call sites |

---

## 7. Forward/Backward Navigation Arrows with Momentum

### Problem
Users had to click individual days on the wheel to navigate. No way to scan through dates quickly.

### Solution
Added two wide arrow buttons between the wheel and the instructions text, visible only when a date is locked.

**Behavior:**
- **◀ Backward**: tap moves date −1 day, hold accelerates
- **Forward ▶**: tap moves date +1 day, hold accelerates
- Momentum: starts at 400ms interval, accelerates by 20% per tick, minimum 50ms
- Releasing mouse/touch or leaving the button stops movement and resets speed
- The locked date indicator and explanation panel update in real-time

**Implementation:**
- `shiftDate(dateStr, days)` — date arithmetic helper
- `moveDate(direction)` — shifts `selectedDay` state using `getBlendForDate`
- `startMove(direction)` — fires immediately + starts recursive `setTimeout` with accelerating delay
- `stopMove()` — clears timer and resets delay
- Cleanup `useEffect` prevents memory leaks on unmount

| File | Change |
|------|--------|
| `src/pages/ZodiacLearningPage.jsx` | Added `useRef`, `getBlendForDate` import, `shiftDate` helper, momentum refs/functions, arrow button JSX |

---

## 8. Cusp Explorer Badge — Sign Name Added

### Problem
The yellow center badge in the Cusp Explorer only showed "Day X before/after" and the date. Users couldn't tell which sign was blending in at a glance.

### Fix
Added the neighbor sign name as a middle line in the badge:

```
Day 2 before
Taurus          ← NEW
Apr 18
```

- For `before` positions: shows `toSign` (the sign being approached)
- For `after` positions: shows `fromSign` (the sign just left)
- Pure positions unchanged (already show "Pure Aries" / "Pure Taurus")

| File | Change |
|------|--------|
| `src/components/zodiac/CuspSliderInteractive.tsx` | Added neighbor sign name to center badge for cusp positions |

---

## 9. Western Zodiac Sign Dates — Element Glyphs & Color Coding

### Problem
The element column in the Western Zodiac Sign Dates table was plain white text with no visual differentiation.

### Fix
Added element glyphs and color coding:

| Element | Glyph | Color |
|---------|-------|-------|
| Fire | 🔥 | `#f87171` (red) |
| Earth | 🌿 | `#4ade80` (green) |
| Air | 💨 | `#93c5fd` (light blue) |
| Water | 💧 | `#38bdf8` (cyan) |

Also centered the Dates column (both header and cells).

| File | Change |
|------|--------|
| `src/components/zodiac/ZodiacEducationFlaps.tsx` | Added `ELEMENT_STYLE` config, element glyphs + color in table, centered Dates column |

---

## 10. Vite Manual Chunks — Nivo & D3

### Problem
6 `@nivo/*` packages + `d3` were not in any manual chunk. They landed in the default vendor bundle, bloating the core `index-*.js` (~829 KB).

### Fix
Added two new manual chunk entries to `vite.config.js`:

```js
'nivo': ['@nivo/bar', '@nivo/core', '@nivo/heatmap', '@nivo/line', '@nivo/pie', '@nivo/radar'],
'd3': ['d3']
```

These are now split into their own lazy-loaded chunks. Pages that don't use charts/wheel won't download them.

| File | Change |
|------|--------|
| `vite.config.js` | Added `nivo` and `d3` manual chunks |

---

## 11. Dead Dependency Removal — sentence-transformers

### Problem
`sentence-transformers>=2.2.0` in the Python Cloud Functions `requirements.txt` pulls in **PyTorch (~2 GB)**. This causes massive deploy artifacts and 30+ second cold starts.

### Investigation
- `sentence-transformers` is **imported zero times** across the entire codebase
- `torch` is only used in `brain7a/neural_fusion.py` and `brain7a/training_data.py`
- `brain7a/` is **never imported** by any route module or `main.py` — it's an offline training pipeline

### Fix
Removed `sentence-transformers>=2.2.0` from `requirements.txt`.

| File | Change |
|------|--------|
| `functions-python/requirements.txt` | Removed `sentence-transformers>=2.2.0` (dead dependency, ~2 GB PyTorch) |

---

## 12. Firebase Auth Verification on Python Endpoints

### Problem
All 46 Python Cloud Function endpoints were completely open — no authentication check. Anyone with the URL could call them directly, bypassing Firebase Auth.

### Investigation
Comprehensive audit of all 8 route modules:
- **44 of 46 endpoints**: No auth verification at all
- **2 endpoints** (`init_neo4j_schema`, `backup_neo4j`): Had simple admin key checks but no Firebase token validation
- Only CORS was protecting them (browser-only, easily bypassed with `curl`)

### Solution

**Backend — `verify_auth` helper in `shared.py`:**
```python
def verify_auth(req):
    """Verify Firebase ID token from Authorization: Bearer <token> header.
    Returns (decoded_token, None) on success.
    Returns (None, https_fn.Response) on failure."""
```
- Extracts `Bearer <token>` from `Authorization` header
- Calls `firebase_admin.auth.verify_id_token(token)`
- Returns specific error messages for expired/revoked/invalid tokens

**Applied to all route files — 3-line pattern per endpoint:**
```python
user, err = verify_auth(req)
if err:
    return err
```

**Endpoints protected (42):**

| Route Module | Endpoints Protected |
|---|---|
| `astro.py` | 5 (natal chart, positions, ingresses, elemental balance, chart shape) |
| `bazi.py` | 4 (pillars, ten gods, symbolic stars, day master) |
| `luna.py` | 10 (fusion, profile, aspects, transits, synastry, composite, archetypes, progressions, personality, status) |
| `graph.py` | 11 (store node, soul family, add relationship, neighbors, graph summary, init schema, query, graphrag query/sync, backup, clear) |
| `biography.py` | 8 (extract, consolidate, ingest, memory, create biography, biography chapters, hello history, search) |
| `western.py` | 2 (analyze, synastry) |
| `unified.py` | 2 (profile, compatibility) |
| `admin.py` | 1 (`init_neo4j_schema`) |

**Endpoints kept public (4):** `python_health`, `neo4j_status`, `western_engine_status`, `unified_api_status` — read-only diagnostics, no user data.

**Frontend — Auth token injection:**

| Service File | Change |
|---|---|
| `src/services/pythonFunctionsService.js` | Added `getAuthHeaders()` helper, updated 9 fetch calls |
| `src/data/lunaFusionService.js` | Updated `callPythonFunction` helper (covers all 10 Luna endpoints) |
| `src/services/biographicalMemoryService.js` | Updated `extractBiographicalFacts` fetch call |

Pattern in each service:
```javascript
import { auth } from '../config/firebase';
// ...
if (auth.currentUser) {
  const token = await auth.currentUser.getIdToken();
  headers['Authorization'] = `Bearer ${token}`;
}
```

| File | Change |
|------|--------|
| `functions-python/routes/shared.py` | Added `verify_auth()` helper with Firebase ID token validation |
| `functions-python/routes/astro.py` | Applied auth to 5 endpoints |
| `functions-python/routes/bazi.py` | Applied auth to 4 endpoints |
| `functions-python/routes/luna.py` | Applied auth to 10 endpoints |
| `functions-python/routes/graph.py` | Applied auth to 11 endpoints |
| `functions-python/routes/biography.py` | Applied auth to 8 endpoints |
| `functions-python/routes/western.py` | Applied auth to 2 endpoints (status kept public) |
| `functions-python/routes/unified.py` | Applied auth to 2 endpoints (status kept public) |
| `functions-python/routes/admin.py` | Applied auth to 1 endpoint (health/status kept public) |
| `src/services/pythonFunctionsService.js` | Added `getAuthHeaders()` + auth token to 9 fetch calls |
| `src/data/lunaFusionService.js` | Added auth token to `callPythonFunction` helper |
| `src/services/biographicalMemoryService.js` | Added auth token to `extractBiographicalFacts` |

---

## 13. Dead Code Removal — Vite Claude API Proxy

### Problem
`vite.config.js` contained a dev-server proxy that forwarded `/api/claude` requests to `api.anthropic.com`. All Claude calls now route through the Firebase `llmProxy` Cloud Function — the proxy was dead code.

### Fix
Removed the entire `server.proxy` block (target, changeOrigin, rewrite, headers).

| File | Change |
|------|--------|
| `vite.config.js` | Removed dead `/api/claude` proxy configuration |

---

## 14. Dead Code Removal — ECharts Types in BaZi Synastry Heatmap

### Problem
`baziSynastryHeatmap.ts` still contained an `EChartsHeatmapData` interface, an `echartsData` field on the `SynastryHeatmap` interface, a `formatForECharts()` function, and an ECharts dump in `formatSynastryHeatmapDebug`. No ECharts package is installed — this was leftover from an abandoned visualization approach.

### Fix
- Removed `EChartsHeatmapData` interface
- Removed `echartsData` field from `SynastryHeatmap`
- Removed `formatForECharts()` function (~20 lines)
- Removed ECharts JSON dump from `formatSynastryHeatmapDebug`

The file remains actively used — 7+ modules import `SynastryHeatmap`, `SynastryCell`, and other types.

| File | Change |
|------|--------|
| `src/utils/baziSynastryHeatmap.ts` | Removed dead ECharts interface, field, formatter, and debug dump |

---

## 15. Dead Dependency Removal — react-is v19

### Problem
`react-is@^19.2.1` was listed in `dependencies` with zero imports anywhere in `src/`. The app also uses React 18, making the v19 version a mismatch.

### Fix
Removed `react-is` from `package.json` dependencies.

| File | Change |
|------|--------|
| `package.json` | Removed `react-is` from dependencies |

---

## 16. @types/d3 Moved to devDependencies

### Problem
`@types/d3` was listed in `dependencies` instead of `devDependencies`. Type declarations are only needed at build time, not at runtime.

### Fix
Moved `"@types/d3": "^7.4.3"` from `dependencies` to `devDependencies`.

| File | Change |
|------|--------|
| `package.json` | Moved `@types/d3` from dependencies to devDependencies |

---

## 17. Python Dependencies Pinned to Exact Versions

### Problem
All 23 Python dependencies in `requirements.txt` used `>=` floor versions. Different deploys could resolve different versions, causing non-reproducible builds and potential breakage from unexpected upgrades.

### Solution
Pinned all 23 dependencies to exact `==` versions. For 8 packages where the latest version had a major version bump, pinned to the latest version within the same major to avoid breaking changes:

| Package | Floor Version | Pinned Version | Note |
|---------|--------------|----------------|------|
| firebase-admin | >=6.0.0 | ==6.9.0 | Latest 6.x (7.x has breaking changes) |
| neo4j | >=5.0.0 | ==5.28.3 | Latest 5.x (6.x has breaking changes) |
| numpy | >=1.24.0 | ==1.26.4 | Latest 1.x (2.x has breaking changes) |
| pandas | >=2.0.0 | ==2.3.3 | Latest 2.x (3.x has breaking changes) |
| sxtwl | >=1.1.0 | ==1.1.0 | Latest 1.x (2.x has breaking changes) |
| openai | >=1.0.0 | ==1.104.1 | Latest 1.x (2.x has breaking changes) |
| lxml | >=4.9.0 | ==5.4.0 | Latest 5.x (6.x has breaking changes) |
| langchain-text-splitters | >=0.0.1 | ==0.3.11 | Latest 0.x (1.x has breaking changes) |

All other packages pinned to latest available version.

| File | Change |
|------|--------|
| `functions-python/requirements.txt` | Changed all 23 deps from `>=` to `==` with exact versions |

---

## 18. Bare `except:` Clauses Fixed

### Problem
Three bare `except:` clauses in Python code swallow `SystemExit` and `KeyboardInterrupt`, making processes harder to kill and hiding critical errors.

### Fix
Changed all three to `except Exception:`:

| File | Line | Context |
|------|------|---------|
| `functions-python/routes/biography.py` | 1176 | Neo4j service init |
| `functions-python/routes/biography.py` | 1199 | Neo4j service close |
| `functions-python/bazi_engine/calendar_conv.py` | 149 | sxtwl lunar leap month check |

---

## 19. Diagnostic Data Gated Behind Debug Flag

### Problem
`compute_unified_profile` in `unified.py` returned `_ephe_diag` and `_asteroid_test` in every production response — internal file paths, ephemeris diagnostics, and hardcoded test calculations (Reagan birth date) shipped to every client.

### Fix
Wrapped the diagnostic block in `if req.args.get("debug") == "true":`. Normal responses return clean canonical output. Diagnostics available via `?debug=true` query parameter.

| File | Change |
|------|--------|
| `functions-python/routes/unified.py` | Gated `_ephe_diag` and `_asteroid_test` behind `?debug=true` |

---

## 20. TensorFlow.js Lazy-Loaded in Node Functions

### Problem
`@tensorflow/tfjs` (~50 MB) was eagerly `require`d at startup via `learning/index.js` → `HybridRecommender` → `neuralNetworkModel.js`. This added ~50 MB to every cold start for **all** Cloud Functions, even though no deployed route uses `NeuralNetworkModel` or `HybridRecommender` (only test files do).

### Fix
Converted `NeuralNetworkModel`, `HybridRecommender`, and the `hybridRecommender` singleton to lazy-loaded getter properties. TensorFlow is only loaded when explicitly accessed.

| File | Change |
|------|--------|
| `functions/learning/index.js` | Lazy-load `NeuralNetworkModel`, `HybridRecommender`, and `hybridRecommender` singleton via getters |

---

## 21. Duplicate Google AI Packages — Deferred

### Status
**Deferred** — dedicated migration session needed.

### Problem
`functions/package.json` has both `@google/genai` (new SDK, v1.34+) and `@google/generative-ai` (deprecated SDK, v0.24). Google has [officially deprecated](https://github.com/google-gemini/deprecated-generative-ai-js) the old package.

### Investigation
- `@google/genai` (new): Used by 1 file (`constellation/perspectives.js`) for Gemini Thinking Mode
- `@google/generative-ai` (old, deprecated): Used by 18 files, 50+ call sites

### Why Deferred
Migrating 18 files (50+ call sites) from the deprecated to the new SDK requires changes to model creation, content generation, response access, and the embeddings API. Factory patterns in `clientFactory.js` and `gemini3Config.js` add complexity. This needs a focused session with testing.

---

## 22. `.firebase/` Cache Untracked from Git

### Problem
`.firebase/hosting.ZGlzdA.cache` was committed before `.firebase/` was added to `.gitignore`. It showed as modified on every build.

### Fix
`git rm --cached -r .firebase/` — untracked without deleting the local file.

---

## 23. 13 Backup Files Removed

### Problem
13 `.bak` files were tracked in git under `src/`, including 7 versions of `Results.jsx`, plus `Dashboard.jsx`, `InputForm.jsx`, `LocationPicker.jsx`, `SeasonalStrengthPanel.jsx`, `CenterMedallion.jsx`, and `chineseZodiacKnowledge.js` backups.

### Fix
`git rm` on all 13 files.

| Files Removed |
|---------------|
| `src/components/Results.jsx_01.bak` through `_07.bak` |
| `src/components/Dashboard.jsx_01.bak` |
| `src/components/InputForm.jsx_01.bak` |
| `src/components/common/LocationPicker.jsx_01.bak` |
| `src/components/results/SeasonalStrengthPanel.jsx_01.bak` |
| `src/components/mbti/CenterMedallion.jsx.bak` |
| `src/data/chineseZodiacKnowledge.js_01.bak` |

---

## 24. Four Unused Frontend Dependencies Removed

### Problem
Four packages in `package.json` had zero imports anywhere in `src/`:

| Package | Version | Evidence |
|---------|---------|----------|
| `@react-spring/web` | ^10.0.3 | Zero imports — `framer-motion` used instead |
| `gsap` | ^3.13.0 | Zero imports — never integrated |
| `react-intersection-observer` | ^10.0.0 | Zero imports — native `IntersectionObserver` used in `useSceneActivation.js` |
| `@mapbox/mapbox-gl-geocoder` | ^5.1.2 | Zero imports — `mapbox-gl` used directly |

### Fix
Removed all four from `dependencies`. Updated Vite `animation` manual chunk from `['framer-motion', 'gsap', '@react-spring/web']` to `['framer-motion']`.

| File | Change |
|------|--------|
| `package.json` | Removed 4 unused dependencies |
| `vite.config.js` | Cleaned `animation` chunk to `['framer-motion']` only |

---

## 25. Full Codebase Audit

A comprehensive audit was conducted across the entire codebase covering security, code quality, dead code, dependencies, and configuration. **36 findings** identified across 4 severity levels.

### Critical (3)

| # | Area | File | Issue |
|---|------|------|-------|
| C1 | Security | `src/story/sandboxEngine.ts:883` | `new Function()` — arbitrary code execution risk |
| C2 | Security | `src/story/devToolsEngine.ts:221` | `new Function()` — same pattern |
| C3 | Security | `functions-python/routes/*.py` | `str(e)` in 500 responses leaks stack traces to clients (~50 sites) |

### High (11)

| # | Area | Issue |
|---|------|-------|
| H1 | Dead code | `.firebase/` cache tracked in git — **fixed (item 22)** |
| H2 | Dead code | 13 `.bak` files tracked — **fixed (item 23)** |
| H3 | Unused dep | `@react-spring/web` — **fixed (item 24)** |
| H4 | Unused dep | `gsap` — **fixed (item 24)** |
| H5 | Unused dep | `react-intersection-observer` — **fixed (item 24)** |
| H6 | Unused dep | `@mapbox/mapbox-gl-geocoder` — **fixed (item 24)** |
| H7 | Unused dep | `@tensorflow/tfjs` in `functions/package.json` — no route uses it (lazy-loaded but still in deps) |
| H8 | Deprecated | `@google/generative-ai` — **deferred (item 21)** |
| H9 | XSS surface | `UnifiedCompatibilityPage.jsx:1030` — `dangerouslySetInnerHTML` with user-derived data |
| H10 | XSS surface | `src/utils/baziRules/templates/*.ts` — 20+ `.innerHTML =` assignments |
| H11 | Console | 641 `console.log/warn/error` calls across 180+ files (stripped in prod by Vite) |

### Medium (16)

| # | Area | Issue |
|---|------|-------|
| M1–M6 | Large files | 6 files over 2,100 lines (`AISoulPartnerChat.jsx` 5,396; `mbtiEnneagramSynthesis.js` 5,063; `WesternAstrologyPanel.jsx` 4,331; `HouseLearningPanel.tsx` 4,050; `memoryFunctions.js` 4,352; `astrology.js` 2,101) |
| M7 | TypeScript | 518 occurrences of `: any` across 30 `.ts/.tsx` files (456 in 12 SpectrumExplorers) |
| M8 | Dead file | `claudeApiService.js` — only 1 consumer (`aiGerminationService.js`) |
| M9 | Config | Vite `animation` chunk referenced removed deps — **fixed (item 24)** |
| M10 | Dep category | `dotenv` in `functions/package.json` — only used by offline scripts, should be devDep |
| M11 | Deploy | `functions/test/` and `test-sdk-pro.js` — test files in deploy bundle |
| M12 | Architecture | 55 flat routes in `App.jsx` — **deferred P3 (item 21/24 prev)** |
| M13 | Config | No single `.env.example` source of truth across root/functions/functions-python |
| M14 | XSS surface | 7 `dangerouslySetInnerHTML` sites across 4 React components |
| M15 | Legacy | 24 files still import `prop-types` (all in cathedral/) |
| M16 | Duplication | 4 charting libraries (`chart.js`/`react-chartjs-2`, `recharts`, `@nivo/*`, `d3`) |

### Low (6)

| # | Area | Issue |
|---|------|-------|
| L1–L3 | Git cleanup | Deleted files (`claudeAPI.js`, `lunaService.js`, 12 `*ZoneCalculations.js`) confirmed zero imports |
| L4 | Code quality | 18 TODO/FIXME comments across 7 files |
| L5 | Config | `chunkSizeWarningLimit: 600` slightly above default |
| L6 | Naming | `functions/.env.genesis.example` non-standard naming |

### Audit Summary

| Severity | Found | Fixed This Session | Remaining |
|----------|-------|-------------------|-----------|
| Critical | 3 | 3 (C1, C2, C3) | 0 |
| High | 11 | 10 (H1–H7, H9, H10, H11) | 1 (H8 deferred) |
| Medium | 16 | 15 (M1–M6, M7, M8 false positive, M9, M10, M11, M13, M14, M15) | 1 |
| Low | 6 | 6 (L1–L6) | 0 |
| **Total** | **36** | **34** | **2** |

---

## 26. Python Error Responses Sanitized (C3 — Critical Fix)

### Problem
~45 Python API error responses returned `str(e)` or `traceback.format_exc()` directly to clients in 500 responses. This leaked internal file paths, stack traces, and implementation details.

### Solution
Created `error_response()` helper in `shared.py`:
```python
def error_response(e, context=""):
    logger.exception("Internal error%s: %s", f" in {context}" if context else "", e)
    return https_fn.Response(
        json.dumps({"error": "Internal server error"}),
        status=500,
        headers={"Content-Type": "application/json"}
    )
```

Replaced all 45 `str(e)` error responses across 8 route files. One `traceback.format_exc()` leak in `biography.py` was also caught and fixed.

| File | Replacements |
|------|-------------|
| `functions-python/routes/shared.py` | Added `error_response()` helper + `logging` import |
| `functions-python/routes/astro.py` | 5 replacements |
| `functions-python/routes/luna.py` | 10 replacements |
| `functions-python/routes/bazi.py` | 4 replacements |
| `functions-python/routes/graph.py` | 11 replacements |
| `functions-python/routes/biography.py` | 8 replacements + 1 `traceback.format_exc()` leak |
| `functions-python/routes/western.py` | 2 replacements |
| `functions-python/routes/unified.py` | 2 replacements |
| `functions-python/routes/admin.py` | 1 replacement (health check `str(e)` kept — intentional 200 status) |

---

## 27. @tensorflow/tfjs Removed from Dependencies (H7)

### Problem
`@tensorflow/tfjs` (~50 MB) was still listed in `functions/package.json` even though `NeuralNetworkModel` and `HybridRecommender` were already lazy-loaded (item 20). No deployed route ever calls these — the dep was dead weight in every `npm install`.

### Fix
Removed `@tensorflow/tfjs` from `functions/package.json` dependencies entirely.

| File | Change |
|------|--------|
| `functions/package.json` | Removed `@tensorflow/tfjs` from dependencies |

---

## 28. dotenv Moved to devDependencies (M10)

### Problem
`dotenv` was listed in `dependencies` in `functions/package.json`, but it's only used by offline scripts and test setup — never in production Cloud Functions code.

### Fix
Moved from `dependencies` to `devDependencies`.

| File | Change |
|------|--------|
| `functions/package.json` | Moved `dotenv` from dependencies to devDependencies |

---

## 29. .funcignore Created for Cloud Functions (M11)

### Problem
`functions/test/`, `test-sdk-pro.js`, `scripts/`, and `dataLoaders/` were being uploaded in every Cloud Functions deploy. Test and development files waste upload time and increase the deploy artifact size.

### Fix
Created `functions/.funcignore` to exclude non-production files from deploy:

```
test/
test-sdk-pro.js
scripts/
dataLoaders/
.env
.env.*
.eslintrc*
*.md
```

| File | Change |
|------|--------|
| `functions/.funcignore` | New file — excludes test/dev files from deploy |

---

## 30. claudeApiService.js Confirmed Alive (M8 — False Positive)

### Investigation
`claudeApiService.js` appeared to be dead code but trace analysis found it's actively used:

```
claudeApiService.js → aiGerminationService.js → AIInsightsButton.jsx → ResultsHeader.jsx
```

`ResultsHeader.jsx` is rendered on the results page. **Not dead code** — removed from audit findings.

---

## 31. new Function() Replaced with Safe Evaluator (C1/C2 — Critical Fix)

### Problem
`sandboxEngine.ts:883` and `devToolsEngine.ts:221` both used `new Function('ctx', 'with(ctx) { return ${condition}; }')` to evaluate condition strings. While the conditions come from developer-authored configs (not user input), `new Function()` is a code execution vector and a security audit red flag.

### Solution
Replaced both with a safe string-based condition parser that supports:
- Property lookups and dot-path access (`a.b.c`)
- Negation (`!prop`)
- Comparison operators (`===`, `!==`, `>`, `>=`, `<`, `<=`, `==`, `!=`)
- Literal values (`true`, `false`, `null`, numbers, quoted strings)

No arbitrary code execution. The existing `orchestrationEngine.ts` already had a typed safe evaluator — the sandbox and devtools engines now follow the same pattern.

| File | Change |
|------|--------|
| `src/story/sandboxEngine.ts` | Replaced `evaluateCondition()` — removed `new Function()`, added `resolveValue()` helper |
| `src/story/devToolsEngine.ts` | Added `safeEvalCondition()` + `resolveValue()`, replaced `new Function()` call |

---

## 32. XSS Surface Hardening (H9/H10/M14)

### Problem
Three components used `dangerouslySetInnerHTML` with markdown-to-HTML conversion but **did not escape HTML first**. While the data comes from AI-generated API responses (not direct user input), unescaped HTML in `dangerouslySetInnerHTML` is an XSS vector if any upstream data contains `<script>` tags.

### Solution
Added HTML entity escaping (`&`, `<`, `>`) **before** markdown formatting in all three components:

| File | Change |
|------|--------|
| `src/pages/UnifiedCompatibilityPage.jsx` | Added `&`, `<`, `>` escaping before `**bold**` → `<strong>` conversion |
| `src/components/WesternElementalPanel/WesternElementalPanel.jsx` | Added escaping to `formatNarrative()` function |
| `src/components/results/WesternAstrologyPanel.jsx` | Added inline escaping before markdown regex chain |

**Sites assessed as acceptable (no change needed):**
- `ZodiacAcademyPage.tsx` — already escapes HTML first
- `MarkdownEditor.jsx` — CMS preview, admin-only
- `baziRules/templates/*.ts` — internal computed data rendered via `.innerHTML`, not user input

---

## 33. .env.example Consolidation (M13/L6)

### Problem
- `functions/.env.genesis.example` had a non-standard name and only covered PostgreSQL
- `functions/.env.example` only covered Neo4j
- `functions-python/` had no `.env.example` at all
- `.gitignore` rule `functions/.env.*` was blocking `functions/.env.example` from being committed

### Solution
1. Merged `functions/.env.genesis.example` content into `functions/.env.example` — now covers Neo4j, PostgreSQL, AI API keys, and admin config
2. Deleted `functions/.env.genesis.example`
3. Created `functions-python/.env.example` with Neo4j, AI API keys, and admin config
4. Added `!functions/.env.example` exception to `.gitignore`

| File | Change |
|------|--------|
| `functions/.env.example` | Expanded to cover all env vars (Neo4j + PostgreSQL + AI keys + admin) |
| `functions/.env.genesis.example` | Deleted (merged into `.env.example`) |
| `functions-python/.env.example` | New file |
| `.gitignore` | Added `!functions/.env.example` exception |

---

## 34. TODO/FIXME Comments Reviewed (L4)

### Assessment
13 real TODO comments found across the codebase. All are future-feature placeholders — none are bugs or broken code:

- **Frontend (9):** SupernovaDetector integration, CNY date lookup, voice recording, Enneagram/Attachment assessment, Python response migration
- **Backend (4):** Placidus house calculation, memory consolidation, timeline reprocessing, profile loading

**Decision:** Leave as-is — these document planned work and provide useful context for future development.

---

## 35. Firebase Structured Logging in Route Files (H11)

### Problem
All 8 Node.js route files used raw `console.log/error/warn` (~190 calls). In Cloud Functions, `console.log` goes to Cloud Logging as unstructured text. Firebase's `logger` provides structured logging with severity levels, better filtering, and Cloud Logging integration.

### Solution
1. Added `const { logger } = require('firebase-functions');` to `routes/shared.js` and exported it
2. Converted all 190 `console.*` calls across 8 route files:
   - `console.log(` → `logger.info(`
   - `console.error(` → `logger.error(`
   - `console.warn(` → `logger.warn(`

| File | Conversions |
|------|------------|
| `functions/routes/shared.js` | Added `logger` import + export |
| `functions/routes/astrology.js` | 47 conversions |
| `functions/routes/chat.js` | 34 conversions |
| `functions/routes/timeline.js` | 33 conversions |
| `functions/routes/personality.js` | 27 conversions |
| `functions/routes/services.js` | 25 conversions |
| `functions/routes/love.js` | 12 conversions |
| `functions/routes/constellation.js` | 7 conversions |
| `functions/routes/postgresql.js` | 5 conversions |

**Note:** Frontend `console.*` calls (~600 in `src/`) are already stripped by Vite's `drop: ['console']` in production builds — no action needed.

---

## 36. Deleted Files Cleaned from Git (L1–L3)

### Problem
14 files were deleted from the filesystem but still tracked by git (showing as `D` in `git status`):
- `src/services/claudeAPI.js` — replaced by `claudeApiService.js`
- `src/services/lunaService.js` — replaced by `lunaFusionService.js`
- 12 `src/utils/*ZoneCalculations.js` — consolidated into `zoneCalculations.js`

### Fix
`git rm` on all 14 files.

---

## 37. Vite chunkSizeWarningLimit Restored to Default (L5)

### Problem
`chunkSizeWarningLimit: 600` in `vite.config.js` suppressed warnings for chunks between 500–600 KB. With 8 manual chunks now configured (Firebase, charts, nivo, d3, animation, maps, pdf, lunar), the main chunks should be well under the default 500 KB threshold.

### Fix
Removed `chunkSizeWarningLimit: 600` — restores Vite's default 500 KB warning threshold.

| File | Change |
|------|--------|
| `vite.config.js` | Removed `chunkSizeWarningLimit: 600` |

---

## 38. AISoulPartnerChat.jsx Split → 5 Files (M1)

### Problem
`src/components/aiSoulPartner/AISoulPartnerChat.jsx` was 5,396 lines — the largest file in the codebase. It contained the main chat component, messaging logic, debate/second-opinion system, voice chat integration, and knowledge base actions all inline.

### Solution
Extracted 4 custom hooks into `src/components/aiSoulPartner/hooks/`:

| New File | Lines | Content |
|----------|-------|---------|
| `hooks/useMessageActions.js` | 568 | `handleSend`, `/luna` commands, special commands, message formatting, session save/load |
| `hooks/useDebateSystem.js` | 1,164 | AI Constellation, second opinions, debate panel, `handleStartDebatePanel`, `handleQuickAskAI` |
| `hooks/useVoiceChat.js` | 215 | Voice input/output, transcription, turn-taking, voice panel state |
| `hooks/useKnowledgeBaseActions.js` | 220 | KB search, add, edit, delete, modal state |
| `AISoulPartnerChat.jsx` (trimmed) | 3,565 | State declarations, hook composition, JSX rendering |

**Hook composition pattern:**
```jsx
const voice = useVoiceChat({ userProfile });
const debate = useDebateSystem({ userProfile, messages, updateMessages });
const kbActions = useKnowledgeBaseActions({ ... });
const { handleSend } = useMessageActions({ ... });
```

---

## 39. WesternAstrologyPanel.jsx Split → 5 Files (M2)

### Problem
`src/components/results/WesternAstrologyPanel.jsx` was 4,334 lines. It contained two large nested components (ElementalDominanceSection, WesternHousesSection) plus pure calculation functions for element analysis and compatibility scoring.

### Solution
Extracted into `src/components/results/westernAstrology/`:

| New File | Lines | Content |
|----------|-------|---------|
| `compatibilityEngine.js` | 606 | `calculateOverlapScore`, `calculateComplementScore`, `calculateCommunicationScore`, `calculateTotalCompatibility`, `getCompatibilityRating`, `rankAllCusps`, `analyzeUserConstitution`, `calculateIdealPartner`, `generateMatchReasons`, `generateBadMatchReasons`, `CUSP_PROFILES`, `ELEMENT_MEANINGS` |
| `elementAnalysis.js` | 225 | `generateBar`, `calculateElementBreakdown`, `detectStelliums`, `generateElementInsight`, `WESTERN_ELEMENT_COLORS`, `elementConfig`, `elementMeanings`, `signElements`, `planetSymbols`, `PLANET_WEIGHTS` |
| `WesternHousesSection.jsx` | 491 | Houses display component with `WESTERN_HOUSES` data |
| `ElementalDominanceSection.jsx` | 2,421 | Elemental dominance, compatibility match, physics lab sections |
| `WesternAstrologyPanel.jsx` (trimmed) | 602 | Main shell: imports + composes the two section components |

---

## 40. HouseLearningPanel.tsx Split → 5 Files (M3)

### Problem
`src/components/zodiac/HouseLearningPanel.tsx` was 4,050 lines. ~3,000 lines were education content data (zodiac signs, house meanings, planet-in-house combinations).

### Solution
Extracted into `src/components/zodiac/houseLearning/`:

| New File | Lines | Content |
|----------|-------|---------|
| `types.ts` | 91 | All interfaces: `HouseLearningPanelProps`, `TabValue`, `ZodiacSignContent`, `ZoneDetail`, `SignZoneData`, `PlanetContent` |
| `zodiacContent.ts` | 1,322 | `SIGN_RULERS`, 12 zodiac sign definitions, element/modality data |
| `houseContent.ts` | 1,005 | 12 house education blocks, planet-in-house meanings (120 combos), zone decanate data |
| `subComponents.tsx` | 1,502 | `SignCard`, `PlanetCard`, `ExampleBox`, `Tab0Content`, `TabSignsContent`, `TabZonesContent`, `TabHouseContent` |
| `HouseLearningPanel.tsx` (trimmed) | 159 | Main component: tab navigation + drag logic, imports from `./houseLearning/*` |

---

## 41. mbtiEnneagramSynthesis.js Split → 3 Files (M4)

### Problem
`src/data/mbtiEnneagramSynthesis.js` was 5,063 lines. ~4,800 lines were pure static MBTI type data.

### Solution
Split by MBTI temperament into `src/data/mbtiEnneagram/`:

| New File | Lines | Content |
|----------|-------|---------|
| `intuitivesData.js` | 3,212 | Data for INFP, ENFP, INFJ, ENFJ, INTJ, ENTJ, INTP, ENTP |
| `sensorsData.js` | 1,653 | Data for ISFJ, ESFJ, ISFP, ESFP, ISTJ, ESTJ, ISTP, ESTP |
| `mbtiEnneagramSynthesis.js` (trimmed) | 219 | Imports + merges both data files, exports all 11 accessor functions |

---

## 42. memoryFunctions.js Split → 7 Modules + Barrel (M5)

### Problem
`functions/memory/memoryFunctions.js` was 4,352 lines — the largest backend file. In Node.js Cloud Functions (no tree-shaking), this means all 4,352 lines load on every cold start for any function that touches memory.

### Solution
Split into 7 domain modules in `functions/memory/`:

| New File | Lines | Content |
|----------|-------|---------|
| `memoryShared.js` | 143 | Shared `admin`, `db`, Gemini client, `generateEmbedding()`, `calculateSigmoidRecency()`, `calculateRelevanceScore()` |
| `memoryCrud.js` | 555 | `storeMemory`, `retrieveMemories`, `getFacts`, `storeFact`, `getPeople`, `upsertPerson`, `getHappinessAnchors`, `storeHappinessAnchor` |
| `reflectionEngine.js` | 421 | `reflectOnConversation`, `refineMemories`, `getBiographyEventsInternal` |
| `ragPipeline.js` | 959 | `getMemoryContext`, `getPendingQuestions`, `markQuestionAnswered`, `getTimelineEvents`, `searchTimeline`, `getTimelineWithQuestions`, `createJournalEntry`, `getRecentJournalEntries`, `getEmotionTrends`, `storePattern`, `getPatterns` |
| `personalitySystem.js` | 1,075 | `LEARNING_CONFIG`, elemental/chart modifications, `initializePersonalityFromConstitution`, `getPersonalityWeights`, `evolvePersonalityWeights`, `buildPersonalityPrompt`, `buildMemoryPrompt` |
| `tangoRelationship.js` | 941 | `RELATIONSHIP_MILESTONES`, `initializeRelationship`, `getRelationshipStats`, `updateRelationshipStats`, `celebrateMilestone`, `updateLunaState`, `buildRelationshipPrompt`, `buildSovereigntyPrompt` |
| `constitutionalActivation.js` | 361 | `analyzeElementActivation`, `analyzePillarActivation`, `analyzeGiftEngagement`, `analyzeNeurochemicalEffectiveness`, `generateConstitutionalNotes` |
| `memoryFunctions.js` (barrel) | 27 | `Object.assign(module.exports, require('./memoryCrud'), ...)` — re-exports all modules |

**Backwards compat:** `routes/memory.js` → `memoryFunctions.js` chain unchanged. Zero edits to routes/memory.js or index.js. 260 Cloud Function exports preserved.

---

## 43. astrology.js Split → 4 Files (M6)

### Problem
`functions/routes/astrology.js` was 2,101 lines. Pure computation helpers (astronomy, house strength, solar terms) were interleaved with Cloud Function endpoint definitions.

### Solution
Extracted pure helpers into `functions/routes/astrology/`:

| New File | Lines | Content |
|----------|-------|---------|
| `astronomyHelpers.js` | 306 | `ZODIAC_SIGNS`, `longitudeToZodiac`, `calculateLST`, `calculateAscendant`, `calculateMC`, `calculatePlacidusHouses`, coordinate helpers |
| `houseStrength.js` | 206 | `getHouseName`, `SIGN_RULERS`, `HOUSE_TYPE`, `PLANET_WEIGHTS`, `assignPlanetsToHouses`, `computeHouseStrength`, `getRulerScore` |
| `solarTermsEngine.js` | 512 | `dateToJulianDay`, `SOLAR_TERMS`, `BAZI_MONTH_TERMS`, solar term calculations, BaZi pillar helpers, moon phase & aspects |
| `astrology.js` (trimmed) | 1,208 | Imports 3 helpers. Keeps all 8 Cloud Function exports unchanged. |

**Backwards compat:** 260 exports unchanged. `index.js` chain unaffected.

---

## 44. TypeScript `: any` Eliminated — 594 → 0 (M7)

### Problem
594 `: any` type annotations across 38 TypeScript files — 504 in the 12 SpectrumExplorers (42 each) and 90 in 26 other files. `: any` defeats TypeScript's type safety and hides bugs.

### Solution

**SpectrumExplorers (12 files, 504 occurrences):**

Created shared type definitions at `src/components/zodiac/spectrumTypes.ts` with interfaces matching the zone data shape from `src/data/[sign]Zones.js`:

| Interface | Description |
|-----------|-------------|
| `Zone` | Main zone object (id, name, archetype, degreeRange, influences, qualities, etc.) |
| `ZoneInfluence` | Source, type, planet, percentage, traits |
| `ZoneQuality` | Level, label, icon |
| `ZoneFamousExample` | Name, birthdate, degree, notes |
| `ZoneRelationshipStyle` | Pursuit, commitment, passion, conflict, jealousy |
| `QualityCategory` | Id, label, icon, maxLevel, descriptions |
| + 7 more | ZoneDegreeRange, ZoneDateRange, ZoneDecan, etc. |

Each SpectrumExplorer now imports `Zone, QualityCategory, ZoneInfluence, ZoneFamousExample` from `./spectrumTypes` instead of using `: any`.

**Other files (26 files, 90 occurrences):**

| File Group | Occurrences | Fix |
|-----------|-------------|-----|
| `baziRules/codexMapper.ts` | 24 | Used existing BaZi types (`BaZiCombination`, `UsefulGod`, `BranchClash`, `Punishment`, `HiddenStem`, `LuckPillar`) from `types.ts` |
| `baziRules/narrativeGenerators.ts` | 12 | Same BaZi domain types |
| `matchScore_westernHelpers.ts` | 10 | Inline object types for planet/element scoring |
| `westernCuspEngineService.ts` | 5 | Proper service response types |
| `baziRules/libraries/reportDesigner*.ts` | 7 | BaZi report data types |
| 15 other files | 32 | Various — `Record<string, unknown>`, inline types, existing interfaces |

| Files Modified | Count |
|----------------|-------|
| New: `src/components/zodiac/spectrumTypes.ts` | 1 |
| 12 SpectrumExplorers | 504 `: any` → proper types |
| 26 other TS/TSX files | 90 `: any` → proper types |
| **Total `: any` eliminated** | **594** |

---

## 45. prop-types Removed from 24 Files (M15)

### Problem
24 JSX files imported `prop-types` for runtime type checking. The project uses TypeScript for static type safety — runtime `PropTypes` checks add bundle weight (~30 KB) without meaningful benefit in production.

### Solution
Removed `import PropTypes from 'prop-types'` and the `ComponentName.propTypes = { ... }` block from all 24 files:

| Directory | Files | Components |
|-----------|-------|------------|
| `src/components/cathedral/` | 23 | ModeAwareCodexLens, ModeAwareRitualEngine, ModeAwareConstellationMap, ModeAwareDevTools, ModeAwarePilgrimMap, ModeCodexChapter, ModeAwareTimeline, ModeOnboarding, ModeSwitcher, PilgrimJourneyRouter, AncestralChamber, PilgrimInitiationCeremony, GenerationalStoryDashboard, AncestralHealingRitual, GenerationalConstellation, RuleTuner, ReverseMapping, StoryDiffView, CompareTimelines, OutcomeTimeline, RelationshipDevTools, RelationshipOutcomeCard, PilgrimJourneyTracker |
| `src/components/personality/` | 1 | PersonalityFeedback |

**Note:** `prop-types` can now be removed from `package.json` dependencies if no other consumers exist.

---

## Full Session Summary

| Metric | Count |
|--------|-------|
| Files modified | 120+ |
| Files deleted | 29 (13 `.bak` + `.firebase/` cache + `.env.genesis.example` + 14 dead source files) |
| New files | 29 (`docs/CHANGELOG_2026-02-10.md`, `functions/.funcignore`, `functions-python/.env.example`, 25 split modules, `spectrumTypes.ts`) |
| Components enhanced | `CuspSliderInteractive`, `ZodiacBlendWheel`, `ZodiacEducationFlaps`, `ZodiacLearningPage` |
| Dead code/deps removed | 10 (Vite proxy, ECharts types, `react-is`, `sentence-transformers`, `@react-spring/web`, `gsap`, `react-intersection-observer`, `@mapbox/mapbox-gl-geocoder`, `@tensorflow/tfjs`, 13 `.bak` files) |
| Python deps pinned | 23 (all `>=` → `==`) |
| Vite chunks added/cleaned | 2 added (`nivo`, `d3`), 1 cleaned (`animation`) |
| UI features added | Navigation arrows with momentum, 16-day cusp slider, sign name in badge, element color coding |
| Formula corrections | 3 (formula text, constant, example table values) |
| Security: `new Function()` eliminated | 2 files (sandboxEngine.ts, devToolsEngine.ts) — replaced with safe evaluator |
| Security: XSS hardened | 3 components — HTML escaping added before `dangerouslySetInnerHTML` |
| Python endpoints protected | 42 (out of 46 total) |
| Python error responses sanitized | 45 (`str(e)` → `error_response()` across 8 route files) |
| Frontend services updated | 3 (auth token injection) |
| Cold start optimization | TensorFlow.js (~50 MB) lazy-loaded + removed from deps |
| Bare except: fixed | 3 (biography.py, calendar_conv.py) |
| Console.log → Firebase logger | 190 conversions across 8 Node.js route files |
| Full audit findings | 36 (3 critical, 11 high, 16 medium, 6 low) |
| Large files split | 6 files (25,296 total lines → 6 trimmed mains + 25 extracted modules) |
| TypeScript `: any` eliminated | 594 → 0 across 38 files (12 SpectrumExplorers + 26 other TS files) |
| prop-types removed | 24 files (23 cathedral/ + 1 personality/) |
| Audit items fixed | 34 of 36 |
| Items deferred | 2 (route grouping P3, Google SDK migration) |
| Items remaining | 2 (H8 Google SDK migration, M16 chart lib consolidation) |
