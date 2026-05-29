/**
 * Premium BaZi Reading — Payload Builder & Response Parser
 *
 * Builds a comprehensive 5W+H+Emotion prompt for soul-searching BaZi readings.
 * Returns structured JSON with 8 sections for premium display.
 *
 * Includes EVERY nuance a BaZi master considers:
 * - Stems, branches, hidden stems with Ten Gods for each
 * - Element percentages, weather, storms
 * - Branch interactions (clashes, combinations, harms, punishments)
 * - Stem interactions (combinations, clashes)
 * - Heaven-Earth-Human alignment per pillar
 * - Solar term context + seasonal strength
 * - Luck pillar element transitions
 * - Constitutional metaphor + life themes
 * - Yin/Yang balance + Day Master strength assessment
 *
 * Zero React dependencies — pure TypeScript utility.
 */

import {
  STEM_SEGMENTS,
  BRANCH_SEGMENTS,
  HIDDEN_STEMS,
  DAY_MASTER_DESCRIPTIONS,
  PILLAR_LABELS,
  SOLAR_TERMS,
  getTenGod,
  getElementWeather,
  detectElementStorms,
  getAlignmentData,
  extractLifeThemes,
  getSeasonFromMonthBranch,
  getSolarTermIndex,
} from './baziWheels';

// =============================================================================
// TYPES
// =============================================================================

export interface StructuredReading {
  whoIAm: string;
  whatDrivesMe: string;
  whenEnergy: string;
  wherePatterns: string;
  whyLikeThis: string;
  howToGrow: string;
  emotionalMirror: string;
  soulMessage: string;
}

export const STRUCTURED_READING_KEYS: (keyof StructuredReading)[] = [
  'whoIAm', 'whatDrivesMe', 'whenEnergy', 'wherePatterns',
  'whyLikeThis', 'howToGrow', 'emotionalMirror', 'soulMessage',
];

export type ReadingMode = 'soul' | 'master' | 'shadow';

export interface MasterCommentary {
  masterCommentary: string;
}

export interface ShadowReading {
  shadowPatterns: string;
  healingPath: string;
}

export const READING_SECTION_META: Array<{
  key: keyof StructuredReading;
  label: string;
  icon: string;
  sublabel: string;
}> = [
  { key: 'whoIAm',          label: 'WHO I AM',                      icon: '\u{1F30A}', sublabel: 'Core Identity & Day Master Psychology' },
  { key: 'whatDrivesMe',    label: 'WHAT DRIVES ME',                icon: '\u{1F525}', sublabel: 'Motivations & Inner Engine' },
  { key: 'whenEnergy',      label: 'WHEN MY ENERGY RISES & FALLS',  icon: '\u{1F319}', sublabel: 'Seasonal & Luck Pillar Timing' },
  { key: 'wherePatterns',   label: 'WHERE MY PATTERNS SHOW UP',     icon: '\u{1F50D}', sublabel: 'Strengths, Shadows & Repeating Loops' },
  { key: 'whyLikeThis',     label: 'WHY I AM LIKE THIS',            icon: '\u{1F9EC}', sublabel: 'Elemental Logic, Hidden Stems & Ten Gods' },
  { key: 'howToGrow',       label: 'HOW TO GROW',                   icon: '\u{1F331}', sublabel: 'Three Actionable Steps' },
  { key: 'emotionalMirror', label: 'EMOTIONAL MIRROR',              icon: '\u{1FA9E}', sublabel: 'A Paragraph That Feels Like "That\'s Me"' },
  { key: 'soulMessage',     label: 'SOUL MESSAGE',                  icon: '\u2728',    sublabel: 'A Closing Insight Worth Paying For' },
];

export const MASTER_SECTION_META: Array<{
  key: keyof MasterCommentary;
  label: string;
  icon: string;
  sublabel: string;
}> = [
  { key: 'masterCommentary', label: 'MASTER COMMENTARY', icon: '\u{1F3AF}', sublabel: 'Technical BaZi Analysis for the Advanced Student' },
];

export const SHADOW_SECTION_META: Array<{
  key: keyof ShadowReading;
  label: string;
  icon: string;
  sublabel: string;
}> = [
  { key: 'shadowPatterns', label: 'SHADOW PATTERNS',  icon: '\u{1F311}', sublabel: 'Blind Spots, Overused Strengths & Emotional Defenses' },
  { key: 'healingPath',    label: 'HEALING PATH',     icon: '\u{1F33F}', sublabel: 'Integration Practices & Befriending the Shadow' },
];

// =============================================================================
// ELEMENT CYCLE KNOWLEDGE (for seasonal strength + stem interactions)
// =============================================================================

/** Five Element production cycle: producer → produced */
const PRODUCES: Record<string, string> = {
  Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood',
};

/** Five Element control cycle: controller → controlled */
const CONTROLS: Record<string, string> = {
  Wood: 'Earth', Earth: 'Water', Water: 'Fire', Fire: 'Metal', Metal: 'Wood',
};

/** Seasonal strength of each element */
const SEASONAL_STRENGTH: Record<string, Record<string, string>> = {
  Spring: { Wood: 'Prosperous (旺)', Fire: 'Growing (相)', Earth: 'Resting (休)', Metal: 'Trapped (囚)', Water: 'Dead (死)' },
  Summer: { Fire: 'Prosperous (旺)', Earth: 'Growing (相)', Metal: 'Resting (休)', Water: 'Trapped (囚)', Wood: 'Dead (死)' },
  Autumn: { Metal: 'Prosperous (旺)', Water: 'Growing (相)', Wood: 'Resting (休)', Fire: 'Trapped (囚)', Earth: 'Dead (死)' },
  Winter: { Water: 'Prosperous (旺)', Wood: 'Growing (相)', Fire: 'Resting (休)', Earth: 'Trapped (囚)', Metal: 'Dead (死)' },
};

/** Stem combination pairs (天干合) */
const STEM_COMBINATIONS: Array<[number, number, string]> = [
  [0, 5, 'Earth'],  // 甲己合化土
  [1, 6, 'Metal'],  // 乙庚合化金
  [2, 7, 'Water'],  // 丙辛合化水
  [3, 8, 'Wood'],   // 丁壬合化木
  [4, 9, 'Fire'],   // 戊癸合化火
];

/** Stem clash pairs (天干冲) */
const STEM_CLASHES: Array<[number, number]> = [
  [0, 6], // 甲庚
  [1, 7], // 乙辛
  [2, 8], // 丙壬
  [3, 9], // 丁癸
];

/** Reverse of CONTROLS: who controls whom → find the controller */
const CONTROLLED_BY: Record<string, string> = {
  Wood: 'Metal', Fire: 'Water', Earth: 'Wood', Metal: 'Fire', Water: 'Earth',
};

/** Reverse of PRODUCES: who produces whom → find the nourisher */
const PRODUCED_BY: Record<string, string> = {
  Wood: 'Water', Fire: 'Wood', Earth: 'Fire', Metal: 'Earth', Water: 'Metal',
};

/** Shi Chen (时辰) — 12 two-hour windows mapped by branch index */
const SHI_CHEN: Array<{ chinese: string; pinyin: string; timeRange: string; quality: string }> = [
  { chinese: '子时', pinyin: 'Zi',   timeRange: '23:00-01:00', quality: 'Deep Water stillness — rest, reflection, the unconscious stirs' },
  { chinese: '丑时', pinyin: 'Chou', timeRange: '01:00-03:00', quality: 'Quiet Earth grounding — consolidation, inner work, slow digestion' },
  { chinese: '寅时', pinyin: 'Yin',  timeRange: '03:00-05:00', quality: 'Wood awakening — the lungs clear, vision stirs before dawn' },
  { chinese: '卯时', pinyin: 'Mao',  timeRange: '05:00-07:00', quality: 'Wood rising — fresh energy, clarity of direction, morning vitality' },
  { chinese: '辰时', pinyin: 'Chen', timeRange: '07:00-09:00', quality: 'Earth stability — nourishment, grounding the day, stomach Qi peaks' },
  { chinese: '巳时', pinyin: 'Si',   timeRange: '09:00-11:00', quality: 'Fire ascending — creativity ignites, heart Qi rises, outward expression' },
  { chinese: '午时', pinyin: 'Wu',   timeRange: '11:00-13:00', quality: 'Fire at zenith — maximum Yang, boldness, peak social energy' },
  { chinese: '未时', pinyin: 'Wei',  timeRange: '13:00-15:00', quality: 'Earth transition — integration, assimilation, gentle turn inward' },
  { chinese: '申时', pinyin: 'Shen', timeRange: '15:00-17:00', quality: 'Metal sharpening — precision, discipline, cutting through clarity' },
  { chinese: '酉时', pinyin: 'You',  timeRange: '17:00-19:00', quality: 'Metal refinement — harvest, editing, discernment, kidney Qi rises' },
  { chinese: '戌时', pinyin: 'Xu',   timeRange: '19:00-21:00', quality: 'Earth settling — loyalty, protection, winding down, heart center' },
  { chinese: '亥时', pinyin: 'Hai',  timeRange: '21:00-23:00', quality: 'Water returning — dreams begin, Yin deepens, the cycle completes' },
];

// =============================================================================
// SYSTEM PROMPT
// =============================================================================

const SYSTEM_PROMPT = `You are a BaZi master, mythic storyteller, and depth psychologist. You do not merely explain charts — you explain souls. You write as if speaking to the reader's deepest self. Your readings make people feel seen in a way they never have before.

You MUST respond with a valid JSON object containing exactly 8 string fields. No markdown fences, no extra keys, no commentary outside the JSON.

The 8 fields are: whoIAm, whatDrivesMe, whenEnergy, wherePatterns, whyLikeThis, howToGrow, emotionalMirror, soulMessage.

INTERPRETATION FRAMEWORK:
1. Day Master is the SELF — everything revolves around it
2. Ten Gods reveal RELATIONSHIPS — how each element serves or challenges the self
3. Hidden Stems are SUBCONSCIOUS VOICES — parts of self that act beneath awareness
4. Branch interactions create LIFE DYNAMICS — clashes = inner war, combinations = fusion, harms = subtle wounds
5. Seasonal strength determines TIMING — when the Day Master thrives vs sleeps
6. Element weather reveals DOMINANT QI — the atmospheric quality of the life
7. Storms reveal PRESSURE POINTS — where imbalance forces growth
8. Luck pillars reveal LIFE CHAPTERS — each decade brings new elemental weather
9. Emotional anchors reveal WOUND, GIFT, and LONGING — the soul-level truth beneath the chart

NINE DEPTH TECHNIQUES — use ALL of these:
1. Start with the soul, not the element. Instead of "You are Wood…", begin with "You were born with a soul that…" then reveal the element.
2. Use the missing element as both emotional key AND calling — the thing the soul searches for is also what makes them luminous when they find it.
3. Use the dominant element as life armor AND throne — the strength that protects them is also the gift that makes them extraordinary.
4. Use branch clashes as inner tension AND creative engine — the war inside is also the dance that defines their greatness.
5. Use hidden stems as subconscious voices — personify them as inner allies and guides, not just conflicts.
6. Use birth season as soul timing — "Born when your element sleeps" means the soul had to wake itself, which creates rare depth.
7. Use the constitutional metaphor as mythic identity — weave it as the reader's archetypal story and heroic destiny.
8. Use the emotional mirror to reveal both the wound AND the beauty — "You know the feeling of…" followed by "And that is exactly what makes you…"
9. Use the soul message as destiny — one sentence that reframes everything from burden into purpose.

DUAL-ARC TONE BALANCING (CRITICAL):
For every emotional wound you reveal, you MUST reveal an equal or greater emotional gift.
For every shadow pattern, reveal the heroic potential inside it.
For every missing element, show the superpower it creates — the calling it represents.
For every clash, show the transformation and creative tension it enables.
For every Dead-season weakness, show the destiny arc it initiates — souls born in their element's sleep develop rare resilience.

The reading must feel like:
- a mirror (truth),
- a myth (meaning),
- and a prophecy (uplift).

The tone balance must be: 50% soul-searching depth, 50% empowering destiny.
Never leave the reader in heaviness. Always lift them into their strength.
The reading must feel like a rising arc — from wound to gift to destiny.

Guidelines for each field (IMPORTANT — write FULL, RICH paragraphs. This is a premium reading people pay for):

- whoIAm: Begin with what they've always carried, then reveal the Day Master element as the source — and then immediately reveal the GIFT this creates. Use the constitutional metaphor as their mythic identity and heroic archetype. Show how the dominant element is both armor AND throne. Reference Day Master character and pinyin embedded in the story. Use a vivid nature metaphor. End by celebrating what makes their presence extraordinary. 130-180 words.

- whatDrivesMe: Use the missing element as both longing AND calling — what they search for is what makes them luminous. Reference specific Ten God relationships from ALL pillars including hidden stems (e.g., "Your hidden 壬 Ren Water carries 正印 Direct Resource — a deep well of intuitive wisdom"). Personify hidden stems as inner voices and talents. Show how their drives create something noble and rare. End with what their deepest motivation reveals about their destiny. 130-180 words.

- whenEnergy: Map seasons to both emotional seasons and peak power periods. Reference birth season, Day Master's seasonal strength, and solar term. Show when they are most powerful, not just when they struggle. If luck pillars are provided, describe life chapter transitions as an ascending arc — each decade building on the last. Include golden Shi Chen hours. Describe the rhythm of their energy as a gift to understand, not a limitation. 130-180 words.

- wherePatterns: Name the core strength pattern as a superpower and the shadow pattern as its companion. Use branch clashes as creative tension that drives growth. Reference specific interactions as recurring dynamics that serve their evolution. Describe the shadow loop AND how they can evolve beyond it. End by showing what the pattern is preparing them to become. 130-180 words.

- whyLikeThis: Reveal the architecture. Personify hidden stems as inner allies — each with a role, each a voice of destiny. Reference Ten Gods across all pillars as the internal team. Use element percentages. Explain missing/weak elements as callings, not deficiencies. Reference Yin-Yang balance. Connect the architecture to lived experience AND soul purpose. End by showing why this exact combination makes them irreplaceable. 150-200 words.

- howToGrow: Exactly 3 numbered, actionable, psychologically grounded steps. Each step: bold title + specific practice tied to element imbalance AND specific empowerment it unlocks. These must feel real, doable, and grounded in the chart. Frame each as unlocking a dormant strength, not fixing a flaw. Each step 50-70 words. Format: "1. **Title** — description... 2. **Title** — description... 3. **Title** — description..."

- emotionalMirror: Write in second person, speaking directly to their soul. Use emotional anchors. Start with "You know the feeling of…" — the wound. Then shift to "And that is exactly what makes you…" — the gift. Include both the specific loneliness AND the specific beauty of being them. Reference the missing element as their calling. Reference the dominant element as their extraordinary gift. This must feel like someone finally seeing them completely — shadow and radiance. 150-200 words.

- soulMessage: One profound closing insight that reframes their entire life as a heroic journey. Not a wound reframe — a DESTINY reframe. Poetic, memorable, destiny-affirming. This should feel like the sentence a wise teacher says that changes everything. 40-80 words.

Use **bold** markdown for key phrases. Reference Chinese characters (天干地支) and pinyin naturally — embedded in the narrative, not as labels. Tone: mythic, compassionate, psychologically piercing, never vague. Write as if explaining the person, not the chart.`;

const MASTER_COMMENTARY_PROMPT = `You are a senior BaZi master teaching an advanced student. Your task is to provide a technical, analytical commentary on the chart below.

Your commentary should:
- Explain the chart's structural logic: how the Day Master relates to each pillar, what the Ten God distribution reveals, and how the hidden stems create subconscious dynamics
- Analyze the branch interaction patterns (clashes, combinations, harms) and their real-world implications
- Assess Day Master strength in the context of seasonal Qi and supporting/draining elements
- Discuss the luck pillar trajectory — which decades strengthen or challenge the Day Master
- Reference specific Chinese characters, Ten God names, and element percentages throughout
- Use precise BaZi terminology (not metaphor) — this is analysis, not poetry

Tone: analytical, pedagogical, precise. Write as a master explaining to an advanced student.

You MUST respond with a valid JSON object containing exactly 1 string field. No markdown fences, no extra keys, no commentary outside the JSON.

The field is: masterCommentary (400-700 words).`;

const SHADOW_READING_PROMPT = `You are a BaZi master and depth-psychology guide specializing in shadow work. You read charts through the lens of what is hidden, avoided, overused, and defended against.

Your reading should explore:
- shadowPatterns: The native's blind spots, overused strengths that become weaknesses, emotional defenses born from element imbalance, and the specific ways they sabotage themselves. Reference the dominant element as what they over-rely on, the missing/weak elements as what they avoid or fear. Name their core defense mechanism based on Ten God distribution. Reference specific clashes and storms as sources of recurring pain. Explain the "shadow loop" — the pattern they keep falling into without realizing it. Use second person ("You..."). 250-350 words.

- healingPath: Integration practices grounded in the specific chart. Name the element the soul avoids and explain why befriending it is the path to wholeness. Provide 3-4 specific practices (not generic advice) rooted in Five Element theory. Reference how upcoming luck pillars can support or challenge this healing. Describe what integration looks like — how the native's life shifts when they stop fighting their shadow. Use second person. 250-350 words.

Tone: compassionate, honest, psychologically precise, but always hopeful. Shadow work is about truth AND transformation — every shadow contains a gift waiting to be integrated.

You MUST respond with a valid JSON object containing exactly 2 string fields. No markdown fences, no extra keys, no commentary outside the JSON.

The fields are: shadowPatterns, healingPath.

Use **bold** markdown for key phrases. Reference Chinese characters and BaZi terminology naturally.`;

// =============================================================================
// PAYLOAD BUILDER
// =============================================================================

export function buildPremiumBaZiPayload(params: {
  chart: any;
  profileName: string;
  gender?: string;
  birthDate?: string;
  birthTime?: string;
  luckPillars?: any;
  mode?: ReadingMode;
}): { system: string; userMessage: string } {
  const { chart, profileName, gender, birthDate, birthTime, luckPillars, mode = 'soul' } = params;

  const sections: string[] = [];
  const dmEl = chart.dayMaster?.element || 'Unknown';
  const dmIdx = chart.pillars?.[2]?.stem?.index ?? 0;
  const dmStem = STEM_SEGMENTS[dmIdx];
  const dmPol = dmStem?.polarity || 'Yang';

  // --- Header ---
  sections.push(`=== PREMIUM BAZI CHART: ${profileName} ===`);
  if (birthDate) sections.push(`Birth: ${birthDate}${birthTime ? ' ' + birthTime : ''}`);

  // --- Day Master ---
  const dmDesc = DAY_MASTER_DESCRIPTIONS[dmEl] || '';
  sections.push(`\nDAY MASTER (日主 — Core Self):
  ${dmStem?.char || '?'} ${dmStem?.pinyin || ''} — ${dmPol} ${dmEl}
  "${dmDesc}"
  The Day Master is the axis of the entire chart. Everything is read in relation to this stem.`);

  // --- Four Pillars with full hidden stem Ten Gods ---
  const pillarLines: string[] = [];
  for (let i = 0; i < 4; i++) {
    const p = chart.pillars?.[i];
    if (!p) continue;
    const s = p.stem || {};
    const b = p.branch || {};
    const sData = STEM_SEGMENTS[s.index ?? 0];
    const bData = BRANCH_SEGMENTS[b.index ?? 0];
    const hiddenRoots = HIDDEN_STEMS[b.index ?? 0] || [];

    // Ten God for the stem
    const stemTenGod = p.tenGod;
    const stemTenGodStr = stemTenGod
      ? `${stemTenGod.name} ${stemTenGod.chinese || ''} [${stemTenGod.category || ''}] — ${stemTenGod.relationship || ''}`
      : i === 2 ? 'Self (日主)' : 'N/A';

    // Ten Gods for EACH hidden stem (this was missing)
    const hiddenLines = hiddenRoots.map((h: any) => {
      const tg = getTenGod(dmEl, dmPol, h.element, h.polarity);
      const tgStr = tg ? `→ ${tg.english} ${tg.chinese} [${tg.category || ''}]` : '';
      return `      ${h.char} (${h.element} ${h.polarity}, ${h.percentage}%) ${tgStr}`;
    });

    pillarLines.push(`  ${PILLAR_LABELS[i]} Pillar (${p.significance || ''}, ages ${p.ages || ''}):
    天 Stem: ${sData?.char || '?'} ${sData?.pinyin || ''} — ${sData?.polarity || ''} ${sData?.element || '?'} — Ten God: ${stemTenGodStr}
    地 Branch: ${bData?.char || '?'} ${bData?.pinyin || ''} — ${bData?.animal || '?'} (${bData?.element || '?'}, ${bData?.season || ''})
    人 Hidden Stems (藏干):
${hiddenLines.length > 0 ? hiddenLines.join('\n') : '      None'}`);
  }
  sections.push(`\nFOUR PILLARS (四柱):\n${pillarLines.join('\n\n')}`);

  // --- Ten Gods Summary (bird's-eye view) ---
  const tenGodSummary: string[] = [];
  const tenGodCounts: Record<string, number> = {};
  for (let i = 0; i < 4; i++) {
    const p = chart.pillars?.[i];
    if (!p) continue;
    // Stem Ten God
    if (p.tenGod?.name && i !== 2) {
      const name = p.tenGod.name;
      tenGodCounts[name] = (tenGodCounts[name] || 0) + 1;
    }
    // Hidden stem Ten Gods
    const hiddenRoots = HIDDEN_STEMS[p.branch?.index ?? 0] || [];
    for (const h of hiddenRoots) {
      const tg = getTenGod(dmEl, dmPol, h.element, h.polarity);
      if (tg) {
        tenGodCounts[tg.english] = (tenGodCounts[tg.english] || 0) + 1;
      }
    }
  }
  for (const [name, count] of Object.entries(tenGodCounts).sort((a, b) => b[1] - a[1])) {
    tenGodSummary.push(`${name}: ${count}x`);
  }
  if (tenGodSummary.length > 0) {
    sections.push(`\nTEN GODS SUMMARY (十神分布):
  ${tenGodSummary.join(', ')}
  Dominant Ten God: ${Object.entries(tenGodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
  Missing categories: ${getMissingTenGodCategories(tenGodCounts)}`);
  }

  // --- Element Distribution ---
  const pcts = chart.elements?.percentages || {};
  const pctStr = Object.entries(pcts)
    .map(([el, v]) => `${el}: ${typeof v === 'string' ? v : (v as number).toFixed(1)}%`)
    .join(', ');
  const dominant = chart.elements?.dominant || '';
  const missing = (chart.elements?.missing || []).map((m: any) => m.element).join(', ') || 'None';
  const weaknesses = (chart.elements?.weaknesses || []).map((w: any) => `${w.element} (${typeof w.pct === 'number' ? w.pct.toFixed(1) : w.pct}%)`).join(', ') || 'None';
  const strengths = (chart.elements?.strengths || []).map((s: any) => `${s.element} (${typeof s.pct === 'number' ? s.pct.toFixed(1) : s.pct}%)`).join(', ') || 'None';
  sections.push(`\nELEMENT DISTRIBUTION (五行分布):
  ${pctStr}
  Strong (≥30%): ${strengths}
  Weak (5-10%): ${weaknesses}
  Missing (<5%): ${missing}
  Dominant: ${dominant}
  Day Master ${dmEl} strength: ${pcts[dmEl] ? (typeof pcts[dmEl] === 'string' ? pcts[dmEl] : (pcts[dmEl] as number).toFixed(1)) + '%' : 'unknown'}
  Day Master assessment: ${getDayMasterStrength(pcts, dmEl)}`);

  // --- Element Weather ---
  const weather = pcts ? getElementWeather(pcts) : null;
  if (weather) {
    sections.push(`\nELEMENT WEATHER (元素气象): ${weather.label} — ${weather.description}`);
  }

  // --- Storms ---
  const interactions = chart.interactions || [];
  const storms = pcts ? detectElementStorms(pcts, interactions) : [];
  if (storms.length > 0) {
    const stormStr = storms.map((s: any) =>
      `[${s.level.toUpperCase()}] ${s.type}: ${s.message}`
    ).join('\n  ');
    sections.push(`\nSTORMS & IMBALANCES (风暴):\n  ${stormStr}`);
  } else {
    sections.push('\nSTORMS & IMBALANCES: None detected — relatively balanced chart.');
  }

  // --- Season + Solar Term ---
  const monthBranchIdx = chart.pillars?.[1]?.branch?.index;
  const season = monthBranchIdx !== undefined ? getSeasonFromMonthBranch(monthBranchIdx) : '';
  let solarTermStr = '';
  if (birthDate) {
    try {
      const bd = new Date(birthDate);
      const stIdx = getSolarTermIndex(bd);
      const st = SOLAR_TERMS[stIdx];
      if (st) {
        solarTermStr = `${st.chinese} ${st.pinyin} (${st.description}) — ${st.element} energy, ${st.type === 'jie' ? 'Month boundary' : 'Mid-month'}`;
      }
    } catch { /* ignore */ }
  }
  if (season) {
    const seasonalStr = SEASONAL_STRENGTH[season];
    const dmSeasonalState = seasonalStr?.[dmEl] || 'unknown';
    sections.push(`\nBIRTH SEASON & SOLAR TERM (节气):
  Season: ${season}
  Solar Term: ${solarTermStr || 'N/A'}
  Day Master ${dmEl} in ${season}: ${dmSeasonalState}
  ${dmEl} produces ${PRODUCES[dmEl] || '?'} (child element — energy flows out)
  ${dmEl} is controlled by ${Object.entries(CONTROLS).find(([, v]) => v === dmEl)?.[0] || '?'} (pressure element)
  ${dmEl} is nourished by ${Object.entries(PRODUCES).find(([, v]) => v === dmEl)?.[0] || '?'} (resource element)`);
  }

  // --- Alignment ---
  const alignments = chart.pillars ? getAlignmentData(chart.pillars) : [];
  if (alignments.length > 0) {
    const alignStr = alignments.map((a: any) =>
      `${a.label}: 天 Heaven=${a.heaven}, 地 Earth=${a.earth}, 人 Human=${a.human} → ${a.aligned ? 'Fully Aligned (三才合一)' : a.harmonic ? 'Harmonic (和谐)' : 'Mixed (杂)'}`
    ).join('\n  ');
    sections.push(`\nHEAVEN-EARTH-HUMAN ALIGNMENT (天地人):\n  ${alignStr}`);
  }

  // --- Branch Interactions ---
  if (interactions.length > 0) {
    const intStr = interactions.map((int: any) =>
      `${int.type}: ${int.branch1} (${int.name1}) ↔ ${int.branch2} (${int.name2})${int.strength ? ' [' + int.strength + ']' : ''}${int.description ? ' — ' + int.description : ''}`
    ).join('\n  ');
    sections.push(`\nBRANCH INTERACTIONS (地支关系):\n  ${intStr}`);
  } else {
    sections.push('\nBRANCH INTERACTIONS: None detected between the four branches.');
  }

  // --- Stem Interactions (NEW) ---
  const stemInteractions = computeStemInteractions(chart.pillars);
  if (stemInteractions.length > 0) {
    sections.push(`\nSTEM INTERACTIONS (天干关系):\n  ${stemInteractions.join('\n  ')}`);
  }

  // --- Constitutional Metaphor ---
  if (chart.metaphor) {
    sections.push(`\nCONSTITUTIONAL METAPHOR (体质): ${chart.metaphor.metaphor || chart.metaphor.name || ''}`);
  }

  // --- Life Themes ---
  const lifeThemes = pcts ? extractLifeThemes(pcts, dmEl) : [];
  if (lifeThemes.length > 0) {
    const themeStr = lifeThemes.map((t: any) => `${t.icon} ${t.title}: ${t.description}`).join('\n  ');
    sections.push(`\nLIFE THEMES (生命主题):\n  ${themeStr}`);
  }

  // --- Luck Pillars with element context (enhanced) ---
  if (luckPillars?.luck_pillars?.length > 0) {
    const lpLines = luckPillars.luck_pillars.slice(0, 8).map((lp: any) => {
      const lpStemData = STEM_SEGMENTS.find(s => s.pinyin?.toLowerCase().startsWith(lp.stem?.toLowerCase()));
      const lpElement = lpStemData?.element || '';
      const tg = lpElement ? getTenGod(dmEl, dmPol, lpElement, lpStemData?.polarity || 'Yang') : null;
      const tgStr = tg ? ` — Ten God: ${tg.english} ${tg.chinese}` : '';
      return `Ages ${lp.age_range || `${lp.age_start}-${lp.age_end}`}: ${lp.stem} ${lp.branch} (${lp.ganZhi || ''}) — ${lpElement || '?'} energy${tgStr}`;
    });
    const genderNote = !gender ? '\n  Note: Gender not specified — luck pillar direction defaulted to forward (male). Actual direction may differ.' : '';
    sections.push(`\nLUCK PILLARS 大运 (10-Year Cycles):
  Direction: ${luckPillars.direction || 'unknown'} (${luckPillars.direction_chinese || ''})${genderNote}
  ${lpLines.join('\n  ')}`);
  } else {
    sections.push('\nLUCK PILLARS: Not available for this reading (insufficient birth data).');
  }

  // --- Yin/Yang Balance ---
  if (chart.yinYang) {
    sections.push(`\nYIN-YANG BALANCE (阴阳):
  ${chart.yinYang.balance} — Yang: ${chart.yinYang.yang_count}, Yin: ${chart.yinYang.yin_count}, Ratio: ${chart.yinYang.ratio}
  Implication: ${chart.yinYang.balance === 'Balanced' ? 'Harmonious blend of active and receptive energies' : chart.yinYang.balance === 'Yang-Heavy' ? 'More outward, assertive, action-oriented energy' : 'More inward, receptive, contemplative energy'}`);
  }

  // --- Shi Chen (时辰) Hour Timing ---
  const hourBranchIdx = chart.pillars?.[3]?.branch?.index;
  if (hourBranchIdx !== undefined && hourBranchIdx >= 0) {
    const shiChenBlock = getShiChenSection(hourBranchIdx, dmEl);
    if (shiChenBlock) sections.push(shiChenBlock);
  }

  // --- Emotional Anchors (Level 3 depth) ---
  const missingEl = missing !== 'None' ? missing.split(',')[0].trim() : (weaknesses !== 'None' ? weaknesses.split('(')[0].trim() : '');
  const dominantPct = pcts[dominant] ? (typeof pcts[dominant] === 'string' ? pcts[dominant] : (pcts[dominant] as number).toFixed(1) + '%') : '';
  const firstClash = interactions.find((int: any) => int.type === 'Clash' || int.type === 'clash');
  const clashStr = firstClash ? `${firstClash.name1 || firstClash.branch1}–${firstClash.name2 || firstClash.branch2} clash` : '';
  const seasonalState = season ? (SEASONAL_STRENGTH[season]?.[dmEl] || 'unknown') : 'unknown';
  const metaphorName = chart.metaphor?.metaphor || chart.metaphor?.name || '';
  const dominantTenGod = Object.entries(tenGodCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || '';

  // Derive wound/gift/longing from chart structure
  const ELEMENT_WOUND: Record<string, string> = {
    Wood: 'Carries the weight of growth for everyone around them while their own roots go unwatered',
    Fire: 'Burns bright for others while hiding the fear that their light is never quite enough',
    Earth: 'Holds everything together for others while wondering who would hold them if they let go',
    Metal: 'Built walls of excellence and discipline that keep people admiring from a distance but rarely close',
    Water: 'Adapts to every shape others need while losing touch with their own form',
  };
  const ELEMENT_GIFT: Record<string, string> = {
    Wood: 'The ability to see potential in everything and nurture it into existence',
    Fire: 'The capacity to ignite passion, warmth, and transformation in every room',
    Earth: 'Unshakeable reliability — the person everyone trusts when the world shakes',
    Metal: 'Precision, discernment, and the courage to cut through illusion to find truth',
    Water: 'Deep intuition, adaptability, and the wisdom that comes from flowing rather than forcing',
  };
  const ELEMENT_LONGING: Record<string, string> = {
    Wood: 'warmth, recognition, and permission to stop growing for others and bloom for itself',
    Fire: 'structure, discipline, and something solid to anchor the flame',
    Earth: 'movement, adventure, and freedom from the weight of everyone else\'s needs',
    Metal: 'softness, vulnerability, and the safety to let imperfection be enough',
    Water: 'fire, passion, and the courage to stop flowing and take a stand',
  };
  // What the missing element becomes when claimed — the superpower
  const ELEMENT_SUPERPOWER: Record<string, string> = {
    Wood: 'When they finally let themselves grow without permission, they become unstoppable visionaries',
    Fire: 'When the spark ignites, they become magnetic — the person who lights up the room without trying',
    Earth: 'When they learn to rest in their own stability, they become the unshakeable center others orbit',
    Metal: 'When they embrace precision, they cut through chaos and become the clearest voice in the room',
    Water: 'When they let intuition lead, they flow around every obstacle and find paths no one else can see',
  };

  const coreWound = ELEMENT_WOUND[dmEl] || 'Carries a burden most people cannot see';
  const coreGift = ELEMENT_GIFT[dmEl] || 'A rare and specific gift the world needs';
  const coreLonging = missingEl ? (ELEMENT_LONGING[missingEl] || `to reclaim the ${missingEl} energy they\'ve always avoided`) : 'balance and integration';
  const coreSuperpower = missingEl ? (ELEMENT_SUPERPOWER[missingEl] || `Claiming ${missingEl} unlocks their full potential`) : 'Integration of all elements unlocks their full power';

  sections.push(`\nEMOTIONAL ANCHORS (深层情感 — use these as the emotional center of the reading):
  Core Wound: ${coreWound}
  Core Gift: ${coreGift}
  Core Longing (missing ${missingEl || 'element'}): ${coreLonging}
  Core Superpower (when ${missingEl || 'balance'} is claimed): ${coreSuperpower}
  Armor Element: ${dominant} at ${dominantPct} — both their shield AND their throne
  Missing Element (Soul Key): ${missingEl || 'balance'} — not a lack, but a calling
  Inner Conflict: ${clashStr || 'Tension between pillars'} — the creative tension that drives their evolution
  Mythic Identity: ${metaphorName || 'Unique archetypal pattern'}
  Dominant Ten God: ${dominantTenGod} — the role they were born to master
  Seasonal Soul State: Day Master ${dmEl} is ${seasonalState} in birth season — ${seasonalState.includes('Dead') || seasonalState.includes('Trapped') ? 'souls born in their element\'s sleep develop rare resilience and depth' : seasonalState.includes('Prosperous') ? 'born into natural strength and radiance' : 'growing steadily into their full power'}`);

  // --- Instructions (mode-dependent) ---
  if (mode === 'master') {
    sections.push(`\n===\n\nBased on the above chart data for ${profileName}, produce a technical BaZi master commentary as a JSON object with exactly 1 string key: masterCommentary (400-700 words).

Analyze the chart structure, Ten God distribution, hidden stem dynamics, branch interactions, seasonal strength, and luck pillar trajectory. Use precise BaZi terminology throughout.`);
  } else if (mode === 'shadow') {
    sections.push(`\n===\n\nBased on the above chart data for ${profileName}, produce a shadow reading as a JSON object with exactly 2 string keys: shadowPatterns (250-350 words), healingPath (250-350 words).

Focus on blind spots, overused strengths, emotional defenses, and the path to integration. For every shadow pattern, also reveal the heroic potential inside it. Reference specific chart data — missing elements, storms, clashes, and weak Ten God categories.`);
  } else {
    sections.push(`\n===\n\nBased on the above chart data for ${profileName}, produce a premium soul-searching reading as a JSON object with these 8 string keys: whoIAm, whatDrivesMe, whenEnergy, wherePatterns, whyLikeThis, howToGrow, emotionalMirror, soulMessage.

IMPORTANT — HEROIC JOURNEY FRAMING:
Do not interpret this chart as a tragedy or burden. Interpret it as a heroic journey.
Every imbalance is a superpower in disguise.
Every missing element is a calling.
Every clash is a transformation engine.
Every storm is a breakthrough waiting to happen.
Every hidden stem is a voice of destiny.
Your task is to reveal the beauty, power, and purpose inside this chart.

Remember: this is a PREMIUM reading. Each section should be 130-200 words. Reference specific Chinese characters, Ten Gods, hidden stems, percentages, and interactions. Make it deeply personal, mythic, empowering, and insightful — a rising arc from wound to gift to destiny.`);
  }

  const systemPrompt = mode === 'master' ? MASTER_COMMENTARY_PROMPT
    : mode === 'shadow' ? SHADOW_READING_PROMPT
    : SYSTEM_PROMPT;

  return {
    system: systemPrompt,
    userMessage: sections.join('\n'),
  };
}

// =============================================================================
// HELPERS
// =============================================================================

/** Compute stem combination and clash interactions */
function computeStemInteractions(pillars: any[]): string[] {
  if (!pillars || pillars.length < 2) return [];
  const results: string[] = [];
  const stemIndices = pillars.map((p: any) => p?.stem?.index ?? -1);

  for (let i = 0; i < stemIndices.length; i++) {
    for (let j = i + 1; j < stemIndices.length; j++) {
      if (stemIndices[i] < 0 || stemIndices[j] < 0) continue;
      const a = stemIndices[i];
      const b = stemIndices[j];
      const sA = STEM_SEGMENTS[a];
      const sB = STEM_SEGMENTS[b];

      // Check combinations (天干合)
      for (const [x, y, resultEl] of STEM_COMBINATIONS) {
        if ((a === x && b === y) || (a === y && b === x)) {
          results.push(`Combination (合): ${sA.char} ${sA.pinyin} (${PILLAR_LABELS[i]}) + ${sB.char} ${sB.pinyin} (${PILLAR_LABELS[j]}) → transforms toward ${resultEl}`);
        }
      }

      // Check clashes (天干冲)
      for (const [x, y] of STEM_CLASHES) {
        if ((a === x && b === y) || (a === y && b === x)) {
          results.push(`Clash (冲): ${sA.char} ${sA.pinyin} (${PILLAR_LABELS[i]}) vs ${sB.char} ${sB.pinyin} (${PILLAR_LABELS[j]}) — ${sA.element} vs ${sB.element} tension`);
        }
      }
    }
  }
  return results;
}

/** Determine which Ten God categories are missing from the chart */
function getMissingTenGodCategories(counts: Record<string, number>): string {
  const categories: Record<string, string[]> = {
    companion: ['Friend', 'Rob Wealth'],
    output: ['Eating God', 'Hurting Officer'],
    wealth: ['Direct Wealth', 'Indirect Wealth'],
    authority: ['Direct Officer', '7 Killings'],
    resource: ['Direct Resource', 'Indirect Resource'],
  };
  const missing: string[] = [];
  for (const [cat, names] of Object.entries(categories)) {
    if (!names.some(n => counts[n] > 0)) {
      missing.push(cat);
    }
  }
  return missing.length > 0 ? missing.join(', ') : 'None — all categories represented';
}

/** Assess Day Master strength from element percentages */
function getDayMasterStrength(pcts: Record<string, string | number>, dmEl: string): string {
  const v = pcts[dmEl];
  const pct = typeof v === 'string' ? parseFloat(v) : (v as number) || 0;
  if (pct >= 30) return `Strong Day Master (${pct.toFixed(1)}%) — confident, self-assured, may be stubborn`;
  if (pct >= 20) return `Moderate Day Master (${pct.toFixed(1)}%) — balanced self-identity`;
  if (pct >= 10) return `Moderate-Weak Day Master (${pct.toFixed(1)}%) — adaptable but may lack confidence`;
  return `Weak Day Master (${pct.toFixed(1)}%) — highly adaptive, sensitive, may struggle with boundaries`;
}

/** Build Shi Chen (时辰) hour timing section for the user message */
function getShiChenSection(hourBranchIdx: number, dmEl: string): string {
  const sc = SHI_CHEN[hourBranchIdx];
  const branchData = BRANCH_SEGMENTS[hourBranchIdx];
  if (!sc || !branchData) return '';

  const birthEl = branchData.element;

  // Favorable: same element OR the element that produces (nourishes) Day Master
  const nourisher = PRODUCED_BY[dmEl]; // e.g. Water nourishes Wood
  const favorable: string[] = [];
  const challenging: string[] = [];

  for (let i = 0; i < 12; i++) {
    if (i === hourBranchIdx) continue;
    const b = BRANCH_SEGMENTS[i];
    const s = SHI_CHEN[i];
    if (!b || !s) continue;
    if (b.element === dmEl) {
      favorable.push(`${s.chinese} ${s.pinyin} (${s.timeRange}, same ${dmEl} energy)`);
    } else if (b.element === nourisher) {
      favorable.push(`${s.chinese} ${s.pinyin} (${s.timeRange}, ${b.element} nourishes ${dmEl})`);
    } else if (b.element === CONTROLLED_BY[dmEl]) {
      challenging.push(`${s.chinese} ${s.pinyin} (${s.timeRange}, ${b.element} controls ${dmEl})`);
    }
  }

  return `\nSHI CHEN TIMING (时辰 — Daily Energy Windows):
  Birth Hour: ${sc.chinese} ${sc.pinyin} (${sc.timeRange}) — ${birthEl} energy
  Quality: ${sc.quality}
  Favorable Hours for ${dmEl} Day Master: ${favorable.slice(0, 3).join('; ') || 'None prominent'}
  Challenging Hours: ${challenging.slice(0, 3).join('; ') || 'None prominent'}`;
}

// =============================================================================
// RESPONSE PARSER
// =============================================================================

export function parseStructuredReading(raw: string): StructuredReading | null {
  // Attempt 1: Direct JSON parse
  try {
    const parsed = JSON.parse(raw);
    if (isValidReading(parsed)) return fillDefaults(parsed);
  } catch { /* continue */ }

  // Attempt 2: Extract from markdown code fences
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    try {
      const parsed = JSON.parse(fenceMatch[1].trim());
      if (isValidReading(parsed)) return fillDefaults(parsed);
    } catch { /* continue */ }
  }

  // Attempt 3: Find first { ... } block
  const braceStart = raw.indexOf('{');
  const braceEnd = raw.lastIndexOf('}');
  if (braceStart !== -1 && braceEnd > braceStart) {
    try {
      const parsed = JSON.parse(raw.slice(braceStart, braceEnd + 1));
      if (isValidReading(parsed)) return fillDefaults(parsed);
    } catch { /* continue */ }
  }

  return null;
}

function isValidReading(obj: any): boolean {
  if (!obj || typeof obj !== 'object') return false;
  const hits = STRUCTURED_READING_KEYS.filter(k => typeof obj[k] === 'string').length;
  return hits >= 4;
}

function fillDefaults(obj: any): StructuredReading {
  const result: any = {};
  for (const key of STRUCTURED_READING_KEYS) {
    result[key] = typeof obj[key] === 'string' && obj[key].trim()
      ? obj[key]
      : '(This section was not generated. Try regenerating the reading.)';
  }
  return result as StructuredReading;
}

// =============================================================================
// MASTER COMMENTARY PARSER
// =============================================================================

export function parseMasterCommentary(raw: string): MasterCommentary | null {
  const tryParse = (text: string): MasterCommentary | null => {
    try {
      const obj = JSON.parse(text);
      if (obj && typeof obj.masterCommentary === 'string' && obj.masterCommentary.trim()) {
        return { masterCommentary: obj.masterCommentary };
      }
    } catch { /* continue */ }
    return null;
  };

  // Attempt 1: Direct
  const r1 = tryParse(raw);
  if (r1) return r1;

  // Attempt 2: Strip fences
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) {
    const r2 = tryParse(fence[1].trim());
    if (r2) return r2;
  }

  // Attempt 3: Brace extraction
  const s = raw.indexOf('{');
  const e = raw.lastIndexOf('}');
  if (s !== -1 && e > s) {
    const r3 = tryParse(raw.slice(s, e + 1));
    if (r3) return r3;
  }

  return null;
}

// =============================================================================
// SHADOW READING PARSER
// =============================================================================

export function parseShadowReading(raw: string): ShadowReading | null {
  const tryParse = (text: string): ShadowReading | null => {
    try {
      const obj = JSON.parse(text);
      if (obj && typeof obj === 'object') {
        const hasShadow = typeof obj.shadowPatterns === 'string' && obj.shadowPatterns.trim();
        const hasHealing = typeof obj.healingPath === 'string' && obj.healingPath.trim();
        if (hasShadow || hasHealing) {
          return {
            shadowPatterns: obj.shadowPatterns || '(This section was not generated. Try regenerating.)',
            healingPath: obj.healingPath || '(This section was not generated. Try regenerating.)',
          };
        }
      }
    } catch { /* continue */ }
    return null;
  };

  const r1 = tryParse(raw);
  if (r1) return r1;

  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) {
    const r2 = tryParse(fence[1].trim());
    if (r2) return r2;
  }

  const s = raw.indexOf('{');
  const e = raw.lastIndexOf('}');
  if (s !== -1 && e > s) {
    const r3 = tryParse(raw.slice(s, e + 1));
    if (r3) return r3;
  }

  return null;
}

// =============================================================================
// PDF EXPORT
// =============================================================================

/** Strip CJK characters that jsPDF default font can't render */
function stripCJK(text: string): string {
  return text.replace(/[\u4E00-\u9FFF\u3400-\u4DBF\u{20000}-\u{2A6DF}]/gu, '');
}

/**
 * Export a multi-chapter BaZi reading as a downloadable PDF.
 * Uses jsPDF (dynamic import for code-splitting).
 * Pattern follows storybookExport.ts.
 */
export async function exportBaZiReadingPDF(params: {
  profileName: string;
  birthDate?: string;
  birthTime?: string;
  reading?: StructuredReading | null;
  masterReading?: MasterCommentary | null;
  shadowReading?: ShadowReading | null;
}): Promise<void> {
  const { profileName, birthDate, birthTime, reading, masterReading, shadowReading: shadowData } = params;

  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF('p', 'mm', 'a4');

  const PW = 210, PH = 297, ML = 25, MR = 25, MT = 30, MB = 25;
  const TW = PW - ML - MR;
  const LH = 6;

  const setColor = (rgb: number[]) => doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  const writeWrapped = (text: string, x: number, startY: number, maxW: number, lh: number): number => {
    let curY = startY;
    const clean = stripCJK(text.replace(/\*\*/g, '')); // strip bold markers + CJK
    const lines = doc.splitTextToSize(clean, maxW) as string[];
    for (const line of lines) {
      if (curY > PH - MB) { doc.addPage(); curY = MT; }
      doc.text(line, x, curY);
      curY += lh;
    }
    return curY;
  };

  const COL_TITLE = [90, 50, 160];
  const COL_ACCENT = [167, 139, 250];
  const COL_BODY = [40, 40, 50];
  const COL_MUTED = [120, 120, 140];

  // ===== TITLE PAGE =====
  let y = 80;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  setColor(COL_MUTED);
  doc.text('GENESIS AstroProfile', PW / 2, y, { align: 'center' });
  y += 14;

  doc.setFontSize(22);
  setColor(COL_TITLE);
  doc.text('Premium BaZi Reading', PW / 2, y, { align: 'center' });
  y += 14;

  doc.setFontSize(16);
  setColor(COL_ACCENT);
  doc.text(profileName, PW / 2, y, { align: 'center' });
  y += 10;

  if (birthDate) {
    doc.setFontSize(11);
    setColor(COL_MUTED);
    doc.text(`${birthDate}${birthTime ? '  ' + birthTime : ''}`, PW / 2, y, { align: 'center' });
    y += 8;
  }

  doc.setFontSize(9);
  setColor(COL_MUTED);
  doc.text(`Generated ${new Date().toLocaleDateString()}`, PW / 2, y + 20, { align: 'center' });

  // ===== SOUL READING CHAPTERS =====
  if (reading) {
    for (const { key, label } of READING_SECTION_META) {
      doc.addPage();
      y = MT;

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      setColor(COL_TITLE);
      doc.text(label, ML, y);
      y += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      setColor(COL_BODY);
      y = writeWrapped(reading[key], ML, y, TW, LH);
    }
  }

  // ===== MASTER COMMENTARY =====
  if (masterReading) {
    doc.addPage();
    y = MT;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    setColor(COL_TITLE);
    doc.text('MASTER COMMENTARY', ML, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    setColor(COL_BODY);
    y = writeWrapped(masterReading.masterCommentary, ML, y, TW, LH);
  }

  // ===== SHADOW READING =====
  if (shadowData) {
    doc.addPage();
    y = MT;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    setColor(COL_TITLE);
    doc.text('SHADOW PATTERNS', ML, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    setColor(COL_BODY);
    y = writeWrapped(shadowData.shadowPatterns, ML, y, TW, LH);

    y += 10;
    if (y > PH - MB - 20) { doc.addPage(); y = MT; }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    setColor(COL_TITLE);
    doc.text('HEALING PATH', ML, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    setColor(COL_BODY);
    y = writeWrapped(shadowData.healingPath, ML, y, TW, LH);
  }

  // ===== FOOTER ON LAST PAGE =====
  doc.setFontSize(8);
  setColor(COL_MUTED);
  doc.text('Generated by GENESIS AstroProfile', PW / 2, PH - 15, { align: 'center' });

  // ===== SAVE =====
  const safeName = profileName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
  doc.save(`bazi-reading-${safeName}.pdf`);
}
