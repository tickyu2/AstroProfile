/**
 * Pilgrim Journey Stage Component
 *
 * Renders a Greene individuation stage with its mythic narrative script.
 * Displays the full ritual pattern:
 * - Threshold Invocation
 * - Chamber Atmosphere
 * - Archetypal Encounter
 * - Trial / Task
 * - Integration Gesture
 * - Closing Benediction
 *
 * Uses the Cathedral's visual style with element-based theming.
 *
 * GENESIS AstroProfile - January 2026
 */

import React from "react";
import { PILGRIM_JOURNEY_SCRIPTS } from "../../data/pilgrimJourneyScripts";
import { PILGRIM_CHAMBERS } from "../../utils/pilgrimJourneyMapper";

// ═══════════════════════════════════════════════════════════════════════════
// SECTION STYLING
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_STYLES = {
  "Threshold Invocation": {
    bg: "from-purple-900/40 to-indigo-900/40",
    border: "border-purple-500/40",
    iconColor: "text-purple-300"
  },
  "Chamber Atmosphere": {
    bg: "from-slate-800/50 to-slate-900/50",
    border: "border-slate-600/40",
    iconColor: "text-slate-300"
  },
  "Archetypal Encounter": {
    bg: "from-amber-900/30 to-orange-900/30",
    border: "border-amber-500/40",
    iconColor: "text-amber-300"
  },
  "Trial / Task": {
    bg: "from-red-900/30 to-rose-900/30",
    border: "border-red-500/40",
    iconColor: "text-red-300"
  },
  "Integration Gesture": {
    bg: "from-green-900/30 to-emerald-900/30",
    border: "border-green-500/40",
    iconColor: "text-green-300"
  },
  "Closing Benediction": {
    bg: "from-indigo-900/40 to-purple-900/40",
    border: "border-indigo-500/40",
    iconColor: "text-indigo-300"
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function PilgrimJourneyStage({ stageId, compact = false }) {
  const script = PILGRIM_JOURNEY_SCRIPTS[stageId];

  if (!script) {
    return (
      <div className="p-6 bg-slate-800/30 rounded-xl border border-red-500/30">
        <p className="text-red-300">
          Unknown stage: <span className="font-semibold">{stageId}</span>
        </p>
      </div>
    );
  }

  const chamber = PILGRIM_CHAMBERS[script.pilgrimChamber];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-3xl">{chamber?.symbol || "⟡"}</span>
          <h2 className="text-2xl font-light text-white">
            {script.label}
          </h2>
        </div>
        <p className="text-purple-400 italic">
          {script.subtitle}
        </p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="text-xs px-2 py-1 rounded bg-purple-900/40 text-purple-300 border border-purple-500/30">
            {chamber?.name || script.pilgrimChamber}
          </span>
        </div>
      </div>

      {/* Narrative Sections */}
      <div className={`space-y-${compact ? '3' : '4'}`}>
        {script.sections.map((section, idx) => {
          const style = SECTION_STYLES[section.title] || SECTION_STYLES["Chamber Atmosphere"];

          return (
            <div
              key={idx}
              className={`
                bg-gradient-to-r ${style.bg}
                border ${style.border}
                rounded-xl ${compact ? 'p-4' : 'p-5'}
                transition-all duration-300
                hover:scale-[1.01]
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xl ${style.iconColor}`}>
                  {section.icon}
                </span>
                <h3 className={`text-sm uppercase tracking-wider font-medium ${style.iconColor}`}>
                  {section.title}
                </h3>
              </div>
              <p className={`text-slate-300 leading-relaxed ${compact ? 'text-sm' : ''}`}>
                {section.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MINI CARD COMPONENT
// For progress indicators and navigation
// ═══════════════════════════════════════════════════════════════════════════

export function PilgrimStageCard({ stageId, isActive = false, onClick }) {
  const script = PILGRIM_JOURNEY_SCRIPTS[stageId];
  const chamber = script ? PILGRIM_CHAMBERS[script.pilgrimChamber] : null;

  if (!script) return null;

  return (
    <button
      onClick={onClick}
      className={`
        p-3 rounded-lg border transition-all text-left
        ${isActive
          ? 'bg-purple-900/50 border-purple-500/50 text-white'
          : 'bg-slate-800/30 border-slate-700/40 text-slate-400 hover:bg-slate-700/30 hover:text-white'
        }
      `}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{chamber?.symbol || "⟡"}</span>
        <div>
          <p className="text-sm font-medium">{script.label}</p>
          <p className="text-xs opacity-70">{chamber?.name}</p>
        </div>
      </div>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// JOURNEY PROGRESS BAR
// ═══════════════════════════════════════════════════════════════════════════

export function PilgrimJourneyProgress({ currentStageId }) {
  const stageOrder = [
    'egoFormation', 'shadowEmergence', 'animaAnimus', 'complexConfrontation',
    'underworldDescent', 'encounterSelf', 'reintegration', 'individuatedLife'
  ];

  const currentIndex = stageOrder.indexOf(currentStageId);

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / stageOrder.length) * 100}%` }}
        />
      </div>

      {/* Stage Indicators */}
      <div className="flex justify-between">
        {stageOrder.map((stageId, idx) => {
          const script = PILGRIM_JOURNEY_SCRIPTS[stageId];
          const chamber = PILGRIM_CHAMBERS[script?.pilgrimChamber];
          const isPast = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div
              key={stageId}
              className={`
                text-center transition-all
                ${isCurrent ? 'scale-110' : ''}
              `}
              title={script?.label}
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm
                  ${isCurrent
                    ? 'bg-purple-600 text-white'
                    : isPast
                      ? 'bg-purple-900/50 text-purple-300'
                      : 'bg-slate-800 text-slate-500'
                  }
                `}
              >
                {chamber?.symbol || (idx + 1)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
