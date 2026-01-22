/**
 * ============================================
 * NARRATIVE COCKPIT TEMPLATE
 * Story beats, emotional arcs, timing curves,
 * and environmental overlays
 * ============================================
 */

import { KnowledgeCodex, CodexEntry, PilgrimJourney } from '../codexTypes';

/**
 * Story beat - a significant narrative moment
 */
export interface StoryBeat {
  id: string;
  title: string;
  period: string;
  type: 'origin' | 'rising' | 'crisis' | 'climax' | 'resolution' | 'transformation';
  description: string;
  emotionalTone: string;
  significance: number; // 1-10
  relatedRules: string[];
}

/**
 * Emotional arc point
 */
export interface EmotionalArcPoint {
  period: string;
  valence: number; // -1 to 1 (negative to positive)
  intensity: number; // 0 to 1
  label: string;
  triggers: string[];
}

/**
 * Timing curve point
 */
export interface TimingCurvePoint {
  period: string;
  favorability: number; // 0 to 100
  category: 'career' | 'wealth' | 'relationships' | 'health' | 'overall';
  notes: string;
}

/**
 * Environmental overlay
 */
export interface EnvironmentalOverlay {
  type: 'seasonal' | 'feng_shui' | 'qi_men' | 'zodiac';
  name: string;
  description: string;
  recommendations: string[];
  activeUntil?: string;
}

/**
 * Complete narrative cockpit data
 */
export interface NarrativeCockpitData {
  storyBeats: StoryBeat[];
  emotionalArc: EmotionalArcPoint[];
  timingCurves: Record<string, TimingCurvePoint[]>;
  environmentalOverlays: EnvironmentalOverlay[];
  currentChapter: string;
  narrativeSummary: string;
}

/**
 * Generate story beats from codex
 */
export function generateStoryBeats(codex: KnowledgeCodex): StoryBeat[] {
  const beats: StoryBeat[] = [];

  // Origin beat - based on structure
  const structureEntries = codex.entries.filter(e => e.rule.category === 'structure');
  if (structureEntries.length > 0) {
    const mainStructure = structureEntries[0];
    beats.push({
      id: 'origin',
      title: 'The Foundation',
      period: 'Birth',
      type: 'origin',
      description: `Your chart begins with ${mainStructure.explanation.title}. ${mainStructure.explanation.summary}`,
      emotionalTone: mainStructure.effect === 'beneficial' ? 'hopeful' : mainStructure.effect === 'challenging' ? 'determined' : 'nuanced',
      significance: mainStructure.severity === 'major' ? 10 : mainStructure.severity === 'significant' ? 8 : 6,
      relatedRules: [mainStructure.rule.id]
    });
  }

  // Rising action - useful god discovery
  const usefulGodEntries = codex.entries.filter(e => e.rule.category === 'useful_god');
  if (usefulGodEntries.length > 0) {
    beats.push({
      id: 'rising-useful-god',
      title: 'Finding Your Guide',
      period: 'Early Development',
      type: 'rising',
      description: `Your path to balance reveals itself: ${usefulGodEntries[0].explanation.summary}`,
      emotionalTone: 'discovery',
      significance: 7,
      relatedRules: usefulGodEntries.map(e => e.rule.id)
    });
  }

  // Crisis beats - clashes and punishments
  const conflictEntries = codex.entries.filter(e =>
    e.rule.category === 'clash' || e.rule.category === 'harm' || e.rule.category === 'punishment'
  );
  for (const conflict of conflictEntries.slice(0, 2)) {
    beats.push({
      id: `crisis-${conflict.rule.id}`,
      title: conflict.explanation.title,
      period: 'Trials',
      type: 'crisis',
      description: conflict.explanation.summary,
      emotionalTone: 'tension',
      significance: conflict.severity === 'major' ? 9 : conflict.severity === 'significant' ? 7 : 5,
      relatedRules: [conflict.rule.id]
    });
  }

  // Transformation beats - luck pillar changes
  const luckPillarEntries = codex.entries.filter(e => e.rule.category === 'luck_pillar');
  for (const lp of luckPillarEntries.slice(0, 2)) {
    beats.push({
      id: `transformation-${lp.rule.id}`,
      title: lp.explanation.title,
      period: 'Transition',
      type: 'transformation',
      description: lp.explanation.summary,
      emotionalTone: lp.effect === 'beneficial' ? 'renewal' : 'adaptation',
      significance: lp.severity === 'major' ? 9 : 7,
      relatedRules: [lp.rule.id]
    });
  }

  return beats;
}

/**
 * Generate emotional arc from codex
 */
export function generateEmotionalArc(codex: KnowledgeCodex): EmotionalArcPoint[] {
  const points: EmotionalArcPoint[] = [];

  // Map entries to emotional arc points
  const severityToIntensity: Record<string, number> = {
    'major': 1.0,
    'significant': 0.8,
    'moderate': 0.6,
    'minor': 0.4,
    'info': 0.2
  };

  const effectToValence: Record<string, number> = {
    'beneficial': 0.8,
    'challenging': -0.6,
    'mixed': 0.1,
    'neutral': 0
  };

  // Group by category for arc progression
  const categories = ['structure', 'useful_god', 'combination', 'clash', 'seasonal', 'luck_pillar'];

  for (const category of categories) {
    const categoryEntries = codex.entries.filter(e => e.rule.category === category);
    if (categoryEntries.length === 0) continue;

    // Aggregate emotional impact
    let totalValence = 0;
    let totalIntensity = 0;
    const triggers: string[] = [];

    for (const entry of categoryEntries) {
      totalValence += effectToValence[entry.effect] || 0;
      totalIntensity += severityToIntensity[entry.severity] || 0.5;
      triggers.push(entry.explanation.title);
    }

    const avgValence = totalValence / categoryEntries.length;
    const avgIntensity = Math.min(1, totalIntensity / categoryEntries.length);

    points.push({
      period: getCategoryPeriodLabel(category),
      valence: avgValence,
      intensity: avgIntensity,
      label: getCategoryEmotionalLabel(avgValence, avgIntensity),
      triggers
    });
  }

  return points;
}

/**
 * Generate timing curves placeholder
 */
export function generateTimingCurves(codex: KnowledgeCodex): Record<string, TimingCurvePoint[]> {
  // This would integrate with actual luck pillar analysis
  const categories: ('career' | 'wealth' | 'relationships' | 'health' | 'overall')[] =
    ['career', 'wealth', 'relationships', 'health', 'overall'];

  const curves: Record<string, TimingCurvePoint[]> = {};

  for (const cat of categories) {
    curves[cat] = [
      { period: '2020-2030', favorability: 65, category: cat, notes: 'Based on current luck pillar' },
      { period: '2030-2040', favorability: 75, category: cat, notes: 'Improving trend projected' },
      { period: '2040-2050', favorability: 70, category: cat, notes: 'Stable plateau expected' }
    ];
  }

  return curves;
}

/**
 * Generate environmental overlays
 */
export function generateEnvironmentalOverlays(): EnvironmentalOverlay[] {
  const now = new Date();
  const month = now.getMonth();

  const seasonalOverlay: EnvironmentalOverlay = {
    type: 'seasonal',
    name: getSeasonName(month),
    description: `Current season affects elemental balance. ${getSeasonDescription(month)}`,
    recommendations: getSeasonRecommendations(month)
  };

  return [
    seasonalOverlay,
    {
      type: 'feng_shui',
      name: 'Annual Flying Stars',
      description: 'Annual energy distribution affects your environment',
      recommendations: [
        'Enhance the favorable sectors',
        'Avoid or neutralize the unfavorable sectors',
        'Align activities with directional energy'
      ]
    },
    {
      type: 'zodiac',
      name: 'Current Year Energy',
      description: 'The annual zodiac sign influences collective energy',
      recommendations: [
        'Align with the year\'s element',
        'Watch for conflicts with your chart',
        'Use favorable months for major decisions'
      ]
    }
  ];
}

/**
 * Build complete narrative cockpit data
 */
export function buildNarrativeCockpit(codex: KnowledgeCodex): NarrativeCockpitData {
  const storyBeats = generateStoryBeats(codex);
  const emotionalArc = generateEmotionalArc(codex);
  const timingCurves = generateTimingCurves(codex);
  const environmentalOverlays = generateEnvironmentalOverlays();

  // Determine current chapter
  const currentChapter = determineCurrentChapter(storyBeats);

  // Generate narrative summary
  const narrativeSummary = generateNarrativeSummary(codex, storyBeats);

  return {
    storyBeats,
    emotionalArc,
    timingCurves,
    environmentalOverlays,
    currentChapter,
    narrativeSummary
  };
}

/**
 * Render Narrative Cockpit Markdown
 */
export function renderNarrativeCockpitMarkdown(data: NarrativeCockpitData): string {
  const lines: string[] = [];

  lines.push('# 🎛 Narrative Cockpit');
  lines.push('### Your Life as a Story, Seen Through the Cathedral');
  lines.push('');
  lines.push('---');
  lines.push('');

  // Current Chapter
  lines.push('## Current Chapter');
  lines.push(`**${data.currentChapter}**`);
  lines.push('');
  lines.push(data.narrativeSummary);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Story Beats
  lines.push('## Story Beats');
  lines.push('');
  for (const beat of data.storyBeats) {
    const icon = getBeatIcon(beat.type);
    lines.push(`### ${icon} ${beat.title}`);
    lines.push(`*Period: ${beat.period} | Tone: ${beat.emotionalTone} | Significance: ${beat.significance}/10*`);
    lines.push('');
    lines.push(beat.description);
    lines.push('');
  }
  lines.push('---');
  lines.push('');

  // Emotional Arc
  lines.push('## Emotional Arc');
  lines.push('');
  lines.push('| Period | Valence | Intensity | Label |');
  lines.push('|--------|---------|-----------|-------|');
  for (const point of data.emotionalArc) {
    const valenceBar = point.valence > 0 ? '📈' : point.valence < 0 ? '📉' : '➖';
    lines.push(`| ${point.period} | ${valenceBar} ${(point.valence * 100).toFixed(0)}% | ${(point.intensity * 100).toFixed(0)}% | ${point.label} |`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // Timing Curves
  lines.push('## Timing Curves');
  lines.push('');
  for (const [category, points] of Object.entries(data.timingCurves)) {
    lines.push(`### ${category.charAt(0).toUpperCase() + category.slice(1)}`);
    for (const point of points) {
      const bar = '█'.repeat(Math.floor(point.favorability / 10)) + '░'.repeat(10 - Math.floor(point.favorability / 10));
      lines.push(`- ${point.period}: ${bar} ${point.favorability}%`);
    }
    lines.push('');
  }
  lines.push('---');
  lines.push('');

  // Environmental Overlays
  lines.push('## Environmental Overlays');
  lines.push('');
  for (const overlay of data.environmentalOverlays) {
    lines.push(`### ${overlay.name}`);
    lines.push(`*Type: ${overlay.type}*`);
    lines.push('');
    lines.push(overlay.description);
    lines.push('');
    lines.push('**Recommendations:**');
    for (const rec of overlay.recommendations) {
      lines.push(`- ${rec}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Render Narrative Cockpit HTML
 */
export function renderNarrativeCockpitHtml(data: NarrativeCockpitData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Narrative Cockpit</title>
  <style>
    body { font-family: Georgia, serif; background: #1a1a2e; color: #eee; margin: 0; padding: 20px; }
    .cockpit { max-width: 1400px; margin: 0 auto; }
    h1 { text-align: center; color: #c9a227; }
    .dashboard { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .panel { background: #16213e; border-radius: 8px; padding: 20px; }
    .panel h2 { color: #c9a227; margin-top: 0; border-bottom: 1px solid #c9a227; padding-bottom: 10px; }
    .story-beat { background: #0f3460; padding: 15px; border-radius: 8px; margin-bottom: 10px; }
    .beat-header { display: flex; justify-content: space-between; align-items: center; }
    .beat-type { font-size: 12px; padding: 2px 8px; border-radius: 4px; background: #c9a227; color: #1a1a2e; }
    .arc-bar { height: 20px; background: #0f3460; border-radius: 4px; margin: 5px 0; position: relative; }
    .arc-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
    .arc-fill.positive { background: linear-gradient(90deg, #2ecc71, #27ae60); }
    .arc-fill.negative { background: linear-gradient(90deg, #e74c3c, #c0392b); }
    .arc-fill.neutral { background: linear-gradient(90deg, #95a5a6, #7f8c8d); }
    .overlay-card { border-left: 3px solid #c9a227; padding-left: 15px; margin-bottom: 15px; }
    canvas { width: 100%; height: 200px; }
  </style>
</head>
<body>
  <div class="cockpit">
    <h1>🎛 Narrative Cockpit</h1>

    <div class="current-chapter" style="text-align: center; margin: 20px 0;">
      <h2 style="color: #c9a227;">Current Chapter: ${data.currentChapter}</h2>
      <p style="max-width: 600px; margin: 0 auto;">${data.narrativeSummary}</p>
    </div>

    <div class="dashboard">
      <div class="panel">
        <h2>Story Beats</h2>
        ${data.storyBeats.map(beat => `
          <div class="story-beat">
            <div class="beat-header">
              <strong>${getBeatIcon(beat.type)} ${beat.title}</strong>
              <span class="beat-type">${beat.type}</span>
            </div>
            <small>${beat.period} | Tone: ${beat.emotionalTone}</small>
            <p>${beat.description}</p>
          </div>
        `).join('')}
      </div>

      <div class="panel">
        <h2>Emotional Arc</h2>
        ${data.emotionalArc.map(point => `
          <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between;">
              <span>${point.period}</span>
              <span>${point.label}</span>
            </div>
            <div class="arc-bar">
              <div class="arc-fill ${point.valence > 0 ? 'positive' : point.valence < 0 ? 'negative' : 'neutral'}"
                   style="width: ${50 + point.valence * 50}%"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="panel">
        <h2>Environmental Overlays</h2>
        ${data.environmentalOverlays.map(overlay => `
          <div class="overlay-card">
            <h3>${overlay.name}</h3>
            <p>${overlay.description}</p>
            <ul>
              ${overlay.recommendations.map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <div class="panel">
        <h2>Timing Overview</h2>
        <canvas id="timing-chart"></canvas>
        <p style="text-align: center; color: #999; font-size: 12px;">
          Multi-decade favorability projection
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ==================== HELPER FUNCTIONS ====================

function getCategoryPeriodLabel(category: string): string {
  const labels: Record<string, string> = {
    'structure': 'Foundation',
    'useful_god': 'Discovery',
    'combination': 'Integration',
    'clash': 'Conflict',
    'harm': 'Challenge',
    'punishment': 'Trials',
    'seasonal': 'Cycles',
    'hidden_stem': 'Depths',
    'luck_pillar': 'Transitions',
    'shen_sha': 'Influences'
  };
  return labels[category] || 'Journey';
}

function getCategoryEmotionalLabel(valence: number, intensity: number): string {
  if (intensity < 0.3) return 'Quiet';
  if (valence > 0.5) return intensity > 0.7 ? 'Triumphant' : 'Hopeful';
  if (valence < -0.3) return intensity > 0.7 ? 'Turbulent' : 'Challenging';
  return 'Nuanced';
}

function getBeatIcon(type: string): string {
  const icons: Record<string, string> = {
    'origin': '🌅',
    'rising': '📈',
    'crisis': '⚡',
    'climax': '🎭',
    'resolution': '🌈',
    'transformation': '🦋'
  };
  return icons[type] || '•';
}

function getSeasonName(month: number): string {
  if (month >= 2 && month <= 4) return 'Spring (Wood Season)';
  if (month >= 5 && month <= 7) return 'Summer (Fire Season)';
  if (month >= 8 && month <= 10) return 'Autumn (Metal Season)';
  return 'Winter (Water Season)';
}

function getSeasonDescription(month: number): string {
  if (month >= 2 && month <= 4) return 'Wood energy rises. Growth, initiative, and new beginnings are favored.';
  if (month >= 5 && month <= 7) return 'Fire energy peaks. Expression, visibility, and action are amplified.';
  if (month >= 8 && month <= 10) return 'Metal energy sharpens. Precision, completion, and harvest are emphasized.';
  return 'Water energy flows. Reflection, planning, and restoration are supported.';
}

function getSeasonRecommendations(month: number): string[] {
  if (month >= 2 && month <= 4) return ['Start new projects', 'Plant seeds for future growth', 'Be bold with initiatives'];
  if (month >= 5 && month <= 7) return ['Maximize visibility', 'Complete active projects', 'Express yourself fully'];
  if (month >= 8 && month <= 10) return ['Refine and perfect work', 'Harvest results', 'Cut what no longer serves'];
  return ['Reflect and plan', 'Rest and restore', 'Prepare for spring action'];
}

function determineCurrentChapter(beats: StoryBeat[]): string {
  // Simple heuristic - could be enhanced with actual luck pillar timing
  if (beats.length === 0) return 'The Unwritten Path';
  const lastBeat = beats[beats.length - 1];
  return `The ${lastBeat.type.charAt(0).toUpperCase() + lastBeat.type.slice(1)} Phase`;
}

function generateNarrativeSummary(codex: KnowledgeCodex, beats: StoryBeat[]): string {
  const tone = codex.summary.overallTone;
  const count = codex.summary.totalFindings;

  if (tone === 'beneficial') {
    return `Your story unfolds with ${count} chapters of wisdom, many glowing with promise. The Cathedral sees favorable patterns ahead.`;
  }
  if (tone === 'challenging') {
    return `Your story reveals ${count} chapters of wisdom, many calling for attention and growth. Challenge is the forge of character.`;
  }
  return `Your story weaves ${count} chapters of light and shadow. The tapestry is nuanced, inviting careful navigation.`;
}

export {
  generateStoryBeats,
  generateEmotionalArc,
  generateTimingCurves,
  generateEnvironmentalOverlays
};

// ==================== ENHANCED INTERACTIVE HTML ====================

/**
 * Generate full interactive Narrative Cockpit with Chart.js
 * Wire data via window.NARRATIVE_COCKPIT_DATA
 */
export function renderNarrativeCockpitInteractiveHtml(data: NarrativeCockpitData): string {
  const dataJson = JSON.stringify(data);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Narrative Cockpit - Cathedral</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    :root {
      --bg-dark: #1a1a2e;
      --bg-panel: #16213e;
      --bg-card: #0f3460;
      --gold: #c9a227;
      --gold-light: #d4af37;
      --text-primary: #e8e6e3;
      --text-muted: #9e9e9e;
      --positive: #27ae60;
      --negative: #c0392b;
      --mixed: #f39c12;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Georgia', serif;
      background: var(--bg-dark);
      color: var(--text-primary);
      min-height: 100vh;
    }

    header {
      background: linear-gradient(135deg, var(--bg-panel) 0%, var(--bg-dark) 100%);
      padding: 24px 32px;
      border-bottom: 2px solid var(--gold);
      text-align: center;
    }

    header h1 {
      color: var(--gold);
      font-size: 2em;
      font-weight: normal;
      letter-spacing: 2px;
    }

    header .subtitle {
      color: var(--text-muted);
      font-size: 1.1em;
      margin-top: 8px;
    }

    .cockpit-container {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 20px;
      padding: 20px;
      max-width: 1600px;
      margin: 0 auto;
    }

    @media (max-width: 1024px) {
      .cockpit-container { grid-template-columns: 1fr; }
    }

    .panel {
      background: var(--bg-panel);
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }

    .panel h2 {
      color: var(--gold);
      font-size: 1.3em;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(201, 162, 39, 0.3);
    }

    /* Story Beats */
    .beats-list {
      list-style: none;
      max-height: 400px;
      overflow-y: auto;
    }

    .beat-item {
      background: var(--bg-card);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      border-left: 4px solid var(--gold);
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .beat-item:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(201, 162, 39, 0.2);
    }

    .beat-item.positive { border-left-color: var(--positive); }
    .beat-item.negative { border-left-color: var(--negative); }
    .beat-item.mixed { border-left-color: var(--mixed); }

    .beat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .beat-title {
      font-weight: bold;
      color: var(--gold-light);
    }

    .beat-period {
      font-size: 12px;
      color: var(--text-muted);
      background: rgba(255,255,255,0.1);
      padding: 2px 8px;
      border-radius: 4px;
    }

    .beat-description {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.5;
    }

    /* Overlays */
    .overlays-grid {
      display: grid;
      gap: 12px;
    }

    .overlay-card {
      background: var(--bg-card);
      border-radius: 8px;
      padding: 12px 16px;
      border-left: 3px solid var(--gold);
    }

    .overlay-card.seasonal { border-left-color: #27ae60; }
    .overlay-card.feng_shui { border-left-color: #3498db; }
    .overlay-card.zodiac { border-left-color: #9b59b6; }
    .overlay-card.qi_men { border-left-color: #e74c3c; }

    .overlay-name {
      font-weight: bold;
      color: var(--gold-light);
      margin-bottom: 4px;
    }

    .overlay-type {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Charts */
    .chart-container {
      position: relative;
      height: 250px;
      margin-bottom: 20px;
    }

    /* Current Chapter */
    .current-chapter {
      text-align: center;
      padding: 24px;
      background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-panel) 100%);
      border-radius: 12px;
      margin-bottom: 20px;
      border: 1px solid rgba(201, 162, 39, 0.3);
    }

    .current-chapter h3 {
      color: var(--gold);
      font-size: 1.5em;
      margin-bottom: 12px;
    }

    .current-chapter p {
      color: var(--text-muted);
      line-height: 1.6;
      max-width: 600px;
      margin: 0 auto;
    }

    /* Intensity Bar */
    .intensity-bar {
      height: 6px;
      background: rgba(255,255,255,0.1);
      border-radius: 3px;
      margin-top: 8px;
      overflow: hidden;
    }

    .intensity-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.3s;
    }

    .intensity-fill.high { background: var(--gold); }
    .intensity-fill.medium { background: var(--mixed); }
    .intensity-fill.low { background: var(--text-muted); }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg-dark); }
    ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 4px; }
  </style>
</head>
<body>

<header>
  <h1>🎛 Narrative Cockpit</h1>
  <p class="subtitle">Your Life as a Story, Seen Through the Cathedral</p>
</header>

<div class="current-chapter">
  <h3 id="chapter-title">${data.currentChapter}</h3>
  <p id="chapter-summary">${data.narrativeSummary}</p>
</div>

<div class="cockpit-container">
  <!-- Left Panel: Story Beats + Overlays -->
  <div>
    <section class="panel">
      <h2>📖 Story Beats</h2>
      <ul id="story-beats" class="beats-list"></ul>
    </section>

    <section class="panel" style="margin-top: 20px;">
      <h2>🌍 Environmental Overlays</h2>
      <div id="overlays" class="overlays-grid"></div>
    </section>
  </div>

  <!-- Right Panel: Charts -->
  <div>
    <section class="panel">
      <h2>💫 Emotional Arc</h2>
      <div class="chart-container">
        <canvas id="emotional-arc-chart"></canvas>
      </div>
    </section>

    <section class="panel" style="margin-top: 20px;">
      <h2>⏱ Timing Curve</h2>
      <div class="chart-container">
        <canvas id="timing-curve-chart"></canvas>
      </div>
    </section>
  </div>
</div>

<script>
  // Inject data
  window.NARRATIVE_COCKPIT_DATA = ${dataJson};

  const cockpitData = window.NARRATIVE_COCKPIT_DATA;

  // Render Story Beats
  function renderStoryBeats(data) {
    const ul = document.getElementById("story-beats");
    ul.innerHTML = "";

    data.storyBeats.forEach(beat => {
      const li = document.createElement("li");
      li.className = "beat-item " + (beat.emotionalTone || 'mixed');
      li.innerHTML = \`
        <div class="beat-header">
          <span class="beat-title">\${getBeatIcon(beat.type)} \${beat.title}</span>
          <span class="beat-period">\${beat.period}</span>
        </div>
        <div class="beat-description">\${beat.description}</div>
        <div class="intensity-bar">
          <div class="intensity-fill \${getIntensityClass(beat.significance)}"
               style="width: \${beat.significance * 10}%"></div>
        </div>
      \`;
      ul.appendChild(li);
    });
  }

  function getBeatIcon(type) {
    const icons = {
      'origin': '🌅',
      'rising': '📈',
      'crisis': '⚡',
      'climax': '🎭',
      'resolution': '🌈',
      'transformation': '🦋'
    };
    return icons[type] || '•';
  }

  function getIntensityClass(significance) {
    if (significance >= 7) return 'high';
    if (significance >= 4) return 'medium';
    return 'low';
  }

  // Render Overlays
  function renderOverlays(data) {
    const container = document.getElementById("overlays");
    container.innerHTML = "";

    data.environmentalOverlays.forEach(ov => {
      const div = document.createElement("div");
      div.className = "overlay-card " + ov.type;
      div.innerHTML = \`
        <div class="overlay-name">\${ov.name}</div>
        <div class="overlay-type">\${ov.type}</div>
        <p style="font-size: 13px; color: #9e9e9e; margin-top: 8px;">\${ov.description}</p>
      \`;
      container.appendChild(div);
    });
  }

  // Render Emotional Arc Chart
  function renderEmotionalArcChart(data) {
    const ctx = document.getElementById("emotional-arc-chart").getContext("2d");

    const labels = data.emotionalArc.map(p => p.period);
    const values = data.emotionalArc.map(p => p.valence * 100);
    const intensities = data.emotionalArc.map(p => p.intensity * 100);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Emotional Valence',
            data: values,
            borderColor: '#c9a227',
            backgroundColor: 'rgba(201, 162, 39, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointBackgroundColor: values.map(v => v > 0 ? '#27ae60' : v < 0 ? '#c0392b' : '#f39c12')
          },
          {
            label: 'Intensity',
            data: intensities,
            borderColor: '#3498db',
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#e8e6e3' } }
        },
        scales: {
          y: {
            min: -100,
            max: 100,
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#9e9e9e' }
          },
          x: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#9e9e9e' }
          }
        }
      }
    });
  }

  // Render Timing Curve Chart
  function renderTimingCurveChart(data) {
    const ctx = document.getElementById("timing-curve-chart").getContext("2d");

    // Flatten timing curves
    const overallCurve = data.timingCurves.overall || [];
    const labels = overallCurve.map(p => p.period);
    const favorability = overallCurve.map(p => p.favorability);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Luck Level',
          data: favorability,
          backgroundColor: favorability.map(v =>
            v >= 70 ? 'rgba(39, 174, 96, 0.7)' :
            v >= 40 ? 'rgba(241, 196, 15, 0.7)' :
            'rgba(192, 57, 43, 0.7)'
          ),
          borderColor: favorability.map(v =>
            v >= 70 ? '#27ae60' :
            v >= 40 ? '#f1c40f' :
            '#c0392b'
          ),
          borderWidth: 2,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#e8e6e3' } }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#9e9e9e' }
          },
          x: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#9e9e9e' }
          }
        }
      }
    });
  }

  // Initialize
  if (cockpitData) {
    renderStoryBeats(cockpitData);
    renderOverlays(cockpitData);
    renderEmotionalArcChart(cockpitData);
    renderTimingCurveChart(cockpitData);
  }
</script>

</body>
</html>`;
}
