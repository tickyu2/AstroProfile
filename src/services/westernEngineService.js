/**
 * Western Engine Service
 *
 * Complete Western Astrology calculations including:
 * - Elements (Fire/Earth/Air/Water)
 * - Modalities (Cardinal/Fixed/Mutable)
 * - Yin/Yang polarity
 * - Dominant element
 * - Planetary dignity (Exaltation, Domicile, Detriment, Debilitation)
 * - Synastry overlays
 * - Yin/Yang polarity comparison for relationships
 *
 * Production-ready, deterministic, classical Western astrology engine.
 */

// =============================================================================
// SIGN CONSTANTS
// =============================================================================

export const SIGN_ELEMENT = {
  Aries: 'Fire',
  Taurus: 'Earth',
  Gemini: 'Air',
  Cancer: 'Water',
  Leo: 'Fire',
  Virgo: 'Earth',
  Libra: 'Air',
  Scorpio: 'Water',
  Sagittarius: 'Fire',
  Capricorn: 'Earth',
  Aquarius: 'Air',
  Pisces: 'Water'
};

export const SIGN_MODALITY = {
  Aries: 'Cardinal',
  Taurus: 'Fixed',
  Gemini: 'Mutable',
  Cancer: 'Cardinal',
  Leo: 'Fixed',
  Virgo: 'Mutable',
  Libra: 'Cardinal',
  Scorpio: 'Fixed',
  Sagittarius: 'Mutable',
  Capricorn: 'Cardinal',
  Aquarius: 'Fixed',
  Pisces: 'Mutable'
};

// Western Yin/Yang Polarity
// Yang (Masculine/Active/Positive): Fire + Air signs
// Yin (Feminine/Receptive/Negative): Earth + Water signs
export const SIGN_POLARITY = {
  Aries: 'Yang',
  Taurus: 'Yin',
  Gemini: 'Yang',
  Cancer: 'Yin',
  Leo: 'Yang',
  Virgo: 'Yin',
  Libra: 'Yang',
  Scorpio: 'Yin',
  Sagittarius: 'Yang',
  Capricorn: 'Yin',
  Aquarius: 'Yang',
  Pisces: 'Yin'
};

// =============================================================================
// PLANETARY DIGNITIES
// =============================================================================

export const EXALTATION = {
  Sun: 'Aries',
  Moon: 'Taurus',
  Mercury: 'Virgo',
  Venus: 'Pisces',
  Mars: 'Capricorn',
  Jupiter: 'Cancer',
  Saturn: 'Libra'
};

export const DEBILITATION = {
  Sun: 'Libra',
  Moon: 'Scorpio',
  Mercury: 'Pisces',
  Venus: 'Virgo',
  Mars: 'Cancer',
  Jupiter: 'Capricorn',
  Saturn: 'Aries'
};

export const DOMICILE = {
  Sun: ['Leo'],
  Moon: ['Cancer'],
  Mercury: ['Gemini', 'Virgo'],
  Venus: ['Taurus', 'Libra'],
  Mars: ['Aries', 'Scorpio'],
  Jupiter: ['Sagittarius', 'Pisces'],
  Saturn: ['Capricorn', 'Aquarius'],
  Uranus: ['Aquarius'],
  Neptune: ['Pisces'],
  Pluto: ['Scorpio']
};

export const DETRIMENT = {
  Sun: ['Aquarius'],
  Moon: ['Capricorn'],
  Mercury: ['Sagittarius', 'Pisces'],
  Venus: ['Aries', 'Scorpio'],
  Mars: ['Taurus', 'Libra'],
  Jupiter: ['Gemini', 'Virgo'],
  Saturn: ['Cancer', 'Leo'],
  Uranus: ['Leo'],
  Neptune: ['Virgo'],
  Pluto: ['Taurus']
};

// =============================================================================
// PLANET WEIGHTS FOR POLARITY CALCULATIONS
// =============================================================================

export const PLANET_WEIGHTS = {
  Sun: 1.0,
  Moon: 1.0,
  Mercury: 0.8,
  Venus: 0.8,
  Mars: 0.8,
  Jupiter: 0.6,
  Saturn: 0.6,
  Uranus: 0.4,
  Neptune: 0.4,
  Pluto: 0.4,
  Ascendant: 1.0,
  Midheaven: 0.6,
  'North Node': 0.3,
  'South Node': 0.3,
  Chiron: 0.3
};

// =============================================================================
// SYNASTRY OVERLAY MEANINGS
// =============================================================================

export const SYNASTRY_OVERLAY_MEANINGS = {
  1: 'Identity resonance, attraction, recognition.',
  2: 'Value alignment, resource sharing.',
  3: 'Communication flow, mental connection.',
  4: 'Emotional bonding, home resonance.',
  5: 'Romance, play, creativity.',
  6: 'Daily life, routines, service.',
  7: 'Partnership, commitment, mirroring.',
  8: 'Intensity, sexuality, transformation.',
  9: 'Philosophy, travel, expansion.',
  10: 'Career alignment, public image.',
  11: 'Friendship, community, shared goals.',
  12: 'Karmic ties, subconscious patterns.'
};

export const SYNASTRY_PLANET_INTENSITY = {
  Sun: 'Core identity activation',
  Moon: 'Emotional resonance',
  Mercury: 'Mental connection',
  Venus: 'Attraction and harmony',
  Mars: 'Passion and drive',
  Jupiter: 'Growth and expansion',
  Saturn: 'Karmic lessons, stability',
  Uranus: 'Excitement, disruption',
  Neptune: 'Spiritual connection, illusion',
  Pluto: 'Transformation, power dynamics'
};

// =============================================================================
// BASIC PROPERTY FUNCTIONS
// =============================================================================

/**
 * Get element, modality, and polarity for a sign
 */
export function computeSignProperties(sign) {
  const signNormalized = sign?.trim()?.replace(/^\w/, c => c.toUpperCase());
  return {
    element: SIGN_ELEMENT[signNormalized] || 'Unknown',
    modality: SIGN_MODALITY[signNormalized] || 'Unknown',
    polarity: SIGN_POLARITY[signNormalized] || 'Unknown'
  };
}

/**
 * Determine planetary dignity for a planet in a given sign
 * Returns: Exalted, Domicile, Detriment, Debilitated, or Neutral
 */
export function computeDignity(planet, sign) {
  const planetNormalized = planet?.trim()?.replace(/^\w/, c => c.toUpperCase());
  const signNormalized = sign?.trim()?.replace(/^\w/, c => c.toUpperCase());

  if (signNormalized === EXALTATION[planetNormalized]) {
    return 'Exalted';
  }
  if (signNormalized === DEBILITATION[planetNormalized]) {
    return 'Debilitated';
  }
  if (DOMICILE[planetNormalized]?.includes(signNormalized)) {
    return 'Domicile';
  }
  if (DETRIMENT[planetNormalized]?.includes(signNormalized)) {
    return 'Detriment';
  }
  return 'Neutral';
}

/**
 * Get strength modifier based on dignity
 */
export function getDignityStrengthModifier(dignity) {
  const modifiers = {
    Exalted: 1.20,
    Domicile: 1.15,
    Neutral: 1.00,
    Detriment: 0.90,
    Debilitated: 0.80
  };
  return modifiers[dignity] || 1.0;
}

// =============================================================================
// ELEMENT & MODALITY CALCULATIONS
// =============================================================================

/**
 * Compute weighted element distribution across all planets
 */
export function computeElementDistribution(planets) {
  const elementScores = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  let totalWeight = 0;

  for (const p of planets) {
    const planet = p.planet?.trim()?.replace(/^\w/, c => c.toUpperCase());
    const sign = p.sign?.trim()?.replace(/^\w/, c => c.toUpperCase());

    if (!sign || !SIGN_ELEMENT[sign]) continue;

    const weight = PLANET_WEIGHTS[planet] || 0.5;
    const element = SIGN_ELEMENT[sign];

    // Apply dignity modifier
    const dignity = computeDignity(planet, sign);
    const dignityMod = getDignityStrengthModifier(dignity);

    elementScores[element] += weight * dignityMod;
    totalWeight += weight * dignityMod;
  }

  // Convert to percentages
  if (totalWeight > 0) {
    for (const elem of Object.keys(elementScores)) {
      elementScores[elem] = Math.round((elementScores[elem] / totalWeight) * 1000) / 10;
    }
  }

  // Find dominant and weakest
  const sorted = Object.entries(elementScores).sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0]?.[0] || 'Unknown';
  const weakest = sorted[sorted.length - 1]?.[0] || 'Unknown';

  return {
    distribution: elementScores,
    dominant,
    weakest,
    firePercent: elementScores.Fire || 0,
    earthPercent: elementScores.Earth || 0,
    airPercent: elementScores.Air || 0,
    waterPercent: elementScores.Water || 0
  };
}

/**
 * Compute weighted modality distribution across all planets
 */
export function computeModalityDistribution(planets) {
  const modalityScores = { Cardinal: 0, Fixed: 0, Mutable: 0 };
  let totalWeight = 0;

  for (const p of planets) {
    const planet = p.planet?.trim()?.replace(/^\w/, c => c.toUpperCase());
    const sign = p.sign?.trim()?.replace(/^\w/, c => c.toUpperCase());

    if (!sign || !SIGN_MODALITY[sign]) continue;

    const weight = PLANET_WEIGHTS[planet] || 0.5;
    const modality = SIGN_MODALITY[sign];

    modalityScores[modality] += weight;
    totalWeight += weight;
  }

  // Convert to percentages
  if (totalWeight > 0) {
    for (const mod of Object.keys(modalityScores)) {
      modalityScores[mod] = Math.round((modalityScores[mod] / totalWeight) * 1000) / 10;
    }
  }

  const sorted = Object.entries(modalityScores).sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0]?.[0] || 'Unknown';

  return {
    distribution: modalityScores,
    dominant,
    cardinalPercent: modalityScores.Cardinal || 0,
    fixedPercent: modalityScores.Fixed || 0,
    mutablePercent: modalityScores.Mutable || 0
  };
}

// =============================================================================
// YIN/YANG POLARITY CALCULATIONS
// =============================================================================

/**
 * Compute weighted Yin/Yang polarity distribution
 *
 * Yang (Masculine/Active): Fire + Air signs
 * Yin (Feminine/Receptive): Earth + Water signs
 */
export function computeYinYangDistribution(planets) {
  let yangScore = 0;
  let yinScore = 0;
  let totalWeight = 0;

  for (const p of planets) {
    const planet = p.planet?.trim()?.replace(/^\w/, c => c.toUpperCase());
    const sign = p.sign?.trim()?.replace(/^\w/, c => c.toUpperCase());

    if (!sign || !SIGN_POLARITY[sign]) continue;

    const weight = PLANET_WEIGHTS[planet] || 0.5;
    const polarity = SIGN_POLARITY[sign];

    // Apply dignity modifier
    const dignity = computeDignity(planet, sign);
    const dignityMod = getDignityStrengthModifier(dignity);

    if (polarity === 'Yang') {
      yangScore += weight * dignityMod;
    } else {
      yinScore += weight * dignityMod;
    }

    totalWeight += weight * dignityMod;
  }

  // Calculate percentages
  const yangPercent = totalWeight > 0 ? Math.round((yangScore / totalWeight) * 1000) / 10 : 50;
  const yinPercent = totalWeight > 0 ? Math.round((yinScore / totalWeight) * 1000) / 10 : 50;

  // Determine balance category
  let category, description;
  if (yangPercent >= 70) {
    category = 'Very Yang';
    description = 'Strongly active, initiating, assertive energy';
  } else if (yangPercent >= 55) {
    category = 'Yang-Dominant';
    description = 'Active energy with receptive undertones';
  } else if (yinPercent >= 70) {
    category = 'Very Yin';
    description = 'Strongly receptive, nurturing, introspective energy';
  } else if (yinPercent >= 55) {
    category = 'Yin-Dominant';
    description = 'Receptive energy with active undertones';
  } else {
    category = 'Balanced';
    description = 'Harmonious blend of active and receptive energies';
  }

  const dominantPolarity = yangScore > yinScore ? 'Yang' : yinScore > yangScore ? 'Yin' : 'Balanced';

  return {
    yangPercent,
    yinPercent,
    yangScore: Math.round(yangScore * 100) / 100,
    yinScore: Math.round(yinScore * 100) / 100,
    category,
    description,
    dominantPolarity
  };
}

/**
 * Compare Yin/Yang profiles between two people for relationship compatibility
 */
export function compareYinYangPolarity(profileA, profileB) {
  const yangA = profileA?.yangPercent ?? 50;
  const yangB = profileB?.yangPercent ?? 50;

  const domA = profileA?.dominantPolarity || 'Balanced';
  const domB = profileB?.dominantPolarity || 'Balanced';

  // Calculate polarity difference
  const polarityDiff = Math.abs(yangA - yangB);

  // Determine relationship type
  let relationship, description, attractionType, polarityScore;

  if (domA === 'Balanced' || domB === 'Balanced') {
    relationship = 'Adaptable';
    description = 'One or both partners are balanced, allowing flexible dynamic adjustment.';
    attractionType = 'Versatile';
    polarityScore = 70;
  } else if (domA !== domB) {
    // Opposite polarities - Magnetic attraction
    relationship = 'Magnetic';
    description = 'Opposite polarities create dynamic attraction and complementary energies.';
    attractionType = 'Complementary';
    polarityScore = Math.min(95, 70 + polarityDiff * 0.5);
  } else {
    // Same polarities - Parallel
    relationship = 'Parallel';
    if (domA === 'Yang') {
      description = 'Both partners are Yang-dominant — dynamic, active, but may compete for leadership.';
      attractionType = 'Competitive';
    } else {
      description = 'Both partners are Yin-dominant — receptive, nurturing, but may lack initiative.';
      attractionType = 'Harmonious';
    }
    polarityScore = Math.max(40, 80 - polarityDiff * 0.5);
  }

  // Calculate complementarity score
  const idealDiff = 40;
  const complementarity = 100 - Math.abs(polarityDiff - idealDiff);

  return {
    relationship,
    attractionType,
    description,
    polarityScore: Math.round(polarityScore * 10) / 10,
    complementarity: Math.round(complementarity * 10) / 10,
    personAPolarity: domA,
    personBPolarity: domB,
    polarityDifference: Math.round(polarityDiff * 10) / 10,
    personAYangPercent: yangA,
    personBYangPercent: yangB
  };
}

// =============================================================================
// ELEMENT HARMONY
// =============================================================================

/**
 * Compute element harmony between two element distributions
 */
export function computeElementHarmony(elementsA, elementsB) {
  const domA = elementsA?.dominant || 'Fire';
  const domB = elementsB?.dominant || 'Fire';

  // Element compatibility matrix
  const harmonyMatrix = {
    'Fire-Fire': ['Amplifying', 75, 'Intense energy, mutual inspiration, but may burn out'],
    'Fire-Air': ['Harmonizing', 90, 'Dynamic synergy — ideas fuel action, action inspires ideas'],
    'Fire-Earth': ['Stabilizing', 70, 'Grounding meets drive — productive tension'],
    'Fire-Water': ['Volatile', 50, 'Steam — passionate but turbulent'],
    'Air-Fire': ['Harmonizing', 90, 'Dynamic synergy — ideas fuel action, action inspires ideas'],
    'Air-Air': ['Amplifying', 75, 'Mental connection, but may lack grounding'],
    'Air-Earth': ['Frictional', 55, 'Abstract meets concrete — requires effort'],
    'Air-Water': ['Creative', 65, 'Imagination flows, but communication styles differ'],
    'Earth-Fire': ['Stabilizing', 70, 'Grounding meets drive — productive tension'],
    'Earth-Air': ['Frictional', 55, 'Concrete meets abstract — requires patience'],
    'Earth-Earth': ['Amplifying', 80, 'Stable and practical, but may resist change'],
    'Earth-Water': ['Harmonizing', 85, 'Nurturing synergy — emotion meets security'],
    'Water-Fire': ['Volatile', 50, 'Steam — passionate but turbulent'],
    'Water-Air': ['Creative', 65, 'Imagination flows, but emotional needs differ'],
    'Water-Earth': ['Harmonizing', 85, 'Nurturing synergy — emotion meets security'],
    'Water-Water': ['Amplifying', 70, 'Deep emotional bond, but may overwhelm']
  };

  const key = `${domA}-${domB}`;
  const [type, score, description] = harmonyMatrix[key] || ['Mixed', 60, 'Varied elemental interaction'];

  return {
    type,
    score,
    description,
    dominantA: domA,
    dominantB: domB
  };
}

// =============================================================================
// COMPLETE WESTERN PROFILE
// =============================================================================

/**
 * Compute complete Western astrology profile for a person
 */
export function computeWesternProfile(planets) {
  const enrichedPlanets = [];

  for (const p of planets) {
    const planet = p.planet?.trim()?.replace(/^\w/, c => c.toUpperCase());
    const sign = p.sign?.trim()?.replace(/^\w/, c => c.toUpperCase());

    if (!sign) continue;

    const props = computeSignProperties(sign);
    const dignity = computeDignity(planet, sign);
    const dignityMod = getDignityStrengthModifier(dignity);

    enrichedPlanets.push({
      ...p,
      planet,
      sign,
      ...props,
      dignity,
      dignityModifier: dignityMod
    });
  }

  const elements = computeElementDistribution(planets);
  const modalities = computeModalityDistribution(planets);
  const yinyang = computeYinYangDistribution(planets);

  return {
    planets: enrichedPlanets,
    elements,
    modalities,
    yinyang,
    dominantElement: elements.dominant,
    dominantModality: modalities.dominant,
    dominantPolarity: yinyang.dominantPolarity
  };
}

// =============================================================================
// WESTERN POLARITY AXIS (For Integration with Polarity Map System)
// =============================================================================

/**
 * Build Western Yin/Yang polarity axis for the relationship polarity map
 * This integrates with the Vedic polarity map system
 */
export function buildWesternPolarityAxis(personA, personB) {
  const planetsA = personA?.planets || [];
  const planetsB = personB?.planets || [];

  const yinyangA = computeYinYangDistribution(planetsA);
  const yinyangB = computeYinYangDistribution(planetsB);
  const comparison = compareYinYangPolarity(yinyangA, yinyangB);

  // Determine polarity label for the axis
  const relationshipType = comparison.relationship || 'Adaptable';

  let polarity, interpretation;
  if (relationshipType === 'Magnetic') {
    polarity = 'Magnetic';
    interpretation = 'Opposite polarities create dynamic attraction.';
  } else if (relationshipType === 'Parallel') {
    if (yinyangA.dominantPolarity === 'Yang') {
      polarity = 'Yang-Parallel';
      interpretation = 'Both partners share active, initiating energy.';
    } else {
      polarity = 'Yin-Parallel';
      interpretation = 'Both partners share receptive, nurturing energy.';
    }
  } else {
    polarity = 'Balanced';
    interpretation = 'Flexible polarity allows adaptive dynamics.';
  }

  return {
    axis: 'Western Yin/Yang',
    name: 'Western Yin/Yang',
    polarity,
    score: comparison.polarityScore || 70,
    personA: {
      label: yinyangA.category,
      yangPercent: yinyangA.yangPercent,
      yinPercent: yinyangA.yinPercent
    },
    personB: {
      label: yinyangB.category,
      yangPercent: yinyangB.yangPercent,
      yinPercent: yinyangB.yinPercent
    },
    relationship: relationshipType,
    attractionType: comparison.attractionType,
    interpretation,
    narrative: comparison.description
  };
}

/**
 * Build complete Western synastry analysis
 */
export function computeWesternSynastry(personA, personB) {
  const planetsA = personA?.planets || [];
  const planetsB = personB?.planets || [];

  // Compute element distributions
  const elementsA = computeElementDistribution(planetsA);
  const elementsB = computeElementDistribution(planetsB);

  // Compute Yin/Yang compatibility
  const yinyangA = computeYinYangDistribution(planetsA);
  const yinyangB = computeYinYangDistribution(planetsB);
  const yinyangComparison = compareYinYangPolarity(yinyangA, yinyangB);

  // Compute element harmony
  const elementHarmony = computeElementHarmony(elementsA, elementsB);

  // Build polarity axis
  const polarityAxis = buildWesternPolarityAxis(personA, personB);

  return {
    elementsA,
    elementsB,
    elementHarmony,
    yinyangA,
    yinyangB,
    yinyangComparison,
    polarityAxis
  };
}
