/**
 * ============================================
 * PILGRIM JOURNEY SCRIPT
 * Transforms Codex entries into a guided
 * journey through the Cathedral chambers
 * ============================================
 */

import {
  CodexEntry,
  KnowledgeCodex,
  JourneyChamber,
  JourneyStep,
  PilgrimJourney,
  JOURNEY_CHAMBERS,
  CodexCategory
} from './codexTypes';

/**
 * Build complete Pilgrim Journey from Knowledge Codex
 */
export function buildPilgrimJourney(codex: KnowledgeCodex): PilgrimJourney {
  // Group entries by chamber
  const entriesByChamber = groupEntriesByChamber(codex.entries);

  // Filter chambers that have content
  const activeChambers = JOURNEY_CHAMBERS.filter(
    chamber => entriesByChamber[chamber.id]?.length > 0
  );

  // Build journey steps
  const steps: JourneyStep[] = [];
  let stepOrder = 1;

  for (const chamber of activeChambers) {
    const chamberEntries = entriesByChamber[chamber.id] || [];

    for (const entry of chamberEntries) {
      steps.push({
        id: `step_${stepOrder}_${entry.rule.id}`,
        chamber,
        title: entry.explanation.title,
        narrative: entry.journeyStepHint,
        narrativeChinese: entry.personaHook,
        entry,
        order: stepOrder++
      });
    }
  }

  return {
    title: 'Your Pilgrim Journey Through the Cathedral of Destiny',
    introduction: generateJourneyIntroduction(codex),
    chambers: activeChambers,
    steps,
    conclusion: generateJourneyConclusion(codex)
  };
}

/**
 * Build simplified journey with only the most important steps
 */
export function buildEssentialJourney(codex: KnowledgeCodex, maxSteps: number = 7): PilgrimJourney {
  const fullJourney = buildPilgrimJourney(codex);

  // Sort steps by entry severity and confidence
  const sortedSteps = [...fullJourney.steps].sort((a, b) => {
    const severityWeight = getSeverityWeight(b.entry.severity) - getSeverityWeight(a.entry.severity);
    if (severityWeight !== 0) return severityWeight;
    return b.entry.confidence - a.entry.confidence;
  });

  // Take top N steps
  const essentialSteps = sortedSteps.slice(0, maxSteps);

  // Re-sort by chamber order
  essentialSteps.sort((a, b) => a.chamber.order - b.chamber.order);

  // Renumber
  essentialSteps.forEach((step, idx) => {
    step.order = idx + 1;
  });

  // Get active chambers from essential steps
  const activeChamberIds = new Set(essentialSteps.map(s => s.chamber.id));
  const activeChambers = fullJourney.chambers.filter(c => activeChamberIds.has(c.id));

  return {
    ...fullJourney,
    chambers: activeChambers,
    steps: essentialSteps
  };
}

/**
 * Generate narrative script for the journey
 */
export function generateJourneyScript(journey: PilgrimJourney): string {
  const lines: string[] = [];

  // Title and introduction
  lines.push('╔═══════════════════════════════════════════════════════════╗');
  lines.push('║         THE PILGRIM\'S JOURNEY                             ║');
  lines.push('║         命理朝圣之旅                                        ║');
  lines.push('╚═══════════════════════════════════════════════════════════╝');
  lines.push('');
  lines.push(journey.introduction);
  lines.push('');

  // Group steps by chamber
  let currentChamber: JourneyChamber | null = null;

  for (const step of journey.steps) {
    // Chamber header if changed
    if (!currentChamber || currentChamber.id !== step.chamber.id) {
      currentChamber = step.chamber;
      lines.push('');
      lines.push('┌───────────────────────────────────────────────────────────┐');
      lines.push(`│ ${currentChamber.iconHint} ${currentChamber.name}`);
      lines.push(`│    ${currentChamber.chineseName}`);
      lines.push('├───────────────────────────────────────────────────────────┤');
      lines.push(`│ ${currentChamber.description}`);
      lines.push('└───────────────────────────────────────────────────────────┘');
      lines.push('');
    }

    // Step content
    lines.push(`  Step ${step.order}: ${step.title}`);
    lines.push('  ─────────────────────────────────');
    lines.push('');
    lines.push(`  ${step.narrative}`);
    lines.push('');

    if (step.narrativeChinese) {
      lines.push(`  「${step.narrativeChinese}」`);
      lines.push('');
    }

    // Entry details
    const entry = step.entry;
    if (entry.explanation.recommendations && entry.explanation.recommendations.length > 0) {
      lines.push('  Guidance:');
      for (const rec of entry.explanation.recommendations.slice(0, 2)) {
        lines.push(`    → ${rec}`);
      }
      lines.push('');
    }
  }

  // Conclusion
  lines.push('');
  lines.push('╔═══════════════════════════════════════════════════════════╗');
  lines.push('║         JOURNEY\'S END · 旅程终点                           ║');
  lines.push('╚═══════════════════════════════════════════════════════════╝');
  lines.push('');
  lines.push(journey.conclusion);

  return lines.join('\n');
}

/**
 * Generate interactive journey data for UI rendering
 */
export function generateInteractiveJourneyData(journey: PilgrimJourney): InteractiveJourney {
  const chamberSteps: Record<string, InteractiveStep[]> = {};

  for (const chamber of journey.chambers) {
    chamberSteps[chamber.id] = [];
  }

  for (const step of journey.steps) {
    chamberSteps[step.chamber.id].push({
      id: step.id,
      order: step.order,
      title: step.title,
      narrative: step.narrative,
      narrativeChinese: step.narrativeChinese,
      severity: step.entry.severity,
      effect: step.entry.effect,
      icon: step.entry.iconHint || step.chamber.iconHint,
      recommendations: step.entry.explanation.recommendations || [],
      warnings: step.entry.explanation.warnings || [],
      technicalDetail: step.entry.explanation.technicalDetail
    });
  }

  return {
    title: journey.title,
    introduction: journey.introduction,
    conclusion: journey.conclusion,
    totalSteps: journey.steps.length,
    chambers: journey.chambers.map(chamber => ({
      ...chamber,
      steps: chamberSteps[chamber.id],
      stepCount: chamberSteps[chamber.id].length
    }))
  };
}

/**
 * Generate voice-ready journey narration
 */
export function generateVoiceJourney(journey: PilgrimJourney): VoiceJourneySegment[] {
  const segments: VoiceJourneySegment[] = [];

  // Introduction
  segments.push({
    type: 'introduction',
    text: journey.introduction,
    pauseAfter: 2000
  });

  let currentChamberId: string | null = null;

  for (const step of journey.steps) {
    // Chamber announcement
    if (currentChamberId !== step.chamber.id) {
      currentChamberId = step.chamber.id;
      segments.push({
        type: 'chamber_enter',
        chamber: step.chamber.name,
        text: `We now enter the ${step.chamber.name}. ${step.chamber.description}`,
        pauseAfter: 1500
      });
    }

    // Step narration
    segments.push({
      type: 'step',
      stepNumber: step.order,
      text: step.narrative,
      pauseAfter: 1000
    });

    // Chinese insight (optional)
    if (step.narrativeChinese) {
      segments.push({
        type: 'chinese_insight',
        text: step.narrativeChinese,
        pauseAfter: 1000
      });
    }
  }

  // Conclusion
  segments.push({
    type: 'conclusion',
    text: journey.conclusion,
    pauseAfter: 2000
  });

  return segments;
}

// ==================== HELPER FUNCTIONS ====================

function groupEntriesByChamber(entries: CodexEntry[]): Record<string, CodexEntry[]> {
  const grouped: Record<string, CodexEntry[]> = {};

  for (const entry of entries) {
    const chamberId = mapCategoryToChamber(entry.rule.category);
    if (!grouped[chamberId]) {
      grouped[chamberId] = [];
    }
    grouped[chamberId].push(entry);
  }

  return grouped;
}

function mapCategoryToChamber(category: CodexCategory): string {
  const mapping: Record<CodexCategory, string> = {
    'structure': 'structure',
    'seasonal': 'elements',
    'useful_god': 'useful_god',
    'combination': 'combinations',
    'clash': 'conflicts',
    'harm': 'conflicts',
    'punishment': 'conflicts',
    'hidden_stem': 'hidden',
    'shen_sha': 'shen_sha',
    'luck_pillar': 'luck_pillar'
  };

  return mapping[category] || 'structure';
}

function getSeverityWeight(severity: string): number {
  const weights: Record<string, number> = {
    'major': 5,
    'significant': 4,
    'moderate': 3,
    'minor': 2,
    'info': 1
  };
  return weights[severity] || 0;
}

function generateJourneyIntroduction(codex: KnowledgeCodex): string {
  const tone = codex.summary.overallTone;
  const count = codex.summary.totalFindings;

  if (tone === 'beneficial') {
    return `Welcome, seeker, to your journey through the Cathedral of Destiny. The stars have aligned favorably for you today. I have gathered ${count} insights from your chart, and many shine with promise. Let us walk together through these chambers of wisdom.`;
  }

  if (tone === 'challenging') {
    return `Welcome, seeker, to your journey through the Cathedral of Destiny. Your chart speaks of trials and lessons ahead. I have gathered ${count} insights that demand your attention. Remember: awareness transforms challenge into growth. Let us walk together.`;
  }

  return `Welcome, seeker, to your journey through the Cathedral of Destiny. Your chart reveals a tapestry of light and shadow, ${count} insights woven together. Neither purely fortunate nor troubled, your path is nuanced. Let us explore together.`;
}

function generateJourneyConclusion(codex: KnowledgeCodex): string {
  return `Your journey through the Cathedral concludes, but its wisdom remains with you. Remember: the chart reveals tendencies, not fate. Each insight is an invitation to awareness, each warning a chance to prepare, each blessing a seed to cultivate. Walk your path with open eyes, and may your choices shape a destiny worthy of your soul.

你在命理殿堂中的朝圣之旅到此结束，但这份智慧将伴随你前行。记住：命盘揭示的是倾向而非定数。每一条启示都是觉醒的邀请，每一个警示都是准备的机会，每一份祝福都是值得培育的种子。睁开觉知的眼睛走你的路，愿你的选择塑造一个配得上你灵魂的命运。`;
}

// ==================== TYPES ====================

interface InteractiveStep {
  id: string;
  order: number;
  title: string;
  narrative: string;
  narrativeChinese?: string;
  severity: string;
  effect: string;
  icon: string;
  recommendations: string[];
  warnings: string[];
  technicalDetail: string;
}

interface InteractiveChamber extends JourneyChamber {
  steps: InteractiveStep[];
  stepCount: number;
}

interface InteractiveJourney {
  title: string;
  introduction: string;
  conclusion: string;
  totalSteps: number;
  chambers: InteractiveChamber[];
}

interface VoiceJourneySegment {
  type: 'introduction' | 'chamber_enter' | 'step' | 'chinese_insight' | 'conclusion';
  text: string;
  pauseAfter: number;
  chamber?: string;
  stepNumber?: number;
}

export type { InteractiveJourney, InteractiveStep, InteractiveChamber, VoiceJourneySegment };
