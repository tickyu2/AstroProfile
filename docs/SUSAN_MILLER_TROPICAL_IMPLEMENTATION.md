# Susan Miller Tropical Compatibility Implementation

## Complete Architecture for Brother Sonnet

**Built by:** Brother Claude Opus (January 2026)
**Purpose:** Transform compatibility analysis from "astrology explains you" into "astrology teaches you how to LIVE this relationship"

---

## Architecture Overview

```
src/zodiac/
├── tropicalMap.ts          # Core zodiac data (signs, elements, modalities)
├── angles.ts               # Aspect angles (conjunction, sextile, square, etc.)
├── signGuidance.ts         # 12-sign behavioral profiles (core guidance data)
├── guidanceEngine.ts       # Dynamic pair-specific synthesis engine
├── moonRepairScripts.ts    # Moon sign emotional repair strategies
├── risingFriction.ts       # Rising sign social dynamics
├── dialogueSnippets.ts     # What to say / what not to say
└── narrativeEngine.ts      # Perspective reports & synastry matrix

src/components/zodiac/
├── InDepthGuidance.tsx     # Main guidance UI component
├── CompatibilityAnalysisPanel.tsx  # Parent panel integrating everything
├── SynastryGrid.tsx        # 9-way matrix visualization
└── ProfileComparisonModal.tsx      # Side-by-side profile comparison
```

---

## 1. Core Data: signGuidance.ts

### Interface
```typescript
export interface SignGuidance {
  dailyNeeds: string[];           // What they need every day
  appreciationTriggers: string[]; // What makes them feel loved
  stressBehaviors: string[];      // How they act under stress
  repairStrategies: string[];     // How to repair with them
  doNotDo: string[];              // What to never do
  growthPractices: string[];      // Personal growth paths
  loveLanguages: string[];        // Primary love languages
  conflictStyle: string;          // How they handle conflict
  processingSpeed: 'fast' | 'moderate' | 'slow';  // Emotional processing
}
```

### All 12 Signs Implemented
- **Fire Signs:** Aries, Leo, Sagittarius
- **Earth Signs:** Taurus, Virgo, Capricorn
- **Air Signs:** Gemini, Libra, Aquarius
- **Water Signs:** Cancer, Scorpio, Pisces

Each sign has 5+ items per category for rich guidance generation.

---

## 2. Moon Repair Scripts: moonRepairScripts.ts

### Interface
```typescript
export interface MoonRepairScript {
  whenHurt: string[];           // How this Moon sign feels when wounded
  repairApproach: string[];     // How to repair with this Moon sign
  soothingActions: string[];    // Concrete soothing actions
  avoidDuring: string[];        // What to avoid during emotional repair
  recoveryTime: 'quick' | 'moderate' | 'slow';
}
```

### Usage
When Moon signs are provided, the UI shows emotional repair strategies specific to each person's Moon placement.

---

## 3. Rising Friction: risingFriction.ts

### Interface
```typescript
export interface RisingFriction {
  appearsAs: string[];           // How this Rising appears to others
  commonMisread: string[];       // How they're commonly misunderstood
  actuallyNeeds: string[];       // What's behind the mask
  socialStrengths: string[];     // Social gifts
  frictionWith: string[];        // Types they may clash with initially
  bridgeStrategy: string[];      // How to connect past the mask
}
```

### Usage
When Rising signs are provided, the UI shows social dynamics and first impression guidance.

---

## 4. Dialogue Snippets: dialogueSnippets.ts

### Interface
```typescript
export interface DialogueGuidance {
  say: string[];        // Phrases that resonate and heal
  avoid: string[];      // Phrases that trigger and wound
  magic: string;        // The ONE phrase that melts their heart
  danger: string;       // The ONE phrase that destroys trust
}
```

### Helper Functions
```typescript
// Get the most important phrase to say during conflict
export function getRepairPhrase(sign: SignKey): string;

// Get the phrase most likely to escalate conflict
export function getDangerPhrase(sign: SignKey): string;

// Get contextual dialogue suggestions for a pair
export function getPairDialogue(signA: SignKey, signB: SignKey): {
  aToB: { say: string[]; avoid: string[] };
  bToA: { say: string[]; avoid: string[] };
};
```

---

## 5. Guidance Engine: guidanceEngine.ts

### Core Function
```typescript
export function buildPairGuidance(
  signA: SignKey,
  signB: SignKey,
  context: GuidanceContext = 'romance',  // 'romance' | 'friendship' | 'business'
  nameA?: string,
  nameB?: string
): PairGuidance;
```

### Output Structure
```typescript
export interface PairGuidance {
  // Identity
  signA: SignKey;
  signB: SignKey;
  nameA?: string;
  nameB?: string;

  // Core Dynamic
  angleRelationship: AngleLesson | null;  // Aspect between signs
  elementDynamic: string;                  // Fire+Water, Earth+Air, etc.
  modalityDynamic: string;                 // Cardinal+Fixed, etc.

  // Susan Miller-style sections
  whatWorksNaturally: string[];            // Natural strengths
  commonPitfalls: string[];                // Watch out for
  practicalActions: ActionStep[];          // Daily/weekly/monthly actions
  conflictRepairPlan: ConflictRepairStep[]; // 9-step repair protocol
  growthOpportunities: string[];           // Growth potential

  // Deep Dives
  howASeesB: string[];                     // A's perspective of B
  howBSeesA: string[];                     // B's perspective of A
  whatANeedsFromB: string[];               // A's needs
  whatBNeedsFromA: string[];               // B's needs

  // Weekly Ritual
  weeklyRitual: string;                    // Context-specific ritual
}
```

### Action Step Structure
```typescript
export interface ActionStep {
  frequency: 'daily' | 'weekly' | 'monthly' | 'as-needed';
  action: string;   // What to do
  why: string;      // Why it matters
}
```

### 9-Step Conflict Repair Plan
```typescript
export interface ConflictRepairStep {
  step: number;
  action: string;
  forWhom: 'A' | 'B' | 'both';
}
```

Generated steps:
1. Pause and separate before escalation (both)
2. Processing time for A (based on A's processingSpeed)
3. Processing time for B (based on B's processingSpeed)
4. B acknowledges A's core need
5. A acknowledges B's core need
6. Apply repair strategy for A
7. Apply repair strategy for B
8. Reconnect physically and verbally (both)
9. Schedule follow-up check-in (both)

---

## 6. Element & Modality Dynamics

### Element Combinations
| Pair | Dynamic | Strength | Challenge |
|------|---------|----------|-----------|
| Fire-Fire | Double Fire | Mutual enthusiasm, adventure | Competition, temper clashes |
| Fire-Earth | Visionary meets Builder | Dreams become reality | Fire feels slowed, Earth pressured |
| Fire-Air | Natural allies | Air fuels Fire, Fire gives direction | Burns too bright too fast |
| Fire-Water | Steam or extinguishment | Passion meets depth | Fire dampened, Water overwhelmed |
| Earth-Earth | Solid, stable | Shared values around security | Can become too routine |
| Earth-Air | Practical meets Conceptual | Ideas + Implementation | Air feels restricted |
| Earth-Water | Nurturing practicality | Stable emotional support | Can become insular |
| Air-Air | Mental connection | Intellectual stimulation | May avoid emotional depth |
| Air-Water | Mind meets Heart | Balance of logic and intuition | Air intellectualizes |
| Water-Water | Deep emotional ocean | Profound empathy | Can drown in emotions |

### Modality Combinations
| Pair | Dynamic | Workflow |
|------|---------|----------|
| Cardinal-Cardinal | Power struggles | Take turns leading |
| Cardinal-Fixed | Complementary | Cardinal starts, Fixed sustains |
| Cardinal-Mutable | Flexible | Cardinal sets direction, Mutable adapts |
| Fixed-Fixed | Deep commitment or standoffs | Choose battles wisely |
| Fixed-Mutable | Stability + flexibility | Fixed anchors, Mutable helps adapt |
| Mutable-Mutable | Adaptable but may drift | Create structure together |

---

## 7. UI Component: InDepthGuidance.tsx

### Props
```typescript
interface InDepthGuidanceProps {
  signA: SignKey;           // Required: Sun sign of person A
  signB: SignKey;           // Required: Sun sign of person B
  moonA?: SignKey;          // Optional: Moon sign of A
  moonB?: SignKey;          // Optional: Moon sign of B
  risingA?: SignKey;        // Optional: Rising sign of A
  risingB?: SignKey;        // Optional: Rising sign of B
  nameA?: string;           // Optional: Display name for A
  nameB?: string;           // Optional: Display name for B
  context?: GuidanceContext; // Optional: 'romance' | 'friendship' | 'business'
}
```

### Expandable Sections
1. **What Works Naturally** (positive) - Always shown
2. **Common Pitfalls** (warning) - Always shown
3. **Practical Actions** (action) - Daily/Weekly/Monthly/As-needed
4. **9-Step Conflict Repair Plan** (repair) - Personalized steps
5. **Growth Opportunities** (growth) - Growth paths
6. **How A Sees B / How B Sees A** (perspective) - Dual perspective
7. **What A Needs / What B Needs** (needs) - Core needs
8. **Weekly Ritual** (ritual) - Context-specific
9. **Emotional Repair Scripts** (moon) - If Moon signs provided
10. **Social Dynamics** (rising) - If Rising signs provided
11. **What to Say & Avoid** (dialogue) - Always shown

### Section Color Coding
| Type | Background | Header | Title Color |
|------|------------|--------|-------------|
| positive | green | green | #4ade80 |
| warning | yellow | yellow | #fbbf24 |
| action | blue | blue | #60a5fa |
| repair | purple | purple | #a78bfa |
| growth | green | green | #4ade80 |
| perspective | indigo | indigo | #818cf8 |
| needs | pink | pink | #f472b6 |
| ritual | teal | teal | #2dd4bf |
| moon | light blue | light blue | #93c5fd |
| rising | orange | orange | #fb923c |
| dialogue | cyan | cyan | #22d3ee |

---

## 8. Integration: CompatibilityAnalysisPanel.tsx

```tsx
{/* In-Depth Guidance - Susan Miller-style actionable advice */}
{profileA.sunSign && profileB.sunSign && (
  <InDepthGuidance
    signA={profileA.sunSign as SignKey}
    signB={profileB.sunSign as SignKey}
    moonA={profileA.moonSign as SignKey}
    moonB={profileB.moonSign as SignKey}
    risingA={profileA.risingSign as SignKey}
    risingB={profileB.risingSign as SignKey}
    nameA={profileA.name}
    nameB={profileB.name}
    context={activeContext}  // 'romance' | 'business' | 'friendship'
  />
)}
```

---

## 9. Context-Aware Features

### Romance Context
- Weekly rituals focus on date nights, appreciation, physical connection
- Love languages integrated into ritual suggestions
- Emotional repair prioritized

### Business Context
- Weekly rituals focus on planning sessions, strategy alignment
- Element perspectives framed as business strengths
- Practical collaboration emphasized

### Friendship Context
- Weekly rituals focus on catch-up time, shared activities
- Appreciation triggers highlighted
- Lower-stakes framing

---

## 10. Extension Points

### Adding New Signs (if Ophiuchus ever added)
1. Add to `tropicalMap.ts` SignKey type
2. Add entry to `SIGN_GUIDANCE` in `signGuidance.ts`
3. Add entry to `MOON_REPAIR` in `moonRepairScripts.ts`
4. Add entry to `RISING_FRICTION` in `risingFriction.ts`
5. Add entry to `DIALOGUE_SNIPPETS` in `dialogueSnippets.ts`

### Adding New Context Types
1. Add to `GuidanceContext` type in `guidanceEngine.ts`
2. Add ritual generation logic in `generateWeeklyRitual()`
3. Adjust action language as needed

### Adding New Guidance Sections
1. Add new type to `GuidanceSectionProps.type` union
2. Add CSS styles for new type
3. Add section to expandAll array
4. Create section JSX in component

---

## 11. File Locations Summary

| File | Path | Purpose |
|------|------|---------|
| signGuidance.ts | src/zodiac/ | 12-sign behavioral profiles |
| guidanceEngine.ts | src/zodiac/ | Pair synthesis engine |
| moonRepairScripts.ts | src/zodiac/ | Moon emotional repair |
| risingFriction.ts | src/zodiac/ | Rising social dynamics |
| dialogueSnippets.ts | src/zodiac/ | What to say/avoid |
| InDepthGuidance.tsx | src/components/zodiac/ | Main UI component |
| CompatibilityAnalysisPanel.tsx | src/components/zodiac/ | Parent integration |

---

## 12. Testing the Implementation

1. Navigate to Tropical Seasons page
2. Select two profiles for comparison
3. Click "Compare" to open compatibility panel
4. Scroll down to "In-Depth Guidance" section
5. Expand sections to see:
   - Pair-specific guidance based on Sun signs
   - Emotional repair scripts (if Moon signs available)
   - Social dynamics (if Rising signs available)
   - Dialogue snippets with magic/danger phrases

---

## 13. Key Principles

1. **Actionable over Abstract**: Every section gives concrete actions
2. **Bidirectional**: Always show both perspectives (A→B and B→A)
3. **Context-Aware**: Romance/Business/Friendship changes language
4. **Layered Depth**: Sun always, Moon/Rising when available
5. **Repair-Focused**: Not just compatibility scores, but HOW to work through issues
6. **Susan Miller Style**: Specific examples, weekly rituals, magic phrases

---

## 14. Seasonality Guidance System (NEW)

### Overview
A Khan Academy-style learning experience showing how each birth sign experiences all 12 seasonal subdivisions throughout the year.

**Input:** User's birth date + Today's date
**Output:** 12-section step-through lesson with personalized guidance

### Architecture
```
src/zodiac/
└── tropicalCalendar.ts     # Extended calendar with season phases

src/academy/
├── index.ts                # Module exports
├── seasonalityGuidance.ts  # 12-section guidance engine
└── components/
    └── SeasonalityLesson.tsx  # Khan Academy-style UI
```

### Key Concepts

**Season Phases:**
| Phase | Modality | Energy |
|-------|----------|--------|
| begin | Cardinal | The Spark - initiation |
| core  | Fixed | The Fuel - sustainment |
| end   | Mutable | The Smoke - transition |

**12 Seasonal Slots:**
1. Spring Begin (Aries) - Mar 21 - Apr 19
2. Spring Core (Taurus) - Apr 20 - May 20
3. Spring End (Gemini) - May 21 - Jun 20
4. Summer Begin (Cancer) - Jun 21 - Jul 22
5. Summer Core (Leo) - Jul 23 - Aug 22
6. Summer End (Virgo) - Aug 23 - Sep 22
7. Autumn Begin (Libra) - Sep 23 - Oct 22
8. Autumn Core (Scorpio) - Oct 23 - Nov 21
9. Autumn End (Sagittarius) - Nov 22 - Dec 21
10. Winter Begin (Capricorn) - Dec 22 - Jan 19
11. Winter Core (Aquarius) - Jan 20 - Feb 18
12. Winter End (Pisces) - Feb 19 - Mar 20

### Guidance Generation

Each section provides:
- **How You Feel**: Element + Modality resonance with current season
- **What To Do**: Practical actions for this period
- **Watch Out For**: Pitfalls based on sign's relationship to current energy
- **Aspect Geometry**: The "why" layer explaining geometric relationships
- **Affirmation**: Mantra for the period
- **Resonance Score**: 0-100% based on element/modality alignment

### Aspect Geometry - The "Why" Layer

Each chamber includes geometric teaching that explains WHY it feels the way it does:

| Aspect | Degrees | Felt Experience |
|--------|---------|-----------------|
| Conjunction | 0° | Your own sign - concentrated, familiar, self-reinforcing |
| Semi-sextile | 30° | Adjacent shift - close but different language |
| Sextile | 60° | Supportive angle - opportunities if you engage |
| Square | 90° | Friction angle - growth through creative tension |
| Trine | 120° | Harmonious angle - natural flow, same element |
| Quincunx | 150° | Awkward fit - constant adjustment without resolution |
| Opposition | 180° | Mirror polarity - your opposite, greatest teacher |

**Three-Part Teaching:**
1. **The Felt Sense**: Why this chamber feels easy/hard for your sign
2. **The Structural Reason**: The geometric explanation (element/modality mechanics)
3. **Conscious Use**: How to work with this aspect intentionally

**Example - Taurus in Scorpio (Autumn Core):**
> "Scorpio season is your mirror — the polarity that reflects what you naturally avoid. Your opposite sign contains what you lack. This creates magnetic tension: attraction and resistance."
>
> "At 180° separation, signs are direct polarities — complementary pairs that complete each other. Same modality, compatible elements, but approaching from opposite directions."
>
> "Your opposite season is your greatest teacher. What irritates you about this energy is often what you need to develop. Stop projecting — start integrating."

### Special Cases

**Birth Season:** When in your own sign's season (e.g., Taurus during Taurus season), guidance emphasizes your natural power and birthday intentions.

**Opposite Season:** When in your opposite sign's season (e.g., Taurus during Scorpio season), guidance acknowledges the tension and growth opportunity with specific "mirror" insights.

### Usage

```tsx
import { SeasonalityLesson } from '../academy';

// In a component:
<SeasonalityLesson
  birthDate={new Date('1983-07-06')}
  todayDate={new Date()}
  onClose={() => setShowLesson(false)}
/>
```

### API Functions

```typescript
// Full 12-section report
const report = buildSeasonalityReport(birthDate, todayDate);

// Just the current section
const current = getCurrentSeasonGuidance(birthDate);

// Explore any sign in any slot
const guidance = getSignInSlotGuidance('Taurus', 7); // Taurus in Scorpio
```

---

## 15. Synastry Matrix Scoring Theory (NEW)

### Overview

The Synastry Matrix visualizes all 9 possible combinations between two people's Sun, Moon, and Rising signs. Each cell shows two scores:
- **Effort (1-10)**: How much work this aspect requires
- **Harmony (1-10)**: How naturally easy this aspect flows

These scores are inverse: **Harmony = 11 - Effort**

### Architecture

```
src/zodiac/
└── narrativeEngine.ts      # Core scoring calculations (calculateEffortScore)

src/components/zodiac/
├── SynastryGrid.tsx        # Matrix visualization + score breakdown
└── ScoringTheoryFlap.tsx   # Comprehensive theory explanation (NEW)
```

### The Scoring Formula

```
Effort = clamp(1, 10, round(Base + AngleAdj + ElementAdj + ModalityAdj))
Harmony = 11 - Effort
```

**Clamp Function:**
```typescript
clamp(min, max, value) → constrains value to [min, max] range
clamp(1, 10, 0) → 1   // floors at minimum
clamp(1, 10, 5) → 5   // passes through
clamp(1, 10, 12) → 10 // caps at maximum
```

### Step 1: Base Score

Every calculation starts with a neutral baseline:
```
Base = 5 (neutral starting point)
```

### Step 2: Angle Adjustments

The geometric aspect between signs determines the primary adjustment:

| Aspect | Symbol | Degrees | Adjustment | Reason |
|--------|--------|---------|------------|--------|
| Conjunction | ☌ | 0° | -1 | Merged energy, intensity |
| Semi-sextile | ⚺ | 30° | 0 | Adjacent signs, subtle friction |
| Sextile | ⚹ | 60° | -1.5 | Friendly elements, opportunity |
| Square | □ | 90° | +2 | 90° tension, growth catalyst |
| Trine | △ | 120° | -2 | Same element, natural flow |
| Quincunx | ⚻ | 150° | +2.5 | Awkward fit, constant adjustment |
| Opposition | ☍ | 180° | +1.5 | 180° polarity, mirror effect |

**Negative = Less Effort = More Harmony**
**Positive = More Effort = Less Harmony**

### Step 3: Element Adjustments

Element compatibility provides secondary adjustment:

| Element Pair | Adjustment | Reason |
|--------------|------------|--------|
| Same Element | -1 | Natural understanding (Fire-Fire, etc.) |
| Fire + Water | +1 | Steam or extinguishment |
| Earth + Air | +0.5 | Grounding vs freedom tension |
| Fire + Air | 0 | Natural allies |
| Earth + Water | 0 | Nurturing stability |
| Fire + Earth | 0 | Visionary meets builder |
| Air + Water | 0 | Mind meets heart |

### Step 4: Modality Adjustments

Modality compatibility provides tertiary adjustment:

| Modality Pair | Adjustment | Reason |
|---------------|------------|--------|
| Both Fixed | +1 | Stubborn standoffs possible |
| Fixed + Cardinal | 0 | Complementary (starter + sustainer) |
| Fixed + Mutable | 0 | Stability + flexibility |
| Both Cardinal | 0 | Power struggles but manageable |
| Both Mutable | 0 | Adaptable together |
| Cardinal + Mutable | 0 | Direction + adaptation |

### Worked Examples

#### Example 1: Taurus ⚻ Libra (Quincunx)

```
Step 1: Base                    = 5
Step 2: Angle (quincunx +2.5)   = 5 + 2.5 = 7.5
Step 3: Element (Earth + Air)   = 7.5 + 0.5 = 8.0
Step 4: Modality (Fixed + Card) = 8.0 + 0 = 8.0

Effort = clamp(1, 10, round(8.0)) = 8
Harmony = 11 - 8 = 3

Result: Effort 8/10, Harmony 3/10
```

#### Example 2: Taurus □ Aquarius (Square)

```
Step 1: Base                    = 5
Step 2: Angle (square +2)       = 5 + 2 = 7
Step 3: Element (Earth + Air)   = 7 + 0.5 = 7.5
Step 4: Modality (Fixed + Fixed)= 7.5 + 1 = 8.5

Effort = clamp(1, 10, round(8.5)) = 9
Harmony = 11 - 9 = 2

Result: Effort 9/10, Harmony 2/10
```

#### Example 3: Aries △ Leo (Trine)

```
Step 1: Base                    = 5
Step 2: Angle (trine -2)        = 5 - 2 = 3
Step 3: Element (Fire + Fire)   = 3 - 1 = 2
Step 4: Modality (Card + Fixed) = 2 + 0 = 2

Effort = clamp(1, 10, round(2)) = 2
Harmony = 11 - 2 = 9

Result: Effort 2/10, Harmony 9/10
```

#### Example 4: Cancer □ Aries (Square)

```
Step 1: Base                    = 5
Step 2: Angle (square +2)       = 5 + 2 = 7
Step 3: Element (Water + Fire)  = 7 + 1 = 8
Step 4: Modality (Card + Card)  = 8 + 0 = 8

Effort = clamp(1, 10, round(8)) = 8
Harmony = 11 - 8 = 3

Result: Effort 8/10, Harmony 3/10
```

### UI Components

#### SynastryGrid.tsx - Matrix with Score Breakdown

The 3×3 matrix shows:
- Sun-Sun, Sun-Moon, Sun-Rising (Row 1)
- Moon-Sun, Moon-Moon, Moon-Rising (Row 2)
- Rising-Sun, Rising-Moon, Rising-Rising (Row 3)

Hovering on any cell shows the calculation breakdown:
```
Base Score: 5
Angle (trine): -2
Element (Fire + Fire): -1
Modality (Cardinal + Fixed): 0
---
Final Effort: 2
Final Harmony: 9
```

#### ScoringTheoryFlap.tsx - Theory Reference

Accessible via "📐 Scoring Theory" button, provides:
1. **Overview** - Quick summary of the formula
2. **Step 1: Angles** - All 7 aspects with symbols and explanations
3. **Step 2: Elements** - Element combination effects
4. **Step 3: Modality** - Modality combination effects
5. **Step 4: Calculation** - Clamp function explanation
6. **Examples** - 4 fully worked examples

### Score Interpretation Guide

| Harmony Score | Interpretation |
|---------------|----------------|
| 9-10 | Effortless flow, natural understanding |
| 7-8 | Generally easy, minor adjustments |
| 5-6 | Balanced, requires conscious effort |
| 3-4 | Challenging, growth through friction |
| 1-2 | Significant work needed, maximum growth potential |

**Important:** Low harmony doesn't mean bad compatibility. Squares and quincunxes create the friction that drives personal growth and keeps relationships dynamic.

### Code Reference

Core scoring calculation in [narrativeEngine.ts:210-230](src/zodiac/narrativeEngine.ts#L210-L230):
```typescript
function calculateEffortScore(
  angle: string,
  fromElement: string,
  toElement: string,
  fromModality: string,
  toModality: string
): number {
  let score = 5; // baseline

  // Angle adjustments
  const angleMap: Record<string, number> = {
    'trine': -2,
    'sextile': -1.5,
    'conjunction': -1,
    'semi-sextile': 0,
    'square': 2,
    'opposition': 1.5,
    'quincunx': 2.5,
  };
  score += angleMap[angle] ?? 0;

  // Element adjustments
  if (fromElement === toElement) score -= 1;
  else if (
    (fromElement === 'Fire' && toElement === 'Water') ||
    (fromElement === 'Water' && toElement === 'Fire')
  ) score += 1;
  else if (
    (fromElement === 'Earth' && toElement === 'Air') ||
    (fromElement === 'Air' && toElement === 'Earth')
  ) score += 0.5;

  // Modality adjustments
  if (fromModality === 'Fixed' && toModality === 'Fixed') score += 1;

  return Math.max(1, Math.min(10, Math.round(score)));
}
```

---

## 16. Swiss Ephemeris Integration (NEW)

### Seasonal Ingress Calendar

Precision astronomical calculations for exact seasonal entry dates using Swiss Ephemeris data.

**Access:** Calendar flap on Tropical Seasons page shows exact ingress times.

| Event | Description |
|-------|-------------|
| Spring Equinox | Sun enters Aries (0° longitude) |
| Summer Solstice | Sun enters Cancer (90° longitude) |
| Autumn Equinox | Sun enters Libra (180° longitude) |
| Winter Solstice | Sun enters Capricorn (270° longitude) |

---

## 17. Profile Comparison Modal (NEW)

### Draggable Floating Panel

The Profile Comparison modal can be positioned anywhere on screen for reference while viewing other content.

**Features:**
- Drag handle (⋮⋮) in header for repositioning
- Stays within viewport bounds
- Displays: Birth Date, Day of Week, Age, Moon Phase, Dominant Element, Season, Season Position, Sun/Moon/Rising signs

**Location:** [ProfileComparisonModal.tsx](src/components/zodiac/ProfileComparisonModal.tsx)

---

## 18. Study the Wheel - Cathedral-Level Education System (NEW)

### Overview

The "Study the Wheel" feature transforms zodiac education from encyclopedic reference into soul-level understanding. Built with progressive disclosure and Cathedral-level depth, it answers the essential question: *"How does this relate to ME?"*

**Philosophy:** Not just WHAT each component is, but HOW it relates to you, how you FEEL it, how you EXPRESS it, and how you can USE this knowledge.

### Architecture

```
src/data/
└── tropicalConstants.ts    # Enhanced educational data interfaces

src/components/zodiac/
└── WheelEducationPanel.tsx # 5-tab Cathedral UI with progressive disclosure

src/pages/
└── TropicalSeasonsPage.css # ~350 lines of Cathedral styling (lines 4073-4628)
```

### Enhanced Data Interfaces

#### WheelLayerData (Layer Education)
```typescript
export interface WheelLayerData {
  name: string;
  description: string;
  color: string;
  icon: string;
  realLifeQuestion: string;    // Question this layer answers
  howItRelates: string;        // NEW: Personal connection
  howToUse: string;            // NEW: Practical application
}
```

**Example - Signs Layer:**
```typescript
{
  name: 'Signs',
  description: 'The 12 zodiac signs based on tropical seasons',
  color: 'hsl(260, 70%, 50%)',
  icon: '♈',
  realLifeQuestion: 'What basic energy am I working with?',
  howItRelates: 'Your Sun sign is like your psychological "operating system" - it shapes how you naturally approach life, what feels authentic to you, and what kind of experiences fulfill you.',
  howToUse: 'When making decisions, ask yourself: "Does this align with my core nature?" For example, a Capricorn should ask if a choice builds something lasting.'
}
```

#### SeasonWisdomData (Season Education)
```typescript
export interface SeasonWisdomData {
  name: string;
  meaning: string;
  element: string;
  survivalImperative: string;    // Ancestral survival pattern
  psychologicalImprint: string;  // How it shapes psyche
  howItRelates: string;          // NEW: Personal connection
  howToUse: string;              // NEW: Practical application
  environmentalReality: string[]; // NEW: What was actually happening
  threeActStructure: {           // NEW: Beginning→Core→Transition
    beginning: string;           // Cardinal phase
    core: string;                // Fixed phase
    transition: string;          // Mutable phase
  };
}
```

**Example - Winter:**
```typescript
{
  name: 'Winter',
  meaning: 'Consolidation • Strategy • Essential Nature',
  element: 'Earth',
  survivalImperative: 'Survive the scarcity. Every choice matters - energy conservation is survival.',
  psychologicalImprint: 'Long-term thinking, strategic planning, and understanding that true wealth is what remains when excess is stripped away.',
  howItRelates: 'If you were born in winter, you may have an innate sense of resource management - knowing instinctively that not everything can be pursued at once.',
  howToUse: 'During challenging times, channel winter wisdom: What is truly essential? What can be let go? Winter people often thrive as strategists and advisors.',
  environmentalReality: [
    'Shortest days, longest nights',
    'Snow covers the landscape, muffling sound',
    'Animals hibernate or have migrated',
    'Food comes from preserved stores',
    'Community gathers for warmth and story'
  ],
  threeActStructure: {
    beginning: 'Capricorn (Cardinal) - The longest night passes. What remains after solstice is proven. Build from what survived.',
    core: 'Aquarius (Fixed) - Community is survival. Individual genius serves the group. Ideas are the seeds of spring.',
    transition: 'Pisces (Mutable) - The ice begins to melt. Dreams of what could be. The boundary between worlds thins.'
  }
}
```

#### ElementEducationData (Element Education)
```typescript
export interface ElementEducationData {
  name: string;
  emoji: string;
  description: string;
  drive: string;
  relationship: string;
  theDrive: string;             // NEW: Core motivation
  thePhysics: string;           // NEW: Physical reality
  thePsychology: string;        // NEW: Psychological translation
  sunsetResponse: string;       // NEW: Revealing moment
  bottomLine: string;           // NEW: Essential truth
  inRelationships: string;      // NEW: Relationship pattern
  modalityExpressions: {
    cardinal: {
      sign: string;
      role: string;
      image: string;            // NEW: Evocative metaphor
      description: string;
    };
    fixed: {...};
    mutable: {...};
  };
}
```

**Example - Fire Element:**
```typescript
{
  name: 'Fire',
  emoji: '🔥',
  theDrive: 'To ACT. To exist is to express. Passivity feels like death.',
  thePhysics: 'Fire transforms matter into light and heat. It cannot be contained without dying. It spreads by contact.',
  thePsychology: 'Fire signs experience their identity through ACTION. They know who they are by what they DO. Waiting feels like not existing.',
  sunsetResponse: 'Fire signs don\'t just watch sunsets - they feel called to DO something with the beauty: photograph it, share it, chase it.',
  bottomLine: 'Fire asks: "What am I DOING about this?" Action is identity.',
  inRelationships: 'Fire brings passion and initiative but may exhaust partners who need stillness.',
  modalityExpressions: {
    cardinal: { sign: 'Aries', role: 'The Match Strike', image: '🔥→', description: 'First spark. Raw ignition. "I exist, therefore I act."' },
    fixed: { sign: 'Leo', role: 'The Hearth', image: '🔥●', description: 'Sustained flame. Creative center. "I shine, therefore I am seen."' },
    mutable: { sign: 'Sagittarius', role: 'The Torch', image: '🔥↗', description: 'Spreading fire. Teaching flame. "I explore, therefore I grow."' }
  }
}
```

#### ModalityEducationData (Modality Education)
```typescript
export interface ModalityEducationData {
  name: string;
  emoji: string;
  description: string;
  energy: string;
  role: string;
  strengths: string[];
  challenges: string[];
  metaphor: string;          // NEW: Core metaphor
  howYouMove: string;        // NEW: Movement pattern
  realLifeExample: string;   // NEW: Practical scenario
  inRelationships: string;   // NEW: Relationship pattern
  theShadow: string;         // NEW: Growth edge
  dayRange: string;          // NEW: Seasonal position
}
```

**Example - Cardinal:**
```typescript
{
  name: 'Cardinal',
  emoji: '▶️',
  metaphor: 'The Spark that Ignites',
  howYouMove: 'You initiate. When something needs to start, you\'re the one who takes the first step. Waiting for others to begin feels painful.',
  realLifeExample: 'At a party where no one is talking, you\'re the one who breaks the ice. In a meeting, you propose the idea first.',
  inRelationships: 'You bring energy and direction, but partners may feel pushed or that their pace isn\'t respected.',
  theShadow: 'Starting without finishing. Enthusiasm that fades once the "new" wears off.',
  dayRange: 'Days 1-30 of each season (Equinox/Solstice → Peak of season)'
}
```

#### SignSeasonalData (Full Constitutional Profile)
```typescript
export interface SignSeasonalData {
  sign: string;
  dateRange: string;
  seasonalPhase: string;
  psychologicalImprint: string;
  survivalWisdom: string;
  // NEW: Cathedral-level additions
  bornAt: string;                  // Environmental moment
  environmentalReality: string[];  // Physical conditions at birth
  whyThisWay: string[];            // Causal chain explanation
  theFormula: {                    // Transparent calculation
    season: string;
    element: string;
    modality: string;
    result: string;
  };
  atBest: string[];                // Positive expression
  underStress: string[];           // Shadow expression
  needs: string[];                 // Core requirements
  fears: string[];                 // Core anxieties
  inRelationships: string;         // Relationship pattern
  careerStrengths: string[];       // Professional gifts
  theShadow: string;               // Growth edge summary
}
```

**Example - Aries (Spring Cardinal Fire):**
```typescript
{
  sign: 'Aries',
  bornAt: 'The moment winter breaks. First warmth after months of cold.',
  environmentalReality: [
    'Snow melts, revealing bare earth',
    'First green shoots push through soil',
    'Animals emerge from hibernation',
    'Days finally longer than nights',
    'Urgent energy after long stillness'
  ],
  psychologicalImprint: 'I am the force that breaks through. When things are stuck, I move first.',
  whyThisWay: [
    'After months of conservation, action returns',
    'The first to move gets the resources',
    'Hesitation means missing the window',
    'Spring rewards boldness, not caution'
  ],
  theFormula: {
    season: 'Spring (New beginning, fresh energy)',
    element: 'Fire (Action, will, identity)',
    modality: 'Cardinal (Initiating, starting)',
    result: 'The Pioneer - First to act, first to arrive, first to try'
  },
  atBest: ['Courageous initiator', 'Honest and direct', 'Protective of the vulnerable', 'Refreshingly simple'],
  underStress: ['Impulsive decisions', 'Anger flares quickly', 'Abandons half-finished projects', 'Bulldozes others\' feelings'],
  needs: ['Freedom to act', 'Direct communication', 'Physical outlets', 'Fresh challenges'],
  fears: ['Being controlled', 'Stagnation', 'Appearing weak', 'Missing opportunities'],
  inRelationships: 'Brings passion and protection but may struggle with patience and others\' slower rhythms.',
  careerStrengths: ['Entrepreneurship', 'Emergency response', 'Sales', 'Athletics', 'Military/first responder'],
  theShadow: 'Learning that not everything requires combat. Some things grow in stillness.'
}
```

### UI Component: WheelEducationPanel.tsx

#### 5-Tab Structure
1. **Overview Tab** - The 4 layers (Signs, Houses, Aspects, Transits) with expandable "How It Relates" sections
2. **Seasons Tab** - 4 seasons with environmental reality lists and Three Act Structure
3. **Elements Tab** - 4 elements with Physics→Psychology panels and Sunset Response
4. **Modalities Tab** - 3 modalities with metaphors and real-life examples
5. **Signs Tab** - 12 signs with full constitutional profiles (8 expandable accordion sections)

#### Progressive Disclosure Pattern
All tabs use expandable sections to manage information density:
- Click to expand/collapse individual items
- Clear visual states (collapsed: ▶, expanded: ▼)
- Smooth transitions for content reveal

#### Signs Tab - 8 Expandable Sections
```typescript
const [expandedSection, setExpandedSection] = useState<string | null>(null);

const sections = [
  { key: 'environmental', label: 'Environmental Reality', icon: '🌍' },
  { key: 'formula', label: 'The Formula', icon: '⚗️' },
  { key: 'whyThisWay', label: 'Why This Way?', icon: '🔗' },
  { key: 'atBest', label: 'At Best / Under Stress', icon: '⚖️' },
  { key: 'needs', label: 'Needs & Fears', icon: '💎' },
  { key: 'relationships', label: 'In Relationships', icon: '💑' },
  { key: 'career', label: 'Career Strengths', icon: '💼' },
  { key: 'shadow', label: 'The Shadow', icon: '🌑' }
];
```

### CSS Architecture (TropicalSeasonsPage.css)

#### New Class Patterns
```css
/* Layer Education */
.layer-expanded { /* Expanded state for layer cards */ }
.layer-how-it-relates { /* Personal connection section */ }
.layer-how-to-use { /* Practical application section */ }

/* Season Education */
.season-environmental-reality { /* Environmental list styling */ }
.season-three-act { /* Three Act Structure container */ }
.three-act-phase { /* Individual phase styling */ }

/* Element Education */
.element-physics-psychology { /* Physics→Psychology panel */ }
.element-sunset-response { /* Sunset response callout */ }
.element-bottom-line { /* Essential truth callout */ }

/* Modality Education */
.modality-metaphor-box { /* Central metaphor container */ }
.modality-real-life { /* Real-life example section */ }
.modality-shadow-warning { /* Shadow awareness callout */ }

/* Sign Constitutional Profile */
.sign-sections-accordion { /* Accordion container */ }
.sign-section-header { /* Clickable section header */ }
.sign-section-content { /* Expandable content area */ }
.sign-formula-box { /* Formula visualization */ }
.sign-traits-grid { /* At Best / Under Stress grid */ }
.sign-career-chips { /* Career strength tags */ }
.sign-shadow-text { /* Shadow awareness styling */ }
```

### Design Principles

1. **5W+H+Emotion+Soul**: Every element answers What, Why, When, Where, Who, How, plus emotional resonance and soul-level meaning

2. **Physics→Psychology Bridge**: Ground abstract concepts in physical reality before translating to psychological meaning

3. **Formula Transparency**: Show the calculation (Season + Element + Modality = Sign) so users understand WHY

4. **Environmental Grounding**: What was ACTUALLY happening in nature when you were born?

5. **Practical Application**: Always answer "How can I USE this information?"

6. **Shadow Integration**: Include growth edges and challenges, not just positive traits

### Usage

The WheelEducationPanel appears in the TropicalSeasonsPage sidebar when the "Study" tab is selected:

```tsx
{activeView === 'study' && (
  <WheelEducationPanel
    userSign={userSunSign}
    onClose={() => setActiveView('wheel')}
  />
)}
```

### Reference Document

Full content specifications: [STUDY_THE_WHEEL_ENHANCED_METAPHORS.md](docs/00_To_Do/STUDY_THE_WHEEL_ENHANCED_METAPHORS.md)

---

## 19. Phase 3 Refactoring Summary (NEW)

### Key Improvements

1. **Table Flap Display Fix**
   - Fixed empty table issue in comparison modal
   - Resolved floating "FIXED Core" badge positioning
   - Implemented sticky header with scrollable body

2. **Progressive Disclosure Pattern**
   - All educational tabs use expandable sections
   - Reduced cognitive overload while maintaining depth
   - Smooth animations for content reveal

3. **Cathedral-Level Content**
   - Enhanced all data interfaces with rich educational content
   - Added ~350 lines of specialized CSS styling
   - Implemented Physics→Psychology bridges throughout

4. **Formula Transparency**
   - Users can now see exactly how Season + Element + Modality = Sign
   - Environmental reality lists ground abstract concepts
   - "Why This Way" explanations provide causal understanding

---

## 20. Seasonal Survival Bible - The Mirror (NEW)

### Overview

The Seasonal Survival Bible transforms the zodiac from a personality typing system into **ecological literacy**—understanding that every season requires different kinds of strength, and no one is strong all year.

**Philosophy:** "Your rhythm is not a flaw. It's a function."

### Core Concept: Seasonal Resonance

Every sign has:
- **Home Season**: Where their nervous system feels supported
- **Challenging Season**: Where they operate outside their natural rhythm

```
Spring-born (Aries, Taurus, Gemini) → Home: Spring, Challenge: Winter
Summer-born (Cancer, Leo, Virgo) → Home: Summer, Challenge: Winter
Autumn-born (Libra, Scorpio, Sagittarius) → Home: Autumn, Challenge: Spring
Winter-born (Capricorn, Aquarius, Pisces) → Home: Winter, Challenge: Summer
```

### Architecture

```
src/data/tropicalConstants.ts
├── SEASONAL_PROFILE                    # Canonical home/challenge mapping
├── getSeasonalResonance()              # Aligned/Neutral/Challenged logic
├── getCurrentSeason()                  # Date-to-season calculation
├── getSignSeason()                     # Sign-to-natal-season lookup
├── SEASONAL_RESONANCE_NARRATIVES       # 4×4 matrix of validating narratives
├── generateSeasonalAppreciation()      # Compatibility appreciation statements
├── getPodLeadershipGuidance()          # Pod/family leadership rotation
└── getSeasonalMirrorReading()          # Complete mirror reading for one user

src/components/zodiac/WheelEducationPanel.tsx
├── SeasonalResonancePanel              # The Mirror UI
└── HomeChallengeCard                   # Sign education addition
```

### Data Structure: SEASONAL_PROFILE

```typescript
export const SEASONAL_PROFILE: Record<string, { home: Season; challenge: Season }> = {
  Aries: { home: 'Spring', challenge: 'Winter' },
  Taurus: { home: 'Spring', challenge: 'Winter' },
  // ... all 12 signs
};
```

### Data Structure: SEASONAL_RESONANCE_NARRATIVES

A 4×4 matrix providing validating narratives for every natal season × current season combination:

```typescript
export interface SeasonalResonanceNarrative {
  state: ResonanceState;              // 'Aligned' | 'Neutral' | 'Challenged'
  icon: string;                       // Season emoji
  color: string;                      // State color
  title: string;                      // "Your Home Season" / "Opposite Season" etc.
  validation: string;                 // The validating explanation
  guidance: {
    leanInto: string[];               // What to embrace now
    release: string[];                // What to let go of now
  };
}
```

**Example - Taurus in Winter (Challenged):**
```typescript
{
  state: 'Challenged',
  icon: '❄️',
  color: '#94a3b8',
  title: 'Your Challenging Season',
  validation: 'Winter asks for patience without visible progress—the hardest thing for spring energy. You were built to grow, not to endure. This season may feel like waiting without building. The discomfort is natural, not a flaw.',
  guidance: {
    leanInto: [
      'Preparation over action',
      'Planning without executing yet',
      'Storing energy for spring\'s return',
      'Trusting that dormancy serves growth',
    ],
    release: [
      'Pressure to be productive',
      'Guilt about slowing down',
      'Forcing growth in frozen ground',
    ],
  },
}
```

### Component: SeasonalResonancePanel

Displays the complete mirror reading for a user:

```tsx
<SeasonalResonancePanel sign="Taurus" currentDate={new Date()} />
```

**Sections:**
1. **Header**: Sign in current season
2. **Status Badge**: Aligned/Neutral/Challenged with color
3. **Validation Narrative**: Why they feel this way
4. **Guidance**: Lean Into / Release lists
5. **Season Profile**: Home and Challenge descriptions
6. **Wisdom Footer**: "Your rhythm is not a flaw. It's a function."

### Component: HomeChallengeCard

For sign education, shows:
- Home Season with description
- Challenging Season with support message

```tsx
<HomeChallengeCard sign="Taurus" />
```

### Functions for Compatibility

#### generateSeasonalAppreciation()
Reframes differences as seasonal functions, not character flaws:

```typescript
const appreciation = generateSeasonalAppreciation('Taurus', 'Capricorn', 'Winter');
// appreciation.aToB = {
//   statement: "When Capricorn takes the lead in Winter, they are following their natural rhythm—not trying to control you.",
//   reframe: "Let them lead during Winter. Their Winter instincts are most reliable now."
// }
```

#### getPodLeadershipGuidance()
For family/team view, identifies who should lead and who needs support:

```typescript
const guidance = getPodLeadershipGuidance(['Taurus', 'Capricorn', 'Leo'], 'Winter');
// guidance = {
//   naturalLeaders: ['Capricorn'],
//   needsSupport: ['Leo'],
//   leadershipAdvice: "Winter energy builds now—let strategists create lasting structures.",
//   supportAdvice: "Summer signs may feel cold; offer warmth without expecting full radiance."
// }
```

### The Four Seasonal Roles

| Season | Load-Bearing Role | Strength |
|--------|-------------------|----------|
| 🌱 Spring | Builders, starters, growers | Momentum, optimism, visible progress |
| ☀️ Summer | Protectors, sustainers, refiners | Nurturing, morale, improvement |
| 🍂 Autumn | Balancers, transformers, meaning-makers | Negotiation, depth, wisdom extraction |
| ❄️ Winter | Endurers, visionaries, dissolvers | Structure, future vision, letting go |

### Key Insight

> "To survive as a pod you will need people from different seasons to carry the load all year. Their strength in their season is recognition that most people overlook."

This is not astrology as belief—it's **astrology as ecological cooperation**.

---

*"Here's how to LIVE this relationship."*
*"Here's how to FLOW through the year."*
*"Here's WHY the scores say what they say."*
*"Here's how the wheel relates to YOU."*
*"Your rhythm is not a flaw. It's a function."*

---

## 21. φ-Curve Cusp Blending Architecture (NEW)

### Overview

Traditional zodiac systems draw hard lines between signs. The φ-curve cusp blending system replaces binary sign boundaries with a Golden Ratio weighted blend that recognizes the 7-day cusp window where a planet's energy transitions between neighboring signs.

**Core Formula:**
```
neighborWeight = ((7 - d) / 7) ^ φ     where φ = 1.618033988749895
```

When a planet is within 7 days of a sign boundary, the neighboring sign contributes energy proportional to proximity via the Golden Ratio decay curve.

### Architecture

```
src/zodiac/cusp/
├── index.ts                    # Barrel exports
├── resolveSignContext.ts       # Seasonal phase + cusp neighbor detection
├── signVectors.ts              # Sign vectors, φ-blending, cusp explanation engine
└── useYearWheelRotation.ts     # Year breathing animation hook

src/zodiac/
├── planetaryMatrices.ts        # Extended with BlendedPlanetPosition + seasonContext
└── compatibility/
    └── scoringPrimitives.ts    # baseAspectScore() for aspect harmony
```

### Key Types

```typescript
interface SignContext {
  sign: string;
  season: string;
  phase: SeasonPhase;          // 'Begin' | 'Core' | 'End'
  hemisphere: Hemisphere;       // 'Northern' | 'Southern'
  dayOfSeason: number;         // 1-92
  totalSeasonDays: number;
  nearCusp: boolean;           // Within 7-day window
  cuspNeighbor: string | null; // Adjacent sign if nearCusp
  cuspDistance: number | null;  // Days from boundary (1-7)
}

type SeasonPhase = 'Begin' | 'Core' | 'End';
type Hemisphere = 'Northern' | 'Southern';

interface SignBlend {
  sign: string;
  weight: number;              // 0-1 (φ-weighted)
  element: string;
  modality: string;
  season: string;
}
```

### Seasonal Phase Mapping

| Phase | Modality | Metaphor | Signs |
|-------|----------|----------|-------|
| Begin | Cardinal | The Spark | Aries, Cancer, Libra, Capricorn |
| Core  | Fixed    | The Fuel  | Taurus, Leo, Scorpio, Aquarius |
| End   | Mutable  | The Smoke | Gemini, Virgo, Sagittarius, Pisces |

### Sign Vector System

Each sign is encoded as a 9-dimensional vector:
```typescript
interface SignVector {
  fire: number;    water: number;
  earth: number;   air: number;
  cardinal: number; fixed: number; mutable: number;
  yang: number;    yin: number;
}
```

Pure signs have binary vectors. Cusp blends interpolate between vectors using φ-weighted mixing, producing continuous personality expressions at sign boundaries.

### Integration with Synastry

When cusp blends are available, the effort score calculation uses blended element/modality averages instead of binary sign properties, producing more nuanced harmony scores at cusp boundaries.

---

## 22. 5-Matrix Planetary Architecture (NEW)

### Overview

Expands compatibility from a single 3×3 Core Bond matrix (Sun/Moon/Rising) to a full 5-matrix system using all 10 planets, each matrix weighted by its contribution to the overall relationship.

### Matrix Definitions

| # | Matrix | Planets | Grid | Weight | What It Measures |
|---|--------|---------|------|--------|-----------------|
| 1 | Core Bond | Sun, Moon, Rising | 3×3 | 45% | Identity, emotion, social persona |
| 2 | Chemistry | Venus, Mars | 2×2 | 20% | Attraction, desire, physical chemistry |
| 3 | Communication | Mercury (+ Sun, Moon) | 1×2 | 15% | Mental connection, thinking styles |
| 4 | Growth | Jupiter, Saturn | 2×2 | 12% | Expansion, boundaries, shared ambitions |
| 5 | Transformation | Uranus, Neptune, Pluto | 3×3 | 8% | Generational themes, soul evolution |

### Architecture

```
src/zodiac/planetaryMatrices.ts
├── Planet type               # 'Sun' | 'Moon' | 'Rising' | 'Venus' | ... | 'Pluto'
├── PlanetPosition interface  # { planet: Planet; sign: SignKey }
├── PlanetaryCellReport       # Per-cell data (fromPlanet, toPlanet, harmony, angle, etc.)
├── PlanetaryMatrix           # { layer, title, rows, cols, grid, weightedScore, keyInsights }
├── buildChemistryMatrix()    # Matrix 2 builder
├── buildCommunicationMatrix()# Matrix 3 builder
├── buildGrowthMatrix()       # Matrix 4 builder
├── buildTransformationMatrix()# Matrix 5 builder
├── computeFinalCompatibility()# Weighted final score
├── FinalCompatibilityScore   # { layerScores[], finalHarmony, finalPercent, verdict }
├── BlendedPlanetPosition     # Extended with seasonContext + blendedSign
├── buildBlendedChart()       # φ-curve blended planet positions
└── CuspBlendMap              # Optional cusp blend overrides per planet
```

### Final Score Calculation

```typescript
interface FinalCompatibilityScore {
  layerScores: LayerScore[];     // Per-matrix scores
  finalHarmony: number | null;   // 1-10 weighted average
  finalPercent: number | null;   // 0-100 display value
  verdict: string;               // "Strong natural harmony" etc.
}

// Weights
const MATRIX_WEIGHTS = {
  coreBond: 0.45,
  chemistry: 0.20,
  communication: 0.15,
  growth: 0.12,
  transformation: 0.08,
};
```

Gracefully handles missing layers — if only Core Bond is available (no outer planet data), the weight normalizes to the available layers.

### Data Pipeline

```
Backend (Swiss Ephemeris)
  → western.planets.{name}.sign  (all 10 planets stored in Firestore)
  → TropicalSeasonsPage extracts planet signs from profile
  → CompatibilityAnalysisPanel builds PlanetPosition[] arrays
  → Matrix builders produce PlanetaryMatrix for each layer
  → computeFinalCompatibility() produces weighted overall score
  → UI renders PlanetaryMatrixGrid for each matrix
```

No "recalculate" button needed — the backend already computes all planets when a profile is created. The frontend gracefully degrades when outer planet data is unavailable.

---

## 23. Synastry Preview Engine (NEW)

### Overview

Seven capabilities for extracting, narrating, and reporting synastry data across all 5 matrices.

### File: `src/zodiac/synastryPreview.ts`

```typescript
// 1. Per-planet extraction from all 5 matrices
export function getSynastryPreviewForPlanet(
  planetName: string,
  matrices: AllMatrices,
): SynastryPreviewEntry[];

// 2. Mythic narrative for a planet-pair aspect
export function describePlanetAspect(
  planet1: string, planet2: string, angle: AngleKey,
): AspectNarrative;  // { title, summary }

// 3. Layered narrative report with standout references
export function generateSynastryReportWithStandouts(
  scores: FinalCompatibilityScore,
  matrices: AllMatrices,
): SynastryReport;  // { overallSummary, layers: LayerNarrative[] }

// 4. Natural-language paragraph per layer
export function layerToParagraph(layer: LayerNarrative): string;

// 5. Top 5 most extreme dynamics across all matrices
export function top5Dynamics(matrices: AllMatrices): DynamicSummary[];

// 6. High-harmony standout descriptions
export function whatSupportsRelationship(matrices: AllMatrices): string[];

// 7. Low-harmony friction descriptions
export function whereTheWorkLives(matrices: AllMatrices): string[];
```

### Standout Detection Thresholds

| Threshold | Value | Meaning |
|-----------|-------|---------|
| HIGH_HARMONY | >= 8 | Standout support — anchor of the relationship |
| LOW_HARMONY | <= 4 | Standout friction — where conscious work is needed |

### AllMatrices Bundle

```typescript
interface AllMatrices {
  coreBond: SynastryMatrix | null;        // Matrix 1 (CrossAspectReport[])
  chemistry: PlanetaryMatrix | null;      // Matrix 2 (PlanetaryCellReport[])
  communication: PlanetaryMatrix | null;  // Matrix 3
  growth: PlanetaryMatrix | null;         // Matrix 4
  transformation: PlanetaryMatrix | null; // Matrix 5
}
```

---

## 24. Planet Season Panel & Detail Modal (NEW)

### Overview

The PlanetSeasonPanel displays a categorized list of a person's planetary placements with seasonal context, element coloring, cusp badges, and an expandable detail modal with synastry preview integration.

### File: `src/components/zodiac/PlanetSeasonPanel.tsx`

### Planet Grouping

| Group | Planets | Label |
|-------|---------|-------|
| Personal | Sun, Moon, Rising | Core identity |
| Social | Venus, Mars, Mercury | Relationship & communication |
| Growth | Jupiter, Saturn | Expansion & boundaries |
| Transpersonal | Uranus, Neptune, Pluto | Generational themes |

### PlanetDetailModal — 5 Sections

1. **Season & Phase** — Seasonal badge, progress bar, phase description
2. **Sign Meaning** — Mantra, element/modality teaching, energy description
3. **Cusp Blend** (if applicable) — Sign vector bars, blend explanation
4. **Synastry Preview** — All matrix interactions for this planet, clickable rows that highlight the matrix grid
5. **Takeaway** — Beginner-friendly summary

### Matrix Highlight System

When a user clicks a synastry preview row in the modal:
```
PlanetDetailModal click → onHighlight(planetA, planetB)
  → CompatibilityAnalysisPanel state (highlightA, highlightB)
  → PlanetaryMatrixGrid props → row/column/cell highlighting + pulse animation
```

Highlight visual states:
- **Row/Column header**: amber glow background + inset box-shadow
- **Row or column match**: subtle amber tint
- **Cross-highlight (both match)**: bright amber glow + 2s pulse animation

### CSS: `PlanetSeasonPanel.css`

Organized into 6 sections:
1. Panel Container
2. Planet Groups
3. Planet Row (hover, compact variants)
4. Season Tooltip (position: absolute overlay)
5. Planet Detail Modal (fixed overlay, gradient background)
6. Synastry Preview (button rows, harmony color scale)

---

## 25. PDF Report System (NEW)

### Overview

Print-ready synastry report with 5 prose sections, designed for light-theme printing.

### File: `src/components/zodiac/SynastryPdfReport.tsx`

```typescript
interface SynastryPdfReportProps {
  personAName: string;
  personBName: string;
  scores: FinalCompatibilityScore;
  matrices: AllMatrices;
}
```

### 5 Report Sections

1. **Cover** — Names, overall harmony percentage, verdict, summary
2. **Top 5 Dynamics** — Ranked by extremeness, tagged as "support" or "work"
3. **What Supports This Relationship** — High-harmony standout narratives
4. **Where the Work Lives** — Low-harmony friction narratives
5. **Layer-by-Layer** — Prose paragraphs per matrix layer (via `layerToParagraph()`)
6. **Footer** — "Generated by GENESIS AstroProfile" + date

### Print Integration

The report is rendered off-screen in the CompatibilityAnalysisPanel. The "Print Synastry Report" button opens a new browser window with the report content and triggers `window.print()`.

### CSS: `SynastryPdfReport.css`

Light theme (white background, dark text, Georgia serif font) with `@media print` support for clean PDF output.

---

## 26. Seasonal Wheel With UI Container (NEW)

### File: `src/components/zodiac/SeasonalWheelWithUI.tsx`

Container component bridging the D3 TropicalZodiacWheel with the React-based PlanetSeasonPanel.

**Layout:** Wheel (left/center) + Planet Panel (right sidebar)

```typescript
interface SeasonalWheelWithUIProps {
  planets: BlendedPlanetPosition[];
  personName?: string;
  wheelProps: TropicalZodiacWheelProps;
  planetsB?: BlendedPlanetPosition[];
  personNameB?: string;
  compact?: boolean;
}
```

**Features:**
- Planet indicators overlaid on the D3 wheel at their sign positions
- Bidirectional hover bridging: wheel sign hover ↔ panel planet hover
- Stacked planet handling (multiple planets in same sign offset vertically)
- Optional second person's panel for comparison mode

---

## 27. PlanetaryMatrixGrid Component (NEW)

### File: `src/components/zodiac/PlanetaryMatrixGrid.tsx`

Renders a single planetary matrix as an interactive grid with color-coded harmony cells, expandable detail panels, and highlight support.

```typescript
interface PlanetaryMatrixGridProps {
  matrix: PlanetaryMatrix;
  nameA: string;
  nameB: string;
  highlightA?: string | null;
  highlightB?: string | null;
}
```

### Grid Features

- **Color scale**: green (8+) → lime (6-7) → yellow (5) → orange (4) → red (<4)
- **Cell content**: Sign pair, harmony score, weight percentage
- **Expanded detail**: Angle badge, effort/harmony bars, blended sign details, breakdown narrative
- **Highlight support**: Row, column, and cross-highlight with pulse animation
- **Key Insights**: Auto-generated relationship insights at the bottom

### Layer Accent Colors

```typescript
const MATRIX_LAYER_COLORS = {
  coreBond: '#a78bfa',       // purple
  chemistry: '#f43f5e',      // rose
  communication: '#38bdf8',  // sky
  growth: '#4ade80',         // green
  transformation: '#c084fc', // violet
};
```

---

## 28. Expanded CompatibilityAnalysisPanel (NEW)

### Updated ProfileData Interface

```typescript
interface ProfileData {
  id: string;
  name: string;
  birthDate?: string | null;
  sunSign: string | null;
  moonSign: string | null;
  risingSign: string | null;
  // Outer planets (NEW)
  venusSign?: string | null;
  marsSign?: string | null;
  mercurySign?: string | null;
  jupiterSign?: string | null;
  saturnSign?: string | null;
  uranusSign?: string | null;
  neptuneSign?: string | null;
  plutoSign?: string | null;
}
```

### Matrix View (Updated)

The matrix view now displays all 5 matrices vertically stacked:

1. **Final Score Banner** — Large gradient display with overall %, verdict, per-layer chip breakdown
2. **Core Bond** (SynastryGrid) — Existing 9-way matrix, 45% weight badge
3. **Chemistry** (PlanetaryMatrixGrid) — Venus/Mars, 20% weight badge
4. **Communication** (PlanetaryMatrixGrid) — Mercury, 15% weight badge
5. **Growth** (PlanetaryMatrixGrid) — Jupiter/Saturn, 12% weight badge
6. **Transformation** (PlanetaryMatrixGrid) — Uranus/Neptune/Pluto, 8% weight badge
7. **Print Report Button** — Opens synastry PDF report

Each matrix section renders only when the required planet data is available. The panel gracefully degrades: if only Sun/Moon/Rising are available, only the Core Bond matrix appears (identical to previous behavior).

### Data Flow

```
TropicalSeasonsPage
  → profileWestern useMemo extracts all 10 planet signs from western.planets
  → secondProfileWestern does the same for second profile
  → Props passed to CompatibilityAnalysisPanel with expanded ProfileData
  → buildPlanetPositions() converts ProfileData → PlanetPosition[]
  → Matrix builders produce matrices for available planets
  → computeFinalCompatibility() produces weighted score
  → PlanetaryMatrixGrid renders each matrix
  → handleHighlight() wires cross-referencing
  → handlePrint() renders SynastryPdfReport for printing
```

---

## 29. Updated File Tree

```
src/zodiac/
├── tropicalMap.ts              # Core zodiac data (signs, elements, modalities)
├── angles.ts                   # Aspect angles (conjunction, sextile, square, etc.)
├── signGuidance.ts             # 12-sign behavioral profiles
├── guidanceEngine.ts           # Dynamic pair-specific synthesis
├── moonRepairScripts.ts        # Moon sign emotional repair
├── risingFriction.ts           # Rising sign social dynamics
├── dialogueSnippets.ts         # What to say / what not to say
├── narrativeEngine.ts          # Perspective reports & 9-way synastry matrix
├── planetaryMatrices.ts        # 5-matrix builders, BlendedPlanetPosition [NEW]
├── synastryPreview.ts          # 7-capability synastry engine [NEW]
├── cusp/
│   ├── index.ts                # Barrel exports [NEW]
│   ├── resolveSignContext.ts   # Seasonal phase + cusp detection [NEW]
│   ├── signVectors.ts          # φ-curve blending + sign vectors [NEW]
│   └── useYearWheelRotation.ts # Year breathing animation [NEW]
└── compatibility/
    ├── types.ts                # Shared compatibility types [NEW]
    └── scoringPrimitives.ts    # baseAspectScore() [NEW]

src/components/zodiac/
├── CompatibilityAnalysisPanel.tsx  # 5-matrix integration + final score [UPDATED]
├── PlanetaryMatrixGrid.tsx         # Planetary matrix grid + highlights [NEW]
├── PlanetSeasonPanel.tsx           # Planet list + detail modal [NEW]
├── PlanetSeasonPanel.css           # Panel + modal + synastry preview styles [NEW]
├── SeasonalWheelWithUI.tsx         # D3 wheel + panel container [NEW]
├── SeasonalWheelWithUI.css         # Wheel + panel layout [NEW]
├── SynastryPdfReport.tsx           # PDF-ready report component [NEW]
├── SynastryPdfReport.css           # Light-theme print styles [NEW]
├── SynastryGrid.tsx                # 9-way Core Bond visualization
├── InDepthGuidance.tsx             # Susan Miller-style guidance
├── ProfileComparisonModal.tsx      # Draggable profile comparison
└── ScoringTheoryFlap.tsx           # Scoring theory explanation

src/pages/
└── TropicalSeasonsPage.tsx         # Extracts all 10 planet signs [UPDATED]
```

---

*"Here's how to LIVE this relationship."*
*"Here's how to FLOW through the year."*
*"Here's WHY the scores say what they say."*
*"Here's how the wheel relates to YOU."*
*"Your rhythm is not a flaw. It's a function."*
*"Here's how ALL your planets dance together."*

**End of Implementation Document**
