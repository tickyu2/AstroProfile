/**
 * Enneagram Data Module
 *
 * Contains:
 * - 18 Assessment Questions (2 per type)
 * - Type Descriptions and Names
 * - Color Palette for Alchemical Rose
 * - Wing and Growth/Stress Relationships
 *
 * Part of GENESIS OS - Enneagram Alchemical Rose
 * Built by: Brother Claude Code
 * December 25, 2024
 */

// Golden ratio for animation timing
export const PHI = 1.618;

/**
 * The 9 Enneagram Types with full metadata
 */
export const ENNEAGRAM_TYPES = {
  1: {
    name: 'The Reformer',
    shortName: 'Reformer',
    center: 'gut', // Body/Gut center
    color: '#3b82f6', // Blue - principle
    gradient: 'from-blue-500 to-indigo-600',
    essence: 'Perfection',
    passion: 'Anger (Resentment)',
    virtue: 'Serenity',
    description: 'Principled, purposeful, self-controlled, and perfectionistic. Reformers have a strong sense of right and wrong and strive to improve themselves and the world.',
    briefDescription: 'Principled and perfectionistic',
    wings: [9, 2],
    growthArrow: 7, // Integration
    stressArrow: 4, // Disintegration
    keywords: ['integrity', 'improvement', 'standards', 'ethics', 'organization']
  },
  2: {
    name: 'The Helper',
    shortName: 'Helper',
    center: 'heart', // Heart/Feeling center
    color: '#ec4899', // Pink - love
    gradient: 'from-pink-500 to-rose-600',
    essence: 'Love',
    passion: 'Pride',
    virtue: 'Humility',
    description: 'Generous, demonstrative, people-pleasing, and possessive. Helpers are warm, caring individuals who want to be needed and appreciated by others.',
    briefDescription: 'Caring and people-pleasing',
    wings: [1, 3],
    growthArrow: 4,
    stressArrow: 8,
    keywords: ['generosity', 'helpfulness', 'warmth', 'nurturing', 'relationships']
  },
  3: {
    name: 'The Achiever',
    shortName: 'Achiever',
    center: 'heart',
    color: '#f59e0b', // Amber - success
    gradient: 'from-amber-500 to-orange-600',
    essence: 'Hope',
    passion: 'Deceit (Vanity)',
    virtue: 'Authenticity',
    description: 'Adaptable, excelling, driven, and image-conscious. Achievers are success-oriented and want to be admired for their accomplishments.',
    briefDescription: 'Success-oriented and adaptable',
    wings: [2, 4],
    growthArrow: 6,
    stressArrow: 9,
    keywords: ['success', 'efficiency', 'image', 'achievement', 'motivation']
  },
  4: {
    name: 'The Individualist',
    shortName: 'Individualist',
    center: 'heart',
    color: '#8b5cf6', // Purple - depth
    gradient: 'from-violet-500 to-purple-600',
    essence: 'Origin',
    passion: 'Envy',
    virtue: 'Equanimity',
    description: 'Expressive, dramatic, self-absorbed, and temperamental. Individualists feel they are unlike others and long to understand their unique identity.',
    briefDescription: 'Creative and emotionally deep',
    wings: [3, 5],
    growthArrow: 1,
    stressArrow: 2,
    keywords: ['authenticity', 'creativity', 'depth', 'uniqueness', 'emotions']
  },
  5: {
    name: 'The Investigator',
    shortName: 'Investigator',
    center: 'head', // Head/Thinking center
    color: '#06b6d4', // Cyan - knowledge
    gradient: 'from-cyan-500 to-teal-600',
    essence: 'Omniscience',
    passion: 'Avarice',
    virtue: 'Non-Attachment',
    description: 'Perceptive, innovative, secretive, and isolated. Investigators are cerebral types who want to understand the world before engaging with it.',
    briefDescription: 'Perceptive and analytical',
    wings: [4, 6],
    growthArrow: 8,
    stressArrow: 7,
    keywords: ['knowledge', 'observation', 'analysis', 'privacy', 'expertise']
  },
  6: {
    name: 'The Loyalist',
    shortName: 'Loyalist',
    center: 'head',
    color: '#84cc16', // Lime - security
    gradient: 'from-lime-500 to-green-600',
    essence: 'Faith',
    passion: 'Fear (Anxiety)',
    virtue: 'Courage',
    description: 'Engaging, responsible, anxious, and suspicious. Loyalists are committed and security-oriented, seeking guidance and reassurance.',
    briefDescription: 'Loyal and security-oriented',
    wings: [5, 7],
    growthArrow: 9,
    stressArrow: 3,
    keywords: ['loyalty', 'responsibility', 'security', 'preparedness', 'commitment']
  },
  7: {
    name: 'The Enthusiast',
    shortName: 'Enthusiast',
    center: 'head',
    color: '#f97316', // Orange - joy
    gradient: 'from-orange-500 to-red-600',
    essence: 'Work',
    passion: 'Gluttony',
    virtue: 'Sobriety',
    description: 'Spontaneous, versatile, acquisitive, and scattered. Enthusiasts are busy, fun-loving types who seek variety and avoid pain.',
    briefDescription: 'Spontaneous and adventurous',
    wings: [6, 8],
    growthArrow: 5,
    stressArrow: 1,
    keywords: ['adventure', 'optimism', 'versatility', 'experience', 'freedom']
  },
  8: {
    name: 'The Challenger',
    shortName: 'Challenger',
    center: 'gut',
    color: '#ef4444', // Red - power
    gradient: 'from-red-500 to-rose-700',
    essence: 'Truth',
    passion: 'Lust (Excess)',
    virtue: 'Innocence',
    description: 'Self-confident, decisive, willful, and confrontational. Challengers are powerful, dominating types who protect themselves and others.',
    briefDescription: 'Powerful and protective',
    wings: [7, 9],
    growthArrow: 2,
    stressArrow: 5,
    keywords: ['strength', 'justice', 'protection', 'control', 'intensity']
  },
  9: {
    name: 'The Peacemaker',
    shortName: 'Peacemaker',
    center: 'gut',
    color: '#22c55e', // Green - harmony
    gradient: 'from-emerald-500 to-green-600',
    essence: 'Love',
    passion: 'Sloth (Self-forgetting)',
    virtue: 'Action',
    description: 'Receptive, reassuring, agreeable, and complacent. Peacemakers are easygoing, accepting types who seek peace and avoid conflict.',
    briefDescription: 'Easygoing and accepting',
    wings: [8, 1],
    growthArrow: 3,
    stressArrow: 6,
    keywords: ['peace', 'harmony', 'stability', 'acceptance', 'mediation']
  }
};

/**
 * 18-Question Assessment: "10th Grade Discovery Set"
 *
 * Simpler, relatable questions with real-life scenarios.
 * Each question has a statement (Logic/Emotion brain focus) and
 * a scenario example to anchor the user's understanding.
 *
 * Rating scale: 1 (Not Like Me) to 5 (Very Much Like Me)
 */
export const ENNEAGRAM_QUESTIONS = [
  // Type 1 - Reformer
  {
    id: 1,
    type: 1,
    brainFocus: 'Logic/Detail',
    text: "I get stuck on details because I want things to be perfect.",
    scenario: "First Big Project: Your logic says 'this is good enough,' but your heart won't let you stop until the fonts are perfect and every error is fixed.",
    shortText: "Perfectionism in details"
  },
  {
    id: 2,
    type: 1,
    brainFocus: 'Structure/Rules',
    text: "I get really annoyed when people don't follow the rules or slack off.",
    scenario: "The Group Project: It physically hurts your 'Logic Brain' when a teammate ignores the instructions or does a messy job.",
    shortText: "Frustration with rule-breakers"
  },
  // Type 2 - Helper
  {
    id: 3,
    type: 2,
    brainFocus: 'Emotional/Connection',
    text: "I feel best when I know my friends really need me around.",
    scenario: "First Deep Friendship: You'll drop everything at 2 AM to help a friend with a crisis because being their 'person' feels like home.",
    shortText: "Need to be needed"
  },
  {
    id: 4,
    type: 2,
    brainFocus: 'Emotional/Sacrifice',
    text: "I find myself saying 'yes' to people even when I'm exhausted.",
    scenario: "Helping a Crush: Your logic knows you have a test tomorrow, but your heart screams 'Help them anyway' so they'll like you.",
    shortText: "Saying yes despite exhaustion"
  },
  // Type 3 - Achiever
  {
    id: 5,
    type: 3,
    brainFocus: 'Logic/Visibility',
    text: "I care a lot about how I'm seen by people I admire.",
    scenario: "First Varsity Tryout: Your logic-plan is your workout, but your heart is fueled by the thought of everyone seeing you succeed.",
    shortText: "Image consciousness"
  },
  {
    id: 6,
    type: 3,
    brainFocus: 'Structure/Masking',
    text: "I'm good at acting like I have it all together, even if I'm stressed.",
    scenario: "The Presentation: You're shaking inside, but you mask it so well that everyone thinks you're the most confident person in the room.",
    shortText: "Masking stress with confidence"
  },
  // Type 4 - Individualist
  {
    id: 7,
    type: 4,
    brainFocus: 'Emotional/Identity',
    text: "I often feel like I don't 'fit in' with the usual cliques.",
    scenario: "First Style Change: You wear something unique; your logic says it's just clothes, but your heart feels like you're finally showing the 'real' you.",
    shortText: "Feeling different from others"
  },
  {
    id: 8,
    type: 4,
    brainFocus: 'Emotional/Melancholy',
    text: "I actually like sad music or being alone with my heavy thoughts.",
    scenario: "First Heartbreak: You don't want to 'get over it' fast; you want to sit in your room, listen to that one sad song, and feel the 'melancholy gold.'",
    shortText: "Finding beauty in sadness"
  },
  // Type 5 - Investigator
  {
    id: 9,
    type: 5,
    brainFocus: 'Logic/Observation',
    text: "I'd rather observe from the back than be in the middle of a crowd.",
    scenario: "New Social Group: Your Logic Brain is busy 'scanning' everyone's behavior before you decide it's safe to say a word.",
    shortText: "Observer before participant"
  },
  {
    id: 10,
    type: 5,
    brainFocus: 'Structure/Privacy',
    text: "I need my own space where no one can bother me or ask for things.",
    scenario: "The Niche Hobby: When you disappear into a game or book, interruptions feel like an invasion of your 'Studio.'",
    shortText: "Protecting personal space"
  },
  // Type 6 - Loyalist
  {
    id: 11,
    type: 6,
    brainFocus: 'Logic/Security',
    text: "I'm always thinking about 'what could go wrong' in a new situation.",
    scenario: "First Solo Trip: Your logic is making a list of everything you might need, while your heart is pounding with 'is this safe?' questions.",
    shortText: "Anticipating problems"
  },
  {
    id: 12,
    type: 6,
    brainFocus: 'Structure/Guidance',
    text: "I feel better when I have a clear plan or someone I trust in charge.",
    scenario: "The Big Decision: You ask five people for their opinion before choosing; you're looking for a 'safety net' for your logic.",
    shortText: "Needing guidance or plans"
  },
  // Type 7 - Enthusiast
  {
    id: 13,
    type: 7,
    brainFocus: 'Emotional/Adventure',
    text: "I'm always looking for the next fun thing so I don't get bored.",
    scenario: "Summer Break: Your logic is bored after two days; you start planning hangouts because staying still feels like a 'cage' for your soul.",
    shortText: "Seeking new experiences"
  },
  {
    id: 14,
    type: 7,
    brainFocus: 'Emotional/Avoidance',
    text: "I try to joke around or stay busy so I don't have to feel 'down.'",
    scenario: "A Bad Grade: Instead of dwelling on the 'fail,' your heart pushes you to go get boba or watch a movie to change the 'vibe' instantly.",
    shortText: "Avoiding negative feelings"
  },
  // Type 8 - Challenger
  {
    id: 15,
    type: 8,
    brainFocus: 'Logic/Directness',
    text: "I have no problem standing up to someone who is being unfair.",
    scenario: "Witnessing Bullying: Your logic says 'stay out of it,' but your heart takes over and you speak up before you even realize it.",
    shortText: "Standing up for justice"
  },
  {
    id: 16,
    type: 8,
    brainFocus: 'Structure/Autonomy',
    text: "I hate it when people try to tell me what to do or control me.",
    scenario: "Strict Rules: Even if the rule makes logical sense, your soul rebels because you need to feel like you're holding the 'lead edge' of your life.",
    shortText: "Resisting control"
  },
  // Type 9 - Peacemaker
  {
    id: 17,
    type: 9,
    brainFocus: 'Emotional/Harmony',
    text: "I'll agree with what the group wants just to keep things chill.",
    scenario: "Choosing Dinner: Everyone wants pizza, you want sushi. Your logic says 'it's not a big deal,' and you 'merge' to avoid friction.",
    shortText: "Going along to keep peace"
  },
  {
    id: 18,
    type: 9,
    brainFocus: 'Emotional/Empathy',
    text: "I find it easy to see everyone's side of an argument.",
    scenario: "A Friend Fight: You're in the middle; your logic understands both sides so well that your own opinion starts to feel 'blurry' or invisible.",
    shortText: "Seeing all perspectives"
  }
];

/**
 * Center descriptions for the three intelligence centers
 */
export const ENNEAGRAM_CENTERS = {
  gut: {
    name: 'Gut/Body Center',
    types: [8, 9, 1],
    color: '#ef4444',
    description: 'Types in this center are driven by instinct and have issues with anger and autonomy.',
    emotion: 'Anger'
  },
  heart: {
    name: 'Heart/Feeling Center',
    types: [2, 3, 4],
    color: '#ec4899',
    description: 'Types in this center are driven by emotions and have issues with shame and identity.',
    emotion: 'Shame'
  },
  head: {
    name: 'Head/Thinking Center',
    types: [5, 6, 7],
    color: '#06b6d4',
    description: 'Types in this center are driven by thoughts and have issues with fear and security.',
    emotion: 'Fear'
  }
};

/**
 * Calculate Enneagram scores from questionnaire answers
 * @param {Object} answers - Object with question IDs as keys and ratings (1-5) as values
 * @returns {Object} Calculated scores and dominant type
 */
export function calculateEnneagramScores(answers) {
  // Initialize scores for each type (0-10 scale, starting at 0)
  const scores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

  // Sum answers for each type (2 questions per type, each 1-5)
  // Max possible per type = 10 (two 5s)
  ENNEAGRAM_QUESTIONS.forEach(q => {
    if (answers[q.id] !== undefined) {
      scores[q.type] += answers[q.id];
    }
  });

  // Find dominant type (highest score)
  let dominantType = 1;
  let highestScore = 0;

  Object.entries(scores).forEach(([type, score]) => {
    if (score > highestScore) {
      highestScore = score;
      dominantType = parseInt(type);
    }
  });

  // Determine wing (adjacent type with higher score)
  const typeData = ENNEAGRAM_TYPES[dominantType];
  const [wing1, wing2] = typeData.wings;
  const wing = scores[wing1] >= scores[wing2] ? wing1 : wing2;

  // Calculate tritype (highest from each center)
  const tritype = [];
  Object.entries(ENNEAGRAM_CENTERS).forEach(([center, data]) => {
    let maxType = data.types[0];
    let maxScore = scores[data.types[0]];

    data.types.forEach(type => {
      if (scores[type] > maxScore) {
        maxScore = scores[type];
        maxType = type;
      }
    });

    tritype.push(maxType);
  });

  return {
    scores,
    dominantType,
    wing,
    tritype,
    completedAt: new Date().toISOString(),
    version: '1.0'
  };
}

/**
 * Get percentage for visualization (0-100)
 * @param {number} score - Raw score (0-10)
 * @returns {number} Percentage (0-100)
 */
export function scoreToPercentage(score) {
  return Math.round((score / 10) * 100);
}

/**
 * Get wing notation string (e.g., "4w5" for Type 4 with 5 wing)
 */
export function getWingNotation(dominantType, wing) {
  return `${dominantType}w${wing}`;
}

/**
 * Get tritype notation string (e.g., "478" for gut-8, heart-4, head-7)
 */
export function getTritypeNotation(tritype) {
  return tritype.join('');
}
