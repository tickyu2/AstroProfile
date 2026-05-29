/**
 * Compatibility Preset Engine
 *
 * Reads a user's natal chart and generates three viable partner archetypes:
 *   A - Sensual Earth    (stability, sensuality, loyalty)
 *   B - Mental Air       (intellect, conversation, novelty)
 *   C - Ambitious Fire   (passion, drive, leadership)
 *
 * Each preset is a filter bundle ready to populate the Reverse Engine UI.
 * Presets are ranked per-user by scoring against the user's elemental +
 * structural needs. The SAME three archetypes work for any user — what
 * changes is which one is Primary / Secondary / Optional.
 */

export const ELEMENT_OF_SIGN = {
  Aries: 'fire', Leo: 'fire', Sagittarius: 'fire',
  Taurus: 'earth', Virgo: 'earth', Capricorn: 'earth',
  Gemini: 'air', Libra: 'air', Aquarius: 'air',
  Cancer: 'water', Scorpio: 'water', Pisces: 'water',
};

export const MODALITY_OF_SIGN = {
  Aries: 'cardinal', Cancer: 'cardinal', Libra: 'cardinal', Capricorn: 'cardinal',
  Taurus: 'fixed', Leo: 'fixed', Scorpio: 'fixed', Aquarius: 'fixed',
  Gemini: 'mutable', Virgo: 'mutable', Sagittarius: 'mutable', Pisces: 'mutable',
};

const TRADITIONAL_RULER_BY_SIGN = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
  Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Mars',
  Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter',
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. CHART NORMALIZATION — accept whatever shape profile has and reduce to a
//    canonical UserChart object.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse a profile object (loose shape) into a canonical chart digest.
 * Supports the existing AstroProfile sovereign format and simpler legacy shapes.
 */
export function parseUserChart(profile) {
  if (!profile) return null;
  const sov = profile.sovereign || profile.western || profile;
  const planetsRaw = sov?.planets || profile.planets || {};
  const asc = sov?.ascendant || sov?.rising || profile.ascendant || profile.rising || {};

  const readPlanet = (key) => {
    const p = planetsRaw[key] || planetsRaw[key.toLowerCase()] || planetsRaw[cap(key)];
    if (!p) return null;
    return {
      sign: p.sign || null,
      house: typeof p.house === 'number' ? p.house : parseInt(p.house, 10) || null,
    };
  };

  const sun = readPlanet('sun') || readPlanet('Sun');
  const moon = readPlanet('moon') || readPlanet('Moon');
  const mercury = readPlanet('mercury') || readPlanet('Mercury');
  const venus = readPlanet('venus') || readPlanet('Venus');
  const mars = readPlanet('mars') || readPlanet('Mars');
  const jupiter = readPlanet('jupiter') || readPlanet('Jupiter');
  const saturn = readPlanet('saturn') || readPlanet('Saturn');
  const risingSign = asc?.sign || null;

  if (!sun || !moon || !risingSign) return null;

  // Dominant element tally — each of Sun, Moon, Mercury, Venus, Mars contributes 1
  const dominantElements = { fire: 0, earth: 0, air: 0, water: 0 };
  const dominantModalities = { cardinal: 0, fixed: 0, mutable: 0 };
  [sun, moon, mercury, venus, mars].forEach(p => {
    if (!p?.sign) return;
    const el = ELEMENT_OF_SIGN[p.sign];
    const mod = MODALITY_OF_SIGN[p.sign];
    if (el) dominantElements[el]++;
    if (mod) dominantModalities[mod]++;
  });
  // Rising adds weight too (identity interface)
  const risingEl = ELEMENT_OF_SIGN[risingSign];
  if (risingEl) dominantElements[risingEl]++;

  // 7th house: sign 180° opposite Ascendant (whole-sign approximation)
  const seventhHouseSign = oppositeSign(risingSign);
  const seventhRuler = TRADITIONAL_RULER_BY_SIGN[seventhHouseSign] || null;
  const seventhRulerPlanet = seventhRuler ? readPlanet(seventhRuler) : null;

  // Chart ruler = ruler of Rising sign
  const chartRuler = TRADITIONAL_RULER_BY_SIGN[risingSign] || null;
  const chartRulerPlanet = chartRuler ? readPlanet(chartRuler) : null;

  // Planets in 10th
  const tenthHousePlanets = [];
  const allPlanetNames = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  for (const name of allPlanetNames) {
    const p = readPlanet(name);
    if (p && p.house === 10) tenthHousePlanets.push(name);
  }

  return {
    sun, moon, mercury, venus, mars, jupiter, saturn,
    rising: { sign: risingSign },
    dominantElements,
    dominantModalities,
    seventhHouseSign,
    seventhRuler,
    seventhRulerHouse: seventhRulerPlanet?.house || null,
    chartRuler,
    chartRulerHouse: chartRulerPlanet?.house || null,
    tenthHousePlanets,
  };
}

function oppositeSign(sign) {
  const order = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
  const i = order.indexOf(sign);
  return i < 0 ? null : order[(i + 6) % 12];
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// ─────────────────────────────────────────────────────────────────────────────
// 2. NEEDS COMPUTATION
// ─────────────────────────────────────────────────────────────────────────────

export function computeUserNeeds(chart) {
  const needs = { stability: 0, mental: 0, passion: 0, safety: 0, publicAlignment: 0 };
  if (!chart) return needs;

  // Stability — Earth dominance + 7th house earth/Saturn
  needs.stability += chart.dominantElements.earth;
  if (['Capricorn','Taurus','Virgo'].includes(chart.seventhHouseSign)) needs.stability += 1.5;
  if (chart.seventhRuler === 'Saturn') needs.stability += 1.5;

  // Mental — Air dominance + communicative Mercury
  needs.mental += chart.dominantElements.air;
  if (['Gemini','Aquarius','Libra'].includes(chart.mercury?.sign)) needs.mental += 1.5;

  // Passion — Fire dominance + fiery Mars
  needs.passion += chart.dominantElements.fire;
  if (['Aries','Leo','Sagittarius'].includes(chart.mars?.sign)) needs.passion += 2;

  // Safety — Water dominance + Water Rising + 4th-house Moon
  needs.safety += chart.dominantElements.water;
  if (['Cancer','Scorpio','Pisces'].includes(chart.rising?.sign)) needs.safety += 1.5;
  if (chart.moon?.house === 4) needs.safety += 1.5;

  // Public alignment — chart ruler in 10th, 10th-house stellium, Venus/Moon in 10th
  if (chart.chartRulerHouse === 10) needs.publicAlignment += 2;
  if ((chart.tenthHousePlanets || []).length > 0) needs.publicAlignment += 1.5;
  if (chart.venus?.house === 10) needs.publicAlignment += 1;

  return needs;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PRESETS — three universal archetypes (A / B / C)
// ─────────────────────────────────────────────────────────────────────────────

const PRESET_WEIGHTS = {
  person_a_sensual_earth: { stability: 1.0, mental: 0.4, passion: 0.5, safety: 1.0, publicAlignment: 0.8 },
  person_b_mental_air:    { stability: 0.3, mental: 1.0, passion: 0.6, safety: 0.5, publicAlignment: 0.6 },
  person_c_ambitious_fire:{ stability: 0.6, mental: 0.5, passion: 1.0, safety: 0.7, publicAlignment: 1.0 },
};

export const COMPATIBILITY_PRESETS = [
  {
    id: 'person_a_sensual_earth',
    label: 'Person A — Sensual Earth Match',
    tagline: 'Stable, grounded, sensual, loyal.',
    bestFor: 'Users craving consistency, physical affection, and long-term reliability.',
    coreTraits: ['Calm', 'Dependable', 'Tactile', 'Patient', 'Steady'],
    astroSignature: 'Earth Sun/Rising • Steady Moon • Strong Saturn • Sensual Mars/Venus',
    accent: 'emerald',
    filters: {
      Sun: ['Taurus', 'Virgo', 'Capricorn'],
      Moon: ['Leo', 'Sagittarius', 'Capricorn'],
      Ascendant: ['Taurus', 'Virgo', 'Capricorn'],
      Mercury: ['Taurus', 'Gemini'],
      Venus: ['Taurus', 'Capricorn', 'Leo'],
      Mars: ['Taurus', 'Capricorn'],
      Saturn: ['Capricorn', 'Aquarius'],
    },
    houses: { Jupiter: 9 },
  },
  {
    id: 'person_b_mental_air',
    label: 'Person B — Mental Air Match',
    tagline: 'Curious, communicative, mentally stimulating.',
    bestFor: 'Users who need ideas, banter, and intellectual chemistry.',
    coreTraits: ['Witty', 'Curious', 'Flexible', 'Social', 'Debate-loving'],
    astroSignature: 'Air Sun/Rising • Sharp Mercury • Active 3rd/11th',
    accent: 'cyan',
    filters: {
      Sun: ['Aquarius', 'Gemini', 'Libra'],
      Moon: ['Gemini', 'Leo', 'Sagittarius'],
      Ascendant: ['Aquarius', 'Gemini'],
      Mercury: ['Gemini', 'Aquarius'],
      Venus: ['Aquarius', 'Gemini', 'Leo'],
      Mars: ['Gemini', 'Aries'],
      Saturn: ['Aquarius'],
    },
    houses: { Jupiter: 9 },
  },
  {
    id: 'person_c_ambitious_fire',
    label: 'Person C — Ambitious Fire Match',
    tagline: 'Passionate, driven, expressive, leadership-oriented.',
    bestFor: 'Users who want passion, leadership, and momentum.',
    coreTraits: ['Bold', 'Expressive', 'Confident', 'High-energy', 'Inspiring'],
    astroSignature: 'Fire Sun/Moon/Rising • Strong Mars • 9th/10th emphasis',
    accent: 'rose',
    filters: {
      Sun: ['Aries', 'Leo', 'Sagittarius'],
      Moon: ['Leo', 'Sagittarius'],
      Ascendant: ['Leo', 'Sagittarius'],
      Mercury: ['Aries', 'Sagittarius'],
      Venus: ['Leo', 'Aries'],
      Mars: ['Aries', 'Scorpio'],
      Saturn: ['Capricorn'],
    },
    houses: { Jupiter: 9 },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. SCORING & RANKING
// ─────────────────────────────────────────────────────────────────────────────

export function scorePreset(preset, needs) {
  const w = PRESET_WEIGHTS[preset.id];
  if (!w) return 0;
  return (
    needs.stability * w.stability +
    needs.mental * w.mental +
    needs.passion * w.passion +
    needs.safety * w.safety +
    needs.publicAlignment * w.publicAlignment
  );
}

/**
 * Rank the three presets for a given user. Returns ordered array with
 * primary/secondary/optional labels + scores, plus a short "why" rationale.
 */
export function suggestPresets(profile) {
  const chart = parseUserChart(profile);
  if (!chart) {
    return { chart: null, ranked: [], needs: null, rationale: ['Chart data incomplete — using generic order.'] };
  }
  const needs = computeUserNeeds(chart);
  const scores = {};
  for (const p of COMPATIBILITY_PRESETS) scores[p.id] = scorePreset(p, needs);

  const sorted = [...COMPATIBILITY_PRESETS].sort((a, b) => scores[b.id] - scores[a.id]);
  const ranked = sorted.map((preset, i) => ({
    preset,
    score: scores[preset.id],
    rank: i === 0 ? 'primary' : i === 1 ? 'secondary' : 'optional',
  }));

  return { chart, ranked, needs, rationale: buildRationale(chart, needs) };
}

function buildRationale(chart, needs) {
  const lines = [];
  const dom = Object.entries(chart.dominantElements).sort((a, b) => b[1] - a[1])[0];
  if (dom) lines.push(`${cap(dom[0])}-leaning profile (${chart.dominantElements.fire}F/${chart.dominantElements.earth}E/${chart.dominantElements.air}A/${chart.dominantElements.water}W).`);
  lines.push(`${chart.rising.sign} Rising → values ${needs.safety >= 2 ? 'emotional safety' : 'visible ease'}.`);
  lines.push(`${chart.sun.sign} Sun + ${chart.moon.sign} Moon → ${chart.moon.sign} emotional processing style.`);
  if (chart.chartRulerHouse === 10 || chart.tenthHousePlanets.length > 0) {
    lines.push(`10th-house emphasis (${chart.tenthHousePlanets.join(', ') || 'chart ruler'}) → partner must align with your public life.`);
  }
  if (chart.seventhHouseSign) {
    lines.push(`7th house in ${chart.seventhHouseSign} → you attract ${seventhHouseFlavor(chart.seventhHouseSign)} partners.`);
  }
  return lines;
}

function seventhHouseFlavor(sign) {
  const el = ELEMENT_OF_SIGN[sign];
  if (el === 'earth') return 'mature, structured, responsible';
  if (el === 'fire') return 'bold, initiating, passionate';
  if (el === 'air') return 'communicative, social, idea-driven';
  if (el === 'water') return 'emotionally deep, nurturing, intuitive';
  return 'well-matched';
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CORE NEEDS DETECTOR — user-specific non-negotiables
// ─────────────────────────────────────────────────────────────────────────────

export function detectCoreNeeds(chart) {
  if (!chart) return { coreNeeds: [] };
  const needs = [];
  const push = (need) => { if (!needs.find(n => n.id === need.id)) needs.push(need); };

  // Emotional safety — Water Rising/Moon or 4th-house Moon
  if (['Cancer','Scorpio','Pisces'].includes(chart.rising?.sign) || chart.moon?.house === 4) {
    push({
      id: 'emotional_safety',
      label: 'Emotional Safety',
      description: 'Partner must feel safe, caring, emotionally available.',
      weight: 10, hard: true,
    });
  }

  // Stability / sensuality — Earth Sun or Mars
  if (['Taurus','Virgo','Capricorn'].includes(chart.sun?.sign) ||
      ['Taurus','Virgo','Capricorn'].includes(chart.mars?.sign)) {
    push({
      id: 'stability',
      label: 'Stability',
      description: 'Reliability, consistency, long-term orientation.',
      weight: 9, hard: true,
    });
    push({
      id: 'sensuality',
      label: 'Sensuality',
      description: 'Physical comfort, touch, embodied presence.',
      weight: 8, hard: false,
    });
  }

  // Mental stimulation — Air dominance
  if (['Gemini','Libra','Aquarius'].includes(chart.sun?.sign) ||
      ['Gemini','Libra','Aquarius'].includes(chart.moon?.sign) ||
      ['Gemini','Aquarius'].includes(chart.mercury?.sign)) {
    push({
      id: 'mental_stimulation',
      label: 'Mental Stimulation',
      description: 'Sharp conversation, intellectual engagement — non-negotiable.',
      weight: 10, hard: true,
    });
  }

  // Directness — Fire Moon (Aries/Sag)
  if (['Aries','Sagittarius'].includes(chart.moon?.sign)) {
    push({
      id: 'directness',
      label: 'Directness',
      description: 'Honest, fast, straightforward emotional expression.',
      weight: 8, hard: true,
    });
  }

  // Public alignment — chart ruler in 10th or 10th-house stellium
  if (chart.chartRulerHouse === 10 || (chart.tenthHousePlanets || []).length > 0) {
    push({
      id: 'public_alignment',
      label: 'Public Alignment',
      description: 'Partner must fit your public/career life.',
      weight: 8, hard: false,
    });
  }

  // Freedom — Sag/Aqu Rising
  if (['Sagittarius','Aquarius'].includes(chart.rising?.sign)) {
    push({
      id: 'freedom',
      label: 'Freedom',
      description: 'Space, autonomy, non-controlling dynamics.',
      weight: 9, hard: true,
    });
  }

  // Admiration — Leo Sun/Moon
  if (chart.sun?.sign === 'Leo' || chart.moon?.sign === 'Leo') {
    push({
      id: 'admiration',
      label: 'Admiration',
      description: 'Feel seen, valued, proud in love.',
      weight: 8, hard: false,
    });
  }

  // Loyalty — fixed-modality dominant
  if ((chart.dominantModalities?.fixed || 0) >= 3) {
    push({
      id: 'loyalty',
      label: 'Loyalty',
      description: 'Deep, unwavering commitment.',
      weight: 9, hard: true,
    });
  }

  return { coreNeeds: needs };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. TRADE-OFFS — realism layer: positives / negatives per preset
// ─────────────────────────────────────────────────────────────────────────────

export const PRESET_TRADEOFFS = {
  person_a_sensual_earth: {
    positives: [
      'High stability and reliability',
      'Strong sensual / physical presence',
      'Grounding influence day-to-day',
    ],
    negatives: [
      'Slow to change or adapt',
      'Can be stubborn, resistant to novelty',
      'Emotional expression may be muted / practical',
    ],
    summary: 'Stability & touch > speed & novelty.',
  },
  person_b_mental_air: {
    positives: [
      'High mental stimulation and conversation',
      'Flexible, curious, open-minded',
      'Strong perspective-taking',
    ],
    negatives: [
      'May struggle with emotional depth',
      'Can feel detached or overly rational',
      'Avoids heavy emotional processing',
    ],
    summary: 'Ideas & dialogue > emotional intensity.',
  },
  person_c_ambitious_fire: {
    positives: [
      'High passion and energy',
      'Inspiring, forward-moving momentum',
      'Strong drive and direction',
    ],
    negatives: [
      'Can be intense or volatile',
      'Possible ego clashes, dominance struggles',
      'Goals may trump emotional nuance',
    ],
    summary: 'Momentum & passion > calm predictability.',
  },
};

/**
 * Planet → axis → weight mapping. Rising + Sun are always hard; everything
 * else is soft and gets a per-axis weight derived from the user's core needs.
 */
export const PLANET_AXIS = {
  Ascendant: 'identity',
  Sun:       'identity',
  Moon:      'emotional',
  Venus:     'relational',
  Mars:      'passion',
  Mercury:   'mental',
  Saturn:    'life_path',
  Jupiter:   'life_path',
  Pluto:     'life_path',
  Uranus:    'life_path',
  Neptune:   'life_path',
};

/**
 * Compute per-planet weights from the user's chart. Rising + Sun are HARD
 * (infinite weight — must match); others get 1–10 based on core-needs axes.
 */
export function computePlanetWeights(chart) {
  const needs = detectCoreNeeds(chart).coreNeeds;
  const hasNeed = (id) => needs.some(n => n.id === id);

  // Base weights — defaults
  const weights = {
    Ascendant: Infinity,   // HARD
    Sun:       Infinity,   // HARD
    Moon:      8,
    Venus:     6,
    Mars:      5,
    Mercury:   4,
    Saturn:    3,
    Jupiter:   3,
    Pluto:     2,
    Uranus:    1,
    Neptune:   1,
  };

  // Boost by core needs
  if (hasNeed('emotional_safety')) weights.Moon = Math.max(weights.Moon, 10);
  if (hasNeed('directness'))       weights.Moon = Math.max(weights.Moon, 9);
  if (hasNeed('sensuality'))       weights.Venus = Math.max(weights.Venus, 8);
  if (hasNeed('stability'))        weights.Saturn = Math.max(weights.Saturn, 6);
  if (hasNeed('mental_stimulation')) weights.Mercury = Math.max(weights.Mercury, 9);
  if (hasNeed('freedom'))          weights.Uranus = Math.max(weights.Uranus, 5);
  if (hasNeed('admiration'))       weights.Venus = Math.max(weights.Venus, 8);
  if (hasNeed('public_alignment')) weights.Saturn = Math.max(weights.Saturn, 5);
  if (hasNeed('loyalty'))          weights.Venus = Math.max(weights.Venus, 8);

  return weights;
}

