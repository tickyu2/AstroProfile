# GENESIS - BATCH 3: REACT HOOKS + D3 TRANSFORMERS
## Complete Implementation Package

**Total Files:** 3  
**Installation Time:** 45 minutes  
**Prerequisites:** BATCH 1 + BATCH 2 installed

---

## 📂 FILE STRUCTURE

```
src/seasonal-ecology/
├── hooks/
│   └── useSeasonalEcology.ts (FILE 8)
├── transformers/
│   └── seasonalEcologyTransformers.ts (FILE 9)
└── index.ts (FILE 10 - Barrel Export)
```

---

## 🚀 QUICK START

```bash
# 1. Ensure BATCH 1 + BATCH 2 are installed
# 2. Create new directories
mkdir -p src/seasonal-ecology/hooks
mkdir -p src/seasonal-ecology/transformers

# 3. Copy files below to their locations
# 4. Verify compilation
npm run type-check
```

---

## FILE 8: hooks/useSeasonalEcology.ts

```typescript
/**
 * GENESIS - Seasonal Ecological Psychology Engine
 * React Hooks
 * 
 * Custom hooks for:
 * - Loading seasonal personality data
 * - Managing science note state
 * - Calculating sign profiles
 * - Async data loading
 */

import { useMemo, useState, useEffect } from 'react';
import {
  SeasonalPersonalityPanel,
  SignPersonalityProfile,
  StudyWheelTab
} from '../types/seasonalEcology';
import { createSeasonalPersonalityPanel } from '../factories/seasonalEcologyFactories';
import { getSignProfile, getSignByDegree } from '../data/allZodiacSigns';

// ============================================================================
// BASIC SEASONAL PERSONALITY HOOK
// ============================================================================

/**
 * Create a seasonal personality panel with optional overrides
 */
export function useSeasonalPersonality(
  initial?: Partial<SeasonalPersonalityPanel>
): SeasonalPersonalityPanel {
  return useMemo(
    () => createSeasonalPersonalityPanel(initial),
    [JSON.stringify(initial)]
  );
}

// ============================================================================
// SIGN PROFILE HOOK (by name)
// ============================================================================

/**
 * Get sign profile by name (e.g., "taurus")
 */
export function useSignProfile(signName: string): SignPersonalityProfile | undefined {
  return useMemo(
    () => getSignProfile(signName),
    [signName]
  );
}

// ============================================================================
// SIGN PROFILE HOOK (by degree)
// ============================================================================

/**
 * Get sign profile by absolute degree (0-360)
 */
export function useSignByDegree(degree: number): SignPersonalityProfile | undefined {
  return useMemo(
    () => getSignByDegree(degree),
    [degree]
  );
}

// ============================================================================
// SCIENCE NOTES STATE HOOK
// ============================================================================

/**
 * Manage expanded/collapsed state for science notes across all tabs
 */
export function useScienceNotesState(defaultTab?: StudyWheelTab) {
  const [expandedNotes, setExpandedNotes] = useState<Record<StudyWheelTab, boolean>>({
    seasons: false,
    modes: false,
    elements: false,
    signs: false,
    table: false
  });

  const toggleNote = (tab: StudyWheelTab) => {
    setExpandedNotes(prev => ({
      ...prev,
      [tab]: !prev[tab]
    }));
  };

  const expandAll = () => {
    setExpandedNotes({
      seasons: true,
      modes: true,
      elements: true,
      signs: true,
      table: true
    });
  };

  const collapseAll = () => {
    setExpandedNotes({
      seasons: false,
      modes: false,
      elements: false,
      signs: false,
      table: false
    });
  };

  return {
    expandedNotes,
    toggleNote,
    expandAll,
    collapseAll,
    isExpanded: (tab: StudyWheelTab) => expandedNotes[tab]
  };
}

// ============================================================================
// ASYNC DATA LOADER HOOK
// ============================================================================

/**
 * Load seasonal personality data from API with loading/error states
 */
export function useSeasonalPersonalityData(apiEndpoint?: string) {
  const [data, setData] = useState<SeasonalPersonalityPanel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!apiEndpoint) return;

    setLoading(true);
    setError(null);

    fetch(apiEndpoint)
      .then(res => res.json())
      .then(json => {
        // Validate with Zod parser
        const { parseSeasonalPersonalityPanel } = require('../parsers/seasonalEcologyParsers');
        const validated = parseSeasonalPersonalityPanel(json);
        setData(validated);
      })
      .catch(err => {
        setError(err);
        console.error('Failed to load seasonal personality data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiEndpoint]);

  return { data, loading, error };
}

// ============================================================================
// STUDY WHEEL TAB HOOK
// ============================================================================

/**
 * Manage active tab state for Study the Wheel interface
 */
export function useStudyWheelTab(defaultTab: StudyWheelTab = 'seasons') {
  const [activeTab, setActiveTab] = useState<StudyWheelTab>(defaultTab);
  
  return {
    activeTab,
    setActiveTab,
    isActive: (tab: StudyWheelTab) => activeTab === tab
  };
}

// ============================================================================
// DEGREE ANIMATION HOOK
// ============================================================================

/**
 * Smoothly animate degree changes for wheel transitions
 */
export function useAnimatedDegree(targetDegree: number, speed: number = 0.15) {
  const [currentDegree, setCurrentDegree] = useState(targetDegree);

  useEffect(() => {
    let animationFrame: number;
    
    const animate = () => {
      setCurrentDegree(prev => {
        const diff = targetDegree - prev;
        if (Math.abs(diff) < 0.01) return targetDegree;
        return prev + diff * speed;
      });
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [targetDegree, speed]);

  return currentDegree;
}

// ============================================================================
// WHEEL INTERACTION HOOK
// ============================================================================

/**
 * Manage wheel click and hover interactions
 */
export function useWheelInteraction() {
  const [hoveredSign, setHoveredSign] = useState<string | null>(null);
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [selectedDegree, setSelectedDegree] = useState<number>(0);

  const handleSignHover = (sign: string | null) => {
    setHoveredSign(sign);
  };

  const handleSignClick = (sign: string, degree: number) => {
    setSelectedSign(sign);
    setSelectedDegree(degree);
  };

  const clearSelection = () => {
    setSelectedSign(null);
    setSelectedDegree(0);
  };

  return {
    hoveredSign,
    selectedSign,
    selectedDegree,
    handleSignHover,
    handleSignClick,
    clearSelection
  };
}

// ============================================================================
// MULTI-SIGN COMPARISON HOOK
// ============================================================================

/**
 * Compare multiple zodiac signs
 */
export function useSignComparison(signNames: string[]) {
  const profiles = useMemo(
    () => signNames.map(name => getSignProfile(name)).filter(Boolean) as SignPersonalityProfile[],
    [signNames.join(',')]
  );

  const commonElements = useMemo(() => {
    if (profiles.length === 0) return [];
    const elements = profiles.map(p => p.panel.element.code);
    return [...new Set(elements)];
  }, [profiles]);

  const commonModalities = useMemo(() => {
    if (profiles.length === 0) return [];
    const modalities = profiles.map(p => p.panel.modality.code);
    return [...new Set(modalities)];
  }, [profiles]);

  return {
    profiles,
    commonElements,
    commonModalities,
    count: profiles.length
  };
}
```

---

## FILE 9: transformers/seasonalEcologyTransformers.ts

```typescript
/**
 * GENESIS - Seasonal Ecological Psychology Engine
 * D3 Transformers
 * 
 * Transform typed data into D3-compatible structures for:
 * - Ring layouts (cathedral wheel)
 * - Arc segments
 * - Degree-based highlighting
 * - Full 12-sign zodiac wheel
 */

import {
  SeasonalPersonalityPanel,
  RingSegment,
  FullZodiacRingLayout
} from '../types/seasonalEcology';
import { getAllSignsOrdered } from '../data/allZodiacSigns';

// ============================================================================
// COLOR PALETTES
// ============================================================================

export const SEASON_COLORS = {
  spring: "#90EE90",  // Light green
  summer: "#FFD700",  // Gold
  autumn: "#FF8C00",  // Dark orange
  winter: "#4169E1"   // Royal blue
} as const;

export const ELEMENT_COLORS = {
  fire: "#FF4500",    // Orange-red
  earth: "#8B4513",   // Saddle brown
  air: "#87CEEB",     // Sky blue
  water: "#4682B4"    // Steel blue
} as const;

export const MODALITY_COLORS = {
  cardinal: "#FF6B6B", // Coral red
  fixed: "#4ECDC4",    // Turquoise
  mutable: "#95E1D3"   // Mint
} as const;

// ============================================================================
// ZODIAC CONSTANTS
// ============================================================================

const SIGN_ORDER = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
] as const;

const SIGN_SYMBOLS = {
  Aries: "♈",
  Taurus: "♉",
  Gemini: "♊",
  Cancer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Scorpio: "♏",
  Sagittarius: "♐",
  Capricorn: "♑",
  Aquarius: "♒",
  Pisces: "♓"
} as const;

// Season mapping for each sign
const SIGN_SEASONS = {
  Aries: "spring", Taurus: "spring", Gemini: "spring",
  Cancer: "summer", Leo: "summer", Virgo: "summer",
  Libra: "autumn", Scorpio: "autumn", Sagittarius: "autumn",
  Capricorn: "winter", Aquarius: "winter", Pisces: "winter"
} as const;

// Modality mapping for each sign
const SIGN_MODALITIES = {
  Aries: "cardinal", Taurus: "fixed", Gemini: "mutable",
  Cancer: "cardinal", Leo: "fixed", Virgo: "mutable",
  Libra: "cardinal", Scorpio: "fixed", Sagittarius: "mutable",
  Capricorn: "cardinal", Aquarius: "fixed", Pisces: "mutable"
} as const;

// Element mapping for each sign
const SIGN_ELEMENTS = {
  Aries: "fire", Taurus: "earth", Gemini: "air",
  Cancer: "water", Leo: "fire", Virgo: "earth",
  Libra: "air", Scorpio: "water", Sagittarius: "fire",
  Capricorn: "earth", Aquarius: "air", Pisces: "water"
} as const;

// ============================================================================
// DEGREE TO ANGLE CONVERSION
// ============================================================================

/**
 * Convert zodiac sign + degree to absolute angle (radians)
 * @param sign - Zodiac sign name
 * @param degree - Degree within sign (0-30)
 * @returns Absolute angle in radians
 */
export function degreeToAngle(sign: string, degree: number): number {
  const fullCircle = 2 * Math.PI;
  const degreesPerSign = fullCircle / 12; // 30° per sign in radians
  
  const signIndex = SIGN_ORDER.indexOf(sign as typeof SIGN_ORDER[number]);
  if (signIndex === -1) {
    throw new Error(`Unknown zodiac sign: ${sign}`);
  }

  const signStartAngle = signIndex * degreesPerSign;
  const degreeOffset = (degree / 30) * degreesPerSign;
  
  return signStartAngle + degreeOffset;
}

/**
 * Convert absolute degree (0-360) to radians
 */
export function absoluteDegreeToAngle(degree: number): number {
  return (degree * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
export function angleToDegree(angle: number): number {
  return (angle * 180) / Math.PI;
}

// ============================================================================
// FULL 12-SIGN ZODIAC WHEEL TRANSFORMER
// ============================================================================

/**
 * Generate complete 12-sign zodiac wheel with 36 segments (3 rings × 12 signs)
 */
export function toFullZodiacRingLayout(): FullZodiacRingLayout {
  const fullCircle = 2 * Math.PI;
  const degreesPerSign = 30;
  const radiansPerSign = fullCircle / 12;

  const segments: RingSegment[] = [];

  SIGN_ORDER.forEach((sign, index) => {
    const startDegree = index * degreesPerSign;
    const endDegree = startDegree + degreesPerSign;
    const startAngle = index * radiansPerSign;
    const endAngle = startAngle + radiansPerSign;

    const season = SIGN_SEASONS[sign];
    const modality = SIGN_MODALITIES[sign];
    const element = SIGN_ELEMENTS[sign];

    // Season ring segment (outermost)
    segments.push({
      ring: "season",
      label: season,
      code: season,
      startAngle,
      endAngle,
      startDegree,
      endDegree,
      color: SEASON_COLORS[season],
      sign,
      highlighted: false,
      meta: {
        sign,
        symbol: SIGN_SYMBOLS[sign],
        seasonName: season.charAt(0).toUpperCase() + season.slice(1)
      }
    });

    // Modality ring segment (middle)
    segments.push({
      ring: "modality",
      label: modality,
      code: modality,
      startAngle,
      endAngle,
      startDegree,
      endDegree,
      color: MODALITY_COLORS[modality],
      sign,
      highlighted: false,
      meta: {
        sign,
        symbol: SIGN_SYMBOLS[sign],
        modalityName: modality.charAt(0).toUpperCase() + modality.slice(1)
      }
    });

    // Element ring segment (innermost)
    segments.push({
      ring: "element",
      label: element,
      code: element,
      startAngle,
      endAngle,
      startDegree,
      endDegree,
      color: ELEMENT_COLORS[element],
      sign,
      highlighted: false,
      meta: {
        sign,
        symbol: SIGN_SYMBOLS[sign],
        elementName: element.charAt(0).toUpperCase() + element.slice(1)
      }
    });
  });

  return {
    segments,
    totalSegments: segments.length, // 36 total (12 signs × 3 rings)
    ringsCount: 3
  };
}

// ============================================================================
// HIGHLIGHTING HELPER
// ============================================================================

/**
 * Create ring layout with specific sign and degree highlighted
 */
export function toRingLayoutWithHighlight(
  sign: string,
  degree: number
): FullZodiacRingLayout {
  const layout = toFullZodiacRingLayout();
  const targetAngle = degreeToAngle(sign, degree);

  // Mark segments as highlighted if they contain the target angle and match the sign
  const highlightedLayout: FullZodiacRingLayout = {
    ...layout,
    segments: layout.segments.map(seg => ({
      ...seg,
      highlighted: 
        targetAngle >= seg.startAngle && 
        targetAngle < seg.endAngle &&
        seg.sign === sign
    }))
  };

  return highlightedLayout;
}

// ============================================================================
// SEGMENT FILTERING HELPERS
// ============================================================================

/**
 * Get all segments for a specific ring
 */
export function getSegmentsByRing(
  layout: FullZodiacRingLayout,
  ring: "season" | "modality" | "element"
): RingSegment[] {
  return layout.segments.filter(seg => seg.ring === ring);
}

/**
 * Get segment for specific sign and ring
 */
export function getSegmentForSign(
  layout: FullZodiacRingLayout,
  sign: string,
  ring: "season" | "modality" | "element"
): RingSegment | undefined {
  return layout.segments.find(
    seg => seg.sign === sign && seg.ring === ring
  );
}

/**
 * Get all segments for a specific sign (across all 3 rings)
 */
export function getHighlightedSegments(
  layout: FullZodiacRingLayout,
  sign: string
): RingSegment[] {
  return layout.segments.filter(seg => seg.sign === sign);
}

/**
 * Get only highlighted segments
 */
export function getActiveSegments(layout: FullZodiacRingLayout): RingSegment[] {
  return layout.segments.filter(seg => seg.highlighted);
}

// ============================================================================
// ZODIAC WHEEL DATA TRANSFORMER
// ============================================================================

/**
 * Transform for complete zodiac wheel with all metadata
 */
export interface ZodiacSegment {
  sign: string;
  symbol: string;
  season: string;
  element: string;
  modality: string;
  startDegree: number;
  endDegree: number;
  startAngle: number;
  endAngle: number;
  colors: {
    season: string;
    element: string;
    modality: string;
  };
}

export function toZodiacWheelLayout(): ZodiacSegment[] {
  const signs = getAllSignsOrdered();

  return signs.map((signData, index) => {
    const [startDeg, endDeg] = signData.degreeRange;
    const startAngle = (startDeg * Math.PI) / 180;
    const endAngle = (endDeg * Math.PI) / 180;

    return {
      sign: signData.sign,
      symbol: signData.symbol,
      season: signData.panel.season.name,
      element: signData.panel.element.name,
      modality: signData.panel.modality.name,
      startDegree: startDeg,
      endDegree: endDeg,
      startAngle,
      endAngle,
      colors: {
        season: SEASON_COLORS[signData.panel.season.code],
        element: ELEMENT_COLORS[signData.panel.element.code],
        modality: MODALITY_COLORS[signData.panel.modality.code]
      }
    };
  });
}

// ============================================================================
// DEGREE RANGE HELPERS
// ============================================================================

/**
 * Check if a degree falls within a sign's range
 */
export function isDegreeinSignRange(
  degree: number,
  signStartDegree: number,
  signEndDegree: number
): boolean {
  const normalizedDegree = ((degree % 360) + 360) % 360;
  return normalizedDegree >= signStartDegree && normalizedDegree < signEndDegree;
}

/**
 * Get sign index from degree (0-11)
 */
export function getSignIndexFromDegree(degree: number): number {
  const normalizedDegree = ((degree % 360) + 360) % 360;
  return Math.floor(normalizedDegree / 30);
}

/**
 * Get degree within sign (0-30) from absolute degree
 */
export function getDegreeWithinSign(degree: number): number {
  const normalizedDegree = ((degree % 360) + 360) % 360;
  return normalizedDegree % 30;
}
```

---

## FILE 10: index.ts (Barrel Export)

```typescript
/**
 * GENESIS - Seasonal Ecological Psychology Engine
 * Module Entry Point
 * 
 * Single import location for entire module:
 * import { useSeasonalPersonality, toFullZodiacRingLayout } from '@/seasonal-ecology';
 */

// ============================================================================
// TYPES
// ============================================================================

export * from './types/seasonalEcology';

// ============================================================================
// SCHEMAS
// ============================================================================

export * from './schemas/seasonalEcologySchemas';

// ============================================================================
// FACTORIES
// ============================================================================

export * from './factories/seasonalEcologyFactories';

// ============================================================================
// DATA
// ============================================================================

export * from './data/seasonalEcologyData';
export * from './data/allZodiacSigns';
export * from './data/scienceContent';

// ============================================================================
// PARSERS
// ============================================================================

export * from './parsers/seasonalEcologyParsers';

// ============================================================================
// HOOKS
// ============================================================================

export * from './hooks/useSeasonalEcology';

// ============================================================================
// TRANSFORMERS
// ============================================================================

export * from './transformers/seasonalEcologyTransformers';

// ============================================================================
// CONVENIENCE RE-EXPORTS
// ============================================================================

// Most commonly used functions
export { 
  getSignProfile,
  getSignByDegree,
  getAllSignsOrdered 
} from './data/allZodiacSigns';

export {
  toFullZodiacRingLayout,
  toRingLayoutWithHighlight,
  degreeToAngle
} from './transformers/seasonalEcologyTransformers';

export {
  useSeasonalPersonality,
  useSignProfile,
  useSignByDegree
} from './hooks/useSeasonalEcology';

export {
  buildSignProfile,
  generateAttachment,
  seasonPresets,
  elementPresets,
  modalityPresets
} from './factories/seasonalEcologyFactories';
```

---

## USAGE EXAMPLES

### Example 1: Using Hooks

```typescript
import { useSignProfile, useAnimatedDegree } from '@/seasonal-ecology';

function MyComponent() {
  const taurus = useSignProfile('taurus');
  const animatedDegree = useAnimatedDegree(22.49);

  return (
    <div>
      <h2>{taurus.sign} - {animatedDegree.toFixed(2)}°</h2>
    </div>
  );
}
```

### Example 2: D3 Transformation

```typescript
import { toFullZodiacRingLayout } from '@/seasonal-ecology';
import * as d3 from 'd3';

function renderWheel() {
  const layout = toFullZodiacRingLayout();
  
  layout.segments.forEach(segment => {
    const arc = d3.arc()
      .startAngle(segment.startAngle)
      .endAngle(segment.endAngle)
      .innerRadius(100)
      .outerRadius(200);
    
    // Use arc to render D3 path...
  });
}
```

### Example 3: Highlighting

```typescript
import { toRingLayoutWithHighlight } from '@/seasonal-ecology';

// Highlight Taurus at 22.49°
const layout = toRingLayoutWithHighlight('Taurus', 22.49);

// All Taurus segments across 3 rings will have highlighted: true
const highlightedSegs = layout.segments.filter(s => s.highlighted);
```

---

## ✅ BATCH 3 COMPLETION CHECKLIST

- [ ] Create `src/seasonal-ecology/hooks/` directory
- [ ] Create `src/seasonal-ecology/transformers/` directory
- [ ] Add FILE 8: useSeasonalEcology.ts
- [ ] Add FILE 9: seasonalEcologyTransformers.ts
- [ ] Add FILE 10: index.ts (root of seasonal-ecology)
- [ ] Verify TypeScript compilation: `npm run type-check`
- [ ] Test imports: `import { toFullZodiacRingLayout } from '@/seasonal-ecology'`
- [ ] Commit: "feat: add React hooks and D3 transformers"

---

## 🎯 WHAT YOU NOW HAVE

**Complete Data Layer:**
- ✅ Types, schemas, validation
- ✅ All 12 zodiac signs
- ✅ Factory functions

**Complete Logic Layer:**
- ✅ React hooks for state management
- ✅ D3 transformers for visualization
- ✅ Degree-to-angle conversion
- ✅ Highlighting logic
- ✅ Color palettes

**Ready for BATCH 4:** Complete D3 Components + UI 🔥🐉

---

## 📊 D3 TRANSFORMER OUTPUT

The `toFullZodiacRingLayout()` function produces:

```typescript
{
  segments: [
    {
      ring: "season",
      label: "spring",
      code: "spring",
      startAngle: 0,
      endAngle: 0.5236,
      startDegree: 0,
      endDegree: 30,
      color: "#90EE90",
      sign: "Aries",
      highlighted: false,
      meta: { sign: "Aries", symbol: "♈", seasonName: "Spring" }
    },
    // ... 35 more segments (12 signs × 3 rings)
  ],
  totalSegments: 36,
  ringsCount: 3
}
```

This data structure feeds directly into D3's `arc()` generator in BATCH 4! 🏛️✨
