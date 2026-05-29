/**
 * ZodiacAnatomyPage.jsx
 * The Metaphysical Body — 36-organ Zodiac Atlas, chakra + meridian maps,
 * organ narrative panels, and the 36-row Cosmogram.
 *
 * Promoted out of the ZodiacCuspsPage matrix theory modal on 2026-04-15.
 * This page is the doorway to the Health Module.
 */

import React, { lazy, Suspense, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MACRO_SYSTEMS, COSMOGRAM_ROWS } from '../data/organCosmogram';
import { COSMOGRAM_SYSTEM_UI } from '../data/cosmogramUI';
import { useProfiles } from '../contexts/ProfileContext';
import { MATRIX_LABELS } from '../data/cuspCompatibilityMatrix';
import cuspsData from '../data/westernZodiacCusps.json';

const CUSP_POSITIONS = cuspsData.positions;
const SIGN_EMOJIS = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
};

function dateToCuspIndex(birthDate) {
  if (!birthDate) return -1;
  const [, mm, dd] = birthDate.split('-').map(Number);
  for (let i = 0; i < CUSP_POSITIONS.length; i++) {
    const { start, end } = CUSP_POSITIONS[i].dateRange;
    const [sm, sd] = start.split('-').map(Number);
    const [em, ed] = end.split('-').map(Number);
    if (sm > em) {
      if ((mm > sm || (mm === sm && dd >= sd)) || (mm < em || (mm === em && dd <= ed))) return i;
    } else {
      if ((mm > sm || (mm === sm && dd >= sd)) && (mm < em || (mm === em && dd <= ed))) return i;
    }
  }
  return -1;
}

// 3D scene is lazy-loaded so the three.js chunk only downloads when this page mounts.
const ZodiacBody3D = lazy(() => import('../components/zodiac/ZodiacBody3D'));

// ── Floating MD Reference Window ──
function FloatingMdWindow({ title, onClose, children }) {
  const ref = useRef(null);
  const drag = useRef({ active: false, ox: 0, oy: 0 });
  const [pos, setPos] = useState({ x: 200, y: 80 });

  const onDown = (e) => {
    if (e.target.closest('[data-no-drag]')) return;
    drag.current = { active: true, ox: e.clientX - pos.x, oy: e.clientY - pos.y };
    e.preventDefault();
  };
  useEffect(() => {
    const onMove = (e) => { if (drag.current.active) setPos({ x: e.clientX - drag.current.ox, y: e.clientY - drag.current.oy }); };
    const onUp = () => { drag.current.active = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  return (
    <div ref={ref} className="fixed z-[9999] select-none" style={{ left: pos.x, top: pos.y, width: 540 }}>
      <div onMouseDown={onDown} className="cursor-move bg-slate-900 border border-white/20 rounded-t-lg px-4 py-2 flex items-center justify-between">
        <span className="text-sm font-bold text-white">{title}</span>
        <button data-no-drag onClick={onClose} className="text-white/30 hover:text-red-400 text-sm px-2">✕</button>
      </div>
      <div data-no-drag className="bg-slate-950 border border-t-0 border-white/10 rounded-b-lg overflow-y-auto p-5 text-[12px] text-white/80 leading-relaxed prose prose-invert prose-sm max-h-[70vh]">
        {children}
      </div>
    </div>
  );
}

// ── Qi Theory content (inline to avoid async MD loading) ──
function QiTheoryContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Qi (氣) — Theory Reference</h2>

      <h3 className="text-emerald-300 font-bold text-sm">What Is Qi?</h3>
      <p>Qi (氣) is the fundamental life-force that circulates through all living systems. In TCM, Qi is not a metaphor — it is the operational substrate of health, emotion, cognition, and vitality.</p>
      <table className="w-full text-[11px]"><tbody>
        <tr><td className="text-white/50 pr-2 align-top">Chinese</td><td>氣 (qì)</td></tr>
        <tr><td className="text-white/50 pr-2 align-top">Literal</td><td>"Breath," "air," "vital energy"</td></tr>
        <tr><td className="text-white/50 pr-2 align-top">Nature</td><td>Neither matter nor energy alone — it is functional activity</td></tr>
        <tr><td className="text-white/50 pr-2 align-top">Governs</td><td>Movement, warmth, protection, transformation, containment</td></tr>
      </tbody></table>

      <h3 className="text-emerald-300 font-bold text-sm">Types of Qi</h3>
      <table className="w-full text-[11px] border-collapse"><thead><tr className="text-white/40 border-b border-white/10"><th className="text-left pb-1">Type</th><th className="text-left pb-1">Chinese</th><th className="text-left pb-1">Source</th></tr></thead><tbody className="text-white/70">
        <tr><td className="py-0.5">Yuan Qi (Original)</td><td>原氣</td><td>Inherited — Kidney, Ming Men</td></tr>
        <tr><td className="py-0.5">Zong Qi (Gathering)</td><td>宗氣</td><td>Food + Air — Chest</td></tr>
        <tr><td className="py-0.5">Ying Qi (Nutritive)</td><td>營氣</td><td>Refined from food — inside vessels</td></tr>
        <tr><td className="py-0.5">Wei Qi (Defensive)</td><td>衛氣</td><td>Coarse Qi — skin, muscles</td></tr>
        <tr><td className="py-0.5">Zheng Qi (Upright)</td><td>正氣</td><td>Total healthy Qi — whole body</td></tr>
      </tbody></table>

      <h3 className="text-emerald-300 font-bold text-sm">The Meridian Clock (子午流注)</h3>
      <table className="w-full text-[11px] border-collapse"><thead><tr className="text-white/40 border-b border-white/10"><th className="text-left pb-1">Time</th><th className="text-left pb-1">Organ</th><th className="text-left pb-1">Element</th></tr></thead><tbody className="text-white/70">
        {[
          ['3–5 AM','Lung','Metal'],['5–7 AM','Large Intestine','Metal'],['7–9 AM','Stomach','Earth'],
          ['9–11 AM','Spleen','Earth'],['11 AM–1 PM','Heart','Fire'],['1–3 PM','Small Intestine','Fire'],
          ['3–5 PM','Bladder','Water'],['5–7 PM','Kidney','Water'],['7–9 PM','Pericardium','Fire'],
          ['9–11 PM','Triple Burner','Fire'],['11 PM–1 AM','Gallbladder','Wood'],['1–3 AM','Liver','Wood'],
        ].map(([t, o, e]) => <tr key={t}><td className="py-0.5">{t}</td><td>{o}</td><td>{e}</td></tr>)}
      </tbody></table>

      <h3 className="text-emerald-300 font-bold text-sm">Historical Timeline</h3>
      <table className="w-full text-[11px]"><tbody className="text-white/70">
        {[
          ['~2000 BCE','Earliest Qi references in oracle bones'],
          ['~300 BCE','Huangdi Neijing (黃帝內經) — meridian theory'],
          ['~200 BCE','Nanjing (難經) — Qi dynamics, pulse diagnosis'],
          ['200 CE','Zhang Zhongjing\'s Shanghan Lun'],
          ['600 CE','Sun Simiao systematizes acupoint maps'],
          ['1600 CE','Li Shizhen\'s Bencao Gangmu'],
          ['2026','AstroProfile — first 36-organ Wu Xin lattice'],
        ].map(([y, d]) => <tr key={y}><td className="text-white/40 pr-3 align-top whitespace-nowrap">{y}</td><td>{d}</td></tr>)}
      </tbody></table>
    </div>
  );
}

function ShengKeContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Sheng (生) & Ke (克) — Five Element Cycles</h2>

      <h3 className="text-emerald-300 font-bold text-sm">The Two Cycles</h3>
      <table className="w-full text-[11px] border-collapse"><thead><tr className="text-white/40 border-b border-white/10"><th className="text-left pb-1">Cycle</th><th className="text-left pb-1">Chinese</th><th className="text-left pb-1">Function</th></tr></thead><tbody className="text-white/70">
        <tr><td className="py-0.5 font-semibold text-emerald-300">Sheng</td><td>生 (creation)</td><td>Parent nourishes child — maintains growth</td></tr>
        <tr><td className="py-0.5 font-semibold text-red-300">Ke</td><td>克 (control)</td><td>Grandparent restrains grandchild — prevents excess</td></tr>
      </tbody></table>

      <h3 className="text-emerald-300 font-bold text-sm">Sheng (生) Creation Cycle</h3>
      <p className="text-center text-[13px] font-mono text-white/60">Water 🌊 → Wood 🌳 → Fire 🔥 → Earth 🏔️ → Metal ⚔️ → Water 🌊</p>
      <table className="w-full text-[11px] border-collapse"><thead><tr className="text-white/40 border-b border-white/10"><th className="text-left pb-1">Parent</th><th className="text-left pb-1">→ Child</th><th className="text-left pb-1">Logic</th></tr></thead><tbody className="text-white/70">
        <tr><td>Water</td><td>→ Wood</td><td>Water nourishes trees — Kidney Jing feeds Liver Blood</td></tr>
        <tr><td>Wood</td><td>→ Fire</td><td>Wood fuels flame — Liver Qi drives Heart activity</td></tr>
        <tr><td>Fire</td><td>→ Earth</td><td>Fire creates ash/soil — Heart warmth supports Spleen</td></tr>
        <tr><td>Earth</td><td>→ Metal</td><td>Earth yields ore — Spleen Qi supports Lung</td></tr>
        <tr><td>Metal</td><td>→ Water</td><td>Metal channels water — Lung Qi descends to Kidney</td></tr>
      </tbody></table>

      <h3 className="text-red-300 font-bold text-sm">Ke (克) Control Cycle</h3>
      <p className="text-center text-[13px] font-mono text-white/60">Water 🌊 ⊸ Fire 🔥 ⊸ Metal ⚔️ ⊸ Wood 🌳 ⊸ Earth 🏔️ ⊸ Water 🌊</p>
      <table className="w-full text-[11px] border-collapse"><thead><tr className="text-white/40 border-b border-white/10"><th className="text-left pb-1">Controller</th><th className="text-left pb-1">→ Controlled</th><th className="text-left pb-1">Logic</th></tr></thead><tbody className="text-white/70">
        <tr><td>Water</td><td>→ Fire</td><td>Water extinguishes flame — Kidney cools Heart excess</td></tr>
        <tr><td>Fire</td><td>→ Metal</td><td>Fire melts metal — Heart heat controls Lung</td></tr>
        <tr><td>Metal</td><td>→ Wood</td><td>Axe cuts tree — Lung Qi restrains Liver rising</td></tr>
        <tr><td>Wood</td><td>→ Earth</td><td>Roots penetrate soil — Liver controls Spleen overwork</td></tr>
        <tr><td>Earth</td><td>→ Water</td><td>Earth dams water — Spleen contains Kidney fluid</td></tr>
      </tbody></table>

      <h3 className="text-amber-300 font-bold text-sm">Pathology Patterns</h3>
      <table className="w-full text-[11px] border-collapse"><thead><tr className="text-white/40 border-b border-white/10"><th className="text-left pb-1">Pattern</th><th className="text-left pb-1">Chinese</th><th className="text-left pb-1">Meaning</th></tr></thead><tbody className="text-white/70">
        <tr><td>Sheng Excess</td><td>母病及子</td><td>Mother overwhelms child</td></tr>
        <tr><td>Sheng Deficiency</td><td>子病及母</td><td>Child drains mother</td></tr>
        <tr><td>Ke Excess</td><td>相克太過</td><td>Controller too strong — suppression</td></tr>
        <tr><td>Ke Deficiency</td><td>相克不及</td><td>Controller too weak — unchecked growth</td></tr>
        <tr><td>Counter-Ke</td><td>相侮</td><td>Controlled element rebels — reversal</td></tr>
      </tbody></table>

      <h3 className="text-emerald-300 font-bold text-sm">Diagnostic Framework</h3>
      <pre className="text-[10px] text-white/50 bg-slate-800/50 rounded p-3">{`              Controlled by (Ke source)
                      ↓
  Nourished by  →  [ORGAN]  →  Nourishes
  (Sheng parent)                (Sheng child)
                      ↓
              Controls (Ke target)`}</pre>
    </div>
  );
}

export default function ZodiacAnatomyPage() {
  let profiles = [];
  try { profiles = useProfiles().profiles || []; } catch { /* no provider */ }

  const [showQiMd, setShowQiMd] = useState(false);
  const [showShengKeMd, setShowShengKeMd] = useState(false);
  const [labModeA, setLabModeA] = useState(false);
  const [labModeB, setLabModeB] = useState(false);
  const [labA, setLabA] = useState(-1);
  const [labB, setLabB] = useState(-1);
  const [profileA, setProfileA] = useState(null);
  const [profileB, setProfileB] = useState(null);

  const idxA = labModeA ? labA : (profileA ? dateToCuspIndex(profileA.birthDate) : -1);
  const idxB = labModeB ? labB : (profileB ? dateToCuspIndex(profileB.birthDate) : -1);
  const cuspA = idxA >= 0 ? CUSP_POSITIONS[idxA] : null;
  const cuspB = idxB >= 0 ? CUSP_POSITIONS[idxB] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white/80">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <header className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Zodiac Anatomy — The Metaphysical Body</h1>
            <p className="text-sm text-white/50 mt-1">
              The living organism beneath the 36-cusp system. Feeds the Health Module.
            </p>
          </div>
          <Link
            to="/zodiac-cusps"
            className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white/90 transition-colors"
          >
            ← Back to Zodiac Cusps
          </Link>
        </header>

        {/* Person A / B selector bar — independent LAB toggle per side */}
        <div className="flex items-center gap-3 mb-4 bg-slate-800/60 border border-white/10 rounded-lg px-4 py-2.5">
          {/* Person A: LAB toggle + dropdown */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <button
                onClick={() => setLabModeA((v) => !v)}
                className={`shrink-0 px-2 py-0.5 text-[9px] font-semibold rounded transition-colors ${
                  labModeA
                    ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                    : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                }`}
              >
                LAB
              </button>
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              <span className="text-white/50 text-[10px] font-semibold">Person A</span>
            </div>
            {labModeA ? (
              <select
                value={labA}
                onChange={(e) => setLabA(Number(e.target.value))}
                className="w-full bg-slate-700 border border-amber-500/20 rounded px-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-amber-500/50"
              >
                <option value={-1}>-- Cusp A --</option>
                {MATRIX_LABELS.map((label, i) => {
                  const c = CUSP_POSITIONS[i];
                  return <option key={i} value={i}>{c.emoji} {label} ({c.dateRange.start.replace('-','/')}-{c.dateRange.end.replace('-','/')})</option>;
                })}
              </select>
            ) : (
              <select
                value={profileA?.id || ''}
                onChange={(e) => setProfileA(profiles.find((p) => p.id === e.target.value) || null)}
                className="w-full bg-slate-700 border border-white/10 rounded px-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-amber-500/50"
              >
                <option value="">-- Person A --</option>
                {profiles.map((p) => <option key={p.id} value={p.id}>{p.displayName || p.firstName}</option>)}
              </select>
            )}
            {cuspA && (
              <div className="mt-1 text-[10px] flex items-center gap-1.5">
                <span className="text-white/70">{SIGN_EMOJIS[cuspA.sign]} {cuspA.name}</span>
                <span className="text-white/30">R{idxA}</span>
                <span className="text-white/50">{COSMOGRAM_ROWS.find((r) => r.row === idxA)?.organ}</span>
              </div>
            )}
          </div>

          {/* Center divider */}
          <div className="text-white/20 text-[10px] text-center px-1 shrink-0">vs</div>

          {/* Person B: LAB toggle + dropdown */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <button
                onClick={() => setLabModeB((v) => !v)}
                className={`shrink-0 px-2 py-0.5 text-[9px] font-semibold rounded transition-colors ${
                  labModeB
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40'
                    : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                }`}
              >
                LAB
              </button>
              <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
              <span className="text-white/50 text-[10px] font-semibold">Person B</span>
            </div>
            {labModeB ? (
              <select
                value={labB}
                onChange={(e) => setLabB(Number(e.target.value))}
                className="w-full bg-slate-700 border border-purple-500/20 rounded px-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value={-1}>-- Cusp B --</option>
                {MATRIX_LABELS.map((label, i) => {
                  const c = CUSP_POSITIONS[i];
                  return <option key={i} value={i}>{c.emoji} {label} ({c.dateRange.start.replace('-','/')}-{c.dateRange.end.replace('-','/')})</option>;
                })}
              </select>
            ) : (
              <select
                value={profileB?.id || ''}
                onChange={(e) => setProfileB(profiles.find((p) => p.id === e.target.value) || null)}
                className="w-full bg-slate-700 border border-white/10 rounded px-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value="">-- Person B --</option>
                {profiles.map((p) => <option key={p.id} value={p.id}>{p.displayName || p.firstName}</option>)}
              </select>
            )}
            {cuspB && (
              <div className="mt-1 text-[10px] flex items-center gap-1.5">
                <span className="text-white/70">{SIGN_EMOJIS[cuspB.sign]} {cuspB.name}</span>
                <span className="text-white/30">R{idxB}</span>
                <span className="text-white/50">{COSMOGRAM_ROWS.find((r) => r.row === idxB)?.organ}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── 3D Zodiac Body ── */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">The Living Body — 3D Atlas</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQiMd((v) => !v)}
                className={`px-2 py-0.5 rounded text-[9px] font-semibold transition-colors ${
                  showQiMd ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                }`}
              >
                氣 Qi Theory
              </button>
              <button
                onClick={() => setShowShengKeMd((v) => !v)}
                className={`px-2 py-0.5 rounded text-[9px] font-semibold transition-colors ${
                  showShengKeMd ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                }`}
              >
                生克 Sheng/Ke
              </button>
              <span className="text-[10px] text-white/40">36 organs · click to explore</span>
            </div>
          </div>
          <Suspense fallback={
            <div className="w-full h-[560px] rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-center text-white/40 text-sm">
              Loading 3D scene…
            </div>
          }>
            <ZodiacBody3D personA={idxA >= 0 ? idxA : null} personB={idxB >= 0 ? idxB : null} />
          </Suspense>
        </section>

        {/* Floating MD reference windows */}
        {showQiMd && (
          <FloatingMdWindow title="氣 Qi Theory Reference" onClose={() => setShowQiMd(false)}>
            <QiTheoryContent />
          </FloatingMdWindow>
        )}
        {showShengKeMd && (
          <FloatingMdWindow title="生克 Sheng & Ke Cycles" onClose={() => setShowShengKeMd(false)}>
            <ShengKeContent />
          </FloatingMdWindow>
        )}

        <div className="text-[13px] leading-relaxed text-white/80 space-y-6">
          {/* ── Zodiac Anatomy Comparison ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">Zodiac Anatomy — The Metaphysical Body</h3>
            <p className="text-[12px] text-white/70">
              Each sign corresponds to a <strong className="text-white">functional organ</strong> — not cosmetically, but based on
              mythic function, elemental physics, modality, and psychological domain.
              Each cusp becomes a <strong className="text-white">sub-organ or specialized tissue</strong> inside the major organ.
              Together, the 36 archetypes form a <strong className="text-emerald-300">living metaphysical organism</strong>.
            </p>

            {/* Macro anatomy diagram */}
            <div className="bg-slate-800/60 rounded-lg p-4 font-mono text-[10px] text-white/70 leading-relaxed whitespace-pre overflow-x-auto">
{`    🔮 AQUARIUS — Cerebral Cortex (vision, patterning)
         │
    🧠 GEMINI — Nervous System (messaging, signaling)
         │
    🫁 LIBRA — Lungs (relational exchange, harmony)
         │
    ❤️ CANCER — Heart (emotional bonding, attachment)
         │
    🔥 LEO — Liver (vitality, regeneration)
         │
    🧬 VIRGO — Digestive System (analysis, refinement)
         │
    🩸 SCORPIO — Blood (emotional chemistry, depth)
         │
    🌊 PISCES — Lymphatic System (cleansing, psychic flow)
         │
    ⚡ ARIES — Muscles (action, protection)
         │
    🏹 SAGITTARIUS — Diaphragm (expansion, meaning)
         │
    🏔️ CAPRICORN — Spine (discipline, alignment)
         │
    🦴 TAURUS — Skeleton (stability, structure)`}
            </div>

            {/* 36-cusp sub-organ table */}
            <div className="text-[11px] font-semibold text-white/50 mb-1">36-Cusp Sub-Organ Map</div>
            <div className="grid grid-cols-2 gap-3 text-[10px]">
              {/* Heart */}
              <div className="bg-rose-500/10 border border-rose-500/15 rounded-lg p-2.5">
                <div className="text-rose-300 font-bold mb-1">❤️ Cancer — Heart</div>
                <div className="text-white/60 space-y-0.5">
                  <div>CA-GE → <span className="text-white/80">Sinoatrial Node</span> <span className="text-white/40">(heart's pacemaker — emotional rhythm + communication)</span></div>
                  <div>CA → <span className="text-white/80">Left Ventricle</span> <span className="text-white/40">(primary emotional pump)</span></div>
                  <div>CA-LE → <span className="text-white/80">Right Ventricle</span> <span className="text-white/40">(protective, loyal emotional output)</span></div>
                </div>
              </div>
              {/* Nervous System */}
              <div className="bg-cyan-500/10 border border-cyan-500/15 rounded-lg p-2.5">
                <div className="text-cyan-300 font-bold mb-1">🧠 Gemini — Nervous System</div>
                <div className="text-white/60 space-y-0.5">
                  <div>GE-TA → <span className="text-white/80">Peripheral Nerves</span> <span className="text-white/40">(sensory stability + communication)</span></div>
                  <div>GE → <span className="text-white/80">Neural Synapses</span> <span className="text-white/40">(fast messaging)</span></div>
                  <div>GE-CA → <span className="text-white/80">Vagus Nerve</span> <span className="text-white/40">(emotional-linguistic intuition)</span></div>
                </div>
              </div>
              {/* Lungs */}
              <div className="bg-sky-500/10 border border-sky-500/15 rounded-lg p-2.5">
                <div className="text-sky-300 font-bold mb-1">🫁 Libra — Lungs</div>
                <div className="text-white/60 space-y-0.5">
                  <div>LI-VI → <span className="text-white/80">Bronchioles</span> <span className="text-white/40">(precision breath regulation)</span></div>
                  <div>LI → <span className="text-white/80">Lung Lobes</span> <span className="text-white/40">(balance + relational exchange)</span></div>
                  <div>LI-SC → <span className="text-white/80">Alveoli</span> <span className="text-white/40">(magnetic relational oxygen exchange)</span></div>
                </div>
              </div>
              {/* Skeleton */}
              <div className="bg-amber-500/10 border border-amber-500/15 rounded-lg p-2.5">
                <div className="text-amber-200 font-bold mb-1">🦴 Taurus — Skeleton</div>
                <div className="text-white/60 space-y-0.5">
                  <div>TA-AR → <span className="text-white/80">Rib Cage</span> <span className="text-white/40">(protective stability)</span></div>
                  <div>TA → <span className="text-white/80">Femur</span> <span className="text-white/40">(strongest bone — foundational stability)</span></div>
                  <div>TA-GE → <span className="text-white/80">Spinal Ribs</span> <span className="text-white/40">(stable structure + communication)</span></div>
                </div>
              </div>
              {/* Spine */}
              <div className="bg-stone-500/10 border border-stone-500/15 rounded-lg p-2.5">
                <div className="text-stone-300 font-bold mb-1">🏔️ Capricorn — Spine</div>
                <div className="text-white/60 space-y-0.5">
                  <div>CP-SA → <span className="text-white/80">Lumbar Spine</span> <span className="text-white/40">(enduring structure + exploration)</span></div>
                  <div>CP → <span className="text-white/80">Thoracic Spine</span> <span className="text-white/40">(central structural alignment)</span></div>
                  <div>CP-AQ → <span className="text-white/80">Cervical Spine</span> <span className="text-white/40">(structural intelligence + vision)</span></div>
                </div>
              </div>
              {/* Liver */}
              <div className="bg-orange-500/10 border border-orange-500/15 rounded-lg p-2.5">
                <div className="text-orange-300 font-bold mb-1">🔥 Leo — Liver</div>
                <div className="text-white/60 space-y-0.5">
                  <div>LE-CA → <span className="text-white/80">Hepatic Portal Vein</span> <span className="text-white/40">(emotional nourishment + vitality)</span></div>
                  <div>LE → <span className="text-white/80">Liver Core</span> <span className="text-white/40">(vitality, regeneration, life force)</span></div>
                  <div>LE-VI → <span className="text-white/80">Bile Ducts</span> <span className="text-white/40">(loyal refinement of energy)</span></div>
                </div>
              </div>
              {/* Blood */}
              <div className="bg-red-500/10 border border-red-500/15 rounded-lg p-2.5">
                <div className="text-red-300 font-bold mb-1">🩸 Scorpio — Blood</div>
                <div className="text-white/60 space-y-0.5">
                  <div>SC-LI → <span className="text-white/80">Plasma</span> <span className="text-white/40">(relational chemistry)</span></div>
                  <div>SC → <span className="text-white/80">Red Blood Cells</span> <span className="text-white/40">(depth + emotional oxygen)</span></div>
                  <div>SC-SA → <span className="text-white/80">White Blood Cells</span> <span className="text-white/40">(transformational defense)</span></div>
                </div>
              </div>
              {/* Lymph */}
              <div className="bg-indigo-500/10 border border-indigo-500/15 rounded-lg p-2.5">
                <div className="text-indigo-300 font-bold mb-1">🌊 Pisces — Lymphatic System</div>
                <div className="text-white/60 space-y-0.5">
                  <div>PI-AQ → <span className="text-white/80">Lymph Nodes</span> <span className="text-white/40">(symbolic intuition)</span></div>
                  <div>PI → <span className="text-white/80">Lymph Fluid</span> <span className="text-white/40">(emotional cleansing)</span></div>
                  <div>PI-AR → <span className="text-white/80">Immune Signaling</span> <span className="text-white/40">(intuitive action)</span></div>
                </div>
              </div>
              {/* Muscles */}
              <div className="bg-red-600/10 border border-red-600/15 rounded-lg p-2.5">
                <div className="text-red-400 font-bold mb-1">⚡ Aries — Muscles</div>
                <div className="text-white/60 space-y-0.5">
                  <div>AR-PI → <span className="text-white/80">Smooth Muscle</span> <span className="text-white/40">(intuitive action)</span></div>
                  <div>AR → <span className="text-white/80">Skeletal Muscle</span> <span className="text-white/40">(initiation + drive)</span></div>
                  <div>AR-TA → <span className="text-white/80">Tendons</span> <span className="text-white/40">(force + stability)</span></div>
                </div>
              </div>
              {/* Diaphragm */}
              <div className="bg-purple-500/10 border border-purple-500/15 rounded-lg p-2.5">
                <div className="text-purple-300 font-bold mb-1">🏹 Sagittarius — Diaphragm</div>
                <div className="text-white/60 space-y-0.5">
                  <div>SA-SC → <span className="text-white/80">Lower Diaphragm</span> <span className="text-white/40">(deep breath of truth)</span></div>
                  <div>SA → <span className="text-white/80">Diaphragm Core</span> <span className="text-white/40">(expansion + meaning)</span></div>
                  <div>SA-CP → <span className="text-white/80">Upper Diaphragm</span> <span className="text-white/40">(structured expansion)</span></div>
                </div>
              </div>
              {/* Digestion */}
              <div className="bg-green-500/10 border border-green-500/15 rounded-lg p-2.5">
                <div className="text-green-300 font-bold mb-1">🧬 Virgo — Digestive System</div>
                <div className="text-white/60 space-y-0.5">
                  <div>VI-LE → <span className="text-white/80">Stomach</span> <span className="text-white/40">(loyal processing)</span></div>
                  <div>VI → <span className="text-white/80">Small Intestine</span> <span className="text-white/40">(refinement + analysis)</span></div>
                  <div>VI-LI → <span className="text-white/80">Large Intestine</span> <span className="text-white/40">(balancing assimilation)</span></div>
                </div>
              </div>
              {/* Brain */}
              <div className="bg-violet-500/10 border border-violet-500/15 rounded-lg p-2.5">
                <div className="text-violet-300 font-bold mb-1">🔮 Aquarius — Brain</div>
                <div className="text-white/60 space-y-0.5">
                  <div>AQ-CP → <span className="text-white/80">Prefrontal Cortex</span> <span className="text-white/40">(strategic vision)</span></div>
                  <div>AQ → <span className="text-white/80">Neocortex</span> <span className="text-white/40">(pattern recognition)</span></div>
                  <div>AQ-PI → <span className="text-white/80">Default Mode Network</span> <span className="text-white/40">(mystic imagination)</span></div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Zodiac Chakra Map ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-fuchsia-300 uppercase tracking-wider">Zodiac Chakra Map</h3>
            <p className="text-[12px] text-white/70">
              The 12 signs mapped to the <strong className="text-white">7 classical chakras</strong>, with cusp-level nuance.
              Each chakra governs an energetic domain — the zodiac signs that resonate with that domain
              become its <strong className="text-fuchsia-300">mythic occupants</strong>.
            </p>
            <div className="space-y-2">
              {/* Crown */}
              <div className="bg-violet-500/10 border border-violet-500/15 rounded-lg p-2.5 text-[10px]">
                <div className="text-violet-300 font-bold">👑 Crown Chakra — Pisces & Aquarius</div>
                <div className="text-white/60 mt-1 grid grid-cols-2 gap-1">
                  <div>Pisces → mystical dissolution</div>
                  <div>Aquarius → visionary cognition</div>
                  <div>PI-AQ → cosmic imagination</div>
                  <div>AQ-PI → intuitive patterning</div>
                </div>
              </div>
              {/* Third Eye */}
              <div className="bg-indigo-500/10 border border-indigo-500/15 rounded-lg p-2.5 text-[10px]">
                <div className="text-indigo-300 font-bold">🔮 Third Eye Chakra — Scorpio & Sagittarius</div>
                <div className="text-white/60 mt-1 grid grid-cols-2 gap-1">
                  <div>Scorpio → deep perception, shadow sight</div>
                  <div>Sagittarius → meaning-vision, philosophical clarity</div>
                  <div>SC-SA → truth-intuition</div>
                  <div>SA-SC → depth-intuition</div>
                </div>
              </div>
              {/* Throat */}
              <div className="bg-sky-500/10 border border-sky-500/15 rounded-lg p-2.5 text-[10px]">
                <div className="text-sky-300 font-bold">🗣️ Throat Chakra — Gemini & Virgo</div>
                <div className="text-white/60 mt-1 grid grid-cols-2 gap-1">
                  <div>Gemini → communication, messaging</div>
                  <div>Virgo → refined expression, analytical clarity</div>
                  <div>GE-CA → emotional language</div>
                  <div>VI-LI → harmonized communication</div>
                </div>
              </div>
              {/* Heart */}
              <div className="bg-emerald-500/10 border border-emerald-500/15 rounded-lg p-2.5 text-[10px]">
                <div className="text-emerald-300 font-bold">💚 Heart Chakra — Cancer & Leo</div>
                <div className="text-white/60 mt-1 grid grid-cols-2 gap-1">
                  <div>Cancer → emotional bonding</div>
                  <div>Leo → expressive love, vitality</div>
                  <div>CA-LE → protective devotion</div>
                  <div>LE-VI → loyal refinement</div>
                </div>
              </div>
              {/* Solar Plexus */}
              <div className="bg-yellow-500/10 border border-yellow-500/15 rounded-lg p-2.5 text-[10px]">
                <div className="text-yellow-300 font-bold">☀️ Solar Plexus Chakra — Aries & Capricorn</div>
                <div className="text-white/60 mt-1 grid grid-cols-2 gap-1">
                  <div>Aries → will, action, force</div>
                  <div>Capricorn → discipline, structure</div>
                  <div>AR-TA → stabilized will</div>
                  <div>CP-AQ → strategic will</div>
                </div>
              </div>
              {/* Sacral */}
              <div className="bg-orange-500/10 border border-orange-500/15 rounded-lg p-2.5 text-[10px]">
                <div className="text-orange-300 font-bold">🌙 Sacral Chakra — Libra & Taurus</div>
                <div className="text-white/60 mt-1 grid grid-cols-2 gap-1">
                  <div>Libra → relational pleasure, harmony</div>
                  <div>Taurus → sensuality, embodiment</div>
                  <div>LI-SC → magnetic intimacy</div>
                  <div>TA-GE → communicative sensuality</div>
                </div>
              </div>
              {/* Root */}
              <div className="bg-red-500/10 border border-red-500/15 rounded-lg p-2.5 text-[10px]">
                <div className="text-red-300 font-bold">🔴 Root Chakra — Virgo & Taurus</div>
                <div className="text-white/60 mt-1 grid grid-cols-2 gap-1">
                  <div>Virgo → grounding through refinement</div>
                  <div>Taurus → grounding through stability</div>
                  <div>VI-LE → loyal grounding</div>
                  <div>TA-AR → protective grounding</div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Zodiac Meridian Map ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-lime-300 uppercase tracking-wider">Zodiac Meridian Map</h3>
            <p className="text-[12px] text-white/70">
              The 12 signs mapped to the <strong className="text-white">12 classical meridians</strong> of Traditional Chinese Medicine.
              Each meridian governs an organ system and its energetic flow — the zodiac sign that resonates with that flow
              becomes its <strong className="text-lime-300">mythic channel</strong>.
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-slate-800/50 rounded-lg p-2">
                <span className="text-lime-300 font-bold">Lung 肺</span> <span className="text-white/40">—</span> <span className="text-white/80">Libra</span>
                <div className="text-white/50 mt-0.5">Relational breath, harmony, exchange</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2">
                <span className="text-lime-300 font-bold">Large Intestine 大腸</span> <span className="text-white/40">—</span> <span className="text-white/80">Virgo</span>
                <div className="text-white/50 mt-0.5">Refinement, letting go, assimilation</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2">
                <span className="text-lime-300 font-bold">Stomach 胃</span> <span className="text-white/40">—</span> <span className="text-white/80">Leo–Virgo</span>
                <div className="text-white/50 mt-0.5">Vitality digestion, loyal processing</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2">
                <span className="text-lime-300 font-bold">Spleen 脾</span> <span className="text-white/40">—</span> <span className="text-white/80">Cancer</span>
                <div className="text-white/50 mt-0.5">Nurturing, emotional nourishment, belonging</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2">
                <span className="text-lime-300 font-bold">Heart 心</span> <span className="text-white/40">—</span> <span className="text-white/80">Cancer–Gemini</span>
                <div className="text-white/50 mt-0.5">Emotional rhythm + communication</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2">
                <span className="text-lime-300 font-bold">Small Intestine 小腸</span> <span className="text-white/40">—</span> <span className="text-white/80">Virgo–Libra</span>
                <div className="text-white/50 mt-0.5">Sorting truth from noise, discernment</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2">
                <span className="text-lime-300 font-bold">Bladder 膀胱</span> <span className="text-white/40">—</span> <span className="text-white/80">Capricorn</span>
                <div className="text-white/50 mt-0.5">Endurance, structure, reserves</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2">
                <span className="text-lime-300 font-bold">Kidney 腎</span> <span className="text-white/40">—</span> <span className="text-white/80">Scorpio</span>
                <div className="text-white/50 mt-0.5">Depth, fear, survival intuition, willpower</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2">
                <span className="text-lime-300 font-bold">Pericardium 心包</span> <span className="text-white/40">—</span> <span className="text-white/80">Cancer–Leo</span>
                <div className="text-white/50 mt-0.5">Emotional protection, heart guardian</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2">
                <span className="text-lime-300 font-bold">Triple Burner 三焦</span> <span className="text-white/40">—</span> <span className="text-white/80">Sagittarius</span>
                <div className="text-white/50 mt-0.5">Meaning, expansion, heat regulation</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2">
                <span className="text-lime-300 font-bold">Gallbladder 膽</span> <span className="text-white/40">—</span> <span className="text-white/80">Aries</span>
                <div className="text-white/50 mt-0.5">Decision, courage, initiation</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2">
                <span className="text-lime-300 font-bold">Liver 肝</span> <span className="text-white/40">—</span> <span className="text-white/80">Leo</span>
                <div className="text-white/50 mt-0.5">Vitality, regeneration, emotional flow</div>
              </div>
            </div>
            <p className="text-[11px] text-white/40">
              The meridian map bridges Wu Xing (Five Element) medicine with the zodiac's mythic architecture.
              Each meridian-sign pairing reflects the shared energetic function — not surface anatomy, but Qi flow.
            </p>
          </section>

          {/* ── Organ Narrative Panels ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-orange-300 uppercase tracking-wider">Organ Narrative Panels — Attachment & Regulation Atlas</h3>
            <p className="text-[12px] text-white/70">
              Each of the 36 sub-organs has been profiled against all 35 others, producing <strong className="text-white">1,296 directional panels</strong>.
              Every panel captures <strong className="text-orange-300">attachment pattern, stress response, cognitive-behavioral layer, mythic name, and felt sense</strong>.
              Below is the atlas of completed organ identities and their strongest pairings.
            </p>
            <p className="text-[11px] text-white/40">
              Primary model: Attachment & Regulation. Secondary: Cognitive-Behavioral. Tertiary: Jungian Archetypal.
              Hybrid Score = 0.6 × Matrix + 0.4 × Organ Synergy. All 1,296 panels complete (36 × 36).
            </p>

            {/* Row identity cards */}
            <div className="space-y-2 text-[10px]">

              {/* Row 2 — Tendons */}
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-300 font-bold">Row 2</span>
                  <span className="text-white font-semibold">Tendons</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 italic">The Bowstring</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/40">Aries-Taurus</span>
                </div>
                <div className="text-white/60 mb-1">Tension, restraint, precision, micro-control, boundary-setting</div>
                <div className="text-white/40">
                  <span className="text-orange-300/70">Top:</span> Weaver+Bowstring (88A) · Purifier+Bowstring (80B) · Sentinel+Bowstring (80B)
                </div>
                <div className="text-white/30 mt-0.5 italic">"Feels like inner discipline holding steady"</div>
              </div>

              {/* Row 3 — Rib Cage */}
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-300 font-bold">Row 3</span>
                  <span className="text-white font-semibold">Rib Cage</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 italic">The Shield</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/40">Taurus-Aries</span>
                </div>
                <div className="text-white/60 mb-1">Containment, protection, emotional armor, structural safety</div>
                <div className="text-white/40">
                  <span className="text-orange-300/70">Top:</span> Shield+Listener (88A) · Shield+Heart-Pillar (90A) · Shield+Sentinel (92A) · Shield+Purifier (90A)
                </div>
                <div className="text-white/30 mt-0.5 italic">"Feels like your truth held safely inside a strong frame"</div>
              </div>

              {/* Row 4 — Femur */}
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-300 font-bold">Row 4</span>
                  <span className="text-white font-semibold">Femur</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 italic">The Pillar</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/40">Taurus</span>
                </div>
                <div className="text-white/60 mb-1">Grounding, stability, weight-bearing, long-term endurance</div>
                <div className="text-white/40">
                  <span className="text-orange-300/70">S-tier:</span> Pillar+Listener (92A) · Pillar+Earth-Column (95S) · Pillar+Purifier (95S) · Pillar+Heart-Forge (90A)
                </div>
                <div className="text-white/30 mt-0.5 italic">"Feels like your whole body exhaling into the earth"</div>
              </div>

              {/* Row 5 — Spinal Ribs / Pelvis */}
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-300 font-bold">Row 5</span>
                  <span className="text-white font-semibold">Spinal Ribs</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 italic">The Hinge</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/40">Taurus-Gemini</span>
                </div>
                <div className="text-white/60 mb-1">Mobility, leverage, locomotion, directional will, momentum</div>
                <div className="text-white/40">
                  <span className="text-orange-300/70">S-tier:</span> Hinge+Pillar (95S) · Hinge+Heart-Forge (95S) · Hinge+Sun-Forge (95S) · Hinge+Wind-Chambers (95S)
                </div>
                <div className="text-white/30 mt-0.5 italic">"Feels like emotion pushing you forward with purpose"</div>
              </div>

              {/* Row 6 — Peripheral Nerves / Gyroscope */}
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-300 font-bold">Row 6</span>
                  <span className="text-white font-semibold">Peripheral Nerves</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 italic">The Gyroscope</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/40">Gemini-Taurus</span>
                </div>
                <div className="text-white/60 mb-1">Rotational stability, torque, balance, midline correction, dynamic equilibrium</div>
                <div className="text-white/40">
                  <span className="text-orange-300/70">S-tier:</span> Twin Gyroscopes (95S) · Gyro+Earth-Column (95S) · Gyro+Wind-Chambers (95S) · Gyro+Purifier (95S)
                </div>
                <div className="text-white/30 mt-0.5 italic">"Feels like your entire center stabilizing in 360 degrees"</div>
              </div>

              {/* Row 7 — Synapses / Rudder */}
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-300 font-bold">Row 7</span>
                  <span className="text-white font-semibold">Synapses</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 italic">The Rudder</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/40">Gemini</span>
                </div>
                <div className="text-white/60 mb-1">Directional intelligence, trajectory, aiming, orientation, forward projection</div>
                <div className="text-white/40">
                  <span className="text-orange-300/70">S-tier:</span> Rudder+Gyroscope (95S) · Rudder+Heart-Forge (95S) · Rudder+Sun-Forge (95S) · Rudder+Purifier (95S)
                </div>
                <div className="text-white/30 mt-0.5 italic">"Feels like your entire being aligning toward a single direction"</div>
              </div>

              {/* Row 8 — Vagus Nerve / Antenna */}
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-300 font-bold">Row 8</span>
                  <span className="text-white font-semibold">Vagus Nerve</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 italic">The Antenna</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/40">Gemini-Cancer</span>
                </div>
                <div className="text-white/60 mb-1">Signal projection, social orientation, relational positioning, identity broadcasting</div>
                <div className="text-white/40">
                  <span className="text-orange-300/70">S-tier:</span> Antenna+Heart-Forge (95S) · Antenna+Sun-Forge (95S) · Antenna+Wind-Chambers (95S) · Antenna+Purifier (95S)
                </div>
                <div className="text-white/30 mt-0.5 italic">"Feels like emotion radiating outward as presence"</div>
              </div>

              {/* Row 9 — SA Node / Broadcast Tower */}
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-300 font-bold">Row 9</span>
                  <span className="text-white font-semibold">SA Node</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 italic">The Broadcast Tower</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/40">Cancer-Gemini</span>
                </div>
                <div className="text-white/60 mb-1">Core truth, emotional coherence, front-facing identity, embodied honesty</div>
                <div className="text-white/40">
                  <span className="text-orange-300/70">S-tier:</span> Pillar+Shield (95S) · Pillar+Listener (95S) · Pillar+Heart-Forge (95S) · Pillar+Gyroscope (95S)
                </div>
                <div className="text-white/30 mt-0.5 italic">"Feels like your truth relaxing into place"</div>
              </div>

              {/* Row 10 — Left Ventricle / Furnace */}
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-300 font-bold">Row 10</span>
                  <span className="text-white font-semibold">Left Ventricle</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 italic">The Furnace</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/40">Cancer</span>
                </div>
                <div className="text-white/60 mb-1">Will-pressure, inner fire, personal power, emotional propulsion</div>
                <div className="text-white/40">
                  <span className="text-orange-300/70">S+:</span> Furnace+Sun-Forge (98S+) · Furnace+Wind-Chambers (98S+) · Furnace+Earth-Column (98S+)
                </div>
                <div className="text-white/30 mt-0.5 italic">"Feels like a blast furnace igniting behind your sternum"</div>
              </div>

              {/* Row 11 — Right Ventricle / Hearth */}
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-300 font-bold">Row 11</span>
                  <span className="text-white font-semibold">Right Ventricle</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 italic">The Hearth</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/40">Cancer-Leo</span>
                </div>
                <div className="text-white/60 mb-1">Emotional nourishment, sweetness, buffering, metabolic empathy, internal soothing</div>
                <div className="text-white/40">
                  <span className="text-orange-300/70">S-tier:</span> Hearth+Listener (95S) · Hearth+Sun-Forge (95S) · Hearth+Wind-Chambers (95S) · Hearth+Earth-Column (95S)
                </div>
                <div className="text-white/30 mt-0.5 italic">"Feels like your whole chest exhaling into warmth"</div>
              </div>

              {/* Row 12 — Hepatic Portal / Gate */}
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-300 font-bold">Row 12</span>
                  <span className="text-white font-semibold">Hepatic Portal</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 italic">The Gate</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/40">Leo-Cancer</span>
                </div>
                <div className="text-white/60 mb-1">Emotional boundaries, filtration, discernment, subtle safety, emotional selectivity</div>
                <div className="text-white/40">
                  <span className="text-orange-300/70">S+:</span> Gate+Purifier (98S+) · <span className="text-orange-300/70">S:</span> Gate+Shield (95S) · Gate+Sun-Forge (95S) · Gate+Weaver (95S)
                </div>
                <div className="text-white/30 mt-0.5 italic">"Feels like emotional heaviness draining while clarity returns"</div>
              </div>

              {/* Row 13 — Liver Core / Inner Sun */}
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-300 font-bold">Row 13</span>
                  <span className="text-white font-semibold">Liver Core</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 italic">The Inner Sun</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/40">Leo</span>
                </div>
                <div className="text-white/60 mb-1">Central vitality, radiance, courage, creative will, emotional heat</div>
                <div className="text-white/40">
                  <span className="text-orange-300/70">SS:</span> Sun-Throne (100) · <span className="text-orange-300/70">S+:</span> Hero (98) · Heart-Forge of Fire (98) · Solar Column (98) · Flame-Bearers (98)
                </div>
                <div className="text-white/30 mt-0.5 italic">"Feels like 'this is me' as a warm star"</div>
              </div>

              {/* Row 14 — Bile Ducts / Arrow */}
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-300 font-bold">Row 14</span>
                  <span className="text-white font-semibold">Bile Ducts</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 italic">The Arrow</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/40">Leo-Virgo</span>
                </div>
                <div className="text-white/60 mb-1">Willpower, action-instinct, momentum, pressure-release, emotional propulsion</div>
                <div className="text-white/40">
                  <span className="text-orange-300/70">S+:</span> Arrow+Sun-Forge (98) · Arrow+Earth-Column (98) · <span className="text-orange-300/70">S:</span> Arrow+Weaver (95) · Arrow+Strategist (95)
                </div>
                <div className="text-white/30 mt-0.5 italic">"Feels like heat turning into forward thrust"</div>
              </div>

              {/* Row 15 — Stomach / Blade */}
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-300 font-bold">Row 15</span>
                  <span className="text-white font-semibold">Stomach</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 italic">The Blade</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/40">Virgo-Leo</span>
                </div>
                <div className="text-white/60 mb-1">Precision, timing, tactical decision-making, micro-courage, emotional sharpness</div>
                <div className="text-white/40">
                  <span className="text-orange-300/70">S+:</span> Blade+Spark (98) · Blade+Sun-Forge (98) · Blade+Ember-Forge (98) · Blade+Earth-Column (98) · Blade+Sentinel (98)
                </div>
                <div className="text-white/30 mt-0.5 italic">"Feels like your thoughts slicing through noise"</div>
              </div>

              {/* Row 16 — Small Intestine / Meaning-Engine */}
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-300 font-bold">Row 16</span>
                  <span className="text-white font-semibold">Small Intestine</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 italic">The Meaning-Engine</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/40">Virgo</span>
                </div>
                <div className="text-white/60 mb-1">Meaning-processing, motivational fuel, purpose-metabolism, existential digestion</div>
                <div className="text-white/40">
                  <span className="text-orange-300/70">S+:</span> Sun-Interpreter (98) · Weaver of Meaning (98) · Ember-Forge of Insight (98) · Earth-Column of Purpose (98)
                </div>
                <div className="text-white/30 mt-0.5 italic">"Feels like complexity breaking into understandable pieces"</div>
              </div>

              {/* Row 17 — Large Intestine / Ignition */}
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-300 font-bold">Row 17</span>
                  <span className="text-white font-semibold">Large Intestine</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 italic">The Ignition Engine</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/40">Virgo-Libra</span>
                </div>
                <div className="text-white/60 mb-1">Activation, mobilization, ignition, pressure-response, survival clarity</div>
                <div className="text-white/40">
                  <span className="text-orange-300/70">SS:</span> Spark-Storm (100) · Ember-Forge of Fire (100) · Earth-Column of Fire (100) · Sentinel of Fire (100)
                </div>
                <div className="text-white/30 mt-0.5 italic">"Feels like your thoughts turning into lightning"</div>
              </div>

              {/* Row 18 — Bronchioles / Inner Guidance */}
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-300 font-bold">Row 18</span>
                  <span className="text-white font-semibold">Bronchioles</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 italic">The Inner Guidance</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/40">Libra-Virgo</span>
                </div>
                <div className="text-white/60 mb-1">Trust, innocence, moral intuition, energetic coherence, permission to open</div>
                <div className="text-white/40">
                  <span className="text-orange-300/70">SS:</span> Heart-Calmer (100) · Sentinel of Innocence (100) · <span className="text-orange-300/70">S+:</span> Story-Keeper (98) · Earth-Column of Innocence (98)
                </div>
                <div className="text-white/30 mt-0.5 italic">"Feels like your chest relaxing into trust"</div>
              </div>

              {/* Row 19 — Lung Lobes / Perception Engine */}
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-300 font-bold">Row 19</span>
                  <span className="text-white font-semibold">Lung Lobes</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 italic">The Perception Engine</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/40">Libra</span>
                </div>
                <div className="text-white/60 mb-1">Emotional filtration, intuitive patterning, subtle vigilance, empathic boundaries</div>
                <div className="text-white/40">
                  <span className="text-orange-300/70">SS:</span> Ember-Forge of Perception (100) · Sentinel of Signals (100) · <span className="text-orange-300/70">S+:</span> Whisper-Sensor (98) · Story-Weaver (98)
                </div>
                <div className="text-white/30 mt-0.5 italic">"Feels like tiny sparks of emotional insight lighting up everywhere"</div>
              </div>

              {/* Row 20 — Alveoli / Purification Engine */}
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-300 font-bold">Row 20</span>
                  <span className="text-white font-semibold">Alveoli</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 italic">The Purification Engine</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/40">Libra-Scorpio</span>
                </div>
                <div className="text-white/60 mb-1">Emotional detox, boundary filtration, energetic hygiene, relational purification</div>
                <div className="text-white/40">
                  <span className="text-orange-300/70">SS:</span> Ember-Forge Purifier (100) · Guardians of Purification (100) · Sentinel-Purifier (100)
                </div>
                <div className="text-white/30 mt-0.5 italic">"Feels like tiny sparks of clarity lighting up everywhere"</div>
              </div>

              {/* Row 21 — Plasma / Flow Engine */}
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-300 font-bold">Row 21</span>
                  <span className="text-white font-semibold">Plasma</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 italic">The Flow Engine</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/40">Scorpio-Libra</span>
                </div>
                <div className="text-white/60 mb-1">Emotional circulation, distributed intelligence, micro-detox, flow-state purification</div>
                <div className="text-white/40">
                  <span className="text-orange-300/70">SS:</span> Ember-Forge Stream (100) · Twin Rivers of Purity (100) · <span className="text-orange-300/70">S+:</span> Earth-River (98) · Sun-River (98)
                </div>
                <div className="text-white/30 mt-0.5 italic">"Feels like clarity being filtered and circulated simultaneously"</div>
              </div>

            </div>

            {/* Progression narrative */}
            <div className="bg-orange-500/10 border border-orange-500/15 rounded-lg p-3 text-[11px] text-white/60 space-y-1">
              <div className="text-orange-300 font-bold text-xs mb-1">The Organ Progression — From Flow to Blade</div>
              <div>Row 2 <span className="text-white/40">→</span> <strong className="text-white/80">Bowstring</strong> — tension, restraint, boundaries</div>
              <div>Row 3 <span className="text-white/40">→</span> <strong className="text-white/80">Shield</strong> — protection, containment, emotional armor</div>
              <div>Row 4 <span className="text-white/40">→</span> <strong className="text-white/80">Pillar</strong> — grounding, stability, weight-bearing</div>
              <div>Row 5 <span className="text-white/40">→</span> <strong className="text-white/80">Hinge</strong> — mobility, leverage, turning stability into movement</div>
              <div>Row 6 <span className="text-white/40">→</span> <strong className="text-white/80">Gyroscope</strong> — rotational stability, balance, midline correction</div>
              <div>Row 7 <span className="text-white/40">→</span> <strong className="text-white/80">Rudder</strong> — directional intelligence, trajectory, aim</div>
              <div>Row 8 <span className="text-white/40">→</span> <strong className="text-white/80">Antenna</strong> — social orientation, identity broadcasting, presence</div>
              <div>Row 9 <span className="text-white/40">→</span> <strong className="text-white/80">Broadcast Tower</strong> — core truth, emotional coherence, embodied honesty</div>
              <div>Row 10 <span className="text-white/40">→</span> <strong className="text-white/80">Furnace</strong> — will-pressure, inner fire, personal power</div>
              <div>Row 11 <span className="text-white/40">→</span> <strong className="text-white/80">Hearth</strong> — emotional nourishment, sweetness, internal soothing</div>
              <div>Row 12 <span className="text-white/40">→</span> <strong className="text-white/80">Gate</strong> — emotional boundaries, filtration, discernment</div>
              <div>Row 13 <span className="text-white/40">→</span> <strong className="text-white/80">Inner Sun</strong> — central vitality, radiance, creative will</div>
              <div>Row 14 <span className="text-white/40">→</span> <strong className="text-white/80">Arrow</strong> — willpower, action-instinct, momentum, pressure-release</div>
              <div>Row 15 <span className="text-white/40">→</span> <strong className="text-white/80">Blade</strong> — precision, timing, tactical decision-making, micro-courage</div>
              <div>Row 16 <span className="text-white/40">→</span> <strong className="text-white/80">Meaning-Engine</strong> — purpose-metabolism, existential nutrition, coherence</div>
              <div>Row 17 <span className="text-white/40">→</span> <strong className="text-white/80">Ignition</strong> — activation, mobilization, pressure-response, survival clarity</div>
              <div>Row 18 <span className="text-white/40">→</span> <strong className="text-white/80">Inner Guidance</strong> — trust, innocence, moral intuition, permission to open</div>
              <div>Row 19 <span className="text-white/40">→</span> <strong className="text-white/80">Perception Engine</strong> — emotional filtration, intuitive patterning, empathic boundaries</div>
              <div>Row 20 <span className="text-white/40">→</span> <strong className="text-white/80">Purification Engine</strong> — emotional detox, boundary filtration, energetic hygiene</div>
              <div>Row 21 <span className="text-white/40">→</span> <strong className="text-white/80">Flow Engine</strong> — emotional circulation, distributed intelligence, micro-detox</div>
              <div>Row 22 <span className="text-white/40">→</span> <strong className="text-white/80">Genesis Engine</strong> — identity-seed, vitality origin, ancestral coding, deep replenishment</div>
              <div>Row 23 <span className="text-white/40">→</span> <strong className="text-white/80">Transmission Engine</strong> — luminous awareness, connective intelligence, identity-signal distribution</div>
              <div>Row 24 <span className="text-white/40">→</span> <strong className="text-white/80">Lower Diaphragm / Root-Tide</strong> — grounded breath, deep descent, pelvic pressure, emotional settling</div>
              <div>Row 25 <span className="text-white/40">→</span> <strong className="text-white/80">Diaphragm Core / Furnace-Pulse</strong> — breath rhythm, pacing, vitality modulation, pressure cycles</div>
              <div>Row 26 <span className="text-white/40">→</span> <strong className="text-white/80">Upper Diaphragm / Sky-Tide</strong> — expressive breath, chest lift, emotional expansion, presence</div>
              <div>Row 27 <span className="text-white/40">→</span> <strong className="text-white/80">Lumbar Spine / Earth-Column</strong> — grounded will, backbone, long-arc stability, core support</div>
              <div>Row 28 <span className="text-white/40">→</span> <strong className="text-white/80">Thoracic Spine / Heart-Pillar</strong> — emotional posture, courage, uprightness, moral stance</div>
              <div>Row 29 <span className="text-white/40">→</span> <strong className="text-white/80">Cervical Spine / Watchtower</strong> — head-body bridge, orientation, focus, directional intelligence</div>
              <div>Row 30 <span className="text-white/40">→</span> <strong className="text-white/80">Prefrontal Cortex / Solar Strategist</strong> — executive function, planning, long-arc decisions, purpose-into-plan</div>
              <div>Row 31 <span className="text-white/40">→</span> <strong className="text-white/80">Neocortex / Solar Scholar</strong> — abstraction, analysis, symbolic reasoning, conceptual synthesis</div>
              <div>Row 32 <span className="text-white/40">→</span> <strong className="text-white/80">Default Mode Network / Dream-Mirror</strong> — self-narrative, identity coherence, inner-world simulation</div>
              <div>Row 33 <span className="text-white/40">→</span> <strong className="text-white/80">Lymph Nodes / Solar Bard</strong> — emotional filtration, symbolic purification, psychic hygiene</div>
              <div>Row 34 <span className="text-white/40">→</span> <strong className="text-white/80">Lymph Fluid / Solar Current</strong> — subtle emotional flow, intuition, symbolic resonance, relational sensing</div>
              <div>Row 35 <span className="text-white/40">→</span> <strong className="text-white/80">Immune Signaling / Solar Sentinel</strong> — threat detection, boundary intelligence, truth-from-noise, early warning</div>
              <div className="pt-1 border-t border-orange-500/10 text-emerald-300/60 font-semibold">
                All 36 organ rows complete. 1,296 narrative panels captured (36 × 36). The Zodiac Body Atlas is a living, breathing metaphysical organism.
              </div>
            </div>

            {/* Mythic name index */}
            <div className="text-[11px] text-white/50 font-semibold mb-1">Recurring Mythic Partners</div>
            <div className="grid grid-cols-3 gap-1.5 text-[10px] text-white/60">
              <div><span className="text-orange-300/70 font-semibold">The Listener</span> — Vagus Nerve (calm regulation)</div>
              <div><span className="text-orange-300/70 font-semibold">The Heart-Forge</span> — Left Ventricle (emotional pressure)</div>
              <div><span className="text-orange-300/70 font-semibold">The Sun-Forge</span> — Liver Core (vitality + heat)</div>
              <div><span className="text-orange-300/70 font-semibold">The Earth-Column</span> — Lumbar Spine (core support)</div>
              <div><span className="text-orange-300/70 font-semibold">The Wind-Chambers</span> — Lung Lobes (breath expansion)</div>
              <div><span className="text-orange-300/70 font-semibold">The Purifier</span> — Lymph Nodes (emotional detox)</div>
              <div><span className="text-orange-300/70 font-semibold">The Sentinel</span> — Immune Signaling (threat response)</div>
              <div><span className="text-orange-300/70 font-semibold">The Weaver</span> — Small Intestine (complexity processing)</div>
              <div><span className="text-orange-300/70 font-semibold">The Strategist</span> — Prefrontal Cortex (executive planning)</div>
              <div><span className="text-orange-300/70 font-semibold">The Dreamer</span> — Default Mode Network (self-narrative)</div>
              <div><span className="text-orange-300/70 font-semibold">The Scholar</span> — Neocortex (abstract cognition)</div>
              <div><span className="text-orange-300/70 font-semibold">The Watchtower</span> — Cervical Spine (head-body awareness)</div>
            </div>
          </section>

          {/* ── 36-Row Cosmogram ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">36-Row Cosmogram — The Macro-Architecture</h3>
            <p className="text-[12px] text-white/70">
              The <strong className="text-white">bird's-eye view</strong> of the entire Zodiac Body Atlas.
              36 organ-rows grouped into <strong className="text-cyan-300">6 macro-systems</strong>, each one a self-contained chapter,
              all interlocking into a single living organism. The cathedral dome above the cathedral.
            </p>

            {/* 6 Macro-Systems — data-driven from organCosmogram.js */}
            <div className="space-y-2">
              {MACRO_SYSTEMS.map((sys) => {
                const ui = COSMOGRAM_SYSTEM_UI[sys.id];
                const rows = COSMOGRAM_ROWS.filter((r) => sys.rows.includes(r.row));
                const rowRange = `${sys.rows[0]}–${sys.rows[sys.rows.length - 1]}`;
                return (
                  <div key={sys.id} className={`${ui.card} border rounded-lg p-3`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-3 h-3 rounded-full ${ui.dot}`} />
                      <span className={`${ui.label} font-bold text-xs`}>MODULE {ui.module} — {sys.name.toUpperCase()}</span>
                      <span className="text-white/30 text-[10px]">Rows {rowRange}</span>
                    </div>
                    <div className="text-[10px] text-white/60 mb-1.5">{ui.tagline}</div>
                    <div className="grid grid-cols-3 gap-1 text-[9px]">
                      {rows.map((r) => (
                        <div key={r.row}>
                          <span className={ui.rowTag}>R{r.row}</span>{' '}
                          <span className="text-white/50">{r.mythicName.replace(/^The /, '')}</span>{' '}
                          <span className="text-white/30">{r.current}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* System Transitions */}
            <div className="bg-slate-800/60 rounded-lg p-3 text-[10px] text-white/60 space-y-1">
              <div className="text-cyan-300 font-bold text-xs mb-1">System Transitions — The Grand Arc</div>
              <div><span className="text-blue-300">Flow</span> <span className="text-white/30">→</span> <span className="text-red-300">Force</span>: readiness becomes power, rhythm, and circulation</div>
              <div><span className="text-red-300">Force</span> <span className="text-white/30">→</span> <span className="text-amber-300">Fire</span>: vitality becomes metabolic fire, precision, and meaning</div>
              <div><span className="text-amber-300">Fire</span> <span className="text-white/30">→</span> <span className="text-cyan-300">Breath</span>: transformation becomes trust, perception, purification, and identity</div>
              <div><span className="text-cyan-300">Breath</span> <span className="text-white/30">→</span> <span className="text-purple-300">Structure</span>: perception becomes architecture — contact, continuity, protection, orientation</div>
              <div><span className="text-purple-300">Structure</span> <span className="text-white/30">→</span> <span className="text-emerald-300">Signal</span>: architecture becomes consciousness — ignition, essence, truth, discernment</div>
              <div><span className="text-emerald-300">Signal</span> <span className="text-white/30">→</span> <span className="text-blue-300">Flow</span>: the sieve feeds back into the ocean, and the organism begins again</div>
              <div className="pt-1 border-t border-white/5 text-white/40 italic">
                From flow to precision. From tension to truth. From muscle to mind. The zodiac as a living body.
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
