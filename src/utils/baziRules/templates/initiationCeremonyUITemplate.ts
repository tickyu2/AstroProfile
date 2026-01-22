/**
 * ============================================
 * INITIATION CEREMONY UI TEMPLATE
 * Step-by-step ritual interface for the
 * Pilgrim's Rite of Passage
 *
 * Features:
 * - Phase-by-phase progression
 * - Ancestor voice display
 * - Luna guidance
 * - Pilgrim input capture
 * - Progress tracking
 * ============================================
 */

import { RiteOfPassage, RitePhase, RiteProgress } from '../riteOfPassage';
import { InitiationCeremony, InitiationProgress } from '../ancestralInitiation';

// ==================== DATA MODEL ====================

export interface InitiationUIData {
  rite?: RiteOfPassage;
  ceremony?: InitiationCeremony;
  progress: RiteProgress | InitiationProgress;
  lang: 'en' | 'zh';
}

// ==================== HTML RENDERER ====================

/**
 * Render full Initiation Ceremony UI as HTML
 */
export function renderInitiationCeremonyHtml(data: InitiationUIData): string {
  const { rite, ceremony, progress, lang } = data;
  const source = rite || ceremony;
  if (!source) return '<div>No ceremony data provided</div>';

  const phases = rite ? rite.phases : ceremony!.stages;
  const currentIndex = 'currentPhaseIndex' in progress ? progress.currentPhaseIndex : progress.currentStageIndex;

  return `
<!DOCTYPE html>
<html lang="${lang === 'zh' ? 'zh-CN' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lang === 'zh' ? '祖系启蒙仪式' : 'Ancestral Initiation Ceremony'}</title>
  <style>
${getInitiationUIStyles()}
  </style>
</head>
<body>
  <div class="initiation-ui">
    <header class="initiation-header">
      <h2>${lang === 'zh' ? '祖系启蒙仪式' : 'Ancestral Initiation Ceremony'}</h2>
      <p class="header-subtitle">${lang === 'zh' ? '跨越门槛进入祖系圣殿' : 'Cross the threshold into the Ancestral Temple'}</p>
    </header>

    <div class="progress-bar">
      <div class="progress-fill" style="width: ${getProgressPercentage(progress, phases.length)}%"></div>
    </div>
    <div class="progress-label">
      ${lang === 'zh' ? '阶段' : 'Phase'} ${currentIndex + 1} / ${phases.length}
    </div>

    <div id="phase-container" class="phase-container">
      ${currentIndex < phases.length
        ? renderPhase(phases[currentIndex], currentIndex, lang)
        : renderCompletion(lang)
      }
    </div>

    <div class="initiation-controls">
      <button id="prev-btn" class="control-btn" ${currentIndex === 0 ? 'disabled' : ''} onclick="prevPhase()">
        ${lang === 'zh' ? '上一步' : 'Previous'}
      </button>
      <button id="next-btn" class="control-btn control-btn--primary" onclick="nextPhase()">
        ${currentIndex >= phases.length - 1
          ? (lang === 'zh' ? '完成' : 'Complete')
          : (lang === 'zh' ? '下一步' : 'Next')
        }
      </button>
    </div>
  </div>

  <script>
    window.PHASES = ${JSON.stringify(phases)};
    window.PROGRESS = ${JSON.stringify(progress)};
    window.LANG = '${lang}';
    window.currentPhaseIndex = ${currentIndex};
${getInitiationUIScript()}
  </script>
</body>
</html>`;
}

/**
 * Render a single phase
 */
function renderPhase(phase: RitePhase | any, index: number, lang: 'en' | 'zh'): string {
  const title = lang === 'zh' ? (phase.titleZh || phase.title) : phase.title;
  const symbol = phase.symbol || '🔮';

  // Handle both RitePhase and InitiationStage structures
  const instructions = phase.instructions || [];
  const ancestorVoice = lang === 'zh'
    ? (phase.ancestorVoiceZh || phase.ancestorVoice)
    : phase.ancestorVoice;
  const lunaGuidance = lang === 'zh'
    ? (phase.lunaWitnessZh || phase.lunaWitness || phase.lunaGuidanceZh || phase.lunaGuidance)
    : (phase.lunaWitness || phase.lunaGuidance);
  const pilgrimAffirmation = lang === 'zh'
    ? (phase.pilgrimAffirmationZh || phase.pilgrimAffirmation)
    : phase.pilgrimAffirmation;

  return `
    <div class="phase-card ${phase.threshold ? 'phase-card--threshold' : ''}" data-phase-index="${index}">
      <div class="phase-header">
        <span class="phase-symbol">${symbol}</span>
        <h3 class="phase-title">${title}</h3>
        ${phase.threshold ? `<span class="threshold-badge">${lang === 'zh' ? '门槛' : 'Threshold'}</span>` : ''}
      </div>

      <div class="phase-instructions">
        ${instructions.map((inst: any) => {
          const text = typeof inst === 'string' ? inst : (lang === 'zh' ? (inst.textZh || inst.text) : inst.text);
          const action = typeof inst === 'object' ? inst.action : null;
          return `
            <div class="instruction-item ${action ? 'instruction-item--' + action : ''}">
              ${getActionIcon(action)}
              <span>${text}</span>
            </div>
          `;
        }).join('')}
      </div>

      <div class="phase-voices">
        <div class="voice-card ancestor-voice">
          <div class="voice-label">${lang === 'zh' ? '祖先之声' : 'Ancestral Voice'}</div>
          <p class="voice-text">"${ancestorVoice}"</p>
        </div>

        ${lunaGuidance ? `
          <div class="voice-card luna-voice">
            <div class="voice-label">Luna</div>
            <p class="voice-text">${lunaGuidance}</p>
          </div>
        ` : ''}

        ${pilgrimAffirmation ? `
          <div class="voice-card pilgrim-voice">
            <div class="voice-label">${lang === 'zh' ? '行者宣言' : 'Pilgrim Affirmation'}</div>
            <p class="voice-text">"${pilgrimAffirmation}"</p>
          </div>
        ` : ''}
      </div>

      ${phase.requiredOffering && phase.requiredOffering !== 'none' ? `
        <div class="phase-input">
          <label>${getOfferingLabel(phase.requiredOffering, lang)}</label>
          <textarea id="offering-input" placeholder="${getOfferingPlaceholder(phase.requiredOffering, lang)}"></textarea>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Render completion state
 */
function renderCompletion(lang: 'en' | 'zh'): string {
  return `
    <div class="completion-card">
      <div class="completion-icon">✨</div>
      <h3>${lang === 'zh' ? '启蒙完成' : 'Initiation Complete'}</h3>
      <p>${lang === 'zh'
        ? '你现在已被祖系圣殿启蒙。血脉认出了你。带着他们的祝福行走。'
        : 'You are now initiated into the Ancestral Temple. The lineage recognizes you. Walk with their blessing.'
      }</p>
    </div>
  `;
}

// ==================== HELPER FUNCTIONS ====================

function getProgressPercentage(progress: any, total: number): number {
  const current = 'currentPhaseIndex' in progress ? progress.currentPhaseIndex : progress.currentStageIndex;
  return Math.round((current / total) * 100);
}

function getActionIcon(action: string | null): string {
  const icons: Record<string, string> = {
    breathe: '🌬️',
    write: '✍️',
    visualize: '👁️',
    speak: '🗣️',
    light: '🕯️',
    offer: '🙏',
    move: '🚶',
    feel: '💫'
  };
  return action ? `<span class="action-icon">${icons[action] || '•'}</span>` : '';
}

function getOfferingLabel(offering: string, lang: 'en' | 'zh'): string {
  const labels: Record<string, { en: string; zh: string }> = {
    names: { en: 'Ancestor Names', zh: '祖先名字' },
    light: { en: 'Light Offering', zh: '光的供奉' },
    intention: { en: 'Your Intention', zh: '你的意愿' },
    theme: { en: 'Theme to Heal', zh: '疗愈的主题' },
    breath: { en: 'Breath Offering', zh: '呼吸的供奉' }
  };
  return labels[offering]?.[lang] || offering;
}

function getOfferingPlaceholder(offering: string, lang: 'en' | 'zh'): string {
  const placeholders: Record<string, { en: string; zh: string }> = {
    names: { en: 'Write the names of your ancestors...', zh: '写下你祖先的名字...' },
    theme: { en: 'What theme do you wish to transform?', zh: '你希望转化什么主题?' },
    intention: { en: 'State your intention...', zh: '陈述你的意愿...' }
  };
  return placeholders[offering]?.[lang] || '';
}

// ==================== STYLES ====================

/**
 * Get CSS styles for Initiation UI
 */
export function getInitiationUIStyles(): string {
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

    .initiation-ui {
      max-width: 700px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .initiation-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .initiation-header h2 {
      font-size: 1.8rem;
      color: #f4d03f;
      margin-bottom: 10px;
    }

    .header-subtitle {
      color: #b8a07e;
      font-style: italic;
    }

    .progress-bar {
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #f4d03f, #fbbf24);
      border-radius: 3px;
      transition: width 0.5s ease;
    }

    .progress-label {
      text-align: center;
      font-size: 0.85rem;
      color: #888;
      margin-bottom: 24px;
    }

    .phase-container {
      min-height: 400px;
    }

    .phase-card {
      background: rgba(30, 30, 56, 0.8);
      border-radius: 16px;
      padding: 30px;
      border: 1px solid #3a3a5a;
      animation: fadeSlide 0.5s ease-out;
    }

    .phase-card--threshold {
      border-color: #f4d03f;
      box-shadow: 0 0 20px rgba(244, 208, 63, 0.2);
    }

    @keyframes fadeSlide {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .phase-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .phase-symbol {
      font-size: 2.5rem;
    }

    .phase-title {
      font-size: 1.4rem;
      color: #f4d03f;
      flex: 1;
    }

    .threshold-badge {
      background: #f4d03f;
      color: #1a1a2e;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: bold;
    }

    .phase-instructions {
      margin-bottom: 24px;
    }

    .instruction-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px;
      background: rgba(255, 253, 247, 0.05);
      border-radius: 8px;
      margin-bottom: 10px;
      line-height: 1.6;
    }

    .action-icon {
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .phase-voices {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .voice-card {
      padding: 16px;
      border-radius: 8px;
    }

    .ancestor-voice {
      background: linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%);
      border-left: 3px solid #a78bfa;
    }

    .luna-voice {
      background: linear-gradient(135deg, rgba(52, 211, 153, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%);
      border-left: 3px solid #34d399;
    }

    .pilgrim-voice {
      background: linear-gradient(135deg, rgba(244, 208, 63, 0.15) 0%, rgba(251, 191, 36, 0.1) 100%);
      border-left: 3px solid #f4d03f;
    }

    .voice-label {
      font-size: 0.8rem;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
      opacity: 0.8;
    }

    .voice-text {
      font-style: italic;
      line-height: 1.7;
    }

    .phase-input {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #3a3a5a;
    }

    .phase-input label {
      display: block;
      font-size: 0.9rem;
      margin-bottom: 10px;
      color: #f4d03f;
    }

    .phase-input textarea {
      width: 100%;
      padding: 14px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid #3a3a5a;
      border-radius: 8px;
      color: #e8d5b7;
      font-family: inherit;
      font-size: 1rem;
      resize: none;
      min-height: 100px;
    }

    .phase-input textarea::placeholder {
      color: #888;
    }

    .completion-card {
      text-align: center;
      padding: 60px 30px;
      background: rgba(30, 30, 56, 0.8);
      border-radius: 16px;
      border: 1px solid #f4d03f;
    }

    .completion-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }

    .completion-card h3 {
      font-size: 1.6rem;
      color: #f4d03f;
      margin-bottom: 16px;
    }

    .completion-card p {
      line-height: 1.8;
      max-width: 500px;
      margin: 0 auto;
    }

    .initiation-controls {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 30px;
    }

    .control-btn {
      padding: 14px 32px;
      border: 1px solid #3a3a5a;
      border-radius: 8px;
      background: transparent;
      color: #e8d5b7;
      font-family: inherit;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .control-btn:hover:not(:disabled) {
      border-color: #f4d03f;
      color: #f4d03f;
    }

    .control-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .control-btn--primary {
      background: #f4d03f;
      color: #1a1a2e;
      border-color: #f4d03f;
      font-weight: bold;
    }

    .control-btn--primary:hover:not(:disabled) {
      background: #e8c431;
      border-color: #e8c431;
      color: #1a1a2e;
    }
  `;
}

// ==================== SCRIPTS ====================

/**
 * Get JavaScript for Initiation UI
 */
export function getInitiationUIScript(): string {
  return `
    function nextPhase() {
      const offeringInput = document.getElementById('offering-input');
      const offering = offeringInput ? offeringInput.value : null;

      if (window.currentPhaseIndex < window.PHASES.length - 1) {
        window.currentPhaseIndex++;
        renderCurrentPhase();
      } else if (window.currentPhaseIndex === window.PHASES.length - 1) {
        window.currentPhaseIndex++;
        renderCurrentPhase();
        // Mark as complete
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('prev-btn').style.display = 'none';
      }
    }

    function prevPhase() {
      if (window.currentPhaseIndex > 0) {
        window.currentPhaseIndex--;
        renderCurrentPhase();
      }
    }

    function renderCurrentPhase() {
      const container = document.getElementById('phase-container');
      const lang = window.LANG;

      if (window.currentPhaseIndex >= window.PHASES.length) {
        container.innerHTML = \`
          <div class="completion-card">
            <div class="completion-icon">✨</div>
            <h3>\${lang === 'zh' ? '启蒙完成' : 'Initiation Complete'}</h3>
            <p>\${lang === 'zh'
              ? '你现在已被祖系圣殿启蒙。血脉认出了你。带着他们的祝福行走。'
              : 'You are now initiated into the Ancestral Temple. The lineage recognizes you. Walk with their blessing.'
            }</p>
          </div>
        \`;
        return;
      }

      const phase = window.PHASES[window.currentPhaseIndex];
      const title = lang === 'zh' ? (phase.titleZh || phase.title) : phase.title;
      const symbol = phase.symbol || '🔮';
      const instructions = phase.instructions || [];

      const ancestorVoice = lang === 'zh'
        ? (phase.ancestorVoiceZh || phase.ancestorVoice)
        : phase.ancestorVoice;

      container.innerHTML = \`
        <div class="phase-card \${phase.threshold ? 'phase-card--threshold' : ''}">
          <div class="phase-header">
            <span class="phase-symbol">\${symbol}</span>
            <h3 class="phase-title">\${title}</h3>
            \${phase.threshold ? \`<span class="threshold-badge">\${lang === 'zh' ? '门槛' : 'Threshold'}</span>\` : ''}
          </div>

          <div class="phase-instructions">
            \${instructions.map(inst => {
              const text = typeof inst === 'string' ? inst : (lang === 'zh' ? (inst.textZh || inst.text) : inst.text);
              return \`<div class="instruction-item"><span>\${text}</span></div>\`;
            }).join('')}
          </div>

          <div class="phase-voices">
            <div class="voice-card ancestor-voice">
              <div class="voice-label">\${lang === 'zh' ? '祖先之声' : 'Ancestral Voice'}</div>
              <p class="voice-text">"\${ancestorVoice}"</p>
            </div>
          </div>
        </div>
      \`;

      // Update progress
      document.querySelector('.progress-fill').style.width = Math.round((window.currentPhaseIndex / window.PHASES.length) * 100) + '%';
      document.querySelector('.progress-label').textContent = \`\${lang === 'zh' ? '阶段' : 'Phase'} \${window.currentPhaseIndex + 1} / \${window.PHASES.length}\`;

      // Update buttons
      document.getElementById('prev-btn').disabled = window.currentPhaseIndex === 0;
      document.getElementById('next-btn').textContent = window.currentPhaseIndex >= window.PHASES.length - 1
        ? (lang === 'zh' ? '完成' : 'Complete')
        : (lang === 'zh' ? '下一步' : 'Next');
    }
  `;
}

// ==================== EXPORTS ====================

export {
  renderInitiationCeremonyHtml,
  getInitiationUIStyles,
  getInitiationUIScript
};
