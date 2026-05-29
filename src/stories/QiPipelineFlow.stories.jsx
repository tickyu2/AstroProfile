import React, { useState } from 'react';
import { QiPipelineFlow } from '../components/qi/QiPipelineFlow';

export default {
  title: 'Qi/QiPipelineFlow',
  component: QiPipelineFlow,
  parameters: { layout: 'fullscreen' },
};

export const Default = {
  render: () => <QiPipelineFlow className="h-screen" />,
};

export const EducationMode = {
  render: () => <QiPipelineFlow className="h-screen" educationMode />,
};

export const ToggleEducation = {
  render: () => {
    const [edu, setEdu] = useState(false);
    return (
      <div className="h-screen flex flex-col">
        <div className="p-3 bg-slate-800 flex items-center gap-3">
          <button
            onClick={() => setEdu(!edu)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              edu ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-700 text-white/50'
            }`}
          >
            {edu ? 'Education Mode ON' : 'Education Mode OFF'}
          </button>
          <span className="text-[10px] text-white/30">
            {edu ? 'Hover nodes for tooltips. Animated Qi particles flow along edges.' : 'Standard diagram with dashed animated edges.'}
          </span>
        </div>
        <QiPipelineFlow className="flex-1" educationMode={edu} />
      </div>
    );
  },
};
