/**
 * BaZi Synastry Panel
 * Displays pillar-to-pillar compatibility analysis using Chinese metaphysics
 *
 * Features:
 * - Overall compatibility score with visual indicator
 * - Synastry matrix visualization
 * - Relationship axes radar chart
 * - Strengths and challenges breakdown
 * - Person comparison with Day Master info
 */

import React, { useState, useMemo } from 'react';
import {
  getCompatibilityLevel,
  getInteractionDisplay,
  getElementDisplay,
  getPillarMeaning
} from '../../services/baziCompatibilityService';
import SynastryMatrixGrid from './SynastryMatrixGrid';
import RelationshipAxesChart from './RelationshipAxesChart';

// Helper to get first name
const getFirstName = (fullName) => {
  if (!fullName) return 'Person';
  return fullName.split(' ')[0] || fullName;
};

export default function BaZiSynastryPanel({
  compatibility,
  personAName = 'Person A',
  personBName = 'Person B',
  showMatrix = true,
  showAxes = true,
  showInsights = true
}) {
  const [expandedSection, setExpandedSection] = useState(null);

  // Extract compatibility data
  const {
    compatibility: compData,
    matrix,
    insights,
    persons,
    metadata
  } = compatibility || {};

  // Get display info for overall score
  const scoreDisplay = useMemo(() => {
    return getCompatibilityLevel(compData?.overall_score || 0);
  }, [compData?.overall_score]);

  // Get first names
  const firstNameA = getFirstName(personAName);
  const firstNameB = getFirstName(personBName);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!compatibility) {
    return (
      <div className="bg-slate-900/50 rounded-xl p-6 text-center">
        <p className="text-white/60">No compatibility data available</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 rounded-xl p-6 space-y-6">
      {/* Header with Overall Score */}
      <div
        className={`bg-gradient-to-r ${scoreDisplay.bgGradient} rounded-xl p-6 border-2`}
        style={{ borderColor: scoreDisplay.color }}
      >
        <div className="text-center mb-4">
          <div
            className="text-5xl font-bold mb-2"
            style={{ color: scoreDisplay.color }}
          >
            {Math.round((compData?.overall_score || 0) * 100)}%
          </div>
          <div className="text-xl font-bold text-white mb-1">
            {scoreDisplay.emoji} {scoreDisplay.level}
          </div>
          <div className="text-sm text-white/70">
            {scoreDisplay.description}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {compData?.positive_interactions || 0}
            </div>
            <div className="text-xs text-white/60">Harmonies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {compData?.total_interaction_score || 0}
            </div>
            <div className="text-xs text-white/60">Net Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {compData?.negative_interactions || 0}
            </div>
            <div className="text-xs text-white/60">Tensions</div>
          </div>
        </div>

        {/* Overall Pattern */}
        {compData?.overall_pattern && (
          <div className="mt-4 text-center text-sm text-white/80 italic">
            "{compData.overall_pattern}"
          </div>
        )}
      </div>

      {/* Person Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Person A */}
        <PersonCard
          name={firstNameA}
          person={persons?.person_a}
          color="blue"
        />

        {/* Person B */}
        <PersonCard
          name={firstNameB}
          person={persons?.person_b}
          color="pink"
        />
      </div>

      {/* Synastry Matrix */}
      {showMatrix && matrix && (
        <CollapsibleSection
          title="Synastry Matrix"
          subtitle="5x5 Pillar-to-Pillar Analysis"
          isExpanded={expandedSection === 'matrix'}
          onToggle={() => toggleSection('matrix')}
          color="#8b5cf6"
          defaultExpanded
        >
          <SynastryMatrixGrid
            matrix={matrix}
            personAName={firstNameA}
            personBName={firstNameB}
          />
        </CollapsibleSection>
      )}

      {/* Relationship Axes */}
      {showAxes && compData?.axes && (
        <CollapsibleSection
          title="Relationship Axes"
          subtitle="6-Dimensional Compatibility"
          isExpanded={expandedSection === 'axes'}
          onToggle={() => toggleSection('axes')}
          color="#3b82f6"
        >
          <RelationshipAxesChart axes={compData.axes} />
        </CollapsibleSection>
      )}

      {/* Strengths */}
      {showInsights && compData?.strengths?.length > 0 && (
        <CollapsibleSection
          title="Relationship Strengths"
          subtitle={`${compData.strengths.length} key harmonies found`}
          isExpanded={expandedSection === 'strengths'}
          onToggle={() => toggleSection('strengths')}
          color="#10b981"
        >
          <div className="space-y-3">
            {compData.strengths.map((strength, idx) => {
              const display = getInteractionDisplay(strength.type);
              return (
                <div
                  key={idx}
                  className={`${display.bgColor} rounded-lg p-4 border border-white/10`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold ${display.textColor}`}>
                      {strength.pillars}
                    </span>
                    <span className={`text-sm ${display.textColor}`}>
                      +{strength.score} pts
                    </span>
                  </div>
                  <div className="text-sm text-white/70">
                    {strength.explanation}
                  </div>
                  <div className="text-xs text-white/50 mt-2">
                    {display.label} ({display.labelCN}) - {display.description}
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleSection>
      )}

      {/* Challenges */}
      {showInsights && compData?.challenges?.length > 0 && (
        <CollapsibleSection
          title="Growth Areas"
          subtitle={`${compData.challenges.length} areas for conscious attention`}
          isExpanded={expandedSection === 'challenges'}
          onToggle={() => toggleSection('challenges')}
          color="#f59e0b"
        >
          <div className="space-y-3">
            {compData.challenges.map((challenge, idx) => {
              const display = getInteractionDisplay(challenge.type);
              return (
                <div
                  key={idx}
                  className={`${display.bgColor} rounded-lg p-4 border border-white/10`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold ${display.textColor}`}>
                      {challenge.pillars}
                    </span>
                    <span className={`text-sm ${display.textColor}`}>
                      {challenge.score} pts
                    </span>
                  </div>
                  <div className="text-sm text-white/70">
                    {challenge.explanation}
                  </div>
                  <div className="text-xs text-white/50 mt-2">
                    {display.label} ({display.labelCN}) - {display.description}
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleSection>
      )}

      {/* Methodology Note */}
      <div className="bg-black/20 rounded-xl p-4 border border-white/10">
        <div className="text-sm text-white/60 leading-relaxed">
          <span className="font-bold text-white/80">Methodology: </span>
          BaZi synastry analyzes the interaction between two people's Four Pillars
          using traditional Chinese metaphysics: Liu He (Six Harmonies), San He
          (Three Harmonies), Chong (Six Clashes), Hai (Six Harms), and Xing (Three
          Punishments). The overall score combines branch interactions with Five
          Element production/control cycles.
        </div>
        {metadata && (
          <div className="text-xs text-white/40 mt-2">
            Engine: {metadata.engine} v{metadata.version} |
            sxtwl: {metadata.sxtwl_used ? 'Active' : 'Fallback'}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Person Card - Shows individual Day Master info
 */
function PersonCard({ name, person, color }) {
  if (!person) return null;

  const dayMaster = person.day_master || {};
  const elements = person.element_distribution || {};
  const elementDisplay = getElementDisplay(dayMaster.element);

  // Sort elements by value
  const sortedElements = Object.entries(elements)
    .filter(([_, val]) => val > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div
      className={`bg-slate-800/50 rounded-xl p-4 border border-${color}-500/30`}
    >
      <h3 className={`text-lg font-bold text-${color}-300 mb-3 text-center`}>
        {name}
      </h3>

      {/* Day Master */}
      <div className="text-center mb-4">
        <div
          className="text-3xl font-bold mb-1"
          style={{ color: elementDisplay.color }}
        >
          {dayMaster.stem || '?'}
        </div>
        <div className="text-sm text-white/70">
          {dayMaster.element} Day Master
        </div>
        {dayMaster.branch && (
          <div className="text-xs text-white/50">
            Branch: {dayMaster.branch}
          </div>
        )}
      </div>

      {/* Element Distribution */}
      {sortedElements.length > 0 && (
        <div>
          <div className="text-xs font-bold text-white/60 mb-2">
            ELEMENT DISTRIBUTION:
          </div>
          <div className="space-y-1">
            {sortedElements.slice(0, 5).map(([element, value]) => {
              const display = getElementDisplay(element);
              const total = Object.values(elements).reduce((a, b) => a + b, 0);
              const percent = total > 0 ? (value / total) * 100 : 0;
              return (
                <div key={element} className="flex items-center gap-2">
                  <span className="text-sm w-16" style={{ color: display.color }}>
                    {element}
                  </span>
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: display.color
                      }}
                    />
                  </div>
                  <span className="text-xs text-white/60 w-10 text-right">
                    {Math.round(percent)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Collapsible Section Component
 */
function CollapsibleSection({
  title,
  subtitle,
  isExpanded,
  onToggle,
  color,
  defaultExpanded = false,
  children
}) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const expanded = isExpanded !== undefined ? isExpanded : internalExpanded;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-white/10 overflow-hidden">
      <button
        onClick={handleToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="text-left">
          <div className="font-bold text-white">{title}</div>
          <div className="text-xs text-white/60">{subtitle}</div>
        </div>
        <div className="text-2xl" style={{ color }}>
          {expanded ? '-' : '+'}
        </div>
      </button>

      {expanded && (
        <div className="p-4 pt-0 border-t border-white/10">{children}</div>
      )}
    </div>
  );
}
