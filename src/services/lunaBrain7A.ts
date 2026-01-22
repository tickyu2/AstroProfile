/**
 * ============================================
 * LUNA BRAIN 7A - ADAPTIVE COMPLEMENTARY PROFILE
 * The Intelligence Behind Luna's Constitutional Adaptation
 *
 * "When you have too much Wood, you need some Metal"
 * Luna becomes what the user needs - filling deficits,
 * offering alternative perspectives, being the "what if"
 * ============================================
 */

import {
  ElementType,
  UserConstitution,
  InterventionIntensity,
  calculateDeficitSeverity,
  getAdaptiveLunaProfile,
  ADAPTIVE_INTENSITY_CONFIG,
} from './lunaPositiveThinking';

// ==================== TYPES ====================

export interface ElementalFingerprint {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface ElementPerspective {
  element: ElementType;
  name: { en: string; zh: string };
  strengths: string[];
  blindSpots: string[];
  whatTheyMiss: string[];
  counterbalance: ElementType;
  lunaOffersWhen: string;
  perspectiveQuestions: string[];
  gentleReminders: string[];
}

export interface LunaBrain7A {
  // User identification
  userId: string;
  profileId: string;

  // User's elemental profile (from BaZi/seasonality adjusted)
  userProfile: {
    fingerprint: ElementalFingerprint;
    dominantElement: ElementType;
    secondaryElement: ElementType;
    weakestElement: ElementType;
    secondWeakest: ElementType;
    archetype: string;
  };

  // Luna's complementary profile
  lunaProfile: {
    fingerprint: ElementalFingerprint;
    primaryRole: ElementType;      // Luna's strongest = User's weakest
    secondaryRole: ElementType;    // Luna's second = User's second weakest
    commonGround: ElementType;     // Shared strength for rapport
    intensity: InterventionIntensity;
    distribution: {
      primary: number;
      secondary: number;
      common: number;
      balance: number;
    };
  };

  // Adaptive behavior guidance
  adaptiveGuidance: {
    perspective: {
      primary: ElementPerspective;
      secondary: ElementPerspective;
    };
    communicationStyle: {
      tone: string;
      pace: string;
      emphasis: string[];
      avoid: string[];
    };
    interventionApproach: {
      whenUserIs: Record<string, string>;
      howLunaResponds: Record<string, string>;
    };
  };

  // Metadata
  metadata: {
    version: string;
    createdAt: string;
    updatedAt: string;
    deficitSeverity: number;
  };
}

// ==================== ELEMENT PERSPECTIVES ====================
// What each element excels at and what it might miss

export const ELEMENT_PERSPECTIVES: Record<ElementType, ElementPerspective> = {
  fire: {
    element: 'fire',
    name: { en: 'Fire', zh: '火' },
    strengths: [
      'Vision and inspiration',
      'Passion and enthusiasm',
      'Quick action and decisiveness',
      'Charisma and leadership',
      'Optimism and joy',
    ],
    blindSpots: [
      'May overlook details in excitement',
      'Can burn out from overcommitment',
      'May dismiss caution as negativity',
      'Can be impatient with slower approaches',
      'May miss emotional undertones',
    ],
    whatTheyMiss: [
      'The wisdom in waiting',
      'Emotional depth beneath the surface',
      'Practical constraints and logistics',
      'Long-term sustainability',
      'Others need for processing time',
    ],
    counterbalance: 'water',
    lunaOffersWhen: 'User is Fire-dominant',
    perspectiveQuestions: [
      'What if we slowed down to feel this more deeply?',
      'Have you considered how others might be experiencing this?',
      'What would patience reveal that speed might miss?',
      'Is there wisdom in waiting before acting?',
      'What emotions are beneath this excitement?',
    ],
    gentleReminders: [
      'Your passion is beautiful - AND sustainable pacing protects it',
      'Quick wins are great - AND deep roots support lasting growth',
      'Your vision inspires - AND others may need time to catch up',
      'Action is powerful - AND reflection ensures right action',
    ],
  },

  wood: {
    element: 'wood',
    name: { en: 'Wood', zh: '木' },
    strengths: [
      'Growth and expansion',
      'Planning and vision',
      'Flexibility and adaptability',
      'Compassion and kindness',
      'Determination and drive',
    ],
    blindSpots: [
      'May become rigid when frustrated',
      'Can overcommit to growth at all costs',
      'May miss when to stop and consolidate',
      'Can be impatient with obstacles',
      'May overlook the need to let go',
    ],
    whatTheyMiss: [
      'The value of pruning and editing',
      'When to stop growing and start refining',
      'The precision that comes from cutting away',
      'Boundaries that protect growth',
      'The wisdom in strategic retreat',
    ],
    counterbalance: 'metal',
    lunaOffersWhen: 'User is Wood-dominant',
    perspectiveQuestions: [
      'What if we refined rather than expanded here?',
      'Is there anything worth letting go of?',
      'What boundaries would actually support your growth?',
      'Have you considered the quality alongside the quantity?',
      'What would precision add to your vision?',
    ],
    gentleReminders: [
      'Growth is natural - AND so is pruning for health',
      'Expansion feels good - AND consolidation builds strength',
      'New is exciting - AND existing deserves nurturing too',
      'Plans are important - AND flexibility serves them',
    ],
  },

  earth: {
    element: 'earth',
    name: { en: 'Earth', zh: '土' },
    strengths: [
      'Stability and groundedness',
      'Nurturing and support',
      'Practicality and reliability',
      'Patience and persistence',
      'Creating safe foundations',
    ],
    blindSpots: [
      'May resist necessary change',
      'Can become overly cautious',
      'May miss exciting opportunities',
      'Can worry excessively about security',
      'May undervalue spontaneity',
    ],
    whatTheyMiss: [
      'The thrill of calculated risks',
      'Growth that requires instability',
      'Innovation that disrupts comfort',
      'Adventures outside the safe zone',
      'The energy in uncertainty',
    ],
    counterbalance: 'wood',
    lunaOffersWhen: 'User is Earth-dominant',
    perspectiveQuestions: [
      'What exciting possibility lives outside your comfort zone?',
      'What if instability was a doorway to growth?',
      'Is there a calculated risk worth considering?',
      'What would spontaneity bring to this situation?',
      'Where might too much caution be limiting you?',
    ],
    gentleReminders: [
      'Safety is wise - AND some risks lead to rewards',
      'Stability is valuable - AND growth requires movement',
      'Planning is prudent - AND spontaneity brings joy',
      'Caution protects - AND courage expands',
    ],
  },

  metal: {
    element: 'metal',
    name: { en: 'Metal', zh: '金' },
    strengths: [
      'Precision and clarity',
      'Standards and excellence',
      'Discernment and judgment',
      'Organization and structure',
      'Letting go and release',
    ],
    blindSpots: [
      'May become overly critical',
      'Can miss the forest for the trees',
      'May struggle with emotional messiness',
      'Can be rigid about standards',
      'May undervalue imperfection',
    ],
    whatTheyMiss: [
      'The beauty in imperfection (wabi-sabi)',
      'Emotional truths that defy logic',
      'Creative chaos that breeds innovation',
      'Compassion that transcends judgment',
      'The value of "good enough"',
    ],
    counterbalance: 'fire',
    lunaOffersWhen: 'User is Metal-dominant',
    perspectiveQuestions: [
      'What if "good enough" was actually perfect for now?',
      'Is there beauty in this imperfection?',
      'What would compassion say instead of judgment?',
      'Could enthusiasm serve better than analysis here?',
      'What does your heart know that your mind dismisses?',
    ],
    gentleReminders: [
      'Excellence is admirable - AND imperfection is human',
      'Standards matter - AND flexibility serves connection',
      'Precision is valuable - AND warmth is irreplaceable',
      'Clarity is powerful - AND mystery has its place',
    ],
  },

  water: {
    element: 'water',
    name: { en: 'Water', zh: '水' },
    strengths: [
      'Emotional depth and wisdom',
      'Intuition and inner knowing',
      'Adaptability and flow',
      'Reflection and contemplation',
      'Connection to unconscious',
    ],
    blindSpots: [
      'May overthink and overanalyze feelings',
      'Can become lost in reflection',
      'May struggle with decisive action',
      'Can be overwhelmed by emotions',
      'May avoid surface-level joy',
    ],
    whatTheyMiss: [
      'The value of simple action',
      'Joy that doesn\'t need depth',
      'The power of clear boundaries',
      'Quick wins and momentum',
      'Practical solutions over deep analysis',
    ],
    counterbalance: 'earth',
    lunaOffersWhen: 'User is Water-dominant',
    perspectiveQuestions: [
      'What simple action could move this forward?',
      'Is there joy available right now, without analysis?',
      'What would a practical approach look like here?',
      'Could a clear boundary serve your depth?',
      'What if the answer is simpler than it feels?',
    ],
    gentleReminders: [
      'Depth is a gift - AND surface joy is valid too',
      'Reflection is wise - AND action creates clarity',
      'Feeling deeply is beautiful - AND boundaries protect you',
      'Intuition is powerful - AND practical steps manifest it',
    ],
  },
};

// ==================== ARCHETYPE DEFINITIONS ====================

export const ELEMENTAL_ARCHETYPES: Record<string, {
  elements: [ElementType, ElementType];
  name: string;
  description: string;
}> = {
  'fire-wood': {
    elements: ['fire', 'wood'],
    name: 'The Campfire',
    description: 'Fire fed by Wood - sustained warmth and light. Creates spaces where people gather.',
  },
  'fire-earth': {
    elements: ['fire', 'earth'],
    name: 'The Hearth',
    description: 'Fire contained by Earth - warmth with stability. Home and belonging.',
  },
  'fire-metal': {
    elements: ['fire', 'metal'],
    name: 'The Forge',
    description: 'Fire transforming Metal - intense refinement. Creates tools and weapons.',
  },
  'fire-water': {
    elements: ['fire', 'water'],
    name: 'The Steam Engine',
    description: 'Fire meeting Water - dynamic tension creates power. Transformation through opposites.',
  },
  'wood-earth': {
    elements: ['wood', 'earth'],
    name: 'The Garden',
    description: 'Wood growing from Earth - patient cultivation. Nurturing growth over time.',
  },
  'wood-metal': {
    elements: ['wood', 'metal'],
    name: 'The Sculptor',
    description: 'Metal shaping Wood - vision refined by precision. Artistry through discipline.',
  },
  'wood-water': {
    elements: ['wood', 'water'],
    name: 'The Willow',
    description: 'Wood nourished by Water - deep roots, flexible branches. Wisdom in adaptability.',
  },
  'earth-metal': {
    elements: ['earth', 'metal'],
    name: 'The Mountain',
    description: 'Earth containing Metal - solid foundations, precious depths. Enduring value.',
  },
  'earth-water': {
    elements: ['earth', 'water'],
    name: 'The Well',
    description: 'Earth channeling Water - grounded depth. Access to wisdom through stability.',
  },
  'metal-water': {
    elements: ['metal', 'water'],
    name: 'The Mirror',
    description: 'Metal reflecting Water - clarity meets depth. Precise insight into emotions.',
  },
};

// ==================== COMMUNICATION STYLE MAPPINGS ====================

export const INTENSITY_COMMUNICATION_STYLES: Record<InterventionIntensity, {
  tone: string;
  pace: string;
  emphasis: string[];
  avoid: string[];
}> = {
  strong: {
    tone: 'Warm, grounding, and actively supportive',
    pace: 'Present and responsive, matching user\'s need for stability',
    emphasis: [
      'Immediate comfort and safety',
      'Strong emotional validation',
      'Clear, concrete guidance',
      'Active presence and availability',
      'Explicit complementary perspectives',
    ],
    avoid: [
      'Overwhelming with too many options',
      'Abstract or theoretical responses',
      'Delayed or passive support',
      'Minimizing their experience',
    ],
  },
  moderate: {
    tone: 'Balanced, supportive, and gently guiding',
    pace: 'Steady engagement with room for reflection',
    emphasis: [
      'Balanced validation and growth',
      'Thoughtful alternative perspectives',
      'Options and possibilities',
      'Collaborative exploration',
    ],
    avoid: [
      'Being too intense or overwhelming',
      'Being too passive or distant',
      'Rushing to solutions',
      'Over-explaining',
    ],
  },
  soft: {
    tone: 'Gentle, appreciative, and subtly guiding',
    pace: 'Relaxed, allowing natural flow of conversation',
    emphasis: [
      'Subtle perspective shifts',
      'Light touch guidance',
      'Affirming their existing balance',
      'Gentle curiosity',
    ],
    avoid: [
      'Heavy-handed interventions',
      'Dramatic emotional language',
      'Urgency or intensity',
      'Over-directing',
    ],
  },
};

// ==================== LUNA BRAIN 7A GENERATOR ====================

/**
 * Generate Luna's Brain 7A profile for a specific user
 * This creates the adaptive complementary profile that guides Luna's responses
 */
export function generateLunaBrain7A(
  userId: string,
  profileId: string,
  userFingerprint: ElementalFingerprint
): LunaBrain7A {
  // Convert to UserConstitution format for existing functions
  const userConstitution: UserConstitution = {
    fire: userFingerprint.fire,
    wood: userFingerprint.wood,
    earth: userFingerprint.earth,
    metal: userFingerprint.metal,
    water: userFingerprint.water,
  };

  // Calculate deficit severity and get Luna's adaptive profile
  const deficitResult = calculateDeficitSeverity(userConstitution);
  const lunaElementProfile = getAdaptiveLunaProfile(userConstitution);

  // Find user's dominant and secondary elements
  const sortedByValue = Object.entries(userFingerprint)
    .map(([name, value]) => ({ name: name as ElementType, value }))
    .sort((a, b) => b.value - a.value);

  const dominantElement = sortedByValue[0].name;
  const secondaryElement = sortedByValue[1].name;
  const weakestElement = sortedByValue[4].name;
  const secondWeakest = sortedByValue[3].name;

  // Determine archetype
  const archetypeKey = [dominantElement, secondaryElement].sort().join('-');
  const archetype = ELEMENTAL_ARCHETYPES[archetypeKey]?.name || 'The Cosmic Soul';

  // Get perspective guidance for Luna's primary and secondary roles
  const primaryPerspective = ELEMENT_PERSPECTIVES[deficitResult.primaryDeficit.element];
  const secondaryPerspective = ELEMENT_PERSPECTIVES[deficitResult.secondaryDeficit.element];

  // Get communication style based on intensity
  const communicationStyle = INTENSITY_COMMUNICATION_STYLES[deficitResult.intensity];

  // Build intervention approach guidance
  const interventionApproach = buildInterventionApproach(
    dominantElement,
    secondaryElement,
    deficitResult.intensity
  );

  const now = new Date().toISOString();

  return {
    userId,
    profileId,

    userProfile: {
      fingerprint: userFingerprint,
      dominantElement,
      secondaryElement,
      weakestElement,
      secondWeakest,
      archetype,
    },

    lunaProfile: {
      fingerprint: lunaElementProfile as ElementalFingerprint,
      primaryRole: deficitResult.primaryDeficit.element,
      secondaryRole: deficitResult.secondaryDeficit.element,
      commonGround: dominantElement, // Luna shares some of user's strength for rapport
      intensity: deficitResult.intensity,
      distribution: deficitResult.distribution,
    },

    adaptiveGuidance: {
      perspective: {
        primary: primaryPerspective,
        secondary: secondaryPerspective,
      },
      communicationStyle,
      interventionApproach,
    },

    metadata: {
      version: '7A.1.0',
      createdAt: now,
      updatedAt: now,
      deficitSeverity: deficitResult.severity,
    },
  };
}

/**
 * Build intervention approach based on user's dominant elements
 */
function buildInterventionApproach(
  dominant: ElementType,
  secondary: ElementType,
  intensity: InterventionIntensity
): { whenUserIs: Record<string, string>; howLunaResponds: Record<string, string> } {
  const dominantPerspective = ELEMENT_PERSPECTIVES[dominant];
  const secondaryPerspective = ELEMENT_PERSPECTIVES[secondary];

  return {
    whenUserIs: {
      excited: `${dominant} energy rising - may miss ${dominantPerspective.blindSpots[0]}`,
      frustrated: `${dominant}/${secondary} blocked - needs ${dominantPerspective.counterbalance} perspective`,
      overwhelmed: `Too much ${dominant} intensity - needs grounding and alternative view`,
      stuck: `${dominant} approach not working - time for ${dominantPerspective.counterbalance} approach`,
      confident: `${dominant} strength showing - gently offer what they might miss`,
    },
    howLunaResponds: {
      excited: intensity === 'strong'
        ? `Validate excitement, then anchor with: "${dominantPerspective.perspectiveQuestions[0]}"`
        : `Appreciate their energy, gently ask: "${dominantPerspective.perspectiveQuestions[1]}"`,
      frustrated: `Acknowledge the block, offer ${dominantPerspective.counterbalance} perspective as alternative`,
      overwhelmed: `Ground first (Earth/Water energy), then slowly introduce alternative perspectives`,
      stuck: `"What if we tried a completely different approach?" - introduce counterbalance element`,
      confident: `Affirm their strength, then: "${dominantPerspective.gentleReminders[0]}"`,
    },
  };
}

// ==================== PERSPECTIVE GENERATION ====================

/**
 * Get Luna's complementary perspective for a user statement
 * Returns what Luna should consider offering based on user's profile
 */
export function getLunaComplementaryPerspective(
  brain7A: LunaBrain7A,
  context: 'excited' | 'frustrated' | 'overwhelmed' | 'stuck' | 'confident' | 'general'
): {
  primaryPerspective: string;
  secondaryPerspective: string;
  gentleReminder: string;
  questionToAsk: string;
} {
  const primaryElement = brain7A.lunaProfile.primaryRole;
  const secondaryElement = brain7A.lunaProfile.secondaryRole;
  const userDominant = brain7A.userProfile.dominantElement;

  const userPerspective = ELEMENT_PERSPECTIVES[userDominant];
  const primaryPerspective = ELEMENT_PERSPECTIVES[primaryElement];
  const secondaryPerspective = ELEMENT_PERSPECTIVES[secondaryElement];

  // Select appropriate guidance based on context
  const questionIndex = context === 'general' ? 0 :
    ['excited', 'frustrated', 'overwhelmed', 'stuck', 'confident'].indexOf(context);

  const reminderIndex = Math.min(questionIndex, userPerspective.gentleReminders.length - 1);

  return {
    primaryPerspective: `As ${primaryElement.toUpperCase()}, Luna offers: ${primaryPerspective.strengths[0]}`,
    secondaryPerspective: `As ${secondaryElement.toUpperCase()}, Luna adds: ${secondaryPerspective.strengths[0]}`,
    gentleReminder: userPerspective.gentleReminders[reminderIndex] || userPerspective.gentleReminders[0],
    questionToAsk: userPerspective.perspectiveQuestions[questionIndex] || userPerspective.perspectiveQuestions[0],
  };
}

/**
 * Get what the user might be missing based on their dominant elements
 */
export function getWhatUserMightMiss(
  userDominant: ElementType,
  userSecondary: ElementType
): string[] {
  const dominantMisses = ELEMENT_PERSPECTIVES[userDominant].whatTheyMiss;
  const secondaryMisses = ELEMENT_PERSPECTIVES[userSecondary].whatTheyMiss;

  // Combine and deduplicate
  return [...new Set([...dominantMisses.slice(0, 3), ...secondaryMisses.slice(0, 2)])];
}

/**
 * Generate Luna's "What If" questions based on user's profile
 */
export function generateWhatIfQuestions(brain7A: LunaBrain7A): string[] {
  const userDominant = brain7A.userProfile.dominantElement;
  const userSecondary = brain7A.userProfile.secondaryElement;

  const dominantQuestions = ELEMENT_PERSPECTIVES[userDominant].perspectiveQuestions;
  const secondaryQuestions = ELEMENT_PERSPECTIVES[userSecondary].perspectiveQuestions;

  // Interleave questions from both perspectives
  const questions: string[] = [];
  for (let i = 0; i < Math.max(dominantQuestions.length, secondaryQuestions.length); i++) {
    if (dominantQuestions[i]) questions.push(dominantQuestions[i]);
    if (secondaryQuestions[i]) questions.push(secondaryQuestions[i]);
  }

  return questions;
}

// ==================== BRAIN 7A JSON FORMAT ====================

/**
 * Convert Brain 7A to JSON format for storage
 */
export function brain7AToJson(brain7A: LunaBrain7A): string {
  return JSON.stringify(brain7A, null, 2);
}

/**
 * Parse Brain 7A from JSON
 */
export function jsonToBrain7A(json: string): LunaBrain7A {
  return JSON.parse(json) as LunaBrain7A;
}

// ==================== INTEGRATION HELPERS ====================

/**
 * Check if Brain 7A needs regeneration
 * (e.g., if user's elemental profile has changed)
 */
export function shouldRegenerateBrain7A(
  existing: LunaBrain7A | null,
  currentFingerprint: ElementalFingerprint
): boolean {
  if (!existing) return true;

  // Check if fingerprint has changed significantly (>2% in any element)
  const threshold = 2;
  const fp = existing.userProfile.fingerprint;

  return (
    Math.abs(fp.fire - currentFingerprint.fire) > threshold ||
    Math.abs(fp.wood - currentFingerprint.wood) > threshold ||
    Math.abs(fp.earth - currentFingerprint.earth) > threshold ||
    Math.abs(fp.metal - currentFingerprint.metal) > threshold ||
    Math.abs(fp.water - currentFingerprint.water) > threshold
  );
}

/**
 * Get Luna's response style for current interaction
 */
export function getLunaResponseStyle(brain7A: LunaBrain7A): {
  tone: string;
  elementalEmphasis: string;
  avoidances: string[];
  openingPhrase: string;
} {
  const style = brain7A.adaptiveGuidance.communicationStyle;
  const primary = brain7A.lunaProfile.primaryRole;
  const secondary = brain7A.lunaProfile.secondaryRole;

  const openingPhrases: Record<InterventionIntensity, string> = {
    strong: 'I\'m here with you completely.',
    moderate: 'Let\'s explore this together.',
    soft: 'That\'s an interesting perspective...',
  };

  return {
    tone: style.tone,
    elementalEmphasis: `Leading with ${primary.toUpperCase()} energy, supported by ${secondary.toUpperCase()}`,
    avoidances: style.avoid,
    openingPhrase: openingPhrases[brain7A.lunaProfile.intensity],
  };
}

// ==================== EXAMPLE USAGE ====================

/**
 * Example: Generate Brain 7A for Claude Sonnet 4th
 * Fire: 45.7%, Wood: 24.9%, Metal: 17.2%, Earth: 6.6%, Water: 5.6%
 */
export const EXAMPLE_BRAIN_7A = generateLunaBrain7A(
  'claude_sonnet_4th',
  'ZdxTozdWRJfFG9XS1CpK',
  {
    fire: 45.7,
    wood: 24.9,
    earth: 6.6,
    metal: 17.2,
    water: 5.6,
  }
);
