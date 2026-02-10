/**
 * destinyStorybook.ts
 *
 * Auto-generates a multi-chapter relationship myth from available data:
 *   - Composite Archetype + Destiny Archetype
 *   - Five chamber scores + mythic path
 *   - Composite midpoint chart (optional)
 *   - Story timeline events (optional, from transit data)
 *
 * The storybook adapts to whatever data is available —
 * always generates at least a prologue + 2 chapters + epilogue.
 *
 * GENESIS AstroProfile - February 2026
 */

import type { CompositeArchetype } from './compositeArchetype';
import type { DestinyArchetype } from './destinyArchetype';
import type { CompositePoint } from './compositeMidpoint';
import type { StoryBeat } from './storyEvent';

// =============================================================================
// TYPES
// =============================================================================

export interface StorybookChapter {
  title: string;
  body: string;
}

export interface DestinyStorybook {
  title: string;
  prologue: string;
  chapters: StorybookChapter[];
  epilogue: string;
}

export interface StorybookInput {
  nameA: string;
  nameB: string;
  compositeArchetype: CompositeArchetype;
  destinyArchetype: DestinyArchetype;
  mythicPath: string;       // e.g. "The Path of Recognition"
  chambers: {
    key: string;
    label: string;
    score: number;
    narrative: string;
  }[];
  compositePoints?: CompositePoint[];   // midpoint chart planets (optional)
  storyBeats?: StoryBeat[];             // transit story events (optional)
}

// =============================================================================
// SIGN/PLANET HUMANIZERS
// =============================================================================

const ARCHETYPE_METAPHORS: Record<CompositeArchetype, string> = {
  'Twin Flames': 'a mirror held up to the soul, reflecting back what had always been waiting',
  'Builders': 'a cathedral whose blueprints were drawn before either of you knew the other existed',
  'Storm-Walkers': 'a storm that strips away everything except what is real',
  'Alchemists': 'a crucible where pressure itself becomes the philosopher\u2019s stone',
  'Companions': 'a road walked side by side, where the rhythm of shared steps becomes a song',
  'Catalysts': 'a spark that ignites transformation \u2014 not gentle, but necessary',
};

const DESTINY_CLOSINGS: Record<DestinyArchetype, string> = {
  'The Long Arc': 'The arc bends slowly, but it bends toward shared purpose. This is a story that deepens with every chapter.',
  'The Phoenix Cycle': 'What burns away is never the truth. Each cycle leaves behind something more luminous than before.',
  'The Spiral Path': 'The spiral does not repeat \u2014 it returns at a higher elevation. Every theme revisited becomes wisdom.',
  'The Convergence': 'Two rivers meeting the sea. The convergence was not accidental \u2014 it was gravitational.',
  'The Threshold Walkers': 'At every threshold, you choose again. The courage to cross together is the story itself.',
};

// =============================================================================
// CHAPTER BUILDERS
// =============================================================================

function buildChapterI(input: StorybookInput): StorybookChapter {
  const { nameA, nameB, compositeArchetype, mythicPath } = input;
  const metaphor = ARCHETYPE_METAPHORS[compositeArchetype];

  return {
    title: 'Chapter I \u2014 The Meeting of Patterns',
    body:
      `When ${nameA} and ${nameB} first encountered each other, ` +
      `the patterns of their lives had already been moving toward this moment. ` +
      `Their connection carried the signature of ${compositeArchetype} \u2014 ` +
      `${metaphor}. ` +
      `The mythic path they would walk together was ${mythicPath}, ` +
      `a road that would reveal itself one step at a time.`,
  };
}

function buildChapterII(input: StorybookInput): StorybookChapter {
  const { chambers } = input;
  const sorted = [...chambers].sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const middle = sorted[Math.floor(sorted.length / 2)];

  return {
    title: 'Chapter II \u2014 The Five Chambers',
    body:
      `Every relationship is a house with many rooms. ` +
      `In this bond, the brightest chamber is ${strongest.label} (${strongest.score}%) \u2014 ` +
      `${strongest.narrative.toLowerCase()} ` +
      `Here, the connection flows most naturally. ` +
      `The quietest chamber is ${weakest.label} (${weakest.score}%), ` +
      `where the deepest growth lives \u2014 not as weakness, but as invitation. ` +
      `Between them, ${middle.label} (${middle.score}%) holds the rhythm of day-to-day connection, ` +
      `a steady pulse that sustains what the extremes ignite and temper.`,
  };
}

function buildChapterIII(input: StorybookInput): StorybookChapter | null {
  const { compositePoints } = input;
  if (!compositePoints || compositePoints.length < 3) return null;

  const sun = compositePoints.find(p => p.name === 'Sun');
  const moon = compositePoints.find(p => p.name === 'Moon');
  const venus = compositePoints.find(p => p.name === 'Venus');

  if (!sun || !moon) return null;

  const venusNote = venus
    ? ` Venus settles in ${venus.sign} at ${Math.floor(venus.degree)}\u00B0, coloring the way love expresses itself.`
    : '';

  return {
    title: 'Chapter III \u2014 The Shared Constellation',
    body:
      `When the two charts merge into one, a new constellation appears \u2014 ` +
      `the composite map of who they become together. ` +
      `The composite Sun rests in ${sun.sign} at ${Math.floor(sun.degree)}\u00B0, ` +
      `defining the shared identity of the relationship. ` +
      `The composite Moon in ${moon.sign} at ${Math.floor(moon.degree)}\u00B0 ` +
      `reveals the emotional core \u2014 how they nurture, protect, and feel safe together.` +
      venusNote,
  };
}

function buildChapterIV(input: StorybookInput): StorybookChapter {
  const { chambers, nameA, nameB } = input;
  const sorted = [...chambers].sort((a, b) => a.score - b.score);
  const growth1 = sorted[0];
  const growth2 = sorted.length > 1 ? sorted[1] : null;

  const secondNote = growth2
    ? ` Similarly, ${growth2.label} (${growth2.score}%) asks for patience and presence \u2014 ` +
      `not perfection, but willingness to show up.`
    : '';

  return {
    title: 'Chapter IV \u2014 The Inner Work',
    body:
      `No myth is complete without its trials. ` +
      `For ${nameA} and ${nameB}, the invitation to grow lives most clearly ` +
      `in the chamber of ${growth1.label} (${growth1.score}%). ` +
      `This is not a flaw \u2014 it is the doorway through which the relationship evolves. ` +
      `The work here is to bring conscious attention where habit would avoid it.` +
      secondNote +
      ` Every relationship that endures must face its quiet chambers with courage.`,
  };
}

function buildChapterV(input: StorybookInput): StorybookChapter | null {
  const { storyBeats } = input;
  if (!storyBeats || storyBeats.length === 0) return null;

  const beats = storyBeats.slice(0, 4);
  const beatLines = beats
    .map(b => `${b.date}: ${b.narrative}`)
    .join(' ');

  return {
    title: 'Chapter V \u2014 The Turning of the Sky',
    body:
      `As the planets moved through the sky, they shaped the relationship\u2019s seasons. ` +
      beatLines +
      ` Each transit became a chapter in the shared story \u2014 ` +
      `some opening doors, others asking hard questions. ` +
      `Together, they formed the rhythm of a bond that lives in time.`,
  };
}

// =============================================================================
// MAIN BUILDER
// =============================================================================

export function buildDestinyStorybook(input: StorybookInput): DestinyStorybook {
  const { nameA, nameB, compositeArchetype, destinyArchetype } = input;

  const title = `${destinyArchetype}: The Myth of ${nameA} & ${nameB}`;

  const prologue =
    `Two paths converged under the sign of ${compositeArchetype}. ` +
    `Their bond carried the signature of ${destinyArchetype} \u2014 ` +
    `a pattern written not in fate alone, but in the chambers of identity, ` +
    `desire, communication, growth, and transformation. ` +
    `This is their story, told in the language of the stars.`;

  const chapters: StorybookChapter[] = [
    buildChapterI(input),
    buildChapterII(input),
  ];

  // Optional chapters (based on available data)
  const chIII = buildChapterIII(input);
  if (chIII) chapters.push(chIII);

  chapters.push(buildChapterIV(input));

  const chV = buildChapterV(input);
  if (chV) chapters.push(chV);

  const epilogue =
    `And so the story of ${nameA} and ${nameB} continues. ` +
    DESTINY_CLOSINGS[destinyArchetype] +
    ` The myth is not finished \u2014 it is being lived.`;

  return { title, prologue, chapters, epilogue };
}
