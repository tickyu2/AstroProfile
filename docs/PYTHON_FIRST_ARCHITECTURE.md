# GENESIS Python-First Architecture

## Vision: Compute Once, Store Raw, Read Directly

**Principle:** Python computes everything. Firebase stores exactly what Python outputs. Frontend reads exactly what's stored. No translation layers.

---

## 1. Canonical Data Schema

### 1.1 Profile Document Structure (Firebase: `profiles/{profileId}`)

```typescript
interface Profile {
  // === IDENTITY (User Input) ===
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  gender: 'male' | 'female' | 'other';

  // === BIRTH DATA (User Input) ===
  birthDate: string;        // "1983-07-06"
  birthTime: string;        // "08:40"
  birthLocation: string;    // "Mianzhu, Sichuan, China"
  birthLat: number;         // 31.3389
  birthLng: number;         // 104.2186
  timezone: string;         // "Asia/Shanghai"

  // === PYTHON-COMPUTED DATA (Stored Raw) ===
  bazi: BaZiChart;          // Full BaZi from Python
  western: WesternChart;    // Full Western from Python
  unified: UnifiedProfile;  // 90-dim unified vector

  // === METADATA ===
  computedAt: Timestamp;    // When Python last computed
  computeVersion: string;   // "1.0.0" - Python engine version
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 1.2 BaZi Chart (Python Output → Firebase)

```typescript
interface BaZiChart {
  // === FOUR PILLARS ===
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar;
  };

  // === DAY MASTER ===
  dayMaster: {
    stem: string;           // "Yi" or "乙"
    element: string;        // "Wood"
    polarity: string;       // "Yin"
    strength: number;       // 0.733 (0-1 scale)
    strengthLevel: string;  // "moderate" | "strong" | "weak"
  };

  // === ELEMENT DISTRIBUTION (Canonical Format) ===
  elements: {
    Wood: number;           // 0.25 (percentage as decimal)
    Fire: number;           // 0.15
    Earth: number;          // 0.20
    Metal: number;          // 0.25
    Water: number;          // 0.15
  };

  // === TEN GODS ===
  tenGods: {
    // Individual presence (0-1)
    比肩: number;  // Companion
    劫財: number;  // Rob Wealth
    食神: number;  // Eating God
    傷官: number;  // Hurting Officer
    偏財: number;  // Indirect Wealth
    正財: number;  // Direct Wealth
    七殺: number;  // Seven Killings
    正官: number;  // Direct Officer
    偏印: number;  // Indirect Resource
    正印: number;  // Direct Resource

    // Grouped (0-1)
    groups: {
      self: number;       // 比肩 + 劫財
      output: number;     // 食神 + 傷官
      wealth: number;     // 偏財 + 正財
      authority: number;  // 七殺 + 正官
      resource: number;   // 偏印 + 正印
    };

    dominant: string;     // "Resource" | "Wealth" etc.
  };

  // === USEFUL/ANNOYING GODS ===
  usefulGod: {
    element: string;      // "Water"
    reason: string;       // "Day Master needs support"
  };
  annoyingGod: {
    element: string;      // "Fire"
    reason: string;       // "Excessive in chart"
  };

  // === LUCK PILLARS (大運) ===
  luckPillars: LuckPillar[];

  // === SYMBOLIC STARS ===
  symbolicStars: {
    auspicious: string[];   // ["天乙貴人", "文昌"]
    inauspicious: string[]; // ["羊刃"]
    neutral: string[];      // ["華蓋"]
  };

  // === LIFE PALACE ===
  lifePalace: {
    stem: string;
    branch: string;
    element: string;
  };

  // === CONFLICTS ===
  conflicts: {
    clashes: Clash[];       // 冲
    harms: Harm[];          // 害
    punishments: Punishment[]; // 刑
    destructions: Destruction[]; // 破
  };

  // === GROWTH PHASES (十二長生) ===
  growthPhases: {
    year: string;   // "長生" | "沐浴" | etc.
    month: string;
    day: string;
    hour: string;
  };
}

interface Pillar {
  ganZhi: string;         // "乙未" (Chinese)
  ganZhiPinyin: string;   // "Yi Wei" (Pinyin)
  stem: {
    chinese: string;      // "乙"
    pinyin: string;       // "Yi"
    element: string;      // "Wood"
    polarity: string;     // "Yin"
  };
  branch: {
    chinese: string;      // "未"
    pinyin: string;       // "Wei"
    element: string;      // "Earth"
    animal: string;       // "Goat"
    hiddenStems: string[]; // ["己", "丁", "乙"]
  };
}

interface LuckPillar {
  ageStart: number;
  ageEnd: number;
  ganZhi: string;
  element: string;
  favorability: number;   // -1 to 1
  interpretation: string;
}
```

### 1.3 Western Chart (Python Output → Firebase)

```typescript
interface WesternChart {
  // === SUN/MOON/RISING ===
  sun: PlanetPosition;
  moon: PlanetPosition;
  rising: PlanetPosition;   // Ascendant

  // === ALL PLANETS ===
  planets: {
    mercury: PlanetPosition;
    venus: PlanetPosition;
    mars: PlanetPosition;
    jupiter: PlanetPosition;
    saturn: PlanetPosition;
    uranus: PlanetPosition;
    neptune: PlanetPosition;
    pluto: PlanetPosition;
    northNode: PlanetPosition;
    chiron: PlanetPosition;
  };

  // === HOUSES (Porphyry) ===
  houses: {
    cusps: number[];        // 12 house cusp degrees
    system: string;         // "Porphyry"
  };

  // === ELEMENT DISTRIBUTION ===
  elements: {
    Fire: number;           // 0.25
    Earth: number;          // 0.30
    Air: number;            // 0.20
    Water: number;          // 0.25
  };

  // === MODALITY DISTRIBUTION ===
  modalities: {
    Cardinal: number;       // 0.30
    Fixed: number;          // 0.40
    Mutable: number;        // 0.30
  };

  // === ASPECTS ===
  aspects: Aspect[];

  // === ASPECT PATTERNS ===
  patterns: {
    grandTrine: number;     // 0-1 strength
    tSquare: number;
    grandCross: number;
    yod: number;
    kite: number;
    stellium: number;
  };

  // === CHART SHAPE ===
  chartShape: {
    primary: string;        // "Bowl" | "Bucket" | "Locomotive" etc.
    scores: {
      bowl: number;
      bucket: number;
      bundle: number;
      locomotive: number;
      seesaw: number;
      splash: number;
      splay: number;
    };
  };

  // === 16-AXIS ARCHETYPE VECTOR ===
  archetypeVector: number[];  // 16 dimensions
  archetypeScores: {
    Initiator: number;
    Stabilizer: number;
    Relational: number;
    MindCentered: number;
    Intuitive: number;
    Concrete: number;
    Expressive: number;
    Transpersonal: number;
    RiskSeeking: number;
    OrderOriented: number;
    FluidIdentity: number;
    Warm: number;
    Direct: number;
    DepthOriented: number;
    Sustainer: number;
    BoundaryAware: number;
  };
}

interface PlanetPosition {
  sign: string;             // "Cancer"
  degree: number;           // 13.5
  house: number;            // 4
  isRetrograde: boolean;
  element: string;          // "Water"
  modality: string;         // "Cardinal"
}

interface Aspect {
  planet1: string;
  planet2: string;
  type: string;             // "conjunction" | "opposition" | "trine" etc.
  orb: number;              // Actual orb in degrees
  applying: boolean;
  strength: number;         // 0-1 based on orb tightness
}
```

### 1.4 Unified Profile (90-Dimensional Vector)

```typescript
interface UnifiedProfile {
  // === 90-DIMENSIONAL VECTOR ===
  vector: number[];           // Full 90-dim vector for cosine similarity

  // === VECTOR BREAKDOWN (for UI) ===
  sections: {
    westernArchetype: number[];   // [0-15] 16 dims
    westernPatterns: number[];    // [16-21] 6 dims
    westernElements: number[];    // [22-25] 4 dims
    westernModalities: number[];  // [26-28] 3 dims
    baziElements: number[];       // [29-33] 5 dims
    baziTenGods: number[];        // [34-43] 10 dims
    baziTenGodGroups: number[];   // [44-48] 5 dims
    baziStems: number[];          // [49-58] 10 dims
    baziBranches: number[];       // [59-70] 12 dims
    baziGrowthPhases: number[];   // [71-82] 12 dims
    baziDmStrength: number[];     // [83] 1 dim
    baziSymbolicStars: number[];  // [84-87] 4 dims
    baziPalaces: number[];        // [88-89] 2 dims
  };

  // === PERSONA ===
  persona: {
    archetype: string;        // "Grounded Anchor"
    temperament: string;      // "Warm Ground"
    patternSignature: string; // "Flow Master"
    description: string;
  };
}
```

### 1.5 Compatibility Result (Stored for Pairs)

```typescript
// Firebase: `compatibility/{profileIdA}_{profileIdB}`
interface CompatibilityResult {
  profileIdA: string;
  profileIdB: string;

  // === SCORES ===
  overall: {
    score: number;          // 0.8446
    grade: string;          // "B+"
    level: string;          // "excellent"
  };

  systemScores: {
    western: number;        // 0.9462
    bazi: number;           // 0.7968
  };

  sectionScores: SectionScore[];

  // === THIRD CHART ===
  thirdChart: {
    archetypeName: string;
    description: string;
    archetypeVector: number[];
    archetypeScores: Record<string, number>;
    stressPatterns: StressPattern[];
    stressClassification: string;
    lifecycleStages: LifecycleStage[];
  };

  // === NARRATIVE ===
  narrative: string;
  strengths: string[];
  challenges: string[];

  // === METADATA ===
  computedAt: Timestamp;
  computeVersion: string;
}
```

---

## 2. Current Translation Points (To Be Eliminated)

### 2.1 Naming Inconsistencies

| Location | Current Name | Canonical Name |
|----------|-------------|----------------|
| ProfileContext.jsx | `elementBalance` | `elements` |
| constitutionService.js | `elementalBalance` | `elements` |
| soulDNAEncoder.js | `elementalBalance.elements` | `elements` |
| archetypeMapper.js | `elementalBalance.elements` | `elements` |
| UnifiedCompatibilityPage.jsx | `element_distribution` | `elements` |
| Python bazi_engine | `element_distribution` | `elements` |

### 2.2 Data Transformation Points

| File | Function | Issue |
|------|----------|-------|
| `ProfileContext.jsx` | `buildFourPillarsData()` | Transforms Python output |
| `constitutionService.js` | `extractBazi()` | Re-extracts from profile |
| `constitutionService.js` | `calculateElementBalance()` | Re-calculates (should read) |
| `UnifiedCompatibilityPage.jsx` | `getElementsWithFallback()` | 10+ fallback paths |
| `UnifiedCompatibilityPage.jsx` | `extractElementsFromBaZi()` | Re-parses ganZhi |
| `soulDNAEncoder.js` | Element format conversion | Handles multiple formats |
| `archetypeMapper.js` | Element format conversion | Handles multiple formats |

### 2.3 Files to Refactor

**Delete or Simplify:**
- `src/services/constitutionService.js` - Replace with direct Firebase read
- `src/utils/soulDNAEncoder.js` - Move calculation to Python
- `src/utils/archetypeMapper.js` - Move calculation to Python

**Refactor:**
- `src/contexts/ProfileContext.jsx` - Remove `buildFourPillarsData`, store Python output directly
- `src/pages/UnifiedCompatibilityPage.jsx` - Remove all fallback logic
- `src/components/Results.jsx` - Read directly from `profile.bazi`, `profile.western`

---

## 3. Migration Plan

### Phase 1: Python Cloud Functions (Week 1)

**Goal:** Create HTTP endpoints that compute and return canonical JSON

#### 1.1 Create `functions-python/api/` Module

```
functions-python/
├── api/
│   ├── __init__.py
│   ├── compute_profile.py      # Full profile computation
│   ├── compute_compatibility.py # Pair compatibility
│   └── schemas.py              # Pydantic models matching TypeScript
├── bazi_engine/                # Existing
├── western_engine/             # Existing
└── unified_engine/             # Existing
```

#### 1.2 Endpoints

```python
# POST /api/compute-profile
# Input: { birthDate, birthTime, birthLat, birthLng, timezone, gender }
# Output: { bazi: BaZiChart, western: WesternChart, unified: UnifiedProfile }

# POST /api/compute-compatibility
# Input: { profileA: UnifiedProfile, profileB: UnifiedProfile }
# Output: CompatibilityResult
```

#### 1.3 Deploy as Cloud Functions

```python
# functions-python/main.py
@functions_framework.http
def compute_profile(request):
    """Compute full profile from birth data."""
    data = request.get_json()

    # Compute BaZi
    bazi = analyze_bazi(data['birthDate'], data['birthTime'], ...)

    # Compute Western
    western = analyze_western(data['birthDate'], data['birthTime'], ...)

    # Compute Unified
    unified = build_unified_expression(western, bazi, ...)

    return {
        'bazi': bazi.to_dict(),
        'western': western.to_dict(),
        'unified': unified.to_dict()
    }
```

### Phase 2: Firebase Storage Update (Week 2)

**Goal:** Store Python output directly in Firebase

#### 2.1 New Profile Save Flow

```javascript
// src/contexts/ProfileContext.jsx

async function createProfile(profileData) {
  // 1. Save basic profile data
  const docRef = await addDoc(collection(db, 'profiles'), {
    ...profileData,
    computeStatus: 'pending',
    createdAt: serverTimestamp()
  });

  // 2. Call Python backend to compute
  const computed = await fetch('/api/compute-profile', {
    method: 'POST',
    body: JSON.stringify({
      birthDate: profileData.birthDate,
      birthTime: profileData.birthTime,
      birthLat: profileData.birthLat,
      birthLng: profileData.birthLng,
      timezone: profileData.timezone,
      gender: profileData.gender
    })
  }).then(r => r.json());

  // 3. Store Python output DIRECTLY (no transformation)
  await updateDoc(docRef, {
    bazi: computed.bazi,
    western: computed.western,
    unified: computed.unified,
    computeStatus: 'complete',
    computedAt: serverTimestamp(),
    computeVersion: '1.0.0'
  });

  return { id: docRef.id, ...profileData, ...computed };
}
```

#### 2.2 Remove Constitution Subcollection

Old: `profiles/{id}/constitution/brain1a`
New: Data lives directly on `profiles/{id}` document

### Phase 3: Frontend Simplification (Week 3)

**Goal:** Frontend reads directly, no transformation

#### 3.1 Simplified Data Access

```javascript
// BEFORE (complex fallback logic)
function getElementsWithFallback(profile) {
  // 10+ fallback paths, multiple naming conventions
  const paths = [
    profile?.constitutional?.bazi?.elementBalance?.raw,
    profile?.constitutional?.bazi?.elementBalance,
    profile?.calculations?.fourPillars?.elementBalance,
    // ... etc
  ];
}

// AFTER (direct read)
function getElements(profile) {
  return profile.bazi.elements;
}
```

#### 3.2 Simplified Results.jsx

```javascript
// BEFORE
const fourPillars = profile?.calculations?.fourPillars;
const elements = getElementsWithFallback(profile);

// AFTER
const { bazi, western, unified } = profile;
const elements = bazi.elements;
const archetypeVector = western.archetypeVector;
```

#### 3.3 Remove Dead Code

- Delete `buildFourPillarsData()`
- Delete `extractBazi()`
- Delete `calculateElementBalance()`
- Delete `getElementsWithFallback()`
- Delete `extractElementsFromBaZi()`
- Delete `parseGanZhiElement()`
- Simplify `soulDNAEncoder.js` to just read from `profile.bazi`
- Simplify `archetypeMapper.js` to just read from `profile.western`

### Phase 4: Migration Script (Week 4)

**Goal:** Migrate existing profiles to new schema

```python
# scripts/migrate_profiles.py

async def migrate_profile(profile_id):
    """Recompute and update a profile to new schema."""

    # 1. Read existing profile
    profile = await get_profile(profile_id)

    # 2. Compute fresh data
    computed = compute_profile({
        'birthDate': profile['birthDate'],
        'birthTime': profile['birthTime'],
        'birthLat': profile['birthLat'],
        'birthLng': profile['birthLng'],
        'timezone': profile.get('timezone', 'UTC'),
        'gender': profile['gender']
    })

    # 3. Update profile with canonical schema
    await update_profile(profile_id, {
        'bazi': computed['bazi'],
        'western': computed['western'],
        'unified': computed['unified'],
        'computeStatus': 'complete',
        'computedAt': datetime.now(),
        'computeVersion': '1.0.0',
        # Remove old fields
        'calculations': FieldValue.delete(),
        'chineseZodiac': FieldValue.delete(),
        'constitutional': FieldValue.delete()  # Subcollection will be orphaned
    })

    print(f"Migrated: {profile_id}")
```

---

## 4. TypeScript Interfaces (Frontend)

Create a single source of truth for types:

```typescript
// src/types/genesis.types.ts

// Re-export from a single file
export type { Profile } from './profile.types';
export type { BaZiChart, Pillar, LuckPillar } from './bazi.types';
export type { WesternChart, PlanetPosition, Aspect } from './western.types';
export type { UnifiedProfile } from './unified.types';
export type { CompatibilityResult } from './compatibility.types';
```

---

## 5. API Contract

### 5.1 Compute Profile

```
POST /api/compute-profile
Content-Type: application/json

Request:
{
  "birthDate": "1983-07-06",
  "birthTime": "08:40",
  "birthLat": 31.3389,
  "birthLng": 104.2186,
  "timezone": "Asia/Shanghai",
  "gender": "female"
}

Response:
{
  "bazi": { ... },      // BaZiChart
  "western": { ... },   // WesternChart
  "unified": { ... },   // UnifiedProfile
  "computeVersion": "1.0.0"
}
```

### 5.2 Compute Compatibility

```
POST /api/compute-compatibility
Content-Type: application/json

Request:
{
  "profileA": { "unified": { ... } },
  "profileB": { "unified": { ... } }
}

Response:
{
  "overall": { "score": 0.8446, "grade": "B+", "level": "excellent" },
  "systemScores": { "western": 0.9462, "bazi": 0.7968 },
  "sectionScores": [ ... ],
  "thirdChart": { ... },
  "narrative": "...",
  "strengths": [ ... ],
  "challenges": [ ... ]
}
```

---

## 6. Benefits

1. **Speed:** Compute once on save, read instantly forever
2. **Consistency:** One format, one naming convention
3. **Debuggability:** Data in Firebase = what Python computed = what UI shows
4. **Scalability:** No client-side computation, just reads
5. **AI-Ready:** Clean JSON for LLM system prompts
6. **Maintainability:** Less code, clearer data flow

---

## 7. Verification Checklist

After migration, verify:

- [ ] `profile.bazi.elements` has 5 elements summing to ~1.0
- [ ] `profile.western.elements` has 4 elements summing to ~1.0
- [ ] `profile.unified.vector` has exactly 90 dimensions
- [ ] No `calculations`, `constitutional`, `elementBalance`, `elementalBalance` fields
- [ ] All profiles have `computeVersion` field
- [ ] UI displays data without console errors
- [ ] Compatibility page works without fallback paths
- [ ] SoulDNA generates without format conversion

---

*Document Version: 1.0.0*
*Created: January 2026*
*"Python computes. Firebase stores. Frontend reads. No translation."*
