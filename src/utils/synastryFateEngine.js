/**
 * Synastry Fate Engine
 *
 * Based on Liz Greene's "Relating" and "The Astrology of Fate" —
 * comprehensive fate analysis for relationship synastry.
 *
 * This engine produces:
 * - Fated Axis Interlocks (nodal connections)
 * - Projection Loops (Saturn projections between charts)
 * - Karmic Contracts (what this relationship is here to teach)
 * - Relationship Crossroads (timing for the pair)
 * - Synastry Fate vs Choice Index
 * - Relationship Archetype Assignment
 *
 * GENESIS AstroProfile - January 2026
 */

import { buildFateThreads } from './fateThreads';
import { assignArchetype } from './fateArchetypes';
import { detectCrossroads } from './fateCrossroads';
import { computeFateChoiceIndex } from './fateChoiceIndex';

// ═══════════════════════════════════════════════════════════════════════════
// FATED AXIS INTERLOCKS
// When one person's nodes connect to another's personal planets
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fated axis interlock interpretations
 */
const AXIS_INTERLOCKS = {
  // Person A's North Node conjunct Person B's planets
  'NorthNode-Sun': {
    type: 'destiny_activation',
    intensity: 'high',
    meaning: "A feels destined to support B's identity development",
    karmicLesson: "Learning to encourage authentic self-expression",
    gift: "Soul recognition and mutual growth toward purpose"
  },
  'NorthNode-Moon': {
    type: 'destiny_activation',
    intensity: 'high',
    meaning: "A feels emotionally called toward B",
    karmicLesson: "Learning emotional authenticity through connection",
    gift: "Deep emotional nourishment and soul comfort"
  },
  'NorthNode-Venus': {
    type: 'destiny_activation',
    intensity: 'very_high',
    meaning: "A feels fated love connection with B",
    karmicLesson: "Learning to love in alignment with destiny",
    gift: "Love that supports soul growth"
  },
  'NorthNode-Mars': {
    type: 'destiny_activation',
    intensity: 'high',
    meaning: "A is activated toward destiny by B's energy",
    karmicLesson: "Learning courageous action through partnership",
    gift: "Motivation toward purpose"
  },
  'NorthNode-Saturn': {
    type: 'destiny_contract',
    intensity: 'very_high',
    meaning: "A and B have serious karmic business together",
    karmicLesson: "Learning responsibility and commitment",
    gift: "Lasting bond built on mutual respect"
  },

  // Person A's South Node conjunct Person B's planets
  'SouthNode-Sun': {
    type: 'past_life_recognition',
    intensity: 'high',
    meaning: "A recognizes B from past — feels familiar but may limit growth",
    karmicLesson: "Releasing old patterns of relating",
    warning: "May feel comfortable but keep you stuck"
  },
  'SouthNode-Moon': {
    type: 'past_life_recognition',
    intensity: 'high',
    meaning: "Deep emotional familiarity — possibly too comfortable",
    karmicLesson: "Growing beyond emotional patterns from the past",
    warning: "May recreate old family dynamics"
  },
  'SouthNode-Venus': {
    type: 'past_life_recognition',
    intensity: 'very_high',
    meaning: "Love from another life — powerful but potentially regressive",
    karmicLesson: "Loving in new ways rather than old patterns",
    warning: "May feel like 'coming home' but prevent growth"
  },
  'SouthNode-Saturn': {
    type: 'karmic_debt',
    intensity: 'very_high',
    meaning: "Serious karmic debt or unfinished business",
    karmicLesson: "Resolving what was left incomplete",
    warning: "May feel obligated or unable to leave"
  }
};

/**
 * Build fated axis interlocks from synastry aspects
 *
 * @param {Array} aspects - Synastry aspects array
 * @returns {Array} Fated axis interlocks
 */
export function buildSynastryFateThreads(aspects) {
  if (!aspects || !Array.isArray(aspects)) return [];

  const interlocks = [];

  for (const aspect of aspects) {
    const p1 = (aspect.p1 || aspect.planet1 || '').toLowerCase();
    const p2 = (aspect.p2 || aspect.planet2 || '').toLowerCase();
    const type = (aspect.type || aspect.aspectType || '').toLowerCase();
    const orb = aspect.orb;

    // Check for nodal contacts (conjunction or opposition are most significant)
    const isNodeAspect = type === 'conjunction' || type === 'opposition';
    if (!isNodeAspect) continue;

    // Check for North Node contacts
    if (p1.includes('north') || p1.includes('rahu')) {
      const key = `NorthNode-${capitalizeFirst(p2)}`;
      const interlock = AXIS_INTERLOCKS[key];
      if (interlock) {
        interlocks.push({
          aspect: `${aspect.p1 || aspect.planet1}-${aspect.p2 || aspect.planet2}`,
          aspectType: type,
          orb,
          direction: 'A_to_B',
          ...interlock
        });
      }
    }

    // Check for South Node contacts
    if (p1.includes('south') || p1.includes('ketu')) {
      const key = `SouthNode-${capitalizeFirst(p2)}`;
      const interlock = AXIS_INTERLOCKS[key];
      if (interlock) {
        interlocks.push({
          aspect: `${aspect.p1 || aspect.planet1}-${aspect.p2 || aspect.planet2}`,
          aspectType: type,
          orb,
          direction: 'A_to_B',
          ...interlock
        });
      }
    }

    // Check reverse (B's node to A's planet)
    if (p2.includes('north') || p2.includes('rahu')) {
      const key = `NorthNode-${capitalizeFirst(p1)}`;
      const interlock = AXIS_INTERLOCKS[key];
      if (interlock) {
        interlocks.push({
          aspect: `${aspect.p2 || aspect.planet2}-${aspect.p1 || aspect.planet1}`,
          aspectType: type,
          orb,
          direction: 'B_to_A',
          ...interlock
        });
      }
    }

    if (p2.includes('south') || p2.includes('ketu')) {
      const key = `SouthNode-${capitalizeFirst(p1)}`;
      const interlock = AXIS_INTERLOCKS[key];
      if (interlock) {
        interlocks.push({
          aspect: `${aspect.p2 || aspect.planet2}-${aspect.p1 || aspect.planet1}`,
          aspectType: type,
          orb,
          direction: 'B_to_A',
          ...interlock
        });
      }
    }
  }

  return interlocks;
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECTION LOOPS
// Saturn projections between charts
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Saturn projection interpretations
 */
const SATURN_PROJECTIONS = {
  'Saturn-Sun': {
    projection: "One partner projects authority/father figure onto the other",
    dynamic: "Teacher-student or parent-child undertone",
    challenge: "Feeling judged, restricted, or not good enough",
    gift: "Learning authentic self-expression through challenge",
    healingPath: "Mutual respect without hierarchy"
  },
  'Saturn-Moon': {
    projection: "One partner projects emotional withholding onto the other",
    dynamic: "Emotional caretaker or emotional restriction",
    challenge: "Feeling emotionally unsupported or smothered",
    gift: "Learning emotional self-sufficiency",
    healingPath: "Expressing needs clearly and directly"
  },
  'Saturn-Venus': {
    projection: "One partner projects love conditions onto the other",
    dynamic: "Love must be earned or deserved",
    challenge: "Feeling unlovable or that love is conditional",
    gift: "Learning lasting, committed love",
    healingPath: "Expressing love without conditions"
  },
  'Saturn-Mars': {
    projection: "One partner projects aggression control onto the other",
    dynamic: "Suppressed anger or controlled action",
    challenge: "Feeling blocked, frustrated, or unable to act",
    gift: "Learning strategic, patient action",
    healingPath: "Healthy conflict and direct assertion"
  },
  'Saturn-Mercury': {
    projection: "One partner projects communication blocks onto the other",
    dynamic: "Feeling silenced or misunderstood",
    challenge: "Communication feels heavy, criticized, or inadequate",
    gift: "Learning precise, meaningful communication",
    healingPath: "Listening without judgment"
  },
  'Saturn-Saturn': {
    projection: "Mutual projection of karmic lessons",
    dynamic: "Both face their Saturn wounds through each other",
    challenge: "Double restriction — can feel very heavy",
    gift: "Deep karmic work and mutual maturation",
    healingPath: "Supporting each other's growth without fixing"
  }
};

/**
 * Build projection loops from two charts
 *
 * @param {Object} chartA - First person's chart
 * @param {Object} chartB - Second person's chart
 * @param {Array} synastryAspects - Synastry aspects
 * @returns {Array} Projection loops
 */
export function buildProjectionLoops(chartA, chartB, synastryAspects) {
  if (!synastryAspects || !Array.isArray(synastryAspects)) return [];

  const loops = [];

  for (const aspect of synastryAspects) {
    const p1 = (aspect.p1 || aspect.planet1 || '').toLowerCase();
    const p2 = (aspect.p2 || aspect.planet2 || '').toLowerCase();
    const type = (aspect.type || aspect.aspectType || '').toLowerCase();

    // Only major aspects
    const isMajor = ['conjunction', 'opposition', 'square', 'trine', 'sextile'].includes(type);
    if (!isMajor) continue;

    // Check for Saturn contacts
    if (p1.includes('saturn')) {
      const targetPlanet = capitalizeFirst(p2);
      const key = `Saturn-${targetPlanet}`;
      const projection = SATURN_PROJECTIONS[key];

      if (projection) {
        loops.push({
          aspect: `A's Saturn-B's ${targetPlanet}`,
          aspectType: type,
          orb: aspect.orb,
          direction: 'A_projects_onto_B',
          isHard: ['conjunction', 'opposition', 'square'].includes(type),
          ...projection
        });
      }
    }

    if (p2.includes('saturn')) {
      const targetPlanet = capitalizeFirst(p1);
      const key = `Saturn-${targetPlanet}`;
      const projection = SATURN_PROJECTIONS[key];

      if (projection) {
        loops.push({
          aspect: `B's Saturn-A's ${targetPlanet}`,
          aspectType: type,
          orb: aspect.orb,
          direction: 'B_projects_onto_A',
          isHard: ['conjunction', 'opposition', 'square'].includes(type),
          ...projection
        });
      }
    }
  }

  return loops;
}

// ═══════════════════════════════════════════════════════════════════════════
// KARMIC CONTRACTS
// The soul lessons this relationship is here to teach
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Karmic contract patterns
 */
const KARMIC_CONTRACT_PATTERNS = {
  // Based on strongest synastry aspects
  heavy_saturn: {
    name: 'The Commitment Contract',
    lesson: 'Learning lasting commitment through challenge',
    archetype: 'The Testing Ground',
    duration: 'Long-term by nature',
    warning: 'Can feel restrictive if not conscious'
  },
  nodal_activation: {
    name: 'The Destiny Contract',
    lesson: 'Supporting each other\'s soul evolution',
    archetype: 'The Growth Partners',
    duration: 'As long as growth continues',
    warning: 'May end when lessons complete'
  },
  pluto_intensive: {
    name: 'The Transformation Contract',
    lesson: 'Dying and being reborn through intimacy',
    archetype: 'The Alchemical Partnership',
    duration: 'Until transformation completes',
    warning: 'Can be obsessive or controlling'
  },
  venus_neptune: {
    name: 'The Soul Mate Contract',
    lesson: 'Learning unconditional love',
    archetype: 'The Divine Love',
    duration: 'Transcends ordinary time',
    warning: 'Can involve idealization and disillusionment'
  },
  mars_saturn: {
    name: 'The Frustration Contract',
    lesson: 'Learning patience and strategic action',
    archetype: 'The Disciplined Warriors',
    duration: 'Until action becomes conscious',
    warning: 'Can involve power struggles'
  }
};

/**
 * Build karmic contracts from synastry aspects
 *
 * @param {Array} aspects - Synastry aspects
 * @returns {Object} Karmic contracts
 */
export function buildSynastryContracts(aspects) {
  if (!aspects || !Array.isArray(aspects)) {
    return { contracts: [], primaryContract: null };
  }

  const contracts = [];
  const scores = {
    heavy_saturn: 0,
    nodal_activation: 0,
    pluto_intensive: 0,
    venus_neptune: 0,
    mars_saturn: 0
  };

  for (const aspect of aspects) {
    const p1 = (aspect.p1 || aspect.planet1 || '').toLowerCase();
    const p2 = (aspect.p2 || aspect.planet2 || '').toLowerCase();
    const type = (aspect.type || aspect.aspectType || '').toLowerCase();
    const isHard = ['conjunction', 'opposition', 'square'].includes(type);

    // Score Saturn contacts
    if (p1.includes('saturn') || p2.includes('saturn')) {
      scores.heavy_saturn += isHard ? 3 : 1;
    }

    // Score nodal contacts
    if (p1.includes('node') || p2.includes('node') ||
        p1.includes('rahu') || p2.includes('rahu') ||
        p1.includes('ketu') || p2.includes('ketu')) {
      scores.nodal_activation += 2;
    }

    // Score Pluto contacts
    if (p1.includes('pluto') || p2.includes('pluto')) {
      scores.pluto_intensive += isHard ? 3 : 1;
    }

    // Score Venus-Neptune
    if ((p1.includes('venus') && p2.includes('neptune')) ||
        (p1.includes('neptune') && p2.includes('venus'))) {
      scores.venus_neptune += 2;
    }

    // Score Mars-Saturn
    if ((p1.includes('mars') && p2.includes('saturn')) ||
        (p1.includes('saturn') && p2.includes('mars'))) {
      scores.mars_saturn += isHard ? 3 : 1;
    }
  }

  // Determine which contracts are active
  for (const [key, score] of Object.entries(scores)) {
    if (score >= 2) {
      contracts.push({
        key,
        score,
        ...KARMIC_CONTRACT_PATTERNS[key]
      });
    }
  }

  // Sort by score
  contracts.sort((a, b) => b.score - a.score);

  return {
    contracts,
    primaryContract: contracts[0] || null,
    secondaryContract: contracts[1] || null,
    contractCount: contracts.length
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// RELATIONSHIP CROSSROADS
// Timing events for the couple
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build relationship crossroads from both partners' crossroads
 *
 * @param {string} birthDateA - Person A's birth date
 * @param {string} birthDateB - Person B's birth date
 * @returns {Object} Relationship crossroads
 */
export function buildSynastryCrossroads(birthDateA, birthDateB) {
  const crossroadsA = detectCrossroads(birthDateA);
  const crossroadsB = detectCrossroads(birthDateB);

  if (!crossroadsA || !crossroadsB) {
    return null;
  }

  // Find overlapping active crossroads
  const sharedActiveCrossroads = [];
  const activeA = crossroadsA.active || [];
  const activeB = crossroadsB.active || [];

  // Check if same crossroads are active for both
  for (const cA of activeA) {
    for (const cB of activeB) {
      if (cA.key === cB.key) {
        sharedActiveCrossroads.push({
          crossroads: cA.name,
          personA: { age: crossroadsA.currentAge, intensity: cA.intensity },
          personB: { age: crossroadsB.currentAge, intensity: cB.intensity },
          meaning: "Both partners are in the same crossroads — powerful shared transformation"
        });
      }
    }
  }

  // Check for complementary crossroads
  const complementaryPairs = [
    ['saturn-return-1', 'nodal-return-2'],
    ['pluto-square', 'uranus-opposition'],
    ['chiron-return', 'saturn-return-2']
  ];

  const complementaryCrossroads = [];
  for (const [keyA, keyB] of complementaryPairs) {
    const foundA = activeA.find(c => c.key === keyA);
    const foundB = activeB.find(c => c.key === keyB);
    const foundAB = activeA.find(c => c.key === keyB);
    const foundBA = activeB.find(c => c.key === keyA);

    if (foundA && foundB) {
      complementaryCrossroads.push({
        personA: foundA.name,
        personB: foundB.name,
        meaning: "Complementary crossroads — you can support each other's different journeys"
      });
    }
    if (foundAB && foundBA) {
      complementaryCrossroads.push({
        personA: foundAB.name,
        personB: foundBA.name,
        meaning: "Complementary crossroads — you can support each other's different journeys"
      });
    }
  }

  return {
    personA: {
      age: crossroadsA.currentAge,
      active: activeA.map(c => c.name),
      approaching: (crossroadsA.approaching || []).map(c => c.name)
    },
    personB: {
      age: crossroadsB.currentAge,
      active: activeB.map(c => c.name),
      approaching: (crossroadsB.approaching || []).map(c => c.name)
    },
    sharedActiveCrossroads,
    complementaryCrossroads,
    ageDifference: Math.abs(crossroadsA.currentAge - crossroadsB.currentAge),
    relationshipPhase: determineRelationshipPhase(crossroadsA, crossroadsB)
  };
}

/**
 * Determine relationship phase based on both partners' crossroads
 */
function determineRelationshipPhase(crossroadsA, crossroadsB) {
  const ageA = crossroadsA.currentAge;
  const ageB = crossroadsB.currentAge;
  const avgAge = (ageA + ageB) / 2;

  if (avgAge < 30) {
    return { name: 'Building', description: 'The relationship is in its formative phase' };
  }
  if (avgAge < 45) {
    return { name: 'Deepening', description: 'The relationship is maturing through challenges' };
  }
  if (avgAge < 60) {
    return { name: 'Integrating', description: 'The relationship is harvesting wisdom' };
  }
  return { name: 'Completing', description: 'The relationship is in its legacy phase' };
}

// ═══════════════════════════════════════════════════════════════════════════
// SYNASTRY FATE VS CHOICE INDEX
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Compute synastry fate vs choice index
 *
 * @param {Array} aspects - Synastry aspects
 * @returns {Object} Fate choice index for the relationship
 */
export function computeSynastryFateChoiceIndex(aspects) {
  if (!aspects || !Array.isArray(aspects)) {
    return { fateScore: 50, choiceScore: 50 };
  }

  let fateScore = 50;
  const factors = [];

  for (const aspect of aspects) {
    const p1 = (aspect.p1 || aspect.planet1 || '').toLowerCase();
    const p2 = (aspect.p2 || aspect.planet2 || '').toLowerCase();
    const type = (aspect.type || aspect.aspectType || '').toLowerCase();
    const orb = aspect.orb || 5;
    const isHard = ['conjunction', 'opposition', 'square'].includes(type);
    const orbMultiplier = orb <= 2 ? 2 : orb <= 5 ? 1.5 : 1;

    // Nodal contacts are highly fated
    if (p1.includes('node') || p2.includes('node') ||
        p1.includes('rahu') || p2.includes('rahu') ||
        p1.includes('ketu') || p2.includes('ketu')) {
      const points = Math.round(15 * orbMultiplier);
      fateScore += points;
      factors.push({ type: 'nodal', aspect: `${p1}-${p2}`, points });
    }

    // Saturn contacts increase fate
    if (p1.includes('saturn') || p2.includes('saturn')) {
      const points = Math.round((isHard ? 10 : 5) * orbMultiplier);
      fateScore += points;
      factors.push({ type: 'saturn', aspect: `${p1}-${p2}`, points });
    }

    // Pluto contacts increase fate
    if (p1.includes('pluto') || p2.includes('pluto')) {
      const points = Math.round((isHard ? 12 : 6) * orbMultiplier);
      fateScore += points;
      factors.push({ type: 'pluto', aspect: `${p1}-${p2}`, points });
    }

    // Jupiter/Uranus increase choice
    if (p1.includes('jupiter') || p2.includes('jupiter') ||
        p1.includes('uranus') || p2.includes('uranus')) {
      const points = -Math.round(5 * orbMultiplier);
      fateScore += points;
      factors.push({ type: 'choice', aspect: `${p1}-${p2}`, points });
    }
  }

  // Clamp
  fateScore = Math.max(0, Math.min(100, fateScore));
  const choiceScore = 100 - fateScore;

  // Determine category
  let category;
  if (fateScore >= 70) {
    category = {
      name: 'Destined Connection',
      description: 'This relationship carries significant karmic weight',
      interpretation: 'You likely feel a strong sense of fate or inevitability about being together'
    };
  } else if (fateScore >= 50) {
    category = {
      name: 'Karmic Learning',
      description: 'Meaningful lessons with freedom to choose',
      interpretation: 'This relationship offers important growth while honoring your autonomy'
    };
  } else {
    category = {
      name: 'Chosen Connection',
      description: 'More free will than fate',
      interpretation: 'This relationship is more about choice than cosmic inevitability'
    };
  }

  return {
    fateScore,
    choiceScore,
    category,
    factors,
    summary: `This relationship scores ${fateScore}% fate / ${choiceScore}% choice`
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// RELATIONSHIP ARCHETYPE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Relationship archetypes based on dominant synastry patterns
 */
const RELATIONSHIP_ARCHETYPES = {
  karmic_teachers: {
    name: 'The Karmic Teachers',
    description: 'This relationship is primarily about learning difficult lessons together',
    strengths: ['Deep growth potential', 'Lasting impact', 'Soul evolution'],
    challenges: ['Heavy energy', 'Obligation feelings', 'Difficulty letting go']
  },
  soul_mates: {
    name: 'The Soul Mates',
    description: 'This relationship carries recognition and destiny energy',
    strengths: ['Deep recognition', 'Spiritual connection', 'Supportive growth'],
    challenges: ['High expectations', 'Idealization', 'Fear of loss']
  },
  twin_flames: {
    name: 'The Mirror Souls',
    description: 'This relationship reflects your own shadow and light back to you',
    strengths: ['Self-knowledge', 'Transformation', 'Intensity'],
    challenges: ['Triggering', 'Projection', 'Running/chasing dynamics']
  },
  growth_partners: {
    name: 'The Growth Partners',
    description: 'This relationship supports mutual evolution with more freedom',
    strengths: ['Supportive', 'Flexible', 'Encouraging'],
    challenges: ['May lack intensity', 'Can drift apart', 'Less dramatic']
  },
  alchemical_union: {
    name: 'The Alchemical Union',
    description: 'This relationship transforms both partners through the process',
    strengths: ['Profound transformation', 'Power', 'Regeneration'],
    challenges: ['Power struggles', 'Obsession', 'All-or-nothing energy']
  }
};

/**
 * Assign relationship archetype based on synastry patterns
 *
 * @param {Array} aspects - Synastry aspects
 * @param {Object} contracts - Karmic contracts
 * @param {Object} fateIndex - Fate choice index
 * @returns {Object} Relationship archetype
 */
export function assignSynastryArchetype(aspects, contracts, fateIndex) {
  // Score each archetype
  const scores = {
    karmic_teachers: 0,
    soul_mates: 0,
    twin_flames: 0,
    growth_partners: 0,
    alchemical_union: 0
  };

  // Weight by contracts
  if (contracts?.primaryContract) {
    switch (contracts.primaryContract.key) {
      case 'heavy_saturn':
        scores.karmic_teachers += 3;
        break;
      case 'nodal_activation':
        scores.soul_mates += 3;
        break;
      case 'pluto_intensive':
        scores.alchemical_union += 3;
        break;
      case 'venus_neptune':
        scores.soul_mates += 2;
        scores.twin_flames += 1;
        break;
    }
  }

  // Weight by fate index
  if (fateIndex?.fateScore >= 70) {
    scores.karmic_teachers += 2;
    scores.soul_mates += 1;
  } else if (fateIndex?.fateScore <= 40) {
    scores.growth_partners += 2;
  }

  // Weight by aspect patterns
  if (aspects) {
    for (const aspect of aspects) {
      const p1 = (aspect.p1 || aspect.planet1 || '').toLowerCase();
      const p2 = (aspect.p2 || aspect.planet2 || '').toLowerCase();

      // Pluto contacts favor alchemical
      if (p1.includes('pluto') || p2.includes('pluto')) {
        scores.alchemical_union += 1;
        scores.twin_flames += 0.5;
      }

      // Node contacts favor soul mates
      if (p1.includes('node') || p2.includes('node')) {
        scores.soul_mates += 1;
      }

      // Saturn contacts favor karmic teachers
      if (p1.includes('saturn') || p2.includes('saturn')) {
        scores.karmic_teachers += 1;
      }

      // Jupiter/Uranus favor growth partners
      if (p1.includes('jupiter') || p2.includes('jupiter') ||
          p1.includes('uranus') || p2.includes('uranus')) {
        scores.growth_partners += 0.5;
      }
    }
  }

  // Find dominant archetype
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primaryKey = sorted[0][0];
  const secondaryKey = sorted[1] ? sorted[1][0] : null;

  return {
    primary: {
      key: primaryKey,
      score: sorted[0][1],
      ...RELATIONSHIP_ARCHETYPES[primaryKey]
    },
    secondary: secondaryKey ? {
      key: secondaryKey,
      score: sorted[1][1],
      ...RELATIONSHIP_ARCHETYPES[secondaryKey]
    } : null,
    scores
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build complete synastry fate profile
 *
 * @param {Object} chartA - Person A's chart
 * @param {Object} chartB - Person B's chart
 * @param {Array} synastryAspects - Synastry aspects between charts
 * @returns {Object} Complete synastry fate profile
 */
export function buildSynastryFateProfile(chartA, chartB, synastryAspects) {
  // 1. Build fate threads for each person
  const fateThreadsA = buildFateThreads(chartA);
  const fateThreadsB = buildFateThreads(chartB);

  // 2. Build fated axis interlocks
  const axisInterlocks = buildSynastryFateThreads(synastryAspects);

  // 3. Build projection loops
  const projectionLoops = buildProjectionLoops(chartA, chartB, synastryAspects);

  // 4. Build karmic contracts
  const karmicContracts = buildSynastryContracts(synastryAspects);

  // 5. Build crossroads (if birth dates available)
  const crossroads = (chartA.birthDateISO && chartB.birthDateISO)
    ? buildSynastryCrossroads(chartA.birthDateISO, chartB.birthDateISO)
    : null;

  // 6. Compute synastry fate index
  const fateChoiceIndex = computeSynastryFateChoiceIndex(synastryAspects);

  // 7. Assign relationship archetype
  const relationshipArchetype = assignSynastryArchetype(
    synastryAspects,
    karmicContracts,
    fateChoiceIndex
  );

  // 8. Generate Luna guidance
  const lunaGuidance = generateSynastryLunaGuidance(
    axisInterlocks,
    projectionLoops,
    karmicContracts,
    relationshipArchetype
  );

  return {
    // Individual fate threads
    personA: {
      fateThreads: fateThreadsA
    },
    personB: {
      fateThreads: fateThreadsB
    },

    // Synastry fate analysis
    axisInterlocks,
    projectionLoops,
    karmicContracts,
    crossroads,
    fateChoiceIndex,
    relationshipArchetype,

    // Luna guidance
    lunaGuidance,

    // Summary
    summary: {
      fateScore: fateChoiceIndex.fateScore,
      choiceScore: fateChoiceIndex.choiceScore,
      primaryArchetype: relationshipArchetype.primary?.name,
      primaryContract: karmicContracts.primaryContract?.name,
      interlockCount: axisInterlocks.length,
      projectionCount: projectionLoops.length
    },

    // Metadata
    metadata: {
      hasAxisInterlocks: axisInterlocks.length > 0,
      hasProjectionLoops: projectionLoops.length > 0,
      hasKarmicContracts: karmicContracts.contracts.length > 0,
      hasCrossroads: !!crossroads
    }
  };
}

/**
 * Generate Luna guidance for synastry
 */
function generateSynastryLunaGuidance(interlocks, projections, contracts, archetype) {
  const guidance = {
    opening: [],
    insights: [],
    practices: [],
    closing: ''
  };

  // Opening based on archetype
  if (archetype?.primary) {
    guidance.opening.push(
      `This relationship has the signature of ${archetype.primary.name}.`
    );
    guidance.opening.push(archetype.primary.description);
  }

  // Insights from interlocks
  if (interlocks.length > 0) {
    guidance.insights.push(
      `There are ${interlocks.length} fated axis interlocks between you — points where destiny weaves your lives together.`
    );
    const highIntensity = interlocks.filter(i => i.intensity === 'very_high');
    if (highIntensity.length > 0) {
      guidance.insights.push(
        `The most significant: ${highIntensity[0].meaning}`
      );
    }
  }

  // Insights from projections
  if (projections.length > 0) {
    const hardProjections = projections.filter(p => p.isHard);
    if (hardProjections.length > 0) {
      guidance.insights.push(
        `There are ${hardProjections.length} Saturn projection patterns that may create friction.`
      );
      guidance.practices.push(
        `Practice: ${hardProjections[0].healingPath}`
      );
    }
  }

  // Primary contract guidance
  if (contracts?.primaryContract) {
    guidance.insights.push(
      `Your primary karmic contract is ${contracts.primaryContract.name}: ${contracts.primaryContract.lesson}`
    );
    if (contracts.primaryContract.warning) {
      guidance.insights.push(
        `Be aware: ${contracts.primaryContract.warning}`
      );
    }
  }

  guidance.closing = "Every relationship is a teacher. Honor what this one is here to teach you.";

  return guidance;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Build synastry fate engine - wrapper that handles aspect computation
 * @param {Object} chartA - First person's chart
 * @param {Object} chartB - Second person's chart
 * @param {Array} synastryAspects - Optional pre-computed aspects
 */
export function buildSynastryFateEngine(chartA, chartB, synastryAspects = []) {
  // If aspects not provided, use empty array (aspects computed elsewhere)
  const aspects = synastryAspects || chartA?.synastryAspects || chartB?.synastryAspects || [];

  return buildSynastryFateProfile(chartA, chartB, aspects);
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  // Main orchestrator
  buildSynastryFateProfile,

  // Individual builders
  buildSynastryFateThreads,
  buildProjectionLoops,
  buildSynastryContracts,
  buildSynastryCrossroads,
  computeSynastryFateChoiceIndex,
  assignSynastryArchetype,

  // Re-export data
  AXIS_INTERLOCKS,
  SATURN_PROJECTIONS,
  KARMIC_CONTRACT_PATTERNS,
  RELATIONSHIP_ARCHETYPES
};
