/**
 * relationshipOracle.ts
 *
 * Chamber-aware Q&A engine for relationship questions.
 * Routes questions to the most relevant chamber(s), then generates
 * answers grounded in actual compatibility data + archetype narrative.
 *
 * GENESIS AstroProfile - February 2026
 */

import type { CompositeArchetype } from './compositeArchetype';
import type { DestinyArchetype } from './destinyArchetype';

// =============================================================================
// TYPES
// =============================================================================

export interface OracleInput {
  nameA: string;
  nameB: string;
  chambers: {
    key: string;
    label: string;
    score: number;
    narrative: string;
  }[];
  compositeArchetype: CompositeArchetype;
  destinyArchetype: DestinyArchetype;
  mythicPath: string;
}

export interface OracleAnswer {
  chamber: string;       // which chamber answered
  chamberIcon: string;
  chamberColor: string;
  score: number;
  title: string;         // answer heading
  body: string;          // full narrative answer
  guidance: string;      // practical guidance line
}

// =============================================================================
// QUESTION ROUTING — keyword → chamber mapping
// =============================================================================

const CHAMBER_KEYWORDS: Record<string, string[]> = {
  core: [
    'identity', 'who we are', 'foundation', 'core', 'soul', 'essence',
    'compatible', 'compatibility', 'right for', 'meant to be', 'soulmate',
    'connection', 'bond', 'why are we', 'purpose',
  ],
  passion: [
    'passion', 'desire', 'chemistry', 'attraction', 'physical', 'intimate',
    'sex', 'spark', 'fire', 'magnetic', 'romance', 'venus', 'mars',
    'love language', 'affection', 'touch',
  ],
  communication: [
    'communicate', 'communication', 'talk', 'listen', 'understand',
    'argue', 'fight', 'conflict', 'disagree', 'misunderstand',
    'express', 'words', 'silence', 'mercury', 'conversation',
  ],
  growth: [
    'grow', 'growth', 'future', 'plan', 'build', 'commit', 'commitment',
    'marriage', 'long-term', 'jupiter', 'saturn', 'career', 'money',
    'goals', 'vision', 'stability', 'structure', 'trust',
  ],
  transformation: [
    'transform', 'change', 'challenge', 'crisis', 'heal', 'healing',
    'shadow', 'power', 'control', 'pluto', 'uranus', 'neptune',
    'break', 'evolve', 'fear', 'deep', 'intense', 'trigger',
  ],
};

const CHAMBER_META: Record<string, { icon: string; color: string }> = {
  core:           { icon: '\u2609', color: '#f97316' },
  passion:        { icon: '\u2640', color: '#ec4899' },
  communication:  { icon: '\u263F', color: '#f59e0b' },
  growth:         { icon: '\u2643', color: '#14b8a6' },
  transformation: { icon: '\u2645', color: '#a855f7' },
};

/**
 * Route a question to the most relevant chamber by keyword matching.
 * Returns 'core' as default if no strong match.
 */
function routeQuestion(question: string): string {
  const q = question.toLowerCase();
  const scores: Record<string, number> = {};

  for (const [chamber, keywords] of Object.entries(CHAMBER_KEYWORDS)) {
    scores[chamber] = keywords.filter(kw => q.includes(kw)).length;
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return best[0][1] > 0 ? best[0][0] : 'core';
}

// =============================================================================
// ANSWER TEMPLATES — keyed by chamber + score range
// =============================================================================

interface AnswerTemplate {
  strong: { title: string; body: (a: string, b: string, score: number, narrative: string) => string };
  moderate: { title: string; body: (a: string, b: string, score: number, narrative: string) => string };
  growing: { title: string; body: (a: string, b: string, score: number, narrative: string) => string };
}

const ANSWER_TEMPLATES: Record<string, AnswerTemplate> = {
  core: {
    strong: {
      title: 'A Deep Foundation',
      body: (a, b, score, nar) =>
        `${a} and ${b} share a strong core identity resonance (${score}%). ${nar} ` +
        `This foundation is solid — you recognize something essential in each other. ` +
        `The Sun and Moon signatures at the heart of this bond point to genuine compatibility ` +
        `at the level of who you fundamentally are.`,
    },
    moderate: {
      title: 'A Living Foundation',
      body: (a, b, score, nar) =>
        `${a} and ${b} have a moderate core resonance (${score}%). ${nar} ` +
        `This is a connection with real substance, though it asks for ongoing attention. ` +
        `The identities here complement more than mirror — you're different enough to grow, ` +
        `similar enough to connect.`,
    },
    growing: {
      title: 'An Evolving Foundation',
      body: (a, b, score, nar) =>
        `${a} and ${b} have a developing core resonance (${score}%). ${nar} ` +
        `This doesn't mean incompatibility — it means the identity layer asks for ` +
        `conscious effort. Understanding each other's fundamental nature takes time and ` +
        `willingness to see beyond surface differences.`,
    },
  },
  passion: {
    strong: {
      title: 'The Fire Burns Bright',
      body: (a, b, score, nar) =>
        `The chemistry between ${a} and ${b} is powerful (${score}%). ${nar} ` +
        `Venus and Mars align in ways that create natural magnetism. ` +
        `This is a bond where desire and attraction flow easily — ` +
        `the physical and emotional spark sustains itself.`,
    },
    moderate: {
      title: 'A Steady Warmth',
      body: (a, b, score, nar) =>
        `The passion between ${a} and ${b} has substance (${score}%). ${nar} ` +
        `Venus and Mars create warmth rather than wildfire — the kind of attraction ` +
        `that builds with familiarity. Nurture it intentionally and it deepens over time.`,
    },
    growing: {
      title: 'Kindling the Spark',
      body: (a, b, score, nar) =>
        `The chemistry between ${a} and ${b} asks for cultivation (${score}%). ${nar} ` +
        `Venus and Mars speak different dialects here. This isn't absence of attraction — ` +
        `it's an invitation to discover each other's desire language more consciously.`,
    },
  },
  communication: {
    strong: {
      title: 'A Natural Dialogue',
      body: (a, b, score, nar) =>
        `${a} and ${b} communicate with unusual clarity (${score}%). ${nar} ` +
        `Mercury and Mars create a shared rhythm of words and action. ` +
        `You hear each other — and more importantly, you feel heard. ` +
        `This is one of the great gifts of this connection.`,
    },
    moderate: {
      title: 'Learning Each Other\'s Language',
      body: (a, b, score, nar) =>
        `Communication between ${a} and ${b} has real potential (${score}%). ${nar} ` +
        `Mercury and Mars are finding their groove together. ` +
        `With patience and active listening, this channel deepens steadily.`,
    },
    growing: {
      title: 'The Bridge Being Built',
      body: (a, b, score, nar) =>
        `Communication between ${a} and ${b} requires conscious attention (${score}%). ${nar} ` +
        `Mercury and Mars don't naturally speak the same language here. ` +
        `The work is in learning to translate — not to agree, but to truly hear.`,
    },
  },
  growth: {
    strong: {
      title: 'Builders of Tomorrow',
      body: (a, b, score, nar) =>
        `${a} and ${b} share a strong growth trajectory (${score}%). ${nar} ` +
        `Jupiter and Saturn align your visions of the future. ` +
        `You build well together — shared goals feel natural, ` +
        `and commitment deepens rather than constrains.`,
    },
    moderate: {
      title: 'A Growing Vision',
      body: (a, b, score, nar) =>
        `${a} and ${b} have compatible growth energy (${score}%). ${nar} ` +
        `Jupiter and Saturn point to a partnership that can build over time, ` +
        `though it benefits from regular check-ins about shared direction.`,
    },
    growing: {
      title: 'Different Blueprints',
      body: (a, b, score, nar) =>
        `${a} and ${b} approach growth differently (${score}%). ${nar} ` +
        `Jupiter and Saturn reveal different timelines and priorities. ` +
        `This isn't a dealbreaker — it's an invitation to find ` +
        `the overlap between your individual visions.`,
    },
  },
  transformation: {
    strong: {
      title: 'Deep Alchemy',
      body: (a, b, score, nar) =>
        `${a} and ${b} share a powerful transformative bond (${score}%). ${nar} ` +
        `The outer planets drive deep change between you — ` +
        `this is a relationship that demands evolution and rewards it profoundly. ` +
        `You cannot stay the same in each other's presence.`,
    },
    moderate: {
      title: 'Gentle Transformation',
      body: (a, b, score, nar) =>
        `${a} and ${b} catalyze meaningful change in each other (${score}%). ${nar} ` +
        `Uranus, Neptune, and Pluto weave threads of transformation ` +
        `that are steady rather than sudden. Growth happens — at its own pace.`,
    },
    growing: {
      title: 'The Threshold Ahead',
      body: (a, b, score, nar) =>
        `The transformative dimension between ${a} and ${b} is developing (${score}%). ${nar} ` +
        `The outer planets operate quietly here. Deep change is possible ` +
        `but asks for willingness to lean into discomfort when it arises.`,
    },
  },
};

// =============================================================================
// GUIDANCE LINES
// =============================================================================

const GUIDANCE_BY_ARCHETYPE: Record<CompositeArchetype, string> = {
  'Twin Flames': 'As Twin Flames, your mirror shows you truths. Let those truths inform your next step together.',
  'Builders': 'As Builders, your strength is in shared structure. Let this question deepen the blueprint.',
  'Storm-Walkers': 'As Storm-Walkers, your path is through intensity. Trust the storm — it clears what doesn\'t serve.',
  'Alchemists': 'As Alchemists, pressure creates gold. Let this question refine what you\'re becoming together.',
  'Companions': 'As Companions, your gift is steadiness. Let this answer guide a conversation this week.',
  'Catalysts': 'As Catalysts, your bond sparks change. Let this insight fuel your next transformation.',
};

// =============================================================================
// ORACLE ENGINE
// =============================================================================

/**
 * Ask the Relationship Oracle a question.
 * Routes to the most relevant chamber, generates a data-grounded answer.
 */
export function askOracle(question: string, input: OracleInput): OracleAnswer {
  const chamberKey = routeQuestion(question);
  const chamber = input.chambers.find(c => c.key === chamberKey) || input.chambers[0];
  const meta = CHAMBER_META[chamberKey] || { icon: '\u2022', color: '#9ca3af' };

  const template = ANSWER_TEMPLATES[chamberKey] || ANSWER_TEMPLATES.core;
  const variant =
    chamber.score >= 65 ? template.strong :
    chamber.score >= 45 ? template.moderate :
    template.growing;

  const body = variant.body(input.nameA, input.nameB, chamber.score, chamber.narrative);
  const guidance = GUIDANCE_BY_ARCHETYPE[input.compositeArchetype];

  return {
    chamber: chamber.label,
    chamberIcon: meta.icon,
    chamberColor: meta.color,
    score: chamber.score,
    title: variant.title,
    body,
    guidance,
  };
}

// =============================================================================
// SUGGESTED QUESTIONS
// =============================================================================

export const ORACLE_SUGGESTIONS: string[] = [
  'Are we meant to be together?',
  'How can we improve our communication?',
  'What does our passion look like?',
  'Will this relationship last?',
  'What is our deepest challenge?',
  'How do we grow together?',
];
