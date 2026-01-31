/**
 * Event Trigger Overlay
 *
 * Detects relationship-relevant events based on timing layers.
 * Integrates transits, progressions, composite transits,
 * synastry activation, retrograde windows, and lunar triggers.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

// ========================================
// TYPES
// ========================================

export interface EventTriggerInput {
  activeTransits: Transit[];
  activeProgressions?: Progression[];
  compositeTransits?: Transit[];
  synastryActivations?: SynastryActivation[];
  retrogradeWindows?: RetrogradeWindow[];
  lunarTriggers?: LunarTrigger[];
}

export interface Transit {
  planet: string;
  aspect: string;
  natalPoint: string;
  orb: number;
  applying: boolean;
  exact?: Date;
}

export interface Progression {
  progressedPlanet: string;
  aspect: string;
  natalPoint: string;
  orb: number;
}

export interface SynastryActivation {
  aspect: string;
  transitingPlanet: string;
  activatedPoint: string;
  intensity: number; // 0..1
}

export interface RetrogradeWindow {
  planet: string;
  phase: 'pre-shadow' | 'retrograde' | 'post-shadow';
  daysRemaining: number;
}

export interface LunarTrigger {
  type: 'new-moon' | 'full-moon' | 'quarter' | 'eclipse';
  sign: string;
  house?: number;
  daysUntil: number;
}

export interface EventTriggerOverlayResult {
  triggers: EventTrigger[];
  intensity: number;           // 0..1
  eventDelta: number;
  triggerCount: number;
  primaryTrigger: EventTrigger | null;
  eventWindow: EventWindow;
  narrative: string;
  activeThemes: string[];
  urgency: Urgency;
}

export interface EventTrigger {
  id: string;
  type: TriggerType;
  description: string;
  intensity: number;       // 0..1
  timing: 'exact' | 'approaching' | 'separating';
  theme: string;
  advice: string;
}

export type TriggerType =
  | 'transit'
  | 'progression'
  | 'composite-transit'
  | 'synastry-activation'
  | 'retrograde'
  | 'lunar';

export type EventWindow =
  | 'Highly Active'
  | 'Moderately Active'
  | 'Quiet Period'
  | 'Building'
  | 'Peak'
  | 'Releasing';

export type Urgency =
  | 'Time-Sensitive'
  | 'Awareness Needed'
  | 'Background Energy'
  | 'Dormant';

// ========================================
// TRIGGER DETECTION
// ========================================

function detectTransitTriggers(transits: Transit[]): EventTrigger[] {
  const triggers: EventTrigger[] = [];

  const relationshipPlanets = ['Venus', 'Mars', 'Sun', 'Moon', 'Jupiter'];
  const significantAspects = ['conjunction', 'opposition', 'square', 'trine', 'sextile'];

  for (const transit of transits) {
    if (!significantAspects.includes(transit.aspect)) continue;

    const isRelationshipRelevant =
      relationshipPlanets.includes(transit.planet) ||
      ['Venus', 'Mars', 'Moon', 'Descendant', 'Juno'].includes(transit.natalPoint);

    if (!isRelationshipRelevant) continue;

    const intensity = calculateTransitIntensity(transit);
    const theme = getTransitTheme(transit.planet, transit.natalPoint, transit.aspect);
    const timing = transit.applying ? 'approaching' : 'separating';

    triggers.push({
      id: `transit-${transit.planet}-${transit.aspect}-${transit.natalPoint}`,
      type: 'transit',
      description: `${transit.planet} ${transit.aspect} natal ${transit.natalPoint}`,
      intensity,
      timing: transit.orb < 0.5 ? 'exact' : timing,
      theme,
      advice: getTransitAdvice(transit.planet, transit.aspect)
    });
  }

  return triggers;
}

function calculateTransitIntensity(transit: Transit): number {
  // Closer orb = higher intensity
  const orbFactor = Math.max(0, 1 - transit.orb / 10);

  // Applying aspects are more intense
  const applyingFactor = transit.applying ? 1.2 : 0.8;

  // Hard aspects are more intense
  const aspectFactor = ['conjunction', 'opposition', 'square'].includes(transit.aspect) ? 1.2 : 1;

  return Math.min(1, orbFactor * applyingFactor * aspectFactor * 0.7);
}

function detectRetrogradeTriggers(windows: RetrogradeWindow[]): EventTrigger[] {
  const triggers: EventTrigger[] = [];

  for (const window of windows) {
    if (['Mercury', 'Venus', 'Mars'].includes(window.planet)) {
      const intensity = window.phase === 'retrograde' ? 0.8 :
                        window.phase === 'pre-shadow' ? 0.5 : 0.4;

      triggers.push({
        id: `retrograde-${window.planet}`,
        type: 'retrograde',
        description: `${window.planet} ${window.phase}`,
        intensity,
        timing: 'approaching',
        theme: getRetrogradeTheme(window.planet),
        advice: getRetrogradeAdvice(window.planet, window.phase)
      });
    }
  }

  return triggers;
}

function detectLunarTriggers(lunarTriggers: LunarTrigger[]): EventTrigger[] {
  const triggers: EventTrigger[] = [];

  for (const lunar of lunarTriggers) {
    if (lunar.daysUntil > 14) continue; // Only within 2 weeks

    const intensity = lunar.type === 'eclipse' ? 0.9 :
                     lunar.type === 'full-moon' ? 0.7 :
                     lunar.type === 'new-moon' ? 0.6 : 0.4;

    triggers.push({
      id: `lunar-${lunar.type}-${lunar.sign}`,
      type: 'lunar',
      description: `${lunar.type.replace('-', ' ')} in ${lunar.sign}`,
      intensity: intensity * (1 - lunar.daysUntil / 14),
      timing: lunar.daysUntil < 2 ? 'exact' : 'approaching',
      theme: getLunarTheme(lunar.type, lunar.sign),
      advice: getLunarAdvice(lunar.type)
    });
  }

  return triggers;
}

// ========================================
// THEME HELPERS
// ========================================

function getTransitTheme(planet: string, natalPoint: string, aspect: string): string {
  const themes: Record<string, string> = {
    'Venus': 'Love, values, beauty',
    'Mars': 'Action, desire, assertion',
    'Jupiter': 'Expansion, abundance, growth',
    'Saturn': 'Structure, commitment, maturity',
    'Uranus': 'Change, freedom, awakening',
    'Neptune': 'Dreams, spirituality, illusion',
    'Pluto': 'Transformation, power, depth'
  };
  return themes[planet] || 'General activation';
}

function getTransitAdvice(planet: string, aspect: string): string {
  const isHard = ['opposition', 'square'].includes(aspect);

  const advice: Record<string, string> = {
    'Venus': isHard ? 'Navigate value differences carefully' : 'Open to love and connection',
    'Mars': isHard ? 'Channel assertiveness constructively' : 'Take initiative in connection',
    'Jupiter': 'Expand your vision of relationship',
    'Saturn': isHard ? 'Address commitments honestly' : 'Build lasting foundations',
    'Uranus': 'Allow space for unexpected developments',
    'Neptune': isHard ? 'Check perceptions against reality' : 'Trust intuition in connection',
    'Pluto': 'Allow transformation without forcing'
  };
  return advice[planet] || 'Stay present to the energy';
}

function getRetrogradeTheme(planet: string): string {
  const themes: Record<string, string> = {
    'Mercury': 'Communication review, reconnection',
    'Venus': 'Love and value reassessment',
    'Mars': 'Desire and action reflection'
  };
  return themes[planet] || 'Retrograde reflection';
}

function getRetrogradeAdvice(planet: string, phase: string): string {
  if (phase === 'pre-shadow') {
    return `${planet} retrograde approaching—complete pending matters`;
  } else if (phase === 'retrograde') {
    return `${planet} retrograde—review and reflect rather than initiate`;
  }
  return `${planet} moving direct—integrate lessons before new action`;
}

function getLunarTheme(type: string, sign: string): string {
  const baseTheme = type === 'eclipse' ? 'Fated turning point' :
                   type === 'full-moon' ? 'Culmination and release' :
                   type === 'new-moon' ? 'Fresh beginnings' : 'Adjustment';
  return `${baseTheme} in ${sign}`;
}

function getLunarAdvice(type: string): string {
  const advice: Record<string, string> = {
    'new-moon': 'Set intentions for relationship growth',
    'full-moon': 'Release what no longer serves connection',
    'quarter': 'Adjust course as needed',
    'eclipse': 'Major relationship themes emerge—stay present'
  };
  return advice[type] || 'Honor the lunar cycle';
}

// ========================================
// MAIN COMPUTATION
// ========================================

/**
 * Compute event trigger overlay from timing inputs
 */
export function computeEventTriggerOverlay(
  input: EventTriggerInput
): EventTriggerOverlayResult {
  const triggers: EventTrigger[] = [];

  // Detect all trigger types
  triggers.push(...detectTransitTriggers(input.activeTransits));

  if (input.retrogradeWindows) {
    triggers.push(...detectRetrogradeTriggers(input.retrogradeWindows));
  }

  if (input.lunarTriggers) {
    triggers.push(...detectLunarTriggers(input.lunarTriggers));
  }

  // Sort by intensity
  triggers.sort((a, b) => b.intensity - a.intensity);

  // Calculate overall intensity
  const intensity = triggers.length > 0
    ? Math.min(1, triggers.reduce((sum, t) => sum + t.intensity, 0) / 5)
    : 0;

  // Determine event window
  const eventWindow = determineEventWindow(triggers, intensity);

  // Determine urgency
  const urgency = determineUrgency(triggers);

  // Calculate delta
  const eventDelta = intensity * 0.05;

  // Build narrative
  const narrative = buildEventTriggerNarrative(triggers, intensity, eventWindow);

  // Extract active themes
  const activeThemes = [...new Set(triggers.slice(0, 5).map(t => t.theme))];

  return {
    triggers: triggers.slice(0, 10), // Top 10
    intensity,
    eventDelta,
    triggerCount: triggers.length,
    primaryTrigger: triggers[0] || null,
    eventWindow,
    narrative,
    activeThemes,
    urgency
  };
}

function determineEventWindow(triggers: EventTrigger[], intensity: number): EventWindow {
  if (intensity > 0.7) return 'Highly Active';
  if (intensity > 0.5) return 'Moderately Active';
  if (intensity > 0.3) return 'Building';
  if (intensity > 0.1) return 'Quiet Period';
  return 'Quiet Period';
}

function determineUrgency(triggers: EventTrigger[]): Urgency {
  const exactTriggers = triggers.filter(t => t.timing === 'exact');
  const highIntensity = triggers.filter(t => t.intensity > 0.7);

  if (exactTriggers.length > 0 || highIntensity.length > 2) {
    return 'Time-Sensitive';
  }
  if (triggers.filter(t => t.intensity > 0.5).length > 0) {
    return 'Awareness Needed';
  }
  if (triggers.length > 0) {
    return 'Background Energy';
  }
  return 'Dormant';
}

function buildEventTriggerNarrative(
  triggers: EventTrigger[],
  intensity: number,
  window: EventWindow
): string {
  if (triggers.length === 0) {
    return 'No major relational triggers active at this time. The cosmic weather is quiet—a good time for maintenance and reflection.';
  }

  const primary = triggers[0];
  let narrative = `Active relational triggers detected (${Math.round(intensity * 100)}% intensity). `;
  narrative += `The event window is ${window.toLowerCase()}. `;
  narrative += `Primary trigger: ${primary.description}—${primary.theme.toLowerCase()}. `;
  narrative += primary.advice;

  if (triggers.length > 1) {
    narrative += ` Additionally, ${triggers.length - 1} other triggers are active.`;
  }

  return narrative;
}

// ========================================
// PERSONA VOICES
// ========================================

export const EventTriggerPersonaVoices: Record<EventWindow, {
  mentor: string;
  oracle: string;
  companion: string;
  mirror: string;
}> = {
  'Highly Active': {
    mentor: 'Multiple activations demand your attention. Move mindfully; what happens now echoes.',
    oracle: 'The cosmic gates stand open. The threads of fate are sensitive—tread with intention.',
    companion: 'Lots happening right now! Stay present and don\'t make reactive decisions.',
    mirror: 'Notice the density of events. This intensity asks for your conscious participation.'
  },
  'Moderately Active': {
    mentor: 'Enough activity to warrant attention, not so much to overwhelm. Use this energy.',
    oracle: 'The celestial currents stir. Significant but not urgent—engage with awareness.',
    companion: 'Some things are definitely in motion. Pay attention but don\'t stress.',
    mirror: 'Notice the moderate activation. This is invitation, not demand.'
  },
  'Building': {
    mentor: 'Energy is gathering. What you plant now will bloom when triggers peak.',
    oracle: 'The storm approaches on the horizon. Prepare the vessel; the winds are coming.',
    companion: 'Things are building up. Good time to prepare for what\'s coming.',
    mirror: 'Notice the gathering energy. Something is approaching—meet it prepared.'
  },
  'Quiet Period': {
    mentor: 'The quiet is a gift. Use this pause for integration and gentle nurturing.',
    oracle: 'The stars whisper rather than shout. In the silence, subtle guidance can be heard.',
    companion: 'Things are pretty quiet right now. Enjoy the peace and recharge.',
    mirror: 'Notice the stillness. This pause is not emptiness but presence.'
  },
  'Peak': {
    mentor: 'You are at the peak of activation. What manifests now carries significance.',
    oracle: 'The moment of maximum activation. The patterns crystallize—witness their form.',
    companion: 'This is the peak! What happens now really matters.',
    mirror: 'Notice the culmination point. This is when things become visible.'
  },
  'Releasing': {
    mentor: 'The peak has passed. Now is the time to integrate lessons and release what served.',
    oracle: 'The wave recedes, leaving treasures on the shore. Gather what wisdom remains.',
    companion: 'The intensity is easing. Take time to process what just happened.',
    mirror: 'Notice the release. What needed to happen has happened—now integrate.'
  }
};

/**
 * Get event trigger persona voice
 */
export function getEventTriggerPersonaVoice(
  result: EventTriggerOverlayResult,
  role: 'mentor' | 'oracle' | 'companion' | 'mirror'
): string {
  return EventTriggerPersonaVoices[result.eventWindow][role];
}

// ========================================
// PILGRIM JOURNEY CHAMBER
// ========================================

export interface EventTriggerChamber {
  id: string;
  name: string;
  description: string;
  window: EventWindow;
}

export const EventTriggerChambers: Record<EventWindow, EventTriggerChamber> = {
  'Highly Active': {
    id: 'nexus-of-convergence',
    name: 'The Nexus of Convergence',
    description: 'You stand in the Nexus of Convergence, where multiple cosmic threads cross and interweave. Here, every action ripples; every word carries weight.',
    window: 'Highly Active'
  },
  'Moderately Active': {
    id: 'hall-of-gentle-currents',
    name: 'The Hall of Gentle Currents',
    description: 'You walk through the Hall of Gentle Currents, where cosmic winds blow but do not overwhelm. Here, you can engage with timing without urgency.',
    window: 'Moderately Active'
  },
  'Building': {
    id: 'chamber-of-gathering-storms',
    name: 'The Chamber of Gathering Storms',
    description: 'You enter the Chamber of Gathering Storms, where energy accumulates on the horizon. Here, preparation meets anticipation.',
    window: 'Building'
  },
  'Quiet Period': {
    id: 'sanctuary-of-stillness',
    name: 'The Sanctuary of Stillness',
    description: 'You rest in the Sanctuary of Stillness, where cosmic activity pauses to breathe. Here, integration and reflection are the work.',
    window: 'Quiet Period'
  },
  'Peak': {
    id: 'summit-of-manifestation',
    name: 'The Summit of Manifestation',
    description: 'You stand at the Summit of Manifestation, where cosmic energy reaches its zenith. Here, what was potential becomes actual.',
    window: 'Peak'
  },
  'Releasing': {
    id: 'shore-of-returning-tides',
    name: 'The Shore of Returning Tides',
    description: 'You walk the Shore of Returning Tides, where the wave recedes and leaves its gifts. Here, gathering wisdom from what was.',
    window: 'Releasing'
  }
};

/**
 * Get event trigger chamber narrative
 */
export function getEventTriggerChamberNarrative(result: EventTriggerOverlayResult): string {
  const chamber = EventTriggerChambers[result.eventWindow];
  return chamber.description;
}
