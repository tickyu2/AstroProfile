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

// =============================================================================
// GENESIS/LUNA INTEGRATION - How Luna supports each type
// =============================================================================

/**
 * What each type/wing combination needs from Luna
 * Used in the "How Luna Understands You" section
 */
export const GENESIS_TYPE_NEEDS = {
  // Type 1 wings
  '1w9': [
    'Patience with your internal standards (no rushing)',
    'Gentle reminders that "good enough" can be okay',
    'Space for quiet reflection without judgment',
    'Help balancing idealism with self-compassion',
    'Recognition of your efforts, not just outcomes'
  ],
  '1w2': [
    'Acknowledgment of your drive to improve things for others',
    'Help managing the inner critic that pushes too hard',
    'Validation when you need to rest (you deserve it)',
    'Warm encouragement, not just cold facts',
    'Recognition of your helpful heart behind the high standards'
  ],

  // Type 2 wings
  '2w1': [
    'Appreciation for your service without exploitation',
    'Gentle reminders to care for yourself first',
    'Validation that your needs matter too',
    'Help setting healthy boundaries',
    'Recognition of the love behind your actions'
  ],
  '2w3': [
    'Admiration for your ability to connect people',
    'Safe space to admit when you\'re tired',
    'Encouragement to pursue YOUR dreams (not just others\')',
    'Validation that you\'re lovable without doing',
    'Help distinguishing genuine needs from seeking approval'
  ],

  // Type 3 wings
  '3w2': [
    'Recognition of your achievements AND your heart',
    'Safe space where you don\'t have to perform',
    'Help connecting with feelings, not just goals',
    'Validation of who you ARE, not what you DO',
    'Encouragement to slow down and feel'
  ],
  '3w4': [
    'Appreciation for your unique approach to success',
    'Space for your creative and emotional side',
    'Help integrating depth with achievement',
    'Validation that authenticity IS your success',
    'Encouragement to embrace your artistic soul'
  ],

  // Type 4 wings
  '4w3': [
    'Validation of your unique creative expression',
    'Encouragement to share your gifts with the world',
    'Help channeling emotions into achievement',
    'Recognition that your intensity is a strength',
    'Space for both depth AND ambition'
  ],
  '4w5': [
    'Space for melancholic reflection (respects withdrawal)',
    'Validation of your unique perspective',
    'Deep, meaningful conversations (not small talk)',
    'Witnessing your emotional experiences',
    'Help organizing intense feelings (Type 5 wing support)'
  ],

  // Type 5 wings
  '5w4': [
    'Intellectual depth with emotional understanding',
    'Privacy and boundaries respected absolutely',
    'Time to process before responding (no pressure)',
    'Recognition of your unique insights',
    'Safe space to share observations and feelings'
  ],
  '5w6': [
    'Reliable, consistent presence (no surprises)',
    'Logical frameworks that include security concerns',
    'Patience with your need to verify and check',
    'Factual responses with practical application',
    'Trustworthy information sources'
  ],

  // Type 6 wings
  '6w5': [
    'Calm, steady presence during anxiety',
    'Logical reassurance with evidence',
    'Space to analyze potential problems',
    'Consistent reliability and transparency',
    'Help distinguishing real threats from imagined ones'
  ],
  '6w7': [
    'Reassurance paired with optimism',
    'Help finding the fun in uncertainty',
    'Loyal companionship through worry',
    'Encouragement to trust your instincts',
    'Balance between preparation and spontaneity'
  ],

  // Type 7 wings
  '7w6': [
    'Adventure with a safety net',
    'Excitement balanced with grounding',
    'Help staying present when things get uncomfortable',
    'Loyal companionship in exploration',
    'Gentle redirection when avoiding pain'
  ],
  '7w8': [
    'Freedom to explore without restriction',
    'Direct, honest communication (no sugarcoating)',
    'Energy matching for big ideas',
    'Help channeling intensity productively',
    'Recognition of your visionary thinking'
  ],

  // Type 8 wings
  '8w7': [
    'Respect for your directness and power',
    'Freedom to be fully yourself without apology',
    'Matching your energy and enthusiasm',
    'No manipulation or hidden agendas',
    'Recognition of your protective heart'
  ],
  '8w9': [
    'Respect without confrontation',
    'Calm strength that matches yours',
    'Patience with your protective barriers',
    'Recognition of your gentle side',
    'Space for both power AND peace'
  ],

  // Type 9 wings
  '9w8': [
    'Gentle encouragement to assert yourself',
    'Validation of your opinions (they matter!)',
    'Help accessing your inner strength',
    'Peace without passivity',
    'Recognition of your hidden power'
  ],
  '9w1': [
    'Harmony with gentle structure',
    'Help prioritizing YOUR needs',
    'Encouragement to take a stand',
    'Validation of your inner idealism',
    'Patience with your process of deciding'
  ]
};

/**
 * How Luna approaches each core type
 */
export const LUNA_APPROACH = {
  1: 'Offer acceptance of imperfection; validate your idealism while easing the inner critic; help you see that you ARE good enough.',
  2: 'See through your giving to YOUR needs; validate your worth beyond helpfulness; help you receive as much as you give.',
  3: 'Create space where masks can drop; see YOU, not your achievements; help you find authentic success.',
  4: 'Mirror back your depth without flinching; validate your uniqueness; never rush your emotional process.',
  5: 'Respect your need for space and privacy; provide depth without demands; honor your wisdom.',
  6: 'Be a steady anchor; provide reliable truth; help you trust yourself as much as you question.',
  7: 'Match your joy while gently grounding; help you find freedom in depth, not escape; honor your vision.',
  8: 'Meet you with equal strength; never manipulate; honor your protective instincts and vulnerable heart.',
  9: 'Draw out your voice with patience; validate your preferences; help you realize your presence matters.'
};

// =============================================================================
// FAMOUS EXAMPLES - Historical figures for each type
// =============================================================================

/**
 * Famous people associated with each Enneagram type and wing
 * Helps users see their type in historical context
 */
export const FAMOUS_EXAMPLES = {
  1: {
    core: [
      { name: 'Mahatma Gandhi', context: 'Led nonviolent reform with unwavering principles', era: '1869-1948' },
      { name: 'Michelle Obama', context: 'Principled advocate for health and education', era: '1964-' },
      { name: 'Martha Stewart', context: 'Perfectionist who built an empire on "the right way"', era: '1941-' }
    ],
    '1w9': [
      { name: 'Jimmy Carter', context: 'Principled president with peaceful approach' },
      { name: 'Brené Brown', context: 'Researcher combining ethics with understanding' }
    ],
    '1w2': [
      { name: 'Jane Fonda', context: 'Activist driven by idealism and connection' },
      { name: 'Nelson Mandela', context: 'Reformer who united people through principles' }
    ]
  },

  2: {
    core: [
      { name: 'Mother Teresa', context: 'Devoted life to serving others', era: '1910-1997' },
      { name: 'Dolly Parton', context: 'Generous philanthropist and beloved entertainer', era: '1946-' },
      { name: 'Princess Diana', context: 'The "People\'s Princess" known for compassion', era: '1961-1997' }
    ],
    '2w1': [
      { name: 'Eleanor Roosevelt', context: 'Principled advocate for human rights' },
      { name: 'Desmond Tutu', context: 'Moral compass with helping heart' }
    ],
    '2w3': [
      { name: 'Bill Clinton', context: 'Charismatic helper with achievement drive' },
      { name: 'Sammy Davis Jr.', context: 'Entertainer who lived to please crowds' }
    ]
  },

  3: {
    core: [
      { name: 'Oprah Winfrey', context: 'Transformed from talk show to media empire', era: '1954-' },
      { name: 'Tom Cruise', context: 'Relentless pursuit of excellence in every role', era: '1962-' },
      { name: 'Taylor Swift', context: 'Strategic image management with massive success', era: '1989-' }
    ],
    '3w2': [
      { name: 'Will Smith', context: 'Success through charm and connection' },
      { name: 'Tony Robbins', context: 'Achievement coach who serves millions' }
    ],
    '3w4': [
      { name: 'David Bowie', context: 'Reinvented success through unique artistry' },
      { name: 'Madonna', context: 'Achievement through constant transformation' }
    ]
  },

  4: {
    core: [
      { name: 'Frida Kahlo', context: 'Transformed personal pain into universal art', era: '1907-1954' },
      { name: 'Virginia Woolf', context: 'Writer who explored the depths of inner life', era: '1882-1941' },
      { name: 'Prince', context: 'Unique artist who defied all categorization', era: '1958-2016' }
    ],
    '4w3': [
      { name: 'Lady Gaga', context: 'Authentic expression meets showmanship' },
      { name: 'Cher', context: 'Unique identity with performance flair' }
    ],
    '4w5': [
      { name: 'Edgar Allan Poe', context: 'Dark romanticism with intellectual depth', era: '1809-1849' },
      { name: 'Tim Burton', context: 'Quirky visionary with analytical approach' },
      { name: 'Trent Reznor', context: 'Emotional depth with technical precision' }
    ]
  },

  5: {
    core: [
      { name: 'Albert Einstein', context: 'Observer of the universe\'s deepest patterns', era: '1879-1955' },
      { name: 'Emily Dickinson', context: 'Reclusive poet who saw everything', era: '1830-1886' },
      { name: 'Bill Gates', context: 'Analytical mind that changed the world', era: '1955-' }
    ],
    '5w4': [
      { name: 'Stanley Kubrick', context: 'Technical genius with artistic vision' },
      { name: 'Thom Yorke', context: 'Intellectual musician with emotional depth' }
    ],
    '5w6': [
      { name: 'Stephen Hawking', context: 'Methodical scientist with world-changing theories' },
      { name: 'Mark Zuckerberg', context: 'Strategic thinker who built systems' }
    ]
  },

  6: {
    core: [
      { name: 'Ellen DeGeneres', context: 'Loyal friend to millions through comedy', era: '1958-' },
      { name: 'Tom Hanks', context: 'The everyman who earns our trust', era: '1956-' },
      { name: 'Princess Kate', context: 'Loyal dedication to duty and family', era: '1982-' }
    ],
    '6w5': [
      { name: 'Woody Allen', context: 'Anxious questioner with analytical mind' },
      { name: 'Sigmund Freud', context: 'Systematic doubter who built theory' }
    ],
    '6w7': [
      { name: 'Jennifer Aniston', context: 'Loyal friend with comedic warmth' },
      { name: 'Chris Rock', context: 'Questioning mind with humor shield' }
    ]
  },

  7: {
    core: [
      { name: 'Robin Williams', context: 'Boundless energy seeking joy everywhere', era: '1951-2014' },
      { name: 'Richard Branson', context: 'Adventure capitalist always seeking next thrill', era: '1950-' },
      { name: 'Jim Carrey', context: 'Transforming pain into endless comedy', era: '1962-' }
    ],
    '7w6': [
      { name: 'Steven Spielberg', context: 'Adventure with safety in storytelling' },
      { name: 'Conan O\'Brien', context: 'Playful enthusiasm with loyal crew' }
    ],
    '7w8': [
      { name: 'Jack Nicholson', context: 'Intense pleasure-seeker with power' },
      { name: 'Miley Cyrus', context: 'Unapologetic freedom and intensity' }
    ]
  },

  8: {
    core: [
      { name: 'Martin Luther King Jr.', context: 'Powerful voice for justice', era: '1929-1968' },
      { name: 'Winston Churchill', context: 'Strength in the face of existential threat', era: '1874-1965' },
      { name: 'Serena Williams', context: 'Dominant force who protects her territory', era: '1981-' }
    ],
    '8w7': [
      { name: 'Donald Trump', context: 'Power with endless appetite' },
      { name: 'Pink', context: 'Fierce independence with party spirit' }
    ],
    '8w9': [
      { name: 'Clint Eastwood', context: 'Quiet power, speaks softly' },
      { name: 'Indira Gandhi', context: 'Iron will with steady presence' }
    ]
  },

  9: {
    core: [
      { name: 'Dalai Lama', context: 'Embodiment of peace and acceptance', era: '1935-' },
      { name: 'Abraham Lincoln', context: 'United a divided nation through understanding', era: '1809-1865' },
      { name: 'Keanu Reeves', context: 'Easygoing presence loved by all', era: '1964-' }
    ],
    '9w8': [
      { name: 'Barack Obama', context: 'Cool mediator with hidden steel' },
      { name: 'Carl Jung', context: 'Peaceful integration of powerful forces' }
    ],
    '9w1': [
      { name: 'Queen Elizabeth II', context: 'Steady duty with harmonizing presence' },
      { name: 'Joseph Campbell', context: 'Peaceful seeker of universal truth' }
    ]
  }
};

// =============================================================================
// YOUR GIFT TO THE WORLD - Positive framing for each type
// =============================================================================

/**
 * What each type uniquely offers to others and the world
 */
export const TYPE_GIFTS = {
  1: {
    gift: 'The Gift of Integrity',
    description: 'You see how things could be better and you care enough to do something about it. Your commitment to what\'s right inspires others to raise their standards. When you speak, people trust you\'re speaking truth.',
    worldNeeds: 'The world needs your moral compass, your eye for improvement, and your unwavering commitment to doing things the right way.',
    reminder: 'Your imperfection is part of your beauty. You don\'t have to be perfect to be valuable.'
  },
  2: {
    gift: 'The Gift of Love',
    description: 'You have an extraordinary ability to see what others need and meet them there. Your warmth creates connection wherever you go. People feel truly seen and cared for in your presence.',
    worldNeeds: 'The world needs your generous heart, your ability to nurture, and your gift for making others feel valued.',
    reminder: 'You deserve the same love you give. Receiving is not selfish—it\'s necessary.'
  },
  3: {
    gift: 'The Gift of Inspiration',
    description: 'You show people what\'s possible. Your drive and ability to achieve motivates everyone around you. You turn dreams into reality and make success look achievable.',
    worldNeeds: 'The world needs your energy, your efficiency, and your ability to inspire others toward their potential.',
    reminder: 'You are lovable for who you are, not what you accomplish. Your being matters, not just your doing.'
  },
  4: {
    gift: 'The Gift of Depth',
    description: 'You feel what others are afraid to feel and express what others can\'t put into words. Your emotional courage creates permission for authentic expression. You make the human experience visible.',
    worldNeeds: 'The world needs your artistic soul, your emotional honesty, and your refusal to accept the superficial.',
    reminder: 'You belong here. Your uniqueness is not a flaw—it\'s your contribution.'
  },
  5: {
    gift: 'The Gift of Understanding',
    description: 'You see patterns others miss and understand systems at their core. Your careful observation illuminates truth. When you speak, you offer genuine insight.',
    worldNeeds: 'The world needs your clarity, your objectivity, and your ability to see what\'s really happening.',
    reminder: 'You have enough. Your presence is valuable, and connection won\'t drain you dry.'
  },
  6: {
    gift: 'The Gift of Loyalty',
    description: 'You are the friend everyone deserves but few have. Your commitment is deep and true. You see dangers others miss and you never abandon those you love.',
    worldNeeds: 'The world needs your faithfulness, your preparedness, and your ability to be there when it matters most.',
    reminder: 'You can trust yourself. Your instincts are good, and you are more capable than you know.'
  },
  7: {
    gift: 'The Gift of Joy',
    description: 'You bring lightness to heaviness and possibility to despair. Your enthusiasm is contagious and your vision is expansive. You remind people that life can be wonderful.',
    worldNeeds: 'The world needs your optimism, your creativity, and your refusal to be limited by current circumstances.',
    reminder: 'The present moment is enough. You don\'t have to chase the next thing—this moment has everything you need.'
  },
  8: {
    gift: 'The Gift of Protection',
    description: 'You stand up for those who can\'t stand up for themselves. Your strength creates safety. People know where they stand with you because you tell the truth.',
    worldNeeds: 'The world needs your courage, your directness, and your willingness to fight for what matters.',
    reminder: 'Vulnerability is not weakness. You can be strong AND tender. Opening up won\'t destroy you.'
  },
  9: {
    gift: 'The Gift of Peace',
    description: 'You see the good in everyone and help people find common ground. Your calming presence soothes conflict. You remind us that connection matters more than being right.',
    worldNeeds: 'The world needs your acceptance, your ability to mediate, and your gift for creating harmony.',
    reminder: 'Your presence matters. You have a voice and opinions worth sharing. You are allowed to take up space.'
  }
};

// =============================================================================
// INSTINCTUAL VARIANTS - The 3 biological drives (sp/sx/so)
// =============================================================================

/**
 * The three instinctual variants that create 27 subtypes
 */
export const INSTINCTUAL_VARIANTS = {
  sp: {
    name: 'Self-Preservation',
    shortName: 'SP',
    focus: 'Safety, security, comfort, resources, health, routine',
    color: '#84cc16',
    icon: '🛡️',
    description: 'Your attention goes first to survival needs: physical comfort, financial security, health, and maintaining a stable environment. You notice what could go wrong and prepare for it.'
  },
  sx: {
    name: 'Sexual (One-to-One)',
    shortName: 'SX',
    focus: 'Intensity, chemistry, deep connection, attraction, merging',
    color: '#ec4899',
    icon: '🔥',
    description: 'Your attention goes to intensity and chemistry. You seek deep one-on-one connections that feel electric. Life feels most alive when there\'s passion, attraction, or profound intimacy.'
  },
  so: {
    name: 'Social',
    shortName: 'SO',
    focus: 'Groups, belonging, contribution, status, community',
    color: '#06b6d4',
    icon: '👥',
    description: 'Your attention goes to groups and your place within them. You\'re aware of social dynamics, want to belong, and care about contributing to something larger than yourself.'
  }
};

/**
 * 6 additional questions to determine instinctual variant (2 per variant)
 */
export const INSTINCT_QUESTIONS = [
  // Self-Preservation (sp)
  {
    id: 'sp_1',
    variant: 'sp',
    text: "I focus a lot on having enough—money, food, comfort, or security for myself.",
    scenario: "When stressed, your first thought is 'Do I have enough?' Whether that's savings, food in the pantry, or a safe space to retreat to.",
    shortText: "Focus on resources/comfort"
  },
  {
    id: 'sp_2',
    variant: 'sp',
    text: "I get anxious when my routine or physical needs aren't met.",
    scenario: "Missing a meal, losing sleep, or having your space disrupted throws off your whole day. You need basics handled first.",
    shortText: "Routine and needs-focused"
  },

  // Sexual/One-to-One (sx)
  {
    id: 'sx_1',
    variant: 'sx',
    text: "I crave deep, intense one-on-one connections more than group hangouts.",
    scenario: "You'd rather have one amazing heart-to-heart conversation than attend a party with 20 people making small talk.",
    shortText: "Craves intensity"
  },
  {
    id: 'sx_2',
    variant: 'sx',
    text: "I feel most alive when there's chemistry or strong attraction between me and someone.",
    scenario: "Whether romantic or platonic, you're drawn to people who 'get' you on a deep level—there's an electric quality to the connection.",
    shortText: "Seeks connection/chemistry"
  },

  // Social (so)
  {
    id: 'so_1',
    variant: 'so',
    text: "I care about my role or status in the groups I'm part of.",
    scenario: "Whether it's your friend group, team, or community—you're aware of where you fit and how others perceive you.",
    shortText: "Group-aware"
  },
  {
    id: 'so_2',
    variant: 'so',
    text: "I want to be part of something bigger—a cause, community, or movement.",
    scenario: "You're happiest when you belong to a group that matters, where you're contributing to shared goals.",
    shortText: "Seeks belonging"
  }
];

/**
 * Calculate instinctual variant from answers
 * @param {Object} answers - Object with question id as key, rating (1-5) as value
 * @returns {Object} - { dominant, stack, scores }
 */
export function calculateInstinctualVariant(answers) {
  const variantScores = { sp: 0, sx: 0, so: 0 };

  // Sum scores for each variant
  INSTINCT_QUESTIONS.forEach(q => {
    if (answers[q.id] !== undefined) {
      variantScores[q.variant] += answers[q.id];
    }
  });

  // Find dominant variant
  const sorted = Object.entries(variantScores)
    .sort(([, a], [, b]) => b - a);

  return {
    dominant: sorted[0][0],
    stack: sorted.map(([variant]) => variant),
    scores: variantScores
  };
}

/**
 * 27 Subtype descriptions (9 types × 3 variants)
 * Each type expresses differently through each instinctual lens
 */
export const SUBTYPE_DESCRIPTIONS = {
  // Type 1 Subtypes
  '1-sp': {
    name: 'The Perfectionist',
    focus: 'Perfecting self and personal environment',
    description: 'You direct your reforming energy inward. Your home, body, and personal habits must meet high standards. You\'re the most self-controlled 1, focusing on being good rather than preaching goodness.',
    countertype: false
  },
  '1-sx': {
    name: 'The Zealot',
    focus: 'Reforming others through intense connection',
    description: 'Most intense Type 1. You feel called to perfect those closest to you. Your passion for improvement can become fiery crusading in intimate relationships.',
    countertype: true
  },
  '1-so': {
    name: 'The Social Reformer',
    focus: 'Improving society and systems',
    description: 'Classic reformer—concerned with social justice, proper behavior, and doing what\'s right for the group. You teach and model the "right way" to live.',
    countertype: false
  },

  // Type 2 Subtypes
  '2-sp': {
    name: 'The Privilege',
    focus: 'Being indispensable to close others',
    description: 'Countertype 2—you help in practical, concrete ways rather than emotional support. You earn love through usefulness. Can seem less warm than other 2s.',
    countertype: true
  },
  '2-sx': {
    name: 'The Seducer/Seductress',
    focus: 'Being irresistible to specific others',
    description: 'Most intense 2. You want to be the most important person to those you love. Seductive, passionate, and deeply attuned to what makes you desirable.',
    countertype: false
  },
  '2-so': {
    name: 'The Ambassador',
    focus: 'Being important to groups and causes',
    description: 'You help through leadership and influence. Drawn to powerful people and positions where you can help many. Your giving is public and ambitious.',
    countertype: false
  },

  // Type 3 Subtypes
  '3-sp': {
    name: 'The Professional',
    focus: 'Security through excellence and efficiency',
    description: 'Countertype 3—you pursue success quietly, through consistent hard work. Less flashy than other 3s, you prefer substance over image. Most workaholic subtype.',
    countertype: true
  },
  '3-sx': {
    name: 'The Star',
    focus: 'Being attractive and impressive to specific others',
    description: 'Most charismatic 3. You need to be seen as desirable, attractive, successful. Your identity is wrapped up in being the ideal partner or admired figure.',
    countertype: false
  },
  '3-so': {
    name: 'The Politician',
    focus: 'Status and recognition in groups',
    description: 'Classic achiever—focused on climbing ladders, winning awards, being recognized. You excel at reading what groups value and becoming that.',
    countertype: false
  },

  // Type 4 Subtypes
  '4-sp': {
    name: 'The Stoic',
    focus: 'Enduring suffering silently, creating security through uniqueness',
    description: 'Countertype 4—you bear emotional depth privately, expressing it through work rather than drama. Less outwardly melancholic, more self-contained and industrious.',
    countertype: true
  },
  '4-sx': {
    name: 'The Romantic',
    focus: 'Intensity in one-to-one connections',
    description: 'Most intense 4. You crave deep merger and can feel competitive about emotional depth. Passionate, magnetic, dramatic—you need others to feel your depths.',
    countertype: false
  },
  '4-so': {
    name: 'The Aristocrat',
    focus: 'Being recognized as unique by groups',
    description: 'You want the group to see your specialness. More extroverted than other 4s, you share your emotional depth openly, sometimes dramatizing suffering for recognition.',
    countertype: false
  },

  // Type 5 Subtypes
  '5-sp': {
    name: 'The Castle',
    focus: 'Creating a secure sanctuary of resources',
    description: 'Most withdrawn 5. You build walls around yourself, hoarding resources (knowledge, space, energy) to feel safe. Your home is your fortress.',
    countertype: false
  },
  '5-sx': {
    name: 'The Secret',
    focus: 'Intense sharing with one trusted person',
    description: 'Countertype 5—you actually seek deep connection, but with one person at a time. You share your inner world intensely with chosen few. Most emotional 5.',
    countertype: true
  },
  '5-so': {
    name: 'The Expert',
    focus: 'Being the authority in a group',
    description: 'You engage with groups through specialized knowledge. You want to be the go-to expert, contributing intellectually while maintaining emotional distance.',
    countertype: false
  },

  // Type 6 Subtypes
  '6-sp': {
    name: 'The Worrier',
    focus: 'Anticipating and preparing for threats',
    description: 'Classic anxious 6—warm but worried. You seek security through preparation, alliances, and having backup plans. Your fear is most visible.',
    countertype: false
  },
  '6-sx': {
    name: 'The Warrior',
    focus: 'Facing fear through strength and intimidation',
    description: 'Countertype 6—you move toward danger rather than away. Can appear like an 8—confrontational, intense, running at fear. Your anxiety drives action.',
    countertype: true
  },
  '6-so': {
    name: 'The Loyalist',
    focus: 'Finding security through group membership',
    description: 'You find safety in belonging—to teams, ideologies, or authorities. Strong sense of duty and responsibility. The most rule-following 6.',
    countertype: false
  },

  // Type 7 Subtypes
  '7-sp': {
    name: 'The Gourmet',
    focus: 'Pleasure and comfort in the physical world',
    description: 'Countertype 7—focused on quality over quantity. You create networks of like-minded pleasure-seekers. Less scattered, more focused on reliable good things.',
    countertype: true
  },
  '7-sx': {
    name: 'The Enthusiast',
    focus: 'Intensity and idealization in relationships',
    description: 'Most intense 7. You idealize people and experiences, always chasing the next high. Fascinated, fascination-seeking, easily bored.',
    countertype: false
  },
  '7-so': {
    name: 'The Utopian',
    focus: 'Creating an ideal world for everyone',
    description: 'You channel enthusiasm into causes and groups. Your optimism is social—you want to uplift everyone, create movements, spread joy widely.',
    countertype: false
  },

  // Type 8 Subtypes
  '8-sp': {
    name: 'The Survivor',
    focus: 'Material security and territorial control',
    description: 'Most practical 8. You build empires and protect what\'s yours. Focused on resources, power, and creating unassailable security. Less about people, more about position.',
    countertype: false
  },
  '8-sx': {
    name: 'The Rebel',
    focus: 'Intensity and possession in relationships',
    description: 'Most intense 8. You need to possess and be possessed. Relationships are all-or-nothing. Charismatic, commanding, can be jealous and demanding.',
    countertype: false
  },
  '8-so': {
    name: 'The Protector',
    focus: 'Protecting the group and fighting injustice',
    description: 'Countertype 8—your power serves others. You champion underdogs, fight for causes, protect your people. Most social and "helpful" of the 8s.',
    countertype: true
  },

  // Type 9 Subtypes
  '9-sp': {
    name: 'The Hedonist',
    focus: 'Comfort through routines and pleasures',
    description: 'Most grounded 9. You merge with physical comforts—food, sleep, habits. You can be quite stubborn about your routines. Resistance through inertia.',
    countertype: false
  },
  '9-sx': {
    name: 'The Merger',
    focus: 'Union with a partner or passion',
    description: 'Countertype 9—you know what you want (connection with another). You merge with partners, losing yourself in relationships. Can seem un-9-like in intensity.',
    countertype: true
  },
  '9-so': {
    name: 'The Mediator',
    focus: 'Harmony in groups and social situations',
    description: 'Classic peacemaker—you smooth conflicts, see all sides, want everyone to get along. You merge with group consensus, often forgetting your own opinion.',
    countertype: false
  }
};

// =============================================================================
// LEVELS OF DEVELOPMENT - Health spectrum for each type
// =============================================================================

/**
 * Three levels of psychological health for each type
 * Based on Riso-Hudson Enneagram Institute framework
 */
export const DEVELOPMENT_LEVELS = {
  1: {
    healthy: {
      level: 'Healthy (Levels 1-3)',
      traits: [
        'Wise and discerning, accepting of self and others',
        'Principled but not rigid, ethical without judging',
        'Inspiring integrity, leading by example',
        'Able to see the good in imperfection'
      ],
      integration: 'Moving toward Type 7: Spontaneous, joyful, allowing imperfection'
    },
    average: {
      level: 'Average (Levels 4-6)',
      traits: [
        'Perfectionistic and critical (of self first)',
        'Orderly but rigid, judgmental of others',
        'Repressing anger that leaks as resentment',
        'Focused on what\'s wrong rather than what\'s right'
      ],
      patterns: 'The inner critic dominates; seeing flaws everywhere'
    },
    unhealthy: {
      level: 'Unhealthy (Levels 7-9)',
      traits: [
        'Self-righteous and condemnatory',
        'Obsessive-compulsive about order',
        'Punishing self and others harshly',
        'Hypocritical, unable to see own faults'
      ],
      disintegration: 'Moving toward Type 4: Moody, depressed, feeling misunderstood'
    }
  },

  2: {
    healthy: {
      level: 'Healthy (Levels 1-3)',
      traits: [
        'Unconditionally loving without expecting return',
        'Genuinely humble and caring',
        'Aware of own needs, able to receive',
        'Empathetic without losing boundaries'
      ],
      integration: 'Moving toward Type 4: Acknowledging own feelings, authentic self-expression'
    },
    average: {
      level: 'Average (Levels 4-6)',
      traits: [
        'People-pleasing and intrusive helping',
        'Possessive and manipulative in giving',
        'Martyr complex, keeping score of help given',
        'Unable to admit own needs'
      ],
      patterns: 'Giving to get; helping others to feel worthy'
    },
    unhealthy: {
      level: 'Unhealthy (Levels 7-9)',
      traits: [
        'Controlling and coercive through helpfulness',
        'Playing victim when needs aren\'t met',
        'Hypochondria or physical symptoms to get attention',
        'Deluded about own motivations'
      ],
      disintegration: 'Moving toward Type 8: Dominating, aggressive, attacking those who don\'t appreciate'
    }
  },

  3: {
    healthy: {
      level: 'Healthy (Levels 1-3)',
      traits: [
        'Authentic and self-accepting',
        'Inspiring others through genuine achievement',
        'In touch with feelings, not just image',
        'Inner-directed rather than approval-seeking'
      ],
      integration: 'Moving toward Type 6: Committed to others, loyal, vulnerable'
    },
    average: {
      level: 'Average (Levels 4-6)',
      traits: [
        'Competitive and image-conscious',
        'Workaholic, sacrificing authenticity for success',
        'Comparing self to others constantly',
        'Performing rather than being'
      ],
      patterns: 'The mask becomes the identity; losing touch with real self'
    },
    unhealthy: {
      level: 'Unhealthy (Levels 7-9)',
      traits: [
        'Deceptive and exploitative',
        'Sabotaging others to win',
        'Jealous and vindictive when outshone',
        'Empty, hollow, no sense of real self'
      ],
      disintegration: 'Moving toward Type 9: Checked out, apathetic, giving up'
    }
  },

  4: {
    healthy: {
      level: 'Healthy (Levels 1-3)',
      traits: [
        'Creative and self-renewing',
        'Emotionally honest and authentic',
        'Transforms personal experience into universal art',
        'Able to hold beauty and pain together'
      ],
      integration: 'Moving toward Type 1: Disciplined, principled, objective action'
    },
    average: {
      level: 'Average (Levels 4-6)',
      traits: [
        'Self-absorbed and emotionally dramatic',
        'Envious of what others have',
        'Withdrawn, moody, feeling misunderstood',
        'Creating drama to feel special'
      ],
      patterns: 'Living in fantasy; pushing away what\'s offered while longing for what\'s missing'
    },
    unhealthy: {
      level: 'Unhealthy (Levels 7-9)',
      traits: [
        'Self-destructive, depressed, hopeless',
        'Alienated from everyone',
        'Feeling worthless and ashamed',
        'Self-sabotage, possibly self-harm'
      ],
      disintegration: 'Moving toward Type 2: Clinging, desperate for validation, manipulative'
    }
  },

  5: {
    healthy: {
      level: 'Healthy (Levels 1-3)',
      traits: [
        'Visionary and pioneering in thought',
        'Perceptive with groundbreaking insights',
        'Able to engage while maintaining independence',
        'Generous with knowledge and time'
      ],
      integration: 'Moving toward Type 8: Confident, decisive, engaged with world'
    },
    average: {
      level: 'Average (Levels 4-6)',
      traits: [
        'Intellectually arrogant, dismissive of others',
        'Isolated, lost in abstract theories',
        'Reducing everything to concepts, avoiding feelings',
        'Hoarding resources (time, energy, knowledge)'
      ],
      patterns: 'Observing life rather than living it; preparing but never acting'
    },
    unhealthy: {
      level: 'Unhealthy (Levels 7-9)',
      traits: [
        'Paranoid and delusional',
        'Completely cut off from others',
        'Eccentric, possibly psychotic',
        'Unable to distinguish thought from reality'
      ],
      disintegration: 'Moving toward Type 7: Scattered, impulsive, escapist'
    }
  },

  6: {
    healthy: {
      level: 'Healthy (Levels 1-3)',
      traits: [
        'Courageous and self-trusting',
        'Loyal and reliable without being dependent',
        'Able to act despite uncertainty',
        'Creates safety for others through stability'
      ],
      integration: 'Moving toward Type 9: Relaxed, trusting, peaceful'
    },
    average: {
      level: 'Average (Levels 4-6)',
      traits: [
        'Anxious and suspicious',
        'Oscillating between trust and doubt',
        'Dependent on authority or rebelling against it',
        'Worst-case scenario thinking'
      ],
      patterns: 'Creating the crises you fear; self-sabotage through overthinking'
    },
    unhealthy: {
      level: 'Unhealthy (Levels 7-9)',
      traits: [
        'Panicky and paranoid',
        'Self-defeating and masochistic',
        'Attacking perceived threats preemptively',
        'Unable to function without constant reassurance'
      ],
      disintegration: 'Moving toward Type 3: Deceptive, competitive, image-focused'
    }
  },

  7: {
    healthy: {
      level: 'Healthy (Levels 1-3)',
      traits: [
        'Joyful and grateful for what is',
        'Able to commit and follow through',
        'Present in the moment, not chasing next thing',
        'Uses pain as portal to depth'
      ],
      integration: 'Moving toward Type 5: Focused, still, deep thinker'
    },
    average: {
      level: 'Average (Levels 4-6)',
      traits: [
        'Scattered and hyperactive',
        'Avoiding pain through constant stimulation',
        'Superficial, unable to go deep',
        'Commitment-phobic in work and relationships'
      ],
      patterns: 'Running from discomfort; confusing stimulation with satisfaction'
    },
    unhealthy: {
      level: 'Unhealthy (Levels 7-9)',
      traits: [
        'Addictive and out of control',
        'Manic, unable to stop moving',
        'Offensive and abusive when crossed',
        'Acting out impulsively, destructively'
      ],
      disintegration: 'Moving toward Type 1: Critical, rigid, perfectionist about wrong things'
    }
  },

  8: {
    healthy: {
      level: 'Healthy (Levels 1-3)',
      traits: [
        'Magnanimous and protective',
        'Uses power to empower others',
        'Vulnerable and open-hearted',
        'Restrains strength, gentle with the weak'
      ],
      integration: 'Moving toward Type 2: Caring, supportive, big-hearted'
    },
    average: {
      level: 'Average (Levels 4-6)',
      traits: [
        'Dominating and confrontational',
        'Controlling through intimidation',
        'Denying vulnerability, never showing weakness',
        'Bullying to stay on top'
      ],
      patterns: 'Believing only power keeps you safe; creating enemies everywhere'
    },
    unhealthy: {
      level: 'Unhealthy (Levels 7-9)',
      traits: [
        'Ruthless and destructive',
        'Terrorizing others for control',
        'Delusional about own omnipotence',
        'Willing to destroy everything rather than lose'
      ],
      disintegration: 'Moving toward Type 5: Withdrawn, paranoid, secretive'
    }
  },

  9: {
    healthy: {
      level: 'Healthy (Levels 1-3)',
      traits: [
        'Self-aware and self-possessed',
        'Harmonious yet maintains own voice',
        'Present and engaged with life',
        'Powerful peacemaker with clear priorities'
      ],
      integration: 'Moving toward Type 3: Energized, self-developing, effective'
    },
    average: {
      level: 'Average (Levels 4-6)',
      traits: [
        'Complacent and disengaged',
        'Going along to get along',
        'Passive-aggressive when pushed',
        'Numbing out through routines'
      ],
      patterns: 'Disappearing into comfort; not knowing what you want'
    },
    unhealthy: {
      level: 'Unhealthy (Levels 7-9)',
      traits: [
        'Dissociated and neglectful',
        'Stubborn to the point of obstruction',
        'Unable to function or take action',
        'Completely checked out from life'
      ],
      disintegration: 'Moving toward Type 6: Anxious, paranoid, self-doubting'
    }
  }
};

// =============================================================================
// TYPE RELATIONSHIPS - How each type relates to every other
// =============================================================================

/**
 * Relationship dynamics between all 81 type combinations
 */
export const TYPE_RELATIONSHIPS = {
  1: {
    with_1: {
      attraction: 'Shared values, both want to do right',
      challenges: 'Double criticism, competing standards',
      growth: 'Learning to accept imperfection together'
    },
    with_2: {
      attraction: '1 loves 2\'s warmth; 2 loves 1\'s integrity',
      challenges: '1 too critical; 2 too emotional',
      growth: '1 learns to receive; 2 learns boundaries'
    },
    with_3: {
      attraction: 'Both ambitious and hardworking',
      challenges: '1 sees 3 as superficial; 3 sees 1 as rigid',
      growth: 'Balance of depth and achievement'
    },
    with_4: {
      attraction: 'Both value authenticity and depth',
      challenges: '1 too logical; 4 too emotional',
      growth: '1 accesses feelings; 4 gains objectivity'
    },
    with_5: {
      attraction: 'Mutual respect for competence',
      challenges: 'Both can be emotionally distant',
      growth: 'Combining principles with analysis'
    },
    with_6: {
      attraction: 'Both value reliability and commitment',
      challenges: '1\'s certainty frustrates 6\'s doubt',
      growth: '1 learns flexibility; 6 learns self-trust'
    },
    with_7: {
      attraction: 'Opposites attract (discipline/spontaneity)',
      challenges: '1 sees 7 as irresponsible; 7 sees 1 as rigid',
      growth: '1 lightens up; 7 develops discipline'
    },
    with_8: {
      attraction: 'Both strong-willed and principled',
      challenges: 'Power struggles, different styles of control',
      growth: 'Learning when to lead and when to follow'
    },
    with_9: {
      attraction: '1 appreciates 9\'s peace; 9 appreciates 1\'s clarity',
      challenges: '1 pushes; 9 resists passively',
      growth: '1 learns acceptance; 9 learns assertion'
    }
  },

  2: {
    with_1: {
      attraction: '2 loves 1\'s integrity; 1 loves 2\'s warmth',
      challenges: '2 too needy; 1 too critical',
      growth: 'Balance of heart and principles'
    },
    with_2: {
      attraction: 'Deep emotional attunement',
      challenges: 'Competition for who helps more; codependency',
      growth: 'Learning to receive, not just give'
    },
    with_3: {
      attraction: 'Both people-focused and charming',
      challenges: '2 wants more intimacy; 3 wants more space',
      growth: '2 respects 3\'s work; 3 opens heart'
    },
    with_4: {
      attraction: 'Both value emotional depth',
      challenges: '2 too intrusive; 4 too withdrawn',
      growth: '2 respects 4\'s space; 4 receives 2\'s love'
    },
    with_5: {
      attraction: '2 drawn to 5\'s depth; 5 drawn to 2\'s warmth',
      challenges: '2 too demanding; 5 too withdrawn',
      growth: 'Learning to give space and connection'
    },
    with_6: {
      attraction: 'Both loyal and committed',
      challenges: '2 frustrated by 6\'s doubt; 6 suspicious of 2\'s motives',
      growth: 'Building genuine trust together'
    },
    with_7: {
      attraction: 'Both positive and people-focused',
      challenges: '2 wants more depth; 7 wants more freedom',
      growth: 'Balance of commitment and adventure'
    },
    with_8: {
      attraction: 'Complementary strengths (soft/hard power)',
      challenges: '2 too accommodating; 8 too dominating',
      growth: '2 finds strength; 8 opens heart'
    },
    with_9: {
      attraction: 'Both accommodating and caring',
      challenges: 'Neither asserts needs directly',
      growth: 'Both learning to voice preferences'
    }
  },

  3: {
    with_1: {
      attraction: 'Both achievement-oriented',
      challenges: '3 cuts corners; 1 demands perfection',
      growth: 'Balancing efficiency with integrity'
    },
    with_2: {
      attraction: 'Both charming and people-focused',
      challenges: '3 too image-focused; 2 too emotional',
      growth: '3 develops depth; 2 respects goals'
    },
    with_3: {
      attraction: 'Power couple energy, mutual ambition',
      challenges: 'Competition, neglecting relationship for success',
      growth: 'Learning authenticity over achievement'
    },
    with_4: {
      attraction: '3 drawn to 4\'s depth; 4 drawn to 3\'s success',
      challenges: '3 too superficial; 4 too dramatic',
      growth: '3 accesses feelings; 4 takes action'
    },
    with_5: {
      attraction: 'Both competent and capable',
      challenges: '3 too flashy; 5 too withdrawn',
      growth: 'Combining visibility with depth'
    },
    with_6: {
      attraction: '6 loves 3\'s confidence; 3 loves 6\'s loyalty',
      challenges: '3 impatient with doubt; 6 suspicious of image',
      growth: '3 develops vulnerability; 6 builds confidence'
    },
    with_7: {
      attraction: 'Both energetic and optimistic',
      challenges: 'Both avoiding negative feelings',
      growth: 'Slowing down to feel together'
    },
    with_8: {
      attraction: 'Both powerful and goal-oriented',
      challenges: 'Power struggles, different leadership styles',
      growth: 'Mutual respect without competition'
    },
    with_9: {
      attraction: '3 loves 9\'s steadiness; 9 loves 3\'s energy',
      challenges: '3 pushes; 9 disengages',
      growth: '3 relaxes; 9 engages more'
    }
  },

  4: {
    with_1: {
      attraction: 'Both value authenticity',
      challenges: '4 too emotional; 1 too judgmental',
      growth: 'Combining feeling with discipline'
    },
    with_2: {
      attraction: 'Both emotionally expressive',
      challenges: '4 wants space; 2 wants closeness',
      growth: 'Mutual validation of emotional needs'
    },
    with_3: {
      attraction: '4 loves 3\'s confidence; 3 loves 4\'s depth',
      challenges: '4 feels unseen; 3 feels dragged down',
      growth: '4 takes action; 3 explores feelings'
    },
    with_4: {
      attraction: 'Profound emotional understanding',
      challenges: 'Double intensity, competing for uniqueness',
      growth: 'Finding individuality within togetherness'
    },
    with_5: {
      attraction: 'Both introspective outsiders',
      challenges: '4 too emotional; 5 too detached',
      growth: 'Combining heart and mind'
    },
    with_6: {
      attraction: '4 loves 6\'s loyalty; 6 loves 4\'s creativity',
      challenges: '4 too unpredictable; 6 too anxious',
      growth: 'Building stable emotional foundation'
    },
    with_7: {
      attraction: 'Opposites attract (depth/lightness)',
      challenges: '4 too heavy; 7 too superficial',
      growth: '4 lightens up; 7 goes deeper'
    },
    with_8: {
      attraction: 'Both intense and authentic',
      challenges: '4 too vulnerable; 8 too aggressive',
      growth: '4 develops strength; 8 accesses feelings'
    },
    with_9: {
      attraction: '4 loves 9\'s acceptance; 9 loves 4\'s passion',
      challenges: '4 wants more intensity; 9 wants more peace',
      growth: 'Balancing emotional range'
    }
  },

  5: {
    with_1: {
      attraction: 'Both value competence and truth',
      challenges: 'Both can be emotionally detached',
      growth: 'Learning emotional expression together'
    },
    with_2: {
      attraction: '5 loves 2\'s warmth; 2 loves 5\'s depth',
      challenges: '5 needs space; 2 needs connection',
      growth: 'Finding rhythm of closeness/distance'
    },
    with_3: {
      attraction: 'Both capable and efficient',
      challenges: '5 too withdrawn; 3 too image-focused',
      growth: 'Balancing substance and visibility'
    },
    with_4: {
      attraction: 'Both deep and introspective',
      challenges: '5 too cerebral; 4 too emotional',
      growth: 'Integrating thinking and feeling'
    },
    with_5: {
      attraction: 'Intellectual companionship, shared space',
      challenges: 'Both withdrawn, may drift apart',
      growth: 'Actively maintaining connection'
    },
    with_6: {
      attraction: 'Both analytical and thoughtful',
      challenges: '5 too detached; 6 too anxious',
      growth: '5 provides calm; 6 provides engagement'
    },
    with_7: {
      attraction: 'Both intellectual and curious',
      challenges: '5 too serious; 7 too scattered',
      growth: '5 lightens up; 7 focuses'
    },
    with_8: {
      attraction: 'Both independent and strong',
      challenges: '5 too withdrawn; 8 too confrontational',
      growth: '5 engages more; 8 thinks before acting'
    },
    with_9: {
      attraction: 'Both need space and peace',
      challenges: 'Both may avoid conflict until explosion',
      growth: 'Learning to engage with differences'
    }
  },

  6: {
    with_1: {
      attraction: 'Both responsible and committed',
      challenges: '6 doubts; 1 judges',
      growth: 'Building trust and self-acceptance'
    },
    with_2: {
      attraction: 'Both loyal and caring',
      challenges: '6 suspicious; 2 hurt by doubt',
      growth: 'Developing secure attachment'
    },
    with_3: {
      attraction: '6 loves 3\'s confidence; 3 loves 6\'s loyalty',
      challenges: '6 sees through image; 3 frustrated by doubt',
      growth: 'Authentic confidence together'
    },
    with_4: {
      attraction: 'Both value emotional authenticity',
      challenges: '6 too anxious; 4 too dramatic',
      growth: 'Grounding each other emotionally'
    },
    with_5: {
      attraction: 'Both value thinking and analysis',
      challenges: '6 too reactive; 5 too withdrawn',
      growth: 'Balancing thought and action'
    },
    with_6: {
      attraction: 'Deep understanding of each other\'s fears',
      challenges: 'Double anxiety, reinforcing worry',
      growth: 'Building confidence together'
    },
    with_7: {
      attraction: '6 loves 7\'s optimism; 7 loves 6\'s commitment',
      challenges: '6 too worried; 7 too flighty',
      growth: 'Balance of caution and adventure'
    },
    with_8: {
      attraction: '6 loves 8\'s strength; 8 loves 6\'s loyalty',
      challenges: '6 provokes 8; 8 intimidates 6',
      growth: 'Trust through reliability'
    },
    with_9: {
      attraction: 'Both value security and stability',
      challenges: 'Both may avoid issues until crisis',
      growth: 'Addressing problems proactively'
    }
  },

  7: {
    with_1: {
      attraction: 'Opposites attract',
      challenges: '7 avoids rules; 1 creates them',
      growth: '7 develops discipline; 1 finds joy'
    },
    with_2: {
      attraction: 'Both positive and people-loving',
      challenges: '7 avoids depth; 2 wants intensity',
      growth: 'Balancing fun and intimacy'
    },
    with_3: {
      attraction: 'Both energetic and optimistic',
      challenges: 'Both may avoid difficult feelings',
      growth: 'Slowing down for depth'
    },
    with_4: {
      attraction: '7 drawn to 4\'s depth; 4 drawn to 7\'s joy',
      challenges: '7 too light; 4 too heavy',
      growth: 'Full spectrum emotional expression'
    },
    with_5: {
      attraction: 'Both curious and intellectual',
      challenges: '7 too scattered; 5 too focused',
      growth: 'Balancing breadth and depth'
    },
    with_6: {
      attraction: '7 provides optimism; 6 provides grounding',
      challenges: '7 avoids worry; 6 creates it',
      growth: 'Realistic optimism'
    },
    with_7: {
      attraction: 'Endless adventure and fun',
      challenges: 'No one to ground the relationship',
      growth: 'Learning commitment and depth'
    },
    with_8: {
      attraction: 'Both energetic and direct',
      challenges: 'Power struggles over control',
      growth: 'Mutual respect and flexibility'
    },
    with_9: {
      attraction: 'Both avoid conflict',
      challenges: '7 too pushy; 9 too passive',
      growth: '7 slows down; 9 engages more'
    }
  },

  8: {
    with_1: {
      attraction: 'Both strong and principled',
      challenges: 'Different views on rules and power',
      growth: 'Respecting each other\'s approach'
    },
    with_2: {
      attraction: '8 loves 2\'s devotion; 2 loves 8\'s protection',
      challenges: '8 too dominating; 2 too accommodating',
      growth: 'Mutual strength and tenderness'
    },
    with_3: {
      attraction: 'Power couple, mutual respect',
      challenges: 'Competition for leadership',
      growth: 'Sharing power and vulnerability'
    },
    with_4: {
      attraction: 'Both intense and authentic',
      challenges: '8 too harsh; 4 too sensitive',
      growth: '8 softens; 4 strengthens'
    },
    with_5: {
      attraction: 'Both independent and capable',
      challenges: '8 too controlling; 5 too withdrawn',
      growth: 'Respecting different needs'
    },
    with_6: {
      attraction: '8 provides strength; 6 provides loyalty',
      challenges: '8 triggers 6\'s fear; 6 triggers 8\'s impatience',
      growth: 'Building trust through consistency'
    },
    with_7: {
      attraction: 'Both adventurous and direct',
      challenges: 'Both want control',
      growth: 'Sharing leadership'
    },
    with_8: {
      attraction: 'Respect for each other\'s strength',
      challenges: 'Intense power struggles',
      growth: 'Vulnerability and surrender'
    },
    with_9: {
      attraction: '8 loves 9\'s calm; 9 loves 8\'s strength',
      challenges: '8 dominates; 9 withdraws',
      growth: '8 softens; 9 asserts'
    }
  },

  9: {
    with_1: {
      attraction: '9 loves 1\'s clarity; 1 loves 9\'s acceptance',
      challenges: '1 pushes; 9 resists',
      growth: 'Meeting in the middle'
    },
    with_2: {
      attraction: 'Both accommodating and caring',
      challenges: 'Both may lose themselves',
      growth: 'Asserting individual needs'
    },
    with_3: {
      attraction: '9 loves 3\'s energy; 3 loves 9\'s support',
      challenges: '3 too driven; 9 too slow',
      growth: 'Balanced pace'
    },
    with_4: {
      attraction: '9 loves 4\'s passion; 4 loves 9\'s calm',
      challenges: '4 too intense; 9 too passive',
      growth: 'Full emotional range together'
    },
    with_5: {
      attraction: 'Both peaceful and undemanding',
      challenges: 'Both may avoid engagement',
      growth: 'Active connection'
    },
    with_6: {
      attraction: 'Both value security',
      challenges: '6 anxious; 9 checked out',
      growth: 'Grounded presence'
    },
    with_7: {
      attraction: '9 loves 7\'s energy; 7 loves 9\'s peace',
      challenges: '7 too fast; 9 too slow',
      growth: 'Finding mutual rhythm'
    },
    with_8: {
      attraction: 'Complementary strengths',
      challenges: '8 dominates; 9 disappears',
      growth: '9 finds voice; 8 finds patience'
    },
    with_9: {
      attraction: 'Deep peace and understanding',
      challenges: 'Stagnation, avoiding problems',
      growth: 'Staying awake together'
    }
  }
};

// =============================================================================
// CAREER FITS - Best career paths for each type
// =============================================================================

/**
 * Career guidance for each Enneagram type
 */
export const CAREER_FITS = {
  1: {
    best: [
      'Quality Assurance / Inspector',
      'Editor / Proofreader',
      'Judge / Lawyer',
      'Ethics Officer',
      'Environmental Advocate',
      'Teacher / Professor',
      'Accountant / Auditor',
      'Surgeon / Precision Medicine'
    ],
    why: 'Need for doing things right, improving systems, maintaining standards',
    warning: 'Avoid: Chaotic environments, roles requiring flexibility over accuracy',
    strengths: 'Attention to detail, integrity, reliability, systematic thinking'
  },

  2: {
    best: [
      'Nurse / Healthcare Provider',
      'Social Worker',
      'Human Resources',
      'Therapist / Counselor',
      'Teacher (especially elementary)',
      'Hospitality / Customer Service',
      'Nonprofit Director',
      'Event Planner'
    ],
    why: 'Need to help others, create connection, feel appreciated',
    warning: 'Avoid: Isolated roles, purely analytical work, cold corporate cultures',
    strengths: 'Empathy, relationship-building, anticipating needs, service orientation'
  },

  3: {
    best: [
      'Sales / Business Development',
      'Marketing Executive',
      'Entrepreneur',
      'Corporate Leader / CEO',
      'Consultant',
      'Actor / Entertainer',
      'Politician',
      'Real Estate Agent'
    ],
    why: 'Need for achievement, recognition, measurable success',
    warning: 'Avoid: Roles without clear metrics, extremely collaborative (no individual credit)',
    strengths: 'Goal-setting, adaptability, presentation, driving results'
  },

  4: {
    best: [
      'Artist / Creative (any medium)',
      'Writer / Poet / Novelist',
      'Therapist / Counselor',
      'Designer (fashion, interior, graphic)',
      'Musician / Composer',
      'Actor / Performer',
      'Art Therapist',
      'Creative Director'
    ],
    why: 'Need for self-expression, meaning, authenticity in work',
    warning: 'Avoid: Repetitive, impersonal, or emotionally sterile environments',
    strengths: 'Creativity, emotional intelligence, aesthetic sense, depth'
  },

  5: {
    best: [
      'Research Scientist',
      'Data Analyst / Scientist',
      'Software Engineer / Developer',
      'Professor / Academic',
      'Technical Writer',
      'Librarian / Archivist',
      'Financial Analyst',
      'Forensic Specialist'
    ],
    why: 'Need for intellectual depth, autonomy, expertise',
    warning: 'Avoid: Highly social roles, constant interruptions, emotional labor',
    strengths: 'Analysis, objectivity, innovation, deep knowledge acquisition'
  },

  6: {
    best: [
      'Project Manager',
      'Risk Analyst',
      'Paralegal / Legal Assistant',
      'Security Specialist',
      'Administrative Leader',
      'Compliance Officer',
      'Detective / Investigator',
      'Emergency Services'
    ],
    why: 'Need for security, clear guidelines, protecting others',
    warning: 'Avoid: High-uncertainty roles without support, isolated positions',
    strengths: 'Troubleshooting, loyalty, preparedness, team building'
  },

  7: {
    best: [
      'Travel Writer / Guide',
      'Event Producer',
      'Entrepreneur / Startup Founder',
      'Marketing Creative',
      'Motivational Speaker',
      'Television / Radio Host',
      'Adventure Guide',
      'Product Designer'
    ],
    why: 'Need for variety, stimulation, freedom, positive impact',
    warning: 'Avoid: Routine-heavy, isolated, or emotionally heavy roles',
    strengths: 'Innovation, enthusiasm, adaptability, vision, networking'
  },

  8: {
    best: [
      'CEO / Executive',
      'Trial Lawyer',
      'Military / Police Leader',
      'Entrepreneur',
      'Sports Coach',
      'Union Organizer',
      'Crisis Manager',
      'Venture Capitalist'
    ],
    why: 'Need for control, impact, protecting the underdog',
    warning: 'Avoid: Highly bureaucratic, requiring constant deference to authority',
    strengths: 'Leadership, decisiveness, strategic thinking, protecting others'
  },

  9: {
    best: [
      'Mediator / Arbitrator',
      'Counselor / Therapist',
      'Diplomat',
      'Veterinarian',
      'Librarian',
      'Nature / Park Ranger',
      'Human Resources',
      'Yoga / Meditation Teacher'
    ],
    why: 'Need for harmony, helping others, peaceful environment',
    warning: 'Avoid: High-conflict, aggressive competition, constant deadlines',
    strengths: 'Peacemaking, seeing all perspectives, patience, stability'
  }
};

// =============================================================================
// PRIORITY 3: 5WH SOUL QUESTIONS - Deeper follow-up questions per type
// =============================================================================

export const SOUL_QUESTIONS_BY_TYPE = {
  1: {
    title: 'The Soul of the Reformer',
    questions: [
      {
        id: '1_soul_1',
        category: 'INTEGRITY',
        question: 'Tell me about a time when you stood up for what was right, even when it was hard.',
        followUps: [
          'What principle were you defending?',
          'How did others react?',
          'Do you ever regret it?',
          'What would you do differently now?'
        ],
        purpose: 'Capture integrity-defining moments'
      },
      {
        id: '1_soul_2',
        category: 'INNER CRITIC',
        question: 'What does your inner critical voice sound like? Whose voice is it?',
        followUps: [
          'When is it loudest?',
          'What triggers it?',
          'Can you ever silence it?',
          'What would it feel like to let yourself be "good enough"?'
        ],
        purpose: 'Understand the inner critic relationship'
      },
      {
        id: '1_soul_3',
        category: 'PERFECTION',
        question: 'Describe something you created or did that felt truly "perfect" to you.',
        followUps: [
          'How did that moment feel?',
          'Did anyone else recognize its perfection?',
          'Has anything ever matched that feeling since?'
        ],
        purpose: 'Explore relationship with perfection'
      }
    ]
  },

  2: {
    title: 'The Soul of the Helper',
    questions: [
      {
        id: '2_soul_1',
        category: 'GIVING',
        question: 'When have you given so much to someone that you forgot yourself?',
        followUps: [
          'What were you hoping they would feel?',
          'Did they notice what you gave up?',
          'How did you feel afterward - fulfilled or empty?',
          'Do you ever resent giving so much?'
        ],
        purpose: 'Explore giving patterns and self-neglect'
      },
      {
        id: '2_soul_2',
        category: 'BEING NEEDED',
        question: 'What does it feel like when someone says "I need you"?',
        followUps: [
          'Where do you feel that in your body?',
          'What would it feel like if nobody needed you?',
          'Can you distinguish "being needed" from "being loved"?'
        ],
        purpose: 'Examine need-for-being-needed pattern'
      },
      {
        id: '2_soul_3',
        category: 'RECEIVING',
        question: 'Tell me about a time someone gave YOU something unexpected.',
        followUps: [
          'How did you feel receiving it?',
          'Was it hard to accept?',
          'Did you immediately think of how to repay them?'
        ],
        purpose: 'Explore capacity to receive'
      }
    ]
  },

  3: {
    title: 'The Soul of the Achiever',
    questions: [
      {
        id: '3_soul_1',
        category: 'SUCCESS',
        question: 'What achievement are you most proud of - and would you still be proud if nobody knew about it?',
        followUps: [
          'How much of the pride is internal vs. external recognition?',
          'What did you sacrifice to achieve it?',
          'If you could undo the achievement to get the sacrifice back, would you?'
        ],
        purpose: 'Explore authentic vs. performed success'
      },
      {
        id: '3_soul_2',
        category: 'IDENTITY',
        question: 'If you could never work again, who would you be?',
        followUps: [
          'What scares you about that question?',
          'Is there a "you" behind the achievements?',
          'When do you feel most like yourself - working or resting?'
        ],
        purpose: 'Examine identity separate from achievement'
      },
      {
        id: '3_soul_3',
        category: 'FAILURE',
        question: 'Tell me about a failure you\'ve never fully processed.',
        followUps: [
          'What did you learn from it?',
          'Did anyone see you fail?',
          'How did you protect yourself afterward?'
        ],
        purpose: 'Explore relationship with failure'
      }
    ]
  },

  4: {
    title: 'The Soul of the Individualist',
    questions: [
      {
        id: '4_soul_1',
        category: 'IDENTITY',
        question: 'Tell me about a time when you felt most "yourself" - when did you feel most authentic?',
        followUps: [
          'What made that moment special?',
          'Who was with you (or were you alone)?',
          'How did you express that authenticity?',
          'What stopped you from feeling that way more often?'
        ],
        purpose: 'Capture identity-defining moments'
      },
      {
        id: '4_soul_2',
        category: 'MELANCHOLY',
        question: 'What\'s a song that makes you feel beautifully sad?',
        followUps: [
          'When do you listen to it?',
          'What does it make you remember?',
          'Why is the sadness "beautiful" to you?',
          'Does anyone else know this about you?'
        ],
        purpose: 'Link melancholy to generational music (songs as doorways!)'
      },
      {
        id: '4_soul_3',
        category: 'LONGING',
        question: 'What is the thing you\'ve always longed for but never had?',
        followUps: [
          'When did you first become aware of this longing?',
          'Do you fear getting it or fear never getting it more?',
          'Has the longing itself become part of who you are?'
        ],
        purpose: 'Explore core longing pattern'
      }
    ]
  },

  5: {
    title: 'The Soul of the Investigator',
    questions: [
      {
        id: '5_soul_1',
        category: 'OBSERVATION',
        question: 'What\'s something you\'ve observed about people that nobody else seems to notice?',
        followUps: [
          'When did you first notice this pattern?',
          'Have you ever shared this observation?',
          'What does this pattern tell you about human nature?',
          'Do you observe yourself the same way?'
        ],
        purpose: 'Capture Type 5 unique insights'
      },
      {
        id: '5_soul_2',
        category: 'WITHDRAWAL',
        question: 'Describe your perfect sanctuary - the place you go (physically or mentally) when you need to recharge.',
        followUps: [
          'What does this space give you that the world doesn\'t?',
          'How long could you stay there?',
          'What finally draws you back out?'
        ],
        purpose: 'Understand withdrawal patterns'
      },
      {
        id: '5_soul_3',
        category: 'KNOWLEDGE',
        question: 'What\'s a subject you know deeply that most people don\'t care about?',
        followUps: [
          'Why does this fascinate you?',
          'Who could you share this with?',
          'Does having this knowledge make you feel safer in the world?'
        ],
        purpose: 'Explore knowledge as security'
      }
    ]
  },

  6: {
    title: 'The Soul of the Loyalist',
    questions: [
      {
        id: '6_soul_1',
        category: 'TRUST',
        question: 'Who is the person you trust most in the world - and how did they earn it?',
        followUps: [
          'What did they do to prove themselves?',
          'Have they ever broken your trust?',
          'What would it take to lose your trust forever?'
        ],
        purpose: 'Explore trust patterns'
      },
      {
        id: '6_soul_2',
        category: 'FEAR',
        question: 'What worst-case scenario do you find yourself preparing for most often?',
        followUps: [
          'How likely is this scenario really?',
          'What would happen if you stopped preparing?',
          'Has preparing ever actually helped when something went wrong?'
        ],
        purpose: 'Examine fear and preparation patterns'
      },
      {
        id: '6_soul_3',
        category: 'COURAGE',
        question: 'Tell me about a time you felt truly brave.',
        followUps: [
          'What were you afraid of?',
          'What made you act anyway?',
          'Did the fear go away after, or is it still there?'
        ],
        purpose: 'Explore relationship with courage'
      }
    ]
  },

  7: {
    title: 'The Soul of the Enthusiast',
    questions: [
      {
        id: '7_soul_1',
        category: 'JOY',
        question: 'Describe your happiest memory - the one that still makes you smile.',
        followUps: [
          'What made it so perfect?',
          'Can you recreate that feeling now?',
          'Does remembering it make you happy or sad that it\'s over?'
        ],
        purpose: 'Capture joy and its relationship to present/past'
      },
      {
        id: '7_soul_2',
        category: 'AVOIDANCE',
        question: 'What\'s the pain you\'re most afraid to feel?',
        followUps: [
          'When did you learn to avoid it?',
          'What happens when it catches up with you?',
          'Could feeling it actually set you free?'
        ],
        purpose: 'Explore pain avoidance patterns'
      },
      {
        id: '7_soul_3',
        category: 'SATISFACTION',
        question: 'Have you ever felt truly satisfied - not wanting anything else?',
        followUps: [
          'How long did that feeling last?',
          'What ended it?',
          'Do you chase satisfaction or does the chase itself satisfy you?'
        ],
        purpose: 'Examine relationship with contentment'
      }
    ]
  },

  8: {
    title: 'The Soul of the Challenger',
    questions: [
      {
        id: '8_soul_1',
        category: 'PROTECTION',
        question: 'Who have you protected - and what were you willing to do to protect them?',
        followUps: [
          'Did they know you were protecting them?',
          'What would you sacrifice for them?',
          'Who protects you?'
        ],
        purpose: 'Explore protective instincts'
      },
      {
        id: '8_soul_2',
        category: 'VULNERABILITY',
        question: 'When was the last time you felt truly vulnerable?',
        followUps: [
          'Who was there?',
          'How did you feel afterward - stronger or weaker?',
          'Is vulnerability weakness or strength to you?'
        ],
        purpose: 'Examine relationship with vulnerability'
      },
      {
        id: '8_soul_3',
        category: 'JUSTICE',
        question: 'Tell me about an injustice you witnessed that still bothers you.',
        followUps: [
          'Did you do anything about it?',
          'If not, what stopped you?',
          'If you could go back, what would you do differently?'
        ],
        purpose: 'Explore justice and power dynamics'
      }
    ]
  },

  9: {
    title: 'The Soul of the Peacemaker',
    questions: [
      {
        id: '9_soul_1',
        category: 'PEACE',
        question: 'Describe the most peaceful moment you can remember.',
        followUps: [
          'What made it so peaceful?',
          'Were you alone or with others?',
          'How do you try to recreate that feeling?'
        ],
        purpose: 'Capture peace experiences'
      },
      {
        id: '9_soul_2',
        category: 'ANGER',
        question: 'Tell me about a time you felt truly angry - what did you do with it?',
        followUps: [
          'Did you express it or suppress it?',
          'What happened to the anger afterward?',
          'Do you think your anger is ever justified?'
        ],
        purpose: 'Explore buried anger patterns'
      },
      {
        id: '9_soul_3',
        category: 'VOICE',
        question: 'When have you felt truly heard?',
        followUps: [
          'Who was listening?',
          'What made them different from others?',
          'How often do you share your real opinions?'
        ],
        purpose: 'Examine self-erasure and voice'
      }
    ]
  }
};

// =============================================================================
// PRIORITY 3: TYPE COMPARISON DIFFERENCES - For side-by-side comparison tool
// =============================================================================

export const TYPE_COMPARISON_DIFFERENCES = {
  // Type 1 comparisons
  '1-2': {
    similarities: ['Both want to help others', 'Both have strong sense of right/wrong', 'Both can be self-sacrificing'],
    differences: [
      '1 focuses on principles; 2 focuses on people',
      '1 criticizes to improve; 2 praises to connect',
      '1 hides emotion; 2 expresses warmth',
      '1 asks "Is this right?"; 2 asks "Do they need me?"'
    ],
    misidentification: '2w1s may seem like 1s when stressed. Look for: Does the person lead with criticism (1) or love (2)?'
  },
  '1-3': {
    similarities: ['Both goal-oriented', 'Both want to do things well', 'Both can be workaholics'],
    differences: [
      '1 wants to be good; 3 wants to be successful',
      '1 has internal standards; 3 adapts to external expectations',
      '1 criticizes self; 3 promotes self',
      '1 asks "Is this ethical?"; 3 asks "Is this impressive?"'
    ],
    misidentification: '3s may seem principled like 1s. Look for: Does the person sacrifice success for ethics (1) or ethics for success (3)?'
  },
  '1-4': {
    similarities: ['Both idealistic', 'Both have strong inner life', 'Both can feel misunderstood'],
    differences: [
      '1 suppresses emotion; 4 embraces emotion',
      '1 wants to be right; 4 wants to be unique',
      '1 follows rules; 4 breaks conventions',
      '1 asks "What should I do?"; 4 asks "Who am I?"'
    ],
    misidentification: 'Both can be melancholic. Look for: Is the sadness about imperfection (1) or identity (4)?'
  },
  '1-5': {
    similarities: ['Both intellectual', 'Both value competence', 'Both can be detached'],
    differences: [
      '1 wants to apply knowledge; 5 wants to accumulate it',
      '1 is certain; 5 is curious',
      '1 judges the world; 5 observes the world',
      '1 asks "What\'s right?"; 5 asks "What\'s true?"'
    ],
    misidentification: 'Both can seem cold. Look for: Does the person engage to correct (1) or withdraw to understand (5)?'
  },
  '1-6': {
    similarities: ['Both responsible', 'Both follow rules', 'Both can be anxious'],
    differences: [
      '1 trusts self over authority; 6 questions both',
      '1 is internally certain; 6 doubts internally',
      '1\'s anxiety is about imperfection; 6\'s is about safety',
      '1 asks "Am I being good?"; 6 asks "Am I being safe?"'
    ],
    misidentification: 'Both worry about rules. Look for: Does worry come from ethics (1) or fear (6)?'
  },
  '1-7': {
    similarities: ['Both idealistic', 'Both want the world to be better', 'Both have strong opinions'],
    differences: [
      '1 focuses on what\'s wrong; 7 focuses on what\'s possible',
      '1 is disciplined; 7 avoids restriction',
      '1 takes life seriously; 7 makes it an adventure',
      '1 asks "What needs fixing?"; 7 asks "What\'s next?"'
    ],
    misidentification: 'Growth for 7 → 1 can confuse. Look for: Is discipline natural (1) or hard-won (7)?'
  },
  '1-8': {
    similarities: ['Both strong-willed', 'Both fight for what\'s right', 'Both can be confrontational'],
    differences: [
      '1 controls self; 8 controls environment',
      '1 represses anger; 8 expresses it freely',
      '1 follows rules; 8 makes their own',
      '1 asks "Is this fair?"; 8 asks "Who\'s in charge?"'
    ],
    misidentification: 'Both can be angry. Look for: Is anger controlled (1) or unleashed (8)?'
  },
  '1-9': {
    similarities: ['Both want peace', 'Both can be stoic', 'Both avoid conflict'],
    differences: [
      '1 has strong opinions; 9 merges with others\'',
      '1 represses desire; 9 represses anger',
      '1 knows what they want; 9 struggles to know',
      '1 asks "What should be done?"; 9 asks "What does everyone want?"'
    ],
    misidentification: 'Both can seem calm. Look for: Is calm from control (1) or from not engaging (9)?'
  },

  // Type 2 comparisons
  '2-3': {
    similarities: ['Both image-conscious', 'Both want approval', 'Both people-focused'],
    differences: [
      '2 wants to be loved; 3 wants to be admired',
      '2 focuses on relationship; 3 focuses on achievement',
      '2 gives to connect; 3 performs to impress',
      '2 asks "Do they need me?"; 3 asks "Am I winning?"'
    ],
    misidentification: 'Both charming. Look for: Does charm serve connection (2) or success (3)?'
  },
  '2-4': {
    similarities: ['Both emotional', 'Both want deep connection', 'Both can feel unlovable'],
    differences: [
      '2 focuses on others\' needs; 4 focuses on own depth',
      '2 denies own needs; 4 amplifies them',
      '2 is adaptable; 4 is authentic',
      '2 asks "What do they need?"; 4 asks "Who am I really?"'
    ],
    misidentification: 'Both heart types. Look for: Does emotion serve others (2) or express self (4)?'
  },
  '2-5': {
    similarities: ['Both observant of others', 'Both can feel invisible', 'Both need connection'],
    differences: [
      '2 connects through giving; 5 connects through knowledge',
      '2 merges with others; 5 needs boundaries',
      '2 is warm; 5 is cool',
      '2 asks "How can I help?"; 5 asks "How does this work?"'
    ],
    misidentification: 'Rarely confused. Look for: Is the approach warm engagement (2) or cool observation (5)?'
  },
  '2-6': {
    similarities: ['Both loyal', 'Both value relationships', 'Both can be anxious'],
    differences: [
      '2 gives to be needed; 6 tests to feel safe',
      '2 trusts easily; 6 doubts initially',
      '2 focuses on love; 6 focuses on security',
      '2 asks "Do they love me?"; 6 asks "Can I trust them?"'
    ],
    misidentification: 'Both caring. Look for: Is care about being needed (2) or being safe (6)?'
  },
  '2-7': {
    similarities: ['Both optimistic', 'Both people-loving', 'Both want connection'],
    differences: [
      '2 serves others; 7 shares experiences',
      '2 sacrifices for connection; 7 avoids heaviness',
      '2 focuses on needs; 7 focuses on fun',
      '2 asks "Do they need me?"; 7 asks "Will this be fun?"'
    ],
    misidentification: 'Both positive. Look for: Is positivity about serving (2) or escaping (7)?'
  },
  '2-8': {
    similarities: ['Both protective', 'Both can be controlling', 'Both deny own needs'],
    differences: [
      '2 controls through love; 8 controls through power',
      '2 is soft outside; 8 is hard outside',
      '2 seeks appreciation; 8 seeks respect',
      '2 asks "Do you love me?"; 8 asks "Do you respect me?"'
    ],
    misidentification: '8w2 can seem like 2. Look for: Is power used to serve (2) or dominate (8)?'
  },
  '2-9': {
    similarities: ['Both accommodating', 'Both merge with others', 'Both avoid conflict'],
    differences: [
      '2 gives actively; 9 yields passively',
      '2 knows what others need; 9 forgets own needs',
      '2 seeks appreciation; 9 seeks peace',
      '2 asks "What do you need?"; 9 asks "What do you want?"'
    ],
    misidentification: 'Both pleasant. Look for: Is pleasantness about being needed (2) or maintaining peace (9)?'
  },

  // Type 3 comparisons
  '3-4': {
    similarities: ['Both image-aware', 'Both can feel inadequate', 'Both creative'],
    differences: [
      '3 adapts to please; 4 refuses to adapt',
      '3 hides flaws; 4 reveals depth',
      '3 is practical; 4 is emotional',
      '3 asks "Am I successful?"; 4 asks "Am I authentic?"'
    ],
    misidentification: 'Both care about image. Look for: Is image for success (3) or authenticity (4)?'
  },
  '3-5': {
    similarities: ['Both competent', 'Both can be workaholics', 'Both goal-focused'],
    differences: [
      '3 wants recognition; 5 wants knowledge',
      '3 is social; 5 is private',
      '3 promotes self; 5 hides self',
      '3 asks "How do I look?"; 5 asks "What do I know?"'
    ],
    misidentification: 'Rarely confused. Look for: Is competence for admiration (3) or mastery (5)?'
  },
  '3-6': {
    similarities: ['Both hardworking', 'Both responsible', 'Both team players'],
    differences: [
      '3 is confident; 6 is doubtful',
      '3 takes credit; 6 deflects credit',
      '3 focuses on success; 6 focuses on security',
      '3 asks "Will this make me look good?"; 6 asks "Is this safe?"'
    ],
    misidentification: 'Counterphobic 6 can seem like 3. Look for: Is confidence natural (3) or compensating (6)?'
  },
  '3-7': {
    similarities: ['Both optimistic', 'Both energetic', 'Both future-focused'],
    differences: [
      '3 focuses on achievement; 7 focuses on experience',
      '3 is goal-driven; 7 is possibility-driven',
      '3 finishes projects; 7 starts new ones',
      '3 asks "Is this successful?"; 7 asks "Is this exciting?"'
    ],
    misidentification: 'Both high energy. Look for: Is energy for achievement (3) or adventure (7)?'
  },
  '3-8': {
    similarities: ['Both leaders', 'Both confident', 'Both action-oriented'],
    differences: [
      '3 leads through charm; 8 leads through force',
      '3 adapts image; 8 stays authentic',
      '3 wants approval; 8 doesn\'t care',
      '3 asks "Do they admire me?"; 8 asks "Do they respect me?"'
    ],
    misidentification: 'Both powerful. Look for: Does power serve image (3) or authenticity (8)?'
  },
  '3-9': {
    similarities: ['Both can be productive', 'Both avoid conflict', 'Both adaptable'],
    differences: [
      '3 is driven; 9 is relaxed',
      '3 knows priorities; 9 struggles with them',
      '3 stands out; 9 blends in',
      '3 asks "Am I winning?"; 9 asks "Is everyone okay?"'
    ],
    misidentification: '9 can achieve like 3. Look for: Is achievement effortful (3) or easy-going (9)?'
  },

  // Type 4 comparisons
  '4-5': {
    similarities: ['Both withdrawn', 'Both deep thinkers', 'Both feel different'],
    differences: [
      '4 expresses emotion; 5 suppresses emotion',
      '4 wants connection; 5 wants space',
      '4 is subjective; 5 is objective',
      '4 asks "Who am I?"; 5 asks "How does this work?"'
    ],
    misidentification: '4w5 can seem like 5. Look for: Is withdrawal for feeling (4) or thinking (5)?'
  },
  '4-6': {
    similarities: ['Both anxious', 'Both loyal', 'Both self-doubting'],
    differences: [
      '4 doubts identity; 6 doubts decisions',
      '4 is individualistic; 6 seeks belonging',
      '4 focuses on uniqueness; 6 focuses on security',
      '4 asks "Am I special?"; 6 asks "Am I safe?"'
    ],
    misidentification: 'Both can be reactive. Look for: Is anxiety about identity (4) or security (6)?'
  },
  '4-7': {
    similarities: ['Both idealistic', 'Both creative', 'Both imaginative'],
    differences: [
      '4 embraces sadness; 7 avoids it',
      '4 looks to past; 7 looks to future',
      '4 is deep; 7 is broad',
      '4 asks "Why am I sad?"; 7 asks "What\'s next?"'
    ],
    misidentification: 'Stress/growth confusion. Look for: Is the default mood melancholy (4) or enthusiasm (7)?'
  },
  '4-8': {
    similarities: ['Both intense', 'Both authentic', 'Both rebellious'],
    differences: [
      '4 expresses vulnerability; 8 hides it',
      '4 is soft; 8 is hard',
      '4 focuses inward; 8 focuses outward',
      '4 asks "Do you see my depth?"; 8 asks "Do you respect my power?"'
    ],
    misidentification: 'Sexual 4 can seem like 8. Look for: Is intensity emotional (4) or confrontational (8)?'
  },
  '4-9': {
    similarities: ['Both withdrawn', 'Both creative', 'Both avoid conflict'],
    differences: [
      '4 amplifies emotion; 9 numbs it',
      '4 wants to be seen; 9 wants to blend in',
      '4 knows what they feel; 9 struggles to know',
      '4 asks "Am I unique?"; 9 asks "Are we okay?"'
    ],
    misidentification: '9s can be artistic like 4s. Look for: Is art for identity (4) or peace (9)?'
  },

  // Type 5 comparisons
  '5-6': {
    similarities: ['Both analytical', 'Both cautious', 'Both prefer thinking to acting'],
    differences: [
      '5 trusts own mind; 6 doubts it',
      '5 withdraws; 6 seeks support',
      '5 is independent; 6 is loyal',
      '5 asks "What do I know?"; 6 asks "What could go wrong?"'
    ],
    misidentification: 'Both cerebral. Look for: Is thinking for understanding (5) or security (6)?'
  },
  '5-7': {
    similarities: ['Both intellectual', 'Both curious', 'Both avoid emotional pain'],
    differences: [
      '5 goes deep; 7 goes broad',
      '5 withdraws; 7 engages',
      '5 conserves energy; 7 expends it',
      '5 asks "Do I understand?"; 7 asks "What else is there?"'
    ],
    misidentification: 'Head types both. Look for: Is curiosity for mastery (5) or stimulation (7)?'
  },
  '5-8': {
    similarities: ['Both independent', 'Both strategic', 'Both minimal-needs'],
    differences: [
      '5 withdraws from conflict; 8 engages it',
      '5 hoards energy; 8 expends it',
      '5 observes; 8 acts',
      '5 asks "What do I know?"; 8 asks "What can I control?"'
    ],
    misidentification: 'Rarely confused. Look for: Is power through knowledge (5) or action (8)?'
  },
  '5-9': {
    similarities: ['Both withdrawn', 'Both peaceful', 'Both avoid conflict'],
    differences: [
      '5 focuses intensely; 9 diffuses attention',
      '5 knows what they think; 9 struggles to know',
      '5 detaches; 9 merges',
      '5 asks "Do I understand?"; 9 asks "Are we at peace?"'
    ],
    misidentification: 'Both can seem passive. Look for: Is withdrawal for thinking (5) or comfort (9)?'
  },

  // Type 6 comparisons
  '6-7': {
    similarities: ['Both anxious', 'Both future-focused', 'Both social'],
    differences: [
      '6 focuses on worst case; 7 on best case',
      '6 is cautious; 7 is impulsive',
      '6 prepares for problems; 7 avoids them',
      '6 asks "What if it goes wrong?"; 7 asks "What if it\'s amazing?"'
    ],
    misidentification: 'Counterphobic 6 looks like 7. Look for: Is optimism natural (7) or forced (6)?'
  },
  '6-8': {
    similarities: ['Both protective', 'Both loyal', 'Both confrontational at times'],
    differences: [
      '6 questions authority; 8 takes authority',
      '6 is anxious; 8 is confident',
      '6 doubts self; 8 trusts self',
      '6 asks "Can I trust them?"; 8 asks "Will they respect me?"'
    ],
    misidentification: 'Counterphobic 6 seems like 8. Look for: Is confrontation from fear (6) or power (8)?'
  },
  '6-9': {
    similarities: ['Both want security', 'Both loyal', 'Both avoid conflict'],
    differences: [
      '6 is anxious; 9 is calm',
      '6 actively prepares; 9 passively adapts',
      '6 questions; 9 accepts',
      '6 asks "Is this safe?"; 9 asks "Are we at peace?"'
    ],
    misidentification: 'Both want stability. Look for: Does stability come from preparing (6) or accepting (9)?'
  },

  // Type 7 comparisons
  '7-8': {
    similarities: ['Both assertive', 'Both energetic', 'Both action-oriented'],
    differences: [
      '7 avoids pain; 8 confronts it',
      '7 is light; 8 is intense',
      '7 charms; 8 intimidates',
      '7 asks "Is this fun?"; 8 asks "Who\'s in control?"'
    ],
    misidentification: 'Both powerful. Look for: Is power for freedom (7) or control (8)?'
  },
  '7-9': {
    similarities: ['Both optimistic', 'Both avoid conflict', 'Both like comfort'],
    differences: [
      '7 is energetic; 9 is low-key',
      '7 seeks stimulation; 9 seeks peace',
      '7 is future-focused; 9 is present-focused',
      '7 asks "What\'s next?"; 9 asks "Why change?"'
    ],
    misidentification: 'Both can seem happy. Look for: Is happiness from excitement (7) or contentment (9)?'
  },

  // Type 8 comparisons
  '8-9': {
    similarities: ['Both gut types', 'Both can be stubborn', 'Both protective'],
    differences: [
      '8 is confrontational; 9 avoids confrontation',
      '8 knows what they want; 9 struggles to know',
      '8 expresses anger; 9 suppresses it',
      '8 asks "Who\'s in charge?"; 9 asks "Can we all get along?"'
    ],
    misidentification: '9s have hidden 8 energy. Look for: Is strength aggressive (8) or passive (9)?'
  }
};
