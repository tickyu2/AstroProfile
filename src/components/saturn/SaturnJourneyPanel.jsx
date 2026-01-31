/**
 * Saturn Journey Panel Component
 *
 * A complete UI for the Saturn Journey module - the psychological backbone
 * that transforms astrology into adulthood.
 *
 * Displays:
 * - Saturn Wound (origin story)
 * - Defense Pattern (adaptive intelligence)
 * - Saturn Tests (timeline of development)
 * - Saturn Return (initiation)
 * - Saturn Gift (earned mastery)
 * - Luna Integration (companion guidance)
 *
 * Uses Cathedral visual style with time/stone/mountain motifs.
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState, useMemo } from 'react';
import { generateSaturnJourney, getSaturnCyclePosition, isSaturnReturnActive } from '../../utils/saturnJourneyEngine';

// ═══════════════════════════════════════════════════════════════════════════
// SECTION STYLING - Saturn uses stone/time aesthetic
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_STYLES = {
  wound: {
    bg: 'from-red-900/30 to-slate-900/30',
    border: 'border-red-500/30',
    iconColor: 'text-red-300',
    icon: '🩸'
  },
  defenses: {
    bg: 'from-amber-900/30 to-slate-900/30',
    border: 'border-amber-500/30',
    iconColor: 'text-amber-300',
    icon: '🛡️'
  },
  timeline: {
    bg: 'from-slate-800/50 to-slate-900/50',
    border: 'border-slate-500/30',
    iconColor: 'text-slate-300',
    icon: '⏳'
  },
  return: {
    bg: 'from-purple-900/40 to-indigo-900/40',
    border: 'border-purple-500/40',
    iconColor: 'text-purple-300',
    icon: '⟡'
  },
  gift: {
    bg: 'from-emerald-900/30 to-teal-900/30',
    border: 'border-emerald-500/30',
    iconColor: 'text-emerald-300',
    icon: '♄'
  },
  luna: {
    bg: 'from-cyan-900/30 to-blue-900/30',
    border: 'border-cyan-500/30',
    iconColor: 'text-cyan-300',
    icon: '☽'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function SaturnJourneyPanel({ westernData, birthDate, aspects = [] }) {
  const [expandedSection, setExpandedSection] = useState(null);
  const [showLunaGuidance, setShowLunaGuidance] = useState(false);

  // Generate Saturn Journey
  const saturnJourney = useMemo(() => {
    if (!westernData?.saturn?.sign && !westernData?.Saturn?.sign) return null;
    try {
      return generateSaturnJourney(westernData, { birthDate, aspects });
    } catch (e) {
      console.error('Error generating Saturn Journey:', e);
      return null;
    }
  }, [westernData, birthDate, aspects]);

  // Get cycle position
  const cyclePosition = useMemo(() => {
    return getSaturnCyclePosition(birthDate);
  }, [birthDate]);

  // Check Saturn Return status
  const saturnReturnStatus = useMemo(() => {
    return isSaturnReturnActive(birthDate);
  }, [birthDate]);

  if (!saturnJourney) {
    return (
      <div className="p-6 bg-slate-800/30 rounded-xl border border-slate-700/40">
        <p className="text-slate-400 text-center">
          Saturn data not available. Please ensure Western astrology data is loaded.
        </p>
      </div>
    );
  }

  const { saturn, wound, defenses, phases, currentPhase, turningPoint, gift, narrative, lunaIntegration } = saturnJourney;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-4xl">♄</span>
          <h2 className="text-2xl font-light text-white">
            The Saturn Journey
          </h2>
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto">
          From fear to earned authority — the psychological backbone of your chart
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
          <span className="text-xs px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-600/40 text-slate-300">
            Saturn in {saturn.sign}
          </span>
          {saturn.house && (
            <span className="text-xs px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-600/40 text-slate-300">
              {saturn.house}th House
            </span>
          )}
          {saturn.isRetrograde && (
            <span className="text-xs px-3 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300">
              ℞ Retrograde
            </span>
          )}
          {saturnReturnStatus.isActive && (
            <span className="text-xs px-3 py-1.5 rounded-full bg-red-900/40 border border-red-500/30 text-red-300 animate-pulse">
              🔥 {saturnReturnStatus.which === 'first' ? 'First' : 'Second'} Saturn Return Active
            </span>
          )}
        </div>
      </div>

      {/* Saturn Cycle Visualization */}
      {cyclePosition && (
        <SaturnCycleVisualization
          position={cyclePosition}
          currentPhase={currentPhase}
          saturnReturnStatus={saturnReturnStatus}
        />
      )}

      {/* Headline Insight */}
      <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 border border-slate-600/30 rounded-xl p-6 text-center">
        <p className="text-lg text-white font-light italic">
          "{narrative.headline}"
        </p>
      </div>

      {/* Opening Narrative */}
      <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/40">
        <p className="text-slate-300 leading-relaxed whitespace-pre-line">
          {narrative.opening}
        </p>
      </div>

      {/* Main Sections */}
      <div className="space-y-4">
        {/* Saturn Wound */}
        <SaturnSection
          title="The Saturn Wound"
          subtitle="Your origin story"
          style={SECTION_STYLES.wound}
          content={narrative.wound}
          expanded={expandedSection === 'wound'}
          onToggle={() => setExpandedSection(expandedSection === 'wound' ? null : 'wound')}
        />

        {/* Defense Pattern */}
        <SaturnSection
          title="Your Defense Pattern"
          subtitle="Adaptive intelligence"
          style={SECTION_STYLES.defenses}
          content={narrative.defenses}
          expanded={expandedSection === 'defenses'}
          onToggle={() => setExpandedSection(expandedSection === 'defenses' ? null : 'defenses')}
        />

        {/* Saturn Tests / Timeline */}
        <SaturnSection
          title="The Saturn Tests"
          subtitle="Your developmental timeline"
          style={SECTION_STYLES.timeline}
          content={narrative.timeline}
          expanded={expandedSection === 'timeline'}
          onToggle={() => setExpandedSection(expandedSection === 'timeline' ? null : 'timeline')}
        >
          {/* Visual Timeline */}
          {expandedSection === 'timeline' && (
            <SaturnTimeline phases={phases} currentPhase={currentPhase} />
          )}
        </SaturnSection>

        {/* Saturn Return */}
        <SaturnSection
          title="The Saturn Return"
          subtitle="Your initiation"
          style={SECTION_STYLES.return}
          content={narrative.return}
          expanded={expandedSection === 'return'}
          onToggle={() => setExpandedSection(expandedSection === 'return' ? null : 'return')}
          highlight={saturnReturnStatus.isActive}
        />

        {/* Saturn Gift */}
        <SaturnSection
          title="The Gift of Saturn"
          subtitle="Earned authority"
          style={SECTION_STYLES.gift}
          content={narrative.gift}
          expanded={expandedSection === 'gift'}
          onToggle={() => setExpandedSection(expandedSection === 'gift' ? null : 'gift')}
        />
      </div>

      {/* Current Phase Focus */}
      {currentPhase && (
        <CurrentPhasePanel currentPhase={currentPhase} />
      )}

      {/* Aspect Modifiers */}
      {narrative.aspects && (
        <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/40">
          <h3 className="text-slate-300 text-sm uppercase tracking-wider mb-4">
            Saturn's Planetary Conversations
          </h3>
          <p className="text-slate-400 leading-relaxed whitespace-pre-line text-sm">
            {narrative.aspects}
          </p>
        </div>
      )}

      {/* Luna Integration Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowLunaGuidance(!showLunaGuidance)}
          className="px-6 py-2 bg-cyan-900/30 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-900/50 transition-colors"
        >
          {showLunaGuidance ? 'Hide' : 'Show'} Luna Integration Guidance
        </button>
      </div>

      {/* Luna Integration Panel */}
      {showLunaGuidance && lunaIntegration && (
        <LunaIntegrationPanel lunaIntegration={lunaIntegration} lunaGuidance={saturnJourney.lunaGuidance} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Saturn Cycle Visualization
 */
function SaturnCycleVisualization({ position, currentPhase, saturnReturnStatus }) {
  const circumference = 2 * Math.PI * 45;
  const progress = position.position * circumference;

  return (
    <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/40">
      <div className="flex items-center justify-around flex-wrap gap-6">
        {/* Circular Progress */}
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="45"
              fill="none"
              stroke="#374151"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl">♄</span>
            <span className="text-xs text-slate-400">
              {position.degreesComplete.toFixed(0)}°
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between gap-8">
            <span className="text-slate-500">Cycle:</span>
            <span className="text-white">{position.cycleNumber}{getOrdinalSuffix(position.cycleNumber)}</span>
          </div>
          <div className="flex justify-between gap-8">
            <span className="text-slate-500">Years in cycle:</span>
            <span className="text-white">{position.yearsIntoCurrentCycle.toFixed(1)}</span>
          </div>
          <div className="flex justify-between gap-8">
            <span className="text-slate-500">Current phase:</span>
            <span className="text-purple-300">{currentPhase?.phase?.label || 'Between phases'}</span>
          </div>
          {saturnReturnStatus.approaching && (
            <div className="text-amber-300 text-xs mt-2">
              ⚠️ Approaching {saturnReturnStatus.approaching} Saturn Return
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Expandable Section Component
 */
function SaturnSection({ title, subtitle, style, content, expanded, onToggle, highlight, children }) {
  return (
    <div
      className={`
        bg-gradient-to-r ${style.bg}
        border ${style.border}
        rounded-xl overflow-hidden
        transition-all duration-300
        ${highlight ? 'ring-2 ring-purple-500/50' : ''}
      `}
    >
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`text-2xl ${style.iconColor}`}>{style.icon}</span>
          <div>
            <h3 className="text-white font-medium">{title}</h3>
            <p className="text-slate-500 text-sm">{subtitle}</p>
          </div>
        </div>
        <span className={`text-slate-400 transform transition-transform ${expanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4">
          <div className="border-t border-slate-700/50 pt-4">
            <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm">
              {content}
            </p>
          </div>
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Saturn Timeline Component
 */
function SaturnTimeline({ phases, currentPhase }) {
  return (
    <div className="mt-4 space-y-3">
      {phases.map((phase, idx) => {
        const isCurrent = currentPhase?.phase?.key === phase.key;
        const isPast = currentPhase && phases.indexOf(phases.find(p => p.key === currentPhase.phase.key)) > idx;

        return (
          <div
            key={phase.key}
            className={`
              flex items-start gap-4 p-3 rounded-lg
              ${isCurrent ? 'bg-purple-900/40 border border-purple-500/30' : 'bg-slate-800/30'}
              ${isPast ? 'opacity-60' : ''}
            `}
          >
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
              ${isCurrent ? 'bg-purple-600 text-white' : isPast ? 'bg-slate-700 text-slate-400' : 'bg-slate-800 text-slate-500'}
            `}>
              {phase.exactAgeYears.toFixed(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className={`font-medium ${isCurrent ? 'text-purple-300' : 'text-white'}`}>
                  {phase.label}
                </h4>
                {isCurrent && (
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-500/30 text-purple-200">
                    Current
                  </span>
                )}
                {phase.isInitiation && (
                  <span className="text-xs px-2 py-0.5 rounded bg-red-500/30 text-red-200">
                    Initiation
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-sm mt-1">"{phase.coreQuestion}"</p>
              <p className="text-slate-500 text-xs mt-1">{phase.psychologicalTask}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Current Phase Panel
 */
function CurrentPhasePanel({ currentPhase }) {
  const { phase, currentAgeYears, withinWindow } = currentPhase;

  return (
    <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📍</span>
        <h3 className="text-purple-300 text-sm uppercase tracking-wider">
          Your Current Saturn Weather
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-white text-lg">{phase.label}</h4>
          <p className="text-slate-400 text-sm">
            Age {currentAgeYears.toFixed(1)} • {withinWindow ? 'Directly in this window' : 'Near this threshold'}
          </p>
        </div>

        <div className="bg-slate-900/40 rounded-lg p-4">
          <p className="text-purple-200 italic text-lg mb-2">"{phase.coreQuestion}"</p>
          <p className="text-slate-400 text-sm">{phase.psychologicalTask}</p>
        </div>

        {phase.lifeThemes && (
          <div>
            <h5 className="text-slate-500 text-xs uppercase mb-2">Common Life Themes</h5>
            <div className="flex flex-wrap gap-2">
              {phase.lifeThemes.map((theme, idx) => (
                <span key={idx} className="text-xs px-2 py-1 rounded bg-slate-800/50 text-slate-300">
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}

        {phase.typicalChallenges && (
          <div>
            <h5 className="text-slate-500 text-xs uppercase mb-2">Typical Challenges</h5>
            <div className="flex flex-wrap gap-2">
              {phase.typicalChallenges.map((challenge, idx) => (
                <span key={idx} className="text-xs px-2 py-1 rounded bg-amber-900/30 text-amber-300">
                  {challenge}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Luna Integration Panel
 */
function LunaIntegrationPanel({ lunaIntegration, lunaGuidance }) {
  return (
    <div className={`bg-gradient-to-r ${SECTION_STYLES.luna.bg} border ${SECTION_STYLES.luna.border} rounded-xl p-6`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">☽</span>
        <h3 className="text-cyan-300 text-sm uppercase tracking-wider">
          Luna Integration Guide
        </h3>
      </div>

      <p className="text-slate-400 text-sm mb-6">
        How Luna (AI companion) can support someone with this Saturn placement
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Saturn Triggers */}
        <div className="space-y-3">
          <h4 className="text-slate-300 text-sm font-medium">⚡ Saturn Triggers</h4>
          <ul className="space-y-2">
            {lunaIntegration.saturnTriggers?.map((trigger, idx) => (
              <li key={idx} className="text-slate-400 text-sm flex items-start gap-2">
                <span className="text-red-400">•</span>
                {trigger}
              </li>
            ))}
          </ul>
        </div>

        {/* Support Strategies */}
        <div className="space-y-3">
          <h4 className="text-slate-300 text-sm font-medium">💚 Support Strategies</h4>
          <ul className="space-y-2">
            {lunaIntegration.supportStrategies?.map((strategy, idx) => (
              <li key={idx} className="text-slate-400 text-sm flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                {strategy}
              </li>
            ))}
          </ul>
        </div>

        {/* Language to Use */}
        <div className="space-y-3">
          <h4 className="text-slate-300 text-sm font-medium">✓ Language to Use</h4>
          <p className="text-emerald-300 text-sm italic">
            {lunaIntegration.languageToUse}
          </p>
        </div>

        {/* Language to Avoid */}
        <div className="space-y-3">
          <h4 className="text-slate-300 text-sm font-medium">✗ Language to Avoid</h4>
          <p className="text-red-300 text-sm italic">
            {lunaIntegration.languageToAvoid}
          </p>
        </div>
      </div>

      {/* Direct Guidance */}
      {lunaGuidance && lunaGuidance.length > 0 && (
        <div className="mt-6 pt-6 border-t border-cyan-500/20">
          <h4 className="text-slate-300 text-sm font-medium mb-3">Key Guidance Points</h4>
          <ul className="space-y-2">
            {lunaGuidance.map((guidance, idx) => (
              <li key={idx} className="text-cyan-200 text-sm flex items-start gap-2">
                <span className="text-cyan-400">{idx + 1}.</span>
                {guidance}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Current Phase Support */}
      {lunaIntegration.currentPhaseSupport && (
        <div className="mt-6 pt-6 border-t border-cyan-500/20">
          <h4 className="text-slate-300 text-sm font-medium mb-3">Current Phase Support</h4>
          <div className="bg-slate-900/40 rounded-lg p-4 space-y-2">
            <p className="text-slate-300 text-sm">{lunaIntegration.currentPhaseSupport.acknowledgment}</p>
            <p className="text-slate-400 text-sm">{lunaIntegration.currentPhaseSupport.normalizing}</p>
            <p className="text-cyan-300 text-sm italic">{lunaIntegration.currentPhaseSupport.patience}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function getOrdinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export { SaturnCycleVisualization, SaturnTimeline, CurrentPhasePanel, LunaIntegrationPanel };
