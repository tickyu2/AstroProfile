/**
 * ============================================================================
 * SEASONALITY COMPARISON CHART - 8-CHART CATHEDRAL LAYOUT
 * ============================================================================
 *
 * The complete "Before → After" pilgrimage through elemental transformation.
 *
 * Layout: 2 columns × 4 rows = 8 charts total
 *
 * LEFT COLUMN (Raw/Unadjusted):
 *   1. Raw Donut Chart
 *   2. Raw Horizontal Bar Chart
 *   3. Raw Vertical Bar Chart
 *   4. Raw Radar Fingerprint
 *
 * RIGHT COLUMN (Adjusted/Seasonality-Weighted):
 *   5. Adjusted Donut Chart
 *   6. Adjusted Horizontal Bar Chart
 *   7. Adjusted Vertical Bar Chart
 *   8. Super-Imposed Radar (raw faint + adjusted bold)
 *
 * Enhanced with:
 * - Collapsible "Show Calculation Details" panel (Khan Academy style)
 * - Rich tooltips showing raw → weight → adjusted → delta
 * - Full transparency - no black boxes
 *
 * Created: January 2026
 * Based on: Classical 四季土 (Four Season Earth) Doctrine
 * Enhanced by: Brother Copilot's best practices
 * ============================================================================
 */

import React, { useMemo, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveRadar } from '@nivo/radar';
import { ResponsivePie } from '@nivo/pie';
import {
  applySeasonality,
  ELEMENT_COLORS,
  ELEMENT_CHINESE
} from '../../../utils/baziSeasonality';
import { useBaziTheme, getElementIcon } from '../theme/BaziTheme';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function SeasonalityComparisonChart({
  rawDistribution,
  monthBranch,
  title = "Seasonality Adjustment",
  showExplanation = true,
  compact = false
}) {
  const theme = useBaziTheme();
  const isDark = theme?.mode === 'dark' || true;
  const [showDetails, setShowDetails] = useState(false);

  // Normalize raw distribution to lowercase keys
  const normalizedRaw = useMemo(() => ({
    wood: rawDistribution?.wood || rawDistribution?.Wood || 0,
    fire: rawDistribution?.fire || rawDistribution?.Fire || 0,
    earth: rawDistribution?.earth || rawDistribution?.Earth || 0,
    metal: rawDistribution?.metal || rawDistribution?.Metal || 0,
    water: rawDistribution?.water || rawDistribution?.Water || 0
  }), [rawDistribution]);

  // Apply seasonality adjustment - now includes all the enhanced data
  const seasonalityResult = useMemo(() => {
    if (!rawDistribution || !monthBranch) return null;
    return applySeasonality(normalizedRaw, monthBranch);
  }, [normalizedRaw, monthBranch]);

  if (!seasonalityResult) {
    return (
      <div className="p-4 text-center text-white/40">
        No data available for seasonality analysis
      </div>
    );
  }

  // Use the enhanced data structure
  const { rawNormalized, adjustedNormalized, deltas, weights } = seasonalityResult;

  return (
    <div className="space-y-6">
      {/* Header with Season Info */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
          <span className="text-2xl">{seasonalityResult.seasonEmoji}</span>
          {title}
        </h3>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full ${isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'} text-sm`}>
            {seasonalityResult.seasonChinese} Season • {monthBranch} Month
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-white/30 border border-white/50"></div>
              <span className={isDark ? 'text-white/60' : 'text-slate-500'}>Raw</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className={isDark ? 'text-white/60' : 'text-slate-500'}>Adjusted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dominant Element Change Indicator */}
      {seasonalityResult.dominantChanged && (
        <div className={`p-3 rounded-lg ${isDark ? 'bg-purple-500/20 border-purple-500/30' : 'bg-purple-50 border-purple-200'} border`}>
          <div className={`flex items-center gap-2 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
            <span className="text-xl">⚡</span>
            <span className="font-medium">Dominant Element Shifted!</span>
          </div>
          <p className={`text-sm mt-1 ${isDark ? 'text-purple-200/80' : 'text-purple-600'}`}>
            {getElementIcon(seasonalityResult.dominantBefore)} {capitalize(seasonalityResult.dominantBefore)}
            {' → '}
            {getElementIcon(seasonalityResult.dominantAfter)} {capitalize(seasonalityResult.dominantAfter)}
          </p>
        </div>
      )}

      {/* ================================================================== */}
      {/* 8-CHART GRID: 2 columns × 4 rows                                  */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Column Headers */}
        <div className={`text-center py-2 rounded-t-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-200'}`}>
          <h4 className={`font-semibold ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
            📊 Raw Distribution (Before)
          </h4>
        </div>
        <div className={`text-center py-2 rounded-t-lg ${isDark ? 'bg-amber-500/20' : 'bg-amber-100'}`}>
          <h4 className={`font-semibold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
            ✨ Seasonally Adjusted (After)
          </h4>
        </div>

        {/* Row 1: Donut Charts */}
        <ChartCard title="Proportional Distribution" isDark={isDark}>
          <div className="h-[220px]">
            <DonutChart distribution={rawNormalized} isRaw={true} isDark={isDark} />
          </div>
        </ChartCard>
        <ChartCard title="Proportional Distribution" isDark={isDark} highlight>
          <div className="h-[220px]">
            <DonutChart
              distribution={adjustedNormalized}
              isRaw={false}
              isDark={isDark}
              seasonality={seasonalityResult}
            />
          </div>
        </ChartCard>

        {/* Row 2: Horizontal Bar Charts */}
        <ChartCard title="Horizontal Comparison" isDark={isDark}>
          <div className="h-[200px]">
            <HorizontalBarChart distribution={rawNormalized} isRaw={true} isDark={isDark} />
          </div>
        </ChartCard>
        <ChartCard title="Horizontal Comparison" isDark={isDark} highlight>
          <div className="h-[200px]">
            <HorizontalBarChart
              distribution={adjustedNormalized}
              seasonality={seasonalityResult}
              isRaw={false}
              isDark={isDark}
            />
          </div>
        </ChartCard>

        {/* Row 3: Vertical Bar Charts */}
        <ChartCard title="Element Ranking" isDark={isDark}>
          <div className="h-[200px]">
            <VerticalBarChart distribution={rawNormalized} isRaw={true} isDark={isDark} />
          </div>
        </ChartCard>
        <ChartCard title="Element Ranking" isDark={isDark} highlight>
          <div className="h-[200px]">
            <VerticalBarChart
              distribution={adjustedNormalized}
              seasonality={seasonalityResult}
              isRaw={false}
              isDark={isDark}
            />
          </div>
        </ChartCard>

        {/* Row 4: Radar Charts - The Crown Jewel */}
        <ChartCard title="Elemental Fingerprint" isDark={isDark}>
          <div className="h-[280px]">
            <RadarChart distribution={rawNormalized} isRaw={true} isDark={isDark} />
          </div>
        </ChartCard>
        <ChartCard title="Super-Imposed Fingerprint" isDark={isDark} highlight>
          <div className="h-[280px]">
            <SuperImposedRadar
              rawDistribution={rawNormalized}
              adjustedDistribution={adjustedNormalized}
              isDark={isDark}
            />
          </div>
          <div className="flex justify-center gap-6 mt-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-white/30"></div>
              <span className={isDark ? 'text-white/50' : 'text-slate-400'}>Raw (Faint)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-amber-500"></div>
              <span className={isDark ? 'text-white/50' : 'text-slate-400'}>Adjusted (Bold)</span>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* ================================================================== */}
      {/* SEASONAL WEIGHTS TABLE                                            */}
      {/* ================================================================== */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-slate-200'} border`}>
        <h4 className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
          <span>⚖️</span>
          Seasonal Weight Multipliers ({monthBranch} Month - {seasonalityResult.seasonChinese})
        </h4>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(weights).map(([element, weight]) => (
            <div
              key={element}
              className="p-2 rounded-lg text-center transition-all hover:scale-105"
              style={{
                backgroundColor: `${ELEMENT_COLORS[element]}20`,
                borderColor: ELEMENT_COLORS[element],
                borderWidth: weight === 1.0 ? 2 : 1,
                borderStyle: 'solid'
              }}
            >
              <div className="text-lg">{getElementIcon(element)}</div>
              <div className={`text-xs mt-1 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                {capitalize(element)}
              </div>
              <div
                className="font-mono font-bold mt-1"
                style={{ color: ELEMENT_COLORS[element] }}
              >
                ×{weight.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================== */}
      {/* IMPACT INDICATORS (Gainers & Losers)                              */}
      {/* ================================================================== */}
      <div className="grid grid-cols-2 gap-4">
        {/* Gainers */}
        <div className={`p-4 rounded-xl ${isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'} border`}>
          <h4 className={`text-sm font-medium mb-2 flex items-center gap-2 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
            <span>📈</span>
            Strengthened by Season
          </h4>
          {Object.entries(deltas)
            .filter(([_, delta]) => delta > 0.5)
            .sort((a, b) => b[1] - a[1])
            .map(([element, delta]) => (
              <div key={element} className="flex items-center justify-between mb-1">
                <span className={`flex items-center gap-2 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                  {getElementIcon(element)} {capitalize(element)}
                  <span className={isDark ? 'text-white/40' : 'text-slate-400'}>{ELEMENT_CHINESE[element]}</span>
                </span>
                <span className={`font-mono ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  +{delta.toFixed(1)}%
                </span>
              </div>
            ))}
          {Object.entries(deltas).filter(([_, d]) => d > 0.5).length === 0 && (
            <p className={`text-sm ${isDark ? 'text-white/40' : 'text-slate-400'}`}>No significant gains</p>
          )}
        </div>

        {/* Losers */}
        <div className={`p-4 rounded-xl ${isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'} border`}>
          <h4 className={`text-sm font-medium mb-2 flex items-center gap-2 ${isDark ? 'text-red-400' : 'text-red-700'}`}>
            <span>📉</span>
            Weakened by Season
          </h4>
          {Object.entries(deltas)
            .filter(([_, delta]) => delta < -0.5)
            .sort((a, b) => a[1] - b[1])
            .map(([element, delta]) => (
              <div key={element} className="flex items-center justify-between mb-1">
                <span className={`flex items-center gap-2 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                  {getElementIcon(element)} {capitalize(element)}
                  <span className={isDark ? 'text-white/40' : 'text-slate-400'}>{ELEMENT_CHINESE[element]}</span>
                </span>
                <span className={`font-mono ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  {delta.toFixed(1)}%
                </span>
              </div>
            ))}
          {Object.entries(deltas).filter(([_, d]) => d < -0.5).length === 0 && (
            <p className={`text-sm ${isDark ? 'text-white/40' : 'text-slate-400'}`}>No significant weakening</p>
          )}
        </div>
      </div>

      {/* ================================================================== */}
      {/* COLLAPSIBLE CALCULATION DETAILS (Khan Academy Style)              */}
      {/* ================================================================== */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-slate-200'} border`}>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-white/80 hover:text-white' : 'text-slate-700 hover:text-slate-900'} transition-colors`}
        >
          <span className="text-lg">{showDetails ? '📖' : '📚'}</span>
          {showDetails ? 'Hide Calculation Details' : 'Show Calculation Details'}
          <span className="ml-2">{showDetails ? '▲' : '▼'}</span>
        </button>

        {showDetails && (
          <CalculationDetailsPanel
            seasonality={seasonalityResult}
            isDark={isDark}
          />
        )}
      </div>

      {/* ================================================================== */}
      {/* EDUCATIONAL EXPLANATION                                           */}
      {/* ================================================================== */}
      {showExplanation && (
        <div className={`p-4 rounded-xl ${isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'} border`}>
          <h4 className={`text-sm font-medium mb-2 flex items-center gap-2 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
            <span>📚</span>
            What This Means
          </h4>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
            {seasonalityResult.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CALCULATION DETAILS PANEL (Show Your Work)
// ============================================================================

function CalculationDetailsPanel({ seasonality, isDark }) {
  const elements = ['wood', 'fire', 'earth', 'metal', 'water'];

  return (
    <div className="mt-4 space-y-4">
      {/* Context */}
      <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
        <h5 className={`font-semibold text-sm mb-2 ${isDark ? 'text-white/90' : 'text-slate-800'}`}>
          Seasonality Context
        </h5>
        <div className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
          <p>Month Branch: <strong>{seasonality.monthBranch}</strong></p>
          <p>Season Type: <strong>{seasonality.season}</strong></p>
          <p>Season (Chinese): <strong>{seasonality.seasonChinese}</strong></p>
        </div>
      </div>

      {/* Element-by-Element Breakdown Table */}
      <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
        <h5 className={`font-semibold text-sm mb-2 ${isDark ? 'text-white/90' : 'text-slate-800'}`}>
          Element-by-Element Breakdown
        </h5>
        <div className="overflow-x-auto">
          <table className={`w-full text-xs ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
            <thead>
              <tr className={`border-b ${isDark ? 'border-white/20' : 'border-slate-300'}`}>
                <th className="text-left p-2">Element</th>
                <th className="text-right p-2">Raw</th>
                <th className="text-right p-2">Weight</th>
                <th className="text-right p-2">Adjusted</th>
                <th className="text-right p-2">Raw %</th>
                <th className="text-right p-2">Adj %</th>
                <th className="text-right p-2">Δ%</th>
              </tr>
            </thead>
            <tbody>
              {elements.map((el) => {
                const delta = seasonality.deltas[el];
                const deltaClass = delta > 0 ? 'text-green-400' : delta < 0 ? 'text-red-400' : '';
                return (
                  <tr key={el} className={`border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    <td className="p-2 capitalize flex items-center gap-2">
                      {getElementIcon(el)} {el}
                    </td>
                    <td className="text-right p-2 font-mono">
                      {seasonality.raw[el]?.toFixed(2) || '0.00'}
                    </td>
                    <td className="text-right p-2 font-mono font-bold" style={{ color: ELEMENT_COLORS[el] }}>
                      ×{seasonality.weights[el].toFixed(2)}
                    </td>
                    <td className="text-right p-2 font-mono">
                      {seasonality.adjusted[el]?.toFixed(2) || '0.00'}
                    </td>
                    <td className="text-right p-2 font-mono">
                      {seasonality.rawNormalized[el].toFixed(1)}%
                    </td>
                    <td className="text-right p-2 font-mono">
                      {seasonality.adjustedNormalized[el].toFixed(1)}%
                    </td>
                    <td className={`text-right p-2 font-mono font-bold ${deltaClass}`}>
                      {delta > 0 ? '+' : ''}{delta.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formula Explanation */}
      <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
        <h5 className={`font-semibold text-sm mb-2 ${isDark ? 'text-white/90' : 'text-slate-800'}`}>
          Calculation Formula
        </h5>
        <div className={`text-xs font-mono ${isDark ? 'bg-slate-800' : 'bg-white'} p-3 rounded`}>
          <p className={isDark ? 'text-green-400' : 'text-green-700'}>// Step 1: Apply seasonal weights</p>
          <p className={isDark ? 'text-white/80' : 'text-slate-700'}>adjusted[element] = raw[element] × weight[element]</p>
          <p className={`mt-2 ${isDark ? 'text-green-400' : 'text-green-700'}`}>// Step 2: Normalize to percentages</p>
          <p className={isDark ? 'text-white/80' : 'text-slate-700'}>normalized[element] = adjusted[element] / sum(adjusted) × 100</p>
          <p className={`mt-2 ${isDark ? 'text-green-400' : 'text-green-700'}`}>// Step 3: Calculate delta</p>
          <p className={isDark ? 'text-white/80' : 'text-slate-700'}>delta[element] = normalizedAdj[element] - normalizedRaw[element]</p>
        </div>
      </div>

      {/* Interpretation */}
      <div className={`p-3 rounded-lg ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
        <h5 className={`font-semibold text-sm mb-2 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
          Interpretation
        </h5>
        <p className={`text-xs leading-relaxed ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
          These values show how the seasonal environment modifies your elemental constitution.
          Earth transition months (辰戌丑未) amplify Earth and shift the balance of supporting
          and controlling cycles. This directly affects Day Master strength, Ten Gods weighting,
          and relationship compatibility dynamics.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// CHART CARD WRAPPER
// ============================================================================

function ChartCard({ title, children, isDark, highlight = false }) {
  return (
    <div className={`p-4 rounded-xl border ${
      highlight
        ? (isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50/50 border-amber-200')
        : (isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-slate-200')
    }`}>
      <h5 className={`text-xs uppercase tracking-wider mb-2 ${
        highlight
          ? (isDark ? 'text-amber-400/80' : 'text-amber-600')
          : (isDark ? 'text-white/50' : 'text-slate-400')
      }`}>
        {title}
      </h5>
      {children}
    </div>
  );
}

// ============================================================================
// DONUT CHART (Nivo Pie) with Enhanced Tooltips
// ============================================================================

function DonutChart({ distribution, isRaw, isDark, seasonality }) {
  const data = [
    { id: 'Wood', label: '木 Wood', value: distribution.wood, color: ELEMENT_COLORS.wood },
    { id: 'Fire', label: '火 Fire', value: distribution.fire, color: ELEMENT_COLORS.fire },
    { id: 'Earth', label: '土 Earth', value: distribution.earth, color: ELEMENT_COLORS.earth },
    { id: 'Metal', label: '金 Metal', value: distribution.metal, color: ELEMENT_COLORS.metal },
    { id: 'Water', label: '水 Water', value: distribution.water, color: ELEMENT_COLORS.water }
  ];

  return (
    <ResponsivePie
      data={data}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      innerRadius={0.5}
      padAngle={1}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      colors={{ datum: 'data.color' }}
      borderWidth={1}
      borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
      enableArcLinkLabels={false}
      arcLabelsSkipAngle={20}
      arcLabelsTextColor="#ffffff"
      arcLabel={d => `${d.value.toFixed(0)}%`}
      motionConfig="gentle"
      tooltip={({ datum }) => {
        const el = datum.id.toLowerCase();
        if (!isRaw && seasonality) {
          return (
            <div className={`px-3 py-2 rounded-lg shadow-lg ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
              <div className="font-semibold">{datum.label}</div>
              <div className="text-xs opacity-70">Raw: {seasonality.rawNormalized[el]?.toFixed(1)}%</div>
              <div className="text-xs opacity-70">Weight: ×{seasonality.weights[el]?.toFixed(2)}</div>
              <div className="text-xs font-medium">Adjusted: {datum.value.toFixed(1)}%</div>
              <div className={`text-xs font-bold ${seasonality.deltas[el] > 0 ? 'text-green-400' : 'text-red-400'}`}>
                Δ: {seasonality.deltas[el] > 0 ? '+' : ''}{seasonality.deltas[el]?.toFixed(1)}%
              </div>
            </div>
          );
        }
        return (
          <div className={`px-3 py-2 rounded-lg shadow-lg ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
            <div className="font-semibold">{datum.label}</div>
            <div className="text-xs">Value: {datum.value.toFixed(1)}%</div>
          </div>
        );
      }}
      theme={{
        labels: { text: { fill: '#ffffff', fontSize: 11, fontWeight: 600 } },
        tooltip: {
          container: {
            background: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#ffffff' : '#1e293b',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }
        }
      }}
    />
  );
}

// ============================================================================
// HORIZONTAL BAR CHART with Enhanced Tooltips
// ============================================================================

function HorizontalBarChart({ distribution, seasonality, isRaw, isDark }) {
  const data = [
    { element: 'Water', value: distribution.water, color: ELEMENT_COLORS.water },
    { element: 'Metal', value: distribution.metal, color: ELEMENT_COLORS.metal },
    { element: 'Earth', value: distribution.earth, color: ELEMENT_COLORS.earth },
    { element: 'Fire', value: distribution.fire, color: ELEMENT_COLORS.fire },
    { element: 'Wood', value: distribution.wood, color: ELEMENT_COLORS.wood }
  ];

  return (
    <ResponsiveBar
      data={data}
      keys={['value']}
      indexBy="element"
      layout="horizontal"
      margin={{ top: 10, right: 50, bottom: 10, left: 60 }}
      padding={0.3}
      valueScale={{ type: 'linear', max: 50 }}
      colors={({ data }) => isRaw ? `${data.color}80` : data.color}
      borderRadius={4}
      axisTop={null}
      axisRight={null}
      axisBottom={null}
      axisLeft={{ tickSize: 0, tickPadding: 8 }}
      enableGridY={false}
      labelSkipWidth={12}
      labelTextColor="#ffffff"
      label={d => `${d.value.toFixed(1)}%`}
      tooltip={({ data: d }) => {
        const el = d.element.toLowerCase();
        if (!isRaw && seasonality) {
          return (
            <div className={`px-3 py-2 rounded-lg shadow-lg ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
              <div className="font-semibold">{d.element}</div>
              <div className="text-xs opacity-70">Raw: {seasonality.rawNormalized[el]?.toFixed(1)}%</div>
              <div className="text-xs opacity-70">Weight: ×{seasonality.weights[el]?.toFixed(2)}</div>
              <div className="text-xs font-medium">Adjusted: {d.value.toFixed(1)}%</div>
              <div className={`text-xs font-bold ${seasonality.deltas[el] > 0 ? 'text-green-400' : 'text-red-400'}`}>
                Δ: {seasonality.deltas[el] > 0 ? '+' : ''}{seasonality.deltas[el]?.toFixed(1)}%
              </div>
            </div>
          );
        }
        return (
          <div className={`px-3 py-2 rounded-lg shadow-lg ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
            <div className="font-semibold">{d.element}</div>
            <div className="text-xs">Value: {d.value.toFixed(1)}%</div>
          </div>
        );
      }}
      theme={{
        axis: {
          ticks: { text: { fill: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 11 } }
        }
      }}
    />
  );
}

// ============================================================================
// VERTICAL BAR CHART with Enhanced Tooltips
// ============================================================================

function VerticalBarChart({ distribution, seasonality, isRaw, isDark }) {
  const data = [
    { element: 'Wood', value: distribution.wood, color: ELEMENT_COLORS.wood },
    { element: 'Fire', value: distribution.fire, color: ELEMENT_COLORS.fire },
    { element: 'Earth', value: distribution.earth, color: ELEMENT_COLORS.earth },
    { element: 'Metal', value: distribution.metal, color: ELEMENT_COLORS.metal },
    { element: 'Water', value: distribution.water, color: ELEMENT_COLORS.water }
  ];

  return (
    <ResponsiveBar
      data={data}
      keys={['value']}
      indexBy="element"
      layout="vertical"
      margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
      padding={0.3}
      valueScale={{ type: 'linear', max: 50 }}
      colors={({ data }) => isRaw ? `${data.color}80` : data.color}
      borderRadius={4}
      axisTop={null}
      axisRight={null}
      axisBottom={{ tickSize: 0, tickPadding: 5, tickRotation: 0 }}
      axisLeft={{ tickSize: 0, tickPadding: 5, tickValues: 5 }}
      enableGridY={true}
      gridYValues={5}
      labelSkipHeight={12}
      labelTextColor="#ffffff"
      label={d => `${d.value.toFixed(0)}%`}
      tooltip={({ data: d }) => {
        const el = d.element.toLowerCase();
        if (!isRaw && seasonality) {
          return (
            <div className={`px-3 py-2 rounded-lg shadow-lg ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
              <div className="font-semibold">{d.element}</div>
              <div className="text-xs opacity-70">Raw: {seasonality.rawNormalized[el]?.toFixed(1)}%</div>
              <div className="text-xs opacity-70">Weight: ×{seasonality.weights[el]?.toFixed(2)}</div>
              <div className="text-xs font-medium">Adjusted: {d.value.toFixed(1)}%</div>
              <div className={`text-xs font-bold ${seasonality.deltas[el] > 0 ? 'text-green-400' : 'text-red-400'}`}>
                Δ: {seasonality.deltas[el] > 0 ? '+' : ''}{seasonality.deltas[el]?.toFixed(1)}%
              </div>
            </div>
          );
        }
        return (
          <div className={`px-3 py-2 rounded-lg shadow-lg ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
            <div className="font-semibold">{d.element}</div>
            <div className="text-xs">Value: {d.value.toFixed(1)}%</div>
          </div>
        );
      }}
      theme={{
        axis: {
          ticks: { text: { fill: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 10 } }
        },
        grid: { line: { stroke: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' } }
      }}
    />
  );
}

// ============================================================================
// SINGLE RADAR CHART (Raw only - Faint)
// ============================================================================

function RadarChart({ distribution, isRaw, isDark }) {
  const data = [
    { element: 'Wood 木', value: distribution.wood },
    { element: 'Fire 火', value: distribution.fire },
    { element: 'Earth 土', value: distribution.earth },
    { element: 'Metal 金', value: distribution.metal },
    { element: 'Water 水', value: distribution.water }
  ];

  return (
    <ResponsiveRadar
      data={data}
      keys={['value']}
      indexBy="element"
      maxValue={50}
      margin={{ top: 40, right: 60, bottom: 40, left: 60 }}
      borderColor={{ from: 'color' }}
      gridLevels={5}
      gridShape="circular"
      gridLabelOffset={16}
      dotSize={8}
      dotColor={{ theme: 'background' }}
      dotBorderWidth={2}
      colors={['rgba(255,255,255,0.4)']}
      fillOpacity={0.15}
      motionConfig="gentle"
      theme={{
        axis: {
          ticks: { text: { fill: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 11 } }
        },
        grid: { line: { stroke: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' } }
      }}
    />
  );
}

// ============================================================================
// SUPER-IMPOSED RADAR (The Crown Jewel - Faint Raw + Bold Adjusted)
// ============================================================================

function SuperImposedRadar({ rawDistribution, adjustedDistribution, isDark }) {
  const data = [
    { element: 'Wood 木', raw: rawDistribution.wood, adjusted: adjustedDistribution.wood },
    { element: 'Fire 火', raw: rawDistribution.fire, adjusted: adjustedDistribution.fire },
    { element: 'Earth 土', raw: rawDistribution.earth, adjusted: adjustedDistribution.earth },
    { element: 'Metal 金', raw: rawDistribution.metal, adjusted: adjustedDistribution.metal },
    { element: 'Water 水', raw: rawDistribution.water, adjusted: adjustedDistribution.water }
  ];

  return (
    <ResponsiveRadar
      data={data}
      keys={['raw', 'adjusted']}
      indexBy="element"
      maxValue={50}
      margin={{ top: 40, right: 60, bottom: 40, left: 60 }}
      borderWidth={2}
      borderColor={{ from: 'color' }}
      gridLevels={5}
      gridShape="circular"
      gridLabelOffset={16}
      dotSize={8}
      dotColor={{ theme: 'background' }}
      dotBorderWidth={2}
      colors={['rgba(255,255,255,0.25)', '#f59e0b']}  // Faint white for raw, Bold amber for adjusted
      fillOpacity={0.2}
      blendMode="normal"
      motionConfig="gentle"
      legends={[]}
      theme={{
        axis: {
          ticks: { text: { fill: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 11 } }
        },
        grid: { line: { stroke: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' } }
      }}
    />
  );
}

// ============================================================================
// UTILITIES
// ============================================================================

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default SeasonalityComparisonChart;
