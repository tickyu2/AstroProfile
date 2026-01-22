// ═══════════════════════════════════════════════════════════════════════════
// COMPATIBILITY MATCH PAGE - Full Implementation with Nivo Charts
// ═══════════════════════════════════════════════════════════════════════════
// Features:
// - Profile A & B dropdown selection
// - Element comparison bars (Nivo grouped bar)
// - Relationship radar (5 axes)
// - Synastry heatmap (branch interactions)
// - L0-L2 compatibility narratives
// - Overall score + band
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useMemo } from 'react';
import { useProfiles } from '../contexts/ProfileContext';
import { Link } from 'react-router-dom';
import { calculateBaZi } from '../utils/baziCalculator';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveRadar } from '@nivo/radar';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import {
  BaziThemeProvider,
  FourPillarsGrid,
  DayMasterCard
} from '../components/bazi';

// ═══════════════════════════════════════════════════════════════════════════
// COMPATIBILITY ENGINE (Self-contained implementation)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Compute element compatibility score
 */
function computeElementCompatibility(chartA, chartB) {
  if (!chartA?.elements || !chartB?.elements) return { score: 50, factors: [] };

  const getElementValue = (chart, element) => {
    return chart.elements?.percentages?.[element] || chart.elements?.[element] || 20;
  };

  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  let totalDiff = 0;

  elements.forEach(el => {
    const valA = getElementValue(chartA, el);
    const valB = getElementValue(chartB, el);
    totalDiff += Math.abs(valA - valB);
  });

  const avgDiff = totalDiff / elements.length;
  const score = Math.max(0, Math.min(100, 100 - avgDiff * 2));

  return {
    score,
    factors: [{
      id: 'elements_balance',
      label: 'Elemental Balance',
      impact: score > 60 ? 'positive' : score < 40 ? 'challenging' : 'neutral',
      explanation: score > 60
        ? 'Your elemental distributions complement each other well.'
        : score < 40
        ? 'Different elemental emphases may require conscious effort.'
        : 'Moderate elemental alignment provides balanced foundation.'
    }]
  };
}

/**
 * Compute Day Master compatibility based on element cycles
 */
function computeDayMasterCompatibility(chartA, chartB) {
  if (!chartA?.dayMaster || !chartB?.dayMaster) return { score: 50, factors: [] };

  const elementA = chartA.dayMaster.element;
  const elementB = chartB.dayMaster.element;

  const productionCycle = {
    Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood'
  };
  const controlCycle = {
    Wood: 'Earth', Earth: 'Water', Water: 'Fire', Fire: 'Metal', Metal: 'Wood'
  };

  let score = 50;
  let relationship = 'neutral';

  if (elementA === elementB) {
    score = 70; relationship = 'same element - natural understanding';
  } else if (productionCycle[elementA] === elementB) {
    score = 85; relationship = 'A nurtures B - supportive flow';
  } else if (productionCycle[elementB] === elementA) {
    score = 85; relationship = 'B nurtures A - supportive flow';
  } else if (controlCycle[elementA] === elementB) {
    score = 40; relationship = 'A challenges B - growth through friction';
  } else if (controlCycle[elementB] === elementA) {
    score = 40; relationship = 'B challenges A - growth through friction';
  }

  return {
    score,
    factors: [{
      id: 'day_master_relation',
      label: 'Day Master Relationship',
      impact: score > 60 ? 'positive' : score < 50 ? 'challenging' : 'neutral',
      explanation: `${elementA} ↔ ${elementB}: ${relationship}`
    }]
  };
}

/**
 * Compute branch interactions (synastry matrix)
 */
function computeBranchInteractions(chartA, chartB) {
  const liuHe = {
    '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯',
    '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午'
  };
  const sanHeGroups = [
    ['寅', '午', '戌'], ['申', '子', '辰'], ['巳', '酉', '丑'], ['亥', '卯', '未']
  ];
  const chong = {
    '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅',
    '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳'
  };

  const pillars = ['year', 'month', 'day', 'hour'];
  const matrix = [];
  let totalScore = 0;
  let interactions = 0;

  const getBranch = (chart, pillar) => {
    if (!chart?.pillars) return null;
    const p = Array.isArray(chart.pillars)
      ? chart.pillars.find(p => p.type === pillar) || chart.pillars[pillars.indexOf(pillar)]
      : chart.pillars[pillar];
    return p?.branch?.char || p?.branch || null;
  };

  pillars.forEach(pA => {
    const row = [];
    pillars.forEach(pB => {
      const branchA = getBranch(chartA, pA);
      const branchB = getBranch(chartB, pB);
      let interaction = 'neutral';
      let score = 0;

      if (branchA && branchB) {
        if (liuHe[branchA] === branchB) { interaction = 'harmony'; score = 8; }
        else if (sanHeGroups.some(g => g.includes(branchA) && g.includes(branchB) && branchA !== branchB)) {
          interaction = 'trine'; score = 10;
        }
        else if (chong[branchA] === branchB) { interaction = 'clash'; score = -10; }
        totalScore += score;
        interactions++;
      }
      row.push({ interaction, score, branchA, branchB });
    });
    matrix.push(row);
  });

  const avgScore = interactions > 0 ? totalScore / interactions : 0;
  return { matrix, score: Math.max(0, Math.min(100, 50 + avgScore * 5)) };
}

/**
 * Aggregate all compatibility scores
 */
function computeCompatibility(chartA, chartB) {
  const elements = computeElementCompatibility(chartA, chartB);
  const dayMaster = computeDayMasterCompatibility(chartA, chartB);
  const branches = computeBranchInteractions(chartA, chartB);

  const weights = { elements: 0.4, dayMaster: 0.35, branches: 0.25 };
  const score = elements.score * weights.elements + dayMaster.score * weights.dayMaster + branches.score * weights.branches;

  let band = 'mixed';
  if (score < 40) band = 'challenging';
  else if (score >= 60 && score < 80) band = 'harmonious';
  else if (score >= 80) band = 'intense';

  const axes = [
    { id: 'elemental', label: 'Elemental Synergy', score: elements.score },
    { id: 'daymaster', label: 'Core Identity', score: dayMaster.score },
    { id: 'branches', label: 'Life Rhythm', score: branches.score },
    { id: 'support', label: 'Mutual Support', score: Math.round((elements.score + dayMaster.score) / 2) },
    { id: 'growth', label: 'Growth Potential', score: Math.round((dayMaster.score + branches.score) / 2) }
  ];

  const bandDesc = {
    challenging: 'This pairing requires conscious effort. Growth comes through differences.',
    mixed: 'A balanced blend of harmony and challenge with growth opportunities.',
    harmonious: 'Natural flow and understanding. Communication feels effortless.',
    intense: 'A powerful, dynamic connection with strong resonance.'
  };

  return {
    score: Math.round(score),
    band,
    breakdown: {
      elements: Math.round(elements.score),
      dayMaster: Math.round(dayMaster.score),
      branches: Math.round(branches.score)
    },
    factors: [...elements.factors, ...dayMaster.factors],
    axes,
    synastryMatrix: branches.matrix,
    explanation: {
      l0_summary: bandDesc[band],
      l1_factors: [...elements.factors, ...dayMaster.factors, {
        name: 'Branch Interactions',
        influence: branches.score > 60 ? 'positive' : branches.score < 40 ? 'challenging' : 'neutral',
        explanation: 'The timing and rhythm patterns between your charts.'
      }],
      l2_math: {
        weights,
        scores: { elements: elements.score, dayMaster: dayMaster.score, branches: branches.score },
        formula: `${elements.score.toFixed(1)}×0.4 + ${dayMaster.score.toFixed(1)}×0.35 + ${branches.score.toFixed(1)}×0.25 = ${score.toFixed(1)}`
      }
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// NIVO CHART COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function ElementComparisonBars({ chartA, chartB, nameA, nameB }) {
  const getVal = (chart, el) => chart?.elements?.percentages?.[el] || chart?.elements?.[el] || 20;
  const data = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'].map(el => ({
    element: el, [nameA]: getVal(chartA, el), [nameB]: getVal(chartB, el)
  }));

  return (
    <div style={{ height: 280 }}>
      <ResponsiveBar
        data={data}
        keys={[nameA, nameB]}
        indexBy="element"
        margin={{ top: 20, right: 120, bottom: 50, left: 60 }}
        padding={0.3}
        groupMode="grouped"
        colors={['#8b5cf6', '#ec4899']}
        borderRadius={4}
        axisBottom={{ tickSize: 0, tickPadding: 10, legend: 'Element', legendPosition: 'middle', legendOffset: 36 }}
        axisLeft={{ tickSize: 0, tickPadding: 10, legend: '%', legendPosition: 'middle', legendOffset: -45 }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="#fff"
        legends={[{ dataFrom: 'keys', anchor: 'bottom-right', direction: 'column', translateX: 110, itemWidth: 100, itemHeight: 20, itemTextColor: '#999', symbolSize: 12 }]}
        theme={{ axis: { ticks: { text: { fill: '#94a3b8' } } }, legends: { text: { fill: '#94a3b8' } }, labels: { text: { fill: '#fff', fontWeight: 600 } } }}
      />
    </div>
  );
}

function RelationshipRadar({ axes }) {
  const data = axes.map(a => ({ axis: a.label, score: a.score }));
  return (
    <div style={{ height: 320 }}>
      <ResponsiveRadar
        data={data}
        keys={['score']}
        indexBy="axis"
        maxValue={100}
        margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
        curve="linearClosed"
        borderWidth={2}
        borderColor="#8b5cf6"
        gridLabelOffset={20}
        dotSize={8}
        dotColor="#8b5cf6"
        dotBorderWidth={2}
        dotBorderColor="#fff"
        colors={['rgba(139, 92, 246, 0.4)']}
        fillOpacity={0.6}
        motionConfig="gentle"
        theme={{ axis: { ticks: { text: { fill: '#94a3b8' } } }, grid: { line: { stroke: '#334155' } } }}
      />
    </div>
  );
}

function SynastryHeatmap({ matrix }) {
  const labels = ['Year', 'Month', 'Day', 'Hour'];
  const data = labels.map((label, i) => ({
    id: label,
    data: labels.map((_, j) => ({ x: labels[j], y: matrix[i]?.[j]?.score || 0 }))
  }));

  return (
    <div style={{ height: 280 }}>
      <ResponsiveHeatMap
        data={data}
        margin={{ top: 40, right: 60, bottom: 60, left: 60 }}
        axisTop={{ tickSize: 0, tickPadding: 5, legend: 'Person B', legendPosition: 'middle', legendOffset: -30 }}
        axisLeft={{ tickSize: 0, tickPadding: 5, legend: 'Person A', legendPosition: 'middle', legendOffset: -50 }}
        colors={{ type: 'diverging', scheme: 'red_yellow_green', divergeAt: 0.5, minValue: -10, maxValue: 10 }}
        emptyColor="#1e293b"
        borderRadius={4}
        borderColor="#0f172a"
        labelTextColor="#fff"
        theme={{ axis: { ticks: { text: { fill: '#94a3b8' } } } }}
      />
    </div>
  );
}

function ScoreBadge({ score, band }) {
  const colors = {
    challenging: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-300' },
    mixed: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-300' },
    harmonious: { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-300' },
    intense: { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-300' }
  }[band] || { bg: 'bg-slate-500/20', border: 'border-slate-500/50', text: 'text-slate-300' };

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-xl p-6 text-center`}>
      <div className="text-5xl font-bold text-white mb-2">{score}</div>
      <div className={`text-lg font-medium ${colors.text} capitalize`}>{band}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function CompatibilityMatchPage() {
  const { profiles, loading: profilesLoading } = useProfiles();

  const [selectedProfileA, setSelectedProfileA] = useState(null);
  const [selectedProfileB, setSelectedProfileB] = useState(null);
  const [chartA, setChartA] = useState(null);
  const [chartB, setChartB] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState(null);

  // Calculate BaZi chart when profile A changes
  useEffect(() => {
    if (!selectedProfileA?.birthDate) { setChartA(null); return; }
    try {
      const [year, month, day] = selectedProfileA.birthDate.split('-').map(Number);
      const [hour = 12, minute = 0] = (selectedProfileA.birthTime || '12:00').split(':').map(Number);
      const result = calculateBaZi({ year, month, day, hour, minute });
      if (!result.error) setChartA(result);
    } catch (e) { console.error('Chart A error:', e); setChartA(null); }
  }, [selectedProfileA]);

  // Calculate BaZi chart when profile B changes
  useEffect(() => {
    if (!selectedProfileB?.birthDate) { setChartB(null); return; }
    try {
      const [year, month, day] = selectedProfileB.birthDate.split('-').map(Number);
      const [hour = 12, minute = 0] = (selectedProfileB.birthTime || '12:00').split(':').map(Number);
      const result = calculateBaZi({ year, month, day, hour, minute });
      if (!result.error) setChartB(result);
    } catch (e) { console.error('Chart B error:', e); setChartB(null); }
  }, [selectedProfileB]);

  // Compute compatibility when both charts ready
  const compatibility = useMemo(() => {
    if (!chartA || !chartB) return null;
    return computeCompatibility(chartA, chartB);
  }, [chartA, chartB]);

  // Auto-select first two profiles
  useEffect(() => {
    if (profiles?.length >= 2 && !selectedProfileA) setSelectedProfileA(profiles[0]);
    if (profiles?.length >= 2 && !selectedProfileB) setSelectedProfileB(profiles[1]);
  }, [profiles, selectedProfileA, selectedProfileB]);

  if (profilesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading profiles...</div>
      </div>
    );
  }

  const nameA = selectedProfileA?.displayName || selectedProfileA?.firstName || 'Person A';
  const nameB = selectedProfileB?.displayName || selectedProfileB?.firstName || 'Person B';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                ← Dashboard
              </Link>
              <div className="h-4 w-px bg-white/20" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Compatibility Match
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Selectors - Dropdowns */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Profile A Dropdown */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <label className="text-sm font-medium text-purple-300 mb-2 block">Person A</label>
            <select
              value={selectedProfileA?.id || ''}
              onChange={(e) => setSelectedProfileA(profiles?.find(p => p.id === e.target.value) || null)}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="">Select Profile A</option>
              {profiles?.map(profile => (
                <option key={profile.id} value={profile.id}>
                  {profile.displayName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Unknown'}
                </option>
              ))}
            </select>
            {selectedProfileA && (
              <div className="mt-2 text-sm text-slate-400">
                Born: {selectedProfileA.birthDate} {selectedProfileA.birthTime && `at ${selectedProfileA.birthTime}`}
              </div>
            )}
          </div>

          {/* Profile B Dropdown */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <label className="text-sm font-medium text-pink-300 mb-2 block">Person B</label>
            <select
              value={selectedProfileB?.id || ''}
              onChange={(e) => setSelectedProfileB(profiles?.find(p => p.id === e.target.value) || null)}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            >
              <option value="">Select Profile B</option>
              {profiles?.map(profile => (
                <option key={profile.id} value={profile.id}>
                  {profile.displayName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Unknown'}
                </option>
              ))}
            </select>
            {selectedProfileB && (
              <div className="mt-2 text-sm text-slate-400">
                Born: {selectedProfileB.birthDate} {selectedProfileB.birthTime && `at ${selectedProfileB.birthTime}`}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {!chartA || !chartB ? (
          <div className="text-center py-20 text-slate-400">
            {profiles?.length < 2
              ? 'Please create at least two profiles to analyze compatibility.'
              : 'Select two profiles to analyze compatibility.'}
          </div>
        ) : compatibility ? (
          <BaziThemeProvider theme="dark">
            <div className="space-y-8">
              {/* Overall Score + Summary */}
              <section className="grid md:grid-cols-3 gap-6">
                <ScoreBadge score={compatibility.score} band={compatibility.band} />
                <div className="md:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Relationship Summary</h3>
                  <p className="text-slate-300 leading-relaxed">{compatibility.explanation.l0_summary}</p>
                </div>
              </section>

              {/* Breakdown Bars */}
              <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Compatibility Breakdown</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Elements', value: compatibility.breakdown.elements, color: 'bg-green-500' },
                    { label: 'Day Master', value: compatibility.breakdown.dayMaster, color: 'bg-purple-500' },
                    { label: 'Life Rhythm', value: compatibility.breakdown.branches, color: 'bg-blue-500' }
                  ].map(item => (
                    <div key={item.label} className="text-center">
                      <div className="text-sm text-slate-400 mb-2">{item.label}</div>
                      <div className="text-2xl font-bold text-white mb-2">{item.value}</div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} transition-all duration-500`} style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Charts Row */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Element Comparison */}
                <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Element Comparison</h3>
                  <ElementComparisonBars chartA={chartA} chartB={chartB} nameA={nameA} nameB={nameB} />
                </section>

                {/* Relationship Radar */}
                <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Relationship Shape</h3>
                  <RelationshipRadar axes={compatibility.axes} />
                </section>
              </div>

              {/* Synastry Heatmap */}
              <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Synastry Heatmap</h3>
                <p className="text-sm text-slate-400 mb-4">Pillar interactions: harmonies (green) and clashes (red)</p>
                <SynastryHeatmap matrix={compatibility.synastryMatrix} />
              </section>

              {/* Key Factors (L1) */}
              <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Key Factors</h3>
                <div className="space-y-3">
                  {compatibility.explanation.l1_factors.map((factor, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        factor.influence === 'positive' || factor.impact === 'positive' ? 'bg-green-500/20 text-green-300' :
                        factor.influence === 'challenging' || factor.impact === 'challenging' ? 'bg-red-500/20 text-red-300' :
                        'bg-slate-600/50 text-slate-300'
                      }`}>
                        {factor.influence || factor.impact}
                      </span>
                      <div>
                        <span className="font-medium text-white">{factor.name || factor.label}: </span>
                        <span className="text-slate-300">{factor.explanation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* L2 Math (Collapsible) */}
              <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <details>
                  <summary className="text-lg font-semibold text-white cursor-pointer hover:text-purple-300 transition-colors">
                    Calculation Details (L2)
                  </summary>
                  <div className="mt-4 p-4 bg-slate-900/50 rounded-lg font-mono text-sm text-slate-300">
                    <div className="mb-2">Weights: Elements (40%), Day Master (35%), Branches (25%)</div>
                    <div className="text-purple-300">{compatibility.explanation.l2_math.formula}</div>
                  </div>
                </details>
              </section>

              {/* Side-by-Side Four Pillars */}
              <section>
                <h3 className="text-xl font-semibold text-white mb-4">Four Pillars Comparison</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-center text-purple-300 font-medium mb-3">{nameA}</div>
                    <FourPillarsGrid pillars={chartA.pillars} compact />
                  </div>
                  <div>
                    <div className="text-center text-pink-300 font-medium mb-3">{nameB}</div>
                    <FourPillarsGrid pillars={chartB.pillars} compact />
                  </div>
                </div>
              </section>

              {/* Day Master Cards */}
              <section className="grid md:grid-cols-2 gap-6">
                <DayMasterCard dayMaster={chartA.dayMaster} compact />
                <DayMasterCard dayMaster={chartB.dayMaster} compact />
              </section>
            </div>
          </BaziThemeProvider>
        ) : null}
      </main>
    </div>
  );
}

// End of CompatibilityMatchPage
