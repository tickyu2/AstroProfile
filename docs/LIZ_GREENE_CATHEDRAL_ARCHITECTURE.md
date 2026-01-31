# Liz Greene Cathedral of Psychological Astrology

## Architecture Documentation

**Version:** 7.0 — Master Orchestrator + Relationship OS Complete
**Date:** January 2026
**Status:** Implemented (Full Cathedral OS + Relationship Destiny + Master Orchestrator)

---

## Overview

The Liz Greene Cathedral is a dedicated deep-dive experience for psychological astrology, implementing Liz Greene's approach to depth psychology through astrological symbolism. It synthesizes:

- **Joseph Campbell's Hero's Journey** (monomyth structure)
- **Carl Jung's Individuation Process** (psychological wholeness)
- **Liz Greene's Psychological Astrology** (astrology as soul language)

### Core Insight

> "Myth, Jungian psychology, and astrology are three expressions of the same archetypal reality—narrative, psychological, and symbolic."
> — Liz Greene

---

## File Structure

```
src/
├── pages/
│   └── LizGreeneCathedralPage.jsx            # Main 12-tab cathedral interface (wired to orchestrator)
│
├── components/
│   ├── pilgrim/
│   │   └── PilgrimJourneyStage.jsx           # Mythic script renderer + navigation
│   ├── saturn/
│   │   └── SaturnJourneyPanel.jsx            # Saturn Journey UI component
│   └── relationship/                          # Relationship OS UI
│       ├── index.js                           # Export barrel
│       ├── RelationshipDestinyPanel.jsx       # Multi-chapter scroll UI
│       ├── RelationshipDestinyMap.jsx         # Radial mandala visualization
│       └── RelationshipDestinyPanel.css       # Cathedral-style animations
│
├── types/
│   └── CathedralProfile.ts                    # ⭐ TypeScript type definitions (production-ready)
├── data/
│   ├── pilgrimJourneyScripts.js              # All 8 stage mythic narratives
│   ├── saturnJourneyInterpretations.js       # Saturn sign profiles & modifiers
│   │
│   │   # ═══════════════════════════════════════════════════════════════════
│   │   # SATURN JOURNEY v2.0 DATA MODULES
│   │   # ═══════════════════════════════════════════════════════════════════
│   │
│   ├── saturnHouseOverlays.js                # House-specific wound/defense/gift/return
│   ├── saturnCombinedArchetypes.js           # 144 sign+house archetypes + mythic skin
│   ├── saturnAspectComplexes.js              # Moon/Sun/Venus/Mars/etc-Saturn complexes
│   ├── saturnLunaIntegration.js              # Triggers, inner critic scripts, prompts
│   ├── saturnCathedralPath.js                # 12 initiation chambers
│   └── saturnRelationshipDynamicsData.js     # Projection/wound/contract/break/healing data
│
├── utils/
│   ├── psychologicalProfileGenerator.js      # Core profile generation
│   ├── aspectPatternDetector.js              # Pattern detection engine
│   ├── mythicArchetypeSystem.js              # Archetypes & shadows
│   ├── herosJourneyFramework.js              # Individuation roadmap
│   ├── psychologicalNarrativeGenerator.js    # Narrative generation
│   ├── greeneIndividuationEngine.js          # 8-stage individuation engine
│   ├── pilgrimJourneyMapper.js               # Chamber definitions & mapping
│   ├── pilgrimJourneyRouter.js               # Auto-loads stage by age
│   │
│   │   # ═══════════════════════════════════════════════════════════════════
│   │   # SATURN JOURNEY v1.0 MODULES
│   │   # ═══════════════════════════════════════════════════════════════════
│   │
│   ├── saturnJourneyConstants.js             # Saturn phases & wound types
│   ├── saturnJourneyEngine.js                # Main Saturn Journey generator (v2.0 integrated)
│   ├── saturnJourneyNarrative.js             # Liz Greene-style narrative builder
│   │
│   │   # ═══════════════════════════════════════════════════════════════════
│   │   # SATURN JOURNEY v2.0 ENGINE MODULES
│   │   # ═══════════════════════════════════════════════════════════════════
│   │
│   ├── saturnShadowIntegration.js            # Shadow profile builder + integration moves
│   ├── saturnReturnReport.js                 # Saturn Return generator + date calculations
│   ├── saturnLunaDialogue.js                 # Luna dialogue engine + trigger detection
│   ├── saturnRelationshipEngine.js           # Relationship dynamics engine (Liz Greene's "Relating")
│   │
│   │   # ═══════════════════════════════════════════════════════════════════
│   │   # ASTROLOGY OF FATE MODULES (Liz Greene's "The Astrology of Fate")
│   │   # ═══════════════════════════════════════════════════════════════════
│   │
│   ├── fateThreads.js                        # Mythic Fate Threads Engine (Sun/Moon/Saturn/Pluto/Nodes)
│   ├── fateArchetypes.js                     # Archetype Assignment (Saturn + Pluto)
│   ├── fateCrossroads.js                     # Life Crossroads Detection (Saturn Return, Pluto Square, etc.)
│   ├── fateChoiceIndex.js                    # Fate vs Choice Index (0-100 scale)
│   ├── synastryFateEngine.js                 # Synastry Fate Engine (relationship fate analysis)
│   ├── buildSaturnJourneyProfile.js          # ⭐ MAIN ORCHESTRATOR - single entry point
│   │
│   │   # ═══════════════════════════════════════════════════════════════════
│   │   # COMPOSITE PSYCHOLOGICAL ENGINE (Liz Greene's "Relating" - Third Psyche)
│   │   # ═══════════════════════════════════════════════════════════════════
│   │
│   ├── compositeGenerator.js                 # Midpoint chart calculation
│   ├── compositePsychology.js                # Core psychological profile (Sun/Moon/Mercury/Venus/Mars)
│   ├── compositeShadow.js                    # Shadow & defense patterns (Saturn/Pluto/8th House)
│   ├── compositeArchetype.js                 # Relationship archetypes (element combinations)
│   ├── compositeFateThreads.js               # Fate threads for composite (Nodes/Saturn/Pluto)
│   ├── compositeHealth.js                    # Health indicators & warnings
│   ├── compositeGrowth.js                    # Growth path & developmental phases
│   ├── buildCompositePsychologicalProfile.js # ⭐ COMPOSITE ORCHESTRATOR - third psyche entry point
│   │
│   │   # ═══════════════════════════════════════════════════════════════════
│   │   # RELATIONSHIP OS (Soul Map, Timeline, Evolution, Healing)
│   │   # ═══════════════════════════════════════════════════════════════════
│   │
│   ├── relationshipSoulMap.js                # Identity, emotional body, shadow, contract, fate
│   ├── relationshipTimeline.js               # Seasons, fate windows, transits
│   ├── relationshipEvolution.js              # 7-stage evolution across Saturn cycles
│   ├── relationshipHealing.js                # Luna-guided repair engine
│   ├── buildRelationshipDestinyReport.js     # ⭐ RELATIONSHIP OS ORCHESTRATOR
│   ├── relationshipDestinyPdf.js             # Illuminated manuscript PDF renderer
│   │
│   │   # ═══════════════════════════════════════════════════════════════════
│   │   # MASTER ORCHESTRATOR (Wires the entire Cathedral)
│   │   # ═══════════════════════════════════════════════════════════════════
│   │
│   └── buildLizGreeneCathedralProfile.js     # ⭐⭐ MASTER ORCHESTRATOR - SINGLE ENTRY POINT
```

---

## Tab Structure

### Tab 1: Soul Portrait (Overview)
- Trinity Card (Sun/Moon/Rising)
- Life Question
- Elemental Nature
- Growth Path Preview
- **Psychological Myth Narrative** (7-section generated story)

### Tab 2: The Trinity
- Sun Deep Dive (Core Identity)
- Moon Deep Dive (Emotional Nature)
- Rising Deep Dive (Persona)
- Expandable cards with full psychological content

### Tab 3: Tripartite Soul (Platonic Psychology)
- **Reason (Logos)**: Mercury-Saturn Dynamic
- **Spirit (Thumos)**: Mars-Neptune Dynamic
- **Appetite (Epithumia)**: Venus-Jupiter Dynamic

### Tab 4: Aspect Patterns
- Grand Trines, T-Squares, Yods, Grand Crosses, Kites
- **Quincunxes** (Greene's "invisible friction")
- Quincunx Chains (chronic adjustment patterns)
- Pattern psychology with light/shadow/integration

### Tab 5: Planetary Psychology
- Individual planet cards (Mercury through Pluto)
- Psychological function for each planet
- Retrograde notes where applicable

### Tab 6: Shadow Work
- Shadow Material aggregation
- **Mythic Archetypes** (planetary archetypes with myth, gift, wound, quest)
- **Defense Mechanisms** by sign with:
  - Primary/Secondary defenses
  - **Triggers** (what activates this defense)
  - **Protects** (what vulnerability it guards)
  - Integration path
- **Shadow Archetypes** with:
  - Triggers
  - Protects
  - **Mythic Resonance** (Greek myth parallel)
  - Integration

### Tab 7: Greene × Jung
- Planet-Complex mapping table
- **Archetypal Fingerprint** (Primary/Secondary/Shadow)
- Current Individuation Phase (age-based)
- Active Hero's Journey Stages
- Upcoming Initiations (Saturn cycles, outer planet transits)
- Integration Tasks

### Tab 8: Pilgrim Journey ⟡
- **Progress Bar** - Visual journey completion indicator
- **Stage Navigator** - 8 clickable stage cards showing journey path
- **Current Mythic Script** - Full 6-section ritual narrative:
  - Threshold Invocation
  - Chamber Atmosphere
  - Archetypal Encounter
  - Trial / Task
  - Integration Gesture
  - Closing Benediction
- **Greene's Insight** - Psychological wisdom for current stage
- **Jungian Parallel** - Connection to Jung's individuation concepts
- **Navigation Buttons** - Previous/Next stage traversal

### Tab 9: Saturn Journey 🪨 (NEW)
The psychological backbone that transforms astrology into adulthood.

- **Saturn Cycle Visualization** - Circular progress showing position in 29.5-year cycle
- **Saturn Wound Section** - Origin story:
  - Core fear
  - Early experience
  - Authority imprint
  - Inner critic voice
  - Attachment flavor
- **Defense Pattern Section** - Adaptive intelligence:
  - Primary defense
  - Secondary defense
  - What it protects
  - What it costs
  - Somatic clue
- **Saturn Tests Timeline** - Interactive developmental phases:
  - First Square (~7)
  - Opposition (~14)
  - Second Square (~21)
  - Saturn Return (~29-30) ← **INITIATION**
  - Second Opposition (~44)
  - Second Return (~58-60) ← **ELDER INITIATION**
- **Saturn Return Panel** - The turning point:
  - What collapses
  - What must be claimed
  - The initiation
  - The new rule
- **Saturn Gift Section** - Earned authority:
  - Authority style
  - Mastery domain
  - What others trust you for
  - Legacy
- **Luna Integration Guide** - AI companion support:
  - Saturn triggers
  - Support strategies
  - Language to use/avoid
  - Current phase support

---

## Core Modules

### 1. Mythic Archetype System
**File:** `mythicArchetypeSystem.js`

#### PLANETARY_ARCHETYPES
Maps each planet to its mythic archetype:

| Planet | Archetype | Myth | Core | Gift | Wound | Quest |
|--------|-----------|------|------|------|-------|-------|
| Sun | The Hero-King | Apollo | Consciousness & purpose | Creative vitality | Father wound | Radiate authentic self |
| Moon | The Great Mother | Selene/Artemis | Emotional core | Nurturing | Abandonment | Find inner security |
| Mercury | The Trickster | Hermes | Mind & communication | Mental agility | Being misunderstood | Connect & translate |
| Venus | The Lover | Aphrodite | Love & values | Creating beauty | Rejection | Honor what you love |
| Mars | The Warrior | Ares | Will & desire | Courageous action | Powerlessness | Assert without harm |
| Jupiter | The Sage | Zeus | Meaning & expansion | Faith & vision | Meaninglessness | Expand wisely |
| Saturn | The Wise Old Man | Kronos | Structure & limitation | Mastery | Inadequacy | Build lasting value |
| Uranus | The Revolutionary | Prometheus | Liberation | Genius & innovation | Not belonging | Liberate without destroying |
| Neptune | The Mystic | Poseidon | Transcendence | Compassion & vision | Dissolution | Find sacred in ordinary |
| Pluto | The Transformer | Hades | Power & rebirth | Transformative power | Betrayal | Die & be reborn |

#### DEFENSE_MECHANISMS
By zodiac sign, each with:
- `primary`: Main defense mechanism
- `secondary`: Backup defense
- `triggers`: What activates this defense
- `protects`: The vulnerability being guarded
- `integration`: Path to healthy expression

Example (Scorpio):
```javascript
Scorpio: {
  primary: "Projection",
  description: "Seeing in others what you cannot acknowledge in yourself.",
  secondary: "Splitting",
  secondaryDesc: "Seeing people as all good or all bad.",
  triggers: "Vulnerability, superficiality, being lied to or betrayed.",
  protects: "Devastating betrayal trauma. The memory of being deeply hurt.",
  integration: "Everyone contains both light and shadow."
}
```

#### SHADOW_ARCHETYPES
By planet, each with:
- `shadow`: The shadow archetype name
- `description`: How it manifests
- `triggers`: What activates the shadow
- `protects`: What vulnerability the shadow guards
- `mythicResonance`: Greek myth parallel
- `integration`: Path to wholeness

Example (Pluto):
```javascript
pluto: {
  shadow: "The Manipulator",
  description: "Power becoming control, transformation becoming destruction.",
  triggers: "Vulnerability, intimacy, situations where you might be betrayed.",
  protects: "The memory of devastating betrayal—the vow to never be helpless again.",
  mythicResonance: "Hades abducting Persephone—power that takes rather than receives",
  integration: "True power transforms self first. Control prevents real change."
}
```

---

### 2. Aspect Pattern Detector
**File:** `aspectPatternDetector.js`

#### Detected Patterns

| Pattern | Description | Psychology |
|---------|-------------|------------|
| **Grand Trine** | 3 planets in mutual trine (120°) | Natural talent, potential complacency |
| **T-Square** | 2 oppositions + 1 square | Driving tension, achievement through conflict |
| **Yod** | 2 sextiles + 2 quincunxes ("Finger of God") | Fated mission, uncomfortable calling |
| **Grand Cross** | 4 planets, 2 oppositions, 4 squares | Major challenge, potential mastery |
| **Kite** | Grand Trine + 1 opposition | Talent with direction, focused gift |
| **Quincunx** | 150° aspect ("invisible friction") | Perpetual adjustment, incompatibility |
| **Quincunx Chain** | Multiple connected quincunxes | Chronic adaptation, remarkable flexibility |

#### Quincunx Detection (Greene's Insight)
```javascript
// Greene's "invisible friction" - planets share nothing in common
// Not element, not modality - they simply don't understand each other
function detectQuincunxes(positions) {
  // Detects 150° aspects with 2° orb
  // Returns psychology, shadow, and integration for each
}
```

Each quincunx includes:
- `psychology`: Why these planets create friction
- `shadow`: Health/projection risks
- `integration`: How to work with (not resolve) the tension

---

### 3. Hero's Journey Framework
**File:** `herosJourneyFramework.js`

#### The 12 Journey Stages (Mapped to Houses)

| Stage | House | Phase | Description |
|-------|-------|-------|-------------|
| 1. Ordinary World | 1st | Departure | Default persona, starting point |
| 2. Call to Adventure | 4th | Departure | Deep yearning, unconscious call |
| 3. Refusal of the Call | 12th | Departure | Hidden fears, self-sabotage |
| 4. Meeting the Mentor | 9th | Departure | Teachers, higher wisdom |
| 5. Crossing the Threshold | 7th | Initiation | Engaging the Other/unknown |
| 6. Tests, Allies, Enemies | 6th | Initiation | Daily trials, discernment |
| 7. Approach to Inmost Cave | 8th | Initiation | Preparing for ego death |
| 8. The Ordeal | 8th | Initiation | Greatest fear, transformation |
| 9. Reward | 5th | Return | Creative power claimed |
| 10. The Road Back | 3rd | Return | Translating wisdom |
| 11. Resurrection | 10th | Return | Public integration |
| 12. Return with Elixir | 11th | Return | Service to collective |

#### Saturn Cycles

| Cycle | Age | Phase | Task |
|-------|-----|-------|------|
| First Square | 7-8 | Awakening Consciousness | Developing individual will |
| First Opposition | 14-15 | Identity Rebellion | Differentiating from family |
| Third Square | 21-22 | Adult Emergence | Making real commitments |
| **First Return** | 28-30 | **Maturity Initiation** | Rebuilding on authentic foundation |
| Fourth Square | 36-37 | Mid-life Reckoning | Integrating shadow |
| Second Opposition | 44-45 | Purpose Crisis | Accepting mortality |
| Fifth Square | 51-52 | Wisdom Harvest | Becoming an elder |
| Second Return | 58-60 | Elder Emergence | Final restructuring |

#### Outer Planet Initiations

| Transit | Age | Theme | Gift |
|---------|-----|-------|------|
| Uranus Square | 21 | Liberation | Discovery of unique path |
| Neptune Square | 41 | Disillusionment | Opening to transcendence |
| Uranus Opposition | 42 | Revolution | Second chance at unlived life |
| Chiron Return | 50-51 | Wounded Healer | Suffering → service |
| Neptune Trine | 55 | Spiritual Harvest | Natural spiritual authority |
| Uranus Return | 84 | Liberation Complete | Full embodiment before death |

#### Archetypal Fingerprint
Determines primary/secondary/shadow archetype from chart:
- **Hero**: Sun, Mars, Aries, 1st house
- **Lover**: Venus, Moon, Libra, Taurus, 7th house
- **Sage**: Mercury, Jupiter, Virgo, Sagittarius, 9th house
- **Magician**: Pluto, Uranus, Scorpio, 8th house
- **Sovereign**: Sun, Saturn, Leo, Capricorn, 10th house
- **Innocent**: Moon, Neptune, Cancer, Pisces, 12th house

---

### 4. Psychological Narrative Generator
**File:** `psychologicalNarrativeGenerator.js`

Generates a 7-section psychological myth:

| Section | Type | Content |
|---------|------|---------|
| **The Mythic Identity** | opening | Who you ARE at your core |
| **The Core Wound** | wound | Saturn-based wound (father/mother/worth/power/etc.) |
| **The Sacred Quest** | quest | What you're here to do |
| **The Shadow Journey** | shadow | What you must integrate |
| **Your Gifts** | gift | What emerged from your wound |
| **The Pattern of Your Life** | pattern | Aspect configurations |
| **The Unfolding Story** | closing | Where you're headed |

#### Wound Types (Saturn Sign Based)

| Saturn Sign | Wound Type |
|-------------|------------|
| Aries, Leo | Power, Father |
| Taurus, Virgo | Worth |
| Gemini | Voice |
| Cancer, Pisces | Mother |
| Libra, Aquarius | Belonging |
| Scorpio | Betrayal |
| Sagittarius | Meaning |
| Capricorn | Father |

---

### 5. Greene Individuation Engine (NEW)
**File:** `greeneIndividuationEngine.js`

The core engine for mapping life stages to psychological development phases.

#### GREENE_INDIVIDUATION_STAGES
8 stages of psychological development:

| Stage ID | Label | Chamber | Age Range | Description |
|----------|-------|---------|-----------|-------------|
| egoFormation | Ego Formation | birth | 0-14 | Initial ego architecture, early complexes, parental introjects |
| shadowEmergence | Shadow Emergence | foundations | 14-28 | First confrontation with unlived self |
| animaAnimus | Anima/Animus | persona | 28-35 | Contrasexual integration, projection work |
| complexConfrontation | Complex Confrontation | ritual | 35-42 | Active engagement with personal demons |
| underworldDescent | Underworld Descent | ancestral | 42-50 | Confronting mortality, ancestral patterns |
| encounterSelf | Encounter with Self | mythos | 50-58 | Direct experience of archetypal Self |
| reintegration | Reintegration | sovereign | 58-70 | Conscious synthesis of all parts |
| individuatedLife | Individuated Life | completion | 70+ | Living from wholeness, elder wisdom |

#### Key Functions
```javascript
// Determine stage based on age
determineIndividuationStage(profile) → stageId

// Get full stage data
getStageById(stageId) → stage object

// Get all stages in order
getAllStages() → array
```

---

### 6. Pilgrim Journey Mapper (NEW)
**File:** `pilgrimJourneyMapper.js`

Maps individuation stages to Cathedral chambers.

#### PILGRIM_CHAMBERS
8 chambers representing sacred spaces in the psyche:

| Chamber | Symbol | Color | Description | Themes |
|---------|--------|-------|-------------|--------|
| birth | ⟡ | purple | Where the first stones of identity are laid | origin, imprint, foundation, innocence |
| foundations | ☾ | slate | Where the unseen structures live | shadow, hidden, repressed, subterranean |
| persona | ☿ | blue | Where reflections multiply and distort | masks, mirrors, projection, relationship |
| ritual | 🔥 | amber | Where the psyche stages its initiations | trial, transformation, guardian, ceremony |
| ancestral | ⚰ | indigo | Where lineage threads intertwine | ancestry, inheritance, karma, descent |
| mythos | ✧ | gold | Where destiny reveals itself | symbol, destiny, Self, revelation |
| sovereign | ♛ | red | Where agency and authorship return | authority, choice, alignment, throne |
| completion | ∞ | cyan | Where endings and beginnings touch | spiral, elixir, wisdom, legacy |

#### Key Functions
```javascript
mapIndividuationToPilgrimJourney(stageId) → chamber mapping
getFullPilgrimPath() → all 8 stages with chambers
getChamberDetails(chamberName) → chamber definition
getNextChamber(currentChamber) → next chamber info
getPreviousChamber(currentChamber) → previous chamber info
```

---

### 7. Pilgrim Journey Scripts (NEW)
**File:** `pilgrimJourneyScripts.js` (in `/data/`)

Complete mythic narrative scripts for all 8 individuation stages.

#### Script Structure
Each stage has a script with:
- `label`: Stage name
- `subtitle`: Poetic descriptor
- `pilgrimChamber`: Associated chamber
- `sections`: Array of 6 ritual sections

#### The 6-Section Ritual Pattern
| Section | Icon | Purpose |
|---------|------|---------|
| Threshold Invocation | ⟡ | Entry into sacred space |
| Chamber Atmosphere | ☉ | Sensory description of the space |
| Archetypal Encounter | ⚶ | Meeting the central symbol/figure |
| Trial / Task | ⚔ | The challenge to be faced |
| Integration Gesture | ✦ | Physical/symbolic action |
| Closing Benediction | ∞ | Blessing and transition |

#### Example Script (Ego Formation)
```javascript
{
  label: "Ego Formation",
  subtitle: "The First Architecture",
  pilgrimChamber: "birth",
  sections: [
    {
      title: "Threshold Invocation",
      icon: "⟡",
      text: "You step into the Chamber of Birth..."
    },
    // ... 5 more sections
  ]
}
```

---

### 8. Pilgrim Journey Router (NEW)
**File:** `pilgrimJourneyRouter.js`

Automatically loads the correct mythic script based on user's age/profile.

#### Key Functions
```javascript
// Get current stage for user
getPilgrimJourneyStage(profile) → {
  stageId,
  script,
  stage,
  chamber,
  chamberDetails,
  mapping
}

// Get full journey context with navigation
getFullJourneyContext(profile) → {
  current: { stageId, script, stage, ... },
  navigation: { previousStage, nextStage },
  progress: { currentIndex, totalStages, percentage, isComplete },
  allStages: [...]
}

// Manual navigation to specific stage
routeToStage(stageId) → stage payload

// Get metadata for global router integration
getRouterMetadata(stageId) → router metadata
```

---

### 9. Pilgrim Journey Stage Component (NEW)
**File:** `PilgrimJourneyStage.jsx` (in `/components/pilgrim/`)

React component that renders mythic narrative scripts with Cathedral styling.

#### Main Component
```jsx
<PilgrimJourneyStage stageId="egoFormation" compact={false} />
```
- Renders full 6-section ritual narrative
- Element-based color theming
- Hover animations on sections

#### Sub-Components
```jsx
// Mini card for navigation
<PilgrimStageCard stageId="egoFormation" isActive={true} onClick={fn} />

// Progress bar showing journey completion
<PilgrimJourneyProgress currentStageId="shadowEmergence" />
```

#### Section Styling
```javascript
const SECTION_STYLES = {
  "Threshold Invocation": { bg: "purple", border: "purple", iconColor: "purple" },
  "Chamber Atmosphere": { bg: "slate", border: "slate", iconColor: "slate" },
  "Archetypal Encounter": { bg: "amber", border: "amber", iconColor: "amber" },
  "Trial / Task": { bg: "red", border: "red", iconColor: "red" },
  "Integration Gesture": { bg: "green", border: "green", iconColor: "green" },
  "Closing Benediction": { bg: "indigo", border: "indigo", iconColor: "indigo" }
};
```

---

### 10. Saturn Journey Engine (NEW)
**File:** `saturnJourneyEngine.js`

The psychological backbone that maps how fear, authority, responsibility, and limitation evolve into mastery, wisdom, and inner authority.

#### Core Concept
Saturn is not punishment—Saturn is the place where the soul must grow up.

The Saturn Journey answers one question: **"What must I struggle with in order to become myself?"**

#### Key Functions
```javascript
// Generate complete Saturn Journey analysis
generateSaturnJourney(westernData, { birthDate, aspects }) → {
  saturn,          // Sign, house, retrograde status
  wound,           // Origin story
  defenses,        // Adaptive intelligence
  phases,          // 6 developmental checkpoints
  currentPhase,    // Current Saturn weather
  turningPoint,    // Saturn Return transformation
  gift,            // Earned authority
  narrative,       // Complete prose sections
  lunaIntegration  // AI companion guidance
}

// Check Saturn Return status
isSaturnReturnActive(birthDate) → { isActive, which, approaching, age }

// Get position in Saturn cycle
getSaturnCyclePosition(birthDate) → { position, cycleNumber, degreesComplete }
```

---

### 11. Saturn Journey Constants (NEW)
**File:** `saturnJourneyConstants.js`

#### SATURN_PHASES
6 developmental checkpoints:

| Phase | Age | Core Question | Psychological Task |
|-------|-----|---------------|-------------------|
| First Square | ~7 | Can I handle responsibility? | Learn rules without shame |
| Opposition | ~14 | Who has authority over me? | Differentiate from external authority |
| Second Square | ~21 | Am I capable on my own? | Test competence, build skills |
| **Saturn Return** | ~29 | What am I truly responsible for? | Stop proving, start choosing |
| Second Opposition | ~44 | Is this structure still alive? | Prune dead scaffolding |
| **Second Return** | ~59 | What wisdom do I pass on? | Become the elder |

#### SATURN_WOUND_TYPES
- Power Wound (Aries, Leo, Scorpio)
- Father Wound (Leo, Capricorn, Aries)
- Worth Wound (Taurus, Virgo)
- Voice Wound (Gemini)
- Mother Wound (Cancer, Pisces)
- Belonging Wound (Libra, Aquarius)
- Betrayal Wound (Scorpio)
- Meaning Wound (Sagittarius)

---

### 12. Saturn Journey Interpretations (NEW)
**File:** `saturnJourneyInterpretations.js` (in `/data/`)

Complete Liz Greene-style psychological profiles for Saturn in each of the 12 signs.

#### Profile Structure
Each sign profile contains:

```javascript
{
  wound: {
    coreFear,         // What you most fear
    earlyExperience,  // How this manifested early
    authorityImprint, // How authority was experienced
    innerCriticVoice, // What the critic says
    attachmentFlavor, // How you attach in response
    woundType         // Category of wound
  },
  defenses: {
    primary,          // Main defense mechanism
    secondary,        // Backup defense
    protects,         // What the defense guards
    cost,             // Price of the defense
    somaticClue,      // Body signal
    category          // Defense category
  },
  turningPoint: {
    collapse,         // What falls away
    claim,            // What must be claimed
    initiation,       // The threshold crossing
    newRule           // The new life rule
  },
  gift: {
    authorityStyle,   // How authority manifests
    mastery,          // Domain of excellence
    trustedFor,       // What others trust you for
    legacy            // What you leave behind
  },
  lunaGuidance: []    // AI companion support tips
}
```

#### House Modifiers
Adds arena-specific nuance:
- House 1: Self-image wound → Authentic self-authority
- House 4: Home/family wound → Creating true sanctuary
- House 7: Partnership wound → Mature relating
- House 10: Career wound → Success on your own terms

#### Aspect Modifiers
Intensifies specific themes:
- Moon-Saturn: Emotional heaviness
- Sun-Saturn: Father/identity themes
- Mercury-Saturn: Mental pressure
- Venus-Saturn: Self-worth issues

---

### 13. Saturn Journey Narrative Generator
**File:** `saturnJourneyNarrative.js`

Generates Liz Greene-style psychological prose.

#### Tone Guidelines
- Honest but compassionate
- Unsensational
- Non-fatalistic
- Empowering

#### Narrative Sections
```javascript
{
  headline,   // 8-word summary of the journey
  opening,    // Context and meaning of Saturn placement
  wound,      // Full wound narrative
  defenses,   // Defense pattern explanation
  timeline,   // Saturn phases with current position
  return,     // Saturn Return significance
  gift,       // Earned authority narrative
  lunaGuidance: [] // AI support points
}
```

---

## Saturn Journey v2.0 Modules

The following modules were added in v2.0 to complete the Saturn OS with Liz Greene psychological depth.

---

### 14. Saturn House Overlays (v2.0)
**File:** `src/data/saturnHouseOverlays.js`

House = the life arena where Saturn's fear manifests. Each house overlay provides:

#### SATURN_HOUSE_OVERLAYS Structure
```javascript
{
  [house]: {
    wound: "What hurts in this life arena",
    defenses: ["Defense 1", "Defense 2", "Defense 3"],
    gift: "What mastery emerges after integration",
    returnTheme: "The Saturn Return transformation for this house"
  }
}
```

#### All 12 House Overlays

| House | Wound | Gift | Return Theme |
|-------|-------|------|--------------|
| 1 | Fear of being seen as flawed | Authentic self-presentation | Shedding false personas |
| 2 | Fear of material insufficiency | Financial wisdom & resource mastery | Owning your worth |
| 3 | Fear of being misunderstood | Clear communication & mental authority | Speaking your truth |
| 4 | Fear of emotional abandonment | Creating true sanctuary | Building your own foundation |
| 5 | Fear of creative rejection | Disciplined creativity & authentic play | Reclaiming joy |
| 6 | Fear of incompetence | Service mastery & health wisdom | Perfecting your craft |
| 7 | Fear of rejection/abandonment | Mature partnerships | Choosing real relationship |
| 8 | Fear of vulnerability/loss | Transformation mastery | Surrendering to change |
| 9 | Fear of meaninglessness | Philosophical authority | Finding your truth |
| 10 | Fear of public failure | Career authority & legacy building | Claiming your throne |
| 11 | Fear of social rejection | Community leadership | Finding your people |
| 12 | Fear of dissolution | Spiritual authority | Surrendering ego boundaries |

#### Key Functions
```javascript
getSaturnHouseOverlay(house)           // Get overlay for house 1-12
mergeSaturnHouseWithSign(house, sign)  // Combine house + sign profile
```

---

### 15. Saturn Combined Archetypes (v2.0)
**File:** `src/data/saturnCombinedArchetypes.js`

144 unique sign+house combinations, each with a mythic archetype title.

#### SATURN_COMBINED_ARCHETYPES
```javascript
{
  Aries: {
    1: "The Reluctant Warrior",
    2: "The Cautious Pioneer",
    // ... all 12 houses
  },
  // ... all 12 signs
}
```

#### SATURN_MYTHIC_SKIN
Cathedral chamber titles for mythic UX:
```javascript
{
  Aries: {
    1: "Chamber of the Sheathed Sword",
    2: "Chamber of the First Harvest",
    // ...
  }
}
```

#### Sample Archetypes

| Sign | House | Archetype | Mythic Chamber |
|------|-------|-----------|----------------|
| Aries | 1 | The Reluctant Warrior | Chamber of the Sheathed Sword |
| Taurus | 7 | The Careful Partner | Chamber of the Measured Vow |
| Cancer | 4 | The Wounded Caretaker | Chamber of the Empty Hearth |
| Scorpio | 8 | The Transformation Guardian | Chamber of the Phoenix Keeper |
| Capricorn | 10 | The Late-Blooming Authority | Chamber of the Earned Crown |

#### Key Functions
```javascript
getSaturnArchetype(sign, house)    // Get archetype title
getSaturnMythicTitle(sign, house)  // Get chamber name
```

---

### 16. Saturn Aspect Complexes (v2.0)
**File:** `src/data/saturnAspectComplexes.js`

Deep psychological patterns from Saturn aspects. Aspects = why the pattern intensifies.

#### SATURN_ASPECT_COMPLEXES
9 planetary complexes with full psychological profiles:

| Complex | Wound | Defense | Gift |
|---------|-------|---------|------|
| **Moon-Saturn** | Emotional nurturing felt conditional | Emotional suppression, self-reliance | Emotional resilience, mature nurturing |
| **Sun-Saturn** | Identity/recognition blocked by authority | Overachievement, identity hiding | Authentic authority, earned recognition |
| **Venus-Saturn** | Love felt conditional, beauty doubted | Emotional withdrawal, perfectionism | Lasting love, mature aesthetics |
| **Mars-Saturn** | Anger/assertion felt dangerous | Suppressed anger, passive aggression | Strategic action, disciplined will |
| **Mercury-Saturn** | Communication felt inadequate | Mental rigidity, over-preparation | Clear authority, precise communication |
| **Jupiter-Saturn** | Expansion felt dangerous/sinful | Limiting beliefs, fear of success | Grounded optimism, sustainable growth |
| **Uranus-Saturn** | Uniqueness felt threatening | Conformity vs. rebellion swings | Revolutionary structure, innovative tradition |
| **Neptune-Saturn** | Dreams felt unrealistic/shameful | Spiritual denial, cynicism | Practical mysticism, grounded vision |
| **Pluto-Saturn** | Power felt dangerous/corrupting | Control, power avoidance | Transformative authority, regenerative leadership |

#### Aspect Complex Structure
```javascript
{
  "Moon-Saturn": {
    wound: "Early emotional nurturing felt conditional or unavailable",
    defense: "Emotional self-sufficiency, suppression of needs",
    gift: "Emotional resilience, capacity for mature nurturing",
    triggers: ["Emotional vulnerability", "Needing others", "Dependency"],
    integrationPath: "Learning that needing others is not weakness"
  }
}
```

#### ASPECT_QUALITY_MODIFIERS
```javascript
{
  conjunction: { intensity: 1.0, flavor: "Fused" },
  opposition: { intensity: 0.9, flavor: "Polarized" },
  square: { intensity: 0.85, flavor: "Friction" },
  trine: { intensity: 0.5, flavor: "Flowing" },
  sextile: { intensity: 0.4, flavor: "Opportunity" },
  quincunx: { intensity: 0.7, flavor: "Adjustment" }
}
```

#### Key Functions
```javascript
getSaturnAspectComplex(key)           // Get complex by key
getAspectQualityModifier(aspectType)  // Get intensity modifier
buildSaturnAspectAnalysis(aspects)    // Full analysis from natal aspects
getAspectComplexesFromNatal(aspects)  // Extract complexes from aspect array
```

---

### 17. Saturn Luna Integration (v2.0)
**File:** `src/data/saturnLunaIntegration.js`

Luna AI companion support for Saturn work.

#### SATURN_LUNA_TRIGGERS
5 triggers per house that Luna should recognize:

```javascript
{
  1: [
    "I feel like I'm not good enough",
    "People don't see the real me",
    "I'm afraid to show who I really am",
    "I feel invisible",
    "I don't know who I am anymore"
  ],
  // ... all 12 houses
}
```

#### SATURN_INNER_CRITIC_SCRIPTS
The Saturn voice and counter-scripts:

```javascript
{
  1: {
    script: "You're not ready. You'll embarrass yourself.",
    counter: "Readiness is a feeling, not a fact. I can start imperfect."
  },
  2: {
    script: "You'll never have enough. You're not worth investing in.",
    counter: "My worth isn't determined by what I own."
  },
  // ... all 12 houses
}
```

#### SATURN_JOURNALING_PROMPTS
5 therapeutic prompts per house:

```javascript
{
  1: [
    "What mask do I wear that I wish I could take off?",
    "When did I first learn to hide parts of myself?",
    "What would I do if I knew I couldn't fail?",
    "Who am I when no one is watching?",
    "What part of me is asking to be seen?"
  ],
  // ... all 12 houses
}
```

#### Key Functions
```javascript
getLunaTriggers(house)              // Get trigger phrases
getJournalingPrompts(house)         // Get journaling prompts
getRandomInnerCriticScript(house)   // Get random script/counter pair
getInnerCriticScriptsForHouse(house) // Get all scripts for house
```

---

### 18. Saturn Cathedral Path (v2.0)
**File:** `src/data/saturnCathedralPath.js`

12 initiation chambers—one for each house—with full ritual structure.

#### SATURN_MYTHIC_TITLES
```javascript
{
  1: "Chamber of the Unveiled Self",
  2: "Chamber of Earthly Treasures",
  3: "Chamber of the Sacred Voice",
  4: "Chamber of the Ancient Hearth",
  5: "Chamber of the Divine Child",
  6: "Chamber of Sacred Service",
  7: "Chamber of the Other",
  8: "Chamber of Death and Rebirth",
  9: "Chamber of the Seeker",
  10: "Chamber of the Mountain Peak",
  11: "Chamber of the Tribe",
  12: "Chamber of the Cosmic Ocean"
}
```

#### SATURN_CATHEDRAL_PATH Structure
```javascript
{
  house: 1,
  key: "identity",
  title: "Chamber of the Unveiled Self",
  theme: "Authentic self-presentation",
  thresholdQuestion: "Who am I when I stop performing?",
  riteOfPassage: "Standing before the mirror without flinching",
  guardianTest: "Showing your true face to someone who matters",
  shadowMaterial: "The false self, the personas, the masks",
  initiationGift: "The authority to define yourself"
}
```

#### All 12 Chambers

| House | Key | Chamber | Threshold Question |
|-------|-----|---------|-------------------|
| 1 | identity | Unveiled Self | Who am I when I stop performing? |
| 2 | resources | Earthly Treasures | What is truly mine? |
| 3 | voice | Sacred Voice | What do I need to say? |
| 4 | roots | Ancient Hearth | Where is my true home? |
| 5 | creation | Divine Child | What wants to be born through me? |
| 6 | service | Sacred Service | How do I serve without losing myself? |
| 7 | partnership | The Other | Who can I truly meet? |
| 8 | transformation | Death and Rebirth | What must die for me to live? |
| 9 | meaning | The Seeker | What do I truly believe? |
| 10 | authority | Mountain Peak | What is my true calling? |
| 11 | community | The Tribe | Where do I truly belong? |
| 12 | transcendence | Cosmic Ocean | What lies beyond the self? |

#### Key Functions
```javascript
getSaturnChamber(house)          // Get chamber by house number
getSaturnChamberByKey(key)       // Get chamber by key (e.g., "identity")
getAllSaturnChambers()           // Get all 12 chambers
getSaturnMythicTitle(house)      // Get just the chamber title
```

---

### 19. Saturn Shadow Integration Engine (v2.0)
**File:** `src/utils/saturnShadowIntegration.js`

Builds complete shadow profiles with practical integration moves.

#### BASE_HOUSE_WOUNDS
Core wounds by house:
```javascript
{
  1: "Fear of being truly seen",
  2: "Fear of not having enough",
  3: "Fear of being misunderstood",
  // ... all 12 houses
}
```

#### BASE_HOUSE_DEFENSES
Defense patterns by house:
```javascript
{
  1: "Over-controlling self-presentation",
  2: "Hoarding, excessive saving, material anxiety",
  3: "Over-explaining, verbal perfectionism",
  // ... all 12 houses
}
```

#### BASE_INTEGRATION_MOVES
Practical actions for integration:
```javascript
{
  1: [
    "Practice showing up without rehearsing",
    "Let someone see you struggle",
    "Wear something that feels 'too much'"
  ],
  // ... all 12 houses with 3-5 moves each
}
```

#### Key Functions
```javascript
buildSaturnShadowProfile(house, aspectKeys) → {
  houseWound,
  houseDefense,
  aspectWounds,      // From aspect complexes
  aspectDefenses,
  integrationMoves,
  currentIntegrationFocus
}

getRandomIntegrationMove(house)  // Get single random move
getHouseWound(house)             // Get wound text
getHouseDefense(house)           // Get defense text
```

---

### 20. Saturn Return Report Generator (v2.0)
**File:** `src/utils/saturnReturnReport.js`

Generates comprehensive Saturn Return reports with exact date calculations.

#### Saturn Return Windows
- **First Return**: Age 28.5–30.5 (exact ~29.5)
- **Second Return**: Age 58.5–60.5 (exact ~59)
- **Third Return**: Age 87.5–89.5 (rare but possible)

#### RETURN_TITLES
```javascript
{
  1: "The Initiation of Authentic Self",
  2: "The Initiation of True Value",
  3: "The Initiation of Clear Voice",
  // ... all 12 houses
}
```

#### HOUSE_THEMES
```javascript
{
  1: {
    collapse: "False personas and people-pleasing",
    mustClaim: "Your authentic face and presence",
    initiation: "Being seen as you truly are",
    newRule: "I am enough as I am"
  },
  // ... all 12 houses
}
```

#### Generated Report Structure
```javascript
{
  title: "The Initiation of Authentic Self",
  summary: "Your Saturn Return in the 1st house...",
  returnNumber: 1,
  windows: {
    first: { start: "2012-03-15", exact: "2012-09-20", end: "2013-01-10" },
    second: { start: "2041-08-12", exact: "2042-02-18", end: "2042-06-22" }
  },
  themes: {
    collapse: "...",
    mustClaim: "...",
    initiation: "...",
    newRule: "..."
  },
  lunaSupport: ["Support strategy 1", "Support strategy 2"]
}
```

#### Key Functions
```javascript
calculateSaturnReturnWindows(birthDateISO) → windows array
generateSaturnReturnReport(house, sign, birthDateISO, targetReturn) → report
checkSaturnReturnStatus(birthDateISO) → {
  inReturn: boolean,
  approaching: boolean,
  returnNumber: 1|2|3,
  daysUntil: number
}
```

---

### 21. Saturn Luna Dialogue Engine (v2.0)
**File:** `src/utils/saturnLunaDialogue.js`

Context-aware therapeutic responses for Luna AI companion.

#### Response Templates

**Recognition Templates:**
```javascript
[
  "I hear that {wound} is present right now.",
  "It sounds like {wound} is asking for attention.",
  "This feels like {wound} speaking—a familiar voice for you."
]
```

**Normalization Templates:**
```javascript
[
  "This is a natural response given your Saturn journey.",
  "Many people with Saturn in house {house} feel this way.",
  "Your {defense} is trying to protect you—that makes sense."
]
```

**Reframe Templates:**
```javascript
[
  "What if this moment is Saturn inviting you toward {gift}?",
  "Your struggle here is actually building toward {gift}.",
  "This challenge is the curriculum for developing {gift}."
]
```

#### Key Functions
```javascript
buildLunaSaturnResponses(saturnContext) → {
  recognition: [...],
  normalization: [...],
  reframe: [...],
  integrationPrompt: "...",
  closingAffirmation: "..."
}

detectSaturnTrigger(message, house) → trigger | null
generateSaturnResponse(detectedTrigger, saturnContext) → response
generateSaturnOpening(house) → opening line
generateSaturnValidation(house) → validation response
generateSaturnClosing(context) → closing affirmation
```

---

### 22. Saturn Relationship Dynamics Engine (v2.0)
**File:** `src/data/saturnRelationshipDynamicsData.js` + `src/utils/saturnRelationshipEngine.js`

Based on Liz Greene's "Relating" — the psychological approach to projection, shadow, fear, and the karmic contract of intimacy.

#### Core Data Structures

**SATURN_PROJECTION_MAP** (by House)
What you unconsciously expect partners to carry:
```javascript
{
  1: "You expect partners to be more stable, mature, or emotionally contained than you allow yourself to be.",
  7: "You expect partners to carry the weight of commitment, stability, and emotional maturity.",
  8: "You expect partners to handle intensity, vulnerability, and emotional truth for both of you.",
  // ... all 12 houses
}
```

**SATURN_COMPATIBILITY_WOUND** (by Sign)
The core fear that surfaces in intimate relationships:
```javascript
{
  Aries: "Fear of losing autonomy or being controlled.",
  Cancer: "Fear of emotional abandonment or rejection.",
  Scorpio: "Fear of betrayal, exposure, or losing control.",
  Capricorn: "Fear of failure, inadequacy, or disappointing the partner.",
  // ... all 12 signs
}
```

**SATURN_PARTNERSHIP_CONTRACT** (by House)
The soul lesson this placement brings:
```javascript
{
  1: "To learn authenticity and vulnerability in presence.",
  7: "To learn equality, boundaries, and mutual commitment.",
  8: "To learn trust, surrender, and shared power.",
  // ... all 12 houses
}
```

**SATURN_BREAK_PATTERNS** (by House)
How Saturn sabotages intimacy:
```javascript
{
  1: "Withdrawing into self-sufficiency and shutting out the partner.",
  7: "People-pleasing until resentment explodes.",
  8: "Control, testing, or emotional withholding.",
  // ... all 12 houses
}
```

**SATURN_HEALING_PATTERNS** (by House)
The path to repair:
```javascript
{
  1: "Showing vulnerability in small, consistent ways.",
  7: "Practicing clean conflict and honest boundaries.",
  8: "Sharing fears instead of testing loyalty.",
  // ... all 12 houses
}
```

**SATURN_ASPECT_RELATIONAL_MODIFIERS**
How aspects intensify relational patterns:
```javascript
{
  "Moon-Saturn": {
    relationalWound: "Emotional deprivation; fear of needing too much",
    relationalDefense: "Emotional self-sufficiency; denying needs",
    relationalGift: "Deep empathy; capacity to hold others through difficulty",
    partnerProjection: "You may attract partners who seem emotionally unavailable"
  },
  "Venus-Saturn": {
    relationalWound: "Love felt conditional; fear of not being lovable",
    relationalDefense: "Withholding affection or over-giving to earn love",
    relationalGift: "Enduring love; loyalty; realistic expectations",
    partnerProjection: "You may attract partners who confirm your unworthiness"
  },
  // ... all 9 planetary aspects
}
```

#### Main Function
```javascript
buildSaturnRelationshipDynamics(saturnSign, saturnHouse, aspectComplexes) → {
  projection,           // What you expect partners to carry
  compatibilityWound,   // Sign-based relational fear
  partnershipContract,  // The soul lesson
  breakPattern,         // How Saturn sabotages intimacy
  healingPattern,       // The path to repair
  relationalTriggers,   // What activates the wound
  aspectInfluences,     // Aspect-based patterns with insights
  partnerProjections,   // Who you attract based on aspects
  relationalGifts,      // Gifts developed through relationship work
  lunaRelationshipGuidance, // AI companion support
  metadata
}
```

#### Example Output
```json
{
  "projection": "You expect partners to carry the weight of commitment, stability, and emotional maturity.",
  "compatibilityWound": "Fear of failure, inadequacy, or disappointing the partner.",
  "partnershipContract": "To learn equality, boundaries, and mutual commitment.",
  "breakPattern": "People-pleasing until resentment explodes.",
  "healingPattern": "Practicing clean conflict and honest boundaries.",
  "aspectInfluences": [
    {
      "aspect": "Moon-Saturn",
      "influence": "Because of emotional deprivation; fear of needing too much, you may unconsciously expect partners to compensate for this — but the gift is deep empathy; capacity to hold others through difficulty."
    }
  ]
}
```

#### Key Functions
```javascript
buildSaturnRelationshipDynamics(sign, house, aspects) // Full profile
getRelationshipQuickSummary(sign, house)              // Quick summary
detectRelationalTrigger(message, house)               // Trigger detection
getAspectRelationshipInsight(aspectKey)               // Single aspect insight
```

---

### 23. Saturn Journey Profile Orchestrator (v2.0)
**File:** `src/utils/buildSaturnJourneyProfile.js`

⭐ **The single, clean entry point for the Saturn OS.**

#### Main Function
```javascript
import { buildSaturnJourneyProfile } from './utils/buildSaturnJourneyProfile';

const profile = buildSaturnJourneyProfile({
  birthDateISO: "1983-07-06",
  planets: [
    { name: 'Saturn', sign: 'Scorpio', house: 10 },
    { name: 'Moon', sign: 'Cancer', house: 7 },
    // ...
  ],
  aspects: [
    { p1: 'Moon', p2: 'Saturn', type: 'square' },
    { p1: 'Sun', p2: 'Saturn', type: 'opposition' }
  ]
});
```

#### Return Structure
```javascript
{
  // Core Saturn data
  saturnSign: "Scorpio",
  saturnHouse: 10,
  saturnDegree: 15.5,
  isRetrograde: false,

  // Sign profile (from saturnJourneyInterpretations)
  signProfile: { wound, defenses, turningPoint, gift, lunaGuidance },

  // House overlay (from saturnHouseOverlays)
  houseOverlay: { wound, defenses, gift, returnTheme },

  // Combined archetype (from saturnCombinedArchetypes)
  combinedArchetype: "The Depth Authority",
  mythicTitle: "Chamber of the Phoenix Throne",

  // Merged profile (sign + house combined)
  mergedProfile: { ... },

  // Aspect data (from saturnAspectComplexes)
  aspectKeys: ["Moon-Saturn", "Sun-Saturn"],
  aspectComplexes: [{ wound, defense, gift, triggers, integrationPath }, ...],

  // Generated content
  narrative: { headline, opening, wound, defenses, timeline, return, gift },
  shadowProfile: { houseWound, houseDefense, aspectWounds, integrationMoves },
  returnReport: { title, summary, windows, themes },
  returnStatus: { inReturn, approaching, returnNumber, daysUntil },
  returnWindows: [...],
  cathedralChamber: { house, key, title, theme, thresholdQuestion, ... },
  phaseMarkers: [{ key, label, exactDate, isCurrent, yearsUntil }, ...],

  // Luna integration
  lunaResponses: { recognition, normalization, reframe, closingAffirmation },
  triggers: ["I feel like...", "I'm afraid...", ...],
  journalingPrompts: ["What mask do I wear...", ...],
  innerCriticScripts: [{ script, counter }, ...],

  // Relationship dynamics (Liz Greene's "Relating")
  relationshipDynamics: {
    projection,
    compatibilityWound,
    partnershipContract,
    breakPattern,
    healingPattern,
    relationalTriggers,
    aspectInfluences,
    partnerProjections,
    relationalGifts,
    lunaRelationshipGuidance
  },

  // Astrology of Fate (Liz Greene's "The Astrology of Fate")
  fateThreads: {
    sunThread,
    moonThread,
    saturnThread,
    plutoThread,
    destinyThread: { northNode, southNode, axis },
    threads: [...],
    integratedNarrative,
    summary,
    metadata
  },
  fateArchetype: {
    title: "The Dark Initiator Who Transforms Phoenix",
    narrative,
    saturnTeacher,
    plutoShadow,
    elementalTheme,
    summary,
    metadata
  },
  crossroads: {
    currentAge,
    active: [...],
    approaching: [...],
    completed: [...],
    convergence,
    summary,
    lunaGuidance
  },
  fateChoiceIndex: {
    fateScore,
    choiceScore,
    category,
    factors: [...],
    interpretation,
    summary,
    metadata
  },

  // Age and cycle
  age: 41.5,
  cyclePosition: { position: 0.42, cycleNumber: 2, degreesComplete: 151.2 },

  // Metadata
  metadata: {
    saturnOrbitYears: 29.5,
    hasSignProfile: true,
    hasHouseOverlay: true,
    hasCathedralChamber: true,
    aspectComplexCount: 2,
    hasShadowProfile: true,
    hasReturnReport: true,
    hasRelationshipDynamics: true,
    hasFateThreads: true,
    hasFateArchetype: true,
    hasCrossroads: true,
    hasFateChoiceIndex: true,
    isInReturn: false,
    isApproachingReturn: false,
    isInCrossroads: true,
    fateScore: 65
  }
}
```

#### Convenience Functions
```javascript
// Quick build from minimal data
buildSaturnJourneyQuick(sign, house, birthDateISO?, aspects?)

// Build from western astrology result
buildSaturnJourneyFromWestern(westernResult, birthDateISO)
```

---

---

## Astrology of Fate Modules

Based on Liz Greene's "The Astrology of Fate" — extracting mythic storylines and fate/choice dynamics from the chart.

---

### 24. Mythic Fate Threads Engine
**File:** `src/utils/fateThreads.js`

Extracts mythic storylines from five key chart points:
- **Sun**: Identity Fate (who you must become)
- **Moon**: Emotional Fate (what you must feel/nurture)
- **Saturn**: Karmic Fate (what you must master)
- **Pluto**: Shadow Fate (what you must transform)
- **Nodes**: Destiny Axis (where you're coming from / going to)

#### Fate Thread Structure
```javascript
{
  planet: 'Saturn',
  sign: 'Scorpio',
  house: 10,
  threadType: 'Karmic Fate',
  myth: "The Tested Transformer",
  fateThread: "Your karmic fate is to master power through surrender.",
  karmicLesson: "Control through letting go",
  fear: "Betrayal, exposure, powerlessness",
  mastery: "Regenerative strength through vulnerability"
}
```

#### All Fate Thread Types

| Planet | Thread Type | Example Myth (Scorpio) |
|--------|-------------|------------------------|
| Sun | Identity Fate | The Phoenix |
| Moon | Emotional Fate | The Emotional Alchemist |
| Saturn | Karmic Fate | The Tested Transformer |
| Pluto | Shadow Fate | The Shadow Phoenix |
| North Node | Destiny Direction | The Emerging Transformer |

#### Key Functions
```javascript
buildFateThreads(chart) → {
  sunThread,
  moonThread,
  saturnThread,
  plutoThread,
  destinyThread: { northNode, southNode, axis },
  threads: [...],
  integratedNarrative,
  summary,
  metadata
}

getFateThread(planet, sign) → single thread
getAllFateThreadData() → all thread data
```

---

### 25. Fate Archetype Engine
**File:** `src/utils/fateArchetypes.js`

Assigns mythic archetypes based on Saturn (karmic teacher) and Pluto (collective shadow) combination.

#### Archetype Structure

**Saturn Teacher Archetypes:**
```javascript
{
  Scorpio: {
    archetype: "The Dark Initiator",
    teachingStyle: "Through power struggles and transformative crises",
    lessonDelivery: "Betrayal, intensity, lessons in surrender and trust",
    mythicFigure: "Hades as the underworld teacher of death and rebirth"
  }
}
```

**Pluto Shadow Archetypes:**
```javascript
{
  Scorpio: {
    archetype: "The Shadow Phoenix",
    shadowWork: "Transforming obsession into regenerative power",
    collectiveWound: "Power abuse, sexual shadow, death denial",
    transformationPath: "From control to surrender"
  }
}
```

**Elemental Fate Themes:**
```javascript
{
  'Water-Water': {
    theme: "The Deep Ocean",
    journey: "Learning boundaries within merger",
    gift: "Profound empathy and spiritual depth"
  }
}
```

#### Key Functions
```javascript
assignArchetype(saturnSign, plutoSign) → {
  title: "The Dark Initiator Who Transforms Phoenix",
  narrative,
  saturnTeacher,
  plutoShadow,
  elementalTheme,
  summary,
  metadata
}

getArchetypeTitle(saturnSign, plutoSign) → string
getSaturnTeacher(sign) → teacher archetype
getPlutoShadow(sign) → shadow archetype
getElementalFateTheme(saturnSign, plutoSign) → elemental theme
```

---

### 26. Life Crossroads Detection Engine
**File:** `src/utils/fateCrossroads.js`

Detects life turning points where fate and choice intersect.

#### Major Crossroads Events

| Event | Exact Age | Archetype | Life Question |
|-------|-----------|-----------|---------------|
| First Saturn Return | 29.5 | The Threshold Guardian | Are you living your authentic path? |
| Pluto Square Pluto | ~37.5 | The Underworld Gate | What must die for your authentic self to live? |
| Uranus Opposition | 42 | The Awakener's Call | What part of you has been sleeping? |
| Neptune Square Neptune | 41 | The Mystic's Fog | What dreams were never really yours? |
| Chiron Return | 50.7 | The Wounded Healer's Return | How has your wound become your wisdom? |
| Second Saturn Return | 58.9 | The Elder Threshold | What wisdom will you pass on? |
| First Nodal Return | 18.6 | The First Destiny Gate | What is your soul calling you toward? |
| Second Nodal Return | 37.2 | The Destiny Checkpoint | Are you on purpose? |

#### Crossroads Structure
```javascript
{
  key: 'saturn-return-1',
  name: 'First Saturn Return',
  exactAge: 29.5,
  ageRange: [28, 31],
  planet: 'Saturn',
  aspectType: 'conjunction',
  archetype: 'The Threshold Guardian',
  mythicMeaning: 'The first major test of adult maturity',
  lifeQuestion: 'Are you living your authentic path?',
  themes: ['Career direction crystallizes', ...],
  challenge: 'Accepting responsibility without losing joy',
  gift: 'Earned authority and clear direction',
  lunaGuidance: 'This is a time of profound choosing...'
}
```

#### Key Functions
```javascript
detectCrossroads(birthDateISO) → {
  currentAge,
  active: [...],        // Currently in crossroads
  approaching: [...],   // Coming within 5 years
  completed: [...],     // Past crossroads
  all: [...],           // All with status
  convergence,          // Multiple active crossroads
  summary,
  lunaGuidance
}

getCrossroadsData(key) → single crossroads
getCrossroadsWindow(birthDateISO, key) → window dates
isInCrossroads(age, key) → boolean
```

---

### 27. Fate vs Choice Index Engine
**File:** `src/utils/fateChoiceIndex.js`

Computes a 0-100 score indicating the balance between fated/karmic elements and free will/choice elements.

#### Score Interpretation

| Range | Category | Meaning |
|-------|----------|---------|
| 0-30 | Strong Fate | Significant karmic weight |
| 31-50 | Fate-Leaning | Karmic lessons prominent |
| 51-70 | Choice-Leaning | Free will dominant |
| 71-100 | Strong Choice | Maximum free will potential |

#### Scoring Factors

**Increases FATE:**
- Angular Saturn, Pluto, or Nodes
- Tight Saturn/Pluto/Node aspects to personal planets
- Fixed signs emphasis
- 8th and 12th house emphasis

**Increases CHOICE:**
- Mutable signs emphasis
- Strong Jupiter/Uranus
- 1st and 9th house emphasis
- Loose aspects to fate planets

#### Key Functions
```javascript
computeFateChoiceIndex(chart) → {
  fateScore,     // 0-100
  choiceScore,   // 100 - fateScore
  category,
  factors: [...],  // All contributing factors
  breakdown,
  interpretation,
  summary,
  metadata
}

getFateScore(chart) → number
getChoiceScore(chart) → number
getFateCategory(chart) → string
isFateDominant(chart) → boolean
```

---

### 28. Synastry Fate Engine
**File:** `src/utils/synastryFateEngine.js`

Comprehensive fate analysis for relationship synastry.

#### Components

**1. Fated Axis Interlocks**
Nodal connections between charts:
```javascript
{
  'NorthNode-Venus': {
    type: 'destiny_activation',
    intensity: 'very_high',
    meaning: "A feels fated love connection with B",
    karmicLesson: "Learning to love in alignment with destiny",
    gift: "Love that supports soul growth"
  },
  'SouthNode-Saturn': {
    type: 'karmic_debt',
    intensity: 'very_high',
    meaning: "Serious karmic debt or unfinished business",
    karmicLesson: "Resolving what was left incomplete",
    warning: "May feel obligated or unable to leave"
  }
}
```

**2. Projection Loops**
Saturn projections between charts:
```javascript
{
  'Saturn-Venus': {
    projection: "One partner projects love conditions onto the other",
    dynamic: "Love must be earned or deserved",
    challenge: "Feeling unlovable or that love is conditional",
    gift: "Learning lasting, committed love",
    healingPath: "Expressing love without conditions"
  }
}
```

**3. Karmic Contracts**
Soul lessons for the relationship:
```javascript
{
  heavy_saturn: {
    name: 'The Commitment Contract',
    lesson: 'Learning lasting commitment through challenge',
    archetype: 'The Testing Ground',
    duration: 'Long-term by nature',
    warning: 'Can feel restrictive if not conscious'
  }
}
```

**4. Relationship Archetypes**
```javascript
{
  karmic_teachers: {
    name: 'The Karmic Teachers',
    description: 'Primarily about learning difficult lessons together',
    strengths: ['Deep growth potential', 'Lasting impact'],
    challenges: ['Heavy energy', 'Obligation feelings']
  },
  soul_mates: { ... },
  twin_flames: { ... },
  growth_partners: { ... },
  alchemical_union: { ... }
}
```

#### Main Function
```javascript
buildSynastryFateProfile(chartA, chartB, synastryAspects) → {
  personA: { fateThreads },
  personB: { fateThreads },
  axisInterlocks: [...],
  projectionLoops: [...],
  karmicContracts: {
    contracts: [...],
    primaryContract,
    secondaryContract
  },
  crossroads: {
    personA: { age, active, approaching },
    personB: { age, active, approaching },
    sharedActiveCrossroads: [...],
    complementaryCrossroads: [...],
    relationshipPhase
  },
  fateChoiceIndex: {
    fateScore,
    choiceScore,
    category
  },
  relationshipArchetype: {
    primary,
    secondary,
    scores
  },
  lunaGuidance,
  summary,
  metadata
}
```

#### Key Functions
```javascript
buildSynastryFateThreads(aspects) → axis interlocks
buildProjectionLoops(chartA, chartB, aspects) → projection loops
buildSynastryContracts(aspects) → karmic contracts
buildSynastryCrossroads(birthDateA, birthDateB) → crossroads
computeSynastryFateChoiceIndex(aspects) → fate/choice index
assignSynastryArchetype(aspects, contracts, fateIndex) → archetype
```

---

---

## Composite Psychological Engine

Based on Liz Greene's concept of the composite chart as "the third psyche" — the living organism that emerges when two people create relationship. Not just midpoints, but a complete psychological portrait of the relationship itself.

---

### 29. Composite Generator Engine
**File:** `src/utils/compositeGenerator.js`

Calculates midpoint charts from two natal charts.

#### Core Functions
```javascript
buildCompositeChart(chartA, chartB) → {
  planets: { Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, ... },
  aspects: [...],
  houses: {...},
  statistics: { elementBalance, modalityBalance, dominantElement, ... }
}

calculateMidpoint(degA, degB) → degree
getSignFromDegree(degree) → sign
```

#### Midpoint Calculation
Uses the "near" midpoint (shorter arc) as standard in composite charts.

---

### 30. Composite Psychology Engine
**File:** `src/utils/compositePsychology.js`

Builds the core psychological profile of the relationship.

#### COMPOSITE_SUN - Relationship Identity
12 sign interpretations with:
- `identity`: Name of the partnership type
- `coreNeed`: What the relationship exists to do
- `lifeForce`: The vital energy of the bond
- `expression`: How the relationship shows itself
- `challenge`: Primary growth challenge
- `gift`: What the relationship offers

Example (Scorpio):
```javascript
{
  identity: 'The Transformative Partnership',
  coreNeed: 'To merge, to transform, to know absolute truth together',
  lifeForce: 'This relationship exists to go deep...',
  challenge: 'Releasing control. Allowing space without assuming betrayal.',
  gift: 'A bond that transforms both people through genuine intimacy.'
}
```

#### COMPOSITE_MOON - Emotional Nature
12 sign interpretations with:
- `emotionalNature`
- `unconsciousPattern`
- `nurturing`
- `vulnerability`
- `healing`

#### COMPOSITE_MERCURY - Communication Style
12 sign interpretations with communication, thinking patterns, challenges.

#### COMPOSITE_VENUS - Love Style
12 sign interpretations with love style, values, affection, harmony.

#### COMPOSITE_MARS - Action & Conflict
12 sign interpretations with action style, conflict style, desire, danger.

#### Key Functions
```javascript
buildCompositePsychology(compositeChart) → {
  identity,
  emotions,
  communication,
  love,
  action,
  coreIntegration,
  summary
}

getRelationshipIdentity(compositeChart) → sun interpretation
getEmotionalPattern(compositeChart) → moon interpretation
getLoveStyle(compositeChart) → venus interpretation
getConflictPattern(compositeChart) → mars interpretation
```

---

### 31. Composite Shadow Engine
**File:** `src/utils/compositeShadow.js`

Maps the relationship's shadow, defenses, and transformation path.

#### COMPOSITE_SATURN - Fear & Restriction
12 sign interpretations with:
- `shadow`: Name of the shadow
- `fear`: What the relationship fears
- `restriction`: What is blocked
- `defense`: How the relationship protects itself
- `mastery`: The growth path
- `integration`: The gift when integrated

Example (Scorpio):
```javascript
{
  shadow: 'Fear of Powerlessness',
  fear: 'The relationship fears betrayal, loss of control...',
  defense: 'Control patterns. Withholding to maintain power.',
  mastery: 'Learning that surrender is not defeat.',
  integration: 'Saturn in Scorpio gives mature intensity...'
}
```

#### COMPOSITE_PLUTO - Obsession & Transformation
12 sign interpretations with:
- `shadow`
- `obsession`
- `transformation`
- `compulsion`
- `release`
- `depth`

#### EIGHTH_HOUSE_SIGN
12 sign interpretations for shared shadow, sexuality, and transformation.

#### DEFENSE_PATTERNS
6 relationship defense mechanisms:
- The Controller
- The Avoider
- The Projector
- The Merger
- The Dissociator
- The Intellectualizer

Each with pattern, trigger, manifestation, healing.

#### Key Functions
```javascript
buildCompositeShadow(compositeChart) → {
  saturnShadow,
  plutoShadow,
  eighthHouse,
  primaryDefense,
  integrationPath,
  summary
}

getSaturnShadow(compositeChart) → saturn shadow
getPlutoShadow(compositeChart) → pluto shadow
getDefensePatterns() → all defense mechanisms
```

---

### 32. Composite Archetype Engine
**File:** `src/utils/compositeArchetype.js`

Assigns mythic archetypes based on Sun-Moon element combinations.

#### ELEMENT_ARCHETYPES
10 element combinations with full mythic profiles:

| Combination | Archetype | Myth | Gift |
|-------------|-----------|------|------|
| Fire-Fire | The Heroes' Quest | Warrior Companions | Courage to live boldly |
| Fire-Earth | The Alchemist's Marriage | Spirit Meeting Matter | Building visions |
| Fire-Air | The Divine Spark | Prometheus and Wind | Infectious enthusiasm |
| Fire-Water | The Steam Engine | Volcano Meeting Ocean | Transformative power |
| Earth-Earth | The Mountain Marriage | Two Oaks Intertwining | Creating what lasts |
| Earth-Air | The Architect's Dream | Blueprint Meeting Foundation | Manifest visions |
| Earth-Water | The Garden of Devotion | River Meeting Valley | Emotional safety |
| Air-Air | The Meeting of Minds | Two Winds Dancing | Brilliant partnership |
| Air-Water | The Poet's Union | Cloud Meeting Sea | Expression of formless |
| Water-Water | The Deep | Ocean Meeting Ocean | Profound understanding |

#### MODALITY_ARCHETYPES
6 modality dynamics:
- Cardinal-Cardinal: The Leadership Struggle
- Cardinal-Fixed: The Initiator and Sustainer
- Cardinal-Mutable: The Creator and Adapter
- Fixed-Fixed: The Immovable Force
- Fixed-Mutable: The Anchor and Wave
- Mutable-Mutable: The Shape-Shifters

#### Key Functions
```javascript
buildCompositeArchetype(compositeChart) → {
  primaryArchetype,
  modalityDynamic,
  specificCombination,
  elementBalance,
  publicFace,
  worldPurpose,
  coreMythSummary
}

getArchetypeName(compositeChart) → archetype name
getMythicStory(compositeChart) → mythic narrative
getRelationshipGift(compositeChart) → primary gift
```

---

### 33. Composite Fate Threads Engine
**File:** `src/utils/compositeFateThreads.js`

Maps the fate and karmic journey of the relationship.

#### COMPOSITE_NORTH_NODE - Destiny Direction
12 sign interpretations with:
- `destiny`: The destination
- `calling`: What the relationship is called to
- `growth`: The growth direction
- `lesson`: The lesson to learn
- `fulfillment`: When the relationship fulfills its purpose
- `warning`: What blocks evolution

#### COMPOSITE_SOUTH_NODE - Past Karma
12 sign interpretations with:
- `pastPattern`: Name of the pattern
- `comfort`: Where the relationship finds comfort
- `karmaFrom`: Past patterns to integrate
- `giftToRelease`: The gift within the pattern
- `trap`: How to get stuck
- `integration`: Path forward

#### COMPOSITE_SATURN_FATE
12 sign interpretations of karmic work required.

#### COMPOSITE_PLUTO_FATE
12 sign interpretations of transformation required.

#### Key Functions
```javascript
buildCompositeFateThreads(compositeChart) → {
  destiny,
  pastKarma,
  karmicWork,
  requiredTransformation,
  nodalAxis,
  fateSummary
}

getRelationshipDestiny(compositeChart) → north node interpretation
getPastKarma(compositeChart) → south node interpretation
getNodalAxisDescription(compositeChart) → from/to journey
```

---

### 34. Composite Health Engine
**File:** `src/utils/compositeHealth.js`

Assesses relationship health through aspect analysis.

#### Health Categories
6 health dimensions scored 0-100:
- Communication Health
- Emotional Health
- Passion Health
- Commitment Health
- Growth Health
- Purpose Health

#### WARNING_SIGNS
8 aspect patterns that indicate challenges:
- Saturn-Sun Square: Identity suppression
- Saturn-Moon Square: Emotional coldness
- Mars-Pluto Square: Power struggles
- Neptune-Venus Square: Deception in love
- Uranus-Venus Square: Instability in love
- Pluto-Moon Square: Emotional intensity
- Saturn-Venus Square: Love blocked
- Mars-Venus Square: Passion conflicts

#### STRENGTH_INDICATORS
6 aspect patterns that indicate gifts:
- Sun-Moon Trine: Natural harmony
- Venus-Jupiter Trine: Abundant love
- Sun-Venus Trine: Love and identity aligned
- Moon-Venus Trine: Emotional/romantic harmony
- Mercury-Jupiter Trine: Expansive communication
- Saturn-Jupiter Sextile: Balance of structure and growth

#### Key Functions
```javascript
buildCompositeHealth(compositeChart) → {
  overallScore,
  overallGrade,
  overallSummary,
  categories,
  aspectBalance,
  warnings,
  strengths,
  diagnosis,
  recommendations
}

getHealthScore(compositeChart) → 0-100
getHealthWarnings(compositeChart) → warning list
getHealthStrengths(compositeChart) → strength list
quickHealthCheck(compositeChart) → summary
```

---

### 35. Composite Growth Engine
**File:** `src/utils/compositeGrowth.js`

Maps the developmental journey of the relationship.

#### GROWTH_PATH_BY_SUN
12 sign interpretations with 3 developmental phases:
- Phase 1: Early bonding
- Phase 2: Challenge/risk period
- Phase 3: Mature partnership

Each with name, description, task, duration, and ultimate growth goal.

Example (Scorpio):
```javascript
{
  phase1: { name: 'The Intensity', task: 'Surrendering to transformative power' },
  phase2: { name: 'The Crisis', task: 'Surviving the dark night' },
  phase3: { name: 'The Rebirth', task: 'Becoming midwives for rebirth' },
  ultimateGrowth: 'From controlling intensity to transformative intimacy'
}
```

#### EMOTIONAL_GROWTH_BY_MOON
12 sign interpretations of emotional work required.

#### GROWTH_CATALYSTS_BY_JUPITER
12 sign interpretations of what expands the relationship.

#### NORTH_NODE_DIRECTION
12 sign interpretations of evolutionary direction.

#### Key Functions
```javascript
buildCompositeGrowth(compositeChart) → {
  developmentalPath,
  emotionalGrowth,
  catalysts,
  evolutionaryDirection,
  integratedPath,
  phaseGuidance,
  practices
}

getGrowthPhases(compositeChart) → 3 phases
getUltimateGrowth(compositeChart) → growth goal
getEmotionalGrowthEdge(compositeChart) → emotional work
getGrowthCatalysts(compositeChart) → Jupiter interpretation
```

---

### 36. Composite Profile Orchestrator
**File:** `src/utils/buildCompositePsychologicalProfile.js`

⭐ **The single entry point for composite psychological analysis.**

#### Main Function
```javascript
import { buildCompositePsychologicalProfile } from './utils/buildCompositePsychologicalProfile';

const { error, profile } = buildCompositePsychologicalProfile(chartA, chartB);
```

#### Return Structure
```javascript
{
  // Core Chart Data
  compositeChart: { planets, aspects, statistics, houses },

  // Executive Summary
  executiveSummary: {
    title,
    subtitle,
    essence,
    identity,
    emotionalNature,
    gift,
    challenge,
    healthStatus,
    growthDirection,
    fate
  },

  // Human-Readable Portrait
  relationshipPortrait: {
    paragraphs: [...],
    fullNarrative
  },

  // Detailed Modules
  psychology,
  shadow,
  archetype,
  fateThreads,
  health,
  growth,

  // Quick Access
  quickAccess: {
    compositeSun,
    compositeMoon,
    compositeAscendant,
    archetypeName,
    mythicStory,
    healthGrade,
    healthScore,
    currentPhase,
    ultimateGrowth,
    destiny,
    pastKarma,
    primaryFear,
    transformationNeeded
  },

  // Metadata
  metadata: {
    generatedAt,
    version,
    engine,
    basedOn,
    modulesIncluded
  }
}
```

#### Convenience Functions
```javascript
// Quick analysis (summary only)
quickCompositeAnalysis(chartA, chartB) → { summary, quickAccess }

// Get archetype name
getCompositeArchetypeName(chartA, chartB) → string

// Get health grade
getCompositeHealthGrade(chartA, chartB) → grade

// Get relationship portrait
getRelationshipPortrait(chartA, chartB) → portrait

// Compare two composites (for multiple relationship analysis)
compareComposites(chartA, chartB1, chartB2) → comparison
```

---

---

## Relationship OS - The Complete Relational Organism

Based on the full integration of Liz Greene's relational psychology — fusing synastry, composite, evolution, and healing into a living relational system.

---

### 37. Relationship Soul Map Engine
**File:** `src/utils/relationshipSoulMap.js`

Fuses composite + synastry into a unified terrain of the bond.

#### Core Components

**1. Relationship Identity**
- `compositeSun`: Shared identity
- `compositeMoon`: Emotional body
- `synastryHighlights`: Key inter-chart aspects
- `elementalBalance`: Fire/Earth/Air/Water distribution
- `communicationStyle`: How the bond communicates
- `attractionDynamic`: Chemistry and passion patterns

**2. Relationship Shadow**
- `compositeShadow`: Saturn/Pluto patterns
- `synastryShadow`: Inter-chart shadow aspects
- `collectiveShadow`: What the relationship avoids
- `integrationPath`: Steps to shadow integration

**3. Relationship Contract**
- `karmicDebts`: What is owed from the past
- `soulLessons`: What must be learned together
- `sharedStrengths`: Combined gifts
- `sharedWeaknesses`: Combined vulnerabilities

**4. Fate Threads**
- `compositeFate`: North/South Node destiny
- `synastryFate`: Nodal interlocks
- `fateIntensity`: Overall karmic weight

**5. Crossroads & Growth**
- `activeCrossroads`: Current turning points
- `growthPath`: Developmental direction
- `evolutionDirection`: Where the bond is heading

#### Key Functions
```javascript
buildRelationshipSoulMap(chartA, chartB, synastryAspects) → {
  identity,
  emotionalBody,
  shadow,
  contract,
  fateThreads,
  crossroads,
  growthPath,
  archetype,
  myth,
  metadata
}
```

---

### 38. Relationship Timeline Engine
**File:** `src/utils/relationshipTimeline.js`

Tracks transits, seasons, and fate activation windows.

#### COMPOSITE_TRANSIT_MEANINGS
Transit interpretations for outer planets to composite points:
- Saturn to Sun/Moon/Venus/Mars
- Pluto to Sun/Moon/Venus/Mars
- Uranus to Sun/Moon/Venus/Mars
- Neptune to Sun/Moon/Venus/Mars
- Jupiter to Sun/Moon/Venus/Mars

Example:
```javascript
{
  'Saturn-Sun': {
    theme: 'Identity Testing',
    meaning: 'The relationship faces a test of its core identity',
    challenge: 'Can you stay true to who you are together?',
    gift: 'Clarified shared purpose',
    duration: '2-3 years'
  }
}
```

#### RELATIONSHIP_SEASONS
5 seasonal types based on dominant transits:
- **Saturn Season**: Testing and restructuring
- **Pluto Season**: Transformation and crisis
- **Jupiter Season**: Expansion and opportunity
- **Uranus Season**: Awakening and disruption
- **Neptune Season**: Dissolution and spiritual growth

#### FATE_ACTIVATION_WINDOWS
Critical timing periods:
- Saturn-Sun: Identity crisis window
- Pluto-Moon: Emotional transformation window
- Saturn-Nodes: Karmic reckoning window
- Uranus-Venus: Love liberation window
- Neptune-Moon: Spiritual dissolution window

#### Key Functions
```javascript
buildRelationshipTimeline(composite, synastry, transitData) → {
  currentTransits,
  currentSeason,
  activeFateWindows,
  upcomingTransits,
  seasonalForecast,
  criticalPeriods,
  lunaGuidance,
  metadata
}

getCurrentRelationshipSeason(composite, transitData) → season
getActiveFateWindows(composite, transitData) → windows[]
```

---

### 39. Relationship Evolution Engine
**File:** `src/utils/relationshipEvolution.js`

Tracks how the relationship evolves through Saturn cycles.

#### The 7 Stages of Relationship Evolution

| Stage | Year Range | Archetype | Myth | Psychological Task |
|-------|------------|-----------|------|-------------------|
| Birth of Bond | 0-7 | The Lovers | Paradise Found | Establishing the container |
| First Saturn Square | 7-14 | The Builders | Paradise Lost | Reality testing the dream |
| Opposition Phase | 14-21 | The Warriors | The Dark Night | Confronting the shadow |
| Second Square | 21-29 | Elders-in-Training | The Reconstruction | Mature restructuring |
| First Saturn Return | 29-44 | The Phoenix | Death and Rebirth | Complete transformation |
| Uranus Opposition | 44-58 | The Liberators | The Great Awakening | Integrating individual awakening |
| Second Saturn Return | 58+ | The Wise Ones | The Harvest | Integration and legacy |

#### ELEMENT_ARCHETYPE_EVOLUTION
10 element combinations with evolution through all 7 stages:
```javascript
{
  'Fire-Fire': {
    birthOfBond: { archetype: 'Twin Flames', expression: 'Explosive passion' },
    firstSaturnSquare: { archetype: 'Competitive Partners', expression: 'Learning to not burn each other' },
    // ... all 7 stages
  }
}
```

#### MYTHIC_EVOLUTION_ARCS
4 mythic templates:
- **Hero's Journey Together**: Relationship as shared adventure
- **Alchemical Marriage**: Relationship as transformation of lead to gold
- **Sacred Garden**: Relationship as cultivation and harvest
- **Ocean Voyage**: Relationship as journey across unknown waters

#### CRISIS_OPPORTUNITY_MAP
Major crisis points with healing paths:
- Year 7: The Seven-Year Itch
- Year 14: The Opposition Crisis
- Year 21: The Stagnation Fear
- Year 29: The Saturn Return Reckoning
- Year 44: The Midlife Awakening
- Year 58: The Mortality Confrontation

#### Key Functions
```javascript
buildRelationshipEvolution(compositeData, synastryData, relationshipStartDate) → {
  relationshipAge,
  currentStage,
  elementalEvolution,
  mythicArc,
  synastryActivation,
  currentGrowthWork,
  crisisOpportunity,
  evolutionTimeline,
  nextStagePreview,
  lunaWisdom,
  metadata
}

getCurrentEvolutionStage(relationshipYears) → stage
getGrowthTasksForStage(stageKey) → tasks[]
getCrisisInfo(relationshipYears) → crisis | null
```

---

### 40. Relationship Healing Engine
**File:** `src/utils/relationshipHealing.js`

Luna-guided repair engine with therapeutic frameworks.

#### WOUND_PATTERNS
Wound patterns organized by planetary configuration:

**Saturn Wounds:**
- Sun-Saturn: Identity Suppression
- Moon-Saturn: Emotional Coldness
- Venus-Saturn: Love Blockage
- Mars-Saturn: Desire Suppression

**Pluto Wounds:**
- Sun-Pluto: Power Struggle
- Moon-Pluto: Emotional Manipulation
- Venus-Pluto: Obsessive Love
- Mars-Pluto: Destructive Anger

**Neptune Wounds:**
- Sun-Neptune: Identity Confusion
- Moon-Neptune: Emotional Confusion
- Venus-Neptune: Idealization/Disillusionment
- Mars-Neptune: Passive Aggression

**Uranus Wounds:**
- Sun-Uranus: Commitment Phobia
- Moon-Uranus: Emotional Unavailability
- Venus-Uranus: Love Instability
- Mars-Uranus: Erratic Action

#### REPAIR_RITUALS
4 structured rituals:
1. **After Conflict Ritual**: 5-step repair process
2. **Weekly Maintenance**: State of the Union meeting
3. **Deep Wound Healing Ceremony**: For significant betrayals
4. **Forgiveness Process**: Working toward release

#### COMMUNICATION_FRAMEWORKS
3 therapeutic frameworks:
- **NVC Framework**: Nonviolent Communication adapted for couples
- **Gottman Repair Attempts**: De-escalation phrases
- **Imago Dialogue**: Deep listening technique

#### LUNA_HEALING_DIALOGUES
Extended Luna guidance for specific situations:
- After Betrayal
- During Power Struggle
- Feeling Unloved
- Lost Connection
- Considering Leaving

#### Key Functions
```javascript
buildRelationshipHealing(compositeData, synastryData, currentChallenges) → {
  woundAnalysis,
  healingPrescription,
  compositeHealingPath,
  lunaGuidance,
  emergencyToolkit,
  healingResources,
  metadata
}
```

---

### 41. Relationship Destiny Report - Master Orchestrator
**File:** `src/utils/buildRelationshipDestinyReport.js`

⭐ **The single entry point for complete relationship analysis.**

#### Main Function
```javascript
import { buildRelationshipDestinyReport } from './utils/buildRelationshipDestinyReport';

const report = buildRelationshipDestinyReport(
  chartA,
  chartB,
  relationshipStartDate,
  { synastryAspects, transitData, currentChallenges }
);
```

#### Return Structure
```javascript
{
  reportType: 'Relationship Destiny Report',

  // Participants
  participants: { personA, personB },
  relationshipAge,

  // Executive Summary
  executiveSummary: {
    title,
    essence,
    coreIdentity,
    currentMoment,
    coreStrengths,
    coreChallenges,
    lunaBlessing
  },

  // Main Sections
  sections: {
    identity,        // WHO YOU ARE TOGETHER
    connection,      // HOW YOU CONNECT
    shadow,          // YOUR SHADOWS AND CHALLENGES
    destiny,         // YOUR FATE AND DESTINY
    timeline,        // YOUR JOURNEY THROUGH TIME
    healing          // HEALING AND GROWTH
  },

  // Quick Access
  quickAccess: {
    atAGlance,
    todaysFocus,
    weeklyFocus,
    keyDates
  },

  // Luna's Complete Wisdom
  lunaWisdom: {
    currentStageWisdom,
    woundWisdom,
    generalWisdom,
    mythicWisdom,
    blessings,
    closingBlessing
  },

  // Raw Data Access
  rawAnalysis: {
    synastry,
    composite,
    soulMap,
    timeline,
    evolution,
    healing
  },

  metadata
}
```

#### Convenience Functions
```javascript
// Quick summary only
getRelationshipSummary(chartA, chartB, relationshipStartDate)

// Current growth focus for daily/weekly use
getCurrentGrowthFocus(chartA, chartB, relationshipStartDate)

// Healing toolkit for times of challenge
getHealingToolkit(chartA, chartB, currentChallenges)
```

---

### 42. Relationship Destiny Panel Component
**File:** `src/components/relationship/RelationshipDestinyPanel.jsx`

Multi-chapter scroll interface for the complete Relationship Destiny Report.

#### Features
- **Mythic Headers**: Animated gold-gradient titles with slow fade-in
- **Tab Navigation**: Soul Map, Timeline, Evolution, Healing chapters
- **Animated Transitions**: Fade + slide between chapters
- **Luna Integration**: Guidance panels throughout
- **Quick Access Sidebar**: Daily/weekly focus points

#### Usage
```jsx
import { RelationshipDestinyPanel } from './components/relationship';

<RelationshipDestinyPanel report={relationshipDestinyReport} />
```

#### Chapter Structure
- **Soul Map**: Identity, shadow, contract, fate threads
- **Timeline**: Current season, fate windows, transits
- **Evolution**: Current stage, mythic arc, evolution timeline
- **Healing**: Wounds, rituals, emergency toolkit, Luna dialogue

---

### 43. Relationship Destiny Map Component
**File:** `src/components/relationship/RelationshipDestinyMap.jsx`

Radial mandala visualization of the relationship's complete destiny.

#### Structure
```
       [ OUTER RING ] - Timeline (Seasons + Fate Windows)
      [ MIDDLE RING ] - Evolution (Saturn-cycle metamorphosis)
       [ INNER RING ] - Soul Map (Identity, Shadow, Contract)
           [ CORE ]   - Healing Engine (Luna-guided repair)
```

#### Features
- **Interactive Rings**: Click to select layer
- **Animated Rotation**: Slow ceremonial ring rotation
- **Ring Glow**: Active ring pulses with color
- **Core Pulse**: Healing center pulses when active
- **Content Panel**: Dynamic content based on selection

#### Animations
- Ring rotation: 60-120s slow spin
- Active ring glow: 2s infinite pulse
- Core pulse: 3s breathing animation

#### Usage
```jsx
import { RelationshipDestinyMap } from './components/relationship';

<RelationshipDestinyMap report={relationshipDestinyReport} />
```

---

### 44. Relationship Destiny PDF Renderer
**File:** `src/utils/relationshipDestinyPdf.js`

Illuminated manuscript style PDF export for Relationship Destiny Reports.

#### Features
- **Cover Page**: Ornamental borders, gold-leaf title
- **Chapter Pages**: Illuminated headers, drop caps
- **Luna Guidance**: Styled wisdom sections
- **Healing Sections**: Wound cards, ritual steps
- **Closing Page**: Oath of the Bond, blessing

#### CSS Classes
```css
.codex-body          - Main body styling
.codex-cover         - Cover page with borders
.chapter-header      - Illuminated chapter titles
.dropcap             - Large decorated first letters
.luna-guidance       - Luna wisdom boxes
.wound-card          - Healing wound sections
.ritual-card         - Repair ritual sections
```

#### Usage
```javascript
import { renderRelationshipDestinyPdf, getRelationshipDestinyHtml } from './utils/relationshipDestinyPdf';

// Generate PDF (requires Puppeteer)
await renderRelationshipDestinyPdf(report, 'destiny.pdf');

// Get HTML for custom rendering
const html = getRelationshipDestinyHtml(report);
```

---

### 23. Saturn Journey Panel Component
**File:** `SaturnJourneyPanel.jsx` (in `/components/saturn/`)

React component with stone/time aesthetic.

#### Main Component
```jsx
<SaturnJourneyPanel
  westernData={westernData}
  birthDate={birthDate}
  aspects={aspects}
/>
```

#### Sub-Components
```jsx
// Saturn cycle circular visualization
<SaturnCycleVisualization position={cyclePosition} />

// Developmental timeline
<SaturnTimeline phases={phases} currentPhase={currentPhase} />

// Current phase focus panel
<CurrentPhasePanel currentPhase={currentPhase} />

// AI companion guidance
<LunaIntegrationPanel lunaIntegration={lunaIntegration} />
```

#### Visual Features
- Circular progress for Saturn cycle position
- Expandable/collapsible sections
- Phase timeline with active phase highlighting
- Saturn Return alert when active
- Luna guidance toggle

---

## Greene's Individuation Stages → Pilgrim Journey Mapping

| Greene Stage | Pilgrim Chamber | Function |
|--------------|-----------------|----------|
| Ego Formation | Birth | Initial imprint, early architecture |
| Shadow Emergence | Foundations | Pattern exposure, fractures, tensions |
| Anima/Animus | Persona | Projection, relational archetypes |
| Complex Confrontation | Ritual | Trials, symbolic transformation |
| Underworld Descent | Ancestral | Lineage, karmic threads, deep myth |
| Encounter with Self | Mythos | Archetypal revelation, destiny motifs |
| Reintegration | Sovereign | Agency, authorship, alignment |
| Individuated Life | Completion | Elixir, spiral return, next cycle |

---

## How Liz Greene Found the Connection

1. **Jungian Training**: Jung's model of archetypes, shadow, individuation
2. **Mythology Scholarship**: Greek, Mesopotamian, esoteric traditions
3. **Recognition**: Astrological symbols behave like Jung's archetypes
4. **Observation**: Life stories follow mythic arcs (Saturn returns = Ordeal)
5. **Synthesis**: Astrology as symbolic diagnostic for the psyche's mythic journey

### The Core Insight
Astrology isn't predictive—it's a **map of the psyche**. Planets = archetypal energies = mythic characters. Human development unfolds as a mythic narrative.

---

## UI/UX Features

### Color Theming
Element-based colors throughout:
- **Fire**: Orange/Red gradients
- **Earth**: Green/Amber gradients
- **Air**: Blue/Cyan gradients
- **Water**: Indigo/Purple gradients

### Section Styling
Each narrative section has distinct styling:
```javascript
const sectionStyles = {
  opening: { icon: '✧', label: 'text-purple-300' },
  wound: { icon: '🩸', label: 'text-red-300' },
  quest: { icon: '⚔', label: 'text-amber-300' },
  shadow: { icon: '☾', label: 'text-slate-300' },
  gift: { icon: '✦', label: 'text-green-300' },
  pattern: { icon: '◇', label: 'text-blue-300' },
  closing: { icon: '∞', label: 'text-indigo-300' }
};
```

### Expandable Cards
Trinity tab uses expandable cards for progressive disclosure of deep content.

### Metadata Tags
Narrative includes metadata badges:
- Dominant Element
- Core Wound Type
- Current Phase
- Pattern Count

---

## Route Configuration

```javascript
// In App.jsx
<Route path="/liz-greene" element={<LizGreeneCathedralPage />} />
```

Dashboard link:
```jsx
<Link to="/liz-greene">
  <span>✧</span>
  <span>Liz Greene</span>
</Link>
```

---

## Future Enhancements

### Potential Additions
1. **Transits & Progressions Layer** - Current sky influences
2. ~~**Composite & Synastry Psychology**~~ - ✅ **IMPLEMENTED** (see Sections 28-36)
3. **Greene vs Jung Overlay** - More explicit archetype mapping
4. ~~**8-Chamber Pilgrim Journey**~~ - ✅ **IMPLEMENTED** (see Tab 8)
5. **Anima/Animus Module** - Dedicated relational archetype analysis
6. **Complex Diagnostic** - Identify active psychological complexes
7. **Personalized Script Generation** - Dynamic mythic narratives based on natal chart
8. **Journey Journaling** - User reflection storage for each chamber

---

## Integration Points

### Uses Data From
- `ProfileContext` - User profiles with birth data
- `sovereignCalculation` - Western astrology positions

### Exports Used By
- Dashboard navigation
- Profile system

### Dependencies

**Core:**
- React, React Router
- ProfileContext
- psychologicalProfileGenerator

**Pilgrim Journey:**
- greeneIndividuationEngine
- pilgrimJourneyMapper
- pilgrimJourneyScripts
- pilgrimJourneyRouter
- PilgrimJourneyStage component

**Saturn Journey v1.0:**
- saturnJourneyConstants
- saturnJourneyEngine (v2.0 integrated)
- saturnJourneyNarrative
- saturnJourneyInterpretations

**Saturn Journey v2.0 Data:**
- saturnHouseOverlays
- saturnCombinedArchetypes
- saturnAspectComplexes
- saturnLunaIntegration
- saturnCathedralPath
- saturnRelationshipDynamicsData

**Saturn Journey v2.0 Engines:**
- saturnShadowIntegration
- saturnReturnReport
- saturnLunaDialogue
- saturnRelationshipEngine (Liz Greene's "Relating")
- **buildSaturnJourneyProfile** ⭐ (Main Orchestrator)

**Astrology of Fate Modules:**
- fateThreads (Mythic Fate Threads Engine)
- fateArchetypes (Archetype Assignment)
- fateCrossroads (Crossroads Detection)
- fateChoiceIndex (Fate vs Choice Index)
- synastryFateEngine (Synastry Fate Analysis)

**Composite Psychological Engine (Third Psyche):**
- compositeGenerator (Midpoint chart calculation)
- compositePsychology (Core psychological profile)
- compositeShadow (Shadow & defense patterns)
- compositeArchetype (Relationship archetypes)
- compositeFateThreads (Fate threads for composite)
- compositeHealth (Health indicators)
- compositeGrowth (Growth path)
- **buildCompositePsychologicalProfile** ⭐ (Composite Orchestrator)

**Relationship OS (Complete Relational System):**
- relationshipSoulMap (Fusion of composite + synastry)
- relationshipTimeline (Transits, seasons, fate windows)
- relationshipEvolution (Saturn cycle development)
- relationshipHealing (Luna-guided repair engine)
- **buildRelationshipDestinyReport** ⭐ (Relationship Master Orchestrator)
- relationshipDestinyPdf (Illuminated manuscript PDF export)

**UI Components:**
- SaturnJourneyPanel component
- **RelationshipDestinyPanel** (Multi-chapter scroll with mythic transitions)
- **RelationshipDestinyMap** (Radial mandala visualization)
- RelationshipDestinyPanel.css (Cathedral-style animations)

---

## Summary

The Liz Greene Cathedral implements a complete psychological astrology system:

1. **Mythic Archetypes** - Every planet has a myth, gift, wound, and quest
2. **Shadow Work** - Defense mechanisms with triggers and protections
3. **Aspect Patterns** - Including Greene's "invisible friction" quincunxes
4. **Hero's Journey** - 12-stage journey mapped to houses
5. **Individuation Roadmap** - Saturn cycles and outer planet initiations
6. **Narrative Generation** - Personalized 7-section psychological myth
7. **Pilgrim Journey System** - 8-chamber mythic experience with:
   - Age-based individuation stage detection
   - Full ritual narrative scripts for each stage
   - Interactive journey navigation
   - Chamber symbolism and themes
8. **Saturn Journey System v2.0** - The complete Saturn OS with:
   - Complete wound/defense/gift profiles for all 12 signs
   - 12 house overlays (wound/defense/gift/returnTheme per life arena)
   - 144 sign+house combined archetypes with mythic chamber names
   - 9 aspect complexes (Moon/Sun/Venus/Mars/Mercury/Jupiter/Uranus/Neptune/Pluto-Saturn)
   - 12 cathedral initiation chambers with threshold questions
   - Shadow integration engine with practical integration moves
   - Saturn Return report generator with exact date calculations
   - Luna dialogue engine with trigger detection and therapeutic responses
   - Inner critic scripts with counter-scripts for all 12 houses
   - 60 journaling prompts (5 per house)
   - 60 Luna triggers (5 per house)
   - **Relationship Dynamics Engine** (Liz Greene's "Relating"):
     - Projection patterns (what you expect partners to carry)
     - Compatibility wounds (sign-based relational fears)
     - Partnership contracts (soul lessons)
     - Break patterns (how Saturn sabotages intimacy)
     - Healing patterns (paths to relational repair)
     - Aspect-based relational modifiers
   - **Single orchestrator entry point** (`buildSaturnJourneyProfile`)
9. **Astrology of Fate System** - Mythic fate analysis based on Liz Greene's "The Astrology of Fate":
   - **Fate Threads Engine**: 5 planetary threads (Sun/Moon/Saturn/Pluto/Nodes)
   - **Fate Archetype Engine**: Saturn + Pluto combination archetypes
   - **Crossroads Detection**: 10 major life turning points
   - **Fate vs Choice Index**: 0-100 score for fate/free will balance
   - **Synastry Fate Engine**: Comprehensive relationship fate analysis:
     - Fated axis interlocks (nodal connections)
     - Projection loops (Saturn projections)
     - Karmic contracts (relationship soul lessons)
     - Relationship crossroads (timing for pairs)
     - Synastry fate/choice index
     - Relationship archetype assignment
10. **Composite Psychological Engine** - "The Third Psyche" based on Liz Greene's "Relating":
    - **Composite Generator**: Midpoint chart calculation
    - **Psychology Engine**: Sun/Moon/Mercury/Venus/Mars interpretations (60 sign profiles)
    - **Shadow Engine**: Saturn/Pluto shadow patterns + 6 defense mechanisms
    - **Archetype Engine**: 10 element archetypes + 6 modality dynamics
    - **Fate Threads Engine**: North Node/South Node/Saturn/Pluto fate patterns
    - **Health Engine**: 6 health categories + 8 warnings + 6 strengths
    - **Growth Engine**: 3-phase developmental path + emotional growth work
    - **Single orchestrator entry point** (`buildCompositePsychologicalProfile`)
11. **Relationship OS** - The Complete Relational Organism:
    - **Soul Map Engine**: Fusion of composite + synastry into unified terrain
    - **Timeline Engine**: Transits, seasons, fate activation windows
    - **Evolution Engine**: 7-stage Saturn cycle development (birth to elder wisdom)
    - **Healing Engine**: 16 wound patterns + 4 repair rituals + 3 communication frameworks + Luna dialogues
    - **Single master orchestrator entry point** (`buildRelationshipDestinyReport`)
    - **UI Components**:
      - `RelationshipDestinyPanel`: Multi-chapter scroll (Soul Map → Timeline → Evolution → Healing)
      - `RelationshipDestinyMap`: Radial mandala with concentric rings (4-layer visualization)
      - `relationshipDestinyPdf`: Illuminated manuscript PDF export

The system treats astrology as a symbolic language of the psyche, following Greene's insight that myth, psychology, and astrology are three expressions of the same archetypal reality.

---

## Core Insight: Saturn Journey

> "Saturn marks the place in your psyche where life demanded maturity before you felt ready. This is not punishment—it is the curriculum that produces your strongest, most trustworthy self."

The Saturn Journey module answers the fundamental question: **"What must I struggle with in order to become myself?"**

### The Saturn Formula

```
House = WHERE the fear manifests (life arena)
Sign  = HOW the fear behaves psychologically
Aspect = WHY the pattern intensifies
```

### Saturn OS Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    buildSaturnJourneyProfile()                  │
│                      ⭐ MAIN ORCHESTRATOR                        │
└─────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│   DATA LAYER  │     │ ENGINE LAYER  │     │  OUTPUT LAYER │
├───────────────┤     ├───────────────┤     ├───────────────┤
│ houseOverlays │     │ shadowInteg.  │     │ narrative     │
│ combinedArch. │────▶│ returnReport  │────▶│ shadowProfile │
│ aspectComplex │     │ lunaDialogue  │     │ returnReport  │
│ lunaIntegrat. │     │ journeyEngine │     │ lunaResponses │
│ cathedralPath │     │               │     │ phaseMarkers  │
└───────────────┘     └───────────────┘     └───────────────┘
```

---

## Implementation Completeness

### UI Tabs

| Component | Status |
|-----------|--------|
| Soul Portrait Tab | ✅ Complete |
| Trinity Tab | ✅ Complete |
| Tripartite Soul Tab | ✅ Complete |
| Aspect Patterns Tab | ✅ Complete |
| Planetary Psychology Tab | ✅ Complete |
| Shadow Work Tab | ✅ Complete |
| Greene × Jung Tab | ✅ Complete |
| Pilgrim Journey Tab | ✅ Complete |
| Saturn Journey Tab | ✅ Complete |

### Saturn Journey v2.0 Modules

| Module | File | Status |
|--------|------|--------|
| Sign Profiles | `saturnJourneyInterpretations.js` | ✅ Complete (12 signs) |
| House Overlays | `saturnHouseOverlays.js` | ✅ Complete (12 houses) |
| Combined Archetypes | `saturnCombinedArchetypes.js` | ✅ Complete (144 combinations) |
| Aspect Complexes | `saturnAspectComplexes.js` | ✅ Complete (9 planets) |
| Luna Triggers | `saturnLunaIntegration.js` | ✅ Complete (60 triggers) |
| Inner Critic Scripts | `saturnLunaIntegration.js` | ✅ Complete (12 scripts) |
| Journaling Prompts | `saturnLunaIntegration.js` | ✅ Complete (60 prompts) |
| Cathedral Path | `saturnCathedralPath.js` | ✅ Complete (12 chambers) |
| Shadow Integration | `saturnShadowIntegration.js` | ✅ Complete |
| Return Report | `saturnReturnReport.js` | ✅ Complete |
| Luna Dialogue | `saturnLunaDialogue.js` | ✅ Complete |
| Relationship Dynamics | `saturnRelationshipEngine.js` | ✅ Complete (Liz Greene's "Relating") |
| **Orchestrator** | `buildSaturnJourneyProfile.js` | ✅ Complete |

### Astrology of Fate Modules

| Module | File | Status |
|--------|------|--------|
| Fate Threads Engine | `fateThreads.js` | ✅ Complete (5 planetary threads) |
| Fate Archetypes | `fateArchetypes.js` | ✅ Complete (144 combinations) |
| Crossroads Detection | `fateCrossroads.js` | ✅ Complete (10 crossroads) |
| Fate vs Choice Index | `fateChoiceIndex.js` | ✅ Complete |
| Synastry Fate Engine | `synastryFateEngine.js` | ✅ Complete |

### Relationship OS Modules

| Module | File | Status |
|--------|------|--------|
| Relationship Soul Map | `relationshipSoulMap.js` | ✅ Complete |
| Relationship Timeline | `relationshipTimeline.js` | ✅ Complete |
| Relationship Evolution | `relationshipEvolution.js` | ✅ Complete (7 stages) |
| Relationship Healing | `relationshipHealing.js` | ✅ Complete |
| **Master Orchestrator** | `buildRelationshipDestinyReport.js` | ✅ Complete |

### Data Coverage

| Data Type | Count | Description |
|-----------|-------|-------------|
| Sign Profiles | 12 | Full wound/defense/gift/turningPoint per sign |
| House Overlays | 12 | wound/defenses/gift/returnTheme per house |
| Combined Archetypes | 144 | Sign × House mythic titles |
| Mythic Chambers | 144 | Sign × House cathedral names |
| Aspect Complexes | 9 | Full psychological profiles |
| Cathedral Chambers | 12 | Initiation structure per house |
| Luna Triggers | 60 | 5 per house |
| Journaling Prompts | 60 | 5 per house |
| Inner Critic Scripts | 12 | Script + counter per house |
| Integration Moves | ~48 | 3-5 per house |
| Projection Patterns | 12 | What partners are expected to carry |
| Compatibility Wounds | 12 | Sign-based relational fears |
| Partnership Contracts | 12 | Soul lessons per house |
| Break Patterns | 12 | How Saturn sabotages intimacy |
| Healing Patterns | 12 | Paths to relational repair |
| Relational Triggers | 36 | 3 per house |
| Aspect Relational Mods | 9 | Relational wound/defense/gift per aspect |
| **Astrology of Fate Data** | | |
| Sun Fate Threads | 12 | Identity fate per sign |
| Moon Fate Threads | 12 | Emotional fate per sign |
| Saturn Fate Threads | 12 | Karmic fate per sign |
| Pluto Fate Threads | 12 | Shadow fate per sign |
| North Node Fate Threads | 12 | Destiny direction per sign |
| Saturn Teacher Archetypes | 12 | Karmic teacher per sign |
| Pluto Shadow Archetypes | 12 | Collective shadow per sign |
| Elemental Fate Themes | 16 | Element combinations |
| Life Crossroads | 10 | Major turning points |
| Axis Interlocks | 10 | Nodal connection meanings |
| Projection Loops | 6 | Saturn projection patterns |
| Karmic Contracts | 5 | Relationship contract types |
| Relationship Archetypes | 5 | Soul mate, twin flame, etc. |
| **Relationship OS Data** | | |
| Evolution Stages | 7 | Birth to Elder Wisdom |
| Element Archetype Evolutions | 70 | 10 combinations × 7 stages |
| Mythic Evolution Arcs | 4 | Hero, Alchemical, Garden, Ocean |
| Crisis Opportunity Points | 6 | Major crisis/healing windows |
| Wound Patterns | 16 | 4 per outer planet (Saturn/Pluto/Neptune/Uranus) |
| Repair Rituals | 4 | After Conflict, Weekly, Deep Wound, Forgiveness |
| Communication Frameworks | 3 | NVC, Gottman, Imago |
| Luna Healing Dialogues | 5 | Extended guidance for situations |
| Transit Meanings | 20 | 5 outer planets × 4 personal points |
| Relationship Seasons | 5 | Saturn, Pluto, Jupiter, Uranus, Neptune |
| Fate Activation Windows | 5 | Critical timing periods |
| Growth Tasks per Stage | 35 | 5 tasks × 7 stages |

---

## Quick Start

```javascript
import { buildSaturnJourneyProfile } from './utils/buildSaturnJourneyProfile';

// Full chart input
const profile = buildSaturnJourneyProfile({
  birthDateISO: "1983-07-06",
  planets: [{ name: 'Saturn', sign: 'Scorpio', house: 10 }],
  aspects: [{ p1: 'Moon', p2: 'Saturn', type: 'square' }]
});

// Use the profile
console.log(profile.combinedArchetype);     // "The Depth Authority"
console.log(profile.mythicTitle);           // "Chamber of the Phoenix Throne"
console.log(profile.cathedralChamber.thresholdQuestion);  // "What is my true calling?"
console.log(profile.shadowProfile.integrationMoves);      // ["Accept recognition...", ...]
console.log(profile.returnStatus.isApproachingReturn);    // true/false

// Relationship dynamics (Liz Greene's "Relating")
console.log(profile.relationshipDynamics.projection);         // "You expect partners to..."
console.log(profile.relationshipDynamics.compatibilityWound); // "Fear of failure..."
console.log(profile.relationshipDynamics.partnershipContract); // "To learn equality..."
console.log(profile.relationshipDynamics.breakPattern);       // "People-pleasing until..."
console.log(profile.relationshipDynamics.healingPattern);     // "Practicing clean conflict..."

// Astrology of Fate (Liz Greene's "The Astrology of Fate")
console.log(profile.fateThreads.sunThread.myth);              // "The Phoenix"
console.log(profile.fateThreads.saturnThread.karmicLesson);   // "Control through letting go"
console.log(profile.fateArchetype.title);                      // "The Dark Initiator Who Transforms Phoenix"
console.log(profile.crossroads.active);                        // [{name: "First Saturn Return", ...}]
console.log(profile.fateChoiceIndex.fateScore);                // 65
console.log(profile.fateChoiceIndex.category.name);            // "Fate-Leaning"
```

### Synastry Fate Analysis

```javascript
import { buildSynastryFateProfile } from './utils/synastryFateEngine';

const synastryFate = buildSynastryFateProfile(chartA, chartB, synastryAspects);

// Fated connections
console.log(synastryFate.axisInterlocks);         // Nodal connections
console.log(synastryFate.projectionLoops);        // Saturn projections
console.log(synastryFate.karmicContracts.primaryContract); // "The Commitment Contract"

// Relationship archetype
console.log(synastryFate.relationshipArchetype.primary.name); // "The Karmic Teachers"

// Fate vs choice for the relationship
console.log(synastryFate.fateChoiceIndex.fateScore); // 72
console.log(synastryFate.fateChoiceIndex.category.name); // "Destined Connection"
```

---

### Relationship Destiny Report

```javascript
import { buildRelationshipDestinyReport } from './utils/buildRelationshipDestinyReport';

const report = buildRelationshipDestinyReport(
  chartA,
  chartB,
  '2015-06-15',  // relationship start date
  { currentChallenges: { lostConnection: true } }
);

// Executive Summary
console.log(report.executiveSummary.essence);       // "This is a Hero's Quest relationship..."
console.log(report.executiveSummary.coreStrengths); // ["Deep connection", "Shared vision", ...]

// Current Stage
console.log(report.sections.timeline.currentStage.name);         // "First Saturn Square"
console.log(report.sections.timeline.currentStage.archetype);    // "The Builders"
console.log(report.sections.timeline.currentStage.task);         // "Reality testing the dream"

// Evolution Timeline
console.log(report.rawAnalysis.evolution.elementalEvolution);    // Fire-Water evolution arc
console.log(report.rawAnalysis.evolution.mythicArc.name);        // "The Alchemical Marriage"
console.log(report.rawAnalysis.evolution.crisisOpportunity);     // Current crisis info if active

// Healing Resources
console.log(report.sections.healing.healingPrescription.dailyPractices);  // Daily practices
console.log(report.sections.healing.emergencyToolkit.inConflict);         // Emergency de-escalation
console.log(report.sections.healing.lunaDialogue.dialogue);               // Luna's guidance

// Quick Access for Daily Use
console.log(report.quickAccess.todaysFocus);        // { evolutionTask, healingPractice, lunaReminder }
console.log(report.quickAccess.weeklyFocus);        // { growthTasks, ritual, transitFocus }

// Luna Wisdom
console.log(report.lunaWisdom.currentStageWisdom);  // Wisdom for current evolution stage
console.log(report.lunaWisdom.closingBlessing);     // "May your union be a sanctuary..."
```

---

## Section 45: Master Orchestrator

### buildLizGreeneCathedralProfile.js

The **Master Orchestrator** wires the entire Cathedral architecture together into a single entry point.

#### Purpose

This is the main switchboard that:
1. Takes birth data for one or two individuals
2. Orchestrates all 10+ engines in parallel
3. Returns a complete `CathedralProfile` object
4. Provides convenience functions for quick access

#### Usage

```javascript
import { buildLizGreeneCathedralProfile, getQuickAccess } from './utils/buildLizGreeneCathedralProfile';

// Single person profile
const profile = await buildLizGreeneCathedralProfile({
  primary: chartData
});

// Relationship profile (with partner)
const relationshipProfile = await buildLizGreeneCathedralProfile({
  primary: chartA,
  partner: chartB
}, {
  verbosity: 'detailed',
  includeMinorAspects: true
});

// Access data
console.log(profile.trinity);                      // Sun/Moon/Rising
console.log(profile.psychologicalNarrative);       // Generated life story
console.log(profile.aspectPatterns);               // Configurations
console.log(profile.shadowWork);                   // Shadow dynamics
console.log(profile.saturnJourney);                // Saturn cycle analysis
console.log(profile.fateThreads);                  // Nodal axis & destiny
console.log(profile.relationshipDestiny);          // Full relationship OS (if partner)

// Quick access
console.log(profile.quickAccess.oneLiner);         // "A Fire soul navigating..."
console.log(profile.quickAccess.threeWordEssence); // ["Seeker", "Builder", "Healer"]
console.log(profile.quickAccess.lunaWhisper);      // Luna's daily guidance
```

#### Architecture Layers

The orchestrator assembles 10 layers:

| Layer | Module | Output |
|-------|--------|--------|
| 1 | `generateCompletePsychologicalProfile` | trinity, characterAndShadow, planetaryPsychology |
| 2 | `detectAspectPatterns` | configurations, quincunxes, summary |
| 3 | `generatePsychologicalNarrative` | opening, wound, quest, shadow, gift, pattern, closing |
| 4 | `analyzeMythicPsychology` | archetypes, shadows, defenses |
| 5 | `greeneIndividuationEngine` | individuation stages, tasks |
| 6 | `getFullJourneyContext` | pilgrim journey, current stage |
| 7 | `buildSaturnJourneyProfile` | Saturn cycle, wound, defense, gift |
| 8 | `buildFateThreadsProfile` | nodal axis, karmic patterns, destiny indicators |
| 9 | `buildCompositePsychologicalProfile` | composite chart analysis (if partner) |
| 10 | `buildRelationshipDestinyReport` | full relationship OS (if partner) |

#### Return Type

```typescript
interface CathedralProfile {
  meta: CathedralMeta;
  trinity: TrinityBlock;
  psychologicalNarrative: PsychologicalNarrativeBlock;
  aspectPatterns: AspectPatternsBlock;
  planetaryPsychology: PlanetaryPsychologyBlock;
  shadowWork: ShadowWorkBlock;
  greeneJung: GreeneJungBlock;
  pilgrimJourney: PilgrimJourneyBlock;
  saturnJourney: SaturnJourneyBlock;
  fateThreads: FateThreadsBlock;
  composite: CompositeProfile | null;
  synastry: SynastryBlock | null;
  relationshipDestiny: RelationshipDestinyBlock | null;
  quickAccess: QuickAccessBlock;
}
```

See `src/types/CathedralProfile.ts` for full type definitions.

---

## Section 46: TypeScript Type Definitions

### CathedralProfile.ts

Production-ready TypeScript interfaces for the entire Cathedral architecture.

**Location:** `src/types/CathedralProfile.ts`

#### Key Types

```typescript
// Primitive types
type ZodiacSign = 'Aries' | 'Taurus' | 'Gemini' | ... | 'Pisces';
type Planet = 'Sun' | 'Moon' | 'Mercury' | ... | 'Pluto' | 'NorthNode' | 'SouthNode';
type AspectType = 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile' | ...;
type Element = 'Fire' | 'Earth' | 'Air' | 'Water';
type Modality = 'Cardinal' | 'Fixed' | 'Mutable';

// Block interfaces
interface TrinityBlock { sun, moon, rising, synthesis }
interface PsychologicalNarrativeBlock { openingScene, coreWound, lifeChapters, heroicQuest, closingBlessing }
interface AspectPatternsBlock { majorAspects, minorAspects, configurations, dominantTheme }
interface ShadowWorkBlock { primaryShadow, secondaryShadows, collectiveShadow, integrationPractices }
interface SaturnJourneyBlock { cyclePosition, currentLessons, saturnReturn, authorityDevelopment }
interface FateThreadsBlock { nodalAxis, karmicPatterns, destinyIndicators, fateVsFreeWill }
interface RelationshipDestinyBlock { executiveSummary, soulMap, timeline, evolution, healing, lunaWisdom }

// Type guards
function isRelationshipProfile(profile: CathedralProfile): boolean;
function hasRelationshipDestiny(profile: CathedralProfile): boolean;
function isSaturnReturnActive(profile: CathedralProfile): boolean;
```

---

## Section 47: UI Integration

### LizGreeneCathedralPage.jsx

The Cathedral Page now supports:

1. **Primary Profile Selection** - Choose main profile
2. **Partner Profile Selection** - Optionally add partner for relationship analysis
3. **Automatic Cathedral Profile Generation** - Uses master orchestrator
4. **Dynamic Tab System** - Shows relationship tabs when partner selected
5. **12 Total Tabs**:
   - Soul Portrait
   - The Trinity
   - Tripartite Soul
   - Aspect Patterns
   - Planetary Psychology
   - Shadow Work
   - Greene × Jung
   - Pilgrim Journey
   - Saturn Journey
   - Fate Threads (NEW)
   - Relationship Destiny (when partner selected)
   - Destiny Map (when partner selected)

#### Data Flow

```
User Selects Profile(s)
        ↓
buildLizGreeneCathedralProfile()
        ↓
   ┌────┴────┐
   │ 10 Engines │
   │ in Parallel │
   └────┬────┘
        ↓
CathedralProfile Object
        ↓
Tab Components Receive Data
```

---

## Implementation Completeness

| Component | Status | Notes |
|-----------|--------|-------|
| Master Orchestrator | ✅ Complete | 10-layer assembly |
| TypeScript Types | ✅ Complete | Full production-ready definitions |
| UI Integration | ✅ Complete | All tabs wired to orchestrator |
| Relationship OS | ✅ Complete | Soul Map, Timeline, Evolution, Healing |
| Relationship UI | ✅ Complete | Panel + Map + PDF |
| Fate Threads Tab | ✅ Complete | Nodal axis visualization |
| PDF Export | ✅ Complete | Illuminated manuscript style |

---

## Quick Start

```javascript
// Import the master orchestrator
import { buildLizGreeneCathedralProfile } from './utils/buildLizGreeneCathedralProfile';

// Generate a complete profile
const profile = await buildLizGreeneCathedralProfile({
  primary: {
    name: 'John Doe',
    birthDate: '1985-03-15',
    birthTime: '14:30',
    birthPlace: { city: 'New York', country: 'USA', latitude: 40.7128, longitude: -74.0060 }
  }
});

// Use the profile
console.log(profile.quickAccess.oneLiner);
console.log(profile.trinity.sun.interpretation.archetype);
console.log(profile.saturnJourney.cyclePosition.phase);
console.log(profile.fateThreads.nodalAxis.northNode.sign);
```

---

---

## v8.0 Extension: Living System + Transformative Journey + Relationship Depth

**Version:** 8.0 — Phase 1-3 Complete + Error Handling
**Date:** January 2026
**Status:** Fully Implemented

### Phase 1: The Living System (Transits & Progressions)

Daily guidance based on current planetary weather against natal chart.

#### New Files

```
src/utils/
├── transitCalculator.js              # Planetary position calculations
│   ├── calculatePlanetPosition()     # Current sky positions
│   ├── calculateTransitAspects()     # Transits to natal
│   ├── calculateSaturnCycleTransit() # Saturn cycle tracking
│   └── ZODIAC_SIGNS, DAILY_MOTION    # Constants
│
├── transitInterpretation.js          # Liz Greene psychological meanings
│   ├── TRANSIT_PLANET_THEMES         # Sun through Chiron themes
│   ├── NATAL_PLANET_THEMES           # What each natal planet represents
│   ├── ASPECT_MEANINGS               # Conjunction, square, trine, etc.
│   ├── TRANSIT_INTERPRETATIONS       # 20+ specific transit combos
│   └── getTransitInterpretation()    # Lookup function
│
├── currentSkyAnalysis.js             # Daily guidance orchestrator
│   ├── getCurrentSkySnapshot()       # Current planetary positions
│   ├── buildPersonalTransitReport()  # Complete transit analysis
│   ├── getSaturnFocusedReport()      # Saturn-specific guidance
│   ├── getWeeklyTransitOverview()    # Week ahead
│   └── getMonthlyTransitOverview()   # Month ahead
│
src/components/transits/
├── TransitsPanel.jsx                 # UI component
│   ├── TodayView                     # Current transits
│   ├── SaturnFocusView               # Saturn emphasis
│   └── WeekView                      # Weekly outlook
└── index.js                          # Export barrel
```

### Phase 2: The Transformative Journey

Interactive journaling and complex diagnostics with Luna integration.

#### New Files

```
src/utils/
├── journeyJournalingEngine.js        # Reflection storage & Luna commentary
│   ├── CHAMBER_PROMPTS               # 8 chambers with prompts
│   │   ├── egoFormation              # Who you pretended to be
│   │   ├── shadowBirth               # What was exiled
│   │   ├── personaMask               # The face you show
│   │   ├── animus/anima              # Contrasexual projection
│   │   ├── confrontation             # Meeting the shadow
│   │   ├── integration               # Reclaiming what was lost
│   │   ├── selfEmergence             # Authentic self arising
│   │   └── cosmicSelf                # Connection to greater whole
│   ├── createJournalEntry()          # Entry creation
│   ├── generateLunaResponse()        # AI-style response generation
│   ├── calculateJourneyProgress()    # Progress tracking
│   ├── recognizePatterns()           # Pattern detection in entries
│   └── exportJournalForTherapy()     # Export for therapeutic use
│
├── complexDiagnosticEngine.js        # Active complex detection
│   ├── PSYCHOLOGICAL_COMPLEXES       # 10 complexes defined
│   │   ├── motherComplex             # Moon, Pluto, Ceres
│   │   ├── fatherComplex             # Sun, Saturn
│   │   ├── abandonmentComplex        # Moon, Neptune, 4th/12th
│   │   ├── betrayalComplex           # Pluto, Scorpio, 8th
│   │   ├── perfectionism             # Virgo, Saturn, 6th
│   │   ├── authority                 # Saturn, Sun, 10th
│   │   ├── savior                    # Neptune, Pisces, 12th
│   │   ├── martyr                    # Neptune, Pisces, 12th
│   │   ├── specialness               # Leo, Sun, 5th
│   │   └── unworthiness              # Saturn, Capricorn, 10th
│   ├── diagnoseActiveComplexes()     # Main diagnosis function
│   ├── COMPLEX_ASSESSMENT_QUESTIONS  # Self-assessment
│   └── getComplexesForSaturnPhase()  # Phase-specific complexes
│
├── dynamicScriptGenerator.js         # Personalized mythic narratives
│   ├── SIGN_ARCHETYPES               # All 12 sign archetypes
│   ├── NARRATIVE_TEMPLATES           # Story templates
│   ├── generatePersonalizedScript()  # Main generator
│   └── generateLLMPrompt()           # For AI continuation
│
src/hooks/
└── useJourneyReflections.js          # React hook for journaling
    ├── useJourneyReflections()       # Main hook
    │   ├── entries, progress, patterns
    │   ├── saveReflection()
    │   ├── navigateToChamber()
    │   └── regenerateLunaResponse()
    └── useChamberReflections()       # Chamber-specific hook
```

### Phase 3: Relationship Depth Enhancement

Deeper compatibility through shadow work and relationship weather.

#### New Files

```
src/utils/
├── animaAnimusModule.js              # Shadow partner analysis
│   ├── ANIMA_ARCHETYPES              # Moon + Venus projections
│   │   └── 12 moon sign archetypes   # Amazon Warrior to Divine Beloved
│   ├── ANIMUS_ARCHETYPES             # Sun + Mars projections
│   │   └── 12 sun sign archetypes    # Warrior Hero to Mystic
│   ├── DESCENDANT_ANALYSIS           # 7th house shadow partner
│   ├── PROJECTION_TRIGGERS           # Aspect patterns that activate
│   ├── buildAnimaProfile()           # For masculine-identified
│   ├── buildAnimusProfile()          # For feminine-identified
│   ├── buildShadowPartnerAnalysis()  # Complete analysis
│   ├── detectProjectionTriggers()    # From aspects
│   └── analyzeAnimaAnimusCompatibility() # Partner dynamics
│
├── compositeTransits.js              # Relationship weather
│   ├── COMPOSITE_TRANSIT_MEANINGS    # All major transits
│   │   ├── Saturn-Sun/Moon/Venus/Mars
│   │   ├── Pluto-Sun/Moon/Venus
│   │   ├── Neptune-Sun/Moon
│   │   ├── Uranus-Sun/Venus
│   │   └── Jupiter-Sun/Venus
│   ├── WEATHER_CATEGORIES            # Clear to Thunderstorm
│   ├── calculateCompositeTransits()  # Current weather
│   ├── getRelationshipForecast()     # 3-month forecast
│   └── checkRelationshipDate()       # Date significance
│
├── synastryAspectExtensions.js       # Deeper compatibility
│   ├── VENUS_MARS_ASPECTS            # Attraction dynamics
│   ├── SUN_MOON_ASPECTS              # Emotional bonding
│   ├── MOON_MOON_ASPECTS             # Emotional attunement
│   ├── MERCURY_ASPECTS               # Communication styles
│   ├── CHIRON_ASPECTS                # Wound & healing
│   ├── VERTEX_ASPECTS                # Fated meetings
│   ├── JUNO_ASPECTS                  # Commitment indicators
│   ├── HOUSE_OVERLAYS                # Where planets fall
│   ├── analyzeAttractionDynamics()   # Venus-Mars analysis
│   ├── analyzeEmotionalCompatibility() # Sun-Moon analysis
│   ├── analyzeHealingPotential()     # Chiron analysis
│   └── buildExtendedSynastryAnalysis() # Complete extension
│
├── relationshipHealing.js (EXTENDED) # Additional healing content
│   ├── EXTENDED_RITUALS              # 6 new rituals
│   │   ├── reconnectionAfterDistance
│   │   ├── sexualReconnection        # Sensate focus practice
│   │   ├── trustRebuilding           # 4-phase process
│   │   ├── anniversaryReflection
│   │   ├── dailyGratitude
│   │   └── conflictPrevention
│   ├── SHADOW_INTEGRATION            # 3 shadow practices
│   │   ├── projectionWork
│   │   ├── triggerMapping
│   │   └── shadowDialogue
│   ├── ATTACHMENT_HEALING            # By attachment style
│   │   ├── anxiousSecure
│   │   ├── avoidantSecure
│   │   └── disorganizedSecure
│   └── buildCompleteHealingToolkit() # Full toolkit
```

### Infrastructure: Error Handling

Centralized error handling for all Cathedral modules.

```
src/utils/
└── cathedralErrorHandling.js         # Shared error utilities
    ├── CathedralError                # Base error class
    ├── DataValidationError           # Validation failures
    ├── MissingDataError              # Required data missing
    ├── InvalidSignError              # Bad zodiac sign
    ├── InvalidHouseError             # Bad house number
    ├── validateSign()                # Sign validation
    ├── validateHouse()               # House validation
    ├── validateChartData()           # Chart validation
    ├── withErrorHandling()           # Function wrapper
    ├── safeGet()                     # Safe property access
    ├── safeExecute()                 # Safe function execution
    ├── logError()                    # Error logging
    ├── getFallbackSaturnData()       # Saturn fallback
    ├── getFallbackFateThread()       # Fate thread fallback
    └── wrapResult()                  # Result wrapper
```

### Updated Implementation Completeness

| Component | Status | Notes |
|-----------|--------|-------|
| Phase 1: Living System | ✅ Complete | Transit calculator, interpretations, UI |
| Phase 2: Transformative Journey | ✅ Complete | Journaling, complexes, scripts |
| Phase 3: Relationship Depth | ✅ Complete | Anima/Animus, composite transits, synastry |
| Error Handling | ✅ Complete | Centralized utilities |
| Relationship Healing Extended | ✅ Complete | 6 rituals, shadow work, attachment |

### Usage Examples

#### Get Today's Transit Guidance
```javascript
import { buildPersonalTransitReport } from './utils/currentSkyAnalysis';

const report = buildPersonalTransitReport(natalChart);
console.log(report.dailyGuidance);
console.log(report.saturnCycle.phaseName);
```

#### Diagnose Active Complexes
```javascript
import { diagnoseActiveComplexes } from './utils/complexDiagnosticEngine';

const diagnosis = diagnoseActiveComplexes({
  aspects: natalAspects,
  saturnPhase: 'first_return',
  housePositions: { Moon: 4, Saturn: 10 }
});
console.log(diagnosis.activeComplexes);
```

#### Analyze Shadow Partner Dynamics
```javascript
import { buildShadowPartnerAnalysis } from './utils/animaAnimusModule';

const shadow = buildShadowPartnerAnalysis(chartData);
console.log(shadow.anima.core.archetype);
console.log(shadow.shadowPartner.lunaGuidance);
```

#### Get Relationship Weather
```javascript
import { calculateCompositeTransits } from './utils/compositeTransits';

const weather = calculateCompositeTransits(compositeChart);
console.log(weather.weather.name); // "Storm Warning"
console.log(weather.lunaGuidance.primaryFocus);
```

---

*The Cathedral of Psychological Astrology — Where myth meets soul, and stars illuminate the unconscious.*

*Part of the GENESIS AstroProfile Cathedral System — Saturn OS v2.0 + Astrology of Fate + Relationship OS + Living System v8.0 Complete*
