/**
 * Pilgrim Journey Tracker Component
 *
 * Visual progress tracker showing movement through cathedral chambers.
 * Displays past, current, and upcoming journey steps.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import React, { useMemo } from 'react';

// ========================================
// JOURNEY STEPS DATA
// ========================================

const JOURNEY_STEPS = [
  {
    id: 'gate-of-accord',
    label: 'Gate of Accord',
    description: 'Moments of clear alignment where paths converge.',
    icon: '\u{1F315}', // Full Moon
    outcome: 'DoNow',
    colorClass: 'text-emerald-400',
    glowClass: 'shadow-emerald-500/40'
  },
  {
    id: 'lantern-bridge',
    label: 'Lantern Bridge',
    description: 'Favorable but gentle openings, warm with possibility.',
    icon: '\u{1F316}', // Waning Gibbous
    outcome: 'GoodWindow',
    colorClass: 'text-amber-400',
    glowClass: 'shadow-amber-500/40'
  },
  {
    id: 'still-waters',
    label: 'Still Waters',
    description: 'Neutral, observational phases where intention shapes outcome.',
    icon: '\u{1F317}', // Last Quarter
    outcome: 'Neutral',
    colorClass: 'text-slate-400',
    glowClass: 'shadow-slate-500/30'
  },
  {
    id: 'narrowing-river',
    label: 'Narrowing River',
    description: 'Times that ask for patience and careful consideration.',
    icon: '\u{1F318}', // Waning Crescent
    outcome: 'Delay',
    colorClass: 'text-orange-400',
    glowClass: 'shadow-orange-500/40'
  },
  {
    id: 'veil-of-divergence',
    label: 'Veil of Divergence',
    description: 'Phases of misalignment where wisdom counsels retreat.',
    icon: '\u{1F311}', // New Moon
    outcome: 'Avoid',
    colorClass: 'text-red-400',
    glowClass: 'shadow-red-500/40'
  }
];

// Outcome to Step ID mapping
const OUTCOME_TO_STEP_ID = {
  DoNow: 'gate-of-accord',
  GoodWindow: 'lantern-bridge',
  Neutral: 'still-waters',
  Delay: 'narrowing-river',
  Avoid: 'veil-of-divergence'
};

// ========================================
// STEP COMPONENT
// ========================================

function JourneyStep({ step, status, showDescription, compact }) {
  const statusClasses = {
    passed: 'pilgrim-journey__step--passed',
    active: 'pilgrim-journey__step--active',
    upcoming: ''
  };

  const markerStatusClasses = {
    passed: 'bg-cathedral-emerald',
    active: 'bg-cathedral-gold animate-pulse',
    upcoming: 'bg-cathedral-slate-600'
  };

  return (
    <li className={`pilgrim-journey__step ${statusClasses[status]}`}>
      <div
        className={`pilgrim-journey__marker ${markerStatusClasses[status]}`}
        style={{
          boxShadow: status === 'active' ? '0 0 12px rgba(255, 215, 128, 0.7)' : undefined
        }}
      />
      <div className="pilgrim-journey__content">
        <div className={`pilgrim-journey__label ${step.colorClass}`}>
          {!compact && <span className="mr-2">{step.icon}</span>}
          {step.label}
        </div>
        {showDescription && (
          <div className="pilgrim-journey__description">
            {step.description}
          </div>
        )}
      </div>
    </li>
  );
}

// ========================================
// MAIN TRACKER COMPONENT
// ========================================

function PilgrimJourneyTracker({
  currentOutcome,
  currentStepId,
  passedStepIds = [],
  showDescriptions = true,
  showProgress = true,
  compact = false,
  vertical = true,
  className = ''
}) {
  // Resolve current step from outcome or ID
  const resolvedCurrentId = currentStepId || OUTCOME_TO_STEP_ID[currentOutcome] || 'still-waters';

  // Calculate journey progress
  const progress = useMemo(() => {
    const currentIndex = JOURNEY_STEPS.findIndex(s => s.id === resolvedCurrentId);
    const current = JOURNEY_STEPS[currentIndex];

    const passed = passedStepIds
      .map(id => JOURNEY_STEPS.find(s => s.id === id))
      .filter(Boolean);

    const upcoming = JOURNEY_STEPS.filter(
      s => s.id !== resolvedCurrentId && !passedStepIds.includes(s.id)
    );

    const totalSteps = JOURNEY_STEPS.length;
    const completedSteps = passed.length;
    const percentComplete = Math.round((completedSteps / totalSteps) * 100);

    return {
      current,
      currentIndex,
      passed,
      upcoming,
      totalSteps,
      completedSteps,
      percentComplete
    };
  }, [resolvedCurrentId, passedStepIds]);

  // Determine step status
  const getStepStatus = (step) => {
    if (step.id === resolvedCurrentId) return 'active';
    if (passedStepIds.includes(step.id)) return 'passed';
    return 'upcoming';
  };

  const containerClass = vertical
    ? 'pilgrim-journey pilgrim-journey--vertical'
    : 'pilgrim-journey pilgrim-journey--horizontal';

  return (
    <div className={`${containerClass} ${className}`}>
      {showProgress && (
        <div className="pilgrim-journey__progress">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-cathedral-slate-400">Journey Progress</span>
            <span className="text-sm font-semibold text-cathedral-gold">
              {progress.percentComplete}%
            </span>
          </div>
          <div className="h-1 bg-cathedral-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cathedral-emerald to-cathedral-gold transition-all duration-500"
              style={{ width: `${progress.percentComplete}%` }}
            />
          </div>
        </div>
      )}

      <ol className="pilgrim-journey__steps">
        {JOURNEY_STEPS.map((step) => (
          <JourneyStep
            key={step.id}
            step={step}
            status={getStepStatus(step)}
            showDescription={showDescriptions}
            compact={compact}
          />
        ))}
      </ol>

      {progress.current && (
        <div className="pilgrim-journey__current-narrative">
          <p className="text-sm italic text-cathedral-slate-400">
            You stand at <span className={progress.current.colorClass}>{progress.current.label}</span>
            {progress.passed.length > 0 && (
              <>, having passed through {progress.passed.map(p => p.label).join(', ')}</>
            )}
            .
          </p>
        </div>
      )}
    </div>
  );
}

// ========================================
// MINI TRACKER (Compact version)
// ========================================

export function PilgrimJourneyMini({ currentOutcome, className = '' }) {
  const stepId = OUTCOME_TO_STEP_ID[currentOutcome] || 'still-waters';
  const step = JOURNEY_STEPS.find(s => s.id === stepId);

  if (!step) return null;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="text-lg">{step.icon}</span>
      <span className={`font-medium ${step.colorClass}`}>{step.label}</span>
    </div>
  );
}

// ========================================
// CHAMBER INFO COMPONENT
// ========================================

const CHAMBER_METADATA = {
  'gate-of-accord': {
    name: 'The Gate of Immediate Accord',
    element: 'fire',
    direction: 'east',
    purpose: 'Convergence and clear action',
    ritualHour: 'Dawn'
  },
  'lantern-bridge': {
    name: 'The Lantern Bridge',
    element: 'air',
    direction: 'south',
    purpose: 'Gentle opening and possibility',
    ritualHour: 'Morning'
  },
  'still-waters': {
    name: 'The Hall of Still Waters',
    element: 'water',
    direction: 'center',
    purpose: 'Observation and reflection',
    ritualHour: 'Noon'
  },
  'narrowing-river': {
    name: 'The Narrowing River',
    element: 'earth',
    direction: 'west',
    purpose: 'Patience and discernment',
    ritualHour: 'Dusk'
  },
  'veil-of-divergence': {
    name: 'The Veil of Divergence',
    element: 'spirit',
    direction: 'north',
    purpose: 'Protection and retreat',
    ritualHour: 'Midnight'
  }
};

const ELEMENT_ICONS = {
  fire: '\u{1F525}',
  air: '\u{1F4A8}',
  water: '\u{1F4A7}',
  earth: '\u{1F33F}',
  spirit: '\u{2728}'
};

const DIRECTION_ICONS = {
  north: '\u{2B06}\u{FE0F}',
  south: '\u{2B07}\u{FE0F}',
  east: '\u{27A1}\u{FE0F}',
  west: '\u{2B05}\u{FE0F}',
  center: '\u{1F4CD}'
};

export function ChamberInfo({ stepId, currentOutcome, className = '' }) {
  const resolvedId = stepId || OUTCOME_TO_STEP_ID[currentOutcome] || 'still-waters';
  const chamber = CHAMBER_METADATA[resolvedId];
  const step = JOURNEY_STEPS.find(s => s.id === resolvedId);

  if (!chamber || !step) return null;

  return (
    <div className={`chamber-info p-4 bg-black/30 rounded-lg border-l-3 border-cathedral-gold ${className}`}>
      <h4 className={`font-semibold text-lg ${step.colorClass}`}>
        {step.icon} {chamber.name}
      </h4>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <span>{ELEMENT_ICONS[chamber.element]}</span>
          <span className="text-cathedral-slate-400">Element:</span>
          <span className="text-white capitalize">{chamber.element}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{DIRECTION_ICONS[chamber.direction]}</span>
          <span className="text-cathedral-slate-400">Direction:</span>
          <span className="text-white capitalize">{chamber.direction}</span>
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <span className="text-cathedral-slate-400">Purpose:</span>
          <span className="text-white">{chamber.purpose}</span>
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <span className="text-cathedral-slate-400">Ritual Hour:</span>
          <span className="text-cathedral-amber">{chamber.ritualHour}</span>
        </div>
      </div>
    </div>
  );
}

// ========================================
// EXPORTS
// ========================================

export { JOURNEY_STEPS, OUTCOME_TO_STEP_ID, CHAMBER_METADATA };
export default PilgrimJourneyTracker;
