/**
 * Western Synastry Heatmap Service
 *
 * Planet-vs-planet compatibility grid using rule-based scoring:
 * - Base planet synastry scores
 * - Element pair harmonics
 * - Dignity interactions
 * - Sign compatibility
 */

// =============================================================================
// BASE PLANET SYNASTRY SCORES
// =============================================================================

const BASE_PLANET_SYNASTRY = {
  // Sun interactions
  'Sun_Sun': 1.0,
  'Sun_Moon': 1.5,
  'Sun_Mercury': 0.8,
  'Sun_Venus': 1.2,
  'Sun_Mars': 0.5,
  'Sun_Jupiter': 1.3,
  'Sun_Saturn': -0.5,
  'Sun_Uranus': 0.3,
  'Sun_Neptune': 0.2,
  'Sun_Pluto': 0.0,

  // Moon interactions
  'Moon_Moon': 1.2,
  'Moon_Mercury': 0.7,
  'Moon_Venus': 1.5,
  'Moon_Mars': 0.3,
  'Moon_Jupiter': 1.2,
  'Moon_Saturn': -0.3,
  'Moon_Uranus': 0.0,
  'Moon_Neptune': 1.0,
  'Moon_Pluto': 0.2,

  // Mercury interactions
  'Mercury_Mercury': 1.0,
  'Mercury_Venus': 1.0,
  'Mercury_Mars': 0.4,
  'Mercury_Jupiter': 1.1,
  'Mercury_Saturn': 0.5,
  'Mercury_Uranus': 0.8,
  'Mercury_Neptune': 0.3,
  'Mercury_Pluto': 0.4,

  // Venus interactions
  'Venus_Venus': 1.3,
  'Venus_Mars': 1.8,
  'Venus_Jupiter': 1.4,
  'Venus_Saturn': 0.2,
  'Venus_Uranus': 0.5,
  'Venus_Neptune': 1.2,
  'Venus_Pluto': 0.8,

  // Mars interactions
  'Mars_Mars': 0.0,
  'Mars_Jupiter': 0.9,
  'Mars_Saturn': -0.5,
  'Mars_Uranus': 0.6,
  'Mars_Neptune': -0.2,
  'Mars_Pluto': 0.5,

  // Jupiter interactions
  'Jupiter_Jupiter': 1.0,
  'Jupiter_Saturn': 0.3,
  'Jupiter_Uranus': 0.8,
  'Jupiter_Neptune': 0.9,
  'Jupiter_Pluto': 0.6,

  // Saturn interactions
  'Saturn_Saturn': 0.5,
  'Saturn_Uranus': -0.3,
  'Saturn_Neptune': 0.0,
  'Saturn_Pluto': 0.2,

  // Outer planet interactions
  'Uranus_Uranus': 0.7,
  'Uranus_Neptune': 0.4,
  'Uranus_Pluto': 0.3,
  'Neptune_Neptune': 0.8,
  'Neptune_Pluto': 0.5,
  'Pluto_Pluto': 0.6
};

// =============================================================================
// ELEMENT PAIR SCORES
// =============================================================================

const ELEMENT_PAIR_SCORES = {
  'Fire_Fire': 0.8,
  'Fire_Earth': -0.3,
  'Fire_Air': 1.0,
  'Fire_Water': -0.2,
  'Earth_Earth': 0.8,
  'Earth_Air': -0.2,
  'Earth_Water': 0.9,
  'Air_Air': 0.8,
  'Air_Water': -0.3,
  'Water_Water': 0.8
};

// =============================================================================
// SIGN CONSTANTS
// =============================================================================

const SIGN_ELEMENT = {
  Aries: "Fire", Taurus: "Earth", Gemini: "Air", Cancer: "Water",
  Leo: "Fire", Virgo: "Earth", Libra: "Air", Scorpio: "Water",
  Sagittarius: "Fire", Capricorn: "Earth", Aquarius: "Air", Pisces: "Water"
};

const SIGN_MODALITY = {
  Aries: "Cardinal", Taurus: "Fixed", Gemini: "Mutable", Cancer: "Cardinal",
  Leo: "Fixed", Virgo: "Mutable", Libra: "Cardinal", Scorpio: "Fixed",
  Sagittarius: "Mutable", Capricorn: "Cardinal", Aquarius: "Fixed", Pisces: "Mutable"
};

const MODALITY_PAIR_SCORES = {
  'Cardinal_Cardinal': 0.5,
  'Cardinal_Fixed': 0.3,
  'Cardinal_Mutable': 0.7,
  'Fixed_Fixed': 0.4,
  'Fixed_Mutable': 0.6,
  'Mutable_Mutable': 0.5
};

// =============================================================================
// CORE SCORING FUNCTIONS
// =============================================================================

/**
 * Get base synastry score between two planets
 */
export function basePlanetSynastryScore(planet1, planet2) {
  const key = `${planet1}_${planet2}`;
  if (key in BASE_PLANET_SYNASTRY) {
    return BASE_PLANET_SYNASTRY[key];
  }

  const keyReversed = `${planet2}_${planet1}`;
  if (keyReversed in BASE_PLANET_SYNASTRY) {
    return BASE_PLANET_SYNASTRY[keyReversed];
  }

  return 0.0;
}

/**
 * Get element compatibility score
 */
export function elementPairScore(element1, element2) {
  const key = `${element1}_${element2}`;
  if (key in ELEMENT_PAIR_SCORES) {
    return ELEMENT_PAIR_SCORES[key];
  }

  const keyReversed = `${element2}_${element1}`;
  if (keyReversed in ELEMENT_PAIR_SCORES) {
    return ELEMENT_PAIR_SCORES[keyReversed];
  }

  return 0.0;
}

/**
 * Get modality compatibility score
 */
export function modalityPairScore(modality1, modality2) {
  const key = `${modality1}_${modality2}`;
  if (key in MODALITY_PAIR_SCORES) {
    return MODALITY_PAIR_SCORES[key];
  }

  const keyReversed = `${modality2}_${modality1}`;
  if (keyReversed in MODALITY_PAIR_SCORES) {
    return MODALITY_PAIR_SCORES[keyReversed];
  }

  return 0.5;
}

/**
 * Compute full synastry score between two planet placements
 */
export function computePlanetPairScore(planet1, sign1, dignity1, planet2, sign2, dignity2) {
  // Base score
  const base = basePlanetSynastryScore(planet1, planet2);

  // Element compatibility
  const elem1 = SIGN_ELEMENT[sign1] || "Fire";
  const elem2 = SIGN_ELEMENT[sign2] || "Fire";
  const elementMod = elementPairScore(elem1, elem2);

  // Modality compatibility
  const mod1 = SIGN_MODALITY[sign1] || "Cardinal";
  const mod2 = SIGN_MODALITY[sign2] || "Cardinal";
  const modalityMod = modalityPairScore(mod1, mod2);

  // Dignity modifier
  const dignityScores = {
    Exalted: 0.3,
    Domicile: 0.2,
    Neutral: 0.0,
    Detriment: -0.15,
    Debilitated: -0.25
  };
  const dignityMod = (
    (dignityScores[dignity1] || 0) +
    (dignityScores[dignity2] || 0)
  ) / 2;

  // Combined score
  const combined = (
    base * 0.50 +
    elementMod * 0.25 +
    modalityMod * 0.15 +
    dignityMod * 0.10
  );

  // Normalize to 0-100 scale
  let normalized = ((combined + 1.5) / 3.5) * 100;
  normalized = Math.max(0, Math.min(100, normalized));

  // Determine intensity label
  let intensity, label;
  if (normalized >= 75) {
    intensity = "very_high";
    label = "Powerful Synergy";
  } else if (normalized >= 60) {
    intensity = "high";
    label = "Strong Connection";
  } else if (normalized >= 45) {
    intensity = "medium";
    label = "Balanced Dynamic";
  } else if (normalized >= 30) {
    intensity = "low";
    label = "Mild Tension";
  } else {
    intensity = "very_low";
    label = "Challenging Friction";
  }

  return {
    planet1,
    sign1,
    planet2,
    sign2,
    baseScore: Math.round(base * 1000) / 1000,
    elementModifier: Math.round(elementMod * 1000) / 1000,
    modalityModifier: Math.round(modalityMod * 1000) / 1000,
    dignityModifier: Math.round(dignityMod * 1000) / 1000,
    combinedScore: Math.round(combined * 1000) / 1000,
    normalizedScore: Math.round(normalized * 10) / 10,
    intensity,
    label
  };
}

// =============================================================================
// HEATMAP BUILDER
// =============================================================================

/**
 * Build complete synastry heatmap grid
 */
export function buildWesternSynastryHeatmap(personAPlanets, personBPlanets, includePlanets = null) {
  // Default to personal planets + luminaries
  if (!includePlanets) {
    includePlanets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"];
  }

  // Filter planets
  const aPlanets = personAPlanets.filter(p => includePlanets.includes(p.planet));
  const bPlanets = personBPlanets.filter(p => includePlanets.includes(p.planet));

  // Build grid
  const grid = [];
  const allScores = [];
  const highSynergy = [];
  const challenging = [];

  for (const aP of aPlanets) {
    const row = [];
    for (const bP of bPlanets) {
      const cell = computePlanetPairScore(
        aP.planet || "Sun",
        aP.sign || "Aries",
        aP.dignity || "Neutral",
        bP.planet || "Sun",
        bP.sign || "Aries",
        bP.dignity || "Neutral"
      );
      row.push(cell);
      allScores.push(cell.normalizedScore);

      // Track extremes
      if (cell.normalizedScore >= 75) {
        highSynergy.push({
          planetA: aP.planet,
          planetB: bP.planet,
          score: cell.normalizedScore,
          label: cell.label
        });
      } else if (cell.normalizedScore < 30) {
        challenging.push({
          planetA: aP.planet,
          planetB: bP.planet,
          score: cell.normalizedScore,
          label: cell.label
        });
      }
    }
    grid.push(row);
  }

  // Calculate summary statistics
  const avgScore = allScores.length > 0
    ? allScores.reduce((a, b) => a + b, 0) / allScores.length
    : 50;
  const maxScore = allScores.length > 0 ? Math.max(...allScores) : 0;
  const minScore = allScores.length > 0 ? Math.min(...allScores) : 0;

  // Overall compatibility assessment
  let overall, overallDescription;
  if (avgScore >= 65) {
    overall = "Highly Compatible";
    overallDescription = "The synastry shows strong natural affinity between planetary energies.";
  } else if (avgScore >= 50) {
    overall = "Moderately Compatible";
    overallDescription = "The synastry shows balanced dynamics with areas of harmony and growth.";
  } else if (avgScore >= 40) {
    overall = "Mixed Dynamics";
    overallDescription = "The synastry contains both supportive and challenging aspects requiring conscious navigation.";
  } else {
    overall = "Challenging Dynamics";
    overallDescription = "The synastry shows significant friction that invites deep transformation work.";
  }

  // Generate narrative
  const narrativeParts = [];

  if (highSynergy.length > 0) {
    const topSynergy = highSynergy.sort((a, b) => b.score - a.score).slice(0, 3);
    const planets = topSynergy.map(s => `${s.planetA}-${s.planetB}`);
    narrativeParts.push(
      `Strong synergy flows through ${planets.join(', ')} connections.`
    );
  }

  if (challenging.length > 0) {
    const topChallenge = challenging.sort((a, b) => a.score - b.score).slice(0, 2);
    const planets = topChallenge.map(c => `${c.planetA}-${c.planetB}`);
    narrativeParts.push(
      `Growth edges appear in ${planets.join(', ')} dynamics.`
    );
  }

  const narrative = narrativeParts.length > 0 ? narrativeParts.join(' ') : overallDescription;

  return {
    grid,
    rowPlanets: aPlanets.map(p => p.planet),
    colPlanets: bPlanets.map(p => p.planet),
    averageScore: Math.round(avgScore * 10) / 10,
    maxScore: Math.round(maxScore * 10) / 10,
    minScore: Math.round(minScore * 10) / 10,
    highSynergy: highSynergy.sort((a, b) => b.score - a.score),
    challenging: challenging.sort((a, b) => a.score - b.score),
    overall,
    overallDescription,
    narrative
  };
}

// =============================================================================
// HEATMAP VISUALIZATION DATA
// =============================================================================

/**
 * Get color data for heatmap cell based on score
 */
export function getHeatmapColor(score) {
  let r, g, b;

  if (score < 50) {
    // Red to yellow
    const ratio = score / 50;
    r = 220;
    g = Math.floor(50 + (170 * ratio));
    b = 50;
  } else {
    // Yellow to green
    const ratio = (score - 50) / 50;
    r = Math.floor(220 - (170 * ratio));
    g = 220;
    b = 50;
  }

  const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

  return {
    r,
    g,
    b,
    hex,
    rgb: `rgb(${r}, ${g}, ${b})`,
    alpha: Math.min(1.0, 0.3 + (score / 100) * 0.7)
  };
}

/**
 * Add visualization data to heatmap
 */
export function buildHeatmapVisualization(heatmap) {
  const grid = heatmap.grid || [];
  const coloredGrid = [];

  for (const row of grid) {
    const coloredRow = [];
    for (const cell of row) {
      const score = cell.normalizedScore || 50;
      const color = getHeatmapColor(score);
      coloredRow.push({
        ...cell,
        color
      });
    }
    coloredGrid.push(coloredRow);
  }

  return {
    ...heatmap,
    coloredGrid,
    colorScale: {
      min: { score: 0, color: getHeatmapColor(0) },
      mid: { score: 50, color: getHeatmapColor(50) },
      max: { score: 100, color: getHeatmapColor(100) }
    }
  };
}

export default {
  basePlanetSynastryScore,
  elementPairScore,
  modalityPairScore,
  computePlanetPairScore,
  buildWesternSynastryHeatmap,
  getHeatmapColor,
  buildHeatmapVisualization,
  SIGN_ELEMENT,
  SIGN_MODALITY
};
