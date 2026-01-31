/**
 * cuspArchetypes.ts
 * =================
 *
 * Complete 72 cusp archetype data for all 12 zodiac transitions.
 * Each cusp has 6 days of transition, creating unique hybrid identities.
 *
 * φ-Curve Blend Values (Universal - same for all cusps):
 * - Day 1: 13% new sign / 87% old sign
 * - Day 2: 37% new sign / 63% old sign
 * - Day 3: 58% new sign / 42% old sign
 * - Day 4: 75% new sign / 25% old sign
 * - Day 5: 89% new sign / 11% old sign
 * - Day 6: 98% new sign / 2% old sign
 *
 * Written in mythic, Academy-consistent voice.
 *
 * GENESIS AstroProfile - January 2026
 */

// =============================================================================
// TYPES
// =============================================================================

export type CuspDayArchetype = {
  day: number;
  date: string;
  blendNew: number;
  blendOld: number;
  mythicName: string;
  title: string;
  psychologicalProfile: string;
  strengths: string[];
  shadows: string[];
  lifeTheme: string;
};

export type CuspTransition = {
  id: string;
  fromSign: string;
  toSign: string;
  fromSymbol: string;
  toSymbol: string;
  fromElement: string;
  toElement: string;
  cuspName: string;
  dateRange: string;
  elementalDynamic: string;
  archetypes: CuspDayArchetype[];
};

// =============================================================================
// UNIVERSAL φ-CURVE VALUES
// =============================================================================

export const PHI_CURVE_VALUES = {
  day1: { blendNew: 13, blendOld: 87 },
  day2: { blendNew: 37, blendOld: 63 },
  day3: { blendNew: 58, blendOld: 42 },
  day4: { blendNew: 75, blendOld: 25 },
  day5: { blendNew: 89, blendOld: 11 },
  day6: { blendNew: 98, blendOld: 2 },
};

// =============================================================================
// CUSP ARCHETYPE DATA
// =============================================================================

export const CUSP_ARCHETYPES: CuspTransition[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // CUSP 1: PISCES → ARIES (March 21-26)
  // "The Cusp of Rebirth" - Water dissolving into Fire
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'pisces-aries',
    fromSign: 'Pisces',
    toSign: 'Aries',
    fromSymbol: '♓',
    toSymbol: '♈',
    fromElement: 'Water',
    toElement: 'Fire',
    cuspName: 'The Cusp of Rebirth',
    dateRange: 'March 21-26',
    elementalDynamic: 'Water dissolving into Fire — dreams awakening into action',
    archetypes: [
      {
        day: 1,
        date: 'March 21',
        blendNew: 13,
        blendOld: 87,
        mythicName: 'The Dream-Spark',
        title: 'Where the Ocean First Trembles with Fire',
        psychologicalProfile: 'A soul still wrapped in Piscean mist, sensing the first flicker of Aries rising. They feel life stirring before they know how to move.',
        strengths: ['Intuitive courage', 'Compassionate beginnings', 'Imaginative spark'],
        shadows: ['Hesitation before action', 'Emotional fog'],
        lifeTheme: 'Letting instinct rise gently from the deep waters of feeling.',
      },
      {
        day: 2,
        date: 'March 22',
        blendNew: 37,
        blendOld: 63,
        mythicName: 'The Waking Flame',
        title: 'When Stillness Learns to Burn',
        psychologicalProfile: 'Emotion and impulse wrestle softly. They feel the call to act, yet still drift in dream-tides.',
        strengths: ['Transformative sensitivity', 'Emerging bravery', 'Visionary drive'],
        shadows: ['Inner conflict', 'Impatience with their own pace'],
        lifeTheme: 'Learning to trust the first courageous impulse.',
      },
      {
        day: 3,
        date: 'March 23',
        blendNew: 58,
        blendOld: 42,
        mythicName: 'The Threshold Soul',
        title: 'Standing Between Surrender and Surge',
        psychologicalProfile: 'Balanced between yielding and charging. They sense the right moment intuitively.',
        strengths: ['Timing wisdom', 'Bridge-building insight', 'Emotional clarity'],
        shadows: ['Identity drift', 'Difficulty choosing direction'],
        lifeTheme: 'Mastering the art of knowing when to yield and when to rise.',
      },
      {
        day: 4,
        date: 'March 24',
        blendNew: 75,
        blendOld: 25,
        mythicName: 'The Heart-Fired Warrior',
        title: 'Compassion That Learns to Strike',
        psychologicalProfile: 'Now mostly Aries, but carrying Piscean soulfulness. Their courage is infused with empathy.',
        strengths: ['Inspired action', 'Gentle leadership', 'Spiritual bravery'],
        shadows: ['Overidealism', 'Crusader tendencies'],
        lifeTheme: 'Acting boldly without abandoning tenderness.',
      },
      {
        day: 5,
        date: 'March 25',
        blendNew: 89,
        blendOld: 11,
        mythicName: 'The Dawn-Breaker',
        title: 'The First Light of Pure Will',
        psychologicalProfile: 'Nearly full Aries, but with a faint memory of the ocean. They leap forward with innocence.',
        strengths: ['Fresh initiative', 'Fearless beginnings', 'Creative ignition'],
        shadows: ['Rushing past nuance', 'Emotional forgetfulness'],
        lifeTheme: 'Beginning boldly while honoring the past.',
      },
      {
        day: 6,
        date: 'March 26',
        blendNew: 98,
        blendOld: 2,
        mythicName: 'The Newborn Flame',
        title: 'Pure Emergence',
        psychologicalProfile: 'Essentially Aries with a whisper of Pisces. They embody raw will and unfiltered enthusiasm.',
        strengths: ['Pure courage', 'Directness', 'Life-force energy'],
        shadows: ['Impulsiveness', 'Naive intensity'],
        lifeTheme: 'Discovering selfhood through fearless motion.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CUSP 2: ARIES → TAURUS (April 20-25)
  // "The Cusp of Power" - Fire settling into Earth
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'aries-taurus',
    fromSign: 'Aries',
    toSign: 'Taurus',
    fromSymbol: '♈',
    toSymbol: '♉',
    fromElement: 'Fire',
    toElement: 'Earth',
    cuspName: 'The Cusp of Power',
    dateRange: 'April 20-25',
    elementalDynamic: 'Fire settling into Earth — impulse becoming endurance',
    archetypes: [
      {
        day: 1,
        date: 'April 20',
        blendNew: 13,
        blendOld: 87,
        mythicName: 'The Ground-Spark',
        title: 'Fire Seeking Shape',
        psychologicalProfile: 'Still blazing with Aries heat, yet beginning to crave form and stability.',
        strengths: ['Dynamic energy', 'Emerging patience', 'Creative force'],
        shadows: ['Frustration with slowness', 'Half-finished pursuits'],
        lifeTheme: 'Learning that power grows when anchored.',
      },
      {
        day: 2,
        date: 'April 21',
        blendNew: 37,
        blendOld: 63,
        mythicName: 'The Forged Ember',
        title: 'Heat Meeting the Anvil',
        psychologicalProfile: 'Their fire begins to harden into purpose. They want results, not just motion.',
        strengths: ['Determined action', 'Resourcefulness', 'Physical vitality'],
        shadows: ['Impatience vs. stubbornness', 'Possessive drive'],
        lifeTheme: 'Turning passion into something that lasts.',
      },
      {
        day: 3,
        date: 'April 22',
        blendNew: 58,
        blendOld: 42,
        mythicName: 'The Steady Flame',
        title: 'Courage Rooting into Earth',
        psychologicalProfile: 'Balanced between Aries\' charge and Taurus\' steadiness. They can start and sustain.',
        strengths: ['Practical courage', 'Balanced drive', 'Sensual vitality'],
        shadows: ['Inner tension between speed and rest', 'Attachment to outcomes'],
        lifeTheme: 'Building with both fire and patience.',
      },
      {
        day: 4,
        date: 'April 23',
        blendNew: 75,
        blendOld: 25,
        mythicName: 'The Settled Warrior',
        title: 'The Builder Who Still Burns',
        psychologicalProfile: 'Now mostly Taurus, but with Aries\' spark. They claim territory and cultivate it.',
        strengths: ['Productive force', 'Grounded ambition', 'Protective strength'],
        shadows: ['Territorial pride', 'Resistance to change'],
        lifeTheme: 'Creating abundance through steady effort.',
      },
      {
        day: 5,
        date: 'April 24',
        blendNew: 89,
        blendOld: 11,
        mythicName: 'The Slow-Burn Pillar',
        title: 'Endurance with an Inner Flame',
        psychologicalProfile: 'Almost fully Taurus, yet still capable of sudden bursts of courage.',
        strengths: ['Persistence', 'Reliability', 'Sensual presence'],
        shadows: ['Rigidity', 'Overattachment'],
        lifeTheme: 'Holding steady while honoring desire.',
      },
      {
        day: 6,
        date: 'April 25',
        blendNew: 98,
        blendOld: 2,
        mythicName: 'The Rooted Bull',
        title: 'Pure Earth with a Hidden Spark',
        psychologicalProfile: 'Essentially Taurus with a faint ember of Aries. Slow, steady, unstoppable.',
        strengths: ['Deep patience', 'Material mastery', 'Grounded confidence'],
        shadows: ['Inertia', 'Possessiveness'],
        lifeTheme: 'Cultivating beauty and security through steadfastness.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CUSP 3: TAURUS → GEMINI (May 21-26)
  // "The Cusp of Energy" - Earth opening to Air
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'taurus-gemini',
    fromSign: 'Taurus',
    toSign: 'Gemini',
    fromSymbol: '♉',
    toSymbol: '♊',
    fromElement: 'Earth',
    toElement: 'Air',
    cuspName: 'The Cusp of Energy',
    dateRange: 'May 21-26',
    elementalDynamic: 'Earth opening to Air — stability meeting curiosity',
    archetypes: [
      {
        day: 1,
        date: 'May 21',
        blendNew: 13,
        blendOld: 87,
        mythicName: 'The Listening Stone',
        title: 'Earth That Begins to Hear the Wind',
        psychologicalProfile: 'Still rooted, but curiosity stirs. They sense ideas rustling at the edges of comfort.',
        strengths: ['Grounded curiosity', 'Patient learning', 'Sensory intelligence'],
        shadows: ['Fear of mental risk', 'Clinging to routine'],
        lifeTheme: 'Letting the mind open without losing center.',
      },
      {
        day: 2,
        date: 'May 22',
        blendNew: 37,
        blendOld: 63,
        mythicName: 'The Speaking Earth',
        title: 'When Stability Finds Voice',
        psychologicalProfile: 'They begin translating physical experience into language. Words awaken.',
        strengths: ['Articulate presence', 'Practical wit', 'Steady communication'],
        shadows: ['Talking instead of doing', 'Mental restlessness'],
        lifeTheme: 'Giving voice to embodied wisdom.',
      },
      {
        day: 3,
        date: 'May 23',
        blendNew: 58,
        blendOld: 42,
        mythicName: 'The Thinking Builder',
        title: 'Mind and Matter in Harmony',
        psychologicalProfile: 'Balanced between creation and curiosity. They build and explain.',
        strengths: ['Versatile creativity', 'Practical intelligence', 'Grounded humor'],
        shadows: ['Scattered focus', 'Split priorities'],
        lifeTheme: 'Integrating intellect with craftsmanship.',
      },
      {
        day: 4,
        date: 'May 24',
        blendNew: 75,
        blendOld: 25,
        mythicName: 'The Winged Artisan',
        title: 'Ideas Taking Tangible Form',
        psychologicalProfile: 'Now mostly Gemini, but still grounded. They think quickly and act steadily.',
        strengths: ['Quick learning', 'Adaptable skill', 'Creative communication'],
        shadows: ['Starting too much', 'Restless materialism'],
        lifeTheme: 'Making ideas real without losing agility.',
      },
      {
        day: 5,
        date: 'May 25',
        blendNew: 89,
        blendOld: 11,
        mythicName: 'The Swift Gatherer',
        title: 'The Mind That Still Remembers Touch',
        psychologicalProfile: 'Almost pure Gemini, but with a trace of Taurus appreciation for beauty.',
        strengths: ['Mental agility', 'Aesthetic sense', 'Social versatility'],
        shadows: ['Surface engagement', 'Collecting without depth'],
        lifeTheme: 'Exploring variety while honoring value.',
      },
      {
        day: 6,
        date: 'May 26',
        blendNew: 98,
        blendOld: 2,
        mythicName: 'The Quicksilver Twin',
        title: 'Pure Mercury with a Hint of Earth',
        psychologicalProfile: 'Essentially Gemini — curious, swift, communicative — with a faint grounding.',
        strengths: ['Linguistic brilliance', 'Adaptability', 'Curiosity'],
        shadows: ['Scattered attention', 'Difficulty committing'],
        lifeTheme: 'Following the mind\'s winds with lightness and wonder.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CUSP 4: GEMINI → CANCER (June 21-26)
  // "The Cusp of Magic" - Air dissolving into Water
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'gemini-cancer',
    fromSign: 'Gemini',
    toSign: 'Cancer',
    fromSymbol: '♊',
    toSymbol: '♋',
    fromElement: 'Air',
    toElement: 'Water',
    cuspName: 'The Cusp of Magic',
    dateRange: 'June 21-26',
    elementalDynamic: 'Air dissolving into Water — thought meeting feeling',
    archetypes: [
      {
        day: 1,
        date: 'June 21',
        blendNew: 13,
        blendOld: 87,
        mythicName: 'The Feeling Messenger',
        title: 'Words That Begin to Feel',
        psychologicalProfile: 'Still mental, but emotions whisper beneath every thought.',
        strengths: ['Sensitive communication', 'Intuitive curiosity', 'Gentle wit'],
        shadows: ['Overthinking emotions', 'Avoiding depth'],
        lifeTheme: 'Letting the heart inform the mind.',
      },
      {
        day: 2,
        date: 'June 22',
        blendNew: 37,
        blendOld: 63,
        mythicName: 'The Dream-Speaker',
        title: 'When Logic Learns to Long',
        psychologicalProfile: 'Emotion rises. They speak from the heart as much as the mind.',
        strengths: ['Empathic articulation', 'Creative imagination', 'Warm expression'],
        shadows: ['Emotional overwhelm', 'Mood-colored thinking'],
        lifeTheme: 'Giving voice to inner tides.',
      },
      {
        day: 3,
        date: 'June 23',
        blendNew: 58,
        blendOld: 42,
        mythicName: 'The Threshold Keeper',
        title: 'Guardian of Heart and Mind',
        psychologicalProfile: 'Balanced between intellect and intuition. They translate between worlds.',
        strengths: ['Emotional-intellectual integration', 'Magical insight', 'Nurturing clarity'],
        shadows: ['Indecision', 'Identity diffusion'],
        lifeTheme: 'Weaving thought and feeling into one wisdom.',
      },
      {
        day: 4,
        date: 'June 24',
        blendNew: 75,
        blendOld: 25,
        mythicName: 'The Intuitive Voice',
        title: 'Feelings Finding Language',
        psychologicalProfile: 'Now mostly Cancer, but articulate. They speak emotion fluently.',
        strengths: ['Expressive empathy', 'Caring communication', 'Intuitive networking'],
        shadows: ['Talking instead of feeling', 'Emotional persuasion'],
        lifeTheme: 'Expressing the heart with clarity.',
      },
      {
        day: 5,
        date: 'June 25',
        blendNew: 89,
        blendOld: 11,
        mythicName: 'The Protective Storyteller',
        title: 'The Nest-Builder Who Remembers Flight',
        psychologicalProfile: 'Deeply emotional, but still witty. They protect through story.',
        strengths: ['Nurturing wisdom', 'Emotional memory', 'Warm presence'],
        shadows: ['Retreating into fantasy', 'Smothering with words'],
        lifeTheme: 'Creating emotional safety through expression.',
      },
      {
        day: 6,
        date: 'June 26',
        blendNew: 98,
        blendOld: 2,
        mythicName: 'The Moonlit Heart',
        title: 'Pure Lunar Feeling',
        psychologicalProfile: 'Essentially Cancer — intuitive, protective, emotional — with a faint mental breeze.',
        strengths: ['Deep empathy', 'Emotional wisdom', 'Protective love'],
        shadows: ['Mood sensitivity', 'Withdrawal'],
        lifeTheme: 'Honoring the tides within.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CUSP 5: CANCER → LEO (July 23-28)
  // "The Cusp of Oscillation" - Water feeding Fire
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'cancer-leo',
    fromSign: 'Cancer',
    toSign: 'Leo',
    fromSymbol: '♋',
    toSymbol: '♌',
    fromElement: 'Water',
    toElement: 'Fire',
    cuspName: 'The Cusp of Oscillation',
    dateRange: 'July 23-28',
    elementalDynamic: 'Water feeding Fire — emotion becoming expression',
    archetypes: [
      {
        day: 1,
        date: 'July 23',
        blendNew: 13,
        blendOld: 87,
        mythicName: 'The Shy Performer',
        title: 'A Heart That Longs to Shine',
        psychologicalProfile: 'Still deeply lunar, they feel the first warmth of Leo rising. They want to be seen, yet retreat when eyes turn toward them.',
        strengths: ['Emotional authenticity', 'Nurturing creativity', 'Gentle charisma'],
        shadows: ['Fear of exposure', 'Validation-seeking'],
        lifeTheme: 'Learning to shine without abandoning emotional safety.',
      },
      {
        day: 2,
        date: 'July 24',
        blendNew: 37,
        blendOld: 63,
        mythicName: 'The Emerging Sun',
        title: 'When the Moon Begins to Blaze',
        psychologicalProfile: 'Emotion and expression oscillate. They crave recognition but still guard their inner world.',
        strengths: ['Warm presence', 'Creative sensitivity', 'Empathic leadership'],
        shadows: ['Mood-driven expression', 'Neediness masked as generosity'],
        lifeTheme: 'Balancing vulnerability with the desire to be seen.',
      },
      {
        day: 3,
        date: 'July 25',
        blendNew: 58,
        blendOld: 42,
        mythicName: 'The Solar Crab',
        title: 'The Heart That Dares to Radiate',
        psychologicalProfile: 'Balanced between Cancer\'s depth and Leo\'s radiance. They express emotion with confidence and artistry.',
        strengths: ['Creative depth', 'Authentic expression', 'Nurturing leadership'],
        shadows: ['Emotional theatrics', 'Oscillation between hiding and shining'],
        lifeTheme: 'Expressing truth with both courage and tenderness.',
      },
      {
        day: 4,
        date: 'July 26',
        blendNew: 75,
        blendOld: 25,
        mythicName: 'The Tender Monarch',
        title: 'Royalty With a Soft Center',
        psychologicalProfile: 'Now mostly Leo, but carrying Cancer\'s emotional intelligence. They lead with warmth and protect with pride.',
        strengths: ['Generous leadership', 'Protective loyalty', 'Heartfelt creativity'],
        shadows: ['Pride wounded by emotional rejection', 'Dramatic reactions'],
        lifeTheme: 'Leading with heart, not ego.',
      },
      {
        day: 5,
        date: 'July 27',
        blendNew: 89,
        blendOld: 11,
        mythicName: 'The Radiant Protector',
        title: 'The Sun That Remembers the Moon',
        psychologicalProfile: 'Almost fully Leo, yet still emotionally attuned. They shine brightly but feel deeply.',
        strengths: ['Confident warmth', 'Creative power', 'Loyal devotion'],
        shadows: ['Taking things personally', 'Craving appreciation'],
        lifeTheme: 'Shining as a source of warmth and protection.',
      },
      {
        day: 6,
        date: 'July 28',
        blendNew: 98,
        blendOld: 2,
        mythicName: 'The Golden Lion',
        title: 'Pure Solar Radiance',
        psychologicalProfile: 'Essentially Leo with a faint lunar echo. Bold, expressive, and full of life-force.',
        strengths: ['Radiant confidence', 'Creative fire', 'Magnetic presence'],
        shadows: ['Pride vulnerability', 'Need for admiration'],
        lifeTheme: 'Embodying joy, courage, and creative selfhood.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CUSP 6: LEO → VIRGO (August 23-28)
  // "The Cusp of Exposure" - Fire refining into Earth
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'leo-virgo',
    fromSign: 'Leo',
    toSign: 'Virgo',
    fromSymbol: '♌',
    toSymbol: '♍',
    fromElement: 'Fire',
    toElement: 'Earth',
    cuspName: 'The Cusp of Exposure',
    dateRange: 'August 23-28',
    elementalDynamic: 'Fire refining into Earth — expression becoming service',
    archetypes: [
      {
        day: 1,
        date: 'August 23',
        blendNew: 13,
        blendOld: 87,
        mythicName: 'The Humble Sun',
        title: 'Radiance Learning Restraint',
        psychologicalProfile: 'Still glowing with Leo fire, yet beginning to question whether expression should serve a purpose.',
        strengths: ['Warm presence', 'Creative generosity', 'Emerging humility'],
        shadows: ['Self-criticism after shining', 'Performing for approval'],
        lifeTheme: 'Discovering that greatness includes service.',
      },
      {
        day: 2,
        date: 'August 24',
        blendNew: 37,
        blendOld: 63,
        mythicName: 'The Crafting Star',
        title: 'When Glory Meets Precision',
        psychologicalProfile: 'They begin refining their gifts. Pride shifts toward mastery.',
        strengths: ['Detailed artistry', 'Purposeful creativity', 'Thoughtful expression'],
        shadows: ['Perfectionism', 'Fear of visible flaws'],
        lifeTheme: 'Polishing the self into something meaningful.',
      },
      {
        day: 3,
        date: 'August 25',
        blendNew: 58,
        blendOld: 42,
        mythicName: 'The Brilliant Servant',
        title: 'Light That Heals',
        psychologicalProfile: 'Balanced between Leo\'s radiance and Virgo\'s devotion. They shine by helping.',
        strengths: ['Creative service', 'Precise warmth', 'Supportive leadership'],
        shadows: ['Oscillating between pride and self-doubt', 'Critical tendencies'],
        lifeTheme: 'Serving with artistry and expressing with care.',
      },
      {
        day: 4,
        date: 'August 26',
        blendNew: 75,
        blendOld: 25,
        mythicName: 'The Precise Creator',
        title: 'Excellence as Expression',
        psychologicalProfile: 'Now mostly Virgo, but still warm. Their attention to detail becomes a form of love.',
        strengths: ['Warm precision', 'Reliable excellence', 'Thoughtful craftsmanship'],
        shadows: ['Overwork', 'Difficulty relaxing'],
        lifeTheme: 'Creating beauty through devotion and discipline.',
      },
      {
        day: 5,
        date: 'August 27',
        blendNew: 89,
        blendOld: 11,
        mythicName: 'The Golden Analyst',
        title: 'Logic Lit by Fire',
        psychologicalProfile: 'Almost fully Virgo, yet carrying Leo\'s spark of pride and creativity.',
        strengths: ['Insightful analysis', 'Creative problem-solving', 'Quiet confidence'],
        shadows: ['Harsh self-judgment', 'Fear of imperfection'],
        lifeTheme: 'Letting reason and creativity refine one another.',
      },
      {
        day: 6,
        date: 'August 28',
        blendNew: 98,
        blendOld: 2,
        mythicName: 'The Earth-Lit Flame',
        title: 'Pure Virgo with a Hint of Sun',
        psychologicalProfile: 'Essentially Virgo — devoted, precise, humble — with a faint solar glow.',
        strengths: ['Service-oriented mastery', 'Practical intelligence', 'Steady dedication'],
        shadows: ['Overresponsibility', 'Self-erasure'],
        lifeTheme: 'Honoring the sacredness of craft and care.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CUSP 7: VIRGO → LIBRA (September 23-28)
  // "The Cusp of Refinement" - Earth balancing into Air
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'virgo-libra',
    fromSign: 'Virgo',
    toSign: 'Libra',
    fromSymbol: '♍',
    toSymbol: '♎',
    fromElement: 'Earth',
    toElement: 'Air',
    cuspName: 'The Cusp of Refinement',
    dateRange: 'September 23-28',
    elementalDynamic: 'Earth balancing into Air — precision becoming harmony',
    archetypes: [
      {
        day: 1,
        date: 'September 23',
        blendNew: 13,
        blendOld: 87,
        mythicName: 'The Gentle Critic',
        title: 'Precision Awakening to Beauty',
        psychologicalProfile: 'Still Virgoan in discernment, yet beginning to sense the importance of grace and balance.',
        strengths: ['Thoughtful analysis', 'Considerate judgment', 'Quiet elegance'],
        shadows: ['Overthinking impressions', 'Fear of social missteps'],
        lifeTheme: 'Letting precision soften into harmony.',
      },
      {
        day: 2,
        date: 'September 24',
        blendNew: 37,
        blendOld: 63,
        mythicName: 'The Harmonizing Mind',
        title: 'When Order Learns to Flow',
        psychologicalProfile: 'They begin weighing not only correctness but fairness. Beauty becomes part of their logic.',
        strengths: ['Fair-mindedness', 'Refined taste', 'Diplomatic clarity'],
        shadows: ['Indecision', 'People-pleasing'],
        lifeTheme: 'Balancing truth with tact.',
      },
      {
        day: 3,
        date: 'September 25',
        blendNew: 58,
        blendOld: 42,
        mythicName: 'The Elegant Analyst',
        title: 'The Mind That Measures Harmony',
        psychologicalProfile: 'Balanced between Virgo\'s precision and Libra\'s grace. They refine both systems and relationships.',
        strengths: ['Polished communication', 'Insightful mediation', 'Aesthetic intelligence'],
        shadows: ['Critical charm', 'Difficulty choosing sides'],
        lifeTheme: 'Creating order that feels beautiful.',
      },
      {
        day: 4,
        date: 'September 26',
        blendNew: 75,
        blendOld: 25,
        mythicName: 'The Precise Diplomat',
        title: 'Harmony With Standards',
        psychologicalProfile: 'Now mostly Libra, but with Virgo\'s eye for detail. They notice subtle imbalances others miss.',
        strengths: ['Graceful problem-solving', 'Balanced judgment', 'Social finesse'],
        shadows: ['Overanalysis of relationships', 'Conflict avoidance'],
        lifeTheme: 'Maintaining harmony without losing truth.',
      },
      {
        day: 5,
        date: 'September 27',
        blendNew: 89,
        blendOld: 11,
        mythicName: 'The Polished Mirror',
        title: 'Reflection With Refinement',
        psychologicalProfile: 'Almost fully Libra, but with Virgo\'s quiet humility. They reflect others with clarity and care.',
        strengths: ['Diplomatic insight', 'Aesthetic refinement', 'Gentle honesty'],
        shadows: ['Self-erasure', 'Overconcern with appearances'],
        lifeTheme: 'Seeing others clearly without losing oneself.',
      },
      {
        day: 6,
        date: 'September 28',
        blendNew: 98,
        blendOld: 2,
        mythicName: 'The Balanced Breeze',
        title: 'Pure Libra With a Hint of Earth',
        psychologicalProfile: 'Essentially Libra — relational, graceful, balanced — with a faint Virgoan grounding.',
        strengths: ['Harmony-seeking', 'Social intelligence', 'Refined presence'],
        shadows: ['Indecision', 'Avoiding discomfort'],
        lifeTheme: 'Living as a bridge between people and possibilities.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CUSP 8: LIBRA → SCORPIO (October 23-28)
  // "The Cusp of Depth" - Air sinking into Water
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'libra-scorpio',
    fromSign: 'Libra',
    toSign: 'Scorpio',
    fromSymbol: '♎',
    toSymbol: '♏',
    fromElement: 'Air',
    toElement: 'Water',
    cuspName: 'The Cusp of Depth',
    dateRange: 'October 23-28',
    elementalDynamic: 'Air sinking into Water — harmony meeting truth',
    archetypes: [
      {
        day: 1,
        date: 'October 23',
        blendNew: 13,
        blendOld: 87,
        mythicName: 'The Charming Depth-Seeker',
        title: 'Grace That Begins to Sense the Underworld',
        psychologicalProfile: 'Still airy and diplomatic, yet newly aware of emotional undercurrents.',
        strengths: ['Tact with intuition', 'Social insight', 'Calm perception'],
        shadows: ['Hidden worry', 'Avoiding difficult truths'],
        lifeTheme: 'Letting harmony deepen into honesty.',
      },
      {
        day: 2,
        date: 'October 24',
        blendNew: 37,
        blendOld: 63,
        mythicName: 'The Velvet Interrogator',
        title: 'When Curiosity Turns Inward',
        psychologicalProfile: 'They begin probing beneath the surface, seeking motives and meaning.',
        strengths: ['Perceptive diplomacy', 'Emotional intelligence', 'Fair intensity'],
        shadows: ['Suspicion', 'Difficulty staying neutral'],
        lifeTheme: 'Balancing grace with depth.',
      },
      {
        day: 3,
        date: 'October 25',
        blendNew: 58,
        blendOld: 42,
        mythicName: 'The Velvet Blade',
        title: 'Soft Words, Sharp Insight',
        psychologicalProfile: 'Balanced between Libra\'s charm and Scorpio\'s x-ray vision.',
        strengths: ['Disarming honesty', 'Magnetic presence', 'Insightful dialogue'],
        shadows: ['Testing loyalty', 'Hidden resentment'],
        lifeTheme: 'Speaking truth with elegance.',
      },
      {
        day: 4,
        date: 'October 26',
        blendNew: 75,
        blendOld: 25,
        mythicName: 'The Diplomatic Phoenix',
        title: 'Intensity Wrapped in Grace',
        psychologicalProfile: 'Now mostly Scorpio, but socially smooth. They transform relationships gently.',
        strengths: ['Strategic empathy', 'Transformative presence', 'Deep loyalty'],
        shadows: ['Fear of vulnerability', 'Emotional control'],
        lifeTheme: 'Transforming through connection.',
      },
      {
        day: 5,
        date: 'October 27',
        blendNew: 89,
        blendOld: 11,
        mythicName: 'The Magnetic Judge',
        title: 'Seeing the Soul Behind the Smile',
        psychologicalProfile: 'Almost fully Scorpio, but with Libra\'s fairness. They judge motives, not appearances.',
        strengths: ['Penetrating insight', 'Moral clarity', 'Emotional depth'],
        shadows: ['Harsh judgments', 'Difficulty forgiving'],
        lifeTheme: 'Seeking truth beneath beauty.',
      },
      {
        day: 6,
        date: 'October 28',
        blendNew: 98,
        blendOld: 2,
        mythicName: 'The Enchanted Depth',
        title: 'Pure Scorpio With a Gentle Surface',
        psychologicalProfile: 'Essentially Scorpio — intense, private, transformative — with a faint social grace.',
        strengths: ['Emotional power', 'Insight', 'Magnetism'],
        shadows: ['Control', 'Fear of betrayal'],
        lifeTheme: 'Embracing depth as destiny.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CUSP 9: SCORPIO → SAGITTARIUS (November 22-27)
  // "The Cusp of Revelation" - Water igniting into Fire
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'scorpio-sagittarius',
    fromSign: 'Scorpio',
    toSign: 'Sagittarius',
    fromSymbol: '♏',
    toSymbol: '♐',
    fromElement: 'Water',
    toElement: 'Fire',
    cuspName: 'The Cusp of Revelation',
    dateRange: 'November 22-27',
    elementalDynamic: 'Water igniting into Fire — depth becoming meaning',
    archetypes: [
      {
        day: 1,
        date: 'November 22',
        blendNew: 13,
        blendOld: 87,
        mythicName: 'The Brooding Explorer',
        title: 'Depth That Begins to Seek Horizons',
        psychologicalProfile: 'Still intense and private, yet curious about truth beyond the self.',
        strengths: ['Insight', 'Emotional courage', 'Philosophical curiosity'],
        shadows: ['Cynicism', 'Fear of hope'],
        lifeTheme: 'Letting meaning rise from the depths.',
      },
      {
        day: 2,
        date: 'November 23',
        blendNew: 37,
        blendOld: 63,
        mythicName: 'The Philosophical Phoenix',
        title: 'When Transformation Seeks Purpose',
        psychologicalProfile: 'They rise from emotional depths with questions about destiny and belief.',
        strengths: ['Resilience', 'Wisdom', 'Passionate inquiry'],
        shadows: ['Dogmatic intensity', 'All-or-nothing thinking'],
        lifeTheme: 'Turning pain into philosophy.',
      },
      {
        day: 3,
        date: 'November 24',
        blendNew: 58,
        blendOld: 42,
        mythicName: 'The Torch in the Abyss',
        title: 'Light Carried Into Darkness',
        psychologicalProfile: 'Balanced between Scorpio\'s depth and Sagittarius\' fire. They illuminate shadows.',
        strengths: ['Courage', 'Truth-telling', 'Transformative insight'],
        shadows: ['Risk-taking to escape heaviness', 'Emotional volatility'],
        lifeTheme: 'Seeking truth in both darkness and light.',
      },
      {
        day: 4,
        date: 'November 25',
        blendNew: 75,
        blendOld: 25,
        mythicName: 'The Intense Wanderer',
        title: 'A Traveler Who Cannot Travel Lightly',
        psychologicalProfile: 'Now mostly Sagittarius, but emotionally intense. They explore with passion.',
        strengths: ['Adventurous spirit', 'Honesty', 'Transformative curiosity'],
        shadows: ['Bluntness', 'Restlessness'],
        lifeTheme: 'Finding freedom without fleeing depth.',
      },
      {
        day: 5,
        date: 'November 26',
        blendNew: 89,
        blendOld: 11,
        mythicName: 'The Truth-Hunter',
        title: 'Seeking What Burns and Liberates',
        psychologicalProfile: 'Almost fully Sagittarius, but with Scorpio\'s x-ray perception.',
        strengths: ['Fearless questioning', 'Moral clarity', 'Inspiration'],
        shadows: ['Dogmatism', 'Burning bridges'],
        lifeTheme: 'Pursuing truth with fire and depth.',
      },
      {
        day: 6,
        date: 'November 27',
        blendNew: 98,
        blendOld: 2,
        mythicName: 'The Sacred Rebel',
        title: 'Pure Fire With a Hidden Abyss',
        psychologicalProfile: 'Essentially Sagittarius — bold, idealistic, free — with a faint emotional undertow.',
        strengths: ['Vision', 'Courage', 'Rebellion'],
        shadows: ['Martyrdom', 'Conflict with authority'],
        lifeTheme: 'Living as a catalyst for change.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CUSP 10: SAGITTARIUS → CAPRICORN (December 22-27)
  // "The Cusp of Ambition" - Fire crystallizing into Earth
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'sagittarius-capricorn',
    fromSign: 'Sagittarius',
    toSign: 'Capricorn',
    fromSymbol: '♐',
    toSymbol: '♑',
    fromElement: 'Fire',
    toElement: 'Earth',
    cuspName: 'The Cusp of Ambition',
    dateRange: 'December 22-27',
    elementalDynamic: 'Fire crystallizing into Earth — vision becoming structure',
    archetypes: [
      {
        day: 1,
        date: 'December 22',
        blendNew: 13,
        blendOld: 87,
        mythicName: 'The Dreaming Strategist',
        title: 'Vision Learning to Plan',
        psychologicalProfile: 'Still expansive and idealistic, yet beginning to sense responsibility.',
        strengths: ['Big-picture thinking', 'Emerging discipline', 'Optimistic planning'],
        shadows: ['Fear of limitation', 'Inconsistent follow-through'],
        lifeTheme: 'Turning possibility into purpose.',
      },
      {
        day: 2,
        date: 'December 23',
        blendNew: 37,
        blendOld: 63,
        mythicName: 'The Ambitious Explorer',
        title: 'Adventure Seeking Legacy',
        psychologicalProfile: 'They want their journeys to amount to something lasting.',
        strengths: ['Goal-oriented optimism', 'Strategic risk-taking', 'Purpose'],
        shadows: ['Overcommitment', 'Impatience'],
        lifeTheme: 'Building meaning through achievement.',
      },
      {
        day: 3,
        date: 'December 24',
        blendNew: 58,
        blendOld: 42,
        mythicName: 'The Pilgrim-Builder',
        title: 'Laying Stones Along the Path',
        psychologicalProfile: 'Balanced between Sagittarius\' quest and Capricorn\'s structure.',
        strengths: ['Resilience', 'Pragmatic idealism', 'Long-term vision'],
        shadows: ['Self-pressure', 'Fear of failure'],
        lifeTheme: 'Walking the long road with purpose.',
      },
      {
        day: 4,
        date: 'December 25',
        blendNew: 75,
        blendOld: 25,
        mythicName: 'The Serious Adventurer',
        title: 'A Climber Who Loves the View',
        psychologicalProfile: 'Now mostly Capricorn, but still adventurous. They plan boldly.',
        strengths: ['Strategic thinking', 'Ambition', 'Courage'],
        shadows: ['Workaholism', 'Difficulty relaxing'],
        lifeTheme: 'Achieving without losing wonder.',
      },
      {
        day: 5,
        date: 'December 26',
        blendNew: 89,
        blendOld: 11,
        mythicName: 'The Wise Architect',
        title: 'Building What Matters',
        psychologicalProfile: 'Almost fully Capricorn, but with Sagittarius\' philosophical fire.',
        strengths: ['Mature judgment', 'System-building', 'Integrity'],
        shadows: ['Rigid beliefs', 'Fear of uncertainty'],
        lifeTheme: 'Constructing a meaningful legacy.',
      },
      {
        day: 6,
        date: 'December 27',
        blendNew: 98,
        blendOld: 2,
        mythicName: 'The Stoic Sage',
        title: 'Pure Earth With a Guiding Flame',
        psychologicalProfile: 'Essentially Capricorn — disciplined, wise, grounded — with a faint spark of idealism.',
        strengths: ['Patience', 'Responsibility', 'Wisdom'],
        shadows: ['Pessimism', 'Carrying too much'],
        lifeTheme: 'Walking the path of earned wisdom.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CUSP 11: CAPRICORN → AQUARIUS (January 19-24)
  // "The Cusp of Mystery" - Earth breaking into Air
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'capricorn-aquarius',
    fromSign: 'Capricorn',
    toSign: 'Aquarius',
    fromSymbol: '♑',
    toSymbol: '♒',
    fromElement: 'Earth',
    toElement: 'Air',
    cuspName: 'The Cusp of Mystery',
    dateRange: 'January 19-24',
    elementalDynamic: 'Earth breaking into Air — structure becoming innovation',
    archetypes: [
      {
        day: 1,
        date: 'January 19',
        blendNew: 13,
        blendOld: 87,
        mythicName: 'The Structured Rebel',
        title: 'Tradition Beginning to Crack Open',
        psychologicalProfile: 'Still grounded in Capricorn discipline, yet feeling the first electric pull of Aquarius. They question the very rules they uphold.',
        strengths: ['Reliable leadership', 'Emerging originality', 'Strategic thinking'],
        shadows: ['Inner conflict between duty and freedom', 'Rigid idealism'],
        lifeTheme: 'Learning to innovate without abandoning integrity.',
      },
      {
        day: 2,
        date: 'January 20',
        blendNew: 37,
        blendOld: 63,
        mythicName: 'The Visionary Executor',
        title: 'Blueprints for a Better Future',
        psychologicalProfile: 'They begin imagining new systems, not just maintaining old ones. Their ambition becomes humanitarian.',
        strengths: ['Forward-thinking', 'Organizational skill', 'Purposeful innovation'],
        shadows: ['Workaholism for causes', 'Detachment from personal needs'],
        lifeTheme: 'Building structures that uplift the collective.',
      },
      {
        day: 3,
        date: 'January 21',
        blendNew: 58,
        blendOld: 42,
        mythicName: 'The System Reformer',
        title: 'Rewriting the Rules From Within',
        psychologicalProfile: 'Balanced between Capricorn\'s mastery and Aquarius\' rebellion. They improve systems rather than abandon them.',
        strengths: ['Strategic reform', 'Persistence', 'Ethical clarity'],
        shadows: ['Frustration with slow change', 'Carrying too much responsibility'],
        lifeTheme: 'Transforming tradition into progress.',
      },
      {
        day: 4,
        date: 'January 22',
        blendNew: 75,
        blendOld: 25,
        mythicName: 'The Grounded Visionary',
        title: 'Innovation With Roots',
        psychologicalProfile: 'Now mostly Aquarius, but still practical. They dream boldly but execute realistically.',
        strengths: ['Inventive problem-solving', 'Commitment to progress', 'Independent thought'],
        shadows: ['Impatience with hierarchy', 'Emotional detachment'],
        lifeTheme: 'Bringing the future into form.',
      },
      {
        day: 5,
        date: 'January 23',
        blendNew: 89,
        blendOld: 11,
        mythicName: 'The Responsible Outsider',
        title: 'The Rebel Who Still Shows Up',
        psychologicalProfile: 'Almost fully Aquarius, yet dependable. They stand apart while still contributing.',
        strengths: ['Reliable uniqueness', 'Ethical independence', 'Social insight'],
        shadows: ['Feeling misunderstood', 'Difficulty asking for help'],
        lifeTheme: 'Honoring individuality while serving the whole.',
      },
      {
        day: 6,
        date: 'January 24',
        blendNew: 98,
        blendOld: 2,
        mythicName: 'The Architect of Change',
        title: 'Pure Vision With a Touch of Earth',
        psychologicalProfile: 'Essentially Aquarius — visionary, unconventional, future-minded — with a faint Capricorn backbone.',
        strengths: ['Long-range vision', 'Innovative thinking', 'Humanitarian ideals'],
        shadows: ['Detachment from the present', 'Frustration with resistance'],
        lifeTheme: 'Designing the world that could be.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CUSP 12: AQUARIUS → PISCES (February 18-23)
  // "The Cusp of Imagination" - Air dissolving into Water
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'aquarius-pisces',
    fromSign: 'Aquarius',
    toSign: 'Pisces',
    fromSymbol: '♒',
    toSymbol: '♓',
    fromElement: 'Air',
    toElement: 'Water',
    cuspName: 'The Cusp of Imagination',
    dateRange: 'February 18-23',
    elementalDynamic: 'Air dissolving into Water — intellect becoming intuition',
    archetypes: [
      {
        day: 1,
        date: 'February 18',
        blendNew: 13,
        blendOld: 87,
        mythicName: 'The Cosmic Observer',
        title: 'A Mind Beginning to Feel',
        psychologicalProfile: 'Still airy and analytical, yet sensing the first waves of Piscean emotion and mysticism.',
        strengths: ['Objective insight', 'Emerging empathy', 'Pattern recognition'],
        shadows: ['Emotional confusion', 'Oscillation between detachment and overwhelm'],
        lifeTheme: 'Letting intellect soften into intuition.',
      },
      {
        day: 2,
        date: 'February 19',
        blendNew: 37,
        blendOld: 63,
        mythicName: 'The Idealistic Dreamer',
        title: 'When Vision Learns Compassion',
        psychologicalProfile: 'They begin caring deeply about the suffering they once analyzed from afar.',
        strengths: ['Visionary compassion', 'Creative problem-solving', 'Humanitarian spirit'],
        shadows: ['Disillusionment', 'Boundary issues'],
        lifeTheme: 'Uniting ideals with empathy.',
      },
      {
        day: 3,
        date: 'February 20',
        blendNew: 58,
        blendOld: 42,
        mythicName: 'The Star-Gazer',
        title: 'Hearing Music in the Constellations',
        psychologicalProfile: 'Balanced between Aquarius\' cosmic mind and Pisces\' mystical heart.',
        strengths: ['Creative vision', 'Open-mindedness', 'Symbolic thinking'],
        shadows: ['Difficulty grounding', 'Emotional diffusion'],
        lifeTheme: 'Seeing the world through mythic patterns.',
      },
      {
        day: 4,
        date: 'February 21',
        blendNew: 75,
        blendOld: 25,
        mythicName: 'The Electric Mystic',
        title: 'Intuition Charged With Lightning',
        psychologicalProfile: 'Now mostly Pisces, but with Aquarius\' originality. Their intuition is inventive and unusual.',
        strengths: ['Original creativity', 'Empathic insight', 'Spiritual imagination'],
        shadows: ['Scattered focus', 'Overstimulation'],
        lifeTheme: 'Channeling inspiration into form.',
      },
      {
        day: 5,
        date: 'February 22',
        blendNew: 89,
        blendOld: 11,
        mythicName: 'The Compassionate Rebel',
        title: 'Kindness as Defiance',
        psychologicalProfile: 'Almost fully Pisces, yet still rebellious. They challenge norms through empathy.',
        strengths: ['Deep compassion', 'Moral intuition', 'Courageous softness'],
        shadows: ['Martyr tendencies', 'Emotional vulnerability'],
        lifeTheme: 'Healing the world through gentle resistance.',
      },
      {
        day: 6,
        date: 'February 23',
        blendNew: 98,
        blendOld: 2,
        mythicName: 'The Ocean of Stars',
        title: 'Pure Feeling With a Cosmic Echo',
        psychologicalProfile: 'Essentially Pisces — intuitive, dreamy, boundless — with a faint Aquarian starlight.',
        strengths: ['Spiritual depth', 'Artistic sensitivity', 'Unconditional empathy'],
        shadows: ['Escapism', 'Blurring of boundaries'],
        lifeTheme: 'Living as a vessel for imagination and compassion.',
      },
    ],
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get a cusp transition by ID
 */
export function getCuspById(id: string): CuspTransition | undefined {
  return CUSP_ARCHETYPES.find((c) => c.id === id);
}

/**
 * Get a specific day archetype from a cusp
 */
export function getCuspDayArchetype(cuspId: string, day: number): CuspDayArchetype | undefined {
  const cusp = getCuspById(cuspId);
  if (!cusp) return undefined;
  return cusp.archetypes.find((a) => a.day === day);
}

/**
 * Find archetype by date (month, day)
 */
export function getArchetypeByDate(month: number, day: number): { cusp: CuspTransition; archetype: CuspDayArchetype } | undefined {
  for (const cusp of CUSP_ARCHETYPES) {
    for (const archetype of cusp.archetypes) {
      const [archMonth, archDay] = parseDateString(archetype.date);
      if (archMonth === month && archDay === day) {
        return { cusp, archetype };
      }
    }
  }
  return undefined;
}

/**
 * Parse date string like "March 21" into [month, day]
 */
function parseDateString(dateStr: string): [number, number] {
  const months: Record<string, number> = {
    January: 1, February: 2, March: 3, April: 4,
    May: 5, June: 6, July: 7, August: 8,
    September: 9, October: 10, November: 11, December: 12,
  };
  const parts = dateStr.split(' ');
  const month = months[parts[0]] || 0;
  const day = parseInt(parts[1], 10);
  return [month, day];
}

/**
 * Get all archetypes for a given element transition
 */
export function getArchetypesByElementalTransition(fromElement: string, toElement: string): CuspTransition[] {
  return CUSP_ARCHETYPES.filter(
    (c) => c.fromElement === fromElement && c.toElement === toElement
  );
}

/**
 * Get total count of archetypes
 */
export function getTotalArchetypeCount(): number {
  return CUSP_ARCHETYPES.reduce((sum, cusp) => sum + cusp.archetypes.length, 0);
}

/**
 * Get cusp by sign names
 */
export function getCuspBySignPair(fromSign: string, toSign: string): CuspTransition | undefined {
  return CUSP_ARCHETYPES.find(
    (c) => c.fromSign.toLowerCase() === fromSign.toLowerCase() &&
           c.toSign.toLowerCase() === toSign.toLowerCase()
  );
}

/**
 * Get all cusp names as a list
 */
export function getAllCuspNames(): string[] {
  return CUSP_ARCHETYPES.map((c) => c.cuspName);
}

// =============================================================================
// EXPORTS
// =============================================================================

export default CUSP_ARCHETYPES;
