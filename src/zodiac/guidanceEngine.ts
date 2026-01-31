/**
 * Guidance Engine - Dynamic Pair-Specific Relationship Guidance
 *
 * Synthesizes guidance from two sign profiles to create actionable advice:
 * - What works naturally
 * - Common pitfalls
 * - Practical daily/weekly/monthly actions
 * - Conflict repair plans
 * - Growth opportunities
 *
 * Susan Miller-style: "Here's how to LIVE this relationship"
 *
 * GENESIS AstroProfile - January 2026
 */

import type { SignKey } from './tropicalMap';
import { SIGN_LESSONS } from './tropicalMap';
import { SIGN_GUIDANCE, type SignGuidance } from './signGuidance';
import { getAngleBetweenSigns, type AngleLesson } from './angles';

// =============================================================================
// TYPES
// =============================================================================

export type GuidanceContext = 'romance' | 'friendship' | 'business';

export interface ActionStep {
  frequency: 'daily' | 'weekly' | 'monthly' | 'as-needed';
  action: string;
  why: string;
}

export interface ConflictRepairStep {
  step: number;
  action: string;
  forWhom: 'A' | 'B' | 'both';
}

export interface PairGuidance {
  // Names for display
  signA: SignKey;
  signB: SignKey;
  nameA?: string;
  nameB?: string;

  // Core dynamic
  angleRelationship: AngleLesson | null;
  elementDynamic: string;
  modalityDynamic: string;

  // Susan Miller-style sections
  whatWorksNaturally: string[];
  commonPitfalls: string[];
  practicalActions: ActionStep[];
  conflictRepairPlan: ConflictRepairStep[];
  growthOpportunities: string[];

  // Deep dives
  howASeesB: string[];
  howBSeesA: string[];
  whatANeedsFromB: string[];
  whatBNeedsFromA: string[];

  // Weekly ritual suggestion
  weeklyRitual: string;
}

// =============================================================================
// ELEMENT & MODALITY DYNAMICS
// =============================================================================

type Element = 'Fire' | 'Earth' | 'Air' | 'Water';
type Modality = 'Cardinal' | 'Fixed' | 'Mutable';

const ELEMENT_DYNAMICS: Record<string, { dynamic: string; strength: string; challenge: string }> = {
  'Fire-Fire': {
    dynamic: 'Double Fire: Passionate, exciting, high-energy together',
    strength: 'Mutual enthusiasm, adventure, and inspiration',
    challenge: 'Competition, temper clashes, burnout from too much intensity',
  },
  'Fire-Earth': {
    dynamic: 'Fire + Earth: Visionary meets Builder',
    strength: 'Fire inspires, Earth manifests; dreams become reality',
    challenge: 'Fire feels slowed down, Earth feels pressured',
  },
  'Fire-Air': {
    dynamic: 'Fire + Air: Natural allies feeding each other',
    strength: 'Air fuels Fire\'s passion; Fire gives Air direction',
    challenge: 'Can burn too bright too fast; may lack grounding',
  },
  'Fire-Water': {
    dynamic: 'Fire + Water: Steam or extinguishment',
    strength: 'Passion meets depth; transformative potential',
    challenge: 'Fire can feel dampened, Water can feel overwhelmed',
  },
  'Earth-Earth': {
    dynamic: 'Double Earth: Solid, stable, building together',
    strength: 'Shared values around security, quality, and commitment',
    challenge: 'Can become too routine; may resist needed change',
  },
  'Earth-Air': {
    dynamic: 'Earth + Air: Practical meets Conceptual',
    strength: 'Air brings ideas, Earth brings implementation',
    challenge: 'Air feels restricted, Earth feels destabilized by change',
  },
  'Earth-Water': {
    dynamic: 'Earth + Water: Nurturing practicality',
    strength: 'Water nourishes Earth\'s growth; stable emotional support',
    challenge: 'Can become insular; Earth may dismiss Water\'s emotions',
  },
  'Air-Air': {
    dynamic: 'Double Air: Mental connection, endless conversation',
    strength: 'Intellectual stimulation, social harmony, shared ideas',
    challenge: 'May stay in head, avoid emotional depth',
  },
  'Air-Water': {
    dynamic: 'Air + Water: Mind meets Heart',
    strength: 'Balance of logic and intuition; growth potential',
    challenge: 'Air intellectualizes emotions, Water feels unheard',
  },
  'Water-Water': {
    dynamic: 'Double Water: Deep emotional ocean',
    strength: 'Profound emotional understanding and empathy',
    challenge: 'Can drown in emotions; may lack practicality',
  },
};

const MODALITY_DYNAMICS: Record<string, { dynamic: string; workflow: string }> = {
  'Cardinal-Cardinal': {
    dynamic: 'Both initiators—lots of starts, potential power struggles',
    workflow: 'Take turns leading different projects; respect each other\'s initiatives',
  },
  'Cardinal-Fixed': {
    dynamic: 'Cardinal starts, Fixed sustains—complementary when respected',
    workflow: 'Cardinal brings ideas, Fixed maintains and deepens; natural division',
  },
  'Cardinal-Mutable': {
    dynamic: 'Cardinal initiates, Mutable adapts—flexible partnership',
    workflow: 'Cardinal sets direction, Mutable fine-tunes; communication is key',
  },
  'Fixed-Fixed': {
    dynamic: 'Both stubborn—deep commitment or immovable standoffs',
    workflow: 'Choose battles wisely; once committed, unbreakable bond',
  },
  'Fixed-Mutable': {
    dynamic: 'Fixed provides stability, Mutable provides flexibility',
    workflow: 'Fixed anchors, Mutable helps Fixed adapt; balance consistency with change',
  },
  'Mutable-Mutable': {
    dynamic: 'Both flexible—adaptable but may lack direction',
    workflow: 'Create structure together; schedule decisions to avoid drift',
  },
};

// =============================================================================
// GUIDANCE GENERATION
// =============================================================================

function getElementDynamic(elA: Element, elB: Element): { dynamic: string; strength: string; challenge: string } {
  const key = elA === elB ? `${elA}-${elB}` : [elA, elB].sort().join('-');
  return ELEMENT_DYNAMICS[key] || ELEMENT_DYNAMICS[`${elA}-${elB}`] || ELEMENT_DYNAMICS[`${elB}-${elA}`];
}

function getModalityDynamic(modA: Modality, modB: Modality): { dynamic: string; workflow: string } {
  const key = modA === modB ? `${modA}-${modB}` : [modA, modB].sort().join('-');
  return MODALITY_DYNAMICS[key] || MODALITY_DYNAMICS[`${modA}-${modB}`] || MODALITY_DYNAMICS[`${modB}-${modA}`];
}

/**
 * Build comprehensive pair guidance
 */
export function buildPairGuidance(
  signA: SignKey,
  signB: SignKey,
  context: GuidanceContext = 'romance',
  nameA?: string,
  nameB?: string
): PairGuidance {
  const lessonA = SIGN_LESSONS[signA];
  const lessonB = SIGN_LESSONS[signB];
  const guidanceA = SIGN_GUIDANCE[signA];
  const guidanceB = SIGN_GUIDANCE[signB];

  const angle = getAngleBetweenSigns(signA, signB);
  const elDynamic = getElementDynamic(lessonA.element as Element, lessonB.element as Element);
  const modDynamic = getModalityDynamic(lessonA.modality as Modality, lessonB.modality as Modality);

  const displayA = nameA || signA;
  const displayB = nameB || signB;

  // ═══════════════════════════════════════════════════════════════════════════
  // WHAT WORKS NATURALLY
  // ═══════════════════════════════════════════════════════════════════════════

  const whatWorksNaturally: string[] = [
    elDynamic.strength,
    `${displayA} provides: ${guidanceA.appreciationTriggers[0]}`,
    `${displayB} provides: ${guidanceB.appreciationTriggers[0]}`,
  ];

  if (angle && angle.nature === 'harmonious') {
    whatWorksNaturally.push(`Your ${angle.name} (${angle.degrees}°) creates natural flow and cooperation`);
  }

  if (lessonA.element === lessonB.element) {
    whatWorksNaturally.push(`Same element (${lessonA.element}): You speak the same energetic language`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // COMMON PITFALLS
  // ═══════════════════════════════════════════════════════════════════════════

  const commonPitfalls: string[] = [
    elDynamic.challenge,
    `${displayA} under stress may: ${guidanceA.stressBehaviors[0]}`,
    `${displayB} under stress may: ${guidanceB.stressBehaviors[0]}`,
  ];

  // Add processing speed mismatch warning
  if (guidanceA.processingSpeed !== guidanceB.processingSpeed) {
    const fast = guidanceA.processingSpeed === 'fast' ? displayA : displayB;
    const slow = guidanceA.processingSpeed === 'slow' ? displayA : displayB;
    commonPitfalls.push(`Processing mismatch: ${fast} processes quickly while ${slow} needs more time`);
  }

  if (angle && (angle.nature === 'dynamic' || angle.nature === 'awkward')) {
    commonPitfalls.push(`Your ${angle.name} (${angle.degrees}°) creates friction that requires conscious navigation`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRACTICAL ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const practicalActions: ActionStep[] = [
    {
      frequency: 'daily',
      action: `${displayB}: Offer ${displayA} ${guidanceA.dailyNeeds[0].toLowerCase()}`,
      why: `This is ${displayA}'s core daily need`,
    },
    {
      frequency: 'daily',
      action: `${displayA}: Provide ${displayB} ${guidanceB.dailyNeeds[0].toLowerCase()}`,
      why: `This is ${displayB}'s core daily need`,
    },
    {
      frequency: 'weekly',
      action: `Schedule dedicated quality time that honors both your love languages`,
      why: `${displayA} values ${guidanceA.loveLanguages[0]}, ${displayB} values ${guidanceB.loveLanguages[0]}`,
    },
    {
      frequency: 'monthly',
      action: `Have a relationship check-in: "What's working? What needs adjustment?"`,
      why: `Prevents small issues from becoming big problems`,
    },
    {
      frequency: 'as-needed',
      action: `When ${displayA} shows ${guidanceA.stressBehaviors[0].toLowerCase()}, ${displayB} should ${guidanceA.repairStrategies[0].toLowerCase()}`,
      why: `This is ${displayA}'s repair pathway`,
    },
    {
      frequency: 'as-needed',
      action: `When ${displayB} shows ${guidanceB.stressBehaviors[0].toLowerCase()}, ${displayA} should ${guidanceB.repairStrategies[0].toLowerCase()}`,
      why: `This is ${displayB}'s repair pathway`,
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // CONFLICT REPAIR PLAN
  // ═══════════════════════════════════════════════════════════════════════════

  const conflictRepairPlan: ConflictRepairStep[] = [
    {
      step: 1,
      action: 'Pause and separate before escalation. Name the emotional state.',
      forWhom: 'both',
    },
    {
      step: 2,
      action: guidanceA.processingSpeed === 'slow'
        ? `Give ${displayA} time to process (${guidanceA.processingSpeed} processor)`
        : `${displayA} can engage when ready (${guidanceA.processingSpeed} processor)`,
      forWhom: 'A',
    },
    {
      step: 3,
      action: guidanceB.processingSpeed === 'slow'
        ? `Give ${displayB} time to process (${guidanceB.processingSpeed} processor)`
        : `${displayB} can engage when ready (${guidanceB.processingSpeed} processor)`,
      forWhom: 'B',
    },
    {
      step: 4,
      action: `${displayB} acknowledges ${displayA}'s core need: "${guidanceA.dailyNeeds[0]}"`,
      forWhom: 'B',
    },
    {
      step: 5,
      action: `${displayA} acknowledges ${displayB}'s core need: "${guidanceB.dailyNeeds[0]}"`,
      forWhom: 'A',
    },
    {
      step: 6,
      action: `Apply repair: ${displayA} needs "${guidanceA.repairStrategies[0]}"`,
      forWhom: 'B',
    },
    {
      step: 7,
      action: `Apply repair: ${displayB} needs "${guidanceB.repairStrategies[0]}"`,
      forWhom: 'A',
    },
    {
      step: 8,
      action: 'Reconnect physically and verbally. Plan one small action each person will take.',
      forWhom: 'both',
    },
    {
      step: 9,
      action: 'Schedule a follow-up check-in for 24-48 hours later.',
      forWhom: 'both',
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // GROWTH OPPORTUNITIES
  // ═══════════════════════════════════════════════════════════════════════════

  const growthOpportunities: string[] = [
    `${displayA} can grow by: ${guidanceA.growthPractices[0]}`,
    `${displayB} can grow by: ${guidanceB.growthPractices[0]}`,
    modDynamic.workflow,
  ];

  if (angle && angle.growthOpportunity) {
    growthOpportunities.push(`Your ${angle.name} teaches: ${angle.growthOpportunity}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PERSPECTIVES
  // ═══════════════════════════════════════════════════════════════════════════

  const howASeesB: string[] = [
    `${displayA} sees ${displayB} as ${lessonB.element} energy`,
    `${displayA} appreciates when ${displayB}: ${guidanceB.appreciationTriggers[0]}`,
    `${displayA} may be confused when ${displayB}: ${guidanceB.stressBehaviors[0]}`,
  ];

  const howBSeesA: string[] = [
    `${displayB} sees ${displayA} as ${lessonA.element} energy`,
    `${displayB} appreciates when ${displayA}: ${guidanceA.appreciationTriggers[0]}`,
    `${displayB} may be confused when ${displayA}: ${guidanceA.stressBehaviors[0]}`,
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // NEEDS
  // ═══════════════════════════════════════════════════════════════════════════

  const whatANeedsFromB: string[] = [
    guidanceA.dailyNeeds[0],
    guidanceA.dailyNeeds[1],
    `Communication style: ${guidanceA.conflictStyle}`,
    `Avoid: ${guidanceA.doNotDo[0]}`,
  ];

  const whatBNeedsFromA: string[] = [
    guidanceB.dailyNeeds[0],
    guidanceB.dailyNeeds[1],
    `Communication style: ${guidanceB.conflictStyle}`,
    `Avoid: ${guidanceB.doNotDo[0]}`,
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // WEEKLY RITUAL
  // ═══════════════════════════════════════════════════════════════════════════

  const weeklyRitual = generateWeeklyRitual(signA, signB, guidanceA, guidanceB, displayA, displayB, context);

  return {
    signA,
    signB,
    nameA,
    nameB,
    angleRelationship: angle,
    elementDynamic: elDynamic.dynamic,
    modalityDynamic: modDynamic.dynamic,
    whatWorksNaturally,
    commonPitfalls,
    practicalActions,
    conflictRepairPlan,
    growthOpportunities,
    howASeesB,
    howBSeesA,
    whatANeedsFromB,
    whatBNeedsFromA,
    weeklyRitual,
  };
}

/**
 * Generate a context-appropriate weekly ritual
 */
function generateWeeklyRitual(
  signA: SignKey,
  signB: SignKey,
  guidanceA: SignGuidance,
  guidanceB: SignGuidance,
  displayA: string,
  displayB: string,
  context: GuidanceContext
): string {
  const lessonA = SIGN_LESSONS[signA];
  const lessonB = SIGN_LESSONS[signB];

  // Find overlapping love languages
  const sharedLanguage = guidanceA.loveLanguages.find(l => guidanceB.loveLanguages.includes(l))
    || 'Quality Time';

  if (context === 'romance') {
    if (sharedLanguage === 'Quality Time') {
      return `Weekly Date Ritual: Set aside 2 hours with phones away. ${displayA} plans one week (honoring their ${lessonA.element} nature), ${displayB} plans the next (honoring their ${lessonB.element} nature). End each date with: "One thing I appreciated about you this week..."`;
    }
    if (sharedLanguage === 'Physical Touch') {
      return `Weekly Connection Ritual: Create a 20-minute "tech-free touch" time—massage, cuddling, or simply holding hands while talking. This recharges both your emotional batteries.`;
    }
    if (sharedLanguage === 'Words of Affirmation') {
      return `Weekly Appreciation Ritual: Each person writes 3 specific things they appreciated about their partner that week. Read them aloud over dinner. Keep the notes in a jar for hard days.`;
    }
    if (sharedLanguage === 'Acts of Service') {
      return `Weekly Support Ritual: Each person completes one task that helps the other's week go smoother. ${displayA} might handle ${guidanceB.dailyNeeds[0].toLowerCase()}-related needs, ${displayB} supports ${guidanceA.dailyNeeds[0].toLowerCase()}.`;
    }
    return `Weekly Connection Ritual: 30-minute check-in every Sunday. Ask: "How are you feeling about us?" and "What do you need from me this week?" Listen without fixing.`;
  }

  if (context === 'business') {
    return `Weekly Sync Ritual: 30-minute planning session. ${displayA} brings ${lessonA.element} perspective (${lessonA.element === 'Fire' || lessonA.element === 'Air' ? 'ideas and strategy' : 'practical execution'}), ${displayB} brings ${lessonB.element} perspective. Align on top 3 priorities.`;
  }

  // Friendship
  return `Weekly Connection Ritual: Regular catch-up time—could be walking, coffee, or video call. ${displayA} appreciates ${guidanceA.appreciationTriggers[0].toLowerCase()}, ${displayB} appreciates ${guidanceB.appreciationTriggers[0].toLowerCase()}. Make space for both.`;
}

// =============================================================================
// EXPORTS
// =============================================================================

export default buildPairGuidance;
