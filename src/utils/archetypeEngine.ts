/**
 * Archetype Engine — Mythic archetypes for monthly Qi patterns
 *
 * Assigns one of 12 mythic archetypes to each month based on:
 * - Collapse mode (structural behavior)
 * - Stability index (volatility)
 * - Dominant element(s)
 *
 * The archetypes provide intuitive, metaphorical understanding of
 * what each month "feels like" energetically.
 *
 * Created: March 2026
 */

import type { QiMonthSnapshot, QiYearMatrix } from './qiEngine';
import type { ElementName, CollapseMode } from '../data/stoneDatabase';
import { computeStabilityIndex } from './stabilityIndex';

const ELEMENTS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

// ============================================================================
// ARCHETYPE DEFINITIONS
// ============================================================================

export type ArchetypeName =
  | 'The Forge'
  | 'The Flood'
  | 'The Mountain'
  | 'The Mirror'
  | 'The Crucible'
  | 'The Desert'
  | 'The Storm'
  | 'The Garden'
  | 'The Anvil'
  | 'The River'
  | 'The Hearth'
  | 'The Loom';

export interface MythicPersona {
  name: string;          // "The Smith", "The Tidecaller", etc.
  description: string;   // Who they are
}

export interface RitualRecommendation {
  name: string;          // "Ritual of Purification"
  instruction: string;   // What to do
}

export interface BraceletPrescription {
  elements: ElementName[];
  stones: string[];
}

export interface ArchetypeInfo {
  name: ArchetypeName;
  symbol: string;          // HTML entity
  tagline: string;         // Short poetic description
  description: string;     // Full meaning + theme + behavior
  trigger: string;         // What BaZi conditions produce this archetype
  theme: string;           // Psychological theme
  behavior: string;        // Energetic behavior
  persona: MythicPersona;
  ritual: RitualRecommendation;
  bracelet: BraceletPrescription;
}

export const ARCHETYPES: Record<ArchetypeName, ArchetypeInfo> = {
  'The Forge': {
    name: 'The Forge',
    symbol: '&#128296;',
    tagline: 'Shaped by pressure',
    description: 'Transformation through heat, pressure, and purification. Intense energy transforms raw material into something stronger.',
    trigger: 'Fire single-dominant, Fire bi-polar, extreme Fire months',
    theme: 'Identity reshaping, intensity, breakthrough',
    behavior: 'Burns away stagnation; forces clarity and action',
    persona: {
      name: 'The Smith',
      description: 'A muscular, soot-covered artisan hammering molten metal into shape. He reshapes identity with fire, force, and purpose.',
    },
    ritual: {
      name: 'Ritual of Purification',
      instruction: 'Burn a small piece of paper with something you are releasing. Focus on transformation.',
    },
    bracelet: {
      elements: ['Fire', 'Earth'],
      stones: ['Red Jasper', 'Garnet', 'Tiger Eye'],
    },
  },
  'The Flood': {
    name: 'The Flood',
    symbol: '&#127754;',
    tagline: 'Overwhelming currents',
    description: 'Overwhelm, emotional saturation, dissolution of boundaries. Sweeps away rigid structures and softens the psyche.',
    trigger: 'Water single-dominant, Water bi-polar, Fire drained',
    theme: 'Release, surrender, emotional cleansing',
    behavior: 'Sweeps away rigid structures; softens the psyche',
    persona: {
      name: 'The Tidecaller',
      description: 'A robed figure walking calmly through rising waters. She dissolves boundaries and washes away what no longer serves.',
    },
    ritual: {
      name: 'Ritual of Release',
      instruction: 'Take a long bath or shower. Let water carry away emotional residue.',
    },
    bracelet: {
      elements: ['Water', 'Metal'],
      stones: ['Aquamarine', 'Moonstone', 'Hematite'],
    },
  },
  'The Mountain': {
    name: 'The Mountain',
    symbol: '&#9968;',
    tagline: 'Immovable stillness',
    description: 'Stability, endurance, immovability. Grounded and unshakeable, but resistant to change. Anchors the year.',
    trigger: 'Earth single-dominant, Earth-Fire bi-polar',
    theme: 'Grounding, responsibility, consolidation',
    behavior: 'Holds firm; resists change; anchors the year',
    persona: {
      name: 'The Sentinel',
      description: 'A stone giant seated in eternal stillness. He anchors, protects, and refuses to be moved.',
    },
    ritual: {
      name: 'Ritual of Grounding',
      instruction: 'Sit with your back against a wall or tree. Feel your spine become a pillar.',
    },
    bracelet: {
      elements: ['Earth'],
      stones: ['Smoky Quartz', 'Tiger Eye', 'Petrified Wood'],
    },
  },
  'The Mirror': {
    name: 'The Mirror',
    symbol: '&#128302;',
    tagline: 'Reflection and duality',
    description: 'Reflection, duality, relational insight. Reveals truth through contrast and resonance. Two forces in perfect tension.',
    trigger: 'Fire-Wood bi-polar, Wood-Metal tension',
    theme: 'Seeing oneself through others; projection; clarity',
    behavior: 'Reveals truth through contrast and resonance',
    persona: {
      name: 'The Twin',
      description: 'A luminous being split into two reflections. They reveal truth through contrast and resonance.',
    },
    ritual: {
      name: 'Ritual of Reflection',
      instruction: 'Journal one truth you have avoided. Name what you see clearly now.',
    },
    bracelet: {
      elements: ['Wood', 'Metal'],
      stones: ['Green Aventurine', 'Jade', 'Hematite'],
    },
  },
  'The Crucible': {
    name: 'The Crucible',
    symbol: '&#9883;',
    tagline: 'Trial by transformation',
    description: 'Alchemical pressure, inversion, paradox. Everything is melting and reforming. The month of greatest potential change.',
    trigger: 'Inverted structures, bi-polar + extreme volatility',
    theme: 'Testing, refinement, paradoxical growth',
    behavior: 'Forces integration of opposites',
    persona: {
      name: 'The Alchemist',
      description: 'A hooded figure tending a glowing cauldron. He transforms contradictions into wisdom.',
    },
    ritual: {
      name: 'Ritual of Integration',
      instruction: 'Write two opposing desires. Find the third path that unites them.',
    },
    bracelet: {
      elements: ['Fire', 'Water'],
      stones: ['Labradorite', 'Amethyst', 'Carnelian'],
    },
  },
  'The Desert': {
    name: 'The Desert',
    symbol: '&#127796;',
    tagline: 'Stripped to essence',
    description: 'Scarcity, purification, inner pilgrimage. Resources are scarce, forcing you to find what truly matters. Reveals inner reserves.',
    trigger: 'Drained collapse, Water drained + Fire dominance',
    theme: 'Solitude, introspection, survival wisdom',
    behavior: 'Strips life to essentials; reveals inner reserves',
    persona: {
      name: 'The Wanderer',
      description: 'A lone traveler crossing endless dunes. She finds strength in silence and simplicity.',
    },
    ritual: {
      name: 'Ritual of Simplification',
      instruction: 'Remove one object from your space. Honor the clarity of less.',
    },
    bracelet: {
      elements: ['Earth', 'Fire'],
      stones: ['Tiger Eye', 'Red Jasper', 'Smoky Quartz'],
    },
  },
  'The Storm': {
    name: 'The Storm',
    symbol: '&#9889;',
    tagline: 'Volatile power',
    description: 'Turbulence, volatility, rapid change. Breaks patterns and forces adaptation. Exciting but unpredictable.',
    trigger: 'Extreme stability index, heavy clashes, no structural collapse',
    theme: 'Chaos, disruption, emotional intensity',
    behavior: 'Breaks patterns; forces adaptation',
    persona: {
      name: 'The Tempest Rider',
      description: 'A figure riding lightning across a dark sky. He breaks stagnation with raw force.',
    },
    ritual: {
      name: 'Ritual of Discharge',
      instruction: 'Shake your body for 60 seconds. Let the turbulence move through you.',
    },
    bracelet: {
      elements: ['Water', 'Wood'],
      stones: ['Black Tourmaline', 'Fluorite', 'Lapis Lazuli'],
    },
  },
  'The Garden': {
    name: 'The Garden',
    symbol: '&#127793;',
    tagline: 'Natural growth',
    description: 'Growth, renewal, gentle flourishing. Balanced chart with stable energy. Organic growth, patience rewarded.',
    trigger: 'Stable Wood months, balanced chart led by Wood',
    theme: 'Creativity, learning, nurturing',
    behavior: 'Encourages expansion and new beginnings',
    persona: {
      name: 'The Greenkeeper',
      description: 'A gentle caretaker tending blooming vines. She nurtures growth and renewal.',
    },
    ritual: {
      name: 'Ritual of Planting',
      instruction: 'Plant a seed or tend a plant. Symbolize new growth.',
    },
    bracelet: {
      elements: ['Wood'],
      stones: ['Jade', 'Green Aventurine', 'Moss Agate'],
    },
  },
  'The Anvil': {
    name: 'The Anvil',
    symbol: '&#128737;',
    tagline: 'Enduring strength',
    description: 'Precision, discipline, refinement. Hard, refined, purposeful. Sharpens focus and cuts away excess.',
    trigger: 'Metal dominance, strong control cycle',
    theme: 'Craftsmanship, boundaries, structure',
    behavior: 'Sharpens focus; cuts away excess',
    persona: {
      name: 'The Artisan',
      description: 'A precise craftsperson shaping metal with discipline. He sharpens focus and cuts away excess.',
    },
    ritual: {
      name: 'Ritual of Precision',
      instruction: 'Choose one task and complete it fully. Honor craftsmanship.',
    },
    bracelet: {
      elements: ['Metal'],
      stones: ['Hematite', 'Pyrite', 'Silver Obsidian'],
    },
  },
  'The River': {
    name: 'The River',
    symbol: '&#127754;',
    tagline: 'Flowing adaptation',
    description: 'Flow, adaptability, gentle movement. Intuition guides, flexibility triumphs. Moves around obstacles and nourishes quietly.',
    trigger: 'Stable Water months, balanced chart led by Water',
    theme: 'Ease, intuition, emotional intelligence',
    behavior: 'Moves around obstacles; nourishes quietly',
    persona: {
      name: 'The Flowkeeper',
      description: 'A serene figure guiding water along its path. She teaches adaptability and emotional ease.',
    },
    ritual: {
      name: 'Ritual of Flow',
      instruction: 'Walk slowly and intentionally. Let your breath guide your pace.',
    },
    bracelet: {
      elements: ['Water'],
      stones: ['Aquamarine', 'Blue Lace Agate', 'Sodalite'],
    },
  },
  'The Hearth': {
    name: 'The Hearth',
    symbol: '&#128293;',
    tagline: 'Warm center',
    description: 'Warmth, connection, inner fire. Passion, visibility, and warmth radiate outward. Fuels creativity and belonging.',
    trigger: 'Fire dominance + moderate stability',
    theme: 'Belonging, passion, intimacy',
    behavior: 'Warms relationships; fuels creativity',
    persona: {
      name: 'The Flamebearer',
      description: 'A warm, radiant presence tending a sacred fire. He brings connection, passion, and belonging.',
    },
    ritual: {
      name: 'Ritual of Warmth',
      instruction: 'Light a candle. Invite warmth into your relationships.',
    },
    bracelet: {
      elements: ['Fire'],
      stones: ['Garnet', 'Carnelian', 'Sunstone'],
    },
  },
  'The Loom': {
    name: 'The Loom',
    symbol: '&#129526;',
    tagline: 'Weaving complexity',
    description: 'Weaving, integration, pattern-making. Old patterns unravel, new ones are woven. Connects threads and builds foundations.',
    trigger: 'Inverted structure, Earth-Wood interplay',
    theme: 'Planning, synthesis, long-term vision',
    behavior: 'Connects threads; builds foundations',
    persona: {
      name: 'The Weaver',
      description: 'A calm architect weaving glowing threads. She integrates patterns into long-term vision.',
    },
    ritual: {
      name: 'Ritual of Planning',
      instruction: 'Map a 3-step plan for something meaningful. Weave intention into structure.',
    },
    bracelet: {
      elements: ['Earth', 'Wood'],
      stones: ['Tiger Eye', 'Jade', 'Smoky Quartz'],
    },
  },
};

// ============================================================================
// ASSIGNMENT LOGIC
// ============================================================================

export interface MonthlyArchetype {
  monthIndex: number;
  monthName: string;
  archetype: ArchetypeName;
  reason: string;
}

export interface YearArchetypeResult {
  months: MonthlyArchetype[];
  /** Most common archetype across the year */
  dominantArchetype: ArchetypeName;
  /** Count of distinct archetypes */
  distinctCount: number;
}

function getDominantElement(qi: Record<string, number>): ElementName {
  let best: ElementName = 'Wood';
  let bestVal = -1;
  for (const el of ELEMENTS) {
    if ((qi[el] || 0) > bestVal) {
      bestVal = qi[el] || 0;
      best = el;
    }
  }
  return best;
}

function assignArchetype(
  snap: QiMonthSnapshot,
  stabilityIndex: number,
  stabilityCategory: string,
): MonthlyArchetype {
  const mode = snap.yongShen?.collapseMode || 'none';
  const dominant = getDominantElement(snap.functionalQi);
  const isVolatile = stabilityCategory === 'volatile' || stabilityCategory === 'extreme';

  let archetype: ArchetypeName;
  let reason: string;

  // Priority 1: Collapse-driven archetypes
  if (mode === 'drained') {
    archetype = 'The Desert';
    reason = `Energy is drained — no element holds ground (stability: ${stabilityIndex})`;
  } else if (mode === 'inverted') {
    archetype = 'The Loom';
    reason = `Inverted element hierarchy — old patterns unravel`;
  } else if (mode === 'bi-polar') {
    if (isVolatile) {
      archetype = 'The Crucible';
      reason = `Bi-polar collapse meets extreme volatility (stability: ${stabilityIndex})`;
    } else {
      archetype = 'The Mirror';
      reason = `Bi-polar split between ${snap.collapseInfo?.primary || '?'} and ${snap.collapseInfo?.secondary || '?'}`;
    }
  } else if (mode === 'single-dominant' && isVolatile) {
    // Single-dominant + volatile = Forge or Crucible depending on element
    if (dominant === 'Fire') {
      archetype = 'The Forge';
      reason = `Fire dominance under structural stress (stability: ${stabilityIndex})`;
    } else {
      archetype = 'The Crucible';
      reason = `${dominant} monopoly with extreme volatility (stability: ${stabilityIndex})`;
    }
  } else if (mode === 'single-dominant') {
    // Single-dominant but stable/moderate
    if (dominant === 'Fire') {
      archetype = 'The Forge';
      reason = `Fire dominates the chart — intense transformative energy`;
    } else if (dominant === 'Water') {
      archetype = 'The Flood';
      reason = `Water overwhelms — deep currents reshape everything`;
    } else if (dominant === 'Earth') {
      archetype = 'The Mountain';
      reason = `Earth monopoly — immovable, grounded, perhaps too rigid`;
    } else if (dominant === 'Metal') {
      archetype = 'The Anvil';
      reason = `Metal dominates — precision, discipline, cutting clarity`;
    } else {
      // Wood single-dominant
      archetype = 'The Garden';
      reason = `Wood monopoly — growth energy concentrated`;
    }
  }
  // Priority 2: Volatile but no structural collapse
  else if (isVolatile) {
    archetype = 'The Storm';
    reason = `High volatility without structural collapse (stability: ${stabilityIndex})`;
  }
  // Priority 3: Balanced/stable — element-driven
  else {
    switch (dominant) {
      case 'Fire':
        archetype = 'The Hearth';
        reason = `Balanced chart led by Fire — warm, creative, visible`;
        break;
      case 'Water':
        archetype = 'The River';
        reason = `Balanced chart led by Water — intuitive, flowing, adaptive`;
        break;
      case 'Earth':
        archetype = 'The Mountain';
        reason = `Balanced chart led by Earth — stable, grounded, nurturing`;
        break;
      case 'Metal':
        archetype = 'The Anvil';
        reason = `Balanced chart led by Metal — disciplined, refined, purposeful`;
        break;
      case 'Wood':
      default:
        archetype = 'The Garden';
        reason = `Balanced chart led by Wood — growth, creativity, expansion`;
        break;
    }
  }

  return {
    monthIndex: snap.monthIndex,
    monthName: snap.monthName,
    archetype,
    reason,
  };
}

export function computeYearArchetypes(matrix: QiYearMatrix): YearArchetypeResult {
  const months = matrix.months.map(snap => {
    const stability = computeStabilityIndex(matrix.natalQi, snap);
    return assignArchetype(snap, stability.index, stability.category);
  });

  // Find dominant archetype
  const counts: Record<string, number> = {};
  for (const m of months) {
    counts[m.archetype] = (counts[m.archetype] || 0) + 1;
  }
  const dominantArchetype = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])[0][0] as ArchetypeName;

  return {
    months,
    dominantArchetype,
    distinctCount: Object.keys(counts).length,
  };
}
