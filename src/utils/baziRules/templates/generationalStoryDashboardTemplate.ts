/**
 * ============================================
 * GENERATIONAL STORY DASHBOARD
 * The ancestral wing of the Cathedral
 *
 * Master UI cockpit combining:
 * - Generational Ladder
 * - Group Narratives
 * - Ancestral Threads
 * - Pilgrim Position
 * - Ancestral Persona Messages
 * - Healing Rituals
 *
 * The pilgrim sees their entire ancestral story
 * in one unified interface.
 * ============================================
 */

import { GenerationalLadder, GenerationalThread } from '../generationalLadder';
import { JourneyWithGenerations, PilgrimPosition, AncestralNarrative } from '../journeyWithGenerations';
import { AncestralPersonaLayer, AncestralPersonaMessage } from '../ancestralPersona';
import { RitualCollection, AncestralRitual } from '../ancestralRitual';

// ==================== DATA MODEL ====================

export interface GenerationalStoryDashboardData {
  ladder: GenerationalLadder;
  threads: GenerationalThread[];
  position: PilgrimPosition;
  narrative: AncestralNarrative;
  personaLayer?: AncestralPersonaLayer;
  rituals?: RitualCollection;
  journeyWithGenerations?: JourneyWithGenerations;
}

// ==================== RENDER FUNCTIONS ====================

/**
 * Render full Generational Story Dashboard HTML page
 */
export function renderGenerationalStoryDashboardHtml(
  data: GenerationalStoryDashboardData,
  options: { lang?: 'en' | 'zh'; theme?: 'light' | 'dark'; pilgrimName?: string } = {}
): string {
  const { lang = 'en', theme = 'light', pilgrimName } = options;

  return `
<!DOCTYPE html>
<html lang="${lang === 'zh' ? 'zh-CN' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lang === 'zh' ? '世代故事殿堂' : 'Generational Story Dashboard'}</title>
  <style>
    ${getGenerationalStoryDashboardStyles(theme)}
  </style>
</head>
<body class="theme-${theme}">
  <div class="dashboard-container">
    ${renderDashboardHeader(data, lang, pilgrimName)}

    <div class="dashboard-grid">
      <div class="dashboard-main">
        ${renderLadderPanel(data.ladder, data.position, lang)}
        ${renderThreadsPanel(data.threads, lang)}
        ${data.personaLayer ? renderPersonaPanel(data.personaLayer, lang) : ''}
      </div>

      <div class="dashboard-sidebar">
        ${renderPositionPanel(data.position, data.narrative, lang)}
        ${data.rituals ? renderRitualsPanel(data.rituals, lang) : ''}
      </div>
    </div>

    ${renderNarrativePanel(data.narrative, lang)}

    ${data.journeyWithGenerations ? renderEnrichedJourneyPanel(data.journeyWithGenerations, lang) : ''}
  </div>

  <script>
    ${getGenerationalStoryDashboardScript()}
  </script>
</body>
</html>
  `.trim();
}

/**
 * Render Dashboard Header
 */
function renderDashboardHeader(
  data: GenerationalStoryDashboardData,
  lang: 'en' | 'zh',
  pilgrimName?: string
): string {
  const title = lang === 'zh' ? '🏛️ 世代故事殿堂' : '🏛️ Generational Story Dashboard';
  const subtitle = pilgrimName
    ? (lang === 'zh' ? `${pilgrimName}的祖系旅程` : `${pilgrimName}'s Ancestral Journey`)
    : (lang === 'zh' ? '你的祖系旅程' : 'Your Ancestral Journey');

  const stats = {
    generations: data.ladder.generations.length,
    threads: data.threads.length,
    ancestors: data.position.ancestorCount,
    descendants: data.position.descendantCount
  };

  return `
<header class="dashboard-header">
  <h1>${title}</h1>
  <p class="subtitle">${subtitle}</p>
  <div class="header-stats">
    <div class="stat-item">
      <span class="stat-value">${stats.generations}</span>
      <span class="stat-label">${lang === 'zh' ? '代人' : 'Generations'}</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">${stats.threads}</span>
      <span class="stat-label">${lang === 'zh' ? '条丝线' : 'Threads'}</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">${stats.ancestors}</span>
      <span class="stat-label">${lang === 'zh' ? '位祖先' : 'Ancestors'}</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">${stats.descendants}</span>
      <span class="stat-label">${lang === 'zh' ? '位后人' : 'Descendants'}</span>
    </div>
  </div>
</header>
  `.trim();
}

/**
 * Render Ladder Panel
 */
function renderLadderPanel(
  ladder: GenerationalLadder,
  position: PilgrimPosition,
  lang: 'en' | 'zh'
): string {
  const title = lang === 'zh' ? '世代阶梯' : 'Generational Ladder';

  const generationsHtml = ladder.generations
    .sort((a, b) => a.generationIndex - b.generationIndex)
    .map(gen => {
      const isSelf = gen.generationIndex === position.generationIndex;
      const genClass = getGenerationClass(gen.generationIndex, position.generationIndex);

      return `
<div class="ladder-rung ${genClass} ${isSelf ? 'is-self' : ''}" data-gen-index="${gen.generationIndex}">
  <div class="rung-index">${gen.generationIndex > 0 ? '+' : ''}${gen.generationIndex}</div>
  <div class="rung-content">
    <div class="rung-label">${lang === 'zh' ? gen.labelZh || gen.label : gen.label}</div>
    <div class="rung-members">
      ${gen.members.map(m => `
        <div class="member-card" data-member-id="${m.id}">
          <span class="member-name">${m.name}</span>
          ${m.birthDate ? `<span class="member-date">${m.birthDate}</span>` : ''}
        </div>
      `).join('')}
    </div>
  </div>
  ${isSelf ? `<div class="self-marker">${lang === 'zh' ? '← 你' : '← YOU'}</div>` : ''}
</div>
      `.trim();
    }).join('');

  return `
<section class="panel ladder-panel">
  <h2><span class="panel-icon">🪜</span> ${title}</h2>
  <div id="ladder-view" class="ladder-container">
    ${generationsHtml}
  </div>
</section>
  `.trim();
}

/**
 * Render Threads Panel
 */
function renderThreadsPanel(threads: GenerationalThread[], lang: 'en' | 'zh'): string {
  const title = lang === 'zh' ? '血脉丝线' : 'Ancestral Threads';

  if (threads.length === 0) {
    return `
<section class="panel threads-panel">
  <h2><span class="panel-icon">🧵</span> ${title}</h2>
  <div id="threads-view" class="threads-container">
    <p class="no-data">${lang === 'zh' ? '尚未检测到跨代丝线' : 'No cross-generational threads detected'}</p>
  </div>
</section>
    `.trim();
  }

  const threadsHtml = threads.map(thread => {
    const strengthLabel = thread.strength >= 0.7 ? (lang === 'zh' ? '强' : 'Strong')
      : thread.strength >= 0.4 ? (lang === 'zh' ? '中' : 'Moderate')
      : (lang === 'zh' ? '弱' : 'Faint');
    const strengthClass = thread.strength >= 0.7 ? 'strong' : thread.strength >= 0.4 ? 'moderate' : 'faint';

    return `
<div class="thread-card ${strengthClass}" data-thread-id="${thread.id}">
  <div class="thread-visual">
    <div class="thread-line"></div>
  </div>
  <div class="thread-info">
    <div class="thread-theme">${thread.theme}</div>
    <div class="thread-meta">
      <span class="thread-strength">${strengthLabel} (${(thread.strength * 100).toFixed(0)}%)</span>
      <span class="thread-span">${lang === 'zh' ? '跨越' : 'Spans'} ${thread.generations.length} ${lang === 'zh' ? '代' : 'gen'}</span>
    </div>
    ${thread.description ? `<div class="thread-desc">${thread.description}</div>` : ''}
  </div>
</div>
    `.trim();
  }).join('');

  return `
<section class="panel threads-panel">
  <h2><span class="panel-icon">🧵</span> ${title}</h2>
  <div id="threads-view" class="threads-container">
    ${threadsHtml}
  </div>
</section>
  `.trim();
}

/**
 * Render Position Panel
 */
function renderPositionPanel(
  position: PilgrimPosition,
  narrative: AncestralNarrative,
  lang: 'en' | 'zh'
): string {
  const title = lang === 'zh' ? '你在血脉中的位置' : 'Your Place in the Lineage';

  return `
<section class="panel position-panel">
  <h2><span class="panel-icon">📍</span> ${title}</h2>
  <div id="position-view">
    <div class="position-visualization">
      <div class="position-ancestors">
        <span class="position-count">${position.ancestorCount}</span>
        <span class="position-label">${lang === 'zh' ? '祖先' : 'ancestors'}</span>
      </div>
      <div class="position-arrow">←</div>
      <div class="position-self">
        <span class="self-label">${lang === 'zh' ? '你' : 'YOU'}</span>
        <span class="self-gen">${lang === 'zh' ? position.generationLabelZh || position.generationLabel : position.generationLabel}</span>
      </div>
      <div class="position-arrow">→</div>
      <div class="position-descendants">
        <span class="position-count">${position.descendantCount}</span>
        <span class="position-label">${lang === 'zh' ? '后代' : 'descendants'}</span>
      </div>
    </div>

    ${position.inheritedThemes.length > 0 ? `
    <div class="position-section inherited">
      <h4>${lang === 'zh' ? '继承的主题' : 'Inherited Themes'}</h4>
      <div class="theme-list">
        ${position.inheritedThemes.map(t => `<span class="theme-tag inherited">${t}</span>`).join('')}
      </div>
      <p class="narrative-text">${narrative.inheritanceStatement}</p>
    </div>
    ` : ''}

    ${position.brokenPatterns.length > 0 ? `
    <div class="position-section broken">
      <h4>${lang === 'zh' ? '终结的模式' : 'Broken Patterns'}</h4>
      <div class="theme-list">
        ${position.brokenPatterns.map(t => `<span class="theme-tag broken">${t}</span>`).join('')}
      </div>
      <p class="narrative-text">${narrative.liberationStatement}</p>
    </div>
    ` : ''}

    ${position.newPatterns.length > 0 ? `
    <div class="position-section new">
      <h4>${lang === 'zh' ? '开创的模式' : 'New Patterns'}</h4>
      <div class="theme-list">
        ${position.newPatterns.map(t => `<span class="theme-tag new">${t}</span>`).join('')}
      </div>
      <p class="narrative-text">${narrative.foundationStatement}</p>
    </div>
    ` : ''}
  </div>
</section>
  `.trim();
}

/**
 * Render Persona Panel
 */
function renderPersonaPanel(personaLayer: AncestralPersonaLayer, lang: 'en' | 'zh'): string {
  const title = lang === 'zh' ? '祖系之声' : 'Ancestral Voices';

  if (personaLayer.messages.length === 0) {
    return `
<section class="panel persona-panel">
  <h2><span class="panel-icon">🗣️</span> ${title}</h2>
  <div id="persona-view" class="persona-container">
    <blockquote class="chorus-voice">
      ${lang === 'zh' ? personaLayer.chorusVoiceZh || personaLayer.chorusVoice : personaLayer.chorusVoice}
    </blockquote>
  </div>
</section>
    `.trim();
  }

  const messagesHtml = personaLayer.messages.map(msg => {
    const voiceLabel = getVoiceLabelText(msg.voice, lang);
    const intensityClass = msg.intensity;

    return `
<div class="persona-message ${intensityClass}" data-voice="${msg.voice}">
  <div class="message-header">
    <span class="voice-label">${voiceLabel}</span>
    <span class="gen-label">${lang === 'zh' ? msg.generationLabelZh || msg.generationLabel : msg.generationLabel}</span>
  </div>
  <blockquote class="message-text">
    ${lang === 'zh' ? msg.messageZh || msg.message : msg.message}
  </blockquote>
  <div class="message-theme">${msg.theme}</div>
</div>
    `.trim();
  }).join('');

  return `
<section class="panel persona-panel">
  <h2><span class="panel-icon">🗣️</span> ${title}</h2>
  <div id="persona-view" class="persona-container">
    <blockquote class="chorus-voice">
      ${lang === 'zh' ? personaLayer.chorusVoiceZh || personaLayer.chorusVoice : personaLayer.chorusVoice}
    </blockquote>

    <div class="persona-messages">
      ${messagesHtml}
    </div>

    <blockquote class="blessing-voice">
      ${lang === 'zh' ? personaLayer.blessingVoiceZh || personaLayer.blessingVoice : personaLayer.blessingVoice}
    </blockquote>
  </div>
</section>
  `.trim();
}

/**
 * Render Rituals Panel
 */
function renderRitualsPanel(rituals: RitualCollection, lang: 'en' | 'zh'): string {
  const title = lang === 'zh' ? '祖系疗愈仪式' : 'Ancestral Healing Rituals';

  if (rituals.rituals.length === 0) {
    return `
<section class="panel rituals-panel">
  <h2><span class="panel-icon">🕯️</span> ${title}</h2>
  <div id="rituals-view" class="rituals-container">
    <p class="no-data">${lang === 'zh' ? '此时无需特定仪式' : 'No specific rituals needed at this time'}</p>
  </div>
</section>
    `.trim();
  }

  const ritualsHtml = rituals.rituals.map(ritual => {
    const typeLabel = getRitualTypeLabelText(ritual.type, lang);

    return `
<div class="ritual-card" data-ritual-id="${ritual.id}" data-type="${ritual.type}">
  <div class="ritual-header">
    <span class="ritual-type ${ritual.type}">${typeLabel}</span>
    <span class="ritual-theme">${ritual.theme}</span>
  </div>
  <div class="ritual-title">${lang === 'zh' ? ritual.titleZh || ritual.title : ritual.title}</div>
  <button class="ritual-expand-btn" data-ritual-id="${ritual.id}">
    ${lang === 'zh' ? '查看详情' : 'View Details'}
  </button>
</div>
    `.trim();
  }).join('');

  return `
<section class="panel rituals-panel">
  <h2><span class="panel-icon">🕯️</span> ${title}</h2>
  <div id="rituals-view" class="rituals-container">
    <div class="rituals-intro">
      ${lang === 'zh' ? rituals.openingInvocationZh || rituals.openingInvocation : rituals.openingInvocation}
    </div>
    <div class="rituals-list">
      ${ritualsHtml}
    </div>
    <div class="rituals-duration">
      <strong>${lang === 'zh' ? '预计时长：' : 'Estimated duration:'}</strong> ${rituals.totalDuration}
    </div>
  </div>
</section>
  `.trim();
}

/**
 * Render Narrative Panel
 */
function renderNarrativePanel(narrative: AncestralNarrative, lang: 'en' | 'zh'): string {
  const title = lang === 'zh' ? '血脉叙事' : 'Lineage Narrative';

  return `
<section class="panel narrative-panel full-width">
  <h2><span class="panel-icon">📜</span> ${title}</h2>
  <div class="narrative-content">
    <div class="lineage-story">
      <h3>${lang === 'zh' ? '你的血脉故事' : 'Your Lineage Story'}</h3>
      <p>${lang === 'zh' ? narrative.lineageStoryZh || narrative.lineageStory : narrative.lineageStory}</p>
    </div>

    <div class="ancestral-blessing">
      <h3>${lang === 'zh' ? '祖系祝福' : 'Ancestral Blessing'}</h3>
      <blockquote>
        ${lang === 'zh' ? narrative.ancestralBlessingZh || narrative.ancestralBlessing : narrative.ancestralBlessing}
      </blockquote>
    </div>
  </div>
</section>
  `.trim();
}

/**
 * Render Enriched Journey Panel
 */
function renderEnrichedJourneyPanel(journey: JourneyWithGenerations, lang: 'en' | 'zh'): string {
  const title = lang === 'zh' ? '祖系加持的朝圣之旅' : 'Ancestrally-Enriched Pilgrim Journey';

  const stepsWithResonance = journey.steps.filter(s => s.ancestralContext.resonanceLevel !== 'none');

  if (stepsWithResonance.length === 0) {
    return '';
  }

  const stepsHtml = stepsWithResonance.slice(0, 5).map(step => {
    const resonanceClass = step.ancestralContext.resonanceLevel;

    return `
<div class="enriched-step ${resonanceClass}">
  <div class="step-header">
    <span class="step-chamber">${step.chamber || step.ruleCategory || 'Journey'}</span>
    <span class="step-resonance ${resonanceClass}">${getResonanceLabel(resonanceClass, lang)}</span>
  </div>
  <div class="step-content">
    ${step.trial ? `<p class="step-trial">${step.trial}</p>` : ''}
    ${step.ancestralContext.ancestralVoice ? `
    <blockquote class="step-ancestral-voice">
      ${lang === 'zh' ? step.ancestralContext.ancestralVoiceZh || step.ancestralContext.ancestralVoice : step.ancestralContext.ancestralVoice}
    </blockquote>
    ` : ''}
  </div>
  <div class="step-themes">
    ${step.ancestralContext.inherited.map(t => `<span class="theme-tag inherited">${t}</span>`).join('')}
    ${step.ancestralContext.broken.map(t => `<span class="theme-tag broken">${t}</span>`).join('')}
    ${step.ancestralContext.new.map(t => `<span class="theme-tag new">${t}</span>`).join('')}
  </div>
</div>
    `.trim();
  }).join('');

  return `
<section class="panel enriched-journey-panel full-width">
  <h2><span class="panel-icon">🚶</span> ${title}</h2>
  <div class="enriched-steps">
    ${stepsHtml}
  </div>
  ${stepsWithResonance.length > 5 ? `
  <p class="more-steps">${lang === 'zh'
    ? `还有 ${stepsWithResonance.length - 5} 个步骤有祖系共鸣...`
    : `${stepsWithResonance.length - 5} more steps with ancestral resonance...`}</p>
  ` : ''}
</section>
  `.trim();
}

// ==================== HELPER FUNCTIONS ====================

function getGenerationClass(genIndex: number, selfIndex: number): string {
  if (genIndex === selfIndex) return 'gen-self';
  if (genIndex < selfIndex - 1) return 'gen-ancestor';
  if (genIndex === selfIndex - 1) return 'gen-parent';
  if (genIndex === selfIndex + 1) return 'gen-child';
  return 'gen-descendant';
}

function getVoiceLabelText(voice: string, lang: 'en' | 'zh'): string {
  const labels: Record<string, { en: string; zh: string }> = {
    chorus: { en: '👥 Ancestor Chorus', zh: '👥 祖系合唱' },
    echo: { en: '📣 Generational Echo', zh: '📣 世代回响' },
    thread: { en: '🧵 Ancestral Thread', zh: '🧵 血脉丝线' },
    witness: { en: '👁️ Ancestral Witness', zh: '👁️ 见证者之声' }
  };
  return labels[voice]?.[lang] || voice;
}

function getRitualTypeLabelText(type: string, lang: 'en' | 'zh'): string {
  const labels: Record<string, { en: string; zh: string }> = {
    healing: { en: 'Healing', zh: '疗愈' },
    release: { en: 'Release', zh: '释放' },
    integration: { en: 'Integration', zh: '整合' },
    blessing: { en: 'Blessing', zh: '祝福' },
    acknowledgment: { en: 'Acknowledgment', zh: '感恩' },
    activation: { en: 'Activation', zh: '激活' }
  };
  return labels[type]?.[lang] || type;
}

function getResonanceLabel(level: string, lang: 'en' | 'zh'): string {
  const labels: Record<string, { en: string; zh: string }> = {
    deep: { en: 'Deep', zh: '深层' },
    moderate: { en: 'Moderate', zh: '中等' },
    faint: { en: 'Faint', zh: '轻微' },
    none: { en: 'None', zh: '无' }
  };
  return labels[level]?.[lang] || level;
}

// ==================== STYLES ====================

export function getGenerationalStoryDashboardStyles(theme: 'light' | 'dark' = 'light'): string {
  const isDark = theme === 'dark';

  return `
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background: ${isDark ? '#0f0f1a' : '#f4f5f7'};
  color: ${isDark ? '#e0e0e0' : '#333'};
  line-height: 1.6;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

/* Header */
.dashboard-header {
  text-align: center;
  margin-bottom: 32px;
  padding: 24px;
  background: ${isDark ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  border-radius: 16px;
  color: #fff;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 20px;
}

.header-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
}

.stat-label {
  font-size: 0.85rem;
  opacity: 0.8;
}

/* Grid Layout */
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 1000px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.dashboard-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dashboard-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Panels */
.panel {
  background: ${isDark ? '#1a1a2e' : '#fff'};
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,${isDark ? '0.3' : '0.08'});
}

.panel.full-width {
  grid-column: 1 / -1;
}

.panel h2 {
  font-size: 1.2rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${isDark ? '#fff' : '#2c3e50'};
  border-bottom: 2px solid ${isDark ? '#333' : '#eee'};
  padding-bottom: 12px;
}

.panel-icon {
  font-size: 1.3rem;
}

/* Ladder Panel */
.ladder-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ladder-rung {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  position: relative;
  transition: all 0.2s;
}

.ladder-rung:hover {
  transform: translateX(4px);
}

.ladder-rung.gen-ancestor { background: rgba(144, 144, 255, 0.1); border-left: 4px solid #9090ff; }
.ladder-rung.gen-parent { background: rgba(96, 208, 96, 0.1); border-left: 4px solid #60d060; }
.ladder-rung.gen-self { background: rgba(255, 176, 32, 0.15); border-left: 4px solid #ffb020; }
.ladder-rung.gen-child { background: rgba(255, 128, 128, 0.1); border-left: 4px solid #ff8080; }
.ladder-rung.gen-descendant { background: rgba(255, 160, 160, 0.1); border-left: 4px solid #ffa0a0; }

.ladder-rung.is-self {
  box-shadow: 0 0 0 2px #ffb020;
}

.rung-index {
  font-weight: bold;
  font-size: 1.1rem;
  width: 32px;
  text-align: center;
  color: ${isDark ? '#888' : '#666'};
}

.rung-content {
  flex: 1;
}

.rung-label {
  font-weight: 600;
  margin-bottom: 6px;
}

.rung-members {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.member-card {
  background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.member-card:hover {
  background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'};
}

.member-date {
  font-size: 0.75rem;
  color: ${isDark ? '#666' : '#999'};
  margin-left: 8px;
}

.self-marker {
  position: absolute;
  right: 16px;
  font-weight: bold;
  color: #ffb020;
  font-size: 1rem;
}

/* Threads Panel */
.threads-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.thread-card {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
  transition: all 0.2s;
  cursor: pointer;
}

.thread-card:hover {
  transform: translateX(4px);
}

.thread-card.strong { border-left: 4px solid #9090ff; }
.thread-card.moderate { border-left: 4px solid #60d060; }
.thread-card.faint { border-left: 4px solid #888; }

.thread-visual {
  width: 4px;
  background: linear-gradient(180deg, #9090ff, #ffb020, #ff8080);
  border-radius: 2px;
}

.thread-theme {
  font-weight: 600;
  text-transform: capitalize;
  margin-bottom: 4px;
}

.thread-meta {
  font-size: 0.8rem;
  color: ${isDark ? '#888' : '#666'};
}

.thread-strength {
  margin-right: 12px;
}

.thread-desc {
  font-size: 0.85rem;
  margin-top: 6px;
  color: ${isDark ? '#aaa' : '#555'};
}

/* Position Panel */
.position-visualization {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 20px;
  margin-bottom: 16px;
  background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
  border-radius: 12px;
}

.position-ancestors, .position-descendants {
  text-align: center;
}

.position-count {
  display: block;
  font-size: 1.8rem;
  font-weight: bold;
}

.position-label {
  font-size: 0.8rem;
  color: ${isDark ? '#888' : '#666'};
}

.position-self {
  text-align: center;
  padding: 16px 24px;
  background: #ffb020;
  border-radius: 12px;
  color: #fff;
}

.self-label {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
}

.self-gen {
  font-size: 0.8rem;
  opacity: 0.9;
}

.position-arrow {
  font-size: 1.5rem;
  color: ${isDark ? '#444' : '#ccc'};
}

.position-section {
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 12px;
}

.position-section.inherited { background: rgba(144, 144, 255, 0.08); }
.position-section.broken { background: rgba(255, 100, 100, 0.08); }
.position-section.new { background: rgba(96, 208, 96, 0.08); }

.position-section h4 {
  font-size: 0.9rem;
  margin-bottom: 8px;
  color: ${isDark ? '#ccc' : '#555'};
}

.theme-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.theme-tag {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  text-transform: capitalize;
}

.theme-tag.inherited { background: rgba(144, 144, 255, 0.2); color: ${isDark ? '#aaf' : '#55a'}; }
.theme-tag.broken { background: rgba(255, 100, 100, 0.2); color: ${isDark ? '#faa' : '#a55'}; }
.theme-tag.new { background: rgba(96, 208, 96, 0.2); color: ${isDark ? '#afa' : '#5a5'}; }

.narrative-text {
  font-size: 0.85rem;
  font-style: italic;
  color: ${isDark ? '#aaa' : '#666'};
}

/* Persona Panel */
.persona-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chorus-voice, .blessing-voice {
  padding: 16px 20px;
  background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
  border-left: 4px solid #9090ff;
  border-radius: 0 10px 10px 0;
  font-style: italic;
  color: ${isDark ? '#ccc' : '#555'};
}

.blessing-voice {
  border-left-color: #ffb020;
}

.persona-messages {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.persona-message {
  padding: 12px 16px;
  border-radius: 10px;
  background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
}

.persona-message.whisper { opacity: 0.7; }
.persona-message.speak { }
.persona-message.resonate { border-left: 3px solid #60d060; }
.persona-message.thunder { border-left: 3px solid #ffb020; box-shadow: 0 0 10px rgba(255,176,32,0.2); }

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.8rem;
}

.voice-label {
  font-weight: 600;
  color: ${isDark ? '#aaa' : '#666'};
}

.gen-label {
  color: ${isDark ? '#666' : '#999'};
}

.message-text {
  margin: 0;
  padding: 0;
  border: none;
  font-style: italic;
}

.message-theme {
  font-size: 0.75rem;
  margin-top: 8px;
  color: ${isDark ? '#666' : '#999'};
  text-transform: capitalize;
}

/* Rituals Panel */
.rituals-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rituals-intro {
  font-size: 0.9rem;
  padding: 12px;
  background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
  border-radius: 10px;
  font-style: italic;
}

.rituals-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ritual-card {
  padding: 12px;
  border-radius: 10px;
  background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
  transition: all 0.2s;
}

.ritual-card:hover {
  transform: translateX(4px);
}

.ritual-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.ritual-type {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 8px;
  text-transform: uppercase;
  font-weight: 600;
}

.ritual-type.release { background: rgba(255, 100, 100, 0.2); color: #f66; }
.ritual-type.blessing { background: rgba(255, 200, 100, 0.2); color: #fa0; }
.ritual-type.integration { background: rgba(144, 144, 255, 0.2); color: #99f; }
.ritual-type.acknowledgment { background: rgba(96, 208, 96, 0.2); color: #6c6; }

.ritual-theme {
  font-size: 0.8rem;
  color: ${isDark ? '#888' : '#666'};
  text-transform: capitalize;
}

.ritual-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.ritual-expand-btn {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
  color: ${isDark ? '#aaa' : '#666'};
  cursor: pointer;
  transition: all 0.2s;
}

.ritual-expand-btn:hover {
  background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'};
}

.rituals-duration {
  font-size: 0.85rem;
  padding: 10px;
  text-align: center;
  background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
  border-radius: 8px;
}

/* Narrative Panel */
.narrative-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

@media (max-width: 800px) {
  .narrative-content {
    grid-template-columns: 1fr;
  }
}

.lineage-story h3, .ancestral-blessing h3 {
  font-size: 1rem;
  margin-bottom: 10px;
  color: ${isDark ? '#ccc' : '#444'};
}

.lineage-story p {
  line-height: 1.8;
}

.ancestral-blessing blockquote {
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(255,176,32,0.1), rgba(144,144,255,0.1));
  border-radius: 12px;
  border-left: 4px solid #ffb020;
  font-style: italic;
}

/* Enriched Journey Panel */
.enriched-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.enriched-step {
  padding: 16px;
  border-radius: 12px;
  background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
}

.enriched-step.deep { border-left: 4px solid #9090ff; }
.enriched-step.moderate { border-left: 4px solid #60d060; }
.enriched-step.faint { border-left: 4px solid #888; }

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.step-chamber {
  font-weight: 600;
  text-transform: capitalize;
}

.step-resonance {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 8px;
}

.step-resonance.deep { background: rgba(144, 144, 255, 0.2); color: #99f; }
.step-resonance.moderate { background: rgba(96, 208, 96, 0.2); color: #6c6; }
.step-resonance.faint { background: rgba(128, 128, 128, 0.2); color: #888; }

.step-trial {
  margin-bottom: 12px;
}

.step-ancestral-voice {
  padding: 12px 16px;
  background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
  border-left: 3px solid #ffb020;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  margin-bottom: 12px;
}

.step-themes {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.more-steps {
  text-align: center;
  font-size: 0.9rem;
  color: ${isDark ? '#666' : '#999'};
  font-style: italic;
}

.no-data {
  font-style: italic;
  color: ${isDark ? '#666' : '#999'};
  text-align: center;
  padding: 20px;
}
  `.trim();
}

// ==================== SCRIPT ====================

export function getGenerationalStoryDashboardScript(): string {
  return `
document.addEventListener('DOMContentLoaded', function() {
  // Ritual expand buttons
  document.querySelectorAll('.ritual-expand-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const ritualId = this.dataset.ritualId;
      showRitualDetails(ritualId);
    });
  });

  // Member card clicks
  document.querySelectorAll('.member-card').forEach(card => {
    card.addEventListener('click', function() {
      const memberId = this.dataset.memberId;
      highlightMember(memberId);
    });
  });

  // Thread card hovers
  document.querySelectorAll('.thread-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      const threadId = this.dataset.threadId;
      highlightThread(threadId);
    });
    card.addEventListener('mouseleave', unhighlightAll);
  });
});

function showRitualDetails(ritualId) {
  // In a full implementation, this would show a modal with ritual steps
  console.log('Show ritual:', ritualId);
  alert('Ritual details would appear in a modal. ID: ' + ritualId);
}

function highlightMember(memberId) {
  // Highlight the member across all panels
  document.querySelectorAll('.member-card').forEach(card => {
    card.style.opacity = card.dataset.memberId === memberId ? '1' : '0.5';
  });
  setTimeout(unhighlightAll, 2000);
}

function highlightThread(threadId) {
  document.querySelectorAll('.thread-card').forEach(card => {
    card.style.opacity = card.dataset.threadId === threadId ? '1' : '0.5';
  });
}

function unhighlightAll() {
  document.querySelectorAll('.member-card, .thread-card').forEach(el => {
    el.style.opacity = '1';
  });
}
  `.trim();
}

// ==================== EXPORTS ====================

export {
  renderGenerationalStoryDashboardHtml,
  getGenerationalStoryDashboardStyles,
  getGenerationalStoryDashboardScript,
  type GenerationalStoryDashboardData
};
