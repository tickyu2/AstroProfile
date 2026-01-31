/**
 * Seasonality Guidance Engine
 *
 * Susan Miller-style guidance for how each birth sign experiences
 * each of the 12 seasonal subdivisions.
 *
 * "How does a Taurus feel in the core of Autumn (Scorpio season)?"
 * "What should an Aries do during the end of Winter (Pisces season)?"
 *
 * GENESIS AstroProfile - January 2026
 */

import type {
  SignKey,
  Season,
  SeasonPhase,
  Element,
  Modality,
  SeasonalSlot,
} from '../zodiac/tropicalCalendar';
import {
  SEASONAL_CALENDAR,
  SIGN_LESSONS,
  TROPICAL_ORDER,
  getCurrentSeasonalSlot,
  getBirthSeasonalSlot,
  calculateSeasonalResonance,
  getElementRelationship,
  getModalityRelationship,
} from '../zodiac/tropicalCalendar';

import {
  getAngleBetweenSigns,
  type AngleKey,
  type AngleLesson,
} from '../zodiac/angles';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Aspect Geometry - The "why" layer explaining geometric relationships
 */
export interface AspectGeometry {
  aspectKey: AngleKey;              // 'conjunction' | 'sextile' | 'square' | etc.
  aspectName: string;               // "Sextile", "Square", etc.
  degrees: number;                  // 0, 60, 90, 120, 150, 180
  symbol: string;                   // ☌, ⚹, □, △, ⚻, ☍
  whyItFeels: string;               // Core explanation of the geometry
  structuralReason: string;         // The geometric teaching
  consciousUse: string;             // How to use this aspect intentionally
}

export interface SeasonalGuidanceSection {
  slotIndex: number;
  sign: SignKey;
  season: Season;
  phase: SeasonPhase;
  title: string;                    // "Spring Begin (Aries Season)"
  dateRange: string;                // "Mar 21 - Apr 19"
  resonance: {
    score: number;
    level: 'high' | 'moderate' | 'low' | 'challenging';
  };
  howYouFeel: string[];             // Emotional/energetic experience
  whatToDo: string[];               // Practical actions
  watchOutFor: string[];            // Pitfalls to avoid
  affirmation: string;              // Mantra for this period
  aspectGeometry: AspectGeometry;   // NEW: The geometric "why" layer
  isCurrent: boolean;               // Is this the current season?
  isBirthSeason: boolean;           // Is this the user's birth season?
}

export interface SeasonalityReport {
  birthSign: SignKey;
  birthSlot: SeasonalSlot;
  currentSlot: SeasonalSlot;
  sections: SeasonalGuidanceSection[];
  currentSectionIndex: number;
  yearTheme: string;                // Overall theme for this sign's year
}

// =============================================================================
// GUIDANCE GENERATION DATA
// =============================================================================

/**
 * How each element feels in each phase
 */
const ELEMENT_IN_PHASE: Record<Element, Record<SeasonPhase, string[]>> = {
  Fire: {
    begin: [
      'Your natural initiative aligns with fresh starts',
      'Energy feels direct and actionable',
      'Leadership opportunities appear',
    ],
    core: [
      'Sustaining energy requires conscious effort',
      'Your fire needs steady fuel, not quick burns',
      'Patience becomes a superpower',
    ],
    end: [
      'Adaptability feels natural to your dynamic nature',
      'Multiple paths open simultaneously',
      'Your enthusiasm helps others through transitions',
    ],
  },
  Earth: {
    begin: [
      'New beginnings need your grounding presence',
      'Others look to you for practical direction',
      'Building foundations feels urgent',
    ],
    core: [
      'This is your power zone - steady, reliable, productive',
      'Your natural endurance shines',
      'Material progress accelerates',
    ],
    end: [
      'Flexibility challenges your need for stability',
      'Trust the process even when foundations shift',
      'Your adaptations become lasting improvements',
    ],
  },
  Air: {
    begin: [
      'Ideas want to become real - time to commit',
      'Your concepts find willing audiences',
      'Communication becomes action',
    ],
    core: [
      'Deep focus may feel constraining to your curious nature',
      'One idea pursued deeply outperforms many explored lightly',
      'Your persistence surprises even yourself',
    ],
    end: [
      'Your adaptable mind thrives in transition',
      'Connections multiply, networks expand',
      'Mental agility is your greatest asset',
    ],
  },
  Water: {
    begin: [
      'Emotional intuition guides new directions',
      'Trust your feelings about what to start',
      'Nurturing energy supports fresh growth',
    ],
    core: [
      'Deep emotional processing feels supported',
      'Bonds deepen through sustained attention',
      'Your sensitivity becomes strength',
    ],
    end: [
      'Letting go comes naturally to your flowing nature',
      'Emotional transitions feel like homecoming',
      'Your empathy helps others release',
    ],
  },
};

/**
 * How each modality feels in each phase
 */
const MODALITY_IN_PHASE: Record<Modality, Record<SeasonPhase, string[]>> = {
  Cardinal: {
    begin: [
      'This is YOUR energy - initiation, leadership, breakthrough',
      'Your natural starting power is amplified',
      'Others follow your lead more readily',
    ],
    core: [
      'Sustaining what you started requires new skills',
      'Delegate maintenance, plan next initiatives',
      'Your restlessness serves a purpose - keep moving forward',
    ],
    end: [
      'Transitions reveal what was worth starting',
      'Your forward momentum helps groups adapt',
      'Begin planning your next initiative',
    ],
  },
  Fixed: {
    begin: [
      'New directions need your stabilizing commitment',
      'Choose carefully - you\'ll be holding this for a while',
      'Your dedication makes beginnings last',
    ],
    core: [
      'This is YOUR energy - endurance, depth, loyalty',
      'Your natural staying power is amplified',
      'What you commit to now will define you',
    ],
    end: [
      'Letting go challenges your holding nature',
      'Trust that release creates space for better',
      'Your roots remain even when branches change',
    ],
  },
  Mutable: {
    begin: [
      'Committed beginnings feel unfamiliar but necessary',
      'Your adaptability helps others start',
      'Pick a direction and surprise yourself by sticking with it',
    ],
    core: [
      'Sustained focus develops your hidden strengths',
      'Stay with one thing longer than comfortable',
      'Your flexibility makes fixed energy more dynamic',
    ],
    end: [
      'This is YOUR energy - adaptation, transition, flow',
      'Your natural flexibility is amplified',
      'You see what others miss in the changing landscape',
    ],
  },
};

/**
 * Special guidance for opposite sign seasons
 * When you're in your opposite sign's season, there's unique tension and growth
 */
const OPPOSITE_SIGN_GUIDANCE: Record<SignKey, { title: string; howYouFeel: string[]; whatToDo: string[]; watchOutFor: string[] }> = {
  Aries: {
    title: 'Libra Season: Your Mirror',
    howYouFeel: [
      'Others\' needs feel unusually demanding of your energy',
      'The urge to act independently conflicts with partnership requirements',
      'Balance feels like a foreign language you\'re being asked to speak',
    ],
    whatToDo: [
      'Practice the art of "we" without losing "I"',
      'Let someone else lead - observe what you learn',
      'Find the courage in compromise',
    ],
    watchOutFor: [
      'Impatience with others\' decision-making pace',
      'Dismissing harmony as weakness',
      'Starting fights to feel alive',
    ],
  },
  Taurus: {
    title: 'Scorpio Season: Your Transformation',
    howYouFeel: [
      'The ground beneath you feels less solid than usual',
      'Deep emotional currents pull at your stability',
      'What you own and value comes into question',
    ],
    whatToDo: [
      'Release one thing you\'ve been clutching too tightly',
      'Explore the power that comes from letting go',
      'Trust that transformation enriches, not diminishes',
    ],
    watchOutFor: [
      'Resisting necessary endings',
      'Possessiveness masquerading as love',
      'Comfort-seeking that blocks growth',
    ],
  },
  Gemini: {
    title: 'Sagittarius Season: Your Expansion',
    howYouFeel: [
      'Your many interests want to become ONE big truth',
      'The urge to explore goes deeper than usual',
      'Facts aren\'t enough - meaning calls',
    ],
    whatToDo: [
      'Commit to one philosophy and explore it fully',
      'Turn your curiosity into wisdom',
      'Let your scattered light focus into a beam',
    ],
    watchOutFor: [
      'Superficiality when depth is required',
      'Changing beliefs to avoid commitment',
      'Missing the forest for interesting trees',
    ],
  },
  Cancer: {
    title: 'Capricorn Season: Your Structure',
    howYouFeel: [
      'Emotional needs meet worldly demands',
      'The call to achieve challenges your need to nurture',
      'Home and career pull in opposite directions',
    ],
    whatToDo: [
      'Build structures that protect what you love',
      'Let your emotional intelligence inform your ambitions',
      'Create professional boundaries that honor personal needs',
    ],
    watchOutFor: [
      'Hiding in comfort when achievement calls',
      'Letting emotion override practical necessity',
      'Neglecting worldly responsibilities for emotional safety',
    ],
  },
  Leo: {
    title: 'Aquarius Season: Your Community',
    howYouFeel: [
      'Your individual brilliance meets collective needs',
      'The spotlight shifts to the group',
      'Your creative ego confronts humanitarian ideals',
    ],
    whatToDo: [
      'Let your light illuminate others, not just yourself',
      'Find your unique role in the collective',
      'Lead by empowering, not commanding',
    ],
    watchOutFor: [
      'Taking group credit personally',
      'Feeling diminished when not center stage',
      'Confusing popularity with purpose',
    ],
  },
  Virgo: {
    title: 'Pisces Season: Your Surrender',
    howYouFeel: [
      'Your precise mind meets oceanic feeling',
      'Details dissolve into larger patterns',
      'The urge to fix meets the call to accept',
    ],
    whatToDo: [
      'Practice useful imperfection',
      'Trust intuition alongside analysis',
      'Let some chaos become creative inspiration',
    ],
    watchOutFor: [
      'Criticizing what can\'t be fixed',
      'Analysis paralysis in the face of mystery',
      'Dismissing feelings as illogical',
    ],
  },
  Libra: {
    title: 'Aries Season: Your Independence',
    howYouFeel: [
      'The urge to act alone challenges your relational nature',
      'Others\' opinions feel less important than your own direction',
      'Balance gives way to decisive movement',
    ],
    whatToDo: [
      'Make one decision without consulting anyone',
      'Discover what YOU want, independent of partners',
      'Find beauty in bold, unbalanced action',
    ],
    watchOutFor: [
      'Seeking harmony when conflict is necessary',
      'Waiting for others to decide first',
      'Losing yourself in consideration of others',
    ],
  },
  Scorpio: {
    title: 'Taurus Season: Your Simplicity',
    howYouFeel: [
      'Your depth meets surface pleasures',
      'The call to enjoy challenges your need to transform',
      'Simple satisfaction feels too easy',
    ],
    whatToDo: [
      'Let something be good without needing to be profound',
      'Enjoy without analyzing',
      'Find power in peaceful presence',
    ],
    watchOutFor: [
      'Complicating simple situations',
      'Suspecting peaceful people',
      'Transforming what just wants to exist',
    ],
  },
  Sagittarius: {
    title: 'Gemini Season: Your Focus',
    howYouFeel: [
      'Your big picture meets many small details',
      'The urge to conclude meets endless questions',
      'Truth wants to be many truths',
    ],
    whatToDo: [
      'Learn the facts before proclaiming the truth',
      'Let curiosity humble your certainty',
      'Find wisdom in questions, not just answers',
    ],
    watchOutFor: [
      'Preaching when listening is needed',
      'Dismissing details as beneath you',
      'Confusing opinion with truth',
    ],
  },
  Capricorn: {
    title: 'Cancer Season: Your Feeling',
    howYouFeel: [
      'Your ambition meets emotional needs',
      'The call to achieve yields to the call to connect',
      'Professional armor feels uncomfortable',
    ],
    whatToDo: [
      'Let yourself need people, not just success',
      'Build something that nurtures, not just achieves',
      'Find ambition in love, not just work',
    ],
    watchOutFor: [
      'Using work to avoid emotional vulnerability',
      'Dismissing feelings as unproductive',
      'Building walls when bridges are needed',
    ],
  },
  Aquarius: {
    title: 'Leo Season: Your Heart',
    howYouFeel: [
      'Your cool detachment meets warm expression',
      'The collective yields to the personal',
      'Ideas want to become performances',
    ],
    whatToDo: [
      'Let yourself be seen as an individual, not just an idea',
      'Express from the heart, not just the mind',
      'Find your unique creative voice',
    ],
    watchOutFor: [
      'Intellectualizing when feeling is needed',
      'Hiding in groups to avoid personal exposure',
      'Dismissing personal expression as ego',
    ],
  },
  Pisces: {
    title: 'Virgo Season: Your Form',
    howYouFeel: [
      'Your oceanic nature meets precise shores',
      'Dreams want to become plans',
      'The formless seeks form',
    ],
    whatToDo: [
      'Give your visions practical expression',
      'Let details serve your dreams',
      'Find the sacred in the specific',
    ],
    watchOutFor: [
      'Escaping into fantasy when reality calls',
      'Resenting necessary criticism',
      'Losing inspiration to perfectionism',
    ],
  },
};

// =============================================================================
// ASPECT GEOMETRY INTERPRETATIONS
// =============================================================================

/**
 * Deep aspect interpretations for the "why" layer
 * Each aspect explains: why it feels this way, the geometric reason, how to use it
 */
const ASPECT_INTERPRETATIONS: Record<AngleKey, {
  whyItFeels: (natal: SignKey, chamber: SignKey) => string;
  structuralReason: string;
  consciousUse: string;
}> = {
  conjunction: {
    whyItFeels: (natal, chamber) =>
      `This is your own sign season — ${chamber} energy is YOUR energy. Everything feels concentrated, familiar, and self-reinforcing. You're operating from your natural center.`,
    structuralReason:
      'At 0° separation, energies merge completely. There is no distance, no translation needed. Your natal imprint and the current cosmic weather are one and the same.',
    consciousUse:
      'Use this period to set intentions, launch personal projects, and be unashamedly yourself. Your authenticity is amplified — lean into your strengths while staying aware of your shadows.',
  },

  'semi-sextile': {
    whyItFeels: (natal, chamber) =>
      `${chamber} season feels like a subtle shift from your ${natal} nature — close but speaking a slightly different language. There's a sense of adjacency that requires small adjustments.`,
    structuralReason:
      'At 30° separation, signs share a border but differ in element AND modality. This creates gentle friction — not opposition, but the need for constant minor translation.',
    consciousUse:
      'Practice small adaptations. Your neighbor has wisdom you lack, but you\'ll need patience to receive it. Listen for what\'s unfamiliar — that\'s where growth hides.',
  },

  sextile: {
    whyItFeels: (natal, chamber) =>
      `${chamber} season offers natural support to your ${natal} nature. The energies are compatible — like a helpful friend who speaks a related language. Opportunities appear if you engage.`,
    structuralReason:
      'At 60° separation, elements are compatible (Fire-Air or Earth-Water) and modalities complement. This creates flow without effort — but effort is still needed to realize the potential.',
    consciousUse:
      'Don\'t let ease become passivity. Sextiles offer doors — you must walk through them. Actively seek the opportunities this season presents; they won\'t force themselves on you.',
  },

  square: {
    whyItFeels: (natal, chamber) =>
      `${chamber} season creates friction with your ${natal} nature. You share the same modality (both want to move the same way) but your elements clash. This is growth through creative tension.`,
    structuralReason:
      'At 90° separation, signs share modality but differ in element — like two people who both want to lead but toward different goals. The friction is structural, not personal.',
    consciousUse:
      'Resistance builds strength. The tension you feel is your unwitting trainer — it shows you where you need to grow. Don\'t avoid the friction; use it to forge something new.',
  },

  trine: {
    whyItFeels: (natal, chamber) =>
      `${chamber} season feels like a warm embrace for your ${natal} nature. You share the same element — the same language, the same values, the same instinctive approach. Everything flows.`,
    structuralReason:
      'At 120° separation, signs share the same element (Fire-Fire, Earth-Earth, Air-Air, Water-Water). This creates natural harmony — like singing in your native tongue.',
    consciousUse:
      'Don\'t mistake ease for completion. Your trine season confirms your strengths but may not push growth. Use this supportive period to attempt things that usually feel hard.',
  },

  quincunx: {
    whyItFeels: (natal, chamber) =>
      `${chamber} season feels persistently "off" from your ${natal} nature. Nothing aligns — different element, different modality, different season. It's like trying to fit puzzle pieces that almost match.`,
    structuralReason:
      'At 150° separation, signs share NOTHING — different element, different modality, different seasonal position. This creates an awkward fit that requires constant adjustment without resolution.',
    consciousUse:
      'Accept that some periods require work without clicking into place. The quincunx teaches acceptance of discomfort. Don\'t force understanding — practice tolerance of the unfamiliar.',
  },

  opposition: {
    whyItFeels: (natal, chamber) =>
      `${chamber} season is your mirror — the polarity that reflects what you naturally avoid. Your opposite sign contains what you lack. This creates magnetic tension: attraction and resistance.`,
    structuralReason:
      'At 180° separation, signs are direct polarities — complementary pairs that complete each other. Same modality, compatible elements, but approaching from opposite directions.',
    consciousUse:
      'Your opposite season is your greatest teacher. What irritates you about this energy is often what you need to develop. Stop projecting — start integrating.',
  },
};

/**
 * Generate aspect geometry for a natal sign in a given chamber
 */
function generateAspectGeometry(birthSign: SignKey, chamberSign: SignKey): AspectGeometry {
  const angleLesson = getAngleBetweenSigns(birthSign, chamberSign);

  if (!angleLesson) {
    // Fallback for any edge case
    return {
      aspectKey: 'conjunction',
      aspectName: 'Conjunction',
      degrees: 0,
      symbol: '☌',
      whyItFeels: 'This is your own sign energy.',
      structuralReason: 'Same sign energies merge completely.',
      consciousUse: 'Be fully yourself.',
    };
  }

  const interpretation = ASPECT_INTERPRETATIONS[angleLesson.key];

  return {
    aspectKey: angleLesson.key,
    aspectName: angleLesson.name,
    degrees: angleLesson.degrees,
    symbol: angleLesson.symbol,
    whyItFeels: interpretation.whyItFeels(birthSign, chamberSign),
    structuralReason: interpretation.structuralReason,
    consciousUse: interpretation.consciousUse,
  };
}

// =============================================================================
// GUIDANCE GENERATION FUNCTIONS
// =============================================================================

/**
 * Generate guidance for one sign in one seasonal slot
 */
function generateSectionGuidance(
  birthSign: SignKey,
  slot: SeasonalSlot,
  currentSlot: SeasonalSlot
): SeasonalGuidanceSection {
  const birthLesson = SIGN_LESSONS[birthSign];
  const resonance = calculateSeasonalResonance(birthSign, slot);

  const isCurrent = slot.index === currentSlot.index;
  const isBirthSeason = slot.sign === birthSign;
  const isOpposite = ((TROPICAL_ORDER.indexOf(birthSign) + 6) % 12) === slot.index;

  // Get element and modality specific guidance
  const elementFeeling = ELEMENT_IN_PHASE[birthLesson.element][slot.phase];
  const modalityFeeling = MODALITY_IN_PHASE[birthLesson.modality][slot.phase];

  // Build how you feel
  let howYouFeel: string[];
  let whatToDo: string[];
  let watchOutFor: string[];
  let affirmation: string;

  if (isOpposite) {
    // Special opposite sign handling
    const oppositeGuidance = OPPOSITE_SIGN_GUIDANCE[birthSign];
    howYouFeel = oppositeGuidance.howYouFeel;
    whatToDo = oppositeGuidance.whatToDo;
    watchOutFor = oppositeGuidance.watchOutFor;
    affirmation = `In my opposite season, I grow by embracing what I naturally avoid.`;
  } else if (isBirthSeason) {
    // In your own sign's season
    howYouFeel = [
      `This is YOUR season - ${birthSign} energy amplifies your natural gifts`,
      `You feel most yourself, most capable, most aligned`,
      `Others recognize and respond to your authentic power`,
    ];
    whatToDo = [
      'Set major intentions for the year ahead',
      'Start projects that require your unique strengths',
      'Celebrate your birthday season by being fully yourself',
    ];
    watchOutFor = [
      'Overdoing your natural tendencies',
      'Assuming everyone operates like you',
      'Missing shadow work opportunities in your comfort',
    ];
    affirmation = `In my season, I am home. I shine as myself.`;
  } else {
    // Standard seasonal guidance
    howYouFeel = [
      elementFeeling[0],
      modalityFeeling[0],
      `The ${slot.season} ${slot.phase} energy of ${slot.sign} ${resonance.level === 'high' ? 'supports' : resonance.level === 'challenging' ? 'challenges' : 'works with'} your ${birthLesson.element} nature`,
    ];

    whatToDo = [
      elementFeeling[1] || `Work with ${slot.element} energy consciously`,
      modalityFeeling[1] || `Embrace ${slot.phase} phase activities`,
      `Find where ${slot.sign} themes show up in your life`,
    ];

    watchOutFor = [
      elementFeeling[2] || `Resisting ${slot.element} lessons`,
      modalityFeeling[2] || `Fighting the ${slot.phase} rhythm`,
      resonance.level === 'challenging'
        ? `Friction between your ${birthLesson.element} and the current ${slot.element} energy`
        : `Taking this supportive period for granted`,
    ];

    affirmation = resonance.level === 'high'
      ? `The current season amplifies my natural gifts.`
      : resonance.level === 'challenging'
        ? `Growth comes through embracing what feels unfamiliar.`
        : `I adapt and flow with the seasonal rhythm.`;
  }

  // Generate the aspect geometry "why" layer
  const aspectGeometry = generateAspectGeometry(birthSign, slot.sign);

  return {
    slotIndex: slot.index,
    sign: slot.sign,
    season: slot.season,
    phase: slot.phase,
    title: `${slot.season} ${slot.phase.charAt(0).toUpperCase() + slot.phase.slice(1)} (${slot.sign} Season)`,
    dateRange: `${slot.dateRange.start} - ${slot.dateRange.end}`,
    resonance,
    howYouFeel,
    whatToDo,
    watchOutFor,
    affirmation,
    aspectGeometry,
    isCurrent,
    isBirthSeason,
  };
}

/**
 * Generate year theme based on birth sign
 */
function generateYearTheme(birthSign: SignKey): string {
  const themes: Record<SignKey, string> = {
    Aries: 'Your year is about initiating with wisdom, leading with heart.',
    Taurus: 'Your year is about building what lasts, releasing what weighs.',
    Gemini: 'Your year is about connecting deeply, communicating truthfully.',
    Cancer: 'Your year is about nurturing growth, establishing boundaries.',
    Leo: 'Your year is about shining authentically, warming others.',
    Virgo: 'Your year is about refining with love, serving with boundaries.',
    Libra: 'Your year is about relating consciously, choosing decisively.',
    Scorpio: 'Your year is about transforming fearlessly, trusting deeply.',
    Sagittarius: 'Your year is about exploring meaningfully, teaching wisely.',
    Capricorn: 'Your year is about achieving sustainably, resting strategically.',
    Aquarius: 'Your year is about innovating collectively, connecting personally.',
    Pisces: 'Your year is about dreaming practically, surrendering productively.',
  };
  return themes[birthSign];
}

// =============================================================================
// MAIN API
// =============================================================================

/**
 * Build complete 12-section seasonality report
 */
export function buildSeasonalityReport(
  birthDate: Date,
  todayDate: Date = new Date()
): SeasonalityReport {
  const birthSlot = getBirthSeasonalSlot(birthDate);
  const currentSlot = getCurrentSeasonalSlot(todayDate);
  const birthSign = birthSlot.sign;

  const sections = SEASONAL_CALENDAR.map(slot =>
    generateSectionGuidance(birthSign, slot, currentSlot)
  );

  return {
    birthSign,
    birthSlot,
    currentSlot,
    sections,
    currentSectionIndex: currentSlot.index,
    yearTheme: generateYearTheme(birthSign),
  };
}

/**
 * Get just the current section for quick display
 */
export function getCurrentSeasonGuidance(
  birthDate: Date,
  todayDate: Date = new Date()
): SeasonalGuidanceSection {
  const report = buildSeasonalityReport(birthDate, todayDate);
  return report.sections[report.currentSectionIndex];
}

/**
 * Get guidance for a specific sign in a specific slot (for exploration)
 */
export function getSignInSlotGuidance(
  birthSign: SignKey,
  slotIndex: number
): SeasonalGuidanceSection {
  const slot = SEASONAL_CALENDAR[slotIndex];
  const currentSlot = getCurrentSeasonalSlot(new Date());
  return generateSectionGuidance(birthSign, slot, currentSlot);
}

// =============================================================================
// EXPORTS
// =============================================================================

export { SEASONAL_CALENDAR };
export type {
  SignKey,
  Season,
  SeasonPhase,
  Element,
  Modality,
  SeasonalSlot,
  AngleKey,
};
