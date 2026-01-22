/**
 * ============================================
 * BAZI PROFILING DASHBOARD TEMPLATE
 * Professional profiling views:
 * - Personality traits
 * - Work style
 * - Team compatibility
 *
 * Backed by narrative + constellation engines.
 * ============================================
 */

// ==================== DATA MODEL ====================

export interface PersonalityTrait {
  id: string;
  name: string;
  nameZh: string;
  score: number;          // 0-100
  description: string;
  descriptionZh: string;
  category: 'strength' | 'challenge' | 'neutral';
  element?: string;
}

export interface WorkStyleAttribute {
  id: string;
  name: string;
  nameZh: string;
  score: number;          // 0-100
  description: string;
  descriptionZh: string;
  workType: 'leadership' | 'collaboration' | 'analysis' | 'creativity' | 'execution';
}

export interface TeamCompatibility {
  personId: string;
  personName: string;
  personNameZh?: string;
  compatibilityScore: number;  // 0-100
  synergies: string[];
  frictions: string[];
  notes?: string;
  notesZh?: string;
}

export interface ProfilePersonality {
  traits: PersonalityTrait[];
  dominantElement: string;
  dominantElementZh: string;
  summary: string;
  summaryZh: string;
}

export interface ProfileWorkStyle {
  attributes: WorkStyleAttribute[];
  primaryStyle: string;
  primaryStyleZh: string;
  summary: string;
  summaryZh: string;
}

export interface ProfileTeamCompat {
  matches: TeamCompatibility[];
  overallTeamHarmony: number;  // 0-100
  summary: string;
  summaryZh: string;
}

export interface ProfilingDashboardData {
  subjectName?: string;
  personality: ProfilePersonality;
  workStyle: ProfileWorkStyle;
  teamCompat?: ProfileTeamCompat;
}

// ==================== HTML RENDERING ====================

/**
 * Render complete profiling dashboard HTML
 */
export function renderProfilingDashboardHtml(
  data: ProfilingDashboardData,
  lang: 'en' | 'zh' = 'en'
): string {
  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lang === 'zh' ? '八字剖析仪表板' : 'BaZi Profiling Dashboard'}</title>
  <style>
    ${getProfilingDashboardStyles()}
  </style>
</head>
<body>
  <div class="profiling-dashboard">
    <header class="dashboard-header">
      <h1>${lang === 'zh' ? '📊 八字剖析仪表板' : '📊 BaZi Profiling Dashboard'}</h1>
      <p class="subtitle">${lang === 'zh' ? '性格 • 工作风格 • 团队协作' : 'Personality • Work Style • Team Dynamics'}</p>
      ${data.subjectName ? `<p class="subject-name">${data.subjectName}</p>` : ''}
    </header>

    <div class="profile-grid">
      ${renderPersonalityPanel(data.personality, lang)}
      ${renderWorkStylePanel(data.workStyle, lang)}
      ${data.teamCompat ? renderTeamCompatPanel(data.teamCompat, lang) : ''}
    </div>
  </div>

  <script>
    window.PROFILING_DATA = ${JSON.stringify(data)};
    ${getProfilingDashboardScript()}
  </script>
</body>
</html>
  `.trim();
}

/**
 * Render personality panel
 */
function renderPersonalityPanel(personality: ProfilePersonality, lang: 'en' | 'zh'): string {
  const summary = lang === 'zh' ? personality.summaryZh : personality.summary;
  const dominantElement = lang === 'zh' ? personality.dominantElementZh : personality.dominantElement;

  return `
    <section class="panel personality" id="personality">
      <h2>${lang === 'zh' ? '性格特质' : 'Personality Traits'}</h2>
      <div class="dominant-element">
        <span class="label">${lang === 'zh' ? '主导元素' : 'Dominant Element'}:</span>
        <span class="value">${dominantElement}</span>
      </div>
      <p class="panel-summary">${summary}</p>
      <div class="traits-list">
        ${personality.traits.map(trait => renderTraitBar(trait, lang)).join('')}
      </div>
    </section>
  `;
}

/**
 * Render trait bar
 */
function renderTraitBar(trait: PersonalityTrait, lang: 'en' | 'zh'): string {
  const name = lang === 'zh' ? trait.nameZh : trait.name;
  const description = lang === 'zh' ? trait.descriptionZh : trait.description;

  return `
    <div class="trait-item ${trait.category}" title="${description}">
      <div class="trait-header">
        <span class="trait-name">${name}</span>
        <span class="trait-score">${trait.score}%</span>
      </div>
      <div class="trait-bar">
        <div class="trait-fill" style="width: ${trait.score}%"></div>
      </div>
      <p class="trait-desc">${description}</p>
    </div>
  `;
}

/**
 * Render work style panel
 */
function renderWorkStylePanel(workStyle: ProfileWorkStyle, lang: 'en' | 'zh'): string {
  const summary = lang === 'zh' ? workStyle.summaryZh : workStyle.summary;
  const primaryStyle = lang === 'zh' ? workStyle.primaryStyleZh : workStyle.primaryStyle;

  return `
    <section class="panel work-style" id="work-style">
      <h2>${lang === 'zh' ? '工作风格' : 'Work Style'}</h2>
      <div class="primary-style">
        <span class="label">${lang === 'zh' ? '主要风格' : 'Primary Style'}:</span>
        <span class="value">${primaryStyle}</span>
      </div>
      <p class="panel-summary">${summary}</p>
      <div class="style-radar">
        ${renderWorkStyleRadar(workStyle.attributes, lang)}
      </div>
      <div class="attributes-list">
        ${workStyle.attributes.map(attr => renderAttributeItem(attr, lang)).join('')}
      </div>
    </section>
  `;
}

/**
 * Render work style radar (simplified bar chart)
 */
function renderWorkStyleRadar(attributes: WorkStyleAttribute[], lang: 'en' | 'zh'): string {
  const workTypes = ['leadership', 'collaboration', 'analysis', 'creativity', 'execution'];
  const typeLabels: Record<string, { en: string; zh: string }> = {
    leadership: { en: 'Leadership', zh: '领导力' },
    collaboration: { en: 'Collaboration', zh: '协作' },
    analysis: { en: 'Analysis', zh: '分析' },
    creativity: { en: 'Creativity', zh: '创造力' },
    execution: { en: 'Execution', zh: '执行力' }
  };

  const typeScores = workTypes.map(type => {
    const typeAttrs = attributes.filter(a => a.workType === type);
    const avgScore = typeAttrs.length > 0
      ? Math.round(typeAttrs.reduce((sum, a) => sum + a.score, 0) / typeAttrs.length)
      : 50;
    return { type, label: lang === 'zh' ? typeLabels[type].zh : typeLabels[type].en, score: avgScore };
  });

  return `
    <div class="radar-chart">
      ${typeScores.map(ts => `
        <div class="radar-axis">
          <span class="axis-label">${ts.label}</span>
          <div class="axis-bar">
            <div class="axis-fill" style="width: ${ts.score}%"></div>
          </div>
          <span class="axis-score">${ts.score}%</span>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Render attribute item
 */
function renderAttributeItem(attr: WorkStyleAttribute, lang: 'en' | 'zh'): string {
  const name = lang === 'zh' ? attr.nameZh : attr.name;
  const description = lang === 'zh' ? attr.descriptionZh : attr.description;

  return `
    <div class="attribute-item">
      <div class="attr-header">
        <span class="attr-name">${name}</span>
        <span class="attr-type">${attr.workType}</span>
      </div>
      <p class="attr-desc">${description}</p>
    </div>
  `;
}

/**
 * Render team compatibility panel
 */
function renderTeamCompatPanel(teamCompat: ProfileTeamCompat, lang: 'en' | 'zh'): string {
  const summary = lang === 'zh' ? teamCompat.summaryZh : teamCompat.summary;

  return `
    <section class="panel team-compat" id="team-compat">
      <h2>${lang === 'zh' ? '团队协作性' : 'Team Compatibility'}</h2>
      <div class="team-harmony">
        <span class="label">${lang === 'zh' ? '团队和谐度' : 'Team Harmony'}:</span>
        <div class="harmony-meter">
          <div class="harmony-fill" style="width: ${teamCompat.overallTeamHarmony}%"></div>
        </div>
        <span class="harmony-value">${teamCompat.overallTeamHarmony}%</span>
      </div>
      <p class="panel-summary">${summary}</p>
      <div class="matches-list">
        ${teamCompat.matches.map(match => renderMatchCard(match, lang)).join('')}
      </div>
    </section>
  `;
}

/**
 * Render match card
 */
function renderMatchCard(match: TeamCompatibility, lang: 'en' | 'zh'): string {
  const name = lang === 'zh' && match.personNameZh ? match.personNameZh : match.personName;
  const notes = lang === 'zh' && match.notesZh ? match.notesZh : match.notes;
  const compatClass = match.compatibilityScore >= 70 ? 'high' : match.compatibilityScore >= 40 ? 'medium' : 'low';

  return `
    <div class="match-card ${compatClass}">
      <div class="match-header">
        <span class="match-name">${name}</span>
        <span class="match-score">${match.compatibilityScore}%</span>
      </div>
      ${match.synergies.length > 0 ? `
        <div class="match-synergies">
          <span class="label">${lang === 'zh' ? '协同' : 'Synergies'}:</span>
          ${match.synergies.map(s => `<span class="tag synergy">${s}</span>`).join('')}
        </div>
      ` : ''}
      ${match.frictions.length > 0 ? `
        <div class="match-frictions">
          <span class="label">${lang === 'zh' ? '摩擦' : 'Frictions'}:</span>
          ${match.frictions.map(f => `<span class="tag friction">${f}</span>`).join('')}
        </div>
      ` : ''}
      ${notes ? `<p class="match-notes">${notes}</p>` : ''}
    </div>
  `;
}

// ==================== COMPONENT RENDERING ====================

/**
 * Render just the personality component
 */
export function renderPersonalityComponent(
  personality: ProfilePersonality,
  lang: 'en' | 'zh' = 'en'
): string {
  return renderPersonalityPanel(personality, lang);
}

/**
 * Render just the work style component
 */
export function renderWorkStyleComponent(
  workStyle: ProfileWorkStyle,
  lang: 'en' | 'zh' = 'en'
): string {
  return renderWorkStylePanel(workStyle, lang);
}

/**
 * Render just the team compatibility component
 */
export function renderTeamCompatComponent(
  teamCompat: ProfileTeamCompat,
  lang: 'en' | 'zh' = 'en'
): string {
  return renderTeamCompatPanel(teamCompat, lang);
}

// ==================== STYLES ====================

/**
 * Get profiling dashboard styles
 */
export function getProfilingDashboardStyles(): string {
  return `
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf0 100%);
  min-height: 100vh;
  color: #3a3a3a;
}

.profiling-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #c4d4e4;
}

.dashboard-header h1 {
  font-size: 1.8rem;
  color: #4a5a6a;
  margin-bottom: 8px;
}

.subtitle {
  color: #6a7a8a;
  font-style: italic;
}

.subject-name {
  margin-top: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #4a5a6a;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.panel {
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8ecf0;
}

.panel h2 {
  font-size: 1.1rem;
  color: #4a5a6a;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #d4e0ec;
}

.dominant-element,
.primary-style,
.team-harmony {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.dominant-element .label,
.primary-style .label,
.team-harmony .label {
  color: #6a7a8a;
}

.dominant-element .value,
.primary-style .value {
  font-weight: 700;
  color: #4a5a6a;
}

.panel-summary {
  color: #5a6a7a;
  font-size: 0.9rem;
  margin-bottom: 16px;
  line-height: 1.6;
}

/* Traits */
.traits-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trait-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #c4d4e4;
}

.trait-item.strength {
  border-left-color: #68c088;
  background: #f0f8f4;
}

.trait-item.challenge {
  border-left-color: #c08868;
  background: #f8f4f0;
}

.trait-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.trait-name {
  font-weight: 600;
  color: #4a5a6a;
}

.trait-score {
  font-weight: 700;
  color: #5a6a7a;
}

.trait-bar {
  height: 8px;
  background: #e8ecf0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.trait-fill {
  height: 100%;
  background: linear-gradient(90deg, #88a8c8, #6088b0);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.trait-item.strength .trait-fill {
  background: linear-gradient(90deg, #88c8a8, #60b080);
}

.trait-item.challenge .trait-fill {
  background: linear-gradient(90deg, #c8a888, #b08060);
}

.trait-desc {
  font-size: 0.8rem;
  color: #6a7a8a;
}

/* Work Style Radar */
.radar-chart {
  margin-bottom: 16px;
}

.radar-axis {
  display: grid;
  grid-template-columns: 100px 1fr 50px;
  gap: 12px;
  align-items: center;
  margin-bottom: 8px;
}

.axis-label {
  font-size: 0.85rem;
  color: #5a6a7a;
}

.axis-bar {
  height: 8px;
  background: #e8ecf0;
  border-radius: 4px;
  overflow: hidden;
}

.axis-fill {
  height: 100%;
  background: linear-gradient(90deg, #88a8c8, #6088b0);
  border-radius: 4px;
}

.axis-score {
  font-size: 0.85rem;
  font-weight: 600;
  color: #5a6a7a;
  text-align: right;
}

/* Attributes */
.attributes-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.attribute-item {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
}

.attr-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.attr-name {
  font-weight: 600;
  color: #4a5a6a;
  font-size: 0.9rem;
}

.attr-type {
  font-size: 0.75rem;
  color: #8a9aaa;
  text-transform: capitalize;
}

.attr-desc {
  font-size: 0.8rem;
  color: #6a7a8a;
}

/* Team Harmony Meter */
.harmony-meter {
  flex: 1;
  height: 12px;
  background: #e8ecf0;
  border-radius: 6px;
  overflow: hidden;
}

.harmony-fill {
  height: 100%;
  background: linear-gradient(90deg, #c8a888, #88c888, #88a8c8);
  border-radius: 6px;
}

.harmony-value {
  font-weight: 700;
  color: #4a5a6a;
}

/* Match Cards */
.matches-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.match-card {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #c4d4e4;
}

.match-card.high {
  border-left-color: #68c088;
}

.match-card.medium {
  border-left-color: #c8b868;
}

.match-card.low {
  border-left-color: #c08868;
}

.match-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.match-name {
  font-weight: 600;
  color: #4a5a6a;
}

.match-score {
  font-weight: 700;
  color: #5a6a7a;
}

.match-synergies,
.match-frictions {
  margin-bottom: 6px;
}

.match-synergies .label,
.match-frictions .label {
  font-size: 0.75rem;
  color: #7a8a9a;
  margin-right: 8px;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  font-size: 0.75rem;
  border-radius: 12px;
  margin-right: 4px;
  margin-bottom: 4px;
}

.tag.synergy {
  background: #e0f0e4;
  color: #408060;
}

.tag.friction {
  background: #f0e4e0;
  color: #806040;
}

.match-notes {
  font-size: 0.8rem;
  color: #6a7a8a;
  margin-top: 8px;
  font-style: italic;
}

/* Print */
@media print {
  body { background: white; }
  .panel { box-shadow: none; border: 1px solid #ccc; }
}
  `.trim();
}

// ==================== SCRIPT ====================

/**
 * Get profiling dashboard JavaScript
 */
export function getProfilingDashboardScript(): string {
  return `
// Interactive trait highlighting
document.querySelectorAll('.trait-item').forEach(item => {
  item.addEventListener('click', function() {
    document.querySelectorAll('.trait-item').forEach(t => t.classList.remove('selected'));
    this.classList.add('selected');
  });
});

// Match card expansion
document.querySelectorAll('.match-card').forEach(card => {
  card.addEventListener('click', function() {
    this.classList.toggle('expanded');
  });
});
  `.trim();
}

// ==================== EXPORTS ====================

export {
  renderProfilingDashboardHtml,
  renderPersonalityComponent,
  renderWorkStyleComponent,
  renderTeamCompatComponent,
  getProfilingDashboardStyles,
  getProfilingDashboardScript
};
