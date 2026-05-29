/**
 * EducationModeWrapper — Hover-overlay that shows explanations, Qi math,
 * and element logic directly on top of components.
 */
import React from 'react';

export function EducationModeWrapper({ title, description, children }) {
  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition pointer-events-none">
        <div className="p-3 max-w-xs text-sm bg-slate-800 text-slate-200 rounded-lg shadow-xl border border-slate-700">
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-slate-400 text-xs">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default EducationModeWrapper;
