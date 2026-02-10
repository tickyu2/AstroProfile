/**
 * storyEvent.ts
 *
 * Turns transit events into mythic story beats — narrative moments in
 * the relationship's timeline. Each transit "opens" or "tests" a chamber.
 *
 * Schema + generator. Transit data comes from external computation
 * (Swiss Ephemeris backend). This module shapes it into narrative.
 *
 * GENESIS AstroProfile - February 2026
 */

// =============================================================================
// TYPES
// =============================================================================

export interface TransitEvent {
  date: string;         // "2026-03" or "March 2026"
  label: string;        // "Saturn square Venus"
  impact: Partial<{
    core: number;           // -20 to +20 (delta)
    passion: number;
    communication: number;
    growth: number;
    transformation: number;
  }>;
}

export interface StoryBeat {
  date: string;
  label: string;
  chamber: string;
  direction: 'opens' | 'tests';
  narrative: string;
}

// =============================================================================
// CHAMBER NAMES (human-readable)
// =============================================================================

const CHAMBER_NAMES: Record<string, string> = {
  core: 'identity',
  passion: 'desire',
  communication: 'dialogue',
  growth: 'growth',
  transformation: 'transformation',
};

// =============================================================================
// STORY BEAT GENERATOR
// =============================================================================

/**
 * Convert a single transit event into a mythic story beat.
 * The beat focuses on whichever chamber is most impacted.
 */
export function generateStoryBeat(event: TransitEvent): StoryBeat {
  const entries = Object.entries(event.impact).filter(
    ([, v]) => v != null && v !== 0
  ) as [string, number][];

  if (entries.length === 0) {
    return {
      date: event.date,
      label: event.label,
      chamber: 'core',
      direction: 'tests',
      narrative: `${event.label} creates a subtle ripple across the relationship.`,
    };
  }

  // Find the chamber with the strongest absolute impact
  entries.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  const [chamber, delta] = entries[0];
  const direction = delta > 0 ? 'opens' : 'tests';
  const chamberName = CHAMBER_NAMES[chamber] || chamber;

  // Secondary chamber (if present)
  const secondary = entries.length > 1 ? entries[1] : null;
  const secondaryNote = secondary
    ? `, while echoing through ${CHAMBER_NAMES[secondary[0]] || secondary[0]}`
    : '';

  return {
    date: event.date,
    label: event.label,
    chamber,
    direction,
    narrative: `${event.label} ${direction} the chamber of ${chamberName}${secondaryNote}. ` +
      (direction === 'opens'
        ? 'New possibilities emerge in this area of the bond.'
        : 'This transit asks for conscious attention and deeper awareness.'),
  };
}

/**
 * Build a full story timeline from a list of transit events.
 * Returns story beats sorted by date.
 */
export function buildStoryTimeline(events: TransitEvent[]): StoryBeat[] {
  return events.map(generateStoryBeat);
}
