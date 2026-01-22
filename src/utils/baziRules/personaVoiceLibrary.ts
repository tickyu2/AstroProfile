/**
 * ============================================
 * PERSONA LAYER VOICE LIBRARY
 * Complete export of Luna's voice for all 62 rules
 * Including tones, symbols, and narrative hooks
 * ============================================
 */

import { COMPLETE_CODEX_LIBRARY } from './codexPagesComplete';

// ==================== TYPES ====================

export interface PersonaVoiceEntry {
  ruleId: string;
  titleEn: string;
  titleZh: string;
  chamber: string;
  personaHook: string;
  tone: 'gentle' | 'firm' | 'fierce' | 'consoling' | 'clarifying' | 'celebratory' | 'cautionary' | 'mysterious';
  symbols: string[];
  emotionalValence: 'positive' | 'negative' | 'neutral' | 'mixed';
  journeyHint: string;
}

export interface PersonaVoiceLibrary {
  version: string;
  totalEntries: number;
  entries: PersonaVoiceEntry[];
  byCategory: Record<string, PersonaVoiceEntry[]>;
  byTone: Record<string, PersonaVoiceEntry[]>;
}

// ==================== TONE MAPPINGS ====================

const RULE_TONE_MAP: Record<string, PersonaVoiceEntry['tone']> = {
  // Structure rules - mostly clarifying/firm
  pseudo_follow_wealth: 'clarifying',
  pseudo_follow_authority: 'clarifying',
  pseudo_follow_output: 'clarifying',
  quasi_follow_wealth: 'cautionary',
  quasi_follow_authority: 'cautionary',
  quasi_follow_seal: 'clarifying',
  semi_follow_wealth: 'cautionary',
  semi_follow_authority: 'cautionary',
  abandoned_follow: 'fierce',
  structure_balance_violation: 'cautionary',
  follow_broken_by_root: 'fierce',
  special_structure_override: 'firm',

  // Combination rules - mostly gentle/mysterious
  combination_season_failure: 'cautionary',
  combination_clash_break: 'fierce',
  combination_jealousy: 'mysterious',
  combination_partial: 'gentle',
  stem_combination_basic: 'gentle',
  branch_six_harmony: 'celebratory',
  branch_three_harmony: 'celebratory',
  directional_combination: 'mysterious',

  // Useful God rules - mostly consoling/firm
  useful_god_blocked: 'consoling',
  useful_god_combined_away: 'cautionary',
  useful_god_harmed: 'consoling',
  useful_god_punished: 'firm',
  useful_god_clashed: 'fierce',
  useful_god_weakened_seasonal: 'gentle',
  useful_god_in_grave: 'mysterious',
  annoying_god_revealed: 'cautionary',
  god_absence: 'consoling',
  god_transformation: 'mysterious',

  // Clash/Harm/Punishment - fierce/cautionary
  clash_beneficial: 'celebratory',
  clash_harmful: 'cautionary',
  clash_day_year: 'fierce',
  harm_detected: 'cautionary',
  harm_health_impact: 'consoling',
  harm_relationship_impact: 'gentle',
  punishment_unkindness: 'fierce',
  punishment_bullying: 'firm',
  punishment_ungrateful: 'cautionary',
  punishment_self: 'consoling',
  destruction_detected: 'cautionary',
  multiple_negatives: 'fierce',

  // Seasonal rules - gentle/clarifying
  seasonal_peak: 'celebratory',
  seasonal_weakness: 'gentle',
  seasonal_death: 'mysterious',
  element_timely: 'celebratory',
  element_untimely: 'consoling',
  element_in_grave: 'mysterious',

  // Hidden Stem rules - mysterious/clarifying
  hidden_stem_main_qi: 'clarifying',
  hidden_stem_revealed: 'celebratory',
  hidden_stem_clashed: 'cautionary',
  hidden_stem_useful_god: 'mysterious',
  hidden_stem_annoying_god: 'cautionary',
  hidden_stem_combination_participant: 'gentle',
  hidden_stem_strength_calculation: 'clarifying',
  hidden_stem_seasonal_modification: 'clarifying',
  hidden_stem_grave_storage: 'mysterious',

  // Luck Pillar rules - varied
  luck_pillar_transforms_structure: 'fierce',
  luck_pillar_reveals_useful_god: 'celebratory',
  luck_pillar_activates_annoying_god: 'cautionary',
  luck_pillar_completes_combination: 'celebratory',
  luck_pillar_breaks_combination: 'fierce',
  luck_pillar_punishment_activation: 'firm',
  luck_pillar_seasonal_alignment: 'gentle',
  luck_pillar_element_balance_shift: 'clarifying',
  luck_pillar_stem_branch_conflict: 'cautionary'
};

// ==================== SYMBOL MAPPINGS ====================

const RULE_SYMBOLS_MAP: Record<string, string[]> = {
  // Structure
  pseudo_follow_wealth: ['hidden throne', 'veiled crown', 'shadow kingdom'],
  pseudo_follow_authority: ['borrowed scepter', 'proxy power', 'lieutenants mantle'],
  pseudo_follow_output: ['vessel speaking', 'channeled voice', 'hollow vessel'],
  quasi_follow_wealth: ['fractured throne', 'contested crown', 'divided kingdom'],
  quasi_follow_authority: ['challenged scepter', 'tested power', 'proving grounds'],
  quasi_follow_seal: ['leaking vessel', 'porous container', 'escaping wisdom'],
  semi_follow_wealth: ['half surrender', 'partial devotion', 'one foot in'],
  semi_follow_authority: ['bending knee', 'reluctant submission', 'eyes up'],
  abandoned_follow: ['broken oath', 'betrayed surrender', 'root rebellion'],
  structure_balance_violation: ['scales tipping', 'broken equilibrium', 'center lost'],
  follow_broken_by_root: ['deep root', 'hidden anchor', 'secret strength'],
  special_structure_override: ['grand pattern', 'master design', 'higher order'],

  // Combination
  combination_season_failure: ['wrong season', 'timing mismatch', 'early bloom'],
  combination_clash_break: ['shattered union', 'broken merger', 'torn apart'],
  combination_jealousy: ['third party', 'jealous intruder', 'triangle'],
  combination_partial: ['incomplete puzzle', 'waiting pieces', 'potential union'],
  stem_combination_basic: ['marriage of stems', 'heavenly union', 'paired forces'],
  branch_six_harmony: ['deep bond', 'earthly marriage', 'rooted union'],
  branch_three_harmony: ['triangular strength', 'three pillars', 'complete frame'],
  directional_combination: ['compass points', 'cardinal gathering', 'seasonal congress'],

  // Useful God
  useful_god_blocked: ['path blocked', 'door closed', 'guide obscured'],
  useful_god_combined_away: ['guide distracted', 'helper engaged', 'support divided'],
  useful_god_harmed: ['wounded guide', 'limping support', 'damaged helper'],
  useful_god_punished: ['guide punished', 'helper tested', 'support challenged'],
  useful_god_clashed: ['guide struck', 'helper attacked', 'support shaken'],
  useful_god_weakened_seasonal: ['winter fire', 'summer water', 'out of season'],
  useful_god_in_grave: ['buried treasure', 'sleeping aid', 'dormant support'],
  annoying_god_revealed: ['enemy surfaces', 'threat exposed', 'shadow visible'],
  god_absence: ['empty throne', 'missing guide', 'vacant support'],
  god_transformation: ['changed guide', 'morphing support', 'shapeshifter'],

  // Clash/Harm/Punishment
  clash_beneficial: ['clearing storm', 'cleansing fire', 'necessary destruction'],
  clash_harmful: ['damaging collision', 'harmful impact', 'destructive force'],
  clash_day_year: ['pillar war', 'internal conflict', 'self vs world'],
  harm_detected: ['hidden wound', 'subtle damage', 'interior injury'],
  harm_health_impact: ['body affected', 'health concern', 'physical warning'],
  harm_relationship_impact: ['bond strained', 'connection tested', 'relationship stress'],
  punishment_unkindness: ['trust betrayed', 'agreement broken', 'promise violated'],
  punishment_bullying: ['power abuse', 'strength misused', 'domination'],
  punishment_ungrateful: ['gift forgotten', 'help dismissed', 'unremembered aid'],
  punishment_self: ['self-sabotage', 'inner conflict', 'self-punishment'],
  destruction_detected: ['subtle erosion', 'gradual decay', 'slow dissolution'],
  multiple_negatives: ['storm of storms', 'compounded difficulty', 'layered challenges'],

  // Seasonal
  seasonal_peak: ['full bloom', 'peak power', 'zenith moment'],
  seasonal_weakness: ['fading strength', 'waning power', 'ebbing tide'],
  seasonal_death: ['dormant seed', 'waiting winter', 'necessary rest'],
  element_timely: ['right moment', 'perfect timing', 'in season'],
  element_untimely: ['wrong season', 'mismatched timing', 'out of phase'],
  element_in_grave: ['buried seed', 'stored potential', 'waiting release'],

  // Hidden Stem
  hidden_stem_main_qi: ['primary vein', 'main deposit', 'central ore'],
  hidden_stem_revealed: ['emerging treasure', 'surfacing potential', 'manifesting power'],
  hidden_stem_clashed: ['shaken ground', 'disturbed roots', 'trembling foundation'],
  hidden_stem_useful_god: ['underground river', 'hidden spring', 'buried water'],
  hidden_stem_annoying_god: ['sleeping dragon', 'dormant threat', 'buried danger'],
  hidden_stem_combination_participant: ['underground connection', 'root merger', 'hidden bond'],
  hidden_stem_strength_calculation: ['ore distribution', 'vein mapping', 'deposit analysis'],
  hidden_stem_seasonal_modification: ['seasonal roots', 'timed growth', 'cyclical depth'],
  hidden_stem_grave_storage: ['vault', 'storage chamber', 'sealed treasury'],

  // Luck Pillar
  luck_pillar_transforms_structure: ['tectonic shift', 'landscape change', 'new terrain'],
  luck_pillar_reveals_useful_god: ['treasure surfacing', 'guide appearing', 'support arriving'],
  luck_pillar_activates_annoying_god: ['dragon waking', 'threat activating', 'enemy rising'],
  luck_pillar_completes_combination: ['final piece', 'completing puzzle', 'unified power'],
  luck_pillar_breaks_combination: ['shattered unity', 'broken alliance', 'separated forces'],
  luck_pillar_punishment_activation: ['karma arriving', 'lesson beginning', 'test commencing'],
  luck_pillar_seasonal_alignment: ['wind at back', 'natural flow', 'aligned forces'],
  luck_pillar_element_balance_shift: ['recipe change', 'new proportions', 'shifted balance'],
  luck_pillar_stem_branch_conflict: ['divided pillar', 'conflicted timing', 'mixed messages']
};

// ==================== CHAMBER MAPPINGS ====================

const RULE_CHAMBER_MAP: Record<string, string> = {
  // Structure
  pseudo_follow_wealth: 'Structure Chamber',
  pseudo_follow_authority: 'Structure Chamber',
  pseudo_follow_output: 'Structure Chamber',
  quasi_follow_wealth: 'Structure Chamber',
  quasi_follow_authority: 'Structure Chamber',
  quasi_follow_seal: 'Structure Chamber',
  semi_follow_wealth: 'Structure Chamber',
  semi_follow_authority: 'Structure Chamber',
  abandoned_follow: 'Structure Chamber',
  structure_balance_violation: 'Structure Chamber',
  follow_broken_by_root: 'Structure Chamber',
  special_structure_override: 'Structure Chamber',

  // Combination
  combination_season_failure: 'Combination Hall',
  combination_clash_break: 'Combination Hall',
  combination_jealousy: 'Combination Hall',
  combination_partial: 'Combination Hall',
  stem_combination_basic: 'Combination Hall',
  branch_six_harmony: 'Combination Hall',
  branch_three_harmony: 'Combination Hall',
  directional_combination: 'Combination Hall',

  // Useful God
  useful_god_blocked: 'Useful God Sanctum',
  useful_god_combined_away: 'Useful God Sanctum',
  useful_god_harmed: 'Useful God Sanctum',
  useful_god_punished: 'Useful God Sanctum',
  useful_god_clashed: 'Useful God Sanctum',
  useful_god_weakened_seasonal: 'Useful God Sanctum',
  useful_god_in_grave: 'Useful God Sanctum',
  annoying_god_revealed: 'Useful God Sanctum',
  god_absence: 'Useful God Sanctum',
  god_transformation: 'Useful God Sanctum',

  // Clash/Harm/Punishment
  clash_beneficial: 'Conflict Arena',
  clash_harmful: 'Conflict Arena',
  clash_day_year: 'Conflict Arena',
  harm_detected: 'Conflict Arena',
  harm_health_impact: 'Conflict Arena',
  harm_relationship_impact: 'Conflict Arena',
  punishment_unkindness: 'Conflict Arena',
  punishment_bullying: 'Conflict Arena',
  punishment_ungrateful: 'Conflict Arena',
  punishment_self: 'Conflict Arena',
  destruction_detected: 'Conflict Arena',
  multiple_negatives: 'Conflict Arena',

  // Seasonal
  seasonal_peak: 'Seasonal Gallery',
  seasonal_weakness: 'Seasonal Gallery',
  seasonal_death: 'Seasonal Gallery',
  element_timely: 'Seasonal Gallery',
  element_untimely: 'Seasonal Gallery',
  element_in_grave: 'Seasonal Gallery',

  // Hidden Stem
  hidden_stem_main_qi: 'Hidden Roots Crypt',
  hidden_stem_revealed: 'Hidden Roots Crypt',
  hidden_stem_clashed: 'Hidden Roots Crypt',
  hidden_stem_useful_god: 'Hidden Roots Crypt',
  hidden_stem_annoying_god: 'Hidden Roots Crypt',
  hidden_stem_combination_participant: 'Hidden Roots Crypt',
  hidden_stem_strength_calculation: 'Hidden Roots Crypt',
  hidden_stem_seasonal_modification: 'Hidden Roots Crypt',
  hidden_stem_grave_storage: 'Hidden Roots Crypt',

  // Luck Pillar
  luck_pillar_transforms_structure: 'Luck Pillar Corridor',
  luck_pillar_reveals_useful_god: 'Luck Pillar Corridor',
  luck_pillar_activates_annoying_god: 'Luck Pillar Corridor',
  luck_pillar_completes_combination: 'Luck Pillar Corridor',
  luck_pillar_breaks_combination: 'Luck Pillar Corridor',
  luck_pillar_punishment_activation: 'Luck Pillar Corridor',
  luck_pillar_seasonal_alignment: 'Luck Pillar Corridor',
  luck_pillar_element_balance_shift: 'Luck Pillar Corridor',
  luck_pillar_stem_branch_conflict: 'Luck Pillar Corridor'
};

// ==================== TITLE TRANSLATIONS ====================

const TITLE_TRANSLATIONS: Record<string, { en: string; zh: string }> = {
  pseudo_follow_wealth: { en: 'Pseudo-Follow Wealth Structure', zh: '假从财格' },
  pseudo_follow_authority: { en: 'Pseudo-Follow Authority Structure', zh: '假从官格' },
  pseudo_follow_output: { en: 'Pseudo-Follow Output Structure', zh: '假从儿格' },
  quasi_follow_wealth: { en: 'Quasi-Follow Wealth Structure', zh: '类从财格' },
  quasi_follow_authority: { en: 'Quasi-Follow Authority Structure', zh: '类从官格' },
  quasi_follow_seal: { en: 'Quasi-Follow Seal Structure', zh: '类从印格' },
  semi_follow_wealth: { en: 'Semi-Follow Wealth Structure', zh: '半从财格' },
  semi_follow_authority: { en: 'Semi-Follow Authority Structure', zh: '半从官格' },
  abandoned_follow: { en: 'Abandoned Follow Structure', zh: '弃从格' },
  structure_balance_violation: { en: 'Structure Balance Violation', zh: '格局平衡失调' },
  follow_broken_by_root: { en: 'Follow Structure Broken by Root', zh: '从格见根破格' },
  special_structure_override: { en: 'Special Structure Override', zh: '特殊格局覆盖' },

  combination_season_failure: { en: 'Combination Season Failure', zh: '合化不成(季节)' },
  combination_clash_break: { en: 'Combination Broken by Clash', zh: '合化被冲破' },
  combination_jealousy: { en: 'Combination Jealousy', zh: '争合妒合' },
  combination_partial: { en: 'Partial Combination', zh: '半合' },
  stem_combination_basic: { en: 'Stem Combination', zh: '天干五合' },
  branch_six_harmony: { en: 'Six Harmony', zh: '地支六合' },
  branch_three_harmony: { en: 'Three Harmony', zh: '地支三合' },
  directional_combination: { en: 'Directional Combination', zh: '方合' },

  useful_god_blocked: { en: 'Useful God Blocked', zh: '用神被阻' },
  useful_god_combined_away: { en: 'Useful God Combined Away', zh: '用神被合' },
  useful_god_harmed: { en: 'Useful God Harmed', zh: '用神被害' },
  useful_god_punished: { en: 'Useful God Punished', zh: '用神被刑' },
  useful_god_clashed: { en: 'Useful God Clashed', zh: '用神被冲' },
  useful_god_weakened_seasonal: { en: 'Useful God Seasonal Weakness', zh: '用神不得时令' },
  useful_god_in_grave: { en: 'Useful God in Grave', zh: '用神入墓' },
  annoying_god_revealed: { en: 'Annoying God Revealed', zh: '忌神透出' },
  god_absence: { en: 'Useful God Absence', zh: '用神不现' },
  god_transformation: { en: 'God Transformation', zh: '用神转化' },

  clash_beneficial: { en: 'Beneficial Clash', zh: '吉冲' },
  clash_harmful: { en: 'Harmful Clash', zh: '凶冲' },
  clash_day_year: { en: 'Day-Year Clash', zh: '日年相冲' },
  harm_detected: { en: 'Harm Detected', zh: '地支相害' },
  harm_health_impact: { en: 'Harm Health Impact', zh: '害影响健康' },
  harm_relationship_impact: { en: 'Harm Relationship Impact', zh: '害影响关系' },
  punishment_unkindness: { en: 'Unkindness Punishment', zh: '恃势之刑' },
  punishment_bullying: { en: 'Bullying Punishment', zh: '无恩之刑' },
  punishment_ungrateful: { en: 'Ungrateful Punishment', zh: '无礼之刑' },
  punishment_self: { en: 'Self-Punishment', zh: '自刑' },
  destruction_detected: { en: 'Destruction Detected', zh: '地支相破' },
  multiple_negatives: { en: 'Multiple Negative Interactions', zh: '多重负面互动' },

  seasonal_peak: { en: 'Seasonal Peak', zh: '得令' },
  seasonal_weakness: { en: 'Seasonal Weakness', zh: '失令' },
  seasonal_death: { en: 'Seasonal Death', zh: '死绝' },
  element_timely: { en: 'Element Timely', zh: '五行得时' },
  element_untimely: { en: 'Element Untimely', zh: '五行失时' },
  element_in_grave: { en: 'Element in Grave', zh: '五行入墓' },

  hidden_stem_main_qi: { en: 'Hidden Stem Main Qi', zh: '本气藏干' },
  hidden_stem_revealed: { en: 'Hidden Stem Revealed', zh: '藏干透出' },
  hidden_stem_clashed: { en: 'Hidden Stem Clashed', zh: '藏干受冲' },
  hidden_stem_useful_god: { en: 'Useful God in Hidden Stems', zh: '用神藏于地支' },
  hidden_stem_annoying_god: { en: 'Annoying God Hidden', zh: '忌神藏而不露' },
  hidden_stem_combination_participant: { en: 'Hidden Stem in Combination', zh: '藏干参与合化' },
  hidden_stem_strength_calculation: { en: 'Hidden Stem Strength', zh: '藏干力量分配' },
  hidden_stem_seasonal_modification: { en: 'Seasonal Hidden Stem', zh: '藏干受季节影响' },
  hidden_stem_grave_storage: { en: 'Grave Storage', zh: '墓库开合' },

  luck_pillar_transforms_structure: { en: 'Luck Pillar Transforms Structure', zh: '大运改格' },
  luck_pillar_reveals_useful_god: { en: 'Luck Pillar Reveals Useful God', zh: '大运透用神' },
  luck_pillar_activates_annoying_god: { en: 'Luck Pillar Activates Annoying God', zh: '大运透忌神' },
  luck_pillar_completes_combination: { en: 'Luck Pillar Completes Combination', zh: '大运凑合' },
  luck_pillar_breaks_combination: { en: 'Luck Pillar Breaks Combination', zh: '大运冲散合局' },
  luck_pillar_punishment_activation: { en: 'Luck Pillar Punishment Activation', zh: '大运凑刑' },
  luck_pillar_seasonal_alignment: { en: 'Luck Pillar Seasonal Alignment', zh: '大运助用神得令' },
  luck_pillar_element_balance_shift: { en: 'Luck Pillar Element Shift', zh: '大运改变五行平衡' },
  luck_pillar_stem_branch_conflict: { en: 'Luck Pillar Internal Conflict', zh: '大运天地相战' }
};

// ==================== BUILD LIBRARY ====================

/**
 * Build the complete Persona Voice Library from Codex entries
 */
export function buildPersonaVoiceLibrary(): PersonaVoiceLibrary {
  const entries: PersonaVoiceEntry[] = [];

  for (const [ruleId, codexEntry] of Object.entries(COMPLETE_CODEX_LIBRARY)) {
    const titles = TITLE_TRANSLATIONS[ruleId] || { en: codexEntry.explanation.title, zh: '' };

    const entry: PersonaVoiceEntry = {
      ruleId,
      titleEn: titles.en,
      titleZh: titles.zh,
      chamber: RULE_CHAMBER_MAP[ruleId] || 'Unknown Chamber',
      personaHook: codexEntry.personaHook,
      tone: RULE_TONE_MAP[ruleId] || 'clarifying',
      symbols: RULE_SYMBOLS_MAP[ruleId] || [],
      emotionalValence: mapEffectToValence(codexEntry.effect),
      journeyHint: codexEntry.journeyStepHint
    };

    entries.push(entry);
  }

  // Group by category
  const byCategory: Record<string, PersonaVoiceEntry[]> = {};
  for (const entry of entries) {
    const category = entry.chamber;
    if (!byCategory[category]) byCategory[category] = [];
    byCategory[category].push(entry);
  }

  // Group by tone
  const byTone: Record<string, PersonaVoiceEntry[]> = {};
  for (const entry of entries) {
    if (!byTone[entry.tone]) byTone[entry.tone] = [];
    byTone[entry.tone].push(entry);
  }

  return {
    version: '1.0.0',
    totalEntries: entries.length,
    entries,
    byCategory,
    byTone
  };
}

function mapEffectToValence(effect: string): PersonaVoiceEntry['emotionalValence'] {
  switch (effect) {
    case 'beneficial': return 'positive';
    case 'challenging': return 'negative';
    case 'mixed': return 'mixed';
    default: return 'neutral';
  }
}

// ==================== EXPORT FUNCTIONS ====================

/**
 * Export library as Markdown
 */
export function exportPersonaLibraryAsMarkdown(library?: PersonaVoiceLibrary): string {
  const lib = library || buildPersonaVoiceLibrary();
  const lines: string[] = [];

  lines.push('# Persona Voice Library');
  lines.push(`*${lib.totalEntries} entries • Version ${lib.version}*`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // By Chamber
  for (const [chamber, entries] of Object.entries(lib.byCategory)) {
    lines.push(`## ${chamber}`);
    lines.push('');

    for (const entry of entries) {
      lines.push(`### ${entry.titleEn} (${entry.titleZh})`);
      lines.push('');
      lines.push(`**Rule ID:** \`${entry.ruleId}\``);
      lines.push(`**Tone:** ${entry.tone}`);
      lines.push(`**Valence:** ${entry.emotionalValence}`);
      lines.push('');
      lines.push('#### Voice');
      lines.push(entry.personaHook);
      lines.push('');
      lines.push('#### Symbols');
      entry.symbols.forEach(s => lines.push(`- ${s}`));
      lines.push('');
      lines.push('#### Journey Hint');
      lines.push(entry.journeyHint);
      lines.push('');
      lines.push('---');
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Export library as JSON
 */
export function exportPersonaLibraryAsJson(library?: PersonaVoiceLibrary): string {
  const lib = library || buildPersonaVoiceLibrary();
  return JSON.stringify(lib, null, 2);
}

/**
 * Export voice scripts only (for TTS)
 */
export function exportVoiceScriptsOnly(library?: PersonaVoiceLibrary): string[] {
  const lib = library || buildPersonaVoiceLibrary();
  return lib.entries.map(e => e.personaHook);
}

/**
 * Export by tone for emotional filtering
 */
export function exportByTone(tone: PersonaVoiceEntry['tone'], library?: PersonaVoiceLibrary): PersonaVoiceEntry[] {
  const lib = library || buildPersonaVoiceLibrary();
  return lib.byTone[tone] || [];
}

/**
 * Get specific entry by rule ID
 */
export function getVoiceEntry(ruleId: string, library?: PersonaVoiceLibrary): PersonaVoiceEntry | undefined {
  const lib = library || buildPersonaVoiceLibrary();
  return lib.entries.find(e => e.ruleId === ruleId);
}

/**
 * Render voice entry card HTML
 */
export function renderVoiceEntryHtml(entry: PersonaVoiceEntry): string {
  const toneColors: Record<string, string> = {
    gentle: '#81c784',
    firm: '#64b5f6',
    fierce: '#e57373',
    consoling: '#ce93d8',
    clarifying: '#90caf9',
    celebratory: '#ffd54f',
    cautionary: '#ffb74d',
    mysterious: '#b39ddb'
  };

  return `
<div class="voice-entry" data-tone="${entry.tone}" data-valence="${entry.emotionalValence}">
  <div class="voice-header" style="border-left: 4px solid ${toneColors[entry.tone] || '#ccc'}">
    <h3>${entry.titleEn}</h3>
    <span class="title-zh">${entry.titleZh}</span>
    <div class="meta">
      <span class="chamber">${entry.chamber}</span>
      <span class="tone" style="background: ${toneColors[entry.tone]}20; color: ${toneColors[entry.tone]}">${entry.tone}</span>
    </div>
  </div>
  <div class="voice-content">
    <blockquote class="persona-hook">${entry.personaHook}</blockquote>
    <div class="symbols">
      ${entry.symbols.map(s => `<span class="symbol">${s}</span>`).join('')}
    </div>
    <div class="journey-hint">
      <strong>Journey:</strong> ${entry.journeyHint}
    </div>
  </div>
</div>
`;
}

/**
 * Render full library HTML
 */
export function renderPersonaLibraryHtml(library?: PersonaVoiceLibrary): string {
  const lib = library || buildPersonaVoiceLibrary();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Persona Voice Library</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Georgia', serif;
      background: #faf8f5;
      color: #2c2416;
      line-height: 1.6;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }
    h1 {
      text-align: center;
      color: #8b4513;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 2rem;
    }
    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .filters select {
      padding: 0.5rem;
      border: 1px solid #d4c4a8;
      border-radius: 4px;
      background: white;
    }
    .chamber-section {
      margin-bottom: 3rem;
    }
    .chamber-section h2 {
      color: #8b4513;
      border-bottom: 2px solid #d4c4a8;
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }
    .voice-entry {
      background: white;
      border: 1px solid #d4c4a8;
      border-radius: 8px;
      margin-bottom: 1rem;
      overflow: hidden;
    }
    .voice-header {
      padding: 1rem;
      background: #f5f0e8;
    }
    .voice-header h3 {
      margin-bottom: 0.25rem;
    }
    .title-zh {
      color: #666;
      font-size: 0.9em;
    }
    .meta {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .chamber, .tone {
      font-size: 0.8em;
      padding: 0.2rem 0.5rem;
      border-radius: 10px;
    }
    .chamber {
      background: #eee;
    }
    .voice-content {
      padding: 1rem;
    }
    .persona-hook {
      font-style: italic;
      color: #8b4513;
      border-left: 3px solid #8b4513;
      padding-left: 1rem;
      margin-bottom: 1rem;
    }
    .symbols {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
    .symbol {
      background: #f0e8d8;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.85em;
    }
    .journey-hint {
      font-size: 0.9em;
      color: #555;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Persona Voice Library</h1>
    <p class="subtitle">${lib.totalEntries} entries • Luna's Voice for the Cathedral</p>

    <div class="filters">
      <select id="chamber-filter">
        <option value="all">All Chambers</option>
        ${Object.keys(lib.byCategory).map(c => `<option value="${c}">${c}</option>`).join('')}
      </select>
      <select id="tone-filter">
        <option value="all">All Tones</option>
        ${Object.keys(lib.byTone).map(t => `<option value="${t}">${t}</option>`).join('')}
      </select>
    </div>

    ${Object.entries(lib.byCategory).map(([chamber, entries]) => `
      <section class="chamber-section" data-chamber="${chamber}">
        <h2>${chamber}</h2>
        ${entries.map(e => renderVoiceEntryHtml(e)).join('')}
      </section>
    `).join('')}
  </div>

  <script>
    document.getElementById('chamber-filter').addEventListener('change', (e) => {
      const val = e.target.value;
      document.querySelectorAll('.chamber-section').forEach(s => {
        s.style.display = (val === 'all' || s.dataset.chamber === val) ? 'block' : 'none';
      });
    });
    document.getElementById('tone-filter').addEventListener('change', (e) => {
      const val = e.target.value;
      document.querySelectorAll('.voice-entry').forEach(v => {
        v.style.display = (val === 'all' || v.dataset.tone === val) ? 'block' : 'none';
      });
    });
  </script>
</body>
</html>
`;
}

// Export the pre-built library
export const PERSONA_VOICE_LIBRARY = buildPersonaVoiceLibrary();
