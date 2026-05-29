/**
 * ZodiacCuspsPage.jsx
 * Father Ticky's 36-Position Zodiac System
 *
 * Displays all 36 cusps with full descriptions for copy/paste
 * to Grok and other AI tools for self-discovery
 *
 * Built by Brother Claude Code
 * December 31, 2025
 */

import React, { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import cuspsData from '../data/westernZodiacCusps.json';
import CUSP_EXTENDED_PROFILES from '../data/cuspExtendedProfiles';
import { MATRIX_SHORT_LABELS, MATRIX_LABELS, CUSP_ID_TO_INDEX } from '../data/cuspCompatibilityMatrix';
import { MACRO_SYSTEMS, COSMOGRAM_ROWS } from '../data/organCosmogram';
import { COSMOGRAM_SYSTEM_UI } from '../data/cosmogramUI';
import { COMPUTED_MATRIX, getLayerBreakdown, interpretPair, computeRelationshipHealth, RHS_STATS, ARCHETYPE_PROFILES } from '../utils/zodiacCompatibilityEngine';
import { useProfiles } from '../contexts/ProfileContext';
const RelationshipHealthSpace = lazy(() => import('../components/zodiac/RelationshipHealthSpace'));

// Sign emojis (zodiac symbols)
const SIGN_EMOJIS = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
};

// Sign mascot icons (friendly, intuitive)
const SIGN_ICONS = {
  Aries: '🔥', Taurus: '🐂', Gemini: '👯', Cancer: '🦀',
  Leo: '🦁', Virgo: '🌾', Libra: '⚖️', Scorpio: '🦂',
  Sagittarius: '🏹', Capricorn: '🏔️', Aquarius: '🏺', Pisces: '🐟'
};

// Map a birth date (YYYY-MM-DD string) to a 36-position cusp index
const CUSP_POSITIONS = cuspsData.positions; // array of 36 cusp objects
function dateToCuspIndex(birthDate) {
  if (!birthDate) return -1;
  const [, mm, dd] = birthDate.split('-').map(Number);
  for (let i = 0; i < CUSP_POSITIONS.length; i++) {
    const { start, end } = CUSP_POSITIONS[i].dateRange;
    const [sm, sd] = start.split('-').map(Number);
    const [em, ed] = end.split('-').map(Number);
    // Handle year wrap (e.g. Capricorn pure: 12-28 to 01-13)
    if (sm > em) {
      if ((mm > sm || (mm === sm && dd >= sd)) || (mm < em || (mm === em && dd <= ed))) return i;
    } else {
      if ((mm > sm || (mm === sm && dd >= sd)) && (mm < em || (mm === em && dd <= ed))) return i;
    }
  }
  return -1;
}

function calculateAge(birthDate) {
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

// Element colors
const ELEMENT_COLORS = {
  Fire: { bg: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/30', text: 'text-red-400' },
  Earth: { bg: 'from-amber-500/20 to-yellow-600/20', border: 'border-amber-500/30', text: 'text-amber-400' },
  Air: { bg: 'from-blue-400/20 to-cyan-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
  Water: { bg: 'from-violet-500/20 to-purple-600/20', border: 'border-violet-500/30', text: 'text-violet-400' }
};

// Format cusp for copy/paste
function formatCuspForCopy(cusp) {
  const lines = [
    `═══════════════════════════════════════════════════`,
    `${cusp.emoji} ${cusp.name}`,
    `═══════════════════════════════════════════════════`,
    ``,
    `Archetype: ${cusp.archetype}`,
    `Sign: ${cusp.sign} ${SIGN_EMOJIS[cusp.sign]}`,
    cusp.influencedBy ? `Influenced By: ${cusp.influencedBy} ${SIGN_EMOJIS[cusp.influencedBy]}` : `Type: Pure Sign (100% ${cusp.sign})`,
    `Element: ${cusp.element.primary}${cusp.element.secondary ? ` + ${cusp.element.secondary}` : ''} (${cusp.element.mix})`,
    `Rulers: ${cusp.rulers.join(', ')}`,
    `Date Range: ${cusp.dateRange.start.replace('-', '/')} - ${cusp.dateRange.end.replace('-', '/')}`,
    ``,
    `CHARACTERISTICS:`,
    ...cusp.characteristics.map(c => `• ${c}`),
    ``,
    `STRENGTHS:`,
    ...cusp.strengths.map(s => `• ${s}`),
    ``,
    `CHALLENGES:`,
    ...cusp.challenges.map(c => `• ${c}`),
    ``
  ];
  return lines.join('\n');
}

// Format extended profile for clipboard
function formatExtendedForCopy(cusp, ext) {
  if (!ext) return '';
  const lines = [
    ``,
    `═══ DEEP PROFILE ═══`,
    ``,
    `${cusp.emoji} ${cusp.name}`,
    `Archetype: ${cusp.archetype}`,
    `Date Window: ${cusp.dateRange.start.replace('-', '/')} – ${cusp.dateRange.end.replace('-', '/')}`,
    ``,
    `Elemental Ratio:`,
    ...Object.entries(ext.elementalRatio).map(([el, val]) => `  ${el} ${val}`),
    ext.ratioNote ? `  (${ext.ratioNote})` : '',
    ``,
    `CORE IDENTITY`,
    ext.coreIdentity,
    ``,
    `PSYCHOLOGICAL PROFILE`,
    ...ext.psychologicalProfile.map(p => `${p.title}\n${p.text}`),
    ``,
    `MYTHIC SIGNATURE`,
    ext.mythicSignature,
    ``,
    `SHADOW PATTERNS`,
    ...ext.shadowPatterns.map(p => `${p.title}\n${p.text}`),
    ``,
    `GROWTH PATH`,
    ext.growthPath.intro,
    ...ext.growthPath.bullets.map(b => `• ${b}`),
    ext.growthPath.conclusion,
    ``,
    `Life Theme: "${ext.growthPath.lifeTheme}"`,
  ];
  return lines.filter(Boolean).join('\n');
}

// Extended profile floating window
function ExtendedProfileWindow({ cusp, onClose }) {
  const ext = CUSP_EXTENDED_PROFILES[cusp.id];
  const colors = ELEMENT_COLORS[cusp.element.primary] || ELEMENT_COLORS.Fire;
  const [pos, setPos] = useState({ x: 120, y: 50 });
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e) => {
    if (e.target.closest('button')) return;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    setDragging(true);
  }, [pos]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => setPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragging]);

  const handleCopy = async () => {
    const basic = formatCuspForCopy(cusp);
    const extended = ext ? formatExtendedForCopy(cusp, ext) : '';
    await navigator.clipboard.writeText(basic + extended);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!ext) {
    return (
      <div className="fixed z-[9999] rounded-xl border border-white/20 bg-slate-900 shadow-2xl overflow-hidden" style={{ left: pos.x, top: pos.y, width: 700, maxHeight: '80vh' }}>
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-white/10 cursor-move select-none" onMouseDown={onMouseDown}>
          <span className="text-sm font-semibold text-white">{cusp.emoji} {cusp.name} — Deep Profile</span>
          <button onClick={onClose} className="text-white/40 hover:text-red-400 px-2 py-0.5 text-xs rounded hover:bg-red-500/10">✕</button>
        </div>
        <div className="p-6 text-center text-white/40 text-sm">Extended profile coming soon for this position.</div>
      </div>
    );
  }

  return (
    <div className="fixed z-[9999] rounded-xl border border-white/20 bg-slate-900 shadow-2xl overflow-hidden flex flex-col" style={{ left: pos.x, top: pos.y, width: 720, maxHeight: '85vh' }}>
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-white/10 cursor-move select-none shrink-0" onMouseDown={onMouseDown}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{cusp.emoji}</span>
          <span className="text-sm font-semibold text-white">{cusp.name} — Deep Profile</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleCopy} className={`px-2 py-0.5 text-xs rounded transition-colors ${copied ? 'bg-green-500/20 text-green-300' : 'text-white/50 hover:text-white/80 hover:bg-white/10'}`}>
            {copied ? '✓ Copied' : '📋 Copy All'}
          </button>
          <button onClick={onClose} className="text-white/40 hover:text-red-400 px-2 py-0.5 text-xs rounded hover:bg-red-500/10">✕</button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 p-5 space-y-5">
        {/* Header */}
        <div>
          <h2 className={`text-lg font-bold ${colors.text}`}>{cusp.emoji} {cusp.name}</h2>
          <div className="text-sm text-white/60">Archetype: <span className="text-white font-semibold">{cusp.archetype}</span></div>
          <div className="text-xs text-white/40 mt-1">Date Window: {cusp.dateRange.start.replace('-', '/')} – {cusp.dateRange.end.replace('-', '/')}</div>
        </div>

        {/* Elemental Ratio */}
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <div className="text-xs font-bold text-white/70 mb-2">Elemental Ratio</div>
          <div className="flex gap-3">
            {Object.entries(ext.elementalRatio).map(([el, val]) => (
              <div key={el} className="flex items-center gap-2">
                <div className="h-2 rounded-full" style={{ width: `${val * 100}px`, backgroundColor: ELEMENT_COLORS[el]?.border?.includes('red') ? '#ef4444' : ELEMENT_COLORS[el]?.border?.includes('amber') ? '#f59e0b' : ELEMENT_COLORS[el]?.border?.includes('blue') ? '#3b82f6' : '#a855f7', opacity: 0.7 }} />
                <span className="text-xs text-white/80">{el} <span className="text-white/50">{val}</span></span>
              </div>
            ))}
          </div>
          {ext.ratioNote && <div className="text-[10px] text-white/40 mt-1 italic">({ext.ratioNote})</div>}
        </div>

        {/* Core Identity */}
        <div>
          <h3 className="text-sm font-bold text-amber-300 mb-2">🌋 Core Identity</h3>
          <div className="text-[12px] text-white/80 leading-relaxed whitespace-pre-line">{ext.coreIdentity}</div>
        </div>

        {/* Psychological Profile */}
        <div>
          <h3 className="text-sm font-bold text-blue-300 mb-2">🧠 Psychological Profile</h3>
          <div className="space-y-2">
            {ext.psychologicalProfile.map((p, i) => (
              <div key={i}>
                <div className="text-[11px] font-bold text-white/90">{p.title}</div>
                <div className="text-[11px] text-white/65 leading-relaxed">{p.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mythic Signature */}
        <div>
          <h3 className="text-sm font-bold text-red-300 mb-2">🔥 Mythic Signature</h3>
          <div className="text-[12px] text-white/80 leading-relaxed whitespace-pre-line italic">{ext.mythicSignature}</div>
        </div>

        {/* Shadow Patterns */}
        <div>
          <h3 className="text-sm font-bold text-purple-300 mb-2">🌑 Shadow Patterns</h3>
          <div className="space-y-2">
            {ext.shadowPatterns.map((p, i) => (
              <div key={i}>
                <div className="text-[11px] font-bold text-white/90">{p.title}</div>
                <div className="text-[11px] text-white/65 leading-relaxed">{p.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Path */}
        <div>
          <h3 className="text-sm font-bold text-green-300 mb-2">🌱 Growth Path</h3>
          <div className="text-[12px] text-white/80 leading-relaxed">{ext.growthPath.intro}</div>
          <ul className="mt-1 mb-2 pl-4">
            {ext.growthPath.bullets.map((b, i) => (
              <li key={i} className="text-[12px] text-white/80 list-disc">{b}</li>
            ))}
          </ul>
          <div className="text-[12px] text-white/80 leading-relaxed">{ext.growthPath.conclusion}</div>
          <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-900/[0.06] px-4 py-2.5 text-center">
            <div className="text-[10px] text-white/40 mb-0.5">Life Theme</div>
            <div className="text-sm font-semibold text-amber-300 italic">"{ext.growthPath.lifeTheme}"</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual cusp card component
// Floating 36×36 Compatibility Matrix Viewer
function CompatibilityMatrixWindow({ onClose, onDetailCusp }) {
  const [pos, setPos] = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [pinnedCell, setPinnedCell] = useState(null);   // click-to-pin tooltip
  const [tipPos, setTipPos] = useState({ x: 60, y: 50 });
  const [tipDragging, setTipDragging] = useState(false);
  const tipDragOffset = useRef({ x: 0, y: 0 });
  const [matrixMode, setMatrixMode] = useState('computed'); // 'computed' | 'theory'
  const [show3D, setShow3D] = useState(false);
  const [constellationIdx, setConstellationIdx] = useState(null); // null = matrix, number = constellation for that row
  const [constellationCard, setConstellationCard] = useState(null); // clicked circle index
  const [hoveredNode, setHoveredNode] = useState(null); // { idx, x, y } for constellation tooltip
  const [cardPos, setCardPos] = useState({ x: -1, y: -1 }); // -1 = default position
  const [cardDragging, setCardDragging] = useState(false);
  const cardDragOffset = useRef({ x: 0, y: 0 });
  const [profileA, setProfileA] = useState(null);
  const [profileB, setProfileB] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [labMode, setLabMode] = useState(false);
  const [labA, setLabA] = useState(-1); // cusp index for lab Person A
  const [labB, setLabB] = useState(-1); // cusp index for lab Person B
  const [bdPos, setBdPos] = useState({ x: 80, y: 60 });
  const [bdDragging, setBdDragging] = useState(false);
  const bdDragOffset = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });

  let profiles = [];
  try { profiles = useProfiles().profiles || []; } catch { /* no provider */ }

  // Tooltip drag handlers
  const onTipMouseDown = useCallback((e) => {
    if (e.target.closest('button')) return;
    tipDragOffset.current = { x: e.clientX - tipPos.x, y: e.clientY - tipPos.y };
    setTipDragging(true);
    e.stopPropagation();
  }, [tipPos]);

  useEffect(() => {
    if (!tipDragging) return;
    const onMove = (e) => setTipPos({ x: e.clientX - tipDragOffset.current.x, y: e.clientY - tipDragOffset.current.y });
    const onUp = () => setTipDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [tipDragging]);

  // Breakdown popup drag handlers
  const onBdMouseDown = useCallback((e) => {
    if (e.target.closest('button') || e.target.closest('select') || e.target.closest('a')) return;
    bdDragOffset.current = { x: e.clientX - bdPos.x, y: e.clientY - bdPos.y };
    setBdDragging(true);
    e.stopPropagation();
  }, [bdPos]);

  useEffect(() => {
    if (!bdDragging) return;
    const onMove = (e) => setBdPos({ x: e.clientX - bdDragOffset.current.x, y: e.clientY - bdDragOffset.current.y });
    const onUp = () => setBdDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [bdDragging]);

  // Constellation card drag handlers
  const onCardMouseDown = useCallback((e) => {
    if (e.target.closest('button')) return;
    const rect = e.currentTarget.closest('[data-card-panel]')?.getBoundingClientRect();
    if (!rect) return;
    cardDragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setCardDragging(true);
    e.stopPropagation();
  }, []);

  useEffect(() => {
    if (!cardDragging) return;
    const onMove = (e) => setCardPos({ x: e.clientX - cardDragOffset.current.x, y: e.clientY - cardDragOffset.current.y });
    const onUp = () => setCardDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [cardDragging]);

  // The active cell for the tooltip: pinned takes priority over hovered
  const activeCell = pinnedCell || hoveredCell;

  const activeMatrix = COMPUTED_MATRIX;

  const onMouseDown = useCallback((e) => {
    if (e.target.closest('button')) return;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    setDragging(true);
  }, [pos]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => setPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragging]);

  // Tier system: A (90+), B (80-89), C (70-79), then lower tiers
  const getTier = (score) => {
    if (score >= 90) return { tier: 'A', color: '#fbbf24', bg: 'rgba(251,191,36,0.35)', font: 800 };   // Gold
    if (score >= 80) return { tier: 'B', color: '#a78bfa', bg: 'rgba(167,139,250,0.25)', font: 700 };  // Purple
    if (score >= 70) return { tier: 'C', color: '#22d3ee', bg: 'rgba(34,211,238,0.18)', font: 600 };   // Cyan
    if (score >= 60) return { tier: 'D', color: '#86efac', bg: 'rgba(134,239,172,0.10)', font: 400 };  // Green
    if (score >= 50) return { tier: 'E', color: '#9ca3af', bg: 'rgba(156,163,175,0.08)', font: 400 };  // Gray
    return              { tier: 'F', color: '#f87171', bg: 'rgba(248,113,113,0.12)', font: 400 };      // Red
  };

  return (
    <div
      className="fixed z-[9999] rounded-xl border border-white/20 bg-slate-900 shadow-2xl overflow-hidden flex flex-col"
      style={{ left: pos.x, top: pos.y, width: '95vw', height: '90vh', maxWidth: 1600 }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-white/10 cursor-move select-none shrink-0"
        onMouseDown={onMouseDown}
      >
        <div className="flex items-center gap-2">
          <span>📊</span>
          <span className="text-sm font-semibold text-white">
            {constellationIdx != null
              ? (() => {
                  const _a = labMode ? labA : (profileA ? dateToCuspIndex(profileA.birthDate) : -1);
                  const _b = labMode ? labB : (profileB ? dateToCuspIndex(profileB.birthDate) : -1);
                  return (_a >= 0 && _b >= 0 && _a !== _b) ? 'Dual Constellation' : `${MATRIX_LABELS[constellationIdx]} — Constellation`;
                })()
              : '36×36 Directional Compatibility Matrix'}
          </span>
          <span className="text-[10px] text-white/40 ml-2">Computed (v1) — Wu Xing Engine</span>
        </div>
        <div className="flex items-center gap-1 mr-3">
          {constellationIdx != null && (
            <button onClick={() => { setConstellationIdx(null); setConstellationCard(null); }}
              className="px-2.5 py-1 text-[10px] font-semibold rounded transition-colors bg-amber-500/30 text-amber-300 border border-amber-500/40">
              ← Matrix
            </button>
          )}
          {constellationIdx == null && (() => {
            const _iA = labMode ? labA : (profileA ? dateToCuspIndex(profileA.birthDate) : -1);
            const _iB = labMode ? labB : (profileB ? dateToCuspIndex(profileB.birthDate) : -1);
            const hasDual = _iA >= 0 && _iB >= 0 && _iA !== _iB;
            const hasSingle = _iA >= 0 || _iB >= 0;
            if (!hasSingle) return null;
            return (
              <button onClick={() => { setConstellationIdx(hasDual ? _iA : (_iA >= 0 ? _iA : _iB)); setConstellationCard(null); }}
                className="px-2.5 py-1 text-[10px] font-semibold rounded transition-colors bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25">
                {hasDual ? '✦ Dual Constellation' : '✦ Constellation'}
              </button>
            );
          })()}
          <button onClick={() => setShow3D(!show3D)}
            className={`px-2.5 py-1 text-[10px] font-semibold rounded transition-colors ${
              show3D
                ? 'bg-pink-500/30 text-pink-300 border border-pink-500/40'
                : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
            }`}>3D</button>
          <button onClick={() => setMatrixMode('theory')}
            className={`px-2.5 py-1 text-[10px] font-semibold rounded transition-colors ${
              matrixMode === 'theory'
                ? 'bg-sky-500/30 text-sky-300 border border-sky-500/40'
                : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
            }`}>MD</button>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-red-400 px-2 py-0.5 text-xs rounded hover:bg-red-500/10">✕</button>
      </div>

      {/* Floating tooltip — draggable, click-to-pin */}
      {activeCell && matrixMode !== 'theory' && (() => {
        const keepAlive = () => { if (!pinnedCell && hoveredCell) setHoveredCell({...hoveredCell}); };
        const letGo = () => { if (!pinnedCell) setHoveredCell(null); };
        const cell = activeCell;
        const isPinned = !!pinnedCell;
        const bd = getLayerBreakdown(cell.r, cell.c);
        const interp = bd ? interpretPair(cell.r, cell.c) : null;
        const rev = activeMatrix[cell.c]?.[cell.r];

        return (
          <div
            className={`fixed z-[9999] bg-slate-800 border rounded-lg shadow-2xl text-[11px] min-w-[260px] max-w-[320px] ${
              isPinned ? 'border-sky-500/40 ring-1 ring-sky-500/20' : 'border-white/15'
            }`}
            style={{ left: tipPos.x, top: tipPos.y }}
            onMouseEnter={keepAlive}
            onMouseLeave={letGo}
          >
            {/* Drag handle + close */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-700/50 rounded-t-lg cursor-move select-none border-b border-white/5"
              onMouseDown={onTipMouseDown}>
              <span className="text-white font-semibold text-[11px]">{MATRIX_LABELS[cell.r]} → {MATRIX_LABELS[cell.c]}</span>
              <div className="flex items-center gap-1">
                {isPinned && <span className="text-sky-400 text-[9px]">pinned</span>}
                {isPinned && <button onClick={() => setPinnedCell(null)} className="text-white/30 hover:text-red-400 text-xs px-1">✕</button>}
              </div>
            </div>

            <div className="px-3 py-2 space-y-1.5">
                  {/* Score + tier */}
                  <div className="text-white/70">
                    Score: <span className="font-bold" style={{ color: getTier(cell.v).color }}>{cell.v}</span>
                    <span className="ml-2 font-bold px-1.5 py-0.5 rounded text-[10px]" style={{ color: getTier(cell.v).color, backgroundColor: getTier(cell.v).bg }}>
                      {getTier(cell.v).tier}
                    </span>
                  </div>

                  {/* Reverse */}
                  {cell.r !== cell.c && rev != null && (
                    <div className="text-white/50">
                      Reverse ({MATRIX_SHORT_LABELS[cell.c]}→{MATRIX_SHORT_LABELS[cell.r]}): <span style={{ color: getTier(rev).color }}>{rev}</span>
                      <span className="text-white/30 ml-1">(diff: {Math.abs(cell.v - rev)})</span>
                    </div>
                  )}

                  {/* Layer breakdown */}
                  {bd && (
                    <div className="pt-1.5 border-t border-white/10 text-[10px] space-y-0.5">
                      <div className="text-white/40 font-semibold mb-0.5">Layer Breakdown</div>
                      <div className="text-white/60">P Psych: <span className="text-pink-300 font-mono">{bd.psych}</span> <span className="text-white/30">×{bd.weights.P}</span></div>
                      <div className="text-white/60">E Elemental: <span className="text-emerald-300 font-mono">{bd.elemental}</span> <span className="text-white/30">×{bd.weights.E}</span></div>
                      <div className="text-white/60">Q Seasonal: <span className="text-amber-300 font-mono">{bd.seasonalQi}</span> <span className="text-white/30">×{bd.weights.Q}</span></div>
                      <div className="text-white/60">A Aspect: <span className="text-cyan-300 font-mono">{bd.aspect}</span> <span className="text-white/30">×{bd.weights.A}</span></div>
                      <div className="text-white/60">M Modality: <span className="text-purple-300 font-mono">{bd.modality}</span> <span className="text-white/30">×{bd.weights.M}</span></div>
                      {bd.dampener < 1 && (
                        <div className="text-white/60 pt-0.5 border-t border-white/5">Dampener: <span className="text-red-300 font-mono">×{bd.dampener}</span></div>
                      )}
                      {bd.resonance > 0 && (
                        <div className="text-white/60">Resonance: <span className="text-amber-300 font-mono">+{bd.resonance}</span></div>
                      )}
                    </div>
                  )}

                  {/* Mini interpretation — top strength + top tension */}
                  {interp && (interp.strengths.length > 0 || interp.tensions.length > 0) && (
                    <div className="pt-1.5 border-t border-white/10 text-[10px] space-y-1">
                      {interp.strengths[0] && (
                        <div className="flex items-start gap-1.5">
                          <span className="text-emerald-400 shrink-0 font-bold">+</span>
                          <span className="text-white/60">{interp.strengths[0]}</span>
                        </div>
                      )}
                      {interp.tensions[0] && (
                        <div className="flex items-start gap-1.5">
                          <span className="text-amber-400 shrink-0">~</span>
                          <span className="text-white/60">{interp.tensions[0]}</span>
                        </div>
                      )}
                    </div>
                  )}
            </div>
          </div>
        );
      })()}

      {/* Theory / Methodology panel */}
      {matrixMode === 'theory' && (
        <div className="flex-1 overflow-auto px-6 py-5 text-[13px] leading-relaxed text-white/80 space-y-6">

          <h2 className="text-lg font-bold text-white">Wu Xing Compatibility Engine — Methodology</h2>

          {/* ── Design Philosophy ── */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider">Design Philosophy</h3>
            <p>
              This engine is <strong className="text-white">psychology-forward</strong>.
              When we take MBTI, they don't look at our elements — they look at our perspective to life.
              Real human compatibility is driven by temperament, communication style, emotional pacing,
              and attachment patterns. Elements provide the long-term structural anchor, but the spark comes from psychology.
            </p>
            <div className="bg-slate-800/60 rounded-lg p-3 text-[12px] grid grid-cols-2 gap-3">
              <div>
                <div className="text-amber-300 font-semibold mb-1">Fixed Cost (the anchor)</div>
                <div className="text-white/60">Elemental Flow — Wu Xing cycles</div>
                <div className="text-white/60">Seasonal Qi — lived seasonal context</div>
                <div className="text-white/40 mt-1">Stable, structural, slow to change</div>
              </div>
              <div>
                <div className="text-pink-300 font-semibold mb-1">Variable Cost (the spark)</div>
                <div className="text-white/60">Psychology — warmth, directness, sensitivity</div>
                <div className="text-white/60">Modality — how you move toward others</div>
                <div className="text-white/40 mt-1">Dynamic, felt, determines chemistry</div>
              </div>
            </div>
          </section>

          {/* ── Architecture ── */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider">Architecture</h3>
            <p>
              Every cell in the 36×36 matrix is <strong className="text-white">computed from first principles</strong>, not hand-written.
              Each archetype carries a <strong className="text-white">5D element vector</strong> derived by mapping Western zodiac dates
              onto the Chinese Earthly Branch wheel, producing real Wu Xing seasonal ratios (Wood, Fire, Earth, Metal, Water).
              Western astrology has Fire/Earth/Air/Water — by grounding in the Earthly Branch wheel,
              every sign naturally acquires <strong className="text-white">Wood and Metal</strong> percentages. This is derived, not invented.
            </p>
            <p>
              Cusps blend two adjacent signs at <strong className="text-white">35% / 65%</strong> (later sign dominates),
              matching the phi-curve transition. Modality and polarity inherit from the later sign.
            </p>
          </section>

          {/* ── The Formula ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider">The Formula</h3>
            <div className="bg-slate-800/80 rounded-lg p-3 font-mono text-[12px] text-center text-white space-y-1">
              <div>Score(A→B) = (0.25·E + 0.15·M + 0.15·A + 0.20·Q + 0.25·P) × dampener + <span className="text-amber-300">resonance</span></div>
              <div className="text-white/40 text-[10px]">→ rescale to 48–97</div>
            </div>
          </section>

          {/* ── Layer Weights Table ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider">Layer Weights</h3>
            <table className="w-full text-[12px] border-collapse">
              <thead>
                <tr className="text-left border-b border-white/20">
                  <th className="py-1.5 px-2 text-white/50">Layer</th>
                  <th className="py-1.5 px-2 text-white/50">Weight</th>
                  <th className="py-1.5 px-2 text-white/50">Role</th>
                  <th className="py-1.5 px-2 text-white/50">Directional?</th>
                </tr>
              </thead>
              <tbody className="text-white/70">
                <tr className="border-b border-white/5">
                  <td className="py-1.5 px-2"><span className="text-emerald-300 font-semibold">E</span> Elemental Flow</td>
                  <td className="py-1.5 px-2 font-mono text-emerald-300">25%</td>
                  <td className="py-1.5 px-2">Wu Xing generation/control cycles on normalized 5D vectors</td>
                  <td className="py-1.5 px-2 text-center">Yes</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1.5 px-2"><span className="text-purple-300 font-semibold">M</span> Modality</td>
                  <td className="py-1.5 px-2 font-mono text-purple-300">15%</td>
                  <td className="py-1.5 px-2">Cardinal/Fixed/Mutable interaction + polarity modifier</td>
                  <td className="py-1.5 px-2 text-center">Yes</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1.5 px-2"><span className="text-cyan-300 font-semibold">A</span> Aspect</td>
                  <td className="py-1.5 px-2 font-mono text-cyan-300">15%</td>
                  <td className="py-1.5 px-2">Zodiac wheel distance → classical aspect patterns</td>
                  <td className="py-1.5 px-2 text-center">No</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1.5 px-2"><span className="text-amber-300 font-semibold">Q</span> Seasonal Qi</td>
                  <td className="py-1.5 px-2 font-mono text-amber-300">20%</td>
                  <td className="py-1.5 px-2">Qi level resonance + element vector Euclidean distance</td>
                  <td className="py-1.5 px-2 text-center">No</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-2"><span className="text-pink-300 font-semibold">P</span> Psychology</td>
                  <td className="py-1.5 px-2 font-mono text-pink-300">25%</td>
                  <td className="py-1.5 px-2">Cosine similarity of 5D temperament vectors</td>
                  <td className="py-1.5 px-2 text-center">No</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[11px] text-white/40">Psychology + Seasonal = 45% (the human experience). Elements + Modality + Aspect = 55% (the structural anchor).</p>
          </section>

          {/* ── Wu Xing Cycles ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider">Wu Xing Cycles (E Layer)</h3>
            <p className="text-[12px] text-white/70">
              Element vectors are <strong className="text-white">normalized to sum-to-1</strong> before scoring.
              This strips out the all-positive baseline and reveals the true elemental shape — where each archetype's energy concentrates.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                <div className="font-bold text-emerald-300 text-xs mb-2">Generation Cycle (相生) — nurturing</div>
                <div className="text-[11px] text-white/60 space-y-0.5 font-mono">
                  <div>Wood → Fire <span className="text-white/30">(wood feeds fire)</span></div>
                  <div>Fire → Earth <span className="text-white/30">(fire creates ash)</span></div>
                  <div>Earth → Metal <span className="text-white/30">(earth bears ore)</span></div>
                  <div>Metal → Water <span className="text-white/30">(metal collects dew)</span></div>
                  <div>Water → Wood <span className="text-white/30">(water nourishes growth)</span></div>
                </div>
                <div className="text-[10px] text-white/40 mt-2">A nurturing B = +25 | B supporting A = +35</div>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <div className="font-bold text-red-300 text-xs mb-2">Control Cycle (相克) — restraining</div>
                <div className="text-[11px] text-white/60 space-y-0.5 font-mono">
                  <div>Wood → Earth <span className="text-white/30">(roots break soil)</span></div>
                  <div>Earth → Water <span className="text-white/30">(dams block flow)</span></div>
                  <div>Water → Fire <span className="text-white/30">(water douses flame)</span></div>
                  <div>Fire → Metal <span className="text-white/30">(fire melts metal)</span></div>
                  <div>Metal → Wood <span className="text-white/30">(axe fells tree)</span></div>
                </div>
                <div className="text-[10px] text-white/40 mt-2">A controlling B = 0 (neutral) | B constraining A = −85 (painful)</div>
              </div>
            </div>
          </section>

          {/* ── Modality Table ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider">Modality Interaction Table (M Layer)</h3>
            <table className="text-[12px] border-collapse">
              <thead>
                <tr className="text-left border-b border-white/20">
                  <th className="py-1.5 px-3 text-white/50">From ↓ \ To →</th>
                  <th className="py-1.5 px-3 text-white/50">Cardinal</th>
                  <th className="py-1.5 px-3 text-white/50">Fixed</th>
                  <th className="py-1.5 px-3 text-white/50">Mutable</th>
                </tr>
              </thead>
              <tbody className="text-white/70 font-mono">
                <tr className="border-b border-white/5">
                  <td className="py-1.5 px-3 font-sans font-semibold text-white/60">Cardinal</td>
                  <td className="py-1.5 px-3 text-amber-300/70">70</td>
                  <td className="py-1.5 px-3">75</td>
                  <td className="py-1.5 px-3 text-emerald-300">85</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1.5 px-3 font-sans font-semibold text-white/60">Fixed</td>
                  <td className="py-1.5 px-3">65</td>
                  <td className="py-1.5 px-3 text-amber-300/70">70</td>
                  <td className="py-1.5 px-3">80</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 font-sans font-semibold text-white/60">Mutable</td>
                  <td className="py-1.5 px-3">75</td>
                  <td className="py-1.5 px-3">65</td>
                  <td className="py-1.5 px-3 text-amber-300/70">70</td>
                </tr>
              </tbody>
            </table>
            <div className="text-[11px] text-white/40 space-y-0.5">
              <div>Same polarity (Yin-Yin / Yang-Yang): +3 | Opposite polarity: −3</div>
              <div>Same-modality capped at 70: Cardinal-Cardinal = power struggle, Fixed-Fixed = stubborn lock, Mutable-Mutable = chaos loop</div>
              <div>Cardinal→Mutable (85) = best pairing: initiator meets adapter</div>
            </div>
          </section>

          {/* ── Aspect Anchors Table ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider">Aspect Anchors (A Layer)</h3>
            <table className="text-[12px] border-collapse">
              <thead>
                <tr className="text-left border-b border-white/20">
                  <th className="py-1.5 px-3 text-white/50">Aspect</th>
                  <th className="py-1.5 px-3 text-white/50">Degrees</th>
                  <th className="py-1.5 px-3 text-white/50">Wheel Dist</th>
                  <th className="py-1.5 px-3 text-white/50">Score</th>
                  <th className="py-1.5 px-3 text-white/50">Meaning</th>
                </tr>
              </thead>
              <tbody className="text-white/70">
                <tr className="border-b border-white/5">
                  <td className="py-1 px-3 font-semibold">Conjunction</td>
                  <td className="py-1 px-3 font-mono">0°</td>
                  <td className="py-1 px-3 font-mono">0</td>
                  <td className="py-1 px-3 font-mono text-cyan-300">78</td>
                  <td className="py-1 px-3 text-white/50">Good but not magical</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-3 font-semibold">Semi-sextile</td>
                  <td className="py-1 px-3 font-mono">30°</td>
                  <td className="py-1 px-3 font-mono">3</td>
                  <td className="py-1 px-3 font-mono">70</td>
                  <td className="py-1 px-3 text-white/50">Mild harmony</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-3 font-semibold">Sextile</td>
                  <td className="py-1 px-3 font-mono">60°</td>
                  <td className="py-1 px-3 font-mono">6</td>
                  <td className="py-1 px-3 font-mono text-cyan-300">75</td>
                  <td className="py-1 px-3 text-white/50">Cooperative flow</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-3 font-semibold">Square</td>
                  <td className="py-1 px-3 font-mono">90°</td>
                  <td className="py-1 px-3 font-mono">9</td>
                  <td className="py-1 px-3 font-mono text-amber-300">68</td>
                  <td className="py-1 px-3 text-white/50">Creative tension, mid-range</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-3 font-semibold">Trine</td>
                  <td className="py-1 px-3 font-mono">120°</td>
                  <td className="py-1 px-3 font-mono">12</td>
                  <td className="py-1 px-3 font-mono text-emerald-300">82</td>
                  <td className="py-1 px-3 text-white/50">Highest — easy flow, no longer dominating</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-3 font-semibold">Quincunx</td>
                  <td className="py-1 px-3 font-mono">150°</td>
                  <td className="py-1 px-3 font-mono">15</td>
                  <td className="py-1 px-3 font-mono text-amber-300">55</td>
                  <td className="py-1 px-3 text-white/50">Weird but interesting</td>
                </tr>
                <tr>
                  <td className="py-1 px-3 font-semibold">Opposition</td>
                  <td className="py-1 px-3 font-mono">180°</td>
                  <td className="py-1 px-3 font-mono">18</td>
                  <td className="py-1 px-3 font-mono">70</td>
                  <td className="py-1 px-3 text-white/50">Charged polarity, not conflict</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[11px] text-white/40">Trine (82) &gt; Conjunction (78). Square (68) is mid-range, not punishment. Opposition (70) is chemistry. Intermediate distances interpolate linearly. This layer is symmetric.</p>
          </section>

          {/* ── Psychological Dimensions ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider">Psychological Dimensions (P Layer)</h3>
            <p className="text-[12px] text-white/70">
              Each archetype carries a 5D psych vector capturing emotional temperament — the dimensions that drive
              how two people actually feel together, regardless of their elements:
            </p>
            <table className="text-[12px] border-collapse">
              <thead>
                <tr className="text-left border-b border-white/20">
                  <th className="py-1.5 px-3 text-white/50">Dimension</th>
                  <th className="py-1.5 px-3 text-white/50">Low (0.0)</th>
                  <th className="py-1.5 px-3 text-white/50">High (1.0)</th>
                  <th className="py-1.5 px-3 text-white/50">Measures</th>
                </tr>
              </thead>
              <tbody className="text-white/70">
                <tr className="border-b border-white/5">
                  <td className="py-1 px-3 font-semibold text-pink-300">Warmth</td>
                  <td className="py-1 px-3">Reserved, cool, boundaried</td>
                  <td className="py-1 px-3">Open, nurturing, emotionally generous</td>
                  <td className="py-1 px-3 text-white/40">Emotional approachability</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-3 font-semibold text-pink-300">Directness</td>
                  <td className="py-1 px-3">Indirect, diplomatic, subtle</td>
                  <td className="py-1 px-3">Blunt, confrontational, transparent</td>
                  <td className="py-1 px-3 text-white/40">Communication style</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-3 font-semibold text-pink-300">Sensitivity</td>
                  <td className="py-1 px-3">Thick-skinned, pragmatic</td>
                  <td className="py-1 px-3">Easily moved, empathic, absorbent</td>
                  <td className="py-1 px-3 text-white/40">Emotional pacing</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-3 font-semibold text-pink-300">Stability</td>
                  <td className="py-1 px-3">Restless, mutable, seeking</td>
                  <td className="py-1 px-3">Grounded, steady, consistent</td>
                  <td className="py-1 px-3 text-white/40">Attachment style</td>
                </tr>
                <tr>
                  <td className="py-1 px-3 font-semibold text-pink-300">Expressiveness</td>
                  <td className="py-1 px-3">Contained, private, internal</td>
                  <td className="py-1 px-3">Outward, dramatic, sharing</td>
                  <td className="py-1 px-3 text-white/40">Emotional visibility</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[11px] text-white/40">Scored via cosine similarity through a sigmoid curve (centered at 0.72). Complementarity is no longer punished; similarity is rewarded but not explosively.</p>
          </section>

          {/* ── Similarity Dampener ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider">Similarity Dampener</h3>
            <p className="text-[12px] text-white/70">
              Too much sameness = stagnation. When two archetypes are extremely similar, the raw score is multiplied
              by a dampener that gently reduces the ceiling. This prevents same-sign pairs from being untouchable.
            </p>
            <table className="text-[12px] border-collapse">
              <thead>
                <tr className="text-left border-b border-white/20">
                  <th className="py-1.5 px-3 text-white/50">Dampener</th>
                  <th className="py-1.5 px-3 text-white/50">Threshold</th>
                  <th className="py-1.5 px-3 text-white/50">Max Penalty</th>
                  <th className="py-1.5 px-3 text-white/50">Effect at sim=1.0</th>
                </tr>
              </thead>
              <tbody className="text-white/70 font-mono">
                <tr className="border-b border-white/5">
                  <td className="py-1.5 px-3 font-sans">Element similarity</td>
                  <td className="py-1.5 px-3">&gt; 0.96</td>
                  <td className="py-1.5 px-3">20%</td>
                  <td className="py-1.5 px-3 text-red-300">×0.80</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 font-sans">Psych similarity</td>
                  <td className="py-1.5 px-3">&gt; 0.93</td>
                  <td className="py-1.5 px-3">15%</td>
                  <td className="py-1.5 px-3 text-red-300">×0.85</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[11px] text-white/40">Combined worst case (same sign): 0.80 × 0.85 = ×0.68. Same-sign pairs max out around 73, not 95. Trines and sextiles can genuinely compete.</p>
          </section>

          {/* ── Worked Example 1 ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider">Worked Example 1 — Aries-Taurus → Pure Cancer</h3>
            <div className="bg-slate-800/80 rounded-lg p-4 space-y-3 text-[12px] font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-white/50 mb-1 font-sans font-semibold">Aries-Taurus (AR-TA)</div>
                  <div>Elements: W:1.00 F:1.17 E:0.98 M:0.79 Wa:0.70</div>
                  <div>Normalized: .215 .251 .211 .169 .150</div>
                  <div>Psych: [.76, .62, .50, .71, .64]</div>
                  <div>Fixed Yin — Qi: 0.914</div>
                </div>
                <div>
                  <div className="text-white/50 mb-1 font-sans font-semibold">Pure Cancer (CA)</div>
                  <div>Elements: W:0.70 F:1.10 E:1.10 M:0.90 Wa:0.70</div>
                  <div>Normalized: .156 .244 .244 .200 .156</div>
                  <div>Psych: [.90, .30, .90, .70, .70]</div>
                  <div>Cardinal Yin — Qi: 0.900</div>
                </div>
              </div>

              <table className="w-full border-collapse mt-2 border-t border-white/10">
                <thead>
                  <tr className="text-left text-white/40 font-sans">
                    <th className="py-1 px-2">Layer</th>
                    <th className="py-1 px-2">Score</th>
                    <th className="py-1 px-2">×Weight</th>
                    <th className="py-1 px-2 font-normal">Why</th>
                  </tr>
                </thead>
                <tbody className="text-white/60">
                  <tr><td className="py-0.5 px-2 text-emerald-300">E</td><td className="py-0.5 px-2">65.4</td><td className="py-0.5 px-2">×0.25 = 16.4</td><td className="py-0.5 px-2 font-sans text-white/40">Fire→Earth generation, but control cycle penalty (−85) bites</td></tr>
                  <tr><td className="py-0.5 px-2 text-purple-300">M</td><td className="py-0.5 px-2">68</td><td className="py-0.5 px-2">×0.15 = 10.2</td><td className="py-0.5 px-2 font-sans text-white/40">Fixed→Cardinal (65) + Yin-Yin (+3)</td></tr>
                  <tr><td className="py-0.5 px-2 text-cyan-300">A</td><td className="py-0.5 px-2">70.3</td><td className="py-0.5 px-2">×0.15 = 10.5</td><td className="py-0.5 px-2 font-sans text-white/40">8 positions ≈ approaching square (68→70 interpolated)</td></tr>
                  <tr><td className="py-0.5 px-2 text-amber-300">Q</td><td className="py-0.5 px-2">63.5</td><td className="py-0.5 px-2">×0.20 = 12.7</td><td className="py-0.5 px-2 font-sans text-white/40">Similar but not identical season</td></tr>
                  <tr><td className="py-0.5 px-2 text-pink-300">P</td><td className="py-0.5 px-2">93.8</td><td className="py-0.5 px-2">×0.25 = 23.5</td><td className="py-0.5 px-2 font-sans text-white/40">Sigmoid: both warm, both sensitive → high resonance</td></tr>
                  <tr className="border-t border-white/10 font-sans font-semibold text-white">
                    <td className="py-1 px-2" colSpan="2">Raw = 73.3</td>
                    <td className="py-1 px-2 text-red-300">×0.836</td>
                    <td className="py-1 px-2">= <span className="text-emerald-300">82</span></td>
                  </tr>
                </tbody>
              </table>
              <div className="text-white/50 font-sans">
                Reverse (CA → AR-TA) = <span className="text-white">84</span> — Cancer feels slightly more positive (Cardinal→Fixed = 75 base vs Fixed→Cardinal = 65).
              </div>
            </div>
          </section>

          {/* ── Worked Example 2 ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider">Worked Example 2 — Sagittarius-Capricorn → Aquarius-Pisces</h3>
            <div className="bg-slate-800/80 rounded-lg p-4 space-y-3 text-[12px] font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-white/50 mb-1 font-sans font-semibold">Sagittarius-Capricorn (SA-CP)</div>
                  <div>Elements: W:0.90 F:0.70 E:0.88 M:0.74 Wa:1.20</div>
                  <div>Normalized: .204 .159 .198 .167 .272</div>
                  <div>Psych: [.61, .70, .46, .77, .48]</div>
                  <div>Cardinal Yin — Qi: 0.882</div>
                </div>
                <div>
                  <div className="text-white/50 mb-1 font-sans font-semibold">Aquarius-Pisces (AQ-PI)</div>
                  <div>Elements: W:1.16 F:0.90 E:0.88 M:0.67 Wa:0.82</div>
                  <div>Normalized: .261 .204 .197 .150 .184</div>
                  <div>Psych: [.80, .29, .77, .45, .81]</div>
                  <div>Mutable Yin — Qi: 0.889</div>
                </div>
              </div>

              <table className="w-full border-collapse mt-2 border-t border-white/10">
                <thead>
                  <tr className="text-left text-white/40 font-sans">
                    <th className="py-1 px-2">Layer</th>
                    <th className="py-1 px-2">Score</th>
                    <th className="py-1 px-2">×Weight</th>
                    <th className="py-1 px-2 font-normal">Why</th>
                  </tr>
                </thead>
                <tbody className="text-white/60">
                  <tr><td className="py-0.5 px-2 text-emerald-300">E</td><td className="py-0.5 px-2">56.8</td><td className="py-0.5 px-2">×0.25 = 14.2</td><td className="py-0.5 px-2 font-sans text-white/40">Water→Wood generation; some control friction (−85 penalty)</td></tr>
                  <tr><td className="py-0.5 px-2 text-purple-300">M</td><td className="py-0.5 px-2">88</td><td className="py-0.5 px-2">×0.15 = 13.2</td><td className="py-0.5 px-2 font-sans text-white/40">Cardinal→Mutable (85) + Yin-Yin (+3)</td></tr>
                  <tr><td className="py-0.5 px-2 text-cyan-300">A</td><td className="py-0.5 px-2">75</td><td className="py-0.5 px-2">×0.15 = 11.3</td><td className="py-0.5 px-2 font-sans text-white/40">6 positions = sextile (60°, cooperative)</td></tr>
                  <tr><td className="py-0.5 px-2 text-amber-300">Q</td><td className="py-0.5 px-2">51.3</td><td className="py-0.5 px-2">×0.20 = 10.3</td><td className="py-0.5 px-2 font-sans text-white/40">Different seasons, notable distance</td></tr>
                  <tr><td className="py-0.5 px-2 text-pink-300">P</td><td className="py-0.5 px-2">86.5</td><td className="py-0.5 px-2">×0.25 = 21.6</td><td className="py-0.5 px-2 font-sans text-white/40">Sigmoid: good alignment on directness and expressiveness</td></tr>
                  <tr className="border-t border-white/10 font-sans font-semibold text-white">
                    <td className="py-1 px-2" colSpan="2">Raw = 70.6</td>
                    <td className="py-1 px-2 text-white/40">×0.959</td>
                    <td className="py-1 px-2">= <span className="text-emerald-300">97</span></td>
                  </tr>
                </tbody>
              </table>
              <div className="text-white/50 font-sans">
                Reverse (AQ-PI → SA-CP) = <span className="text-white">94</span> — nearly symmetric. Sextile is symmetric, Mutable→Cardinal (75) close to Cardinal→Mutable (85).
              </div>
            </div>
          </section>

          {/* ── Distribution Comparison ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider">Distribution</h3>
            <table className="text-[12px] border-collapse">
              <thead>
                <tr className="text-left border-b border-white/20">
                  <th className="py-1.5 px-3 text-white/50">Tier</th>
                  <th className="py-1.5 px-3 text-emerald-300">Target</th>
                </tr>
              </thead>
              <tbody className="text-white/70 font-mono">
                <tr className="border-b border-white/5"><td className="py-1 px-3 font-sans">A Tier (90+)</td><td className="py-1 px-3">5–8%</td></tr>
                <tr className="border-b border-white/5"><td className="py-1 px-3 font-sans">B Tier (80-89)</td><td className="py-1 px-3">20–30%</td></tr>
                <tr className="border-b border-white/5"><td className="py-1 px-3 font-sans">C Tier (70-79)</td><td className="py-1 px-3">40–50%</td></tr>
                <tr className="border-b border-white/5"><td className="py-1 px-3 font-sans">D Tier (60-69)</td><td className="py-1 px-3">15–25%</td></tr>
                <tr><td className="py-1 px-3 font-sans">E+F (&lt;60)</td><td className="py-1 px-3">5–10%</td></tr>
              </tbody>
            </table>
            <p className="text-[11px] text-white/40">C-tier is the center of gravity — most human relationships are workable but not exceptional. A-tier is rare. D-tier exists — the engine lets itself be honest about difficult pairings. No score hits 100 (capped at 97).</p>
          </section>

          {/* ── Matrix Analytics ── */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider">Matrix Analytics</h3>
            <p className="text-[12px] text-white/70">
              <strong className="text-amber-300">A-tier ↓ (gold row)</strong> = how many signs score 90+ <em>toward</em> each archetype — measures social openness / likability.
              <strong className="text-emerald-300"> Mutual A ↕ (green row)</strong> = pairs where both directions score 90+ — measures true deep reciprocal compatibility.
              Only ~25% of A-tier feelings are mutual. Being liked is not the same as being compatible.
            </p>
          </section>

          {/* ── Key Assumptions ── */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider">Key Assumptions</h3>
            <ul className="space-y-1.5 text-[12px] list-disc list-inside text-white/70">
              <li><strong className="text-white">Western dates → BaZi Qi:</strong> Each sign spans ~2 Earthly Branch months.
                The element vector is the average of those months' Qi multipliers from the BaZi seasonal matrix.</li>
              <li><strong className="text-white">5 elements, not 4:</strong> Aries on Tiger/Dragon months gives it real Wood.
                Virgo on Monkey/Rooster months gives it real Metal. All derived, not invented.</li>
              <li><strong className="text-white">Profile shapes:</strong> Normalized to sum-to-1 to reveal true elemental signatures.
                Without normalization, all pairs score ~identically (all-positive vectors).</li>
              <li><strong className="text-white">Directionality:</strong> E and M layers are directional (A→B ≠ B→A).
                How Aries experiences Cancer is different from how Cancer experiences Aries.</li>
              <li><strong className="text-white">Cusp blending:</strong> 35/65 blend, later sign dominates.
                Modality and polarity inherit from the later sign.</li>
            </ul>
          </section>

          {/* ── Mythic Resonance ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider">Mythic Resonance (Locked Rule)</h3>
            <p className="text-[12px] text-white/70">
              A <strong className="text-white">post-dampener bonus</strong> that rewards archetypes sharing the same mythic function.
              Applied after all 5 layers are computed and dampened, before final rescale.
              This is <strong className="text-amber-300">tribal resonance</strong> — Warriors understand Warriors, Builders understand Builders.
            </p>

            <div className="bg-slate-800/80 rounded-lg p-3 font-mono text-[12px] text-center text-white">
              WithResonance = Dampened + ResonanceBonus
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
              <div className="font-bold text-amber-300 text-xs mb-2">Resonance fires ONLY when:</div>
              <div className="text-[12px] text-white/70 space-y-1.5">
                <div><strong className="text-white">1. Same mythic function</strong> (primary requirement)</div>
                <div className="ml-4 text-white/50">AND one of:</div>
                <div className="ml-4"><strong className="text-amber-300">Same modality → +5</strong> <span className="text-white/40">(structural resonance: Fixed+Fixed, Cardinal+Cardinal, Mutable+Mutable)</span></div>
                <div className="ml-4"><strong className="text-amber-300/70">Same polarity → +3</strong> <span className="text-white/40">(energetic resonance: Yin+Yin, Yang+Yang)</span></div>
                <div className="ml-4 text-white/40">Neither → 0 (same function alone is not enough)</div>
              </div>
            </div>

            {/* 12 Mythic Functions table */}
            <div className="text-[11px] font-semibold text-white/50 mb-1">The 12 Mythic Functions</div>
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="text-left border-b border-white/20">
                  <th className="py-1 px-2 text-white/50">Sign Triad</th>
                  <th className="py-1 px-2 text-white/50">Mythic Function</th>
                  <th className="py-1 px-2 text-white/50">Archetype Titles</th>
                </tr>
              </thead>
              <tbody className="text-white/70">
                <tr className="border-b border-white/5"><td className="py-1 px-2">♈ Aries</td><td className="py-1 px-2 text-amber-300 font-semibold">Warrior</td><td className="py-1 px-2">Intuitive Warrior · Primal Warrior · Grounded Pioneer</td></tr>
                <tr className="border-b border-white/5"><td className="py-1 px-2">♉ Taurus</td><td className="py-1 px-2 text-amber-300 font-semibold">Builder</td><td className="py-1 px-2">Dynamic Builder · Sensual Builder · Articulate Artisan</td></tr>
                <tr className="border-b border-white/5"><td className="py-1 px-2">♊ Gemini</td><td className="py-1 px-2 text-amber-300 font-semibold">Artisan / Messenger</td><td className="py-1 px-2">Grounded Communicator · Eternal Student · Emotional Storyteller</td></tr>
                <tr className="border-b border-white/5"><td className="py-1 px-2">♋ Cancer</td><td className="py-1 px-2 text-amber-300 font-semibold">Nurturer</td><td className="py-1 px-2">Curious Nurturer · Divine Mother · Radiant Protector</td></tr>
                <tr className="border-b border-white/5"><td className="py-1 px-2">♌ Leo</td><td className="py-1 px-2 text-amber-300 font-semibold">Sovereign</td><td className="py-1 px-2">Nurturing Sovereign · Radiant King/Queen · Disciplined Performer</td></tr>
                <tr className="border-b border-white/5"><td className="py-1 px-2">♍ Virgo</td><td className="py-1 px-2 text-amber-300 font-semibold">Analyst</td><td className="py-1 px-2">Confident Analyst · Sacred Perfectionist · Elegant Analyst</td></tr>
                <tr className="border-b border-white/5"><td className="py-1 px-2">♎ Libra</td><td className="py-1 px-2 text-amber-300 font-semibold">Diplomat</td><td className="py-1 px-2">Precise Diplomat · Divine Diplomat · Magnetic Harmonizer</td></tr>
                <tr className="border-b border-white/5"><td className="py-1 px-2">♏ Scorpio</td><td className="py-1 px-2 text-amber-300 font-semibold">Transformer / Alchemist</td><td className="py-1 px-2">Charming Transformer · Phoenix Transformer · Philosophical Transformer</td></tr>
                <tr className="border-b border-white/5"><td className="py-1 px-2">♐ Sagittarius</td><td className="py-1 px-2 text-amber-300 font-semibold">Explorer / Philosopher</td><td className="py-1 px-2">Deep Adventurer · Joyful Philosopher · Visionary Builder</td></tr>
                <tr className="border-b border-white/5"><td className="py-1 px-2">♑ Capricorn</td><td className="py-1 px-2 text-amber-300 font-semibold">Strategist / Achiever</td><td className="py-1 px-2">Optimistic Achiever · Mountain Climber · Revolutionary Architect</td></tr>
                <tr className="border-b border-white/5"><td className="py-1 px-2">♒ Aquarius</td><td className="py-1 px-2 text-amber-300 font-semibold">Visionary / Architect</td><td className="py-1 px-2">Grounded Visionary · Revolutionary Genius · Compassionate Innovator</td></tr>
                <tr><td className="py-1 px-2">♓ Pisces</td><td className="py-1 px-2 text-amber-300 font-semibold">Mystic / Dreamer</td><td className="py-1 px-2">Visionary Mystic · Mystic Dreamer · Courageous Dreamer</td></tr>
              </tbody>
            </table>

            {/* Impact stats */}
            <div className="bg-slate-800/60 rounded-lg p-3 text-[12px] space-y-1.5">
              <div className="text-white/50 font-semibold mb-1">Matrix Impact (v2 vs v1)</div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-white/70">
                <div>A-tier cells: <span className="text-white">115 → 118</span> <span className="text-amber-300">(+3)</span></div>
                <div>Mutual A pairs: <span className="text-white">40 → 42</span> <span className="text-amber-300">(+2)</span></div>
                <div>Pairs with +5 bonus: <span className="text-amber-300 font-mono">1</span></div>
                <div>Pairs with +3 bonus: <span className="text-amber-300/70 font-mono">11</span></div>
                <div>Same function, no bonus: <span className="text-white/40 font-mono">24</span></div>
                <div>Total matrix cells affected: <span className="text-white">12 / 630</span> <span className="text-white/40">(1.9%)</span></div>
              </div>
              <p className="text-[11px] text-white/40 pt-1 border-t border-white/5">
                Resonance is surgical, not inflationary. Only within-triad pairs that were already high-B get tipped into A.
                Cross-family relationships remain untouched. The bonus is +3 raw (~7 final) or +5 raw (~11 final) — enough to nudge, not distort.
              </p>
            </div>
          </section>

          {/* ── High Emotional Flow ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-pink-300 uppercase tracking-wider">High Emotional Flow</h3>
            <p className="text-[12px] text-white/70">
              <strong className="text-white">Emotional flow</strong> = how easily an archetype creates, sustains, and reciprocates emotional resonance.
              High-flow archetypes produce the most A-tier and Mutual A-tier scores across the matrix.
              The pattern is driven by <strong className="text-white">Air-Water blends</strong> (thought + feeling fused),
              <strong className="text-white">Fixed modality</strong> (stable emotional channel),
              and mythic functions that naturally produce empathy, depth, or relational magnetism.
            </p>
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="text-left border-b border-white/20">
                  <th className="py-1 px-2 text-white/50">Rank</th>
                  <th className="py-1 px-2 text-white/50">Archetype</th>
                  <th className="py-1 px-2 text-white/50">Flow Type</th>
                  <th className="py-1 px-2 text-white/50">Why</th>
                </tr>
              </thead>
              <tbody className="text-white/70">
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-pink-300 font-bold">🥇</td>
                  <td className="py-1 px-2 font-semibold text-white">Aquarius–Pisces</td>
                  <td className="py-1 px-2 text-pink-300">Empathic Super-Conductor</td>
                  <td className="py-1 px-2 text-white/60">Air–Water + Fixed + Visionary/Mystic. Absorbs and transmits emotion with no friction.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-pink-300 font-bold">🥈</td>
                  <td className="py-1 px-2 font-semibold text-white">Pure Scorpio</td>
                  <td className="py-1 px-2 text-pink-300">Depth-Engine</td>
                  <td className="py-1 px-2 text-white/60">Water + Fixed + Yin + Alchemist. Pulls emotion inward, creates profound resonance.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-pink-300 font-bold">🥉</td>
                  <td className="py-1 px-2 font-semibold text-white">Libra–Virgo</td>
                  <td className="py-1 px-2 text-pink-300">Harmonizer</td>
                  <td className="py-1 px-2 text-white/60">Air–Earth + Mutable + Analyst/Diplomat. Reads micro-signals, adjusts tone, creates equilibrium.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-pink-300/70">⭐</td>
                  <td className="py-1 px-2 text-white/90">Scorpio–Libra</td>
                  <td className="py-1 px-2 text-pink-300/70">Magnetic Connector</td>
                  <td className="py-1 px-2 text-white/60">Water–Air + Fixed + Alchemist/Diplomat. Draws people into honest depth magnetically.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-pink-300/70">⭐</td>
                  <td className="py-1 px-2 text-white/90">Aquarius–Capricorn</td>
                  <td className="py-1 px-2 text-pink-300/70">Cool-Flow Visionary</td>
                  <td className="py-1 px-2 text-white/60">Air–Earth + Fixed + Visionary/Strategist. Channels emotion through clarity, not gushing.</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 text-pink-300/70">⭐</td>
                  <td className="py-1 px-2 text-white/90">Gemini–Cancer</td>
                  <td className="py-1 px-2 text-pink-300/70">Emotional Communicator</td>
                  <td className="py-1 px-2 text-white/60">Air–Water + Mutable + Messenger/Nurturer. Feels, names, and shares emotion with ease.</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[11px] text-white/40">
              Contrast: Taurus–Aries (specialist, narrow band) and Pure Capricorn (architect of time, earned compatibility) have 0 A-tiers — not a flaw, but their nature.
            </p>
          </section>

          {/* ── High Psychological Openness ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-violet-300 uppercase tracking-wider">High Psychological Openness</h3>
            <p className="text-[12px] text-white/70">
              <strong className="text-white">Psychological openness</strong> = how easily an archetype receives new information, adapts perspectives,
              allows cognitive/emotional permeability, and accepts novelty and ambiguity.
              This is NOT the same as emotional flow — it is <strong className="text-white">cognitive + emotional permeability</strong>.
              High-openness archetypes tend to be <strong className="text-white">Air-Water blends</strong>,
              <strong className="text-white">Mutable or Fixed-Air</strong> modalities,
              and carry <strong className="text-white">Visionary, Mystic, Messenger, Diplomat, or Alchemist</strong> functions.
            </p>
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="text-left border-b border-white/20">
                  <th className="py-1 px-2 text-white/50">Rank</th>
                  <th className="py-1 px-2 text-white/50">Archetype</th>
                  <th className="py-1 px-2 text-white/50">Openness Type</th>
                  <th className="py-1 px-2 text-white/50">Why</th>
                </tr>
              </thead>
              <tbody className="text-white/70">
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-violet-300 font-bold">🥇</td>
                  <td className="py-1 px-2 font-semibold text-white">Aquarius–Pisces</td>
                  <td className="py-1 px-2 text-violet-300">Empathic-Visionary</td>
                  <td className="py-1 px-2 text-white/60">Air–Water + Fixed + Mystic/Visionary. Most permeable mind — dissolves boundaries, integrates new worldviews effortlessly.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-violet-300 font-bold">🥈</td>
                  <td className="py-1 px-2 font-semibold text-white">Gemini–Cancer</td>
                  <td className="py-1 px-2 text-violet-300">Expressive-Adaptive</td>
                  <td className="py-1 px-2 text-white/60">Air–Water + Mutable + Messenger/Nurturer. Curious, emotionally responsive, linguistically flexible. Shifts perspectives quickly.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-violet-300 font-bold">🥉</td>
                  <td className="py-1 px-2 font-semibold text-white">Libra–Virgo</td>
                  <td className="py-1 px-2 text-violet-300">Harmonizing-Analytic</td>
                  <td className="py-1 px-2 text-white/60">Air–Earth + Mutable + Analyst/Diplomat. Open through listening, adjusting, and refining — attunement-based permeability.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-violet-300/70">⭐</td>
                  <td className="py-1 px-2 text-white/90">Scorpio–Libra</td>
                  <td className="py-1 px-2 text-violet-300/70">Magnetic-Relational</td>
                  <td className="py-1 px-2 text-white/60">Water–Air + Fixed + Alchemist/Diplomat. Opens through magnetism — draws others in and absorbs emotional truth.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-violet-300/70">⭐</td>
                  <td className="py-1 px-2 text-white/90">Aquarius–Capricorn</td>
                  <td className="py-1 px-2 text-violet-300/70">Conceptual-Visionary</td>
                  <td className="py-1 px-2 text-white/60">Air–Earth + Fixed + Visionary/Strategist. Cognitively open, emotionally selective. Open to ideas, closed to chaos.</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 text-violet-300/70">⭐</td>
                  <td className="py-1 px-2 text-white/90">Sagittarius–Scorpio</td>
                  <td className="py-1 px-2 text-violet-300/70">Exploratory-Transformational</td>
                  <td className="py-1 px-2 text-white/60">Fire–Water + Mutable + Explorer/Alchemist. Permeable through philosophy and emotional intensity. Open to truth, depth, excavation.</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[11px] text-white/40">
              Note: Aquarius–Pisces ranks #1 in both emotional flow AND psychological openness — the only archetype to top both dimensions. This makes it the zodiac's most permeable, resonant archetype.
            </p>
          </section>

          {/* ── High Intuitive Resonance ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-teal-300 uppercase tracking-wider">High Intuitive Resonance</h3>
            <p className="text-[12px] text-white/70">
              <strong className="text-white">Intuitive resonance</strong> = how easily an archetype senses unspoken emotional states,
              reads subtle cues, perceives underlying motives, and connects through non-verbal channels.
              This is <strong className="text-white">deep, pre-verbal, pattern-level attunement</strong> — not emotional flow, not psychological openness.
              High-intuitive archetypes tend to be <strong className="text-white">Water or Water-Air blends</strong>,
              <strong className="text-white">Fixed or Mutable</strong> modalities,
              and carry <strong className="text-white">Mystic, Alchemist, Visionary, or Nurturer</strong> functions.
            </p>
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="text-left border-b border-white/20">
                  <th className="py-1 px-2 text-white/50">Rank</th>
                  <th className="py-1 px-2 text-white/50">Archetype</th>
                  <th className="py-1 px-2 text-white/50">Intuition Type</th>
                  <th className="py-1 px-2 text-white/50">Why</th>
                </tr>
              </thead>
              <tbody className="text-white/70">
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-teal-300 font-bold">🥇</td>
                  <td className="py-1 px-2 font-semibold text-white">Aquarius–Pisces</td>
                  <td className="py-1 px-2 text-teal-300">Oracle-Intuition</td>
                  <td className="py-1 px-2 text-white/60">Air–Water + Fixed + Mystic/Visionary. Reads energetic patterns, emotional undercurrents, and future trajectories.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-teal-300 font-bold">🥈</td>
                  <td className="py-1 px-2 font-semibold text-white">Pure Scorpio</td>
                  <td className="py-1 px-2 text-teal-300">Penetrating-Intuition</td>
                  <td className="py-1 px-2 text-white/60">Water + Fixed + Yin + Alchemist. Senses truth beneath behavior, motives beneath words, emotion beneath silence.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-teal-300 font-bold">🥉</td>
                  <td className="py-1 px-2 font-semibold text-white">Scorpio–Libra</td>
                  <td className="py-1 px-2 text-teal-300">Relational-Intuition</td>
                  <td className="py-1 px-2 text-white/60">Water–Air + Fixed + Alchemist/Diplomat. Reads relational dynamics, power flows, and emotional micro-shifts.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-teal-300/70">⭐</td>
                  <td className="py-1 px-2 text-white/90">Gemini–Cancer</td>
                  <td className="py-1 px-2 text-teal-300/70">Emotional-Linguistic</td>
                  <td className="py-1 px-2 text-white/60">Air–Water + Mutable + Messenger/Nurturer. Senses tone, subtext, emotional nuance, and unspoken needs.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-teal-300/70">⭐</td>
                  <td className="py-1 px-2 text-white/90">Pisces–Aquarius</td>
                  <td className="py-1 px-2 text-teal-300/70">Symbolic-Mystic</td>
                  <td className="py-1 px-2 text-white/60">Water–Air + Mutable + Mystic/Visionary. Perceives synchronicity, symbolic meaning, and archetypal patterns.</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 text-teal-300/70">⭐</td>
                  <td className="py-1 px-2 text-white/90">Sagittarius–Scorpio</td>
                  <td className="py-1 px-2 text-teal-300/70">Exploratory-Intuition</td>
                  <td className="py-1 px-2 text-white/60">Fire–Water + Mutable + Explorer/Alchemist. Senses truth, danger, opportunity, and psychological openings through instinct.</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[11px] text-white/40">
              Aquarius–Pisces ranks #1 in all three dimensions: emotional flow, psychological openness, AND intuitive resonance.
              Pure Scorpio ranks #2 in both emotional flow and intuitive resonance — the depth-engine that perceives what others hide.
            </p>
          </section>

          {/* ── Emotional Bonding & Attachment ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-rose-300 uppercase tracking-wider">Emotional Bonding & Attachment Resonance</h3>
            <p className="text-[12px] text-white/70">
              A distinct dimension from emotional flow, openness, or intuition.
              <strong className="text-white">Attachment resonance</strong> = how deeply an archetype bonds, how loyally it holds,
              and how enduringly it maintains emotional connection over time.
              This is <strong className="text-white">relational stickiness</strong> — not permeability, not pattern-reading, but the ability to
              <strong className="text-rose-300">form bonds so deep they become permanent</strong>.
            </p>
            <p className="text-[12px] text-white/60">
              Where other signs <em>flow</em>, <em>intuit</em>, or <em>open</em> — these archetypes <strong className="text-white">bind</strong>.
              Cancer is the attachment architect: not the widest connector, not the fastest resonator,
              but the one whose bonds become part of the other person's identity.
            </p>
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-[12px] text-white/70 space-y-1">
              <div className="font-bold text-rose-300 text-xs mb-1">Why Cancer dominates this dimension</div>
              <div>• <strong className="text-white">Cardinal Water</strong> — doesn't just feel, <em>initiates</em> emotional connection</div>
              <div>• <strong className="text-white">Nurturer function</strong> — the only mythic role built for caring, protecting, soothing</div>
              <div>• <strong className="text-white">Moon-ruled</strong> — emotional memory, tidal sensitivity, protective instinct</div>
              <div>• <strong className="text-white">Yin polarity</strong> — internal depth, receptive bonding, relational gravity</div>
              <div className="pt-1 text-white/40 border-t border-rose-500/10">
                Cancer's intuition is <em>protective</em>, not perceptive — it senses danger, belonging, and emotional shifts within its circle.
                Where Scorpio reads, Pisces absorbs, and Aquarius-Pisces translates — Cancer <em>holds</em>.
              </div>
            </div>
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="text-left border-b border-white/20">
                  <th className="py-1 px-2 text-white/50">Rank</th>
                  <th className="py-1 px-2 text-white/50">Archetype</th>
                  <th className="py-1 px-2 text-white/50">Bonding Type</th>
                  <th className="py-1 px-2 text-white/50">Why</th>
                </tr>
              </thead>
              <tbody className="text-white/70">
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-rose-300 font-bold">🥇</td>
                  <td className="py-1 px-2 font-semibold text-white">Cancer–Gemini Wings</td>
                  <td className="py-1 px-2 text-rose-300">Expressive-Secure</td>
                  <td className="py-1 px-2 text-white/60">Water–Air + Mutable + Nurturer/Messenger. Bonds through care + communication. Secure, responsive, emotionally articulate.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-rose-300 font-bold">🥈</td>
                  <td className="py-1 px-2 font-semibold text-white">Cancer–Leo Warmth</td>
                  <td className="py-1 px-2 text-rose-300">Protective-Devotional</td>
                  <td className="py-1 px-2 text-white/60">Water–Fire + Fixed + Nurturer/Sovereign. Creates a circle of safety. Fiercely loyal, emotionally generous.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-rose-300 font-bold">🥉</td>
                  <td className="py-1 px-2 font-semibold text-white">Pure Cancer</td>
                  <td className="py-1 px-2 text-rose-300">Attachment Architect</td>
                  <td className="py-1 px-2 text-white/60">Cardinal Water + Yin + Nurturer + Moon. The deepest, most enduring bonds. The emotional anchor, the safe harbor.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-rose-300/70">⭐</td>
                  <td className="py-1 px-2 text-white/90">Scorpio–Libra</td>
                  <td className="py-1 px-2 text-rose-300/70">Magnetic-Relational</td>
                  <td className="py-1 px-2 text-white/60">Water–Air + Fixed + Alchemist/Diplomat. Intense + relational bonding. Deep, magnetic, emotionally charged.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-rose-300/70">⭐</td>
                  <td className="py-1 px-2 text-white/90">Pisces–Aquarius</td>
                  <td className="py-1 px-2 text-rose-300/70">Soul-Level</td>
                  <td className="py-1 px-2 text-white/60">Water–Air + Mutable + Mystic/Visionary. Bonds through empathy + spiritual resonance. Feels fated, cosmic.</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 text-rose-300/70">⭐</td>
                  <td className="py-1 px-2 text-white/90">Scorpio–Sagittarius</td>
                  <td className="py-1 px-2 text-rose-300/70">Transformational</td>
                  <td className="py-1 px-2 text-white/60">Water–Fire + Mutable + Alchemist/Explorer. Bonds through shared truth, depth, and growth. Intense and meaningful.</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[11px] text-white/40">
              Cancer's entire triad dominates the top 3 — its cusps inherit the bonding power and add communication (Gemini) or devotion (Leo).
              Cancer is #1 in attachment but NOT in the other three dimensions. Its gift is depth of bond, not breadth of connection.
            </p>
          </section>

          {/* ── Relational Stability & Long-Term Security ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-amber-200 uppercase tracking-wider">Relational Stability & Long-Term Security</h3>
            <p className="text-[12px] text-white/70">
              <strong className="text-white">Relational stability</strong> = how reliably, consistently, and enduringly an archetype sustains a relationship over time.
              This is <strong className="text-white">not bonding, not flow, not intuition</strong> — it is
              <strong className="text-amber-200">structural durability</strong>: consistency, predictability, loyalty, low volatility, and long-term commitment.
              Where Cancer bonds through <em>care</em>, Taurus bonds through <em>consistency</em>.
              Where Cancer is the heart, Taurus is the spine.
            </p>
            <div className="bg-amber-500/10 border border-amber-500/15 rounded-lg p-3 text-[12px] text-white/70 space-y-1">
              <div className="font-bold text-amber-200 text-xs mb-1">Why Taurus dominates this dimension</div>
              <div>• <strong className="text-white">Fixed Earth</strong> — the most stable element-modality combination possible</div>
              <div>• <strong className="text-white">Venus-ruled</strong> — slow, embodied Venus: sensual, patient, comfort-oriented love</div>
              <div>• <strong className="text-white">Builder function</strong> — maintenance, reliability, long-term commitment</div>
              <div>• <strong className="text-white">Relational maintenance</strong> — shows up every day, doesn't change suddenly, doesn't break trust</div>
              <div className="pt-1 text-white/40 border-t border-amber-500/10">
                Cancer creates safety through care. Taurus creates safety through consistency.
                Taurus is the marathon runner of relationships — the foundation-builder of the zodiac.
              </div>
            </div>
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="text-left border-b border-white/20">
                  <th className="py-1 px-2 text-white/50">Rank</th>
                  <th className="py-1 px-2 text-white/50">Archetype</th>
                  <th className="py-1 px-2 text-white/50">Stability Type</th>
                  <th className="py-1 px-2 text-white/50">Why</th>
                </tr>
              </thead>
              <tbody className="text-white/70">
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-amber-200 font-bold">🥇</td>
                  <td className="py-1 px-2 font-semibold text-white">Taurus–Gemini</td>
                  <td className="py-1 px-2 text-amber-200">Communicative Stability</td>
                  <td className="py-1 px-2 text-white/60">Earth–Air + Builder/Messenger. Stable core + communication that prevents rupture. The most stable communicator.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-amber-200 font-bold">🥈</td>
                  <td className="py-1 px-2 font-semibold text-white">Taurus–Aries</td>
                  <td className="py-1 px-2 text-amber-200">Protective Stability</td>
                  <td className="py-1 px-2 text-white/60">Earth–Fire + Builder/Warrior. Loyalty + consistency + protective devotion. The specialist stabilizer.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-amber-200 font-bold">🥉</td>
                  <td className="py-1 px-2 font-semibold text-white">Pure Taurus</td>
                  <td className="py-1 px-2 text-amber-200">Foundational Stability</td>
                  <td className="py-1 px-2 text-white/60">Fixed Earth + Yin + Builder + Venus. Most stable, least volatile. The foundation-builder of the zodiac.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-amber-200/70">⭐</td>
                  <td className="py-1 px-2 text-white/90">Capricorn–Aquarius</td>
                  <td className="py-1 px-2 text-amber-200/70">Structural Stability</td>
                  <td className="py-1 px-2 text-white/60">Earth–Air + Strategist/Visionary. Sustains through structure, planning, principled consistency.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 px-2 text-amber-200/70">⭐</td>
                  <td className="py-1 px-2 text-white/90">Virgo–Leo</td>
                  <td className="py-1 px-2 text-amber-200/70">Loyal Stability</td>
                  <td className="py-1 px-2 text-white/60">Earth–Fire + Analyst/Sovereign. Sustains through loyalty, service, and consistent emotional presence.</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 text-amber-200/70">⭐</td>
                  <td className="py-1 px-2 text-white/90">Capricorn–Sagittarius</td>
                  <td className="py-1 px-2 text-amber-200/70">Enduring Stability</td>
                  <td className="py-1 px-2 text-white/60">Earth–Fire + Strategist/Explorer. Sustains through shared goals, discipline, and long-term vision.</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[11px] text-white/40">
              Taurus's entire triad dominates the top 3 — its cusps inherit the stability and add communication (Gemini) or protective loyalty (Aries).
              Taurus is #1 in stability but NOT in emotional flow, openness, or intuitive resonance. Its gift is endurance, not permeability.
            </p>
          </section>

          {/* ── Full Theory Page Link (extracted to /zodiac-anatomy) ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">Zodiac Anatomy — The Metaphysical Body</h3>
            <p className="text-[12px] text-white/70">
              The complete Zodiac Body Atlas — 12 organ families, 36 sub-organs, chakra + meridian maps,
              all 1,296 narrative panels, and the 36-row Cosmogram — now lives on its own page so it can
              feed the Health Module.
            </p>
            <a
              href="/zodiac-anatomy"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[12px] font-semibold hover:bg-emerald-500/25 transition-colors"
            >
              View Full Theory Page →
            </a>
          </section>

          {/* ── Tuning ── */}
          <section className="space-y-2 pb-4">
            <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider">Tuning</h3>
            <p className="text-[12px] text-white/70">
              All constants live at the top of <code className="text-sky-300/80">zodiacCompatibilityEngine.ts</code>:
              layer weights, Wu Xin cycle coefficients, modality table, aspect anchors, dampener thresholds, polarity modifiers, and resonance constants.
              Adjusting any constant regenerates all 1,296 scores deterministically.
              The engine is designed to be <strong className="text-white">auditable</strong> — hover any cell in v1 view to trace its score through all five layers + resonance.
            </p>
          </section>
        </div>
      )}

      {/* Constellation View */}
      {matrixMode !== 'theory' && constellationIdx != null && (() => {
        // Determine if dual mode (both profiles/cusps selected)
        const idxA_ = labMode ? labA : (profileA ? dateToCuspIndex(profileA.birthDate) : -1);
        const idxB_ = labMode ? labB : (profileB ? dateToCuspIndex(profileB.birthDate) : -1);
        const isDual = idxA_ >= 0 && idxB_ >= 0 && idxA_ !== idxB_;
        const spiralNames = isDual
          ? [labMode ? cuspsData.positions[idxA_]?.name : (profileA?.displayName || profileA?.firstName),
             labMode ? cuspsData.positions[idxB_]?.name : (profileB?.displayName || profileB?.firstName)]
          : [null];
        const spiralColors = ['#fbbf24', '#a78bfa']; // gold for A, purple for B

        // Build spiral data for one center index; targetIdx = other person's index (dual mode)
        function buildSpiral(cIdx, svgW, svgH, targetIdx) {
          const centerCusp = cuspsData.positions[cIdx];
          const row = activeMatrix[cIdx];
          const allScored = row.map((score, idx) => ({ idx, score, rev: activeMatrix[idx][cIdx] }))
            .filter(d => d.idx !== cIdx)
            .sort((a, b) => b.score - a.score);
          // In dual mode: end at the other person's position (inclusive), min 3
          let scored;
          if (isDual && targetIdx >= 0) {
            const targetRank = allScored.findIndex(d => d.idx === targetIdx);
            const endAt = targetRank >= 0 ? Math.max(targetRank + 1, 3) : 25;
            scored = allScored.slice(0, endAt);
          } else {
            scored = allScored.slice(0, 25);
          }
          const cx = svgW / 2, cy = svgH / 2;
          const maxOrbit = Math.min(svgW, svgH) * 0.42;
          const minOrbit = isDual ? 50 : 70;
          const maxScore = scored[0]?.score || 97;
          const minScore = scored[scored.length - 1]?.score || 48;
          const scoreRange = Math.max(maxScore - minScore, 1);
          const SPIRAL_TURNS = 2.5;
          const n = scored.length;
          const nodes = scored.map((d, i) => {
            const rankFrac = n > 1 ? i / (n - 1) : 0;
            const angle = rankFrac * SPIRAL_TURNS * 2 * Math.PI - Math.PI / 2;
            const orbit = minOrbit + Math.sqrt(rankFrac) * (maxOrbit - minOrbit) * 0.85;
            const norm = (d.score - minScore) / scoreRange;
            const r = (isDual ? 10 : 14) + norm * norm * (isDual ? 16 : 22);
            const cusp = cuspsData.positions[d.idx];
            const t = getTier(d.score);
            return { ...d, x: cx + orbit * Math.cos(angle), y: cy + orbit * Math.sin(angle), r, cusp, tier: t };
          });
          const centerR = isDual ? 30 : 40;
          return { centerCusp, scored, nodes, cx, cy, centerR, maxScore, minScore, scoreRange };
        }

        // Render one spiral SVG
        function renderSpiralSVG(cIdx, svgW, svgH, accentColor, personName, spiralKey, targetIdx) {
          const { centerCusp, nodes, cx, cy, centerR, minScore, scoreRange } = buildSpiral(cIdx, svgW, svgH, targetIdx);
          return (
            <svg key={spiralKey} width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="max-w-full max-h-full">
              <rect x={0} y={0} width={svgW} height={svgH} fill="transparent" />
              <circle cx={cx} cy={cy} r={isDual ? 50 : 70} fill="none" stroke="#1e293b" strokeWidth={0.5} strokeDasharray="4 4" />

              {/* Spiral path */}
              {nodes.length > 1 && (
                <path
                  d={`M ${cx} ${cy} ` + nodes.map(n => `L ${n.x} ${n.y}`).join(' ')}
                  fill="none" stroke="rgba(251,191,36,0.45)" strokeWidth={1.5} strokeDasharray="6 3" />
              )}

              {/* Radial lines */}
              {nodes.map((node, i) => (
                <line key={`e-${i}`} x1={cx} y1={cy} x2={node.x} y2={node.y}
                  stroke={node.tier.color} strokeWidth={0.8}
                  opacity={0.08 + (node.score - minScore) / scoreRange * 0.12} />
              ))}

              {/* Person name label */}
              {personName && (
                <text x={cx} y={20} textAnchor="middle" fill={accentColor} fontSize="13" fontWeight="700">{personName}</text>
              )}

              {/* Center node */}
              <g className="cursor-pointer"
                onClick={() => { setConstellationCard(constellationCard === cIdx ? null : cIdx); setCardPos({ x: -1, y: -1 }); }}
                onMouseEnter={() => setHoveredNode({ idx: cIdx, x: cx + (isDual ? (spiralKey === 'A' ? 0 : svgW) : 0), y: cy, score: null })}
                onMouseLeave={() => setHoveredNode(null)}>
                {constellationCard === cIdx && (
                  <circle cx={cx} cy={cy} r={centerR + 6} fill="none" stroke="#fff" strokeWidth={2} opacity={0.7} />
                )}
                <circle cx={cx} cy={cy} r={centerR} fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth={2}>
                  <animate attributeName="r" values={`${centerR};${centerR + 2};${centerR}`} dur="3s" repeatCount="indefinite" />
                </circle>
                <text x={cx} y={cy - 6} textAnchor="middle" fill="#fbbf24" fontSize={isDual ? '10' : '12'} fontWeight="700">
                  {MATRIX_LABELS[cIdx]}
                </text>
                <text x={cx} y={cy + 10} textAnchor="middle" fill="#fbbf24" fontSize={isDual ? '14' : '16'}>
                  {centerCusp.emoji?.slice(0, 2) || '⭐'}
                </text>
                <text x={cx} y={cy + centerR + 14} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="9">
                  {centerCusp.archetype}
                </text>
              </g>

              {/* Satellite nodes */}
              {nodes.map((node, i) => {
                const isSelected = constellationCard === node.idx;
                const isTarget = isDual && node.idx === targetIdx;
                const otherColor = spiralKey === 'A' ? spiralColors[1] : spiralColors[0];
                return (
                  <g key={`n-${i}`} className="cursor-pointer"
                    onClick={() => { setConstellationCard(isSelected ? null : node.idx); setCardPos({ x: -1, y: -1 }); }}
                    onMouseEnter={() => setHoveredNode({ idx: node.idx, x: node.x + (isDual ? (spiralKey === 'A' ? 0 : svgW) : 0), y: node.y, score: node.score })}
                    onMouseLeave={() => setHoveredNode(null)}>
                    {/* Double gold pulsating rings for the other person's archetype */}
                    {isTarget && (
                      <>
                        <circle cx={node.x} cy={node.y} r={node.r + 6} fill="none" stroke="#fbbf24" strokeWidth={2} opacity={0.8}>
                          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={node.x} cy={node.y} r={node.r + 11} fill="none" stroke="#fbbf24" strokeWidth={1.5} opacity={0.5}>
                          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                        </circle>
                      </>
                    )}
                    {node.score >= 90 && !isTarget && (
                      <circle cx={node.x} cy={node.y} r={node.r + 4} fill="none" stroke="#fbbf24" strokeWidth={1.5} opacity={0.3}>
                        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    {isSelected && (
                      <circle cx={node.x} cy={node.y} r={node.r + 6} fill="none" stroke="#fff" strokeWidth={2} opacity={0.7} />
                    )}
                    <circle cx={node.x} cy={node.y} r={node.r}
                      fill={node.tier.bg} stroke={node.tier.color} strokeWidth={1.5}
                      opacity={0.9} />
                    <text x={node.x} y={node.y - 3} textAnchor="middle" fill={node.tier.color} fontSize={node.r > 28 ? '12' : node.r > 20 ? '10' : '9'} fontWeight="700">
                      {node.score}
                    </text>
                    <text x={node.x} y={node.y + 8} textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize={node.r > 28 ? '8' : node.r > 20 ? '7' : '6'} fontWeight="600">
                      {node.r > 28 ? MATRIX_LABELS[node.idx] : MATRIX_SHORT_LABELS[node.idx]}
                    </text>
                    <circle cx={node.x + node.r * 0.7} cy={node.y - node.r * 0.7} r={isDual ? 6 : 7} fill="#1e293b" stroke={node.tier.color} strokeWidth={0.8} />
                    <text x={node.x + node.r * 0.7} y={node.y - node.r * 0.7 + 3} textAnchor="middle" fill={node.tier.color} fontSize={isDual ? '6' : '7'} fontWeight="700">
                      {i + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          );
        }

        const singleW = 900, singleH = 700;
        const dualW = 500, dualH = 720;

        return (
          <div className="flex-1 overflow-auto flex flex-col items-center justify-center bg-slate-900/50 relative">
            {/* Title */}
            <div className="absolute top-3 left-0 right-0 text-center z-10">
              {isDual ? (
                <>
                  <span className="text-amber-300 text-sm font-semibold">{spiralNames[0]}</span>
                  <span className="text-white/40 text-xs mx-2">vs</span>
                  <span className="text-purple-300 text-sm font-semibold">{spiralNames[1]}</span>
                  <span className="text-white/40 text-xs ml-2">— Top 25 Compatibility Constellation</span>
                </>
              ) : (
                <>
                  <span className="text-white/80 text-sm font-semibold">{MATRIX_LABELS[constellationIdx]}</span>
                  <span className="text-white/40 text-xs ml-2">— Top 25 Compatibility Constellation</span>
                  <span className="text-white/30 text-[10px] ml-2">(click a circle to view card)</span>
                </>
              )}
            </div>

            {/* Spiral(s) */}
            {isDual ? (
              <div className="flex items-center justify-center gap-0 mt-6">
                {renderSpiralSVG(idxA_, dualW, dualH, spiralColors[0], spiralNames[0], 'A', idxB_)}
                <div className="w-px h-[500px] bg-white/10 shrink-0" />
                {renderSpiralSVG(idxB_, dualW, dualH, spiralColors[1], spiralNames[1], 'B', idxA_)}
              </div>
            ) : (
              renderSpiralSVG(constellationIdx, singleW, singleH, spiralColors[0], null, 'A')
            )}

            {/* Instant hover tooltip */}
            {hoveredNode && (() => {
              const hCusp = cuspsData.positions[hoveredNode.idx];
              const hTier = hoveredNode.score != null ? getTier(hoveredNode.score) : null;
              return (
                <div className="absolute pointer-events-none z-30 bg-slate-900/95 border border-white/20 rounded-lg px-3 py-2 shadow-xl text-[11px] max-w-[240px]"
                  style={{ left: hoveredNode.x + 30, top: hoveredNode.y - 20 }}>
                  <div className="text-white font-semibold">{hCusp.emoji} {hCusp.name}</div>
                  <div className="text-white/80 text-[10px] italic">{hCusp.archetype}</div>
                  <div className="text-white/70 text-[10px] font-mono mt-0.5">{hCusp.dateRange.start.replace('-','/')} – {hCusp.dateRange.end.replace('-','/')}</div>
                  {hTier && (
                    <div className="mt-1">
                      <span className="font-bold" style={{ color: hTier.color }}>{hoveredNode.score}</span>
                      <span className="ml-1.5 font-bold px-1 py-0.5 rounded text-[9px]" style={{ color: hTier.color, backgroundColor: hTier.bg }}>{hTier.tier}</span>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Floating card for selected circle */}
            {constellationCard != null && (() => {
              // Determine which spiral's center this card is relative to
              const cardCenter = isDual
                ? (constellationCard === idxA_ ? idxA_ : constellationCard === idxB_ ? idxB_ : constellationIdx)
                : constellationIdx;
              const isSelf = constellationCard === cardCenter;
              const cusp = cuspsData.positions[constellationCard];
              const score = isSelf ? null : activeMatrix[cardCenter][constellationCard];
              const rev = isSelf ? null : activeMatrix[constellationCard][cardCenter];
              const t = isSelf ? null : getTier(score);
              const bd = isSelf ? null : getLayerBreakdown(cardCenter, constellationCard);
              const interp = bd ? interpretPair(cardCenter, constellationCard) : null;
              const elColor = { Fire: '#ef4444', Earth: '#f59e0b', Air: '#3b82f6', Water: '#a855f7' };

              return (
                <div data-card-panel className="fixed w-[300px] max-h-[70vh] bg-slate-800/95 border border-white/15 rounded-xl shadow-2xl overflow-y-auto z-[10000]"
                  style={cardPos.x >= 0 ? { left: cardPos.x, top: cardPos.y } : { right: 40, top: 120 }}>
                  <div className="sticky top-0 bg-slate-700/80 border-b border-white/10 px-4 py-2.5 flex items-center justify-between cursor-move select-none"
                    onMouseDown={onCardMouseDown}>
                    <span className="text-white font-semibold text-sm">{cusp.emoji} {cusp.name}</span>
                    <button onClick={() => setConstellationCard(null)} className="text-white/30 hover:text-red-400 text-xs px-1">✕</button>
                  </div>
                  <div className="px-4 py-3 space-y-3 text-[11px]">
                    {/* Archetype + mythic function */}
                    <div className="text-white/70 text-xs italic">{cusp.archetype}</div>
                    {ARCHETYPE_PROFILES[CUSP_ID_TO_INDEX[cusp.id]] && (
                      <div className="text-amber-400/80 text-[10px] font-medium">Archetype: {ARCHETYPE_PROFILES[CUSP_ID_TO_INDEX[cusp.id]].mythicFunction}</div>
                    )}

                    {/* Score (only for non-self) */}
                    {!isSelf && t && (
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="text-white/70">Score: </span>
                          <span className="font-bold text-lg" style={{ color: t.color }}>{score}</span>
                          <span className="ml-1.5 font-bold px-1.5 py-0.5 rounded text-[10px]" style={{ color: t.color, backgroundColor: t.bg }}>{t.tier}</span>
                        </div>
                        <div className="text-white/60">
                          Rev: <span style={{ color: getTier(rev).color }}>{rev}</span>
                        </div>
                      </div>
                    )}

                    {/* Quick info */}
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <div><span className="text-white/60">Sign:</span> <span className="text-white">{cusp.sign}</span></div>
                      <div><span className="text-white/60">Element:</span> <span style={{ color: elColor[cusp.element.primary] || '#fff' }}>{cusp.element.mix || cusp.element.primary}</span></div>
                      <div><span className="text-white/60">Rulers:</span> <span className="text-white">{cusp.rulers.join(', ')}</span></div>
                      <div><span className="text-white/60">Dates:</span> <span className="text-white">{cusp.dateRange.start.replace('-','/')} – {cusp.dateRange.end.replace('-','/')}</span></div>
                    </div>

                    {/* Layer breakdown */}
                    {bd && (
                      <div className="border-t border-white/15 pt-2 space-y-0.5">
                        <div className="text-white/40 text-[9px] mb-0.5">{MATRIX_LABELS[cardCenter]} → {MATRIX_LABELS[constellationCard]}</div>
                        <div className="text-white/60 font-semibold text-[10px] mb-1">Layer Breakdown</div>
                        <div className="text-white/80">P Psych: <span className="text-pink-300 font-mono">{bd.psych}</span></div>
                        <div className="text-white/80">E Elemental: <span className="text-emerald-300 font-mono">{bd.elemental}</span></div>
                        <div className="text-white/80">Q Seasonal: <span className="text-amber-300 font-mono">{bd.seasonalQi}</span></div>
                        <div className="text-white/80">A Aspect: <span className="text-cyan-300 font-mono">{bd.aspect}</span></div>
                        <div className="text-white/80">M Modality: <span className="text-purple-300 font-mono">{bd.modality}</span></div>
                        {bd.dampener < 1 && <div className="text-white/80">Dampener: <span className="text-red-300 font-mono">×{bd.dampener}</span></div>}
                        {bd.resonance > 0 && <div className="text-white/80">Resonance: <span className="text-amber-300 font-mono">+{bd.resonance}</span></div>}
                      </div>
                    )}

                    {/* Strengths + Tensions */}
                    {interp && (
                      <div className="border-t border-white/15 pt-2 space-y-1">
                        {interp.strengths.slice(0, 2).map((s, i) => (
                          <div key={`s${i}`} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 shrink-0 font-bold">+</span>
                            <span className="text-white/80">{s}</span>
                          </div>
                        ))}
                        {interp.tensions.slice(0, 2).map((t, i) => (
                          <div key={`t${i}`} className="flex items-start gap-1.5">
                            <span className="text-amber-400 shrink-0">~</span>
                            <span className="text-white/80">{t}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Characteristics */}
                    <div className="border-t border-white/15 pt-2">
                      <div className="text-white/70 font-semibold text-[10px] mb-1">Characteristics</div>
                      {cusp.characteristics.slice(0, 4).map((c, i) => (
                        <div key={i} className="text-white/80 text-[10px] py-0.5">• {c}</div>
                      ))}
                    </div>

                    {/* Strengths */}
                    <div className="border-t border-white/15 pt-2">
                      <div className="text-emerald-400 font-semibold text-[10px] mb-1">Strengths</div>
                      {cusp.strengths.slice(0, 4).map((s, i) => (
                        <div key={i} className="text-white/80 text-[10px] py-0.5">✓ {s}</div>
                      ))}
                    </div>

                    {/* Challenges */}
                    <div className="border-t border-white/15 pt-2">
                      <div className="text-red-400 font-semibold text-[10px] mb-1">Challenges</div>
                      {cusp.challenges.slice(0, 3).map((c, i) => (
                        <div key={i} className="text-white/80 text-[10px] py-0.5">! {c}</div>
                      ))}
                    </div>

                    {/* Deep Profile button */}
                    {onDetailCusp && (
                      <button
                        onClick={() => onDetailCusp(cusp)}
                        className="w-full py-2 px-4 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/25 rounded-lg text-indigo-300 text-sm transition-colors flex items-center justify-center gap-2 mt-1"
                      >
                        <span>🔮</span>
                        <span>More — Deep Profile</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        );
      })()}

      {/* Matrix */}
      {matrixMode !== 'theory' && constellationIdx == null && <div className="flex-1 overflow-auto">
        <table className="border-collapse" style={{ fontSize: '9px' }}>
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-30 bg-slate-900 border border-white/5 px-1 py-1 min-w-[90px]" />
              {MATRIX_LABELS.map((label, c) => (
                <th key={c} className="sticky top-0 z-20 bg-slate-800 border border-white/5 text-white/70 font-mono whitespace-nowrap cursor-pointer hover:bg-amber-500/15 hover:text-amber-300 transition-colors"
                  style={{ height: 110, minWidth: 24, fontSize: '9px', padding: 0, verticalAlign: 'bottom' }}
                  title={`Click to view ${label} constellation`}
                  onClick={() => { setConstellationIdx(c); setConstellationCard(null); }}>
                  <div style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%', padding: '2px 1px' }}>
                    {label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="sticky left-0 z-10 bg-slate-900 border border-white/5 px-1.5 py-0.5" style={{ fontSize: '9px', minWidth: 90 }} />
              {MATRIX_LABELS.map((_, c) => (
                <td key={c} className="border border-white/5 text-center font-mono text-amber-400/60"
                  style={{ fontSize: '9px', minWidth: 24, padding: '2px 1px' }}>
                  {c + 1}
                </td>
              ))}
              <td className="border border-white/5 text-center font-mono text-amber-400/80 font-semibold"
                style={{ fontSize: '8px', minWidth: 24, padding: '2px 1px' }}>A</td>
            </tr>
            {activeMatrix.map((row, r) => (
              <tr key={r}>
                <td className="sticky left-0 z-10 bg-slate-800 border border-white/5 px-1.5 py-0.5 text-white/80 font-mono whitespace-nowrap font-semibold cursor-pointer hover:bg-amber-500/15 hover:text-amber-300 transition-colors"
                  style={{ fontSize: '9px', minWidth: 90 }}
                  title={`Click to view ${MATRIX_LABELS[r]} constellation`}
                  onClick={() => { setConstellationIdx(r); setConstellationCard(null); }}>
                  {MATRIX_LABELS[r]} <span className="text-amber-400/60 float-right ml-1">{r + 1}</span>
                </td>
                {row.map((val, c) => {
                  const isDiag = r === c;
                  const t = getTier(val);
                  const isMutualA = r !== c && val >= 90 && activeMatrix[c]?.[r] >= 90;
                  return (
                    <td
                      key={c}
                      className={`text-center font-mono cursor-crosshair ${isDiag ? 'ring-1 ring-white/30' : ''}`}
                      style={{
                        backgroundColor: t.bg,
                        color: t.color,
                        minWidth: 24,
                        padding: '2px 1px',
                        fontWeight: t.font,
                        fontSize: '9px',
                        border: isMutualA ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.05)',
                      }}
                      onMouseEnter={() => setHoveredCell({ r, c, v: val })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {val}
                    </td>
                  );
                })}
                {/* Row A-tier count */}
                {(() => {
                  const count = row.filter(v => v >= 90).length;
                  return (
                    <td className="border border-white/5 text-center font-mono font-bold"
                      style={{ fontSize: '9px', minWidth: 24, padding: '2px 1px', backgroundColor: 'rgba(251,191,36,0.15)', color: count > 0 ? '#fbbf24' : '#6b7280' }}>
                      {count}
                    </td>
                  );
                })()}
              </tr>
            ))}
            {/* Column A-tier count row */}
            {(
              <tr>
                <td className="sticky left-0 z-10 bg-slate-900 border border-white/5 px-1.5 py-0.5 text-amber-400/80 font-mono font-semibold text-right"
                  style={{ fontSize: '8px', minWidth: 90 }}>
                  A-tier ↓
                </td>
                {MATRIX_LABELS.map((_, c) => {
                  const count = activeMatrix.reduce((sum, row) => sum + (row[c] >= 90 ? 1 : 0), 0);
                  return (
                    <td key={c} className="border border-white/5 text-center font-mono font-bold"
                      style={{ fontSize: '9px', minWidth: 24, padding: '2px 1px', backgroundColor: 'rgba(251,191,36,0.15)', color: count > 0 ? '#fbbf24' : '#6b7280' }}>
                      {count}
                    </td>
                  );
                })}
                <td className="border border-white/5 text-center font-mono font-bold"
                  style={{ fontSize: '9px', minWidth: 24, padding: '2px 1px', backgroundColor: 'rgba(251,191,36,0.25)', color: '#fbbf24' }}>
                  {activeMatrix.reduce((sum, row) => sum + row.filter(v => v >= 90).length, 0)}
                </td>
              </tr>
            )}
            {/* Mutual A-tier row — both directions 90+ */}
            {(
              <tr>
                <td className="sticky left-0 z-10 bg-slate-900 border border-white/5 px-1.5 py-0.5 text-emerald-400/80 font-mono font-semibold text-right"
                  style={{ fontSize: '8px', minWidth: 90 }}>
                  Mutual A ↕
                </td>
                {MATRIX_LABELS.map((_, c) => {
                  const count = activeMatrix.reduce((sum, row, r) => {
                    if (r === c) return sum;
                    return sum + (row[c] >= 90 && activeMatrix[c][r] >= 90 ? 1 : 0);
                  }, 0);
                  return (
                    <td key={c} className="border border-white/5 text-center font-mono font-bold"
                      style={{ fontSize: '9px', minWidth: 24, padding: '2px 1px', backgroundColor: 'rgba(52,211,153,0.15)', color: count > 0 ? '#34d399' : '#6b7280' }}>
                      {count}
                    </td>
                  );
                })}
                <td className="border border-white/5 text-center font-mono font-bold"
                  style={{ fontSize: '9px', minWidth: 24, padding: '2px 1px', backgroundColor: 'rgba(52,211,153,0.25)', color: '#34d399' }}>
                  {(() => {
                    let total = 0;
                    for (let r = 0; r < activeMatrix.length; r++)
                      for (let c = r + 1; c < activeMatrix.length; c++)
                        if (activeMatrix[r][c] >= 90 && activeMatrix[c][r] >= 90) total++;
                    return total;
                  })()}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>}

      {/* Legend */}
      {matrixMode !== 'theory' && constellationIdx == null && <div className="shrink-0 flex items-center gap-4 px-4 py-1.5 bg-slate-800 border-t border-white/10 text-[10px] text-white/60">
          {[
              { label: 'A Tier (90+)', color: '#fbbf24', bg: 'rgba(251,191,36,0.35)' },
              { label: 'B Tier (80-89)', color: '#a78bfa', bg: 'rgba(167,139,250,0.25)' },
              { label: 'C Tier (70-79)', color: '#22d3ee', bg: 'rgba(34,211,238,0.18)' },
              { label: 'D (60-69)', color: '#86efac', bg: 'rgba(134,239,172,0.10)' },
              { label: 'E (50-59)', color: '#9ca3af', bg: 'rgba(156,163,175,0.08)' },
              { label: 'F (<50)', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
            ].map(l => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded" style={{ backgroundColor: l.bg, border: `1px solid ${l.color}40` }} />
                <span style={{ color: l.color, fontWeight: l.label.startsWith('A') || l.label.startsWith('B') || l.label.startsWith('C') ? 700 : 400 }}>{l.label}</span>
              </span>
            ))}
        <span className="ml-auto text-white/40">Hover any cell for directional details</span>
      </div>}

      {/* ── 3D Relationship Health Space ── */}
      {show3D && (
        <div className="shrink-0">
          <Suspense fallback={<div className="text-white/30 text-center py-8 text-sm">Loading 3D view...</div>}>
            <RelationshipHealthSpace />
          </Suspense>
        </div>
      )}

      {/* ── Profile Comparison Panel ── */}
      {(() => {
        // Resolve indices: lab mode uses cusp index directly, normal mode uses profile birthDate
        const idxA = labMode ? labA : (profileA ? dateToCuspIndex(profileA.birthDate) : -1);
        const idxB = labMode ? labB : (profileB ? dateToCuspIndex(profileB.birthDate) : -1);
        const cuspA = idxA >= 0 ? CUSP_POSITIONS[idxA] : null;
        const cuspB = idxB >= 0 ? CUSP_POSITIONS[idxB] : null;
        const hasScore = idxA >= 0 && idxB >= 0;
        const scoreAB = hasScore ? COMPUTED_MATRIX[idxA][idxB] : null;
        const scoreBA = hasScore ? COMPUTED_MATRIX[idxB][idxA] : null;
        const tier = (s) => {
          if (s >= 90) return { label: 'A', color: '#fbbf24' };
          if (s >= 80) return { label: 'B', color: '#a78bfa' };
          if (s >= 70) return { label: 'C', color: '#22d3ee' };
          if (s >= 60) return { label: 'D', color: '#86efac' };
          return { label: 'F', color: '#f87171' };
        };
        const bdAB = hasScore ? getLayerBreakdown(idxA, idxB) : null;
        const bdBA = hasScore ? getLayerBreakdown(idxB, idxA) : null;
        const interp = hasScore ? interpretPair(idxA, idxB) : null;
        const rhs = hasScore ? computeRelationshipHealth(idxA, idxB) : null;
        const nameA = labMode ? (cuspA?.name || '') : (profileA ? (profileA.displayName || profileA.firstName) : '');
        const nameB = labMode ? (cuspB?.name || '') : (profileB ? (profileB.displayName || profileB.firstName) : '');

        return (
          <div className="shrink-0 bg-slate-800/80 border-t border-white/10">
            {/* Mode toggle + Selector row */}
            <div className="flex items-center gap-3 px-4 py-2.5">
              {/* Lab mode toggle */}
              <button onClick={() => { setLabMode(!labMode); setShowBreakdown(false); }}
                className={`shrink-0 px-2 py-1 text-[9px] font-semibold rounded transition-colors ${
                  labMode
                    ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                    : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                }`}>
                LAB
              </button>

              {/* Person A selector */}
              <div className="flex-1 min-w-0">
                {labMode ? (
                  <select value={labA} onChange={(e) => { setLabA(Number(e.target.value)); setShowBreakdown(false); }}
                    className="w-full bg-slate-700 border border-amber-500/20 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50">
                    <option value={-1}>-- Cusp A --</option>
                    {MATRIX_LABELS.map((label, i) => {
                      const c = cuspsData.positions[i];
                      return <option key={i} value={i}>{c.emoji} {label} ({c.dateRange.start.replace('-','/')}-{c.dateRange.end.replace('-','/')})</option>;
                    })}
                  </select>
                ) : (
                  <select value={profileA?.id || ''}
                    onChange={(e) => { setProfileA(profiles.find(p => p.id === e.target.value) || null); setShowBreakdown(false); }}
                    className="w-full bg-slate-700 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/50">
                    <option value="">-- Person A --</option>
                    {profiles.map(p => <option key={p.id} value={p.id}>{p.displayName || p.firstName}</option>)}
                  </select>
                )}
                {cuspA && (
                  <div className="mt-1.5 text-[11px] space-y-0.5">
                    <div className="text-white font-semibold">{nameA}</div>
                    {!labMode && profileA && <div className="text-white/50">{profileA.birthDate} (age {calculateAge(profileA.birthDate)})</div>}
                    <div className="text-white/60">{SIGN_EMOJIS[cuspA.sign]} {cuspA.name} <span className="text-white/30">({MATRIX_SHORT_LABELS[idxA]})</span></div>
                  </div>
                )}
              </div>

              {/* Score center */}
              <div className="flex flex-col items-center px-3 min-w-[110px]">
                {hasScore ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="text-center">
                        <div className="text-[9px] text-white/30">A→B</div>
                        <div className="text-2xl font-bold" style={{ color: tier(scoreAB).color }}>{scoreAB}</div>
                        <div className="text-[9px] font-bold" style={{ color: tier(scoreAB).color }}>{tier(scoreAB).label}</div>
                      </div>
                      <div className="text-white/20 text-lg">|</div>
                      <div className="text-center">
                        <div className="text-[9px] text-white/30">B→A</div>
                        <div className="text-2xl font-bold" style={{ color: tier(scoreBA).color }}>{scoreBA}</div>
                        <div className="text-[9px] font-bold" style={{ color: tier(scoreBA).color }}>{tier(scoreBA).label}</div>
                      </div>
                    </div>
                    <div className="text-[9px] text-white/30">diff: {Math.abs(scoreAB - scoreBA)}</div>
                    <button onClick={() => setShowBreakdown(!showBreakdown)}
                      className="mt-1 px-2 py-0.5 text-[9px] bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded hover:bg-sky-500/30 transition-colors">
                      {showBreakdown ? 'Hide' : 'Show'} Breakdown
                    </button>
                  </>
                ) : (
                  <div className="text-white/20 text-xs text-center">Select two<br/>{labMode ? 'cusps' : 'profiles'}</div>
                )}
              </div>

              {/* Person B selector */}
              <div className="flex-1 min-w-0">
                {labMode ? (
                  <select value={labB} onChange={(e) => { setLabB(Number(e.target.value)); setShowBreakdown(false); }}
                    className="w-full bg-slate-700 border border-purple-500/20 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/50">
                    <option value={-1}>-- Cusp B --</option>
                    {MATRIX_LABELS.map((label, i) => {
                      const c = cuspsData.positions[i];
                      return <option key={i} value={i}>{c.emoji} {label} ({c.dateRange.start.replace('-','/')}-{c.dateRange.end.replace('-','/')})</option>;
                    })}
                  </select>
                ) : (
                  <select value={profileB?.id || ''}
                    onChange={(e) => { setProfileB(profiles.find(p => p.id === e.target.value) || null); setShowBreakdown(false); }}
                    className="w-full bg-slate-700 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/50">
                    <option value="">-- Person B --</option>
                    {profiles.map(p => <option key={p.id} value={p.id}>{p.displayName || p.firstName}</option>)}
                  </select>
                )}
                {cuspB && (
                  <div className="mt-1.5 text-[11px] space-y-0.5">
                    <div className="text-white font-semibold">{nameB}</div>
                    {!labMode && profileB && <div className="text-white/50">{profileB.birthDate} (age {calculateAge(profileB.birthDate)})</div>}
                    <div className="text-white/60">{SIGN_EMOJIS[cuspB.sign]} {cuspB.name} <span className="text-white/30">({MATRIX_SHORT_LABELS[idxB]})</span></div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Breakdown Popup (floating, draggable) ── */}
            {showBreakdown && hasScore && bdAB && bdBA && interp && (
              <div
                className="fixed z-50 bg-slate-800/95 backdrop-blur-sm border border-white/15 rounded-xl shadow-2xl"
                style={{ left: bdPos.x, top: bdPos.y, width: 620, maxHeight: '80vh' }}
                onMouseDown={onBdMouseDown}
              >
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 cursor-move select-none">
                  <span className="text-white/80 text-[11px] font-semibold">{nameA} ↔ {nameB} — Breakdown</span>
                  <button onClick={() => setShowBreakdown(false)} className="text-white/40 hover:text-red-400 px-1.5 py-0.5 text-xs rounded hover:bg-red-500/10">✕</button>
                </div>
              <div className="px-4 py-3 overflow-auto text-[11px] space-y-4" style={{ maxHeight: 'calc(80vh - 36px)' }}>

                {/* Section A — Tier Badge + Label */}
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black px-2.5 py-0.5 rounded-lg" style={{
                    color: tier(scoreAB).color,
                    backgroundColor: tier(scoreAB).color + '20',
                    border: `1px solid ${tier(scoreAB).color}40`
                  }}>{interp.tier}</span>
                  <div>
                    <div className="text-white/80 font-semibold text-[12px]">{interp.tierLabel}</div>
                    <div className="text-white/40 text-[10px]">{interp.tierSummary}</div>
                  </div>
                </div>

                {/* Section B — Layer-by-Layer Table */}
                <div>
                  <div className="text-white/40 text-[10px] font-semibold mb-1.5 uppercase tracking-wider">Layer-by-Layer Breakdown</div>
                  <table className="w-full border-collapse text-[11px]">
                    <thead>
                      <tr className="text-left border-b border-white/15 text-white/40">
                        <th className="py-1 pr-2">Layer</th>
                        <th className="py-1 px-2">Weight</th>
                        <th className="py-1 px-2">{nameA} → {nameB}</th>
                        <th className="py-1 px-2">Weighted</th>
                        <th className="py-1 px-2">{nameB} → {nameA}</th>
                        <th className="py-1 px-2">Weighted</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/70 font-mono">
                      {[
                        { key: 'P', label: 'Psychology', color: 'text-pink-300', w: bdAB.weights.P, ab: bdAB.psych, ba: bdBA.psych },
                        { key: 'E', label: 'Elemental', color: 'text-emerald-300', w: bdAB.weights.E, ab: bdAB.elemental, ba: bdBA.elemental },
                        { key: 'Q', label: 'Seasonal Qi', color: 'text-amber-300', w: bdAB.weights.Q, ab: bdAB.seasonalQi, ba: bdBA.seasonalQi },
                        { key: 'A', label: 'Aspect', color: 'text-cyan-300', w: bdAB.weights.A, ab: bdAB.aspect, ba: bdBA.aspect },
                        { key: 'M', label: 'Modality', color: 'text-purple-300', w: bdAB.weights.M, ab: bdAB.modality, ba: bdBA.modality },
                      ].map(l => (
                        <tr key={l.key} className="border-b border-white/5">
                          <td className={`py-1 pr-2 font-sans font-semibold ${l.color}`}>{l.key} {l.label}</td>
                          <td className="py-1 px-2 text-white/30">×{l.w}</td>
                          <td className="py-1 px-2">{l.ab}</td>
                          <td className="py-1 px-2 text-white/40">= {(l.ab * l.w).toFixed(1)}</td>
                          <td className="py-1 px-2">{l.ba}</td>
                          <td className="py-1 px-2 text-white/40">= {(l.ba * l.w).toFixed(1)}</td>
                        </tr>
                      ))}
                      <tr className="border-t border-white/15 font-sans font-semibold text-white">
                        <td className="py-1 pr-2">Raw Total</td>
                        <td className="py-1 px-2"></td>
                        <td className="py-1 px-2" colSpan="2">
                          {(bdAB.elemental*bdAB.weights.E + bdAB.modality*bdAB.weights.M + bdAB.aspect*bdAB.weights.A + bdAB.seasonalQi*bdAB.weights.Q + bdAB.psych*bdAB.weights.P).toFixed(1)}
                        </td>
                        <td className="py-1 px-2" colSpan="2">
                          {(bdBA.elemental*bdBA.weights.E + bdBA.modality*bdBA.weights.M + bdBA.aspect*bdBA.weights.A + bdBA.seasonalQi*bdBA.weights.Q + bdBA.psych*bdBA.weights.P).toFixed(1)}
                        </td>
                      </tr>
                      {bdAB.dampener < 1 && (
                        <tr className="font-sans text-red-300">
                          <td className="py-1 pr-2">Dampener</td>
                          <td className="py-1 px-2"></td>
                          <td className="py-1 px-2" colSpan="2">×{bdAB.dampener}</td>
                          <td className="py-1 px-2" colSpan="2">×{bdBA.dampener}</td>
                        </tr>
                      )}
                      <tr className="border-t border-white/15 font-sans font-bold">
                        <td className="py-1.5 pr-2 text-white">Final Score</td>
                        <td className="py-1.5 px-2"></td>
                        <td className="py-1.5 px-2" colSpan="2" style={{ color: tier(bdAB.composite).color }}>{bdAB.composite}</td>
                        <td className="py-1.5 px-2" colSpan="2" style={{ color: tier(bdBA.composite).color }}>{bdBA.composite}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Section C — Narrative Interpretation */}
                <div className="space-y-3">
                  {interp.strengths.length > 0 && (
                    <div>
                      <div className="text-emerald-400/80 text-[10px] font-semibold uppercase tracking-wider mb-1">Strengths</div>
                      {interp.strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-2 text-white/70 mb-1.5">
                          <span className="text-emerald-400 mt-0.5 shrink-0 font-bold">+</span>
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {interp.tensions.length > 0 && (
                    <div>
                      <div className="text-amber-400/80 text-[10px] font-semibold uppercase tracking-wider mb-1">Tensions</div>
                      {interp.tensions.map((t, i) => (
                        <div key={i} className="flex items-start gap-2 text-white/70 mb-1.5">
                          <span className="text-amber-400 mt-0.5 shrink-0">~</span>
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section D — Directional Summary Block */}
                <div className="bg-slate-700/40 rounded-lg p-3 space-y-2">
                  <div className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">Directional Summary</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-white">{nameA} → {nameB}:</span>
                        <span className="font-bold" style={{ color: tier(bdAB.composite).color }}>{bdAB.composite}</span>
                        <span className="text-[9px] font-bold px-1 rounded" style={{ color: tier(bdAB.composite).color, backgroundColor: tier(bdAB.composite).color + '20' }}>{tier(bdAB.composite).label}</span>
                      </div>
                      <div className="text-white/50 text-[10px]">{interp.feelA}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-white">{nameB} → {nameA}:</span>
                        <span className="font-bold" style={{ color: tier(bdBA.composite).color }}>{bdBA.composite}</span>
                        <span className="text-[9px] font-bold px-1 rounded" style={{ color: tier(bdBA.composite).color, backgroundColor: tier(bdBA.composite).color + '20' }}>{tier(bdBA.composite).label}</span>
                      </div>
                      <div className="text-white/50 text-[10px]">{interp.feelB}</div>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-2 mt-2">
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="text-sky-400 font-semibold">Asymmetry: {Math.abs(bdAB.composite - bdBA.composite)} pts</span>
                      <span className="text-white/40">—</span>
                      <span className="text-white/60">{interp.directionNote}</span>
                    </div>
                  </div>
                </div>

                {/* Section E — Relationship Health Score */}
                {rhs && (
                <div className="bg-slate-700/40 rounded-lg p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">Relationship Health Score</div>
                    <span className="text-lg font-black px-2 py-0.5 rounded-lg" style={{
                      color: rhs.final >= 80 ? '#fbbf24' : rhs.final >= 70 ? '#a78bfa' : rhs.final >= 60 ? '#22d3ee' : '#86efac',
                      backgroundColor: (rhs.final >= 80 ? '#fbbf24' : rhs.final >= 70 ? '#a78bfa' : rhs.final >= 60 ? '#22d3ee' : '#86efac') + '20',
                      border: `1px solid ${rhs.final >= 80 ? '#fbbf24' : rhs.final >= 70 ? '#a78bfa' : rhs.final >= 60 ? '#22d3ee' : '#86efac'}40`,
                    }}>{rhs.final}</span>
                  </div>

                  {/* Sub-component bars */}
                  <div className="space-y-1.5">
                    {[
                      { label: 'Mutuality', value: rhs.mutuality, weight: '40%', color: '#fbbf24', tip: 'How strong the connection feels in both directions' },
                      { label: 'Balance', value: rhs.balance, weight: '20%', color: '#34d399', tip: 'Measures asymmetry — high = neither carries the load' },
                      { label: 'Chemistry', value: rhs.chemistry, weight: '20%', color: '#f472b6', tip: 'Wu Xing elemental flow — energetic texture' },
                      { label: 'Psych Align', value: rhs.psych, weight: '20%', color: '#a78bfa', tip: 'Temperament alignment — communication ease' },
                    ].map(comp => (
                      <div key={comp.label} className="group relative">
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="w-[65px] text-white/50 shrink-0">{comp.label}</span>
                          <span className="text-white/30 text-[8px] w-[24px]">{comp.weight}</span>
                          <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${comp.value}%`, backgroundColor: comp.color }} />
                          </div>
                          <span className="w-[28px] text-right font-mono text-white/60">{Math.round(comp.value)}</span>
                        </div>
                        <div className="absolute left-20 -top-6 px-2 py-1 bg-slate-900 border border-white/20 rounded text-[9px] text-white/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                          {comp.tip}
                        </div>
                      </div>
                    ))}
                    {rhs.dampener < 1 && (
                      <div className="text-[9px] text-red-300/60 mt-1">Sameness dampener: ×{rhs.dampener}</div>
                    )}
                  </div>

                  {/* Mutual A-tier badge */}
                  {scoreAB >= 90 && scoreBA >= 90 && (
                    <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg px-2.5 py-1.5">
                      <span className="text-amber-400 font-bold text-[11px]">Mutual A-Tier</span>
                      <span className="text-white/50 text-[9px]">Both directions score 90+ — rare, deep, reciprocal bond</span>
                    </div>
                  )}

                  {/* Interpretation */}
                  <div className="space-y-1 pt-1 border-t border-white/10">
                    {rhs.interpretation.map((line, i) => (
                      <div key={i} className="text-[10px] text-white/60 leading-relaxed">{line}</div>
                    ))}
                  </div>
                </div>
                )}

                {/* Section F — RHS Histogram (all 36 archetypes) */}
                <div className="space-y-2">
                  <div className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">Relationship Health — All 36 Archetypes</div>
                  <div className="text-[9px] text-white/30 mb-1">Average RHS across all partners (sorted). Mutual A-tier pairs shown in gold.</div>
                  <div className="max-h-[300px] overflow-y-auto pr-1 space-y-0.5">
                    {[...RHS_STATS].sort((a, b) => b.avgRHS - a.avgRHS).map((stat) => {
                      const maxRHS = 100;
                      const width = `${(stat.avgRHS / maxRHS) * 100}%`;
                      const barColor = stat.avgRHS >= 80 ? '#fbbf24' : stat.avgRHS >= 70 ? '#a78bfa' : stat.avgRHS >= 60 ? '#22d3ee' : '#86efac';
                      const isSelected = stat.index === idxA || stat.index === idxB;
                      return (
                        <div key={stat.index} className={`flex items-center gap-1.5 text-[9px] ${isSelected ? 'bg-white/5 rounded' : ''}`}>
                          <span className={`w-[100px] truncate shrink-0 ${isSelected ? 'text-white font-semibold' : 'text-white/50'}`}>{stat.label}</span>
                          <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width, backgroundColor: barColor }} />
                          </div>
                          <span className="w-[28px] text-right font-mono text-white/60">{stat.avgRHS}</span>
                          {stat.mutualACount > 0 && (
                            <span className="text-amber-400/70 text-[8px] w-[16px]">{stat.mutualACount}M</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

function CuspCard({ cusp, isExpanded, onToggle, onCopy, onMore }) {
  const colors = ELEMENT_COLORS[cusp.element.primary] || ELEMENT_COLORS.Fire;
  const isPure = cusp.type === 'pure';
  const primaryIcon = SIGN_ICONS[cusp.sign];
  const secondaryIcon = cusp.influencedBy ? SIGN_ICONS[cusp.influencedBy] : null;
  const zodiacSymbol = SIGN_EMOJIS[cusp.sign];

  // Format date: "03-21" → "03/21"
  const fmtDate = (d) => d.replace('-', '/');

  return (
    <div
      className={`bg-gradient-to-br ${colors.bg} rounded-xl border ${colors.border} overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-2 ring-white/30' : ''}`}
      onClick={() => { if (!isExpanded) onToggle(); }}
      style={{ cursor: isExpanded ? 'default' : 'pointer' }}
    >
      {/* Header - Click to toggle (close when expanded) */}
      <div
        className={`p-4 transition-colors ${isExpanded ? 'cursor-pointer hover:bg-white/5' : ''}`}
        onClick={(e) => { if (isExpanded) { e.stopPropagation(); onToggle(); } }}
      >
        <div className="flex items-start gap-3">
          {/* Stacked icons: mascot top, zodiac symbol or influence icon below */}
          <div className="flex flex-col items-center w-8 shrink-0 gap-0.5">
            <span className="text-xl leading-none">{primaryIcon}</span>
            {isPure
              ? <span className="text-xl leading-none opacity-50">{zodiacSymbol}</span>
              : secondaryIcon && <span className="text-xl leading-none opacity-70">{secondaryIcon}</span>
            }
          </div>
          {/* Name + archetype + mythic function */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm leading-tight">{cusp.name}</h3>
            <p className={`text-xs ${colors.text}`}>{cusp.archetype}</p>
            {ARCHETYPE_PROFILES[CUSP_ID_TO_INDEX[cusp.id]] && (
              <p className="text-[10px] text-amber-400/70 font-medium">Archetype: {ARCHETYPE_PROFILES[CUSP_ID_TO_INDEX[cusp.id]].mythicFunction}</p>
            )}
          </div>
          {/* Date + expand arrow, lower-right */}
          <div className="flex flex-col items-end justify-between shrink-0 self-stretch">
            <span className={`text-white/50 transition-transform text-xs ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
            <span className="text-white/40 text-[11px] font-mono whitespace-nowrap">
              {fmtDate(cusp.dateRange.start)} – {fmtDate(cusp.dateRange.end)}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-white/10 pt-4 space-y-4">
          {/* Quick info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/50">Sign:</span>
              <span className="ml-2 text-white">{SIGN_EMOJIS[cusp.sign]} {cusp.sign}</span>
            </div>
            <div>
              <span className="text-white/50">Element:</span>
              <span className={`ml-2 ${colors.text}`}>{cusp.element.mix}</span>
            </div>
            <div>
              <span className="text-white/50">Rulers:</span>
              <span className="ml-2 text-white">{cusp.rulers.join(', ')}</span>
            </div>
            {cusp.influencedBy && (
              <div>
                <span className="text-white/50">Influenced:</span>
                <span className="ml-2 text-white">{SIGN_EMOJIS[cusp.influencedBy]} {cusp.influencedBy}</span>
              </div>
            )}
          </div>

          {/* Characteristics */}
          <div>
            <h4 className="text-white/70 text-sm font-medium mb-2">Characteristics</h4>
            <ul className="space-y-1">
              {cusp.characteristics.map((c, i) => (
                <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                  <span className="text-white/40">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Strengths */}
          <div>
            <h4 className="text-green-400/80 text-sm font-medium mb-2">Strengths</h4>
            <ul className="space-y-1">
              {cusp.strengths.map((s, i) => (
                <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Challenges */}
          <div>
            <h4 className="text-orange-400/80 text-sm font-medium mb-2">Challenges</h4>
            <ul className="space-y-1">
              {cusp.challenges.map((c, i) => (
                <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                  <span className="text-orange-400">!</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Copy button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopy(cusp);
            }}
            className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>📋</span>
            <span>Copy to Clipboard</span>
          </button>

          {/* More button — opens extended profile */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMore(cusp);
            }}
            className="w-full py-2 px-4 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/25 rounded-lg text-indigo-300 text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>🔮</span>
            <span>More — Deep Profile</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function ZodiacCuspsPage() {
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [copiedId, setCopiedId] = useState(null);
  const [detailCusp, setDetailCusp] = useState(null);
  const [showMatrix, setShowMatrix] = useState(false);
  const [filterSign, setFilterSign] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const toggleCard = (id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const showAll = () => setExpandedIds(new Set(filteredCusps.map(c => c.id)));
  const closeAll = () => setExpandedIds(new Set());

  const cusps = cuspsData.positions;

  // Filter cusps
  const filteredCusps = cusps.filter(cusp => {
    if (filterSign !== 'all' && cusp.sign !== filterSign) return false;
    if (filterType !== 'all' && cusp.type !== filterType) return false;
    return true;
  });

  // Copy single cusp
  const handleCopy = async (cusp) => {
    const text = formatCuspForCopy(cusp);
    await navigator.clipboard.writeText(text);
    setCopiedId(cusp.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Copy all cusps
  const handleCopyAll = async () => {
    const header = [
      `═══════════════════════════════════════════════════════════════`,
      `  FATHER TICKY'S 36-POSITION ZODIAC SYSTEM`,
      `  "Which one feels like YOU?"`,
      `═══════════════════════════════════════════════════════════════`,
      ``,
      `Instructions for Grok/AI:`,
      `Read through these 36 zodiac positions and tell me which one`,
      `resonates most with your personality. Each sign has 3 versions:`,
      `• Blend-Back: First 6 days (influenced by previous sign)`,
      `• Pure: Middle days (undiluted sign energy)`,
      `• Blend-Forward: Last 6 days (influenced by next sign)`,
      ``,
      `═══════════════════════════════════════════════════════════════`,
      ``
    ].join('\n');

    const allCusps = filteredCusps.map(formatCuspForCopy).join('\n\n');
    const footer = [
      `═══════════════════════════════════════════════════════════════`,
      `  Based on which archetype, characteristics, strengths, and`,
      `  challenges resonate most with you, which position am I?`,
      `═══════════════════════════════════════════════════════════════`
    ].join('\n');

    await navigator.clipboard.writeText(header + allCusps + footer);
    setCopiedId('all');
    setTimeout(() => setCopiedId(null), 3000);
  };

  // Get unique signs for filter
  const signs = [...new Set(cusps.map(c => c.sign))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors"
          >
            <span>←</span>
            <span>Back to Profile</span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">
            ⭐ 36-Position Zodiac System
          </h1>
          <p className="text-white/60">
            Father Ticky's 6-6 Cusp Model - Find which position resonates with YOU
          </p>
        </div>

        {/* Instructions Card */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
            <span>📋</span>
            <span>How to Use</span>
          </h2>
          <ol className="space-y-2 text-white/70 text-sm">
            <li><span className="text-indigo-400 font-medium">1.</span> Click "Copy All 36 Positions" below</li>
            <li><span className="text-indigo-400 font-medium">2.</span> Paste into Grok, ChatGPT, or Claude</li>
            <li><span className="text-indigo-400 font-medium">3.</span> Ask: "Which of these 36 positions feels most like me based on our conversation?"</li>
            <li><span className="text-indigo-400 font-medium">4.</span> The AI will analyze which archetype matches your personality!</li>
          </ol>

          <button
            onClick={handleCopyAll}
            className={`mt-4 w-full py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              copiedId === 'all'
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white'
            }`}
          >
            {copiedId === 'all' ? (
              <>
                <span>✓</span>
                <span>Copied All 36 Positions!</span>
              </>
            ) : (
              <>
                <span>📋</span>
                <span>Copy All {filteredCusps.length} Positions to Clipboard</span>
              </>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="text-white/60 text-sm block mb-1">Filter by Sign</label>
            <select
              value={filterSign}
              onChange={(e) => setFilterSign(e.target.value)}
              className="bg-slate-800 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all">All Signs</option>
              {signs.map(sign => (
                <option key={sign} value={sign}>{SIGN_EMOJIS[sign]} {sign}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-white/60 text-sm block mb-1">Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-800 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all">All Types</option>
              <option value="blend-back">Blend-Back (First 6 days)</option>
              <option value="pure">Pure (Middle days)</option>
              <option value="blend-forward">Blend-Forward (Last 6 days)</option>
            </select>
          </div>
        </div>

        {/* Show All / Close All */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={showAll}
            className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-lg text-indigo-300 text-sm transition-colors"
          >
            Show All
          </button>
          <button
            onClick={closeAll}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg text-white/70 text-sm transition-colors"
          >
            Close All
          </button>
          <span className="text-white/40 text-sm flex items-center ml-2">
            {expandedIds.size} / {filteredCusps.length} open
          </span>
          <div className="flex-1" />
          <button
            onClick={() => setShowMatrix(true)}
            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-300 text-sm transition-colors flex items-center gap-2"
          >
            <span>📊</span>
            <span>36×36 Compatibility Matrix</span>
          </button>
        </div>

        {/* Cusps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCusps.map((cusp) => (
            <CuspCard
              key={cusp.id}
              cusp={cusp}
              isExpanded={expandedIds.has(cusp.id)}
              onToggle={() => toggleCard(cusp.id)}
              onCopy={handleCopy}
              onMore={(c) => setDetailCusp(c)}
            />
          ))}
        </div>

        {/* Quick Reference */}
        <div className="mt-8 bg-slate-800/50 rounded-xl border border-white/10 p-6">
          <h2 className="text-white font-semibold mb-4">Quick Reference: The 3 Types</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-amber-400 font-medium mb-2">Blend-Back</h3>
              <p className="text-white/70">First 6 days of sign. Primary sign dominant (70%) with previous sign's influence (30%).</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-green-400 font-medium mb-2">Pure</h3>
              <p className="text-white/70">Middle days of sign. Undiluted sign energy (100%). Most archetypal expression.</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-blue-400 font-medium mb-2">Blend-Forward</h3>
              <p className="text-white/70">Last 6 days of sign. Primary sign dominant (70%) with next sign's influence (30%).</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          >
            ← Back to Western Zodiac
          </Link>
        </div>
      </div>

      {/* Extended profile floating window */}
      {detailCusp && (
        <ExtendedProfileWindow cusp={detailCusp} onClose={() => setDetailCusp(null)} />
      )}

      {/* 36×36 Compatibility Matrix */}
      {showMatrix && (
        <CompatibilityMatrixWindow onClose={() => setShowMatrix(false)} onDetailCusp={setDetailCusp} />
      )}
    </div>
  );
}
