/**
 * BehindTheScenesPage
 * Academy chapter explaining the mathematics, symbolism, and logic
 * behind the cusp system — the φ-curve, modalities, polarities
 */

import React from 'react';
import { WhyPhiCurveMatters, WhyModalityMatters, WhyElementMatters } from '../../components/academy/WhyItMatters';
import { ModalityPolaritySection } from '../../components/academy/ModalityPolaritySection';
import { PHI_CURVE } from '../../utils/cuspHelpers';

// ============================================================================
// Sub-components
// ============================================================================

/**
 * φ-Curve visualization
 */
const PhiCurveVisualization: React.FC = () => {
  const days = [1, 2, 3, 4, 5, 6];
  const values = [0.13, 0.37, 0.58, 0.75, 0.89, 0.98];

  return (
    <div className="phi-curve-viz bg-slate-800/50 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-amber-200 mb-4">The φ-Curve in Action</h3>

      {/* Bar chart */}
      <div className="flex items-end justify-between gap-2 h-48 mb-4">
        {days.map((day, i) => {
          const percent = Math.round(values[i] * 100);
          return (
            <div key={day} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-amber-500 to-purple-500 rounded-t-lg transition-all"
                style={{ height: `${percent * 1.8}px` }}
              />
              <div className="text-xs text-slate-400 mt-2">Day {day}</div>
              <div className="text-sm text-purple-300 font-medium">{percent}%</div>
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      <p className="text-sm text-slate-400">
        The curve shows how much of the <span className="text-purple-300">new sign</span> is present on each day.
        By Day 6, 98% has transitioned — only echoes of the previous sign remain.
      </p>
    </div>
  );
};

/**
 * φ-Curve formula explanation
 */
const PhiCurveFormula: React.FC = () => {
  return (
    <div className="phi-formula bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
      <h3 className="text-lg font-semibold text-purple-300 mb-4">The Mathematics</h3>

      <div className="formula-display bg-slate-900/50 p-4 rounded-lg font-mono text-center mb-4">
        <span className="text-amber-300">blend</span>
        <span className="text-slate-500"> = (</span>
        <span className="text-purple-300">day / 6</span>
        <span className="text-slate-500">)</span>
        <span className="text-cyan-300 align-super text-sm">φ</span>
      </div>

      <p className="text-sm text-slate-400 mb-4">
        Where <span className="text-cyan-300 font-mono">φ ≈ 1.6</span> (approximating the golden ratio 1.618...)
      </p>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <h4 className="text-amber-400 font-medium mb-1">Why φ?</h4>
          <p className="text-slate-400">
            The golden ratio appears throughout nature — shells, galaxies, flower petals.
            It models how natural transitions unfold: slow start, accelerating middle, gentle landing.
          </p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <h4 className="text-amber-400 font-medium mb-1">Why 6 days?</h4>
          <p className="text-slate-400">
            Approximately 6 days captures the transition window where astrological
            influence genuinely shifts. Shorter windows feel too abrupt; longer ones dilute the blend.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Modality logic explanation
 */
const ModalityLogicSection: React.FC = () => {
  return (
    <div className="modality-logic bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
      <h3 className="text-lg font-semibold text-amber-200 mb-4">Modality Logic</h3>

      <p className="text-slate-400 mb-4">
        Each sign expresses one of three modes, describing how it engages with reality:
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-amber-900/20 rounded-lg border border-amber-700/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⚡</span>
            <h4 className="text-amber-300 font-semibold">Cardinal</h4>
          </div>
          <p className="text-sm text-slate-400">
            <strong>Initiators.</strong> They begin seasons and cycles.
            They ask: "What needs to start?"
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Aries, Cancer, Libra, Capricorn
          </p>
        </div>

        <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🏛️</span>
            <h4 className="text-slate-200 font-semibold">Fixed</h4>
          </div>
          <p className="text-sm text-slate-400">
            <strong>Stabilizers.</strong> They deepen and sustain.
            They ask: "What needs to be preserved?"
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Taurus, Leo, Scorpio, Aquarius
          </p>
        </div>

        <div className="p-4 bg-indigo-900/20 rounded-lg border border-indigo-700/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🌀</span>
            <h4 className="text-indigo-300 font-semibold">Mutable</h4>
          </div>
          <p className="text-sm text-slate-400">
            <strong>Adapters.</strong> They transition and transform.
            They ask: "What needs to change?"
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Gemini, Virgo, Sagittarius, Pisces
          </p>
        </div>
      </div>

      <div className="cusp-modality-note bg-purple-900/20 p-4 rounded-lg border border-purple-700/30">
        <h4 className="text-purple-300 font-medium mb-2">Cusp Modality Blending</h4>
        <p className="text-sm text-slate-400">
          When two signs of different modalities meet at a cusp (e.g., Fixed Taurus → Mutable Gemini),
          the archetype inherits a hybrid movement pattern — stabilizing momentum meeting adaptive flexibility.
        </p>
      </div>
    </div>
  );
};

/**
 * Polarity logic explanation
 */
const PolarityLogicSection: React.FC = () => {
  return (
    <div className="polarity-logic bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
      <h3 className="text-lg font-semibold text-amber-200 mb-4">Polarity Logic</h3>

      <p className="text-slate-400 mb-4">
        Polarity describes the fundamental direction of a sign's energy:
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-amber-900/20 rounded-lg border border-amber-700/30">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">☀️</span>
            <div>
              <h4 className="text-amber-300 font-semibold text-lg">Yang</h4>
              <p className="text-xs text-slate-500">Outward • Active • Expressive</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-2">
            Yang signs project energy into the world. They initiate contact,
            speak first, and lead with action.
          </p>
          <p className="text-xs text-slate-500">
            <strong>Fire & Air signs:</strong> Aries, Gemini, Leo, Libra, Sagittarius, Aquarius
          </p>
        </div>

        <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🌙</span>
            <div>
              <h4 className="text-slate-200 font-semibold text-lg">Yin</h4>
              <p className="text-xs text-slate-500">Inward • Receptive • Reflective</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-2">
            Yin signs draw energy inward for processing. They observe,
            feel first, and lead with response.
          </p>
          <p className="text-xs text-slate-500">
            <strong>Earth & Water signs:</strong> Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces
          </p>
        </div>
      </div>

      <div className="cusp-polarity-note bg-cyan-900/20 p-4 rounded-lg border border-cyan-700/30">
        <h4 className="text-cyan-300 font-medium mb-2">Cusp Polarity Blending</h4>
        <p className="text-sm text-slate-400">
          Most cusps transition between signs of the same polarity (Yang→Yang or Yin→Yin).
          The few that cross polarity boundaries (e.g., Gemini→Cancer: Yang→Yin) create
          archetypes that toggle between expression and reception.
        </p>
      </div>
    </div>
  );
};

/**
 * Element transition patterns
 */
const ElementTransitionSection: React.FC = () => {
  const transitions = [
    { from: 'Fire', to: 'Earth', description: 'Inspiration grounds into form', emoji: '🔥→🌍' },
    { from: 'Earth', to: 'Air', description: 'Matter dissolves into thought', emoji: '🌍→💨' },
    { from: 'Air', to: 'Water', description: 'Thought deepens into feeling', emoji: '💨→🌊' },
    { from: 'Water', to: 'Fire', description: 'Emotion ignites into action', emoji: '🌊→🔥' },
  ];

  return (
    <div className="element-transitions bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
      <h3 className="text-lg font-semibold text-amber-200 mb-4">Elemental Transitions</h3>

      <p className="text-slate-400 mb-4">
        The zodiac wheel follows a specific elemental pattern. Each cusp represents
        a transition between elements, creating distinct psychological dynamics:
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {transitions.map(t => (
          <div
            key={`${t.from}-${t.to}`}
            className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{t.emoji}</span>
              <span className="text-slate-300 font-medium">{t.from} → {t.to}</span>
            </div>
            <p className="text-sm text-slate-400 italic">{t.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export const BehindTheScenesPage: React.FC = () => {
  return (
    <div className="academy-chapter behind-scenes min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="chapter-header text-center mb-12">
          <h1 className="text-4xl font-serif text-amber-200 mb-4">
            Behind the Scenes
          </h1>
          <p className="text-xl text-purple-300 font-light max-w-2xl mx-auto">
            The mathematics, symbolism, and logic beneath the Academy.
          </p>
          <p className="text-slate-400 mt-4">
            Understanding the "why" deepens the "what." Here we reveal the architecture.
          </p>
        </header>

        {/* φ-Curve Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-serif text-amber-200 mb-6 flex items-center gap-3">
            <span className="text-3xl text-purple-400">φ</span>
            The φ-Curve
          </h2>
          <p className="text-slate-400 mb-6">
            The Academy uses a 6-day transition window between signs.
            The blend follows a φ-exponent curve (p ≈ 1.6), modeling how nature transitions gradually.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <PhiCurveVisualization />
            <WhyPhiCurveMatters />
          </div>

          <PhiCurveFormula />
        </section>

        {/* Modality Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-serif text-amber-200 mb-6">
            Modality: How Signs Engage
          </h2>
          <ModalityLogicSection />
        </section>

        {/* Polarity Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-serif text-amber-200 mb-6">
            Polarity: Direction of Energy
          </h2>
          <PolarityLogicSection />
        </section>

        {/* Element Transitions */}
        <section className="mb-12">
          <h2 className="text-2xl font-serif text-amber-200 mb-6">
            Elemental Dynamics
          </h2>
          <ElementTransitionSection />
        </section>

        {/* Full Modality/Polarity Reference */}
        <section className="mb-12">
          <h2 className="text-2xl font-serif text-amber-200 mb-6">
            Complete Reference
          </h2>
          <ModalityPolaritySection />
        </section>

        {/* Summary */}
        <section className="chapter-summary p-6 bg-slate-800/30 rounded-xl border border-slate-700/50">
          <h2 className="text-2xl font-serif text-amber-200 mb-4">Key Takeaways</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-400">
            <div>
              <h3 className="text-purple-300 font-medium mb-2">The φ-Curve</h3>
              <ul className="space-y-1">
                <li>• 6-day transition window</li>
                <li>• Golden ratio exponent (φ ≈ 1.6)</li>
                <li>• Natural, non-linear blending</li>
                <li>• Creates 72 unique cusp archetypes</li>
              </ul>
            </div>
            <div>
              <h3 className="text-purple-300 font-medium mb-2">Modality & Polarity</h3>
              <ul className="space-y-1">
                <li>• 3 modalities: Cardinal, Fixed, Mutable</li>
                <li>• 2 polarities: Yang (out), Yin (in)</li>
                <li>• Cusp blending creates hybrid patterns</li>
                <li>• Element transitions shape psychological dynamics</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BehindTheScenesPage;
