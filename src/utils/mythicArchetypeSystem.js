/**
 * Mythic Archetype System
 *
 * Maps planetary configurations to mythic archetypes and psychological
 * defense mechanisms, following Liz Greene's depth psychology approach.
 *
 * Archetypes represent the universal patterns that shape human experience.
 * Defense mechanisms are the unconscious strategies we use to protect
 * ourselves from psychological pain.
 *
 * Part of the Liz Greene Cathedral of Psychological Astrology
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// MYTHIC ARCHETYPES BY PLANETARY DOMINANCE
// ═══════════════════════════════════════════════════════════════════════════

const PLANETARY_ARCHETYPES = {
  sun: {
    archetype: "The Hero/Heroine",
    myth: "The Solar Hero's Journey - Apollo, Ra, Helios",
    core: "You are here to become conscious of your unique identity and shine your light into the world.",
    gift: "Radiance, leadership, creativity, life-giving warmth",
    wound: "The father wound - issues with authority, recognition, and self-worth",
    quest: "To discover and express your authentic self despite external pressures to conform"
  },
  moon: {
    archetype: "The Great Mother / The Mystic",
    myth: "The Lunar Goddess - Artemis, Hecate, Isis, Selene",
    core: "You are here to nurture, protect, and connect with the deep emotional currents of life.",
    gift: "Intuition, emotional wisdom, nurturing, psychic receptivity",
    wound: "The mother wound - issues with emotional safety, belonging, and early nurturing",
    quest: "To find emotional security within and create sanctuary for yourself and others"
  },
  mercury: {
    archetype: "The Trickster / The Messenger",
    myth: "Hermes, Thoth, Loki, Coyote",
    core: "You are here to communicate, connect, and bridge different worlds through language and thought.",
    gift: "Intelligence, wit, adaptability, the ability to translate between realms",
    wound: "The voice wound - issues with being heard, understood, or taken seriously",
    quest: "To find your authentic voice and use it to connect rather than deceive"
  },
  venus: {
    archetype: "The Lover / The Artist",
    myth: "Aphrodite, Ishtar, Freya, Oshun",
    core: "You are here to experience and create beauty, love, and harmony.",
    gift: "Aesthetic sense, romantic nature, ability to attract and harmonize",
    wound: "The worth wound - issues with self-value, lovability, and deserving pleasure",
    quest: "To love yourself completely and extend that love outward without losing yourself"
  },
  mars: {
    archetype: "The Warrior / The Pioneer",
    myth: "Ares, Mars, Sekhmet, Durga",
    core: "You are here to assert your will, fight for what matters, and pioneer new territory.",
    gift: "Courage, initiative, passionate action, the ability to protect and defend",
    wound: "The anger wound - issues with rage, impotence, or the fear of one's own power",
    quest: "To channel aggression into righteous action and courage into protection"
  },
  jupiter: {
    archetype: "The King/Queen / The Sage",
    myth: "Zeus, Jupiter, Odin, Marduk",
    core: "You are here to expand, inspire, and seek higher meaning in all things.",
    gift: "Optimism, wisdom, faith, the ability to see the bigger picture and inspire others",
    wound: "The meaning wound - issues with purpose, faith, and the fear of insignificance",
    quest: "To find genuine faith without inflation and share wisdom without preaching"
  },
  saturn: {
    archetype: "The Senex / The Wise Elder",
    myth: "Cronos, Saturn, Father Time, The Hermit",
    core: "You are here to master limitations, build lasting structures, and earn true authority.",
    gift: "Discipline, patience, integrity, the ability to manifest through sustained effort",
    wound: "The authority wound - issues with inadequacy, fear of failure, and harsh self-judgment",
    quest: "To transform your deepest fears into your greatest strengths through patient work"
  },
  uranus: {
    archetype: "The Rebel / The Awakener",
    myth: "Prometheus, The Lightning Bringer, The Revolutionary",
    core: "You are here to break free from limitations and awaken others to new possibilities.",
    gift: "Originality, genius, liberation, the ability to see and create the future",
    wound: "The belonging wound - the outsider who doesn't fit conventional molds",
    quest: "To be authentic without being alienating, revolutionary without being destructive"
  },
  neptune: {
    archetype: "The Mystic / The Dreamer",
    myth: "Poseidon, Neptune, The Divine Feminine, The Veil",
    core: "You are here to transcend ordinary reality and connect with the divine.",
    gift: "Imagination, compassion, spiritual connection, artistic vision",
    wound: "The dissolution wound - issues with boundaries, escapism, and reality vs. fantasy",
    quest: "To bring dreams into reality without losing yourself in illusion"
  },
  pluto: {
    archetype: "The Transformer / The Phoenix",
    myth: "Hades, Pluto, Persephone, Kali, Shiva",
    core: "You are here to transform, die to the old, and be reborn into power.",
    gift: "Depth, intensity, regenerative power, the ability to face darkness and emerge",
    wound: "The power wound - issues with control, betrayal, and fear of one's own depths",
    quest: "To transform without destroying, to use power for healing rather than domination"
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// DEFENSE MECHANISMS BY SIGN/ELEMENT
// ═══════════════════════════════════════════════════════════════════════════

const DEFENSE_MECHANISMS = {
  // Fire Signs - Acting Out defenses
  Aries: {
    primary: "Displacement",
    description: "Redirecting aggressive impulses toward safer targets. Picking fights to discharge tension.",
    secondary: "Reaction Formation",
    secondaryDesc: "Being overly peaceful or passive when anger is actually present.",
    triggers: "Feeling controlled, powerless, or challenged. Situations requiring patience or submission.",
    protects: "A vulnerable core that fears being weak or helpless. The terror of not being able to defend yourself.",
    integration: "Learn to sit with anger before acting. Not all threats require immediate response."
  },
  Leo: {
    primary: "Compensation",
    description: "Covering perceived inadequacy with grandiosity. Inflating self-image to ward off criticism.",
    secondary: "Denial",
    secondaryDesc: "Refusing to acknowledge criticism or failure because it threatens the self-image.",
    triggers: "Being ignored, criticized, or outshone. Situations where you're not the center of attention.",
    protects: "A deep shame about being ordinary. The wounded child who never felt truly seen or celebrated.",
    integration: "True royalty doesn't need constant validation. Let yourself be seen in vulnerability."
  },
  Sagittarius: {
    primary: "Rationalization",
    description: "Creating logical explanations to avoid emotional truth. Philosophy as escape from feeling.",
    secondary: "Intellectualization",
    secondaryDesc: "Turning everything into abstract concepts to avoid emotional engagement.",
    triggers: "Confronting limits, commitment, or mundane reality. Situations requiring emotional depth over breadth.",
    protects: "The terror of being trapped or meaningless. A restless soul that fears standing still.",
    integration: "Some truths can only be felt, not understood. Stay present with discomfort."
  },

  // Earth Signs - Control defenses
  Taurus: {
    primary: "Denial",
    description: "Refusing to acknowledge unwanted reality. 'If I don't acknowledge it, it isn't happening.'",
    secondary: "Passive Aggression",
    secondaryDesc: "Expressing resistance through inaction, stubbornness, or 'forgetting.'",
    triggers: "Change, instability, threats to security or comfort. Being rushed or forced to adapt.",
    protects: "Deep survival anxiety. A primal fear that resources will be taken and security will vanish.",
    integration: "Change doesn't threaten your core. Flexibility can coexist with stability."
  },
  Virgo: {
    primary: "Isolation of Affect",
    description: "Separating feelings from facts. Analyzing emotions rather than experiencing them.",
    secondary: "Undoing",
    secondaryDesc: "Compulsive fixing or correcting to undo perceived mistakes or 'badness.'",
    triggers: "Chaos, imperfection, criticism of your work. Situations beyond your ability to fix or control.",
    protects: "Crushing self-criticism. The belief that if you're not perfect, you're worthless.",
    integration: "Imperfection is human. Your worth isn't measured by your flawlessness."
  },
  Capricorn: {
    primary: "Suppression",
    description: "Consciously pushing down feelings to maintain control and achieve goals.",
    secondary: "Compartmentalization",
    secondaryDesc: "Keeping emotional life strictly separate from professional achievement.",
    triggers: "Failure, loss of status, being seen as incompetent. Emotional demands from others.",
    protects: "A frightened child who learned early that emotions were dangerous or unacceptable.",
    integration: "Vulnerability is not weakness. Feelings can coexist with accomplishment."
  },

  // Air Signs - Intellectual defenses
  Gemini: {
    primary: "Intellectualization",
    description: "Analyzing feelings to avoid experiencing them. 'Interesting that I feel sad...'",
    secondary: "Distraction",
    secondaryDesc: "Constant mental activity to avoid uncomfortable inner states.",
    triggers: "Depth, commitment, being pinned down. Situations requiring sustained emotional presence.",
    protects: "A profound loneliness. The fear that if you stop moving, the emptiness will catch up.",
    integration: "Not everything needs to be understood. Some things simply need to be felt."
  },
  Libra: {
    primary: "Reaction Formation",
    description: "Appearing peaceful when actually angry. Excessive politeness masking resentment.",
    secondary: "Identification with Others",
    secondaryDesc: "Losing self in what others want or think to avoid internal conflict.",
    triggers: "Conflict, having to choose sides, being forced to assert individual needs over relationship.",
    protects: "Terror of rejection and abandonment. The belief that your real self would be unacceptable.",
    integration: "Your needs matter equally. Conflict can lead to deeper harmony."
  },
  Aquarius: {
    primary: "Emotional Detachment",
    description: "Observing feelings from a distance rather than experiencing them directly.",
    secondary: "Projection",
    secondaryDesc: "Attributing one's own emotional needs to 'humanity' rather than owning them personally.",
    triggers: "Intimacy, personal emotional demands, being asked to conform or belong.",
    protects: "Profound alienation. The wound of never fitting in, disguised as not wanting to.",
    integration: "You are human too. Personal intimacy doesn't threaten your uniqueness."
  },

  // Water Signs - Merging defenses
  Cancer: {
    primary: "Regression",
    description: "Retreating to earlier patterns when stressed. Seeking the safety of the familiar.",
    secondary: "Introjection",
    secondaryDesc: "Taking in others' feelings and making them your own.",
    triggers: "Rejection, emotional coldness, threats to home or family. Having to be independent.",
    protects: "Devastating early abandonment or neglect. The child who learned the world was unsafe.",
    integration: "You can nurture yourself. The past is not always safer than the present."
  },
  Scorpio: {
    primary: "Projection",
    description: "Seeing in others what you cannot acknowledge in yourself. Especially power and betrayal.",
    secondary: "Splitting",
    secondaryDesc: "Seeing people as all good or all bad. Difficulty with ambivalence.",
    triggers: "Vulnerability, superficiality, being lied to or betrayed. Having to trust without guarantees.",
    protects: "Devastating betrayal trauma. The memory of being deeply hurt when you opened up.",
    integration: "Everyone contains both light and shadow. Including you. Including those you love."
  },
  Pisces: {
    primary: "Fantasy",
    description: "Escaping into imagination when reality becomes too painful or demanding.",
    secondary: "Dissociation",
    secondaryDesc: "Leaving the body or situation mentally when overwhelmed.",
    triggers: "Harsh criticism, demands for practical action, being forced to set boundaries.",
    protects: "Unbearable sensitivity. A soul that feels everything too deeply to stay present with it all.",
    integration: "You can stay present. Reality can hold you. You matter here and now."
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// SHADOW ARCHETYPES
// ═══════════════════════════════════════════════════════════════════════════

const SHADOW_ARCHETYPES = {
  sun: {
    shadow: "The Tyrant",
    description: "The Sun's shadow is the need for recognition becoming domination, the light that burns rather than warms.",
    manifestation: "Narcissism, ego inflation, inability to share power or recognition",
    triggers: "Being ignored, overlooked, or having your contributions minimized. Situations where you feel invisible or unimportant.",
    protects: "A deep fear of being nobody special—of being ordinary, forgettable, or fundamentally unworthy of attention.",
    mythicResonance: "Phaethon borrowing the sun chariot—the catastrophe of unearned power and desperate need to prove oneself",
    integration: "True leadership serves. The strongest light illuminates others, not just itself."
  },
  moon: {
    shadow: "The Devouring Mother",
    description: "The Moon's shadow is nurturing becoming suffocation, emotional manipulation, or martyrdom.",
    manifestation: "Guilt manipulation, emotional enmeshment, passive-aggressive care",
    triggers: "Independence in loved ones, emotional distance, feeling unneeded. When others don't need your care.",
    protects: "A terrifying emptiness—the fear of abandonment and the belief that without being needed, you have no value.",
    mythicResonance: "Demeter's grief stopping all growth until Persephone returns—love that cannot release",
    integration: "Love that truly nurtures also lets go. Emotional truth includes boundaries."
  },
  mercury: {
    shadow: "The Deceiver",
    description: "Mercury's shadow is communication becoming manipulation, wit becoming cruelty.",
    manifestation: "Lying, trickery, using intelligence to exploit rather than connect",
    triggers: "Being perceived as unintelligent, slow, or inarticulate. Situations requiring emotional rather than mental response.",
    protects: "The fear of being stupid or foolish—a vulnerable inner child who was mocked or dismissed.",
    mythicResonance: "Hermes stealing Apollo's cattle—cunning as compensation for lacking direct power",
    integration: "Words have power. Use them to heal and connect, not to wound or deceive."
  },
  venus: {
    shadow: "The Seductress/Seducer",
    description: "Venus's shadow is love becoming possession, beauty becoming vanity, pleasure becoming addiction.",
    manifestation: "Using attractiveness to manipulate, love as transaction, aesthetic obsession",
    triggers: "Rejection, being found unattractive or unlovable, seeing others receive the love or admiration you crave.",
    protects: "A core belief of being fundamentally unlovable—that without beauty or charm, you deserve nothing.",
    mythicResonance: "Aphrodite's jealousy of Psyche—beauty that cannot tolerate rivals",
    integration: "True beauty includes imperfection. Real love doesn't require performance."
  },
  mars: {
    shadow: "The Destroyer",
    description: "Mars's shadow is courage becoming violence, assertion becoming aggression.",
    manifestation: "Bullying, rage, cruelty, using power to dominate rather than protect",
    triggers: "Feeling powerless, controlled, or emasculated. Having boundaries violated or desires thwarted.",
    protects: "Profound vulnerability and the terror of being hurt again—the child who learned that attack is the best defense.",
    mythicResonance: "Ares caught in Hephaestus's net—the shame of the warrior exposed and helpless",
    integration: "True strength protects the vulnerable. Anger serves justice, not ego."
  },
  jupiter: {
    shadow: "The False Prophet",
    description: "Jupiter's shadow is wisdom becoming dogma, faith becoming fanaticism.",
    manifestation: "Religious inflation, over-promising, running from difficult truths into false positivity",
    triggers: "Confronting meaninglessness, having beliefs challenged, encountering problems that optimism cannot solve.",
    protects: "Existential despair—the terror that life might be random, meaningless, or that you have wasted it.",
    mythicResonance: "Icarus flying too close to the sun—faith that overreaches and falls",
    integration: "Real wisdom includes not knowing. True faith doesn't need to convert others."
  },
  saturn: {
    shadow: "The Cold Father",
    description: "Saturn's shadow is discipline becoming cruelty, structure becoming rigidity.",
    manifestation: "Harsh judgment, emotional coldness, punishing self and others excessively",
    triggers: "Failure, making mistakes, situations of chaos or lack of control. Being seen as incompetent.",
    protects: "A terrified child who learned that imperfection means punishment or abandonment.",
    mythicResonance: "Cronos devouring his children—the fear of being surpassed that destroys what it loves",
    integration: "Structure can be loving. Discipline serves growth, not punishment."
  },
  uranus: {
    shadow: "The Destroyer of Tradition",
    description: "Uranus's shadow is freedom becoming chaos, uniqueness becoming alienation.",
    manifestation: "Rebellion for its own sake, inability to commit, destroying without rebuilding",
    triggers: "Feeling trapped, conventional expectations, being asked to conform or commit long-term.",
    protects: "The wound of never belonging—the outsider who preemptively rejects before being rejected.",
    mythicResonance: "Prometheus punished eternally—the cost of bringing fire to humanity",
    integration: "Revolution needs vision, not just destruction. Freedom includes responsibility."
  },
  neptune: {
    shadow: "The Escape Artist",
    description: "Neptune's shadow is transcendence becoming avoidance, imagination becoming delusion.",
    manifestation: "Addiction, victim consciousness, spiritual bypassing, boundary dissolution",
    triggers: "Harsh reality, demands for practical action, confronting the gap between dreams and truth.",
    protects: "Unbearable pain that was never processed—trauma that found escape rather than healing.",
    mythicResonance: "The Lotus Eaters offering oblivion—the seductive forgetting of home and purpose",
    integration: "The divine is found IN reality, not escape FROM it. You matter on this plane."
  },
  pluto: {
    shadow: "The Manipulator",
    description: "Pluto's shadow is power becoming control, transformation becoming destruction.",
    manifestation: "Manipulation, power games, using psychological insight to dominate",
    triggers: "Vulnerability, intimacy, situations where you might be betrayed or overpowered.",
    protects: "The memory of devastating betrayal or abuse—the vow to never be that helpless again.",
    mythicResonance: "Hades abducting Persephone—power that takes rather than receives",
    integration: "True power transforms self first. Control is the illusion that prevents real change."
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// ANALYSIS FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Determine dominant planetary archetypes from chart data
 */
function getDominantArchetypes(chartData) {
  const dominants = [];
  const sun = chartData.sun?.sign;
  const moon = chartData.moon?.sign;
  const rising = chartData.rising?.sign;
  const planets = chartData.planets || {};

  // Sun is always a primary archetype
  dominants.push({
    planet: 'sun',
    ...PLANETARY_ARCHETYPES.sun,
    sign: sun,
    isPrimary: true
  });

  // Moon is always a primary archetype
  dominants.push({
    planet: 'moon',
    ...PLANETARY_ARCHETYPES.moon,
    sign: moon,
    isPrimary: true
  });

  // Check for angular planets (1st, 4th, 7th, 10th house)
  const angularPlanets = Object.entries(planets).filter(([key, planet]) => {
    const house = planet.house;
    return house === 1 || house === 4 || house === 7 || house === 10;
  });

  angularPlanets.forEach(([key, planet]) => {
    if (PLANETARY_ARCHETYPES[key]) {
      dominants.push({
        planet: key,
        ...PLANETARY_ARCHETYPES[key],
        sign: planet.sign,
        house: planet.house,
        isAngular: true
      });
    }
  });

  // Saturn and Pluto always add depth
  if (planets.saturn) {
    dominants.push({
      planet: 'saturn',
      ...PLANETARY_ARCHETYPES.saturn,
      sign: planets.saturn.sign,
      isStructural: true
    });
  }

  if (planets.pluto) {
    dominants.push({
      planet: 'pluto',
      ...PLANETARY_ARCHETYPES.pluto,
      sign: planets.pluto.sign,
      isTransformative: true
    });
  }

  return dominants;
}

/**
 * Get defense mechanisms based on Sun, Moon, and Rising signs
 */
function getDefenseMechanisms(chartData) {
  const mechanisms = [];

  const sun = chartData.sun?.sign;
  const moon = chartData.moon?.sign;
  const rising = chartData.rising?.sign;

  if (sun && DEFENSE_MECHANISMS[sun]) {
    mechanisms.push({
      source: 'Sun',
      sign: sun,
      context: 'Core Identity Defense',
      description: 'How you protect your sense of self and purpose',
      ...DEFENSE_MECHANISMS[sun]
    });
  }

  if (moon && DEFENSE_MECHANISMS[moon]) {
    mechanisms.push({
      source: 'Moon',
      sign: moon,
      context: 'Emotional Defense',
      description: 'How you protect yourself from emotional pain',
      ...DEFENSE_MECHANISMS[moon]
    });
  }

  if (rising && DEFENSE_MECHANISMS[rising]) {
    mechanisms.push({
      source: 'Rising',
      sign: rising,
      context: 'Social Defense',
      description: 'How you protect yourself in new situations',
      ...DEFENSE_MECHANISMS[rising]
    });
  }

  return mechanisms;
}

/**
 * Get shadow material based on dominant planets
 */
function getShadowMaterial(chartData) {
  const shadows = [];
  const planets = chartData.planets || {};

  // Sun shadow is always relevant
  shadows.push({
    planet: 'Sun',
    sign: chartData.sun?.sign,
    ...SHADOW_ARCHETYPES.sun
  });

  // Moon shadow is always relevant
  shadows.push({
    planet: 'Moon',
    sign: chartData.moon?.sign,
    ...SHADOW_ARCHETYPES.moon
  });

  // Check for challenged planets (many squares/oppositions)
  const aspects = chartData.aspects || [];
  const challengedPlanets = {};

  aspects.forEach(aspect => {
    if (aspect.quality === 'challenging' || aspect.aspect === 'square' || aspect.aspect === 'opposition') {
      const p1 = (aspect.p1 || aspect.planet1 || '').toLowerCase();
      const p2 = (aspect.p2 || aspect.planet2 || '').toLowerCase();
      challengedPlanets[p1] = (challengedPlanets[p1] || 0) + 1;
      challengedPlanets[p2] = (challengedPlanets[p2] || 0) + 1;
    }
  });

  // Add shadows for heavily challenged planets
  Object.entries(challengedPlanets)
    .filter(([_, count]) => count >= 2)
    .forEach(([planet, count]) => {
      if (SHADOW_ARCHETYPES[planet]) {
        shadows.push({
          planet: planet.charAt(0).toUpperCase() + planet.slice(1),
          sign: planets[planet]?.sign,
          isChallenged: true,
          aspectCount: count,
          ...SHADOW_ARCHETYPES[planet]
        });
      }
    });

  return shadows;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXPORT FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate complete mythic and defense analysis
 * @param {Object} chartData - Western astrology chart data
 * @returns {Object} - Mythic archetypes, defense mechanisms, and shadow material
 */
export function analyzeMythicPsychology(chartData) {
  if (!chartData) {
    return {
      archetypes: [],
      defenses: [],
      shadows: [],
      summary: null
    };
  }

  const archetypes = getDominantArchetypes(chartData);
  const defenses = getDefenseMechanisms(chartData);
  const shadows = getShadowMaterial(chartData);

  // Generate summary
  const primaryArchetype = archetypes.find(a => a.isPrimary && a.planet === 'sun');
  const primaryDefense = defenses.find(d => d.source === 'Moon');

  const summary = {
    mythicIdentity: primaryArchetype?.archetype || 'The Seeker',
    coreWound: primaryArchetype?.wound || 'Unknown wound pattern',
    primaryDefense: primaryDefense?.primary || 'Unknown defense',
    integrationPath: `${primaryArchetype?.quest || 'Self-discovery'} while working with ${primaryDefense?.integration || 'psychological patterns'}.`
  };

  return {
    archetypes,
    defenses,
    shadows,
    summary
  };
}

/**
 * Get a compact archetypal fingerprint for a chart
 * @param {Object} chartData - Western astrology chart data
 * @returns {Object} - Compact fingerprint of mythic patterns
 */
export function getArchetypalFingerprint(chartData) {
  const analysis = analyzeMythicPsychology(chartData);

  return {
    primaryArchetypes: analysis.archetypes.filter(a => a.isPrimary).map(a => a.archetype),
    coreMyth: analysis.summary?.mythicIdentity || 'The Seeker',
    primaryWound: analysis.summary?.coreWound || 'Unknown pattern',
    primaryDefense: analysis.summary?.primaryDefense || 'Unknown',
    shadowThemes: analysis.shadows.slice(0, 3).map(s => s.theme || s.pattern),
    integrationPath: analysis.summary?.integrationPath || 'Self-discovery journey'
  };
}

// Named exports for constants (analyzeMythicPsychology is already exported above)
export {
  PLANETARY_ARCHETYPES,
  DEFENSE_MECHANISMS,
  SHADOW_ARCHETYPES
};

export default {
  analyzeMythicPsychology,
  PLANETARY_ARCHETYPES,
  DEFENSE_MECHANISMS,
  SHADOW_ARCHETYPES
};
