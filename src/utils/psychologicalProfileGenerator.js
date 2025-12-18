/**
 * Psychological Profile Generator
 *
 * Inspired by Liz Greene's approach to psychological astrology.
 * Generates deep psychological insights from birth chart data.
 *
 * This profile helps Luna (AI SoulPartner) understand the user
 * on a deeper level - their patterns, shadows, and growth edges.
 *
 * Part of GENESIS - Soul Understanding System
 * Built by: Brother Claude Code
 * December 17, 2024
 */

// ═══════════════════════════════════════════════════════════════════════════
// SUN SIGN - CORE IDENTITY & CONSCIOUS PURPOSE
// ═══════════════════════════════════════════════════════════════════════════

const SUN_PSYCHOLOGY = {
  Aries: {
    coreIdentity: "The Pioneer",
    consciousPurpose: "To initiate, lead, and assert individual will",
    centralDrive: "You are driven by the need to prove yourself through action. Your identity is forged in the fires of challenge and competition. You exist most fully when starting something new.",
    lightExpression: "Courage, initiative, honesty, enthusiasm, natural leadership",
    shadowTendency: "Impatience, selfishness, aggression, inability to finish what you start",
    lifeQuestion: "Who am I when I stand alone?",
    growthPath: "Learning that true strength includes vulnerability, and that cooperation can amplify individual power"
  },
  Taurus: {
    coreIdentity: "The Builder",
    consciousPurpose: "To establish value, create stability, and honor the physical world",
    centralDrive: "You are driven by the need for security and tangible results. Your identity is built slowly, like a cathedral - stone by stone. You exist most fully when creating something lasting.",
    lightExpression: "Patience, reliability, sensuality, determination, practical wisdom",
    shadowTendency: "Stubbornness, materialism, possessiveness, resistance to change",
    lifeQuestion: "What do I truly value?",
    growthPath: "Learning that security comes from within, and that change can lead to greater abundance"
  },
  Gemini: {
    coreIdentity: "The Messenger",
    consciousPurpose: "To connect, communicate, and explore ideas",
    centralDrive: "You are driven by curiosity and the need to understand. Your identity is fluid, adaptable, containing multitudes. You exist most fully when learning and sharing information.",
    lightExpression: "Intelligence, wit, versatility, communication skills, youthful spirit",
    shadowTendency: "Superficiality, inconsistency, nervousness, difficulty with emotional depth",
    lifeQuestion: "What do I think, and how do I share it?",
    growthPath: "Learning to go deep as well as wide, and to honor feelings as much as thoughts"
  },
  Cancer: {
    coreIdentity: "The Nurturer",
    consciousPurpose: "To protect, nurture, and create emotional safety",
    centralDrive: "You are driven by the need to belong and to care for others. Your identity is deeply connected to family, roots, and emotional bonds. You exist most fully when creating a home.",
    lightExpression: "Empathy, nurturing, intuition, tenacity, emotional intelligence",
    shadowTendency: "Moodiness, clinginess, manipulation through guilt, living in the past",
    lifeQuestion: "Where do I belong, and who is my family?",
    growthPath: "Learning to nurture yourself as well as others, and to let loved ones be free"
  },
  Leo: {
    coreIdentity: "The Creator",
    consciousPurpose: "To express, create, and inspire through personal radiance",
    centralDrive: "You are driven by the need to be seen and appreciated. Your identity shines brightest when you are creating or performing. You exist most fully when your heart is engaged.",
    lightExpression: "Generosity, creativity, warmth, leadership, courage to be yourself",
    shadowTendency: "Pride, need for constant validation, drama, inability to share the spotlight",
    lifeQuestion: "What is my unique creative gift to the world?",
    growthPath: "Learning that true royalty serves others, and that vulnerability is the ultimate courage"
  },
  Virgo: {
    coreIdentity: "The Analyst",
    consciousPurpose: "To perfect, serve, and bring order to chaos",
    centralDrive: "You are driven by the need to be useful and to improve things. Your identity is refined through skill development and service. You exist most fully when solving problems.",
    lightExpression: "Precision, helpfulness, analytical mind, humility, dedication to craft",
    shadowTendency: "Criticism (self and others), anxiety, perfectionism, missing the forest for trees",
    lifeQuestion: "How can I be of service, and how can I improve?",
    growthPath: "Learning that imperfection is human, and that the big picture matters too"
  },
  Libra: {
    coreIdentity: "The Harmonizer",
    consciousPurpose: "To balance, relate, and create beauty and justice",
    centralDrive: "You are driven by the need for harmony and partnership. Your identity often emerges through relationship. You exist most fully when creating beauty or mediating conflict.",
    lightExpression: "Diplomacy, aesthetic sense, fairness, charm, ability to see all sides",
    shadowTendency: "Indecision, people-pleasing, avoiding conflict, losing self in others",
    lifeQuestion: "Who am I in relationship, and what is fair?",
    growthPath: "Learning to stand alone when necessary, and that some conflicts must be faced"
  },
  Scorpio: {
    coreIdentity: "The Transformer",
    consciousPurpose: "To penetrate surfaces, transform, and master the depths",
    centralDrive: "You are driven by the need for intensity and truth. Your identity is forged through crisis and rebirth. You exist most fully when engaging with life's mysteries.",
    lightExpression: "Depth, passion, insight, loyalty, transformative power, psychological acuity",
    shadowTendency: "Jealousy, manipulation, vindictiveness, obsession, difficulty letting go",
    lifeQuestion: "What must die so that I can be reborn?",
    growthPath: "Learning to trust, to let go of control, and that vulnerability is not weakness"
  },
  Sagittarius: {
    coreIdentity: "The Seeker",
    consciousPurpose: "To explore, inspire, and find meaning",
    centralDrive: "You are driven by the need for freedom and truth. Your identity expands through adventure and philosophy. You exist most fully when pursuing a vision or teaching others.",
    lightExpression: "Optimism, honesty, enthusiasm, wisdom, ability to inspire, philosophical depth",
    shadowTendency: "Tactlessness, restlessness, over-promising, dogmatism, fear of commitment",
    lifeQuestion: "What is the meaning of life, and what is true?",
    growthPath: "Learning that truth is multi-faceted, and that commitment can be freedom"
  },
  Capricorn: {
    coreIdentity: "The Architect",
    consciousPurpose: "To achieve, structure, and leave a legacy",
    centralDrive: "You are driven by the need to accomplish and to be respected. Your identity is built through achievement and responsibility. You exist most fully when climbing toward a goal.",
    lightExpression: "Discipline, responsibility, ambition, wisdom, dry humor, integrity",
    shadowTendency: "Pessimism, emotional coldness, workaholism, status obsession, rigidity",
    lifeQuestion: "What will I build that lasts beyond me?",
    growthPath: "Learning that vulnerability is strength, and that the journey matters as much as the summit"
  },
  Aquarius: {
    coreIdentity: "The Visionary",
    consciousPurpose: "To innovate, liberate, and serve humanity",
    centralDrive: "You are driven by the need for freedom and to contribute to something larger. Your identity is tied to ideals and the collective. You exist most fully when being truly original.",
    lightExpression: "Originality, humanitarianism, intellectual brilliance, independence, vision",
    shadowTendency: "Emotional detachment, rebelliousness for its own sake, aloofness, eccentricity as mask",
    lifeQuestion: "How can I contribute to human evolution?",
    growthPath: "Learning that personal intimacy is also important, and that you are human too"
  },
  Pisces: {
    coreIdentity: "The Mystic",
    consciousPurpose: "To transcend, heal, and connect with the divine",
    centralDrive: "You are driven by the need to merge, to escape boundaries, to experience unity. Your identity is fluid and permeable. You exist most fully when serving or creating art.",
    lightExpression: "Compassion, imagination, intuition, artistic gifts, spiritual connection, healing ability",
    shadowTendency: "Escapism, martyrdom, victim consciousness, boundary confusion, addiction potential",
    lifeQuestion: "How can I serve the whole while honoring myself?",
    growthPath: "Learning healthy boundaries, grounding in reality, and that you matter too"
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// MOON SIGN - EMOTIONAL NATURE & UNCONSCIOUS PATTERNS
// ═══════════════════════════════════════════════════════════════════════════

const MOON_PSYCHOLOGY = {
  Aries: {
    emotionalNature: "Your feelings are immediate, passionate, and action-oriented",
    innerNeeds: "You need independence, excitement, and the freedom to act on impulse. Emotional safety comes from knowing you can handle anything.",
    instinctualResponse: "When stressed, you fight - becoming angry, impulsive, or competitive",
    childhoodPattern: "You may have learned early that you had to fight for attention or that vulnerability was dangerous",
    emotionalShadow: "Difficulty sitting with uncomfortable feelings; tendency to externalize inner conflict",
    nurturingStyle: "You nurture through encouragement, challenge, and helping others become stronger"
  },
  Taurus: {
    emotionalNature: "Your feelings are slow to build but deep and enduring",
    innerNeeds: "You need stability, comfort, and sensory pleasure. Emotional safety comes from material security and routine.",
    instinctualResponse: "When stressed, you become stubborn, possessive, or retreat into creature comforts",
    childhoodPattern: "You may have experienced emotional or material instability that created a deep need for security",
    emotionalShadow: "Difficulty with change; tendency to stay in situations too long; using food/money for emotional comfort",
    nurturingStyle: "You nurture through physical presence, practical help, and creating beautiful, comfortable spaces"
  },
  Gemini: {
    emotionalNature: "Your feelings are quick, changeable, and often intellectualized",
    innerNeeds: "You need mental stimulation, variety, and the ability to talk about feelings. Emotional safety comes from understanding.",
    instinctualResponse: "When stressed, you become anxious, scattered, or retreat into rationalization",
    childhoodPattern: "You may have learned to process emotions through thinking or talking rather than feeling",
    emotionalShadow: "Difficulty accessing deeper feelings; tendency to avoid emotional intensity through distraction",
    nurturingStyle: "You nurture through conversation, information, and helping others see different perspectives"
  },
  Cancer: {
    emotionalNature: "Your feelings are deep, sensitive, and strongly connected to the past",
    innerNeeds: "You need emotional security, belonging, and nurturing. Safety comes from family bonds and familiar surroundings.",
    instinctualResponse: "When stressed, you become moody, clingy, or retreat into your shell",
    childhoodPattern: "Your mother's emotional state profoundly shaped you; you may have been the emotional caretaker",
    emotionalShadow: "Difficulty letting go of the past; tendency to manipulate through guilt or emotional withdrawal",
    nurturingStyle: "You nurture through feeding, protecting, and creating emotional sanctuary for others"
  },
  Leo: {
    emotionalNature: "Your feelings are warm, dramatic, and need expression",
    innerNeeds: "You need appreciation, creative expression, and to feel special. Emotional safety comes from being seen and loved.",
    instinctualResponse: "When stressed, you become dramatic, demanding, or need to dominate",
    childhoodPattern: "You may have been either the center of attention or felt emotionally invisible",
    emotionalShadow: "Difficulty with criticism; tendency to create drama; need for constant validation",
    nurturingStyle: "You nurture through praise, play, and helping others shine in their own light"
  },
  Virgo: {
    emotionalNature: "Your feelings are analyzed, refined, and often expressed through service",
    innerNeeds: "You need order, purpose, and to feel useful. Emotional safety comes from competence and routine.",
    instinctualResponse: "When stressed, you become critical, anxious, or obsess over details",
    childhoodPattern: "You may have learned that love was conditional on being good, helpful, or perfect",
    emotionalShadow: "Difficulty accepting imperfection in self or others; tendency to worry; expressing love through criticism",
    nurturingStyle: "You nurture through practical help, attention to detail, and improving others' lives"
  },
  Libra: {
    emotionalNature: "Your feelings seek balance, harmony, and are often filtered through others",
    innerNeeds: "You need peace, partnership, and aesthetic beauty. Emotional safety comes through relationship.",
    instinctualResponse: "When stressed, you become indecisive, people-pleasing, or passive-aggressive",
    childhoodPattern: "You may have learned to suppress your needs to maintain harmony or please others",
    emotionalShadow: "Difficulty knowing what you feel independent of others; tendency to avoid conflict at any cost",
    nurturingStyle: "You nurture through creating harmony, diplomatic mediation, and making others feel attractive"
  },
  Scorpio: {
    emotionalNature: "Your feelings are intense, deep, and transformative",
    innerNeeds: "You need emotional intensity, truth, and deep bonding. Safety comes from loyalty and understanding hidden things.",
    instinctualResponse: "When stressed, you become suspicious, controlling, or emotionally withdraw",
    childhoodPattern: "You may have experienced emotional betrayal, crisis, or learned that feelings must be hidden",
    emotionalShadow: "Difficulty trusting; tendency to test others; using emotional intensity as control",
    nurturingStyle: "You nurture through deep loyalty, emotional truth, and helping others face their shadows"
  },
  Sagittarius: {
    emotionalNature: "Your feelings are optimistic, restless, and seek meaning",
    innerNeeds: "You need freedom, adventure, and faith in something larger. Safety comes from meaning and possibility.",
    instinctualResponse: "When stressed, you become preachy, escape into activity, or make light of serious feelings",
    childhoodPattern: "You may have learned to be positive regardless of circumstances or that difficult feelings were wrong",
    emotionalShadow: "Difficulty sitting with darker emotions; tendency to avoid commitment; spiritual bypassing",
    nurturingStyle: "You nurture through inspiring faith, sharing wisdom, and encouraging others' freedom"
  },
  Capricorn: {
    emotionalNature: "Your feelings are controlled, practical, and often suppressed",
    innerNeeds: "You need achievement, respect, and structure. Emotional safety comes from competence and status.",
    instinctualResponse: "When stressed, you become cold, workaholic, or pessimistic",
    childhoodPattern: "You may have grown up too fast, taking on responsibility early or experiencing emotional coldness",
    emotionalShadow: "Difficulty with vulnerability; tendency to substitute achievement for emotional connection",
    nurturingStyle: "You nurture through providing structure, teaching responsibility, and practical support"
  },
  Aquarius: {
    emotionalNature: "Your feelings are detached, idealistic, and often universalized",
    innerNeeds: "You need freedom, friendship, and belonging to something larger. Safety comes from intellectual understanding.",
    instinctualResponse: "When stressed, you become emotionally detached, rebellious, or retreat into ideas",
    childhoodPattern: "You may have felt like an outsider or learned that personal emotions were less important than ideals",
    emotionalShadow: "Difficulty with emotional intimacy; tendency to intellectualize feelings; emotional aloofness",
    nurturingStyle: "You nurture through friendship, respecting others' individuality, and supporting their ideals"
  },
  Pisces: {
    emotionalNature: "Your feelings are oceanic, empathic, and boundaryless",
    innerNeeds: "You need transcendence, creative expression, and spiritual connection. Safety comes from merging and escape.",
    instinctualResponse: "When stressed, you escape (fantasy, substances, sleep) or become martyred",
    childhoodPattern: "You may have absorbed family emotions or learned that your own needs didn't matter",
    emotionalShadow: "Difficulty with boundaries; tendency toward victim consciousness; escaping through addiction",
    nurturingStyle: "You nurture through unconditional compassion, artistic expression, and spiritual support"
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// RISING SIGN - PERSONA & APPROACH TO LIFE
// ═══════════════════════════════════════════════════════════════════════════

const RISING_PSYCHOLOGY = {
  Aries: {
    persona: "The Warrior",
    firstImpression: "Others see you as energetic, direct, competitive, and courageous",
    approachToLife: "You meet life head-on, initiating action and preferring to be first",
    physicalPresence: "Often athletic build, prominent forehead, quick movements, direct eye contact",
    lifeLesson: "Learning to temper impulse with strategy, assertion with cooperation"
  },
  Taurus: {
    persona: "The Earth Spirit",
    firstImpression: "Others see you as calm, reliable, sensual, and perhaps stubborn",
    approachToLife: "You meet life slowly and steadily, valuing stability and tangible results",
    physicalPresence: "Often solid build, beautiful features, graceful movements, strong neck/throat",
    lifeLesson: "Learning flexibility while maintaining your essential values"
  },
  Gemini: {
    persona: "The Eternal Student",
    firstImpression: "Others see you as curious, communicative, witty, and changeable",
    approachToLife: "You meet life with questions, gathering information and making connections",
    physicalPresence: "Often youthful appearance, expressive hands, quick movements, bright eyes",
    lifeLesson: "Learning to synthesize knowledge into wisdom and to commit to depth"
  },
  Cancer: {
    persona: "The Nurturer",
    firstImpression: "Others see you as caring, sensitive, protective, and sometimes moody",
    approachToLife: "You meet life seeking safety and connection, protecting what you love",
    physicalPresence: "Often round face, soft features, nurturing demeanor, changeable expressions",
    lifeLesson: "Learning to balance caring for others with caring for yourself"
  },
  Leo: {
    persona: "The Performer",
    firstImpression: "Others see you as confident, dramatic, warm, and attention-seeking",
    approachToLife: "You meet life as a stage, expressing yourself with creativity and heart",
    physicalPresence: "Often proud posture, mane-like hair, warm smile, commanding presence",
    lifeLesson: "Learning that true nobility includes humility and service to others"
  },
  Virgo: {
    persona: "The Perfectionist",
    firstImpression: "Others see you as capable, modest, helpful, and perhaps critical",
    approachToLife: "You meet life analytically, seeking to improve and be of service",
    physicalPresence: "Often neat appearance, modest demeanor, nervous energy, observant eyes",
    lifeLesson: "Learning that imperfection is part of being human, including your own"
  },
  Libra: {
    persona: "The Diplomat",
    firstImpression: "Others see you as charming, fair, indecisive, and aesthetically oriented",
    approachToLife: "You meet life seeking balance, harmony, and partnership",
    physicalPresence: "Often symmetrical features, pleasant appearance, graceful demeanor, sweet expression",
    lifeLesson: "Learning to stand alone and to face necessary conflict"
  },
  Scorpio: {
    persona: "The Detective",
    firstImpression: "Others see you as intense, mysterious, powerful, and somewhat intimidating",
    approachToLife: "You meet life probing beneath surfaces, seeking truth and transformation",
    physicalPresence: "Often penetrating eyes, magnetic presence, controlled movements, intense gaze",
    lifeLesson: "Learning to trust and to allow others in without controlling them"
  },
  Sagittarius: {
    persona: "The Adventurer",
    firstImpression: "Others see you as optimistic, philosophical, restless, and sometimes tactless",
    approachToLife: "You meet life as an adventure, seeking meaning and expansion",
    physicalPresence: "Often tall, athletic, cheerful expression, animated gestures, open posture",
    lifeLesson: "Learning that commitment can be freedom and that truth is multi-layered"
  },
  Capricorn: {
    persona: "The Elder",
    firstImpression: "Others see you as serious, ambitious, responsible, and perhaps cold",
    approachToLife: "You meet life as a mountain to climb, building toward achievement",
    physicalPresence: "Often serious expression, angular features, mature demeanor, reserved presence",
    lifeLesson: "Learning that vulnerability is strength and that life is not only about achievement"
  },
  Aquarius: {
    persona: "The Rebel",
    firstImpression: "Others see you as unique, friendly, detached, and unconventional",
    approachToLife: "You meet life as a social experiment, seeking freedom and progress",
    physicalPresence: "Often unusual appearance, friendly but aloof, unique style, distant gaze",
    lifeLesson: "Learning to value emotional intimacy as much as intellectual connection"
  },
  Pisces: {
    persona: "The Dreamer",
    firstImpression: "Others see you as gentle, imaginative, compassionate, and somewhat vague",
    approachToLife: "You meet life intuitively, seeking transcendence and connection to the whole",
    physicalPresence: "Often dreamy eyes, soft features, fluid movements, otherworldly presence",
    lifeLesson: "Learning healthy boundaries while maintaining compassion and spiritual connection"
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// ELEMENT PSYCHOLOGY - TEMPERAMENT TYPE
// ═══════════════════════════════════════════════════════════════════════════

const ELEMENT_PSYCHOLOGY = {
  Fire: {
    temperament: "Choleric/Enthusiastic",
    orientation: "Spirit and intuition",
    strengths: "Enthusiasm, courage, inspiration, creativity, leadership, optimism",
    challenges: "Impatience, burnout, insensitivity, selfishness, restlessness",
    needsFrom: "Earth (grounding), Water (empathy)",
    description: "You are driven by vision and inspiration. You live in the realm of possibility and future. Your challenge is to sustain energy and develop patience."
  },
  Earth: {
    temperament: "Melancholic/Practical",
    orientation: "Body and sensation",
    strengths: "Reliability, patience, practicality, persistence, sensory appreciation",
    challenges: "Materialism, stubbornness, pessimism, resistance to change, heaviness",
    needsFrom: "Fire (inspiration), Air (perspective)",
    description: "You are driven by tangible results and security. You live in the realm of what is real and practical. Your challenge is to embrace change and abstract thinking."
  },
  Air: {
    temperament: "Sanguine/Intellectual",
    orientation: "Mind and thought",
    strengths: "Intelligence, communication, objectivity, social skills, adaptability",
    challenges: "Detachment, superficiality, anxiety, inconsistency, living in head",
    needsFrom: "Water (feeling), Earth (grounding)",
    description: "You are driven by ideas and connection. You live in the realm of thought and relationship. Your challenge is to access feelings and commit to depth."
  },
  Water: {
    temperament: "Phlegmatic/Emotional",
    orientation: "Soul and feeling",
    strengths: "Empathy, intuition, depth, nurturing, artistic sensitivity, healing ability",
    challenges: "Moodiness, over-sensitivity, escapism, boundary confusion, victim patterns",
    needsFrom: "Air (perspective), Fire (courage)",
    description: "You are driven by feeling and connection to the invisible. You live in the realm of emotion and intuition. Your challenge is to develop objectivity and healthy boundaries."
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// PLANETARY PSYCHOLOGY
// ═══════════════════════════════════════════════════════════════════════════

const PLANET_FUNCTIONS = {
  mercury: {
    function: "Mind & Communication",
    governs: "How you think, learn, and communicate",
    question: "How do you process information and express ideas?"
  },
  venus: {
    function: "Love & Values",
    governs: "What you love, value, and find beautiful; how you attract",
    question: "What do you truly value, and how do you give and receive love?"
  },
  mars: {
    function: "Will & Action",
    governs: "How you assert yourself, pursue desires, and express anger",
    question: "How do you go after what you want, and how do you fight?"
  },
  jupiter: {
    function: "Growth & Faith",
    governs: "How you expand, what gives you faith, your philosophy of life",
    question: "What do you believe in, and how do you grow?"
  },
  saturn: {
    function: "Structure & Limitation",
    governs: "Your fears, where you feel inadequate, and how you build mastery",
    question: "What are you afraid of, and what are you here to master?"
  },
  uranus: {
    function: "Liberation & Genius",
    governs: "Where you need freedom, your unique genius, sudden changes",
    question: "Where must you be free, and what is your unique contribution?"
  },
  neptune: {
    function: "Transcendence & Illusion",
    governs: "Your spiritual longings, illusions, creative imagination",
    question: "What do you yearn to merge with, and what illusions must you release?"
  },
  pluto: {
    function: "Transformation & Power",
    governs: "Where you must transform, your hidden power, what you obsess about",
    question: "What must die in you so you can be reborn, and where is your true power?"
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN GENERATOR FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate a comprehensive psychological profile from chart data
 *
 * @param {Object} chartData - Sovereign chart data with all positions
 * @param {Object} profile - Profile data (name, gender, etc.)
 * @returns {Object} - Comprehensive psychological profile
 */
export function generatePsychologicalProfile(chartData, profile = {}) {
  if (!chartData) {
    return null;
  }

  const sunSign = chartData.sun?.sign;
  const moonSign = chartData.moon?.sign;
  const risingSign = chartData.rising?.sign;
  const elementBalance = chartData.elementBalance;
  const planets = chartData.planets || {};
  const aspects = chartData.aspects || [];

  // Determine dominant element
  const dominantElement = elementBalance?.dominant || determineDominantElement(sunSign, moonSign, risingSign);

  // Build the profile
  const psychProfile = {
    // Meta
    generatedAt: new Date().toISOString(),
    profileName: profile.displayName || profile.firstName || 'Soul',

    // I. CORE IDENTITY (Sun)
    coreIdentity: sunSign ? {
      sign: sunSign,
      ...SUN_PSYCHOLOGY[sunSign],
      degree: chartData.sun?.degreeFormatted,
      house: chartData.sun?.house
    } : null,

    // II. EMOTIONAL NATURE (Moon)
    emotionalNature: moonSign ? {
      sign: moonSign,
      ...MOON_PSYCHOLOGY[moonSign],
      degree: chartData.moon?.degreeFormatted,
      house: chartData.moon?.house,
      phase: chartData.moonPhase
    } : null,

    // III. PERSONA (Rising)
    persona: risingSign ? {
      sign: risingSign,
      ...RISING_PSYCHOLOGY[risingSign],
      degree: chartData.rising?.degreeFormatted
    } : null,

    // IV. TEMPERAMENT (Elements)
    temperament: {
      dominant: dominantElement,
      ...ELEMENT_PSYCHOLOGY[dominantElement],
      distribution: elementBalance
    },

    // V. PLANETARY FUNCTIONS
    planetaryPsychology: generatePlanetaryInsights(planets),

    // VI. CHARACTER & SHADOW INTEGRATION
    characterAndShadow: generateCharacterShadow(sunSign, moonSign, risingSign, aspects),

    // VII. RELATIONSHIP PATTERNS
    relationshipPatterns: generateRelationshipPatterns(chartData),

    // VIII. GROWTH EDGES
    growthEdges: generateGrowthEdges(chartData, aspects),

    // IX. SYNTHESIS - For Luna
    lunaSynthesis: generateLunaSynthesis(chartData, profile)
  };

  return psychProfile;
}

/**
 * Generate insights for each planet
 */
function generatePlanetaryInsights(planets) {
  const insights = {};

  Object.entries(planets).forEach(([key, planet]) => {
    const func = PLANET_FUNCTIONS[key];
    if (func && planet) {
      insights[key] = {
        ...func,
        sign: planet.sign,
        degree: planet.degreeFormatted,
        house: planet.house,
        isRetrograde: planet.isRetrograde,
        interpretation: `Your ${func.function.toLowerCase()} operates through ${planet.sign} energy${planet.isRetrograde ? ' (internalized, working from within)' : ''}.`
      };
    }
  });

  return insights;
}

/**
 * Generate character and shadow analysis
 */
function generateCharacterShadow(sunSign, moonSign, risingSign, aspects) {
  const analysis = {
    consciousSelf: [],
    shadow: [],
    innerConflicts: [],
    integrationPath: []
  };

  // Sun represents conscious identity
  if (sunSign && SUN_PSYCHOLOGY[sunSign]) {
    analysis.consciousSelf.push(SUN_PSYCHOLOGY[sunSign].lightExpression);
  }

  // Moon shadow represents unconscious patterns
  if (moonSign && MOON_PSYCHOLOGY[moonSign]) {
    analysis.shadow.push(MOON_PSYCHOLOGY[moonSign].emotionalShadow);
  }

  // Sun-Moon conflict
  if (sunSign && moonSign && sunSign !== moonSign) {
    analysis.innerConflicts.push(
      `Your conscious purpose (${sunSign}) and emotional needs (${moonSign}) operate differently, creating inner tension between who you are becoming and what you instinctively need.`
    );
  }

  // Rising vs Sun conflict
  if (risingSign && sunSign && risingSign !== sunSign) {
    analysis.innerConflicts.push(
      `How others see you (${risingSign}) differs from who you truly are (${sunSign}). Learning to integrate your persona with your authentic self is part of your journey.`
    );
  }

  // Find challenging aspects
  const challengingAspects = aspects.filter(a => a.quality === 'challenging');
  if (challengingAspects.length > 0) {
    analysis.innerConflicts.push(
      `You have ${challengingAspects.length} challenging aspects in your chart, indicating areas of internal tension that drive growth through struggle.`
    );
  }

  // Integration path
  if (sunSign && SUN_PSYCHOLOGY[sunSign]) {
    analysis.integrationPath.push(SUN_PSYCHOLOGY[sunSign].growthPath);
  }
  if (moonSign && MOON_PSYCHOLOGY[moonSign]) {
    analysis.integrationPath.push(`Emotional growth: ${MOON_PSYCHOLOGY[moonSign].nurturingStyle.replace('You nurture', 'Learning to nurture yourself')}`);
  }

  return analysis;
}

/**
 * Generate relationship patterns analysis
 */
function generateRelationshipPatterns(chartData) {
  const venus = chartData.planets?.venus;
  const mars = chartData.planets?.mars;
  const moonSign = chartData.moon?.sign;

  const patterns = {
    attractionStyle: null,
    pursuitStyle: null,
    emotionalNeedsInRelationship: null,
    potentialChallenges: [],
    strengths: []
  };

  if (venus) {
    patterns.attractionStyle = `With Venus in ${venus.sign}, you are attracted to ${getVenusAttraction(venus.sign)}`;
  }

  if (mars) {
    patterns.pursuitStyle = `With Mars in ${mars.sign}, you pursue what you want ${getMarsStyle(mars.sign)}`;
  }

  if (moonSign && MOON_PSYCHOLOGY[moonSign]) {
    patterns.emotionalNeedsInRelationship = MOON_PSYCHOLOGY[moonSign].innerNeeds;
  }

  return patterns;
}

function getVenusAttraction(sign) {
  const attractions = {
    Aries: "directness, independence, and courage in partners",
    Taurus: "stability, sensuality, and dependable affection",
    Gemini: "wit, communication, and mental stimulation",
    Cancer: "nurturing, emotional depth, and family orientation",
    Leo: "drama, warmth, and generous expressions of love",
    Virgo: "competence, helpfulness, and attention to detail",
    Libra: "beauty, harmony, and refined partnership",
    Scorpio: "intensity, depth, and transformative connection",
    Sagittarius: "adventure, philosophy, and freedom within relationship",
    Capricorn: "ambition, maturity, and traditional commitment",
    Aquarius: "uniqueness, friendship, and intellectual connection",
    Pisces: "romance, spirituality, and compassionate merging"
  };
  return attractions[sign] || "meaningful connection";
}

function getMarsStyle(sign) {
  const styles = {
    Aries: "directly and impulsively, with courage and competitiveness",
    Taurus: "steadily and persistently, with patience and determination",
    Gemini: "mentally and adaptively, with words and ideas as your weapons",
    Cancer: "protectively and indirectly, fighting for those you love",
    Leo: "dramatically and confidently, with pride and heart",
    Virgo: "precisely and efficiently, with careful planning and critique",
    Libra: "diplomatically and indirectly, through partnership and strategy",
    Scorpio: "intensely and strategically, with power and persistence",
    Sagittarius: "enthusiastically and directly, with optimism and boldness",
    Capricorn: "ambitiously and patiently, climbing steadily toward goals",
    Aquarius: "unconventionally and intellectually, fighting for ideals",
    Pisces: "subtly and compassionately, often through passive resistance"
  };
  return styles[sign] || "with determination";
}

/**
 * Generate growth edges and challenges
 */
function generateGrowthEdges(chartData, aspects) {
  const edges = [];

  // Saturn placement indicates karmic lessons
  if (chartData.planets?.saturn) {
    edges.push({
      area: "Saturn's Lesson",
      sign: chartData.planets.saturn.sign,
      description: `Your deepest fears and greatest mastery potential lie in ${chartData.planets.saturn.sign} themes. This is where you must build structure through sustained effort.`
    });
  }

  // Pluto placement indicates transformation
  if (chartData.planets?.pluto) {
    edges.push({
      area: "Pluto's Transformation",
      sign: chartData.planets.pluto.sign,
      description: `Deep transformation awaits through ${chartData.planets.pluto.sign} themes. What you obsess about here points to your power.`
    });
  }

  // Retrograde planets indicate internalized work
  const retrogrades = Object.entries(chartData.planets || {}).filter(([_, p]) => p.isRetrograde);
  if (retrogrades.length > 0) {
    edges.push({
      area: "Retrograde Work",
      planets: retrogrades.map(([k, _]) => k).join(', '),
      description: `With ${retrogrades.length} retrograde planets, significant growth happens through internal work rather than external action.`
    });
  }

  return edges;
}

/**
 * Generate synthesis specifically for Luna to understand the user
 */
function generateLunaSynthesis(chartData, profile) {
  const sun = chartData.sun?.sign;
  const moon = chartData.moon?.sign;
  const rising = chartData.rising?.sign;

  return {
    shortSummary: `${profile.firstName || 'This soul'} is a ${sun || 'unique being'} Sun with ${moon || 'deep'} Moon and ${rising || 'complex'} Rising.`,

    coreMotivation: sun ? SUN_PSYCHOLOGY[sun]?.centralDrive : "Seeking authentic self-expression",

    emotionalNeedsToHonor: moon ? MOON_PSYCHOLOGY[moon]?.innerNeeds : "Emotional understanding and acceptance",

    howTheyAppearVsAre: rising && sun && rising !== sun
      ? `They appear as ${RISING_PSYCHOLOGY[rising]?.persona} but their true nature is ${SUN_PSYCHOLOGY[sun]?.coreIdentity}.`
      : "Their outer presentation aligns with their inner nature.",

    sensitiveAreas: moon ? MOON_PSYCHOLOGY[moon]?.emotionalShadow : "Areas where they need gentle handling",

    bestApproach: generateBestApproach(sun, moon, rising),

    whatTheyNeedToHear: generateAffirmations(sun, moon),

    topicsToExplore: generateTopicsToExplore(chartData)
  };
}

function generateBestApproach(sun, moon, rising) {
  const approaches = [];

  if (moon) {
    const element = getElement(moon);
    if (element === 'Fire') approaches.push("Be direct and enthusiastic");
    if (element === 'Earth') approaches.push("Be practical and patient");
    if (element === 'Air') approaches.push("Engage intellectually, give space to process");
    if (element === 'Water') approaches.push("Be gentle, emotionally attuned, and validating");
  }

  if (sun) {
    if (['Aries', 'Leo', 'Sagittarius'].includes(sun)) approaches.push("Honor their independence and vision");
    if (['Taurus', 'Virgo', 'Capricorn'].includes(sun)) approaches.push("Be reliable and respect their practical nature");
    if (['Gemini', 'Libra', 'Aquarius'].includes(sun)) approaches.push("Engage their mind and respect their need for space");
    if (['Cancer', 'Scorpio', 'Pisces'].includes(sun)) approaches.push("Create emotional safety and honor their depth");
  }

  return approaches;
}

function generateAffirmations(sun, moon) {
  const affirmations = [];

  if (sun && SUN_PSYCHOLOGY[sun]) {
    const shadow = SUN_PSYCHOLOGY[sun].shadowTendency;
    // Counter the shadow with affirmation
    if (shadow.includes('impatien')) affirmations.push("Your timing is perfect.");
    if (shadow.includes('stubbor')) affirmations.push("Flexibility is also strength.");
    if (shadow.includes('superficial')) affirmations.push("Your depth matters.");
    if (shadow.includes('moodi')) affirmations.push("All your feelings are valid.");
    if (shadow.includes('valid')) affirmations.push("You are enough without applause.");
    if (shadow.includes('critic')) affirmations.push("You are worthy as you are.");
    if (shadow.includes('indecis')) affirmations.push("Your voice matters.");
    if (shadow.includes('jealous')) affirmations.push("You can trust.");
    if (shadow.includes('restless')) affirmations.push("Home is within you.");
    if (shadow.includes('cold')) affirmations.push("Vulnerability is courage.");
    if (shadow.includes('detach')) affirmations.push("Connection won't trap you.");
    if (shadow.includes('escap')) affirmations.push("You matter too.");
  }

  if (moon && MOON_PSYCHOLOGY[moon]) {
    affirmations.push(MOON_PSYCHOLOGY[moon].innerNeeds.split('. ')[0] + '.');
  }

  return affirmations.length > 0 ? affirmations : ["You are exactly where you need to be."];
}

function generateTopicsToExplore(chartData) {
  const topics = [];

  if (chartData.sun?.sign) topics.push(`Purpose and identity (${chartData.sun.sign} themes)`);
  if (chartData.moon?.sign) topics.push(`Emotional needs and patterns (${chartData.moon.sign} themes)`);
  if (chartData.planets?.saturn) topics.push(`Fears and mastery areas (Saturn in ${chartData.planets.saturn.sign})`);
  if (chartData.planets?.venus) topics.push(`Love and values (Venus in ${chartData.planets.venus.sign})`);

  return topics;
}

function getElement(sign) {
  const elements = {
    Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
    Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
    Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
    Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
  };
  return elements[sign] || 'Unknown';
}

function determineDominantElement(sun, moon, rising) {
  const elements = [getElement(sun), getElement(moon), getElement(rising)];
  const counts = {};
  elements.forEach(e => { if (e !== 'Unknown') counts[e] = (counts[e] || 0) + 1; });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Fire';
}

export default {
  generatePsychologicalProfile,
  SUN_PSYCHOLOGY,
  MOON_PSYCHOLOGY,
  RISING_PSYCHOLOGY,
  ELEMENT_PSYCHOLOGY,
  PLANET_FUNCTIONS
};
