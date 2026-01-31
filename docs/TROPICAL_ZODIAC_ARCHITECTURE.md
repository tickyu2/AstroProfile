# Tropical Zodiac System Architecture

> GENESIS AstroProfile - January 2026

The Tropical Zodiac feature is a modular, D3-powered interactive visualization system for exploring zodiac signs, seasons, elements, modalities, and sign compatibility.

---

## File Tree Structure

```
src/
├── pages/
│   ├── TropicalSeasonsPage.tsx        # Main page component (~1,050 lines) [UPDATED]
│   └── TropicalSeasonsPage.css        # All page styling (5,364 lines)
│
├── components/zodiac/
│   ├── TropicalZodiacWheel.tsx        # D3 wheel visualization (841 lines)
│   ├── WheelEducationPanel.tsx        # 5-tab education system (1,083 lines)
│   ├── ElementFlowTimeline.tsx        # Element seasonal flow (356 lines)
│   ├── ElementFlowTimeline.css        # Flow timeline styling (395 lines)
│   ├── SeasonPanel.tsx                # Season detail panel (189 lines)
│   ├── SignPanel.tsx                  # Sign detail panel (123 lines)
│   ├── AngleTrainer.tsx               # Aspect angle educator (174 lines)
│   ├── SignCompatibilityPanels.tsx    # Compatibility UI (362 lines)
│   ├── ProfileComparisonModal.tsx     # Draggable profile modal
│   ├── CompatibilityAnalysisPanel.tsx # 5-matrix compatibility + final score [UPDATED]
│   ├── SynastryGrid.tsx              # 9-way Core Bond matrix visualization
│   ├── PlanetaryMatrixGrid.tsx       # Planetary matrix grid + highlights [NEW]
│   ├── PlanetSeasonPanel.tsx         # Planet list + detail modal [NEW]
│   ├── PlanetSeasonPanel.css         # Panel + modal + synastry styles [NEW]
│   ├── SeasonalWheelWithUI.tsx       # D3 wheel + panel container [NEW]
│   ├── SeasonalWheelWithUI.css       # Wheel + panel layout [NEW]
│   ├── SynastryPdfReport.tsx         # PDF-ready report component [NEW]
│   └── SynastryPdfReport.css         # Light-theme print styles [NEW]
│
├── data/
│   ├── tropicalSeasons.ts             # Core data & utilities (1,378 lines)
│   ├── tropicalConstants.ts           # UI constants & education data (2,343 lines)
│   └── elementFlowConstants.ts        # Element × Season flow data (539 lines)
│
└── zodiac/
    ├── tropicalMap.ts                 # Educational sign data (381 lines)
    ├── tropicalCalendar.ts            # Swiss Ephemeris dates (555 lines)
    ├── angles.ts                      # Aspect angle lessons (263 lines)
    ├── narrativeEngine.ts             # Perspective reports & synastry matrix
    ├── planetaryMatrices.ts           # 5-matrix builders + BlendedPlanetPosition [NEW]
    ├── synastryPreview.ts             # 7-capability synastry engine [NEW]
    ├── cusp/                          # φ-curve cusp blending subsystem [NEW]
    │   ├── index.ts                   # Barrel exports
    │   ├── resolveSignContext.ts      # Seasonal phase + cusp detection
    │   ├── signVectors.ts            # φ-blending + 9D sign vectors
    │   └── useYearWheelRotation.ts   # Year breathing animation
    └── compatibility/                 # Scoring primitives [NEW]
        ├── types.ts                   # Shared compatibility types
        └── scoringPrimitives.ts       # baseAspectScore()
```

**Total: ~18,000+ lines across 25+ files**

---

## Layer Breakdown

### 1. Page Layer

#### `TropicalSeasonsPage.tsx`
**Purpose:** Main orchestrator - manages state, routing, and layout.

**Key Responsibilities:**
- Profile selection (primary & secondary)
- View mode management (`overview`, `sign`, `season`, `compatibility`)
- Sign selection state via `useSignSelection` hook
- Aspect highlighting logic
- Draggable table flap management
- Renders all child components in a responsive layout

**Key State:**
```typescript
viewMode: 'overview' | 'sign' | 'season' | 'compatibility'
selectedSign: ZodiacSign | null
selectedSeason: Season | null
signSelection: { signA, signB, hasPair, selectSign, clearAll }
selectedAspect: AspectType | null
showTableFlap: boolean
flapPosition: { x: number; y: number }
```

---

### 2. Visualization Layer

#### `TropicalZodiacWheel.tsx`
**Purpose:** D3-based interactive zodiac wheel with concentric rings.

**Ring Structure (outer to inner):**
1. **Season Ring** - 4 seasonal arcs with pulse animation
2. **Sign Ring** - 12 zodiac signs with element coloring
3. **Element Ring** - Fire/Earth/Air/Water segments
4. **Modality Ring** - Cardinal/Fixed/Mutable segments
5. **Center Hub** - Aspect symbols (clickable)

**Props Interface:**
```typescript
interface TropicalZodiacWheelProps {
  dimensions: { width: number; height: number };
  seasonArcs: D3SeasonArc[];
  signArcs: D3SignArc[];
  viewMode: ViewMode;
  selectedSign: ZodiacSign | null;
  signA: ZodiacSign | null;
  signB: ZodiacSign | null;
  selectedAspect: AspectType | null;
  aspectHighlightedSigns: Set<ZodiacSign>;
  aspectReferenceSign: ZodiacSign | null;

  // Callbacks
  onSignClick: (sign: ZodiacSign) => void;
  onSeasonClick: (season: Season) => void;
  onHoverSign: (sign: string | null) => void;
  onHoverElement: (element: string | null) => void;
  onHoverModality: (modality: string | null) => void;
  onHoverCelestialEvent: (id: string | null) => void;
  onHoverAspect?: (aspectKey: AspectKey | null) => void;
}
```

**Features:**
- Animated pulse effect on current season
- Aspect lines between highlighted signs
- Hover tooltips for all ring segments
- Selection glow effects
- Responsive sizing
- Center hub with 7 clickable aspect symbols

---

### 3. Education Layer

#### `WheelEducationPanel.tsx`
**Purpose:** Cathedral-level 5-tab education system with progressive disclosure.

**5-Tab Structure:**
1. **Overview** - The 4 layers (Signs, Houses, Aspects, Transits) with expandable "How It Relates" sections
2. **Seasons** - 4 seasons with environmental reality lists and Three Act Structure
3. **Elements** - 4 elements with Physics→Psychology panels and Sunset Response
4. **Modalities** - 3 modalities with metaphors and real-life examples
5. **Signs** - 12 signs with full constitutional profiles (8 expandable accordion sections)

**Exports:**
```typescript
export const WheelEducationPanel: React.FC<WheelEducationPanelProps>
export const SummaryTableTab: React.FC  // Element × Season matrix
export { ElementFlowTimeline, SeasonalResonancePanel, HomeChallengeCard }
```

---

#### `ElementFlowTimeline.tsx` [NEW]
**Purpose:** Visual timeline showing how elements move through the year.

**Components:**
1. **ElementFlowTimeline** - Interactive grid showing element intensity per season
2. **SeasonalResonancePanel** - Personal seasonal mirror reading
3. **HomeChallengeCard** - Compact home/challenge season display

**Key Features:**
- Animated intensity bars for each element × season
- Click element rows to reveal full yearly arc narrative
- Click season headers to see what element is missing
- Phase labels: Rising, Peak, Fading, Resting
- Absence teachings for each element's dormant season

**Props:**
```typescript
interface ElementFlowTimelineProps {
  highlightElement?: string;
  showNarratives?: boolean;
}

interface SeasonalResonancePanelProps {
  sign: string;
  currentDate?: Date;
}

interface HomeChallengeCardProps {
  sign: string;
}
```

---

### 4. Panel Components

#### `SeasonPanel.tsx`
**Purpose:** Detailed view of a seasonal archetype.

**Tabs:**
1. **Overview** - Season description, light/dark cycle
2. **Modality Flow** - Cardinal→Fixed→Mutable energy progression
3. **Signs** - The three signs belonging to this season

---

#### `SignPanel.tsx`
**Purpose:** Detailed view of a zodiac sign.

**Displays:**
- Symbol, date range, ruling planet
- Element, Modality, Season badges
- Short mantra (e.g., "The Initiator")
- Academy Box with educational content
- Keywords
- Degree position (0°-360°)
- "Select for Compatibility" button

---

#### `AngleTrainer.tsx`
**Purpose:** Khan Academy-style aspect angle educator.

**Teaches 7 aspects progressively:**
| Angle | Name | Vibe |
|-------|------|------|
| 0° | Conjunction | Unified Seed |
| 30° | Semi-sextile | Adjacent Shift |
| 60° | Sextile | Friendly Flow |
| 90° | Square | Dynamic Tension |
| 120° | Trine | Natural Harmony |
| 150° | Quincunx | Awkward Stretch |
| 180° | Opposition | Polar Balance |

---

#### `SignCompatibilityPanels.tsx`
**Purpose:** Sign-to-sign compatibility analysis display.

**Contains:**
1. **LegacyCompatibilityPanel** - Simple score-based view
2. **EnhancedCompatibilityPanel** - Detailed breakdown with:
   - Element harmony analysis
   - Modality dynamics
   - Polarity balance
   - Aspect relationship
   - Communication style insights

---

### 5. Data Layer

#### `tropicalSeasons.ts`
**Purpose:** Canonical data tables and computation utilities.

**Exports:**
- `SIGNS` - Array of 12 zodiac signs
- `ELEMENT` - Sign→Element mapping
- `MODALITY` - Sign→Modality mapping
- `SEASON` - Sign→Season mapping
- `POLARITY` - Sign→Yang/Yin mapping
- `SIGN_METADATA` - Full metadata for each sign
- `SEASONAL_PROFILES` - Archetype data for each season
- `ASPECT_DEFINITIONS` - Aspect configuration
- `buildD3SeasonArcs()` - Generates D3 arc data for seasons
- `buildD3SignArcs()` - Generates D3 arc data for signs
- `calculateCompatibility()` - Computes compatibility score
- `getAspectingSigns()` - Returns signs at a given aspect

**Types:**
```typescript
type ZodiacSign = 'Aries' | 'Taurus' | ... | 'Pisces'
type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter'
type AspectType = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition'
```

---

#### `tropicalConstants.ts`
**Purpose:** UI-specific constants, rich tooltip data, and educational content.

**Exports:**
- `SIGN_GLYPHS` - Unicode symbols (♈, ♉, etc.)
- `SIGN_TOOLTIPS` - Detailed tooltip data per sign
- `ELEMENT_TOOLTIPS` - Element descriptions
- `MODALITY_TOOLTIPS` - Modality descriptions
- `CELESTIAL_EVENTS` - Solstice/Equinox markers
- `SEASON_PULSE_COLORS` - Animation colors
- `WHEEL_LAYERS` - Layer education data
- `SEASON_WISDOM` - Seasonal wisdom and survival imperatives
- `ELEMENT_EDUCATION` - Element physics→psychology bridges
- `MODALITY_EDUCATION` - Modality metaphors and patterns
- `SIGN_SEASONAL_MEANINGS` - Full constitutional profiles
- `SEASONAL_SUMMARY_TABLE` - Element × Season matrix data
- `SEASONAL_PROFILE` - Home/challenge season mapping
- `SEASONAL_RESONANCE_NARRATIVES` - 4×4 matrix of validating narratives
- `getSeasonalMirrorReading()` - Complete mirror reading function
- `getCurrentSeason()` - Date-to-season calculation

**Re-exports from elementFlowConstants.ts:**
- All element flow types and functions (see below)

---

#### `elementFlowConstants.ts` [NEW]
**Purpose:** Element × Season flow data - how elements move through the year.

**Core Concept:**
Each element has an arc through the year - emergence, peak, transition, absence.
- **Fire**: Burns Spring→Summer→Autumn, dies in Winter
- **Water**: Emerges Summer→Autumn→Winter, absent in Spring
- **Earth**: Grounds Spring→Summer→Winter, absent in Autumn
- **Air**: Flows Spring→Autumn→Winter, absent in Summer

**Types:**
```typescript
type ElementFlowPhase = 'emergence' | 'peak' | 'transition' | 'absence'

interface ElementSeasonPhase {
  phase: ElementFlowPhase;
  sign: string | null;
  description: string;
  survivalGift: string;
  intensity: number; // 0-100
}

interface PersonalSeasonalState {
  element: string;
  currentSeason: Season;
  supported: boolean;
  dormant: boolean;
  missingElement: string;
  compensation: ElementCompensationTip | null;
  seasonalImbalance: SeasonalImbalanceData;
}
```

**Exports:**
- `ELEMENT_FLOWS` - Complete arc data for each element
- `ELEMENT_SEASON_PRESENCE` - Which elements present/absent per season
- `SEASONAL_IMBALANCE_INSIGHTS` - Psychological effects of seasonal imbalance
- `ELEMENT_COMPENSATION_TIPS` - Personal guidance when element is dormant
- `ELEMENT_DORMANT_SEASON` - Simple element→dormant season map
- `getElementFlowPhase()` - Get phase for element in season
- `getSeasonElementBreakdown()` - Get all elements with phases for a season
- `getPersonalCompensationTip()` - Get tips based on user element and season
- `getCurrentSeasonalImbalance()` - Get imbalance insight for current season
- `getPersonalSeasonalState()` - Complete mirror resolver function
- `getSeasonalImbalance()` - Diagnostic engine for any season

---

#### `tropicalMap.ts`
**Purpose:** Educational content for Khan Academy-style teaching.

**Key Data:**
- `SIGN_LESSONS` - Complete lesson data per sign

**Helper Constants:**
- `TROPICAL_ORDER` - Signs in wheel order
- `ELEMENT_EMOJI` - 🔥🌍💨💧
- `SEASON_EMOJI` - 🌸☀️🍂❄️
- `MODALITY_ROLE` - Cardinal/Fixed/Mutable descriptions

---

#### `tropicalCalendar.ts`
**Purpose:** Precise astronomical timing via Swiss Ephemeris.

**Key Data:**
- `SWISS_EPHEMERIS_DATES_2026` - Exact equinox/solstice timestamps
- `SEASONAL_CALENDAR` - 12-slot calendar with date ranges

**Functions:**
- `getPreciseCurrentSeason()` - Returns current season info
- `getDaysUntilNextSeason()` - Countdown to next seasonal shift

---

#### `angles.ts`
**Purpose:** Aspect angle lesson content.

**Exports:**
- `ANGLE_LESSONS` - Array of 7 aspect lessons
- `getAngleTargets(fromSign, steps)` - Calculates target signs
- `getAngleBetweenSigns(signA, signB)` - Returns aspect between signs

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    TropicalSeasonsPage                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ viewMode    │  │ signSelect  │  │ aspectHighlightedSigns  │ │
│  └──────┬──────┘  └──────┬──────┘  └────────────┬────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ profileWestern / secondProfileWestern                     │   │
│  │ (extracts all 10 planet signs from western.planets)       │   │
│  └──────┬───────────────────────────────────────────────────┘   │
└─────────┼────────────────┼──────────────────────┼──────────────┘
          │                │                      │
          ▼                ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                   TropicalZodiacWheel                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  D3 SVG Rendering                                        │   │
│  │  • Season Ring (pulse animation)                         │   │
│  │  • Sign Ring (element colors)                            │   │
│  │  • Element Ring                                          │   │
│  │  • Modality Ring                                         │   │
│  │  • Center Hub (aspect symbols)                           │   │
│  │  • Aspect Lines                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│  Callbacks: onSignClick, onSeasonClick, onHover*, onHoverAspect │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Side Panels                                │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────────────┐  │
│  │ SeasonPanel  │ │  SignPanel   │ │ SignCompatibilityPanel │  │
│  └──────────────┘ └──────────────┘ └────────────────────────┘  │
│  ┌────────────────────┐  ┌───────────────────────────────────┐ │
│  │   AngleTrainer     │  │     WheelEducationPanel           │ │
│  └────────────────────┘  │  ┌─────────────────────────────┐  │ │
│                          │  │  ElementFlowTimeline        │  │ │
│                          │  │  SeasonalResonancePanel     │  │ │
│                          │  │  SummaryTableTab            │  │ │
│                          │  └─────────────────────────────┘  │ │
│                          └───────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│             Compatibility & Synastry Layer                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  CompatibilityAnalysisPanel                                │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐  │ │
│  │  │ Final Score  │ │ View Toggle  │ │ Relationship Type│  │ │
│  │  │ Banner (%)   │ │ Matrix/Layer │ │ Romantic/Friend  │  │ │
│  │  └──────────────┘ └──────────────┘ └──────────────────┘  │ │
│  │                                                            │ │
│  │  ┌─ Matrix View ─────────────────────────────────────────┐│ │
│  │  │ SynastryGrid (Core Bond 3×3)               45% wt   ││ │
│  │  │ PlanetaryMatrixGrid (Chemistry 2×2)         20% wt   ││ │
│  │  │ PlanetaryMatrixGrid (Communication 1×2)     15% wt   ││ │
│  │  │ PlanetaryMatrixGrid (Growth 2×2)            12% wt   ││ │
│  │  │ PlanetaryMatrixGrid (Transformation 3×3)     8% wt   ││ │
│  │  │ [Print Synastry Report]                               ││ │
│  │  └───────────────────────────────────────────────────────┘│ │
│  │                                                            │ │
│  │  ┌─ Layer View ──────────────────────────────────────────┐│ │
│  │  │ Lens Tabs (Sun/Moon/Rising) + Direction Toggle        ││ │
│  │  │ Perspective Content + Narratives                      ││ │
│  │  └───────────────────────────────────────────────────────┘│ │
│  │                                                            │ │
│  │  InDepthGuidance (Susan Miller-style)                      │ │
│  │  SynastryPdfReport (hidden, rendered for print)            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Cusp Engine ─────────────────────────────────────────────┐ │
│  │ resolveSignContext → signVectors → φ-curve blending       │ │
│  │ CuspBlendMap → blended metadata → nuanced harmony scores  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Synastry Preview ────────────────────────────────────────┐ │
│  │ synastryPreview.ts → 7 capabilities                       │ │
│  │ Per-planet extraction, mythic narratives, standout scan   │ │
│  │ Top 5 dynamics, supports, friction, layered prose         │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Draggable Flaps                              │
│  ┌───────────────────────┐  ┌─────────────────────────────────┐│
│  │ Calendar Flap         │  │ Table Flap (SummaryTableTab)    ││
│  │ (Swiss Ephemeris)     │  │ (Element × Season Matrix)       ││
│  └───────────────────────┘  └─────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Styling Architecture

### Main Page Styles: `TropicalSeasonsPage.css` (5,364 lines)

Organized by:
1. **Layout** - Grid, flexbox responsive structure
2. **Header** - Navigation, mode toggles
3. **Wheel Container** - SVG sizing, centering
4. **Panel Styles** - Shared panel base, headers, content
5. **Badge Styles** - Element, modality, season badges
6. **Tooltip Styles** - Hover tooltips
7. **Animation Keyframes** - Pulse, glow, transitions
8. **Responsive Breakpoints** - Mobile/tablet/desktop
9. **Education Panel Styles** - WheelEducationPanel specific
10. **Summary Table Styles** - Seasonal table matrix
11. **Seasonal Resonance Styles** - Mirror panel styling
12. **Home/Challenge Card Styles** - Sign education addition

### Component Styles: `ElementFlowTimeline.css` (395 lines) [NEW]

Dedicated styling for:
- `.element-flow-timeline` - Container
- `.flow-seasons-header` - Season column headers
- `.flow-row` - Element rows with intensity bars
- `.intensity-bar-container` - Bar chart containers
- `.season-imbalance-insight` - Expandable insight panels
- `.flow-narrative` - Expanded element narratives
- `.flow-legend` - Phase legend
- Responsive breakpoints for mobile

---

## Key Design Patterns

### 1. Progressive Disclosure
All educational content uses expandable sections to manage information density:
- Click to expand/collapse individual items
- Clear visual states (collapsed: ▶/+, expanded: ▼/−)
- Smooth transitions for content reveal

### 2. Physics→Psychology Bridge
Ground abstract concepts in physical reality before translating to psychological meaning:
- Environmental Reality lists
- "What was actually happening in nature"
- Causal chains (Why This Way)

### 3. The Mirror Pattern
Personal seasonal readings that validate the user's current experience:
- "Your rhythm is not a flaw. It's a function."
- Home season vs. challenging season
- Lean Into / Release guidance

### 4. Formula Transparency
Show the calculation so users understand WHY:
- Season + Element + Modality = Sign
- Element dormancy patterns
- Seasonal imbalance explanations

---

## Usage Example

```tsx
import TropicalSeasonsPage from './pages/TropicalSeasonsPage';

// Route configuration
<Route path="/tropical-seasons" element={<TropicalSeasonsPage />} />
```

The page is self-contained and manages all internal state. No external props required.

---

## New Components (Phase 6+)

### Cusp Blending Subsystem (`src/zodiac/cusp/`)

**Purpose:** Replace binary sign boundaries with Golden Ratio (φ) weighted blending at cusp windows.

| File | Purpose |
|------|---------|
| `resolveSignContext.ts` | Detects seasonal phase (Begin/Core/End), cusp proximity, hemisphere |
| `signVectors.ts` | 9-dimensional sign vectors, φ-weighted blend interpolation, cusp explanations |
| `useYearWheelRotation.ts` | Year breathing animation hook for the zodiac wheel |
| `index.ts` | Barrel exports |

**Key Formula:** `neighborWeight = ((7 - d) / 7) ^ φ` where φ = 1.618

---

### Planetary Matrices (`src/zodiac/planetaryMatrices.ts`)

**Purpose:** 5-matrix compatibility architecture using all 10 planets.

| Matrix | Planets | Grid | Weight |
|--------|---------|------|--------|
| Core Bond | Sun, Moon, Rising | 3×3 | 45% |
| Chemistry | Venus, Mars | 2×2 | 20% |
| Communication | Mercury (+ Sun, Moon) | 1×2 | 15% |
| Growth | Jupiter, Saturn | 2×2 | 12% |
| Transformation | Uranus, Neptune, Pluto | 3×3 | 8% |

**Key Exports:**
- `buildChemistryMatrix()`, `buildCommunicationMatrix()`, `buildGrowthMatrix()`, `buildTransformationMatrix()`
- `computeFinalCompatibility()` — weighted final score across all available matrices
- `BlendedPlanetPosition` — planet position extended with `seasonContext` and `blendedSign`

---

### Synastry Preview Engine (`src/zodiac/synastryPreview.ts`)

**Purpose:** 7 capabilities for extracting, narrating, and reporting synastry data.

| # | Function | Returns |
|---|----------|---------|
| 1 | `getSynastryPreviewForPlanet()` | All matrix interactions for a planet |
| 2 | `describePlanetAspect()` | Mythic narrative for a planet pair |
| 3 | `generateSynastryReportWithStandouts()` | Layered report with standouts |
| 4 | `layerToParagraph()` | Prose paragraph per matrix layer |
| 5 | `top5Dynamics()` | 5 most extreme dynamics ranked |
| 6 | `whatSupportsRelationship()` | High-harmony standout descriptions |
| 7 | `whereTheWorkLives()` | Low-harmony friction descriptions |

---

### PlanetaryMatrixGrid (`src/components/zodiac/PlanetaryMatrixGrid.tsx`)

**Purpose:** Renders a planetary matrix as an interactive grid with harmony coloring, detail expansion, and highlight support.

**Features:**
- Color-coded cells (green → yellow → red harmony scale)
- Expandable cell details (angle, effort, breakdown, narrative)
- Row/column/cross-highlight with pulse animation
- Key insights section

---

### PlanetSeasonPanel (`src/components/zodiac/PlanetSeasonPanel.tsx`)

**Purpose:** Planet list with seasonal context, grouped by category, with a 5-section detail modal.

**Planet Groups:** Personal / Social / Growth / Transpersonal

**Modal Sections:**
1. Season & Phase
2. Sign Meaning
3. Cusp Blend (conditional)
4. Synastry Preview (clickable rows → matrix highlights)
5. Takeaway

---

### SeasonalWheelWithUI (`src/components/zodiac/SeasonalWheelWithUI.tsx`)

**Purpose:** Container bridging D3 wheel with PlanetSeasonPanel sidebar.

**Features:** Planet indicators on wheel, bidirectional hover bridging, second-person comparison support.

---

### SynastryPdfReport (`src/components/zodiac/SynastryPdfReport.tsx`)

**Purpose:** Print-ready synastry report with 5 prose sections.

**Sections:** Cover, Top 5 Dynamics, Supports, Work, Layer-by-Layer, Footer

**Styling:** Light theme, Georgia serif, `@media print` support.

---

## Refactoring History

| Date | Change | Lines Saved |
|------|--------|-------------|
| Phase 1 | Extracted CSS, constants, SeasonPanel, SignPanel | ~2,000 |
| Phase 2 | Extracted AngleTrainer, SignCompatibilityPanels | ~500 |
| Phase 3 | Extracted TropicalZodiacWheel (D3 rendering) | ~750 |
| Phase 3.5 | Added WheelEducationPanel (Cathedral education) | +1,400 |
| Phase 4 | Seasonal Survival Bible (Mirror system) | +500 |
| Phase 5 | Element × Season Flow system | +900 |
| Phase 5.1 | Split elementFlowConstants.ts from tropicalConstants.ts | Modularization |
| Phase 5.2 | Split ElementFlowTimeline.tsx from WheelEducationPanel.tsx | Modularization |
| Phase 5.3 | Split ElementFlowTimeline.css from TropicalSeasonsPage.css | Modularization |
| Phase 6 | φ-curve cusp blending subsystem (cusp/) | +600 |
| Phase 6.1 | 5-matrix planetary architecture (planetaryMatrices.ts) | +700 |
| Phase 6.2 | Synastry preview engine (synastryPreview.ts) | +700 |
| Phase 6.3 | PlanetSeasonPanel + PlanetaryMatrixGrid components | +1,100 |
| Phase 6.4 | SynastryPdfReport + SeasonalWheelWithUI | +500 |
| Phase 6.5 | Expanded CompatibilityAnalysisPanel (5-matrix UI) | +200 |
| Phase 6.6 | TropicalSeasonsPage outer planet extraction | +20 |

**Current Architecture:** Modular, maintainable, with clear separation of concerns. Full 10-planet support with graceful degradation.

---

## Related Documentation

- [SUSAN_MILLER_TROPICAL_IMPLEMENTATION.md](SUSAN_MILLER_TROPICAL_IMPLEMENTATION.md) - Full implementation guide
- [STUDY_THE_WHEEL_ENHANCED_METAPHORS.md](00_To%20Do/STUDY_THE_WHEEL_ENHANCED_METAPHORS.md) - Educational content spec
- [ELEMENTAL_FLOW_RESEARCH_SUMMARY.md](00_To%20Do/ELEMENTAL_FLOW_RESEARCH_SUMMARY.md) - Element flow research

---

*"Your rhythm is not a flaw. It's a function."*
*"Here's how ALL your planets dance together."*
