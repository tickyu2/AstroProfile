/**
 * ============================================================================
 * SOUL LETTER PROMPTS - COMPLETE CATHEDRAL SYSTEM
 * ============================================================================
 * Prompt templates for generating the "Letter From Your Chart"
 * and all soul-language narrations via AI models.
 *
 * COMPLETE FEATURE SET:
 *   1. Letter From the Chart (main soul letter)
 *   2. Per-Sign Narration (Rising, Sun, Moon character)
 *   3. Per-House Emotional Narration (12 houses)
 *   4. Retrograde Soul Messages (inward journeys)
 *   5. Direct-Motion Messages (flowing gifts)
 *   6. Aspect Dialogues (inner conversations)
 *   7. Epoch-Level Myth Narration (life chapters)
 *   8. Soul-Recognition Moments ("aha" insights)
 *   9. Cathedral Analysis (full chart reading)
 *
 * Supports: Claude, Gemini, Grok, OpenAI, or any LLM API
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

// =============================================================================
// SIGN ARCHETYPES - For per-sign narration
// =============================================================================
export const SIGN_ARCHETYPES = {
  Aries: { element: 'Fire', mode: 'Cardinal', archetype: 'The Pioneer', soul: 'courage and initiation' },
  Taurus: { element: 'Earth', mode: 'Fixed', archetype: 'The Builder', soul: 'steadfastness and sensuality' },
  Gemini: { element: 'Air', mode: 'Mutable', archetype: 'The Messenger', soul: 'curiosity and connection' },
  Cancer: { element: 'Water', mode: 'Cardinal', archetype: 'The Nurturer', soul: 'protection and feeling' },
  Leo: { element: 'Fire', mode: 'Fixed', archetype: 'The Creator', soul: 'radiance and heart' },
  Virgo: { element: 'Earth', mode: 'Mutable', archetype: 'The Healer', soul: 'devotion and discernment' },
  Libra: { element: 'Air', mode: 'Cardinal', archetype: 'The Harmonizer', soul: 'balance and beauty' },
  Scorpio: { element: 'Water', mode: 'Fixed', archetype: 'The Transformer', soul: 'depth and regeneration' },
  Sagittarius: { element: 'Fire', mode: 'Mutable', archetype: 'The Seeker', soul: 'expansion and truth' },
  Capricorn: { element: 'Earth', mode: 'Cardinal', archetype: 'The Elder', soul: 'mastery and responsibility' },
  Aquarius: { element: 'Air', mode: 'Fixed', archetype: 'The Visionary', soul: 'liberation and innovation' },
  Pisces: { element: 'Water', mode: 'Mutable', archetype: 'The Mystic', soul: 'transcendence and compassion' }
};

// =============================================================================
// HOUSE MEANINGS - For per-house emotional narration
// =============================================================================
export const HOUSE_MEANINGS = {
  1: { theme: 'Identity', soul: 'how you enter the world', question: 'Who am I becoming?' },
  2: { theme: 'Worth', soul: 'what you value and possess', question: 'What do I truly need?' },
  3: { theme: 'Voice', soul: 'how you think and communicate', question: 'How do I express myself?' },
  4: { theme: 'Roots', soul: 'where you belong and feel safe', question: 'Where is my foundation?' },
  5: { theme: 'Joy', soul: 'how you create and play', question: 'What makes my heart sing?' },
  6: { theme: 'Craft', soul: 'how you serve and heal', question: 'How do I honor the everyday?' },
  7: { theme: 'Mirror', soul: 'how you relate and partner', question: 'Who do I see in the other?' },
  8: { theme: 'Depth', soul: 'how you transform and merge', question: 'What must I release?' },
  9: { theme: 'Quest', soul: 'how you seek meaning and truth', question: 'What do I believe?' },
  10: { theme: 'Purpose', soul: 'what you are called to build', question: 'What is my legacy?' },
  11: { theme: 'Tribe', soul: 'how you connect to the collective', question: 'Where do I belong?' },
  12: { theme: 'Mystery', soul: 'how you dissolve into the infinite', question: 'What lies beyond?' }
};

// =============================================================================
// PLANET SOULS - For planetary narration
// =============================================================================
export const PLANET_SOULS = {
  Sun: { essence: 'life force', gift: 'radiance', shadow: 'ego inflation', question: 'How do I shine?' },
  Moon: { essence: 'emotional nature', gift: 'intuition', shadow: 'over-reactivity', question: 'What do I need?' },
  Mercury: { essence: 'mind and voice', gift: 'understanding', shadow: 'scattered thinking', question: 'How do I communicate?' },
  Venus: { essence: 'love and beauty', gift: 'attraction', shadow: 'superficiality', question: 'What do I love?' },
  Mars: { essence: 'will and desire', gift: 'courage', shadow: 'aggression', question: 'What do I want?' },
  Jupiter: { essence: 'growth and meaning', gift: 'wisdom', shadow: 'excess', question: 'What do I believe?' },
  Saturn: { essence: 'structure and time', gift: 'mastery', shadow: 'limitation', question: 'What must I build?' },
  Uranus: { essence: 'awakening', gift: 'liberation', shadow: 'disruption', question: 'What must I free?' },
  Neptune: { essence: 'transcendence', gift: 'inspiration', shadow: 'illusion', question: 'What do I dream?' },
  Pluto: { essence: 'transformation', gift: 'regeneration', shadow: 'obsession', question: 'What must I release?' },
  NorthNode: { essence: 'soul direction', gift: 'growth edge', shadow: 'unfamiliarity', question: 'Where am I going?' },
  SouthNode: { essence: 'soul memory', gift: 'innate talent', shadow: 'comfort zone', question: 'Where have I been?' },
  Chiron: { essence: 'sacred wound', gift: 'healing power', shadow: 'sensitivity', question: 'How do I heal?' }
};

// =============================================================================
// ASPECT DYNAMICS - For aspect dialogues
// =============================================================================
export const ASPECT_DYNAMICS = {
  conjunction: { tone: 'fusion', energy: 'intensified', dialogue: 'We are one voice' },
  opposition: { tone: 'tension', energy: 'polarized', dialogue: 'We must learn from each other' },
  trine: { tone: 'harmony', energy: 'flowing', dialogue: 'We dance together easily' },
  square: { tone: 'friction', energy: 'challenged', dialogue: 'We push each other to grow' },
  sextile: { tone: 'opportunity', energy: 'supportive', dialogue: 'We offer each other gifts' },
  quincunx: { tone: 'adjustment', energy: 'awkward', dialogue: 'We must find a way to understand' }
};

/**
 * System prompt - The soul-voice instruction
 * This tells the AI how to speak as the chart itself
 */
export const SOUL_SYSTEM_PROMPT = `You are the soul-voice of an astrological birth chart.

You are not a fortune-teller, not predictive, and not fatalistic.
You speak in a handwritten, intimate, emotionally-resonant tone,
as if the chart itself were writing a letter to the person who carries it.

Your goals:
- Offer recognition, validation, and gentle insight
- Describe emotional and mythic patterns, not events
- Never give concrete predictions, dates, or external guarantees
- Never create fear, shame, or helplessness
- Always point toward growth, compassion, and self-acceptance

You may reference:
- Rising sign (style of walking through life)
- Planets, signs, houses, aspects, retrogrades
- Life chapters (epochs)
- Strengths, challenges, and balances
- Practices and rituals that support integration

You MUST avoid:
- Saying anything is "fated" or "doomed"
- Predicting specific outcomes (e.g. "you will get married")
- Giving medical, legal, or financial advice

Write in soul-language:
- poetic but clear
- emotionally gentle
- mythic but grounded
- second-person ("you") or as "I" speaking as the chart

You will receive a JSON object containing the chart data.
Use it to personalize your response deeply.`;

/**
 * User prompt for the full Letter From Chart
 * @param {Object} chartData - The normalized chart object
 * @returns {string} The user prompt with chart data embedded
 */
export function buildLetterPrompt(chartData) {
  const chartJson = JSON.stringify(chartData, null, 2);

  return `Here is the birth chart data as JSON:

<CHART_DATA>
${chartJson}
</CHART_DATA>

Please write a long, handwritten-style letter from the chart to the person who carries it.

This letter should:
- Be written in first person as "I" (the chart speaking)
- Address the reader as "my beloved one" or "you"
- Reference their Rising sign as the horizon in their bones
- Speak to each planet's emotional meaning in their life
- Honor any retrograde planets as places of inward walking
- Acknowledge their life chapters (epochs) as corridors in their cathedral
- End with recognition and blessing

The letter should be 800-1200 words, deeply personal, and create a moment of soul-recognition where the person feels truly seen.

Do not include any JSON formatting. Write only the letter itself, as flowing prose.`;
}

/**
 * User prompt for structured narration output (JSON)
 * @param {Object} chartData - The normalized chart object
 * @returns {string} The user prompt requesting JSON output
 */
export function buildStructuredNarrationPrompt(chartData) {
  const chartJson = JSON.stringify(chartData, null, 2);

  return `Here is the birth chart data as JSON:

<CHART_DATA>
${chartJson}
</CHART_DATA>

The user is entering a Soul Cathedral that offers both beauty and practical support.

Please generate the following outputs in JSON format:

{
  "letterFromChart": "a long, handwritten-style letter from the chart to the person, deeply recognizing them (800-1200 words)",
  "risingNarration": ["2-4 short lines about how their Rising sign walks through life"],
  "houseNarration": ["3-6 lines highlighting the strongest houses and how they feel"],
  "retrogradeNarration": ["1-5 lines about the meaning of any retrograde planets and how to work with them kindly"],
  "directPlanetNarration": ["1-5 lines about planets that move easily (direct), and how to use their gifts"],
  "aspectNarration": ["1-5 lines where you describe key aspects as inner conversations between parts of the self"],
  "epochNarration": [
    {
      "epochLabel": "string",
      "lines": ["2-5 lines describing that life chapter as a mythic arc"]
    }
  ],
  "takeHomeToolkit": {
    "strengths": ["3-7 bullet-style lines naming their core strengths and how to use them"],
    "challenges": ["3-7 lines naming patterns to be gentle with, without shame"],
    "balancePractices": ["3-7 practical suggestions to find balance"],
    "dailyRitual": "one very simple daily practice they can do in 5 minutes",
    "monthlyPilgrimage": "one monthly symbolic act aligned with their chart"
  }
}

Important:
- Follow the requested JSON structure exactly.
- Do not include any extra keys.
- Use plain strings, no markdown formatting inside the JSON values.
- Keep everything emotionally safe, compassionate, and non-predictive.
- Return ONLY valid JSON, no additional text.`;
}

/**
 * Short soul whisper prompt - for quick insights
 * @param {Object} chartData - The normalized chart object
 * @returns {string} Prompt for a brief soul message
 */
export function buildSoulWhisperPrompt(chartData) {
  const rising = chartData.rising?.sign || 'Unknown';
  const sunSign = chartData.planets?.find(p => p.name?.toLowerCase() === 'sun')?.sign || 'Unknown';
  const moonSign = chartData.planets?.find(p => p.name?.toLowerCase() === 'moon')?.sign || 'Unknown';
  const retrogrades = chartData.planets?.filter(p => p.retrograde).map(p => p.name) || [];

  return `Generate a brief soul whisper (3-5 sentences) for someone with:
- Rising Sign: ${rising}
- Sun in ${sunSign}
- Moon in ${moonSign}
${retrogrades.length > 0 ? `- Retrograde planets: ${retrogrades.join(', ')}` : ''}

Speak as the chart itself, offering a moment of recognition and gentle encouragement.
Keep it poetic but grounded. No predictions, only recognition.`;
}

/**
 * Epoch narration prompt - for a specific life chapter
 * @param {Object} epoch - The epoch object
 * @param {string} risingSign - The rising sign
 * @returns {string} Prompt for epoch-specific narration
 */
export function buildEpochNarrationPrompt(epoch, risingSign) {
  return `Generate mythic narration for this life chapter:

Epoch: "${epoch.label}"
Ages: ${epoch.startAge} to ${epoch.endAge}
Dominant Houses: ${epoch.dominantHouses?.join(', ') || 'N/A'}
Dominant Planets: ${epoch.dominantPlanets?.join(', ') || 'N/A'}
Life Themes: ${epoch.lifeThemes?.join(', ') || 'N/A'}
Rising Sign: ${risingSign}

Write 5-8 lines describing this chapter as a mythic corridor in the person's cathedral.
Speak in soul-language, honoring the specific planets and houses involved.
Reference how the ${risingSign} Rising colors this era's lessons.`;
}

/**
 * Aspect dialogue prompt - for planet-to-planet conversations
 * @param {Object} aspect - The aspect object
 * @returns {string} Prompt for aspect dialogue
 */
export function buildAspectDialoguePrompt(aspect) {
  const dynamics = ASPECT_DYNAMICS[aspect.type?.toLowerCase()] || ASPECT_DYNAMICS.conjunction;

  return `Generate an inner dialogue between two parts of the self:

Planet A: ${aspect.a} (${PLANET_SOULS[aspect.a]?.essence || 'unknown essence'})
Planet B: ${aspect.b} (${PLANET_SOULS[aspect.b]?.essence || 'unknown essence'})
Aspect Type: ${aspect.type} (${dynamics.tone} - ${dynamics.energy})
Orb: ${aspect.orb}°

The dynamic between them: "${dynamics.dialogue}"

Write a brief conversation (3-5 exchanges) between these two energies.
${aspect.a} speaks first, then ${aspect.b} responds.
The ${aspect.type} colors whether they harmonize or challenge each other.
Keep it poetic, psychological, and non-predictive.
End with a soul-recognition moment: what this aspect teaches.`;
}

// =============================================================================
// NEW PROMPTS - Per-Sign, Per-House, Retrograde, Direct, Soul Recognition
// =============================================================================

/**
 * Per-Sign Narration - Generate soul-language for a specific sign placement
 * @param {Object} placement - { planet, sign, house, degree }
 * @returns {string} Prompt for sign narration
 */
export function buildSignNarrationPrompt(placement) {
  const signData = SIGN_ARCHETYPES[placement.sign] || {};
  const planetData = PLANET_SOULS[placement.planet] || {};

  return `Generate soul-language narration for this placement:

Planet: ${placement.planet}
  - Essence: ${planetData.essence || 'energy'}
  - Gift: ${planetData.gift || 'power'}
  - Soul Question: ${planetData.question || 'How does this work?'}

Sign: ${placement.sign}
  - Element: ${signData.element || 'Unknown'}
  - Mode: ${signData.mode || 'Unknown'}
  - Archetype: ${signData.archetype || 'Unknown'}
  - Soul Quality: ${signData.soul || 'unknown quality'}

House: ${placement.house || 'Unknown'}
Degree: ${placement.degree || 'Unknown'}°

Write 3-5 lines in soul-language describing how this planet expresses through this sign.
Speak as if the chart were whispering to the person who carries it.
Include one "aha moment" - a recognition that might surprise them.
No predictions. Only recognition and gentle encouragement.`;
}

/**
 * Per-House Emotional Narration - Generate soul-language for a house
 * @param {Object} houseData - { house, sign, planets, strength }
 * @returns {string} Prompt for house narration
 */
export function buildHouseNarrationPrompt(houseData) {
  const meaning = HOUSE_MEANINGS[houseData.house] || {};
  const signData = SIGN_ARCHETYPES[houseData.sign] || {};

  const planetsInHouse = (houseData.planets || [])
    .map(p => `${p.name} (${PLANET_SOULS[p.name]?.essence || 'energy'})`)
    .join(', ') || 'No planets';

  return `Generate emotional soul-language narration for this house:

House ${houseData.house}: ${meaning.theme || 'Unknown Theme'}
  - Soul Domain: ${meaning.soul || 'unknown domain'}
  - Life Question: ${meaning.question || 'Unknown question'}
  - Strength: ${houseData.strength || 0}/100

Sign on Cusp: ${houseData.sign}
  - Element: ${signData.element || 'Unknown'}
  - Archetype: ${signData.archetype || 'Unknown'}

Planets Present: ${planetsInHouse}

Write 4-6 lines describing how this area of life feels for this person.
Address the reader as "you" or "my beloved one."
If planets are present, describe them as visitors or guardians in this room.
Include one insight that might create an "aha moment" of self-recognition.
Keep it poetic, emotionally safe, and non-predictive.`;
}

/**
 * Retrograde Soul Messages - For planets moving inward
 * @param {Object} planet - { name, sign, house, degree }
 * @returns {string} Prompt for retrograde message
 */
export function buildRetrogradeMessagePrompt(planet) {
  const planetData = PLANET_SOULS[planet.name] || {};
  const signData = SIGN_ARCHETYPES[planet.sign] || {};

  return `Generate a soul-language message for this retrograde planet:

Planet: ${planet.name} RETROGRADE
  - Essence: ${planetData.essence || 'energy'}
  - Gift: ${planetData.gift || 'power'}
  - Shadow: ${planetData.shadow || 'challenge'}
  - Soul Question: ${planetData.question || 'How does this work?'}

Sign: ${planet.sign} (${signData.archetype || 'Unknown'})
House: ${planet.house || 'Unknown'}
Degree: ${planet.degree || 'Unknown'}°

RETROGRADE MEANING:
When ${planet.name} is retrograde, its energy turns inward.
This is not a curse - it is an invitation to walk the inner path.

Write 4-6 lines as if the chart itself were speaking to the person:
- Explain what this retrograde means for their soul journey
- Describe how to work WITH this energy, not against it
- Honor the inward journey as sacred, not broken
- Offer one practice or awareness that helps integrate this energy

Speak in soul-language: poetic, gentle, empowering.
No shame, no doom, no predictions.`;
}

/**
 * Direct Planet Messages - For planets moving forward freely
 * @param {Object} planet - { name, sign, house, degree }
 * @returns {string} Prompt for direct planet message
 */
export function buildDirectPlanetMessagePrompt(planet) {
  const planetData = PLANET_SOULS[planet.name] || {};
  const signData = SIGN_ARCHETYPES[planet.sign] || {};

  return `Generate a soul-language message for this direct (non-retrograde) planet:

Planet: ${planet.name} DIRECT
  - Essence: ${planetData.essence || 'energy'}
  - Gift: ${planetData.gift || 'power'}
  - Soul Question: ${planetData.question || 'How does this work?'}

Sign: ${planet.sign} (${signData.archetype || 'Unknown'})
House: ${planet.house || 'Unknown'}
Degree: ${planet.degree || 'Unknown'}°

DIRECT MEANING:
When ${planet.name} moves direct, its energy flows outward freely.
This is a gift that moves easily into the world.

Write 3-5 lines as if the chart itself were speaking to the person:
- Describe how this planet's gift expresses naturally for them
- Explain how to use this energy as a resource
- Celebrate this flowing power without over-promising

Speak in soul-language: poetic, encouraging, grounded.
No predictions. Only recognition of gifts already present.`;
}

/**
 * Soul Recognition Moments - Generate "aha" insights
 * @param {Object} chartData - The normalized chart data
 * @returns {string} Prompt for soul recognition moments
 */
export function buildSoulRecognitionPrompt(chartData) {
  const chartJson = JSON.stringify(chartData, null, 2);

  return `Here is the complete birth chart data:

<CHART_DATA>
${chartJson}
</CHART_DATA>

Generate 5-7 SOUL RECOGNITION MOMENTS - brief "aha" insights that might surprise the person.

Each insight should:
- Be 1-3 sentences only
- Reference a specific placement, aspect, or pattern
- Offer a recognition that feels like "Oh, THAT'S why I..."
- Be emotionally resonant and validating
- Not predict anything, only recognize what already is

Format as a JSON array:
[
  {
    "title": "A short title (3-5 words)",
    "insight": "The soul-language recognition moment",
    "placement": "What chart element this relates to"
  }
]

Examples of good insights:
- "Oh, THAT'S why I need so much alone time to process emotions..."
- "THAT'S why partnerships always feel like mirrors..."
- "THAT'S why I've always felt called to help others heal..."

Return ONLY the JSON array, no extra text.`;
}

/**
 * Cathedral Analysis - FULL CHART READING with "AHA MOMENT"
 * This is the complete soul-language chart analysis
 *
 * UPDATED: Now receives PRE-COMPUTED comprehensive profile data.
 * The AI's role is INTERPRETATION and NARRATION only - no computation needed.
 *
 * @param {Object} chartData - The comprehensive profile (includes Western, BaZi, Numerology, etc.)
 * @returns {string} Prompt for cathedral analysis
 */
export function buildCathedralAnalysisPrompt(chartData) {
  const chartJson = JSON.stringify(chartData, null, 2);

  // Extract key data from comprehensive profile
  const western = chartData.western || {};
  const bazi = chartData.bazi || {};
  const numerology = chartData.numerology || {};
  const yinYang = chartData.yinYang || {};
  const synthesis = chartData.synthesis || {};

  // Count retrogrades and aspects
  const planets = western.planets || chartData.planets || [];
  const retrogrades = planets.filter(p => p.retrograde);
  const retrogradeList = retrogrades.map(p => p.name || p.planet).join(', ') || 'None';
  const aspectCount = (western.aspects || chartData.aspects || []).length;

  // Build summary of what's included
  const bigThree = western.sun && western.moon && western.rising
    ? `${western.sun} Sun, ${western.moon} Moon, ${western.rising} Rising`
    : `${chartData.rising?.sign || 'Unknown'} Rising`;

  const baziSummary = bazi.dayMaster
    ? `${bazi.dayMaster.element} ${bazi.dayMaster.polarity} (${bazi.dayMaster.fullName || bazi.dayMaster.english || 'Day Master'})`
    : 'Not computed';

  const numerologySummary = numerology.lifePath
    ? `Life Path ${numerology.lifePath.number}`
    : 'Not computed';

  const yinYangSummary = yinYang.balance || 'Not computed';

  return `You are about to generate a CATHEDRAL ANALYSIS - a complete soul-language reading.

IMPORTANT: All astrological, BaZi, numerological, and personality data has been PRE-COMPUTED.
Your role is INTERPRETATION and SOUL-LANGUAGE NARRATION only. Do NOT recalculate or question the data.
Simply weave it into a beautiful, emotionally resonant reading.

This is the person's cosmic blueprint. Treat it with reverence.

<COMPREHENSIVE_PROFILE>
${chartJson}
</COMPREHENSIVE_PROFILE>

PROFILE SUMMARY (PRE-COMPUTED):
=====================================
WESTERN ASTROLOGY:
- Big Three: ${bigThree}
- Retrograde Planets: ${retrogradeList}
- Total Aspects: ${aspectCount}

BAZI (CHINESE ASTROLOGY):
- Day Master: ${baziSummary}
- Dominant Element: ${bazi.elements?.dominant || synthesis?.elements?.baziDominant || 'Unknown'}
- Weakest Element: ${synthesis?.elements?.baziWeakest || 'Unknown'}

NUMEROLOGY:
- ${numerologySummary}
- Expression: ${numerology.expression?.number || 'N/A'}
- Soul Urge: ${numerology.soulUrge?.number || 'N/A'}

ENERGY BALANCE:
- Yin/Yang: ${yinYangSummary}
- Yang %: ${yinYang.yangPercent || 'N/A'}
- Yin %: ${yinYang.yinPercent || 'N/A'}

PERSONALITY (if available):
- MBTI: ${chartData.mbti?.type || 'Not assessed'}
- Enneagram: ${chartData.enneagram?.wingNotation || chartData.enneagram?.type || 'Not assessed'}

Generate a COMPLETE CATHEDRAL ANALYSIS in JSON format:

{
  "summary": {
    "title": "A poetic title for this chart (e.g., 'The Seeker's Cathedral')",
    "coreIdentity": "2-3 sentences describing their essential nature",
    "primaryGift": "Their greatest natural talent/strength",
    "growthEdge": "Where they are being called to grow",
    "lifeTheme": "The overarching mythic theme of their journey"
  },

  "theBigThree": {
    "sun": {
      "placement": "Sun in [Sign] in House [X]",
      "meaning": "2-3 sentences about their core identity",
      "ahaInsight": "One surprising recognition about their Sun"
    },
    "moon": {
      "placement": "Moon in [Sign] in House [X]",
      "meaning": "2-3 sentences about their emotional nature",
      "ahaInsight": "One surprising recognition about their Moon"
    },
    "rising": {
      "placement": "[Sign] Rising, ruled by [Planet]",
      "meaning": "2-3 sentences about how they walk through the world",
      "ahaInsight": "One surprising recognition about their Rising"
    }
  },

  "signNarrations": [
    {
      "planet": "Planet name",
      "sign": "Sign name",
      "house": 1-12,
      "narration": "3-5 lines of soul-language about this placement",
      "gift": "What this placement offers them"
    }
  ],

  "houseNarrations": [
    {
      "house": 1-12,
      "theme": "House theme",
      "sign": "Sign on cusp",
      "narration": "3-5 lines about this life area",
      "planets": ["Any planets here"],
      "lifeQuestion": "The question this house asks"
    }
  ],

  "retrogradeMessages": [
    {
      "planet": "Retrograde planet name",
      "sign": "Sign",
      "message": "3-5 lines of soul-language about this inward journey",
      "practice": "One practice to work with this energy"
    }
  ],

  "directPlanetGifts": [
    {
      "planet": "Direct planet name",
      "sign": "Sign",
      "gift": "2-3 lines about how this energy flows freely"
    }
  ],

  "aspectDialogues": [
    {
      "aspect": "Planet A [type] Planet B",
      "dialogue": "A brief inner conversation between these energies",
      "teaching": "What this aspect teaches"
    }
  ],

  "epochNarrations": [
    {
      "epoch": "Life chapter name",
      "ages": "Start-End ages",
      "narration": "3-5 lines describing this mythic chapter",
      "theme": "The core theme of this era"
    }
  ],

  "soulRecognitions": [
    {
      "title": "Short title",
      "insight": "The 'aha moment' insight",
      "placement": "What this relates to"
    }
  ],

  "takeHomeToolkit": {
    "coreStrengths": ["3-5 bullet points of their natural gifts"],
    "growthAreas": ["3-5 bullet points of patterns to be gentle with"],
    "balancePractices": ["3-5 practical suggestions"],
    "dailyRitual": "One 5-minute daily practice aligned with their chart",
    "monthlyPilgrimage": "One monthly symbolic act"
  },

  "baziInsights": {
    "dayMasterNarration": "2-3 sentences about their Day Master element and what it means for their core nature",
    "elementBalance": "2-3 sentences about their elemental strengths and what elements they may need to cultivate",
    "tenGodsMessage": "A brief soul-language interpretation of their Ten Gods configuration",
    "crossCulturalBridge": "2-3 sentences connecting their BaZi Day Master to their Western Sun/Rising for a unified insight"
  },

  "numerologyInsights": {
    "lifePathNarration": "2-3 sentences about their Life Path number and soul purpose",
    "expressionNarration": "1-2 sentences about their Expression number and how they manifest in the world",
    "soulUrgeNarration": "1-2 sentences about their Soul Urge and inner desires",
    "currentYearGuidance": "1-2 sentences about their Personal Year and what it calls for"
  },

  "yinYangNarration": {
    "balanceDescription": "2-3 sentences describing their Yin/Yang constitution",
    "guidance": "1-2 sentences of guidance for working with their energy balance"
  },

  "crossCulturalSynthesis": {
    "unifiedIdentity": "3-4 sentences weaving together Western, BaZi, and Numerology into one coherent soul portrait",
    "hiddenStrength": "A surprising strength revealed by combining systems",
    "growthOpportunity": "A growth edge visible when systems are combined"
  },

  "letterFromChart": "A 500-800 word handwritten-style letter from the chart to the person, written in first person as 'I' (the chart speaking), referencing their Western placements, BaZi Day Master, Numerology Life Path, and Yin/Yang balance, ending with blessing and recognition"
}

IMPORTANT:
- Follow this exact JSON structure
- Write in soul-language: poetic, gentle, emotionally resonant
- Create "aha moments" that feel like recognition, not prediction
- Honor retrogrades as sacred inward journeys
- Celebrate direct planets as flowing gifts
- Make aspect dialogues feel like real inner conversations
- Keep everything emotionally safe and empowering
- No predictions, shame, or doom
- WEAVE TOGETHER all systems (Western, BaZi, Numerology) into a unified reading
- If a system is marked as "Not computed" or "N/A", simply skip that section gracefully

Return ONLY valid JSON, no additional text.`;
}

/**
 * Normalize chart data from various sources into the standard format
 * @param {Object} rawData - Raw chart data from various sources
 * @returns {Object} Normalized SoulChart object
 */
export function normalizeChartData(rawData) {
  // Handle data coming from the Soul Garden slice or profile
  const normalized = {
    birth: {
      date: rawData.birthDate || rawData.birth?.date || null,
      time: rawData.birthTime || rawData.birth?.time || null,
      location: rawData.birthLocation || rawData.birth?.location || null
    },
    rising: {
      sign: rawData.ascendant?.sign || rawData.rising?.sign || null,
      degree: rawData.ascendant?.degree || rawData.rising?.degree || null,
      ruler: {
        planet: rawData.ascendant?.ruler || rawData.rising?.ruler?.planet || null,
        sign: rawData.ascendant?.rulerSign || rawData.rising?.ruler?.sign || null,
        house: rawData.ascendant?.rulerHouse || rawData.rising?.ruler?.house || null
      }
    },
    planets: [],
    houses: [],
    aspects: rawData.aspects || [],
    epochs: rawData.epochs || []
  };

  // Normalize planets
  if (Array.isArray(rawData.planets)) {
    normalized.planets = rawData.planets.map(p => ({
      name: p.name || p.planet || 'Unknown',
      sign: p.sign || 'Unknown',
      degree: p.degree ?? null,
      house: p.house || 0,
      retrograde: p.retrograde || false
    }));
  }

  // Normalize houses
  if (Array.isArray(rawData.houses)) {
    normalized.houses = rawData.houses.map(h => ({
      house: h.house || h.number || 0,
      sign: h.sign || 'Unknown',
      degree: h.degree || h.cusp || 0,
      strength: h.strength || 0
    }));
  }

  return normalized;
}

/**
 * Get the appropriate model configuration for different AI providers
 * @param {string} provider - 'claude' | 'gemini' | 'grok' | 'openai'
 * @returns {Object} Model configuration
 */
export function getModelConfig(provider) {
  const configs = {
    claude: {
      model: 'claude-sonnet-4-20250514',
      maxTokens: 4096,
      temperature: 0.8
    },
    gemini: {
      model: 'gemini-1.5-pro',
      maxOutputTokens: 4096,
      temperature: 0.8
    },
    grok: {
      model: 'grok-beta',
      maxTokens: 4096,
      temperature: 0.8
    },
    openai: {
      model: 'gpt-4-turbo',
      maxTokens: 4096,
      temperature: 0.8
    }
  };

  return configs[provider] || configs.claude;
}

export default {
  // Constants
  SIGN_ARCHETYPES,
  HOUSE_MEANINGS,
  PLANET_SOULS,
  ASPECT_DYNAMICS,
  SOUL_SYSTEM_PROMPT,

  // Core Prompts
  buildLetterPrompt,
  buildStructuredNarrationPrompt,
  buildSoulWhisperPrompt,
  buildEpochNarrationPrompt,
  buildAspectDialoguePrompt,

  // New Prompts
  buildSignNarrationPrompt,
  buildHouseNarrationPrompt,
  buildRetrogradeMessagePrompt,
  buildDirectPlanetMessagePrompt,
  buildSoulRecognitionPrompt,
  buildCathedralAnalysisPrompt,

  // Utilities
  normalizeChartData,
  getModelConfig
};
