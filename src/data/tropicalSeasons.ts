/**
 * tropicalSeasons.ts
 * ==================
 *
 * Canonical tables and utilities for the Tropical Zodiac Seasons system.
 * Used by the D3 ring donut visualization and compatibility engine.
 *
 * GENESIS AstroProfile - January 2026
 */

// =============================================================================
// CANONICAL TABLES
// =============================================================================

export const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
] as const;

export type ZodiacSign = typeof SIGNS[number];

export const ELEMENT: Record<ZodiacSign, string> = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water',
};

export const MODALITY: Record<ZodiacSign, string> = {
  Aries: 'Cardinal', Cancer: 'Cardinal',
  Libra: 'Cardinal', Capricorn: 'Cardinal',
  Taurus: 'Fixed', Leo: 'Fixed',
  Scorpio: 'Fixed', Aquarius: 'Fixed',
  Gemini: 'Mutable', Virgo: 'Mutable',
  Sagittarius: 'Mutable', Pisces: 'Mutable',
};

export const SEASON: Record<ZodiacSign, string> = {
  Capricorn: 'Winter', Aquarius: 'Winter', Pisces: 'Winter',
  Aries: 'Spring', Taurus: 'Spring', Gemini: 'Spring',
  Cancer: 'Summer', Leo: 'Summer', Virgo: 'Summer',
  Libra: 'Autumn', Scorpio: 'Autumn', Sagittarius: 'Autumn',
};

export const POLARITY: Record<ZodiacSign, 'Yang' | 'Yin'> = {
  Aries: 'Yang', Gemini: 'Yang', Leo: 'Yang',
  Libra: 'Yang', Sagittarius: 'Yang', Aquarius: 'Yang',
  Taurus: 'Yin', Cancer: 'Yin', Virgo: 'Yin',
  Scorpio: 'Yin', Capricorn: 'Yin', Pisces: 'Yin',
};

// =============================================================================
// SEASONAL ORDER
// =============================================================================

export const SEASON_ORDER: Record<string, ZodiacSign[]> = {
  Winter: ['Capricorn', 'Aquarius', 'Pisces'],
  Spring: ['Aries', 'Taurus', 'Gemini'],
  Summer: ['Cancer', 'Leo', 'Virgo'],
  Autumn: ['Libra', 'Scorpio', 'Sagittarius'],
};

export const SEASONS = ['Winter', 'Spring', 'Summer', 'Autumn'] as const;
export type Season = typeof SEASONS[number];

// =============================================================================
// SIGN DEGREE RANGES (0-360°)
// =============================================================================

export const SIGN_DEGREE_RANGE: Record<ZodiacSign, [number, number]> = {
  Aries: [0, 30],
  Taurus: [30, 60],
  Gemini: [60, 90],
  Cancer: [90, 120],
  Leo: [120, 150],
  Virgo: [150, 180],
  Libra: [180, 210],
  Scorpio: [210, 240],
  Sagittarius: [240, 270],
  Capricorn: [270, 300],
  Aquarius: [300, 330],
  Pisces: [330, 360],
};

// =============================================================================
// HEMISPHERE MAPPING
// =============================================================================

export const HEMISPHERE_SEASON_MAP = {
  north: {
    Spring: 'Spring',
    Summer: 'Summer',
    Autumn: 'Autumn',
    Winter: 'Winter',
  },
  south: {
    Spring: 'Autumn',
    Summer: 'Winter',
    Autumn: 'Spring',
    Winter: 'Summer',
  },
} as const;

// =============================================================================
// COLORS
// =============================================================================

export const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#ef4444',   // Red
  Earth: '#84cc16',  // Green
  Air: '#38bdf8',    // Sky blue
  Water: '#6366f1',  // Indigo
};

export const SEASON_COLORS: Record<string, string> = {
  Winter: '#94a3b8',  // Icy silver-gray (distinct from Air's sky blue)
  Spring: '#4ade80',  // Fresh green
  Summer: '#fbbf24',  // Warm yellow
  Autumn: '#f97316',  // Orange
};

export const MODALITY_COLORS: Record<string, string> = {
  Cardinal: '#ec4899', // Pink
  Fixed: '#8b5cf6',    // Purple
  Mutable: '#14b8a6',  // Teal
};

// =============================================================================
// SIGN SYMBOLS
// =============================================================================

export const SIGN_SYMBOLS: Record<ZodiacSign, string> = {
  Aries: '♈',
  Taurus: '♉',
  Gemini: '♊',
  Cancer: '♋',
  Leo: '♌',
  Virgo: '♍',
  Libra: '♎',
  Scorpio: '♏',
  Sagittarius: '♐',
  Capricorn: '♑',
  Aquarius: '♒',
  Pisces: '♓',
};

// =============================================================================
// SEASON ICONS
// =============================================================================

export const SEASON_ICONS: Record<string, string> = {
  Winter: '❄️',
  Spring: '🌸',
  Summer: '☀️',
  Autumn: '🍂',
};

// =============================================================================
// SIGN METADATA
// =============================================================================

export interface SignMeta {
  sign: ZodiacSign;
  symbol: string;
  element: string;
  modality: string;
  season: string;
  polarity: 'Yang' | 'Yin';
  degreeStart: number;
  degreeEnd: number;
  dateRange: string;
  keywords: string[];
  ruling: string;
}

export const SIGN_METADATA: SignMeta[] = [
  {
    sign: 'Aries',
    symbol: '♈',
    element: 'Fire',
    modality: 'Cardinal',
    season: 'Spring',
    polarity: 'Yang',
    degreeStart: 0,
    degreeEnd: 30,
    dateRange: 'Mar 21 - Apr 19',
    keywords: ['Initiative', 'Courage', 'Action', 'Pioneer'],
    ruling: 'Mars',
  },
  {
    sign: 'Taurus',
    symbol: '♉',
    element: 'Earth',
    modality: 'Fixed',
    season: 'Spring',
    polarity: 'Yin',
    degreeStart: 30,
    degreeEnd: 60,
    dateRange: 'Apr 20 - May 20',
    keywords: ['Stability', 'Sensuality', 'Patience', 'Builder'],
    ruling: 'Venus',
  },
  {
    sign: 'Gemini',
    symbol: '♊',
    element: 'Air',
    modality: 'Mutable',
    season: 'Spring',
    polarity: 'Yang',
    degreeStart: 60,
    degreeEnd: 90,
    dateRange: 'May 21 - Jun 20',
    keywords: ['Communication', 'Curiosity', 'Adaptability', 'Messenger'],
    ruling: 'Mercury',
  },
  {
    sign: 'Cancer',
    symbol: '♋',
    element: 'Water',
    modality: 'Cardinal',
    season: 'Summer',
    polarity: 'Yin',
    degreeStart: 90,
    degreeEnd: 120,
    dateRange: 'Jun 21 - Jul 22',
    keywords: ['Nurturing', 'Protection', 'Emotion', 'Home'],
    ruling: 'Moon',
  },
  {
    sign: 'Leo',
    symbol: '♌',
    element: 'Fire',
    modality: 'Fixed',
    season: 'Summer',
    polarity: 'Yang',
    degreeStart: 120,
    degreeEnd: 150,
    dateRange: 'Jul 23 - Aug 22',
    keywords: ['Creativity', 'Leadership', 'Expression', 'Heart'],
    ruling: 'Sun',
  },
  {
    sign: 'Virgo',
    symbol: '♍',
    element: 'Earth',
    modality: 'Mutable',
    season: 'Summer',
    polarity: 'Yin',
    degreeStart: 150,
    degreeEnd: 180,
    dateRange: 'Aug 23 - Sep 22',
    keywords: ['Analysis', 'Service', 'Precision', 'Healer'],
    ruling: 'Mercury',
  },
  {
    sign: 'Libra',
    symbol: '♎',
    element: 'Air',
    modality: 'Cardinal',
    season: 'Autumn',
    polarity: 'Yang',
    degreeStart: 180,
    degreeEnd: 210,
    dateRange: 'Sep 23 - Oct 22',
    keywords: ['Balance', 'Harmony', 'Partnership', 'Justice'],
    ruling: 'Venus',
  },
  {
    sign: 'Scorpio',
    symbol: '♏',
    element: 'Water',
    modality: 'Fixed',
    season: 'Autumn',
    polarity: 'Yin',
    degreeStart: 210,
    degreeEnd: 240,
    dateRange: 'Oct 23 - Nov 21',
    keywords: ['Transformation', 'Depth', 'Intensity', 'Phoenix'],
    ruling: 'Pluto',
  },
  {
    sign: 'Sagittarius',
    symbol: '♐',
    element: 'Fire',
    modality: 'Mutable',
    season: 'Autumn',
    polarity: 'Yang',
    degreeStart: 240,
    degreeEnd: 270,
    dateRange: 'Nov 22 - Dec 21',
    keywords: ['Expansion', 'Philosophy', 'Adventure', 'Seeker'],
    ruling: 'Jupiter',
  },
  {
    sign: 'Capricorn',
    symbol: '♑',
    element: 'Earth',
    modality: 'Cardinal',
    season: 'Winter',
    polarity: 'Yin',
    degreeStart: 270,
    degreeEnd: 300,
    dateRange: 'Dec 22 - Jan 19',
    keywords: ['Ambition', 'Structure', 'Achievement', 'Elder'],
    ruling: 'Saturn',
  },
  {
    sign: 'Aquarius',
    symbol: '♒',
    element: 'Air',
    modality: 'Fixed',
    season: 'Winter',
    polarity: 'Yang',
    degreeStart: 300,
    degreeEnd: 330,
    dateRange: 'Jan 20 - Feb 18',
    keywords: ['Innovation', 'Humanity', 'Freedom', 'Visionary'],
    ruling: 'Uranus',
  },
  {
    sign: 'Pisces',
    symbol: '♓',
    element: 'Water',
    modality: 'Mutable',
    season: 'Winter',
    polarity: 'Yin',
    degreeStart: 330,
    degreeEnd: 360,
    dateRange: 'Feb 19 - Mar 20',
    keywords: ['Intuition', 'Compassion', 'Dreams', 'Mystic'],
    ruling: 'Neptune',
  },
];

// =============================================================================
// SEASONAL PERSONALITY PROFILES (Comprehensive Schema v1.0)
// =============================================================================

export interface SeasonalThemes {
  core_essence: string;
  gifts: string[];
  challenges: string[];
  relational_style: string;
  life_mission: string;
}

export interface SeasonalArchetype {
  title: string;
  summary: string;
  themes: SeasonalThemes;
}

export interface ModalityFlowEntry {
  order: number;
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  sign: ZodiacSign;
  label: string;
  description: string;
}

export interface LightCurve {
  qualitative: string;
  notes: string[];
}

export interface HemisphereOverride {
  name: string;
  archetype_adjustment: string;
  notes: string[];
}

export interface SignOverlay {
  sign: ZodiacSign;
  emphasis: string;
}

export interface SeasonalProfile {
  id: string;
  season: Season;
  icon: string;
  hemisphere_default: 'north' | 'south';
  keywords: string[];
  archetype: SeasonalArchetype;
  modality_flow: ModalityFlowEntry[];
  light_curve: LightCurve;
  hemisphere_overrides: {
    south: HemisphereOverride;
  };
  sign_overlays: SignOverlay[];
}

export const SEASONAL_PROFILES: SeasonalProfile[] = [
  {
    id: 'winter',
    season: 'Winter',
    icon: '❄️',
    hemisphere_default: 'north',
    keywords: ['inward', 'crystallizing', 'endurance', 'structure', 'vision'],
    archetype: {
      title: 'The Architect of Time',
      summary: 'Winter-born natives carry an inward, strategic, and enduring energy. They are the builders of lasting structures—both inner and outer—who understand that true achievement requires patience, discipline, and a willingness to work in the dark before the light returns.',
      themes: {
        core_essence: 'Consolidation, reflection, long-term planning. Winter souls naturally turn inward, processing experience into wisdom and preparing foundations for future growth.',
        gifts: [
          'Strategic thinking and long-range vision',
          'Emotional resilience and inner fortitude',
          'Ability to work steadily without external validation',
          'Deep capacity for solitude and introspection',
          'Understanding of cycles and timing',
        ],
        challenges: [
          'Tendency toward isolation or emotional withdrawal',
          'Over-seriousness or pessimistic outlook',
          'Difficulty initiating rapid change or spontaneity',
          'May suppress emotional needs for achievement',
          'Can become rigid or controlling under stress',
        ],
        relational_style: 'Slow to open, loyal once committed, prefers depth over breadth. Winter souls may seem reserved initially but form bonds that withstand time. They show love through reliability and practical support rather than effusive emotion.',
        life_mission: 'To build structures—inner and outer—that can withstand time. To transform difficulty into wisdom. To hold space for others during their own winters.',
      },
    },
    modality_flow: [
      {
        order: 1,
        modality: 'Cardinal',
        sign: 'Capricorn',
        label: 'Birth of Winter',
        description: 'Capricorn initiates Winter with structure, responsibility, and long-term ambition. The Winter Solstice marks the deepest night—and the moment light begins its return.',
      },
      {
        order: 2,
        modality: 'Fixed',
        sign: 'Aquarius',
        label: 'Core of Winter',
        description: 'Aquarius stabilizes Winter with vision, innovation, and social ideals. The coldest time becomes the laboratory for revolutionary thinking.',
      },
      {
        order: 3,
        modality: 'Mutable',
        sign: 'Pisces',
        label: 'Transition of Winter',
        description: 'Pisces dissolves Winter\'s boundaries, preparing the psyche for Spring\'s rebirth. The ending becomes the dreaming that precedes awakening.',
      },
    ],
    light_curve: {
      qualitative: 'Contracting light, deep introspection, slow rebuilding of momentum.',
      notes: [
        'Shortest days of the year in the Northern Hemisphere.',
        'Psychic focus on endurance, survival, and inner resources.',
        'Light begins returning after the Solstice—hope within darkness.',
      ],
    },
    hemisphere_overrides: {
      south: {
        name: 'Winter (South)',
        archetype_adjustment: 'In the Southern Hemisphere, Winter occurs during June-August but carries identical psychological themes. The archetypal experience of contraction, reflection, and endurance transcends calendar dates.',
        notes: [
          'Keep the same psychological archetype.',
          'Adjust calendar mapping only (Jun-Aug instead of Dec-Feb).',
          'The experience of "going inward" is universal.',
        ],
      },
    },
    sign_overlays: [
      {
        sign: 'Capricorn',
        emphasis: 'Structural, pragmatic, legacy-focused expression of Winter themes. The builder who climbs the mountain.',
      },
      {
        sign: 'Aquarius',
        emphasis: 'Visionary, future-oriented, socially experimental expression of Winter themes. The revolutionary who reimagines the world.',
      },
      {
        sign: 'Pisces',
        emphasis: 'Mystical, compassionate, boundary-dissolving expression of Winter themes. The dreamer who surrenders to become.',
      },
    ],
  },
  {
    id: 'spring',
    season: 'Spring',
    icon: '🌸',
    hemisphere_default: 'north',
    keywords: ['emergence', 'initiative', 'renewal', 'courage', 'beginnings'],
    archetype: {
      title: 'The Pioneer of Dawn',
      summary: 'Spring-born natives carry an outward, initiating, and renewing energy. They are the first shoots breaking through frozen ground—courageous, eager, and oriented toward what is new rather than what has been.',
      themes: {
        core_essence: 'Initiation, emergence, breaking through. Spring souls naturally push forward, seeing possibilities where others see obstacles, embodying the life force that says "begin."',
        gifts: [
          'Natural courage and willingness to take risks',
          'Fresh perspective unclouded by history',
          'Infectious enthusiasm that motivates others',
          'Ability to start new cycles and projects',
          'Resilience and rapid recovery from setbacks',
        ],
        challenges: [
          'Difficulty with follow-through and completion',
          'Impatience with slow processes or delayed gratification',
          'May leave a trail of unfinished beginnings',
          'Can be naive about complexity or consequences',
          'Tendency to move on before learning lessons fully',
        ],
        relational_style: 'Quick to connect, enthusiastic in early stages, may struggle with the long middle. Spring souls bring energy to relationships but need partners who can help ground their restless motion.',
        life_mission: 'To initiate new cycles. To demonstrate that beginnings are possible. To remind the world that every ending carries a seed.',
      },
    },
    modality_flow: [
      {
        order: 1,
        modality: 'Cardinal',
        sign: 'Aries',
        label: 'Birth of Spring',
        description: 'Aries initiates Spring with fire, courage, and pioneering action. The Vernal Equinox marks the triumph of light over darkness—the cosmic "yes."',
      },
      {
        order: 2,
        modality: 'Fixed',
        sign: 'Taurus',
        label: 'Core of Spring',
        description: 'Taurus stabilizes Spring with sensuality, patience, and material grounding. The initial burst settles into sustainable growth.',
      },
      {
        order: 3,
        modality: 'Mutable',
        sign: 'Gemini',
        label: 'Transition of Spring',
        description: 'Gemini disperses Spring\'s energy through communication, connection, and curiosity. Growth becomes sharing.',
      },
    ],
    light_curve: {
      qualitative: 'Expanding light, increasing warmth, accelerating momentum.',
      notes: [
        'Days grow longer than nights after the Equinox.',
        'Psychic focus on emergence, action, and new possibilities.',
        'The world wakes up—and so does the Spring soul.',
      ],
    },
    hemisphere_overrides: {
      south: {
        name: 'Spring (South)',
        archetype_adjustment: 'In the Southern Hemisphere, Spring occurs during September-November but carries identical psychological themes. The archetypal experience of emergence and initiation transcends calendar dates.',
        notes: [
          'Keep the same psychological archetype.',
          'Adjust calendar mapping only (Sep-Nov instead of Mar-May).',
          'The experience of "breaking through" is universal.',
        ],
      },
    },
    sign_overlays: [
      {
        sign: 'Aries',
        emphasis: 'Bold, direct, self-focused expression of Spring themes. The warrior who charges forward.',
      },
      {
        sign: 'Taurus',
        emphasis: 'Sensual, grounded, resource-building expression of Spring themes. The farmer who plants and tends.',
      },
      {
        sign: 'Gemini',
        emphasis: 'Curious, communicative, connection-seeking expression of Spring themes. The messenger who spreads the news.',
      },
    ],
  },
  {
    id: 'summer',
    season: 'Summer',
    icon: '☀️',
    hemisphere_default: 'north',
    keywords: ['expression', 'fullness', 'nurturing', 'creativity', 'peak'],
    archetype: {
      title: 'The Sovereign of Light',
      summary: 'Summer-born natives carry an expressive, nurturing, and radiant energy. They are the sun at its zenith—generous, visible, and oriented toward fullness of being rather than striving.',
      themes: {
        core_essence: 'Expression, nurturing, peak manifestation. Summer souls naturally radiate outward, giving warmth, seeking recognition, and embodying the fullness that says "here I am."',
        gifts: [
          'Natural warmth and generosity of spirit',
          'Creative power and artistic expression',
          'Ability to nurture and support others\' growth',
          'Comfort with visibility and recognition',
          'Emotional depth and capacity for care',
        ],
        challenges: [
          'Difficulty accepting decline, endings, or loss',
          'May overextend or give beyond capacity',
          'Can become dependent on external validation',
          'Tendency to dramatize or center self in stories',
          'Struggle with the quieter, less visible work',
        ],
        relational_style: 'Warm, generous, emotionally present, may expect reciprocal attention. Summer souls create family wherever they go but need partners who can match their emotional intensity.',
        life_mission: 'To radiate warmth that helps others grow. To demonstrate that visibility is a gift. To show that emotional generosity creates abundance.',
      },
    },
    modality_flow: [
      {
        order: 1,
        modality: 'Cardinal',
        sign: 'Cancer',
        label: 'Birth of Summer',
        description: 'Cancer initiates Summer with nurturing, protection, and emotional depth. The Summer Solstice marks the longest day—the fullness that begins to wane.',
      },
      {
        order: 2,
        modality: 'Fixed',
        sign: 'Leo',
        label: 'Core of Summer',
        description: 'Leo stabilizes Summer with creative fire, self-expression, and generous leadership. The peak becomes celebration.',
      },
      {
        order: 3,
        modality: 'Mutable',
        sign: 'Virgo',
        label: 'Transition of Summer',
        description: 'Virgo refines Summer\'s abundance through analysis, service, and preparation. Fullness becomes harvest-ready.',
      },
    ],
    light_curve: {
      qualitative: 'Maximum light beginning to contract, peak expression before the turn.',
      notes: [
        'Longest days of the year in the Northern Hemisphere.',
        'Psychic focus on expression, visibility, and full engagement.',
        'The light is brightest—and the shadow most defined.',
      ],
    },
    hemisphere_overrides: {
      south: {
        name: 'Summer (South)',
        archetype_adjustment: 'In the Southern Hemisphere, Summer occurs during December-February but carries identical psychological themes. The archetypal experience of fullness and expression transcends calendar dates.',
        notes: [
          'Keep the same psychological archetype.',
          'Adjust calendar mapping only (Dec-Feb instead of Jun-Aug).',
          'The experience of "radiating outward" is universal.',
        ],
      },
    },
    sign_overlays: [
      {
        sign: 'Cancer',
        emphasis: 'Nurturing, protective, home-centered expression of Summer themes. The mother who creates belonging.',
      },
      {
        sign: 'Leo',
        emphasis: 'Creative, dramatic, heart-centered expression of Summer themes. The sovereign who shines for all.',
      },
      {
        sign: 'Virgo',
        emphasis: 'Analytical, service-oriented, craft-focused expression of Summer themes. The healer who perfects the harvest.',
      },
    ],
  },
  {
    id: 'autumn',
    season: 'Autumn',
    icon: '🍂',
    hemisphere_default: 'north',
    keywords: ['transformation', 'balance', 'release', 'depth', 'harvest'],
    archetype: {
      title: 'The Alchemist of Twilight',
      summary: 'Autumn-born natives carry a transformative, balancing, and deepening energy. They are the harvest and the release—masters of the turning point who understand that endings create space for what comes next.',
      themes: {
        core_essence: 'Transformation, release, harvesting wisdom. Autumn souls naturally move toward depth, seeking meaning in what has been and preparing for what the darkness will reveal.',
        gifts: [
          'Capacity for deep transformation and renewal',
          'Natural sense of balance and justice',
          'Wisdom that comes from releasing attachments',
          'Ability to find meaning in endings',
          'Emotional depth and psychological insight',
        ],
        challenges: [
          'Difficulty with lightness or simple beginnings',
          'May become obsessed with meaning or depth',
          'Tendency toward melancholy or heaviness',
          'Can struggle to let go of what should be released',
          'May resist the simplicity of starting fresh',
        ],
        relational_style: 'Seeks depth and meaning in connection, may test relationships through intensity. Autumn souls form bonds through shared transformation and need partners who can hold space for the dark.',
        life_mission: 'To demonstrate that release is liberation. To transform what others discard into gold. To hold the wisdom of the turning point.',
      },
    },
    modality_flow: [
      {
        order: 1,
        modality: 'Cardinal',
        sign: 'Libra',
        label: 'Birth of Autumn',
        description: 'Libra initiates Autumn with balance, relationship, and harmony. The Autumnal Equinox marks the moment of perfect equilibrium—light and dark in equal measure.',
      },
      {
        order: 2,
        modality: 'Fixed',
        sign: 'Scorpio',
        label: 'Core of Autumn',
        description: 'Scorpio stabilizes Autumn with intensity, transformation, and psychological depth. Balance deepens into the descent.',
      },
      {
        order: 3,
        modality: 'Mutable',
        sign: 'Sagittarius',
        label: 'Transition of Autumn',
        description: 'Sagittarius expands Autumn\'s depth through seeking, philosophy, and vision. Descent becomes quest.',
      },
    ],
    light_curve: {
      qualitative: 'Contracting light, increasing darkness, the great turning inward.',
      notes: [
        'Days grow shorter than nights after the Equinox.',
        'Psychic focus on meaning, release, and depth.',
        'The world prepares for winter—and so does the Autumn soul.',
      ],
    },
    hemisphere_overrides: {
      south: {
        name: 'Autumn (South)',
        archetype_adjustment: 'In the Southern Hemisphere, Autumn occurs during March-May but carries identical psychological themes. The archetypal experience of transformation and release transcends calendar dates.',
        notes: [
          'Keep the same psychological archetype.',
          'Adjust calendar mapping only (Mar-May instead of Sep-Nov).',
          'The experience of "releasing and deepening" is universal.',
        ],
      },
    },
    sign_overlays: [
      {
        sign: 'Libra',
        emphasis: 'Harmonizing, partnership-focused, justice-seeking expression of Autumn themes. The diplomat who balances scales.',
      },
      {
        sign: 'Scorpio',
        emphasis: 'Transformative, intense, depth-seeking expression of Autumn themes. The phoenix who dies to be reborn.',
      },
      {
        sign: 'Sagittarius',
        emphasis: 'Expansive, truth-seeking, philosophy-driven expression of Autumn themes. The archer who aims beyond the visible.',
      },
    ],
  },
];

// =============================================================================
// COMPATIBILITY ENGINE
// =============================================================================

/** Basic compatibility result (legacy) */
export interface CompatibilityResult {
  signA: ZodiacSign;
  signB: ZodiacSign;
  elementRelation: string;
  elementScore: number;
  modalityRelation: string;
  modalityScore: number;
  seasonRelation: string;
  seasonScore: number;
  overallScore: number;
  summary: string;
}

// =============================================================================
// ENHANCED COMPATIBILITY SCHEMA (v1.0)
// =============================================================================

export type ElementType = 'Fire' | 'Earth' | 'Air' | 'Water';
export type ModalityType = 'Cardinal' | 'Fixed' | 'Mutable';
export type SeasonType = 'Winter' | 'Spring' | 'Summer' | 'Autumn';

export interface CuspBlend {
  isCusp: boolean;
  primary: ZodiacSign;
  secondary: ZodiacSign | null;
  primary_pct: number;
  secondary_pct: number;
}

export interface CompatibilityScores {
  overall: number;
  chemistry: number;
  communication: number;
  stability: number;
  growth: number;
}

export interface CompatibilityNarrative {
  summary: string;
  strengths: string[];
  challenges: string[];
  advice: string[];
}

export interface CompatibilityPayload {
  version: string;
  signA: ZodiacSign;
  signB: ZodiacSign;
  element: {
    signA: ElementType;
    signB: ElementType;
    relation: string;
    notes: string;
  };
  modality: {
    signA: ModalityType;
    signB: ModalityType;
    relation: string;
    notes: string;
  };
  season: {
    signA: SeasonType;
    signB: SeasonType;
    relation: string;
    notes: string;
  };
  solar_phase?: {
    signA_phase: string;
    signB_phase: string;
    notes?: string;
  };
  cusp?: {
    signA_blend: CuspBlend;
    signB_blend: CuspBlend;
  };
  scores: CompatibilityScores;
  narrative: CompatibilityNarrative;
}

export function getElementRelation(elemA: string, elemB: string): { relation: string; score: number } {
  if (elemA === elemB) {
    return { relation: 'Same element — natural understanding, similar values', score: 80 };
  }
  const pair = new Set([elemA, elemB]);
  if (pair.has('Fire') && pair.has('Air')) {
    return { relation: 'Complementary — Air feeds Fire\'s flame', score: 90 };
  }
  if (pair.has('Earth') && pair.has('Water')) {
    return { relation: 'Complementary — Water nourishes Earth\'s growth', score: 90 };
  }
  if (pair.has('Fire') && pair.has('Water')) {
    return { relation: 'Challenging — passion meets emotion (steam or evaporation)', score: 50 };
  }
  if (pair.has('Earth') && pair.has('Air')) {
    return { relation: 'Challenging — structure meets ideas (build or erode)', score: 50 };
  }
  if (pair.has('Fire') && pair.has('Earth')) {
    return { relation: 'Mixed — Fire needs fuel, Earth can contain or smother', score: 60 };
  }
  if (pair.has('Air') && pair.has('Water')) {
    return { relation: 'Mixed — ideas meet emotions (clarity or confusion)', score: 60 };
  }
  return { relation: 'Complex dynamic', score: 65 };
}

export function getModalityRelation(modA: string, modB: string): { relation: string; score: number } {
  if (modA === modB) {
    return { relation: 'Same modality — can sync strongly or clash intensely', score: 70 };
  }
  const pair = new Set([modA, modB]);
  if (pair.has('Cardinal') && pair.has('Fixed')) {
    return { relation: 'Initiator + Stabilizer — one starts, one sustains', score: 85 };
  }
  if (pair.has('Cardinal') && pair.has('Mutable')) {
    return { relation: 'Initiator + Adapter — one launches, one adjusts', score: 80 };
  }
  if (pair.has('Fixed') && pair.has('Mutable')) {
    return { relation: 'Stability + Change — one holds, one evolves', score: 85 };
  }
  return { relation: 'Complex modality dynamic', score: 75 };
}

export function getSeasonRelation(seaA: string, seaB: string): { relation: string; score: number } {
  if (seaA === seaB) {
    return { relation: 'Same season — shared seasonal imprint and timing', score: 85 };
  }
  // Adjacent seasons
  const seasonCycle = ['Winter', 'Spring', 'Summer', 'Autumn'];
  const idxA = seasonCycle.indexOf(seaA);
  const idxB = seasonCycle.indexOf(seaB);
  const diff = Math.abs(idxA - idxB);
  if (diff === 1 || diff === 3) {
    return { relation: 'Adjacent seasons — natural flow and transition', score: 75 };
  }
  // Opposite seasons
  return { relation: 'Opposite seasons — complementary but different rhythms', score: 65 };
}

export function calculateCompatibility(signA: ZodiacSign, signB: ZodiacSign): CompatibilityResult {
  const metaA = SIGN_METADATA.find(m => m.sign === signA)!;
  const metaB = SIGN_METADATA.find(m => m.sign === signB)!;

  const elemResult = getElementRelation(metaA.element, metaB.element);
  const modResult = getModalityRelation(metaA.modality, metaB.modality);
  const seaResult = getSeasonRelation(metaA.season, metaB.season);

  // Weighted average
  const overallScore = Math.round(
    elemResult.score * 0.4 + modResult.score * 0.35 + seaResult.score * 0.25
  );

  const summary = `${signA} (${metaA.element} ${metaA.modality}, ${metaA.season}) with ${signB} (${metaB.element} ${metaB.modality}, ${metaB.season}). Overall chemistry: ${overallScore}%.`;

  return {
    signA,
    signB,
    elementRelation: elemResult.relation,
    elementScore: elemResult.score,
    modalityRelation: modResult.relation,
    modalityScore: modResult.score,
    seasonRelation: seaResult.relation,
    seasonScore: seaResult.score,
    overallScore,
    summary,
  };
}

// =============================================================================
// ENHANCED COMPATIBILITY CALCULATION
// =============================================================================

const ELEMENT_NOTES: Record<string, string> = {
  'Fire-Fire': 'Mutual inspiration and passion, but may compete for attention.',
  'Fire-Air': 'Air feeds Fire\'s flame — ideas inspire action.',
  'Fire-Earth': 'Fire seeks action; Earth seeks stability. Requires patience.',
  'Fire-Water': 'Passion meets emotion — can create steam or evaporation.',
  'Earth-Earth': 'Shared values and practical grounding, but may lack spontaneity.',
  'Earth-Air': 'Structure meets ideas — can build together or erode.',
  'Earth-Water': 'Water nourishes Earth\'s growth — nurturing and stable.',
  'Air-Air': 'Great communication and mental connection, may lack grounding.',
  'Air-Water': 'Ideas meet emotions — can clarify or confuse.',
  'Water-Water': 'Deep emotional bonding, but may overwhelm each other.',
};

const MODALITY_NOTES: Record<string, string> = {
  'Cardinal-Cardinal': 'Both want to lead; cooperation requires shared purpose.',
  'Cardinal-Fixed': 'One initiates, one sustains — complementary if respected.',
  'Cardinal-Mutable': 'One launches, one adapts — momentum and flexibility.',
  'Fixed-Fixed': 'Deep loyalty but potential for stubborn standoffs.',
  'Fixed-Mutable': 'Stability meets change — growth through tension.',
  'Mutable-Mutable': 'Highly adaptable but may lack direction.',
};

const SEASON_NOTES: Record<string, string> = {
  'same': 'Shared seasonal rhythm and life perspective.',
  'adjacent': 'Natural flow between perspectives.',
  'opposite': 'Complementary but different life rhythms.',
};

function getElementNotes(elemA: string, elemB: string): string {
  const key1 = `${elemA}-${elemB}`;
  const key2 = `${elemB}-${elemA}`;
  return ELEMENT_NOTES[key1] || ELEMENT_NOTES[key2] || 'Complex elemental dynamic.';
}

function getModalityNotes(modA: string, modB: string): string {
  const key1 = `${modA}-${modB}`;
  const key2 = `${modB}-${modA}`;
  return MODALITY_NOTES[key1] || MODALITY_NOTES[key2] || 'Dynamic modality interaction.';
}

function getSeasonNotes(seaA: string, seaB: string): string {
  if (seaA === seaB) return SEASON_NOTES.same;
  const seasonCycle = ['Winter', 'Spring', 'Summer', 'Autumn'];
  const idxA = seasonCycle.indexOf(seaA);
  const idxB = seasonCycle.indexOf(seaB);
  const diff = Math.abs(idxA - idxB);
  return (diff === 1 || diff === 3) ? SEASON_NOTES.adjacent : SEASON_NOTES.opposite;
}

function generateNarrative(
  metaA: SignMeta,
  metaB: SignMeta,
  elemResult: { relation: string; score: number },
  modResult: { relation: string; score: number },
  seaResult: { relation: string; score: number }
): CompatibilityNarrative {
  const summary = `${metaA.sign} (${metaA.element}, ${metaA.modality}, ${metaA.season}) meets ${metaB.sign} (${metaB.element}, ${metaB.modality}, ${metaB.season}). This pairing blends ${metaA.keywords[0].toLowerCase()} with ${metaB.keywords[0].toLowerCase()}.`;

  const strengths: string[] = [];
  const challenges: string[] = [];
  const advice: string[] = [];

  // Element-based strengths/challenges
  if (elemResult.score >= 80) {
    strengths.push(`Strong elemental harmony (${metaA.element}/${metaB.element})`);
  } else if (elemResult.score <= 60) {
    challenges.push(`Elemental tension requires conscious navigation`);
    advice.push('Appreciate your different approaches to action and emotion.');
  }

  // Modality-based strengths/challenges
  if (modResult.score >= 80) {
    strengths.push('Complementary rhythms — natural division of labor');
  } else if (metaA.modality === metaB.modality) {
    if (metaA.modality === 'Cardinal') {
      challenges.push('Both want to lead — potential power struggles');
      advice.push('Define shared goals and take turns leading.');
    } else if (metaA.modality === 'Fixed') {
      challenges.push('Both are stubborn — neither yields easily');
      advice.push('Practice compromise on non-essential matters.');
    } else {
      challenges.push('Both adapt constantly — may lack anchor');
      advice.push('Establish some stable routines together.');
    }
  }

  // Season-based insights
  if (seaResult.score >= 80) {
    strengths.push('Shared seasonal perspective and timing');
  } else if (seaResult.score <= 65) {
    challenges.push('Different seasonal rhythms and life orientations');
    advice.push('Respect each other\'s natural pacing and cycles.');
  }

  // General strengths based on sign keywords
  strengths.push(`${metaA.sign} brings ${metaA.keywords.slice(0, 2).join(' and ').toLowerCase()}`);
  strengths.push(`${metaB.sign} brings ${metaB.keywords.slice(0, 2).join(' and ').toLowerCase()}`);

  return { summary, strengths, challenges, advice };
}

export function calculateEnhancedCompatibility(
  signA: ZodiacSign,
  signB: ZodiacSign,
  cuspA?: CuspBlend,
  cuspB?: CuspBlend
): CompatibilityPayload {
  const metaA = SIGN_METADATA.find(m => m.sign === signA)!;
  const metaB = SIGN_METADATA.find(m => m.sign === signB)!;

  const elemResult = getElementRelation(metaA.element, metaB.element);
  const modResult = getModalityRelation(metaA.modality, metaB.modality);
  const seaResult = getSeasonRelation(metaA.season, metaB.season);

  // Calculate multi-dimensional scores
  const chemistryScore = elemResult.score;
  const communicationScore = metaA.element === 'Air' || metaB.element === 'Air'
    ? Math.min(90, elemResult.score + 10)
    : elemResult.score;
  const stabilityScore = Math.round((modResult.score + seaResult.score) / 2);
  const growthScore = modResult.score >= 80 ? 75 : 65;

  const overallScore = Math.round(
    elemResult.score * 0.35 +
    modResult.score * 0.30 +
    seaResult.score * 0.20 +
    growthScore * 0.15
  );

  const narrative = generateNarrative(metaA, metaB, elemResult, modResult, seaResult);

  return {
    version: '1.0.0',
    signA,
    signB,
    element: {
      signA: metaA.element as ElementType,
      signB: metaB.element as ElementType,
      relation: elemResult.relation,
      notes: getElementNotes(metaA.element, metaB.element),
    },
    modality: {
      signA: metaA.modality as ModalityType,
      signB: metaB.modality as ModalityType,
      relation: modResult.relation,
      notes: getModalityNotes(metaA.modality, metaB.modality),
    },
    season: {
      signA: metaA.season as SeasonType,
      signB: metaB.season as SeasonType,
      relation: seaResult.relation,
      notes: getSeasonNotes(metaA.season, metaB.season),
    },
    cusp: cuspA && cuspB ? { signA_blend: cuspA, signB_blend: cuspB } : undefined,
    scores: {
      overall: overallScore,
      chemistry: chemistryScore,
      communication: communicationScore,
      stability: stabilityScore,
      growth: growthScore,
    },
    narrative,
  };
}

// =============================================================================
// ASPECT CALCULATION ENGINE
// =============================================================================

/**
 * Astrological aspects represent angular relationships between celestial bodies.
 * In the context of sign-to-sign relationships, these angles reveal fundamental
 * dynamics between the zodiac signs.
 */

export type AspectType = 'conjunction' | 'semi-sextile' | 'sextile' | 'square' | 'trine' | 'quincunx' | 'opposition';

export interface AspectDefinition {
  name: string;
  symbol: string;
  angle: number;
  orb: number;        // Degrees of tolerance
  nature: 'harmonious' | 'challenging' | 'neutral' | 'awkward';
  description: string;
  color: string;
}

export const ASPECT_DEFINITIONS: Record<AspectType, AspectDefinition> = {
  conjunction: {
    name: 'Conjunction',
    symbol: '☌',
    angle: 0,
    orb: 8,
    nature: 'neutral',
    description: 'Same sign — fusion, intensity, shared identity',
    color: '#fbbf24',  // Amber
  },
  'semi-sextile': {
    name: 'Semi-sextile',
    symbol: '⚺',
    angle: 30,
    orb: 2,
    nature: 'awkward',
    description: '30° apart — adjacent signs, subtle friction, requires adjustment',
    color: '#94a3b8',  // Slate
  },
  sextile: {
    name: 'Sextile',
    symbol: '⚹',
    angle: 60,
    orb: 4,
    nature: 'harmonious',
    description: '60° apart — opportunity, cooperation, compatible elements',
    color: '#4ade80',  // Green
  },
  square: {
    name: 'Square',
    symbol: '□',
    angle: 90,
    orb: 6,
    nature: 'challenging',
    description: '90° apart — tension, friction, growth through conflict',
    color: '#ef4444',  // Red
  },
  trine: {
    name: 'Trine',
    symbol: '△',
    angle: 120,
    orb: 6,
    nature: 'harmonious',
    description: '120° apart — flow, harmony, same element',
    color: '#60a5fa',  // Blue
  },
  quincunx: {
    name: 'Quincunx',
    symbol: '⚻',
    angle: 150,
    orb: 3,
    nature: 'awkward',
    description: '150° apart — no common ground, persistent adjustment needed',
    color: '#f59e0b',  // Orange
  },
  opposition: {
    name: 'Opposition',
    symbol: '☍',
    angle: 180,
    orb: 8,
    nature: 'challenging',
    description: '180° apart — polarity, awareness, balance of opposites',
    color: '#a855f7',  // Purple
  },
};

export const ASPECT_TYPES: AspectType[] = ['conjunction', 'semi-sextile', 'sextile', 'square', 'trine', 'quincunx', 'opposition'];

/**
 * Get the sign index (0-11) for a given sign
 */
export function getSignIndex(sign: ZodiacSign): number {
  return SIGNS.indexOf(sign);
}

/**
 * Get the sign at a given index (wrapping around the zodiac)
 */
export function getSignAtIndex(index: number): ZodiacSign {
  const normalizedIndex = ((index % 12) + 12) % 12; // Handle negative indices
  return SIGNS[normalizedIndex];
}

/**
 * Calculate which signs form a specific aspect with the given sign
 * @param sign The reference sign
 * @param aspectType The type of aspect to calculate
 * @returns Array of signs that form this aspect with the reference sign
 */
export function getAspectingSigns(sign: ZodiacSign, aspectType: AspectType): ZodiacSign[] {
  const signIndex = getSignIndex(sign);
  const aspect = ASPECT_DEFINITIONS[aspectType];
  const stepsAway = aspect.angle / 30; // Each sign is 30 degrees

  if (aspectType === 'conjunction') {
    return [sign]; // Same sign
  }

  if (aspectType === 'opposition') {
    return [getSignAtIndex(signIndex + 6)]; // 180° = 6 signs
  }

  // For sextile, square, trine - there are two signs at that angle
  return [
    getSignAtIndex(signIndex + stepsAway),
    getSignAtIndex(signIndex - stepsAway),
  ];
}

/**
 * Get all signs that form any major aspect with the reference sign
 * @param sign The reference sign
 * @returns Map of aspect types to signs
 */
export function getAllAspects(sign: ZodiacSign): Record<AspectType, ZodiacSign[]> {
  return {
    conjunction: getAspectingSigns(sign, 'conjunction'),
    'semi-sextile': getAspectingSigns(sign, 'semi-sextile'),
    sextile: getAspectingSigns(sign, 'sextile'),
    square: getAspectingSigns(sign, 'square'),
    trine: getAspectingSigns(sign, 'trine'),
    quincunx: getAspectingSigns(sign, 'quincunx'),
    opposition: getAspectingSigns(sign, 'opposition'),
  };
}

/**
 * Determine what aspect (if any) exists between two signs
 * @param signA First sign
 * @param signB Second sign
 * @returns The aspect type or null if no major aspect
 */
export function getAspectBetweenSigns(signA: ZodiacSign, signB: ZodiacSign): AspectType | null {
  const indexA = getSignIndex(signA);
  const indexB = getSignIndex(signB);
  const diff = Math.abs(indexA - indexB);
  const steps = Math.min(diff, 12 - diff); // Shortest path around the wheel

  switch (steps) {
    case 0: return 'conjunction';
    case 1: return 'semi-sextile'; // 30° = 1 sign
    case 2: return 'sextile';   // 60° = 2 signs
    case 3: return 'square';    // 90° = 3 signs
    case 4: return 'trine';     // 120° = 4 signs
    case 5: return 'quincunx';  // 150° = 5 signs
    case 6: return 'opposition'; // 180° = 6 signs
    default: return null;
  }
}

/**
 * Get the angle in degrees between two signs
 * @param signA First sign
 * @param signB Second sign
 * @returns Angle in degrees (0-180)
 */
export function getAngleBetweenSigns(signA: ZodiacSign, signB: ZodiacSign): number {
  const indexA = getSignIndex(signA);
  const indexB = getSignIndex(signB);
  const diff = Math.abs(indexA - indexB);
  const steps = Math.min(diff, 12 - diff);
  return steps * 30;
}

// =============================================================================
// SOLAR PHASE (DECANS)
// =============================================================================

export function getSolarPhase(localDegree: number): string {
  if (localDegree < 10) return 'Early (Decan I)';
  if (localDegree < 20) return 'Middle (Decan II)';
  return 'Late (Decan III)';
}

// =============================================================================
// HEMISPHERE UTILITIES
// =============================================================================

export function getHemisphere(lat: number): 'north' | 'south' {
  return lat >= 0 ? 'north' : 'south';
}

export function mapSeasonForHemisphere(season: string, hemisphere: 'north' | 'south'): string {
  return HEMISPHERE_SEASON_MAP[hemisphere][season as Season];
}

// =============================================================================
// D3 DATA STRUCTURES
// =============================================================================

export interface D3SeasonArc {
  season: Season;
  startAngle: number;
  endAngle: number;
  color: string;
  icon: string;
  signs: ZodiacSign[];
}

export interface D3SignArc {
  sign: ZodiacSign;
  symbol: string;
  element: string;
  modality: string;
  season: string;
  startAngle: number;
  endAngle: number;
  color: string;
  dateRange: string;
}

export function buildD3SeasonArcs(): D3SeasonArc[] {
  // Seasons aligned with zodiac: Spring (Aries) at 12 o'clock (0°)
  // D3 arc angles: 0 = top (12 o'clock), positive = clockwise
  const seasonStartDegrees: Record<Season, number> = {
    Spring: 0,    // Aries at 12 o'clock
    Summer: 90,   // Cancer at 3 o'clock
    Autumn: 180,  // Libra at 6 o'clock
    Winter: 270,  // Capricorn at 9 o'clock
  };

  return SEASONS.map(season => {
    const startDeg = seasonStartDegrees[season];
    const endDeg = (startDeg + 90) % 360 || 360;

    // Convert to radians (D3 arc: 0 = 12 o'clock, clockwise positive)
    const startAngle = (startDeg * Math.PI) / 180;
    const endAngle = (endDeg * Math.PI) / 180;

    return {
      season,
      startAngle,
      endAngle: endAngle <= startAngle ? endAngle + 2 * Math.PI : endAngle,
      color: SEASON_COLORS[season],
      icon: SEASON_ICONS[season],
      signs: SEASON_ORDER[season],
    };
  });
}

export function buildD3SignArcs(): D3SignArc[] {
  // Aries (0°) at 12 o'clock, signs proceed clockwise
  return SIGN_METADATA.map(meta => {
    const startDeg = meta.degreeStart;
    const endDeg = meta.degreeEnd;

    // Convert to radians (D3 arc: 0 = 12 o'clock, clockwise positive)
    const startAngle = (startDeg * Math.PI) / 180;
    const endAngle = (endDeg * Math.PI) / 180;

    return {
      sign: meta.sign,
      symbol: meta.symbol,
      element: meta.element,
      modality: meta.modality,
      season: meta.season,
      startAngle,
      endAngle: endAngle <= startAngle ? endAngle + 2 * Math.PI : endAngle,
      color: ELEMENT_COLORS[meta.element],
      dateRange: meta.dateRange,
    };
  });
}

export default {
  SIGNS,
  ELEMENT,
  MODALITY,
  SEASON,
  POLARITY,
  SEASON_ORDER,
  SIGN_METADATA,
  SEASONAL_PROFILES,
  calculateCompatibility,
  buildD3SeasonArcs,
  buildD3SignArcs,
};
