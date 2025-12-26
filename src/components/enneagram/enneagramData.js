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
