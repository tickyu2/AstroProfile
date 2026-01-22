/**
 * ============================================
 * PILGRIM JOURNEY MARKDOWN TEMPLATES
 * Ceremonial journey templates for guided
 * metaphysical curriculum
 * ============================================
 */

import { CodexEntry, KnowledgeCodex, JourneyChamber, JOURNEY_CHAMBERS } from '../codexTypes';
import { PilgrimJourney, JourneyStep } from '../codexTypes';

/**
 * Generate trial description based on entry characteristics
 */
function generateTrialDescription(entry: CodexEntry): string {
  const trialsByEffect: Record<string, string> = {
    'beneficial': `The pilgrim must recognize this blessing without attachment.
Can you receive fortune without grasping? Can you accept support without dependency?
The trial is gratitude without expectation.`,

    'challenging': `The pilgrim must face this difficulty without flinching.
Not to fight it, not to flee it, but to understand its teaching.
The trial is courage without aggression.`,

    'mixed': `The pilgrim must hold contradiction without resolution.
Both gift and burden, both shadow and light—they coexist here.
The trial is wisdom without certainty.`,

    'neutral': `The pilgrim must observe without interference.
Some patterns simply exist, asking neither praise nor blame.
The trial is awareness without judgment.`
  };

  return trialsByEffect[entry.effect] || trialsByEffect['neutral'];
}

/**
 * Generate insight based on entry
 */
function generateInsight(entry: CodexEntry): string {
  // Create insight from interpretation
  const interpretation = entry.explanation.interpretation;
  const firstSentence = interpretation.split('.')[0] + '.';

  const insightTemplates: Record<string, string> = {
    'structure': `The foundation reveals itself: ${firstSentence} Structure is not prison—it is architecture of the soul.`,
    'seasonal': `The seasons teach: ${firstSentence} Time's flow shapes all; align with it rather than resist.`,
    'useful_god': `The guide speaks: ${firstSentence} Support exists for those who recognize where to look.`,
    'combination': `The merger shows: ${firstSentence} Combination changes nature—what joins emerges transformed.`,
    'clash': `The collision teaches: ${firstSentence} Conflict clears what no longer serves.`,
    'harm': `The hidden wound reveals: ${firstSentence} What hides beneath the surface still affects the whole.`,
    'punishment': `The lesson inscribes: ${firstSentence} Karma is not revenge but education.`,
    'hidden_stem': `The buried root shows: ${firstSentence} Potential sleeps underground, awaiting its season.`,
    'luck_pillar': `The turning wheel reveals: ${firstSentence} Time brings what was hidden into light.`,
    'shen_sha': `The star speaks: ${firstSentence} Celestial influences touch mortal paths.`
  };

  return insightTemplates[entry.rule.category] || `The insight emerges: ${firstSentence}`;
}

/**
 * Generate transformation statement
 */
function generateTransformation(entry: CodexEntry): string {
  const transformations: Record<string, string> = {
    'beneficial': `Having received this blessing, the pilgrim is strengthened.
Not changed in essence, but confirmed in purpose.
The journey continues with renewed vitality.`,

    'challenging': `Having faced this trial, the pilgrim is tempered.
Not broken, but refined—like metal through fire.
What remains is stronger than what was lost.`,

    'mixed': `Having held this paradox, the pilgrim gains depth.
Not resolved into simplicity, but expanded into complexity.
Wisdom grows in the space between opposites.`,

    'neutral': `Having witnessed this truth, the pilgrim is informed.
Not transformed, but illuminated.
Knowledge itself is the gift of this chamber.`
  };

  return transformations[entry.effect] || transformations['neutral'];
}

/**
 * Generate Markdown for a single journey step
 */
export function renderJourneyStepMarkdown(
  step: JourneyStep,
  stepNumber: number,
  totalSteps: number
): string {
  const lines: string[] = [];
  const entry = step.entry;

  lines.push(`# Pilgrim Journey — Step ${stepNumber} of ${totalSteps}`);
  lines.push(`## Chamber: ${step.chamber.name} (${step.chamber.chineseName})`);
  lines.push(`### Rule: ${entry.explanation.title}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // The Teaching
  lines.push('## The Teaching');
  lines.push(step.narrative);
  lines.push('');
  if (step.narrativeChinese) {
    lines.push(`> 「${step.narrativeChinese}」`);
    lines.push('');
  }
  lines.push('---');
  lines.push('');

  // The Trial
  lines.push('## The Trial');
  lines.push(generateTrialDescription(entry));
  lines.push('');
  lines.push('---');
  lines.push('');

  // The Insight
  lines.push('## The Insight');
  lines.push(generateInsight(entry));
  lines.push('');
  lines.push('---');
  lines.push('');

  // The Transformation
  lines.push('## The Transformation');
  lines.push(generateTransformation(entry));
  lines.push('');
  lines.push('---');
  lines.push('');

  // The Next Gate
  lines.push('## The Next Gate');
  if (stepNumber < totalSteps) {
    lines.push(`The journey continues. Step ${stepNumber + 1} awaits in the next chamber.`);
  } else {
    lines.push('This is the final step. The Cathedral\'s gates open to release you back into the world.');
  }

  return lines.join('\n');
}

/**
 * Generate full Pilgrim Journey document
 */
export function renderFullJourneyMarkdown(journey: PilgrimJourney): string {
  const lines: string[] = [];

  // Title page
  lines.push('# ═══════════════════════════════════════');
  lines.push('#         THE PILGRIM\'S JOURNEY');
  lines.push('#         命理朝圣之旅');
  lines.push('# ═══════════════════════════════════════');
  lines.push('');
  lines.push(`*${journey.steps.length} steps through ${journey.chambers.length} chambers*`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Introduction
  lines.push('## The Journey Begins');
  lines.push('');
  lines.push(journey.introduction);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Chamber map
  lines.push('## The Chambers');
  lines.push('');
  for (const chamber of journey.chambers) {
    const chamberSteps = journey.steps.filter(s => s.chamber.id === chamber.id);
    lines.push(`### ${chamber.iconHint} ${chamber.name} (${chamber.chineseName})`);
    lines.push(`*${chamberSteps.length} step(s)*`);
    lines.push('');
    lines.push(chamber.description);
    lines.push('');
  }
  lines.push('---');
  lines.push('');

  // All steps
  lines.push('## The Steps');
  lines.push('');

  let currentChamberId: string | null = null;

  for (let i = 0; i < journey.steps.length; i++) {
    const step = journey.steps[i];

    // Chamber header if changed
    if (currentChamberId !== step.chamber.id) {
      currentChamberId = step.chamber.id;
      lines.push('');
      lines.push(`## ═══ Entering: ${step.chamber.name} ═══`);
      lines.push(`### ${step.chamber.chineseName}`);
      lines.push('');
      lines.push(`*${step.chamber.description}*`);
      lines.push('');
    }

    lines.push(renderJourneyStepMarkdown(step, i + 1, journey.steps.length));
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  // Conclusion
  lines.push('## The Journey Ends');
  lines.push('');
  lines.push('═══════════════════════════════════════');
  lines.push('');
  lines.push(journey.conclusion);
  lines.push('');
  lines.push('═══════════════════════════════════════');

  return lines.join('\n');
}

/**
 * Generate journey index/map
 */
export function renderJourneyMapMarkdown(journey: PilgrimJourney): string {
  const lines: string[] = [];

  lines.push('# Pilgrim Journey — Map');
  lines.push('');
  lines.push('## Chamber Overview');
  lines.push('');

  for (const chamber of JOURNEY_CHAMBERS) {
    const chamberSteps = journey.steps.filter(s => s.chamber.id === chamber.id);
    const isActive = chamberSteps.length > 0;

    if (isActive) {
      lines.push(`### ${chamber.iconHint} ${chamber.name}`);
      lines.push(`**${chamber.chineseName}** — ${chamberSteps.length} step(s)`);
      lines.push('');
      for (const step of chamberSteps) {
        lines.push(`- Step ${step.order}: ${step.title}`);
      }
      lines.push('');
    } else {
      lines.push(`### ○ ${chamber.name}`);
      lines.push(`*No findings in this chamber*`);
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Generate condensed journey script for voice narration
 */
export function renderVoiceJourneyScript(journey: PilgrimJourney): string {
  const lines: string[] = [];

  lines.push('=== PILGRIM JOURNEY VOICE SCRIPT ===');
  lines.push('');

  // Opening
  lines.push('[OPENING]');
  lines.push(journey.introduction);
  lines.push('');
  lines.push('[PAUSE 3 seconds]');
  lines.push('');

  // Steps
  let currentChamberId: string | null = null;

  for (const step of journey.steps) {
    if (currentChamberId !== step.chamber.id) {
      currentChamberId = step.chamber.id;
      lines.push(`[CHAMBER: ${step.chamber.name}]`);
      lines.push(step.chamber.description);
      lines.push('[PAUSE 2 seconds]');
      lines.push('');
    }

    lines.push(`[STEP ${step.order}]`);
    lines.push(step.narrative);
    lines.push('[PAUSE 1.5 seconds]');
    lines.push('');
  }

  // Closing
  lines.push('[CLOSING]');
  lines.push(journey.conclusion);
  lines.push('');
  lines.push('=== END SCRIPT ===');

  return lines.join('\n');
}

export {
  generateTrialDescription,
  generateInsight,
  generateTransformation
};
