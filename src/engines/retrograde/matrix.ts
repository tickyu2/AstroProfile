/**
 * Retrograde Behavioral Matrix (RBM)
 *
 * Complete behavioral profiles for all 8 retrograde planets.
 * Each profile defines internalization, decision, and synastry axes.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import type {
  Planet,
  PlanetState,
  RetrogradeProfile,
  DecisionContext,
  SynastryResult,
  InternalizationAxis,
  DecisionAxis,
  SynastryAxis
} from './types';

// ========================================
// HELPER: Find partner's planet
// ========================================

function findPartnerPlanet(partner: PlanetState[], planet: Planet): PlanetState | undefined {
  return partner.find(p => p.planet === planet);
}

// ========================================
// MERCURY RETROGRADE PROFILE
// ========================================

const MercuryRxProfile: RetrogradeProfile = {
  planet: 'Mercury',

  internalization: {
    domain: 'thinking, communication, perception',
    internalProcess: 'Thoughts recycle and reprocess before expression; mental loops and reconsideration',
    externalManifest: 'Appears thoughtful, sometimes hesitant; prefers written over spoken'
  },

  decision: {
    style: 'Reprocessing, nonlinear logic',
    tendency: 'Revisits decisions multiple times; thinks in spirals not lines',
    pitfall: 'Analysis paralysis; miscommunication when rushed',
    strength: 'Catches what others miss; excellent at review and revision'
  },

  synastry: {
    bonding: 'Mental intimacy through deep conversation; values partners who understand unspoken thoughts',
    friction: 'Partners who demand immediate, clear responses',
    resonance: 'Partners who enjoy mental loops and nuanced communication',
    projection: 'May project intellectual depth onto partners'
  },

  internalizationWeight: 0.2,

  decisionModifier: (ctx: DecisionContext): number => {
    // Mercury Rx struggles with communication-heavy decisions
    if (ctx.topic === 'communication') return -0.2;
    if (ctx.urgency > 0.8) return -0.15; // pressure worsens it
    return -0.05; // slight general hesitation
  },

  synastryModifier: (self: PlanetState, partner: PlanetState[]): SynastryResult => {
    const partnerMercury = findPartnerPlanet(partner, 'Mercury');

    if (!partnerMercury) {
      return { score: 0, friction: 0.1, resonance: 0.1, dynamic: 'neutral' };
    }

    // Both Rx = telepathic resonance
    if (self.isRetrograde && partnerMercury.isRetrograde) {
      return { score: 0.2, friction: 0.1, resonance: 0.3, dynamic: 'harmonious' };
    }

    // Rx + Direct = potential miscommunication
    if (self.isRetrograde && !partnerMercury.isRetrograde) {
      return { score: -0.1, friction: 0.25, resonance: 0.1, dynamic: 'challenging' };
    }

    return { score: 0.05, friction: 0.1, resonance: 0.15, dynamic: 'neutral' };
  },

  archetype: 'The Internal Processor',
  coreStatement: 'I think it through before I speak',

  behaviors: [
    'Thinks before speaking, often extensively',
    'Prefers written communication for important matters',
    'Mental loops and reconsideration are normal',
    'May appear hesitant but is actually thorough',
    'Excellent at catching errors others miss'
  ],

  strengths: [
    'Deep analytical thinking',
    'Excellent revision and editing skills',
    'Catches mistakes before they happen',
    'Rich internal mental life',
    'Thoughtful communication when given time'
  ],

  challenges: [
    'Can overthink simple decisions',
    'Miscommunication when rushed',
    'May appear uncertain to others',
    'Difficulty with on-the-spot verbal responses',
    'Mental loops can become rumination'
  ]
};

// ========================================
// VENUS RETROGRADE PROFILE
// ========================================

const VenusRxProfile: RetrogradeProfile = {
  planet: 'Venus',

  internalization: {
    domain: 'love, values, attraction, aesthetics',
    internalProcess: 'Affection and values develop privately; unconventional attraction patterns',
    externalManifest: 'May appear reserved in love; values depth over conventional romance'
  },

  decision: {
    style: 'Value-centered, unconventional criteria',
    tendency: 'Chooses based on internal value system, not social norms',
    pitfall: 'May reject good options that don\'t match internal ideal',
    strength: 'Authentic choices aligned with true values'
  },

  synastry: {
    bonding: 'Deep karmic bonds; attraction to the unconventional',
    friction: 'Partners who expect standard romance scripts',
    resonance: 'Partners who value depth, authenticity over form',
    projection: 'Projects idealized love onto partners; seeks "the one"'
  },

  internalizationWeight: 0.25,

  decisionModifier: (ctx: DecisionContext): number => {
    if (ctx.topic === 'relationship') return -0.1; // cautious in love
    if (ctx.emotionalWeight > 0.7) return -0.08;
    return -0.02;
  },

  synastryModifier: (self: PlanetState, partner: PlanetState[]): SynastryResult => {
    const partnerVenus = findPartnerPlanet(partner, 'Venus');

    if (!partnerVenus) {
      return { score: 0, friction: 0.1, resonance: 0.1, dynamic: 'neutral' };
    }

    // Both Venus Rx = karmic, deep bond
    if (self.isRetrograde && partnerVenus.isRetrograde) {
      return { score: 0.25, friction: 0.15, resonance: 0.4, dynamic: 'karmic' };
    }

    // Rx + Direct = mismatched love languages
    if (self.isRetrograde && !partnerVenus.isRetrograde) {
      return { score: -0.1, friction: 0.3, resonance: 0.15, dynamic: 'challenging' };
    }

    return { score: 0.1, friction: 0.1, resonance: 0.2, dynamic: 'complementary' };
  },

  archetype: 'The Deep Lover',
  coreStatement: 'I love in my own way',

  behaviors: [
    'Develops feelings privately before expressing',
    'Unconventional attraction patterns',
    'Values authenticity over appearance',
    'May revisit past relationships mentally',
    'Takes time to commit but goes deep when they do'
  ],

  strengths: [
    'Authentic love based on true values',
    'Depth and intensity in relationships',
    'Not swayed by superficial attraction',
    'Appreciates beauty in unexpected places',
    'Loyal once truly committed'
  ],

  challenges: [
    'Difficulty expressing affection conventionally',
    'May seem cold or reserved initially',
    'Past relationship patterns can resurface',
    'High standards based on internal ideal',
    'Can feel misunderstood in love'
  ]
};

// ========================================
// MARS RETROGRADE PROFILE
// ========================================

const MarsRxProfile: RetrogradeProfile = {
  planet: 'Mars',

  internalization: {
    domain: 'drive, anger, initiative, sexuality',
    internalProcess: 'Action impulses get processed internally; strategic rather than reactive',
    externalManifest: 'Appears calm but intensity builds; indirect action style'
  },

  decision: {
    style: 'Strategic timing, indirect action',
    tendency: 'Waits for optimal moment rather than acting immediately',
    pitfall: 'Suppressed anger can explode; missed opportunities from waiting',
    strength: 'Strategic, well-timed action with maximum effect'
  },

  synastry: {
    bonding: 'Slow-burn intensity; attraction through strategic pursuit',
    friction: 'Partners who push for immediate confrontation or action',
    resonance: 'Partners who appreciate strategic timing and depth',
    projection: 'Projects warrior energy; seeks partners who can handle intensity'
  },

  internalizationWeight: 0.25,

  decisionModifier: (ctx: DecisionContext): number => {
    if (ctx.urgency > 0.7) return -0.15; // doesn't do well with pressure
    if (ctx.topic === 'conflict') return -0.1;
    return -0.05;
  },

  synastryModifier: (self: PlanetState, partner: PlanetState[]): SynastryResult => {
    const partnerMars = findPartnerPlanet(partner, 'Mars');

    if (!partnerMars) {
      return { score: 0, friction: 0.1, resonance: 0.1, dynamic: 'neutral' };
    }

    // Both Mars Rx = mutual strategic understanding
    if (self.isRetrograde && partnerMars.isRetrograde) {
      return { score: 0.15, friction: 0.1, resonance: 0.25, dynamic: 'harmonious' };
    }

    // Rx + Direct = timing mismatch, sexual polarity inversion
    if (self.isRetrograde && !partnerMars.isRetrograde) {
      return { score: -0.1, friction: 0.25, resonance: 0.1, dynamic: 'challenging' };
    }

    return { score: 0.05, friction: 0.15, resonance: 0.15, dynamic: 'neutral' };
  },

  archetype: 'The Strategic Warrior',
  coreStatement: 'I strike when the time is right',

  behaviors: [
    'Processes anger internally before expressing',
    'Strategic rather than impulsive action',
    'Slow-burn intensity in pursuits',
    'Waits for optimal timing',
    'May appear passive but is calculating'
  ],

  strengths: [
    'Strategic timing and planning',
    'Controlled intensity',
    'Doesn\'t waste energy on unwinnable fights',
    'Deep reserves of endurance',
    'Effective indirect action'
  ],

  challenges: [
    'Suppressed anger can build and explode',
    'May miss opportunities by waiting too long',
    'Difficulty with direct confrontation',
    'Can seem passive or unmotivated',
    'Sexual expression may be complex'
  ]
};

// ========================================
// JUPITER RETROGRADE PROFILE
// ========================================

const JupiterRxProfile: RetrogradeProfile = {
  planet: 'Jupiter',

  internalization: {
    domain: 'beliefs, worldview, expansion, philosophy',
    internalProcess: 'Beliefs and philosophy develop from within; self-taught wisdom',
    externalManifest: 'Projects confidence based on internal conviction; may seem self-assured'
  },

  decision: {
    style: 'Self-authored philosophy, internal belief logic',
    tendency: 'Trusts personal conclusions over expert consensus',
    pitfall: 'May reject valid external input that contradicts internal truth',
    strength: 'Authentic beliefs not swayed by popular opinion'
  },

  synastry: {
    bonding: 'Values partners who accept personal worldview',
    friction: 'Partners who try to teach or correct beliefs',
    resonance: 'Partners who respect self-generated wisdom',
    projection: 'Projects teacher/guru role; seeks philosophical companions'
  },

  internalizationWeight: 0.35,

  decisionModifier: (_ctx: DecisionContext): number => {
    return 0.1; // trust internal belief = decisiveness boost
  },

  synastryModifier: (self: PlanetState, partner: PlanetState[]): SynastryResult => {
    const partnerJupiter = findPartnerPlanet(partner, 'Jupiter');

    if (!partnerJupiter) {
      return { score: 0, friction: 0.1, resonance: 0.1, dynamic: 'neutral' };
    }

    // Both Jupiter Rx = mutual respect for self-generated wisdom
    if (self.isRetrograde && partnerJupiter.isRetrograde) {
      return { score: 0.2, friction: 0.1, resonance: 0.3, dynamic: 'harmonious' };
    }

    // Rx + Direct = potential philosophy clash
    if (self.isRetrograde && !partnerJupiter.isRetrograde) {
      return { score: -0.1, friction: 0.2, resonance: 0.1, dynamic: 'challenging' };
    }

    return { score: 0.1, friction: 0.1, resonance: 0.2, dynamic: 'complementary' };
  },

  archetype: 'The Self-Taught Sage',
  coreStatement: 'I trust my own conclusions first',

  behaviors: [
    'Forms beliefs internally before seeking validation',
    'Relies on personal logic over expert consensus',
    'Acts from intuition and personal philosophy',
    'May reject advice contradicting internal truth',
    'Self-generated moral compass'
  ],

  strengths: [
    'Authentic, unswayed beliefs',
    'Independent philosophical thinking',
    'Not influenced by groupthink',
    'Deep inner wisdom',
    'Confidence from internal conviction'
  ],

  challenges: [
    'May dismiss valid external perspectives',
    'Can appear stubborn about beliefs',
    'Difficulty accepting teaching from others',
    'Self-righteousness when unchecked',
    'May miss beneficial expansion opportunities'
  ]
};

// ========================================
// SATURN RETROGRADE PROFILE
// ========================================

const SaturnRxProfile: RetrogradeProfile = {
  planet: 'Saturn',

  internalization: {
    domain: 'authority, rules, boundaries, discipline',
    internalProcess: 'Authority and rules are self-defined; resistance to external control',
    externalManifest: 'Appears self-governing; may challenge institutional structures'
  },

  decision: {
    style: 'Self-defined structure, internal rules',
    tendency: 'Creates own rules rather than following inherited ones',
    pitfall: 'May challenge necessary structures; tests boundaries excessively',
    strength: 'Self-disciplined, autonomous, doesn\'t need external authority'
  },

  synastry: {
    bonding: 'Commitment on own terms; nontraditional structures',
    friction: 'Partners who demand rigid structure or impose control',
    resonance: 'Partners who allow flexible boundaries',
    projection: 'Projects authority; may test partner\'s control'
  },

  internalizationWeight: 0.4,

  decisionModifier: (_ctx: DecisionContext): number => {
    return 0.1; // follow own rules = decisiveness boost
  },

  synastryModifier: (self: PlanetState, partner: PlanetState[]): SynastryResult => {
    const partnerSaturn = findPartnerPlanet(partner, 'Saturn');

    if (!partnerSaturn) {
      return { score: 0, friction: 0.1, resonance: 0.1, dynamic: 'neutral' };
    }

    // Both Saturn Rx = mutual respect for self-defined rules
    if (self.isRetrograde && partnerSaturn.isRetrograde) {
      return { score: 0.15, friction: 0.15, resonance: 0.25, dynamic: 'harmonious' };
    }

    // Rx + Direct = structure clash
    if (self.isRetrograde && !partnerSaturn.isRetrograde) {
      return { score: -0.15, friction: 0.3, resonance: 0.1, dynamic: 'challenging' };
    }

    return { score: 0.05, friction: 0.15, resonance: 0.15, dynamic: 'neutral' };
  },

  archetype: 'The Self-Sovereign',
  coreStatement: 'I follow my own rules, not yours',

  behaviors: [
    'Challenges rules that don\'t align with internal logic',
    'Creates own structure rather than accepting inherited ones',
    'Learns through trial and error, not instruction',
    'Tests limits to see what\'s enforceable',
    'Self-parents; doesn\'t easily accept external authority'
  ],

  strengths: [
    'Genuine self-discipline (not externally imposed)',
    'Autonomous authority',
    'Questions and improves structures',
    'Doesn\'t blindly follow rules',
    'Creates effective personal systems'
  ],

  challenges: [
    'May resist necessary authority',
    'Excessive boundary testing',
    'Difficulty with traditional institutions',
    'Can appear rebellious or defiant',
    'May reject helpful structure'
  ]
};

// ========================================
// URANUS RETROGRADE PROFILE
// ========================================

const UranusRxProfile: RetrogradeProfile = {
  planet: 'Uranus',

  internalization: {
    domain: 'rebellion, innovation, individuality, freedom',
    internalProcess: 'Revolutionary impulses process internally; private eccentricity',
    externalManifest: 'May appear conventional while being deeply unconventional inside'
  },

  decision: {
    style: 'Private innovation, internal revolution',
    tendency: 'Revolutionary thinking happens internally before external expression',
    pitfall: 'May suppress need for freedom until it erupts',
    strength: 'Thoughtful innovation; change is internalized before acted upon'
  },

  synastry: {
    bonding: 'Unpredictable, freedom-based bonding',
    friction: 'Partners who try to control or predict them',
    resonance: 'Partners who embrace freedom and unpredictability',
    projection: 'Projects revolutionary energy; seeks fellow rebels'
  },

  internalizationWeight: 0.3,

  decisionModifier: (ctx: DecisionContext): number => {
    if (ctx.riskTolerance > 0.5) return 0.15; // high risk tolerance + Uranus Rx = bold choices
    return 0.05;
  },

  synastryModifier: (_self: PlanetState, _partner: PlanetState[]): SynastryResult => {
    // Uranus Rx generally likes partners who tolerate change
    return { score: 0.1, friction: 0.15, resonance: 0.2, dynamic: 'complementary' };
  },

  archetype: 'The Inner Revolutionary',
  coreStatement: 'My revolution happens inside first',

  behaviors: [
    'Revolutionary thinking processed internally',
    'May appear conventional while thinking radically',
    'Sudden changes emerge from long internal processing',
    'Values freedom deeply but may not show it',
    'Private eccentricity'
  ],

  strengths: [
    'Thoughtful innovation',
    'Changes are well-considered before action',
    'Deep internal freedom',
    'Doesn\'t rebel just for attention',
    'Genuine individuality'
  ],

  challenges: [
    'Suppressed need for freedom can erupt suddenly',
    'May feel trapped while appearing content',
    'Difficulty expressing unique needs',
    'Can surprise others with sudden changes',
    'Internal restlessness'
  ]
};

// ========================================
// NEPTUNE RETROGRADE PROFILE
// ========================================

const NeptuneRxProfile: RetrogradeProfile = {
  planet: 'Neptune',

  internalization: {
    domain: 'imagination, fantasy, intuition, spirituality',
    internalProcess: 'Imagination and intuition turned inward; strong inner fantasy world',
    externalManifest: 'Rich inner life; may seem dreamy or distracted'
  },

  decision: {
    style: 'Symbolic, intuitive logic',
    tendency: 'Decisions influenced by inner imagery and symbolic meaning',
    pitfall: 'Can lose touch with practical reality; confusion',
    strength: 'Deep intuitive guidance; sees patterns others miss'
  },

  synastry: {
    bonding: 'Spiritual resonance; mythic narrative framing',
    friction: 'Partners who are too literal or practical',
    resonance: 'Partners who share symbolic/mythic language',
    projection: 'Strong projection of ideals onto partners'
  },

  internalizationWeight: 0.3,

  decisionModifier: (_ctx: DecisionContext): number => {
    return 0.05; // following intuition can help
  },

  synastryModifier: (_self: PlanetState, _partner: PlanetState[]): SynastryResult => {
    // Neptune Rx resonates with idealistic partners
    return { score: 0.1, friction: 0.1, resonance: 0.25, dynamic: 'karmic' };
  },

  archetype: 'The Inner Visionary',
  coreStatement: 'My imagination is private but powerful',

  behaviors: [
    'Privately visualizes outcomes before acting',
    'Decisions influenced by inner imagery',
    'Reinterprets situations through personal lens',
    'Strong instinctive gut feelings',
    'Nonlinear relationship with clarity'
  ],

  strengths: [
    'Rich inner imaginative life',
    'Deep intuitive insights',
    'Sees symbolic meaning others miss',
    'Private spiritual connection',
    'Creative internal world'
  ],

  challenges: [
    'Can confuse fantasy with reality',
    'Difficulty with purely practical decisions',
    'May seem disconnected or dreamy',
    'Projection onto relationships',
    'Can be deceived by own idealizations'
  ]
};

// ========================================
// PLUTO RETROGRADE PROFILE
// ========================================

const PlutoRxProfile: RetrogradeProfile = {
  planet: 'Pluto',

  internalization: {
    domain: 'power, transformation, depth, the unconscious',
    internalProcess: 'Transformation happens internally; deep self-excavation',
    externalManifest: 'Intense presence; power held in reserve'
  },

  decision: {
    style: 'Deep internal processing, transformative choices',
    tendency: 'Processes power dynamics internally; makes transformative decisions from within',
    pitfall: 'Can become obsessive with internal processing; control issues',
    strength: 'Deep self-awareness; genuine transformation from within'
  },

  synastry: {
    bonding: 'Intense karmic ties; deep psychological connection',
    friction: 'Partners who can\'t handle psychological depth',
    resonance: 'Partners who can navigate intense emotional territory',
    projection: 'Projects depth and intensity; seeks transformative partnerships'
  },

  internalizationWeight: 0.35,

  decisionModifier: (ctx: DecisionContext): number => {
    if (ctx.topic === 'relationship') return -0.05; // cautious in relationships
    return 0.05; // generally empowering
  },

  synastryModifier: (_self: PlanetState, _partner: PlanetState[]): SynastryResult => {
    // Pluto Rx creates deep, intense bonds
    return { score: 0.15, friction: 0.2, resonance: 0.3, dynamic: 'karmic' };
  },

  archetype: 'The Internal Transformer',
  coreStatement: 'My transformation happens from within',

  behaviors: [
    'Deep internal processing of power dynamics',
    'Transformation through self-excavation',
    'Holds power in reserve',
    'Intense but contained presence',
    'Works through psychological material privately'
  ],

  strengths: [
    'Deep self-awareness',
    'Genuine internal transformation',
    'Psychological depth and insight',
    'Doesn\'t project power issues onto others',
    'Powerful presence without needing to display it'
  ],

  challenges: [
    'Can become obsessive with internal processing',
    'Control issues may be internalized',
    'Difficulty letting go',
    'Intensity can be overwhelming',
    'May attract intense situations'
  ]
};

// ========================================
// EXPORTED MATRIX
// ========================================

/** Complete Retrograde Behavioral Matrix */
export const RetrogradeMatrix: Record<Planet, RetrogradeProfile> = {
  Mercury: MercuryRxProfile,
  Venus: VenusRxProfile,
  Mars: MarsRxProfile,
  Jupiter: JupiterRxProfile,
  Saturn: SaturnRxProfile,
  Uranus: UranusRxProfile,
  Neptune: NeptuneRxProfile,
  Pluto: PlutoRxProfile
};

/** Get profile for a specific planet */
export function getRetrogradeProfile(planet: Planet): RetrogradeProfile {
  return RetrogradeMatrix[planet];
}

/** Get all retrograde profiles */
export function getAllProfiles(): RetrogradeProfile[] {
  return Object.values(RetrogradeMatrix);
}
