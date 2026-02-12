/**
 * Western Astrology AI Analysis Service
 *
 * Generates AI-powered insights from Western Astrology data
 * Routes through server-side llmProxy Cloud Function.
 *
 * GENESIS AstroProfile - Constitutional Intelligence Engine
 * January 4, 2026
 */

import { callClaudeProxy } from './llmProxyService';

// AI Analysis Generation using Claude API (via server proxy)
export async function generateWesternAIAnalysis(profile) {
  try {
    // Get sovereign calculation data (our existing structure)
    const sovereign = profile?.calculations?.western?.sovereignCalculation || {};
    const sun = sovereign.sun || {};
    const moon = sovereign.moon || {};
    const rising = sovereign.rising || {};
    const planets = sovereign.planets || {};
    const houses = sovereign.houses || {};
    const aspects = sovereign.aspects || [];
    const elementBalance = sovereign.elementBalance || {};

    // Build comprehensive prompt for AI
    const prompt = buildAnalysisPrompt({
      profile,
      sun,
      moon,
      rising,
      planets,
      houses,
      aspects,
      elementBalance
    });

    // Call Claude via server-side proxy
    const result = await callClaudeProxy({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }]
    });

    // Parse JSON response
    const analysis = JSON.parse(result.text);

    return {
      success: true,
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      profile: profile.displayName,
      analysis
    };

  } catch (error) {
    console.error('Western AI Analysis Error:', error);
    return {
      success: false,
      error: error.message,
      fallback: generateFallbackAnalysis(profile)
    };
  }
}

// Build comprehensive AI prompt
function buildAnalysisPrompt({ profile, sun, moon, rising, planets, houses, aspects, elementBalance }) {
  return `You are an expert astrologer creating a comprehensive constitutional analysis from Western Astrology data. Your analysis will be used in GENESIS, a platform for soul-level understanding and compatibility.

PROFILE DATA:
Name: ${profile.displayName}
Birth Date: ${profile.birthDate}
Birth Time: ${profile.birthTime || 'Unknown'}
Location: ${profile.location?.fullAddress || 'Unknown'}

CONSTITUTIONAL TRINITY (Most Important):
- Sun in ${sun.sign} at ${sun.degreeFormatted || sun.degree} in House ${sun.house || '?'} (Core Self, Life Force, Ego)
- Moon in ${moon.sign} at ${moon.degreeFormatted || moon.degree} in House ${moon.house || '?'} (Emotional Nature, Inner Needs)
- Rising in ${rising.sign} at ${rising.degreeFormatted || rising.degree} (Outer Personality, First Impression)

PLANETARY POSITIONS:
${formatPlanets(planets)}

ELEMENTAL BALANCE:
- Fire: ${elementBalance.fire || 0} (Passion, Inspiration, Action)
- Earth: ${elementBalance.earth || 0} (Grounding, Practicality, Stability)
- Air: ${elementBalance.air || 0} (Intellect, Communication, Ideas)
- Water: ${elementBalance.water || 0} (Emotion, Intuition, Depth)
- Dominant: ${elementBalance.dominant || 'Unknown'}

MAJOR ASPECTS:
${formatAspects(aspects)}

SYNTHESIS NAME:
Create a 2-3 word synthesis name (like "The Nurturer", "The Sage", "The Builder") that captures their core essence based on dominant patterns.

ANALYSIS REQUIRED:

Return ONLY valid JSON in this EXACT format:

{
  "synthesisName": "The [Archetype Name]",
  "synthesisSubtitle": "Brief 1-sentence essence",

  "overview": {
    "coreIdentity": "2-3 sentence description of who they are at their core",
    "worldview": "How they see the world - 2-3 sentences",
    "howWorldSeesThem": "First impressions and outer presentation - 2-3 sentences",
    "emotionalNature": "Moon sign interpretation - emotional needs and patterns - 2-3 sentences",
    "lifeApproach": "Sun sign interpretation - fundamental approach to life - 2-3 sentences",
    "elementalInterpretation": "What their elemental dominance means - 2-3 sentences"
  },

  "planets": {
    "sun": {
      "coreEssence": "Sun in ${sun.sign} essence - 2-3 sentences",
      "lifeMission": "What they're here to embody and express - 2-3 sentences",
      "strengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
      "challenges": ["challenge 1", "challenge 2", "challenge 3"],
      "shadowSide": "Potential pitfalls when unbalanced - 2 sentences"
    },
    "moon": {
      "coreEssence": "Moon in ${moon.sign} essence - 2-3 sentences",
      "emotionalNeeds": "What they need to feel safe and nurtured - 2-3 sentences",
      "strengths": ["emotional strength 1", "emotional strength 2", "emotional strength 3"],
      "challenges": ["emotional challenge 1", "emotional challenge 2"],
      "shadowSide": "Emotional shadow - 2 sentences"
    },
    "rising": {
      "coreEssence": "Rising ${rising.sign} essence - 2-3 sentences",
      "outerPersonality": "How others perceive them - 2-3 sentences",
      "strengths": ["presentation strength 1", "presentation strength 2"],
      "challenges": ["presentation challenge 1", "presentation challenge 2"]
    },
    "mercury": {
      "coreEssence": "Mercury in ${planets.mercury?.sign || 'Unknown'} - communication style - 2-3 sentences",
      "communicationStyle": "How they think, speak, and process information - 2-3 sentences",
      "strengths": ["communication strength 1", "communication strength 2", "communication strength 3"],
      "challenges": ["communication challenge 1", "communication challenge 2"],
      "preferredMedium": "Best communication format for them"
    },
    "venus": {
      "coreEssence": "Venus in ${planets.venus?.sign || 'Unknown'} - love style - 2-3 sentences",
      "loveStyle": "How they give and receive love - 2-3 sentences",
      "relationshipStyle": "Partnership approach - 2-3 sentences",
      "strengths": ["love strength 1", "love strength 2", "love strength 3"],
      "challenges": ["love challenge 1", "love challenge 2"]
    },
    "mars": {
      "coreEssence": "Mars in ${planets.mars?.sign || 'Unknown'} - drive and passion - 2-3 sentences",
      "passionStyle": "How they pursue desires and take action - 2-3 sentences",
      "conflictStyle": "How they handle anger and conflict - 2-3 sentences",
      "strengths": ["mars strength 1", "mars strength 2"],
      "challenges": ["mars challenge 1", "mars challenge 2"]
    }
  },

  "aspects": {
    ${aspects.slice(0, 5).map(a => `"${a.planet1?.name || 'Unknown'}-${a.planet2?.name || 'Unknown'}": "Interpretation of this aspect - how this energy plays out - 2-3 sentences"`).join(',\n    ')}
  },

  "synthesis": {
    "constitutionalReading": "Comprehensive 4-5 sentence synthesis of their entire chart. This is the BIG constitutional truth about who they are. Reference their synthesis name, dominant elements, key aspects, and how it all works together to create their unique soul signature.",

    "coreThemes": [
      {
        "title": "Primary constitutional theme title",
        "description": "2-3 sentence explanation of this pattern across their chart",
        "systems": 2
      }
    ],

    "forRelationships": {
      "lovingThem": "How to love this person based on Venus + Moon - 2-3 sentences",
      "theirLoveStyle": "How they express love based on Mars + Venus - 2-3 sentences",
      "conflictResolution": "Based on Mars + Moon - 2-3 sentences",
      "compatibility": "General compatibility notes based on element balance - 2 sentences"
    },

    "convergence": {
      "systemsCount": 1,
      "pointsCount": 2,
      "clarity": "60%"
    }
  }
}

IMPORTANT:
- Use poetic but precise language
- Be specific about HOW these energies manifest
- Focus on constitutional ESSENCE not generic descriptions
- Reference INTEGRATION of different placements
- This is for SOUL-LEVEL understanding, not fortune-telling
- Return ONLY the JSON, no preamble or markdown`;
}

// Format planets for prompt
function formatPlanets(planets) {
  if (!planets || Object.keys(planets).length === 0) return 'No planetary data available';

  return Object.entries(planets)
    .map(([planet, data]) => {
      if (!data) return null;
      return `- ${planet.charAt(0).toUpperCase() + planet.slice(1)}: ${data.sign} at ${data.degreeFormatted || data.degree} in House ${data.house || '?'}${data.isRetrograde ? ' (Retrograde)' : ''}`;
    })
    .filter(Boolean)
    .join('\n');
}

// Format aspects for prompt
function formatAspects(aspects) {
  if (!aspects || !Array.isArray(aspects) || aspects.length === 0) {
    return 'No major aspects available';
  }

  return aspects
    .filter(a => a.nature === 'major')
    .slice(0, 8) // Top 8 aspects
    .map(aspect => {
      const p1 = aspect.planet1?.name || 'Unknown';
      const p2 = aspect.planet2?.name || 'Unknown';
      return `- ${p1} ${aspect.aspect} ${p2} (${aspect.orb}° orb, ${aspect.quality})`;
    })
    .join('\n');
}

// Fallback analysis if AI fails
function generateFallbackAnalysis(profile) {
  const sovereign = profile?.calculations?.western?.sovereignCalculation || {};
  const sun = sovereign.sun || {};
  const moon = sovereign.moon || {};
  const rising = sovereign.rising || {};
  const elementBalance = sovereign.elementBalance || {};

  return {
    synthesisName: "The Seeker",
    synthesisSubtitle: `${sun.sign} Sun • ${moon.sign} Moon • ${rising.sign} Rising`,

    overview: {
      coreIdentity: `With Sun in ${sun.sign}, you bring unique gifts to the world. Your ${moon.sign} Moon reveals deep emotional wisdom, while your ${rising.sign} Rising creates your distinctive presence.`,

      worldview: `You perceive reality through the lens of your elemental balance, seeking ${elementBalance.dominant === 'Earth' ? 'stability and tangible results' : elementBalance.dominant === 'Fire' ? 'inspiration and growth' : elementBalance.dominant === 'Water' ? 'emotional connection and depth' : 'intellectual understanding and freedom'}.`,

      howWorldSeesThem: `Others first perceive your ${rising.sign} Rising energy - this is the mask you show the world before revealing your deeper self.`,

      emotionalNature: `Your ${moon.sign} Moon needs emotional authenticity to feel safe. This placement governs your inner world and instinctive reactions.`,

      lifeApproach: `The ${sun.sign} Sun drives your core identity and life purpose. This is who you're learning to become through this lifetime.`,

      elementalInterpretation: `Your elemental balance shapes how you engage with life, creating your unique constitutional signature. ${elementBalance.dominant || 'Your elements'} influence your approach to challenges and opportunities.`
    },

    planets: generateFallbackPlanets({ sun, moon, rising }),

    aspects: {},

    synthesis: {
      constitutionalReading: `You are a ${sun.sign} soul navigating life through ${moon.sign} emotions and ${rising.sign} presentation. This unique combination creates a constitutional signature that is distinctly yours. Your chart reveals someone designed to bring their gifts to the world in a way only you can.`,

      coreThemes: [{
        title: "Authentic Expression",
        description: "Your chart emphasizes the importance of being true to yourself while honoring your emotional needs and outer responsibilities.",
        systems: 1
      }],

      forRelationships: {
        lovingThem: "Love them by honoring their emotional needs and giving them space to be themselves.",
        theirLoveStyle: "They express love through authentic presence and genuine care.",
        conflictResolution: "They need time to process emotions and prefer honest, direct communication.",
        compatibility: "Most compatible with those who appreciate their unique blend of qualities."
      },

      convergence: {
        systemsCount: 1,
        pointsCount: 1,
        clarity: "40%"
      }
    }
  };
}

function generateFallbackPlanets({ sun, moon, rising }) {
  return {
    sun: {
      coreEssence: `Your ${sun.sign} Sun represents your core life force and authentic self.`,
      lifeMission: "To embody the highest expression of your solar energy and share your unique light.",
      strengths: ["Authenticity", "Core vitality", "Life purpose clarity"],
      challenges: ["Balance", "Self-awareness"],
      shadowSide: "Ego inflation or diminishment when disconnected from true self."
    },
    moon: {
      coreEssence: `Your ${moon.sign} Moon reveals your emotional nature and inner world.`,
      emotionalNeeds: "Emotional security through connection with your authentic feelings.",
      strengths: ["Emotional intelligence", "Intuitive knowing"],
      challenges: ["Emotional vulnerability", "Mood fluctuations"],
      shadowSide: "Emotional reactivity when needs aren't met."
    },
    rising: {
      coreEssence: `Your ${rising.sign} Rising shapes how you meet the world.`,
      outerPersonality: "The mask you wear and the energy you project.",
      strengths: ["Adaptability", "Social presence"],
      challenges: ["Authenticity vs. presentation"]
    }
  };
}

// Export for use in components
export { buildAnalysisPrompt, generateFallbackAnalysis };
