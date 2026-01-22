/**
 * ============================================
 * DEVTOOLS UI TEMPLATES
 * Rule debugger, timing analyzer, story debugger
 * For development and diagnostic purposes
 * ============================================
 */

import { KnowledgeCodex, CodexEntry, PilgrimJourney, JourneyStep } from '../codexTypes';
import { ChartContext, ClassicalEdgeCaseResult } from '../types';

// ==================== TYPES ====================

export interface RuleDebugInfo {
  ruleId: string;
  ruleName: string;
  category: string;
  fired: boolean;
  conditions: RuleCondition[];
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  executionTimeMs: number;
  warnings: string[];
}

export interface RuleCondition {
  name: string;
  expression: string;
  expectedValue: unknown;
  actualValue: unknown;
  passed: boolean;
}

export interface TimingEvent {
  id: string;
  type: 'luck_pillar' | 'annual' | 'monthly' | 'rule_activation' | 'transit';
  label: string;
  startAge: number;
  endAge?: number;
  effect: 'beneficial' | 'challenging' | 'mixed' | 'neutral';
  relatedRules: string[];
  description: string;
}

export interface StoryBeatDebug {
  beatId: string;
  label: string;
  sourceRules: string[];
  personaHooks: string[];
  emotionalTone: string;
  linkedCodexEntries: string[];
}

export interface DevToolsData {
  chartContext: ChartContext;
  edgeCaseResult: ClassicalEdgeCaseResult;
  ruleDebugInfo: RuleDebugInfo[];
  timingEvents: TimingEvent[];
  storyBeats: StoryBeatDebug[];
  performanceMetrics: PerformanceMetrics;
  narrativePayload?: NarrativeDebugPayload;
}

export interface NarrativeDebugPayload {
  codexEntries: CodexEntry[];
  cockpit: {
    storyBeats: Array<{ id: string; label: string; keyRules: string[]; timeRange: { startAge: number; endAge: number }; intensity: number }>;
    emotionalArc: Array<{ age: number; intensity: number; triggers: string[] }>;
    timingCurve: Array<{ age: number; luckLevel: number; volatility: number; keyEvents: string[] }>;
    overlays: Array<{ id: string; label: string; type: string; notes: string }>;
  };
  ruleNarrativeMap: Record<string, {
    ruleId: string;
    ruleName: string;
    totalImpact: number;
    storyBeatCount: number;
    emotionalPointCount: number;
    timingPointCount: number;
    overlayCount: number;
  }>;
  diagnostics: {
    narrativeCoverage: number;
    emotionalBalance: number;
    timingVolatility: number;
    warnings: string[];
  };
}

export interface PerformanceMetrics {
  totalExecutionTimeMs: number;
  engineTimes: Record<string, number>;
  ruleEvaluationCount: number;
  codexGenerationTimeMs: number;
  narrativeGenerationTimeMs: number;
}

// ==================== RULE DEBUGGER ====================

/**
 * Build rule debug information from evaluation results
 */
export function buildRuleDebugInfo(
  ctx: ChartContext,
  result: ClassicalEdgeCaseResult
): RuleDebugInfo[] {
  const debugInfo: RuleDebugInfo[] = [];

  // Structure rules
  for (const rule of result.structures.appliedRules) {
    debugInfo.push({
      ruleId: rule.id,
      ruleName: rule.name || rule.id,
      category: 'structure',
      fired: true,
      conditions: buildConditionsFromRule(rule, ctx),
      inputs: { dayMaster: ctx.dayMaster, elements: ctx.elements },
      outputs: { effect: rule.effect, overrides: rule.overrides },
      executionTimeMs: 0,
      warnings: rule.warnings || []
    });
  }

  // Combination rules
  for (const combo of result.combinations.combinations) {
    debugInfo.push({
      ruleId: combo.combination.type,
      ruleName: `${combo.combination.type} Combination`,
      category: 'combination',
      fired: true,
      conditions: [
        {
          name: 'participants_present',
          expression: `branches.includes(${combo.combination.participants.join(', ')})`,
          expectedValue: combo.combination.participants,
          actualValue: combo.combination.participants,
          passed: true
        },
        {
          name: 'season_support',
          expression: 'season supports transformation',
          expectedValue: true,
          actualValue: combo.seasonSupported,
          passed: combo.seasonSupported
        }
      ],
      inputs: { participants: combo.combination.participants },
      outputs: { finalStatus: combo.finalStatus, transformedElement: combo.transformedElement },
      executionTimeMs: 0,
      warnings: combo.warnings || []
    });
  }

  // Useful God rules
  if (result.usefulGod.appliedExceptions) {
    for (const exception of result.usefulGod.appliedExceptions) {
      debugInfo.push({
        ruleId: exception.id,
        ruleName: exception.name || exception.id,
        category: 'useful_god',
        fired: true,
        conditions: buildConditionsFromRule(exception, ctx),
        inputs: { usefulGod: result.usefulGod.determinedUsefulGod },
        outputs: { effect: exception.effect },
        executionTimeMs: 0,
        warnings: exception.warnings || []
      });
    }
  }

  // Clash/Harm/Punishment rules
  for (const interaction of result.clashHarmPunishment.interactions || []) {
    debugInfo.push({
      ruleId: interaction.type,
      ruleName: `${interaction.type} Detection`,
      category: 'clash_harm_punishment',
      fired: true,
      conditions: [
        {
          name: 'participants_detected',
          expression: `${interaction.type}(${interaction.participants?.join(', ')})`,
          expectedValue: true,
          actualValue: true,
          passed: true
        }
      ],
      inputs: { branches: ctx.branches },
      outputs: { effect: interaction.effect, healthImpact: interaction.healthImpact },
      executionTimeMs: 0,
      warnings: []
    });
  }

  return debugInfo;
}

function buildConditionsFromRule(rule: any, ctx: ChartContext): RuleCondition[] {
  const conditions: RuleCondition[] = [];

  if (rule.conditions) {
    for (const [name, condition] of Object.entries(rule.conditions)) {
      conditions.push({
        name,
        expression: String(condition),
        expectedValue: true,
        actualValue: evaluateCondition(condition, ctx),
        passed: Boolean(evaluateCondition(condition, ctx))
      });
    }
  }

  return conditions;
}

function evaluateCondition(condition: any, ctx: ChartContext): unknown {
  // Simplified condition evaluation
  return true;
}

/**
 * Render Rule Debugger HTML
 */
export function renderRuleDebuggerHtml(debugInfo: RuleDebugInfo[]): string {
  const categorizedRules = groupBy(debugInfo, r => r.category);

  return `
<div class="rule-debugger">
  <h2>Rule Debugger</h2>

  <div class="debugger-controls">
    <label>Filter by Category:</label>
    <select id="category-filter">
      <option value="all">All Categories</option>
      <option value="structure">Structure</option>
      <option value="combination">Combination</option>
      <option value="useful_god">Useful God</option>
      <option value="clash_harm_punishment">Clash/Harm/Punishment</option>
      <option value="seasonal">Seasonal</option>
      <option value="hidden_stem">Hidden Stem</option>
      <option value="luck_pillar">Luck Pillar</option>
    </select>

    <label>Show:</label>
    <select id="fired-filter">
      <option value="all">All Rules</option>
      <option value="fired">Fired Only</option>
      <option value="not-fired">Not Fired Only</option>
    </select>
  </div>

  <div class="rules-list">
    ${Object.entries(categorizedRules).map(([category, rules]) => `
      <div class="category-section" data-category="${category}">
        <h3>${formatCategory(category)} (${rules.length} rules)</h3>
        ${rules.map(rule => renderRuleCard(rule)).join('')}
      </div>
    `).join('')}
  </div>
</div>

<style>
  .rule-debugger {
    font-family: 'Consolas', 'Monaco', monospace;
    padding: 1rem;
  }

  .debugger-controls {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
    padding: 0.5rem;
    background: #f5f5f5;
    border-radius: 4px;
  }

  .debugger-controls select {
    padding: 0.25rem 0.5rem;
  }

  .category-section {
    margin-bottom: 1.5rem;
  }

  .category-section h3 {
    border-bottom: 2px solid #4a4a6a;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
  }

  .rule-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 0.75rem;
    overflow: hidden;
  }

  .rule-card.fired {
    border-left: 4px solid #4caf50;
  }

  .rule-card.not-fired {
    border-left: 4px solid #9e9e9e;
    opacity: 0.7;
  }

  .rule-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: #f9f9f9;
    cursor: pointer;
  }

  .rule-header:hover {
    background: #f0f0f0;
  }

  .rule-id {
    font-weight: bold;
    font-family: monospace;
  }

  .rule-status {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8em;
  }

  .rule-status.fired {
    background: #e8f5e9;
    color: #2e7d32;
  }

  .rule-status.not-fired {
    background: #eeeeee;
    color: #616161;
  }

  .rule-details {
    padding: 0.75rem;
    display: none;
  }

  .rule-card.expanded .rule-details {
    display: block;
  }

  .conditions-list {
    margin: 0.5rem 0;
  }

  .condition {
    display: flex;
    gap: 0.5rem;
    padding: 0.25rem 0;
    font-size: 0.9em;
  }

  .condition.passed {
    color: #2e7d32;
  }

  .condition.failed {
    color: #c62828;
  }

  .condition-icon {
    font-weight: bold;
  }

  .inputs-outputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 0.5rem;
  }

  .io-section h4 {
    font-size: 0.9em;
    margin-bottom: 0.25rem;
    color: #666;
  }

  .io-section pre {
    background: #f5f5f5;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.85em;
    overflow-x: auto;
  }

  .warnings {
    margin-top: 0.5rem;
    padding: 0.5rem;
    background: #fff3e0;
    border-radius: 4px;
  }

  .warnings li {
    color: #e65100;
    font-size: 0.9em;
  }
</style>

<script>
  document.querySelectorAll('.rule-header').forEach(header => {
    header.addEventListener('click', () => {
      header.parentElement.classList.toggle('expanded');
    });
  });

  document.getElementById('category-filter').addEventListener('change', (e) => {
    const value = e.target.value;
    document.querySelectorAll('.category-section').forEach(section => {
      section.style.display = (value === 'all' || section.dataset.category === value) ? 'block' : 'none';
    });
  });

  document.getElementById('fired-filter').addEventListener('change', (e) => {
    const value = e.target.value;
    document.querySelectorAll('.rule-card').forEach(card => {
      const isFired = card.classList.contains('fired');
      if (value === 'all') card.style.display = 'block';
      else if (value === 'fired') card.style.display = isFired ? 'block' : 'none';
      else card.style.display = isFired ? 'none' : 'block';
    });
  });
</script>
`;
}

function renderRuleCard(rule: RuleDebugInfo): string {
  return `
    <div class="rule-card ${rule.fired ? 'fired' : 'not-fired'}">
      <div class="rule-header">
        <span class="rule-id">${rule.ruleId}</span>
        <span class="rule-status ${rule.fired ? 'fired' : 'not-fired'}">
          ${rule.fired ? '✓ Fired' : '○ Not Fired'}
        </span>
      </div>
      <div class="rule-details">
        <p><strong>${rule.ruleName}</strong></p>

        ${rule.conditions.length > 0 ? `
          <div class="conditions-list">
            <strong>Conditions:</strong>
            ${rule.conditions.map(c => `
              <div class="condition ${c.passed ? 'passed' : 'failed'}">
                <span class="condition-icon">${c.passed ? '✓' : '✗'}</span>
                <span>${c.name}: ${c.expression}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="inputs-outputs">
          <div class="io-section">
            <h4>Inputs</h4>
            <pre>${JSON.stringify(rule.inputs, null, 2)}</pre>
          </div>
          <div class="io-section">
            <h4>Outputs</h4>
            <pre>${JSON.stringify(rule.outputs, null, 2)}</pre>
          </div>
        </div>

        ${rule.warnings.length > 0 ? `
          <div class="warnings">
            <strong>Warnings:</strong>
            <ul>
              ${rule.warnings.map(w => `<li>${w}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <p style="font-size: 0.8em; color: #999; margin-top: 0.5rem;">
          Execution time: ${rule.executionTimeMs}ms
        </p>
      </div>
    </div>
  `;
}

// ==================== TIMING ANALYZER ====================

/**
 * Build timing events from luck pillar analysis
 */
export function buildTimingEvents(
  ctx: ChartContext,
  result: ClassicalEdgeCaseResult
): TimingEvent[] {
  const events: TimingEvent[] = [];

  // Add luck pillar events if available
  if (result.luckPillar?.pillarEffects) {
    for (const effect of result.luckPillar.pillarEffects) {
      events.push({
        id: `lp_${effect.pillarIndex}`,
        type: 'luck_pillar',
        label: effect.pillarLabel || `Luck Pillar ${effect.pillarIndex}`,
        startAge: effect.startAge,
        endAge: effect.endAge,
        effect: effect.overallEffect as any || 'mixed',
        relatedRules: effect.triggeredRules || [],
        description: effect.description || ''
      });
    }
  }

  // Add annual events if current year analysis available
  if (ctx.currentYear) {
    events.push({
      id: `annual_${ctx.currentYear}`,
      type: 'annual',
      label: `Year ${ctx.currentYear}`,
      startAge: calculateAge(ctx.birthYear, ctx.currentYear),
      effect: 'neutral',
      relatedRules: [],
      description: 'Current annual luck'
    });
  }

  return events;
}

function calculateAge(birthYear: number | undefined, currentYear: number): number {
  return birthYear ? currentYear - birthYear : 0;
}

/**
 * Render Timing Analyzer HTML
 */
export function renderTimingAnalyzerHtml(events: TimingEvent[]): string {
  const sortedEvents = [...events].sort((a, b) => a.startAge - b.startAge);

  return `
<div class="timing-analyzer">
  <h2>Timing Analyzer</h2>

  <div class="timing-chart-container">
    <canvas id="timing-chart" width="800" height="300"></canvas>
  </div>

  <div class="timing-legend">
    <span class="legend-item beneficial">● Beneficial</span>
    <span class="legend-item challenging">● Challenging</span>
    <span class="legend-item mixed">● Mixed</span>
    <span class="legend-item neutral">● Neutral</span>
  </div>

  <div class="timing-events">
    <h3>Timeline Events</h3>
    ${sortedEvents.map(event => `
      <div class="timing-event ${event.effect}">
        <div class="event-header">
          <span class="event-type">${formatEventType(event.type)}</span>
          <span class="event-age">Age ${event.startAge}${event.endAge ? `-${event.endAge}` : ''}</span>
        </div>
        <div class="event-label">${event.label}</div>
        <div class="event-description">${event.description}</div>
        ${event.relatedRules.length > 0 ? `
          <div class="event-rules">
            <strong>Triggered Rules:</strong>
            ${event.relatedRules.map(r => `<code>${r}</code>`).join(', ')}
          </div>
        ` : ''}
      </div>
    `).join('')}
  </div>
</div>

<style>
  .timing-analyzer {
    padding: 1rem;
  }

  .timing-chart-container {
    background: #fafafa;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .timing-legend {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .legend-item {
    font-size: 0.9em;
  }

  .legend-item.beneficial { color: #4caf50; }
  .legend-item.challenging { color: #f44336; }
  .legend-item.mixed { color: #ff9800; }
  .legend-item.neutral { color: #9e9e9e; }

  .timing-events {
    max-height: 400px;
    overflow-y: auto;
  }

  .timing-event {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    border-left: 4px solid;
  }

  .timing-event.beneficial { border-left-color: #4caf50; }
  .timing-event.challenging { border-left-color: #f44336; }
  .timing-event.mixed { border-left-color: #ff9800; }
  .timing-event.neutral { border-left-color: #9e9e9e; }

  .event-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.25rem;
  }

  .event-type {
    font-size: 0.8em;
    color: #666;
    text-transform: uppercase;
  }

  .event-age {
    font-weight: bold;
  }

  .event-label {
    font-size: 1.1em;
    margin-bottom: 0.25rem;
  }

  .event-description {
    font-size: 0.9em;
    color: #555;
  }

  .event-rules {
    margin-top: 0.5rem;
    font-size: 0.85em;
  }

  .event-rules code {
    background: #f0f0f0;
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
    margin-right: 0.25rem;
  }
</style>

<script>
  // Draw timing chart
  const canvas = document.getElementById('timing-chart');
  const ctx = canvas.getContext('2d');
  const events = ${JSON.stringify(sortedEvents)};

  // Simple timeline visualization
  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;

  // Clear
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);

  // Draw axis
  ctx.strokeStyle = '#333';
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  // Age markers
  const maxAge = Math.max(...events.map(e => e.endAge || e.startAge), 80);
  const ageStep = 10;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#333';
  ctx.font = '12px sans-serif';

  for (let age = 0; age <= maxAge; age += ageStep) {
    const x = padding + (age / maxAge) * (width - 2 * padding);
    ctx.fillText(age.toString(), x, height - padding + 20);

    ctx.strokeStyle = '#eee';
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, height - padding);
    ctx.stroke();
  }

  // Draw events
  const effectColors = {
    beneficial: '#4caf50',
    challenging: '#f44336',
    mixed: '#ff9800',
    neutral: '#9e9e9e'
  };

  let y = padding + 30;
  const rowHeight = 25;

  events.forEach((event, i) => {
    const x1 = padding + (event.startAge / maxAge) * (width - 2 * padding);
    const x2 = event.endAge
      ? padding + (event.endAge / maxAge) * (width - 2 * padding)
      : x1 + 10;

    ctx.fillStyle = effectColors[event.effect] || effectColors.neutral;
    ctx.fillRect(x1, y, x2 - x1, 15);

    ctx.fillStyle = '#333';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(event.label.substring(0, 20), x2 + 5, y + 12);

    y += rowHeight;
    if (y > height - padding - 30) {
      y = padding + 30;
    }
  });
</script>
`;
}

function formatEventType(type: string): string {
  const labels: Record<string, string> = {
    luck_pillar: 'Luck Pillar',
    annual: 'Annual',
    monthly: 'Monthly',
    rule_activation: 'Rule',
    transit: 'Transit'
  };
  return labels[type] || type;
}

// ==================== STORY DEBUGGER ====================

/**
 * Build story beat debug info from codex and journey
 */
export function buildStoryBeatDebug(
  codex: KnowledgeCodex,
  journey: PilgrimJourney
): StoryBeatDebug[] {
  const beats: StoryBeatDebug[] = [];

  // Group codex entries by theme/chamber
  const themes = groupBy(codex.entries, e => e.rule.category);

  for (const [theme, entries] of Object.entries(themes)) {
    const relatedJourneySteps = journey.steps.filter(
      s => entries.some(e => e.rule.id === s.entry?.rule?.id)
    );

    beats.push({
      beatId: `beat_${theme}`,
      label: formatCategory(theme),
      sourceRules: entries.map(e => e.rule.id),
      personaHooks: entries.map(e => e.personaHook),
      emotionalTone: determineEmotionalTone(entries),
      linkedCodexEntries: entries.map(e => e.rule.id)
    });
  }

  return beats;
}

function determineEmotionalTone(entries: CodexEntry[]): string {
  const effects = entries.map(e => e.effect);
  const beneficial = effects.filter(e => e === 'beneficial').length;
  const challenging = effects.filter(e => e === 'challenging').length;

  if (beneficial > challenging * 2) return 'uplifting';
  if (challenging > beneficial * 2) return 'sobering';
  if (beneficial > challenging) return 'hopeful';
  if (challenging > beneficial) return 'cautionary';
  return 'balanced';
}

/**
 * Render Story Debugger HTML
 */
export function renderStoryDebuggerHtml(
  beats: StoryBeatDebug[],
  codex: KnowledgeCodex
): string {
  return `
<div class="story-debugger">
  <h2>Story Debugger</h2>

  <div class="story-flow">
    <h3>Narrative Flow</h3>
    <div class="beats-timeline">
      ${beats.map((beat, i) => `
        <div class="beat-node" data-beat="${beat.beatId}">
          <div class="beat-number">${i + 1}</div>
          <div class="beat-label">${beat.label}</div>
          <div class="beat-tone tone-${beat.emotionalTone}">${beat.emotionalTone}</div>
        </div>
        ${i < beats.length - 1 ? '<div class="beat-connector">→</div>' : ''}
      `).join('')}
    </div>
  </div>

  <div class="debug-panels">
    <div class="panel rules-panel">
      <h3>Rule → Story Beat Mapping</h3>
      <table>
        <thead>
          <tr>
            <th>Rule ID</th>
            <th>Story Beat</th>
            <th>Emotional Tone</th>
          </tr>
        </thead>
        <tbody>
          ${beats.flatMap(beat =>
            beat.sourceRules.map(rule => `
              <tr>
                <td><code>${rule}</code></td>
                <td>${beat.label}</td>
                <td class="tone-${beat.emotionalTone}">${beat.emotionalTone}</td>
              </tr>
            `)
          ).join('')}
        </tbody>
      </table>
    </div>

    <div class="panel persona-panel">
      <h3>Codex Entry → Persona Hook</h3>
      ${codex.entries.slice(0, 10).map(entry => `
        <div class="persona-mapping">
          <div class="entry-title">${entry.explanation.title}</div>
          <div class="entry-arrow">↓</div>
          <div class="persona-hook">"${entry.personaHook.substring(0, 100)}..."</div>
        </div>
      `).join('')}
      ${codex.entries.length > 10 ? `<p style="color: #999;">+ ${codex.entries.length - 10} more entries</p>` : ''}
    </div>
  </div>
</div>

<style>
  .story-debugger {
    padding: 1rem;
  }

  .story-flow {
    margin-bottom: 2rem;
  }

  .beats-timeline {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    overflow-x: auto;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 8px;
  }

  .beat-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem;
    background: white;
    border: 2px solid #ddd;
    border-radius: 8px;
    min-width: 100px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .beat-node:hover {
    border-color: #4a4a6a;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .beat-number {
    width: 24px;
    height: 24px;
    background: #4a4a6a;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8em;
    margin-bottom: 0.5rem;
  }

  .beat-label {
    font-weight: bold;
    text-align: center;
    font-size: 0.9em;
  }

  .beat-tone {
    font-size: 0.75em;
    padding: 0.2rem 0.5rem;
    border-radius: 10px;
    margin-top: 0.25rem;
  }

  .tone-uplifting { background: #e8f5e9; color: #2e7d32; }
  .tone-hopeful { background: #e3f2fd; color: #1565c0; }
  .tone-balanced { background: #f5f5f5; color: #616161; }
  .tone-cautionary { background: #fff3e0; color: #e65100; }
  .tone-sobering { background: #ffebee; color: #c62828; }

  .beat-connector {
    color: #999;
    font-size: 1.5em;
  }

  .debug-panels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .panel {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    max-height: 400px;
    overflow-y: auto;
  }

  .panel h3 {
    margin-top: 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #eee;
  }

  .panel table {
    width: 100%;
    border-collapse: collapse;
  }

  .panel th, .panel td {
    padding: 0.5rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  .panel th {
    background: #f9f9f9;
  }

  .panel code {
    background: #f0f0f0;
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
    font-size: 0.85em;
  }

  .persona-mapping {
    padding: 0.75rem;
    border: 1px solid #eee;
    border-radius: 8px;
    margin-bottom: 0.5rem;
  }

  .entry-title {
    font-weight: bold;
    font-size: 0.9em;
  }

  .entry-arrow {
    text-align: center;
    color: #999;
    font-size: 1.2em;
  }

  .persona-hook {
    font-style: italic;
    color: #666;
    font-size: 0.85em;
  }
</style>
`;
}

// ==================== NARRATIVE DEBUGGER ====================

/**
 * Render Narrative Debugger HTML - Rule → Narrative impact inspector
 */
export function renderNarrativeDebuggerHtml(payload: NarrativeDebugPayload): string {
  const { codexEntries, cockpit, ruleNarrativeMap, diagnostics } = payload;

  const ruleOptions = Object.entries(ruleNarrativeMap)
    .sort((a, b) => b[1].totalImpact - a[1].totalImpact)
    .map(([id, r]) => `<option value="${id}">${id} — ${r.ruleName} (Impact: ${r.totalImpact})</option>`)
    .join('');

  return `
<div class="narrative-debugger">
  <h2>Narrative Debugger</h2>

  <!-- Diagnostics Summary -->
  <div class="diagnostics-summary">
    <div class="diagnostic-card">
      <span class="diagnostic-label">Coverage</span>
      <span class="diagnostic-value ${diagnostics.narrativeCoverage >= 70 ? 'good' : diagnostics.narrativeCoverage >= 40 ? 'warning' : 'bad'}">
        ${diagnostics.narrativeCoverage}%
      </span>
    </div>
    <div class="diagnostic-card">
      <span class="diagnostic-label">Emotional Balance</span>
      <span class="diagnostic-value ${Math.abs(diagnostics.emotionalBalance) <= 30 ? 'good' : 'warning'}">
        ${diagnostics.emotionalBalance > 0 ? '+' : ''}${diagnostics.emotionalBalance}
      </span>
    </div>
    <div class="diagnostic-card">
      <span class="diagnostic-label">Volatility</span>
      <span class="diagnostic-value ${diagnostics.timingVolatility <= 50 ? 'good' : 'warning'}">
        ${diagnostics.timingVolatility}
      </span>
    </div>
  </div>

  ${diagnostics.warnings.length > 0 ? `
    <div class="warnings-box">
      <strong>⚠️ Warnings:</strong>
      <ul>
        ${diagnostics.warnings.map(w => `<li>${w}</li>`).join('')}
      </ul>
    </div>
  ` : ''}

  <!-- Rule Selector -->
  <div class="rule-selector">
    <label for="narrative-rule-select">Select Rule to Inspect:</label>
    <select id="narrative-rule-select">
      <option value="">-- Select a rule --</option>
      ${ruleOptions}
    </select>
  </div>

  <!-- Rule Impact Display -->
  <div id="rule-narrative-impact" class="impact-display">
    <p class="hint">Select a rule above to see its narrative impact</p>
  </div>

  <!-- Summary Tables -->
  <div class="summary-tables">
    <div class="summary-table">
      <h3>📖 Story Beats (${cockpit.storyBeats.length})</h3>
      <table>
        <thead>
          <tr><th>Beat</th><th>Age Range</th><th>Intensity</th><th>Rules</th></tr>
        </thead>
        <tbody>
          ${cockpit.storyBeats.map(b => `
            <tr>
              <td>${b.label}</td>
              <td>${b.timeRange.startAge}-${b.timeRange.endAge}</td>
              <td><div class="intensity-bar-mini" style="width: ${b.intensity}%"></div></td>
              <td>${b.keyRules.length}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="summary-table">
      <h3>💫 Emotional Arc (${cockpit.emotionalArc.length} points)</h3>
      <table>
        <thead>
          <tr><th>Age</th><th>Intensity</th><th>Drivers</th></tr>
        </thead>
        <tbody>
          ${cockpit.emotionalArc.slice(0, 10).map(p => `
            <tr>
              <td>${p.age}</td>
              <td class="${p.intensity > 0 ? 'positive' : p.intensity < 0 ? 'negative' : ''}">${p.intensity > 0 ? '+' : ''}${p.intensity}</td>
              <td>${p.triggers.length}</td>
            </tr>
          `).join('')}
          ${cockpit.emotionalArc.length > 10 ? `<tr><td colspan="3" style="color: #999;">+ ${cockpit.emotionalArc.length - 10} more...</td></tr>` : ''}
        </tbody>
      </table>
    </div>
  </div>
</div>

<style>
  .narrative-debugger {
    padding: 1rem;
  }

  .diagnostics-summary {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .diagnostic-card {
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
    min-width: 120px;
  }

  .diagnostic-label {
    display: block;
    font-size: 0.8em;
    color: #666;
    margin-bottom: 0.5rem;
  }

  .diagnostic-value {
    font-size: 1.5em;
    font-weight: bold;
  }

  .diagnostic-value.good { color: #27ae60; }
  .diagnostic-value.warning { color: #f39c12; }
  .diagnostic-value.bad { color: #c0392b; }

  .warnings-box {
    background: #fff3e0;
    border: 1px solid #f39c12;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .warnings-box ul {
    margin: 0.5rem 0 0 1.5rem;
    padding: 0;
  }

  .rule-selector {
    margin-bottom: 1rem;
  }

  .rule-selector label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  .rule-selector select {
    width: 100%;
    padding: 0.5rem;
    font-size: 1em;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .impact-display {
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    min-height: 200px;
  }

  .impact-display .hint {
    color: #999;
    text-align: center;
    padding: 2rem;
  }

  .summary-tables {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .summary-table {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    max-height: 300px;
    overflow-y: auto;
  }

  .summary-table h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1em;
  }

  .summary-table table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85em;
  }

  .summary-table th, .summary-table td {
    padding: 0.4rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  .summary-table th {
    background: #f5f5f5;
  }

  .intensity-bar-mini {
    height: 8px;
    background: linear-gradient(90deg, #c9a227, #d4af37);
    border-radius: 4px;
  }

  .positive { color: #27ae60; }
  .negative { color: #c0392b; }
</style>

<script>
  (function() {
    const ruleMap = ${JSON.stringify(ruleNarrativeMap)};
    const cockpit = ${JSON.stringify(cockpit)};

    const select = document.getElementById('narrative-rule-select');
    const container = document.getElementById('rule-narrative-impact');

    if (select) {
      select.addEventListener('change', function() {
        const ruleId = this.value;
        if (!ruleId) {
          container.innerHTML = '<p class="hint">Select a rule above to see its narrative impact</p>';
          return;
        }

        const rule = ruleMap[ruleId];
        if (!rule) {
          container.innerHTML = '<p>Rule not found</p>';
          return;
        }

        const beats = cockpit.storyBeats.filter(b => b.keyRules && b.keyRules.includes(ruleId));
        const emo = cockpit.emotionalArc.filter(p => p.triggers && p.triggers.includes(ruleId));
        const timing = cockpit.timingCurve.filter(p => p.keyEvents && p.keyEvents.includes(ruleId));
        const overlays = cockpit.overlays.filter(o => o.id && o.id.includes(ruleId));

        let html = '<div class="rule-impact-detail">';
        html += '<h3>' + rule.ruleName + '</h3>';
        html += '<p><strong>Total Impact Score:</strong> ' + rule.totalImpact + '/100</p>';

        html += '<h4>📖 Story Beats (' + beats.length + ')</h4>';
        if (beats.length === 0) {
          html += '<p style="color: #999;">None</p>';
        } else {
          html += '<ul>';
          beats.forEach(b => {
            html += '<li>[' + b.timeRange.startAge + '–' + b.timeRange.endAge + '] ' + b.label + ' (intensity: ' + b.intensity + ')</li>';
          });
          html += '</ul>';
        }

        html += '<h4>💫 Emotional Arc Points (' + emo.length + ')</h4>';
        if (emo.length === 0) {
          html += '<p style="color: #999;">None</p>';
        } else {
          html += '<ul>';
          emo.forEach(p => {
            html += '<li>Age ' + p.age + ': intensity ' + (p.intensity > 0 ? '+' : '') + p.intensity + '</li>';
          });
          html += '</ul>';
        }

        html += '<h4>⏱ Timing Curve Points (' + timing.length + ')</h4>';
        if (timing.length === 0) {
          html += '<p style="color: #999;">None</p>';
        } else {
          html += '<ul>';
          timing.forEach(p => {
            html += '<li>Age ' + p.age + ': luck ' + p.luckLevel + ', volatility ' + p.volatility + '</li>';
          });
          html += '</ul>';
        }

        html += '<h4>🌍 Environmental Overlays (' + overlays.length + ')</h4>';
        if (overlays.length === 0) {
          html += '<p style="color: #999;">None</p>';
        } else {
          html += '<ul>';
          overlays.forEach(o => {
            html += '<li>' + o.label + ' — ' + o.notes + '</li>';
          });
          html += '</ul>';
        }

        html += '</div>';
        container.innerHTML = html;
      });
    }
  })();
</script>
`;
}

// ==================== COMPLETE DEVTOOLS ====================

/**
 * Generate complete DevTools HTML
 */
export function generateDevToolsHtml(data: DevToolsData): string {
  const ruleDebugInfo = buildRuleDebugInfo(data.chartContext, data.edgeCaseResult);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cathedral DevTools</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
    }

    .devtools-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .devtools-header {
      background: #2d2d2d;
      color: white;
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .devtools-title {
      font-size: 1.1em;
      font-weight: bold;
    }

    .devtools-tabs {
      display: flex;
      gap: 0.5rem;
    }

    .devtools-tab {
      padding: 0.5rem 1rem;
      background: #3d3d3d;
      border: none;
      color: #ccc;
      cursor: pointer;
      border-radius: 4px 4px 0 0;
    }

    .devtools-tab.active {
      background: #f5f5f5;
      color: #333;
    }

    .devtools-content {
      flex: 1;
      overflow: auto;
    }

    .tab-panel {
      display: none;
      height: 100%;
    }

    .tab-panel.active {
      display: block;
    }

    .performance-bar {
      background: #1a1a1a;
      color: #0f0;
      padding: 0.5rem 1rem;
      font-family: monospace;
      font-size: 0.85em;
    }
  </style>
</head>
<body>
  <div class="devtools-container">
    <header class="devtools-header">
      <span class="devtools-title">🔧 Cathedral DevTools</span>
      <div class="devtools-tabs">
        <button class="devtools-tab active" data-tab="rules">Rule Debugger</button>
        <button class="devtools-tab" data-tab="timing">Timing Analyzer</button>
        <button class="devtools-tab" data-tab="story">Story Debugger</button>
        <button class="devtools-tab" data-tab="narrative">Narrative Debugger</button>
        <button class="devtools-tab" data-tab="data">Data Inspector</button>
      </div>
    </header>

    <div class="performance-bar">
      Total: ${data.performanceMetrics.totalExecutionTimeMs}ms |
      Rules evaluated: ${data.performanceMetrics.ruleEvaluationCount} |
      Codex: ${data.performanceMetrics.codexGenerationTimeMs}ms |
      Narrative: ${data.performanceMetrics.narrativeGenerationTimeMs}ms
    </div>

    <div class="devtools-content">
      <div class="tab-panel active" id="rules-panel">
        ${renderRuleDebuggerHtml(ruleDebugInfo)}
      </div>

      <div class="tab-panel" id="timing-panel">
        ${renderTimingAnalyzerHtml(data.timingEvents)}
      </div>

      <div class="tab-panel" id="story-panel">
        ${renderStoryDebuggerHtml(data.storyBeats, { entries: [], chartId: '' })}
      </div>

      <div class="tab-panel" id="narrative-panel">
        ${data.narrativePayload ? renderNarrativeDebuggerHtml(data.narrativePayload) : '<div style="padding: 1rem;"><p>No narrative data available. Provide narrativePayload in DevToolsData.</p></div>'}
      </div>

      <div class="tab-panel" id="data-panel">
        <div style="padding: 1rem;">
          <h2>Data Inspector</h2>
          <h3>Chart Context</h3>
          <pre style="background: #f0f0f0; padding: 1rem; overflow: auto; max-height: 300px;">
${JSON.stringify(data.chartContext, null, 2)}
          </pre>
          <h3>Edge Case Result</h3>
          <pre style="background: #f0f0f0; padding: 1rem; overflow: auto; max-height: 300px;">
${JSON.stringify(data.edgeCaseResult, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  </div>

  <script>
    document.querySelectorAll('.devtools-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.devtools-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(tab.dataset.tab + '-panel').classList.add('active');
      });
    });
  </script>
</body>
</html>
`;
}

// ==================== UTILITIES ====================

function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce((result, item) => {
    const key = keyFn(item);
    (result[key] = result[key] || []).push(item);
    return result;
  }, {} as Record<string, T[]>);
}

function formatCategory(category: string): string {
  const labels: Record<string, string> = {
    structure: 'Structure',
    combination: 'Combination',
    useful_god: 'Useful God',
    clash_harm_punishment: 'Clash/Harm/Punishment',
    seasonal: 'Seasonal',
    hidden_stem: 'Hidden Stem',
    luck_pillar: 'Luck Pillar',
    shen_sha: 'Shen Sha'
  };
  return labels[category] || category;
}
