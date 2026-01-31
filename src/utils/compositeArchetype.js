/**
 * Composite Archetype Engine
 *
 * Based on Liz Greene's integration of Jungian archetypes with astrology.
 * The composite Sun-Moon combination reveals the relationship's core archetype —
 * the mythic story it is living, often without knowing.
 *
 * Every relationship is living a myth. This module names that myth.
 *
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// ELEMENT ARCHETYPE PATTERNS
// ═══════════════════════════════════════════════════════════════════════════

const ELEMENT_MAP = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
};

const MODALITY_MAP = {
  Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
  Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
  Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable'
};

// ═══════════════════════════════════════════════════════════════════════════
// RELATIONSHIP ARCHETYPES
// Based on composite Sun-Moon element combinations
// ═══════════════════════════════════════════════════════════════════════════

const ELEMENT_ARCHETYPES = {
  'Fire-Fire': {
    name: 'The Heroes\' Quest',
    archetype: 'Warrior Companions',
    myth: 'Like Achilles and Patroclus, this relationship is forged in fire. You are fellow warriors on a shared quest, burning bright together.',
    essence: 'Passion, action, adventure, mutual inspiration',
    shadow: 'Competition, burnout, fighting for dominance',
    gift: 'The courage to live boldly, to inspire each other to greatness',
    challenge: 'Learning when to rest. Not everything is a battle to win.',
    mythicJourney: 'Two flames becoming a bonfire — powerful enough to light the world, dangerous enough to consume itself.',
    famousExamples: 'Brad Pitt & Angelina Jolie (during their adventure phase)'
  },
  'Fire-Earth': {
    name: 'The Alchemist\'s Marriage',
    archetype: 'Spirit Meeting Matter',
    myth: 'Like the sacred marriage of Sol and Luna, fire and earth create gold through their union. Vision meets manifestation.',
    essence: 'Dreams becoming reality, passion finding form',
    shadow: 'Fire feels constrained; Earth feels burned',
    gift: 'The ability to actually build what you envision together',
    challenge: 'Honoring both the dream AND the process of building it.',
    mythicJourney: 'The visionary and the builder discovering they need each other.',
    famousExamples: 'Steve Jobs & Laurene Powell Jobs'
  },
  'Fire-Air': {
    name: 'The Divine Spark',
    archetype: 'Prometheus and the Wind',
    myth: 'Fire needs air to burn. This relationship spreads light and ideas, inspiring everyone it touches.',
    essence: 'Inspiration, communication, endless possibility',
    shadow: 'All talk, no grounding; burning too fast',
    gift: 'Infectious enthusiasm that changes minds and hearts',
    challenge: 'Bringing ideas down to earth. Following through.',
    mythicJourney: 'The spark that becomes a movement — if it can find ground.',
    famousExamples: 'John Lennon & Yoko Ono'
  },
  'Fire-Water': {
    name: 'The Steam Engine',
    archetype: 'Volcano Meeting Ocean',
    myth: 'Fire and water create steam — tremendous power, and tremendous volatility. This is a relationship of transformation.',
    essence: 'Intensity, emotional passion, dramatic transformation',
    shadow: 'Scalding each other; volatility; dramatic swings',
    gift: 'The power to transform through passionate feeling',
    challenge: 'Managing intensity without extinguishing or evaporating.',
    mythicJourney: 'Learning to hold fire and water together — impossible, yet real.',
    famousExamples: 'Elizabeth Taylor & Richard Burton'
  },
  'Earth-Earth': {
    name: 'The Mountain Marriage',
    archetype: 'Two Oaks Intertwining',
    myth: 'Like the sacred grove, this relationship builds slowly and lasts through all seasons. Time is your friend.',
    essence: 'Stability, loyalty, building together, sensory pleasure',
    shadow: 'Stagnation, resistance to change, possessiveness',
    gift: 'The ability to create something that genuinely lasts',
    challenge: 'Staying alive inside the stability. Welcoming change.',
    mythicJourney: 'Learning that deep roots allow, rather than prevent, growth.',
    famousExamples: 'Warren Buffett & Astrid Menks'
  },
  'Earth-Air': {
    name: 'The Architect\'s Dream',
    archetype: 'Blueprint Meeting Foundation',
    myth: 'Ideas need form; form needs vision. This relationship builds cathedrals from concepts.',
    essence: 'Practical idealism, building from ideas, structured creativity',
    shadow: 'Earth finds Air unrealistic; Air finds Earth limiting',
    gift: 'The ability to manifest visions in the real world',
    challenge: 'Valuing both the dream AND the labor of building it.',
    mythicJourney: 'The dreamer and the craftsman discovering mutual necessity.',
    famousExamples: 'Bill & Melinda Gates'
  },
  'Earth-Water': {
    name: 'The Garden of Devotion',
    archetype: 'River Meeting Valley',
    myth: 'Water nourishes earth; earth gives water form. This is a relationship of natural, fertile flow.',
    essence: 'Nurturing, emotional security, growth through feeling',
    shadow: 'Mud (stuck together), flooding, erosion',
    gift: 'Creating genuine emotional safety that allows growth',
    challenge: 'Maintaining form without becoming rigid.',
    mythicJourney: 'Learning that containment and flow serve each other.',
    famousExamples: 'Queen Elizabeth II & Prince Philip'
  },
  'Air-Air': {
    name: 'The Meeting of Minds',
    archetype: 'Two Winds Dancing',
    myth: 'Like great intellectual companions, this relationship lives in the realm of ideas, connection, and endless conversation.',
    essence: 'Communication, ideas, social connection, mental intimacy',
    shadow: 'Living in heads, avoiding depth, scattered energy',
    gift: 'A partnership that keeps both minds brilliantly alive',
    challenge: 'Dropping from head to heart. Staying with feeling.',
    mythicJourney: 'Discovering that real connection requires landing occasionally.',
    famousExamples: 'Jean-Paul Sartre & Simone de Beauvoir'
  },
  'Air-Water': {
    name: 'The Poet\'s Union',
    archetype: 'Cloud Meeting Sea',
    myth: 'Thought and feeling, word and emotion — this relationship gives form to the formless through expression.',
    essence: 'Emotional intelligence, creative expression, depth with lightness',
    shadow: 'Overthinking feelings; feelings overwhelming thought',
    gift: 'The ability to name and communicate what others only feel',
    challenge: 'Balancing analysis with pure feeling.',
    mythicJourney: 'The eternal dance of heart and mind learning to be partners.',
    famousExamples: 'F. Scott & Zelda Fitzgerald'
  },
  'Water-Water': {
    name: 'The Deep',
    archetype: 'Ocean Meeting Ocean',
    myth: 'Two waters merging become one sea — boundless, deep, impossible to tell where one ends and other begins.',
    essence: 'Emotional depth, psychic connection, boundary dissolution',
    shadow: 'Enmeshment, losing individual identity, drowning together',
    gift: 'Profound emotional understanding without words',
    challenge: 'Maintaining individuality within the depth.',
    mythicJourney: 'Learning that healthy boundaries allow, not prevent, true merging.',
    famousExamples: 'Johnny Cash & June Carter Cash'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// SUN-MOON MODALITY ARCHETYPES
// Additional layer based on modality interaction
// ═══════════════════════════════════════════════════════════════════════════

const MODALITY_ARCHETYPES = {
  'Cardinal-Cardinal': {
    dynamic: 'The Leadership Struggle',
    pattern: 'Both partners want to initiate, lead, and set direction.',
    strength: 'Tremendous forward momentum when aligned.',
    challenge: 'Power struggles about who decides what.',
    resolution: 'Taking turns leading; finding complementary domains.'
  },
  'Cardinal-Fixed': {
    dynamic: 'The Initiator and Sustainer',
    pattern: 'One starts things, the other maintains them.',
    strength: 'Ideas become reality; beginnings have staying power.',
    challenge: 'Cardinal feels stuck; Fixed feels abandoned.',
    resolution: 'Honoring both the birth AND the tending.'
  },
  'Cardinal-Mutable': {
    dynamic: 'The Creator and Adapter',
    pattern: 'One begins, the other adjusts and refines.',
    strength: 'Flexibility in how new things manifest.',
    challenge: 'Cardinal feels unsupported; Mutable feels directionless.',
    resolution: 'Clear vision that allows for adjustment.'
  },
  'Fixed-Fixed': {
    dynamic: 'The Immovable Force',
    pattern: 'Both partners hold their ground powerfully.',
    strength: 'Unshakeable loyalty and commitment.',
    challenge: 'Deadlock when values differ.',
    resolution: 'Learning that flexibility serves loyalty.'
  },
  'Fixed-Mutable': {
    dynamic: 'The Anchor and Wave',
    pattern: 'One provides stability, the other brings change.',
    strength: 'Security with adaptability.',
    challenge: 'Fixed feels destabilized; Mutable feels trapped.',
    resolution: 'The anchor allows movement; the wave respects the anchor.'
  },
  'Mutable-Mutable': {
    dynamic: 'The Shape-Shifters',
    pattern: 'Both partners are infinitely adaptable.',
    strength: 'Goes with any flow, survives any change.',
    challenge: 'No center to hold; constant drift.',
    resolution: 'Consciously creating structure; choosing some anchors.'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSITE ANGLE ARCHETYPES
// If Ascendant, Midheaven are available
// ═══════════════════════════════════════════════════════════════════════════

const ASCENDANT_ARCHETYPES = {
  Aries: { mask: 'The Warriors', presentation: 'The world sees you as dynamic, direct, ready for action.' },
  Taurus: { mask: 'The Builders', presentation: 'The world sees you as solid, reliable, pleasure-loving.' },
  Gemini: { mask: 'The Communicators', presentation: 'The world sees you as curious, witty, always talking.' },
  Cancer: { mask: 'The Nurturers', presentation: 'The world sees you as caring, protective, family-oriented.' },
  Leo: { mask: 'The Stars', presentation: 'The world sees you as radiant, dramatic, center-stage.' },
  Virgo: { mask: 'The Helpers', presentation: 'The world sees you as practical, modest, detail-oriented.' },
  Libra: { mask: 'The Partners', presentation: 'The world sees you as harmonious, diplomatic, relationship-focused.' },
  Scorpio: { mask: 'The Transformers', presentation: 'The world sees you as intense, mysterious, powerful.' },
  Sagittarius: { mask: 'The Adventurers', presentation: 'The world sees you as optimistic, adventurous, truth-seeking.' },
  Capricorn: { mask: 'The Achievers', presentation: 'The world sees you as ambitious, responsible, traditional.' },
  Aquarius: { mask: 'The Revolutionaries', presentation: 'The world sees you as unique, progressive, unconventional.' },
  Pisces: { mask: 'The Dreamers', presentation: 'The world sees you as imaginative, compassionate, otherworldly.' }
};

const MIDHEAVEN_ARCHETYPES = {
  Aries: { purpose: 'Pioneer', worldContribution: 'To start new things, to lead, to show courage.' },
  Taurus: { purpose: 'Builder', worldContribution: 'To create lasting value, beauty, security.' },
  Gemini: { purpose: 'Messenger', worldContribution: 'To communicate, connect, educate.' },
  Cancer: { purpose: 'Nurturer', worldContribution: 'To care, protect, create family feeling.' },
  Leo: { purpose: 'Creator', worldContribution: 'To inspire, create, lead with heart.' },
  Virgo: { purpose: 'Healer', worldContribution: 'To serve, heal, improve.' },
  Libra: { purpose: 'Harmonizer', worldContribution: 'To bring balance, beauty, justice.' },
  Scorpio: { purpose: 'Transformer', worldContribution: 'To heal depths, transform, regenerate.' },
  Sagittarius: { purpose: 'Teacher', worldContribution: 'To expand vision, teach, inspire growth.' },
  Capricorn: { purpose: 'Authority', worldContribution: 'To build structures, lead responsibly.' },
  Aquarius: { purpose: 'Visionary', worldContribution: 'To innovate, liberate, serve humanity.' },
  Pisces: { purpose: 'Healer of Souls', worldContribution: 'To bring compassion, imagination, transcendence.' }
};

// ═══════════════════════════════════════════════════════════════════════════
// SPECIFIC SUN-MOON COMBINATIONS (Most common/notable)
// ═══════════════════════════════════════════════════════════════════════════

const SPECIFIC_COMBINATIONS = {
  'Aries-Cancer': {
    name: 'The Protective Warriors',
    essence: 'Fighting to protect home and family',
    dynamic: 'Outward action serving inner security needs'
  },
  'Taurus-Scorpio': {
    name: 'The Alchemists',
    essence: 'Transforming matter and meaning together',
    dynamic: 'Surface stability containing depths of intensity'
  },
  'Gemini-Sagittarius': {
    name: 'The Eternal Students',
    essence: 'Learning, teaching, exploring truth together',
    dynamic: 'Local knowledge and global wisdom in dialogue'
  },
  'Cancer-Capricorn': {
    name: 'The Dynasty Builders',
    essence: 'Creating lasting family structure',
    dynamic: 'Private nurturing and public achievement balanced'
  },
  'Leo-Aquarius': {
    name: 'The Revolutionary Leaders',
    essence: 'Personal creativity serving collective vision',
    dynamic: 'Individual expression and group consciousness merged'
  },
  'Virgo-Pisces': {
    name: 'The Sacred Servants',
    essence: 'Practical service and spiritual devotion united',
    dynamic: 'Earth-bound healing and transcendent compassion flowing together'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ENGINE FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build the archetype profile of a composite chart
 *
 * @param {Object} compositeChart - Composite chart from compositeGenerator
 * @returns {Object} Archetype profile of the relationship
 */
export function buildCompositeArchetype(compositeChart) {
  if (!compositeChart || !compositeChart.planets) {
    return null;
  }

  const planets = compositeChart.planets;

  // Extract key placements
  const sunSign = planets.Sun?.sign;
  const moonSign = planets.Moon?.sign;
  const ascSign = planets.Ascendant?.sign;
  const mcSign = planets.Midheaven?.sign;

  if (!sunSign || !moonSign) {
    return null;
  }

  // Get elements and modalities
  const sunElement = ELEMENT_MAP[sunSign];
  const moonElement = ELEMENT_MAP[moonSign];
  const sunModality = MODALITY_MAP[sunSign];
  const moonModality = MODALITY_MAP[moonSign];

  // Build element combination key
  const elementCombo = `${sunElement}-${moonElement}`;
  const elementKey = ELEMENT_ARCHETYPES[elementCombo] ? elementCombo : `${moonElement}-${sunElement}`;

  // Build modality combination key
  const modalityCombo = `${sunModality}-${moonModality}`;
  const modalityKey = MODALITY_ARCHETYPES[modalityCombo] ? modalityCombo : `${moonModality}-${sunModality}`;

  // Check for specific combination
  const specificKey = `${sunSign}-${moonSign}`;
  const reverseSpecificKey = `${moonSign}-${sunSign}`;
  const specificCombo = SPECIFIC_COMBINATIONS[specificKey] || SPECIFIC_COMBINATIONS[reverseSpecificKey];

  const archetype = {
    // Primary Element Archetype
    primaryArchetype: ELEMENT_ARCHETYPES[elementKey] || ELEMENT_ARCHETYPES[elementCombo] || null,

    // Modality Dynamic
    modalityDynamic: MODALITY_ARCHETYPES[modalityKey] || MODALITY_ARCHETYPES[modalityCombo] || null,

    // Specific Combination (if available)
    specificCombination: specificCombo || null,

    // Element Analysis
    elementBalance: {
      sunElement,
      moonElement,
      compatible: areElementsCompatible(sunElement, moonElement),
      description: describeElementInteraction(sunElement, moonElement)
    },

    // Public Face (Ascendant)
    publicFace: ascSign ? {
      sign: ascSign,
      ...ASCENDANT_ARCHETYPES[ascSign]
    } : null,

    // World Purpose (Midheaven)
    worldPurpose: mcSign ? {
      sign: mcSign,
      ...MIDHEAVEN_ARCHETYPES[mcSign]
    } : null,

    // Core Myth Summary
    coreMythSummary: generateCoreMythSummary(sunSign, moonSign, ELEMENT_ARCHETYPES[elementKey] || ELEMENT_ARCHETYPES[elementCombo])
  };

  return archetype;
}

/**
 * Check if elements are compatible
 */
function areElementsCompatible(elem1, elem2) {
  const compatible = {
    Fire: ['Fire', 'Air'],
    Air: ['Air', 'Fire'],
    Earth: ['Earth', 'Water'],
    Water: ['Water', 'Earth']
  };
  return elem1 === elem2 || compatible[elem1]?.includes(elem2);
}

/**
 * Describe element interaction
 */
function describeElementInteraction(elem1, elem2) {
  if (elem1 === elem2) {
    return `Pure ${elem1} energy — intensified and concentrated.`;
  }

  const interactions = {
    'Fire-Air': 'Fire and Air feed each other — inspiration spreads.',
    'Air-Fire': 'Air and Fire feed each other — ideas catch flame.',
    'Fire-Earth': 'Fire and Earth create — vision meets manifestation.',
    'Earth-Fire': 'Earth and Fire create — form receives spirit.',
    'Fire-Water': 'Fire and Water transform — steam and power.',
    'Water-Fire': 'Water and Fire transform — emotion meets will.',
    'Earth-Air': 'Earth and Air build — concepts become structures.',
    'Air-Earth': 'Air and Earth build — thought finds form.',
    'Earth-Water': 'Earth and Water nourish — stable growth.',
    'Water-Earth': 'Water and Earth nourish — feelings find containment.',
    'Air-Water': 'Air and Water express — thoughts meet feelings.',
    'Water-Air': 'Water and Air express — emotions find words.'
  };

  return interactions[`${elem1}-${elem2}`] || interactions[`${elem2}-${elem1}`] || 'Complex elemental dialogue.';
}

/**
 * Generate core myth summary
 */
function generateCoreMythSummary(sunSign, moonSign, elementArchetype) {
  if (!elementArchetype) return null;

  return {
    mythName: elementArchetype.name,
    archetype: elementArchetype.archetype,
    oneLineSummary: `A ${sunSign} Sun / ${moonSign} Moon relationship living the "${elementArchetype.name}" myth.`,
    fullMythDescription: elementArchetype.myth,
    essentialGift: elementArchetype.gift,
    shadowToIntegrate: elementArchetype.shadow,
    evolutionaryPath: elementArchetype.mythicJourney
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get just the archetype name
 */
export function getArchetypeName(compositeChart) {
  const archetype = buildCompositeArchetype(compositeChart);
  return archetype?.primaryArchetype?.name || 'Unknown Archetype';
}

/**
 * Get the mythic story
 */
export function getMythicStory(compositeChart) {
  const archetype = buildCompositeArchetype(compositeChart);
  return archetype?.primaryArchetype?.myth || null;
}

/**
 * Get the relationship gift
 */
export function getRelationshipGift(compositeChart) {
  const archetype = buildCompositeArchetype(compositeChart);
  return archetype?.primaryArchetype?.gift || null;
}

/**
 * Get the relationship shadow
 */
export function getRelationshipShadowFromArchetype(compositeChart) {
  const archetype = buildCompositeArchetype(compositeChart);
  return archetype?.primaryArchetype?.shadow || null;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  buildCompositeArchetype,
  getArchetypeName,
  getMythicStory,
  getRelationshipGift,
  getRelationshipShadowFromArchetype,
  // Export data for customization
  ELEMENT_ARCHETYPES,
  MODALITY_ARCHETYPES,
  ASCENDANT_ARCHETYPES,
  MIDHEAVEN_ARCHETYPES,
  SPECIFIC_COMBINATIONS,
  ELEMENT_MAP,
  MODALITY_MAP
};
