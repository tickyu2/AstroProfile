/**
 * ============================================
 * PILGRIM JOURNEY + GENERATIONAL CONTEXT
 * The Cathedral becomes a living ancestral temple
 *
 * Binds:
 * - Personal Pilgrim Journey
 * - Generational Ladder
 * - Ancestral Threads
 * - Persona Voice
 *
 * The pilgrim can now see:
 * - Where they stand in the lineage
 * - Which themes they carry
 * - Which patterns they break
 * - Which destinies they begin
 * ============================================
 */

import { PilgrimJourney, JourneyStep } from './codexTypes';
import {
  GenerationalLadder,
  GenerationalThread,
  GenerationNode,
  getGeneration,
  getThreadsForGeneration
} from './generationalLadder';

// ==================== DATA MODEL ====================

export interface JourneyWithGenerations {
  journey: PilgrimJourney;
  steps: EnrichedJourneyStep[];
  generationalLadder: GenerationalLadder;
  ancestralThreads: GenerationalThread[];
  pilgrimPosition: PilgrimPosition;
  ancestralNarrative: AncestralNarrative;
}

export interface PilgrimPosition {
  generationIndex: number;          // -2, -1, 0, +1, ...
  generationLabel: string;          // "Grandparents", "Parents", "Self"
  generationLabelZh?: string;       // "祖父母", "父母", "自己"
  inheritedThemes: string[];        // themes passed down
  brokenPatterns: string[];         // themes that stop with the pilgrim
  newPatterns: string[];            // themes that begin with the pilgrim
  ancestorCount: number;            // how many ancestors in the ladder
  descendantCount: number;          // how many descendants in the ladder
}

export interface AncestralContext {
  inherited: string[];              // themes inherited in this step
  broken: string[];                 // patterns broken in this step
  new: string[];                    // new patterns begun in this step
  resonanceLevel: 'deep' | 'moderate' | 'faint' | 'none';
  ancestralVoice?: string;          // Luna's ancestral persona hook
  ancestralVoiceZh?: string;
}

export interface EnrichedJourneyStep extends JourneyStep {
  ancestralContext: AncestralContext;
}

export interface AncestralNarrative {
  lineageStory: string;             // overall lineage narrative
  lineageStoryZh?: string;
  inheritanceStatement: string;     // what you carry
  liberationStatement: string;      // what you release
  foundationStatement: string;      // what you begin
  ancestralBlessing: string;        // persona voice blessing
  ancestralBlessingZh?: string;
}

// ==================== PILGRIM POSITION ====================

/**
 * Compute where the pilgrim stands in the generational ladder
 */
export function computePilgrimPosition(
  ladder: GenerationalLadder,
  threads: GenerationalThread[],
  selfGenerationIndex: number = 0
): PilgrimPosition {
  const selfGen = getGeneration(ladder, selfGenerationIndex);
  const parentGen = getGeneration(ladder, selfGenerationIndex - 1);

  // Themes inherited from parent generation
  const inherited = threads
    .filter(t =>
      t.generations.includes(selfGenerationIndex - 1) &&
      t.generations.includes(selfGenerationIndex)
    )
    .map(t => t.theme);

  // Themes that existed in parents but stop with pilgrim
  const broken = threads
    .filter(t =>
      t.generations.includes(selfGenerationIndex - 1) &&
      !t.generations.includes(selfGenerationIndex)
    )
    .map(t => t.theme);

  // Themes that begin with pilgrim (not in parents)
  const newPatterns = threads
    .filter(t =>
      t.generations.includes(selfGenerationIndex) &&
      !t.generations.includes(selfGenerationIndex - 1)
    )
    .map(t => t.theme);

  // Count ancestors and descendants
  const ancestorCount = ladder.generations.filter(g => g.generationIndex < selfGenerationIndex).length;
  const descendantCount = ladder.generations.filter(g => g.generationIndex > selfGenerationIndex).length;

  return {
    generationIndex: selfGenerationIndex,
    generationLabel: selfGen?.label ?? 'Self',
    generationLabelZh: selfGen?.labelZh,
    inheritedThemes: inherited,
    brokenPatterns: broken,
    newPatterns: newPatterns,
    ancestorCount,
    descendantCount
  };
}

// ==================== JOURNEY ENRICHMENT ====================

/**
 * Bind generational context to each journey step
 */
export function bindGenerationsToJourney(
  steps: JourneyStep[],
  position: PilgrimPosition
): EnrichedJourneyStep[] {
  return steps.map(step => {
    const stepThemes = extractStepThemes(step);

    const inherited = position.inheritedThemes.filter(t =>
      stepThemes.some(st => st.toLowerCase().includes(t.toLowerCase()) ||
                           t.toLowerCase().includes(st.toLowerCase()))
    );

    const broken = position.brokenPatterns.filter(t =>
      stepThemes.some(st => st.toLowerCase().includes(t.toLowerCase()) ||
                           t.toLowerCase().includes(st.toLowerCase()))
    );

    const newPatterns = position.newPatterns.filter(t =>
      stepThemes.some(st => st.toLowerCase().includes(t.toLowerCase()) ||
                           t.toLowerCase().includes(st.toLowerCase()))
    );

    // Determine resonance level
    let resonanceLevel: 'deep' | 'moderate' | 'faint' | 'none';
    const totalMatches = inherited.length + broken.length + newPatterns.length;
    if (totalMatches >= 3) resonanceLevel = 'deep';
    else if (totalMatches >= 2) resonanceLevel = 'moderate';
    else if (totalMatches >= 1) resonanceLevel = 'faint';
    else resonanceLevel = 'none';

    // Generate ancestral voice
    const ancestralVoice = generateAncestralPersonaHook({ inherited, broken, new: newPatterns }, 'en');
    const ancestralVoiceZh = generateAncestralPersonaHook({ inherited, broken, new: newPatterns }, 'zh');

    return {
      ...step,
      ancestralContext: {
        inherited,
        broken,
        new: newPatterns,
        resonanceLevel,
        ancestralVoice,
        ancestralVoiceZh
      }
    };
  });
}

/**
 * Extract themes from a journey step
 */
function extractStepThemes(step: JourneyStep): string[] {
  const themes: string[] = [];

  // From chamber
  if (step.chamber) themes.push(step.chamber);

  // From rule category
  if (step.ruleCategory) themes.push(step.ruleCategory);

  // From trial/insight text (simple keyword extraction)
  const text = `${step.trial || ''} ${step.insight || ''} ${step.transformation || ''}`;
  const keywords = ['career', 'relationship', 'health', 'wealth', 'family',
                    'power', 'creativity', 'wisdom', 'love', 'ambition',
                    'authority', 'conflict', 'harmony', 'growth', 'change'];
  keywords.forEach(kw => {
    if (text.toLowerCase().includes(kw)) themes.push(kw);
  });

  return [...new Set(themes)];
}

// ==================== PERSONA LAYER: ANCESTRAL VOICE ====================

/**
 * Generate Luna's ancestral persona hook for a step
 */
export function generateAncestralPersonaHook(
  ctx: { inherited: string[]; broken: string[]; new: string[] },
  lang: 'en' | 'zh' = 'en'
): string {
  if (lang === 'zh') {
    return generateAncestralHookZh(ctx);
  }

  const lines: string[] = [];

  if (ctx.inherited.length > 0) {
    lines.push(`In this step, you carry forward the ancestral themes of ${ctx.inherited.join(', ')}. The echoes of those who came before resonate within you.`);
  }

  if (ctx.broken.length > 0) {
    lines.push(`Here, you break the family cycle of ${ctx.broken.join(', ')}. What bound your ancestors releases its hold.`);
  }

  if (ctx.new.length > 0) {
    lines.push(`At this threshold, you plant the seeds of ${ctx.new.join(', ')}. A new lineage begins through you.`);
  }

  if (lines.length === 0) {
    return 'This step stands apart from your ancestral echoes, yet you walk your own sacred path.';
  }

  return lines.join(' ');
}

function generateAncestralHookZh(ctx: { inherited: string[]; broken: string[]; new: string[] }): string {
  const lines: string[] = [];

  if (ctx.inherited.length > 0) {
    lines.push(`你在此步中承接了祖辈的主题：${ctx.inherited.join('、')}。先人的回响在你内心共鸣。`);
  }

  if (ctx.broken.length > 0) {
    lines.push(`在这里，你终结了家族的旧循环：${ctx.broken.join('、')}。束缚祖先的枷锁在此解开。`);
  }

  if (ctx.new.length > 0) {
    lines.push(`此处，你播下了新的种子：${ctx.new.join('、')}。一个新的命脉由你开启。`);
  }

  if (lines.length === 0) {
    return '此步与你的祖系无直接回响，但你依然在自己的神圣道路上前行。';
  }

  return lines.join('');
}

// ==================== ANCESTRAL NARRATIVE ====================

/**
 * Generate the complete ancestral narrative for the pilgrim
 */
export function generateAncestralNarrative(
  position: PilgrimPosition,
  ladder: GenerationalLadder
): AncestralNarrative {
  const { inheritedThemes, brokenPatterns, newPatterns, ancestorCount, descendantCount } = position;

  // Lineage story
  let lineageStory: string;
  if (ancestorCount === 0 && descendantCount === 0) {
    lineageStory = 'You walk as the sole witness of your lineage in this moment.';
  } else if (ancestorCount > 0 && descendantCount > 0) {
    lineageStory = `You stand at the crossroads of ${ancestorCount} ancestral generation${ancestorCount > 1 ? 's' : ''} and ${descendantCount} descendant generation${descendantCount > 1 ? 's' : ''}. Through you, the past meets the future.`;
  } else if (ancestorCount > 0) {
    lineageStory = `You carry the legacy of ${ancestorCount} generation${ancestorCount > 1 ? 's' : ''} behind you. The weight and wisdom of ancestors flows into your present.`;
  } else {
    lineageStory = `Before you stretches ${descendantCount} generation${descendantCount > 1 ? 's' : ''} yet to come. You are the root from which new branches grow.`;
  }

  const lineageStoryZh = generateLineageStoryZh(ancestorCount, descendantCount);

  // Inheritance statement
  const inheritanceStatement = inheritedThemes.length > 0
    ? `You carry the ancestral gifts of ${inheritedThemes.join(', ')}. These threads have passed through generations to reach you.`
    : 'You walk a path unbound by ancestral patterns, free to write your own story.';

  // Liberation statement
  const liberationStatement = brokenPatterns.length > 0
    ? `Through your journey, the cycles of ${brokenPatterns.join(', ')} find their completion. What your ancestors could not release, you set free.`
    : 'The ancestral streams flow unbroken through your life. No old patterns await liberation at this time.';

  // Foundation statement
  const foundationStatement = newPatterns.length > 0
    ? `You plant the seeds of ${newPatterns.join(', ')} that will echo through generations to come. Your descendants will walk paths you first created.`
    : 'Your journey deepens existing streams rather than carving new ones.';

  // Ancestral blessing
  const ancestralBlessing = generateAncestralBlessing(position, ladder);
  const ancestralBlessingZh = generateAncestralBlessingZh(position, ladder);

  return {
    lineageStory,
    lineageStoryZh,
    inheritanceStatement,
    liberationStatement,
    foundationStatement,
    ancestralBlessing,
    ancestralBlessingZh
  };
}

function generateLineageStoryZh(ancestorCount: number, descendantCount: number): string {
  if (ancestorCount === 0 && descendantCount === 0) {
    return '你是此刻血脉的唯一见证者。';
  } else if (ancestorCount > 0 && descendantCount > 0) {
    return `你站在${ancestorCount}代祖先与${descendantCount}代后人的交汇点。通过你，过去与未来相遇。`;
  } else if (ancestorCount > 0) {
    return `你承载着身后${ancestorCount}代人的遗产。祖先的智慧与重量流入你的当下。`;
  }
  return `在你面前延伸着${descendantCount}代尚未到来的后人。你是新枝生长的根基。`;
}

function generateAncestralBlessing(position: PilgrimPosition, ladder: GenerationalLadder): string {
  const { inheritedThemes, brokenPatterns, newPatterns } = position;

  if (inheritedThemes.length > 0 && newPatterns.length > 0) {
    return `May you honor the ancestral gifts of ${inheritedThemes[0]} while nurturing the seeds of ${newPatterns[0]}. You are both heir and pioneer.`;
  }

  if (brokenPatterns.length > 0) {
    return `May the liberation of ${brokenPatterns[0]} bring peace to those who came before and freedom to those who follow.`;
  }

  if (inheritedThemes.length > 0) {
    return `May the ancestral thread of ${inheritedThemes[0]} guide your steps as it guided those before you.`;
  }

  if (newPatterns.length > 0) {
    return `May the new pattern of ${newPatterns[0]} flourish through your descendants for generations to come.`;
  }

  return 'May your journey honor the seen and unseen threads of your lineage.';
}

function generateAncestralBlessingZh(position: PilgrimPosition, ladder: GenerationalLadder): string {
  const { inheritedThemes, brokenPatterns, newPatterns } = position;

  if (inheritedThemes.length > 0 && newPatterns.length > 0) {
    return `愿你尊崇${inheritedThemes[0]}的祖传馈赠，同时培育${newPatterns[0]}的新种子。你既是继承者，也是开拓者。`;
  }

  if (brokenPatterns.length > 0) {
    return `愿${brokenPatterns[0]}的解脱为先人带来安宁，为后人带来自由。`;
  }

  if (inheritedThemes.length > 0) {
    return `愿${inheritedThemes[0]}的祖传丝线引导你的脚步，如同它引导过你之前的人。`;
  }

  if (newPatterns.length > 0) {
    return `愿${newPatterns[0]}的新模式通过你的后人世世代代繁荣昌盛。`;
  }

  return '愿你的旅程尊崇血脉中可见与不可见的丝线。';
}

// ==================== MAIN INTEGRATION FUNCTION ====================

/**
 * Build the complete Pilgrim Journey with Generational Context
 * This is the final stone that binds all layers
 */
export function buildPilgrimJourneyWithGenerations(
  journey: PilgrimJourney,
  ladder: GenerationalLadder,
  selfGenerationIndex: number = 0
): JourneyWithGenerations {
  const threads = ladder.threads;

  // Compute pilgrim position
  const position = computePilgrimPosition(ladder, threads, selfGenerationIndex);

  // Enrich each journey step with ancestral context
  const enrichedSteps = bindGenerationsToJourney(journey.steps, position);

  // Generate the ancestral narrative
  const ancestralNarrative = generateAncestralNarrative(position, ladder);

  return {
    journey,
    steps: enrichedSteps,
    generationalLadder: ladder,
    ancestralThreads: threads,
    pilgrimPosition: position,
    ancestralNarrative
  };
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get steps with deep ancestral resonance
 */
export function getDeepResonanceSteps(journeyWithGen: JourneyWithGenerations): EnrichedJourneyStep[] {
  return journeyWithGen.steps.filter(s => s.ancestralContext.resonanceLevel === 'deep');
}

/**
 * Get steps where patterns are broken
 */
export function getPatternBreakingSteps(journeyWithGen: JourneyWithGenerations): EnrichedJourneyStep[] {
  return journeyWithGen.steps.filter(s => s.ancestralContext.broken.length > 0);
}

/**
 * Get steps where new patterns begin
 */
export function getPatternFoundingSteps(journeyWithGen: JourneyWithGenerations): EnrichedJourneyStep[] {
  return journeyWithGen.steps.filter(s => s.ancestralContext.new.length > 0);
}

/**
 * Get the pilgrim's inheritance summary
 */
export function getInheritanceSummary(journeyWithGen: JourneyWithGenerations): {
  inherited: string[];
  broken: string[];
  new: string[];
  deepResonanceCount: number;
} {
  const pos = journeyWithGen.pilgrimPosition;
  const deepCount = getDeepResonanceSteps(journeyWithGen).length;

  return {
    inherited: pos.inheritedThemes,
    broken: pos.brokenPatterns,
    new: pos.newPatterns,
    deepResonanceCount: deepCount
  };
}

// ==================== EXPORTS ====================

export {
  buildPilgrimJourneyWithGenerations,
  computePilgrimPosition,
  bindGenerationsToJourney,
  generateAncestralPersonaHook,
  generateAncestralNarrative,
  getDeepResonanceSteps,
  getPatternBreakingSteps,
  getPatternFoundingSteps,
  getInheritanceSummary
};
