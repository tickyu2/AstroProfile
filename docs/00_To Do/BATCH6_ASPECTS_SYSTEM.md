# GENESIS - BATCH 6: ASPECTS SYSTEM + INTERACTIVE MATRIX
## Complete Aspects Education + 12×12 Matrix

**Total Files:** 8  
**Installation Time:** 2.5 hours  
**Prerequisites:** BATCH 1-5 installed

---

## 📂 FILE STRUCTURE

```
src/seasonal-ecology/
├── data/
│   └── aspectsData.ts (FILE 30)
├── components/
│   ├── AspectsTab.tsx (FILE 31)
│   ├── AspectsTab.css (FILE 32)
│   ├── AspectsMatrix.tsx (FILE 33)
│   ├── AspectsMatrix.css (FILE 34)
│   ├── FloatingPanel.tsx (FILE 35)
│   ├── FloatingPanel.css (FILE 36)
│   └── StudyTheWheelEnhanced.tsx (FILE 37 - Updated)
```

---

## FILE 30: data/aspectsData.ts

```typescript
/**
 * Complete Aspects Data
 * History, significance, meaning, and 12×12 matrix calculations
 */

export interface AspectInfo {
  name: string;
  symbol: string;
  degree: number;
  orb: number; // Allowable deviation in degrees
  nature: "major" | "minor";
  harmony: "harmonious" | "challenging" | "neutral";
  starRating: 1 | 2 | 3 | 4 | 5;
  color: string;
  description: string;
  meaning: string;
  keywords: string[];
  psychologicalEffect: string;
  manifestation: string;
}

// ============================================================================
// THE 10 MAJOR ASPECTS
// ============================================================================

export const ASPECTS: Record<string, AspectInfo> = {
  conjunction: {
    name: "Conjunction",
    symbol: "☌",
    degree: 0,
    orb: 10,
    nature: "major",
    harmony: "neutral",
    starRating: 5,
    color: "#FFD700",
    description: "Two planets in the same sign, merging their energies",
    meaning: "Unity, fusion, concentration of energy",
    keywords: ["merge", "intensify", "unify", "concentrate"],
    psychologicalEffect: "Blending of two principles into one unified expression",
    manifestation: "Strong focus, amplification, potential for both harmony and conflict"
  },
  
  opposition: {
    name: "Opposition",
    symbol: "☍",
    degree: 180,
    orb: 10,
    nature: "major",
    harmony: "challenging",
    starRating: 4,
    color: "#FF4444",
    description: "Planets exactly opposite each other across the wheel",
    meaning: "Polarity, tension, awareness through contrast",
    keywords: ["tension", "awareness", "balance", "projection"],
    psychologicalEffect: "Heightened awareness of both ends of an axis",
    manifestation: "Need to integrate opposing forces, potential for projection"
  },
  
  trine: {
    name: "Trine",
    symbol: "△",
    degree: 120,
    orb: 8,
    nature: "major",
    harmony: "harmonious",
    starRating: 5,
    color: "#44FF44",
    description: "Planets 120° apart, connecting compatible elements",
    meaning: "Ease, flow, natural talent",
    keywords: ["ease", "flow", "talent", "blessing"],
    psychologicalEffect: "Effortless expression, natural ability",
    manifestation: "Grace, gifts, but may lack motivation to develop fully"
  },
  
  square: {
    name: "Square",
    symbol: "□",
    degree: 90,
    orb: 8,
    nature: "major",
    harmony: "challenging",
    starRating: 3,
    color: "#FF8844",
    description: "Planets 90° apart, creating friction and motivation",
    meaning: "Challenge, growth through effort, dynamic tension",
    keywords: ["friction", "growth", "challenge", "motivation"],
    psychologicalEffect: "Internal pressure driving development",
    manifestation: "Obstacles that force growth, mastery through struggle"
  },
  
  sextile: {
    name: "Sextile",
    symbol: "⚹",
    degree: 60,
    orb: 6,
    nature: "major",
    harmony: "harmonious",
    starRating: 4,
    color: "#4444FF",
    description: "Planets 60° apart, creating opportunities",
    meaning: "Opportunity, cooperation, skill development",
    keywords: ["opportunity", "cooperation", "skill", "communication"],
    psychologicalEffect: "Ability to connect different areas easily",
    manifestation: "Opportunities that require action to activate"
  },
  
  quincunx: {
    name: "Quincunx (Inconjunct)",
    symbol: "⚻",
    degree: 150,
    orb: 3,
    nature: "minor",
    harmony: "challenging",
    starRating: 2,
    color: "#AA44AA",
    description: "Planets 150° apart, requiring adjustment",
    meaning: "Adjustment, redirection, integration of incompatibles",
    keywords: ["adjust", "redirect", "strain", "health"],
    psychologicalEffect: "Constant need for recalibration",
    manifestation: "Health issues, need for lifestyle adjustments"
  },
  
  semisextile: {
    name: "Semi-Sextile",
    symbol: "⚺",
    degree: 30,
    orb: 2,
    nature: "minor",
    harmony: "neutral",
    starRating: 2,
    color: "#AAAAAA",
    description: "Adjacent signs, requiring conscious bridging",
    meaning: "Slight friction, conscious integration needed",
    keywords: ["bridge", "integrate", "subtle", "conscious"],
    psychologicalEffect: "Mild discomfort requiring attention",
    manifestation: "Small adjustments that accumulate over time"
  },
  
  semisquare: {
    name: "Semi-Square",
    symbol: "∠",
    degree: 45,
    orb: 2,
    nature: "minor",
    harmony: "challenging",
    starRating: 2,
    color: "#FF6666",
    description: "Half a square, creating subtle irritation",
    meaning: "Friction, minor obstacles, irritation",
    keywords: ["irritate", "friction", "minor", "persistent"],
    psychologicalEffect: "Nagging discomfort",
    manifestation: "Small but persistent challenges"
  },
  
  sesquisquare: {
    name: "Sesquisquare",
    symbol: "⚼",
    degree: 135,
    orb: 2,
    nature: "minor",
    harmony: "challenging",
    starRating: 2,
    color: "#FF8866",
    description: "One and a half squares, subtle stress",
    meaning: "Tension, stress, need for release",
    keywords: ["stress", "release", "adjustment", "subtle"],
    psychologicalEffect: "Subtle background tension",
    manifestation: "Stress that builds until addressed"
  },
  
  quintile: {
    name: "Quintile",
    symbol: "Q",
    degree: 72,
    orb: 2,
    nature: "minor",
    harmony: "harmonious",
    starRating: 3,
    color: "#44AAFF",
    description: "Creative aspect, one-fifth of the circle",
    meaning: "Creativity, talent, genius",
    keywords: ["creative", "talent", "genius", "unique"],
    psychologicalEffect: "Special creative gifts",
    manifestation: "Unique abilities, artistic expression"
  }
};

// ============================================================================
// ASPECTS EDUCATIONAL CONTENT (5W+H+Emotion)
// ============================================================================

export const aspectsEducation = {
  what: {
    title: "What Are Aspects?",
    content: `Aspects are the **geometric angles** between planets on the zodiac wheel. When two planets form specific angles (0°, 60°, 90°, 120°, 180°), they create a relationship that influences how their energies interact.

Think of aspects as **conversations between planets**:
- Some conversations are harmonious (trine, sextile)
- Some are challenging (square, opposition)
- Some are intense (conjunction)

Aspects reveal the **dynamic relationships** in your chart — not static traits, but ongoing dialogues between different parts of your psyche.`,
    
    analogy: "If planets are actors, aspects are their stage chemistry — how they play off each other, support each other, or create dramatic tension."
  },

  why: {
    title: "Why Aspects Matter",
    content: `Aspects are the **engines of development** in your chart. Without aspects, planets would just sit in signs, static and isolated. Aspects create:

**Dynamic Tension:** Squares and oppositions force growth through challenge
**Natural Flow:** Trines and sextiles show where life comes easily
**Concentration:** Conjunctions amplify and intensify
**Complexity:** Multiple aspects create the rich texture of human experience

**Emotionally:** Aspects explain why you feel pulled in different directions, why some areas flow naturally while others require constant effort, and why certain life themes keep recurring.`,
    
    deeperWhy: "Your aspects are your **soul's curriculum** — the lessons you're here to learn through the interplay of planetary energies."
  },

  when: {
    title: "When Aspects Activate",
    content: `Aspects in your natal chart are **always present**, but they activate more intensely at specific times:

**1. By Transit**
When a moving planet forms an aspect to a natal planet
Example: Saturn square your natal Moon = emotional maturity test

**2. By Progression**
When your progressed chart forms new aspects
Example: Progressed Moon trine natal Venus = period of emotional ease

**3. By Solar Return**
Aspects formed in your birthday chart for that year
Example: Sun conjunct Jupiter in return = expansive year

**4. By Conscious Attention**
When you become aware of an aspect pattern
Awareness itself can transform challenging aspects into growth catalysts

**Developmentally:** Aspects mature over your lifetime — a difficult square at 25 may become integrated wisdom at 55.`
  },

  where: {
    title: "Where Aspects Manifest",
    content: `Aspects manifest in the **life areas** (houses) where the planets reside:

**Example: Mars square Saturn**
- If Mars is in 7th house (relationships) and Saturn in 10th (career)
- Manifestation: Career ambitions (Saturn 10th) create relationship friction (Mars 7th)

**Example: Venus trine Jupiter**
- If Venus is in 2nd house (money) and Jupiter in 6th (work)
- Manifestation: Work (Jupiter 6th) naturally generates income (Venus 2nd)

**Psychologically:** Aspects play out in your **internal world** as:
- Conflicting desires (square)
- Supportive impulses (trine)
- Awareness of opposites (opposition)
- Merged drives (conjunction)

**Externally:** Aspects attract people and situations that mirror your internal aspect patterns.`
  },

  who: {
    title: "Who Experiences Aspects",
    content: `**Everyone** has aspects — a chart without aspects is impossible (planets are always at *some* angle to each other).

**Different Aspect Patterns:**

**T-Square Person** (2 squares + 1 opposition)
Feels constant pressure to resolve tension, often high achievers

**Grand Trine Person** (3 trines forming triangle)
Life flows easily but may lack drive, needs external motivation

**Grand Cross Person** (4 squares forming cross)
Intense internal tension, capacity for major transformation

**Stellium Person** (3+ conjunctions)
Concentrated focus in one area, theme of integration

**Kite Pattern** (Grand trine + sextiles + opposition)
Natural talents (trine) with direction (opposition)

**Yod (Finger of God)** (2 quincunxes + sextile)
Destiny pattern, feels pulled toward specific life purpose

Your aspect pattern is your **developmental blueprint** — the unique curriculum your soul chose for growth.`
  },

  how: {
    title: "How to Work With Aspects",
    content: `**1. Identify Your Dominant Aspect Pattern**
- Count: How many trines vs. squares vs. oppositions?
- Pattern: Do you have a T-square, Grand Trine, or other configuration?

**2. Understand the Conversation**
- Harmonious aspects: Recognize natural talents, avoid complacency
- Challenging aspects: Accept the tension, use it as fuel for growth
- Neutral aspects: Explore consciously, integrate gradually

**3. Developmental Approach**
**Childhood (0-29):** Aspects feel like external events
**Saturn Return (29-30):** Begin to own your aspect patterns
**Midlife (40-50):** Integrate previously split aspects
**Wisdom Years (60+):** Aspects become sources of mastery

**4. Practical Integration**
**For Squares:** Set concrete goals that require the friction
**For Oppositions:** Practice seeing both sides consciously
**For Trines:** Add challenge to prevent stagnation
**For Conjunctions:** Separate the merged energies when needed

**5. Therapeutic Approach**
Talk to your aspects as if they're internal characters having a dialogue. Example:
- Mars (action) square Saturn (restraint)
- Dialogue: "What does my Mars want? What does my Saturn fear?"
- Integration: Find timing where both can be honored`
  },

  emotion: {
    title: "The Emotional Landscape of Aspects",
    content: `**Conjunction** 🔥
*Feels like:* Intensity, wholeness, sometimes overwhelm
*Emotional tone:* "These two parts of me are ONE"

**Opposition** ⚖️
*Feels like:* Being pulled in two directions, awareness through contrast
*Emotional tone:* "I see both sides but struggle to hold both"

**Trine** 🌊
*Feels like:* Ease, grace, natural flow
*Emotional tone:* "This just works, no effort needed"

**Square** ⚡
*Feels like:* Friction, pressure, motivation to act
*Emotional tone:* "Something must change, I can't stay here"

**Sextile** 🤝
*Feels like:* Opportunity, potential, connection
*Emotional tone:* "I could do something with this"

**Quincunx** 🔄
*Feels like:* Awkwardness, need for adjustment
*Emotional tone:* "These pieces don't quite fit, but I'll make it work"

**The Deeper Feeling:**
Your aspects are your **internal weather system** — the patterns of pressure and flow that create your emotional climate. Learning to read your aspects is learning to read your own soul's language.`
  },

  history: {
    title: "Historical Significance of Aspects",
    content: `**Ancient Origins (Babylon, 2nd millennium BCE)**
Babylonians first observed planetary angles, noting correlations with earthly events

**Greek Systematization (Ptolemy, 2nd century CE)**
*Tetrabiblos* formalized the major aspects:
- Trine (120°): "harmonious" (same element)
- Square (90°): "inharmonious" (conflicting elements)
- Opposition (180°): "confrontational" (opposing signs)
- Sextile (60°): "cooperative" (compatible elements)

**Medieval Elaboration (8th-15th centuries)**
Added minor aspects, orbs, and dignities
Developed aspect weighting systems

**Psychological Revolution (20th century)**
**Carl Jung:** Aspects as archetypal dialogues
**Dane Rudhyar:** Aspects as **phases of relationship** between planets
**Modern synthesis:** Aspects as **developmental patterns**

**Why It Matters Today:**
Aspects bridge **astronomy** (mathematical angles) and **psychology** (internal dynamics). They're the most *objectively verifiable* part of astrology — the angles are pure geometry, the meanings emerge from centuries of observation.`
  }
};

// ============================================================================
// 12×12 ASPECTS MATRIX CALCULATOR
// ============================================================================

export interface MatrixCell {
  sign1: string;
  sign2: string;
  degree: number;
  aspectName: string;
  aspectSymbol: string;
  starRating: number;
  harmony: "harmonious" | "challenging" | "neutral";
  color: string;
  meaning: string;
}

/**
 * Calculate aspect between two zodiac signs
 * @param sign1Index - Index of first sign (0-11)
 * @param sign2Index - Index of second sign (0-11)
 * @returns MatrixCell with aspect information
 */
export function calculateSignAspect(
  sign1Index: number,
  sign2Index: number,
  sign1Name: string,
  sign2Name: string
): MatrixCell {
  // Calculate angular distance (shortest path around circle)
  let diff = Math.abs(sign2Index - sign1Index);
  if (diff > 6) diff = 12 - diff;
  
  const degree = diff * 30; // Each sign is 30°

  // Determine aspect based on degree
  let aspectKey: string;
  if (degree === 0) aspectKey = 'conjunction';
  else if (degree === 30) aspectKey = 'semisextile';
  else if (degree === 60) aspectKey = 'sextile';
  else if (degree === 90) aspectKey = 'square';
  else if (degree === 120) aspectKey = 'trine';
  else if (degree === 150) aspectKey = 'quincunx';
  else if (degree === 180) aspectKey = 'opposition';
  else aspectKey = 'none';

  const aspect = ASPECTS[aspectKey] || {
    name: "No Major Aspect",
    symbol: "—",
    starRating: 1,
    harmony: "neutral" as const,
    color: "#666666",
    description: "No major aspect between these signs"
  };

  return {
    sign1: sign1Name,
    sign2: sign2Name,
    degree,
    aspectName: aspect.name,
    aspectSymbol: aspect.symbol,
    starRating: aspect.starRating,
    harmony: aspect.harmony,
    color: aspect.color,
    meaning: aspect.description
  };
}

/**
 * Generate complete 12×12 aspects matrix
 */
export function generateAspectsMatrix(): MatrixCell[][] {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  const matrix: MatrixCell[][] = [];

  for (let i = 0; i < 12; i++) {
    const row: MatrixCell[] = [];
    for (let j = 0; j < 12; j++) {
      row.push(calculateSignAspect(i, j, signs[i], signs[j]));
    }
    matrix.push(row);
  }

  return matrix;
}
```

---

*Continuing with React components in next file due to length...*
