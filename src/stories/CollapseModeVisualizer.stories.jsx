import React, { useState } from 'react';
import { CollapseModeVisualizer } from '../components/qi/CollapseModeVisualizer';
import { EducationLevelToggle } from '../components/qi/EducationLevelToggle';

export default {
  title: 'Qi/CollapseModeVisualizer',
  component: CollapseModeVisualizer,
  decorators: [(Story) => <div className="max-w-md p-4 bg-slate-900"><Story /></div>],
};

const FIRE_COLLAPSE_POOL = { Wood: 2.1, Fire: 13.5, Earth: 9.0, Metal: 0.9, Water: 3.0 };
const FIRE_COLLAPSE_YS = {
  status: 'collapse_override',
  collapseMode: 'single-dominant',
  usefulElements: ['Fire', 'Earth'],
  forbidden: ['Water'],
};

export const FireCollapse = {
  args: {
    dynamicPool: FIRE_COLLAPSE_POOL,
    yongShen: FIRE_COLLAPSE_YS,
  },
};

export const DrainedChart = {
  args: {
    dynamicPool: { Wood: 8.0, Fire: 7.0, Earth: 6.5, Metal: 0.3, Water: 5.0 },
    yongShen: {
      status: 'collapse_override',
      collapseMode: 'drained',
      usefulElements: ['Earth', 'Metal'],
      forbidden: [],
    },
  },
};

export const BalancedChart = {
  args: {
    dynamicPool: { Wood: 5.5, Fire: 6.0, Earth: 5.8, Metal: 5.2, Water: 4.8 },
    yongShen: {
      status: 'balanced',
      collapseMode: null,
      usefulElements: ['Water'],
      forbidden: [],
    },
  },
};

export const BiPolarCollapse = {
  args: {
    dynamicPool: { Wood: 11.0, Fire: 1.0, Earth: 1.5, Metal: 10.5, Water: 2.0 },
    yongShen: {
      status: 'collapse_override',
      collapseMode: 'bi-polar',
      usefulElements: ['Water'],
      forbidden: ['Fire'],
    },
  },
};

// ── Education Level stories ──

export const BeginnerMode = {
  args: { dynamicPool: FIRE_COLLAPSE_POOL, yongShen: FIRE_COLLAPSE_YS, educationLevel: 'beginner' },
};

export const IntermediateMode = {
  args: { dynamicPool: FIRE_COLLAPSE_POOL, yongShen: FIRE_COLLAPSE_YS, educationLevel: 'intermediate' },
};

export const AdvancedMode = {
  args: { dynamicPool: FIRE_COLLAPSE_POOL, yongShen: FIRE_COLLAPSE_YS, educationLevel: 'advanced' },
};

export const WithEducationToggle = {
  render: () => {
    const [level, setLevel] = useState('beginner');
    return (
      <div className="space-y-4">
        <EducationLevelToggle level={level} onChange={setLevel} />
        <CollapseModeVisualizer
          dynamicPool={FIRE_COLLAPSE_POOL}
          yongShen={FIRE_COLLAPSE_YS}
          educationLevel={level}
        />
      </div>
    );
  },
};
