/**
 * Aspect Pattern Detector
 *
 * Detects major aspect configurations in a birth chart:
 * - Grand Trines (3 planets in mutual trine)
 * - T-Squares (2 planets in opposition, 3rd squaring both)
 * - Yods (2 planets sextile, 3rd quincunx to both - "Finger of God")
 * - Grand Crosses (4 planets forming 2 oppositions and 4 squares)
 * - Kites (Grand Trine with opposition from one planet)
 * - Quincunxes (150° aspects - "invisible friction")
 * - Mystic Rectangles (2 oppositions with sextiles and trines)
 *
 * Part of the Liz Greene Cathedral of Psychological Astrology
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const ASPECT_ORBS = {
  conjunction: 8,
  opposition: 8,
  trine: 8,
  square: 7,
  sextile: 6,
  quincunx: 3
};

const SIGN_ELEMENTS = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
};

const SIGN_MODALITIES = {
  Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
  Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
  Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable'
};

const PLANET_NAMES = {
  sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus',
  mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn',
  uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto',
  ascendant: 'Ascendant', midheaven: 'Midheaven', node: 'North Node'
};

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate angular distance between two positions
 */
function getAngularDistance(pos1, pos2) {
  let diff = Math.abs(pos1 - pos2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

/**
 * Check if two positions form a specific aspect
 */
function hasAspect(pos1, pos2, aspectType) {
  const exactAngles = {
    conjunction: 0,
    opposition: 180,
    trine: 120,
    square: 90,
    sextile: 60,
    quincunx: 150
  };

  const distance = getAngularDistance(pos1, pos2);
  const exactAngle = exactAngles[aspectType];
  const orb = ASPECT_ORBS[aspectType];

  return Math.abs(distance - exactAngle) <= orb;
}

/**
 * Get aspect orb (how exact the aspect is)
 */
function getAspectOrb(pos1, pos2, aspectType) {
  const exactAngles = {
    conjunction: 0,
    opposition: 180,
    trine: 120,
    square: 90,
    sextile: 60,
    quincunx: 150
  };

  const distance = getAngularDistance(pos1, pos2);
  return Math.abs(distance - exactAngles[aspectType]);
}

/**
 * Extract planet positions from chart data
 */
function extractPlanetPositions(chartData) {
  const positions = {};
  const planets = chartData.planets || {};

  // Add Sun, Moon, Rising
  if (chartData.sun?.longitude !== undefined) {
    positions.sun = { longitude: chartData.sun.longitude, sign: chartData.sun.sign };
  }
  if (chartData.moon?.longitude !== undefined) {
    positions.moon = { longitude: chartData.moon.longitude, sign: chartData.moon.sign };
  }
  if (chartData.rising?.longitude !== undefined) {
    positions.ascendant = { longitude: chartData.rising.longitude, sign: chartData.rising.sign };
  }

  // Add other planets
  Object.entries(planets).forEach(([key, planet]) => {
    if (planet?.longitude !== undefined) {
      positions[key] = { longitude: planet.longitude, sign: planet.sign };
    }
  });

  return positions;
}

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN DETECTION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Detect Grand Trines (3 planets in mutual trine - 120° apart)
 */
function detectGrandTrines(positions) {
  const grandTrines = [];
  const planetKeys = Object.keys(positions);

  // Check all combinations of 3 planets
  for (let i = 0; i < planetKeys.length - 2; i++) {
    for (let j = i + 1; j < planetKeys.length - 1; j++) {
      for (let k = j + 1; k < planetKeys.length; k++) {
        const p1 = planetKeys[i];
        const p2 = planetKeys[j];
        const p3 = planetKeys[k];

        const pos1 = positions[p1].longitude;
        const pos2 = positions[p2].longitude;
        const pos3 = positions[p3].longitude;

        // Check if all three are in trine
        if (hasAspect(pos1, pos2, 'trine') &&
            hasAspect(pos2, pos3, 'trine') &&
            hasAspect(pos1, pos3, 'trine')) {

          // Determine element
          const elements = [
            SIGN_ELEMENTS[positions[p1].sign],
            SIGN_ELEMENTS[positions[p2].sign],
            SIGN_ELEMENTS[positions[p3].sign]
          ];
          const dominantElement = elements.find(e => elements.filter(el => el === e).length >= 2) || elements[0];

          grandTrines.push({
            type: 'Grand Trine',
            symbol: '△',
            planets: [p1, p2, p3].map(p => PLANET_NAMES[p] || p),
            element: dominantElement,
            orbs: [
              getAspectOrb(pos1, pos2, 'trine'),
              getAspectOrb(pos2, pos3, 'trine'),
              getAspectOrb(pos1, pos3, 'trine')
            ],
            psychology: getGrandTrinePsychology(dominantElement),
            shadow: getGrandTrineShadow(dominantElement),
            integration: getGrandTrineIntegration(dominantElement)
          });
        }
      }
    }
  }

  return grandTrines;
}

/**
 * Detect T-Squares (2 planets in opposition, 3rd squaring both)
 */
function detectTSquares(positions) {
  const tSquares = [];
  const planetKeys = Object.keys(positions);

  // Check all combinations of 3 planets
  for (let i = 0; i < planetKeys.length - 2; i++) {
    for (let j = i + 1; j < planetKeys.length - 1; j++) {
      for (let k = j + 1; k < planetKeys.length; k++) {
        const p1 = planetKeys[i];
        const p2 = planetKeys[j];
        const p3 = planetKeys[k];

        const pos1 = positions[p1].longitude;
        const pos2 = positions[p2].longitude;
        const pos3 = positions[p3].longitude;

        // Check all possible configurations
        const configs = [
          { opposition: [p1, p2], apex: p3, opPos: [pos1, pos2], apexPos: pos3 },
          { opposition: [p1, p3], apex: p2, opPos: [pos1, pos3], apexPos: pos2 },
          { opposition: [p2, p3], apex: p1, opPos: [pos2, pos3], apexPos: pos1 }
        ];

        for (const config of configs) {
          if (hasAspect(config.opPos[0], config.opPos[1], 'opposition') &&
              hasAspect(config.opPos[0], config.apexPos, 'square') &&
              hasAspect(config.opPos[1], config.apexPos, 'square')) {

            const apexSign = positions[config.apex].sign;
            const modality = SIGN_MODALITIES[apexSign];

            tSquares.push({
              type: 'T-Square',
              symbol: '⊤',
              planets: [...config.opposition, config.apex].map(p => PLANET_NAMES[p] || p),
              apex: PLANET_NAMES[config.apex] || config.apex,
              apexSign: apexSign,
              modality: modality,
              psychology: getTSquarePsychology(config.apex, modality),
              shadow: getTSquareShadow(modality),
              integration: getTSquareIntegration(config.apex, modality)
            });
          }
        }
      }
    }
  }

  // Remove duplicates
  return tSquares.filter((t, idx, arr) =>
    arr.findIndex(x => x.planets.sort().join(',') === t.planets.sort().join(',')) === idx
  );
}

/**
 * Detect Yods (Finger of God - 2 planets sextile, 3rd quincunx to both)
 */
function detectYods(positions) {
  const yods = [];
  const planetKeys = Object.keys(positions);

  for (let i = 0; i < planetKeys.length - 2; i++) {
    for (let j = i + 1; j < planetKeys.length - 1; j++) {
      for (let k = j + 1; k < planetKeys.length; k++) {
        const p1 = planetKeys[i];
        const p2 = planetKeys[j];
        const p3 = planetKeys[k];

        const pos1 = positions[p1].longitude;
        const pos2 = positions[p2].longitude;
        const pos3 = positions[p3].longitude;

        // Check all possible configurations
        const configs = [
          { base: [p1, p2], apex: p3, basePos: [pos1, pos2], apexPos: pos3 },
          { base: [p1, p3], apex: p2, basePos: [pos1, pos3], apexPos: pos2 },
          { base: [p2, p3], apex: p1, basePos: [pos2, pos3], apexPos: pos1 }
        ];

        for (const config of configs) {
          if (hasAspect(config.basePos[0], config.basePos[1], 'sextile') &&
              hasAspect(config.basePos[0], config.apexPos, 'quincunx') &&
              hasAspect(config.basePos[1], config.apexPos, 'quincunx')) {

            const apexPlanet = PLANET_NAMES[config.apex] || config.apex;

            yods.push({
              type: 'Yod',
              symbol: '⬆',
              altName: 'Finger of God',
              planets: [...config.base, config.apex].map(p => PLANET_NAMES[p] || p),
              apex: apexPlanet,
              apexSign: positions[config.apex].sign,
              psychology: getYodPsychology(config.apex),
              shadow: getYodShadow(),
              integration: getYodIntegration(config.apex)
            });
          }
        }
      }
    }
  }

  return yods.filter((y, idx, arr) =>
    arr.findIndex(x => x.planets.sort().join(',') === y.planets.sort().join(',')) === idx
  );
}

/**
 * Detect Grand Crosses (4 planets forming 2 oppositions and 4 squares)
 */
function detectGrandCrosses(positions) {
  const grandCrosses = [];
  const planetKeys = Object.keys(positions);

  if (planetKeys.length < 4) return grandCrosses;

  // Check all combinations of 4 planets
  for (let i = 0; i < planetKeys.length - 3; i++) {
    for (let j = i + 1; j < planetKeys.length - 2; j++) {
      for (let k = j + 1; k < planetKeys.length - 1; k++) {
        for (let l = k + 1; l < planetKeys.length; l++) {
          const planets = [planetKeys[i], planetKeys[j], planetKeys[k], planetKeys[l]];
          const poss = planets.map(p => positions[p].longitude);

          // Sort by longitude to check pattern
          const sorted = planets.map((p, idx) => ({ p, pos: poss[idx] }))
            .sort((a, b) => a.pos - b.pos);

          // Check if we have 2 oppositions and 4 squares
          let oppositions = 0;
          let squares = 0;

          for (let a = 0; a < 4; a++) {
            for (let b = a + 1; b < 4; b++) {
              if (hasAspect(sorted[a].pos, sorted[b].pos, 'opposition')) oppositions++;
              if (hasAspect(sorted[a].pos, sorted[b].pos, 'square')) squares++;
            }
          }

          if (oppositions >= 2 && squares >= 4) {
            const modalities = sorted.map(s => SIGN_MODALITIES[positions[s.p].sign]);
            const dominantModality = modalities.find(m => modalities.filter(x => x === m).length >= 2) || modalities[0];

            grandCrosses.push({
              type: 'Grand Cross',
              symbol: '✚',
              planets: planets.map(p => PLANET_NAMES[p] || p),
              modality: dominantModality,
              psychology: getGrandCrossPsychology(dominantModality),
              shadow: getGrandCrossShadow(dominantModality),
              integration: getGrandCrossIntegration(dominantModality)
            });
          }
        }
      }
    }
  }

  return grandCrosses.filter((g, idx, arr) =>
    arr.findIndex(x => x.planets.sort().join(',') === g.planets.sort().join(',')) === idx
  );
}

/**
 * Detect Kites (Grand Trine with one planet opposing a trine planet)
 */
function detectKites(positions, grandTrines) {
  const kites = [];
  const planetKeys = Object.keys(positions);

  grandTrines.forEach(trine => {
    const trinePlanets = trine.planets.map(name =>
      Object.entries(PLANET_NAMES).find(([k, v]) => v === name)?.[0] || name.toLowerCase()
    );

    // Look for a planet opposing one of the trine planets
    planetKeys.forEach(p => {
      if (trinePlanets.includes(p)) return;

      const pos = positions[p].longitude;

      trinePlanets.forEach(tp => {
        if (!positions[tp]) return;
        const trinePos = positions[tp].longitude;

        if (hasAspect(pos, trinePos, 'opposition')) {
          // Check if the new planet sextiles the other two trine planets
          const otherTrinePlanets = trinePlanets.filter(x => x !== tp);
          const sextileBoth = otherTrinePlanets.every(otp =>
            positions[otp] && hasAspect(pos, positions[otp].longitude, 'sextile')
          );

          if (sextileBoth) {
            kites.push({
              type: 'Kite',
              symbol: '◇',
              planets: [...trine.planets, PLANET_NAMES[p] || p],
              apex: PLANET_NAMES[p] || p,
              element: trine.element,
              psychology: getKitePsychology(p, trine.element),
              shadow: getKiteShadow(),
              integration: getKiteIntegration(p)
            });
          }
        }
      });
    });
  });

  return kites.filter((k, idx, arr) =>
    arr.findIndex(x => x.planets.sort().join(',') === k.planets.sort().join(',')) === idx
  );
}

/**
 * Detect Quincunxes (150° aspects - "invisible friction")
 * Greene's insight: These create adjustment tension, not direct conflict
 */
function detectQuincunxes(positions) {
  const quincunxes = [];
  const planetKeys = Object.keys(positions);

  for (let i = 0; i < planetKeys.length; i++) {
    for (let j = i + 1; j < planetKeys.length; j++) {
      const p1 = planetKeys[i];
      const p2 = planetKeys[j];

      const pos1 = positions[p1].longitude;
      const pos2 = positions[p2].longitude;

      if (hasAspect(pos1, pos2, 'quincunx')) {
        const sign1 = positions[p1].sign;
        const sign2 = positions[p2].sign;
        const element1 = SIGN_ELEMENTS[sign1];
        const element2 = SIGN_ELEMENTS[sign2];
        const modality1 = SIGN_MODALITIES[sign1];
        const modality2 = SIGN_MODALITIES[sign2];

        quincunxes.push({
          type: 'Quincunx',
          symbol: '⚻',
          altName: 'Inconjunct',
          planets: [p1, p2].map(p => PLANET_NAMES[p] || p),
          signs: [sign1, sign2],
          elements: [element1, element2],
          modalities: [modality1, modality2],
          orb: getAspectOrb(pos1, pos2, 'quincunx'),
          psychology: getQuincunxPsychology(p1, p2, sign1, sign2),
          shadow: getQuincunxShadow(p1, p2),
          integration: getQuincunxIntegration(p1, p2)
        });
      }
    }
  }

  return quincunxes;
}

/**
 * Detect Quincunx Chains (multiple planets connected by quincunxes)
 * Creates chronic adjustment patterns
 */
function detectQuincunxChains(quincunxes) {
  if (quincunxes.length < 2) return [];

  const chains = [];
  const processed = new Set();

  // Build adjacency map
  const connections = {};
  quincunxes.forEach(q => {
    const [p1, p2] = q.planets;
    if (!connections[p1]) connections[p1] = [];
    if (!connections[p2]) connections[p2] = [];
    connections[p1].push(p2);
    connections[p2].push(p1);
  });

  // Find chains (planets connected by multiple quincunxes)
  Object.keys(connections).forEach(planet => {
    if (processed.has(planet)) return;
    if (connections[planet].length >= 2) {
      const chainPlanets = [planet, ...connections[planet]];
      const uniqueChain = [...new Set(chainPlanets)];

      if (uniqueChain.length >= 3) {
        chains.push({
          type: 'Quincunx Chain',
          symbol: '⚻⚻',
          planets: uniqueChain,
          count: uniqueChain.length,
          psychology: getQuincunxChainPsychology(uniqueChain),
          shadow: "Chronic sense of life requiring endless adjustment. Nothing ever quite fits. Exhaustion from perpetual adaptation.",
          integration: "Accept that some discomfort is permanent. The friction IS the path. Use the tension as fuel for continuous growth rather than seeking resolution that won't come."
        });
        uniqueChain.forEach(p => processed.add(p));
      }
    }
  });

  return chains;
}

// ═══════════════════════════════════════════════════════════════════════════
// PSYCHOLOGY CONTENT
// ═══════════════════════════════════════════════════════════════════════════

// Quincunx Psychology (Greene's "invisible friction")
function getQuincunxPsychology(planet1, planet2, sign1, sign2) {
  const p1Name = PLANET_NAMES[planet1] || planet1;
  const p2Name = PLANET_NAMES[planet2] || planet2;

  return `${p1Name} in ${sign1} and ${p2Name} in ${sign2} share nothing in common - not element, not modality. They don't oppose or conflict directly; they simply don't understand each other. This creates a perpetual need for adjustment, a sense that something is always slightly "off." Greene called this "invisible friction" - you can't point to the conflict, but you feel it constantly.`;
}

function getQuincunxShadow(planet1, planet2) {
  const p1Name = PLANET_NAMES[planet1] || planet1;
  const p2Name = PLANET_NAMES[planet2] || planet2;

  return `Health issues may manifest in the body parts ruled by ${p1Name} and ${p2Name} when this tension is chronically suppressed. Psychosomatically, what cannot be integrated in the psyche may express through the body. You may also project one planet's needs onto others, unable to own both parts of yourself.`;
}

function getQuincunxIntegration(planet1, planet2) {
  const p1Name = PLANET_NAMES[planet1] || planet1;
  const p2Name = PLANET_NAMES[planet2] || planet2;

  return `Stop trying to make ${p1Name} and ${p2Name} "get along" - they won't. Instead, consciously alternate between them. Give each its due time and expression. The integration isn't fusion; it's acceptance of inner complexity. Service to others often provides a container large enough to hold both energies.`;
}

function getQuincunxChainPsychology(planets) {
  return `Multiple quincunxes create a personality that is perpetually adjusting, perpetually not-quite-fitting. You've developed remarkable adaptability, but may feel fundamentally uncomfortable in your own skin. This pattern often indicates a soul working on flexibility across multiple lifetimes.`;
}

function getGrandTrinePsychology(element) {
  const psychology = {
    Fire: "Natural creativity and inspiration flow effortlessly. You have innate enthusiasm and the ability to inspire others. Life force energy circulates freely through vision, action, and faith.",
    Earth: "Practical talents come naturally. You have an innate ability to manifest, build, and create tangible results. Material wisdom and physical intelligence flow without effort.",
    Air: "Mental agility and social intelligence come naturally. Ideas flow freely, connections form easily, and communication feels effortless. You're a natural networker and thinker.",
    Water: "Emotional intelligence and intuition flow naturally. You have deep empathic abilities and psychological insight. Feelings guide you accurately toward truth."
  };
  return psychology[element] || "Natural talents flow harmoniously through this elemental circuit.";
}

function getGrandTrineShadow(element) {
  const shadows = {
    Fire: "Talents may be taken for granted. Restlessness when things come too easily. May lack the drive that struggle creates.",
    Earth: "Complacency with material success. May miss opportunities for growth because comfort is too available.",
    Air: "May intellectualize without depth. Social ease can become superficiality. Knowledge without wisdom.",
    Water: "Emotional sensitivity can become passivity. May absorb others' feelings without boundaries. Avoidance of practical action."
  };
  return shadows[element] || "Natural gifts may be underutilized due to lack of friction.";
}

function getGrandTrineIntegration(element) {
  const integration = {
    Fire: "Channel your natural enthusiasm into sustained creative projects. Use your inspiration to lift others, not just yourself.",
    Earth: "Build something that lasts beyond personal comfort. Use your practical gifts to serve the collective.",
    Air: "Deepen your connections. Move from networking to genuine intimacy. Let ideas become wisdom through experience.",
    Water: "Ground your intuition in action. Use your empathy to heal, not just to feel. Establish healthy emotional boundaries."
  };
  return integration[element] || "Consciously direct your natural talents toward meaningful purpose.";
}

function getTSquarePsychology(apex, modality) {
  const apexName = PLANET_NAMES[apex] || apex;
  return `The ${apexName} at the apex becomes your release point - where the tension of the opposition seeks expression. ${modality} energy drives you to ACT on this tension. This is not comfortable, but it creates tremendous drive and accomplishment.`;
}

function getTSquareShadow(modality) {
  const shadows = {
    Cardinal: "Impulsive action to escape tension. Starting things but not finishing. Projecting conflict outward.",
    Fixed: "Stubborn resistance to change. Building up pressure until explosive release. Inflexibility.",
    Mutable: "Scattered energy trying to avoid the core tension. Mental anxiety. Difficulty committing to one path."
  };
  return shadows[modality] || "The tension may drive compulsive behavior or projection.";
}

function getTSquareIntegration(apex, modality) {
  const apexName = PLANET_NAMES[apex] || apex;
  return `Work consciously with ${apexName} energy. The 'empty leg' opposite the apex (where there's no planet) represents the balancing point you must develop. ${modality === 'Cardinal' ? 'Learn patience' : modality === 'Fixed' ? 'Embrace change' : 'Find your center'}.`;
}

function getYodPsychology(apex) {
  const apexName = PLANET_NAMES[apex] || apex;
  return `The Yod points to ${apexName} as your fated mission - something you MUST express but that feels perpetually uncomfortable. The quincunxes create a sense that this energy doesn't quite fit anywhere, yet it's precisely what you're here to develop.`;
}

function getYodShadow() {
  return "Chronic sense of being 'off' or not fitting in. The apex planet's expression feels awkward no matter how you try. Health issues may manifest if the energy is chronically suppressed.";
}

function getYodIntegration(apex) {
  const apexName = PLANET_NAMES[apex] || apex;
  return `Accept that ${apexName} will never feel 'normal' - it's meant to be your unique gift. The discomfort is the refinement process. Service to others often activates Yod energy positively.`;
}

function getGrandCrossPsychology(modality) {
  const psychology = {
    Cardinal: "Constant pressure to initiate, lead, and take action in multiple directions simultaneously. Life presents continuous crossroads requiring decisive action.",
    Fixed: "Immense determination and staying power, but pulled in four directions at once. You possess enormous willpower but must learn when to let go.",
    Mutable: "Adaptable and flexible, but potentially scattered. Life requires constant adjustment and the ability to serve multiple masters."
  };
  return psychology[modality] || "Four-way tension creates tremendous drive but requires conscious integration.";
}

function getGrandCrossShadow(modality) {
  const shadows = {
    Cardinal: "Burnout from constant action. Starting too many things. Crisis addiction.",
    Fixed: "Paralysis from trying to hold everything together. Rigidity. Inability to prioritize.",
    Mutable: "Complete scatter. No clear identity. Serving everyone except yourself."
  };
  return shadows[modality] || "The four-way pull can fragment energy and purpose.";
}

function getGrandCrossIntegration(modality) {
  const integration = {
    Cardinal: "Learn to pause before acting. Not every crossroad requires immediate choice. Develop patience.",
    Fixed: "Practice conscious release. Prioritize. Some things must be let go for others to thrive.",
    Mutable: "Find your center. Develop a core identity that remains stable while adapting to life's changes."
  };
  return integration[modality] || "Find the still point at the center of the cross.";
}

function getKitePsychology(apex, element) {
  const apexName = PLANET_NAMES[apex] || apex;
  return `The Kite channels the easy flow of the Grand Trine through ${apexName} into focused manifestation. Unlike the pure Grand Trine, this pattern has direction and purpose - the opposition creates drive while the trine provides talent.`;
}

function getKiteShadow() {
  return "May over-rely on the apex planet, neglecting the broader talents of the trine. The opposition can create blind spots.";
}

function getKiteIntegration(apex) {
  const apexName = PLANET_NAMES[apex] || apex;
  return `Use ${apexName} as your channel for manifesting gifts, but don't forget to nurture the full trine. Balance focus with flow.`;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXPORT FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Detect all major aspect patterns in a chart
 * @param {Object} chartData - Western astrology chart data
 * @returns {Object} - Detected patterns with psychological interpretations
 */
export function detectAspectPatterns(chartData) {
  if (!chartData) return { patterns: [], summary: null };

  const positions = extractPlanetPositions(chartData);

  if (Object.keys(positions).length < 3) {
    return { patterns: [], summary: null };
  }

  // Detect patterns
  const grandTrines = detectGrandTrines(positions);
  const tSquares = detectTSquares(positions);
  const yods = detectYods(positions);
  const grandCrosses = detectGrandCrosses(positions);
  const kites = detectKites(positions, grandTrines);
  const quincunxes = detectQuincunxes(positions);
  const quincunxChains = detectQuincunxChains(quincunxes);

  // Combine major patterns (excluding individual quincunxes which are listed separately)
  const patterns = [
    ...grandTrines,
    ...tSquares,
    ...yods,
    ...grandCrosses,
    ...kites,
    ...quincunxChains
  ];

  // Generate summary
  const summary = generatePatternSummary(patterns, quincunxes);

  return {
    patterns,
    grandTrines,
    tSquares,
    yods,
    grandCrosses,
    kites,
    quincunxes,
    quincunxChains,
    summary,
    hasPatterns: patterns.length > 0,
    hasQuincunxes: quincunxes.length > 0
  };
}

/**
 * Generate a psychological summary of all patterns
 */
function generatePatternSummary(patterns, quincunxes = []) {
  if (patterns.length === 0 && quincunxes.length === 0) {
    return {
      overview: "No major aspect configurations detected. This doesn't mean the chart lacks significance - individual aspects still carry deep meaning.",
      focus: "Look to individual planet aspects for psychological dynamics."
    };
  }

  const hasGrandTrine = patterns.some(p => p.type === 'Grand Trine');
  const hasTSquare = patterns.some(p => p.type === 'T-Square');
  const hasYod = patterns.some(p => p.type === 'Yod');
  const hasGrandCross = patterns.some(p => p.type === 'Grand Cross');
  const hasKite = patterns.some(p => p.type === 'Kite');
  const hasQuincunxChain = patterns.some(p => p.type === 'Quincunx Chain');

  let overview = '';

  if (patterns.length > 0) {
    overview = `This chart contains ${patterns.length} major aspect configuration${patterns.length > 1 ? 's' : ''}: `;
    overview += patterns.map(p => p.type).join(', ') + '. ';
  }

  if (quincunxes.length > 0) {
    overview += `Additionally, ${quincunxes.length} quincunx aspect${quincunxes.length > 1 ? 's create' : ' creates'} "invisible friction" - subtle tensions requiring perpetual adjustment. `;
  }

  if (hasGrandTrine && hasTSquare) {
    overview += "The combination of ease (Grand Trine) and challenge (T-Square) creates a dynamic personality with both natural gifts and driving tension.";
  } else if (hasYod) {
    overview += "The presence of a Yod indicates a fated quality - specific gifts that must be developed despite discomfort.";
  } else if (hasGrandCross) {
    overview += "The Grand Cross indicates a life of significant challenge and potential mastery.";
  } else if (hasQuincunxChain) {
    overview += "The Quincunx Chain indicates a personality built around perpetual adaptation - uncomfortable but remarkably flexible.";
  } else if (quincunxes.length >= 3) {
    overview += "Multiple quincunxes create a life theme of adjustment. Nothing comes easily, but profound adaptability develops.";
  }

  return {
    overview,
    patternCount: patterns.length,
    quincunxCount: quincunxes.length,
    types: [...new Set(patterns.map(p => p.type))]
  };
}

export default {
  detectAspectPatterns,
  detectGrandTrines,
  detectTSquares,
  detectYods,
  detectGrandCrosses,
  detectKites,
  detectQuincunxes,
  detectQuincunxChains
};
