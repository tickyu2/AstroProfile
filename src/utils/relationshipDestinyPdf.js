/**
 * Relationship Destiny PDF Renderer
 * ==================================
 *
 * Illuminated Manuscript Template for Relationship Destiny Reports
 *
 * This module provides:
 * - HTML template generation for PDF rendering
 * - CSS styles for illuminated manuscript aesthetics
 * - Helper functions for formatting report data
 *
 * Compatible with:
 * - Puppeteer
 * - Playwright
 * - wkhtmltopdf
 * - React-PDF (with adaptation)
 */

// ============================================================================
// CSS STYLES - Illuminated Manuscript
// ============================================================================

const PDF_STYLES = `
/* GENERAL LAYOUT */
.codex-body {
  font-family: "Garamond", "Cormorant Garamond", "Georgia", serif;
  font-size: 12pt;
  line-height: 1.6;
  color: #2a1f14;
  margin: 0;
  padding: 0;
  background: #faf8f5;
}

/* PAGE BREAKS */
.page-break {
  page-break-before: always;
}

/* COVER PAGE */
.codex-cover {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 60px;
  position: relative;
  background: linear-gradient(180deg, #faf8f5 0%, #f0ebe3 100%);
}

.cover-border {
  position: absolute;
  top: 30px;
  bottom: 30px;
  left: 30px;
  right: 30px;
  border: 4px double #bfa76a;
  border-radius: 8px;
}

.cover-inner-border {
  position: absolute;
  top: 40px;
  bottom: 40px;
  left: 40px;
  right: 40px;
  border: 1px solid #d4c4a0;
  border-radius: 4px;
}

.cover-title {
  font-size: 36pt;
  letter-spacing: 3px;
  margin-bottom: 10px;
  color: #8a7a4a;
  text-transform: uppercase;
}

.cover-subtitle {
  font-size: 14pt;
  font-style: italic;
  color: #6a5a3a;
  margin-bottom: 30px;
}

.cover-participants {
  font-size: 18pt;
  color: #4a3a22;
  margin-bottom: 20px;
}

.cover-myth {
  font-size: 14pt;
  margin-top: 40px;
  font-style: italic;
  color: #6a5a3a;
}

.cover-archetype {
  margin-top: 20px;
  font-size: 12pt;
  color: #8a7a4a;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.cover-date {
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  font-size: 10pt;
  color: #a09080;
}

/* SUMMARY PAGE */
.codex-summary {
  padding: 60px;
}

/* CHAPTER STYLING */
.codex-chapter {
  padding: 50px 60px;
}

.chapter-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #d4c4a0;
}

.chapter-number {
  font-size: 12pt;
  color: #a09080;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 10px;
}

.chapter-title {
  font-size: 24pt;
  color: #8a7a4a;
  margin: 0 0 10px;
  letter-spacing: 1px;
}

.chapter-subtitle {
  font-size: 12pt;
  font-style: italic;
  color: #6a5a3a;
  margin: 0;
}

/* ILLUMINATED DROP CAP */
.dropcap::first-letter {
  font-size: 48pt;
  float: left;
  margin-right: 10px;
  margin-top: 4px;
  font-family: "Cinzel Decorative", "Georgia", serif;
  color: #bfa76a;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

/* SECTION STYLING */
.chapter-section {
  margin-bottom: 25px;
}

.section-title {
  font-size: 14pt;
  color: #6a5a3a;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #e0d5c5;
}

.section-content {
  padding-left: 15px;
  border-left: 2px solid #e0d5c5;
}

/* CARD STYLING */
.content-card {
  background: #f5f0e8;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid #e0d5c5;
}

.card-label {
  font-size: 10pt;
  color: #a09080;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 5px;
}

.card-value {
  font-size: 14pt;
  color: #4a3a22;
  margin-bottom: 5px;
}

.card-description {
  font-size: 11pt;
  color: #6a5a3a;
  line-height: 1.5;
}

/* GRID LAYOUTS */
.two-column {
  display: flex;
  gap: 20px;
}

.two-column > div {
  flex: 1;
}

/* LISTS */
.styled-list {
  margin: 0;
  padding-left: 20px;
}

.styled-list li {
  margin-bottom: 8px;
  color: #4a3a22;
}

.styled-list li::marker {
  color: #bfa76a;
}

/* TIMELINE */
.evolution-timeline {
  position: relative;
  padding-left: 30px;
}

.evolution-timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #d4c4a0;
}

.timeline-item {
  position: relative;
  margin-bottom: 15px;
  padding: 10px 15px;
  background: #f5f0e8;
  border-radius: 4px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -26px;
  top: 15px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d4c4a0;
  border: 2px solid #bfa76a;
}

.timeline-item.current::before {
  background: #bfa76a;
  box-shadow: 0 0 8px rgba(191, 167, 106, 0.5);
}

.timeline-item.past::before {
  background: #a09080;
  border-color: #a09080;
}

.timeline-title {
  font-size: 12pt;
  color: #4a3a22;
  margin-bottom: 3px;
}

.timeline-meta {
  font-size: 10pt;
  color: #a09080;
}

/* LUNA GUIDANCE */
.luna-guidance {
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #f5f0e8 0%, #ebe5db 100%);
  border-radius: 8px;
  border-left: 4px solid #9b7cb8;
}

.luna-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.luna-icon {
  font-size: 18pt;
  color: #9b7cb8;
}

.luna-title {
  font-size: 12pt;
  color: #6a5a6a;
  font-style: italic;
}

.luna-text {
  font-size: 11pt;
  color: #4a3a4a;
  line-height: 1.6;
  font-style: italic;
}

/* HEALING SECTION */
.wound-card {
  background: #fdf5f5;
  border-left: 4px solid #c97878;
  padding: 15px;
  margin-bottom: 15px;
}

.wound-name {
  font-size: 13pt;
  color: #8a4a4a;
  margin-bottom: 5px;
}

.wound-description {
  font-size: 11pt;
  color: #6a5a5a;
}

.ritual-card {
  background: #f5fdf5;
  border-left: 4px solid #78c978;
  padding: 15px;
  margin-bottom: 15px;
}

.ritual-name {
  font-size: 13pt;
  color: #4a8a4a;
  margin-bottom: 5px;
}

.ritual-steps {
  margin: 10px 0 0;
  padding-left: 20px;
}

.ritual-steps li {
  margin-bottom: 8px;
  color: #4a6a4a;
}

/* EMERGENCY SECTION */
.emergency-box {
  background: #fdfaf5;
  border: 2px solid #e0c080;
  padding: 15px;
  margin-top: 20px;
}

.emergency-title {
  font-size: 12pt;
  color: #8a6a3a;
  margin-bottom: 10px;
}

.emergency-list {
  margin: 0;
  padding-left: 20px;
}

.emergency-list li {
  margin-bottom: 5px;
  color: #6a5a3a;
  font-size: 10pt;
}

/* CLOSING PAGE */
.codex-closing {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 60px;
  background: linear-gradient(180deg, #f0ebe3 0%, #faf8f5 100%);
}

.closing-header {
  font-size: 24pt;
  color: #8a7a4a;
  margin-bottom: 30px;
  letter-spacing: 2px;
}

.closing-text {
  font-size: 14pt;
  font-style: italic;
  color: #4a3a22;
  max-width: 500px;
  line-height: 1.8;
}

.closing-blessing {
  margin-top: 40px;
  font-size: 12pt;
  color: #6a5a3a;
  font-style: italic;
}

.closing-ornament {
  margin-top: 40px;
  font-size: 24pt;
  color: #bfa76a;
}

/* FOOTER */
.page-footer {
  position: fixed;
  bottom: 20px;
  left: 60px;
  right: 60px;
  text-align: center;
  font-size: 9pt;
  color: #a09080;
  border-top: 1px solid #e0d5c5;
  padding-top: 10px;
}

/* ORNAMENTAL ELEMENTS */
.ornament {
  text-align: center;
  font-size: 18pt;
  color: #bfa76a;
  margin: 20px 0;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #d4c4a0 50%, transparent 100%);
  margin: 30px 0;
}
`;

// ============================================================================
// HTML TEMPLATE GENERATOR
// ============================================================================

/**
 * Generate the complete HTML document for PDF rendering
 */
export function generateRelationshipDestinyHtml(report) {
  const {
    participants,
    relationshipAge,
    executiveSummary,
    sections,
    rawAnalysis,
    lunaWisdom
  } = report;

  const personA = participants?.personA?.name || 'Partner A';
  const personB = participants?.personB?.name || 'Partner B';
  const archetype = executiveSummary?.coreIdentity?.archetype || 'Soul Partners';
  const myth = executiveSummary?.coreIdentity?.myth || 'The Journey';
  const generatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Relationship Destiny Report - ${personA} & ${personB}</title>
  <style>${PDF_STYLES}</style>
</head>
<body class="codex-body">

  <!-- COVER PAGE -->
  <section class="codex-cover">
    <div class="cover-border"></div>
    <div class="cover-inner-border"></div>
    <h1 class="cover-title">Relationship Destiny</h1>
    <p class="cover-subtitle">An Illuminated Portrait of the Bond</p>
    <p class="cover-participants">${personA} & ${personB}</p>
    ${relationshipAge?.years ? `<p class="cover-myth">${relationshipAge.years} Years Together</p>` : ''}
    <p class="cover-archetype">${archetype}</p>
    <p class="cover-date">Generated ${generatedDate}</p>
  </section>

  <!-- SUMMARY PAGE -->
  <section class="codex-summary page-break">
    <div class="chapter-header">
      <p class="chapter-number">Prologue</p>
      <h2 class="chapter-title">Executive Summary</h2>
      <p class="chapter-subtitle">The Essence of Your Bond</p>
    </div>
    <p class="dropcap">${executiveSummary?.essence || 'Your relationship is a unique journey of two souls learning and growing together.'}</p>

    ${executiveSummary?.coreStrengths?.length > 0 ? `
    <div class="chapter-section">
      <h3 class="section-title">Core Strengths</h3>
      <ul class="styled-list">
        ${executiveSummary.coreStrengths.map(s => `<li>${s}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    ${executiveSummary?.coreChallenges?.length > 0 ? `
    <div class="chapter-section">
      <h3 class="section-title">Growth Edges</h3>
      <ul class="styled-list">
        ${executiveSummary.coreChallenges.map(c => `<li>${c}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    <div class="divider"></div>
    <p class="ornament">\u2726</p>
  </section>

  <!-- CHAPTER I: SOUL MAP -->
  <section class="codex-chapter page-break">
    <div class="chapter-header">
      <p class="chapter-number">Chapter I</p>
      <h2 class="chapter-title">The Soul Map</h2>
      <p class="chapter-subtitle">Identity, Shadow, and Contract of the Bond</p>
    </div>

    ${generateSoulMapContent(sections?.identity, rawAnalysis?.soulMap)}

    <div class="divider"></div>
  </section>

  <!-- CHAPTER II: TIMELINE -->
  <section class="codex-chapter page-break">
    <div class="chapter-header">
      <p class="chapter-number">Chapter II</p>
      <h2 class="chapter-title">The Timeline</h2>
      <p class="chapter-subtitle">Seasons, Transits, and Fate Windows</p>
    </div>

    ${generateTimelineContent(rawAnalysis?.timeline)}

    <div class="divider"></div>
  </section>

  <!-- CHAPTER III: EVOLUTION -->
  <section class="codex-chapter page-break">
    <div class="chapter-header">
      <p class="chapter-number">Chapter III</p>
      <h2 class="chapter-title">The Evolution</h2>
      <p class="chapter-subtitle">Archetype Metamorphosis Across Saturn Cycles</p>
    </div>

    ${generateEvolutionContent(rawAnalysis?.evolution)}

    <div class="divider"></div>
  </section>

  <!-- CHAPTER IV: HEALING -->
  <section class="codex-chapter page-break">
    <div class="chapter-header">
      <p class="chapter-number">Chapter IV</p>
      <h2 class="chapter-title">The Healing Path</h2>
      <p class="chapter-subtitle">Luna-Guided Repair and Restoration</p>
    </div>

    ${generateHealingContent(rawAnalysis?.healing)}

    <div class="divider"></div>
  </section>

  <!-- CLOSING PAGE -->
  <section class="codex-closing page-break">
    <h2 class="closing-header">The Oath of the Bond</h2>
    <p class="closing-text">
      May this relationship walk its destiny with clarity, courage, and compassion.
      May its shadow be met with honesty, its wounds with tenderness, and its gifts with gratitude.
    </p>
    ${lunaWisdom?.closingBlessing ? `
    <p class="closing-blessing">"${lunaWisdom.closingBlessing}"</p>
    ` : ''}
    <p class="closing-ornament">\u2726 \u221E \u2726</p>
  </section>

</body>
</html>`;
}

// ============================================================================
// CONTENT GENERATORS
// ============================================================================

function generateSoulMapContent(identity, soulMap) {
  let html = '';

  // Identity
  if (identity || soulMap?.identity) {
    const id = identity || soulMap?.identity;
    html += `
    <div class="chapter-section">
      <h3 class="section-title">Relationship Identity</h3>
      <div class="two-column">
        ${id.compositeSun ? `
        <div class="content-card">
          <p class="card-label">Composite Sun</p>
          <p class="card-value">${id.compositeSun.sign || 'Unknown'}</p>
          <p class="card-description">${id.compositeSun.meaning || ''}</p>
        </div>
        ` : ''}
        ${id.compositeMoon ? `
        <div class="content-card">
          <p class="card-label">Composite Moon</p>
          <p class="card-value">${id.compositeMoon.sign || 'Unknown'}</p>
          <p class="card-description">${id.compositeMoon.meaning || ''}</p>
        </div>
        ` : ''}
      </div>
    </div>
    `;
  }

  // Shadow
  if (soulMap?.shadow) {
    html += `
    <div class="chapter-section">
      <h3 class="section-title">Relationship Shadow</h3>
      ${soulMap.shadow.collectiveShadow ? `
      <div class="content-card">
        <p class="card-description">${soulMap.shadow.collectiveShadow.description || ''}</p>
      </div>
      ` : ''}
      ${soulMap.shadow.integrationPath ? `
      <div class="section-content">
        <p><strong>Integration Path:</strong></p>
        <ol class="styled-list">
          ${Object.values(soulMap.shadow.integrationPath).map(step => `<li>${step}</li>`).join('')}
        </ol>
      </div>
      ` : ''}
    </div>
    `;
  }

  // Contract
  if (soulMap?.contract) {
    html += `
    <div class="chapter-section">
      <h3 class="section-title">Soul Contract</h3>
      <div class="two-column">
        ${soulMap.contract.soulLessons ? `
        <div class="content-card">
          <p class="card-label">Soul Lessons</p>
          <ul class="styled-list">
            ${soulMap.contract.soulLessons.map(l => `<li>${l}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        ${soulMap.contract.sharedStrengths ? `
        <div class="content-card">
          <p class="card-label">Shared Strengths</p>
          <ul class="styled-list">
            ${soulMap.contract.sharedStrengths.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
      </div>
    </div>
    `;
  }

  return html;
}

function generateTimelineContent(timeline) {
  if (!timeline) return '<p>Timeline data not available.</p>';

  let html = '';

  // Current Season
  if (timeline.currentSeason) {
    html += `
    <div class="chapter-section">
      <h3 class="section-title">Current Season</h3>
      <div class="content-card">
        <p class="card-label">${timeline.currentSeason.type || 'Active'} Season</p>
        <p class="card-value">${timeline.currentSeason.theme || ''}</p>
        <p class="card-description">${timeline.currentSeason.meaning || ''}</p>
      </div>
    </div>
    `;
  }

  // Fate Windows
  if (timeline.activeFateWindows?.length > 0) {
    html += `
    <div class="chapter-section">
      <h3 class="section-title">Active Fate Windows</h3>
      ${timeline.activeFateWindows.map(w => `
      <div class="content-card">
        <p class="card-label">${w.name || 'Fate Window'}</p>
        <p class="card-description">${w.meaning || ''}</p>
        ${w.opportunity ? `<p class="card-description"><strong>Opportunity:</strong> ${w.opportunity}</p>` : ''}
      </div>
      `).join('')}
    </div>
    `;
  }

  // Transits
  if (timeline.currentTransits?.length > 0) {
    html += `
    <div class="chapter-section">
      <h3 class="section-title">Current Transits</h3>
      ${timeline.currentTransits.slice(0, 4).map(t => `
      <div class="content-card">
        <p class="card-label">${t.transitPlanet} ${t.aspectType} ${t.natalPoint}</p>
        <p class="card-description">${t.meaning || ''}</p>
        ${t.duration ? `<p class="card-description"><em>Duration: ${t.duration}</em></p>` : ''}
      </div>
      `).join('')}
    </div>
    `;
  }

  return html;
}

function generateEvolutionContent(evolution) {
  if (!evolution) return '<p>Evolution data not available.</p>';

  let html = '';

  // Current Stage
  if (evolution.currentStage) {
    const stage = evolution.currentStage;
    html += `
    <div class="chapter-section">
      <h3 class="section-title">Current Evolution Stage</h3>
      <div class="content-card">
        <p class="card-label">${stage.saturnPhase || ''}</p>
        <p class="card-value">${stage.title || 'Current Stage'}</p>
        <p class="card-description"><strong>Archetype:</strong> ${stage.archetype || ''}</p>
        <p class="card-description"><strong>Myth:</strong> ${stage.myth || ''}</p>
        <p class="card-description"><strong>Task:</strong> ${stage.psychologicalTask || ''}</p>
      </div>
      <div class="two-column">
        <div class="content-card">
          <p class="card-label">Growth Theme</p>
          <p class="card-description">${stage.growthTheme || ''}</p>
        </div>
        <div class="content-card">
          <p class="card-label">Shadow Theme</p>
          <p class="card-description">${stage.shadowTheme || ''}</p>
        </div>
      </div>
    </div>
    `;
  }

  // Mythic Arc
  if (evolution.mythicArc) {
    html += `
    <div class="chapter-section">
      <h3 class="section-title">Mythic Arc</h3>
      <div class="content-card">
        <p class="card-value">${evolution.mythicArc.name || ''}</p>
        <p class="card-description">${evolution.mythicArc.description || ''}</p>
        ${evolution.mythicArc.currentPhase ? `<p class="card-description"><strong>Current Phase:</strong> ${evolution.mythicArc.currentPhase}</p>` : ''}
      </div>
    </div>
    `;
  }

  // Evolution Timeline
  if (evolution.evolutionTimeline?.length > 0) {
    html += `
    <div class="chapter-section">
      <h3 class="section-title">Evolution Journey</h3>
      <div class="evolution-timeline">
        ${evolution.evolutionTimeline.map(s => `
        <div class="timeline-item ${s.isCurrent ? 'current' : ''} ${s.isPast ? 'past' : ''}">
          <p class="timeline-title">${s.title || ''}</p>
          <p class="timeline-meta">${s.archetype || ''} - Years ${s.yearRange?.[0] || ''}-${s.yearRange?.[1] || ''}</p>
        </div>
        `).join('')}
      </div>
    </div>
    `;
  }

  // Luna Wisdom
  if (evolution.lunaWisdom?.currentStage) {
    html += `
    <div class="luna-guidance">
      <div class="luna-header">
        <span class="luna-icon">\u263D</span>
        <span class="luna-title">Luna's Wisdom for This Stage</span>
      </div>
      <p class="luna-text">${evolution.lunaWisdom.currentStage}</p>
    </div>
    `;
  }

  return html;
}

function generateHealingContent(healing) {
  if (!healing) return '<p>Healing data not available.</p>';

  let html = '';

  // Wounds
  if (healing.woundAnalysis?.primaryWounds?.length > 0) {
    html += `
    <div class="chapter-section">
      <h3 class="section-title">Wound Patterns</h3>
      ${healing.woundAnalysis.primaryWounds.slice(0, 3).map(w => `
      <div class="wound-card">
        <p class="wound-name">${w.wound || 'Unnamed Wound'}</p>
        <p class="wound-description">${w.description || ''}</p>
        ${w.lunaHealing ? `
        <div class="luna-guidance" style="margin-top: 10px;">
          <p class="luna-text">${w.lunaHealing}</p>
        </div>
        ` : ''}
      </div>
      `).join('')}
    </div>
    `;
  }

  // Rituals
  if (healing.healingPrescription?.rituals?.length > 0) {
    html += `
    <div class="chapter-section">
      <h3 class="section-title">Repair Rituals</h3>
      ${healing.healingPrescription.rituals.slice(0, 2).map(r => `
      <div class="ritual-card">
        <p class="ritual-name">${r.name || 'Ritual'}</p>
        <p class="card-description">${r.description || ''}</p>
        ${r.when ? `<p class="card-description"><em>When: ${r.when}</em></p>` : ''}
        ${r.steps ? `
        <ol class="ritual-steps">
          ${r.steps.slice(0, 5).map(s => `<li><strong>${s.name}:</strong> ${s.instruction}</li>`).join('')}
        </ol>
        ` : ''}
      </div>
      `).join('')}
    </div>
    `;
  }

  // Emergency Toolkit
  if (healing.emergencyToolkit) {
    html += `
    <div class="emergency-box">
      <p class="emergency-title">\u26A1 Emergency Toolkit</p>
      ${healing.emergencyToolkit.inConflict ? `
      <p><strong>In Conflict:</strong></p>
      <ul class="emergency-list">
        ${healing.emergencyToolkit.inConflict.slice(0, 3).map(t => `<li>${t}</li>`).join('')}
      </ul>
      ` : ''}
      ${healing.emergencyToolkit.feelingFlooded ? `
      <p><strong>Feeling Flooded:</strong></p>
      <ul class="emergency-list">
        ${healing.emergencyToolkit.feelingFlooded.slice(0, 3).map(t => `<li>${t}</li>`).join('')}
      </ul>
      ` : ''}
    </div>
    `;
  }

  // Luna Dialogue
  if (healing.lunaGuidance?.currentSituation) {
    html += `
    <div class="luna-guidance">
      <div class="luna-header">
        <span class="luna-icon">\u263D</span>
        <span class="luna-title">${healing.lunaGuidance.currentSituation.context || "Luna's Guidance"}</span>
      </div>
      <p class="luna-text">${healing.lunaGuidance.currentSituation.dialogue || ''}</p>
    </div>
    `;
  }

  return html;
}

// ============================================================================
// PUPPETEER RENDERER (Node.js)
// ============================================================================

/**
 * Render PDF using Puppeteer
 *
 * Usage:
 * const { renderRelationshipDestinyPdf } = require('./relationshipDestinyPdf');
 * await renderRelationshipDestinyPdf(report, 'output.pdf');
 */
export async function renderRelationshipDestinyPdf(report, outputPath) {
  // Note: This requires puppeteer to be installed
  // npm install puppeteer

  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch();
  const page = await browser.newPage();

  const html = generateRelationshipDestinyHtml(report);

  await page.setContent(html, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0',
      bottom: '0',
      left: '0',
      right: '0'
    }
  });

  await browser.close();

  return outputPath;
}

/**
 * Get just the HTML (for custom rendering)
 */
export function getRelationshipDestinyHtml(report) {
  return generateRelationshipDestinyHtml(report);
}

/**
 * Get just the CSS (for custom styling)
 */
export function getRelationshipDestinyStyles() {
  return PDF_STYLES;
}

export default {
  generateRelationshipDestinyHtml,
  renderRelationshipDestinyPdf,
  getRelationshipDestinyHtml,
  getRelationshipDestinyStyles
};
