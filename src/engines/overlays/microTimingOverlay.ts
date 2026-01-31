/**
 * Micro-Timing Overlay
 *
 * Hour-level and day-level timing windows - the "weather" of the moment.
 * Integrates lunar hours, planetary hours, daily stems/branches,
 * micro-transits, and emotional weather patterns.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

// ========================================
// TYPES
// ========================================

export interface MicroTimingInput {
  lunarHourScore: number;      // 0..1 - quality of current lunar hour
  planetaryHourScore: number;  // 0..1 - quality of current planetary hour
  dailyQiScore: number;        // 0..1 - quality of daily stems/branches
  currentPlanetaryHour?: string; // e.g., "Venus Hour"
  currentLunarDay?: number;    // 1-30 of lunar month
  dayOfWeek?: string;          // For planetary day rulership
  emotionalWeather?: EmotionalWeather;
}

export interface EmotionalWeather {
  currentMood: number;         // 0..1
  recentTrend: 'rising' | 'stable' | 'falling';
  volatility: number;          // 0..1
}

export interface MicroTimingOverlayResult {
  microWindow: MicroWindow;
  microScore: number;          // 0..1
  microDelta: number;
  hourQuality: HourQuality;
  dayQuality: DayQuality;
  optimalActions: string[];
  avoidActions: string[];
  narrative: string;
  currentAdvice: string;
  nextShift: string;
}

export type MicroWindow =
  | 'Open'           // Excellent for connection/action
  | 'Favorable'      // Good conditions
  | 'Neutral'        // Neither supporting nor challenging
  | 'Challenging'    // Requires extra care
  | 'Closed';        // Avoid initiating

export type HourQuality =
  | 'Venus Hour'     // Love and connection
  | 'Mercury Hour'   // Communication
  | 'Moon Hour'      // Emotions and nurturing
  | 'Sun Hour'       // Leadership and visibility
  | 'Mars Hour'      // Action and assertion
  | 'Jupiter Hour'   // Expansion and opportunity
  | 'Saturn Hour';   // Structure and commitment

export type DayQuality =
  | 'Excellent'
  | 'Good'
  | 'Moderate'
  | 'Challenging'
  | 'Difficult';

// ========================================
// PLANETARY HOUR DATA
// ========================================

const PLANETARY_HOUR_MEANINGS: Record<string, {
  energy: string;
  optimal: string[];
  avoid: string[];
  relationshipAdvice: string;
}> = {
  'Venus Hour': {
    energy: 'Love, beauty, harmony',
    optimal: ['romantic gestures', 'reconciliation', 'expressing appreciation', 'creating together'],
    avoid: ['difficult confrontations', 'ending relationships'],
    relationshipAdvice: 'Ideal time for connection, affection, and expressing love.'
  },
  'Mercury Hour': {
    energy: 'Communication, clarity, exchange',
    optimal: ['important conversations', 'clarifying misunderstandings', 'planning together'],
    avoid: ['emotional processing', 'major commitments'],
    relationshipAdvice: 'Good for talking things through and sharing ideas.'
  },
  'Moon Hour': {
    energy: 'Emotion, intuition, nurturing',
    optimal: ['emotional bonding', 'caregiving', 'intimate sharing', 'intuitive decisions'],
    avoid: ['logical negotiations', 'confrontations'],
    relationshipAdvice: 'Allow emotions to flow; nurture the connection.'
  },
  'Sun Hour': {
    energy: 'Vitality, visibility, leadership',
    optimal: ['public appearances together', 'celebrations', 'bold moves'],
    avoid: ['behind-scenes work', 'vulnerable sharing'],
    relationshipAdvice: 'Shine together; celebrate your connection publicly.'
  },
  'Mars Hour': {
    energy: 'Action, passion, assertion',
    optimal: ['physical activity together', 'taking initiative', 'clearing the air'],
    avoid: ['relaxation', 'passive activities'],
    relationshipAdvice: 'Channel energy actively; don\'t let tension simmer.'
  },
  'Jupiter Hour': {
    energy: 'Expansion, abundance, generosity',
    optimal: ['making plans', 'generous gestures', 'exploring new things together'],
    avoid: ['restriction', 'negativity'],
    relationshipAdvice: 'Think big; expand your vision of what\'s possible together.'
  },
  'Saturn Hour': {
    energy: 'Structure, commitment, maturity',
    optimal: ['serious discussions', 'making commitments', 'setting boundaries'],
    avoid: ['lightness', 'spontaneous play'],
    relationshipAdvice: 'Good for establishing foundations and having mature conversations.'
  }
};

const LUNAR_DAY_ENERGY: Record<number, { quality: DayQuality; focus: string }> = {
  1: { quality: 'Good', focus: 'New beginnings' },
  2: { quality: 'Good', focus: 'Building momentum' },
  3: { quality: 'Excellent', focus: 'Action and initiative' },
  4: { quality: 'Good', focus: 'Establishing foundations' },
  5: { quality: 'Moderate', focus: 'Adjustment needed' },
  6: { quality: 'Excellent', focus: 'Harmony and connection' },
  7: { quality: 'Good', focus: 'Achievement' },
  8: { quality: 'Challenging', focus: 'Review and reconsider' },
  9: { quality: 'Good', focus: 'Completion' },
  10: { quality: 'Excellent', focus: 'Peak energy' },
  11: { quality: 'Good', focus: 'Expansion' },
  12: { quality: 'Moderate', focus: 'Rest' },
  13: { quality: 'Excellent', focus: 'Abundance' },
  14: { quality: 'Excellent', focus: 'Full illumination' },
  15: { quality: 'Good', focus: 'Release begins' },
  16: { quality: 'Moderate', focus: 'Letting go' },
  17: { quality: 'Good', focus: 'Inner work' },
  18: { quality: 'Challenging', focus: 'Reflection' },
  19: { quality: 'Moderate', focus: 'Processing' },
  20: { quality: 'Good', focus: 'Integration' },
  21: { quality: 'Moderate', focus: 'Deepening' },
  22: { quality: 'Challenging', focus: 'Challenges surface' },
  23: { quality: 'Difficult', focus: 'Low energy' },
  24: { quality: 'Moderate', focus: 'Preparation' },
  25: { quality: 'Good', focus: 'Wisdom gathering' },
  26: { quality: 'Challenging', focus: 'Release' },
  27: { quality: 'Good', focus: 'Completion' },
  28: { quality: 'Moderate', focus: 'Rest' },
  29: { quality: 'Challenging', focus: 'Dark moon transition' },
  30: { quality: 'Moderate', focus: 'New cycle approaching' }
};

// ========================================
// MAIN COMPUTATION
// ========================================

/**
 * Compute micro-timing overlay from timing inputs
 */
export function computeMicroTimingOverlay(input: MicroTimingInput): MicroTimingOverlayResult {
  // Calculate composite micro score
  const baseScore = (
    input.lunarHourScore +
    input.planetaryHourScore +
    input.dailyQiScore
  ) / 3;

  // Adjust for emotional weather if provided
  let emotionalModifier = 0;
  if (input.emotionalWeather) {
    emotionalModifier = (input.emotionalWeather.currentMood - 0.5) * 0.2;
    if (input.emotionalWeather.volatility > 0.7) {
      emotionalModifier -= 0.1; // High volatility is challenging
    }
  }

  const microScore = Math.max(0, Math.min(1, baseScore + emotionalModifier));

  // Determine micro window
  const microWindow = determineMicroWindow(microScore);

  // Get hour quality
  const hourQuality = (input.currentPlanetaryHour as HourQuality) || 'Moon Hour';
  const hourInfo = PLANETARY_HOUR_MEANINGS[hourQuality] || PLANETARY_HOUR_MEANINGS['Moon Hour'];

  // Get day quality from lunar day
  const lunarDayInfo = input.currentLunarDay
    ? LUNAR_DAY_ENERGY[input.currentLunarDay] || { quality: 'Moderate', focus: 'General' }
    : { quality: 'Moderate' as DayQuality, focus: 'General' };
  const dayQuality = lunarDayInfo.quality;

  // Calculate delta
  const microDelta = (microScore - 0.5) * 0.04;

  // Build lists
  const optimalActions = [...hourInfo.optimal];
  const avoidActions = [...hourInfo.avoid];

  // Adjust for window
  if (microWindow === 'Closed' || microWindow === 'Challenging') {
    optimalActions.length = 0;
    optimalActions.push('reflection', 'patience', 'self-care');
  }

  // Build narrative
  const narrative = buildMicroTimingNarrative(
    microWindow, hourQuality, dayQuality, microScore, hourInfo, lunarDayInfo
  );

  // Current advice
  const currentAdvice = hourInfo.relationshipAdvice;

  // Next shift (simplified)
  const nextShift = getNextShift(microWindow);

  return {
    microWindow,
    microScore,
    microDelta,
    hourQuality,
    dayQuality,
    optimalActions: optimalActions.slice(0, 4),
    avoidActions: avoidActions.slice(0, 3),
    narrative,
    currentAdvice,
    nextShift
  };
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function determineMicroWindow(score: number): MicroWindow {
  if (score > 0.8) return 'Open';
  if (score > 0.6) return 'Favorable';
  if (score > 0.4) return 'Neutral';
  if (score > 0.2) return 'Challenging';
  return 'Closed';
}

function buildMicroTimingNarrative(
  window: MicroWindow,
  hourQuality: HourQuality,
  dayQuality: DayQuality,
  score: number,
  hourInfo: typeof PLANETARY_HOUR_MEANINGS[string],
  lunarDayInfo: { quality: DayQuality; focus: string }
): string {
  const scorePercent = Math.round(score * 100);

  let narrative = `The micro-timing window is ${window.toLowerCase()} (${scorePercent}% favorable). `;
  narrative += `Current planetary hour: ${hourQuality}—energy of ${hourInfo.energy.toLowerCase()}. `;
  narrative += `Today's quality is ${dayQuality.toLowerCase()}, with focus on ${lunarDayInfo.focus.toLowerCase()}. `;

  if (window === 'Open' || window === 'Favorable') {
    narrative += 'This is a supportive moment for connection and action.';
  } else if (window === 'Neutral') {
    narrative += 'Proceed with awareness; neither strongly supported nor challenged.';
  } else {
    narrative += 'Patience recommended; wait for better timing if possible.';
  }

  return narrative;
}

function getNextShift(currentWindow: MicroWindow): string {
  switch (currentWindow) {
    case 'Open':
      return 'Window will remain favorable for the next few hours.';
    case 'Favorable':
      return 'Good conditions continuing; watch for hour shifts.';
    case 'Neutral':
      return 'Conditions may improve or worsen at next hour change.';
    case 'Challenging':
      return 'Better conditions approaching; patience yields timing.';
    case 'Closed':
      return 'Wait for the window to open; significant time may be needed.';
    default:
      return 'Monitor conditions for shifts.';
  }
}

// ========================================
// PERSONA VOICES
// ========================================

export const MicroTimingPersonaVoices: Record<MicroWindow, {
  mentor: string;
  oracle: string;
  companion: string;
  mirror: string;
}> = {
  'Open': {
    mentor: 'The moment is ripe. What you do now finds fertile ground. Act with intention.',
    oracle: 'The gates of timing stand open. Walk through with presence; this window closes.',
    companion: 'This is a great moment! Whatever you want to do together, now\'s the time.',
    mirror: 'Notice the support in this moment. The window is open—will you step through?'
  },
  'Favorable': {
    mentor: 'Good conditions favor your connection. Move forward with confidence.',
    oracle: 'The cosmic weather smiles softly. Not peak, but favorable—proceed.',
    companion: 'Things feel good right now. Go ahead with what you had in mind.',
    mirror: 'Notice the gentle support around you. This favorability invites action.'
  },
  'Neutral': {
    mentor: 'Neither wind nor calm. Your intention matters most when timing is neutral.',
    oracle: 'The scales are balanced. Your choice tips them—what do you bring?',
    companion: 'Things are pretty neutral. Success depends more on you than the timing right now.',
    mirror: 'Notice the neutrality. This is agency territory—your energy defines the outcome.'
  },
  'Challenging': {
    mentor: 'Swim against the current only if necessary. Patience often outperforms persistence.',
    oracle: 'The waters run contrary. Extra effort yields modest gains; rest yields renewal.',
    companion: 'Timing\'s not ideal. If you can wait, wait. If you can\'t, proceed carefully.',
    mirror: 'Notice the resistance in this moment. It\'s information, not punishment.'
  },
  'Closed': {
    mentor: 'The door is closed for now. Honor this by tending to what requires no timing.',
    oracle: 'The cosmic shutters draw tight. This is not the hour. Wait for the wheel to turn.',
    companion: 'Not a great time for anything important. Rest, reflect, and wait it out.',
    mirror: 'Notice the closure. This pause is protection—use it to gather rather than push.'
  }
};

/**
 * Get micro-timing persona voice
 */
export function getMicroTimingPersonaVoice(
  result: MicroTimingOverlayResult,
  role: 'mentor' | 'oracle' | 'companion' | 'mirror'
): string {
  return MicroTimingPersonaVoices[result.microWindow][role];
}

// ========================================
// PILGRIM JOURNEY CHAMBER
// ========================================

export interface MicroTimingChamber {
  id: string;
  name: string;
  description: string;
  window: MicroWindow;
}

export const MicroTimingChambers: Record<MicroWindow, MicroTimingChamber> = {
  'Open': {
    id: 'gate-of-perfect-timing',
    name: 'The Gate of Perfect Timing',
    description: 'You pass through the Gate of Perfect Timing, where every step lands exactly right. Here, action and timing merge into one effortless flow.',
    window: 'Open'
  },
  'Favorable': {
    id: 'garden-of-gentle-support',
    name: 'The Garden of Gentle Support',
    description: 'You walk through the Garden of Gentle Support, where conditions favor without demanding. Here, good timing gently lifts your actions.',
    window: 'Favorable'
  },
  'Neutral': {
    id: 'crossroads-of-will',
    name: 'The Crossroads of Will',
    description: 'You stand at the Crossroads of Will, where timing neither helps nor hinders. Here, your intention alone shapes what happens.',
    window: 'Neutral'
  },
  'Challenging': {
    id: 'passage-of-contrary-winds',
    name: 'The Passage of Contrary Winds',
    description: 'You walk the Passage of Contrary Winds, where the timing pushes back. Here, patience and persistence are tested.',
    window: 'Challenging'
  },
  'Closed': {
    id: 'sanctuary-of-waiting',
    name: 'The Sanctuary of Waiting',
    description: 'You rest in the Sanctuary of Waiting, where the doors are sealed until the hour changes. Here, stillness is the only right action.',
    window: 'Closed'
  }
};

/**
 * Get micro-timing chamber narrative
 */
export function getMicroTimingChamberNarrative(result: MicroTimingOverlayResult): string {
  const chamber = MicroTimingChambers[result.microWindow];
  return chamber.description;
}

// ========================================
// TIMING HELPERS
// ========================================

/**
 * Get current planetary hour (simplified calculation)
 */
export function getCurrentPlanetaryHour(dayOfWeek: string, hourOfDay: number): HourQuality {
  const dayRulers: Record<string, string> = {
    'Sunday': 'Sun',
    'Monday': 'Moon',
    'Tuesday': 'Mars',
    'Wednesday': 'Mercury',
    'Thursday': 'Jupiter',
    'Friday': 'Venus',
    'Saturday': 'Saturn'
  };

  const planetaryOrder = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];

  const dayRuler = dayRulers[dayOfWeek] || 'Sun';
  const startIndex = planetaryOrder.indexOf(dayRuler);
  const hourIndex = (startIndex + hourOfDay) % 7;
  const hourPlanet = planetaryOrder[hourIndex];

  return `${hourPlanet} Hour` as HourQuality;
}
