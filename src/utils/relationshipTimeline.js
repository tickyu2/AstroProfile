/**
 * Relationship Timeline Engine
 *
 * The temporal spine of the Relationship OS — tracking how the bond
 * evolves through time via transits, seasons, and fate activation windows.
 *
 * Based on Liz Greene's approach to predictive work as psychological timing
 * rather than event prediction. Transits show WHEN themes become conscious.
 *
 * Components:
 * - Transits to Composite Chart
 * - Transits to Synastry Points
 * - Relationship Seasons (Saturn, Pluto, Jupiter, Uranus, Neptune)
 * - Fate Activation Windows (major turning points)
 *
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// TRANSIT INTERPRETATIONS
// ═══════════════════════════════════════════════════════════════════════════

const COMPOSITE_TRANSIT_MEANINGS = {
  // Saturn transits to composite planets
  'Saturn-Sun': {
    conjunction: 'A major test of the relationship\'s identity. Structure and commitment are demanded.',
    opposition: 'The relationship confronts its limitations. What is real vs. what was hoped?',
    square: 'Friction around purpose and direction. The bond must prove its worth.',
    trine: 'Stable period for building. The relationship\'s structure supports growth.',
    sextile: 'Opportunity to solidify commitment. Small efforts yield lasting results.'
  },
  'Saturn-Moon': {
    conjunction: 'Emotional containment required. Feelings may feel restricted but are being matured.',
    opposition: 'Emotional distance or coldness surfaces. Needs vs. duties clash.',
    square: 'Emotional security feels threatened. Old patterns demand attention.',
    trine: 'Emotional stability. Feelings can be trusted and built upon.',
    sextile: 'Opportunity for emotional grounding. Security through small consistent acts.'
  },
  'Saturn-Venus': {
    conjunction: 'Love is tested. Commitment deepens OR limitations become clear.',
    opposition: 'What you love vs. what you must do. Values are evaluated.',
    square: 'Love feels blocked or conditional. Disappointment if expectations were unrealistic.',
    trine: 'Lasting love can be built. Affection expressed through devotion.',
    sextile: 'Opportunity to deepen commitment. Love expressed through reliability.'
  },
  'Saturn-Mars': {
    conjunction: 'Action is disciplined or blocked. Frustration if energy has no structure.',
    opposition: 'Desires vs. limitations. What you want vs. what\'s possible.',
    square: 'Anger at restrictions. Blocked action creates tension.',
    trine: 'Disciplined action. Energy channeled effectively.',
    sextile: 'Opportunity for strategic action. Patience pays off.'
  },

  // Pluto transits to composite planets
  'Pluto-Sun': {
    conjunction: 'Profound transformation of the relationship\'s identity. Death and rebirth.',
    opposition: 'Power dynamics surface. The bond confronts its shadow.',
    square: 'Crisis of identity. What must die for the relationship to live?',
    trine: 'Deep transformation flows. Regenerative power available.',
    sextile: 'Opportunity for profound change. Depth work supported.'
  },
  'Pluto-Moon': {
    conjunction: 'Emotional truth emerges. Nothing can remain hidden.',
    opposition: 'Emotional power struggles. Manipulation or transformation.',
    square: 'Emotional crisis. Old patterns must be released.',
    trine: 'Emotional depth accessible. Transformation through feeling.',
    sextile: 'Opportunity for emotional healing. Shadow work supported.'
  },
  'Pluto-Venus': {
    conjunction: 'Love transforms completely. Obsession or rebirth of attraction.',
    opposition: 'What you love is challenged. Values undergo transformation.',
    square: 'Crisis in love. Jealousy, intensity, or transformation required.',
    trine: 'Deep love flows. Transformative intimacy available.',
    sextile: 'Opportunity for love renewal. Depth in affection.'
  },

  // Uranus transits to composite planets
  'Uranus-Sun': {
    conjunction: 'Radical change in the relationship\'s identity. Freedom demanded.',
    opposition: 'Breakthrough or breakdown. Authenticity vs. stability.',
    square: 'Restlessness. The bond seeks freedom from old patterns.',
    trine: 'Positive change flows. Innovation without destruction.',
    sextile: 'Opportunity for renewal. Fresh energy available.'
  },
  'Uranus-Venus': {
    conjunction: 'Love revolutionizes. Attraction to the new and different.',
    opposition: 'Freedom vs. commitment. Love seeks authenticity.',
    square: 'Instability in love. Need for excitement disrupts.',
    trine: 'Exciting love flows. Freedom within commitment.',
    sextile: 'Opportunity for love renewal. Fresh approach to affection.'
  },
  'Uranus-Moon': {
    conjunction: 'Emotional awakening. Old security patterns shattered.',
    opposition: 'Emotional freedom vs. stability. Unpredictable feelings.',
    square: 'Emotional restlessness. Need for change disrupts security.',
    trine: 'Emotional freedom flows. Security through authenticity.',
    sextile: 'Opportunity for emotional renewal. Fresh feeling patterns.'
  },

  // Neptune transits to composite planets
  'Neptune-Sun': {
    conjunction: 'Idealization or dissolution. The bond loses definition.',
    opposition: 'Reality vs. fantasy. Disillusionment or transcendence.',
    square: 'Confusion about identity. What is real about this relationship?',
    trine: 'Spiritual connection flows. Compassion and imagination.',
    sextile: 'Opportunity for spiritual growth. Creative vision.'
  },
  'Neptune-Venus': {
    conjunction: 'Romantic idealization or deception. Love as spiritual union.',
    opposition: 'Fantasy vs. reality in love. What was illusion becomes clear.',
    square: 'Confusion in love. Boundaries dissolve — for better or worse.',
    trine: 'Spiritual love flows. Compassionate romantic connection.',
    sextile: 'Opportunity for romantic transcendence. Artistic love.'
  },
  'Neptune-Moon': {
    conjunction: 'Emotional boundaries dissolve. Psychic connection or confusion.',
    opposition: 'Emotional reality vs. fantasy. Disillusionment or compassion.',
    square: 'Emotional confusion. Whose feelings are whose?',
    trine: 'Emotional transcendence flows. Intuitive connection.',
    sextile: 'Opportunity for emotional healing. Compassionate presence.'
  },

  // Jupiter transits to composite planets
  'Jupiter-Sun': {
    conjunction: 'Expansion of the relationship\'s identity. Growth and opportunity.',
    opposition: 'Growth through confronting differences. Expansion vs. excess.',
    square: 'Over-expansion. Growth creates tension that needs management.',
    trine: 'Natural growth and expansion. Good fortune flows.',
    sextile: 'Opportunity for growth. Optimism and possibility.'
  },
  'Jupiter-Venus': {
    conjunction: 'Love expands. Abundance, generosity, and pleasure.',
    opposition: 'Expansion of values. What do we truly want together?',
    square: 'Too much of a good thing. Excess in pleasure or expectation.',
    trine: 'Love and abundance flow. Natural harmony.',
    sextile: 'Opportunity for love growth. Generosity supported.'
  },
  'Jupiter-Moon': {
    conjunction: 'Emotional expansion. Feelings grow and open.',
    opposition: 'Emotional growth through understanding difference.',
    square: 'Emotional excess. Feelings may be exaggerated.',
    trine: 'Emotional well-being flows. Optimism in feeling.',
    sextile: 'Opportunity for emotional growth. Nurturing supported.'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// SYNASTRY TRANSIT MEANINGS
// ═══════════════════════════════════════════════════════════════════════════

const SYNASTRY_TRANSIT_MEANINGS = {
  'Saturn': {
    general: 'Karmic checkpoint in the relational dynamic. Tests and maturation.',
    nodes: 'Destiny is tested. The karmic contract becomes conscious.',
    venus: 'Love commitment tested. Is this relationship built to last?',
    moon: 'Emotional security tested. Can you depend on each other?'
  },
  'Pluto': {
    general: 'Shadow material or power dynamics surface. Transformation demanded.',
    nodes: 'Fate intensifies. Deep karmic material activated.',
    venus: 'Love transforms or burns. Nothing stays superficial.',
    moon: 'Emotional power dynamics revealed. Truth emerges.'
  },
  'Uranus': {
    general: 'Breakthrough or disruption. Freedom and authenticity demanded.',
    nodes: 'Destiny shifts unexpectedly. Liberation or chaos.',
    venus: 'Love needs freedom. Excitement or instability.',
    moon: 'Emotional awakening. Security through change.'
  },
  'Neptune': {
    general: 'Illusions dissolve or transcendence possible. Confusion or compassion.',
    nodes: 'Spiritual dimensions of the bond emerge. Faith or confusion.',
    venus: 'Romantic fantasy peaks or dissolves. Art or illusion.',
    moon: 'Emotional boundaries soften. Intuition or confusion.'
  },
  'Jupiter': {
    general: 'Expansion and growth. Opportunity and optimism.',
    nodes: 'Destiny expands. Growth through the connection.',
    venus: 'Love grows. Generosity and pleasure increase.',
    moon: 'Emotional expansion. Nurturing and optimism.'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// SEASON DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

const RELATIONSHIP_SEASONS = {
  saturn: {
    label: 'Saturn Season',
    theme: 'Commitment, tests, structure, reality checks',
    description: 'A period of testing and maturation. The relationship must prove its structural integrity.',
    duration: 'Typically 2-3 years as Saturn moves through relevant positions',
    tasks: [
      'Clarify commitments and expectations',
      'Build lasting structures together',
      'Accept limitations and work within them',
      'Mature the bond through challenges'
    ],
    warning: 'Avoid rigidity. Structure should support life, not restrict it.'
  },
  pluto: {
    label: 'Pluto Season',
    theme: 'Transformation, shadow work, deep truth',
    description: 'A period of profound change. Old patterns die; new possibilities emerge.',
    duration: 'Can span many years as Pluto moves slowly',
    tasks: [
      'Face hidden truths together',
      'Release what no longer serves',
      'Transform power dynamics',
      'Allow death of old patterns'
    ],
    warning: 'Resist the urge to control. Transformation requires surrender.'
  },
  jupiter: {
    label: 'Jupiter Season',
    theme: 'Growth, expansion, opportunity, renewal',
    description: 'A period of growth and possibility. The relationship can expand into new territories.',
    duration: 'Typically 1-2 years as Jupiter transits',
    tasks: [
      'Pursue shared adventures',
      'Expand horizons together',
      'Take beneficial risks',
      'Cultivate optimism and faith'
    ],
    warning: 'Avoid over-expansion. More is not always better.'
  },
  uranus: {
    label: 'Uranus Season',
    theme: 'Liberation, authenticity, revolution, awakening',
    description: 'A period of change and freedom-seeking. The relationship must find authentic expression.',
    duration: 'Can last several years as Uranus moves through',
    tasks: [
      'Embrace necessary changes',
      'Find freedom within commitment',
      'Express authenticity together',
      'Break outgrown patterns'
    ],
    warning: 'Distinguish needed revolution from restlessness.'
  },
  neptune: {
    label: 'Neptune Season',
    theme: 'Transcendence, spirituality, dissolution, dreams',
    description: 'A period of spiritual opening or confusion. Boundaries soften for better or worse.',
    duration: 'Can span many years as Neptune moves slowly',
    tasks: [
      'Develop shared spiritual practice',
      'Navigate illusions consciously',
      'Embrace compassion and forgiveness',
      'Honor dreams and visions'
    ],
    warning: 'Stay grounded. Transcendence without roots leads to dissolution.'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// FATE WINDOWS
// ═══════════════════════════════════════════════════════════════════════════

const FATE_ACTIVATION_WINDOWS = {
  'Saturn-Sun': {
    label: 'Saturn-Sun Fate Window',
    meaning: 'A test of the relationship\'s identity and long-term viability.',
    archetype: 'The Identity Test',
    questions: [
      'Is this relationship built on truth or illusion?',
      'Can this bond support who we are becoming?',
      'What must we commit to for this to last?'
    ]
  },
  'Pluto-Moon': {
    label: 'Pluto-Moon Fate Window',
    meaning: 'Emotional truth emerges. Old patterns die.',
    archetype: 'The Emotional Death-Rebirth',
    questions: [
      'What emotional patterns must end?',
      'What feelings have we been hiding?',
      'What needs to die for emotional rebirth?'
    ]
  },
  'Saturn-Nodes': {
    label: 'Nodal-Saturn Destiny Window',
    meaning: 'Karmic contract activation. Destiny checkpoint.',
    archetype: 'The Karmic Reckoning',
    questions: [
      'Are we fulfilling our karmic contract?',
      'What lessons remain unlearned?',
      'Is this bond aligned with our destiny?'
    ]
  },
  'Uranus-Venus': {
    label: 'Uranus-Venus Awakening Window',
    meaning: 'A need for authenticity, freedom, or relational restructuring.',
    archetype: 'The Love Revolution',
    questions: [
      'Does our love allow us to be fully ourselves?',
      'What needs to change for authentic connection?',
      'Can we be free AND committed?'
    ]
  },
  'Pluto-Venus': {
    label: 'Pluto-Venus Transformation Window',
    meaning: 'Love transforms completely. Nothing stays the same.',
    archetype: 'The Love Crucible',
    questions: [
      'What must our love release to transform?',
      'Are we willing to be changed by love?',
      'What intensity are we avoiding?'
    ]
  },
  'Neptune-Sun': {
    label: 'Neptune-Sun Dissolution Window',
    meaning: 'Identity dissolves or transcends. Confusion or spiritual union.',
    archetype: 'The Boundary Dissolving',
    questions: [
      'What illusions about our relationship must we release?',
      'Can we find spiritual meaning together?',
      'Where have we lost ourselves?'
    ]
  },
  'Jupiter-Saturn': {
    label: 'Jupiter-Saturn Balance Window',
    meaning: 'Growth meets structure. Expansion with discipline.',
    archetype: 'The Mature Growth',
    questions: [
      'How do we grow within our commitments?',
      'What expansion serves the relationship?',
      'How do we balance freedom and responsibility?'
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ENGINE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build relationship transits from transit data
 *
 * @param {Object} composite - Composite chart
 * @param {Object} synastry - Synastry profile
 * @param {Array} transitData - Array of transit events: { date, planet, aspect, target }
 * @returns {Array} Interpreted transits
 */
export function buildRelationshipTransits(composite, synastry, transitData = []) {
  const results = [];

  transitData.forEach(t => {
    const { date, planet, aspect, target } = t;

    // Check if hitting composite planet
    if (composite?.planets?.[target]) {
      const key = `${planet}-${target}`;
      const meanings = COMPOSITE_TRANSIT_MEANINGS[key];

      results.push({
        date,
        planet,
        aspect,
        target: `Composite ${target}`,
        meaning: meanings?.[aspect] || `Transit of ${planet} ${aspect} Composite ${target}`,
        intensity: getTransitIntensity(planet, aspect),
        type: 'composite'
      });
    }

    // Check synastry points
    if (target.includes('Synastry') || target.includes('Node')) {
      const planetMeanings = SYNASTRY_TRANSIT_MEANINGS[planet];

      results.push({
        date,
        planet,
        aspect,
        target,
        meaning: planetMeanings?.general || `Transit to synastry point ${target}`,
        intensity: getTransitIntensity(planet, aspect),
        type: 'synastry'
      });
    }
  });

  return results;
}

/**
 * Get transit intensity rating
 */
function getTransitIntensity(planet, aspect) {
  const planetIntensity = {
    Pluto: 5,
    Saturn: 4,
    Uranus: 4,
    Neptune: 3,
    Jupiter: 2
  };

  const aspectIntensity = {
    conjunction: 1.5,
    opposition: 1.3,
    square: 1.2,
    trine: 0.8,
    sextile: 0.6
  };

  const base = planetIntensity[planet] || 2;
  const mult = aspectIntensity[aspect] || 1;

  return Math.min(5, Math.round(base * mult));
}

/**
 * Build relationship seasons from transits
 *
 * @param {Array} transits - Transit events
 * @returns {Array} Relationship seasons
 */
export function buildRelationshipSeasons(transits) {
  const seasons = [];

  // Group transits by planet
  const byPlanet = {};
  transits.forEach(t => {
    if (!byPlanet[t.planet]) {
      byPlanet[t.planet] = [];
    }
    byPlanet[t.planet].push(t);
  });

  // Create seasons for each active outer planet
  const outerPlanets = ['Saturn', 'Pluto', 'Jupiter', 'Uranus', 'Neptune'];

  outerPlanets.forEach(planet => {
    const planetTransits = byPlanet[planet];
    if (planetTransits && planetTransits.length > 0) {
      const seasonKey = planet.toLowerCase();
      const seasonDef = RELATIONSHIP_SEASONS[seasonKey];

      if (seasonDef) {
        // Sort by date
        planetTransits.sort((a, b) => new Date(a.date) - new Date(b.date));

        seasons.push({
          ...seasonDef,
          planet,
          start: planetTransits[0].date,
          end: planetTransits[planetTransits.length - 1].date,
          transitCount: planetTransits.length,
          transits: planetTransits
        });
      }
    }
  });

  return seasons;
}

/**
 * Build fate activation windows from transits
 *
 * @param {Array} transits - Transit events
 * @returns {Array} Fate activation windows
 */
export function buildFateActivationWindows(transits) {
  const windows = [];

  transits.forEach(t => {
    // Check for specific fate window triggers
    const key = `${t.planet}-${t.target.replace('Composite ', '')}`;

    if (FATE_ACTIVATION_WINDOWS[key]) {
      windows.push({
        ...FATE_ACTIVATION_WINDOWS[key],
        date: t.date,
        aspect: t.aspect,
        triggeringTransit: t
      });
    }

    // Saturn to any major point
    if (t.planet === 'Saturn' && t.target.includes('Sun')) {
      if (!windows.find(w => w.label === 'Saturn-Sun Fate Window')) {
        windows.push({
          ...FATE_ACTIVATION_WINDOWS['Saturn-Sun'],
          date: t.date,
          aspect: t.aspect
        });
      }
    }

    // Pluto to Moon
    if (t.planet === 'Pluto' && t.target.includes('Moon')) {
      if (!windows.find(w => w.label === 'Pluto-Moon Fate Window')) {
        windows.push({
          ...FATE_ACTIVATION_WINDOWS['Pluto-Moon'],
          date: t.date,
          aspect: t.aspect
        });
      }
    }

    // Uranus to Venus
    if (t.planet === 'Uranus' && t.target.includes('Venus')) {
      if (!windows.find(w => w.label === 'Uranus-Venus Awakening Window')) {
        windows.push({
          ...FATE_ACTIVATION_WINDOWS['Uranus-Venus'],
          date: t.date,
          aspect: t.aspect
        });
      }
    }
  });

  return windows;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build the complete Relationship Timeline
 *
 * @param {Object} composite - Composite chart from compositeGenerator
 * @param {Object} synastry - Synastry profile from synastryFateEngine
 * @param {Array} transitData - Array of transit events
 * @returns {Object} Complete relationship timeline
 */
export function buildRelationshipTimeline(composite, synastry, transitData = []) {
  // Build transits
  const transits = buildRelationshipTransits(composite, synastry, transitData);

  // Build seasons
  const seasons = buildRelationshipSeasons(transits);

  // Build fate windows
  const fateWindows = buildFateActivationWindows(transits);

  // Generate summary
  const summary = generateTimelineSummary(transits, seasons, fateWindows);

  return {
    transits,
    seasons,
    fateWindows,
    summary,

    // Quick access
    activeSeasons: seasons.filter(s => isActive(s)),
    upcomingFateWindows: fateWindows.filter(f => isUpcoming(f)),

    // Metadata
    metadata: {
      generatedAt: new Date().toISOString(),
      transitCount: transits.length,
      seasonCount: seasons.length,
      fateWindowCount: fateWindows.length
    }
  };
}

/**
 * Check if a season/window is active
 */
function isActive(item) {
  const now = new Date();
  const start = new Date(item.start || item.date);
  const end = new Date(item.end || item.date);
  return now >= start && now <= end;
}

/**
 * Check if a date is upcoming (within 2 years)
 */
function isUpcoming(item) {
  const now = new Date();
  const itemDate = new Date(item.date || item.start);
  const twoYearsFromNow = new Date(now);
  twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
  return itemDate > now && itemDate <= twoYearsFromNow;
}

/**
 * Generate timeline summary
 */
function generateTimelineSummary(transits, seasons, fateWindows) {
  const parts = [];

  if (seasons.length > 0) {
    const activeSeasons = seasons.filter(s => isActive(s));
    if (activeSeasons.length > 0) {
      parts.push(`Currently in: ${activeSeasons.map(s => s.label).join(', ')}.`);
    }
  }

  if (fateWindows.length > 0) {
    const upcomingWindows = fateWindows.filter(f => isUpcoming(f)).slice(0, 2);
    if (upcomingWindows.length > 0) {
      parts.push(`Upcoming fate windows: ${upcomingWindows.map(w => w.label).join(', ')}.`);
    }
  }

  parts.push(`${transits.length} transits tracked.`);

  return parts.join(' ');
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get just the current seasons
 */
export function getCurrentSeasons(composite, synastry, transitData) {
  const timeline = buildRelationshipTimeline(composite, synastry, transitData);
  return timeline.activeSeasons;
}

/**
 * Get upcoming fate windows
 */
export function getUpcomingFateWindows(composite, synastry, transitData) {
  const timeline = buildRelationshipTimeline(composite, synastry, transitData);
  return timeline.upcomingFateWindows;
}

/**
 * Get season definitions
 */
export function getSeasonDefinitions() {
  return RELATIONSHIP_SEASONS;
}

/**
 * Get fate window definitions
 */
export function getFateWindowDefinitions() {
  return FATE_ACTIVATION_WINDOWS;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  buildRelationshipTimeline,
  buildRelationshipTransits,
  buildRelationshipSeasons,
  buildFateActivationWindows,
  getCurrentSeasons,
  getUpcomingFateWindows,
  getSeasonDefinitions,
  getFateWindowDefinitions,
  // Export data for customization
  COMPOSITE_TRANSIT_MEANINGS,
  SYNASTRY_TRANSIT_MEANINGS,
  RELATIONSHIP_SEASONS,
  FATE_ACTIVATION_WINDOWS
};
