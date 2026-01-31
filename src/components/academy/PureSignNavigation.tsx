/**
 * PureSignNavigation Component
 * Ritual corridor navigation between Pure Signs and Cusps
 * Creates the flow: Previous Sign → Cusp → Current Sign → Cusp → Next Sign
 */

import React from 'react';
import {
  PURE_SIGN_ARCHETYPES,
  getPureSign,
  getNeighboringSigns,
  getOppositeSign,
  PureSignArchetype
} from '../../data/pureSignArchetypes';
import { CUSP_TRANSITIONS, getCuspBySignPair, CuspTransition } from '../../data/cuspArchetypes';

// ============================================================================
// Types
// ============================================================================

interface PureSignNavigationProps {
  sign: string;
  onSelectSign?: (sign: string) => void;
  onSelectCusp?: (cuspId: string) => void;
  className?: string;
}

interface NavCardProps {
  label: string;
  symbol: string;
  name: string;
  subtitle?: string;
  onClick?: () => void;
  variant: 'sign' | 'cusp' | 'opposite';
  element?: string;
}

// ============================================================================
// Element Colors
// ============================================================================

const ELEMENT_BG: Record<string, string> = {
  Fire: 'from-red-900/30 to-orange-900/20',
  Earth: 'from-emerald-900/30 to-green-900/20',
  Air: 'from-cyan-900/30 to-sky-900/20',
  Water: 'from-purple-900/30 to-indigo-900/20'
};

const ELEMENT_BORDER: Record<string, string> = {
  Fire: 'border-red-700/50 hover:border-red-600',
  Earth: 'border-emerald-700/50 hover:border-emerald-600',
  Air: 'border-cyan-700/50 hover:border-cyan-600',
  Water: 'border-purple-700/50 hover:border-purple-600'
};

// ============================================================================
// Sub-components
// ============================================================================

/**
 * Navigation card for sign or cusp
 */
const NavCard: React.FC<NavCardProps> = ({
  label,
  symbol,
  name,
  subtitle,
  onClick,
  variant,
  element
}) => {
  const bgGradient = element ? ELEMENT_BG[element] : 'from-slate-800/50 to-slate-900/50';
  const borderColor = element ? ELEMENT_BORDER[element] : 'border-slate-700 hover:border-purple-600';

  const variantStyles = {
    sign: 'min-w-[140px]',
    cusp: 'min-w-[120px] bg-gradient-to-br from-amber-900/20 to-purple-900/20',
    opposite: 'min-w-[140px] opacity-80'
  };

  return (
    <button
      onClick={onClick}
      className={`
        nav-card p-3 rounded-xl border transition-all cursor-pointer
        bg-gradient-to-br ${bgGradient} ${borderColor}
        ${variantStyles[variant]}
        ${onClick ? 'hover:scale-105 hover:shadow-lg' : 'cursor-default'}
      `}
    >
      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">{label}</div>
      <div className="text-2xl mb-1">{symbol}</div>
      <div className={`text-sm font-medium ${variant === 'cusp' ? 'text-amber-300' : 'text-slate-200'}`}>
        {name}
      </div>
      {subtitle && (
        <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>
      )}
    </button>
  );
};

/**
 * Arrow connector
 */
const Arrow: React.FC<{ direction?: 'left' | 'right' }> = ({ direction = 'right' }) => (
  <div className="flex items-center px-1">
    <span className="text-slate-600 text-lg">
      {direction === 'right' ? '→' : '←'}
    </span>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * PureSignNavigation - Full navigation corridor
 */
export const PureSignNavigation: React.FC<PureSignNavigationProps> = ({
  sign,
  onSelectSign,
  onSelectCusp,
  className = ''
}) => {
  const currentSign = getPureSign(sign);
  if (!currentSign) return null;

  const neighbors = getNeighboringSigns(sign);
  const prevSign = getPureSign(neighbors.previous);
  const nextSign = getPureSign(neighbors.next);
  const opposite = getOppositeSign(sign);
  const oppositeSign = getPureSign(opposite);

  // Find adjacent cusps
  const prevCusp = getCuspBySignPair(neighbors.previous, sign);
  const nextCusp = getCuspBySignPair(sign, neighbors.next);

  return (
    <nav className={`pure-sign-nav ${className}`}>
      {/* Main horizontal flow */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {/* Previous Sign */}
        {prevSign && (
          <NavCard
            label="Before"
            symbol={prevSign.symbol}
            name={prevSign.sign}
            subtitle={prevSign.element}
            onClick={onSelectSign ? () => onSelectSign(prevSign.sign) : undefined}
            variant="sign"
            element={prevSign.element}
          />
        )}

        <Arrow />

        {/* Incoming Cusp */}
        {prevCusp && (
          <NavCard
            label="Cusp"
            symbol={`${prevSign?.symbol}${currentSign.symbol}`}
            name={prevCusp.cuspName}
            subtitle={prevCusp.elementalDynamic}
            onClick={onSelectCusp ? () => onSelectCusp(prevCusp.id) : undefined}
            variant="cusp"
          />
        )}

        <Arrow />

        {/* Current Sign (highlighted) */}
        <div className="current-sign p-4 rounded-xl bg-gradient-to-br from-amber-900/40 to-purple-900/40 border-2 border-amber-500/50 shadow-lg shadow-amber-500/10">
          <div className="text-xs text-amber-400 uppercase tracking-wide mb-1">Current</div>
          <div className="text-4xl mb-1">{currentSign.symbol}</div>
          <div className="text-lg font-semibold text-amber-200">{currentSign.sign}</div>
          <div className="text-xs text-purple-300">{currentSign.mythicName}</div>
        </div>

        <Arrow />

        {/* Outgoing Cusp */}
        {nextCusp && (
          <NavCard
            label="Cusp"
            symbol={`${currentSign.symbol}${nextSign?.symbol}`}
            name={nextCusp.cuspName}
            subtitle={nextCusp.elementalDynamic}
            onClick={onSelectCusp ? () => onSelectCusp(nextCusp.id) : undefined}
            variant="cusp"
          />
        )}

        <Arrow />

        {/* Next Sign */}
        {nextSign && (
          <NavCard
            label="After"
            symbol={nextSign.symbol}
            name={nextSign.sign}
            subtitle={nextSign.element}
            onClick={onSelectSign ? () => onSelectSign(nextSign.sign) : undefined}
            variant="sign"
            element={nextSign.element}
          />
        )}
      </div>

      {/* Opposite Sign (below) */}
      {oppositeSign && (
        <div className="opposite-section mt-6 flex flex-col items-center">
          <div className="text-xs text-slate-500 mb-2">Opposite Axis</div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl">{currentSign.symbol}</div>
              <div className="text-xs text-slate-400">{currentSign.sign}</div>
            </div>
            <span className="text-slate-600">⟷</span>
            <NavCard
              label="Opposite"
              symbol={oppositeSign.symbol}
              name={oppositeSign.sign}
              subtitle={`${oppositeSign.element} • ${oppositeSign.modality}`}
              onClick={onSelectSign ? () => onSelectSign(oppositeSign.sign) : undefined}
              variant="opposite"
              element={oppositeSign.element}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

// ============================================================================
// Compact Navigation (just prev/next)
// ============================================================================

interface CompactNavProps {
  sign: string;
  onSelectSign?: (sign: string) => void;
  className?: string;
}

export const PureSignNavCompact: React.FC<CompactNavProps> = ({
  sign,
  onSelectSign,
  className = ''
}) => {
  const neighbors = getNeighboringSigns(sign);
  const prevSign = getPureSign(neighbors.previous);
  const nextSign = getPureSign(neighbors.next);

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {prevSign && (
        <button
          onClick={() => onSelectSign?.(prevSign.sign)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 transition-colors"
        >
          <span className="text-slate-500">←</span>
          <span className="text-xl">{prevSign.symbol}</span>
          <span className="text-sm text-slate-300">{prevSign.sign}</span>
        </button>
      )}

      {nextSign && (
        <button
          onClick={() => onSelectSign?.(nextSign.sign)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 transition-colors"
        >
          <span className="text-sm text-slate-300">{nextSign.sign}</span>
          <span className="text-xl">{nextSign.symbol}</span>
          <span className="text-slate-500">→</span>
        </button>
      )}
    </div>
  );
};

// ============================================================================
// Zodiac Wheel Mini (all 12 signs)
// ============================================================================

interface ZodiacWheelMiniProps {
  currentSign?: string;
  onSelectSign?: (sign: string) => void;
  className?: string;
}

export const ZodiacWheelMini: React.FC<ZodiacWheelMiniProps> = ({
  currentSign,
  onSelectSign,
  className = ''
}) => {
  return (
    <div className={`zodiac-wheel-mini ${className}`}>
      <div className="flex flex-wrap justify-center gap-2">
        {PURE_SIGN_ARCHETYPES.map(archetype => {
          const isSelected = archetype.sign === currentSign;
          return (
            <button
              key={archetype.sign}
              onClick={() => onSelectSign?.(archetype.sign)}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-xl
                border transition-all
                ${isSelected
                  ? 'bg-amber-500/30 border-amber-500 scale-110 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800/50 border-slate-700 hover:border-purple-500/50 hover:bg-slate-800'
                }
              `}
              title={archetype.sign}
            >
              {archetype.symbol}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// Element Triads Navigation
// ============================================================================

interface ElementTriadNavProps {
  element: string;
  currentSign?: string;
  onSelectSign?: (sign: string) => void;
  className?: string;
}

export const ElementTriadNav: React.FC<ElementTriadNavProps> = ({
  element,
  currentSign,
  onSelectSign,
  className = ''
}) => {
  const triad = PURE_SIGN_ARCHETYPES.filter(a => a.element === element);

  return (
    <div className={`element-triad-nav ${className}`}>
      <div className="text-xs text-slate-500 uppercase tracking-wide mb-2 text-center">
        {element} Triad
      </div>
      <div className="flex justify-center gap-3">
        {triad.map(archetype => {
          const isSelected = archetype.sign === currentSign;
          return (
            <button
              key={archetype.sign}
              onClick={() => onSelectSign?.(archetype.sign)}
              className={`
                flex flex-col items-center p-2 rounded-lg border transition-all
                ${isSelected
                  ? 'bg-amber-500/20 border-amber-500'
                  : 'bg-slate-800/30 border-slate-700 hover:border-purple-500/50'
                }
              `}
            >
              <span className="text-2xl">{archetype.symbol}</span>
              <span className="text-xs text-slate-400">{archetype.sign}</span>
              <span className="text-xs text-slate-600">{archetype.modality}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PureSignNavigation;
