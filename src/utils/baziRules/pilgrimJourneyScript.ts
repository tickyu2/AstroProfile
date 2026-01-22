/**
 * ============================================
 * PILGRIM JOURNEY FULL SCRIPT
 * Complete 62-step ceremonial journey through
 * all Cathedral chambers
 * ============================================
 */

import { COMPLETE_CODEX_LIBRARY } from './codexPagesComplete';
import { JOURNEY_CHAMBERS, JourneyChamber } from './codexTypes';

// ==================== TYPES ====================

export interface JourneyStep {
  id: string;
  stepNumber: number;
  chamber: JourneyChamber;
  titleEn: string;
  titleZh: string;
  ruleId: string;
  teaching: string;
  trial: string;
  insight: string;
  transformation: string;
  nextStepId?: string;
  iconHint: string;
  effect: 'beneficial' | 'challenging' | 'mixed' | 'neutral';
}

export interface PilgrimJourneyScript {
  version: string;
  totalSteps: number;
  chambers: JourneyChamber[];
  steps: JourneyStep[];
  introduction: string;
  conclusion: string;
}

// ==================== CHAMBER DEFINITIONS ====================

const CHAMBERS: JourneyChamber[] = [
  {
    id: 'structure',
    name: 'Structure Chamber',
    chineseName: '格局厅',
    description: 'Where the foundation of your chart is revealed. Here we discover whether you are meant to lead, follow, or walk a unique path.',
    iconHint: '🏛️'
  },
  {
    id: 'combination',
    name: 'Combination Hall',
    chineseName: '合化堂',
    description: 'Where forces merge and transform. Unions are tested, alliances formed, and the alchemy of combination unfolds.',
    iconHint: '🔗'
  },
  {
    id: 'useful_god',
    name: 'Useful God Sanctum',
    chineseName: '用神殿',
    description: 'The sacred chamber where your guide is identified. Your useful god is your north star, your ally in navigating life.',
    iconHint: '🎯'
  },
  {
    id: 'conflict',
    name: 'Conflict Arena',
    chineseName: '冲突场',
    description: 'Where clashes, harms, and punishments are witnessed. Not all conflict is bad—some clears what no longer serves.',
    iconHint: '⚔️'
  },
  {
    id: 'seasonal',
    name: 'Seasonal Gallery',
    chineseName: '四季廊',
    description: 'Where time\'s rhythm is felt. Elements wax and wane with the seasons, teaching us the wisdom of timing.',
    iconHint: '🌿'
  },
  {
    id: 'hidden',
    name: 'Hidden Roots Crypt',
    chineseName: '藏根窖',
    description: 'The underground chamber where hidden stems lie dormant. Potential waits here, sleeping until its moment.',
    iconHint: '🔮'
  },
  {
    id: 'luck_pillar',
    name: 'Luck Pillar Corridor',
    chineseName: '大运廊',
    description: 'The corridor of time where luck pillars march forward. Past, present, and future meet in this passage.',
    iconHint: '📅'
  }
];

// ==================== TRIAL GENERATORS ====================

function generateTrial(effect: string, category: string): string {
  const trials: Record<string, Record<string, string>> = {
    beneficial: {
      structure: 'Can you receive this blessing without attachment? The trial is gratitude without grasping.',
      combination: 'Can you accept union without losing yourself? The trial is partnership without dissolution.',
      useful_god: 'Can you rely on support without dependency? The trial is strength with humility.',
      conflict: 'Can you see destruction as renewal? The trial is acceptance of necessary endings.',
      seasonal: 'Can you flourish without arrogance? The trial is success without pride.',
      hidden: 'Can you trust what you cannot see? The trial is faith in unseen forces.',
      luck_pillar: 'Can you seize opportunity without greed? The trial is action without desperation.'
    },
    challenging: {
      structure: 'Can you face this truth without flinching? The trial is courage without denial.',
      combination: 'Can you release what will not hold? The trial is letting go without bitterness.',
      useful_god: 'Can you persist when help seems distant? The trial is perseverance without resentment.',
      conflict: 'Can you endure impact without breaking? The trial is resilience without hardening.',
      seasonal: 'Can you accept weakness without shame? The trial is patience without despair.',
      hidden: 'Can you acknowledge buried threats? The trial is awareness without paranoia.',
      luck_pillar: 'Can you weather storms without surrender? The trial is endurance without victimhood.'
    },
    mixed: {
      structure: 'Can you hold complexity without resolution? The trial is wisdom without certainty.',
      combination: 'Can you navigate ambiguity? The trial is balance without perfectionism.',
      useful_god: 'Can you work with imperfect support? The trial is adaptation without complaint.',
      conflict: 'Can you find teaching in contradiction? The trial is learning without judgment.',
      seasonal: 'Can you flow with changing tides? The trial is flexibility without instability.',
      hidden: 'Can you accept both gift and burden below? The trial is integration without splitting.',
      luck_pillar: 'Can you walk the middle path? The trial is moderation without mediocrity.'
    },
    neutral: {
      structure: 'Can you observe without interference? The trial is awareness without action.',
      combination: 'Can you witness without forcing? The trial is presence without manipulation.',
      useful_god: 'Can you wait without urgency? The trial is stillness without stagnation.',
      conflict: 'Can you see patterns without drama? The trial is clarity without reactivity.',
      seasonal: 'Can you note the rhythm without judgment? The trial is observation without opinion.',
      hidden: 'Can you acknowledge what simply is? The trial is acceptance without attachment.',
      luck_pillar: 'Can you let time flow? The trial is trust without control.'
    }
  };

  return trials[effect]?.[category] || trials.neutral[category] || 'The pilgrim must face this truth with open heart. The trial is presence itself.';
}

function generateInsight(teaching: string, effect: string): string {
  const firstSentence = teaching.split('.')[0] + '.';

  const templates: Record<string, string> = {
    beneficial: `The insight emerges: ${firstSentence} What supports you asks only that you receive with gratitude.`,
    challenging: `The insight emerges: ${firstSentence} What challenges you invites growth, not defeat.`,
    mixed: `The insight emerges: ${firstSentence} Complexity is not confusion—it is life's depth revealing itself.`,
    neutral: `The insight emerges: ${firstSentence} Not all truths demand response—some simply ask to be known.`
  };

  return templates[effect] || templates.neutral;
}

function generateTransformation(effect: string): string {
  const transformations: Record<string, string> = {
    beneficial: `Having received this blessing, the pilgrim is strengthened.
Not changed in essence, but confirmed in purpose.
The journey continues with renewed vitality.`,
    challenging: `Having faced this trial, the pilgrim is tempered.
Not broken, but refined—like metal through fire.
What remains is stronger than what was lost.`,
    mixed: `Having held this paradox, the pilgrim gains depth.
Not resolved into simplicity, but expanded into complexity.
Wisdom grows in the space between opposites.`,
    neutral: `Having witnessed this truth, the pilgrim is informed.
Not transformed, but illuminated.
Knowledge itself is the gift of this chamber.`
  };

  return transformations[effect] || transformations.neutral;
}

// ==================== BUILD COMPLETE SCRIPT ====================

/**
 * Build the complete 62-step Pilgrim Journey Script
 */
export function buildPilgrimJourneyScript(): PilgrimJourneyScript {
  const steps: JourneyStep[] = [];
  let stepNumber = 1;

  // Order rules by chamber for a logical journey
  const rulesByCategory: Record<string, string[]> = {
    structure: [
      'pseudo_follow_wealth', 'pseudo_follow_authority', 'pseudo_follow_output',
      'quasi_follow_wealth', 'quasi_follow_authority', 'quasi_follow_seal',
      'semi_follow_wealth', 'semi_follow_authority', 'abandoned_follow',
      'structure_balance_violation', 'follow_broken_by_root', 'special_structure_override'
    ],
    combination: [
      'stem_combination_basic', 'branch_six_harmony', 'branch_three_harmony',
      'directional_combination', 'combination_partial', 'combination_season_failure',
      'combination_clash_break', 'combination_jealousy'
    ],
    useful_god: [
      'useful_god_blocked', 'useful_god_combined_away', 'useful_god_harmed',
      'useful_god_punished', 'useful_god_clashed', 'useful_god_weakened_seasonal',
      'useful_god_in_grave', 'annoying_god_revealed', 'god_absence', 'god_transformation'
    ],
    conflict: [
      'clash_beneficial', 'clash_harmful', 'clash_day_year',
      'harm_detected', 'harm_health_impact', 'harm_relationship_impact',
      'punishment_unkindness', 'punishment_bullying', 'punishment_ungrateful',
      'punishment_self', 'destruction_detected', 'multiple_negatives'
    ],
    seasonal: [
      'seasonal_peak', 'seasonal_weakness', 'seasonal_death',
      'element_timely', 'element_untimely', 'element_in_grave'
    ],
    hidden: [
      'hidden_stem_main_qi', 'hidden_stem_revealed', 'hidden_stem_clashed',
      'hidden_stem_useful_god', 'hidden_stem_annoying_god',
      'hidden_stem_combination_participant', 'hidden_stem_strength_calculation',
      'hidden_stem_seasonal_modification', 'hidden_stem_grave_storage'
    ],
    luck_pillar: [
      'luck_pillar_transforms_structure', 'luck_pillar_reveals_useful_god',
      'luck_pillar_activates_annoying_god', 'luck_pillar_completes_combination',
      'luck_pillar_breaks_combination', 'luck_pillar_punishment_activation',
      'luck_pillar_seasonal_alignment', 'luck_pillar_element_balance_shift',
      'luck_pillar_stem_branch_conflict'
    ]
  };

  // Build steps chamber by chamber
  for (const chamber of CHAMBERS) {
    const categoryRules = rulesByCategory[chamber.id] || [];

    for (const ruleId of categoryRules) {
      const codexEntry = COMPLETE_CODEX_LIBRARY[ruleId];
      if (!codexEntry) continue;

      const step: JourneyStep = {
        id: `step_${stepNumber}`,
        stepNumber,
        chamber,
        titleEn: codexEntry.explanation.title,
        titleZh: getTitleZh(ruleId),
        ruleId,
        teaching: codexEntry.journeyStepHint,
        trial: generateTrial(codexEntry.effect, chamber.id),
        insight: generateInsight(codexEntry.journeyStepHint, codexEntry.effect),
        transformation: generateTransformation(codexEntry.effect),
        iconHint: codexEntry.iconHint,
        effect: codexEntry.effect as JourneyStep['effect']
      };

      steps.push(step);
      stepNumber++;
    }
  }

  // Link steps
  for (let i = 0; i < steps.length - 1; i++) {
    steps[i].nextStepId = steps[i + 1].id;
  }

  return {
    version: '1.0.0',
    totalSteps: steps.length,
    chambers: CHAMBERS,
    steps,
    introduction: generateIntroduction(),
    conclusion: generateConclusion()
  };
}

function getTitleZh(ruleId: string): string {
  const translations: Record<string, string> = {
    pseudo_follow_wealth: '假从财格',
    pseudo_follow_authority: '假从官格',
    pseudo_follow_output: '假从儿格',
    quasi_follow_wealth: '类从财格',
    quasi_follow_authority: '类从官格',
    quasi_follow_seal: '类从印格',
    semi_follow_wealth: '半从财格',
    semi_follow_authority: '半从官格',
    abandoned_follow: '弃从格',
    structure_balance_violation: '格局平衡失调',
    follow_broken_by_root: '从格见根破格',
    special_structure_override: '特殊格局覆盖',
    combination_season_failure: '合化不成',
    combination_clash_break: '合化被冲破',
    combination_jealousy: '争合妒合',
    combination_partial: '半合',
    stem_combination_basic: '天干五合',
    branch_six_harmony: '地支六合',
    branch_three_harmony: '地支三合',
    directional_combination: '方合',
    useful_god_blocked: '用神被阻',
    useful_god_combined_away: '用神被合',
    useful_god_harmed: '用神被害',
    useful_god_punished: '用神被刑',
    useful_god_clashed: '用神被冲',
    useful_god_weakened_seasonal: '用神不得时令',
    useful_god_in_grave: '用神入墓',
    annoying_god_revealed: '忌神透出',
    god_absence: '用神不现',
    god_transformation: '用神转化',
    clash_beneficial: '吉冲',
    clash_harmful: '凶冲',
    clash_day_year: '日年相冲',
    harm_detected: '地支相害',
    harm_health_impact: '害影响健康',
    harm_relationship_impact: '害影响关系',
    punishment_unkindness: '恃势之刑',
    punishment_bullying: '无恩之刑',
    punishment_ungrateful: '无礼之刑',
    punishment_self: '自刑',
    destruction_detected: '地支相破',
    multiple_negatives: '多重负面互动',
    seasonal_peak: '得令',
    seasonal_weakness: '失令',
    seasonal_death: '死绝',
    element_timely: '五行得时',
    element_untimely: '五行失时',
    element_in_grave: '五行入墓',
    hidden_stem_main_qi: '本气藏干',
    hidden_stem_revealed: '藏干透出',
    hidden_stem_clashed: '藏干受冲',
    hidden_stem_useful_god: '用神藏于地支',
    hidden_stem_annoying_god: '忌神藏而不露',
    hidden_stem_combination_participant: '藏干参与合化',
    hidden_stem_strength_calculation: '藏干力量分配',
    hidden_stem_seasonal_modification: '藏干受季节影响',
    hidden_stem_grave_storage: '墓库开合',
    luck_pillar_transforms_structure: '大运改格',
    luck_pillar_reveals_useful_god: '大运透用神',
    luck_pillar_activates_annoying_god: '大运透忌神',
    luck_pillar_completes_combination: '大运凑合',
    luck_pillar_breaks_combination: '大运冲散合局',
    luck_pillar_punishment_activation: '大运凑刑',
    luck_pillar_seasonal_alignment: '大运助用神得令',
    luck_pillar_element_balance_shift: '大运改变五行平衡',
    luck_pillar_stem_branch_conflict: '大运天地相战'
  };

  return translations[ruleId] || '';
}

function generateIntroduction(): string {
  return `Welcome, Pilgrim, to the Cathedral of Celestial Wisdom.

You stand at the threshold of a journey through seven sacred chambers,
each holding ancient truths about your chart and your path.

This is not a journey of judgment, but of understanding.
Not a path of fear, but of illumination.

Each step reveals a teaching from the classical masters.
Each chamber offers trials, insights, and transformations.

The journey begins in the Structure Chamber, where your foundation is revealed.
It ends in the Luck Pillar Corridor, where time itself becomes your ally.

Take a breath. Center yourself.
The gates of the Cathedral open before you.

命理朝圣之旅，现在开始。`;
}

function generateConclusion(): string {
  return `Pilgrim, you have walked through all seven chambers.
You have faced trials of blessing and hardship.
You have received insights from the classical masters.

The Cathedral's wisdom is now part of you.
Not as burden, but as understanding.
Not as fate, but as navigation.

Remember: your chart is not your destiny.
It is a map—and you are the one who walks.

The gates of the Cathedral open once more,
releasing you back into the world of action.

Go forth with wisdom.
Go forth with courage.
Go forth with the knowledge that the stars
are not your masters, but your advisors.

朝圣之旅圆满结束。愿智慧与你同行。`;
}

// ==================== EXPORT FUNCTIONS ====================

/**
 * Export journey as Markdown
 */
export function exportJourneyAsMarkdown(script?: PilgrimJourneyScript): string {
  const journey = script || buildPilgrimJourneyScript();
  const lines: string[] = [];

  lines.push('# The Pilgrim\'s Journey');
  lines.push('# 命理朝圣之旅');
  lines.push('');
  lines.push(`*${journey.totalSteps} steps through ${journey.chambers.length} chambers*`);
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
  lines.push('## The Seven Chambers');
  lines.push('');
  for (const chamber of journey.chambers) {
    const chamberSteps = journey.steps.filter(s => s.chamber.id === chamber.id);
    lines.push(`### ${chamber.iconHint} ${chamber.name} (${chamber.chineseName})`);
    lines.push(`*${chamberSteps.length} steps*`);
    lines.push('');
    lines.push(chamber.description);
    lines.push('');
  }
  lines.push('---');
  lines.push('');

  // All steps
  lines.push('## The Steps');
  lines.push('');

  let currentChamber = '';

  for (const step of journey.steps) {
    if (currentChamber !== step.chamber.id) {
      currentChamber = step.chamber.id;
      lines.push('');
      lines.push(`# ═══════════════════════════════════════`);
      lines.push(`# ${step.chamber.iconHint} ${step.chamber.name}`);
      lines.push(`# ${step.chamber.chineseName}`);
      lines.push(`# ═══════════════════════════════════════`);
      lines.push('');
      lines.push(`*${step.chamber.description}*`);
      lines.push('');
    }

    lines.push(`## Step ${step.stepNumber}: ${step.titleEn} (${step.titleZh})`);
    lines.push('');
    lines.push(`**Chamber:** ${step.chamber.name}`);
    lines.push(`**Effect:** ${step.effect}`);
    lines.push('');
    lines.push('### The Teaching');
    lines.push(step.teaching);
    lines.push('');
    lines.push('### The Trial');
    lines.push(step.trial);
    lines.push('');
    lines.push('### The Insight');
    lines.push(step.insight);
    lines.push('');
    lines.push('### The Transformation');
    lines.push(step.transformation);
    lines.push('');
    if (step.nextStepId) {
      lines.push(`**Next Gate:** Step ${step.stepNumber + 1}`);
    } else {
      lines.push('**This is the final step.**');
    }
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  // Conclusion
  lines.push('## The Journey Ends');
  lines.push('');
  lines.push(journey.conclusion);

  return lines.join('\n');
}

/**
 * Export journey as JSON
 */
export function exportJourneyAsJson(script?: PilgrimJourneyScript): string {
  const journey = script || buildPilgrimJourneyScript();
  return JSON.stringify(journey, null, 2);
}

/**
 * Export voice script for TTS
 */
export function exportJourneyVoiceScript(script?: PilgrimJourneyScript): string {
  const journey = script || buildPilgrimJourneyScript();
  const lines: string[] = [];

  lines.push('=== PILGRIM JOURNEY VOICE SCRIPT ===');
  lines.push('');
  lines.push('[OPENING]');
  lines.push(journey.introduction);
  lines.push('');
  lines.push('[PAUSE 5 seconds]');
  lines.push('');

  let currentChamber = '';

  for (const step of journey.steps) {
    if (currentChamber !== step.chamber.id) {
      currentChamber = step.chamber.id;
      lines.push(`[CHAMBER: ${step.chamber.name}]`);
      lines.push(step.chamber.description);
      lines.push('[PAUSE 3 seconds]');
      lines.push('');
    }

    lines.push(`[STEP ${step.stepNumber}: ${step.titleEn}]`);
    lines.push('');
    lines.push('[TEACHING]');
    lines.push(step.teaching);
    lines.push('[PAUSE 2 seconds]');
    lines.push('');
    lines.push('[TRIAL]');
    lines.push(step.trial);
    lines.push('[PAUSE 2 seconds]');
    lines.push('');
    lines.push('[INSIGHT]');
    lines.push(step.insight);
    lines.push('[PAUSE 2 seconds]');
    lines.push('');
    lines.push('[TRANSFORMATION]');
    lines.push(step.transformation);
    lines.push('[PAUSE 3 seconds]');
    lines.push('');
  }

  lines.push('[CLOSING]');
  lines.push(journey.conclusion);
  lines.push('');
  lines.push('=== END SCRIPT ===');

  return lines.join('\n');
}

/**
 * Get specific step by number
 */
export function getJourneyStep(stepNumber: number, script?: PilgrimJourneyScript): JourneyStep | undefined {
  const journey = script || buildPilgrimJourneyScript();
  return journey.steps.find(s => s.stepNumber === stepNumber);
}

/**
 * Get steps for a specific chamber
 */
export function getChamberSteps(chamberId: string, script?: PilgrimJourneyScript): JourneyStep[] {
  const journey = script || buildPilgrimJourneyScript();
  return journey.steps.filter(s => s.chamber.id === chamberId);
}

/**
 * Render single step as HTML card
 */
export function renderStepHtml(step: JourneyStep): string {
  const effectColors: Record<string, string> = {
    beneficial: '#4caf50',
    challenging: '#f44336',
    mixed: '#ff9800',
    neutral: '#9e9e9e'
  };

  return `
<article class="journey-step" data-step="${step.stepNumber}" data-chamber="${step.chamber.id}" data-effect="${step.effect}">
  <header class="step-header" style="border-left: 4px solid ${effectColors[step.effect]}">
    <div class="step-number">${step.stepNumber}</div>
    <div class="step-titles">
      <h2>${step.iconHint} ${step.titleEn}</h2>
      <span class="title-zh">${step.titleZh}</span>
    </div>
    <div class="step-meta">
      <span class="chamber">${step.chamber.name}</span>
      <span class="effect ${step.effect}">${step.effect}</span>
    </div>
  </header>

  <section class="step-teaching">
    <h3>The Teaching</h3>
    <p>${step.teaching}</p>
  </section>

  <section class="step-trial">
    <h3>The Trial</h3>
    <p>${step.trial}</p>
  </section>

  <section class="step-insight">
    <h3>The Insight</h3>
    <p>${step.insight}</p>
  </section>

  <section class="step-transformation">
    <h3>The Transformation</h3>
    <p>${step.transformation}</p>
  </section>

  ${step.nextStepId ? `<footer class="step-next">Next Gate → Step ${step.stepNumber + 1}</footer>` : '<footer class="step-final">This is the final step</footer>'}
</article>
`;
}

/**
 * Render full journey HTML
 */
export function renderJourneyHtml(script?: PilgrimJourneyScript): string {
  const journey = script || buildPilgrimJourneyScript();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Pilgrim Journey - ${journey.totalSteps} Steps</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Georgia', serif;
      background: #1a1a2e;
      color: #e8e6e3;
      line-height: 1.7;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }
    .journey-header {
      text-align: center;
      padding: 3rem 0;
      border-bottom: 2px solid #3a3a4e;
    }
    .journey-title {
      font-size: 2.5em;
      color: #d4af37;
    }
    .journey-subtitle {
      font-size: 1.3em;
      margin-top: 0.5rem;
      color: #9e9e9e;
    }
    .introduction, .conclusion {
      padding: 2rem;
      background: #2a2a3e;
      border-radius: 8px;
      margin: 2rem 0;
      white-space: pre-line;
      font-style: italic;
    }
    .chamber-nav {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      justify-content: center;
      margin: 2rem 0;
    }
    .chamber-btn {
      padding: 0.5rem 1rem;
      background: #3a3a4e;
      border: none;
      color: #e8e6e3;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .chamber-btn:hover, .chamber-btn.active {
      background: #d4af37;
      color: #1a1a2e;
    }
    .journey-step {
      background: #2a2a3e;
      border-radius: 8px;
      margin: 1.5rem 0;
      overflow: hidden;
    }
    .step-header {
      padding: 1.5rem;
      background: #3a3a4e;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .step-number {
      width: 50px;
      height: 50px;
      background: #d4af37;
      color: #1a1a2e;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5em;
      font-weight: bold;
    }
    .step-titles h2 {
      font-size: 1.3em;
      color: #e8e6e3;
    }
    .title-zh {
      color: #9e9e9e;
    }
    .step-meta {
      margin-left: auto;
      display: flex;
      gap: 0.5rem;
    }
    .chamber, .effect {
      padding: 0.25rem 0.75rem;
      border-radius: 15px;
      font-size: 0.85em;
    }
    .chamber { background: #4a4a6a; }
    .effect.beneficial { background: #4caf5033; color: #4caf50; }
    .effect.challenging { background: #f4433633; color: #f44336; }
    .effect.mixed { background: #ff980033; color: #ff9800; }
    .effect.neutral { background: #9e9e9e33; color: #9e9e9e; }
    .step-teaching, .step-trial, .step-insight, .step-transformation {
      padding: 1.5rem;
      border-bottom: 1px solid #3a3a4e;
    }
    .step-teaching h3, .step-trial h3, .step-insight h3, .step-transformation h3 {
      color: #d4af37;
      margin-bottom: 0.5rem;
      font-size: 1.1em;
    }
    .step-next, .step-final {
      padding: 1rem 1.5rem;
      text-align: right;
      color: #9e9e9e;
      font-style: italic;
    }
    @media print {
      body { background: white; color: black; }
      .journey-step { border: 1px solid #ccc; }
      .chamber-nav { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="journey-header">
      <h1 class="journey-title">The Pilgrim's Journey</h1>
      <p class="journey-subtitle">命理朝圣之旅</p>
      <p>${journey.totalSteps} steps through ${journey.chambers.length} chambers</p>
    </header>

    <div class="introduction">${journey.introduction}</div>

    <nav class="chamber-nav">
      <button class="chamber-btn active" data-chamber="all">All Chambers</button>
      ${journey.chambers.map(c => `<button class="chamber-btn" data-chamber="${c.id}">${c.iconHint} ${c.name}</button>`).join('')}
    </nav>

    <main class="steps-container">
      ${journey.steps.map(step => renderStepHtml(step)).join('')}
    </main>

    <div class="conclusion">${journey.conclusion}</div>
  </div>

  <script>
    document.querySelectorAll('.chamber-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.chamber-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const chamber = btn.dataset.chamber;
        document.querySelectorAll('.journey-step').forEach(step => {
          step.style.display = (chamber === 'all' || step.dataset.chamber === chamber) ? 'block' : 'none';
        });
      });
    });
  </script>
</body>
</html>
`;
}

// Export the pre-built journey
export const PILGRIM_JOURNEY_SCRIPT = buildPilgrimJourneyScript();
