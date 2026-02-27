/**
 * BaZi Modular Display Page
 * Showcases the atomic design BaZi components using user's profile data
 *
 * Uses: ProfileContext for user data, calculateBaZi for chart calculation
 * Components: FourPillarsGrid, DayMasterCard, ElementDistributionChart (organisms)
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';
import { calculateBaZi } from '../utils/baziCalculator';
import { calculateElementsWithPillarWeights } from '../utils/baziEngine';
import { applySeasonality, getSeasonalWeights } from '../utils/baziSeasonality';
import { applyTrueSolarTime, trueSolarTimeBreakdown } from '../utils/baziWheels';
import FloatingMdWindow from '../components/shared/FloatingMdWindow';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  BaziThemeProvider,
  FourPillarsGrid,
  DayMasterCard,
  ElementDistributionChart,
  NivoElementBar,
  ElementDonut,
  PersonalityRadar,
  ElementCalculationFlaps,
  SeasonalityComparisonChart,
  Stem,
  Branch,
  ElementBadge
} from '../components/bazi';

/**
 * AI Insight Generator for Personality Radar
 * Routes through server-side llmProxy Cloud Function
 */
async function generatePersonalityInsight(insightData) {
  try {
    const { callClaudeProxy } = await import('../services/llmProxyService');
    const prompt = buildInsightPrompt(insightData);

    const result = await callClaudeProxy({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }]
    });

    return result.text || generateLocalInsight(insightData);
  } catch (error) {
    console.error('AI insight error:', error);
    return generateLocalInsight(insightData);
  }
}

function buildInsightPrompt(data) {
  const pillarsDesc = data.pillars ? data.pillars.map((p, i) => {
    const labels = ['Year', 'Month', 'Day', 'Hour'];
    const stemChar = typeof p.stem === 'object' ? p.stem.char : p.stem;
    const branchChar = typeof p.branch === 'object' ? p.branch.char : p.branch;
    return `${labels[i]}: ${stemChar}${branchChar}`;
  }).join(', ') : 'Not provided';

  return `You are an expert BaZi (Chinese astrology) and Five Elements consultant providing personalized personality insights.

PROFILE: ${data.profileName || 'User'}
BIRTH: ${data.birthDate || 'Unknown'}${data.birthTime ? ' at ' + data.birthTime : ''}
ELEMENT CODE: ${data.elementCode}
ARCHETYPE: ${data.archetype}

FOUR PILLARS (八字): ${pillarsDesc}

ELEMENTAL COMPOSITION:
- Wood: ${data.elements?.Wood?.toFixed(1) || 0}%
- Fire: ${data.elements?.Fire?.toFixed(1) || 0}%
- Earth: ${data.elements?.Earth?.toFixed(1) || 0}%
- Metal: ${data.elements?.Metal?.toFixed(1) || 0}%
- Water: ${data.elements?.Water?.toFixed(1) || 0}%

Generate a 3-4 paragraph personalized personality insight that:
1. Describes their core nature based on the elemental balance
2. Identifies their key strengths and how to leverage them
3. Notes potential challenges and growth areas
4. Offers practical guidance for relationships, career, and personal development

Write in second person ("You are..."), be warm and insightful, avoid generic statements. Make it specific to their unique elemental composition.`;
}

function generateLocalInsight(data) {
  // Fallback local insight based on archetype data
  const dominant = Object.entries(data.elements || {})
    .sort(([,a], [,b]) => b - a)[0];

  const elementInsights = {
    Wood: 'Your Wood-dominant nature gives you strong growth potential and vision. You naturally seek expansion and have an innate ability to plan for the future. Focus on flexibility to avoid rigidity.',
    Fire: 'Your Fire-dominant energy brings passion, charisma, and transformative power. You light up rooms and inspire others. Remember to pace yourself to avoid burnout.',
    Earth: 'Your Earth-dominant constitution provides stability, reliability, and nurturing qualities. Others trust and depend on you. Stay open to change when needed.',
    Metal: 'Your Metal-dominant essence gives you precision, clarity, and strong principles. You excel at refining and perfecting. Balance your high standards with compassion.',
    Water: 'Your Water-dominant nature grants wisdom, adaptability, and emotional depth. You flow around obstacles with ease. Maintain boundaries while staying flexible.'
  };

  return `Based on your ${data.archetype} archetype with ${dominant?.[0] || 'balanced'} dominance:\n\n${elementInsights[dominant?.[0]] || 'Your balanced elemental composition gives you versatility and adaptability across different situations.'}\n\nYour unique elemental fingerprint (${data.elementCode}) suggests a personality that combines multiple elemental influences in a distinctive way. Embrace your strengths while being mindful of areas where you can grow.`;
}

// ============================================================================
// SEASONAL ELEMENT WEIGHTING REFERENCE DATA
// 12 Earthly Branches organized by season, with solar terms
// ============================================================================
const SEASONAL_REFERENCE = [
  {
    season: 'Spring', emoji: '🌸', chinese: '春',
    branches: [
      { char: '寅', animal: 'Tiger', polarity: 'Yang', element: 'Wood', term: '立春 Spring Begins' },
      { char: '卯', animal: 'Rabbit', polarity: 'Yin', element: 'Wood', term: '驚蟄 Insects Awaken' },
      { char: '辰', animal: 'Dragon', polarity: 'Yang', element: 'Earth', term: '清明 Clear & Bright', earthTransition: true }
    ]
  },
  {
    season: 'Summer', emoji: '☀️', chinese: '夏',
    branches: [
      { char: '巳', animal: 'Snake', polarity: 'Yin', element: 'Fire', term: '立夏 Summer Begins' },
      { char: '午', animal: 'Horse', polarity: 'Yang', element: 'Fire', term: '芒種 Grain in Ear' },
      { char: '未', animal: 'Goat', polarity: 'Yin', element: 'Earth', term: '小暑 Slight Heat', earthTransition: true }
    ]
  },
  {
    season: 'Autumn', emoji: '🍂', chinese: '秋',
    branches: [
      { char: '申', animal: 'Monkey', polarity: 'Yang', element: 'Metal', term: '立秋 Autumn Begins' },
      { char: '酉', animal: 'Rooster', polarity: 'Yin', element: 'Metal', term: '白露 White Dew' },
      { char: '戌', animal: 'Dog', polarity: 'Yang', element: 'Earth', term: '寒露 Cold Dew', earthTransition: true }
    ]
  },
  {
    season: 'Winter', emoji: '❄️', chinese: '冬',
    branches: [
      { char: '亥', animal: 'Pig', polarity: 'Yin', element: 'Water', term: '立冬 Winter Begins' },
      { char: '子', animal: 'Rat', polarity: 'Yang', element: 'Water', term: '大雪 Heavy Snow' },
      { char: '丑', animal: 'Ox', polarity: 'Yin', element: 'Earth', term: '小寒 Slight Cold', earthTransition: true }
    ]
  }
];

const ELEM_COLORS = {
  wood: '#22c55e', fire: '#ef4444', earth: '#f59e0b', metal: '#d4d4d8', water: '#3b82f6'
};

export default function BaZiModularPage() {
  const { profiles, loading } = useProfiles();
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [chart, setChart] = useState(null);
  const [themeMode, setThemeMode] = useState('dark');
  const [showCompact, setShowCompact] = useState(false);
  const [showHiddenRoots, setShowHiddenRoots] = useState(true);
  const [showTstPanel, setShowTstPanel] = useState(false);
  const [showSeasonalWeights, setShowSeasonalWeights] = useState(false);
  const [seasonalityMd, setSeasonalityMd] = useState('');
  const [showSeasonalityMd, setShowSeasonalityMd] = useState(false);
  const seasonalityMdFileRef = useRef(null);

  // Get selected profile (no auto-select — user must pick)
  const selectedProfile = useMemo(() => {
    return profiles?.find(p => p.id === selectedProfileId) || null;
  }, [profiles, selectedProfileId]);

  // True Solar Time breakdown
  const tstInfo = useMemo(() => {
    if (!selectedProfile?.birthDate) return null;
    const lng = selectedProfile?.location?.coordinates?.lng;
    const gmtOff = selectedProfile?.timezone?.gmtOffsetHours;
    if (lng == null || gmtOff == null) return null;
    const [year, month, day] = selectedProfile.birthDate.split('-').map(Number);
    const [hour = 12, minute = 0] = (selectedProfile.birthTime || '12:00').split(':').map(Number);
    const birthDateObj = new Date(year, month - 1, day, hour, minute);
    return trueSolarTimeBreakdown(birthDateObj, lng, gmtOff);
  }, [selectedProfile]);

  // Calculate BaZi when profile changes (with True Solar Time correction)
  useEffect(() => {
    if (!selectedProfile?.birthDate) return;

    try {
      // Parse birth date
      const birthDate = selectedProfile.birthDate;
      const [year, month, day] = birthDate.split('-').map(Number);
      const [hour = 12, minute = 0] = (selectedProfile.birthTime || '12:00').split(':').map(Number);

      // Apply True Solar Time correction if location data available
      let calcYear = year, calcMonth = month, calcDay = day, calcHour = hour, calcMinute = minute;
      const lng = selectedProfile?.location?.coordinates?.lng;
      const gmtOff = selectedProfile?.timezone?.gmtOffsetHours;
      if (lng != null && gmtOff != null) {
        const corrected = applyTrueSolarTime(new Date(year, month - 1, day, hour, minute), lng, gmtOff);
        calcYear = corrected.getFullYear();
        calcMonth = corrected.getMonth() + 1;
        calcDay = corrected.getDate();
        calcHour = corrected.getHours();
        calcMinute = corrected.getMinutes();
      }

      // Calculate chart with corrected time
      const result = calculateBaZi({ year: calcYear, month: calcMonth, day: calcDay, hour: calcHour, minute: calcMinute });

      if (!result.error) {
        // Re-calculate elements with DAY-DOMINANT pillar weights (5/10/70/15)
        const modularElements = calculateElementsWithPillarWeights(
          result.pillars,
          [0.05, 0.10, 0.70, 0.15]  // Year 5%, Month 10%, Day 70%, Hour 15%
        );

        // Rebuild strengths/weaknesses/missing/dominant from new percentages
        const strengths = [], weaknesses = [], missing = [];
        Object.entries(modularElements.percentages).forEach(([element, pct]) => {
          const numPct = parseFloat(pct);
          if (numPct >= 30) strengths.push({ element, pct: numPct });
          else if (numPct < 5) missing.push({ element, pct: numPct });
          else if (numPct < 10) weaknesses.push({ element, pct: numPct });
        });
        strengths.sort((a, b) => b.pct - a.pct);
        weaknesses.sort((a, b) => a.pct - b.pct);
        missing.sort((a, b) => a.pct - b.pct);

        result.elements = {
          ...modularElements,
          strengths,
          weaknesses,
          missing,
          dominant: strengths[0]?.element || 'Balanced'
        };

        setChart(result);
      }
    } catch (error) {
      console.error('BaZi calculation error:', error);
    }
  }, [selectedProfile]);

  // No auto-select — same as bazi-learning

  // Load Seasonality MD from Firestore on mount
  useEffect(() => {
    getDoc(doc(db, 'global_config', 'bazi_seasonality_md'))
      .then(snap => {
        if (snap.exists() && snap.data().content) {
          setSeasonalityMd(snap.data().content);
        }
      })
      .catch(err => console.error('Failed to load seasonality MD:', err));
  }, []);

  // Import MD from file
  const handleImportSeasonalityMd = useCallback(() => {
    seasonalityMdFileRef.current?.click();
  }, []);

  const handleSeasonalityMdFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === 'string') {
        setSeasonalityMd(text);
        setShowSeasonalityMd(true);
        setDoc(doc(db, 'global_config', 'bazi_seasonality_md'), { content: text, updatedAt: new Date().toISOString() })
          .catch(err => console.error('Failed to save seasonality MD:', err));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  // Export MD to file
  const handleExportSeasonalityMd = useCallback(() => {
    if (!seasonalityMd) return;
    const blob = new Blob([seasonalityMd], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seasonality-adjustment-explained.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [seasonalityMd]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profiles...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeMode === 'dark' ? 'bg-gradient-to-b from-[#0a1628] via-[#0f2847] to-[#0a1628]' : 'bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100'}`}>
      {/* Header */}
      <header className={`${themeMode === 'dark' ? 'bg-slate-900/80' : 'bg-white/80'} backdrop-blur-lg border-b ${themeMode === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className={`${themeMode === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>
                ← Dashboard
              </Link>
              <div className={`h-4 w-px ${themeMode === 'dark' ? 'bg-white/20' : 'bg-slate-300'}`} />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                🎋 BaZi Modular Display
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  themeMode === 'dark'
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    : 'bg-slate-800/20 text-slate-700 border border-slate-300'
                }`}
              >
                {themeMode === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </button>

              {/* Compact Toggle */}
              <button
                onClick={() => setShowCompact(!showCompact)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  showCompact
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                }`}
              >
                {showCompact ? '📐 Compact' : '📏 Full'}
              </button>

              {/* Hidden Roots Toggle */}
              <button
                onClick={() => setShowHiddenRoots(!showHiddenRoots)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  showHiddenRoots
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                }`}
              >
                {showHiddenRoots ? '🔮 Depths On' : '🔮 Depths Off'}
              </button>

              <Link
                to="/bazi-calculator"
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-lg text-amber-300 text-sm transition-colors"
              >
                🧮 Calculator
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Selector */}
        <div className={`mb-8 p-4 rounded-xl ${themeMode === 'dark' ? 'bg-slate-800/50 border border-slate-700' : 'bg-white/80 border border-slate-200'}`}>
          <div className="flex items-center gap-4 flex-wrap">
            <label className={`text-sm font-medium ${themeMode === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Select Profile:
            </label>
            <select
              value={selectedProfileId || ''}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                themeMode === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="">— Select a profile —</option>
              {profiles?.map(profile => (
                <option key={profile.id} value={profile.id}>
                  {profile.displayName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Unknown'}
                </option>
              ))}
            </select>

            {selectedProfile && (
              <div className={`text-sm ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Born: {selectedProfile.birthDate} {selectedProfile.birthTime && `at ${selectedProfile.birthTime}`}
              </div>
            )}

            {/* True Solar Time badge + details */}
            {tstInfo && (() => {
              const fmtTime = (d) => {
                const h = d.getHours(), m = d.getMinutes();
                const ampm = h >= 12 ? 'PM' : 'AM';
                const h12 = h % 12 || 12;
                return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
              };
              const sign = tstInfo.totalOffset >= 0 ? '+' : '\u2212';
              const absOff = Math.abs(tstInfo.totalOffset);
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span
                      onClick={() => setShowTstPanel(p => !p)}
                      title="Click to show True Solar Time calculation details"
                      style={{
                        background: showTstPanel ? 'rgba(234, 179, 8, 0.22)' : 'rgba(234, 179, 8, 0.12)',
                        border: `1px solid rgba(234, 179, 8, ${showTstPanel ? '0.5' : '0.3'})`,
                        borderRadius: '6px',
                        padding: '3px 10px',
                        color: '#facc15',
                        fontWeight: 600,
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        userSelect: 'none',
                      }}>
                      ☀ True Solar Time {showTstPanel ? '▾' : '▸'}
                    </span>
                    <span style={{ color: themeMode === 'dark' ? '#e2e8f0' : '#334155', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.3px' }}>
                      {fmtTime(tstInfo.clockTime)} {sign} {absOff.toFixed(1)} min = <span style={{ color: '#facc15', fontWeight: 700 }}>{fmtTime(tstInfo.correctedTime)}</span>
                    </span>
                    <span style={{ color: themeMode === 'dark' ? '#64748b' : '#94a3b8', fontSize: '10px' }}>
                      (lng {tstInfo.longitude.toFixed(2)}°)
                    </span>
                  </div>

                  {showTstPanel && (
                    <div style={{
                      background: themeMode === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(241, 245, 249, 0.9)',
                      border: `1px solid ${themeMode === 'dark' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(234, 179, 8, 0.3)'}`,
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '11px',
                      fontFamily: "'JetBrains Mono', monospace",
                      color: themeMode === 'dark' ? '#cbd5e1' : '#475569',
                      lineHeight: '1.7',
                      maxWidth: '480px',
                    }}>
                      <div style={{ color: '#facc15', fontWeight: 700, marginBottom: '8px', fontSize: '12px' }}>
                        ☀ True Solar Time Calculation
                      </div>
                      <div>
                        <span style={{ color: themeMode === 'dark' ? '#94a3b8' : '#64748b' }}>Standard meridian:</span>{' '}
                        {tstInfo.standardMeridian.toFixed(0)}° (GMT{tstInfo.gmtOffsetHours >= 0 ? '+' : ''}{tstInfo.gmtOffsetHours})
                      </div>
                      <div>
                        <span style={{ color: themeMode === 'dark' ? '#94a3b8' : '#64748b' }}>Longitude correction:</span>{' '}
                        ({tstInfo.longitude.toFixed(2)} {'\u2212'} {tstInfo.standardMeridian.toFixed(0)}) × 4 ={' '}
                        <span style={{ color: '#facc15' }}>{tstInfo.longitudeCorrection >= 0 ? '+' : '\u2212'}{Math.abs(tstInfo.longitudeCorrection).toFixed(2)} min</span>
                      </div>
                      <div>
                        <span style={{ color: themeMode === 'dark' ? '#94a3b8' : '#64748b' }}>Equation of Time:</span>{' '}
                        <span style={{ color: '#facc15' }}>{tstInfo.equationOfTime >= 0 ? '+' : '\u2212'}{Math.abs(tstInfo.equationOfTime).toFixed(2)} min</span>
                      </div>
                      <div style={{ borderTop: `1px solid ${themeMode === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.3)'}`, marginTop: '6px', paddingTop: '6px' }}>
                        <span style={{ color: themeMode === 'dark' ? '#94a3b8' : '#64748b' }}>Total offset:</span>{' '}
                        <span style={{ color: '#facc15', fontWeight: 700 }}>{sign}{absOff.toFixed(2)} min</span>
                      </div>
                      <div>
                        <span style={{ color: themeMode === 'dark' ? '#94a3b8' : '#64748b' }}>Clock time:</span>{' '}
                        {fmtTime(tstInfo.clockTime)} → <span style={{ color: '#facc15', fontWeight: 700 }}>Solar time: {fmtTime(tstInfo.correctedTime)}</span>
                      </div>
                      <div style={{ marginTop: '8px', fontSize: '10px', color: themeMode === 'dark' ? '#64748b' : '#94a3b8', fontStyle: 'italic', fontFamily: 'inherit' }}>
                        TST = Clock Time + (longitude {'\u2212'} standard meridian) × 4 min/° + Equation of Time
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {selectedProfile && !tstInfo && selectedProfile.birthDate && (
              <div style={{ fontSize: '10px', color: themeMode === 'dark' ? '#64748b' : '#94a3b8', fontStyle: 'italic' }}>
                No location data — solar time correction unavailable
              </div>
            )}
          </div>
        </div>

        {!chart ? (
          <div className={`text-center py-20 ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {profiles?.length === 0
              ? 'No profiles found. Create a profile first.'
              : 'Select a profile to view BaZi chart.'}
          </div>
        ) : (
          <BaziThemeProvider theme={themeMode}>
            <div className="space-y-8">
              {/* Section: Four Pillars Grid */}
              <section>
                <h2 className={`text-xl font-semibold mb-4 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  🎋 Four Pillars of Destiny
                </h2>
                <FourPillarsGrid
                  pillars={chart.pillars}
                  compact={showCompact}
                  showHiddenRoots={showHiddenRoots}
                />
              </section>

              {/* Section: Day Master & Elements (side by side) */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Day Master Card */}
                <section>
                  <h2 className={`text-xl font-semibold mb-4 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    ⭐ Day Master (Your Core Essence)
                  </h2>
                  <DayMasterCard
                    dayMaster={chart.dayMaster}
                    strengthLabel={chart.metaphor?.strength || chart.yinYang?.balance}
                    compact={showCompact}
                  />
                </section>

                {/* Element Donut (Nivo) */}
                <section>
                  <h2 className={`text-xl font-semibold mb-4 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    🍩 Element Distribution
                  </h2>
                  <ElementDonut
                    distribution={chart.elements}
                    height={280}
                    compact={showCompact}
                  />
                </section>
              </div>

              {/* Section: Beautiful Nivo Charts */}
              <section>
                <h2 className={`text-xl font-semibold mb-4 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  📊 Element Analysis (Nivo Charts)
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Nivo Bar Chart */}
                  <NivoElementBar
                    distribution={chart.elements}
                    title="Element Balance (Horizontal)"
                    layout="horizontal"
                    height={250}
                    compact={showCompact}
                  />

                  {/* Nivo Vertical Bar */}
                  <NivoElementBar
                    distribution={chart.elements}
                    title="Element Balance (Vertical)"
                    layout="vertical"
                    height={250}
                    compact={showCompact}
                  />
                </div>
              </section>

              {/* Section: Personality Radar (Raw) */}
              <section>
                <PersonalityRadar
                  data={[
                    { trait: 'Wood', score: chart.elements?.percentages?.Wood || chart.elements?.Wood || 20 },
                    { trait: 'Fire', score: chart.elements?.percentages?.Fire || chart.elements?.Fire || 20 },
                    { trait: 'Earth', score: chart.elements?.percentages?.Earth || chart.elements?.Earth || 20 },
                    { trait: 'Metal', score: chart.elements?.percentages?.Metal || chart.elements?.Metal || 20 },
                    { trait: 'Water', score: chart.elements?.percentages?.Water || chart.elements?.Water || 20 }
                  ]}
                  profileName={selectedProfile?.displayName || `${selectedProfile?.firstName || ''} ${selectedProfile?.lastName || ''}`.trim() || 'Profile'}
                  birthDate={selectedProfile?.birthDate}
                  birthTime={selectedProfile?.birthTime || '12:00'}
                  pillars={chart.pillars}
                  title="Raw Elemental Fingerprint"
                  subtitle="Before Seasonality Adjustment"
                  height={420}
                  compact={showCompact}
                  variant="raw"
                  showPersonalitySummary={false}
                />
              </section>

              {/* Section: Seasonality Adjustment (四季土 Doctrine) */}
              <section>
                <h2 className={`text-xl font-semibold mb-4 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  🌸 Seasonal Influence on Your Elements
                </h2>
                <p className={`text-sm mb-4 ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  In classical BaZi, the season of your birth affects which elements are naturally strong or weak.
                  This is the <strong>四季土 (Four Season Earth)</strong> doctrine.
                </p>

                {/* Seasonal Element Weighting Reference Button + MD Buttons + Expandable Panel */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setShowSeasonalWeights(!showSeasonalWeights)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        showSeasonalWeights
                          ? themeMode === 'dark'
                            ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                          : themeMode === 'dark'
                            ? 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:text-slate-300'
                            : 'bg-slate-100 text-slate-600 border border-slate-300 hover:text-slate-800'
                      }`}
                    >
                      🌏 Seasonal Element Weighting {showSeasonalWeights ? '▾' : '▸'}
                    </button>

                    {/* Seasonality MD button */}
                    <button
                      onClick={() => { if (seasonalityMd) setShowSeasonalityMd(true); }}
                      disabled={!seasonalityMd}
                      style={{
                        padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                        cursor: seasonalityMd ? 'pointer' : 'default', whiteSpace: 'nowrap',
                        background: seasonalityMd ? 'rgba(139, 92, 246, 0.15)' : 'rgba(100, 116, 139, 0.08)',
                        border: `1px solid ${seasonalityMd ? 'rgba(139, 92, 246, 0.4)' : 'rgba(100, 116, 139, 0.15)'}`,
                        color: seasonalityMd ? '#c4b5fd' : '#64748b',
                        opacity: seasonalityMd ? 1 : 0.5,
                        transition: 'all 0.2s',
                      }}
                      title={seasonalityMd ? 'View Seasonality MD' : 'No content — import first'}
                    >
                      Seasonality
                    </button>

                    {/* Import MD button */}
                    <button
                      onClick={handleImportSeasonalityMd}
                      style={{
                        padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                        cursor: 'pointer', whiteSpace: 'nowrap',
                        background: 'rgba(34, 197, 94, 0.12)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        color: '#4ade80',
                        transition: 'all 0.2s',
                      }}
                      title="Import Seasonality MD from file"
                    >
                      Im
                    </button>

                    {/* Export MD button */}
                    <button
                      onClick={handleExportSeasonalityMd}
                      disabled={!seasonalityMd}
                      style={{
                        padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                        cursor: seasonalityMd ? 'pointer' : 'default', whiteSpace: 'nowrap',
                        background: seasonalityMd ? 'rgba(59, 130, 246, 0.12)' : 'rgba(100, 116, 139, 0.08)',
                        border: `1px solid ${seasonalityMd ? 'rgba(59, 130, 246, 0.3)' : 'rgba(100, 116, 139, 0.15)'}`,
                        color: seasonalityMd ? '#60a5fa' : '#64748b',
                        opacity: seasonalityMd ? 1 : 0.5,
                        transition: 'all 0.2s',
                      }}
                      title={seasonalityMd ? 'Export Seasonality MD to file' : 'No content to export'}
                    >
                      Ex
                    </button>
                  </div>

                  {showSeasonalWeights && (() => {
                    const monthBranch = chart.pillars?.[1]?.branch?.char;
                    const isDark = themeMode === 'dark';
                    const borderColor = isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.25)';
                    const headerBg = isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(241, 245, 249, 0.9)';
                    const cellText = isDark ? '#cbd5e1' : '#334155';
                    const mutedText = isDark ? '#64748b' : '#94a3b8';
                    // Flatten all branches with season info for a single table
                    const allRows = SEASONAL_REFERENCE.flatMap(sg =>
                      sg.branches.map((b, i) => ({ ...b, season: sg.season, emoji: sg.emoji, chinese: sg.chinese, isFirstInSeason: i === 0, seasonSize: sg.branches.length }))
                    );
                    return (
                      <div style={{
                        marginTop: '12px',
                        background: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(248, 250, 252, 0.9)',
                        border: `1px solid ${borderColor}`,
                        borderRadius: '12px',
                        overflowX: 'auto',
                      }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', minWidth: '700px' }}>
                          <thead>
                            <tr style={{ background: headerBg }}>
                              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: cellText, borderBottom: `2px solid ${borderColor}`, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Season</th>
                              <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 700, color: cellText, borderBottom: `2px solid ${borderColor}`, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Branch</th>
                              <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 700, color: cellText, borderBottom: `2px solid ${borderColor}`, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Element</th>
                              <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 700, color: mutedText, borderBottom: `2px solid ${borderColor}`, fontSize: '10px' }}>Solar Term</th>
                              {['Wood', 'Fire', 'Earth', 'Metal', 'Water'].map(el => (
                                <th key={el} style={{
                                  padding: '10px 8px',
                                  textAlign: 'center',
                                  fontWeight: 700,
                                  color: ELEM_COLORS[el.toLowerCase()],
                                  borderBottom: `2px solid ${borderColor}`,
                                  fontSize: '11px',
                                  letterSpacing: '0.03em',
                                }}>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: ELEM_COLORS[el.toLowerCase()] }} />
                                    {el}
                                  </span>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {allRows.map((row, idx) => {
                              const weights = getSeasonalWeights(row.char);
                              const isActive = row.char === monthBranch;
                              const isLastInSeason = idx < allRows.length - 1 && allRows[idx + 1]?.isFirstInSeason;
                              const activeBg = isDark ? 'rgba(234, 179, 8, 0.12)' : 'rgba(234, 179, 8, 0.08)';
                              const rowBg = isActive ? activeBg : 'transparent';
                              const seasonBorderBottom = isLastInSeason ? `2px solid ${isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(148, 163, 184, 0.35)'}` : `1px solid ${borderColor}`;
                              return (
                                <tr key={row.char} style={{ background: rowBg, transition: 'background 0.2s' }}>
                                  {/* Season column — merged via rowSpan on first row */}
                                  {row.isFirstInSeason && (
                                    <td rowSpan={row.seasonSize} style={{
                                      padding: '8px 12px',
                                      fontWeight: 700,
                                      fontSize: '12px',
                                      color: isDark ? '#e2e8f0' : '#1e293b',
                                      borderBottom: seasonBorderBottom,
                                      verticalAlign: 'middle',
                                      background: isDark ? 'rgba(30, 41, 59, 0.3)' : 'rgba(241, 245, 249, 0.5)',
                                      borderRight: `1px solid ${borderColor}`,
                                      whiteSpace: 'nowrap',
                                    }}>
                                      <div>{row.emoji} {row.season}</div>
                                      <div style={{ fontSize: '10px', color: mutedText, fontWeight: 400 }}>({row.chinese})</div>
                                    </td>
                                  )}
                                  {/* Branch */}
                                  <td style={{ padding: '7px 8px', borderBottom: seasonBorderBottom, whiteSpace: 'nowrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span style={{ fontSize: '1rem', fontFamily: "'Noto Serif SC', 'Noto Serif TC', serif", color: isDark ? '#f8fafc' : '#0f172a' }}>{row.char}</span>
                                      <span style={{ color: cellText, fontWeight: 600, fontSize: '11px' }}>{row.polarity} {row.animal}</span>
                                      {isActive && (
                                        <span style={{ fontSize: '8px', fontWeight: 700, color: '#facc15', background: 'rgba(250, 204, 21, 0.15)', padding: '1px 5px', borderRadius: '3px', border: '1px solid rgba(250, 204, 21, 0.3)', whiteSpace: 'nowrap' }}>YOU</span>
                                      )}
                                    </div>
                                  </td>
                                  {/* Element */}
                                  <td style={{ padding: '7px 8px', borderBottom: seasonBorderBottom }}>
                                    <span style={{
                                      fontSize: '10px', fontWeight: 700,
                                      color: ELEM_COLORS[row.element.toLowerCase()],
                                      background: `${ELEM_COLORS[row.element.toLowerCase()]}18`,
                                      padding: '2px 7px', borderRadius: '4px',
                                      border: `1px solid ${ELEM_COLORS[row.element.toLowerCase()]}40`,
                                    }}>{row.element}</span>
                                    {row.earthTransition && (
                                      <span style={{ fontSize: '8px', color: '#f59e0b', marginLeft: '4px', fontWeight: 600 }}>四季土</span>
                                    )}
                                  </td>
                                  {/* Solar Term */}
                                  <td style={{ padding: '7px 8px', borderBottom: seasonBorderBottom, color: isDark ? '#e2e8f0' : '#334155', fontSize: '10px', fontStyle: 'italic' }}>
                                    {row.term}
                                  </td>
                                  {/* Element weight columns */}
                                  {['wood', 'fire', 'earth', 'metal', 'water'].map(el => {
                                    const w = weights[el];
                                    const isMax = w === 1.0;
                                    const isHigh = w >= 0.8;
                                    return (
                                      <td key={el} style={{
                                        padding: '7px 6px',
                                        textAlign: 'center',
                                        borderBottom: seasonBorderBottom,
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: '11px',
                                        fontWeight: isMax ? 800 : isHigh ? 700 : 500,
                                        color: isMax ? ELEM_COLORS[el] : isHigh ? ELEM_COLORS[el] : (isDark ? '#e2e8f0' : '#334155'),
                                        background: isMax ? `${ELEM_COLORS[el]}15` : 'transparent',
                                      }}>
                                        {w.toFixed(1)}
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>

                <SeasonalityComparisonChart
                  rawDistribution={{
                    wood: parseFloat(chart.elements?.percentages?.Wood) || chart.elements?.raw?.Wood || 20,
                    fire: parseFloat(chart.elements?.percentages?.Fire) || chart.elements?.raw?.Fire || 20,
                    earth: parseFloat(chart.elements?.percentages?.Earth) || chart.elements?.raw?.Earth || 20,
                    metal: parseFloat(chart.elements?.percentages?.Metal) || chart.elements?.raw?.Metal || 20,
                    water: parseFloat(chart.elements?.percentages?.Water) || chart.elements?.raw?.Water || 20
                  }}
                  monthBranch={chart.pillars?.[1]?.branch?.char || '子'}
                  title="Raw vs Season-Adjusted Elements"
                  showExplanation={true}
                  compact={showCompact}
                />
              </section>

              {/* Section: Large Seasonally Adjusted Radar (Your True Elemental Constitution) */}
              <section>
                {(() => {
                  // Calculate seasonally adjusted values for the large radar
                  const rawDist = {
                    wood: parseFloat(chart.elements?.percentages?.Wood) || chart.elements?.raw?.Wood || 20,
                    fire: parseFloat(chart.elements?.percentages?.Fire) || chart.elements?.raw?.Fire || 20,
                    earth: parseFloat(chart.elements?.percentages?.Earth) || chart.elements?.raw?.Earth || 20,
                    metal: parseFloat(chart.elements?.percentages?.Metal) || chart.elements?.raw?.Metal || 20,
                    water: parseFloat(chart.elements?.percentages?.Water) || chart.elements?.raw?.Water || 20
                  };
                  const monthBranch = chart.pillars?.[1]?.branch?.char || '子';
                  const seasonality = applySeasonality(rawDist, monthBranch);
                  const adjusted = seasonality?.adjustedNormalized || rawDist;

                  return (
                    <PersonalityRadar
                      data={[
                        { trait: 'Wood', score: adjusted.wood || 20 },
                        { trait: 'Fire', score: adjusted.fire || 20 },
                        { trait: 'Earth', score: adjusted.earth || 20 },
                        { trait: 'Metal', score: adjusted.metal || 20 },
                        { trait: 'Water', score: adjusted.water || 20 }
                      ]}
                      profileName={selectedProfile?.displayName || `${selectedProfile?.firstName || ''} ${selectedProfile?.lastName || ''}`.trim() || 'Profile'}
                      birthDate={selectedProfile?.birthDate}
                      birthTime={selectedProfile?.birthTime || '12:00'}
                      pillars={chart.pillars}
                      title="Seasonality Adjusted Elemental Fingerprint"
                      subtitle="This Is The Real You"
                      height={420}
                      compact={showCompact}
                      variant="adjusted"
                      showPersonalitySummary={true}
                      onRequestAIInsight={generatePersonalityInsight}
                    />
                  );
                })()}
              </section>

              {/* Section: Calculation Breakdown (Show Your Work) */}
              <section>
                <h2 className={`text-xl font-semibold mb-4 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  🔍 How Did We Get These Numbers?
                </h2>
                <ElementCalculationFlaps
                  pillars={chart.pillars}
                  elements={chart.elements}
                  title="Click each element to see calculation"
                  compact={showCompact}
                />
              </section>

              {/* Section: Atom Components Demo */}
              <section className={`p-6 rounded-xl ${themeMode === 'dark' ? 'bg-slate-800/50 border border-slate-700' : 'bg-white/80 border border-slate-200'}`}>
                <h2 className={`text-xl font-semibold mb-4 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  🔬 Atom Components
                </h2>
                <p className={`text-sm mb-4 ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Individual building blocks: Stem, Branch, ElementBadge
                </p>

                <div className="flex flex-wrap items-center gap-6">
                  {/* Stems */}
                  <div className="space-y-2">
                    <div className={`text-xs uppercase tracking-wider ${themeMode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                      Heavenly Stems
                    </div>
                    <div className="flex gap-4">
                      <Stem value={chart.dayMaster.stem?.char || chart.pillars[2].stem.char} large showEnglish />
                      <Stem value={chart.pillars[0].stem.char} showElement />
                    </div>
                  </div>

                  {/* Branches */}
                  <div className="space-y-2">
                    <div className={`text-xs uppercase tracking-wider ${themeMode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                      Earthly Branches
                    </div>
                    <div className="flex gap-4">
                      <Branch value={chart.pillars[2].branch.char} large showAnimal showEmoji />
                      <Branch value={chart.pillars[0].branch.char} showElement />
                    </div>
                  </div>

                  {/* Element Badges */}
                  <div className="space-y-2">
                    <div className={`text-xs uppercase tracking-wider ${themeMode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                      Element Badges
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <ElementBadge element="Wood" variant="outlined" />
                      <ElementBadge element="Fire" variant="filled" />
                      <ElementBadge element="Earth" variant="subtle" showIcon />
                      <ElementBadge element="Metal" size="lg" />
                      <ElementBadge element="Water" size="sm" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Quick Stats */}
              <section className={`grid grid-cols-2 md:grid-cols-4 gap-4`}>
                {[
                  { label: 'Day Master', value: chart.dayMaster.fullName || chart.dayMaster.chinese, icon: '⭐' },
                  { label: 'Dominant Element', value: chart.elements?.dominant, icon: '🔥' },
                  { label: 'Yin/Yang', value: chart.yinYang?.balance || `${chart.yinYang?.yangPercent}% Yang`, icon: '☯️' },
                  { label: 'Calculation', value: chart.calculationMethod || 'Sovereign', icon: '✓' }
                ].map((stat, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl text-center ${
                      themeMode === 'dark'
                        ? 'bg-slate-800/50 border border-slate-700'
                        : 'bg-white/80 border border-slate-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className={`text-xs uppercase tracking-wider ${themeMode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                      {stat.label}
                    </div>
                    <div className={`text-lg font-semibold mt-1 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </section>
            </div>
          </BaziThemeProvider>
        )}
      </main>

      {/* Hidden file input for seasonality MD import */}
      <input
        ref={seasonalityMdFileRef}
        type="file"
        accept=".md,.txt,.markdown"
        style={{ display: 'none' }}
        onChange={handleSeasonalityMdFileChange}
      />

      {/* Floating Seasonality MD window */}
      {showSeasonalityMd && seasonalityMd && (
        <FloatingMdWindow
          content={seasonalityMd}
          title="Seasonality Adjustment System"
          onClose={() => setShowSeasonalityMd(false)}
        />
      )}
    </div>
  );
}
