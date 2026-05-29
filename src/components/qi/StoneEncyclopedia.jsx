/**
 * StoneEncyclopedia — Draggable, collapsible floating panel listing all stones
 * grouped by element (Wood, Fire, Earth, Metal, Water).
 *
 * Shows: stone name, Chinese name, polarity, baseQi, color swatch,
 * functional notes (when to use).
 *
 * Opened via a link in BraceletDashboard / EngineeredBraceletVisualizer.
 */

import React, { useState, useRef, useEffect } from 'react';
import { STONE_DATABASE } from '../../data/stoneDatabase';

// ============================================================================
// ELEMENT CONFIG
// ============================================================================

const ELEMENTS = [
  { key: 'Wood',  color: '#22c55e', highlight: '#86efac', label: 'Wood', icon: '\u{1F33F}' },
  { key: 'Fire',  color: '#ef4444', highlight: '#fca5a5', label: 'Fire', icon: '\u{1F525}' },
  { key: 'Earth', color: '#f59e0b', highlight: '#fde68a', label: 'Earth', icon: '\u{1F3D4}\uFE0F' },
  { key: 'Metal', color: '#a1a1aa', highlight: '#e4e4e7', label: 'Metal', icon: '\u2694\uFE0F' },
  { key: 'Water', color: '#3b82f6', highlight: '#93c5fd', label: 'Water', icon: '\u{1F30A}' },
];

const POLARITY_BADGE = {
  Yang: { bg: 'bg-white/20', text: 'text-white/90', label: 'Yang \u2600' },
  Yin: { bg: 'bg-white/12', text: 'text-white/75', label: 'Yin \u263D' },
  'Yin-Yang': { bg: 'bg-white/15', text: 'text-white/85', label: 'Yin-Yang \u262F' },
};

// ============================================================================
// QI STRENGTH BAR
// ============================================================================

function QiBar({ value, color }) {
  return (
    <div className="flex items-center gap-1.5 w-20">
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${value * 100}%`, backgroundColor: color, opacity: 0.8 }}
        />
      </div>
      <span className="text-[10px] font-mono text-white/60 w-6 text-right">{value.toFixed(2)}</span>
    </div>
  );
}

// ============================================================================
// MARKDOWN EXPORT
// ============================================================================

function generateEncyclopediaMD(grouped, elementsToShow) {
  const lines = [];
  lines.push('# Stone Encyclopedia');
  lines.push(`> ${STONE_DATABASE.length} functional gemstones \u00B7 BaZi Qi remedies`);
  lines.push('');
  lines.push(`*Exported ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*`);
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const el of elementsToShow) {
    const stones = grouped[el.key];
    lines.push(`## ${el.icon} ${el.label}  *(${stones.length} stones)*`);
    lines.push('');
    lines.push('| # | Stone | Polarity | Base Qi | Notes |');
    lines.push('|---|-------|----------|---------|-------|');
    stones.forEach((stone, i) => {
      const polLabel = stone.polarity === 'Yang' ? 'Yang \u2600' : stone.polarity === 'Yin' ? 'Yin \u263D' : 'Yin-Yang \u262F';
      const chName = stone.chineseName ? ` (${stone.chineseName})` : '';
      lines.push(`| ${i + 1} | **${stone.name}**${chName} | ${polLabel} | ${stone.baseQi.toFixed(2)} | ${stone.notes} |`);
    });
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('## How to Read');
  lines.push('');
  lines.push('- **Qi Bar** \u2014 Base effectiveness (0\u20131) before seasonal modifiers');
  lines.push('- **Yang \u2600** \u2014 Dense, heavy energy for extreme imbalances');
  lines.push('- **Yin \u263D** \u2014 Gentle, nurturing energy for mild deficits');
  lines.push('- **Yin-Yang \u262F** \u2014 Balanced, adaptable energy');
  lines.push('');
  lines.push('> Final QiUnit = baseQi \u00D7 seasonModifier \u00D7 polarityFit. Seasonal strength follows the \u65FA\u76F8\u4F11\u56DA\u6B7B cycle.');
  lines.push('');

  return lines.join('\n');
}

function downloadMD(content, filename) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function StoneEncyclopedia({ isOpen, onClose }) {
  const [filter, setFilter] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [position, setPosition] = useState({ x: 80, y: 60 });

  // Use refs for drag state to avoid stale closures
  const dragState = useRef({ isDragging: false, startX: 0, startY: 0 });
  const posRef = useRef(position);
  posRef.current = position;

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragState.current.isDragging) return;
      e.preventDefault();
      setPosition({
        x: e.clientX - dragState.current.startX,
        y: e.clientY - dragState.current.startY,
      });
    };
    const onMouseUp = () => {
      if (dragState.current.isDragging) {
        dragState.current.isDragging = false;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const handleDragStart = (e) => {
    // Don't drag if clicking a button
    if (e.target.closest('button')) return;
    e.preventDefault();
    dragState.current = {
      isDragging: true,
      startX: e.clientX - posRef.current.x,
      startY: e.clientY - posRef.current.y,
    };
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  };

  if (!isOpen) return null;

  // Group stones by element
  const grouped = {};
  for (const el of ELEMENTS) grouped[el.key] = [];
  for (const stone of STONE_DATABASE) {
    if (grouped[stone.element]) grouped[stone.element].push(stone);
  }
  const polarityOrder = { Yang: 0, 'Yin-Yang': 1, Yin: 2 };
  for (const el of Object.keys(grouped)) {
    grouped[el].sort((a, b) => (polarityOrder[a.polarity] - polarityOrder[b.polarity]) || (b.baseQi - a.baseQi));
  }

  const elementsToShow = filter ? ELEMENTS.filter(e => e.key === filter) : ELEMENTS;

  return (
    <div
      className="fixed z-[9999] rounded-xl border border-slate-600/60 bg-slate-900/95 backdrop-blur-md shadow-2xl flex flex-col"
      style={{
        left: position.x,
        top: position.y,
        width: collapsed ? 320 : 480,
        maxHeight: collapsed ? 'auto' : 'calc(100vh - 80px)',
        transition: dragState.current.isDragging ? 'none' : 'width 0.2s ease',
      }}
    >
      {/* === Drag Handle / Header === */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/50 cursor-grab active:cursor-grabbing select-none rounded-t-xl flex-shrink-0"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base">{'\u{1F48E}'}</span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white/90 truncate">Stone Encyclopedia</h3>
            {!collapsed && (
              <p className="text-[10px] text-white/55">{STONE_DATABASE.length} functional gemstones</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {/* MD Export */}
          <button
            onClick={() => {
              const md = generateEncyclopediaMD(grouped, elementsToShow);
              const suffix = filter ? `_${filter.toLowerCase()}` : '';
              downloadMD(md, `stone-encyclopedia${suffix}.md`);
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors text-[10px] font-bold"
            title="Export as Markdown"
          >
            MD
          </button>
          {/* Collapse / Expand */}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors text-xs"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? '\u25B3' : '\u25BD'}
          </button>
          {/* Close */}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors text-lg leading-none"
          >
            {'\u00D7'}
          </button>
        </div>
      </div>

      {/* === Collapsible Body === */}
      {!collapsed && (
        <>
          {/* === Element Filter Tabs === */}
          <div className="flex gap-1 px-3 py-2 border-b border-slate-700/30 flex-shrink-0">
            <button
              onClick={() => setFilter(null)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                filter === null
                  ? 'bg-white/15 text-white/90'
                  : 'text-white/40 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              All ({STONE_DATABASE.length})
            </button>
            {ELEMENTS.map(el => (
              <button
                key={el.key}
                onClick={() => setFilter(filter === el.key ? null : el.key)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 ${
                  filter === el.key
                    ? 'text-white/90'
                    : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                }`}
                style={filter === el.key ? { backgroundColor: `${el.color}30`, color: el.color } : {}}
              >
                <span>{el.icon}</span>
                {el.label} ({grouped[el.key].length})
              </button>
            ))}
          </div>

          {/* === Stone List === */}
          <div className="overflow-y-auto px-3 py-2 space-y-4 flex-1 min-h-0">
            {elementsToShow.map(el => (
              <div key={el.key}>
                {/* Element Header */}
                <div className="flex items-center gap-2 mb-2 sticky top-0 bg-slate-900/95 py-1 z-10">
                  <span className="text-base">{el.icon}</span>
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: el.color }}>
                    {el.label}
                  </h4>
                  <div className="flex-1 h-px" style={{ backgroundColor: `${el.color}25` }} />
                  <span className="text-[10px] text-white/45">{grouped[el.key].length} stones</span>
                </div>

                {/* Stone Cards */}
                <div className="space-y-1">
                  {grouped[el.key].map(stone => {
                    const pol = POLARITY_BADGE[stone.polarity] || POLARITY_BADGE.Yin;
                    return (
                      <div
                        key={stone.name}
                        className="flex items-start gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                      >
                        {/* Stone Swatch */}
                        <div
                          className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5"
                          style={{
                            background: `radial-gradient(circle at 35% 30%, ${el.highlight}80, ${stone.color} 55%)`,
                            boxShadow: `0 2px 6px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)`,
                            border: '1px solid rgba(255,255,255,0.1)',
                          }}
                        />

                        {/* Stone Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-white/95">{stone.name}</span>
                            {stone.chineseName && (
                              <span className="text-[11px] text-white/55">{stone.chineseName}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${pol.bg} ${pol.text}`}>
                              {pol.label}
                            </span>
                            <QiBar value={stone.baseQi} color={el.color} />
                          </div>

                          <p className="text-[11px] text-white/60 mt-1 leading-relaxed group-hover:text-white/75 transition-colors">
                            {stone.notes}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="border-t border-slate-700/30 pt-3 pb-1 space-y-1.5">
              <p className="text-[10px] text-white/45 font-semibold uppercase tracking-wider">How to read</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-white/55">
                <div><span className="text-white/70">Qi Bar</span> {'\u2014'} Base effectiveness (0{'\u2013'}1) before seasonal modifiers</div>
                <div><span className="text-white/70">Yang {'\u2600'}</span> {'\u2014'} Dense, heavy energy for extreme imbalances</div>
                <div><span className="text-white/70">Yin {'\u263D'}</span> {'\u2014'} Gentle, nurturing energy for mild deficits</div>
                <div><span className="text-white/70">Yin-Yang {'\u262F'}</span> {'\u2014'} Balanced, adaptable energy</div>
              </div>
              <p className="text-[10px] text-white/45 mt-2">
                Final QiUnit = baseQi {'\u00D7'} seasonModifier {'\u00D7'} polarityFit. Seasonal strength follows the {'\u65FA\u76F8\u4F11\u56DA\u6B7B'} cycle.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
