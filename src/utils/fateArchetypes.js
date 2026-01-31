/**
 * Fate Archetypes Engine
 *
 * Based on Liz Greene's "The Astrology of Fate" — assigning mythic
 * archetypes based on Saturn (karmic teacher) and Pluto (collective shadow).
 *
 * The archetype represents the mythic role the soul is playing:
 * - Saturn sign determines the TEACHER archetype (how lessons come)
 * - Pluto sign determines the SHADOW archetype (what must be transformed)
 * - Combined, they create the FATE archetype (the mythic role)
 *
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// SATURN TEACHER ARCHETYPES
// The way karmic lessons are delivered
// ═══════════════════════════════════════════════════════════════════════════

const SATURN_TEACHER_ARCHETYPES = {
  Aries: {
    archetype: "The Stern General",
    teachingStyle: "Through challenges to your courage and initiative",
    lessonDelivery: "Obstacles that demand action, blocks that test your will",
    mythicFigure: "Mars as the demanding war-god who tests warriors"
  },
  Taurus: {
    archetype: "The Austere Steward",
    teachingStyle: "Through material challenges and tests of worth",
    lessonDelivery: "Financial tests, questions of value, lessons in simplicity",
    mythicFigure: "Hephaestus as the patient craftsman who builds through difficulty"
  },
  Gemini: {
    archetype: "The Silent Sage",
    teachingStyle: "Through communication blocks and mental challenges",
    lessonDelivery: "Words that fail, misunderstandings, lessons in depth over breadth",
    mythicFigure: "Hermes as the trickster who teaches through riddles"
  },
  Cancer: {
    archetype: "The Absent Mother",
    teachingStyle: "Through emotional deprivation and family wounds",
    lessonDelivery: "Early abandonment, emotional tests, lessons in self-nurturing",
    mythicFigure: "Demeter in mourning, teaching through loss"
  },
  Leo: {
    archetype: "The Shadowed King",
    teachingStyle: "Through humiliation and tests of authentic expression",
    lessonDelivery: "Visibility denied, recognition withheld, lessons in quiet confidence",
    mythicFigure: "Apollo diminished, teaching through creative blocks"
  },
  Virgo: {
    archetype: "The Exacting Master",
    teachingStyle: "Through perfectionism and inadequacy feelings",
    lessonDelivery: "Criticism, health challenges, lessons in self-acceptance",
    mythicFigure: "Chiron the wounded healer who teaches through imperfection"
  },
  Libra: {
    archetype: "The Solitary Judge",
    teachingStyle: "Through relationship difficulties and isolation",
    lessonDelivery: "Partnership tests, loneliness, lessons in authentic relating",
    mythicFigure: "Themis who weighs alone before rendering judgment"
  },
  Scorpio: {
    archetype: "The Dark Initiator",
    teachingStyle: "Through power struggles and transformative crises",
    lessonDelivery: "Betrayal, intensity, lessons in surrender and trust",
    mythicFigure: "Hades as the underworld teacher of death and rebirth"
  },
  Sagittarius: {
    archetype: "The Confined Prophet",
    teachingStyle: "Through limitation of freedom and belief tests",
    lessonDelivery: "Restriction, meaning crises, lessons in grounded faith",
    mythicFigure: "Zeus bound by necessity, teaching through limitation"
  },
  Capricorn: {
    archetype: "The Stern Father",
    teachingStyle: "Through authority challenges and achievement tests",
    lessonDelivery: "Failure, responsibility, lessons in authentic success",
    mythicFigure: "Kronos as the demanding taskmaster of time"
  },
  Aquarius: {
    archetype: "The Outcast Visionary",
    teachingStyle: "Through alienation and tests of individuality",
    lessonDelivery: "Not belonging, uniqueness rejected, lessons in authentic difference",
    mythicFigure: "Prometheus punished for bringing fire to humanity"
  },
  Pisces: {
    archetype: "The Suffering Mystic",
    teachingStyle: "Through dissolution and spiritual tests",
    lessonDelivery: "Boundary confusion, escapism consequences, lessons in grounded spirit",
    mythicFigure: "Dionysus dismembered and reborn through suffering"
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// PLUTO SHADOW ARCHETYPES
// The collective shadow that must be transformed
// ═══════════════════════════════════════════════════════════════════════════

const PLUTO_SHADOW_ARCHETYPES = {
  Aries: {
    archetype: "The Shadow Warrior",
    shadowWork: "Transforming rage and aggression into protective strength",
    collectiveWound: "Violence, war, domination",
    transformationPath: "From destruction to courageous defense"
  },
  Taurus: {
    archetype: "The Shadow Possessor",
    shadowWork: "Transforming greed and materialism into stewardship",
    collectiveWound: "Exploitation, hoarding, environmental destruction",
    transformationPath: "From ownership to custodianship"
  },
  Gemini: {
    archetype: "The Shadow Trickster",
    shadowWork: "Transforming deception into truth-telling",
    collectiveWound: "Propaganda, misinformation, manipulation",
    transformationPath: "From lies to authentic communication"
  },
  Cancer: {
    archetype: "The Shadow Mother",
    shadowWork: "Transforming emotional manipulation into genuine nurturing",
    collectiveWound: "Tribal warfare, toxic nationalism, emotional control",
    transformationPath: "From smothering to supportive care"
  },
  Leo: {
    archetype: "The Shadow King",
    shadowWork: "Transforming narcissism into generous leadership",
    collectiveWound: "Authoritarianism, ego inflation, celebrity worship",
    transformationPath: "From self-obsession to inspiring others"
  },
  Virgo: {
    archetype: "The Shadow Critic",
    shadowWork: "Transforming perfectionism into healing service",
    collectiveWound: "Health obsession, purity complexes, servitude",
    transformationPath: "From criticism to discernment"
  },
  Libra: {
    archetype: "The Shadow Judge",
    shadowWork: "Transforming codependency into authentic relating",
    collectiveWound: "Relationship addiction, false peace, injustice",
    transformationPath: "From dependence to interdependence"
  },
  Scorpio: {
    archetype: "The Shadow Phoenix",
    shadowWork: "Transforming obsession into regenerative power",
    collectiveWound: "Power abuse, sexual shadow, death denial",
    transformationPath: "From control to surrender"
  },
  Sagittarius: {
    archetype: "The Shadow Prophet",
    shadowWork: "Transforming fanaticism into open wisdom",
    collectiveWound: "Religious extremism, cultural imperialism, intolerance",
    transformationPath: "From righteousness to receptivity"
  },
  Capricorn: {
    archetype: "The Shadow Patriarch",
    shadowWork: "Transforming corruption into authentic authority",
    collectiveWound: "Institutional decay, corporate abuse, heartless ambition",
    transformationPath: "From domination to responsible leadership"
  },
  Aquarius: {
    archetype: "The Shadow Revolutionary",
    shadowWork: "Transforming detachment into humanitarian connection",
    collectiveWound: "Dehumanization, technology addiction, alienation",
    transformationPath: "From isolation to authentic community"
  },
  Pisces: {
    archetype: "The Shadow Martyr",
    shadowWork: "Transforming victimhood into compassionate strength",
    collectiveWound: "Addiction, escapism, boundary dissolution",
    transformationPath: "From suffering to service"
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// COMBINED FATE ARCHETYPES
// Saturn + Pluto create the complete mythic identity
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate combined archetype title from Saturn and Pluto
 * @param {string} saturnSign - Saturn sign
 * @param {string} plutoSign - Pluto sign
 * @returns {string} Combined archetype title
 */
function generateArchetypeTitle(saturnSign, plutoSign) {
  const saturnArchetype = SATURN_TEACHER_ARCHETYPES[saturnSign];
  const plutoArchetype = PLUTO_SHADOW_ARCHETYPES[plutoSign];

  if (!saturnArchetype || !plutoArchetype) return null;

  // Extract key words for combination
  const saturnKey = saturnArchetype.archetype.replace('The ', '');
  const plutoKey = plutoArchetype.archetype.replace('The Shadow ', '');

  return `The ${saturnKey} Who Transforms ${plutoKey}`;
}

/**
 * Generate archetype narrative from combination
 */
function generateArchetypeNarrative(saturnSign, plutoSign) {
  const saturnArchetype = SATURN_TEACHER_ARCHETYPES[saturnSign];
  const plutoArchetype = PLUTO_SHADOW_ARCHETYPES[plutoSign];

  if (!saturnArchetype || !plutoArchetype) return null;

  return {
    opening: `Your mythic role combines ${saturnArchetype.archetype} with ${plutoArchetype.archetype}.`,
    karmicPath: `Life teaches you ${saturnArchetype.teachingStyle.toLowerCase()}, while you're called to transform ${plutoArchetype.collectiveWound.toLowerCase()}.`,
    integration: `Your journey is ${plutoArchetype.transformationPath.toLowerCase()}, learned through ${saturnArchetype.lessonDelivery.toLowerCase()}.`,
    mythicGuidance: `${saturnArchetype.mythicFigure} guides your karmic lessons, while you do the shadow work of ${plutoArchetype.archetype.toLowerCase()}.`
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ELEMENT-BASED FATE THEMES
// Additional layer based on elemental combination
// ═══════════════════════════════════════════════════════════════════════════

const ELEMENT_MAP = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
};

const ELEMENTAL_FATE_THEMES = {
  'Fire-Fire': {
    theme: "The Flame That Tempers Itself",
    journey: "Learning to channel passion without burning out",
    gift: "Inspiring leadership through transformed will"
  },
  'Fire-Earth': {
    theme: "The Forge of Manifestation",
    journey: "Learning to ground vision into reality",
    gift: "Building lasting structures from inspired action"
  },
  'Fire-Air': {
    theme: "The Spreading Flame",
    journey: "Learning to communicate passion with clarity",
    gift: "Inspiring ideas that change minds"
  },
  'Fire-Water': {
    theme: "The Steam of Transformation",
    journey: "Learning to balance passion with feeling",
    gift: "Emotional courage and inspired healing"
  },
  'Earth-Fire': {
    theme: "The Mountain That Erupts",
    journey: "Learning to release what's been held too tightly",
    gift: "Sustainable passion and grounded leadership"
  },
  'Earth-Earth': {
    theme: "The Bedrock Foundation",
    journey: "Learning flexibility within structure",
    gift: "Unshakeable foundations and lasting value"
  },
  'Earth-Air': {
    theme: "The Practical Visionary",
    journey: "Learning to give form to ideas",
    gift: "Building systems that serve humanity"
  },
  'Earth-Water': {
    theme: "The Fertile Ground",
    journey: "Learning to nourish without controlling",
    gift: "Emotional stability and practical nurturing"
  },
  'Air-Fire': {
    theme: "The Spreading Light",
    journey: "Learning to inspire without overwhelm",
    gift: "Visionary communication that ignites action"
  },
  'Air-Earth': {
    theme: "The Grounded Mind",
    journey: "Learning to make ideas real",
    gift: "Practical wisdom and manifested thought"
  },
  'Air-Air': {
    theme: "The Clear Sky",
    journey: "Learning depth alongside breadth",
    gift: "Brilliant communication and social innovation"
  },
  'Air-Water': {
    theme: "The Morning Mist",
    journey: "Learning to feel while thinking",
    gift: "Emotional intelligence and intuitive understanding"
  },
  'Water-Fire': {
    theme: "The Healing Flame",
    journey: "Learning to act from feeling",
    gift: "Passionate compassion and emotional courage"
  },
  'Water-Earth': {
    theme: "The River That Shapes Stone",
    journey: "Learning patience through emotional process",
    gift: "Nurturing presence and emotional groundedness"
  },
  'Water-Air': {
    theme: "The Dream That Speaks",
    journey: "Learning to articulate the ineffable",
    gift: "Poetic wisdom and intuitive communication"
  },
  'Water-Water': {
    theme: "The Deep Ocean",
    journey: "Learning boundaries within merger",
    gift: "Profound empathy and spiritual depth"
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ENGINE FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Assign mythic archetype based on Saturn and Pluto signs
 *
 * @param {string} saturnSign - Saturn sign
 * @param {string} plutoSign - Pluto sign
 * @returns {Object} Complete archetype profile
 */
export function assignArchetype(saturnSign, plutoSign) {
  if (!saturnSign || !plutoSign) {
    return null;
  }

  const saturnArchetype = SATURN_TEACHER_ARCHETYPES[saturnSign];
  const plutoArchetype = PLUTO_SHADOW_ARCHETYPES[plutoSign];

  if (!saturnArchetype || !plutoArchetype) {
    return null;
  }

  // Get elemental theme
  const saturnElement = ELEMENT_MAP[saturnSign];
  const plutoElement = ELEMENT_MAP[plutoSign];
  const elementalKey = `${saturnElement}-${plutoElement}`;
  const elementalTheme = ELEMENTAL_FATE_THEMES[elementalKey];

  // Generate combined archetype
  const combinedTitle = generateArchetypeTitle(saturnSign, plutoSign);
  const narrative = generateArchetypeNarrative(saturnSign, plutoSign);

  return {
    // Combined archetype
    title: combinedTitle,
    narrative,

    // Saturn teacher
    saturnTeacher: {
      sign: saturnSign,
      ...saturnArchetype
    },

    // Pluto shadow
    plutoShadow: {
      sign: plutoSign,
      ...plutoArchetype
    },

    // Elemental theme
    elementalTheme: {
      saturnElement,
      plutoElement,
      ...elementalTheme
    },

    // Summary strings for UI
    summary: {
      karmicRole: saturnArchetype.archetype,
      shadowRole: plutoArchetype.archetype,
      combinedRole: combinedTitle,
      coreJourney: plutoArchetype.transformationPath,
      elementalJourney: elementalTheme?.journey
    },

    // Metadata
    metadata: {
      saturnSign,
      plutoSign,
      saturnElement,
      plutoElement,
      elementalCombination: elementalKey
    }
  };
}

/**
 * Get just the archetype title (quick lookup)
 * @param {string} saturnSign - Saturn sign
 * @param {string} plutoSign - Pluto sign
 * @returns {string} Archetype title
 */
export function getArchetypeTitle(saturnSign, plutoSign) {
  return generateArchetypeTitle(saturnSign, plutoSign);
}

/**
 * Get Saturn teacher archetype by sign
 * @param {string} sign - Saturn sign
 * @returns {Object} Teacher archetype
 */
export function getSaturnTeacher(sign) {
  return SATURN_TEACHER_ARCHETYPES[sign] || null;
}

/**
 * Get Pluto shadow archetype by sign
 * @param {string} sign - Pluto sign
 * @returns {Object} Shadow archetype
 */
export function getPlutoShadow(sign) {
  return PLUTO_SHADOW_ARCHETYPES[sign] || null;
}

/**
 * Get elemental fate theme
 * @param {string} saturnSign - Saturn sign
 * @param {string} plutoSign - Pluto sign
 * @returns {Object} Elemental theme
 */
export function getElementalFateTheme(saturnSign, plutoSign) {
  const saturnElement = ELEMENT_MAP[saturnSign];
  const plutoElement = ELEMENT_MAP[plutoSign];
  const key = `${saturnElement}-${plutoElement}`;
  return ELEMENTAL_FATE_THEMES[key] || null;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  assignArchetype,
  getArchetypeTitle,
  getSaturnTeacher,
  getPlutoShadow,
  getElementalFateTheme,
  // Re-export data
  SATURN_TEACHER_ARCHETYPES,
  PLUTO_SHADOW_ARCHETYPES,
  ELEMENTAL_FATE_THEMES,
  ELEMENT_MAP
};
