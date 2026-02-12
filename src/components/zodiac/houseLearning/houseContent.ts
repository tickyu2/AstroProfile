// ============================================================================
// HOUSE LEARNING PANEL — House Education Content
// HOUSE_DATA (12 houses) and PLANETS_IN_HOUSE_1 (planet meanings)
// ============================================================================

import type { PlanetContent } from './types';

// House data for tabs 1-12
export const HOUSE_DATA: Record<number, {
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
export const PLANETS_IN_HOUSE_1: Record<string, PlanetContent> = {
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
