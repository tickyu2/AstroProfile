/**
 * Composite Leadership Overlay
 *
 * Combines two charts to analyze leadership dynamics in a relationship:
 * - Who leads in what domains
 * - Power balance and distribution
 * - Decision-making dynamics
 * - Areas of potential conflict or harmony
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import {
  LeadershipOverlayResult,
  ChartDataForLeadership,
  computeLeadershipOverlay,
  LeadershipStyle
} from './leadershipOverlay';

// ========================================
// TYPES
// ========================================

export interface CompositeLeadershipResult {
  person1Leadership: LeadershipOverlayResult;
  person2Leadership: LeadershipOverlayResult;
  powerBalance: PowerBalance;
  dominantPartner: 'person1' | 'person2' | 'equal';
  powerDifferential: number;  // 0 = equal, 1 = complete dominance
  compositeDelta: number;     // contribution to final decision
  dynamicType: RelationshipDynamic;
  domainLeadership: DomainLeadership;
  narrative: string;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
}

export interface PowerBalance {
  person1Share: number;  // 0..1
  person2Share: number;  // 0..1
  isBalanced: boolean;
  balanceType: 'Equal Partners' | 'Slight Imbalance' | 'One Leads' | 'Power Struggle';
}

export type RelationshipDynamic =
  | 'Co-Leaders'
  | 'Lead-Support'
  | 'Complementary Leadership'
  | 'Parallel Autonomy'
  | 'Rotating Leadership'
  | 'Power Negotiation';

export interface DomainLeadership {
  visibility: 'person1' | 'person2' | 'shared';
  decisions: 'person1' | 'person2' | 'shared';
  innovation: 'person1' | 'person2' | 'shared';
  stability: 'person1' | 'person2' | 'shared';
}

// ========================================
// MAIN COMPUTATION
// ========================================

/**
 * Compute Composite Leadership Overlay from two chart datasets
 */
export function computeCompositeLeadership(
  chart1: ChartDataForLeadership,
  chart2: ChartDataForLeadership,
  person1Name?: string,
  person2Name?: string
): CompositeLeadershipResult {
  // Compute individual overlays
  const person1Leadership = computeLeadershipOverlay(chart1);
  const person2Leadership = computeLeadershipOverlay(chart2);

  // Calculate power balance
  const powerBalance = calculatePowerBalance(person1Leadership, person2Leadership);

  // Determine dominant partner
  const { dominantPartner, powerDifferential } = determineDominance(
    person1Leadership,
    person2Leadership
  );

  // Determine relationship dynamic
  const dynamicType = determineRelationshipDynamic(
    person1Leadership,
    person2Leadership,
    powerBalance
  );

  // Calculate domain leadership
  const domainLeadership = calculateDomainLeadership(
    person1Leadership,
    person2Leadership
  );

  // Calculate composite delta for decision engine
  // Balanced power slightly boosts relationship outcomes
  const compositeDelta = powerBalance.isBalanced ? 0.05 : -0.02;

  // Build narrative
  const narrative = buildCompositeNarrative(
    person1Leadership,
    person2Leadership,
    dynamicType,
    powerBalance,
    person1Name,
    person2Name
  );

  // Get strengths, challenges, and recommendations
  const { strengths, challenges, recommendations } = getCompositeTraits(
    person1Leadership,
    person2Leadership,
    dynamicType,
    powerBalance
  );

  return {
    person1Leadership,
    person2Leadership,
    powerBalance,
    dominantPartner,
    powerDifferential,
    compositeDelta,
    dynamicType,
    domainLeadership,
    narrative,
    strengths,
    challenges,
    recommendations
  };
}

// ========================================
// POWER BALANCE CALCULATION
// ========================================

function calculatePowerBalance(
  person1: LeadershipOverlayResult,
  person2: LeadershipOverlayResult
): PowerBalance {
  const total = person1.leadershipScore + person2.leadershipScore;

  if (total === 0) {
    return {
      person1Share: 0.5,
      person2Share: 0.5,
      isBalanced: true,
      balanceType: 'Equal Partners'
    };
  }

  const person1Share = person1.leadershipScore / total;
  const person2Share = person2.leadershipScore / total;
  const differential = Math.abs(person1Share - person2Share);

  let balanceType: PowerBalance['balanceType'];
  let isBalanced: boolean;

  if (differential < 0.1) {
    balanceType = 'Equal Partners';
    isBalanced = true;
  } else if (differential < 0.25) {
    balanceType = 'Slight Imbalance';
    isBalanced = true;
  } else if (differential < 0.4) {
    balanceType = 'One Leads';
    isBalanced = false;
  } else {
    // Check for power struggle (both high but unequal)
    if (person1.leadershipScore > 0.5 && person2.leadershipScore > 0.5) {
      balanceType = 'Power Struggle';
    } else {
      balanceType = 'One Leads';
    }
    isBalanced = false;
  }

  return {
    person1Share,
    person2Share,
    isBalanced,
    balanceType
  };
}

function determineDominance(
  person1: LeadershipOverlayResult,
  person2: LeadershipOverlayResult
): { dominantPartner: 'person1' | 'person2' | 'equal'; powerDifferential: number } {
  const diff = person1.leadershipScore - person2.leadershipScore;
  const powerDifferential = Math.abs(diff);

  if (powerDifferential < 0.1) {
    return { dominantPartner: 'equal', powerDifferential };
  }

  return {
    dominantPartner: diff > 0 ? 'person1' : 'person2',
    powerDifferential
  };
}

// ========================================
// RELATIONSHIP DYNAMIC DETERMINATION
// ========================================

function determineRelationshipDynamic(
  person1: LeadershipOverlayResult,
  person2: LeadershipOverlayResult,
  powerBalance: PowerBalance
): RelationshipDynamic {
  const bothHigh = person1.leadershipScore > 0.5 && person2.leadershipScore > 0.5;
  const bothLow = person1.leadershipScore < 0.35 && person2.leadershipScore < 0.35;
  const bothAutonomous = person1.autonomyScore > 0.5 && person2.autonomyScore > 0.5;

  // Both strong leaders
  if (bothHigh && powerBalance.balanceType === 'Equal Partners') {
    return 'Co-Leaders';
  }

  if (bothHigh && powerBalance.balanceType === 'Power Struggle') {
    return 'Power Negotiation';
  }

  // High autonomy in both
  if (bothAutonomous && !bothHigh) {
    return 'Parallel Autonomy';
  }

  // Complementary styles
  if (complementaryStyles(person1.leadershipStyle, person2.leadershipStyle)) {
    return 'Complementary Leadership';
  }

  // Clear leader/supporter dynamic
  if (powerBalance.balanceType === 'One Leads') {
    return 'Lead-Support';
  }

  // Default for balanced but not strongly defined
  return 'Rotating Leadership';
}

function complementaryStyles(style1: LeadershipStyle, style2: LeadershipStyle): boolean {
  const complementaryPairs: [LeadershipStyle, LeadershipStyle][] = [
    ['Visionary Commander', 'Supportive Presence'],
    ['Charismatic Performer', 'Quiet Authority'],
    ['Innovative Disruptor', 'Collaborative Guide'],
    ['Visionary Commander', 'Collaborative Guide']
  ];

  return complementaryPairs.some(
    ([a, b]) => (style1 === a && style2 === b) || (style1 === b && style2 === a)
  );
}

// ========================================
// DOMAIN LEADERSHIP
// ========================================

function calculateDomainLeadership(
  person1: LeadershipOverlayResult,
  person2: LeadershipOverlayResult
): DomainLeadership {
  const threshold = 0.15;

  const determineDomain = (score1: number, score2: number): 'person1' | 'person2' | 'shared' => {
    const diff = score1 - score2;
    if (Math.abs(diff) < threshold) return 'shared';
    return diff > 0 ? 'person1' : 'person2';
  };

  return {
    visibility: determineDomain(person1.visibilityScore, person2.visibilityScore),
    decisions: determineDomain(person1.leadershipScore, person2.leadershipScore),
    innovation: determineDomain(person1.autonomyScore, person2.autonomyScore),
    stability: determineDomain(
      1 - person1.autonomyScore, // Lower autonomy = more stability focus
      1 - person2.autonomyScore
    )
  };
}

// ========================================
// NARRATIVE BUILDER
// ========================================

function buildCompositeNarrative(
  person1: LeadershipOverlayResult,
  person2: LeadershipOverlayResult,
  dynamic: RelationshipDynamic,
  powerBalance: PowerBalance,
  person1Name?: string,
  person2Name?: string
): string {
  const p1 = person1Name || 'Person 1';
  const p2 = person2Name || 'Person 2';

  const dynamicNarratives: Record<RelationshipDynamic, string> = {
    'Co-Leaders': `${p1} and ${p2} both carry strong leadership energy, creating a relationship of equals. When aligned, their combined force is formidable. The key lies in shared vision and mutual respect for each other's authority.`,

    'Lead-Support': `A natural leader-supporter dynamic emerges between ${p1} and ${p2}. This can be harmonious when both partners feel valued in their roles. The leader must appreciate the supporter's contributions; the supporter must feel empowered to lead when needed.`,

    'Complementary Leadership': `${p1} and ${p2} lead in complementary ways—their different styles fill each other's gaps. Where one charges forward, the other provides stability. This natural division of leadership can be deeply satisfying.`,

    'Parallel Autonomy': `Both ${p1} and ${p2} value independence highly. They lead their own domains and come together by choice rather than need. This creates space but requires intentional connection to maintain intimacy.`,

    'Rotating Leadership': `Leadership between ${p1} and ${p2} naturally rotates based on circumstance and strength. Neither dominates permanently; both step up when their particular gifts are needed. Flexibility is their strength.`,

    'Power Negotiation': `Strong leadership energy in both ${p1} and ${p2} creates intensity. Their relationship involves ongoing negotiation of power—this can be dynamic and growth-inducing, or exhausting without conscious management.`
  };

  let narrative = dynamicNarratives[dynamic];

  // Add power balance context
  if (powerBalance.balanceType === 'Equal Partners') {
    narrative += ' Their power balance is remarkably even—true equals in influence.';
  } else if (powerBalance.balanceType === 'Power Struggle') {
    narrative += ' The potential for power struggles exists and requires conscious attention.';
  }

  return narrative;
}

// ========================================
// TRAITS
// ========================================

function getCompositeTraits(
  person1: LeadershipOverlayResult,
  person2: LeadershipOverlayResult,
  dynamic: RelationshipDynamic,
  powerBalance: PowerBalance
): { strengths: string[]; challenges: string[]; recommendations: string[] } {
  const strengths: string[] = [];
  const challenges: string[] = [];
  const recommendations: string[] = [];

  // Dynamic-specific traits
  switch (dynamic) {
    case 'Co-Leaders':
      strengths.push('Combined leadership force', 'Mutual respect', 'Shared decision-making');
      challenges.push('Competition for control', 'Conflicting visions');
      recommendations.push('Establish clear domains', 'Create shared goals', 'Celebrate each other\'s wins');
      break;

    case 'Lead-Support':
      strengths.push('Clear roles', 'Natural efficiency', 'Complementary positions');
      challenges.push('Supporter may feel undervalued', 'Leader may overburden');
      recommendations.push('Regularly acknowledge supporter contributions', 'Allow role flexibility', 'Leader: actively invite input');
      break;

    case 'Complementary Leadership':
      strengths.push('Gap coverage', 'Balanced partnership', 'Natural role division');
      challenges.push('May miss opportunities for growth', 'Over-reliance on partner');
      recommendations.push('Occasionally swap roles for growth', 'Appreciate differences verbally');
      break;

    case 'Parallel Autonomy':
      strengths.push('Independence', 'Space for individual growth', 'Low conflict');
      challenges.push('Emotional distance', 'Parallel lives risk', 'May drift apart');
      recommendations.push('Schedule intentional connection time', 'Create shared projects', 'Bridge your separate worlds');
      break;

    case 'Rotating Leadership':
      strengths.push('Flexibility', 'Situational strength', 'Mutual capability');
      challenges.push('Role confusion', 'Inconsistency');
      recommendations.push('Communicate about who leads when', 'Trust partner\'s moments of leadership');
      break;

    case 'Power Negotiation':
      strengths.push('Dynamic energy', 'Mutual respect for strength', 'Growth through challenge');
      challenges.push('Exhausting conflicts', 'Competitive rather than cooperative', 'Winner/loser dynamics');
      recommendations.push('Establish non-negotiable boundaries', 'Find external outlets for competitive energy', 'Practice "we win" mentality');
      break;
  }

  // Power balance modifiers
  if (!powerBalance.isBalanced) {
    challenges.push('Power imbalance requires attention');
    recommendations.push('The less dominant partner should practice asserting needs');
  }

  // Autonomy considerations
  if (person1.autonomyScore > 0.6 && person2.autonomyScore > 0.6) {
    strengths.push('Both value independence');
    challenges.push('May struggle with interdependence');
    recommendations.push('Reframe partnership as chosen, not constraining');
  }

  return { strengths, challenges, recommendations };
}

// ========================================
// PERSONA VOICES
// ========================================

export const CompositePersonaVoices: Record<RelationshipDynamic, {
  mentor: string;
  oracle: string;
  companion: string;
  mirror: string;
}> = {
  'Co-Leaders': {
    mentor: 'Two flames can burn brighter together or consume each other. Your leadership partnership requires shared vision and ego surrender.',
    oracle: 'The double throne awaits—but only one shared crown. Your power multiplies through union or divides through competition.',
    companion: 'You\'re both such natural leaders! Figure out how to team up rather than compete and you\'ll be unstoppable.',
    mirror: 'Notice how you both reach for the lead. That mutual strength is treasure—if you can share the stage.'
  },
  'Lead-Support': {
    mentor: 'The visible leader needs the steady supporter. Honor both roles—the partnership serves each in different ways.',
    oracle: 'One holds the torch, one tends the path. Both are essential to the journey. Neither role is lesser.',
    companion: 'Your roles seem clear, which can be great! Just make sure both of you feel valued for what you bring.',
    mirror: 'Notice the natural role division. It works—as long as both feel chosen rather than assigned.'
  },
  'Complementary Leadership': {
    mentor: 'Your different strengths create a complete picture. Appreciate what your partner brings that you lack.',
    oracle: 'Two pieces of one puzzle, two notes of one chord. Your leadership completes itself through union.',
    companion: 'You cover each other\'s blind spots so well! That\'s a beautiful kind of partnership.',
    mirror: 'Notice how your leadership styles differ. That complementarity is a gift—appreciate it consciously.'
  },
  'Parallel Autonomy': {
    mentor: 'Independence can coexist with intimacy—but not without intention. Build bridges between your separate kingdoms.',
    oracle: 'Two sovereign realms, one alliance. Your freedom is sacred, but connection must be cultivated.',
    companion: 'You both love your independence! Just make sure to actually spend quality time together.',
    mirror: 'Notice how comfortably you operate separately. That autonomy is healthy—but connection needs tending too.'
  },
  'Rotating Leadership': {
    mentor: 'The dance of alternating lead requires trust and surrender. Follow with as much grace as you lead.',
    oracle: 'The wheel turns, and leadership passes hand to hand. Trust the rhythm of your exchange.',
    companion: 'You take turns so naturally! That flexibility is a real strength in partnership.',
    mirror: 'Notice how leadership flows between you. That fluidity is rare—honor it with gratitude.'
  },
  'Power Negotiation': {
    mentor: 'Strong meeting strong creates fire or forges steel. Choose consciously how your power will interact.',
    oracle: 'Two forces meet at the crossroads. Will you create explosion or fusion? The choice is made daily.',
    companion: 'Wow, you\'re both intense! Finding ways to channel that energy together rather than against each other is key.',
    mirror: 'Notice the power dynamics in play. That intensity can build or destroy—your awareness makes the difference.'
  }
};

/**
 * Get composite persona voice
 */
export function getCompositePersonaVoice(
  result: CompositeLeadershipResult,
  role: 'mentor' | 'oracle' | 'companion' | 'mirror'
): string {
  return CompositePersonaVoices[result.dynamicType][role];
}

// ========================================
// PILGRIM JOURNEY CHAMBER
// ========================================

export interface CompositeChamber {
  id: string;
  name: string;
  description: string;
  dynamic: RelationshipDynamic;
}

export const CompositeChambers: Record<RelationshipDynamic, CompositeChamber> = {
  'Co-Leaders': {
    id: 'hall-of-twin-thrones',
    name: 'The Hall of Twin Thrones',
    description: 'You enter the Hall of Twin Thrones, where two seats of power face each other across a table of alliance. Here, equals negotiate, plan, and dream together—their combined authority reshaping reality.'
  },
  'Lead-Support': {
    id: 'throne-and-counsel-chamber',
    name: 'The Throne and Counsel Chamber',
    description: 'You enter the Throne and Counsel Chamber, where one seat rises and another stands beside. The standing counsel whispers wisdom; the seated ruler channels it into action. Both are essential.'
  },
  'Complementary Leadership': {
    id: 'chamber-of-interlocking-gears',
    name: 'The Chamber of Interlocking Gears',
    description: 'You stand in the Chamber of Interlocking Gears, where different mechanisms work in perfect synchrony. No gear functions alone; together they move worlds.'
  },
  'Parallel Autonomy': {
    id: 'twin-towers-of-sovereignty',
    name: 'The Twin Towers of Sovereignty',
    description: 'You stand between the Twin Towers of Sovereignty, each rising independently toward the sky, connected by a bridge of light. Separate kingdoms, chosen alliance.'
  },
  'Rotating Leadership': {
    id: 'revolving-throne-room',
    name: 'The Revolving Throne Room',
    description: 'You enter the Revolving Throne Room, where the seat of power turns slowly, facing first one partner, then the other. Leadership passes like breath—natural, rhythmic, shared.'
  },
  'Power Negotiation': {
    id: 'arena-of-sacred-contest',
    name: 'The Arena of Sacred Contest',
    description: 'You step into the Arena of Sacred Contest, where two forces meet in eternal negotiation. This is not war—it is the crucible where power is refined through meeting its equal.'
  }
};

/**
 * Get composite chamber narrative
 */
export function getCompositeChamberNarrative(result: CompositeLeadershipResult): string {
  const chamber = CompositeChambers[result.dynamicType];
  return chamber.description;
}
