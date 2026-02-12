# GENESIS Changelog — February 9, 2026

Ten work streams completed in this session:

1. **Golden Ratio Cusp Correction** — Fixed hardcoded blend percentages to match the actual φ = 1.618 formula
2. **Firebase/GCP Secret Manager Migration** — Moved all API keys from `.env` files to GCP Secret Manager
3. **Frontend LLM Security Fix** — Eliminated all direct browser-to-LLM API calls; routed through server-side proxy
4. **Vitest Setup + Unit Tests** — Installed Vitest, added 169 tests for core math engines (φ-curve, compatibility scoring, composite charts)
5. **App.jsx Router Refactoring** — Eliminated ProtectedRoute boilerplate using React Router layout routes (631 → 168 lines)
6. **Dead Dependency Removal** — Removed unused `echarts` + `echarts-for-react` from bundle (~600 KB savings)
7. **Zone Calculation Consolidation** — Replaced 12 copy-pasted ZoneCalculation files (~3,264 lines) with 1 generic module + 1 config registry (~440 lines)
8. **P0 Security Hardening** — Fixed 5 security issues: hardcoded API key, stale exposed key, admin key fallback, wildcard CORS
9. **Console.log Stripping** — Added esbuild `drop: ['console', 'debugger']` to production builds
10. **functions/index.js Split** — Split 6,444-line Node.js Cloud Functions monolith into 10 route modules + thin re-export layer

---

## 1. Golden Ratio (φ) Cusp Blend Fix

### Problem
The Interactive Cusp Explorer and related helper files had **wrong hardcoded blend values** that didn't match the actual golden ratio formula `neighborWeight = ((7-d)/7)^φ`.

Old (incorrect) values had been accidentally set to a different curve (plastic number ρ ≈ 1.325):
```
Day 1: 19%  Day 2: 36%  Day 3: 52%  Day 4: 67%  Day 5: 81%  Day 6: 92%
```

Correct golden ratio values (from `docs/00_To Do/GoldenRatioZodiacSigns.md`):
```
Day 1: 22%  Day 2: 42%  Day 3: 60%  Day 4: 75%  Day 5: 87%  Day 6: 96%
```

### What Changed
The core engine in `phiCurve.ts` was already correct (PHI = 1.618). Only the display/helper constants were wrong.

| File | Change |
|------|--------|
| `src/components/zodiac/CuspSliderInteractive.tsx` | Fixed `PHI_CURVE` array from `[0.19, 0.36, 0.52, 0.67, 0.81, 0.92]` to `[0.22, 0.42, 0.60, 0.75, 0.87, 0.96]`. Renamed all UI labels from "ρ-Curve" back to "φ-Curve". |
| `src/utils/cuspHelpers.ts` | Fixed `PHI_CURVE` constant object — all 6 day entries corrected to match φ formula. Updated section header comment. |
| `src/data/cuspArchetypes.ts` | Fixed `PHI_CURVE_VALUES` integer percentages — all 6 day entries corrected. Updated section header comment. |
| `src/zodiac/cusp/index.ts` | Removed erroneous `PLASTIC` and `CUSP_EXPONENT` exports (leftovers from plastic number attempt). Restored comment headers to reference φ. |

### Not Changed (already correct)
- `src/zodiac/cusp/phiCurve.ts` — Core engine was always using PHI = 1.618
- `src/zodiac/cusp/getBlendFromLongitude.ts` — Already importing and using PHI correctly

---

## 2. Firebase/GCP Secret Manager Migration

### Problem
All 47+ API keys across Python and Node.js Firebase Functions were stored only in `.env` files. A GCP service account JSON (`astroprofile-391e6-*.json`) was present in the repo root. Only 4 Python secrets used Firebase's `SecretParam` mechanism.

### Security Fix (immediate)

| File | Change |
|------|--------|
| `.gitignore` | Added `astroprofile-*.json` pattern to block service account keys. Added `backend/.env`, `mcp-server/.env`, `functions-python/.env` patterns. |

### Phase 1: Secret-Setting CLI Script (NEW)

| File | Change |
|------|--------|
| `scripts/setup-secrets.sh` | **New file.** Bash script with `firebase functions:secrets:set` commands for all 17 secrets organized by category: LLM keys (Anthropic, OpenAI, Gemini, Grok, DeepSeek), image/voice (Stability, Leonardo, ElevenLabs), infrastructure (Neo4j, PostgreSQL), and utility (TimezoneDB, Admin). |

**Usage:** Run `bash scripts/setup-secrets.sh` to interactively store each secret in GCP Secret Manager. Only needs to be done once.

### Phase 2: Python Functions — SecretParam Expansion

| File | Change |
|------|--------|
| `functions-python/routes/shared.py` | Added `ADMIN_KEY_SECRET = SecretParam("ADMIN_KEY")` (5th secret declaration). |
| `functions-python/routes/admin.py` | Imported `ADMIN_KEY_SECRET`. Added to `init_neo4j_schema` decorator's `secrets=[]` list. |
| `functions-python/routes/biography.py` | Imported `ADMIN_KEY_SECRET`. Added to `ingest_sample_reagan` decorator's `secrets=[]` list. |

### Phase 3: Node.js Functions — defineSecret + Bindings

#### functions/index.js (main entry — 32 function bindings)

Added 13 `defineSecret` declarations at the top:
```js
const anthropicKey  = defineSecret('ANTHROPIC_API_KEY');
const openaiKey     = defineSecret('OPENAI_API_KEY');
const geminiKey     = defineSecret('GEMINI_API_KEY');
const grokKey       = defineSecret('GROK_API_KEY');
const deepseekKey   = defineSecret('DEEPSEEK_API_KEY');
const stabilityKey  = defineSecret('STABILITY_API_KEY');
const leonardoKey   = defineSecret('LEONARDO_API_KEY');
const elevenLabsKey = defineSecret('ELEVENLABS_API_KEY');
const timezonedbKey = defineSecret('TIMEZONEDB_API_KEY');
const neo4jUri      = defineSecret('NEO4J_URI');
const neo4jPassword = defineSecret('NEO4J_PASSWORD');
const pgPassword    = defineSecret('PG_PASSWORD');
const dbPassword    = defineSecret('DB_PASSWORD');
```

Functions bound to secrets:

| Function | Secrets |
|----------|---------|
| `aiSoulPartnerChat` | `anthropicKey, geminiKey` |
| `getSecondOpinion` | `geminiKey` |
| `getGrokPerspective` | `grokKey` |
| `getOpusPerspective` | `anthropicKey` |
| `getDeepSeekPerspective` | `deepseekKey` |
| `getChatGPTPerspective` | `openaiKey` |
| `translateMessage` | `deepseekKey, anthropicKey` |
| `getHistoricalTimezone` | `timezonedbKey` |
| `generateDebateVisual` | `geminiKey` |
| `pgHealthCheck` | `pgPassword, dbPassword` |
| `searchAllBrains` | `pgPassword, dbPassword, geminiKey` |
| `storeUserSTM` | `pgPassword, dbPassword, geminiKey` |
| `storePartnerSTM` | `pgPassword, dbPassword, geminiKey` |
| `getPartnerUnderstanding` | `pgPassword, dbPassword` |
| `addUserTimelineEvent` | `pgPassword, dbPassword` |
| `getUserTimelineRange` | `pgPassword, dbPassword` |
| `getCulturalMemory` | `pgPassword, dbPassword` |
| `storeCulturalMemory` | `pgPassword, dbPassword` |
| `triggerConsolidationPG` | `pgPassword, dbPassword, anthropicKey` |
| `nightlyConsolidationPG` | `pgPassword, dbPassword, anthropicKey` |
| `processNeurochemicalExchange` | `anthropicKey` |
| `getTimelineSummary` | `anthropicKey` |
| `generateAllTimelineSummaries` | `anthropicKey, geminiKey` |
| `extractLifeEvents` | `geminiKey` |
| `generateSoulLetter` | `geminiKey, anthropicKey` |
| `checkAIAvailability` | `anthropicKey, geminiKey` |
| `soulConfessional` | `anthropicKey, openaiKey` |
| `selfRecognition` | `anthropicKey, openaiKey` |
| `guestChat` | `anthropicKey` |
| `lunaPrivateQuery` | `anthropicKey` |
| `extractBiographyBullets` | `geminiKey` |
| `generateCouplePortrait` | `geminiKey` |

#### External Module Files (10 function bindings)

| File | Functions | Secrets |
|------|-----------|---------|
| `functions/image/stabilityImageGen.js` | `generateStabilityImage` | `stabilityKey` |
| `functions/image/leonardoImageGen.js` | `generateLeonardoImage`, `getLeonardoUsage` | `leonardoKey` |
| `functions/voice/voiceFunctions.js` | `getVoiceSession`, `getVoiceCapabilities`, `generateSpeech` | `geminiKey` |
| `functions/voice/elevenLabsService.js` | `getAvailableVoices`, `generateSpeechElevenLabs`, `getVoicePreview`, `getVoiceStreamingSession` | `elevenLabsKey` |

### Functions NOT Bound (no external API keys needed)
- `detectLanguage` — pure regex/Unicode pattern matching
- `healthCheck` — static status response
- `saveStoryAssessment` / `getStoryAssessment` — Firestore only
- `getSolarTerms` / `getBaziPillars` / `calculateWesternChart` / `getHouseStrengthTimeline` — pure computation (Swiss Ephemeris)
- All love intelligence / healing / learning / personality / audio / drift / admin functions — Firestore only
- `getLeonardoModels` / `getStabilityStyles` — static model/style lists
- `endVoiceSession` / `storeVoiceMemory` / `saveVoicePreferences` — Firestore only
- Timeline read functions (`getBiographyTimeline`, `getBiographyStats`, etc.) — Firestore only

---

## How It Works

**In production:** Firebase Functions v2 reads secrets from GCP Secret Manager at runtime and injects them as environment variables. Only functions that declare a secret in their `secrets: []` array get access — enforcing least-privilege.

**In local dev:** No change. `functions/.env` files still work as before. Firebase automatically falls back to `.env` when Secret Manager is not available.

**To activate:** Run `bash scripts/setup-secrets.sh` once to store all secrets in GCP Secret Manager, then deploy normally with `firebase deploy --only functions`.

---

## Summary

| Metric | Count |
|--------|-------|
| Files modified | 14 |
| New files | 1 (`scripts/setup-secrets.sh`) |
| Node.js functions with secrets | 42 |
| Python functions with secrets | 5 (was 4) |
| Secret types managed | 13 (Node.js) + 5 (Python) |
| Lines added | ~200 |
| Lines removed | ~117 |

---

## 3. Frontend LLM Security Fix — Server-Side Proxy

### Problem

**9 frontend files** were making direct `fetch()` calls to LLM provider APIs (Anthropic, OpenAI, Groq, Azure OpenAI) from the browser. This exposed **6 API keys** via `VITE_`-prefixed environment variables that Vite bundles into client-side JavaScript — visible to anyone who opens DevTools.

Exposed keys:
- `VITE_ANTHROPIC_API_KEY` (5 files)
- `VITE_OPENAI_API_KEY` (1 file)
- `VITE_GROQ_API_KEY` (1 file)
- `VITE_AZURE_OPENAI_API_KEY` + `ENDPOINT` + `DEPLOYMENT` (1 file)

Additionally, `@anthropic-ai/sdk` (a server-side library) was listed in the root `package.json`, adding ~2 MB to the client bundle.

### Solution

Created a single **`llmProxy` Cloud Function** that acts as a server-side gateway for all frontend LLM calls. The frontend sends `{ provider, model, system, messages, temperature, max_tokens }` via `httpsCallable`, and the server makes the actual API call using secrets from GCP Secret Manager.

### Architecture

```
BEFORE:  Browser  ──fetch()──>  api.anthropic.com  (API key in JS bundle)
AFTER:   Browser  ──httpsCallable()──>  llmProxy Cloud Function  ──fetch()──>  api.anthropic.com
                                        (key from Secret Manager)
```

### New Files

| File | Purpose |
|------|---------|
| `src/services/llmProxyService.js` | Frontend helper — wraps `httpsCallable(functions, 'llmProxy')` with a clean `callLLMProxy()` / `callClaudeProxy()` API |

### Cloud Function Added

**`llmProxy`** in `functions/index.js` (~120 lines):
- Secrets: `[anthropicKey, openaiKey, groqKey]`
- Timeout: 120 seconds
- Memory: 512 MiB
- Auth: **Required** (rejects unauthenticated callers)
- Token cap: `max_tokens` capped at 16,000 server-side
- Providers: `anthropic`, `openai`, `groq`

### Files Modified

| File | What Changed |
|------|-------------|
| `src/services/claudeAPI.js` | Replaced direct `fetch` to `api.anthropic.com` with `callClaudeProxy()`. Preserved response shape (`{content: [{text}]}`) for downstream consumers (lunaService.js). `callClaudeViaFunction` now aliases `callClaudeAPI`. |
| `src/services/claudeApiService.js` | Replaced direct `fetch` + `anthropic-dangerous-direct-browser-access` header with `callClaudeProxy()`. Removed `apiKey`/`apiUrl` from constructor. `isConfigured()` now returns `true` (proxy handles keys). |
| `src/services/westernAstrologyAIService.js` | Replaced direct `fetch` with `callClaudeProxy()`. All prompt building, fallback, and formatting functions unchanged. |
| `src/services/mbtiCompatibilityAI.js` | Replaced `generateInsightsFromAI()` direct `fetch` with `callClaudeProxy()`. Removed `ANTHROPIC_API` constant. Firebase caching layer unchanged. |
| `src/pages/BaZiModularPage.jsx` | Replaced inline direct `fetch` + `VITE_ANTHROPIC_API_KEY` in `generatePersonalityInsight()` with dynamic `import('../services/llmProxyService')`. Fallback to local insight preserved. |
| `src/components/cathedral/report/llm/providers/anthropic.ts` | Replaced 200-line direct API + streaming implementation with 15-line `callLLMProxy({ provider: 'anthropic' })` call |
| `src/components/cathedral/report/llm/providers/openai.ts` | Same pattern — `callLLMProxy({ provider: 'openai' })` |
| `src/components/cathedral/report/llm/providers/groq.ts` | Same pattern — `callLLMProxy({ provider: 'groq' })` |
| `src/components/cathedral/report/llm/providers/azureOpenai.ts` | **Disabled** — throws immediately. No Azure secrets configured server-side. Cathedral router falls through to next provider. |
| `src/components/cathedral/report/llm/router.ts` | Config detection updated: `hasAnthropicConfig()` / `hasOpenAIConfig()` / `hasGroqConfig()` return `true` (server handles availability). `hasAzureConfig()` returns `false`. |
| `src/components/aiInsights/AIInsightsButton.jsx` | Updated error message — no longer references `VITE_ANTHROPIC_API_KEY`. |
| `package.json` | Removed `@anthropic-ai/sdk` from root (client) dependencies. |

### What Was NOT Changed
- `functions/package.json` — `@anthropic-ai/sdk` stays here (server-side, where it belongs)
- `src/services/apiKeysService.js` — User-facing "bring your own key" for voice services (Groq/ElevenLabs) — separate concern
- `src/services/soulFamilyAgentService.js` — Uses `VITE_NEO4J_CLIENT_SECRET` for Neo4j Aura OAuth — separate concern, needs its own proxy

### Streaming Note
The cathedral LLM providers previously had full streaming implementations. No component actually uses `stream: true`, so switching to the non-streaming `httpsCallable` proxy has no functional impact. If streaming is needed later, it can be added via an `onRequest` SSE endpoint.

---

## Deployment Checklist

Before deploying these changes to production:

### Already Done (previous session)
- [x] Run `bash scripts/setup-secrets.sh` to store all secrets in GCP Secret Manager

### Required Before Deploy
- [ ] **Deploy the new `llmProxy` Cloud Function**: `firebase deploy --only functions:llmProxy`
- [ ] **Deploy all functions** (recommended): `firebase deploy --only functions` — includes CORS restrictions + admin key fix
- [x] **Remove `VITE_ANTHROPIC_API_KEY`** from `.env.local` — done (Section 8, Issue 2)
- [ ] **Remove `VITE_OPENAI_API_KEY`** from `.env.local` / `.env` (no longer needed)
- [ ] **Remove `VITE_AZURE_OPENAI_API_KEY`**, `VITE_AZURE_OPENAI_ENDPOINT`, `VITE_AZURE_OPENAI_DEPLOYMENT` from `.env.local`
- [ ] **Remove `VITE_GROQ_API_KEY`** from `.env.local` (only if not used for voice key service)
- [ ] **Run `npm install`** in root to remove `@anthropic-ai/sdk` from `node_modules`
- [ ] **Rebuild frontend**: `npm run build` — verify no VITE_ LLM key references in output bundle
- [ ] **Rotate the Anthropic API key** — `sk-ant-api03-...` was previously exposed in the browser bundle

### Optional / Future
- [ ] Move `VITE_NEO4J_CLIENT_SECRET` (soulFamilyAgentService.js) behind a server proxy
- [ ] Add Azure OpenAI secrets to `functions/index.js` if Azure provider is needed
- [ ] Add `GROQ_API_KEY` to `scripts/setup-secrets.sh` if not already present
- [ ] Rotate all other previously-exposed API keys (OpenAI, Azure, Groq)

### Verification
1. Sign into the app
2. Open a profile with sovereign data → click Western AI Analysis → should work via proxy
3. Open BaZi page → AI personality insight → should work via proxy
4. Open THE GOOSE insights → should work via proxy
5. Open DevTools Network tab → confirm no direct calls to `api.anthropic.com` or `api.openai.com`
6. Open DevTools Sources → search for API keys → confirm none present in bundle

---

## 4. Vitest Setup + Unit Test Coverage for Core Math Engines

### Problem

~1,500 source files with zero configured unit test runner for the frontend. Existing test files were scattered across Jest (security rules), Playwright (E2E), and custom console-based runners. The BaZi spec files (`src/utils/baziRules/__tests__/*.spec.ts`) used bare `describe`/`test`/`expect` without a framework — they were written but never wired up. No safety net for refactoring any of the core computation logic.

### Solution

Installed **Vitest 4.x** as the unit test runner. Vitest reuses the Vite transform pipeline so `.ts`, `.tsx`, path aliases, and ESM all work with zero additional configuration beyond a slim config file.

### Configuration

| File | Purpose |
|------|---------|
| `vitest.config.ts` | **New.** Enables `globals: true` (for BaZi specs), scoped `include` patterns to avoid picking up incompatible Jest/custom test files from `functions/` and `tests/` |
| `package.json` | Added `vitest` to devDependencies. Added `"test": "vitest run"` (CI single-run) and `"test:watch": "vitest"` (interactive) scripts |

### Test Files Created

| File | Tests | Module Tested | What It Protects |
|------|-------|---------------|------------------|
| `src/zodiac/cusp/__tests__/phiCurve.test.ts` | 35 | `phiCurve.ts` | Golden ratio blending formula — verifies curve is monotonic, weights sum to 1, symmetry holds (entering a sign mirrors leaving it), pre-computed constants match the formula |
| `src/zodiac/cusp/__tests__/getBlendFromLongitude.test.ts` | 36 | `getBlendFromLongitude.ts` | Degree-to-sign conversion for Moon/Rising — sign identification, boundary detection, neighbor sign wrapping (Pisces↔Aries at 360°/0°), φ-curve secondary weight |
| `src/zodiac/cusp/__tests__/seasonWeight.test.ts` | 14 | `seasonWeight.ts` | Equinox (1.25x) and solstice (1.15x) cusp amplification, cusp classification, cardinal sign identification |
| `src/zodiac/compatibility/__tests__/elementModality.test.ts` | 39 | `elementModality.ts` | 4-layer compatibility scoring (40% aspect + 25% element + 20% modality + 15% seasonal), symmetry verification, weight normalization |
| `src/zodiac/compatibility/__tests__/scoringPrimitives.test.ts` | 35 | `scoringPrimitives.ts` | Element/modality/season relation classification, aspect score ordering (trine > sextile > ... > quincunx), compatibility pattern detection, rank bonuses |
| `src/zodiac/compatibility/__tests__/compositeMidpoint.test.ts` | 10 | `compositeMidpoint.ts` | Composite chart midpoint calculation — shorter arc handling (350° + 10° → 0°, not 180°), shared planet filtering, sign/degree output |

### Existing Tests Now Running

The BaZi rule engine specs (`src/utils/baziRules/__tests__/*.spec.ts`) — 8 files, ~50 tests — are now auto-discovered by Vitest thanks to `globals: true`. 5 pre-existing failures in `seasonal.spec.ts` and `hidden_stems.spec.ts` are from not-yet-implemented features, not regressions.

### Dead Code Cleanup

| File | Change |
|------|--------|
| `src/services/lunaService.js` | **Deleted** — superseded by `lunaPrivateQuery` Cloud Function in `functions/guestChat/index.js`. `GuestChat.jsx` now calls `sendLunaPrivateQuery` via `httpsCallable` instead. |
| `src/services/claudeAPI.js` | **Deleted** — sole consumer was `lunaService.js` (dead code). |

### Running Tests

```bash
npm test              # Single run (CI)
npm run test:watch    # Interactive watch mode
npm test src/zodiac   # Run only zodiac engine tests (169 tests)
```

---

## 5. App.jsx Router Refactoring — Layout Routes

### Problem

`src/App.jsx` had 50 routes across 631 lines. 44 protected routes were each individually wrapped in `<ProtectedRoute>...</ProtectedRoute>` — 6 lines of boilerplate per route, ~264 lines of pure wrapping noise.

```jsx
// Before: repeated 44 times
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### Solution

Converted `ProtectedRoute` from a children-wrapper to a **React Router v6 layout route** using `<Outlet />`. All 44 protected routes now nest under a single `<Route element={<ProtectedRoute />}>` parent.

```jsx
// After: single parent, 1-line children
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/create-profile" element={<DiamondProfileForm />} />
  {/* ...all 44 routes as one-liners... */}
</Route>
```

### Files Changed

| File | Change |
|------|--------|
| `src/components/layout/ProtectedRoute.jsx` | Replaced `{children}` with `<Outlet />`, added `Outlet` import, removed `children` prop |
| `src/App.jsx` | Nested 44 protected routes under single layout route parent. **631 → 168 lines (−463 lines, 73% reduction)** |

### What Was NOT Changed
- 4 public routes (`/login`, `/signup`, `/voice-test`, `/luna-voice`) — stay outside the protected wrapper
- 2 redirect routes (`/` and `*`) — stay outside
- All lazy imports — unchanged
- Auth logic in ProtectedRoute — unchanged (loading spinner, redirect to `/login`)
- No behavioral changes — same routes, same auth checks, same lazy loading

---

## 6. Dead Dependency Removal — ECharts

### Problem

The project bundled **5 competing chart/visualization libraries**: Chart.js, Recharts, Nivo, ECharts, and D3. An audit revealed that `echarts` and `echarts-for-react` were **dead dependencies** — installed in `package.json` but imported by zero source files.

### Solution

```bash
npm uninstall echarts echarts-for-react
```

Removed 6 packages, saving ~600 KB from the client bundle.

### Remaining Libraries (all actively used)

| Library | Files | Purpose |
|---------|-------|---------|
| **Nivo** (`@nivo/*`) | 10 | Primary charting — radar, bar, line, heatmap |
| **D3** (`d3-*`) | 5 | Custom SVG zodiac wheels + force layouts |
| **Chart.js** (`chart.js` + `react-chartjs-2`) | 3 | Dashboard charts |
| **Recharts** | 1 | BaZi elemental radar |

No consolidation of the remaining 4 was attempted — each serves a distinct rendering need.

---

## 7. Zone Calculation Consolidation — 12 Files → 2

### Problem

12 files (`src/utils/ariesZoneCalculations.js` through `piscesZoneCalculations.js`) were near-identical copies — each ~273 lines with identical function logic, differing only by sign-specific constants (ecliptic offset, decan rulers, cusp neighbors, season start date, suggestion text). Total: ~3,264 lines of duplicated code. A maintenance landmine — any bug fix or feature addition had to be copy-pasted 12 times.

### Solution

Extracted all sign-specific data into a single config registry, and consolidated all shared logic into one generic module parameterized by sign name.

### New Files

| File | Lines | Purpose |
|------|-------|---------|
| `src/utils/zoneSignConfigs.js` | 259 | Sign config registry — ecliptic offsets, decan rulers/sub-rulers, cusp neighbors, season start dates, cusp influence text, per-zone personalized suggestions for all 12 signs |
| `src/utils/zoneCalculations.js` | 181 | Generic zone calculation functions: `getZoneFromDegree(zones, degree)`, `getUserZoneInfo(sign, zones, degree)`, `getAbsoluteEclipticPosition`, `getDecanFromDegree`, `getCuspInfluences`, `getDateRangeForDegree`, `compareQualityAcrossZones` |

### Consumer Updates (12 files)

Each `[Sign]SpectrumExplorer.tsx` changed 3 lines:

```tsx
// Before
import { getZoneFromDegree, getUserZoneInfo } from '../../utils/ariesZoneCalculations';
const currentZone = getZoneFromDegree(currentDegree);
getUserZoneInfo(userDegree)

// After
import { getZoneFromDegree, getUserZoneInfo } from '../../utils/zoneCalculations';
const currentZone = getZoneFromDegree(ariesZones, currentDegree);
getUserZoneInfo('Aries', ariesZones, userDegree)
```

### Files Deleted (12)

- `src/utils/ariesZoneCalculations.js`
- `src/utils/taurusZoneCalculations.js`
- `src/utils/geminiZoneCalculations.js`
- `src/utils/cancerZoneCalculations.js`
- `src/utils/leoZoneCalculations.js`
- `src/utils/virgoZoneCalculations.js`
- `src/utils/libraZoneCalculations.js`
- `src/utils/scorpioZoneCalculations.js`
- `src/utils/sagittariusZoneCalculations.js`
- `src/utils/capricornZoneCalculations.js`
- `src/utils/aquariusZoneCalculations.js`
- `src/utils/piscesZoneCalculations.js`

### Net Impact

| Metric | Value |
|--------|-------|
| Files deleted | 12 |
| Files created | 2 |
| Lines removed | ~3,264 |
| Lines added | ~440 |
| Net reduction | ~2,824 lines |
| Build | Clean pass, zero broken imports |

---

## 8. P0 Security Hardening — 5 Issues Fixed

### Issue 1: Hardcoded Google Maps API Key in Source

**Problem:** `src/config/keys.js` had the Google Maps API key (`AIzaSyCI9Yog...`) hardcoded as a string literal, committed to git. While the key has HTTP referrer restrictions in Google Console, hardcoding secrets in source is a bad practice.

**Fix:** Replaced with `import.meta.env.VITE_GOOGLE_MAPS_API_KEY`. Added the key to `.env.local` (gitignored).

| File | Change |
|------|--------|
| `src/config/keys.js` | `'AIzaSyCI9Yog...'` → `import.meta.env.VITE_GOOGLE_MAPS_API_KEY \|\| ''` |
| `.env.local` | Added `VITE_GOOGLE_MAPS_API_KEY=AIzaSyCI9Yog...` |

### Issue 2: VITE_ANTHROPIC_API_KEY Still in .env.local

**Problem:** `VITE_ANTHROPIC_API_KEY` was still set in `.env.local`. No code references it anymore (all LLM calls go through `llmProxy` Cloud Function), but the `VITE_` prefix causes Vite to bundle it into client-side JavaScript — exposing `sk-ant-api03-...` to every browser.

**Fix:** Deleted `VITE_ANTHROPIC_API_KEY` and associated PowerShell/VS Code comment lines from `.env.local`. Build output confirmed zero Anthropic key matches.

**Action required:** Rotate this Anthropic API key in the Anthropic console — it was previously exposed in the browser bundle.

### Issue 3: Root .env in Git History

**Finding:** `git log --all -- .env` returned empty — the file was **never committed**. No action needed.

### Issue 4: Hardcoded Admin Key Fallback

**Problem:** Three Python route files fell back to `"genesis-admin-2024"` if the `ADMIN_KEY` environment variable was unset:
```python
admin_key = os.environ.get("ADMIN_KEY", "genesis-admin-2024")
```
Anyone could call admin endpoints with that well-known default string.

**Fix:** Removed the default. Now returns HTTP 500 `"ADMIN_KEY not configured"` if the secret is missing — fail closed.

| File | Occurrences Fixed |
|------|-------------------|
| `functions-python/routes/admin.py` | 1 (line 164) |
| `functions-python/routes/biography.py` | 2 (lines 62, 298) |

### Issue 5: Wildcard CORS `"*"` on All Python Endpoints

**Problem:** Every Python Cloud Function decorator had `cors_origins="*"`, allowing any website on the internet to call these endpoints.

**Fix:** Created a shared `ALLOWED_ORIGINS` list in `functions-python/routes/shared.py` and replaced all 48 wildcard occurrences across 9 files.

```python
# functions-python/routes/shared.py
ALLOWED_ORIGINS = [
    "https://astroprofile-391e6.web.app",
    "https://astroprofile-391e6.firebaseapp.com",
    "http://localhost:5173",
    "http://localhost:5174",
]
```

| File | Occurrences Replaced |
|------|---------------------|
| `routes/luna.py` | 10 |
| `routes/graph.py` | 13 |
| `routes/biography.py` | 7 |
| `routes/astro.py` | 5 |
| `routes/bazi.py` | 4 |
| `routes/western.py` | 3 |
| `routes/unified.py` | 3 |
| `routes/admin.py` | 3 |
| `brain7a/feedback_service.py` | 1 |

To add a custom domain later, edit the single `ALLOWED_ORIGINS` list in `shared.py`.

---

## 9. Console.log Stripping — Production Build Optimization

### Problem

~900 `console.log` calls across 135 source files. In production, these leak internal state (user IDs, API payloads, timing data) into the browser console — a security and performance concern.

### Solution

Added esbuild's `drop` option to the Vite build config. Zero code changes — esbuild strips all `console.*` and `debugger` statements during minification.

```js
// vite.config.js
build: {
  minify: 'esbuild',
  esbuild: {
    drop: ['console', 'debugger'],
  },
  // ...
}
```

| File | Change |
|------|--------|
| `vite.config.js` | Added `minify: 'esbuild'` + `esbuild: { drop: ['console', 'debugger'] }` |

### Impact

- All `console.log`, `console.warn`, `console.error`, `console.debug`, and `debugger` statements are removed from production bundles
- Development builds (`npm run dev`) are unaffected — console output works normally during development
- Build verified clean with no errors

---

## 10. functions/index.js Split — Node.js Cloud Functions Modularization

### Problem

`functions/index.js` was a **6,444-line monolith** containing 260 Cloud Function exports, inline VSOP87 astronomical calculations (~1,760 lines), the main chat handler (~500 lines), and hundreds of thin re-exports from sub-modules. Same problem previously fixed in Python (`main.py` → 8 route modules in session's earlier work).

### Solution

Split into 10 route modules under `functions/routes/`, with a shared config file and a 26-line re-export `index.js`.

### Architecture

```
functions/
├── index.js              (26 lines — admin.initializeApp() + 10 require())
└── routes/
    ├── shared.js          (50 lines — 13 defineSecret() + SDK refs)
    ├── chat.js            (697 lines — aiSoulPartnerChat + intimacy helpers)
    ├── constellation.js   (249 lines — 7 multi-LLM perspective functions)
    ├── astrology.js       (2,101 lines — VSOP87 + Swiss Ephemeris engine)
    ├── memory.js          (187 lines — 89 re-exports: memory, brain, voice)
    ├── postgresql.js      (257 lines — 11 PG functions + nightly scheduler)
    ├── timeline.js        (976 lines — 31 timeline/biography/neural functions)
    ├── love.js            (514 lines — 19 neurochemical + love intelligence)
    ├── personality.js     (588 lines — 23 drift/quirks/healing/ambient)
    ├── admin.js           (98 lines — 48 admin dashboard wrappers)
    └── services.js        (734 lines — 20 misc: soul letter, timezone, etc.)
```

### New index.js (26 lines)

```js
const admin = require('firebase-admin');
admin.initializeApp();

Object.assign(exports,
  require('./routes/chat'),
  require('./routes/constellation'),
  require('./routes/astrology'),
  require('./routes/memory'),
  require('./routes/postgresql'),
  require('./routes/timeline'),
  require('./routes/love'),
  require('./routes/personality'),
  require('./routes/admin'),
  require('./routes/services'),
);
```

### New Files (11)

| File | Lines | Exports | Content |
|------|-------|---------|---------|
| `routes/shared.js` | 50 | — | 13 `defineSecret()` declarations + `onRequest`, `onCall`, `onSchedule`, `admin`, `cors` |
| `routes/chat.js` | 697 | 4 | `aiSoulPartnerChat` (inline 500-line handler), `generateConversationStarter`, `analyzeUserMessage`, `getUserEraContext` |
| `routes/constellation.js` | 249 | 7 | `getSecondOpinion`, `getGrokPerspective`, `getOpusPerspective`, `getDeepSeekPerspective`, `getChatGPTPerspective`, `translateMessage`, `detectLanguage` |
| `routes/astrology.js` | 2,101 | 8 | VSOP87 inline engine (~1,760 lines), `generateDebateVisual`, `saveStoryAssessment`, `getStoryAssessment`, `healthCheck`, `getSolarTerms`, `getBaziPillars`, `calculateWesternChart`, `getHouseStrengthTimeline` |
| `routes/memory.js` | 187 | 89 | Re-exports from `memoryFunctions`, `dualBrainFunctions`, `sleepConsolidation`, `brain1BService`, `brain8Consolidation`, `semanticSearch`, `toolChat`, `agency`, `contextSummarization`, `voiceFunctions`, `elevenLabsService`, `usageTracking`, `rateLimiter` |
| `routes/postgresql.js` | 257 | 11 | Lazy-loaded PG client + 10 `onCall` data functions + `nightlyConsolidationPG` scheduled job |
| `routes/timeline.js` | 976 | 31 | Timeline navigation, biography extraction, neural pathways, life event functions |
| `routes/love.js` | 514 | 19 | Neurochemical engine (7), love intelligence (8), Luna chat integration (4) |
| `routes/personality.js` | 588 | 23 | Drift/behavior (12), quirks/assertiveness (3), healing/bathtub (4), ambient sounds (2), learning patterns (2) |
| `routes/admin.js` | 98 | 48 | Admin dashboard `onCall` wrappers + consolidation scheduler/rollback re-exports |
| `routes/services.js` | 734 | 20 | Soul letter, AI availability, confessional, sanctuary, guest chat, LLM proxy, image gen, couple portrait, biography bullets, knowledge base, timezone, documentation RAG |

### Key Design Decisions

- **`admin.initializeApp()`** stays in `index.js` — must run once before any route module loads
- **Each route file imports from `./shared`** for secrets and SDK refs it needs
- **Secret bindings preserved** — each function's `secrets: [...]` array is maintained in the route module
- **No behavioral changes** — all 260 exports are identical to the original

### Verification

| Check | Result |
|-------|--------|
| Original export count | 261 lines (260 unique — `getTimelineEvents` was a duplicate assignment) |
| Route module export count | 260 unique (exact match) |
| `node -e "require('./index')"` | All modules load, 260 exports confirmed |
| Frontend build | Clean pass |

---

## Full Session Summary

| Metric | Count |
|--------|-------|
| Files modified | 54 (53 prior + `vite.config.js`) |
| New files | 23 (12 prior + 11 `functions/routes/*.js`) |
| Files deleted | 16 (`lunaService.js`, `claudeAPI.js`, 12 `[sign]ZoneCalculations.js`, `echarts` + `echarts-for-react` deps) |
| Lines removed by router refactoring | 463 (App.jsx 631 → 168 lines) |
| Lines removed by zone consolidation | ~2,824 (12 files → 2) |
| Lines removed by index.js split | ~6,418 (index.js 6,444 → 26 lines) |
| API keys removed from frontend | 7 (6 LLM keys + 1 Google Maps hardcoded) |
| Stale keys deleted from .env.local | 1 (`VITE_ANTHROPIC_API_KEY`) |
| Direct browser→LLM calls eliminated | 9 files |
| Cloud Functions with secrets | 43 (was 42, +1 `llmProxy`) |
| Cloud Function exports | 260 (verified across 10 route modules) |
| Wildcard CORS `"*"` replaced | 48 occurrences across 9 Python files |
| Admin key fallback removed | 3 occurrences (fail-closed) |
| Console.log calls stripped from prod | ~900 across 135 files (via esbuild drop) |
| Frontend dependencies removed | 3 (`@anthropic-ai/sdk`, `echarts`, `echarts-for-react`) |
| Dev dependencies added | 1 (`vitest`) |
| New unit tests | 169 (across 6 test files) |
| Existing tests now running | ~50 (BaZi rule engine specs) |
