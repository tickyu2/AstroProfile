// ============================================================================
// HOUSE LEARNING PANEL — Zodiac Sign Content Data
// SIGN_RULERS, ZODIAC_SIGNS, SIGN_ZONE_DETAILS
// ============================================================================

import type { ZodiacSignContent, SignZoneData } from './types';

// Sign rulership data
export const SIGN_RULERS: Record<string, { ruler: string; symbol: string; element: string; modality: string }> = {
  Aries: { ruler: 'Mars', symbol: '♈', element: 'Fire', modality: 'Cardinal' },
  Taurus: { ruler: 'Venus', symbol: '♉', element: 'Earth', modality: 'Fixed' },
  Gemini: { ruler: 'Mercury', symbol: '♊', element: 'Air', modality: 'Mutable' },
  Cancer: { ruler: 'Moon', symbol: '♋', element: 'Water', modality: 'Cardinal' },
  Leo: { ruler: 'Sun', symbol: '♌', element: 'Fire', modality: 'Fixed' },
  Virgo: { ruler: 'Mercury', symbol: '♍', element: 'Earth', modality: 'Mutable' },
  Libra: { ruler: 'Venus', symbol: '♎', element: 'Air', modality: 'Cardinal' },
  Scorpio: { ruler: 'Pluto', symbol: '♏', element: 'Water', modality: 'Fixed' },
  Sagittarius: { ruler: 'Jupiter', symbol: '♐', element: 'Fire', modality: 'Mutable' },
  Capricorn: { ruler: 'Saturn', symbol: '♑', element: 'Earth', modality: 'Cardinal' },
  Aquarius: { ruler: 'Uranus', symbol: '♒', element: 'Air', modality: 'Fixed' },
  Pisces: { ruler: 'Neptune', symbol: '♓', element: 'Water', modality: 'Mutable' },
};

// ============================================================================
// ZODIAC SIGN EDUCATIONAL CONTENT (Tab 0.1)
// Complete foundation for understanding the 12 zodiac signs
// ============================================================================

export const ZODIAC_SIGNS: Record<string, ZodiacSignContent> = {
  aries: {
    symbol: '♈',
    name: 'Aries',
    archetype: 'The Pioneer',
    dates: 'March 21 - April 19',
    element: 'Fire',
    modality: 'Cardinal',
    season: 'Spring Beginning',
    ruler: 'Mars',
    rulerSymbol: '♂',
    naturalHouse: 1,
    keyword: 'I AM',
    bodyPart: 'Head, face',
    coreSignificance: {
      who: 'The newborn taking its first breath',
      what: 'Pure existence asserting "I AM"',
      when: 'Spring Equinox—day and night equal, new cycle begins',
      where: 'At the very START of the zodiac wheel',
      why: 'Because life MUST begin with raw assertion of existence',
      how: 'Through action, courage, and pure instinct',
      emotion: '"I EXIST! Watch me GO!"'
    },
    positiveTraits: [
      'Courageous and bold—fear doesn\'t stop them',
      'Natural leaders who take initiative',
      'Honest and direct—say what they mean',
      'High energy and enthusiasm for life',
      'Pioneering spirit—goes where others won\'t',
      'Quick to act and decisive under pressure',
      'Protective of those they love',
      'Competitive drive to WIN',
      'Independent and self-reliant',
      'Youthful energy throughout life'
    ],
    challenges: [
      'Impatient—can\'t wait for anything',
      'Impulsive—act before thinking',
      'Aggressive or combative when frustrated',
      'Selfish—"me first" mentality',
      'Can\'t finish what they start',
      'Short temper, quick to anger',
      'Reckless with consequences',
      'Dominating or bossy with others'
    ],
    lifeLesson: 'Courage without wisdom is recklessness. The challenge is to channel fierce energy into sustainable action, to finish what you start, and to consider others while asserting yourself.',
    careerStrengths: 'Entrepreneur, athlete, military, emergency services, surgeon, sales, startup founder, competitive sports',
    moonIn: 'Emotions are HOT, FAST, and INTENSE. Anger flares quickly but passes quickly. Need emotional independence. React instinctively without filtering.',
    ascendantIn: 'You LOOK energetic and ready for action. Walk fast, talk fast, move fast. Athletic, angular build. People see you as BOLD and direct.',
    venusIn: 'Love is CONQUEST and PURSUIT—the chase excites you. Attracted to confidence and challenge. Direct in romance. Need excitement and passion.',
    marsIn: '(HOME SIGN) Action is PURE, FAST, and UNFILTERED. Incredible physical energy. Natural athlete and competitor. "Ready, FIRE, aim" approach.'
  },
  taurus: {
    symbol: '♉',
    name: 'Taurus',
    archetype: 'The Builder',
    dates: 'April 20 - May 20',
    element: 'Earth',
    modality: 'Fixed',
    season: 'Mid-Spring',
    ruler: 'Venus',
    rulerSymbol: '♀',
    naturalHouse: 2,
    keyword: 'I HAVE',
    bodyPart: 'Throat, neck',
    coreSignificance: {
      who: 'The infant securing its basic needs',
      what: 'Stability, resources, and physical security',
      when: 'Mid-Spring—growth is ESTABLISHED, roots go deep',
      where: 'After Aries\' spark, Taurus BUILDS on it',
      why: 'Raw energy (Aries) must become STABLE FORM',
      how: 'Through patience, persistence, and sensory pleasure',
      emotion: '"I HAVE. I am secure. This is MINE."'
    },
    positiveTraits: [
      'Reliable and dependable always',
      'Patient and persistent—won\'t quit until finished',
      'Practical with money and resources',
      'Sensual—enjoys food, touch, comfort',
      'Loyal to people, places, and principles',
      'Grounded in physical reality',
      'Artistic appreciation for beauty',
      'Strong work ethic and endurance',
      'Calm and stable presence',
      'Values quality over quantity'
    ],
    challenges: [
      'Stubborn beyond reason',
      'Resistant to change even when necessary',
      'Materialistic—define self by possessions',
      'Possessive of people and things',
      'Lazy when comfortable',
      'Slow to start anything',
      'Holds grudges forever',
      'Risk-averse to stagnation'
    ],
    lifeLesson: 'Security is internal, not external. The challenge is to build without clinging, enjoy without addiction, and know when stability becomes stagnation.',
    careerStrengths: 'Finance, banking, agriculture, chef, artist, musician, real estate, interior design, craftsperson, massage therapist',
    moonIn: '(EXALTED) Emotions are STABLE, SLOW, and GROUNDED. Need physical comfort to feel safe. Food = emotional security. Slow to anger but NEVER forgets.',
    ascendantIn: 'You LOOK solid, grounded, and pleasant. Strong neck or beautiful features. Move deliberately—never rushed. Pleasant, melodious voice.',
    venusIn: '(HOME SIGN) Love is SENSUAL, STABLE, and LOYAL. Attracted to beauty, comfort, reliability. Express love through touch, gifts, cooking.',
    marsIn: 'Action is SLOW but UNSTOPPABLE once started. Incredible endurance. Patient persistence. "Slow and steady wins the race."'
  },
  gemini: {
    symbol: '♊',
    name: 'Gemini',
    archetype: 'The Messenger',
    dates: 'May 21 - June 20',
    element: 'Air',
    modality: 'Mutable',
    season: 'Late Spring',
    ruler: 'Mercury',
    rulerSymbol: '☿',
    naturalHouse: 3,
    keyword: 'I THINK',
    bodyPart: 'Hands, arms, lungs',
    coreSignificance: {
      who: 'The curious child asking endless "WHY?"',
      what: 'Information, communication, connection',
      when: 'End of Spring—pollinating ideas before summer',
      where: 'After stability (Taurus), comes CURIOSITY',
      why: 'Must LEARN and CONNECT before emotional summer',
      how: 'Through questions, conversation, and mental exploration',
      emotion: '"I THINK. Tell me EVERYTHING!"'
    },
    positiveTraits: [
      'Curious about EVERYTHING and everyone',
      'Quick-witted and intellectually agile',
      'Excellent communicator and speaker',
      'Adaptable to any situation',
      'Youthful energy and appearance',
      'Multi-talented and versatile',
      'Social butterfly—connects people',
      'Mental agility and quick learning',
      'Funny and entertaining',
      'Open-minded perspective'
    ],
    challenges: [
      'Scattered attention—can\'t focus',
      'Inconsistent and unreliable',
      'Superficial—knows little about much',
      'Gossips and talks too much',
      'Anxiety from overthinking',
      'Restless and easily bored',
      'Commitment-phobic',
      'Two-faced or duplicitous'
    ],
    lifeLesson: 'Information is not wisdom. Go DEEP instead of just WIDE, finish learning something before moving on. Quality over quantity.',
    careerStrengths: 'Writer, journalist, teacher, comedian, salesperson, translator, social media manager, researcher, podcaster',
    moonIn: 'Emotions are MENTAL and CHANGEABLE. Need to TALK about feelings. Intellectualize emotions. Mood changes with new information.',
    ascendantIn: 'You LOOK youthful, expressive, and animated. Talk with hands. Thin, wiry, quick movement. People see you as CURIOUS.',
    venusIn: 'Love is MENTAL CONNECTION. Attracted to intelligence and wit. Need variety and novelty. Express love through words and texts.',
    marsIn: 'Action is SCATTERED but VERSATILE. Mental energy more than physical. Multi-tasking champion. Strategic in conflict.'
  },
  cancer: {
    symbol: '♋',
    name: 'Cancer',
    archetype: 'The Nurturer',
    dates: 'June 21 - July 22',
    element: 'Water',
    modality: 'Cardinal',
    season: 'Summer Beginning',
    ruler: 'Moon',
    rulerSymbol: '☽',
    naturalHouse: 4,
    keyword: 'I FEEL',
    bodyPart: 'Chest, breasts, stomach',
    coreSignificance: {
      who: 'The child forming emotional bonds with family',
      what: 'Feelings, family, security, nurturing',
      when: 'Summer Solstice—longest day, maximum warmth',
      where: 'After mental Gemini, we enter EMOTIONAL territory',
      why: 'Must develop FEELINGS and BONDS before self-expression',
      how: 'Through empathy, protection, and creating home',
      emotion: '"I FEEL. This is FAMILY. I will protect you."'
    },
    positiveTraits: [
      'Deeply nurturing and caring',
      'Intuitive and empathetic',
      'Loyal to family and friends',
      'Protective of loved ones',
      'Excellent memory for emotional events',
      'Creates warm, welcoming spaces',
      'Compassionate listener',
      'Traditional values',
      'Sensitive to others\' needs',
      'Imaginative and creative'
    ],
    challenges: [
      'Moody with emotional ups and downs',
      'Clingy and possessive',
      'Takes everything personally',
      'Holds grudges forever',
      'Passive-aggressive when hurt',
      'Overly cautious and fearful',
      'Smothers with care',
      'Retreats into shell when wounded'
    ],
    lifeLesson: 'Protection can become prison. Nurture without smothering, feel without drowning. Emotional vulnerability is strength, not weakness.',
    careerStrengths: 'Chef, nurse, therapist, childcare, social worker, real estate agent, historian, hotel manager, hospice care',
    moonIn: '(HOME SIGN) Emotions are DEEP, PROTECTIVE, and INTENSE. Extremely intuitive. Moods tied to lunar cycles. Natural parent energy.',
    ascendantIn: 'You LOOK soft, approachable, nurturing. Round face, soft features. Shy at first meeting. People feel SAFE with you.',
    venusIn: 'Love is NURTURING, PROTECTIVE, TRADITIONAL. Attracted to emotional safety. Express love through care and cooking.',
    marsIn: 'Action is EMOTIONAL and INDIRECT. Fight to protect loved ones. Passive-aggressive when angry. Emotion-driven action.'
  },
  leo: {
    symbol: '♌',
    name: 'Leo',
    archetype: 'The Performer',
    dates: 'July 23 - August 22',
    element: 'Fire',
    modality: 'Fixed',
    season: 'Mid-Summer',
    ruler: 'Sun',
    rulerSymbol: '☉',
    naturalHouse: 5,
    keyword: 'I WILL',
    bodyPart: 'Heart, spine',
    coreSignificance: {
      who: 'The teenager declaring "Look at me! This is WHO I AM!"',
      what: 'Creative expression, identity, pride, performance',
      when: 'Mid-Summer—peak warmth, sun at its strongest',
      where: 'After emotional bonds (Cancer), comes SELF-EXPRESSION',
      why: 'Must EXPRESS identity before refining it',
      how: 'Through creativity, performance, and radiating self',
      emotion: '"I WILL. I shine. Watch me CREATE!"'
    },
    positiveTraits: [
      'Confident and self-assured',
      'Generous and warm-hearted',
      'Creative and artistic',
      'Natural performer',
      'Loyal and protective',
      'Charismatic and magnetic',
      'Courageous and brave',
      'Playful and fun-loving',
      'Natural leader',
      'Dignified and proud'
    ],
    challenges: [
      'Ego-driven and needs validation',
      'Dramatic and attention-seeking',
      'Arrogant when threatened',
      'Stubborn and inflexible',
      'Bossy and domineering',
      'Vain about appearance',
      'Can\'t handle criticism',
      'Wasteful and extravagant'
    ],
    lifeLesson: 'True royalty serves the kingdom. Shine without eclipsing others, lead through inspiration. The crown is heavy—wear it with responsibility.',
    careerStrengths: 'Actor, performer, artist, CEO, politician, teacher, fashion designer, event planner, creative director',
    moonIn: 'Emotions are DRAMATIC and need EXPRESSION. Need recognition for feelings. Pride in emotional generosity. Hurt when not noticed.',
    ascendantIn: 'You LOOK confident, regal, commanding. Strong features, dramatic presence. May have thick hair. People see you as CONFIDENT.',
    venusIn: 'Love is DRAMATIC, PASSIONATE, ROMANTIC. Attracted to confidence and creativity. Express love through grand gestures. Need adoration.',
    marsIn: 'Action is BOLD, DRAMATIC, CREATIVE. Fights with pride and dignity. Motivated by recognition. Playful, passionate energy.'
  },
  virgo: {
    symbol: '♍',
    name: 'Virgo',
    archetype: 'The Analyst',
    dates: 'August 23 - September 22',
    element: 'Earth',
    modality: 'Mutable',
    season: 'Late Summer',
    ruler: 'Mercury',
    rulerSymbol: '☿',
    naturalHouse: 6,
    keyword: 'I ANALYZE',
    bodyPart: 'Digestive system, intestines',
    coreSignificance: {
      who: 'The young adult asking "How can I be better?"',
      what: 'Analysis, refinement, perfection, service, health',
      when: 'Late Summer—preparing harvest, sorting crops',
      where: 'After creative expression (Leo), comes SELF-IMPROVEMENT',
      why: 'Must refine what was created before autumn\'s relationships',
      how: 'Through analysis, organization, and helpful service',
      emotion: '"I ANALYZE. Let me help. Let me perfect this."'
    },
    positiveTraits: [
      'Analytical and detail-oriented',
      'Helpful and service-oriented',
      'Organized and efficient',
      'Practical and grounded',
      'Modest and humble',
      'Health-conscious',
      'Hardworking and diligent',
      'Precise and accurate',
      'Problem-solving skills',
      'Discriminating taste'
    ],
    challenges: [
      'Critical of self and others',
      'Perfectionist to paralysis',
      'Anxious and worry-prone',
      'Nitpicky about details',
      'Can\'t see big picture',
      'Hypochondriac tendencies',
      'Harsh on self',
      'Controlling about "right way"'
    ],
    lifeLesson: 'Perfection is the enemy of good. Serve without martyrdom, analyze without criticizing. Excellence, not perfection, is the goal.',
    careerStrengths: 'Editor, analyst, healthcare worker, nutritionist, accountant, quality control, researcher, veterinarian',
    moonIn: 'Emotions need ORDER and ANALYSIS. Feel better when helpful. Anxious when chaotic. Process feelings through practical action.',
    ascendantIn: 'You LOOK neat, clean, put-together. Delicate features, youthful. Modest presentation. People see you as COMPETENT.',
    venusIn: 'Love is SERVICE and PRACTICAL CARE. Attracted to intelligence and cleanliness. Express love through acts of service.',
    marsIn: 'Action is PRECISE, METHODICAL, EFFICIENT. Motivated by improving things. Strategic in conflict. Service-oriented energy.'
  },
  libra: {
    symbol: '♎',
    name: 'Libra',
    archetype: 'The Diplomat',
    dates: 'September 23 - October 22',
    element: 'Air',
    modality: 'Cardinal',
    season: 'Autumn Beginning',
    ruler: 'Venus',
    rulerSymbol: '♀',
    naturalHouse: 7,
    keyword: 'WE ARE',
    bodyPart: 'Kidneys, lower back',
    coreSignificance: {
      who: 'The adult saying "We are partners. Let\'s create harmony."',
      what: 'Balance, partnership, harmony, beauty, justice',
      when: 'Autumn Equinox—day and night perfectly balanced',
      where: 'After self-perfection (Virgo), comes PARTNERSHIP',
      why: 'Must learn to share self with another',
      how: 'Through diplomacy, compromise, and aesthetic harmony',
      emotion: '"WE ARE. Let\'s find balance together."'
    },
    positiveTraits: [
      'Diplomatic and fair-minded',
      'Charming and socially graceful',
      'Romantic and relationship-oriented',
      'Aesthetic sense—loves beauty',
      'Cooperative and team-oriented',
      'Intellectual and objective',
      'Peaceful and harmony-seeking',
      'Good listener and mediator',
      'Refined taste',
      'Natural sense of justice'
    ],
    challenges: [
      'Indecisive—seeing all sides',
      'People-pleasing to avoid conflict',
      'Avoids confrontation at all costs',
      'Superficial—focused on appearances',
      'Codependent in relationships',
      'Passive-aggressive when upset',
      'Manipulates to maintain peace',
      'Can\'t be alone'
    ],
    lifeLesson: 'Peace without authenticity is avoidance. Maintain harmony without losing self. Some conflicts MUST happen for true balance.',
    careerStrengths: 'Lawyer, mediator, diplomat, designer, artist, counselor, HR specialist, wedding planner, stylist',
    moonIn: 'Emotions need BALANCE and HARMONY. Upset when environment is conflicted. Process feelings through talking. Need partnership.',
    ascendantIn: 'You LOOK attractive, charming, put-together. Symmetrical features, graceful movement. People see you as DIPLOMATIC.',
    venusIn: '(HOME SIGN) Love is PARTNERSHIP, BALANCE, ROMANCE. Attracted to beauty, charm, fairness. Need equality and harmony.',
    marsIn: 'Action is DIPLOMATIC and STRATEGIC (not direct). Fights for fairness. Motivated by partnership. Romantic energy.'
  },
  scorpio: {
    symbol: '♏',
    name: 'Scorpio',
    archetype: 'The Alchemist',
    dates: 'October 23 - November 21',
    element: 'Water',
    modality: 'Fixed',
    season: 'Mid-Autumn',
    ruler: 'Pluto',
    rulerSymbol: '♇',
    naturalHouse: 8,
    keyword: 'WE DESIRE',
    bodyPart: 'Genitals, reproductive organs',
    coreSignificance: {
      who: 'The mature adult saying "We merge deeply. Let\'s transform."',
      what: 'Transformation, depth, power, intimacy, death/rebirth',
      when: 'Mid-Autumn—decay feeding new life, composting',
      where: 'After balanced partnership (Libra), comes DEEP MERGING',
      why: 'Must face shadow and death before philosophical wisdom',
      how: 'Through intensity, intimacy, and emotional/sexual power',
      emotion: '"WE DESIRE. We transform. We die and are reborn."'
    },
    positiveTraits: [
      'Intense and passionate',
      'Resourceful and determined',
      'Loyal and deeply committed',
      'Investigative mind—uncovers truth',
      'Powerful presence and magnetism',
      'Emotionally deep and aware',
      'Transformative ability',
      'Sexually powerful and magnetic',
      'Keeps secrets well',
      'Courageous in facing darkness'
    ],
    challenges: [
      'Jealous and possessive',
      'Secretive and manipulative',
      'Vengeful—never forgets betrayal',
      'Obsessive and controlling',
      'Mistrustful and suspicious',
      'Power-hungry and dominating',
      'Self-destructive tendencies',
      'Too intense for some'
    ],
    lifeLesson: 'Control is the opposite of trust. Merge without consuming, transform without destroying. True power is surrender, not domination.',
    careerStrengths: 'Psychologist, detective, surgeon, researcher, sex therapist, mortician, investigator, crisis counselor',
    moonIn: 'Emotions are INTENSE, DEEP, ALL-CONSUMING. Feel everything powerfully. Need emotional intimacy. Never forget wounds.',
    ascendantIn: 'You LOOK intense, mysterious, penetrating. Powerful gaze. Magnetic sexual presence. People feel your DEPTH.',
    venusIn: 'Love is INTENSE, TRANSFORMATIVE, ALL OR NOTHING. Attracted to power and mystery. Complete emotional/sexual merging.',
    marsIn: 'Action is STRATEGIC, POWERFUL, RELENTLESS. Never gives up. Psychological warfare. "I will win no matter what."'
  },
  sagittarius: {
    symbol: '♐',
    name: 'Sagittarius',
    archetype: 'The Philosopher',
    dates: 'November 22 - December 21',
    element: 'Fire',
    modality: 'Mutable',
    season: 'Late Autumn',
    ruler: 'Jupiter',
    rulerSymbol: '♃',
    naturalHouse: 9,
    keyword: 'WE UNDERSTAND',
    bodyPart: 'Hips, thighs',
    coreSignificance: {
      who: 'The seeker asking "What does it all mean?"',
      what: 'Philosophy, wisdom, exploration, teaching, belief',
      when: 'Late Autumn—preparing for winter through wisdom',
      where: 'After transformation (Scorpio), comes EXPANSION',
      why: 'Must find meaning in experience before building legacy',
      how: 'Through adventure, learning, teaching, and seeking truth',
      emotion: '"WE UNDERSTAND. Let\'s explore and find truth!"'
    },
    positiveTraits: [
      'Optimistic and enthusiastic',
      'Adventurous and freedom-loving',
      'Honest and direct',
      'Philosophical and wisdom-seeking',
      'Fun-loving and playful',
      'Generous and open-hearted',
      'Natural teacher and storyteller',
      'Independent',
      'International perspective',
      'Spiritual interests'
    ],
    challenges: [
      'Blunt to the point of hurtful',
      'Commitment-phobic',
      'Reckless and irresponsible',
      'Preachy and know-it-all',
      'Tactless and insensitive',
      'Overconfident and cocky',
      'Wasteful with resources',
      'Restless—can\'t settle down'
    ],
    lifeLesson: 'Wisdom without compassion is just opinion. Explore without escaping, teach without preaching. Freedom is mental and spiritual, not just physical.',
    careerStrengths: 'Teacher, professor, travel guide, philosopher, publisher, international relations, outdoor educator, religious leader',
    moonIn: 'Emotions are OPTIMISTIC and FREEDOM-SEEKING. Need adventure to feel alive. Process feelings through philosophy. Honest about feelings.',
    ascendantIn: 'You LOOK adventurous, jovial, free-spirited. May be tall or athletic. Open, friendly energy. People see you as FUN.',
    venusIn: 'Love is ADVENTURE and FREEDOM. Attracted to foreigners and teachers. Express love through shared adventures. Need independence.',
    marsIn: 'Action is ADVENTUROUS and OPTIMISTIC. Fights for freedom and truth. Motivated by exploration. Playful, experimental energy.'
  },
  capricorn: {
    symbol: '♑',
    name: 'Capricorn',
    archetype: 'The Master',
    dates: 'December 22 - January 19',
    element: 'Earth',
    modality: 'Cardinal',
    season: 'Winter Beginning',
    ruler: 'Saturn',
    rulerSymbol: '♄',
    naturalHouse: 10,
    keyword: 'I USE',
    bodyPart: 'Knees, bones, skin',
    coreSignificance: {
      who: 'The elder asking "What will I leave behind?"',
      what: 'Achievement, structure, mastery, legacy, authority',
      when: 'Winter Solstice—longest night, building through darkness',
      where: 'After philosophical exploration (Sagittarius), comes MASTERY',
      why: 'Must build lasting structures before innovating them',
      how: 'Through discipline, patience, and strategic climbing',
      emotion: '"I USE. I achieve. I build what lasts."'
    },
    positiveTraits: [
      'Ambitious and achievement-oriented',
      'Disciplined and self-controlled',
      'Responsible and reliable',
      'Patient—plays long game',
      'Strategic and practical',
      'Respects tradition and authority',
      'Hardworking and persistent',
      'Mature beyond years',
      'Builds lasting legacy',
      'Earns respect through achievement'
    ],
    challenges: [
      'Pessimistic and negative',
      'Workaholic neglecting relationships',
      'Status-obsessed and materialistic',
      'Cold and emotionally distant',
      'Overly serious—can\'t relax',
      'Controlling and authoritarian',
      'Fear of failure',
      'Ruthless in pursuit of goals'
    ],
    lifeLesson: 'Success without humanity is empty. Achieve without sacrificing relationship, build legacy without losing soul. The top is lonely—bring people with you.',
    careerStrengths: 'CEO, manager, architect, engineer, government official, banker, real estate developer, contractor',
    moonIn: 'Emotions are CONTROLLED and PRACTICAL. Feel safe when achieving. Difficulty expressing vulnerability. Need respect.',
    ascendantIn: 'You LOOK serious, professional, authoritative. Lean build or mature features. People see you as COMPETENT and in control.',
    venusIn: 'Love is TRADITIONAL, LOYAL, COMMITTED. Attracted to ambition and maturity. Express love through providing.',
    marsIn: '(EXALTED) Action is STRATEGIC, DISCIPLINED, EFFECTIVE. Incredible endurance. Motivated by achievement. "Slow, strategic climb."'
  },
  aquarius: {
    symbol: '♒',
    name: 'Aquarius',
    archetype: 'The Visionary',
    dates: 'January 20 - February 18',
    element: 'Air',
    modality: 'Fixed',
    season: 'Mid-Winter',
    ruler: 'Uranus',
    rulerSymbol: '♅',
    naturalHouse: 11,
    keyword: 'I KNOW',
    bodyPart: 'Ankles, circulation',
    coreSignificance: {
      who: 'The sage asking "How can we evolve?"',
      what: 'Innovation, revolution, community, vision, humanitarianism',
      when: 'Mid-Winter—sustaining through innovation and vision of spring',
      where: 'After building legacy (Capricorn), comes REVOLUTIONIZING',
      why: 'Must innovate existing structures before spiritual transcendence',
      how: 'Through originality, community, and revolutionary ideas',
      emotion: '"I KNOW. We can create a better future together."'
    },
    positiveTraits: [
      'Independent and original thinker',
      'Humanitarian and socially conscious',
      'Innovative and forward-thinking',
      'Intellectual and objective',
      'Friendly and community-oriented',
      'Unconventional and unique',
      'Visionary about future',
      'Egalitarian—sees all as equal',
      'Scientific and logical',
      'Freedom-loving'
    ],
    challenges: [
      'Emotionally detached and aloof',
      'Rebellious without cause',
      'Unpredictable and erratic',
      'Stubborn in opinions',
      'Superiority complex',
      'Can\'t commit',
      'Cold with loved ones',
      'Eccentric to alienation'
    ],
    lifeLesson: 'Innovation without heart is cold logic. Revolutionize while including everyone, be unique without being alienated. Progress serves humanity, not ego.',
    careerStrengths: 'Technology, science, social activism, humanitarian work, innovation, community organizing, astrology, invention',
    moonIn: 'Emotions are DETACHED and RATIONAL. Need independence emotionally. Process feelings through logic. Uncomfortable with intensity.',
    ascendantIn: 'You LOOK unique, eccentric, unconventional. Unusual style. Friendly but detached. People see you as DIFFERENT.',
    venusIn: 'Love is FRIENDSHIP and INTELLECTUAL CONNECTION. Attracted to uniqueness and intelligence. Need freedom and space.',
    marsIn: 'Action is UNCONVENTIONAL and STRATEGIC. Fights for causes and humanity. Motivated by innovation. Experimental energy.'
  },
  pisces: {
    symbol: '♓',
    name: 'Pisces',
    archetype: 'The Mystic',
    dates: 'February 19 - March 20',
    element: 'Water',
    modality: 'Mutable',
    season: 'Late Winter',
    ruler: 'Neptune',
    rulerSymbol: '♆',
    naturalHouse: 12,
    keyword: 'I BELIEVE',
    bodyPart: 'Feet',
    coreSignificance: {
      who: 'The mystic saying "All is one. We return to source."',
      what: 'Spirituality, compassion, dreams, transcendence, dissolution',
      when: 'Late Winter—ice melting, preparing for Aries rebirth',
      where: 'After innovation (Aquarius), comes SPIRITUAL TRANSCENDENCE',
      why: 'Must dissolve all boundaries before new cycle begins',
      how: 'Through empathy, imagination, spirituality, and surrender',
      emotion: '"I BELIEVE. We are all connected. All is one."'
    },
    positiveTraits: [
      'Compassionate and empathetic',
      'Artistic and imaginative',
      'Intuitive and psychic',
      'Spiritual and transcendent',
      'Selfless and sacrificing',
      'Adaptable and flowing',
      'Romantic and idealistic',
      'Healing presence',
      'Wise beyond understanding',
      'Universal love for all'
    ],
    challenges: [
      'Escapist—avoids reality',
      'Victim mentality and martyrdom',
      'Boundary-less—merges with everyone',
      'Easily manipulated and deceived',
      'Can\'t handle harsh reality',
      'Vague about practical matters',
      'Self-destructive tendencies',
      'Passive and directionless'
    ],
    lifeLesson: 'Compassion includes self-compassion. Serve without sacrificing, dissolve without disappearing, be spiritual while staying grounded. You can\'t pour from an empty cup.',
    careerStrengths: 'Artist, musician, healer, therapist, spiritual teacher, nurse, photographer, filmmaker, charity worker',
    moonIn: 'Emotions are OCEANIC and BOUNDARYLESS. Feel everyone\'s pain and joy. Need solitude. Escape through dreams. Psychic sensitivity.',
    ascendantIn: 'You LOOK dreamy, soft, otherworldly. Ethereal appearance. Large, soulful eyes. People see you as COMPASSIONATE.',
    venusIn: '(EXALTED) Love is UNCONDITIONAL, ROMANTIC, SPIRITUAL. Attracted to souls, not bodies. Express love through sacrifice.',
    marsIn: 'Action is INTUITIVE and INDIRECT. Fights for the underdog. Motivated by compassion. "Flow like water around obstacles."'
  }
};

// ============================================================================
// SIGN-SPECIFIC ZONE DETAILS (Tab 0.5 Enhancement)
// Detailed zone modifiers for each sign's 6 zones
// ============================================================================

export const SIGN_ZONE_DETAILS: Record<string, SignZoneData> = {
  libra: {
    sign: 'Libra',
    symbol: '♎',
    essence: 'Balance, partnership, harmony, beauty, justice, cooperation',
    element: 'Air',
    modality: 'Cardinal',
    season: 'Autumn Beginning',
    zones: [
      {
        zone: 1,
        degrees: '0°-5°',
        name: 'The Desperate People-Pleaser',
        coreQuality: 'RAW NEED FOR HARMONY',
        characteristics: [
          'Frantically diplomatic — can\'t tolerate even minor conflict',
          'Obsessively people-pleasing — loses self in others\' needs',
          'Indecisive to paralysis — seeing all sides prevents any choice',
          'Codependently attached — needs partner to feel complete',
          'Peacekeeping at all costs — even self-destruction to avoid discord'
        ],
        sunModifier: '"Everyone must LIKE me!" — More approval-seeking, identity depends on others\' acceptance',
        moonModifier: 'Emotions depend entirely on others\' approval. Feel good only when everyone is happy',
        ascendantModifier: 'You LOOK eager to please. Smiling constantly, agreeable body language',
        example: 'Jennifer has Moon at 3° Libra. She can\'t watch movies with any conflict, changes her order if the server seems annoyed. Learning that real harmony requires honest boundaries.'
      },
      {
        zone: 2,
        degrees: '5°-10°',
        name: 'The Developing Mediator',
        coreQuality: 'BUILDING AUTHENTIC BALANCE',
        characteristics: [
          'Diplomatically authentic — kindness becoming real, not performed',
          'Decisively improving — can choose sometimes',
          'Cooperatively balanced — partnership without complete loss of self',
          'Aesthetically sincere — beauty for its own sake',
          'Peacekeeping with boundaries — harmony with self-respect emerging'
        ],
        sunModifier: '"I\'m learning REAL diplomacy!" — Less extreme, growing capacity for self-prioritization',
        moonModifier: 'Emotions are CALMER and more balanced. Beginning to feel okay even when others are upset',
        ascendantModifier: 'You look GRACEFUL and DEVELOPING. Natural beauty without desperate performance',
        example: 'Marcus has Venus at 8° Libra. He used to morph into whatever partners wanted. Now learning to say "I like what I like" while still valuing harmony.'
      },
      {
        zone: 3,
        degrees: '10°-15°',
        name: 'Natural Diplomat Emerging',
        coreQuality: 'AUTHENTIC GRACE',
        characteristics: [
          'Naturally diplomatic — harmony without fakeness',
          'Wisely decisive — knows when compromise serves',
          'Genuinely cooperative — partnership is strength',
          'Balanced independence — comfortable alone or partnered',
          'Charmingly authentic — grace is who you are, not what you do'
        ],
        sunModifier: '"Diplomacy is just WHO I AM naturally" — Peak Libra energy beginning',
        moonModifier: 'Emotions are BALANCED and CLEAR. Can hold space for others without losing self',
        ascendantModifier: 'You ARE natural grace. First impression: "Effortlessly charming"',
        example: 'Ambassador Chen has Sun at 13° Libra. In tense negotiations, she naturally finds the middle path. She IS diplomacy.'
      },
      {
        zone: 4,
        degrees: '15°-20°',
        name: 'The Peak Diplomat',
        coreQuality: 'MAXIMUM LIBRA POWER',
        characteristics: [
          'PEAK diplomacy — perfect balance in all interactions',
          'Perfect partnership — equality without codependence',
          'Ultimate aesthetics — beauty at highest expression',
          'Fair judgment — can see all sides and make right choice',
          'Charm as superpower — genuine magnetism at peak'
        ],
        sunModifier: '"I AM the DEFINITION of balance and partnership" — Maximum Libra expression',
        moonModifier: 'Emotions are PERFECTLY BALANCED. Perfect equilibrium of giving and receiving',
        ascendantModifier: 'You ARE the partnership archetype. First impression: "GRACE incarnate"',
        example: 'Olivia has Venus at 17° Libra. Her 30-year marriage is "relationship goals" — equal, balanced, mutually enhancing. She embodies partnership.'
      },
      {
        zone: 5,
        degrees: '20°-25°',
        name: 'The Wise Partner',
        coreQuality: 'MASTERED BALANCE, SENSING DEPTH',
        characteristics: [
          'Mastered diplomacy — knows when conflict actually serves',
          'Teaching partnership — shows others how to build balance',
          'Sensing Scorpio pull — wanting deeper intimacy',
          'Questioning surface harmony — ready for shadow work',
          'Gracefully intense — charm meeting power'
        ],
        sunModifier: '"I\'ve mastered balance — now what about DEPTH?" — Feeling Scorpio pull',
        moonModifier: 'Emotions are WISE and DEEPENING. Beginning to want intensity, not just equilibrium',
        ascendantModifier: 'You look GRACEFUL and PROFOUND. Charming AND deep',
        example: 'Dr. Williams (couples therapist) has Moon at 23° Libra. Bridge between Libra\'s balance and Scorpio\'s depth.'
      },
      {
        zone: 6,
        degrees: '25°-30°',
        name: 'The Bridge Builder',
        coreQuality: 'HARMONY BECOMES DEPTH',
        characteristics: [
          'Partnership with intensity — surface meeting shadow work',
          'Beauty with power — aesthetics meeting psychology',
          'Diplomacy with passion — balance meeting fierce truth',
          'Air meeting Water — thoughts diving into emotional depths',
          'Peacekeeping through truth — harmony requires honesty'
        ],
        sunModifier: '"I\'m a diplomat who goes DEEP" — Strong Scorpio influence, bridge between Air and Water',
        moonModifier: 'Emotions are BALANCED but INTENSIFYING. Need harmony AND transformation',
        ascendantModifier: 'You look GRACEFUL and POWERFUL. Charming AND intense',
        example: 'Elena has Venus at 28° Libra. Creates beautiful relationships but demands complete honesty and shadow work. Bridge between pleasant partnership and soul-level intimacy.'
      }
    ]
  },
  scorpio: {
    sign: 'Scorpio',
    symbol: '♏',
    essence: 'Transformation, intensity, power, depth, intimacy, psychology, death/rebirth',
    element: 'Water',
    modality: 'Fixed',
    season: 'Mid-Autumn',
    zones: [
      {
        zone: 1,
        degrees: '0°-5°',
        name: 'The Raw Intensity',
        coreQuality: 'UNCONTROLLED TRANSFORMATIVE POWER',
        characteristics: [
          'Overwhelmingly intense — emotions at maximum volume, scares people',
          'Obsessively suspicious — trusts absolutely no one',
          'Jealously possessive — everyone is a threat',
          'Vengefully reactive — must destroy anyone who betrays',
          'Self-destructively intense — burns everything including self'
        ],
        sunModifier: '"I must CONTROL everything or I\'ll be destroyed!" — Learning power through trial by fire',
        moonModifier: 'Emotions are OVERWHELMING TIDAL WAVES. Everything is life or death',
        ascendantModifier: 'You LOOK dangerous and intimidating. Piercing eye contact that unnerves',
        example: 'Michael has Moon at 3° Scorpio. Can\'t have casual friendships — either you\'re in his inner circle completely or a stranger. Learning that trust doesn\'t mean total control.'
      },
      {
        zone: 2,
        degrees: '5°-10°',
        name: 'The Developing Alchemist',
        coreQuality: 'LEARNING TO CHANNEL POWER',
        characteristics: [
          'Intensely authentic — depth becoming real transformation',
          'Strategically patient — learning to wait for right moment',
          'Loyally committed — when trust develops, it\'s absolute',
          'Psychologically curious — exploring shadow consciously',
          'Deeply connecting — learning that vulnerability isn\'t weakness'
        ],
        sunModifier: '"I\'m learning to transform, not just destroy!" — Growing capacity for real intimacy',
        moonModifier: 'Emotions are DEEP but more CHANNELED. Learning to direct the force',
        ascendantModifier: 'You look MAGNETIC and DEVELOPING. Intense but intriguing',
        example: 'Sarah has Mars at 8° Scorpio. Learned strategic patience instead of scorched earth tactics. Now waits, plans, and strikes only when it matters.'
      },
      {
        zone: 3,
        degrees: '10°-15°',
        name: 'Natural Transformer Emerging',
        coreQuality: 'AUTHENTIC DEPTH',
        characteristics: [
          'Naturally intense — power is effortless, not performed',
          'Wisely transformative — knows when death/rebirth serves',
          'Psychologically penetrating — sees all shadow without judgment',
          'Sexually powerful — intimacy is soul-merging, not conquest',
          'Deeply authentic — vulnerability as strength'
        ],
        sunModifier: '"Depth and transformation are WHO I AM naturally" — Peak Scorpio beginning',
        moonModifier: 'Emotions are DEEP and MASTERED. Can hold space for darkest feelings',
        ascendantModifier: 'You ARE magnetic power. First impression: "This person sees EVERYTHING"',
        example: 'Dr. Raven has Pluto at 13° Scorpio. Guides people through trauma without flinching. Embodies peak Scorpio — transformation in service of healing.'
      },
      {
        zone: 4,
        degrees: '15°-20°',
        name: 'The Peak Phoenix',
        coreQuality: 'MAXIMUM SCORPIO POWER',
        characteristics: [
          'PEAK intensity — maximum transformative power at perfection',
          'Perfect psychology — complete shadow mastery',
          'Phoenix mastery — death/rebirth is natural cycle, not trauma',
          'Sexual alchemy — intimacy as spiritual transformation',
          'Transformational genius — sees how to evolve everyone'
        ],
        sunModifier: '"I AM the DEFINITION of depth and transformation" — Textbook perfect phoenix energy',
        moonModifier: 'Emotions are PERFECTLY POWERFUL. Emotional mastery through depth',
        ascendantModifier: 'You ARE the transformation archetype. POWER AND DEPTH incarnate',
        example: 'Carl Jung (archetypal example) — explored humanity\'s shadow without fear, transformed psychology forever. Peak Scorpio expression.'
      },
      {
        zone: 5,
        degrees: '20°-25°',
        name: 'The Wise Alchemist',
        coreQuality: 'MASTERED TRANSFORMATION, SENSING EXPANSION',
        characteristics: [
          'Mastered intensity — knows when to release control',
          'Teaching transformation — guiding others through shadow',
          'Sensing Sagittarius pull — wanting meaning beyond depth',
          'Psychology with philosophy — depth meeting wisdom',
          'Deeply wise — intensity becoming teaching'
        ],
        sunModifier: '"I\'ve mastered depth — now what about MEANING?" — Feeling Sagittarius pull',
        moonModifier: 'Emotions are WISE and EXPANDING. Beginning to want freedom, not just intensity',
        ascendantModifier: 'You look POWERFUL and WISE. Intense AND expansive',
        example: 'Professor Darkwater has Sun at 23° Scorpio. Teaching about finding MEANING in suffering. Bridge between Scorpio depth and Sagittarius teaching.'
      },
      {
        zone: 6,
        degrees: '25°-30°',
        name: 'The Bridge Builder',
        coreQuality: 'DEPTH BECOMES WISDOM',
        characteristics: [
          'Intensity with freedom — depth without possession',
          'Transformation with exploration — death leading to adventure',
          'Psychology with philosophy — shadow meeting meaning',
          'Water meeting Fire — emotional depth igniting wisdom',
          'Transformatively optimistic — evolution with hope'
        ],
        sunModifier: '"I\'m a transformer who TEACHES" — Depth + Wisdom blending',
        moonModifier: 'Emotions are DEEP but EXPANDING. Need depth AND freedom',
        ascendantModifier: 'You look INTENSE and ADVENTUROUS. Powerful AND optimistic',
        example: 'Dr. Phoenix has Pluto at 28° Scorpio. Survived addiction, transformed, now teaches about turning darkness into purpose. Bridge between shadow work and life purpose.'
      }
    ]
  },
  sagittarius: {
    sign: 'Sagittarius',
    symbol: '♐',
    essence: 'Philosophy, exploration, wisdom, adventure, teaching, freedom, meaning, expansion',
    element: 'Fire',
    modality: 'Mutable',
    season: 'Late Autumn',
    zones: [
      {
        zone: 1,
        degrees: '0°-5°',
        name: 'The Reckless Explorer',
        coreQuality: 'UNFILTERED TRUTH-SEEKING',
        characteristics: [
          'Brutally blunt — no filter whatsoever, truth without compassion',
          'Recklessly adventurous — no consideration of consequences',
          'Commitment-phobic desperately — running from anything binding',
          'Philosophically preachy — knowing it all already',
          'Restlessly escaping — can\'t sit still anywhere'
        ],
        sunModifier: '"I must be FREE and know EVERYTHING!" — Learning wisdom through painful mistakes',
        moonModifier: 'Emotions are RESTLESS and UNFILTERED. Feel trapped by emotional intimacy',
        ascendantModifier: 'You LOOK like you\'re about to leave. Fun but unreliable first impression',
        example: 'Jake has Moon at 3° Sagittarius. Traveled 47 countries, dated in 12. Learning that freedom doesn\'t require constant escape.'
      },
      {
        zone: 2,
        degrees: '5°-10°',
        name: 'The Eager Student',
        coreQuality: 'DEVELOPING WISDOM',
        characteristics: [
          'Honestly diplomatic — truth with kindness emerging',
          'Adventurously thoughtful — exploring with awareness',
          'Independently connected — freedom with commitment developing',
          'Philosophically humble — learning, not just preaching',
          'Optimistically realistic — hope grounded in experience'
        ],
        sunModifier: '"I\'m learning REAL wisdom!" — Growing capacity for teaching from experience',
        moonModifier: 'Emotions are EXPANDING but more GROUNDED. Can handle intimacy',
        ascendantModifier: 'You look ADVENTUROUS and THOUGHTFUL. Fun AND wise',
        example: 'Nina has Jupiter at 8° Sagittarius. Moving from collecting experiences to extracting wisdom — spending 6 months learning Thailand deeply.'
      },
      {
        zone: 3,
        degrees: '10°-15°',
        name: 'Natural Philosopher Emerging',
        coreQuality: 'AUTHENTIC WISDOM',
        characteristics: [
          'Naturally philosophical — wisdom flows from experience',
          'Authentically adventurous — exploration is genuine, not escape',
          'Honestly kind — truth with compassion naturally balanced',
          'Independently free — commitment to freedom itself',
          'Teaching naturally — sharing wisdom without preaching'
        ],
        sunModifier: '"Philosophy and adventure are WHO I AM naturally" — Peak Sagittarius beginning',
        moonModifier: 'Emotions are FREE and WISE. Can commit deeply without feeling trapped',
        ascendantModifier: 'You ARE natural wisdom. Genuinely wise and free',
        example: 'Professor Wanderer has Sun at 13° Sagittarius. Travels, speaks 5 languages, teaches comparative religion from lived experience.'
      },
      {
        zone: 4,
        degrees: '15°-20°',
        name: 'The Peak Seeker',
        coreQuality: 'MAXIMUM SAGITTARIUS POWER',
        characteristics: [
          'PEAK philosophy — ultimate wisdom earned through experience',
          'Perfect adventure — exploration at its finest',
          'Honest wisdom — truth with love perfectly balanced',
          'Freedom mastery — independence with connection in harmony',
          'Teaching excellence — shares wisdom that transforms'
        ],
        sunModifier: '"I AM the DEFINITION of wisdom and freedom" — Textbook perfect philosopher-explorer',
        moonModifier: 'Emotions are PERFECTLY FREE. Perfect balance of freedom and intimacy',
        ascendantModifier: 'You ARE the seeker archetype. WISDOM and ADVENTURE incarnate',
        example: 'Dr. Horizon has Jupiter at 17° Sagittarius. TED talk with 20M views. Lives with indigenous tribes, distills into applicable wisdom. Peak Sagittarius.'
      },
      {
        zone: 5,
        degrees: '20°-25°',
        name: 'The Wise Teacher',
        coreQuality: 'MASTERED WISDOM, SENSING STRUCTURE',
        characteristics: [
          'Mastered philosophy — knows limitations of pure freedom',
          'Teaching exploration — guiding others to find meaning',
          'Sensing Capricorn pull — wanting to BUILD on wisdom',
          'Philosophy with structure — meaning meeting mastery',
          'Freely disciplined — adventure meeting commitment'
        ],
        sunModifier: '"I\'ve mastered wisdom — now how do I BUILD legacy?" — Feeling Capricorn pull',
        moonModifier: 'Emotions are WISE and GROUNDING. Beginning to want structure',
        ascendantModifier: 'You look WISE and BUILDING. Free AND accomplished',
        example: 'Captain Explorer has Sun at 23° Sagittarius. After 40 years adventure travel, founded a school. "Freedom is beautiful, but LEGACY matters too."'
      },
      {
        zone: 6,
        degrees: '25°-30°',
        name: 'The Bridge Builder',
        coreQuality: 'WISDOM BECOMES MASTERY',
        characteristics: [
          'Freedom with discipline — adventure meeting structure',
          'Philosophy with achievement — meaning meeting legacy',
          'Expansion with limitation — growth through boundaries',
          'Fire meeting Earth — enthusiasm grounding into form',
          'Freely committed — independence through dedication'
        ],
        sunModifier: '"I\'m a philosopher who BUILDS" — Wisdom + Mastery blending',
        moonModifier: 'Emotions are FREE but GROUNDING. Need adventure AND achievement',
        ascendantModifier: 'You look WISE and ACCOMPLISHED. Adventurous AND authoritative',
        example: 'Dean Pathfinder has Jupiter at 28° Sagittarius. Founded university program combining adventure education with serious scholarship. Bridge between exploration and legacy.'
      }
    ]
  },
  capricorn: {
    sign: 'Capricorn',
    symbol: '♑',
    essence: 'Achievement, structure, mastery, legacy, authority, career, responsibility, time',
    element: 'Earth',
    modality: 'Cardinal',
    season: 'Winter Beginning',
    zones: [
      {
        zone: 1,
        degrees: '0°-5°',
        name: 'The Ruthless Climber',
        coreQuality: 'DESPERATE ACHIEVEMENT-SEEKING',
        characteristics: [
          'Obsessively ambitious — nothing matters except climbing higher',
          'Ruthlessly competitive — stepping on others without remorse',
          'Workaholic to destruction — no life beyond achievement',
          'Status-obsessed desperately — defining worth by position',
          'Emotionally cold — can\'t show vulnerability or warmth'
        ],
        sunModifier: '"I must ACHIEVE to prove I matter!" — Identity built entirely on status and success',
        moonModifier: 'Emotions are FROZEN or CONTROLLED. Feel safe only through achievement',
        ascendantModifier: 'You LOOK cold and ambitious. First impression: intimidating and driven',
        example: 'David has Saturn at 2° Capricorn. Built a successful company with 80-hour weeks, missed his kids\' childhoods. Rich and miserable — learning achievement without connection is empty.'
      },
      {
        zone: 2,
        degrees: '5°-10°',
        name: 'The Disciplined Builder',
        coreQuality: 'DEVELOPING MASTERY',
        characteristics: [
          'Ambitiously balanced — achieving without complete ruthlessness',
          'Strategically patient — building with some wisdom',
          'Professionally skilled — developing real expertise',
          'Status-aware — caring about position but not obsessed',
          'Emotionally warming — beginning to show feelings'
        ],
        sunModifier: '"I\'m learning REAL mastery, not just climbing!" — Growing capacity for sustainable achievement',
        moonModifier: 'Emotions are CONTROLLED but THAWING. Beginning to feel safe showing feelings',
        ascendantModifier: 'You look PROFESSIONAL and APPROACHABLE. Accomplished but human',
        example: 'Lisa has Moon at 8° Capricorn. Now a CEO who tells her team: "I made mistakes this quarter, here\'s what I learned." Achieves greatly but also shows up for her kids\' games.'
      },
      {
        zone: 3,
        degrees: '10°-15°',
        name: 'Natural Master Emerging',
        coreQuality: 'AUTHENTIC AUTHORITY',
        characteristics: [
          'Naturally authoritative — leadership is effortless',
          'Wisely ambitious — achievement with integrity',
          'Masterfully skilled — expertise is unconscious competence',
          'Status-earned — position through merit, not manipulation',
          'Emotionally mature — feelings integrated with professionalism'
        ],
        sunModifier: '"Mastery and leadership are WHO I AM naturally" — Natural CEO and authority',
        moonModifier: 'Emotions are MATURE and INTEGRATED. Emotional authority is natural',
        ascendantModifier: 'You ARE natural authority. First impression: accomplished and trustworthy',
        example: 'General Marshall (archetype) represents Zone 3-4 Capricorn. Natural authority, built lasting institutions, disciplined but not cold, achieved with integrity.'
      },
      {
        zone: 4,
        degrees: '15°-20°',
        name: 'The Peak Master',
        coreQuality: 'MAXIMUM CAPRICORN POWER',
        characteristics: [
          'PEAK mastery — ultimate achievement and skill',
          'Perfect discipline — structure as art, not burden',
          'Ultimate authority — leadership at highest expression',
          'Legacy building — creating what lasts beyond lifetime',
          'Emotionally integrated — feelings and professionalism in harmony'
        ],
        sunModifier: '"I AM the DEFINITION of mastery and legacy" — Textbook perfect authority energy',
        moonModifier: 'Emotions are PERFECTLY MATURE. Perfect balance of competence and vulnerability',
        ascendantModifier: 'You ARE the master archetype. AUTHORITY and WISDOM incarnate',
        example: 'Angela has Sun at 17° Capricorn. Built three companies, serves on nonprofit boards, raised accomplished children, 40-year marriage. Peak Capricorn — achievement, integrity, legacy, and love perfectly integrated.'
      },
      {
        zone: 5,
        degrees: '20°-25°',
        name: 'The Wise Elder',
        coreQuality: 'MASTERED ACHIEVEMENT, SENSING INNOVATION',
        characteristics: [
          'Mastered authority — knows when to lead, when to empower others',
          'Teaching mastery — showing others how to build legacy',
          'Sensing Aquarius pull — wanting innovation beyond tradition',
          'Achievement with vision — legacy meeting future',
          'Questioning pure structure — ready to revolutionize'
        ],
        sunModifier: '"I\'ve mastered achievement — now what about INNOVATION?" — Feeling Aquarius pull',
        moonModifier: 'Emotions are WISE and OPENING. Beginning to want innovation, not just stability',
        ascendantModifier: 'You look AUTHORITATIVE and VISIONARY. Accomplished AND innovative',
        example: 'CEO Elderstone has Saturn at 23° Capricorn. After 30 years building traditional institutions, now advocating for radical workplace changes. Bridge between Capricorn mastery and Aquarius innovation.'
      },
      {
        zone: 6,
        degrees: '25°-30°',
        name: 'The Bridge Builder',
        coreQuality: 'MASTERY BECOMES REVOLUTION',
        characteristics: [
          'Achievement with innovation — tradition meeting future',
          'Discipline with vision — structure enabling revolution',
          'Mastery with community — individual success serving collective',
          'Legacy with progress — building what evolves',
          'Earth meeting Air — form meeting idea'
        ],
        sunModifier: '"I\'m a master who REVOLUTIONIZES" — Achievement serves collective evolution',
        moonModifier: 'Emotions are MATURE but REVOLUTIONARY. Need achievement AND innovation',
        ascendantModifier: 'You look MASTERFUL and PROGRESSIVE. Authoritative AND visionary',
        example: 'Professor Summit has Mars at 28° Capricorn. Used 25 years of traditional academia mastery to completely restructure her university — democratizing access, building innovative programs. Bridge between tradition and transformation.'
      }
    ]
  },
  aquarius: {
    sign: 'Aquarius',
    symbol: '♒',
    essence: 'Innovation, revolution, community, vision, humanitarianism, technology, progress, equality',
    element: 'Air',
    modality: 'Fixed',
    season: 'Mid-Winter',
    zones: [
      {
        zone: 1,
        degrees: '0°-5°',
        name: 'The Alienated Rebel',
        coreQuality: 'DESPERATE UNIQUENESS',
        characteristics: [
          'Frantically different — proving specialness through weirdness',
          'Rebellious without cause — contrarian for its own sake',
          'Emotionally detached to extreme — can\'t show feelings at all',
          'Intellectually arrogant — superior about intelligence',
          'Commitment-phobic — can\'t attach to anything or anyone'
        ],
        sunModifier: '"I must be DIFFERENT to prove I\'m special!" — Identity built on being outsider',
        moonModifier: 'Emotions are FROZEN or DETACHED. Feel safe only through distance',
        ascendantModifier: 'You LOOK weird and unapproachable. First impression: strange and distant',
        example: 'Alex has Moon at 3° Aquarius. Prides himself on being "above normal human emotions." His sister said: "You\'re not special because you don\'t feel — you\'re lonely because you won\'t feel."'
      },
      {
        zone: 2,
        degrees: '5°-10°',
        name: 'The Developing Visionary',
        coreQuality: 'BUILDING AUTHENTIC INNOVATION',
        characteristics: [
          'Authentically unique — difference becoming real, not performed',
          'Purposefully rebellious — revolution serving actual progress',
          'Emotionally warming — beginning to feel safe with feelings',
          'Intellectually humble — learning with others, not above them',
          'Independently connected — freedom with community emerging'
        ],
        sunModifier: '"I\'m learning REAL innovation, not just rebellion!" — Growing capacity for community',
        moonModifier: 'Emotions are WARMING and more ACCESSIBLE. Beginning to feel safe showing feelings',
        ascendantModifier: 'You look UNIQUE and APPROACHABLE. Interesting and friendly',
        example: 'Maya has Uranus at 8° Aquarius. Used to protest everything just to be contrary. Now channels revolutionary energy into founding a tech nonprofit teaching coding to underserved communities.'
      },
      {
        zone: 3,
        degrees: '10°-15°',
        name: 'Natural Visionary Emerging',
        coreQuality: 'AUTHENTIC REVOLUTION',
        characteristics: [
          'Naturally innovative — revolution flows effortlessly',
          'Purposefully unique — difference serves collective',
          'Emotionally integrated — feelings and intellect balanced',
          'Intellectually brilliant — ideas serve humanity',
          'Independently communal — individual within collective'
        ],
        sunModifier: '"Innovation and community are WHO I AM naturally" — Natural visionary and humanitarian',
        moonModifier: 'Emotions are FREE and CONNECTED. Feel safe in both independence and community',
        ascendantModifier: 'You ARE natural visionary. First impression: brilliant and caring',
        example: 'Dr. Innovator has Sun at 13° Aquarius. Founded a company creating accessible technology for disabilities — combining brilliant innovation with deep humanitarian purpose.'
      },
      {
        zone: 4,
        degrees: '15°-20°',
        name: 'The Peak Revolutionary',
        coreQuality: 'MAXIMUM AQUARIUS POWER',
        characteristics: [
          'PEAK innovation — ultimate vision and revolution',
          'Perfect humanitarianism — serving humanity completely',
          'Ultimate community — individual and collective in harmony',
          'Revolutionary mastery — changing world naturally',
          'Emotionally liberated — feelings free and connected'
        ],
        sunModifier: '"I AM the DEFINITION of innovation and humanity" — Textbook perfect revolutionary energy',
        moonModifier: 'Emotions are PERFECTLY FREE. Perfect balance of independence and connection',
        ascendantModifier: 'You ARE the visionary archetype. INNOVATION and HUMANITY incarnate',
        example: 'Imagine combining Tesla\'s innovation with MLK Jr.\'s humanitarian vision — that\'s peak Aquarius. Revolutionary technology or ideas serving collective liberation.'
      },
      {
        zone: 5,
        degrees: '20°-25°',
        name: 'The Wise Visionary',
        coreQuality: 'MASTERED INNOVATION, SENSING SPIRITUALITY',
        characteristics: [
          'Mastered revolution — knows when to innovate, when to honor',
          'Teaching vision — showing others how to build future',
          'Sensing Pisces pull — wanting spirituality beyond intellect',
          'Innovation with compassion — ideas meeting feelings',
          'Questioning pure intellect — ready for mystical connection'
        ],
        sunModifier: '"I\'ve mastered innovation — now what about SOUL?" — Feeling Pisces pull',
        moonModifier: 'Emotions are WISE and DEEPENING. Beginning to want spirituality, not just independence',
        ascendantModifier: 'You look VISIONARY and SPIRITUAL. Innovative AND soulful',
        example: 'Tech CEO Visionary has Uranus at 23° Aquarius. After building revolutionary AI systems, now focused on how technology can serve spiritual evolution — meditation apps, consciousness research.'
      },
      {
        zone: 6,
        degrees: '25°-30°',
        name: 'The Bridge Builder',
        coreQuality: 'REVOLUTION BECOMES COMPASSION',
        characteristics: [
          'Innovation with spirituality — revolution meeting transcendence',
          'Intellect with intuition — logic meeting mysticism',
          'Community with oneness — collective meeting universal',
          'Vision with compassion — future meeting soul',
          'Air meeting Water — ideas dissolving into spirit'
        ],
        sunModifier: '"I\'m a visionary who TRANSCENDS" — Innovation + Spirituality blending',
        moonModifier: 'Emotions are FREE but DISSOLVING. Need innovation AND transcendence',
        ascendantModifier: 'You look INNOVATIVE and MYSTICAL. Visionary AND spiritual',
        example: 'Dr. Infinity has Moon at 28° Aquarius. Pioneered quantum physics research but now studies consciousness and mysticism. Bridge between revolutionary vision and mystical oneness.'
      }
    ]
  },
  pisces: {
    sign: 'Pisces',
    symbol: '♓',
    essence: 'Spirituality, compassion, dreams, transcendence, dissolution, universal love, imagination',
    element: 'Water',
    modality: 'Mutable',
    season: 'Late Winter',
    zones: [
      {
        zone: 1,
        degrees: '0°-5°',
        name: 'The Lost Dreamer',
        coreQuality: 'OVERWHELMING DISSOLUTION',
        characteristics: [
          'Overwhelmingly empathic — drowning in everyone\'s feelings',
          'Escapist desperately — can\'t handle reality at all',
          'Victim mentality extreme — everything hurts, nothing is my fault',
          'Boundary-less completely — where do I end and others begin?',
          'Delusional potentially — can\'t distinguish real from imagined'
        ],
        sunModifier: '"I\'m dissolving — where am I?!" — Identity is foggy, unclear, lost',
        moonModifier: 'Emotions are OVERWHELMING OCEAN. Feel everything everyone feels',
        ascendantModifier: 'You LOOK lost and vulnerable. First impression: overwhelmed and fragile',
        example: 'Emma has Neptune at 3° Pisces. Can\'t watch the news (too painful), stopped therapy because her therapist\'s problems felt like hers. Learning that compassion doesn\'t mean losing yourself.'
      },
      {
        zone: 2,
        degrees: '5°-10°',
        name: 'The Developing Mystic',
        coreQuality: 'LEARNING HEALTHY COMPASSION',
        characteristics: [
          'Compassionately balanced — empathy with boundaries emerging',
          'Spiritually grounded — transcendence with embodiment',
          'Artistically expressing — dreams become creation, not just escape',
          'Boundary-developing — learning where I end and others begin',
          'Realistically mystical — spirituality grounded in reality'
        ],
        sunModifier: '"I\'m learning REAL compassion, not just bleeding for everyone!" — Growing capacity for grounded spirituality',
        moonModifier: 'Emotions are DEEP but more BOUNDED. Still highly empathic but learning limits',
        ascendantModifier: 'You look MYSTICAL and GROUNDED. Spiritual but present',
        example: 'Sophia has Moon at 8° Pisces. Used to cry at every commercial. Now channels sensitivity into art therapy — helping others process emotions through creativity.'
      },
      {
        zone: 3,
        degrees: '10°-15°',
        name: 'Natural Mystic Emerging',
        coreQuality: 'AUTHENTIC TRANSCENDENCE',
        characteristics: [
          'Naturally spiritual — transcendence is effortless',
          'Wisely compassionate — empathy with healthy boundaries',
          'Artistically gifted — dreams manifest as beauty',
          'Boundary-skillful — knows where self ends, others begin',
          'Mystically grounded — spirituality embodied in reality'
        ],
        sunModifier: '"Spirituality and compassion are WHO I AM naturally" — Natural healer and mystic',
        moonModifier: 'Emotions are TRANSCENDENT and HEALTHY. Feel deeply without losing self',
        ascendantModifier: 'You ARE natural transcendence. First impression: deeply spiritual and present',
        example: 'Priestess Luna has Neptune at 13° Pisces. Leads spiritual retreats, offers profound healing, maintains healthy boundaries. Compassion, transcendence, and boundaries in harmony.'
      },
      {
        zone: 4,
        degrees: '15°-20°',
        name: 'The Peak Mystic',
        coreQuality: 'MAXIMUM PISCES POWER',
        characteristics: [
          'PEAK spirituality — ultimate transcendence embodied',
          'Perfect compassion — universal love without martyrdom',
          'Ultimate healing — transforms suffering into grace',
          'Mystical mastery — oneness with all beings',
          'Boundary perfection — knows exactly when to merge, when to separate'
        ],
        sunModifier: '"I AM the DEFINITION of spirituality and compassion" — Textbook perfect mystic energy',
        moonModifier: 'Emotions are PERFECTLY TRANSCENDENT. Perfect balance of empathy and boundaries',
        ascendantModifier: 'You ARE the mystic archetype. TRANSCENDENCE and LOVE incarnate',
        example: 'Imagine combining Mother Teresa\'s compassion with the Dalai Lama\'s wisdom and Rumi\'s poetry — that\'s peak Pisces. Universal love that transforms suffering while remaining fully human.'
      },
      {
        zone: 5,
        degrees: '20°-25°',
        name: 'The Wise Transcendent',
        coreQuality: 'MASTERED SPIRITUALITY, SENSING ACTION',
        characteristics: [
          'Mastered transcendence — knows when to surrender, when to embody',
          'Teaching mysticism — showing others path to oneness',
          'Sensing Aries pull — wanting action, courage, assertion',
          'Compassion with courage — love meeting strength',
          'Questioning pure dissolution — ready to incarnate fully'
        ],
        sunModifier: '"I\'ve mastered oneness — now what about SELF?" — Feeling Aries pull',
        moonModifier: 'Emotions are WISE and ACTIVATING. Beginning to want action, not just feeling',
        ascendantModifier: 'You look MYSTICAL and READY. Spiritual AND powerful',
        example: 'Master Teacher has Sun at 23° Pisces. After 40 years of spiritual practice, now teaching "spiritual warriorship" — how to take compassionate action in the world.'
      },
      {
        zone: 6,
        degrees: '25°-30°',
        name: 'The Bridge Builder — Zodiac Completion',
        coreQuality: 'DISSOLUTION BECOMES REBIRTH',
        characteristics: [
          'Transcendence with action — oneness birthing individuality',
          'Compassion with courage — love preparing to fight',
          'Spirituality with physicality — dreams meeting reality',
          'Ending with beginning — death becoming birth',
          'Water meeting Fire — dissolution igniting new spark'
        ],
        sunModifier: '"I\'m the ending becoming the beginning" — Transcendence + Action blending, 29° = ultimate completion',
        moonModifier: 'Emotions are DISSOLVING but REIGNITING. Need transcendence AND assertion',
        ascendantModifier: 'You look MYSTICAL and POWERFUL. Spiritual AND strong',
        example: 'Sage Phoenix has Venus at 29° Pisces. Embodies universal love so complete it\'s preparing to become fierce individual passion. The ending becoming the beginning — the circle closing to reopen.'
      }
    ]
  }
};
