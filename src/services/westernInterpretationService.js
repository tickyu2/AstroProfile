/**
 * Western Interpretation Service
 *
 * Narrative generation for Western astrology profiles:
 * - Planet in sign interpretations
 * - Element balance narratives
 * - Dignity summaries
 * - Synastry overlay interpretations
 */

// =============================================================================
// KEYWORD DICTIONARIES
// =============================================================================

const PLANET_KEYWORDS = {
  Sun: "core identity, vitality, ego, purpose",
  Moon: "emotions, needs, habits, instinct",
  Mercury: "mind, communication, learning",
  Venus: "love, pleasure, aesthetics, bonding",
  Mars: "drive, assertion, conflict, passion",
  Jupiter: "growth, faith, expansion, wisdom",
  Saturn: "structure, limits, responsibility, time",
  Uranus: "innovation, freedom, sudden change",
  Neptune: "spirituality, dreams, illusion, transcendence",
  Pluto: "transformation, power, depth, rebirth",
  Ascendant: "outer personality, first impressions, approach to life",
  Midheaven: "career, public image, life direction",
  "North Node": "soul growth direction, karmic path forward",
  "South Node": "past life gifts, comfort zone patterns",
  Chiron: "core wound, healing journey, teaching ability"
};

const ELEMENT_KEYWORDS = {
  Fire: "action, inspiration, courage, spontaneity",
  Earth: "stability, practicality, material reality",
  Air: "ideas, communication, social connection",
  Water: "emotion, intuition, depth, sensitivity"
};

const ELEMENT_QUALITIES = {
  Fire: "active, dynamic, self-expressive",
  Earth: "grounded, reliable, sensory",
  Air: "intellectual, social, adaptive",
  Water: "emotional, intuitive, empathic"
};

const MODALITY_KEYWORDS = {
  Cardinal: "initiating, leadership, action-oriented",
  Fixed: "stable, persistent, determined",
  Mutable: "adaptable, flexible, changeable"
};

const DIGNITY_KEYWORDS = {
  Exalted: "expresses its gifts with ease and strength",
  Domicile: "feels at home and functions reliably",
  Neutral: "behaves in a balanced, ordinary way",
  Detriment: "struggles to express itself cleanly",
  Debilitated: "feels weakened or conflicted"
};

const DIGNITY_STRENGTHS = {
  Exalted: "highly supported",
  Domicile: "naturally strong",
  Neutral: "balanced",
  Detriment: "challenged",
  Debilitated: "requiring conscious work"
};

const POLARITY_KEYWORDS = {
  Yang: "active, outward, initiating, masculine",
  Yin: "receptive, inward, responsive, feminine"
};

// =============================================================================
// PLANET INTERPRETATION
// =============================================================================

/**
 * Generate interpretation for a planet in its sign
 */
export function interpretPlanetInSign(planetObj) {
  const planet = planetObj.planet || "Unknown";
  const sign = planetObj.sign || "Unknown";
  const element = planetObj.element || "Fire";
  const modality = planetObj.modality || "Fixed";
  const polarity = planetObj.polarity || "Yang";
  const dignity = planetObj.dignity || "Neutral";

  const pk = PLANET_KEYWORDS[planet] || "life themes";
  const ek = ELEMENT_KEYWORDS[element] || "energy";
  const eq = ELEMENT_QUALITIES[element] || "expressive";
  const mk = MODALITY_KEYWORDS[modality] || "balanced";
  const dk = DIGNITY_KEYWORDS[dignity] || "behaves in a neutral way";
  const ds = DIGNITY_STRENGTHS[dignity] || "balanced";
  const polarityDesc = POLARITY_KEYWORDS[polarity] || "balanced";

  const narrative =
    `${planet} in ${sign} expresses your ${pk} through ${element.toLowerCase()} energy ` +
    `(${ek}). This placement is ${eq} and ${mk.toLowerCase()} in approach. ` +
    `With ${polarity.toLowerCase()} polarity (${polarityDesc}), the planet ${dk}.`;

  const shortNarrative =
    `${planet} in ${sign}: ${pk} expressed through ${element.toLowerCase()} energy, ${ds}.`;

  return {
    planet,
    sign,
    element,
    modality,
    polarity,
    dignity,
    narrative,
    shortNarrative,
    keywords: pk,
    elementKeywords: ek,
    dignityStatus: ds
  };
}

/**
 * Generate interpretations for all planets
 */
export function interpretAllPlanets(planets) {
  return planets.map(p => interpretPlanetInSign(p));
}

// =============================================================================
// ELEMENT BALANCE INTERPRETATION
// =============================================================================

/**
 * Generate narrative for element balance across the chart
 */
export function interpretElementBalance(planets) {
  const counts = { Fire: 0, Earth: 0, Air: 0, Water: 0 };

  for (const p of planets) {
    const element = p.element;
    if (element in counts) {
      counts[element]++;
    }
  }

  let total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) total = 1; // Prevent division by zero

  const ratios = {};
  for (const k of Object.keys(counts)) {
    ratios[k] = Math.round((counts[k] / total) * 1000) / 10;
  }

  // Find dominant and weakest
  const sortedElements = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const dominant = sortedElements[0][0];
  const weakest = sortedElements[sortedElements.length - 1][0];

  // Determine balance type
  const maxRatio = Math.max(...Object.values(ratios));
  let balanceType;
  if (maxRatio >= 50) {
    balanceType = "strongly emphasized";
  } else if (maxRatio >= 35) {
    balanceType = "moderately emphasized";
  } else {
    balanceType = "relatively balanced";
  }

  const narrative =
    `Your chart leans toward ${dominant.toLowerCase()} energy, suggesting a natural ` +
    `orientation toward ${ELEMENT_KEYWORDS[dominant]}. ` +
    `This element is ${balanceType} (${ratios[dominant]}% of placements). ` +
    `Your chart may benefit from developing more ${weakest.toLowerCase()} qualities ` +
    `(${ELEMENT_KEYWORDS[weakest]}) for balance.`;

  const breakdown = [];
  for (const [elem, count] of sortedElements) {
    if (count > 0) {
      breakdown.push(
        `${elem} (${ratios[elem]}%): ${ELEMENT_QUALITIES[elem] || 'expressive'} energy`
      );
    }
  }

  return {
    counts,
    ratios,
    dominantElement: dominant,
    weakestElement: weakest,
    balanceType,
    narrative,
    breakdown
  };
}

// =============================================================================
// MODALITY BALANCE INTERPRETATION
// =============================================================================

/**
 * Generate narrative for modality balance
 */
export function interpretModalityBalance(planets) {
  const counts = { Cardinal: 0, Fixed: 0, Mutable: 0 };

  for (const p of planets) {
    const modality = p.modality;
    if (modality in counts) {
      counts[modality]++;
    }
  }

  let total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) total = 1;

  const ratios = {};
  for (const k of Object.keys(counts)) {
    ratios[k] = Math.round((counts[k] / total) * 1000) / 10;
  }

  const sortedModalities = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const dominant = sortedModalities[0][0];

  const descriptions = {
    Cardinal: "You naturally initiate action, lead projects, and start new ventures.",
    Fixed: "You naturally sustain effort, maintain focus, and see things through.",
    Mutable: "You naturally adapt to change, adjust perspectives, and embrace flexibility."
  };

  const otherModalities = Object.keys(counts).filter(m => m !== dominant);
  const narrative =
    `Your chart emphasizes ${dominant.toLowerCase()} energy (${ratios[dominant]}%). ` +
    `${descriptions[dominant]} ` +
    `The other modalities (${otherModalities.join(', ')}) ` +
    `play supporting roles in how you approach life challenges.`;

  return {
    counts,
    ratios,
    dominantModality: dominant,
    narrative,
    description: descriptions[dominant] || ""
  };
}

// =============================================================================
// DIGNITY SUMMARY
// =============================================================================

/**
 * Summarize planetary dignities across the chart
 */
export function interpretDignities(planets) {
  const summary = {
    Exalted: [],
    Domicile: [],
    Neutral: [],
    Detriment: [],
    Debilitated: []
  };

  for (const p of planets) {
    const dignity = p.dignity || "Neutral";
    const planet = p.planet || "Unknown";
    if (dignity in summary) {
      summary[dignity].push(planet);
    }
  }

  const lines = [];

  if (summary.Exalted.length > 0) {
    lines.push(
      `Strongly supported themes through exalted planets: ${summary.Exalted.join(', ')}. ` +
      `These areas flow with natural ease and power.`
    );
  }

  if (summary.Domicile.length > 0) {
    lines.push(
      `Stable, reliable themes through domicile planets: ${summary.Domicile.join(', ')}. ` +
      `These planets function at their best.`
    );
  }

  if (summary.Detriment.length > 0) {
    lines.push(
      `Areas of tension or learning through detriment planets: ${summary.Detriment.join(', ')}. ` +
      `These themes require conscious navigation.`
    );
  }

  if (summary.Debilitated.length > 0) {
    lines.push(
      `Deep work and growth around debilitated planets: ${summary.Debilitated.join(', ')}. ` +
      `These areas invite transformation through challenge.`
    );
  }

  // Calculate dignity score
  const scoreMap = { Exalted: 2, Domicile: 1, Neutral: 0, Detriment: -1, Debilitated: -2 };
  let totalScore = 0;
  let planetCount = 0;

  for (const [dignity, planetList] of Object.entries(summary)) {
    for (const _ of planetList) {
      totalScore += scoreMap[dignity] || 0;
      planetCount++;
    }
  }

  const avgDignity = planetCount > 0 ? Math.round((totalScore / planetCount) * 100) / 100 : 0;

  let overall;
  if (avgDignity >= 1) {
    overall = "Your chart has strong overall planetary dignity, supporting natural flow and ease.";
  } else if (avgDignity >= 0) {
    overall = "Your chart has balanced planetary dignity, with some natural strengths and growth areas.";
  } else {
    overall = "Your chart contains several challenged placements, inviting conscious growth and development.";
  }

  return {
    byDignity: summary,
    narrative: lines.length > 0 ? lines.join(' ') : "Your planetary dignities are relatively balanced.",
    averageDignityScore: avgDignity,
    overallAssessment: overall,
    strongPlanets: [...summary.Exalted, ...summary.Domicile],
    challengedPlanets: [...summary.Detriment, ...summary.Debilitated]
  };
}

// =============================================================================
// SYNASTRY OVERLAY INTERPRETATION
// =============================================================================

const PLANET_OVERLAY_KEYWORDS = {
  Sun: "identity, purpose, and vitality",
  Moon: "emotional needs and comfort",
  Mercury: "communication and thinking",
  Venus: "love, affection, and pleasure",
  Mars: "desire, conflict, and drive",
  Jupiter: "growth, faith, and optimism",
  Saturn: "commitment, limits, and responsibility",
  Uranus: "excitement, freedom, and change",
  Neptune: "spirituality, dreams, and illusion",
  Pluto: "transformation, power, and intensity"
};

const HOUSE_ACTIVATION_THEMES = {
  1: "their sense of self and personal identity",
  2: "their resources, values, and self-worth",
  3: "their communication, learning, and daily connections",
  4: "their emotional foundation, home, and family",
  5: "their creativity, romance, and self-expression",
  6: "their daily routines, health, and service",
  7: "their partnerships and one-on-one relationships",
  8: "their intimacy, shared resources, and transformation",
  9: "their beliefs, expansion, and life philosophy",
  10: "their career, public image, and life direction",
  11: "their friendships, community, and future vision",
  12: "their spirituality, subconscious, and hidden patterns"
};

/**
 * Determine intensity of a synastry overlay
 */
function getOverlayIntensity(planet, house) {
  const highIntensity = [
    ["Venus", 7], ["Mars", 8], ["Moon", 4], ["Sun", 1],
    ["Pluto", 8], ["Saturn", 7], ["Sun", 7]
  ];

  for (const [p, h] of highIntensity) {
    if (planet === p && house === h) {
      return "high";
    }
  }

  if (["Venus", "Mars", "Moon", "Sun"].includes(planet)) {
    return "medium";
  }

  return "low";
}

/**
 * Interpret a single synastry overlay
 */
export function interpretSynastryOverlay(overlay) {
  const planet = overlay.planet || "Unknown";
  const house = overlay.house || 1;

  const pk = PLANET_OVERLAY_KEYWORDS[planet] || "life themes";
  const houseTheme = HOUSE_ACTIVATION_THEMES[house] || "life area";
  const houseMeaning = overlay.meaning || "";

  const narrative =
    `Their ${planet} activates your House ${house}, linking their ${pk} ` +
    `to ${houseTheme}. ${houseMeaning}`;

  const special = overlay.special || "";

  return {
    planet,
    house,
    planetTheme: pk,
    houseTheme,
    narrative,
    special,
    intensity: getOverlayIntensity(planet, house)
  };
}

/**
 * Interpret all synastry overlays and generate summary
 */
export function interpretSynastryOverlays(overlays) {
  const interpreted = overlays.map(o => interpretSynastryOverlay(o));

  const highIntensity = interpreted.filter(o => o.intensity === "high");
  const mediumIntensity = interpreted.filter(o => o.intensity === "medium");

  const summaryLines = [];

  if (highIntensity.length > 0) {
    const planets = highIntensity.map(o => o.planet);
    summaryLines.push(
      `Key activations through ${planets.join(', ')} create strong relational dynamics.`
    );
  }

  if (mediumIntensity.length > 0) {
    const planets = mediumIntensity.map(o => o.planet);
    summaryLines.push(
      `Supporting influences from ${planets.join(', ')} add depth to the connection.`
    );
  }

  return {
    overlays: interpreted,
    highIntensity,
    mediumIntensity,
    summary: summaryLines.length > 0
      ? summaryLines.join(' ')
      : "The overlays create a balanced relational dynamic."
  };
}

// =============================================================================
// COMPLETE WESTERN INTERPRETATION
// =============================================================================

/**
 * Build complete Western interpretation package
 */
export function buildWesternInterpretation(westernProfile, synastry = null) {
  const planets = westernProfile.planets || [];

  // Generate all interpretations
  const planetInterpretations = interpretAllPlanets(planets);
  const elementInterpretation = interpretElementBalance(planets);
  const modalityInterpretation = interpretModalityBalance(planets);
  const dignityInterpretation = interpretDignities(planets);

  // Synastry interpretation if provided
  let synastryInterpretation = null;
  if (synastry) {
    const aToB = interpretSynastryOverlays(synastry.overlaysAtoB || []);
    const bToA = interpretSynastryOverlays(synastry.overlaysBtoA || []);
    synastryInterpretation = {
      AtoB: aToB,
      BtoA: bToA
    };
  }

  // Build overall narrative
  const dominantElement = elementInterpretation.dominantElement || "Fire";
  const dominantModality = modalityInterpretation.dominantModality || "Cardinal";
  const strongPlanets = dignityInterpretation.strongPlanets || [];

  let overallNarrative =
    `This chart emphasizes ${dominantElement.toLowerCase()} energy with a ${dominantModality.toLowerCase()} approach. `;

  if (strongPlanets.length > 0) {
    overallNarrative += `Planets like ${strongPlanets.slice(0, 3).join(', ')} are particularly well-placed, `;
    overallNarrative += `providing natural strengths and ease in their domains.`;
  }

  return {
    planets: planetInterpretations,
    elements: elementInterpretation,
    modalities: modalityInterpretation,
    dignities: dignityInterpretation,
    synastry: synastryInterpretation,
    overallNarrative
  };
}

export default {
  interpretPlanetInSign,
  interpretAllPlanets,
  interpretElementBalance,
  interpretModalityBalance,
  interpretDignities,
  interpretSynastryOverlay,
  interpretSynastryOverlays,
  buildWesternInterpretation,
  // Export constants for external use
  PLANET_KEYWORDS,
  ELEMENT_KEYWORDS,
  ELEMENT_QUALITIES,
  MODALITY_KEYWORDS,
  DIGNITY_KEYWORDS,
  DIGNITY_STRENGTHS,
  POLARITY_KEYWORDS
};
