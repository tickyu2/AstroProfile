/**
 * EducationLevelToggle — Three-tier explanation toggle for Qi components.
 *
 * - Beginner:     plain-language explanation
 * - Intermediate: adds Qi math and ratios
 * - Advanced:     shows raw thresholds, collapse rules, classical references
 */
import React from 'react';

const LEVELS = [
  { key: 'beginner',     label: 'Beginner',     icon: '1' },
  { key: 'intermediate', label: 'Intermediate', icon: '2' },
  { key: 'advanced',     label: 'Advanced',     icon: '3' },
];

export function EducationLevelToggle({ level, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-slate-900/40 rounded-lg border border-slate-700">
      {LEVELS.map(l => (
        <button
          key={l.key}
          onClick={() => onChange(l.key)}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            level === l.key
              ? 'bg-slate-700 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

export default EducationLevelToggle;
