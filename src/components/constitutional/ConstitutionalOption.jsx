/**
 * ConstitutionalOption.jsx
 * Interactive Element Selection Option for Constitutional Assessment
 *
 * Beautiful, animated option cards representing the 5 elements:
 * Fire, Earth, Metal, Water, Wood
 *
 * Part of GENESIS - Constitutional Assessment System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 14, 2024
 */

import React from 'react';

// Element configurations with colors, gradients, and styling
export const ELEMENT_CONFIG = {
  Fire: {
    icon: '🔥',
    gradient: 'from-orange-500 to-red-600',
    bgGradient: 'from-orange-500/20 to-red-600/20',
    borderColor: 'border-orange-500/50',
    textColor: 'text-orange-400',
    glowColor: 'shadow-orange-500/30',
    hoverBg: 'hover:bg-orange-500/10'
  },
  Earth: {
    icon: '🌍',
    gradient: 'from-amber-500 to-yellow-600',
    bgGradient: 'from-amber-500/20 to-yellow-600/20',
    borderColor: 'border-amber-500/50',
    textColor: 'text-amber-400',
    glowColor: 'shadow-amber-500/30',
    hoverBg: 'hover:bg-amber-500/10'
  },
  Metal: {
    icon: '⚡',
    gradient: 'from-slate-400 to-gray-500',
    bgGradient: 'from-slate-400/20 to-gray-500/20',
    borderColor: 'border-slate-400/50',
    textColor: 'text-slate-300',
    glowColor: 'shadow-slate-400/30',
    hoverBg: 'hover:bg-slate-400/10'
  },
  Water: {
    icon: '🌊',
    gradient: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-500/20 to-cyan-600/20',
    borderColor: 'border-blue-500/50',
    textColor: 'text-blue-400',
    glowColor: 'shadow-blue-500/30',
    hoverBg: 'hover:bg-blue-500/10'
  },
  Wood: {
    icon: '🌱',
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-500/20 to-emerald-600/20',
    borderColor: 'border-green-500/50',
    textColor: 'text-green-400',
    glowColor: 'shadow-green-500/30',
    hoverBg: 'hover:bg-green-500/10'
  }
};

/**
 * ConstitutionalOption Component
 *
 * @param {Object} props
 * @param {string} props.element - Element type (Fire, Earth, Metal, Water, Wood)
 * @param {string} props.title - Option title
 * @param {string} props.description - Option description
 * @param {string[]} props.traits - Array of trait keywords
 * @param {boolean} props.selected - Whether this option is selected
 * @param {Function} props.onSelect - Callback when selected
 */
export function ConstitutionalOption({
  element,
  title,
  description,
  traits = [],
  selected = false,
  onSelect
}) {
  const config = ELEMENT_CONFIG[element] || ELEMENT_CONFIG.Wood;

  return (
    <button
      onClick={() => onSelect(element)}
      className={`
        relative w-full p-4 rounded-2xl text-left transition-all duration-300
        border-2 group
        ${selected
          ? `bg-gradient-to-br ${config.bgGradient} ${config.borderColor} shadow-lg ${config.glowColor}`
          : `bg-slate-800/50 border-white/10 ${config.hoverBg} hover:border-white/20`
        }
      `}
    >
      {/* Selection indicator */}
      {selected && (
        <div className={`absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center text-white text-sm font-bold animate-pulse`}>
          ✓
        </div>
      )}

      {/* Element icon */}
      <div className={`text-4xl mb-3 transition-transform duration-300 ${selected ? 'scale-110' : 'group-hover:scale-110'}`}>
        {config.icon}
      </div>

      {/* Title */}
      <h3 className={`text-lg font-bold mb-1 transition-colors ${selected ? config.textColor : 'text-white/90 group-hover:text-white'}`}>
        {title}
      </h3>

      {/* Element badge */}
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 bg-gradient-to-r ${config.gradient} text-white`}>
        {element}
      </span>

      {/* Description */}
      <p className="text-sm text-white/60 mb-3 leading-relaxed">
        {description}
      </p>

      {/* Traits */}
      {traits.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {traits.map((trait, index) => (
            <span
              key={index}
              className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                selected
                  ? `bg-white/20 ${config.textColor}`
                  : 'bg-white/5 text-white/50'
              }`}
            >
              {trait}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

/**
 * OptionGrid - Container for arranging options
 */
export function OptionGrid({ children, columns = 'auto' }) {
  const gridCols = columns === 'auto'
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
    : `grid-cols-${columns}`;

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {children}
    </div>
  );
}

export default ConstitutionalOption;
