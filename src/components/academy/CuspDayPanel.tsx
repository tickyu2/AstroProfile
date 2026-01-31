/**
 * CuspDayPanel Component
 * Academy-styled display panel for cusp day archetypes
 */

import React from 'react';
import { CuspDateResult } from '../../utils/cuspHelpers';
import { CuspDayArchetype, CuspTransition } from '../../data/cuspArchetypes';

// ============================================================================
// Types
// ============================================================================

interface CuspDayPanelProps {
  cuspResult: CuspDateResult;
  showFullProfile?: boolean;
  className?: string;
}

interface BlendVisualizerProps {
  blendOld: number;
  blendNew: number;
  fromSign: string;
  toSign: string;
  fromSymbol: string;
  toSymbol: string;
}

// ============================================================================
// Sub-components
// ============================================================================

/**
 * Visual representation of the blend percentages
 */
const BlendVisualizer: React.FC<BlendVisualizerProps> = ({
  blendOld,
  blendNew,
  fromSign,
  toSign,
  fromSymbol,
  toSymbol
}) => {
  const oldPercent = Math.round(blendOld * 100);
  const newPercent = Math.round(blendNew * 100);

  return (
    <div className="blend-visualizer space-y-2">
      {/* Signs header */}
      <div className="flex justify-between items-center text-sm">
        <span className="flex items-center gap-1 text-amber-300">
          <span className="text-lg">{fromSymbol}</span>
          <span>{fromSign}</span>
        </span>
        <span className="flex items-center gap-1 text-purple-300">
          <span>{toSign}</span>
          <span className="text-lg">{toSymbol}</span>
        </span>
      </div>

      {/* Gradient bar */}
      <div className="relative h-3 rounded-full overflow-hidden bg-slate-700">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-purple-500"
          style={{ width: '100%' }}
        />
        {/* Blend indicator */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
          style={{ left: `${newPercent}%`, transform: 'translateX(-50%)' }}
        />
      </div>

      {/* Percentages */}
      <div className="flex justify-between text-xs text-slate-400">
        <span>{oldPercent}% {fromSign}</span>
        <span>{newPercent}% {toSign}</span>
      </div>
    </div>
  );
};

/**
 * Strength/Shadow tag list
 */
const TraitTags: React.FC<{ traits: string[]; variant: 'strength' | 'shadow' }> = ({
  traits,
  variant
}) => {
  const bgClass = variant === 'strength'
    ? 'bg-emerald-900/50 text-emerald-300 border-emerald-700'
    : 'bg-rose-900/50 text-rose-300 border-rose-700';

  return (
    <div className="flex flex-wrap gap-2">
      {traits.map((trait, index) => (
        <span
          key={index}
          className={`px-2 py-1 text-xs rounded-full border ${bgClass}`}
        >
          {trait}
        </span>
      ))}
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

/**
 * CuspDayPanel - Display a cusp day archetype with full mythic styling
 */
export const CuspDayPanel: React.FC<CuspDayPanelProps> = ({
  cuspResult,
  showFullProfile = true,
  className = ''
}) => {
  const { cusp, dayArchetype } = cuspResult;

  return (
    <div className={`cusp-day-panel bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-xl border border-slate-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900/30 via-purple-900/30 to-indigo-900/30 p-4 border-b border-slate-700">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-serif text-amber-200">
              {dayArchetype.mythicName}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {cusp.cuspName} · Day {dayArchetype.day}
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl">
              {cusp.fromSymbol}{cusp.toSymbol}
            </span>
            <p className="text-xs text-slate-500 mt-1">{dayArchetype.date}</p>
          </div>
        </div>

        {/* Title */}
        <p className="text-lg text-purple-300 font-light mt-2 italic">
          "{dayArchetype.title}"
        </p>
      </div>

      {/* Blend Visualizer */}
      <div className="p-4 border-b border-slate-700/50">
        <BlendVisualizer
          blendOld={dayArchetype.blendOld}
          blendNew={dayArchetype.blendNew}
          fromSign={cusp.fromSign}
          toSign={cusp.toSign}
          fromSymbol={cusp.fromSymbol}
          toSymbol={cusp.toSymbol}
        />
      </div>

      {/* Elemental Dynamic */}
      <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500">Elemental Dynamic:</span>
          <span className="text-cyan-400">{cusp.elementalDynamic}</span>
        </div>
      </div>

      {showFullProfile && (
        <>
          {/* Psychological Profile */}
          <div className="p-4 border-b border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Psychological Profile
            </h4>
            <p className="text-slate-300 leading-relaxed">
              {dayArchetype.psychologicalProfile}
            </p>
          </div>

          {/* Strengths */}
          <div className="p-4 border-b border-slate-700/50">
            <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2">
              ✦ Strengths
            </h4>
            <TraitTags traits={dayArchetype.strengths} variant="strength" />
          </div>

          {/* Shadows */}
          <div className="p-4 border-b border-slate-700/50">
            <h4 className="text-sm font-semibold text-rose-400 uppercase tracking-wide mb-2">
              ☽ Shadows
            </h4>
            <TraitTags traits={dayArchetype.shadows} variant="shadow" />
          </div>

          {/* Life Theme */}
          <div className="p-4 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
            <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wide mb-2">
              Life Theme
            </h4>
            <p className="text-slate-300 italic">
              "{dayArchetype.lifeTheme}"
            </p>
          </div>
        </>
      )}
    </div>
  );
};

// ============================================================================
// Compact Variant
// ============================================================================

interface CuspDayCardProps {
  cuspResult: CuspDateResult;
  onClick?: () => void;
  isSelected?: boolean;
  className?: string;
}

/**
 * CuspDayCard - Compact card for cusp day selection/display
 */
export const CuspDayCard: React.FC<CuspDayCardProps> = ({
  cuspResult,
  onClick,
  isSelected = false,
  className = ''
}) => {
  const { cusp, dayArchetype } = cuspResult;
  const newPercent = Math.round(dayArchetype.blendNew * 100);

  return (
    <button
      onClick={onClick}
      className={`
        cusp-day-card w-full text-left p-3 rounded-lg border transition-all
        ${isSelected
          ? 'bg-purple-900/40 border-purple-500 shadow-lg shadow-purple-500/20'
          : 'bg-slate-800/50 border-slate-700 hover:border-purple-500/50 hover:bg-slate-800'
        }
        ${className}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{cusp.fromSymbol}{cusp.toSymbol}</span>
          <div>
            <h4 className="text-sm font-medium text-amber-200">
              {dayArchetype.mythicName}
            </h4>
            <p className="text-xs text-slate-500">Day {dayArchetype.day} · {dayArchetype.date}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-purple-400">{newPercent}%</span>
          <span className="text-xs text-slate-500"> {cusp.toSign}</span>
        </div>
      </div>
    </button>
  );
};

// ============================================================================
// Pure Sign Panel (for non-cusp dates)
// ============================================================================

interface PureSignPanelProps {
  sign: string;
  pureArchetype: {
    mythicName: string;
    title: string;
    symbol: string;
    element: string;
    modality: string;
    psychologicalProfile: string;
    strengths: string[];
    shadows: string[];
    lifeTheme: string;
  };
  className?: string;
}

/**
 * PureSignPanel - Display for dates not on a cusp
 */
export const PureSignPanel: React.FC<PureSignPanelProps> = ({
  sign,
  pureArchetype,
  className = ''
}) => {
  return (
    <div className={`pure-sign-panel bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-xl border border-slate-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900/30 to-indigo-900/30 p-4 border-b border-slate-700">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-serif text-amber-200">
              {pureArchetype.mythicName}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Pure {sign} · {pureArchetype.element} · {pureArchetype.modality}
            </p>
          </div>
          <span className="text-4xl">{pureArchetype.symbol}</span>
        </div>

        <p className="text-lg text-purple-300 font-light mt-2 italic">
          "{pureArchetype.title}"
        </p>
      </div>

      {/* Psychological Profile */}
      <div className="p-4 border-b border-slate-700/50">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">
          Psychological Profile
        </h4>
        <p className="text-slate-300 leading-relaxed">
          {pureArchetype.psychologicalProfile}
        </p>
      </div>

      {/* Strengths */}
      <div className="p-4 border-b border-slate-700/50">
        <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2">
          ✦ Strengths
        </h4>
        <TraitTags traits={pureArchetype.strengths} variant="strength" />
      </div>

      {/* Shadows */}
      <div className="p-4 border-b border-slate-700/50">
        <h4 className="text-sm font-semibold text-rose-400 uppercase tracking-wide mb-2">
          ☽ Shadows
        </h4>
        <TraitTags traits={pureArchetype.shadows} variant="shadow" />
      </div>

      {/* Life Theme */}
      <div className="p-4 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
        <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wide mb-2">
          Life Theme
        </h4>
        <p className="text-slate-300 italic">
          "{pureArchetype.lifeTheme}"
        </p>
      </div>
    </div>
  );
};

export default CuspDayPanel;
