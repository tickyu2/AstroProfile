# GENESIS Refactor Checklist

## Quick Reference: What Changes Where

### Python Backend (CREATE/MODIFY)

| File | Action | Purpose |
|------|--------|---------|
| `functions-python/api/__init__.py` | CREATE | API module |
| `functions-python/api/compute_profile.py` | CREATE | Profile computation endpoint |
| `functions-python/api/compute_compatibility.py` | CREATE | Compatibility endpoint |
| `functions-python/api/schemas.py` | CREATE | Pydantic models (canonical schema) |
| `functions-python/main.py` | MODIFY | Add HTTP endpoints |

### Frontend (SIMPLIFY/DELETE)

| File | Action | Current Issue |
|------|--------|---------------|
| `src/contexts/ProfileContext.jsx` | SIMPLIFY | Remove `buildFourPillarsData()`, store Python output directly |
| `src/services/constitutionService.js` | DELETE | Replace with direct Firebase read |
| `src/pages/UnifiedCompatibilityPage.jsx` | SIMPLIFY | Remove `getElementsWithFallback()`, `extractElementsFromBaZi()`, `parseGanZhiElement()` |
| `src/utils/soulDNAEncoder.js` | SIMPLIFY | Remove format conversion, read `profile.bazi.elements` directly |
| `src/utils/archetypeMapper.js` | SIMPLIFY | Remove format conversion, read `profile.western` directly |
| `src/components/Results.jsx` | SIMPLIFY | Read from `profile.bazi`, `profile.western` directly |

### Types (CREATE)

| File | Action | Purpose |
|------|--------|---------|
| `src/types/genesis.types.ts` | CREATE | Single source of truth for all types |
| `src/types/bazi.types.ts` | CREATE | BaZi schema matching Python |
| `src/types/western.types.ts` | CREATE | Western schema matching Python |
| `src/types/unified.types.ts` | CREATE | Unified profile schema |
| `src/types/compatibility.types.ts` | CREATE | Compatibility result schema |

---

## Naming Convention Changes

### Elements (BaZi)

```
OLD (multiple names):
- elementBalance
- elementalBalance
- element_distribution
- elements
- fourPillars.elementBalance
- constitutional.bazi.elementBalance

NEW (single name):
- profile.bazi.elements
```

### Elements (Western)

```
OLD:
- westernElements
- western.elements
- calculations.western.elements

NEW:
- profile.western.elements
```

### Pillars

```
OLD:
- fourPillars
- calculations.fourPillars
- constitutional.bazi.fourPillars
- sovereignBazi.baziYear/baziMonth/baziDay/baziHour

NEW:
- profile.bazi.pillars.year
- profile.bazi.pillars.month
- profile.bazi.pillars.day
- profile.bazi.pillars.hour
```

---

## Data Flow: Before vs After

### BEFORE (Complex)
```
User Input
    ↓
ProfileContext.createProfile()
    ↓
JavaScript calculations (partial)
    ↓
Python backend (if available)
    ↓
buildFourPillarsData() [TRANSFORM]
    ↓
Firebase (profiles/{id})
    ↓
populateConstitution() [TRANSFORM]
    ↓
Firebase (profiles/{id}/constitution/brain1a)
    ↓
getConstitution() [READ]
    ↓
getElementsWithFallback() [10+ FALLBACK PATHS]
    ↓
extractElementsFromBaZi() [RE-PARSE]
    ↓
UI Component
```

### AFTER (Simple)
```
User Input
    ↓
ProfileContext.createProfile()
    ↓
Python backend (required)
    ↓
Firebase (profiles/{id}) [STORE RAW]
    ↓
UI Component [READ DIRECTLY]
```

---

## Code to Delete

### constitutionService.js
- `calculateElementBalance()` - Was hardcoded, delete entirely
- `extractBazi()` - Unnecessary extraction
- `populateConstitution()` - Move to Python
- `getConstitution()` - Replace with direct read

### UnifiedCompatibilityPage.jsx
- `parseGanZhiElement()` - Python already parsed
- `extractElementsFromBaZi()` - Python already computed
- `getElementsWithFallback()` - No fallbacks needed
- `normalizeElements()` - Python normalizes

### ProfileContext.jsx
- `buildFourPillarsData()` - Store Python output directly
- Timezone re-lookup logic - Python handles
- `getChineseZodiac()` - Python handles
- `getWesternZodiac()` - Python handles

---

## Firebase Schema Change

### BEFORE
```
profiles/{id}
├── firstName, lastName, birthDate, ...
├── calculations/
│   ├── fourPillars/
│   │   ├── year, month, day, hour
│   │   └── elementBalance
│   └── western/
│       └── ...
├── chineseZodiac/
└── constitution/ (subcollection)
    └── brain1a/
        ├── bazi/
        └── western/
```

### AFTER
```
profiles/{id}
├── firstName, lastName, birthDate, ...
├── bazi/                    # Direct Python output
│   ├── pillars/
│   ├── dayMaster/
│   ├── elements/
│   ├── tenGods/
│   └── ...
├── western/                 # Direct Python output
│   ├── sun, moon, rising/
│   ├── planets/
│   ├── elements/
│   └── ...
├── unified/                 # Direct Python output
│   ├── vector/
│   └── persona/
├── computedAt
└── computeVersion
```

---

## Migration Priority

1. **HIGH:** Create Python API endpoints
2. **HIGH:** Update ProfileContext to store raw Python output
3. **MEDIUM:** Simplify frontend components to read directly
4. **LOW:** Delete dead code
5. **LOW:** Run migration script on existing profiles

---

## Testing After Refactor

```bash
# 1. Test Python endpoint directly
curl -X POST http://localhost:5001/api/compute-profile \
  -H "Content-Type: application/json" \
  -d '{"birthDate":"1983-07-06","birthTime":"08:40",...}'

# 2. Verify Firebase document
firebase firestore:get profiles/{id}

# 3. Check UI renders without errors
npm run dev
# Open profile, check console for errors
```

---

*"Less code, fewer bugs, faster reads"*
