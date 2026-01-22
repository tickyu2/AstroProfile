/**
 * ============================================
 * ANCESTRAL JOURNEY UI TEMPLATE
 * The Pilgrim's Position in the Lineage
 *
 * Visualizes:
 * - Where the pilgrim stands in ancestral time
 * - Inherited themes from ancestors
 * - Broken patterns (cycles that end)
 * - New patterns (destinies that begin)
 * - Journey steps with ancestral resonance
 * ============================================
 */

import {
  JourneyWithGenerations,
  PilgrimPosition,
  AncestralNarrative,
  EnrichedJourneyStep,
  AncestralContext
} from '../journeyWithGenerations';
import { GenerationalLadder, GenerationalThread } from '../generationalLadder';

// ==================== MAIN RENDER FUNCTIONS ====================

/**
 * Render full ancestral journey page
 */
export function renderAncestralJourneyHtml(journey: JourneyWithGenerations): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ancestral Journey - Cathedral</title>
  <style>
    ${getAncestralJourneyStyles()}
  </style>
</head>
<body>
  <div class="ancestral-container">
    <header class="ancestral-header">
      <h1>🕯️ Ancestral Journey</h1>
      <p class="subtitle">Your Place in the Living Lineage</p>
    </header>

    ${renderPilgrimPositionSection(journey.pilgrimPosition)}
    ${renderAncestralNarrativeSection(journey.ancestralNarrative)}
    ${renderAncestralThreadsSection(journey.ancestralThreads, journey.pilgrimPosition)}
    ${renderEnrichedJourneySection(journey.steps)}
    ${renderAncestralBlessingSection(journey.ancestralNarrative)}
  </div>

  <script>
    window.ANCESTRAL_JOURNEY = ${JSON.stringify(journey)};
    ${getAncestralJourneyScript()}
  </script>
</body>
</html>
  `.trim();
}

/**
 * Render embeddable pilgrim position component
 */
export function renderPilgrimPositionComponent(position: PilgrimPosition): string {
  return `
<div class="pilgrim-position-component">
  ${renderPilgrimPositionSection(position)}
</div>
  `.trim();
}

/**
 * Render embeddable ancestral narrative component
 */
export function renderAncestralNarrativeComponent(narrative: AncestralNarrative): string {
  return `
<div class="ancestral-narrative-component">
  ${renderAncestralNarrativeSection(narrative)}
</div>
  `.trim();
}

// ==================== SECTION RENDERERS ====================

function renderPilgrimPositionSection(position: PilgrimPosition): string {
  const ancestorDots = Array(position.ancestorCount).fill('●').join(' ');
  const descendantDots = Array(position.descendantCount).fill('●').join(' ');

  return `
<section class="pilgrim-position-section">
  <h2>🧭 Your Place in the Lineage</h2>

  <div class="position-visual">
    <div class="lineage-bar">
      <div class="ancestors">
        ${position.ancestorCount > 0 ? `
          <span class="dots">${ancestorDots}</span>
          <span class="label">${position.ancestorCount} ancestor${position.ancestorCount > 1 ? 's' : ''}</span>
        ` : '<span class="empty">No ancestors in record</span>'}
      </div>

      <div class="self-marker">
        <div class="marker-glow"></div>
        <span class="marker-icon">✦</span>
        <span class="marker-label">${position.generationLabel}</span>
        ${position.generationLabelZh ? `<span class="marker-label-zh">${position.generationLabelZh}</span>` : ''}
        <span class="gen-index">Gen ${position.generationIndex >= 0 ? '+' : ''}${position.generationIndex}</span>
      </div>

      <div class="descendants">
        ${position.descendantCount > 0 ? `
          <span class="dots">${descendantDots}</span>
          <span class="label">${position.descendantCount} descendant${position.descendantCount > 1 ? 's' : ''}</span>
        ` : '<span class="empty">No descendants in record</span>'}
      </div>
    </div>
  </div>

  <div class="theme-columns">
    <div class="theme-column inherited">
      <h3>🌿 Inherited Themes</h3>
      <p class="column-desc">What you carry from ancestors</p>
      ${position.inheritedThemes.length > 0 ? `
        <ul class="theme-list">
          ${position.inheritedThemes.map(t => `<li class="theme-item inherited">${t}</li>`).join('')}
        </ul>
      ` : '<p class="empty-note">Walking a path unbound by ancestral patterns</p>'}
    </div>

    <div class="theme-column broken">
      <h3>🔓 Broken Patterns</h3>
      <p class="column-desc">Cycles that end with you</p>
      ${position.brokenPatterns.length > 0 ? `
        <ul class="theme-list">
          ${position.brokenPatterns.map(t => `<li class="theme-item broken">${t}</li>`).join('')}
        </ul>
      ` : '<p class="empty-note">No ancestral cycles await liberation</p>'}
    </div>

    <div class="theme-column new">
      <h3>🌱 New Patterns</h3>
      <p class="column-desc">Destinies that begin with you</p>
      ${position.newPatterns.length > 0 ? `
        <ul class="theme-list">
          ${position.newPatterns.map(t => `<li class="theme-item new">${t}</li>`).join('')}
        </ul>
      ` : '<p class="empty-note">Deepening existing streams</p>'}
    </div>
  </div>
</section>
  `;
}

function renderAncestralNarrativeSection(narrative: AncestralNarrative): string {
  return `
<section class="ancestral-narrative-section">
  <h2>📜 Your Lineage Story</h2>

  <div class="narrative-card lineage-story">
    <p class="narrative-text">${narrative.lineageStory}</p>
    ${narrative.lineageStoryZh ? `<p class="narrative-text-zh">${narrative.lineageStoryZh}</p>` : ''}
  </div>

  <div class="narrative-statements">
    <div class="statement inheritance">
      <div class="statement-icon">🌿</div>
      <div class="statement-content">
        <h4>Inheritance</h4>
        <p>${narrative.inheritanceStatement}</p>
      </div>
    </div>

    <div class="statement liberation">
      <div class="statement-icon">🔓</div>
      <div class="statement-content">
        <h4>Liberation</h4>
        <p>${narrative.liberationStatement}</p>
      </div>
    </div>

    <div class="statement foundation">
      <div class="statement-icon">🌱</div>
      <div class="statement-content">
        <h4>Foundation</h4>
        <p>${narrative.foundationStatement}</p>
      </div>
    </div>
  </div>
</section>
  `;
}

function renderAncestralThreadsSection(
  threads: GenerationalThread[],
  position: PilgrimPosition
): string {
  // Filter to threads that include the pilgrim's generation
  const relevantThreads = threads.filter(t => t.generations.includes(position.generationIndex));

  if (relevantThreads.length === 0) {
    return `
<section class="ancestral-threads-section">
  <h2>🧵 Ancestral Threads Through You</h2>
  <p class="empty-note">No recurring threads pass through your generation in the current record.</p>
</section>
    `;
  }

  return `
<section class="ancestral-threads-section">
  <h2>🧵 Ancestral Threads Through You</h2>
  <p class="section-desc">Themes that flow across generations</p>

  <div class="threads-flow">
    ${relevantThreads.map(t => renderThreadFlow(t, position.generationIndex)).join('')}
  </div>
</section>
  `;
}

function renderThreadFlow(thread: GenerationalThread, selfIndex: number): string {
  const beforeSelf = thread.generations.filter(g => g < selfIndex);
  const afterSelf = thread.generations.filter(g => g > selfIndex);

  return `
<div class="thread-flow-card">
  <div class="thread-name">${thread.theme}</div>
  <div class="thread-flow-visual">
    <div class="flow-before">
      ${beforeSelf.map(g => `<span class="gen-node ancestor">Gen ${g}</span>`).join('<span class="flow-arrow">→</span>')}
    </div>
    <span class="flow-arrow">→</span>
    <span class="gen-node self">You</span>
    ${afterSelf.length > 0 ? `
      <span class="flow-arrow">→</span>
      <div class="flow-after">
        ${afterSelf.map(g => `<span class="gen-node descendant">Gen +${g}</span>`).join('<span class="flow-arrow">→</span>')}
      </div>
    ` : ''}
  </div>
  <div class="thread-intensity">
    <span class="intensity-label">Intensity: ${thread.intensity}%</span>
    <div class="intensity-bar">
      <div class="fill" style="width: ${thread.intensity}%"></div>
    </div>
  </div>
</div>
  `;
}

function renderEnrichedJourneySection(steps: EnrichedJourneyStep[]): string {
  // Filter to steps with ancestral resonance
  const resonantSteps = steps.filter(s => s.ancestralContext.resonanceLevel !== 'none');

  if (resonantSteps.length === 0) {
    return `
<section class="enriched-journey-section">
  <h2>🚶 Journey Steps with Ancestral Echoes</h2>
  <p class="empty-note">Your journey steps do not directly echo ancestral themes in the current analysis.</p>
</section>
    `;
  }

  return `
<section class="enriched-journey-section">
  <h2>🚶 Journey Steps with Ancestral Echoes</h2>
  <p class="section-desc">Where your personal journey meets ancestral streams</p>

  <div class="enriched-steps">
    ${resonantSteps.map(s => renderEnrichedStep(s)).join('')}
  </div>
</section>
  `;
}

function renderEnrichedStep(step: EnrichedJourneyStep): string {
  const ctx = step.ancestralContext;
  const resonanceClass = ctx.resonanceLevel;

  return `
<div class="enriched-step-card resonance-${resonanceClass}">
  <div class="step-header">
    <span class="step-chamber">${step.chamber || 'Unknown Chamber'}</span>
    <span class="resonance-badge ${resonanceClass}">${ctx.resonanceLevel} resonance</span>
  </div>

  <div class="step-content">
    <p class="step-insight">${step.insight || step.trial || ''}</p>
  </div>

  <div class="ancestral-tags">
    ${ctx.inherited.map(t => `<span class="tag inherited">🌿 ${t}</span>`).join('')}
    ${ctx.broken.map(t => `<span class="tag broken">🔓 ${t}</span>`).join('')}
    ${ctx.new.map(t => `<span class="tag new">🌱 ${t}</span>`).join('')}
  </div>

  ${ctx.ancestralVoice ? `
    <div class="ancestral-voice">
      <span class="voice-icon">🕯️</span>
      <p class="voice-text">${ctx.ancestralVoice}</p>
    </div>
  ` : ''}
</div>
  `;
}

function renderAncestralBlessingSection(narrative: AncestralNarrative): string {
  return `
<section class="ancestral-blessing-section">
  <div class="blessing-card">
    <div class="blessing-icon">🕯️</div>
    <h3>Ancestral Blessing</h3>
    <p class="blessing-text">${narrative.ancestralBlessing}</p>
    ${narrative.ancestralBlessingZh ? `<p class="blessing-text-zh">${narrative.ancestralBlessingZh}</p>` : ''}
  </div>
</section>
  `;
}

// ==================== STYLES ====================

function getAncestralJourneyStyles(): string {
  return `
    :root {
      --bg-primary: #0a0a14;
      --bg-secondary: #141428;
      --bg-card: #1e1e3a;
      --text-primary: #e8e8f0;
      --text-muted: #9090a8;
      --gold: #d4af37;
      --gold-glow: rgba(212, 175, 55, 0.3);
      --inherited: #4ade80;
      --broken: #f472b6;
      --new: #60a5fa;
      --ancestor: #a78bfa;
      --descendant: #38bdf8;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Georgia', serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.7;
    }

    .ancestral-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
    }

    .ancestral-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .ancestral-header h1 {
      color: var(--gold);
      font-size: 2.5rem;
      font-weight: normal;
      letter-spacing: 2px;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: var(--text-muted);
      font-size: 1.1rem;
      font-style: italic;
    }

    section {
      background: var(--bg-secondary);
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
      border: 1px solid rgba(212, 175, 55, 0.1);
    }

    section h2 {
      color: var(--gold);
      font-size: 1.5rem;
      font-weight: normal;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(212, 175, 55, 0.2);
    }

    .section-desc {
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }

    /* Pilgrim Position Section */
    .position-visual {
      margin-bottom: 2rem;
    }

    .lineage-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      padding: 2rem;
      background: var(--bg-card);
      border-radius: 12px;
    }

    .ancestors, .descendants {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .dots {
      color: var(--ancestor);
      letter-spacing: 4px;
    }

    .descendants .dots {
      color: var(--descendant);
    }

    .label {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .empty {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-style: italic;
    }

    .self-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    .marker-glow {
      position: absolute;
      width: 80px;
      height: 80px;
      background: radial-gradient(circle, var(--gold-glow) 0%, transparent 70%);
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.2); opacity: 0.8; }
    }

    .marker-icon {
      font-size: 2rem;
      color: var(--gold);
      position: relative;
      z-index: 1;
    }

    .marker-label {
      font-weight: bold;
      color: var(--gold);
      margin-top: 0.5rem;
    }

    .marker-label-zh {
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .gen-index {
      font-size: 0.75rem;
      background: var(--bg-primary);
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
      color: var(--text-muted);
      margin-top: 0.5rem;
    }

    /* Theme Columns */
    .theme-columns {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .theme-column {
      background: var(--bg-card);
      border-radius: 12px;
      padding: 1.5rem;
    }

    .theme-column h3 {
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }

    .theme-column.inherited h3 { color: var(--inherited); }
    .theme-column.broken h3 { color: var(--broken); }
    .theme-column.new h3 { color: var(--new); }

    .column-desc {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 1rem;
    }

    .theme-list {
      list-style: none;
    }

    .theme-item {
      padding: 0.5rem 0.75rem;
      margin-bottom: 0.5rem;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .theme-item.inherited {
      background: rgba(74, 222, 128, 0.1);
      border-left: 3px solid var(--inherited);
    }

    .theme-item.broken {
      background: rgba(244, 114, 182, 0.1);
      border-left: 3px solid var(--broken);
    }

    .theme-item.new {
      background: rgba(96, 165, 250, 0.1);
      border-left: 3px solid var(--new);
    }

    .empty-note {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-style: italic;
    }

    /* Ancestral Narrative Section */
    .narrative-card {
      background: var(--bg-card);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      border-left: 4px solid var(--gold);
    }

    .narrative-text {
      font-size: 1.1rem;
      color: var(--text-primary);
      line-height: 1.8;
    }

    .narrative-text-zh {
      font-size: 0.95rem;
      color: var(--text-muted);
      margin-top: 0.75rem;
      font-style: italic;
    }

    .narrative-statements {
      display: grid;
      gap: 1rem;
    }

    .statement {
      display: flex;
      gap: 1rem;
      background: var(--bg-card);
      border-radius: 10px;
      padding: 1rem 1.25rem;
    }

    .statement-icon {
      font-size: 1.5rem;
    }

    .statement-content h4 {
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }

    .statement.inheritance h4 { color: var(--inherited); }
    .statement.liberation h4 { color: var(--broken); }
    .statement.foundation h4 { color: var(--new); }

    .statement-content p {
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    /* Thread Flow Section */
    .threads-flow {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .thread-flow-card {
      background: var(--bg-card);
      border-radius: 10px;
      padding: 1.25rem;
    }

    .thread-name {
      font-weight: bold;
      color: var(--gold);
      margin-bottom: 0.75rem;
    }

    .thread-flow-visual {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 0.75rem;
    }

    .gen-node {
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.8rem;
    }

    .gen-node.ancestor {
      background: rgba(167, 139, 250, 0.2);
      color: var(--ancestor);
    }

    .gen-node.self {
      background: rgba(212, 175, 55, 0.3);
      color: var(--gold);
      font-weight: bold;
    }

    .gen-node.descendant {
      background: rgba(56, 189, 248, 0.2);
      color: var(--descendant);
    }

    .flow-arrow {
      color: var(--text-muted);
    }

    .thread-intensity {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .intensity-label {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .intensity-bar {
      flex: 1;
      height: 4px;
      background: var(--bg-primary);
      border-radius: 2px;
      overflow: hidden;
    }

    .intensity-bar .fill {
      height: 100%;
      background: linear-gradient(90deg, var(--ancestor), var(--gold));
    }

    /* Enriched Journey Section */
    .enriched-steps {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .enriched-step-card {
      background: var(--bg-card);
      border-radius: 10px;
      padding: 1.25rem;
      border-left: 4px solid var(--gold);
    }

    .enriched-step-card.resonance-deep { border-left-color: var(--gold); }
    .enriched-step-card.resonance-moderate { border-left-color: var(--inherited); }
    .enriched-step-card.resonance-faint { border-left-color: var(--text-muted); }

    .step-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .step-chamber {
      font-weight: bold;
      color: var(--gold);
    }

    .resonance-badge {
      font-size: 0.7rem;
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .resonance-badge.deep { background: rgba(212, 175, 55, 0.2); color: var(--gold); }
    .resonance-badge.moderate { background: rgba(74, 222, 128, 0.2); color: var(--inherited); }
    .resonance-badge.faint { background: rgba(144, 144, 168, 0.2); color: var(--text-muted); }

    .step-insight {
      color: var(--text-muted);
      margin-bottom: 0.75rem;
      font-size: 0.95rem;
    }

    .ancestral-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .tag {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .tag.inherited { background: rgba(74, 222, 128, 0.15); color: var(--inherited); }
    .tag.broken { background: rgba(244, 114, 182, 0.15); color: var(--broken); }
    .tag.new { background: rgba(96, 165, 250, 0.15); color: var(--new); }

    .ancestral-voice {
      display: flex;
      gap: 0.75rem;
      padding: 0.75rem;
      background: var(--bg-primary);
      border-radius: 8px;
      margin-top: 0.5rem;
    }

    .voice-icon {
      font-size: 1.25rem;
    }

    .voice-text {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-style: italic;
      line-height: 1.6;
    }

    /* Ancestral Blessing Section */
    .ancestral-blessing-section {
      background: linear-gradient(135deg, var(--bg-secondary) 0%, rgba(212, 175, 55, 0.05) 100%);
      text-align: center;
    }

    .blessing-card {
      max-width: 600px;
      margin: 0 auto;
    }

    .blessing-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .blessing-card h3 {
      color: var(--gold);
      font-size: 1.25rem;
      font-weight: normal;
      margin-bottom: 1rem;
    }

    .blessing-text {
      font-size: 1.1rem;
      color: var(--text-primary);
      line-height: 1.8;
    }

    .blessing-text-zh {
      font-size: 0.95rem;
      color: var(--text-muted);
      margin-top: 1rem;
      font-style: italic;
    }

    @media (max-width: 768px) {
      .theme-columns { grid-template-columns: 1fr; }
      .lineage-bar { flex-direction: column; }
    }
  `;
}

// ==================== SCRIPT ====================

function getAncestralJourneyScript(): string {
  return `
    // Simple interactivity for ancestral journey
    document.querySelectorAll('.enriched-step-card').forEach(card => {
      card.addEventListener('click', function() {
        this.classList.toggle('expanded');
      });
    });
  `;
}

// ==================== EXPORTS ====================

export {
  renderAncestralJourneyHtml,
  renderPilgrimPositionComponent,
  renderAncestralNarrativeComponent,
  getAncestralJourneyStyles,
  getAncestralJourneyScript
};
