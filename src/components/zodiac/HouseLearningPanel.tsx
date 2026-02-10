import React, { useState, useRef, useEffect } from 'react';

// ============================================================================
// HOUSE LEARNING PANEL
// Floating, draggable educational modal about Western zodiac houses
// 50% viewport width, tabs for Intro + 12 houses
// ============================================================================

interface HouseLearningPanelProps {
  houseNumber: number;  // 0-12 (0 = Intro)
  onClose: () => void;
  chartData?: any;  // For future personalization
}

// Tab type for navigation
type TabValue = 'intro' | 'signs' | 'zones' | number;

// Sign rulership data
const SIGN_RULERS: Record<string, { ruler: string; symbol: string; element: string; modality: string }> = {
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

interface ZodiacSignContent {
  symbol: string;
  name: string;
  archetype: string;
  dates: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  season: string;
  ruler: string;
  rulerSymbol: string;
  naturalHouse: number;
  keyword: string;
  bodyPart: string;
  coreSignificance: {
    who: string;
    what: string;
    when: string;
    where: string;
    why: string;
    how: string;
    emotion: string;
  };
  positiveTraits: string[];
  challenges: string[];
  lifeLesson: string;
  careerStrengths: string;
  moonIn: string;
  ascendantIn: string;
  venusIn: string;
  marsIn: string;
}

const ZODIAC_SIGNS: Record<string, ZodiacSignContent> = {
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

interface ZoneDetail {
  zone: number;
  degrees: string;
  name: string;
  coreQuality: string;
  characteristics: string[];
  sunModifier: string;
  moonModifier: string;
  ascendantModifier: string;
  example: string;
}

interface SignZoneData {
  sign: string;
  symbol: string;
  essence: string;
  element: string;
  modality: string;
  season: string;
  zones: ZoneDetail[];
}

const SIGN_ZONE_DETAILS: Record<string, SignZoneData> = {
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

// House data for tabs 1-12
const HOUSE_DATA: Record<number, {
  title: string;
  subtitle: string;
  keyword: string;
  naturalSign: string;
  lifeAreas: string[];
  questions: string[];
}> = {
  1: {
    title: 'House 1 — The Self',
    subtitle: 'Your First Impression & Identity',
    keyword: 'I AM',
    naturalSign: 'Aries',
    lifeAreas: [
      'Physical appearance and body type',
      'Personality and temperament',
      'First impressions you make',
      'How you approach new situations',
      'Your outward demeanor',
      'Physical vitality and health constitution',
      'Self-image and personal style',
      'How others perceive you at first glance',
    ],
    questions: ['Who am I?', 'How do I present myself?', 'What mask do I wear?'],
  },
  2: {
    title: 'House 2 — Values & Resources',
    subtitle: 'What You Own & What Owns You',
    keyword: 'I HAVE',
    naturalSign: 'Taurus',
    lifeAreas: [
      'Personal finances and income',
      'Material possessions',
      'Self-worth and values',
      'Talents you can monetize',
      'Relationship with money',
      'What you find valuable',
      'Security needs',
      'How you earn a living',
    ],
    questions: ['What do I value?', 'What resources do I have?', 'What is my worth?'],
  },
  3: {
    title: 'House 3 — Communication',
    subtitle: 'How You Think & Connect',
    keyword: 'I THINK',
    naturalSign: 'Gemini',
    lifeAreas: [
      'Communication style',
      'Siblings and neighbors',
      'Short trips and local travel',
      'Early education',
      'Mental processes',
      'Writing and speaking',
      'Daily commute',
      'Immediate environment',
    ],
    questions: ['How do I communicate?', 'How do I learn?', 'How do I connect with my environment?'],
  },
  4: {
    title: 'House 4 — Home & Roots',
    subtitle: 'Your Foundation & Inner World',
    keyword: 'I FEEL',
    naturalSign: 'Cancer',
    lifeAreas: [
      'Home and family',
      'Emotional foundation',
      'Ancestry and heritage',
      'The nurturing parent',
      'Real estate and property',
      'Private life',
      'End of life and legacy',
      'Psychological roots',
    ],
    questions: ['Where do I come from?', 'What is my foundation?', 'What makes me feel secure?'],
  },
  5: {
    title: 'House 5 — Creativity & Joy',
    subtitle: 'Your Creative Expression & Pleasure',
    keyword: 'I CREATE',
    naturalSign: 'Leo',
    lifeAreas: [
      'Creative self-expression',
      'Romance and dating',
      'Children (yours or interactions with)',
      'Hobbies and recreation',
      'Gambling and speculation',
      'Entertainment and fun',
      'Artistic pursuits',
      'What brings you joy',
    ],
    questions: ['What brings me joy?', 'How do I express myself?', 'What do I create?'],
  },
  6: {
    title: 'House 6 — Health & Service',
    subtitle: 'Daily Routines & Work',
    keyword: 'I SERVE',
    naturalSign: 'Virgo',
    lifeAreas: [
      'Daily work and employment',
      'Health and wellness',
      'Daily routines and habits',
      'Service to others',
      'Pets and small animals',
      'Coworkers and employees',
      'Hygiene and diet',
      'Self-improvement',
    ],
    questions: ['How do I serve?', 'What are my daily habits?', 'How do I maintain health?'],
  },
  7: {
    title: 'House 7 — Partnerships',
    subtitle: 'One-on-One Relationships',
    keyword: 'I RELATE',
    naturalSign: 'Libra',
    lifeAreas: [
      'Marriage and committed partnerships',
      'Business partnerships',
      'Open enemies and competitors',
      'Contracts and agreements',
      'What you seek in others',
      'The "other" in relationships',
      'Legal matters',
      'Diplomacy and negotiation',
    ],
    questions: ['What do I seek in a partner?', 'How do I relate to others?', 'What do I project onto others?'],
  },
  8: {
    title: 'House 8 — Transformation',
    subtitle: 'Shared Resources & Rebirth',
    keyword: 'I TRANSFORM',
    naturalSign: 'Scorpio',
    lifeAreas: [
      'Shared finances and resources',
      'Inheritance and legacies',
      'Death and rebirth cycles',
      'Intimacy and sexuality',
      'Psychological depth',
      'Taxes and debt',
      'Occult and hidden matters',
      'Crisis and transformation',
    ],
    questions: ['What must I let go of?', 'How do I transform?', 'What is hidden?'],
  },
  9: {
    title: 'House 9 — Philosophy',
    subtitle: 'Higher Learning & Expansion',
    keyword: 'I SEEK',
    naturalSign: 'Sagittarius',
    lifeAreas: [
      'Higher education and philosophy',
      'Long-distance travel',
      'Foreign cultures and languages',
      'Religion and spirituality',
      'Publishing and broadcasting',
      'Legal system and law',
      'Ethics and morality',
      'Search for meaning',
    ],
    questions: ['What do I believe?', 'What is my truth?', 'How do I expand my horizons?'],
  },
  10: {
    title: 'House 10 — Career & Legacy',
    subtitle: 'Your Public Image & Achievement',
    keyword: 'I ACHIEVE',
    naturalSign: 'Capricorn',
    lifeAreas: [
      'Career and profession',
      'Public reputation',
      'Authority figures',
      'Social status',
      'Life goals and ambitions',
      'The authoritative parent',
      'Government and institutions',
      'Legacy and contribution to society',
    ],
    questions: ['What is my calling?', 'How do I want to be remembered?', 'What is my public role?'],
  },
  11: {
    title: 'House 11 — Community',
    subtitle: 'Friends, Groups & Future Vision',
    keyword: 'I HOPE',
    naturalSign: 'Aquarius',
    lifeAreas: [
      'Friendships and social circles',
      'Groups and organizations',
      'Hopes, wishes, and dreams',
      'Humanitarian causes',
      'Technology and innovation',
      'Networking',
      'Income from career (rewards)',
      'Future vision',
    ],
    questions: ['What are my hopes?', 'Who are my people?', 'How do I contribute to the collective?'],
  },
  12: {
    title: 'House 12 — The Unconscious',
    subtitle: 'Hidden Realms & Transcendence',
    keyword: 'I BELIEVE',
    naturalSign: 'Pisces',
    lifeAreas: [
      'The unconscious mind',
      'Hidden enemies and self-undoing',
      'Institutions (hospitals, prisons)',
      'Spiritual retreat and solitude',
      'Dreams and imagination',
      'Karma and past lives',
      'Secrets and hidden matters',
      'Transcendence and enlightenment',
    ],
    questions: ['What is hidden from me?', 'What must I release?', 'How do I transcend?'],
  },
};

// Complete Planet in House 1 Educational Content
interface PlanetContent {
  symbol: string;
  name: string;
  archetype: string;
  quickSummary: string;
  fiveW: {
    who: string;
    what: string;
    when: string;
    where: string;
    why: string;
    how: string;
    emotion: string;
  };
  characteristics: string[];
  challenges: string[];
  gifts: string[];
  realWorldExample: string;
  zoneVariations: {
    beginning: { title: string; description: string; emotion: string };
    core: { title: string; description: string; emotion: string };
    transition: { title: string; description: string; emotion: string };
  };
}

const PLANETS_IN_HOUSE_1: Record<string, PlanetContent> = {
  sun: {
    symbol: '☉',
    name: 'Sun',
    archetype: 'The Natural Leader',
    quickSummary: 'Your core identity (Sun) and your outer persona (House 1) are the SAME. What you see is what you get. You have strong presence and confidence.',
    fiveW: {
      who: 'People with Sun in House 1',
      what: 'Identity and appearance completely aligned',
      when: 'From birth - they know who they are early',
      where: 'In all first-impression situations - job interviews, meeting new people, entering rooms',
      why: 'The soul chose to express its core essence directly through the physical body and personality',
      how: 'Through natural confidence, strong presence, and leadership energy',
      emotion: '"I am HERE. This is ME. No apologies."'
    },
    characteristics: [
      'Leadership comes naturally without trying',
      'People notice you immediately when you enter a room',
      'Strong sense of self from very young age',
      'May be self-centered (not selfish - just self-focused)',
      'Confident in who you are - identity rarely questioned',
      'Often entrepreneurial or self-employed (can\'t hide in corporate structure)',
      'Physical vitality and health are important to identity',
      'Your body IS your identity - appearance matters',
      'Natural charisma that can\'t be taught',
      'You\'re "on stage" even when you don\'t mean to be'
    ],
    challenges: [
      'May overshadow others unintentionally',
      'Could struggle with humility or sharing spotlight',
      'Might need to be "the star" in every situation',
      'Can be too self-focused, forgetting others\' needs',
      'May intimidate people without meaning to',
      'Hard to blend in or be invisible when needed',
      'Identity too tied to physical appearance/health',
      'If body changes (aging, illness), identity crisis possible'
    ],
    gifts: [
      'Authentic and self-assured in all situations',
      'Natural charisma that inspires others',
      'Strong life force and vitality',
      'Leadership ability that others recognize immediately',
      'Confidence that helps in all endeavors',
      'Clear sense of purpose and direction',
      'Ability to be yourself without apology',
      'Natural star quality - you SHINE'
    ],
    realWorldExample: 'You walk into a job interview and people turn to look. Not because you\'re trying to get attention - you just HAVE presence. The interviewer remembers you even if there were 20 candidates. When you speak, people listen. This isn\'t ego - it\'s constitutional architecture. Your Sun (identity) IS your House 1 (appearance).',
    zoneVariations: {
      beginning: {
        title: 'Sun 0-10° (Zones 1-2)',
        description: 'Still learning to OWN your presence. Raw natural charisma, not yet refined. May be uncomfortable with attention. Building confidence in self-expression.',
        emotion: '"I\'m discovering my natural leadership"'
      },
      core: {
        title: 'Sun 10-20° (Zones 3-4)',
        description: 'PEAK self-expression and presence. Completely comfortable being yourself. Natural leadership fully manifested. Charisma at maximum power.',
        emotion: '"I AM who I am, naturally and confidently"'
      },
      transition: {
        title: 'Sun 20-30° (Zones 5-6)',
        description: 'Mastered self-expression. Refined charisma, not raw. Ready to use identity for larger purposes. Wisdom about how to wield presence.',
        emotion: '"I know how to BE myself strategically"'
      }
    }
  },
  moon: {
    symbol: '☽',
    name: 'Moon',
    archetype: 'The Emotional Face',
    quickSummary: 'Your emotions (Moon) show on your face and body (House 1). You can\'t hide what you\'re feeling. Very intuitive and responsive to others.',
    fiveW: {
      who: 'People with Moon in House 1',
      what: 'Emotions visible on face and in body language',
      when: 'All the time - emotional state always showing',
      where: 'Everywhere - can\'t hide feelings in any situation',
      why: 'The soul chose emotional transparency as constitutional architecture',
      how: 'Through facial expressions, body language, mood affecting appearance',
      emotion: '"Everyone knows how I feel. I can\'t hide it."'
    },
    characteristics: [
      'Emotions show on your face - you can\'t hide what you\'re feeling',
      'Mood directly affects your physical appearance',
      'Very empathetic and sensitive to others\' emotions',
      'May have round or soft facial features (Moon = soft, nurturing)',
      'Needs emotional authenticity - can\'t fake feelings',
      'Highly responsive to environment and others\' energy',
      'Nurturing presence that others feel immediately',
      'Your mood IS your identity in that moment',
      'Intuitive about others - you READ people instantly',
      'May look younger than your age (Moon = youthful quality)'
    ],
    challenges: [
      'Moody or emotionally reactive - feelings change appearance',
      'May take things too personally (everything affects you)',
      'Could struggle with emotional boundaries',
      'Others may try to "manage" your emotions',
      'Hard to maintain professional mask when upset',
      'Vulnerability visible to everyone (can feel unsafe)',
      'Identity too tied to emotional state',
      'May attract "fixers" or people who want to nurture you'
    ],
    gifts: [
      'Deep emotional intelligence - you KNOW feelings',
      'Natural nurturer - people feel safe with you',
      'Intuitive about others - read rooms instantly',
      'Authentic emotional expression inspires honesty in others',
      'Maternal/paternal energy that comforts people',
      'Ability to reflect others\' emotions (empathic mirroring)',
      'People trust you because you\'re emotionally real',
      'Your vulnerability is your strength'
    ],
    realWorldExample: 'Someone asks "Are you okay?" when you\'re upset even if you haven\'t said anything - it shows on your face. You walk into a room and people can feel your mood. Happy? The whole room lifts. Sad? People notice immediately. This isn\'t weakness - it\'s constitutional transparency. Your emotions ARE your identity in real-time.',
    zoneVariations: {
      beginning: {
        title: 'Moon 0-10° (BEGINNING)',
        description: 'Learning to manage emotional visibility. Raw emotional transparency, not yet refined. May feel overwhelmed by own sensitivity.',
        emotion: '"My emotions control my face"'
      },
      core: {
        title: 'Moon 10-20° (CORE)',
        description: 'Comfortable with emotional transparency. Uses emotional visibility as strength. Mood affects appearance powerfully.',
        emotion: '"My feelings ARE who I am"'
      },
      transition: {
        title: 'Moon 20-30° (TRANSITION)',
        description: 'Mastered emotional expression. Can modulate visibility when needed. Wisdom about when to show/hide feelings.',
        emotion: '"I choose when to let emotions show"'
      }
    }
  },
  mercury: {
    symbol: '☿',
    name: 'Mercury',
    archetype: 'The Communicator',
    quickSummary: 'Communication and mental activity (Mercury) define your identity (House 1). You think and talk about yourself a lot - not narcissism, just self-aware.',
    fiveW: {
      who: 'People with Mercury in House 1',
      what: 'Communication IS identity',
      when: 'Constantly - always thinking and talking about self',
      where: 'In all interactions - you express yourself verbally',
      why: 'The soul chose self-expression through words and ideas',
      how: 'Through talking, writing, gesturing, expressing mentally',
      emotion: '"I think, therefore I am. I speak, therefore I exist."'
    },
    characteristics: [
      'Very talkative and expressive verbally',
      'Quick-witted and mentally agile',
      'May look youthful or have young energy',
      'Talk with your hands - very expressive physically',
      'Need mental stimulation constantly',
      'May write or journal about yourself frequently',
      'Adaptable identity - can shift based on conversation',
      'Self-aware - you think ABOUT yourself a lot',
      'Curious about your own nature and identity',
      'Communication style IS your personality'
    ],
    challenges: [
      'May overthink your identity ("Who am I really?")',
      'Could be scattered or restless mentally',
      'Might talk too much about yourself',
      'Others may see you as self-absorbed',
      'Identity can feel unstable (changes with thoughts)',
      'May struggle with silence or stillness',
      'Can be too analytical about self',
      'Might second-guess your own identity'
    ],
    gifts: [
      'Articulate about who you are',
      'Natural communicator and speaker',
      'Mentally agile and quick',
      'Can explain yourself clearly to others',
      'Youthful energy throughout life',
      'Adaptable to different social situations',
      'Great at introductions and first meetings',
      'Your words create your reality'
    ],
    realWorldExample: 'When asked "Tell me about yourself," you have no problem - words flow naturally. You introduce yourself by talking about your interests, thoughts, ideas. You journal to understand yourself. Conversations help you figure out who you are. Silence feels strange because your identity IS verbal expression.',
    zoneVariations: {
      beginning: {
        title: 'Mercury 0-10° (BEGINNING)',
        description: 'Still learning to express identity verbally. Lots of words, not yet precise. May ramble about self.',
        emotion: '"I\'m figuring out who I am by talking"'
      },
      core: {
        title: 'Mercury 10-20° (CORE)',
        description: 'PEAK verbal self-expression. Words flow naturally and clearly. Communication IS identity fully.',
        emotion: '"I express myself perfectly through words"'
      },
      transition: {
        title: 'Mercury 20-30° (TRANSITION)',
        description: 'Mastered verbal identity expression. Can communicate self precisely. Ready to use words for larger purposes.',
        emotion: '"I know exactly how to express who I am"'
      }
    }
  },
  venus: {
    symbol: '♀',
    name: 'Venus',
    archetype: 'The Charmer',
    quickSummary: 'You\'re naturally attractive and charming, even if not conventionally beautiful. People like you on first meeting. Grace, style, and artistic sensibility define you.',
    fiveW: {
      who: 'People with Venus in House 1',
      what: 'Beauty and charm as primary identity',
      when: 'From birth - naturally attractive energy',
      where: 'All first impressions - people are drawn to you',
      why: 'The soul chose beauty and harmony as constitutional expression',
      how: 'Through physical grace, charm, style, and pleasant energy',
      emotion: '"People like me. I am likeable. This is natural."'
    },
    characteristics: [
      'Naturally attractive and charming (not just looks - ENERGY)',
      'People like you immediately upon meeting',
      'Grace and style come naturally',
      'May be concerned with appearance (not vain - constitutional)',
      'Artistic sensibility and good taste',
      'Diplomatic and harmony-seeking in first impressions',
      'Pleasant voice and manner of speaking',
      'May have symmetrical or classically beautiful features',
      'Others perceive you as "nice" or "sweet"',
      'Relationships and beauty central to your identity'
    ],
    challenges: [
      'May be vain or overly concerned with appearance',
      'Could rely too much on looks/charm',
      'Might avoid conflict to maintain harmony',
      'Others may not take you seriously (too pretty/nice)',
      'Can attract superficial relationships',
      'May struggle with aging (beauty = identity)',
      'Could be people-pleasing to be liked',
      'Might avoid showing "ugly" emotions'
    ],
    gifts: [
      'Natural attractiveness that opens doors',
      'Charm that makes people want to help you',
      'Artistic abilities and good taste',
      'Diplomatic skills in all interactions',
      'Grace under pressure',
      'Ability to make others feel beautiful too',
      'Pleasant energy that uplifts spaces',
      'People remember you as "that nice person"'
    ],
    realWorldExample: 'Job interviews go well because people just LIKE you. You don\'t have to try hard - charm is natural. People compliment your style even in casual clothes. When you walk into a room, the energy softens. This isn\'t manipulation - it\'s Venus in House 1. Your beauty (inner and outer) IS your identity.',
    zoneVariations: {
      beginning: {
        title: 'Venus 0-10° (BEGINNING)',
        description: 'Learning to own your attractiveness. Raw charm, not yet refined. May be shy about beauty.',
        emotion: '"I\'m discovering I\'m charming"'
      },
      core: {
        title: 'Venus 10-20° (CORE)',
        description: 'Peak attractiveness and charm. Fully confident in beauty. Magnetic presence.',
        emotion: '"I AM beautiful/charming naturally"'
      },
      transition: {
        title: 'Venus 20-30° (TRANSITION)',
        description: 'Mastered charm and grace. Uses beauty with wisdom. Beyond vanity into substance.',
        emotion: '"My beauty serves larger purposes"'
      }
    }
  },
  mars: {
    symbol: '♂',
    name: 'Mars',
    archetype: 'The Warrior',
    quickSummary: 'Assertive, direct, sometimes aggressive. High energy, athletic build, competitive nature. You lead with action and may be impatient.',
    fiveW: {
      who: 'People with Mars in House 1',
      what: 'Action and aggression as primary identity',
      when: 'Immediately - you ACT first, think later',
      where: 'In all situations requiring courage or assertion',
      why: 'The soul chose warrior energy as constitutional expression',
      how: 'Through direct action, physical energy, and competitive drive',
      emotion: '"I fight, therefore I am. Action IS identity."'
    },
    characteristics: [
      'Assertive and direct in all interactions',
      'High physical energy and athletic build',
      'Competitive nature - you NEED to win',
      'May be impatient or impulsive',
      'Strong physical presence and vitality',
      'Possibly accident-prone (especially head/face)',
      'You assert yourself naturally without asking permission',
      'Fight for what you want - warrior energy',
      'May have scars on face/head (Mars = accidents)',
      'Athletic or physically active - NEED to move'
    ],
    challenges: [
      'Can be too aggressive or combative',
      'May intimidate people unintentionally',
      'Could be impulsive or reckless',
      'Might start fights unnecessarily',
      'Anger shows immediately on face/body',
      'Can be selfish or only think of own needs',
      'May struggle with patience or gentleness',
      'Could injure self through physical activity'
    ],
    gifts: [
      'Natural courage and bravery',
      'High energy for accomplishing goals',
      'Strong physical vitality and health',
      'Competitive edge in all endeavors',
      'Direct honesty - say what you mean',
      'Ability to ACT when others hesitate',
      'Leadership through courage',
      'Physical strength and endurance'
    ],
    realWorldExample: 'You speak up first in meetings. Cut people off (not meaning to - you\'re just FAST). Take physical risks others avoid. Play sports aggressively. Walk fast, talk fast, move fast. This isn\'t rudeness - it\'s Mars in House 1. Your ACTION IS your identity.',
    zoneVariations: {
      beginning: {
        title: 'Mars 0-10° (BEGINNING)',
        description: 'Raw aggressive energy, untempered. Learning to control impulses. May be accident-prone.',
        emotion: '"I act first, regret later"'
      },
      core: {
        title: 'Mars 10-20° (CORE)',
        description: 'Peak warrior energy and courage. Controlled aggression. Athletic prowess maximized.',
        emotion: '"I AM the fighter/competitor"'
      },
      transition: {
        title: 'Mars 20-30° (TRANSITION)',
        description: 'Mastered warrior energy. Strategic aggression, not raw. Wisdom about when to fight.',
        emotion: '"I fight with purpose and wisdom"'
      }
    }
  },
  jupiter: {
    symbol: '♃',
    name: 'Jupiter',
    archetype: 'The Optimist',
    quickSummary: 'Naturally optimistic, generous, see bright side. May have larger build or gain weight easily. Lucky in life - opportunities come to you.',
    fiveW: {
      who: 'People with Jupiter in House 1',
      what: 'Expansion and optimism as identity',
      when: 'Always - you\'re the eternal optimist',
      where: 'Everywhere - you spread good vibes',
      why: 'The soul chose growth and faith as constitutional expression',
      how: 'Through optimism, generosity, and natural luck',
      emotion: '"Life is good. I am blessed. Everything works out."'
    },
    characteristics: [
      'Naturally optimistic and see the bright side',
      'Generous with time, money, attention',
      'May have larger build or gain weight easily (Jupiter expands)',
      'Lucky in life - opportunities find you',
      'Philosophical about who you are and life\'s meaning',
      'May be overconfident or preachy sometimes',
      'Your presence expands any room you enter',
      'Natural teacher or advisor',
      'People feel BIGGER after talking with you',
      'Faith that things will work out'
    ],
    challenges: [
      'May be overconfident or arrogant',
      'Could struggle with weight or over-indulgence',
      'Might be preachy or know-it-all',
      'Can promise more than you deliver',
      'May take on too much (overextend)',
      'Could be wasteful with resources',
      'Might avoid facing hard truths (toxic positivity)',
      'Can be self-righteous about beliefs'
    ],
    gifts: [
      'Natural optimism that inspires others',
      'Lucky breaks and good timing',
      'Generous spirit that attracts abundance',
      'Philosophical wisdom about life',
      'Natural teaching abilities',
      'Faith that carries through hard times',
      'Ability to see possibilities others miss',
      'Your presence makes spaces feel bigger'
    ],
    realWorldExample: 'You always land on your feet. Miss one bus, catch better one. Lose job, find better one. People say you\'re "lucky" but it\'s Jupiter in House 1 - opportunities ARE attracted to your optimistic energy. You walk into interviews confident they\'ll hire you, and they do.',
    zoneVariations: {
      beginning: {
        title: 'Jupiter 0-10° (BEGINNING)',
        description: 'Learning to trust optimism. Raw enthusiasm, not yet wisdom. May be overconfident.',
        emotion: '"Good things will happen to me!"'
      },
      core: {
        title: 'Jupiter 10-20° (CORE)',
        description: 'Peak optimism and luck. Faith fully established. Opportunities at maximum.',
        emotion: '"I AM blessed and fortunate"'
      },
      transition: {
        title: 'Jupiter 20-30° (TRANSITION)',
        description: 'Mastered optimism with wisdom. Knows when to expand, when to contract. Philosophical depth achieved.',
        emotion: '"My faith serves larger purposes"'
      }
    }
  },
  saturn: {
    symbol: '♄',
    name: 'Saturn',
    archetype: 'The Late Bloomer',
    quickSummary: 'You mature slowly but surely. May feel restricted or serious as child. Disciplined, responsible, possibly pessimistic. Success comes with time.',
    fiveW: {
      who: 'People with Saturn in House 1',
      what: 'Restriction and discipline as identity',
      when: 'From birth - felt "old" even as child',
      where: 'In all self-expression - always controlled',
      why: 'The soul chose mastery through limitation as path',
      how: 'Through discipline, restriction, and slow building',
      emotion: '"I am responsible. I must work hard. Success takes time."'
    },
    characteristics: [
      'Mature slowly - "late bloomer" in most areas',
      'May have felt restricted or limited as child',
      'Disciplined and responsible from young age',
      'Possibly pessimistic or serious',
      'May look older when young, younger when old',
      'Take yourself very seriously - identity is WORK',
      'Work hard on self-improvement constantly',
      'Authority issues or fear of judgment',
      'Success comes with age and time',
      'May have chronic health issues or body limitations'
    ],
    challenges: [
      'Too serious - struggle with playfulness',
      'May be pessimistic or negative',
      'Could be overly self-critical',
      'Might fear failure so much you don\'t try',
      'Can be rigid or inflexible about identity',
      'May struggle with authority figures',
      'Could have body shame or feel "wrong"',
      'Might delay living fully (always preparing)'
    ],
    gifts: [
      'Disciplined approach to self-development',
      'Responsible and reliable always',
      'Wisdom beyond your years',
      'Ability to endure hardship',
      'Strong work ethic that pays off',
      'Mature perspective on life',
      'Success that LASTS (not flash-in-pan)',
      'Respect earned through consistency'
    ],
    realWorldExample: 'As a child, you felt "old" - adults treated you like peer. In 20s, looked 35. In 50s, look 35. Early life was HARD, but got easier with age. Now you\'re the reliable one everyone counts on. This is Saturn in House 1 - your identity is EARNED through time and discipline.',
    zoneVariations: {
      beginning: {
        title: 'Saturn 0-10° (BEGINNING)',
        description: 'Heaviest restriction early in life. Learning discipline the hard way. May feel blocked at every turn.',
        emotion: '"Life is so hard. Will it ever ease?"'
      },
      core: {
        title: 'Saturn 10-20° (CORE)',
        description: 'Discipline becomes natural. Structure creates strength. Authority established.',
        emotion: '"I AM the master of myself"'
      },
      transition: {
        title: 'Saturn 20-30° (TRANSITION)',
        description: 'Mastered self-discipline. Wisdom from limitation. Ready to teach others.',
        emotion: '"My restrictions created my strength"'
      }
    }
  },
  uranus: {
    symbol: '♅',
    name: 'Uranus',
    archetype: 'The Rebel',
    quickSummary: 'Unique, unconventional, possibly eccentric. Stand out or deliberately rebel. Sudden changes in appearance. Need freedom to be yourself.',
    fiveW: {
      who: 'People with Uranus in House 1',
      what: 'Revolution and uniqueness as identity',
      when: 'From birth - always felt "different"',
      where: 'Everywhere - can\'t conform even if you try',
      why: 'The soul chose revolutionary expression as path',
      how: 'Through rebellion, innovation, and radical authenticity',
      emotion: '"I am different. I don\'t fit in. That\'s my power."'
    },
    characteristics: [
      'Unique and unconventional in appearance/manner',
      'Stand out from crowd (can\'t blend even if trying)',
      'May be eccentric or "weird" in endearing way',
      'Sudden changes in appearance or style',
      'Tall, unusual features, or distinctive look',
      'Dress uniquely - own style, not following trends',
      'Need freedom to be yourself (can\'t be constrained)',
      'Innovative and ahead of your time',
      'May be erratic or unpredictable',
      'Electric presence - people feel your energy'
    ],
    challenges: [
      'May feel alienated or like outsider',
      'Could be too rebellious (rebel without cause)',
      'Might shock people unintentionally',
      'Can be erratic or unstable in identity',
      'May struggle with commitment (too confining)',
      'Could be seen as "weird" or "difficult"',
      'Might change appearance too often (identity crisis)',
      'Can sabotage self through rebellion'
    ],
    gifts: [
      'Authentic uniqueness that inspires others',
      'Innovative perspective on everything',
      'Freedom to be completely yourself',
      'Ahead of your time in thinking/style',
      'Ability to revolutionize any field',
      'Electric charisma that attracts',
      'Your difference is your strength',
      'Natural innovator and disruptor'
    ],
    realWorldExample: 'You\'ve NEVER fit in - even as child, you were "that weird kid." Now it\'s your brand. People remember you because you\'re DIFFERENT. Job interviews? Either they love your uniqueness or fear it. No middle ground. This is Uranus in House 1 - your REBELLION IS your identity.',
    zoneVariations: {
      beginning: {
        title: 'Uranus 0-10° (BEGINNING)',
        description: 'Raw rebellious energy. Still learning to own uniqueness. May feel too different.',
        emotion: '"Why can\'t I be normal?"'
      },
      core: {
        title: 'Uranus 10-20° (CORE)',
        description: 'Peak revolutionary presence. Fully owning uniqueness. Innovation at maximum.',
        emotion: '"I AM the revolution"'
      },
      transition: {
        title: 'Uranus 20-30° (TRANSITION)',
        description: 'Mastered authentic difference. Uniqueness with wisdom. Ready to revolutionize systems.',
        emotion: '"My difference serves humanity"'
      }
    }
  },
  neptune: {
    symbol: '♆',
    name: 'Neptune',
    archetype: 'The Mystic',
    quickSummary: 'Identity is fluid, dreamy, hard to pin down. Spiritual, artistic, empathetic. People project onto you. May struggle to know who you really are.',
    fiveW: {
      who: 'People with Neptune in House 1',
      what: 'Dissolution and spirituality as identity',
      when: 'Always - you\'re never quite solid',
      where: 'Everywhere - people see what they want to see',
      why: 'The soul chose transcendence over defined identity',
      how: 'Through fluidity, spirituality, and artistic sensitivity',
      emotion: '"Who am I? I\'m everyone and no one. I dissolve."'
    },
    characteristics: [
      'Identity is fluid and hard to define',
      'Dreamy, spiritual, artistic nature',
      'Empathetic - absorb others\' emotions',
      'People project fantasies onto you (screen for projection)',
      'May not know who you really are',
      'Beautiful in ethereal, otherworldly way',
      'Can be deceptive or self-deceptive',
      'Prone to confusion about identity',
      'Natural actor - can become anyone',
      'Spiritual or mystical orientation'
    ],
    challenges: [
      'Identity confusion - "Who am I really?"',
      'May be deceptive or lie about self',
      'Could be victim to others\' projections',
      'Might struggle with boundaries (dissolve into others)',
      'Can be escapist (avoid solid identity)',
      'May use substances to escape self',
      'Could be taken advantage of (too trusting)',
      'Might avoid reality or harsh truths'
    ],
    gifts: [
      'Spiritual depth and connection',
      'Artistic sensitivity and talent',
      'Empathetic understanding of all',
      'Ability to become anyone (acting)',
      'Ethereal beauty that captivates',
      'Transcendence of ego',
      'Compassion for all beings',
      'Mystical experiences natural'
    ],
    realWorldExample: 'People tell you "You\'re so mysterious" or "I can\'t figure you out." They project onto you - one person sees you as saint, another as sinner. You struggle to write dating profiles because "Who AM I really?" This is Neptune in House 1 - your FLUIDITY IS your identity (or non-identity).',
    zoneVariations: {
      beginning: {
        title: 'Neptune 0-10° (BEGINNING)',
        description: 'Maximum identity confusion. Still learning to find self. May be lost in projection.',
        emotion: '"I don\'t know who I am"'
      },
      core: {
        title: 'Neptune 10-20° (CORE)',
        description: 'Spiritual identity established. Comfortable with fluidity. Mystical presence peak.',
        emotion: '"I AM spirit in form"'
      },
      transition: {
        title: 'Neptune 20-30° (TRANSITION)',
        description: 'Mastered spiritual identity. Wisdom from dissolution. Can be solid when needed.',
        emotion: '"My fluidity is my strength"'
      }
    }
  },
  pluto: {
    symbol: '♇',
    name: 'Pluto',
    archetype: 'The Transformer',
    quickSummary: 'Intense presence, transform constantly through life. Death-rebirth cycles define you. Powerful, magnetic, sometimes intimidating.',
    fiveW: {
      who: 'People with Pluto in House 1',
      what: 'Transformation and power as identity',
      when: 'Through major life death/rebirth cycles',
      where: 'In all intense situations - you bring depth',
      why: 'The soul chose transformation as life path',
      how: 'Through crisis, power, and constant reinvention',
      emotion: '"I die and am reborn. Over and over. This is who I am."'
    },
    characteristics: [
      'Intense presence that others feel immediately',
      'Transform constantly throughout life',
      'Death-rebirth cycles are your norm',
      'Powerful and magnetic energy',
      'Sometimes intimidating without trying',
      'Reinvent yourself repeatedly (different people across life)',
      'May have experienced trauma that shaped identity',
      'Natural psychologist - see beneath surfaces',
      'People sense your DEPTH',
      'Control issues around self-expression'
    ],
    challenges: [
      'Too intense for some people',
      'May intimidate others unintentionally',
      'Could be obsessive about identity',
      'Might use power manipulatively',
      'Can be vengeful or hold grudges',
      'May have trust issues (betrayal wounds)',
      'Could experience major identity crises',
      'Might resist necessary transformation'
    ],
    gifts: [
      'Profound transformation ability',
      'Powerful presence that commands respect',
      'Depth of understanding',
      'Natural psychological insight',
      'Ability to survive anything',
      'Magnetic charisma that attracts',
      'Your intensity is your power',
      'Rebirth ability - phoenix energy'
    ],
    realWorldExample: 'You\'ve had MULTIPLE lives in one lifetime. Age 0-20 was one person. Age 20-40 completely different. Age 40+ will be another rebirth. People from your past don\'t recognize you. This is Pluto in House 1 - your TRANSFORMATION IS your identity.',
    zoneVariations: {
      beginning: {
        title: 'Pluto 0-10° (BEGINNING)',
        description: 'Raw transformative power. Early major crises. Learning to handle intensity.',
        emotion: '"Why is my life so intense?"'
      },
      core: {
        title: 'Pluto 10-20° (CORE)',
        description: 'Peak transformative power. Comfortable with depth. Magnetic presence maximum.',
        emotion: '"I AM transformation itself"'
      },
      transition: {
        title: 'Pluto 20-30° (TRANSITION)',
        description: 'Mastered transformation. Wisdom from death/rebirth. Ready to transform systems.',
        emotion: '"My power serves evolution"'
      }
    }
  },
  northNode: {
    symbol: '☊',
    name: 'North Node',
    archetype: 'Learning to Be Yourself',
    quickSummary: 'Your life purpose is to develop SELF-FOCUS (coming from South Node in H7 people-pleasing). You\'re learning independence and strong identity.',
    fiveW: {
      who: 'People with North Node in House 1',
      what: 'Learning self-focus as life lesson',
      when: 'Throughout life - the journey FROM other-focus TO self-focus',
      where: 'In all situations where you must choose self vs. others',
      why: 'Past lives focused on partnerships; this life is about YOU',
      how: 'Through gradually developing independence and identity',
      emotion: '"It\'s hard to focus on myself. But that\'s my lesson."'
    },
    characteristics: [
      'Life purpose is developing SELF-FOCUS',
      'Coming from past life of people-pleasing (South Node H7)',
      'Naturally good at relationships but need to develop self',
      'May feel selfish when focusing on own needs',
      'Learning to assert yourself and have boundaries',
      'Developing independent identity (not defined by partner)',
      'Discovering who you are separate from relationships',
      'May struggle with "being alone" early in life',
      'Life pushes you toward independence',
      'The journey: too focused on others → learning self → balanced'
    ],
    challenges: [
      'Feels selfish to focus on self (but that\'s the lesson!)',
      'May resist developing strong identity',
      'Could stay in relationships too long (comfort zone)',
      'Might struggle with being alone',
      'Can sacrifice self for others habitually',
      'May not know who you are without partner',
      'Could attract codependent dynamics',
      'Might fear abandonment if you assert yourself'
    ],
    gifts: [
      'Balanced sense of self AND relationship',
      'Healthy boundaries (not codependent)',
      'Strong independent identity (when developed)',
      'Leadership abilities emerge',
      'Can be alone without loneliness',
      'Inspire others to develop themselves',
      'Natural understanding of relationship dynamics',
      'Wisdom about self vs. other balance'
    ],
    realWorldExample: 'In your 20s, you lost yourself in relationships - always became what partner wanted. By 40s, you\'re learning "Who am I really?" and choosing yourself sometimes. This is North Node in House 1 - your LIFE LESSON is developing strong, independent identity.',
    zoneVariations: {
      beginning: {
        title: 'NN 0-10° (BEGINNING)',
        description: 'Just starting the journey toward self-focus. Still very other-oriented. Learning independence is brand new.',
        emotion: '"Why is it so hard to focus on me?"'
      },
      core: {
        title: 'NN 10-20° (CORE)',
        description: 'Actively working on self-development. Identity formation in process. Balance emerging.',
        emotion: '"I\'m learning who I AM"'
      },
      transition: {
        title: 'NN 20-30° (TRANSITION)',
        description: 'Significant progress toward self-focus. Identity clearer. Ready to integrate self with other.',
        emotion: '"I know myself and can now truly partner"'
      }
    }
  },
  southNode: {
    symbol: '☋',
    name: 'South Node',
    archetype: 'Already Know Yourself',
    quickSummary: 'You came in with strong identity and self-focus (past life mastery). This life\'s growth is toward House 7 (partnerships). Learn to compromise and consider others.',
    fiveW: {
      who: 'People with South Node in House 1',
      what: 'Past life mastery of self-focus',
      when: 'From birth - you KNOW yourself already',
      where: 'In all situations - you default to independence',
      why: 'Past lives developed strong identity; now learn partnership',
      how: 'By releasing over-independence and embracing collaboration',
      emotion: '"I know who I am. But I need to learn about US."'
    },
    characteristics: [
      'Came in with strong sense of self (past life skill)',
      'Natural independence and leadership',
      'May be TOO self-focused or selfish',
      'Comfortable being alone (maybe too comfortable)',
      'Don\'t NEED others (and that\'s the problem)',
      'Growth is toward House 7 (partnership, compromise)',
      'Learning to consider others\' needs',
      'May struggle with collaboration or teamwork',
      'Identity is SOLID (maybe too solid - inflexible)',
      'The journey: over-independent → learning partnership → balanced'
    ],
    challenges: [
      'TOO independent (isolation results)',
      'May be selfish without realizing',
      'Could struggle with compromise',
      'Might not understand others\' needs',
      'Can be inflexible about identity',
      'May avoid intimacy (too vulnerable)',
      'Could miss relationship opportunities',
      'Might resist necessary partnership growth'
    ],
    gifts: [
      'Strong independent identity (foundation for partnership)',
      'Leadership abilities',
      'Self-sufficiency (healthy kind)',
      'Clear boundaries',
      'Don\'t lose self in relationships (healthy)',
      'Know who you are without question',
      'Confidence in own identity',
      'Stability to offer partners'
    ],
    realWorldExample: 'You\'ve always known who you are. Never had identity crisis. But relationships are HARD - compromise feels like losing yourself. By midlife, life teaches you the beauty of partnership without losing identity. This is South Node in House 1 - you\'re RELEASING over-independence to LEARN partnership.',
    zoneVariations: {
      beginning: {
        title: 'SN 0-10° (BEGINNING)',
        description: 'Strongest pull toward old patterns of independence. Learning to open to others most challenging here.',
        emotion: '"I don\'t need anyone" (but starting to see limits)'
      },
      core: {
        title: 'SN 10-20° (CORE)',
        description: 'Comfortable with self but recognizing need for others. Partnership lessons intensifying.',
        emotion: '"Maybe I DO need others"'
      },
      transition: {
        title: 'SN 20-30° (TRANSITION)',
        description: 'Ready to release over-independence. Opening to partnership. Integration beginning.',
        emotion: '"I can be myself AND be with another"'
      }
    }
  }
};

// Collapsible section component
const CollapsibleSection: React.FC<{
  title: string;
  icon?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, icon, defaultOpen = false, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-slate-800 hover:bg-slate-750 flex items-center justify-between text-left transition-colors"
      >
        <span className="flex items-center gap-2 text-lg font-semibold text-cyan-400">
          {icon && <span>{icon}</span>}
          {title}
        </span>
        <span className="text-slate-400 text-xl">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="p-4 bg-slate-900/50 border-t border-slate-700">
          {children}
        </div>
      )}
    </div>
  );
};

// 5W+H+Emotion grid component
const FiveWGrid: React.FC<{
  who?: string;
  what?: string;
  when?: string;
  where?: string;
  why?: string;
  how?: string;
  emotion?: string;
}> = (props) => (
  <div className="grid grid-cols-2 gap-3 text-sm">
    {props.who && <div><span className="text-purple-400 font-medium">Who:</span> <span className="text-slate-300">{props.who}</span></div>}
    {props.what && <div><span className="text-purple-400 font-medium">What:</span> <span className="text-slate-300">{props.what}</span></div>}
    {props.when && <div><span className="text-purple-400 font-medium">When:</span> <span className="text-slate-300">{props.when}</span></div>}
    {props.where && <div><span className="text-purple-400 font-medium">Where:</span> <span className="text-slate-300">{props.where}</span></div>}
    {props.why && <div><span className="text-purple-400 font-medium">Why:</span> <span className="text-slate-300">{props.why}</span></div>}
    {props.how && <div><span className="text-purple-400 font-medium">How:</span> <span className="text-slate-300">{props.how}</span></div>}
    {props.emotion && <div className="col-span-2"><span className="text-amber-400 font-medium">Emotion:</span> <span className="text-slate-300">{props.emotion}</span></div>}
  </div>
);

// Example box component
const ExampleBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mt-3">
    <div className="text-amber-400 text-xs uppercase tracking-wider mb-2">Example</div>
    <div className="text-slate-200 text-sm">{children}</div>
  </div>
);

// Tab 0 Content - "What Are Houses?"
const Tab0Content: React.FC = () => (
  <div className="space-y-6">
    {/* Opening Hook */}
    <CollapsibleSection title="What Are Houses?" icon="🏠" defaultOpen={true}>
      <p className="text-lg text-slate-200 mb-4">
        <strong className="text-cyan-400">Houses are WHERE things happen in your life.</strong>
      </p>
      <p className="text-slate-300 mb-4">
        If the planets are the actors and the signs are their costumes, then houses are the stages
        where the drama unfolds. Each of the 12 houses represents a different area of life experience.
      </p>
      <FiveWGrid
        who="You, in different life contexts"
        what="12 life arenas where planetary energies express"
        when="Determined by your exact birth time"
        where="The 12 sections of the chart wheel"
        why="To understand WHERE energies manifest in your life"
        how="Calculated from your Ascendant (rising sign)"
        emotion="Houses give planets a HOME — a place to belong"
      />
    </CollapsibleSection>

    {/* Key Distinction */}
    <CollapsibleSection title="Planets vs Houses — The Key Distinction" icon="🎭">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/30">
          <h4 className="text-purple-400 font-bold mb-2">Planets = WHAT</h4>
          <p className="text-sm text-slate-300">The energy, the actor, the verb</p>
          <p className="text-sm text-slate-400 mt-2">Mars = action, drive, aggression</p>
        </div>
        <div className="bg-cyan-500/10 p-4 rounded-lg border border-cyan-500/30">
          <h4 className="text-cyan-400 font-bold mb-2">Houses = WHERE</h4>
          <p className="text-sm text-slate-300">The life area, the stage, the setting</p>
          <p className="text-sm text-slate-400 mt-2">10th House = career, public life</p>
        </div>
      </div>
      <ExampleBox>
        <strong>Mars in the 10th House:</strong> Your drive and ambition (Mars) expresses
        through your career and public reputation (10th House). You're likely assertive
        in professional settings and may have a competitive career.
      </ExampleBox>
    </CollapsibleSection>

    {/* How Houses Are Calculated */}
    <CollapsibleSection title="How Houses Are Calculated — The Ascendant" icon="⬆️">
      <p className="text-slate-300 mb-4">
        Your <strong className="text-cyan-400">Ascendant (Rising Sign)</strong> is the zodiac sign
        that was rising on the eastern horizon at your exact moment of birth. This becomes the
        starting point — the cusp of your 1st House.
      </p>
      <div className="bg-slate-800 p-4 rounded-lg mb-4">
        <p className="text-sm text-slate-400 mb-2">The wheel then divides into 12 sections:</p>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>• <span className="text-cyan-400">House 1 cusp</span> = Ascendant (ASC)</li>
          <li>• <span className="text-cyan-400">House 4 cusp</span> = Imum Coeli (IC) — bottom of chart</li>
          <li>• <span className="text-cyan-400">House 7 cusp</span> = Descendant (DSC) — opposite ASC</li>
          <li>• <span className="text-cyan-400">House 10 cusp</span> = Midheaven (MC) — top of chart</li>
        </ul>
      </div>
      <p className="text-amber-400 text-sm">
        This is why accurate birth time is crucial — even a few minutes can shift house placements!
      </p>
    </CollapsibleSection>

    {/* The Four Angles */}
    <CollapsibleSection title="The Four Angles — Power Points" icon="✦">
      <p className="text-slate-300 mb-4">
        The four angles are the most powerful points in any chart. They're like the cardinal
        directions of your personal cosmic compass.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-500/10 p-3 rounded border border-red-500/30">
          <div className="text-red-400 font-bold">ASC (1st House)</div>
          <div className="text-xs text-slate-400">EAST — Rising</div>
          <div className="text-sm text-slate-300 mt-1">Self, identity, first impressions</div>
        </div>
        <div className="bg-blue-500/10 p-3 rounded border border-blue-500/30">
          <div className="text-blue-400 font-bold">IC (4th House)</div>
          <div className="text-xs text-slate-400">NADIR — Bottom</div>
          <div className="text-sm text-slate-300 mt-1">Home, roots, private self</div>
        </div>
        <div className="bg-green-500/10 p-3 rounded border border-green-500/30">
          <div className="text-green-400 font-bold">DSC (7th House)</div>
          <div className="text-xs text-slate-400">WEST — Setting</div>
          <div className="text-sm text-slate-300 mt-1">Partnerships, others, projection</div>
        </div>
        <div className="bg-amber-500/10 p-3 rounded border border-amber-500/30">
          <div className="text-amber-400 font-bold">MC (10th House)</div>
          <div className="text-xs text-slate-400">ZENITH — Top</div>
          <div className="text-sm text-slate-300 mt-1">Career, public image, legacy</div>
        </div>
      </div>
    </CollapsibleSection>

    {/* House Flow */}
    <CollapsibleSection title="House Flow — Counterclockwise Journey" icon="🔄">
      <p className="text-slate-300 mb-4">
        Houses flow <strong className="text-cyan-400">counterclockwise</strong> from the Ascendant,
        representing life's journey from self (1st) to transcendence (12th).
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-purple-400 font-bold">Quadrant 1: Personal (H1-3)</div>
          <p className="text-xs text-slate-400">Self-discovery, identity, early environment</p>
        </div>
        <div className="space-y-2">
          <div className="text-cyan-400 font-bold">Quadrant 2: Private (H4-6)</div>
          <p className="text-xs text-slate-400">Home, creativity, service</p>
        </div>
        <div className="space-y-2">
          <div className="text-green-400 font-bold">Quadrant 3: Social (H7-9)</div>
          <p className="text-xs text-slate-400">Partnerships, transformation, philosophy</p>
        </div>
        <div className="space-y-2">
          <div className="text-amber-400 font-bold">Quadrant 4: Universal (H10-12)</div>
          <p className="text-xs text-slate-400">Career, community, transcendence</p>
        </div>
      </div>
    </CollapsibleSection>

    {/* Why Different Sizes */}
    <CollapsibleSection title="Why Are Houses Different Sizes?" icon="📐">
      <p className="text-slate-300 mb-4">
        In the Placidus house system (most common in Western astrology), houses are
        <strong className="text-cyan-400"> unequal in size</strong> based on your birth latitude
        and time.
      </p>
      <ul className="text-sm text-slate-300 space-y-2">
        <li>• <span className="text-amber-400">Small houses</span> don't mean "less important"</li>
        <li>• <span className="text-amber-400">Large houses</span> don't mean "more emphasis"</li>
        <li>• Size reflects astronomical reality, not life significance</li>
        <li>• What matters is what's IN the house (planets) and WHO RULES it</li>
      </ul>
      <ExampleBox>
        A tiny 5th house packed with 3 planets is far more creatively active than
        a large, empty 5th house. The ruler's condition also matters!
      </ExampleBox>
    </CollapsibleSection>

    {/* House Rulers */}
    <CollapsibleSection title="House Rulers — The Power Source" icon="👑">
      <p className="text-slate-300 mb-4">
        Every house has a <strong className="text-cyan-400">ruler</strong> — the planet that rules
        the zodiac sign on that house's cusp. The ruler's condition (sign, house, aspects) tells
        you HOW that life area operates.
      </p>
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-4">
        <p className="text-sm text-purple-300">
          <strong>Power Flow:</strong> House Cusp Sign → Sign's Ruler → Ruler's House
        </p>
        <p className="text-xs text-slate-400 mt-2">
          This "power flow" connects different life areas, showing how energies transfer.
        </p>
      </div>
      <ExampleBox>
        <strong>If Taurus is on your 7th House cusp:</strong><br/>
        • Venus rules Taurus, so Venus rules your 7th House<br/>
        • If Venus is in your 10th House: partnerships connect to career<br/>
        • You may meet partners through work, or business becomes partnership-focused
      </ExampleBox>
    </CollapsibleSection>

    {/* Sign Rulers Table */}
    <CollapsibleSection title="Sign Rulers Reference" icon="📊">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left p-2 text-cyan-400">Sign</th>
              <th className="text-left p-2 text-cyan-400">Symbol</th>
              <th className="text-left p-2 text-cyan-400">Ruler</th>
              <th className="text-left p-2 text-cyan-400">Element</th>
              <th className="text-left p-2 text-cyan-400">Mode</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(SIGN_RULERS).map(([sign, data]) => (
              <tr key={sign} className="border-b border-slate-800">
                <td className="p-2 text-slate-200">{sign}</td>
                <td className="p-2 text-xl">{data.symbol}</td>
                <td className="p-2 text-purple-400">{data.ruler}</td>
                <td className="p-2 text-slate-400">{data.element}</td>
                <td className="p-2 text-slate-400">{data.modality}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CollapsibleSection>

    {/* Complete Picture */}
    <CollapsibleSection title="The Complete Picture — Baking a Cake" icon="🎂">
      <p className="text-slate-300 mb-4">
        Think of reading a house like baking a cake:
      </p>
      <ul className="text-sm space-y-2">
        <li className="text-slate-300">
          <span className="text-cyan-400 font-bold">House</span> = The type of cake (birthday, wedding, etc.)
        </li>
        <li className="text-slate-300">
          <span className="text-purple-400 font-bold">Sign on cusp</span> = The flavor (chocolate, vanilla)
        </li>
        <li className="text-slate-300">
          <span className="text-amber-400 font-bold">Planets inside</span> = The toppings and decorations
        </li>
        <li className="text-slate-300">
          <span className="text-green-400 font-bold">Ruler's condition</span> = The baker's skill and kitchen quality
        </li>
      </ul>
      <ExampleBox>
        <strong>Empty houses</strong> aren't inactive — they're managed by their ruler.
        An empty 7th house doesn't mean "no relationships" — look to where the ruler lives!
      </ExampleBox>
    </CollapsibleSection>

    {/* Next Steps */}
    <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg p-6 border border-cyan-500/30">
      <h3 className="text-xl font-bold text-cyan-400 mb-3">Ready to Explore?</h3>
      <p className="text-slate-300 mb-4">
        Click on any house tab above to learn about that specific life area, or click
        directly on a house in the wheel to jump to its content.
      </p>
      <div className="flex flex-wrap gap-2">
        {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
          <span key={n} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">
            H{n}: {HOUSE_DATA[n]?.keyword}
          </span>
        ))}
      </div>
    </div>
  </div>
);

// ============================================================================
// TAB 0.1: ZODIAC SIGNS FOUNDATION
// ============================================================================

// Sign Card Component - Expandable zodiac sign education
const SignCard: React.FC<{ signKey: string }> = ({ signKey }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const content = ZODIAC_SIGNS[signKey];
  if (!content) return null;

  const elementColors: Record<string, string> = {
    Fire: 'text-red-400 bg-red-500/10 border-red-500/20',
    Earth: 'text-green-400 bg-green-500/10 border-green-500/20',
    Air: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    Water: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  };

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/20">
      {/* Clickable Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{content.symbol}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold text-lg">{content.name}</span>
              <span className="text-slate-500">—</span>
              <span className="text-amber-400 italic">"{content.archetype}"</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>{content.dates}</span>
              <span>•</span>
              <span className={`px-1.5 py-0.5 rounded ${elementColors[content.element]}`}>{content.element}</span>
              <span className={`px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400`}>{content.modality}</span>
            </div>
          </div>
        </div>
        <span className="text-slate-400 text-xl">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {/* Keyword - Always Visible */}
      <div className="px-4 pb-3 text-slate-300 text-sm border-t border-slate-700/50 pt-3">
        <span className="text-purple-400 font-bold">{content.keyword}</span>
        <span className="text-slate-400 mx-2">•</span>
        <span>Ruled by {content.ruler} {content.rulerSymbol}</span>
        <span className="text-slate-400 mx-2">•</span>
        <span>Natural ruler of House {content.naturalHouse}</span>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-700 p-4 space-y-5 bg-slate-900/30">

          {/* Core Significance - 5W+H+Emotion */}
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
            <h4 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
              <span>🔮</span> Core Significance
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div><span className="text-yellow-400 font-medium">WHO:</span> <span className="text-slate-300">{content.coreSignificance.who}</span></div>
              <div><span className="text-yellow-400 font-medium">WHAT:</span> <span className="text-slate-300">{content.coreSignificance.what}</span></div>
              <div><span className="text-yellow-400 font-medium">WHEN:</span> <span className="text-slate-300">{content.coreSignificance.when}</span></div>
              <div><span className="text-yellow-400 font-medium">WHERE:</span> <span className="text-slate-300">{content.coreSignificance.where}</span></div>
              <div className="md:col-span-2"><span className="text-yellow-400 font-medium">WHY:</span> <span className="text-slate-300">{content.coreSignificance.why}</span></div>
              <div className="md:col-span-2"><span className="text-yellow-400 font-medium">HOW:</span> <span className="text-slate-300">{content.coreSignificance.how}</span></div>
              <div className="md:col-span-2"><span className="text-amber-400 font-medium">EMOTION:</span> <span className="text-amber-300 italic">{content.coreSignificance.emotion}</span></div>
            </div>
          </div>

          {/* Positive Traits */}
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
            <h4 className="text-green-400 font-bold mb-3 flex items-center gap-2">
              <span>✓</span> SUN IN {content.name.toUpperCase()}: Positive Traits
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
              {content.positiveTraits.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Challenges */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
            <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">
              <span>⚠</span> Challenges
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
              {content.challenges.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Life Lesson */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
            <h4 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
              <span>💡</span> Life Lesson
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">{content.lifeLesson}</p>
          </div>

          {/* Career Strengths */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
              <span>💼</span> Career Strengths
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">{content.careerStrengths}</p>
          </div>

          {/* This Sign Elsewhere */}
          <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
            <h4 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
              <span>🪐</span> {content.name} Elsewhere in Your Chart
            </h4>
            <div className="space-y-3 text-sm">
              <div className="bg-slate-800/50 p-3 rounded">
                <div className="text-purple-300 font-medium mb-1">☽ Moon in {content.name}</div>
                <p className="text-slate-400">{content.moonIn}</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded">
                <div className="text-purple-300 font-medium mb-1">↑ Ascendant in {content.name}</div>
                <p className="text-slate-400">{content.ascendantIn}</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded">
                <div className="text-purple-300 font-medium mb-1">♀ Venus in {content.name}</div>
                <p className="text-slate-400">{content.venusIn}</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded">
                <div className="text-purple-300 font-medium mb-1">♂ Mars in {content.name}</div>
                <p className="text-slate-400">{content.marsIn}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Tab 0.1 Content - "The 12 Zodiac Signs"
const TabSignsContent: React.FC = () => (
  <div className="space-y-6">
    {/* What Are Zodiac Signs? */}
    <CollapsibleSection title="What Are Zodiac Signs?" icon="🌟" defaultOpen={true}>
      <p className="text-lg text-slate-200 mb-4">
        <strong className="text-cyan-400">Imagine the sky as a giant clock marking the passage of one year.</strong>
      </p>
      <p className="text-slate-300 mb-4">
        As Earth orbits the Sun, the Sun appears to move through 12 different "sections" of the sky—like numbers on a clock face.
        These 12 sections are the <strong className="text-cyan-400">zodiac signs</strong>, each occupying exactly 30° of the 360° circle.
      </p>
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-4">
        <p className="text-purple-300 font-medium mb-2">The Key Insight:</p>
        <p className="text-slate-300 text-sm">
          <strong>EVERY planet in your chart is in a zodiac sign</strong>, not just the Sun! Your "Sun sign" is just one piece—
          you have a Moon sign, Mercury sign, Venus sign, and more. The zodiac signs are the <strong className="text-amber-400">FLAVORS</strong>,
          the planets are the <strong className="text-cyan-400">WHAT</strong>, and the houses are the <strong className="text-green-400">WHERE</strong>.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-slate-800/50 p-2 rounded">
          <span className="text-yellow-400">☉ Sun</span> = Core identity flavor
        </div>
        <div className="bg-slate-800/50 p-2 rounded">
          <span className="text-slate-300">☽ Moon</span> = Emotional flavor
        </div>
        <div className="bg-slate-800/50 p-2 rounded">
          <span className="text-cyan-400">☿ Mercury</span> = Communication flavor
        </div>
        <div className="bg-slate-800/50 p-2 rounded">
          <span className="text-pink-400">♀ Venus</span> = Love/values flavor
        </div>
        <div className="bg-slate-800/50 p-2 rounded">
          <span className="text-red-400">♂ Mars</span> = Action/drive flavor
        </div>
        <div className="bg-slate-800/50 p-2 rounded">
          <span className="text-orange-400">♃ Jupiter</span> = Growth/luck flavor
        </div>
      </div>
    </CollapsibleSection>

    {/* The Four Elements */}
    <CollapsibleSection title="The Four Elements (How Energy Flows)" icon="🔥">
      <p className="text-slate-300 mb-4">
        Each sign belongs to one of four elements. Elements show the <strong className="text-cyan-400">fundamental nature</strong> of the sign's energy.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
          <h4 className="text-red-400 font-bold mb-2">🔥 FIRE</h4>
          <p className="text-xs text-slate-400 mb-2">Aries, Leo, Sagittarius</p>
          <p className="text-sm text-slate-300">
            Passionate, creative, action-oriented. Fire signs <strong>INITIATE</strong>—they ignite, inspire, and create movement.
          </p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
          <h4 className="text-green-400 font-bold mb-2">🌍 EARTH</h4>
          <p className="text-xs text-slate-400 mb-2">Taurus, Virgo, Capricorn</p>
          <p className="text-sm text-slate-300">
            Practical, grounded, stable. Earth signs <strong>BUILD</strong>—they manifest, stabilize, and create lasting form.
          </p>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 rounded-lg">
          <h4 className="text-cyan-400 font-bold mb-2">💨 AIR</h4>
          <p className="text-xs text-slate-400 mb-2">Gemini, Libra, Aquarius</p>
          <p className="text-sm text-slate-300">
            Intellectual, social, communicative. Air signs <strong>CONNECT</strong>—they spread ideas, link people, and conceptualize.
          </p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
          <h4 className="text-blue-400 font-bold mb-2">💧 WATER</h4>
          <p className="text-xs text-slate-400 mb-2">Cancer, Scorpio, Pisces</p>
          <p className="text-sm text-slate-300">
            Emotional, intuitive, empathetic. Water signs <strong>FEEL</strong>—they process emotions, merge, and dissolve boundaries.
          </p>
        </div>
      </div>
    </CollapsibleSection>

    {/* The Three Modalities */}
    <CollapsibleSection title="The Three Modalities (When Energy Acts)" icon="🌀">
      <p className="text-slate-300 mb-4">
        Each sign belongs to one of three modalities. Modalities show the <strong className="text-cyan-400">timing and style</strong> of expression.
      </p>
      <div className="space-y-3">
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
          <h4 className="text-amber-400 font-bold mb-2">🌟 CARDINAL — Start of Season</h4>
          <p className="text-xs text-slate-400 mb-2">Aries, Cancer, Libra, Capricorn</p>
          <p className="text-sm text-slate-300">
            Initiating, leading, beginning. Cardinal signs <strong>START things</strong>—natural leaders who create change.
            But they may struggle to finish what they start.
          </p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
          <h4 className="text-purple-400 font-bold mb-2">💎 FIXED — Middle of Season</h4>
          <p className="text-xs text-slate-400 mb-2">Taurus, Leo, Scorpio, Aquarius</p>
          <p className="text-sm text-slate-300">
            Stabilizing, maintaining, persisting. Fixed signs <strong>MAINTAIN things</strong>—determined and reliable.
            But they can be stubborn and resistant to change.
          </p>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 rounded-lg">
          <h4 className="text-cyan-400 font-bold mb-2">🌀 MUTABLE — End of Season</h4>
          <p className="text-xs text-slate-400 mb-2">Gemini, Virgo, Sagittarius, Pisces</p>
          <p className="text-sm text-slate-300">
            Adapting, transitioning, flexible. Mutable signs <strong>COMPLETE things</strong>—wise adapters who prepare for change.
            But they can be scattered and lack focus.
          </p>
        </div>
      </div>
    </CollapsibleSection>

    {/* The Hero's Journey */}
    <CollapsibleSection title="The Complete Cycle: Hero's Journey" icon="🌍">
      <p className="text-slate-300 mb-4">
        The zodiac is a <strong className="text-cyan-400">complete life story</strong>—from birth to transcendence and rebirth:
      </p>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-green-500/10 border border-green-500/30 p-3 rounded">
          <div className="text-green-400 font-bold mb-1">🌱 SPRING: Personal Development</div>
          <div className="text-slate-400">Aries → Taurus → Gemini</div>
          <div className="text-xs text-slate-500 mt-1">Birth, growth, curiosity</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded">
          <div className="text-yellow-400 font-bold mb-1">☀️ SUMMER: Personal Expression</div>
          <div className="text-slate-400">Cancer → Leo → Virgo</div>
          <div className="text-xs text-slate-500 mt-1">Feeling, creating, refining</div>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/30 p-3 rounded">
          <div className="text-orange-400 font-bold mb-1">🍂 AUTUMN: Relationship</div>
          <div className="text-slate-400">Libra → Scorpio → Sagittarius</div>
          <div className="text-xs text-slate-500 mt-1">Partnership, transformation, wisdom</div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded">
          <div className="text-blue-400 font-bold mb-1">❄️ WINTER: Collective</div>
          <div className="text-slate-400">Capricorn → Aquarius → Pisces</div>
          <div className="text-xs text-slate-500 mt-1">Achievement, innovation, transcendence</div>
        </div>
      </div>
      <p className="text-amber-400 text-sm mt-4">
        After Pisces dissolves back to source, <strong>Aries is born again</strong>—the eternal cycle continues!
      </p>
    </CollapsibleSection>

    {/* The 12 Signs */}
    <CollapsibleSection title="The 12 Zodiac Signs" icon="♈" defaultOpen={true}>
      <p className="text-slate-300 mb-4">
        Click any sign below to expand and learn the full educational content including traits, challenges, and how this sign expresses through different planets.
      </p>
      <div className="space-y-3">
        {/* Spring Signs */}
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">🌱 Spring Signs (Personal Development)</div>
        <SignCard signKey="aries" />
        <SignCard signKey="taurus" />
        <SignCard signKey="gemini" />

        {/* Summer Signs */}
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 mt-6">☀️ Summer Signs (Personal Expression)</div>
        <SignCard signKey="cancer" />
        <SignCard signKey="leo" />
        <SignCard signKey="virgo" />

        {/* Autumn Signs */}
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 mt-6">🍂 Autumn Signs (Relationship Development)</div>
        <SignCard signKey="libra" />
        <SignCard signKey="scorpio" />
        <SignCard signKey="sagittarius" />

        {/* Winter Signs */}
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 mt-6">❄️ Winter Signs (Collective Contribution)</div>
        <SignCard signKey="capricorn" />
        <SignCard signKey="aquarius" />
        <SignCard signKey="pisces" />
      </div>
    </CollapsibleSection>

    {/* How to Read Signs */}
    <CollapsibleSection title="How to Read Signs in Your Chart" icon="📖">
      <ol className="space-y-3 text-sm">
        <li className="flex gap-3">
          <span className="text-cyan-400 font-bold">1.</span>
          <span className="text-slate-300"><strong>Find your "Big Three":</strong> Sun sign (identity), Moon sign (emotions), Ascendant/Rising (appearance)</span>
        </li>
        <li className="flex gap-3">
          <span className="text-cyan-400 font-bold">2.</span>
          <span className="text-slate-300"><strong>Look at personal planets:</strong> Mercury (communication), Venus (love), Mars (action)</span>
        </li>
        <li className="flex gap-3">
          <span className="text-cyan-400 font-bold">3.</span>
          <span className="text-slate-300"><strong>Notice dominant elements:</strong> Count planets in Fire/Earth/Air/Water—this shows your primary nature</span>
        </li>
        <li className="flex gap-3">
          <span className="text-cyan-400 font-bold">4.</span>
          <span className="text-slate-300"><strong>Notice dominant modality:</strong> Count Cardinal/Fixed/Mutable—this shows your action style</span>
        </li>
        <li className="flex gap-3">
          <span className="text-cyan-400 font-bold">5.</span>
          <span className="text-slate-300"><strong>Synthesize:</strong> Combine WHAT (planets) + HOW (signs) + WHERE (houses) for the complete picture</span>
        </li>
      </ol>
      <ExampleBox>
        <strong>Example:</strong> Sun in Gemini (curious identity) + Moon in Cancer (nurturing emotions) + Leo Rising (confident appearance) =
        A curious communicator who feels deeply and presents confidently. You're ALL THREE, not just one!
      </ExampleBox>
    </CollapsibleSection>

    {/* Next Steps */}
    <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg p-6 border border-cyan-500/30">
      <h3 className="text-xl font-bold text-cyan-400 mb-3">Foundation Complete!</h3>
      <p className="text-slate-300 mb-4">
        You now understand the 12 zodiac signs—the FLAVORS that color planetary energies.
        Next, explore the <strong className="text-amber-400">Houses</strong> to learn WHERE these energies express in your life.
      </p>
      <div className="flex flex-wrap gap-2">
        <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">Tab 0: What Are Houses?</span>
        <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">Tabs 1-12: House Details</span>
      </div>
    </div>
  </div>
);

// ============================================================================
// Tab 0.5 Content - "The Fractal Zone System"
// Understanding degrees within signs - the precision layer
// ============================================================================

const TabZonesContent: React.FC = () => (
  <div className="space-y-6">
    {/* What Are Zones? */}
    <CollapsibleSection title="What Are Zones?" icon="🔬" defaultOpen={true}>
      <p className="text-lg text-slate-200 mb-4">
        <strong className="text-amber-400">Each 30° sign contains internal structure — a fractal pattern that reveals precision.</strong>
      </p>
      <p className="text-slate-300 mb-4">
        You already know each zodiac sign occupies 30° of the circle. But those 30° are NOT uniform.
        <strong className="text-amber-400"> Aries at 2° feels different than Aries at 28°</strong> — both are Aries, but at different stages of the Aries journey.
      </p>
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
        <p className="text-amber-300 font-medium mb-2">The 6-Zone System:</p>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-slate-800/50 p-2 rounded text-center">
            <div className="text-green-400 font-bold">Zone 1-2</div>
            <div className="text-slate-400 text-xs">0° - 10°</div>
            <div className="text-green-300 text-xs">Beginning</div>
          </div>
          <div className="bg-slate-800/50 p-2 rounded text-center">
            <div className="text-cyan-400 font-bold">Zone 3-4</div>
            <div className="text-slate-400 text-xs">10° - 20°</div>
            <div className="text-cyan-300 text-xs">Core</div>
          </div>
          <div className="bg-slate-800/50 p-2 rounded text-center">
            <div className="text-purple-400 font-bold">Zone 5-6</div>
            <div className="text-slate-400 text-xs">20° - 30°</div>
            <div className="text-purple-300 text-xs">Transition</div>
          </div>
        </div>
      </div>
      <p className="text-slate-400 text-sm">
        <strong>Why 5° zones?</strong> Small enough for meaningful precision, large enough to avoid overwhelming complexity.
        Each 5° zone groups into 3 meta-phases (2 zones each), creating a natural journey through each sign.
      </p>
    </CollapsibleSection>

    {/* The Three Meta-Phases */}
    <CollapsibleSection title="The Three Meta-Phases" icon="🌀">
      <p className="text-slate-300 mb-4">
        Every sign follows the same internal journey: <strong className="text-amber-400">Beginning → Core → Transition</strong>
      </p>

      {/* Beginning Meta-Phase */}
      <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg mb-4">
        <h4 className="text-green-400 font-bold mb-3 text-lg">🌱 BEGINNING (Zones 1-2, 0°-10°)</h4>
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-green-300 font-medium">Zone 1 (0°-5°): The Birth</p>
              <ul className="text-slate-400 text-xs space-y-1 mt-1">
                <li>• First contact with sign energy</li>
                <li>• Enthusiastic but awkward</li>
                <li>• Overcompensating, trying too hard</li>
                <li>• "Am I doing this right?"</li>
              </ul>
            </div>
            <div>
              <p className="text-green-300 font-medium">Zone 2 (5°-10°): The Student</p>
              <ul className="text-slate-400 text-xs space-y-1 mt-1">
                <li>• Growing confidence</li>
                <li>• Still learning but less awkward</li>
                <li>• Experimenting with expression</li>
                <li>• "I'm getting better at this"</li>
              </ul>
            </div>
          </div>
          <div className="bg-green-500/5 p-2 rounded mt-2">
            <p className="text-green-200 text-xs">
              <strong>Theme:</strong> INITIATION — Learning the sign's lessons. Fresh, enthusiastic, pure but unrefined.
            </p>
          </div>
        </div>
      </div>

      {/* Core Meta-Phase */}
      <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 rounded-lg mb-4">
        <h4 className="text-cyan-400 font-bold mb-3 text-lg">💎 CORE (Zones 3-4, 10°-20°)</h4>
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-cyan-300 font-medium">Zone 3 (10°-15°): The Practitioner</p>
              <ul className="text-slate-400 text-xs space-y-1 mt-1">
                <li>• Natural expression emerging</li>
                <li>• Comfortable being this sign</li>
                <li>• Others recognize authenticity</li>
                <li>• "This is just who I am"</li>
              </ul>
            </div>
            <div>
              <p className="text-cyan-300 font-medium">Zone 4 (15°-20°): The Master</p>
              <ul className="text-slate-400 text-xs space-y-1 mt-1">
                <li>• MAXIMUM POWER of the sign</li>
                <li>• Textbook perfect expression</li>
                <li>• Natural authority and mastery</li>
                <li>• "I AM the archetype"</li>
              </ul>
            </div>
          </div>
          <div className="bg-cyan-500/5 p-2 rounded mt-2">
            <p className="text-cyan-200 text-xs">
              <strong>Theme:</strong> MASTERY — Peak expression. When astrology describes "Aries," they mean Aries Zone 3-4.
            </p>
          </div>
        </div>
      </div>

      {/* Transition Meta-Phase */}
      <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
        <h4 className="text-purple-400 font-bold mb-3 text-lg">🌉 TRANSITION (Zones 5-6, 20°-30°)</h4>
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-purple-300 font-medium">Zone 5 (20°-25°): The Teacher</p>
              <ul className="text-slate-400 text-xs space-y-1 mt-1">
                <li>• Mastered sign deeply</li>
                <li>• Beginning to question limits</li>
                <li>• Can teach others about this sign</li>
                <li>• "What lies beyond?"</li>
              </ul>
            </div>
            <div>
              <p className="text-purple-300 font-medium">Zone 6 (25°-30°): The Bridge</p>
              <ul className="text-slate-400 text-xs space-y-1 mt-1">
                <li>• Strong pull from NEXT sign</li>
                <li>• Bridging two energies</li>
                <li>• Complex expression</li>
                <li>• "I'm both/and now"</li>
              </ul>
            </div>
          </div>
          <div className="bg-purple-500/5 p-2 rounded mt-2">
            <p className="text-purple-200 text-xs">
              <strong>Theme:</strong> WISDOM — Preparing for transformation. Often the wisest placements, seeing beyond limits.
            </p>
          </div>
        </div>
      </div>
    </CollapsibleSection>

    {/* Why Precision Matters */}
    <CollapsibleSection title="Why Precision Matters" icon="🎯">
      <p className="text-slate-300 mb-4">
        Two people with "Sun in Aries" can express very differently based on their zone:
      </p>
      <div className="space-y-3">
        <div className="bg-green-500/10 border border-green-500/30 p-3 rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="text-green-400 font-bold">Sun at 3° Aries (Zone 1)</span>
            <span className="text-xs text-slate-500">Beginning</span>
          </div>
          <p className="text-slate-400 text-sm">
            "I'm <strong>LEARNING</strong> to be bold!" — Tries hard to prove fearlessness. May overcompensate, be pushy.
            Still figuring out healthy assertion vs aggression.
          </p>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 p-3 rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="text-cyan-400 font-bold">Sun at 15° Aries (Zone 4)</span>
            <span className="text-xs text-slate-500">Core</span>
          </div>
          <p className="text-slate-400 text-sm">
            "I <strong>AM</strong> courageous naturally." — Doesn't think about being brave, just acts.
            Balanced aggression, natural leader. Others see them as quintessential Aries.
          </p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-400 font-bold">Sun at 27° Aries (Zone 6)</span>
            <span className="text-xs text-slate-500">Transition</span>
          </div>
          <p className="text-slate-400 text-sm">
            "I've <strong>MASTERED</strong> courage — now what about patience?" — Wise about when to fight, when to rest.
            Beginning to feel Taurus energy. Can teach others about healthy assertion.
          </p>
        </div>
      </div>
      <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <p className="text-amber-300 text-sm">
          <strong>This is why GENESIS is different:</strong> We don't just know WHAT sign you're in —
          we know WHERE in that sign's journey you are.
        </p>
      </div>
    </CollapsibleSection>

    {/* The Complete Pattern */}
    <CollapsibleSection title="The Complete Pattern: 72 Positions" icon="🌐">
      <p className="text-slate-300 mb-4">
        12 Signs × 6 Zones = <strong className="text-amber-400">72 Constitutional Positions</strong>
      </p>
      <div className="space-y-2">
        {[
          { sign: 'Aries', symbol: '♈', element: 'Fire', beginning: 'Raw warrior, learning courage', core: 'Natural leader, peak assertion', transition: 'Wise pioneer, sensing Taurus stability' },
          { sign: 'Taurus', symbol: '♉', element: 'Earth', beginning: 'Building security, acquiring aggressively', core: 'Stable foundation, peak reliability', transition: 'Secured comfort, sensing Gemini curiosity' },
          { sign: 'Gemini', symbol: '♊', element: 'Air', beginning: 'Scattered curiosity, learning communication', core: 'Master communicator, peak versatility', transition: 'Wise messenger, sensing Cancer emotions' },
          { sign: 'Cancer', symbol: '♋', element: 'Water', beginning: 'Raw emotions, learning to nurture', core: 'Natural mother, peak protection', transition: 'Wise nurturer, sensing Leo expression' },
          { sign: 'Leo', symbol: '♌', element: 'Fire', beginning: 'Trying to shine, learning performance', core: 'Natural star, peak creativity', transition: 'Confident creator, sensing Virgo refinement' },
          { sign: 'Virgo', symbol: '♍', element: 'Earth', beginning: 'Hypercritical, learning analysis', core: 'Master craftsperson, peak precision', transition: 'Wise servant, sensing Libra balance' },
          { sign: 'Libra', symbol: '♎', element: 'Air', beginning: 'People-pleasing, learning diplomacy', core: 'Natural mediator, peak harmony', transition: 'Wise partner, sensing Scorpio depth' },
          { sign: 'Scorpio', symbol: '♏', element: 'Water', beginning: 'Raw intensity, learning transformation', core: 'Phoenix master, peak power', transition: 'Wise alchemist, sensing Sagittarius wisdom' },
          { sign: 'Sagittarius', symbol: '♐', element: 'Fire', beginning: 'Reckless explorer, learning philosophy', core: 'Natural teacher, peak expansion', transition: 'Wise seeker, sensing Capricorn structure' },
          { sign: 'Capricorn', symbol: '♑', element: 'Earth', beginning: 'Ambitious climber, learning discipline', core: 'Master builder, peak achievement', transition: 'Wise elder, sensing Aquarius innovation' },
          { sign: 'Aquarius', symbol: '♒', element: 'Air', beginning: 'Rebellious outsider, learning innovation', core: 'Natural revolutionary, peak vision', transition: 'Wise visionary, sensing Pisces transcendence' },
          { sign: 'Pisces', symbol: '♓', element: 'Water', beginning: 'Lost in dreams, learning compassion', core: 'Natural mystic, peak spirituality', transition: 'Wise transcendent, sensing Aries rebirth' },
        ].map((item) => (
          <ZonePatternCard key={item.sign} {...item} />
        ))}
      </div>
      <p className="text-amber-400 text-sm mt-4 text-center">
        After Pisces Zone 6 dissolves back to source, <strong>Aries Zone 1 is born again</strong> — the eternal cycle continues!
      </p>
    </CollapsibleSection>

    {/* How to Find Your Zones */}
    <CollapsibleSection title="How to Find Your Zones" icon="🔍">
      <ol className="space-y-3 text-sm">
        <li className="flex gap-3">
          <span className="text-amber-400 font-bold">1.</span>
          <span className="text-slate-300">
            <strong>Look at the degree</strong> — Your placement shows degrees (e.g., "Sun at 15° Aries")
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-amber-400 font-bold">2.</span>
          <span className="text-slate-300">
            <strong>Determine the zone</strong> — Divide by 5: 0-5° = Zone 1, 5-10° = Zone 2, etc.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-amber-400 font-bold">3.</span>
          <span className="text-slate-300">
            <strong>Identify meta-phase</strong> — Zones 1-2 = Beginning, 3-4 = Core, 5-6 = Transition
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-amber-400 font-bold">4.</span>
          <span className="text-slate-300">
            <strong>Apply to all placements</strong> — Check Sun, Moon, Ascendant, Venus, Mars zones
          </span>
        </li>
      </ol>
      <div className="mt-4 bg-slate-800/50 p-4 rounded-lg">
        <p className="text-amber-400 font-medium mb-2">Quick Reference:</p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="text-green-400">0°-5°</div>
            <div className="text-slate-500">Zone 1</div>
          </div>
          <div className="text-center">
            <div className="text-green-400">5°-10°</div>
            <div className="text-slate-500">Zone 2</div>
          </div>
          <div className="text-center">
            <div className="text-cyan-400">10°-15°</div>
            <div className="text-slate-500">Zone 3</div>
          </div>
          <div className="text-center">
            <div className="text-cyan-400">15°-20°</div>
            <div className="text-slate-500">Zone 4</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400">20°-25°</div>
            <div className="text-slate-500">Zone 5</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400">25°-30°</div>
            <div className="text-slate-500">Zone 6</div>
          </div>
        </div>
      </div>
    </CollapsibleSection>

    {/* Sign-Specific Zone Details - Autumn Signs */}
    <CollapsibleSection title="Autumn Signs: Detailed Zone Breakdown" icon="🍂">
      <p className="text-slate-300 mb-4">
        Deep dive into how zones modify each Autumn sign (Libra, Scorpio, Sagittarius).
        Click any sign to see all 6 zones with characteristics, planetary modifiers, and examples.
      </p>
      <div className="space-y-3">
        {['libra', 'scorpio', 'sagittarius'].map((signKey) => {
          const signData = SIGN_ZONE_DETAILS[signKey];
          if (!signData) return null;
          return <SignZoneDetailCard key={signKey} signData={signData} />;
        })}
      </div>
    </CollapsibleSection>

    {/* Sign-Specific Zone Details - Winter Signs */}
    <CollapsibleSection title="Winter Signs: Detailed Zone Breakdown" icon="❄️">
      <p className="text-slate-300 mb-4">
        Deep dive into how zones modify each Winter sign (Capricorn, Aquarius, Pisces).
        Click any sign to see all 6 zones with characteristics, planetary modifiers, and examples.
      </p>
      <div className="space-y-3">
        {['capricorn', 'aquarius', 'pisces'].map((signKey) => {
          const signData = SIGN_ZONE_DETAILS[signKey];
          if (!signData) return null;
          return <SignZoneDetailCard key={signKey} signData={signData} />;
        })}
      </div>
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mt-4">
        <div className="text-purple-300 font-medium mb-2">🌀 Special: 29° Pisces — The Final Degree</div>
        <p className="text-slate-400 text-sm">
          When any planet is at 29° Pisces, it holds the ENTIRE zodiac journey: all 12 signs integrated into one moment.
          Complete dissolution preparing for complete rebirth — the mystic who has mastered surrender, now ready to become the warrior.
          The ultimate ending that IS the beginning. Death and birth in the same breath.
        </p>
      </div>
      <p className="text-amber-400 text-sm mt-4 text-center">
        🌱 Spring & ☀️ Summer sign zones coming soon!
      </p>
    </CollapsibleSection>

    {/* The Fractal Principle */}
    <CollapsibleSection title="The Fractal Principle" icon="✨">
      <p className="text-slate-300 mb-4">
        The same pattern repeats at every level — this is <strong className="text-amber-400">fractal architecture</strong>:
      </p>
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded">
          <div className="text-amber-400 font-medium mb-1">MACRO LEVEL (Year)</div>
          <p className="text-slate-400 text-sm">12 signs = 12 months. Spring → Summer → Autumn → Winter.</p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded">
          <div className="text-amber-400 font-medium mb-1">MESO LEVEL (Sign)</div>
          <p className="text-slate-400 text-sm">6 zones = internal phases. Beginning → Core → Transition within each sign.</p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded">
          <div className="text-amber-400 font-medium mb-1">MICRO LEVEL (Degrees)</div>
          <p className="text-slate-400 text-sm">Each 5° zone has subtle beginning/middle/end. (Advanced study)</p>
        </div>
      </div>
      <p className="text-amber-300 text-sm mt-4 text-center">
        Think of a year having months, months having weeks, weeks having days — <strong>same pattern, different scales</strong>.
      </p>
    </CollapsibleSection>

    {/* Next Steps */}
    <div className="bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-lg p-6 border border-amber-500/30">
      <h3 className="text-xl font-bold text-amber-400 mb-3">Precision Unlocked!</h3>
      <p className="text-slate-300 mb-4">
        You now understand the fractal zone system — how <strong className="text-cyan-400">72 constitutional positions</strong> emerge from 12 signs × 6 zones.
        This is the precision layer that makes GENESIS different.
      </p>
      <div className="flex flex-wrap gap-2">
        <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">Tab 0: Houses Foundation</span>
        <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">Tab 0.1: Zodiac Signs</span>
        <span className="px-2 py-1 bg-amber-500/30 rounded text-xs text-amber-300">✓ Tab 0.5: Zones</span>
        <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">Tabs 1-12: House Details</span>
      </div>
    </div>
  </div>
);

// Zone Pattern Card for the complete pattern section
const ZonePatternCard: React.FC<{
  sign: string;
  symbol: string;
  element: string;
  beginning: string;
  core: string;
  transition: string;
}> = ({ sign, symbol, element, beginning, core, transition }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const elementColor = {
    Fire: 'red',
    Earth: 'green',
    Air: 'cyan',
    Water: 'blue'
  }[element] || 'slate';

  return (
    <div className={`bg-${elementColor}-500/5 border border-${elementColor}-500/20 rounded-lg overflow-hidden`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-2 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{symbol}</span>
          <span className={`text-${elementColor}-400 font-medium`}>{sign}</span>
          <span className="text-xs text-slate-500">({element})</span>
        </div>
        <span className="text-slate-500 text-xs">{isExpanded ? '▼' : '▶'}</span>
      </button>
      {isExpanded && (
        <div className="px-3 pb-3 space-y-1 text-xs">
          <div className="flex gap-2">
            <span className="text-green-400 w-20">Beginning:</span>
            <span className="text-slate-400">{beginning}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-cyan-400 w-20">Core:</span>
            <span className="text-slate-400">{core}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-purple-400 w-20">Transition:</span>
            <span className="text-slate-400">{transition}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Sign Zone Detail Card - Shows all 6 zones for a sign with full details
const SignZoneDetailCard: React.FC<{ signData: SignZoneData }> = ({ signData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);

  const elementColor = {
    Fire: 'red',
    Earth: 'green',
    Air: 'cyan',
    Water: 'blue'
  }[signData.element] || 'slate';

  const getZoneColor = (zone: number) => {
    if (zone <= 2) return 'green';
    if (zone <= 4) return 'cyan';
    return 'purple';
  };

  return (
    <div className={`bg-${elementColor}-500/5 border border-${elementColor}-500/30 rounded-lg overflow-hidden`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{signData.symbol}</span>
          <div>
            <span className={`text-${elementColor}-400 font-bold`}>{signData.sign}</span>
            <span className="text-slate-500 text-xs ml-2">({signData.element} • {signData.modality})</span>
          </div>
        </div>
        <span className="text-slate-500">{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-3">
          <p className="text-slate-400 text-sm italic">{signData.essence}</p>

          {/* Zone Tabs */}
          <div className="flex gap-1 flex-wrap">
            {signData.zones.map((zone) => (
              <button
                key={zone.zone}
                onClick={() => setSelectedZone(selectedZone === zone.zone ? null : zone.zone)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  selectedZone === zone.zone
                    ? `bg-${getZoneColor(zone.zone)}-500 text-white`
                    : `bg-slate-700 text-${getZoneColor(zone.zone)}-400 hover:bg-slate-600`
                }`}
              >
                Z{zone.zone} ({zone.degrees})
              </button>
            ))}
          </div>

          {/* Selected Zone Details */}
          {selectedZone && (
            <div className={`bg-${getZoneColor(selectedZone)}-500/10 border border-${getZoneColor(selectedZone)}-500/30 rounded-lg p-3 mt-2`}>
              {(() => {
                const zone = signData.zones.find(z => z.zone === selectedZone);
                if (!zone) return null;
                return (
                  <div className="space-y-3">
                    <div>
                      <div className={`text-${getZoneColor(selectedZone)}-400 font-bold`}>
                        Zone {zone.zone}: {zone.name}
                      </div>
                      <div className="text-amber-400 text-xs mt-1">{zone.coreQuality}</div>
                    </div>

                    <div>
                      <div className="text-slate-500 text-xs uppercase mb-1">Characteristics</div>
                      <ul className="space-y-1">
                        {zone.characteristics.map((c, i) => (
                          <li key={i} className="text-slate-300 text-xs">• {c}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div className="bg-slate-800/50 p-2 rounded">
                        <span className="text-yellow-400">☉ Sun:</span>
                        <span className="text-slate-400 ml-1">{zone.sunModifier}</span>
                      </div>
                      <div className="bg-slate-800/50 p-2 rounded">
                        <span className="text-slate-300">☽ Moon:</span>
                        <span className="text-slate-400 ml-1">{zone.moonModifier}</span>
                      </div>
                      <div className="bg-slate-800/50 p-2 rounded">
                        <span className="text-purple-400">↑ ASC:</span>
                        <span className="text-slate-400 ml-1">{zone.ascendantModifier}</span>
                      </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded">
                      <div className="text-amber-400 text-xs mb-1">Real-World Example:</div>
                      <p className="text-slate-300 text-xs italic">{zone.example}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {!selectedZone && (
            <p className="text-slate-500 text-xs text-center py-2">
              Click a zone button above to see detailed characteristics
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// House Tab Content (1-12)
const TabHouseContent: React.FC<{ houseNum: number }> = ({ houseNum }) => {
  const data = HOUSE_DATA[houseNum];
  if (!data) return <div>House data not found</div>;

  const signData = SIGN_RULERS[data.naturalSign];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold text-cyan-400">{data.title}</h1>
        <p className="text-lg text-slate-400 mt-1">{data.subtitle}</p>
        <div className="flex gap-4 mt-3">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
            {data.keyword}
          </span>
          <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">
            Natural Sign: {signData.symbol} {data.naturalSign}
          </span>
          <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">
            Natural Ruler: {signData.ruler}
          </span>
        </div>
      </div>

      {/* Life Areas */}
      <CollapsibleSection title="What This House Governs" icon="🎯" defaultOpen={true}>
        <ul className="grid grid-cols-2 gap-2">
          {data.lifeAreas.map((area, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-cyan-400">•</span>
              <span className="text-slate-300">{area}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-purple-400 font-medium mb-2">Questions This House Answers:</p>
          <div className="flex flex-wrap gap-2">
            {data.questions.map((q, i) => (
              <span key={i} className="px-3 py-1 bg-purple-500/10 text-purple-300 rounded text-sm">
                {q}
              </span>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* Who Can Rule This House */}
      <CollapsibleSection title="Who Can Rule This House?" icon="👑">
        <p className="text-slate-300 mb-4">
          Any sign can be on the {ordinal(houseNum)} house cusp — it depends on your Ascendant.
          Here's how each ruler changes the flavor:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(SIGN_RULERS).map(([sign, sr]) => (
            <div key={sign} className="flex items-center gap-2 p-2 bg-slate-800/50 rounded text-sm">
              <span className="text-lg">{sr.symbol}</span>
              <span className="text-slate-300">{sign}</span>
              <span className="text-slate-500">→</span>
              <span className="text-purple-400">{sr.ruler}</span>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Planets in This House */}
      <CollapsibleSection title="Planets in This House" icon="🪐" defaultOpen={houseNum === 1}>
        <p className="text-slate-300 mb-4">
          When planets occupy House {houseNum}, they bring their energy to {data.subtitle.toLowerCase()}:
        </p>
        {houseNum === 1 && (
          <p className="text-cyan-400 text-sm mb-4 bg-cyan-500/10 p-3 rounded-lg border border-cyan-500/20">
            💡 Click any planet below to expand and learn the full educational content including characteristics, challenges, gifts, and zone variations.
          </p>
        )}
        <div className="space-y-3">
          {/* Personal Planets */}
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 mt-4">Personal Planets</div>
          <PlanetCard planetKey="sun" houseNum={houseNum} />
          <PlanetCard planetKey="moon" houseNum={houseNum} />
          <PlanetCard planetKey="mercury" houseNum={houseNum} />
          <PlanetCard planetKey="venus" houseNum={houseNum} />
          <PlanetCard planetKey="mars" houseNum={houseNum} />

          {/* Social Planets */}
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 mt-6">Social Planets</div>
          <PlanetCard planetKey="jupiter" houseNum={houseNum} />
          <PlanetCard planetKey="saturn" houseNum={houseNum} />

          {/* Transpersonal Planets */}
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 mt-6">Transpersonal Planets</div>
          <PlanetCard planetKey="uranus" houseNum={houseNum} />
          <PlanetCard planetKey="neptune" houseNum={houseNum} />
          <PlanetCard planetKey="pluto" houseNum={houseNum} />

          {/* Lunar Nodes */}
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 mt-6">Lunar Nodes (Karmic Axis)</div>
          <PlanetCard planetKey="northNode" houseNum={houseNum} />
          <PlanetCard planetKey="southNode" houseNum={houseNum} />
        </div>
      </CollapsibleSection>

      {/* How to Read This House */}
      <CollapsibleSection title="How to Read This House" icon="📖">
        <ol className="space-y-3 text-sm">
          <li className="flex gap-3">
            <span className="text-cyan-400 font-bold">1.</span>
            <span className="text-slate-300">Check the sign on the {ordinal(houseNum)} house cusp — this is the FLAVOR</span>
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-400 font-bold">2.</span>
            <span className="text-slate-300">Find that sign's ruler — this planet MANAGES House {houseNum}</span>
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-400 font-bold">3.</span>
            <span className="text-slate-300">See which house the ruler occupies — this CONNECTS life areas</span>
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-400 font-bold">4.</span>
            <span className="text-slate-300">Note any planets IN House {houseNum} — these ADD specific energies</span>
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-400 font-bold">5.</span>
            <span className="text-slate-300">Check aspects to the ruler — these MODIFY how it operates</span>
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-400 font-bold">6.</span>
            <span className="text-slate-300">Synthesize the story — WHAT (planets) + HOW (signs) + WHERE (houses)</span>
          </li>
        </ol>
      </CollapsibleSection>
    </div>
  );
};

// Planet Card Component - Expandable educational content
const PlanetCard: React.FC<{ planetKey: string; houseNum: number }> = ({ planetKey, houseNum }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // For now, only House 1 has full content
  const content = houseNum === 1 ? PLANETS_IN_HOUSE_1[planetKey] : null;

  if (!content) {
    // Fallback for houses 2-12 (simple display until content is added)
    const basicPlanets: Record<string, { symbol: string; name: string }> = {
      sun: { symbol: '☉', name: 'Sun' },
      moon: { symbol: '☽', name: 'Moon' },
      mercury: { symbol: '☿', name: 'Mercury' },
      venus: { symbol: '♀', name: 'Venus' },
      mars: { symbol: '♂', name: 'Mars' },
      jupiter: { symbol: '♃', name: 'Jupiter' },
      saturn: { symbol: '♄', name: 'Saturn' },
      uranus: { symbol: '♅', name: 'Uranus' },
      neptune: { symbol: '♆', name: 'Neptune' },
      pluto: { symbol: '♇', name: 'Pluto' },
      northNode: { symbol: '☊', name: 'North Node' },
      southNode: { symbol: '☋', name: 'South Node' },
    };
    const basic = basicPlanets[planetKey];
    if (!basic) return null;

    return (
      <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700">
        <span className="text-2xl w-10 text-center">{basic.symbol}</span>
        <span className="text-purple-400 font-medium">{basic.name}</span>
        <span className="text-slate-400 text-sm">in House {houseNum}</span>
      </div>
    );
  }

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/20">
      {/* Clickable Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{content.symbol}</span>
          <div>
            <span className="text-cyan-400 font-bold">{content.name} in House 1</span>
            <span className="text-slate-400 mx-2">—</span>
            <span className="text-amber-400 italic">"{content.archetype}"</span>
          </div>
        </div>
        <span className="text-slate-400 text-xl">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {/* Quick Summary - Always Visible */}
      <div className="px-4 pb-3 text-slate-300 text-sm border-t border-slate-700/50 pt-3">
        {content.quickSummary}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-700 p-4 space-y-5 bg-slate-900/30">

          {/* 5W+H+Emotion Framework */}
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
            <h4 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
              <span>📋</span> 5W+H+EMOTION Framework
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div><span className="text-yellow-400 font-medium">WHO:</span> <span className="text-slate-300">{content.fiveW.who}</span></div>
              <div><span className="text-yellow-400 font-medium">WHAT:</span> <span className="text-slate-300">{content.fiveW.what}</span></div>
              <div><span className="text-yellow-400 font-medium">WHEN:</span> <span className="text-slate-300">{content.fiveW.when}</span></div>
              <div><span className="text-yellow-400 font-medium">WHERE:</span> <span className="text-slate-300">{content.fiveW.where}</span></div>
              <div className="md:col-span-2"><span className="text-yellow-400 font-medium">WHY:</span> <span className="text-slate-300">{content.fiveW.why}</span></div>
              <div className="md:col-span-2"><span className="text-yellow-400 font-medium">HOW:</span> <span className="text-slate-300">{content.fiveW.how}</span></div>
              <div className="md:col-span-2"><span className="text-amber-400 font-medium">EMOTION:</span> <span className="text-amber-300 italic">{content.fiveW.emotion}</span></div>
            </div>
          </div>

          {/* Characteristics */}
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
            <h4 className="text-green-400 font-bold mb-3 flex items-center gap-2">
              <span>✓</span> CHARACTERISTICS
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
              {content.characteristics.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Challenges */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
            <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">
              <span>⚠</span> CHALLENGES
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
              {content.challenges.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Gifts */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
            <h4 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
              <span>⭐</span> GIFTS
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
              {content.gifts.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Real-World Example */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
              <span>💡</span> REAL-WORLD EXAMPLE
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">{content.realWorldExample}</p>
          </div>

          {/* Zone Variations */}
          <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
            <h4 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
              <span>🎯</span> ZONE VARIATIONS
            </h4>
            <div className="space-y-3 text-sm">
              <div className="bg-slate-800/50 p-3 rounded">
                <div className="text-purple-300 font-medium mb-1">{content.zoneVariations.beginning.title}</div>
                <p className="text-slate-400 mb-1">{content.zoneVariations.beginning.description}</p>
                <p className="text-purple-400 italic">{content.zoneVariations.beginning.emotion}</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded">
                <div className="text-purple-300 font-medium mb-1">{content.zoneVariations.core.title}</div>
                <p className="text-slate-400 mb-1">{content.zoneVariations.core.description}</p>
                <p className="text-purple-400 italic">{content.zoneVariations.core.emotion}</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded">
                <div className="text-purple-300 font-medium mb-1">{content.zoneVariations.transition.title}</div>
                <p className="text-slate-400 mb-1">{content.zoneVariations.transition.description}</p>
                <p className="text-purple-400 italic">{content.zoneVariations.transition.emotion}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper: ordinal numbers
const ordinal = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// Main Component
export const HouseLearningPanel: React.FC<HouseLearningPanelProps> = ({
  houseNumber,
  onClose,
  chartData
}) => {
  const [activeTab, setActiveTab] = useState<TabValue>(houseNumber === 0 ? 'intro' : houseNumber);
  const [position, setPosition] = useState({ x: 100, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  // Dragging handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setIsDragging(true);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    };
    const handleUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, dragOffset]);

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="fixed bg-slate-900 border-2 border-cyan-500 rounded-xl shadow-2xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '50vw',
        minWidth: '500px',
        maxWidth: '800px',
        maxHeight: '85vh',
        zIndex: 1000,
      }}
    >
      {/* Header - Draggable */}
      <div
        className="bg-slate-800 p-4 border-b border-cyan-500/50 flex justify-between items-center cursor-grab active:cursor-grabbing rounded-t-xl"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <span className="text-slate-500">⋮⋮</span>
          <h2 className="text-xl font-bold text-cyan-400">Western Zodiac House Learning</h2>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-red-400 text-xl transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800/50 border-b border-slate-700 overflow-x-auto p-2 flex gap-1">
        {/* Foundation Tabs */}
        <button
          onClick={() => setActiveTab('intro')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'intro'
              ? 'bg-cyan-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Intro
        </button>
        <button
          onClick={() => setActiveTab('signs')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'signs'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Signs
        </button>
        <button
          onClick={() => setActiveTab('zones')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'zones'
              ? 'bg-amber-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Zones
        </button>
        <div className="w-px bg-slate-600 mx-1" /> {/* Divider */}
        {/* House Tabs */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
          <button
            key={n}
            onClick={() => setActiveTab(n)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === n
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            H{n}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        className="overflow-y-auto p-6 text-white"
        style={{ maxHeight: 'calc(85vh - 140px)' }}
      >
        {activeTab === 'intro' && <Tab0Content />}
        {activeTab === 'signs' && <TabSignsContent />}
        {activeTab === 'zones' && <TabZonesContent />}
        {typeof activeTab === 'number' && <TabHouseContent houseNum={activeTab} />}
      </div>

      {/* Footer */}
      <div className="bg-slate-800/50 border-t border-slate-700 p-3 text-center text-sm text-slate-400 rounded-b-xl">
        Drag header to move • Press ESC to close
      </div>
    </div>
  );
};

export default HouseLearningPanel;
