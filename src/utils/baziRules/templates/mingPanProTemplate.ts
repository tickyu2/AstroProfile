/**
 * ============================================
 * MING PAN PRO TEMPLATE
 * Professional BaZi Technical View
 *
 * Mirrors Joey Yap's professional BaZi software:
 * - Core BaZi chart (Four Pillars)
 * - Luck Pillars (大运)
 * - Annual Analysis (流年)
 * - Pillar Interactions (clashes, harms, Fu Yin, DE)
 *
 * Wired into Cathedral engines for full integration.
 * ============================================
 */

// ==================== DATA MODEL ====================

export interface BaZiChartData {
  name?: string;
  birthDate: string;
  birthTime?: string;
  gender?: 'male' | 'female';
  yearPillar: { stem: string; stemZh: string; branch: string; branchZh: string; };
  monthPillar: { stem: string; stemZh: string; branch: string; branchZh: string; };
  dayPillar: { stem: string; stemZh: string; branch: string; branchZh: string; };
  hourPillar: { stem: string; stemZh: string; branch: string; branchZh: string; };
  dayMaster: string;
  dayMasterZh: string;
  dayMasterElement: string;
}

export interface LuckPillarData {
  index: number;
  startAge: number;
  endAge: number;
  stem: string;
  stemZh: string;
  branch: string;
  branchZh: string;
  element: string;
  favorability?: 'favorable' | 'unfavorable' | 'neutral';
  notes?: string;
}

export interface AnnualAnalysisData {
  year: number;
  stem: string;
  stemZh: string;
  branch: string;
  branchZh: string;
  element: string;
  notes?: string;
  favorability?: 'favorable' | 'unfavorable' | 'neutral';
}

export interface PillarInteraction {
  type: 'clash' | 'harm' | 'punishment' | 'combination' | 'fu_yin' | 'fan_yin' | 'death_emptiness';
  typeZh: string;
  participants: string[];
  description: string;
  descriptionZh: string;
  severity: 'mild' | 'moderate' | 'strong';
  effect: 'positive' | 'negative' | 'neutral';
}

export interface MingPanProData {
  chart: BaZiChartData;
  luckPillars: LuckPillarData[];
  annualAnalysis: AnnualAnalysisData[];
  interactions: PillarInteraction[];
  usefulGod?: { element: string; elementZh: string; };
  annoyingGod?: { element: string; elementZh: string; };
}

// ==================== HTML RENDERING ====================

/**
 * Render complete Ming Pan Pro HTML
 */
export function renderMingPanProHtml(data: MingPanProData, lang: 'en' | 'zh' = 'en'): string {
  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lang === 'zh' ? '命盘专业版' : 'Ming Pan Pro'}</title>
  <style>
    ${getMingPanProStyles()}
  </style>
</head>
<body>
  <div class="mingpan-pro">
    <header class="pro-header">
      <h1>${lang === 'zh' ? '🏛️ 命盘专业版' : '🏛️ Ming Pan Pro'}</h1>
      <p class="subtitle">${lang === 'zh' ? '专业八字技术视图' : 'Professional BaZi Technical View'}</p>
      ${data.chart.name ? `<p class="chart-name">${data.chart.name}</p>` : ''}
      <p class="birth-info">${data.chart.birthDate}${data.chart.birthTime ? ` ${data.chart.birthTime}` : ''}</p>
    </header>

    <div class="pro-grid">
      ${renderCoreChartPanel(data.chart, lang)}
      ${renderLuckPillarsPanel(data.luckPillars, lang)}
      ${renderAnnualAnalysisPanel(data.annualAnalysis, lang)}
      ${renderInteractionsPanel(data.interactions, lang)}
      ${data.usefulGod || data.annoyingGod ? renderUsefulGodPanel(data, lang) : ''}
    </div>
  </div>

  <script>
    window.MINGPAN_DATA = ${JSON.stringify(data)};
    ${getMingPanProScript()}
  </script>
</body>
</html>
  `.trim();
}

/**
 * Render core BaZi chart panel
 */
function renderCoreChartPanel(chart: BaZiChartData, lang: 'en' | 'zh'): string {
  const pillars = [
    { label: lang === 'zh' ? '年柱' : 'Year', pillar: chart.yearPillar },
    { label: lang === 'zh' ? '月柱' : 'Month', pillar: chart.monthPillar },
    { label: lang === 'zh' ? '日柱' : 'Day', pillar: chart.dayPillar },
    { label: lang === 'zh' ? '时柱' : 'Hour', pillar: chart.hourPillar }
  ];

  return `
    <section class="panel core-chart" id="core-chart">
      <h2>${lang === 'zh' ? '四柱八字' : 'Four Pillars'}</h2>
      <div class="pillars-grid">
        ${pillars.map(p => `
          <div class="pillar">
            <div class="pillar-label">${p.label}</div>
            <div class="pillar-stem">${lang === 'zh' ? p.pillar.stemZh : p.pillar.stem}</div>
            <div class="pillar-branch">${lang === 'zh' ? p.pillar.branchZh : p.pillar.branch}</div>
          </div>
        `).join('')}
      </div>
      <div class="day-master-info">
        <span class="label">${lang === 'zh' ? '日主' : 'Day Master'}:</span>
        <span class="value">${lang === 'zh' ? chart.dayMasterZh : chart.dayMaster} (${chart.dayMasterElement})</span>
      </div>
    </section>
  `;
}

/**
 * Render luck pillars panel
 */
function renderLuckPillarsPanel(luckPillars: LuckPillarData[], lang: 'en' | 'zh'): string {
  return `
    <section class="panel luck-pillars" id="luck-pillars">
      <h2>${lang === 'zh' ? '大运' : 'Luck Pillars'}</h2>
      <div class="luck-pillars-grid">
        ${luckPillars.map(lp => `
          <div class="luck-pillar ${lp.favorability || ''}">
            <div class="age-range">${lp.startAge}–${lp.endAge}</div>
            <div class="lp-stem">${lang === 'zh' ? lp.stemZh : lp.stem}</div>
            <div class="lp-branch">${lang === 'zh' ? lp.branchZh : lp.branch}</div>
            <div class="lp-element">${lp.element}</div>
            ${lp.notes ? `<div class="lp-notes">${lp.notes}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

/**
 * Render annual analysis panel
 */
function renderAnnualAnalysisPanel(annualAnalysis: AnnualAnalysisData[], lang: 'en' | 'zh'): string {
  return `
    <section class="panel annual-analysis" id="annual-analysis">
      <h2>${lang === 'zh' ? '流年分析' : 'Annual Analysis'}</h2>
      <div class="annual-list">
        ${annualAnalysis.map(a => `
          <div class="annual-row ${a.favorability || ''}">
            <span class="year">${a.year}</span>
            <span class="stem-branch">${lang === 'zh' ? a.stemZh : a.stem} ${lang === 'zh' ? a.branchZh : a.branch}</span>
            <span class="element">${a.element}</span>
            ${a.notes ? `<span class="notes">${a.notes}</span>` : ''}
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

/**
 * Render pillar interactions panel
 */
function renderInteractionsPanel(interactions: PillarInteraction[], lang: 'en' | 'zh'): string {
  const grouped = groupInteractionsByType(interactions);

  return `
    <section class="panel interactions" id="pillar-interactions">
      <h2>${lang === 'zh' ? '柱位互动' : 'Pillar Interactions'}</h2>
      ${Object.entries(grouped).map(([type, ints]) => `
        <div class="interaction-group">
          <h4>${lang === 'zh' ? ints[0].typeZh : type.replace('_', ' ').toUpperCase()}</h4>
          ${ints.map(i => `
            <div class="interaction ${i.severity} ${i.effect}">
              <span class="participants">${i.participants.join(' ↔ ')}</span>
              <span class="description">${lang === 'zh' ? i.descriptionZh : i.description}</span>
            </div>
          `).join('')}
        </div>
      `).join('')}
      ${interactions.length === 0 ? `<p class="no-interactions">${lang === 'zh' ? '无显著互动' : 'No significant interactions'}</p>` : ''}
    </section>
  `;
}

/**
 * Render useful/annoying god panel
 */
function renderUsefulGodPanel(data: MingPanProData, lang: 'en' | 'zh'): string {
  return `
    <section class="panel useful-god" id="useful-god">
      <h2>${lang === 'zh' ? '用神忌神' : 'Useful & Annoying Gods'}</h2>
      ${data.usefulGod ? `
        <div class="god-item favorable">
          <span class="label">${lang === 'zh' ? '用神' : 'Useful God'}:</span>
          <span class="value">${lang === 'zh' ? data.usefulGod.elementZh : data.usefulGod.element}</span>
        </div>
      ` : ''}
      ${data.annoyingGod ? `
        <div class="god-item unfavorable">
          <span class="label">${lang === 'zh' ? '忌神' : 'Annoying God'}:</span>
          <span class="value">${lang === 'zh' ? data.annoyingGod.elementZh : data.annoyingGod.element}</span>
        </div>
      ` : ''}
    </section>
  `;
}

/**
 * Group interactions by type
 */
function groupInteractionsByType(interactions: PillarInteraction[]): Record<string, PillarInteraction[]> {
  return interactions.reduce((acc, int) => {
    if (!acc[int.type]) acc[int.type] = [];
    acc[int.type].push(int);
    return acc;
  }, {} as Record<string, PillarInteraction[]>);
}

// ==================== COMPONENT RENDERING ====================

/**
 * Render just the core chart component
 */
export function renderCoreChartComponent(chart: BaZiChartData, lang: 'en' | 'zh' = 'en'): string {
  return renderCoreChartPanel(chart, lang);
}

/**
 * Render just the luck pillars component
 */
export function renderLuckPillarsComponent(luckPillars: LuckPillarData[], lang: 'en' | 'zh' = 'en'): string {
  return renderLuckPillarsPanel(luckPillars, lang);
}

/**
 * Render just the annual analysis component
 */
export function renderAnnualAnalysisComponent(annualAnalysis: AnnualAnalysisData[], lang: 'en' | 'zh' = 'en'): string {
  return renderAnnualAnalysisPanel(annualAnalysis, lang);
}

/**
 * Render just the interactions component
 */
export function renderInteractionsComponent(interactions: PillarInteraction[], lang: 'en' | 'zh' = 'en'): string {
  return renderInteractionsPanel(interactions, lang);
}

// ==================== STYLES ====================

/**
 * Get Ming Pan Pro styles
 */
export function getMingPanProStyles(): string {
  return `
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
  background: linear-gradient(135deg, #faf8f5 0%, #f0ece4 100%);
  min-height: 100vh;
  color: #3a3a3a;
}

.mingpan-pro {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.pro-header {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 3px double #c4b494;
}

.pro-header h1 {
  font-size: 2rem;
  color: #5a4a3a;
  margin-bottom: 8px;
}

.subtitle {
  color: #7a6a5a;
  font-style: italic;
  margin-bottom: 8px;
}

.chart-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #5a4a3a;
}

.birth-info {
  color: #8a7a6a;
}

.pro-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (max-width: 900px) {
  .pro-grid {
    grid-template-columns: 1fr;
  }
}

.panel {
  background: #fffdf7;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e0d0;
}

.panel h2 {
  font-size: 1.1rem;
  color: #5a4a3a;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #d4c5a9;
}

/* Core Chart */
.pillars-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.pillar {
  text-align: center;
  padding: 12px 8px;
  background: #f8f5ed;
  border-radius: 8px;
  border: 1px solid #e0d8c8;
}

.pillar-label {
  font-size: 0.8rem;
  color: #8a7a6a;
  margin-bottom: 8px;
}

.pillar-stem {
  font-size: 1.4rem;
  font-weight: 700;
  color: #5a4a3a;
  margin-bottom: 4px;
}

.pillar-branch {
  font-size: 1.4rem;
  font-weight: 700;
  color: #7a5a4a;
}

.day-master-info {
  text-align: center;
  padding: 12px;
  background: #f0ece4;
  border-radius: 8px;
}

.day-master-info .label {
  color: #7a6a5a;
}

.day-master-info .value {
  font-weight: 700;
  color: #5a4a3a;
  margin-left: 8px;
}

/* Luck Pillars */
.luck-pillars-grid {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.luck-pillar {
  flex: 0 0 auto;
  min-width: 70px;
  text-align: center;
  padding: 10px 8px;
  background: #f8f5ed;
  border-radius: 8px;
  border: 1px solid #e0d8c8;
}

.luck-pillar.favorable {
  background: #e8f5e8;
  border-color: #a8d8a8;
}

.luck-pillar.unfavorable {
  background: #f5e8e8;
  border-color: #d8a8a8;
}

.age-range {
  font-size: 0.75rem;
  color: #8a7a6a;
  margin-bottom: 6px;
}

.lp-stem, .lp-branch {
  font-size: 1.1rem;
  font-weight: 600;
  color: #5a4a3a;
}

.lp-element {
  font-size: 0.75rem;
  color: #7a6a5a;
  margin-top: 4px;
}

.lp-notes {
  font-size: 0.7rem;
  color: #9a8a7a;
  margin-top: 4px;
}

/* Annual Analysis */
.annual-list {
  max-height: 300px;
  overflow-y: auto;
}

.annual-row {
  display: grid;
  grid-template-columns: 60px 80px 60px 1fr;
  gap: 12px;
  padding: 8px 12px;
  border-bottom: 1px solid #f0ece4;
  align-items: center;
}

.annual-row:last-child {
  border-bottom: none;
}

.annual-row.favorable {
  background: #f0f8f0;
}

.annual-row.unfavorable {
  background: #f8f0f0;
}

.annual-row .year {
  font-weight: 600;
  color: #5a4a3a;
}

.annual-row .stem-branch {
  color: #6a5a4a;
}

.annual-row .element {
  font-size: 0.85rem;
  color: #7a6a5a;
}

.annual-row .notes {
  font-size: 0.8rem;
  color: #8a7a6a;
}

/* Interactions */
.interaction-group {
  margin-bottom: 16px;
}

.interaction-group h4 {
  font-size: 0.9rem;
  color: #6a5a4a;
  margin-bottom: 8px;
  text-transform: capitalize;
}

.interaction {
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  margin-bottom: 6px;
  border-radius: 6px;
  background: #f8f5ed;
  border-left: 3px solid #d4c5a9;
}

.interaction.positive {
  border-left-color: #88c088;
  background: #f0f8f0;
}

.interaction.negative {
  border-left-color: #c08888;
  background: #f8f0f0;
}

.interaction.strong {
  border-left-width: 5px;
}

.interaction .participants {
  font-weight: 600;
  color: #5a4a3a;
  margin-bottom: 4px;
}

.interaction .description {
  font-size: 0.85rem;
  color: #6a5a4a;
}

.no-interactions {
  color: #9a8a7a;
  font-style: italic;
  text-align: center;
  padding: 20px;
}

/* Useful God */
.god-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  background: #f8f5ed;
}

.god-item.favorable {
  background: #e8f5e8;
}

.god-item.unfavorable {
  background: #f5e8e8;
}

.god-item .label {
  color: #6a5a4a;
}

.god-item .value {
  font-weight: 700;
  color: #5a4a3a;
}

/* Print styles */
@media print {
  body {
    background: white;
  }
  .mingpan-pro {
    padding: 0;
  }
  .panel {
    box-shadow: none;
    border: 1px solid #ccc;
    page-break-inside: avoid;
  }
}
  `.trim();
}

// ==================== SCRIPT ====================

/**
 * Get Ming Pan Pro JavaScript
 */
export function getMingPanProScript(): string {
  return `
// Interactive features
document.querySelectorAll('.pillar').forEach(pillar => {
  pillar.addEventListener('click', function() {
    document.querySelectorAll('.pillar').forEach(p => p.classList.remove('selected'));
    this.classList.add('selected');
  });
});

document.querySelectorAll('.luck-pillar').forEach(lp => {
  lp.addEventListener('click', function() {
    document.querySelectorAll('.luck-pillar').forEach(p => p.classList.remove('selected'));
    this.classList.add('selected');
  });
});

// Print function
function printMingPan() {
  window.print();
}
  `.trim();
}

// ==================== EXPORTS ====================

export {
  renderMingPanProHtml,
  renderCoreChartComponent,
  renderLuckPillarsComponent,
  renderAnnualAnalysisComponent,
  renderInteractionsComponent,
  getMingPanProStyles,
  getMingPanProScript
};
