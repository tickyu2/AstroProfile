# GENESIS - BATCH 2: FACTORIES + ALL 12 ZODIAC SIGNS
## Complete Implementation Package

**Total Files:** 3  
**Installation Time:** 45 minutes  
**Prerequisites:** BATCH 1 installed

---

## 📂 FILE STRUCTURE

```
src/seasonal-ecology/
├── factories/
│   └── seasonalEcologyFactories.ts (FILE 6)
└── data/
    └── allZodiacSigns.ts (FILE 7)
```

---

## 🚀 QUICK START

```bash
# 1. Ensure BATCH 1 is installed
# 2. Create factories directory
mkdir -p src/seasonal-ecology/factories

# 3. Copy files below to their locations
# 4. Verify compilation
npm run type-check
```

---

## FILE 6: factories/seasonalEcologyFactories.ts

```typescript
/**
 * GENESIS - Seasonal Ecological Psychology Engine
 * Factory Functions
 * 
 * Provides:
 * - Strong typing with defaults
 * - Composable overrides
 * - Predictable object shapes
 * - Pre-configured presets
 */

import {
  SeasonImprint,
  ElementProfile,
  TemperamentProfile,
  ModalityProfile,
  AttachmentProfile,
  EcologicalFrame,
  SeasonalPersonalityPanel,
  SignPersonalityProfile
} from '../types/seasonalEcology';

// ============================================================================
// SEASON FACTORY
// ============================================================================

export function createSeasonImprint(
  overrides: Partial<SeasonImprint> = {}
): SeasonImprint {
  return {
    code: "spring",
    name: "Spring",
    lightPattern: "increasing",
    psychologicalImprint: "Emergence, activation, growth orientation",
    environmentalNotes: "Increasing light, rising temperatures, imprint of expansion.",
    dateRange: "MAR 20 – JUN 20",
    ...overrides
  };
}

// ============================================================================
// ELEMENT FACTORIES
// ============================================================================

export function createTemperamentProfile(
  overrides: Partial<TemperamentProfile> = {}
): TemperamentProfile {
  return {
    drive: "medium",
    stability: "medium",
    cognitiveFlexibility: "medium",
    emotionalSensitivity: "medium",
    ...overrides
  };
}

export function createElementProfile(
  overrides: Partial<ElementProfile> = {}
): ElementProfile {
  return {
    code: "fire",
    name: "Fire",
    temperament: createTemperamentProfile(),
    description: "Enthusiastic, initiating, motivated by inspiration and challenge.",
    neurochemicalBias: "dopamine-leaning",
    ...overrides
  };
}

// ============================================================================
// MODALITY FACTORY
// ============================================================================

export function createModalityProfile(
  overrides: Partial<ModalityProfile> = {}
): ModalityProfile {
  return {
    code: "cardinal",
    name: "Cardinal",
    chronotypeMapping: "morning",
    momentumStyle: "Initiates, front-loads energy, starts cycles.",
    energyPattern: "front-loads",
    ...overrides
  };
}

// ============================================================================
// ATTACHMENT FACTORY
// ============================================================================

export function createAttachmentProfile(
  overrides: Partial<AttachmentProfile> = {}
): AttachmentProfile {
  return {
    inferredStyle: "secure",
    basis: {
      modality: "fixed",
      element: "earth"
    },
    notes: "Stable, grounded, consistent in bonding patterns.",
    disclaimer: "This is a general tendency based on constitutional wiring, not a fixed diagnosis.",
    ...overrides
  };
}

// ============================================================================
// ECOLOGICAL FRAME FACTORY
// ============================================================================

export function createEcologicalFrame(
  overrides: Partial<EcologicalFrame> = {}
): EcologicalFrame {
  return {
    summary: "Environmental imprint: season + temperament + circadian momentum.",
    keywords: [
      "seasonal psychology",
      "environmental imprinting",
      "ecological temperament",
      "non-predictive astrology"
    ],
    scientificBasis: [
      "Seasonal Affective Imprinting",
      "Temperament Theory",
      "Circadian Chronotype",
      "Ecological Psychology"
    ],
    ...overrides
  };
}

// ============================================================================
// FULL SEASONAL PERSONALITY PANEL FACTORY
// ============================================================================

export function createSeasonalPersonalityPanel(
  overrides: Partial<SeasonalPersonalityPanel> = {}
): SeasonalPersonalityPanel {
  return {
    season: createSeasonImprint(),
    element: createElementProfile(),
    modality: createModalityProfile(),
    attachmentProfile: createAttachmentProfile(),
    ecologicalFrame: createEcologicalFrame(),
    ...overrides
  };
}

// ============================================================================
// SIGN-LEVEL FACTORY
// ============================================================================

export function createSignPersonalityProfile(
  sign: string,
  symbol: string,
  degreeRange: [number, number],
  panelOverrides: Partial<SeasonalPersonalityPanel> = {}
): SignPersonalityProfile {
  return {
    sign,
    symbol,
    degreeRange,
    panel: createSeasonalPersonalityPanel(panelOverrides)
  };
}

// ============================================================================
// CONVENIENCE PRESETS - SEASONS
// ============================================================================

export const seasonPresets = {
  spring: () => createSeasonImprint({
    code: "spring",
    name: "Spring",
    lightPattern: "increasing",
    psychologicalImprint: "Emergence, activation, growth orientation",
    environmentalNotes: "Increasing light, rising temperatures, early-life imprint of expansion.",
    dateRange: "MAR 20 – JUN 20"
  }),
  
  summer: () => createSeasonImprint({
    code: "summer",
    name: "Summer",
    lightPattern: "peak",
    psychologicalImprint: "Expression, outwardness, radiance",
    environmentalNotes: "Peak sunlight, maximum vitamin D, high-energy baseline.",
    dateRange: "JUN 21 – SEP 22"
  }),
  
  autumn: () => createSeasonImprint({
    code: "autumn",
    name: "Autumn",
    lightPattern: "declining",
    psychologicalImprint: "Preparation, depth, discernment",
    environmentalNotes: "Declining light, harvest energy, conservation wiring.",
    dateRange: "SEP 23 – DEC 20"
  }),
  
  winter: () => createSeasonImprint({
    code: "winter",
    name: "Winter",
    lightPattern: "minimal",
    psychologicalImprint: "Endurance, introspection, conservation",
    environmentalNotes: "Minimal light, low-energy baseline, depth-seeking patterns.",
    dateRange: "DEC 21 – MAR 19"
  })
};

// ============================================================================
// CONVENIENCE PRESETS - ELEMENTS
// ============================================================================

export const elementPresets = {
  fire: () => createElementProfile({
    code: "fire",
    name: "Fire",
    temperament: createTemperamentProfile({
      drive: "high",
      stability: "medium",
      cognitiveFlexibility: "medium",
      emotionalSensitivity: "variable"
    }),
    description: "Enthusiastic, initiating, motivated by inspiration and challenge.",
    neurochemicalBias: "dopamine-leaning"
  }),
  
  earth: () => createElementProfile({
    code: "earth",
    name: "Earth",
    temperament: createTemperamentProfile({
      drive: "medium",
      stability: "high",
      cognitiveFlexibility: "low",
      emotionalSensitivity: "low"
    }),
    description: "Grounded, practical, motivated by tangible results and stability.",
    neurochemicalBias: "serotonin-stable"
  }),
  
  air: () => createElementProfile({
    code: "air",
    name: "Air",
    temperament: createTemperamentProfile({
      drive: "medium",
      stability: "low",
      cognitiveFlexibility: "high",
      emotionalSensitivity: "low"
    }),
    description: "Analytical, communicative, motivated by ideas and connections.",
    neurochemicalBias: "cognitive-flexible"
  }),
  
  water: () => createElementProfile({
    code: "water",
    name: "Water",
    temperament: createTemperamentProfile({
      drive: "low",
      stability: "medium",
      cognitiveFlexibility: "medium",
      emotionalSensitivity: "high"
    }),
    description: "Empathetic, intuitive, motivated by emotional depth and meaning.",
    neurochemicalBias: "limbic-sensitive"
  })
};

// ============================================================================
// CONVENIENCE PRESETS - MODALITIES
// ============================================================================

export const modalityPresets = {
  cardinal: () => createModalityProfile({
    code: "cardinal",
    name: "Cardinal",
    chronotypeMapping: "morning",
    momentumStyle: "Initiates, front-loads energy, starts cycles.",
    energyPattern: "front-loads"
  }),
  
  fixed: () => createModalityProfile({
    code: "fixed",
    name: "Fixed",
    chronotypeMapping: "intermediate",
    momentumStyle: "Sustains, maintains steady rhythm, stabilizes.",
    energyPattern: "steady"
  }),
  
  mutable: () => createModalityProfile({
    code: "mutable",
    name: "Mutable",
    chronotypeMapping: "evening",
    momentumStyle: "Adapts, flexible rhythm, transitions cycles.",
    energyPattern: "flexible"
  })
};

// ============================================================================
// HELPER: Generate attachment from modality + element
// ============================================================================

export function generateAttachment(
  modality: ModalityProfile["code"],
  element: ElementProfile["code"]
): AttachmentProfile {
  // Cardinal + Fire/Water → Anxious
  if (modality === "cardinal" && (element === "fire" || element === "water")) {
    return createAttachmentProfile({
      inferredStyle: "anxious",
      basis: { modality, element },
      notes: "Tends to activate quickly in relationships, seeks reassurance and engagement."
    });
  }
  
  // Fixed + Air/Earth → Avoidant-leaning
  if (modality === "fixed" && (element === "air" || element === "earth")) {
    return createAttachmentProfile({
      inferredStyle: "avoidant",
      basis: { modality, element },
      notes: "Self-regulating, values independence, may create emotional distance."
    });
  }
  
  // Mutable + Water/Fire → Disorganized-leaning
  if (modality === "mutable" && (element === "water" || element === "fire")) {
    return createAttachmentProfile({
      inferredStyle: "disorganized",
      basis: { modality, element },
      notes: "Mixed signals in relationships, high emotional load, adaptive but sometimes conflicted."
    });
  }
  
  // Default → Secure
  return createAttachmentProfile({
    inferredStyle: "secure",
    basis: { modality, element },
    notes: "Stable, grounded, consistent in bonding patterns."
  });
}

// ============================================================================
// COMPLETE SIGN BUILDER (combines everything)
// ============================================================================

export function buildSignProfile(
  sign: string,
  symbol: string,
  degreeRange: [number, number],
  season: keyof typeof seasonPresets,
  element: keyof typeof elementPresets,
  modality: keyof typeof modalityPresets
): SignPersonalityProfile {
  const seasonData = seasonPresets[season]();
  const elementData = elementPresets[element]();
  const modalityData = modalityPresets[modality]();
  const attachmentData = generateAttachment(modality, element);

  return createSignPersonalityProfile(sign, symbol, degreeRange, {
    season: seasonData,
    element: elementData,
    modality: modalityData,
    attachmentProfile: attachmentData,
    ecologicalFrame: createEcologicalFrame()
  });
}
```

---

## FILE 7: data/allZodiacSigns.ts

```typescript
/**
 * GENESIS - Complete Zodiac Sign Profiles
 * All 12 signs using Seasonal Ecological Psychology Engine
 * 
 * Each sign = Season + Element + Modality intersection
 */

import { SignPersonalityProfile } from '../types/seasonalEcology';
import { buildSignProfile } from '../factories/seasonalEcologyFactories';

// ============================================================================
// ALL 12 ZODIAC SIGNS
// ============================================================================

export const zodiacSigns: Record<string, SignPersonalityProfile> = {
  aries: buildSignProfile(
    "Aries",
    "♈",
    [0, 30],
    "spring",
    "fire",
    "cardinal"
  ),
  
  taurus: buildSignProfile(
    "Taurus",
    "♉",
    [30, 60],
    "spring",
    "earth",
    "fixed"
  ),
  
  gemini: buildSignProfile(
    "Gemini",
    "♊",
    [60, 90],
    "spring",
    "air",
    "mutable"
  ),
  
  cancer: buildSignProfile(
    "Cancer",
    "♋",
    [90, 120],
    "summer",
    "water",
    "cardinal"
  ),
  
  leo: buildSignProfile(
    "Leo",
    "♌",
    [120, 150],
    "summer",
    "fire",
    "fixed"
  ),
  
  virgo: buildSignProfile(
    "Virgo",
    "♍",
    [150, 180],
    "summer",
    "earth",
    "mutable"
  ),
  
  libra: buildSignProfile(
    "Libra",
    "♎",
    [180, 210],
    "autumn",
    "air",
    "cardinal"
  ),
  
  scorpio: buildSignProfile(
    "Scorpio",
    "♏",
    [210, 240],
    "autumn",
    "water",
    "fixed"
  ),
  
  sagittarius: buildSignProfile(
    "Sagittarius",
    "♐",
    [240, 270],
    "autumn",
    "fire",
    "mutable"
  ),
  
  capricorn: buildSignProfile(
    "Capricorn",
    "♑",
    [270, 300],
    "winter",
    "earth",
    "cardinal"
  ),
  
  aquarius: buildSignProfile(
    "Aquarius",
    "♒",
    [300, 330],
    "winter",
    "air",
    "fixed"
  ),
  
  pisces: buildSignProfile(
    "Pisces",
    "♓",
    [330, 360],
    "winter",
    "water",
    "mutable"
  )
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get sign profile by name (case-insensitive)
 */
export function getSignProfile(signName: string): SignPersonalityProfile | undefined {
  return zodiacSigns[signName.toLowerCase()];
}

/**
 * Get sign by absolute degree (0-360)
 */
export function getSignByDegree(degree: number): SignPersonalityProfile | undefined {
  const normalizedDegree = ((degree % 360) + 360) % 360; // Handle negative degrees
  
  for (const sign of Object.values(zodiacSigns)) {
    const [start, end] = sign.degreeRange;
    if (normalizedDegree >= start && normalizedDegree < end) {
      return sign;
    }
  }
  
  return undefined;
}

/**
 * Get all signs for a specific season
 */
export function getSignsBySeason(season: "spring" | "summer" | "autumn" | "winter"): SignPersonalityProfile[] {
  return Object.values(zodiacSigns).filter(
    sign => sign.panel.season.code === season
  );
}

/**
 * Get all signs for a specific element
 */
export function getSignsByElement(element: "fire" | "earth" | "air" | "water"): SignPersonalityProfile[] {
  return Object.values(zodiacSigns).filter(
    sign => sign.panel.element.code === element
  );
}

/**
 * Get all signs for a specific modality
 */
export function getSignsByModality(modality: "cardinal" | "fixed" | "mutable"): SignPersonalityProfile[] {
  return Object.values(zodiacSigns).filter(
    sign => sign.panel.modality.code === modality
  );
}

/**
 * Get all fire signs (Aries, Leo, Sagittarius)
 */
export function getFireSigns(): SignPersonalityProfile[] {
  return getSignsByElement("fire");
}

/**
 * Get all earth signs (Taurus, Virgo, Capricorn)
 */
export function getEarthSigns(): SignPersonalityProfile[] {
  return getSignsByElement("earth");
}

/**
 * Get all air signs (Gemini, Libra, Aquarius)
 */
export function getAirSigns(): SignPersonalityProfile[] {
  return getSignsByElement("air");
}

/**
 * Get all water signs (Cancer, Scorpio, Pisces)
 */
export function getWaterSigns(): SignPersonalityProfile[] {
  return getSignsByElement("water");
}

/**
 * Get all cardinal signs (Aries, Cancer, Libra, Capricorn)
 */
export function getCardinalSigns(): SignPersonalityProfile[] {
  return getSignsByModality("cardinal");
}

/**
 * Get all fixed signs (Taurus, Leo, Scorpio, Aquarius)
 */
export function getFixedSigns(): SignPersonalityProfile[] {
  return getSignsByModality("fixed");
}

/**
 * Get all mutable signs (Gemini, Virgo, Sagittarius, Pisces)
 */
export function getMutableSigns(): SignPersonalityProfile[] {
  return getSignsByModality("mutable");
}

/**
 * Get sign name from degree
 */
export function getSignNameByDegree(degree: number): string | undefined {
  const sign = getSignByDegree(degree);
  return sign?.sign;
}

/**
 * Get all 12 signs as array (in zodiac order)
 */
export function getAllSignsOrdered(): SignPersonalityProfile[] {
  return [
    zodiacSigns.aries,
    zodiacSigns.taurus,
    zodiacSigns.gemini,
    zodiacSigns.cancer,
    zodiacSigns.leo,
    zodiacSigns.virgo,
    zodiacSigns.libra,
    zodiacSigns.scorpio,
    zodiacSigns.sagittarius,
    zodiacSigns.capricorn,
    zodiacSigns.aquarius,
    zodiacSigns.pisces
  ];
}
```

---

## USAGE EXAMPLES

```typescript
// Example 1: Get a specific sign
import { getSignProfile } from './data/allZodiacSigns';

const taurus = getSignProfile("taurus");
console.log(taurus.panel.season.name); // "Spring"
console.log(taurus.panel.element.name); // "Earth"
console.log(taurus.panel.modality.name); // "Fixed"

// Example 2: Find sign by degree
import { getSignByDegree } from './data/allZodiacSigns';

const mySign = getSignByDegree(45); // 45° = Taurus
console.log(mySign.sign); // "Taurus"

// Example 3: Get all fire signs
import { getFireSigns } from './data/allZodiacSigns';

const fireSigns = getFireSigns();
// Returns: Aries, Leo, Sagittarius

// Example 4: Build custom profile
import { buildSignProfile } from './factories/seasonalEcologyFactories';

const customProfile = buildSignProfile(
  "Taurus",
  "♉",
  [30, 60],
  "spring",
  "earth",
  "fixed"
);
```

---

## ZODIAC SIGN SUMMARY

| Sign | Symbol | Degrees | Season | Element | Modality | Attachment |
|------|--------|---------|--------|---------|----------|------------|
| Aries | ♈ | 0-30 | Spring | Fire | Cardinal | Anxious |
| Taurus | ♉ | 30-60 | Spring | Earth | Fixed | Avoidant |
| Gemini | ♊ | 60-90 | Spring | Air | Mutable | Secure |
| Cancer | ♋ | 90-120 | Summer | Water | Cardinal | Anxious |
| Leo | ♌ | 120-150 | Summer | Fire | Fixed | Secure |
| Virgo | ♍ | 150-180 | Summer | Earth | Mutable | Secure |
| Libra | ♎ | 180-210 | Autumn | Air | Cardinal | Secure |
| Scorpio | ♏ | 210-240 | Autumn | Water | Fixed | Avoidant |
| Sagittarius | ♐ | 240-270 | Autumn | Fire | Mutable | Disorganized |
| Capricorn | ♑ | 270-300 | Winter | Earth | Cardinal | Secure |
| Aquarius | ♒ | 300-330 | Winter | Air | Fixed | Avoidant |
| Pisces | ♓ | 330-360 | Winter | Water | Mutable | Disorganized |

---

## ✅ BATCH 2 COMPLETION CHECKLIST

- [ ] Create `src/seasonal-ecology/factories/` directory
- [ ] Add FILE 6: seasonalEcologyFactories.ts
- [ ] Add FILE 7: allZodiacSigns.ts  
- [ ] Verify TypeScript compilation: `npm run type-check`
- [ ] Test: `import { getSignProfile } from './data/allZodiacSigns'`
- [ ] Commit: "feat: add factory functions and complete zodiac data"

---

## 🎯 NEXT STEPS

With BATCH 1 + BATCH 2 complete, you now have:
- ✅ Complete type system
- ✅ Data validation
- ✅ Factory functions
- ✅ All 12 zodiac signs
- ✅ Helper utilities

**Ready for BATCH 3:** React Hooks + D3 Transformers 🔥🐉
