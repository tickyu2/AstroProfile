/**
 * NUMBERS TAB
 *
 * Deep dive into each of the 4 core numbers:
 * - Life Path - Expandable panel with full interpretation
 * - Destiny - Expandable panel with full interpretation
 * - Soul Urge - Expandable panel with full interpretation
 * - Personality - Expandable panel with full interpretation
 *
 * Each panel shows:
 * - Core Essence, Life Mission
 * - Strengths, Challenges
 * - Career Paths, Relationship Style
 * - Shadow Side, Growth Path
 */

import React, { useState } from 'react';
import {
  lifePathInterpretations,
  soulUrgeInterpretations,
  personalityInterpretations
} from '../../data/numerologyInterpretations';

// Expansion Panel Component
function ExpansionPanel({ title, subtitle, icon, color, expanded, onToggle, children }) {
  return (
    <div className={`bg-gradient-to-r ${color} rounded-2xl p-0.5 mb-4`}>
      <div className="bg-slate-900 rounded-2xl overflow-hidden">
        {/* Header - Always visible */}
        <button
          onClick={onToggle}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">{icon}</span>
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-sm text-slate-400">{subtitle}</p>
            </div>
          </div>
          <svg
            className={`w-6 h-6 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Content - Expandable */}
        {expanded && (
          <div className="px-6 pb-6 border-t border-slate-700/50">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

// Section Component for organizing content
function Section({ title, icon, children, className = "" }) {
  return (
    <div className={`mt-6 ${className}`}>
      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        <span>{title}</span>
      </h4>
      {children}
    </div>
  );
}

// Life Path / Destiny Interpretation Component
function FullNumberInterpretation({ data, type }) {
  if (!data) return null;

  return (
    <div className="space-y-1">
      {/* Core Essence */}
      <Section title="Core Essence" icon="💫">
        <p className="text-slate-300 leading-relaxed">{data.coreEssence}</p>
      </Section>

      {/* Life Mission */}
      <Section title="Life Mission" icon="🎯">
        <p className="text-slate-300 leading-relaxed">{data.lifeMission}</p>
      </Section>

      {/* Strengths & Challenges Grid */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* Strengths */}
        <Section title="Strengths" icon="💪" className="mt-0">
          <ul className="space-y-2">
            {data.strengths?.map((strength, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Challenges */}
        <Section title="Challenges" icon="⚡" className="mt-0">
          <ul className="space-y-2">
            {data.challenges?.map((challenge, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-amber-400 mt-0.5">!</span>
                <span>{challenge}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Career Paths */}
      <Section title="Career Paths" icon="💼">
        <div className="flex flex-wrap gap-2">
          {data.careerPaths?.map((career, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm"
            >
              {career}
            </span>
          ))}
        </div>
      </Section>

      {/* Relationship Style */}
      <Section title="Relationship Style" icon="💕">
        <p className="text-slate-300 leading-relaxed">{data.relationshipStyle}</p>
      </Section>

      {/* Shadow Side */}
      <Section title="Shadow Side" icon="🌑">
        <p className="text-slate-400 leading-relaxed italic">{data.shadowSide}</p>
      </Section>

      {/* Growth Path */}
      <Section title="Growth Path" icon="🌱">
        <p className="text-slate-300 leading-relaxed">{data.growthPath}</p>
      </Section>

      {/* Famous Examples */}
      {data.famousExamples && data.famousExamples.length > 0 && (
        <Section title="Famous Examples" icon="⭐">
          <div className="flex flex-wrap gap-2">
            {data.famousExamples.map((example, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm"
              >
                {example}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Master Number Note */}
      {data.isMasterNumber && (
        <div className="mt-6 p-4 bg-purple-900/30 border border-purple-500/30 rounded-xl">
          <p className="text-purple-300 text-sm">
            <strong>Master Number Note:</strong> This is a Master Number ({data.number}) which operates at a higher vibration. When overwhelmed, it may reduce to {data.reducesTo} energy.
          </p>
        </div>
      )}
    </div>
  );
}

// Soul Urge Interpretation Component
function SoulUrgeInterpretation({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-6 pt-4">
      {/* Main Description */}
      <div>
        <p className="text-slate-300 leading-relaxed text-lg">{data.description}</p>
      </div>

      {/* Desires, Needs, Drive, Motivation Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h5 className="text-pink-400 font-semibold mb-2">Deepest Desires</h5>
          <p className="text-slate-300 text-sm">{data.desires}</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4">
          <h5 className="text-pink-400 font-semibold mb-2">What You Need</h5>
          <p className="text-slate-300 text-sm">{data.needs}</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4">
          <h5 className="text-pink-400 font-semibold mb-2">Inner Drive</h5>
          <p className="text-slate-300 text-sm">{data.innerDrive}</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4">
          <h5 className="text-pink-400 font-semibold mb-2">Core Motivation</h5>
          <p className="text-slate-300 text-sm">{data.motivation}</p>
        </div>
      </div>
    </div>
  );
}

// Personality Interpretation Component
function PersonalityInterpretation({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-6 pt-4">
      {/* Main Description */}
      <div>
        <p className="text-slate-300 leading-relaxed text-lg">{data.description}</p>
      </div>

      {/* Appearance, Projects, First Impression Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h5 className="text-amber-400 font-semibold mb-2">How You Appear</h5>
          <p className="text-slate-300 text-sm">{data.appears}</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4">
          <h5 className="text-amber-400 font-semibold mb-2">What You Project</h5>
          <p className="text-slate-300 text-sm">{data.projects}</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4">
          <h5 className="text-amber-400 font-semibold mb-2">First Impression</h5>
          <p className="text-slate-300 text-sm">{data.firstImpression}</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4">
          <h5 className="text-amber-400 font-semibold mb-2">Others See You As</h5>
          <p className="text-slate-300 text-sm">{data.othersSee}</p>
        </div>
      </div>
    </div>
  );
}

// Main NumbersTab Component
function NumbersTab({ numerologyData }) {
  const [expanded, setExpanded] = useState({
    lifePath: true,
    destiny: false,
    soulUrge: false,
    personality: false
  });

  if (!numerologyData) return null;

  const { lifePath, destiny, soulUrge, personality } = numerologyData;

  // Get interpretations
  const lifePathInfo = lifePathInterpretations[lifePath] || lifePathInterpretations[7];
  const destinyInfo = lifePathInterpretations[destiny] || lifePathInterpretations[7];
  const soulUrgeInfo = soulUrgeInterpretations[soulUrge] || soulUrgeInterpretations[2];
  const personalityInfo = personalityInterpretations[personality] || personalityInterpretations[5];

  const togglePanel = (panel) => {
    setExpanded(prev => ({
      ...prev,
      [panel]: !prev[panel]
    }));
  };

  return (
    <div className="space-y-2">
      {/* Instructions */}
      <div className="text-center mb-6">
        <p className="text-slate-400">
          Click each panel to expand and explore the full interpretation
        </p>
      </div>

      {/* Life Path Panel */}
      <ExpansionPanel
        title={`Life Path ${lifePath}: ${lifePathInfo.title}`}
        subtitle="Your life journey and core lessons"
        icon={lifePathInfo.icon}
        color="from-indigo-500 to-purple-500"
        expanded={expanded.lifePath}
        onToggle={() => togglePanel('lifePath')}
      >
        <FullNumberInterpretation data={lifePathInfo} type="lifePath" />
      </ExpansionPanel>

      {/* Destiny Panel */}
      <ExpansionPanel
        title={`Destiny ${destiny}: ${destinyInfo.title}`}
        subtitle="Your life purpose and ultimate calling"
        icon={destinyInfo.icon}
        color="from-purple-500 to-pink-500"
        expanded={expanded.destiny}
        onToggle={() => togglePanel('destiny')}
      >
        <div className="pt-4">
          {lifePath === destiny ? (
            <div className="mb-6 p-4 bg-amber-900/30 border border-amber-500/30 rounded-xl">
              <p className="text-amber-300 text-sm">
                <strong>Path-Purpose Alignment:</strong> Your Life Path and Destiny are the same number ({lifePath}). This creates powerful focus and reinforcement. Your journey (Life Path) and destination (Destiny) are aligned - embrace this {lifePathInfo.title.toLowerCase()} energy fully.
              </p>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-indigo-900/30 border border-indigo-500/30 rounded-xl">
              <p className="text-indigo-300 text-sm">
                <strong>Dynamic Tension:</strong> Your Life Path {lifePath} ({lifePathInfo.title}) and Destiny {destiny} ({destinyInfo.title}) create dynamic growth. You walk the path of the {lifePathInfo.title.toLowerCase()} to become the {destinyInfo.title.toLowerCase()}.
              </p>
            </div>
          )}
          <FullNumberInterpretation data={destinyInfo} type="destiny" />
        </div>
      </ExpansionPanel>

      {/* Soul Urge Panel */}
      <ExpansionPanel
        title={`Soul Urge ${soulUrge}: ${soulUrgeInfo.title}`}
        subtitle="Your deepest desires and inner motivations"
        icon="💙"
        color="from-pink-500 to-rose-500"
        expanded={expanded.soulUrge}
        onToggle={() => togglePanel('soulUrge')}
      >
        <SoulUrgeInterpretation data={soulUrgeInfo} />
      </ExpansionPanel>

      {/* Personality Panel */}
      <ExpansionPanel
        title={`Personality ${personality}: ${personalityInfo.title}`}
        subtitle="How others perceive you"
        icon="✨"
        color="from-amber-500 to-orange-500"
        expanded={expanded.personality}
        onToggle={() => togglePanel('personality')}
      >
        <PersonalityInterpretation data={personalityInfo} />
      </ExpansionPanel>

      {/* Expand/Collapse All */}
      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={() => setExpanded({ lifePath: true, destiny: true, soulUrge: true, personality: true })}
          className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 text-sm"
        >
          Expand All
        </button>
        <button
          onClick={() => setExpanded({ lifePath: false, destiny: false, soulUrge: false, personality: false })}
          className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 text-sm"
        >
          Collapse All
        </button>
      </div>
    </div>
  );
}

export default NumbersTab;
