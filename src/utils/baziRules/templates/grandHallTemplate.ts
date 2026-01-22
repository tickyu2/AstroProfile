/**
 * ============================================
 * GRAND HALL UI TEMPLATE
 * The Crown Interface of the Cathedral
 *
 * Unifies:
 * - Mythos Oracle
 * - Pilgrim Journey 3.0
 * - Lineage Simulation
 * - Hypergraph Visualization
 * - Ritual Calendar
 *
 * This is where the pilgrim comes to receive wisdom,
 * track their journey, and simulate futures.
 * ============================================
 */

import { OracleResponse } from '../mythosOracle';
import { PilgrimJourney3, JourneyStage, JOURNEY_STAGES, getStageInfo } from '../pilgrimJourney3';
import { SimulationResult, SimulationScenario } from '../lineageSimulationEngine';

// ==================== DATA MODEL ====================

export interface GrandHallData {
  // Core data
  pilgrimId: string;
  pilgrimName?: string;

  // Oracle
  oracleResponse?: OracleResponse;

  // Journey
  journey?: PilgrimJourney3;

  // Simulation
  simulation?: SimulationResult;
  availableScenarios: SimulationScenario[];

  // Settings
  activeTab: 'oracle' | 'journey' | 'simulation' | 'unified';
  lang: 'en' | 'zh';
  theme: 'light' | 'dark' | 'temple';
}

// ==================== HTML RENDERING ====================

/**
 * Render Grand Hall as HTML
 */
export function renderGrandHallHtml(data: GrandHallData): string {
  const { lang = 'en', theme = 'temple' } = data;

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lang === 'zh' ? '大殿 — 智慧圣所' : 'Grand Hall — Sanctuary of Wisdom'}</title>
  <style>
    ${getGrandHallStyles(theme)}
  </style>
</head>
<body class="theme-${theme}">
  <div class="grand-hall">

    <header class="hall-header">
      <div class="hall-symbol">🏛️</div>
      <h1>${lang === 'zh' ? '大殿' : 'Grand Hall'}</h1>
      <p class="hall-subtitle">${lang === 'zh' ? '神谕 · 旅程 · 模拟' : 'Oracle · Journey · Simulation'}</p>
      ${data.pilgrimName ? `<p class="pilgrim-name">${lang === 'zh' ? '行者' : 'Pilgrim'}: ${data.pilgrimName}</p>` : ''}
    </header>

    <nav class="hall-nav">
      <button class="nav-tab ${data.activeTab === 'oracle' ? 'active' : ''}" data-tab="oracle">
        🔮 ${lang === 'zh' ? '神谕' : 'Oracle'}
      </button>
      <button class="nav-tab ${data.activeTab === 'journey' ? 'active' : ''}" data-tab="journey">
        🗺️ ${lang === 'zh' ? '旅程' : 'Journey'}
      </button>
      <button class="nav-tab ${data.activeTab === 'simulation' ? 'active' : ''}" data-tab="simulation">
        🔄 ${lang === 'zh' ? '模拟' : 'Simulation'}
      </button>
      <button class="nav-tab ${data.activeTab === 'unified' ? 'active' : ''}" data-tab="unified">
        ⚡ ${lang === 'zh' ? '统一视图' : 'Unified'}
      </button>
    </nav>

    <main class="hall-content">

      <section class="tab-panel ${data.activeTab === 'oracle' ? 'active' : ''}" id="oracle-panel">
        ${renderOracleSection(data.oracleResponse, lang)}
      </section>

      <section class="tab-panel ${data.activeTab === 'journey' ? 'active' : ''}" id="journey-panel">
        ${renderJourneySection(data.journey, lang)}
      </section>

      <section class="tab-panel ${data.activeTab === 'simulation' ? 'active' : ''}" id="simulation-panel">
        ${renderSimulationSection(data.simulation, data.availableScenarios, lang)}
      </section>

      <section class="tab-panel ${data.activeTab === 'unified' ? 'active' : ''}" id="unified-panel">
        ${renderUnifiedSection(data, lang)}
      </section>

    </main>

    <footer class="hall-footer">
      <p>${lang === 'zh' ? '大教堂形而上学引擎 · 版本 3.0' : 'Cathedral Metaphysics Engine · Version 3.0'}</p>
    </footer>

  </div>

  <script>
    ${getGrandHallScript()}
  </script>
</body>
</html>
  `.trim();
}

/**
 * Render Oracle section
 */
function renderOracleSection(oracle?: OracleResponse, lang: 'en' | 'zh' = 'en'): string {
  if (!oracle) {
    return `
      <div class="oracle-empty">
        <div class="oracle-icon">🔮</div>
        <h2>${lang === 'zh' ? '咨询神谕' : 'Consult the Oracle'}</h2>
        <p>${lang === 'zh' ? '选择一个问题类型来接收指导' : 'Choose a query type to receive guidance'}</p>
        <div class="oracle-query-buttons">
          <button class="query-btn" data-query="general_guidance">${lang === 'zh' ? '一般指导' : 'General Guidance'}</button>
          <button class="query-btn" data-query="shadow_prompt">${lang === 'zh' ? '阴影工作' : 'Shadow Work'}</button>
          <button class="query-btn" data-query="gift_insight">${lang === 'zh' ? '天赋洞见' : 'Gift Insight'}</button>
          <button class="query-btn" data-query="timing_wisdom">${lang === 'zh' ? '时机智慧' : 'Timing Wisdom'}</button>
          <button class="query-btn" data-query="ancestral_message">${lang === 'zh' ? '祖先信息' : 'Ancestral Message'}</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="oracle-response">
      <div class="oracle-voice">
        <span class="voice-label">${lang === 'zh' ? '以' : 'Voice of'}</span>
        <span class="voice-name">${oracle.voice}</span>
      </div>
      <blockquote class="oracle-message">
        ${lang === 'zh' ? oracle.messageZh : oracle.message}
      </blockquote>
      <div class="oracle-interpretation">
        <h3>${lang === 'zh' ? '解读' : 'Interpretation'}</h3>
        <div class="interpretation-grid">
          <div class="interp-item">
            <span class="interp-label">${lang === 'zh' ? '表层' : 'Surface'}</span>
            <p>${lang === 'zh' ? oracle.interpretation.surfaceZh : oracle.interpretation.surface}</p>
          </div>
          <div class="interp-item">
            <span class="interp-label">${lang === 'zh' ? '象征' : 'Symbolic'}</span>
            <p>${lang === 'zh' ? oracle.interpretation.symbolicZh : oracle.interpretation.symbolic}</p>
          </div>
          <div class="interp-item">
            <span class="interp-label">${lang === 'zh' ? '阴影' : 'Shadow'}</span>
            <p>${lang === 'zh' ? oracle.interpretation.shadowZh : oracle.interpretation.shadow}</p>
          </div>
          <div class="interp-item">
            <span class="interp-label">${lang === 'zh' ? '天赋' : 'Gift'}</span>
            <p>${lang === 'zh' ? oracle.interpretation.giftZh : oracle.interpretation.gift}</p>
          </div>
        </div>
      </div>
      ${oracle.actionPrompts.length > 0 ? `
        <div class="oracle-actions">
          <h3>${lang === 'zh' ? '行动提示' : 'Action Prompts'}</h3>
          <ul>
            ${oracle.actionPrompts.map(ap => `
              <li class="action-item urgency-${ap.urgency}">
                <span class="action-type">${ap.type}</span>
                ${lang === 'zh' ? ap.actionZh : ap.action}
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}
      <div class="oracle-resonance">
        <span>${lang === 'zh' ? '共鸣' : 'Resonance'}: ${oracle.resonanceLevel}%</span>
        <div class="resonance-bar" style="width: ${oracle.resonanceLevel}%"></div>
      </div>
    </div>
  `;
}

/**
 * Render Journey section
 */
function renderJourneySection(journey?: PilgrimJourney3, lang: 'en' | 'zh' = 'en'): string {
  if (!journey) {
    return `
      <div class="journey-empty">
        <div class="journey-icon">🗺️</div>
        <h2>${lang === 'zh' ? '开始你的旅程' : 'Begin Your Journey'}</h2>
        <p>${lang === 'zh' ? '旅程追踪器将显示你在英雄之旅中的位置' : 'The journey tracker will show your position on the hero\\'s path'}</p>
      </div>
    `;
  }

  const currentStageInfo = getStageInfo(journey.currentStage);
  const stageIndex = JOURNEY_STAGES.indexOf(journey.currentStage);

  return `
    <div class="journey-view">
      <div class="journey-map">
        <h3>${lang === 'zh' ? '旅程地图' : 'Journey Map'}</h3>
        <div class="stage-track">
          ${JOURNEY_STAGES.map((stage, idx) => {
            const info = getStageInfo(stage);
            const isCompleted = journey.completedStages.includes(stage);
            const isCurrent = stage === journey.currentStage;
            return `
              <div class="stage-node ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}">
                <div class="stage-marker">${idx + 1}</div>
                <span class="stage-name">${lang === 'zh' ? info.nameZh : info.name}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="current-stage">
        <h3>${lang === 'zh' ? currentStageInfo.nameZh : currentStageInfo.name}</h3>
        <p>${lang === 'zh' ? currentStageInfo.descriptionZh : currentStageInfo.description}</p>
        <div class="stage-progress">
          <div class="progress-bar" style="width: ${journey.stageProgress}%"></div>
          <span>${journey.stageProgress}%</span>
        </div>
      </div>

      <div class="journey-stats">
        <div class="stat-card">
          <span class="stat-value">${journey.integratedShadows.length}</span>
          <span class="stat-label">${lang === 'zh' ? '已整合阴影' : 'Shadows Integrated'}</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${journey.activatedGifts.length}</span>
          <span class="stat-label">${lang === 'zh' ? '已激活天赋' : 'Gifts Activated'}</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${journey.completedQuests.length}</span>
          <span class="stat-label">${lang === 'zh' ? '已完成任务' : 'Quests Completed'}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render Simulation section
 */
function renderSimulationSection(
  simulation?: SimulationResult,
  scenarios: SimulationScenario[] = [],
  lang: 'en' | 'zh' = 'en'
): string {
  const scenarioSelect = `
    <div class="simulation-selector">
      <h3>${lang === 'zh' ? '选择场景' : 'Select Scenario'}</h3>
      <div class="scenario-buttons">
        ${scenarios.map(s => `
          <button class="scenario-btn" data-scenario="${s}">
            ${getScenarioLabel(s, lang)}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  if (!simulation) {
    return `
      <div class="simulation-empty">
        <div class="simulation-icon">🔄</div>
        <h2>${lang === 'zh' ? '血脉模拟' : 'Lineage Simulation'}</h2>
        <p>${lang === 'zh' ? '探索"如果"场景，看看你的选择如何影响后代' : 'Explore "what if" scenarios to see how your choices affect future generations'}</p>
        ${scenarioSelect}
      </div>
    `;
  }

  return `
    <div class="simulation-results">
      ${scenarioSelect}

      <div class="simulation-header">
        <h3>${lang === 'zh' ? simulation.scenarioNameZh : simulation.scenarioName}</h3>
        <div class="sim-meta">
          <span>${lang === 'zh' ? '概率' : 'Probability'}: ${simulation.probability}%</span>
          <span>${lang === 'zh' ? '置信度' : 'Confidence'}: ${simulation.confidence}%</span>
        </div>
      </div>

      <div class="simulation-trajectory">
        <h4>${lang === 'zh' ? '轨迹' : 'Trajectory'}: ${simulation.summary.overallTrajectory}</h4>
        <div class="trajectory-bars">
          <div class="traj-bar">
            <span>${lang === 'zh' ? '疗愈潜力' : 'Healing Potential'}</span>
            <div class="bar-fill healing" style="width: ${simulation.summary.healingPotential}%"></div>
          </div>
          <div class="traj-bar">
            <span>${lang === 'zh' ? '风险水平' : 'Risk Level'}</span>
            <div class="bar-fill risk" style="width: ${simulation.summary.riskLevel}%"></div>
          </div>
        </div>
      </div>

      <div class="simulation-generations">
        <h4>${lang === 'zh' ? '预测的几代人' : 'Projected Generations'}</h4>
        <div class="gen-timeline">
          ${simulation.projectedGenerations.map(gen => `
            <div class="gen-card state-${gen.energeticState}">
              <span class="gen-label">${lang === 'zh' ? gen.labelZh : gen.label}</span>
              <span class="gen-state">${gen.energeticState}</span>
              <p class="gen-notes">${lang === 'zh' ? gen.notesZh : gen.notes}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="simulation-insight">
        <blockquote>${lang === 'zh' ? simulation.summary.keyInsightZh : simulation.summary.keyInsight}</blockquote>
      </div>

      <div class="simulation-recommendation">
        <h4>${lang === 'zh' ? '建议' : 'Recommendation'}</h4>
        <p>${lang === 'zh' ? simulation.summary.recommendationZh : simulation.summary.recommendation}</p>
      </div>
    </div>
  `;
}

/**
 * Get scenario label
 */
function getScenarioLabel(scenario: SimulationScenario, lang: 'en' | 'zh'): string {
  const labels: Record<SimulationScenario, { en: string; zh: string }> = {
    'pattern_continues': { en: 'Pattern Continues', zh: '模式延续' },
    'cycle_breaks': { en: 'Cycle Breaks', zh: '循环打破' },
    'debt_resolved': { en: 'Debt Resolved', zh: '债务清偿' },
    'gift_activated': { en: 'Gift Activated', zh: '天赋激活' },
    'shadow_integrated': { en: 'Shadow Integrated', zh: '阴影整合' },
    'new_pattern_starts': { en: 'New Pattern', zh: '新模式' },
    'healing_propagates': { en: 'Healing Spreads', zh: '疗愈传播' },
    'custom': { en: 'Custom', zh: '自定义' }
  };
  return labels[scenario][lang];
}

/**
 * Render Unified section
 */
function renderUnifiedSection(data: GrandHallData, lang: 'en' | 'zh'): string {
  return `
    <div class="unified-view">
      <h2>${lang === 'zh' ? '统一智慧视图' : 'Unified Wisdom View'}</h2>

      <div class="unified-grid">
        <div class="unified-card oracle-mini">
          <h3>🔮 ${lang === 'zh' ? '神谕' : 'Oracle'}</h3>
          ${data.oracleResponse
            ? `<blockquote>${(lang === 'zh' ? data.oracleResponse.messageZh : data.oracleResponse.message).substring(0, 100)}...</blockquote>`
            : `<p class="empty">${lang === 'zh' ? '等待咨询' : 'Awaiting consultation'}</p>`
          }
        </div>

        <div class="unified-card journey-mini">
          <h3>🗺️ ${lang === 'zh' ? '旅程' : 'Journey'}</h3>
          ${data.journey
            ? `<p>${lang === 'zh' ? getStageInfo(data.journey.currentStage).nameZh : getStageInfo(data.journey.currentStage).name} (${data.journey.stageProgress}%)</p>`
            : `<p class="empty">${lang === 'zh' ? '等待初始化' : 'Awaiting initialization'}</p>`
          }
        </div>

        <div class="unified-card simulation-mini">
          <h3>🔄 ${lang === 'zh' ? '模拟' : 'Simulation'}</h3>
          ${data.simulation
            ? `<p>${lang === 'zh' ? data.simulation.scenarioNameZh : data.simulation.scenarioName}<br>${data.simulation.summary.overallTrajectory}</p>`
            : `<p class="empty">${lang === 'zh' ? '等待场景' : 'Awaiting scenario'}</p>`
          }
        </div>
      </div>

      <div class="unified-synthesis">
        <h3>${lang === 'zh' ? '综合洞见' : 'Synthesized Insight'}</h3>
        <p>${generateUnifiedInsight(data, lang)}</p>
      </div>
    </div>
  `;
}

/**
 * Generate unified insight
 */
function generateUnifiedInsight(data: GrandHallData, lang: 'en' | 'zh'): string {
  const parts: string[] = [];

  if (data.journey) {
    const stageInfo = getStageInfo(data.journey.currentStage);
    parts.push(lang === 'zh'
      ? `你正处于「${stageInfo.nameZh}」阶段。`
      : `You are in the ${stageInfo.name} stage.`
    );
  }

  if (data.simulation) {
    parts.push(lang === 'zh'
      ? `如果${data.simulation.scenarioNameZh}，轨迹显示${data.simulation.summary.overallTrajectory}。`
      : `If ${data.simulation.scenarioName.toLowerCase()}, trajectory shows ${data.simulation.summary.overallTrajectory}.`
    );
  }

  if (data.oracleResponse) {
    parts.push(lang === 'zh'
      ? `神谕共鸣：${data.oracleResponse.resonanceLevel}%。`
      : `Oracle resonance: ${data.oracleResponse.resonanceLevel}%.`
    );
  }

  if (parts.length === 0) {
    return lang === 'zh'
      ? '探索上面的标签页以接收指导、追踪旅程、模拟未来。'
      : 'Explore the tabs above to receive guidance, track your journey, and simulate futures.';
  }

  return parts.join(' ');
}

// ==================== STYLES ====================

function getGrandHallStyles(theme: 'light' | 'dark' | 'temple'): string {
  const colors = {
    'light': { bg: '#f5f3f0', text: '#3a3a3a', accent: '#8b7355', card: '#ffffff' },
    'dark': { bg: '#1a1a2e', text: '#e8e4dc', accent: '#c9a96e', card: '#252545' },
    'temple': { bg: '#2d2416', text: '#e8dcc8', accent: '#d4a84b', card: '#3d3220' }
  };
  const c = colors[theme];

  return `
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
  background: ${c.bg};
  color: ${c.text};
  min-height: 100vh;
}

.grand-hall {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.hall-header {
  text-align: center;
  padding: 48px 0;
  border-bottom: 2px solid ${c.accent};
}

.hall-symbol { font-size: 4rem; margin-bottom: 16px; }
.hall-header h1 { font-size: 2.5rem; color: ${c.accent}; margin-bottom: 8px; }
.hall-subtitle { font-size: 1.2rem; opacity: 0.8; font-style: italic; }
.pilgrim-name { margin-top: 16px; font-size: 1rem; opacity: 0.7; }

.hall-nav {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 24px 0;
  flex-wrap: wrap;
}

.nav-tab {
  padding: 12px 24px;
  background: transparent;
  border: 2px solid ${c.accent};
  color: ${c.text};
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-tab:hover { background: ${c.accent}20; }
.nav-tab.active { background: ${c.accent}; color: ${c.bg}; }

.tab-panel { display: none; padding: 24px 0; }
.tab-panel.active { display: block; }

/* Oracle Styles */
.oracle-empty, .journey-empty, .simulation-empty {
  text-align: center;
  padding: 64px 24px;
}

.oracle-icon, .journey-icon, .simulation-icon {
  font-size: 4rem;
  margin-bottom: 24px;
}

.oracle-query-buttons, .scenario-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
}

.query-btn, .scenario-btn {
  padding: 12px 20px;
  background: ${c.card};
  border: 1px solid ${c.accent}40;
  color: ${c.text};
  font-family: inherit;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.query-btn:hover, .scenario-btn:hover {
  background: ${c.accent};
  color: ${c.bg};
}

.oracle-response { max-width: 800px; margin: 0 auto; }

.oracle-voice {
  text-align: center;
  margin-bottom: 24px;
  font-size: 0.9rem;
  opacity: 0.7;
}

.voice-name { text-transform: capitalize; font-weight: bold; }

.oracle-message {
  font-size: 1.3rem;
  line-height: 1.8;
  padding: 32px;
  background: ${c.card};
  border-left: 4px solid ${c.accent};
  border-radius: 8px;
  margin-bottom: 32px;
  font-style: italic;
}

.interpretation-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.interp-item {
  background: ${c.card};
  padding: 16px;
  border-radius: 8px;
}

.interp-label {
  display: block;
  font-size: 0.85rem;
  color: ${c.accent};
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.oracle-actions ul { list-style: none; margin-top: 16px; }

.action-item {
  padding: 12px 16px;
  background: ${c.card};
  margin-bottom: 8px;
  border-radius: 6px;
  border-left: 3px solid ${c.accent};
}

.action-type {
  font-size: 0.75rem;
  text-transform: uppercase;
  background: ${c.accent}30;
  padding: 2px 8px;
  border-radius: 4px;
  margin-right: 8px;
}

.oracle-resonance {
  margin-top: 32px;
  text-align: center;
}

.resonance-bar {
  height: 6px;
  background: ${c.accent};
  border-radius: 3px;
  margin-top: 8px;
}

/* Journey Styles */
.journey-view { max-width: 900px; margin: 0 auto; }

.stage-track {
  display: flex;
  overflow-x: auto;
  padding: 24px 0;
  gap: 8px;
}

.stage-node {
  flex-shrink: 0;
  text-align: center;
  padding: 12px;
  min-width: 100px;
}

.stage-marker {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${c.card};
  border: 2px solid ${c.accent}40;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  font-weight: bold;
}

.stage-node.completed .stage-marker { background: ${c.accent}; color: ${c.bg}; }
.stage-node.current .stage-marker { border-color: ${c.accent}; border-width: 3px; }

.stage-name { font-size: 0.75rem; opacity: 0.8; }

.current-stage {
  background: ${c.card};
  padding: 32px;
  border-radius: 12px;
  margin: 24px 0;
  text-align: center;
}

.stage-progress {
  margin-top: 16px;
  background: ${c.bg};
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  height: 24px;
}

.progress-bar {
  height: 100%;
  background: ${c.accent};
  transition: width 0.3s;
}

.stage-progress span {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.85rem;
}

.journey-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card {
  background: ${c.card};
  padding: 24px;
  border-radius: 12px;
  text-align: center;
}

.stat-value { font-size: 2.5rem; color: ${c.accent}; display: block; }
.stat-label { font-size: 0.85rem; opacity: 0.7; }

/* Simulation Styles */
.simulation-results, .simulation-empty { max-width: 900px; margin: 0 auto; }

.simulation-header {
  text-align: center;
  padding: 24px 0;
  border-bottom: 1px solid ${c.accent}30;
}

.sim-meta { margin-top: 8px; opacity: 0.7; }
.sim-meta span { margin: 0 12px; }

.trajectory-bars { margin-top: 16px; }

.traj-bar {
  margin-bottom: 12px;
}

.traj-bar span { font-size: 0.85rem; display: block; margin-bottom: 4px; }

.bar-fill {
  height: 12px;
  border-radius: 6px;
  transition: width 0.5s;
}

.bar-fill.healing { background: linear-gradient(90deg, #4CAF50, #8BC34A); }
.bar-fill.risk { background: linear-gradient(90deg, #ff9800, #f44336); }

.gen-timeline {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 24px 0;
}

.gen-card {
  flex-shrink: 0;
  width: 200px;
  padding: 16px;
  background: ${c.card};
  border-radius: 8px;
  border-top: 4px solid ${c.accent};
}

.gen-card.state-thriving { border-color: #4CAF50; }
.gen-card.state-healing { border-color: #8BC34A; }
.gen-card.state-transforming { border-color: #9C27B0; }
.gen-card.state-struggling { border-color: #f44336; }
.gen-card.state-dormant { border-color: #9e9e9e; }

.gen-label { font-weight: bold; display: block; margin-bottom: 8px; }
.gen-state { font-size: 0.85rem; color: ${c.accent}; text-transform: capitalize; }
.gen-notes { font-size: 0.85rem; margin-top: 12px; opacity: 0.8; }

.simulation-insight blockquote {
  font-style: italic;
  padding: 24px;
  background: ${c.card};
  border-radius: 8px;
  margin: 24px 0;
}

/* Unified View */
.unified-view { max-width: 900px; margin: 0 auto; }

.unified-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 24px 0;
}

.unified-card {
  background: ${c.card};
  padding: 20px;
  border-radius: 12px;
  min-height: 150px;
}

.unified-card h3 { margin-bottom: 12px; font-size: 1rem; }
.unified-card blockquote { font-size: 0.9rem; font-style: italic; }
.unified-card .empty { opacity: 0.5; font-size: 0.9rem; }

.unified-synthesis {
  background: ${c.card};
  padding: 32px;
  border-radius: 12px;
  text-align: center;
}

/* Footer */
.hall-footer {
  text-align: center;
  padding: 32px;
  margin-top: 48px;
  border-top: 1px solid ${c.accent}30;
  opacity: 0.6;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .interpretation-grid, .journey-stats, .unified-grid { grid-template-columns: 1fr; }
  .stage-track { justify-content: flex-start; }
}
  `.trim();
}

// ==================== SCRIPT ====================

function getGrandHallScript(): string {
  return `
(function() {
  // Tab switching
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.dataset.tab;

      // Update active tab
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // Show corresponding panel
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(tabName + '-panel').classList.add('active');
    });
  });

  // Oracle query buttons (placeholder for actual functionality)
  document.querySelectorAll('.query-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const queryType = this.dataset.query;
      console.log('Oracle query:', queryType);
      // This would trigger the actual oracle consultation
    });
  });

  // Scenario buttons (placeholder for actual functionality)
  document.querySelectorAll('.scenario-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const scenario = this.dataset.scenario;
      console.log('Simulation scenario:', scenario);
      // This would trigger the actual simulation
    });
  });
})();
  `.trim();
}

// ==================== EXPORTS ====================

export {
  renderGrandHallHtml,
  GrandHallData
};
