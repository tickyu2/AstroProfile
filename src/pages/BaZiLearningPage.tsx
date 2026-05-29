/**
 * BaZi Learning Page
 *
 * Interactive educational page for exploring Four Pillars via rotating wheels.
 * Each pillar (Year, Month, Day, Hour) has a Stem wheel (10) and Branch wheel (12).
 * Uses client-side calculateBaZi() for instant responsiveness.
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';
import { calculateBaZi } from '../utils/baziCalculator';
import {
  dateToCalcInput,
  ELEMENT_COLORS,
  ELEMENT_GLYPHS,
  POLARITY_ICONS,
  STEM_SEGMENTS,
  BRANCH_SEGMENTS,
  DAY_MASTER_DESCRIPTIONS,
  getElementWeather,
  detectElementStorms,
  getAlignmentData,
  buildDestinyYears,
  buildFateCurrents,
  computeSynastryLinks,
  extractLifeThemes,
  buildStorybookNarrative,
  getSeasonFromMonthBranch,
  getSolarTermIndex,
  SOLAR_TERMS,
  type ElementStormAlert,
  type AlignmentData,
  type DestinyYear,
  type FateCurrentPoint,
  type SynastryLink,
  type LifeTheme,
  trueSolarTimeOffset,
  applyTrueSolarTime,
  trueSolarTimeBreakdown,
  type TstBreakdown,
} from '../utils/baziWheels';
import {
  BaziThemeProvider,
  FourPillarsGrid,
  DayMasterCard,
} from '../components/bazi';
import BaZiFourPillarWheels from '../components/bazi/BaZiFourPillarWheels';
import BaziLegendPanel from '../components/bazi/BaziLegendPanel';
import type { StructuredReading, MasterCommentary, ShadowReading, ReadingMode } from '../utils/buildPremiumBaZiPayload';
import { READING_SECTION_META, MASTER_SECTION_META, SHADOW_SECTION_META } from '../utils/buildPremiumBaZiPayload';
import FloatingMdWindow from '../components/shared/FloatingMdWindow';
import IdentityArchitecturePanel from '../components/bazi/identity-architecture';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { generateBaziReading as triggerBaziReading, onBaziReadingUpdate, loadSavedReading } from '../services/baziReadingService';

// =============================================================================
// CHUNKED FIRESTORE HELPERS — handles docs > 1 MB Firestore limit
// =============================================================================
const CHUNK_CHAR_LIMIT = 800_000; // ~800 KB per chunk, safely under Firestore's ~1 MB field limit
const MAX_CHUNKS = 10;            // ceiling for cleanup (supports up to ~8 MB docs)

/** Save content to Firestore, splitting across chunk docs if needed. */
async function saveChunkedContent(basePath: string, content: string): Promise<void> {
  const baseRef = doc(db, basePath);
  if (content.length <= CHUNK_CHAR_LIMIT) {
    // Small enough for a single doc — save directly and clean up any old chunks
    await setDoc(baseRef, { content, updatedAt: new Date().toISOString() });
    // Fire-and-forget cleanup of leftover chunks from a previous larger version
    for (let i = 0; i < MAX_CHUNKS; i++) {
      deleteDoc(doc(db, `${basePath}_chunk_${i}`)).catch(() => {});
    }
    return;
  }
  // Split into chunks
  const chunks: string[] = [];
  for (let start = 0; start < content.length; start += CHUNK_CHAR_LIMIT) {
    chunks.push(content.slice(start, start + CHUNK_CHAR_LIMIT));
  }
  // Write all chunks + header in a batch
  const batch = writeBatch(db);
  batch.set(baseRef, { chunked: true, chunkCount: chunks.length, updatedAt: new Date().toISOString() });
  chunks.forEach((chunk, i) => {
    batch.set(doc(db, `${basePath}_chunk_${i}`), { content: chunk });
  });
  await batch.commit();
  // Clean up any excess old chunks beyond current count
  for (let i = chunks.length; i < MAX_CHUNKS; i++) {
    deleteDoc(doc(db, `${basePath}_chunk_${i}`)).catch(() => {});
  }
}

/** Load content from Firestore, reassembling chunks if needed. Returns '' if not found. */
async function loadChunkedContent(basePath: string): Promise<string> {
  const baseSnap = await getDoc(doc(db, basePath));
  if (!baseSnap.exists()) return '';
  const data = baseSnap.data();
  // Single-doc case
  if (!data.chunked) {
    return (typeof data.content === 'string') ? data.content : '';
  }
  // Chunked case — read all chunks in parallel
  const count = data.chunkCount || 0;
  const chunkSnaps = await Promise.all(
    Array.from({ length: count }, (_, i) => getDoc(doc(db, `${basePath}_chunk_${i}`)))
  );
  return chunkSnaps.map(snap => snap.exists() ? (snap.data().content || '') : '').join('');
}

// =============================================================================
// HIDDEN STEMS EDUCATIONAL CONTENT
// =============================================================================

const HIDDEN_STEMS_MD = `# Hidden Stems 藏干 — Complete Reference

## What Are Hidden Stems?

In BaZi, each of the **12 Earthly Branches** (地支) contains one or more **Hidden Stems** (藏干, cáng gān) — Heavenly Stems concealed within the branch. These hidden stems reveal the **elemental composition** beneath each animal sign. While the branch tells you *which* animal, the hidden stems tell you *what elements are actually inside*.

Think of it this way: the Earthly Branch is the house, and the Hidden Stems are the residents living inside.

---

## Complete Hidden Stems Table

| # | Branch | Animal | Hidden Stem 1 (Main 本氣) | Hidden Stem 2 (Middle 中氣) | Hidden Stem 3 (Residual 餘氣) |
|---|--------|--------|--------------------------|---------------------------|------------------------------|
| 1 | 子 | Rat | 癸 Yin Water **100%** | — | — |
| 2 | 丑 | Ox | 己 Yin Earth **60%** | 辛 Yin Metal **30%** | 癸 Yin Water **10%** |
| 3 | 寅 | Tiger | 甲 Yang Wood **60%** | 丙 Yang Fire **30%** | 戊 Yang Earth **10%** |
| 4 | 卯 | Rabbit | 乙 Yin Wood **100%** | — | — |
| 5 | 辰 | Dragon | 戊 Yang Earth **60%** | 乙 Yin Wood **20%** | 癸 Yin Water **20%** |
| 6 | 巳 | Snake | 丙 Yang Fire **60%** | 戊 Yang Earth **30%** | 庚 Yang Metal **10%** |
| 7 | 午 | Horse | 丁 Yin Fire **70%** | 己 Yin Earth **30%** | — |
| 8 | 未 | Goat | 己 Yin Earth **60%** | 丁 Yin Fire **30%** | 乙 Yin Wood **10%** |
| 9 | 申 | Monkey | 庚 Yang Metal **60%** | 壬 Yang Water **30%** | 戊 Yang Earth **10%** |
| 10 | 酉 | Rooster | 辛 Yin Metal **100%** | — | — |
| 11 | 戌 | Dog | 戊 Yang Earth **60%** | 辛 Yin Metal **30%** | 丁 Yin Fire **10%** |
| 12 | 亥 | Pig | 壬 Yang Water **70%** | 甲 Yang Wood **30%** | — |

---

## Why Do Some Animals Have 1, 2, or 3 Hidden Stems?

The number of hidden stems reflects the branch's **seasonal position** and **elemental purity**.

### Pure Branches — 1 Hidden Stem (100%)

**子 Rat, 卯 Rabbit, 酉 Rooster** each contain only one hidden stem at 100%.

These are the **cardinal branches** (四正) — they sit at the exact peak of their respective season:
- 子 Rat = peak of Winter → pure 癸 Yin Water
- 卯 Rabbit = peak of Spring → pure 乙 Yin Wood
- 酉 Rooster = peak of Autumn → pure 辛 Yin Metal

They are also the **Peach Blossom** (桃花) branches. Their purity means one thing elementally: no mixture, no internal tension, no competing energies. What you see is what you get.

### Dual Branches — 2 Hidden Stems

**午 Horse** (丁 70%, 己 30%) and **亥 Pig** (壬 70%, 甲 30%) contain exactly two hidden stems.

- 午 Horse: peak of Summer Fire, but Fire has already begun producing Earth (Fire → Earth in the producing cycle). The 30% Earth is the ash that Fire creates.
- 亥 Pig: peak of late Autumn/early Winter Water, but Water already nurtures the seed of Wood for the coming Spring. The 30% Wood is the seed of next season.

### Triple Branches — 3 Hidden Stems

**丑 Ox, 寅 Tiger, 辰 Dragon, 巳 Snake, 未 Goat, 申 Monkey, 戌 Dog** — the remaining seven branches — each contain three hidden stems.

These are **seasonal transition** branches. They carry:
1. **Main Qi 本氣** (60%) — the dominant element of the current season
2. **Middle Qi 中氣** (20-30%) — the element being generated or transitioning in
3. **Residual Qi 餘氣** (10-20%) — remnant of the departing season

Example — 寅 Tiger (early Spring):
- 甲 Yang Wood 60% — Spring Wood is dominant (current season)
- 丙 Yang Fire 30% — Fire is rising (Wood produces Fire)
- 戊 Yang Earth 10% — Earth residual from late Winter transition

The triple branches are the most **elementally complex** — they contain internal dynamics, competing energies, and richer constitutional profiles.

---

## The Four Storage Branches 四庫

Four of the triple-stem branches are called **Storage** or **Tomb** branches (庫/墓):

| Branch | Storage Of | Season |
|--------|-----------|--------|
| 辰 Dragon | Water Storage 水庫 | late Spring |
| 未 Goat | Wood Storage 木庫 | late Summer |
| 戌 Dog | Fire Storage 火庫 | late Autumn |
| 丑 Ox | Metal Storage 金庫 | late Winter |

These branches store and contain elemental energy from the preceding cycle. When your Day Branch is a Storage branch, it means your foundation *holds* energy in reserve — depth, containment, stored power that may not be immediately visible.

---

## How Hidden Stems Are Used in Calculations

### 1. Constitutional Element Balance

Hidden stems determine your **Day Pillar's elemental composition**. The formula:

- **Heavenly Stem** = 1/11 of Day Pillar (~9.1%)
- **Earthly Branch** = 10/11 of Day Pillar (~90.9%)
- Each hidden stem's percentage multiplies against the branch weight

### 2. Worked Example: 庚午 (Yang Metal Horse)

| Component | Element | Calculation | Result |
|-----------|---------|-------------|--------|
| 庚 (Stem) | Metal | 9.1% (stem weight) | **9.1% Metal** |
| 丁 (Hidden, 70%) | Fire | 70% × 90.9% | **63.6% Fire** |
| 己 (Hidden, 30%) | Earth | 30% × 90.9% | **27.3% Earth** |
| **Total** | | | **100%** |

Result: 庚午 is constitutionally 63.6% Fire, 27.3% Earth, 9.1% Metal — with 0% Water and 0% Wood. The hidden stems reveal that despite having a Metal Day Master, this person's foundation is overwhelmingly Fire.

### 3. Worked Example: 癸未 (Yin Water Goat)

| Component | Element | Calculation | Result |
|-----------|---------|-------------|--------|
| 癸 (Stem) | Water | 9.1% | **9.1% Water** |
| 己 (Hidden, 60%) | Earth | 60% × 90.9% | **54.5% Earth** |
| 丁 (Hidden, 30%) | Fire | 30% × 90.9% | **27.3% Fire** |
| 乙 (Hidden, 10%) | Wood | 10% × 90.9% | **9.1% Wood** |
| **Total** | | | **100%** |

Result: 癸未's Day Master is Water (9.1%), but the foundation is dominated by Earth (54.5%). The hidden stems reveal the "spring inside the mountain" — a small Water identity surrounded by controlling Earth.

### 4. Ten God Relationships

Each hidden stem has a **Ten God** (十神) relationship with the Day Master. This reveals the *relational energy* within your own Day Pillar:

Example — Day Master 庚 (Yang Metal) on 午 Horse:
- 丁 Yin Fire (70%) → controls Metal with different polarity → **Direct Officer 正官** (structure, authority)
- 己 Yin Earth (30%) → produces Metal with different polarity → **Direct Resource 正印** (nourishment, support)

This means 庚午's internal foundation provides structure (Officer) and nourishment (Resource) — "the blade sitting in its own forge."

### 5. Compatibility Scoring

When comparing two Day Pillars for compatibility, hidden stems determine **what each person's chart elementally provides**. A partner whose hidden stems supply your missing elements scores higher.

---

## What Insights Do Hidden Stems Provide?

### Constitutional Strengths & Deficits
Hidden stems reveal which elements are **present, dominant, trace, or completely absent** in your constitution. An element at 0% represents a critical deficit that must be supplied externally — through relationships, environments, or deliberate practice.

### TCM Health Correspondences
Each element maps to organ systems in Traditional Chinese Medicine:
- **Wood** → Liver / Gallbladder (tendons, eyes, decision-making)
- **Fire** → Heart / Small Intestine (circulation, joy, speech)
- **Earth** → Spleen / Stomach (digestion, muscles, worry)
- **Metal** → Lungs / Large Intestine (breathing, skin, grief)
- **Water** → Kidneys / Bladder (bones, ears, willpower)

Excess or deficiency of hidden stem elements points to potential health vulnerabilities.

### Why the Same Animal Creates Different Constitutions
The Tiger branch (寅) always contains 甲 60%, 丙 30%, 戊 10%. But a **甲寅** (Yang Wood Tiger) pillar has Wood in both stem AND branch — extremely Wood-dominant. While a **庚寅** (Yang Metal Tiger) pillar has Metal in the stem but Wood/Fire/Earth in the branch — creating internal tension between the Metal identity and the Wood-Fire foundation.

The hidden stems are constant for each branch. What changes is the **Heavenly Stem sitting on top** — and that changes the Ten God relationships, the elemental balance, and the entire constitutional story.

### The "Hidden Depths" of Personality
Hidden stems are called "hidden" (藏) for a reason. They represent the **inner landscape** — the elements working beneath the surface. The Heavenly Stem is what people see first. The hidden stems are what people discover when they go deeper. This is why BaZi readings that ignore hidden stems miss the most important part of the constitution.
`;

// EDUCATION FLAPS
// =============================================================================

const EDUCATION_SECTIONS = [
  {
    title: 'What are Heavenly Stems? (天干)',
    content: `The 10 Heavenly Stems represent the 5 elements in Yang and Yin polarities. They cycle through:

**甲 Jiǎ** (Yang Wood) → **乙 Yǐ** (Yin Wood) → **丙 Bǐng** (Yang Fire) → **丁 Dīng** (Yin Fire) → **戊 Wù** (Yang Earth) → **己 Jǐ** (Yin Earth) → **庚 Gēng** (Yang Metal) → **辛 Xīn** (Yin Metal) → **壬 Rén** (Yang Water) → **癸 Guǐ** (Yin Water)

Yang represents the outward, active expression of an element. Yin represents the inward, receptive expression. Together they form a complete 10-year cycle — the **Stem cycle** that shapes the heavenly energy of any moment.`,
  },
  {
    title: 'What are Earthly Branches? (地支)',
    content: `The 12 Earthly Branches correspond to the Chinese zodiac animals and map to 2-hour periods of the day:

**子 Zǐ** (Rat, 23:00–01:00) → **丑 Chǒu** (Ox, 01:00–03:00) → **寅 Yín** (Tiger, 03:00–05:00) → **卯 Mǎo** (Rabbit, 05:00–07:00) → **辰 Chén** (Dragon, 07:00–09:00) → **巳 Sì** (Snake, 09:00–11:00) → **午 Wǔ** (Horse, 11:00–13:00) → **未 Wèi** (Goat, 13:00–15:00) → **申 Shēn** (Monkey, 15:00–17:00) → **酉 Yǒu** (Rooster, 17:00–19:00) → **戌 Xū** (Dog, 19:00–21:00) → **亥 Hài** (Pig, 21:00–23:00)

Each branch also carries a Five Element energy and hidden stems inside it (Zang Gan), making the earthly layer richer than it first appears.`,
  },
  {
    title: 'How to Read the Four Pillars (四柱)',
    content: `Your Four Pillars encode the cosmic energy at the moment of your birth. Each pillar is a Stem–Branch pair:

**Year Pillar (年柱)** — Ancestral foundation, social mask, ages 0–16. Represents your family background and how the world sees you at first glance.

**Month Pillar (月柱)** — Parents, career potential, ages 17–32. The strongest pillar for determining elemental strength because it captures the seasonal energy.

**Day Pillar (日柱)** — Your core self, marriage, ages 33–48. The Day Stem is your **Day Master** (日主) — the single most important element in your chart.

**Hour Pillar (时柱)** — Children, legacy, aspirations, ages 49+. Represents your inner world and what you hope to leave behind.`,
  },
  {
    title: 'Hidden Roots (藏干 Zang Gan)',
    content: `Each Earthly Branch contains hidden Heavenly Stems inside it — like ingredients in a smoothie:

**Pure branches** (only one hidden stem): 子 Zi has 100% 癸 Gui (Water), 卯 Mao has 100% 乙 Yi (Wood), 酉 You has 100% 辛 Xin (Metal).

**Complex branches** (two or three hidden stems): For example, 丑 Chou (Ox) contains 60% 己 Ji (Earth) + 30% 癸 Gui (Water) + 10% 辛 Xin (Metal).

These hidden stems add depth to your chart — they represent latent talents, internal tensions, and resources that may surface under the right conditions. A chart with many hidden stems of the same element is quietly powerful in that domain.`,
  },
];

interface EducationFlapProps {
  title: string;
  content: string;
}

const EducationFlap: React.FC<EducationFlapProps> = ({ title, content }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.6)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '10px',
      overflow: 'hidden',
      marginBottom: '8px',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '12px 16px',
          background: 'none',
          border: 'none',
          color: '#e2e8f0',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'left',
        }}
      >
        <span>{title}</span>
        <span style={{ color: '#94a3b8', fontSize: '12px' }}>{open ? '▼' : '▸'}</span>
      </button>
      {open && (
        <div style={{
          padding: '0 16px 16px',
          color: '#cbd5e1',
          fontSize: '13px',
          lineHeight: 1.7,
          whiteSpace: 'pre-line',
        }}>
          {renderSimpleMarkdown(content)}
        </div>
      )}
    </div>
  );
};

/** Minimal markdown: **bold** only */
function renderSimpleMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: '#f8fafc' }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

// =============================================================================
// X. DESTINY CYCLE NAVIGATOR
// =============================================================================

interface DestinyCycleNavigatorProps {
  currentYear: number;
}

const DestinyCycleNavigator: React.FC<DestinyCycleNavigatorProps> = ({ currentYear }) => {
  const [open, setOpen] = useState(false);
  const [centerYear, setCenterYear] = useState(currentYear);
  const radius = 30;

  const years = useMemo(() => buildDestinyYears(centerYear, radius), [centerYear]);
  const todayYear = new Date().getFullYear();

  // Scroll to current year on open
  const scrollRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open && scrollRef.current) {
      const el = scrollRef.current.querySelector('[data-current="true"]') as HTMLElement;
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }, [open]);

  if (!open) {
    return (
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            width: '100%',
            padding: '10px 16px',
            background: 'rgba(139, 92, 246, 0.06)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '12px',
            color: '#a78bfa',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          Destiny Cycle Navigator ({'\u516D\u5341\u7532\u5B50'})
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>Click to explore</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.5)',
      border: '1px solid rgba(139, 92, 246, 0.15)',
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '16px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>
            Destiny Cycle Navigator
          </span>
          <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '8px' }}>
            {'\u516D\u5341\u7532\u5B50'} Sexagenary Cycle
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button
            onClick={() => setCenterYear(c => c - 60)}
            style={{
              padding: '3px 8px', background: 'rgba(100,116,139,0.1)',
              border: '1px solid rgba(100,116,139,0.25)', borderRadius: '6px',
              color: '#94a3b8', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            -60y
          </button>
          <button
            onClick={() => setCenterYear(todayYear)}
            style={{
              padding: '3px 10px', background: 'rgba(251,191,36,0.1)',
              border: '1px solid rgba(251,191,36,0.3)', borderRadius: '6px',
              color: '#fbbf24', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Now
          </button>
          <button
            onClick={() => setCenterYear(c => c + 60)}
            style={{
              padding: '3px 8px', background: 'rgba(100,116,139,0.1)',
              border: '1px solid rgba(100,116,139,0.25)', borderRadius: '6px',
              color: '#94a3b8', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            +60y
          </button>
          <button
            onClick={() => setOpen(false)}
            style={{
              padding: '3px 8px', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
              color: '#94a3b8', fontSize: '11px', cursor: 'pointer', marginLeft: '4px',
            }}
          >
            {'\u2715'}
          </button>
        </div>
      </div>

      {/* Timeline grid */}
      <div
        ref={scrollRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 1fr)',
          gap: '3px',
          maxHeight: '320px',
          overflowY: 'auto',
          padding: '4px',
        }}
      >
        {years.map((dy: DestinyYear) => {
          const stemColor = ELEMENT_COLORS[dy.stem.element] || '#64748b';
          const branchColor = ELEMENT_COLORS[dy.branch.element] || '#64748b';
          const isCurrent = dy.year === todayYear;
          const isCenter = dy.year === currentYear;
          const cyclePos = ((dy.year - 4) % 60 + 60) % 60;
          return (
            <div
              key={dy.year}
              data-current={isCurrent ? 'true' : undefined}
              style={{
                padding: '4px 2px',
                borderRadius: '6px',
                background: isCurrent
                  ? 'rgba(251, 191, 36, 0.12)'
                  : isCenter
                    ? 'rgba(139, 92, 246, 0.08)'
                    : 'rgba(255,255,255,0.02)',
                border: isCurrent
                  ? '1px solid rgba(251, 191, 36, 0.4)'
                  : isCenter
                    ? '1px solid rgba(139, 92, 246, 0.25)'
                    : '1px solid rgba(255,255,255,0.04)',
                textAlign: 'center',
                transition: 'background 0.2s',
              }}
            >
              <div style={{ fontSize: '9px', color: '#94a3b8', marginBottom: '1px' }}>
                {dy.year}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1px' }}>
                <span style={{
                  fontSize: '13px',
                  fontFamily: "'Noto Sans SC', serif",
                  color: stemColor,
                  fontWeight: 700,
                }}>
                  {dy.stem.char}
                </span>
                <span style={{
                  fontSize: '13px',
                  fontFamily: "'Noto Sans SC', serif",
                  color: branchColor,
                  fontWeight: 700,
                }}>
                  {dy.branch.char}
                </span>
              </div>
              <div style={{ fontSize: '7px', color: '#94a3b8' }}>
                {dy.branch.animal}
              </div>
              <div style={{ fontSize: '7px', color: '#94a3b8' }}>
                #{cyclePos + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '8px',
        fontSize: '9px',
        color: '#94a3b8',
      }}>
        <span>
          <span style={{ color: '#fbbf24', fontWeight: 600 }}>{'\u25A0'}</span> Current Year
        </span>
        <span>
          <span style={{ color: '#a78bfa', fontWeight: 600 }}>{'\u25A0'}</span> Birth Year
        </span>
        <span>#N = position in 60-year cycle</span>
      </div>
    </div>
  );
};

// =============================================================================
// Y. HEAVENLY CALENDAR MODE
// =============================================================================

interface CalendarDayData {
  day: number;
  stemChar: string;
  branchChar: string;
  stemElement: string;
  branchElement: string;
  animal: string;
  solarTerm: string | null;
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const HeavenlyCalendarMode: React.FC<{
  currentDate?: Date;
  onClose: () => void;
}> = ({ currentDate, onClose }) => {
  const today = currentDate || new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const calendarData = useMemo(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDow = new Date(year, month - 1, 1).getDay();
    const days: (CalendarDayData | null)[] = [];

    // Pad leading blanks
    for (let i = 0; i < firstDow; i++) days.push(null);

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month - 1, d, 12, 0);
      const input = dateToCalcInput(date);
      const result: any = calculateBaZi(input);
      const dayPillar = result?.pillars?.[2];

      // Check solar term
      const stIdx = getSolarTermIndex(date);
      const st = SOLAR_TERMS[stIdx];
      const isNearTerm = st && st.approxMonth === month && Math.abs(st.approxDay - d) <= 1;

      days.push({
        day: d,
        stemChar: dayPillar?.stem?.char || '?',
        branchChar: dayPillar?.branch?.char || '?',
        stemElement: dayPillar?.stem?.element || 'Earth',
        branchElement: dayPillar?.branch?.element || 'Earth',
        animal: dayPillar?.branch?.animal || '',
        solarTerm: isNearTerm ? st.chinese : null,
      });
    }
    return days;
  }, [year, month]);

  const prevMonth = () => { setMonth(m => m === 1 ? (setYear(y => y - 1), 12) : m - 1); };
  const nextMonth = () => { setMonth(m => m === 12 ? (setYear(y => y + 1), 1) : m + 1); };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.95)',
      color: '#fff', display: 'flex', flexDirection: 'column', padding: '20px',
      zIndex: 9999, overflow: 'auto',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
        <button type="button" onClick={prevMonth} style={{
          padding: '6px 14px', background: 'rgba(100,116,139,0.15)',
          border: '1px solid rgba(100,116,139,0.3)', borderRadius: '8px',
          color: '#94a3b8', fontSize: '14px', cursor: 'pointer',
        }}>{'\u25C0'}</button>
        <span style={{ fontSize: '20px', fontWeight: 700, color: '#e2e8f0', minWidth: '160px', textAlign: 'center' }}>
          {year} – {String(month).padStart(2, '0')}
        </span>
        <button type="button" onClick={nextMonth} style={{
          padding: '6px 14px', background: 'rgba(100,116,139,0.15)',
          border: '1px solid rgba(100,116,139,0.3)', borderRadius: '8px',
          color: '#94a3b8', fontSize: '14px', cursor: 'pointer',
        }}>{'\u25B6'}</button>
        <button type="button" onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth() + 1); }} style={{
          padding: '6px 12px', background: 'rgba(251,191,36,0.1)',
          border: '1px solid rgba(251,191,36,0.3)', borderRadius: '8px',
          color: '#fbbf24', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
        }}>Today</button>
        <button type="button" onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '20px', background: 'none',
          border: 'none', fontSize: '24px', color: '#94a3b8', cursor: 'pointer',
        }}>{'\u2715'}</button>
      </div>

      <div style={{ fontSize: '11px', textAlign: 'center', color: '#94a3b8', marginBottom: '12px' }}>
        Heavenly Calendar — Each day shows its Day Pillar stem-branch pair
      </div>

      {/* Weekday headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px',
        maxWidth: '700px', margin: '0 auto', width: '100%',
      }}>
        {WEEKDAY_LABELS.map(w => (
          <div key={w} style={{ textAlign: 'center', fontSize: '11px', color: '#e2e8f0', fontWeight: 600, padding: '4px' }}>{w}</div>
        ))}

        {calendarData.map((cell, idx) => {
          if (!cell) return <div key={`blank-${idx}`} />;
          const isToday = cell.day === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear();
          const stemColor = ELEMENT_COLORS[cell.stemElement] || '#64748b';
          return (
            <div key={cell.day} style={{
              padding: '6px 4px', borderRadius: '8px', textAlign: 'center',
              background: isToday ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.03)',
              border: isToday ? '1px solid rgba(251,191,36,0.4)' : '1px solid rgba(255,255,255,0.06)',
              position: 'relative',
            }}>
              <div style={{ fontSize: '10px', color: isToday ? '#fbbf24' : '#cbd5e1', fontWeight: isToday ? 700 : 400 }}>
                {cell.day}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1px', margin: '2px 0' }}>
                <span style={{ fontSize: '16px', fontFamily: "'Noto Sans SC', serif", color: stemColor, fontWeight: 700 }}>
                  {cell.stemChar}
                </span>
                <span style={{ fontSize: '16px', fontFamily: "'Noto Sans SC', serif", color: ELEMENT_COLORS[cell.branchElement] || '#64748b', fontWeight: 700 }}>
                  {cell.branchChar}
                </span>
              </div>
              <div style={{ fontSize: '7px', color: '#94a3b8' }}>{cell.animal}</div>
              {cell.solarTerm && (
                <div style={{
                  fontSize: '8px', color: '#fbbf24', fontWeight: 600, marginTop: '2px',
                  background: 'rgba(251,191,36,0.1)', borderRadius: '3px', padding: '1px 3px',
                }}>
                  {cell.solarTerm}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Element legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
        {['Wood', 'Fire', 'Earth', 'Metal', 'Water'].map(el => (
          <span key={el} style={{ fontSize: '10px', color: ELEMENT_COLORS[el], fontWeight: 600 }}>
            {ELEMENT_GLYPHS[el]} {el}
          </span>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// Z. FATE CURRENTS CHART
// =============================================================================

const FateCurrentsChart: React.FC<{
  data: FateCurrentPoint[];
}> = ({ data }) => {
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const;
  const W = 560, H = 200, padL = 40, padR = 10, padT = 10, padB = 30;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const maxVal = 50; // max % on y axis
  const x = (age: number) => padL + (age / 80) * chartW;
  const y = (pct: number) => padT + chartH - (Math.min(pct, maxVal) / maxVal) * chartH;

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', margin: '0 auto' }}>
        {/* Grid lines */}
        {[0, 10, 20, 30, 40, 50].map(v => (
          <g key={v}>
            <line x1={padL} y1={y(v)} x2={W - padR} y2={y(v)} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
            <text x={padL - 4} y={y(v) + 3} textAnchor="end" style={{ fontSize: '8px', fill: '#94a3b8' }}>{v}%</text>
          </g>
        ))}
        {/* Age labels */}
        {data.map(p => (
          <text key={p.age} x={x(p.age)} y={H - 5} textAnchor="middle" style={{ fontSize: '8px', fill: '#94a3b8' }}>
            {p.age}
          </text>
        ))}
        {/* Element lines */}
        {elements.map(el => {
          const points = data.map(p => `${x(p.age)},${y(p.elements[el] || 0)}`).join(' ');
          return (
            <g key={el}>
              <polyline points={points} fill="none" stroke={ELEMENT_COLORS[el]} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
              {data.map(p => (
                <circle key={p.age} cx={x(p.age)} cy={y(p.elements[el] || 0)} r={3} fill={ELEMENT_COLORS[el]} opacity={0.9} />
              ))}
            </g>
          );
        })}
      </svg>
      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '6px' }}>
        {elements.map(el => (
          <span key={el} style={{ fontSize: '9px', color: ELEMENT_COLORS[el], fontWeight: 600 }}>
            {ELEMENT_GLYPHS[el]} {el}
          </span>
        ))}
      </div>
      <div style={{ textAlign: 'center', fontSize: '9px', color: '#94a3b8', marginTop: '4px' }}>
        Age (decades) → — Element % influenced by annual pillar cycle
      </div>
    </div>
  );
};

// =============================================================================
// AA. SYNASTRY RESONANCE MAP
// =============================================================================

const SynastryResonanceMap: React.FC<{
  links: SynastryLink[];
  nameA: string;
  nameB: string;
}> = ({ links, nameA, nameB }) => {
  const labels = ['Year', 'Month', 'Day', 'Hour'];
  const W = 300, H = 180;
  const yPos = (i: number) => 25 + i * 40;
  const typeStyles: Record<string, { dash: string; width: number }> = {
    support: { dash: '', width: 2 },
    control: { dash: '4 3', width: 1.5 },
    clash: { dash: '2 2', width: 2 },
    combine: { dash: '', width: 2.5 },
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0' }}>
        {/* Left labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingTop: '12px', minWidth: '70px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#a78bfa', textAlign: 'center', marginBottom: '4px' }}>{nameA}</div>
          {labels.map(l => (
            <div key={l} style={{ padding: '4px 8px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '6px', fontSize: '10px', color: '#c4b5fd', textAlign: 'center' }}>{l}</div>
          ))}
        </div>

        {/* SVG lines */}
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ flexShrink: 0 }}>
          {links.map((l, i) => (
            <line key={i}
              x1={10} y1={yPos(l.fromPillar)}
              x2={W - 10} y2={yPos(l.toPillar)}
              stroke={l.color} strokeWidth={typeStyles[l.type]?.width || 2}
              strokeDasharray={typeStyles[l.type]?.dash || ''}
              strokeLinecap="round" opacity={0.7}
            />
          ))}
        </svg>

        {/* Right labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingTop: '12px', minWidth: '70px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#f472b6', textAlign: 'center', marginBottom: '4px' }}>{nameB}</div>
          {labels.map(l => (
            <div key={l} style={{ padding: '4px 8px', background: 'rgba(244,114,182,0.08)', border: '1px solid rgba(244,114,182,0.2)', borderRadius: '6px', fontSize: '10px', color: '#f9a8d4', textAlign: 'center' }}>{l}</div>
          ))}
        </div>
      </div>

      {/* Link descriptions */}
      {links.length > 0 ? (
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {links.map((l, i) => (
            <div key={i} style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color, flexShrink: 0 }} />
              {l.description}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '10px' }}>
          No strong element links found between these charts
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '8px', fontSize: '9px', color: '#94a3b8' }}>
        <span><span style={{ color: '#22c55e' }}>{'\u2014'}</span> Support</span>
        <span><span style={{ color: '#f59e0b' }}>- -</span> Control</span>
        <span><span style={{ color: '#ef4444' }}>{'\u00B7\u00B7'}</span> Clash</span>
        <span><span style={{ color: '#3b82f6' }}>{'\u2501'}</span> Combine</span>
      </div>
    </div>
  );
};

// =============================================================================
// AB. LIFE THEME PANEL
// =============================================================================

const LifeThemePanel: React.FC<{
  themes: LifeTheme[];
}> = ({ themes }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
    {themes.map((t, i) => {
      const elColor = ELEMENT_COLORS[t.element] || '#64748b';
      return (
        <div key={i} style={{
          padding: '12px',
          borderRadius: '10px',
          background: `${elColor}08`,
          border: `1px solid ${elColor}20`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '16px' }}>{t.icon}</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: elColor }}>{t.title}</span>
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.5 }}>
            {t.description}
          </div>
        </div>
      );
    })}
  </div>
);

// =============================================================================
// AC. BAZI STORYBOOK MODE
// =============================================================================

const BaZiStorybookMode: React.FC<{
  narrative: string;
  onClose: () => void;
}> = ({ narrative, onClose }) => (
  <div style={{
    position: 'fixed', inset: 0,
    background: 'radial-gradient(ellipse at top, rgba(30, 27, 75, 0.98), rgba(2, 6, 23, 0.99))',
    color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center',
    padding: '40px 20px', zIndex: 9999, overflow: 'auto',
  }}>
    <button type="button" onClick={onClose} style={{
      position: 'absolute', top: '16px', right: '20px', background: 'none',
      border: 'none', fontSize: '24px', color: '#94a3b8', cursor: 'pointer',
    }}>{'\u2715'}</button>
    <div style={{
      maxWidth: '600px', width: '100%',
      background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(139,92,246,0.15)',
      borderRadius: '20px', padding: '32px',
      boxShadow: '0 0 60px rgba(139,92,246,0.1)',
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#e2e8f0', marginBottom: '20px', textAlign: 'center' }}>
        BaZi Storybook
      </h2>
      <div style={{ fontSize: '14px', lineHeight: 1.8, color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>
        {renderBoldText(narrative)}
      </div>
      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '10px', color: '#94a3b8' }}>
        A mythic reading of the elemental currents in your chart
      </div>
    </div>
  </div>
);

/** Render text with **bold** markdown converted to <strong> */
function renderBoldText(text: string) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: '#e2e8f0', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

/** Collapsible section card for premium structured readings */
function ReadingSection({ icon, label, sublabel, content, isSpecial }: {
  icon: string; label: string; sublabel: string; content: string; isSpecial?: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div style={{
      padding: '14px 18px',
      borderRadius: '10px',
      background: isSpecial ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.04)',
      border: `1px solid rgba(139, 92, 246, ${isSpecial ? '0.2' : '0.1'})`,
      marginBottom: '6px',
    }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          cursor: 'pointer', userSelect: 'none' as const,
        }}
      >
        <span style={{ fontSize: '16px' }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#c4b5fd', letterSpacing: '0.5px' }}>
            {label}
          </div>
          <div style={{ fontSize: '9px', color: '#94a3b8' }}>{sublabel}</div>
        </div>
        <span style={{ fontSize: '10px', color: '#64748b' }}>
          {expanded ? '\u25B2' : '\u25BC'}
        </span>
      </div>
      {expanded && (
        <div style={{
          marginTop: '10px', fontSize: '13px', lineHeight: 1.7,
          color: '#cbd5e1', whiteSpace: 'pre-wrap' as const,
        }}>
          {renderBoldText(content)}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// PROMPT VIEWER OVERLAY — View the system prompt + user message sent to Claude
// =============================================================================

function PromptViewerOverlay({ data, onClose }: {
  data: { system: string; userMessage: string }; onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'system' | 'user'>('user');

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleCopyToClipboard = () => {
    const text = activeTab === 'system' ? data.system : data.userMessage;
    navigator.clipboard.writeText(text).catch(() => {});
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.85)', overflowY: 'auto',
    }}>
      <button type="button" onClick={onClose} style={{
        position: 'fixed', top: 16, right: 20, zIndex: 10000,
        background: 'none', border: 'none', fontSize: 24, color: '#94a3b8', cursor: 'pointer',
      }}>
        {'\u2715'}
      </button>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 24px' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginBottom: 16 }}>
          Prompt & Payload Sent to Claude
        </h2>

        {/* Tab pills */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
          {(['user', 'system'] as const).map(tab => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} style={{
              padding: '5px 14px',
              background: activeTab === tab ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.03)',
              border: activeTab === tab ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6, color: activeTab === tab ? '#c4b5fd' : '#94a3b8',
              fontSize: 11, fontWeight: activeTab === tab ? 700 : 500, cursor: 'pointer',
            }}>
              {tab === 'user' ? 'User Message (Chart Data)' : 'System Prompt'}
            </button>
          ))}
          <button type="button" onClick={handleCopyToClipboard} style={{
            marginLeft: 'auto', padding: '5px 12px',
            background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: 6, color: '#4ade80', fontSize: 10, fontWeight: 600, cursor: 'pointer',
          }}>
            Copy to Clipboard
          </button>
        </div>

        {/* Content */}
        <pre style={{
          background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10, padding: 16, fontSize: 11, lineHeight: 1.6,
          color: '#cbd5e1', whiteSpace: 'pre-wrap', wordBreak: 'break-word' as const,
          maxHeight: 'calc(100vh - 200px)', overflowY: 'auto',
          fontFamily: "'JetBrains Mono', 'Consolas', monospace",
        }}>
          {activeTab === 'system' ? data.system : data.userMessage}
        </pre>
      </div>
    </div>
  );
}

// =============================================================================
// READING STORYBOOK OVERLAY — Full-screen immersive reading
// =============================================================================

function ReadingStorybookOverlay({ reading, onClose, profileName }: {
  reading: StructuredReading; onClose: () => void; profileName: string;
}) {
  // ESC key handler
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'radial-gradient(ellipse at top, rgba(15, 10, 40, 0.99), rgba(2, 6, 23, 1))',
      color: '#fff', overflowY: 'auto',
    }}>
      {/* Close button */}
      <button type="button" onClick={onClose} style={{
        position: 'fixed', top: 16, right: 20, zIndex: 10000,
        background: 'none', border: 'none', fontSize: 24, color: '#94a3b8', cursor: 'pointer',
      }}>
        {'\u2715'}
      </button>

      {/* Centered reading column */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '60px 32px' }}>
        <h1 style={{
          fontSize: 24, fontWeight: 700, textAlign: 'center' as const,
          color: '#e2e8f0', marginBottom: 8,
        }}>
          {profileName}&apos;s Soul Reading
        </h1>
        <div style={{
          textAlign: 'center' as const, fontSize: 11, color: '#94a3b8', marginBottom: 48,
        }}>
          A Premium BaZi Reading — GENESIS AstroProfile
        </div>

        {READING_SECTION_META.map(({ key, label, icon }) => (
          <div key={key} style={{ marginBottom: 40 }}>
            <h2 style={{
              fontSize: 14, fontWeight: 700, color: '#c4b5fd',
              letterSpacing: 1, marginBottom: 12,
              borderBottom: '1px solid rgba(139,92,246,0.15)', paddingBottom: 8,
            }}>
              {icon} {label}
            </h2>
            <div style={{
              fontSize: 14, lineHeight: 1.9, color: '#cbd5e1', whiteSpace: 'pre-wrap' as const,
            }}>
              {renderBoldText(reading[key])}
            </div>
          </div>
        ))}

        <div style={{
          textAlign: 'center' as const, fontSize: 10, color: '#64748b',
          marginTop: 48, paddingBottom: 40,
        }}>
          Generated by GENESIS AstroProfile — for educational purposes
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function BaZiLearningPage() {
  const { profiles, loading } = useProfiles() as { profiles: any[]; loading: boolean };
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [chart, setChart] = useState<any>(null);

  // Get selected profile
  const selectedProfile = useMemo(() => {
    return profiles?.find((p: any) => p.id === selectedProfileId) || null;
  }, [profiles, selectedProfileId]);

  // Sync currentDate from selected profile (no auto-select — default is Today)
  useEffect(() => {
    if (!selectedProfile?.birthDate) return;
    const [y, m, d] = selectedProfile.birthDate.split('-').map(Number);
    const [h = 12, min = 0] = (selectedProfile.birthTime || '12:00').split(':').map(Number);
    setCurrentDate(new Date(y, m - 1, d, h, min));
  }, [selectedProfile]);

  // True Solar Time: extract longitude & timezone offset from selected profile
  const tstInfo = useMemo((): TstBreakdown | null => {
    const lng = selectedProfile?.location?.coordinates?.lng;
    const gmtOff = selectedProfile?.timezone?.gmtOffsetHours;
    if (lng == null || gmtOff == null) return null;
    return trueSolarTimeBreakdown(currentDate, lng, gmtOff);
  }, [selectedProfile, currentDate]);

  // Calculate BaZi whenever currentDate changes (with optional TST correction)
  useEffect(() => {
    const calcDate = tstInfo ? tstInfo.correctedTime : currentDate;
    const input = dateToCalcInput(calcDate);
    const result: any = calculateBaZi(input);
    if (!result.error) {
      setChart(result);
    }
  }, [currentDate, tstInfo]);

  const handleDateChange = useCallback((newDate: Date) => {
    setCurrentDate(newDate);
  }, []);

  // Reset to profile birth date/time, or today if no profile
  const handleReset = useCallback(() => {
    if (selectedProfile?.birthDate) {
      const [y, m, d] = selectedProfile.birthDate.split('-').map(Number);
      const [h = 12, min = 0] = (selectedProfile.birthTime || '12:00').split(':').map(Number);
      setCurrentDate(new Date(y, m - 1, d, h, min));
    } else {
      setCurrentDate(new Date());
    }
  }, [selectedProfile]);

  // ---- Solar Term Data (exact boundary times from backend) ----
  const [solarTermData, setSolarTermData] = useState<Map<number, any>>(new Map());
  const [solarTermLoading, setSolarTermLoading] = useState(false);
  const fetchedYearsRef = useRef(new Set<number>());

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const beforeLichun = month < 2 || (month === 2 && day < 4);
    const baziYear = beforeLichun ? year - 1 : year;
    const yearsNeeded = [baziYear - 1, baziYear, baziYear + 1, baziYear + 2];
    const missing = yearsNeeded.filter(y => !fetchedYearsRef.current.has(y));
    if (missing.length === 0) return;

    // Mark as in-flight to prevent duplicate requests
    missing.forEach(y => fetchedYearsRef.current.add(y));
    setSolarTermLoading(true);

    import('../services/sovereignSolarTermService').then(({ getSolarTermsForYear }) =>
      Promise.all(missing.map(y => getSolarTermsForYear(y).then((data: any) => ({ year: y, data }))))
    ).then(results => {
      setSolarTermData(prev => {
        const next = new Map(prev);
        for (const { year: y, data } of results) next.set(y, data);
        return next;
      });
    }).catch(err => {
      // Allow retry on failure
      missing.forEach(y => fetchedYearsRef.current.delete(y));
      console.warn('Solar term fetch failed (using approximate dates):', err.message);
    }).finally(() => {
      setSolarTermLoading(false);
    });
  }, [currentDate]);

  // Override year/month pillars when solar term API gives a more precise boundary
  // than the library's built-in calculation (they can differ by a few minutes).
  useEffect(() => {
    if (!chart?.pillars || solarTermData.size === 0) return;

    const now = currentDate.getTime();
    const floorMin = (ms: number) => Math.floor(ms / 60000) * 60000;

    // Collect all Li Chun (year boundaries) from solar term data
    const liChuns: { year: number; date: Date }[] = [];
    solarTermData.forEach((terms: any, yr: number) => {
      if (!terms?.solarTerms) return;
      for (const t of terms.solarTerms) {
        if (t.isBaziYearBoundary && t.isoString) {
          liChuns.push({ year: yr, date: new Date(t.isoString) });
        }
      }
    });
    liChuns.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Find which Li Chun we've passed (using minute-level precision)
    let apiBaziYear: number | null = null;
    for (let i = liChuns.length - 1; i >= 0; i--) {
      if (floorMin(liChuns[i].date.getTime()) <= floorMin(now)) {
        apiBaziYear = liChuns[i].year;
        break;
      }
    }
    if (apiBaziYear == null) return;

    // Check if library's year pillar matches API's year
    const libYearStemIdx = chart.pillars[0]?.stem?.index;
    const apiYearStemIdx = ((apiBaziYear - 4) % 10 + 10) % 10;
    const apiYearBranchIdx = ((apiBaziYear - 4) % 12 + 12) % 12;

    if (libYearStemIdx === apiYearStemIdx) return; // Already agrees, no override needed

    // Build corrected year pillar
    const yStem = STEM_SEGMENTS[apiYearStemIdx];
    const yBranch = BRANCH_SEGMENTS[apiYearBranchIdx];
    const yearPillar = {
      ...chart.pillars[0],
      full: yStem.char + yBranch.char,
      stem: { char: yStem.char, element: yStem.element, polarity: yStem.polarity,
              pinyin: yStem.pinyin, english: yStem.english, index: yStem.index },
      branch: { char: yBranch.char, element: yBranch.element, polarity: yBranch.polarity,
                pinyin: yBranch.pinyin, animal: yBranch.animal, index: yBranch.index,
                season: yBranch.season, english: yBranch.english },
    };

    // Also fix month pillar — the month stem depends on the year stem (五虎遁)
    // Jie terms have even indices; month branch = (termIndex / 2 + 1) % 12
    const jies: { date: Date; branchIdx: number }[] = [];
    solarTermData.forEach((terms: any) => {
      if (!terms?.solarTerms) return;
      for (const t of terms.solarTerms) {
        if (t.isBaziMonthBoundary && t.isoString) {
          const termIdx = typeof t.index === 'number' ? t.index : -1;
          const branchIdx = termIdx >= 0 ? (termIdx / 2 + 1) % 12 : -1;
          jies.push({ date: new Date(t.isoString), branchIdx });
        }
      }
    });
    jies.sort((a, b) => a.date.getTime() - b.date.getTime());

    let currentJie: typeof jies[0] | null = null;
    for (let i = jies.length - 1; i >= 0; i--) {
      if (floorMin(jies[i].date.getTime()) <= floorMin(now)) {
        currentJie = jies[i];
        break;
      }
    }

    let monthPillar = chart.pillars[1];
    if (currentJie && currentJie.branchIdx >= 0) {
      const monthBranchIdx = currentJie.branchIdx;
      const baseMonthStem = ((apiYearStemIdx % 5) * 2 + 2) % 10;
      const monthOffset = ((monthBranchIdx - 2) + 12) % 12;
      const monthStemIdx = (baseMonthStem + monthOffset) % 10;

      const mStem = STEM_SEGMENTS[monthStemIdx];
      const mBranch = BRANCH_SEGMENTS[monthBranchIdx];
      monthPillar = {
        ...chart.pillars[1],
        full: mStem.char + mBranch.char,
        stem: { char: mStem.char, element: mStem.element, polarity: mStem.polarity,
                pinyin: mStem.pinyin, english: mStem.english, index: mStem.index },
        branch: { char: mBranch.char, element: mBranch.element, polarity: mBranch.polarity,
                  pinyin: mBranch.pinyin, animal: mBranch.animal, index: mBranch.index,
                  season: mBranch.season, english: mBranch.english },
      };
    }

    setChart((prev: any) => ({
      ...prev,
      pillars: [yearPillar, monthPillar, prev.pillars[2], prev.pillars[3]],
    }));
  }, [chart?.pillars?.[0]?.stem?.index, solarTermData, currentDate]);

  // ---- AI Chart Interpretation ----
  const [readingMode, setReadingMode] = useState<ReadingMode>('soul');
  const [aiReading, setAiReading] = useState<StructuredReading | null>(null);
  const [masterReading, setMasterReading] = useState<MasterCommentary | null>(null);
  const [shadowReading, setShadowReading] = useState<ShadowReading | null>(null);
  const [aiRawFallback, setAiRawFallback] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showReadingStorybook, setShowReadingStorybook] = useState(false);
  const [lastPromptData, setLastPromptData] = useState<{ system: string; userMessage: string } | null>(null);
  const [showPromptViewer, setShowPromptViewer] = useState(false);
  // ---- Auto-Generate Full Reading (Cloud Function) ----
  const [autoGenLoading, setAutoGenLoading] = useState(false);
  const [autoGenStatus, setAutoGenStatus] = useState<string | null>(null);
  const [autoGenError, setAutoGenError] = useState<string | null>(null);

  const [showCycles, setShowCycles] = useState(false);
  const [cycleTab, setCycleTab] = useState(0);
  const [cyclePos, setCyclePos] = useState({ x: 80, y: 60 });
  const cycleDragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const [showCompatibility, setShowCompatibility] = useState(false);
  const [compatPos, setCompatPos] = useState({ x: 100, y: 10 });
  const compatDragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const [showInteractiveCycles, setShowInteractiveCycles] = useState(false);
  const [interCyclesPos, setInterCyclesPos] = useState({ x: 100, y: 10 });
  const interCyclesDragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const [showHiddenStems, setShowHiddenStems] = useState(false);

  // ---- BaZi MD slots 1-5 (global, persisted to Firestore) ----
  const MD_SLOT_COUNT = 5;
  const BRANCH_MD_COUNT = 12;
  const TOTAL_MD_SLOTS = MD_SLOT_COUNT + BRANCH_MD_COUNT; // 17 total
  const [mdSlots, setMdSlots] = useState<string[]>(() => Array(TOTAL_MD_SLOTS).fill(''));
  const [showMdSlot, setShowMdSlot] = useState<number | null>(null);
  const mdFileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const activeMdImportSlotRef = useRef<number>(0);

  // Branch slot labels for the 12 Earthly Branches (slots 5-16)
  const BRANCH_MD_LABELS = useMemo(() => [
    { char: '子', animal: 'Rat',     polarity: 'Yang', element: 'Water' },
    { char: '丑', animal: 'Ox',      polarity: 'Yin',  element: 'Earth' },
    { char: '寅', animal: 'Tiger',   polarity: 'Yang', element: 'Wood'  },
    { char: '卯', animal: 'Rabbit',  polarity: 'Yin',  element: 'Wood'  },
    { char: '辰', animal: 'Dragon',  polarity: 'Yang', element: 'Earth' },
    { char: '巳', animal: 'Snake',   polarity: 'Yin',  element: 'Fire'  },
    { char: '午', animal: 'Horse',   polarity: 'Yang', element: 'Fire'  },
    { char: '未', animal: 'Goat',    polarity: 'Yin',  element: 'Earth' },
    { char: '申', animal: 'Monkey',  polarity: 'Yang', element: 'Metal' },
    { char: '酉', animal: 'Rooster', polarity: 'Yin',  element: 'Metal' },
    { char: '戌', animal: 'Dog',     polarity: 'Yang', element: 'Earth' },
    { char: '亥', animal: 'Pig',     polarity: 'Yin',  element: 'Water' },
  ], []);

  // Element → color mapping for branch MD buttons
  const BRANCH_ELEMENT_COLORS: Record<string, { bg: string; border: string; text: string }> = useMemo(() => ({
    Wood:  { bg: 'rgba(34, 197, 94, 0.12)',  border: 'rgba(34, 197, 94, 0.4)',  text: '#4ade80' },
    Fire:  { bg: 'rgba(239, 68, 68, 0.12)',  border: 'rgba(239, 68, 68, 0.4)',  text: '#f87171' },
    Earth: { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.4)', text: '#fbbf24' },
    Metal: { bg: 'rgba(161, 161, 170, 0.12)', border: 'rgba(161, 161, 170, 0.4)', text: '#d4d4d8' },
    Water: { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.4)', text: '#60a5fa' },
  }), []);

  // ---- Sexagenary (60 pillar) MD slots ----
  // Each animal has 5 stem variations (matching polarity)
  const YANG_STEMS = useMemo(() => [
    { char: '\u7532', element: 'Wood',  label: 'Yang Wood' },
    { char: '\u4E19', element: 'Fire',  label: 'Yang Fire' },
    { char: '\u620A', element: 'Earth', label: 'Yang Earth' },
    { char: '\u5E9A', element: 'Metal', label: 'Yang Metal' },
    { char: '\u58EC', element: 'Water', label: 'Yang Water' },
  ], []);
  const YIN_STEMS = useMemo(() => [
    { char: '\u4E59', element: 'Wood',  label: 'Yin Wood' },
    { char: '\u4E01', element: 'Fire',  label: 'Yin Fire' },
    { char: '\u5DF1', element: 'Earth', label: 'Yin Earth' },
    { char: '\u8F9B', element: 'Metal', label: 'Yin Metal' },
    { char: '\u7678', element: 'Water', label: 'Yin Water' },
  ], []);

  /** Get the 5 stem options for a given animal */
  const getStemsForAnimal = useCallback((polarity: string) =>
    polarity === 'Yang' ? YANG_STEMS : YIN_STEMS,
  [YANG_STEMS, YIN_STEMS]);

  /** Sexagenary key: "wood_snake", "fire_rat", etc. */
  const sexKey = useCallback((stemElement: string, animal: string) =>
    `${stemElement.toLowerCase()}_${animal.toLowerCase()}`,
  []);

  const [sexMdSlots, setSexMdSlots] = useState<Record<string, string>>({});
  const [expandedAnimal, setExpandedAnimal] = useState<string | null>(null);
  const [showSexMd, setShowSexMd] = useState<string | null>(null);
  const activeSexImportKeyRef = useRef<string>('');
  const sexMdFileRef = useRef<HTMLInputElement | null>(null);

  const mdDocRefs = useMemo(
    () => Array.from({ length: TOTAL_MD_SLOTS }, (_, i) =>
      doc(db, 'global_config', i < MD_SLOT_COUNT
        ? `bazi_learning_md_${i + 1}`
        : `bazi_branch_md_${BRANCH_MD_LABELS[i - MD_SLOT_COUNT].animal.toLowerCase()}`
      )
    ),
    [BRANCH_MD_LABELS],
  );

  // Floating window drag logic (Cycles, Compatibility, Interactive Cycles)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (cycleDragRef.current) {
        const dx = e.clientX - cycleDragRef.current.startX;
        const dy = e.clientY - cycleDragRef.current.startY;
        setCyclePos({ x: cycleDragRef.current.origX + dx, y: cycleDragRef.current.origY + dy });
      }
      if (compatDragRef.current) {
        const dx = e.clientX - compatDragRef.current.startX;
        const dy = e.clientY - compatDragRef.current.startY;
        setCompatPos({ x: compatDragRef.current.origX + dx, y: compatDragRef.current.origY + dy });
      }
      if (interCyclesDragRef.current) {
        const dx = e.clientX - interCyclesDragRef.current.startX;
        const dy = e.clientY - interCyclesDragRef.current.startY;
        setInterCyclesPos({ x: interCyclesDragRef.current.origX + dx, y: interCyclesDragRef.current.origY + dy });
      }
    };
    const onUp = () => {
      cycleDragRef.current = null;
      compatDragRef.current = null;
      interCyclesDragRef.current = null;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  // Load all BaZi MD slots from Firestore on mount — supports chunked docs
  useEffect(() => {
    Promise.allSettled(mdDocRefs.map(ref => loadChunkedContent(ref.path)))
      .then(results => {
        const loaded = Array(TOTAL_MD_SLOTS).fill('');
        let hasAny = false;
        results.forEach((result, i) => {
          if (result.status === 'fulfilled' && result.value) {
            loaded[i] = result.value;
            hasAny = true;
          }
        });
        if (hasAny) setMdSlots(prev => prev.map((cur, i) => loaded[i] || cur));
      });
  }, [mdDocRefs]);

  const handleImportMdSlot = useCallback((slot: number) => {
    activeMdImportSlotRef.current = slot;
    mdFileInputRefs.current[0]?.click();
  }, []);

  const handleMdSlotFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const slot = activeMdImportSlotRef.current;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === 'string') {
        // Save to Firestore using chunked helper (handles docs > 1 MB)
        saveChunkedContent(mdDocRefs[slot].path, text)
          .then(() => {
            setMdSlots(prev => { const next = [...prev]; next[slot] = text; return next; });
          })
          .catch((err) => {
            console.error(`Failed to save BaZi MD slot ${slot + 1}:`, err);
            alert(`Import failed: ${err?.message || 'Could not save to Firestore'}`);
          });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [mdDocRefs]);

  const handleExportMdSlot = useCallback((slot: number) => {
    const content = mdSlots[slot];
    if (!content) return;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = slot < MD_SLOT_COUNT
      ? `bazi-md-${slot + 1}.md`
      : `bazi-${BRANCH_MD_LABELS[slot - MD_SLOT_COUNT].animal.toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [mdSlots, BRANCH_MD_LABELS]);

  // ---- Sexagenary MD: load all 60 from Firestore on mount (single batched update) ----
  useEffect(() => {
    const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const animals = BRANCH_MD_LABELS.map(b => b.animal);
    const keys: string[] = [];
    for (const animal of animals) {
      for (const el of elements) {
        keys.push(sexKey(el, animal));
      }
    }
    Promise.allSettled(
      keys.map(key => loadChunkedContent(`global_config/bazi_sex_md_${key}`))
    ).then(results => {
      const loaded: Record<string, string> = {};
      results.forEach((result, i) => {
        if (result.status === 'fulfilled' && result.value) {
          loaded[keys[i]] = result.value;
        }
      });
      if (Object.keys(loaded).length > 0) {
        setSexMdSlots(prev => ({ ...prev, ...loaded }));
      }
    });
  }, [BRANCH_MD_LABELS, sexKey]);

  const handleImportSexMd = useCallback((key: string) => {
    activeSexImportKeyRef.current = key;
    sexMdFileRef.current?.click();
  }, []);

  const handleSexMdFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const key = activeSexImportKeyRef.current;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === 'string') {
        // Save to Firestore using chunked helper (handles docs > 1 MB)
        saveChunkedContent(`global_config/bazi_sex_md_${key}`, text)
          .then(() => {
            setSexMdSlots(prev => ({ ...prev, [key]: text }));
          })
          .catch(err => {
            console.error(`Failed to save sexagenary MD ${key}:`, err);
            alert(`Import failed: ${err?.message || 'Could not save to Firestore'}`);
          });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  const handleExportSexMd = useCallback((key: string) => {
    const content = sexMdSlots[key];
    if (!content) return;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bazi-${key}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [sexMdSlots]);

  /** Open the sexagenary MD for a given stem+animal from Day Pillar click */
  const handlePillarInfoClick = useCallback((info: { stemElement: string; branchAnimal: string }) => {
    const key = sexKey(info.stemElement, info.branchAnimal);
    if (sexMdSlots[key]) {
      setShowSexMd(key);
    } else {
      // Expand the animal in sidebar so user can import
      setExpandedAnimal(info.branchAnimal);
    }
  }, [sexKey, sexMdSlots]);

  // Cache readings per profile — save when switching away, restore when switching back
  const readingsCacheRef = useRef<Map<string, {
    soul: StructuredReading | null;
    master: MasterCommentary | null;
    shadow: ShadowReading | null;
    rawFallback: string | null;
    promptData: { system: string; userMessage: string } | null;
  }>>(new Map());
  const prevProfileIdRef = useRef<string | null>(null);
  const skipNextClearRef = useRef(false);

  // Keep a ref of current readings so the save effect always gets fresh values
  const currentReadingsRef = useRef({ aiReading, masterReading, shadowReading, aiRawFallback, lastPromptData });
  currentReadingsRef.current = { aiReading, masterReading, shadowReading, aiRawFallback, lastPromptData };

  // Profile switch: save old readings, restore cached or clear
  useEffect(() => {
    const prevId = prevProfileIdRef.current;
    const newId = selectedProfileId;
    const isProfileSwitch = prevId !== newId && (prevId !== null || newId !== null);

    if (!isProfileSwitch) {
      prevProfileIdRef.current = newId;
      return;
    }

    const cur = currentReadingsRef.current;

    // Save current readings under the previous profile
    if (prevId && (cur.aiReading || cur.masterReading || cur.shadowReading || cur.aiRawFallback)) {
      readingsCacheRef.current.set(prevId, {
        soul: cur.aiReading,
        master: cur.masterReading,
        shadow: cur.shadowReading,
        rawFallback: cur.aiRawFallback,
        promptData: cur.lastPromptData,
      });
    }

    // Restore cached readings for the new profile, or clear
    if (newId && readingsCacheRef.current.has(newId)) {
      const cached = readingsCacheRef.current.get(newId)!;
      setAiReading(cached.soul);
      setMasterReading(cached.master);
      setShadowReading(cached.shadow);
      setAiRawFallback(cached.rawFallback);
      setLastPromptData(cached.promptData);
      setAiError(null);
    } else {
      setAiReading(null);
      setMasterReading(null);
      setShadowReading(null);
      setAiRawFallback(null);
      setAiError(null);
      setLastPromptData(null);
    }

    // Skip the next currentDate clear — profile switch already handled readings
    skipNextClearRef.current = true;
    prevProfileIdRef.current = newId;
  }, [selectedProfileId]);

  // Clear AI readings when date changes manually (not from profile switch)
  useEffect(() => {
    if (skipNextClearRef.current) {
      skipNextClearRef.current = false;
      return;
    }
    setAiReading(null);
    setMasterReading(null);
    setShadowReading(null);
    setAiRawFallback(null);
    setAiError(null);
  }, [currentDate]);

  const handleExplainChart = useCallback(async () => {
    if (!chart || aiLoading) return;
    setAiLoading(true);
    setAiError(null);
    setAiRawFallback(null);

    // Clear only the current mode's state
    if (readingMode === 'soul') setAiReading(null);
    else if (readingMode === 'master') setMasterReading(null);
    else if (readingMode === 'shadow') setShadowReading(null);

    try {
      const { callClaudeProxy } = await import('../services/llmProxyService');
      const { buildPremiumBaZiPayload, parseStructuredReading, parseMasterCommentary, parseShadowReading } = await import('../utils/buildPremiumBaZiPayload');

      // Fetch luck pillars — default isMale=true if gender not specified
      let luckPillars = null;
      const gender = selectedProfile?.gender;
      if (selectedProfile?.birthDate) {
        try {
          const { calculateDaYun } = await import('../services/baziDayunService');
          const dayunResult = await calculateDaYun({
            birthDate: selectedProfile.birthDate,
            birthTime: selectedProfile.birthTime || '12:00',
            isMale: gender ? gender === 'male' : true,
            pillarCount: 8,
          });
          if (dayunResult && !(dayunResult as any)._mock) {
            luckPillars = dayunResult;
          }
        } catch (e) {
          console.warn('DaYun fetch skipped:', e);
        }
      }

      const profileName = selectedProfile?.name || selectedProfile?.firstName || 'this person';
      const maxTokens = readingMode === 'master' ? 2500 : readingMode === 'shadow' ? 3000 : 5000;

      const { system, userMessage } = buildPremiumBaZiPayload({
        chart,
        profileName,
        gender,
        birthDate: selectedProfile?.birthDate,
        birthTime: selectedProfile?.birthTime,
        luckPillars,
        mode: readingMode,
      });

      // Save prompt data for debugging/viewing
      setLastPromptData({ system, userMessage });

      const result = await callClaudeProxy({
        model: 'claude-sonnet-4-20250514',
        system,
        max_tokens: maxTokens,
        temperature: 0.75,
        messages: [{ role: 'user', content: userMessage }],
      });

      const raw = result.text || '';

      // Parse based on mode
      if (readingMode === 'soul') {
        const reading = parseStructuredReading(raw);
        if (reading) {
          setAiReading(reading);
        } else {
          // Multi-pass recovery: ask LLM to fix the JSON
          try {
            const fixResult = await callClaudeProxy({
              model: 'claude-sonnet-4-20250514',
              system: 'You are a JSON repair assistant. The user will give you malformed text. Extract or fix it into ONLY a valid JSON object. No commentary, no fences.',
              max_tokens: 5000,
              temperature: 0.2,
              messages: [{ role: 'user', content: `Fix this into valid JSON with exactly these 8 string keys: whoIAm, whatDrivesMe, whenEnergy, wherePatterns, whyLikeThis, howToGrow, emotionalMirror, soulMessage.\n\n${raw}` }],
            });
            const fixedReading = parseStructuredReading(fixResult.text || '');
            if (fixedReading) {
              setAiReading(fixedReading);
            } else {
              setAiRawFallback(raw);
            }
          } catch {
            setAiRawFallback(raw);
          }
        }
      } else if (readingMode === 'master') {
        const reading = parseMasterCommentary(raw);
        if (reading) {
          setMasterReading(reading);
        } else {
          // Multi-pass recovery for master mode
          try {
            const fixResult = await callClaudeProxy({
              model: 'claude-sonnet-4-20250514',
              system: 'You are a JSON repair assistant. Extract or fix into ONLY a valid JSON object. No commentary.',
              max_tokens: 2500,
              temperature: 0.2,
              messages: [{ role: 'user', content: `Fix this into valid JSON with exactly 1 string key: masterCommentary.\n\n${raw}` }],
            });
            const fixed = parseMasterCommentary(fixResult.text || '');
            if (fixed) setMasterReading(fixed);
            else setAiRawFallback(raw);
          } catch {
            setAiRawFallback(raw);
          }
        }
      } else if (readingMode === 'shadow') {
        const reading = parseShadowReading(raw);
        if (reading) {
          setShadowReading(reading);
        } else {
          try {
            const fixResult = await callClaudeProxy({
              model: 'claude-sonnet-4-20250514',
              system: 'You are a JSON repair assistant. Extract or fix into ONLY a valid JSON object. No commentary.',
              max_tokens: 3000,
              temperature: 0.2,
              messages: [{ role: 'user', content: `Fix this into valid JSON with exactly 2 string keys: shadowPatterns, healingPath.\n\n${raw}` }],
            });
            const fixed = parseShadowReading(fixResult.text || '');
            if (fixed) setShadowReading(fixed);
            else setAiRawFallback(raw);
          } catch {
            setAiRawFallback(raw);
          }
        }
      }
    } catch (err: any) {
      console.error('AI chart reading error:', err);
      setAiError(err?.message || 'Failed to generate reading. Please try again.');
    } finally {
      setAiLoading(false);
    }
  }, [chart, aiLoading, selectedProfile, readingMode]);

  // ---- PDF Download ----
  const handleDownloadPDF = useCallback(async () => {
    try {
      const { exportBaZiReadingPDF } = await import('../utils/buildPremiumBaZiPayload');
      await exportBaZiReadingPDF({
        profileName: selectedProfile?.name || selectedProfile?.firstName || 'Unknown',
        birthDate: selectedProfile?.birthDate,
        birthTime: selectedProfile?.birthTime,
        reading: aiReading,
        masterReading,
        shadowReading,
      });
    } catch (err) {
      console.error('PDF export error:', err);
    }
  }, [aiReading, masterReading, shadowReading, selectedProfile]);

  // ---- Auto-Generate Full Reading (Cloud Function) ----
  const handleAutoGenerate = useCallback(async () => {
    if (!selectedProfile?.id || autoGenLoading) return;
    setAutoGenLoading(true);
    setAutoGenError(null);
    setAutoGenStatus('Starting...');
    try {
      const result = await triggerBaziReading(selectedProfile.id);
      if (result.cached) {
        setAutoGenStatus('Loaded cached reading');
      } else {
        setAutoGenStatus('Complete!');
      }
    } catch (err: any) {
      console.error('Auto-generate error:', err);
      setAutoGenError(err?.message || 'Failed to auto-generate reading');
      setAutoGenStatus(null);
    } finally {
      setAutoGenLoading(false);
    }
  }, [selectedProfile?.id, autoGenLoading]);

  // Subscribe to real-time progress updates when auto-generating
  useEffect(() => {
    if (!selectedProfile?.id) return;
    const unsub = onBaziReadingUpdate(selectedProfile.id, (data) => {
      if (!data) return;
      // Update progress status
      const statusMap: Record<string, string> = {
        pending: 'Preparing...',
        calculating_chart: 'Calculating BaZi chart...',
        generating_soul: 'Generating Soul Reading...',
        generating_master: 'Generating Master Commentary...',
        generating_shadow: 'Generating Shadow Reading...',
        complete: 'Complete!',
        error: data.error ? `Error: ${data.error}` : 'Error occurred',
      };
      if (data.status && autoGenLoading) {
        setAutoGenStatus(statusMap[data.status] || data.status);
      }
      // When complete, populate the reading state
      if (data.status === 'complete') {
        if (data.soul && !data.soul.rawParseError) setAiReading(data.soul);
        if (data.master && !data.master.rawParseError) setMasterReading(data.master);
        if (data.shadow && !data.shadow.rawParseError) setShadowReading(data.shadow);
        setAutoGenLoading(false);
      }
    });
    return unsub;
  }, [selectedProfile?.id, autoGenLoading]);

  // Load saved reading when profile changes
  useEffect(() => {
    if (!selectedProfile?.id) return;
    let cancelled = false;
    loadSavedReading(selectedProfile.id).then((data) => {
      if (cancelled || !data || data.status !== 'complete') return;
      // Only load if we don't already have readings from the frontend pipeline
      if (!aiReading && !masterReading && !shadowReading) {
        if (data.soul && !data.soul.rawParseError) setAiReading(data.soul);
        if (data.master && !data.master.rawParseError) setMasterReading(data.master);
        if (data.shadow && !data.shadow.rawParseError) setShadowReading(data.shadow);
      }
    }).catch(() => { /* ignore */ });
    return () => { cancelled = true; };
  }, [selectedProfile?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Markdown building + export ----
  const buildReadingMarkdown = useCallback((
    soul: StructuredReading | null,
    master: MasterCommentary | null,
    shadow: ShadowReading | null,
  ): string => {
    const profileName = selectedProfile?.name || selectedProfile?.firstName || 'Unknown';
    const lines: string[] = [];
    lines.push(`# BaZi Reading — ${profileName}`);
    if (selectedProfile?.birthDate) {
      lines.push(`**Birth:** ${selectedProfile.birthDate}${selectedProfile.birthTime ? ' ' + selectedProfile.birthTime : ''}`);
    }
    lines.push(`**Generated:** ${new Date().toLocaleDateString()}\n`);
    lines.push('---\n');

    if (soul) {
      for (const { key, label, icon } of READING_SECTION_META) {
        lines.push(`## ${icon} ${label}\n`);
        lines.push(soul[key]);
        lines.push('');
      }
    }
    if (master) {
      lines.push(`## \u{1F3AF} MASTER COMMENTARY\n`);
      lines.push(master.masterCommentary);
      lines.push('');
    }
    if (shadow) {
      lines.push(`## \u{1F311} SHADOW PATTERNS\n`);
      lines.push(shadow.shadowPatterns);
      lines.push('');
      lines.push(`## \u{1F33F} HEALING PATH\n`);
      lines.push(shadow.healingPath);
      lines.push('');
    }

    lines.push('---\n');
    lines.push('*Generated by GENESIS AstroProfile — for educational purposes*');
    return lines.join('\n');
  }, [selectedProfile]);

  // Auto-save generated readings as MD to Firestore slot 1 whenever readings change
  useEffect(() => {
    if (!aiReading && !masterReading && !shadowReading) return;
    const md = buildReadingMarkdown(aiReading, masterReading, shadowReading);
    setMdSlots(prev => { const next = [...prev]; next[0] = md; return next; });
    saveChunkedContent(mdDocRefs[0].path, md)
      .catch((err) => console.error('Failed to auto-save BaZi MD slot 1:', err));
  }, [aiReading, masterReading, shadowReading, buildReadingMarkdown, mdDocRefs]);

  // ---- Y. Heavenly Calendar overlay ----
  const [showCalendar, setShowCalendar] = useState(false);

  // ---- AC. Storybook overlay ----
  const [showStorybook, setShowStorybook] = useState(false);

  // ---- Z. Fate Currents ----
  const fateCurrents = useMemo<FateCurrentPoint[]>(() => {
    if (!chart?.elements?.percentages) return [];
    const birthYear = currentDate.getFullYear();
    return buildFateCurrents(birthYear, chart.elements.percentages);
  }, [chart, currentDate]);

  // ---- AA. Synastry ----
  const [secondProfileId, setSecondProfileId] = useState<string | null>(null);
  const [secondChart, setSecondChart] = useState<any>(null);

  const secondProfile = useMemo(() => {
    return profiles?.find((p: any) => p.id === secondProfileId) || null;
  }, [profiles, secondProfileId]);

  useEffect(() => {
    if (!secondProfile?.birthDate) { setSecondChart(null); return; }
    const [y, m, d] = secondProfile.birthDate.split('-').map(Number);
    const [h = 12, min = 0] = (secondProfile.birthTime || '12:00').split(':').map(Number);
    let calcDate = new Date(y, m - 1, d, h, min);
    // Apply TST correction for second profile if location data available
    const lng2 = secondProfile?.location?.coordinates?.lng;
    const gmt2 = secondProfile?.timezone?.gmtOffsetHours;
    if (lng2 != null && gmt2 != null) {
      calcDate = applyTrueSolarTime(calcDate, lng2, gmt2);
    }
    const input = dateToCalcInput(calcDate);
    const result: any = calculateBaZi(input);
    if (!result.error) setSecondChart(result);
  }, [secondProfile]);

  const synastryLinks = useMemo<SynastryLink[]>(() => {
    if (!chart?.pillars || !secondChart?.pillars) return [];
    return computeSynastryLinks(chart.pillars, secondChart.pillars);
  }, [chart, secondChart]);

  // ---- AB. Life Themes ----
  const lifeThemes = useMemo<LifeTheme[]>(() => {
    if (!chart?.elements?.percentages) return [];
    return extractLifeThemes(chart.elements.percentages, chart.dayMaster?.element);
  }, [chart]);

  // ---- AC. Storybook narrative ----
  const storybookNarrative = useMemo<string>(() => {
    if (!chart) return '';
    const pcts = chart.elements?.percentages || {};
    const parsed: Record<string, number> = {};
    for (const el of ['Wood', 'Fire', 'Earth', 'Metal', 'Water']) {
      const v = pcts[el];
      parsed[el] = typeof v === 'string' ? parseFloat(v) : (v as number) || 0;
    }
    const sorted = Object.entries(parsed).sort((a, b) => b[1] - a[1]);
    const dominant = sorted[0]?.[0] || 'Earth';
    const weakest = sorted[sorted.length - 1]?.[0] || 'Water';
    const dmEl = chart.dayMaster?.element || 'Wood';
    const dmIdx = chart.pillars?.[2]?.stem?.index ?? 0;
    const dmPol = STEM_SEGMENTS[dmIdx]?.polarity || 'Yang';
    const dmChar = STEM_SEGMENTS[dmIdx]?.char || '';
    const monthBranchIdx = chart.pillars?.[1]?.branch?.index ?? 0;
    const season = getSeasonFromMonthBranch(monthBranchIdx);
    return buildStorybookNarrative({
      dayMasterElement: dmEl, dayMasterPolarity: dmPol, dayMasterChar: dmChar,
      dominantElement: dominant, weakestElement: weakest, season,
      themes: lifeThemes,
    });
  }, [chart, lifeThemes]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profiles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f2847] to-[#0a1628]">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Profile selector + nav */}
            <div className="flex items-center gap-4">
              {/* Profile selector - far left */}
              <div style={{ minWidth: '200px' }}>
                <select
                  value={selectedProfileId || ''}
                  onChange={(e) => setSelectedProfileId(e.target.value || null)}
                  style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    color: '#e5e7eb',
                    colorScheme: 'dark',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                  aria-label="Select profile"
                  title="Select a profile to view their BaZi chart"
                >
                  <option value="">-- Select a Profile --</option>
                  {profiles?.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.displayName || p.name || p.firstName || 'Unnamed'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="h-4 w-px bg-white/20" />

              <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                ← Dashboard
              </Link>
              <div className="h-4 w-px bg-white/20" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent flex items-center gap-2">
                BaZi Learning Wheels
              </h1>
            </div>

            {/* Right: Action buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/bazi-chat"
                className="px-3 py-1.5 rounded-lg text-sm bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
              >
                BaZi Chat
              </Link>
              <Link
                to="/bazi-modular"
                className="px-3 py-1.5 rounded-lg text-sm bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
              >
                BaZi Modular
              </Link>

              <button
                type="button"
                onClick={() => setShowCalendar(true)}
                className="px-3 py-1.5 rounded-lg text-sm bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
              >
                Calendar
              </button>

              {chart && (
                <button
                  type="button"
                  onClick={() => setShowStorybook(true)}
                  className="px-3 py-1.5 rounded-lg text-sm bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors"
                >
                  Storybook
                </button>
              )}

            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <BaziThemeProvider>
          {/* Wheels + MD Panel row */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'flex-start' }}>
            {/* Wheels Section */}
            <div style={{
              flex: 1,
              position: 'relative',
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px',
            }}>
              {/* Profile info strip — sits on top border, no vertical space */}
              {selectedProfile && (
                <div style={{
                  position: 'absolute',
                  top: '-1px',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '11px',
                  color: '#cbd5e1',
                  lineHeight: 1,
                  padding: '3px 14px',
                  background: 'rgba(15, 23, 42, 0.92)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  whiteSpace: 'nowrap',
                  zIndex: 1,
                  textAlign: 'center',
                }}>
                  <span style={{ color: '#e0d4ff', fontWeight: 700, fontSize: '12px' }}>
                    {selectedProfile.displayName || selectedProfile.fullName || `${selectedProfile.firstName || ''} ${selectedProfile.lastName || ''}`.trim() || selectedProfile.name || 'Unknown'}
                  </span>
                  {selectedProfile.birthDate && (
                    <span style={{ color: '#e2e8f0' }}>{' '}&middot; {selectedProfile.birthDate}{selectedProfile.birthTime ? ` ${selectedProfile.birthTime}` : ''}</span>
                  )}
                  {selectedProfile.location?.fullAddress && (
                    <span style={{ color: '#e2e8f0' }}>{' '}&middot; {selectedProfile.location.fullAddress}</span>
                  )}
                  {selectedProfile.location?.coordinates?.lat != null && selectedProfile.location?.coordinates?.lng != null && (
                    <span style={{ color: '#a5b4c8' }}>
                      {' '}({selectedProfile.location.coordinates.lat.toFixed(4)}, {selectedProfile.location.coordinates.lng.toFixed(4)})
                    </span>
                  )}
                </div>
              )}
              {chart ? (
                <BaZiFourPillarWheels
                  baziResult={chart}
                  currentDate={currentDate}
                  onDateChange={handleDateChange}
                  onReset={handleReset}
                  solarTermData={solarTermData}
                  solarTermLoading={solarTermLoading}
                  tstInfo={tstInfo}
                  onPillarInfoClick={handlePillarInfoClick}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
                  Select a profile to explore the Four Pillars
                </div>
              )}
            </div>

            {/* MD Panel */}
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '4px',
              padding: '10px', borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              minWidth: '120px',
            }}>
              {Array.from({ length: MD_SLOT_COUNT }, (_, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '2px 0' }} />}
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setShowMdSlot(i)}
                      disabled={!mdSlots[i]}
                      style={{
                        padding: '5px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                        cursor: mdSlots[i] ? 'pointer' : 'default', whiteSpace: 'nowrap', flex: 1,
                        background: mdSlots[i] ? 'rgba(139, 92, 246, 0.15)' : 'rgba(100, 116, 139, 0.08)',
                        border: `1px solid ${mdSlots[i] ? 'rgba(139, 92, 246, 0.4)' : 'rgba(100, 116, 139, 0.15)'}`,
                        color: mdSlots[i] ? '#c4b5fd' : '#64748b',
                        opacity: mdSlots[i] ? 1 : 0.5,
                      }}
                    >
                      BaZi {i + 1}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleImportMdSlot(i)}
                      title={`Import MD into slot ${i + 1}`}
                      style={{
                        padding: '5px 6px', borderRadius: '6px', fontSize: '10px', fontWeight: 600,
                        cursor: 'pointer', whiteSpace: 'nowrap',
                        background: 'rgba(59, 130, 246, 0.12)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: '#60a5fa',
                      }}
                    >
                      In
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExportMdSlot(i)}
                      disabled={!mdSlots[i]}
                      title={`Export MD from slot ${i + 1}`}
                      style={{
                        padding: '5px 6px', borderRadius: '6px', fontSize: '10px', fontWeight: 600,
                        cursor: mdSlots[i] ? 'pointer' : 'default', whiteSpace: 'nowrap',
                        background: 'rgba(59, 130, 246, 0.12)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: mdSlots[i] ? '#60a5fa' : '#64748b',
                        opacity: mdSlots[i] ? 1 : 0.5,
                      }}
                    >
                      Ex
                    </button>
                  </div>
                </React.Fragment>
              ))}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '4px 0' }} />

              {/* 12 Earthly Branch MD slots + expandable 5 sexagenary stems each */}
              {BRANCH_MD_LABELS.map((branch, j) => {
                const slotIdx = MD_SLOT_COUNT + j;
                const branchColors = BRANCH_ELEMENT_COLORS[branch.element];
                const hasContent = !!mdSlots[slotIdx];
                const isExpanded = expandedAnimal === branch.animal;
                const stems = getStemsForAnimal(branch.polarity);
                const sexCount = stems.filter(s => !!sexMdSlots[sexKey(s.element, branch.animal)]).length;
                return (
                  <React.Fragment key={branch.animal}>
                    {j > 0 && j % 4 === 0 && <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', margin: '1px 0' }} />}
                    {/* Original branch MD row: animal button + Im + Ex + expand toggle */}
                    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setShowMdSlot(slotIdx)}
                        disabled={!hasContent}
                        title={`${branch.polarity} ${branch.animal} ${branch.char}`}
                        style={{
                          padding: '3px 6px', borderRadius: '5px', fontSize: '10px', fontWeight: 600,
                          cursor: hasContent ? 'pointer' : 'default', whiteSpace: 'nowrap', flex: 1,
                          background: hasContent ? branchColors.bg : 'rgba(100, 116, 139, 0.06)',
                          border: `1px solid ${hasContent ? branchColors.border : 'rgba(100, 116, 139, 0.12)'}`,
                          color: hasContent ? branchColors.text : '#4b5563',
                          opacity: hasContent ? 1 : 0.5,
                        }}
                      >
                        {branch.char} {branch.animal}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleImportMdSlot(slotIdx)}
                        title={`Import MD for ${branch.animal}`}
                        style={{
                          padding: '3px 5px', borderRadius: '5px', fontSize: '9px', fontWeight: 600,
                          cursor: 'pointer', whiteSpace: 'nowrap',
                          background: branchColors.bg, border: `1px solid ${branchColors.border}`, color: branchColors.text,
                        }}
                      >
                        Im
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExportMdSlot(slotIdx)}
                        disabled={!hasContent}
                        title={`Export MD for ${branch.animal}`}
                        style={{
                          padding: '3px 5px', borderRadius: '5px', fontSize: '9px', fontWeight: 600,
                          cursor: hasContent ? 'pointer' : 'default', whiteSpace: 'nowrap',
                          background: branchColors.bg, border: `1px solid ${branchColors.border}`,
                          color: hasContent ? branchColors.text : '#4b5563',
                          opacity: hasContent ? 1 : 0.5,
                        }}
                      >
                        Ex
                      </button>
                      {/* Expand toggle for 5 sexagenary stems */}
                      <button
                        type="button"
                        onClick={() => setExpandedAnimal(isExpanded ? null : branch.animal)}
                        title={isExpanded ? 'Collapse' : `Expand 5 ${branch.animal} stems`}
                        style={{
                          padding: '3px 4px', borderRadius: '5px', fontSize: '8px', fontWeight: 600,
                          cursor: 'pointer', whiteSpace: 'nowrap', lineHeight: 1,
                          background: isExpanded ? branchColors.bg : 'rgba(100, 116, 139, 0.06)',
                          border: `1px solid ${isExpanded ? branchColors.border : 'rgba(100, 116, 139, 0.15)'}`,
                          color: isExpanded ? branchColors.text : '#64748b',
                          transition: 'all 0.15s',
                        }}
                      >
                        {sexCount > 0 && <span style={{ color: branchColors.text, marginRight: '2px' }}>{sexCount}</span>}
                        {isExpanded ? '\u25B2' : '\u25BC'}
                      </button>
                    </div>
                    {/* Expanded: 5 stem-animal combinations */}
                    {isExpanded && stems.map(stem => {
                      const key = sexKey(stem.element, branch.animal);
                      const hasSex = !!sexMdSlots[key];
                      const stemColors = BRANCH_ELEMENT_COLORS[stem.element];
                      return (
                        <div key={key} style={{ display: 'flex', gap: '3px', alignItems: 'center', paddingLeft: '8px' }}>
                          <button
                            type="button"
                            onClick={() => hasSex && setShowSexMd(key)}
                            disabled={!hasSex}
                            title={`${stem.label} ${branch.animal}`}
                            style={{
                              padding: '2px 5px', borderRadius: '4px', fontSize: '9px', fontWeight: 600,
                              cursor: hasSex ? 'pointer' : 'default', whiteSpace: 'nowrap', flex: 1,
                              textAlign: 'left',
                              background: hasSex ? stemColors.bg : 'rgba(100, 116, 139, 0.04)',
                              border: `1px solid ${hasSex ? stemColors.border : 'rgba(100, 116, 139, 0.1)'}`,
                              color: hasSex ? stemColors.text : '#4b5563',
                              opacity: hasSex ? 1 : 0.5,
                            }}
                          >
                            {stem.label} {branch.animal}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleImportSexMd(key)}
                            title={`Import MD for ${stem.label} ${branch.animal}`}
                            style={{
                              padding: '2px 4px', borderRadius: '4px', fontSize: '8px', fontWeight: 600,
                              cursor: 'pointer', whiteSpace: 'nowrap',
                              background: stemColors.bg, border: `1px solid ${stemColors.border}`, color: stemColors.text,
                            }}
                          >
                            Im
                          </button>
                          <button
                            type="button"
                            onClick={() => handleExportSexMd(key)}
                            disabled={!hasSex}
                            title={`Export MD for ${stem.label} ${branch.animal}`}
                            style={{
                              padding: '2px 4px', borderRadius: '4px', fontSize: '8px', fontWeight: 600,
                              cursor: hasSex ? 'pointer' : 'default', whiteSpace: 'nowrap',
                              background: stemColors.bg, border: `1px solid ${stemColors.border}`,
                              color: hasSex ? stemColors.text : '#4b5563',
                              opacity: hasSex ? 1 : 0.5,
                            }}
                          >
                            Ex
                          </button>
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '4px 0' }} />
              <button
                type="button"
                onClick={() => setShowCycles(true)}
                style={{
                  padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  background: 'rgba(234, 179, 8, 0.12)',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  color: '#fbbf24',
                }}
              >
                Cycles
              </button>
              <button
                type="button"
                onClick={() => setShowCompatibility(true)}
                style={{
                  padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#34d399',
                }}
              >
                Compatibility
              </button>
              <button
                type="button"
                onClick={() => setShowInteractiveCycles(true)}
                style={{
                  padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  background: 'rgba(59, 130, 246, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#60a5fa',
                }}
              >
                Interactive Cycles
              </button>
              <button
                type="button"
                onClick={() => setShowHiddenStems(true)}
                style={{
                  padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  background: 'rgba(168, 85, 247, 0.12)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  color: '#d8b4fe',
                }}
              >
                Hidden Stems 藏干
              </button>
              <input
                type="file"
                ref={(el) => { mdFileInputRefs.current[0] = el; }}
                accept=".md,.markdown,.txt"
                style={{ display: 'none' }}
                onChange={handleMdSlotFileChange}
                title="Import BaZi Markdown file"
              />
              {/* Hidden file input for sexagenary MD import */}
              <input
                type="file"
                ref={sexMdFileRef}
                accept=".md,.markdown,.txt"
                style={{ display: 'none' }}
                onChange={handleSexMdFileChange}
                title="Import Sexagenary Markdown file"
              />
            </div>
          </div>

          {/* Four Pillars Grid — full width row */}
          {chart && (
            <div style={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              padding: '16px',
              marginBottom: '16px',
            }}>
              <FourPillarsGrid
                pillars={chart.pillars}
                compact={false}
                showHiddenRoots={true}
              />
            </div>
          )}

          {/* Day Master Throne + Day Master Card — 2-column row */}
          {chart && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* P. Day Master Throne */}
              {(() => {
                const dmElement = chart.dayMaster?.element || 'Wood';
                const dmStemIdx = chart.pillars?.[2]?.stem?.index ?? 0;
                const dmPolarity = STEM_SEGMENTS[dmStemIdx]?.polarity || 'Yang';
                const dmBranch = chart.pillars?.[2]?.branch;
                const dmColor = ELEMENT_COLORS[dmElement] || '#64748b';
                return (
                  <div style={{
                    background: 'rgba(30, 41, 59, 0.6)',
                    border: `1px solid ${dmColor}30`,
                    borderRadius: '14px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#94a3b8',
                      letterSpacing: '1px',
                      marginBottom: '12px',
                    }}>
                      DAY MASTER
                    </div>
                    {/* Throne circle */}
                    <div style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${dmColor}30, ${dmColor}08)`,
                      border: `2px solid ${dmColor}60`,
                      boxShadow: `0 0 20px ${dmColor}20`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '12px',
                    }}>
                      <span style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        color: '#fff',
                        fontFamily: "'Noto Sans SC', serif",
                      }}>
                        {ELEMENT_GLYPHS[dmElement]}
                      </span>
                      <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '-2px' }}>
                        {POLARITY_ICONS[dmPolarity]}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: dmColor }}>
                      {dmPolarity} {dmElement}
                    </div>
                    {dmBranch && (
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                        {dmBranch.char} {dmBranch.animal}
                      </div>
                    )}
                    <div style={{
                      fontSize: '11px',
                      color: '#cbd5e1',
                      marginTop: '10px',
                      lineHeight: 1.5,
                      maxWidth: '200px',
                    }}>
                      {DAY_MASTER_DESCRIPTIONS[dmElement] || ''}
                    </div>
                  </div>
                );
              })()}

              {/* Day Master Card (detailed) */}
              <div style={{
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px',
                padding: '16px',
              }}>
                <DayMasterCard
                  dayMaster={chart.dayMaster}
                  compact={false}
                />
              </div>
            </div>
          )}

          {/* U. Element Weather System — dynamic background overlay */}
          {chart?.elements?.percentages && (() => {
            const weather = getElementWeather(chart.elements.percentages);
            return (
              <div style={{
                background: `linear-gradient(135deg, ${weather.gradientFrom}, ${weather.gradientTo})`,
                border: `1px solid ${weather.particleColor}20`,
                borderRadius: '14px',
                padding: '14px 20px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'background 0.6s',
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: `${weather.particleColor}20`,
                  border: `2px solid ${weather.particleColor}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontFamily: "'Noto Sans SC', serif",
                  color: weather.particleColor,
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {ELEMENT_GLYPHS[weather.dominant]}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: weather.particleColor }}>
                    {weather.label}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {weather.description}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* W. Elemental Storm Alerts */}
          {chart?.elements?.percentages && (() => {
            const storms = detectElementStorms(
              chart.elements.percentages,
              chart.interactions,
            );
            if (storms.length === 0) return null;
            return (
              <div style={{
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                {storms.map((alert: ElementStormAlert, i: number) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: alert.level === 'extreme'
                      ? 'rgba(239, 68, 68, 0.08)'
                      : alert.level === 'strong'
                        ? 'rgba(245, 158, 11, 0.06)'
                        : 'rgba(100, 116, 139, 0.05)',
                    border: `1px solid ${alert.level === 'extreme'
                      ? 'rgba(239, 68, 68, 0.25)'
                      : alert.level === 'strong'
                        ? 'rgba(245, 158, 11, 0.2)'
                        : 'rgba(100, 116, 139, 0.12)'}`,
                  }}>
                    <span style={{
                      fontSize: '14px',
                      flexShrink: 0,
                      width: '20px',
                      textAlign: 'center',
                    }}>
                      {alert.level === 'extreme' ? '\u26A0' : alert.level === 'strong' ? '\u25C6' : '\u25CB'}
                    </span>
                    {alert.element && (
                      <span style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: alert.color,
                        opacity: 0.7,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        color: '#fff',
                        fontWeight: 700,
                        fontFamily: "'Noto Sans SC', serif",
                        flexShrink: 0,
                      }}>
                        {ELEMENT_GLYPHS[alert.element] || ''}
                      </span>
                    )}
                    <div style={{ flex: 1 }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: alert.level === 'extreme' ? '#ef4444' : (alert.level === 'strong' ? '#f59e0b' : '#94a3b8'),
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginRight: '6px',
                      }}>
                        {alert.type}
                      </span>
                      <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
                        {alert.message}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* V. Heaven-Earth-Human Alignment Beam */}
          {chart && (() => {
            const alignments = getAlignmentData(chart.pillars);
            return (
              <div style={{
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px',
                padding: '16px 20px',
                marginBottom: '16px',
              }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#cbd5e1',
                  letterSpacing: '0.5px',
                  marginBottom: '10px',
                }}>
                  HEAVEN–EARTH–HUMAN ALIGNMENT
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {alignments.map((a: AlignmentData) => {
                    const hColor = ELEMENT_COLORS[a.heaven] || '#64748b';
                    const eColor = ELEMENT_COLORS[a.earth] || '#64748b';
                    const uColor = ELEMENT_COLORS[a.human] || '#64748b';
                    return (
                      <div key={a.pillarIdx} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        padding: '8px 14px',
                        borderRadius: '10px',
                        background: a.aligned
                          ? 'rgba(34, 197, 94, 0.08)'
                          : a.harmonic
                            ? 'rgba(59, 130, 246, 0.06)'
                            : 'rgba(255,255,255,0.02)',
                        border: a.aligned
                          ? '1px solid rgba(34, 197, 94, 0.25)'
                          : a.harmonic
                            ? '1px solid rgba(59, 130, 246, 0.15)'
                            : '1px solid rgba(255,255,255,0.06)',
                        minWidth: '80px',
                      }}>
                        <span style={{ fontSize: '9px', fontWeight: 700, color: a.pillarIdx === 2 ? '#fbbf24' : '#94a3b8' }}>
                          {a.label}
                        </span>
                        {/* Heaven (stem) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '8px', color: '#cbd5e1', width: '24px' }}>
                            {'\u5929'}
                          </span>
                          <span style={{
                            width: '20px', height: '20px', borderRadius: '50%',
                            background: `${hColor}25`, border: `1px solid ${hColor}50`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '10px', color: hColor, fontWeight: 700,
                            fontFamily: "'Noto Sans SC', serif",
                          }}>
                            {ELEMENT_GLYPHS[a.heaven]}
                          </span>
                        </div>
                        {/* Beam line */}
                        <div style={{
                          width: '2px',
                          height: '10px',
                          background: a.aligned
                            ? 'rgba(34, 197, 94, 0.5)'
                            : a.harmonic
                              ? 'rgba(59, 130, 246, 0.3)'
                              : 'rgba(255,255,255,0.1)',
                          transition: 'background 0.4s',
                        }} />
                        {/* Earth (branch) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '8px', color: '#cbd5e1', width: '24px' }}>
                            {'\u5730'}
                          </span>
                          <span style={{
                            width: '20px', height: '20px', borderRadius: '50%',
                            background: `${eColor}25`, border: `1px solid ${eColor}50`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '10px', color: eColor, fontWeight: 700,
                            fontFamily: "'Noto Sans SC', serif",
                          }}>
                            {ELEMENT_GLYPHS[a.earth]}
                          </span>
                        </div>
                        {/* Beam line */}
                        <div style={{
                          width: '2px',
                          height: '10px',
                          background: a.aligned
                            ? 'rgba(34, 197, 94, 0.5)'
                            : a.harmonic
                              ? 'rgba(59, 130, 246, 0.3)'
                              : 'rgba(255,255,255,0.1)',
                          transition: 'background 0.4s',
                        }} />
                        {/* Human (hidden stem) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '8px', color: '#cbd5e1', width: '24px' }}>
                            {'\u4EBA'}
                          </span>
                          <span style={{
                            width: '20px', height: '20px', borderRadius: '50%',
                            background: `${uColor}25`, border: `1px solid ${uColor}50`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '10px', color: uColor, fontWeight: 700,
                            fontFamily: "'Noto Sans SC', serif",
                          }}>
                            {ELEMENT_GLYPHS[a.human]}
                          </span>
                        </div>
                        {/* Alignment status */}
                        <span style={{
                          fontSize: '8px',
                          fontWeight: 600,
                          color: a.aligned ? '#22c55e' : (a.harmonic ? '#3b82f6' : '#94a3b8'),
                          marginTop: '2px',
                        }}>
                          {a.aligned ? 'Aligned' : (a.harmonic ? 'Harmonic' : 'Mixed')}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* Alignment legend */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '12px',
                  marginTop: '10px',
                  fontSize: '9px',
                  color: '#94a3b8',
                }}>
                  <span>{'\u5929'} = Heaven (Stem)</span>
                  <span>{'\u5730'} = Earth (Branch)</span>
                  <span>{'\u4EBA'} = Human (Hidden Stem)</span>
                  <span style={{ color: '#22c55e' }}>Aligned = all same element</span>
                </div>
              </div>
            );
          })()}

          {/* V½. Identity Architecture — Heaven–Earth–Human Psychological Engine */}
          {chart && (() => {
            const idAlignments = getAlignmentData(chart.pillars);
            return (
              <IdentityArchitecturePanel
                pillars={chart.pillars}
                alignments={idAlignments}
              />
            );
          })()}

          {/* Y. AI Chart Interpretation — Multi-Mode */}
          {chart && (() => {
            const hasAnyReading = aiReading || masterReading || shadowReading || aiRawFallback;
            const modeLabels: Record<ReadingMode, { label: string; icon: string; loading: string }> = {
              soul:   { label: 'Deep Soul Reading',  icon: '\u{1F52E}', loading: 'Channeling your reading...' },
              master: { label: 'Master Commentary',   icon: '\u{1F3AF}', loading: 'Analyzing chart structure...' },
              shadow: { label: 'Shadow Reading',      icon: '\u{1F311}', loading: 'Exploring the shadow...' },
            };
            const currentMode = modeLabels[readingMode];

            return (
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(139, 92, 246, 0.15)',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '16px',
            }}>
              {/* Header */}
              <div style={{ marginBottom: hasAnyReading ? '12px' : '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#a78bfa', letterSpacing: '0.5px' }}>
                      AI CHART READING
                    </span>
                    <span style={{ fontSize: '9px', color: '#94a3b8', marginLeft: '8px' }}>
                      Powered by Claude
                    </span>
                  </div>
                </div>

                {/* Profile info line */}
                {selectedProfile && (
                  <div style={{
                    fontSize: '11px', color: '#cbd5e1', lineHeight: 1.7,
                    padding: '8px 12px', marginBottom: '10px',
                    background: 'rgba(139, 92, 246, 0.06)', borderRadius: '8px',
                    border: '1px solid rgba(139, 92, 246, 0.15)',
                  }}>
                    <span style={{ color: '#e0d4ff', fontWeight: 700, fontSize: '12px' }}>
                      {selectedProfile.displayName || selectedProfile.fullName || `${selectedProfile.firstName || ''} ${selectedProfile.lastName || ''}`.trim() || selectedProfile.name || 'Unknown'}
                    </span>
                    {selectedProfile.birthDate && (
                      <span style={{ color: '#e2e8f0' }}>{' '}&middot; {selectedProfile.birthDate}{selectedProfile.birthTime ? ` ${selectedProfile.birthTime}` : ''}</span>
                    )}
                    {selectedProfile.location?.fullAddress && (
                      <span style={{ color: '#e2e8f0' }}>{' '}&middot; {selectedProfile.location.fullAddress}</span>
                    )}
                    {selectedProfile.location?.coordinates?.lat != null && selectedProfile.location?.coordinates?.lng != null && (
                      <span style={{ color: '#a5b4c8' }}>
                        {' '}({selectedProfile.location.coordinates.lat.toFixed(4)}, {selectedProfile.location.coordinates.lng.toFixed(4)})
                      </span>
                    )}
                  </div>
                )}

                {/* Mode selector pills */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
                  {(['soul', 'master', 'shadow'] as ReadingMode[]).map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setReadingMode(mode)}
                      disabled={aiLoading}
                      style={{
                        flex: 1,
                        padding: '5px 8px',
                        background: readingMode === mode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.03)',
                        border: readingMode === mode ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '6px',
                        color: readingMode === mode ? '#c4b5fd' : '#94a3b8',
                        fontSize: '10px',
                        fontWeight: readingMode === mode ? 700 : 500,
                        cursor: aiLoading ? 'wait' : 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {modeLabels[mode].icon} {mode === 'soul' ? 'Soul Reading' : mode === 'master' ? 'Master Commentary' : 'Shadow Reading'}
                    </button>
                  ))}
                </div>

                {/* Generate button */}
                <button
                  type="button"
                  onClick={handleExplainChart}
                  disabled={aiLoading}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    background: aiLoading ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.15)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    color: aiLoading ? '#94a3b8' : '#c4b5fd',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: aiLoading ? 'wait' : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  {aiLoading ? (
                    <>
                      <span style={{
                        display: 'inline-block', width: '12px', height: '12px',
                        border: '2px solid rgba(139, 92, 246, 0.3)', borderTopColor: '#a78bfa',
                        borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                      }} />
                      {currentMode.loading}
                    </>
                  ) : (
                    <>{currentMode.icon} {currentMode.label}</>
                  )}
                </button>

                {/* Auto-Generate Full Reading button */}
                {selectedProfile?.id && (
                  <button
                    type="button"
                    onClick={handleAutoGenerate}
                    disabled={autoGenLoading || aiLoading}
                    style={{
                      width: '100%',
                      padding: '8px 16px',
                      marginTop: '6px',
                      background: autoGenLoading ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.12)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: '8px',
                      color: autoGenLoading ? '#94a3b8' : '#fbbf24',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: autoGenLoading || aiLoading ? 'wait' : 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    {autoGenLoading ? (
                      <>
                        <span style={{
                          display: 'inline-block', width: '12px', height: '12px',
                          border: '2px solid rgba(245, 158, 11, 0.3)', borderTopColor: '#fbbf24',
                          borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                        }} />
                        {autoGenStatus || 'Generating...'}
                      </>
                    ) : (
                      <>{'\u2728'} Auto-Generate Full Reading (All 3 Modes)</>
                    )}
                  </button>
                )}
                {autoGenError && (
                  <div style={{
                    padding: '6px 10px', marginTop: '4px', borderRadius: '6px',
                    background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#f87171', fontSize: '10px',
                  }}>
                    {autoGenError}
                  </div>
                )}
              </div>

              {/* Loading shimmer */}
              {aiLoading && (
                <div style={{
                  padding: '16px', borderRadius: '10px',
                  background: 'rgba(139, 92, 246, 0.04)', border: '1px solid rgba(139, 92, 246, 0.08)',
                }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                    <div key={n} style={{
                      height: '12px', borderRadius: '4px', background: 'rgba(139, 92, 246, 0.08)',
                      marginBottom: n < 8 ? '8px' : 0,
                      width: n === 8 ? '40%' : n % 2 === 0 ? '80%' : '100%',
                      animation: `pulse 1.5s ease-in-out ${n * 0.1}s infinite`,
                    }} />
                  ))}
                </div>
              )}

              {/* Error */}
              {aiError && (
                <div style={{
                  padding: '10px 14px', borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#f87171', fontSize: '12px',
                }}>
                  {aiError}
                </div>
              )}

              {/* Soul Reading — 8 sections */}
              {readingMode === 'soul' && aiReading && !aiLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {READING_SECTION_META.map(({ key, label, icon, sublabel }) => (
                    <ReadingSection
                      key={key} icon={icon} label={label} sublabel={sublabel}
                      content={aiReading[key]}
                      isSpecial={key === 'emotionalMirror' || key === 'soulMessage'}
                    />
                  ))}
                  <div style={{
                    marginTop: '8px', paddingTop: '10px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: '9px', color: '#94a3b8' }}>
                      AI interpretation — for educational purposes
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button type="button" onClick={() => setShowReadingStorybook(true)} style={{
                        padding: '3px 10px', background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '6px',
                        color: '#c4b5fd', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                      }}>
                        Storybook View
                      </button>
                      <button type="button" onClick={handleDownloadPDF} style={{
                        padding: '3px 10px', background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '6px',
                        color: '#4ade80', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                      }}>
                        PDF
                      </button>
                      {lastPromptData && (
                        <button type="button" onClick={() => setShowPromptViewer(true)} style={{
                          padding: '3px 10px', background: 'rgba(251, 191, 36, 0.1)',
                          border: '1px solid rgba(251, 191, 36, 0.2)', borderRadius: '6px',
                          color: '#fbbf24', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                        }}>
                          View Prompt
                        </button>
                      )}
                      <button type="button" onClick={handleExplainChart} style={{
                        padding: '3px 10px', background: 'rgba(100, 116, 139, 0.1)',
                        border: '1px solid rgba(100, 116, 139, 0.2)', borderRadius: '6px',
                        color: '#94a3b8', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                      }}>
                        Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Master Commentary — single section */}
              {readingMode === 'master' && masterReading && !aiLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <ReadingSection
                    icon={MASTER_SECTION_META[0].icon}
                    label={MASTER_SECTION_META[0].label}
                    sublabel={MASTER_SECTION_META[0].sublabel}
                    content={masterReading.masterCommentary}
                  />
                  <div style={{
                    marginTop: '8px', paddingTop: '10px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: '9px', color: '#94a3b8' }}>
                      Technical analysis — for advanced study
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button type="button" onClick={handleDownloadPDF} style={{
                        padding: '3px 10px', background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '6px',
                        color: '#4ade80', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                      }}>
                        PDF
                      </button>
                      {lastPromptData && (
                        <button type="button" onClick={() => setShowPromptViewer(true)} style={{
                          padding: '3px 10px', background: 'rgba(251, 191, 36, 0.1)',
                          border: '1px solid rgba(251, 191, 36, 0.2)', borderRadius: '6px',
                          color: '#fbbf24', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                        }}>
                          View Prompt
                        </button>
                      )}
                      <button type="button" onClick={handleExplainChart} style={{
                        padding: '3px 10px', background: 'rgba(100, 116, 139, 0.1)',
                        border: '1px solid rgba(100, 116, 139, 0.2)', borderRadius: '6px',
                        color: '#94a3b8', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                      }}>
                        Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Shadow Reading — two sections */}
              {readingMode === 'shadow' && shadowReading && !aiLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {SHADOW_SECTION_META.map(({ key, label, icon, sublabel }) => (
                    <ReadingSection
                      key={key} icon={icon} label={label} sublabel={sublabel}
                      content={shadowReading[key]}
                      isSpecial={key === 'healingPath'}
                    />
                  ))}
                  <div style={{
                    marginTop: '8px', paddingTop: '10px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: '9px', color: '#94a3b8' }}>
                      Shadow work — for self-awareness and growth
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button type="button" onClick={handleDownloadPDF} style={{
                        padding: '3px 10px', background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '6px',
                        color: '#4ade80', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                      }}>
                        PDF
                      </button>
                      {lastPromptData && (
                        <button type="button" onClick={() => setShowPromptViewer(true)} style={{
                          padding: '3px 10px', background: 'rgba(251, 191, 36, 0.1)',
                          border: '1px solid rgba(251, 191, 36, 0.2)', borderRadius: '6px',
                          color: '#fbbf24', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                        }}>
                          View Prompt
                        </button>
                      )}
                      <button type="button" onClick={handleExplainChart} style={{
                        padding: '3px 10px', background: 'rgba(100, 116, 139, 0.1)',
                        border: '1px solid rgba(100, 116, 139, 0.2)', borderRadius: '6px',
                        color: '#94a3b8', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                      }}>
                        Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Fallback — plain text when JSON parsing fails */}
              {aiRawFallback && !aiReading && !masterReading && !shadowReading && !aiLoading && (
                <div style={{
                  padding: '16px', borderRadius: '10px',
                  background: 'rgba(139, 92, 246, 0.04)', border: '1px solid rgba(139, 92, 246, 0.1)',
                }}>
                  <div style={{ fontSize: '13px', lineHeight: 1.7, color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>
                    {renderBoldText(aiRawFallback)}
                  </div>
                  <div style={{
                    marginTop: '12px', paddingTop: '10px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: '9px', color: '#94a3b8' }}>
                      AI interpretation — for educational purposes
                    </span>
                    <button type="button" onClick={handleExplainChart} style={{
                      padding: '3px 10px', background: 'rgba(100, 116, 139, 0.1)',
                      border: '1px solid rgba(100, 116, 139, 0.2)', borderRadius: '6px',
                      color: '#94a3b8', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                    }}>
                      Regenerate
                    </button>
                  </div>
                </div>
              )}
            </div>
            );
          })()}

          {/* AB. Life Themes */}
          {chart && lifeThemes.length > 0 && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#cbd5e1', letterSpacing: '0.5px', marginBottom: '10px' }}>
                LIFE THEMES
              </div>
              <LifeThemePanel themes={lifeThemes} />
            </div>
          )}

          {/* Z. Fate Currents */}
          {chart && fateCurrents.length > 0 && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#cbd5e1', letterSpacing: '0.5px', marginBottom: '10px' }}>
                FATE CURRENTS — Element Flow Across Decades
              </div>
              <FateCurrentsChart data={fateCurrents} />
            </div>
          )}

          {/* AA. Synastry Resonance Map */}
          {chart && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#cbd5e1', letterSpacing: '0.5px' }}>
                  SYNASTRY RESONANCE MAP
                </div>
                <select
                  value={secondProfileId || ''}
                  onChange={(e) => setSecondProfileId(e.target.value || null)}
                  style={{
                    padding: '4px 10px', background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px',
                    color: '#e2e8f0', fontSize: '11px',
                  }}
                  aria-label="Select second profile for synastry"
                >
                  <option value="">-- Compare with --</option>
                  {profiles?.filter((p: any) => p.id !== selectedProfileId).map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.name || p.firstName || 'Unnamed'}
                    </option>
                  ))}
                </select>
              </div>
              {secondChart ? (
                <SynastryResonanceMap
                  links={synastryLinks}
                  nameA={selectedProfile?.name || selectedProfile?.firstName || 'Person A'}
                  nameB={secondProfile?.name || secondProfile?.firstName || 'Person B'}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px', padding: '20px' }}>
                  Select a second profile above to compare charts
                </div>
              )}
            </div>
          )}

          {/* Legend Panel with Five Element Cycle */}
          {chart && (
            <div className="mb-6">
              <BaziLegendPanel
                monthBranchIdx={chart.pillars[1]?.branch?.index ?? 0}
                dayMasterElement={chart.dayMaster?.element}
                currentDate={currentDate}
              />
            </div>
          )}

          {/* X. Destiny Cycle Navigator */}
          {chart && <DestinyCycleNavigator currentYear={currentDate.getFullYear()} />}

          {/* Education Flaps */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '20px',
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#e2e8f0',
              marginBottom: '12px',
            }}>
              Learn BaZi Fundamentals
            </h3>
            {EDUCATION_SECTIONS.map((section, i) => (
              <EducationFlap key={i} title={section.title} content={section.content} />
            ))}
          </div>
        </BaziThemeProvider>
      </div>

      {/* Y. Heavenly Calendar overlay */}
      {showCalendar && (
        <HeavenlyCalendarMode
          currentDate={currentDate}
          onClose={() => setShowCalendar(false)}
        />
      )}

      {/* AC. Storybook overlay */}
      {showStorybook && storybookNarrative && (
        <BaZiStorybookMode
          narrative={storybookNarrative}
          onClose={() => setShowStorybook(false)}
        />
      )}

      {/* Reading Storybook Overlay — full-screen immersive AI reading */}
      {showReadingStorybook && aiReading && (
        <ReadingStorybookOverlay
          reading={aiReading}
          onClose={() => setShowReadingStorybook(false)}
          profileName={selectedProfile?.name || selectedProfile?.firstName || 'Your'}
        />
      )}

      {/* Prompt Viewer Overlay — inspect system + user messages sent to Claude */}
      {showPromptViewer && lastPromptData && (
        <PromptViewerOverlay
          data={lastPromptData}
          onClose={() => setShowPromptViewer(false)}
        />
      )}

      {/* BaZi MD floating viewer */}
      {showMdSlot !== null && mdSlots[showMdSlot] && (
        <FloatingMdWindow
          content={mdSlots[showMdSlot]}
          title={showMdSlot < MD_SLOT_COUNT
            ? `BaZi ${showMdSlot + 1} MD`
            : `${BRANCH_MD_LABELS[showMdSlot - MD_SLOT_COUNT].char} ${BRANCH_MD_LABELS[showMdSlot - MD_SLOT_COUNT].animal} MD`
          }
          onClose={() => setShowMdSlot(null)}
        />
      )}

      {/* Sexagenary MD floating viewer */}
      {showSexMd && sexMdSlots[showSexMd] && (() => {
        const [stemEl, ...animalParts] = showSexMd.split('_');
        const animalName = animalParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
        const branch = BRANCH_MD_LABELS.find(b => b.animal.toLowerCase() === animalParts.join(' ').toLowerCase()
          || b.animal.toLowerCase() === animalParts[0]);
        const stemLabel = branch
          ? (getStemsForAnimal(branch.polarity).find(s => s.element.toLowerCase() === stemEl)?.label || stemEl)
          : stemEl;
        return (
          <FloatingMdWindow
            content={sexMdSlots[showSexMd]}
            title={`${stemLabel} ${animalName} MD`}
            onClose={() => setShowSexMd(null)}
          />
        );
      })()}

      {/* Hidden Stems educational viewer */}
      {showHiddenStems && (
        <FloatingMdWindow
          content={HIDDEN_STEMS_MD}
          title="Hidden Stems 藏干 — Complete Reference"
          onClose={() => setShowHiddenStems(false)}
        />
      )}

      {/* Cycles floating viewer */}
      {/* Compatibility floating iframe */}
      {showCompatibility && ReactDOM.createPortal(
        <div style={{
          position: 'fixed', left: compatPos.x, top: compatPos.y, zIndex: 9999,
          width: 1050, maxWidth: '95vw', height: '92vh',
          display: 'flex', flexDirection: 'column',
          borderRadius: 10, border: '1px solid #4b5563',
          background: '#111827', boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}>
          <div
            onMouseDown={(e) => {
              compatDragRef.current = { startX: e.clientX, startY: e.clientY, origX: compatPos.x, origY: compatPos.y };
            }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', background: '#1f2937',
              borderBottom: '1px solid #374151',
              cursor: 'grab', userSelect: 'none',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: '#34d399' }}>Compatibility Matrix</span>
            <button
              type="button"
              onClick={() => setShowCompatibility(false)}
              style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 20, cursor: 'pointer', padding: '0 4px' }}
            >&times;</button>
          </div>
          <iframe
            src="/Complete_Compatibility_Matrix_Interactive.html"
            title="Compatibility Matrix"
            style={{ flex: 1, border: 'none', width: '100%', background: '#fff' }}
          />
        </div>,
        document.body,
      )}

      {/* Interactive Cycles floating iframe */}
      {showInteractiveCycles && ReactDOM.createPortal(
        <div style={{
          position: 'fixed', left: interCyclesPos.x, top: interCyclesPos.y, zIndex: 9999,
          width: 1050, maxWidth: '95vw', height: '92vh',
          display: 'flex', flexDirection: 'column',
          borderRadius: 10, border: '1px solid #4b5563',
          background: '#111827', boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}>
          <div
            onMouseDown={(e) => {
              interCyclesDragRef.current = { startX: e.clientX, startY: e.clientY, origX: interCyclesPos.x, origY: interCyclesPos.y };
            }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', background: '#1f2937',
              borderBottom: '1px solid #374151',
              cursor: 'grab', userSelect: 'none',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: '#60a5fa' }}>Interactive Cycles</span>
            <button
              type="button"
              onClick={() => setShowInteractiveCycles(false)}
              style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 20, cursor: 'pointer', padding: '0 4px' }}
            >&times;</button>
          </div>
          <iframe
            src="/interactive_cycles.html"
            title="Interactive Cycles"
            style={{ flex: 1, border: 'none', width: '100%', background: '#fff' }}
          />
        </div>,
        document.body,
      )}

      {showCycles && (() => {
        const tabs = [
          { label: 'All Three', src: '/cycles/three_cycles_comparison.svg' },
          { label: 'Producing', src: '/cycles/producing_cycle_diagram.svg' },
          { label: 'Controlling', src: '/cycles/controlling_cycle_diagram.svg' },
          { label: 'Weakening', src: '/cycles/weakening_cycle_diagram.svg' },
        ];
        return ReactDOM.createPortal(
          <div style={{
            position: 'fixed', left: cyclePos.x, top: cyclePos.y, zIndex: 9999,
            width: cycleTab === 0 ? 1050 : 820, maxWidth: '95vw', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column',
            borderRadius: 10, border: '1px solid #4b5563',
            background: '#111827', boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
            overflow: 'hidden', transition: 'width 0.2s ease',
          }}>
            <div
              onMouseDown={(e) => {
                cycleDragRef.current = { startX: e.clientX, startY: e.clientY, origX: cyclePos.x, origY: cyclePos.y };
              }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px', background: '#1f2937',
                borderBottom: '1px solid #374151',
                cursor: 'grab', userSelect: 'none',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: '#fbbf24' }}>Five Element Cycles</span>
              <button
                type="button"
                onClick={() => setShowCycles(false)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 20, cursor: 'pointer', padding: '0 4px' }}
              >&times;</button>
            </div>
            <div style={{
              display: 'flex', gap: 4, padding: '8px 12px', background: '#1a2332',
              borderBottom: '1px solid #374151',
            }}>
              {tabs.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCycleTab(i)}
                  style={{
                    padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    cursor: 'pointer', border: 'none',
                    background: cycleTab === i ? 'rgba(234, 179, 8, 0.2)' : 'transparent',
                    color: cycleTab === i ? '#fbbf24' : '#9ca3af',
                  }}
                >{t.label}</button>
              ))}
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: 16, background: '#ffffff' }}>
              <img
                src={tabs[cycleTab].src}
                alt={tabs[cycleTab].label}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>,
          document.body,
        );
      })()}
    </div>
  );
}
