import React, { useState } from 'react';
import { EducationLevelToggle } from '../components/qi/EducationLevelToggle';

export default {
  title: 'Qi/EducationLevelToggle',
  component: EducationLevelToggle,
  decorators: [(Story) => <div className="max-w-sm p-4 bg-slate-900"><Story /></div>],
};

export const Default = {
  render: () => {
    const [level, setLevel] = useState('beginner');
    return (
      <div className="space-y-4">
        <EducationLevelToggle level={level} onChange={setLevel} />
        <div className="text-sm text-white/60">
          Current level: <span className="text-white font-semibold">{level}</span>
        </div>
      </div>
    );
  },
};

export const BeginnerSelected = {
  args: { level: 'beginner', onChange: () => {} },
};

export const IntermediateSelected = {
  args: { level: 'intermediate', onChange: () => {} },
};

export const AdvancedSelected = {
  args: { level: 'advanced', onChange: () => {} },
};
