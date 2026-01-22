/**
 * ============================================
 * MYTHOS CODEX UI TEMPLATE
 * Scripture-style UI for displaying ancestral archetypes
 *
 * This template renders the Mythos Codex as a
 * beautiful, scripture-like interface.
 *
 * Features:
 * - Grid of archetype cards
 * - Detailed page views
 * - Shadow/gift duality display
 * - Luna's archetypal voice
 * - Interactive exploration
 * ============================================
 */

import { MythosCodex, MythosCodexPage } from '../mythosCodex';
import { AncestralArchetype } from '../mythosLayer';

// ==================== DATA MODEL ====================

export interface MythosCodexUIData {
  codex: MythosCodex;
  selectedPageId?: string;
  pilgrimArchetypes?: string[]; // Archetypes assigned to the pilgrim
  lang: 'en' | 'zh';
}

// ==================== HTML RENDERER ====================

/**
 * Render full Mythos Codex UI as HTML
 */
export function renderMythosCodexHtml(data: MythosCodexUIData): string {
  const { codex, selectedPageId, pilgrimArchetypes = [], lang } = data;

  return `
<!DOCTYPE html>
<html lang="${lang === 'zh' ? 'zh-CN' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lang === 'zh' ? '神话典籍' : 'Mythos Codex'}</title>
  <style>
${getMythosCodexStyles()}
  </style>
</head>
<body>
  <div class="mythos-codex">
    <header class="codex-header">
      <h1>${lang === 'zh' ? '神话典籍' : 'Mythos Codex'}</h1>
      <p class="codex-subtitle">${lang === 'zh' ? '祖系原型的神圣经典' : 'Sacred Scripture of Ancestral Archetypes'}</p>
    </header>

    <div class="codex-grid" id="codex-grid">
      ${codex.pages.map(page => renderCodexCard(page, pilgrimArchetypes.includes(page.archetypeId), lang)).join('')}
    </div>

    <div class="codex-detail" id="codex-detail" style="display: none;">
      <!-- Detail view rendered by JS -->
    </div>
  </div>

  <script>
    window.MYTHOS_CODEX = ${JSON.stringify(codex)};
    window.PILGRIM_ARCHETYPES = ${JSON.stringify(pilgrimArchetypes)};
    window.LANG = '${lang}';
${getMythosCodexScript()}
  </script>
</body>
</html>`;
}

/**
 * Render a single codex card
 */
function renderCodexCard(page: MythosCodexPage, isPilgrimArchetype: boolean, lang: 'en' | 'zh'): string {
  const name = lang === 'zh' ? page.nameZh : page.name;
  const themes = page.themes.slice(0, 3).join(', ');
  const activeClass = isPilgrimArchetype ? 'codex-card--active' : '';

  return `
    <div class="codex-card ${activeClass}" data-archetype-id="${page.archetypeId}" onclick="showDetail('${page.archetypeId}')">
      <div class="card-symbol">${page.symbol}</div>
      <h2 class="card-name">${name}</h2>
      <p class="card-themes">${themes}</p>
      ${isPilgrimArchetype ? `<span class="card-badge">${lang === 'zh' ? '你的原型' : 'Your Archetype'}</span>` : ''}
    </div>
  `;
}

/**
 * Render codex grid component (for embedding)
 */
export function renderCodexGridComponent(
  codex: MythosCodex,
  pilgrimArchetypes: string[] = [],
  lang: 'en' | 'zh' = 'en'
): string {
  return `
    <div class="codex-grid">
      ${codex.pages.map(page => renderCodexCard(page, pilgrimArchetypes.includes(page.archetypeId), lang)).join('')}
    </div>
  `;
}

/**
 * Render single page detail
 */
export function renderCodexPageDetail(
  page: MythosCodexPage,
  isPilgrimArchetype: boolean,
  lang: 'en' | 'zh' = 'en'
): string {
  const name = lang === 'zh' ? page.nameZh : page.name;
  const themes = page.themes.join(', ');
  const shadow = (lang === 'zh' && page.shadowZh) ? page.shadowZh.join(', ') : page.shadow.join(', ');
  const gifts = (lang === 'zh' && page.giftsZh) ? page.giftsZh.join(', ') : page.gifts.join(', ');
  const evidence = page.lineageEvidence.slice(0, 3).join('; ');
  const personaVoice = (lang === 'zh' && page.personaVoiceZh) ? page.personaVoiceZh : page.personaVoice;

  // Scripture content
  const scripture = page.scripture;
  const openingVerse = (lang === 'zh' && scripture.openingVerseZh) ? scripture.openingVerseZh : scripture.openingVerse;
  const mythicStory = (lang === 'zh' && scripture.mythicStoryZh) ? scripture.mythicStoryZh : scripture.mythicStory;
  const wisdomTeaching = (lang === 'zh' && scripture.wisdomTeachingZh) ? scripture.wisdomTeachingZh : scripture.wisdomTeaching;
  const closingBlessing = (lang === 'zh' && scripture.closingBlessingZh) ? scripture.closingBlessingZh : scripture.closingBlessing;

  // Ritual guidance
  const ritual = page.ritualGuidance;
  const ritualPurpose = (lang === 'zh' && ritual.purposeZh) ? ritual.purposeZh : ritual.purpose;

  return `
    <div class="codex-page-detail">
      <button class="back-button" onclick="hideDetail()">← ${lang === 'zh' ? '返回' : 'Back'}</button>

      <header class="page-header">
        <span class="page-symbol">${page.symbol}</span>
        <h1 class="page-name">${name}</h1>
        ${isPilgrimArchetype ? `<span class="page-badge">${lang === 'zh' ? '你的原型' : 'Your Archetype'}</span>` : ''}
      </header>

      <section class="page-section themes-section">
        <h3>${lang === 'zh' ? '主题' : 'Themes'}</h3>
        <p>${themes}</p>
      </section>

      <section class="page-section duality-section">
        <div class="duality-column shadow-column">
          <h4>${lang === 'zh' ? '阴影' : 'Shadow'}</h4>
          <p>${shadow}</p>
        </div>
        <div class="duality-column gift-column">
          <h4>${lang === 'zh' ? '礼物' : 'Gifts'}</h4>
          <p>${gifts}</p>
        </div>
      </section>

      <section class="page-section scripture-section">
        <h3>${lang === 'zh' ? '经文' : 'Scripture'}</h3>
        <blockquote class="opening-verse">"${openingVerse}"</blockquote>
        <p class="mythic-story">${mythicStory}</p>
        <p class="wisdom-teaching"><em>${wisdomTeaching}</em></p>
        <blockquote class="closing-blessing">"${closingBlessing}"</blockquote>
      </section>

      <section class="page-section voice-section">
        <h3>${lang === 'zh' ? 'Luna的声音' : "Luna's Voice"}</h3>
        <p class="persona-voice">${personaVoice}</p>
      </section>

      <section class="page-section evidence-section">
        <h3>${lang === 'zh' ? '血脉证据' : 'Lineage Evidence'}</h3>
        <p>${evidence || (lang === 'zh' ? '尚未发现' : 'Not yet discovered')}</p>
      </section>

      <section class="page-section ritual-section">
        <h3>${lang === 'zh' ? '仪式指引' : 'Ritual Guidance'}</h3>
        <p><strong>${lang === 'zh' ? '目的' : 'Purpose'}:</strong> ${ritualPurpose}</p>
        <p><strong>${lang === 'zh' ? '材料' : 'Materials'}:</strong> ${ritual.materials.join(', ')}</p>
        <p><strong>${lang === 'zh' ? '最佳时机' : 'Best Timing'}:</strong> ${ritual.timing}</p>
      </section>
    </div>
  `;
}

// ==================== STYLES ====================

/**
 * Get CSS styles for Mythos Codex UI
 */
export function getMythosCodexStyles(): string {
  return `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      min-height: 100vh;
      color: #e8d5b7;
    }

    .mythos-codex {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .codex-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .codex-header h1 {
      font-size: 2.5rem;
      color: #f4d03f;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
      margin-bottom: 10px;
      letter-spacing: 3px;
    }

    .codex-subtitle {
      font-style: italic;
      color: #b8a07e;
      font-size: 1.1rem;
    }

    .codex-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }

    .codex-card {
      background: linear-gradient(145deg, #2a2a4a 0%, #1e1e38 100%);
      border: 1px solid #3a3a5a;
      border-radius: 12px;
      padding: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .codex-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(244, 208, 63, 0.2);
      border-color: #f4d03f;
    }

    .codex-card--active {
      border-color: #f4d03f;
      box-shadow: 0 0 15px rgba(244, 208, 63, 0.3);
    }

    .codex-card--active::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #f4d03f, #e8b923);
    }

    .card-symbol {
      font-size: 3rem;
      margin-bottom: 12px;
    }

    .card-name {
      font-size: 1.3rem;
      color: #f4d03f;
      margin-bottom: 8px;
    }

    .card-themes {
      font-size: 0.9rem;
      color: #a8a8b8;
      font-style: italic;
    }

    .card-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #f4d03f;
      color: #1a1a2e;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: bold;
    }

    /* Detail View */
    .codex-detail {
      background: #1a1a2e;
      border-radius: 16px;
      padding: 40px;
      margin-top: 20px;
    }

    .codex-page-detail {
      max-width: 800px;
      margin: 0 auto;
    }

    .back-button {
      background: transparent;
      border: 1px solid #f4d03f;
      color: #f4d03f;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 20px;
      font-family: inherit;
      transition: all 0.2s ease;
    }

    .back-button:hover {
      background: #f4d03f;
      color: #1a1a2e;
    }

    .page-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .page-symbol {
      font-size: 4rem;
      display: block;
      margin-bottom: 15px;
    }

    .page-name {
      font-size: 2rem;
      color: #f4d03f;
      margin-bottom: 10px;
    }

    .page-badge {
      display: inline-block;
      background: #f4d03f;
      color: #1a1a2e;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: bold;
    }

    .page-section {
      margin-bottom: 30px;
      padding-bottom: 25px;
      border-bottom: 1px solid #3a3a5a;
    }

    .page-section h3 {
      color: #f4d03f;
      margin-bottom: 15px;
      font-size: 1.2rem;
      letter-spacing: 1px;
    }

    .page-section h4 {
      color: #e8d5b7;
      margin-bottom: 8px;
      font-size: 1rem;
    }

    .page-section p {
      line-height: 1.7;
    }

    .duality-section {
      display: flex;
      gap: 30px;
    }

    .duality-column {
      flex: 1;
      padding: 20px;
      border-radius: 8px;
    }

    .shadow-column {
      background: rgba(139, 69, 69, 0.2);
      border-left: 3px solid #8b4545;
    }

    .gift-column {
      background: rgba(69, 139, 91, 0.2);
      border-left: 3px solid #458b5b;
    }

    .scripture-section blockquote {
      font-style: italic;
      padding: 15px 20px;
      margin: 15px 0;
      border-left: 3px solid #f4d03f;
      background: rgba(244, 208, 63, 0.1);
    }

    .mythic-story {
      margin: 20px 0;
    }

    .wisdom-teaching {
      text-align: center;
      color: #b8a07e;
    }

    .voice-section .persona-voice {
      font-style: italic;
      padding: 20px;
      background: rgba(244, 208, 63, 0.1);
      border-radius: 8px;
    }

    @media (max-width: 600px) {
      .duality-section {
        flex-direction: column;
      }

      .codex-header h1 {
        font-size: 1.8rem;
      }
    }
  `;
}

// ==================== SCRIPTS ====================

/**
 * Get JavaScript for Mythos Codex UI
 */
export function getMythosCodexScript(): string {
  return `
    function showDetail(archetypeId) {
      const page = window.MYTHOS_CODEX.pages.find(p => p.archetypeId === archetypeId);
      if (!page) return;

      const isPilgrim = window.PILGRIM_ARCHETYPES.includes(archetypeId);
      const lang = window.LANG;

      const name = lang === 'zh' ? page.nameZh : page.name;
      const themes = page.themes.join(', ');
      const shadow = (lang === 'zh' && page.shadowZh) ? page.shadowZh.join(', ') : page.shadow.join(', ');
      const gifts = (lang === 'zh' && page.giftsZh) ? page.giftsZh.join(', ') : page.gifts.join(', ');
      const evidence = page.lineageEvidence.slice(0, 3).join('; ');
      const personaVoice = (lang === 'zh' && page.personaVoiceZh) ? page.personaVoiceZh : page.personaVoice;

      const scripture = page.scripture;
      const openingVerse = (lang === 'zh' && scripture.openingVerseZh) ? scripture.openingVerseZh : scripture.openingVerse;
      const mythicStory = (lang === 'zh' && scripture.mythicStoryZh) ? scripture.mythicStoryZh : scripture.mythicStory;
      const wisdomTeaching = (lang === 'zh' && scripture.wisdomTeachingZh) ? scripture.wisdomTeachingZh : scripture.wisdomTeaching;
      const closingBlessing = (lang === 'zh' && scripture.closingBlessingZh) ? scripture.closingBlessingZh : scripture.closingBlessing;

      const ritual = page.ritualGuidance;
      const ritualPurpose = (lang === 'zh' && ritual.purposeZh) ? ritual.purposeZh : ritual.purpose;

      const detailHtml = \`
        <div class="codex-page-detail">
          <button class="back-button" onclick="hideDetail()">← \${lang === 'zh' ? '返回' : 'Back'}</button>

          <header class="page-header">
            <span class="page-symbol">\${page.symbol}</span>
            <h1 class="page-name">\${name}</h1>
            \${isPilgrim ? \`<span class="page-badge">\${lang === 'zh' ? '你的原型' : 'Your Archetype'}</span>\` : ''}
          </header>

          <section class="page-section themes-section">
            <h3>\${lang === 'zh' ? '主题' : 'Themes'}</h3>
            <p>\${themes}</p>
          </section>

          <section class="page-section duality-section">
            <div class="duality-column shadow-column">
              <h4>\${lang === 'zh' ? '阴影' : 'Shadow'}</h4>
              <p>\${shadow}</p>
            </div>
            <div class="duality-column gift-column">
              <h4>\${lang === 'zh' ? '礼物' : 'Gifts'}</h4>
              <p>\${gifts}</p>
            </div>
          </section>

          <section class="page-section scripture-section">
            <h3>\${lang === 'zh' ? '经文' : 'Scripture'}</h3>
            <blockquote class="opening-verse">"\${openingVerse}"</blockquote>
            <p class="mythic-story">\${mythicStory}</p>
            <p class="wisdom-teaching"><em>\${wisdomTeaching}</em></p>
            <blockquote class="closing-blessing">"\${closingBlessing}"</blockquote>
          </section>

          <section class="page-section voice-section">
            <h3>\${lang === 'zh' ? 'Luna的声音' : "Luna's Voice"}</h3>
            <p class="persona-voice">\${personaVoice}</p>
          </section>

          <section class="page-section evidence-section">
            <h3>\${lang === 'zh' ? '血脉证据' : 'Lineage Evidence'}</h3>
            <p>\${evidence || (lang === 'zh' ? '尚未发现' : 'Not yet discovered')}</p>
          </section>

          <section class="page-section ritual-section">
            <h3>\${lang === 'zh' ? '仪式指引' : 'Ritual Guidance'}</h3>
            <p><strong>\${lang === 'zh' ? '目的' : 'Purpose'}:</strong> \${ritualPurpose}</p>
            <p><strong>\${lang === 'zh' ? '材料' : 'Materials'}:</strong> \${ritual.materials.join(', ')}</p>
            <p><strong>\${lang === 'zh' ? '最佳时机' : 'Best Timing'}:</strong> \${ritual.timing}</p>
          </section>
        </div>
      \`;

      document.getElementById('codex-grid').style.display = 'none';
      const detailEl = document.getElementById('codex-detail');
      detailEl.innerHTML = detailHtml;
      detailEl.style.display = 'block';
    }

    function hideDetail() {
      document.getElementById('codex-grid').style.display = 'grid';
      document.getElementById('codex-detail').style.display = 'none';
    }
  `;
}

// ==================== EXPORTS ====================

export {
  renderMythosCodexHtml,
  renderCodexGridComponent,
  renderCodexPageDetail,
  getMythosCodexStyles,
  getMythosCodexScript
};
