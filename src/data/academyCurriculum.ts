/**
 * academyCurriculum.ts
 * ====================
 *
 * Full curriculum data for the Western Zodiac Academy.
 * A 12-chapter initiation through the living zodiac.
 *
 * GENESIS AstroProfile - January 2026
 */

// =============================================================================
// TYPES
// =============================================================================

export type AcademyPracticeItem = {
  label: string;
  description: string;
};

export type LessonSection = {
  title: string;
  icon?: string;
  content: string;
};

export type AcademyChapter = {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  mythicTagline: string;
  icon: string;
  objectives: string[];
  /** Rich lesson content with detailed educational material */
  lessonContent: LessonSection[];
  coreConcepts: string[];
  practiceMode: AcademyPracticeItem[];
  ritualModePrompts: string[];
};

// =============================================================================
// CURRICULUM DATA
// =============================================================================

export const ACADEMY_CHAPTERS: AcademyChapter[] = [
  {
    id: 'chapter-1-foundations',
    order: 1,
    title: 'The Zodiac as a Living System',
    subtitle: 'The sky is a clock, the signs are its hours.',
    mythicTagline: 'A first step into the twelvefold temple.',
    icon: '🌌',
    objectives: [
      'Understand the zodiac as a symbolic, psychological, and seasonal system.',
      'Learn the elemental, modal, and polarity foundations.',
      'Establish the Academy\'s mythic worldview.',
    ],
    lessonContent: [
      {
        title: 'What We\'re Actually Doing Here',
        icon: '🌍',
        content: `**This ISN'T fortune-telling.** We're not predicting your future, reading horoscopes, or blaming Mercury for bad days.

**This IS pattern recognition** — 2,000+ years of observed human behavior mapped to a mathematical framework.

Think of it like this: Myers-Briggs asks "How do you prefer to act?" while GENESIS asks "What were you built to be?"

Myers-Briggs uses questionnaires. GENESIS uses birth data (time, date, location).

Both attempt to answer the same question: **"What kind of human are you, and who fits with you?"**`
      },
      {
        title: 'What Is The Zodiac?',
        icon: '📚',
        content: `The zodiac is a 360-degree circle divided into 12 sections, each representing approximately one month of the year, based on the Sun's apparent path through the sky as seen from Earth.

**Why 12 Sections?**

Around 2,500 years ago, Babylonian astronomers divided the sky into 12 equal parts because:
- The Moon cycles through approximately 12 full moons per year
- Ancient people observed 12 distinct constellations along the Sun's path
- 12 divides evenly by 2, 3, 4, and 6 (easier calculations)
- 4 seasons × 3 phases each = 12 distinct periods

**The zodiac is like a clock face** — 12 equal mathematical sections. The constellations are like clouds — irregular shapes that drift. We use the clock (mathematical framework), not the clouds (physical stars).`
      },
      {
        title: 'The Four Elements',
        icon: '🔥',
        content: `**The 12 signs divided by element:**

🔥 **FIRE SIGNS** — Aries, Leo, Sagittarius
- Core drive: ACTION
- Natural state: Moving, doing, creating
- Thinking style: Intuitive, instinctive
- Challenge: Impatience, burnout
- Fire person walks into a room and thinks: "What can we DO here?"

🌍 **EARTH SIGNS** — Taurus, Virgo, Capricorn
- Core drive: BUILD
- Natural state: Constructing, organizing, stabilizing
- Thinking style: Practical, concrete, realistic
- Challenge: Rigidity, resistance to change
- Earth person thinks: "What's the structure here? What's the plan?"

💨 **AIR SIGNS** — Gemini, Libra, Aquarius
- Core drive: CONNECT
- Natural state: Thinking, communicating, relating
- Thinking style: Abstract, conceptual, logical
- Challenge: Detachment, over-analysis
- Air person thinks: "Who's here? How do these ideas relate?"

💧 **WATER SIGNS** — Cancer, Scorpio, Pisces
- Core drive: FEEL
- Natural state: Sensing, empathizing, flowing
- Thinking style: Emotional, intuitive, symbolic
- Challenge: Overwhelm, boundary issues
- Water person thinks: "How do people FEEL here? What's unspoken?"`
      },
      {
        title: 'Elemental Compatibility',
        icon: '✨',
        content: `**COMPATIBLE ELEMENTS** (natural harmony):
- 🔥 **FIRE + AIR** → Air feeds fire (bellows on campfire)
- 🌍 **EARTH + WATER** → Water nourishes earth (garden being watered)

**CHALLENGING ELEMENTS** (requires work):
- 🔥 **FIRE + WATER** → Water extinguishes fire / Fire evaporates water
- 🌍 **EARTH + AIR** → Earth grounds air / Air erodes earth

**SAME ELEMENTS** (similar energy):
- 🔥 **FIRE + FIRE** → Matches energy but can compete
- 🌍 **EARTH + EARTH** → Shares values but can be too rigid
- 💨 **AIR + AIR** → Communicates well but lacks grounding
- 💧 **WATER + WATER** → Deep connection but can drown in emotion

**This is the foundation of compatibility mathematics we'll build on.**`
      }
    ],
    coreConcepts: [
      'The zodiac is a mathematical clock, not a collection of random stars — 12 equal sections of 30° each.',
      'Your Sun sign represents your core identity — how you naturally express yourself and what gives you energy.',
      'The Four Elements (Fire, Earth, Air, Water) represent fundamental temperaments and approaches to life.',
      'Fire acts, Earth builds, Air connects, Water feels — each element has distinct drives and challenges.',
      'Elemental compatibility forms the mathematical foundation: Fire+Air harmonize, Earth+Water nourish.',
    ],
    practiceMode: [
      {
        label: 'Identify Element',
        description: 'Given a behavior description, choose the most likely element (Fire, Earth, Air, Water).',
      },
      {
        label: 'Identify Modality',
        description: 'Given a pattern of action, choose Cardinal, Fixed, or Mutable.',
      },
    ],
    ritualModePrompts: [
      'Which season of the soul are you in right now?',
      'If your life were a sign, which element would it carry today?',
    ],
  },
  {
    id: 'chapter-2-hard-boundaries',
    order: 2,
    title: 'The Problem of Hard Boundaries',
    subtitle: 'No soul changes overnight.',
    mythicTagline: 'Where the calendar lies and the psyche continues.',
    icon: '🚧',
    objectives: [
      'Understand why traditional sign cutoffs fail.',
      'Explore real-world examples of cusp identity.',
      'Recognize psychological continuity across dates.',
    ],
    lessonContent: [
      {
        title: 'The Midnight Fallacy',
        icon: '🕛',
        content: `Traditional astrology says: "If you're born on March 20, you're Pisces. March 21, you're Aries."

**But think about it:** Does the universe really flip a switch at midnight?

Does someone born at 11:59 PM on March 20 have nothing in common with someone born at 12:01 AM on March 21?

**The answer is obviously no.** The Sun doesn't jump from one constellation to another. It moves gradually, about 1 degree per day.

This is the **Hard Boundary Problem** — the idea that personality changes abruptly at arbitrary calendar dates.`
      },
      {
        title: 'The Cusp Experience',
        icon: '🌓',
        content: `**Have you ever felt "between signs"?**

Millions of people born near sign boundaries report:
- "I read both descriptions and feel like both apply"
- "I don't relate to my Sun sign at all"
- "I feel like a blend of two signs"

**They're not wrong.** They're experiencing cusp energy.

Born within 6 days of a sign change, you carry both energies:
- The **outgoing** sign's energy is fading
- The **incoming** sign's energy is rising
- You are a **bridge** between two archetypal worlds

This isn't confusion. It's **cosmic diplomacy**.`
      },
      {
        title: 'Nature Blends — So Should Astrology',
        icon: '🌿',
        content: `Look at nature:
- Winter doesn't end at midnight on March 20
- The seasons blend and transition gradually
- Twilight exists between day and night
- Adolescence bridges childhood and adulthood

**Everything in nature has transition zones.**

Why would the zodiac be different?

GENESIS uses a **blending model** that honors the natural way change happens: gradually, gracefully, and with overlap.`
      }
    ],
    coreConcepts: [
      'Hard sign cutoffs create an artificial division that doesn\'t match lived experience.',
      'People born near sign boundaries often feel like "both signs" — and they\'re right.',
      'Nature demonstrates gradual transitions everywhere: seasons, twilight, growth stages.',
      'The cusp experience isn\'t confusion — it\'s carrying two archetypal energies simultaneously.',
      'A more honest zodiac must account for blending, not just binary categorization.',
    ],
    practiceMode: [
      {
        label: 'Spot the Boundary Fallacy',
        description: 'Read short vignettes and identify where hard sign cutoffs misrepresent the person.',
      },
      {
        label: 'Compare Neighboring Dates',
        description: 'Compare two birthdays near a cusp and describe what likely stays the same.',
      },
    ],
    ritualModePrompts: [
      'Recall a time you felt "between identities" — what signs might that mirror?',
      'Where in your life do you expect sharp changes, but actually experience gradual shifts?',
    ],
  },
  {
    id: 'chapter-3-phi-curve',
    order: 3,
    title: 'The φ-Curve: A More Honest Zodiac',
    subtitle: 'Nature blends. So should astrology.',
    mythicTagline: 'A golden bridge between neighboring gods.',
    icon: '🌀',
    objectives: [
      'Learn the φ-curve model for sign blending.',
      'Understand blend percentages across cusp days.',
      'See how identity shifts gradually instead of abruptly.',
    ],
    lessonContent: [
      {
        title: 'The Golden Ratio in Nature',
        icon: '🌻',
        content: `The golden ratio (φ ≈ 1.618) appears everywhere in nature:
- Spiral of nautilus shells
- Branching of trees
- Arrangement of sunflower seeds
- Proportions of the human body

**Why φ?** Because natural transitions follow this mathematical constant.

GENESIS uses φ-based blending to model how one sign's energy fades while another rises. This isn't arbitrary — it's how nature actually works.`
      },
      {
        title: 'The 6-Day Cusp Window',
        icon: '📊',
        content: `Each cusp spans **6 days** with specific blend percentages:

| Day | New Sign % | Old Sign % |
|-----|-----------|-----------|
| Day 1 | 13% | 87% |
| Day 2 | 37% | 63% |
| Day 3 | 58% | 42% |
| Day 4 | 75% | 25% |
| Day 5 | 89% | 11% |
| Day 6 | 98% | 2% |

**Day 1:** The new sign is barely present — just a whisper
**Day 3:** The midpoint — balanced between both
**Day 6:** The old sign is almost gone — just an echo

This creates **72 unique cusp archetypes** (12 cusps × 6 days).`
      },
      {
        title: 'Pure Days vs. Cusp Days',
        icon: '☀️',
        content: `**Pure Days** (Days 7-24 of each sign):
- 100% single sign energy
- No blending with neighbors
- Classic archetypal expression
- The "textbook" version of each sign

**Cusp Days** (Days 1-6 and 25-30):
- Blended energy with neighboring signs
- Hybrid archetypes
- More nuanced personalities
- Often report "feeling like two signs"

**Neither is better.** Pure signs have clarity; cusp signs have range.`
      }
    ],
    coreConcepts: [
      'The φ-curve (golden ratio exponent ≈1.6) models natural transitions in astrology.',
      'Each cusp spans 6 days: Day 1 = 13% new sign, Day 6 = 98% new sign.',
      '72 unique cusp archetypes exist (12 transitions × 6 days each).',
      'Pure days (middle of sign) express undiluted archetypal energy.',
      'Cusp days carry hybrid energy — not confusion, but expanded range.',
    ],
    practiceMode: [
      {
        label: 'Guess the Blend',
        description: 'Given a date near a cusp, estimate the percentage of each sign.',
      },
      {
        label: 'Place on the Curve',
        description: 'Match a described feeling of "in-betweenness" to a position on the φ-curve.',
      },
    ],
    ritualModePrompts: [
      'Where in your life do you feel like a bridge rather than a fixed point?',
      'If your identity were a curve, where would it steepen and where would it soften?',
    ],
  },
  {
    id: 'chapter-4-pure-archetypes',
    order: 4,
    title: 'The 12 Pure Sign Archetypes',
    subtitle: 'Each sign is a temple. Each temple has a keeper.',
    mythicTagline: 'Meeting the guardians of the zodiacal halls.',
    icon: '🏛️',
    objectives: [
      'Learn the pure archetype of each sign.',
      'Understand the psychological essence of each sign.',
      'Recognize light and shadow expressions.',
    ],
    lessonContent: [
      {
        title: 'The Fire Signs: The Initiators',
        icon: '🔥',
        content: `**♈ ARIES — The Primal Warrior**
Symbol: The Ram | Ruler: Mars | Season: Spring Equinox
- Archetype: The pioneer, the champion, the initiator
- Strengths: Unstoppable courage, natural leadership, quick decisions
- Shadow: Extreme impulsivity, self-centeredness, anger issues

**♌ LEO — The Radiant Sovereign**
Symbol: The Lion | Ruler: Sun | Season: Peak Summer
- Archetype: The king/queen, the performer, the heart
- Strengths: Unshakeable confidence, generosity, creative expression
- Shadow: Excessive pride, constant need for admiration, domineering

**♐ SAGITTARIUS — The Joyful Philosopher**
Symbol: The Archer | Ruler: Jupiter | Season: Late Autumn
- Archetype: The explorer, the truth-seeker, the optimist
- Strengths: Boundless optimism, philosophical wisdom, adventurous spirit
- Shadow: Excessive bluntness, commitment-phobic, reckless risk-taking`
      },
      {
        title: 'The Earth Signs: The Builders',
        icon: '🌍',
        content: `**♉ TAURUS — The Sensual Builder**
Symbol: The Bull | Ruler: Venus | Season: Mid-Spring
- Archetype: The anchor, the artist, the provider
- Strengths: Unshakeable stability, practical wisdom, incredible patience
- Shadow: Extreme stubbornness, resistance to change, possessiveness

**♍ VIRGO — The Sacred Perfectionist**
Symbol: The Maiden | Ruler: Mercury | Season: Late Summer
- Archetype: The analyst, the healer, the servant
- Strengths: Exceptional attention to detail, practical problem-solving
- Shadow: Excessive criticism, perfectionism paralysis, anxiety

**♑ CAPRICORN — The Mountain Climber**
Symbol: The Sea-Goat | Ruler: Saturn | Season: Winter Solstice
- Archetype: The strategist, the elder, the achiever
- Strengths: Unmatched discipline, strategic planning, builds legacy
- Shadow: Workaholic, emotionally distant, ruthlessly ambitious`
      },
      {
        title: 'The Air Signs: The Connectors',
        icon: '💨',
        content: `**♊ GEMINI — The Eternal Student**
Symbol: The Twins | Ruler: Mercury | Season: Late Spring
- Archetype: The messenger, the trickster, the communicator
- Strengths: Brilliant communication, fast learning, adaptable
- Shadow: Superficiality, scattered energy, difficulty with commitment

**♎ LIBRA — The Divine Diplomat**
Symbol: The Scales | Ruler: Venus | Season: Autumn Equinox
- Archetype: The peacemaker, the artist, the partner
- Strengths: Exceptional diplomacy, natural mediator, aesthetic brilliance
- Shadow: Extreme indecisiveness, people-pleasing, co-dependency

**♒ AQUARIUS — The Revolutionary Genius**
Symbol: Water Bearer | Ruler: Uranus | Season: Mid-Winter
- Archetype: The innovator, the rebel, the visionary
- Strengths: Innovative genius, humanitarian vision, independent thinking
- Shadow: Emotionally detached, contrary for its own sake, alienating`
      },
      {
        title: 'The Water Signs: The Feelers',
        icon: '💧',
        content: `**♋ CANCER — The Divine Mother**
Symbol: The Crab | Ruler: Moon | Season: Summer Solstice
- Archetype: The nurturer, the protector, the home-maker
- Strengths: Profound empathy, nurturing instinct, strong intuition
- Shadow: Overly sensitive, holds grudges indefinitely, smothering

**♏ SCORPIO — The Phoenix Transformer**
Symbol: The Scorpion | Ruler: Pluto | Season: Mid-Autumn
- Archetype: The investigator, the alchemist, the transformer
- Strengths: Profound emotional depth, transformational power, psychic abilities
- Shadow: Extreme jealousy, vengeful, manipulative tendencies

**♓ PISCES — The Mystic Dreamer**
Symbol: The Fish | Ruler: Neptune | Season: Late Winter
- Archetype: The artist, the healer, the mystic
- Strengths: Profound intuition, universal compassion, artistic brilliance
- Shadow: Extreme escapism, overly sensitive, difficulty with practical matters`
      }
    ],
    coreConcepts: [
      'Each pure sign has a distinct archetype — the textbook expression of that energy.',
      'Fire signs (Aries, Leo, Sagittarius) are initiators who act, lead, and inspire.',
      'Earth signs (Taurus, Virgo, Capricorn) are builders who create structure and stability.',
      'Air signs (Gemini, Libra, Aquarius) are connectors who think, communicate, and relate.',
      'Water signs (Cancer, Scorpio, Pisces) are feelers who sense, empathize, and transform.',
      'Every sign has both light (strengths) and shadow (challenges) expressions.',
    ],
    practiceMode: [
      {
        label: 'Match Archetype to Sign',
        description: 'Given an archetypal description, choose the corresponding sign.',
      },
      {
        label: 'Spot the Shadow',
        description: 'Identify which shadow pattern belongs to which sign.',
      },
    ],
    ritualModePrompts: [
      'Which pure archetype feels like "home" to you, regardless of your birth sign?',
      'Write a short scene where one sign\'s light meets its own shadow.',
    ],
  },
  {
    id: 'chapter-5-cusp-archetypes',
    order: 5,
    title: 'The 72 Cusp Archetypes',
    subtitle: 'Where two gods meet, a third is born.',
    mythicTagline: 'The liminal children of neighboring signs.',
    icon: '🌓',
    objectives: [
      'Understand cusp identity as a third thing, not a simple mix.',
      'Learn the 72 micro-archetypes across all cusps.',
      'Recognize hybrid strengths and hybrid shadows.',
    ],
    lessonContent: [
      {
        title: 'The 36-Position System',
        icon: '🌓',
        content: `Each of the 12 zodiac signs is divided into 3 positions:

**1. Blend-Back (First 6 days)**
Previous sign's influence fading in. You carry echoes of the sign before.

**2. Pure (Middle 16-20 days)**
Undiluted sign energy. The "textbook" expression of the sign.

**3. Blend-Forward (Last 6 days)**
Next sign's influence emerging. You're a bridge to what's coming.

12 signs × 3 positions = **36 unique positions**

Each position has its own archetype, characteristics, and challenges.`
      },
      {
        title: 'Example Cusp Archetypes',
        icon: '⚡',
        content: `**🔥🌊 Aries with Pisces Echo (Mar 21-26)**
"The Intuitive Warrior"
- Aries courage softened by Pisces intuition
- Action guided by inner knowing
- Compassionate warrior energy
- Challenge: Hesitation when intuition conflicts with impulse

**🐂💨 Taurus with Gemini Breeze (May 15-20)**
"The Articulate Artisan"
- Taurus groundedness with Gemini curiosity
- Practical communicator with earthy wit
- Builds through conversation
- Challenge: Earth-Air friction (fixed vs changeable)

**🦀👑 Cancer with Leo Warmth (Jul 17-22)**
"The Radiant Protector"
- Cancer nurturing with Leo confidence
- Warm and generous caretaker
- Protective with flair
- Challenge: Water-Fire conflict (mood vs ego)`
      },
      {
        title: 'Cusp as Creative Tension',
        icon: '🎭',
        content: `**Cusp identity is NOT confusion.** It's carrying two archetypal energies.

Think of it like:
- A **diplomat** between two nations
- A **bridge** connecting two shores
- A **translator** between two languages

**Hybrid Strengths:**
- Range and flexibility
- Understanding multiple perspectives
- Ability to bridge different types of people
- Creative synthesis of opposing forces

**Hybrid Challenges:**
- Internal tension between competing drives
- May feel "not quite fitting" either sign
- Need to learn to integrate both energies

**The goal isn't to choose one.** It's to weave both into a unique tapestry.`
      }
    ],
    coreConcepts: [
      'The 36-position system divides each sign into Blend-Back, Pure, and Blend-Forward zones.',
      'Cusp archetypes are hybrid identities — not simple mixtures, but creative syntheses.',
      'Each cusp carries unique strengths from combining two elemental energies.',
      'Cusp challenges arise from internal tension between competing archetypal drives.',
      'The goal is integration, not choosing between the two signs.',
    ],
    practiceMode: [
      {
        label: 'Identify the Cusp',
        description: 'Given a hybrid description, choose which cusp it belongs to.',
      },
      {
        label: 'Compare Cusp Days',
        description: 'Compare Day 1 and Day 6 of the same cusp and describe the shift in emphasis.',
      },
    ],
    ritualModePrompts: [
      'Where in your life do you feel like you\'re carrying two lineages at once?',
      'Name a place in your story where you are "no longer X, not yet Y".',
    ],
  },
  {
    id: 'chapter-6-365-map',
    order: 6,
    title: 'The 365-Day Zodiac Map',
    subtitle: 'Every day has a face.',
    mythicTagline: 'A calendar of living archetypes.',
    icon: '📅',
    objectives: [
      'Learn the full 365-day archetype system.',
      'Understand daily micro-shifts within each sign.',
      'See how the year unfolds as a sequence of subtle changes.',
    ],
    lessonContent: [
      {
        title: 'From 12 Signs to 365 Days',
        icon: '📅',
        content: `Traditional astrology gives you one of 12 labels. GENESIS gives you one of **365 unique daily archetypes**.

**The Math:**
- 12 signs × ~30 days each = ~365 days
- Each day has a specific φ-curve blend value
- Each day carries a micro-theme within its sign's broader arc

**Why Daily Precision Matters:**
- Two people "both Aries" born 3 weeks apart have different energies
- Day 1 of Aries (bold pioneer) differs from Day 25 (preparing for Taurus)
- Daily granularity explains why Sun-sign-only astrology feels generic`
      },
      {
        title: 'The Three Zones of Each Sign',
        icon: '🎯',
        content: `Each ~30-day sign period divides into three zones:

**Zone 1: Cusp Entry (Days 1-6)**
- Blending in from previous sign
- Still carrying echoes of what came before
- φ-curve values: 13% → 98% new sign
- Energy: "Arriving, adjusting, inheriting"

**Zone 2: Pure Expression (Days 7-24)**
- Full, undiluted sign energy
- Classic archetypal expression
- No blending with neighbors
- Energy: "Owning, expressing, embodying"

**Zone 3: Cusp Exit (Days 25-30)**
- Blending toward next sign
- Preparing for transition ahead
- Anticipating what's coming
- Energy: "Completing, preparing, bridging"`
      },
      {
        title: 'Reading the Daily Calendar',
        icon: '🗓️',
        content: `**Example: The Aries Month (Mar 21 - Apr 19)**

Day 1 (Mar 21): *The Intuitive Warrior* — Aries with Pisces echo (13% Aries)
Day 3 (Mar 23): *The Emerging Champion* — Balanced blend (58% Aries)
Day 7 (Mar 27): *The Pure Initiator* — Full Aries energy begins
Day 15 (Apr 4): *The Midpoint Pioneer* — Peak Aries expression
Day 24 (Apr 13): *The Seasoned Warrior* — Final pure Aries
Day 28 (Apr 17): *The Grounding Pioneer* — Taurus influence rising

**Each day tells a story.** The calendar becomes a narrative, not just a grid.`
      }
    ],
    coreConcepts: [
      'Daily blend values derived from the φ-curve.',
      'Daily archetype names and micro-themes.',
      'Seasonal micro-arcs within each sign.',
    ],
    practiceMode: [
      {
        label: 'Guess the Day',
        description: 'Given an archetype description, guess whether it\'s early, mid, or late in a sign.',
      },
      {
        label: 'Compare Two Days',
        description: 'Compare two days in the same sign and describe the subtle shift in tone.',
      },
    ],
    ritualModePrompts: [
      'Choose today\'s date and write a sentence as if it were a character speaking.',
      'Mark three dates in the year that feel like turning points — what might their archetypes be?',
    ],
  },
  {
    id: 'chapter-7-elemental-psychology',
    order: 7,
    title: 'Elemental Psychology',
    subtitle: 'Fire acts. Earth builds. Air thinks. Water feels.',
    mythicTagline: 'The four engines of human motivation.',
    icon: '🔥',
    objectives: [
      'Understand elemental motivations and needs.',
      'Learn how elements interact and balance each other.',
      'Recognize elemental dominance in behavior.',
    ],
    lessonContent: [
      {
        title: 'Fire Psychology: The Need to Act',
        icon: '🔥',
        content: `**Core Drive:** Identity, courage, initiative

**What Fire Needs:**
- Freedom to act on impulse
- Recognition and admiration
- Challenges to overcome
- Space to lead and inspire

**Fire in Healthy Expression:**
- Courageous action that inspires others
- Natural leadership that empowers
- Enthusiasm that ignites motivation
- Honest directness that clears confusion

**Fire in Shadow:**
- Impulsive decisions without thought
- Self-centeredness disguised as confidence
- Anger when not given attention
- Burning out self and others

**Fire's Question:** "What can I DO about this?"`
      },
      {
        title: 'Earth Psychology: The Need to Build',
        icon: '🌍',
        content: `**Core Drive:** Stability, structure, material security

**What Earth Needs:**
- Tangible results and progress
- Physical comfort and security
- Clear plans and reliable routines
- Time to process and implement

**Earth in Healthy Expression:**
- Patient building of lasting foundations
- Practical wisdom grounded in reality
- Steady reliability others can count on
- Sensory appreciation of the present

**Earth in Shadow:**
- Stubborn resistance to necessary change
- Materialism that substitutes for meaning
- Rigidity that stifles growth
- Workaholism to avoid emotional depth

**Earth's Question:** "What's the PLAN here?"`
      },
      {
        title: 'Air Psychology: The Need to Connect',
        icon: '💨',
        content: `**Core Drive:** Ideas, communication, meaning

**What Air Needs:**
- Mental stimulation and variety
- Social connection and exchange
- Freedom to explore concepts
- Space for objective analysis

**Air in Healthy Expression:**
- Brilliant communication that bridges gaps
- Objective fairness that serves justice
- Intellectual curiosity that discovers truth
- Social grace that creates harmony

**Air in Shadow:**
- Detachment that avoids emotional depth
- Over-analysis that paralyzes action
- Superficiality that skims surfaces
- Inconsistency that breaks trust

**Air's Question:** "What does this MEAN?"`
      },
      {
        title: 'Water Psychology: The Need to Feel',
        icon: '💧',
        content: `**Core Drive:** Emotion, memory, bonding

**What Water Needs:**
- Emotional safety and validation
- Deep connection and intimacy
- Time to process feelings
- Creative and intuitive expression

**Water in Healthy Expression:**
- Profound empathy that heals others
- Intuitive wisdom beyond logic
- Creative depth that moves souls
- Loyalty that creates lasting bonds

**Water in Shadow:**
- Overwhelm that drowns in emotion
- Manipulation through guilt or need
- Boundary loss in merging with others
- Escapism through fantasy or addiction

**Water's Question:** "How does this FEEL?"`
      }
    ],
    coreConcepts: [
      'Fire: identity, courage, and initiative.',
      'Earth: stability, structure, and material reality.',
      'Air: ideas, meaning, and communication.',
      'Water: emotion, memory, and bonding.',
      'Elemental compatibility and friction.',
    ],
    practiceMode: [
      {
        label: 'Elemental Diagnosis',
        description: 'Given a short narrative, identify the dominant element.',
      },
      {
        label: 'Predict Harmony',
        description: 'Given two elemental profiles, predict whether they harmonize or clash.',
      },
    ],
    ritualModePrompts: [
      'Which element feels overactive in your life right now? Which feels underfed?',
      'Describe a relationship in terms of elements rather than roles.',
    ],
  },
  {
    id: 'chapter-8-modalities-polarity',
    order: 8,
    title: 'Modalities & Polarity',
    subtitle: 'How a sign moves is as important as why it moves.',
    mythicTagline: 'The rhythm and direction of archetypal motion.',
    icon: '⚡',
    objectives: [
      'Learn the three modalities: Cardinal, Fixed, Mutable.',
      'Understand polarity dynamics: Yang/Yin, outward/inward.',
      'Recognize how modality shapes behavior.',
    ],
    lessonContent: [
      {
        title: 'The Three Modalities',
        icon: '⚡',
        content: `If elements are "what kind of energy," modalities are "how that energy moves."

**CARDINAL Signs** — Aries, Cancer, Libra, Capricorn
- Action: INITIATE new cycles
- Season: Mark the start of each season (equinoxes/solstices)
- Strength: Starting things, leadership, fresh energy
- Challenge: May start many things but finish few
- Phrase: "Let's BEGIN this."

**FIXED Signs** — Taurus, Leo, Scorpio, Aquarius
- Action: SUSTAIN and deepen
- Season: Mark the middle of each season (peak)
- Strength: Persistence, loyalty, depth
- Challenge: Resistance to change, stubbornness
- Phrase: "Let's CONTINUE this."

**MUTABLE Signs** — Gemini, Virgo, Sagittarius, Pisces
- Action: ADAPT and transition
- Season: Mark the end of each season (transition)
- Strength: Flexibility, synthesis, evolution
- Challenge: Inconsistency, scattered energy
- Phrase: "Let's EVOLVE this."`
      },
      {
        title: 'Modality Interactions',
        icon: '🔄',
        content: `**Same Modality Pairs** (Square aspect — tension)
- Cardinal + Cardinal: Power struggles over who leads
- Fixed + Fixed: Stubborn standoffs, neither yields
- Mutable + Mutable: Both adapt but nothing anchors

**Complementary Modality Pairs:**
- Cardinal + Fixed: One starts, one sustains = completion
- Fixed + Mutable: One holds, one evolves = growth
- Mutable + Cardinal: One prepares, one launches = momentum

**In Relationships:**
- Two Cardinals compete for control
- Two Fixed signs create unshakeable bonds OR unmoveable conflicts
- Two Mutables stay flexible but may lack direction
- Mixed modalities balance each other beautifully`
      },
      {
        title: 'Polarity: Yang and Yin',
        icon: '☯️',
        content: `**Yang (Masculine/Active) Signs:**
Fire signs: Aries, Leo, Sagittarius
Air signs: Gemini, Libra, Aquarius

- Energy direction: OUTWARD
- Action style: Assertive, initiating
- Communication: Direct, expressive
- Challenge: Can be pushy, insensitive

**Yin (Feminine/Receptive) Signs:**
Earth signs: Taurus, Virgo, Capricorn
Water signs: Cancer, Scorpio, Pisces

- Energy direction: INWARD
- Action style: Responsive, containing
- Communication: Subtle, absorbing
- Challenge: Can be passive, withholding

**Balance:**
- Yang without Yin = burnout, aggression
- Yin without Yang = stagnation, passivity
- The zodiac alternates: Aries (Yang) → Taurus (Yin) → Gemini (Yang)...`
      }
    ],
    coreConcepts: [
      'Cardinal: initiation and starting cycles.',
      'Fixed: stabilization and sustaining effort.',
      'Mutable: adaptation and transition.',
      'Polarity as complementary tension (Yang/Yin).',
    ],
    practiceMode: [
      {
        label: 'Modality from Behavior',
        description: 'Given a behavioral pattern, identify its modality.',
      },
      {
        label: 'Compare Same-Element Signs',
        description: 'Compare two signs in the same element but different modalities.',
      },
    ],
    ritualModePrompts: [
      'Where in your life are you called to initiate, to stabilize, and to adapt?',
      'Do you lean more toward outward (Yang) or inward (Yin) movement lately?',
    ],
  },
  {
    id: 'chapter-9-compatibility-foundations',
    order: 9,
    title: 'Compatibility Foundations',
    subtitle: 'Compatibility is chemistry, not destiny.',
    mythicTagline: 'Reading the dialogue between elements and modes.',
    icon: '💫',
    objectives: [
      'Learn elemental compatibility basics.',
      'Understand modality interactions in relationships.',
      'See how blend-based identity affects compatibility.',
    ],
    lessonContent: [
      {
        title: 'The Compatibility Matrix',
        icon: '💫',
        content: `Compatibility isn't binary (compatible/incompatible). It's a spectrum with multiple dimensions:

**Dimension 1: Elemental Chemistry**
- Same element: Deep understanding, similar values
- Compatible elements: Natural flow (Fire+Air, Earth+Water)
- Challenging elements: Growth through friction (Fire+Water, Earth+Air)

**Dimension 2: Modal Dynamics**
- Same modality: Shared rhythm, potential power struggles
- Complementary modalities: Division of labor, balance

**Dimension 3: Polarity Dance**
- Same polarity: Similar energy direction
- Opposite polarity: Magnetic attraction, yang-yin balance

**GENESIS Approach:**
We don't say "compatible" or "incompatible."
We describe the *specific chemistry* and its opportunities.`
      },
      {
        title: 'Elemental Compatibility Grades',
        icon: '📊',
        content: `**A-Grade (Natural Harmony):**
🔥+💨 Fire + Air — Air feeds fire's flame
🌍+💧 Earth + Water — Water nourishes earth's growth

**B-Grade (Same Element):**
🔥+🔥 Fire + Fire — Mutual inspiration OR competition
🌍+🌍 Earth + Earth — Shared values OR stubborn standoff
💨+💨 Air + Air — Great communication OR no grounding
💧+💧 Water + Water — Deep bonding OR emotional overwhelm

**C-Grade (Requires Conscious Work):**
🔥+💧 Fire + Water — Passion meets emotion (steam or evaporation)
🌍+💨 Earth + Air — Structure meets ideas (build together or erode)

**Remember:** C-grade doesn't mean "bad" — some of the most transformative relationships are C-grade. They just require more conscious navigation.`
      },
      {
        title: 'Cusp Compatibility Nuance',
        icon: '🌓',
        content: `**The φ-curve adds nuance to compatibility.**

Example: Leo (Fire) dating Scorpio (Water)
- Traditional: "Fire + Water = challenging"
- But what if the Leo is Day 28 (Virgo blending in)?
- Now it's (Fire with Earth tones) + Water = more nuanced

**Cusp Effects on Compatibility:**
- Cusp people can bridge elemental gaps
- A Leo-Virgo cusp relates to Earth signs better than pure Leo
- A Scorpio-Sagittarius cusp has Fire energy to match Fire partners

**The Math:**
When calculating compatibility, GENESIS factors:
1. Primary sign compatibility
2. Blend sign compatibility (weighted by φ-curve %)
3. The combination creates unique pairings

Two "Leos" born 3 weeks apart may have very different compatibility profiles.`
      }
    ],
    coreConcepts: [
      'Elemental harmony and tension.',
      'Modal synergy and friction.',
      'Polarity resonance in pairs.',
      'Using blend percentages for nuanced compatibility.',
    ],
    practiceMode: [
      {
        label: 'Compare Two Dates',
        description: 'Given two birthdays, describe likely elemental and modal dynamics.',
      },
      {
        label: 'Harmony Score Sketch',
        description: 'Roughly rate compatibility based on elements and modalities.',
      },
    ],
    ritualModePrompts: [
      'Think of a relationship that feels "easy" — what elements might be at play?',
      'Think of a relationship that feels "challenging" — how might modalities be clashing?',
    ],
  },
  {
    id: 'chapter-10-seasonal-zodiac',
    order: 10,
    title: 'The Seasonal Zodiac',
    subtitle: "The Sun's journey shapes the soul's journey.",
    mythicTagline: 'Reading the year as a spiritual climate.',
    icon: '🌸',
    objectives: [
      'Understand the zodiac as a seasonal cycle.',
      'Learn how seasons shape archetypes.',
      'Connect personal cycles to solar cycles.',
    ],
    lessonContent: [
      {
        title: 'The Four Turning Points',
        icon: '🌸',
        content: `The zodiac year is anchored by four astronomical events:

**🌱 SPRING EQUINOX (Mar 20-21) — Aries begins**
- Day and night equal, light increasing
- Theme: New beginnings, initiative, emergence
- Energy: Breaking through, fresh starts

**☀️ SUMMER SOLSTICE (Jun 20-21) — Cancer begins**
- Longest day, peak light
- Theme: Nurturing, protection, peak expression
- Energy: Full bloom, emotional depth

**🍂 AUTUMN EQUINOX (Sep 22-23) — Libra begins**
- Day and night equal, light decreasing
- Theme: Balance, relationship, harvest
- Energy: Gathering in, partnership

**❄️ WINTER SOLSTICE (Dec 21-22) — Capricorn begins**
- Shortest day, minimum light
- Theme: Structure, achievement, endurance
- Energy: Conservation, building for return`
      },
      {
        title: 'The Seasonal Quarters',
        icon: '🌿',
        content: `**SPRING (Aries → Taurus → Gemini)**
Cardinal Fire → Fixed Earth → Mutable Air
- Arc: Burst forth → Ground it → Spread it
- Life phase: Birth, establishment, connection
- Energy builds from spark to network

**SUMMER (Cancer → Leo → Virgo)**
Cardinal Water → Fixed Fire → Mutable Earth
- Arc: Nurture → Express → Refine
- Life phase: Care, shine, perfect
- Energy deepens from heart to craft

**AUTUMN (Libra → Scorpio → Sagittarius)**
Cardinal Air → Fixed Water → Mutable Fire
- Arc: Balance → Transform → Expand
- Life phase: Partner, deepen, seek
- Energy moves from harmony to truth

**WINTER (Capricorn → Aquarius → Pisces)**
Cardinal Earth → Fixed Air → Mutable Water
- Arc: Achieve → Innovate → Dissolve
- Life phase: Build legacy, revolutionize, surrender
- Energy consolidates then releases`
      },
      {
        title: 'Your Seasonal Signature',
        icon: '🎭',
        content: `**Which season were you born in?**

The season of your birth colors your relationship with time and cycles:

**Spring-born (Aries, Taurus, Gemini):**
- Natural orientation: Beginning things
- Strength: Fresh perspective, initiative
- Challenge: Following through on what you start

**Summer-born (Cancer, Leo, Virgo):**
- Natural orientation: Peak expression
- Strength: Fullness, creative power
- Challenge: Accepting decline and endings

**Autumn-born (Libra, Scorpio, Sagittarius):**
- Natural orientation: Harvesting and releasing
- Strength: Transformation, depth
- Challenge: Starting new things, lightness

**Winter-born (Capricorn, Aquarius, Pisces):**
- Natural orientation: Conservation and vision
- Strength: Endurance, inner work
- Challenge: Embracing external action

**Your season shapes how you experience ALL seasons.**`
      }
    ],
    coreConcepts: [
      'Solstices and equinoxes as turning points.',
      'Seasonal energy arcs across the year.',
      'Alignment of signs with seasonal themes.',
    ],
    practiceMode: [
      {
        label: 'Season from Archetype',
        description: 'Given an archetype description, identify its likely season.',
      },
      {
        label: 'Compare Seasonal Neighbors',
        description: 'Compare two signs that share a season but differ in element and modality.',
      },
    ],
    ritualModePrompts: [
      'Which season of the year feels most like "you" and why?',
      'Map your last year as four seasonal chapters — what shifted at each turning point?',
    ],
  },
  {
    id: 'chapter-11-mythic-zodiac',
    order: 11,
    title: 'The Mythic Zodiac',
    subtitle: 'Every sign is a story.',
    mythicTagline: 'Meeting the gods, heroes, and creatures behind the symbols.',
    icon: '🐉',
    objectives: [
      'Learn the mythic origins of each sign.',
      'Understand symbolic metaphors and narrative patterns.',
      'Recognize recurring mythic themes in life.',
    ],
    lessonContent: [
      {
        title: 'The Hero\'s Journey in the Zodiac',
        icon: '🐉',
        content: `The zodiac tells a complete hero's journey — from birth (Aries) to transcendence (Pisces):

**Act I: Departure (Fire & Earth)**
♈ **Aries** — The Call to Adventure
♉ **Taurus** — Establishing the Ordinary World
♊ **Gemini** — Meeting the Mentor/Guide
♋ **Cancer** — Crossing the First Threshold

**Act II: Initiation (Water & Air)**
♌ **Leo** — Tests, Allies, Enemies
♍ **Virgo** — The Ordeal (death/rebirth)
♎ **Libra** — The Reward (sacred marriage)
♏ **Scorpio** — The Road Back (transformation)

**Act III: Return (Fire, Earth, Air, Water)**
♐ **Sagittarius** — Resurrection (final test)
♑ **Capricorn** — Return with the Elixir
♒ **Aquarius** — Master of Two Worlds
♓ **Pisces** — Freedom to Live/Die`
      },
      {
        title: 'Mythic Creatures & Symbols',
        icon: '🦁',
        content: `Each sign has a mythic creature that embodies its essence:

**♈ The Ram** — Sacrifice and golden fleece; charging ahead
**♉ The Bull** — Sacred strength; the Minotaur's labyrinth
**♊ The Twins** — Castor & Pollux; duality and immortality
**♋ The Crab** — Karkinos; protective shell, lunar tides
**♌ The Lion** — Nemean lion; invincible heart
**♍ The Virgin** — Astraea, goddess of innocence; harvest maiden
**♎ The Scales** — Ma'at's feather; divine justice
**♏ The Scorpion** — Orion's nemesis; phoenix rising
**♐ The Archer** — Chiron the centaur; wounded healer
**♑ The Sea-Goat** — Pan's transformation; ascending the mountain
**♒ The Water Bearer** — Ganymede; bringing divine nectar
**♓ The Fish** — Aphrodite & Eros; dissolution into the cosmic ocean`
      },
      {
        title: 'Shadow Myths & Warnings',
        icon: '⚠️',
        content: `Each sign has a cautionary tale about its shadow expression:

**Aries** — Icarus flying too close to the sun (unchecked impulse)
**Taurus** — King Midas turning everything to gold (possession over love)
**Gemini** — Echo losing herself (all reflection, no substance)
**Cancer** — Demeter's grief freezing the world (protective to possessive)
**Leo** — Narcissus drowning in his reflection (self-love becomes self-destruction)
**Virgo** — Sisyphus rolling the boulder forever (perfectionism without completion)
**Libra** — Paris and the golden apple (avoiding judgment creates war)
**Scorpio** — Medusa's gaze (pain transformed to poison)
**Sagittarius** — Prometheus stealing fire (wisdom without wisdom)
**Capricorn** — Saturn devouring his children (ambition consuming life)
**Aquarius** — Frankenstein's monster (innovation without heart)
**Pisces** — The Lotus Eaters (escape from reality becomes prison)

**Know your myth. Don't become it.**`
      }
    ],
    coreConcepts: [
      'Mythic archetypes associated with each sign.',
      'Heroic and tragic patterns.',
      'Shadow myths and cautionary tales.',
    ],
    practiceMode: [
      {
        label: 'Match Myth to Sign',
        description: 'Given a mythic story fragment, choose the sign it resonates with.',
      },
      {
        label: 'Identify Symbolic Themes',
        description: 'Extract themes (sacrifice, rebirth, pride, etc.) and link them to signs.',
      },
    ],
    ritualModePrompts: [
      'Which mythic story has always stayed with you — and which sign might it echo?',
      'Write a short myth where your Sun sign meets its opposite sign.',
    ],
  },
  {
    id: 'chapter-12-integration',
    order: 12,
    title: 'Integration & Self-Discovery',
    subtitle: 'The zodiac is a mirror. Look gently.',
    mythicTagline: 'Gathering the threads into a personal tapestry.',
    icon: '🪞',
    objectives: [
      'Integrate all Academy knowledge into a personal profile.',
      'Understand your elemental, modal, and seasonal signature.',
      'Use the zodiac as a tool for reflection, not fate.',
    ],
    lessonContent: [
      {
        title: 'Building Your Cosmic Profile',
        icon: '🪞',
        content: `You've learned the language. Now let's speak it about YOU.

**Your Profile Components:**

1. **Primary Sign** — Your Sun sign (core identity)
2. **Position** — Blend-Back, Pure, or Blend-Forward?
3. **φ-Blend** — If cusp: what percentage of each sign?
4. **Element** — Fire, Earth, Air, or Water?
5. **Modality** — Cardinal, Fixed, or Mutable?
6. **Polarity** — Yang (outward) or Yin (inward)?
7. **Season** — Spring, Summer, Autumn, or Winter?

**Example Profile:**
"I am a Day-4 Leo-Virgo cusp (75% Virgo). Fixed Fire blending into Mutable Earth. Yang softening to Yin. Late summer, preparing for harvest."

**This is your cosmic coordinates — not your fate, but your starting position.**`
      },
      {
        title: 'The Three Questions',
        icon: '❓',
        content: `With your profile in hand, ask yourself:

**Question 1: What rings true?**
Read your sign's archetype. What resonates? What feels like coming home? Trust these moments of recognition.

**Question 2: What feels like a stretch?**
What parts of your sign description feel aspirational rather than descriptive? These may be:
- Qualities you haven't developed yet
- Shadow aspects you haven't integrated
- Potentials waiting to unfold

**Question 3: What's clearly wrong?**
If something feels completely off, consider:
- Are you on a cusp blending toward another sign?
- Is your Moon or Rising sign creating different energy?
- Have life experiences shaped you away from your "default"?

**The zodiac describes tendencies, not destinies.**`
      },
      {
        title: 'Using the Zodiac Wisely',
        icon: '🌟',
        content: `**DO use the zodiac to:**
- Understand your natural strengths and challenges
- Gain compassion for others' different approaches
- Notice patterns in relationships and conflicts
- Find language for inner experiences
- Connect with seasonal and cyclical rhythms

**DON'T use the zodiac to:**
- Excuse harmful behavior ("I'm a Scorpio, I can't help being jealous")
- Dismiss people ("I don't date Geminis")
- Predict specific events
- Avoid personal responsibility
- Replace therapy, medicine, or professional help

**The best use of astrology:**
A mirror that helps you see yourself more clearly — with kindness, curiosity, and room to grow.

**You are not your chart. You are the one reading it.**`
      },
      {
        title: 'Your Graduation Gift',
        icon: '🎓',
        content: `Congratulations. You've completed the GENESIS Academy.

**You now understand:**
- The 12 pure archetypes and their elements
- The φ-curve and 72 cusp positions
- Modalities, polarities, and seasonal cycles
- Elemental compatibility and chemistry
- Mythic narratives and shadow patterns
- How to build and interpret a profile

**Your ongoing practice:**
- Notice when you're acting from your sign's light vs. shadow
- Practice compassion when others' elements clash with yours
- Track your energy through seasonal cycles
- Use cusp awareness to understand "in-between" feelings

**Remember:**
The stars don't control you. They're a language — and now you speak it.

Welcome to the conversation. 🌌`
      }
    ],
    coreConcepts: [
      'Personal blend across signs and cusps.',
      'Elemental balance and imbalance.',
      'Modal signature and preferred rhythm.',
      'Seasonal identity and life chapters.',
    ],
    practiceMode: [
      {
        label: 'Build Your Profile',
        description: 'Combine your sign, cusp status, elements, and modalities into a written self-portrait.',
      },
      {
        label: 'Interpret a Friend',
        description: "Gently sketch a friend's profile using what you've learned (with kindness and consent).",
      },
    ],
    ritualModePrompts: [
      'Write a one-paragraph "cosmic bio" that feels kind, honest, and spacious.',
      'Name one pattern you\'d like to soften — not erase — using this new language.',
    ],
  },
].sort((a, b) => a.order - b.order);

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get a chapter by its ID
 */
export function getChapterById(id: string): AcademyChapter | undefined {
  return ACADEMY_CHAPTERS.find((c) => c.id === id);
}

/**
 * Get the next chapter in sequence
 */
export function getNextChapter(currentId: string): AcademyChapter | undefined {
  const current = ACADEMY_CHAPTERS.find((c) => c.id === currentId);
  if (!current) return undefined;
  return ACADEMY_CHAPTERS.find((c) => c.order === current.order + 1);
}

/**
 * Get the previous chapter in sequence
 */
export function getPrevChapter(currentId: string): AcademyChapter | undefined {
  const current = ACADEMY_CHAPTERS.find((c) => c.id === currentId);
  if (!current) return undefined;
  return ACADEMY_CHAPTERS.find((c) => c.order === current.order - 1);
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(completedChapterIds: string[]): number {
  return Math.round((completedChapterIds.length / ACADEMY_CHAPTERS.length) * 100);
}

// =============================================================================
// EXPORTS
// =============================================================================

export default ACADEMY_CHAPTERS;
