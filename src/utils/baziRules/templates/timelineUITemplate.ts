/**
 * ============================================
 * GENERATIONAL STORY TIMELINE UI TEMPLATE
 * Chronological visualization of generational
 * events, themes, and arcs
 *
 * Features:
 * - Generational rows
 * - Story beat bars
 * - Theme markers
 * - Intensity shading
 * - Arc visualization
 * - Interactive tooltips
 * ============================================
 */

import { LineageTimeline, TimelineEvent, TimelineArc, TimelinePilgrimMoment } from '../lineageTimelineEngine';

// ==================== DATA MODEL ====================

export interface TimelineUIData {
  timeline: LineageTimeline;
  highlightedTheme?: string;
  showArcs?: boolean;
  showPilgrimMoments?: boolean;
  lang: 'en' | 'zh';
}

// ==================== HTML RENDERER ====================

/**
 * Render full Timeline UI as HTML
 */
export function renderTimelineUIHtml(data: TimelineUIData): string {
  const { timeline, highlightedTheme, showArcs = true, showPilgrimMoments = true, lang } = data;

  return `
<!DOCTYPE html>
<html lang="${lang === 'zh' ? 'zh-CN' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lang === 'zh' ? '世代故事时间线' : 'Generational Story Timeline'}</title>
  <style>
${getTimelineUIStyles()}
  </style>
</head>
<body>
  <div class="timeline-ui">
    <header class="timeline-header">
      <h2>${lang === 'zh' ? '世代故事时间线' : 'Generational Story Timeline'}</h2>
      <div class="timeline-meta">
        <span>${timeline.totalGenerations} ${lang === 'zh' ? '代' : 'generations'}</span>
        <span>~${timeline.timespan.estimatedYears} ${lang === 'zh' ? '年' : 'years'}</span>
      </div>
    </header>

    ${showArcs && timeline.arcs.length > 0 ? renderArcsSection(timeline.arcs, lang) : ''}

    <div class="timeline-container" id="timeline-container">
      ${renderTimelineRows(timeline, highlightedTheme, lang)}
    </div>

    ${showPilgrimMoments && timeline.pilgrimMoments.length > 0
      ? renderPilgrimMomentsSection(timeline.pilgrimMoments, lang)
      : ''
    }

    <div class="timeline-legend">
      <h4>${lang === 'zh' ? '图例' : 'Legend'}</h4>
      <div class="legend-items">
        <div class="legend-item">
          <span class="legend-color" style="background: #c8b4ff;"></span>
          <span>${lang === 'zh' ? '低强度' : 'Low intensity'}</span>
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background: #a78bfa;"></span>
          <span>${lang === 'zh' ? '中强度' : 'Medium intensity'}</span>
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background: #f4d03f;"></span>
          <span>${lang === 'zh' ? '高强度' : 'High intensity'}</span>
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background: #ff6b6b;"></span>
          <span>${lang === 'zh' ? '关键时刻' : 'Critical moment'}</span>
        </div>
      </div>
    </div>
  </div>

  <script>
    window.TIMELINE = ${JSON.stringify(timeline)};
    window.LANG = '${lang}';
${getTimelineUIScript()}
  </script>
</body>
</html>`;
}

/**
 * Render timeline rows
 */
function renderTimelineRows(
  timeline: LineageTimeline,
  highlightedTheme: string | undefined,
  lang: 'en' | 'zh'
): string {
  // Group events by generation
  const genGroups = new Map<number, TimelineEvent[]>();
  timeline.events.forEach(e => {
    if (!genGroups.has(e.generationIndex)) {
      genGroups.set(e.generationIndex, []);
    }
    genGroups.get(e.generationIndex)!.push(e);
  });

  const sortedGens = [...genGroups.entries()].sort((a, b) => a[0] - b[0]);

  // Find max age for scaling
  const maxAge = Math.max(...timeline.events.map(e => e.endAge), 80);

  return sortedGens.map(([genIndex, events]) => {
    const genLabel = events[0]?.generationLabel || `Gen ${genIndex}`;

    return `
      <div class="timeline-row" data-generation="${genIndex}">
        <div class="timeline-label">
          <span class="gen-index">${genIndex >= 0 ? '+' : ''}${genIndex}</span>
          <span class="gen-name">${genLabel}</span>
        </div>
        <div class="timeline-bar">
          ${events.map(event => renderTimelineEvent(event, maxAge, highlightedTheme)).join('')}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render a single timeline event
 */
function renderTimelineEvent(
  event: TimelineEvent,
  maxAge: number,
  highlightedTheme?: string
): string {
  const leftPercent = (event.startAge / maxAge) * 100;
  const widthPercent = ((event.endAge - event.startAge) / maxAge) * 100;
  const color = getIntensityColor(event.intensity);
  const isHighlighted = highlightedTheme
    ? event.themes.some(t => t.toLowerCase().includes(highlightedTheme.toLowerCase()))
    : false;

  return `
    <div
      class="timeline-event ${isHighlighted ? 'timeline-event--highlighted' : ''}"
      style="left: ${leftPercent}%; width: ${Math.max(widthPercent, 2)}%; background: ${color};"
      data-event-id="${event.id}"
      data-themes="${event.themes.join(',')}"
      title="${event.label} (${event.startAge}-${event.endAge})"
      onmouseover="showTooltip(event, '${event.id}')"
      onmouseout="hideTooltip()"
    >
    </div>
  `;
}

/**
 * Render arcs section
 */
function renderArcsSection(arcs: TimelineArc[], lang: 'en' | 'zh'): string {
  return `
    <div class="arcs-section">
      <h4>${lang === 'zh' ? '祖系弧线' : 'Ancestral Arcs'}</h4>
      <div class="arcs-container">
        ${arcs.map(arc => `
          <div class="arc-item arc-item--${arc.evolution}">
            <span class="arc-name">${arc.name}</span>
            <span class="arc-span">Gen ${arc.startGeneration} → Gen ${arc.endGeneration}</span>
            <span class="arc-evolution">${getEvolutionLabel(arc.evolution, lang)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Render pilgrim moments section
 */
function renderPilgrimMomentsSection(moments: TimelinePilgrimMoment[], lang: 'en' | 'zh'): string {
  return `
    <div class="pilgrim-section">
      <h4>${lang === 'zh' ? '行者时刻' : 'Pilgrim Moments'}</h4>
      <div class="pilgrim-moments">
        ${moments.map(moment => `
          <div class="pilgrim-moment pilgrim-moment--${moment.type}">
            <span class="moment-age">${lang === 'zh' ? '年龄' : 'Age'} ${moment.age}</span>
            <span class="moment-label">${moment.label}</span>
            <span class="moment-type">${getMomentTypeLabel(moment.type, lang)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Render timeline container component (for embedding)
 */
export function renderTimelineContainerComponent(
  timeline: LineageTimeline,
  lang: 'en' | 'zh' = 'en'
): string {
  return `
    <div class="timeline-container">
      ${renderTimelineRows(timeline, undefined, lang)}
    </div>
  `;
}

// ==================== HELPER FUNCTIONS ====================

function getIntensityColor(intensity: number): string {
  if (intensity >= 80) return '#ff6b6b';
  if (intensity >= 60) return '#f4d03f';
  if (intensity >= 40) return '#a78bfa';
  return '#c8b4ff';
}

function getEvolutionLabel(evolution: TimelineArc['evolution'], lang: 'en' | 'zh'): string {
  const labels: Record<string, { en: string; zh: string }> = {
    ascending: { en: '↑ Rising', zh: '↑ 上升' },
    descending: { en: '↓ Falling', zh: '↓ 下降' },
    stable: { en: '→ Stable', zh: '→ 稳定' },
    breaking: { en: '⚡ Breaking', zh: '⚡ 断裂' }
  };
  return labels[evolution]?.[lang] || evolution;
}

function getMomentTypeLabel(type: TimelinePilgrimMoment['type'], lang: 'en' | 'zh'): string {
  const labels: Record<string, { en: string; zh: string }> = {
    inheritance: { en: 'Inheritance', zh: '继承' },
    breaking: { en: 'Breaking', zh: '断裂' },
    founding: { en: 'Founding', zh: '创建' },
    healing: { en: 'Healing', zh: '疗愈' },
    integration: { en: 'Integration', zh: '整合' }
  };
  return labels[type]?.[lang] || type;
}

// ==================== STYLES ====================

/**
 * Get CSS styles for Timeline UI
 */
export function getTimelineUIStyles(): string {
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

    .timeline-ui {
      max-width: 1000px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .timeline-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .timeline-header h2 {
      font-size: 1.8rem;
      color: #f4d03f;
      margin-bottom: 10px;
    }

    .timeline-meta {
      display: flex;
      justify-content: center;
      gap: 20px;
      color: #888;
      font-size: 0.9rem;
    }

    .arcs-section, .pilgrim-section {
      margin-bottom: 30px;
      padding: 20px;
      background: rgba(30, 30, 56, 0.6);
      border-radius: 12px;
    }

    .arcs-section h4, .pilgrim-section h4 {
      color: #f4d03f;
      margin-bottom: 16px;
      font-size: 1rem;
    }

    .arcs-container {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .arc-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 12px 16px;
      background: rgba(255, 253, 247, 0.05);
      border-radius: 8px;
      border-left: 3px solid #888;
    }

    .arc-item--ascending { border-color: #34d399; }
    .arc-item--descending { border-color: #ff6b6b; }
    .arc-item--stable { border-color: #60a5fa; }
    .arc-item--breaking { border-color: #f4d03f; }

    .arc-name {
      font-weight: bold;
    }

    .arc-span, .arc-evolution {
      font-size: 0.85rem;
      color: #888;
    }

    .timeline-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 30px;
    }

    .timeline-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .timeline-label {
      width: 140px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      text-align: right;
    }

    .gen-index {
      font-weight: bold;
      color: #a78bfa;
      font-size: 0.85rem;
    }

    .gen-name {
      font-size: 0.9rem;
      color: #b8a07e;
    }

    .timeline-bar {
      flex: 1;
      height: 24px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      position: relative;
      overflow: hidden;
    }

    .timeline-event {
      position: absolute;
      height: 100%;
      border-radius: 4px;
      opacity: 0.85;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .timeline-event:hover {
      opacity: 1;
      transform: scaleY(1.1);
      z-index: 10;
    }

    .timeline-event--highlighted {
      opacity: 1;
      box-shadow: 0 0 8px currentColor;
    }

    .pilgrim-moments {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .pilgrim-moment {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 12px 16px;
      background: rgba(255, 253, 247, 0.05);
      border-radius: 8px;
      border-left: 3px solid #888;
    }

    .pilgrim-moment--inheritance { border-color: #a78bfa; }
    .pilgrim-moment--breaking { border-color: #ff6b6b; }
    .pilgrim-moment--founding { border-color: #34d399; }
    .pilgrim-moment--healing { border-color: #60a5fa; }
    .pilgrim-moment--integration { border-color: #f4d03f; }

    .moment-age {
      font-weight: bold;
      color: #f4d03f;
      font-size: 0.85rem;
    }

    .moment-label {
      font-size: 0.9rem;
    }

    .moment-type {
      font-size: 0.8rem;
      color: #888;
    }

    .timeline-legend {
      padding: 20px;
      background: rgba(30, 30, 56, 0.6);
      border-radius: 12px;
    }

    .timeline-legend h4 {
      color: #f4d03f;
      margin-bottom: 12px;
      font-size: 0.9rem;
    }

    .legend-items {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
    }

    .legend-color {
      width: 16px;
      height: 16px;
      border-radius: 3px;
    }

    /* Tooltip */
    .timeline-tooltip {
      position: fixed;
      background: rgba(30, 30, 56, 0.95);
      border: 1px solid #3a3a5a;
      border-radius: 8px;
      padding: 12px 16px;
      pointer-events: none;
      z-index: 100;
      max-width: 300px;
    }

    .tooltip-title {
      font-weight: bold;
      color: #f4d03f;
      margin-bottom: 4px;
    }

    .tooltip-meta {
      font-size: 0.85rem;
      color: #888;
      margin-bottom: 8px;
    }

    .tooltip-themes {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .tooltip-theme {
      background: rgba(167, 139, 250, 0.2);
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.8rem;
    }
  `;
}

// ==================== SCRIPTS ====================

/**
 * Get JavaScript for Timeline UI
 */
export function getTimelineUIScript(): string {
  return `
    let tooltip = null;

    function showTooltip(evt, eventId) {
      const event = window.TIMELINE.events.find(e => e.id === eventId);
      if (!event) return;

      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'timeline-tooltip';
        document.body.appendChild(tooltip);
      }

      tooltip.innerHTML = \`
        <div class="tooltip-title">\${event.label}</div>
        <div class="tooltip-meta">Ages \${event.startAge} - \${event.endAge} | Intensity: \${event.intensity}%</div>
        <div class="tooltip-themes">
          \${event.themes.map(t => \`<span class="tooltip-theme">\${t}</span>\`).join('')}
        </div>
      \`;

      tooltip.style.display = 'block';
      tooltip.style.left = evt.pageX + 10 + 'px';
      tooltip.style.top = evt.pageY + 10 + 'px';
    }

    function hideTooltip() {
      if (tooltip) {
        tooltip.style.display = 'none';
      }
    }

    // Filter by theme
    function filterByTheme(theme) {
      const events = document.querySelectorAll('.timeline-event');
      events.forEach(el => {
        const themes = el.dataset.themes.toLowerCase();
        if (theme && !themes.includes(theme.toLowerCase())) {
          el.style.opacity = '0.2';
        } else {
          el.style.opacity = '0.85';
        }
      });
    }

    function clearFilter() {
      const events = document.querySelectorAll('.timeline-event');
      events.forEach(el => {
        el.style.opacity = '0.85';
      });
    }
  `;
}

// ==================== EXPORTS ====================

export {
  renderTimelineUIHtml,
  renderTimelineContainerComponent,
  getTimelineUIStyles,
  getTimelineUIScript
};
