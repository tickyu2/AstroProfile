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

  // Get dominant element color (after seasonality adjustment)
  const dominantElementColor = ELEMENT_COLORS[seasonalityResult.dominantAfter] || '#f59e0b';

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
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dominantElementColor }}></div>
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
        <ChartCard title="Raw Elemental Fingerprint" isDark={isDark}>
          <RadarChart distribution={rawNormalized} isDark={isDark} />
        </ChartCard>
        <ChartCard title="Seasonality Adjusted vs Raw" isDark={isDark} highlight>
          <SuperImposedRadar
            rawDistribution={rawNormalized}
            adjustedDistribution={adjustedNormalized}
            isDark={isDark}
          />
          {/* Line legend for the two shapes */}
          <div className="flex justify-center items-center gap-6 mt-3 pt-3 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-white/40 rounded"></div>
              <span className={isDark ? 'text-white/50' : 'text-slate-500'}>Raw</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 rounded" style={{ backgroundColor: dominantElementColor }}></div>
              <span className={isDark ? 'text-white/50' : 'text-slate-500'}>Adjusted</span>
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
// DONUT CHART (Nivo Pie) with Enhanced Tooltips - Matching Element Distribution
// ============================================================================

function DonutChart({ distribution, isRaw, isDark, seasonality }) {
  const data = [
    { id: 'Wood', label: 'Wood', value: distribution.wood, color: ELEMENT_COLORS.wood },
    { id: 'Fire', label: 'Fire', value: distribution.fire, color: ELEMENT_COLORS.fire },
    { id: 'Earth', label: 'Earth', value: distribution.earth, color: ELEMENT_COLORS.earth },
    { id: 'Metal', label: 'Metal', value: distribution.metal, color: ELEMENT_COLORS.metal },
    { id: 'Water', label: 'Water', value: distribution.water, color: ELEMENT_COLORS.water }
  ];

  // Find dominant element
  const dominant = data.reduce((max, d) => d.value > max.value ? d : max, data[0]);

  return (
    <div className="relative h-full">
      {/* Central Display - Dominant Element */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="flex flex-col items-center">
          <span className="text-2xl mb-1">{getElementIcon(dominant.id)}</span>
          <span className="text-xs font-medium" style={{ color: dominant.color }}>{dominant.id}</span>
          <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {Math.round(dominant.value)}%
          </span>
        </div>
      </div>

      <ResponsivePie
        data={data}
        margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
        innerRadius={0.55}
        padAngle={1.5}
        cornerRadius={4}
        activeOuterRadiusOffset={8}
        colors={{ datum: 'data.color' }}
        borderWidth={2}
        borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
        enableArcLinkLabels={true}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)'}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLinkLabelsDiagonalLength={12}
        arcLinkLabelsStraightLength={8}
        arcLinkLabel={d => d.id}
        arcLabelsSkipAngle={25}
        arcLabelsTextColor="#ffffff"
        arcLabel={d => `${Math.round(d.value)}%`}
        motionConfig="gentle"
        tooltip={({ datum }) => {
          const el = datum.id.toLowerCase();
          if (!isRaw && seasonality) {
            return (
              <div className={`px-4 py-3 rounded-xl shadow-lg border-2 ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                   style={{ borderColor: datum.color }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{getElementIcon(datum.id)}</span>
                  <span className="font-bold" style={{ color: datum.color }}>{datum.id}</span>
                  <span className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>{ELEMENT_CHINESE[el]}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between gap-4 text-sm">
                    <span className={isDark ? 'text-white/60' : 'text-slate-500'}>Raw:</span>
                    <span className={isDark ? 'text-white' : 'text-slate-900'}>{seasonality.rawNormalized[el]?.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between gap-4 text-sm">
                    <span className={isDark ? 'text-white/60' : 'text-slate-500'}>Weight:</span>
                    <span className={isDark ? 'text-white' : 'text-slate-900'}>×{seasonality.weights[el]?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between gap-4 text-sm font-medium">
                    <span className={isDark ? 'text-white/60' : 'text-slate-500'}>Adjusted:</span>
                    <span style={{ color: datum.color }}>{datum.value.toFixed(1)}%</span>
                  </div>
                  <div className={`pt-2 mt-1 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    <div className="flex justify-between gap-4 text-sm">
                      <span className={isDark ? 'text-white/40' : 'text-slate-400'}>Change:</span>
                      <span className={`font-bold ${seasonality.deltas[el] > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {seasonality.deltas[el] > 0 ? '+' : ''}{seasonality.deltas[el]?.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div className={`px-4 py-3 rounded-xl shadow-lg border-2 ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                 style={{ borderColor: datum.color }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{getElementIcon(datum.id)}</span>
                <span className="font-bold" style={{ color: datum.color }}>{datum.id}</span>
                <span className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>{ELEMENT_CHINESE[el]}</span>
              </div>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {datum.value.toFixed(1)}%
              </div>
              <div className={`text-xs mt-1 ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
                of total composition
              </div>
            </div>
          );
        }}
        theme={{
          labels: { text: { fill: '#ffffff', fontSize: 12, fontWeight: 700 } },
          tooltip: {
            container: {
              background: isDark ? '#1e293b' : '#ffffff',
              color: isDark ? '#ffffff' : '#1e293b',
              borderRadius: 12,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
            }
          }
        }}
      />
    </div>
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
          ticks: { text: { fill: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.7)', fontSize: 14, fontWeight: 600 } }
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
          ticks: { text: { fill: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.7)', fontSize: 13, fontWeight: 600 } }
        },
        grid: { line: { stroke: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' } }
      }}
    />
  );
}

// ============================================================================
// SINGLE RADAR CHART (Raw only - Faint) - Enhanced with element styling
// ============================================================================

function RadarChart({ distribution, isDark }) {
  const elements = ['wood', 'fire', 'earth', 'metal', 'water'];

  const data = [
    { element: 'Wood', value: distribution.wood },
    { element: 'Fire', value: distribution.fire },
    { element: 'Earth', value: distribution.earth },
    { element: 'Metal', value: distribution.metal },
    { element: 'Water', value: distribution.water }
  ];

  // Find dominant element
  const dominant = data.reduce((max, d) => d.value > max.value ? d : max, data[0]);
  const dominantColor = ELEMENT_COLORS[dominant.element.toLowerCase()];

  // Custom grid label with element colors
  const CustomGridLabel = ({ id, anchor, x, y }) => {
    const elementColor = ELEMENT_COLORS[id.toLowerCase()] || (isDark ? '#fff' : '#000');
    return (
      <g transform={`translate(${x}, ${y})`}>
        <text
          style={{
            fontSize: 13,
            fontWeight: 700,
            fill: elementColor,
            textAnchor: anchor,
            dominantBaseline: 'central',
            textShadow: `0 0 8px ${elementColor}40`
          }}
        >
          {id}
        </text>
      </g>
    );
  };

  return (
    <div className="relative">
      {/* Glow effect */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full pointer-events-none opacity-30"
        style={{ background: `radial-gradient(circle, ${dominantColor} 0%, transparent 70%)` }}
      />

      <div className="h-[280px]">
        <ResponsiveRadar
          data={data}
          keys={['value']}
          indexBy="element"
          maxValue={50}
          margin={{ top: 40, right: 60, bottom: 40, left: 60 }}
          borderWidth={3}
          borderColor={dominantColor}
          gridLevels={5}
          gridShape="linear"
          gridLabelOffset={24}
          gridLabel={CustomGridLabel}
          dotSize={12}
          dotColor={isDark ? '#1e293b' : '#ffffff'}
          dotBorderWidth={3}
          dotBorderColor={dominantColor}
          colors={[`${dominantColor}cc`]}
          fillOpacity={0.25}
          motionConfig="gentle"
          sliceTooltip={({ index, data: sliceData }) => {
            const item = sliceData.find(d => d.id === 'value');
            const elColor = ELEMENT_COLORS[index.toLowerCase()];
            return (
              <div className={`px-4 py-3 rounded-xl shadow-lg border-2 ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                   style={{ borderColor: elColor }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{getElementIcon(index)}</span>
                  <span className="font-bold" style={{ color: elColor }}>{index}</span>
                </div>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {Math.round(item?.value || 0)}%
                </div>
                <div className={`text-xs mt-1 ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
                  of total composition
                </div>
              </div>
            );
          }}
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.7)',
                  fontSize: 13,
                  fontWeight: 600
                }
              }
            },
            grid: { line: { stroke: `${dominantColor}40`, strokeWidth: 1.5 } }
          }}
        />
      </div>

      {/* Stats Row - Element Legend with color-coded names */}
      <div className="flex justify-center gap-4 mt-2 flex-wrap">
        {elements.map(el => {
          const val = distribution[el] || 0;
          const isDominantEl = el === dominant.element.toLowerCase();
          const elColor = ELEMENT_COLORS[el];
          return (
            <div key={el} className="flex flex-col items-center gap-1">
              <span className="text-lg"
                    style={{ filter: isDominantEl ? `drop-shadow(0 0 6px ${elColor})` : 'none' }}>
                {getElementIcon(el)}
              </span>
              <span className="text-sm font-bold"
                    style={{ color: elColor, textShadow: isDominantEl ? `0 0 8px ${elColor}` : 'none' }}>
                {val.toFixed(1)}%
              </span>
              <span className="text-[10px] font-semibold"
                    style={{ color: elColor }}>
                {capitalize(el)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// SUPER-IMPOSED RADAR (The Crown Jewel - Faint Raw + Bold Adjusted)
// ============================================================================

function SuperImposedRadar({ rawDistribution, adjustedDistribution, isDark }) {
  const elements = ['wood', 'fire', 'earth', 'metal', 'water'];

  const data = [
    { element: 'Wood', raw: rawDistribution.wood, adjusted: adjustedDistribution.wood },
    { element: 'Fire', raw: rawDistribution.fire, adjusted: adjustedDistribution.fire },
    { element: 'Earth', raw: rawDistribution.earth, adjusted: adjustedDistribution.earth },
    { element: 'Metal', raw: rawDistribution.metal, adjusted: adjustedDistribution.metal },
    { element: 'Water', raw: rawDistribution.water, adjusted: adjustedDistribution.water }
  ];

  // Find dominant element (based on adjusted) and get its color
  const dominantAdj = data.reduce((max, d) => d.adjusted > max.adjusted ? d : max, data[0]);
  const dominantColor = ELEMENT_COLORS[dominantAdj.element.toLowerCase()] || '#f59e0b';

  // Custom grid label with element colors
  const CustomGridLabel = ({ id, anchor, x, y }) => {
    const elementColor = ELEMENT_COLORS[id.toLowerCase()] || (isDark ? '#fff' : '#000');
    return (
      <g transform={`translate(${x}, ${y})`}>
        <text
          style={{
            fontSize: 13,
            fontWeight: 700,
            fill: elementColor,
            textAnchor: anchor,
            dominantBaseline: 'central',
            textShadow: `0 0 8px ${elementColor}40`
          }}
        >
          {id}
        </text>
      </g>
    );
  };

  return (
    <div className="relative">
      {/* Glow effect - uses dominant element color */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full pointer-events-none opacity-25"
        style={{ background: `radial-gradient(circle, ${dominantColor} 0%, transparent 70%)` }}
      />

      <div className="h-[280px]">
        <ResponsiveRadar
          data={data}
          keys={['raw', 'adjusted']}
          indexBy="element"
          maxValue={50}
          margin={{ top: 40, right: 60, bottom: 40, left: 60 }}
          borderWidth={2}
          borderColor={{ from: 'color' }}
          gridLevels={5}
          gridShape="linear"
          gridLabelOffset={24}
          gridLabel={CustomGridLabel}
          dotSize={10}
          dotColor={isDark ? '#1e293b' : '#ffffff'}
          dotBorderWidth={2}
          colors={['rgba(255,255,255,0.4)', dominantColor]}  // Faint white for raw, Bold dominant element color for adjusted
          fillOpacity={0.2}
          blendMode="normal"
          motionConfig="gentle"
          legends={[]}
          sliceTooltip={({ index, data: sliceData }) => {
            const rawItem = sliceData.find(d => d.id === 'raw');
            const adjItem = sliceData.find(d => d.id === 'adjusted');
            const elColor = ELEMENT_COLORS[index.toLowerCase()];
            const delta = (adjItem?.value || 0) - (rawItem?.value || 0);
            return (
              <div className={`px-4 py-3 rounded-xl shadow-lg border-2 ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                   style={{ borderColor: elColor }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{getElementIcon(index)}</span>
                  <span className="font-bold" style={{ color: elColor }}>{index}</span>
                  <span className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>{ELEMENT_CHINESE[index.toLowerCase()]}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-0.5 bg-white/40 rounded"></div>
                      <span className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Raw</span>
                    </div>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{Math.round(rawItem?.value || 0)}%</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-1 rounded" style={{ backgroundColor: dominantColor }}></div>
                      <span className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Adjusted</span>
                    </div>
                    <span className="font-bold" style={{ color: dominantColor }}>{Math.round(adjItem?.value || 0)}%</span>
                  </div>
                  <div className={`pt-2 mt-2 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Change</span>
                      <span className={`font-bold text-sm ${delta > 0 ? 'text-green-400' : delta < 0 ? 'text-red-400' : isDark ? 'text-white/60' : 'text-slate-500'}`}>
                        {delta > 0 ? '+' : ''}{Math.round(delta)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.7)',
                  fontSize: 13,
                  fontWeight: 600
                }
              }
            },
            grid: { line: { stroke: `${dominantColor}40`, strokeWidth: 1.5 } }
          }}
        />
      </div>

      {/* Stats Row - Element Legend with Raw vs Adjusted and colored names */}
      <div className="flex justify-center gap-3 mt-2 flex-wrap">
        {elements.map(el => {
          const rawVal = rawDistribution[el] || 0;
          const adjVal = adjustedDistribution[el] || 0;
          const delta = adjVal - rawVal;
          const isDominant = el === dominantAdj.element.toLowerCase();
          const elColor = ELEMENT_COLORS[el];
          return (
            <div key={el} className="flex flex-col items-center gap-0.5">
              <span className="text-base"
                    style={{ filter: isDominant ? `drop-shadow(0 0 6px ${elColor})` : 'none' }}>
                {getElementIcon(el)}
              </span>
              <div className="flex items-center gap-1">
                <span className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-400'}`}>{rawVal.toFixed(0)}</span>
                <span className={`text-xs ${isDark ? 'text-white/30' : 'text-slate-300'}`}>→</span>
                <span className="text-xs font-bold" style={{ color: dominantColor }}>{adjVal.toFixed(0)}%</span>
              </div>
              <span className={`text-[9px] font-medium ${delta > 0 ? 'text-green-400' : delta < 0 ? 'text-red-400' : isDark ? 'text-white/40' : 'text-slate-400'}`}>
                {delta > 0 ? '+' : ''}{delta.toFixed(1)}
              </span>
              <span className="text-[9px] font-semibold"
                    style={{ color: elColor }}>
                {capitalize(el)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
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
