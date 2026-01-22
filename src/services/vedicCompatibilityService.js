/**
 * Vedic Compatibility Service
 * Client-side Guna/Dosha compatibility calculations
 */

// ============================================================================
// GUNA COMPATIBILITY MATRIX
// ============================================================================

const GUNA_COMPATIBILITY_MATRIX = {
  'Sattva-Sattva': { label: 'Excellent', score: 90 },
  'Sattva-Rajas': { label: 'Good', score: 75 },
  'Sattva-Tamas': { label: 'Challenging', score: 55 },

  'Rajas-Sattva': { label: 'Good', score: 75 },
  'Rajas-Rajas': { label: 'Moderate', score: 65 },
  'Rajas-Tamas': { label: 'Good', score: 70 },

  'Tamas-Sattva': { label: 'Challenging', score: 55 },
  'Tamas-Rajas': { label: 'Good', score: 70 },
  'Tamas-Tamas': { label: 'Low', score: 50 },
};

// ============================================================================
// DOSHA COMPATIBILITY MATRIX
// ============================================================================

const DOSHA_COMPATIBILITY_MATRIX = {
  'Vata-Vata': { label: 'Low', score: 50 },
  'Vata-Pitta': { label: 'Good', score: 75 },
  'Vata-Kapha': { label: 'Excellent', score: 90 },

  'Pitta-Vata': { label: 'Good', score: 75 },
  'Pitta-Pitta': { label: 'Challenging', score: 55 },
  'Pitta-Kapha': { label: 'Good', score: 70 },

  'Kapha-Vata': { label: 'Excellent', score: 90 },
  'Kapha-Pitta': { label: 'Good', score: 70 },
  'Kapha-Kapha': { label: 'Moderate', score: 65 },
};

// ============================================================================
// OWN SIGNS AND EXALTATION FOR GRAHA STRENGTH
// ============================================================================

const GRAHA_OWN_SIGNS = {
  surya: ['Simha'],
  chandra: ['Karka'],
  mangala: ['Mesha', 'Vrishchika'],
  budha: ['Mithuna', 'Kanya'],
  guru: ['Dhanu', 'Meena'],
  shukra: ['Vrishabha', 'Tula'],
  shani: ['Makara', 'Kumbha'],
};

const GRAHA_EXALTATION = {
  surya: 'Mesha',
  chandra: 'Vrishabha',
  mangala: 'Makara',
  budha: 'Kanya',
  guru: 'Karka',
  shukra: 'Meena',
  shani: 'Tula',
};

// ============================================================================
// NAKSHATRA GANA (TEMPERAMENT)
// ============================================================================

const DEVA_NAKSHATRAS = [
  'Ashwini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta',
  'Swati', 'Anuradha', 'Shravana', 'Revati'
];

const RAKSHASA_NAKSHATRAS = [
  'Krittika', 'Ashlesha', 'Magha', 'Chitra', 'Vishakha',
  'Jyeshtha', 'Mula', 'Dhanishta', 'Shatabhisha'
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getOverallLabel(score) {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Moderate';
  if (score >= 50) return 'Challenging';
  return 'Low';
}

function getStrongGrahas(grahas) {
  const strong = new Set();

  for (const [name, data] of Object.entries(grahas || {})) {
    if (!data || !data.rashi) continue;
    const rashi = data.rashi.sanskrit || '';

    if (GRAHA_OWN_SIGNS[name]?.includes(rashi)) {
      strong.add(name);
    } else if (GRAHA_EXALTATION[name] === rashi) {
      strong.add(name);
    }
  }

  return strong;
}

function getNakshatraGana(nakshatraName) {
  if (DEVA_NAKSHATRAS.includes(nakshatraName)) return 'Deva';
  if (RAKSHASA_NAKSHATRAS.includes(nakshatraName)) return 'Rakshasa';
  return 'Manushya';
}

// ============================================================================
// COMPATIBILITY FUNCTIONS
// ============================================================================

/**
 * Compute Guna compatibility between two people
 */
export function computeGunaCompatibility(personA, personB) {
  const gunaA = personA?.interpretations?.temperament?.dominantGuna || 'Rajas';
  const gunaB = personB?.interpretations?.temperament?.dominantGuna || 'Rajas';

  const key = `${gunaA}-${gunaB}`;
  const result = GUNA_COMPATIBILITY_MATRIX[key] || { label: 'Moderate', score: 65 };

  return {
    gunaA,
    gunaB,
    compatibilityLabel: result.label,
    compatibilityScore: result.score,
    explanation: `${gunaA} + ${gunaB} creates a ${result.label.toLowerCase()} match with a score of ${result.score}.`
  };
}

/**
 * Compute Dosha compatibility between two people
 */
export function computeDoshaCompatibility(personA, personB) {
  const doshaA = personA?.interpretations?.temperament?.dominantDosha || 'Vata';
  const doshaB = personB?.interpretations?.temperament?.dominantDosha || 'Vata';

  const key = `${doshaA}-${doshaB}`;
  const result = DOSHA_COMPATIBILITY_MATRIX[key] || { label: 'Moderate', score: 65 };

  return {
    doshaA,
    doshaB,
    compatibilityLabel: result.label,
    compatibilityScore: result.score,
    explanation: `${doshaA} + ${doshaB} creates a ${result.label.toLowerCase()} match with a score of ${result.score}.`
  };
}

/**
 * Build temperament heatmap for visualization
 */
export function buildTemperamentHeatmap(personA, personB) {
  const gunaA = personA?.interpretations?.temperament?.dominantGuna || 'Rajas';
  const gunaB = personB?.interpretations?.temperament?.dominantGuna || 'Rajas';
  const doshaA = personA?.interpretations?.temperament?.dominantDosha || 'Vata';
  const doshaB = personB?.interpretations?.temperament?.dominantDosha || 'Vata';

  const gunaResult = GUNA_COMPATIBILITY_MATRIX[`${gunaA}-${gunaB}`] || { label: 'Moderate', score: 65 };
  const doshaResult = DOSHA_COMPATIBILITY_MATRIX[`${doshaA}-${doshaB}`] || { label: 'Moderate', score: 65 };

  const overallScore = Math.round((gunaResult.score + doshaResult.score) / 2);

  return {
    guna: {
      A: gunaA,
      B: gunaB,
      score: gunaResult.score,
      label: gunaResult.label
    },
    dosha: {
      A: doshaA,
      B: doshaB,
      score: doshaResult.score,
      label: doshaResult.label
    },
    overallScore,
    overallLabel: getOverallLabel(overallScore)
  };
}

/**
 * Build "What supports this relationship?" analysis
 */
export function buildRelationshipSupport(personA, personB) {
  const supportLines = [];

  // --- Guna ---
  const gunaA = personA?.interpretations?.temperament?.dominantGuna || 'Rajas';
  const gunaB = personB?.interpretations?.temperament?.dominantGuna || 'Rajas';
  const gunaResult = GUNA_COMPATIBILITY_MATRIX[`${gunaA}-${gunaB}`] || { score: 65 };

  if (gunaResult.score >= 80) {
    supportLines.push('Your temperaments harmonize naturally, creating ease and mutual understanding.');
  } else if (gunaResult.score >= 70) {
    supportLines.push('Your temperaments complement each other, giving the relationship dynamism and balance.');
  } else {
    supportLines.push('Your different temperaments create growth opportunities that strengthen the bond over time.');
  }

  // --- Dosha ---
  const doshaA = personA?.interpretations?.temperament?.dominantDosha || 'Vata';
  const doshaB = personB?.interpretations?.temperament?.dominantDosha || 'Vata';
  const doshaPair = `${doshaA}-${doshaB}`;

  if (['Vata-Kapha', 'Kapha-Vata'].includes(doshaPair)) {
    supportLines.push('One brings creativity while the other brings stability, forming a naturally supportive rhythm.');
  } else if (['Pitta-Kapha', 'Kapha-Pitta'].includes(doshaPair)) {
    supportLines.push('One brings drive while the other brings calm, creating a balanced emotional climate.');
  } else if (['Vata-Pitta', 'Pitta-Vata'].includes(doshaPair)) {
    supportLines.push('One brings creativity while the other brings direction, forming a dynamic partnership.');
  } else if (doshaA === doshaB) {
    supportLines.push('You share a similar constitutional rhythm, making daily life flow more easily.');
  }

  // --- Graha strengths ---
  const strongA = getStrongGrahas(personA?.grahas);
  const strongB = getStrongGrahas(personB?.grahas);

  if (strongA.has('shukra') && strongB.has('shukra')) {
    supportLines.push('Venus supports affection, harmony, and shared enjoyment.');
  }
  if (strongA.has('guru') && strongB.has('guru')) {
    supportLines.push('Jupiter brings wisdom, generosity, and shared growth.');
  }
  if (strongA.has('chandra') && strongB.has('chandra')) {
    supportLines.push('Strong Moons support emotional attunement and nurturing connection.');
  }

  // --- Nakshatra resonance ---
  const moonNakA = personA?.moonNakshatra?.lord || '';
  const moonNakB = personB?.moonNakshatra?.lord || '';

  if (moonNakA && moonNakB && moonNakA === moonNakB) {
    supportLines.push('You share a similar emotional language through your Nakshatra resonance.');
  }

  return {
    supportingFactors: supportLines,
    summary: supportLines.join(' ') || 'Your charts show potential for connection and growth.'
  };
}

/**
 * Build "What challenges this relationship?" analysis
 */
export function buildRelationshipChallenges(personA, personB) {
  const challenges = [];

  // --- Guna friction ---
  const gunaA = personA?.interpretations?.temperament?.dominantGuna || 'Rajas';
  const gunaB = personB?.interpretations?.temperament?.dominantGuna || 'Rajas';
  const gunaResult = GUNA_COMPATIBILITY_MATRIX[`${gunaA}-${gunaB}`] || { score: 65 };

  if (gunaResult.score <= 60) {
    challenges.push('Your temperaments operate at different speeds, creating misunderstandings or mismatched expectations.');
  }

  if (['Sattva-Tamas', 'Tamas-Sattva'].includes(`${gunaA}-${gunaB}`)) {
    challenges.push('One seeks clarity while the other seeks depth, which can create emotional misalignment.');
  }

  if (gunaA === 'Rajas' && gunaB === 'Rajas') {
    challenges.push('Both of you have active, restless temperaments that can lead to conflict or competition.');
  }

  // --- Dosha aggravation ---
  const doshaA = personA?.interpretations?.temperament?.dominantDosha || 'Vata';
  const doshaB = personB?.interpretations?.temperament?.dominantDosha || 'Vata';

  if (doshaA === 'Vata' && doshaB === 'Vata') {
    challenges.push('Both of you have fast, irregular rhythms that can lead to anxiety or instability.');
  }
  if (doshaA === 'Pitta' && doshaB === 'Pitta') {
    challenges.push('Both of you have strong wills and intensity, which can escalate into conflict.');
  }
  if (doshaA === 'Kapha' && doshaB === 'Kapha') {
    challenges.push('Both of you may avoid confrontation, leading to stagnation or unspoken issues.');
  }

  // --- Graha conflicts ---
  const strongA = getStrongGrahas(personA?.grahas);
  const strongB = getStrongGrahas(personB?.grahas);

  if (strongA.has('mangala') && strongB.has('mangala')) {
    challenges.push('Strong Mars in both charts can create arguments, competition, or power struggles.');
  }

  if ((strongA.has('shani') && strongB.has('chandra')) || (strongA.has('chandra') && strongB.has('shani'))) {
    challenges.push('Saturn-Moon tension can create emotional distance or differing needs for security.');
  }

  // --- Nakshatra mismatch ---
  const moonNakA = personA?.moonNakshatra?.name || '';
  const moonNakB = personB?.moonNakshatra?.name || '';

  const ganaA = getNakshatraGana(moonNakA);
  const ganaB = getNakshatraGana(moonNakB);

  if (ganaA && ganaB && ganaA !== ganaB) {
    if ((ganaA === 'Deva' && ganaB === 'Rakshasa') || (ganaA === 'Rakshasa' && ganaB === 'Deva')) {
      challenges.push('Your Nakshatra temperaments differ significantly, creating emotional misunderstandings.');
    }
  }

  return {
    challengeFactors: challenges,
    summary: challenges.join(' ') || 'Your charts show natural compatibility with minimal friction.'
  };
}

/**
 * Compute complete Vedic compatibility analysis
 */
export function computeVedicCompatibility(personA, personB) {
  const guna = computeGunaCompatibility(personA, personB);
  const dosha = computeDoshaCompatibility(personA, personB);
  const heatmap = buildTemperamentHeatmap(personA, personB);
  const support = buildRelationshipSupport(personA, personB);
  const challenges = buildRelationshipChallenges(personA, personB);

  const overallScore = Math.round((guna.compatibilityScore + dosha.compatibilityScore) / 2);

  return {
    gunaCompatibility: guna,
    doshaCompatibility: dosha,
    temperamentHeatmap: heatmap,
    relationshipSupport: support,
    relationshipChallenges: challenges,
    overallScore,
    overallLabel: getOverallLabel(overallScore)
  };
}

// ============================================================================
// RELATIONSHIP POLARITY MAP
// 5-axis compatibility diagram: Guna, Dosha, Element, Yin/Yang, Graha Dominance
// ============================================================================

const GUNA_POLARITY_MATRIX = {
  'Sattva-Sattva': { polarity: 'Resonant', description: 'Deep alignment in values, clarity, and purpose' },
  'Sattva-Rajas': { polarity: 'Activating', description: 'Clarity meets action, creating inspired movement' },
  'Sattva-Tamas': { polarity: 'Frictional', description: 'Light and shadow create tension but potential growth' },
  'Rajas-Sattva': { polarity: 'Activating', description: 'Action seeks guidance from clarity' },
  'Rajas-Rajas': { polarity: 'Amplifying', description: 'Mutual drive creates intensity and competition' },
  'Rajas-Tamas': { polarity: 'Complementary', description: 'Energy meets grounding, balancing extremes' },
  'Tamas-Sattva': { polarity: 'Frictional', description: 'Depth resists clarity, creating transformation' },
  'Tamas-Rajas': { polarity: 'Complementary', description: 'Grounding meets energy, stabilizing action' },
  'Tamas-Tamas': { polarity: 'Resonant', description: 'Deep inertia, shared comfort in stillness' },
};

const DOSHA_POLARITY_MATRIX = {
  'Vata-Vata': { polarity: 'Amplifying', description: 'Double air creates instability, needs grounding' },
  'Vata-Pitta': { polarity: 'Activating', description: 'Air feeds fire, creating inspiration and volatility' },
  'Vata-Kapha': { polarity: 'Balancing', description: 'Movement meets stability, perfect complementarity' },
  'Pitta-Vata': { polarity: 'Activating', description: 'Fire seeks air, dynamic but intense' },
  'Pitta-Pitta': { polarity: 'Amplifying', description: 'Double fire creates passion and conflict' },
  'Pitta-Kapha': { polarity: 'Cooling', description: 'Fire meets water/earth, tempering intensity' },
  'Kapha-Vata': { polarity: 'Balancing', description: 'Stability grounds movement, nurturing flow' },
  'Kapha-Pitta': { polarity: 'Cooling', description: 'Earth/water soothes fire, calming presence' },
  'Kapha-Kapha': { polarity: 'Amplifying', description: 'Double earth/water creates stagnation risk' },
};

const ELEMENT_POLARITY_MATRIX = {
  'Fire-Fire': { polarity: 'Amplifying', description: 'Mutual passion and inspiration, risk of burnout' },
  'Fire-Earth': { polarity: 'Stabilizing', description: 'Passion meets practicality, grounding enthusiasm' },
  'Fire-Air': { polarity: 'Harmonizing', description: 'Natural synergy, ideas fuel action' },
  'Fire-Water': { polarity: 'Volatile', description: 'Steam and tension, intense transformation' },
  'Earth-Fire': { polarity: 'Stabilizing', description: 'Structure channels energy productively' },
  'Earth-Earth': { polarity: 'Resonant', description: 'Shared values, stability, and patience' },
  'Earth-Air': { polarity: 'Frictional', description: 'Practical vs theoretical tension' },
  'Earth-Water': { polarity: 'Harmonizing', description: 'Natural nurturing, fertile ground' },
  'Air-Fire': { polarity: 'Harmonizing', description: 'Inspiration meets action, creative synergy' },
  'Air-Earth': { polarity: 'Frictional', description: 'Ideas vs reality, philosophical tension' },
  'Air-Air': { polarity: 'Dispersed', description: 'Too much thought, needs grounding' },
  'Air-Water': { polarity: 'Mixed', description: 'Mind meets emotion, variable connection' },
  'Water-Fire': { polarity: 'Volatile', description: 'Emotion clashes with will, transformation' },
  'Water-Earth': { polarity: 'Harmonizing', description: 'Emotion nurtures stability' },
  'Water-Air': { polarity: 'Mixed', description: 'Feeling seeks understanding, variable' },
  'Water-Water': { polarity: 'Amplifying', description: 'Deep emotional resonance, risk of drowning' },
};

const YINYANG_POLARITY_MATRIX = {
  'Yang-Yang': { polarity: 'Parallel', description: 'Both project outward, competition for space' },
  'Yang-Yin': { polarity: 'Magnetic', description: 'Natural attraction, complementary energies' },
  'Yin-Yang': { polarity: 'Magnetic', description: 'Receptive meets projective, balance' },
  'Yin-Yin': { polarity: 'Parallel', description: 'Both receive, may lack initiative' },
};

const GRAHA_AXIS_PAIRS = {
  'shukra-mangala': { axis: 'Passion Axis', description: 'Venus-Mars creates romantic/sexual polarity' },
  'mangala-shukra': { axis: 'Passion Axis', description: 'Mars-Venus creates pursuit and desire' },
  'shani-chandra': { axis: 'Stability-Emotion Axis', description: 'Saturn-Moon creates security vs feeling tension' },
  'chandra-shani': { axis: 'Stability-Emotion Axis', description: 'Moon-Saturn creates nurturing vs structure' },
  'guru-budha': { axis: 'Wisdom-Communication Axis', description: 'Jupiter-Mercury creates teaching and learning' },
  'budha-guru': { axis: 'Wisdom-Communication Axis', description: 'Mercury-Jupiter creates inquiry and expansion' },
  'surya-chandra': { axis: 'Identity-Emotion Axis', description: 'Sun-Moon creates self vs needs dynamic' },
  'chandra-surya': { axis: 'Identity-Emotion Axis', description: 'Moon-Sun creates emotional attunement to will' },
  'guru-shukra': { axis: 'Expansion-Pleasure Axis', description: 'Jupiter-Venus creates abundance and joy' },
  'shukra-guru': { axis: 'Expansion-Pleasure Axis', description: 'Venus-Jupiter creates beauty and wisdom' },
};

const POLARITY_COLORS = {
  Resonant: '#10B981',
  Harmonizing: '#10B981',
  Balancing: '#06B6D4',
  Cooling: '#06B6D4',
  Magnetic: '#8B5CF6',
  Complementary: '#3B82F6',
  Activating: '#F59E0B',
  Dynamic: '#F59E0B',
  Stabilizing: '#6366F1',
  Amplifying: '#EF4444',
  Volatile: '#EF4444',
  Intense: '#EF4444',
  Frictional: '#F97316',
  Parallel: '#94A3B8',
  Dispersed: '#94A3B8',
  Mixed: '#64748B',
  Harmonious: '#10B981',
};

const GRAHA_AXIS_COLORS = {
  'Passion Axis': '#EC4899',
  'Stability-Emotion Axis': '#6366F1',
  'Wisdom-Communication Axis': '#8B5CF6',
  'Identity-Emotion Axis': '#F59E0B',
  'Expansion-Pleasure Axis': '#10B981',
};

function getPolarityColor(polarity) {
  return POLARITY_COLORS[polarity] || '#64748B';
}

function getGrahaAxisColor(axisName) {
  return GRAHA_AXIS_COLORS[axisName] || '#64748B';
}

function getStrongestGraha(grahas) {
  if (!grahas || typeof grahas !== 'object') return 'chandra';

  const exaltation = {
    surya: 'Mesha',
    chandra: 'Vrishabha',
    mangala: 'Makara',
    budha: 'Kanya',
    guru: 'Karka',
    shukra: 'Meena',
    shani: 'Tula',
  };

  const exaltedGrahas = [];
  const ownSignGrahas = [];

  for (const [name, data] of Object.entries(grahas)) {
    if (!data || !data.rashi) continue;
    const rashi = data.rashi.sanskrit || '';

    if (rashi === exaltation[name]) {
      exaltedGrahas.push(name);
    } else if (GRAHA_OWN_SIGNS[name]?.includes(rashi)) {
      ownSignGrahas.push(name);
    }
  }

  const priority = ['shukra', 'chandra', 'guru', 'mangala', 'surya', 'budha', 'shani'];

  if (exaltedGrahas.length > 0) {
    for (const graha of priority) {
      if (exaltedGrahas.includes(graha)) return graha;
    }
    return exaltedGrahas[0];
  }

  if (ownSignGrahas.length > 0) {
    for (const graha of priority) {
      if (ownSignGrahas.includes(graha)) return graha;
    }
    return ownSignGrahas[0];
  }

  if ('shukra' in grahas) return 'shukra';
  if ('chandra' in grahas) return 'chandra';

  return Object.keys(grahas)[0] || 'chandra';
}

function getGrahaNaturePolarity(grahaA, grahaB) {
  const benefics = new Set(['guru', 'shukra', 'chandra', 'budha']);
  const malefics = new Set(['surya', 'mangala', 'shani', 'rahu', 'ketu']);

  if (benefics.has(grahaA) && benefics.has(grahaB)) return 'Harmonious';
  if (malefics.has(grahaA) && malefics.has(grahaB)) return 'Intense';
  return 'Dynamic';
}

/**
 * Compute Guna polarity between two people
 */
export function computeGunaPolarityAxis(personA, personB) {
  const gunaA = personA?.interpretations?.temperament?.dominantGuna || 'Rajas';
  const gunaB = personB?.interpretations?.temperament?.dominantGuna || 'Rajas';

  const key = `${gunaA}-${gunaB}`;
  const result = GUNA_POLARITY_MATRIX[key] || { polarity: 'Mixed', description: 'Variable guna interaction' };

  return {
    axis: 'Guna',
    personA: gunaA,
    personB: gunaB,
    polarity: result.polarity,
    description: result.description,
    color: getPolarityColor(result.polarity)
  };
}

/**
 * Compute Dosha polarity between two people
 */
export function computeDoshaPolarityAxis(personA, personB) {
  const doshaA = personA?.interpretations?.temperament?.dominantDosha || 'Vata';
  const doshaB = personB?.interpretations?.temperament?.dominantDosha || 'Vata';

  const key = `${doshaA}-${doshaB}`;
  const result = DOSHA_POLARITY_MATRIX[key] || { polarity: 'Mixed', description: 'Variable dosha interaction' };

  return {
    axis: 'Dosha',
    personA: doshaA,
    personB: doshaB,
    polarity: result.polarity,
    description: result.description,
    color: getPolarityColor(result.polarity)
  };
}

/**
 * Compute Element polarity between two people
 */
export function computeElementPolarityAxis(personA, personB) {
  const elemA = personA?.western?.dominantElement || 'Fire';
  const elemB = personB?.western?.dominantElement || 'Fire';

  const key = `${elemA}-${elemB}`;
  const result = ELEMENT_POLARITY_MATRIX[key] || { polarity: 'Mixed', description: 'Variable elemental interaction' };

  return {
    axis: 'Element',
    personA: elemA,
    personB: elemB,
    polarity: result.polarity,
    description: result.description,
    color: getPolarityColor(result.polarity)
  };
}

/**
 * Compute Yin/Yang polarity between two people
 */
export function computeYinYangPolarityAxis(personA, personB) {
  const polarityA = personA?.western?.polarity || 'Yang';
  const polarityB = personB?.western?.polarity || 'Yang';

  const key = `${polarityA}-${polarityB}`;
  const result = YINYANG_POLARITY_MATRIX[key] || { polarity: 'Mixed', description: 'Variable polarity interaction' };

  return {
    axis: 'Yin/Yang',
    personA: polarityA,
    personB: polarityB,
    polarity: result.polarity,
    description: result.description,
    color: getPolarityColor(result.polarity)
  };
}

/**
 * Compute Graha dominance polarity between two people
 */
export function computeGrahaPolarityAxis(personA, personB) {
  const strongA = getStrongestGraha(personA?.grahas);
  const strongB = getStrongestGraha(personB?.grahas);

  const key = `${strongA}-${strongB}`;
  const axisResult = GRAHA_AXIS_PAIRS[key];

  if (axisResult) {
    return {
      axis: 'Graha Dominance',
      personA: strongA ? strongA.charAt(0).toUpperCase() + strongA.slice(1) : 'Unknown',
      personB: strongB ? strongB.charAt(0).toUpperCase() + strongB.slice(1) : 'Unknown',
      polarity: axisResult.axis,
      description: axisResult.description,
      color: getGrahaAxisColor(axisResult.axis)
    };
  }

  const polarity = getGrahaNaturePolarity(strongA, strongB);
  const personAName = strongA ? strongA.charAt(0).toUpperCase() + strongA.slice(1) : 'Unknown';
  const personBName = strongB ? strongB.charAt(0).toUpperCase() + strongB.slice(1) : 'Unknown';

  return {
    axis: 'Graha Dominance',
    personA: personAName,
    personB: personBName,
    polarity,
    description: `${personAName}-${personBName} creates ${polarity.toLowerCase()} dynamics`,
    color: getPolarityColor(polarity)
  };
}

// ============================================================================
// WEIGHTED POLARITY SCORE (0-100)
// ============================================================================

const POLARITY_WEIGHTS = {
  Guna: 0.30,
  Dosha: 0.20,
  Element: 0.20,
  'Yin/Yang': 0.15,
  'Graha Dominance': 0.15,
};

const POLARITY_TYPE_SCORES = {
  // Positive polarities (high scores)
  Resonant: 95,
  Harmonizing: 90,
  Harmonious: 90,
  Magnetic: 90,
  Balancing: 88,
  Cooling: 85,
  Complementary: 82,
  Stabilizing: 80,
  // Neutral/Dynamic polarities (mid scores)
  Activating: 70,
  Dynamic: 68,
  Parallel: 65,
  Mixed: 60,
  Dispersed: 55,
  // Challenging polarities (lower scores)
  Amplifying: 50,
  Frictional: 45,
  Volatile: 40,
  Intense: 38,
};

const GRAHA_AXIS_SCORES_MAP = {
  'Passion Axis': 92,
  'Expansion-Pleasure Axis': 90,
  'Wisdom-Communication Axis': 85,
  'Identity-Emotion Axis': 78,
  'Stability-Emotion Axis': 72,
};

const POLARITY_SCORE_BANDS = [
  { min: 90, max: 100, label: 'Magnetic Polarity', interpretation: 'Powerful attraction with deep complementarity' },
  { min: 80, max: 89, label: 'Harmonious Polarity', interpretation: 'Strong synergy and natural flow' },
  { min: 70, max: 79, label: 'Balanced Polarity', interpretation: 'Stable, supportive, and mutually enriching' },
  { min: 60, max: 69, label: 'Dynamic Polarity', interpretation: 'Growth-oriented with stimulating friction' },
  { min: 50, max: 59, label: 'Challenging Polarity', interpretation: 'Mismatched rhythms requiring conscious work' },
  { min: 0, max: 49, label: 'Volatile Polarity', interpretation: 'Intense karmic activation, transformative but unstable' },
];

function getAxisScore(axis) {
  const polarity = axis.polarity || 'Mixed';

  // Check for Graha axis-specific scores first
  if (axis.axis === 'Graha Dominance' && GRAHA_AXIS_SCORES_MAP[polarity]) {
    return GRAHA_AXIS_SCORES_MAP[polarity];
  }

  return POLARITY_TYPE_SCORES[polarity] || 60;
}

/**
 * Compute weighted composite Relationship Polarity Score (0-100)
 */
export function computeWeightedPolarityScore(axes) {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const axis of axes) {
    const axisName = axis.axis || '';
    const weight = POLARITY_WEIGHTS[axisName] || 0.15;
    const score = getAxisScore(axis);

    weightedSum += score * weight;
    totalWeight += weight;
  }

  let finalScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 60;
  finalScore = Math.max(0, Math.min(100, finalScore));

  // Get interpretation band
  let label = 'Mixed Polarity';
  let interpretation = 'Variable energetic interaction';

  for (const band of POLARITY_SCORE_BANDS) {
    if (finalScore >= band.min && finalScore <= band.max) {
      label = band.label;
      interpretation = band.interpretation;
      break;
    }
  }

  const breakdown = {};
  for (const axis of axes) {
    const axisName = axis.axis || 'Unknown';
    const score = getAxisScore(axis);
    const weight = POLARITY_WEIGHTS[axisName] || 0.15;
    breakdown[axisName] = {
      score,
      weight,
      weighted: Math.round(score * weight * 10) / 10
    };
  }

  return {
    score: finalScore,
    label,
    interpretation,
    breakdown
  };
}

// ============================================================================
// POLARITY ARCHETYPE SYSTEM
// 12 named archetypes representing the mythic identity of the relationship
// ============================================================================

const ARCHETYPE_DESCRIPTIONS = {
  'The Magnetic Opposites': {
    description: 'A relationship built on polarity — Yin meets Yang, passion meets calm, movement meets stillness. This archetype thrives on attraction through difference.',
    keywords: ['attraction', 'polarity', 'chemistry', 'growth'],
    icon: '🧲'
  },
  'The Harmonious Twins': {
    description: 'A relationship of natural resonance — both partners share similar temperaments, values, and rhythms. Effortless, calm, and deeply aligned.',
    keywords: ['resonance', 'ease', 'alignment', 'understanding'],
    icon: '👯'
  },
  'The Fire-Air Circuit': {
    description: 'A dynamic, inspiring relationship where ideas fuel action and action inspires ideas. Fast-moving, creative, and mentally stimulating.',
    keywords: ['inspiration', 'action', 'creativity', 'momentum'],
    icon: '🔥'
  },
  'The Earth-Water Foundation': {
    description: 'A nurturing, stabilizing relationship where emotion meets practicality. Grounded, fertile, and emotionally safe.',
    keywords: ['stability', 'nurturing', 'grounding', 'security'],
    icon: '🌿'
  },
  'The Stabilizer-Visionary Pair': {
    description: 'One partner grounds while the other dreams. Together they balance imagination with practicality, vision with execution.',
    keywords: ['balance', 'vision', 'practicality', 'complementarity'],
    icon: '⚖️'
  },
  'The Dharma Companions': {
    description: 'A relationship aligned on purpose, meaning, and growth. Both partners share a sense of mission and mutual elevation.',
    keywords: ['purpose', 'growth', 'wisdom', 'alignment'],
    icon: '🧘'
  },
  'The Passion Axis': {
    description: 'A relationship defined by the Venus-Mars axis — chemistry, desire, and romantic intensity form the core dynamic.',
    keywords: ['passion', 'romance', 'desire', 'intensity'],
    icon: '💫'
  },
  'The Transformational Pair': {
    description: 'A relationship that activates deep change, shadow work, and karmic transformation. Intense, catalytic, and growth-inducing.',
    keywords: ['transformation', 'intensity', 'shadow', 'rebirth'],
    icon: '🦋'
  },
  'The Parallel Travelers': {
    description: 'Partners who walk side-by-side rather than face-to-face. Similar energies, parallel rhythms, steady companionship.',
    keywords: ['companionship', 'parallel', 'steady', 'friendship'],
    icon: '🚶'
  },
  'The Creative Disruptors': {
    description: 'A relationship that thrives on innovation, change, and breaking patterns. Dynamic, unpredictable, and creatively charged.',
    keywords: ['innovation', 'disruption', 'creativity', 'change'],
    icon: '⚡'
  },
  'The Karmic Mirrors': {
    description: 'Partners who reflect each other\'s patterns, wounds, and lessons. This relationship teaches through reflection and confrontation.',
    keywords: ['karma', 'reflection', 'lessons', 'healing'],
    icon: '🪞'
  },
  'The Sacred Counterweights': {
    description: 'A relationship of conscious balancing — each partner provides what the other lacks, creating wholeness through complementarity.',
    keywords: ['balance', 'wholeness', 'healing', 'complementarity'],
    icon: '☯️'
  },
  'The Balanced Polarity Pair': {
    description: 'A relationship with mixed polarities that balance harmonious and challenging axes. Growth through conscious navigation.',
    keywords: ['balance', 'growth', 'awareness', 'navigation'],
    icon: '🎯'
  }
};

/**
 * Classify the polarity archetype based on the 5-axis polarity map
 */
function classifyPolarityArchetype(polarityMap) {
  const axes = polarityMap.axes || [];

  // Extract polarity values from each axis
  const polarities = {};
  for (const axis of axes) {
    polarities[axis.axis] = axis.polarity;
  }

  const guna = polarities['Guna'] || 'Mixed';
  const dosha = polarities['Dosha'] || 'Mixed';
  const element = polarities['Element'] || 'Mixed';
  const yinyang = polarities['Yin/Yang'] || 'Mixed';
  const graha = polarities['Graha Dominance'] || 'Mixed';

  // Priority-based classification rules

  // Rule 1: Magnetic Opposites — Yin/Yang = Magnetic + strong polarity score
  if (yinyang === 'Magnetic' && (polarityMap.polarityScore?.score || 0) >= 80) {
    return 'The Magnetic Opposites';
  }

  // Rule 2: Harmonious Twins — Guna = Resonant + Dosha = Balancing
  if (guna === 'Resonant' && (dosha === 'Balancing' || dosha === 'Cooling')) {
    return 'The Harmonious Twins';
  }

  // Rule 3: Fire-Air Circuit — Element = Harmonizing + Guna = Activating
  if (element === 'Harmonizing' && guna === 'Activating') {
    return 'The Fire-Air Circuit';
  }

  // Rule 4: Earth-Water Foundation — Element = Harmonizing + Dosha = Balancing
  if (element === 'Harmonizing' && dosha === 'Balancing') {
    return 'The Earth-Water Foundation';
  }

  // Rule 5: Passion Axis — Graha = Passion Axis
  if (graha === 'Passion Axis') {
    return 'The Passion Axis';
  }

  // Rule 6: Dharma Companions — Graha = Wisdom-Communication or Expansion-Pleasure
  if (graha === 'Wisdom-Communication Axis' || graha === 'Expansion-Pleasure Axis') {
    return 'The Dharma Companions';
  }

  // Rule 7: Stabilizer-Visionary — Element = Stabilizing + Yin/Yang = Magnetic
  if (element === 'Stabilizing' && yinyang === 'Magnetic') {
    return 'The Stabilizer-Visionary Pair';
  }

  // Rule 8: Transformational Pair — Element = Volatile + Dosha = Amplifying
  if (element === 'Volatile' && dosha === 'Amplifying') {
    return 'The Transformational Pair';
  }

  // Rule 9: Parallel Travelers — Yin/Yang = Parallel + multiple Resonant axes
  if (yinyang === 'Parallel' && (guna === 'Resonant' || element === 'Resonant')) {
    return 'The Parallel Travelers';
  }

  // Rule 10: Creative Disruptors — Guna = Activating + Element = Frictional or Volatile
  if (guna === 'Activating' && (element === 'Frictional' || element === 'Volatile')) {
    return 'The Creative Disruptors';
  }

  // Rule 11: Karmic Mirrors — Dosha = Amplifying + Guna = Frictional
  if (dosha === 'Amplifying' && guna === 'Frictional') {
    return 'The Karmic Mirrors';
  }

  // Rule 12: Sacred Counterweights — multiple Complementary polarities
  const complementaryCount = axes.filter(a =>
    a.polarity === 'Complementary' || a.polarity === 'Balancing'
  ).length;
  if (complementaryCount >= 2) {
    return 'The Sacred Counterweights';
  }

  // Default: Balanced Polarity Pair
  return 'The Balanced Polarity Pair';
}

/**
 * Build the polarity archetype with full metadata
 */
export function buildPolarityArchetype(personA, personB, polarityMap) {
  const archetypeName = classifyPolarityArchetype(polarityMap);
  const archetypeData = ARCHETYPE_DESCRIPTIONS[archetypeName] || ARCHETYPE_DESCRIPTIONS['The Balanced Polarity Pair'];

  // Build classification rationale
  const axes = polarityMap.axes || [];
  const classificationReasons = [];

  for (const axis of axes) {
    if (['Resonant', 'Harmonizing', 'Magnetic', 'Balancing'].includes(axis.polarity)) {
      classificationReasons.push(`${axis.axis}: ${axis.polarity} (harmonious)`);
    } else if (['Amplifying', 'Volatile', 'Frictional', 'Intense'].includes(axis.polarity)) {
      classificationReasons.push(`${axis.axis}: ${axis.polarity} (challenging)`);
    } else {
      classificationReasons.push(`${axis.axis}: ${axis.polarity} (dynamic)`);
    }
  }

  return {
    name: archetypeName,
    description: archetypeData.description,
    keywords: archetypeData.keywords,
    icon: archetypeData.icon,
    classification: classificationReasons
  };
}

/**
 * Build the complete 5-axis Relationship Polarity Map
 */
export function buildPolarityMap(personA, personB) {
  const guna = computeGunaPolarityAxis(personA, personB);
  const dosha = computeDoshaPolarityAxis(personA, personB);
  const element = computeElementPolarityAxis(personA, personB);
  const yinyang = computeYinYangPolarityAxis(personA, personB);
  const graha = computeGrahaPolarityAxis(personA, personB);

  const axes = [guna, dosha, element, yinyang, graha];

  const positivePolarities = new Set([
    'Resonant', 'Harmonizing', 'Balancing', 'Cooling', 'Magnetic', 'Complementary', 'Harmonious'
  ]);
  const challengingPolarities = new Set(['Amplifying', 'Volatile', 'Frictional', 'Intense']);

  const positiveCount = axes.filter(a => positivePolarities.has(a.polarity)).length;
  const challengingCount = axes.filter(a => challengingPolarities.has(a.polarity)).length;
  const harmonyScore = Math.round((positiveCount / 5) * 100);

  // Build narrative
  const narratives = [];

  if (harmonyScore >= 80) {
    narratives.push('Your energies meet in remarkable harmony across multiple dimensions.');
  } else if (harmonyScore >= 60) {
    narratives.push('Your connection shows strong complementarity with room for conscious growth.');
  } else if (harmonyScore >= 40) {
    narratives.push('Your relationship is dynamic, with both harmonious and challenging polarities.');
  } else {
    narratives.push('Your connection requires conscious effort to bridge different energetic frequencies.');
  }

  for (const axis of axes) {
    if (['Resonant', 'Harmonizing', 'Magnetic'].includes(axis.polarity)) {
      narratives.push(`The ${axis.axis} axis shows natural alignment.`);
    } else if (['Amplifying', 'Volatile', 'Frictional'].includes(axis.polarity)) {
      narratives.push(`The ${axis.axis} axis invites conscious navigation.`);
    }
  }

  // Get dominant polarity
  const polarityCounts = {};
  for (const axis of axes) {
    polarityCounts[axis.polarity] = (polarityCounts[axis.polarity] || 0) + 1;
  }
  const dominantPolarity = Object.keys(polarityCounts).reduce(
    (a, b) => polarityCounts[a] > polarityCounts[b] ? a : b,
    'Mixed'
  );

  // Compute weighted polarity score (0-100)
  const polarityScore = computeWeightedPolarityScore(axes);

  // Build temporary map for archetype classification
  const tempMap = {
    axes,
    polarityScore
  };

  // Compute polarity archetype
  const archetype = buildPolarityArchetype(personA, personB, tempMap);

  return {
    axes,
    harmonyScore,
    positiveAxes: positiveCount,
    challengingAxes: challengingCount,
    neutralAxes: 5 - positiveCount - challengingCount,
    narrative: narratives.join(' '),
    dominantPolarity,
    polarityScore,
    archetype
  };
}

// ============================================================================
// POLARITY ARCHETYPE DIFF
// Side-by-side comparison of two relationships
// ============================================================================

const ARCHETYPE_TEACHINGS = {
  'The Magnetic Opposites': 'how to navigate polarity, passion, and dynamic tension.',
  'The Harmonious Twins': 'how to cultivate resonance, ease, and shared rhythm.',
  'The Fire-Air Circuit': 'how to channel inspiration and movement.',
  'The Earth-Water Foundation': 'how to build stability and emotional grounding.',
  'The Stabilizer-Visionary Pair': 'how to balance imagination with practicality.',
  'The Dharma Companions': 'how to align purpose, meaning, and growth.',
  'The Passion Axis': 'how to integrate chemistry with emotional depth.',
  'The Transformational Pair': 'how to navigate intensity, shadow, and rebirth.',
  'The Parallel Travelers': 'how to maintain steady companionship.',
  'The Creative Disruptors': 'how to embrace change and innovation.',
  'The Karmic Mirrors': 'how to face emotional patterns and karmic lessons.',
  'The Sacred Counterweights': 'how to balance extremes and heal through difference.',
  'The Balanced Polarity Pair': 'how to grow through conscious relational navigation.'
};

/**
 * Extract the teaching message for an archetype
 */
function extractArchetypeTeaching(archetype) {
  const name = archetype?.name || 'The Balanced Polarity Pair';
  return ARCHETYPE_TEACHINGS[name] || 'how to grow through relational polarity.';
}

/**
 * Get polarity value from a polarity map for a specific axis
 */
function getPolarityForAxis(polarityMap, axisName) {
  const axis = polarityMap?.axes?.find(a => a.axis === axisName);
  return axis?.polarity || 'Mixed';
}

/**
 * Build Polarity Archetype Diff between two relationships
 * @param {Object} relA - First relationship { archetype, polarityScore, polarityMap }
 * @param {Object} relB - Second relationship { archetype, polarityScore, polarityMap }
 * @returns {Object} Diff analysis
 */
export function buildPolarityArchetypeDiff(relA, relB) {
  const archetypeA = relA?.archetype || { name: 'Unknown' };
  const archetypeB = relB?.archetype || { name: 'Unknown' };

  const scoreA = relA?.polarityScore?.score || relA?.polarityScore || 0;
  const scoreB = relB?.polarityScore?.score || relB?.polarityScore || 0;

  const mapA = relA?.polarityMap || relA;
  const mapB = relB?.polarityMap || relB;

  const differences = [];

  // Compare archetype names
  if (archetypeA.name !== archetypeB.name) {
    differences.push(
      `Relationship A expresses the '${archetypeA.name}' archetype, while Relationship B expresses the '${archetypeB.name}' archetype.`
    );
  } else {
    differences.push(
      `Both relationships share the '${archetypeA.name}' archetype, but express it in distinct ways.`
    );
  }

  // Compare polarity scores
  const scoreDiff = Math.abs(scoreA - scoreB);
  if (scoreA > scoreB + 5) {
    differences.push('Relationship A has a stronger polarity charge and more natural energetic flow.');
  } else if (scoreB > scoreA + 5) {
    differences.push('Relationship B has a stronger polarity charge and more natural energetic flow.');
  } else {
    differences.push('Both relationships have similar polarity intensity.');
  }

  // Compare each axis
  const axisLabels = {
    'Guna': 'The temperamental foundation differs: one relationship operates with a different Guna polarity than the other.',
    'Dosha': 'The constitutional rhythm differs, affecting emotional pacing and daily flow.',
    'Element': 'The elemental synergy shifts, changing how inspiration, stability, or emotion flows.',
    'Yin/Yang': 'The attraction polarity differs, shifting the balance between magnetism and resonance.',
    'Graha Dominance': 'Different planetary forces dominate each relationship, shaping its emotional and karmic tone.'
  };

  for (const [axisName, diffMessage] of Object.entries(axisLabels)) {
    const polarityA = getPolarityForAxis(mapA, axisName);
    const polarityB = getPolarityForAxis(mapB, axisName);

    if (polarityA !== polarityB) {
      differences.push(diffMessage);
    }
  }

  // Teaching contrast
  const teachingA = extractArchetypeTeaching(archetypeA);
  const teachingB = extractArchetypeTeaching(archetypeB);

  const teachingContrast = [
    `Relationship A teaches: ${teachingA}`,
    `Relationship B teaches: ${teachingB}`
  ];

  // Energetic shift
  const energeticShift = [];

  if (archetypeA.name !== archetypeB.name) {
    energeticShift.push(
      `Moving from Relationship A to Relationship B shifts the archetype from '${archetypeA.name}' to '${archetypeB.name}', altering the relational field.`
    );
  } else {
    energeticShift.push(
      `Both relationships embody the '${archetypeA.name}' archetype, maintaining a consistent relational field with subtle variations.`
    );
  }

  // Add score-based energy shift
  if (scoreDiff >= 15) {
    if (scoreA > scoreB) {
      energeticShift.push('The shift represents a move from higher polarity charge to more grounded, stable energy.');
    } else {
      energeticShift.push('The shift represents a move from stable energy to higher polarity charge and intensity.');
    }
  }

  // Build summary
  const summary = differences.slice(0, 3).join(' ');

  return {
    summary,
    differences,
    teachingContrast,
    energeticShift,
    scoreComparison: {
      scoreA,
      scoreB,
      difference: scoreDiff,
      stronger: scoreA > scoreB ? 'A' : scoreB > scoreA ? 'B' : 'equal'
    },
    archetypeComparison: {
      nameA: archetypeA.name,
      nameB: archetypeB.name,
      iconA: archetypeA.icon,
      iconB: archetypeB.icon,
      sameArchetype: archetypeA.name === archetypeB.name
    }
  };
}

// ============================================================================
// ARCHETYPE EVOLUTION TIMELINE
// Temporal dimension: how the relationship archetype shifts across Mahadasha periods
// ============================================================================

// Planet → Archetype mapping for Mahadasha periods
const PLANET_ARCHETYPE_MAP = {
  Venus: 'The Passion Axis',
  Shukra: 'The Passion Axis',
  Mars: 'The Magnetic Opposites',
  Mangala: 'The Magnetic Opposites',
  Saturn: 'The Transformational Pair',
  Shani: 'The Transformational Pair',
  Jupiter: 'The Dharma Companions',
  Guru: 'The Dharma Companions',
  Mercury: 'The Creative Disruptors',
  Budha: 'The Creative Disruptors',
  Rahu: 'The Creative Disruptors',
  Ketu: 'The Karmic Mirrors',
  Moon: 'The Earth-Water Foundation',
  Chandra: 'The Earth-Water Foundation',
  Sun: 'The Fire-Air Circuit',
  Surya: 'The Fire-Air Circuit',
};

// Growth themes for each planetary period
const PLANET_GROWTH_THEMES = {
  Venus: 'Connection, harmony, shared pleasure, and romantic renewal.',
  Shukra: 'Connection, harmony, shared pleasure, and romantic renewal.',
  Mars: 'Courage, passion, direct communication, and dynamic energy.',
  Mangala: 'Courage, passion, direct communication, and dynamic energy.',
  Saturn: 'Patience, responsibility, emotional maturity, and endurance.',
  Shani: 'Patience, responsibility, emotional maturity, and endurance.',
  Jupiter: 'Wisdom, generosity, shared purpose, and spiritual growth.',
  Guru: 'Wisdom, generosity, shared purpose, and spiritual growth.',
  Mercury: 'Communication, adaptability, learning, and mental connection.',
  Budha: 'Communication, adaptability, learning, and mental connection.',
  Rahu: 'Innovation, expansion, unconventional growth, and new horizons.',
  Ketu: 'Detachment, healing, spiritual clarity, and karmic resolution.',
  Moon: 'Emotional bonding, nurturing, safety, and intuitive connection.',
  Chandra: 'Emotional bonding, nurturing, safety, and intuitive connection.',
  Sun: 'Identity, confidence, shared direction, and mutual respect.',
  Surya: 'Identity, confidence, shared direction, and mutual respect.',
};

// Shadow themes for each planetary period
const PLANET_SHADOW_THEMES = {
  Venus: 'Over-idealization, dependency, avoidance of difficult topics.',
  Shukra: 'Over-idealization, dependency, avoidance of difficult topics.',
  Mars: 'Conflict, impulsiveness, power struggles, and anger.',
  Mangala: 'Conflict, impulsiveness, power struggles, and anger.',
  Saturn: 'Distance, heaviness, emotional contraction, and rigidity.',
  Shani: 'Distance, heaviness, emotional contraction, and rigidity.',
  Jupiter: 'Overexpansion, unrealistic optimism, and excess.',
  Guru: 'Overexpansion, unrealistic optimism, and excess.',
  Mercury: 'Overthinking, inconsistency, and scattered energy.',
  Budha: 'Overthinking, inconsistency, and scattered energy.',
  Rahu: 'Instability, obsession, volatility, and confusion.',
  Ketu: 'Withdrawal, detachment, emotional gaps, and isolation.',
  Moon: 'Moodiness, emotional overwhelm, and hypersensitivity.',
  Chandra: 'Moodiness, emotional overwhelm, and hypersensitivity.',
  Sun: 'Ego clashes, stubbornness, and dominance struggles.',
  Surya: 'Ego clashes, stubbornness, and dominance struggles.',
};

// Planetary period summaries
const PLANET_PERIOD_SUMMARIES = {
  Venus: 'Venus brings harmony, romance, and shared pleasure to the relationship.',
  Shukra: 'Venus brings harmony, romance, and shared pleasure to the relationship.',
  Mars: 'Mars activates passion, energy, and dynamic tension in the relationship.',
  Mangala: 'Mars activates passion, energy, and dynamic tension in the relationship.',
  Saturn: 'Saturn activates karmic lessons, emotional depth, and long-term restructuring.',
  Shani: 'Saturn activates karmic lessons, emotional depth, and long-term restructuring.',
  Jupiter: 'Jupiter expands wisdom, blessings, and shared purpose in the relationship.',
  Guru: 'Jupiter expands wisdom, blessings, and shared purpose in the relationship.',
  Mercury: 'Mercury brings communication shifts, mental stimulation, and new patterns.',
  Budha: 'Mercury brings communication shifts, mental stimulation, and new patterns.',
  Rahu: 'Rahu destabilizes, intensifies, and electrifies the relational field.',
  Ketu: 'Ketu reveals past-life patterns and emotional residues for healing.',
  Moon: 'Moon deepens emotional bonding, nurturing, and intuitive connection.',
  Chandra: 'Moon deepens emotional bonding, nurturing, and intuitive connection.',
  Sun: 'Sun illuminates identity, confidence, and shared direction.',
  Surya: 'Sun illuminates identity, confidence, and shared direction.',
};

// Planet icons
const PLANET_ICONS = {
  Venus: '♀️',
  Shukra: '♀️',
  Mars: '♂️',
  Mangala: '♂️',
  Saturn: '♄',
  Shani: '♄',
  Jupiter: '♃',
  Guru: '♃',
  Mercury: '☿',
  Budha: '☿',
  Rahu: '☊',
  Ketu: '☋',
  Moon: '☽',
  Chandra: '☽',
  Sun: '☉',
  Surya: '☉',
};

/**
 * Classify the relationship archetype for a given Mahadasha planet
 */
export function classifyArchetypeForPlanet(planet, polarityMap = null) {
  // Normalize planet name
  const planetNormalized = planet?.charAt(0).toUpperCase() + planet?.slice(1).toLowerCase();

  // Get base archetype from planet
  const archetype = PLANET_ARCHETYPE_MAP[planetNormalized];

  if (archetype) {
    return archetype;
  }

  // Fallback: check for alternate spellings
  for (const [key, value] of Object.entries(PLANET_ARCHETYPE_MAP)) {
    if (key.toLowerCase() === planet?.toLowerCase()) {
      return value;
    }
  }

  // Default
  return 'The Balanced Polarity Pair';
}

/**
 * Build the Archetype Evolution Timeline showing how the relationship's
 * polarity archetype shifts across Vimshottari Mahadasha periods
 */
export function buildArchetypeEvolutionTimeline(relationship, polarityMap = null) {
  const timeline = [];

  // Get Mahadasha periods from relationship data
  const dashas = relationship?.dashas || {};
  let mahadashas = dashas.mahadashas || dashas.mahadasas || [];

  if (!mahadashas.length) {
    // Try alternate data structure
    mahadashas = relationship?.mahadashas || [];
  }

  for (const dasha of mahadashas) {
    const planet = dasha.planet || dasha.lord || '';
    const start = dasha.start || dasha.startDate || '';
    const end = dasha.end || dasha.endDate || '';

    if (!planet) continue;

    // Get archetype for this planetary period
    const archetype = classifyArchetypeForPlanet(planet, polarityMap);

    // Get archetype details
    const archetypeData = ARCHETYPE_DESCRIPTIONS[archetype] ||
      ARCHETYPE_DESCRIPTIONS['The Balanced Polarity Pair'] || {};

    // Get planet-specific themes
    const planetKey = planet.charAt(0).toUpperCase() + planet.slice(1).toLowerCase();
    const growth = PLANET_GROWTH_THEMES[planetKey] || 'Growth through relational awareness.';
    const shadow = PLANET_SHADOW_THEMES[planetKey] || 'Shadow patterns requiring conscious navigation.';
    const summary = PLANET_PERIOD_SUMMARIES[planetKey] || `${planet} shapes the relationship's evolution.`;
    const icon = PLANET_ICONS[planetKey] || '🪐';

    timeline.push({
      planet,
      planetIcon: icon,
      start,
      end,
      archetype,
      archetypeIcon: archetypeData.icon || '🎯',
      archetypeDescription: archetypeData.description || '',
      summary,
      growth,
      shadow,
      keywords: archetypeData.keywords || []
    });
  }

  return timeline;
}

/**
 * Build a complete relationship analysis including polarity map,
 * archetype, and evolution timeline
 */
export function buildCompleteRelationshipAnalysis(personA, personB, dashas = null) {
  // Build the polarity map (includes archetype)
  const polarityMap = buildPolarityMap(personA, personB);

  // Build the evolution timeline if dashas are provided
  let timeline = [];
  if (dashas) {
    const relationshipData = {
      dashas,
      grahaDominance: polarityMap.axes?.[polarityMap.axes.length - 1] // Graha axis
    };
    timeline = buildArchetypeEvolutionTimeline(relationshipData, polarityMap);
  }

  return {
    polarityMap,
    archetype: polarityMap.archetype,
    polarityScore: polarityMap.polarityScore,
    evolutionTimeline: timeline
  };
}

// ============================================================================
// ARCHETYPE EVOLUTION DIFF
// Side-by-side comparison of how two relationships evolve across Mahadasha periods
// ============================================================================

// Archetype shift narratives
const ARCHETYPE_SHIFT_NARRATIVES = {
  'The Transformational Pair->The Passion Axis': 'moves from karmic intensity to romantic harmony.',
  'The Transformational Pair->The Dharma Companions': 'moves from emotional depth to purpose-driven alignment.',
  'The Creative Disruptors->The Dharma Companions': 'moves from innovation to purpose-driven stability.',
  'The Creative Disruptors->The Passion Axis': 'moves from experimentation to romantic chemistry.',
  'The Karmic Mirrors->The Harmonious Twins': 'moves from karmic reflection to natural resonance.',
  'The Karmic Mirrors->The Passion Axis': 'moves from karmic lessons to romantic renewal.',
  'The Magnetic Opposites->The Harmonious Twins': 'moves from dynamic tension to peaceful alignment.',
  'The Magnetic Opposites->The Dharma Companions': 'moves from attraction to shared purpose.',
  'The Earth-Water Foundation->The Fire-Air Circuit': 'moves from grounding stability to creative inspiration.',
  'The Fire-Air Circuit->The Earth-Water Foundation': 'moves from dynamic creativity to grounded nurturing.',
  'The Passion Axis->The Dharma Companions': 'moves from romantic intensity to spiritual partnership.',
  'The Dharma Companions->The Passion Axis': 'moves from shared purpose to renewed romance.',
  'The Parallel Travelers->The Magnetic Opposites': 'moves from comfortable companionship to dynamic attraction.',
  'The Sacred Counterweights->The Harmonious Twins': 'moves from conscious balancing to natural harmony.',
};

/**
 * Detect archetype shifts between consecutive periods
 */
function detectArchetypeShifts(timeline) {
  const shifts = [];
  for (let i = 0; i < timeline.length - 1; i++) {
    const a1 = timeline[i]?.archetype || '';
    const a2 = timeline[i + 1]?.archetype || '';
    if (a1 && a2 && a1 !== a2) {
      shifts.push({ from: a1, to: a2, start: timeline[i + 1]?.start || '' });
    }
  }
  return shifts;
}

/**
 * Count how many periods are ruled by the specified planets
 */
function countPlanetPeriods(timeline, planets) {
  const planetSet = new Set(planets.map(p => p.toLowerCase()));
  return timeline.filter(period => {
    const planet = (period.planet || '').toLowerCase();
    return planetSet.has(planet);
  }).length;
}

/**
 * Build a comparison diff between two relationships' evolution timelines
 */
export function buildArchetypeEvolutionDiff(relA, relB) {
  const timelineA = relA?.timeline || relA?.evolutionTimeline || [];
  const timelineB = relB?.timeline || relB?.evolutionTimeline || [];

  const timelineComparison = [];
  const archetypeShifts = [];
  const karmicRhythm = [];
  const growthContrast = [];
  const shadowContrast = [];

  // Compare each period (aligned comparison)
  const minLen = Math.min(timelineA.length, timelineB.length);
  for (let i = 0; i < minLen; i++) {
    const pA = timelineA[i];
    const pB = timelineB[i];

    const archA = pA?.archetype || 'Unknown';
    const archB = pB?.archetype || 'Unknown';

    if (archA !== archB) {
      const start = pA?.start || '';
      const end = pA?.end || '';
      timelineComparison.push(
        `From ${start} to ${end}, Relationship A expresses '${archA}', while Relationship B expresses '${archB}'.`
      );
    }
  }

  // Detect and describe archetype shifts
  const shiftsA = detectArchetypeShifts(timelineA);
  const shiftsB = detectArchetypeShifts(timelineB);

  for (const shift of shiftsA) {
    const key = `${shift.from}->${shift.to}`;
    const narrative = ARCHETYPE_SHIFT_NARRATIVES[key];
    if (narrative) {
      archetypeShifts.push(`Relationship A ${narrative}`);
    } else {
      archetypeShifts.push(
        `Relationship A shifts from '${shift.from}' to '${shift.to}' around ${shift.start}.`
      );
    }
  }

  for (const shift of shiftsB) {
    const key = `${shift.from}->${shift.to}`;
    const narrative = ARCHETYPE_SHIFT_NARRATIVES[key];
    if (narrative) {
      archetypeShifts.push(`Relationship B ${narrative}`);
    } else {
      archetypeShifts.push(
        `Relationship B shifts from '${shift.from}' to '${shift.to}' around ${shift.start}.`
      );
    }
  }

  // Karmic rhythm comparison (Saturn/Ketu/Rahu)
  const karmicPlanets = ['Saturn', 'Shani', 'Ketu', 'Rahu'];
  const karmicA = countPlanetPeriods(timelineA, karmicPlanets);
  const karmicB = countPlanetPeriods(timelineB, karmicPlanets);

  if (karmicA > karmicB) {
    karmicRhythm.push(
      'Relationship A has a deeper karmic purification arc with more Saturn/Ketu/Rahu periods.'
    );
  } else if (karmicB > karmicA) {
    karmicRhythm.push(
      'Relationship B has a deeper karmic purification arc with more Saturn/Ketu/Rahu periods.'
    );
  } else {
    karmicRhythm.push(
      'Both relationships have similar karmic rhythm and purification phases.'
    );
  }

  // Growth period comparison (Jupiter/Venus)
  const growthPlanets = ['Jupiter', 'Guru', 'Venus', 'Shukra'];
  const growthA = countPlanetPeriods(timelineA, growthPlanets);
  const growthB = countPlanetPeriods(timelineB, growthPlanets);

  if (growthA > growthB) {
    growthContrast.push(
      'Relationship A experiences more harmonious and expansive periods (Jupiter/Venus).'
    );
  } else if (growthB > growthA) {
    growthContrast.push(
      'Relationship B experiences more harmonious and expansive periods (Jupiter/Venus).'
    );
  } else {
    growthContrast.push(
      'Both relationships have equal growth and expansion periods.'
    );
  }

  // Shadow period comparison (Saturn/Mars/Rahu)
  const shadowPlanets = ['Saturn', 'Shani', 'Mars', 'Mangala', 'Rahu'];
  const shadowA = countPlanetPeriods(timelineA, shadowPlanets);
  const shadowB = countPlanetPeriods(timelineB, shadowPlanets);

  if (shadowA > shadowB) {
    shadowContrast.push(
      'Relationship A encounters more intense or challenging phases (Saturn/Mars/Rahu).'
    );
  } else if (shadowB > shadowA) {
    shadowContrast.push(
      'Relationship B encounters more intense or challenging phases (Saturn/Mars/Rahu).'
    );
  } else {
    shadowContrast.push(
      'Both relationships have similar intensity and shadow periods.'
    );
  }

  // Build summary
  const summaryParts = [];
  if (timelineComparison.length) summaryParts.push(timelineComparison[0]);
  if (archetypeShifts.length) summaryParts.push(archetypeShifts[0]);
  if (karmicRhythm.length) summaryParts.push(karmicRhythm[0]);

  const summary = summaryParts.length
    ? summaryParts.join(' ')
    : 'Both relationships follow similar evolutionary arcs.';

  return {
    summary,
    timelineComparison,
    archetypeShifts,
    karmicRhythm,
    growthContrast,
    shadowContrast,
    periodCounts: {
      relationshipA: {
        karmic: karmicA,
        growth: growthA,
        shadow: shadowA,
        total: timelineA.length
      },
      relationshipB: {
        karmic: karmicB,
        growth: growthB,
        shadow: shadowB,
        total: timelineB.length
      }
    }
  };
}

// ============================================================================
// COMPOSITE ARCHETYPE FORECAST
// Predicting future archetype based on Mahadasha (50%), Transits (30%),
// and Polarity Geometry (20%)
// ============================================================================

// Planet-to-archetype influence weights
const PLANET_ARCHETYPE_INFLUENCE = {
  Venus: {
    'The Passion Axis': 0.9,
    'The Harmonious Twins': 0.7,
    'The Earth-Water Foundation': 0.5,
    'The Sacred Counterweights': 0.4
  },
  Shukra: {
    'The Passion Axis': 0.9,
    'The Harmonious Twins': 0.7,
    'The Earth-Water Foundation': 0.5,
    'The Sacred Counterweights': 0.4
  },
  Mars: {
    'The Magnetic Opposites': 0.9,
    'The Fire-Air Circuit': 0.7,
    'The Creative Disruptors': 0.6,
    'The Passion Axis': 0.5
  },
  Mangala: {
    'The Magnetic Opposites': 0.9,
    'The Fire-Air Circuit': 0.7,
    'The Creative Disruptors': 0.6,
    'The Passion Axis': 0.5
  },
  Jupiter: {
    'The Dharma Companions': 0.9,
    'The Spiritual Counterparts': 0.8,
    'The Harmonious Twins': 0.5,
    'The Sacred Counterweights': 0.4
  },
  Guru: {
    'The Dharma Companions': 0.9,
    'The Spiritual Counterparts': 0.8,
    'The Harmonious Twins': 0.5,
    'The Sacred Counterweights': 0.4
  },
  Saturn: {
    'The Transformational Pair': 0.9,
    'The Karmic Mirrors': 0.8,
    'The Parallel Travelers': 0.5,
    'The Earth-Water Foundation': 0.4
  },
  Shani: {
    'The Transformational Pair': 0.9,
    'The Karmic Mirrors': 0.8,
    'The Parallel Travelers': 0.5,
    'The Earth-Water Foundation': 0.4
  },
  Mercury: {
    'The Creative Disruptors': 0.8,
    'The Fire-Air Circuit': 0.7,
    'The Parallel Travelers': 0.5,
    'The Balanced Polarity Pair': 0.4
  },
  Budha: {
    'The Creative Disruptors': 0.8,
    'The Fire-Air Circuit': 0.7,
    'The Parallel Travelers': 0.5,
    'The Balanced Polarity Pair': 0.4
  },
  Rahu: {
    'The Creative Disruptors': 0.9,
    'The Magnetic Opposites': 0.7,
    'The Karmic Mirrors': 0.6,
    'The Transformational Pair': 0.5
  },
  Ketu: {
    'The Spiritual Counterparts': 0.9,
    'The Karmic Mirrors': 0.8,
    'The Transformational Pair': 0.6,
    'The Dharma Companions': 0.4
  },
  Moon: {
    'The Earth-Water Foundation': 0.9,
    'The Harmonious Twins': 0.7,
    'The Passion Axis': 0.5,
    'The Sacred Counterweights': 0.4
  },
  Chandra: {
    'The Earth-Water Foundation': 0.9,
    'The Harmonious Twins': 0.7,
    'The Passion Axis': 0.5,
    'The Sacred Counterweights': 0.4
  },
  Sun: {
    'The Dharma Companions': 0.8,
    'The Fire-Air Circuit': 0.7,
    'The Magnetic Opposites': 0.5,
    'The Parallel Travelers': 0.4
  },
  Surya: {
    'The Dharma Companions': 0.8,
    'The Fire-Air Circuit': 0.7,
    'The Magnetic Opposites': 0.5,
    'The Parallel Travelers': 0.4
  }
};

// Transit-to-archetype modifiers
const TRANSIT_ARCHETYPE_MODIFIERS = {
  'Jupiter conjunct Venus': {
    'The Passion Axis': 0.3,
    'The Harmonious Twins': 0.2,
    'The Dharma Companions': 0.2
  },
  'Saturn conjunct Moon': {
    'The Transformational Pair': 0.3,
    'The Karmic Mirrors': 0.2,
    'The Earth-Water Foundation': 0.1
  },
  'Mars conjunct Venus': {
    'The Passion Axis': 0.4,
    'The Magnetic Opposites': 0.2,
    'The Fire-Air Circuit': 0.1
  },
  'Jupiter trine Sun': {
    'The Dharma Companions': 0.3,
    'The Fire-Air Circuit': 0.2,
    'The Spiritual Counterparts': 0.1
  },
  'Saturn square Mars': {
    'The Transformational Pair': 0.3,
    'The Magnetic Opposites': 0.2,
    'The Karmic Mirrors': 0.2
  },
  'Rahu conjunct Ascendant': {
    'The Creative Disruptors': 0.3,
    'The Karmic Mirrors': 0.2,
    'The Magnetic Opposites': 0.1
  },
  'Ketu conjunct Moon': {
    'The Spiritual Counterparts': 0.3,
    'The Karmic Mirrors': 0.2,
    'The Transformational Pair': 0.1
  },
  'Venus trine Jupiter': {
    'The Passion Axis': 0.2,
    'The Harmonious Twins': 0.2,
    'The Dharma Companions': 0.2
  },
  'Mercury conjunct Venus': {
    'The Creative Disruptors': 0.2,
    'The Parallel Travelers': 0.2,
    'The Fire-Air Circuit': 0.1
  },
  'Sun trine Moon': {
    'The Harmonious Twins': 0.3,
    'The Sacred Counterweights': 0.2,
    'The Balanced Polarity Pair': 0.1
  }
};

// Polarity geometry resonance with archetypes
const POLARITY_ARCHETYPE_RESONANCE = {
  high_guna_contrast: {
    'The Magnetic Opposites': 0.2,
    'The Karmic Mirrors': 0.15,
    'The Transformational Pair': 0.1
  },
  low_guna_contrast: {
    'The Harmonious Twins': 0.2,
    'The Parallel Travelers': 0.15,
    'The Balanced Polarity Pair': 0.1
  },
  fire_dominant: {
    'The Fire-Air Circuit': 0.2,
    'The Passion Axis': 0.15,
    'The Magnetic Opposites': 0.1
  },
  earth_dominant: {
    'The Earth-Water Foundation': 0.2,
    'The Parallel Travelers': 0.15,
    'The Sacred Counterweights': 0.1
  },
  water_dominant: {
    'The Earth-Water Foundation': 0.2,
    'The Passion Axis': 0.15,
    'The Transformational Pair': 0.1
  },
  air_dominant: {
    'The Fire-Air Circuit': 0.2,
    'The Creative Disruptors': 0.15,
    'The Parallel Travelers': 0.1
  },
  yang_dominant: {
    'The Fire-Air Circuit': 0.15,
    'The Magnetic Opposites': 0.15,
    'The Dharma Companions': 0.1
  },
  yin_dominant: {
    'The Earth-Water Foundation': 0.15,
    'The Harmonious Twins': 0.15,
    'The Passion Axis': 0.1
  },
  balanced_polarity: {
    'The Sacred Counterweights': 0.2,
    'The Balanced Polarity Pair': 0.15,
    'The Harmonious Twins': 0.1
  }
};

// Forecast narrative templates
const FORECAST_NARRATIVES = {
  'The Magnetic Opposites': 'The relationship is entering a phase of dynamic polarity — expect heightened attraction and creative tension. The opposite energies are activating, drawing you together through contrast.',
  'The Harmonious Twins': 'A period of natural resonance is emerging. The relationship will flow more effortlessly, with shared understanding and mutual attunement becoming the dominant theme.',
  'The Fire-Air Circuit': 'Creative inspiration and dynamic exchange are on the horizon. This is a time for bold ideas, passionate communication, and shared adventures.',
  'The Earth-Water Foundation': 'The relationship is moving toward deeper nurturing and practical stability. Emotional security and grounded connection will strengthen.',
  'The Passion Axis': 'Romantic and sensual energies are intensifying. This forecast period favors intimacy, creative collaboration, and heart-centered connection.',
  'The Dharma Companions': 'Shared purpose is coming into focus. The relationship will be defined by aligned values, spiritual growth, and meaningful collaboration.',
  'The Transformational Pair': 'Deep transformation is ahead. This period brings intensity, karmic lessons, and the potential for profound mutual evolution.',
  'The Karmic Mirrors': 'The relationship enters a reflective phase where each partner mirrors the other\'s growth edges. Honest self-examination strengthens the bond.',
  'The Spiritual Counterparts': 'Transcendent connection is activating. Expect deepening spiritual intimacy and a sense of shared higher purpose.',
  'The Creative Disruptors': 'Innovation and unconventional expression are emerging. This is a time to break patterns and experiment with new relational dynamics.',
  'The Parallel Travelers': 'Comfortable companionship defines this period. The relationship supports individual growth while maintaining steady connection.',
  'The Sacred Counterweights': 'Balance through conscious navigation is the theme. Each partner\'s unique qualities help stabilize and complement the other.',
  'The Balanced Polarity Pair': 'Equilibrium and measured harmony are forecast. The relationship maintains stability through mutual respect and proportional exchange.'
};

/**
 * Get the next (upcoming or current) Mahadasha period from relationship data
 */
function getNextMahadasha(relationship) {
  // Try multiple keys for dasha data
  const dashas = (
    relationship?.mahadashas ||
    relationship?.mahadasas ||
    relationship?.dashas ||
    relationship?.vimshottari_mahadasha ||
    []
  );

  if (!dashas.length) return null;

  const now = new Date();

  for (const dasha of dashas) {
    const startStr = dasha.start || dasha.startDate || '';
    const endStr = dasha.end || dasha.endDate || '';

    try {
      const end = new Date(endStr);
      // If currently in this dasha or it's upcoming
      if (end > now) {
        return dasha;
      }
    } catch {
      continue;
    }
  }

  return dashas[0] || null;
}

/**
 * Extract polarity geometry traits from the polarity map
 */
function getPolarityGeometry(polarityMap) {
  const traits = [];
  const axes = polarityMap?.axes || [];

  // Check Guna contrast
  const gunaAxis = axes.find(a => a.name === 'Guna');
  if (gunaAxis) {
    const contrast = gunaAxis.contrast || 0;
    if (contrast > 0.6) {
      traits.push('high_guna_contrast');
    } else if (contrast < 0.3) {
      traits.push('low_guna_contrast');
    }
  }

  // Check element dominance
  const elementAxis = axes.find(a => a.name === 'Element');
  if (elementAxis) {
    const dominant = elementAxis.dominant || '';
    if (dominant.includes('Fire')) {
      traits.push('fire_dominant');
    } else if (dominant.includes('Earth')) {
      traits.push('earth_dominant');
    } else if (dominant.includes('Water')) {
      traits.push('water_dominant');
    } else if (dominant.includes('Air')) {
      traits.push('air_dominant');
    }
  }

  // Check Yin/Yang balance
  const yinyangAxis = axes.find(a => a.name === 'Yin/Yang');
  if (yinyangAxis) {
    const balance = yinyangAxis.balance ?? 0.5;
    if (balance > 0.65) {
      traits.push('yang_dominant');
    } else if (balance < 0.35) {
      traits.push('yin_dominant');
    } else {
      traits.push('balanced_polarity');
    }
  }

  if (!traits.length) {
    traits.push('balanced_polarity');
  }

  return traits;
}

/**
 * Forecast the relationship's future archetype based on:
 * - Upcoming Mahadasha (50% weight)
 * - Major transits (30% weight)
 * - Composite polarity geometry (20% weight)
 *
 * @param {Object} relationship - Relationship data with dasha information
 * @param {string[]} transits - Array of active transit strings (e.g., ['Jupiter conjunct Venus'])
 * @param {Object} polarityMap - The polarity map from buildPolarityMap()
 * @returns {Object} Forecast with predicted archetype, confidence, and narrative
 */
export function forecastCompositeArchetype(relationship, transits = [], polarityMap = {}) {
  // Initialize archetype scores
  const archetypeScores = {};
  for (const arch of Object.keys(ARCHETYPE_DESCRIPTIONS)) {
    archetypeScores[arch] = 0;
  }

  // ========================================
  // 1. Mahadasha Influence (50% weight)
  // ========================================
  const nextDasha = getNextMahadasha(relationship);
  let dashaPlanet = null;
  const dashaContribution = {};

  if (nextDasha) {
    dashaPlanet = (
      nextDasha.planet ||
      nextDasha.lord ||
      nextDasha.ruler ||
      ''
    );

    // Normalize planet name
    if (dashaPlanet) {
      dashaPlanet = dashaPlanet.trim();
      dashaPlanet = dashaPlanet.charAt(0).toUpperCase() + dashaPlanet.slice(1).toLowerCase();

      // Get planet's archetype influences
      const planetInfluences = PLANET_ARCHETYPE_INFLUENCE[dashaPlanet] || {};

      for (const [archetype, weight] of Object.entries(planetInfluences)) {
        const contribution = weight * 0.5; // 50% weight
        archetypeScores[archetype] = (archetypeScores[archetype] || 0) + contribution;
        dashaContribution[archetype] = contribution;
      }
    }
  }

  // ========================================
  // 2. Transit Influence (30% weight)
  // ========================================
  const transitContribution = {};

  for (const transit of transits) {
    const transitModifiers = TRANSIT_ARCHETYPE_MODIFIERS[transit] || {};

    for (const [archetype, modifier] of Object.entries(transitModifiers)) {
      const contribution = modifier * 0.3; // 30% weight
      archetypeScores[archetype] = (archetypeScores[archetype] || 0) + contribution;
      transitContribution[archetype] = (transitContribution[archetype] || 0) + contribution;
    }
  }

  // ========================================
  // 3. Polarity Geometry (20% weight)
  // ========================================
  const geometryTraits = getPolarityGeometry(polarityMap);
  const geometryContribution = {};

  for (const trait of geometryTraits) {
    const resonance = POLARITY_ARCHETYPE_RESONANCE[trait] || {};

    for (const [archetype, weight] of Object.entries(resonance)) {
      const contribution = weight * 0.2; // 20% weight
      archetypeScores[archetype] = (archetypeScores[archetype] || 0) + contribution;
      geometryContribution[archetype] = (geometryContribution[archetype] || 0) + contribution;
    }
  }

  // ========================================
  // 4. Determine Winner
  // ========================================
  const sortedArchetypes = Object.entries(archetypeScores)
    .sort((a, b) => b[1] - a[1]);

  const forecastArchetype = sortedArchetypes[0]?.[0] || 'The Balanced Polarity Pair';
  const forecastScore = sortedArchetypes[0]?.[1] || 0;

  // Calculate confidence (normalize to 0-100)
  const maxPossibleScore = 0.5 + 0.3 + 0.2; // Maximum if all factors align perfectly
  const confidence = Math.min(100, Math.round((forecastScore / maxPossibleScore) * 100));

  // Get archetype details
  const archetypeData = ARCHETYPE_DESCRIPTIONS[forecastArchetype] || {};

  // Get runner-up for comparison
  const runnerUp = sortedArchetypes[1]?.[0] || null;
  const runnerUpScore = sortedArchetypes[1]?.[1] || 0;

  // Build contribution breakdown
  const contributions = {
    mahadasha: {
      planet: dashaPlanet,
      weight: '50%',
      contributions: dashaContribution
    },
    transits: {
      active: transits,
      weight: '30%',
      contributions: transitContribution
    },
    polarityGeometry: {
      traits: geometryTraits,
      weight: '20%',
      contributions: geometryContribution
    }
  };

  // Build top 5 scores for display
  const allScores = {};
  for (let i = 0; i < Math.min(5, sortedArchetypes.length); i++) {
    const [arch, score] = sortedArchetypes[i];
    allScores[arch] = Math.round(score * 1000) / 1000;
  }

  return {
    forecastArchetype,
    archetypeIcon: archetypeData.icon || '🎯',
    archetypeDescription: archetypeData.description || '',
    archetypeKeywords: archetypeData.keywords || [],
    confidence,
    narrative: FORECAST_NARRATIVES[forecastArchetype] || '',
    runnerUp: runnerUp ? {
      archetype: runnerUp,
      score: Math.round(runnerUpScore * 1000) / 1000
    } : null,
    contributions,
    allScores
  };
}

// ============================================================================
// COMPOSITE ARCHETYPE FORECAST TIMELINE
// Multi-chapter mythic future across the next 3 Mahadashas
// ============================================================================

// Chapter narrative templates
const CHAPTER_NARRATIVES = {
  'The Magnetic Opposites': 'A chapter of dynamic polarity — attraction through difference activates creative tension and passionate engagement.',
  'The Harmonious Twins': 'A chapter of natural resonance — the relationship flows with shared understanding and effortless attunement.',
  'The Fire-Air Circuit': 'A chapter of inspiration and movement — bold ideas, passionate communication, and creative synergy define this period.',
  'The Earth-Water Foundation': 'A chapter of nurturing stability — emotional security deepens as practical foundations strengthen.',
  'The Passion Axis': 'A chapter of romantic intensity — intimacy, desire, and heart-centered connection become the central themes.',
  'The Dharma Companions': 'A chapter of aligned purpose — shared mission, spiritual growth, and meaningful collaboration unfold.',
  'The Transformational Pair': 'A chapter of deep transformation — intensity, karmic lessons, and profound mutual evolution are activated.',
  'The Karmic Mirrors': 'A chapter of reflection — partners mirror each other\'s growth edges, teaching through honest confrontation.',
  'The Spiritual Counterparts': 'A chapter of transcendence — spiritual intimacy deepens and a sense of shared higher purpose emerges.',
  'The Creative Disruptors': 'A chapter of innovation — breaking patterns, experimenting with new dynamics, and embracing change.',
  'The Parallel Travelers': 'A chapter of steady companionship — individual growth is supported while maintaining reliable connection.',
  'The Sacred Counterweights': 'A chapter of conscious balance — each partner\'s unique qualities stabilize and complete the other.',
  'The Balanced Polarity Pair': 'A chapter of measured harmony — stability through mutual respect and proportional exchange.',
  'The Stabilizer-Visionary Pair': 'A chapter of complementary roles — imagination meets practicality as vision meets execution.'
};

/**
 * Get the next N upcoming Mahadasha periods
 */
function getUpcomingMahadashas(relationship, count = 3) {
  // Try multiple keys for dasha data
  let dashas = (
    relationship?.mahadashas ||
    relationship?.mahadasas ||
    relationship?.dashas ||
    relationship?.vimshottari_mahadasha ||
    []
  );

  // Handle nested structure
  if (dashas && typeof dashas === 'object' && !Array.isArray(dashas)) {
    dashas = dashas.mahadashas || dashas.mahadasas || [];
  }

  if (!Array.isArray(dashas) || !dashas.length) return [];

  const now = new Date();
  const upcoming = [];

  for (const dasha of dashas) {
    const endStr = dasha.end || dasha.endDate || '';

    try {
      const end = new Date(endStr);
      if (end > now) {
        upcoming.push(dasha);
        if (upcoming.length >= count) break;
      }
    } catch {
      continue;
    }
  }

  // If not enough upcoming, take from beginning
  if (upcoming.length < count && dashas.length) {
    for (const dasha of dashas) {
      if (!upcoming.includes(dasha)) {
        upcoming.push(dasha);
        if (upcoming.length >= count) break;
      }
    }
  }

  return upcoming.slice(0, count);
}

/**
 * Score all archetypes for a given Mahadasha period
 */
function scoreArchetypeForPeriod(planet, polarityMap, transits = []) {
  const scores = {};
  for (const arch of Object.keys(ARCHETYPE_DESCRIPTIONS)) {
    scores[arch] = 0;
  }

  // 1. Mahadasha influence (50%)
  const planetNormalized = planet?.trim();
  const planetKey = planetNormalized?.charAt(0).toUpperCase() + planetNormalized?.slice(1).toLowerCase();
  const planetInfluences = PLANET_ARCHETYPE_INFLUENCE[planetKey] || {};

  for (const [archetype, weight] of Object.entries(planetInfluences)) {
    scores[archetype] = (scores[archetype] || 0) + weight * 0.5;
  }

  // 2. Transit influence (30%)
  for (const transit of transits) {
    const transitModifiers = TRANSIT_ARCHETYPE_MODIFIERS[transit] || {};
    for (const [archetype, modifier] of Object.entries(transitModifiers)) {
      scores[archetype] = (scores[archetype] || 0) + modifier * 0.3;
    }
  }

  // 3. Polarity geometry resonance (20%)
  const geometryTraits = getPolarityGeometry(polarityMap);
  for (const trait of geometryTraits) {
    const resonance = POLARITY_ARCHETYPE_RESONANCE[trait] || {};
    for (const [archetype, weight] of Object.entries(resonance)) {
      scores[archetype] = (scores[archetype] || 0) + weight * 0.2;
    }
  }

  return scores;
}

/**
 * Build mythic arc summary across all chapters
 */
function buildMythicArcSummary(timeline) {
  if (!timeline || !timeline.length) return null;

  const archetypes = timeline.map(t => t.archetype || '');
  const planets = timeline.map(t => t.planet || '');

  // Detect arc patterns
  const arcThemes = [];

  // Check for transformation arc
  const transformationArchetypes = new Set(['The Transformational Pair', 'The Karmic Mirrors', 'The Spiritual Counterparts']);
  if (archetypes.some(a => transformationArchetypes.has(a))) {
    arcThemes.push('karmic transformation');
  }

  // Check for passion arc
  const passionArchetypes = new Set(['The Passion Axis', 'The Magnetic Opposites']);
  if (archetypes.some(a => passionArchetypes.has(a))) {
    arcThemes.push('romantic intensity');
  }

  // Check for stability arc
  const stabilityArchetypes = new Set(['The Earth-Water Foundation', 'The Parallel Travelers', 'The Sacred Counterweights']);
  if (archetypes.some(a => stabilityArchetypes.has(a))) {
    arcThemes.push('grounded stability');
  }

  // Check for growth arc
  const growthArchetypes = new Set(['The Dharma Companions', 'The Harmonious Twins']);
  if (archetypes.some(a => growthArchetypes.has(a))) {
    arcThemes.push('spiritual growth');
  }

  // Check for creative arc
  const creativeArchetypes = new Set(['The Fire-Air Circuit', 'The Creative Disruptors']);
  if (archetypes.some(a => creativeArchetypes.has(a))) {
    arcThemes.push('creative evolution');
  }

  // Build arc narrative
  let arcNarrative;
  if (archetypes.length >= 3) {
    arcNarrative = `The relationship journeys from '${archetypes[0]}' through '${archetypes[1]}' toward '${archetypes[2]}'. This mythic arc weaves themes of ${arcThemes.length ? arcThemes.join(', ') : 'growth and evolution'}.`;
  } else if (archetypes.length === 2) {
    arcNarrative = `The relationship transitions from '${archetypes[0]}' to '${archetypes[1]}'. This arc emphasizes ${arcThemes.length ? arcThemes.join(', ') : 'relational evolution'}.`;
  } else {
    arcNarrative = `The current chapter is defined by '${archetypes[0]}'.`;
  }

  // Calculate overall intensity
  const totalConfidence = timeline.reduce((sum, t) => sum + (t.confidence || 0), 0);
  const avgConfidence = timeline.length ? totalConfidence / timeline.length : 0;

  return {
    arcNarrative,
    arcThemes,
    planetarySequence: planets,
    archetypeSequence: archetypes,
    averageConfidence: Math.round(avgConfidence * 10) / 10
  };
}

/**
 * Build the Composite Archetype Forecast Timeline
 * Predicts the next N archetypes across upcoming Mahadasha periods
 *
 * @param {Object} relationship - Relationship data with dasha information
 * @param {string[]} transits - Array of active transit strings
 * @param {Object} polarityMap - The polarity map from buildPolarityMap()
 * @param {number} count - Number of chapters to forecast (default 3)
 * @returns {Object} Timeline with chapters and arc summary
 */
export function buildCompositeArchetypeForecastTimeline(relationship, transits = [], polarityMap = {}, count = 3) {
  const timeline = [];
  const upcomingDashas = getUpcomingMahadashas(relationship, count);

  for (let idx = 0; idx < upcomingDashas.length; idx++) {
    const dasha = upcomingDashas[idx];
    const planet = dasha.planet || dasha.lord || dasha.ruler || '';
    const start = dasha.start || dasha.startDate || '';
    const end = dasha.end || dasha.endDate || '';

    if (!planet) continue;

    // Normalize planet name
    const planetNormalized = planet.trim();
    const planetKey = planetNormalized.charAt(0).toUpperCase() + planetNormalized.slice(1).toLowerCase();

    // Score all archetypes for this period
    const scores = scoreArchetypeForPeriod(planetKey, polarityMap, transits);

    // Find winning archetype
    const sortedArchetypes = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const forecastArchetype = sortedArchetypes[0]?.[0] || 'The Balanced Polarity Pair';
    const forecastScore = sortedArchetypes[0]?.[1] || 0;

    // Calculate confidence
    const maxPossible = 0.5 + 0.3 + 0.2;
    const confidence = Math.min(100, Math.round((forecastScore / maxPossible) * 100));

    // Get archetype details
    const archetypeData = ARCHETYPE_DESCRIPTIONS[forecastArchetype] || {};

    // Get planet-specific themes
    const growth = PLANET_GROWTH_THEMES[planetKey] || 'Growth through relational awareness.';
    const shadow = PLANET_SHADOW_THEMES[planetKey] || 'Shadow patterns requiring conscious navigation.';
    const planetIcon = PLANET_ICONS[planetKey] || '🪐';

    // Get chapter narrative
    const chapterNarrative = CHAPTER_NARRATIVES[forecastArchetype] || FORECAST_NARRATIVES[forecastArchetype] || '';

    // Build score breakdown for top 5
    const scoreBreakdown = {};
    for (let i = 0; i < Math.min(5, sortedArchetypes.length); i++) {
      const [arch, score] = sortedArchetypes[i];
      scoreBreakdown[arch] = Math.round(score * 1000) / 1000;
    }

    // Determine chapter phase
    let phase, phaseIcon;
    if (idx === 0) {
      phase = 'Current/Emerging';
      phaseIcon = '🌅';
    } else if (idx === 1) {
      phase = 'Middle Chapter';
      phaseIcon = '🌞';
    } else {
      phase = 'Distant Future';
      phaseIcon = '🌙';
    }

    timeline.push({
      chapterNumber: idx + 1,
      phase,
      phaseIcon,
      planet: planetKey,
      planetIcon,
      start,
      end,
      archetype: forecastArchetype,
      archetypeIcon: archetypeData.icon || '🎯',
      archetypeDescription: archetypeData.description || '',
      archetypeKeywords: archetypeData.keywords || [],
      chapterNarrative,
      growth,
      shadow,
      confidence,
      scoreBreakdown
    });
  }

  // Build mythic arc summary
  const arcSummary = timeline.length >= 2 ? buildMythicArcSummary(timeline) : null;

  return {
    timeline,
    arcSummary,
    totalChapters: timeline.length
  };
}
