/**
 * Psychological Narrative Generator
 *
 * Creates personalized psychological myths and narrative arcs
 * based on birth chart analysis in the Liz Greene tradition.
 *
 * Transforms astrological data into a cohesive life story:
 * - The Mythic Identity (who you are)
 * - The Core Wound (what challenges you)
 * - The Sacred Quest (what you're here to do)
 * - The Shadow Journey (what you must integrate)
 * - The Hero's Stage (where you are now)
 *
 * Part of the Liz Greene Cathedral of Psychological Astrology
 * GENESIS AstroProfile - January 2026
 */

import { analyzeMythicPsychology, PLANETARY_ARCHETYPES, SHADOW_ARCHETYPES } from './mythicArchetypeSystem';
import { analyzeHerosJourney, ARCHETYPE_SIGNATURES } from './herosJourneyFramework';
import { detectAspectPatterns } from './aspectPatternDetector';

// ═══════════════════════════════════════════════════════════════════════════
// NARRATIVE TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════

const OPENING_TEMPLATES = {
  Fire: [
    "You came into this world burning with purpose,",
    "From your first breath, there was fire in your soul,",
    "Yours is the story of the eternal flame,"
  ],
  Earth: [
    "You were born to build something lasting,",
    "From the beginning, you sensed the weight of the material world,",
    "Yours is the story of the mountain that endures,"
  ],
  Air: [
    "You arrived on the wind of ideas,",
    "From your first thought, connections sparked across your mind,",
    "Yours is the story of the messenger between worlds,"
  ],
  Water: [
    "You emerged from the deep waters of feeling,",
    "From your first tear, you knew the ocean of emotion,",
    "Yours is the story of the soul that remembers everything,"
  ]
};

const WOUND_TEMPLATES = {
  father: "the wound of the absent or critical father—the voice that said you weren't enough, or the silence where approval should have been",
  mother: "the wound of imperfect nurturing—the hunger for a safety that was never quite complete, a home that was never quite whole",
  voice: "the wound of the silenced truth—the times your words were dismissed, your thoughts invalidated, your truth unwelcome",
  worth: "the wound of unlovability—the secret fear that without your masks and performances, you would be abandoned",
  power: "the wound of powerlessness—the searing memory of being unable to protect yourself or those you loved",
  meaning: "the wound of meaninglessness—the existential terror that life might be random and your efforts futile",
  belonging: "the wound of the outsider—the ache of never quite fitting, always watching the party through the window",
  betrayal: "the wound of broken trust—the devastation of opening your heart only to have it used against you"
};

const QUEST_VERBS = [
  "to discover", "to embody", "to integrate", "to transform",
  "to reclaim", "to master", "to birth", "to heal"
];

const SHADOW_JOURNEY_TEMPLATES = [
  "Your shadow walks beside you wearing the face of {shadow}. It emerges when you feel {trigger}. Beneath its dark cloak hides {protection}.",
  "The part of you that you cannot see is the {shadow}. It rises when {trigger}. What it guards—fiercely, desperately—is {protection}.",
  "In your depths lurks the {shadow}. {trigger} awakens it from sleep. But this monster guards a treasure: {protection}."
];

const GIFT_TEMPLATES = [
  "Yet you carry gifts that others do not—{gift}. These were forged in the fire of your {wound}.",
  "From your struggle emerges extraordinary capacity: {gift}. What wounded you also shaped you.",
  "Your unique offering to the world is {gift}—precisely because you understand {wound}."
];

// ═══════════════════════════════════════════════════════════════════════════
// NARRATIVE GENERATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get the dominant element from chart data
 */
function getDominantElement(chartData) {
  const elementCounts = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  const SIGN_ELEMENTS = {
    Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
    Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
    Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
    Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
  };

  // Sun counts most
  if (chartData.sun?.sign) {
    elementCounts[SIGN_ELEMENTS[chartData.sun.sign]] = (elementCounts[SIGN_ELEMENTS[chartData.sun.sign]] || 0) + 3;
  }
  // Moon counts second
  if (chartData.moon?.sign) {
    elementCounts[SIGN_ELEMENTS[chartData.moon.sign]] = (elementCounts[SIGN_ELEMENTS[chartData.moon.sign]] || 0) + 2;
  }
  // Rising counts third
  if (chartData.rising?.sign) {
    elementCounts[SIGN_ELEMENTS[chartData.rising.sign]] = (elementCounts[SIGN_ELEMENTS[chartData.rising.sign]] || 0) + 2;
  }

  // Find dominant
  let maxElement = 'Water';
  let maxCount = 0;
  Object.entries(elementCounts).forEach(([element, count]) => {
    if (count > maxCount) {
      maxCount = count;
      maxElement = element;
    }
  });

  return maxElement;
}

/**
 * Generate the opening of the narrative
 */
function generateOpening(chartData, mythicData) {
  const element = getDominantElement(chartData);
  const templates = OPENING_TEMPLATES[element] || OPENING_TEMPLATES.Water;
  const opening = templates[Math.floor(Math.random() * templates.length)];

  const sunSign = chartData.sun?.sign || 'a mysterious sign';
  const moonSign = chartData.moon?.sign || 'the hidden depths';
  const primaryArchetype = mythicData?.archetypes?.[0]?.archetype || 'The Seeker';

  return `${opening} a soul who wears the face of ${sunSign} but carries within the emotional landscape of ${moonSign}. Your mythic identity is ${primaryArchetype}—this is not who you perform for the world, but who you ARE at your core.`;
}

/**
 * Determine the core wound based on chart analysis
 */
function determineWound(chartData, mythicData) {
  const sunArchetype = PLANETARY_ARCHETYPES.sun;
  const moonArchetype = PLANETARY_ARCHETYPES.moon;
  const saturnSign = chartData.planets?.saturn?.sign;

  // Saturn sign indicates primary wound area
  const saturnWounds = {
    Aries: 'power', Taurus: 'worth', Gemini: 'voice',
    Cancer: 'mother', Leo: 'father', Virgo: 'worth',
    Libra: 'belonging', Scorpio: 'betrayal', Sagittarius: 'meaning',
    Capricorn: 'father', Aquarius: 'belonging', Pisces: 'mother'
  };

  const primaryWound = saturnWounds[saturnSign] || 'father';

  return {
    type: primaryWound,
    description: WOUND_TEMPLATES[primaryWound],
    saturnSign
  };
}

/**
 * Generate the wound narrative
 */
function generateWoundNarrative(wound) {
  return `You carry ${wound.description}. This is not weakness—it is the crucible that shapes your particular genius. Every hero's journey begins with a wound, and yours is no exception.`;
}

/**
 * Generate the quest narrative
 */
function generateQuestNarrative(chartData, mythicData, journeyData) {
  const sunArchetype = mythicData?.archetypes?.find(a => a.planet === 'sun');
  const quest = sunArchetype?.quest || 'to discover who you truly are';
  const verb = QUEST_VERBS[Math.floor(Math.random() * QUEST_VERBS.length)];

  const currentPhase = journeyData?.individuationRoadmap?.currentPhase?.name || 'discovery';

  return `Your sacred quest is ${quest}. You are currently in the "${currentPhase}" phase of your life journey—a time when ${journeyData?.individuationRoadmap?.currentPhase?.task || 'deep work is being done beneath the surface'}.`;
}

/**
 * Generate the shadow narrative
 */
function generateShadowNarrative(chartData, mythicData) {
  const shadows = mythicData?.shadows || [];
  const defenses = mythicData?.defenses || [];

  if (shadows.length === 0) {
    return "Your shadow remains elusive, which itself is telling. The parts of yourself you cannot see are working hardest.";
  }

  const primaryShadow = shadows[0];
  const template = SHADOW_JOURNEY_TEMPLATES[Math.floor(Math.random() * SHADOW_JOURNEY_TEMPLATES.length)];

  return template
    .replace('{shadow}', primaryShadow.shadow)
    .replace('{trigger}', primaryShadow.triggers || 'circumstances beyond your control')
    .replace('{protection}', primaryShadow.protects || 'a wounded part of yourself that still needs care');
}

/**
 * Generate the gift narrative
 */
function generateGiftNarrative(chartData, mythicData, wound) {
  const primaryArchetype = mythicData?.archetypes?.[0];
  const gift = primaryArchetype?.gift || 'unique perception and depth';

  const template = GIFT_TEMPLATES[Math.floor(Math.random() * GIFT_TEMPLATES.length)];

  return template
    .replace('{gift}', gift)
    .replace('{wound}', wound.description.slice(0, 50) + '...');
}

/**
 * Generate the pattern narrative
 */
function generatePatternNarrative(aspectPatterns) {
  if (!aspectPatterns?.patterns?.length && !aspectPatterns?.quincunxes?.length) {
    return "Your planets dance individually rather than in formation—each voice clear, each function distinct. This gives you flexibility but requires you to consciously integrate.";
  }

  let narrative = "";

  if (aspectPatterns.patterns?.length > 0) {
    const patternTypes = aspectPatterns.patterns.map(p => p.type).join(', ');
    narrative += `Your chart contains ${patternTypes}—major configurations that shape your psychological landscape. `;

    if (aspectPatterns.patterns.some(p => p.type === 'Grand Trine')) {
      narrative += "The Grand Trine gives you easy access to certain gifts, but may create complacency. ";
    }
    if (aspectPatterns.patterns.some(p => p.type === 'T-Square')) {
      narrative += "The T-Square drives you relentlessly toward achievement through creative tension. ";
    }
    if (aspectPatterns.patterns.some(p => p.type === 'Yod')) {
      narrative += "The Yod marks you as someone with a specific, fated mission—uncomfortable but unavoidable. ";
    }
  }

  if (aspectPatterns.quincunxes?.length > 0) {
    narrative += `${aspectPatterns.quincunxes.length} quincunx aspects create a life theme of perpetual adjustment—nothing quite fits, yet you develop remarkable adaptability.`;
  }

  return narrative;
}

/**
 * Generate the closing / future narrative
 */
function generateClosingNarrative(journeyData, wound) {
  const upcomingInitiations = journeyData?.individuationRoadmap?.upcomingInitiations || [];

  let closing = "You are not broken—you are becoming. ";

  if (upcomingInitiations.length > 0) {
    const nextInit = upcomingInitiations[0];
    closing += `Your next major initiation approaches: the ${nextInit.planet || 'Saturn'} ${nextInit.aspect || nextInit.phase} in approximately ${nextInit.yearsAway} years. This will be a time of ${nextInit.theme || 'transformation'}. `;
  }

  closing += "The wound that marked you is also the doorway to your gift. The shadow you fear is also the guardian of your gold. The story is not finished—you are still being written.";

  return closing;
}

/**
 * Generate a complete title for the narrative
 */
function generateTitle(chartData, mythicData) {
  const sunSign = chartData.sun?.sign || 'Unknown';
  const primaryArchetype = mythicData?.archetypes?.[0]?.archetype || 'The Seeker';

  const titles = [
    `The ${sunSign} ${primaryArchetype}: A Psychological Portrait`,
    `${primaryArchetype} in ${sunSign}: Your Mythic Identity`,
    `The Story of ${primaryArchetype}: A ${sunSign} Journey`,
    `Soul Portrait: ${primaryArchetype} Walking the ${sunSign} Path`
  ];

  return titles[Math.floor(Math.random() * titles.length)];
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXPORT FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate a complete psychological narrative from chart data
 * @param {Object} chartData - Western astrology chart data
 * @param {String} birthDate - Birth date for age calculation
 * @returns {Object} - Complete narrative with sections
 */
export function generatePsychologicalNarrative(chartData, birthDate) {
  if (!chartData) {
    return {
      title: 'Your Story Awaits',
      sections: [],
      fullNarrative: 'Provide birth chart data to generate your psychological narrative.',
      error: 'No chart data provided'
    };
  }

  // Gather analysis from other modules
  const mythicData = analyzeMythicPsychology(chartData);
  const journeyData = analyzeHerosJourney(chartData, birthDate);
  const aspectPatterns = detectAspectPatterns(chartData);

  // Determine core wound
  const wound = determineWound(chartData, mythicData);

  // Generate narrative sections
  const sections = [
    {
      title: 'The Mythic Identity',
      type: 'opening',
      content: generateOpening(chartData, mythicData)
    },
    {
      title: 'The Core Wound',
      type: 'wound',
      content: generateWoundNarrative(wound)
    },
    {
      title: 'The Sacred Quest',
      type: 'quest',
      content: generateQuestNarrative(chartData, mythicData, journeyData)
    },
    {
      title: 'The Shadow Journey',
      type: 'shadow',
      content: generateShadowNarrative(chartData, mythicData)
    },
    {
      title: 'Your Gifts',
      type: 'gift',
      content: generateGiftNarrative(chartData, mythicData, wound)
    },
    {
      title: 'The Pattern of Your Life',
      type: 'pattern',
      content: generatePatternNarrative(aspectPatterns)
    },
    {
      title: 'The Unfolding Story',
      type: 'closing',
      content: generateClosingNarrative(journeyData, wound)
    }
  ];

  // Combine into full narrative
  const fullNarrative = sections.map(s => s.content).join('\n\n');

  // Generate title
  const title = generateTitle(chartData, mythicData);

  return {
    title,
    subtitle: `A Psychological Portrait in the Tradition of Liz Greene`,
    sections,
    fullNarrative,
    metadata: {
      sunSign: chartData.sun?.sign,
      moonSign: chartData.moon?.sign,
      risingSign: chartData.rising?.sign,
      dominantElement: getDominantElement(chartData),
      coreWound: wound.type,
      patternCount: aspectPatterns?.patterns?.length || 0,
      quincunxCount: aspectPatterns?.quincunxes?.length || 0,
      age: journeyData?.age,
      currentPhase: journeyData?.individuationRoadmap?.currentPhase?.name
    }
  };
}

export default {
  generatePsychologicalNarrative
};
