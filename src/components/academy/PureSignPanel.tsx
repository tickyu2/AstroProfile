/**
 * PureSignPanel Component
 * Academy-styled display panel for pure sign archetypes
 * The mythic temples before blending begins
 */

import React from 'react';
import { PureSignArchetype, ELEMENTAL_COMPATIBILITY } from '../../data/pureSignArchetypes';

// ============================================================================
// Types
// ============================================================================

interface PureSignPanelProps {
  sign: PureSignArchetype;
  showFullProfile?: boolean;
  className?: string;
}

interface ElementBadgeProps {
  element: string;
  size?: 'sm' | 'md' | 'lg';
}

interface ModalityBadgeProps {
  modality: string;
}

interface PolarityBadgeProps {
  polarity: string;
}

// ============================================================================
// Element Colors and Symbols
// ============================================================================

const ELEMENT_STYLES: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  Fire: { bg: 'bg-red-900/30', border: 'border-red-500/50', text: 'text-red-400', glow: 'shadow-red-500/20' },
  Earth: { bg: 'bg-emerald-900/30', border: 'border-emerald-500/50', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  Air: { bg: 'bg-cyan-900/30', border: 'border-cyan-500/50', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
  Water: { bg: 'bg-purple-900/30', border: 'border-purple-500/50', text: 'text-purple-400', glow: 'shadow-purple-500/20' }
};

const ELEMENT_EMOJI: Record<string, string> = {
  Fire: '🔥',
  Earth: '🌍',
  Air: '💨',
  Water: '🌊'
};

const MODALITY_STYLES: Record<string, { icon: string; color: string }> = {
  Cardinal: { icon: '⚡', color: 'text-amber-400' },
  Fixed: { icon: '🏛️', color: 'text-slate-300' },
  Mutable: { icon: '🌀', color: 'text-indigo-400' }
};

const POLARITY_STYLES: Record<string, { icon: string; color: string; label: string }> = {
  Yang: { icon: '☀️', color: 'text-amber-300', label: 'Outward' },
  Yin: { icon: '🌙', color: 'text-slate-300', label: 'Inward' }
};

// ============================================================================
// Sub-components
// ============================================================================

/**
 * Element badge with icon and color
 */
const ElementBadge: React.FC<ElementBadgeProps> = ({ element, size = 'md' }) => {
  const style = ELEMENT_STYLES[element] || ELEMENT_STYLES.Fire;
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${style.bg} ${style.border} ${style.text} ${sizeClasses[size]}`}>
      <span>{ELEMENT_EMOJI[element]}</span>
      <span className="font-medium">{element}</span>
    </span>
  );
};

/**
 * Modality badge
 */
const ModalityBadge: React.FC<ModalityBadgeProps> = ({ modality }) => {
  const style = MODALITY_STYLES[modality] || MODALITY_STYLES.Cardinal;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-600/50 ${style.color} text-sm`}>
      <span>{style.icon}</span>
      <span className="font-medium">{modality}</span>
    </span>
  );
};

/**
 * Polarity badge
 */
const PolarityBadge: React.FC<PolarityBadgeProps> = ({ polarity }) => {
  const style = POLARITY_STYLES[polarity] || POLARITY_STYLES.Yang;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-600/50 ${style.color} text-sm`}>
      <span>{style.icon}</span>
      <span className="font-medium">{polarity}</span>
      <span className="text-slate-500 text-xs">({style.label})</span>
    </span>
  );
};

/**
 * Trait tags (strengths/shadows)
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
 * PureSignPanel - Display a pure sign archetype with full mythic styling
 */
export const PureSignPanel: React.FC<PureSignPanelProps> = ({
  sign,
  showFullProfile = true,
  className = ''
}) => {
  const elementStyle = ELEMENT_STYLES[sign.element] || ELEMENT_STYLES.Fire;

  return (
    <section className={`pure-sign-panel bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-xl border border-slate-700 overflow-hidden ${className}`}>
      {/* Header */}
      <header className={`pure-sign-header p-6 border-b border-slate-700 ${elementStyle.bg}`}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-serif text-amber-200 flex items-center gap-3">
              <span className="text-4xl">{sign.symbol}</span>
              <span>{sign.sign}</span>
            </h1>
            <p className="pure-sign-title text-lg text-purple-300 font-light mt-2 italic">
              "{sign.title}"
            </p>
            <p className="pure-sign-mythic text-xl text-slate-300 font-serif mt-1">
              {sign.mythicName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">{sign.dateRange}</p>
            <p className="text-xs text-slate-500 mt-1">{sign.rulingPlanet}</p>
          </div>
        </div>
      </header>

      {/* Meta badges */}
      <section className="pure-sign-meta p-4 flex flex-wrap gap-3 border-b border-slate-700/50 bg-slate-800/30">
        <ElementBadge element={sign.element} />
        <ModalityBadge modality={sign.modality} />
        <PolarityBadge polarity={sign.polarity} />
      </section>

      {/* Seasonal Arc */}
      <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500">Seasonal Arc:</span>
          <span className="text-cyan-400">{sign.seasonalArc}</span>
        </div>
      </div>

      {showFullProfile && (
        <>
          {/* Core Motivation */}
          <section className="p-4 border-b border-slate-700/50">
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">
              Core Motivation
            </h3>
            <p className="text-slate-300 text-lg italic">
              "{sign.coreMotivation}"
            </p>
          </section>

          {/* Psychological Profile */}
          <section className="pure-sign-psych p-4 border-b border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Psychological Profile
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {sign.psychologicalProfile}
            </p>
          </section>

          {/* Strengths & Shadows */}
          <section className="pure-sign-lists p-4 border-b border-slate-700/50 grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2">
                ✦ Strengths
              </h3>
              <TraitTags traits={sign.strengths} variant="strength" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-wide mb-2">
                ☽ Shadows
              </h3>
              <TraitTags traits={sign.shadows} variant="shadow" />
            </div>
          </section>

          {/* Life Theme */}
          <section className="pure-sign-theme p-4 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
            <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wide mb-2">
              Life Theme
            </h3>
            <p className="text-slate-300 italic text-lg">
              "{sign.lifeTheme}"
            </p>
          </section>
        </>
      )}
    </section>
  );
};

// ============================================================================
// Compact Card Variant
// ============================================================================

interface PureSignCardProps {
  sign: PureSignArchetype;
  onClick?: () => void;
  isSelected?: boolean;
  className?: string;
}

/**
 * PureSignCard - Compact card for sign selection/display
 */
export const PureSignCard: React.FC<PureSignCardProps> = ({
  sign,
  onClick,
  isSelected = false,
  className = ''
}) => {
  const elementStyle = ELEMENT_STYLES[sign.element] || ELEMENT_STYLES.Fire;

  return (
    <button
      onClick={onClick}
      className={`
        pure-sign-card w-full text-left p-4 rounded-lg border transition-all
        ${isSelected
          ? `${elementStyle.bg} ${elementStyle.border} shadow-lg ${elementStyle.glow}`
          : 'bg-slate-800/50 border-slate-700 hover:border-purple-500/50 hover:bg-slate-800'
        }
        ${className}
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{sign.symbol}</span>
        <div className="flex-1">
          <h4 className="text-lg font-medium text-amber-200">
            {sign.sign}
          </h4>
          <p className="text-xs text-slate-400">{sign.mythicName}</p>
        </div>
        <ElementBadge element={sign.element} size="sm" />
      </div>
    </button>
  );
};

// ============================================================================
// Mini Badge (for lists)
// ============================================================================

interface PureSignMiniBadgeProps {
  sign: PureSignArchetype;
  showElement?: boolean;
}

/**
 * PureSignMiniBadge - Tiny inline badge
 */
export const PureSignMiniBadge: React.FC<PureSignMiniBadgeProps> = ({
  sign,
  showElement = false
}) => {
  const elementStyle = ELEMENT_STYLES[sign.element] || ELEMENT_STYLES.Fire;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${elementStyle.bg} ${elementStyle.border} border text-xs`}>
      <span>{sign.symbol}</span>
      <span className={elementStyle.text}>{sign.sign}</span>
      {showElement && <span className="text-slate-500">({sign.element})</span>}
    </span>
  );
};

export default PureSignPanel;
