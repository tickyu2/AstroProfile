/**
 * Composite Useful God Overlay
 *
 * The relationship's stabilizing force - the "shared Yong Shen."
 * This overlay determines the Useful God of the relationship itself,
 * not the individuals, showing what element best supports the union.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import { UsefulGodOverlayResult, BaZiElement } from './usefulGodOverlay';

// ========================================
// TYPES
// ========================================

export interface CompositeUsefulGodOverlayResult {
  compositeUsefulGod: BaZiElement | 'Mixed';
  harmonyScore: number;           // 0..1
  compositeUsefulGodDelta: number;
  sharedStabilizer: boolean;
  balanceAnalysis: BalanceAnalysis;
  narrative: string;
  strengths: string[];
  challenges: string[];
  balancingRecommendations: string[];
}

export interface BalanceAnalysis {
  person1Needs: BaZiElement;
  person2Needs: BaZiElement;
  sharedNeed: BaZiElement | null;
  conflictingNeeds: boolean;
  mutualSupport: MutualSupportType;
}

export type MutualSupportType =
  | 'Naturally Supportive'      // Each provides what the other needs
  | 'Same Need, Same Solution'  // Both need the same element
  | 'Different Needs, Compatible' // Different needs but not conflicting
  | 'Conflicting Needs'         // One's medicine is the other's poison
  | 'Neutral';

// ========================================
// ELEMENT RELATIONSHIPS
// ========================================

const ELEMENT_SUPPORTS: Record<BaZiElement, BaZiElement[]> = {
  Wood: ['Water', 'Wood'],  // Water produces Wood, Wood supports Wood
  Fire: ['Wood', 'Fire'],
  Earth: ['Fire', 'Earth'],
  Metal: ['Earth', 'Metal'],
  Water: ['Metal', 'Water']
};

const ELEMENT_CONFLICTS: Record<BaZiElement, BaZiElement[]> = {
  Wood: ['Metal'],  // Metal cuts Wood
  Fire: ['Water'],
  Earth: ['Wood'],
  Metal: ['Fire'],
  Water: ['Earth']
};

// ========================================
// MAIN COMPUTATION
// ========================================

/**
 * Compute composite Useful God from two individual overlays
 */
export function computeCompositeUsefulGodOverlay(
  person1: UsefulGodOverlayResult,
  person2: UsefulGodOverlayResult
): CompositeUsefulGodOverlayResult {
  const ug1 = person1.usefulGod;
  const ug2 = person2.usefulGod;

  // Determine if shared Useful God
  const sharedStabilizer = ug1 === ug2;

  // Calculate harmony score
  let harmonyScore: number;
  let compositeUsefulGod: BaZiElement | 'Mixed';
  let mutualSupport: MutualSupportType;

  if (sharedStabilizer) {
    // Same Useful God - high harmony
    harmonyScore = (person1.favorability + person2.favorability) / 2;
    compositeUsefulGod = ug1;
    mutualSupport = 'Same Need, Same Solution';
  } else {
    // Different Useful Gods - check compatibility
    const person1SupportsP2 = ELEMENT_SUPPORTS[ug1].includes(ug2) ||
      person1.supportElements.includes(ug2);
    const person2SupportsP1 = ELEMENT_SUPPORTS[ug2].includes(ug1) ||
      person2.supportElements.includes(ug1);

    const conflicting =
      ELEMENT_CONFLICTS[ug1].includes(ug2) ||
      ug1 === person2.annoyingGod ||
      ug2 === person1.annoyingGod;

    if (person1SupportsP2 && person2SupportsP1) {
      harmonyScore = (person1.favorability + person2.favorability) / 2 * 0.9;
      mutualSupport = 'Naturally Supportive';
    } else if (conflicting) {
      harmonyScore = (person1.favorability + person2.favorability) / 4;
      mutualSupport = 'Conflicting Needs';
    } else if (person1SupportsP2 || person2SupportsP1) {
      harmonyScore = (person1.favorability + person2.favorability) / 2 * 0.7;
      mutualSupport = 'Different Needs, Compatible';
    } else {
      harmonyScore = (person1.favorability + person2.favorability) / 2 * 0.5;
      mutualSupport = 'Neutral';
    }

    compositeUsefulGod = 'Mixed';
  }

  // Build balance analysis
  const balanceAnalysis: BalanceAnalysis = {
    person1Needs: ug1,
    person2Needs: ug2,
    sharedNeed: sharedStabilizer ? ug1 : null,
    conflictingNeeds: mutualSupport === 'Conflicting Needs',
    mutualSupport
  };

  // Calculate delta
  const compositeUsefulGodDelta = harmonyScore * 0.06;

  // Build narrative
  const narrative = buildCompositeUsefulGodNarrative(
    compositeUsefulGod,
    harmonyScore,
    balanceAnalysis,
    person1,
    person2
  );

  // Get traits
  const { strengths, challenges, balancingRecommendations } = getCompositeUsefulGodTraits(
    balanceAnalysis,
    person1,
    person2
  );

  return {
    compositeUsefulGod,
    harmonyScore,
    compositeUsefulGodDelta,
    sharedStabilizer,
    balanceAnalysis,
    narrative,
    strengths,
    challenges,
    balancingRecommendations
  };
}

// ========================================
// NARRATIVE BUILDER
// ========================================

function buildCompositeUsefulGodNarrative(
  compositeUG: BaZiElement | 'Mixed',
  harmony: number,
  analysis: BalanceAnalysis,
  person1: UsefulGodOverlayResult,
  person2: UsefulGodOverlayResult
): string {
  const harmonyPercent = Math.round(harmony * 100);

  if (compositeUG !== 'Mixed') {
    return `Both charts share ${compositeUG} as Useful God (${harmonyPercent}% harmony). ` +
      `This creates strong relational stability—you both benefit from the same balancing energy. ` +
      `Environments rich in ${compositeUG} energy support your relationship naturally.`;
  }

  const mutualNarratives: Record<MutualSupportType, string> = {
    'Naturally Supportive': `Your Useful Gods differ (${analysis.person1Needs} and ${analysis.person2Needs}) but naturally support each other (${harmonyPercent}% harmony). ` +
      `What one needs, the other helps provide. This creates a beautiful interdependence.`,

    'Same Need, Same Solution': `You share the same Useful God (${analysis.person1Needs}), creating strong resonance (${harmonyPercent}% harmony).`,

    'Different Needs, Compatible': `Your Useful Gods differ (${analysis.person1Needs} and ${analysis.person2Needs}) but remain compatible (${harmonyPercent}% harmony). ` +
      `With awareness, you can support each other's balance needs without conflict.`,

    'Conflicting Needs': `Your Useful Gods create tension (${analysis.person1Needs} and ${analysis.person2Needs}) - ${harmonyPercent}% harmony. ` +
      `What stabilizes one may destabilize the other. Conscious balancing is essential.`,

    'Neutral': `Your Useful Gods (${analysis.person1Needs} and ${analysis.person2Needs}) operate independently (${harmonyPercent}% harmony). ` +
      `Neither naturally supports nor conflicts with the other.`
  };

  return mutualNarratives[analysis.mutualSupport];
}

// ========================================
// TRAITS
// ========================================

function getCompositeUsefulGodTraits(
  analysis: BalanceAnalysis,
  person1: UsefulGodOverlayResult,
  person2: UsefulGodOverlayResult
): { strengths: string[]; challenges: string[]; balancingRecommendations: string[] } {
  const strengths: string[] = [];
  const challenges: string[] = [];
  const balancingRecommendations: string[] = [];

  switch (analysis.mutualSupport) {
    case 'Same Need, Same Solution':
      strengths.push('Shared balancing needs', 'Natural harmony in environment preferences');
      challenges.push('May amplify shared blind spots');
      balancingRecommendations.push(
        `Seek ${analysis.person1Needs} energy together`,
        `Create rituals that honor ${analysis.person1Needs}`
      );
      break;

    case 'Naturally Supportive':
      strengths.push('Complementary balancing', 'Mutual support capacity', 'Each provides what the other needs');
      balancingRecommendations.push(
        'Honor each other\'s balancing needs consciously',
        'Notice when you naturally stabilize your partner'
      );
      break;

    case 'Different Needs, Compatible':
      strengths.push('Diverse strengths', 'Room for individual balance');
      challenges.push('May need separate balancing practices');
      balancingRecommendations.push(
        `Person 1 needs ${analysis.person1Needs}; Person 2 needs ${analysis.person2Needs}`,
        'Support each other\'s individual balance needs',
        'Find activities that touch both elements'
      );
      break;

    case 'Conflicting Needs':
      strengths.push('Growth potential through friction');
      challenges.push(
        'One\'s medicine may be the other\'s poison',
        'Environmental preferences may clash',
        'Requires conscious navigation'
      );
      balancingRecommendations.push(
        'Take turns prioritizing each other\'s needs',
        'Create separate spaces for individual balance',
        'Find neutral ground in shared activities',
        'Communicate about what you each need'
      );
      break;

    case 'Neutral':
      strengths.push('Independence in balance needs', 'Low interference');
      challenges.push('May lack natural mutual support');
      balancingRecommendations.push(
        'Actively learn what your partner needs for balance',
        'Don\'t assume your stabilizer works for them'
      );
      break;
  }

  return {
    strengths: strengths.slice(0, 4),
    challenges: challenges.slice(0, 3),
    balancingRecommendations: balancingRecommendations.slice(0, 4)
  };
}

// ========================================
// PERSONA VOICES
// ========================================

export const CompositeUsefulGodPersonaVoices: Record<MutualSupportType, {
  mentor: string;
  oracle: string;
  companion: string;
  mirror: string;
}> = {
  'Same Need, Same Solution': {
    mentor: 'Your shared Useful God is a powerful alignment. Together, seek what stabilizes you both.',
    oracle: 'One medicine for two souls. The element you both need resonates through your union.',
    companion: 'You both need the same thing to feel balanced! That\'s actually really helpful.',
    mirror: 'Notice how you both respond to the same balancing energy. That shared resonance is a gift.'
  },
  'Naturally Supportive': {
    mentor: 'What you need, your partner naturally provides. This is the dance of true complementarity.',
    oracle: 'Two different medicines that heal each other. Your union is its own pharmacy.',
    companion: 'You each bring what the other needs. That\'s partnership at its best!',
    mirror: 'Notice how your partner\'s presence naturally stabilizes something in you. Receive it consciously.'
  },
  'Different Needs, Compatible': {
    mentor: 'Different needs can coexist peacefully. Honor both without forcing sameness.',
    oracle: 'Two paths to balance, neither blocking the other. Walk your ways side by side.',
    companion: 'You need different things, and that\'s okay! Just be aware of each other\'s needs.',
    mirror: 'Notice where your balance needs differ. That difference asks for awareness, not alarm.'
  },
  'Conflicting Needs': {
    mentor: 'Your balance needs create tension. This is not incompatibility—it is a call to conscious love.',
    oracle: 'Where one finds medicine, the other finds challenge. Navigate these waters with care.',
    companion: 'Your needs kinda clash, but that doesn\'t mean you can\'t make it work. Just takes awareness.',
    mirror: 'Notice when your partner\'s comfort is your discomfort. That friction is information, not verdict.'
  },
  'Neutral': {
    mentor: 'Your balance needs neither support nor conflict. You must actively learn each other\'s requirements.',
    oracle: 'Two separate wells in shared ground. Each must draw your own water.',
    companion: 'Your balance needs are pretty independent. Make sure you\'re still tuning into each other.',
    mirror: 'Notice the independence of your balance needs. That neutrality requires intentional bridging.'
  }
};

/**
 * Get composite Useful God persona voice
 */
export function getCompositeUsefulGodPersonaVoice(
  result: CompositeUsefulGodOverlayResult,
  role: 'mentor' | 'oracle' | 'companion' | 'mirror'
): string {
  return CompositeUsefulGodPersonaVoices[result.balanceAnalysis.mutualSupport][role];
}

// ========================================
// PILGRIM JOURNEY CHAMBER
// ========================================

export interface CompositeUsefulGodChamber {
  id: string;
  name: string;
  description: string;
  supportType: MutualSupportType;
}

export const CompositeUsefulGodChambers: Record<MutualSupportType, CompositeUsefulGodChamber> = {
  'Same Need, Same Solution': {
    id: 'well-of-shared-medicine',
    name: 'The Well of Shared Medicine',
    description: 'You arrive at the Well of Shared Medicine together, where one healing water serves both. Here, your aligned needs draw from the same source—drink together.',
    supportType: 'Same Need, Same Solution'
  },
  'Naturally Supportive': {
    id: 'exchange-of-remedies',
    name: 'The Exchange of Remedies',
    description: 'You enter the Exchange of Remedies, where two different medicines meet and heal. Here, what one offers is exactly what the other needs—receive the gift.',
    supportType: 'Naturally Supportive'
  },
  'Different Needs, Compatible': {
    id: 'parallel-healing-rooms',
    name: 'The Parallel Healing Rooms',
    description: 'You find the Parallel Healing Rooms, where two different treatments proceed side by side. Here, different doesn\'t mean distant—witness each other\'s balance.',
    supportType: 'Different Needs, Compatible'
  },
  'Conflicting Needs': {
    id: 'chamber-of-careful-navigation',
    name: 'The Chamber of Careful Navigation',
    description: 'You enter the Chamber of Careful Navigation, where the floor shifts and balance requires attention. Here, your different needs ask for conscious stepping.',
    supportType: 'Conflicting Needs'
  },
  'Neutral': {
    id: 'hall-of-independent-wells',
    name: 'The Hall of Independent Wells',
    description: 'You stand in the Hall of Independent Wells, where each draws from their own source. Here, autonomy in balance asks for bridges of attention.',
    supportType: 'Neutral'
  }
};

/**
 * Get composite Useful God chamber narrative
 */
export function getCompositeUsefulGodChamberNarrative(result: CompositeUsefulGodOverlayResult): string {
  const chamber = CompositeUsefulGodChambers[result.balanceAnalysis.mutualSupport];
  return chamber.description;
}
