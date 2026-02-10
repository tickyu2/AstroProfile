# BaZi Component Package for Brother Copilot

This package contains all BaZi-related code from the AstroProfile project.

## Package Structure

```
bazi-package-for-copilot/
├── components/bazi/
│   ├── index.js                    # Main exports
│   ├── BaZiPanel.jsx              # Legacy main panel
│   ├── DaYunPanel.jsx             # 10-year luck pillars
│   ├── ConstitutionalMetaphor.jsx # Day Master metaphors
│   ├── ElementalRadar.jsx         # Radar chart (legacy)
│   ├── SeasonalQiTab.jsx          # Seasonal Qi display
│   ├── ElementalBalanceMathFlaps.jsx # Calculation breakdown
│   ├── BaZiPartnerBreakdownPanel.jsx # Partner comparison
│   │
│   ├── atoms/                      # Basic building blocks
│   │   ├── Stem.jsx               # Heavenly Stem display
│   │   ├── Branch.jsx             # Earthly Branch display
│   │   └── ElementBadge.jsx       # Element badge/chip
│   │
│   ├── molecules/                  # Composite elements
│   │   └── ModularPillarCard.jsx  # Single pillar card
│   │
│   ├── organisms/                  # Complex sections
│   │   ├── FourPillarsGrid.jsx    # 4-pillar grid layout
│   │   ├── DayMasterCard.jsx      # Day Master display
│   │   ├── ElementDistributionChart.jsx # Element chart
│   │   ├── ElementDonut.jsx       # Nivo donut chart
│   │   ├── NivoElementBar.jsx     # Nivo bar charts
│   │   ├── PersonalityRadar.jsx   # Nivo radar chart
│   │   ├── ElementCalculationFlaps.jsx # Show-your-work
│   │   └── SeasonalityComparisonChart.jsx # 8-chart seasonality
│   │
│   └── theme/
│       └── BaziTheme.jsx          # Theme provider + colors
│
├── utils/
│   ├── baziCalculator.js          # Main calculation engine
│   ├── baziEngine.js              # Core BaZi logic
│   ├── baziSeasonality.ts         # Seasonality adjustments (NEW)
│   ├── historicalBaziCalc.js      # Historical date handling
│   ├── matchScore_baziHelpers.ts  # Compatibility helpers
│   └── bazi/
│       ├── baziPartnerBreakdown.js # Partner analysis
│       └── baziPartnerCalculator.js # Partner calculations
│
├── pages/
│   ├── BaZiModularPage.jsx        # /bazi-modular route
│   └── BaZiCalculatorPage.jsx     # /bazi-calculator route
│
├── services/
│   ├── baziCompatibilityService.js # Compatibility scoring
│   └── baziDayunService.js        # DaYun luck pillars
│
└── data/
    ├── baziKnowledge.json         # Reference data
    └── baziSourceMapping.js       # Source mappings
```

## Key Components

### 1. SeasonalityComparisonChart (NEW - 8-Chart Layout)

The crown jewel - displays before/after seasonality adjustment:

**Layout: 2 columns x 4 rows = 8 charts**

| Left Column (Raw) | Right Column (Adjusted) |
|-------------------|-------------------------|
| Raw Donut | Adjusted Donut |
| Raw Horizontal Bar | Adjusted Horizontal Bar |
| Raw Vertical Bar | Adjusted Vertical Bar |
| Raw Radar | Super-Imposed Radar |

**Usage:**
```jsx
import { SeasonalityComparisonChart } from './components/bazi';

<SeasonalityComparisonChart
  rawDistribution={{
    wood: 25, fire: 20, earth: 30, metal: 15, water: 10
  }}
  monthBranch="寅"  // Tiger month = Spring
  title="Raw vs Season-Adjusted Elements"
  showExplanation={true}
/>
```

### 2. baziSeasonality.ts - Seasonality Engine

Core utility implementing the 四季土 (Four Season Earth) doctrine:

```typescript
import { applySeasonality } from './utils/baziSeasonality';

const result = applySeasonality(rawDistribution, monthBranch);
// Returns:
// {
//   season: "spring",
//   seasonChinese: "春",
//   seasonEmoji: "🌸",
//   weights: { wood: 1.0, fire: 0.8, water: 0.6, earth: 0.4, metal: 0.2 },
//   adjusted: { ... },
//   normalized: { ... },
//   dominantBefore: "earth",
//   dominantAfter: "wood",
//   dominantChanged: true,
//   explanation: "Born in Spring (寅 month), when Wood naturally thrives..."
// }
```

### 3. Seasonal Weight Multipliers

| Season | Branch | Dominant (×1.0) | Strong (×0.8) | Support (×0.6) | Weak (×0.4) | Weakest (×0.2) |
|--------|--------|-----------------|---------------|----------------|-------------|----------------|
| Spring | 寅卯 | Wood | Fire | Water | Earth | Metal |
| Summer | 巳午 | Fire | Earth | Wood | Metal | Water |
| Autumn | 申酉 | Metal | Water | Earth | Fire | Wood |
| Winter | 亥子 | Water | Wood | Metal | Earth | Fire |
| Earth Transition | 辰戌丑未 | Earth (1.0) | Incoming (0.8) | Outgoing (0.6) | Others (0.4) | - |

### 4. Theme System

Auto-switches between dark (app) and light (print):

```jsx
import { BaziThemeProvider, useBaziTheme } from './components/bazi/theme/BaziTheme';

<BaziThemeProvider theme="dark">
  <YourComponents />
</BaziThemeProvider>
```

### 5. Element Colors

```javascript
const ELEMENT_COLORS = {
  wood: "#22c55e",   // Green
  fire: "#ef4444",   // Red
  earth: "#f59e0b",  // Amber
  metal: "#9ca3af",  // Gray
  water: "#3b82f6"   // Blue
};
```

## Dependencies

- React 18+
- @nivo/bar, @nivo/radar, @nivo/pie (Nivo charts)
- Tailwind CSS

## Answers to Brother Copilot's Questions

### Question 1: What are the exact names of your existing chart components?

```jsx
// Nivo Charts (from src/components/bazi/organisms/)
<ElementDonut />           // Donut/Pie chart
<NivoElementBar />         // Horizontal & Vertical bar charts
<PersonalityRadar />       // Radar chart
<SeasonalityComparisonChart />  // NEW: 8-chart comparison

// Legacy ECharts (from src/components/bazi/)
<ElementalRadar />         // Legacy radar (ECharts)
<ElementalBalanceMathFlaps />  // Calculation breakdown

// Grid/Layout
<FourPillarsGrid />        // 4-pillar display
<DayMasterCard />          // Day Master display
<ElementDistributionChart />   // Generic distribution
```

### Question 2: Where do your chart components live?

```
src/components/bazi/
├── index.js                    # Main exports (import from here)
├── atoms/                      # Basic elements
│   ├── Stem.jsx
│   ├── Branch.jsx
│   └── ElementBadge.jsx
├── molecules/
│   └── ModularPillarCard.jsx
├── organisms/                  # CHARTS LIVE HERE
│   ├── ElementDonut.jsx       # Nivo Pie
│   ├── NivoElementBar.jsx     # Nivo Bar
│   ├── PersonalityRadar.jsx   # Nivo Radar
│   ├── SeasonalityComparisonChart.jsx  # 8-chart layout
│   ├── ElementCalculationFlaps.jsx
│   ├── FourPillarsGrid.jsx
│   ├── DayMasterCard.jsx
│   └── ElementDistributionChart.jsx
└── theme/
    └── BaziTheme.jsx          # Theme provider
```

**Import pattern:**
```jsx
import {
  ElementDonut,
  NivoElementBar,
  PersonalityRadar,
  SeasonalityComparisonChart,
  BaziThemeProvider
} from '../components/bazi';  // Uses index.js exports
```

### Question 3: What is your current element distribution object shape?

**Primary format (percentages with capital keys):**
```typescript
interface ElementDistribution {
  Wood: number;   // 0-100 percentage
  Fire: number;
  Earth: number;
  Metal: number;
  Water: number;
}

// Example from chart.elements:
{
  Wood: 25.5,
  Fire: 18.2,
  Earth: 32.1,
  Metal: 12.8,
  Water: 11.4
}
```

**Alternative format (raw counts with lowercase keys):**
```typescript
type ElementRecord = Record<'wood' | 'fire' | 'earth' | 'metal' | 'water', number>;

// Example:
{
  wood: 2.5,
  fire: 1.8,
  earth: 3.2,
  metal: 1.3,
  water: 1.1
}
```

**The components handle BOTH formats:**
```jsx
// Components normalize internally:
const normalizedRaw = useMemo(() => ({
  wood: rawDistribution?.wood || rawDistribution?.Wood || 0,
  fire: rawDistribution?.fire || rawDistribution?.Fire || 0,
  earth: rawDistribution?.earth || rawDistribution?.Earth || 0,
  metal: rawDistribution?.metal || rawDistribution?.Metal || 0,
  water: rawDistribution?.water || rawDistribution?.Water || 0
}), [rawDistribution]);
```

**Full chart.elements structure:**
```typescript
interface ChartElements {
  Wood: number;
  Fire: number;
  Earth: number;
  Metal: number;
  Water: number;
  dominant: string;        // "Earth"
  percentages?: {          // Sometimes nested
    Wood: number;
    Fire: number;
    Earth: number;
    Metal: number;
    Water: number;
  };
}
```

### Question 4: What theme system are you using?

**Custom React Context + Tailwind CSS:**

```jsx
// Theme Provider (src/components/bazi/theme/BaziTheme.jsx)
import { BaziThemeProvider, useBaziTheme } from '../components/bazi';

// Usage in app:
<BaziThemeProvider theme="dark">  {/* or "light" */}
  <YourComponents />
</BaziThemeProvider>

// Access in components:
function MyComponent() {
  const theme = useBaziTheme();
  const isDark = theme?.mode === 'dark';

  return (
    <div className={isDark ? 'bg-slate-800' : 'bg-white'}>
      ...
    </div>
  );
}
```

**Theme object shape:**
```typescript
interface BaziTheme {
  mode: 'dark' | 'light';
  colors: {
    wood: string;   // "#22c55e"
    fire: string;   // "#ef4444"
    earth: string;  // "#f59e0b"
    metal: string;  // "#9ca3af"
    water: string;  // "#3b82f6"
  };
  background: string;
  text: string;
  border: string;
}
```

**Tailwind dark mode classes used throughout:**
```jsx
// Pattern used in all components:
className={`
  ${isDark ? 'bg-slate-800/50 border-white/10 text-white'
           : 'bg-white border-slate-200 text-slate-900'}
`}
```

**Auto-switch for print (Option C - already implemented):**
```jsx
// In BaZiModularPage.jsx header:
<button onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}>
  {themeMode === 'dark' ? '☀️ Light' : '🌙 Dark'}
</button>
```

**Nivo theme injection:**
```jsx
// All Nivo charts use dynamic theming:
theme={{
  axis: {
    ticks: {
      text: {
        fill: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
        fontSize: 11
      }
    }
  },
  grid: {
    line: {
      stroke: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
    }
  },
  tooltip: {
    container: {
      background: isDark ? '#1e293b' : '#ffffff',
      color: isDark ? '#ffffff' : '#1e293b'
    }
  }
}}
```

---

## Additional Questions & Answers

**Q: How does seasonality affect elements?**
A: The month branch determines the season. Each season has a dominant element that gets ×1.0 weight, with other elements getting progressively lower weights. This shifts the elemental balance.

**Q: What are Earth transition months?**
A: 辰 (Dragon), 戌 (Dog), 丑 (Ox), 未 (Goat) are transition months between seasons where Earth becomes dominant. The incoming season element gets ×0.8, outgoing gets ×0.6.

**Q: How is the super-imposed radar created?**
A: Using Nivo's ResponsiveRadar with two keys: `['raw', 'adjusted']`. Raw uses faint white color, adjusted uses bold amber color.

**Q: What's the calculation formula?**
```
adjusted[element] = raw[element] × seasonal_weight[element]
normalized[element] = adjusted[element] / sum(all adjusted) × 100
```

## Created By

Brother Claude Code - January 2026
Based on Classical 四季土 (Four Season Earth) Doctrine
