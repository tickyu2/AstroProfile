/**
 * Saturn Journey Constants
 *
 * Core constants for the Saturn Journey module - the psychological backbone
 * that tracks how fear, limitation, authority, and responsibility evolve
 * into mastery, wisdom, and inner authority over time.
 *
 * Based on Liz Greene's approach to Saturn as the place where
 * the soul must grow up.
 *
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// SATURN ORBITAL CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const SATURN_ORBIT_YEARS = 29.4571;

// ═══════════════════════════════════════════════════════════════════════════
// SATURN PHASES
// Windows are deliberately forgiving: psychological "weather", not prediction
// ═══════════════════════════════════════════════════════════════════════════

export const SATURN_PHASES = [
  {
    key: 'first_square',
    label: 'First Saturn Square',
    exactAgeYears: SATURN_ORBIT_YEARS / 4,
    ageWindowYears: [6.0, 8.5],
    coreQuestion: 'Can I handle responsibility?',
    psychologicalTask: 'Learn rules, limits, and self-discipline without shame swallowing the self.',
    lifeThemes: ['School begins', 'Authority outside family', 'First encounters with judgment'],
    typicalChallenges: ['Performance anxiety', 'Fear of failure', 'Separation from parents']
  },
  {
    key: 'opposition',
    label: 'Saturn Opposition',
    exactAgeYears: SATURN_ORBIT_YEARS / 2,
    ageWindowYears: [13.0, 15.5],
    coreQuestion: 'Who has authority over me?',
    psychologicalTask: 'Differentiate from external authority; discover personal standards.',
    lifeThemes: ['Adolescent rebellion', 'Testing limits', 'Identity formation'],
    typicalChallenges: ['Conflict with parents', 'Peer pressure', 'Insecurity masked as defiance']
  },
  {
    key: 'second_square',
    label: 'Second Saturn Square',
    exactAgeYears: (3 * SATURN_ORBIT_YEARS) / 4,
    ageWindowYears: [20.0, 23.5],
    coreQuestion: 'Am I capable on my own?',
    psychologicalTask: 'Test competence in the world; build real skills and real boundaries.',
    lifeThemes: ['Early career', 'Leaving home', 'First major commitments'],
    typicalChallenges: ['Imposter syndrome', 'Career uncertainty', 'Relationship commitment fears']
  },
  {
    key: 'return',
    label: 'Saturn Return',
    exactAgeYears: SATURN_ORBIT_YEARS,
    ageWindowYears: [28.0, 31.5],
    coreQuestion: 'What am I truly responsible for?',
    psychologicalTask: 'Stop proving; start choosing. Claim inner authority and long-term consequences.',
    lifeThemes: ['Career crystallization', 'Marriage/commitment decisions', 'Shedding false structures'],
    typicalChallenges: ['Quarter-life crisis', 'Relationship restructuring', 'Career pivots'],
    isInitiation: true
  },
  {
    key: 'second_opposition',
    label: 'Second Saturn Opposition',
    exactAgeYears: 1.5 * SATURN_ORBIT_YEARS,
    ageWindowYears: [43.0, 46.5],
    coreQuestion: 'Is this structure still alive?',
    psychologicalTask: 'Prune dead scaffolding; rebuild the life around what is essential and true.',
    lifeThemes: ['Midlife reckoning', 'Legacy questions', 'Time awareness'],
    typicalChallenges: ['Midlife crisis', 'Empty nest', 'Career plateau or pivot']
  },
  {
    key: 'second_return',
    label: 'Second Saturn Return',
    exactAgeYears: 2 * SATURN_ORBIT_YEARS,
    ageWindowYears: [58.0, 61.5],
    coreQuestion: 'What wisdom do I pass on?',
    psychologicalTask: 'Become the elder: consolidate mastery, transmit legacy, simplify without shrinking.',
    lifeThemes: ['Elderhood begins', 'Mentorship role', 'Final career chapter'],
    typicalChallenges: ['Retirement anxiety', 'Mortality awareness', 'Finding new purpose'],
    isInitiation: true
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// SATURN WOUND TYPES (by sign element/modality patterns)
// ═══════════════════════════════════════════════════════════════════════════

export const SATURN_WOUND_TYPES = {
  power: {
    label: 'Power Wound',
    signs: ['Aries', 'Leo', 'Scorpio'],
    description: 'Core fear around powerlessness, weakness, or being dominated',
    healingPath: 'Learning that true power includes vulnerability'
  },
  father: {
    label: 'Father Wound',
    signs: ['Leo', 'Capricorn', 'Aries'],
    description: 'Issues with paternal authority, recognition, and approval',
    healingPath: 'Becoming your own inner father'
  },
  worth: {
    label: 'Worth Wound',
    signs: ['Taurus', 'Virgo'],
    description: 'Core fear of being flawed, inadequate, or not good enough',
    healingPath: 'Learning inherent worth beyond performance'
  },
  voice: {
    label: 'Voice Wound',
    signs: ['Gemini'],
    description: 'Fear of being misunderstood, silenced, or mentally trapped',
    healingPath: 'Speaking truth without need for universal agreement'
  },
  mother: {
    label: 'Mother Wound',
    signs: ['Cancer', 'Pisces'],
    description: 'Issues with nurturing, safety, and emotional availability',
    healingPath: 'Becoming your own source of emotional security'
  },
  belonging: {
    label: 'Belonging Wound',
    signs: ['Libra', 'Aquarius'],
    description: 'Fear of rejection, exile, or not fitting in',
    healingPath: 'Finding belonging without self-betrayal'
  },
  betrayal: {
    label: 'Betrayal Wound',
    signs: ['Scorpio'],
    description: 'Deep fear of being betrayed, exposed, or destroyed',
    healingPath: 'Learning to trust selectively without closing completely'
  },
  meaning: {
    label: 'Meaning Wound',
    signs: ['Sagittarius'],
    description: 'Fear of meaninglessness, confinement, or hypocrisy',
    healingPath: 'Finding meaning that survives doubt'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// DEFENSE MECHANISM CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════

export const DEFENSE_CATEGORIES = {
  control: {
    label: 'Control Defenses',
    description: 'Attempting to manage anxiety through mastery of external factors',
    examples: ['Perfectionism', 'Overplanning', 'Micromanagement']
  },
  withdrawal: {
    label: 'Withdrawal Defenses',
    description: 'Creating distance to avoid emotional risk',
    examples: ['Emotional detachment', 'Isolation', 'Self-sufficiency']
  },
  performance: {
    label: 'Performance Defenses',
    description: 'Creating value through achievement to earn belonging',
    examples: ['Overworking', 'Achievement addiction', 'Role playing']
  },
  avoidance: {
    label: 'Avoidance Defenses',
    description: 'Escaping from difficult emotions or situations',
    examples: ['Distraction', 'Substance use', 'Endless movement']
  },
  appeasement: {
    label: 'Appeasement Defenses',
    description: 'Managing threat through pleasing others',
    examples: ['People-pleasing', 'Conflict avoidance', 'Self-erasure']
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// AUTHORITY DEVELOPMENT STAGES
// ═══════════════════════════════════════════════════════════════════════════

export const AUTHORITY_STAGES = {
  external: {
    label: 'External Authority',
    description: 'Authority rests with others; seeking approval and permission',
    developmental: 'Natural in childhood; problematic if persistent in adulthood'
  },
  rebellion: {
    label: 'Rebellion Against Authority',
    description: 'Rejecting external authority without claiming inner authority',
    developmental: 'Natural in adolescence; can become stuck pattern'
  },
  proving: {
    label: 'Proving Mode',
    description: 'Working to earn authority through achievement and competence',
    developmental: 'Common in early adulthood; exhausting if permanent'
  },
  claiming: {
    label: 'Claiming Inner Authority',
    description: 'Recognizing personal standards and accepting responsibility',
    developmental: 'Saturn Return threshold; ongoing integration work'
  },
  earned: {
    label: 'Earned Authority',
    description: 'Authority that comes from lived experience and integrated wisdom',
    developmental: 'Second Saturn Return territory; elder status'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// SOMATIC SATURN PATTERNS
// ═══════════════════════════════════════════════════════════════════════════

export const SATURN_SOMATIC_PATTERNS = {
  shoulders: 'Carrying too much; feeling burdened',
  knees: 'Fear of moving forward; inflexibility',
  teeth: 'Suppressed aggression; biting back words',
  skin: 'Boundary issues; feeling exposed or protected',
  bones: 'Structural integrity; feeling supported or unsupported',
  back: 'Support issues; literal and metaphorical',
  joints: 'Flexibility in structure; ability to adapt'
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  SATURN_ORBIT_YEARS,
  SATURN_PHASES,
  SATURN_WOUND_TYPES,
  DEFENSE_CATEGORIES,
  AUTHORITY_STAGES,
  SATURN_SOMATIC_PATTERNS
};
