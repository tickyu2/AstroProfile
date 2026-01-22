/**
 * Vedic Astrology (Jyotish) Page
 * Displays sidereal zodiac chart with Rashis, Nakshatras, and Grahas
 */

import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';
import { calculateVedicChart, formatGrahaPosition, formatNakshatra, calculateGrahaBhava } from '../services/vedicAstrologyService';
import { RASHIS, NAKSHATRAS, GRAHAS, AYANAMSHAS, BHAVAS, VEDIC_ELEMENT_COLORS } from '../data/vedicConstants';

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * South Indian Style Rashi Chart (12-box grid)
 */
function RashiChartPanel({ chart, grahas }) {
  if (!chart || !grahas) return null;

  const lagnaSign = chart.lagna?.rashi?.index ?? 0;

  // Create 12 boxes for South Indian chart
  // Fixed position: Pisces always in top-left
  const boxes = useMemo(() => {
    const result = [];
    // South Indian layout: Fixed signs, houses rotate
    const southIndianOrder = [11, 0, 1, 2, 10, -1, -1, 3, 9, -1, -1, 4, 8, 7, 6, 5]; // -1 = center
    const gridPositions = [
      [0, 0], [0, 1], [0, 2], [0, 3],
      [1, 0], [1, 1], [1, 2], [1, 3],
      [2, 0], [2, 1], [2, 2], [2, 3],
      [3, 0], [3, 1], [3, 2], [3, 3]
    ];

    southIndianOrder.forEach((signIndex, i) => {
      if (signIndex === -1) return; // Skip center cells

      const rashi = RASHIS[signIndex];
      const houseNumber = ((signIndex - lagnaSign + 12) % 12) + 1;
      const isLagna = houseNumber === 1;

      // Find grahas in this rashi
      const grahasInSign = Object.entries(grahas)
        .filter(([_, g]) => g.rashi?.index === signIndex)
        .map(([key, g]) => ({ key, ...g }));

      result.push({
        signIndex,
        rashi,
        houseNumber,
        isLagna,
        grahas: grahasInSign,
        position: gridPositions[i]
      });
    });

    return result;
  }, [lagnaSign, grahas]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🕉️</span>
          <div>
            <div className="text-xs text-white/60 uppercase tracking-wider font-medium">Rashi Chart</div>
            <div className="text-[9px] text-white/40 italic">South Indian Style</div>
          </div>
        </div>
        <div className="text-[10px] px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
          {chart.lagna?.rashi?.sanskrit} Lagna
        </div>
      </div>

      {/* 4x4 Grid Chart */}
      <div className="grid grid-cols-4 gap-0.5 bg-slate-700/50 p-0.5 rounded-lg">
        {[0, 1, 2, 3].map(row => (
          [0, 1, 2, 3].map(col => {
            // Center cells (1,1), (1,2), (2,1), (2,2) are empty
            if ((row === 1 || row === 2) && (col === 1 || col === 2)) {
              if (row === 1 && col === 1) {
                // Center block - show chart name
                return (
                  <div key={`${row}-${col}`} className="col-span-2 row-span-2 bg-slate-900/80 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🕉️</div>
                      <div className="text-[10px] text-white/60">RASHI</div>
                      <div className="text-[8px] text-amber-400">{chart.ayanamshaName}</div>
                    </div>
                  </div>
                );
              }
              return null;
            }

            const box = boxes.find(b => b.position[0] === row && b.position[1] === col);
            if (!box) return <div key={`${row}-${col}`} className="bg-slate-900/50 aspect-square" />;

            const elementColors = VEDIC_ELEMENT_COLORS[box.rashi.element];

            return (
              <div
                key={`${row}-${col}`}
                className={`bg-slate-900/80 p-1.5 aspect-square relative ${box.isLagna ? 'ring-2 ring-amber-500/50' : ''}`}
              >
                {/* House number */}
                <div className="absolute top-0.5 left-1 text-[8px] text-white/30">{box.houseNumber}</div>

                {/* Rashi symbol */}
                <div className="absolute top-0.5 right-1 text-[10px]">{box.rashi.symbol}</div>

                {/* Rashi name */}
                <div className={`text-[8px] ${elementColors.text} text-center mt-2`}>
                  {box.rashi.sanskrit.substring(0, 4)}
                </div>

                {/* Grahas in this sign */}
                <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                  {box.grahas.map(g => (
                    <span
                      key={g.key}
                      className={`text-[9px] ${g.retrograde ? 'text-red-400' : 'text-white/80'}`}
                      title={`${GRAHAS[g.key]?.english || g.key} ${g.retrograde ? '(R)' : ''}`}
                    >
                      {GRAHAS[g.key]?.symbol || g.key.charAt(0).toUpperCase()}
                    </span>
                  ))}
                </div>

                {/* Lagna marker */}
                {box.isLagna && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[7px] text-amber-400">ASC</div>
                )}
              </div>
            );
          })
        )).flat().filter(Boolean)}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-3 text-[9px] text-white/50">
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500/50 rounded-full"></span> Lagna</span>
        <span className="flex items-center gap-1"><span className="text-red-400">R</span> Retrograde</span>
      </div>
    </div>
  );
}

/**
 * Moon Nakshatra Panel - Most important in Vedic
 */
function MoonNakshatraPanel({ moonNakshatra, moonGraha }) {
  if (!moonNakshatra) return null;

  const nakshatra = NAKSHATRAS[moonNakshatra.index] || moonNakshatra;

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🌙</span>
        <div>
          <div className="text-xs text-white/60 uppercase tracking-wider font-medium">Janma Nakshatra</div>
          <div className="text-[9px] text-white/40 italic">Birth Moon Constellation</div>
        </div>
      </div>

      <div className="text-center py-4">
        <div className="text-4xl mb-2">{nakshatra.symbol}</div>
        <div className="text-xl font-semibold text-white">{moonNakshatra.name}</div>
        <div className="text-sm text-cyan-400">Pada {moonNakshatra.pada}</div>
        <div className="text-xs text-white/50 mt-1">{nakshatra.meaning}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-slate-900/50 rounded-lg p-2 text-center">
          <div className="text-[9px] text-white/40 uppercase">Nakshatra Lord</div>
          <div className="text-sm text-amber-400">{moonNakshatra.lord}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-2 text-center">
          <div className="text-[9px] text-white/40 uppercase">Deity</div>
          <div className="text-sm text-purple-400">{nakshatra.deity}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-2 text-center">
          <div className="text-[9px] text-white/40 uppercase">Quality</div>
          <div className="text-sm text-lime-400">{nakshatra.quality}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-2 text-center">
          <div className="text-[9px] text-white/40 uppercase">Moon Rashi</div>
          <div className="text-sm text-cyan-400">{moonGraha?.rashi?.sanskrit || 'Unknown'}</div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-slate-900/30 rounded-lg">
        <div className="text-[10px] text-white/50 uppercase mb-1">Nature</div>
        <div className="text-xs text-white/80">{nakshatra.nature}</div>
      </div>
    </div>
  );
}

/**
 * Lagna (Ascendant) Panel
 */
function LagnaPanel({ lagna }) {
  if (!lagna) return null;

  const rashi = RASHIS[lagna.rashi?.index] || lagna.rashi;
  const elementColors = VEDIC_ELEMENT_COLORS[rashi?.element || 'Fire'];

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">⬆️</span>
        <div>
          <div className="text-xs text-white/60 uppercase tracking-wider font-medium">Lagna (Ascendant)</div>
          <div className="text-[9px] text-white/40 italic">Rising Sign at Birth</div>
        </div>
      </div>

      <div className="text-center py-4">
        <div className="text-4xl mb-2">{rashi?.emoji || '♈'}</div>
        <div className="text-xl font-semibold text-white">{lagna.rashi?.sanskrit || 'Unknown'}</div>
        <div className={`text-sm ${elementColors.text}`}>{rashi?.english || ''}</div>
        <div className="text-xs text-white/50 mt-1">{lagna.rashi?.formatted || ''}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-slate-900/50 rounded-lg p-2 text-center">
          <div className="text-[9px] text-white/40 uppercase">Lord</div>
          <div className="text-sm text-amber-400">{rashi?.lord || 'Unknown'}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-2 text-center">
          <div className="text-[9px] text-white/40 uppercase">Element</div>
          <div className={`text-sm ${elementColors.text}`}>{rashi?.element || 'Unknown'}</div>
        </div>
      </div>

      {lagna.nakshatra && (
        <div className="mt-4 p-3 bg-slate-900/30 rounded-lg">
          <div className="text-[10px] text-white/50 uppercase mb-1">Lagna Nakshatra</div>
          <div className="text-xs text-white/80">{lagna.nakshatra.name} Pada {lagna.nakshatra.pada}</div>
        </div>
      )}
    </div>
  );
}

/**
 * Graha Positions Table
 */
function GrahaTablePanel({ grahas }) {
  if (!grahas) return null;

  const grahaOrder = ['surya', 'chandra', 'mangala', 'budha', 'guru', 'shukra', 'shani', 'rahu', 'ketu'];

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🪐</span>
        <div>
          <div className="text-xs text-white/60 uppercase tracking-wider font-medium">Graha Positions</div>
          <div className="text-[9px] text-white/40 italic">Sidereal Planetary Positions</div>
        </div>
      </div>

      <div className="space-y-1">
        {grahaOrder.map(key => {
          const graha = grahas[key];
          if (!graha || graha.error) return null;

          const grahaInfo = GRAHAS[key];
          const elementColors = VEDIC_ELEMENT_COLORS[graha.rashi?.element || 'Fire'];

          return (
            <div
              key={key}
              className={`grid grid-cols-12 gap-1 p-2 rounded-lg bg-slate-900/30 hover:bg-slate-900/50 transition-colors`}
            >
              {/* Graha Symbol & Name */}
              <div className="col-span-3 flex items-center gap-2">
                <span className="text-base" style={{ color: grahaInfo?.color }}>
                  {grahaInfo?.symbol || '?'}
                </span>
                <div>
                  <div className="text-xs text-white/90">{grahaInfo?.sanskrit || key}</div>
                  <div className="text-[9px] text-white/40">{grahaInfo?.english || ''}</div>
                </div>
              </div>

              {/* Rashi */}
              <div className="col-span-3 flex items-center">
                <div>
                  <div className={`text-xs ${elementColors.text}`}>{graha.rashi?.sanskrit || 'Unknown'}</div>
                  <div className="text-[9px] text-white/40">{graha.rashi?.degree?.toFixed(2) || '0.00'}°</div>
                </div>
              </div>

              {/* Nakshatra */}
              <div className="col-span-4 flex items-center">
                <div>
                  <div className="text-xs text-white/80">{graha.nakshatra?.name || 'Unknown'}</div>
                  <div className="text-[9px] text-white/40">Pada {graha.nakshatra?.pada || 1}</div>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2 flex items-center justify-end">
                {graha.retrograde && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded">R</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-end mt-3">
        <span className="text-[9px] text-white/40 flex items-center gap-1">
          <span className="px-1 py-0.5 bg-red-500/20 text-red-400 rounded text-[8px]">R</span> = Retrograde
        </span>
      </div>
    </div>
  );
}

/**
 * Ayanamsha Info Panel
 */
function AyanamshaPanel({ chart, ayanamsha, onAyanamshaChange }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📐</span>
          <div>
            <div className="text-xs text-white/60 uppercase tracking-wider font-medium">Ayanamsha</div>
            <div className="text-[9px] text-white/40 italic">Tropical-Sidereal Offset</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="text-[9px] text-white/40 uppercase mb-1">System</div>
          <select
            value={ayanamsha}
            onChange={(e) => onAyanamshaChange(e.target.value)}
            className="w-full bg-slate-800 text-white text-sm rounded px-2 py-1 border border-slate-600"
          >
            {Object.entries(AYANAMSHAS).map(([key, opt]) => (
              <option key={key} value={key}>{opt.name}</option>
            ))}
          </select>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="text-[9px] text-white/40 uppercase mb-1">Current Value</div>
          <div className="text-lg text-amber-400 font-mono">
            {chart?.ayanamshaValue?.toFixed(4) || '24.0000'}°
          </div>
        </div>
      </div>

      <div className="mt-3 p-2 bg-slate-900/30 rounded-lg">
        <div className="text-[9px] text-white/50">
          {AYANAMSHAS[ayanamsha]?.description || 'Sidereal offset from tropical zodiac'}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// INTERPRETATION PANELS
// ============================================================================

/**
 * Overall Chart Synthesis Panel
 */
function SynthesisPanel({ interpretations }) {
  if (!interpretations?.overallSynthesis) return null;

  return (
    <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 backdrop-blur-lg rounded-xl p-4 border border-amber-500/30">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">✨</span>
        <div>
          <div className="text-xs text-amber-400 uppercase tracking-wider font-medium">Chart Synthesis</div>
          <div className="text-[9px] text-white/40 italic">Overall Pattern</div>
        </div>
      </div>

      <div className="text-sm text-white/90 leading-relaxed">
        {interpretations.overallSynthesis}
      </div>
    </div>
  );
}

/**
 * Graha Strengths Panel (Exalted, Own Sign, Debilitated)
 */
function GrahaStrengthsPanel({ interpretations }) {
  const strengths = interpretations?.grahaStrengths || [];
  if (strengths.length === 0) return null;

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">💪</span>
        <div>
          <div className="text-xs text-white/60 uppercase tracking-wider font-medium">Graha Dignities</div>
          <div className="text-[9px] text-white/40 italic">Notable Planetary Strengths</div>
        </div>
      </div>

      <div className="space-y-2">
        {strengths.map((strength, idx) => {
          // Determine dignity type for styling
          const isExalted = strength.includes('exalted');
          const isOwn = strength.includes('own sign');
          const isDebilitated = strength.includes('debilitated');

          return (
            <div
              key={idx}
              className={`p-3 rounded-lg text-sm ${
                isExalted ? 'bg-emerald-500/20 border border-emerald-500/30' :
                isOwn ? 'bg-amber-500/20 border border-amber-500/30' :
                isDebilitated ? 'bg-red-500/20 border border-red-500/30' :
                'bg-slate-900/50'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="mt-0.5">
                  {isExalted ? '🌟' : isOwn ? '🏠' : isDebilitated ? '⚠️' : '○'}
                </span>
                <span className={`${
                  isExalted ? 'text-emerald-300' :
                  isOwn ? 'text-amber-300' :
                  isDebilitated ? 'text-red-300' :
                  'text-white/80'
                }`}>
                  {strength}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Temperament Panel (Guna & Dosha)
 */
function TemperamentPanel({ interpretations }) {
  const temperament = interpretations?.temperament;
  if (!temperament) return null;

  const gunaColors = {
    Sattva: { bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-400' },
    Rajas: { bg: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-400' },
    Tamas: { bg: 'bg-slate-500/20', border: 'border-slate-500/30', text: 'text-slate-400' }
  };

  const doshaColors = {
    Vata: { bg: 'bg-sky-500/20', border: 'border-sky-500/30', text: 'text-sky-400' },
    Pitta: { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400' },
    Kapha: { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' }
  };

  const gunaStyle = gunaColors[temperament.dominantGuna] || gunaColors.Rajas;
  const doshaStyle = doshaColors[temperament.dominantDosha] || doshaColors.Vata;

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🧘</span>
        <div>
          <div className="text-xs text-white/60 uppercase tracking-wider font-medium">Temperament</div>
          <div className="text-[9px] text-white/40 italic">Guna & Dosha Constitution</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Guna Section */}
        <div className={`p-3 rounded-lg ${gunaStyle.bg} ${gunaStyle.border} border`}>
          <div className="text-[9px] text-white/40 uppercase mb-1">Dominant Guna</div>
          <div className={`text-xl font-semibold ${gunaStyle.text}`}>
            {temperament.dominantGuna}
          </div>
          <div className="text-[10px] text-white/50 mt-1">
            Lagna: {temperament.lagnaGuna} • Moon: {temperament.moonGuna}
          </div>
        </div>

        {/* Dosha Section */}
        <div className={`p-3 rounded-lg ${doshaStyle.bg} ${doshaStyle.border} border`}>
          <div className="text-[9px] text-white/40 uppercase mb-1">Dominant Dosha</div>
          <div className={`text-xl font-semibold ${doshaStyle.text}`}>
            {temperament.dominantDosha}
          </div>
          <div className="text-[10px] text-white/50 mt-1">
            Lagna: {temperament.lagnaDosha} • Moon: {temperament.moonDosha}
          </div>
        </div>
      </div>

      {/* Interpretations */}
      <div className="mt-4 space-y-2">
        {temperament.gunaInterpretation && (
          <div className={`p-2 rounded-lg ${gunaStyle.bg} text-xs ${gunaStyle.text}`}>
            {temperament.gunaInterpretation}
          </div>
        )}
        {temperament.doshaInterpretation && (
          <div className={`p-2 rounded-lg ${doshaStyle.bg} text-xs ${doshaStyle.text}`}>
            {temperament.doshaInterpretation}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * House Themes Panel
 */
function HouseThemesPanel({ interpretations }) {
  const houseThemes = interpretations?.houseThemes || {};
  if (Object.keys(houseThemes).length === 0) return null;

  const [expandedHouse, setExpandedHouse] = useState(null);

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🏛️</span>
        <div>
          <div className="text-xs text-white/60 uppercase tracking-wider font-medium">Bhava Themes</div>
          <div className="text-[9px] text-white/40 italic">House Interpretations</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => {
          const theme = houseThemes[h] || houseThemes[String(h)] || '';
          const hasActivation = theme.includes('Activated by');
          const isExpanded = expandedHouse === h;

          return (
            <button
              key={h}
              onClick={() => setExpandedHouse(isExpanded ? null : h)}
              className={`p-2 rounded-lg text-center transition-all ${
                hasActivation
                  ? 'bg-amber-500/20 border border-amber-500/30 hover:bg-amber-500/30'
                  : 'bg-slate-900/50 border border-slate-700 hover:bg-slate-800/50'
              } ${isExpanded ? 'ring-2 ring-amber-500' : ''}`}
            >
              <div className={`text-lg font-bold ${hasActivation ? 'text-amber-400' : 'text-white/60'}`}>
                {h}
              </div>
              <div className="text-[8px] text-white/40">
                {hasActivation ? '●' : '○'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Expanded House Detail */}
      {expandedHouse && (
        <div className="mt-3 p-3 bg-slate-900/50 rounded-lg">
          <div className="text-xs text-amber-400 mb-1">House {expandedHouse}</div>
          <div className="text-sm text-white/80">
            {houseThemes[expandedHouse] || houseThemes[String(expandedHouse)] || 'No interpretation available.'}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Lagna Interpretation Panel (enhanced)
 */
function LagnaInterpretationPanel({ interpretations }) {
  if (!interpretations?.lagna) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 backdrop-blur-lg rounded-xl p-4 border border-indigo-500/30">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🌅</span>
        <div>
          <div className="text-xs text-indigo-400 uppercase tracking-wider font-medium">Lagna Interpretation</div>
          <div className="text-[9px] text-white/40 italic">Ascendant Meaning</div>
        </div>
      </div>

      <div className="text-sm text-white/90 leading-relaxed">
        {interpretations.lagna}
      </div>
    </div>
  );
}

/**
 * Nakshatra Interpretation Panel
 */
function NakshatraInterpretationPanel({ interpretations }) {
  const moonNak = interpretations?.moonNakshatra;
  const sunNak = interpretations?.sunNakshatra;

  if (!moonNak && !sunNak) return null;

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🌙</span>
        <div>
          <div className="text-xs text-white/60 uppercase tracking-wider font-medium">Nakshatra Wisdom</div>
          <div className="text-[9px] text-white/40 italic">Lunar Mansion Meanings</div>
        </div>
      </div>

      <div className="space-y-3">
        {moonNak && (
          <div className="p-3 bg-slate-900/50 rounded-lg">
            <div className="text-[10px] text-cyan-400 uppercase mb-1">Moon Nakshatra (Janma)</div>
            <div className="text-sm text-white/80">{moonNak}</div>
          </div>
        )}
        {sunNak && (
          <div className="p-3 bg-slate-900/50 rounded-lg">
            <div className="text-[10px] text-amber-400 uppercase mb-1">Sun Nakshatra</div>
            <div className="text-sm text-white/80">{sunNak}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function VedicAstrologyPage() {
  const { profileId } = useParams();
  const { profiles, loading: profilesLoading } = useProfiles();

  // State
  const [selectedProfileId, setSelectedProfileId] = useState(profileId || null);
  const [chart, setChart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ayanamsha, setAyanamsha] = useState('lahiri');

  // Get selected profile
  const selectedProfile = useMemo(() => {
    if (!profiles?.length) return null;
    return profiles.find(p => p.id === selectedProfileId) || profiles[0];
  }, [profiles, selectedProfileId]);

  // Auto-select first profile
  useEffect(() => {
    if (!selectedProfileId && profiles?.length > 0) {
      setSelectedProfileId(profiles[0].id);
    }
  }, [profiles, selectedProfileId]);

  // Calculate chart when profile or ayanamsha changes
  useEffect(() => {
    if (!selectedProfile?.birthDate) return;

    const fetchChart = async () => {
      setLoading(true);
      setError(null);

      try {
        const birthTime = selectedProfile.birthTime || '12:00';
        const lat = selectedProfile.location?.coordinates?.lat || selectedProfile.birthLat || 0;
        const lng = selectedProfile.location?.coordinates?.lng || selectedProfile.birthLng || 0;
        const timezone = selectedProfile.timezone?.name || selectedProfile.timezone || 'UTC';

        const result = await calculateVedicChart({
          birthDate: selectedProfile.birthDate,
          birthTime,
          latitude: lat,
          longitude: lng,
          timezone,
          ayanamsha,
          houseSystem: 'whole_sign'
        });

        if (result.success) {
          setChart(result.data);
        } else {
          setError(result.error || 'Failed to calculate chart');
        }
      } catch (err) {
        console.error('Error fetching Vedic chart:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChart();
  }, [selectedProfile, ayanamsha]);

  // Handle ayanamsha change
  const handleAyanamshaChange = (newAyanamsha) => {
    setAyanamsha(newAyanamsha);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-white/60 hover:text-white transition-colors">
                ← Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🕉️</span>
                <div>
                  <h1 className="text-xl font-semibold text-white">Vedic Astrology</h1>
                  <p className="text-xs text-white/50">Jyotish - Sidereal Zodiac</p>
                </div>
              </div>
            </div>

            {/* Profile Selector */}
            {profiles?.length > 0 && (
              <select
                value={selectedProfileId || ''}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                className="bg-slate-800 text-white rounded-lg px-3 py-2 text-sm border border-slate-600"
              >
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.displayName || p.firstName || 'Profile'}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {profilesLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-white/60">Loading profiles...</div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-4xl mb-4 animate-pulse">🕉️</div>
              <div className="text-white/60">Calculating Vedic Chart...</div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-6 text-center">
            <div className="text-red-400 text-lg mb-2">Error</div>
            <div className="text-white/60">{error}</div>
          </div>
        ) : chart ? (
          <div className="space-y-6">
            {/* Overall Synthesis - Full Width */}
            <SynthesisPanel interpretations={chart.interpretations} />

            {/* Main Chart Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Charts */}
              <div className="space-y-6">
                {/* Rashi Chart */}
                <RashiChartPanel chart={chart} grahas={chart.grahas} />

                {/* Graha Table */}
                <GrahaTablePanel grahas={chart.grahas} />

                {/* Graha Dignities */}
                <GrahaStrengthsPanel interpretations={chart.interpretations} />
              </div>

              {/* Right Column - Data & Interpretations */}
              <div className="space-y-6">
                {/* Moon Nakshatra */}
                <MoonNakshatraPanel
                  moonNakshatra={chart.moonNakshatra}
                  moonGraha={chart.grahas?.chandra}
                />

                {/* Lagna Panel */}
                <LagnaPanel lagna={chart.lagna} />

                {/* Lagna Interpretation */}
                <LagnaInterpretationPanel interpretations={chart.interpretations} />

                {/* Nakshatra Interpretations */}
                <NakshatraInterpretationPanel interpretations={chart.interpretations} />

                {/* Ayanamsha */}
                <AyanamshaPanel
                  chart={chart}
                  ayanamsha={ayanamsha}
                  onAyanamshaChange={handleAyanamshaChange}
                />
              </div>
            </div>

            {/* Temperament & Houses - Full Width Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Temperament Panel */}
              <TemperamentPanel interpretations={chart.interpretations} />

              {/* House Themes Panel */}
              <HouseThemesPanel interpretations={chart.interpretations} />
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-white/60">
            Select a profile to view Vedic chart
          </div>
        )}
      </main>
    </div>
  );
}
