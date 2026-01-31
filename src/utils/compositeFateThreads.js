/**
 * Composite Fate Threads Engine
 *
 * Based on Liz Greene's "The Astrology of Fate" applied to composite charts.
 * Every relationship has its own karma, its own destiny, its own thread in
 * the tapestry of fate. This module reveals those threads.
 *
 * The composite North Node shows where the relationship is going.
 * The composite South Node shows what it brings from the past.
 * Saturn shows the work. Pluto shows the transformation required.
 *
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSITE NORTH NODE - Where the Relationship is Going
// ═══════════════════════════════════════════════════════════════════════════

const COMPOSITE_NORTH_NODE = {
  Aries: {
    destiny: 'Independent Action',
    calling: 'This relationship is called to develop courage, independence, and the willingness to lead.',
    growth: 'Moving from dependency on harmony to the strength of healthy assertion.',
    lesson: 'Learning to fight for what matters without destroying each other.',
    fulfillment: 'When the relationship takes bold action rather than waiting for consensus.',
    warning: 'Staying too comfortable in people-pleasing will stunt this relationship\'s growth.'
  },
  Taurus: {
    destiny: 'Embodied Presence',
    calling: 'This relationship is called to ground in the physical, to build lasting value.',
    growth: 'Moving from intensity and crisis to peaceful, sustainable presence.',
    lesson: 'Learning that simple pleasures and steady commitment have profound value.',
    fulfillment: 'When the relationship finds peace in the ordinary and builds something tangible.',
    warning: 'Getting lost in drama and intensity will prevent the peace this relationship seeks.'
  },
  Gemini: {
    destiny: 'Communication and Learning',
    calling: 'This relationship is called to communicate, to stay curious, to keep learning.',
    growth: 'Moving from dogmatic certainty to open-minded exploration.',
    lesson: 'Learning that questions matter more than answers, and dialogue beats preaching.',
    fulfillment: 'When the relationship becomes a vehicle for endless mutual discovery.',
    warning: 'Self-righteousness and assumed truth will block this relationship\'s evolution.'
  },
  Cancer: {
    destiny: 'Emotional Home',
    calling: 'This relationship is called to create real emotional security and family.',
    growth: 'Moving from public achievement to private nurturing.',
    lesson: 'Learning that home is the true accomplishment, not external success.',
    fulfillment: 'When the relationship becomes a sanctuary that nourishes both souls.',
    warning: 'Prioritizing career and status over emotional connection will undermine growth.'
  },
  Leo: {
    destiny: 'Creative Expression',
    calling: 'This relationship is called to create, to shine, to share its unique gift.',
    growth: 'Moving from fitting in to standing out, from group to individual expression.',
    lesson: 'Learning to let the relationship\'s unique light shine without apology.',
    fulfillment: 'When the relationship becomes a vehicle for joyful, heartfelt creation.',
    warning: 'Hiding in the crowd and denying specialness will block the relationship\'s purpose.'
  },
  Virgo: {
    destiny: 'Sacred Service',
    calling: 'This relationship is called to serve, to heal, to be genuinely useful.',
    growth: 'Moving from escapism and victimhood to practical helpfulness.',
    lesson: 'Learning that small acts of service are more valuable than grand spiritual gestures.',
    fulfillment: 'When the relationship becomes a force for practical good in the world.',
    warning: 'Escaping into fantasy and avoiding real-world helpfulness will undermine purpose.'
  },
  Libra: {
    destiny: 'Conscious Partnership',
    calling: 'This relationship is called to master the art of relating itself.',
    growth: 'Moving from self-focus to genuine consideration of the other.',
    lesson: 'Learning that balance and fairness create more than unilateral action.',
    fulfillment: 'When the relationship becomes a model of conscious, mutual relating.',
    warning: 'Excessive independence and self-interest will prevent the harmony being sought.'
  },
  Scorpio: {
    destiny: 'Transformative Intimacy',
    calling: 'This relationship is called to go deep, to transform, to face shadow.',
    growth: 'Moving from surface comfort to profound, uncomfortable truth.',
    lesson: 'Learning that real intimacy requires the death of pretense.',
    fulfillment: 'When the relationship becomes a crucible for mutual transformation.',
    warning: 'Clinging to comfort and avoiding intensity will block evolution.'
  },
  Sagittarius: {
    destiny: 'Meaning and Adventure',
    calling: 'This relationship is called to expand, to find meaning, to seek truth.',
    growth: 'Moving from scattered information to integrated wisdom.',
    lesson: 'Learning that life is a quest, and the relationship is a vehicle for that quest.',
    fulfillment: 'When the relationship becomes an adventure toward truth.',
    warning: 'Getting lost in details and daily routine will prevent the growth being sought.'
  },
  Capricorn: {
    destiny: 'Mature Achievement',
    calling: 'This relationship is called to build something lasting in the world.',
    growth: 'Moving from emotional dependence to responsible partnership.',
    lesson: 'Learning that real security comes from mature commitment, not emotional enmeshment.',
    fulfillment: 'When the relationship becomes a functional, respected entity in the world.',
    warning: 'Clinging to childhood patterns and emotional dependency will block growth.'
  },
  Aquarius: {
    destiny: 'Humanitarian Vision',
    calling: 'This relationship is called to serve something larger than itself.',
    growth: 'Moving from personal drama to collective contribution.',
    lesson: 'Learning that the relationship\'s purpose is connected to humanity\'s evolution.',
    fulfillment: 'When the relationship becomes a force for progressive change.',
    warning: 'Getting lost in personal ego and drama will prevent the relationship\'s true calling.'
  },
  Pisces: {
    destiny: 'Spiritual Union',
    calling: 'This relationship is called to transcendence, compassion, and spiritual connection.',
    growth: 'Moving from criticism and perfectionism to unconditional acceptance.',
    lesson: 'Learning that love is a spiritual practice, not a problem to solve.',
    fulfillment: 'When the relationship becomes a vehicle for experiencing the divine.',
    warning: 'Excessive criticism and analysis will prevent the surrender being sought.'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSITE SOUTH NODE - What the Relationship Brings from the Past
// ═══════════════════════════════════════════════════════════════════════════

const COMPOSITE_SOUTH_NODE = {
  Aries: {
    pastPattern: 'Warrior Legacy',
    comfort: 'The relationship finds comfort in independence, action, and fighting for its way.',
    karmaFrom: 'Past patterns of competition, aggression, or self-centered action.',
    giftToRelease: 'The warrior energy is a gift, but must be balanced with compromise.',
    trap: 'Falling back into fighting mode when challenged.',
    integration: 'Using courage in service of partnership rather than dominance.'
  },
  Taurus: {
    pastPattern: 'Security Attachment',
    comfort: 'The relationship finds comfort in stability, possession, and sensory pleasure.',
    karmaFrom: 'Past patterns of materialism, possessiveness, or resistance to change.',
    giftToRelease: 'The grounding is a gift, but must not become stagnation.',
    trap: 'Holding on too tightly to what was.',
    integration: 'Using stability to support transformation rather than prevent it.'
  },
  Gemini: {
    pastPattern: 'Information Gathering',
    comfort: 'The relationship finds comfort in talking, learning, and intellectual connection.',
    karmaFrom: 'Past patterns of superficiality, avoiding depth through endless chatter.',
    giftToRelease: 'The curiosity is a gift, but must not prevent commitment to truth.',
    trap: 'Talking about feelings instead of having them.',
    integration: 'Using communication to serve wisdom rather than avoid it.'
  },
  Cancer: {
    pastPattern: 'Emotional Enmeshment',
    comfort: 'The relationship finds comfort in nurturing, family patterns, and emotional security.',
    karmaFrom: 'Past patterns of dependency, clan mentality, or mother-child dynamics.',
    giftToRelease: 'The nurturing is a gift, but must not prevent adult partnership.',
    trap: 'Recreating family-of-origin patterns.',
    integration: 'Using emotional attunement to support maturity rather than regression.'
  },
  Leo: {
    pastPattern: 'Drama and Recognition',
    comfort: 'The relationship finds comfort in creativity, drama, and being special.',
    karmaFrom: 'Past patterns of ego-centrism, needing to be the star, or drama addiction.',
    giftToRelease: 'The creative warmth is a gift, but must not overshadow the collective.',
    trap: 'Making everything about "us" rather than serving something larger.',
    integration: 'Using creativity to serve group evolution rather than personal glorification.'
  },
  Virgo: {
    pastPattern: 'Service and Criticism',
    comfort: 'The relationship finds comfort in being helpful, analytical, and improving things.',
    karmaFrom: 'Past patterns of criticism, perfectionism, or martyred service.',
    giftToRelease: 'The discernment is a gift, but must not prevent acceptance and surrender.',
    trap: 'Fixing what doesn\'t need fixing; criticizing rather than accepting.',
    integration: 'Using discernment to serve compassion rather than judgment.'
  },
  Libra: {
    pastPattern: 'Harmony at Any Cost',
    comfort: 'The relationship finds comfort in balance, diplomacy, and pleasing others.',
    karmaFrom: 'Past patterns of codependency, people-pleasing, or losing self in other.',
    giftToRelease: 'The relating skill is a gift, but must not prevent independent action.',
    trap: 'Agreeing to keep the peace at the cost of authenticity.',
    integration: 'Using partnership skills to support individual growth.'
  },
  Scorpio: {
    pastPattern: 'Intensity and Control',
    comfort: 'The relationship finds comfort in intensity, depth, and psychological insight.',
    karmaFrom: 'Past patterns of manipulation, control, or crisis addiction.',
    giftToRelease: 'The depth is a gift, but must not prevent peace and simplicity.',
    trap: 'Creating drama to feel alive.',
    integration: 'Using transformative capacity in service of peace rather than power.'
  },
  Sagittarius: {
    pastPattern: 'Seeking and Preaching',
    comfort: 'The relationship finds comfort in adventure, philosophy, and being right.',
    karmaFrom: 'Past patterns of self-righteousness, escapism, or commitment avoidance.',
    giftToRelease: 'The truth-seeking is a gift, but must not prevent grounding and presence.',
    trap: 'Running away from difficult truths by seeking elsewhere.',
    integration: 'Using vision to illuminate the near, not just the far.'
  },
  Capricorn: {
    pastPattern: 'Achievement and Control',
    comfort: 'The relationship finds comfort in structure, achievement, and worldly success.',
    karmaFrom: 'Past patterns of workaholism, emotional coldness, or status obsession.',
    giftToRelease: 'The discipline is a gift, but must not prevent emotional vulnerability.',
    trap: 'Building externally while starving internally.',
    integration: 'Using maturity to support feeling rather than defend against it.'
  },
  Aquarius: {
    pastPattern: 'Detachment and Idealism',
    comfort: 'The relationship finds comfort in friendship, ideals, and emotional distance.',
    karmaFrom: 'Past patterns of detachment, treating intimacy as a problem, or rebel identity.',
    giftToRelease: 'The objectivity is a gift, but must not prevent warm personal connection.',
    trap: 'Being friends but not lovers; connected to humanity but not each other.',
    integration: 'Using universal vision to enrich rather than escape personal love.'
  },
  Pisces: {
    pastPattern: 'Merging and Escape',
    comfort: 'The relationship finds comfort in spiritual connection and boundary dissolution.',
    karmaFrom: 'Past patterns of escapism, martyrdom, or avoiding reality through transcendence.',
    giftToRelease: 'The spiritual attunement is a gift, but must not prevent practical engagement.',
    trap: 'Escaping into spirituality to avoid earthly challenges.',
    integration: 'Using transcendence to inform rather than escape embodied life.'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSITE SATURN - The Work Required
// ═══════════════════════════════════════════════════════════════════════════

const COMPOSITE_SATURN_FATE = {
  Aries: { work: 'Learning to act together', karmaLesson: 'Disciplined courage that serves partnership, not ego.' },
  Taurus: { work: 'Building real security', karmaLesson: 'Patient material creation without possessiveness.' },
  Gemini: { work: 'Mastering communication', karmaLesson: 'Words that build rather than defend or attack.' },
  Cancer: { work: 'Creating real emotional safety', karmaLesson: 'Nurturing without enabling; protecting without suffocating.' },
  Leo: { work: 'Humble creativity', karmaLesson: 'Creating for love rather than recognition.' },
  Virgo: { work: 'Perfecting daily life', karmaLesson: 'Service without criticism; improvement without rejection.' },
  Libra: { work: 'Mastering partnership itself', karmaLesson: 'Balance that includes conflict; fairness that includes truth.' },
  Scorpio: { work: 'Transforming through discipline', karmaLesson: 'Depth without manipulation; power through vulnerability.' },
  Sagittarius: { work: 'Grounding belief in reality', karmaLesson: 'Faith that has been tested; adventure with responsibility.' },
  Capricorn: { work: 'Building lasting structures', karmaLesson: 'Achievement that includes feeling; success with soul.' },
  Aquarius: { work: 'Practical idealism', karmaLesson: 'Vision that manifests; freedom that includes commitment.' },
  Pisces: { work: 'Grounded transcendence', karmaLesson: 'Spirituality that includes the body; dreams that become real.' }
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSITE PLUTO - The Transformation Required
// ═══════════════════════════════════════════════════════════════════════════

const COMPOSITE_PLUTO_FATE = {
  Aries: { transformation: 'Ego death through courage', requirement: 'The relationship must transform its relationship to will and action.' },
  Taurus: { transformation: 'Death of attachment', requirement: 'The relationship must transform its relationship to possession and security.' },
  Gemini: { transformation: 'Death of superficiality', requirement: 'The relationship must transform its relationship to truth and communication.' },
  Cancer: { transformation: 'Death of dependency', requirement: 'The relationship must transform its relationship to nurturing and family.' },
  Leo: { transformation: 'Death of false pride', requirement: 'The relationship must transform its relationship to ego and creativity.' },
  Virgo: { transformation: 'Death of perfectionism', requirement: 'The relationship must transform its relationship to service and criticism.' },
  Libra: { transformation: 'Death of false harmony', requirement: 'The relationship must transform its relationship to balance and partnership.' },
  Scorpio: { transformation: 'Death and rebirth at the core', requirement: 'The relationship must transform its relationship to power and intimacy.' },
  Sagittarius: { transformation: 'Death of false beliefs', requirement: 'The relationship must transform its relationship to truth and meaning.' },
  Capricorn: { transformation: 'Death of achievement identity', requirement: 'The relationship must transform its relationship to success and structure.' },
  Aquarius: { transformation: 'Death of false freedom', requirement: 'The relationship must transform its relationship to individuality and collective.' },
  Pisces: { transformation: 'Death of illusion', requirement: 'The relationship must transform its relationship to transcendence and escapism.' }
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ENGINE FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build the fate threads profile of a composite chart
 *
 * @param {Object} compositeChart - Composite chart from compositeGenerator
 * @returns {Object} Fate threads profile of the relationship
 */
export function buildCompositeFateThreads(compositeChart) {
  if (!compositeChart || !compositeChart.planets) {
    return null;
  }

  const planets = compositeChart.planets;

  // Extract relevant placements
  const northNodeSign = planets['North Node']?.sign;
  const southNodeSign = planets['South Node']?.sign || getOppositeSign(northNodeSign);
  const saturnSign = planets.Saturn?.sign;
  const plutoSign = planets.Pluto?.sign;

  const fateThreads = {
    // North Node Destiny
    destiny: northNodeSign ? {
      sign: northNodeSign,
      ...COMPOSITE_NORTH_NODE[northNodeSign]
    } : null,

    // South Node Past
    pastKarma: southNodeSign ? {
      sign: southNodeSign,
      ...COMPOSITE_SOUTH_NODE[southNodeSign]
    } : null,

    // Saturn Work
    karmicWork: saturnSign ? {
      sign: saturnSign,
      ...COMPOSITE_SATURN_FATE[saturnSign]
    } : null,

    // Pluto Transformation
    requiredTransformation: plutoSign ? {
      sign: plutoSign,
      ...COMPOSITE_PLUTO_FATE[plutoSign]
    } : null,

    // Nodal Axis Summary
    nodalAxis: northNodeSign && southNodeSign ? {
      axis: `${southNodeSign}-${northNodeSign}`,
      movement: `From ${southNodeSign} comfort to ${northNodeSign} growth`,
      integration: generateNodalIntegration(southNodeSign, northNodeSign)
    } : null,

    // Fate Summary
    fateSummary: generateFateSummary(northNodeSign, saturnSign, plutoSign)
  };

  return fateThreads;
}

/**
 * Get the opposite sign
 */
function getOppositeSign(sign) {
  const opposites = {
    Aries: 'Libra', Libra: 'Aries',
    Taurus: 'Scorpio', Scorpio: 'Taurus',
    Gemini: 'Sagittarius', Sagittarius: 'Gemini',
    Cancer: 'Capricorn', Capricorn: 'Cancer',
    Leo: 'Aquarius', Aquarius: 'Leo',
    Virgo: 'Pisces', Pisces: 'Virgo'
  };
  return opposites[sign] || null;
}

/**
 * Generate nodal integration message
 */
function generateNodalIntegration(southSign, northSign) {
  const southGift = COMPOSITE_SOUTH_NODE[southSign]?.giftToRelease?.split(', but')[0] || 'past gifts';
  const northCalling = COMPOSITE_NORTH_NODE[northSign]?.calling?.toLowerCase() || 'new direction';

  return `The relationship integrates ${southGift} while moving toward ${northCalling}.`;
}

/**
 * Generate fate summary
 */
function generateFateSummary(northSign, saturnSign, plutoSign) {
  const parts = [];

  if (northSign) {
    parts.push(`This relationship is destined for ${COMPOSITE_NORTH_NODE[northSign]?.destiny?.toLowerCase() || 'growth'}.`);
  }

  if (saturnSign) {
    parts.push(`The work involves ${COMPOSITE_SATURN_FATE[saturnSign]?.work?.toLowerCase() || 'mastery'}.`);
  }

  if (plutoSign) {
    parts.push(`Transformation comes through ${COMPOSITE_PLUTO_FATE[plutoSign]?.transformation?.toLowerCase() || 'change'}.`);
  }

  return parts.join(' ');
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get just the relationship destiny
 */
export function getRelationshipDestiny(compositeChart) {
  const northSign = compositeChart?.planets?.['North Node']?.sign;
  return northSign ? COMPOSITE_NORTH_NODE[northSign] : null;
}

/**
 * Get just the past karma
 */
export function getPastKarma(compositeChart) {
  const northSign = compositeChart?.planets?.['North Node']?.sign;
  const southSign = getOppositeSign(northSign);
  return southSign ? COMPOSITE_SOUTH_NODE[southSign] : null;
}

/**
 * Get the nodal axis description
 */
export function getNodalAxisDescription(compositeChart) {
  const northSign = compositeChart?.planets?.['North Node']?.sign;
  const southSign = getOppositeSign(northSign);
  if (!northSign || !southSign) return null;

  return {
    from: COMPOSITE_SOUTH_NODE[southSign]?.pastPattern,
    to: COMPOSITE_NORTH_NODE[northSign]?.destiny,
    journey: `From ${COMPOSITE_SOUTH_NODE[southSign]?.pastPattern} to ${COMPOSITE_NORTH_NODE[northSign]?.destiny}`
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  buildCompositeFateThreads,
  getRelationshipDestiny,
  getPastKarma,
  getNodalAxisDescription,
  // Export data for customization
  COMPOSITE_NORTH_NODE,
  COMPOSITE_SOUTH_NODE,
  COMPOSITE_SATURN_FATE,
  COMPOSITE_PLUTO_FATE
};
