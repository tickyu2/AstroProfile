/**
 * ============================================
 * ANCESTRAL TEMPLE UI TEMPLATE
 * The unified sacred chamber of the Cathedral
 *
 * Gathers every ancestral layer into one interface:
 * - Generational Ladder
 * - Generational Constellation
 * - Ancestral Threads
 * - Pilgrim Position
 * - Ancestral Persona Layer
 * - Ritual Timing Engine
 * - Healing Rituals
 * - Mythos Archetypes
 * - Generational Story Export
 * - Pilgrim-Ancestor Dialogue
 *
 * This is the cathedral hall where all systems converge.
 * ============================================
 */

import { GenerationalLadder, GenerationalThread } from '../generationalLadder';
import { PilgrimPosition, AncestralNarrative } from '../journeyWithGenerations';
import { AncestralPersonaLayer } from '../ancestralPersona';
import { RitualCollection } from '../ancestralRitual';
import { RitualCalendar } from '../ritualTiming';
import { MythosProfile } from '../mythosLayer';
import { HealingPath } from '../healingPath';
import { AncestralDialogue } from '../pilgrimAncestorDialogue';

// ==================== DATA MODEL ====================

export interface AncestralTempleData {
  pilgrimName?: string;
  ladder: GenerationalLadder;
  threads: GenerationalThread[];
  position: PilgrimPosition;
  narrative: AncestralNarrative;
  personaLayer?: AncestralPersonaLayer;
  rituals?: RitualCollection;
  ritualCalendar?: RitualCalendar;
  mythosProfile?: MythosProfile;
  healingPath?: HealingPath;
  dialogue?: AncestralDialogue;
}

// ==================== RENDER FUNCTIONS ====================

/**
 * Render complete Ancestral Temple HTML page
 */
export function renderAncestralTempleHtml(
  data: AncestralTempleData,
  options: { lang?: 'en' | 'zh'; theme?: 'light' | 'dark' } = {}
): string {
  const { lang = 'en', theme = 'light' } = options;

  return `
<!DOCTYPE html>
<html lang="${lang === 'zh' ? 'zh-CN' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lang === 'zh' ? '🕍 祖系殿堂' : '🕍 Ancestral Temple'}</title>
  <style>
    ${getAncestralTempleStyles(theme)}
  </style>
</head>
<body class="theme-${theme}">
  <div class="ancestral-temple">

    <header class="temple-header">
      <h1>${lang === 'zh' ? '🕍 祖系殿堂' : '🕍 Ancestral Temple'}</h1>
      <p class="subtitle">${data.pilgrimName
        ? (lang === 'zh' ? `${data.pilgrimName}的血脉圣殿` : `${data.pilgrimName}'s Sacred Lineage`)
        : (lang === 'zh' ? '你血脉的活档案' : 'The living archive of your lineage')}</p>
    </header>

    <nav class="temple-nav">
      <a href="#temple-ladder" class="nav-item">${lang === 'zh' ? '阶梯' : 'Ladder'}</a>
      <a href="#temple-threads" class="nav-item">${lang === 'zh' ? '丝线' : 'Threads'}</a>
      <a href="#temple-position" class="nav-item">${lang === 'zh' ? '位置' : 'Position'}</a>
      ${data.personaLayer ? `<a href="#temple-dialogue" class="nav-item">${lang === 'zh' ? '对话' : 'Dialogue'}</a>` : ''}
      ${data.rituals ? `<a href="#temple-rituals" class="nav-item">${lang === 'zh' ? '仪式' : 'Rituals'}</a>` : ''}
      ${data.ritualCalendar ? `<a href="#temple-timing" class="nav-item">${lang === 'zh' ? '时机' : 'Timing'}</a>` : ''}
      ${data.mythosProfile ? `<a href="#temple-mythos" class="nav-item">${lang === 'zh' ? '原型' : 'Mythos'}</a>` : ''}
      <a href="#temple-export" class="nav-item">${lang === 'zh' ? '导出' : 'Export'}</a>
    </nav>

    <section class="temple-grid">

      <div class="panel" id="temple-ladder">
        <h2><span class="panel-icon">🪜</span> ${lang === 'zh' ? '世代阶梯' : 'Generational Ladder'}</h2>
        <div id="ladder-view">
          ${renderLadderSection(data.ladder, data.position, lang)}
        </div>
      </div>

      <div class="panel" id="temple-constellation">
        <h2><span class="panel-icon">✨</span> ${lang === 'zh' ? '世代星座' : 'Generational Constellation'}</h2>
        <div id="constellation-view" class="constellation-placeholder">
          <p>${lang === 'zh' ? '星座可视化' : 'Constellation visualization'}</p>
          <small>${data.ladder.generations.length} ${lang === 'zh' ? '代' : 'generations'}</small>
        </div>
      </div>

      <div class="panel" id="temple-threads">
        <h2><span class="panel-icon">🧵</span> ${lang === 'zh' ? '血脉丝线' : 'Ancestral Threads'}</h2>
        <div id="threads-view">
          ${renderThreadsSection(data.threads, lang)}
        </div>
      </div>

      <div class="panel" id="temple-position">
        <h2><span class="panel-icon">📍</span> ${lang === 'zh' ? '血脉位置' : 'Your Place in the Lineage'}</h2>
        <div id="position-view">
          ${renderPositionSection(data.position, data.narrative, lang)}
        </div>
      </div>

      ${data.personaLayer ? `
      <div class="panel" id="temple-dialogue">
        <h2><span class="panel-icon">🗣️</span> ${lang === 'zh' ? '祖先对话' : 'Pilgrim–Ancestor Dialogue'}</h2>
        <div id="dialogue-view">
          ${renderDialogueSection(data.personaLayer, data.dialogue, lang)}
        </div>
      </div>
      ` : ''}

      ${data.rituals ? `
      <div class="panel" id="temple-rituals">
        <h2><span class="panel-icon">🕯️</span> ${lang === 'zh' ? '疗愈仪式' : 'Healing Rituals'}</h2>
        <div id="rituals-view">
          ${renderRitualsSection(data.rituals, lang)}
        </div>
      </div>
      ` : ''}

      ${data.ritualCalendar ? `
      <div class="panel" id="temple-timing">
        <h2><span class="panel-icon">📅</span> ${lang === 'zh' ? '仪式时机' : 'Ritual Timing Windows'}</h2>
        <div id="timing-view">
          ${renderTimingSection(data.ritualCalendar, lang)}
        </div>
      </div>
      ` : ''}

      ${data.mythosProfile ? `
      <div class="panel" id="temple-mythos">
        <h2><span class="panel-icon">🏛️</span> ${lang === 'zh' ? '神话原型' : 'Mythos Archetypes'}</h2>
        <div id="mythos-view">
          ${renderMythosSection(data.mythosProfile, lang)}
        </div>
      </div>
      ` : ''}

      <div class="panel" id="temple-export">
        <h2><span class="panel-icon">📜</span> ${lang === 'zh' ? '故事导出' : 'Generational Story Export'}</h2>
        <div id="export-view">
          <p>${lang === 'zh' ? '将你的血脉故事导出为文档' : 'Export your lineage story as a document'}</p>
          <div class="export-buttons">
            <button class="export-btn" data-format="markdown">${lang === 'zh' ? '导出 Markdown' : 'Export Markdown'}</button>
            <button class="export-btn" data-format="html">${lang === 'zh' ? '导出 HTML' : 'Export HTML'}</button>
            <button class="export-btn" data-format="json">${lang === 'zh' ? '导出 JSON' : 'Export JSON'}</button>
          </div>
        </div>
      </div>

    </section>

    <footer class="temple-footer">
      <p>${lang === 'zh' ? '祖系殿堂 · Cathedral 系统' : 'Ancestral Temple · Cathedral System'}</p>
    </footer>

  </div>

  <script>
    ${getAncestralTempleScript()}
  </script>
</body>
</html>
  `.trim();
}

// ==================== SECTION RENDERERS ====================

function renderLadderSection(ladder: GenerationalLadder, position: PilgrimPosition, lang: 'en' | 'zh'): string {
  return ladder.generations
    .sort((a, b) => a.generationIndex - b.generationIndex)
    .map(gen => {
      const isSelf = gen.generationIndex === position.generationIndex;
      const label = lang === 'zh' ? gen.labelZh || gen.label : gen.label;

      return `
<div class="ladder-rung ${isSelf ? 'is-self' : ''}" data-gen-index="${gen.generationIndex}">
  <span class="rung-index">${gen.generationIndex > 0 ? '+' : ''}${gen.generationIndex}</span>
  <span class="rung-label">${label}</span>
  ${isSelf ? `<span class="self-marker">${lang === 'zh' ? '← 你' : '← YOU'}</span>` : ''}
  <span class="rung-count">${gen.members.length} ${lang === 'zh' ? '人' : 'members'}</span>
</div>
      `.trim();
    }).join('');
}

function renderThreadsSection(threads: GenerationalThread[], lang: 'en' | 'zh'): string {
  if (threads.length === 0) {
    return `<p class="no-data">${lang === 'zh' ? '尚未检测到跨代丝线' : 'No cross-generational threads detected'}</p>`;
  }

  return threads.map(t => {
    const strengthClass = t.strength >= 0.7 ? 'strong' : t.strength >= 0.4 ? 'moderate' : 'faint';

    return `
<div class="thread-item ${strengthClass}" data-thread-id="${t.id}">
  <span class="thread-theme">${t.theme}</span>
  <span class="thread-strength">${(t.strength * 100).toFixed(0)}%</span>
  <span class="thread-gens">${t.generations.length} ${lang === 'zh' ? '代' : 'gen'}</span>
</div>
    `.trim();
  }).join('');
}

function renderPositionSection(position: PilgrimPosition, narrative: AncestralNarrative, lang: 'en' | 'zh'): string {
  return `
<div class="position-visual">
  <span class="ancestors-count">${position.ancestorCount}<br><small>${lang === 'zh' ? '祖先' : 'ancestors'}</small></span>
  <span class="arrow">←</span>
  <span class="self-badge">${lang === 'zh' ? '你' : 'YOU'}</span>
  <span class="arrow">→</span>
  <span class="descendants-count">${position.descendantCount}<br><small>${lang === 'zh' ? '后代' : 'descendants'}</small></span>
</div>

<div class="position-themes">
  ${position.inheritedThemes.length > 0 ? `
  <div class="theme-group inherited">
    <strong>${lang === 'zh' ? '继承：' : 'Inherited:'}</strong>
    ${position.inheritedThemes.map(t => `<span class="theme-tag">${t}</span>`).join('')}
  </div>
  ` : ''}
  ${position.brokenPatterns.length > 0 ? `
  <div class="theme-group broken">
    <strong>${lang === 'zh' ? '终结：' : 'Broken:'}</strong>
    ${position.brokenPatterns.map(t => `<span class="theme-tag">${t}</span>`).join('')}
  </div>
  ` : ''}
  ${position.newPatterns.length > 0 ? `
  <div class="theme-group new">
    <strong>${lang === 'zh' ? '开创：' : 'New:'}</strong>
    ${position.newPatterns.map(t => `<span class="theme-tag">${t}</span>`).join('')}
  </div>
  ` : ''}
</div>

<blockquote class="blessing">
  ${lang === 'zh' ? narrative.ancestralBlessingZh || narrative.ancestralBlessing : narrative.ancestralBlessing}
</blockquote>
  `.trim();
}

function renderDialogueSection(personaLayer: AncestralPersonaLayer, dialogue: AncestralDialogue | undefined, lang: 'en' | 'zh'): string {
  const messages = personaLayer.messages.slice(0, 3);

  return `
<div class="dialogue-preview">
  ${messages.map(msg => `
  <div class="dialogue-turn">
    <span class="speaker">${lang === 'zh' ? '【祖先】' : '[Ancestor]'}</span>
    <p>${lang === 'zh' ? msg.messageZh || msg.message : msg.message}</p>
  </div>
  `).join('')}

  <div class="dialogue-turn pilgrim">
    <span class="speaker">${lang === 'zh' ? '【行者】' : '[Pilgrim]'}</span>
    <p>${lang === 'zh' ? '我在聆听。我愿意接收和释放。' : 'I am listening. I am willing to receive and release.'}</p>
  </div>
</div>

<button class="open-dialogue-btn">${lang === 'zh' ? '开始完整对话' : 'Begin Full Dialogue'}</button>
  `.trim();
}

function renderRitualsSection(rituals: RitualCollection, lang: 'en' | 'zh'): string {
  return `
<div class="rituals-summary">
  <p>${rituals.rituals.length} ${lang === 'zh' ? '个仪式可用' : 'rituals available'}</p>
  <p class="duration">${lang === 'zh' ? '总时长：' : 'Total duration:'} ${rituals.totalDuration}</p>
</div>

<div class="rituals-list">
  ${rituals.rituals.slice(0, 3).map(r => `
  <div class="ritual-preview">
    <span class="ritual-type ${r.type}">${r.type}</span>
    <span class="ritual-theme">${r.theme}</span>
  </div>
  `).join('')}
</div>

<button class="begin-rituals-btn">${lang === 'zh' ? '开始仪式' : 'Begin Rituals'}</button>
  `.trim();
}

function renderTimingSection(calendar: RitualCalendar, lang: 'en' | 'zh'): string {
  const activeCount = calendar.activeWindows.length;
  const upcomingCount = calendar.upcomingWindows.length;

  return `
<div class="timing-summary">
  <div class="timing-stat">
    <span class="stat-value">${activeCount}</span>
    <span class="stat-label">${lang === 'zh' ? '当前窗口' : 'Active Windows'}</span>
  </div>
  <div class="timing-stat">
    <span class="stat-value">${upcomingCount}</span>
    <span class="stat-label">${lang === 'zh' ? '即将到来' : 'Upcoming'}</span>
  </div>
</div>

${calendar.nextCriticalWindow ? `
<div class="next-critical">
  <strong>${lang === 'zh' ? '下一个关键窗口：' : 'Next Critical Window:'}</strong>
  <p>${calendar.nextCriticalWindow.theme} (${lang === 'zh' ? '年龄' : 'Age'} ${calendar.nextCriticalWindow.startAge})</p>
</div>
` : ''}

<p class="timing-narrative">${lang === 'zh' ? calendar.summary.calendarNarrativeZh || calendar.summary.calendarNarrative : calendar.summary.calendarNarrative}</p>
  `.trim();
}

function renderMythosSection(profile: MythosProfile, lang: 'en' | 'zh'): string {
  if (!profile.primaryArchetype) {
    return `<p class="no-data">${lang === 'zh' ? '尚未检测到原型' : 'No archetypes detected'}</p>`;
  }

  return `
<div class="primary-archetype">
  <h3>${lang === 'zh' ? profile.primaryArchetype.nameZh : profile.primaryArchetype.name}</h3>
  <p class="archetype-themes">${profile.primaryArchetype.themes.slice(0, 3).join(', ')}</p>
</div>

<blockquote class="archetype-voice">
  ${lang === 'zh' ? profile.primaryArchetype.personaVoiceZh : profile.primaryArchetype.personaVoice}
</blockquote>

${profile.secondaryArchetypes.length > 0 ? `
<div class="secondary-archetypes">
  <strong>${lang === 'zh' ? '次要原型：' : 'Secondary:'}</strong>
  ${profile.secondaryArchetypes.map(a => `<span class="archetype-tag">${lang === 'zh' ? a.nameZh : a.name}</span>`).join('')}
</div>
` : ''}

<p class="mythos-narrative">${lang === 'zh' ? profile.mythosNarrativeZh || profile.mythosNarrative : profile.mythosNarrative}</p>
  `.trim();
}

// ==================== STYLES ====================

export function getAncestralTempleStyles(theme: 'light' | 'dark' = 'light'): string {
  const isDark = theme === 'dark';

  return `
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: ${isDark ? 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)' : 'linear-gradient(135deg, #f4f5f7 0%, #e8e9eb 100%)'};
  color: ${isDark ? '#e0e0e0' : '#333'};
  line-height: 1.6;
  min-height: 100vh;
}

.ancestral-temple {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.temple-header {
  text-align: center;
  padding: 40px 20px;
  background: ${isDark ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  border-radius: 20px;
  color: #fff;
  margin-bottom: 24px;
}

.temple-header h1 { font-size: 2.5rem; margin-bottom: 8px; }
.subtitle { font-size: 1.1rem; opacity: 0.9; }

.temple-nav {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.nav-item {
  padding: 8px 16px;
  border-radius: 20px;
  background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
  color: ${isDark ? '#ccc' : '#666'};
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.nav-item:hover {
  background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'};
  color: ${isDark ? '#fff' : '#333'};
}

.temple-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.panel {
  background: ${isDark ? 'rgba(255,255,255,0.03)' : '#fff'};
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,${isDark ? '0.3' : '0.08'});
}

.panel h2 {
  font-size: 1.1rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${isDark ? '#fff' : '#2c3e50'};
  border-bottom: 2px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#eee'};
  padding-bottom: 12px;
}

.panel-icon { font-size: 1.2rem; }

.ladder-rung {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'};
  transition: all 0.2s;
}

.ladder-rung:hover { transform: translateX(4px); }
.ladder-rung.is-self { background: rgba(255,176,32,0.15); border-left: 4px solid #ffb020; }
.rung-index { font-weight: bold; color: ${isDark ? '#888' : '#999'}; width: 30px; }
.rung-label { flex: 1; font-weight: 500; }
.self-marker { color: #ffb020; font-weight: bold; }
.rung-count { font-size: 0.8rem; color: ${isDark ? '#666' : '#999'}; }

.thread-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
  border-left: 4px solid transparent;
}

.thread-item.strong { border-left-color: #9090ff; background: rgba(144,144,255,0.1); }
.thread-item.moderate { border-left-color: #60d060; background: rgba(96,208,96,0.1); }
.thread-item.faint { border-left-color: #888; }

.thread-theme { flex: 1; font-weight: 500; text-transform: capitalize; }
.thread-strength { font-size: 0.8rem; background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}; padding: 2px 8px; border-radius: 10px; }
.thread-gens { font-size: 0.8rem; color: ${isDark ? '#888' : '#999'}; }

.position-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 20px;
  margin-bottom: 16px;
  text-align: center;
}

.ancestors-count, .descendants-count { font-size: 1.5rem; font-weight: bold; }
.ancestors-count small, .descendants-count small { font-size: 0.7rem; font-weight: normal; }
.arrow { font-size: 1.2rem; color: ${isDark ? '#555' : '#ccc'}; }
.self-badge { background: #ffb020; color: #fff; padding: 10px 20px; border-radius: 10px; font-weight: bold; }

.position-themes { margin-bottom: 16px; }
.theme-group { margin-bottom: 8px; }
.theme-group strong { font-size: 0.85rem; }
.theme-tag { display: inline-block; padding: 2px 8px; margin: 2px; font-size: 0.8rem; background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}; border-radius: 10px; }

.blessing {
  padding: 16px;
  background: ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'};
  border-left: 4px solid #ffb020;
  border-radius: 0 10px 10px 0;
  font-style: italic;
}

.dialogue-turn { margin-bottom: 12px; }
.dialogue-turn .speaker { font-weight: 600; color: ${isDark ? '#9090ff' : '#667eea'}; }
.dialogue-turn.pilgrim .speaker { color: #ffb020; }
.dialogue-turn p { margin-top: 4px; }

.open-dialogue-btn, .begin-rituals-btn, .export-btn {
  display: inline-block;
  padding: 10px 20px;
  margin-top: 12px;
  border: none;
  border-radius: 8px;
  background: ${isDark ? 'rgba(255,255,255,0.1)' : '#667eea'};
  color: ${isDark ? '#fff' : '#fff'};
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.open-dialogue-btn:hover, .begin-rituals-btn:hover, .export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.export-buttons { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
.export-btn { background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}; color: ${isDark ? '#ccc' : '#666'}; }

.timing-summary { display: flex; gap: 20px; margin-bottom: 16px; }
.timing-stat { text-align: center; }
.stat-value { display: block; font-size: 1.8rem; font-weight: bold; }
.stat-label { font-size: 0.8rem; color: ${isDark ? '#888' : '#999'}; }

.next-critical { padding: 12px; background: rgba(255,100,100,0.1); border-radius: 8px; margin-bottom: 12px; }
.timing-narrative { font-style: italic; color: ${isDark ? '#aaa' : '#666'}; }

.primary-archetype h3 { font-size: 1.2rem; margin-bottom: 4px; }
.archetype-themes { font-size: 0.85rem; color: ${isDark ? '#888' : '#666'}; margin-bottom: 12px; }
.archetype-voice { padding: 12px; background: ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}; border-left: 4px solid #9090ff; border-radius: 0 8px 8px 0; font-style: italic; margin-bottom: 12px; }
.archetype-tag { display: inline-block; padding: 2px 8px; margin: 2px; font-size: 0.8rem; background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}; border-radius: 10px; }
.mythos-narrative { font-style: italic; color: ${isDark ? '#aaa' : '#666'}; margin-top: 12px; }

.ritual-preview { display: flex; gap: 8px; padding: 8px; margin-bottom: 6px; }
.ritual-type { font-size: 0.75rem; padding: 2px 8px; border-radius: 8px; text-transform: uppercase; font-weight: 600; }
.ritual-type.release { background: rgba(255,100,100,0.2); color: #f66; }
.ritual-type.blessing { background: rgba(255,200,100,0.2); color: #fa0; }
.ritual-type.integration { background: rgba(144,144,255,0.2); color: #99f; }
.ritual-theme { flex: 1; text-transform: capitalize; }

.no-data { font-style: italic; color: ${isDark ? '#666' : '#999'}; text-align: center; padding: 20px; }

.temple-footer { text-align: center; margin-top: 40px; padding: 20px; font-size: 0.85rem; color: ${isDark ? '#666' : '#999'}; }

.constellation-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'};
  border-radius: 12px;
  color: ${isDark ? '#666' : '#999'};
}
  `.trim();
}

// ==================== SCRIPT ====================

export function getAncestralTempleScript(): string {
  return `
document.addEventListener('DOMContentLoaded', function() {
  // Export buttons
  document.querySelectorAll('.export-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const format = this.dataset.format;
      alert('Export to ' + format + ' would trigger here.');
    });
  });

  // Dialogue button
  const dialogueBtn = document.querySelector('.open-dialogue-btn');
  if (dialogueBtn) {
    dialogueBtn.addEventListener('click', function() {
      alert('Full dialogue modal would open here.');
    });
  }

  // Rituals button
  const ritualsBtn = document.querySelector('.begin-rituals-btn');
  if (ritualsBtn) {
    ritualsBtn.addEventListener('click', function() {
      alert('Ritual journey would begin here.');
    });
  }

  // Panel interactions
  document.querySelectorAll('.ladder-rung, .thread-item').forEach(item => {
    item.addEventListener('click', function() {
      // Show details
      console.log('Item clicked:', this);
    });
  });
});
  `.trim();
}

// ==================== EXPORTS ====================

export {
  renderAncestralTempleHtml,
  getAncestralTempleStyles,
  getAncestralTempleScript,
  type AncestralTempleData
};
