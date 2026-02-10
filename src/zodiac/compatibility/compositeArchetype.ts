/**
 * compositeArchetype.ts
 *
 * Classifies a relationship into one of six mythic archetypes based on
 * the five chamber scores (Core, Passion, Communication, Growth, Transformation).
 *
 * GENESIS AstroProfile - February 2026
 */

// =============================================================================
// TYPES
// =============================================================================

export type CompositeArchetype =
  | 'Twin Flames'
  | 'Builders'
  | 'Storm-Walkers'
  | 'Alchemists'
  | 'Companions'
  | 'Catalysts';

export interface ArchetypeResult {
  archetype: CompositeArchetype;
  icon: string;
  color: string;
  narrative: string;
}

export interface ChamberScoreMap {
  core: number;
  passion: number;
  communication: number;
  growth: number;
  transformation: number;
}

// =============================================================================
// ARCHETYPE PROFILES
// =============================================================================

const PROFILES: Record<CompositeArchetype, Omit<ArchetypeResult, 'archetype'>> = {
  'Twin Flames': {
    icon: '\uD83D\uDD25',
    color: '#f97316',
    narrative: 'A rare, high-voltage bond where identity, passion, and communication all burn bright. You recognize each other at the deepest level \u2014 this connection feels fated.',
  },
  'Builders': {
    icon: '\uD83C\uDFDB\uFE0F',
    color: '#14b8a6',
    narrative: 'A long-arc partnership focused on growth, structure, and shared construction of a life. Saturn and Jupiter shape the foundation while other chambers add warmth.',
  },
  'Storm-Walkers': {
    icon: '\u26C8\uFE0F',
    color: '#a855f7',
    narrative: 'An initiatory bond that walks through storms together. Transformation runs deep, and every challenge becomes an opportunity for profound evolution.',
  },
  'Alchemists': {
    icon: '\u2697\uFE0F',
    color: '#eab308',
    narrative: 'A relationship that turns pressure into wisdom. Change itself is the sacred material \u2014 outer planet forces and growth chambers combine to forge something new.',
  },
  'Companions': {
    icon: '\uD83E\uDD1D',
    color: '#22c55e',
    narrative: 'A steady, supportive connection with enough warmth and understanding to walk side by side. This bond thrives on reliability, shared values, and quiet strength.',
  },
  'Catalysts': {
    icon: '\u26A1',
    color: '#ec4899',
    narrative: 'An activating connection where one or both partners are fundamentally changed by the encounter. High in some chambers, challenging in others \u2014 never boring.',
  },
};

// =============================================================================
// CLASSIFICATION ENGINE
// =============================================================================

export function getCompositeArchetype(scores: ChamberScoreMap): ArchetypeResult {
  const { core, passion, communication, growth, transformation } = scores;
  const avg = (core + passion + communication + growth + transformation) / 5;

  let archetype: CompositeArchetype;

  // Twin Flames: high core + passion + communication (the personal planets shine)
  if (core >= 75 && passion >= 75 && communication >= 70) {
    archetype = 'Twin Flames';
  }
  // Builders: growth-oriented with solid core
  else if (growth >= 70 && core >= 60 && transformation >= 55) {
    archetype = 'Builders';
  }
  // Storm-Walkers: transformation-dominant with tension elsewhere
  else if (transformation >= 75 && (passion <= 50 || communication <= 50)) {
    archetype = 'Storm-Walkers';
  }
  // Alchemists: transformation + growth both strong
  else if (transformation >= 65 && growth >= 60 && avg >= 55) {
    archetype = 'Alchemists';
  }
  // Catalysts: big gap between strongest and weakest chambers
  else if (Math.max(core, passion, communication, growth, transformation) -
           Math.min(core, passion, communication, growth, transformation) >= 30) {
    archetype = 'Catalysts';
  }
  // Companions: solid, balanced
  else if (avg >= 55) {
    archetype = 'Companions';
  }
  // Default fallback based on dominant energy
  else if (transformation >= passion && transformation >= core) {
    archetype = 'Storm-Walkers';
  } else {
    archetype = 'Catalysts';
  }

  return {
    archetype,
    ...PROFILES[archetype],
  };
}
