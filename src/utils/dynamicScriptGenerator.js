/**
 * dynamicScriptGenerator.js
 * =========================
 *
 * Generates personalized mythic narratives based on natal chart.
 * Part of the Liz Greene Cathedral - Phase 2: Transformative Journey
 *
 * Features:
 * - Personalized Pilgrim Journey scripts
 * - Chart-specific archetypal narratives
 * - Variable insertion for names and placements
 * - LLM-ready prompt templates
 * - Saturn cycle integration
 *
 * GENESIS AstroProfile - January 2026
 */

// =============================================================================
// ARCHETYPE MAPPINGS
// =============================================================================

const SIGN_ARCHETYPES = {
  Aries: { archetype: 'The Warrior', quality: 'courage', shadow: 'impulsiveness', element: 'fire' },
  Taurus: { archetype: 'The Builder', quality: 'patience', shadow: 'stubbornness', element: 'earth' },
  Gemini: { archetype: 'The Messenger', quality: 'curiosity', shadow: 'superficiality', element: 'air' },
  Cancer: { archetype: 'The Nurturer', quality: 'sensitivity', shadow: 'clinging', element: 'water' },
  Leo: { archetype: 'The King/Queen', quality: 'creativity', shadow: 'pride', element: 'fire' },
  Virgo: { archetype: 'The Healer', quality: 'discernment', shadow: 'criticism', element: 'earth' },
  Libra: { archetype: 'The Diplomat', quality: 'harmony', shadow: 'indecision', element: 'air' },
  Scorpio: { archetype: 'The Transformer', quality: 'depth', shadow: 'obsession', element: 'water' },
  Sagittarius: { archetype: 'The Seeker', quality: 'faith', shadow: 'excess', element: 'fire' },
  Capricorn: { archetype: 'The Elder', quality: 'mastery', shadow: 'coldness', element: 'earth' },
  Aquarius: { archetype: 'The Visionary', quality: 'innovation', shadow: 'detachment', element: 'air' },
  Pisces: { archetype: 'The Mystic', quality: 'compassion', shadow: 'escapism', element: 'water' }
};

const PLANET_FUNCTIONS = {
  Sun: { function: 'identity', question: 'Who am I?', domain: 'consciousness' },
  Moon: { function: 'emotion', question: 'What do I need?', domain: 'the unconscious' },
  Mercury: { function: 'mind', question: 'How do I think?', domain: 'communication' },
  Venus: { function: 'love', question: 'What do I value?', domain: 'relationship' },
  Mars: { function: 'will', question: 'What do I want?', domain: 'action' },
  Jupiter: { function: 'meaning', question: 'What do I believe?', domain: 'expansion' },
  Saturn: { function: 'structure', question: 'What must I master?', domain: 'limitation' },
  Uranus: { function: 'liberation', question: 'Where must I be free?', domain: 'individuation' },
  Neptune: { function: 'transcendence', question: 'What is sacred?', domain: 'dissolution' },
  Pluto: { function: 'transformation', question: 'What must die?', domain: 'power' }
};

const HOUSE_THEMES = {
  1: 'self and identity',
  2: 'resources and values',
  3: 'mind and communication',
  4: 'home and roots',
  5: 'creativity and pleasure',
  6: 'service and health',
  7: 'partnership and others',
  8: 'transformation and shared resources',
  9: 'meaning and expansion',
  10: 'career and public role',
  11: 'community and ideals',
  12: 'the unconscious and transcendence'
};

// =============================================================================
// NARRATIVE TEMPLATES
// =============================================================================

const NARRATIVE_TEMPLATES = {
  opening: {
    default: `You enter this chamber as {{sunArchetype}}, carrying within you the emotional truth of {{moonArchetype}}.
The world sees {{risingArchetype}} when you first appear, but deeper currents move beneath.
Your Saturn in {{saturnSign}} has been teaching you about {{saturnLesson}} since the day you were born.`,

    saturnReturn: `You stand at the threshold of your Saturn Return, a great initiation that comes but twice in a lifetime.
Everything built on false foundations will be tested. Everything authentic will become your bedrock.
As {{sunArchetype}} with Saturn in {{saturnSign}}, your particular test involves {{saturnLesson}}.`
  },

  wound: {
    default: `Your core wound lives in the territory of {{woundHouse}}.
Here, {{woundPlanet}} has been teaching you through {{woundLesson}}.
The shadow of {{shadowExpression}} may arise when this wound is touched.
But within this wound lies a gift—{{woundGift}}.`,

    chiron: `Chiron in {{chironSign}} marks your Wounded Healer path.
In the realm of {{chironHouse}}, you carry a wound that, once healed, becomes medicine for others.
Your particular medicine is {{chironGift}}.`
  },

  quest: {
    default: `Your hero's journey calls you toward {{northNodeSign}} themes.
You came into this life with mastery in {{southNodeSign}} matters—comfortable, familiar, but no longer sufficient.
The evolutionary direction asks you to develop {{northNodeGift}} while releasing {{southNodeRelease}}.
This is not abandonment of the past but integration into a larger whole.`,

    saturn: `Saturn in {{saturnSign}} in the {{saturnHouse}} house sets your particular quest.
You are learning to build {{saturnMastery}} through facing {{saturnFear}}.
Each challenge in this domain is an initiation, not a punishment.`
  },

  shadow: {
    default: `Your shadow speaks through {{shadowPlanet}} in {{shadowSign}}.
When triggered, you may find yourself {{shadowBehavior}}.
This is not weakness—it is the unlived self seeking expression.
What you reject in yourself, you will encounter in others until you integrate it.
The shadow's gift, once owned: {{shadowGift}}.`,

    pluto: `Pluto in {{plutoSign}} marks where your shadow has deepest roots.
Here, issues of {{plutoTheme}} will arise again and again until transformed.
The death-rebirth cycle of Pluto asks: What must die in you for your true self to be born?`
  },

  gift: {
    default: `Your gifts are woven throughout your chart, but certain threads shine brightest.
{{jupiterSign}} Jupiter brings {{jupiterGift}}.
Your trine between {{trine1}} and {{trine2}} offers natural flow in {{trineGift}}.
These are not just personal gifts—they are your contributions to the collective.`,

    sun: `Your Sun in {{sunSign}} in the {{sunHouse}} house is your central gift.
Here, you are meant to shine, to be seen, to offer {{sunGift}}.
The question is not whether you have this gift, but whether you will claim it.`
  },

  closing: {
    default: `As you stand in this chamber, remember:
You are {{sunArchetype}}, learning the lessons of {{saturnSign}} Saturn.
Your wound in {{woundArea}} is becoming your medicine.
Your shadow of {{shadowQuality}} is becoming your teacher.
Your gift of {{primaryGift}} is becoming your offering.
May you have the courage to become who you already are.`,

    blessing: `Luna whispers: "You have always been whole.
The journey is not to become something new, but to remember what you have always been.
May the stars within you align with the stars above.
May your Saturn build the foundation for your Sun to shine.
Go in peace, Pilgrim. The Cathedral is within you."`
  }
};

// =============================================================================
// SCRIPT GENERATION
// =============================================================================

/**
 * Generate personalized chamber script
 * @param {object} chartData - Natal chart data
 * @param {string} chamberId - Current chamber
 * @param {object} context - Additional context (age, transits, etc.)
 * @returns {object} - Generated script sections
 */
export function generatePersonalizedScript(chartData, chamberId, context = {}) {
  if (!chartData) {
    return { error: 'Chart data required' };
  }

  // Extract chart elements
  const elements = extractChartElements(chartData);

  // Build variable map for template replacement
  const variables = buildVariableMap(elements, context);

  // Generate each section
  const script = {
    chamberId,
    generatedAt: new Date().toISOString(),
    personalized: true,

    opening: fillTemplate(NARRATIVE_TEMPLATES.opening.default, variables),
    wound: fillTemplate(NARRATIVE_TEMPLATES.wound.default, variables),
    quest: fillTemplate(NARRATIVE_TEMPLATES.quest.default, variables),
    shadow: fillTemplate(NARRATIVE_TEMPLATES.shadow.default, variables),
    gift: fillTemplate(NARRATIVE_TEMPLATES.gift.default, variables),
    closing: fillTemplate(NARRATIVE_TEMPLATES.closing.default, variables),
    blessing: fillTemplate(NARRATIVE_TEMPLATES.closing.blessing, variables),

    lunaPrompt: generateLunaPrompt(elements, chamberId),
    integrationTask: generateIntegrationTask(elements, chamberId)
  };

  // Add Saturn Return specific content if applicable
  if (context.isSaturnReturn) {
    script.saturnReturnOpening = fillTemplate(NARRATIVE_TEMPLATES.opening.saturnReturn, variables);
  }

  return script;
}

/**
 * Extract relevant elements from chart data
 */
function extractChartElements(chartData) {
  const planets = chartData.planets || {};
  const houses = chartData.houses || {};

  const getSafe = (obj, key) => obj?.[key] || obj?.[key?.toLowerCase()] || {};

  return {
    sun: {
      sign: getSafe(planets, 'Sun').sign || getSafe(chartData, 'sun').sign,
      house: getSafe(planets, 'Sun').house || getSafe(chartData, 'sun').house,
      archetype: SIGN_ARCHETYPES[getSafe(planets, 'Sun').sign || getSafe(chartData, 'sun').sign]
    },
    moon: {
      sign: getSafe(planets, 'Moon').sign || getSafe(chartData, 'moon').sign,
      house: getSafe(planets, 'Moon').house || getSafe(chartData, 'moon').house,
      archetype: SIGN_ARCHETYPES[getSafe(planets, 'Moon').sign || getSafe(chartData, 'moon').sign]
    },
    rising: {
      sign: getSafe(chartData, 'rising').sign,
      archetype: SIGN_ARCHETYPES[getSafe(chartData, 'rising').sign]
    },
    saturn: {
      sign: getSafe(planets, 'Saturn').sign,
      house: getSafe(planets, 'Saturn').house,
      archetype: SIGN_ARCHETYPES[getSafe(planets, 'Saturn').sign]
    },
    pluto: {
      sign: getSafe(planets, 'Pluto').sign,
      house: getSafe(planets, 'Pluto').house
    },
    chiron: {
      sign: getSafe(planets, 'Chiron').sign,
      house: getSafe(planets, 'Chiron').house
    },
    jupiter: {
      sign: getSafe(planets, 'Jupiter').sign,
      house: getSafe(planets, 'Jupiter').house
    },
    northNode: {
      sign: getSafe(planets, 'NorthNode').sign || getSafe(planets, 'northNode').sign,
      house: getSafe(planets, 'NorthNode').house || getSafe(planets, 'northNode').house
    },
    southNode: {
      sign: getSafe(planets, 'SouthNode').sign || getSafe(planets, 'southNode').sign,
      house: getSafe(planets, 'SouthNode').house || getSafe(planets, 'southNode').house
    }
  };
}

/**
 * Build variable map for template replacement
 */
function buildVariableMap(elements, context) {
  const { sun, moon, rising, saturn, pluto, chiron, jupiter, northNode, southNode } = elements;

  return {
    // Sun variables
    sunSign: sun.sign || 'your Sun sign',
    sunHouse: sun.house || 'your Sun house',
    sunArchetype: sun.archetype?.archetype || 'The Seeker',
    sunGift: sun.archetype?.quality || 'self-expression',

    // Moon variables
    moonSign: moon.sign || 'your Moon sign',
    moonHouse: moon.house || 'your Moon house',
    moonArchetype: moon.archetype?.archetype || 'The Nurturer',

    // Rising variables
    risingSign: rising.sign || 'your Rising sign',
    risingArchetype: rising.archetype?.archetype || 'The Persona',

    // Saturn variables
    saturnSign: saturn.sign || 'your Saturn sign',
    saturnHouse: saturn.house || 'your Saturn house',
    saturnLesson: getSaturnLesson(saturn.sign),
    saturnMastery: getSaturnMastery(saturn.sign),
    saturnFear: getSaturnFear(saturn.sign),

    // Pluto variables
    plutoSign: pluto.sign || 'your Pluto sign',
    plutoHouse: pluto.house || 'your Pluto house',
    plutoTheme: getPlutoTheme(pluto.sign),

    // Chiron variables
    chironSign: chiron.sign || 'your Chiron sign',
    chironHouse: HOUSE_THEMES[chiron.house] || 'your Chiron house',
    chironGift: getChironGift(chiron.sign),

    // Jupiter variables
    jupiterSign: jupiter.sign || 'your Jupiter sign',
    jupiterGift: getJupiterGift(jupiter.sign),

    // Node variables
    northNodeSign: northNode.sign || 'your North Node sign',
    northNodeGift: getNorthNodeGift(northNode.sign),
    southNodeSign: southNode.sign || 'your South Node sign',
    southNodeRelease: getSouthNodeRelease(southNode.sign),

    // Wound variables (using Saturn and Chiron)
    woundHouse: HOUSE_THEMES[saturn.house] || HOUSE_THEMES[chiron.house] || 'your wound house',
    woundPlanet: 'Saturn and Chiron',
    woundLesson: getSaturnLesson(saturn.sign),
    woundGift: getChironGift(chiron.sign),
    woundArea: HOUSE_THEMES[saturn.house] || 'self-mastery',

    // Shadow variables
    shadowPlanet: 'Pluto',
    shadowSign: pluto.sign || 'your shadow sign',
    shadowExpression: SIGN_ARCHETYPES[pluto.sign]?.shadow || 'shadow expression',
    shadowBehavior: getShadowBehavior(pluto.sign),
    shadowGift: getShadowGift(pluto.sign),
    shadowQuality: SIGN_ARCHETYPES[saturn.sign]?.shadow || 'limitation',

    // General
    primaryGift: sun.archetype?.quality || 'your gift',

    // Context
    name: context.name || 'Pilgrim',
    age: context.age || 'your current age'
  };
}

/**
 * Fill template with variables
 */
function fillTemplate(template, variables) {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value || `[${key}]`);
  }
  return result;
}

// =============================================================================
// INTERPRETATION FUNCTIONS
// =============================================================================

function getSaturnLesson(sign) {
  const lessons = {
    Aries: 'patience and strategic action',
    Taurus: 'flexibility within stability',
    Gemini: 'depth in communication',
    Cancer: 'emotional boundaries',
    Leo: 'humble confidence',
    Virgo: 'acceptance of imperfection',
    Libra: 'authentic relationship',
    Scorpio: 'trust after betrayal',
    Sagittarius: 'grounded faith',
    Capricorn: 'mastery without coldness',
    Aquarius: 'belonging while being unique',
    Pisces: 'boundaries in compassion'
  };
  return lessons[sign] || 'mastery through limitation';
}

function getSaturnMastery(sign) {
  const mastery = {
    Aries: 'disciplined initiative',
    Taurus: 'patient accumulation',
    Gemini: 'focused communication',
    Cancer: 'structured nurturing',
    Leo: 'mature self-expression',
    Virgo: 'practical perfection',
    Libra: 'committed partnership',
    Scorpio: 'controlled power',
    Sagittarius: 'grounded wisdom',
    Capricorn: 'earned authority',
    Aquarius: 'structured innovation',
    Pisces: 'bounded compassion'
  };
  return mastery[sign] || 'earned mastery';
}

function getSaturnFear(sign) {
  const fears = {
    Aries: 'being controlled or ineffective',
    Taurus: 'instability and loss',
    Gemini: 'being misunderstood or ignored',
    Cancer: 'abandonment and rejection',
    Leo: 'insignificance and invisibility',
    Virgo: 'chaos and imperfection',
    Libra: 'conflict and isolation',
    Scorpio: 'vulnerability and betrayal',
    Sagittarius: 'meaninglessness and confinement',
    Capricorn: 'failure and inadequacy',
    Aquarius: 'conformity and belonging',
    Pisces: 'harsh reality and separation'
  };
  return fears[sign] || 'your deepest fear';
}

function getPlutoTheme(sign) {
  const themes = {
    Aries: 'survival and self-assertion',
    Taurus: 'possessions and self-worth',
    Gemini: 'knowledge and truth',
    Cancer: 'family and emotional security',
    Leo: 'creative power and recognition',
    Virgo: 'purity and service',
    Libra: 'relationship and justice',
    Scorpio: 'death-rebirth and intimacy',
    Sagittarius: 'belief and meaning',
    Capricorn: 'power and authority',
    Aquarius: 'collective change and individuality',
    Pisces: 'transcendence and dissolution'
  };
  return themes[sign] || 'transformation and power';
}

function getChironGift(sign) {
  const gifts = {
    Aries: 'helping others claim their courage',
    Taurus: 'teaching others to value themselves',
    Gemini: 'healing through communication',
    Cancer: 'nurturing the wounded inner child',
    Leo: 'helping others shine authentically',
    Virgo: 'healing through practical service',
    Libra: 'teaching balanced relating',
    Scorpio: 'guiding through transformation',
    Sagittarius: 'restoring faith and meaning',
    Capricorn: 'mentoring in mastery',
    Aquarius: 'healing alienation',
    Pisces: 'compassion for suffering'
  };
  return gifts[sign] || 'your healing gift';
}

function getJupiterGift(sign) {
  const gifts = {
    Aries: 'inspiring courage in others',
    Taurus: 'abundance and groundedness',
    Gemini: 'connecting ideas and people',
    Cancer: 'creating emotional safety',
    Leo: 'generous creativity',
    Virgo: 'practical wisdom',
    Libra: 'harmonizing differences',
    Scorpio: 'deep understanding',
    Sagittarius: 'contagious faith',
    Capricorn: 'wise authority',
    Aquarius: 'visionary thinking',
    Pisces: 'boundless compassion'
  };
  return gifts[sign] || 'your Jupiter gift';
}

function getNorthNodeGift(sign) {
  const gifts = {
    Aries: 'self-assertion and independence',
    Taurus: 'stability and self-worth',
    Gemini: 'curiosity and communication',
    Cancer: 'emotional depth and nurturing',
    Leo: 'creative self-expression',
    Virgo: 'discernment and service',
    Libra: 'partnership and balance',
    Scorpio: 'intimacy and transformation',
    Sagittarius: 'meaning and expansion',
    Capricorn: 'mastery and achievement',
    Aquarius: 'individuation and community',
    Pisces: 'surrender and compassion'
  };
  return gifts[sign] || 'your evolutionary gift';
}

function getSouthNodeRelease(sign) {
  const releases = {
    Aries: 'over-accommodation',
    Taurus: 'crisis addiction',
    Gemini: 'dogmatic beliefs',
    Cancer: 'achievement obsession',
    Leo: 'group dependency',
    Virgo: 'escapist tendencies',
    Libra: 'selfish independence',
    Scorpio: 'material attachment',
    Sagittarius: 'scattered learning',
    Capricorn: 'emotional dependency',
    Aquarius: 'ego attachment',
    Pisces: 'perfectionist criticism'
  };
  return releases[sign] || 'your familiar pattern';
}

function getShadowBehavior(sign) {
  const behaviors = {
    Aries: 'aggressive or impulsive',
    Taurus: 'stubborn or possessive',
    Gemini: 'scattered or deceptive',
    Cancer: 'clingy or manipulative',
    Leo: 'arrogant or attention-seeking',
    Virgo: 'critical or obsessive',
    Libra: 'passive-aggressive or indecisive',
    Scorpio: 'controlling or vengeful',
    Sagittarius: 'excessive or preachy',
    Capricorn: 'cold or domineering',
    Aquarius: 'detached or rebellious',
    Pisces: 'escapist or victimized'
  };
  return behaviors[sign] || 'your shadow behavior';
}

function getShadowGift(sign) {
  const gifts = {
    Aries: 'courage and initiative',
    Taurus: 'stability and presence',
    Gemini: 'mental agility',
    Cancer: 'emotional intelligence',
    Leo: 'radiant leadership',
    Virgo: 'practical wisdom',
    Libra: 'diplomatic skill',
    Scorpio: 'transformative power',
    Sagittarius: 'inspiring faith',
    Capricorn: 'earned authority',
    Aquarius: 'visionary thinking',
    Pisces: 'transcendent compassion'
  };
  return gifts[sign] || 'your shadow\'s gift';
}

// =============================================================================
// LUNA PROMPTS AND INTEGRATION TASKS
// =============================================================================

function generateLunaPrompt(elements, chamberId) {
  const prompts = {
    egoFormation: `As ${elements.sun.archetype?.archetype || 'a seeker'}, what mask did you create to survive childhood? What would happen if you took it off now?`,
    shadowMeeting: `With your shadow in ${elements.pluto.sign || 'the depths'}, what do you most criticize in others that might live in you?`,
    animaAnimus: `Your Moon in ${elements.moon.sign || 'the emotional realm'} holds your inner beloved. What qualities do you seek in partners that you have not yet developed in yourself?`,
    woundedHealer: `Chiron in ${elements.chiron.sign || 'your wound'} marks where your pain becomes medicine. How has your suffering taught you compassion?`,
    saturnInitiation: `Saturn in ${elements.saturn.sign || 'your mastery'} sets your particular test. What would it mean to fully grow up in this area?`,
    midlifeDescend: `At this stage, what dreams have you abandoned that still call to you?`,
    transcendentFunction: `What opposites within you have been at war? What if they could dance instead of fight?`,
    selfRealization: `If all your masks fell away, who would remain?`
  };

  return prompts[chamberId] || 'What is your soul trying to tell you right now?';
}

function generateIntegrationTask(elements, chamberId) {
  const tasks = {
    egoFormation: `This week, notice when you're performing rather than being authentic. Journal about one moment when you dropped the mask.`,
    shadowMeeting: `Find someone who irritates you. Write three ways that quality might live in you, unexpressed.`,
    animaAnimus: `List five qualities you've always sought in partners. Choose one to develop in yourself this month.`,
    woundedHealer: `Share one of your wounds with someone safe. Notice how speaking it changes it.`,
    saturnInitiation: `Identify one responsibility you've been avoiding. Take the smallest step toward facing it.`,
    midlifeDescend: `Revisit an abandoned dream. Even if you can't pursue it, honor it with one small action.`,
    transcendentFunction: `Name two opposites at war within you. Write a dialogue between them.`,
    selfRealization: `Spend ten minutes in silence, asking: Who am I beneath all my roles?`
  };

  return tasks[chamberId] || 'Reflect on what you have learned in this chamber.';
}

// =============================================================================
// LLM PROMPT GENERATION
// =============================================================================

/**
 * Generate prompt for LLM-based narrative generation
 */
export function generateLLMPrompt(chartData, chamberId, context = {}) {
  const elements = extractChartElements(chartData);

  return {
    systemPrompt: `You are Luna, a wise and compassionate guide in the tradition of Liz Greene's psychological astrology.
You speak with warmth, depth, and mythic resonance.
You never judge, only illuminate.
You use the language of archetypes, not prescription.
You are creating a personalized narrative for the ${chamberId} chamber of the Pilgrim Journey.`,

    userPrompt: `Create a personalized mythic narrative for this individual:

CHART OVERVIEW:
- Sun in ${elements.sun.sign} (${elements.sun.house || '?'} house) - ${elements.sun.archetype?.archetype || 'The Seeker'}
- Moon in ${elements.moon.sign} (${elements.moon.house || '?'} house) - ${elements.moon.archetype?.archetype || 'The Nurturer'}
- Rising Sign: ${elements.rising.sign} - ${elements.rising.archetype?.archetype || 'The Persona'}
- Saturn in ${elements.saturn.sign} (${elements.saturn.house || '?'} house) - The Teacher
- Chiron in ${elements.chiron.sign} - The Wounded Healer
- Pluto in ${elements.pluto.sign} - The Transformer
- North Node in ${elements.northNode.sign} - Evolutionary Direction

CURRENT CONTEXT:
- Age: ${context.age || 'Unknown'}
- Saturn Phase: ${context.saturnPhase || 'Unknown'}
- Current Chamber: ${chamberId}

Please generate:
1. An OPENING that welcomes them to this chamber using their specific archetypes
2. A WOUND section that speaks to their particular shadow (Saturn/Chiron/Pluto)
3. A QUEST section that illuminates their evolutionary direction (Nodes)
4. A GIFT section that celebrates their strengths
5. A CLOSING blessing that integrates all elements
6. A LUNA PROMPT - one powerful question for their reflection

Use second person ("you"). Be specific to their chart. Speak with mythic depth but human warmth.`,

    format: 'narrative',
    maxTokens: 2000
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  generatePersonalizedScript,
  generateLLMPrompt,
  SIGN_ARCHETYPES,
  PLANET_FUNCTIONS,
  HOUSE_THEMES
};
