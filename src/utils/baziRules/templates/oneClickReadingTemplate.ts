/**
 * ============================================
 * ONE-CLICK READING UI TEMPLATE
 * Front Door to the Cathedral
 *
 * Features:
 * - Birth data input form
 * - One-click reading button
 * - Grand Hall mount area
 * - Progress indicator
 *
 * "One button. One door. The whole Cathedral."
 * ============================================
 */

// ==================== DATA MODEL ====================

export interface OneClickReadingUIData {
  // Input state
  birthData?: {
    year: number;
    month: number;
    day: number;
    hour: number;
    gender: 'M' | 'F';
    name?: string;
  };

  // Loading state
  isLoading: boolean;
  loadingPhase?: string;
  loadingProgress?: number;

  // Result state
  isComplete: boolean;
  hasError: boolean;
  errorMessage?: string;

  // Settings
  lang: 'en' | 'zh';
  theme: 'light' | 'dark' | 'temple';
}

// ==================== HTML RENDERING ====================

/**
 * Render One-Click Reading page
 */
export function renderOneClickReadingHtml(data: OneClickReadingUIData): string {
  const { lang = 'en', theme = 'temple' } = data;

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lang === 'zh' ? '一键解读 — 大教堂' : 'One-Click Reading — Cathedral'}</title>
  <style>
    ${getOneClickStyles(theme)}
  </style>
</head>
<body class="theme-${theme}">
  <div class="one-click-container">

    <header class="cathedral-header">
      <div class="cathedral-symbol">🏛️</div>
      <h1>${lang === 'zh' ? '大教堂' : 'The Cathedral'}</h1>
      <p class="subtitle">${lang === 'zh' ? '形而上学智慧引擎' : 'Metaphysical Wisdom Engine'}</p>
    </header>

    <main class="main-content">
      ${data.isComplete
        ? renderGrandHallMount(lang)
        : data.isLoading
          ? renderLoadingPhase(data, lang)
          : renderBirthForm(data.birthData, lang)
      }
    </main>

    ${data.hasError ? renderError(data.errorMessage, lang) : ''}

    <footer class="cathedral-footer">
      <p>${lang === 'zh' ? '版本 3.0 · 由血脉智慧驱动' : 'Version 3.0 · Powered by Lineage Wisdom'}</p>
    </footer>

  </div>

  <script>
    ${getOneClickScript()}
  </script>
</body>
</html>
  `.trim();
}

/**
 * Render birth data form
 */
function renderBirthForm(birthData: OneClickReadingUIData['birthData'], lang: 'en' | 'zh'): string {
  const year = birthData?.year || new Date().getFullYear() - 30;
  const month = birthData?.month || 1;
  const day = birthData?.day || 1;
  const hour = birthData?.hour || 12;
  const gender = birthData?.gender || 'M';
  const name = birthData?.name || '';

  return `
    <section class="birth-form-section">
      <h2>${lang === 'zh' ? '输入出生信息' : 'Enter Birth Information'}</h2>
      <p class="form-intro">${lang === 'zh'
        ? '提供您的出生数据以解锁您的宇宙蓝图。'
        : 'Provide your birth data to unlock your cosmic blueprint.'
      }</p>

      <form id="birth-form" class="birth-form">
        <div class="form-row">
          <div class="form-group">
            <label for="name">${lang === 'zh' ? '姓名（可选）' : 'Name (Optional)'}</label>
            <input type="text" id="name" name="name" value="${name}" placeholder="${lang === 'zh' ? '您的姓名' : 'Your name'}">
          </div>
        </div>

        <div class="form-row date-row">
          <div class="form-group">
            <label for="year">${lang === 'zh' ? '年' : 'Year'}</label>
            <input type="number" id="year" name="year" value="${year}" min="1900" max="2100" required>
          </div>
          <div class="form-group">
            <label for="month">${lang === 'zh' ? '月' : 'Month'}</label>
            <select id="month" name="month" required>
              ${[1,2,3,4,5,6,7,8,9,10,11,12].map(m => `<option value="${m}" ${m === month ? 'selected' : ''}>${m}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="day">${lang === 'zh' ? '日' : 'Day'}</label>
            <select id="day" name="day" required>
              ${Array.from({length: 31}, (_, i) => i + 1).map(d => `<option value="${d}" ${d === day ? 'selected' : ''}>${d}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="hour">${lang === 'zh' ? '时辰' : 'Hour'}</label>
            <select id="hour" name="hour" required>
              ${Array.from({length: 24}, (_, i) => i).map(h => `<option value="${h}" ${h === hour ? 'selected' : ''}>${String(h).padStart(2, '0')}:00</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group gender-group">
            <label>${lang === 'zh' ? '性别' : 'Gender'}</label>
            <div class="gender-buttons">
              <button type="button" class="gender-btn ${gender === 'M' ? 'active' : ''}" data-gender="M">
                ♂ ${lang === 'zh' ? '男' : 'Male'}
              </button>
              <button type="button" class="gender-btn ${gender === 'F' ? 'active' : ''}" data-gender="F">
                ♀ ${lang === 'zh' ? '女' : 'Female'}
              </button>
            </div>
            <input type="hidden" id="gender" name="gender" value="${gender}">
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="one-click-btn" id="submit-btn">
            <span class="btn-icon">🚪</span>
            <span class="btn-text">${lang === 'zh' ? '一键开启大殿' : 'One Click to Open the Grand Hall'}</span>
          </button>
        </div>
      </form>
    </section>
  `;
}

/**
 * Render loading phase
 */
function renderLoadingPhase(data: OneClickReadingUIData, lang: 'en' | 'zh'): string {
  const phase = data.loadingPhase || (lang === 'zh' ? '初始化...' : 'Initializing...');
  const progress = data.loadingProgress || 0;

  const phases = [
    { en: 'Computing Four Pillars...', zh: '计算四柱...' },
    { en: 'Analyzing Interactions...', zh: '分析交互...' },
    { en: 'Generating Narrative...', zh: '生成叙事...' },
    { en: 'Building Ancestral Temple...', zh: '建造祖先殿堂...' },
    { en: 'Mapping Mythos...', zh: '映射神话...' },
    { en: 'Consulting Oracle...', zh: '咨询神谕...' },
    { en: 'Opening Grand Hall...', zh: '开启大殿...' }
  ];

  return `
    <section class="loading-section">
      <div class="loading-animation">
        <div class="loading-rings">
          <div class="ring ring-1"></div>
          <div class="ring ring-2"></div>
          <div class="ring ring-3"></div>
        </div>
        <div class="loading-symbol">🏛️</div>
      </div>

      <h2 class="loading-phase">${phase}</h2>

      <div class="progress-container">
        <div class="progress-bar" style="width: ${progress}%"></div>
      </div>
      <span class="progress-text">${progress}%</span>

      <div class="phase-list">
        ${phases.map((p, idx) => {
          const phaseProgress = (idx + 1) * (100 / phases.length);
          const isComplete = progress >= phaseProgress;
          const isCurrent = progress >= (idx * (100 / phases.length)) && progress < phaseProgress;
          return `
            <div class="phase-item ${isComplete ? 'complete' : ''} ${isCurrent ? 'current' : ''}">
              <span class="phase-marker">${isComplete ? '✓' : isCurrent ? '◉' : '○'}</span>
              <span class="phase-label">${lang === 'zh' ? p.zh : p.en}</span>
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

/**
 * Render Grand Hall mount area
 */
function renderGrandHallMount(lang: 'en' | 'zh'): string {
  return `
    <section class="grand-hall-mount" id="grand-hall-mount">
      <div class="mount-placeholder">
        <div class="mount-icon">🏛️</div>
        <h2>${lang === 'zh' ? '大殿已准备就绪' : 'Grand Hall Ready'}</h2>
        <p>${lang === 'zh' ? '您的宇宙蓝图正在加载...' : 'Your cosmic blueprint is loading...'}</p>
      </div>
    </section>
  `;
}

/**
 * Render error message
 */
function renderError(message: string | undefined, lang: 'en' | 'zh'): string {
  return `
    <div class="error-banner">
      <span class="error-icon">⚠️</span>
      <span class="error-message">${message || (lang === 'zh' ? '发生错误' : 'An error occurred')}</span>
      <button class="error-dismiss" onclick="this.parentElement.remove()">×</button>
    </div>
  `;
}

// ==================== STYLES ====================

function getOneClickStyles(theme: 'light' | 'dark' | 'temple'): string {
  const colors = {
    'light': { bg: '#f8f6f3', text: '#3a3a3a', accent: '#8b7355', card: '#ffffff', input: '#ffffff' },
    'dark': { bg: '#1a1a2e', text: '#e8e4dc', accent: '#c9a96e', card: '#252545', input: '#2a2a4a' },
    'temple': { bg: '#2d2416', text: '#e8dcc8', accent: '#d4a84b', card: '#3d3220', input: '#4a3c2a' }
  };
  const c = colors[theme];

  return `
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
  background: ${c.bg};
  color: ${c.text};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.one-click-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cathedral-header {
  text-align: center;
  padding: 48px 0;
}

.cathedral-symbol { font-size: 5rem; margin-bottom: 16px; }
.cathedral-header h1 { font-size: 3rem; color: ${c.accent}; margin-bottom: 8px; }
.subtitle { font-size: 1.2rem; opacity: 0.7; font-style: italic; }

.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Birth Form */
.birth-form-section {
  width: 100%;
  max-width: 600px;
  text-align: center;
}

.birth-form-section h2 { margin-bottom: 8px; font-size: 1.8rem; }
.form-intro { opacity: 0.7; margin-bottom: 32px; }

.birth-form {
  background: ${c.card};
  padding: 32px;
  border-radius: 16px;
  text-align: left;
}

.form-row { margin-bottom: 20px; }

.date-row {
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  gap: 12px;
}

.form-group { display: flex; flex-direction: column; }

.form-group label {
  font-size: 0.85rem;
  margin-bottom: 6px;
  color: ${c.accent};
}

.form-group input, .form-group select {
  padding: 12px;
  border: 2px solid ${c.accent}40;
  border-radius: 8px;
  background: ${c.input};
  color: ${c.text};
  font-family: inherit;
  font-size: 1rem;
}

.form-group input:focus, .form-group select:focus {
  outline: none;
  border-color: ${c.accent};
}

.gender-buttons {
  display: flex;
  gap: 12px;
}

.gender-btn {
  flex: 1;
  padding: 12px;
  background: ${c.input};
  border: 2px solid ${c.accent}40;
  border-radius: 8px;
  color: ${c.text};
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.gender-btn:hover { border-color: ${c.accent}; }
.gender-btn.active { background: ${c.accent}; color: ${c.bg}; border-color: ${c.accent}; }

.form-actions { margin-top: 32px; text-align: center; }

.one-click-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 18px 48px;
  background: linear-gradient(135deg, ${c.accent}, ${c.accent}dd);
  color: ${c.bg};
  border: none;
  border-radius: 50px;
  font-family: inherit;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 20px ${c.accent}40;
}

.one-click-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px ${c.accent}60;
}

.btn-icon { font-size: 1.5rem; }

/* Loading */
.loading-section {
  text-align: center;
  width: 100%;
  max-width: 500px;
}

.loading-animation {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 32px;
}

.loading-rings {
  position: absolute;
  inset: 0;
}

.ring {
  position: absolute;
  border: 3px solid transparent;
  border-radius: 50%;
}

.ring-1 {
  inset: 0;
  border-top-color: ${c.accent};
  animation: spin 2s linear infinite;
}

.ring-2 {
  inset: 20px;
  border-right-color: ${c.accent}80;
  animation: spin 3s linear infinite reverse;
}

.ring-3 {
  inset: 40px;
  border-bottom-color: ${c.accent}50;
  animation: spin 4s linear infinite;
}

@keyframes spin { 100% { transform: rotate(360deg); } }

.loading-symbol {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.7; transform: translate(-50%, -50%) scale(0.95); }
}

.loading-phase {
  font-size: 1.5rem;
  margin-bottom: 24px;
  color: ${c.accent};
}

.progress-container {
  height: 8px;
  background: ${c.card};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  background: ${c.accent};
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 0.9rem;
  opacity: 0.7;
}

.phase-list {
  margin-top: 32px;
  text-align: left;
}

.phase-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  opacity: 0.5;
}

.phase-item.complete { opacity: 1; }
.phase-item.current { opacity: 1; color: ${c.accent}; }

.phase-marker { font-size: 1.2rem; }
.phase-item.complete .phase-marker { color: #4CAF50; }

/* Grand Hall Mount */
.grand-hall-mount {
  width: 100%;
  min-height: 500px;
  background: ${c.card};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mount-placeholder { text-align: center; }
.mount-icon { font-size: 5rem; margin-bottom: 16px; }
.mount-placeholder h2 { color: ${c.accent}; margin-bottom: 8px; }
.mount-placeholder p { opacity: 0.7; }

/* Error */
.error-banner {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: #f44336;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.error-dismiss {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.8;
}

.error-dismiss:hover { opacity: 1; }

/* Footer */
.cathedral-footer {
  text-align: center;
  padding: 24px;
  opacity: 0.5;
  font-size: 0.85rem;
}

@media (max-width: 600px) {
  .date-row { grid-template-columns: 1fr 1fr; }
  .one-click-btn { padding: 16px 32px; font-size: 1rem; }
}
  `.trim();
}

// ==================== SCRIPT ====================

function getOneClickScript(): string {
  return `
(function() {
  const form = document.getElementById('birth-form');
  const genderBtns = document.querySelectorAll('.gender-btn');
  const genderInput = document.getElementById('gender');

  // Gender selection
  genderBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      genderBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      genderInput.value = this.dataset.gender;
    });
  });

  // Form submission
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(this);
      const birthData = {
        name: formData.get('name'),
        year: parseInt(formData.get('year')),
        month: parseInt(formData.get('month')),
        day: parseInt(formData.get('day')),
        hour: parseInt(formData.get('hour')),
        gender: formData.get('gender')
      };

      console.log('Birth data submitted:', birthData);

      // Dispatch custom event for parent to handle
      window.dispatchEvent(new CustomEvent('cathedral-birth-data', {
        detail: birthData
      }));
    });
  }
})();
  `.trim();
}

// ==================== COMPONENT RENDERING ====================

/**
 * Render just the form component
 */
export function renderBirthFormComponent(lang: 'en' | 'zh' = 'en'): string {
  return renderBirthForm(undefined, lang);
}

/**
 * Render just the loading component
 */
export function renderLoadingComponent(phase: string, progress: number, lang: 'en' | 'zh' = 'en'): string {
  return renderLoadingPhase({ isLoading: true, loadingPhase: phase, loadingProgress: progress, isComplete: false, hasError: false, lang, theme: 'temple' }, lang);
}

// ==================== EXPORTS ====================

export {
  renderOneClickReadingHtml,
  renderBirthFormComponent,
  renderLoadingComponent,
  getOneClickStyles,
  getOneClickScript
};
