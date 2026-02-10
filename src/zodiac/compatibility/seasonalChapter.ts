/**
 * seasonalChapter.ts
 *
 * Groups transit story beats into seasonal narrative arcs.
 * Each season (Winter, Spring, Summer, Autumn) becomes a chapter
 * with a theme derived from its transit events.
 *
 * Requires transit data — will produce empty result without it.
 * Ready to wire when Swiss Ephemeris backend provides transit events.
 *
 * GENESIS AstroProfile - February 2026
 */

import type { StoryBeat } from './storyEvent';

// =============================================================================
// TYPES
// =============================================================================

export interface SeasonalChapter {
  season: string;    // "Spring 2026"
  theme: string;     // "A Season of Expansion"
  summary: string;
  events: StoryBeat[];
}

// =============================================================================
// SEASON CLASSIFIER
// =============================================================================

function getSeasonFromDate(dateStr: string): string {
  // Supports "2026-03", "March 2026", or "2026-03-15"
  const parts = dateStr.split('-');
  let year = '';
  let month = 0;

  if (parts.length >= 2 && parts[0].length === 4) {
    year = parts[0];
    month = parseInt(parts[1], 10);
  } else {
    // Fallback: try parsing as date
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      year = String(d.getFullYear());
      month = d.getMonth() + 1;
    } else {
      return `Season (${dateStr})`;
    }
  }

  if (month <= 2 || month === 12) return `Winter ${year}`;
  if (month <= 5) return `Spring ${year}`;
  if (month <= 8) return `Summer ${year}`;
  return `Autumn ${year}`;
}

// =============================================================================
// THEME CLASSIFIER
// =============================================================================

function classifyTheme(events: StoryBeat[]): string {
  const openings = events.filter(e => e.direction === 'opens').length;
  const tests = events.filter(e => e.direction === 'tests').length;

  if (openings > tests * 2) return 'A Season of Expansion';
  if (tests > openings * 2) return 'A Season of Initiation';
  if (openings > tests) return 'A Season of Growth';
  if (tests > openings) return 'A Season of Deepening';
  return 'A Season of Integration';
}

// =============================================================================
// BUILDER
// =============================================================================

/**
 * Build seasonal chapters from a list of story beats.
 * Groups beats by astronomical season and assigns a narrative theme.
 */
export function buildSeasonalChapters(beats: StoryBeat[]): SeasonalChapter[] {
  if (beats.length === 0) return [];

  const bySeason = new Map<string, StoryBeat[]>();

  for (const beat of beats) {
    const season = getSeasonFromDate(beat.date);
    if (!bySeason.has(season)) {
      bySeason.set(season, []);
    }
    bySeason.get(season)!.push(beat);
  }

  const chapters: SeasonalChapter[] = [];

  for (const [season, events] of bySeason) {
    const theme = classifyTheme(events);
    const labels = events.map(e => e.label).join(', ');
    const summary =
      `This season carried ${theme.toLowerCase().replace('a season of ', '')}. ` +
      `Key transits: ${labels}.`;

    chapters.push({ season, theme, summary, events });
  }

  return chapters;
}
