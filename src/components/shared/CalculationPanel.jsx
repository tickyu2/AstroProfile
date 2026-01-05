/**
 * CALCULATION PANEL
 *
 * Transparent mathematical display component
 * "No black boxes. Pure mathematical transparency."
 *
 * Shows step-by-step calculations so users can:
 * - See exactly how numbers are derived
 * - Verify with external tools
 * - Trust the accuracy of GENESIS
 */

import React, { useState } from 'react';

function CalculationPanel({
  title,
  steps,
  verifyLinks,
  defaultExpanded = false,
  className = ''
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (!steps || steps.length === 0) return null;

  return (
    <div className={`bg-slate-800/50 border border-slate-600/50 rounded-xl overflow-hidden ${className}`}>
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-amber-400">📐</span>
          <span className="text-sm font-medium text-slate-300">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Show math</span>
          <span className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {/* Expandable content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-700/50">
          {/* Calculation Steps */}
          <div className="mt-4 space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="grid grid-cols-[140px_1fr] gap-3 items-start">
                <div className="text-sm text-slate-400 font-medium">
                  {step.label}:
                </div>
                <div className="flex flex-col gap-1">
                  {step.value && (
                    <span className="text-white font-semibold">{step.value}</span>
                  )}
                  {step.calc && (
                    <code className="bg-slate-900/60 px-2 py-1 rounded text-green-400 font-mono text-sm inline-block">
                      {step.calc}
                    </code>
                  )}
                  {step.note && (
                    <span className="text-xs text-slate-500 italic">({step.note})</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Verification Links */}
          {verifyLinks && verifyLinks.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-700/50">
              <h5 className="text-amber-400 text-sm font-medium mb-2">
                Verify This Calculation:
              </h5>
              <p className="text-slate-400 text-xs mb-3">
                Check your numbers on these trusted sites:
              </p>
              <div className="flex flex-wrap gap-2">
                {verifyLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-900/30 border border-blue-500/30 rounded-lg text-blue-400 text-xs font-medium hover:bg-blue-900/50 hover:border-blue-500/50 transition-all"
                  >
                    {link.name} ↗
                  </a>
                ))}
              </div>

              {/* Transparency Note */}
              <div className="mt-4 p-3 bg-amber-900/20 border-l-3 border-amber-500 rounded-r-lg">
                <p className="text-sm text-slate-300">
                  <strong className="text-amber-400">GENESIS shows our work. Always.</strong>
                  <br />
                  <span className="text-slate-400 text-xs">
                    No black boxes. Pure mathematical transparency.
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Life Path Calculation Panel
 * Pre-configured for Life Path number display
 */
export function LifePathCalculationPanel({ birthDate, lifePath, className = '' }) {
  if (!birthDate) return null;

  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  // Calculate step by step
  const sum = month + day + year;
  const reductionSteps = getReductionStepsForDisplay(sum);

  const steps = [
    {
      label: "Birth Date",
      value: `${getMonthName(month)} ${day}, ${year}`
    },
    {
      label: "Add all digits",
      calc: `${month} + ${day} + ${year} = ${sum}`
    },
    ...reductionSteps.map((step, i) => ({
      label: i === 0 ? "Reduce" : "Continue",
      calc: step
    })),
    {
      label: "Life Path",
      value: `${lifePath} ✓`,
      note: getMasterNumberNote(lifePath)
    }
  ];

  return (
    <CalculationPanel
      title={`Life Path ${lifePath} Calculation`}
      steps={steps}
      verifyLinks={[
        { name: "Astro-Seek", url: "https://www.astro-seek.com/calculate-your-numerology" },
        { name: "Numerologist.com", url: "https://www.numerologist.com/numerology/life-path-number" }
      ]}
      className={className}
    />
  );
}

/**
 * Personal Year Calculation Panel
 * Shows birthday-to-birthday accuracy
 */
export function PersonalYearCalculationPanel({
  birthMonth,
  birthDay,
  yearToUse,
  personalYear,
  birthdayPassed,
  className = ''
}) {
  const sum = birthMonth + birthDay + yearToUse;
  const reductionSteps = getReductionStepsForDisplay(sum);
  const currentYear = new Date().getFullYear();

  const steps = [
    {
      label: "Birth Date",
      value: `${getMonthName(birthMonth)} ${birthDay}`
    },
    {
      label: "Current Date",
      value: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    },
    {
      label: "Birthday Status",
      value: birthdayPassed ? "✓ Birthday has passed this year" : "✗ Birthday hasn't occurred yet",
      note: birthdayPassed ? "Using current year" : "Using previous year"
    },
    {
      label: "Year to Use",
      value: yearToUse.toString(),
      note: yearToUse !== currentYear
        ? "Using previous year because birthday hasn't passed"
        : "Using current year because birthday has passed"
    },
    {
      label: "Add Month + Day + Year",
      calc: `${birthMonth} + ${birthDay} + ${yearToUse} = ${sum}`
    },
    ...reductionSteps.map((step, i) => ({
      label: i === 0 ? "Reduce" : "Continue",
      calc: step
    })),
    {
      label: "Personal Year",
      value: `${personalYear} ✓`
    }
  ];

  return (
    <CalculationPanel
      title={`Personal Year ${personalYear} Calculation`}
      steps={steps}
      verifyLinks={[
        { name: "Astro-Seek", url: "https://www.astro-seek.com/numerology-personal-year" },
        { name: "Cafe Astrology", url: "https://cafeastrology.com/personalnumbers.html" }
      ]}
      className={className}
    />
  );
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getReductionStepsForDisplay(sum) {
  const steps = [];
  let current = sum;

  while (current > 9 && current !== 11 && current !== 22 && current !== 33) {
    const digits = current.toString().split('').map(Number);
    const next = digits.reduce((a, b) => a + b, 0);
    steps.push(`${digits.join(' + ')} = ${next}`);
    current = next;
  }

  return steps;
}

function getMonthName(month) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1] || '';
}

function getMasterNumberNote(num) {
  if (num === 11) return "Master Number 11 - The Intuitive";
  if (num === 22) return "Master Number 22 - The Master Builder";
  if (num === 33) return "Master Number 33 - The Master Teacher";
  return null;
}

export default CalculationPanel;
