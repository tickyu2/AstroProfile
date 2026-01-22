/**
 * ============================================
 * PERSONA LAYER NARRATIVE TEMPLATES
 * Luna's mythic voice templates tied to
 * Codex entries
 * ============================================
 */

import { CodexEntry, KnowledgeCodex } from '../codexTypes';

/**
 * Emotional tone mapping based on severity and effect
 */
function getEmotionalTone(severity: string, effect: string): string {
  if (effect === 'beneficial') {
    if (severity === 'major' || severity === 'significant') {
      return 'Celebratory Wisdom — a tone of joyful revelation';
    }
    return 'Gentle Encouragement — a tone of warm support';
  }

  if (effect === 'challenging') {
    if (severity === 'major' || severity === 'significant') {
      return 'Fierce Clarity — a tone of urgent truth';
    }
    return 'Compassionate Correction — a tone of caring guidance';
  }

  if (effect === 'mixed') {
    return 'Balanced Perspective — a tone of nuanced wisdom';
  }

  return 'Neutral Observation — a tone of calm awareness';
}

/**
 * Generate symbolic imagery based on category and effect
 */
function getSymbolicImagery(category: string, effect: string): string[] {
  const categorySymbols: Record<string, string[]> = {
    'structure': ['ancient foundation stones', 'temple architecture', 'mountain roots'],
    'seasonal': ['flowing seasons', 'changing winds', 'natural cycles'],
    'useful_god': ['guiding star', 'hidden treasure', 'underground river'],
    'combination': ['dancing flames merging', 'rivers joining', 'braided threads'],
    'clash': ['thunder and lightning', 'colliding waves', 'breaking stone'],
    'harm': ['hidden thorns', 'underground rot', 'silent erosion'],
    'punishment': ['karmic scales', 'trial by fire', 'lessons carved in stone'],
    'hidden_stem': ['buried seeds', 'underground springs', 'sleeping dragons'],
    'luck_pillar': ['turning wheel', 'opening gates', 'changing tides'],
    'shen_sha': ['celestial spirits', 'star messengers', 'ethereal guardians']
  };

  const effectModifiers: Record<string, string[]> = {
    'beneficial': ['golden light', 'spring blossoms', 'rising sun'],
    'challenging': ['storm clouds', 'winter frost', 'twilight shadows'],
    'mixed': ['dawn mist', 'autumn leaves', 'crossroads'],
    'neutral': ['still water', 'clear mirror', 'empty sky']
  };

  const base = categorySymbols[category] || ['cosmic patterns'];
  const modifier = effectModifiers[effect] || ['changing light'];

  return [...base.slice(0, 2), ...modifier.slice(0, 1)];
}

/**
 * Generate narrative expansion for persona voice
 */
function generateNarrativeExpansion(entry: CodexEntry): string {
  const tone = getEmotionalTone(entry.severity, entry.effect);
  const symbols = getSymbolicImagery(entry.rule.category, entry.effect);

  const expansions: Record<string, string> = {
    'Celebratory Wisdom — a tone of joyful revelation': `
This is a moment of cosmic alignment. The patterns I see in your chart sing with harmony.
Like ${symbols[0]} greeting the ${symbols[2]}, your destiny reveals its generous face.
Embrace this blessing—it is earned, not accidental. The universe rewards those who align with their true nature.`,

    'Gentle Encouragement — a tone of warm support': `
A quiet gift unfolds in your chart. Not dramatic thunder, but the steady warmth of ${symbols[2]}.
Like ${symbols[0]} supporting what grows above, this pattern nurtures without demanding attention.
Trust the slow blooming. Not all fortune announces itself with trumpets.`,

    'Fierce Clarity — a tone of urgent truth': `
I must speak plainly here. What I see demands your full attention.
Like ${symbols[0]} struck by ${symbols[2]}, your chart reveals a truth that cannot be softened.
This is not punishment—it is awakening. The storm clears the air for what comes next.`,

    'Compassionate Correction — a tone of caring guidance': `
A tender adjustment is needed. Your chart shows a pattern that requires gentle correction.
Like ${symbols[1]} showing where water flows, this insight guides rather than alarms.
Small changes now prevent larger difficulties later. Wisdom is anticipation.`,

    'Balanced Perspective — a tone of nuanced wisdom': `
Here we find both shadow and light intertwined. Your chart refuses simple answers.
Like ${symbols[0]} emerging through ${symbols[2]}, complexity is the message.
Hold both truths: the challenge contains opportunity, the gift contains responsibility.`,

    'Neutral Observation — a tone of calm awareness': `
I observe without judgment. This pattern simply is—neither fortune nor misfortune.
Like ${symbols[0]} reflecting ${symbols[2]}, your chart shows what exists, not what should be.
Awareness itself is the teaching. Know this pattern; let it inform, not determine.`
  };

  return expansions[tone] || expansions['Neutral Observation — a tone of calm awareness'];
}

/**
 * Generate Markdown for Persona Narrative entry
 */
export function renderPersonaNarrativeMarkdown(entry: CodexEntry): string {
  const lines: string[] = [];
  const tone = getEmotionalTone(entry.severity, entry.effect);
  const symbols = getSymbolicImagery(entry.rule.category, entry.effect);
  const expansion = generateNarrativeExpansion(entry);

  lines.push(`# Persona Narrative — ${entry.explanation.title}`);
  lines.push('');

  // Cathedral Voice
  lines.push('## Cathedral Voice (Luna)');
  lines.push(`> ${entry.personaHook}`);
  lines.push('');
  if (entry.personaHookChinese) {
    lines.push(`> 「${entry.personaHookChinese}」`);
    lines.push('');
  }
  lines.push('---');
  lines.push('');

  // Emotional Tone
  lines.push('## Emotional Tone  ');
  lines.push(tone);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Narrative Expansion
  lines.push('## Narrative Expansion  ');
  lines.push(expansion.trim());
  lines.push('');
  lines.push('---');
  lines.push('');

  // Symbolic Imagery
  lines.push('## Symbolic Imagery  ');
  for (const symbol of symbols) {
    lines.push(`- ${symbol}`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // Integration Note
  lines.push('## Integration with User\'s Path  ');
  lines.push(generateIntegrationNote(entry));
  lines.push('');
  lines.push('---');
  lines.push('');

  // Source Rule
  lines.push('## Source Rule  ');
  lines.push(`\`${entry.rule.id}\` — ${entry.explanation.title}`);

  return lines.join('\n');
}

/**
 * Generate integration note based on entry characteristics
 */
function generateIntegrationNote(entry: CodexEntry): string {
  const notes: Record<string, string> = {
    'beneficial': 'This pattern supports your journey. Lean into its energy during favorable periods. Seek activities and environments that amplify this blessing.',
    'challenging': 'This pattern asks for your attention and adaptation. It is not fate but feedback—showing where growth is needed. Transform challenge into wisdom.',
    'mixed': 'This pattern offers both gift and responsibility. Neither reject the shadow nor cling to the light. Walk the middle path with awareness.',
    'neutral': 'This pattern informs without directing. Use this knowledge to understand your chart more deeply, without forcing action where none is needed.'
  };

  return notes[entry.effect] || notes['neutral'];
}

/**
 * Generate full Persona Layer document
 */
export function renderFullPersonaDocument(codex: KnowledgeCodex): string {
  const lines: string[] = [];

  lines.push('# 灵魂之声 · Persona Layer Narratives');
  lines.push('');
  lines.push('*The Cathedral speaks through Luna\'s voice*');
  lines.push('');
  lines.push('---');
  lines.push('');

  // Opening
  lines.push('## The Cathedral Opens');
  lines.push('');
  lines.push(codex.openingNarrative);
  lines.push('');
  lines.push('---');
  lines.push('');

  // All entries
  for (const entry of codex.entries) {
    lines.push(renderPersonaNarrativeMarkdown(entry));
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  // Closing
  lines.push('## The Cathedral Closes');
  lines.push('');
  lines.push(codex.closingNarrative);

  return lines.join('\n');
}

/**
 * Generate voice-ready script for TTS
 */
export function generateVoiceScript(codex: KnowledgeCodex): string[] {
  const utterances: string[] = [];

  // Opening
  utterances.push('Welcome to the Cathedral of Destiny. I am Luna, your guide through the chambers of wisdom.');
  utterances.push(codex.openingNarrative);

  // Top entries only for voice
  const topEntries = [...codex.entries]
    .sort((a, b) => getSeverityWeight(b.severity) - getSeverityWeight(a.severity))
    .slice(0, 5);

  for (const entry of topEntries) {
    utterances.push(`Now I speak of ${entry.explanation.title}.`);
    utterances.push(entry.personaHook);

    if (entry.explanation.recommendations && entry.explanation.recommendations.length > 0) {
      utterances.push(`My guidance: ${entry.explanation.recommendations[0]}`);
    }
  }

  // Closing
  utterances.push(codex.closingNarrative);
  utterances.push('The Cathedral rests. May wisdom guide your path.');

  return utterances;
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

export {
  getEmotionalTone,
  getSymbolicImagery,
  generateNarrativeExpansion,
  generateIntegrationNote
};
