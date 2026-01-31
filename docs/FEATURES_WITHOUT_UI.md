# Features Without UI

This document catalogs backend capabilities that exist but lack frontend UI components.

---

## PRIORITY 1: Luna Fusion P4-P8 Features

### P4: Natal Aspects Engine
**Backend:** `functions-python/luna_fusion/sources/aspects.py`
**API Service:** `lunaFusionService.js` → `calculateNatalAspects()`
**Status:** Backend complete, no dedicated UI

**Features without UI:**
- Natal aspect calculations (7 aspect types)
- Planet-pair specific modifiers (Sun-Moon, Venus-Mars, etc.)
- Aspect pattern detection (Grand Trine, T-Square, Kite, Yod, Grand Cross)
- 30-facet personality modifiers from aspects
- Orb-weighted strength calculations

**Recommended UI:** Natal Aspects Panel showing:
- List of natal aspects with orbs
- Detected aspect patterns with interpretations
- Personality impact visualization

---

### P5: Transits Engine
**Backend:** `functions-python/luna_fusion/transits/transits_engine.py`
**API Service:** `lunaFusionService.js` → `calculateTransits()`, `getActiveTransits()`, `getTransitForecast()`
**Frontend Component:** `TransitsPanel.jsx` (created but not integrated)

**Missing Integration:**
- No page displays TransitsPanel
- No connection to user dashboard
- Transit forecast feature unused

**Recommended:** Add to Dashboard or create Transits page

---

### P7: Jungian Archetypes
**Backend:** `functions-python/luna_fusion/archetypes/archetype_engine.py`
**API Service:** `lunaFusionService.js` → `getArchetypes()`, `getDominantArchetypes()`, `getArchetypeNarrative()`
**Frontend Component:** `JungianArchetypePanel.jsx` (created but not integrated)

**Features:**
- 12 Jungian archetypes with cosine similarity matching
- Dominant archetype identification
- Narrative generation for archetype combinations
- Shadow aspects for each archetype

**Missing Integration:**
- No page displays JungianArchetypePanel
- Could enhance user profile page

---

### P8: Secondary Progressions
**Backend:** `functions-python/luna_fusion/progressions/progressions_engine.py`
**API Service:** `lunaFusionService.js` → `calculateProgressions()`, `getProgressedMoon()`, `getProgressionInterpretation()`
**Frontend Component:** `ProgressionsPanel.jsx` (created but not integrated)

**Features:**
- Progressed Moon position and sign interpretation
- Progressed Sun evolution tracking
- Progressed aspects to natal
- Life phase interpretation

**Missing Integration:**
- No page displays ProgressionsPanel

---

### Luna Personality Configuration
**Backend:** `functions-python/luna_fusion/core/fusion_engine.py`
**API Service:** `lunaFusionService.js` → `getLunaPersonality()`, `adaptLunaToUser()`

**Features without UI:**
- 5 preset personalities (Nurturing Guide, Wise Sage, Playful Companion, Direct Challenger, Empathic Listener)
- Personality tuner sliders (warmth, directness, playfulness, depth, challenge)
- User-adaptive personality based on synastry

**Recommended UI:** Luna Personality Tuner page with:
- Preset selector
- 5 adjustment sliders
- Preview of Luna's tone

---

## PRIORITY 2: Python Cloud Functions

### BaZi DaYun (10-Year Luck Pillars)
**Endpoint:** `bazi_dayun`
**Status:** DONE - UI integrated

**Features:**
- 10-year luck cycle calculation
- Current DaYun identification
- Future DaYun timeline
- LiuNian (annual) and XiaoYun (minor) luck
- Element flow analysis

**UI Location:** `/bazi-calculator` → "Luck Pillars" tab
**Components:** `DaYunPanel.jsx`, `baziDayunService.js`

---

### Composite Chart (P6)
**Endpoint:** `luna_composite_chart`
**API Service:** `lunaFusionService.js` → `calculateCompositeChart()`
**Status:** DONE - UI integrated

**Features:**
- Midpoint composite chart calculation
- Relationship personality vector
- Composite aspects and patterns
- Relationship archetype

**UI Location:** `/match` → "Relationship Chart" tab
**Components:** `CompositeChartPanel.jsx`

---

### Neo4j Soul Family Discovery
**Endpoint:** `find_soul_family`
**Service:** `soulFamilyAgentService.js`
**Status:** DONE - Enhanced UI

**Features:**
- Natural language queries to graph database
- Soul family network visualization
- Quick query buttons for common searches
- Query history

**UI Location:** `/soul-family` → "Discover" and "Network" tabs
**Components:** `DiscoveryPanel`, `NetworkView` (in SoulFamilyPage.jsx)

---

## PRIORITY 3: JavaScript Cloud Functions

### Memory Explorer / Happiness Anchors
**Functions:** `storeMemory`, `retrieveMemories`, `getFacts`, `storeFact`, `getPeople`, `upsertPerson`, `getHappinessAnchors`, `storeHappinessAnchor`
**Status:** DONE - UI integrated

**Features:**
- Memory browser/explorer with search
- Happiness anchors with sensory details (sight, sound, smell)
- Joy network visualization
- Recall tracking

**UI Location:** `/memory-explorer` → "Happiness Anchors" and "All Memories" tabs
**Components:** `MemoryExplorerPage.jsx`

---

### Emotion Trends
**Functions:** `getEmotionTrends`
**Status:** DONE - UI integrated

**Features:**
- Emotion trends visualization over 30 days
- Mood distribution charts
- Vulnerability rate tracking
- Session history timeline

**UI Location:** `/memory-explorer` → "Emotion Trends" tab
**Components:** `MemoryExplorerPage.jsx`

---

### Relationship Stats
**Functions:** `initializeRelationship`, `getRelationshipStats`, `updateRelationshipStats`, `celebrateMilestone`
**Status:** DONE - UI integrated

**Features:**
- Relationship milestone tracking
- Luna-user bond statistics (new → growing → established → deep → soulbound)
- Celebration triggers
- Luna's current state visualization

**UI Location:** `/memory-explorer` → "Relationship" tab
**Components:** `MemoryExplorerPage.jsx`

---

### Multi-AI Perspectives / AI Constellation
**Functions:** `getSecondOpinion`, `getGrokPerspective`, `getOpusPerspective`, `getDeepSeekPerspective`, `getChatGPTPerspective`
**Status:** DONE - UI integrated

**Features:**
- Get perspectives from 5 AI models (Gemini, Grok, Opus, DeepSeek, ChatGPT)
- Constellation view with all perspectives
- Debate mode for interactive discussions
- Side-by-side comparison view
- Thinking/reasoning process display

**UI Location:** `/constellation`
**Components:** `ConstellationPage.jsx`

---

### Timeline System
**Functions:** `getTimelineEvents`, `searchTimelinePG`, `getTimelineWithQuestions`
**Page:** `TimelineConsolePage.jsx` exists (admin)

**Missing for Users:**
- User-facing timeline visualization
- Timeline with embedded questions

---

### Personality Evolution
**Functions:** `getPersonalityWeights`, `evolvePersonalityWeights`

**Status:** No UI

**Features:**
- Track personality changes over time
- Weight evolution based on interactions

---

## PRIORITY 4: Services Without Pages

### Emotional Intelligence Module
**Service:** `lunaEmotionalIntelligence.js`

**Features without UI visibility:**
- Six Laws of Happiness detection
- Pillow Mode (soft landing during difficult times)
- Rocket Mode (joy amplification)
- Constitutional comparison prevention
- Warmth calibration

**Note:** Used internally by chat, but no dashboard showing current emotional state detection

---

### Brain Tickler Service
**Service:** `brainTicklerService.js`

**Features:**
- 100+ hierarchical life story questions
- Category → Subcategory → Questions structure
- AI-powered question generation

**Current UI:** Used in BiographyJournalPage
**Missing:** Admin UI to manage question library

---

### Soul Letter Service
**Service:** `soulLetterService.js`

**Supported Modes (10+ modes):**
- `letter` - Full Letter From the Chart
- `structured` - Complete JSON narration
- `whisper` - Quick 3-5 sentence insight
- `cathedral` - Full Cathedral Analysis
- `sign` - Per-sign narration
- `house` - Per-house emotional narration
- `retrograde` - Retrograde soul messages
- `direct` - Direct planet messages
- `recognition` - Soul recognition moments
- `aspect` - Aspect dialogue
- `epoch` - Epoch narration

**Current UI:** Partial in SoulGardenPage
**Missing:** Many modes have no UI trigger

---

### Sanctuary Service
**Service:** `sanctuaryService.js`
**Page:** `SanctuaryPage.jsx` exists

**Missing Features:**
- Deep Soul Mode (full psychological architecture)
- Mode switcher in UI

---

### Confessional Service
**Service:** `confessionalService.js`

**Status:** Backend complete, no dedicated page

**Features:**
- Soul confession submission
- Compassionate AI response
- Gentle practices suggestions

---

### Proactive Intelligence
**Service:** `proactiveIntelligence.js`

**Status:** Used internally, no visibility

**Features:**
- Proactive conversation starters
- Context-aware suggestions

---

### Focus Mode / Focus Report
**Services:** `focusModeService.js`, `focusReportService.js`

**Status:** No UI

**Features:**
- Focus session tracking
- Focus report generation

---

### House Strength Service
**Service:** `houseStrengthService.js`
**Function:** `getHouseStrengthTimeline`

**Status:** No dedicated UI

**Features:**
- House strength timeline calculations
- Temporal house activation

---

## Summary Table

| Feature | Backend | Service | UI Component | Page Integration |
|---------|---------|---------|--------------|------------------|
| P4 Natal Aspects | DONE | DONE | DONE | DONE (/dynamic-personality) |
| P5 Transits | DONE | DONE | DONE | DONE (/dynamic-personality) |
| P7 Archetypes | DONE | DONE | DONE | DONE (/dynamic-personality) |
| P8 Progressions | DONE | DONE | DONE | DONE (/dynamic-personality) |
| Luna Personality Tuner | DONE | DONE | DONE | DONE (/luna-tuner) |
| BaZi DaYun | DONE | DONE | DONE | DONE (/bazi-calculator) |
| Composite Chart | DONE | DONE | DONE | DONE (/match) |
| Neo4j Soul Family | DONE | DONE | DONE | DONE (/soul-family) |
| Memory Explorer | DONE | DONE | DONE | DONE (/memory-explorer) |
| Happiness Anchors | DONE | DONE | DONE | DONE (/memory-explorer) |
| Emotion Trends | DONE | DONE | DONE | DONE (/memory-explorer) |
| Relationship Stats | DONE | DONE | DONE | DONE (/memory-explorer) |
| Multi-AI Perspectives | DONE | DONE | DONE | DONE (/constellation) |
| Soul Confessional | DONE | DONE | NONE | NONE |
| Soul Letter (all modes) | DONE | DONE | PARTIAL | PARTIAL |

---

## Recommended Next Steps

### COMPLETED (Priority 1-3):
- P4 Natal Aspects → `/dynamic-personality`
- P5 Transits → `/dynamic-personality`
- P7 Jungian Archetypes → `/dynamic-personality`
- P8 Secondary Progressions → `/dynamic-personality`
- Luna Personality Tuner → `/luna-tuner`
- BaZi DaYun (10-Year Luck Pillars) → `/bazi-calculator`
- Composite Chart (P6) → `/match`
- Neo4j Soul Family Discovery → `/soul-family`
- Memory Explorer / Happiness Anchors → `/memory-explorer`
- Emotion Trends → `/memory-explorer`
- Relationship Stats → `/memory-explorer`
- Multi-AI Perspectives → `/constellation`

### Priority 4 (Remaining):
1. **High Value** - Create new pages:
   - Soul Confessional page
   - Personality Evolution tracker

2. **Enhancement** - Expose hidden features:
   - Add all Soul Letter modes to UI
   - Focus Mode/Focus Report page
   - Emotional Intelligence state dashboard
   - House Strength timeline visualization
