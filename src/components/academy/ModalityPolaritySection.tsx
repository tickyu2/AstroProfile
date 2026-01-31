/**
 * ModalityPolaritySection Component
 * Academy chamber explaining the three modalities and two polarities
 * The rhythmic structure underlying all signs
 */

import React from 'react';
import { getSignsByModality, getSignsByPolarity, getPureSign, MODALITIES, POLARITIES } from '../../data/pureSignArchetypes';

// ============================================================================
// Types
// ============================================================================

interface ModalityPolaritySectionProps {
  highlightSign?: string;
  className?: string;
}

interface ModalityCardProps {
  modality: string;
  description: string;
  signs: string[];
  icon: string;
  color: string;
  highlightSign?: string;
}

interface PolarityCardProps {
  polarity: string;
  description: string;
  direction: string;
  signs: string[];
  icon: string;
  color: string;
  highlightSign?: string;
}

// ============================================================================
// Modality Descriptions
// ============================================================================

const MODALITY_DATA: Record<string, { description: string; icon: string; color: string; longDescription: string }> = {
  Cardinal: {
    description: 'Initiators. They begin cycles, spark movement, and open new paths.',
    longDescription: 'Cardinal signs mark the beginning of each season. They carry the energy of initiation—the spark that starts the fire, the first step into unknown territory. Cardinal energy is enterprising, ambitious, and action-oriented. It asks: "What needs to start?"',
    icon: '⚡',
    color: 'text-amber-400'
  },
  Fixed: {
    description: 'Stabilizers. They deepen, sustain, and protect what has begun.',
    longDescription: 'Fixed signs occupy the heart of each season. They carry the energy of persistence—the roots that hold the tree, the dedication that sees things through. Fixed energy is determined, loyal, and resistant to change. It asks: "What needs to be preserved?"',
    icon: '🏛️',
    color: 'text-slate-300'
  },
  Mutable: {
    description: 'Adapters. They transition, refine, and prepare for the next cycle.',
    longDescription: 'Mutable signs end each season. They carry the energy of adaptation—the bridge between what was and what will be, the flexibility that allows evolution. Mutable energy is versatile, responsive, and accepting of change. It asks: "What needs to transform?"',
    icon: '🌀',
    color: 'text-indigo-400'
  }
};

// ============================================================================
// Polarity Descriptions
// ============================================================================

const POLARITY_DATA: Record<string, { description: string; direction: string; icon: string; color: string; longDescription: string }> = {
  Yang: {
    description: 'Active, expressive, externally focused.',
    direction: 'Outward',
    longDescription: 'Yang signs (Fire and Air) project energy outward into the world. They are assertive, expressive, and action-oriented. Yang energy initiates contact, speaks first, and leads with doing. It is the exhale, the light, the spark that reaches toward others.',
    icon: '☀️',
    color: 'text-amber-300'
  },
  Yin: {
    description: 'Receptive, reflective, internally focused.',
    direction: 'Inward',
    longDescription: 'Yin signs (Earth and Water) draw energy inward for processing. They are receptive, reflective, and response-oriented. Yin energy waits, observes, and leads with feeling. It is the inhale, the shadow, the depth that contains and nurtures.',
    icon: '🌙',
    color: 'text-slate-300'
  }
};

// ============================================================================
// Sub-components
// ============================================================================

/**
 * Sign badge with symbol
 */
const SignBadge: React.FC<{ sign: string; highlighted: boolean }> = ({ sign, highlighted }) => {
  const archetype = getPureSign(sign);
  if (!archetype) return null;

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm
        ${highlighted
          ? 'bg-amber-500/30 border border-amber-500 text-amber-200'
          : 'bg-slate-700/50 border border-slate-600 text-slate-300'
        }
      `}
    >
      <span>{archetype.symbol}</span>
      <span>{sign}</span>
    </span>
  );
};

/**
 * Modality card with signs
 */
const ModalityCard: React.FC<ModalityCardProps> = ({
  modality,
  description,
  signs,
  icon,
  color,
  highlightSign
}) => {
  return (
    <div className="modality-card bg-slate-800/50 rounded-xl border border-slate-700 p-4 hover:border-slate-600 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{icon}</span>
        <h3 className={`text-xl font-semibold ${color}`}>{modality}</h3>
      </div>
      <p className="text-slate-300 text-sm mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {signs.map(sign => (
          <SignBadge
            key={sign}
            sign={sign}
            highlighted={sign === highlightSign}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Polarity card with signs
 */
const PolarityCard: React.FC<PolarityCardProps> = ({
  polarity,
  description,
  direction,
  signs,
  icon,
  color,
  highlightSign
}) => {
  return (
    <div className="polarity-card bg-slate-800/50 rounded-xl border border-slate-700 p-4 hover:border-slate-600 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h3 className={`text-xl font-semibold ${color}`}>{polarity}</h3>
        </div>
        <span className="text-xs text-slate-500 uppercase tracking-wide">{direction}</span>
      </div>
      <p className="text-slate-300 text-sm mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {signs.map(sign => (
          <SignBadge
            key={sign}
            sign={sign}
            highlighted={sign === highlightSign}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

/**
 * ModalityPolaritySection - Complete Academy chamber for modalities and polarities
 */
export const ModalityPolaritySection: React.FC<ModalityPolaritySectionProps> = ({
  highlightSign,
  className = ''
}) => {
  return (
    <section className={`modality-polarity space-y-8 ${className}`}>
      {/* Modalities */}
      <div>
        <h2 className="text-2xl font-serif text-amber-200 mb-2">The Three Modes of Reality</h2>
        <p className="text-slate-400 mb-6">
          Every sign belongs to one of three modalities, describing how it engages with the world.
        </p>

        <div className="modality-grid grid md:grid-cols-3 gap-4">
          {MODALITIES.map(modality => (
            <ModalityCard
              key={modality}
              modality={modality}
              description={MODALITY_DATA[modality].description}
              signs={getSignsByModality(modality).map(a => a.sign)}
              icon={MODALITY_DATA[modality].icon}
              color={MODALITY_DATA[modality].color}
              highlightSign={highlightSign}
            />
          ))}
        </div>
      </div>

      {/* The Cycle Visualization */}
      <div className="cycle-visual bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-slate-300 mb-4 text-center">The Seasonal Rhythm</h3>
        <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
          <span className="px-3 py-1 bg-amber-900/30 border border-amber-700/50 rounded-full text-amber-300">
            ⚡ Cardinal begins
          </span>
          <span className="text-slate-500">→</span>
          <span className="px-3 py-1 bg-slate-700/50 border border-slate-600/50 rounded-full text-slate-300">
            🏛️ Fixed deepens
          </span>
          <span className="text-slate-500">→</span>
          <span className="px-3 py-1 bg-indigo-900/30 border border-indigo-700/50 rounded-full text-indigo-300">
            🌀 Mutable transitions
          </span>
          <span className="text-slate-500">→</span>
          <span className="text-slate-500 italic">next cycle</span>
        </div>
      </div>

      {/* Polarity */}
      <div>
        <h2 className="text-2xl font-serif text-amber-200 mb-2">Polarity: The Direction of Energy</h2>
        <p className="text-slate-400 mb-6">
          Polarity describes whether energy flows outward (Yang) or inward (Yin).
        </p>

        <div className="polarity-grid grid md:grid-cols-2 gap-4">
          {POLARITIES.map(polarity => (
            <PolarityCard
              key={polarity}
              polarity={polarity}
              description={POLARITY_DATA[polarity].description}
              direction={POLARITY_DATA[polarity].direction}
              signs={getSignsByPolarity(polarity).map(a => a.sign)}
              icon={POLARITY_DATA[polarity].icon}
              color={POLARITY_DATA[polarity].color}
              highlightSign={highlightSign}
            />
          ))}
        </div>
      </div>

      {/* Element-Polarity Connection */}
      <div className="element-polarity-connection bg-gradient-to-r from-slate-800/50 to-slate-800/30 rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-purple-300 mb-4">Element-Polarity Connection</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl">☀️</span>
            <div>
              <p className="text-amber-300 font-medium">Yang Elements</p>
              <p className="text-slate-400">🔥 Fire and 💨 Air — expressive, active, outward</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌙</span>
            <div>
              <p className="text-slate-300 font-medium">Yin Elements</p>
              <p className="text-slate-400">🌍 Earth and 🌊 Water — receptive, reflective, inward</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// Standalone Modality Section (compact)
// ============================================================================

export const ModalitySection: React.FC<{ highlightModality?: string; className?: string }> = ({
  highlightModality,
  className = ''
}) => {
  return (
    <div className={`modality-section ${className}`}>
      <h3 className="text-lg font-semibold text-amber-200 mb-4">Modalities</h3>
      <div className="space-y-3">
        {MODALITIES.map(modality => {
          const data = MODALITY_DATA[modality];
          const isHighlighted = modality === highlightModality;
          return (
            <div
              key={modality}
              className={`
                flex items-start gap-3 p-3 rounded-lg border
                ${isHighlighted
                  ? 'bg-amber-900/20 border-amber-700/50'
                  : 'bg-slate-800/30 border-slate-700/50'
                }
              `}
            >
              <span className="text-xl">{data.icon}</span>
              <div>
                <h4 className={`font-semibold ${isHighlighted ? 'text-amber-200' : data.color}`}>
                  {modality}
                </h4>
                <p className="text-xs text-slate-400">{data.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// Standalone Polarity Section (compact)
// ============================================================================

export const PolaritySection: React.FC<{ highlightPolarity?: string; className?: string }> = ({
  highlightPolarity,
  className = ''
}) => {
  return (
    <div className={`polarity-section ${className}`}>
      <h3 className="text-lg font-semibold text-amber-200 mb-4">Polarity</h3>
      <div className="space-y-3">
        {POLARITIES.map(polarity => {
          const data = POLARITY_DATA[polarity];
          const isHighlighted = polarity === highlightPolarity;
          return (
            <div
              key={polarity}
              className={`
                flex items-start gap-3 p-3 rounded-lg border
                ${isHighlighted
                  ? 'bg-amber-900/20 border-amber-700/50'
                  : 'bg-slate-800/30 border-slate-700/50'
                }
              `}
            >
              <span className="text-xl">{data.icon}</span>
              <div>
                <h4 className={`font-semibold ${isHighlighted ? 'text-amber-200' : data.color}`}>
                  {polarity}
                  <span className="text-xs text-slate-500 ml-2">({data.direction})</span>
                </h4>
                <p className="text-xs text-slate-400">{data.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModalityPolaritySection;
