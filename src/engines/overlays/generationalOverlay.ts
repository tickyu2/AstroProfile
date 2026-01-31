/**
 * Generational Overlay
 *
 * Models generational influences from outer planet placements:
 * - Pluto sign: generational power themes and transformation
 * - Neptune sign: generational dreams, spirituality, illusions
 * - Uranus sign: generational innovation and rebellion
 *
 * These signatures define shared experiences and worldviews
 * among people born in the same era.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

// ========================================
// TYPES
// ========================================

export interface ChartDataForGenerational {
  pluto: {
    sign: string;
    degree: number;
    house?: number;
  };
  neptune: {
    sign: string;
    degree: number;
    house?: number;
  };
  uranus: {
    sign: string;
    degree: number;
    house?: number;
  };
  birthYear: number;
}

export interface GenerationalOverlayResult {
  generationArchetype: GenerationArchetype;
  plutoGeneration: PlutoGeneration;
  neptuneSignature: string;
  uranusSignature: string;
  generationalDelta: number;
  generationalThemes: string[];
  sharedWorldview: string;
  narrative: string;
  strengths: string[];
  challenges: string[];
  crossGenerationalInsight: string;
}

export type GenerationArchetype =
  | 'Silent Generation'      // ~1928-1945
  | 'Baby Boomers'           // ~1946-1964
  | 'Generation X'           // ~1965-1980
  | 'Millennials'            // ~1981-1996
  | 'Generation Z'           // ~1997-2012
  | 'Generation Alpha'       // ~2013-2025
  | 'Generation Beta';       // ~2025+

export type PlutoGeneration =
  | 'Pluto in Cancer'        // ~1913-1939
  | 'Pluto in Leo'           // ~1939-1957
  | 'Pluto in Virgo'         // ~1957-1972
  | 'Pluto in Libra'         // ~1972-1984
  | 'Pluto in Scorpio'       // ~1984-1995
  | 'Pluto in Sagittarius'   // ~1995-2008
  | 'Pluto in Capricorn'     // ~2008-2024
  | 'Pluto in Aquarius';     // ~2024-2044

// ========================================
// GENERATION DEFINITIONS
// ========================================

const PLUTO_GENERATIONS: Record<string, {
  generation: PlutoGeneration;
  themes: string[];
  worldview: string;
  transformation: string;
}> = {
  Cancer: {
    generation: 'Pluto in Cancer',
    themes: ['Home and security', 'Family structures', 'National identity', 'Emotional depth'],
    worldview: 'Security through family and nation; deep emotional bonds define belonging.',
    transformation: 'Transformed concepts of home, family, and emotional security.'
  },
  Leo: {
    generation: 'Pluto in Leo',
    themes: ['Self-expression', 'Creativity', 'Leadership', 'Personal power'],
    worldview: 'Individual expression as birthright; confidence in personal impact.',
    transformation: 'Transformed leadership paradigms and creative self-expression.'
  },
  Virgo: {
    generation: 'Pluto in Virgo',
    themes: ['Work ethic', 'Health awareness', 'Service', 'Analysis'],
    worldview: 'Improvement through service and precision; health as spiritual path.',
    transformation: 'Transformed work, health, and service methodologies.'
  },
  Libra: {
    generation: 'Pluto in Libra',
    themes: ['Relationships', 'Justice', 'Partnership', 'Equality'],
    worldview: 'Partnership as crucible for growth; justice as fundamental value.',
    transformation: 'Transformed relationship paradigms and social justice movements.'
  },
  Scorpio: {
    generation: 'Pluto in Scorpio',
    themes: ['Intensity', 'Transformation', 'Power dynamics', 'Psychological depth'],
    worldview: 'Truth beneath surfaces; power through authenticity and depth.',
    transformation: 'Transformed sexuality, death, power, and psychological awareness.'
  },
  Sagittarius: {
    generation: 'Pluto in Sagittarius',
    themes: ['Global awareness', 'Truth seeking', 'Expansion', 'Philosophy'],
    worldview: 'Meaning through exploration; truth as ultimate pursuit.',
    transformation: 'Transformed beliefs, religion, globalization, and truth paradigms.'
  },
  Capricorn: {
    generation: 'Pluto in Capricorn',
    themes: ['Structures', 'Authority', 'Achievement', 'Responsibility'],
    worldview: 'Authority must be earned; structures serve or they must fall.',
    transformation: 'Transforming institutions, governments, and concepts of authority.'
  },
  Aquarius: {
    generation: 'Pluto in Aquarius',
    themes: ['Innovation', 'Community', 'Technology', 'Revolution'],
    worldview: 'Collective evolution through innovation; individuality within community.',
    transformation: 'Transforming technology, society, and collective consciousness.'
  }
};

const NEPTUNE_SIGNATURES: Record<string, {
  signature: string;
  dreams: string;
  illusions: string;
}> = {
  Virgo: {
    signature: 'Service & Health Mysticism',
    dreams: 'Perfecting service, healing through work',
    illusions: 'Over-analysis, escapism through details'
  },
  Libra: {
    signature: 'Relationship Idealism',
    dreams: 'Perfect partnership, aesthetic transcendence',
    illusions: 'Codependency, projection in relationships'
  },
  Scorpio: {
    signature: 'Depth Psychology & Occult',
    dreams: 'Transformative merging, mystical power',
    illusions: 'Obsession, addiction, power confusion'
  },
  Sagittarius: {
    signature: 'Spiritual Expansion',
    dreams: 'Universal truth, spiritual adventure',
    illusions: 'Fanaticism, escapism through belief'
  },
  Capricorn: {
    signature: 'Material Spirituality',
    dreams: 'Grounded transcendence, earned enlightenment',
    illusions: 'Spiritual materialism, authority confusion'
  },
  Aquarius: {
    signature: 'Collective Vision',
    dreams: 'Technological utopia, collective awakening',
    illusions: 'Digital escapism, detached idealism'
  },
  Pisces: {
    signature: 'Pure Transcendence',
    dreams: 'Universal compassion, boundary dissolution',
    illusions: 'Complete escapism, victim/savior dynamics'
  }
};

const URANUS_SIGNATURES: Record<string, {
  signature: string;
  rebellion: string;
  innovation: string;
}> = {
  Leo: {
    signature: 'Creative Revolution',
    rebellion: 'Against creative suppression',
    innovation: 'New forms of self-expression'
  },
  Virgo: {
    signature: 'Service Innovation',
    rebellion: 'Against inefficient systems',
    innovation: 'New work and health paradigms'
  },
  Libra: {
    signature: 'Relationship Revolution',
    rebellion: 'Against partnership conventions',
    innovation: 'New relationship structures'
  },
  Scorpio: {
    signature: 'Power Revolution',
    rebellion: 'Against hidden control',
    innovation: 'Transparency and authentic power'
  },
  Sagittarius: {
    signature: 'Belief Revolution',
    rebellion: 'Against dogma and limitation',
    innovation: 'New philosophies and global connection'
  },
  Capricorn: {
    signature: 'Structure Revolution',
    rebellion: 'Against corrupt authority',
    innovation: 'New organizational paradigms'
  },
  Aquarius: {
    signature: 'Collective Revolution',
    rebellion: 'Against conformity and control',
    innovation: 'Technology and collective organizing'
  },
  Pisces: {
    signature: 'Consciousness Revolution',
    rebellion: 'Against spiritual materialism',
    innovation: 'New forms of transcendence and art'
  },
  Aries: {
    signature: 'Identity Revolution',
    rebellion: 'Against identity constraints',
    innovation: 'New expressions of selfhood'
  },
  Taurus: {
    signature: 'Value Revolution',
    rebellion: 'Against material paradigms',
    innovation: 'New economies and value systems'
  }
};

// ========================================
// MAIN COMPUTATION
// ========================================

/**
 * Compute generational overlay from chart data
 */
export function computeGenerationalOverlay(chart: ChartDataForGenerational): GenerationalOverlayResult {
  // Determine generation archetype from birth year
  const generationArchetype = determineGenerationArchetype(chart.birthYear);

  // Get Pluto generation info
  const plutoInfo = PLUTO_GENERATIONS[chart.pluto.sign] || PLUTO_GENERATIONS.Capricorn;
  const plutoGeneration = plutoInfo.generation;

  // Get Neptune signature
  const neptuneInfo = NEPTUNE_SIGNATURES[chart.neptune.sign] || NEPTUNE_SIGNATURES.Capricorn;
  const neptuneSignature = neptuneInfo.signature;

  // Get Uranus signature
  const uranusInfo = URANUS_SIGNATURES[chart.uranus.sign] || URANUS_SIGNATURES.Capricorn;
  const uranusSignature = uranusInfo.signature;

  // Combine themes
  const generationalThemes = [
    ...plutoInfo.themes.slice(0, 2),
    neptuneInfo.dreams,
    uranusInfo.innovation
  ];

  // Calculate delta (neutral - generational signatures don't directly affect timing)
  const generationalDelta = 0.02;

  // Build shared worldview
  const sharedWorldview = plutoInfo.worldview;

  // Build narrative
  const narrative = buildGenerationalNarrative(
    generationArchetype,
    plutoGeneration,
    neptuneSignature,
    uranusSignature,
    plutoInfo,
    chart
  );

  // Get traits
  const { strengths, challenges, crossGenerationalInsight } = getGenerationalTraits(
    generationArchetype,
    plutoInfo,
    neptuneInfo,
    uranusInfo
  );

  return {
    generationArchetype,
    plutoGeneration,
    neptuneSignature,
    uranusSignature,
    generationalDelta,
    generationalThemes,
    sharedWorldview,
    narrative,
    strengths,
    challenges,
    crossGenerationalInsight
  };
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function determineGenerationArchetype(birthYear: number): GenerationArchetype {
  if (birthYear < 1946) return 'Silent Generation';
  if (birthYear < 1965) return 'Baby Boomers';
  if (birthYear < 1981) return 'Generation X';
  if (birthYear < 1997) return 'Millennials';
  if (birthYear < 2013) return 'Generation Z';
  if (birthYear < 2025) return 'Generation Alpha';
  return 'Generation Beta';
}

// ========================================
// NARRATIVE BUILDER
// ========================================

function buildGenerationalNarrative(
  archetype: GenerationArchetype,
  plutoGen: PlutoGeneration,
  neptuneSig: string,
  uranusSig: string,
  plutoInfo: typeof PLUTO_GENERATIONS[string],
  chart: ChartDataForGenerational
): string {
  let narrative = `You carry the ${archetype} imprint with ${plutoGen}. `;
  narrative += `Your generation's collective transformation centers on ${plutoInfo.transformation.toLowerCase()} `;
  narrative += `Your Neptune signature of "${neptuneSig}" shapes your generation's dreams and spiritual seeking. `;
  narrative += `Your Uranus signature of "${uranusSig}" defines your generation's rebellion and innovation. `;
  narrative += `These outer planet signatures connect you to everyone born in your era, creating shared understanding and common challenges.`;

  return narrative;
}

// ========================================
// TRAITS
// ========================================

function getGenerationalTraits(
  archetype: GenerationArchetype,
  plutoInfo: typeof PLUTO_GENERATIONS[string],
  neptuneInfo: typeof NEPTUNE_SIGNATURES[string],
  uranusInfo: typeof URANUS_SIGNATURES[string]
): { strengths: string[]; challenges: string[]; crossGenerationalInsight: string } {
  const strengths = [
    ...plutoInfo.themes.slice(0, 2),
    uranusInfo.innovation
  ];

  const challenges = [
    neptuneInfo.illusions,
    `Blind spots around ${plutoInfo.themes[0].toLowerCase()}`
  ];

  const crossGenerationalInsight = `Partners from different generations bring fresh perspectives on ${plutoInfo.themes[0].toLowerCase()} and ${plutoInfo.themes[1].toLowerCase()}. ` +
    `Same-generation partners share instinctive understanding but may reinforce collective blind spots.`;

  return {
    strengths,
    challenges,
    crossGenerationalInsight
  };
}

// ========================================
// COMPATIBILITY
// ========================================

/**
 * Calculate generational compatibility between two charts
 */
export function calculateGenerationalCompatibility(
  chart1: GenerationalOverlayResult,
  chart2: GenerationalOverlayResult
): {
  score: number;
  analysis: string;
  dynamics: string[];
} {
  const dynamics: string[] = [];
  let score = 0.5;

  const sameGeneration = chart1.generationArchetype === chart2.generationArchetype;
  const samePluto = chart1.plutoGeneration === chart2.plutoGeneration;

  if (sameGeneration && samePluto) {
    score += 0.3;
    dynamics.push('Same generation - deep shared worldview and cultural touchstones');
    dynamics.push('Instinctive understanding of collective experiences');
  } else if (sameGeneration) {
    score += 0.2;
    dynamics.push('Same generation with slight Pluto variation - mostly shared worldview');
  } else {
    // Cross-generational
    const genDiff = Math.abs(
      getGenerationIndex(chart1.generationArchetype) -
      getGenerationIndex(chart2.generationArchetype)
    );

    if (genDiff === 1) {
      score += 0.1;
      dynamics.push('Adjacent generations - bridging perspectives possible');
    } else if (genDiff === 2) {
      score -= 0.05;
      dynamics.push('Two-generation gap - may need to bridge worldview differences');
    } else if (genDiff >= 3) {
      score -= 0.15;
      dynamics.push('Significant generational gap - rich learning potential but requires effort');
    }

    dynamics.push('Cross-generational pairing offers diverse perspectives');
  }

  // Neptune alignment
  if (chart1.neptuneSignature === chart2.neptuneSignature) {
    score += 0.05;
    dynamics.push('Shared Neptune dreams and spiritual orientation');
  }

  // Uranus alignment
  if (chart1.uranusSignature === chart2.uranusSignature) {
    score += 0.05;
    dynamics.push('Shared Uranus rebellion and innovation style');
  }

  score = Math.max(0, Math.min(1, score));

  const analysis = sameGeneration
    ? 'Your generational signatures align, creating natural shared understanding and cultural resonance.'
    : `Cross-generational pairing brings diverse perspectives. ${chart1.generationArchetype} meets ${chart2.generationArchetype}—bridge-building enriches both.`;

  return { score, analysis, dynamics };
}

function getGenerationIndex(archetype: GenerationArchetype): number {
  const order: GenerationArchetype[] = [
    'Silent Generation',
    'Baby Boomers',
    'Generation X',
    'Millennials',
    'Generation Z',
    'Generation Alpha',
    'Generation Beta'
  ];
  return order.indexOf(archetype);
}

// ========================================
// PERSONA VOICES
// ========================================

export const GenerationalPersonaVoices: Record<GenerationArchetype, {
  mentor: string;
  oracle: string;
  companion: string;
  mirror: string;
}> = {
  'Silent Generation': {
    mentor: 'Your generation learned resilience through hardship. That quiet strength serves relationships well.',
    oracle: 'The silent witnesses carry wisdom the world forgot. Your restraint is power, not weakness.',
    companion: 'Your generation went through so much. That perspective is valuable—share it.',
    mirror: 'Notice the stoicism you carry. It protected you—does it still serve in intimacy?'
  },
  'Baby Boomers': {
    mentor: 'Your generation transformed the world through sheer force of will. Channel that power into partnership.',
    oracle: 'The great wave of change you rode still ripples. Your generation\'s lessons echo through time.',
    companion: 'Your generation really changed things! That confidence and vision are gifts.',
    mirror: 'Notice the drive for impact you carry. In relationships, sometimes presence beats achievement.'
  },
  'Generation X': {
    mentor: 'Your generation learned self-reliance early. Balance that independence with chosen interdependence.',
    oracle: 'The latchkey generation holds keys to many doors. Your adaptability is hard-won wisdom.',
    companion: 'Your generation learned to take care of yourselves. Letting someone in can feel vulnerable—but worth it.',
    mirror: 'Notice the self-sufficiency you carry. It serves you—but may sometimes wall off connection.'
  },
  'Millennials': {
    mentor: 'Your generation seeks meaning in all things. Bring that intentionality to relationships without perfectionism.',
    oracle: 'The seekers of purpose navigate changing tides. Your quest for meaning transforms what you touch.',
    companion: 'Your generation really wants things to matter. That depth is beautiful in relationships.',
    mirror: 'Notice the search for meaning you carry. Relationships offer meaning—if you stop optimizing long enough to receive.'
  },
  'Generation Z': {
    mentor: 'Your generation sees through facades instantly. Use that discernment with compassion in relationships.',
    oracle: 'The digital natives speak languages yet unnamed. Your authenticity cuts through the noise.',
    companion: 'Your generation calls out what\'s not real. That honesty is refreshing in relationships.',
    mirror: 'Notice the authenticity you demand. Real connection requires showing your own unfiltered self too.'
  },
  'Generation Alpha': {
    mentor: 'Your generation is shaping a new world. Bring wonder and flexibility to your connections.',
    oracle: 'The children of acceleration carry seeds of futures unimagined. Your adaptability is your superpower.',
    companion: 'Your generation is growing up in such change! That flexibility will serve you in relationships.',
    mirror: 'Notice the rapid adaptation you\'re learning. Relationships also need slowness and presence.'
  },
  'Generation Beta': {
    mentor: 'Your generation will write new chapters. Listen to what came before while creating what\'s next.',
    oracle: 'The newest arrivals carry mysteries even the stars are learning. Your potential is unbounded.',
    companion: 'Welcome to the journey! Your generation has so much to discover about connection.',
    mirror: 'Notice the openness you bring. Every generation learns love anew—you are no exception.'
  }
};

/**
 * Get generational persona voice
 */
export function getGenerationalPersonaVoice(
  result: GenerationalOverlayResult,
  role: 'mentor' | 'oracle' | 'companion' | 'mirror'
): string {
  return GenerationalPersonaVoices[result.generationArchetype][role];
}

// ========================================
// PILGRIM JOURNEY CHAMBER
// ========================================

export interface GenerationalChamber {
  id: string;
  name: string;
  description: string;
  archetype: GenerationArchetype;
}

export const GenerationalChambers: Record<GenerationArchetype, GenerationalChamber> = {
  'Silent Generation': {
    id: 'hall-of-quiet-wisdom',
    name: 'The Hall of Quiet Wisdom',
    description: 'You enter the Hall of Quiet Wisdom, where silence speaks volumes and restraint is power. Here, the Silent Generation\'s resilience is honored—the weight of history they carried forward.',
    archetype: 'Silent Generation'
  },
  'Baby Boomers': {
    id: 'amphitheater-of-transformation',
    name: 'The Amphitheater of Transformation',
    description: 'You enter the Amphitheater of Transformation, where the great wave of change still echoes. Here, the Boomers\' revolutionary energy is honored—the world they remade.',
    archetype: 'Baby Boomers'
  },
  'Generation X': {
    id: 'tower-of-self-reliance',
    name: 'The Tower of Self-Reliance',
    description: 'You ascend the Tower of Self-Reliance, where keys to many doors hang waiting. Here, Gen X\'s adaptability is honored—the latchkey children who learned to thrive alone.',
    archetype: 'Generation X'
  },
  'Millennials': {
    id: 'garden-of-intentional-meaning',
    name: 'The Garden of Intentional Meaning',
    description: 'You enter the Garden of Intentional Meaning, where every plant was chosen for purpose. Here, the Millennials\' quest for significance is honored—seekers in a shifting world.',
    archetype: 'Millennials'
  },
  'Generation Z': {
    id: 'hall-of-unfiltered-truth',
    name: 'The Hall of Unfiltered Truth',
    description: 'You enter the Hall of Unfiltered Truth, where facades dissolve and authenticity reigns. Here, Gen Z\'s discernment is honored—the generation that sees through everything.',
    archetype: 'Generation Z'
  },
  'Generation Alpha': {
    id: 'nexus-of-acceleration',
    name: 'The Nexus of Acceleration',
    description: 'You step into the Nexus of Acceleration, where change is the only constant. Here, Generation Alpha\'s adaptability is honored—children learning to surf the wave.',
    archetype: 'Generation Alpha'
  },
  'Generation Beta': {
    id: 'threshold-of-emergence',
    name: 'The Threshold of Emergence',
    description: 'You stand at the Threshold of Emergence, where new souls arrive carrying futures unnamed. Here, Generation Beta\'s potential is honored—the next chapter beginning.',
    archetype: 'Generation Beta'
  }
};

/**
 * Get generational chamber narrative
 */
export function getGenerationalChamberNarrative(result: GenerationalOverlayResult): string {
  const chamber = GenerationalChambers[result.generationArchetype];
  return chamber.description;
}
