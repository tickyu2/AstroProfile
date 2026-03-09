/**
 * BaZi Bracelet — Elemental Balancing Page
 *
 * Month-by-month element analysis showing how incoming year/month pillars
 * shift the user's element balance, with clash detection and stone
 * recommendations for gemstone bracelets.
 *
 * Journey Metaphor:
 *   Driver   = Day Master
 *   Car      = Natal element mix (seasonality-adjusted)
 *   Climate  = Annual pillar (+20%)
 *   Weather  = Monthly pillar (+10%)
 *   Road     = Clashes, harms, punishments
 *   Bracelet = Survival kit (gemstones)
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';
import { calculateBaZi } from '../utils/baziCalculator';
import { calculateElementsWithPillarWeights } from '../utils/baziEngine';
import { applySeasonality, getSeasonalWeights } from '../utils/baziSeasonality';
import { computeYearMatrix } from '../utils/braceletEngine';
import {
  BaziThemeProvider,
  PersonalityRadar,
  FourPillarsGrid,
} from '../components/bazi';
import FloatingMdWindow from '../components/shared/FloatingMdWindow';

// ============================================================================
// CONSTANTS
// ============================================================================

const ELEM_COLORS = {
  Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#a1a1aa', Water: '#3b82f6',
};

const DANGER_STYLES = {
  safe:    { bg: 'bg-green-500/20',  text: 'text-green-400',  label: 'Safe',    icon: '🟢' },
  caution: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Caution', icon: '🟡' },
  warning: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'Warning', icon: '🟠' },
  danger:  { bg: 'bg-red-500/20',    text: 'text-red-400',    label: 'Danger',  icon: '🔴' },
};

const SEASON_COLORS = {
  Spring: { dark: 'border-green-700 bg-green-900/20',  light: 'border-green-300 bg-green-50' },
  Summer: { dark: 'border-red-700 bg-red-900/20',      light: 'border-red-300 bg-red-50' },
  Autumn: { dark: 'border-amber-700 bg-amber-900/20',  light: 'border-amber-300 bg-amber-50' },
  Winter: { dark: 'border-blue-700 bg-blue-900/20',     light: 'border-blue-300 bg-blue-50' },
};

const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

// Seasonal strength multipliers — traditional 旺相休囚死 doctrine
const SEASONAL_STRENGTH = {
  Spring: { Wood: 1.0, Fire: 0.6, Earth: 0.4, Metal: 0.2, Water: 0.4 },
  Summer: { Wood: 0.6, Fire: 1.0, Earth: 0.5, Metal: 0.3, Water: 0.2 },
  Autumn: { Wood: 0.3, Fire: 0.4, Earth: 0.6, Metal: 1.0, Water: 0.5 },
  Winter: { Wood: 0.4, Fire: 0.2, Earth: 0.5, Metal: 0.6, Water: 1.0 },
};

const STRENGTH_LABELS = {
  1.0: '旺 Prosperous', 0.6: '相 Phase', 0.5: '休 Resting',
  0.4: '囚 Imprisoned', 0.3: '囚 Imprisoned', 0.2: '死 Dead',
};

// ============================================================================
// STEM & BRANCH NARRATIVE LORE — for month identity & emotional interpretation
// ============================================================================

const STEM_LORE = {
  '甲': { en: 'Yang Wood',  nature: 'Great Tree — ancient oaks, deep roots, upright and principled' },
  '乙': { en: 'Yin Wood',   nature: 'Soft Vine — spring grass, flowers, flexible and emotional' },
  '丙': { en: 'Yang Fire',  nature: 'Blazing Sun — radiant, direct, the sun at its zenith' },
  '丁': { en: 'Yin Fire',   nature: 'Candle Flame — lanterns, warm hearth, focused gentle glow' },
  '戊': { en: 'Yang Earth', nature: 'Mountain — boulders, great walls, immovable bedrock' },
  '己': { en: 'Yin Earth',  nature: 'Garden Soil — clay, fertile ground, quiet nourishment' },
  '庚': { en: 'Yang Metal', nature: 'Heavy Steel — iron swords, fortress gates, commanding force' },
  '辛': { en: 'Yin Metal',  nature: 'Fine Jewelry — silver needles, precision, delicate refinement' },
  '壬': { en: 'Yang Water', nature: 'Deep Ocean — vast waves, winter lakes, overwhelming depth' },
  '癸': { en: 'Yin Water',  nature: 'Gentle Rain — morning dew, mist, subtle penetration' },
};

const BRANCH_LORE = {
  '子': { element: 'Water', season: 'Winter', nature: 'cold depth, hidden potential, midnight stillness' },
  '丑': { element: 'Earth', season: 'Winter', nature: 'cold dense Earth holding Water, slow and heavy' },
  '寅': { element: 'Wood',  season: 'Spring', nature: 'Yang Wood bursting upward, first spark of Spring' },
  '卯': { element: 'Wood',  season: 'Spring', nature: 'pure Yin Wood, heart of Spring, soft spreading growth' },
  '辰': { element: 'Earth', season: 'Spring', nature: 'wet Earth with hidden Water and Wood, transformative' },
  '巳': { element: 'Fire',  season: 'Summer', nature: 'coiled Fire with hidden Metal, intense and concealed' },
  '午': { element: 'Fire',  season: 'Summer', nature: 'pure Fire at maximum heat, the sun at its zenith' },
  '未': { element: 'Earth', season: 'Summer', nature: 'dry hot Earth, Fire-to-Earth transition, smoldering' },
  '申': { element: 'Metal', season: 'Autumn', nature: 'Yang Metal emerging, sharp precision and clarity' },
  '酉': { element: 'Metal', season: 'Autumn', nature: 'pure Yin Metal, heart of Autumn, refinement and cutting' },
  '戌': { element: 'Earth', season: 'Autumn', nature: 'dry Earth with hidden Fire and Metal, loyal and grounding' },
  '亥': { element: 'Water', season: 'Winter', nature: 'Yang Water beginning, depth, flow, and nurturing' },
};

const DANGER_EMOTIONS = {
  danger:  'Significant pressure and volatility. Heightened sensitivity, difficulty making clear decisions, and a sense of instability. This is a month where the road breaks open.',
  warning: 'Rising internal pressure. Subtle frustrations rather than dramatic crises, but the cumulative weight can be draining. A month where movement is possible but the ground feels sticky.',
  caution: 'Structural tension, not chaos. There is movement but it is effortful. Some heaviness, but also moments of clarity. The road holds, but watch for soft spots.',
  safe:    'A supportive month. Movement feels natural, clarity returns, and there is a sense of ease and flow. The car moves without resistance.',
};

function getMonthNarrative(snapshot) {
  const stemInfo = STEM_LORE[snapshot.monthStem] || {};
  const branchInfo = BRANCH_LORE[snapshot.monthBranch] || {};

  // 1. Identity
  const identity = `${stemInfo.en || snapshot.monthStem} ${snapshot.branchAnimal} — ${stemInfo.nature || ''}. The ${snapshot.branchAnimal} (${snapshot.monthBranch}) carries ${branchInfo.nature || 'its own elemental character'}.`;

  // 2. Seasonal overlay
  const seasonElement = branchInfo.element || '';
  const seasonalOverlay = `This month adds +10% ${seasonElement} (${branchInfo.season || ''} energy). Combined with the annual +20% overlay, this shapes how the chart's balance shifts through this period.`;

  // 3. Road conditions
  let roadConditions = '';
  if (snapshot.interactions.length === 0) {
    roadConditions = 'No clash, harm, or punishment this month. The road is clear and the terrain supportive — a rare moment of ease.';
  } else {
    const clashes = snapshot.interactions.filter(i => i.type === 'clash');
    const harms = snapshot.interactions.filter(i => i.type === 'harm');
    const punishments = snapshot.interactions.filter(i => i.type === 'punishment');
    const parts = [];
    if (clashes.length > 0) parts.push(`${clashes.map(c => `${c.branch1}${c.branch2} Clash`).join(', ')} — a head-on collision that shakes the element balance`);
    if (harms.length > 0) parts.push(`${harms.map(h => `${h.branch1}${h.branch2} Harm`).join(', ')} — a slow, corrosive interaction that accumulates over time`);
    if (punishments.length > 0) parts.push(`${punishments.map(p => `${p.branch1}${p.branch2} Punishment`).join(', ')} — structural stress that tightens inward`);
    roadConditions = parts.join('. ') + '.';
  }

  // 4. Shift interpretation
  const shifts = ELEMENTS.map(el => {
    const diff = snapshot.postClash[el] - snapshot.preClash[el];
    if (Math.abs(diff) >= 0.5) {
      return `${el} ${diff > 0 ? 'rises' : 'drops'} from ${snapshot.preClash[el].toFixed(0)}% → ${snapshot.postClash[el].toFixed(0)}%`;
    }
    return null;
  }).filter(Boolean);
  const sorted = [...ELEMENTS].sort((a, b) => snapshot.postClash[b] - snapshot.postClash[a]);
  const dom = sorted[0];
  const shiftText = shifts.length > 0
    ? `${shifts.join('. ')}. ${dom} remains dominant at ${snapshot.postClash[dom].toFixed(0)}%.`
    : `Minimal shift — elements remain stable. ${dom} stays dominant at ${snapshot.postClash[dom].toFixed(0)}%.`;

  // 5. Emotional landscape
  const emotionalText = DANGER_EMOTIONS[snapshot.dangerLevel] || '';

  // 6. Stone reasoning
  let stoneText = '';
  if (snapshot.recommendedStones.length > 0) {
    stoneText = snapshot.recommendedStones.map(r =>
      `${r.stone.name} (${r.stone.polarity} ${r.stone.element}) — ${r.reason}`
    ).join('. ') + '.';
  }
  if (snapshot.yongShen?.forbidden?.length > 0) {
    stoneText += ` Avoid ${snapshot.yongShen.forbidden.join(' & ')} stones — they worsen the imbalance.`;
  }

  return { identity, seasonalOverlay, roadConditions, shiftText, emotionalText, stoneText };
}

// ============================================================================
// MINI ELEMENT BAR COMPONENT
// ============================================================================

function ElementBar({ dist, label, themeMode }) {
  const isDark = themeMode === 'dark';
  return (
    <div className="space-y-0.5">
      {label && (
        <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {label}
        </div>
      )}
      <div className="flex h-3 rounded overflow-hidden gap-px">
        {ELEMENTS.map(el => (
          <div
            key={el}
            style={{
              width: `${Math.max(dist[el], 2)}%`,
              backgroundColor: ELEM_COLORS[el],
              opacity: dist[el] < 10 ? 0.5 : 1,
            }}
            title={`${el}: ${dist[el].toFixed(1)}%`}
          />
        ))}
      </div>
      <div className="flex text-[9px]">
        {ELEMENTS.map(el => (
          <span
            key={el}
            style={{ width: `${Math.max(dist[el], 2)}%`, color: ELEM_COLORS[el] }}
            className="text-center truncate"
          >
            {dist[el].toFixed(0)}%
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MONTH CARD COMPONENT
// ============================================================================

function MonthCard({ snapshot, expanded, onToggle, themeMode }) {
  const isDark = themeMode === 'dark';
  const danger = DANGER_STYLES[snapshot.dangerLevel];
  const stemInfo = STEM_LORE[snapshot.monthStem] || {};
  const narrative = expanded ? getMonthNarrative(snapshot) : null;

  return (
    <div className={`rounded-xl border p-3 ${
      isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {snapshot.monthName}
          </div>
          <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {snapshot.monthStem}{snapshot.monthBranch} {stemInfo.en || ''} {snapshot.branchAnimal}
          </div>
        </div>
        <div className={`text-xs px-2 py-0.5 rounded-full ${danger.bg} ${danger.text}`}>
          {danger.icon} {danger.label} ({snapshot.dangerScore}pts)
        </div>
      </div>

      {/* Brief identity — always visible */}
      <div className={`text-[10px] italic mb-2 leading-snug ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        {stemInfo.nature || ''}.
      </div>

      {/* Pre-Clash Bar */}
      <ElementBar dist={snapshot.preClash} label="Pre-Clash" themeMode={themeMode} />

      {/* Interaction Badges */}
      <div className="flex flex-wrap gap-1 my-1.5">
        {snapshot.interactions.length > 0 ? (
          snapshot.interactions.map((hit, i) => (
            <span
              key={i}
              className={`text-[10px] px-1.5 py-0.5 rounded ${
                hit.type === 'clash'
                  ? 'bg-red-500/20 text-red-400'
                  : hit.type === 'harm'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-orange-500/20 text-orange-400'
              }`}
              title={hit.effect}
            >
              {hit.type === 'clash' ? '⚔️' : hit.type === 'harm' ? '⚠️' : '🔺'}
              {' '}{hit.branch1}{hit.branch2}
            </span>
          ))
        ) : (
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
            isDark ? 'bg-green-500/15 text-green-400' : 'bg-green-50 text-green-600'
          }`}>
            🟢 No Clash, Harm, or Punishment detected this month
          </span>
        )}
      </div>

      {/* Post-Clash Bar */}
      <ElementBar dist={snapshot.postClash} label="Post-Clash" themeMode={themeMode} />

      {/* Stone Recommendations (Yong Shen aware) */}
      {snapshot.recommendedStones.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {snapshot.recommendedStones.map((rec, i) => (
            <span
              key={i}
              className={`text-[10px] px-1.5 py-0.5 rounded-full border ${isDark ? 'border-slate-600' : 'border-slate-300'}`}
              style={{ color: rec.stone.color === '#e8e8e8' ? (isDark ? '#d4d4d8' : '#71717a') : rec.stone.color }}
              title={rec.reason}
            >
              💎 {rec.stone.name}
              <span className={`ml-1 opacity-70`}>({rec.stone.polarity} {rec.stone.element})</span>
            </span>
          ))}
        </div>
      )}

      {/* Forbidden Warning (if Yong Shen detected critical threat) */}
      {snapshot.yongShen?.status === 'critical_imbalance' && snapshot.yongShen.forbidden.length > 0 && (
        <div className={`text-[10px] mt-1.5 px-2 py-1 rounded ${
          isDark ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'
        }`}>
          ⚠️ Avoid {snapshot.yongShen.forbidden.join(' & ')} stones — {snapshot.yongShen.forbidden[1]} feeds {snapshot.yongShen.threat}
        </div>
      )}

      {/* Expand Toggle */}
      <button
        onClick={onToggle}
        className={`w-full mt-2 text-[11px] py-1 rounded ${
          isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100'
        }`}
      >
        {expanded ? '▲ Hide Deep Dive' : '▼ Deep Dive — Identity · Emotion · Reasoning'}
      </button>

      {/* Expanded Narrative + Calculation Steps */}
      {expanded && narrative && (
        <div className={`mt-2 space-y-4 text-xs border-t pt-3 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>

          {/* ── 1. Identity of the Month ── */}
          <div>
            <div className={`font-bold uppercase tracking-wider text-[10px] mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Identity of the Month
            </div>
            <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {narrative.identity}
            </p>
          </div>

          {/* ── 2. Seasonal Overlay ── */}
          <div>
            <div className={`font-bold uppercase tracking-wider text-[10px] mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Seasonal Overlay (+10%)
            </div>
            <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {narrative.seasonalOverlay}
            </p>
          </div>

          {/* ── 3. Road Conditions ── */}
          <div>
            <div className={`font-bold uppercase tracking-wider text-[10px] mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Road Conditions
            </div>
            <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {narrative.roadConditions}
            </p>
          </div>

          {/* ── 4. Pre → Post Clash Shift ── */}
          <div>
            <div className={`font-bold uppercase tracking-wider text-[10px] mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Elemental Shift Interpretation
            </div>
            <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {narrative.shiftText}
            </p>
          </div>

          {/* ── 5. Emotional Landscape ── */}
          <div>
            <div className={`font-bold uppercase tracking-wider text-[10px] mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              What This Month Feels Like
            </div>
            <p className={`leading-relaxed italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {narrative.emotionalText}
            </p>
          </div>

          {/* ── 6. Bracelet Reasoning ── */}
          {narrative.stoneText && (
            <div>
              <div className={`font-bold uppercase tracking-wider text-[10px] mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Bracelet Prescription & Reasoning
              </div>
              <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {narrative.stoneText}
              </p>
            </div>
          )}

          {/* ── Danger Score Highlight ── */}
          <div className={`rounded-lg p-3 flex items-center justify-between ${danger.bg} border ${
            isDark ? 'border-slate-600' : 'border-slate-300'
          }`}>
            <div>
              <div className={`text-xs font-bold ${danger.text}`}>
                {danger.icon} Danger Score: {snapshot.dangerScore} pts → {danger.label}
              </div>
              <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                safe &lt;20 · caution 20–39 · warning 40–59 · danger 60+
              </div>
            </div>
            <div className={`text-2xl font-black ${danger.text}`}>
              {snapshot.dangerScore}
            </div>
          </div>

          {/* ── Raw Calculation Steps (collapsible within) ── */}
          <details className={`text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <summary className="cursor-pointer hover:underline py-1">
              🧮 Show Raw Calculation Steps
            </summary>
            <div className="mt-2 space-y-3">
              {snapshot.steps.map((step, i) => (
                <div key={i}>
                  <div className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    {step.label}
                  </div>
                  <pre className={`whitespace-pre-wrap mt-1 text-[11px] leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {step.detail}
                  </pre>
                  {step.elements && (
                    <div className="mt-1">
                      <ElementBar dist={step.elements} themeMode={themeMode} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SEASON ROW COMPONENT
// ============================================================================

function SeasonRow({ seasonSummary, expandedMonths, setExpandedMonths, themeMode, onMoreInfo }) {
  const isDark = themeMode === 'dark';
  const colors = SEASON_COLORS[seasonSummary.season]?.[isDark ? 'dark' : 'light'] || '';

  return (
    <section className={`rounded-xl border p-4 ${colors}`}>
      {/* Season Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {seasonSummary.emoji} {seasonSummary.season}
          </h3>
          <button
            onClick={() => onMoreInfo(seasonSummary.season)}
            className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-colors ${
              isDark
                ? 'bg-purple-900/20 border border-purple-700/40 text-purple-300 hover:bg-purple-900/40'
                : 'bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100'
            }`}
          >
            Seasonal Multipliers
          </button>
        </div>
        <div className="w-48">
          <ElementBar dist={seasonSummary.average} label="Season Avg" themeMode={themeMode} />
        </div>
      </div>

      {/* 3-column month grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {seasonSummary.months.map(m => (
          <MonthCard
            key={m.monthIndex}
            snapshot={m}
            expanded={!!expandedMonths[m.monthIndex]}
            onToggle={() => setExpandedMonths(prev => ({
              ...prev,
              [m.monthIndex]: !prev[m.monthIndex],
            }))}
            themeMode={themeMode}
          />
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function BaZiBraceletPage() {
  const { profiles, loading } = useProfiles();
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [themeMode, setThemeMode] = useState('dark');
  const [expandedMonths, setExpandedMonths] = useState({});
  const [showRoadTrip, setShowRoadTrip] = useState(false);
  const [showStoneGuide, setShowStoneGuide] = useState(false);
  const [seasonInfoContent, setSeasonInfoContent] = useState(null); // { title, content }

  const isDark = themeMode === 'dark';

  // Selected profile
  const selectedProfile = useMemo(() => {
    return profiles?.find(p => p.id === selectedProfileId) || null;
  }, [profiles, selectedProfileId]);

  // Calculate natal chart
  const chart = useMemo(() => {
    if (!selectedProfile?.birthDate) return null;
    try {
      const [year, month, day] = selectedProfile.birthDate.split('-').map(Number);
      const [hour = 12, minute = 0] = (selectedProfile.birthTime || '12:00').split(':').map(Number);
      const result = calculateBaZi({ year, month, day, hour, minute });
      if (result.error) return null;

      // Re-calculate with pillar weights
      const modularElements = calculateElementsWithPillarWeights(
        result.pillars, [0.05, 0.10, 0.70, 0.15]
      );
      return { ...result, elements: { ...result.elements, ...modularElements } };
    } catch {
      return null;
    }
  }, [selectedProfile]);

  // Natal baseline (seasonality-adjusted)
  const natalBaseline = useMemo(() => {
    if (!chart) return null;
    const rawDist = {
      wood: parseFloat(chart.elements?.percentages?.Wood) || 20,
      fire: parseFloat(chart.elements?.percentages?.Fire) || 20,
      earth: parseFloat(chart.elements?.percentages?.Earth) || 20,
      metal: parseFloat(chart.elements?.percentages?.Metal) || 20,
      water: parseFloat(chart.elements?.percentages?.Water) || 20,
    };
    const monthBranch = chart.pillars?.[1]?.branch?.char || '子';
    const seasonality = applySeasonality(rawDist, monthBranch);
    const adj = seasonality?.adjustedNormalized || rawDist;
    // Convert to capitalized keys for braceletEngine
    return {
      Wood: adj.wood || 20,
      Fire: adj.fire || 20,
      Earth: adj.earth || 20,
      Metal: adj.metal || 20,
      Water: adj.water || 20,
    };
  }, [chart]);

  // Natal branch characters
  const natalBranches = useMemo(() => {
    if (!chart) return null;
    return {
      year: chart.pillars?.[0]?.branch?.char || '子',
      month: chart.pillars?.[1]?.branch?.char || '子',
      day: chart.pillars?.[2]?.branch?.char || '子',
      hour: chart.pillars?.[3]?.branch?.char || '子',
    };
  }, [chart]);

  // Day Master stem character
  const dayMasterStem = chart?.pillars?.[2]?.stem?.char || '甲';

  // Compute year matrix
  const yearMatrix = useMemo(() => {
    if (!natalBaseline || !natalBranches) return null;
    return computeYearMatrix(natalBaseline, natalBranches, selectedYear, dayMasterStem);
  }, [natalBaseline, natalBranches, selectedYear, dayMasterStem]);

  // Road Trip analogy content (for floating window)
  const roadTripContent = useMemo(() => {
    if (!chart || !yearMatrix || !natalBaseline) return '';
    const dmName = chart.dayMaster?.fullName || chart.dayMaster?.chinese || '';
    const yp = yearMatrix.yearPillar;
    const ys = yearMatrix.yearYongShen;
    const carStr = ELEMENTS.map(el => `${el} ${natalBaseline[el].toFixed(0)}%`).join(' · ');
    const stoneStr = yearMatrix.yearStones.map(s => s.stone.name).join(', ');
    const forbidStr = ys?.forbidden?.join(' and ') || '';
    const threatStr = ys?.threat || '';
    const clashCount = yearMatrix.months.reduce((n, m) => n + m.interactions.filter(h => h.type === 'clash').length, 0);
    const harmCount = yearMatrix.months.reduce((n, m) => n + m.interactions.filter(h => h.type === 'harm').length, 0);
    const sorted = [...ELEMENTS].sort((a, b) => natalBaseline[b] - natalBaseline[a]);
    const dom = sorted[0];
    const weak = sorted[sorted.length - 1];
    const dangerMonthNames = yearMatrix.months.filter(m => m.dangerLevel === 'danger').map(m => m.monthName);
    const safest = yearMatrix.months.reduce((b, m) => {
      const o = { safe: 0, caution: 1, warning: 2, danger: 3 };
      return o[m.dangerLevel] < o[b.dangerLevel] ? m : b;
    }, yearMatrix.months[0]);

    return [
      `# 🗺️ The Road Trip — How Elemental Bracelet Design Works`,
      ``,
      `Your BaZi chart is a vehicle. The year ahead is the road. Gemstones are your survival kit.`,
      ``,
      `---`,
      ``,
      `## 🧑 The Driver — Who Moves Through the Year`,
      ``,
      `The Day Master is the core identity of the chart — the person behind the wheel. It determines how ${dmName} interprets pressure, opportunity, and imbalance. A ${dmName} driver moves through the world with the qualities of their element and polarity — this shapes how every climate shift and road hazard is experienced.`,
      ``,
      `This matters because the same road feels different to every driver. A Yang Fire driver burns through obstacles; a Yin Water driver flows around them. A pothole that rattles a Metal driver may barely register for Wood. The Driver sets the emotional tone for the entire journey.`,
      ``,
      `## 🚗 The Car — The Structure You Drive`,
      ``,
      `The natal element mix is the vehicle you were born with — the structure, weight, and handling of your elemental body. Your car: **${carStr}**.`,
      ``,
      `This is a **${dom}-dominant** vehicle (${natalBaseline[dom].toFixed(0)}%), with ${weak} as the weakest element (${natalBaseline[weak].toFixed(1)}%). A ${dom}-heavy car determines how well you handle the road — how you respond to acceleration, pressure, and sharp turns throughout the year.`,
      ``,
      `A chart heavy in Wood is tall and flexible; a Metal-heavy chart is sharp and precise. An Earth-heavy chart is stable but prone to getting bogged down when the terrain becomes too hot or too dry. The car determines how you handle every season.`,
      ``,
      `## 🌤️ The Climate — Annual Pillar (+20%)`,
      ``,
      `The annual pillar is the climate system covering the entire year. **${selectedYear}** is the **${yp.stemEnglish} ${yp.branchAnimal} (${yp.stem}${yp.branch})** year, adding a constant **+20%** elemental overlay to everything.`,
      ``,
      `This is like driving through a year-long weather system shaped by ${yp.stemEnglish}'s element. You cannot escape the climate — it shapes every month, every decision, and every emotional tone of the year.${threatStr ? ` For your chart, this climate intensifies **${threatStr}** dominance — the very element already dominating your chart — making balance more difficult and support more essential.` : ''}`,
      ``,
      `## 🌦️ The Weather — Monthly Pillars (+10%)`,
      ``,
      `Within the annual climate, each month brings its own **+10% elemental weather system**. Spring brings Wood (growth and expansion), Summer brings Fire (heat and intensity), Autumn brings Metal (sharpness and precision), Winter brings Water (depth and stillness).`,
      ``,
      `This matters because weather changes how the car behaves on the road. A Wood month may feel like a forest path — supportive for a Wood driver. A Fire month may feel like a desert — harsh for an Earth-heavy car. A Metal month may feel like sharp mountain passes — demanding precision. The monthly weather determines when the year feels manageable, when it feels heavy, and when it becomes dangerous.`,
      ``,
      `## 🛤️ The Road — Clashes, Harms & Punishments`,
      ``,
      `The road is shaped by interactions between the incoming pillars and your natal pillars. These interactions create:`,
      ``,
      `- **Clash (冲)** — sudden shocks, like potholes or head-on collisions`,
      `- **Harm (害)** — slow leaks, subtle damage that accumulates over time`,
      `- **Punishment (刑)** — structural stress, like cracks in the chassis`,
      ``,
      `Your pre-clash distribution is the theoretical forecast; your post-clash distribution is the reality you actually live. In ${selectedYear}, you face **${clashCount} clash${clashCount !== 1 ? 'es' : ''}** and **${harmCount} harm${harmCount !== 1 ? 's' : ''}**${dangerMonthNames.length > 0 ? `, with ${dangerMonthNames.join(', ')} being the most volatile months` : ''}. ${safest.monthName} is the smoothest stretch.`,
      ``,
      `## 💎 The Survival Kit — Your Gemstone Bracelet`,
      ``,
      `Your bracelet is the survival kit in your trunk — the tools you carry to stabilize your journey when the climate, weather, and road conditions become difficult.`,
      ``,
      `But here is the **critical rule**: you cannot fill what is missing if doing so strengthens the threat.${threatStr ? ` ${weak} is low, but adding ${weak} stones would feed ${threatStr} — the dominant element causing imbalance.` : ''} The **Yong Shen (用神)** logic ensures your bracelet actually helps:`,
      ``,
      `${ys?.usefulElements?.length > 0 ? ys.usefulElements.map((el, i) => `- Use **${el}** to ${i === 0 ? 'control' : 'exhaust'} ${threatStr || 'imbalance'}`).join('\n') : '- Elements balanced — no heavy corrections needed'}`,
      `${forbidStr ? `- **Avoid** ${forbidStr} stones completely` : ''}`,
      ``,
      `The right stones — **${stoneStr || 'TBD'}** — become anchors, stabilizers, and protective frequencies that help you move through the year safely.`,
      ``,
      `---`,
      ``,
      `## 🧮 The Math Behind Each Month`,
      ``,
      `Your natal baseline **(100 points)** + annual pillar overlay **(20 points)** + monthly pillar overlay **(10 points)** = **130 raw points**, normalized to 100%.`,
      ``,
      `Then clashes, harms, and punishments shift the balance further. Finally, the Yong Shen logic gate analyzes the result and prescribes stones that *actually help* — never the ones that make things worse.`,
      ``,
      `**Every step is shown transparently. No black box.**`,
    ].join('\n');
  }, [chart, yearMatrix, natalBaseline]);

  // Handler for "Seasonal Multipliers" button
  const handleSeasonMoreInfo = (season) => {
    const strengths = SEASONAL_STRENGTH[season];
    if (!strengths) return;

    // Full 12-month branch progression (BaZi month order: 寅 through 丑)
    const ALL_BRANCHES = [
      { char: '寅', animal: 'Tiger',   season: 'Spring', greg: 'Feb',  phase: 'Beginning' },
      { char: '卯', animal: 'Rabbit',  season: 'Spring', greg: 'Mar',  phase: 'Core' },
      { char: '辰', animal: 'Dragon',  season: 'Spring', greg: 'Apr',  phase: 'Earth Transition' },
      { char: '巳', animal: 'Snake',   season: 'Summer', greg: 'May',  phase: 'Beginning' },
      { char: '午', animal: 'Horse',   season: 'Summer', greg: 'Jun',  phase: 'Core' },
      { char: '未', animal: 'Goat',    season: 'Summer', greg: 'Jul',  phase: 'Earth Transition' },
      { char: '申', animal: 'Monkey',  season: 'Autumn', greg: 'Aug',  phase: 'Beginning' },
      { char: '酉', animal: 'Rooster', season: 'Autumn', greg: 'Sep',  phase: 'Core' },
      { char: '戌', animal: 'Dog',     season: 'Autumn', greg: 'Oct',  phase: 'Earth Transition' },
      { char: '亥', animal: 'Pig',     season: 'Winter', greg: 'Nov',  phase: 'Beginning' },
      { char: '子', animal: 'Rat',     season: 'Winter', greg: 'Dec',  phase: 'Core' },
      { char: '丑', animal: 'Ox',      season: 'Winter', greg: 'Jan',  phase: 'Earth Transition' },
    ];

    const peakEl = ELEMENTS.find(el => strengths[el] === 1.0) || '';

    // Build 12-month multiplier rows from the actual engine
    const monthRows = ALL_BRANCHES.map(b => {
      const w = getSeasonalWeights(b.char);
      // getSeasonalWeights returns lowercase keys; map to title-case
      const vals = {
        Wood:  w.wood  ?? w.Wood  ?? 0,
        Fire:  w.fire  ?? w.Fire  ?? 0,
        Earth: w.earth ?? w.Earth ?? 0,
        Metal: w.metal ?? w.Metal ?? 0,
        Water: w.water ?? w.Water ?? 0,
      };
      const highlight = b.season === season ? '**' : '';
      return `| ${highlight}${b.char} ${b.animal}${highlight} | ${b.greg} | ${b.season} | ${vals.Wood} | ${vals.Fire} | ${vals.Earth} | ${vals.Metal} | ${vals.Water} |`;
    });

    const md = [
      `# ${season} Season — Elemental Multipliers`,
      ``,
      `In BaZi, each season amplifies certain elements and weakens others. These multipliers determine how much each element **actually contributes** to your chart during ${season} months.`,
      ``,
      `## 旺相休囚死 — The Five Phases of Seasonal Strength`,
      ``,
      `| Level | Multiplier | Meaning |`,
      `|-------|-----------|---------|`,
      `| 旺 Prosperous | ×1.0 | Element at peak — fully expressed |`,
      `| 相 Phase | ×0.8 | Strong — generated by dominant |`,
      `| 休 Resting | ×0.6 | Moderate — supportive role |`,
      `| 囚 Imprisoned | ×0.4 | Weakened — constrained by season |`,
      `| 死 Dead | ×0.2 | At its weakest — nearly dormant |`,
      ``,
      `**${peakEl}** is prosperous (旺) during ${season} — it is at full strength, dominating the seasonal landscape.`,
      ``,
      `---`,
      ``,
      `## 12-Month Multiplier Progression`,
      ``,
      `This table shows how every element's strength shifts month by month through the full year. The current season (**${season}**) rows are bolded.`,
      ``,
      `Transition months (辰 Dragon, 未 Goat, 戌 Dog, 丑 Ox) are **Earth-dominant** — they bridge between seasons with unique multiplier profiles.`,
      ``,
      `| Month | Greg | Season | Wood | Fire | Earth | Metal | Water |`,
      `|-------|------|--------|------|------|-------|-------|-------|`,
      ...monthRows,
      ``,
      `---`,
      ``,
      `## Reading the Progression`,
      ``,
      `- **×1.0** = Element at peak power (旺 Prosperous)`,
      `- **×0.8** = Strong — child of the season's element or incoming energy`,
      `- **×0.6** = Moderate — supportive parent or outgoing energy`,
      `- **×0.4** = Weakened — controlled or at base level`,
      `- **×0.2** = Dormant — the element that opposes the season`,
      ``,
      `Notice how each element rises, peaks, and fades as the year progresses — a wave pattern across the 12 months. Earth transitions create brief "resets" where Earth surges to ×1.0 while the outgoing element gracefully yields to the incoming one.`,
      ``,
      `## How This Affects Your Bracelet`,
      ``,
      `The bracelet engine applies these multipliers when computing your monthly element balance. A month where your weakest element hits ×0.2 may need extra gemstone support, while months where your strongest element hits ×1.0 may intensify imbalances.`,
    ].join('\n');

    setSeasonInfoContent({ title: `${season} — Seasonal Element Multipliers`, content: md });
  };

  // Year range for selector
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 2 + i);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 px-6 py-3 border-b ${
        isDark ? 'bg-slate-900/95 border-slate-700 backdrop-blur' : 'bg-white/95 border-slate-200 backdrop-blur'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className={`text-sm ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
              ← Back
            </Link>
            <h1 className="text-xl font-bold">💎 BaZi Elemental Bracelet</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Profile Selector */}
            <select
              value={selectedProfileId || ''}
              onChange={e => setSelectedProfileId(e.target.value || null)}
              className={`text-sm rounded-lg px-3 py-1.5 border ${
                isDark
                  ? 'bg-slate-800 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="">Select Profile...</option>
              {profiles?.map(p => (
                <option key={p.id} value={p.id}>
                  {p.displayName || `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.id}
                  {p.relationshipType ? ` (${p.relationshipType})` : ''}
                </option>
              ))}
            </select>

            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className={`text-sm rounded-lg px-3 py-1.5 border ${
                isDark
                  ? 'bg-slate-800 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              {yearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            {/* Theme Toggle */}
            <button
              onClick={() => setThemeMode(m => m === 'dark' ? 'light' : 'dark')}
              className={`text-sm px-3 py-1.5 rounded-lg border ${
                isDark
                  ? 'border-slate-600 text-slate-400 hover:text-white'
                  : 'border-slate-300 text-slate-500 hover:text-slate-900'
              }`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {loading && (
          <div className={`text-center py-20 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Loading profiles...
          </div>
        )}

        {!loading && !selectedProfile && (
          <div className={`text-center py-20 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <div className="text-4xl mb-4">💎</div>
            <div className="text-lg">Select a profile to design your elemental bracelet</div>
            <div className="text-sm mt-2">
              Choose a profile from the dropdown above to see their year-ahead element forecast
            </div>
          </div>
        )}

        {selectedProfile && chart && yearMatrix && (
          <BaziThemeProvider theme={themeMode}>
            <div className="space-y-8">

              {/* ═══════════════════════════════════════════════════════════════
                  5W+H+EMOTION INTRO — "What Are We Doing Here?"
                  ═══════════════════════════════════════════════════════════════ */}
              {(() => {
                const dmName = chart.dayMaster?.fullName || chart.dayMaster?.chinese || '';
                const profileName = selectedProfile?.displayName || selectedProfile?.firstName || 'this person';
                const yp = yearMatrix.yearPillar;
                const ys = yearMatrix.yearYongShen;
                const sorted = [...ELEMENTS].sort((a, b) => natalBaseline[b] - natalBaseline[a]);
                const dom = sorted[0];
                const weak = sorted[sorted.length - 1];
                const dangerNames = yearMatrix.months.filter(m => m.dangerLevel === 'danger').map(m => m.monthName);
                const warnNames = yearMatrix.months.filter(m => m.dangerLevel === 'warning').map(m => m.monthName);
                const safestMonth = yearMatrix.months.reduce((best, m) => {
                  const o = { safe: 0, caution: 1, warning: 2, danger: 3 };
                  return o[m.dangerLevel] < o[best.dangerLevel] ? m : best;
                }, yearMatrix.months[0]);
                const clashCount = yearMatrix.months.reduce((n, m) => n + m.interactions.filter(h => h.type === 'clash').length, 0);
                const harmCount = yearMatrix.months.reduce((n, m) => n + m.interactions.filter(h => h.type === 'harm').length, 0);
                const stoneStr = yearMatrix.yearStones.map(s => s.stone.name).join(', ');
                const hasThreat = ys?.status === 'critical_imbalance';

                return (
                  <section className={`rounded-xl border p-6 ${
                    isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                  }`}>
                    <p className={`text-sm leading-relaxed italic mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Every year is a landscape. Every chart is a vehicle. Every person is a driver moving through
                      shifting climates, unexpected weather, and roads that rise or break beneath the wheels.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      {/* WHAT */}
                      <div>
                        <h3 className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          What this page is
                        </h3>
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          A complete elemental navigation map for {selectedYear}, showing how {profileName}'s natal BaZi structure
                          interacts with the {yp.stemEnglish} {yp.branchAnimal} year. Every calculation is shown
                          transparently — no black box.
                        </p>
                      </div>

                      {/* WHO */}
                      <div>
                        <h3 className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          Who this is for
                        </h3>
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {profileName}, whose Day Master is a <strong>{dmName}</strong> driving a chart
                          at {ELEMENTS.map(el => `${el} ${natalBaseline[el].toFixed(0)}%`).join(', ')}.
                        </p>
                      </div>

                      {/* WHEN */}
                      <div>
                        <h3 className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          When this applies
                        </h3>
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          The {yp.stemEnglish} {yp.branchAnimal} Year ({yp.stem}{yp.branch}) adds a persistent +20% overlay.
                          Each month adds +10% seasonal energy, creating shifting conditions across 12 months.
                        </p>
                      </div>

                      {/* WHERE */}
                      <div>
                        <h3 className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          Where the challenges lie
                        </h3>
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {yearMatrix.dangerMonths.length > 0
                            ? <>{yearMatrix.dangerMonths.length} challenging months, with {
                                [...dangerNames, ...warnNames].slice(0, 4).join(', ')
                              } being the most volatile. <strong>{safestMonth.monthName}</strong> is the smoothest stretch.</>
                            : <>Relatively smooth year — no major danger months detected.</>
                          }
                        </p>
                      </div>

                      {/* WHY */}
                      <div>
                        <h3 className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          Why this matters
                        </h3>
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {hasThreat
                            ? <>The chart is critically <strong style={{ color: ELEM_COLORS[ys.threat] }}>{ys.threat}</strong>-dominant
                              ({yearMatrix.yearAverage[ys.threat]?.toFixed(0)}% year average).
                              {ys.forbidden?.[1] && <> Even though {ys.forbidden[1]} is low, it cannot be supplemented
                              because {ys.forbidden[1]} feeds {ys.threat}.</>} This guide prevents accidental imbalance.</>
                            : <>This guide tracks how the year's elemental shifts affect your balance month by month,
                              ensuring your bracelet prescription stays accurate.</>
                          }
                        </p>
                      </div>

                      {/* HOW */}
                      <div>
                        <h3 className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          How the bracelet works
                        </h3>
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {stoneStr
                            ? <><strong>{stoneStr}</strong> — {ys?.usefulElements?.map(el =>
                                `${el} to ${el === ys?.usefulElements?.[0] ? 'control' : 'exhaust'} ${ys?.threat || 'imbalance'}`
                              ).join(', ')}.
                              {ys?.forbidden?.length > 0 && <> Strictly avoid {ys.forbidden.join(' and ')} stones.</>}</>
                            : <>No heavy corrections needed — elements are well-balanced this year.</>
                          }
                        </p>
                      </div>
                    </div>

                    {/* Emotion + Road Trip button */}
                    <div className={`mt-5 flex items-start justify-between gap-4 pt-4 border-t ${
                      isDark ? 'border-slate-700' : 'border-slate-200'
                    }`}>
                      <p className={`text-sm italic leading-relaxed flex-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        This is not just data — it is a map of the year's emotional terrain.
                        {hasThreat
                          ? <> A {dmName} moving through a {ys.threat}-heavy year feels pressure, heaviness, and intensity.
                            The right stones become anchors — roots, shields, and steady breath.</>
                          : <> The right stones become companions for the road — stabilizers that keep the journey smooth.</>
                        }
                      </p>
                      <button
                        onClick={() => setShowRoadTrip(true)}
                        className={`flex-shrink-0 text-sm px-4 py-2 rounded-lg border transition-colors ${
                          isDark
                            ? 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white'
                            : 'border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        🗺️ The Road Trip Analogy
                      </button>
                    </div>
                  </section>
                );
              })()}

              {/* Road Trip Floating Window */}
              {showRoadTrip && roadTripContent && (
                <FloatingMdWindow
                  title="🗺️ The Road Trip — How Elemental Bracelet Design Works"
                  content={roadTripContent}
                  onClose={() => setShowRoadTrip(false)}
                  width={720}
                />
              )}

              {/* Seasonal Multipliers Floating Window */}
              {seasonInfoContent && (
                <FloatingMdWindow
                  title={seasonInfoContent.title}
                  content={seasonInfoContent.content}
                  onClose={() => setSeasonInfoContent(null)}
                  width={640}
                />
              )}

              {/* ═══════════════════════════════════════════════════════════════
                  YEAR DASHBOARD — At-a-Glance Orientation
                  ═══════════════════════════════════════════════════════════════ */}
              <section className={`rounded-xl border p-6 ${
                isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <h2 className={`text-lg font-bold mb-5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  🌞 {selectedYear} Year Dashboard
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                  {/* ── 1. Driver & Vehicle ────────────────────────────── */}
                  <div className={`rounded-xl p-4 ${isDark ? 'bg-indigo-900/15 border border-indigo-800/40' : 'bg-indigo-50 border border-indigo-100'}`}>
                    <h3 className={`text-sm font-bold mb-2 ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
                      🧑 Driver & Vehicle
                    </h3>
                    <div className={`text-sm space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      <div><strong>Driver:</strong> {chart.dayMaster?.fullName || chart.dayMaster?.chinese}</div>
                      <div><strong>Vehicle:</strong> {ELEMENTS.map(el =>
                        `${el} ${natalBaseline[el].toFixed(0)}%`
                      ).join(' · ')}</div>
                      {(() => {
                        const sorted = [...ELEMENTS].sort((a, b) => natalBaseline[b] - natalBaseline[a]);
                        const dom = sorted[0];
                        const weak = sorted[sorted.length - 1];
                        return (
                          <>
                            <div><strong>Dominant:</strong> <span style={{ color: ELEM_COLORS[dom] }}>{dom} ({natalBaseline[dom].toFixed(0)}%)</span></div>
                            <div><strong>Weakest:</strong> <span style={{ color: ELEM_COLORS[weak] }}>{weak} ({natalBaseline[weak].toFixed(1)}%)</span>
                              {yearMatrix.yearYongShen?.forbidden?.includes(weak) && (
                                <span className={`ml-1 text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>— cannot fill</span>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* ── 2. Annual Climate ──────────────────────────────── */}
                  <div className={`rounded-xl p-4 ${isDark ? 'bg-amber-900/15 border border-amber-800/40' : 'bg-amber-50 border border-amber-100'}`}>
                    <h3 className={`text-sm font-bold mb-2 ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                      🌤️ Annual Climate
                    </h3>
                    <div className={`text-sm space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      <div className="text-base font-semibold">
                        {yearMatrix.yearPillar.stem}{yearMatrix.yearPillar.branch}{' '}
                        {yearMatrix.yearPillar.stemEnglish} {yearMatrix.yearPillar.branchAnimal}
                      </div>
                      <div>+20% elemental overlay all year</div>
                      {yearMatrix.yearYongShen?.threat && (
                        <div className={`text-xs mt-1 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                          Intensifies {yearMatrix.yearYongShen.threat} dominance
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── 3. Element Balance (Year Avg) ─────────────────── */}
                  <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-700/40 border border-slate-600' : 'bg-slate-50 border border-slate-200'}`}>
                    <h3 className={`text-sm font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      📊 Year Average (Post-Clash)
                    </h3>
                    <div className="space-y-1.5">
                      {[...ELEMENTS].sort((a, b) => yearMatrix.yearAverage[b] - yearMatrix.yearAverage[a]).map(el => (
                        <div key={el} className="flex items-center gap-2">
                          <span className="text-xs w-10 text-right font-medium" style={{ color: ELEM_COLORS[el] }}>{el}</span>
                          <div className={`flex-1 h-3 rounded-full overflow-hidden ${isDark ? 'bg-slate-600/50' : 'bg-slate-200'}`}>
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.max(yearMatrix.yearAverage[el], 1)}%`,
                                backgroundColor: ELEM_COLORS[el],
                                opacity: yearMatrix.yearAverage[el] < 10 ? 0.6 : 0.85,
                              }}
                            />
                          </div>
                          <span className="text-xs w-10 font-bold" style={{ color: ELEM_COLORS[el] }}>
                            {yearMatrix.yearAverage[el].toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── 4. Risk Map ────────────────────────────────────── */}
                  <div className={`rounded-xl p-4 ${isDark ? 'bg-red-900/10 border border-red-800/40' : 'bg-red-50 border border-red-100'}`}>
                    <h3 className={`text-sm font-bold mb-2 ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                      🛤️ Risk Map
                    </h3>
                    <div className="space-y-1.5 text-xs">
                      {['danger', 'warning', 'caution', 'safe'].map(level => {
                        const style = DANGER_STYLES[level];
                        const monthsAtLevel = yearMatrix.months.filter(m => m.dangerLevel === level);
                        if (monthsAtLevel.length === 0) return null;
                        return (
                          <div key={level} className="flex items-start gap-2">
                            <span className="mt-0.5">{style.icon}</span>
                            <div>
                              <span className={`font-semibold ${style.text}`}>{style.label}:</span>
                              <span className={`ml-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                {monthsAtLevel.map(m => m.monthName).join(', ')}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {(() => {
                      const safest = yearMatrix.months.reduce((best, m) => {
                        const order = { safe: 0, caution: 1, warning: 2, danger: 3 };
                        return order[m.dangerLevel] < order[best.dangerLevel] ? m : best;
                      }, yearMatrix.months[0]);
                      return (
                        <div className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          Smoothest: <strong>{safest.monthName}</strong>
                        </div>
                      );
                    })()}
                  </div>

                  {/* ── 5. Core Bracelet ───────────────────────────────── */}
                  <div className={`rounded-xl p-4 ${isDark ? 'bg-purple-900/10 border border-purple-800/40' : 'bg-purple-50 border border-purple-100'}`}>
                    <h3 className={`text-sm font-bold mb-2 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                      💎 Core Bracelet
                    </h3>
                    {yearMatrix.yearStones.length > 0 ? (
                      <div className="space-y-1.5">
                        {yearMatrix.yearStones.map((rec, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full border flex-shrink-0"
                              style={{ backgroundColor: rec.stone.color, borderColor: isDark ? '#475569' : '#cbd5e1' }}
                            />
                            <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                              {rec.stone.name}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              rec.stone.polarity === 'Yang'
                                ? (isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700')
                                : (isDark ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-100 text-purple-700')
                            }`}>
                              {rec.stone.polarity} {rec.stone.element}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        No specific stones needed — balanced year!
                      </div>
                    )}
                  </div>

                  {/* ── 6. Avoid List ──────────────────────────────────── */}
                  <div className={`rounded-xl p-4 ${
                    yearMatrix.yearYongShen?.status === 'critical_imbalance'
                      ? (isDark ? 'bg-red-900/15 border border-red-800/40' : 'bg-red-50 border border-red-100')
                      : (isDark ? 'bg-green-900/10 border border-green-800/40' : 'bg-green-50 border border-green-100')
                  }`}>
                    <h3 className={`text-sm font-bold mb-2 ${
                      yearMatrix.yearYongShen?.status === 'critical_imbalance'
                        ? (isDark ? 'text-red-300' : 'text-red-700')
                        : (isDark ? 'text-green-300' : 'text-green-700')
                    }`}>
                      {yearMatrix.yearYongShen?.status === 'critical_imbalance' ? '🚫 Strict Avoid' : '✅ No Restrictions'}
                    </h3>
                    {yearMatrix.yearYongShen?.status === 'critical_imbalance' && yearMatrix.yearYongShen.forbidden.length > 0 ? (
                      <div className="space-y-1.5">
                        {yearMatrix.yearYongShen.forbidden.map((el, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <span>🚫</span>
                            <span className={`font-semibold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                              {el} stones
                            </span>
                          </div>
                        ))}
                        <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {yearMatrix.yearYongShen.forbidden[1]} feeds {yearMatrix.yearYongShen.threat} (generative cycle)
                        </div>
                      </div>
                    ) : (
                      <div className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                        All element stones are safe this year.
                      </div>
                    )}
                  </div>

                </div>
              </section>

              {/* ═══════════════════════════════════════════════════════════════
                  JOURNEY CARD — Elevated 5W+H narrative for THIS profile/year
                  ═══════════════════════════════════════════════════════════════ */}
              {(() => {
                const dmName = chart.dayMaster?.fullName || chart.dayMaster?.chinese || '';
                const yp = yearMatrix.yearPillar;
                const ys = yearMatrix.yearYongShen;
                const sorted = [...ELEMENTS].sort((a, b) => natalBaseline[b] - natalBaseline[a]);
                const dom = sorted[0];
                const clashCount = yearMatrix.months.reduce((n, m) => n + m.interactions.filter(h => h.type === 'clash').length, 0);
                const harmCount = yearMatrix.months.reduce((n, m) => n + m.interactions.filter(h => h.type === 'harm').length, 0);
                const worstMonth = yearMatrix.months.reduce((w, m) => {
                  const o = { safe: 0, caution: 1, warning: 2, danger: 3 };
                  return o[m.dangerLevel] > o[w.dangerLevel] ? m : w;
                }, yearMatrix.months[0]);
                const bestMonth = yearMatrix.months.reduce((b, m) => {
                  const o = { safe: 0, caution: 1, warning: 2, danger: 3 };
                  return o[m.dangerLevel] < o[b.dangerLevel] ? m : b;
                }, yearMatrix.months[0]);

                return (
                  <section className={`rounded-xl border p-6 ${
                    isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                  }`}>
                    <h2 className={`text-lg font-semibold mb-5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      🚗 Your Journey — The Road Ahead in {selectedYear}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Driver */}
                      <div className={`rounded-xl p-4 ${isDark ? 'bg-indigo-900/15 border border-indigo-800/40' : 'bg-indigo-50 border border-indigo-100'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🧑</span>
                          <h3 className={`text-sm font-bold ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>The Driver</h3>
                        </div>
                        <div className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {dmName}
                        </div>
                        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          The Day Master is the core identity of the chart — the person behind the wheel. It determines how {dmName} interprets pressure, opportunity, and imbalance.
                          {' '}This identity shapes how every climate shift and every road hazard is experienced — the same pothole feels different to every driver.
                        </p>
                      </div>

                      {/* Car */}
                      <div className={`rounded-xl p-4 ${isDark ? 'bg-emerald-900/15 border border-emerald-800/40' : 'bg-emerald-50 border border-emerald-100'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🚗</span>
                          <h3 className={`text-sm font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>The Car</h3>
                        </div>
                        <div className={`text-xs space-y-0.5 mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {ELEMENTS.map(el => (
                            <span key={el} className="inline-block mr-2" style={{ color: ELEM_COLORS[el] }}>
                              <strong>{el}</strong> {natalBaseline[el].toFixed(0)}%
                            </span>
                          ))}
                        </div>
                        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          The natal element mix is the vehicle — the structure, weight, and handling of the elemental body.
                          {' '}<span style={{ color: ELEM_COLORS[dom] }}>{dom}</span>-dominant
                          ({natalBaseline[dom].toFixed(0)}%)
                          {natalBaseline[dom] > 40
                            ? ' — stable but prone to heaviness and stagnation when the terrain becomes too hot or dry.'
                            : natalBaseline[dom] > 30
                            ? ' — well-structured, with room for seasonal variation.'
                            : ' — balanced chassis with no single overwhelming element.'
                          }
                        </p>
                      </div>

                      {/* Climate */}
                      <div className={`rounded-xl p-4 ${isDark ? 'bg-amber-900/15 border border-amber-800/40' : 'bg-amber-50 border border-amber-100'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🌤️</span>
                          <h3 className={`text-sm font-bold ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>The Climate</h3>
                        </div>
                        <div className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {yp.stem}{yp.branch} {yp.stemEnglish} {yp.branchAnimal} (+20%)
                        </div>
                        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          The entire year is covered by this elemental climate — a persistent overlay that shapes every month and every emotional tone.
                          {ys?.threat && <> It intensifies <strong style={{ color: ELEM_COLORS[ys.threat] }}>{ys.threat}</strong> dominance, making balance more difficult and support more essential.</>}
                          {' '}The climate cannot be avoided — it can only be prepared for.
                        </p>
                      </div>

                      {/* Road */}
                      <div className={`rounded-xl p-4 ${isDark ? 'bg-red-900/15 border border-red-800/40' : 'bg-red-50 border border-red-100'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🛤️</span>
                          <h3 className={`text-sm font-bold ${isDark ? 'text-red-300' : 'text-red-700'}`}>The Road</h3>
                        </div>
                        <div className={`text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {clashCount > 0 || harmCount > 0
                            ? <><strong>{clashCount}</strong> clash{clashCount !== 1 ? 'es' : ''} and <strong>{harmCount}</strong> harm{harmCount !== 1 ? 's' : ''}</>
                            : 'Smooth road — no major disruptions'
                          }
                        </div>
                        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {worstMonth.dangerLevel === 'danger' || worstMonth.dangerLevel === 'warning'
                            ? <>The road contains clashes (sudden shocks), harms (slow leaks), and punishments (structural stress) that shift the balance.
                              {' '}<strong>{worstMonth.monthName}</strong> is the most volatile stretch;
                              {' '}<strong>{bestMonth.monthName}</strong> is the smoothest terrain.</>
                            : 'No major danger months detected — a relatively smooth road ahead.'
                          }
                        </p>
                      </div>

                      {/* Survival Kit */}
                      <div className={`rounded-xl p-4 md:col-span-2 lg:col-span-2 ${isDark ? 'bg-purple-900/15 border border-purple-800/40' : 'bg-purple-50 border border-purple-100'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">💎</span>
                          <h3 className={`text-sm font-bold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>The Survival Kit</h3>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {yearMatrix.yearStones.length > 0 ? yearMatrix.yearStones.map((rec, i) => (
                            <span key={i} className="flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: rec.stone.color }} />
                              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{rec.stone.name}</span>
                              <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                ({rec.stone.polarity} {rec.stone.element})
                              </span>
                            </span>
                          )) : (
                            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No heavy corrections needed</span>
                          )}
                        </div>
                        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          The gemstone bracelet is the survival kit carried through the year. But the rule is strict: you cannot fill a deficit if doing so strengthens the threat.
                          {ys?.status === 'critical_imbalance' && ys.forbidden?.length > 0 && (
                            <span className={isDark ? ' text-red-400' : ' text-red-600'}>
                              {' '}Strictly avoid {ys.forbidden.join(' and ')} stones — {ys.forbidden[1]} feeds {ys.threat}.
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </section>
                );
              })()}

              {/* ═══════════════════════════════════════════════════════════════
                  NATAL BASELINE — Four Pillars + Radar
                  ═══════════════════════════════════════════════════════════════ */}
              <section className={`rounded-xl border p-6 ${
                isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  📊 Natal Baseline — Your Car's Built-In Equipment
                </h2>

                {/* Four Pillars Grid */}
                <div className="mb-6">
                  <FourPillarsGrid
                    pillars={chart.pillars}
                    compact
                    showHiddenRoots
                  />
                </div>

                {/* Element Radar + Element Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PersonalityRadar
                    data={[
                      { trait: 'Wood', score: natalBaseline.Wood },
                      { trait: 'Fire', score: natalBaseline.Fire },
                      { trait: 'Earth', score: natalBaseline.Earth },
                      { trait: 'Metal', score: natalBaseline.Metal },
                      { trait: 'Water', score: natalBaseline.Water },
                    ]}
                    profileName={selectedProfile?.displayName || 'Profile'}
                    title="Natal Elemental Fingerprint"
                    subtitle="Seasonality-adjusted baseline"
                    height={300}
                    compact
                    variant="adjusted"
                  />
                  {/* Element % Summary with bars */}
                  <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-700/40' : 'bg-slate-50'}`}>
                    <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Seasonality-Adjusted Element Distribution
                    </h3>
                    <div className="space-y-2.5">
                      {ELEMENTS.map(el => {
                        const pct = natalBaseline[el];
                        return (
                          <div key={el} className="flex items-center gap-3">
                            <span className={`text-xs w-12 text-right font-medium`} style={{ color: ELEM_COLORS[el] }}>
                              {el}
                            </span>
                            <div className={`flex-1 h-5 rounded-full overflow-hidden ${isDark ? 'bg-slate-600/50' : 'bg-slate-200'}`}>
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.max(pct, 1)}%`,
                                  backgroundColor: ELEM_COLORS[el],
                                  opacity: pct < 10 ? 0.6 : 0.85,
                                }}
                              />
                            </div>
                            <span className={`text-sm font-bold w-14 text-right`} style={{ color: ELEM_COLORS[el] }}>
                              {pct.toFixed(1)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    {/* Dominant element callout */}
                    {(() => {
                      const sorted = [...ELEMENTS].sort((a, b) => natalBaseline[b] - natalBaseline[a]);
                      const dom = sorted[0];
                      const weak = sorted[sorted.length - 1];
                      return (
                        <div className={`mt-4 text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          <strong style={{ color: ELEM_COLORS[dom] }}>{dom}</strong> dominant
                          ({natalBaseline[dom].toFixed(0)}%) ·
                          {' '}<strong style={{ color: ELEM_COLORS[weak] }}>{weak}</strong> weakest
                          ({natalBaseline[weak].toFixed(1)}%)
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </section>

              {/* ═══════════════════════════════════════════════════════════════
                  YEAR AVERAGE
                  ═══════════════════════════════════════════════════════════════ */}
              <section className={`rounded-xl border p-4 ${
                isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    📅 Year Average (Post-Clash)
                  </h3>
                </div>
                <ElementBar dist={yearMatrix.yearAverage} themeMode={themeMode} />
              </section>

              {/* ═══════════════════════════════════════════════════════════════
                  DANGER LEVEL LEGEND
                  ═══════════════════════════════════════════════════════════════ */}
              <section className={`rounded-xl border p-4 ${
                isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  🚦 Danger Level Criteria
                </h3>
                <p className={`text-xs mb-3 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Each month is scored on a 0–100 danger scale based on three factors: clash/harm/punishment interactions,
                  element imbalance spread, and critically low elements. The score determines the danger level:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  {[
                    { level: 'safe',    range: '0–19',  desc: 'No significant interactions or imbalance.' },
                    { level: 'caution', range: '20–39', desc: 'Minor interactions or moderate imbalance.' },
                    { level: 'warning', range: '40–59', desc: 'Multiple interactions or strong imbalance.' },
                    { level: 'danger',  range: '60+',   desc: 'Severe clashes, extreme spread, or critical lows.' },
                  ].map(item => {
                    const s = DANGER_STYLES[item.level];
                    return (
                      <div key={item.level} className={`rounded-lg p-2.5 ${s.bg}`}>
                        <div className={`text-xs font-bold mb-0.5 ${s.text}`}>
                          {s.icon} {s.label} ({item.range})
                        </div>
                        <div className={`text-[10px] leading-snug ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {item.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <details className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <summary className="cursor-pointer hover:underline">How the score is calculated</summary>
                  <div className={`mt-2 space-y-1 pl-2 border-l-2 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <div><strong>Interactions:</strong> Clash = +30 pts, Punishment = +20 pts, Harm = +15 pts</div>
                    <div><strong>Imbalance spread:</strong> Max–Min element gap &gt; 30% = +20 pts, &gt; 20% = +10 pts</div>
                    <div><strong>Critical lows:</strong> Any element below 8% = +15 pts, below 12% = +5 pts</div>
                    <div className={`italic mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                      Score is capped at 100. Multiple factors stack — a month with a clash (+30) and a critically low element (+15) and high spread (+20) would score 65 = Danger.
                    </div>
                  </div>
                </details>
              </section>

              {/* ═══════════════════════════════════════════════════════════════
                  SEASONAL GRID (4 seasons × 3 months)
                  ═══════════════════════════════════════════════════════════════ */}
              {yearMatrix.seasons.map(season => (
                <SeasonRow
                  key={season.season}
                  seasonSummary={season}
                  expandedMonths={expandedMonths}
                  setExpandedMonths={setExpandedMonths}
                  themeMode={themeMode}
                  onMoreInfo={handleSeasonMoreInfo}
                />
              ))}

              {/* ═══════════════════════════════════════════════════════════════
                  SURVIVAL KIT — Yong Shen (用神) Aware Bracelet
                  ═══════════════════════════════════════════════════════════════ */}
              <section className={`rounded-xl border p-6 ${
                isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  🎒 Your Survival Kit — Yong Shen (用神) Curated Bracelet
                </h2>

                {/* TIER 1: Forbidden Warning (if critical imbalance detected) */}
                {yearMatrix.yearYongShen?.status === 'critical_imbalance' && yearMatrix.yearYongShen.forbidden.length > 0 && (
                  <div className={`mb-5 p-4 rounded-xl border-l-4 ${
                    isDark ? 'bg-red-900/15 border-red-500' : 'bg-red-50 border-red-500'
                  }`}>
                    <h4 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
                      isDark ? 'text-red-400' : 'text-red-600'
                    }`}>
                      ⚠️ Danger: Do Not Fill The Deficit
                    </h4>
                    <p className={`text-sm mt-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {yearMatrix.yearYongShen.forbiddenReason}
                    </p>
                    <div className={`flex gap-2 mt-3`}>
                      {yearMatrix.yearYongShen.forbidden.map((el, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDark ? 'bg-red-900/30 text-red-400 border border-red-800' : 'bg-red-100 text-red-700 border border-red-200'
                          }`}
                        >
                          🚫 {el}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* POLARITY EXPLAINER — Why Yin or Yang stones? */}
                {yearMatrix.yearYongShen && (() => {
                  const pol = yearMatrix.yearYongShen.preferredPolarity;
                  const isYang = pol === 'Yang';
                  const dmName = chart.dayMaster?.fullName || chart.dayMaster?.chinese || 'Unknown';
                  const dmElement = chart.dayMaster?.element || chart.pillars?.[2]?.stem?.element || '';

                  // Polarity metaphor pairs per element
                  const POLARITY_TABLE = {
                    Water: { Yang: '壬 Deep Ocean — vast, crushing waves, winter lakes', Yin: '癸 Gentle Rain — morning dew, streams, soft mist' },
                    Metal: { Yang: '庚 Heavy Steel — iron swords, fortress gates, raw ore', Yin: '辛 Fine Jewelry — precision instruments, silver needles' },
                    Wood:  { Yang: '甲 Great Trees — ancient oaks, pillars, deep roots', Yin: '乙 Soft Vines — spring grass, flowers, flexible bamboo' },
                    Fire:  { Yang: '丙 Blazing Sun — bonfires, volcanic heat, radiance', Yin: '丁 Candle Flame — lanterns, warm hearth, focused glow' },
                    Earth: { Yang: '戊 Mountains — boulders, great walls, bedrock', Yin: '己 Garden Soil — clay, fertile earth, nurturing ground' },
                  };

                  return (
                    <div className={`mb-5 rounded-xl border p-4 ${
                      isYang
                        ? (isDark ? 'bg-blue-900/10 border-blue-800/40' : 'bg-blue-50 border-blue-200')
                        : (isDark ? 'bg-purple-900/10 border-purple-800/40' : 'bg-purple-50 border-purple-200')
                    }`}>
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{isYang ? '☀️' : '🌙'}</span>
                        <div>
                          <h3 className={`font-bold text-sm ${
                            isYang
                              ? (isDark ? 'text-blue-300' : 'text-blue-700')
                              : (isDark ? 'text-purple-300' : 'text-purple-700')
                          }`}>
                            Your Day Master is {pol} — {isYang ? 'Heavy, Deep' : 'Refined, Precise'} Stones Prescribed
                          </h3>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {dmName} ({dmElement}) · {isYang ? 'Yang' : 'Yin'} polarity determines your stone frequency
                          </p>
                        </div>
                      </div>

                      {/* Explanation */}
                      <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {isYang
                          ? <>In classical BaZi, a <strong>Yang Day Master</strong> operates at a heavy, dense frequency.
                            To properly control an imbalance, you need remedies that match that depth — like using the
                            <em> ocean</em> to extinguish a wildfire, not a cup of tea. Yang stones carry dense, heavy
                            energy that resonates with your constitution. Yin stones would be too gentle — like rain
                            evaporating before it touches the flames.</>
                          : <>In classical BaZi, a <strong>Yin Day Master</strong> operates at a refined, precise frequency.
                            Heavy, blunt remedies would overwhelm your system. You need <em>surgical precision</em> —
                            like a silver needle redirecting energy flow, not a sledgehammer. Yin stones carry gentle,
                            nuanced energy that harmonizes with your constitution without overpowering it.</>
                        }
                      </p>

                      {/* Yang vs Yin comparison table */}
                      <div className={`rounded-lg overflow-hidden border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                        <table className="w-full text-xs">
                          <thead>
                            <tr className={isDark ? 'bg-slate-700/50' : 'bg-slate-100'}>
                              <th className={`px-3 py-2 text-left font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Element</th>
                              <th className={`px-3 py-2 text-left font-semibold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                                ☀️ Yang (Heavy)
                              </th>
                              <th className={`px-3 py-2 text-left font-semibold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                                🌙 Yin (Gentle)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(POLARITY_TABLE).map(([el, pair]) => (
                              <tr
                                key={el}
                                className={`border-t ${isDark ? 'border-slate-700' : 'border-slate-200'} ${
                                  yearMatrix.yearYongShen.usefulElements?.includes(el)
                                    ? (isDark ? 'bg-green-900/10' : 'bg-green-50')
                                    : yearMatrix.yearYongShen.forbidden?.includes(el)
                                    ? (isDark ? 'bg-red-900/10' : 'bg-red-50')
                                    : ''
                                }`}
                              >
                                <td className="px-3 py-2 font-medium" style={{ color: ELEM_COLORS[el] }}>
                                  {yearMatrix.yearYongShen.usefulElements?.includes(el) && '✓ '}
                                  {yearMatrix.yearYongShen.forbidden?.includes(el) && '🚫 '}
                                  {el}
                                </td>
                                <td className={`px-3 py-2 ${isDark ? 'text-slate-400' : 'text-slate-600'} ${
                                  isYang && yearMatrix.yearYongShen.usefulElements?.includes(el)
                                    ? (isDark ? 'font-semibold text-blue-300' : 'font-semibold text-blue-700')
                                    : ''
                                }`}>
                                  {pair.Yang}
                                </td>
                                <td className={`px-3 py-2 ${isDark ? 'text-slate-400' : 'text-slate-600'} ${
                                  !isYang && yearMatrix.yearYongShen.usefulElements?.includes(el)
                                    ? (isDark ? 'font-semibold text-purple-300' : 'font-semibold text-purple-700')
                                    : ''
                                }`}>
                                  {pair.Yin}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Polarity reason from engine */}
                      <p className={`mt-3 text-xs italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {yearMatrix.yearYongShen.polarityReason}
                      </p>
                    </div>
                  );
                })()}

                {/* TIER 2: Curated Stone Prescriptions */}
                {yearMatrix.yearStones.length > 0 ? (
                  <div className="space-y-5">
                    <div>
                      <h3 className={`text-sm font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        💎 Core Bracelet (year-round wear)
                      </h3>
                      <p className={`text-xs mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {yearMatrix.yearYongShen?.polarityReason || 'Polarity-matched to your Day Master'}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {yearMatrix.yearStones.map((rec, i) => (
                          <div
                            key={i}
                            className={`rounded-lg border p-3 transition-all hover:border-blue-500/50 ${
                              isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-white border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded-full border"
                                  style={{ backgroundColor: rec.stone.color, borderColor: isDark ? '#475569' : '#cbd5e1' }}
                                />
                                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                  {rec.stone.name}
                                </span>
                              </div>
                              {/* Polarity Badge */}
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                rec.stone.polarity === 'Yang'
                                  ? (isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700')
                                  : (isDark ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-100 text-purple-700')
                              }`}>
                                {rec.stone.polarity} {rec.stone.element}
                              </span>
                            </div>
                            {rec.stone.chineseName && (
                              <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {rec.stone.chineseName}
                              </div>
                            )}
                            <div className={`text-xs mt-1 italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {rec.stone.notes}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Yong Shen Reasoning */}
                    {yearMatrix.yearYongShen && (
                      <div className={`text-xs p-3 rounded-lg ${isDark ? 'bg-slate-700/30 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                        <span className="font-semibold">用神 Reasoning: </span>
                        {yearMatrix.yearYongShen.reasoning}
                      </div>
                    )}

                    {/* Danger Months */}
                    {yearMatrix.dangerMonths.length > 0 && (
                      <div>
                        <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          ⚠️ Danger Months — Extra Support Needed
                        </h3>
                        <div className="space-y-2">
                          {yearMatrix.dangerMonths.map((m, i) => (
                            <div
                              key={i}
                              className={`rounded-lg border p-3 flex items-start gap-3 ${
                                isDark ? 'bg-red-900/10 border-red-900/30' : 'bg-red-50 border-red-200'
                              }`}
                            >
                              <span className="text-lg">
                                {DANGER_STYLES[m.dangerLevel].icon}
                              </span>
                              <div>
                                <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                  {m.monthName} ({m.monthStem}{m.monthBranch} {m.branchAnimal})
                                </div>
                                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                  {m.interactions.map(h => `${h.branch1}${h.branch2} ${h.type}`).join(', ')}
                                </div>
                                {m.recommendedStones.length > 0 && (
                                  <div className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                    Extra: {m.recommendedStones.map(s => `${s.stone.name} (${s.stone.polarity} ${s.stone.element})`).join(', ')}
                                  </div>
                                )}
                                {m.yongShen?.status === 'critical_imbalance' && (
                                  <div className={`text-[10px] mt-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                                    🚫 Avoid {m.yongShen.forbidden.join(' & ')} stones this month
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <div className="text-3xl mb-2">✨</div>
                    <div>Your elements are well-balanced this year — no heavy corrections needed!</div>
                    <div className="text-sm mt-1">Perfect harmony — enjoy the smooth road ahead.</div>
                  </div>
                )}
              </section>

              {/* ═══════════════════════════════════════════════════════════════
                  STONE ENCYCLOPEDIA — Yin & Yang Stones for the Five Elements
                  ═══════════════════════════════════════════════════════════════ */}
              <section className={`rounded-xl border overflow-hidden ${
                isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                {/* Clickable Header */}
                <button
                  onClick={() => setShowStoneGuide(prev => !prev)}
                  className={`w-full text-left px-6 py-5 transition-colors ${
                    isDark ? 'hover:bg-slate-700/40' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        💎 Stone Encyclopedia — Yin & Yang Stones for the Five Elements
                      </h2>
                      <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Gemstones carry specific elemental frequencies. Each element has heavy Yang and gentle Yin stones.
                        {!showStoneGuide && ' Tap to explore the full crystal reference guide.'}
                      </p>
                    </div>
                    <span className={`text-2xl transition-transform duration-300 ${showStoneGuide ? 'rotate-180' : ''} ${
                      isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      ▾
                    </span>
                  </div>
                </button>

                {/* Expanded Stone Guide */}
                {showStoneGuide && (
                  <div className={`px-6 pb-6 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    {/* Intro */}
                    <p className={`mt-5 text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      In Chinese metaphysics, the universe is made up of the <strong>Five Elements</strong> (Wood,
                      Fire, Earth, Metal, and Water). Each element has two polarities: <strong>Yang</strong> (active,
                      dynamic, hard, masculine) and <strong>Yin</strong> (passive, receptive, soft, feminine).
                      Gemstones and crystals hold specific energetic frequencies that align with these exact Yin and
                      Yang elemental categories.
                    </p>

                    <div className="space-y-5 mt-5">
                      {/* ── 1. WOOD ────────────────────────────────────────── */}
                      <div className={`rounded-xl overflow-hidden border ${isDark ? 'border-green-800/50' : 'border-green-200'}`}>
                        <div className={`px-4 py-3 ${isDark ? 'bg-green-900/20' : 'bg-green-50'}`}>
                          <h3 className={`font-bold ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                            1. 🪵 Wood — Growth, Vision, Vitality
                          </h3>
                          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Expansion, creativity, and new beginnings. Colors: greens and teals.
                          </p>
                        </div>
                        <div className={`grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x ${
                          isDark ? 'divide-green-800/30' : 'divide-green-100'
                        }`}>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>Yang</span>
                              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>The Sturdy Tree</span>
                            </div>
                            <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              Strong, structured growth, unwavering roots, and leadership.
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {['Malachite', 'Green Jade', 'Emerald'].map(s => (
                                <span key={s} className={`text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-green-900/30 text-green-300 border border-green-800/50' : 'bg-green-100 text-green-800 border border-green-200'}`}>
                                  {s}
                                </span>
                              ))}
                            </div>
                            <p className={`text-[11px] mt-2 italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              Dense, foundational energy — resilience and steady growth.
                            </p>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>Yin</span>
                              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>The Soft Plant / Vine</span>
                            </div>
                            <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              Flexibility, adaptability, gentle healing, and networking.
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {['Green Aventurine', 'Moss Agate', 'Prehnite'].map(s => (
                                <span key={s} className={`text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-green-900/30 text-green-300 border border-green-800/50' : 'bg-green-100 text-green-800 border border-green-200'}`}>
                                  {s}
                                </span>
                              ))}
                            </div>
                            <p className={`text-[11px] mt-2 italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              Softer, soothing energy — gentle renewal through flexibility.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ── 2. FIRE ────────────────────────────────────────── */}
                      <div className={`rounded-xl overflow-hidden border ${isDark ? 'border-red-800/50' : 'border-red-200'}`}>
                        <div className={`px-4 py-3 ${isDark ? 'bg-red-900/20' : 'bg-red-50'}`}>
                          <h3 className={`font-bold ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                            2. 🔥 Fire — Passion, Transformation, Joy
                          </h3>
                          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Illumination, warmth, and dynamic energy. Colors: reds, oranges, pinks, and purples.
                          </p>
                        </div>
                        <div className={`grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x ${
                          isDark ? 'divide-red-800/30' : 'divide-red-100'
                        }`}>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>Yang</span>
                              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>The Sun / Blazing Fire</span>
                            </div>
                            <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              Explosive energy, bright illumination, charisma, and immense power.
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {['Carnelian', 'Ruby', 'Sunstone'].map(s => (
                                <span key={s} className={`text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-red-900/30 text-red-300 border border-red-800/50' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                                  {s}
                                </span>
                              ))}
                            </div>
                            <p className={`text-[11px] mt-2 italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              Highly active — sparking ambition, courage, and intense vitality.
                            </p>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>Yin</span>
                              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>The Candle Flame / Stars</span>
                            </div>
                            <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              Gentle warmth, inner illumination, inspiration, and comfort.
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {['Amethyst', 'Rose Quartz', 'Rhodochrosite'].map(s => (
                                <span key={s} className={`text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-red-900/30 text-red-300 border border-red-800/50' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                                  {s}
                                </span>
                              ))}
                            </div>
                            <p className={`text-[11px] mt-2 italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              Soothing, glowing — emotional healing, quiet passion, spiritual insight.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ── 3. EARTH ───────────────────────────────────────── */}
                      <div className={`rounded-xl overflow-hidden border ${isDark ? 'border-amber-800/50' : 'border-amber-200'}`}>
                        <div className={`px-4 py-3 ${isDark ? 'bg-amber-900/20' : 'bg-amber-50'}`}>
                          <h3 className={`font-bold ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                            3. ⛰️ Earth — Stability, Nourishment, Grounding
                          </h3>
                          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Balance, security, and being centered. Colors: yellows, browns, and earth tones.
                          </p>
                        </div>
                        <div className={`grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x ${
                          isDark ? 'divide-amber-800/30' : 'divide-amber-100'
                        }`}>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>Yang</span>
                              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>The Mountain / Boulder</span>
                            </div>
                            <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              Immovable strength, deep stability, and heavy protection.
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {["Tiger's Eye", 'Smoky Quartz', 'Yellow Jasper'].map(s => (
                                <span key={s} className={`text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-amber-900/30 text-amber-300 border border-amber-800/50' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                                  {s}
                                </span>
                              ))}
                            </div>
                            <p className={`text-[11px] mt-2 italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              Protective shield — heavy grounding and firm boundaries.
                            </p>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>Yin</span>
                              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>The Soft Soil / Sand</span>
                            </div>
                            <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              Nurturing, fertility, adaptability, and motherly support.
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {['Yellow Jade', 'Citrine', 'Picture Jasper'].map(s => (
                                <span key={s} className={`text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-amber-900/30 text-amber-300 border border-amber-800/50' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                                  {s}
                                </span>
                              ))}
                            </div>
                            <p className={`text-[11px] mt-2 italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              Abundance, self-care, and comforting nourishment.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ── 4. METAL ───────────────────────────────────────── */}
                      <div className={`rounded-xl overflow-hidden border ${isDark ? 'border-slate-600' : 'border-slate-300'}`}>
                        <div className={`px-4 py-3 ${isDark ? 'bg-slate-700/40' : 'bg-slate-100'}`}>
                          <h3 className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                            4. ⚔️ Metal — Clarity, Structure, Precision
                          </h3>
                          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Logic, organization, cutting through illusions, and refinement. Colors: white, silver, gold, metallics.
                          </p>
                        </div>
                        <div className={`grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x ${
                          isDark ? 'divide-slate-600' : 'divide-slate-200'
                        }`}>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>Yang</span>
                              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>The Sword / Raw Ore</span>
                            </div>
                            <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              Sharp focus, discipline, justice, and unyielding strength.
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {['Clear Quartz', 'Pyrite', 'Hematite'].map(s => (
                                <span key={s} className={`text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-slate-600 text-slate-200 border border-slate-500' : 'bg-slate-200 text-slate-800 border border-slate-300'}`}>
                                  {s}
                                </span>
                              ))}
                            </div>
                            <p className={`text-[11px] mt-2 italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              Hard, resilient — mental clarity and cutting through distractions.
                            </p>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>Yin</span>
                              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Fine Jewelry / Precious Gems</span>
                            </div>
                            <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              Elegance, inner value, refinement, and purity.
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {['Moonstone', 'White Pearl', 'Howlite'].map(s => (
                                <span key={s} className={`text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-slate-600 text-slate-200 border border-slate-500' : 'bg-slate-200 text-slate-800 border border-slate-300'}`}>
                                  {s}
                                </span>
                              ))}
                            </div>
                            <p className={`text-[11px] mt-2 italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              Luminous, polished — grace, calm precision, and inner reflection.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ── 5. WATER ───────────────────────────────────────── */}
                      <div className={`rounded-xl overflow-hidden border ${isDark ? 'border-blue-800/50' : 'border-blue-200'}`}>
                        <div className={`px-4 py-3 ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                          <h3 className={`font-bold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                            5. 🌊 Water — Intuition, Flow, Wisdom
                          </h3>
                          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Deep intelligence, adaptability, emotions, and movement. Colors: blacks and blues.
                          </p>
                        </div>
                        <div className={`grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x ${
                          isDark ? 'divide-blue-800/30' : 'divide-blue-100'
                        }`}>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>Yang</span>
                              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>The Ocean / Rushing River</span>
                            </div>
                            <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              Powerful momentum, deep reserves, vast intelligence, and overwhelming force.
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {['Lapis Lazuli', 'Black Tourmaline', 'Blue Apatite'].map(s => (
                                <span key={s} className={`text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-blue-900/30 text-blue-300 border border-blue-800/50' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                                  {s}
                                </span>
                              ))}
                            </div>
                            <p className={`text-[11px] mt-2 italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              Deep, expansive force — profound wisdom, truth, clearing major blockages.
                            </p>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>Yin</span>
                              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>The Raindrop / Mist / Clouds</span>
                            </div>
                            <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              Gentle nourishment, deep intuition, calm, and permeating thought.
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {['Aquamarine', 'Blue Lace Agate', 'Black Onyx'].map(s => (
                                <span key={s} className={`text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-blue-900/30 text-blue-300 border border-blue-800/50' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                                  {s}
                                </span>
                              ))}
                            </div>
                            <p className={`text-[11px] mt-2 italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              Gentle, cooling moisture — soothing communication and quiet intuition.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shopping Tip */}
                    <div className={`mt-5 rounded-xl p-4 ${isDark ? 'bg-slate-700/40' : 'bg-slate-100'}`}>
                      <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                        🛒 A Rule of Thumb for Crystal Shopping
                      </h4>
                      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        <div className={`rounded-lg p-3 ${isDark ? 'bg-blue-900/15 border border-blue-800/30' : 'bg-blue-50 border border-blue-100'}`}>
                          <div className={`font-semibold mb-1 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>☀️ Yang Stones</div>
                          <p className="text-xs leading-relaxed">
                            Tend to be highly <strong>transparent</strong> (glass-clear) with rainbows inside,
                            or very <strong>bright, warm, and metallic</strong> (like Clear Quartz or Pyrite).
                            Best for <em>manifesting, taking action, and projecting power outward</em>.
                          </p>
                        </div>
                        <div className={`rounded-lg p-3 ${isDark ? 'bg-purple-900/15 border border-purple-800/30' : 'bg-purple-50 border border-purple-100'}`}>
                          <div className={`font-semibold mb-1 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>🌙 Yin Stones</div>
                          <p className="text-xs leading-relaxed">
                            Tend to be <strong>translucent, milky, or opaque</strong> with muted, cool colors
                            (like Moonstone or Aquamarine).
                            Best for <em>relaxing, healing, and turning inward</em>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </BaziThemeProvider>
        )}
      </main>
    </div>
  );
}
