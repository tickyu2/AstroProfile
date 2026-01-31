/**
 * Archetype Overlay
 *
 * Extracts mythic archetypes from the natal chart:
 * King, Innovator, Healer, Mystic, Warrior, Strategist, Lover, Rebel
 *
 * Based on Sun, Moon, Rising, dominant planet, and elemental emphasis.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

// ========================================
// TYPES
// ========================================

export type Archetype =
  | 'King'
  | 'Innovator'
  | 'Healer'
  | 'Mystic'
  | 'Warrior'
  | 'Strategist'
  | 'Lover'
  | 'Rebel'
  | 'Sage'
  | 'Creator';

export interface ChartDataForArchetype {
  sun: { sign: string; house: number };
  moon: { sign: string; house: number };
  ascendant: { sign: string };
  dominantPlanet?: string;
  planets: Array<{ planet: string; sign: string; house: number }>;
}

export interface ArchetypeOverlayResult {
  primary: Archetype;
  secondary: Archetype;
  tertiary?: Archetype;
  archetypeScore: number;       // 0..1 (strength of archetype expression)
  archetypeDelta: number;       // contribution to decision
  archetypeWeights: Record<Archetype, number>;
  narrative: string;
  coreStatements: string[];
  shadowAspects: string[];
  relationshipStyle: string;
}

// ========================================
// ARCHETYPE MAPPINGS
// ========================================

const SIGN_TO_ARCHETYPES: Record<string, Archetype[]> = {
  Aries: ['Warrior', 'Rebel'],
  Taurus: ['Lover', 'Creator'],
  Gemini: ['Innovator', 'Sage'],
  Cancer: ['Healer', 'Mystic'],
  Leo: ['King', 'Creator'],
  Virgo: ['Healer', 'Strategist'],
  Libra: ['Lover', 'Strategist'],
  Scorpio: ['Mystic', 'Warrior'],
  Sagittarius: ['Sage', 'Rebel'],
  Capricorn: ['King', 'Strategist'],
  Aquarius: ['Innovator', 'Rebel'],
  Pisces: ['Mystic', 'Healer']
};

const PLANET_TO_ARCHETYPES: Record<string, Archetype[]> = {
  Sun: ['King', 'Creator'],
  Moon: ['Healer', 'Mystic'],
  Mercury: ['Innovator', 'Sage'],
  Venus: ['Lover', 'Creator'],
  Mars: ['Warrior', 'Rebel'],
  Jupiter: ['Sage', 'King'],
  Saturn: ['Strategist', 'King'],
  Uranus: ['Rebel', 'Innovator'],
  Neptune: ['Mystic', 'Healer'],
  Pluto: ['Mystic', 'Warrior']
};

const ARCHETYPE_PROFILES: Record<Archetype, {
  title: string;
  coreStatement: string;
  shadow: string;
  relationshipStyle: string;
  element: 'fire' | 'water' | 'air' | 'earth' | 'spirit';
}> = {
  King: {
    title: 'The Sovereign',
    coreStatement: 'I lead through presence and natural authority.',
    shadow: 'May become tyrannical or overly controlling when threatened.',
    relationshipStyle: 'Protector and provider; needs recognition and respect.',
    element: 'fire'
  },
  Innovator: {
    title: 'The Visionary',
    coreStatement: 'I see possibilities others cannot yet imagine.',
    shadow: 'May become detached or lost in abstraction.',
    relationshipStyle: 'Mentally stimulating partner; needs intellectual freedom.',
    element: 'air'
  },
  Healer: {
    title: 'The Nurturer',
    coreStatement: 'I restore wholeness through compassionate presence.',
    shadow: 'May become a martyr or neglect self for others.',
    relationshipStyle: 'Deeply caring partner; needs emotional safety and appreciation.',
    element: 'water'
  },
  Mystic: {
    title: 'The Seer',
    coreStatement: 'I perceive the invisible threads connecting all things.',
    shadow: 'May become lost in illusion or escapism.',
    relationshipStyle: 'Soul-deep connection seeker; needs spiritual resonance.',
    element: 'spirit'
  },
  Warrior: {
    title: 'The Champion',
    coreStatement: 'I fight for what matters with unwavering courage.',
    shadow: 'May become aggressive or create conflict unnecessarily.',
    relationshipStyle: 'Passionate and protective; needs challenges and respect.',
    element: 'fire'
  },
  Strategist: {
    title: 'The Architect',
    coreStatement: 'I build lasting structures through careful planning.',
    shadow: 'May become rigid or overly calculating.',
    relationshipStyle: 'Reliable and committed; needs stability and clear goals.',
    element: 'earth'
  },
  Lover: {
    title: 'The Unifier',
    coreStatement: 'I create beauty and harmony through connection.',
    shadow: 'May become dependent or lose self in others.',
    relationshipStyle: 'Romantic and devoted; needs beauty and emotional intimacy.',
    element: 'water'
  },
  Rebel: {
    title: 'The Liberator',
    coreStatement: 'I break chains and create space for authentic expression.',
    shadow: 'May become destructive or contrarian without purpose.',
    relationshipStyle: 'Freedom-loving partner; needs autonomy and acceptance of uniqueness.',
    element: 'air'
  },
  Sage: {
    title: 'The Teacher',
    coreStatement: 'I seek and share wisdom for the benefit of all.',
    shadow: 'May become preachy or detached from practical reality.',
    relationshipStyle: 'Philosophical partner; needs meaningful exchange and growth.',
    element: 'air'
  },
  Creator: {
    title: 'The Artist',
    coreStatement: 'I bring forth new forms from the raw material of life.',
    shadow: 'May become self-absorbed or struggle with completion.',
    relationshipStyle: 'Expressive and playful; needs appreciation and creative freedom.',
    element: 'fire'
  }
};

// ========================================
// MAIN COMPUTATION
// ========================================

/**
 * Compute Archetype Overlay from chart data
 */
export function computeArchetypeOverlay(chart: ChartDataForArchetype): ArchetypeOverlayResult {
  const archetypeWeights = initializeWeights();

  // Sun sign contribution (strongest)
  const sunArchetypes = SIGN_TO_ARCHETYPES[chart.sun.sign] || [];
  for (const arch of sunArchetypes) {
    archetypeWeights[arch] += 0.3;
  }

  // Moon sign contribution
  const moonArchetypes = SIGN_TO_ARCHETYPES[chart.moon.sign] || [];
  for (const arch of moonArchetypes) {
    archetypeWeights[arch] += 0.2;
  }

  // Ascendant contribution
  const ascArchetypes = SIGN_TO_ARCHETYPES[chart.ascendant.sign] || [];
  for (const arch of ascArchetypes) {
    archetypeWeights[arch] += 0.2;
  }

  // Dominant planet contribution
  if (chart.dominantPlanet) {
    const planetArchetypes = PLANET_TO_ARCHETYPES[chart.dominantPlanet] || [];
    for (const arch of planetArchetypes) {
      archetypeWeights[arch] += 0.15;
    }
  }

  // House emphasis contribution
  applyHouseEmphasis(archetypeWeights, chart);

  // Sort by weight to find primary, secondary, tertiary
  const sorted = Object.entries(archetypeWeights)
    .sort((a, b) => b[1] - a[1]) as [Archetype, number][];

  const primary = sorted[0][0];
  const secondary = sorted[1][0];
  const tertiary = sorted[2] ? sorted[2][0] : undefined;

  // Calculate archetype score (how strongly the archetype pattern is expressed)
  const topWeight = sorted[0][1];
  const archetypeScore = Math.min(1, topWeight);

  // Calculate delta for decision engine
  const archetypeDelta = archetypeScore * 0.05;

  // Build narrative and other outputs
  const primaryProfile = ARCHETYPE_PROFILES[primary];
  const secondaryProfile = ARCHETYPE_PROFILES[secondary];

  const narrative = buildArchetypeNarrative(primary, secondary, tertiary, archetypeScore);

  const coreStatements = [
    primaryProfile.coreStatement,
    secondaryProfile.coreStatement
  ];

  const shadowAspects = [
    `Primary shadow: ${primaryProfile.shadow}`,
    `Secondary shadow: ${secondaryProfile.shadow}`
  ];

  const relationshipStyle = `${primaryProfile.relationshipStyle} With ${secondary} undertones: ${secondaryProfile.relationshipStyle}`;

  return {
    primary,
    secondary,
    tertiary,
    archetypeScore,
    archetypeDelta,
    archetypeWeights,
    narrative,
    coreStatements,
    shadowAspects,
    relationshipStyle
  };
}

// ========================================
// HELPERS
// ========================================

function initializeWeights(): Record<Archetype, number> {
  return {
    King: 0,
    Innovator: 0,
    Healer: 0,
    Mystic: 0,
    Warrior: 0,
    Strategist: 0,
    Lover: 0,
    Rebel: 0,
    Sage: 0,
    Creator: 0
  };
}

function applyHouseEmphasis(weights: Record<Archetype, number>, chart: ChartDataForArchetype): void {
  // House-based archetype emphasis
  const houseArchetypes: Record<number, Archetype[]> = {
    1: ['Warrior', 'King'],           // Self, identity
    2: ['Lover', 'Strategist'],       // Values, resources
    3: ['Innovator', 'Sage'],         // Communication, learning
    4: ['Healer', 'Mystic'],          // Home, roots
    5: ['Creator', 'Lover'],          // Creativity, romance
    6: ['Healer', 'Strategist'],      // Service, health
    7: ['Lover', 'Strategist'],       // Partnerships
    8: ['Mystic', 'Warrior'],         // Transformation
    9: ['Sage', 'Rebel'],             // Philosophy, expansion
    10: ['King', 'Strategist'],       // Career, authority
    11: ['Rebel', 'Innovator'],       // Community, ideals
    12: ['Mystic', 'Healer']          // Spirituality, hidden
  };

  // Check Sun and Moon houses
  for (const arch of (houseArchetypes[chart.sun.house] || [])) {
    weights[arch] += 0.1;
  }
  for (const arch of (houseArchetypes[chart.moon.house] || [])) {
    weights[arch] += 0.05;
  }
}

function buildArchetypeNarrative(
  primary: Archetype,
  secondary: Archetype,
  tertiary: Archetype | undefined,
  score: number
): string {
  const primaryProfile = ARCHETYPE_PROFILES[primary];
  const secondaryProfile = ARCHETYPE_PROFILES[secondary];

  let narrative = `Your chart expresses **${primaryProfile.title}** (${primary}) as your dominant archetype. "${primaryProfile.coreStatement}" `;

  narrative += `This is colored by the **${secondaryProfile.title}** (${secondary}), adding: "${secondaryProfile.coreStatement}" `;

  if (tertiary) {
    const tertiaryProfile = ARCHETYPE_PROFILES[tertiary];
    narrative += `A ${tertiaryProfile.title} influence also shapes your expression. `;
  }

  if (score > 0.7) {
    narrative += 'This archetypal pattern is strongly expressed in your chart, shaping your fundamental approach to life and relationships.';
  } else if (score > 0.4) {
    narrative += 'This archetypal blend shapes your core identity, though other chart factors add complexity.';
  } else {
    narrative += 'Your archetypal expression is nuanced, with multiple energies competing for expression.';
  }

  return narrative;
}

// ========================================
// ARCHETYPE COMPATIBILITY
// ========================================

const ARCHETYPE_SYNERGIES: Record<Archetype, Archetype[]> = {
  King: ['Strategist', 'Warrior', 'Lover'],
  Innovator: ['Rebel', 'Sage', 'Creator'],
  Healer: ['Lover', 'Mystic', 'Sage'],
  Mystic: ['Healer', 'Sage', 'Creator'],
  Warrior: ['King', 'Rebel', 'Strategist'],
  Strategist: ['King', 'Healer', 'Sage'],
  Lover: ['Healer', 'Creator', 'King'],
  Rebel: ['Innovator', 'Warrior', 'Creator'],
  Sage: ['Innovator', 'Mystic', 'Strategist'],
  Creator: ['Lover', 'Rebel', 'Mystic']
};

const ARCHETYPE_TENSIONS: Record<Archetype, Archetype[]> = {
  King: ['Rebel', 'Innovator'],
  Innovator: ['Strategist', 'King'],
  Healer: ['Warrior', 'Rebel'],
  Mystic: ['Warrior', 'Strategist'],
  Warrior: ['Healer', 'Mystic'],
  Strategist: ['Rebel', 'Mystic'],
  Lover: ['Rebel', 'Warrior'],
  Rebel: ['King', 'Strategist'],
  Sage: ['Warrior', 'Lover'],
  Creator: ['Strategist', 'Healer']
};

/**
 * Calculate archetype compatibility between two results
 */
export function calculateArchetypeCompatibility(
  self: ArchetypeOverlayResult,
  partner: ArchetypeOverlayResult
): {
  score: number;
  dynamic: 'Synergistic' | 'Complementary' | 'Challenging' | 'Complex';
  narrative: string;
} {
  let score = 0.5; // baseline

  // Primary archetype synergy
  if (ARCHETYPE_SYNERGIES[self.primary].includes(partner.primary)) {
    score += 0.2;
  }

  // Primary archetype tension
  if (ARCHETYPE_TENSIONS[self.primary].includes(partner.primary)) {
    score -= 0.15;
  }

  // Secondary cross-compatibility
  if (ARCHETYPE_SYNERGIES[self.secondary].includes(partner.primary)) {
    score += 0.1;
  }

  if (ARCHETYPE_SYNERGIES[partner.secondary].includes(self.primary)) {
    score += 0.1;
  }

  // Same archetype (can be bonding or competing)
  if (self.primary === partner.primary) {
    score += 0.05; // Understanding, but possible competition
  }

  score = Math.max(0, Math.min(1, score));

  // Determine dynamic
  let dynamic: 'Synergistic' | 'Complementary' | 'Challenging' | 'Complex';
  if (score > 0.7) dynamic = 'Synergistic';
  else if (score > 0.5) dynamic = 'Complementary';
  else if (score > 0.3) dynamic = 'Complex';
  else dynamic = 'Challenging';

  const narrative = buildCompatibilityNarrative(self, partner, dynamic);

  return { score, dynamic, narrative };
}

function buildCompatibilityNarrative(
  self: ArchetypeOverlayResult,
  partner: ArchetypeOverlayResult,
  dynamic: string
): string {
  return `The ${self.primary}–${partner.primary} pairing creates a ${dynamic.toLowerCase()} dynamic. ` +
    `Your ${ARCHETYPE_PROFILES[self.primary].title} meets their ${ARCHETYPE_PROFILES[partner.primary].title}, ` +
    `bringing together ${ARCHETYPE_PROFILES[self.primary].element} and ${ARCHETYPE_PROFILES[partner.primary].element} energies.`;
}

// ========================================
// PERSONA VOICES
// ========================================

export function getArchetypePersonaVoice(
  archetype: Archetype,
  role: 'mentor' | 'oracle' | 'companion' | 'mirror'
): string {
  const voices: Record<Archetype, Record<string, string>> = {
    King: {
      mentor: 'Lead with the wisdom that true sovereignty serves rather than dominates.',
      oracle: 'The crown rests upon you not by force, but by the recognition of those who follow.',
      companion: 'You have this natural authority. Trust it, but wield it gently.',
      mirror: 'Notice how others look to you for direction. That pull is real.'
    },
    Innovator: {
      mentor: 'Your visions have power—ground them enough to share with others.',
      oracle: 'The future speaks through you. Listen, then translate.',
      companion: 'Your ideas light up the room. Some will catch fire.',
      mirror: 'Notice which of your visions excite you most. Those are worth pursuing.'
    },
    Healer: {
      mentor: 'Your gift for healing others is sacred. Remember to include yourself.',
      oracle: 'You carry medicine that others need. Offer it without depleting yourself.',
      companion: 'You make people feel held. That matters more than you know.',
      mirror: 'Notice who comes to you in pain. They sense something real.'
    },
    Mystic: {
      mentor: 'Your perceptions are valid, even when others cannot see what you see.',
      oracle: 'The veil is thin for you. Walk between worlds with grounded feet.',
      companion: 'Your sensitivity is a gift, not a burden.',
      mirror: 'Notice what you perceive that others miss. That awareness is yours.'
    },
    Warrior: {
      mentor: 'Direct your fire toward what truly matters.',
      oracle: 'The battle chooses you—choose wisely which battles to accept.',
      companion: 'Your courage is contagious. Fight for the right things.',
      mirror: 'Notice what ignites your protective instincts. That reveals your values.'
    },
    Strategist: {
      mentor: 'Your plans provide stability others need. Build with purpose.',
      oracle: 'The structure you create becomes shelter for many.',
      companion: 'Your reliability is a gift. People trust what you build.',
      mirror: 'Notice how you naturally organize complexity. That skill serves others.'
    },
    Lover: {
      mentor: 'Your capacity for connection is profound. Share it consciously.',
      oracle: 'Love flows through you as water through a channel. Direct it wisely.',
      companion: 'You bring beauty to everything you touch.',
      mirror: 'Notice how you create harmony. That impulse is your nature.'
    },
    Rebel: {
      mentor: 'Your disruption has purpose. Ensure it serves liberation, not just opposition.',
      oracle: 'You break what must be broken so something truer can emerge.',
      companion: 'Your refusal to conform creates space for authenticity.',
      mirror: 'Notice what systems feel false to you. Your instinct is accurate.'
    },
    Sage: {
      mentor: 'Share your wisdom generously, but know that experience is each person's teacher.',
      oracle: 'You carry knowledge that transcends books. Speak it when called.',
      companion: 'Your perspective helps others see further.',
      mirror: 'Notice what you understand naturally. That wisdom is earned.'
    },
    Creator: {
      mentor: 'Your creativity is both gift and responsibility. Create with intention.',
      oracle: 'Through you, the unmanifest becomes manifest. Honor the process.',
      companion: 'You bring things into being that didn't exist before. That's magic.',
      mirror: 'Notice what you feel compelled to create. Follow that impulse.'
    }
  };

  return voices[archetype][role];
}

// ========================================
// EXPORTS
// ========================================

export { ARCHETYPE_PROFILES, SIGN_TO_ARCHETYPES, PLANET_TO_ARCHETYPES };
