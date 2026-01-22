/**
 * ============================================
 * LINEAGE MEMORY BROWSER UI TEMPLATE
 * Interface for exploring saved lineage records
 *
 * Features:
 * - List of saved lineages
 * - Detail view for selected lineage
 * - Generations, threads, archetypes display
 * - Search and filter
 * - Export capabilities
 * ============================================
 */

import { LineageRecord } from '../lineageMemoryEngine';

// ==================== DATA MODEL ====================

export interface MemoryBrowserUIData {
  records: LineageRecord[];
  selectedRecordId?: string;
  lang: 'en' | 'zh';
}

// ==================== HTML RENDERER ====================

/**
 * Render full Memory Browser UI as HTML
 */
export function renderMemoryBrowserHtml(data: MemoryBrowserUIData): string {
  const { records, selectedRecordId, lang } = data;

  return `
<!DOCTYPE html>
<html lang="${lang === 'zh' ? 'zh-CN' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lang === 'zh' ? '血脉记忆浏览器' : 'Lineage Memory Browser'}</title>
  <style>
${getMemoryBrowserStyles()}
  </style>
</head>
<body>
  <div class="memory-browser">
    <header class="browser-header">
      <h2>${lang === 'zh' ? '血脉记忆浏览器' : 'Lineage Memory Browser'}</h2>
      <p class="browser-subtitle">${lang === 'zh' ? '探索已存储的祖系记录' : 'Explore stored ancestral records'}</p>
    </header>

    <div class="browser-layout">
      <aside class="memory-list-panel">
        <div class="list-header">
          <input type="text" id="search-input" placeholder="${lang === 'zh' ? '搜索血脉...' : 'Search lineages...'}" />
        </div>
        <div class="memory-list" id="memory-list">
          ${records.map(r => renderMemoryListItem(r, r.lineageId === selectedRecordId, lang)).join('')}
        </div>
        <div class="list-footer">
          <span class="record-count">${records.length} ${lang === 'zh' ? '条记录' : 'records'}</span>
        </div>
      </aside>

      <main class="memory-details" id="memory-details">
        ${selectedRecordId
          ? renderMemoryDetails(records.find(r => r.lineageId === selectedRecordId)!, lang)
          : renderEmptyState(lang)
        }
      </main>
    </div>
  </div>

  <script>
    window.LINEAGE_MEMORY = ${JSON.stringify(records)};
    window.LANG = '${lang}';
${getMemoryBrowserScript()}
  </script>
</body>
</html>`;
}

/**
 * Render a single memory list item
 */
function renderMemoryListItem(record: LineageRecord, isSelected: boolean, lang: 'en' | 'zh'): string {
  const date = new Date(record.updatedAt).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US');
  const selectedClass = isSelected ? 'memory-item--selected' : '';
  const initiatedBadge = record.isInitiated
    ? `<span class="badge badge-initiated">${lang === 'zh' ? '已启蒙' : 'Initiated'}</span>`
    : '';

  return `
    <div class="memory-item ${selectedClass}" data-id="${record.lineageId}" onclick="showMemory('${record.lineageId}')">
      <div class="item-header">
        <strong class="item-name">${record.pilgrimName || record.lineageId}</strong>
        ${initiatedBadge}
      </div>
      <div class="item-meta">
        <span class="meta-date">${date}</span>
        <span class="meta-gens">${record.generations.length} ${lang === 'zh' ? '代' : 'gens'}</span>
        <span class="meta-threads">${record.threads.length} ${lang === 'zh' ? '线' : 'threads'}</span>
      </div>
    </div>
  `;
}

/**
 * Render memory details panel
 */
function renderMemoryDetails(record: LineageRecord, lang: 'en' | 'zh'): string {
  const date = new Date(record.updatedAt).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US');

  return `
    <div class="details-content">
      <header class="details-header">
        <h3>${record.pilgrimName || record.lineageId}</h3>
        <span class="details-date">${lang === 'zh' ? '最后更新' : 'Last updated'}: ${date}</span>
      </header>

      <section class="details-section">
        <h4>${lang === 'zh' ? '概览' : 'Overview'}</h4>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-value">${record.generations.length}</span>
            <span class="stat-label">${lang === 'zh' ? '世代' : 'Generations'}</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${record.threads.length}</span>
            <span class="stat-label">${lang === 'zh' ? '丝线' : 'Threads'}</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${record.archetypes.length}</span>
            <span class="stat-label">${lang === 'zh' ? '原型' : 'Archetypes'}</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${record.completedRituals.length}</span>
            <span class="stat-label">${lang === 'zh' ? '完成仪式' : 'Rituals Done'}</span>
          </div>
        </div>
      </section>

      <section class="details-section">
        <h4>${lang === 'zh' ? '世代' : 'Generations'}</h4>
        <div class="generation-list">
          ${record.generations.map(gen => `
            <div class="generation-item">
              <span class="gen-index">Gen ${gen.generationIndex}</span>
              <span class="gen-label">${gen.label}</span>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="details-section">
        <h4>${lang === 'zh' ? '祖系丝线' : 'Ancestral Threads'}</h4>
        <div class="thread-list">
          ${record.threads.map(thread => `
            <div class="thread-item">
              <span class="thread-theme">${thread.theme}</span>
              <span class="thread-intensity" style="opacity: ${thread.intensity / 100}">${thread.intensity}%</span>
            </div>
          `).join('')}
        </div>
      </section>

      ${record.archetypes.length > 0 ? `
        <section class="details-section">
          <h4>${lang === 'zh' ? '原型' : 'Archetypes'}</h4>
          <div class="archetype-list">
            ${record.archetypes.map(arch => `
              <div class="archetype-chip">
                ${arch.name}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${record.pilgrimPosition ? `
        <section class="details-section">
          <h4>${lang === 'zh' ? '行者位置' : 'Pilgrim Position'}</h4>
          <div class="position-info">
            <p><strong>${lang === 'zh' ? '继承主题' : 'Inherited'}:</strong> ${record.pilgrimPosition.inheritedThemes.join(', ') || 'None'}</p>
            <p><strong>${lang === 'zh' ? '断裂模式' : 'Breaking'}:</strong> ${record.pilgrimPosition.brokenPatterns.join(', ') || 'None'}</p>
            <p><strong>${lang === 'zh' ? '新生模式' : 'Founding'}:</strong> ${record.pilgrimPosition.newPatterns.join(', ') || 'None'}</p>
          </div>
        </section>
      ` : ''}

      <section class="details-actions">
        <button class="btn btn-primary" onclick="exportRecord('${record.lineageId}')">
          ${lang === 'zh' ? '导出' : 'Export'}
        </button>
        <button class="btn btn-secondary" onclick="deleteRecord('${record.lineageId}')">
          ${lang === 'zh' ? '删除' : 'Delete'}
        </button>
      </section>
    </div>
  `;
}

/**
 * Render empty state
 */
function renderEmptyState(lang: 'en' | 'zh'): string {
  return `
    <div class="empty-state">
      <div class="empty-icon">📜</div>
      <h3>${lang === 'zh' ? '选择一条血脉记录' : 'Select a Lineage Record'}</h3>
      <p>${lang === 'zh' ? '从左侧列表中选择一条记录以查看详情' : 'Choose a record from the list to view details'}</p>
    </div>
  `;
}

/**
 * Render memory list component (for embedding)
 */
export function renderMemoryListComponent(
  records: LineageRecord[],
  selectedId?: string,
  lang: 'en' | 'zh' = 'en'
): string {
  return `
    <div class="memory-list">
      ${records.map(r => renderMemoryListItem(r, r.lineageId === selectedId, lang)).join('')}
    </div>
  `;
}

// ==================== STYLES ====================

/**
 * Get CSS styles for Memory Browser
 */
export function getMemoryBrowserStyles(): string {
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

    .memory-browser {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    .browser-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .browser-header h2 {
      font-size: 1.8rem;
      color: #f4d03f;
      margin-bottom: 8px;
    }

    .browser-subtitle {
      color: #b8a07e;
      font-style: italic;
    }

    .browser-layout {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 24px;
    }

    /* List Panel */
    .memory-list-panel {
      background: rgba(30, 30, 56, 0.8);
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: calc(100vh - 180px);
    }

    .list-header {
      padding: 16px;
      border-bottom: 1px solid #3a3a5a;
    }

    .list-header input {
      width: 100%;
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid #3a3a5a;
      border-radius: 6px;
      color: #e8d5b7;
      font-family: inherit;
    }

    .list-header input::placeholder {
      color: #888;
    }

    .memory-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }

    .memory-item {
      padding: 14px;
      background: rgba(255, 253, 247, 0.05);
      border-radius: 8px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }

    .memory-item:hover {
      background: rgba(255, 253, 247, 0.1);
      border-color: rgba(244, 208, 63, 0.3);
    }

    .memory-item--selected {
      background: rgba(244, 208, 63, 0.15);
      border-color: #f4d03f;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .item-name {
      font-size: 0.95rem;
    }

    .badge {
      font-size: 0.7rem;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .badge-initiated {
      background: #34d399;
      color: #1a1a2e;
    }

    .item-meta {
      display: flex;
      gap: 12px;
      font-size: 0.8rem;
      color: #888;
    }

    .list-footer {
      padding: 12px 16px;
      border-top: 1px solid #3a3a5a;
      text-align: center;
      font-size: 0.85rem;
      color: #888;
    }

    /* Details Panel */
    .memory-details {
      background: rgba(30, 30, 56, 0.8);
      border-radius: 12px;
      padding: 24px;
      min-height: 400px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      color: #888;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      color: #b8a07e;
      margin-bottom: 8px;
    }

    .details-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #3a3a5a;
    }

    .details-header h3 {
      font-size: 1.4rem;
      color: #f4d03f;
    }

    .details-date {
      font-size: 0.85rem;
      color: #888;
    }

    .details-section {
      margin-bottom: 24px;
    }

    .details-section h4 {
      color: #f4d03f;
      margin-bottom: 12px;
      font-size: 1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .stat-card {
      background: rgba(255, 253, 247, 0.05);
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }

    .stat-value {
      display: block;
      font-size: 1.8rem;
      color: #f4d03f;
      font-weight: bold;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #888;
    }

    .generation-list, .thread-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .generation-item, .thread-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 12px;
      background: rgba(255, 253, 247, 0.05);
      border-radius: 6px;
    }

    .gen-index {
      color: #a78bfa;
      font-weight: bold;
    }

    .thread-theme {
      font-style: italic;
    }

    .thread-intensity {
      color: #f4d03f;
    }

    .archetype-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .archetype-chip {
      background: rgba(167, 139, 250, 0.2);
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 0.9rem;
    }

    .position-info p {
      margin-bottom: 8px;
      line-height: 1.6;
    }

    .details-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #3a3a5a;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-family: inherit;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: #f4d03f;
      color: #1a1a2e;
    }

    .btn-primary:hover {
      background: #e8c431;
    }

    .btn-secondary {
      background: transparent;
      border: 1px solid #888;
      color: #888;
    }

    .btn-secondary:hover {
      border-color: #ff6b6b;
      color: #ff6b6b;
    }

    @media (max-width: 768px) {
      .browser-layout {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `;
}

// ==================== SCRIPTS ====================

/**
 * Get JavaScript for Memory Browser
 */
export function getMemoryBrowserScript(): string {
  return `
    function showMemory(id) {
      const record = window.LINEAGE_MEMORY.find(r => r.lineageId === id);
      if (!record) return;

      // Update selected state
      document.querySelectorAll('.memory-item').forEach(el => {
        el.classList.remove('memory-item--selected');
      });
      document.querySelector(\`[data-id="\${id}"]\`)?.classList.add('memory-item--selected');

      // Render details
      const lang = window.LANG;
      const details = document.getElementById('memory-details');
      details.innerHTML = renderDetails(record, lang);
    }

    function renderDetails(record, lang) {
      const date = new Date(record.updatedAt).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US');

      return \`
        <div class="details-content">
          <header class="details-header">
            <h3>\${record.pilgrimName || record.lineageId}</h3>
            <span class="details-date">\${lang === 'zh' ? '最后更新' : 'Last updated'}: \${date}</span>
          </header>

          <section class="details-section">
            <h4>\${lang === 'zh' ? '概览' : 'Overview'}</h4>
            <div class="stats-grid">
              <div class="stat-card">
                <span class="stat-value">\${record.generations.length}</span>
                <span class="stat-label">\${lang === 'zh' ? '世代' : 'Generations'}</span>
              </div>
              <div class="stat-card">
                <span class="stat-value">\${record.threads.length}</span>
                <span class="stat-label">\${lang === 'zh' ? '丝线' : 'Threads'}</span>
              </div>
              <div class="stat-card">
                <span class="stat-value">\${record.archetypes.length}</span>
                <span class="stat-label">\${lang === 'zh' ? '原型' : 'Archetypes'}</span>
              </div>
              <div class="stat-card">
                <span class="stat-value">\${record.completedRituals.length}</span>
                <span class="stat-label">\${lang === 'zh' ? '完成仪式' : 'Rituals Done'}</span>
              </div>
            </div>
          </section>

          <section class="details-section">
            <h4>\${lang === 'zh' ? '世代' : 'Generations'}</h4>
            <div class="generation-list">
              \${record.generations.map(gen => \`
                <div class="generation-item">
                  <span class="gen-index">Gen \${gen.generationIndex}</span>
                  <span class="gen-label">\${gen.label}</span>
                </div>
              \`).join('')}
            </div>
          </section>

          <section class="details-actions">
            <button class="btn btn-primary" onclick="exportRecord('\${record.lineageId}')">
              \${lang === 'zh' ? '导出' : 'Export'}
            </button>
          </section>
        </div>
      \`;
    }

    function exportRecord(id) {
      const record = window.LINEAGE_MEMORY.find(r => r.lineageId === id);
      if (!record) return;

      const json = JSON.stringify(record, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = \`lineage-\${id}.json\`;
      a.click();

      URL.revokeObjectURL(url);
    }

    // Search filtering
    document.getElementById('search-input')?.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const items = document.querySelectorAll('.memory-item');

      items.forEach(item => {
        const name = item.querySelector('.item-name')?.textContent?.toLowerCase() || '';
        const visible = name.includes(query);
        item.style.display = visible ? 'block' : 'none';
      });
    });
  `;
}

// ==================== EXPORTS ====================

export {
  renderMemoryBrowserHtml,
  renderMemoryListComponent,
  getMemoryBrowserStyles,
  getMemoryBrowserScript
};
