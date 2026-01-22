/**
 * ============================================
 * DAYUN PANEL - 10-Year Luck Pillars Visualization
 * ============================================
 *
 * Displays the DaYun (大運) luck pillar timeline:
 * - Visual pillar sequence with age ranges
 * - Current pillar highlight
 * - LiuNian (annual) and XiaoYun (minor) luck
 * - Element flow analysis
 *
 * Part of Priority 2: BaZi Engine UI Integration
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  calculateDaYun,
  getCurrentLuckInfo,
  analyzeLuckElements,
  calculateAge,
  getElementColor,
  getStemElement
} from '../../services/baziDayunService';

// ============================================
// MAIN PANEL COMPONENT
// ============================================

export default function DaYunPanel({ birthDate, birthTime, isMale, showCompact = false }) {
  const [dayunData, setDayunData] = useState(null);
  const [currentLuck, setCurrentLuck] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPillar, setSelectedPillar] = useState(null);

  // Load DaYun data
  useEffect(() => {
    if (!birthDate) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [dayun, luck] = await Promise.all([
          calculateDaYun({ birthDate, birthTime, isMale, pillarCount: 10 }),
          getCurrentLuckInfo({ birthDate, birthTime, isMale })
        ]);

        setDayunData(dayun);
        setCurrentLuck(luck);

        // Auto-select current pillar
        if (luck?.dayun?.current) {
          setSelectedPillar(luck.dayun.current);
        }
      } catch (err) {
        console.error('DaYun load error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [birthDate, birthTime, isMale]);

  // Element analysis
  const elementAnalysis = useMemo(() => {
    if (!dayunData?.luck_pillars) return null;
    return analyzeLuckElements(dayunData.luck_pillars);
  }, [dayunData]);

  // Current age
  const currentAge = useMemo(() => {
    if (!birthDate) return 0;
    return calculateAge(birthDate);
  }, [birthDate]);

  if (!birthDate) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 text-center">
        <p className="text-slate-400">Please provide birth date to calculate luck pillars</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full" />
          <span className="text-slate-300">Calculating luck pillars...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 rounded-xl p-6 border border-red-500/30">
        <p className="text-red-300">Error: {error}</p>
      </div>
    );
  }

  if (!dayunData) return null;

  return (
    <div className="space-y-6">
      {/* Header with direction info */}
      <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl p-4 border border-amber-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-amber-300">
              大運 DaYun - 10-Year Luck Pillars
            </h3>
            <p className="text-sm text-amber-200/70 mt-1">
              Direction: {dayunData.direction_chinese} ({dayunData.direction})
              {' | '}
              Onset: Age {dayunData.onset_age?.years}
              {dayunData.onset_age?.months > 0 && ` + ${dayunData.onset_age.months} months`}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              Age {currentAge}
            </div>
            {currentLuck?.dayun?.years_remaining && (
              <div className="text-sm text-amber-200/70">
                {currentLuck.dayun.years_remaining} years in current pillar
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Luck Summary */}
      {currentLuck && (
        <CurrentLuckSummary luck={currentLuck} />
      )}

      {/* Pillar Timeline */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <h4 className="text-sm font-semibold text-slate-300 mb-4">Luck Pillar Timeline</h4>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dayunData.luck_pillars.map((pillar, index) => (
            <PillarCard
              key={index}
              pillar={pillar}
              isActive={currentAge >= pillar.age_start && currentAge <= pillar.age_end}
              isSelected={selectedPillar?.pillar_number === pillar.pillar_number}
              onClick={() => setSelectedPillar(pillar)}
              showCompact={showCompact}
            />
          ))}
        </div>
      </div>

      {/* Selected Pillar Details */}
      {selectedPillar && !showCompact && (
        <PillarDetails pillar={selectedPillar} isActive={
          currentAge >= selectedPillar.age_start && currentAge <= selectedPillar.age_end
        } />
      )}

      {/* Element Flow Analysis */}
      {elementAnalysis && !showCompact && (
        <ElementFlowAnalysis analysis={elementAnalysis} />
      )}

      {/* LiuNian Annual Luck */}
      {currentLuck?.liunian && !showCompact && (
        <LiuNianCard liunian={currentLuck.liunian} />
      )}

      {/* Mock data indicator */}
      {dayunData._mock && (
        <div className="text-xs text-slate-500 text-center mt-2">
          Using estimated data (backend offline)
        </div>
      )}
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function CurrentLuckSummary({ luck }) {
  if (!luck?.dayun?.current) return null;

  const current = luck.dayun.current;
  const element = getStemElement(current.stem);
  const colors = getElementColor(element);

  return (
    <div className={`${colors.bg} rounded-xl p-4 border ${colors.border}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">
            Current 10-Year Period
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{colors.emoji}</span>
            <div>
              <div className={`text-2xl font-bold ${colors.text}`}>
                {current.ganZhi}
              </div>
              <div className="text-sm text-slate-300">
                {current.stem}-{current.branch} | Ages {current.age_range}
              </div>
            </div>
          </div>
        </div>
        {luck.summary?.full && (
          <div className="max-w-xs text-right">
            <p className="text-sm text-slate-300">{luck.summary.major}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PillarCard({ pillar, isActive, isSelected, onClick, showCompact }) {
  const element = getStemElement(pillar.stem);
  const colors = getElementColor(element);

  return (
    <button
      onClick={onClick}
      className={`
        flex-shrink-0 rounded-lg p-3 border transition-all cursor-pointer
        ${isActive
          ? `${colors.bg} ${colors.border} ring-2 ring-amber-400/50`
          : isSelected
            ? `${colors.bg} ${colors.border}`
            : 'bg-slate-700/50 border-slate-600/50 hover:border-slate-500/50'
        }
      `}
      style={{ minWidth: showCompact ? '70px' : '90px' }}
    >
      <div className="text-center">
        <div className={`text-lg font-bold ${isActive || isSelected ? colors.text : 'text-slate-300'}`}>
          {pillar.ganZhi}
        </div>
        {!showCompact && (
          <>
            <div className="text-xs text-slate-400 mt-1">
              {pillar.stem}-{pillar.branch}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Ages {pillar.age_start}-{pillar.age_end}
            </div>
          </>
        )}
        {showCompact && (
          <div className="text-xs text-slate-400 mt-1">
            {pillar.age_start}-{pillar.age_end}
          </div>
        )}
        {isActive && (
          <div className="text-[10px] text-amber-400 mt-1 font-semibold">
            CURRENT
          </div>
        )}
      </div>
    </button>
  );
}

function PillarDetails({ pillar, isActive }) {
  const element = getStemElement(pillar.stem);
  const colors = getElementColor(element);

  // Element meanings
  const meanings = {
    Wood: {
      theme: 'Growth & Expansion',
      description: 'A period of new beginnings, growth, and development. Good for starting projects, learning, and personal development.',
      advice: 'Embrace opportunities for growth. Plant seeds for the future.',
      challenges: 'May feel scattered or overextended. Focus is key.'
    },
    Fire: {
      theme: 'Passion & Recognition',
      description: 'A dynamic period of visibility, passion, and self-expression. Career advancement and public recognition are highlighted.',
      advice: 'Step into the spotlight. Share your gifts with the world.',
      challenges: 'Risk of burnout. Balance passion with rest.'
    },
    Earth: {
      theme: 'Stability & Foundation',
      description: 'A grounding period focused on building solid foundations. Real estate, family, and long-term security are emphasized.',
      advice: 'Focus on practical matters. Build lasting structures.',
      challenges: 'May feel stuck or slow. Trust the process.'
    },
    Metal: {
      theme: 'Refinement & Precision',
      description: 'A period of discipline, refinement, and letting go of the unnecessary. Good for career advancement and developing expertise.',
      advice: 'Sharpen your skills. Cut away what no longer serves you.',
      challenges: 'May become rigid or critical. Practice flexibility.'
    },
    Water: {
      theme: 'Wisdom & Flow',
      description: 'An introspective period of wisdom, intuition, and adaptability. Deep thinking and spiritual development are favored.',
      advice: 'Trust your intuition. Go with the flow.',
      challenges: 'May feel uncertain or fearful. Embrace the unknown.'
    }
  };

  const meaning = meanings[element] || meanings.Earth;

  return (
    <div className={`${colors.bg} rounded-xl p-5 border ${colors.border}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{colors.emoji}</span>
            <h4 className={`text-xl font-bold ${colors.text}`}>
              {pillar.ganZhi} ({pillar.stem}-{pillar.branch})
            </h4>
            {isActive && (
              <span className="px-2 py-0.5 bg-amber-500/30 text-amber-300 text-xs rounded-full">
                Current Period
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Ages {pillar.age_start} to {pillar.age_end} | {element} Element
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h5 className={`font-semibold ${colors.text}`}>{meaning.theme}</h5>
          <p className="text-slate-300 text-sm mt-1">{meaning.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <h6 className="text-xs text-green-400 uppercase tracking-wide mb-1">Opportunities</h6>
            <p className="text-sm text-slate-300">{meaning.advice}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <h6 className="text-xs text-amber-400 uppercase tracking-wide mb-1">Watch For</h6>
            <p className="text-sm text-slate-300">{meaning.challenges}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ElementFlowAnalysis({ analysis }) {
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const maxCount = Math.max(...Object.values(analysis.distribution));

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
      <h4 className="text-sm font-semibold text-slate-300 mb-3">
        Life Element Distribution
      </h4>

      {/* Bar chart */}
      <div className="space-y-2 mb-4">
        {elements.map(element => {
          const count = analysis.distribution[element];
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
          const colors = getElementColor(element);

          return (
            <div key={element} className="flex items-center gap-2">
              <div className="w-16 flex items-center gap-1">
                <span>{colors.emoji}</span>
                <span className="text-xs text-slate-400">{element}</span>
              </div>
              <div className="flex-1 bg-slate-700/50 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full ${colors.bg} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-8 text-right text-xs text-slate-400">
                {count}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dominant element */}
      <div className="text-center pt-3 border-t border-slate-700/50">
        <div className="text-sm text-slate-400">Dominant Life Element</div>
        <div className={`text-lg font-bold ${getElementColor(analysis.dominantElement).text}`}>
          {getElementColor(analysis.dominantElement).emoji} {analysis.dominantElement}
        </div>
      </div>

      {/* Transitions */}
      {analysis.transitions.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-700/50">
          <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">
            Major Life Transitions
          </div>
          <div className="space-y-1">
            {analysis.transitions.slice(0, 3).map((t, i) => (
              <div key={i} className="text-sm text-slate-300">
                <span className="text-slate-500">Age {t.age}:</span> {t.description}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LiuNianCard({ liunian }) {
  const colors = getElementColor(liunian.element);

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">
            {liunian.year} Annual Luck (流年 LiuNian)
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{colors.emoji}</span>
            <span className={`text-xl font-bold ${colors.text}`}>
              {liunian.ganZhi}
            </span>
            <span className="text-slate-400">
              {liunian.element} {liunian.animal}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-lg ${colors.text}`}>
            {liunian.polarity} {liunian.element}
          </div>
          <div className="text-sm text-slate-400">
            Year of the {liunian.animal}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// EXPORTS
// ============================================

export { CurrentLuckSummary, PillarCard, PillarDetails, ElementFlowAnalysis, LiuNianCard };
