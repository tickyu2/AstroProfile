/**
 * ============================================================================
 * BAZI STRUCTURE NARRATIVE BUILDER
 * ============================================================================
 *
 * Gentle, Khan-Academy-style narratives for BaZi Structure (格局).
 * Designed for beginners who want to understand their chart's "operating system"
 * without being overwhelmed by technical jargon.
 *
 * Created: January 2026
 * Philosophy: Help people understand their chart's strategic orientation
 * ============================================================================
 */

import {
  StructureResult,
  StructureType,
  StructureDefinition,
  STRUCTURE_DEFINITIONS
} from './baziStructure';

// ============================================================================
// STRUCTURE METAPHORS
// ============================================================================

const STRUCTURE_METAPHORS: Record<StructureType, {
  metaphor: string;
  lifeTheme: string;
  naturalPath: string;
  wisdom: string;
}> = {
  proper_officer: {
    metaphor: 'like a government minister rising through the ranks - respected, proper, building authority through legitimate channels',
    lifeTheme: 'Your chart is oriented toward building status and recognition through proper channels',
    naturalPath: 'You naturally gravitate toward structure, hierarchy, and established systems. Career advancement comes through playing by the rules.',
    wisdom: 'Your gift is earning respect through integrity. Your challenge is knowing when rules need to bend.'
  },

  seven_killings: {
    metaphor: 'like a general on the battlefield - powerful, strategic, achieving through force of will and determination',
    lifeTheme: 'Your chart is oriented toward power, achievement, and overcoming obstacles',
    naturalPath: 'You naturally gravitate toward challenge and competition. Success comes through strength and strategic action.',
    wisdom: 'Your gift is breaking through barriers others cannot. Your challenge is knowing when to sheathe the sword.'
  },

  direct_wealth: {
    metaphor: 'like a careful farmer - patient, steady, building abundance through consistent effort',
    lifeTheme: 'Your chart is oriented toward stable accumulation and material security',
    naturalPath: 'You naturally gravitate toward reliable income and steady growth. Financial success comes through patience and practical management.',
    wisdom: 'Your gift is building lasting prosperity. Your challenge is not being too conservative when opportunity knocks.'
  },

  indirect_wealth: {
    metaphor: 'like a merchant on the Silk Road - opportunistic, adaptable, finding value where others see only risk',
    lifeTheme: 'Your chart is oriented toward opportunity and multiple income streams',
    naturalPath: 'You naturally gravitate toward deals, speculation, and seeing possibilities. Financial success comes through calculated risk-taking.',
    wisdom: 'Your gift is spotting opportunity in chaos. Your challenge is knowing when speculation becomes gambling.'
  },

  eating_god: {
    metaphor: 'like a celebrated chef - creative, generous, bringing joy through refined expression',
    lifeTheme: 'Your chart is oriented toward creativity, expression, and enjoying life\'s pleasures',
    naturalPath: 'You naturally gravitate toward art, food, beauty, and sharing your talents. Success comes through creative expression.',
    wisdom: 'Your gift is bringing joy to others through your creations. Your challenge is maintaining drive alongside enjoyment.'
  },

  hurting_officer: {
    metaphor: 'like a brilliant inventor - innovative, questioning, seeing what needs to change',
    lifeTheme: 'Your chart is oriented toward innovation, reform, and challenging the status quo',
    naturalPath: 'You naturally gravitate toward improvement and disruption. Success comes through creative problem-solving and seeing what others miss.',
    wisdom: 'Your gift is seeing flaws in systems and creating better solutions. Your challenge is maintaining relationships while pushing for change.'
  },

  friend: {
    metaphor: 'like a skilled team captain - collaborative, independent, achieving through peer networks',
    lifeTheme: 'Your chart is oriented toward collaboration, partnerships, and self-reliance',
    naturalPath: 'You naturally gravitate toward working with equals and building strong networks. Success comes through collaborative ventures.',
    wisdom: 'Your gift is building powerful alliances of equals. Your challenge is balancing independence with cooperation.'
  },

  rob_wealth: {
    metaphor: 'like a determined competitor - assertive, driven, winning through intensity and willpower',
    lifeTheme: 'Your chart is oriented toward competition, initiative, and taking action',
    naturalPath: 'You naturally gravitate toward competitive situations where intensity wins. Success comes through decisive action.',
    wisdom: 'Your gift is winning when others hesitate. Your challenge is not turning allies into competitors.'
  },

  follow_wealth: {
    metaphor: 'like a reed in the wind - flexible, adaptive, finding strength through yielding',
    lifeTheme: 'Your chart surrenders to external wealth and opportunity',
    naturalPath: 'You naturally flow toward where resources and support exist. Success comes through adaptability rather than force.',
    wisdom: 'Your gift is flexibility and leveraging external support. Your challenge is developing inner direction.'
  },

  follow_officer: {
    metaphor: 'like a loyal soldier - devoted, structured, finding purpose through serving a greater system',
    lifeTheme: 'Your chart surrenders to authority and structure',
    naturalPath: 'You naturally thrive in organized systems with clear hierarchies. Success comes through loyalty and following structure.',
    wisdom: 'Your gift is thriving within systems. Your challenge is not losing yourself in service to others.'
  },

  follow_output: {
    metaphor: 'like a pure channel - creative, expressive, letting talent flow without ego',
    lifeTheme: 'Your chart surrenders to creative expression',
    naturalPath: 'You naturally become a conduit for creative or spiritual expression. Success comes through letting go rather than grasping.',
    wisdom: 'Your gift is pure, unblocked creativity. Your challenge is maintaining practical foundations.'
  },

  special: {
    metaphor: 'like a unique constellation - distinctive, unusual, following its own pattern',
    lifeTheme: 'Your chart has a unique configuration that doesn\'t fit standard categories',
    naturalPath: 'You naturally follow a path that may not match conventional expectations.',
    wisdom: 'Your gift is uniqueness. Your challenge is finding your own way when standard maps don\'t apply.'
  },

  unclear: {
    metaphor: 'like a versatile chameleon - adaptable, multifaceted, capable of many expressions',
    lifeTheme: 'Your chart has multiple influences without a single dominant theme',
    naturalPath: 'You naturally have many options and can adapt to different situations.',
    wisdom: 'Your gift is versatility. Your challenge is finding focus among many possibilities.'
  }
};

// ============================================================================
// MAIN NARRATIVE BUILDER
// ============================================================================

/**
 * Build a gentle, beginner-friendly narrative about Structure
 */
export function buildStructureStory(result: StructureResult): string {
  const metaphors = STRUCTURE_METAPHORS[result.structureType];
  const structure = result.structure;

  const story = `
${'═'.repeat(60)}
YOUR CHART'S STRUCTURE (格局)
${'═'.repeat(60)}

Think of your BaZi chart as having an "operating system" - a natural mode
of functioning that shapes how you approach life. This is called Structure (格局).

YOUR STRUCTURE: ${structure.han} (${structure.label})
${'─'.repeat(50)}

Your chart is ${metaphors.metaphor}.

${metaphors.lifeTheme}.

${metaphors.naturalPath}


WHAT THIS MEANS FOR YOU
${'─'.repeat(50)}

${metaphors.wisdom}

Structure Score: ${(result.structureScore * 100).toFixed(0)}% clarity
${result.structureClarity === 'clear' ? '✓ Your structure is clearly defined - its themes will be prominent in your life.' :
    result.structureClarity === 'moderate' ? '○ Your structure is moderately defined - you have flexibility in expression.' :
    '△ Your structure has mixed influences - you have multiple modes of operation.'}


YOUR STRATEGIC ORIENTATION
${'─'.repeat(50)}

Life Theme: ${structure.theme}

Natural Strengths:
${structure.strengths.map(s => `• ${s}`).join('\n')}

Growth Edges:
${structure.challenges.map(c => `• ${c}`).join('\n')}


CAREER & LIFE PATH
${'─'.repeat(50)}

Your structure naturally aligns with:
${structure.careers.slice(0, 5).map(c => `• ${c}`).join('\n')}

These aren't limits - they're areas where your chart's natural energy
flows most easily. You can succeed anywhere, but these paths offer less resistance.


RELATIONSHIPS
${'─'.repeat(50)}

${structure.relationship}


${result.secondaryStructure ? generateSecondaryInfluence(result) : ''}
${'═'.repeat(60)}
REMEMBER
${'═'.repeat(60)}

Structure is not destiny. It's your chart's natural inclination.
Like a river naturally flows downhill, your chart naturally flows
toward certain themes. Understanding this helps you:

• Work with your natural grain rather than against it
• Recognize when you're in or out of alignment
• Make strategic choices that leverage your strengths
• Understand why certain paths feel easier or harder

"Know your structure, and you know your natural strategy."
`;

  return story.trim();
}

/**
 * Generate secondary structure influence section
 */
function generateSecondaryInfluence(result: StructureResult): string {
  if (!result.secondaryStructure) return '';

  return `
SECONDARY INFLUENCE
${'─'.repeat(50)}

Your chart also shows influence from ${result.secondaryStructure.han} (${result.secondaryStructure.label}).

At ${(result.secondaryScore * 100).toFixed(0)}% strength, this creates a blend that adds:
${result.secondaryStructure.strengths.slice(0, 2).map(s => `• ${s}`).join('\n')}

This secondary influence moderates your primary structure and adds versatility.

`;
}

// ============================================================================
// DM STRENGTH NARRATIVE
// ============================================================================

/**
 * Generate narrative about how DM strength affects structure
 */
export function buildDmStructureRelationship(result: StructureResult): string {
  const dmStrength = result.dmStrength;
  const dmCategory = result.dmCategory;

  let narrative = `
DM STRENGTH & STRUCTURE RELATIONSHIP
${'─'.repeat(40)}

Your Day Master strength: ${dmStrength.toFixed(2)} (${dmCategory})

`;

  if (dmCategory === 'strong') {
    narrative += `
With a strong Day Master, you have the inner resources to fully support and
express your ${result.structure.label}. You can:
• Take initiative in your structure's domain
• Lead rather than follow
• Maintain your direction against opposition
• Express your structure's themes boldly
`;
  } else if (dmCategory === 'balanced') {
    narrative += `
With a balanced Day Master, you can support your ${result.structure.label}
while remaining adaptable. You can:
• Express your structure's themes naturally
• Adapt when circumstances require
• Receive support when needed
• Lead or follow as situations demand
`;
  } else if (dmCategory === 'weak') {
    narrative += `
With a weaker Day Master, your ${result.structure.label} benefits from
external support. Consider:
• Seeking partners or teams that complement your direction
• Building supportive environments
• Developing your structure's themes gradually
• Using luck cycles when they strengthen your DM
`;
  } else {
    narrative += `
With a very weak Day Master, your chart operates in "Follow" mode.
This isn't weakness - it's a different operating strategy:
• You achieve through adaptability rather than force
• External support becomes crucial
• Success comes from flowing with circumstances
• Your structure indicates what to flow toward
`;
  }

  return narrative.trim();
}

// ============================================================================
// INTEGRATION HELPERS
// ============================================================================

/**
 * Get a brief structure summary for cards/badges
 */
export function getStructureSummary(result: StructureResult): {
  name: string;
  icon: string;
  theme: string;
  clarity: string;
} {
  const icons: Record<string, string> = {
    officer: '⚔',
    wealth: '💰',
    output: '✨',
    companion: '👥',
    follow: '→',
    special: '◇'
  };

  return {
    name: `${result.structure.han} ${result.structure.label}`,
    icon: icons[result.structure.category] || '?',
    theme: result.structure.theme,
    clarity: `${(result.structureScore * 100).toFixed(0)}%`
  };
}

/**
 * Get career suggestions based on structure
 */
export function getStructureCareerGuidance(result: StructureResult): string[] {
  const primary = result.structure.careers;
  const secondary = result.secondaryStructure?.careers || [];

  // Merge and deduplicate
  const allCareers = [...new Set([...primary, ...secondary])];
  return allCareers.slice(0, 8);
}

/**
 * Get relationship guidance based on structure
 */
export function getStructureRelationshipGuidance(result: StructureResult): string {
  let guidance = result.structure.relationship;

  if (result.secondaryStructure) {
    guidance += `\n\nSecondary influence: ${result.secondaryStructure.relationship}`;
  }

  return guidance;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  buildStructureStory,
  buildDmStructureRelationship,
  getStructureSummary,
  getStructureCareerGuidance,
  getStructureRelationshipGuidance,
  STRUCTURE_METAPHORS
};

export { STRUCTURE_METAPHORS };
