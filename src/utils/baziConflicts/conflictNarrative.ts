/**
 * ============================================================================
 * CONFLICT NARRATIVE - Story Mode for Beginners
 * ============================================================================
 *
 * This module generates engaging, beginner-friendly narratives about conflicts.
 * Following the "Khan Academy Show Your Work" philosophy, we explain complex
 * BaZi conflict concepts through relatable stories and metaphors.
 *
 * Created: January 2026
 * ============================================================================
 */

import { ConflictAnalysis, ConflictHit, ConflictType } from './conflictEngine';
import { ClashHit } from './clashRules';
import { HarmHit } from './harmRules';
import { PunishmentHit } from './punishmentRules';
import { DestructionHit } from './destructionRules';

// ============================================================================
// TYPES
// ============================================================================

export interface ConflictStory {
  title: string;
  introduction: string;
  conflictNarratives: {
    type: ConflictType;
    headline: string;
    story: string;
    metaphor: string;
    lifeTip: string;
  }[];
  overallMessage: string;
  closingWisdom: string;
}

// ============================================================================
// METAPHOR LIBRARY
// ============================================================================

const CONFLICT_METAPHORS = {
  clash: {
    general: 'Like two strong magnets with the same pole facing each other - they naturally push apart, creating space for new possibilities.',
    '子午': 'Like ice meeting fire - transformation is inevitable. The steam that rises can power great things.',
    '丑未': 'Like two treasure chests competing to store the family jewels - something must give, or something must grow.',
    '寅申': 'Like two express trains on crossing tracks - exciting, dynamic, and full of travel energy.',
    '卯酉': 'Like two flowers blooming in the same spotlight - beautiful tension that draws attention.',
    '辰戌': 'Like two dragons guarding different gates - powerful forces that can shake foundations.',
    '巳亥': 'Like a campfire meeting a waterfall - dramatic, transformative, and impossible to ignore.'
  },
  harm: {
    general: 'Like a splinter under the skin - not dangerous, but persistently annoying until addressed.',
    '子未': 'Like rain slowly eroding a sandcastle - emotions can wear down even solid foundations.',
    '丑午': 'Like a wet blanket over a campfire - practicality can dim the flames of passion.',
    '寅巳': 'Like partners who disagree on timing - one says "now," the other says "wait."',
    '卯辰': 'Like vines growing over a grand monument - small things can obscure big ambitions.',
    '申亥': 'Like overthinking a simple decision - the mind can cloud what the heart knows.',
    '酉戌': 'Like a diamond in rough packaging - value not recognized because it\'s not shown.'
  },
  punishment: {
    self: 'Like being your own harshest judge - the courtroom is in your mind, and you rarely grant yourself mercy.',
    mutual_ungrateful: 'Like three colleagues who helped each other succeed but forgot to say thank you.',
    mutual_bullying: 'Like a power struggle where everyone insists they\'re right and nobody backs down.',
    uncivilized: 'Like guests who ignore the house rules - boundaries are tested and social norms forgotten.'
  },
  destruction: {
    general: 'Like a small crack in a phone screen - annoying but functional, a reminder that perfection is fleeting.',
    '子酉': 'Like spilling coffee on your to-do list - the plan is still there, just a bit harder to read.',
    '午卯': 'Like starting to run before tying your shoes - enthusiasm outpaces preparation.',
    '辰丑': 'Like having two savings accounts that both need deposits - resources feel stretched.',
    '戌未': 'Like trying to protect and nurture at the same time - sometimes care feels like control.',
    '寅亥': 'Like drinking wisdom too fast to digest - knowledge needs time to become understanding.',
    '巳申': 'Like fireworks - brilliant and brief, leaving you wanting more.'
  }
};

// ============================================================================
// HEADLINE GENERATORS
// ============================================================================

function generateClashHeadline(hit: ClashHit): string {
  const headlines: Record<string, string> = {
    '子午': '🔥 Fire Meets Water: The Great Transformation',
    '丑未': '🏛️ Storage Wars: Hidden Resources Compete',
    '寅申': '✈️ The Traveling Horses: Movement and Change',
    '卯酉': '🌸 Peach Blossom Clash: Relationship Dynamics',
    '辰戌': '🐉 Dragons and Dogs: Foundations Shake',
    '巳亥': '💫 Snake and Pig: Action Meets Wisdom'
  };
  const key = `${hit.branch1}${hit.branch2}`;
  const reverseKey = `${hit.branch2}${hit.branch1}`;
  return headlines[key] || headlines[reverseKey] || '⚡ Clash Detected: Energy in Motion';
}

function generateHarmHeadline(hit: HarmHit): string {
  const headlines: Record<string, string> = {
    '子未': '💧 Emotional Undertow',
    '丑午': '🔇 Passion Dimmed',
    '寅巳': '⏰ Timing Troubles',
    '卯辰': '🧩 Details vs. Dreams',
    '申亥': '🧠 Overthinking Alert',
    '酉戌': '💎 Hidden Value'
  };
  const key = `${hit.branch1}${hit.branch2}`;
  const reverseKey = `${hit.branch2}${hit.branch1}`;
  return headlines[key] || headlines[reverseKey] || '😤 Subtle Friction Detected';
}

function generatePunishmentHeadline(hit: PunishmentHit): string {
  if (hit.punishmentType === 'self') {
    return '🪞 The Inner Critic: Self-Punishment Pattern';
  } else if (hit.punishmentType === 'mutual_ungrateful') {
    return '🤝 The Forgotten Favors: Ungrateful Triangle';
  } else if (hit.punishmentType === 'mutual_bullying') {
    return '👊 The Power Struggle: Bullying Triangle';
  } else {
    return '🚫 Boundaries Crossed: Uncivilized Punishment';
  }
}

function generateDestructionHeadline(hit: DestructionHit): string {
  return '🔨 Minor Cracks: Small Disruptions Ahead';
}

// ============================================================================
// STORY GENERATORS
// ============================================================================

function generateClashStory(hit: ClashHit): string {
  const { pillar1, pillar2, definition } = hit;

  const pillarMeanings: Record<string, string> = {
    year: 'your early life, ancestors, and social image',
    month: 'your career, parents, and adult foundation',
    day: 'your core self, spouse, and personal identity',
    hour: 'your children, legacy, and future aspirations'
  };

  return `In your chart, the ${pillar1} pillar (representing ${pillarMeanings[pillar1]}) and the ${pillar2} pillar (representing ${pillarMeanings[pillar2]}) are in direct opposition.

This is the ${definition.nature} - ${definition.effect}

**The Good News:** ${definition.positiveAspect}

**The Challenge:** ${definition.negativeAspect}

This clash brings movement and change to the areas of life represented by these pillars. Rather than fighting the current, learn to surf the waves.`;
}

function generateHarmStory(hit: HarmHit): string {
  const { pillar1, pillar2, definition } = hit;

  return `Your ${pillar1} and ${pillar2} pillars carry a subtle friction pattern - the ${definition.nature}.

${definition.effect}

**How it shows up:** ${definition.manifestation}

Unlike a dramatic clash, harm is more like background noise - always there, quietly draining energy. The key is awareness. Once you recognize the pattern, you can address it before it accumulates.

**Practical tip:** ${definition.remedy}`;
}

function generatePunishmentStory(hit: PunishmentHit): string {
  const { punishmentType, definition, isComplete, pillars } = hit;

  if (punishmentType === 'self') {
    return `Your chart shows self-punishment - the ${definition.chineseName}.

${definition.effect}

**How it manifests:** ${definition.manifestation}

This isn't about external conflict - it's about the pressure you put on yourself. The ${pillars.join(' and ')} pillars both carry the same energy, creating an echo chamber of self-expectation.

**Breaking the pattern:** ${definition.remedy}`;
  }

  const completeness = isComplete
    ? 'All three branches of this triangle are present in your chart, making this pattern fully activated.'
    : 'Two of the three branches are present, creating a partial but still significant pattern.';

  return `Your chart contains the ${definition.chineseName} - a powerful triangular tension.

${definition.effect}

${completeness}

**Life areas affected:** The ${pillars.join(', ')} pillars are involved, touching multiple areas of your life.

**How it manifests:** ${definition.manifestation}

**Working with this energy:** ${definition.remedy}`;
}

function generateDestructionStory(hit: DestructionHit): string {
  const { pillar1, pillar2, definition } = hit;

  return `A minor destruction pattern exists between your ${pillar1} and ${pillar2} pillars.

${definition.effect}

**What to expect:** ${definition.manifestation}

Destruction is the gentlest of the four conflict types. Think of it as the universe's way of keeping you flexible - small interruptions that prevent you from becoming too rigid.

**Practical approach:** ${definition.remedy}`;
}

// ============================================================================
// MAIN NARRATIVE BUILDER
// ============================================================================

/**
 * Build a complete story from conflict analysis
 */
export function buildConflictStory(analysis: ConflictAnalysis): ConflictStory {
  const { summary, allHits } = analysis;

  // Generate title based on overall severity
  let title: string;
  if (!summary.hasConflict) {
    title = '☯️ Harmonious Flow: Your Chart in Balance';
  } else if (summary.severityScore >= 70) {
    title = '🌊 Dynamic Tensions: Navigating Your Chart\'s Challenges';
  } else if (summary.severityScore >= 40) {
    title = '⚡ Creative Friction: Growth Through Challenge';
  } else {
    title = '🌤️ Minor Ripples: Small Adjustments Ahead';
  }

  // Generate introduction
  const introduction = generateIntroduction(summary);

  // Generate individual conflict narratives
  const conflictNarratives = allHits.slice(0, 5).map(hit => {
    let headline: string;
    let story: string;
    let metaphor: string;
    let lifeTip: string;

    if (hit.type === 'clash') {
      const clashHit = hit as ClashHit;
      headline = generateClashHeadline(clashHit);
      story = generateClashStory(clashHit);
      const key = `${clashHit.branch1}${clashHit.branch2}`;
      metaphor = CONFLICT_METAPHORS.clash[key as keyof typeof CONFLICT_METAPHORS.clash]
        || CONFLICT_METAPHORS.clash.general;
      lifeTip = 'Embrace change. What seems like opposition may be the universe creating space for something new.';
    } else if (hit.type === 'harm') {
      const harmHit = hit as HarmHit;
      headline = generateHarmHeadline(harmHit);
      story = generateHarmStory(harmHit);
      const key = `${harmHit.branch1}${harmHit.branch2}`;
      metaphor = CONFLICT_METAPHORS.harm[key as keyof typeof CONFLICT_METAPHORS.harm]
        || CONFLICT_METAPHORS.harm.general;
      lifeTip = 'Address small irritations early. Prevention is easier than cure.';
    } else if (hit.type === 'punishment') {
      const punishmentHit = hit as PunishmentHit;
      headline = generatePunishmentHeadline(punishmentHit);
      story = generatePunishmentStory(punishmentHit);
      metaphor = CONFLICT_METAPHORS.punishment[punishmentHit.punishmentType as keyof typeof CONFLICT_METAPHORS.punishment]
        || CONFLICT_METAPHORS.punishment.self;
      lifeTip = 'Transform pressure into progress. Your greatest challenges often become your greatest strengths.';
    } else {
      const destructionHit = hit as DestructionHit;
      headline = generateDestructionHeadline(destructionHit);
      story = generateDestructionStory(destructionHit);
      const key = `${destructionHit.branch1}${destructionHit.branch2}`;
      metaphor = CONFLICT_METAPHORS.destruction[key as keyof typeof CONFLICT_METAPHORS.destruction]
        || CONFLICT_METAPHORS.destruction.general;
      lifeTip = 'Stay flexible. Small setbacks are just course corrections, not roadblocks.';
    }

    return {
      type: hit.type as ConflictType,
      headline,
      story,
      metaphor,
      lifeTip
    };
  });

  // Generate overall message
  const overallMessage = generateOverallMessage(summary);

  // Generate closing wisdom
  const closingWisdom = generateClosingWisdom(summary);

  return {
    title,
    introduction,
    conflictNarratives,
    overallMessage,
    closingWisdom
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateIntroduction(summary: import('./conflictEngine').ConflictSummary): string {
  if (!summary.hasConflict) {
    return `Your chart shows remarkable harmony between the branches. Like a well-tuned orchestra, the different parts of your life work together rather than against each other.

This doesn't mean life is without challenge - but your internal wiring is aligned, giving you a stable foundation to handle external pressures.`;
  }

  const parts: string[] = [];

  parts.push(`Your chart contains ${summary.totalConflicts} conflict pattern${summary.totalConflicts > 1 ? 's' : ''}.`);

  if (summary.severityScore >= 60) {
    parts.push('This creates a dynamic, energetic chart - one that pushes you to grow, adapt, and transform.');
  } else if (summary.severityScore >= 30) {
    parts.push('These create moderate tension that adds color and challenge to your journey.');
  } else {
    parts.push('These are minor patterns that create small adjustments rather than major upheavals.');
  }

  parts.push(`\nLet's explore what these patterns mean for you...`);

  return parts.join(' ');
}

function generateOverallMessage(summary: import('./conflictEngine').ConflictSummary): string {
  if (!summary.hasConflict) {
    return 'Your harmonious chart is a gift - but remember that growth often comes from challenge. Seek external experiences that push your comfort zone.';
  }

  if (summary.byType.clashes.length > 0 && summary.byType.punishments.length > 0) {
    return 'Your chart combines external change (clashes) with internal pressure (punishments). This is a transformative configuration - you are here to evolve through experience.';
  }

  if (summary.byType.harms.length > 0 && summary.byType.destructions.length > 0) {
    return 'Your chart shows subtle friction patterns. These are not dramatic challenges but persistent themes that reward patient attention.';
  }

  return 'Every conflict in your chart is an opportunity for growth. The universe gave you these tensions because it believes you can handle them.';
}

function generateClosingWisdom(summary: import('./conflictEngine').ConflictSummary): string {
  const wisdoms = [
    'Remember: the lotus grows from the mud. Your challenges are the soil for your growth.',
    'As the ancient masters said: "No pressure, no diamonds." Your chart\'s tensions are shaping something precious.',
    'The bamboo that bends in the wind survives. Flexibility is your friend.',
    'Awareness is the first step to mastery. You now see patterns you can work with.',
    'Every master was once a disaster. Your chart shows where your mastery will emerge.',
    'The river doesn\'t fight the rocks - it flows around them. So can you.'
  ];

  // Select wisdom based on severity and types
  if (summary.severityScore >= 70) {
    return wisdoms[1]; // Pressure, diamonds
  } else if (summary.byType.punishments.length > 0) {
    return wisdoms[4]; // Master, disaster
  } else if (summary.byType.clashes.length > 0) {
    return wisdoms[2]; // Bamboo, wind
  } else {
    return wisdoms[5]; // River, rocks
  }
}

/**
 * Build a brief summary for quick display
 */
export function buildConflictSummaryText(analysis: ConflictAnalysis): string {
  const { summary } = analysis;

  if (!summary.hasConflict) {
    return '✅ No significant conflicts detected. Harmonious branch relationships.';
  }

  const parts: string[] = [];

  if (summary.byType.clashes.length > 0) {
    parts.push(`⚡ ${summary.byType.clashes.length} Clash`);
  }
  if (summary.byType.punishments.length > 0) {
    parts.push(`🔥 ${summary.byType.punishments.length} Punishment`);
  }
  if (summary.byType.harms.length > 0) {
    parts.push(`😤 ${summary.byType.harms.length} Harm`);
  }
  if (summary.byType.destructions.length > 0) {
    parts.push(`🔨 ${summary.byType.destructions.length} Destruction`);
  }

  return parts.join(' | ') + ` | Severity: ${summary.severityScore}/100`;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  buildConflictStory,
  buildConflictSummaryText
};
