/**
 * PureSignChapterPage
 * Academy chapter displaying all 12 Pure Sign Archetypes
 * The mythic temples of the zodiac — unblended essences
 */

import React, { useState } from 'react';
import { PURE_SIGN_ARCHETYPES } from '../../data/pureSignArchetypes';
import { PureSignPanel, PureSignCard } from '../../components/academy/PureSignPanel';
import { PureSignNavigation, ZodiacWheelMini } from '../../components/academy/PureSignNavigation';
import { WhyPureSignMatters } from '../../components/academy/WhyItMatters';
import { ModalitySection, PolaritySection } from '../../components/academy/ModalityPolaritySection';

// ============================================================================
// Types
// ============================================================================

interface StoryPanelProps {
  story: {
    mythicOrigin: string;
    psychologicalMetaphor: string;
    modernExpression: string;
  };
  signName: string;
}

// ============================================================================
// Sub-components
// ============================================================================

/**
 * Story panel displaying the three-layer micro-story
 */
const StoryPanel: React.FC<StoryPanelProps> = ({ story, signName }) => {
  return (
    <div className="story-panel bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl border border-indigo-700/30 p-5 space-y-4">
      <h3 className="text-lg font-semibold text-indigo-300">
        The Story of {signName}
      </h3>

      <div className="story-layer">
        <h4 className="text-sm font-medium text-amber-400 uppercase tracking-wide mb-1">
          Mythic Origin
        </h4>
        <p className="text-slate-300 italic leading-relaxed">
          "{story.mythicOrigin}"
        </p>
      </div>

      <div className="story-layer">
        <h4 className="text-sm font-medium text-purple-400 uppercase tracking-wide mb-1">
          Psychological Metaphor
        </h4>
        <p className="text-slate-300 italic leading-relaxed">
          "{story.psychologicalMetaphor}"
        </p>
      </div>

      <div className="story-layer">
        <h4 className="text-sm font-medium text-cyan-400 uppercase tracking-wide mb-1">
          Modern Expression
        </h4>
        <p className="text-slate-300 leading-relaxed">
          {story.modernExpression}
        </p>
      </div>
    </div>
  );
};

/**
 * Chapter header with introduction
 */
const ChapterHeader: React.FC = () => {
  return (
    <header className="chapter-header text-center mb-12">
      <h1 className="text-4xl font-serif text-amber-200 mb-4">
        Pure Sign Archetypes
      </h1>
      <p className="text-xl text-purple-300 font-light max-w-2xl mx-auto">
        The twelve temples of the zodiac — the unblended essences that anchor all cusp transitions.
      </p>
      <p className="text-slate-400 mt-4 max-w-3xl mx-auto">
        Before we can understand the 6-day cusp blends, we must first know the pure archetypes.
        These are the mythic cores, the psychological pillars, the elemental truths that never change.
      </p>
    </header>
  );
};

/**
 * Element filter bar
 */
const ElementFilter: React.FC<{
  selected: string | null;
  onSelect: (element: string | null) => void;
}> = ({ selected, onSelect }) => {
  const elements = ['Fire', 'Earth', 'Air', 'Water'];
  const elementStyles: Record<string, string> = {
    Fire: 'bg-red-900/30 border-red-500 text-red-400',
    Earth: 'bg-emerald-900/30 border-emerald-500 text-emerald-400',
    Air: 'bg-cyan-900/30 border-cyan-500 text-cyan-400',
    Water: 'bg-purple-900/30 border-purple-500 text-purple-400'
  };

  return (
    <div className="element-filter flex justify-center gap-3 mb-8">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full border transition-all ${
          selected === null
            ? 'bg-amber-500/30 border-amber-500 text-amber-300'
            : 'bg-slate-800/50 border-slate-600 text-slate-400 hover:border-slate-500'
        }`}
      >
        All Signs
      </button>
      {elements.map(element => (
        <button
          key={element}
          onClick={() => onSelect(element)}
          className={`px-4 py-2 rounded-full border transition-all ${
            selected === element
              ? elementStyles[element]
              : 'bg-slate-800/50 border-slate-600 text-slate-400 hover:border-slate-500'
          }`}
        >
          {element}
        </button>
      ))}
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export const PureSignChapterPage: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [elementFilter, setElementFilter] = useState<string | null>(null);

  // Filter signs by element
  const filteredSigns = elementFilter
    ? PURE_SIGN_ARCHETYPES.filter(s => s.element === elementFilter)
    : PURE_SIGN_ARCHETYPES;

  // Get the currently selected sign archetype
  const currentArchetype = selectedSign
    ? PURE_SIGN_ARCHETYPES.find(s => s.sign === selectedSign)
    : null;

  return (
    <div className="academy-chapter pure-sign-chapter min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <ChapterHeader />

        {/* Quick Navigation Wheel */}
        <div className="mb-8">
          <p className="text-center text-slate-500 text-sm mb-3">Select a sign to explore</p>
          <ZodiacWheelMini
            currentSign={selectedSign || undefined}
            onSelectSign={setSelectedSign}
          />
        </div>

        {/* Element Filter */}
        <ElementFilter selected={elementFilter} onSelect={setElementFilter} />

        {/* Detail View (when sign selected) */}
        {currentArchetype && (
          <div className="selected-sign-detail mb-12 space-y-6">
            <PureSignPanel sign={currentArchetype} showFullProfile={true} />

            <div className="grid md:grid-cols-2 gap-6">
              <StoryPanel story={currentArchetype.story} signName={currentArchetype.sign} />
              <WhyPureSignMatters signName={currentArchetype.sign} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <ModalitySection highlightModality={currentArchetype.modality} />
              <PolaritySection highlightPolarity={currentArchetype.polarity} />
            </div>

            <PureSignNavigation
              sign={currentArchetype.sign}
              onSelectSign={setSelectedSign}
            />
          </div>
        )}

        {/* Sign Grid (when no sign selected) */}
        {!selectedSign && (
          <div className="sign-grid grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSigns.map(sign => (
              <PureSignCard
                key={sign.sign}
                sign={sign}
                onClick={() => setSelectedSign(sign.sign)}
              />
            ))}
          </div>
        )}

        {/* Back to Grid button */}
        {selectedSign && (
          <div className="text-center mt-8">
            <button
              onClick={() => setSelectedSign(null)}
              className="px-6 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-300 hover:border-purple-500/50 transition-colors"
            >
              ← Back to All Signs
            </button>
          </div>
        )}

        {/* Chapter Summary */}
        <section className="chapter-summary mt-16 p-6 bg-slate-800/30 rounded-xl border border-slate-700/50">
          <h2 className="text-2xl font-serif text-amber-200 mb-4">Chapter Summary</h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-400">
            <div>
              <h3 className="text-purple-300 font-medium mb-2">What You've Learned</h3>
              <ul className="space-y-1">
                <li>• Each sign has a pure, unblended essence</li>
                <li>• Elements shape the sign's nature (Fire, Earth, Air, Water)</li>
                <li>• Modalities shape how the sign engages (Cardinal, Fixed, Mutable)</li>
                <li>• Polarity describes energy direction (Yang/Yin)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-purple-300 font-medium mb-2">Key Insight</h3>
              <p>
                Pure signs are the anchors. When we understand them, we can understand
                how they blend during cusp transitions. The 6-day φ-curve creates 72
                unique archetypes by mixing these 12 essences.
              </p>
            </div>
            <div>
              <h3 className="text-purple-300 font-medium mb-2">Next Steps</h3>
              <p>
                Explore the Cusp Archetypes chapter to see how these pure essences
                blend during the 6-day transition windows, creating the nuanced
                personalities of those born "on the cusp."
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PureSignChapterPage;
