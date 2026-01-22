/**
 * ============================================
 * PILGRIM-ANCESTOR DIALOGUE UI TEMPLATE
 * Ritual conversation interface where the pilgrim
 * and ancestors speak across generations
 *
 * Features:
 * - Dialogue turn rendering
 * - Speaker identity display
 * - Generational context
 * - Thematic resonance highlighting
 * - Interactive input (optional)
 * ============================================
 */

import { AncestralDialogue, DialogueTurn, DialogueSpeaker } from '../pilgrimAncestorDialogue';

// ==================== DATA MODEL ====================

export interface DialogueUIData {
  dialogue: AncestralDialogue;
  showInput?: boolean;
  pilgrimName?: string;
  lang: 'en' | 'zh';
}

// ==================== HTML RENDERER ====================

/**
 * Render full Dialogue UI as HTML
 */
export function renderDialogueUIHtml(data: DialogueUIData): string {
  const { dialogue, showInput = false, pilgrimName, lang } = data;

  return `
<!DOCTYPE html>
<html lang="${lang === 'zh' ? 'zh-CN' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lang === 'zh' ? '行者-祖先对话' : 'Pilgrim-Ancestor Dialogue'}</title>
  <style>
${getDialogueUIStyles()}
  </style>
</head>
<body>
  <div class="dialogue-ui">
    <header class="dialogue-header">
      <h2>${lang === 'zh' ? '行者-祖先对话' : 'Pilgrim-Ancestor Dialogue'}</h2>
      <p class="dialogue-subtitle">${lang === 'zh' ? dialogue.openingInvocationZh || dialogue.openingInvocation : dialogue.openingInvocation}</p>
    </header>

    <div id="dialogue-container" class="dialogue-container">
      ${dialogue.turns.map(turn => renderDialogueTurn(turn, lang)).join('')}
    </div>

    ${showInput ? `
    <div class="dialogue-input">
      <textarea id="pilgrim-input" placeholder="${lang === 'zh' ? '向祖先诉说...' : 'Speak to your ancestors...'}"></textarea>
      <button id="send-btn" onclick="sendPilgrimMessage()">
        ${lang === 'zh' ? '发送' : 'Send'}
      </button>
    </div>
    ` : ''}

    <footer class="dialogue-footer">
      <p>${lang === 'zh' ? dialogue.closingBlessingZh || dialogue.closingBlessing : dialogue.closingBlessing}</p>
    </footer>
  </div>

  <script>
    window.DIALOGUE = ${JSON.stringify(dialogue)};
    window.PILGRIM_NAME = '${pilgrimName || 'Pilgrim'}';
    window.LANG = '${lang}';
${getDialogueUIScript()}
  </script>
</body>
</html>`;
}

/**
 * Render a single dialogue turn
 */
function renderDialogueTurn(turn: DialogueTurn, lang: 'en' | 'zh'): string {
  const speakerLabel = lang === 'zh'
    ? (turn.speakerLabelZh || turn.speakerLabel)
    : turn.speakerLabel;
  const text = lang === 'zh' ? (turn.textZh || turn.text) : turn.text;
  const speakerClass = getSpeakerClass(turn.speaker);
  const emotionClass = turn.emotion ? `emotion-${turn.emotion}` : '';

  return `
    <div class="dialogue-turn ${speakerClass} ${emotionClass}" data-turn-id="${turn.id}">
      <div class="turn-header">
        <span class="speaker-label">${speakerLabel}</span>
        ${turn.generationIndex !== undefined ? `
          <span class="generation-badge">Gen ${turn.generationIndex}</span>
        ` : ''}
        ${turn.theme ? `
          <span class="theme-tag">${turn.theme}</span>
        ` : ''}
      </div>
      <div class="turn-content">
        <p>${text}</p>
      </div>
      ${turn.emotion ? `
        <div class="turn-emotion">${getEmotionIcon(turn.emotion)}</div>
      ` : ''}
    </div>
  `;
}

/**
 * Render dialogue container component (for embedding)
 */
export function renderDialogueContainerComponent(
  dialogue: AncestralDialogue,
  lang: 'en' | 'zh' = 'en'
): string {
  return `
    <div class="dialogue-container">
      ${dialogue.turns.map(turn => renderDialogueTurn(turn, lang)).join('')}
    </div>
  `;
}

// ==================== HELPER FUNCTIONS ====================

function getSpeakerClass(speaker: DialogueSpeaker): string {
  const classes: Record<DialogueSpeaker, string> = {
    pilgrim: 'speaker-pilgrim',
    ancestor: 'speaker-ancestor',
    luna: 'speaker-luna',
    archetype: 'speaker-archetype'
  };
  return classes[speaker] || 'speaker-unknown';
}

function getEmotionIcon(emotion: DialogueTurn['emotion']): string {
  const icons: Record<NonNullable<DialogueTurn['emotion']>, string> = {
    reverent: '🙏',
    questioning: '❓',
    grateful: '💛',
    releasing: '🍃',
    receiving: '✨',
    blessing: '🌟'
  };
  return icons[emotion!] || '';
}

// ==================== STYLES ====================

/**
 * Get CSS styles for Dialogue UI
 */
export function getDialogueUIStyles(): string {
  return `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      min-height: 100vh;
      color: #e8d5b7;
    }

    .dialogue-ui {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .dialogue-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .dialogue-header h2 {
      font-size: 1.8rem;
      color: #f4d03f;
      margin-bottom: 10px;
    }

    .dialogue-subtitle {
      font-style: italic;
      color: #b8a07e;
    }

    .dialogue-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px;
      background: rgba(255, 253, 247, 0.05);
      border-radius: 12px;
      max-height: 60vh;
      overflow-y: auto;
    }

    .dialogue-turn {
      padding: 16px;
      border-radius: 8px;
      position: relative;
      transition: transform 0.2s ease;
    }

    .dialogue-turn:hover {
      transform: translateX(4px);
    }

    .speaker-pilgrim {
      background: linear-gradient(135deg, rgba(255, 244, 214, 0.15) 0%, rgba(255, 235, 186, 0.1) 100%);
      border-left: 3px solid #f4d03f;
      margin-left: 20px;
    }

    .speaker-ancestor {
      background: linear-gradient(135deg, rgba(232, 228, 255, 0.15) 0%, rgba(200, 180, 255, 0.1) 100%);
      border-left: 3px solid #a78bfa;
      margin-right: 20px;
    }

    .speaker-luna {
      background: linear-gradient(135deg, rgba(230, 247, 240, 0.15) 0%, rgba(167, 243, 208, 0.1) 100%);
      border-left: 3px solid #34d399;
    }

    .speaker-archetype {
      background: linear-gradient(135deg, rgba(255, 200, 180, 0.15) 0%, rgba(255, 160, 140, 0.1) 100%);
      border-left: 3px solid #fb923c;
    }

    .turn-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }

    .speaker-label {
      font-weight: bold;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .generation-badge {
      background: rgba(167, 139, 250, 0.3);
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.75rem;
    }

    .theme-tag {
      background: rgba(244, 208, 63, 0.2);
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.75rem;
      font-style: italic;
    }

    .turn-content p {
      line-height: 1.7;
      font-size: 1rem;
    }

    .turn-emotion {
      position: absolute;
      top: 12px;
      right: 12px;
      font-size: 1.2rem;
    }

    .dialogue-input {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }

    .dialogue-input textarea {
      flex: 1;
      padding: 12px;
      border: 1px solid #3a3a5a;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: #e8d5b7;
      font-family: inherit;
      font-size: 1rem;
      resize: none;
      min-height: 80px;
    }

    .dialogue-input textarea::placeholder {
      color: #888;
    }

    .dialogue-input button {
      padding: 12px 24px;
      background: #f4d03f;
      color: #1a1a2e;
      border: none;
      border-radius: 8px;
      font-family: inherit;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .dialogue-input button:hover {
      background: #e8c431;
    }

    .dialogue-footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid rgba(244, 208, 63, 0.2);
    }

    .dialogue-footer p {
      font-style: italic;
      color: #b8a07e;
    }

    /* Emotion-based styling */
    .emotion-reverent { border-color: #a78bfa; }
    .emotion-questioning { border-color: #60a5fa; }
    .emotion-grateful { border-color: #f4d03f; }
    .emotion-releasing { border-color: #34d399; }
    .emotion-receiving { border-color: #f472b6; }
    .emotion-blessing { border-color: #fbbf24; }
  `;
}

// ==================== SCRIPTS ====================

/**
 * Get JavaScript for Dialogue UI
 */
export function getDialogueUIScript(): string {
  return `
    function sendPilgrimMessage() {
      const input = document.getElementById('pilgrim-input');
      const message = input.value.trim();
      if (!message) return;

      const container = document.getElementById('dialogue-container');
      const lang = window.LANG;

      // Add pilgrim turn
      const turnHtml = \`
        <div class="dialogue-turn speaker-pilgrim">
          <div class="turn-header">
            <span class="speaker-label">\${window.PILGRIM_NAME}</span>
          </div>
          <div class="turn-content">
            <p>\${message}</p>
          </div>
        </div>
      \`;

      container.insertAdjacentHTML('beforeend', turnHtml);

      // Clear input
      input.value = '';

      // Scroll to bottom
      container.scrollTop = container.scrollHeight;

      // Simulate ancestor response (in real app, this would call the dialogue engine)
      setTimeout(() => {
        const responseHtml = \`
          <div class="dialogue-turn speaker-ancestor">
            <div class="turn-header">
              <span class="speaker-label">\${lang === 'zh' ? '祖系合唱' : 'Ancestor Chorus'}</span>
            </div>
            <div class="turn-content">
              <p>\${lang === 'zh' ? '我们听见了你。你的话语在血脉中回响。' : 'We hear you. Your words echo through the bloodline.'}</p>
            </div>
          </div>
        \`;
        container.insertAdjacentHTML('beforeend', responseHtml);
        container.scrollTop = container.scrollHeight;
      }, 1500);
    }

    // Enter key to send
    document.getElementById('pilgrim-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendPilgrimMessage();
      }
    });
  `;
}

// ==================== EXPORTS ====================

export {
  renderDialogueUIHtml,
  renderDialogueContainerComponent,
  getDialogueUIStyles,
  getDialogueUIScript
};
